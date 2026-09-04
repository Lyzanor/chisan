import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parse } from "csv-parse/sync";

import { producerContentPath } from "../lib/catalog/content";
import { validateContentAssets } from "../lib/editorial/content-assets";
import {
  contentSourceHash,
  emptyProducerContent,
  localizeProducerContent,
  producerContentSchema,
} from "../lib/catalog/content-schema";
import {
  applyProducerContent,
  contentRevision,
} from "../lib/editorial/producer-content";
import { validateProducerProposal } from "../lib/accounts/producer-fields";
import { hasCurrentProducerProse } from "../lib/catalog/localization";
import { parseProducerCsvRows } from "../lib/catalog/producers";
import {
  buildCatalogAlternateSet,
  buildLocalizedMetadata,
} from "../lib/catalog-metadata";

test("one shared field contract handles Unicode limits and three-letter source locales", () => {
  const fields = {
    nombre: "Example",
    municipio: "Barcelona",
    categoria: "Vino",
    "Venta online": "no comprobado",
    descripcion: "a".repeat(400),
    descripcion_locale: "kok",
  };
  assert.equal(validateProducerProposal(fields, {}).ok, true);
  assert.equal(
    validateProducerProposal({ ...fields, descripcion: "a".repeat(401) }, {})
      .ok,
    false,
  );
  assert.equal(
    validateProducerProposal({ ...fields, descripcion: "𠮷".repeat(400) }, {})
      .ok,
    true,
  );
});

test("related records enforce identity, unique IDs, references and plain text", () => {
  const content = emptyProducerContent("es", 1);
  content.products.push({
    id: "cheese",
    name: "Queso",
    description: "",
    locale: "es",
    media_ids: [],
    link_ids: [],
  });
  assert.equal(producerContentSchema.safeParse(content).success, true);
  assert.equal(
    producerContentSchema.safeParse({ ...content, producer_id: 0 }).success,
    false,
  );
  assert.equal(
    producerContentSchema.safeParse({
      ...content,
      products: [...content.products, ...content.products],
    }).success,
    false,
  );
  assert.equal(
    producerContentSchema.safeParse({
      ...content,
      products: [{ ...content.products[0], media_ids: ["missing"] }],
    }).success,
    false,
  );
  assert.equal(
    producerContentSchema.safeParse({
      ...content,
      products: [{ ...content.products[0], name: "<script>alert(1)</script>" }],
    }).success,
    false,
  );
  assert.equal(
    producerContentSchema.safeParse({
      ...content,
      links: [
        { id: "x", label: "More", locale: "en", url: "javascript:alert(1)" },
      ],
    }).success,
    false,
  );
  assert.equal(
    producerContentSchema.safeParse({
      ...content,
      links: [{ id: "x", label: "More", locale: "en", url: "bad url" }],
    }).success,
    false,
  );
  assert.equal(
    producerContentSchema.safeParse({
      ...content,
      products: [{ ...content.products[0], price: 1 }],
    }).success,
    false,
  );
  assert.throws(() => producerContentPath("../es", 1));
});

test("reviewed content translations cannot change facts and become stale after a source edit", () => {
  const content = emptyProducerContent("es", 1);
  const product = {
    id: "cheese",
    name: "Queso",
    description: "Elaborado en la finca.",
    locale: "es" as const,
    media_ids: [],
    link_ids: [],
  };
  content.products.push(product);
  content.translations.push({
    collection: "products",
    item_id: "cheese",
    locale: "en",
    source_hash: contentSourceHash("products", product),
    values: { name: "Cheese", description: "Made on the farm." },
  });
  assert.equal(
    localizeProducerContent(content, "en").products[0].name,
    "Cheese",
  );
  assert.equal(localizeProducerContent(content, "ca").products[0].locale, "es");
  const changed = structuredClone(content);
  changed.products[0].description = "Otro texto revisado.";
  assert.equal(localizeProducerContent(changed, "en").products[0].locale, "es");
  changed.translations[0].values.url = "https://unrelated.example";
  assert.equal(producerContentSchema.safeParse(changed).success, false);
});

test("gallery validates actual dimensions, existence and filesystem containment", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "chisan-content-assets-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const content = emptyProducerContent("es", 1);
  const directory = path.join(root, "public/productores/es/content/1");
  await mkdir(directory, { recursive: true });
  const png = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png);
  png.writeUInt32BE(400, 16);
  png.writeUInt32BE(300, 20);
  await writeFile(path.join(directory, "image.png"), png);
  content.gallery.push({
    id: "image",
    src: "/productores/es/content/1/image.png",
    alt: "A reviewed image",
    caption: "",
    locale: "en",
    width: 400,
    height: 300,
    credit: "",
  });
  await validateContentAssets(content, root);
  content.gallery[0].width = 500;
  await assert.rejects(validateContentAssets(content, root), /dimensions/);
  content.gallery[0].src = "/productores/es/content/1/missing.png";
  await assert.rejects(validateContentAssets(content, root));
  await writeFile(path.join(root, "outside.png"), png);
  await symlink(
    path.join(root, "outside.png"),
    path.join(directory, "escape.png"),
  );
  content.gallery[0].src = "/productores/es/content/1/escape.png";
  await assert.rejects(validateContentAssets(content, root), /escapes/);
});

test("local publication refuses stale or dirty targets and does not alter other producers", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "chisan-content-publish-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "public"));
  const git = (...args: string[]) => {
    const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
  };
  git("init", "-q");
  git("config", "user.email", "test@example.invalid");
  git("config", "user.name", "Test");
  git("commit", "--allow-empty", "-qm", "fixture");
  const rows = parse(
    await readFile("data/csv/es/catalunya/barcelona.csv", "utf8"),
    { columns: true },
  ) as { producer_id: string }[];
  const content = emptyProducerContent("es", Number(rows[0].producer_id));
  content.links.push({
    id: "details",
    label: "Details",
    locale: "en",
    url: "https://example.org/details",
  });
  const target = await applyProducerContent(content, "absent", root);
  assert.equal(
    JSON.parse(await readFile(target, "utf8")).links[0].id,
    "details",
  );
  await assert.rejects(
    applyProducerContent(content, "absent", root),
    /staged|untracked|changed/i,
  );
  git("add", "data/content");
  git("commit", "-qm", "content");
  await assert.rejects(
    applyProducerContent(content, "absent", root),
    /changed since review/,
  );
  const revision = await contentRevision(target);
  content.links[0].label = "Reviewed details";
  await applyProducerContent(content, revision, root);
  assert.equal(
    JSON.parse(await readFile(target, "utf8")).links[0].label,
    "Reviewed details",
  );
});

test("missing base translations keep canonical content usable and remove only incomplete indexing", async () => {
  const rows = parseProducerCsvRows(
    await readFile("data/csv/es/catalunya/barcelona.csv", "utf8"),
  );
  const row = {
    ...rows[0],
    fields: {
      ...rows[0].fields,
      descripcion: "Texto canónico.",
      descripcion_locale: "es",
      "quien hay detras": "",
      historia: "",
    },
  };
  assert.equal(hasCurrentProducerProse(row, "es", []), true);
  assert.equal(hasCurrentProducerProse(row, "ca", []), false);
  const target = {
    kind: "producer" as const,
    country: { slug: "es", defaultLocale: "es" as const },
    localePolicy: { publishedLocales: ["es", "ca"] as const },
    area: "barcelona",
    producer: { slug: "example" },
    indexableLocales: ["es"] as const,
  };
  const alternates = buildCatalogAlternateSet(target, "ca");
  assert.equal(
    alternates.canonical,
    "https://chisan.app/ca-es/barcelona/example",
  );
  assert.deepEqual(
    alternates.variants.map((variant) => variant.locale),
    ["es"],
  );
  const metadata = buildLocalizedMetadata({
    title: "Example",
    description: "",
    locale: "ca",
    alternates,
  });
  assert.equal((metadata.robots as { index: boolean }).index, false);
});
