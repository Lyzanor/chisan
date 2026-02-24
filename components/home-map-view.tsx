"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { BARCELONA_PROVINCE_BBOX } from "@/lib/barcelona";
import type { ProducerListItem, ProducersApiResponse, TaxonomyResponse } from "@/lib/types";

const ProducersMap = dynamic(() => import("@/components/producers-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[rgba(15,143,103,0.04)]" />,
});

const EMPTY_RESULTS: ProducersApiResponse = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 40,
};

const EMPTY_TAXONOMY: TaxonomyResponse = {
  cities: [],
  categories: [],
  subcategories: [],
};

type MobilePaneMode = "list" | "map";

type CategoryGlyphRule = {
  pattern: RegExp;
  glyph: string;
};

const CATEGORY_GLYPHS: CategoryGlyphRule[] = [
  { pattern: /vino|bodega/i, glyph: "🍷" },
  { pattern: /ques/i, glyph: "🧀" },
  { pattern: /pan|boll|horno|pastel/i, glyph: "🥖" },
  { pattern: /miel/i, glyph: "🍯" },
  { pattern: /cerve/i, glyph: "🍺" },
  { pattern: /fruta|verdura|hort|agric/i, glyph: "🥕" },
  { pattern: /aceite|oliva/i, glyph: "🫒" },
  { pattern: /charcut|carne|embut/i, glyph: "🥩" },
  { pattern: /pescado|marisc/i, glyph: "🐟" },
  { pattern: /cafe|té|te/i, glyph: "☕" },
];

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, value]);

  return debouncedValue;
}

function normalizeLookup(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function inferExactMatch(query: string, collection: Array<{ value: string }>): string {
  const normalizedQuery = normalizeLookup(query);
  if (!normalizedQuery) return "";

  const found = collection.find((item) => normalizeLookup(item.value) === normalizedQuery);
  return found?.value ?? "";
}

function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function getCategoryGlyph(value: string | null | undefined): string {
  if (!value) {
    return "🧺";
  }

  for (const rule of CATEGORY_GLYPHS) {
    if (rule.pattern.test(value)) {
      return rule.glyph;
    }
  }

  return "🧺";
}

function IconSearch() {
  return (
    <svg className="h-4 w-4 flex-none text-[#7f9188]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function IconFilter() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4h18M6 12h12M10 20h4"
      />
    </svg>
  );
}

function IconList() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
      />
    </svg>
  );
}

function IconMap() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2m0 18l6-3m-6 3V2m6 15l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 2"
      />
    </svg>
  );
}

export default function HomeMapView() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [bbox, setBbox] = useState<string | null>(BARCELONA_PROVINCE_BBOX);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<ProducersApiResponse>(EMPTY_RESULTS);
  const [taxonomy, setTaxonomy] = useState<TaxonomyResponse>(EMPTY_TAXONOMY);
  const [selectedProducerId, setSelectedProducerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTaxonomy, setLoadingTaxonomy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobilePane, setMobilePane] = useState<MobilePaneMode>("map");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState(true);

  const cardRefs = useRef<Record<number, HTMLElement | null>>({});
  const debouncedQuery = useDebouncedValue(query, 250);
  const debouncedBbox = useDebouncedValue(bbox, 180);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTaxonomy() {
      setLoadingTaxonomy(true);
      try {
        const res = await fetch("/api/taxonomy", {
          signal: controller.signal,
          cache: "force-cache",
        });
        if (!res.ok) throw new Error("taxonomy-failed");
        const data = (await res.json()) as TaxonomyResponse;
        setTaxonomy(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingTaxonomy(false);
        }
      }
    }

    void loadTaxonomy();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateViewport = () => {
      setIsDesktopViewport(mediaQuery.matches);
    };

    updateViewport();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateViewport);
    } else {
      mediaQuery.addListener(updateViewport);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", updateViewport);
      } else {
        mediaQuery.removeListener(updateViewport);
      }
    };
  }, []);

  const inferredCity = useMemo(() => {
    if (city) return "";
    return inferExactMatch(debouncedQuery, taxonomy.cities);
  }, [city, debouncedQuery, taxonomy.cities]);

  const inferredCategory = useMemo(() => {
    if (category) return "";
    return inferExactMatch(debouncedQuery, taxonomy.categories);
  }, [category, debouncedQuery, taxonomy.categories]);

  const effectiveCity = city || inferredCity;
  const effectiveCategory = category || inferredCategory;

  const effectiveQuery = useMemo(() => {
    const norm = normalizeLookup(debouncedQuery);
    if (!norm) return "";

    const inferredNorms = [inferredCity, inferredCategory]
      .filter(Boolean)
      .map(normalizeLookup);

    if (inferredNorms.includes(norm)) {
      return "";
    }

    return debouncedQuery;
  }, [debouncedQuery, inferredCategory, inferredCity]);

  const featuredCategories = useMemo(() => taxonomy.categories.slice(0, 10), [taxonomy.categories]);

  useEffect(() => {
    setPage(1);
  }, [debouncedBbox, effectiveCategory, effectiveCity, effectiveQuery, subcategory]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadResults() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (effectiveQuery) params.set("query", effectiveQuery);
      if (effectiveCity) params.set("city", effectiveCity);
      if (effectiveCategory) params.set("category", effectiveCategory);
      if (subcategory) params.set("subcategory", subcategory);
      if (debouncedBbox) params.set("bbox", debouncedBbox);
      params.set("page", String(page));

      try {
        const res = await fetch(`/api/producers?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`producers-failed:${res.status}`);
        setResults((await res.json()) as ProducersApiResponse);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          setError("No se pudieron cargar los productores.");
          setResults(EMPTY_RESULTS);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadResults();
    return () => controller.abort();
  }, [debouncedBbox, effectiveCategory, effectiveCity, effectiveQuery, page, subcategory]);

  useEffect(() => {
    if (!selectedProducerId) return;

    cardRefs.current[selectedProducerId]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [selectedProducerId]);

  useEffect(() => {
    if (!selectedProducerId) return;

    if (!results.items.some((producer) => producer.id === selectedProducerId)) {
      setSelectedProducerId(null);
    }
  }, [results.items, selectedProducerId]);

  useEffect(() => {
    if (!mobileFiltersOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileFiltersOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileFiltersOpen]);

  const onMapBoundsChange = useCallback((nextBbox: string) => {
    setBbox((prev) => (prev === nextBbox ? prev : nextBbox));
  }, []);

  const onSelectProducer = useCallback((id: number) => {
    setSelectedProducerId(id);
  }, []);

  const paginationSummary = useMemo(() => {
    if (results.total === 0) return "0 resultados";

    const start = (results.page - 1) * results.pageSize + 1;
    const end = Math.min(results.page * results.pageSize, results.total);
    return `${start}–${end} de ${results.total}`;
  }, [results.page, results.pageSize, results.total]);

  const hasPreviousPage = page > 1;
  const hasNextPage = page * results.pageSize < results.total;
  const hasActiveFilters = Boolean(query || city || category || subcategory);

  const autoAppliedFilters = [
    inferredCity ? `Ciudad: ${inferredCity}` : "",
    inferredCategory ? `Categoría: ${inferredCategory}` : "",
  ].filter(Boolean);

  const activeProducer = useMemo(
    () => results.items.find((producer) => producer.id === selectedProducerId) ?? null,
    [results.items, selectedProducerId],
  );

  function clearAll() {
    setQuery("");
    setCity("");
    setCategory("");
    setSubcategory("");
  }

  function renderProducerCard(producer: ProducerListItem, compact = false) {
    const isSelected = selectedProducerId === producer.id;
    const categoryLabel = producer.category ?? "Sin categoría";
    const cityLabel = producer.city ?? "Sin municipio";

    return (
      <article
        key={producer.id}
        ref={(node) => {
          cardRefs.current[producer.id] = node;
        }}
        className={classNames("km0-result-card", isSelected && "is-active")}
      >
        <button
          type="button"
          onClick={() => setSelectedProducerId(producer.id)}
          className="km0-result-main"
          aria-label={`Seleccionar ${producer.name}`}
        >
          <div className="km0-result-head">
            <span className="km0-glyph" aria-hidden="true">
              {getCategoryGlyph(categoryLabel)}
            </span>
            <div className="min-w-0">
              <p className="km0-result-title truncate">{producer.name}</p>
              <p className="km0-result-meta truncate">
                {cityLabel} · {categoryLabel}
              </p>
            </div>
          </div>

          {!compact && producer.description && (
            <p className="km0-result-desc">{producer.description}</p>
          )}

          <div className="km0-tag-row">
            <span className="km0-tag">{cityLabel}</span>
            {producer.subcategory && <span className="km0-tag">{producer.subcategory}</span>}
            <span className="km0-tag">
              {producer.latitude !== null && producer.longitude !== null ? "Con mapa" : "Sin coordenadas"}
            </span>
          </div>
        </button>

        <Link href={`/p/${producer.id}`} className="km0-result-link">
          Ver ficha <IconChevronRight />
        </Link>
      </article>
    );
  }

  return (
    <div className="km0-app-shell">
      <header className="km0-topbar">
        <div className="km0-topbar-inner">
          <Link href="/" className="km0-brand" aria-label="Inicio KM0">
            <span className="km0-brand-mark">KM0</span>
            <span>
              <p className="km0-brand-title">Guía Local</p>
              <p className="km0-brand-subtitle">Productores de Barcelona</p>
            </span>
          </Link>

          <div className="km0-search-shell" role="search">
            <IconSearch />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por productor, categoría o municipio"
              className="km0-search-input"
              aria-label="Buscar productores"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="km0-icon-btn"
                aria-label="Limpiar búsqueda"
              >
                <IconX />
              </button>
            )}
          </div>

          <div className="km0-topbar-actions">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="km0-ghost-btn lg:hidden"
            >
              <IconFilter /> Filtros
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="km0-ghost-btn hidden sm:inline-flex"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="km0-topbar-sub">
          <div className="km0-chip-row" aria-label="Categorías destacadas">
            {!loadingTaxonomy && featuredCategories.length > 0
              ? featuredCategories.map((bucket) => {
                  const active = effectiveCategory === bucket.value;
                  return (
                    <button
                      key={bucket.value}
                      type="button"
                      onClick={() => {
                        setCategory(active ? "" : bucket.value);
                        setSubcategory("");
                      }}
                      className={classNames("km0-chip", active && "is-active")}
                      title={`${bucket.value} (${bucket.count})`}
                    >
                      <span aria-hidden="true">{getCategoryGlyph(bucket.value)}</span>
                      {bucket.value}
                    </button>
                  );
                })
              : ["🍯", "🥖", "🧀", "🍷"].map((placeholder, index) => (
                  <span key={index} className="km0-chip" aria-hidden="true">
                    {placeholder} Cargando…
                  </span>
                ))}
          </div>

          <div className="km0-topbar-status">
            <span>{loading ? "Cargando resultados…" : `${results.total} productores`}</span>
            {autoAppliedFilters.length > 0 && (
              <span className="km0-auto-filter">{autoAppliedFilters.join(" · ")}</span>
            )}
          </div>
        </div>
      </header>

      <main className="km0-content">
        {isDesktopViewport ? (
          <section className="km0-desktop-grid">
          <aside className="km0-panel km0-list-panel">
            <div className="km0-panel-section">
              <p className="km0-panel-title">Filtros</p>

              <div className="km0-filter-grid">
                <label className="km0-field">
                  <span className="km0-field-label">Municipio</span>
                  <select
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="km0-select"
                  >
                    <option value="">Todos</option>
                    {taxonomy.cities.map((bucket) => (
                      <option key={bucket.value} value={bucket.value}>
                        {bucket.value} ({bucket.count})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="km0-field">
                  <span className="km0-field-label">Categoría</span>
                  <select
                    value={category}
                    onChange={(event) => {
                      setCategory(event.target.value);
                      setSubcategory("");
                    }}
                    className="km0-select"
                  >
                    <option value="">Todas</option>
                    {taxonomy.categories.map((bucket) => (
                      <option key={bucket.value} value={bucket.value}>
                        {bucket.value} ({bucket.count})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="km0-field mt-2">
                <span className="km0-field-label">Subcategoría</span>
                <select
                  value={subcategory}
                  onChange={(event) => setSubcategory(event.target.value)}
                  className="km0-select"
                >
                  <option value="">Todas</option>
                  {taxonomy.subcategories.map((bucket) => (
                    <option key={bucket.value} value={bucket.value}>
                      {bucket.value} ({bucket.count})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="km0-list-toolbar">
              <span>{loading ? "Actualizando…" : paginationSummary}</span>
              {hasActiveFilters && (
                <button type="button" onClick={clearAll} className="km0-link-btn">
                  Limpiar filtros
                </button>
              )}
            </div>

            {error && <p className="km0-inline-error">{error}</p>}

            <div className="km0-list-scroll">
              {!loading && results.items.length === 0 ? (
                <div className="km0-empty-state">
                  <p>Sin resultados en esta zona del mapa.</p>
                  <p>Amplía el área o ajusta filtros.</p>
                </div>
              ) : (
                <div className="km0-results-stack">
                  {results.items.map((producer) => renderProducerCard(producer))}
                </div>
              )}
            </div>

            <div className="km0-pagination">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={!hasPreviousPage || loading}
              >
                ← Anterior
              </button>

              <span>{loading ? "…" : paginationSummary}</span>

              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={!hasNextPage || loading}
              >
                Siguiente →
              </button>
            </div>
          </aside>

          <section className="km0-panel km0-map-panel">
            <div className="km0-map-frame">
              <ProducersMap
                producers={results.items}
                selectedProducerId={selectedProducerId}
                onSelectProducer={onSelectProducer}
                onBoundsChange={onMapBoundsChange}
                className="km0-map-canvas"
              />
              <div className="km0-map-glow" />

              {activeProducer && (
                <div className="km0-active-overlay">
                  <p className="km0-active-title">{activeProducer.name}</p>
                  <p className="km0-active-meta">
                    {activeProducer.city ?? "Sin municipio"}
                    {activeProducer.category ? ` · ${activeProducer.category}` : ""}
                  </p>
                  <Link href={`/p/${activeProducer.id}`} className="km0-result-link">
                    Abrir ficha <IconChevronRight />
                  </Link>
                </div>
              )}
            </div>
          </section>
          </section>
        ) : (
          <section className="km0-mobile-layout">
          <div className="km0-mobile-toolbar">
            <div className="km0-segmented" role="tablist" aria-label="Vista móvil">
              <button
                type="button"
                role="tab"
                aria-selected={mobilePane === "list"}
                data-active={mobilePane === "list"}
                className="km0-segment-btn"
                onClick={() => setMobilePane("list")}
              >
                <span className="inline-flex items-center gap-1.5">
                  <IconList /> Lista
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mobilePane === "map"}
                data-active={mobilePane === "map"}
                className="km0-segment-btn"
                onClick={() => setMobilePane("map")}
              >
                <span className="inline-flex items-center gap-1.5">
                  <IconMap /> Mapa
                </span>
              </button>
            </div>

            <button type="button" onClick={() => setMobileFiltersOpen(true)} className="km0-ghost-btn">
              <IconFilter /> Filtros
            </button>
          </div>

          <div className="km0-mobile-pane">
            {mobilePane === "map" ? (
              <div className="km0-mobile-map">
                <ProducersMap
                  producers={results.items}
                  selectedProducerId={selectedProducerId}
                  onSelectProducer={onSelectProducer}
                  onBoundsChange={onMapBoundsChange}
                  className="km0-map-canvas"
                />
                <div className="km0-map-glow" />

                {activeProducer && (
                  <div className="km0-active-overlay">
                    <p className="km0-active-title">{activeProducer.name}</p>
                    <p className="km0-active-meta">
                      {activeProducer.city ?? "Sin municipio"}
                      {activeProducer.category ? ` · ${activeProducer.category}` : ""}
                    </p>
                    <Link href={`/p/${activeProducer.id}`} className="km0-result-link">
                      Ver ficha <IconChevronRight />
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="km0-mobile-list">
                {error && <p className="km0-inline-error">{error}</p>}

                <div className="km0-list-toolbar border-b border-[var(--line-soft)]">
                  <span>{loading ? "Actualizando…" : paginationSummary}</span>
                  {hasActiveFilters && (
                    <button type="button" onClick={clearAll} className="km0-link-btn">
                      Limpiar
                    </button>
                  )}
                </div>

                <div className="km0-mobile-list-scroll">
                  {!loading && results.items.length === 0 ? (
                    <div className="km0-empty-state">
                      <p>No hay resultados con estos filtros.</p>
                      <p>Prueba otra categoría o municipio.</p>
                    </div>
                  ) : (
                    <div className="km0-results-stack">
                      {results.items.map((producer) => renderProducerCard(producer, true))}
                    </div>
                  )}
                </div>

                <div className="km0-pagination">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={!hasPreviousPage || loading}
                  >
                    ←
                  </button>

                  <span>{loading ? "…" : paginationSummary}</span>

                  <button
                    type="button"
                    onClick={() => setPage((current) => current + 1)}
                    disabled={!hasNextPage || loading}
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
          </section>
        )}
      </main>

      {mobileFiltersOpen && (
        <>
          <button
            type="button"
            className="km0-filter-backdrop"
            aria-label="Cerrar filtros"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <section className="km0-filter-sheet" role="dialog" aria-modal="true" aria-label="Filtros de búsqueda">
            <header className="km0-filter-sheet-head">
              <h2>Filtros</h2>
              <button
                type="button"
                className="km0-icon-btn"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Cerrar"
              >
                <IconX />
              </button>
            </header>

            <div className="km0-filter-sheet-body">
              <label className="km0-field">
                <span className="km0-field-label">Municipio</span>
                <select
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="km0-select"
                >
                  <option value="">Todos</option>
                  {taxonomy.cities.map((bucket) => (
                    <option key={bucket.value} value={bucket.value}>
                      {bucket.value} ({bucket.count})
                    </option>
                  ))}
                </select>
              </label>

              <label className="km0-field">
                <span className="km0-field-label">Categoría</span>
                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setSubcategory("");
                  }}
                  className="km0-select"
                >
                  <option value="">Todas</option>
                  {taxonomy.categories.map((bucket) => (
                    <option key={bucket.value} value={bucket.value}>
                      {bucket.value} ({bucket.count})
                    </option>
                  ))}
                </select>
              </label>

              <label className="km0-field">
                <span className="km0-field-label">Subcategoría</span>
                <select
                  value={subcategory}
                  onChange={(event) => setSubcategory(event.target.value)}
                  className="km0-select"
                >
                  <option value="">Todas</option>
                  {taxonomy.subcategories.map((bucket) => (
                    <option key={bucket.value} value={bucket.value}>
                      {bucket.value} ({bucket.count})
                    </option>
                  ))}
                </select>
              </label>

              <div className="km0-chip-row" aria-label="Categorías destacadas">
                {featuredCategories.map((bucket) => {
                  const active = effectiveCategory === bucket.value;

                  return (
                    <button
                      key={bucket.value}
                      type="button"
                      onClick={() => {
                        setCategory(active ? "" : bucket.value);
                        setSubcategory("");
                      }}
                      className={classNames("km0-chip", active && "is-active")}
                    >
                      <span aria-hidden="true">{getCategoryGlyph(bucket.value)}</span>
                      {bucket.value}
                    </button>
                  );
                })}
              </div>
            </div>

            <footer className="km0-filter-sheet-foot">
              <button type="button" onClick={clearAll} className="km0-btn-secondary">
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="km0-btn-primary"
              >
                Aplicar filtros
              </button>
            </footer>
          </section>
        </>
      )}
    </div>
  );
}
