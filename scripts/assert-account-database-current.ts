import { existsSync } from "node:fs";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { isProducerStatsFeatureEnabled } from "../lib/producer-stats/policy";
import { isAccountFeatureEnabled } from "../lib/accounts/config";
import {
  accountDatabaseStatusProblem,
  isLocalVercelEnvironmentRun,
  queryAccountDatabaseStatus,
} from "../lib/db/account-database-status";
import * as schema from "../lib/db/schema";

function loadEnvironmentFiles(): void {
  for (const environmentFile of [".env.local", ".env"]) {
    if (existsSync(environmentFile)) {
      process.loadEnvFile(environmentFile);
    }
  }
}

async function main(): Promise<void> {
  if (isLocalVercelEnvironmentRun()) {
    throw new Error(
      "vercel env run cannot provide sensitive integration database variables to this local check. Open /admin/sistema for the deployed runtime status, or supply a current direct DATABASE_URL outside vercel env run.",
    );
  }
  loadEnvironmentFiles();
  if (!isAccountFeatureEnabled() && !isProducerStatsFeatureEnabled()) {
    process.stdout.write("Accounts and producer statistics are disabled; database migration assertion skipped.\n");
    return;
  }

  const runtimeConnectionString = process.env.DATABASE_URL?.trim();
  if (!runtimeConnectionString) {
    throw new Error("DATABASE_URL is required when accounts or producer statistics are enabled.");
  }

  const client = postgres(runtimeConnectionString, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 20,
  });

  try {
    const database = drizzle(client, { schema });
    const status = await queryAccountDatabaseStatus(database);
    const problem = accountDatabaseStatusProblem(status);
    if (problem) throw new Error(problem);
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
