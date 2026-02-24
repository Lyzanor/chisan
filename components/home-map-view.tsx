"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { BARCELONA_PROVINCE_BBOX } from "@/lib/barcelona";
import type { ProducerListItem, ProducersApiResponse, TaxonomyResponse } from "@/lib/types";

const ProducersMap = dynamic(() => import("@/components/producers-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100" />,
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

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg className="h-4 w-4 flex-none text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

// ── Main component ────────────────────────────────────────────────────────────

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

  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const debouncedQuery = useDebouncedValue(query, 250);
  const debouncedBbox = useDebouncedValue(bbox, 180);

  // Load taxonomy once
  useEffect(() => {
    const controller = new AbortController();
    async function loadTaxonomy() {
      setLoadingTaxonomy(true);
      try {
        const res = await fetch("/api/taxonomy", { signal: controller.signal, cache: "force-cache" });
        if (!res.ok) throw new Error("taxonomy-failed");
        const data = (await res.json()) as TaxonomyResponse;
        setTaxonomy(data);
      } catch (err) {
        if (!controller.signal.aborted) console.error(err);
      } finally {
        if (!controller.signal.aborted) setLoadingTaxonomy(false);
      }
    }
    loadTaxonomy();
    return () => controller.abort();
  }, []);

  // Smart inference
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
    const inferredNorms = [inferredCity, inferredCategory].filter(Boolean).map(normalizeLookup);
    if (inferredNorms.includes(norm)) return "";
    return debouncedQuery;
  }, [debouncedQuery, inferredCategory, inferredCity]);

  const featuredCategories = useMemo(() => taxonomy.categories.slice(0, 9), [taxonomy.categories]);

  useEffect(() => { setPage(1); }, [debouncedBbox, effectiveCategory, effectiveCity, effectiveQuery, subcategory]);

  // Load producers
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
        const res = await fetch(`/api/producers?${params.toString()}`, { signal: controller.signal, cache: "no-store" });
        if (!res.ok) throw new Error(`producers-failed:${res.status}`);
        setResults((await res.json()) as ProducersApiResponse);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          setError("No se pudieron cargar los productores.");
          setResults(EMPTY_RESULTS);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadResults();
    return () => controller.abort();
  }, [debouncedBbox, effectiveCategory, effectiveCity, effectiveQuery, page, subcategory]);

  // Scroll card into view when selected
  useEffect(() => {
    if (!selectedProducerId) return;
    cardRefs.current[selectedProducerId]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedProducerId]);

  // Clear selected if not in results
  useEffect(() => {
    if (!selectedProducerId) return;
    if (!results.items.some((p) => p.id === selectedProducerId)) setSelectedProducerId(null);
  }, [results.items, selectedProducerId]);

  const onMapBoundsChange = useCallback((nextBbox: string) => {
    setBbox((prev) => (prev === nextBbox ? prev : nextBbox));
  }, []);

  const onSelectProducer = useCallback((id: number) => setSelectedProducerId(id), []);

  const paginationSummary = useMemo(() => {
    if (results.total === 0) return "0 resultados";
    const start = (results.page - 1) * results.pageSize + 1;
    const end = Math.min(results.page * results.pageSize, results.total);
    return `${start}–${end} de ${results.total}`;
  }, [results.page, results.pageSize, results.total]);

  const hasPreviousPage = page > 1;
  const hasNextPage = page * results.pageSize < results.total;
  const hasActiveFilters = !!(query || city || category || subcategory);

  const autoAppliedFilters = [
    inferredCity ? `Ciudad: ${inferredCity}` : "",
    inferredCategory ? `Categoría: ${inferredCategory}` : "",
  ].filter(Boolean);

  function clearAll() {
    setQuery(""); setCity(""); setCategory(""); setSubcategory("");
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* ══════════════════════════════════════════
          SIDEBAR — desktop only
      ══════════════════════════════════════════ */}
      <aside className="hidden lg:flex lg:flex-col w-80 flex-none border-r border-gray-100 bg-white">

        {/* Brand header */}
        <div className="flex-none border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-emerald-600">
              <span className="text-[11px] font-bold text-white tracking-tight">K0</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 leading-tight">Productores Km0</h1>
              <p className="text-[11px] text-gray-400">Provincia de Barcelona</p>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="flex-none px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 transition-colors focus-within:border-emerald-400 focus-within:bg-white">
            <IconSearch />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Productor, ciudad, categoría…"
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="flex-none text-gray-300 hover:text-gray-500 transition-colors">
                <IconX />
              </button>
            )}
          </div>
        </div>

        {/* Filter dropdowns */}
        <div className="flex-none space-y-2 px-4 pb-3">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs text-gray-700 outline-none transition-colors focus:border-emerald-400 focus:bg-white"
            >
              <option value="">Todas las ciudades</option>
              {taxonomy.cities.map((b) => (
                <option key={b.value} value={b.value}>{b.value} ({b.count})</option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setSubcategory(""); }}
              className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs text-gray-700 outline-none transition-colors focus:border-emerald-400 focus:bg-white"
            >
              <option value="">Todas las categorías</option>
              {taxonomy.categories.map((b) => (
                <option key={b.value} value={b.value}>{b.value} ({b.count})</option>
              ))}
            </select>
          </div>

          {taxonomy.subcategories.length > 0 && (
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs text-gray-700 outline-none transition-colors focus:border-emerald-400 focus:bg-white"
            >
              <option value="">Todas las subcategorías</option>
              {taxonomy.subcategories.map((b) => (
                <option key={b.value} value={b.value}>{b.value} ({b.count})</option>
              ))}
            </select>
          )}

          {/* Category quick chips */}
          {!loadingTaxonomy && featuredCategories.length > 0 && (
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
              {featuredCategories.map((b) => {
                const active = effectiveCategory === b.value;
                return (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => { setCategory(active ? "" : b.value); setSubcategory(""); }}
                    className={`flex-none rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-700"
                    }`}
                  >
                    {b.value}
                  </button>
                );
              })}
            </div>
          )}

          {autoAppliedFilters.length > 0 && (
            <p className="text-xs text-emerald-600">{autoAppliedFilters.join(" · ")}</p>
          )}
        </div>

        {/* Results bar */}
        <div className="flex-none flex items-center justify-between border-t border-gray-100 px-4 py-2.5">
          <span className="text-xs text-gray-400">
            {loading ? "Cargando…" : `${results.total} productores`}
          </span>
          {hasActiveFilters && (
            <button type="button" onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              Limpiar filtros
            </button>
          )}
        </div>

        {error && (
          <p className="mx-4 mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
        )}

        {/* Producer list */}
        <div className="flex-1 overflow-y-auto">
          {!loading && results.items.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-gray-400">Sin resultados</p>
              <p className="mt-1 text-xs text-gray-300">Prueba con otros filtros o amplía el mapa</p>
            </div>
          )}

          {results.items.map((producer) => {
            const isSelected = selectedProducerId === producer.id;
            return (
              <div
                key={producer.id}
                ref={(node) => { cardRefs.current[producer.id] = node; }}
                className={`group flex items-start gap-2 border-b border-gray-100 px-4 py-3 transition-colors ${
                  isSelected ? "bg-emerald-50" : "hover:bg-gray-50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedProducerId(producer.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className={`truncate text-sm font-medium leading-snug ${isSelected ? "text-emerald-800" : "text-gray-900"}`}>
                    {producer.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {producer.city ?? "Sin ciudad"}
                    {producer.category ? ` · ${producer.category}` : ""}
                  </p>
                  {producer.address && (
                    <p className="mt-0.5 truncate text-xs text-gray-400">{producer.address}</p>
                  )}
                </button>

                <Link
                  href={`/p/${producer.id}`}
                  title="Ver ficha"
                  className={`mt-0.5 flex-none transition-colors ${
                    isSelected ? "text-emerald-500" : "text-gray-300 group-hover:text-emerald-500"
                  }`}
                >
                  <IconChevronRight />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex-none flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!hasPreviousPage || loading}
            className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Anterior
          </button>
          <span className="text-xs text-gray-400">{loading ? "…" : paginationSummary}</span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNextPage || loading}
            className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          MAP + MOBILE UI
      ══════════════════════════════════════════ */}
      <div className="relative flex-1 overflow-hidden">
        <ProducersMap
          producers={results.items as ProducerListItem[]}
          selectedProducerId={selectedProducerId}
          onSelectProducer={onSelectProducer}
          onBoundsChange={onMapBoundsChange}
          className="h-full w-full"
        />

        {/* Mobile: floating search */}
        <div className="absolute left-3 right-3 top-3 z-[1000] lg:hidden">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-lg">
            <IconSearch />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productor, ciudad…"
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
            {hasActiveFilters && (
              <button type="button" onClick={clearAll} className="flex-none text-gray-300 hover:text-gray-500">
                <IconX />
              </button>
            )}
          </div>
        </div>

        {/* Mobile: bottom panel */}
        <div className="absolute bottom-0 left-0 right-0 z-[900] lg:hidden">
          <div className="rounded-t-2xl border-t border-gray-100 bg-white shadow-[0_-2px_24px_rgba(0,0,0,0.08)]">
            <div className="flex justify-center pb-1 pt-3">
              <div className="h-1 w-8 rounded-full bg-gray-200" />
            </div>

            {/* Mobile filter row */}
            <div className="grid grid-cols-2 gap-2 px-4 pb-2">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs text-gray-700 outline-none"
              >
                <option value="">Todas las ciudades</option>
                {taxonomy.cities.map((b) => (
                  <option key={b.value} value={b.value}>{b.value}</option>
                ))}
              </select>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setSubcategory(""); }}
                className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs text-gray-700 outline-none"
              >
                <option value="">Todas las categorías</option>
                {taxonomy.categories.map((b) => (
                  <option key={b.value} value={b.value}>{b.value}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2">
              <span className="text-xs text-gray-400">
                {loading ? "Cargando…" : `${results.total} productores`}
              </span>
              {hasActiveFilters && (
                <button type="button" onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-700">
                  Limpiar
                </button>
              )}
            </div>

            <div className="max-h-52 overflow-y-auto">
              {!loading && results.items.length === 0 && (
                <p className="px-4 py-4 text-center text-xs text-gray-400">Sin resultados</p>
              )}
              {results.items.slice(0, 25).map((producer) => {
                const isSelected = selectedProducerId === producer.id;
                return (
                  <div
                    key={producer.id}
                    className={`flex items-center gap-3 border-b border-gray-100 px-4 py-2.5 transition-colors ${
                      isSelected ? "bg-emerald-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedProducerId(producer.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-sm font-medium text-gray-900">{producer.name}</p>
                      <p className="truncate text-xs text-gray-500">
                        {producer.city ?? "Sin ciudad"}
                        {producer.category ? ` · ${producer.category}` : ""}
                      </p>
                    </button>
                    <Link
                      href={`/p/${producer.id}`}
                      className="flex-none text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Ver →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
