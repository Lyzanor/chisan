import { sql } from "drizzle-orm";

import type { Database } from "@/lib/db";

type DatabaseAssertionEnvironment = Record<string, string | undefined>;

export function isLocalVercelEnvironmentRun(
  environment: DatabaseAssertionEnvironment = process.env,
): boolean {
  return (
    environment.VERCEL === "1" &&
    Boolean(environment.VERCEL_ENV?.trim()) &&
    !environment.VERCEL_URL?.trim()
  );
}

export const ACCOUNT_DATABASE_MIGRATION_CONTRACT = [
  {
    hash: "fda25afdc21f264e92b79cc7c1372a636845b183eb32af5127f20afa639e3959",
    folderMillis: 1787228893850,
  },
  {
    hash: "4b4c56fa23fd0f3e3280c57818aca5390ca7509eb8961b33f96bd864de650023",
    folderMillis: 1787230432069,
  },
  {
    hash: "d52e2cbba2fc223a3b6de84f2bf5bb4871b4204e83fd1166b1bf948f7108cda1",
    folderMillis: 1787232721007,
  },
  {
    hash: "784ba292b3b12e75218f7f2d3ba990bdc14a501f2a959408fb526a607febcbaa",
    folderMillis: 1787513392421,
  },
  {
    hash: "8980362d0f07827eb584d12c08fa826585b429e8ba166235a595b9d9efc1d0f1",
    folderMillis: 1787521580485,
  },
  {
    hash: "d6f77a7bc80064ccda832eec3cc36096e77a07d0c1a1ba553d83da7262e211d4",
    folderMillis: 1787527907365,
  },
  {
    hash: "a875a88ea5159c964303a0640037a5820229f14555816b610e0f0b13bcf584ba",
    folderMillis: 1787739643311,
  },
  {
    hash: "8f9f316db7e5f9b906ae8461aa85b1265a9c23dd96d6b27dfb6a2421aadf1548",
    folderMillis: 1787863038776,
  },
  {
    hash: "f5cb1333fd815349a3f9e9debf3fe7edc9aeb4f59969e82eb198d64647c548a2",
    folderMillis: 1788211926803,
  },
  {
    hash: "4f68b9456f7d6fca0e9a44bb3148edaa95e4150d44adfb9066de0204702a8abe",
    folderMillis: 1788556114552,
  },
] as const;

export type AccountDatabaseStatus = {
  available: true;
  registryPresent: boolean;
  expectedMigrationCount: number;
  appliedMigrationCount: number;
  migrationsMatch: boolean;
  migrationMismatchIndex: number | null;
  runtimeAccess: boolean | null;
  checkedAt: Date;
};

export type UnavailableAccountDatabaseStatus = {
  available: false;
  checkedAt: Date;
};

export type AccountDatabaseHealth =
  | AccountDatabaseStatus
  | UnavailableAccountDatabaseStatus;

type AppliedMigration = {
  hash: string;
  createdAt: string | number | null;
};

function executeRows<Row>(result: unknown): Row[] {
  if (Array.isArray(result)) return result as Row[];
  if (result && typeof result === "object" && "rows" in result) {
    const rows = (result as { rows?: unknown }).rows;
    if (Array.isArray(rows)) return rows as Row[];
  }
  return [];
}

function firstMigrationMismatch(applied: AppliedMigration[]): number | null {
  const compared = Math.min(applied.length, ACCOUNT_DATABASE_MIGRATION_CONTRACT.length);
  for (let index = 0; index < compared; index += 1) {
    const expected = ACCOUNT_DATABASE_MIGRATION_CONTRACT[index];
    const current = applied[index];
    if (
      !current ||
      current.hash !== expected.hash ||
      Number(current.createdAt) !== expected.folderMillis
    ) {
      return index;
    }
  }
  return applied.length === ACCOUNT_DATABASE_MIGRATION_CONTRACT.length
    ? null
    : compared;
}

export async function queryAccountDatabaseStatus(
  database: Database,
): Promise<AccountDatabaseStatus> {
  return database.transaction(async (transaction) => {
    await transaction.execute(sql`set transaction read only`);
    await transaction.execute(sql`set local statement_timeout = '15s'`);
    await transaction.execute(
      sql`set local idle_in_transaction_session_timeout = '20s'`,
    );

    const registryResult = await transaction.execute(
      sql<{ migrationTable: string | null }>`
        select to_regclass('drizzle.__drizzle_migrations')::text as "migrationTable"
      `,
    );
    const registryRows = executeRows<{ migrationTable: string | null }>(registryResult);
    const registryPresent = Boolean(registryRows[0]?.migrationTable);
    if (!registryPresent) {
      return {
        available: true,
        registryPresent: false,
        expectedMigrationCount: ACCOUNT_DATABASE_MIGRATION_CONTRACT.length,
        appliedMigrationCount: 0,
        migrationsMatch: false,
        migrationMismatchIndex: 0,
        runtimeAccess: null,
        checkedAt: new Date(),
      };
    }

    const appliedMigrationResult = await transaction.execute(
      sql<AppliedMigration>`
        select hash, created_at as "createdAt"
          from drizzle.__drizzle_migrations
         order by created_at asc, id asc
      `,
    );
    const appliedMigrations = executeRows<AppliedMigration>(appliedMigrationResult);
    const migrationMismatchIndex = firstMigrationMismatch(appliedMigrations);
    const migrationsMatch = migrationMismatchIndex === null;
    if (!migrationsMatch) {
      return {
        available: true,
        registryPresent: true,
        expectedMigrationCount: ACCOUNT_DATABASE_MIGRATION_CONTRACT.length,
        appliedMigrationCount: appliedMigrations.length,
        migrationsMatch: false,
        migrationMismatchIndex,
        runtimeAccess: null,
        checkedAt: new Date(),
      };
    }

    const runtimeAccessResult = await transaction.execute(
      sql<{ hasExecutionAccess: boolean }>`
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
      `,
    );
    const runtimeAccessRows = executeRows<{ hasExecutionAccess: boolean }>(
      runtimeAccessResult,
    );

    return {
      available: true,
      registryPresent: true,
      expectedMigrationCount: ACCOUNT_DATABASE_MIGRATION_CONTRACT.length,
      appliedMigrationCount: appliedMigrations.length,
      migrationsMatch: true,
      migrationMismatchIndex: null,
      runtimeAccess: Boolean(runtimeAccessRows[0]?.hasExecutionAccess),
      checkedAt: new Date(),
    };
  });
}

export function unavailableAccountDatabaseStatus(): UnavailableAccountDatabaseStatus {
  return { available: false, checkedAt: new Date() };
}

export function accountDatabaseStatusProblem(
  status: AccountDatabaseStatus,
): string | null {
  if (!status.registryPresent) {
    return "The account migration registry does not exist.";
  }
  if (!status.migrationsMatch) {
    if (status.appliedMigrationCount !== status.expectedMigrationCount) {
      return `Account database migration count is ${status.appliedMigrationCount}; expected ${status.expectedMigrationCount}.`;
    }
    return `Account database migration ${(status.migrationMismatchIndex ?? 0) + 1} does not match the repository.`;
  }
  if (!status.runtimeAccess) {
    return "The application runtime role cannot read producer-change executions and cancel their fences during access revocation.";
  }
  return null;
}
