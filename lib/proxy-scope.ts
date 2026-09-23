import { GUIDES_SEGMENT } from "./guides/routes";
import { EVENTS_SEGMENT } from "./events/routes";
import { isCatalogScopeSegment } from "./i18n/catalog-scope";
import { PRODUCER_STATS_COLLECTION_PAUSED, PRODUCER_STATS_ENDPOINT } from "./producer-stats/policy";

const CLERK_PATH_PREFIXES = [
  "/acceso",
  "/registro",
  "/cuenta",
  "/admin",
  "/api",
  "/trpc",
] as const;

const INTERNAL_CATALOG_REDIRECT = "/api/catalog-redirect";
const PUBLIC_CATALOG_API = "/api/catalog/v1";

export function catalogPathSegments(pathname: string): string[] | null {
  const segments = pathname.split("/").filter(Boolean);
  if (!isCatalogScopeSegment(segments[0] ?? "")) return null;
  // The editorial library shares the catalog scope without being an area. Its
  // own route decides which scope publishes it.
  if (segments[1] === GUIDES_SEGMENT || segments[1] === EVENTS_SEGMENT) return null;
  return segments;
}

export function needsClerkRequestContext(pathname: string): boolean {
  if (PRODUCER_STATS_COLLECTION_PAUSED && pathname === PRODUCER_STATS_ENDPOINT) {
    return false;
  }
  if (
    pathname === INTERNAL_CATALOG_REDIRECT ||
    pathname.startsWith(`${INTERNAL_CATALOG_REDIRECT}/`) ||
    pathname.startsWith("/api/producer-redirect/") ||
    pathname === "/api/producer-favorites" ||
    pathname === PUBLIC_CATALOG_API ||
    pathname.startsWith(`${PUBLIC_CATALOG_API}/`)
  ) {
    return false;
  }

  if (
    CLERK_PATH_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return true;
  }

  return false;
}
