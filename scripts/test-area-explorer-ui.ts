import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ProducerMapSelectionCard } from "../components/map/producer-map-selection-card";
import { buildCatalogSearchDocument, rankCatalogEntries, catalogDescriptionPreview, findCatalogSearchMatch } from "../lib/catalog-search";
import { buildCatalogHref, readCatalogQueryContext } from "../lib/catalog-navigation";
import { includeSelectedProducer, prioritizeProducerItems } from "../lib/catalog/producer-list";
import { positionMapPreview } from "../lib/map-preview-position";
import {
  PRODUCER_GROUP_DETAIL_ZOOM,
  PRODUCER_GROUP_MIN_POINTS,
  mergeOverlappingProducerGroups,
  selectOpeningProducerPoints,
  shouldGroupProducerMap,
  summarizeProducerMapGroups,
  type ProducerMapGroup,
} from "../lib/producer-map-groups";

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

test("dense multi-province maps count exact points per province below province zoom", () => {
  const dense = PRODUCER_GROUP_MIN_POINTS + 1;
  assert.equal(shouldGroupProducerMap({ zoom: PRODUCER_GROUP_DETAIL_ZOOM - 1, pointCount: dense, groupCount: 2 }), true);
  assert.equal(shouldGroupProducerMap({ zoom: PRODUCER_GROUP_DETAIL_ZOOM, pointCount: dense, groupCount: 2 }), false);
  assert.equal(shouldGroupProducerMap({ zoom: 5, pointCount: PRODUCER_GROUP_MIN_POINTS, groupCount: 2 }), false);
  assert.equal(shouldGroupProducerMap({ zoom: 5, pointCount: dense, groupCount: 1 }), false);

  const point = (key: string, area: string, latitude: number, longitude: number) => ({
    key, href: `/es/${area}/${key}`, name: key, city: "", icon: "", categories: [], latitude, longitude,
    group: { key: area, label: area.toUpperCase() },
  });
  const islands = [point("mallorca-1", "baleares", 39.6, 2.9), point("ibiza", "baleares", 38.9, 1.43),
    point("mallorca-2", "baleares", 39.57, 2.65), point("menorca", "baleares", 39.95, 4.1)];
  const inland = [point("madrid-1", "madrid", 40.42, -3.7), point("madrid-2", "madrid", 40.48, -3.36)];
  const groups = summarizeProducerMapGroups([...inland, ...islands]);
  assert.deepEqual(groups.map(({ members, count }) => [members, count]), [
    [[{ key: "baleares", label: "BALEARES", count: 4 }], 4],
    [[{ key: "madrid", label: "MADRID", count: 2 }], 2],
  ]);
  // The count sits on a real producer coordinate, never an invented midpoint.
  assert.deepEqual([groups[0].latitude, groups[0].longitude], [39.6, 2.9]);
  assert.deepEqual([groups[0].south, groups[0].west, groups[0].north, groups[0].east], [38.9, 1.43, 39.95, 4.1]);
  assert.deepEqual(summarizeProducerMapGroups([...islands].reverse()), summarizeProducerMapGroups(islands));
  assert.deepEqual(summarizeProducerMapGroups([...inland, { ...islands[0], group: undefined }]), []);
});

test("province counts that would touch combine without losing or moving producers", () => {
  const group = (key: string, count: number, x: number): ProducerMapGroup => ({
    members: [{ key, label: key, count }], count, latitude: 0, longitude: x, south: 0, west: x, north: 0, east: x,
  });
  const place = ({ longitude, count }: ProducerMapGroup) => ({
    x: longitude, y: 0, width: 20 + String(count).length * 10, height: 32,
  });
  const separate = mergeOverlappingProducerGroups([group("small", 5, 40), group("large", 900, 0), group("far", 50, 300)], place);
  assert.deepEqual(separate.map(({ members, count, longitude }) => [members.map(({ key }) => key), count, longitude]), [
    [["large", "small"], 905, 0],
    [["far"], 50, 300],
  ]);
  // Widening 990 to 1010 reaches a count that touched neither original label.
  const chained = mergeOverlappingProducerGroups([group("a", 990, 0), group("c", 50, 50), group("b", 20, -40)], place);
  assert.deepEqual(chained.map(({ members, count, longitude }) => [members.map(({ key }) => key), count, longitude]), [
    [["a", "c", "b"], 1060, 0],
  ]);
  assert.deepEqual([chained[0].west, chained[0].east], [-40, 50]);
});

test("a dense country opens on its main cluster while distant minorities stay mapped", () => {
  const at = (key: string, latitude: number, longitude: number) => ({ key, latitude, longitude });
  const keys = (points: readonly { key: string }[]) => points.map(({ key }) => key);
  const peninsula = Array.from({ length: 208 }, (_, index) =>
    at(`peninsula-${index}`, 36 + Math.floor(index / 13) * 0.5, -9 + (index % 13)));
  const balearic = [at("mallorca", 39.6, 2.9), at("menorca", 39.95, 4.1)];
  const canary = [at("tenerife", 28.3, -16.5), at("lanzarote", 29, -13.6)];

  // Near islands open with the peninsula; a far minority stays out of the opening view.
  assert.deepEqual(keys(selectOpeningProducerPoints([...canary, ...peninsula, ...balearic])),
    keys([...peninsula, ...balearic]));
  // A distant cluster holding at least a tenth of the results stays in the opening view.
  const fewMainland = [...peninsula.slice(0, 13), ...canary];
  assert.deepEqual(keys(selectOpeningProducerPoints(fewMainland)), keys(fewMainland));
  // Results that live on the islands open there.
  const islands = Array.from({ length: 12 }, (_, index) => at(`canary-${index}`, 28 + index * 0.1, -16 + index * 0.2));
  assert.deepEqual(keys(selectOpeningProducerPoints([peninsula[0], ...islands])), keys(islands));
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

test("base category tokens partition the 10 core categories with robust normalization", async () => {
  const { BASE_CATEGORY_TOKENS, isBaseCategory } = await import("../components/area-explorer");
  const { getCatalogSearchMessages } = await import("../lib/i18n/catalog-search");

  const expectedTokens = [
    "Café",
    "Carne",
    "Cerveza",
    "Dulces y repostería",
    "Fruta y verdura",
    "Helados",
    "Lácteos y quesos",
    "Pan y cereal",
    "Pescado",
    "Vino",
  ];

  assert.equal(BASE_CATEGORY_TOKENS.size, 10);
  for (const token of expectedTokens) {
    assert.ok(BASE_CATEGORY_TOKENS.has(token), `Expected token ${token} in BASE_CATEGORY_TOKENS`);
    assert.ok(isBaseCategory(token), `Expected isBaseCategory(${token}) to be true`);
  }

  // Normalized / alternate casing matches
  assert.ok(isBaseCategory("Pan y Cereal"));
  assert.ok(isBaseCategory("café"));
  assert.ok(isBaseCategory("CARNE"));

  // Non-base categories return false
  assert.equal(isBaseCategory("Aceite"), false);
  assert.equal(isBaseCategory("Miel"), false);
  assert.equal(isBaseCategory("Conservas"), false);
  assert.equal(isBaseCategory("Chocolate"), false);

  // Internationalized messages include moreCategories and fewerCategories
  assert.equal(getCatalogSearchMessages("es").moreCategories, "Más categorías");
  assert.equal(getCatalogSearchMessages("ca").moreCategories, "Més categories");
  assert.equal(getCatalogSearchMessages("en").moreCategories, "More categories");
  assert.equal(getCatalogSearchMessages("es").fewerCategories, "Menos categorías");
  assert.equal(getCatalogSearchMessages("ca").fewerCategories, "Menys categories");
  assert.equal(getCatalogSearchMessages("en").fewerCategories, "Fewer categories");
});

