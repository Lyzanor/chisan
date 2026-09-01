import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  listPublishedCatalogCountrySlugs,
  resolveDefaultCatalogCountry,
} from "./lib/catalog-operation-scope.mjs";

function fixture(context) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "chisan-country-scope-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function writeManifest(root, country, publicationStatus) {
  const directory = path.join(root, country);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(
    path.join(directory, "country.json"),
    `${JSON.stringify({ publicationStatus })}\n`,
  );
}

test("the sole published manifest owns the operational default", (context) => {
  const root = fixture(context);
  writeManifest(root, "es", "published");
  writeManifest(root, "fr", "standby");

  assert.deepEqual(listPublishedCatalogCountrySlugs(root), ["es"]);
  assert.equal(resolveDefaultCatalogCountry(root), "es");
});

test("multiple published countries require an explicit country scope", (context) => {
  const root = fixture(context);
  writeManifest(root, "es", "published");
  writeManifest(root, "fr", "published");

  assert.throws(
    () => resolveDefaultCatalogCountry(root),
    /pass --country explicitly/,
  );
});

test("standby countries remain discoverable only through an explicit scope", (context) => {
  const root = fixture(context);
  writeManifest(root, "es", "published");
  writeManifest(root, "fr", "standby");

  assert.equal(fs.existsSync(path.join(root, "fr", "country.json")), true);
  assert.equal(listPublishedCatalogCountrySlugs(root).includes("fr"), false);
});
