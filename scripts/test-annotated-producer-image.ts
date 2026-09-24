import assert from "node:assert/strict";
import test from "node:test";
import { imagePlacements, imageSelectionHref, imageTouchTargets, resolveImageSelection, type AnnotatedProducerImage } from "../lib/annotated-producer-image";
import { loadEvent } from "../lib/events/catalog";
import { hasProducerSelectionCoordinates } from "../lib/producer-selections";

const image: AnnotatedProducerImage = { imageSrc: "/fixture.webp", width: 1200, height: 800, points: [
  { id: "bottle-a", producerKey: "es:1", productId: "wine-a", label: "Wine A", x: 0.2, y: 0.3 },
  { id: "bottle-b", producerKey: "es:1", productId: "wine-b", label: "Wine B", x: 0.8, y: 0.3 },
  { id: "shared-a", producerKey: "es:1", label: "Shared stand", marker: "46", x: 0.5, y: 0.6 },
  { id: "shared-b", producerKey: "es:2", label: "Shared stand", marker: "46", x: 0.5, y: 0.6 },
  { id: "excluded", producerKey: "es:3", label: "Not in this selection", x: 0.1, y: 0.9 },
] };

test("one producer keeps its separate product appearances; a shared stand keeps both producers", () => {
  const placements = imagePlacements(image, new Set(["es:1", "es:2"]));
  assert.equal(placements.length, 3);
  assert.equal(placements[2].points.length, 2);
  assert.equal(resolveImageSelection(placements, "es:1", "").appearances.length, 3);
  assert.equal(resolveImageSelection(placements, "es:1", "").point, undefined, "map selection must not invent a preferred product");
  assert.equal(resolveImageSelection(placements, "es:1", "bottle-b").point?.productId, "wine-b");
  assert.equal(resolveImageSelection(placements, "es:2", "bottle-b").placement, undefined, "stale image state cannot select another producer's bottle");
  assert.equal(resolveImageSelection(placements, "", "shared-a").placement?.points.length, 2);
  assert.equal(resolveImageSelection(placements, "es:2", "shared-b").point?.producerKey, "es:2");
  assert.equal(resolveImageSelection(placements, "es:3", "excluded").placement, undefined);
});

test("URL state preserves the chosen occurrence and can represent a collective before a producer is chosen", () => {
  const path = "/u/shop";
  const url = new URL(imageSelectionHref(path, "es:1", "bottle-b"), "https://chisan.app");
  assert.equal(url.searchParams.get("highlight"), "es:1");
  assert.equal(url.searchParams.get("point"), "bottle-b");
  assert.equal(imageSelectionHref(path, ""), path);
  assert.equal(imageSelectionHref(path, "", "shared-a"), "/u/shop?point=shared-a");
});

test("crowded image targets offer a choice without losing any physical position", () => {
  const placements = imagePlacements(image, new Set(["es:1", "es:2"]));
  const narrow = imageTouchTargets(placements, 44, 44);
  assert.equal(narrow.length, 1);
  assert.equal(narrow[0].groups.length, 3);
  assert.equal(imageTouchTargets(placements, 1200, 800).length, 3);
  assert.equal(placements[2].points.length, 2, "touch layout must not mutate editorial relationships");
});

test("all Escumostra links and physical positions resolve by identity, including collective and unmapped producers", async () => {
  const page = await loadEvent("escumostra-2026");
  assert.ok(page?.event.plan);
  const source = { imageSrc: page.event.plan.src, ...page.event.plan };
  const shuffledItems = [...page.selection.items].reverse();
  const placements = imagePlacements(source, new Set(shuffledItems.map((item) => item.key)));
  assert.equal(placements.length, new Set(page.event.exhibitors.map((item) => item.stand)).size);
  for (const point of source.points) {
    const selected = resolveImageSelection(placements, point.producerKey, point.id);
    assert.equal(selected.point?.id, point.id);
    assert.equal(selected.placement?.marker, point.marker);
    const item = shuffledItems.find((item) => item.key === selected.point?.producerKey);
    assert.ok(item?.href.endsWith(`/${item.slug}`));
  }
  const unmapped = shuffledItems.filter((item) => !hasProducerSelectionCoordinates(item));
  assert.ok(unmapped.length > 0);
  assert.ok(unmapped.every((item) => resolveImageSelection(placements, item.key, "").appearances.length > 0));
});
