import assert from "node:assert/strict";
import test from "node:test";

import { resolveProducerRouteAliasWithAreaFallback } from "../lib/producer-route-aliases";

function aliasLookup(entries: Readonly<Record<string, number>>) {
  return (area: string, slug: string): number | null =>
    entries[`${area}/${slug}`] ?? null;
}

test("an exact historical area and slug pair wins before area normalization", () => {
  const lookup = aliasLookup({
    "old-area/old-slug": 41,
    "current-area/old-slug": 42,
  });

  assert.equal(
    resolveProducerRouteAliasWithAreaFallback(
      "old-area",
      "old-slug",
      "current-area",
      lookup,
    ),
    41,
  );
});

test("an area alias may fall back to a producer alias stored under the current area", () => {
  const lookup = aliasLookup({ "current-area/old-slug": 42 });

  assert.equal(
    resolveProducerRouteAliasWithAreaFallback(
      "old-area",
      "old-slug",
      "current-area",
      lookup,
    ),
    42,
  );
});

test("multiple historical routes may resolve to the same producer id", () => {
  const lookup = aliasLookup({
    "first-area/first-slug": 42,
    "second-area/second-slug": 42,
  });

  assert.equal(
    resolveProducerRouteAliasWithAreaFallback(
      "first-area",
      "first-slug",
      "first-area",
      lookup,
    ),
    42,
  );
  assert.equal(
    resolveProducerRouteAliasWithAreaFallback(
      "second-area",
      "second-slug",
      "second-area",
      lookup,
    ),
    42,
  );
});
