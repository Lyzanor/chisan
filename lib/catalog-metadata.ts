import type { Metadata } from "next";

import { buildCatalogHref, buildProducerHref } from "./catalog-navigation";
import {
  buildCatalogScope,
  type CatalogCountryPolicy,
  type CatalogLocalePolicy,
} from "./i18n/catalog-scope";
import { CATALOG_HREFLANG_BY_LOCALE, type Locale } from "./i18n/locales";
import { isPublicDiscoveryEnabled, SITE_NAME, SITE_ORIGIN } from "./site";

export { CATALOG_HREFLANG_BY_LOCALE } from "./i18n/locales";

// Open Graph locale identifiers are not interchangeable with the compact
// route token or the BCP-47 tag used by HTML/Intl. Keep this exhaustive so a
// newly activated locale cannot silently fall back to an invalid generic tag.
const OPEN_GRAPH_LOCALE_BY_LOCALE = {
  en: "en_US",
  es: "es_ES",
  ca: "ca_ES",
  de: "de_DE",
  ja: "ja_JP",
  fr: "fr_FR",
  it: "it_IT",
  nl: "nl_NL",
  pt: "pt_PT",
  af: "af_ZA",
  as: "as_IN",
  bn: "bn_IN",
  cy: "cy_GB",
  ga: "ga_IE",
  gd: "gd_GB",
  gu: "gu_IN",
  haw: "haw_US",
  hi: "hi_IN",
  kn: "kn_IN",
  kok: "kok_IN",
  ml: "ml_IN",
  mr: "mr_IN",
  ne: "ne_IN",
  nso: "nso_ZA",
  or: "or_IN",
  pa: "pa_IN",
  ss: "ss_ZA",
  st: "st_ZA",
  ta: "ta_IN",
  te: "te_IN",
  tn: "tn_ZA",
  xh: "xh_ZA",
  zu: "zu_ZA",
} as const satisfies Record<Locale, string>;

function getOpenGraphLocale(locale: Locale): string {
  return OPEN_GRAPH_LOCALE_BY_LOCALE[locale];
}

type CatalogMetadataTargetBase = {
  country: CatalogCountryPolicy;
  localePolicy: Pick<CatalogLocalePolicy, "publishedLocales">;
  indexableLocales?: readonly Locale[];
};

export type CatalogMetadataTarget =
  | (CatalogMetadataTargetBase & {
      kind: "country";
    })
  | (CatalogMetadataTargetBase & {
      kind: "area";
      area: string;
    })
  | (CatalogMetadataTargetBase & {
      kind: "producer";
      area: string;
      producer: { slug: string };
    });

export type CatalogAlternateVariant = {
  locale: Locale;
  hreflang: string;
  href: string;
};

export type CatalogAlternateSet = {
  indexable?: boolean;
  canonical: string;
  languages: Record<string, string>;
  variants: CatalogAlternateVariant[];
};

export function absoluteSiteUrl(pathname: string): string {
  return new URL(pathname, SITE_ORIGIN).toString();
}

function buildCatalogTargetPath(
  target: CatalogMetadataTarget,
  locale: Locale,
): string {
  const scope = buildCatalogScope(target.country, locale);

  switch (target.kind) {
    case "country":
      return buildCatalogHref({ scope });
    case "area":
      return buildCatalogHref({ scope, area: target.area });
    case "producer":
      return buildProducerHref(target.producer, { scope, area: target.area });
  }
}

export function buildCatalogAlternateSet(
  target: CatalogMetadataTarget,
  currentLocale: Locale,
): CatalogAlternateSet {
  const publishedLocales = [...new Set(target.localePolicy.publishedLocales)];
  if (publishedLocales.length === 0) {
    throw new Error(
      "Catalog metadata requires at least one effective published locale.",
    );
  }
  if (!publishedLocales.includes(currentLocale)) {
    throw new Error(
      `Locale '${currentLocale}' is not published for this catalog metadata target.`,
    );
  }

  const variants = publishedLocales
    .filter(
      (locale) =>
        !target.indexableLocales || target.indexableLocales.includes(locale),
    )
    .map((locale) => ({
      locale,
      hreflang: CATALOG_HREFLANG_BY_LOCALE[locale],
      href: absoluteSiteUrl(buildCatalogTargetPath(target, locale)),
    }));
  const canonical = absoluteSiteUrl(
    buildCatalogTargetPath(target, currentLocale),
  );

  return {
    canonical,
    indexable: variants.some((variant) => variant.locale === currentLocale),
    languages: Object.fromEntries(
      variants.map(({ hreflang, href }) => [hreflang, href]),
    ),
    variants,
  };
}

export function buildHomeAlternateSet(): CatalogAlternateSet {
  const canonical = absoluteSiteUrl("/");

  return {
    canonical,
    languages: { "x-default": canonical },
    variants: [],
  };
}

type LocalizedMetadataImage = {
  url: string;
  alt: string;
};

export function buildLocalizedMetadata({
  title,
  description,
  locale,
  alternates,
  image,
}: {
  title: string;
  description: string;
  locale: Locale;
  alternates: CatalogAlternateSet;
  image?: LocalizedMetadataImage;
}): Metadata {
  const imageUrl = image ? absoluteSiteUrl(image.url) : null;
  const alternateLocales = alternates.variants
    .filter((variant) => variant.locale !== locale)
    .map((variant) => getOpenGraphLocale(variant.locale));

  return {
    title,
    description,
    ...(alternates.indexable === false
      ? { robots: { index: false, follow: isPublicDiscoveryEnabled() } }
      : {}),
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: SITE_NAME,
      type: "website",
      locale: getOpenGraphLocale(locale),
      alternateLocale: alternateLocales,
      ...(imageUrl
        ? {
            images: [{ url: imageUrl, alt: image?.alt }],
          }
        : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
