"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import {
  Suspense,
  memo,
  useDeferredValue,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
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
import { ProducerMapSelectionCard } from "@/components/map/producer-map-selection-card";
import { useDismissibleProducerMapSelection } from "@/components/map/use-dismissible-producer-map-selection";
import {
  buildCatalogHref,
  buildProducerHref,
  type CatalogNavigationScope,
} from "@/lib/catalog-navigation";
import {
  findCatalogSearchMatch,
  normalizeCatalogSearch,
} from "@/lib/catalog-search";
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
import { includeSelectedProducer, prioritizeProducerItems } from "@/lib/catalog/producer-list";

const VISIBLE_PRODUCER_LIMIT = 400;
const PRODUCER_RESULTS_ID = "catalog-producer-results";

function pushAreaQuery(href: string) {
  if (`${window.location.pathname}${window.location.search}` !== href) {
    window.history.pushState(null, "", href);
  }
}

type AreaExplorerProducer = {
  producerId: number;
  slug: string;
  name: string;
  city: string;
  category: string;
  categories: string[];
  description: string;
  imageSrc: string;
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

function withCatalogQuery(
  href: string,
  category: string,
  highlight: string,
): string {
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

function SearchMatch({ text, query }: { text: string; query: string }) {
  const match = findCatalogSearchMatch(text, query);
  if (!match) return text;

  return (
    <>
      {text.slice(0, match.start)}
      <mark className="catalog-search-match">
        {text.slice(match.start, match.end)}
      </mark>
      {text.slice(match.end)}
    </>
  );
}

const ProducerRosterRow = memo(function ProducerRosterRow({
  item, href, query, categories, active, itemRef, onPreview, onPreviewEnd,
}: {
  item: AreaExplorerProducer;
  href: string;
  query: string;
  categories: ReadonlyMap<string, CategoryPresentation>;
  active: boolean;
  itemRef?: Ref<HTMLLIElement>;
  onPreview: (slug: string, immediate?: boolean) => void;
  onPreviewEnd: (slug: string) => void;
}) {
  const matchingCategories = query
    ? item.categories.map((token) => categories.get(token)?.label ?? token)
        .filter((label) => findCatalogSearchMatch(label, query)).join(" · ")
    : "";
  return (
    <li ref={itemRef} className={active ? "is-active" : undefined}>
      <Link
        href={href}
        prefetch={false}
        onMouseEnter={() => onPreview(item.slug)}
        onMouseLeave={() => onPreviewEnd(item.slug)}
        onFocus={() => onPreview(item.slug, true)}
        onBlur={() => onPreviewEnd(item.slug)}
        className="producer-compact-link"
      >
        <span className="producer-compact-icon" aria-hidden="true">
          {categories.get(item.category)?.icon ?? "🧺"}
        </span>
        <span>
          <strong><SearchMatch text={item.name} query={query} /></strong>
          {item.city ? <small className="producer-compact-location"><SearchMatch text={item.city} query={query} /></small> : null}
          {matchingCategories ? <small><SearchMatch text={matchingCategories} query={query} /></small> : null}
          {item.description ? <small><SearchMatch text={item.description} query={query} /></small> : null}
        </span>
      </Link>
    </li>
  );
});

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
      savedCountry === country && savedArea === area
        ? `${country}/${area}`
        : "";
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
  selectedSlug,
}: {
  adSlot: ReactNode;
  model: AreaExplorerModel;
  category: string;
  selectedSlug: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [previewedSlug, setPreviewedSlug] = useState("");
  const [prioritizedProducerScope, setPrioritizedProducerScope] = useState<{
    category: string;
    keys: string[];
  } | null>(null);
  const [mapFocusRequest, setMapFocusRequest] =
    useState<ProducerMapFocusRequest>();
  const mapFocusRequestId = useRef(0);
  const previousSelectedSlug = useRef("");
  const listOrderLockedCategoryRef = useRef<string | null>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const mapSurfaceRef = useRef<HTMLDivElement>(null);
  const selectedProducerLinkRef = useRef<HTMLAnchorElement>(null);
  const selectedListItemRef = useRef<HTMLLIElement>(null);
  const scrollSelectedListItemAfterMapSelectionRef = useRef(false);
  const normalizedCategory = normalizeCatalogSearch(category);
  const normalizedSearchQuery = normalizeCatalogSearch(deferredSearchQuery);
  const categoryPresentations = useMemo(
    () => new Map(model.categories.map((item) => [item.token, item])),
    [model.categories],
  );
  const searchableProducers = useMemo(
    () => new Map(model.producers.map((producer) => [
      producer.producerId,
      normalizeCatalogSearch([
        producer.name,
        producer.city,
        ...producer.categories.map((token) => categoryPresentations.get(token)?.label ?? token),
        producer.description,
      ].join(" ")),
    ])),
    [model.producers, categoryPresentations],
  );
  const categoryItems = useMemo(
    () =>
      normalizedCategory
        ? model.producers.filter((producer) =>
            producer.categories.some(
              (producerCategory) =>
                normalizeCatalogSearch(producerCategory) === normalizedCategory,
            ),
          )
        : model.producers,
    [model.producers, normalizedCategory],
  );
  const items = useMemo(() => {
    if (!normalizedSearchQuery) return categoryItems;

    return categoryItems.filter((producer) =>
      searchableProducers.get(producer.producerId)?.includes(normalizedSearchQuery),
    );
  }, [categoryItems, searchableProducers, normalizedSearchQuery]);
  const selectedItem = useMemo(
    () =>
      selectedSlug
        ? (items.find((item) => item.slug === selectedSlug) ??
          items.find((item) => String(item.producerId) === selectedSlug))
        : undefined,
    [items, selectedSlug],
  );
  const previewedItem = useMemo(
    () =>
      previewedSlug
        ? items.find((item) => item.slug === previewedSlug)
        : undefined,
    [items, previewedSlug],
  );
  const presentedItem = previewedItem ?? selectedItem;
  const mappedItems = useMemo(
    () =>
      items.filter(
        (
          item,
        ): item is AreaExplorerProducer & {
          latitude: number;
          longitude: number;
        } => item.latitude !== null && item.longitude !== null,
      ),
    [items],
  );
  const mapPoints = useMemo(
    () =>
      mappedItems.map((item): ProducerMapPoint => ({
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
      })),
    [categoryPresentations, mappedItems],
  );
  const { keys: nearbyMapFocusKeys, consume: consumeNearbyMapFocus } =
    useNearbyMapFocusKeys(model.scope.country, model.area, mapPoints);
  const prioritizedProducerKeys =
    prioritizedProducerScope?.category === category
      ? prioritizedProducerScope.keys
      : null;
  const orderedItems = useMemo(
    () => prioritizeProducerItems(mappedItems, prioritizedProducerKeys ?? []),
    [mappedItems, prioritizedProducerKeys],
  );
  const baseVisibleItems = useMemo(
    () => orderedItems.slice(0, VISIBLE_PRODUCER_LIMIT),
    [orderedItems],
  );
  const visibleItems = useMemo(
    () => includeSelectedProducer(baseVisibleItems, selectedItem),
    [baseVisibleItems, selectedItem],
  );
  const languageOptions = useMemo(
    () =>
      model.languageOptions.map((option) => ({
        ...option,
        href: withCatalogQuery(option.href, category, selectedSlug),
      })),
    [category, model.languageOptions, selectedSlug],
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
  const clearSelectionHref = buildCatalogHref({
    scope: model.scope,
    area: model.area,
    category,
  });
  const screenReaderSummary = formatMessage(model.catalogMessages.showing, {
    visible: formatNumber(model.localeDisplayTag, visibleItems.length),
    total: formatNumber(model.localeDisplayTag, mappedItems.length),
  });
  const handleVisibleProducerKeysChange = useCallback(
    (keys: string[]) => {
      if (listOrderLockedCategoryRef.current === category) return;

      setPrioritizedProducerScope((current) => {
        if (
          current?.category === category &&
          current.keys.length === keys.length &&
          current.keys.every((key, index) => key === keys[index])
        ) {
          return current;
        }

        return { category, keys };
      });
    },
    [category],
  );

  const clearProducerSelection = useCallback(() => {
    consumeNearbyMapFocus();
    setMapFocusRequest(undefined);
    window.history.replaceState(null, "", clearSelectionHref);
  }, [clearSelectionHref, consumeNearbyMapFocus]);

  useEffect(() => {
    if (!selectedItem || previousSelectedSlug.current === selectedItem.slug) {
      previousSelectedSlug.current = selectedItem?.slug ?? "";
      return;
    }

    previousSelectedSlug.current = selectedItem.slug;
    listOrderLockedCategoryRef.current = category;
    consumeNearbyMapFocus();
    mapFocusRequestId.current += 1;
    setMapFocusRequest({
      key: selectedItem.slug,
      requestId: mapFocusRequestId.current,
      behavior: "select",
    });
  }, [category, consumeNearbyMapFocus, selectedItem]);

  useEffect(() => {
    if (
      !scrollSelectedListItemAfterMapSelectionRef.current ||
      !selectedItem ||
      !selectedListItemRef.current
    ) {
      return;
    }

    scrollSelectedListItemAfterMapSelectionRef.current = false;
    const selectedListItem = selectedListItemRef.current;
    window.requestAnimationFrame(() =>
      selectedListItem.scrollIntoView({ block: "nearest" }),
    );
  }, [selectedItem]);

  useDismissibleProducerMapSelection({
    active: Boolean(selectedItem),
    selectedSurfaceRef: selectedProducerLinkRef,
    relatedSurfaceRef: viewerRef,
    returnFocusRef: mapSurfaceRef,
    onDismiss: clearProducerSelection,
  });

  const requestProducerFocus = useCallback(
    (slug: string, behavior: ProducerMapFocusRequest["behavior"]) => {
      mapFocusRequestId.current += 1;
      setMapFocusRequest({
        key: slug,
        requestId: mapFocusRequestId.current,
        behavior,
      });
    },
    [],
  );

  const selectProducer = useCallback(
    (slug: string, href: string) => {
      previousSelectedSlug.current = slug;
      listOrderLockedCategoryRef.current = category;
      setPreviewedSlug("");
      consumeNearbyMapFocus();
      requestProducerFocus(slug, "select");
      // This model already contains the area's producers. Next's history
      // integration updates useSearchParams without fetching the same area.
      pushAreaQuery(href);
    },
    [category, consumeNearbyMapFocus, requestProducerFocus],
  );

  const selectMapProducer = useCallback(
    (slug: string) => {
      const href = buildCatalogHref({
        scope: model.scope,
        area: model.area,
        category,
        highlight: slug,
      });
      scrollSelectedListItemAfterMapSelectionRef.current = true;
      selectProducer(slug, href);
    },
    [category, model.area, model.scope, selectProducer],
  );

  function selectCategory(href: string) {
    cancelPendingPreview();
    setPreviewedSlug("");
    consumeNearbyMapFocus();
    setMapFocusRequest(undefined);
    listOrderLockedCategoryRef.current = null;
    setPrioritizedProducerScope(null);
    pushAreaQuery(href);
  }

  const cancelPendingPreview = useCallback(() => {
    if (previewTimerRef.current !== null) clearTimeout(previewTimerRef.current);
    previewTimerRef.current = null;
  }, []);

  useEffect(() => cancelPendingPreview, [cancelPendingPreview, category]);

  const previewProducer = useCallback((slug: string, immediate = false) => {
    cancelPendingPreview();
    const showPreview = () => {
      listOrderLockedCategoryRef.current = category;
      consumeNearbyMapFocus();
      setPreviewedSlug(slug);
      requestProducerFocus(slug, "preview");
    };
    // Crossing rows while scrolling must not launch a series of map flights.
    if (immediate) showPreview();
    else previewTimerRef.current = setTimeout(showPreview, 120);
  }, [cancelPendingPreview, category, consumeNearbyMapFocus, requestProducerFocus]);

  const clearProducerPreview = useCallback((slug: string) => {
    cancelPendingPreview();
    setPreviewedSlug((current) => (current === slug ? "" : current));
  }, [cancelPendingPreview]);

  const previewMapProducer = useCallback(
    (slug: string) => {
      listOrderLockedCategoryRef.current = category;
      consumeNearbyMapFocus();
      setPreviewedSlug(slug);
    },
    [category, consumeNearbyMapFocus],
  );

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

      <div className="catalog-discovery-toolbar">
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

        <div className="catalog-discovery-tools">
          <label className="catalog-producer-search">
            <span className="visually-hidden">
              {model.catalogMessages.searchPlaceholder}
            </span>
            <MagnifyingGlassIcon aria-hidden="true" size={20} />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                cancelPendingPreview();
                setSearchQuery(event.target.value);
                setPreviewedSlug("");
                listOrderLockedCategoryRef.current = null;
                setPrioritizedProducerScope(null);
              }}
              placeholder={model.catalogMessages.searchPlaceholder}
              autoComplete="off"
            />
          </label>
        </div>

      </div>
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
        <div className="producer-map-stage">
          <div
            ref={mapSurfaceRef}
            className="catalog-simple-map"
            aria-label={model.mapMessages.producerMap}
            tabIndex={-1}
          >
            <ProducersMap
              points={mapPoints}
              scope={model.scope}
              area={model.area}
              selectedSlug={presentedItem?.slug}
              focusRequest={mapFocusRequest}
              nearbyFocusKeys={nearbyMapFocusKeys}
              onNearbyFocusConsumed={consumeNearbyMapFocus}
              onSelectProducer={selectMapProducer}
              onPreviewProducer={previewMapProducer}
              onPreviewProducerEnd={clearProducerPreview}
              onVisibleProducerKeysChange={handleVisibleProducerKeysChange}
              messages={model.mapMessages}
            />
          </div>

          <div
            className="producer-map-selection-surface"
            aria-live="polite"
            aria-atomic="true"
          >
            {presentedItem ? (
              <ProducerMapSelectionCard
                linkRef={selectedProducerLinkRef}
                producer={{
                  ...presentedItem,
                  href: buildProducerHref(presentedItem, {
                    scope: model.scope,
                    area: model.area,
                  }),
                }}
              />
            ) : null}
          </div>
        </div>

        <aside
          ref={viewerRef}
          className="catalog-viewer catalog-viewer--persistent"
          aria-label={model.mapMessages.producers}
        >
          <div
            className="catalog-viewer-body"
            role="region"
            aria-label={model.catalogMessages.producers}
          >
            <div className="catalog-viewer-head">
              <h2>{model.catalogMessages.producers}</h2>
              <p className="visually-hidden" aria-live="polite">
                {screenReaderSummary}
                {visibleItems[0] ? `: ${visibleItems[0].name}` : ""}
              </p>
            </div>

            {items.length === 0 ? (
              <p className="catalog-empty">
                {formatMessage(model.catalogMessages.emptyCategory, {
                  area: model.areaLabel,
                })}
              </p>
            ) : visibleItems.length > 0 ? (
              <ul id={PRODUCER_RESULTS_ID} className="producer-compact-list" aria-busy={searchQuery !== deferredSearchQuery}>
                {visibleItems.map((item) => (
                  <ProducerRosterRow
                    key={item.producerId}
                    item={item}
                    href={buildProducerHref(item, { scope: model.scope, area: model.area, category })}
                    query={deferredSearchQuery}
                    categories={categoryPresentations}
                    active={presentedItem?.slug === item.slug}
                    itemRef={selectedItem?.slug === item.slug ? selectedListItemRef : undefined}
                    onPreview={previewProducer}
                    onPreviewEnd={clearProducerPreview}
                  />
                ))}
              </ul>
            ) : (
              <p id={PRODUCER_RESULTS_ID} className="catalog-empty">
                {model.catalogMessages.emptyMapView}
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
  const selectedSlug = searchParams.get("highlight")?.trim() ?? "";

  return (
    <AreaExplorerView
      adSlot={adSlot}
      model={model}
      category={category}
      selectedSlug={selectedSlug}
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
          selectedSlug=""
        />
      }
    >
      <AreaExplorerFromSearchParams adSlot={adSlot} model={model} />
    </Suspense>
  );
}
