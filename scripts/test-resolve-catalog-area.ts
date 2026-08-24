import assert from "node:assert/strict";
import test from "node:test";

import actualBarcelonaGeography from "../public/generated/catalog-geography/es.json";
import {
  resolveCatalogArea,
  type CatalogBoundaryFeature,
  type CatalogGeography,
} from "../lib/location/resolve-catalog-area";

const outerRing = [
  [0, 0],
  [0.01, 0],
  [0.01, 0.01],
  [0, 0.01],
  [0, 0],
] as [number, number][];
const holeRing = [
  [0.004, 0.004],
  [0.006, 0.004],
  [0.006, 0.006],
  [0.004, 0.006],
  [0.004, 0.004],
] as [number, number][];
const secondPolygon = [
  [0.02, 0.02],
  [0.03, 0.02],
  [0.03, 0.03],
  [0.02, 0.03],
  [0.02, 0.02],
] as [number, number][];

function feature(area: string, coordinates = [[outerRing, holeRing], [secondPolygon]]): CatalogBoundaryFeature {
  return {
    type: "Feature",
    properties: { country: "xx", area },
    geometry: { type: "MultiPolygon", coordinates },
  };
}

function geography(
  features: CatalogBoundaryFeature[] = [feature("alpha")],
  boundaryUncertaintyMeters = 40,
): CatalogGeography {
  return {
    version: 1,
    country: "xx",
    source: { boundaryUncertaintyMeters },
    type: "FeatureCollection",
    features,
  };
}

test("resolves a point confidently inside the primary polygon", () => {
  assert.deepEqual(
    resolveCatalogArea(
      { longitude: 0.002, latitude: 0.002, accuracyMeters: 5 },
      geography(),
    ),
    { status: "resolved", country: "xx", area: "alpha" },
  );
});

test("supports disjoint multipolygon parts and excludes interior holes", () => {
  assert.deepEqual(
    resolveCatalogArea(
      { longitude: 0.025, latitude: 0.025, accuracyMeters: 5 },
      geography(),
    ),
    { status: "resolved", country: "xx", area: "alpha" },
  );
  assert.deepEqual(
    resolveCatalogArea(
      { longitude: 0.005, latitude: 0.005, accuracyMeters: 5 },
      geography(),
    ),
    { status: "outside" },
  );
});

test("requires clearance for reported accuracy plus the source's 40 metre uncertainty", () => {
  const position = { longitude: 0.0015, latitude: 0.002, accuracyMeters: 100 };
  assert.deepEqual(resolveCatalogArea(position, geography()), {
    status: "resolved",
    country: "xx",
    area: "alpha",
  });
  assert.deepEqual(resolveCatalogArea({ ...position, accuracyMeters: 130 }, geography()), {
    status: "ambiguous",
    reason: "boundary",
    candidates: [{ country: "xx", area: "alpha" }],
  });
});

test("treats an accuracy circle touching a boundary from outside as ambiguous", () => {
  const position = { longitude: 0.011, latitude: 0.002, accuracyMeters: 80 };
  assert.deepEqual(resolveCatalogArea(position, geography()), {
    status: "ambiguous",
    reason: "boundary",
    candidates: [{ country: "xx", area: "alpha" }],
  });
  assert.deepEqual(resolveCatalogArea({ ...position, accuracyMeters: 60 }, geography()), {
    status: "outside",
  });
});

test("returns ambiguity when more than one reviewed area contains the position", () => {
  const overlapping = feature("beta", [[outerRing]]);
  assert.deepEqual(
    resolveCatalogArea(
      { longitude: 0.002, latitude: 0.002, accuracyMeters: 5 },
      geography([feature("alpha"), overlapping]),
    ),
    {
      status: "ambiguous",
      reason: "overlap",
      candidates: [
        { country: "xx", area: "alpha" },
        { country: "xx", area: "beta" },
      ],
    },
  );
});

test("never substitutes a nearest polygon for an uncovered point", () => {
  assert.deepEqual(
    resolveCatalogArea(
      { longitude: 0.05, latitude: 0.025, accuracyMeters: 5 },
      geography(),
    ),
    { status: "outside" },
  );
});

test("the generated Barcelona pilot resolves Barcelona and leaves Madrid uncovered", () => {
  const pilot = actualBarcelonaGeography as unknown as CatalogGeography;
  assert.deepEqual(
    resolveCatalogArea(
      { longitude: 2.1686, latitude: 41.3874, accuracyMeters: 25 },
      pilot,
    ),
    { status: "resolved", country: "es", area: "barcelona" },
  );
  assert.deepEqual(
    resolveCatalogArea(
      { longitude: -3.7038, latitude: 40.4168, accuracyMeters: 25 },
      pilot,
    ),
    { status: "outside" },
  );
});
