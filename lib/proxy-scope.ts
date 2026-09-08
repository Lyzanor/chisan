import { GUIDES_SEGMENT } from "./guides/routes";
import { isCatalogScopeSegment } from "./i18n/catalog-scope";

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
  if (segments[1] === GUIDES_SEGMENT) return null;
  return segments;
}

export function needsClerkRequestContext(pathname: string): boolean {
  if (
    pathname === INTERNAL_CATALOG_REDIRECT ||
    pathname.startsWith(`${INTERNAL_CATALOG_REDIRECT}/`) ||
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

  return catalogPathSegments(pathname)?.length === 3;
}
