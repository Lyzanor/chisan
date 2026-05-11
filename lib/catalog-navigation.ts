export type CatalogNavigationContext = {
  municipality?: string;
  category?: string;
  highlight?: string | number;
  lat?: string | number;
  lon?: string | number;
  province?: string;
};

export function readQueryParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const value = params[key];
  if (Array.isArray(value)) {
    return (value[0] ?? "").trim();
  }
  return (value ?? "").trim();
}

function appendParam(params: URLSearchParams, key: string, value?: string | number) {
  if (value === undefined || value === "") {
    return;
  }

  params.set(key, String(value));
}

function buildContextParams(context: CatalogNavigationContext): URLSearchParams {
  const params = new URLSearchParams();

  appendParam(params, "provincia", context.province);
  appendParam(params, "municipio", context.municipality);
  appendParam(params, "categoria", context.category);
  appendParam(params, "destacar", context.highlight);
  appendParam(params, "lat", context.lat);
  appendParam(params, "lon", context.lon);

  return params;
}

export function buildCatalogHref(context: CatalogNavigationContext): string {
  const params = buildContextParams(context);
  const queryString = params.toString();

  return queryString ? `/?${queryString}` : "/";
}

export function buildProducerPathSegment(id: number, slug: string): string {
  return `${id}-${slug}`;
}

export function buildProducerHref(
  producer: { id: number | string; slug: string },
  context: CatalogNavigationContext,
): string {
  const params = buildContextParams(context);
  const queryString = params.toString();
  const path = `/p/${buildProducerPathSegment(Number(producer.id), producer.slug)}`;

  return queryString ? `${path}?${queryString}` : path;
}
