import { getLocaleDisplayTag, type Locale } from "./i18n/locales";
import {
  SITE_INSTAGRAM_URL,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_X_URL,
} from "./site";

type JsonLdNode = Record<string, unknown>;

export type ProducerStructuredDataInput = Readonly<{
  producerName: string;
  canonicalUrl: string;
  countryName: string;
  countryCode: string;
  countryUrl: string;
  areaName: string;
  areaUrl: string;
  city: string;
  locale: Locale;
  description?: string;
  address?: string;
  telephone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  mapUrl?: string;
  imageUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  categories?: readonly string[];
  featuredProducts?: readonly string[];
}>;

function optionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function optionalHttpUrl(value: string | undefined): string | undefined {
  const normalized = optionalText(value);
  if (!normalized) return undefined;

  try {
    const url = new URL(normalized);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function uniqueText(values: readonly (string | undefined)[]): string[] {
  return [...new Set(values.map(optionalText).filter(Boolean) as string[])];
}

function finiteCoordinate(value: number | null | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function buildProducerStructuredData({
  producerName,
  canonicalUrl,
  countryName,
  countryCode,
  countryUrl,
  areaName,
  areaUrl,
  city,
  locale,
  description,
  address,
  telephone,
  email,
  website,
  facebook,
  instagram,
  mapUrl,
  imageUrl,
  latitude,
  longitude,
  categories = [],
  featuredProducts = [],
}: ProducerStructuredDataInput): JsonLdNode {
  const canonical = new URL(canonicalUrl).toString();
  const producerId = `${canonical}#producer`;
  const webpageId = `${canonical}#webpage`;
  const breadcrumbId = `${canonical}#breadcrumb`;
  const normalizedDescription = optionalText(description);
  const normalizedAddress = optionalText(address);
  const normalizedTelephone = optionalText(telephone);
  const normalizedEmail = optionalText(email);
  const normalizedMapUrl = optionalHttpUrl(mapUrl);
  const normalizedImageUrl = optionalHttpUrl(imageUrl);
  const sameAs = uniqueText([
    optionalHttpUrl(website),
    optionalHttpUrl(facebook),
    optionalHttpUrl(instagram),
  ]);
  const topics = uniqueText([...categories, ...featuredProducts]);
  const normalizedLatitude = finiteCoordinate(latitude);
  const normalizedLongitude = finiteCoordinate(longitude);
  const hasReviewedGeo =
    Boolean(normalizedAddress && normalizedMapUrl) &&
    normalizedLatitude !== undefined &&
    normalizedLongitude !== undefined;

  const producer: JsonLdNode = {
    "@type": normalizedAddress ? "LocalBusiness" : "Organization",
    "@id": producerId,
    name: producerName,
    url: canonical,
    mainEntityOfPage: { "@id": webpageId },
    ...(normalizedDescription ? { description: normalizedDescription } : {}),
    ...(normalizedImageUrl ? { image: normalizedImageUrl } : {}),
    ...(normalizedTelephone ? { telephone: normalizedTelephone } : {}),
    ...(normalizedEmail ? { email: normalizedEmail } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(normalizedAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: normalizedAddress,
            addressLocality: city,
            addressRegion: areaName,
            addressCountry: countryCode.toUpperCase(),
          },
          ...(normalizedMapUrl ? { hasMap: normalizedMapUrl } : {}),
          ...(hasReviewedGeo
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: normalizedLatitude,
                  longitude: normalizedLongitude,
                },
              }
            : {}),
        }
      : {
          location: {
            "@type": "Place",
            name: `${city}, ${areaName}`,
            address: {
              "@type": "PostalAddress",
              addressLocality: city,
              addressRegion: areaName,
              addressCountry: countryCode.toUpperCase(),
            },
          },
        }),
  };

  const webpage: JsonLdNode = {
    "@type": "WebPage",
    "@id": webpageId,
    url: canonical,
    name: producerName,
    inLanguage: getLocaleDisplayTag(locale),
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    breadcrumb: { "@id": breadcrumbId },
    mainEntity: { "@id": producerId },
    ...(normalizedDescription ? { description: normalizedDescription } : {}),
    ...(normalizedImageUrl
      ? { primaryImageOfPage: { "@type": "ImageObject", url: normalizedImageUrl } }
      : {}),
    ...(topics.length > 0
      ? { about: topics.map((name) => ({ "@type": "Thing", name })) }
      : {}),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: SITE_NAME,
        sameAs: [SITE_INSTAGRAM_URL, SITE_X_URL],
      },
      webpage,
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: countryName,
            item: new URL(countryUrl).toString(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: areaName,
            item: new URL(areaUrl).toString(),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: producerName,
            item: canonical,
          },
        ],
      },
      producer,
    ],
  };
}

export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
