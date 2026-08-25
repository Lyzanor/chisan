export const SUPPORTED_LOCALES = [
  "en",
  "es",
  "ca",
  "de",
  "ja",
  "fr",
  "it",
  "nl",
  "pt",
  "af",
  "as",
  "bn",
  "cy",
  "ga",
  "gd",
  "gu",
  "haw",
  "hi",
  "kn",
  "kok",
  "ml",
  "mr",
  "ne",
  "nso",
  "or",
  "pa",
  "ss",
  "st",
  "ta",
  "te",
  "tn",
  "xh",
  "zu",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

// Canonical descriptions may be authored in languages that Chisan does not
// yet publish as interface or catalog-route locales. Keep this registry
// separate so accepting source prose never activates a route, cookie, manifest
// label requirement or message dictionary.
export const DESCRIPTION_SOURCE_LOCALES = [
  ...SUPPORTED_LOCALES,
  "gl",
  "eu",
] as const;

export type DescriptionSourceLocale = (typeof DESCRIPTION_SOURCE_LOCALES)[number];

// The neutral selector and private application shell remain English. Catalog
// defaults are always declared explicitly in each country manifest.
export const APPLICATION_DEFAULT_LOCALE: Locale = "en";

// Keep the public locale token separate from the BCP-47 tag used by HTML and
// Intl APIs. A locale may use a more specific display tag without changing its
// compact URL token.
export const LOCALE_DISPLAY_TAGS = {
  en: "en",
  es: "es",
  ca: "ca",
  de: "de",
  ja: "ja",
  fr: "fr",
  it: "it",
  nl: "nl",
  pt: "pt-PT",
  af: "af-ZA",
  as: "as-IN",
  bn: "bn-IN",
  cy: "cy-GB",
  ga: "ga",
  gd: "gd-GB",
  gu: "gu-IN",
  haw: "haw-US",
  hi: "hi-IN",
  kn: "kn-IN",
  kok: "kok-IN",
  ml: "ml-IN",
  mr: "mr-IN",
  ne: "ne-IN",
  nso: "nso-ZA",
  or: "or-IN",
  pa: "pa-IN",
  ss: "ss-ZA",
  st: "st-ZA",
  ta: "ta-IN",
  te: "te-IN",
  tn: "tn-ZA",
  xh: "xh-ZA",
  zu: "zu-ZA",
} as const satisfies Record<Locale, string>;

// Public locale tokens stay compact, while hreflang explicitly identifies
// either a generic cross-territory language or a territorial variant. Keep
// this registry shared by HTML metadata, sitemap alternates and navigation.
export const CATALOG_HREFLANG_BY_LOCALE = {
  en: "en",
  es: "es",
  ca: "ca-ES",
  de: "de",
  ja: "ja-JP",
  fr: "fr",
  it: "it-IT",
  nl: "nl",
  pt: "pt-PT",
  af: "af-ZA",
  as: "as-IN",
  bn: "bn-IN",
  cy: "cy-GB",
  ga: "ga",
  gd: "gd-GB",
  gu: "gu-IN",
  haw: "haw-US",
  hi: "hi-IN",
  kn: "kn-IN",
  kok: "kok-IN",
  ml: "ml-IN",
  mr: "mr-IN",
  ne: "ne-IN",
  nso: "nso-ZA",
  or: "or-IN",
  pa: "pa-IN",
  ss: "ss-ZA",
  st: "st-ZA",
  ta: "ta-IN",
  te: "te-IN",
  tn: "tn-ZA",
  xh: "xh-ZA",
  zu: "zu-ZA",
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
