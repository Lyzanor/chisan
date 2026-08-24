import { buildCatalogHref } from "../catalog-navigation";
import {
  buildCatalogScope,
  resolveDestinationLocale,
  type CatalogLocalePreferences,
} from "./catalog-scope";
import type { Locale } from "./locales";

type LocalizedLabels = Partial<Record<Locale, string>>;

type ManualAreaPolicy = {
  slug: string;
  label: string;
  labels: LocalizedLabels;
  defaultLocale: Locale;
  publishedLocales: readonly Locale[];
};

type ManualRegionPolicy = {
  slug: string;
  label: string;
  labels: LocalizedLabels;
  areas: readonly ManualAreaPolicy[];
};

type ManualCountryPolicy = {
  slug: string;
  label: string;
  labels: LocalizedLabels;
  defaultLocale: Locale;
  regions: readonly ManualRegionPolicy[];
};

export type ManualCatalogSelectionCountry = {
  slug: string;
  label: string;
  regions: {
    slug: string;
    label: string;
    areas: {
      slug: string;
      label: string;
      href: string;
    }[];
  }[];
};

/**
 * Builds direct area destinations while the request is still on the neutral
 * home page, where browser and explicit preferences are allowed inputs. This
 * avoids losing an area-only locale on an intermediate country URL.
 */
export function buildManualCatalogSelection(
  countries: readonly ManualCountryPolicy[],
  displayLocale: Locale,
  preferences: CatalogLocalePreferences,
): ManualCatalogSelectionCountry[] {
  return countries.map((country) => ({
    slug: country.slug,
    label: country.labels[displayLocale] ?? country.label,
    regions: country.regions.map((region) => ({
      slug: region.slug,
      label: region.labels[displayLocale] ?? region.label,
      areas: region.areas.map((area) => ({
        slug: area.slug,
        label: area.labels[displayLocale] ?? area.label,
        href: buildCatalogHref({
          scope: buildCatalogScope(
            country,
            resolveDestinationLocale(area, preferences),
          ),
          area: area.slug,
        }),
      })),
    })),
  }));
}
