type Point = Readonly<{ x: number; y: number }>;
type Size = Readonly<{ width: number; height: number }>;
type Bounds = Readonly<{ left: number; top: number; right: number; bottom: number }>;

/** Place the card beside its real marker, inside the currently visible map. */
export function positionMapPreview(point: Point, size: Size, bounds: Bounds) {
  const gap = 20;
  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(value, Math.max(min, max)));
  const above = point.y - gap - size.height;
  const side = above >= bounds.top ? "above" : "below";
  const left = clamp(point.x - size.width / 2, bounds.left, bounds.right - size.width);
  const top = clamp(side === "above" ? above : point.y + gap, bounds.top, bounds.bottom - size.height);
  return {
    left,
    top,
    side,
    tip: clamp(point.x - left, 12, size.width - 12),
  };
}
