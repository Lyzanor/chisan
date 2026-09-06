import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import { findProducerById } from "../lib/csv-catalog";
import { loadProducerContent } from "../lib/catalog/content";
import { hashProducerContent } from "../lib/accounts/producer-content-change";
import {
  hashProducerFields,
  PRODUCER_EDITABLE_FIELDS,
} from "../lib/accounts/producer-fields";
import type { ProducerChangeFormState } from "../app/(application)/cuenta/actions/changes";

test("owner drafts, review and v2 publication preserve products and enforce exact permissions", async () => {
  const pg = new PGlite();
  const db = drizzle(pg, { schema });
  const oldMaintenance = process.env.CHISAN_PRODUCER_CHANGES_ENABLED;
  process.env.CHISAN_PRODUCER_CHANGES_ENABLED = "true";
  try {
    for (const file of (await readdir("drizzle"))
      .filter((name) => /^\d{4}_.+\.sql$/.test(name))
      .sort())
      await pg.exec(await readFile(`drizzle/${file}`, "utf8"));
    const [owner, reviewer, other] = await db
      .insert(schema.users)
      .values([
        { displayName: "Product owner test" },
        { displayName: "Product reviewer test" },
        { displayName: "Other owner test" },
      ])
      .returning();
    let actingOwner = owner.id;
    const redirect = (path: string, kind: string, message: string): never => {
      const url = new URL(path, "https://chisan.invalid");
      url.searchParams.set(kind, message);
      throw new Error(`REDIRECT:${url.pathname}${url.search}`);
    };
    const database = db as unknown as import("../lib/db").Database;
    await db
      .insert(schema.producerMemberships)
      .values({
        userId: owner.id,
        country: "es",
        producerId: 12439,
        role: "owner",
      });
    const producer = await findProducerById("es", 12439);
    assert.ok(producer);
    const content = await loadProducerContent("es", 12439);
    const products = [
      ...content.products,
      {
        id: "workflow-test",
        name: "Queso de prueba",
        description: "Producto ficticio para las pruebas aisladas.",
        locale: "es",
        media_ids: [],
        link_ids: [],
      },
    ];
    const empty: ProducerChangeFormState = {
      fieldErrors: {},
      formError: null,
      reloadRequired: false,
      revision: 0,
      values: {},
    };
    function form(state = empty, intent = "draft") {
      const result = new FormData();
      for (const field of PRODUCER_EDITABLE_FIELDS) {
        const value = producer!.fields[field.key] ?? "";
        if (field.kind === "categories" || field.kind === "sales-channels")
          value
            .split("|")
            .filter(Boolean)
            .forEach((item) => result.append(field.key, item));
        else result.set(field.key, value);
      }
      Object.entries({
        country: "es",
        producerId: "12439",
        baseRowHash: hashProducerFields(producer!.fields),
        baseContentHash: hashProducerContent(content),
        products: JSON.stringify(products),
        intent,
        draftId: state.draftId ?? "",
        draftVersion: String(state.draftVersion ?? ""),
        authorNote:
          intent === "draft"
            ? ""
            : "Isolated product test. Public source: https://example.org/product.",
      }).forEach(([key, value]) => result.set(key, value));
      return result;
    }
    const { createProducerChangeSubmissionService } = await import(
      "../lib/accounts/producer-change-submission"
    );
    const save = createProducerChangeSubmissionService({
      getDatabase: () => database,
      requireCurrentAccount: async () => ({ id: actingOwner }),
      hasProducerAccess: async () => true,
      hasActiveProducerPremiumEntitlement: async () =>
        Boolean(
          (
            await pg.query(
              "select id from entitlements where producer_country = 'es' and producer_id = 12439 and status = 'active' and revoked_at is null",
            )
          ).rows.length,
        ),
      redirectWithMessage: redirect,
      revalidatePath: () => {},
    });
    assert.equal(
      (await save(empty, form())).reloadRequired,
      true,
      "membership alone does not grant product editing",
    );
    const [entitlement] = await db
      .insert(schema.entitlements)
      .values({
        subjectKind: "producer",
        producerCountry: "es",
        producerId: 12439,
        key: "producer.profile.premium",
        status: "active",
        source: "test",
      })
      .returning();
    const invalid = form();
    invalid.set("products", JSON.stringify([{ ...products[0], name: "" }]));
    const invalidResult = await save(empty, invalid);
    assert.ok(invalidResult.fieldErrors.products);
    assert.equal(
      invalidResult.values.products,
      invalid.get("products"),
      "invalid input survives the response",
    );
    const staleContent = form();
    staleContent.set("baseContentHash", "a".repeat(64));
    assert.equal((await save(empty, staleContent)).reloadRequired, true);
    const first = await save(empty, form());
    assert.ok(first.draftId, first.formError ?? "draft id missing");
    const second = await save(first, form(first));
    assert.equal(second.draftVersion, first.draftVersion! + 1);
    assert.equal(
      (await save(first, form(first))).reloadRequired,
      true,
      "an older browser cannot overwrite a saved draft",
    );
    actingOwner = other.id;
    await assert.rejects(
      save(second, form(second)),
      /REDIRECT:.*editar\?error=/,
      "transaction rechecks membership even after the page guard",
    );
    actingOwner = owner.id;
    await assert.rejects(
      save(second, form(second, "submit")),
      /REDIRECT:.*Cambios\+enviados/,
    );
    const [submitted] = await db
      .select()
      .from(schema.producerChangeRequests)
      .where(eq(schema.producerChangeRequests.id, first.draftId));
    assert.equal(submitted.status, "submitted");
    assert.deepEqual(submitted.patch, {});
    assert.equal(
      submitted.contentChange?.products.at(-1)?.name,
      "Queso de prueba",
    );
    assert.equal(submitted.requiredEntitlementKey, "producer.profile.premium");
    await assert.rejects(
      pg.query(
        "update producer_change_requests set content_change = null where id = $1",
        [submitted.id],
      ),
      /immutable/i,
    );

    // Review uses the deployed action, not a test-only permission shortcut for the proposal.
    const { createProducerChangeReviewService } = await import(
      "../lib/admin/review-producer-change"
    );
    const reviewProducerChangeAction = createProducerChangeReviewService({
      getDatabase: () => database,
      requireStaffAccount: async () => ({ id: reviewer.id }),
      adminRedirect: redirect,
    });
    const reviewForm = new FormData();
    reviewForm.set("changeId", submitted.id);
    reviewForm.set("decision", "approved");
    reviewForm.set(
      "note",
      "Reviewed the isolated fictitious product proposal.",
    );
    await assert.rejects(
      reviewProducerChangeAction(reviewForm),
      /REDIRECT:.*approved/,
    );
    const [approved] = await db
      .select()
      .from(schema.producerChangeRequests)
      .where(eq(schema.producerChangeRequests.id, submitted.id));
    assert.equal(approved.status, "approved");
    const expected = approved.contentChange!.requestedHash;
    const execution = "00000000-0000-4000-8000-000000012439";
    await pg.exec(
      "create role product_test_operator login; grant chisan_producer_change_operator to product_test_operator; set session authorization product_test_operator",
    );
    const begin = (hash: string) =>
      pg.query(
        "select * from chisan_begin_producer_change_execution_v2($1::uuid,$2::uuid,repeat('b',64),'data/csv/es/catalunya/barcelona.csv',repeat('c',40),repeat('d',64),900,$3)",
        [execution, approved.id, hash],
      );
    await assert.rejects(
      pg.query(
        "select * from chisan_begin_producer_change_execution_v1($1::uuid,$2::uuid,repeat('b',64),'data/csv/es/catalunya/barcelona.csv',repeat('c',40),repeat('d',64),900)",
        [execution, approved.id],
      ),
      /v2/,
    );
    await assert.rejects(begin("a".repeat(64)), /hash mismatch/);
    await begin(expected);
    await assert.rejects(
      pg.query(
        "select chisan_complete_producer_change_execution_v1($1::uuid,repeat('d',64),array['products'],false)",
        [execution],
      ),
      /v2/,
    );
    await assert.rejects(
      pg.query(
        "select chisan_complete_producer_change_execution_v2($1::uuid,repeat('d',64),array['products'],false,repeat('e',64))",
        [execution],
      ),
      /hash mismatch/,
    );
    await pg.query(
      "select chisan_complete_producer_change_execution_v2($1::uuid,repeat('d',64),array['products'],false,$2)",
      [execution, expected],
    );
    await assert.rejects(
      pg.query(
        "select chisan_finalize_producer_change_execution_v1($1::uuid,repeat('f',40),'data/csv/es/catalunya/barcelona.csv',repeat('d',64))",
        [approved.id],
      ),
      /v2/,
    );
    await pg.exec("set session authorization postgres; reset role");
    await db
      .update(schema.entitlements)
      .set({ status: "revoked", revokedAt: new Date() })
      .where(eq(schema.entitlements.id, entitlement.id));
    await pg.exec("set session authorization product_test_operator");
    await assert.rejects(
      pg.query(
        "select chisan_finalize_producer_change_execution_v2($1::uuid,repeat('f',40),'data/csv/es/catalunya/barcelona.csv',repeat('d',64),$2)",
        [approved.id, expected],
      ),
      /entitlement.*no longer active/,
    );
    await pg.exec("set session authorization postgres; reset role");
    await db
      .update(schema.entitlements)
      .set({ status: "active", revokedAt: null })
      .where(eq(schema.entitlements.id, entitlement.id));
    await pg.exec("set session authorization product_test_operator");
    await pg.query(
      "select chisan_finalize_producer_change_execution_v2($1::uuid,repeat('f',40),'data/csv/es/catalunya/barcelona.csv',repeat('d',64),$2)",
      [approved.id, expected],
    );
    await pg.exec("set session authorization postgres; reset role");
    assert.equal(
      (
        await db
          .select()
          .from(schema.producerChangeRequests)
          .where(eq(schema.producerChangeRequests.id, approved.id))
      )[0].status,
      "applied",
    );
  } finally {
    if (oldMaintenance === undefined)
      delete process.env.CHISAN_PRODUCER_CHANGES_ENABLED;
    else process.env.CHISAN_PRODUCER_CHANGES_ENABLED = oldMaintenance;
    await pg.close();
  }
});
