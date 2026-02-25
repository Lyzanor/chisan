"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";

import { useProducerResults, useTaxonomyData } from "@/components/home-map/data-hooks";
import FilterSelect from "@/components/home-map/filter-select";
import { inferExactMatch, normalizeLookup, useDebouncedValue } from "@/components/home-map/helpers";
import { IconSearch, IconX } from "@/components/home-map/icons";
import ProducerCard from "@/components/home-map/producer-card";
import { BARCELONA_PROVINCE_BBOX } from "@/lib/barcelona";
import { buildProducerFiltersHref } from "@/lib/search-params";

type SearchListViewProps = {
  initialFilters?: {
    query?: string;
    city?: string;
    category?: string;
  };
};

export default function SearchListView({ initialFilters }: SearchListViewProps) {
  const [query, setQuery] = useState(() => initialFilters?.query ?? "");
  const [city, setCity] = useState(() => initialFilters?.city ?? "");
  const [category, setCategory] = useState(() => initialFilters?.category ?? "");
  const [page, setPage] = useState(1);
  const [selectedProducerId, setSelectedProducerId] = useState<number | null>(null);

  const debouncedQuery = useDebouncedValue(query, 250);
  const { taxonomy } = useTaxonomyData();

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
    const normalizedQuery = normalizeLookup(debouncedQuery);
    if (!normalizedQuery) return "";

    const inferredNormalized = [inferredCity, inferredCategory]
      .filter(Boolean)
      .map(normalizeLookup);

    if (inferredNormalized.includes(normalizedQuery)) {
      return "";
    }

    return debouncedQuery;
  }, [debouncedQuery, inferredCategory, inferredCity]);

  const { results, loading, error } = useProducerResults({
    query: effectiveQuery,
    city: effectiveCity,
    category: effectiveCategory,
    bbox: BARCELONA_PROVINCE_BBOX,
    page,
    pageSize: 40,
  });

  const resolvedSelectedProducerId = useMemo(() => {
    if (!selectedProducerId) {
      return null;
    }

    return results.items.some((producer) => producer.id === selectedProducerId)
      ? selectedProducerId
      : null;
  }, [results.items, selectedProducerId]);

  const paginationSummary = useMemo(() => {
    if (results.total === 0) return "0 resultados";

    const start = (results.page - 1) * results.pageSize + 1;
    const end = Math.min(results.page * results.pageSize, results.total);
    return `${start}–${end} de ${results.total}`;
  }, [results.page, results.pageSize, results.total]);

  const hasPreviousPage = page > 1;
  const hasNextPage = page * results.pageSize < results.total;
  const hasActiveFilters = Boolean(query || city || category);

  const mapHref = useMemo(
    () =>
      buildProducerFiltersHref("/", {
        query: effectiveQuery,
        city: effectiveCity,
        category: effectiveCategory,
      }),
    [effectiveCategory, effectiveCity, effectiveQuery],
  );

  const onCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setPage(1);
  }, []);

  const onQueryChange = useCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, []);

  const onCityChange = useCallback((value: string) => {
    setCity(value);
    setPage(1);
  }, []);

  function clearAll() {
    setQuery("");
    setCity("");
    setCategory("");
    setPage(1);
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
              <p className="km0-brand-subtitle">Buscador de productores</p>
            </span>
          </Link>

          <div className="km0-search-shell" role="search">
            <IconSearch />
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Buscar por productor, categoría o municipio"
              className="km0-search-input"
              aria-label="Buscar productores"
            />
            {query && (
              <button type="button" onClick={() => onQueryChange("")} className="km0-icon-btn" aria-label="Limpiar búsqueda">
                <IconX />
              </button>
            )}
          </div>

          <div className="km0-topbar-actions">
            <Link href={mapHref} className="km0-ghost-btn">
              Ver mapa
            </Link>
          </div>
        </div>
      </header>

      <main className="km0-content">
        <section className="km0-panel km0-list-panel mx-auto flex min-h-[72dvh] w-full max-w-[1100px] flex-col">
          <div className="km0-panel-section">
            <p className="km0-panel-title">Filtros</p>
            <div className="km0-filter-grid">
              <FilterSelect
                label="Municipio"
                value={city}
                allLabel="Todos"
                options={taxonomy.cities}
                onChange={onCityChange}
              />
              <FilterSelect
                label="Categoría"
                value={category}
                allLabel="Todas"
                options={taxonomy.categories}
                onChange={onCategoryChange}
              />
            </div>
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
                <p>Sin resultados con estos filtros.</p>
                <p>Prueba con otra categoría o municipio.</p>
              </div>
            ) : (
              <div className="km0-results-stack">
                {results.items.map((producer) => (
                  <ProducerCard
                    key={producer.id}
                    producer={producer}
                    selected={resolvedSelectedProducerId === producer.id}
                    onSelect={setSelectedProducerId}
                  />
                ))}
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
        </section>
      </main>
    </div>
  );
}
