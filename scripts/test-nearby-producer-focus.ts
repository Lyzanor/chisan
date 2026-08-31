import assert from "node:assert/strict";
import test from "node:test";

import {
  NEARBY_PRODUCER_FALLBACK_RADIUS_KM,
  NEARBY_PRODUCER_FOCUS_LIMIT,
  producerDistanceKm,
  selectNearbyProducerKeys,
} from "../lib/location/nearby-producer-focus";

const SANTA_COLOMA = { latitude: 41.4511, longitude: 2.2081 };

function point(key: string, latitudeOffset: number, longitudeOffset = 0) {
  return {
    key,
    latitude: SANTA_COLOMA.latitude + latitudeOffset,
    longitude: SANTA_COLOMA.longitude + longitudeOffset,
  };
}

test("nearby selection is distance ordered, deterministic and bounded", () => {
  const points = Array.from({ length: 16 }, (_, index) =>
    point(`producer-${String(index).padStart(2, "0")}`, index * 0.002),
  );
  const selected = selectNearbyProducerKeys(SANTA_COLOMA, points.reverse());

  assert.equal(selected.length, NEARBY_PRODUCER_FOCUS_LIMIT);
  assert.deepEqual(
    selected,
    Array.from({ length: NEARBY_PRODUCER_FOCUS_LIMIT }, (_, index) =>
      `producer-${String(index).padStart(2, "0")}`,
    ),
  );
});

test("nearby selection fills a sparse view without regional outliers", () => {
  const points = [
    point("near", 0.001),
    point("fallback-1", 0.16),
    point("fallback-2", 0.18),
    point("fallback-3", 0.2),
    point("regional-outlier", 0.3),
  ];

  assert.deepEqual(selectNearbyProducerKeys(SANTA_COLOMA, points), [
    "near",
    "fallback-1",
    "fallback-2",
    "fallback-3",
  ]);
  assert.equal(NEARBY_PRODUCER_FALLBACK_RADIUS_KM, 25);
});

test("distance and empty selection handle map edge cases", () => {
  assert.equal(producerDistanceKm(SANTA_COLOMA, SANTA_COLOMA), 0);
  assert.deepEqual(selectNearbyProducerKeys(SANTA_COLOMA, []), []);
  assert.ok(producerDistanceKm(SANTA_COLOMA, point("one-km", 0.009)) > 0.9);
});

test("nearby selection preserves the general view without enough public points", () => {
  assert.deepEqual(
    selectNearbyProducerKeys(SANTA_COLOMA, [
      point("near", 0.001),
      point("fallback-1", 0.16),
      point("fallback-2", 0.18),
    ]),
    [],
  );
});
