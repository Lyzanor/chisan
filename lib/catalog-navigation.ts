export type CatalogNavigationContext = {
  country?: string;
  area?: string;
  municipality?: string;
  category?: string;
  highlight?: string | number;
  lat?: string | number;
  lon?: string | number;
};

type ProducerNavigationContext = CatalogNavigationContext & {
  country: string;
  area: string;
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

  appendParam(params, "municipality", context.municipality);
  appendParam(params, "category", context.category);
  appendParam(params, "highlight", context.highlight);
  appendParam(params, "lat", context.lat);
  appendParam(params, "lon", context.lon);

  return params;
}

export function buildCatalogHref(context: CatalogNavigationContext): string {
  const params = buildContextParams(context);
  const queryString = params.toString();
  const country = context.country?.trim();
  const area = context.area?.trim();
  const path = country
    ? area
      ? `/${encodeURIComponent(country)}/${encodeURIComponent(area)}`
      : `/${encodeURIComponent(country)}`
    : "/";

  return queryString ? `${path}?${queryString}` : path;
}

export function buildProducerPathSegment(slug: string): string {
  return slug;
}

export function buildProducerHref(
  producer: { slug: string },
  context: ProducerNavigationContext,
): string {
  const params = buildContextParams(context);
  const queryString = params.toString();
  const path = `/${encodeURIComponent(context.country)}/${encodeURIComponent(context.area)}/${buildProducerPathSegment(producer.slug)}`;

  return queryString ? `${path}?${queryString}` : path;
}
