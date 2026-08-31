"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { SiteCatalogControlsRegistration } from "@/components/account/site-catalog-controls-context";
import type { AreaSelectorCountry } from "@/components/area-selector";
import {
  LanguageMenuRegistration,
  type LanguageMenuRegistrationOption,
} from "@/components/language-menu-registration";
import {
  ProducersMap,
  type ProducerMapFocusRequest,
} from "@/components/map/producers-map";
import {
  buildCatalogHref,
  buildProducerHref,
  type CatalogNavigationScope,
} from "@/lib/catalog-navigation";
import type { ProducerMapPoint } from "@/lib/csv-catalog";
import type { CategoryPresentation } from "@/lib/i18n/categories";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
import {
  createCatalogPositionRequest,
  type LocationFetch,
} from "@/lib/location/location-onboarding";
import { selectNearbyProducerKeys } from "@/lib/location/nearby-producer-focus";
import { useLocationOnboardingState } from "@/lib/location/saved-location-area";

const VISIBLE_PRODUCER_LIMIT = 400;
const PRODUCER_LIST_ID = "catalog-producer-list";

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
  languageOptions: LanguageMenuRegistrationOption[];
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

function replaceCatalogState(href: string) {
  const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (currentHref !== href) {
    window.history.replaceState(null, "", href);
  }
}

function useNearbyMapFocusKeys(
  country: string,
  area: string,
  points: readonly ProducerMapPoint[],
): {
  keys: string[] | undefined;
  consume: () => void;
} {
  const stored = useLocationOnboardingState();
  const savedCountry =
    stored?.onboarding === "resolved" ? stored.area?.country : undefined;
  const savedArea =
    stored?.onboarding === "resolved" ? stored.area?.area : undefined;
  const [keys, setKeys] = useState<string[]>();
  const pointsRef = useRef(points);
  const requestGenerationRef = useRef(0);
  const consume = useCallback(() => {
    requestGenerationRef.current += 1;
    setKeys(undefined);
  }, []);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    const requestKey =
      savedCountry === country && savedArea === area ? `${country}/${area}` : "";
    if (!requestKey) {
      requestGenerationRef.current += 1;
      return;
    }

    const requestGeneration = requestGenerationRef.current + 1;
    requestGenerationRef.current = requestGeneration;
    let cancelled = false;

    async function focusSavedArea() {
      if (!navigator.permissions?.query || !navigator.geolocation) return;

      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        if (permission.state !== "granted" || cancelled) return;

        const request = createCatalogPositionRequest({
          geolocation: navigator.geolocation,
          fetcher: window.fetch.bind(window) as LocationFetch,
        });
        const result = await request();
        if (
          cancelled ||
          requestGenerationRef.current !== requestGeneration ||
          result.status !== "resolved" ||
          result.country !== country ||
          result.area !== area
        ) {
          return;
        }

        const nearbyKeys = selectNearbyProducerKeys(
          result.position,
          pointsRef.current.map((point) => ({
            key: point.slug,
            latitude: point.latitude,
            longitude: point.longitude,
          })),
        );
        setKeys(nearbyKeys.length ? nearbyKeys : undefined);
      } catch {
        // The normal area-wide map remains usable when permission or geometry fails.
      }
    }

    void focusSavedArea();
    return () => {
      cancelled = true;
    };
  }, [area, country, savedArea, savedCountry]);

  return {
    keys: savedCountry === country && savedArea === area ? keys : undefined,
    consume,
  };
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
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [mapFocusRequest, setMapFocusRequest] =
    useState<ProducerMapFocusRequest>();
  const mapFocusRequestId = useRef(0);
  const previousHighlightedSlug = useRef("");
  const listToggleRef = useRef<HTMLButtonElement>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const selectedProducerLinkRef = useRef<HTMLAnchorElement>(null);
  const focusSelectedProducerAfterCloseRef = useRef(false);
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
    () => new Map(model.categories.map((item) => [item.token, item])),
    [model.categories],
  );
  const mapPoints = useMemo(
    () =>
      items.flatMap((item): ProducerMapPoint[] => {
        if (item.latitude === null || item.longitude === null) return [];

        return [
          {
            slug: item.slug,
            name: item.name,
            city: item.city,
            category: item.category,
            categories: item.categories.map(
              (itemCategory) =>
                categoryPresentations.get(itemCategory)?.label ?? itemCategory,
            ),
            latitude: item.latitude,
            longitude: item.longitude,
          },
        ];
      }),
    [categoryPresentations, items],
  );
  const {
    keys: nearbyMapFocusKeys,
    consume: consumeNearbyMapFocus,
  } = useNearbyMapFocusKeys(model.scope.country, model.area, mapPoints);
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
        areas: region.areas.map((areaOption) => ({
          ...areaOption,
          href: withCatalogQuery(areaOption.href, category, ""),
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
  const screenReaderSummary = formatMessage(model.catalogMessages.showing, {
    visible: formatNumber(model.localeDisplayTag, visibleItems.length),
    total: formatNumber(model.localeDisplayTag, items.length),
  });

  const clearProducerSelection = useCallback(() => {
    consumeNearbyMapFocus();
    setMapFocusRequest(undefined);
    replaceCatalogState(clearHighlightHref);
  }, [clearHighlightHref, consumeNearbyMapFocus]);

  useEffect(() => {
    if (
      !highlightedItem ||
      previousHighlightedSlug.current === highlightedItem.slug
    ) {
      previousHighlightedSlug.current = highlightedItem?.slug ?? "";
      return;
    }

    previousHighlightedSlug.current = highlightedItem.slug;
    consumeNearbyMapFocus();
    mapFocusRequestId.current += 1;
    setMapFocusRequest({
      key: highlightedItem.slug,
      requestId: mapFocusRequestId.current,
    });
  }, [consumeNearbyMapFocus, highlightedItem]);

  useEffect(() => {
    if (!highlightedItem) return;

    function clearFromOutside(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (selectedProducerLinkRef.current?.contains(target)) return;
      if (target.closest(".producer-map-hit-area, .producer-map-circle")) return;
      clearProducerSelection();
    }

    function clearFromKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape" && !isMobileListOpen) {
        clearProducerSelection();
      }
    }

    document.addEventListener("pointerdown", clearFromOutside);
    document.addEventListener("keydown", clearFromKeyboard);
    return () => {
      document.removeEventListener("pointerdown", clearFromOutside);
      document.removeEventListener("keydown", clearFromKeyboard);
    };
  }, [clearProducerSelection, highlightedItem, isMobileListOpen]);

  useEffect(() => {
    if (
      !focusSelectedProducerAfterCloseRef.current ||
      isMobileListOpen ||
      !highlightedItem
    ) {
      return;
    }

    focusSelectedProducerAfterCloseRef.current = false;
    window.requestAnimationFrame(() =>
      selectedProducerLinkRef.current?.focus({ preventScroll: true }),
    );
  }, [highlightedItem, isMobileListOpen]);

  useEffect(() => {
    if (!isMobileListOpen) return;

    function closeListFromOutside(event: PointerEvent) {
      if (!viewerRef.current?.contains(event.target as Node)) {
        setIsMobileListOpen(false);
      }
    }

    function closeListFromKeyboard(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsMobileListOpen(false);
      listToggleRef.current?.focus();
    }

    document.addEventListener("pointerdown", closeListFromOutside);
    document.addEventListener("keydown", closeListFromKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeListFromOutside);
      document.removeEventListener("keydown", closeListFromKeyboard);
    };
  }, [isMobileListOpen]);

  function requestProducerFocus(slug: string) {
    mapFocusRequestId.current += 1;
    setMapFocusRequest({ key: slug, requestId: mapFocusRequestId.current });
  }

  function selectProducer(slug: string, href: string, closeMobileList: boolean) {
    previousHighlightedSlug.current = slug;
    consumeNearbyMapFocus();
    requestProducerFocus(slug);
    pushCatalogState(href);

    if (closeMobileList && window.matchMedia("(max-width: 980px)").matches) {
      focusSelectedProducerAfterCloseRef.current = true;
      setIsMobileListOpen(false);
    }
  }

  function selectMapProducer(slug: string) {
    const href = buildCatalogHref({
      scope: model.scope,
      area: model.area,
      category,
      highlight: slug,
    });
    selectProducer(slug, href, false);
  }

  function selectCategory(href: string) {
    consumeNearbyMapFocus();
    setMapFocusRequest(undefined);
    setIsMobileListOpen(false);
    pushCatalogState(href);
  }

  return (
    <main className="catalog-page catalog-page--simple">
      <SiteCatalogControlsRegistration
        country={areaSelectorCountry}
        currentArea={model.area}
        messages={model.selectorMessages}
      />
      <LanguageMenuRegistration
        currentLocale={model.locale}
        label={model.languageSwitcherLabel}
        options={languageOptions}
      />

      <header className="catalog-simple-header">
        <div>
          <p className="catalog-kicker">
            <Link href="/" className="country-back-link">
              {model.siteName}
            </Link>{" "}
            ·{" "}
            <Link href={model.countryHref} className="country-back-link">
              {model.countryLabel}
            </Link>{" "}
            · <span>{model.areaLabel}</span>
          </p>
          <h1>{model.catalogMessages.title}</h1>
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
            selectCategory(allCategoriesHref);
          }}
          className={`catalog-chip ${!category ? "is-active" : ""}`}
          aria-current={!category ? "page" : undefined}
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
                selectCategory(href);
              }}
              className={`catalog-chip ${
                category === categoryPresentation.token ? "is-active" : ""
              }`}
              aria-current={
                category === categoryPresentation.token ? "page" : undefined
              }
            >
              <span aria-hidden="true">{categoryPresentation.icon}</span>
              {categoryPresentation.label}
            </Link>
          );
        })}
      </nav>

      {adSlot}

      <section className="catalog-simple-layout">
        <div className="catalog-map-stage">
          <div
            className="catalog-simple-map"
            aria-label={model.mapMessages.producerMap}
          >
            <ProducersMap
              points={mapPoints}
              scope={model.scope}
              area={model.area}
              highlightedSlug={highlightedItem?.slug}
              focusRequest={mapFocusRequest}
              nearbyFocusKeys={nearbyMapFocusKeys}
              onNearbyFocusConsumed={consumeNearbyMapFocus}
              onSelectProducer={selectMapProducer}
              messages={model.mapMessages}
            />
          </div>

          <div
            className="catalog-map-selection"
            aria-live="polite"
            aria-atomic="true"
          >
            {highlightedItem ? (
              <article className="catalog-featured-producer">
                <Link
                  ref={selectedProducerLinkRef}
                  className="catalog-featured-producer__link"
                  href={buildProducerHref(highlightedItem, {
                    scope: model.scope,
                    area: model.area,
                  })}
                  prefetch={false}
                >
                  <span className="catalog-kicker">
                    {model.catalogMessages.selected}
                  </span>
                  <strong>{highlightedItem.name}</strong>
                  {highlightedItem.description ? (
                    <span>{highlightedItem.description}</span>
                  ) : null}
                </Link>
              </article>
            ) : null}
          </div>
        </div>

        <aside
          ref={viewerRef}
          className={`catalog-viewer ${
            isMobileListOpen ? "is-mobile-open" : ""
          }`}
          aria-label={model.mapMessages.producers}
        >
          <button
            ref={listToggleRef}
            type="button"
            className="catalog-viewer-toggle"
            aria-expanded={isMobileListOpen}
            aria-controls={PRODUCER_LIST_ID}
            onClick={() => setIsMobileListOpen((isOpen) => !isOpen)}
          >
            {model.catalogMessages.producers}
          </button>

          <div
            id={PRODUCER_LIST_ID}
            className="catalog-viewer-body"
            role="region"
            aria-label={model.catalogMessages.producers}
          >
            <div className="catalog-viewer-head">
              <h2>{model.catalogMessages.producers}</h2>
              <p className="visually-hidden" aria-live="polite">
                {screenReaderSummary}
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
                    <li key={item.producerId}>
                      <Link
                        href={href}
                        prefetch={false}
                        scroll={false}
                        onNavigate={(event) => {
                          event.preventDefault();
                          selectProducer(item.slug, href, true);
                        }}
                        className="producer-compact-link"
                        aria-current={
                          highlightedItem?.slug === item.slug ? true : undefined
                        }
                      >
                        <span className="producer-compact-icon" aria-hidden="true">
                          {categoryPresentations.get(item.category)?.icon ?? "🧺"}
                        </span>
                        <span>
                          <strong>{item.name}</strong>
                          {item.city ? (
                            <small className="producer-compact-location">
                              {item.city}
                            </small>
                          ) : null}
                          {item.description ? <small>{item.description}</small> : null}
                        </span>
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
          </div>
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
