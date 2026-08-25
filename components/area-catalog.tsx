import Link from "next/link";

import { AreaSelector } from "@/components/area-selector";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ProducersMap } from "@/components/map/producers-map";
import {
  buildCatalogHref,
  buildProducerHref,
  readCatalogQueryContext,
  readQueryParam,
} from "@/lib/catalog-navigation";
import {
  type Country,
  getLocalizedCatalogLabel,
  getLocalizedCatalogUnit,
  listCategories,
  searchProducers,
  toProducerMapPoints,
} from "@/lib/csv-catalog";
import {
  getCategoryIcon,
  getCategoryLabel,
  getCategoryPresentation,
} from "@/lib/i18n/categories";
import {
  buildCatalogScope,
  resolveDestinationLocale,
  type CatalogScope,
} from "@/lib/i18n/catalog-scope";
import type { Locale } from "@/lib/i18n/locales";
import {
  formatMessage,
  formatNumber,
  formatPluralMessage,
  loadMessages,
} from "@/lib/i18n/messages";
import { SITE_NAME } from "@/lib/site";

type AreaCatalogProps = {
  country: Country;
  area: string;
  locale: Locale;
  scope: CatalogScope;
  searchParams: Record<string, string | string[] | undefined>;
};

const DESCRIPTION_PREVIEW_MAX_LENGTH = 120;
const VISIBLE_PRODUCER_LIMIT = 400;

function getFieldValue(fields: Record<string, string>, key: string): string {
  const match = Object.entries(fields).find(
    ([field]) => field.toLocaleLowerCase() === key.toLocaleLowerCase(),
  );

  return (match?.[1] ?? "").trim();
}

function getDescriptionPreview(fields: Record<string, string>): string {
  const description = getFieldValue(fields, "descripcion");
  const characters = Array.from(description);

  if (characters.length <= DESCRIPTION_PREVIEW_MAX_LENGTH) {
    return description;
  }

  return `${characters
    .slice(0, DESCRIPTION_PREVIEW_MAX_LENGTH - 1)
    .join("")
    .trimEnd()}…`;
}

function capitalizeLabel(value: string, locale: Locale): string {
  return value.charAt(0).toLocaleUpperCase(locale) + value.slice(1);
}

export async function AreaCatalog({ country, area, locale, scope, searchParams }: AreaCatalogProps) {
  const category = readQueryParam(searchParams, "category");
  const highlightedSlug = readQueryParam(searchParams, "highlight");
  const catalogQuery = readCatalogQueryContext(searchParams);
  const countrySlug = scope.country;

  const [messages, items, categories, allRows] = await Promise.all([
    loadMessages(locale),
    searchProducers({ municipality: "", category }, countrySlug, area, locale),
    listCategories(countrySlug, area),
    searchProducers({ municipality: "", category: "" }, countrySlug, area, locale),
  ]);

  const highlightedItem = highlightedSlug
    ? items.find((item) => item.slug === highlightedSlug) ??
      items.find((item) => String(item.producerId) === highlightedSlug)
    : undefined;
  const highlightedDescription = highlightedItem
    ? getDescriptionPreview(highlightedItem.fields)
    : "";
  const mapPoints = toProducerMapPoints(items).map((point) => ({
    ...point,
    categories: point.categories.map((pointCategory) =>
      getCategoryLabel(pointCategory, locale),
    ),
  }));
  const visibleItems = items.slice(0, VISIBLE_PRODUCER_LIMIT);
  const areaOption = country.regions
    .flatMap((region) => region.areas)
    .find((candidate) => candidate.slug === area);
  if (!areaOption) {
    throw new Error(`Catalog area '${country.slug}/${area}' is missing from its manifest`);
  }
  const areaLabel = getLocalizedCatalogLabel(areaOption, locale);
  const countryLabel = getLocalizedCatalogLabel(country, locale);
  const unit = getLocalizedCatalogUnit(country, locale);
  const categoryPresentations = categories.map((item) =>
    getCategoryPresentation(item, locale),
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
            category,
          }),
        };
      }),
    };
  });
  const selectorMessages = {
    label: capitalizeLabel(
      formatMessage(messages.areaSelector.label, { unit: unit.one }),
      locale,
    ),
    placeholder: formatMessage(messages.areaSelector.placeholder, { unit: unit.one }),
    submit: messages.areaSelector.submit,
  };
  const mapMessages = {
    loading: messages.map.loading,
    emptyCoordinates: messages.map.emptyCoordinates,
    openProfile: messages.map.openProfile,
  };
  const countryScope = buildCatalogScope(
    country,
    resolveDestinationLocale(country, { explicitLocale: scope.locale }),
  );
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
        ...catalogQuery,
      }),
    })),
  );

  return (
    <main className="catalog-page catalog-page--simple">
      <header className="catalog-simple-header">
        <div>
          <p className="catalog-kicker">
            <Link href="/" className="country-back-link">
              {SITE_NAME}
            </Link>{" "}
            ·{" "}
            <Link href={buildCatalogHref({ scope: countryScope })} className="country-back-link">
              {countryLabel}
            </Link>
          </p>
          <h1>{messages.catalog.title}</h1>
          <p>
            {formatMessage(messages.catalog.summary, {
              area: areaLabel,
              producers: formatPluralMessage(
                locale,
                items.length,
                messages.catalog.producersFound,
              ),
              mapped: formatPluralMessage(locale, mapPoints.length, messages.catalog.mapped),
            })}
          </p>
        </div>

        <div className="catalog-header-controls">
          <LanguageSwitcher
            currentLocale={locale}
            label={messages.languageSwitcher.label}
            options={languageOptions}
          />
          <AreaSelector
            country={{ regions: localizedRegions }}
            currentArea={area}
            messages={selectorMessages}
          />
        </div>
      </header>

      <nav className="catalog-simple-categories" aria-label={messages.catalog.categories}>
        <Link
          href={buildCatalogHref({ scope, area })}
          className={`catalog-chip ${!category ? "is-active" : ""}`}
        >
          {messages.catalog.allCategories}
        </Link>
        {categoryPresentations.map((categoryPresentation) => (
          <Link
            key={categoryPresentation.token}
            href={buildCatalogHref({
              scope,
              area,
              category: categoryPresentation.token,
            })}
            className={`catalog-chip ${
              category === categoryPresentation.token ? "is-active" : ""
            }`}
          >
            <span aria-hidden="true">{categoryPresentation.icon}</span>
            {categoryPresentation.label}
          </Link>
        ))}
      </nav>

      <section className="catalog-simple-layout">
        <div className="catalog-simple-map" aria-label={messages.map.producerMap}>
          <ProducersMap
            points={mapPoints}
            scope={scope}
            area={area}
            highlightedSlug={highlightedItem?.slug}
            messages={mapMessages}
          />
        </div>

        <aside className="catalog-viewer" aria-label={messages.map.producers}>
          {highlightedItem ? (
            <article className="catalog-featured-producer">
              <p className="catalog-kicker">{messages.catalog.selected}</p>
              <h2>{highlightedItem.name}</h2>
              {highlightedDescription ? <p>{highlightedDescription}</p> : null}
              <div className="catalog-featured-actions">
                <Link href={buildCatalogHref({ scope, area, category })}>
                  {messages.catalog.seeAll}
                </Link>
                <Link
                  href={buildProducerHref(highlightedItem, { scope, area })}
                >
                  {messages.catalog.openProfile}
                </Link>
              </div>
            </article>
          ) : null}

          <div className="catalog-viewer-head">
            <h2>{messages.catalog.producers}</h2>
            <p>
              {formatMessage(messages.catalog.showing, {
                visible: formatNumber(locale, visibleItems.length),
                total: formatNumber(locale, items.length),
              })}
              {allRows.length !== items.length
                ? ` · ${formatPluralMessage(
                    locale,
                    allRows.length,
                    messages.catalog.totalInArea,
                    { area: areaLabel },
                  )}`
                : ""}
            </p>
          </div>

          {visibleItems.length > 0 ? (
            <ul className="producer-compact-list">
              {visibleItems.map((item) => {
                const description = getDescriptionPreview(item.fields);

                return (
                  <li
                    key={item.producerId}
                    className={highlightedItem?.slug === item.slug ? "is-selected" : ""}
                  >
                    <Link
                      href={buildCatalogHref({
                        scope,
                        area,
                        category,
                        highlight: item.slug,
                      })}
                      scroll={false}
                      className="producer-compact-link"
                    >
                      <span className="producer-compact-icon" aria-hidden="true">
                        {getCategoryIcon(item.category)}
                      </span>
                      <span>
                        <strong>{item.name}</strong>
                        {description ? <small>{description}</small> : null}
                      </span>
                    </Link>
                    <Link
                      href={buildProducerHref(item, { scope, area })}
                      className="producer-compact-detail"
                    >
                      {messages.catalog.details}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="catalog-empty">
              {formatMessage(messages.catalog.emptyCategory, { area: areaLabel })}
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}
