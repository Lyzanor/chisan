import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
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

import { and, eq, sql } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import postgres from "postgres";

import {
  hashProducerFields,
  isProducerPatch,
  type ProducerPatch,
  validateProducerProposal,
} from "../lib/accounts/producer-fields";
import * as databaseSchema from "../lib/db/schema";
import {
  auditEvents,
  producerChangeRequests,
  producerMemberships,
  users,
  type ProducerChangeRequest,
} from "../lib/db/schema";

type Database = PostgresJsDatabase<typeof databaseSchema>;
type DatabaseTransaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
type ChangeStatus = ProducerChangeRequest["status"];

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

type MaterializeOutcome =
  | { ok: true; message: string }
  | { ok: false; error: Error };

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

async function acquireProducerLock(
  transaction: DatabaseTransaction,
  country: string,
  producerId: number,
): Promise<void> {
  await transaction.execute(sql`set local lock_timeout = '15s'`);
  await transaction.execute(
    sql`select pg_advisory_xact_lock(hashtext(${`producer:${country}:${producerId}`}))`,
  );
}

async function hasActiveProducerAuthor(
  transaction: DatabaseTransaction,
  change: ProducerChangeRequest,
): Promise<boolean> {
  const [membership] = await transaction
    .select({ id: producerMemberships.id })
    .from(producerMemberships)
    .innerJoin(users, eq(producerMemberships.userId, users.id))
    .where(
      and(
        eq(producerMemberships.userId, change.authorUserId),
        eq(producerMemberships.country, change.country),
        eq(producerMemberships.producerId, change.producerId),
        eq(producerMemberships.status, "active"),
        eq(users.status, "active"),
      ),
    )
    .for("update")
    .limit(1);

  return Boolean(membership);
}

async function acquireCsvFileLock(
  transaction: DatabaseTransaction,
  relativeCsvPath: string,
): Promise<void> {
  await transaction.execute(
    sql`select pg_advisory_xact_lock(hashtext(${`producer-file:${relativeCsvPath}`}))`,
  );
}

type CasTransition = {
  status: ChangeStatus;
  failureReason: string | null;
  appliedCommitSha?: string;
  appliedAt?: Date;
};

async function casChangeStatus(
  transaction: DatabaseTransaction,
  change: ProducerChangeRequest,
  transition: CasTransition,
): Promise<ProducerChangeRequest | null> {
  const [updated] = await transaction
    .update(producerChangeRequests)
    .set({
      status: transition.status,
      failureReason: transition.failureReason,
      ...(transition.appliedCommitSha
        ? {
            appliedCommitSha: transition.appliedCommitSha,
            appliedAt: transition.appliedAt,
          }
        : {}),
      lockVersion: change.lockVersion + 1,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(producerChangeRequests.id, change.id),
        eq(producerChangeRequests.status, change.status),
        eq(producerChangeRequests.lockVersion, change.lockVersion),
      ),
    )
    .returning();

  return updated ?? null;
}

async function insertServiceAudit(
  transaction: DatabaseTransaction,
  changeId: string,
  action: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  await transaction.insert(auditEvents).values({
    actorKind: "service",
    actorKey: "csv-materializer",
    action,
    targetType: "producer_change_request",
    targetId: changeId,
    metadata,
  });
}

async function transitionWithAudit(
  transaction: DatabaseTransaction,
  change: ProducerChangeRequest,
  transition: CasTransition,
  action: string,
  metadata: Record<string, unknown>,
): Promise<ProducerChangeRequest> {
  const updated = await casChangeStatus(transaction, change, transition);
  if (!updated) {
    throw new Error("The change request was modified concurrently; no status was written.");
  }
  await insertServiceAudit(transaction, change.id, action, metadata);
  return updated;
}

async function recordFailure(
  transaction: DatabaseTransaction,
  change: ProducerChangeRequest,
  status: "conflict" | "failed",
  reason: string,
): Promise<MaterializeOutcome> {
  const storedReason = reason.slice(0, 2_000);
  await transitionWithAudit(
    transaction,
    change,
    { status, failureReason: storedReason },
    `producer_change.${status}`,
    { reason: reason.slice(0, 500) },
  );
  return { ok: false, error: new Error(reason) };
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

async function runCli(): Promise<void> {
  for (const environmentFile of [".env.local", ".env"]) {
    if (!process.env.DATABASE_URL && existsSync(environmentFile)) {
      process.loadEnvFile(environmentFile);
    }
  }

  const [command, changeId, commitSha] = process.argv.slice(2);
  if (!command || !changeId || !["materialize", "finalize"].includes(command)) {
    throw new Error(
      "Usage: pnpm producer:change materialize <change-id> | finalize <change-id> <commit-sha>",
    );
  }

  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error("DATABASE_URL is required when a database operation is executed.");
  }

  const { findProducerById } = await import("../lib/csv-catalog");
  const client = postgres(connectionString, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  const database = drizzle(client, { schema: databaseSchema });

  async function getChange(id: string): Promise<ProducerChangeRequest> {
    const [change] = await database
      .select()
      .from(producerChangeRequests)
      .where(eq(producerChangeRequests.id, id))
      .limit(1);
    if (!change) throw new Error(`Change request '${id}' was not found.`);
    return change;
  }

  async function materialize(): Promise<void> {
    const initialChange = await getChange(changeId);
    const producer = await findProducerById(
      initialChange.country,
      initialChange.producerId,
    );

    if (!producer) {
      const outcome = await database.transaction(async (transaction) => {
        await acquireProducerLock(
          transaction,
          initialChange.country,
          initialChange.producerId,
        );
        const [lockedChange] = await transaction
          .select()
          .from(producerChangeRequests)
          .where(eq(producerChangeRequests.id, changeId))
          .for("update")
          .limit(1);
        if (!lockedChange) throw new Error(`Change request '${changeId}' was not found.`);
        if (!["approved", "applying"].includes(lockedChange.status)) {
          throw new Error(
            `Change request is '${lockedChange.status}', not approved for materialization.`,
          );
        }
        return recordFailure(
          transaction,
          lockedChange,
          "conflict",
          "The producer no longer exists in the CSV catalog.",
        );
      });
      if (outcome.ok) {
        throw new Error("Producer lookup failed without recording a conflict.");
      }
      throw outcome.error;
    }

    const csvPath = csvPathFor(producer);
    const relativeCsvPath = repoRelativePath(csvPath, process.cwd());
    const outcome: MaterializeOutcome = await database.transaction(async (transaction) => {
      await acquireProducerLock(transaction, initialChange.country, initialChange.producerId);
      await acquireCsvFileLock(transaction, relativeCsvPath);

      const [change] = await transaction
        .select()
        .from(producerChangeRequests)
        .where(eq(producerChangeRequests.id, changeId))
        .for("update")
        .limit(1);
      if (!change) throw new Error(`Change request '${changeId}' was not found.`);
      if (!change.reviewerUserId || !change.reviewedAt) {
        throw new Error("The change request has not passed editorial review.");
      }
      if (!["approved", "applying"].includes(change.status)) {
        throw new Error(
          `Change request is '${change.status}', not approved for materialization.`,
        );
      }
      if (!(await hasActiveProducerAuthor(transaction, change))) {
        return recordFailure(
          transaction,
          change,
          "conflict",
          "The author no longer has active access to this producer.",
        );
      }

      let expected: ExpectedProducerChange;
      try {
        expected = resolveExpectedProducerChange(
          change.baseSnapshot,
          change.baseRowHash,
          change.patch,
        );
      } catch (error) {
        return recordFailure(
          transaction,
          change,
          "failed",
          errorMessage(error, "Stored producer change is invalid."),
        );
      }

      let original: string;
      let currentFields: Record<string, string>;
      try {
        original = await readFile(csvPath, "utf8");
        currentFields = readProducerFieldsFromCsv(original, change.producerId);
      } catch (error) {
        return recordFailure(
          transaction,
          change,
          error instanceof ProducerCsvRowNotFoundError ? "conflict" : "failed",
          errorMessage(error, "Could not read the target producer CSV."),
        );
      }

      const currentHash = hashProducerFields(currentFields);
      if (currentHash === expected.hash) {
        if (change.status === "applying") {
          return {
            ok: true,
            message: "CSV already contains this approved patch; proceed to finalize.",
          };
        }
        await transitionWithAudit(
          transaction,
          change,
          { status: "applying", failureReason: null },
          "producer_change.materialized",
          {
            country: change.country,
            producerId: change.producerId,
            csvPath: relativeCsvPath,
            fields: Object.keys(expected.patch),
            alreadyPresent: true,
          },
        );
        return {
          ok: true,
          message: "CSV already contains this approved patch; proceed to finalize.",
        };
      }
      if (currentHash !== change.baseRowHash) {
        return recordFailure(
          transaction,
          change,
          "conflict",
          "The CSV row changed after the proposal was submitted.",
        );
      }

      assertGitPathClean(csvPath);

      let patched: ProducerCsvPatchResult;
      try {
        patched = applyProducerPatchToCsv(original, change.producerId, expected.patch);
      } catch (error) {
        return recordFailure(
          transaction,
          change,
          error instanceof ProducerCsvRowNotFoundError ? "conflict" : "failed",
          errorMessage(error, "Could not materialize the producer CSV row."),
        );
      }
      if (hashProducerFields(patched.afterFields) !== expected.hash) {
        return recordFailure(
          transaction,
          change,
          "failed",
          "The patched CSV row does not match the approved base snapshot and patch.",
        );
      }

      const beforeWrite = await readFile(csvPath, "utf8");
      if (beforeWrite !== original) {
        return recordFailure(
          transaction,
          change,
          "conflict",
          "The target CSV changed during materialization preflight.",
        );
      }

      const applyingChange = await casChangeStatus(transaction, change, {
        status: "applying",
        failureReason: null,
      });
      if (!applyingChange) {
        throw new Error("The change request was modified concurrently; CSV was not written.");
      }

      let wroteCsv = false;
      try {
        await atomicWriteUtf8(csvPath, patched.csv);
        wroteCsv = true;
        auditCsv(csvPath);
        if ((await readFile(csvPath, "utf8")) !== patched.csv) {
          throw new Error("The target CSV changed again before its audit completed.");
        }

        await insertServiceAudit(
          transaction,
          change.id,
          "producer_change.materialized",
          {
            country: change.country,
            producerId: change.producerId,
            csvPath: relativeCsvPath,
            fields: Object.keys(expected.patch),
          },
        );
        return {
          ok: true,
          message: `Updated ${relativeCsvPath}. Review the diff, run pnpm verify:data, commit it, then finalize with the commit SHA.`,
        };
      } catch (error) {
        let reason = errorMessage(error, "CSV materialization failed.");
        if (wroteCsv) {
          const currentCsv = await readFile(csvPath, "utf8").catch(() => null);
          if (currentCsv === patched.csv) {
            await atomicWriteUtf8(csvPath, original);
          } else {
            reason = `${reason} Automatic restoration was skipped because the CSV changed concurrently.`;
          }
        }

        return recordFailure(
          transaction,
          applyingChange,
          "failed",
          reason,
        );
      }
    });

    if (!outcome.ok) throw outcome.error;
    process.stdout.write(`${outcome.message}\n`);
  }

  async function finalize(): Promise<void> {
    if (!commitSha) throw new Error("Finalize requires the materializing commit SHA.");
    const normalizedCommit = commitSha.toLowerCase();
    const initialChange = await getChange(changeId);
    if (
      initialChange.status === "applied" &&
      initialChange.appliedCommitSha === normalizedCommit
    ) {
      process.stdout.write("Change request was already finalized with this commit.\n");
      return;
    }

    const outcome: MaterializeOutcome = await database.transaction(async (transaction) => {
      await acquireProducerLock(transaction, initialChange.country, initialChange.producerId);

      const [change] = await transaction
        .select()
        .from(producerChangeRequests)
        .where(eq(producerChangeRequests.id, changeId))
        .for("update")
        .limit(1);
      if (!change) throw new Error(`Change request '${changeId}' was not found.`);
      if (change.status === "applied" && change.appliedCommitSha === normalizedCommit) {
        return {
          ok: true,
          message: "Change request was already finalized with this commit.",
        };
      }
      if (change.status !== "applying") {
        throw new Error(`Change request is '${change.status}', not awaiting finalization.`);
      }
      if (!(await hasActiveProducerAuthor(transaction, change))) {
        return recordFailure(
          transaction,
          change,
          "conflict",
          "The author no longer has active access to this producer.",
        );
      }

      const expected = resolveExpectedProducerChange(
        change.baseSnapshot,
        change.baseRowHash,
        change.patch,
      );
      const commitState = findProducerStateInCommit(
        normalizedCommit,
        change.country,
        change.producerId,
        expected.hash,
      );
      await acquireCsvFileLock(transaction, commitState.relativeCsvPath);
      const appliedAt = new Date();
      await transitionWithAudit(
        transaction,
        change,
        {
          status: "applied",
          failureReason: null,
          appliedCommitSha: commitState.commit,
          appliedAt,
        },
        "producer_change.applied",
        {
          commitSha: commitState.commit,
          csvPath: commitState.relativeCsvPath,
          producerHash: expected.hash,
        },
      );
      return {
        ok: true,
        message: `Finalized change request ${change.id} at ${commitState.commit}.`,
      };
    });

    if (!outcome.ok) throw outcome.error;
    process.stdout.write(`${outcome.message}\n`);
  }

  try {
    if (command === "materialize") await materialize();
    else await finalize();
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
    const rendered = error instanceof Error ? error.stack ?? error.message : String(error);
    process.stderr.write(`${rendered}\n`);
    process.exitCode = 1;
  });
}
