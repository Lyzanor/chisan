export const SUPPORTED_LOCALES = ["en", "es", "ca", "de", "ja"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

// Canonical descriptions may be authored in languages that Chisan does not
// yet publish as interface or catalog-route locales. Keep this registry
// separate so accepting source prose never activates a route, cookie, manifest
// label requirement or message dictionary.
export const DESCRIPTION_SOURCE_LOCALES = [
  "en",
  "es",
  "ca",
  "de",
  "ja",
  "fr",
  "it",
  "nl",
  "pt",
  "gl",
  "eu",
] as const;

export type DescriptionSourceLocale = (typeof DESCRIPTION_SOURCE_LOCALES)[number];

// Legacy manifests predate explicit locale policy. English preserves their
// current interface language until a country opts in through country.json.
export const LEGACY_DEFAULT_LOCALE: Locale = "en";

// Keep the public locale token separate from the BCP-47 tag used by HTML and
// Intl APIs. They are deliberately identical today, but the distinction lets a
// future locale use a more specific display tag without changing its URL token.
export const LOCALE_DISPLAY_TAGS = {
  en: "en",
  es: "es",
  ca: "ca",
  de: "de",
  ja: "ja",
} as const satisfies Record<Locale, string>;

// Public locale tokens stay compact, while hreflang identifies territorial
// local variants explicitly. Keep this one registry shared by HTML metadata,
// sitemap alternates and ordinary navigation links.
export const CATALOG_HREFLANG_BY_LOCALE = {
  en: "en",
  es: "es-ES",
  ca: "ca-ES",
  de: "de-DE",
  ja: "ja-JP",
} as const satisfies Record<Locale, string>;

const LOCALE_SET: ReadonlySet<string> = new Set(SUPPORTED_LOCALES);
const DESCRIPTION_SOURCE_LOCALE_SET: ReadonlySet<string> = new Set(
  DESCRIPTION_SOURCE_LOCALES,
);

export function hasLocale(value: unknown): value is Locale {
  return typeof value === "string" && LOCALE_SET.has(value);
}

export function hasDescriptionSourceLocale(
  value: unknown,
): value is DescriptionSourceLocale {
  return typeof value === "string" && DESCRIPTION_SOURCE_LOCALE_SET.has(value);
}

export function getLocaleDisplayTag(locale: Locale): string {
  return LOCALE_DISPLAY_TAGS[locale];
}
