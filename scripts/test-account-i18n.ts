import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

import { PGlite } from "@electric-sql/pglite";
import { getTableConfig } from "drizzle-orm/pg-core";

import { buildAccountProducerHrefForPolicy } from "../lib/accounts/catalog-link-policy";
import { buildActiveProducerAccessLookup } from "../lib/accounts/producer-access";
import { claimSubmissionSchema, producerKeySchema } from "../lib/accounts/input";
import {
  readProducerProposalForm,
  safeReturnPath,
} from "../lib/accounts/producer-fields";
import {
  buildApplicationProducerHref,
  buildProducerHref,
} from "../lib/catalog-navigation";
import { buildAdminProducerPublicPath } from "../lib/admin/producer-change-requests";
import { favorites, producerClaims, producerMemberships } from "../lib/db/schema";
import { parseCatalogScope } from "../lib/i18n/catalog-scope";
import { loadMessages } from "../lib/i18n/messages";
import { presentProducerField } from "../lib/i18n/producer-fields";

const japan = { slug: "jp", defaultLocale: "ja" as const };
const tokyo = { slug: "tokyo", publishedLocales: ["ja", "en"] as const };
const producer = {
  slug: "sample-producer",
  country: "jp",
  area: "tokyo",
};

function producerIdentityFromHref(href: string, producerId: number) {
  const url = new URL(href, "https://chisan.invalid");
  const [catalogSegment = "", area = "", slug = ""] = url.pathname
    .split("/")
    .filter(Boolean);
  const scope = parseCatalogScope(catalogSegment, [japan]);
  assert.ok(scope, `Expected a catalog scope in ${href}`);
  return producerKeySchema.parse({
    country: scope.country,
    producerId,
    locale: scope.locale,
    catalogSegment,
    area,
    slug,
  });
}

function indexColumnNames(
  config: ReturnType<typeof getTableConfig>,
  indexName: string,
): string[] {
  const index = config.indexes.find(({ config: indexConfig }) => indexConfig.name === indexName);
  assert.ok(index, `Expected schema index ${indexName}`);
  assert.equal(index.config.unique, true, `${indexName} must remain unique`);
  return index.config.columns.map((column) => {
    const columnName = "name" in column ? column.name : undefined;
    if (typeof columnName !== "string") {
      assert.fail(`${indexName} must contain only named columns`);
    }
    return columnName;
  });
}

async function applyAccountMigrations(database: PGlite): Promise<void> {
  const migrationFiles = (await readdir("drizzle"))
    .filter((file) => /^\d{4}_.+\.sql$/.test(file))
    .sort();

  await database.exec("begin");
  try {
    for (const migrationFile of migrationFiles) {
      await database.exec(await readFile(`drizzle/${migrationFile}`, "utf8"));
    }
    await database.exec("commit");
  } catch (error) {
    await database.exec("rollback");
    throw error;
  }
}

test("account links honor only an explicitly published area locale", () => {
  assert.equal(
    buildAccountProducerHrefForPolicy(producer, {
      country: japan,
      localePolicy: tokyo,
      explicitLocale: "en",
    }),
    "/en-jp/tokyo/sample-producer",
  );
  assert.equal(
    buildAccountProducerHrefForPolicy(producer, {
      country: japan,
      localePolicy: tokyo,
      explicitLocale: "de",
    }),
    "/jp/tokyo/sample-producer",
  );
  assert.throws(
    () =>
      buildAccountProducerHrefForPolicy(producer, {
        country: japan,
        localePolicy: { slug: "tokyo", publishedLocales: ["en"] },
        explicitLocale: null,
      }),
    /must publish the country default locale 'ja'/i,
  );
  assert.throws(
    () =>
      buildAccountProducerHrefForPolicy(producer, {
        country: japan,
        localePolicy: { slug: "tokyo", publishedLocales: [] },
        explicitLocale: null,
      }),
    /must publish the country default locale 'ja'/i,
  );
  assert.equal(
    buildAccountProducerHrefForPolicy(producer, {
      country: japan,
      localePolicy: tokyo,
      explicitLocale: null,
    }),
    "/jp/tokyo/sample-producer",
  );
  assert.throws(
    () =>
      buildAccountProducerHrefForPolicy(
        { ...producer, area: "osaka" },
        { country: japan, localePolicy: tokyo, explicitLocale: "en" },
      ),
    /area does not match/i,
  );
  assert.equal(
    buildAdminProducerPublicPath(producer),
    "/jp/tokyo/sample-producer",
  );
});

test("short and composite routes produce the same validated account and claim target", () => {
  const shortHref = buildProducerHref(producer, {
    scope: {
      country: "jp",
      pathPrefix: "/jp",
    },
    area: "tokyo",
  });
  const compositeHref = buildApplicationProducerHref(producer, {
    country: japan,
    localePolicy: tokyo,
    explicitLocale: "en",
  });
  const producerId = 42;
  const shortIdentity = producerIdentityFromHref(shortHref, producerId);
  const compositeIdentity = producerIdentityFromHref(compositeHref, producerId);

  assert.equal(shortHref, "/jp/tokyo/sample-producer");
  assert.equal(compositeHref, "/en-jp/tokyo/sample-producer");
  assert.deepEqual(shortIdentity, { country: "jp", producerId });
  assert.deepEqual(compositeIdentity, shortIdentity);

  const claimFields = {
    method: "website" as const,
    contactEmail: "owner@example.test",
    proof: "The public website identifies this account as the producer owner.",
  };
  const shortClaim = claimSubmissionSchema.parse({ ...shortIdentity, ...claimFields });
  const compositeClaim = claimSubmissionSchema.parse({
    ...compositeIdentity,
    ...claimFields,
  });
  assert.deepEqual(
    { country: compositeClaim.country, producerId: compositeClaim.producerId },
    { country: shortClaim.country, producerId: shortClaim.producerId },
  );
});

test("account schema deduplicates presentation variants on durable producer keys", () => {
  const favoriteConfig = getTableConfig(favorites);
  const claimConfig = getTableConfig(producerClaims);
  const membershipConfig = getTableConfig(producerMemberships);

  assert.deepEqual(
    favoriteConfig.primaryKeys.map(({ columns }) =>
      columns.map((column) => column.name),
    ),
    [["user_id", "country", "producer_id"]],
  );
  assert.deepEqual(
    indexColumnNames(claimConfig, "producer_claims_open_claimant_producer_uidx"),
    ["claimant_user_id", "country", "producer_id"],
  );
  assert.deepEqual(
    indexColumnNames(claimConfig, "producer_claims_approved_producer_uidx"),
    ["country", "producer_id"],
  );
  assert.deepEqual(
    indexColumnNames(
      membershipConfig,
      "producer_memberships_active_user_producer_uidx",
    ),
    ["user_id", "country", "producer_id"],
  );
  assert.deepEqual(
    indexColumnNames(
      membershipConfig,
      "producer_memberships_active_owner_producer_uidx",
    ),
    ["country", "producer_id"],
  );

  for (const config of [favoriteConfig, claimConfig, membershipConfig]) {
    const columnNames = config.columns.map((column) => column.name);
    assert.equal(columnNames.includes("locale"), false);
    assert.equal(columnNames.includes("catalog_scope"), false);
    assert.equal(columnNames.includes("area"), false);
    assert.equal(columnNames.includes("slug"), false);
  }
});

test("active membership authorization lookup is independent of route locale", () => {
  const shortIdentity = producerIdentityFromHref(
    "/jp/tokyo/sample-producer",
    42,
  );
  const compositeIdentity = producerIdentityFromHref(
    "/en-jp/tokyo/sample-producer",
    42,
  );
  const shortLookup = buildActiveProducerAccessLookup("user-1", shortIdentity);
  const compositeLookup = buildActiveProducerAccessLookup(
    "user-1",
    compositeIdentity,
  );

  assert.deepEqual(shortLookup, {
    userId: "user-1",
    country: "jp",
    producerId: 42,
    status: "active",
  });
  assert.deepEqual(compositeLookup, shortLookup);
  assert.deepEqual(Object.keys(compositeLookup), [
    "userId",
    "country",
    "producerId",
    "status",
  ]);
});

test("localized routes share database favorite, claim, and membership identity", async () => {
  const shortIdentity = producerIdentityFromHref(
    "/jp/tokyo/sample-producer",
    42,
  );
  const compositeIdentity = producerIdentityFromHref(
    "/en-jp/tokyo/sample-producer",
    42,
  );
  const database = new PGlite();

  try {
    await applyAccountMigrations(database);
    const [account] = (
      await database.query<{ id: string }>(
        `insert into users (display_name)
         values ('Localized route account')
         returning id`,
      )
    ).rows;

    await database.query(
      `insert into favorites (user_id, country, producer_id)
       values ($1, $2, $3)`,
      [account.id, shortIdentity.country, shortIdentity.producerId],
    );
    const duplicateFavorite = await database.query<{ producer_id: number }>(
      `insert into favorites (user_id, country, producer_id)
       values ($1, $2, $3)
       on conflict do nothing
       returning producer_id`,
      [account.id, compositeIdentity.country, compositeIdentity.producerId],
    );
    assert.deepEqual(duplicateFavorite.rows, []);

    await database.query(
      `insert into producer_claims (
         claimant_user_id, country, producer_id, proof_method,
         proof, claimant_message, status, submitted_at
       )
       values ($1, $2, $3, 'website',
               '{"url":"https://owner.example.test"}'::jsonb,
               'Public ownership evidence', 'pending', now())`,
      [account.id, shortIdentity.country, shortIdentity.producerId],
    );
    const duplicateClaim = await database.query<{ id: string }>(
      `insert into producer_claims (
         claimant_user_id, country, producer_id, proof_method,
         proof, claimant_message, status, submitted_at
       )
       values ($1, $2, $3, 'website',
               '{"url":"https://owner.example.test"}'::jsonb,
               'Duplicate localized route evidence', 'pending', now())
       on conflict do nothing
       returning id`,
      [account.id, compositeIdentity.country, compositeIdentity.producerId],
    );
    assert.deepEqual(duplicateClaim.rows, []);

    const [membership] = (
      await database.query<{ id: string }>(
        `insert into producer_memberships (
           user_id, country, producer_id, role, status
         )
         values ($1, $2, $3, 'owner', 'active')
         returning id`,
        [account.id, shortIdentity.country, shortIdentity.producerId],
      )
    ).rows;

    for (const identity of [shortIdentity, compositeIdentity]) {
      const lookup = buildActiveProducerAccessLookup(account.id, identity);
      const authorizedMembership = await database.query<{
        id: string;
        role: string;
      }>(
        `select id, role::text as role
           from producer_memberships
          where user_id = $1
            and country = $2
            and producer_id = $3
            and status = $4`,
        [lookup.userId, lookup.country, lookup.producerId, lookup.status],
      );
      assert.deepEqual(authorizedMembership.rows, [
        { id: membership.id, role: "owner" },
      ]);
    }

    const sharedRecords = await database.query<{
      claim_count: number;
      favorite_count: number;
    }>(
      `select
         (select count(*)::integer
            from favorites
           where user_id = $1 and country = $2 and producer_id = $3)
           as favorite_count,
         (select count(*)::integer
            from producer_claims
           where claimant_user_id = $1 and country = $2 and producer_id = $3)
           as claim_count`,
      [account.id, compositeIdentity.country, compositeIdentity.producerId],
    );
    assert.deepEqual(sharedRecords.rows, [{ favorite_count: 1, claim_count: 1 }]);
  } finally {
    await database.close();
  }
});

test("a valid composite producer returnTo is preserved and external paths are rejected", () => {
  const compositeReturnTo = buildProducerHref(producer, {
    scope: {
      country: "jp",
      pathPrefix: "/en-jp",
    },
    area: "tokyo",
    category: "Aceite",
    highlight: producer.slug,
  });

  assert.equal(
    safeReturnPath(compositeReturnTo, "/cuenta"),
    "/en-jp/tokyo/sample-producer?category=Aceite&highlight=sample-producer",
  );
  assert.equal(safeReturnPath("https://attacker.example/en-jp", "/cuenta"), "/cuenta");
  assert.equal(safeReturnPath("//attacker.example/en-jp", "/cuenta"), "/cuenta");
});

test("localized owner controls retain canonical tokens in submitted proposals", async () => {
  const messages = await loadMessages("de");
  const category = presentProducerField("categoria", "Aceite", "de", messages);
  const onlineSales = presentProducerField("Venta online", "sí", "de", messages);
  const channels = presentProducerField(
    "Canal de venta",
    "ecommerce|telefono",
    "de",
    messages,
  );

  assert.deepEqual(
    [category.displayValue, onlineSales.displayValue, channels.displayValue],
    ["Öl", "Ja", "Onlineshop und Telefon"],
  );
  assert.deepEqual(
    [category.value, onlineSales.value, channels.value],
    ["Aceite", "sí", "ecommerce|telefono"],
  );

  const form = new FormData();
  form.set("nombre", "Sample producer");
  form.set("municipio", "Tokyo");
  form.set("categoria", category.value);
  form.set("descripcion", "Produces oil.");
  form.set("descripcion_locale", "en");
  form.set("Venta online", onlineSales.value);
  form.append("Canal de venta", "ecommerce");
  form.append("Canal de venta", "telefono");
  const proposal = readProducerProposalForm(form);

  assert.equal(proposal.categoria, "Aceite");
  assert.equal(proposal["Venta online"], "sí");
  assert.equal(proposal["Canal de venta"], "ecommerce|telefono");
  assert.equal(proposal.descripcion_locale, "en");
});
