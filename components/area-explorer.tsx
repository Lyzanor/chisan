"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
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
import { ProducerMapSelectionCard } from "@/components/map/producer-map-selection-card";
import { useDismissibleProducerMapSelection } from "@/components/map/use-dismissible-producer-map-selection";
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
const PRODUCER_RESULTS_ID = "catalog-producer-results";

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
  selectedSlug,
}: {
  adSlot: ReactNode;
  model: AreaExplorerModel;
  category: string;
  selectedSlug: string;
}) {
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewedSlug, setPreviewedSlug] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [mapVisibleProducerScope, setMapVisibleProducerScope] = useState<{
    category: string;
    keys: string[];
  } | null>(null);
  const [mapFocusRequest, setMapFocusRequest] =
    useState<ProducerMapFocusRequest>();
  const mapFocusRequestId = useRef(0);
  const previousSelectedSlug = useRef("");
  const listToggleRef = useRef<HTMLButtonElement>(null);
  const producerListRef = useRef<HTMLUListElement>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const mapSurfaceRef = useRef<HTMLDivElement>(null);
  const selectedProducerLinkRef = useRef<HTMLAnchorElement>(null);
  const focusSelectedProducerAfterCloseRef = useRef(false);
  const normalizedCategory = normalizeCategory(category);
  const normalizedSearchQuery = normalizeCategory(searchQuery);
  const categoryItems = useMemo(
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
  const items = useMemo(() => {
    if (!normalizedSearchQuery) return categoryItems;

    return categoryItems.filter((producer) =>
      normalizeCategory(
        [
          producer.name,
          producer.city,
          producer.category,
          ...producer.categories,
          producer.description,
        ].join(" "),
      ).includes(normalizedSearchQuery),
    );
  }, [categoryItems, normalizedSearchQuery]);
  const selectedItem = useMemo(
    () =>
      selectedSlug
        ? items.find((item) => item.slug === selectedSlug) ??
          items.find((item) => String(item.producerId) === selectedSlug)
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
  const categoryPresentations = useMemo(
    () => new Map(model.categories.map((item) => [item.token, item])),
    [model.categories],
  );
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
      mappedItems.map(
        (item): ProducerMapPoint => ({
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
        }),
      ),
    [categoryPresentations, mappedItems],
  );
  const {
    keys: nearbyMapFocusKeys,
    consume: consumeNearbyMapFocus,
  } = useNearbyMapFocusKeys(model.scope.country, model.area, mapPoints);
  const itemsBySlug = useMemo(
    () => new Map(items.map((item) => [item.slug, item])),
    [items],
  );
  const mapVisibleProducerKeys =
    mapVisibleProducerScope?.category === category
      ? mapVisibleProducerScope.keys
      : null;
  const isFullProducerListVisible = expandedCategory === category;
  const mapVisibleItems = useMemo(
    () =>
      mapVisibleProducerKeys === null
        ? mappedItems.slice(0, VISIBLE_PRODUCER_LIMIT)
        : mapVisibleProducerKeys.flatMap((key) => {
            const item = itemsBySlug.get(key);
            return item ? [item] : [];
          }),
    [itemsBySlug, mapVisibleProducerKeys, mappedItems],
  );
  const expandedItems = useMemo(() => {
    const visibleKeys = new Set(mapVisibleItems.map(({ slug }) => slug));
    return [
      ...mapVisibleItems,
      ...mappedItems.filter(({ slug }) => !visibleKeys.has(slug)),
    ];
  }, [mapVisibleItems, mappedItems]);
  const visibleItems = useMemo(
    () =>
      (isFullProducerListVisible ? expandedItems : mapVisibleItems).slice(
        0,
        VISIBLE_PRODUCER_LIMIT,
      ),
    [expandedItems, isFullProducerListVisible, mapVisibleItems],
  );
  const hasMoreProducers =
    mapVisibleProducerKeys !== null &&
    mapVisibleItems.length < Math.min(mappedItems.length, VISIBLE_PRODUCER_LIMIT);
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
  const handleVisibleProducerKeysChange = useCallback((keys: string[]) => {
    setMapVisibleProducerScope((current) => {
      if (
        current?.category === category &&
        current.keys.length === keys.length &&
        current.keys.every((key, index) => key === keys[index])
      ) {
        return current;
      }

      return { category, keys };
    });
  }, [category]);

  const clearProducerSelection = useCallback(() => {
    consumeNearbyMapFocus();
    setMapFocusRequest(undefined);
    replaceCatalogState(clearSelectionHref);
  }, [clearSelectionHref, consumeNearbyMapFocus]);

  useEffect(() => {
    if (!selectedItem || previousSelectedSlug.current === selectedItem.slug) {
      previousSelectedSlug.current = selectedItem?.slug ?? "";
      return;
    }

    previousSelectedSlug.current = selectedItem.slug;
    consumeNearbyMapFocus();
    mapFocusRequestId.current += 1;
    setMapFocusRequest({
      key: selectedItem.slug,
      requestId: mapFocusRequestId.current,
    });
  }, [consumeNearbyMapFocus, selectedItem]);

  useDismissibleProducerMapSelection({
    active: Boolean(selectedItem),
    selectedSurfaceRef: selectedProducerLinkRef,
    relatedSurfaceRef: viewerRef,
    returnFocusRef: mapSurfaceRef,
    suspendEscape: isMobileListOpen,
    onDismiss: clearProducerSelection,
  });

  useEffect(() => {
    if (
      !focusSelectedProducerAfterCloseRef.current ||
      isMobileListOpen ||
      !selectedItem
    ) {
      return;
    }

    focusSelectedProducerAfterCloseRef.current = false;
    window.requestAnimationFrame(() =>
      selectedProducerLinkRef.current?.focus({ preventScroll: true }),
    );
  }, [isMobileListOpen, selectedItem]);

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
    previousSelectedSlug.current = slug;
    setPreviewedSlug("");
    consumeNearbyMapFocus();
    requestProducerFocus(slug);
    pushCatalogState(href);

    if (closeMobileList && window.matchMedia("(max-width: 980px)").matches) {
      focusSelectedProducerAfterCloseRef.current = true;
      setExpandedCategory(null);
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
    setPreviewedSlug("");
    consumeNearbyMapFocus();
    setMapFocusRequest(undefined);
    setIsMobileListOpen(false);
    setExpandedCategory(null);
    setMapVisibleProducerScope(null);
    pushCatalogState(href);
  }

  function previewProducer(slug: string) {
    if (previewedSlug === slug) return;
    consumeNearbyMapFocus();
    setPreviewedSlug(slug);
    requestProducerFocus(slug);
  }

  function clearProducerPreview(slug: string) {
    setPreviewedSlug((current) => (current === slug ? "" : current));
  }

  function toggleProducerScope() {
    if (isFullProducerListVisible) {
      setExpandedCategory(null);
      return;
    }

    const firstAdditionalResult = mapVisibleItems.length;
    setExpandedCategory(category);
    window.requestAnimationFrame(() => {
      producerListRef.current
        ?.querySelectorAll<HTMLAnchorElement>(".producer-compact-link")
        .item(firstAdditionalResult)
        ?.focus();
    });
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
              setSearchQuery(event.target.value);
              setPreviewedSlug("");
              setExpandedCategory(null);
              setMapVisibleProducerScope(null);
            }}
            placeholder={model.catalogMessages.searchPlaceholder}
            autoComplete="off"
          />
        </label>
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
              <ul
                ref={producerListRef}
                id={PRODUCER_RESULTS_ID}
                className="producer-compact-list"
              >
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
                      className={
                        presentedItem?.slug === item.slug ? "is-active" : undefined
                      }
                    >
                      <Link
                        href={href}
                        prefetch={false}
                        scroll={false}
                        onNavigate={(event) => {
                          event.preventDefault();
                          selectProducer(item.slug, href, true);
                        }}
                        onMouseEnter={() => previewProducer(item.slug)}
                        onMouseLeave={() => clearProducerPreview(item.slug)}
                        onFocus={() => previewProducer(item.slug)}
                        onBlur={() => clearProducerPreview(item.slug)}
                        className="producer-compact-link"
                        aria-current={
                          selectedItem?.slug === item.slug ? true : undefined
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
              <p id={PRODUCER_RESULTS_ID} className="catalog-empty">
                {model.catalogMessages.emptyMapView}
              </p>
            )}

            {hasMoreProducers ? (
              <div className="catalog-viewer-scope">
                <button
                  type="button"
                  aria-pressed={isFullProducerListVisible}
                  aria-controls={PRODUCER_RESULTS_ID}
                  onClick={toggleProducerScope}
                >
                  {isFullProducerListVisible
                    ? model.catalogMessages.showMapOnly
                    : model.catalogMessages.showMore}
                </button>
              </div>
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
