import {
  buildCatalogHref,
  readCatalogQueryContext,
  type CatalogNavigationScope,
} from "./catalog-navigation";
import { isCatalogScopeSegment } from "./i18n/catalog-scope";
import { hasLocale, type Locale } from "./i18n/locales";

const ROUTE_SEGMENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type CatalogRedirectTarget = {
  country: string;
  defaultLocale: Locale;
  catalog: string;
  path?: readonly string[];
  searchParams: URLSearchParams;
};

function scopeFromCatalog(
  country: string,
  defaultLocale: Locale,
  catalog: string,
): CatalogNavigationScope | null {
  if (!/^[a-z]{2}$/.test(country) || !isCatalogScopeSegment(catalog)) return null;
  const canonicalCatalog =
    catalog === `${defaultLocale}-${country}` ? country : catalog;
  const catalogCountry = canonicalCatalog.includes("-")
    ? canonicalCatalog.slice(-2)
    : canonicalCatalog;
  if (catalogCountry !== country) return null;
  return { country, pathPrefix: `/${canonicalCatalog}` };
}

export function buildCatalogRedirectHref({
  country,
  defaultLocale,
  catalog,
  path = [],
  searchParams,
}: CatalogRedirectTarget): string | null {
  if (!hasLocale(defaultLocale)) return null;
  const scope = scopeFromCatalog(country, defaultLocale, catalog);
  if (!scope || path.some((segment) => !ROUTE_SEGMENT_PATTERN.test(segment))) {
    return null;
  }

  const query = readCatalogQueryContext({
    category: searchParams.getAll("category"),
    highlight: searchParams.getAll("highlight"),
  });
  const [area, ...remainder] = path;
  const baseHref = buildCatalogHref({ scope, area, ...query });
  const queryStart = baseHref.indexOf("?");
  const pathname = queryStart === -1 ? baseHref : baseHref.slice(0, queryStart);
  const queryString = queryStart === -1 ? "" : baseHref.slice(queryStart);
  const suffix = remainder.map((segment) => encodeURIComponent(segment)).join("/");

  return `${pathname}${suffix ? `/${suffix}` : ""}${queryString}`;
}
