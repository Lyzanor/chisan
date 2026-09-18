"use client";

import Link from "next/link";
import { producerProfileLabels } from "@/lib/i18n/producer-profile";
import { useNationalCatalog } from "@/components/use-national-catalog";
import { explorerSearchFields, type ExplorerProducer } from "@/lib/catalog/explorer";
import { getCatalogSearchMessages } from "@/lib/i18n/catalog-search";
import type { ProducerMapMarker } from "@/lib/producer-selections";
import { CatalogRadiusFilter } from "@/components/catalog-radius-filter";
import {
  isValidCoordinates,
  isWithinRadius,
  type RadiusFilter,
} from "@/lib/location/radius-search";
import { useSearchParams } from "next/navigation";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
} from "@phosphor-icons/react";
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
import type { AreaSelectorCountry, AreaSelectorMessages } from "@/components/area-selector";
import {
  LanguageMenuRegistration,
  type LanguageMenuRegistrationOption,
} from "@/components/language-menu-registration";
import {
  ProducerSelectionMap,
  type ProducerMapFocusRequest,
  type ProducerMapGroupOverview,
} from "@/components/map/producers-map";
import { ProducerMapSelectionCard } from "@/components/map/producer-map-selection-card";
import { useDismissibleProducerMapSelection } from "@/components/map/use-dismissible-producer-map-selection";
import {
  buildCatalogHref,
  type CatalogNavigationScope,
} from "@/lib/catalog-navigation";
import {
  buildCatalogSearchDocument,
  rankCatalogEntries,
  catalogDescriptionPreview,
  findCatalogSearchMatch,
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
  producerDistanceKm,
  selectNearbyProducerKeys,
} from "@/lib/location/nearby-producer-focus";
import { useLocationOnboardingState } from "@/lib/location/saved-location-area";
import { setVisitorPosition } from "@/lib/location/visitor-position";
import {
  includeSelectedProducer,
  prioritizeProducerItems,
} from "@/lib/catalog/producer-list";

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
const PRODUCER_RESULTS_ID = "catalog-producer-results";

function pushAreaQuery(href: string) {
  if (`${window.location.pathname}${window.location.search}` !== href) {
    window.history.pushState(null, "", href);
  }
}

type AreaExplorerProducer = ExplorerProducer;
type SearchScope = "area" | "country" | "nearby";

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
  item,
  href,
  query,
  categories,
  active,
  itemRef,
  onPreview,
  onPreviewEnd,
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
    ? item.categories
        .map((token) => categories.get(token)?.label ?? token)
        .filter((label) => findCatalogSearchMatch(label, query))
        .join(" · ")
    : "";
  return (
    <li ref={itemRef} className={active ? "is-active" : undefined}>
      <Link
        href={href}
        prefetch={false}
        onMouseEnter={() => onPreview(item.key)}
        onMouseLeave={() => onPreviewEnd(item.key)}
        onFocus={() => onPreview(item.key, true)}
        onBlur={() => onPreviewEnd(item.key)}
        className="producer-compact-link"
      >
        <span className="producer-compact-icon" aria-hidden="true">
          {categories.get(item.category)?.icon ?? "🧺"}
        </span>
        <span>
          <strong>
            <SearchMatch text={item.name} query={query} />
          </strong>
          {item.city ? (
            <small className="producer-compact-location">
              <SearchMatch text={`${item.city} · ${item.areaLabel}`} query={query} />
            </small>
          ) : null}
          {matchingCategories ? (
            <small>
              <SearchMatch text={matchingCategories} query={query} />
            </small>
          ) : null}
          {item.description || item.featuredProducts ? (
            <small>
              <SearchMatch text={catalogDescriptionPreview(
                query && query.split(/\s+/u).some((term) => findCatalogSearchMatch(item.featuredProducts, term))
                  ? item.featuredProducts : item.description, query,
              )} query={query} />
            </small>
          ) : null}
        </span>
        <span className="producer-compact-preview" aria-hidden="true">
          <MapPinIcon size={16} weight="fill" />
        </span>
      </Link>
    </li>
  );
});

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
  const searchMessages = getCatalogSearchMessages(model.locale);
  const national = useNationalCatalog(model.scope.country, model.locale, searchScope !== "area");
  const producers = searchScope === "area" ? model.producers : national.catalog?.producers;
  const loading = searchScope !== "area" && !national.catalog && !national.error;
  const scopeLabel = searchScope === "area" ? model.areaLabel : searchScope === "country" ? model.countryLabel : searchMessages.nearby;
  const [radiusFilter, setRadiusFilter] = useState<RadiusFilter | null>(null);
  const lastCoordinatesRef = useRef<RadiusFilter | null>(null);
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
    if (searchScope === "nearby" && !radiusFilter) return [];
    const filtered = searchableProducers.filter((producer) =>
      (!normalizedCategory || producer.categories.some((token) => normalizeCatalogSearch(token) === normalizedCategory)) &&
      (!municipality || normalizeCatalogSearch(producer.city) === normalizeCatalogSearch(municipality)) &&
      (searchScope !== "nearby" || !radiusFilter || isWithinRadius(producer, radiusFilter)),
    );
    if (searchScope === "nearby" && radiusFilter && !deferredSearchQuery) {
      return [...filtered].sort((a, b) => {
        const da = isValidCoordinates(a) ? producerDistanceKm(radiusFilter, a) : Infinity;
        const db = isValidCoordinates(b) ? producerDistanceKm(radiusFilter, b) : Infinity;
        return da - db;
      });
    }
    return rankCatalogEntries(filtered, deferredSearchQuery);
  }, [searchableProducers, deferredSearchQuery, normalizedCategory, municipality, searchScope, radiusFilter]);
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
  const presentedItem = previewedItem ?? selectedItem;
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
  const resultScope = `${searchScope}/${searchQuery}/${category}/${municipality}/${radiusFilter?.radiusKm ?? ""}`;
  const [page, setPage] = useState({ scope: "", limit: VISIBLE_PRODUCER_LIMIT });
  const visibleLimit = page.scope === resultScope ? page.limit : VISIBLE_PRODUCER_LIMIT;
  const baseVisibleItems = useMemo(
    () => orderedItems.slice(0, visibleLimit), [orderedItems, visibleLimit],
  );
  const visibleItems = useMemo(
    () => includeSelectedProducer(baseVisibleItems, selectedItem),
    [baseVisibleItems, selectedItem],
  );
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
      !scrollSelectedListItemAfterMapSelectionRef.current ||
      !selectedItem ||
      !selectedListItemRef.current
    ) {
      return;
    }

    scrollSelectedListItemAfterMapSelectionRef.current = false;
    const selectedListItem = selectedListItemRef.current;
    window.requestAnimationFrame(() => {
      const list = selectedListItem.parentElement;
      if (!list) return;
      const rowBounds = selectedListItem.getBoundingClientRect();
      const listBounds = list.getBoundingClientRect();
      // Reveal the row inside its list without scrolling the map offscreen.
      if (rowBounds.top < listBounds.top) {
        list.scrollTop += rowBounds.top - listBounds.top;
      } else if (rowBounds.bottom > listBounds.bottom) {
        list.scrollTop += rowBounds.bottom - listBounds.bottom;
      }
    });
  }, [selectedItem]);

  useDismissibleProducerMapSelection({
    active: Boolean(presentedItem),
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
        q: searchQuery,
        searchScope,
        municipality,
        category,
        highlight: slug,
      });
      scrollSelectedListItemAfterMapSelectionRef.current = true;
      selectProducer(slug, href);
    },
    [category, model.area, model.scope, selectProducer, municipality, searchQuery, searchScope],
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
    listOrderLockedCategoryRef.current = null;
    setPrioritizedProducerScope(null);
    pushAreaQuery(href);
  }, [cancelPendingPreview, consumeNearbyMapFocus]);

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
    <main className="catalog-page catalog-page--simple" data-category={category}>
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
          {municipality ? (
            <button
              className="detail-municipality-filter"
              type="button"
              aria-label={`${producerProfileLabels(model.locale).removeMunicipality}: ${municipality}`}
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete("municipality");
                window.history.replaceState(
                  null,
                  "",
                  `${url.pathname}${url.search}`,
                );
              }}
            >
              {municipality} ×
            </button>
          ) : null}
          <label className="catalog-search-scope">
            <span className="visually-hidden">{searchMessages.scope}</span>
            <select aria-label={searchMessages.scope} value={searchScope} onChange={(event) => {
              const next = event.target.value as SearchScope;
              cancelPendingPreview();
              setPreviewedSlug("");
              consumeNearbyMapFocus();
              setMapFocusRequest(undefined);
              setRadiusFilter(next === "nearby" ? lastCoordinatesRef.current : null);
              setPrioritizedProducerScope(null);
              listOrderLockedCategoryRef.current = null;
              pushAreaQuery(buildCatalogHref({ scope: model.scope, area: model.area, category, q: searchQuery, searchScope: next }));
            }}>
              <option value="country">{model.countryLabel}</option>
              <option value="area">{formatMessage(searchMessages.province, { area: model.areaLabel })}</option>
              <option value="nearby">{searchMessages.nearby}</option>
            </select>
          </label>
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
                const url = new URL(window.location.href);
                if (event.target.value) url.searchParams.set("q", event.target.value);
                else url.searchParams.delete("q");
                url.searchParams.delete("highlight");
                window.history.replaceState(null, "", `${url.pathname}${url.search}`);
                setPreviewedSlug("");
                listOrderLockedCategoryRef.current = null;
                setPrioritizedProducerScope(null);
              }}
              placeholder={model.catalogMessages.searchPlaceholder}
              maxLength={200}
              autoComplete="off"
            />
          </label>
        </div>
      </div>
      <nav
        className="catalog-simple-categories"
        aria-label={model.catalogMessages.categories}
      >
        <div className="catalog-categories-row">
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
          {baseCategories.map((categoryPresentation) => {
            const href = buildCatalogHref({
              scope: model.scope,
              area: model.area,
              q: searchQuery,
              searchScope,
              municipality,
              category: categoryPresentation.token,
            });
            const isActive =
              category === categoryPresentation.token ||
              normalizeCatalogSearch(categoryPresentation.token) === normalizedCategory;

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
                className={`catalog-chip ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span aria-hidden="true">{categoryPresentation.icon}</span>
                {categoryPresentation.label}
              </Link>
            );
          })}
          {otherCategories.length > 0 ? (
            <button
              type="button"
              className="catalog-chip catalog-chip--toggle"
              onClick={toggleExpandedCategories}
              aria-expanded={showAllCategories}
              aria-label={
                showAllCategories
                  ? searchMessages.fewerCategories
                  : searchMessages.moreCategories
              }
              title={
                showAllCategories
                  ? searchMessages.fewerCategories
                  : searchMessages.moreCategories
              }
            >
              {showAllCategories ? (
                <MinusIcon aria-hidden="true" size={16} />
              ) : (
                <PlusIcon aria-hidden="true" size={16} />
              )}
            </button>
          ) : null}
        </div>
        {showAllCategories && otherCategories.length > 0 ? (
          <div
            className="catalog-categories-row catalog-categories-row--secondary"
            role="group"
            aria-label={searchMessages.moreCategories}
          >
            {otherCategories.map((categoryPresentation) => {
              const href = buildCatalogHref({
                scope: model.scope,
                area: model.area,
                q: searchQuery,
                searchScope,
                municipality,
                category: categoryPresentation.token,
              });
              const isActive =
                category === categoryPresentation.token ||
                normalizeCatalogSearch(categoryPresentation.token) === normalizedCategory;

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
                  className={`catalog-chip ${isActive ? "is-active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span aria-hidden="true">{categoryPresentation.icon}</span>
                  {categoryPresentation.label}
                </Link>
              );
            })}
          </div>
        ) : null}
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
            {loading ? (
              // An unloaded national catalog is not a set without coordinates.
              <div className="map-placeholder">{searchMessages.loading}</div>
            ) : (
              <ProducerSelectionMap
                key={searchScope}
                points={mapPoints}
                minZoom={4}
                selectedKey={presentedItem?.key}
                selectionContent={presentedItem ? (
                  <div aria-live="polite" aria-atomic="true">
                    <ProducerMapSelectionCard
                      linkRef={selectedProducerLinkRef}
                      producer={{ ...presentedItem, description: catalogDescriptionPreview(presentedItem.description), href: presentedItem.href }}
                    />
                  </div>
                ) : null}
                focusRequest={mapFocusRequest}
                nearbyFocusKeys={nearbyMapFocusKeys}
                onNearbyFocusConsumed={consumeNearbyMapFocus}
                onSelectKey={selectMapProducer}
                onPreviewKey={previewMapProducer}
                onPreviewEndKey={clearProducerPreview}
                onVisibleKeysChange={handleVisibleProducerKeysChange}
                groupOverview={mapGroupOverview}
                openOnMainCluster={searchScope === "country"}
                messages={model.mapMessages}
              />
            )}
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
            {searchScope === "nearby" ? <CatalogRadiusFilter
              heading={model.catalogMessages.producers}
              locale={model.locale}
              area={model.countryLabel}
              value={radiusFilter}
              count={items.length}
              onChange={(filter) => {
                cancelPendingPreview();
                setPreviewedSlug("");
                consumeNearbyMapFocus();
                setMapFocusRequest(undefined);
                listOrderLockedCategoryRef.current = null;
                setPrioritizedProducerScope(null);
                lastCoordinatesRef.current = filter;
                setRadiusFilter(filter);
              }}
            /> : <div className="catalog-viewer-head"><h2>{model.catalogMessages.producers}</h2></div>}
            {searchScope === "nearby" && !radiusFilter ? null : (
              <p className="catalog-search-summary" role="status">
                {loading ? searchMessages.loading : searchScope !== "area" && national.error ? searchMessages.error
                  : formatMessage(searchMessages.results, { count: formatNumber(model.localeDisplayTag, items.length), scope: scopeLabel })}
                {normalizedSearchQuery && items.length ? ` · ${searchMessages.relevance}` : ""}
              </p>
            )}
            {searchScope !== "area" && national.error ? <button type="button" className="catalog-search-action" onClick={national.retry}>{searchMessages.retry}</button> : null}
            <p className="visually-hidden" aria-live="polite">
              {screenReaderSummary}
              {visibleItems[0] ? `: ${visibleItems[0].name}` : ""}
            </p>

            {loading || (searchScope !== "area" && national.error) || (searchScope === "nearby" && !radiusFilter) ? null : items.length === 0 ? (
              <p className="catalog-empty">
                {formatMessage(searchQuery ? searchMessages.empty : model.catalogMessages.emptyCategory, {
                  area: scopeLabel, scope: scopeLabel,
                })}
              </p>
            ) : visibleItems.length > 0 ? (
              <ul
                id={PRODUCER_RESULTS_ID}
                className="producer-compact-list"
                aria-busy={searchQuery !== deferredSearchQuery || loading}
              >
                {visibleItems.map((item) => (
                  <ProducerRosterRow
                    key={item.producerId}
                    item={item}
                    href={item.href}
                    query={deferredSearchQuery}
                    categories={categoryPresentations}
                    active={presentedItem?.key === item.key}
                    itemRef={
                      selectedItem?.key === item.key
                        ? selectedListItemRef
                        : undefined
                    }
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
            {orderedItems.length > visibleLimit ? (
              <button type="button" className="catalog-search-action" onClick={() => setPage({ scope: resultScope, limit: visibleLimit + VISIBLE_PRODUCER_LIMIT })}>
                {searchMessages.more}
              </button>
            ) : null}
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
      key={`${model.scope.country}/${model.area}/${model.locale}`}
      adSlot={adSlot}
      model={model}
      category={category}
      municipality={searchParams.get("municipality")?.trim() ?? ""}
      selectedSlug={selectedSlug}
      searchQuery={searchParams.get("q")?.slice(0, 200) ?? ""}
      searchScope={searchParams.get("search_scope") === "country" ? "country" : searchParams.get("search_scope") === "nearby" ? "nearby" : "area"}
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
