import "server-only";
import { cache } from "react";

import { getAccountSystemConfiguration } from "../accounts/config";
import { activeProducerPremiumKeys, hasActiveProducerPremiumEntitlement } from "../accounts/producer-premium-entitlements";
import type { Locale } from "../i18n/locales";
import { loadProducerContent } from "./content";
import { standaloneProducerGallery } from "./content-schema";
import { emptyProducerContent } from "./content-schema";

/** Shared by HTML and agent reads. Files own facts; account state owns visibility. */
export function createPublicExpandedContentReader(dependencies: {
  databaseConfigured: () => boolean;
  hasEntitlement: typeof hasActiveProducerPremiumEntitlement;
  loadContent: typeof loadProducerContent;
}) {
  return async (country: string, producerId: number, locale: Locale) => {
    if (!dependencies.databaseConfigured()) return null;
    try {
      if (!(await dependencies.hasEntitlement(country, producerId)))
        return null;
    } catch (error) {
      console.error("Expanded producer profile is temporarily unavailable.", {
        errorName: error instanceof Error ? error.name : "UnknownError",
        country,
        producerId,
      });
      return null;
    }
    return dependencies.loadContent(country, producerId, locale).catch(() => {
      console.error("Related producer content is temporarily unavailable.", {
        country,
        producerId,
      });
      return emptyProducerContent(country, producerId);
    });
  };
}

export const hasPublicProducerPremiumAccess = cache(
  async (country: string, producerId: number) => {
    if (!getAccountSystemConfiguration().databaseConfigured) return false;
    try {
      return await hasActiveProducerPremiumEntitlement(country, producerId);
    } catch {
      return false;
    }
  },
);

export const loadPublicExpandedContent = createPublicExpandedContentReader({
  databaseConfigured: () => getAccountSystemConfiguration().databaseConfigured,
  hasEntitlement: hasPublicProducerPremiumAccess,
  loadContent: loadProducerContent,
});

/** Null distinguishes unavailable visibility from a checked, empty public set. */
export async function publicProductVisibility(
  producers: readonly { country: string; producerId: number }[],
): Promise<ReadonlySet<string> | null> {
  if (!getAccountSystemConfiguration().databaseConfigured) return null;
  if (!producers.length) return new Set();
  try {
    return await activeProducerPremiumKeys(producers);
  } catch {
    console.error("Public product visibility is temporarily unavailable.");
    return null;
  }
}

export function publicHighlightedLinks(
  fields: Readonly<Record<string, string>>,
  contentLinks: readonly { url: string }[],
) {
  const existing = new Set(contentLinks.map(({ url }) => new URL(url).href));
  const seen = new Set<string>();
  return (["enlace destacado 1", "enlace destacado 2"] as const).flatMap(
    (key) => {
      const href = fields[key]?.trim();
      if (!href) return [];
      try {
        const normalized = new URL(href).href;
        if (existing.has(normalized) || seen.has(normalized)) return [];
        seen.add(normalized);
        return [{ key, href }];
      } catch {
        return [];
      }
    },
  );
}

/** The reviewed standalone gallery is public on every profile; account state
 * neither reveals nor hides it. Product images stay with expanded content. */
export function createPublicProducerGalleryReader(dependencies: {
  loadContent: typeof loadProducerContent;
}) {
  return async (country: string, producerId: number, locale: Locale) => {
    try {
      return standaloneProducerGallery(
        await dependencies.loadContent(country, producerId, locale),
      );
    } catch {
      console.error("Producer gallery is temporarily unavailable.", {
        country,
        producerId,
      });
      return [];
    }
  };
}
export const loadPublicProducerGallery = createPublicProducerGalleryReader({
  loadContent: loadProducerContent,
});
