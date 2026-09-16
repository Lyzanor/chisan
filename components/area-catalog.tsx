import {
  AreaExplorer,
  type AreaExplorerModel,
} from "@/components/area-explorer";
import {
  ProgrammaticAreaAd,
  ProgrammaticAreaAdPlaceholder,
} from "@/components/ads/programmatic-area-ad";
import categoryRegistry from "@/data/reference/categories.json";
import { publicProducerBase } from "@/lib/agents/public-catalog";
import { toExplorerProducer } from "@/lib/catalog/explorer";
import { buildCatalogHref } from "@/lib/catalog-navigation";
import {
  type Country,
  getLocalizedCatalogLabel,
  getLocalizedCatalogUnit,
  findArea,
  searchProducers,
} from "@/lib/csv-catalog";
import {
  getCategoryPresentation,
} from "@/lib/i18n/categories";
import {
  buildCatalogScope,
  resolveDestinationLocale,
  type CatalogScope,
} from "@/lib/i18n/catalog-scope";
import { getLocaleDisplayTag, type Locale } from "@/lib/i18n/locales";
import {
  formatMessage,
  loadMessages,
} from "@/lib/i18n/messages";
import { SITE_NAME } from "@/lib/site";
import {
  getProgrammaticAdsConfig,
  PROGRAMMATIC_AREA_AD_MIN_PRODUCERS,
} from "@/lib/programmatic-ads";

type AreaCatalogProps = {
  country: Country;
  area: string;
  locale: Locale;
  scope: CatalogScope;
};

function capitalizeLabel(value: string, locale: Locale): string {
  return value.charAt(0).toLocaleUpperCase(locale) + value.slice(1);
}

export async function AreaCatalog({ country, area, locale, scope }: AreaCatalogProps) {
  const countrySlug = scope.country;
  const [messages, allRows] = await Promise.all([
    loadMessages(locale),
    searchProducers({ municipality: "", category: "" }, countrySlug, area, locale),
  ]);
  const adsConfig = getProgrammaticAdsConfig();

  const areaOption = country.regions
    .flatMap((region) => region.areas)
    .find((candidate) => candidate.slug === area);
  if (!areaOption) {
    throw new Error(`Catalog area '${country.slug}/${area}' is missing from its manifest`);
  }

  const areaLabel = getLocalizedCatalogLabel(areaOption, locale);
  const countryLabel = getLocalizedCatalogLabel(country, locale);
  const unit = getLocalizedCatalogUnit(country, locale);
  const countryScope = buildCatalogScope(
    country,
    resolveDestinationLocale(country, { explicitLocale: scope.locale }),
  );
  const localizedRegions = country.regions.map((region) => {
    const regionLocale = resolveDestinationLocale(region, {
      explicitLocale: scope.locale,
    });
    return {
      slug: region.slug,
      label: getLocalizedCatalogLabel(region, regionLocale),
      areas: region.areas.map((regionArea) => {
        const destinationLocale = resolveDestinationLocale(regionArea, {
          explicitLocale: scope.locale,
        });
        return {
          slug: regionArea.slug,
          label: getLocalizedCatalogLabel(regionArea, destinationLocale),
          href: buildCatalogHref({
            scope: buildCatalogScope(country, destinationLocale),
            area: regionArea.slug,
          }),
        };
      }),
    };
  });
  const languageOptions = await Promise.all(
    areaOption.publishedLocales.map(async (targetLocale) => ({
      locale: targetLocale,
      label:
        targetLocale === locale
          ? messages.languageName
          : (await loadMessages(targetLocale)).languageName,
      href: buildCatalogHref({
        scope: buildCatalogScope(country, targetLocale),
        area,
      }),
    })),
  );

  // Keep the client boundary deliberately small: no raw CSV field bags cross
  // it, only the values needed by the list, map, and selected-producer card.
  const model: AreaExplorerModel = {
    scope,
    area,
    areaLabel,
    countryLabel,
    countryHref: buildCatalogHref({ scope: countryScope }),
    locale,
    localeDisplayTag: getLocaleDisplayTag(locale),
    siteName: SITE_NAME,
    categories: categoryRegistry.categories.map((category) =>
      getCategoryPresentation(category, locale),
    ),
    producers: allRows.map((producer) => toExplorerProducer(
      publicProducerBase(producer, country, findArea(countrySlug, area)!, locale),
    )),
    languageOptions,
    areaSelectorCountry: { regions: localizedRegions },
    selectorMessages: {
      search: messages.areaSelector.search,
      empty: messages.areaSelector.empty,
      label: capitalizeLabel(
        formatMessage(messages.areaSelector.label, { unit: unit.one }),
        locale,
      ),
      placeholder: formatMessage(messages.areaSelector.placeholder, { unit: unit.one }),
      submit: messages.areaSelector.submit,
    },
    languageSwitcherLabel: messages.languageSwitcher.label,
    catalogMessages: messages.catalog,
    mapMessages: messages.map,
  };

  const adLabel =
    locale === "es"
      ? "Anuncios"
      : locale === "ca"
        ? "Anuncis"
        : "Advertisements";
  const isAdEligible =
    adsConfig !== null && allRows.length >= PROGRAMMATIC_AREA_AD_MIN_PRODUCERS;
  const adSlot = isAdEligible && adsConfig ? (
    <ProgrammaticAreaAd
      accountId={adsConfig.accountId}
      label={adLabel}
      slotId={adsConfig.areaSlotId}
    />
  ) : null;
  const adPlaceholder = isAdEligible ? (
    <ProgrammaticAreaAdPlaceholder label={adLabel} />
  ) : null;

  return (
    <AreaExplorer
      model={model}
      adSlot={adSlot}
      adPlaceholder={adPlaceholder}
    />
  );
}
