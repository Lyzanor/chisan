import type { Metadata, MetadataRoute } from "next";

import { SITE_NAME, SITE_ORIGIN, isPublicDiscoveryEnabled } from "../site";
import { SITE_ORGANIZATION_ID } from "../site-structured-data";
import {
  GUIDES_DESCRIPTION,
  GUIDES_PATH,
  GUIDES_TITLE,
  guidePath,
  listPublishedGuides,
} from "./catalog";
import type { Guide } from "./schema";

export function buildGuideMetadata(guide?: Guide): Metadata {
  const title = guide?.title ?? GUIDES_TITLE;
  const description = guide?.description ?? GUIDES_DESCRIPTION;
  const url = new URL(guide ? guidePath(guide.slug) : GUIDES_PATH, SITE_ORIGIN)
    .href;
  return {
    title,
    description,
    alternates: { canonical: url, languages: { es: url } },
    robots: { index: isPublicDiscoveryEnabled(), follow: true },
    openGraph: {
      type: guide ? "article" : "website",
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "es_ES",
      ...(guide
        ? {
            images: [
              {
                url: guide.cover.src,
                alt: guide.cover.alt,
                width: guide.cover.width,
                height: guide.cover.height,
              },
            ],
          }
        : {}),
      ...(guide
        ? { publishedTime: guide.publishedAt, modifiedTime: guide.updatedAt }
        : {}),
    },
    twitter: {
      card: guide ? "summary_large_image" : "summary",
      title,
      description,
      ...(guide ? { images: [guide.cover.src] } : {}),
    },
  };
}

export function listGuideSitemapEntries(): MetadataRoute.Sitemap {
  const guides = listPublishedGuides();
  if (!guides.length) return [];
  return [
    {
      path: GUIDES_PATH,
      updatedAt: guides
        .map((guide) => guide.updatedAt)
        .sort()
        .at(-1),
    },
    ...guides.map((guide) => ({
      path: guidePath(guide.slug),
      updatedAt: guide.updatedAt,
    })),
  ].map(({ path, updatedAt }) => {
    const url = new URL(path, SITE_ORIGIN).href;
    return {
      url,
      lastModified: updatedAt,
      alternates: { languages: { es: url } },
    };
  });
}

export function buildGuideStructuredData(guide: Guide) {
  const url = new URL(guidePath(guide.slug), SITE_ORIGIN).href;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        url,
        headline: guide.title,
        image: new URL(guide.cover.src, SITE_ORIGIN).href,
        description: guide.description,
        inLanguage: guide.locale,
        datePublished: guide.publishedAt,
        dateModified: guide.updatedAt,
        mainEntityOfPage: url,
        author: {
          "@type": "Organization",
          "@id": SITE_ORGANIZATION_ID,
          name: SITE_NAME,
          url: `${SITE_ORIGIN}/how-we-work`,
        },
        publisher: {
          "@type": "Organization",
          "@id": SITE_ORGANIZATION_ID,
          name: SITE_NAME,
          url: SITE_ORIGIN,
        },
        citation: guide.sources.map((source) => source.url),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE_NAME,
            item: SITE_ORIGIN,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guías",
            item: `${SITE_ORIGIN}${GUIDES_PATH}`,
          },
          { "@type": "ListItem", position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };
}
