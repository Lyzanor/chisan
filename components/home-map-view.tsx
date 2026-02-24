"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import ActiveProducerOverlay from "@/components/home-map/active-producer-overlay";
import { useProducerResults, useTaxonomyData } from "@/components/home-map/data-hooks";
import FilterSelect from "@/components/home-map/filter-select";
import {
  classNames,
  getCategoryGlyph,
  inferExactMatch,
  normalizeLookup,
  useDebouncedValue,
} from "@/components/home-map/helpers";
import { IconSearch, IconX } from "@/components/home-map/icons";
import { BARCELONA_PROVINCE_BBOX } from "@/lib/barcelona";
import { buildProducerFiltersHref } from "@/lib/search-params";

const ProducersMap = dynamic(() => import("@/components/producers-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[rgba(15,143,103,0.04)]" />,
});

type HomeMapViewProps = {
  initialFilters?: {
    query?: string;
    city?: string;
    category?: string;
    subcategory?: string;
  };
};

export default function HomeMapView({ initialFilters }: HomeMapViewProps) {
  const [query, setQuery] = useState(() => initialFilters?.query ?? "");
  const [city, setCity] = useState(() => initialFilters?.city ?? "");
  const [category, setCategory] = useState(() => initialFilters?.category ?? "");
  const [subcategory, setSubcategory] = useState(() => initialFilters?.subcategory ?? "");
  const [bbox, setBbox] = useState<string | null>(BARCELONA_PROVINCE_BBOX);
  const [selectedProducerId, setSelectedProducerId] = useState<number | null>(null);

  const debouncedQuery = useDebouncedValue(query, 250);
  const debouncedBbox = useDebouncedValue(bbox, 180);

  const { taxonomy, loadingTaxonomy } = useTaxonomyData();

  const inferredCity = useMemo(() => {
    if (city) {
      return "";
    }

    return inferExactMatch(debouncedQuery, taxonomy.cities);
  }, [city, debouncedQuery, taxonomy.cities]);

  const inferredCategory = useMemo(() => {
    if (category) {
      return "";
    }

    return inferExactMatch(debouncedQuery, taxonomy.categories);
  }, [category, debouncedQuery, taxonomy.categories]);

  const effectiveCity = city || inferredCity;
  const effectiveCategory = category || inferredCategory;

  const effectiveQuery = useMemo(() => {
    const normalizedQuery = normalizeLookup(debouncedQuery);
    if (!normalizedQuery) {
      return "";
    }

    const inferredNormalized = [inferredCity, inferredCategory].filter(Boolean).map(normalizeLookup);
    if (inferredNormalized.includes(normalizedQuery)) {
      return "";
    }

    return debouncedQuery;
  }, [debouncedQuery, inferredCategory, inferredCity]);

  const { results, loading, error } = useProducerResults({
    query: effectiveQuery,
    city: effectiveCity,
    category: effectiveCategory,
    subcategory,
    bbox: debouncedBbox,
    page: 1,
    pageSize: 300,
  });

  const resolvedSelectedProducerId = useMemo(() => {
    if (!selectedProducerId) {
      return null;
    }

    return results.items.some((producer) => producer.id === selectedProducerId)
      ? selectedProducerId
      : null;
  }, [results.items, selectedProducerId]);

  const activeProducer = useMemo(
    () => results.items.find((producer) => producer.id === resolvedSelectedProducerId) ?? null,
    [resolvedSelectedProducerId, results.items],
  );

  const featuredCategories = useMemo(() => taxonomy.categories.slice(0, 8), [taxonomy.categories]);

  const autoAppliedFilters = [
    inferredCity ? `Ciudad: ${inferredCity}` : "",
    inferredCategory ? `Categoría: ${inferredCategory}` : "",
  ].filter(Boolean);

  const listHref = useMemo(
    () =>
      buildProducerFiltersHref("/buscar", {
        query: effectiveQuery,
        city: effectiveCity,
        category: effectiveCategory,
        subcategory,
      }),
    [effectiveCategory, effectiveCity, effectiveQuery, subcategory],
  );

  const onMapBoundsChange = useCallback((nextBbox: string) => {
    setBbox((prev) => (prev === nextBbox ? prev : nextBbox));
  }, []);

  const onCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setSubcategory("");
  }, []);

  const onToggleFeaturedCategory = useCallback(
    (value: string) => {
      const isActive = effectiveCategory === value;
      setCategory(isActive ? "" : value);
      setSubcategory("");
    },
    [effectiveCategory],
  );

  function clearAll() {
    setQuery("");
    setCity("");
    setCategory("");
    setSubcategory("");
    setSelectedProducerId(null);
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
              <button type="button" onClick={() => setQuery("")} className="km0-icon-btn" aria-label="Limpiar búsqueda">
                <IconX />
              </button>
            )}
          </div>

          <div className="km0-topbar-actions">
            <Link href={listHref} className="km0-ghost-btn">
              Ver listado
            </Link>
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
                      onClick={() => onToggleFeaturedCategory(bucket.value)}
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
            <span>{loading ? "Cargando puntos…" : `${results.total} productores`}</span>
            {autoAppliedFilters.length > 0 && <span className="km0-auto-filter">{autoAppliedFilters.join(" · ")}</span>}
          </div>
        </div>
      </header>

      <main className="km0-content">
        <section className="km0-panel km0-map-panel flex flex-col overflow-hidden">
          <div className="km0-panel-section border-b border-[var(--line-soft)]">
            <div className="km0-filter-grid">
              <FilterSelect
                label="Municipio"
                value={city}
                allLabel="Todos"
                options={taxonomy.cities}
                onChange={setCity}
              />

              <FilterSelect
                label="Categoría"
                value={category}
                allLabel="Todas"
                options={taxonomy.categories}
                onChange={onCategoryChange}
              />
            </div>

            <div className="mt-2">
              <FilterSelect
                label="Subcategoría"
                value={subcategory}
                allLabel="Todas"
                options={taxonomy.subcategories}
                onChange={setSubcategory}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[var(--text-soft)]">
              <span>Usa los filtros o mueve el mapa para explorar productores.</span>
              <button type="button" onClick={clearAll} className="km0-link-btn">
                Limpiar filtros
              </button>
            </div>

            {error && <p className="km0-inline-error mt-3">{error}</p>}
          </div>

          <div className="km0-map-frame h-[70dvh] min-h-[540px]">
            <ProducersMap
              producers={results.items}
              selectedProducerId={resolvedSelectedProducerId}
              onSelectProducer={setSelectedProducerId}
              onBoundsChange={onMapBoundsChange}
              className="km0-map-canvas"
            />
            <div className="km0-map-glow" />
            <ActiveProducerOverlay producer={activeProducer} actionLabel="Ver ficha" />
          </div>
        </section>
      </main>
    </div>
  );
}
