/** Prioritize nearby results without changing membership or the remaining order. */
export function prioritizeProducerItems<T extends { slug: string; key?: string }>(
  items: readonly T[],
  priorityKeys: readonly string[],
): T[] {
  const byKey = new Map(items.map((item) => [item.key ?? item.slug, item]));
  const seen = new Set<string>();
  const ordered: T[] = [];
  for (const key of priorityKeys) {
    const item = byKey.get(key);
    if (item && !seen.has(key)) {
      ordered.push(item);
      seen.add(key);
    }
  }
  return [...ordered, ...items.filter((item) => !seen.has(item.key ?? item.slug))];
}

/** A selected result stays reachable without moving the user's current list. */
export function includeSelectedProducer<T extends { slug: string; key?: string }>(
  items: readonly T[],
  selected?: T,
): readonly T[] {
  return !selected || items.some((item) => (item.key ?? item.slug) === (selected.key ?? selected.slug))
    ? items
    : [...items, selected];
}
