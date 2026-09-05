import "server-only";
import { isWithinRadius } from "../location/radius-search";
import { createHash } from "node:crypto";
import type { z } from "zod";

import categories from "../../data/reference/categories.json";
import { isProducerOwnershipVerified } from "../accounts/producer-ownership";
import { buildProducerHref } from "../catalog-navigation";
import { normalizeCatalogSearch } from "../catalog-search";
import {
  type ProducerContent,
  hasProducerContent,
} from "../catalog/content-schema";
import {
  loadCountryTranslations,
  localizeProducerFields,
} from "../catalog/localization";
import {
  loadPublicExpandedContent,
  publicHighlightedLinks,
} from "../catalog/public-expanded";
import { SALES_CHANNEL_VALUES } from "../catalog/producer-schema";
import {
  findArea,
  findPublishedCountry,
  findProducerById,
  listPublishedCountries,
  loadCsvRows,
  type AreaLocation,
  type Country,
  type LocatedProducerCsvRow,
  type ProducerCsvRow,
} from "../csv-catalog";
import { getCategoryLabel } from "../i18n/categories";
import { buildCatalogScope } from "../i18n/catalog-scope";
import type { Locale } from "../i18n/locales";
import { SITE_ORIGIN } from "../site";
import {
  CATALOG_API_PATH,
  CATALOG_SCHEMA_VERSION,
  type PublicProducer,
  type PublicProducerBase,
  type searchInputSchema,
  type producerInputSchema,
} from "./catalog-schema";

export class CatalogRequestError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const absent = (value?: string) => value?.trim() || null;
function prose(
  fields: Readonly<Record<string, string>>,
  key: string,
  localeKey: string,
) {
  const text = absent(fields[key]);
  const locale = absent(fields[localeKey]);
  return text && locale ? { text, locale } : null;
}

/** An explicit public allowlist. Adding a CSV column cannot expose it to agents. */
export function publicProducerBase(
  row: ProducerCsvRow,
  country: Country,
  area: AreaLocation,
  locale: Locale,
): PublicProducerBase {
  const region = country.regions.find(({ slug }) => slug === area.regionSlug)!;
  const profilePath = buildProducerHref(row, {
    area: area.slug,
    scope: buildCatalogScope(country, locale),
  });
  const canonicalPath = buildProducerHref(row, {
    area: area.slug,
    scope: buildCatalogScope(country),
  });
  const fields = row.fields;
  return {
    country: country.slug,
    producer_id: row.producerId,
    slug: row.slug,
    canonical_url: `${SITE_ORIGIN}${canonicalPath}`,
    url: `${SITE_ORIGIN}${profilePath}`,
    api_url: `${SITE_ORIGIN}${CATALOG_API_PATH}/producers/${country.slug}/${row.producerId}?locale=${locale}`,
    locale,
    name: row.name,
    municipality: row.city,
    region: { slug: region.slug, name: region.labels[locale] ?? region.label },
    area: { slug: area.slug, name: area.labels[locale] ?? area.label },
    categories: row.categories.map((token) => ({
      token,
      label: getCategoryLabel(token, locale),
    })),
    featured_products: absent(row.featuredProducts),
    description: prose(fields, "descripcion", "descripcion_locale"),
    address: absent(fields.direccion),
    coordinates:
      row.latitude !== null && row.longitude !== null
        ? { latitude: row.latitude, longitude: row.longitude }
        : null,
    image_url:
      row.imageSrc === "/productores/generica.webp"
        ? null
        : `${SITE_ORIGIN}${row.imageSrc}`,
    contact: {
      website: absent(fields.web),
      email: absent(fields.correo),
      phone: absent(fields.telefono),
      facebook: absent(fields.Facebook),
      instagram: absent(fields.Instagram),
      maps: absent(fields["Google Maps"]),
    },
    hours_text: absent(fields.horario),
    online_sales: fields["Venta online"] as PublicProducerBase["online_sales"],
    sales_channels: SALES_CHANNEL_VALUES.filter((channel) =>
      (fields["Canal de venta"] ?? "").split("|").includes(channel),
    ),
  };
}

export function publicExpanded(
  fields: Readonly<Record<string, string>>,
  content: ProducerContent | null,
): PublicProducer["expanded"] {
  if (!content) return null;
  const highlighted = publicHighlightedLinks(fields, content.links).map(
    ({ href }) => href,
  );
  const expanded = {
    video_url: absent(fields.video),
    guided_visits: (["sí", "no"].includes(fields["visitas guiadas"])
      ? fields["visitas guiadas"]
      : null) as "sí" | "no" | null,
    community_message: prose(
      fields,
      "mensaje a la comunidad",
      "mensaje_comunidad_locale",
    ),
    behind_producer: prose(
      fields,
      "quien hay detras",
      "quien_hay_detras_locale",
    ),
    history: prose(fields, "historia", "historia_locale"),
    last_approved_change: absent(fields["fecha ultimo cambio"]),
    highlighted_links: highlighted,
    // Deliberately exclude translation history and its source hashes.
    products: content.products.map(
      ({ id, name, description, locale, media_ids, link_ids }) => ({
        id,
        name,
        description,
        locale,
        media_ids,
        link_ids,
      }),
    ),
    gallery: content.gallery.map(
      ({ id, src, alt, caption, locale, width, height, credit }) => ({
        id,
        src,
        alt,
        caption,
        locale,
        width,
        height,
        credit,
      }),
    ),
    links: content.links.map(({ id, label, url, locale }) => ({
      id,
      label,
      url,
      locale,
    })),
  };
  return hasProducerContent(content) ||
    highlighted.length ||
    expanded.video_url ||
    expanded.guided_visits ||
    expanded.community_message ||
    expanded.behind_producer ||
    expanded.history ||
    expanded.last_approved_change
    ? expanded
    : null;
}

export function describePublicCatalog() {
  return {
    schema_version: CATALOG_SCHEMA_VERSION,
    countries: listPublishedCountries().map((country) => ({
      slug: country.slug,
      name: country.label,
      default_locale: country.defaultLocale,
      regions: country.regions.map((region) => ({
        slug: region.slug,
        name: region.label,
        areas: region.areas.map((area) => ({
          slug: area.slug,
          name: area.label,
          locales: area.publishedLocales,
        })),
      })),
    })),
    categories: categories.categories,
  };
}

// Immutable deployed files are cached per supported language, never per query.
// Account-dependent visibility is always resolved separately on detail reads.
const indexes = new Map<
  string,
  Promise<{
    revision: string;
    entries: { producer: PublicProducerBase; search: string }[];
  }>
>();
async function publicIndex(locale?: Locale) {
  const key = locale ?? "default";
  const existing = indexes.get(key);
  if (existing) return existing;
  const pending = (async () => {
    const countries = listPublishedCountries();
    const batches = await Promise.all(
      countries.map(async (country) => {
        const language = locale ?? country.defaultLocale;
        const translations = await loadCountryTranslations(
          country.slug,
          language,
        );
        return Promise.all(
          country.regions.flatMap((region) =>
            region.areas
              .filter((area) => area.publishedLocales.includes(language))
              .map(async (area) => {
                const rows = localizeProducerFields(
                  await loadCsvRows(country.slug, area.slug),
                  language,
                  translations,
                );
                return rows.map((row) =>
                  publicProducerBase(
                    row,
                    country,
                    {
                      ...area,
                      countrySlug: country.slug,
                      regionSlug: region.slug,
                    },
                    language,
                  ),
                );
              }),
          ),
        );
      }),
    );
    const producers = batches
      .flat(2)
      .sort(
        (a, b) =>
          a.country.localeCompare(b.country) || a.producer_id - b.producer_id,
      );
    return {
      revision: createHash("sha256")
        .update(JSON.stringify(producers))
        .digest("hex"),
      entries: producers.map((producer) => ({
        producer,
        search: normalizeCatalogSearch(
          [
            producer.name,
            producer.municipality,
            producer.featured_products ?? "",
            producer.description?.text ?? "",
            ...producer.categories.flatMap(({ token, label }) => [
              token,
              label,
            ]),
          ].join(" "),
        ),
      })),
    };
  })();
  indexes.set(key, pending);
  void pending.catch(() => {
    if (indexes.get(key) === pending) indexes.delete(key);
  });
  return pending;
}

export async function searchPublicProducers(
  input: z.infer<typeof searchInputSchema>,
) {
  const spatialValues = [input.lat, input.lon, input.radius_km];
  if (spatialValues.some((value) => value !== undefined) && !spatialValues.every((value) => value !== undefined)) {
    throw new CatalogRequestError(400, "invalid_query", "Supply lat, lon and radius_km together.");
  }
  const radius = input.lat !== undefined && input.lon !== undefined && input.radius_km !== undefined
    ? { latitude: input.lat, longitude: input.lon, radiusKm: input.radius_km }
    : null;
  const country = input.country ? findPublishedCountry(input.country) : null;
  if (input.country && !country)
    throw new CatalogRequestError(
      404,
      "not_found",
      "Published country not found.",
    );
  if ((input.region || input.area) && !country)
    throw new CatalogRequestError(
      400,
      "invalid_query",
      "Region and area filters require country.",
    );
  if (
    input.region &&
    !country?.regions.some(({ slug }) => slug === input.region)
  )
    throw new CatalogRequestError(
      404,
      "not_found",
      "Published region not found.",
    );
  const area =
    country && input.area ? findArea(country.slug, input.area) : null;
  if (
    input.area &&
    (!area ||
      area.slug !== input.area ||
      (input.region && area.regionSlug !== input.region))
  )
    throw new CatalogRequestError(
      404,
      "not_found",
      "Published area not found in the requested scope.",
    );
  if (area && input.locale && !area.publishedLocales.includes(input.locale))
    throw new CatalogRequestError(
      404,
      "not_found",
      "Language not published in this area.",
    );
  if (input.category && !categories.categories.includes(input.category))
    throw new CatalogRequestError(
      400,
      "invalid_query",
      "Unknown category. Read the catalog's category tokens.",
    );
  const index = await publicIndex(input.locale);
  if (input.revision && input.revision !== index.revision)
    throw new CatalogRequestError(
      409,
      "catalog_changed",
      "Catalog revision changed. Restart pagination at offset 0 without revision.",
    );
  const terms = normalizeCatalogSearch(input.q ?? "")
    .split(" ")
    .filter(Boolean);
  if (input.q && !terms.length)
    throw new CatalogRequestError(
      400,
      "invalid_query",
      "Search requires at least one letter or number.",
    );
  const results = index.entries.filter(
    ({ producer: p, search }) =>
      (!radius || (p.coordinates !== null && isWithinRadius(p.coordinates, radius))) &&
      (!input.country || p.country === input.country) &&
      (!input.region || p.region.slug === input.region) &&
      (!input.area || p.area.slug === input.area) &&
      (!input.category ||
        p.categories.some(({ token }) => token === input.category)) &&
      (!input.municipality ||
        normalizeCatalogSearch(p.municipality) ===
          normalizeCatalogSearch(input.municipality)) &&
      (!input.online_sales || p.online_sales === input.online_sales) &&
      terms.every((term) => search.includes(term)),
  );
  const nextOffset = input.offset + input.limit;
  const query = new URLSearchParams(
    Object.entries({
      ...input,
      revision: index.revision,
      offset: nextOffset,
    }).map(([key, value]) => [key, String(value)]),
  );
  return {
    schema_version: CATALOG_SCHEMA_VERSION,
    revision: index.revision,
    total: results.length,
    limit: input.limit,
    offset: input.offset,
    next:
      nextOffset < results.length
        ? `${SITE_ORIGIN}${CATALOG_API_PATH}/producers?${query}`
        : null,
    producers: results
      .slice(input.offset, nextOffset)
      .map(({ producer }) => producer),
  };
}

export async function getPublicProducer(
  input: z.infer<typeof producerInputSchema>,
) {
  const country = findPublishedCountry(input.country);
  const row: LocatedProducerCsvRow | null = country
    ? await findProducerById(country.slug, input.producer_id)
    : null;
  const area = row ? findArea(row.country, row.area) : null;
  const locale = input.locale ?? country?.defaultLocale;
  if (
    !country ||
    !row ||
    !area ||
    !locale ||
    !area.publishedLocales.includes(locale)
  )
    throw new CatalogRequestError(
      404,
      "not_found",
      "Public producer or language not found.",
    );
  const [translations, content, ownership] = await Promise.all([
    loadCountryTranslations(country.slug, locale),
    loadPublicExpandedContent(country.slug, row.producerId, locale),
    isProducerOwnershipVerified(country.slug, row.producerId),
  ]);
  const [localized] = localizeProducerFields([row], locale, translations);
  return {
    schema_version: CATALOG_SCHEMA_VERSION,
    producer: {
      ...publicProducerBase(localized, country, area, locale),
      ownership: ownership ? ("confirmed" as const) : ("not_asserted" as const),
      expanded: publicExpanded(localized.fields, content),
    },
  };
}
