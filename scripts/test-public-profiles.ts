import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

import { PGlite } from "@electric-sql/pglite";

import {
  isPublicProfileIndexable,
  isPublicProfileVisible,
  normalizePublicHandle,
  publicHandleProblem,
} from "../lib/accounts/public-profile-policy";
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
            set public_handle = 'Invalid_Handle'
          where id = $1`,
        [account.id],
      ),
      /users_public_handle_format_check/i,
    );

    await database.query(
      `update users
          set public_handle = 'map-owner', public_profile_visibility = 'unlisted'
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
            set public_handle = 'map-owner'
          where id = $1`,
        [secondAccount.rows[0].id],
      ),
      /users_public_handle_uidx|duplicate key/i,
    );
  } finally {
    await database.close();
  }
});
