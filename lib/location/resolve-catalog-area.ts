export type CatalogAreaKey = {
  country: string;
  area: string;
};

export type CatalogPosition = {
  longitude: number;
  latitude: number;
  accuracyMeters: number;
};

type Position = [longitude: number, latitude: number];
type LinearRing = Position[];
type PolygonCoordinates = LinearRing[];

export type CatalogBoundaryGeometry =
  | { type: "Polygon"; coordinates: PolygonCoordinates }
  | { type: "MultiPolygon"; coordinates: PolygonCoordinates[] };

export type CatalogBoundaryFeature = {
  type: "Feature";
  properties: CatalogAreaKey;
  geometry: CatalogBoundaryGeometry;
};

export type CatalogGeography = {
  version: number;
  country: string;
  source: {
    boundaryUncertaintyMeters: number;
  };
  type: "FeatureCollection";
  features: CatalogBoundaryFeature[];
};

export type CatalogAreaResolution =
  | ({ status: "resolved" } & CatalogAreaKey)
  | {
      status: "ambiguous";
      reason: "boundary" | "overlap";
      candidates: CatalogAreaKey[];
    }
  | { status: "outside" };

type PointClassification = "inside" | "outside" | "boundary";

const EARTH_RADIUS_METERS = 6_371_008.8;
const SEGMENT_EPSILON_METERS = 1e-6;

function assertPosition(position: CatalogPosition): void {
  if (
    !Number.isFinite(position.longitude) ||
    position.longitude < -180 ||
    position.longitude > 180 ||
    !Number.isFinite(position.latitude) ||
    position.latitude < -90 ||
    position.latitude > 90 ||
    !Number.isFinite(position.accuracyMeters) ||
    position.accuracyMeters < 0
  ) {
    throw new RangeError("Position and accuracy must be finite geographic values");
  }
}

function normalizeLongitudeDelta(delta: number): number {
  let normalized = delta;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  return normalized;
}

function projectRelativeTo(
  coordinate: Position,
  origin: CatalogPosition,
): [x: number, y: number] {
  const latitudeRadians = (origin.latitude * Math.PI) / 180;
  const longitudeDelta = normalizeLongitudeDelta(coordinate[0] - origin.longitude);
  return [
    EARTH_RADIUS_METERS *
      ((longitudeDelta * Math.PI) / 180) *
      Math.cos(latitudeRadians),
    EARTH_RADIUS_METERS * (((coordinate[1] - origin.latitude) * Math.PI) / 180),
  ];
}

function pointIsOnSegment(
  start: [number, number],
  end: [number, number],
): boolean {
  const cross = start[0] * end[1] - start[1] * end[0];
  const scale = Math.max(1, Math.hypot(...start), Math.hypot(...end));
  if (Math.abs(cross) > SEGMENT_EPSILON_METERS * scale) return false;
  return start[0] * end[0] + start[1] * end[1] <= SEGMENT_EPSILON_METERS;
}

function classifyPointInRing(
  position: CatalogPosition,
  ring: LinearRing,
): PointClassification {
  let inside = false;
  let previous = projectRelativeTo(ring[ring.length - 2], position);

  for (let index = 0; index < ring.length - 1; index += 1) {
    const current = projectRelativeTo(ring[index], position);
    if (pointIsOnSegment(previous, current)) return "boundary";
    if (
      (previous[1] > 0) !== (current[1] > 0) &&
      0 <
        ((current[0] - previous[0]) * -previous[1]) /
          (current[1] - previous[1]) +
          previous[0]
    ) {
      inside = !inside;
    }
    previous = current;
  }

  return inside ? "inside" : "outside";
}

function classifyPointInPolygon(
  position: CatalogPosition,
  polygon: PolygonCoordinates,
): PointClassification {
  const exterior = classifyPointInRing(position, polygon[0]);
  if (exterior !== "inside") return exterior;

  for (let index = 1; index < polygon.length; index += 1) {
    const hole = classifyPointInRing(position, polygon[index]);
    if (hole === "boundary") return "boundary";
    if (hole === "inside") return "outside";
  }
  return "inside";
}

function geometryPolygons(geometry: CatalogBoundaryGeometry): PolygonCoordinates[] {
  return geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
}

function classifyPointInGeometry(
  position: CatalogPosition,
  geometry: CatalogBoundaryGeometry,
): PointClassification {
  let inside = false;
  for (const polygon of geometryPolygons(geometry)) {
    const classification = classifyPointInPolygon(position, polygon);
    if (classification === "boundary") return "boundary";
    if (classification === "inside") inside = true;
  }
  return inside ? "inside" : "outside";
}

function distanceToSegment(
  start: [number, number],
  end: [number, number],
): number {
  const deltaX = end[0] - start[0];
  const deltaY = end[1] - start[1];
  const squaredLength = deltaX * deltaX + deltaY * deltaY;
  if (squaredLength === 0) return Math.hypot(start[0], start[1]);
  const offset = Math.max(
    0,
    Math.min(1, -(start[0] * deltaX + start[1] * deltaY) / squaredLength),
  );
  return Math.hypot(start[0] + offset * deltaX, start[1] + offset * deltaY);
}

function distanceToGeometryBoundary(
  position: CatalogPosition,
  geometry: CatalogBoundaryGeometry,
): number {
  let minimum = Infinity;
  for (const polygon of geometryPolygons(geometry)) {
    for (const ring of polygon) {
      let previous = projectRelativeTo(ring[0], position);
      for (let index = 1; index < ring.length; index += 1) {
        const current = projectRelativeTo(ring[index], position);
        minimum = Math.min(minimum, distanceToSegment(previous, current));
        previous = current;
      }
    }
  }
  return minimum;
}

function keyId(key: CatalogAreaKey): string {
  return `${key.country}/${key.area}`;
}

function sortedKeys(keys: Map<string, CatalogAreaKey>): CatalogAreaKey[] {
  return [...keys.values()].sort((left, right) =>
    keyId(left).localeCompare(keyId(right), "en"),
  );
}

/**
 * Resolve one transient browser position against already-loaded, validated
 * catalog geography. This function performs no I/O and retains no position.
 */
export function resolveCatalogArea(
  position: CatalogPosition,
  geographyInput: CatalogGeography | readonly CatalogGeography[],
): CatalogAreaResolution {
  assertPosition(position);
  const geographies = Array.isArray(geographyInput) ? geographyInput : [geographyInput];
  const containing = new Map<string, CatalogAreaKey>();
  const confident = new Map<string, CatalogAreaKey>();
  const boundaryCandidates = new Map<string, CatalogAreaKey>();

  for (const geography of geographies) {
    const sourceUncertainty = geography.source.boundaryUncertaintyMeters;
    if (!Number.isFinite(sourceUncertainty) || sourceUncertainty < 0) {
      throw new RangeError("Boundary uncertainty must be a non-negative number");
    }
    const requiredClearance = position.accuracyMeters + sourceUncertainty;

    for (const feature of geography.features) {
      const classification = classifyPointInGeometry(position, feature.geometry);
      const distance = distanceToGeometryBoundary(position, feature.geometry);
      const id = keyId(feature.properties);
      if (classification === "inside") containing.set(id, feature.properties);
      if (distance <= requiredClearance) {
        boundaryCandidates.set(id, feature.properties);
      } else if (classification === "inside") {
        confident.set(id, feature.properties);
      }
    }
  }

  if (containing.size > 1) {
    return {
      status: "ambiguous",
      reason: "overlap",
      candidates: sortedKeys(containing),
    };
  }

  if (boundaryCandidates.size > 0) {
    for (const [id, key] of containing) boundaryCandidates.set(id, key);
    return {
      status: "ambiguous",
      reason: "boundary",
      candidates: sortedKeys(boundaryCandidates),
    };
  }

  if (confident.size === 1) {
    const [resolved] = confident.values();
    return { status: "resolved", ...resolved };
  }

  return { status: "outside" };
}
