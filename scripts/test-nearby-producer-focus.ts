import assert from "node:assert/strict";
import test from "node:test";

import {
  SIMILAR_PRODUCERS_MAX_DISTANCE_KM,
  selectSimilarNearbyProducers,
  type SimilarProducerCandidate,
} from "../lib/catalog/similar-producers";
import { getProducerDistanceMessages } from "../lib/i18n/producer-distance";
import { getSimilarProducersMessages } from "../lib/i18n/similar-producers";
import {
  NEARBY_PRODUCER_FALLBACK_RADIUS_KM,
  NEARBY_PRODUCER_FOCUS_LIMIT,
  producerDistanceKm,
  selectNearbyProducerKeys,
} from "../lib/location/nearby-producer-focus";
import {
  formatProducerDistanceKm,
  requestProducerDistance,
} from "../lib/location/producer-distance";
import { LOCATION_REQUEST_OPTIONS } from "../lib/location/location-onboarding";

const SANTA_COLOMA = { latitude: 41.4511, longitude: 2.2081 };

function producer(
  producerId: number,
  latitudeOffset: number,
  categories: string[],
): SimilarProducerCandidate {
  return {
    producerId,
    slug: `producer-${producerId}`,
    name: `Producer ${producerId}`,
    city: "Santa Coloma",
    area: "barcelona",
    categories,
    imageSrc: "/productores/generica.webp",
    latitude: SANTA_COLOMA.latitude + latitudeOffset,
    longitude: SANTA_COLOMA.longitude,
  };
}

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

test("producer distance is requested once and returns only the calculated kilometres", async () => {
  let calls = 0;
  let receivedOptions: PositionOptions | undefined;
  const geolocation: Pick<Geolocation, "getCurrentPosition"> = {
    getCurrentPosition(success, _failure, options) {
      calls += 1;
      receivedOptions = options;
      success({
        coords: {
          latitude: 40.4168,
          longitude: -3.7038,
          accuracy: 20,
        },
      } as GeolocationPosition);
    },
  };

  const result = await requestProducerDistance(geolocation, {
    latitude: 41.3874,
    longitude: 2.1686,
  });

  assert.equal(calls, 1);
  assert.deepEqual(receivedOptions, LOCATION_REQUEST_OPTIONS);
  assert.equal(result.status, "resolved");
  if (result.status === "resolved") {
    assert.ok(result.distanceKm > 500 && result.distanceKm < 510);
    assert.deepEqual(Object.keys(result).sort(), ["distanceKm", "status"]);
  }
});

test("producer distance handles browser failures and locale-aware kilometres", async () => {
  const denied: Pick<Geolocation, "getCurrentPosition"> = {
    getCurrentPosition(_success, failure) {
      failure?.({ code: 1 } as GeolocationPositionError);
    },
  };

  assert.deepEqual(await requestProducerDistance(denied, SANTA_COLOMA), {
    status: "failed",
    reason: "permission-denied",
  });
  assert.deepEqual(await requestProducerDistance(null, SANTA_COLOMA), {
    status: "failed",
    reason: "unavailable",
  });
  assert.equal(formatProducerDistanceKm(2.43, "es"), "2,4");
  assert.equal(formatProducerDistanceKm(2.43, "en"), "2.4");
  assert.equal(formatProducerDistanceKm(0.048, "es"), "0,05");
});

test("producer distance copy is localized for Spain and has a safe fallback", () => {
  assert.equal(
    getProducerDistanceMessages("es").title,
    "Distancia desde mi ubicación",
  );
  assert.equal(
    getProducerDistanceMessages("ca").result,
    "Aproximadament a {distance} km en línia recta.",
  );
  assert.equal(getProducerDistanceMessages("zu").title, "Distance from me");
});

test("similar producers share a category and are ordered by distance", () => {
  const current = producer(1, 0, ["quesos", "lacteos"]);
  const selected = selectSimilarNearbyProducers(current, [
    producer(4, 0.03, ["quesos"]),
    producer(2, 0.01, ["lacteos"]),
    producer(3, 0.02, ["vino"]),
    current,
  ]);

  assert.deepEqual(
    selected.map(({ producerId, sharedCategory }) => ({ producerId, sharedCategory })),
    [
      { producerId: 2, sharedCategory: "lacteos" },
      { producerId: 4, sharedCategory: "quesos" },
    ],
  );
});

test("similar producers are capped at three and exclude unsupported distances", () => {
  const current = producer(1, 0, ["quesos"]);
  const selected = selectSimilarNearbyProducers(current, [
    producer(5, 0.04, ["quesos"]),
    producer(4, 0.03, ["quesos"]),
    producer(3, 0.02, ["quesos"]),
    producer(2, 0.01, ["quesos"]),
    producer(6, 1, ["quesos"]),
  ]);

  assert.deepEqual(selected.map(({ producerId }) => producerId), [2, 3, 4]);
  assert.ok(
    selected.every(
      ({ distanceKm }) => distanceKm <= SIMILAR_PRODUCERS_MAX_DISTANCE_KM,
    ),
  );
  assert.deepEqual(
    selectSimilarNearbyProducers(
      { ...current, latitude: null },
      [producer(2, 0.01, ["quesos"])],
    ),
    [],
  );
});

test("similar-producer copy keeps the requested Spanish heading", () => {
  assert.equal(
    getSimilarProducersMessages("es").title,
    "Productores similares cerca",
  );
  assert.equal(
    getSimilarProducersMessages("zu").title,
    "Similar producers nearby",
  );
});

test("radius filtering includes its boundary and excludes missing or invalid points", async () => {
  const { isWithinRadius } = await import("../lib/location/radius-search");
  const centre = { latitude: 0, longitude: 0 };
  const point = { latitude: 0, longitude: 1 };
  const radiusKm = producerDistanceKm(centre, point);
  assert.equal(isWithinRadius(point, { ...centre, radiusKm }), true);
  assert.equal(isWithinRadius(point, { ...centre, radiusKm: radiusKm - 0.001 }), false);
  for (const invalid of [{ latitude: null, longitude: 0 }, { latitude: 91, longitude: 0 }, { latitude: NaN, longitude: 0 }]) {
    assert.equal(isWithinRadius(invalid, { ...centre, radiusKm: 25 }), false);
  }
  assert.equal(isWithinRadius(centre, { ...centre, radiusKm: 0 }), false);
  assert.equal(isWithinRadius({ latitude: 0, longitude: -179.9 }, { latitude: 0, longitude: 179.9, radiusKm: 25 }), true);
  assert.ok(Number.isFinite(producerDistanceKm({ latitude: 45, longitude: 0 }, { latitude: -45, longitude: 180 })));
});
