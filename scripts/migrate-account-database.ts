import { existsSync } from "node:fs";

import { readMigrationFiles } from "drizzle-orm/migrator";
import postgres from "postgres";

function loadEnvironmentFiles(): void {
  for (const environmentFile of [".env.migration.local"]) {
    if (existsSync(environmentFile)) {
      process.loadEnvFile(environmentFile);
    }
  }
}

async function main(): Promise<void> {
  loadEnvironmentFiles();
  const connectionString = process.env.DATABASE_MIGRATION_URL?.trim();
  if (!connectionString) {
    throw new Error(
      "DATABASE_MIGRATION_URL is required in the process or .env.migration.local; DATABASE_URL is intentionally ignored.",
    );
  }

  const migrations = readMigrationFiles({ migrationsFolder: "drizzle" });
  const client = postgres(connectionString, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 20,
  });

  try {
    await client.begin(async (transaction) => {
      await transaction`set local lock_timeout = '15s'`;
      await transaction`
        select pg_advisory_xact_lock(hashtextextended('km0-account-migrations', 0))
      `;
      await transaction`create schema if not exists drizzle`;
      await transaction`
        create table if not exists drizzle.__drizzle_migrations (
          id serial primary key,
          hash text not null,
          created_at bigint
        )
      `;

      const [latest] = await transaction<{ createdAt: string | number | null }[]>`
        select created_at as "createdAt"
          from drizzle.__drizzle_migrations
         order by created_at desc
         limit 1
      `;
      const latestTimestamp = latest?.createdAt == null ? null : Number(latest.createdAt);

      for (const migration of migrations) {
        if (latestTimestamp !== null && latestTimestamp >= migration.folderMillis) continue;

        for (const statement of migration.sql) {
          await transaction.unsafe(statement);
        }
        await transaction`
          insert into drizzle.__drizzle_migrations (hash, created_at)
          values (${migration.hash}, ${migration.folderMillis})
        `;
      }
    });
    process.stdout.write("Account database migrations are current.\n");
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Account database migration failed: ${message}\n`);
  process.exitCode = 1;
});
