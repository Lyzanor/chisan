import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  hashProducerFields,
  PRODUCER_CATEGORIES,
  PRODUCER_EDITABLE_FIELDS,
} from "../lib/accounts/producer-fields";
import {
  applyProducerPatchToCsv,
  assertCommitContainsProducerState,
  assertGitPathClean,
  atomicWriteUtf8,
  findProducerStateInCommit,
  readProducerFieldsFromCsv,
  resolveExpectedProducerChange,
} from "./materialize-producer-change";

function git(cwd: string, args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

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

test("the expected state is derived only from baseSnapshot plus the stored patch", () => {
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
  });
  const baseHash = hashProducerFields(baseSnapshot);

  const expected = resolveExpectedProducerChange(baseSnapshot, baseHash, {
    nombre: "Updated producer",
  });

  assert.equal(expected.fields.nombre, "Updated producer");
  assert.equal(expected.fields.municipio, "Madrid");
  assert.equal(expected.hash, hashProducerFields(expected.fields));
  assert.throws(
    () => resolveExpectedProducerChange(baseSnapshot, "0".repeat(64), { nombre: "Other" }),
    /base snapshot does not match/i,
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

test("finalize validates the exact commit blob and requires it to be in HEAD history", async (context) => {
  const repository = await mkdtemp(path.join(tmpdir(), "chisan-materializer-git-"));
  context.after(async () => rm(repository, { recursive: true, force: true }));
  const relativeCsvPath = "data/csv/es/test/area.csv";
  const csvPath = path.join(repository, relativeCsvPath);
  await mkdir(path.dirname(csvPath), { recursive: true });

  git(repository, ["init", "-q"]);
  git(repository, ["config", "user.name", "Chisan test"]);
  git(repository, ["config", "user.email", "chisan-test@example.invalid"]);

  const baseCsv = "nombre,descripcion,producer_id\nBase,old,7\n";
  const expectedCsv = "nombre,descripcion,producer_id\nBase,new,7\n";
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
});
