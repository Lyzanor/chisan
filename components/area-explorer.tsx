"use client";

import { useNationalCatalog } from "@/components/use-national-catalog";
import { explorerSearchFields, type ExplorerProducer } from "@/lib/catalog/explorer";
import { getCatalogSearchMessages } from "@/lib/i18n/catalog-search";
import type { ProducerMapMarker } from "@/lib/producer-selections";
import { CatalogSearchControl } from "@/components/catalog-search-control";
import { CatalogSearchSlot } from "@/components/catalog-search-slot";
import { useRouter, useSearchParams } from "next/navigation";
import { ProducerCandidateSuggestionModal } from "@/components/map/producer-candidate-suggestion-modal";
import {
  Suspense,
  useDeferredValue,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { SiteCatalogControlsRegistration } from "@/components/account/site-catalog-controls-context";
import type { AreaSelectorCountry, AreaSelectorMessages } from "@/components/area-selector";
import {
  LanguageMenuRegistration,
  type LanguageMenuRegistrationOption,
} from "@/components/language-menu-registration";
import type {
  ProducerMapFocusRequest,
  ProducerMapGroupOverview,
} from "@/components/map/producers-map";
import { useDismissibleProducerMapSelection } from "@/components/map/use-dismissible-producer-map-selection";
import {
  buildCatalogHref,
  type CatalogNavigationScope,
} from "@/lib/catalog-navigation";
import {
  buildCatalogSearchDocument,
  rankCatalogEntries,
  normalizeCatalogSearch,
} from "@/lib/catalog-search";
import type { CategoryPresentation } from "@/lib/i18n/categories";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
import {
  createCatalogPositionRequest,
  type LocationFetch,
} from "@/lib/location/location-onboarding";
import {
  selectNearbyProducerKeys,
} from "@/lib/location/nearby-producer-focus";
import { useLocationOnboardingState } from "@/lib/location/saved-location-area";
import { setVisitorPosition } from "@/lib/location/visitor-position";
import {
  includeSelectedProducer,
  prioritizeProducerItems,
} from "@/lib/catalog/producer-list";
import { CategoryNav } from "@/components/explorer/category-nav";
import { MapStage } from "@/components/explorer/map-stage";
import { RosterSheet } from "@/components/explorer/roster-sheet";

export const BASE_CATEGORY_TOKENS = new Set([
  "Café",
  "Carne",
  "Cerveza",
  "Dulces y repostería",
  "Fruta y verdura",
  "Helados",
  "Lácteos y quesos",
  "Pan y cereal",
  "Pescado",
  "Vino",
]);

const BASE_CATEGORY_NORMALIZED = new Set(
  Array.from(BASE_CATEGORY_TOKENS, (token) => normalizeCatalogSearch(token)),
);

export function isBaseCategory(token: string): boolean {
  return (
    BASE_CATEGORY_TOKENS.has(token) ||
    BASE_CATEGORY_NORMALIZED.has(normalizeCatalogSearch(token))
  );
}

const VISIBLE_PRODUCER_LIMIT = 400;

function pushAreaQuery(href: string) {
  if (`${window.location.pathname}${window.location.search}` !== href) {
    window.history.pushState(null, "", href);
  }
}

type AreaExplorerProducer = ExplorerProducer;
type SearchScope = "area" | "country";

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
  selectorMessages: AreaSelectorMessages;
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
  municipality = "",
  q = "",
  searchScope: SearchScope = "area",
): string {
  const url = new URL(href, "https://catalog.invalid");
  if (municipality) url.searchParams.set("municipality", municipality);
  if (q) url.searchParams.set("q", q);
  if (searchScope !== "area") url.searchParams.set("search_scope", searchScope);

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

function useNearbyMapFocusKeys(
  country: string,
  area: string,
  points: readonly ProducerMapMarker[],
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

        setVisitorPosition(result.position);

        const nearbyKeys = selectNearbyProducerKeys(
          result.position,
          pointsRef.current.map((point) => ({
            key: point.key,
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
  municipality = "",
  adSlot,
  model,
  category,
  selectedSlug,
  searchQuery = "",
  searchScope = "area",
}: {
  adSlot: ReactNode;
  model: AreaExplorerModel;
  municipality?: string;
  category: string;
  selectedSlug: string;
  searchQuery?: string;
  searchScope?: SearchScope;
}) {
  const router = useRouter();
  const searchMessages = getCatalogSearchMessages(model.locale);
  const national = useNationalCatalog(model.scope.country, model.locale, searchScope !== "area");
  const producers = searchScope === "area" ? model.producers : national.catalog?.producers;
  const loading = searchScope !== "area" && !national.catalog && !national.error;
  const scopeLabel = searchScope === "area" ? model.areaLabel : model.countryLabel;
  const [listOpen, setListOpen] = useState(false);
  const [suggestCandidateOpen, setSuggestCandidateOpen] = useState(false);
  const explorerRef = useRef<HTMLElement>(null);
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
    () => (producers ?? []).map((producer) => ({
      ...producer, search: buildCatalogSearchDocument(explorerSearchFields(producer)),
    })), [producers],
  );
  const availableCategories = useMemo(() => new Set(
    (producers ?? model.producers).flatMap((producer) => producer.categories),
  ), [producers, model.producers]);
  const baseCategories = useMemo(
    () => model.categories.filter((item) => isBaseCategory(item.token)),
    [model.categories],
  );
  const otherCategories = useMemo(
    () =>
      model.categories.filter(
        (item) =>
          !isBaseCategory(item.token) &&
          (availableCategories.has(item.token) ||
            normalizeCatalogSearch(item.token) === normalizedCategory),
      ),
    [model.categories, availableCategories, normalizedCategory],
  );
  const activeOtherCategory = useMemo(
    () =>
      otherCategories.find(
        (item) =>
          item.token === category ||
          normalizeCatalogSearch(item.token) === normalizedCategory,
      ),
    [otherCategories, category, normalizedCategory],
  );
  const items = useMemo(() => {
    const filtered = searchableProducers.filter((producer) =>
      (!normalizedCategory || producer.categories.some((token) => normalizeCatalogSearch(token) === normalizedCategory)) &&
      (!municipality || normalizeCatalogSearch(producer.city) === normalizeCatalogSearch(municipality)),
    );
    return rankCatalogEntries(filtered, deferredSearchQuery);
  }, [searchableProducers, deferredSearchQuery, normalizedCategory, municipality]);
  const selectedItem = useMemo(
    () =>
      selectedSlug
        ? (items.find((item) => item.key === selectedSlug) ??
          items.find((item) => item.area === model.area && item.slug === selectedSlug))
        : undefined,
    [items, selectedSlug, model.area],
  );
  const previewedItem = useMemo(
    () =>
      previewedSlug
        ? items.find((item) => item.key === previewedSlug)
        : undefined,
    [items, previewedSlug],
  );
  const mappedItems = useMemo(
    () =>
      items.filter(
        (
          item,
        ): item is (typeof items)[number] & {
          latitude: number;
          longitude: number;
        } => item.latitude !== null && item.longitude !== null,
      ),
    [items],
  );
  const mapPoints = useMemo(
    () =>
      mappedItems.map((item): ProducerMapMarker => ({
        key: item.key,
        href: item.href,
        icon: categoryPresentations.get(item.category)?.icon ?? "🧺",
        name: item.name,
        city: item.city,
        categories: item.categories.map(
          (itemCategory) =>
            categoryPresentations.get(itemCategory)?.label ?? itemCategory,
        ),
        latitude: item.latitude,
        longitude: item.longitude,
        group: { key: item.area, label: item.areaLabel },
      })),
    [categoryPresentations, mappedItems],
  );
  const mapGroupOverview = useMemo<ProducerMapGroupOverview>(() => {
    const messages = getCatalogSearchMessages(model.locale);
    const numbers = new Intl.NumberFormat(model.localeDisplayTag);
    const plurals = new Intl.PluralRules(model.localeDisplayTag);
    const lists = new Intl.ListFormat(model.localeDisplayTag, { type: "conjunction" });
    return {
      formatCount: (count) => numbers.format(count),
      describe: (labels, count) => {
        const areas = lists.format(labels);
        const producers = formatMessage(
          plurals.select(count) === "one" ? messages.mapProducer : messages.mapProducers,
          { count: numbers.format(count) },
        );
        return { areas, producers, label: formatMessage(messages.mapGroup, { areas, producers }) };
      },
    };
  }, [model.locale, model.localeDisplayTag]);
  const { keys: nearbyMapFocusKeys, consume: consumeNearbyMapFocus } =
    useNearbyMapFocusKeys(model.scope.country, searchScope === "area" ? model.area : "", mapPoints);
  const prioritizedProducerKeys =
    prioritizedProducerScope?.category === category
      ? prioritizedProducerScope.keys
      : null;
  const orderedItems = useMemo(
    () => normalizedSearchQuery ? items : prioritizeProducerItems(
      items, prioritizedProducerKeys ?? [],
    ),
    [items, normalizedSearchQuery, prioritizedProducerKeys],
  );
  const resultScope = `${searchScope}/${searchQuery}/${category}/${municipality}`;
  const [page, setPage] = useState({ scope: "", limit: VISIBLE_PRODUCER_LIMIT });
  const visibleLimit = page.scope === resultScope ? page.limit : VISIBLE_PRODUCER_LIMIT;
  const baseVisibleItems = useMemo(
    () => orderedItems.slice(0, visibleLimit), [orderedItems, visibleLimit],
  );
  const visibleItems = useMemo(
    () => includeSelectedProducer(baseVisibleItems, selectedItem),
    [baseVisibleItems, selectedItem],
  );
  const presentedItem = previewedItem ?? selectedItem ?? visibleItems[0];
  const languageOptions = useMemo(
    () =>
      model.languageOptions.map((option) => ({
        ...option,
        href: withCatalogQuery(
          option.href,
          category,
          selectedSlug,
          municipality,
          searchQuery,
          searchScope,
        ),
      })),
    [category, model.languageOptions, selectedSlug, municipality, searchQuery, searchScope],
  );
  const areaSelectorCountry = useMemo<AreaSelectorCountry>(
    () => ({
      regions: model.areaSelectorCountry.regions.map((region) => ({
        ...region,
        areas: region.areas.map((areaOption) => ({
          ...areaOption,
          href: withCatalogQuery(areaOption.href, category, "", "", searchQuery),
        })),
      })),
    }),
    [category, model.areaSelectorCountry.regions, searchQuery],
  );
  const allCategoriesHref = buildCatalogHref({
    scope: model.scope,
    area: model.area,
    q: searchQuery,
    searchScope,
    municipality,
  });
  const clearSelectionHref = buildCatalogHref({
    scope: model.scope,
    area: model.area,
    q: searchQuery,
    searchScope,
    municipality,
    category,
  });
  const screenReaderSummary = formatMessage(model.catalogMessages.showing, {
    visible: formatNumber(model.localeDisplayTag, visibleItems.length),
    total: formatNumber(model.localeDisplayTag, items.length),
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
    if (previewTimerRef.current !== null) clearTimeout(previewTimerRef.current);
    previewTimerRef.current = null;
    setPreviewedSlug("");
    consumeNearbyMapFocus();
    setMapFocusRequest(undefined);
    window.history.replaceState(null, "", clearSelectionHref);
  }, [clearSelectionHref, consumeNearbyMapFocus]);

  useEffect(() => {
    if (!selectedItem || previousSelectedSlug.current === selectedItem.key) {
      previousSelectedSlug.current = selectedItem?.key ?? "";
      return;
    }

    previousSelectedSlug.current = selectedItem.key;
    scrollSelectedListItemAfterMapSelectionRef.current = true;
    listOrderLockedCategoryRef.current = category;
    consumeNearbyMapFocus();
    mapFocusRequestId.current += 1;
    setMapFocusRequest({
      key: selectedItem.key,
      requestId: mapFocusRequestId.current,
      behavior: "select",
    });
  }, [category, consumeNearbyMapFocus, selectedItem]);

  useEffect(() => {
    if (
      !selectedItem ||
      !selectedListItemRef.current
    ) {
      return;
    }

    const selectedListItem = selectedListItemRef.current;
    scrollSelectedListItemAfterMapSelectionRef.current = true;
    const list = selectedListItem.closest<HTMLElement>(".catalog-viewer-body");
    if (!list) return;
    const reveal = () => {
      if (!scrollSelectedListItemAfterMapSelectionRef.current ||
        !selectedListItem.offsetHeight || list.clientHeight < selectedListItem.offsetHeight || !list.clientHeight) return;
      scrollSelectedListItemAfterMapSelectionRef.current = false;
      const rowBounds = selectedListItem.getBoundingClientRect();
      const listBounds = list.getBoundingClientRect();
      // Reveal the row inside its list without scrolling the map offscreen.
      if (rowBounds.top < listBounds.top) {
        list.scrollTop += rowBounds.top - listBounds.top;
      } else if (rowBounds.bottom > listBounds.bottom) {
        list.scrollTop += rowBounds.bottom - listBounds.bottom;
      }
    };
    const frame = window.requestAnimationFrame(reveal);
    // Keep the selected row visible when the sheet or viewport changes size.
    const observer = new ResizeObserver(() => {
      scrollSelectedListItemAfterMapSelectionRef.current = true;
      reveal();
    });
    observer.observe(list);
    return () => { window.cancelAnimationFrame(frame); observer.disconnect(); };
  }, [selectedItem, listOpen]);

  useDismissibleProducerMapSelection({
    active: Boolean(selectedItem || previewedItem),
    selectedSurfaceRef: selectedProducerLinkRef,
    relatedSurfaceRef: explorerRef,
    suspendEscape: listOpen,
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
        q: searchQuery,
        searchScope,
        municipality,
        category,
        highlight: slug,
      });
      scrollSelectedListItemAfterMapSelectionRef.current = true;
      setListOpen(false);
      selectProducer(slug, href);
    },
    [category, model.area, model.scope, selectProducer, municipality, searchQuery, searchScope, setListOpen],
  );

  const cancelPendingPreview = useCallback(() => {
    if (previewTimerRef.current !== null) clearTimeout(previewTimerRef.current);
    previewTimerRef.current = null;
  }, []);

  useEffect(() => cancelPendingPreview, [cancelPendingPreview, category]);

  const selectCategory = useCallback((href: string) => {
    cancelPendingPreview();
    setPreviewedSlug("");
    consumeNearbyMapFocus();
    setMapFocusRequest(undefined);
    setListOpen(false);
    listOrderLockedCategoryRef.current = null;
    setPrioritizedProducerScope(null);
    pushAreaQuery(href);
  }, [cancelPendingPreview, consumeNearbyMapFocus, setListOpen]);

  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const showAllCategories = categoriesExpanded || Boolean(activeOtherCategory);

  const toggleExpandedCategories = useCallback(() => {
    if (showAllCategories) {
      setCategoriesExpanded(false);
      if (activeOtherCategory) {
        selectCategory(allCategoriesHref);
      }
    } else {
      setCategoriesExpanded(true);
    }
  }, [showAllCategories, activeOtherCategory, selectCategory, allCategoriesHref]);

  const previewProducer = useCallback(
    (slug: string, immediate = false) => {
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
    },
    [
      cancelPendingPreview,
      category,
      consumeNearbyMapFocus,
      requestProducerFocus,
    ],
  );

  const clearProducerPreview = useCallback(
    () => {
      // Keep the latest preview reachable when crossing from a row/point to its
      // card. Another producer, outside click or Escape dismisses/replaces it.
      cancelPendingPreview();
    },
    [cancelPendingPreview],
  );

  const previewMapProducer = useCallback(
    (slug: string) => {
      listOrderLockedCategoryRef.current = category;
      consumeNearbyMapFocus();
      setPreviewedSlug(slug);
    },
    [category, consumeNearbyMapFocus],
  );

  return (
    <main className="catalog-page catalog-page--simple catalog-page--immersive" data-category={category}>
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

      <h1 className="visually-hidden">{model.catalogMessages.title} · {scopeLabel}</h1>
      <CatalogSearchSlot>
        <CatalogSearchControl
          value={searchQuery}
          onChange={(value) => {
            cancelPendingPreview();
            const url = new URL(window.location.href);
            if (value) url.searchParams.set("q", value);
            else url.searchParams.delete("q");
            url.searchParams.delete("highlight");
            window.history.replaceState(null, "", `${url.pathname}${url.search}`);
            setPreviewedSlug("");
            setMapFocusRequest(undefined);
            listOrderLockedCategoryRef.current = null;
            setPrioritizedProducerScope(null);
          }}
          scope={searchScope}
          onScopeChange={(next) => {
            cancelPendingPreview();
            setPreviewedSlug("");
            consumeNearbyMapFocus();
            setMapFocusRequest(undefined);
            setPrioritizedProducerScope(null);
            listOrderLockedCategoryRef.current = null;
            pushAreaQuery(buildCatalogHref({ scope: model.scope, area: model.area, category, q: searchQuery, searchScope: next }));
          }}
          searchLabel={model.catalogMessages.searchPlaceholder}
          placeholder={searchMessages.searchShort}
          scopeLabel={searchMessages.scope}
          filterLabel={searchMessages.filters}
          areaLabel={model.areaLabel}
          countryLabel={model.countryLabel}
          countryData={areaSelectorCountry}
          currentAreaSlug={model.area}
          onSelectArea={(areaOption) => {
            cancelPendingPreview();
            setPreviewedSlug("");
            consumeNearbyMapFocus();
            setMapFocusRequest(undefined);
            setPrioritizedProducerScope(null);
            listOrderLockedCategoryRef.current = null;
            // A different province needs its server model, not just new query state.
            router.push(areaOption.href);
          }}
        />
      </CatalogSearchSlot>
      {municipality ? (
        <button className="detail-municipality-filter catalog-map-municipality" type="button"
          aria-label={`${formatMessage("{label}", { label: "Municipio" })}: ${municipality}`}
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete("municipality");
            url.searchParams.delete("highlight");
            window.history.replaceState(null, "", `${url.pathname}${url.search}`);
            setPreviewedSlug("");
            listOrderLockedCategoryRef.current = null;
            setPrioritizedProducerScope(null);
          }}>
          {municipality} ×
        </button>
      ) : null}

      <CategoryNav
        category={category}
        normalizedCategory={normalizedCategory}
        allCategoriesHref={allCategoriesHref}
        baseCategories={baseCategories}
        otherCategories={otherCategories}
        showAllCategories={showAllCategories}
        onToggleExpanded={toggleExpandedCategories}
        onSelectCategory={selectCategory}
        buildCategoryHref={(token) =>
          buildCatalogHref({
            scope: model.scope,
            area: model.area,
            q: searchQuery,
            searchScope,
            municipality,
            category: token,
          })
        }
        labels={{
          categories: model.catalogMessages.categories,
          allCategories: model.catalogMessages.allCategories,
          moreCategories: searchMessages.moreCategories,
          fewerCategories: searchMessages.fewerCategories,
        }}
      />

      <section ref={explorerRef} className={`catalog-simple-layout producer-map-explorer${listOpen ? " is-list-open" : ""}`}>
        <MapStage
          mapSurfaceRef={mapSurfaceRef}
          mapLabel={model.mapMessages.producerMap}
          loading={loading}
          hasError={Boolean(national.error && searchScope === "country")}
          hasItems={Boolean(items.length)}
          statusMessage={
            loading
              ? searchMessages.loading
              : national.error && searchScope === "country"
                ? searchMessages.error
                : formatMessage(
                    searchQuery
                      ? searchMessages.empty
                      : model.catalogMessages.emptyCategory,
                    { area: scopeLabel, scope: scopeLabel },
                  )
          }
          retryAction={national.retry}
          retryLabel={searchMessages.retry}
          searchScope={searchScope}
          points={mapPoints}
          selectedKey={presentedItem?.key}
          focusRequest={mapFocusRequest}
          nearbyFocusKeys={nearbyMapFocusKeys}
          onNearbyFocusConsumed={consumeNearbyMapFocus}
          onSelectKey={selectMapProducer}
          onPreviewKey={previewMapProducer}
          onPreviewEndKey={clearProducerPreview}
          onVisibleKeysChange={handleVisibleProducerKeysChange}
          groupOverview={mapGroupOverview}
          messages={model.mapMessages}
          carouselKey={resultScope}
          orderedItems={orderedItems}
          onCarouselInteract={() => {
            listOrderLockedCategoryRef.current = category;
            cancelPendingPreview();
          }}
          carouselLabels={searchMessages}
          selectedProducerLinkRef={selectedProducerLinkRef}
        />

        <RosterSheet
          viewerRef={viewerRef}
          open={listOpen}
          onOpenChange={setListOpen}
          title={model.mapMessages.producers}
          sheetLabel={
            loading
              ? searchMessages.loading
              : formatMessage(searchMessages.sheetResults, {
                  count: formatNumber(model.localeDisplayTag, items.length),
                  scope: scopeLabel,
                })
          }
          closeLabel={searchMessages.backToMap}
          producersHeading={model.catalogMessages.producers}
          summaryText={
            loading
              ? searchMessages.loading
              : searchScope !== "area" && national.error
                ? searchMessages.error
                : formatMessage(searchMessages.results, {
                    count: formatNumber(model.localeDisplayTag, items.length),
                    scope: scopeLabel,
                  })
          }
          relevanceLabel={
            normalizedSearchQuery && items.length
              ? searchMessages.relevance
              : undefined
          }
          screenReaderSummary={screenReaderSummary}
          adSlot={adSlot}
          loading={loading}
          hasError={Boolean(searchScope !== "area" && national.error)}
          onRetry={national.retry}
          retryLabel={searchMessages.retry}
          items={items}
          visibleItems={visibleItems}
          visibleLimit={visibleLimit}
          totalCount={orderedItems.length}
          emptyMessage={formatMessage(
            searchQuery
              ? searchMessages.empty
              : model.catalogMessages.emptyCategory,
            { area: scopeLabel, scope: scopeLabel },
          )}
          emptyMapViewMessage={model.catalogMessages.emptyMapView}
          moreLabel={searchMessages.more}
          onLoadMore={() =>
            setPage({
              scope: resultScope,
              limit: visibleLimit + VISIBLE_PRODUCER_LIMIT,
            })
          }
          searchQuery={searchQuery}
          deferredSearchQuery={deferredSearchQuery}
          locale={model.locale}
          categoryPresentations={categoryPresentations}
          presentedKey={presentedItem?.key}
          selectedKey={selectedItem?.key}
          selectedListItemRef={selectedListItemRef}
          onPreview={previewProducer}
          onPreviewEnd={clearProducerPreview}
          onSuggestProducer={() => setSuggestCandidateOpen(true)}
        />
      </section>

      <ProducerCandidateSuggestionModal
        open={suggestCandidateOpen}
        onClose={() => setSuggestCandidateOpen(false)}
        defaultLocation={`${model.areaLabel}, ${model.countryLabel}`}
      />
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
      key={`${model.scope.country}/${model.area}/${model.locale}`}
      adSlot={adSlot}
      model={model}
      category={category}
      municipality={searchParams.get("municipality")?.trim() ?? ""}
      selectedSlug={selectedSlug}
      searchQuery={searchParams.get("q")?.slice(0, 200) ?? ""}
      searchScope={searchParams.get("search_scope") === "country" || searchParams.get("search_scope") === "nearby" ? "country" : "area"}
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
