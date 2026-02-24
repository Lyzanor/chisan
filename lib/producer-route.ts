export type ProducerRouteKey = { id: number } | { slug: string };

export function parseProducerRouteKey(rawValue: string): ProducerRouteKey | null {
  const normalized = rawValue.trim();
  if (!normalized) {
    return null;
  }

  if (/^\d+$/.test(normalized)) {
    const parsedId = Number.parseInt(normalized, 10);
    if (parsedId > 0) {
      return { id: parsedId };
    }
    return null;
  }

  return { slug: normalized.toLowerCase() };
}
