import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ProducerMapSelectionCard } from "../components/map/producer-map-selection-card";
import { buildCatalogSearchDocument, rankCatalogEntries, catalogDescriptionPreview, findCatalogSearchMatch } from "../lib/catalog-search";
import { buildCatalogHref, readCatalogQueryContext } from "../lib/catalog-navigation";
import { includeSelectedProducer, prioritizeProducerItems } from "../lib/catalog/producer-list";
import { positionMapPreview } from "../lib/map-preview-position";

test("map previews stay beside their point and inside the visible map at every edge", () => {
  const bounds = { left: 12, top: 92, right: 378, bottom: 480 };
  const size = { width: 336, height: 116 };
  for (const point of [{ x: 195, y: 320 }, { x: 14, y: 100 }, { x: 375, y: 100 }, { x: 375, y: 470 }, { x: 14, y: 470 }]) {
    const position = positionMapPreview(point, size, bounds);
    assert.ok(position.left >= bounds.left);
    assert.ok(position.top >= bounds.top);
    assert.ok(position.left + size.width <= bounds.right);
    assert.ok(position.top + size.height <= bounds.bottom);
    assert.ok(position.tip >= 12 && position.tip <= size.width - 12);
  }
  const above = positionMapPreview({ x: 195, y: 320 }, size, bounds);
  assert.equal(above.side, "above");
  assert.equal(above.top + size.height + 20, 320);
  const below = positionMapPreview({ x: 195, y: 100 }, size, bounds);
  assert.equal(below.side, "below");
  assert.equal(below.top, 120);
});

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

test("literal search uses complete base text, all terms and relevance with stable ties", () => {
  const fixture = (producerId: number, fields: Partial<Parameters<typeof buildCatalogSearchDocument>[0]>) => ({
    country: "es", producerId,
    search: buildCatalogSearchDocument({ name: "Finca", municipality: "Lugo", categories: ["Otros"], featuredProducts: "", description: "", ...fields }),
  });
  const entries = [
    fixture(1, { description: `${"Texto de contexto. ".repeat(20)}Miel de brezo.` }),
    fixture(2, { featuredProducts: "Miel de brezo" }),
    fixture(4, { name: "Miel de brezo" }),
    fixture(3, { name: "Miel de brezo" }),
    fixture(5, { name: "Miel", municipality: "Brezo" }),
  ];
  assert.deepEqual(rankCatalogEntries(entries, "MIEL de BRÉZO").map((p) => p.producerId), [3, 4, 2, 1]);
  assert.ok(rankCatalogEntries(entries, "brezo miel").some((p) => p.producerId === 5));
  assert.deepEqual(rankCatalogEntries(entries, "mieles"), []);
  assert.deepEqual(rankCatalogEntries(entries, "honey"), []);
  assert.deepEqual(rankCatalogEntries(entries, "miel inexistente"), []);
  assert.deepEqual(rankCatalogEntries(entries, "!!!"), []);
  assert.deepEqual(rankCatalogEntries(entries, ""), entries);
  assert.match(catalogDescriptionPreview("Contexto. ".repeat(30) + "Miel de brezo", "brezo"), /brezo/);
});

test("national map/list identity is stable even when provinces share a slug", () => {
  const a = { key: "1", slug: "finca" }, b = { key: "2", slug: "finca" };
  assert.deepEqual(prioritizeProducerItems([a, b], ["2"]), [b, a]);
  assert.deepEqual(includeSelectedProducer([a], b), [a, b]);
});

test("search URLs preserve text and national scope without carrying device position", () => {
  const query = readCatalogQueryContext({ q: "miel de brezo", search_scope: "country", lat: "42", lon: "-2" });
  assert.equal(buildCatalogHref({ country: "es", area: "barcelona", ...query }), "/es/barcelona?q=miel+de+brezo&search_scope=country");
  assert.equal(readCatalogQueryContext({ search_scope: "invalid" }).searchScope, undefined);
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
