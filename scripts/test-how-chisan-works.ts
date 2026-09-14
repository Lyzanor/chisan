import assert from "node:assert/strict";
import test from "node:test";

import { loadCatalogSourceFigures } from "../lib/catalog/source-figures";
import { listCountryProducers } from "../lib/csv-catalog";
import {
  getHowChisanWorksCopy,
  HOW_CHISAN_WORKS_SOURCES,
} from "../lib/i18n/public-pages";

test("How Chisan works links each named database once over HTTPS", () => {
  const groups = Object.values(HOW_CHISAN_WORKS_SOURCES.groups);
  const sources = groups.flat();

  assert.ok(groups.every((group) => group.length > 0));
  assert.equal(new Set(sources.map(({ url }) => url)).size, sources.length);
  assert.equal(new Set(sources.map(({ name }) => name)).size, sources.length);
  for (const source of sources) {
    const url = new URL(source.url);
    assert.equal(url.protocol, "https:", source.url);
    assert.equal(url.search, "", source.url);
    assert.equal(source.name, source.name.trim(), source.url);
    assert.ok(source.name, source.url);
  }
});

test("both page languages present every database group in the same order", () => {
  const linkedGroups = (locale: "en" | "es") =>
    getHowChisanWorksCopy(locale).sourceGroups.flatMap((group) =>
      group.sources ? [group.sources] : [],
    );

  assert.deepEqual(linkedGroups("en"), linkedGroups("es"));
  assert.deepEqual(
    [...linkedGroups("es")].sort(),
    Object.keys(HOW_CHISAN_WORKS_SOURCES.groups).sort(),
  );
});

test("source figures agree with the published catalog and its evidence", async () => {
  const country = HOW_CHISAN_WORKS_SOURCES.country;
  const figures = await loadCatalogSourceFigures(country);

  assert.equal(figures.producers, (await listCountryProducers(country)).length);
  assert.ok(figures.municipalities > 0);
  assert.ok(figures.municipalities <= figures.producers);
  assert.ok(figures.websites > 0);
  assert.ok(figures.websites <= figures.sourceReferences);
});

test("a country outside the catalog has no source figures", async () => {
  assert.deepEqual(await loadCatalogSourceFigures("zz"), {
    producers: 0,
    municipalities: 0,
    sourceReferences: 0,
    websites: 0,
  });
});
