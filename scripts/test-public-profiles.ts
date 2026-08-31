import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

import {
  isPublicProfileIndexable,
  isPublicProfileVisible,
  normalizePublicHandle,
  publicHandleProblem,
} from "../lib/accounts/public-profile-policy";
import {
  normalizeMunicipalityName,
  parsePublicProfileBaseLocationKey,
} from "../lib/accounts/public-profile-location";
import { publicProfileUpdateSchema } from "../lib/accounts/input";
import {
  normalizeAdminUserProfileListOptions,
  queryAdminUserProfileCounts,
  queryAdminUserProfiles,
} from "../lib/admin/user-profiles";
import type { Database } from "../lib/db";
import * as schema from "../lib/db/schema";
import { producerSelectionItemKey } from "../lib/producer-selections";

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

test("public handles normalize once and reject unsafe route identities", () => {
  assert.equal(normalizePublicHandle("  Local-Food-42  "), "local-food-42");
  assert.equal(publicHandleProblem("local-food-42"), null);

  for (const handle of [
    "ab",
    "-local",
    "local-",
    "local_food",
    "Ávila",
    "admin",
    "chisan",
  ]) {
    assert.equal(typeof publicHandleProblem(handle), "string", handle);
  }
});

test("public handle writes use an atomic assignment guard", async () => {
  const source = await readFile("app/(application)/cuenta/actions.ts", "utf8");

  assert.match(source, /const publicHandleGuard = account\.publicHandle/);
  assert.match(
    source,
    /\.where\(and\(eq\(users\.id, account\.id\), publicHandleGuard\)\)/,
  );
  assert.match(source, /if \(!updatedUsers\.length\) throw new PublicHandleChangedError\(\)/);
});

test("profile visibility distinguishes sharing from indexing", () => {
  assert.equal(isPublicProfileVisible("private"), false);
  assert.equal(isPublicProfileVisible("unlisted"), true);
  assert.equal(isPublicProfileVisible("public"), true);
  assert.equal(isPublicProfileIndexable("private"), false);
  assert.equal(isPublicProfileIndexable("unlisted"), false);
  assert.equal(isPublicProfileIndexable("public"), true);
});

test("public profile input requires a canonical area and municipality", () => {
  assert.equal(
    publicProfileUpdateSchema.safeParse({
      publicHandle: "map-owner",
      visibility: "public",
      baseLocation: "",
      baseMunicipality: "",
    }).success,
    false,
  );
  assert.deepEqual(parsePublicProfileBaseLocationKey(" ES/Barcelona "), {
    country: "es",
    area: "barcelona",
  });
  assert.equal(
    normalizeMunicipalityName("  Santa Coloma-de Gramenét "),
    "santa coloma de gramenet",
  );
});

test("admin profile filters normalize to stable provider-neutral views", () => {
  assert.deepEqual(normalizeAdminUserProfileListOptions(), {
    visibility: "all",
    status: "active",
    query: "",
    page: 1,
    pageSize: 25,
  });
  assert.deepEqual(
    normalizeAdminUserProfileListOptions({
      visibility: "unknown",
      status: "unknown",
      query: "  map   owner  ",
      page: -5,
      pageSize: 500,
    }),
    {
      visibility: "all",
      status: "active",
      query: "map owner",
      page: 1,
      pageSize: 100,
    },
  );
});

test("selection identity remains country plus producer ID across areas", () => {
  assert.equal(
    producerSelectionItemKey({ country: "es", producerId: 42 }),
    "es:42",
  );
  assert.notEqual(
    producerSelectionItemKey({ country: "es", producerId: 42 }),
    producerSelectionItemKey({ country: "fr", producerId: 42 }),
  );
});

test("public profile base location migration backfills existing maps to Barcelona", async () => {
  const database = new PGlite();
  try {
    const migrationFiles = (await readdir("drizzle"))
      .filter((file) => /^000[0-7]_.+\.sql$/.test(file))
      .sort();
    for (const migrationFile of migrationFiles) {
      await database.exec(await readFile(`drizzle/${migrationFile}`, "utf8"));
    }
    await database.exec(
      `insert into users (display_name, public_handle, public_profile_visibility)
       values ('Existing map', 'existing-map', 'public')`,
    );

    const locationMigration = (await readdir("drizzle")).find((file) =>
      /^0008_.+\.sql$/.test(file),
    );
    assert.ok(locationMigration);
    await database.exec(await readFile(`drizzle/${locationMigration}`, "utf8"));

    const result = await database.query<{
      public_profile_base_area: string;
      public_profile_base_country: string;
      public_profile_base_municipality: string;
    }>(
      `select public_profile_base_country, public_profile_base_area,
              public_profile_base_municipality
         from users
        where public_handle = 'existing-map'`,
    );
    assert.deepEqual(result.rows, [
      {
        public_profile_base_country: "es",
        public_profile_base_area: "barcelona",
        public_profile_base_municipality: "Barcelona",
      },
    ]);
  } finally {
    await database.close();
  }
});

test("public profiles and shared favorites are private by default", async () => {
  const database = new PGlite();
  try {
    await applyAccountMigrations(database);
    const [account] = (
      await database.query<{
        id: string;
        public_handle: string | null;
        public_profile_visibility: string;
      }>(
        `insert into users (display_name)
         values ('Map owner')
         returning id, public_handle, public_profile_visibility::text`,
      )
    ).rows;

    assert.deepEqual(account, {
      id: account.id,
      public_handle: null,
      public_profile_visibility: "private",
    });

    await database.query(
      `insert into favorites (user_id, country, producer_id)
       values ($1, 'es', 42)`,
      [account.id],
    );
    const favorite = await database.query<{ show_on_public_profile: boolean }>(
      `select show_on_public_profile
         from favorites
        where user_id = $1 and country = 'es' and producer_id = 42`,
      [account.id],
    );
    assert.deepEqual(favorite.rows, [{ show_on_public_profile: false }]);

    await assert.rejects(
      database.query(
        `update users
            set public_profile_visibility = 'unlisted'
          where id = $1`,
        [account.id],
      ),
      /users_public_profile_handle_check/i,
    );
    await assert.rejects(
      database.query(
        `update users
            set public_handle = 'Invalid_Handle',
                public_profile_base_country = 'es',
                public_profile_base_area = 'barcelona',
                public_profile_base_municipality = 'Barcelona'
          where id = $1`,
        [account.id],
      ),
      /users_public_handle_format_check/i,
    );
    await assert.rejects(
      database.query(
        `update users
            set public_handle = 'map-owner', public_profile_visibility = 'unlisted'
          where id = $1`,
        [account.id],
      ),
      /users_public_profile_location_required_check/i,
    );

    await database.query(
      `update users
          set public_handle = 'map-owner',
              public_profile_visibility = 'unlisted',
              public_profile_base_country = 'es',
              public_profile_base_area = 'barcelona',
              public_profile_base_municipality = 'Barcelona'
        where id = $1`,
      [account.id],
    );
    await database.query(
      `update favorites
          set show_on_public_profile = true
        where user_id = $1 and country = 'es' and producer_id = 42`,
      [account.id],
    );

    const secondAccount = await database.query<{ id: string }>(
      `insert into users (display_name) values ('Second owner') returning id`,
    );
    await assert.rejects(
      database.query(
        `update users
            set public_handle = 'map-owner',
                public_profile_base_country = 'es',
                public_profile_base_area = 'barcelona',
                public_profile_base_municipality = 'Barcelona'
          where id = $1`,
        [secondAccount.rows[0].id],
      ),
      /users_public_handle_uidx|duplicate key/i,
    );
  } finally {
    await database.close();
  }
});

test("admin profile registry reads Chisan account and selection state", async () => {
  const client = new PGlite();
  try {
    await applyAccountMigrations(client);
    const publicAccount = await client.query<{ id: string }>(
      `insert into users (
         display_name, public_handle, public_profile_visibility,
         public_profile_base_country, public_profile_base_area,
         public_profile_base_municipality
       ) values ('Public map', 'public-map', 'public', 'es', 'barcelona', 'Barcelona')
       returning id`,
    );
    const unlistedAccount = await client.query<{ id: string }>(
      `insert into users (
         display_name, public_handle, public_profile_visibility,
         public_profile_base_country, public_profile_base_area,
         public_profile_base_municipality
       ) values ('Unlisted map', 'unlisted-map', 'unlisted', 'es', 'barcelona', 'Barcelona')
       returning id`,
    );
    await client.query(
      `insert into users (
         display_name, public_handle, public_profile_visibility, status,
         public_profile_base_country, public_profile_base_area,
         public_profile_base_municipality
       ) values (
         'Suspended map', 'suspended-map', 'public', 'suspended',
         'es', 'barcelona', 'Barcelona'
       )`,
    );
    await client.query(
      `insert into favorites (user_id, country, producer_id, show_on_public_profile)
       values ($1, 'es', 41, true), ($1, 'es', 42, false), ($2, 'fr', 8, true)`,
      [publicAccount.rows[0].id, unlistedAccount.rows[0].id],
    );

    const database = drizzle(client, { schema }) as unknown as Database;
    const activeRegistry = await queryAdminUserProfiles(database);
    assert.equal(activeRegistry.total, 2);
    assert.deepEqual(
      activeRegistry.items
        .map((item) => ({
          handle: item.publicHandle,
          favorites: item.favoriteCount,
          shared: item.sharedProducerCount,
        }))
        .sort((left, right) => String(left.handle).localeCompare(String(right.handle))),
      [
        { handle: "public-map", favorites: 2, shared: 1 },
        { handle: "unlisted-map", favorites: 1, shared: 1 },
      ],
    );

    const publicRegistry = await queryAdminUserProfiles(database, {
      visibility: "public",
      query: "public-map",
    });
    assert.equal(publicRegistry.total, 1);
    assert.equal(publicRegistry.items[0]?.publicHandle, "public-map");

    const activeCounts = await queryAdminUserProfileCounts(database);
    assert.deepEqual(activeCounts, { all: 2, private: 0, unlisted: 1, public: 1 });
    const allCounts = await queryAdminUserProfileCounts(database, { status: "all" });
    assert.deepEqual(allCounts, { all: 3, private: 0, unlisted: 1, public: 2 });
  } finally {
    await client.close();
  }
});
