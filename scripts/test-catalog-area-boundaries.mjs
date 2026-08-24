import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildCatalogAreaBoundaries,
  checkCatalogAreaBoundaries,
} from "./build-catalog-area-boundaries.mjs";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function syntheticReference() {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { country: "es", area: "barcelona" },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
                [0, 0],
              ],
              [
                [0.4, 0.4],
                [0.4, 0.6],
                [0.6, 0.6],
                [0.6, 0.4],
                [0.4, 0.4],
              ],
            ],
            [
              [
                [2, 2],
                [3, 2],
                [3, 3],
                [2, 3],
                [2, 2],
              ],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { country: "es", area: "beta" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [0.45, 0.45],
              [0.55, 0.45],
              [0.55, 0.55],
              [0.45, 0.55],
              [0.45, 0.45],
            ],
          ],
        },
      },
    ],
  };
}

function syntheticSource() {
  return {
    id: "official-test-source",
    country: "es",
    title: "Official test boundary",
    publisher: "Official test publisher",
    feedUrl: "https://example.test/feed",
    downloadUrl: "https://example.test/feature",
    archiveUrl: "https://example.test/archive",
    sourceVersion: "2026-01-01T00:00:00Z",
    retrievedAt: "2026-01-02",
    sourceSha256: "0".repeat(64),
    archiveSha256: "1".repeat(64),
    referenceSha256: "2".repeat(64),
    sourceFeatureIds: ["official-feature-1", "official-feature-2"],
    license: "CC BY 4.0",
    licenseUrl: "https://example.test/license",
    attribution: "Official test attribution",
    boundaryUncertaintyMeters: 40,
    countryIndex: {
      kind: "coarse-country-extent",
      bbox: [-10, -10, 10, 10],
      crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      sourceUrl: "https://example.test/collection",
      sourcePath: "extent.spatial.bbox[0]",
      retrievedAt: "2026-01-02",
      sourceSha256: "3".repeat(64),
    },
    validationFixtures: {
      inside: [
        {
          id: "main-part",
          area: "barcelona",
          point: [0.2, 0.2],
          polygonIndex: 0,
        },
      ],
      holes: [
        {
          id: "retained-hole",
          area: "barcelona",
          point: [0.42, 0.42],
          polygonIndex: 0,
          ringIndex: 1,
          expectedArea: null,
        },
      ],
      borders: [
        {
          id: "retained-border",
          area: "barcelona",
          point: [0, 0.5],
          polygonIndex: 0,
          ringIndex: 0,
        },
      ],
      islands: [
        {
          id: "reviewed-island-component",
          area: "barcelona",
          point: [2.5, 2.5],
          polygonIndex: 1,
        },
      ],
      enclaves: [
        {
          id: "beta-enclave",
          area: "barcelona",
          point: [0.5, 0.5],
          polygonIndex: 0,
          ringIndex: 1,
          enclaveArea: "beta",
        },
      ],
    },
  };
}

function createWorkspace(t, mutate = () => {}) {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "chisan-catalog-geography-test-"));
  t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));

  const reference = syntheticReference();
  const source = syntheticSource();
  const areas = [{ slug: "barcelona" }, { slug: "beta" }];
  mutate({ reference, source, areas });

  const referenceContent = stableJson(reference);
  source.referenceSha256 = sha256(referenceContent);
  const referenceRoot = path.join(rootDir, "data/reference/catalog-area-boundaries");
  const csvRoot = path.join(rootDir, "data/csv/es");
  fs.mkdirSync(referenceRoot, { recursive: true });
  fs.mkdirSync(csvRoot, { recursive: true });
  fs.writeFileSync(path.join(referenceRoot, "es.geojson"), referenceContent);
  fs.writeFileSync(
    path.join(referenceRoot, "sources.json"),
    stableJson({ version: 1, sources: [source] }),
  );
  fs.writeFileSync(
    path.join(csvRoot, "country.json"),
    stableJson({ regions: [{ areas }] }),
  );
  return rootDir;
}

function expectCheckerFailure(t, mutate, pattern) {
  const rootDir = createWorkspace(t, mutate);
  assert.throws(() => checkCatalogAreaBoundaries({ rootDir }), pattern);
}

test("the checked-in pilot uses the official coarse Spain bbox and proves fidelity", () => {
  const sourceDocument = JSON.parse(
    fs.readFileSync(
      path.join(
        REPOSITORY_ROOT,
        "data/reference/catalog-area-boundaries/sources.json",
      ),
      "utf8",
    ),
  );
  const index = JSON.parse(
    fs.readFileSync(
      path.join(REPOSITORY_ROOT, "public/generated/catalog-geography/index.json"),
      "utf8",
    ),
  );
  const geography = JSON.parse(
    fs.readFileSync(
      path.join(REPOSITORY_ROOT, "public/generated/catalog-geography/es.json"),
      "utf8",
    ),
  );
  const source = sourceDocument.sources[0];

  assert.deepEqual(index.countries[0].bbox, source.countryIndex.bbox);
  assert.deepEqual(index.countries[0].bbox, [-19, 27, 5, 44]);
  assert.equal(source.countryIndex.sourcePath, "extent.spatial.bbox[0]");
  assert.ok(
    geography.simplification.maximumDeviationMeters <=
      geography.simplification.toleranceMeters,
  );
  assert.equal(geography.features[0].geometry.coordinates.length, 4);
  assert.deepEqual(
    geography.features[0].geometry.coordinates.map((polygon) => polygon.length),
    [4, 1, 1, 1],
  );
  assert.deepEqual(
    {
      inside: source.validationFixtures.inside.length,
      holes: source.validationFixtures.holes.length,
      borders: source.validationFixtures.borders.length,
      islands: source.validationFixtures.islands.length,
      enclaves: source.validationFixtures.enclaves.length,
    },
    { inside: 4, holes: 3, borders: 4, islands: 0, enclaves: 0 },
  );
  assert.equal(checkCatalogAreaBoundaries({ rootDir: REPOSITORY_ROOT }).length, 1);
});

test("the checker accepts valid multipolygon, hole, border, island and enclave fixtures", (t) => {
  const rootDir = createWorkspace(t);
  buildCatalogAreaBoundaries({ rootDir, write: true });
  assert.equal(checkCatalogAreaBoundaries({ rootDir }).length, 1);
});

test("the checker rejects invalid geometry", (t) => {
  expectCheckerFailure(
    t,
    ({ reference }) => {
      reference.features[0].geometry.coordinates[0][0].at(-1)[0] = 0.25;
    },
    /ring must be closed/,
  );
});

test("the checker rejects an unknown catalog key", (t) => {
  expectCheckerFailure(
    t,
    ({ reference }) => {
      reference.features[0].properties.area = "unknown";
    },
    /unknown catalog key 'es\/unknown'/,
  );
});

test("the checker rejects duplicate area ownership", (t) => {
  expectCheckerFailure(
    t,
    ({ reference, source }) => {
      reference.features.push(structuredClone(reference.features[0]));
      source.sourceFeatureIds.push("official-feature-3");
    },
    /duplicate ownership for 'es\/barcelona'/,
  );
});

test("the checker rejects a sampled overlap between distinct catalog areas", (t) => {
  expectCheckerFailure(
    t,
    ({ reference }) => {
      reference.features[1].geometry = structuredClone(
        reference.features[0].geometry,
      );
    },
    /sampled overlap/,
  );
});

test("the checker rejects a sampled gap", (t) => {
  expectCheckerFailure(
    t,
    ({ source }) => {
      source.validationFixtures.inside[0].point = [5, 5];
    },
    /sampled gap/,
  );
});

test("the checker rejects an island fixture outside its declared component", (t) => {
  expectCheckerFailure(
    t,
    ({ source }) => {
      source.validationFixtures.islands[0].polygonIndex = 0;
    },
    /island fixture.*not inside the declared island component/,
  );
});

test("the checker rejects an enclave fixture outside its declared enclave area", (t) => {
  expectCheckerFailure(
    t,
    ({ source }) => {
      source.validationFixtures.enclaves[0].point = [0.42, 0.42];
    },
    /enclave fixture.*not inside enclave area 'beta'/,
  );
});

test("the checker rejects missing source metadata", (t) => {
  expectCheckerFailure(
    t,
    ({ source }) => {
      delete source.publisher;
    },
    /publisher must be a non-empty string/,
  );
});

test("the checker rejects a missing redistribution licence", (t) => {
  expectCheckerFailure(
    t,
    ({ source }) => {
      delete source.license;
    },
    /licence must explicitly permit redistribution/,
  );
});

test("the checker rejects missing coarse-index provenance", (t) => {
  expectCheckerFailure(
    t,
    ({ source }) => {
      delete source.countryIndex;
    },
    /countryIndex: must be an object/,
  );
});

test("the checker rejects an index bbox that reveals exact activated coverage", (t) => {
  expectCheckerFailure(
    t,
    ({ source }) => {
      source.countryIndex.bbox = [0, 0, 3, 3];
    },
    /must not expose the exact activated-coverage bbox/,
  );
});
