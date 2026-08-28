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

export function catalogPathSegments(pathname: string): string[] | null {
  const segments = pathname.split("/").filter(Boolean);
  return isCatalogScopeSegment(segments[0] ?? "") ? segments : null;
}

export function needsClerkRequestContext(pathname: string): boolean {
  if (
    pathname === INTERNAL_CATALOG_REDIRECT ||
    pathname.startsWith(`${INTERNAL_CATALOG_REDIRECT}/`)
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
