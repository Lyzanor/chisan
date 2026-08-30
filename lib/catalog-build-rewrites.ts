import fs from "node:fs";
import path from "node:path";

import { hasLocale, type Locale } from "./i18n/locales";

export const CATALOG_REDIRECT_HANDLER = "/api/catalog-redirect";

export type CatalogNormalizationRewrite = {
  source: string;
  destination: string;
};

export type CatalogRedirectCountry = {
  slug: string;
  defaultLocale: Locale;
  aliases: Readonly<Record<string, string>>;
  areas: readonly {
    slug: string;
    publishedLocales: readonly Locale[];
  }[];
};

type ManifestLocalePolicy = {
  publishedLocales?: unknown;
};

type CatalogRedirectManifest = {
  publicationStatus?: unknown;
  aliases?: unknown;
  i18n?: {
    defaultLocale?: unknown;
    publishedLocales?: unknown;
  };
  regions?: unknown;
};

type CountryPublicationStatus = "published" | "standby";

type ManifestRegion = {
  slug?: unknown;
  i18n?: ManifestLocalePolicy;
  areas?: unknown;
};

type ManifestArea = {
  slug?: unknown;
  i18n?: ManifestLocalePolicy;
};

const COUNTRY_PATTERN = /^[a-z]{2}$/;
const ROUTE_SEGMENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readPublicationStatus(
  value: unknown,
  owner: string,
): CountryPublicationStatus {
  if (value === undefined) return "published";
  if (value !== "published" && value !== "standby") {
    throw new Error(
      `${owner}: publicationStatus must be either 'published' or 'standby'`,
    );
  }
  return value;
}

function assertRouteSegment(value: unknown, owner: string): string {
  if (typeof value !== "string" || !ROUTE_SEGMENT_PATTERN.test(value)) {
    throw new Error(`${owner}: expected a lowercase route segment`);
  }
  return value;
}

function readPublishedLocales(
  value: unknown,
  fallback: readonly Locale[],
  owner: string,
): Locale[] {
  if (value === undefined) return [...fallback];
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${owner}: publishedLocales must be a non-empty array`);
  }

  const locales: Locale[] = [];
  for (const locale of value) {
    if (!hasLocale(locale)) {
      throw new Error(`${owner}: unsupported locale '${String(locale)}'`);
    }
    if (locales.includes(locale)) {
      throw new Error(`${owner}: duplicate locale '${locale}'`);
    }
    locales.push(locale);
  }
  return locales;
}

function readManifestEntries<T>(value: unknown, owner: string): T[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new Error(`${owner}: expected an array`);
  }
  return value as T[];
}

function readAliases(value: unknown, owner: string): Record<string, string> {
  if (value === undefined) return {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${owner}: aliases must be an object`);
  }

  return Object.fromEntries(
    Object.entries(value).map(([alias, target]) => [
      assertRouteSegment(alias, `${owner}: alias '${alias}'`),
      assertRouteSegment(target, `${owner}: alias '${alias}' target`),
    ]),
  );
}

export function loadCatalogRedirectCountries(
  csvRoot: string = path.resolve(process.cwd(), "data/csv"),
): CatalogRedirectCountry[] {
  const countries = fs
    .readdirSync(csvRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((countrySlug) => {
      if (!COUNTRY_PATTERN.test(countrySlug)) {
        throw new Error(`${csvRoot}: invalid country directory '${countrySlug}'`);
      }

      const manifestPath = path.join(csvRoot, countrySlug, "country.json");
      const manifest = JSON.parse(
        fs.readFileSync(manifestPath, "utf8"),
      ) as CatalogRedirectManifest;
      const publicationStatus = readPublicationStatus(
        manifest.publicationStatus,
        manifestPath,
      );
      const defaultLocale = manifest.i18n?.defaultLocale;
      if (!hasLocale(defaultLocale)) {
        throw new Error(`${manifestPath}: i18n.defaultLocale is required`);
      }
      const countryLocales = readPublishedLocales(
        manifest.i18n?.publishedLocales,
        [defaultLocale],
        `${manifestPath}: i18n`,
      );
      if (!countryLocales.includes(defaultLocale)) {
        throw new Error(
          `${manifestPath}: publishedLocales must include default locale '${defaultLocale}'`,
        );
      }

      const areas = readManifestEntries<ManifestRegion>(
        manifest.regions,
        `${manifestPath}: regions`,
      ).flatMap((region) => {
        const regionSlug = assertRouteSegment(
          region.slug,
          `${manifestPath}: region`,
        );
        const regionLocales = readPublishedLocales(
          region.i18n?.publishedLocales,
          countryLocales,
          `${manifestPath}: region '${regionSlug}'`,
        );

        return readManifestEntries<ManifestArea>(
          region.areas,
          `${manifestPath}: region '${regionSlug}' areas`,
        ).map((area) => {
          const areaSlug = assertRouteSegment(
            area.slug,
            `${manifestPath}: region '${regionSlug}' area`,
          );
          const publishedLocales = readPublishedLocales(
            area.i18n?.publishedLocales,
            regionLocales,
            `${manifestPath}: area '${areaSlug}'`,
          );
          if (!publishedLocales.includes(defaultLocale)) {
            throw new Error(
              `${manifestPath}: area '${areaSlug}' must retain default locale '${defaultLocale}'`,
            );
          }
          return { slug: areaSlug, publishedLocales };
        });
      });

      const areaSlugs = new Set(areas.map((area) => area.slug));
      const aliases = readAliases(manifest.aliases, manifestPath);
      for (const [alias, target] of Object.entries(aliases)) {
        if (alias === target) {
          throw new Error(`${manifestPath}: area alias '${alias}' redirects to itself`);
        }
        if (areaSlugs.has(alias)) {
          throw new Error(
            `${manifestPath}: area alias '${alias}' collides with a canonical area`,
          );
        }
        if (!areaSlugs.has(target)) {
          throw new Error(
            `${manifestPath}: area alias '${alias}' targets unknown area '${target}'`,
          );
        }
      }

      return {
        slug: countrySlug,
        publicationStatus,
        defaultLocale,
        aliases,
        areas,
      };
    });

  return countries.flatMap((country) => {
    const { publicationStatus, ...publishedCountry } = country;
    return publicationStatus === "published" ? [publishedCountry] : [];
  });
}

function catalogScope(country: CatalogRedirectCountry, locale: Locale): string {
  return locale === country.defaultLocale
    ? country.slug
    : `${locale}-${country.slug}`;
}

function redirectHandlerDestination(
  country: CatalogRedirectCountry,
  catalog: string,
  pathSuffix = ":path*",
): string {
  return `${CATALOG_REDIRECT_HANDLER}/${country.slug}/${country.defaultLocale}/${catalog}/${pathSuffix}`;
}

export function buildCatalogNormalizationRewrites(
  countries: readonly CatalogRedirectCountry[],
): CatalogNormalizationRewrite[] {
  const aliasRewrites: CatalogNormalizationRewrite[] = [];
  const defaultScopeRewrites: CatalogNormalizationRewrite[] = [];
  const seenSources = new Set<string>();

  const addRewrite = (
    target: CatalogNormalizationRewrite[],
    rewrite: CatalogNormalizationRewrite,
  ) => {
    if (seenSources.has(rewrite.source)) {
      throw new Error(`Duplicate catalog normalization source '${rewrite.source}'`);
    }
    seenSources.add(rewrite.source);
    target.push(rewrite);
  };

  for (const country of [...countries].sort((left, right) =>
    left.slug.localeCompare(right.slug),
  )) {
    if (!COUNTRY_PATTERN.test(country.slug)) {
      throw new Error(`Invalid catalog country '${country.slug}'`);
    }

    const areaBySlug = new Map(country.areas.map((area) => [area.slug, area]));
    const aliases = Object.entries(country.aliases).sort(([left], [right]) =>
      left.localeCompare(right),
    );

    for (const [alias, canonicalArea] of aliases) {
      assertRouteSegment(alias, `${country.slug}: area alias`);
      assertRouteSegment(canonicalArea, `${country.slug}: canonical area`);
      const area = areaBySlug.get(canonicalArea);
      if (!area) {
        throw new Error(
          `${country.slug}: area alias '${alias}' targets unknown area '${canonicalArea}'`,
        );
      }

      const scopes = [
        ...area.publishedLocales.map((locale) => catalogScope(country, locale)),
        `${country.defaultLocale}-${country.slug}`,
      ];
      const scopePattern = [...new Set(scopes)]
        .sort((left, right) => right.length - left.length || left.localeCompare(right))
        .join("|");
      addRewrite(aliasRewrites, {
        source: `/:catalog(${scopePattern})/${alias}/:path*`,
        destination: redirectHandlerDestination(
          country,
          ":catalog",
          `${canonicalArea}/:path*`,
        ),
      });
    }

    const redundantScope = `${country.defaultLocale}-${country.slug}`;
    addRewrite(defaultScopeRewrites, {
      source: `/:catalog(${redundantScope})/:path*`,
      destination: redirectHandlerDestination(country, ":catalog"),
    });
  }

  // Specific aliases must run before the country-wide catch-all so a URL that
  // needs both normalizations redirects directly to its final canonical path.
  return [...aliasRewrites, ...defaultScopeRewrites];
}

export function buildCatalogNormalizationRewritesFromManifests(
  csvRoot?: string,
): CatalogNormalizationRewrite[] {
  return buildCatalogNormalizationRewrites(loadCatalogRedirectCountries(csvRoot));
}
