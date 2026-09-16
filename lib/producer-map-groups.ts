import type { ProducerMapMarker } from "./producer-selections";

/** Leaflet zoom from which grouped discovery maps show every exact point. */
export const PRODUCER_GROUP_DETAIL_ZOOM = 8;
/** Mapped sets up to this size keep exact points at every zoom. */
export const PRODUCER_GROUP_MIN_POINTS = 200;

export type ProducerMapGroupMember = Readonly<{
  key: string;
  label: string;
  count: number;
}>;

/** Presentation only: counts summarize exact points without moving them. */
export type ProducerMapGroup = Readonly<{
  members: readonly ProducerMapGroupMember[];
  count: number;
  /** The exact producer point nearest the largest member's median position. */
  latitude: number;
  longitude: number;
  south: number;
  west: number;
  north: number;
  east: number;
}>;

export type ProducerMapGroupBox = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

const GROUP_GAP = 4;
/** Results within about this distance open together as one connected cluster. */
const OPENING_CLUSTER_KILOMETRES = 300;
/** A distant cluster below this share of the results waits outside the opening view. */
const OPENING_MINORITY_SHARE = 0.1;
const KILOMETRES_PER_DEGREE = 111.32;

/**
 * The points a dense country map opens on: its largest connected cluster and
 * any other holding at least a tenth of the results. Farther minorities, such
 * as the Canary Islands for Spain, stay on the map one pan away.
 */
export function selectOpeningProducerPoints<
  T extends Readonly<{ latitude: number; longitude: number }>,
>(points: readonly T[]): T[] {
  const latitudeStep = OPENING_CLUSTER_KILOMETRES / KILOMETRES_PER_DEGREE;
  let widestLatitude = 0;
  for (const point of points) {
    widestLatitude = Math.max(widestLatitude, Math.abs(point.latitude));
  }
  // Cells stay at least the link distance wide at the most poleward result.
  const longitudeStep =
    latitudeStep / Math.cos((Math.min(widestLatitude, 85) * Math.PI) / 180);
  const cells = new Map<string, T[]>();
  for (const point of points) {
    const key = `${Math.floor(point.latitude / latitudeStep)}:${Math.floor(point.longitude / longitudeStep)}`;
    const cell = cells.get(key);
    if (cell) cell.push(point);
    else cells.set(key, [point]);
  }

  const clusters: T[][] = [];
  const visited = new Set<string>();
  for (const start of cells.keys()) {
    if (visited.has(start)) continue;
    visited.add(start);
    const cluster: T[] = [];
    const pending = [start];
    for (let key = pending.pop(); key !== undefined; key = pending.pop()) {
      for (const point of cells.get(key) ?? []) cluster.push(point);
      const [row, column] = key.split(":").map(Number);
      for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
          const neighbour = `${row + rowOffset}:${column + columnOffset}`;
          if (cells.has(neighbour) && !visited.has(neighbour)) {
            visited.add(neighbour);
            pending.push(neighbour);
          }
        }
      }
    }
    clusters.push(cluster);
  }

  const largest = clusters.reduce((size, cluster) => Math.max(size, cluster.length), 0);
  const opening = new Set(
    clusters
      .filter(
        (cluster) =>
          cluster.length === largest ||
          cluster.length >= points.length * OPENING_MINORITY_SHARE,
      )
      .flat(),
  );
  return points.filter((point) => opening.has(point));
}

export function shouldGroupProducerMap({
  zoom,
  pointCount,
  groupCount,
}: {
  zoom: number;
  pointCount: number;
  groupCount: number;
}): boolean {
  return (
    zoom < PRODUCER_GROUP_DETAIL_ZOOM &&
    pointCount > PRODUCER_GROUP_MIN_POINTS &&
    groupCount > 1
  );
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function byCount(a: ProducerMapGroupMember, b: ProducerMapGroupMember): number {
  return b.count - a.count || a.label.localeCompare(b.label) || a.key.localeCompare(b.key);
}

/** One count per group; any ungrouped point keeps the whole map exact. */
export function summarizeProducerMapGroups(
  points: readonly ProducerMapMarker[],
): ProducerMapGroup[] {
  const grouped = new Map<string, { label: string; points: ProducerMapMarker[] }>();
  for (const point of points) {
    if (!point.group) return [];
    const entry = grouped.get(point.group.key);
    if (entry) entry.points.push(point);
    else grouped.set(point.group.key, { label: point.group.label, points: [point] });
  }

  return [...grouped]
    .map(([key, { label, points: members }]): ProducerMapGroup => {
      const latitude = median(members.map((point) => point.latitude));
      const longitude = median(members.map((point) => point.longitude));
      const longitudeScale = Math.cos((latitude * Math.PI) / 180);
      let anchor = members[0];
      let anchorDistance = Infinity;
      let south = Infinity;
      let west = Infinity;
      let north = -Infinity;
      let east = -Infinity;
      for (const point of members) {
        const distance =
          (point.latitude - latitude) ** 2 +
          ((point.longitude - longitude) * longitudeScale) ** 2;
        if (distance < anchorDistance || (distance === anchorDistance && point.key < anchor.key)) {
          anchor = point;
          anchorDistance = distance;
        }
        south = Math.min(south, point.latitude);
        west = Math.min(west, point.longitude);
        north = Math.max(north, point.latitude);
        east = Math.max(east, point.longitude);
      }
      return {
        members: [{ key, label, count: members.length }],
        count: members.length,
        latitude: anchor.latitude,
        longitude: anchor.longitude,
        south,
        west,
        north,
        east,
      };
    })
    .sort((a, b) => byCount(a.members[0], b.members[0]));
}

function combine(a: ProducerMapGroup, b: ProducerMapGroup): ProducerMapGroup {
  return {
    members: [...a.members, ...b.members].sort(byCount),
    count: a.count + b.count,
    latitude: a.latitude,
    longitude: a.longitude,
    south: Math.min(a.south, b.south),
    west: Math.min(a.west, b.west),
    north: Math.max(a.north, b.north),
    east: Math.max(a.east, b.east),
  };
}

function overlaps(a: ProducerMapGroupBox, b: ProducerMapGroupBox): boolean {
  return (
    Math.abs(a.x - b.x) * 2 < a.width + b.width + GROUP_GAP * 2 &&
    Math.abs(a.y - b.y) * 2 < a.height + b.height + GROUP_GAP * 2
  );
}

/**
 * Counts that would touch on screen combine at the larger count's point, so
 * every producer stays counted exactly once without overlapping labels.
 */
export function mergeOverlappingProducerGroups(
  groups: readonly ProducerMapGroup[],
  place: (group: ProducerMapGroup) => ProducerMapGroupBox,
): ProducerMapGroup[] {
  const placed: { group: ProducerMapGroup; box: ProducerMapGroupBox }[] = [];
  for (const group of [...groups].sort((a, b) => b.count - a.count)) {
    const box = place(group);
    const target = placed.find((entry) => overlaps(entry.box, box));
    if (!target) {
      placed.push({ group, box });
      continue;
    }
    target.group = combine(target.group, group);
    target.box = place(target.group);
  }

  // A wider combined count can reach a neighbour; repeat until none touch.
  for (let index = 0; index < placed.length; index += 1) {
    const other = placed.findIndex(
      (entry, candidate) => candidate > index && overlaps(placed[index].box, entry.box),
    );
    if (other === -1) continue;
    placed[index].group = combine(placed[index].group, placed[other].group);
    placed[index].box = place(placed[index].group);
    placed.splice(other, 1);
    index = -1;
  }

  return placed.map(({ group }) => group);
}
