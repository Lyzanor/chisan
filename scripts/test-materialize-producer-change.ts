import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  chmod,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  hashProducerFields,
  PRODUCER_CATEGORIES,
  PRODUCER_EDITABLE_FIELDS,
  PRODUCER_LAST_APPROVED_CHANGE_DATE_FIELD,
} from "../lib/accounts/producer-fields";
import {
  applyProducerPatchToCsv,
  assertCommitContainsProducerState,
  assertFinalizationGitState,
  assertGitPathClean,
  atomicWriteUtf8,
  canResumeExactDirtyMaterialization,
  findProducerStateInCommit,
  parseProducerChangeCliArguments,
  readProducerFieldsFromCsv,
  resolveExpectedProducerChange,
} from "./materialize-producer-change";
import {
  producerChangeDatabaseSource,
  producerChangeDatabaseUrlFromEnvironment,
} from "./producer-change-access";
import {
  assertPrivateCredentialFile,
  parseProducerChangeAccessProvision,
  producerChangeLoginRoleNames,
  producerChangeRoleConnectionString,
} from "./provision-producer-change-access";

function git(cwd: string, args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

test("producer-change CLI parses list filters independently of option order", () => {
  assert.deepEqual(
    parseProducerChangeCliArguments([
      "list",
      "--query",
      "Chisan Barcelona",
      "--page",
      "2",
      "--json",
      "--status",
      "CSV",
      "--limit",
      "50",
    ]),
    {
      command: "list",
      status: "csv",
      query: "Chisan Barcelona",
      limit: 50,
      page: 2,
      json: true,
    },
  );
  assert.deepEqual(parseProducerChangeCliArguments(["list"]), {
    command: "list",
    status: undefined,
    query: undefined,
    limit: undefined,
    page: undefined,
    json: false,
  });
});

test("producer-change CLI strictly parses show, materialize and finalize", () => {
  const changeId = "a92cc0b4-a726-4dfa-a28a-28f543211887";
  const executionId = "d67c2404-4c26-45b8-8bb6-0482a8dca6a3";

  assert.deepEqual(parseProducerChangeCliArguments(["show", "--json", changeId]), {
    command: "show",
    changeId,
    json: true,
  });
  assert.deepEqual(parseProducerChangeCliArguments(["materialize", changeId]), {
    command: "materialize",
    changeId,
  });
  assert.deepEqual(
    parseProducerChangeCliArguments([
      "recover",
      changeId,
      executionId,
      "--reason",
      "The original controlled worktree was retired.",
    ]),
    {
      command: "recover",
      changeId,
      executionId,
      reason: "The original controlled worktree was retired.",
    },
  );
  assert.deepEqual(
    parseProducerChangeCliArguments(["finalize", changeId, "a".repeat(40)]),
    { command: "finalize", changeId, commitSha: "a".repeat(40) },
  );
  assert.deepEqual(
    parseProducerChangeCliArguments(["doctor", "--json", "--access", "operator"]),
    { command: "doctor", access: "operator", json: true },
  );
  assert.deepEqual(
    parseProducerChangeCliArguments(["doctor", "--access", "recovery"]),
    { command: "doctor", access: "recovery", json: false },
  );
  assert.throws(
    () => parseProducerChangeCliArguments(["materialize", changeId, "extra"]),
    /Usage:/,
  );
  assert.throws(
    () => parseProducerChangeCliArguments(["recover", changeId, executionId]),
    /Usage:/,
  );
  assert.throws(
    () => parseProducerChangeCliArguments(["materialize", "not-a-uuid"]),
    /valid change-request UUID/i,
  );
  assert.throws(
    () => parseProducerChangeCliArguments(["finalize", changeId, "abc123"]),
    /full 40-character Git commit SHA/i,
  );
  assert.throws(
    () => parseProducerChangeCliArguments(["doctor", "--access", "writer"]),
    /read.*operator/i,
  );
});

test("producer-change commands select isolated credentials with no generic fallback", () => {
  assert.deepEqual(producerChangeDatabaseSource("list"), {
    access: "read",
    environmentFile: ".env.admin-read.local",
    variable: "CHISAN_ADMIN_READ_DATABASE_URL",
  });
  assert.deepEqual(producerChangeDatabaseSource("finalize"), {
    access: "operator",
    environmentFile: ".env.producer-change-operator.local",
    variable: "CHISAN_PRODUCER_CHANGE_OPERATOR_DATABASE_URL",
  });
  assert.deepEqual(producerChangeDatabaseSource("recover"), {
    access: "recovery",
    environmentFile: ".env.producer-change-recovery.local",
    variable: "CHISAN_PRODUCER_CHANGE_RECOVERY_DATABASE_URL",
  });
  assert.equal(
    producerChangeDatabaseUrlFromEnvironment("show", {
      CHISAN_ADMIN_READ_DATABASE_URL: "  postgres://reader.example/chisan  ",
      DATABASE_URL: "postgres://application.example/chisan",
    }),
    "postgres://reader.example/chisan",
  );
  assert.throws(
    () =>
      producerChangeDatabaseUrlFromEnvironment("materialize", {
        DATABASE_URL: "postgres://application.example/chisan",
        DATABASE_MIGRATION_URL: "postgres://migration.example/chisan",
      }),
    /CHISAN_PRODUCER_CHANGE_OPERATOR_DATABASE_URL.*intentionally ignored/i,
  );
});

test("operator access provisioning derives isolated SQL identities and URLs", () => {
  assert.deepEqual(
    parseProducerChangeAccessProvision(["provision", "operator", "codex_a"]),
    { access: "operator", principal: "codex_a" },
  );
  assert.deepEqual(producerChangeLoginRoleNames("codex_a"), {
    read: "chisan_agent_read_codex_a",
    operator: "chisan_agent_operator_codex_a",
    recovery: "chisan_agent_recovery_codex_a",
  });
  assert.deepEqual(
    parseProducerChangeAccessProvision(["provision", "recovery", "staff_a"]),
    { access: "recovery", principal: "staff_a" },
  );
  assert.throws(
    () => parseProducerChangeAccessProvision(["provision", "read", "Codex A"]),
    /lowercase letters/i,
  );
  assert.throws(
    () => parseProducerChangeAccessProvision(["provision", "codex_a"]),
    /read\|operator\|recovery/i,
  );

  const connection = producerChangeRoleConnectionString(
    new URL("postgres://owner:old@ep-example.eu.neon.tech/neondb?sslmode=require"),
    "chisan_agent_read_codex_a",
    "new-secret",
  );
  const parsed = new URL(connection);
  assert.equal(parsed.username, "chisan_agent_read_codex_a");
  assert.equal(parsed.password, "new-secret");
  assert.equal(parsed.hostname, "ep-example.eu.neon.tech");
  assert.equal(parsed.searchParams.get("sslmode"), "require");
  assert.equal(
    parsed.searchParams.get("application_name"),
    "chisan-producer-change-cli",
  );
});

test("migration credential files must be private regular files", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "chisan-access-secret-"));
  context.after(async () => rm(directory, { recursive: true, force: true }));
  const credential = path.join(directory, ".env.migration.local");
  await writeFile(credential, "DATABASE_MIGRATION_URL=postgres://example\n", {
    mode: 0o600,
  });
  assert.equal(await assertPrivateCredentialFile(credential), true);

  await chmod(credential, 0o644);
  await assert.rejects(() => assertPrivateCredentialFile(credential), /mode 0600/i);
  await chmod(credential, 0o600);
  const linkedCredential = path.join(directory, ".env.link.local");
  await symlink(credential, linkedCredential);
  await assert.rejects(
    () => assertPrivateCredentialFile(linkedCredential),
    /regular file, not a symlink/i,
  );
  assert.equal(
    await assertPrivateCredentialFile(path.join(directory, ".env.missing.local")),
    false,
  );
});

test("producer-change CLI rejects ambiguous or malformed read-only arguments", () => {
  const changeId = "a92cc0b4-a726-4dfa-a28a-28f543211887";

  assert.throws(
    () => parseProducerChangeCliArguments(["list", "--status", "unknown"]),
    /unknown producer-change status or view/i,
  );
  assert.throws(
    () => parseProducerChangeCliArguments(["list", "--limit", "0"]),
    /positive integer/i,
  );
  assert.throws(
    () => parseProducerChangeCliArguments(["list", "--page"]),
    /requires a value/i,
  );
  assert.throws(
    () => parseProducerChangeCliArguments(["list", "--json", "--json"]),
    /only be specified once/i,
  );
  assert.throws(
    () => parseProducerChangeCliArguments(["show", changeId, "extra"]),
    /exactly one/i,
  );
  assert.throws(
    () => parseProducerChangeCliArguments(["show", "not-a-uuid"]),
    /valid change-request UUID/i,
  );
});

test("materialization changes exactly one CSV row without reformatting its neighbors", () => {
  const original = [
    "nombre,descripcion,producer_id",
    '"Untouched quoted name","quoted despite no comma",1',
    '"Target","old, comma",2',
    'Bare,"tail ""quote""",3',
    "",
  ].join("\n");

  const patched = applyProducerPatchToCsv(original, 2, {
    descripcion: "new description",
  });

  assert.equal(
    patched.csv,
    original.replace('"Target","old, comma",2\n', "Target,new description,2\n"),
  );
  assert.equal(patched.beforeFields.descripcion, "old, comma");
  assert.equal(patched.afterFields.descripcion, "new description");
  assert.match(patched.csv, /"Untouched quoted name","quoted despite no comma",1/);
  assert.match(patched.csv, /Bare,"tail ""quote""",3/);
});

test("materialization preserves a final row without a record delimiter", () => {
  const original = "nombre,descripcion,producer_id\nFirst,keep,1\nLast,old,2";
  const patched = applyProducerPatchToCsv(original, 2, { descripcion: "new" });

  assert.equal(patched.csv, "nombre,descripcion,producer_id\nFirst,keep,1\nLast,new,2");
  assert.equal(patched.csv.endsWith("\n"), false);
});

test("the expected state is derived from the base snapshot, stored patch and approval date", () => {
  const baseSnapshot = Object.fromEntries(
    PRODUCER_EDITABLE_FIELDS.map(({ key }) => [key, ""]),
  );
  Object.assign(baseSnapshot, {
    nombre: "Base producer",
    municipio: "Madrid",
    categoria: PRODUCER_CATEGORIES[0],
    "Venta online": "no comprobado",
    producer_id: "7",
    slug: "base-producer-madrid",
    [PRODUCER_LAST_APPROVED_CHANGE_DATE_FIELD]: "",
  });
  const baseHash = hashProducerFields(baseSnapshot);

  const expected = resolveExpectedProducerChange(
    baseSnapshot,
    baseHash,
    { nombre: "Updated producer" },
    new Date("2026-09-02T23:45:00Z"),
  );

  assert.equal(expected.fields.nombre, "Updated producer");
  assert.equal(expected.fields.municipio, "Madrid");
  assert.equal(expected.fields[PRODUCER_LAST_APPROVED_CHANGE_DATE_FIELD], "2026-09-02");
  assert.equal(expected.patch[PRODUCER_LAST_APPROVED_CHANGE_DATE_FIELD], "2026-09-02");
  assert.equal(expected.hash, hashProducerFields(expected.fields));
  assert.throws(
    () =>
      resolveExpectedProducerChange(
        baseSnapshot,
        "0".repeat(64),
        { nombre: "Other" },
        new Date("2026-09-02T23:45:00Z"),
      ),
    /base snapshot does not match/i,
  );
  assert.throws(
    () => resolveExpectedProducerChange(baseSnapshot, baseHash, { nombre: "Other" }, null),
    /no review timestamp/i,
  );
});

test("an open pre-migration request cannot materialize unpaired prose and current requests carry the locale", () => {
  const legacySnapshot = Object.fromEntries(
    PRODUCER_EDITABLE_FIELDS.map(({ key }) => [key, ""]),
  );
  delete legacySnapshot.descripcion_locale;
  Object.assign(legacySnapshot, {
    nombre: "Legacy producer",
    municipio: "Madrid",
    categoria: PRODUCER_CATEGORIES[0],
    descripcion: "Legacy prose without an explicit source language.",
    "Venta online": "no comprobado",
    [PRODUCER_LAST_APPROVED_CHANGE_DATE_FIELD]: "",
  });
  const legacyHash = hashProducerFields(legacySnapshot);
  assert.throws(
    () =>
      resolveExpectedProducerChange(
        legacySnapshot,
        legacyHash,
        { nombre: "Renamed" },
        new Date("2026-09-02T10:00:00Z"),
      ),
    /source language/i,
  );

  const currentSnapshot = { ...legacySnapshot, descripcion_locale: "en" };
  const expected = resolveExpectedProducerChange(
    currentSnapshot,
    hashProducerFields(currentSnapshot),
    { descripcion: "Updated canonical prose." },
    new Date("2026-09-02T10:00:00Z"),
  );
  assert.equal(expected.fields.descripcion, "Updated canonical prose.");
  assert.equal(expected.fields.descripcion_locale, "en");
});

test("an open request captured before the approval-date column cannot materialize", () => {
  const legacySnapshot = Object.fromEntries(
    PRODUCER_EDITABLE_FIELDS.map(({ key }) => [key, ""]),
  );
  Object.assign(legacySnapshot, {
    nombre: "Legacy producer",
    municipio: "Madrid",
    categoria: PRODUCER_CATEGORIES[0],
    "Venta online": "no comprobado",
  });
  const legacyHash = hashProducerFields(legacySnapshot);

  assert.throws(
    () =>
      resolveExpectedProducerChange(
        legacySnapshot,
        legacyHash,
        { nombre: "Renamed" },
        new Date("2026-09-02T10:00:00Z"),
      ),
    /predates.*fecha ultimo cambio/i,
  );
});

test("CSV location-column widening conflicts every open legacy request", () => {
  const legacySnapshot = Object.fromEntries(
    PRODUCER_EDITABLE_FIELDS.filter(({ key }) => key !== "descripcion_locale").map(
      ({ key }) => [key, ""],
    ),
  );
  Object.assign(legacySnapshot, {
    nombre: "Legacy producer",
    municipio: "Madrid",
    categoria: PRODUCER_CATEGORIES[0],
    "Venta online": "no comprobado",
  });

  const submittedHash = hashProducerFields(legacySnapshot);
  const widenedCurrentRow = {
    ...legacySnapshot,
    descripcion_locale: "",
    country: "es",
    region: "comunidad-de-madrid",
    area: "madrid",
  };
  assert.notEqual(
    hashProducerFields(widenedCurrentRow),
    submittedHash,
    "the optimistic-concurrency preflight must reject a request captured before the atomic header migration",
  );
});

test("atomicWriteUtf8 swaps contents and preserves permissions", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "chisan-materializer-atomic-"));
  context.after(async () => rm(directory, { recursive: true, force: true }));
  const filePath = path.join(directory, "area.csv");
  await writeFile(filePath, "before\n", { encoding: "utf8", mode: 0o640 });
  const originalMode = (await stat(filePath)).mode & 0o777;

  await atomicWriteUtf8(filePath, "after\n");

  assert.equal(await readFile(filePath, "utf8"), "after\n");
  assert.equal((await stat(filePath)).mode & 0o777, originalMode);
  assert.deepEqual(await readdir(directory), ["area.csv"]);
});

test("an exact materialized dirty write can recover its completion receipt", () => {
  const now = Date.now();
  const execution = {
    id: "00000000-0000-4000-8000-000000000301",
    status: "materialized" as const,
    operatorKey: "chisan_agent_operator_codex_a",
    sameOperator: true,
    worktreeKey: "b".repeat(64),
    sourceHeadSha: "c".repeat(40),
    expectedRowHash: "d".repeat(64),
    leaseExpiresAt: new Date(now - 60_000),
    csvPath: "data/csv/es/test/area.csv",
  };
  assert.equal(
    canResumeExactDirtyMaterialization(
      execution,
      { worktreeKey: "b".repeat(64), sourceHeadSha: "c".repeat(40) },
      "d".repeat(64),
      "data/csv/es/test/area.csv",
      now,
    ),
    true,
  );
  assert.equal(
    canResumeExactDirtyMaterialization(
      { ...execution, sameOperator: false },
      { worktreeKey: "b".repeat(64), sourceHeadSha: "c".repeat(40) },
      "d".repeat(64),
      "data/csv/es/test/area.csv",
      now,
    ),
    false,
  );
  assert.equal(
    canResumeExactDirtyMaterialization(
      { ...execution, status: "leased" },
      { worktreeKey: "b".repeat(64), sourceHeadSha: "c".repeat(40) },
      "d".repeat(64),
      "data/csv/es/test/area.csv",
      now,
    ),
    false,
  );
});

test("finalize validates the exact commit blob and requires it to be in HEAD history", async (context) => {
  const repository = await mkdtemp(path.join(tmpdir(), "chisan-materializer-git-"));
  context.after(async () => rm(repository, { recursive: true, force: true }));
  const relativeCsvPath = "data/csv/es/test/area.csv";
  const csvPath = path.join(repository, relativeCsvPath);
  await mkdir(path.dirname(csvPath), { recursive: true });

  git(repository, ["init", "-q"]);
  git(repository, ["config", "user.name", "Chisan test"]);
  git(repository, ["config", "user.email", "chisan-test@example.invalid"]);

  const baseCsv =
    "nombre,descripcion,producer_id\nBase,old,7\nNeighbor,stable,8\n";
  const expectedCsv =
    "nombre,descripcion,producer_id\nBase,new,7\nNeighbor,stable,8\n";
  await writeFile(csvPath, baseCsv, "utf8");
  git(repository, ["add", relativeCsvPath]);
  git(repository, ["commit", "-qm", "base"]);
  const baseCommit = git(repository, ["rev-parse", "HEAD"]);
  const mainBranch = git(repository, ["branch", "--show-current"]);

  assert.doesNotThrow(() => assertGitPathClean(relativeCsvPath, repository));
  await writeFile(csvPath, expectedCsv, "utf8");
  assert.throws(
    () => assertGitPathClean(relativeCsvPath, repository),
    /staged or unstaged changes/i,
  );
  git(repository, ["add", relativeCsvPath]);
  git(repository, ["commit", "-qm", "materialize producer"]);
  const materializingCommit = git(repository, ["rev-parse", "HEAD"]);
  const expectedHash = hashProducerFields(readProducerFieldsFromCsv(expectedCsv, 7));

  // A dirty working tree must not affect finalization: the commit blob is authoritative.
  await writeFile(csvPath, "nombre,descripcion,producer_id\nBase,working-tree-only,7\n", "utf8");
  const commitState = assertCommitContainsProducerState(
    materializingCommit,
    relativeCsvPath,
    7,
    expectedHash,
    repository,
  );
  assert.equal(commitState.fields.descripcion, "new");
  assert.equal(
    assertFinalizationGitState(
      materializingCommit,
      baseCommit,
      relativeCsvPath,
      7,
      expectedHash,
      repository,
    ).headCommit,
    materializingCommit,
  );
  const locatedState = findProducerStateInCommit(
    materializingCommit,
    "es",
    7,
    expectedHash,
    repository,
  );
  assert.equal(locatedState.relativeCsvPath, relativeCsvPath);
  await writeFile(csvPath, expectedCsv, "utf8");

  assert.throws(
    () =>
      assertCommitContainsProducerState(
        baseCommit,
        relativeCsvPath,
        7,
        expectedHash,
        repository,
      ),
    /does not match the approved patch/i,
  );

  await writeFile(path.join(repository, "note.txt"), "later\n", "utf8");
  git(repository, ["add", "note.txt"]);
  git(repository, ["commit", "-qm", "later unrelated commit"]);
  const unrelatedCommit = git(repository, ["rev-parse", "HEAD"]);
  assert.doesNotThrow(() =>
    assertCommitContainsProducerState(
      materializingCommit,
      relativeCsvPath,
      7,
      expectedHash,
      repository,
    ),
  );
  assert.throws(
    () =>
      assertCommitContainsProducerState(
        unrelatedCommit,
        relativeCsvPath,
        7,
        expectedHash,
        repository,
      ),
    /does not modify the producer CSV/i,
  );

  assert.equal(
    assertFinalizationGitState(
      materializingCommit,
      baseCommit,
      relativeCsvPath,
      7,
      expectedHash,
      repository,
    ).headCommit,
    unrelatedCommit,
  );

  const unrelatedSameCsv =
    "nombre,descripcion,producer_id\nBase,new,7\nNeighbor,changed,8\n";
  await writeFile(csvPath, unrelatedSameCsv, "utf8");
  git(repository, ["add", relativeCsvPath]);
  git(repository, ["commit", "-qm", "change neighboring producer"]);
  const neighboringCommit = git(repository, ["rev-parse", "HEAD"]);
  assert.doesNotThrow(() =>
    assertCommitContainsProducerState(
      neighboringCommit,
      relativeCsvPath,
      7,
      expectedHash,
      repository,
    ),
  );
  assert.throws(
    () =>
      assertFinalizationGitState(
        neighboringCommit,
        baseCommit,
        relativeCsvPath,
        7,
        expectedHash,
        repository,
      ),
    /did not introduce the approved producer state/i,
  );

  await writeFile(csvPath, baseCsv, "utf8");
  git(repository, ["add", relativeCsvPath]);
  git(repository, ["commit", "-qm", "revert producer materialization"]);
  assert.throws(
    () =>
      assertFinalizationGitState(
        materializingCommit,
        baseCommit,
        relativeCsvPath,
        7,
        expectedHash,
        repository,
      ),
    /does not match the approved patch/i,
  );
  await writeFile(csvPath, expectedCsv, "utf8");
  git(repository, ["add", relativeCsvPath]);
  git(repository, ["commit", "-qm", "restore producer materialization"]);
  const recoveredSourceHead = git(repository, ["rev-parse", "HEAD"]);
  assert.doesNotThrow(() =>
    assertFinalizationGitState(
      materializingCommit,
      recoveredSourceHead,
      relativeCsvPath,
      7,
      expectedHash,
      repository,
    ),
  );

  git(repository, ["switch", "-q", "-c", "side", baseCommit]);
  await writeFile(csvPath, expectedCsv, "utf8");
  git(repository, ["add", relativeCsvPath]);
  git(repository, ["commit", "-qm", "side materialization"]);
  const sideCommit = git(repository, ["rev-parse", "HEAD"]);
  git(repository, ["switch", "-q", mainBranch]);
  assert.throws(
    () =>
      assertCommitContainsProducerState(
        sideCommit,
        relativeCsvPath,
        7,
        expectedHash,
        repository,
      ),
    /not an ancestor/i,
  );
  assert.throws(
    () =>
      assertFinalizationGitState(
        materializingCommit,
        sideCommit,
        relativeCsvPath,
        7,
        expectedHash,
        repository,
      ),
    /no longer descends from the execution source HEAD/i,
  );
});
