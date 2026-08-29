"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, type ReactNode } from "react";

import { AreaSelector } from "@/components/area-selector";
import {
  LanguageSwitcher,
  type LanguageSwitcherOption,
} from "@/components/language-switcher";
import { ProducersMap } from "@/components/map/producers-map";
import {
  buildCatalogHref,
  buildProducerHref,
  type CatalogNavigationScope,
} from "@/lib/catalog-navigation";
import type { ProducerMapPoint } from "@/lib/csv-catalog";
import type { CategoryPresentation } from "@/lib/i18n/categories";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages, PluralMessage } from "@/lib/i18n/messages";

const VISIBLE_PRODUCER_LIMIT = 400;

type AreaExplorerProducer = {
  producerId: number;
  slug: string;
  name: string;
  city: string;
  category: string;
  categories: string[];
  description: string;
  latitude: number | null;
  longitude: number | null;
};

type AreaSelectorCountry = {
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

export type AreaExplorerModel = {
  scope: CatalogNavigationScope;
  area: string;
  areaLabel: string;
  countryLabel: string;
  countryHref: string;
  locale: Locale;
  localeDisplayTag: string;
  siteName: string;
  categories: CategoryPresentation[];
  producers: AreaExplorerProducer[];
  languageOptions: LanguageSwitcherOption[];
  areaSelectorCountry: AreaSelectorCountry;
  selectorMessages: {
    label: string;
    placeholder: string;
    submit: string;
  };
  languageSwitcherLabel: string;
  catalogMessages: Messages["catalog"];
  mapMessages: Messages["map"];
};

function normalizeCategory(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatMessage(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return template.replace(
    /\{([a-zA-Z][a-zA-Z0-9]*)\}/g,
    (placeholder, key: string) =>
      Object.hasOwn(values, key) ? String(values[key]) : placeholder,
  );
}

function formatNumber(locale: string, value: number): string {
  return new Intl.NumberFormat(locale).format(value);
}

function formatPluralMessage(
  locale: string,
  value: number,
  message: PluralMessage,
  values: Readonly<Record<string, string | number>> = {},
): string {
  const pluralCategory = new Intl.PluralRules(locale).select(value);
  const template = pluralCategory === "one" ? message.one : message.other;

  return formatMessage(template, {
    ...values,
    count: formatNumber(locale, value),
  });
}

function withCatalogQuery(href: string, category: string, highlight: string): string {
  const url = new URL(href, "https://catalog.invalid");

  if (category) {
    url.searchParams.set("category", category);
  } else {
    url.searchParams.delete("category");
  }
  if (highlight) {
    url.searchParams.set("highlight", highlight);
  } else {
    url.searchParams.delete("highlight");
  }

  const query = url.searchParams.toString();
  return `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
}

function pushCatalogState(href: string) {
  const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (currentHref !== href) {
    window.history.pushState(null, "", href);
  }
}

function AreaExplorerView({
  adSlot,
  model,
  category,
  highlightedSlug,
}: {
  adSlot: ReactNode;
  model: AreaExplorerModel;
  category: string;
  highlightedSlug: string;
}) {
  const normalizedCategory = normalizeCategory(category);
  const items = useMemo(
    () =>
      normalizedCategory
        ? model.producers.filter((producer) =>
            producer.categories.some(
              (producerCategory) =>
                normalizeCategory(producerCategory) === normalizedCategory,
            ),
          )
        : model.producers,
    [model.producers, normalizedCategory],
  );
  const highlightedItem = useMemo(
    () =>
      highlightedSlug
        ? items.find((item) => item.slug === highlightedSlug) ??
          items.find((item) => String(item.producerId) === highlightedSlug)
        : undefined,
    [highlightedSlug, items],
  );
  const categoryPresentations = useMemo(
    () => new Map(model.categories.map((category) => [category.token, category])),
    [model.categories],
  );
  const mapPoints = useMemo(
    () =>
      items.flatMap((item): ProducerMapPoint[] => {
        if (item.latitude === null || item.longitude === null) {
          return [];
        }

        return [
          {
            slug: item.slug,
            name: item.name,
            city: item.city,
            category: item.category,
            categories: item.categories.map(
              (category) => categoryPresentations.get(category)?.label ?? category,
            ),
            latitude: item.latitude,
            longitude: item.longitude,
          },
        ];
      }),
    [categoryPresentations, items],
  );
  const visibleItems = useMemo(
    () => items.slice(0, VISIBLE_PRODUCER_LIMIT),
    [items],
  );
  const languageOptions = useMemo(
    () =>
      model.languageOptions.map((option) => ({
        ...option,
        href: withCatalogQuery(option.href, category, highlightedSlug),
      })),
    [category, highlightedSlug, model.languageOptions],
  );
  const areaSelectorCountry = useMemo<AreaSelectorCountry>(
    () => ({
      regions: model.areaSelectorCountry.regions.map((region) => ({
        ...region,
        areas: region.areas.map((area) => ({
          ...area,
          // A highlight identifies a producer in the current area and cannot
          // be carried safely to a different area. The category remains useful.
          href: withCatalogQuery(area.href, category, ""),
        })),
      })),
    }),
    [category, model.areaSelectorCountry.regions],
  );
  const allCategoriesHref = buildCatalogHref({
    scope: model.scope,
    area: model.area,
  });
  const clearHighlightHref = buildCatalogHref({
    scope: model.scope,
    area: model.area,
    category,
  });

  return (
    <main className="catalog-page catalog-page--simple">
      <header className="catalog-simple-header">
        <div>
          <p className="catalog-kicker">
            <Link href="/" className="country-back-link">
              {model.siteName}
            </Link>{" "}
            ·{" "}
            <Link href={model.countryHref} className="country-back-link">
              {model.countryLabel}
            </Link>
          </p>
          <h1>{model.catalogMessages.title}</h1>
          <p>
            {formatMessage(model.catalogMessages.summary, {
              area: model.areaLabel,
              producers: formatPluralMessage(
                model.localeDisplayTag,
                items.length,
                model.catalogMessages.producersFound,
              ),
              mapped: formatPluralMessage(
                model.localeDisplayTag,
                mapPoints.length,
                model.catalogMessages.mapped,
              ),
            })}
          </p>
        </div>

        <div className="catalog-header-controls">
          <LanguageSwitcher
            currentLocale={model.locale}
            label={model.languageSwitcherLabel}
            options={languageOptions}
          />
          <AreaSelector
            country={areaSelectorCountry}
            currentArea={model.area}
            messages={model.selectorMessages}
          />
        </div>
      </header>

      <nav
        className="catalog-simple-categories"
        aria-label={model.catalogMessages.categories}
      >
        <Link
          href={allCategoriesHref}
          prefetch={false}
          scroll={false}
          onNavigate={(event) => {
            event.preventDefault();
            pushCatalogState(allCategoriesHref);
          }}
          className={`catalog-chip ${!category ? "is-active" : ""}`}
        >
          {model.catalogMessages.allCategories}
        </Link>
        {model.categories.map((categoryPresentation) => {
          const href = buildCatalogHref({
            scope: model.scope,
            area: model.area,
            category: categoryPresentation.token,
          });

          return (
            <Link
              key={categoryPresentation.token}
              href={href}
              prefetch={false}
              scroll={false}
              onNavigate={(event) => {
                event.preventDefault();
                pushCatalogState(href);
              }}
              className={`catalog-chip ${
                category === categoryPresentation.token ? "is-active" : ""
              }`}
            >
              <span aria-hidden="true">{categoryPresentation.icon}</span>
              {categoryPresentation.label}
            </Link>
          );
        })}
      </nav>

      {adSlot}

      <section className="catalog-simple-layout">
        <div
          className="catalog-simple-map"
          aria-label={model.mapMessages.producerMap}
        >
          <ProducersMap
            points={mapPoints}
            scope={model.scope}
            area={model.area}
            highlightedSlug={highlightedItem?.slug}
            messages={model.mapMessages}
          />
        </div>

        <aside className="catalog-viewer" aria-label={model.mapMessages.producers}>
          <div aria-live="polite" aria-atomic="true">
            {highlightedItem ? (
              <article className="catalog-featured-producer">
                <p className="catalog-kicker">{model.catalogMessages.selected}</p>
                <h2>{highlightedItem.name}</h2>
                {highlightedItem.description ? <p>{highlightedItem.description}</p> : null}
                <div className="catalog-featured-actions">
                  <Link
                    href={clearHighlightHref}
                    prefetch={false}
                    scroll={false}
                    onNavigate={(event) => {
                      event.preventDefault();
                      pushCatalogState(clearHighlightHref);
                    }}
                  >
                    {model.catalogMessages.seeAll}
                  </Link>
                  <Link
                    href={buildProducerHref(highlightedItem, {
                      scope: model.scope,
                      area: model.area,
                    })}
                    prefetch={false}
                  >
                    {model.catalogMessages.openProfile}
                  </Link>
                </div>
              </article>
            ) : null}
          </div>

          <div className="catalog-viewer-head">
            <h2>{model.catalogMessages.producers}</h2>
            <p>
              {formatMessage(model.catalogMessages.showing, {
                visible: formatNumber(model.localeDisplayTag, visibleItems.length),
                total: formatNumber(model.localeDisplayTag, items.length),
              })}
              {model.producers.length !== items.length
                ? ` · ${formatPluralMessage(
                    model.localeDisplayTag,
                    model.producers.length,
                    model.catalogMessages.totalInArea,
                    { area: model.areaLabel },
                  )}`
                : ""}
            </p>
          </div>

          {visibleItems.length > 0 ? (
            <ul className="producer-compact-list">
              {visibleItems.map((item) => {
                const href = buildCatalogHref({
                  scope: model.scope,
                  area: model.area,
                  category,
                  highlight: item.slug,
                });

                return (
                  <li
                    key={item.producerId}
                    className={highlightedItem?.slug === item.slug ? "is-selected" : ""}
                  >
                    <Link
                      href={href}
                      prefetch={false}
                      scroll={false}
                      onNavigate={(event) => {
                        event.preventDefault();
                        pushCatalogState(href);
                      }}
                      className="producer-compact-link"
                    >
                      <span className="producer-compact-icon" aria-hidden="true">
                        {categoryPresentations.get(item.category)?.icon ?? "🧺"}
                      </span>
                      <span>
                        <strong>{item.name}</strong>
                        {item.description ? <small>{item.description}</small> : null}
                      </span>
                    </Link>
                    <Link
                      href={buildProducerHref(item, {
                        scope: model.scope,
                        area: model.area,
                      })}
                      prefetch={false}
                      className="producer-compact-detail"
                    >
                      {model.catalogMessages.details}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="catalog-empty">
              {formatMessage(model.catalogMessages.emptyCategory, {
                area: model.areaLabel,
              })}
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}

function AreaExplorerFromSearchParams({
  adSlot,
  model,
}: {
  adSlot: ReactNode;
  model: AreaExplorerModel;
}) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category")?.trim() ?? "";
  const highlightedSlug = searchParams.get("highlight")?.trim() ?? "";

  return (
    <AreaExplorerView
      adSlot={adSlot}
      model={model}
      category={category}
      highlightedSlug={highlightedSlug}
    />
  );
}

export function AreaExplorer({
  adPlaceholder,
  adSlot,
  model,
}: {
  adPlaceholder: ReactNode;
  adSlot: ReactNode;
  model: AreaExplorerModel;
}) {
  return (
    <Suspense
      fallback={
        <AreaExplorerView
          adSlot={adPlaceholder}
          model={model}
          category=""
          highlightedSlug=""
        />
      }
    >
      <AreaExplorerFromSearchParams adSlot={adSlot} model={model} />
    </Suspense>
  );
}
