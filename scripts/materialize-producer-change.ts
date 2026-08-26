import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  chmod,
  open,
  readFile,
  rename,
  stat,
  unlink,
} from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { eq, sql } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import postgres, { type Sql } from "postgres";

import {
  hashProducerFields,
  isProducerPatch,
  type ProducerPatch,
  validateProducerProposal,
} from "../lib/accounts/producer-fields";
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

type ParsedCsvRecord = {
  record: string[];
  raw: string;
};

type LocatedCsvProducer = {
  columns: string[];
  fields: Record<string, string>;
  record: string[];
  raw: string;
  rawStart: number;
  rawEnd: number;
};

export type ProducerCsvPatchResult = {
  csv: string;
  beforeFields: Record<string, string>;
  afterFields: Record<string, string>;
};

export type ExpectedProducerChange = {
  patch: ProducerPatch;
  fields: Record<string, string>;
  hash: string;
};

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
  | { command: "recover"; changeId: string; executionId: string; reason: string }
  | { command: "finalize"; changeId: string; commitSha: string }
  | { command: "doctor"; access: "read" | "operator" | "recovery"; json: boolean };

const CLI_USAGE =
  "Usage: pnpm producer:change materialize <change-id> | finalize <change-id> <commit-sha>\n" +
  "       pnpm producer:change recover <change-id> <execution-id> --reason <text>\n" +
  "       pnpm producer:change list [--status <view-or-status>] [--query <text>] [--limit <n>] [--page <n>] [--json]\n" +
  "       pnpm producer:change show <change-id> [--json]\n" +
  "       pnpm producer:change doctor --access <read|operator|recovery> [--json]";

const CHANGE_REQUEST_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parsePositiveIntegerOption(flag: string, value: string | undefined): number {
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
      throw new Error("Recover requires the exact materialized execution UUID.");
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
      if (![
        "--status",
        "--query",
        "--limit",
        "--page",
        "--json",
      ].includes(token)) {
        throw new Error(`Unknown list option '${token}'.`);
      }
      if (seen.has(token)) throw new Error(`${token} may only be specified once.`);
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

class ProducerCsvRowNotFoundError extends Error {}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message.trim() ? error.message : fallback;
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.values(value as Record<string, unknown>).every(
      (fieldValue) => typeof fieldValue === "string",
    )
  );
}

function isBlankCsvRecord(record: readonly string[]): boolean {
  return record.every((value) => value === "");
}

function locateProducerInCsv(csv: string, producerId: number): LocatedCsvProducer {
  if (!Number.isSafeInteger(producerId) || producerId <= 0) {
    throw new Error("producer_id must be a positive safe integer.");
  }

  const parsed = parse(csv, {
    bom: true,
    info: true,
    raw: true,
    relax_column_count: true,
    skip_empty_lines: false,
  }) as unknown as ParsedCsvRecord[];
  const header = parsed.find(({ record }) => !isBlankCsvRecord(record));
  if (!header) throw new Error("The producer CSV is empty.");

  const columns = header.record;
  if (columns.some((column) => !column)) {
    throw new Error("The producer CSV contains an empty header column.");
  }
  if (new Set(columns).size !== columns.length) {
    throw new Error("The producer CSV contains duplicate header columns.");
  }

  const producerIdIndex = columns.indexOf("producer_id");
  if (producerIdIndex < 0) {
    throw new Error("The producer CSV is missing the producer_id column.");
  }

  let cursor = 0;
  let match: LocatedCsvProducer | null = null;
  for (const entry of parsed) {
    const rawStart = csv.indexOf(entry.raw, cursor);
    if (rawStart < 0) {
      throw new Error("Could not map a parsed CSV row back to the source bytes.");
    }
    const rawEnd = rawStart + entry.raw.length;
    cursor = rawEnd;

    if (entry === header || isBlankCsvRecord(entry.record)) continue;
    if (entry.record.length !== columns.length) {
      throw new Error(
        `The producer CSV contains a row with ${entry.record.length} fields; expected ${columns.length}.`,
      );
    }
    if (entry.record[producerIdIndex]?.trim() !== String(producerId)) continue;
    if (match) {
      throw new Error(`producer_id '${producerId}' appears more than once in the CSV.`);
    }

    match = {
      columns,
      fields: Object.fromEntries(
        columns.map((column, index) => [column, entry.record[index] ?? ""]),
      ),
      record: entry.record,
      raw: entry.raw,
      rawStart,
      rawEnd,
    };
  }

  if (!match) {
    throw new ProducerCsvRowNotFoundError(
      `producer_id '${producerId}' does not exist in the target CSV.`,
    );
  }
  return match;
}

function recordDelimiter(raw: string): string {
  if (raw.endsWith("\r\n")) return "\r\n";
  if (raw.endsWith("\n")) return "\n";
  if (raw.endsWith("\r")) return "\r";
  return "";
}

export function readProducerFieldsFromCsv(
  csv: string,
  producerId: number,
): Record<string, string> {
  return locateProducerInCsv(csv, producerId).fields;
}

/** Re-serializes only the requested producer row and preserves every other byte. */
export function applyProducerPatchToCsv(
  csv: string,
  producerId: number,
  patch: Readonly<Record<string, string>>,
): ProducerCsvPatchResult {
  const located = locateProducerInCsv(csv, producerId);
  const nextRecord = [...located.record];

  for (const [field, value] of Object.entries(patch)) {
    const columnIndex = located.columns.indexOf(field);
    if (columnIndex < 0) {
      throw new Error(`CSV column '${field}' is missing.`);
    }
    if (field === "producer_id") {
      throw new Error("producer_id is immutable and cannot be materialized.");
    }
    nextRecord[columnIndex] = value;
  }

  const delimiter = recordDelimiter(located.raw);
  let nextRaw = stringify([nextRecord], {
    header: false,
    record_delimiter: delimiter || "\n",
  });
  if (!delimiter) nextRaw = nextRaw.slice(0, -1);

  const nextCsv = `${csv.slice(0, located.rawStart)}${nextRaw}${csv.slice(located.rawEnd)}`;
  const afterFields = Object.fromEntries(
    located.columns.map((column, index) => [column, nextRecord[index] ?? ""]),
  );

  return {
    csv: nextCsv,
    beforeFields: located.fields,
    afterFields,
  };
}

/** Derives the sole expected state from the immutable submission snapshot and patch. */
export function resolveExpectedProducerChange(
  baseSnapshot: unknown,
  baseRowHash: string,
  patch: unknown,
): ExpectedProducerChange {
  if (!isStringRecord(baseSnapshot)) {
    throw new Error("The stored base snapshot is not a string-valued object.");
  }
  if (!/^[0-9a-f]{64}$/.test(baseRowHash)) {
    throw new Error("The stored base-row hash is malformed.");
  }
  if (hashProducerFields(baseSnapshot) !== baseRowHash) {
    throw new Error("The stored base snapshot does not match its row hash.");
  }
  if (!isProducerPatch(patch) || Object.keys(patch).length === 0) {
    throw new Error("The stored patch is empty or contains a non-editable field.");
  }

  const validation = validateProducerProposal(
    { ...baseSnapshot, ...patch },
    baseSnapshot,
  );
  if (!validation.ok) {
    throw new Error(Object.values(validation.errors)[0] ?? "Stored patch is invalid.");
  }
  if (Object.keys(validation.patch).length === 0) {
    throw new Error("The stored patch does not change the base snapshot.");
  }

  const fields = { ...baseSnapshot, ...validation.patch };
  return {
    patch: validation.patch,
    fields,
    hash: hashProducerFields(fields),
  };
}

function repoRelativePath(filePath: string, cwd: string): string {
  const relative = path.isAbsolute(filePath)
    ? path.relative(cwd, filePath)
    : path.normalize(filePath);
  if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`)) {
    throw new Error("The CSV path must be inside the Git worktree.");
  }
  return relative.split(path.sep).join("/").replace(/^\.\//, "");
}

function runGit(
  args: readonly string[],
  cwd: string,
): SpawnSyncReturns<string> {
  return spawnSync("git", [...args], {
    cwd,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
}

function gitFailure(result: SpawnSyncReturns<string>, fallback: string): Error {
  return new Error((result.stderr || result.stdout || result.error?.message || fallback).trim());
}

function gitOutput(args: readonly string[], cwd: string, fallback: string): string {
  const result = runGit(args, cwd);
  if (result.status !== 0 || !result.stdout.trim()) throw gitFailure(result, fallback);
  return result.stdout.trim();
}

export function materializationGitContext(cwd = process.cwd()): {
  sourceHeadSha: string;
  worktreeKey: string;
} {
  const sourceHeadSha = gitOutput(
    ["rev-parse", "--verify", "HEAD"],
    cwd,
    "Could not resolve the materialization source HEAD.",
  ).toLowerCase();
  if (!/^[0-9a-f]{40}$/.test(sourceHeadSha)) {
    throw new Error("The materialization source HEAD is not a full Git SHA.");
  }
  const worktreeRoot = path.resolve(
    gitOutput(
      ["rev-parse", "--show-toplevel"],
      cwd,
      "Could not resolve the materialization worktree.",
    ),
  );
  return {
    sourceHeadSha,
    worktreeKey: createHash("sha256").update(worktreeRoot).digest("hex"),
  };
}

export function assertGitPathClean(filePath: string, cwd = process.cwd()): void {
  const relative = repoRelativePath(filePath, cwd);
  const tracked = runGit(["ls-files", "--error-unmatch", "--", relative], cwd);
  if (tracked.status !== 0) {
    throw gitFailure(tracked, `Target CSV '${relative}' is not tracked by Git.`);
  }

  const status = runGit(
    ["status", "--porcelain=v1", "--untracked-files=all", "--", relative],
    cwd,
  );
  if (status.status !== 0) {
    throw gitFailure(status, `Could not inspect Git status for '${relative}'.`);
  }
  if (status.stdout.length > 0) {
    throw new Error(
      `Target CSV '${relative}' has staged or unstaged changes; clean it before materializing.`,
    );
  }
}

export type CommitProducerState = {
  commit: string;
  relativeCsvPath: string;
  fields: Record<string, string>;
};

function validateCommitAncestor(commit: string, cwd: string): string {
  if (!/^[0-9a-f]{40}$/i.test(commit)) {
    throw new Error("Finalize requires a full 40-character Git commit SHA.");
  }

  const normalizedCommit = commit.toLowerCase();
  const verified = runGit(["rev-parse", "--verify", `${normalizedCommit}^{commit}`], cwd);
  if (verified.status !== 0 || verified.stdout.trim().toLowerCase() !== normalizedCommit) {
    throw gitFailure(verified, "The supplied Git commit does not exist.");
  }

  const ancestor = runGit(["merge-base", "--is-ancestor", normalizedCommit, "HEAD"], cwd);
  if (ancestor.status === 1) {
    throw new Error("The supplied commit is not an ancestor of the current HEAD.");
  }
  if (ancestor.status !== 0) {
    throw gitFailure(ancestor, "Could not verify the supplied commit ancestry.");
  }
  return normalizedCommit;
}

function assertGitAncestor(
  ancestor: string,
  descendant: string,
  cwd: string,
  failureMessage: string,
): void {
  const result = runGit(["merge-base", "--is-ancestor", ancestor, descendant], cwd);
  if (result.status === 1) throw new Error(failureMessage);
  if (result.status !== 0) {
    throw gitFailure(result, "Could not verify the producer-change commit ancestry.");
  }
}

function validateStoredCommit(commit: string, cwd: string, label: string): string {
  if (!/^[0-9a-f]{40}$/i.test(commit)) {
    throw new Error(`${label} is not a full 40-character Git commit SHA.`);
  }
  const normalized = commit.toLowerCase();
  const verified = runGit(["rev-parse", "--verify", `${normalized}^{commit}`], cwd);
  if (verified.status !== 0 || verified.stdout.trim().toLowerCase() !== normalized) {
    throw gitFailure(verified, `${label} does not exist in this repository.`);
  }
  return normalized;
}

function assertCommitModifiesPath(
  commit: string,
  relativeCsvPath: string,
  cwd: string,
): void {
  const changed = runGit(
    [
      "diff-tree",
      "-m",
      "--root",
      "--no-commit-id",
      "--name-only",
      "-r",
      commit,
      "--",
      relativeCsvPath,
    ],
    cwd,
  );
  if (changed.status !== 0 || !changed.stdout.split("\n").includes(relativeCsvPath)) {
    throw gitFailure(changed, "The supplied commit does not modify the producer CSV.");
  }
}

function readCommitBlob(commit: string, relativeCsvPath: string, cwd: string): string {
  const blob = runGit(["show", `${commit}:${relativeCsvPath}`], cwd);
  if (blob.status !== 0) {
    throw gitFailure(blob, "The producer CSV blob does not exist in the supplied commit.");
  }
  return blob.stdout;
}

function assertExpectedProducerHash(
  fields: Record<string, string>,
  expectedHash: string,
): void {
  if (!/^[0-9a-f]{64}$/.test(expectedHash)) {
    throw new Error("The expected producer hash is malformed.");
  }
  if (hashProducerFields(fields) !== expectedHash) {
    throw new Error("The producer row in the supplied commit does not match the approved patch.");
  }
}

function producerHashAtCommitPath(
  commit: string,
  relativeCsvPath: string,
  producerId: number,
  cwd: string,
): string | null {
  const blob = runGit(["show", `${commit}:${relativeCsvPath}`], cwd);
  if (blob.status !== 0) return null;
  try {
    return hashProducerFields(readProducerFieldsFromCsv(blob.stdout, producerId));
  } catch (error) {
    if (error instanceof ProducerCsvRowNotFoundError) return null;
    throw error;
  }
}

function assertCommitIntroducesProducerState(
  commit: string,
  relativeCsvPath: string,
  producerId: number,
  expectedHash: string,
  cwd: string,
): void {
  const parents = gitOutput(
    ["rev-list", "--parents", "-n", "1", commit],
    cwd,
    "Could not inspect the materializing commit parent.",
  )
    .split(/\s+/)
    .slice(1);
  if (parents.length === 0) return;
  if (
    producerHashAtCommitPath(parents[0], relativeCsvPath, producerId, cwd) ===
    expectedHash
  ) {
    throw new Error(
      "The supplied commit did not introduce the approved producer state; its first parent already contained it.",
    );
  }
}

/** Validates the producer row from a known commit blob, never from the working tree. */
export function assertCommitContainsProducerState(
  commit: string,
  csvPath: string,
  producerId: number,
  expectedHash: string,
  cwd = process.cwd(),
): CommitProducerState {
  const normalizedCommit = validateCommitAncestor(commit, cwd);
  const relativeCsvPath = repoRelativePath(csvPath, cwd);
  assertCommitModifiesPath(normalizedCommit, relativeCsvPath, cwd);
  const fields = readProducerFieldsFromCsv(
    readCommitBlob(normalizedCommit, relativeCsvPath, cwd),
    producerId,
  );
  assertExpectedProducerHash(fields, expectedHash);

  return { commit: normalizedCommit, relativeCsvPath, fields };
}

export type FinalizationGitState = CommitProducerState & {
  headCommit: string;
  sourceHeadCommit: string;
};

/**
 * Proves that an execution, its materializing commit and the current HEAD share
 * one history, and that HEAD still publishes the exact approved producer row.
 */
export function assertFinalizationGitState(
  commit: string,
  sourceHeadSha: string,
  csvPath: string,
  producerId: number,
  expectedHash: string,
  cwd = process.cwd(),
): FinalizationGitState {
  const commitState = assertCommitContainsProducerState(
    commit,
    csvPath,
    producerId,
    expectedHash,
    cwd,
  );
  assertCommitIntroducesProducerState(
    commitState.commit,
    commitState.relativeCsvPath,
    producerId,
    expectedHash,
    cwd,
  );
  const sourceHeadCommit = validateStoredCommit(
    sourceHeadSha,
    cwd,
    "The execution source HEAD",
  );
  const headCommit = gitOutput(
    ["rev-parse", "--verify", "HEAD^{commit}"],
    cwd,
    "Could not resolve the current Git HEAD.",
  ).toLowerCase();

  assertGitAncestor(
    sourceHeadCommit,
    headCommit,
    cwd,
    "The current HEAD no longer descends from the execution source HEAD.",
  );

  const sourcePrecedesCommit =
    runGit(["merge-base", "--is-ancestor", sourceHeadCommit, commitState.commit], cwd)
      .status === 0;
  const commitPrecedesSource =
    runGit(["merge-base", "--is-ancestor", commitState.commit, sourceHeadCommit], cwd)
      .status === 0;
  if (!sourcePrecedesCommit && !commitPrecedesSource) {
    throw new Error(
      "The materializing commit and execution source HEAD are on different histories.",
    );
  }

  // Recovery may begin after the approved row was already committed. In that
  // case the supplied materializing commit precedes source HEAD, so prove the
  // immutable source HEAD already contained the same approved row.
  if (!sourcePrecedesCommit) {
    const sourceFields = readProducerFieldsFromCsv(
      readCommitBlob(sourceHeadCommit, commitState.relativeCsvPath, cwd),
      producerId,
    );
    assertExpectedProducerHash(sourceFields, expectedHash);
  }

  const headFields = readProducerFieldsFromCsv(
    readCommitBlob(headCommit, commitState.relativeCsvPath, cwd),
    producerId,
  );
  assertExpectedProducerHash(headFields, expectedHash);
  return { ...commitState, headCommit, sourceHeadCommit };
}

/** Locates the producer inside the immutable country tree at the supplied commit. */
export function findProducerStateInCommit(
  commit: string,
  country: string,
  producerId: number,
  expectedHash: string,
  cwd = process.cwd(),
): CommitProducerState {
  if (!/^[a-z]{2}$/.test(country)) {
    throw new Error("The producer country must be a lowercase ISO alpha-2 code.");
  }
  const normalizedCommit = validateCommitAncestor(commit, cwd);
  const countryPrefix = `data/csv/${country}/`;
  const tree = runGit(
    ["ls-tree", "-r", "--name-only", normalizedCommit, "--", countryPrefix],
    cwd,
  );
  if (tree.status !== 0) {
    throw gitFailure(tree, "Could not inspect the producer CSV tree in the supplied commit.");
  }

  let found: CommitProducerState | null = null;
  for (const relativeCsvPath of tree.stdout
    .split("\n")
    .filter((entry) => entry.startsWith(countryPrefix) && entry.endsWith(".csv"))) {
    let fields: Record<string, string>;
    try {
      fields = readProducerFieldsFromCsv(
        readCommitBlob(normalizedCommit, relativeCsvPath, cwd),
        producerId,
      );
    } catch (error) {
      if (error instanceof ProducerCsvRowNotFoundError) continue;
      throw error;
    }
    if (found) {
      throw new Error(
        `producer_id '${producerId}' appears in multiple CSVs at commit ${normalizedCommit}.`,
      );
    }
    found = { commit: normalizedCommit, relativeCsvPath, fields };
  }

  if (!found) {
    throw new Error(
      `producer_id '${producerId}' does not exist in country '${country}' at the supplied commit.`,
    );
  }
  assertCommitModifiesPath(normalizedCommit, found.relativeCsvPath, cwd);
  assertExpectedProducerHash(found.fields, expectedHash);
  return found;
}

/** Writes a same-directory temporary file and swaps it into place atomically. */
export async function atomicWriteUtf8(filePath: string, contents: string): Promise<void> {
  const fileStats = await stat(filePath);
  const directory = path.dirname(filePath);
  const temporaryPath = path.join(
    directory,
    `.${path.basename(filePath)}.${process.pid}.${randomUUID()}.tmp`,
  );
  let handle: Awaited<ReturnType<typeof open>> | null = null;
  let renamed = false;

  try {
    handle = await open(temporaryPath, "wx", fileStats.mode & 0o777);
    await chmod(temporaryPath, fileStats.mode & 0o777);
    await handle.writeFile(contents, "utf8");
    await handle.sync();
    await handle.close();
    handle = null;
    await rename(temporaryPath, filePath);
    renamed = true;

    // A directory fsync is unavailable on some filesystems. The rename remains atomic.
    try {
      const directoryHandle = await open(directory, "r");
      try {
        await directoryHandle.sync();
      } finally {
        await directoryHandle.close();
      }
    } catch {
      // Best-effort durability after the atomic rename.
    }
  } finally {
    if (handle) await handle.close().catch(() => undefined);
    if (!renamed) await unlink(temporaryPath).catch(() => undefined);
  }
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
      (execution.status === "materialized" || execution.leaseExpiresAt.getTime() > now),
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
  return code.startsWith("08") || ["ECONNRESET", "ETIMEDOUT", "EPIPE"].includes(code);
}

async function retryDatabaseReceipt<T>(operation: () => Promise<T>): Promise<T> {
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
  },
): Promise<ProducerChangeExecutionReceipt> {
  const [receipt] = await retryDatabaseReceipt(() =>
    client<ProducerChangeExecutionReceipt[]>`
      select *
      from public.chisan_begin_producer_change_execution_v1(
        ${input.executionId}::uuid,
        ${input.changeId}::uuid,
        ${input.worktreeKey},
        ${input.csvPath},
        ${input.sourceHeadSha},
        ${input.expectedRowHash},
        900
      )
    `,
  );
  if (!receipt) throw new Error("The database did not return an execution receipt.");
  return receipt;
}

async function completeProducerChangeExecution(
  client: Sql,
  executionId: string,
  expectedRowHash: string,
  fields: string[],
  alreadyPresent: boolean,
): Promise<void> {
  await retryDatabaseReceipt(() =>
    client`
      select public.chisan_complete_producer_change_execution_v1(
        ${executionId}::uuid,
        ${expectedRowHash},
        ${client.array(fields)}::text[],
        ${alreadyPresent}
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
  },
): Promise<string> {
  const [receipt] = await retryDatabaseReceipt(() =>
    client<{ executionId: string }[]>`
      select public.chisan_finalize_producer_change_execution_v1(
        ${input.changeId}::uuid,
        ${input.commitSha},
        ${input.csvPath},
        ${input.expectedRowHash}
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
    reason: string;
  },
): Promise<string> {
  const [receipt] = await retryDatabaseReceipt(() =>
    client<{ executionId: string }[]>`
      select public.chisan_recover_producer_change_execution_v1(
        ${input.changeId}::uuid,
        ${input.executionId}::uuid,
        ${input.worktreeKey},
        ${input.sourceHeadSha},
        ${input.observedRowHash},
        ${input.reason}
      ) as "executionId"
    `,
  );
  if (!receipt?.executionId) {
    throw new Error("The database did not return a recovery receipt.");
  }
  return receipt.executionId;
}

function csvPathFor(producer: { country: string; region: string; area: string }): string {
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
    throw new Error((audit.stderr || audit.stdout || "CSV audit failed.").trim());
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
          to_regprocedure('public.chisan_begin_producer_change_execution_v1(uuid,uuid,text,text,text,text,integer)'),
          to_regprocedure('public.chisan_complete_producer_change_execution_v1(uuid,text,text[],boolean)'),
          to_regprocedure('public.chisan_fail_producer_change_execution_v1(uuid,text,text)'),
          to_regprocedure('public.chisan_fail_producer_change_preflight_v1(uuid,text,text)'),
          to_regprocedure('public.chisan_finalize_producer_change_execution_v1(uuid,text,text,text)')
        ]) as workflow(signature)
      ) as "canExecuteAllOperatorWorkflow",
      (
        select bool_or(coalesce(has_function_privilege(session_user, signature, 'execute'), false))
        from unnest(array[
          to_regprocedure('public.chisan_begin_producer_change_execution_v1(uuid,uuid,text,text,text,text,integer)'),
          to_regprocedure('public.chisan_complete_producer_change_execution_v1(uuid,text,text[],boolean)'),
          to_regprocedure('public.chisan_fail_producer_change_execution_v1(uuid,text,text)'),
          to_regprocedure('public.chisan_fail_producer_change_preflight_v1(uuid,text,text)'),
          to_regprocedure('public.chisan_finalize_producer_change_execution_v1(uuid,text,text,text)')
        ]) as workflow(signature)
      ) as "canExecuteAnyOperatorWorkflow",
      has_function_privilege(
        session_user,
        'public.chisan_recover_producer_change_execution_v1(uuid,uuid,text,text,text,text)',
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
  if (!probe) throw new Error("Could not inspect the producer-change database role.");
  return probe;
}

function producerChangeAccessProblems(
  access: "read" | "operator" | "recovery",
  probe: ProducerChangeAccessProbe,
): string[] {
  const problems: string[] = [];
  if (!probe.member) {
    problems.push(`session user is not a member of ${PRODUCER_CHANGE_DATABASE_ROLES[access]}`);
  }
  if (!probe.schemaUsage) problems.push("USAGE on schema public is missing");
  if (!probe.canReadChanges) problems.push("producer-change read access is missing");
  if (probe.schemaCreate) problems.push("unexpected CREATE privilege on schema public");
  if (probe.canUpdateChanges) problems.push("unexpected direct UPDATE on change requests");
  if (probe.canDeleteChanges) problems.push("unexpected DELETE on change requests");
  if (probe.canInsertAudit) problems.push("unexpected direct INSERT on audit events");
  if (probe.canWriteAccountTables) problems.push("unexpected direct account-table writes");
  if (access === "operator" && !probe.canExecuteAllOperatorWorkflow) {
    problems.push("producer-change workflow functions are not executable");
  }
  if (access !== "operator" && probe.canExecuteAnyOperatorWorkflow) {
    problems.push(`${access} credential unexpectedly executes operator workflow functions`);
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
    await transaction.execute(sql`set local idle_in_transaction_session_timeout = '20s'`);
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
      throw new Error(`Change request '${cliArguments.changeId}' was not found.`);
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
      const current = field.current === null ? "missing" : JSON.stringify(field.current);
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
      process.stdout.write(`Command: ${data.operatorCommands.finalizeTemplate}\n`);
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
    const activeExecution = await activeProducerChangeExecution(client, changeId);
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
      currentFields = readProducerFieldsFromCsv(original, initialChange.producerId);
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
        activeExecution.csvPath !== relativeCsvPath
      ) {
        throw new Error(
          `Materialized execution ${activeExecution.id} does not match the current request preflight.`,
        );
      }
      auditCsv(csvPath);
      if ((await readFile(csvPath, "utf8")) !== original) {
        throw new Error("The target CSV changed during materialization receipt recovery.");
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
      });
    } catch (error) {
      const reason = errorMessage(error, "Could not acquire a materialization lease.");
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
    try {
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
        throw new Error("The target CSV changed again before its audit completed.");
      }

      await completeProducerChangeExecution(
        client,
        execution.executionId,
        expected.hash,
        Object.keys(expected.patch).sort((left, right) => left.localeCompare(right)),
        alreadyPresent,
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
        error instanceof ProducerCsvRowNotFoundError ? "conflict" : "failed";
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
          if (canRestoreCsv && patched) {
            const currentCsv = await readFile(csvPath, "utf8").catch(() => null);
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

      if (canRestoreCsv && patched) {
        const currentCsv = await readFile(csvPath, "utf8").catch(() => null);
        if (currentCsv === patched.csv) {
          await atomicWriteUtf8(csvPath, original);
        } else {
          reason = `${reason} Automatic restoration was skipped because the CSV changed after the execution was fenced.`;
        }
      }
      throw new Error(reason);
    }

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
    );
    const execution = await recoveryProducerChangeExecution(
      client,
      changeId,
      cliArguments.executionId,
    );
    if (!execution) {
      throw new Error("The exact materialized or recovered execution was not found.");
    }
    const pendingRecovery =
      initialChange.status === "applying" && execution.status === "materialized";
    const idempotentRecovery =
      (initialChange.status === "approved" || initialChange.status === "conflict") &&
      execution.status === "cancelled";
    if (!pendingRecovery && !idempotentRecovery) {
      throw new Error(
        `Request '${initialChange.status}' and execution '${execution.status}' do not form a recoverable or idempotent receipt.`,
      );
    }
    if (execution.expectedRowHash !== expected.hash) {
      throw new Error("The materialized execution does not match the approved patch.");
    }

    const csvPath = path.resolve(process.cwd(), execution.csvPath);
    if (repoRelativePath(csvPath, process.cwd()) !== execution.csvPath) {
      throw new Error("The materialized execution contains a non-canonical CSV path.");
    }
    assertGitPathClean(csvPath);
    const gitContext = materializationGitContext();
    const currentCsv = await readFile(csvPath, "utf8");
    auditCsv(csvPath);
    if ((await readFile(csvPath, "utf8")) !== currentCsv) {
      throw new Error("The target CSV changed during recovery preflight.");
    }
    if (
      readCommitBlob(gitContext.sourceHeadSha, execution.csvPath, process.cwd()) !==
      currentCsv
    ) {
      throw new Error("The clean target CSV does not match the captured Git HEAD.");
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

    const recoveredExecutionId = await recoverProducerChangeExecution(client, {
      changeId,
      executionId: execution.id,
      worktreeKey: gitContext.worktreeKey,
      sourceHeadSha: gitContext.sourceHeadSha,
      observedRowHash,
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
    if (!commitSha) throw new Error("Finalize requires the materializing commit SHA.");
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
    );
    const execution = await finalizationProducerChangeExecution(client, changeId);
    if (!execution) {
      throw new Error("No materialized execution owns this producer change request.");
    }
    if (!execution.sameOperator) {
      throw new Error(
        `Producer-change execution belongs to another operator. If it is abandoned, recovery staff may run 'pnpm producer:change recover ${changeId} ${execution.id} --reason "<documented reason>"' after the recovery quarantine.`,
      );
    }
    if (
      execution.expectedRowHash !== expected.hash ||
      (execution.status === "finalized" &&
        execution.appliedCommitSha !== normalizedCommit)
    ) {
      throw new Error("The stored execution does not match this finalization request.");
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
    );
    const finalGitContext = materializationGitContext();
    if (
      currentGitContext.sourceHeadSha !== commitState.headCommit ||
      finalGitContext.sourceHeadSha !== commitState.headCommit ||
      finalGitContext.worktreeKey !== execution.worktreeKey
    ) {
      throw new Error("The current HEAD changed during finalization preflight.");
    }

    if (idempotentFinalize) {
      process.stdout.write("Change request was already finalized with this commit.\n");
      return;
    }

    let executionId: string;
    try {
      executionId = await finalizeProducerChangeExecution(client, {
        changeId,
        commitSha: commitState.commit,
        csvPath: commitState.relativeCsvPath,
        expectedRowHash: expected.hash,
      });
    } catch (error) {
      const reason = errorMessage(error, "Could not finalize the producer change.");
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
