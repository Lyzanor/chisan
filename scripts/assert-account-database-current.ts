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
    throw new Error("DATABASE_URL is required when CHISAN_ACCOUNTS_ENABLED=true.");
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

      const [runtimeAccess] = await transaction<{ hasExecutionAccess: boolean }[]>`
        select
          (
            select bool_and(
              has_column_privilege(
                session_user,
                'public.producer_change_executions',
                column_name,
                'select'
              )
            )
            from unnest(array[
              'id', 'change_request_id', 'status', 'operator_key', 'worktree_key',
              'source_head_sha', 'expected_row_hash', 'lease_expires_at', 'csv_path',
              'materialized_at', 'applied_commit_sha', 'finished_at', 'error_message',
              'created_at', 'updated_at'
            ]) as required_columns(column_name)
          )
          and has_column_privilege(
            session_user, 'public.producer_change_executions', 'status', 'update'
          )
          and has_column_privilege(
            session_user, 'public.producer_change_executions', 'finished_at', 'update'
          )
          and has_column_privilege(
            session_user, 'public.producer_change_executions', 'error_message', 'update'
          )
          and has_column_privilege(
            session_user, 'public.producer_change_executions', 'updated_at', 'update'
          ) as "hasExecutionAccess"
      `;
      if (!runtimeAccess?.hasExecutionAccess) {
        throw new Error(
          "The application runtime role cannot read producer-change executions and cancel their fences during access revocation.",
        );
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
