import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { hashProducerFields } from "../accounts/producer-fields";
import {
  ProducerCsvRowNotFoundError,
  readProducerFieldsFromCsv,
} from "./producer-csv";
export function repoRelativePath(filePath: string, cwd: string): string {
  const relative = path.isAbsolute(filePath)
    ? path.relative(cwd, filePath)
    : path.normalize(filePath);
  if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`)) {
    throw new Error("The CSV path must be inside the Git worktree.");
  }
  return relative.split(path.sep).join("/").replace(/^\.\//, "");
}

export function runGit(
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
  return new Error(
    (
      result.stderr ||
      result.stdout ||
      result.error?.message ||
      fallback
    ).trim(),
  );
}

export function gitOutput(
  args: readonly string[],
  cwd: string,
  fallback: string,
): string {
  const result = runGit(args, cwd);
  if (result.status !== 0 || !result.stdout.trim())
    throw gitFailure(result, fallback);
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

export function assertGitPathClean(
  filePath: string,
  cwd = process.cwd(),
  allowNew = false,
): void {
  const relative = repoRelativePath(filePath, cwd);
  const tracked = runGit(["ls-files", "--error-unmatch", "--", relative], cwd);
  if (tracked.status !== 0 && !allowNew) {
    throw gitFailure(
      tracked,
      `Target CSV '${relative}' is not tracked by Git.`,
    );
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
      `Target '${relative}' has staged, unstaged or untracked changes; review and commit them before materializing.`,
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
  const verified = runGit(
    ["rev-parse", "--verify", `${normalizedCommit}^{commit}`],
    cwd,
  );
  if (
    verified.status !== 0 ||
    verified.stdout.trim().toLowerCase() !== normalizedCommit
  ) {
    throw gitFailure(verified, "The supplied Git commit does not exist.");
  }

  const ancestor = runGit(
    ["merge-base", "--is-ancestor", normalizedCommit, "HEAD"],
    cwd,
  );
  if (ancestor.status === 1) {
    throw new Error(
      "The supplied commit is not an ancestor of the current HEAD.",
    );
  }
  if (ancestor.status !== 0) {
    throw gitFailure(
      ancestor,
      "Could not verify the supplied commit ancestry.",
    );
  }
  return normalizedCommit;
}

function assertGitAncestor(
  ancestor: string,
  descendant: string,
  cwd: string,
  failureMessage: string,
): void {
  const result = runGit(
    ["merge-base", "--is-ancestor", ancestor, descendant],
    cwd,
  );
  if (result.status === 1) throw new Error(failureMessage);
  if (result.status !== 0) {
    throw gitFailure(
      result,
      "Could not verify the producer-change commit ancestry.",
    );
  }
}

function validateStoredCommit(
  commit: string,
  cwd: string,
  label: string,
): string {
  if (!/^[0-9a-f]{40}$/i.test(commit)) {
    throw new Error(`${label} is not a full 40-character Git commit SHA.`);
  }
  const normalized = commit.toLowerCase();
  const verified = runGit(
    ["rev-parse", "--verify", `${normalized}^{commit}`],
    cwd,
  );
  if (
    verified.status !== 0 ||
    verified.stdout.trim().toLowerCase() !== normalized
  ) {
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
  if (
    changed.status !== 0 ||
    !changed.stdout.split("\n").includes(relativeCsvPath)
  ) {
    throw gitFailure(
      changed,
      "The supplied commit does not modify the producer CSV.",
    );
  }
}

export function readCommitBlob(
  commit: string,
  relativeCsvPath: string,
  cwd: string,
): string {
  const blob = runGit(["show", `${commit}:${relativeCsvPath}`], cwd);
  if (blob.status !== 0) {
    throw gitFailure(
      blob,
      "The producer CSV blob does not exist in the supplied commit.",
    );
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
    throw new Error(
      "The producer row in the supplied commit does not match the approved patch.",
    );
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
    return hashProducerFields(
      readProducerFieldsFromCsv(blob.stdout, producerId),
    );
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
    runGit(
      ["merge-base", "--is-ancestor", sourceHeadCommit, commitState.commit],
      cwd,
    ).status === 0;
  const commitPrecedesSource =
    runGit(
      ["merge-base", "--is-ancestor", commitState.commit, sourceHeadCommit],
      cwd,
    ).status === 0;
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
    throw new Error(
      "The producer country must be a lowercase ISO alpha-2 code.",
    );
  }
  const normalizedCommit = validateCommitAncestor(commit, cwd);
  const countryPrefix = `data/csv/${country}/`;
  const tree = runGit(
    ["ls-tree", "-r", "--name-only", normalizedCommit, "--", countryPrefix],
    cwd,
  );
  if (tree.status !== 0) {
    throw gitFailure(
      tree,
      "Could not inspect the producer CSV tree in the supplied commit.",
    );
  }

  let found: CommitProducerState | null = null;
  for (const relativeCsvPath of tree.stdout
    .split("\n")
    .filter(
      (entry) => entry.startsWith(countryPrefix) && entry.endsWith(".csv"),
    )) {
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
