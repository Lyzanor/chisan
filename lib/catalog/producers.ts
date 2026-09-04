import { readFile } from "node:fs/promises";
import { ONLINE_SALES_VALUES as onlineSalesValues } from "./producer-schema";
import {
  findArea,
  findCountry,
  listCountries,
  normalizeAreaSlug,
  resolveAreaCsvPath,
  type Country,
} from "./registry";
function areaRegistryKey(country: string, area: string): string {
  return `${country}/${area}`;
}

import { parse } from "csv-parse/sync";

import categoriesRegistry from "@/data/reference/categories.json";

import { type Locale } from "../i18n/locales";
import {
  indexProducerTranslations,
  hasCurrentProducerProse,
  loadCountryTranslations,
  localizeProducerFields,
} from "./localization";

type RawCsvRow = Record<string, string | undefined>;

type ProducerCsvLocation = Readonly<{
  country: string;
  region: string;
  area: string;
}>;

export type ProducerCsvRow = {
  producerId: number;
  slug: string;
  name: string;
  city: string;
  category: string;
  additionalCategories: string[];
  categories: string[];
  featuredProducts: string;
  imageSrc: string;
  latitude: number | null;
  longitude: number | null;
  fields: Record<string, string>;
};

export type ProducerIdentity = {
  country: string;
  producerId: number;
};

export type LocatedProducerCsvRow = ProducerCsvRow & {
  country: string;
  region: string;
  area: string;
};

export type ProducerMapPoint = {
  slug: string;
  name: string;
  city: string;
  category: string;
  categories: string[];
  latitude: number;
  longitude: number;
};

export type MunicipalitySummary = {
  name: string;
  count: number;
};

const DEFAULT_PRODUCER_IMAGE_SRC = "/productores/generica.webp";
const ONLINE_SALES_COLUMN = "Venta online";
const ONLINE_SALES_VALUES = new Set<string>(onlineSalesValues);
const ADDITIONAL_CATEGORIES_COLUMN = "categorias adicionales";
const PRODUCER_ID_COLUMN = "producer_id";
const CATEGORY_SEPARATOR = "|";
const PRODUCER_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function cleanCell(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifySegment(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/ł/g, "l")
    .replace(/ð/g, "d")
    .replace(/þ/g, "th")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

const RESERVED_PRODUCER_SLUGS = new Set(
  categoriesRegistry.categories.map(slugifySegment),
);

function readSlug(fields: Record<string, string>, rowLabel: string): string {
  const slug = fields.slug || "";
  if (!PRODUCER_SLUG_PATTERN.test(slug)) {
    throw new Error(
      `${rowLabel}: slug must be non-empty lowercase ASCII kebab-case. Run check:csv for details.`,
    );
  }
  if (RESERVED_PRODUCER_SLUGS.has(slug)) {
    throw new Error(
      `${rowLabel}: slug '${slug}' is reserved for a category route. Run check:csv for details.`,
    );
  }
  return slug;
}

function readProducerId(fields: Record<string, string>): number {
  const value = cleanCell(fields[PRODUCER_ID_COLUMN]);
  const parsed = Number.parseInt(value, 10);
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(parsed)) {
    const rowLabel = fields.slug || fields.nombre || "unknown row";
    throw new Error(
      `Invalid producer_id for '${rowLabel}'. Run check:csv for details.`,
    );
  }
  return parsed;
}

function readRequiredCatalogField(
  fields: Record<string, string>,
  column: string,
  rowLabel: string,
): string {
  const value = fields[column] || "";
  if (!value) {
    throw new Error(
      `${rowLabel}: '${column}' is required. Run check:csv for details.`,
    );
  }
  return value;
}

function readFeaturedProducts(fields: Record<string, string>): string {
  return fields["productos estrella"] || "";
}

function readAdditionalCategories(fields: Record<string, string>): string[] {
  const rawValue = fields[ADDITIONAL_CATEGORIES_COLUMN] || "";
  const seen = new Set<string>();

  return rawValue
    .split(CATEGORY_SEPARATOR)
    .map(cleanCell)
    .filter((category) => {
      if (!category || seen.has(category)) {
        return false;
      }
      seen.add(category);
      return true;
    });
}

function readImageSrc(fields: Record<string, string>): string {
  const imagePath = findFieldValue(fields, ["imagen"]);

  if (!imagePath) {
    return DEFAULT_PRODUCER_IMAGE_SRC;
  }

  return imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath.replace(/^\/+/, "")}`;
}

function normalizeFieldKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function findFieldValue(
  fields: Record<string, string>,
  candidateKeys: readonly string[],
): string {
  const normalizedCandidates = new Set(candidateKeys.map(normalizeFieldKey));

  for (const [field, value] of Object.entries(fields)) {
    if (normalizedCandidates.has(normalizeFieldKey(field))) {
      return value;
    }
  }

  return "";
}

function parseCoordinate(
  rawValue: string,
  maxAbs: number,
  integerDigits: readonly number[],
): number | null {
  const cleaned = rawValue.trim();
  if (!cleaned) {
    return null;
  }

  const normalized = cleaned.replace(",", ".");
  const parsed = Number.parseFloat(normalized);

  const digits = cleaned.replace(/[^\d]/g, "");
  const sign = cleaned.startsWith("-") ? -1 : 1;
  const looksLikeGroupedCoordinate =
    /^-?\d{1,3}(?:[.,]\d{3})+(?:[.,]\d+)?$/.test(cleaned);

  if (!looksLikeGroupedCoordinate || !digits) {
    return Number.isFinite(parsed) ? parsed : null;
  }

  for (const wholeDigits of integerDigits) {
    if (digits.length <= wholeDigits) {
      continue;
    }

    const inferred =
      sign *
      Number.parseFloat(
        `${digits.slice(0, wholeDigits)}.${digits.slice(wholeDigits)}`,
      );

    if (Number.isFinite(inferred) && Math.abs(inferred) <= maxAbs) {
      return inferred;
    }
  }

  return Number.isFinite(parsed) ? parsed : null;
}

function readLatitude(fields: Record<string, string>): number | null {
  const value = parseCoordinate(
    findFieldValue(fields, ["lat", "latitude"]),
    90,
    [2, 1, 3],
  );
  if (value === null) {
    return null;
  }
  return value >= -90 && value <= 90 ? value : null;
}

function readLongitude(fields: Record<string, string>): number | null {
  const value = parseCoordinate(
    findFieldValue(fields, ["lon", "lng", "long", "longitude"]),
    180,
    [1, 2, 3],
  );
  if (value === null) {
    return null;
  }
  return value >= -180 && value <= 180 ? value : null;
}

export type ProducerSearchFilters = {
  municipality: string;
  category: string;
};

const csvCache = new Map<string, ProducerCsvRow[]>();
const countryProducerIndexCache = new Map<
  string,
  Promise<ReadonlyMap<number, LocatedProducerCsvRow>>
>();

export function parseProducerCsvRows(
  csvRaw: string,
  source = "catalog CSV",
  expectedLocation?: ProducerCsvLocation,
): ProducerCsvRow[] {
  const parsedRows = parse(csvRaw, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
  }) as RawCsvRow[];

  return parsedRows.map((row, index) => {
    const fields = Object.fromEntries(
      Object.entries(row).map(([key, value]) => {
        const field = cleanCell(key);
        // Translatable prose and producer-authored community messages preserve
        // source whitespace. Other catalog fields retain the historical cleanup.
        return [
          field,
          field === "descripcion" ||
          field === "mensaje a la comunidad" ||
          field === "quien hay detras" ||
          field === "historia"
            ? String(value ?? "")
            : cleanCell(value),
        ];
      }),
    );
    const producerId = readProducerId(fields);
    const rowLabel = `${source}: line ${index + 2} (producer_id ${producerId})`;
    const slug = readSlug(fields, rowLabel);
    const name = readRequiredCatalogField(fields, "nombre", rowLabel);
    const city = readRequiredCatalogField(fields, "municipio", rowLabel);
    const category = readRequiredCatalogField(fields, "categoria", rowLabel);
    for (const locationField of ["country", "region", "area"] as const) {
      const declaredValue = readRequiredCatalogField(
        fields,
        locationField,
        rowLabel,
      );
      const expectedValue = expectedLocation?.[locationField];
      if (expectedValue && declaredValue !== expectedValue) {
        throw new Error(
          `${rowLabel}: '${locationField}' must match CSV path value '${expectedValue}', found '${declaredValue}'. Run check:csv for details.`,
        );
      }
    }
    const onlineSales = readRequiredCatalogField(
      fields,
      ONLINE_SALES_COLUMN,
      rowLabel,
    );
    if (!ONLINE_SALES_VALUES.has(onlineSales)) {
      throw new Error(
        `${rowLabel}: '${ONLINE_SALES_COLUMN}' must be one of: ${[
          ...ONLINE_SALES_VALUES,
        ].join(", ")}. Run check:csv for details.`,
      );
    }
    const additionalCategories = readAdditionalCategories(fields).filter(
      (additionalCategory) => additionalCategory !== category,
    );
    const categories = [category, ...additionalCategories];
    const featuredProducts = readFeaturedProducts(fields);
    const imageSrc = readImageSrc(fields);
    return {
      producerId,
      slug,
      name,
      city,
      category,
      additionalCategories,
      categories,
      featuredProducts,
      imageSrc,
      latitude: readLatitude(fields),
      longitude: readLongitude(fields),
      fields,
    };
  });
}

export async function loadCsvRows(country = "", area = ""): Promise<ProducerCsvRow[]> {
  const normalizedArea = normalizeAreaSlug(country, area);
  const countrySlug = cleanCell(country).toLowerCase();
  if (!normalizedArea) {
    return [];
  }
  const cacheKey = areaRegistryKey(countrySlug, normalizedArea);

  const cached = csvCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const location = findArea(countrySlug, normalizedArea);
  if (!location) {
    throw new Error(`Unknown area '${countrySlug}/${normalizedArea}'.`);
  }
  const csvPath = resolveAreaCsvPath(countrySlug, normalizedArea);
  const csvRaw = await readFile(csvPath, "utf8");
  const rows = parseProducerCsvRows(csvRaw, csvPath, {
    country: location.countrySlug,
    region: location.regionSlug,
    area: location.slug,
  });

  csvCache.set(cacheKey, rows);
  return rows;
}

async function loadLocalizedCsvRows(
  country: string,
  area: string,
  locale: Locale,
): Promise<ProducerCsvRow[]> {
  const [rows, translations] = await Promise.all([
    loadCsvRows(country, area),
    loadCountryTranslations(country, locale),
  ]);
  return localizeProducerFields(rows, locale, translations);
}

function isValidProducerId(producerId: number): boolean {
  return Number.isSafeInteger(producerId) && producerId > 0;
}

async function buildCountryProducerIndex(
  country: Country,
): Promise<ReadonlyMap<number, LocatedProducerCsvRow>> {
  const areaRows = await Promise.all(
    country.regions.flatMap((region) =>
      region.areas.map(async (area) => ({
        region: region.slug,
        area: area.slug,
        rows: await loadCsvRows(country.slug, area.slug),
      })),
    ),
  );
  const index = new Map<number, LocatedProducerCsvRow>();

  for (const location of areaRows) {
    for (const row of location.rows) {
      if (index.has(row.producerId)) {
        throw new Error(
          `Duplicate producer_id '${row.producerId}' in country '${country.slug}'. Run check:csv for details.`,
        );
      }

      index.set(row.producerId, {
        ...row,
        country: country.slug,
        region: location.region,
        area: location.area,
      });
    }
  }

  return index;
}

function loadCountryProducerIndex(
  country: Country,
): Promise<ReadonlyMap<number, LocatedProducerCsvRow>> {
  const cached = countryProducerIndexCache.get(country.slug);
  if (cached) {
    return cached;
  }

  const pending = buildCountryProducerIndex(country);
  countryProducerIndexCache.set(country.slug, pending);
  void pending.catch(() => {
    if (countryProducerIndexCache.get(country.slug) === pending) {
      countryProducerIndexCache.delete(country.slug);
    }
  });
  return pending;
}

export async function findProducerById(
  country: string,
  producerId: number,
): Promise<LocatedProducerCsvRow | null> {
  if (!isValidProducerId(producerId)) {
    return null;
  }

  const catalogCountry = findCountry(country);
  if (!catalogCountry) {
    return null;
  }

  const index = await loadCountryProducerIndex(catalogCountry);
  return index.get(producerId) ?? null;
}

export async function findProducersByIds(
  identities: readonly ProducerIdentity[],
  locale?: Locale,
): Promise<(LocatedProducerCsvRow | null)[]> {
  const results: (LocatedProducerCsvRow | null)[] = Array.from(
    { length: identities.length },
    () => null,
  );
  const grouped = new Map<string, { position: number; producerId: number }[]>();

  identities.forEach((identity, position) => {
    if (!isValidProducerId(identity.producerId)) {
      return;
    }

    const country = findCountry(identity.country);
    if (!country) {
      return;
    }

    const entries = grouped.get(country.slug) ?? [];
    entries.push({ position, producerId: identity.producerId });
    grouped.set(country.slug, entries);
  });

  await Promise.all(
    [...grouped.entries()].map(async ([countrySlug, entries]) => {
      const country = findCountry(countrySlug);
      if (!country) {
        return;
      }

      const [index, translations] = await Promise.all([
        loadCountryProducerIndex(country),
        locale ? loadCountryTranslations(country.slug, locale) : null,
      ]);
      for (const { position, producerId } of entries) {
        const producer = index.get(producerId) ?? null;
        if (!producer || !locale || !translations) {
          results[position] = producer;
          continue;
        }

        const [localized] = localizeProducerFields(
          [producer],
          locale,
          translations,
        );
        results[position] = { ...producer, ...localized };
      }
    }),
  );

  return results;
}

export async function findProducerBySlug(
  rawSegment: string,
  country = "",
  area = "",
  locale?: Locale,
): Promise<ProducerCsvRow | null> {
  const segment = slugifySegment(rawSegment);
  if (!segment) {
    return null;
  }

  const rows = locale
    ? await loadLocalizedCsvRows(country, area, locale)
    : await loadCsvRows(country, area);
  return rows.find((row) => row.slug === segment) ?? null;
}

export async function listProducerRouteParams(
  countries: readonly Country[] = listCountries(),
): Promise<{ country: string; area: string; slug: string }[]> {
  const routes: { country: string; area: string; slug: string }[] = [];

  for (const country of countries) {
    for (const region of country.regions) {
      for (const area of region.areas) {
        const rows = await loadCsvRows(country.slug, area.slug);
        routes.push(
          ...rows.map((row) => ({
            country: country.slug,
            area: area.slug,
            slug: row.slug,
          })),
        );
      }
    }
  }

  return routes;
}

export async function listCategories(
  country = "",
  area = "",
): Promise<string[]> {
  const rows = await loadCsvRows(country, area);
  const counts = new Map<string, number>();

  for (const row of rows) {
    for (const category of row.categories) {
      const key = category.trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
    .map(([value]) => value);
}

export async function listMunicipalitySummaries(
  category = "",
  limit = 12,
  country = "",
  area = "",
): Promise<MunicipalitySummary[]> {
  const rows = await loadCsvRows(country, area);
  const normalizedCategory = normalizeSearch(category);
  const counts = new Map<string, number>();

  for (const row of rows) {
    if (
      normalizedCategory &&
      !row.categories.some(
        (rowCategory) => normalizeSearch(rowCategory) === normalizedCategory,
      )
    ) {
      continue;
    }

    const municipality = row.city.trim();
    if (!municipality) {
      continue;
    }

    counts.set(municipality, (counts.get(municipality) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function hasProducerMapPoint(
  row: ProducerCsvRow,
): row is ProducerCsvRow & { latitude: number; longitude: number } {
  if (row.latitude === null || row.longitude === null) {
    return false;
  }

  if (row.latitude === 0 && row.longitude === 0) {
    return false;
  }

  return true;
}

export function toProducerMapPoints(
  rows: ProducerCsvRow[],
): ProducerMapPoint[] {
  return rows.flatMap((row) => {
    if (!hasProducerMapPoint(row)) {
      return [];
    }

    return [
      {
        slug: row.slug,
        name: row.name,
        city: row.city,
        category: row.category,
        categories: row.categories,
        latitude: row.latitude,
        longitude: row.longitude,
      },
    ];
  });
}

export async function searchProducers(
  filters: ProducerSearchFilters,
  country = "",
  area = "",
  locale?: Locale,
): Promise<ProducerCsvRow[]> {
  const rows = locale
    ? await loadLocalizedCsvRows(country, area, locale)
    : await loadCsvRows(country, area);
  const normalizedMunicipality = normalizeSearch(filters.municipality);
  const normalizedCategory = normalizeSearch(filters.category);

  return rows.filter((row) => {
    const byMunicipality =
      !normalizedMunicipality ||
      normalizeSearch(row.city).includes(normalizedMunicipality);
    const byCategory =
      !normalizedCategory ||
      row.categories.some(
        (rowCategory) => normalizeSearch(rowCategory) === normalizedCategory,
      );

    return byMunicipality && byCategory;
  });
}

const indexableAreaCache = new Map<
  string,
  Promise<ReadonlyMap<number, Locale[]>>
>();

/** Completeness is per producer/locale; unrelated corrections never block a release. */
export function listIndexableProducerLocales(
  country: string,
  area: string,
  locales: readonly Locale[],
): Promise<ReadonlyMap<number, Locale[]>> {
  const key = `${country}/${area}/${locales.join(",")}`;
  const cached = indexableAreaCache.get(key);
  if (cached) return cached;
  const pending = (async () => {
    const [rows, variants] = await Promise.all([
      loadCsvRows(country, area),
      Promise.all(
        locales.map(async (locale) => {
          const translations = await loadCountryTranslations(country, locale);
          const byProducer = indexProducerTranslations(translations);
          return { locale, byProducer };
        }),
      ),
    ]);
    return new Map(
      rows.map((row) => [
        row.producerId,
        variants
          .filter(({ locale, byProducer }) =>
            hasCurrentProducerProse(
              row,
              locale,
              byProducer.get(row.producerId) ?? [],
            ),
          )
          .map(({ locale }) => locale),
      ]),
    );
  })();
  indexableAreaCache.set(key, pending);
  void pending.catch(() => indexableAreaCache.delete(key));
  return pending;
}
