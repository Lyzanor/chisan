import "server-only";

import { getAccountSystemConfiguration } from "../accounts/config";
import { hasActiveProducerPremiumEntitlement } from "../accounts/producer-premium-entitlements";
import type { Locale } from "../i18n/locales";
import { loadProducerContent } from "./content";
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

export const loadPublicExpandedContent = createPublicExpandedContentReader({
  databaseConfigured: () => getAccountSystemConfiguration().databaseConfigured,
  hasEntitlement: hasActiveProducerPremiumEntitlement,
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
