import type { Metadata } from "next";

import {
  buildCatalogHref,
  buildProducerHref,
} from "./catalog-navigation";
import {
  buildCatalogScope,
  type CatalogCountryPolicy,
  type CatalogLocalePolicy,
} from "./i18n/catalog-scope";
import {
  CATALOG_HREFLANG_BY_LOCALE,
  type Locale,
} from "./i18n/locales";
import { SITE_NAME, SITE_ORIGIN } from "./site";

export { CATALOG_HREFLANG_BY_LOCALE } from "./i18n/locales";

const OPEN_GRAPH_LOCALE_BY_LOCALE = {
  en: "en",
  es: "es_ES",
  ca: "ca_ES",
  de: "de_DE",
  ja: "ja_JP",
  fr: "fr_FR",
  it: "it_IT",
  nl: "nl_NL",
  pt: "pt_PT",
} as const satisfies Record<Locale, string>;

type CatalogMetadataTargetBase = {
  country: CatalogCountryPolicy;
  localePolicy: Pick<CatalogLocalePolicy, "publishedLocales">;
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
    throw new Error("Catalog metadata requires at least one effective published locale.");
  }
  if (!publishedLocales.includes(currentLocale)) {
    throw new Error(
      `Locale '${currentLocale}' is not published for this catalog metadata target.`,
    );
  }

  const variants = publishedLocales.map((locale) => ({
    locale,
    hreflang: CATALOG_HREFLANG_BY_LOCALE[locale],
    href: absoluteSiteUrl(buildCatalogTargetPath(target, locale)),
  }));
  const canonical = variants.find(({ locale }) => locale === currentLocale)?.href;

  if (!canonical) {
    throw new Error(`Missing canonical catalog variant for locale '${currentLocale}'.`);
  }

  return {
    canonical,
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
    .map((variant) => OPEN_GRAPH_LOCALE_BY_LOCALE[variant.locale]);

  return {
    title,
    description,
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
      locale: OPEN_GRAPH_LOCALE_BY_LOCALE[locale],
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
