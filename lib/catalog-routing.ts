import "server-only";

import {
  findArea,
  findPublishedCountry,
  findProducerById,
  findProducerBySlug,
  findProducerRouteAlias,
  listPublishedCountries,
  normalizeAreaSlug,
  type AreaLocation,
  type Country,
  type ProducerCsvRow,
} from "./csv-catalog";
import { parseCatalogScope, type CatalogScope } from "./i18n/catalog-scope";
import { resolveProducerRouteAliasWithAreaFallback } from "./producer-route-aliases";

export type ResolvedCountryCatalog = {
  scope: CatalogScope;
  country: Country;
};

export type ResolvedAreaCatalog = ResolvedCountryCatalog & {
  area: string;
  areaOption: AreaLocation;
};

export type ResolvedProducerCatalog = ResolvedAreaCatalog & {
  producer: ProducerCsvRow;
  isProducerRouteAlias: boolean;
};

export function resolveKnownCatalogScope(catalog: string): ResolvedCountryCatalog | null {
  const scope = parseCatalogScope(catalog, listPublishedCountries());
  if (!scope) return null;

  const country = findPublishedCountry(scope.country);
  if (!country) return null;

  return { scope, country };
}

export function resolveCountryCatalog(catalog: string): ResolvedCountryCatalog | null {
  const resolved = resolveKnownCatalogScope(catalog);
  if (!resolved || !resolved.country.publishedLocales.includes(resolved.scope.locale)) {
    return null;
  }

  return resolved;
}

export function resolveAreaCatalog(
  catalog: string,
  rawArea: string,
): ResolvedAreaCatalog | null {
  const scope = parseCatalogScope(catalog, listPublishedCountries());
  if (!scope) return null;

  const country = findPublishedCountry(scope.country);
  const area = country ? normalizeAreaSlug(country.slug, rawArea) : "";
  const areaOption = country && area ? findArea(country.slug, area) : null;
  if (!country || !area || !areaOption || !areaOption.publishedLocales.includes(scope.locale)) {
    return null;
  }

  return { scope, country, area, areaOption };
}

export async function resolveProducerCatalog(
  catalog: string,
  rawArea: string,
  rawSlug: string,
): Promise<ResolvedProducerCatalog | null> {
  const known = resolveKnownCatalogScope(catalog);
  if (!known) return null;

  const { country, scope } = known;
  const normalizedArea = normalizeAreaSlug(country.slug, rawArea);
  const producerId = resolveProducerRouteAliasWithAreaFallback(
    rawArea,
    rawSlug,
    normalizedArea,
    (area, slug) => findProducerRouteAlias(country.slug, area, slug),
  );

  if (producerId !== null) {
    const producer = await findProducerById(country.slug, producerId);
    const areaOption = producer ? findArea(country.slug, producer.area) : null;
    if (!producer || !areaOption || !areaOption.publishedLocales.includes(scope.locale)) {
      return null;
    }

    return {
      scope,
      country,
      area: producer.area,
      areaOption,
      producer,
      isProducerRouteAlias: true,
    };
  }

  const area = resolveAreaCatalog(catalog, rawArea);
  if (!area) return null;
  const producer = await findProducerBySlug(rawSlug, country.slug, area.area);
  if (!producer) return null;

  return { ...area, producer, isProducerRouteAlias: false };
}

export function isCanonicalCatalogSegment(segment: string, scope: CatalogScope): boolean {
  return `/${segment}` === scope.pathPrefix;
}
