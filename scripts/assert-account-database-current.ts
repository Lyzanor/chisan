import { existsSync } from "node:fs";

import { readMigrationFiles } from "drizzle-orm/migrator";
import postgres from "postgres";

import { isAccountFeatureEnabled } from "../lib/accounts/config";

function loadEnvironmentFiles(): void {
  for (const environmentFile of [".env.local", ".env"]) {
    if (existsSync(environmentFile)) {
      process.loadEnvFile(environmentFile);
    }
  }
}

async function main(): Promise<void> {
  loadEnvironmentFiles();
  if (!isAccountFeatureEnabled()) {
    process.stdout.write("Accounts are disabled; database migration assertion skipped.\n");
    return;
  }

  const runtimeConnectionString = process.env.DATABASE_URL?.trim();
  if (!runtimeConnectionString) {
    throw new Error("DATABASE_URL is required when KM0_ACCOUNTS_ENABLED=true.");
  }

  const expectedMigrations = readMigrationFiles({ migrationsFolder: "drizzle" });
  if (expectedMigrations.length === 0) {
    throw new Error("No committed account migrations were found.");
  }

  const client = postgres(runtimeConnectionString, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 20,
  });

  try {
    await client.begin("read only", async (transaction) => {
      await transaction`set local statement_timeout = '15s'`;
      const [registry] = await transaction<{ migrationTable: string | null }[]>`
        select to_regclass('drizzle.__drizzle_migrations')::text as "migrationTable"
      `;
      if (!registry?.migrationTable) {
        throw new Error("The account migration registry does not exist.");
      }

      const appliedMigrations = await transaction<
        { hash: string; createdAt: string | number | null }[]
      >`
        select hash, created_at as "createdAt"
          from drizzle.__drizzle_migrations
         order by created_at asc, id asc
      `;

      if (appliedMigrations.length !== expectedMigrations.length) {
        throw new Error(
          `Account database migration count is ${appliedMigrations.length}; expected ${expectedMigrations.length}.`,
        );
      }

      for (const [index, expected] of expectedMigrations.entries()) {
        const applied = appliedMigrations[index];
        if (
          !applied ||
          Number(applied.createdAt) !== expected.folderMillis ||
          applied.hash !== expected.hash
        ) {
          throw new Error(`Account database migration ${index + 1} does not match the repository.`);
        }
      }
    });
    process.stdout.write("Account database migration registry matches the repository.\n");
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Account database assertion failed: ${message}\n`);
  process.exitCode = 1;
});
