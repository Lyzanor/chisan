import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ProducerMapSelectionCard } from "../components/map/producer-map-selection-card";
import { findCatalogSearchMatch } from "../lib/catalog-search";
import { includeSelectedProducer, prioritizeProducerItems } from "../lib/catalog/producer-list";

test("nearby priority preserves the full roster and stable remaining order", () => {
  const items = ["a", "b", "c", "d"].map((slug) => ({ slug }));
  const ordered = prioritizeProducerItems(items, ["c", "missing", "c", "b"]);
  assert.deepEqual(ordered.map((item) => item.slug), ["c", "b", "a", "d"]);
  assert.equal(new Set(ordered).size, items.length);
  assert.deepEqual(prioritizeProducerItems(items, []), items);
  assert.deepEqual(items.map((item) => item.slug), ["a", "b", "c", "d"]);
});

test("selection stays reachable beyond the list limit without reordering or duplicates", () => {
  const items = Array.from({ length: 410 }, (_, index) => ({ slug: `p-${index}` }));
  const visible = items.slice(0, 400);
  assert.equal(includeSelectedProducer(visible, items[10]), visible);
  assert.equal(includeSelectedProducer(visible), visible);
  const selected = includeSelectedProducer(visible, items[409]);
  assert.equal(selected.length, 401);
  assert.deepEqual(selected.slice(0, 400), visible);
  assert.equal(selected[400], items[409]);
});

test("search highlights preserve original spelling and Unicode ranges", () => {
  assert.deepEqual(findCatalogSearchMatch("Aranjuez", "aran"), { start: 0, end: 4 });
  assert.deepEqual(findCatalogSearchMatch("Penedès", "penedes"), { start: 0, end: 7 });
  assert.deepEqual(findCatalogSearchMatch("Cafe\u0301", "café"), { start: 0, end: 5 });
  assert.equal(findCatalogSearchMatch("Aranjuez", "vino"), null);
  assert.equal(findCatalogSearchMatch("Aranjuez", ""), null);
});

test("a selected producer renders one accessible destination with safe text and a lazy image", () => {
  const html = renderToStaticMarkup(createElement(ProducerMapSelectionCard, { producer: {
    href: "/es/barcelona/example", name: "Example & Farm", description: "<script>text</script>", imageSrc: "/productores/default.webp",
  } }));
  assert.equal((html.match(/<a\b/g) ?? []).length, 1);
  assert.match(html, /href="\/es\/barcelona\/example"/);
  assert.match(html, /Example &amp; Farm/);
  assert.match(html, /&lt;script&gt;text&lt;\/script&gt;/);
  assert.match(html, /alt=""/);
  assert.match(html, /loading="lazy"/);
  const sparse = renderToStaticMarkup(createElement(ProducerMapSelectionCard, { producer: {
    href: "/es/barcelona/example", name: "Example", description: "", imageSrc: "/productores/default.webp",
  } }));
  assert.doesNotMatch(sparse, /<span><\/span>/);
});
