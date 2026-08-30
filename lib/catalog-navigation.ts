import {
  buildCatalogScope,
  isCatalogScopeSegment,
  type CatalogCountryPolicy,
  type CatalogLocalePolicy,
  type CatalogScope,
} from "./i18n/catalog-scope";
import type { Locale } from "./i18n/locales";

/**
 * Home-page anchor for the neutral country listing. Following it is the
 * explicit request to choose an area manually, so the home page offers the
 * listing instead of resuming a saved location area.
 */
export const MANUAL_AREA_SELECTION_ID = "choose-country";
export const MANUAL_AREA_SELECTION_HASH = `#${MANUAL_AREA_SELECTION_ID}` as const;
export const MANUAL_AREA_SELECTION_HREF = `/${MANUAL_AREA_SELECTION_HASH}` as const;

export type CatalogNavigationScope = Pick<CatalogScope, "country" | "pathPrefix">;

export type CatalogNavigationContext = {
  scope?: CatalogNavigationScope;
  country?: string;
  area?: string;
  category?: string;
  highlight?: string | number;
};

type ProducerNavigationContext = CatalogNavigationContext & {
  area: string;
};

export type ApplicationProducerNavigationTarget = {
  slug: string;
  country: string;
  area: string;
};

export type ApplicationProducerNavigationContext = {
  country: CatalogCountryPolicy;
  localePolicy: Pick<CatalogLocalePolicy, "publishedLocales"> & { slug: string };
  explicitLocale?: Locale | null;
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

  appendParam(params, "category", context.category);
  appendParam(params, "highlight", context.highlight);

  return params;
}

export function readCatalogQueryContext(
  params: Record<string, string | string[] | undefined>,
): Pick<CatalogNavigationContext, "category" | "highlight"> {
  return {
    category: readQueryParam(params, "category"),
    highlight: readQueryParam(params, "highlight"),
  };
}

function catalogPathPrefix(context: CatalogNavigationContext): string {
  const country = context.country?.trim();

  if (context.scope) {
    if (country && country !== context.scope.country) {
      throw new Error("Catalog navigation country does not match its resolved scope.");
    }
    const segment = context.scope.pathPrefix.slice(1);
    if (!context.scope.pathPrefix.startsWith("/") || !isCatalogScopeSegment(segment)) {
      throw new Error("Catalog navigation scope has an invalid path prefix.");
    }
    if (
      segment !== context.scope.country &&
      !segment.endsWith(`-${context.scope.country}`)
    ) {
      throw new Error("Catalog navigation scope has an inconsistent country.");
    }
    return context.scope.pathPrefix;
  }

  return country ? `/${encodeURIComponent(country)}` : "/";
}

export function buildCatalogHref(context: CatalogNavigationContext): string {
  const params = buildContextParams(context);
  const queryString = params.toString();
  const area = context.area?.trim();
  const prefix = catalogPathPrefix(context);
  if (area && prefix === "/") {
    throw new Error("An area link requires a catalog country or scope.");
  }
  const path = area ? `${prefix}/${encodeURIComponent(area)}` : prefix;

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
  const prefix = catalogPathPrefix(context);
  if (prefix === "/") {
    throw new Error("A producer link requires a catalog country or scope.");
  }
  const path = `${prefix}/${encodeURIComponent(context.area)}/${buildProducerPathSegment(producer.slug)}`;

  return queryString ? `${path}?${queryString}` : path;
}

// Private application pages may honor only the locale the user explicitly
// selected, and only when that locale is published for this producer's area.
// Every other case deliberately returns the country's short default route.
export function buildApplicationProducerHref(
  producer: ApplicationProducerNavigationTarget,
  context: ApplicationProducerNavigationContext,
): string {
  if (producer.country !== context.country.slug) {
    throw new Error("Application producer country does not match its catalog policy.");
  }
  if (producer.area !== context.localePolicy.slug) {
    throw new Error("Application producer area does not match its locale policy.");
  }
  if (!context.localePolicy.publishedLocales.includes(context.country.defaultLocale)) {
    throw new Error(
      `Application producer area must publish the country default locale '${context.country.defaultLocale}'.`,
    );
  }

  const locale =
    context.explicitLocale &&
    context.localePolicy.publishedLocales.includes(context.explicitLocale)
      ? context.explicitLocale
      : context.country.defaultLocale;

  return buildProducerHref(producer, {
    scope: buildCatalogScope(context.country, locale),
    area: producer.area,
  });
}
