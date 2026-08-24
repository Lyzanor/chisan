const UNSAFE_HISTORICAL_ROUTE_CHARACTER = /[\/?#\p{Cc}]/u;

export function normalizeProducerRouteAliasSegment(rawSegment: string): string | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(rawSegment);
  } catch {
    return null;
  }

  const normalized = decoded.normalize("NFC");
  if (!normalized || UNSAFE_HISTORICAL_ROUTE_CHARACTER.test(normalized)) {
    return null;
  }
  return normalized;
}

export function normalizeProducerRouteAliasKey(
  rawArea: string,
  rawSlug: string,
): string | null {
  const area = normalizeProducerRouteAliasSegment(rawArea);
  const slug = normalizeProducerRouteAliasSegment(rawSlug);
  return area && slug ? `${area}/${slug}` : null;
}

export function normalizeStoredProducerRouteAliasKey(formerRoute: string): string | null {
  const segments = formerRoute.split("/");
  if (segments.length !== 2) return null;
  return normalizeProducerRouteAliasKey(segments[0], segments[1]);
}

export function resolveProducerRouteAliasWithAreaFallback(
  rawArea: string,
  rawSlug: string,
  normalizedArea: string,
  lookup: (area: string, slug: string) => number | null,
): number | null {
  const exactHistoricalRoute = lookup(rawArea, rawSlug);
  if (exactHistoricalRoute !== null) return exactHistoricalRoute;
  if (!normalizedArea || normalizedArea === rawArea) return null;
  return lookup(normalizedArea, rawSlug);
}
