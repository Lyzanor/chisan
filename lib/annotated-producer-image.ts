import type { ShelfPoint } from "./selection-shelf/policy";

/** A derived presentation contract; events and shelves retain their own authority. */
export type AnnotatedProducerImage = {
  imageSrc: string;
  width: number;
  height: number;
  points: (ShelfPoint & { marker?: string })[];
  updatedOn?: string;
  preview?: boolean;
  alt?: string;
  note?: string;
};

export type ImagePlacement = {
  id: string;
  x: number;
  y: number;
  marker: string;
  points: AnnotatedProducerImage["points"];
};

export function imagePlacements(image: AnnotatedProducerImage, producerKeys: ReadonlySet<string>): ImagePlacement[] {
  const groups = new Map<string, ImagePlacement>();
  for (const point of image.points) {
    if (!producerKeys.has(point.producerKey)) continue;
    // Only the same explicit image position is shared, never a nearby producer.
    const key = `${point.x}:${point.y}:${point.marker ?? ""}`;
    const group = groups.get(key);
    if (group) group.points.push(point);
    else groups.set(key, { id: point.id, x: point.x, y: point.y,
      marker: point.marker ?? String(groups.size + 1), points: [point] });
  }
  return [...groups.values()];
}

export function resolveImageSelection(placements: ImagePlacement[], producerKey: string, pointId: string) {
  const placement = placements.find((group) => group.points.some((point) => point.id === pointId));
  const selectedPlacement = placement && (!producerKey || placement.points.some((point) => point.producerKey === producerKey)) ? placement : undefined;
  const appearances = placements.filter((group) => group.points.some((point) => point.producerKey === producerKey));
  return { placement: selectedPlacement, appearances,
    point: selectedPlacement?.points.find((point) => point.producerKey === producerKey && point.id === pointId)
      ?? selectedPlacement?.points.find((point) => point.producerKey === producerKey) };
}

export function imageSelectionHref(canonicalPath: string, producerKey: string, pointId = "") {
  const params = new URLSearchParams();
  if (producerKey) params.set("highlight", producerKey);
  if (pointId) params.set("point", pointId);
  return `${canonicalPath}${params.size ? `?${params}` : ""}`;
}

/** Merge overlapping touch targets on the image, not producers on the origin map. */
export function imageTouchTargets(placements: ImagePlacement[], width: number, height: number, targetSize = 44) {
  const clusters: ImagePlacement[][] = [];
  for (const placement of placements) {
    const touching = clusters.filter((cluster) => cluster.some((other) =>
      Math.abs(other.x - placement.x) * width < targetSize && Math.abs(other.y - placement.y) * height < targetSize));
    const merged = [placement, ...touching.flat()];
    for (const cluster of touching) clusters.splice(clusters.indexOf(cluster), 1);
    clusters.push(merged);
  }
  return clusters.map((groups) => ({ groups, id: groups.map((group) => group.id).sort().join("/"),
    x: groups.reduce((sum, group) => sum + group.x, 0) / groups.length,
    y: groups.reduce((sum, group) => sum + group.y, 0) / groups.length }));
}
