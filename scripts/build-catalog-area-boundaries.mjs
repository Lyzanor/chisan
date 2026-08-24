#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const REFERENCE_RELATIVE_ROOT = "data/reference/catalog-area-boundaries";
const GENERATED_RELATIVE_ROOT = "public/generated/catalog-geography";
const SOURCES_FILENAME = "sources.json";
const OUTPUT_VERSION = 1;
const SIMPLIFICATION_TOLERANCE_METERS = 20;
const COORDINATE_PRECISION = 6;
const EARTH_RADIUS_METERS = 6_371_008.8;

const SOURCE_KEYS = new Set([
  "id",
  "country",
  "title",
  "publisher",
  "feedUrl",
  "downloadUrl",
  "archiveUrl",
  "sourceVersion",
  "retrievedAt",
  "sourceSha256",
  "archiveSha256",
  "referenceSha256",
  "sourceFeatureIds",
  "license",
  "licenseUrl",
  "attribution",
  "boundaryUncertaintyMeters",
  "countryIndex",
  "validationFixtures",
]);

const COUNTRY_INDEX_KEYS = new Set([
  "kind",
  "bbox",
  "crs",
  "sourceUrl",
  "sourcePath",
  "retrievedAt",
  "sourceSha256",
]);
const FIXTURE_GROUP_KEYS = new Set([
  "inside",
  "holes",
  "borders",
  "islands",
  "enclaves",
]);
const INSIDE_FIXTURE_KEYS = new Set(["id", "area", "point", "polygonIndex"]);
const ISLAND_FIXTURE_KEYS = INSIDE_FIXTURE_KEYS;
const HOLE_FIXTURE_KEYS = new Set([
  "id",
  "area",
  "point",
  "polygonIndex",
  "ringIndex",
  "expectedArea",
]);
const BORDER_FIXTURE_KEYS = new Set([
  "id",
  "area",
  "point",
  "polygonIndex",
  "ringIndex",
]);
const ENCLAVE_FIXTURE_KEYS = new Set([
  "id",
  "area",
  "point",
  "polygonIndex",
  "ringIndex",
  "enclaveArea",
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${filePath}: cannot parse JSON (${error.message})`);
  }
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function isHttpsUrl(value) {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  return new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}

function isIsoInstant(value) {
  if (typeof value !== "string") return false;
  const parsed = new Date(value);
  return (
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().replace(".000Z", "Z") === value
  );
}

function isSha256(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

function assertExactKeys(value, expectedKeys, location) {
  assert(isPlainObject(value), `${location}: must be an object`);
  const actualKeys = Object.keys(value);
  const unknownKeys = actualKeys.filter((key) => !expectedKeys.has(key));
  const missingKeys = [...expectedKeys].filter((key) => !(key in value));
  assert(
    unknownKeys.length === 0 && missingKeys.length === 0,
    `${location}: fields must be exactly ${[...expectedKeys].join(", ")}`,
  );
}

function validateBbox(value, location) {
  assert(
    Array.isArray(value) &&
      value.length === 4 &&
      value.every(Number.isFinite),
    `${location}: bbox must contain four finite numbers`,
  );
  const [west, south, east, north] = value;
  assert(
    west >= -180 && east <= 180 && south >= -90 && north <= 90,
    `${location}: bbox is outside CRS84 coordinate limits`,
  );
  assert(west < east && south < north, `${location}: bbox bounds must be ordered`);
}

function validatePoint(value, location) {
  assert(
    Array.isArray(value) && value.length === 2 && value.every(Number.isFinite),
    `${location}: point must be a two-dimensional coordinate`,
  );
  assert(
    value[0] >= -180 && value[0] <= 180 && value[1] >= -90 && value[1] <= 90,
    `${location}: point is outside CRS84 coordinate limits`,
  );
}

function validateCountryIndex(countryIndex, location) {
  assertExactKeys(countryIndex, COUNTRY_INDEX_KEYS, location);
  assert(
    countryIndex.kind === "coarse-country-extent",
    `${location}: kind must be 'coarse-country-extent'`,
  );
  validateBbox(countryIndex.bbox, `${location} bbox`);
  assert(
    countryIndex.crs === "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
    `${location}: crs must be OGC CRS84`,
  );
  assert(isHttpsUrl(countryIndex.sourceUrl), `${location}: sourceUrl must be HTTPS`);
  assert(
    typeof countryIndex.sourcePath === "string" && countryIndex.sourcePath.trim(),
    `${location}: sourcePath must identify the bbox field in the source response`,
  );
  assert(isIsoDate(countryIndex.retrievedAt), `${location}: retrievedAt must be YYYY-MM-DD`);
  assert(
    isSha256(countryIndex.sourceSha256),
    `${location}: sourceSha256 must be a lowercase SHA-256`,
  );
}

function validateFixtureEntry(fixture, keys, location, fixtureIds) {
  assertExactKeys(fixture, keys, location);
  assert(
    typeof fixture.id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fixture.id),
    `${location}: id must be a lowercase slug`,
  );
  assert(!fixtureIds.has(fixture.id), `${location}: duplicate fixture id '${fixture.id}'`);
  fixtureIds.add(fixture.id);
  assert(
    typeof fixture.area === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fixture.area),
    `${location}: area must be a lowercase slug`,
  );
  validatePoint(fixture.point, `${location} point`);
  assert(
    Number.isInteger(fixture.polygonIndex) && fixture.polygonIndex >= 0,
    `${location}: polygonIndex must be a non-negative integer`,
  );
  if (keys.has("ringIndex")) {
    assert(
      Number.isInteger(fixture.ringIndex) && fixture.ringIndex >= 0,
      `${location}: ringIndex must be a non-negative integer`,
    );
  }
  if (keys.has("expectedArea")) {
    assert(
      fixture.expectedArea === null ||
        (typeof fixture.expectedArea === "string" &&
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fixture.expectedArea)),
      `${location}: expectedArea must be null or a lowercase area slug`,
    );
  }
  if (keys.has("enclaveArea")) {
    assert(
      typeof fixture.enclaveArea === "string" &&
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fixture.enclaveArea),
      `${location}: enclaveArea must be a lowercase area slug`,
    );
    assert(
      fixture.enclaveArea !== fixture.area,
      `${location}: enclaveArea must differ from the enclosing area`,
    );
  }
}

function validateFixtureDocument(fixtures, location) {
  assertExactKeys(fixtures, FIXTURE_GROUP_KEYS, location);
  assert(
    Array.isArray(fixtures.inside) && fixtures.inside.length > 0,
    `${location}: inside must be a non-empty array`,
  );
  assert(Array.isArray(fixtures.holes), `${location}: holes must be an array`);
  assert(Array.isArray(fixtures.islands), `${location}: islands must be an array`);
  assert(Array.isArray(fixtures.enclaves), `${location}: enclaves must be an array`);
  assert(
    Array.isArray(fixtures.borders) && fixtures.borders.length > 0,
    `${location}: borders must be a non-empty array`,
  );

  const fixtureIds = new Set();
  fixtures.inside.forEach((fixture, index) =>
    validateFixtureEntry(
      fixture,
      INSIDE_FIXTURE_KEYS,
      `${location} inside fixture ${index + 1}`,
      fixtureIds,
    ),
  );
  for (const [group, entries, keys] of [
    ["hole", fixtures.holes, HOLE_FIXTURE_KEYS],
    ["border", fixtures.borders, BORDER_FIXTURE_KEYS],
    ["island", fixtures.islands, ISLAND_FIXTURE_KEYS],
    ["enclave", fixtures.enclaves, ENCLAVE_FIXTURE_KEYS],
  ]) {
    entries.forEach((fixture, index) =>
      validateFixtureEntry(
        fixture,
        keys,
        `${location} ${group} fixture ${index + 1}`,
        fixtureIds,
      ),
    );
  }
}

function validateSourcesDocument(document, referenceRoot) {
  assert(isPlainObject(document), `${SOURCES_FILENAME}: root must be an object`);
  assert(document.version === 1, `${SOURCES_FILENAME}: version must be 1`);
  assert(
    Array.isArray(document.sources) && document.sources.length > 0,
    `${SOURCES_FILENAME}: sources must be a non-empty array`,
  );

  const sourcesByCountry = new Map();
  const sourceIds = new Set();

  for (const [index, source] of document.sources.entries()) {
    const location = `${SOURCES_FILENAME} source ${index + 1}`;
    assert(isPlainObject(source), `${location}: source must be an object`);

    const unknownKeys = Object.keys(source).filter((key) => !SOURCE_KEYS.has(key));
    assert(
      unknownKeys.length === 0,
      `${location}: unknown field(s): ${unknownKeys.join(", ")}`,
    );

    for (const key of ["id", "country", "title", "publisher", "attribution"]) {
      assert(
        typeof source[key] === "string" && source[key].trim(),
        `${location}: ${key} must be a non-empty string`,
      );
    }

    assert(!sourceIds.has(source.id), `${location}: duplicate source id '${source.id}'`);
    assert(
      !sourcesByCountry.has(source.country),
      `${location}: country '${source.country}' has more than one source`,
    );
    assert(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.country),
      `${location}: country must be a lowercase slug`,
    );

    for (const key of ["feedUrl", "downloadUrl", "archiveUrl", "licenseUrl"]) {
      assert(isHttpsUrl(source[key]), `${location}: ${key} must be an HTTPS URL`);
    }

    assert(
      isIsoInstant(source.sourceVersion),
      `${location}: sourceVersion must be a canonical ISO timestamp`,
    );
    assert(isIsoDate(source.retrievedAt), `${location}: retrievedAt must be YYYY-MM-DD`);
    assert(
      source.license === "CC BY 4.0",
      `${location}: licence must explicitly permit redistribution as CC BY 4.0`,
    );
    assert(
      Number.isFinite(source.boundaryUncertaintyMeters) &&
        source.boundaryUncertaintyMeters >= 0,
      `${location}: boundaryUncertaintyMeters must be a non-negative number`,
    );
    validateCountryIndex(source.countryIndex, `${location} countryIndex`);
    validateFixtureDocument(
      source.validationFixtures,
      `${location} validationFixtures`,
    );

    for (const key of ["sourceSha256", "archiveSha256", "referenceSha256"]) {
      assert(isSha256(source[key]), `${location}: ${key} must be a lowercase SHA-256`);
    }

    assert(
      Array.isArray(source.sourceFeatureIds) && source.sourceFeatureIds.length > 0,
      `${location}: sourceFeatureIds must be a non-empty array`,
    );
    assert(
      new Set(source.sourceFeatureIds).size === source.sourceFeatureIds.length &&
        source.sourceFeatureIds.every(
          (value) => typeof value === "string" && value.trim(),
        ),
      `${location}: sourceFeatureIds must contain unique non-empty strings`,
    );

    const referencePath = path.join(referenceRoot, `${source.country}.geojson`);
    assert(fs.existsSync(referencePath), `${location}: missing ${source.country}.geojson`);
    const referenceBytes = fs.readFileSync(referencePath);
    assert(
      sha256(referenceBytes) === source.referenceSha256,
      `${location}: referenceSha256 does not match ${source.country}.geojson`,
    );

    sourceIds.add(source.id);
    sourcesByCountry.set(source.country, source);
  }

  return sourcesByCountry;
}

function loadCatalogAreaKeys(csvRoot) {
  assert(fs.existsSync(csvRoot), `${csvRoot}: CSV registry does not exist`);
  const areaKeys = new Set();

  for (const countryEntry of fs.readdirSync(csvRoot, { withFileTypes: true })) {
    if (!countryEntry.isDirectory()) continue;
    const manifestPath = path.join(csvRoot, countryEntry.name, "country.json");
    if (!fs.existsSync(manifestPath)) continue;
    const manifest = readJson(manifestPath);
    assert(
      Array.isArray(manifest.regions),
      `${manifestPath}: regions must be an array for geography validation`,
    );
    for (const region of manifest.regions) {
      assert(
        isPlainObject(region) && Array.isArray(region.areas),
        `${manifestPath}: every region must contain areas`,
      );
      for (const area of region.areas) {
        assert(
          isPlainObject(area) && typeof area.slug === "string" && area.slug,
          `${manifestPath}: every area must have a slug`,
        );
        areaKeys.add(`${countryEntry.name}/${area.slug}`);
      }
    }
  }

  return areaKeys;
}

function coordinatesEqual(left, right) {
  return left[0] === right[0] && left[1] === right[1];
}

function signedRingArea(ring) {
  let sum = 0;
  for (let index = 0; index < ring.length - 1; index += 1) {
    const current = ring[index];
    const next = ring[index + 1];
    sum += current[0] * next[1] - next[0] * current[1];
  }
  return sum / 2;
}

function validateRing(ring, location) {
  assert(Array.isArray(ring) && ring.length >= 4, `${location}: ring needs at least 4 positions`);
  for (const [index, coordinate] of ring.entries()) {
    assert(
      Array.isArray(coordinate) && coordinate.length === 2,
      `${location} position ${index + 1}: expected a two-dimensional coordinate`,
    );
    const [longitude, latitude] = coordinate;
    assert(
      Number.isFinite(longitude) && longitude >= -180 && longitude <= 180,
      `${location} position ${index + 1}: longitude is outside [-180, 180]`,
    );
    assert(
      Number.isFinite(latitude) && latitude >= -90 && latitude <= 90,
      `${location} position ${index + 1}: latitude is outside [-90, 90]`,
    );
  }
  assert(
    coordinatesEqual(ring[0], ring[ring.length - 1]),
    `${location}: ring must be closed`,
  );
  assert(Math.abs(signedRingArea(ring)) > 1e-14, `${location}: ring has zero area`);
}

function pointOnSegment(point, start, end) {
  const cross =
    (point[1] - start[1]) * (end[0] - start[0]) -
    (point[0] - start[0]) * (end[1] - start[1]);
  if (Math.abs(cross) > 1e-11) return false;
  const dot =
    (point[0] - start[0]) * (end[0] - start[0]) +
    (point[1] - start[1]) * (end[1] - start[1]);
  if (dot < 0) return false;
  const squaredLength =
    (end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2;
  return dot <= squaredLength;
}

function classifyPointInRing(point, ring) {
  let inside = false;
  for (let current = 0, previous = ring.length - 2; current < ring.length - 1; previous = current++) {
    const start = ring[previous];
    const end = ring[current];
    if (pointOnSegment(point, start, end)) return "boundary";
    if (
      (start[1] > point[1]) !== (end[1] > point[1]) &&
      point[0] <
        ((end[0] - start[0]) * (point[1] - start[1])) /
          (end[1] - start[1]) +
          start[0]
    ) {
      inside = !inside;
    }
  }
  return inside ? "inside" : "outside";
}

function classifyPointInPolygon(point, polygon) {
  const exterior = classifyPointInRing(point, polygon[0]);
  if (exterior !== "inside") return exterior;
  for (let index = 1; index < polygon.length; index += 1) {
    const hole = classifyPointInRing(point, polygon[index]);
    if (hole === "boundary") return "boundary";
    if (hole === "inside") return "outside";
  }
  return "inside";
}

function classifyPointInGeometry(point, geometry) {
  let inside = false;
  for (const polygon of geometryPolygons(geometry, "fixture geometry")) {
    const classification = classifyPointInPolygon(point, polygon);
    if (classification === "boundary") return "boundary";
    if (classification === "inside") inside = true;
  }
  return inside ? "inside" : "outside";
}

function coverageAtPoint(features, point) {
  const inside = [];
  const boundary = [];
  for (const feature of features) {
    const classification = classifyPointInGeometry(point, feature.geometry);
    if (classification === "inside") inside.push(feature.properties.area);
    if (classification === "boundary") boundary.push(feature.properties.area);
  }
  inside.sort((left, right) => left.localeCompare(right, "en"));
  boundary.sort((left, right) => left.localeCompare(right, "en"));
  return { inside, boundary };
}

function validatePolygon(polygon, location) {
  assert(Array.isArray(polygon) && polygon.length > 0, `${location}: polygon has no rings`);
  polygon.forEach((ring, index) => validateRing(ring, `${location} ring ${index + 1}`));
  for (let index = 1; index < polygon.length; index += 1) {
    const classification = classifyPointInRing(polygon[index][0], polygon[0]);
    assert(
      classification !== "outside",
      `${location} ring ${index + 1}: hole is outside its exterior ring`,
    );
  }
}

function geometryPolygons(geometry, location) {
  assert(isPlainObject(geometry), `${location}: geometry must be an object`);
  if (geometry.type === "Polygon") return [geometry.coordinates];
  if (geometry.type === "MultiPolygon") return geometry.coordinates;
  throw new Error(`${location}: geometry must be Polygon or MultiPolygon`);
}

function validateGeometry(geometry, location) {
  const polygons = geometryPolygons(geometry, location);
  assert(polygons.length > 0, `${location}: geometry has no polygons`);
  polygons.forEach((polygon, index) =>
    validatePolygon(polygon, `${location} polygon ${index + 1}`),
  );
}

function geometryShape(geometry) {
  return geometryPolygons(geometry, "geometry").map((polygon) =>
    polygon.map((ring) => ring.length),
  );
}

function validateReferenceDocument(document, country, catalogAreaKeys) {
  const location = `${country}.geojson`;
  assert(isPlainObject(document), `${location}: root must be an object`);
  assert(document.type === "FeatureCollection", `${location}: expected FeatureCollection`);
  assert(
    Array.isArray(document.features) && document.features.length > 0,
    `${location}: features must be a non-empty array`,
  );

  const seenKeys = new Set();
  for (const [index, feature] of document.features.entries()) {
    const featureLocation = `${location} feature ${index + 1}`;
    assert(isPlainObject(feature) && feature.type === "Feature", `${featureLocation}: invalid feature`);
    assert(isPlainObject(feature.properties), `${featureLocation}: properties must be an object`);
    const propertyKeys = Object.keys(feature.properties).sort();
    assert(
      propertyKeys.length === 2 &&
        propertyKeys[0] === "area" &&
        propertyKeys[1] === "country",
      `${featureLocation}: properties must contain exactly country and area`,
    );
    const { area, country: featureCountry } = feature.properties;
    assert(featureCountry === country, `${featureLocation}: country must equal '${country}'`);
    assert(
      typeof area === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(area),
      `${featureLocation}: area must be a lowercase slug`,
    );
    const key = `${featureCountry}/${area}`;
    assert(catalogAreaKeys.has(key), `${featureLocation}: unknown catalog key '${key}'`);
    assert(!seenKeys.has(key), `${featureLocation}: duplicate ownership for '${key}'`);
    seenKeys.add(key);
    validateGeometry(feature.geometry, `${featureLocation} geometry`);
  }
}

function projectCoordinate([longitude, latitude]) {
  const longitudeRadians = (longitude * Math.PI) / 180;
  const latitudeRadians = Math.max(
    -Math.PI / 2 + 1e-10,
    Math.min(Math.PI / 2 - 1e-10, (latitude * Math.PI) / 180),
  );
  return [
    EARTH_RADIUS_METERS * longitudeRadians,
    EARTH_RADIUS_METERS * Math.log(Math.tan(Math.PI / 4 + latitudeRadians / 2)),
  ];
}

function squaredSegmentDistance(point, start, end) {
  let x = start[0];
  let y = start[1];
  let deltaX = end[0] - x;
  let deltaY = end[1] - y;

  if (deltaX !== 0 || deltaY !== 0) {
    const offset =
      ((point[0] - x) * deltaX + (point[1] - y) * deltaY) /
      (deltaX * deltaX + deltaY * deltaY);
    if (offset > 1) {
      x = end[0];
      y = end[1];
    } else if (offset > 0) {
      x += deltaX * offset;
      y += deltaY * offset;
    }
  }

  deltaX = point[0] - x;
  deltaY = point[1] - y;
  return deltaX * deltaX + deltaY * deltaY;
}

function normalizeLongitudeDelta(delta) {
  let normalized = delta;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  return normalized;
}

function projectRelativeToPoint(coordinate, origin) {
  return [
    EARTH_RADIUS_METERS *
      ((normalizeLongitudeDelta(coordinate[0] - origin[0]) * Math.PI) / 180) *
      Math.cos((origin[1] * Math.PI) / 180),
    EARTH_RADIUS_METERS * (((coordinate[1] - origin[1]) * Math.PI) / 180),
  ];
}

function distanceToRingMeters(point, ring) {
  let minimumSquared = Infinity;
  const origin = [0, 0];
  for (let index = 1; index < ring.length; index += 1) {
    minimumSquared = Math.min(
      minimumSquared,
      squaredSegmentDistance(
        origin,
        projectRelativeToPoint(ring[index - 1], point),
        projectRelativeToPoint(ring[index], point),
      ),
    );
  }
  return Math.sqrt(minimumSquared);
}

function maximumRingDeviationMeters(sourceRing, generatedRing) {
  let maximum = 0;
  for (const point of sourceRing) {
    maximum = Math.max(maximum, distanceToRingMeters(point, generatedRing));
  }
  return maximum;
}

function roundedCoordinateKey(coordinate) {
  return `${roundNumber(coordinate[0])},${roundNumber(coordinate[1])}`;
}

function isCyclicOrderedSubset(sourceRing, generatedRing) {
  const source = sourceRing.slice(0, -1).map(roundedCoordinateKey);
  const generated = generatedRing.slice(0, -1).map(roundedCoordinateKey);
  if (generated.length > source.length || generated.length === 0) return false;

  for (let start = 0; start < source.length; start += 1) {
    if (source[start] !== generated[0]) continue;
    let generatedIndex = 1;
    for (let offset = 1; offset < source.length && generatedIndex < generated.length; offset += 1) {
      if (source[(start + offset) % source.length] === generated[generatedIndex]) {
        generatedIndex += 1;
      }
    }
    if (generatedIndex === generated.length) return true;
  }
  return false;
}

function validateSimplificationFidelity(original, generated, location) {
  assert(
    original.type === generated.type,
    `${location}: simplification changed geometry type`,
  );
  const originalPolygons = geometryPolygons(original, `${location} source`);
  const generatedPolygons = geometryPolygons(generated, `${location} generated`);
  assert(
    originalPolygons.length === generatedPolygons.length,
    `${location}: simplification changed polygon ownership`,
  );

  let maximumDeviation = 0;
  for (let polygonIndex = 0; polygonIndex < originalPolygons.length; polygonIndex += 1) {
    const originalPolygon = originalPolygons[polygonIndex];
    const generatedPolygon = generatedPolygons[polygonIndex];
    assert(
      originalPolygon.length === generatedPolygon.length,
      `${location} polygon ${polygonIndex + 1}: simplification changed ring ownership`,
    );
    for (let ringIndex = 0; ringIndex < originalPolygon.length; ringIndex += 1) {
      const originalRing = originalPolygon[ringIndex];
      const generatedRing = generatedPolygon[ringIndex];
      assert(
        Math.sign(signedRingArea(originalRing)) === Math.sign(signedRingArea(generatedRing)),
        `${location} polygon ${polygonIndex + 1} ring ${ringIndex + 1}: ` +
          "simplification changed ring orientation",
      );
      assert(
        isCyclicOrderedSubset(originalRing, generatedRing),
        `${location} polygon ${polygonIndex + 1} ring ${ringIndex + 1}: ` +
          "simplification introduced or reordered source vertices",
      );
      maximumDeviation = Math.max(
        maximumDeviation,
        maximumRingDeviationMeters(originalRing, generatedRing),
      );
    }
  }
  assert(
    maximumDeviation <= SIMPLIFICATION_TOLERANCE_METERS,
    `${location}: simplification deviation ${maximumDeviation.toFixed(3)}m exceeds ` +
      `${SIMPLIFICATION_TOLERANCE_METERS}m`,
  );
  return maximumDeviation;
}

function simplifyOpenPath(coordinates, toleranceMeters) {
  if (coordinates.length <= 2) return coordinates;
  const projected = coordinates.map(projectCoordinate);
  const keep = new Uint8Array(coordinates.length);
  keep[0] = 1;
  keep[coordinates.length - 1] = 1;
  const threshold = toleranceMeters * toleranceMeters;
  const stack = [[0, coordinates.length - 1]];

  while (stack.length > 0) {
    const [startIndex, endIndex] = stack.pop();
    let furthestIndex = -1;
    let furthestDistance = threshold;
    for (let index = startIndex + 1; index < endIndex; index += 1) {
      const distance = squaredSegmentDistance(
        projected[index],
        projected[startIndex],
        projected[endIndex],
      );
      if (distance > furthestDistance) {
        furthestDistance = distance;
        furthestIndex = index;
      }
    }
    if (furthestIndex !== -1) {
      keep[furthestIndex] = 1;
      stack.push([startIndex, furthestIndex], [furthestIndex, endIndex]);
    }
  }

  return coordinates.filter((_, index) => keep[index]);
}

function compareCoordinates(left, right) {
  if (left[0] !== right[0]) return left[0] - right[0];
  return left[1] - right[1];
}

function roundNumber(value) {
  const rounded = Number(value.toFixed(COORDINATE_PRECISION));
  return Object.is(rounded, -0) ? 0 : rounded;
}

function roundAndDedupeRing(ring) {
  const rounded = [];
  for (const coordinate of ring) {
    const next = [roundNumber(coordinate[0]), roundNumber(coordinate[1])];
    if (!rounded.length || !coordinatesEqual(next, rounded[rounded.length - 1])) {
      rounded.push(next);
    }
  }
  if (!coordinatesEqual(rounded[0], rounded[rounded.length - 1])) {
    rounded.push([...rounded[0]]);
  }
  return rounded;
}

function simplifyClosedRing(ring, toleranceMeters) {
  const openRing = ring.slice(0, -1);
  if (openRing.length <= 3) return roundAndDedupeRing(ring);

  let anchorIndex = 0;
  for (let index = 1; index < openRing.length; index += 1) {
    if (compareCoordinates(openRing[index], openRing[anchorIndex]) < 0) anchorIndex = index;
  }
  const rotated = openRing.slice(anchorIndex).concat(openRing.slice(0, anchorIndex));
  const projectedAnchor = projectCoordinate(rotated[0]);
  let oppositeIndex = 1;
  let oppositeDistance = -1;
  for (let index = 1; index < rotated.length; index += 1) {
    const projected = projectCoordinate(rotated[index]);
    const distance =
      (projected[0] - projectedAnchor[0]) ** 2 +
      (projected[1] - projectedAnchor[1]) ** 2;
    if (distance > oppositeDistance) {
      oppositeDistance = distance;
      oppositeIndex = index;
    }
  }

  const firstHalf = simplifyOpenPath(rotated.slice(0, oppositeIndex + 1), toleranceMeters);
  const secondHalf = simplifyOpenPath(
    rotated.slice(oppositeIndex).concat([[...rotated[0]]]),
    toleranceMeters,
  );
  const simplifiedOpen = firstHalf.slice(0, -1).concat(secondHalf.slice(0, -1));
  const simplified = roundAndDedupeRing(simplifiedOpen.concat([[...simplifiedOpen[0]]]));
  const roundedOriginal = roundAndDedupeRing(ring);

  if (
    simplified.length < 4 ||
    Math.abs(signedRingArea(simplified)) <= 1e-14 ||
    Math.sign(signedRingArea(simplified)) !== Math.sign(signedRingArea(ring))
  ) {
    return roundedOriginal;
  }
  return simplified;
}

function simplifyGeometry(geometry) {
  const simplifyPolygon = (polygon) =>
    polygon.map((ring) => simplifyClosedRing(ring, SIMPLIFICATION_TOLERANCE_METERS));
  if (geometry.type === "Polygon") {
    return { type: "Polygon", coordinates: simplifyPolygon(geometry.coordinates) };
  }
  return {
    type: "MultiPolygon",
    coordinates: geometry.coordinates.map(simplifyPolygon),
  };
}

function featureForFixture(document, fixture, location) {
  const matches = document.features.filter(
    (feature) => feature.properties.area === fixture.area,
  );
  assert(
    matches.length === 1,
    `${location}: fixture area '${fixture.area}' must have exactly one feature`,
  );
  return matches[0];
}

function fixturePolygon(document, fixture, location) {
  const feature = featureForFixture(document, fixture, location);
  const polygons = geometryPolygons(feature.geometry, location);
  assert(
    fixture.polygonIndex < polygons.length,
    `${location}: polygonIndex ${fixture.polygonIndex} does not exist`,
  );
  return polygons[fixture.polygonIndex];
}

function assertFixtureCoverage(document, fixture, expectedAreas, location) {
  const coverage = coverageAtPoint(document.features, fixture.point);
  assert(
    coverage.boundary.length === 0,
    `${location}: sampled point lies on boundary of ${coverage.boundary.join(", ")}`,
  );
  if (JSON.stringify(coverage.inside) === JSON.stringify(expectedAreas)) return;

  const issue =
    coverage.inside.length === 0 && expectedAreas.length > 0
      ? "sampled gap"
      : coverage.inside.length > expectedAreas.length
        ? "sampled overlap"
        : "sampled ownership mismatch";
  throw new Error(
    `${location}: ${issue}; expected ${expectedAreas.join(", ") || "no area"}, got ` +
      `${coverage.inside.join(", ") || "no area"}`,
  );
}

function validateCoverageFixtures(document, source, stage) {
  for (const fixture of source.validationFixtures.inside) {
    const location = `${stage} inside fixture '${fixture.id}'`;
    const polygon = fixturePolygon(document, fixture, location);
    assert(
      classifyPointInPolygon(fixture.point, polygon) === "inside",
      `${location}: sampled gap in polygon ${fixture.polygonIndex}`,
    );
    assertFixtureCoverage(document, fixture, [fixture.area], location);
  }

  for (const fixture of source.validationFixtures.islands) {
    const location = `${stage} island fixture '${fixture.id}'`;
    const polygon = fixturePolygon(document, fixture, location);
    assert(
      classifyPointInPolygon(fixture.point, polygon) === "inside",
      `${location}: point is not inside the declared island component`,
    );
    assertFixtureCoverage(document, fixture, [fixture.area], location);
  }

  for (const fixture of source.validationFixtures.holes) {
    const location = `${stage} hole fixture '${fixture.id}'`;
    const polygon = fixturePolygon(document, fixture, location);
    assert(
      fixture.ringIndex > 0 && fixture.ringIndex < polygon.length,
      `${location}: ringIndex must identify an interior ring`,
    );
    assert(
      classifyPointInRing(fixture.point, polygon[fixture.ringIndex]) === "inside",
      `${location}: point is not inside the retained hole`,
    );
    assert(
      classifyPointInPolygon(fixture.point, polygon) === "outside",
      `${location}: hole no longer excludes its fixture point`,
    );
    assertFixtureCoverage(
      document,
      fixture,
      fixture.expectedArea === null ? [] : [fixture.expectedArea],
      location,
    );
  }

  for (const fixture of source.validationFixtures.enclaves) {
    const location = `${stage} enclave fixture '${fixture.id}'`;
    const enclosingPolygon = fixturePolygon(document, fixture, location);
    assert(
      fixture.ringIndex > 0 && fixture.ringIndex < enclosingPolygon.length,
      `${location}: ringIndex must identify the enclosing area's interior ring`,
    );
    assert(
      classifyPointInRing(
        fixture.point,
        enclosingPolygon[fixture.ringIndex],
      ) === "inside",
      `${location}: point is not inside the declared enclave ring`,
    );
    assert(
      classifyPointInPolygon(fixture.point, enclosingPolygon) === "outside",
      `${location}: enclosing area does not exclude the enclave point`,
    );
    const enclaveFeature = featureForFixture(
      document,
      { area: fixture.enclaveArea },
      location,
    );
    assert(
      classifyPointInGeometry(fixture.point, enclaveFeature.geometry) === "inside",
      `${location}: point is not inside enclave area '${fixture.enclaveArea}'`,
    );
    assertFixtureCoverage(document, fixture, [fixture.enclaveArea], location);
  }
}

function validateBorderFixtures(reference, generated, source, country) {
  for (const fixture of source.validationFixtures.borders) {
    const location = `${country} border fixture '${fixture.id}'`;
    const originalPolygon = fixturePolygon(reference, fixture, `${location} source`);
    const generatedPolygon = fixturePolygon(generated, fixture, `${location} generated`);
    assert(
      fixture.ringIndex < originalPolygon.length &&
        fixture.ringIndex < generatedPolygon.length,
      `${location}: ringIndex ${fixture.ringIndex} does not exist`,
    );
    assert(
      classifyPointInRing(fixture.point, originalPolygon[fixture.ringIndex]) === "boundary",
      `${location}: point must lie on the reviewed source ring`,
    );
    const generatedDistance = distanceToRingMeters(
      fixture.point,
      generatedPolygon[fixture.ringIndex],
    );
    assert(
      generatedDistance <= SIMPLIFICATION_TOLERANCE_METERS,
      `${location}: generated ring moved ${generatedDistance.toFixed(3)}m from fixture`,
    );
  }
}

function geometryBbox(features) {
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;

  const visit = (value) => {
    if (Array.isArray(value) && value.length === 2 && value.every(Number.isFinite)) {
      west = Math.min(west, value[0]);
      south = Math.min(south, value[1]);
      east = Math.max(east, value[0]);
      north = Math.max(north, value[1]);
      return;
    }
    if (Array.isArray(value)) value.forEach(visit);
  };

  features.forEach((feature) => visit(feature.geometry.coordinates));
  assert(Number.isFinite(west), "cannot compute bounding box for empty geometry");
  return [west, south, east, north].map(roundNumber);
}

function bboxContains(container, contained) {
  return (
    container[0] <= contained[0] &&
    container[1] <= contained[1] &&
    container[2] >= contained[2] &&
    container[3] >= contained[3]
  );
}

function featureKey(feature) {
  return `${feature.properties.country}/${feature.properties.area}`;
}

function buildCountryArtifact(country, reference, source) {
  validateCoverageFixtures(reference, source, `${country}.geojson reviewed`);
  const features = reference.features
    .map((feature) => ({
      type: "Feature",
      properties: {
        country: feature.properties.country,
        area: feature.properties.area,
      },
      geometry: simplifyGeometry(feature.geometry),
    }))
    .sort((left, right) => featureKey(left).localeCompare(featureKey(right), "en"));

  let maximumDeviationMeters = 0;
  for (const [index, feature] of features.entries()) {
    validateGeometry(feature.geometry, `${country}.json generated feature ${index + 1}`);
    const original = reference.features.find(
      (candidate) => featureKey(candidate) === featureKey(feature),
    );
    assert(original, `${country}.json: generated unknown feature '${featureKey(feature)}'`);
    maximumDeviationMeters = Math.max(
      maximumDeviationMeters,
      validateSimplificationFidelity(
        original.geometry,
        feature.geometry,
        `${country}.json feature '${featureKey(feature)}'`,
      ),
    );
  }

  const artifact = {
    version: OUTPUT_VERSION,
    country,
    source: {
      id: source.id,
      version: source.sourceVersion,
      boundaryUncertaintyMeters: source.boundaryUncertaintyMeters,
      attribution: source.attribution,
    },
    simplification: {
      algorithm: "Ramer-Douglas-Peucker",
      toleranceMeters: SIMPLIFICATION_TOLERANCE_METERS,
      coordinatePrecision: COORDINATE_PRECISION,
      fidelityMetric: "maximum-source-vertex-to-generated-ring-local-equirectangular",
      maximumDeviationMeters: Number(maximumDeviationMeters.toFixed(3)),
    },
    type: "FeatureCollection",
    features,
  };
  validateCoverageFixtures(artifact, source, `${country}.json generated`);
  validateBorderFixtures(reference, artifact, source, country);
  return artifact;
}

export function buildCatalogAreaBoundaries({ rootDir = process.cwd(), write = true } = {}) {
  const referenceRoot = path.resolve(rootDir, REFERENCE_RELATIVE_ROOT);
  const generatedRoot = path.resolve(rootDir, GENERATED_RELATIVE_ROOT);
  const csvRoot = path.resolve(rootDir, "data/csv");
  const sourcesPath = path.join(referenceRoot, SOURCES_FILENAME);

  assert(fs.existsSync(sourcesPath), `${sourcesPath}: missing source ledger`);
  const sourcesByCountry = validateSourcesDocument(readJson(sourcesPath), referenceRoot);
  const catalogAreaKeys = loadCatalogAreaKeys(csvRoot);
  const referenceFiles = fs
    .readdirSync(referenceRoot)
    .filter((filename) => filename.endsWith(".geojson"))
    .sort();
  assert(referenceFiles.length > 0, `${referenceRoot}: no country GeoJSON files found`);

  const files = new Map();
  const summaries = [];
  const countries = [];

  for (const filename of referenceFiles) {
    const country = path.basename(filename, ".geojson");
    const source = sourcesByCountry.get(country);
    assert(source, `${filename}: missing source metadata for '${country}'`);
    const reference = readJson(path.join(referenceRoot, filename));
    validateReferenceDocument(reference, country, catalogAreaKeys);
    assert(
      source.sourceFeatureIds.length === reference.features.length,
      `${filename}: sourceFeatureIds count must match feature count`,
    );

    const artifact = buildCountryArtifact(country, reference, source);
    const content = stableJson(artifact);
    files.set(`${country}.json`, content);
    const activatedCoverageBbox = geometryBbox(artifact.features);
    const countryIndexBbox = source.countryIndex.bbox;
    assert(
      bboxContains(countryIndexBbox, activatedCoverageBbox),
      `${country}.json: coarse country bbox does not contain activated geometry`,
    );
    assert(
      JSON.stringify(countryIndexBbox) !== JSON.stringify(activatedCoverageBbox),
      `${country}.json: country index must not expose the exact activated-coverage bbox`,
    );
    countries.push({
      country,
      bbox: [...countryIndexBbox],
      href: `/generated/catalog-geography/${country}.json`,
      sha256: sha256(content),
    });

    const sourcePositions = reference.features.reduce(
      (total, feature) =>
        total +
        geometryShape(feature.geometry).reduce(
          (polygonTotal, polygon) =>
            polygonTotal + polygon.reduce((ringTotal, positions) => ringTotal + positions, 0),
          0,
        ),
      0,
    );
    const generatedPositions = artifact.features.reduce(
      (total, feature) =>
        total +
        geometryShape(feature.geometry).reduce(
          (polygonTotal, polygon) =>
            polygonTotal + polygon.reduce((ringTotal, positions) => ringTotal + positions, 0),
          0,
        ),
      0,
    );
    summaries.push({ country, features: artifact.features.length, sourcePositions, generatedPositions });
  }

  for (const country of sourcesByCountry.keys()) {
    assert(
      referenceFiles.includes(`${country}.geojson`),
      `${SOURCES_FILENAME}: source '${country}' has no reference GeoJSON`,
    );
  }

  countries.sort((left, right) => left.country.localeCompare(right.country, "en"));
  files.set("index.json", stableJson({ version: OUTPUT_VERSION, countries }));

  if (write) {
    fs.mkdirSync(generatedRoot, { recursive: true });
    for (const [filename, content] of files) {
      fs.writeFileSync(path.join(generatedRoot, filename), content);
    }
  }

  return { files, summaries, generatedRoot };
}

export function checkCatalogAreaBoundaries({ rootDir = process.cwd() } = {}) {
  const { files, summaries, generatedRoot } = buildCatalogAreaBoundaries({ rootDir, write: false });
  const expectedFilenames = new Set(files.keys());
  const actualFilenames = fs.existsSync(generatedRoot)
    ? fs.readdirSync(generatedRoot).filter((filename) => filename.endsWith(".json"))
    : [];

  const errors = [];
  for (const [filename, expected] of files) {
    const outputPath = path.join(generatedRoot, filename);
    if (!fs.existsSync(outputPath)) {
      errors.push(`${outputPath}: missing generated asset`);
      continue;
    }
    const actual = fs.readFileSync(outputPath, "utf8");
    if (actual !== expected) {
      errors.push(`${outputPath}: stale; run pnpm build:catalog-geography`);
    }
  }
  for (const filename of actualFilenames) {
    if (!expectedFilenames.has(filename)) {
      errors.push(`${path.join(generatedRoot, filename)}: unexpected generated asset`);
    }
  }

  if (errors.length > 0) throw new Error(errors.join("\n"));
  return summaries;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { summaries } = buildCatalogAreaBoundaries();
    for (const summary of summaries) {
      console.log(
        `built catalog geography ${summary.country}: ${summary.features} feature(s), ` +
          `${summary.sourcePositions} -> ${summary.generatedPositions} positions`,
      );
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
