import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  prepareContentPublication,
  ProducerContentConflictError,
  readOptionalContent,
} from "../lib/editorial/producer-content-publication";
import {
  hashProducerContent,
  resolveProducerContentChange,
} from "../lib/accounts/producer-content-change";
import {
  emptyProducerContent,
  producerContentSchema,
} from "../lib/catalog/content-schema";
import { producerContentPath } from "../lib/catalog/content";
import { atomicWriteUtf8 } from "../lib/editorial/atomic-file";
import {
  assertFinalizationGitState,
  assertGitPathClean,
  materializationGitContext,
  readCommitBlob,
  repoRelativePath,
} from "../lib/editorial/git-state";
import {
  ProducerCsvRowNotFoundError,
  applyProducerPatchToCsv,
  readProducerFieldsFromCsv,
  resolveExpectedProducerChange,
  type ExpectedProducerChange,
  type ProducerCsvPatchResult,
} from "../lib/editorial/producer-csv";
export { atomicWriteUtf8 } from "../lib/editorial/atomic-file";
export * from "../lib/editorial/git-state";
export * from "../lib/editorial/producer-csv";

import { eq, sql } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";

import { hashProducerFields } from "../lib/accounts/producer-fields";
import {
  PRODUCER_CHANGE_AGENT_SCHEMA_VERSION,
  normalizeAdminProducerChangeListOptions,
  queryAdminProducerChangeById,
  queryAdminProducerChanges,
  serializeProducerChangeDetail,
  serializeProducerChangeListItem,
} from "../lib/admin/producer-change-requests";
import * as databaseSchema from "../lib/db/schema";
import {
  producerChangeRequests,
  type ProducerChangeRequest,
} from "../lib/db/schema";
import { loadProducerChangeDatabaseUrl } from "./producer-change-access";

type Database = PostgresJsDatabase<typeof databaseSchema>;

type ProducerChangeAccessProbe = {
  sessionUser: string;
  currentUser: string;
  member: boolean;
  schemaUsage: boolean;
  schemaCreate: boolean;
  canReadChanges: boolean;
  canUpdateChanges: boolean;
  canDeleteChanges: boolean;
  canInsertAudit: boolean;
  canExecuteAllOperatorWorkflow: boolean;
  canExecuteAnyOperatorWorkflow: boolean;
  canExecuteRecovery: boolean;
  canWriteAccountTables: boolean;
};

const PRODUCER_CHANGE_DATABASE_ROLES = {
  read: "chisan_admin_read",
  operator: "chisan_producer_change_operator",
  recovery: "chisan_producer_change_recovery",
} as const;

export type ProducerChangeCliArguments =
  | {
      command: "list";
      status?: string;
      query?: string;
      limit?: number;
      page?: number;
      json: boolean;
    }
  | { command: "show"; changeId: string; json: boolean }
  | { command: "materialize"; changeId: string }
  | {
      command: "recover";
      changeId: string;
      executionId: string;
      reason: string;
    }
  | { command: "finalize"; changeId: string; commitSha: string }
  | {
      command: "doctor";
      access: "read" | "operator" | "recovery";
      json: boolean;
    };

const CLI_USAGE =
  "Usage: pnpm producer:change materialize <change-id> | finalize <change-id> <commit-sha>\n" +
  "       pnpm producer:change recover <change-id> <execution-id> --reason <text>\n" +
  "       pnpm producer:change list [--status <view-or-status>] [--query <text>] [--limit <n>] [--page <n>] [--json]\n" +
  "       pnpm producer:change show <change-id> [--json]\n" +
  "       pnpm producer:change doctor --access <read|operator|recovery> [--json]";

const CHANGE_REQUEST_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parsePositiveIntegerOption(
  flag: string,
  value: string | undefined,
): number {
  if (!value || !/^[1-9][0-9]*$/.test(value)) {
    throw new Error(`${flag} requires a positive integer.`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${flag} requires a positive safe integer.`);
  }
  return parsed;
}

/** Parses CLI tokens without reading environment variables or opening external resources. */
export function parseProducerChangeCliArguments(
  argv: readonly string[],
): ProducerChangeCliArguments {
  const [command, ...tokens] = argv;
  if (command === "materialize" || command === "finalize") {
    const expectedLength = command === "finalize" ? 2 : 1;
    if (tokens.length !== expectedLength) throw new Error(CLI_USAGE);
    const [changeId, commitSha] = tokens;
    if (!CHANGE_REQUEST_ID_PATTERN.test(changeId)) {
      throw new Error(`${command} requires a valid change-request UUID.`);
    }
    if (command === "finalize" && !/^[0-9a-f]{40}$/i.test(commitSha ?? "")) {
      throw new Error("Finalize requires a full 40-character Git commit SHA.");
    }
    return command === "finalize"
      ? { command, changeId, commitSha: commitSha?.toLowerCase() }
      : { command, changeId };
  }

  if (command === "recover") {
    const [changeId, executionId, reasonFlag, reason, ...extra] = tokens;
    if (
      extra.length > 0 ||
      reasonFlag !== "--reason" ||
      !reason ||
      reason.trim().length < 20
    ) {
      throw new Error(CLI_USAGE);
    }
    if (!CHANGE_REQUEST_ID_PATTERN.test(changeId ?? "")) {
      throw new Error("Recover requires a valid change-request UUID.");
    }
    if (!CHANGE_REQUEST_ID_PATTERN.test(executionId ?? "")) {
      throw new Error(
        "Recover requires the exact materialized execution UUID.",
      );
    }
    return {
      command,
      changeId,
      executionId,
      reason: reason.trim(),
    };
  }

  if (command === "show") {
    let changeId: string | undefined;
    let json = false;
    for (const token of tokens) {
      if (token === "--json") {
        if (json) throw new Error("--json may only be specified once.");
        json = true;
      } else if (token.startsWith("--")) {
        throw new Error(`Unknown show option '${token}'.`);
      } else if (changeId) {
        throw new Error("Show accepts exactly one change-request UUID.");
      } else {
        changeId = token;
      }
    }
    if (!changeId) throw new Error(CLI_USAGE);
    if (!CHANGE_REQUEST_ID_PATTERN.test(changeId)) {
      throw new Error("Show requires a valid change-request UUID.");
    }
    return { command, changeId, json };
  }

  if (command === "doctor") {
    let access: "read" | "operator" | "recovery" | undefined;
    let json = false;
    for (let index = 0; index < tokens.length; index += 1) {
      const token = tokens[index];
      if (token === "--json") {
        if (json) throw new Error("--json may only be specified once.");
        json = true;
        continue;
      }
      if (token !== "--access" || access) {
        throw new Error(`Unknown or repeated doctor option '${token}'.`);
      }
      const value = tokens[index + 1];
      if (value !== "read" && value !== "operator" && value !== "recovery") {
        throw new Error("--access must be 'read', 'operator' or 'recovery'.");
      }
      access = value;
      index += 1;
    }
    if (!access) throw new Error(CLI_USAGE);
    return { command, access, json };
  }

  if (command === "list") {
    let status: string | undefined;
    let query: string | undefined;
    let limit: number | undefined;
    let page: number | undefined;
    let json = false;
    const seen = new Set<string>();

    for (let index = 0; index < tokens.length; index += 1) {
      const token = tokens[index];
      if (!token.startsWith("--")) {
        throw new Error(`Unexpected list argument '${token}'.`);
      }
      if (
        !["--status", "--query", "--limit", "--page", "--json"].includes(token)
      ) {
        throw new Error(`Unknown list option '${token}'.`);
      }
      if (seen.has(token))
        throw new Error(`${token} may only be specified once.`);
      seen.add(token);

      if (token === "--json") {
        json = true;
        continue;
      }

      const value = tokens[index + 1];
      if (value === undefined || value.startsWith("--")) {
        throw new Error(`${token} requires a value.`);
      }
      index += 1;
      if (token === "--status") {
        const normalized = value.trim().toLowerCase();
        const selection = normalizeAdminProducerChangeListOptions({
          status: normalized,
        }).selection;
        if (!normalized || selection.key !== normalized) {
          throw new Error(`Unknown producer-change status or view '${value}'.`);
        }
        status = normalized;
      } else if (token === "--query") {
        query = value;
      } else if (token === "--limit") {
        limit = parsePositiveIntegerOption(token, value);
      } else {
        page = parsePositiveIntegerOption(token, value);
      }
    }

    return { command, status, query, limit, page, json };
  }

  throw new Error(CLI_USAGE);
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallback;
}

type ProducerChangeExecutionReceipt = {
  executionId: string;
  leaseExpiresAt: Date;
  operatorKey: string;
};

type ProducerChangeFailureOutcome = "conflict" | "failed";

export type ActiveProducerChangeExecution = {
  id: string;
  status: "leased" | "materialized";
  operatorKey: string;
  sameOperator: boolean;
  worktreeKey: string;
  sourceHeadSha: string;
  expectedRowHash: string;
  expectedContentHash?: string | null;
  leaseExpiresAt: Date;
  csvPath: string;
};

export function canResumeExactDirtyMaterialization(
  execution: ActiveProducerChangeExecution | null,
  gitContext: { sourceHeadSha: string; worktreeKey: string },
  expectedRowHash: string,
  csvPath: string,
  now = Date.now(),
): boolean {
  return Boolean(
    execution &&
      execution.sameOperator &&
      execution.worktreeKey === gitContext.worktreeKey &&
      execution.sourceHeadSha === gitContext.sourceHeadSha &&
      execution.expectedRowHash === expectedRowHash &&
      execution.csvPath === csvPath &&
      (execution.status === "materialized" ||
        execution.leaseExpiresAt.getTime() > now),
  );
}

type FinalizationProducerChangeExecution = Omit<
  ActiveProducerChangeExecution,
  "status"
> & {
  status: "materialized" | "finalized";
  appliedCommitSha: string | null;
};

type RecoveryProducerChangeExecution = Omit<
  ActiveProducerChangeExecution,
  "status"
> & {
  status: "materialized" | "cancelled";
};

function isTransientDatabaseConnectionError(error: unknown): boolean {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code ?? "")
      : "";
  return (
    code.startsWith("08") || ["ECONNRESET", "ETIMEDOUT", "EPIPE"].includes(code)
  );
}

async function retryDatabaseReceipt<T>(
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isTransientDatabaseConnectionError(error)) throw error;
    return operation();
  }
}

async function activeProducerChangeExecution(
  client: Sql,
  changeId: string,
): Promise<ActiveProducerChangeExecution | null> {
  const [execution] = await client<ActiveProducerChangeExecution[]>`
    select
      id,
      status::text as status,
      operator_key as "operatorKey",
      operator_key = session_user::text as "sameOperator",
      worktree_key as "worktreeKey",
      source_head_sha as "sourceHeadSha",
      expected_row_hash as "expectedRowHash",
      expected_content_hash as "expectedContentHash",
      lease_expires_at as "leaseExpiresAt",
      csv_path as "csvPath"
    from public.producer_change_executions
    where change_request_id = ${changeId}::uuid
      and status in ('leased', 'materialized')
    limit 1
  `;
  return execution ?? null;
}

async function finalizationProducerChangeExecution(
  client: Sql,
  changeId: string,
): Promise<FinalizationProducerChangeExecution | null> {
  const [execution] = await client<FinalizationProducerChangeExecution[]>`
    select
      id,
      status::text as status,
      operator_key as "operatorKey",
      operator_key = session_user::text as "sameOperator",
      worktree_key as "worktreeKey",
      source_head_sha as "sourceHeadSha",
      expected_row_hash as "expectedRowHash",
      expected_content_hash as "expectedContentHash",
      lease_expires_at as "leaseExpiresAt",
      csv_path as "csvPath",
      applied_commit_sha as "appliedCommitSha"
    from public.producer_change_executions
    where change_request_id = ${changeId}::uuid
      and status in ('materialized', 'finalized')
    order by case when status = 'materialized' then 0 else 1 end, updated_at desc
    limit 1
  `;
  return execution ?? null;
}

async function recoveryProducerChangeExecution(
  client: Sql,
  changeId: string,
  executionId: string,
): Promise<RecoveryProducerChangeExecution | null> {
  const [execution] = await client<RecoveryProducerChangeExecution[]>`
    select
      id,
      status::text as status,
      operator_key as "operatorKey",
      operator_key = session_user::text as "sameOperator",
      worktree_key as "worktreeKey",
      source_head_sha as "sourceHeadSha",
      expected_row_hash as "expectedRowHash",
      expected_content_hash as "expectedContentHash",
      lease_expires_at as "leaseExpiresAt",
      csv_path as "csvPath"
    from public.producer_change_executions
    where id = ${executionId}::uuid
      and change_request_id = ${changeId}::uuid
      and status in ('materialized', 'cancelled')
    limit 1
  `;
  return execution ?? null;
}

async function beginProducerChangeExecution(
  client: Sql,
  input: {
    executionId: string;
    changeId: string;
    worktreeKey: string;
    csvPath: string;
    sourceHeadSha: string;
    expectedRowHash: string;
    expectedContentHash?: string | null;
  },
): Promise<ProducerChangeExecutionReceipt> {
  const [receipt] = await retryDatabaseReceipt(
    () =>
      client<ProducerChangeExecutionReceipt[]>`
      select *
      from public.chisan_begin_producer_change_execution_v2(
        ${input.executionId}::uuid,
        ${input.changeId}::uuid,
        ${input.worktreeKey},
        ${input.csvPath},
        ${input.sourceHeadSha},
        ${input.expectedRowHash},
        900,
        ${input.expectedContentHash ?? null}
      )
    `,
  );
  if (!receipt)
    throw new Error("The database did not return an execution receipt.");
  return receipt;
}

async function completeProducerChangeExecution(
  client: Sql,
  executionId: string,
  expectedRowHash: string,
  fields: string[],
  alreadyPresent: boolean,
  expectedContentHash: string | null = null,
): Promise<void> {
  await retryDatabaseReceipt(
    () =>
      client`
      select public.chisan_complete_producer_change_execution_v2(
        ${executionId}::uuid,
        ${expectedRowHash},
        ${client.array(fields)}::text[],
        ${alreadyPresent},
        ${expectedContentHash}
      )
    `,
  );
}

async function failProducerChangeExecution(
  client: Sql,
  executionId: string,
  outcome: ProducerChangeFailureOutcome,
  reason: string,
): Promise<void> {
  await client`
    select public.chisan_fail_producer_change_execution_v1(
      ${executionId}::uuid,
      ${outcome},
      ${reason.slice(0, 2_000)}
    )
  `;
}

async function failProducerChangePreflight(
  client: Sql,
  changeId: string,
  outcome: ProducerChangeFailureOutcome,
  reason: string,
): Promise<void> {
  await client`
    select public.chisan_fail_producer_change_preflight_v1(
      ${changeId}::uuid,
      ${outcome},
      ${reason.slice(0, 2_000)}
    )
  `;
}

async function finalizeProducerChangeExecution(
  client: Sql,
  input: {
    changeId: string;
    commitSha: string;
    csvPath: string;
    expectedRowHash: string;
    expectedContentHash?: string | null;
  },
): Promise<string> {
  const [receipt] = await retryDatabaseReceipt(
    () =>
      client<{ executionId: string }[]>`
      select public.chisan_finalize_producer_change_execution_v2(
        ${input.changeId}::uuid,
        ${input.commitSha},
        ${input.csvPath},
        ${input.expectedRowHash},
        ${input.expectedContentHash ?? null}
      ) as "executionId"
    `,
  );
  if (!receipt?.executionId) {
    throw new Error("The database did not return a finalization receipt.");
  }
  return receipt.executionId;
}

async function recoverProducerChangeExecution(
  client: Sql,
  input: {
    changeId: string;
    executionId: string;
    worktreeKey: string;
    sourceHeadSha: string;
    observedRowHash: string;
    observedContentHash?: string | null;
    reason: string;
  },
): Promise<string> {
  const [receipt] = await retryDatabaseReceipt(
    () =>
      client<{ executionId: string }[]>`
      select public.chisan_recover_producer_change_execution_v2(
        ${input.changeId}::uuid,
        ${input.executionId}::uuid,
        ${input.worktreeKey},
        ${input.sourceHeadSha},
        ${input.observedRowHash},
        ${input.reason},
        ${input.observedContentHash ?? null}
      ) as "executionId"
    `,
  );
  if (!receipt?.executionId) {
    throw new Error("The database did not return a recovery receipt.");
  }
  return receipt.executionId;
}

function csvPathFor(producer: {
  country: string;
  region: string;
  area: string;
}): string {
  return path.resolve(
    process.cwd(),
    "data/csv",
    producer.country,
    producer.region,
    `${producer.area}.csv`,
  );
}

function auditCsv(csvPath: string): void {
  const audit = spawnSync(process.execPath, ["scripts/audit-csv.js", csvPath], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  if (audit.status !== 0) {
    throw new Error(
      (audit.stderr || audit.stdout || "CSV audit failed.").trim(),
    );
  }
}

async function inspectProducerChangeDatabaseAccess(
  client: Sql,
  access: "read" | "operator" | "recovery",
): Promise<ProducerChangeAccessProbe> {
  const role = PRODUCER_CHANGE_DATABASE_ROLES[access];
  const [probe] = await client<ProducerChangeAccessProbe[]>`
    select
      session_user::text as "sessionUser",
      current_user::text as "currentUser",
      pg_has_role(session_user, ${role}, 'member') as "member",
      has_schema_privilege(session_user, 'public', 'usage') as "schemaUsage",
      has_schema_privilege(session_user, 'public', 'create') as "schemaCreate",
      has_any_column_privilege(
        session_user,
        'public.producer_change_requests',
        'select'
      ) as "canReadChanges",
      has_any_column_privilege(
        session_user,
        'public.producer_change_requests',
        'update'
      ) as "canUpdateChanges",
      has_table_privilege(
        session_user,
        'public.producer_change_requests',
        'delete'
      ) as "canDeleteChanges",
      has_any_column_privilege(
        session_user,
        'public.audit_events',
        'insert'
      ) as "canInsertAudit",
      (
        select bool_and(coalesce(has_function_privilege(session_user, signature, 'execute'), false))
        from unnest(array[
          to_regprocedure('public.chisan_begin_producer_change_execution_v2(uuid,uuid,text,text,text,text,integer,text)'),
          to_regprocedure('public.chisan_complete_producer_change_execution_v2(uuid,text,text[],boolean,text)'),
          to_regprocedure('public.chisan_fail_producer_change_execution_v1(uuid,text,text)'),
          to_regprocedure('public.chisan_fail_producer_change_preflight_v1(uuid,text,text)'),
          to_regprocedure('public.chisan_finalize_producer_change_execution_v2(uuid,text,text,text,text)')
        ]) as workflow(signature)
      ) as "canExecuteAllOperatorWorkflow",
      (
        select bool_or(coalesce(has_function_privilege(session_user, signature, 'execute'), false))
        from unnest(array[
          to_regprocedure('public.chisan_begin_producer_change_execution_v2(uuid,uuid,text,text,text,text,integer,text)'),
          to_regprocedure('public.chisan_complete_producer_change_execution_v2(uuid,text,text[],boolean,text)'),
          to_regprocedure('public.chisan_fail_producer_change_execution_v1(uuid,text,text)'),
          to_regprocedure('public.chisan_fail_producer_change_preflight_v1(uuid,text,text)'),
          to_regprocedure('public.chisan_finalize_producer_change_execution_v2(uuid,text,text,text,text)')
        ]) as workflow(signature)
      ) as "canExecuteAnyOperatorWorkflow",
      has_function_privilege(
        session_user,
        'public.chisan_recover_producer_change_execution_v2(uuid,uuid,text,text,text,text,text)',
        'execute'
      ) as "canExecuteRecovery",
      has_any_column_privilege(session_user, 'public.users', 'update')
        or has_table_privilege(session_user, 'public.users', 'delete')
        or has_any_column_privilege(session_user, 'public.producer_memberships', 'update')
        or has_table_privilege(session_user, 'public.producer_memberships', 'delete')
        or has_any_column_privilege(session_user, 'public.producer_change_executions', 'insert')
        or has_any_column_privilege(session_user, 'public.producer_change_executions', 'update')
        or has_table_privilege(session_user, 'public.producer_change_requests', 'truncate')
        as "canWriteAccountTables"
  `;
  if (!probe)
    throw new Error("Could not inspect the producer-change database role.");
  return probe;
}

function producerChangeAccessProblems(
  access: "read" | "operator" | "recovery",
  probe: ProducerChangeAccessProbe,
): string[] {
  const problems: string[] = [];
  if (!probe.member) {
    problems.push(
      `session user is not a member of ${PRODUCER_CHANGE_DATABASE_ROLES[access]}`,
    );
  }
  if (!probe.schemaUsage) problems.push("USAGE on schema public is missing");
  if (!probe.canReadChanges)
    problems.push("producer-change read access is missing");
  if (probe.schemaCreate)
    problems.push("unexpected CREATE privilege on schema public");
  if (probe.canUpdateChanges)
    problems.push("unexpected direct UPDATE on change requests");
  if (probe.canDeleteChanges)
    problems.push("unexpected DELETE on change requests");
  if (probe.canInsertAudit)
    problems.push("unexpected direct INSERT on audit events");
  if (probe.canWriteAccountTables)
    problems.push("unexpected direct account-table writes");
  if (access === "operator" && !probe.canExecuteAllOperatorWorkflow) {
    problems.push("producer-change workflow functions are not executable");
  }
  if (access !== "operator" && probe.canExecuteAnyOperatorWorkflow) {
    problems.push(
      `${access} credential unexpectedly executes operator workflow functions`,
    );
  }
  if (access === "recovery" && !probe.canExecuteRecovery) {
    problems.push("producer-change recovery function is not executable");
  }
  if (access !== "recovery" && probe.canExecuteRecovery) {
    problems.push(`${access} credential unexpectedly has recovery authority`);
  }
  return problems;
}

async function readOnlyDatabaseOperation<T>(
  database: Database,
  operation: (transaction: Database) => Promise<T>,
): Promise<T> {
  return database.transaction(async (transaction) => {
    await transaction.execute(sql`set transaction read only`);
    await transaction.execute(sql`set local statement_timeout = '15s'`);
    await transaction.execute(
      sql`set local idle_in_transaction_session_timeout = '20s'`,
    );
    return operation(transaction as unknown as Database);
  });
}

async function runCli(): Promise<void> {
  const cliArguments = parseProducerChangeCliArguments(process.argv.slice(2));
  const { command } = cliArguments;
  const changeId =
    command === "show" ||
    command === "materialize" ||
    command === "recover" ||
    command === "finalize"
      ? cliArguments.changeId
      : "";
  const commitSha = command === "finalize" ? cliArguments.commitSha : undefined;

  const databaseCommand =
    command === "doctor"
      ? cliArguments.access === "read"
        ? "list"
        : cliArguments.access === "operator"
          ? "materialize"
          : "recover"
      : command;
  const connectionString = loadProducerChangeDatabaseUrl(databaseCommand);

  const { findProducerById } = await import("../lib/csv-catalog");
  const client = postgres(connectionString, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  const database = drizzle(client, { schema: databaseSchema });
  const access =
    command === "doctor"
      ? cliArguments.access
      : command === "list" || command === "show"
        ? "read"
        : command === "recover"
          ? "recovery"
          : "operator";
  let accessProbe: ProducerChangeAccessProbe;
  try {
    accessProbe = await inspectProducerChangeDatabaseAccess(client, access);
  } catch (error) {
    await client.end().catch(() => undefined);
    throw error;
  }
  const accessProblems = producerChangeAccessProblems(access, accessProbe);
  if (command !== "doctor" && accessProblems.length > 0) {
    await client.end().catch(() => undefined);
    throw new Error(
      `The ${access} database credential failed its capability preflight: ${accessProblems.join(
        "; ",
      )}.`,
    );
  }

  async function getChange(id: string): Promise<ProducerChangeRequest> {
    const [change] = await database
      .select()
      .from(producerChangeRequests)
      .where(eq(producerChangeRequests.id, id))
      .limit(1);
    if (!change) throw new Error(`Change request '${id}' was not found.`);
    return change;
  }

  async function list(): Promise<void> {
    if (cliArguments.command !== "list") {
      throw new Error("Internal CLI command mismatch.");
    }
    const result = await readOnlyDatabaseOperation(database, (transaction) =>
      queryAdminProducerChanges(transaction, {
        status: cliArguments.status,
        query: cliArguments.query,
        page: cliArguments.page,
        pageSize: cliArguments.limit,
      }),
    );
    const data = result.items.map(serializeProducerChangeListItem);

    if (cliArguments.json) {
      process.stdout.write(
        `${JSON.stringify(
          {
            schemaVersion: PRODUCER_CHANGE_AGENT_SCHEMA_VERSION,
            generatedAt: new Date().toISOString(),
            filters: {
              status: result.options.selection.key,
              query: result.options.query,
              page: result.options.page,
              pageSize: result.options.pageSize,
            },
            pagination: {
              total: result.total,
              totalPages: result.totalPages,
            },
            data,
          },
          null,
          2,
        )}\n`,
      );
      return;
    }

    if (data.length === 0) {
      process.stdout.write("No producer change requests found.\n");
      return;
    }
    for (const item of data) {
      process.stdout.write(
        `${item.id} [${item.status.code}] ${item.producer.name} ` +
          `(${item.producer.country.toUpperCase()} #${item.producer.producerId})\n`,
      );
    }
    process.stdout.write(
      `Page ${result.options.page}/${result.totalPages} · ${data.length} of ${result.total} requests\n`,
    );
  }

  async function show(): Promise<void> {
    if (cliArguments.command !== "show") {
      throw new Error("Internal CLI command mismatch.");
    }
    const detail = await readOnlyDatabaseOperation(database, (transaction) =>
      queryAdminProducerChangeById(transaction, cliArguments.changeId),
    );
    if (!detail) {
      throw new Error(
        `Change request '${cliArguments.changeId}' was not found.`,
      );
    }
    const data = serializeProducerChangeDetail(detail);

    if (cliArguments.json) {
      process.stdout.write(
        `${JSON.stringify(
          {
            schemaVersion: PRODUCER_CHANGE_AGENT_SCHEMA_VERSION,
            generatedAt: new Date().toISOString(),
            data,
          },
          null,
          2,
        )}\n`,
      );
      return;
    }

    process.stdout.write(
      `${data.id} [${data.status.code}] ${data.producer.name} ` +
        `(${data.producer.country.toUpperCase()} #${data.producer.producerId})\n`,
    );
    process.stdout.write(
      `Catalog: ${data.catalog.state}${data.producer.publicPath ? ` · ${data.producer.publicPath}` : ""}\n`,
    );
    for (const field of data.diff) {
      const current =
        field.current === null ? "missing" : JSON.stringify(field.current);
      process.stdout.write(
        `${field.key}: ${JSON.stringify(field.before)} -> ${JSON.stringify(field.requested)} ` +
          `(current: ${current})\n`,
      );
    }
    process.stdout.write(`Next: ${data.status.nextAction}\n`);
    if (data.operatorCommands.materialize) {
      process.stdout.write(`Command: ${data.operatorCommands.materialize}\n`);
    }
    if (data.operatorCommands.finalizeTemplate) {
      process.stdout.write(
        `Command: ${data.operatorCommands.finalizeTemplate}\n`,
      );
    }
  }

  async function doctor(): Promise<void> {
    if (cliArguments.command !== "doctor") {
      throw new Error("Internal CLI command mismatch.");
    }
    const result = {
      ok: accessProblems.length === 0,
      access: cliArguments.access,
      expectedRole: PRODUCER_CHANGE_DATABASE_ROLES[cliArguments.access],
      identity: {
        sessionUser: accessProbe.sessionUser,
        currentUser: accessProbe.currentUser,
      },
      capabilities: {
        schemaUsage: accessProbe.schemaUsage,
        schemaCreate: accessProbe.schemaCreate,
        readChanges: accessProbe.canReadChanges,
        directUpdateChanges: accessProbe.canUpdateChanges,
        deleteChanges: accessProbe.canDeleteChanges,
        directInsertAudit: accessProbe.canInsertAudit,
        executeAnyOperatorWorkflow: accessProbe.canExecuteAnyOperatorWorkflow,
        executeAllOperatorWorkflow: accessProbe.canExecuteAllOperatorWorkflow,
        executeRecovery: accessProbe.canExecuteRecovery,
        directAccountTableWrites: accessProbe.canWriteAccountTables,
      },
      problems: accessProblems,
    };

    if (cliArguments.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else if (result.ok) {
      process.stdout.write(
        `Access '${result.access}' is ready as ${result.identity.sessionUser} (${result.expectedRole}).\n`,
      );
    } else {
      process.stdout.write(
        `Access '${result.access}' is not ready: ${result.problems.join("; ")}.\n`,
      );
    }
    if (!result.ok) process.exitCode = 1;
  }

  async function materialize(): Promise<void> {
    const initialChange = await getChange(changeId);
    if (!["approved", "applying"].includes(initialChange.status)) {
      throw new Error(
        `Change request is '${initialChange.status}', not approved for materialization.`,
      );
    }

    async function terminalPreflight(
      outcome: ProducerChangeFailureOutcome,
      reason: string,
    ): Promise<never> {
      await failProducerChangePreflight(client, changeId, outcome, reason);
      throw new Error(reason);
    }

    let expected: ExpectedProducerChange;
    try {
      expected = resolveExpectedProducerChange(
        initialChange.baseSnapshot,
        initialChange.baseRowHash,
        initialChange.patch,
        initialChange.reviewedAt,
        Boolean(initialChange.contentChange),
      );
    } catch (error) {
      return terminalPreflight(
        "failed",
        errorMessage(error, "Stored producer change is invalid."),
      );
    }

    const producer = await findProducerById(
      initialChange.country,
      initialChange.producerId,
    );
    if (!producer) {
      return terminalPreflight(
        "conflict",
        "The producer no longer exists in the CSV catalog.",
      );
    }

    const csvPath = csvPathFor(producer);
    const relativeCsvPath = repoRelativePath(csvPath, process.cwd());
    const gitContext = materializationGitContext();
    const activeExecution = await activeProducerChangeExecution(
      client,
      changeId,
    );
    let contentPublication: Awaited<
      ReturnType<typeof prepareContentPublication>
    > | null = null;
    if (initialChange.contentChange) {
      try {
        const resumeSource =
          activeExecution &&
          activeExecution.sameOperator &&
          activeExecution.worktreeKey === gitContext.worktreeKey &&
          activeExecution.expectedRowHash === expected.hash &&
          activeExecution.expectedContentHash ===
            initialChange.contentChange.requestedHash &&
          (activeExecution.status === "materialized" ||
            activeExecution.leaseExpiresAt.getTime() > Date.now())
            ? activeExecution.sourceHeadSha
            : null;
        contentPublication = await prepareContentPublication(
          initialChange.contentChange,
          initialChange.country,
          initialChange.producerId,
          resumeSource,
        );
      } catch (error) {
        if (error instanceof ProducerContentConflictError)
          return terminalPreflight("conflict", error.message);
        throw error;
      }
    }
    let gitPathError: unknown = null;
    try {
      assertGitPathClean(csvPath);
    } catch (error) {
      gitPathError = error;
    }
    let original: string;
    let currentFields: Record<string, string>;
    try {
      original = await readFile(csvPath, "utf8");
      currentFields = readProducerFieldsFromCsv(
        original,
        initialChange.producerId,
      );
    } catch (error) {
      return terminalPreflight(
        error instanceof ProducerCsvRowNotFoundError ? "conflict" : "failed",
        errorMessage(error, "Could not read the target producer CSV."),
      );
    }

    const currentHash = hashProducerFields(currentFields);
    const alreadyPresent = currentHash === expected.hash;
    if (gitPathError) {
      const resumableDirtyWrite =
        gitPathError instanceof Error &&
        /staged or unstaged changes/i.test(gitPathError.message) &&
        canResumeExactDirtyMaterialization(
          activeExecution,
          gitContext,
          expected.hash,
          relativeCsvPath,
        );
      if (!resumableDirtyWrite || !alreadyPresent || !activeExecution) {
        throw gitPathError;
      }

      const sourceCsv = readCommitBlob(
        activeExecution.sourceHeadSha,
        relativeCsvPath,
        process.cwd(),
      );
      const recoveredPatch = applyProducerPatchToCsv(
        sourceCsv,
        initialChange.producerId,
        expected.patch,
      );
      if (recoveredPatch.csv !== original) {
        throw new Error(
          `Active execution ${activeExecution.id} cannot resume because the dirty CSV is not its exact approved patch.`,
        );
      }
    }
    if (!alreadyPresent && currentHash !== initialChange.baseRowHash) {
      return terminalPreflight(
        "conflict",
        "The CSV row changed after the proposal was submitted.",
      );
    }

    let patched: ProducerCsvPatchResult | null = null;
    if (!alreadyPresent) {
      try {
        patched = applyProducerPatchToCsv(
          original,
          initialChange.producerId,
          expected.patch,
        );
      } catch (error) {
        return terminalPreflight(
          error instanceof ProducerCsvRowNotFoundError ? "conflict" : "failed",
          errorMessage(error, "Could not materialize the producer CSV row."),
        );
      }
      if (hashProducerFields(patched.afterFields) !== expected.hash) {
        return terminalPreflight(
          "failed",
          "The patched CSV row does not match the approved base snapshot and patch.",
        );
      }
    }

    if (activeExecution?.status === "materialized") {
      if (
        activeExecution.expectedRowHash !== expected.hash ||
        (activeExecution.expectedContentHash ?? null) !==
          (initialChange.contentChange?.requestedHash ?? null) ||
        activeExecution.csvPath !== relativeCsvPath
      ) {
        throw new Error(
          `Materialized execution ${activeExecution.id} does not match the current request preflight.`,
        );
      }
      if (contentPublication && !contentPublication.alreadyPresent)
        throw new Error(
          "The materialized execution is missing its approved products.",
        );
      await contentPublication?.assertCurrent();
      auditCsv(csvPath);
      if ((await readFile(csvPath, "utf8")) !== original) {
        throw new Error(
          "The target CSV changed during materialization receipt recovery.",
        );
      }
      process.stdout.write(
        `Change request is already materialized in execution ${activeExecution.id}; finalize its exact commit. If its original operator or worktree is abandoned, recovery staff may run 'pnpm producer:change recover ${changeId} ${activeExecution.id} --reason "<documented reason>"' after the recovery quarantine.\n`,
      );
      return;
    }
    const resumableExecution =
      activeExecution?.status === "leased" &&
      activeExecution.sameOperator &&
      activeExecution.worktreeKey === gitContext.worktreeKey &&
      activeExecution.sourceHeadSha === gitContext.sourceHeadSha &&
      activeExecution.expectedRowHash === expected.hash &&
      (activeExecution.expectedContentHash ?? null) ===
        (initialChange.contentChange?.requestedHash ?? null) &&
      activeExecution.csvPath === relativeCsvPath &&
      activeExecution.leaseExpiresAt.getTime() > Date.now()
        ? activeExecution
        : null;
    const expiredExecution =
      activeExecution?.status === "leased" &&
      activeExecution.leaseExpiresAt.getTime() <= Date.now();
    if (activeExecution && !resumableExecution && !expiredExecution) {
      throw new Error(
        `Active execution ${activeExecution.id} belongs to another operator/worktree or no longer matches this preflight. Wait for its lease to expire or resume it from its original context.`,
      );
    }

    const executionId = resumableExecution?.id ?? randomUUID();
    let execution: ProducerChangeExecutionReceipt;
    try {
      execution = await beginProducerChangeExecution(client, {
        executionId,
        changeId,
        worktreeKey: gitContext.worktreeKey,
        csvPath: relativeCsvPath,
        sourceHeadSha: gitContext.sourceHeadSha,
        expectedRowHash: expected.hash,
        expectedContentHash: initialChange.contentChange?.requestedHash ?? null,
      });
    } catch (error) {
      const reason = errorMessage(
        error,
        "Could not acquire a materialization lease.",
      );
      if (
        /author no longer has active access|entitlement required by this change is no longer active/i.test(
          reason,
        )
      ) {
        await failProducerChangePreflight(client, changeId, "conflict", reason);
      }
      throw error;
    }

    let wroteCsv = false;
    let releaseContentLock: (() => Promise<void>) | undefined;
    try {
      releaseContentLock = await contentPublication?.lock();
      await contentPublication?.write();
      if (patched) {
        const beforeWrite = await readFile(csvPath, "utf8");
        if (beforeWrite !== original) {
          throw new ProducerCsvRowNotFoundError(
            "The target CSV changed after the execution lease was acquired.",
          );
        }
        await atomicWriteUtf8(csvPath, patched.csv);
        wroteCsv = true;
      }

      auditCsv(csvPath);
      const auditedCsv = await readFile(csvPath, "utf8");
      if (auditedCsv !== (patched?.csv ?? original)) {
        throw new Error(
          "The target CSV changed again before its audit completed.",
        );
      }

      await contentPublication?.assertCurrent();
      await completeProducerChangeExecution(
        client,
        execution.executionId,
        expected.hash,
        Object.keys(expected.patch).sort((left, right) =>
          left.localeCompare(right),
        ),
        alreadyPresent &&
          (!contentPublication || contentPublication.alreadyPresent),
        contentPublication?.hash ?? null,
      );
    } catch (error) {
      let reason = errorMessage(error, "CSV materialization failed.");
      let canRestoreCsv = false;
      if (wroteCsv && patched) {
        const currentCsv = await readFile(csvPath, "utf8").catch(() => null);
        if (currentCsv === patched.csv) {
          canRestoreCsv = true;
        } else {
          reason = `${reason} Automatic restoration was skipped because the CSV changed concurrently.`;
        }
      }
      const outcome: ProducerChangeFailureOutcome =
        error instanceof ProducerCsvRowNotFoundError ||
        error instanceof ProducerContentConflictError
          ? "conflict"
          : "failed";
      try {
        // Close and fence this run before touching the CSV again. If another process
        // completed it first, the database function rejects the failure transition.
        await failProducerChangeExecution(
          client,
          execution.executionId,
          outcome,
          reason,
        );
      } catch (failureError) {
        const [storedExecution] = await client<
          {
            status:
              | "leased"
              | "materialized"
              | "finalized"
              | "failed"
              | "expired"
              | "cancelled";
          }[]
        >`
          select status::text as status
          from public.producer_change_executions
          where id = ${execution.executionId}::uuid
        `.catch(() => []);
        if (
          storedExecution?.status === "materialized" ||
          storedExecution?.status === "finalized"
        ) {
          process.stdout.write(
            `Materialized ${relativeCsvPath} in execution ${execution.executionId}; the completion receipt was recovered from PostgreSQL.\n`,
          );
          return;
        }
        if (
          storedExecution?.status === "cancelled" ||
          storedExecution?.status === "expired" ||
          storedExecution?.status === "failed"
        ) {
          await contentPublication?.restore();
          if (canRestoreCsv && patched) {
            const currentCsv = await readFile(csvPath, "utf8").catch(
              () => null,
            );
            if (currentCsv === patched.csv) {
              await atomicWriteUtf8(csvPath, original);
            } else {
              reason = `${reason} Automatic restoration was skipped because the CSV changed after the execution was fenced.`;
            }
          }
          throw new Error(reason);
        }
        throw new Error(
          `${reason} Database state is uncertain, so the CSV was not restored. ` +
            errorMessage(failureError, "Could not fence the failed execution."),
        );
      }

      await contentPublication?.restore();
      if (canRestoreCsv && patched) {
        const currentCsv = await readFile(csvPath, "utf8").catch(() => null);
        if (currentCsv === patched.csv) {
          await atomicWriteUtf8(csvPath, original);
        } else {
          reason = `${reason} Automatic restoration was skipped because the CSV changed after the execution was fenced.`;
        }
      }
      throw new Error(reason);
    } finally {
      await releaseContentLock?.();
    }

    if (contentPublication)
      process.stdout.write(
        `Products: ${contentPublication.relativePath}. Include the JSON in the same reviewed commit.\n`,
      );
    const message = alreadyPresent
      ? `CSV already contains the approved patch and passed its audit in execution ${execution.executionId}. Run pnpm verify:data, then finalize with the exact commit that introduced the approved state.`
      : `Updated ${relativeCsvPath} in execution ${execution.executionId}. Review the diff, run pnpm verify:data, commit it, then finalize with the commit SHA.`;
    process.stdout.write(`${message}\n`);
  }

  async function recover(): Promise<void> {
    if (cliArguments.command !== "recover") {
      throw new Error("Internal CLI command mismatch.");
    }
    const initialChange = await getChange(changeId);
    if (!["applying", "approved", "conflict"].includes(initialChange.status)) {
      throw new Error(
        `Change request is '${initialChange.status}', not awaiting materialization recovery.`,
      );
    }
    const expected = resolveExpectedProducerChange(
      initialChange.baseSnapshot,
      initialChange.baseRowHash,
      initialChange.patch,
      initialChange.reviewedAt,
      Boolean(initialChange.contentChange),
    );
    const execution = await recoveryProducerChangeExecution(
      client,
      changeId,
      cliArguments.executionId,
    );
    if (!execution) {
      throw new Error(
        "The exact materialized or recovered execution was not found.",
      );
    }
    const pendingRecovery =
      initialChange.status === "applying" &&
      execution.status === "materialized";
    const idempotentRecovery =
      (initialChange.status === "approved" ||
        initialChange.status === "conflict") &&
      execution.status === "cancelled";
    if (!pendingRecovery && !idempotentRecovery) {
      throw new Error(
        `Request '${initialChange.status}' and execution '${execution.status}' do not form a recoverable or idempotent receipt.`,
      );
    }
    if (
      execution.expectedRowHash !== expected.hash ||
      (execution.expectedContentHash ?? null) !==
        (initialChange.contentChange?.requestedHash ?? null)
    ) {
      throw new Error(
        "The materialized execution does not match the approved patch.",
      );
    }

    const csvPath = path.resolve(process.cwd(), execution.csvPath);
    if (repoRelativePath(csvPath, process.cwd()) !== execution.csvPath) {
      throw new Error(
        "The materialized execution contains a non-canonical CSV path.",
      );
    }
    assertGitPathClean(csvPath);
    const gitContext = materializationGitContext();
    const currentCsv = await readFile(csvPath, "utf8");
    auditCsv(csvPath);
    if ((await readFile(csvPath, "utf8")) !== currentCsv) {
      throw new Error("The target CSV changed during recovery preflight.");
    }
    if (
      readCommitBlob(
        gitContext.sourceHeadSha,
        execution.csvPath,
        process.cwd(),
      ) !== currentCsv
    ) {
      throw new Error(
        "The clean target CSV does not match the captured Git HEAD.",
      );
    }

    const observedRowHash = hashProducerFields(
      readProducerFieldsFromCsv(currentCsv, initialChange.producerId),
    );
    if (
      observedRowHash !== expected.hash &&
      observedRowHash !== initialChange.baseRowHash
    ) {
      throw new Error(
        "Recovery refused: canonical HEAD contains neither the reviewed base row nor the exact approved row.",
      );
    }

    let observedContentHash: string | null = null;
    if (initialChange.contentChange) {
      const { change } = resolveProducerContentChange(
        initialChange.contentChange,
        initialChange.country,
        initialChange.producerId,
      );
      const contentPath = producerContentPath(
        initialChange.country,
        initialChange.producerId,
      );
      const raw = await readOptionalContent(contentPath);
      assertGitPathClean(contentPath, process.cwd(), raw === null);
      observedContentHash = hashProducerContent(
        raw === null
          ? emptyProducerContent(
              initialChange.country,
              initialChange.producerId,
            )
          : producerContentSchema.parse(JSON.parse(raw)),
      );
      if (
        ![change.baseHash, change.requestedHash].includes(observedContentHash)
      )
        throw new Error("Recovery refused: the product package has diverged.");
    }
    const recoveredExecutionId = await recoverProducerChangeExecution(client, {
      changeId,
      executionId: execution.id,
      worktreeKey: gitContext.worktreeKey,
      sourceHeadSha: gitContext.sourceHeadSha,
      observedRowHash,
      observedContentHash,
      reason: cliArguments.reason,
    });
    const recoveredChange = await getChange(changeId);
    if (recoveredChange.status === "approved") {
      process.stdout.write(
        `Recovered materialized execution ${recoveredExecutionId}; request ${changeId} is approved again. Switch to an operator credential and run materialize from a controlled worktree.\n`,
      );
    } else if (recoveredChange.status === "conflict") {
      process.stdout.write(
        `Cancelled materialized execution ${recoveredExecutionId}; request ${changeId} is conflict because producer access is no longer active.\n`,
      );
    } else {
      throw new Error(
        `Recovery returned an unexpected request status '${recoveredChange.status}'.`,
      );
    }
  }

  async function finalize(): Promise<void> {
    if (!commitSha)
      throw new Error("Finalize requires the materializing commit SHA.");
    const normalizedCommit = commitSha.toLowerCase();
    const initialChange = await getChange(changeId);
    const idempotentFinalize =
      initialChange.status === "applied" &&
      initialChange.appliedCommitSha === normalizedCommit;
    if (!idempotentFinalize && initialChange.status !== "applying") {
      throw new Error(
        `Change request is '${initialChange.status}', not awaiting finalization.`,
      );
    }
    const expected = resolveExpectedProducerChange(
      initialChange.baseSnapshot,
      initialChange.baseRowHash,
      initialChange.patch,
      initialChange.reviewedAt,
      Boolean(initialChange.contentChange),
    );
    const execution = await finalizationProducerChangeExecution(
      client,
      changeId,
    );
    if (!execution) {
      throw new Error(
        "No materialized execution owns this producer change request.",
      );
    }
    if (!execution.sameOperator) {
      throw new Error(
        `Producer-change execution belongs to another operator. If it is abandoned, recovery staff may run 'pnpm producer:change recover ${changeId} ${execution.id} --reason "<documented reason>"' after the recovery quarantine.`,
      );
    }
    if (
      execution.expectedRowHash !== expected.hash ||
      (execution.expectedContentHash ?? null) !==
        (initialChange.contentChange?.requestedHash ?? null) ||
      (execution.status === "finalized" &&
        execution.appliedCommitSha !== normalizedCommit)
    ) {
      throw new Error(
        "The stored execution does not match this finalization request.",
      );
    }

    const currentGitContext = materializationGitContext();
    if (execution.worktreeKey !== currentGitContext.worktreeKey) {
      throw new Error(
        `Finalize must run from the worktree that materialized this execution. If it is abandoned, recovery staff may run 'pnpm producer:change recover ${changeId} ${execution.id} --reason "<documented reason>"' after the recovery quarantine.`,
      );
    }
    const commitState = assertFinalizationGitState(
      normalizedCommit,
      execution.sourceHeadSha,
      execution.csvPath,
      initialChange.producerId,
      expected.hash,
      process.cwd(),
      initialChange.contentChange
        ? {
            baseRowHash: initialChange.baseRowHash,
            relativePath: repoRelativePath(
              producerContentPath(
                initialChange.country,
                initialChange.producerId,
              ),
              process.cwd(),
            ),
            hash: resolveProducerContentChange(
              initialChange.contentChange,
              initialChange.country,
              initialChange.producerId,
            ).change.requestedHash,
          }
        : undefined,
    );
    const finalGitContext = materializationGitContext();
    if (
      currentGitContext.sourceHeadSha !== commitState.headCommit ||
      finalGitContext.sourceHeadSha !== commitState.headCommit ||
      finalGitContext.worktreeKey !== execution.worktreeKey
    ) {
      throw new Error(
        "The current HEAD changed during finalization preflight.",
      );
    }

    if (idempotentFinalize) {
      process.stdout.write(
        "Change request was already finalized with this commit.\n",
      );
      return;
    }

    let executionId: string;
    try {
      executionId = await finalizeProducerChangeExecution(client, {
        changeId,
        commitSha: commitState.commit,
        csvPath: commitState.relativeCsvPath,
        expectedRowHash: expected.hash,
        expectedContentHash: initialChange.contentChange?.requestedHash ?? null,
      });
    } catch (error) {
      const reason = errorMessage(
        error,
        "Could not finalize the producer change.",
      );
      if (/author no longer has active access/i.test(reason)) {
        await failProducerChangePreflight(client, changeId, "conflict", reason);
      }
      throw error;
    }
    process.stdout.write(
      `Finalized change request ${initialChange.id} in execution ${executionId} at ${commitState.commit}.\n`,
    );
  }

  try {
    if (command === "list") await list();
    else if (command === "show") await show();
    else if (command === "materialize") await materialize();
    else if (command === "recover") await recover();
    else if (command === "finalize") await finalize();
    else await doctor();
  } finally {
    await client.end();
  }
}

const entryPoint = process.argv[1];
if (
  entryPoint &&
  import.meta.url === pathToFileURL(path.resolve(entryPoint)).href
) {
  void runCli().catch((error: unknown) => {
    const rendered = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${rendered}\n`);
    process.exitCode = 1;
  });
}
