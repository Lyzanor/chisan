import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCatalogAlternateSet,
  buildHomeAlternateSet,
  buildLocalizedMetadata,
  CATALOG_HREFLANG_BY_LOCALE,
} from "../lib/catalog-metadata";
import {
  getCatalogSitemapShard,
  listCatalogSitemapDescriptors,
  listCatalogSitemapEntries,
  shardCatalogSitemapEntries,
  SITEMAP_GOOGLE_URL_LIMIT,
  SITEMAP_SHARD_URL_LIMIT,
  type CatalogSitemapEntry,
} from "../lib/catalog-sitemap";
import {
  loadCsvRows,
  listCountries,
  listPublishedCountries,
  listProducerRouteParams,
  type AreaOption,
} from "../lib/csv-catalog";

import { listIndexableProducerLocales } from "../lib/catalog/producers";

const SPAIN = { slug: "es", defaultLocale: "es" as const };

test("catalog metadata alternates are reciprocal, explicit and self-canonical", () => {
  const target = {
    kind: "producer" as const,
    country: SPAIN,
    localePolicy: { publishedLocales: ["ca", "es", "en"] as const },
    area: "barcelona",
    producer: { slug: "producer-one" },
  };
  const expectedLanguages = {
    "ca-ES": "https://chisan.app/ca-es/barcelona/producer-one",
    es: "https://chisan.app/es/barcelona/producer-one",
    en: "https://chisan.app/en-es/barcelona/producer-one",
  };

  for (const locale of target.localePolicy.publishedLocales) {
    const alternates = buildCatalogAlternateSet(target, locale);
    assert.equal("x-default" in alternates.languages, false);
    assert.deepEqual(alternates.languages, expectedLanguages);
    assert.equal(
      alternates.canonical,
      expectedLanguages[CATALOG_HREFLANG_BY_LOCALE[locale]],
    );
    assert.equal(new URL(alternates.canonical).search, "");
  }
});

test("incomplete locale routes are excluded instead of being invented", () => {
  const target = {
    kind: "area" as const,
    country: SPAIN,
    localePolicy: { publishedLocales: ["es", "en"] as const },
    area: "barcelona",
  };
  const alternates = buildCatalogAlternateSet(target, "es");

  assert.deepEqual(Object.keys(alternates.languages).sort(), ["en", "es"]);
  assert.equal(alternates.languages["ca-ES"], undefined);
  assert.throws(() => buildCatalogAlternateSet(target, "ca"), /not published/);
});

test("default variants stay short and x-default belongs only to the global selector", () => {
  const countryAlternates = buildCatalogAlternateSet(
    {
      kind: "country",
      country: SPAIN,
      localePolicy: { publishedLocales: ["es", "en"] },
    },
    "es",
  );
  const homeAlternates = buildHomeAlternateSet();

  assert.equal(countryAlternates.canonical, "https://chisan.app/es");
  assert.ok(
    Object.values(countryAlternates.languages).every(
      (href) => !new URL(href).pathname.startsWith("/es-es"),
    ),
  );
  assert.deepEqual(homeAlternates.languages, {
    "x-default": "https://chisan.app/",
  });
});

test("localized metadata shares canonical and alternate state with social cards", () => {
  const alternates = buildCatalogAlternateSet(
    {
      kind: "producer",
      country: SPAIN,
      localePolicy: { publishedLocales: ["es", "en"] },
      area: "barcelona",
      producer: { slug: "producer-one" },
    },
    "es",
  );
  const metadata = buildLocalizedMetadata({
    title: "Productor Uno",
    description: "Descripción localizada.",
    locale: "es",
    alternates,
    image: { url: "/productores/shared.webp", alt: "Productor Uno" },
  });

  assert.deepEqual(metadata.alternates, {
    canonical: alternates.canonical,
    languages: alternates.languages,
  });
  assert.ok(metadata.openGraph && "url" in metadata.openGraph);
  assert.equal(metadata.openGraph.url, alternates.canonical);
  assert.equal(metadata.openGraph.locale, "es_ES");
  assert.deepEqual(metadata.openGraph.alternateLocale, ["en_US"]);
  assert.ok(metadata.twitter && "title" in metadata.twitter);
  assert.equal(metadata.twitter.title, "Productor Uno");
});

function listAreaPolicies(): Map<string, AreaOption> {
  return new Map(
    listPublishedCountries().flatMap((country) =>
      country.regions.flatMap((region) =>
        region.areas.map(
          (area) => [`${country.slug}/${area.slug}`, area] as const,
        ),
      ),
    ),
  );
}

test("sitemap count matches effective locale policies and every alternate is reciprocal", async () => {
  const [entries, producerRoutes] = await Promise.all([
    listCatalogSitemapEntries(),
    listProducerRouteParams(listPublishedCountries()),
  ]);
  const countries = listPublishedCountries();
  assert.deepEqual(
    countries.map(({ slug }) => slug),
    ["es"],
  );
  const areaPolicies = listAreaPolicies();
  const countryCount = countries.reduce(
    (count, country) => count + country.publishedLocales.length,
    0,
  );
  const areaCount = [...areaPolicies.values()].reduce(
    (count, area) => count + area.publishedLocales.length,
    0,
  );
  const indexableByArea = new Map(
    await Promise.all(
      [...areaPolicies].map(async ([key, area]) => {
        const [country, slug] = key.split("/");
        const [rows, locales] = await Promise.all([
          loadCsvRows(country, slug),
          listIndexableProducerLocales(country, slug, area.publishedLocales),
        ]);
        return [
          key,
          new Map(
            rows.map((row) => [row.slug, locales.get(row.producerId) ?? []]),
          ),
        ] as const;
      }),
    ),
  );
  const producerCount = producerRoutes.reduce((count, route) => {
    const area = areaPolicies.get(`${route.country}/${route.area}`);
    assert.ok(area, `Missing area policy for ${route.country}/${route.area}`);
    const locales = indexableByArea
      .get(`${route.country}/${route.area}`)
      ?.get(route.slug);
    assert.ok(locales, `Missing producer readiness for ${route.slug}`);
    return count + locales.length;
  }, 0);
  const expectedCount = 4 + countryCount + areaCount + producerCount;

  assert.equal(entries.length, expectedCount);

  const entryByUrl = new Map(entries.map((entry) => [entry.url, entry]));
  assert.equal(entryByUrl.size, entries.length, "Sitemap URLs must be unique.");

  for (const entry of entries) {
    const url = new URL(entry.url);
    assert.equal(url.search, "");
    assert.equal(url.hash, "");

    const languages = entry.alternates?.languages;
    assert.ok(languages, `Missing alternates for ${entry.url}`);
    assert.ok(
      Object.values(languages).includes(entry.url),
      `Sitemap URL is not self-canonical in its alternate group: ${entry.url}`,
    );

    for (const alternateUrl of Object.values(languages)) {
      if (typeof alternateUrl !== "string") {
        assert.fail(`Alternate for ${entry.url} is not a URL string.`);
      }
      const reciprocal = entryByUrl.get(alternateUrl);
      assert.ok(
        reciprocal,
        `Alternate ${alternateUrl} is absent from the sitemap.`,
      );
      assert.deepEqual(reciprocal.alternates?.languages, languages);
    }
  }

  const root = entryByUrl.get("https://chisan.app/");
  assert.deepEqual(root?.alternates?.languages, {
    "x-default": "https://chisan.app/",
  });
  assert.deepEqual(
    entryByUrl.get("https://chisan.app/how-we-work")?.alternates?.languages,
    { en: "https://chisan.app/how-we-work" },
  );
  assert.equal(entryByUrl.has("https://chisan.app/our-purpose"), false);
  for (const countrySlug of listCountries()
    .map(({ slug }) => slug)
    .filter((slug) => slug !== "es")) {
    assert.ok(
      entries.every(
        ({ url }) =>
          !new URL(url).pathname.match(
            new RegExp(`^/(?:[a-z]{2,3}-)?${countrySlug}(?:/|$)`),
          ),
      ),
      `Standby country '${countrySlug}' leaked into the sitemap.`,
    );
  }
  assert.deepEqual(
    entryByUrl.get("https://chisan.app/contact")?.alternates?.languages,
    { en: "https://chisan.app/contact" },
  );
  assert.deepEqual(
    entryByUrl.get("https://chisan.app/privacy")?.alternates?.languages,
    { en: "https://chisan.app/privacy" },
  );

  for (const country of countries) {
    const redundantPrefix = `/${country.defaultLocale}-${country.slug}`;
    assert.ok(
      entries.every(
        (entry) => !new URL(entry.url).pathname.startsWith(redundantPrefix),
      ),
      `Redundant default composite leaked into sitemap: ${redundantPrefix}`,
    );
  }

  const descriptors = await listCatalogSitemapDescriptors();
  assert.equal(
    descriptors.length,
    Math.ceil(entries.length / SITEMAP_SHARD_URL_LIMIT),
  );
  const actualShards = await Promise.all(
    descriptors.map(({ id }) => getCatalogSitemapShard(String(id))),
  );
  assert.deepEqual(
    actualShards.flat().map(({ url }) => url),
    entries.map(({ url }) => url),
  );
  assert.ok(
    actualShards.every((shard) => shard.length <= SITEMAP_SHARD_URL_LIMIT),
  );
});

test("sitemap sharding keeps a growth margin below the protocol limit", () => {
  assert.ok(SITEMAP_SHARD_URL_LIMIT < SITEMAP_GOOGLE_URL_LIMIT);

  const syntheticEntries: CatalogSitemapEntry[] = Array.from(
    { length: SITEMAP_SHARD_URL_LIMIT + 17 },
    (_, index) => ({ url: `https://chisan.app/test/${index}` }),
  );
  const shards = shardCatalogSitemapEntries(syntheticEntries);

  assert.deepEqual(
    shards.map((shard) => shard.length),
    [SITEMAP_SHARD_URL_LIMIT, 17],
  );
  assert.throws(
    () =>
      shardCatalogSitemapEntries(syntheticEntries, SITEMAP_GOOGLE_URL_LIMIT),
    /below 50000/,
  );
});

test("producer metadata excludes incomplete translations without hiding the source profile", () => {
  const target = {
    kind: "producer" as const,
    country: SPAIN,
    localePolicy: { publishedLocales: ["es", "ca", "en"] as const },
    area: "barcelona",
    producer: { slug: "test-profile" },
    indexableLocales: ["es"] as const,
  };
  const source = buildCatalogAlternateSet(target, "es");
  assert.deepEqual(source.languages, {
    es: "https://chisan.app/es/barcelona/test-profile",
  });
  assert.equal(source.indexable, true);
  const incomplete = buildCatalogAlternateSet(target, "ca");
  assert.equal(incomplete.indexable, false);
  assert.equal(
    incomplete.canonical,
    "https://chisan.app/ca-es/barcelona/test-profile",
  );
  assert.deepEqual(incomplete.languages, source.languages);
});
