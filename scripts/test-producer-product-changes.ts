import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { stringify } from "csv-stringify/sync";

import {
  hashProducerContent,
  proposeProducerProducts,
  resolveProducerContentChange,
} from "../lib/accounts/producer-content-change";
import { hashProducerFields } from "../lib/accounts/producer-fields";
import {
  emptyProducerContent,
  contentSourceHash,
  localizeProducerContent,
} from "../lib/catalog/content-schema";
import { productChanges } from "../lib/catalog/product-diff";
import { resolveExpectedProducerChange } from "../lib/editorial/producer-csv";
import { prepareContentPublication } from "../lib/editorial/producer-content-publication";
import { assertFinalizationGitState } from "../lib/editorial/git-state";

const product = {
  id: "fresh-cheese",
  name: "Queso fresco",
  description: "Pieza de 250 g.",
  locale: "es" as const,
  media_ids: [],
  link_ids: [],
};

test("product proposals preserve producer identity, reviewed assets and source translations", () => {
  const base = emptyProducerContent("es", 12439);
  base.products = [product];
  base.links = [
    {
      id: "details",
      label: "Detalles",
      url: "https://example.org/queso",
      locale: "es",
    },
  ];
  base.translations = [
    {
      collection: "products",
      item_id: product.id,
      locale: "ca",
      source_hash: contentSourceHash("products", product),
      values: { name: "Formatge fresc", description: "Peça de 250 g." },
    },
  ];
  const proposal = proposeProducerProducts(base, [
    { ...product, description: "Pieza de 500 g.", link_ids: ["details"] },
  ]);
  assert.ok(proposal);
  const { requested } = resolveProducerContentChange(proposal, "es", 12439);
  assert.deepEqual(requested.links, base.links);
  assert.deepEqual(requested.translations, base.translations);
  assert.equal(
    localizeProducerContent(requested, "ca").products[0].locale,
    "es",
  );
  assert.throws(
    () => resolveProducerContentChange(proposal, "es", 12440),
    /exact producer/,
  );
  assert.throws(
    () =>
      resolveProducerContentChange({ ...proposal, products: [] }, "es", 12439),
    /snapshots/,
  );
  assert.throws(
    () => proposeProducerProducts(base, [{ ...product, stock: 3 }]),
    /Unrecognized/,
  );
  assert.throws(
    () =>
      proposeProducerProducts(base, [{ ...product, media_ids: ["unknown"] }]),
    /Unknown/,
  );
  assert.throws(
    () => proposeProducerProducts(base, [product, product]),
    /unique/,
  );
  const deletion = proposeProducerProducts(base, []);
  assert.ok(deletion);
  assert.equal(
    resolveProducerContentChange(deletion, "es", 12439).requested.translations
      .length,
    0,
  );
  assert.deepEqual(
    resolveProducerContentChange(deletion, "es", 12439).requested.links,
    base.links,
  );
  assert.equal(proposeProducerProducts(base, base.products), null);
  assert.equal(
    hashProducerContent(base),
    hashProducerContent({
      ...base,
      products: [
        Object.fromEntries(Object.entries(product).reverse()) as typeof product,
      ],
    }),
  );
});

test("review diffs distinguish additions, edits, removals and product order", () => {
  const second = { ...product, id: "aged-cheese", name: "Queso curado" };
  assert.deepEqual(
    productChanges([product, second], [second, product]).map(
      (item) => item.kind,
    ),
    ["reordered", "reordered"],
  );
  assert.equal(
    productChanges(
      [product],
      [{ ...product, description: "Nueva descripción" }],
    )[0].kind,
    "updated",
  );
  assert.equal(productChanges([], [product])[0].kind, "added");
  assert.equal(productChanges([product], [])[0].kind, "removed");
});

test("product-only publication requires the JSON in the introducing commit and current HEAD", async (context) => {
  const root = await mkdtemp(
    path.join(os.tmpdir(), "chisan-product-publication-"),
  );
  context.after(() => rm(root, { recursive: true, force: true }));
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  await mkdir(path.join(root, "public"));
  await mkdir(path.join(root, "data/csv/es/catalunya"), { recursive: true });
  const csvPath = "data/csv/es/catalunya/barcelona.csv";
  const fields = {
    producer_id: "12439",
    country: "es",
    region: "catalunya",
    area: "barcelona",
    slug: "chisan",
    nombre: "Chisan",
    municipio: "Barcelona",
    categoria: "Otros",
    "Venta online": "no comprobado",
    "fecha ultimo cambio": "2026-09-05",
  };
  await writeFile(
    path.join(root, csvPath),
    stringify([fields], { header: true }),
  );
  git("init", "-q");
  git("config", "user.email", "test@example.org");
  git("config", "user.name", "Test");
  git("add", "data");
  git("commit", "-qm", "Base profile");
  const source = git("rev-parse", "HEAD");
  const change = proposeProducerProducts(emptyProducerContent("es", 12439), [
    product,
  ])!;
  const expected = resolveExpectedProducerChange(
    fields,
    hashProducerFields(fields),
    {},
    new Date("2026-09-05T12:00:00Z"),
    true,
  );
  assert.equal(
    expected.hash,
    hashProducerFields(fields),
    "a second approval on the same day can leave the CSV unchanged",
  );
  assert.throws(
    () =>
      resolveExpectedProducerChange(
        fields,
        hashProducerFields(fields),
        {},
        new Date(),
      ),
    /empty/,
  );
  const prepared = await prepareContentPublication(
    change,
    "es",
    12439,
    null,
    root,
  );
  const release = await prepared.lock();
  await prepared.write();
  await prepared.assertCurrent();
  await release();
  await assert.rejects(
    prepareContentPublication(change, "es", 12439, null, root),
    /changes|tracked|pathspec/,
  );
  assert.equal(
    (await prepareContentPublication(change, "es", 12439, source, root))
      .alreadyPresent,
    true,
  );
  git("add", prepared.relativePath);
  git("commit", "-qm", "Add products");
  const commit = git("rev-parse", "HEAD");
  const content = {
    relativePath: prepared.relativePath,
    hash: change.requestedHash,
    baseRowHash: hashProducerFields(fields),
  };
  assert.equal(
    assertFinalizationGitState(
      commit,
      source,
      csvPath,
      12439,
      expected.hash,
      root,
      content,
    ).commit,
    commit,
  );
  assert.throws(
    () =>
      assertFinalizationGitState(
        commit,
        source,
        csvPath,
        12439,
        expected.hash,
        root,
        { ...content, baseRowHash: "a".repeat(64) },
      ),
    /modify/,
    "a combined change cannot finalize a JSON-only commit",
  );
  assert.throws(
    () =>
      assertFinalizationGitState(
        source,
        source,
        csvPath,
        12439,
        expected.hash,
        root,
        content,
      ),
    /modify|exist/,
  );
  await writeFile(
    path.join(root, prepared.relativePath),
    JSON.stringify({
      ...prepared.requested,
      products: [{ ...product, name: "Changed later" }],
    }),
  );
  assert.throws(
    () =>
      assertFinalizationGitState(
        commit,
        source,
        csvPath,
        12439,
        expected.hash,
        root,
        content,
      ),
    /changes|dirty|staged|Uncommitted/i,
    "finalization refuses uncommitted product edits",
  );
  git("add", prepared.relativePath);
  git("commit", "-qm", "Later content");
  assert.throws(
    () =>
      assertFinalizationGitState(
        commit,
        source,
        csvPath,
        12439,
        expected.hash,
        root,
        content,
      ),
    /exact approved/,
  );
});

test("content rollback restores only its own write and preserves concurrent changes", async (context) => {
  const root = await mkdtemp(
    path.join(os.tmpdir(), "chisan-product-rollback-"),
  );
  context.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "public"));
  execFileSync("git", ["init", "-q"], { cwd: root });
  const change = proposeProducerProducts(emptyProducerContent("es", 12439), [
    product,
  ])!;
  const prepared = await prepareContentPublication(
    change,
    "es",
    12439,
    null,
    root,
  );
  const release = await prepared.lock();
  await prepared.write();
  await prepared.restore();
  await assert.rejects(readFile(prepared.target), { code: "ENOENT" });
  await release();
  const next = await prepareContentPublication(change, "es", 12439, null, root);
  const releaseNext = await next.lock();
  await next.write();
  await writeFile(next.target, "concurrent edit");
  await assert.rejects(next.restore(), /concurrently/);
  assert.equal(await readFile(next.target, "utf8"), "concurrent edit");
  await releaseNext();
});
