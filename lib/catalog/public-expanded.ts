import "server-only";
import { cache } from "react";

import { getAccountSystemConfiguration } from "../accounts/config";
import { hasActiveProducerPremiumEntitlement } from "../accounts/producer-premium-entitlements";
import type { Locale } from "../i18n/locales";
import { loadProducerContent } from "./content";
import { standaloneProducerGallery } from "./content-schema";
import { isProducerOwnershipVerified } from "../accounts/producer-ownership";
import { PRODUCER_MEDIA_LIMITS } from "../accounts/producer-media-policy";
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

export function createPublicProducerGalleryReader(dependencies: {
  databaseConfigured: () => boolean;
  hasEntitlement: typeof hasActiveProducerPremiumEntitlement;
  hasOwner: typeof isProducerOwnershipVerified;
  loadContent: typeof loadProducerContent;
}) {
  return async (country: string, producerId: number, locale: Locale) => {
    if (!dependencies.databaseConfigured()) return [];
    try {
      const premium = await dependencies.hasEntitlement(country, producerId);
      if (!premium && !(await dependencies.hasOwner(country, producerId)))
        return [];
      const content = await dependencies.loadContent(
        country,
        producerId,
        locale,
      );
      const gallery = standaloneProducerGallery(content);
      return premium
        ? gallery
        : gallery.slice(0, PRODUCER_MEDIA_LIMITS.freeGalleryImages);
    } catch {
      return [];
    }
  };
}
export const loadPublicProducerGallery = createPublicProducerGalleryReader({
  databaseConfigured: () => getAccountSystemConfiguration().databaseConfigured,
  hasEntitlement: hasPublicProducerPremiumAccess,
  hasOwner: isProducerOwnershipVerified,
  loadContent: loadProducerContent,
});
