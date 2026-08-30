import type { MetadataRoute } from "next";

import {
  buildCatalogAlternateSet,
  buildHomeAlternateSet,
  type CatalogMetadataTarget,
} from "./catalog-metadata";
import {
  listPublishedCountries,
  listProducerRouteParams,
  type AreaLocation,
  type Country,
} from "./csv-catalog";
import { SITE_ORIGIN } from "./site";

export const SITEMAP_SHARD_URL_LIMIT = 40_000;
export const SITEMAP_GOOGLE_URL_LIMIT = 50_000;

export type CatalogSitemapEntry = MetadataRoute.Sitemap[number];

function areaRegistryKey(country: string, area: string): string {
  return `${country}/${area}`;
}

function listCountryAreas(country: Country): AreaLocation[] {
  return country.regions.flatMap((region) =>
    region.areas.map((area) => ({
      ...area,
      countrySlug: country.slug,
      regionSlug: region.slug,
    })),
  );
}

function appendCatalogTarget(
  entries: CatalogSitemapEntry[],
  target: CatalogMetadataTarget,
): void {
  const currentLocale = target.localePolicy.publishedLocales[0];
  if (!currentLocale) {
    throw new Error("A sitemap catalog target has no effective published locale.");
  }

  const alternates = buildCatalogAlternateSet(target, currentLocale);
  for (const variant of alternates.variants) {
    entries.push({
      url: variant.href,
      alternates: { languages: alternates.languages },
    });
  }
}

async function buildCatalogSitemapEntries(): Promise<CatalogSitemapEntry[]> {
  const countries = listPublishedCountries();
  const countryBySlug = new Map(countries.map((country) => [country.slug, country]));
  const areas = countries.flatMap(listCountryAreas);
  const areaByKey = new Map(
    areas.map((area) => [areaRegistryKey(area.countrySlug, area.slug), area]),
  );
  const entries: CatalogSitemapEntry[] = [];
  const homeAlternates = buildHomeAlternateSet();

  entries.push({
    url: homeAlternates.canonical,
    alternates: { languages: homeAlternates.languages },
  });
  const purposeUrl = new URL("/how-we-work", SITE_ORIGIN).toString();
  entries.push({
    url: purposeUrl,
    alternates: { languages: { en: purposeUrl } },
  });
  const contactUrl = new URL("/contact", SITE_ORIGIN).toString();
  entries.push({
    url: contactUrl,
    alternates: { languages: { en: contactUrl } },
  });
  const privacyUrl = new URL("/privacy", SITE_ORIGIN).toString();
  entries.push({
    url: privacyUrl,
    alternates: { languages: { en: privacyUrl } },
  });

  for (const country of countries) {
    appendCatalogTarget(entries, {
      kind: "country",
      country,
      localePolicy: country,
    });

    for (const area of listCountryAreas(country)) {
      appendCatalogTarget(entries, {
        kind: "area",
        country,
        localePolicy: area,
        area: area.slug,
      });
    }
  }

  for (const route of await listProducerRouteParams(countries)) {
    const country = countryBySlug.get(route.country);
    const area = areaByKey.get(areaRegistryKey(route.country, route.area));
    if (!country || !area) {
      throw new Error(
        `Producer sitemap route '${route.country}/${route.area}/${route.slug}' is outside the catalog registry.`,
      );
    }

    appendCatalogTarget(entries, {
      kind: "producer",
      country,
      localePolicy: area,
      area: route.area,
      producer: { slug: route.slug },
    });
  }

  return entries;
}

let catalogSitemapEntriesPromise: Promise<readonly CatalogSitemapEntry[]> | null = null;

export function listCatalogSitemapEntries(): Promise<readonly CatalogSitemapEntry[]> {
  if (catalogSitemapEntriesPromise) return catalogSitemapEntriesPromise;

  const pending = buildCatalogSitemapEntries();
  catalogSitemapEntriesPromise = pending;
  void pending.catch(() => {
    if (catalogSitemapEntriesPromise === pending) {
      catalogSitemapEntriesPromise = null;
    }
  });

  return pending;
}

export function shardCatalogSitemapEntries(
  entries: readonly CatalogSitemapEntry[],
  limit: number = SITEMAP_SHARD_URL_LIMIT,
): CatalogSitemapEntry[][] {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit >= SITEMAP_GOOGLE_URL_LIMIT) {
    throw new Error(
      `Sitemap shard limit must be an integer below ${SITEMAP_GOOGLE_URL_LIMIT}.`,
    );
  }

  const shards: CatalogSitemapEntry[][] = [];
  for (let start = 0; start < entries.length; start += limit) {
    shards.push(entries.slice(start, start + limit));
  }

  return shards;
}

export async function listCatalogSitemapDescriptors(): Promise<{ id: number }[]> {
  const entries = await listCatalogSitemapEntries();
  const shardCount = Math.max(1, Math.ceil(entries.length / SITEMAP_SHARD_URL_LIMIT));

  return Array.from({ length: shardCount }, (_, id) => ({ id }));
}

export async function getCatalogSitemapShard(
  rawId: string,
): Promise<MetadataRoute.Sitemap> {
  if (!/^(?:0|[1-9]\d*)$/.test(rawId)) return [];

  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) return [];

  const entries = await listCatalogSitemapEntries();
  const start = id * SITEMAP_SHARD_URL_LIMIT;
  if (start >= entries.length) return [];

  return entries.slice(start, start + SITEMAP_SHARD_URL_LIMIT);
}

export function buildCatalogSitemapPath(id: number): string {
  if (!Number.isSafeInteger(id) || id < 0) {
    throw new Error(`Invalid sitemap shard id '${String(id)}'.`);
  }

  return `/sitemap/${id}.xml`;
}
