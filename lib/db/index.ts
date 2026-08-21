import "server-only";

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/lib/db/schema";

export type Database = PostgresJsDatabase<typeof schema>;
type SqlClient = ReturnType<typeof postgres>;
type DatabaseState = { client: SqlClient; database: Database };

const globalForDatabase = globalThis as typeof globalThis & {
  __km0DatabaseState?: DatabaseState;
};

function createDatabaseState(): DatabaseState {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error("DATABASE_URL is required when a database operation is executed.");
  }

  const client = postgres(connectionString, {
    prepare: false,
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  return {
    client,
    database: drizzle(client, { schema }),
  };
}

/**
 * Lazily creates the connection pool. Importing this module during a Next.js
 * build does not read DATABASE_URL or open a database connection.
 */
export function getDatabase(): Database {
  const state = globalForDatabase.__km0DatabaseState ?? createDatabaseState();
  globalForDatabase.__km0DatabaseState = state;
  return state.database;
}

/** Intended for tests and graceful shutdowns, not normal request handling. */
export async function closeDatabase(): Promise<void> {
  const state = globalForDatabase.__km0DatabaseState;
  if (!state) return;

  globalForDatabase.__km0DatabaseState = undefined;
  await state.client.end();
}

export { schema };
