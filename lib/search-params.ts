export type QueryParams = Record<string, string | string[] | undefined>;

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

export function readProducerFiltersFromParams(params: QueryParams): {
  query: string;
  city: string;
  category: string;
  subcategory: string;
} {
  return {
    query: getSingleQueryParam(params, "query"),
    city: getSingleQueryParam(params, "city"),
    category: getSingleQueryParam(params, "category"),
    subcategory: getSingleQueryParam(params, "subcategory"),
  };
}
