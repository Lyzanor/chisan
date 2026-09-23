import type { MetadataRoute } from "next";

import {
  buildCatalogAlternateSet,
  buildHomeAlternateSet,
  type CatalogMetadataTarget,
} from "./catalog-metadata";
import {
  listPublishedCountries,
  listIndexableProducerLocales,
  loadCsvRows,
  type AreaLocation,
  type Country,
} from "./csv-catalog";
import { SITE_ORIGIN } from "./site";
import { listGuideSitemapEntries } from "./guides/metadata";
import { listEventSitemapEntries } from "./events/metadata";

import { shardSitemapEntries, SITEMAP_SHARD_URL_LIMIT } from "./sitemap-xml";
export { SITEMAP_SHARD_URL_LIMIT, SITEMAP_GOOGLE_URL_LIMIT } from "./sitemap-xml";

export type CatalogSitemapEntry = MetadataRoute.Sitemap[number];

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
    throw new Error(
      "A sitemap catalog target has no effective published locale.",
    );
  }

  const alternates = buildCatalogAlternateSet(target, currentLocale);
  for (const variant of alternates.variants) {
    entries.push({
      url: variant.href,
      alternates: { languages: alternates.languages },
    });
  }
}

export type CatalogSitemapGroup = { key: string; entries: CatalogSitemapEntry[] };

async function buildCatalogSitemapGroups(): Promise<CatalogSitemapGroup[]> {
  const countries = listPublishedCountries();
  const entries: CatalogSitemapEntry[] = [];
  const groups: CatalogSitemapGroup[] = [{ key: "pages", entries }];
  // Editorial owners decide which publications and locales are indexable.
  for (const [kind, editorialEntries] of [
    ["guides", listGuideSitemapEntries()],
    ["events", listEventSitemapEntries()],
  ] as const) {
    const byScope = new Map<string, CatalogSitemapEntry[]>();
    for (const entry of editorialEntries) {
      const scope = new URL(entry.url).pathname.split("/")[1];
      const group = byScope.get(scope) ?? [];
      group.push(entry);
      byScope.set(scope, group);
    }
    for (const [scope, entries] of byScope) {
      groups.push({ key: `${kind}-${scope}`, entries });
    }
  }
  const homeAlternates = buildHomeAlternateSet();

  entries.push({
    url: homeAlternates.canonical,
    alternates: { languages: homeAlternates.languages },
  });
  const aboutUrl = new URL("/about", SITE_ORIGIN).toString();
  entries.push({
    url: aboutUrl,
    alternates: { languages: { es: aboutUrl } },
  });
  const purposeUrl = new URL("/how-we-work", SITE_ORIGIN).toString();
  entries.push({
    url: purposeUrl,
    alternates: { languages: { es: purposeUrl } },
  });
  const contactUrl = new URL("/contact", SITE_ORIGIN).toString();
  entries.push({
    url: contactUrl,
    alternates: { languages: { es: contactUrl } },
  });
  const privacyUrl = new URL("/privacy", SITE_ORIGIN).toString();
  entries.push({
    url: privacyUrl,
    alternates: { languages: { es: privacyUrl } },
  });

  for (const country of countries) {
    const territories: CatalogSitemapEntry[] = [];
    groups.push({ key: `catalog-${country.slug}`, entries: territories });
    appendCatalogTarget(territories, {
      kind: "country",
      country,
      localePolicy: country,
    });

    for (const area of listCountryAreas(country)) {
      appendCatalogTarget(territories, {
        kind: "area",
        country,
        localePolicy: area,
        area: area.slug,
      });
      const [producers, indexableLocales] = await Promise.all([
        loadCsvRows(country.slug, area.slug),
        listIndexableProducerLocales(
          country.slug,
          area.slug,
          area.publishedLocales,
        ),
      ]);
      const profiles: CatalogSitemapEntry[] = [];
      groups.push({ key: `producers-${country.slug}-${area.slug}`, entries: profiles });
      for (const producer of [...producers].sort((a, b) => a.producerId - b.producerId)) {
        appendCatalogTarget(profiles, {
          kind: "producer",
          country,
          localePolicy: area,
          area: area.slug,
          producer,
          indexableLocales: indexableLocales.get(producer.producerId) ?? [],
        });
      }
    }
  }

  return groups.filter((group) => group.entries.length > 0);
}

let catalogSitemapGroupsPromise: Promise<CatalogSitemapGroup[]> | null = null;

export function listCatalogSitemapGroups(): Promise<CatalogSitemapGroup[]> {
  if (catalogSitemapGroupsPromise) return catalogSitemapGroupsPromise;
  const pending = buildCatalogSitemapGroups();
  catalogSitemapGroupsPromise = pending;
  void pending.catch(() => {
    if (catalogSitemapGroupsPromise === pending) catalogSitemapGroupsPromise = null;
  });
  return pending;
}

// Numeric sitemaps remain readable for existing Search Console submissions.
export async function listCatalogSitemapEntries(): Promise<readonly CatalogSitemapEntry[]> {
  return (await listCatalogSitemapGroups()).flatMap(({ entries }) => entries);
}

export function shardCatalogSitemapEntries(
  entries: readonly CatalogSitemapEntry[],
  limit: number = SITEMAP_SHARD_URL_LIMIT,
): CatalogSitemapEntry[][] {
  return shardSitemapEntries(entries, limit);
}

export async function listCatalogSitemapDescriptors(): Promise<
  { id: number }[]
> {
  const entries = await listCatalogSitemapEntries();
  const shardCount = Math.max(
    1,
    shardCatalogSitemapEntries(entries).length,
  );

  return Array.from({ length: shardCount }, (_, id) => ({ id }));
}

export async function getCatalogSitemapShard(
  rawId: string,
): Promise<MetadataRoute.Sitemap> {
  if (!/^(?:0|[1-9]\d*)$/.test(rawId)) return [];

  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) return [];

  const entries = await listCatalogSitemapEntries();
  return shardCatalogSitemapEntries(entries)[id] ?? [];
}

export function buildCatalogSitemapPath(id: number): string {
  if (!Number.isSafeInteger(id) || id < 0) {
    throw new Error(`Invalid sitemap shard id '${String(id)}'.`);
  }

  return `/sitemap/${id}.xml`;
}
