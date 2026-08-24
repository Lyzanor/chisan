import type { Locale } from "./locales";
import { getLocaleDisplayTag, hasLocale } from "./locales";

export type CatalogCountryPolicy = {
  slug: string;
  defaultLocale: Locale;
};

export type CatalogLocalePolicy = {
  defaultLocale: Locale;
  publishedLocales: readonly Locale[];
  preferredLocale?: Locale;
};

export type CatalogLocalePreferences = {
  explicitLocale?: Locale | null;
  browserLocales?: readonly Locale[];
};

export type CatalogScope = {
  country: string;
  locale: Locale;
  pathPrefix: string;
  isDefault: boolean;
  htmlLang: string;
};

const COUNTRY_PATTERN = /^[a-z]{2}$/;
const COMPOSITE_SCOPE_PATTERN = /^([a-z]{2})-([a-z]{2})$/;

export const EXPLICIT_LOCALE_COOKIE = "chisan_locale";

export function buildCatalogScope(
  country: CatalogCountryPolicy,
  locale: Locale = country.defaultLocale,
): CatalogScope {
  if (!COUNTRY_PATTERN.test(country.slug)) {
    throw new Error(`Invalid catalog country '${country.slug}'.`);
  }
  if (!hasLocale(locale)) {
    throw new Error(`Unsupported catalog locale '${String(locale)}'.`);
  }

  const isDefault = locale === country.defaultLocale;

  return {
    country: country.slug,
    locale,
    pathPrefix: isDefault ? `/${country.slug}` : `/${locale}-${country.slug}`,
    isDefault,
    htmlLang: getLocaleDisplayTag(locale),
  };
}

// Parsing is intentionally independent from Next.js routing. Publication is a
// page-level decision, so this only checks that the country exists and that a
// composite uses a globally supported locale. A country, region or area still
// validates its own effective publishedLocales after parsing.
export function parseCatalogScope(
  segment: string,
  countries: readonly CatalogCountryPolicy[],
): CatalogScope | null {
  const countryBySlug = new Map(countries.map((country) => [country.slug, country]));
  const shortCountry = countryBySlug.get(segment);

  if (shortCountry) {
    return buildCatalogScope(shortCountry);
  }

  const composite = COMPOSITE_SCOPE_PATTERN.exec(segment);
  if (!composite) return null;

  const [, localeToken, countrySlug] = composite;
  const country = countryBySlug.get(countrySlug);
  if (!country || !hasLocale(localeToken)) return null;

  return buildCatalogScope(country, localeToken);
}

export function parseExplicitLocale(value: string | null | undefined): Locale | null {
  return hasLocale(value) ? value : null;
}

export function parseAcceptLanguage(value: string | null | undefined): Locale[] {
  if (!value) return [];

  return value
    .split(",")
    .map((entry, index) => {
      const [rawTag, ...parameters] = entry.trim().split(";");
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().toLowerCase().startsWith("q="),
      );
      const quality = qualityParameter
        ? Number(qualityParameter.trim().slice(2))
        : 1;
      const baseLocale = rawTag.trim().toLowerCase().split("-")[0];

      return {
        locale: hasLocale(baseLocale) ? baseLocale : null,
        quality: Number.isFinite(quality) ? quality : 0,
        index,
      };
    })
    .filter(
      (entry): entry is { locale: Locale; quality: number; index: number } =>
        entry.locale !== null && entry.quality > 0,
    )
    .sort((left, right) => right.quality - left.quality || left.index - right.index)
    .reduce<Locale[]>((locales, entry) => {
      if (!locales.includes(entry.locale)) locales.push(entry.locale);
      return locales;
    }, []);
}

export function resolveDestinationLocale(
  policy: CatalogLocalePolicy,
  preferences: CatalogLocalePreferences = {},
): Locale {
  const published = new Set(policy.publishedLocales);

  if (preferences.explicitLocale && published.has(preferences.explicitLocale)) {
    return preferences.explicitLocale;
  }

  const browserMatches = (preferences.browserLocales ?? []).filter((locale) =>
    published.has(locale),
  );
  // Territorial preference only orders locales the browser actually accepts;
  // it never overrides an explicit choice or becomes an unsignalled fallback.
  if (policy.preferredLocale && browserMatches.includes(policy.preferredLocale)) {
    return policy.preferredLocale;
  }
  if (browserMatches[0]) return browserMatches[0];

  if (published.has("en")) return "en";
  if (published.has(policy.defaultLocale)) return policy.defaultLocale;

  return policy.publishedLocales[0] ?? policy.defaultLocale;
}
