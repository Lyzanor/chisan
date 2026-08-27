import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

import { PGlite } from "@electric-sql/pglite";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { drizzle } from "drizzle-orm/pglite";

import type { Database } from "../lib/db";
import {
  ACCOUNT_DATABASE_MIGRATION_CONTRACT,
  accountDatabaseStatusProblem,
  isLocalVercelEnvironmentRun,
  queryAccountDatabaseStatus,
} from "../lib/db/account-database-status";
import * as schema from "../lib/db/schema";

async function applyAccountMigrations(database: PGlite): Promise<void> {
  const migrationFiles = (await readdir("drizzle"))
    .filter((file) => /^\d{4}_.+\.sql$/.test(file))
    .sort();
  const migrationRecords = readMigrationFiles({ migrationsFolder: "drizzle" });

  await database.exec("begin");
  try {
    for (const migrationFile of migrationFiles) {
      await database.exec(await readFile(`drizzle/${migrationFile}`, "utf8"));
    }
    await database.exec(
      `create schema if not exists drizzle;
       create table drizzle.__drizzle_migrations (
         id serial primary key,
         hash text not null,
         created_at bigint
       )`,
    );
    for (const migration of migrationRecords) {
      await database.query(
        `insert into drizzle.__drizzle_migrations (hash, created_at)
         values ($1, $2)`,
        [migration.hash, migration.folderMillis],
      );
    }
    await database.exec("commit");
  } catch (error) {
    await database.exec("rollback");
    throw error;
  }
}

test("runtime migration contract matches every committed migration fingerprint", () => {
  const migrations = readMigrationFiles({ migrationsFolder: "drizzle" }).map(
    ({ hash, folderMillis }) => ({ hash, folderMillis }),
  );
  assert.deepEqual(migrations, [...ACCOUNT_DATABASE_MIGRATION_CONTRACT]);
});

test("local Vercel env runs are rejected without affecting deployed runtimes", () => {
  assert.equal(
    isLocalVercelEnvironmentRun({ VERCEL: "1", VERCEL_ENV: "production" }),
    true,
  );
  assert.equal(
    isLocalVercelEnvironmentRun({
      VERCEL: "1",
      VERCEL_ENV: "production",
      VERCEL_URL: "chisan.example.vercel.app",
    }),
    false,
  );
  assert.equal(isLocalVercelEnvironmentRun({}), false);
});

test("account database status proves migrations and runtime permissions read-only", async () => {
  const client = new PGlite();
  try {
    await applyAccountMigrations(client);
    const database = drizzle(client, { schema }) as unknown as Database;
    const current = await queryAccountDatabaseStatus(database);
    assert.equal(current.available, true);
    assert.equal(current.registryPresent, true);
    assert.equal(current.migrationsMatch, true);
    assert.equal(current.runtimeAccess, true);
    assert.equal(current.appliedMigrationCount, ACCOUNT_DATABASE_MIGRATION_CONTRACT.length);
    assert.equal(accountDatabaseStatusProblem(current), null);

    await client.exec(
      `delete from drizzle.__drizzle_migrations
        where id = (select max(id) from drizzle.__drizzle_migrations)`,
    );
    const stale = await queryAccountDatabaseStatus(database);
    assert.equal(stale.migrationsMatch, false);
    assert.equal(stale.runtimeAccess, null);
    assert.equal(stale.appliedMigrationCount, ACCOUNT_DATABASE_MIGRATION_CONTRACT.length - 1);
    assert.match(accountDatabaseStatusProblem(stale) ?? "", /migration count/i);
  } finally {
    await client.close();
  }
});
