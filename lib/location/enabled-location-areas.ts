import fs from "node:fs";
import path from "node:path";

import { getLocalizedCatalogLabel, type Country } from "../csv-catalog";
import type { Locale } from "../i18n/locales";
import type { LocationOnboardingArea } from "./location-onboarding";

type GeographyIndex = {
  version: number;
  countries: {
    country: string;
    href: string;
  }[];
};

type GeographyFeature = {
  type: string;
  properties: {
    country: string;
    area: string;
  };
  geometry: {
    type: string;
    coordinates: unknown[];
  };
};

type CountryGeography = {
  version: number;
  country: string;
  type: string;
  features: GeographyFeature[];
};

const COUNTRY_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AREA_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function readJson(filePath: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(
      `${filePath}: cannot read generated catalog geography (${error instanceof Error ? error.message : error})`,
    );
  }
}

function parseIndex(value: unknown, filePath: string): GeographyIndex {
  assert(Boolean(value) && typeof value === "object", `${filePath}: invalid index`);
  const index = value as Partial<GeographyIndex>;
  assert(index.version === 1, `${filePath}: unsupported index version`);
  assert(Array.isArray(index.countries), `${filePath}: countries must be an array`);

  const seen = new Set<string>();
  for (const entry of index.countries) {
    assert(
      Boolean(entry) && typeof entry === "object" && COUNTRY_SLUG.test(entry.country),
      `${filePath}: invalid country entry`,
    );
    assert(!seen.has(entry.country), `${filePath}: duplicate country '${entry.country}'`);
    assert(
      entry.href === `/generated/catalog-geography/${entry.country}.json`,
      `${filePath}: unsafe geography href for '${entry.country}'`,
    );
    seen.add(entry.country);
  }
  return index as GeographyIndex;
}

function parseCountryGeography(
  value: unknown,
  country: string,
  filePath: string,
): CountryGeography {
  assert(Boolean(value) && typeof value === "object", `${filePath}: invalid geography`);
  const geography = value as Partial<CountryGeography>;
  assert(geography.version === 1, `${filePath}: unsupported geography version`);
  assert(geography.country === country, `${filePath}: country does not match index`);
  assert(geography.type === "FeatureCollection", `${filePath}: expected FeatureCollection`);
  assert(Array.isArray(geography.features), `${filePath}: features must be an array`);

  for (const feature of geography.features) {
    assert(
      Boolean(feature) && feature.type === "Feature",
      `${filePath}: invalid geography feature`,
    );
    const keys = Object.keys(feature.properties ?? {}).sort();
    assert(
      keys.length === 2 && keys[0] === "area" && keys[1] === "country",
      `${filePath}: feature properties must contain exactly country and area`,
    );
    assert(feature.properties.country === country, `${filePath}: feature country mismatch`);
    assert(AREA_SLUG.test(feature.properties.area), `${filePath}: invalid feature area`);
    assert(
      (feature.geometry?.type === "Polygon" ||
        feature.geometry?.type === "MultiPolygon") &&
        Array.isArray(feature.geometry.coordinates),
      `${filePath}: feature geometry is not activated polygon data`,
    );
  }
  return geography as CountryGeography;
}

function registryArea(country: Country, areaSlug: string) {
  const matches = country.regions.flatMap((region) =>
    region.areas.filter((area) => area.slug === areaSlug),
  );
  assert(
    matches.length === 1,
    `generated catalog geography references unknown or duplicate key '${country.slug}/${areaSlug}'`,
  );
  return matches[0];
}

/**
 * Pure Node projection used behind the server-only application boundary and by
 * contract tests that exercise generated geography in isolation.
 */
export function listEnabledLocationAreas({
  countries,
  locale,
  rootDir = process.cwd(),
}: {
  countries: readonly Country[];
  locale: Locale;
  rootDir?: string;
}): LocationOnboardingArea[] {
  const generatedRoot = path.resolve(rootDir, "public/generated/catalog-geography");
  const indexPath = path.join(generatedRoot, "index.json");
  const index = parseIndex(readJson(indexPath), indexPath);
  const countryBySlug = new Map(countries.map((country) => [country.slug, country]));
  const seenAreas = new Set<string>();
  const enabled: LocationOnboardingArea[] = [];

  for (const entry of index.countries) {
    const country = countryBySlug.get(entry.country);
    assert(country, `generated catalog geography references unknown country '${entry.country}'`);
    const geographyPath = path.join(generatedRoot, `${entry.country}.json`);
    const geography = parseCountryGeography(
      readJson(geographyPath),
      entry.country,
      geographyPath,
    );

    for (const feature of geography.features) {
      const areaSlug = feature.properties.area;
      const key = `${entry.country}/${areaSlug}`;
      assert(!seenAreas.has(key), `generated catalog geography duplicates area '${key}'`);
      seenAreas.add(key);
      const area = registryArea(country, areaSlug);
      enabled.push({
        country: entry.country,
        area: area.slug,
        label: getLocalizedCatalogLabel(area, locale),
        defaultLocale: area.defaultLocale,
        publishedLocales: [...area.publishedLocales],
        preferredLocale: area.preferredLocale,
      });
    }
  }

  return enabled.sort((left, right) =>
    `${left.country}/${left.area}`.localeCompare(
      `${right.country}/${right.area}`,
      "en",
    ),
  );
}
