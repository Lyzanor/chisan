export type QueryParams = Record<string, string | string[] | undefined>;
export type ProducerFilters = {
  query: string;
  city: string;
  category: string;
};

export function getSingleQueryParam(
  params: QueryParams,
  key: string,
): string {
  const value = params[key];

  if (Array.isArray(value)) {
    return (value[0] ?? "").trim();
  }

  return (value ?? "").trim();
}

export function readProducerFiltersFromParams(params: QueryParams): ProducerFilters {
  return {
    query: getSingleQueryParam(params, "query"),
    city: getSingleQueryParam(params, "city"),
    category: getSingleQueryParam(params, "category"),
  };
}

export function buildProducerFiltersHref(basePath: string, filters: ProducerFilters): string {
  const params = new URLSearchParams();

  if (filters.query) params.set("query", filters.query);
  if (filters.city) params.set("city", filters.city);
  if (filters.category) params.set("category", filters.category);

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
