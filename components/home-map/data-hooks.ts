import { useEffect, useState } from "react";

import type { ProducersApiResponse, TaxonomyResponse } from "@/lib/types";

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

type UseProducerResultsArgs = {
  query: string;
  city: string;
  category: string;
  subcategory?: string;
  bbox: string | null;
  page: number;
  pageSize?: number;
};

export function useTaxonomyData() {
  const [taxonomy, setTaxonomy] = useState<TaxonomyResponse>(EMPTY_TAXONOMY);
  const [loadingTaxonomy, setLoadingTaxonomy] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTaxonomy() {
      setLoadingTaxonomy(true);
      try {
        const res = await fetch("/api/taxonomy", {
          signal: controller.signal,
          cache: "force-cache",
        });

        if (!res.ok) {
          throw new Error("taxonomy-failed");
        }

        const data = (await res.json()) as TaxonomyResponse;
        setTaxonomy(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
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

  return { taxonomy, loadingTaxonomy };
}

export function useProducerResults({
  query,
  city,
  category,
  subcategory,
  bbox,
  page,
  pageSize,
}: UseProducerResultsArgs) {
  const [results, setResults] = useState<ProducersApiResponse>(EMPTY_RESULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadResults() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (city) params.set("city", city);
      if (category) params.set("category", category);
      if (subcategory) params.set("subcategory", subcategory);
      if (bbox) params.set("bbox", bbox);
      params.set("page", String(page));
      if (pageSize) params.set("pageSize", String(pageSize));

      try {
        const res = await fetch(`/api/producers?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`producers-failed:${res.status}`);
        }

        setResults((await res.json()) as ProducersApiResponse);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          console.error(loadError);
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
  }, [bbox, category, city, page, pageSize, query, subcategory]);

  return { results, loading, error };
}
