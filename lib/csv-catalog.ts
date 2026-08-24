import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { parse } from "csv-parse/sync";

import {
  LEGACY_DEFAULT_LOCALE,
  hasDescriptionSourceLocale,
  hasLocale,
  type Locale,
} from "./i18n/locales";
import {
  TRANSLATION_SIDECAR_HEADER,
  parseDescriptionTranslations,
  resolveLocalizedDescription,
  type DescriptionTranslation,
  type RawDescriptionTranslation,
} from "./i18n/translations";
import {
  normalizeProducerRouteAliasKey,
  normalizeStoredProducerRouteAliasKey,
} from "./producer-route-aliases";

type RawCsvRow = Record<string, string | undefined>;

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

const CSV_DATA_DIR = "data/csv";
const COUNTRY_MANIFEST = "country.json";

// Three levels, named in English so the framework does not carry one country's
// vocabulary: country -> region -> area. `area` is the catalog unit and the one
// that appears in URLs; each country says what it calls it (province, prefecture,
// …) in its manifest, and that word is what the interface shows.
export type LocalizedLabels = Partial<Record<Locale, string>>;

export type EffectiveLocalePolicy = {
  defaultLocale: Locale;
  publishedLocales: Locale[];
  preferredLocale: Locale;
};

export type AreaOption = EffectiveLocalePolicy & {
  slug: string;
  label: string;
  labels: LocalizedLabels;
};

export type Region = EffectiveLocalePolicy & {
  slug: string;
  label: string;
  labels: LocalizedLabels;
  areas: AreaOption[];
};

export type UnitName = {
  one: string;
  many: string;
};

export type Country = EffectiveLocalePolicy & {
  slug: string;
  label: string;
  labels: LocalizedLabels;
  unit: UnitName;
  unitLabels: Partial<Record<Locale, UnitName>>;
  regionUnit: UnitName;
  regionUnitLabels: Partial<Record<Locale, UnitName>>;
  regions: Region[];
};

// Neutral word for the unit, for copy written outside any country.
export const CATALOG_UNIT: UnitName = { one: "area", many: "areas" };

type CountryManifest = {
  label?: string;
  unit?: Partial<UnitName>;
  regionUnit?: Partial<UnitName>;
  aliases?: Record<string, string>;
  producerRouteAliases?: Record<string, number>;
  i18n?: {
    defaultLocale?: string;
    publishedLocales?: string[];
    labels?: Record<string, string>;
    unitLabels?: Record<string, Partial<UnitName>>;
    regionUnitLabels?: Record<string, Partial<UnitName>>;
  };
  regions?: {
    slug: string;
    label?: string;
    labels?: Record<string, string>;
    i18n?: {
      preferredLocale?: string;
      publishedLocales?: string[];
    };
    areas?: {
      slug: string;
      label?: string;
      labels?: Record<string, string>;
      i18n?: {
        preferredLocale?: string;
        publishedLocales?: string[];
      };
    }[];
  }[];
};

export function hasExplicitCatalogLocalePolicy(manifest: unknown): boolean {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) return false;
  const i18n = (manifest as { i18n?: unknown }).i18n;
  if (!i18n || typeof i18n !== "object" || Array.isArray(i18n)) return false;
  return Array.isArray((i18n as { publishedLocales?: unknown }).publishedLocales);
}

type AreaRegistryEntry = AreaOption & {
  countrySlug: string;
  regionSlug: string;
};

export type AreaLocation = AreaRegistryEntry;

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function supportedLocales(value: string[] | undefined, fallback: readonly Locale[]): Locale[] {
  if (!Array.isArray(value)) return [...fallback];

  const locales = value.filter(hasLocale);
  return locales.length > 0 ? [...new Set(locales)] : [...fallback];
}

function localizedLabels(
  value: Record<string, string> | undefined,
  defaultLocale: Locale,
  fallback: string,
): LocalizedLabels {
  const labels: LocalizedLabels = {};

  for (const [locale, label] of Object.entries(value ?? {})) {
    if (hasLocale(locale) && typeof label === "string" && label.trim()) {
      labels[locale] = label;
    }
  }

  labels[defaultLocale] ??= fallback;
  return labels;
}

function localizedUnitNames(
  value: Record<string, Partial<UnitName>> | undefined,
  defaultLocale: Locale,
  fallback: UnitName,
): Partial<Record<Locale, UnitName>> {
  const labels: Partial<Record<Locale, UnitName>> = {};

  for (const [locale, unit] of Object.entries(value ?? {})) {
    if (!hasLocale(locale) || !unit || typeof unit !== "object") continue;
    const one = typeof unit.one === "string" && unit.one.trim() ? unit.one : fallback.one;
    const many = typeof unit.many === "string" && unit.many.trim() ? unit.many : fallback.many;
    labels[locale] = { one, many };
  }

  labels[defaultLocale] ??= fallback;
  return labels;
}

function effectivePreferredLocale(
  value: string | undefined,
  inherited: Locale,
  defaultLocale: Locale,
  publishedLocales: readonly Locale[],
): Locale {
  if (hasLocale(value) && publishedLocales.includes(value)) return value;
  if (publishedLocales.includes(inherited)) return inherited;
  if (publishedLocales.includes(defaultLocale)) return defaultLocale;
  return publishedLocales[0] ?? defaultLocale;
}

// The tree is the source of truth for *what exists*: a country is a folder under
// data/csv, a region is a folder inside it and an area is a CSV inside that. The
// optional country.json only supplies what a folder name cannot carry — the
// display labels, what the country calls its two levels, and the order they are
// listed in. Dropping a new CSV in is therefore enough to publish it, and adding
// a country is a folder plus a manifest, never a code change.
export function loadCountries(
  root: string = path.resolve(process.cwd(), CSV_DATA_DIR),
): Country[] {
  const directories = (parent: string) =>
    fs
      .readdirSync(parent, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

  return directories(root).map((countrySlug) => {
    const countryDir = path.join(root, countrySlug);
    const manifestPath = path.join(countryDir, COUNTRY_MANIFEST);
    const manifest: CountryManifest = fs.existsSync(manifestPath)
      ? (JSON.parse(fs.readFileSync(manifestPath, "utf8")) as CountryManifest)
      : {};

    const defaultLocale = hasLocale(manifest.i18n?.defaultLocale)
      ? manifest.i18n.defaultLocale
      : LEGACY_DEFAULT_LOCALE;
    const configuredCountryLocales = supportedLocales(manifest.i18n?.publishedLocales, [
      defaultLocale,
    ]);
    const publishedLocales = configuredCountryLocales.includes(defaultLocale)
      ? configuredCountryLocales
      : [defaultLocale, ...configuredCountryLocales];
    const preferredLocale = defaultLocale;
    const countryLabel = manifest.label ?? countrySlug.toUpperCase();
    const unit = {
      one: manifest.unit?.one ?? CATALOG_UNIT.one,
      many: manifest.unit?.many ?? CATALOG_UNIT.many,
    };
    const regionUnit = {
      one: manifest.regionUnit?.one ?? "region",
      many: manifest.regionUnit?.many ?? "regions",
    };

    const declaredRegions = manifest.regions ?? [];
    const regionOrder = new Map(declaredRegions.map((region, index) => [region.slug, index]));
    const regionSlugs = directories(countryDir).sort((a, b) => {
      const left = regionOrder.get(a) ?? Number.MAX_SAFE_INTEGER;
      const right = regionOrder.get(b) ?? Number.MAX_SAFE_INTEGER;
      return left - right || a.localeCompare(b);
    });

    const regions = regionSlugs.map((regionSlug) => {
      const declared = declaredRegions.find((region) => region.slug === regionSlug);
      const declaredAreas = declared?.areas ?? [];
      const regionPublishedLocales = supportedLocales(
        declared?.i18n?.publishedLocales,
        publishedLocales,
      );
      const regionPreferredLocale = effectivePreferredLocale(
        declared?.i18n?.preferredLocale,
        preferredLocale,
        defaultLocale,
        regionPublishedLocales,
      );
      const regionLabel = declared?.label ?? titleCase(regionSlug);
      const areaOrder = new Map(declaredAreas.map((area, index) => [area.slug, index]));
      const areaSlugs = fs
        .readdirSync(path.join(countryDir, regionSlug))
        .filter((file) => file.endsWith(".csv"))
        .map((file) => file.slice(0, -".csv".length))
        .sort((a, b) => {
          const left = areaOrder.get(a) ?? Number.MAX_SAFE_INTEGER;
          const right = areaOrder.get(b) ?? Number.MAX_SAFE_INTEGER;
          return left - right || a.localeCompare(b);
        });

      return {
        slug: regionSlug,
        label: regionLabel,
        labels: localizedLabels(declared?.labels, defaultLocale, regionLabel),
        defaultLocale,
        publishedLocales: regionPublishedLocales,
        preferredLocale: regionPreferredLocale,
        areas: areaSlugs.map((areaSlug) => {
          const declaredArea = declaredAreas.find((area) => area.slug === areaSlug);
          const areaPublishedLocales = supportedLocales(
            declaredArea?.i18n?.publishedLocales,
            regionPublishedLocales,
          );
          const areaPreferredLocale = effectivePreferredLocale(
            declaredArea?.i18n?.preferredLocale,
            regionPreferredLocale,
            defaultLocale,
            areaPublishedLocales,
          );
          const areaLabel = declaredArea?.label ?? titleCase(areaSlug);

          return {
            slug: areaSlug,
            label: areaLabel,
            labels: localizedLabels(declaredArea?.labels, defaultLocale, areaLabel),
            defaultLocale,
            publishedLocales: areaPublishedLocales,
            preferredLocale: areaPreferredLocale,
          };
        }),
      };
    });

    return {
      slug: countrySlug,
      label: countryLabel,
      labels: localizedLabels(manifest.i18n?.labels, defaultLocale, countryLabel),
      unit,
      unitLabels: localizedUnitNames(manifest.i18n?.unitLabels, defaultLocale, unit),
      regionUnit,
      regionUnitLabels: localizedUnitNames(
        manifest.i18n?.regionUnitLabels,
        defaultLocale,
        regionUnit,
      ),
      defaultLocale,
      publishedLocales,
      preferredLocale,
      regions,
    };
  });
}

function loadAliases(): Map<string, Map<string, string>> {
  const root = path.resolve(process.cwd(), CSV_DATA_DIR);
  const aliases = new Map<string, Map<string, string>>();

  for (const countrySlug of fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)) {
    const manifestPath = path.join(root, countrySlug, COUNTRY_MANIFEST);
    if (!fs.existsSync(manifestPath)) continue;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as CountryManifest;
    const countryAliases = new Map<string, string>();
    for (const [alias, target] of Object.entries(manifest.aliases ?? {})) {
      countryAliases.set(alias, target);
    }
    aliases.set(countrySlug, countryAliases);
  }

  return aliases;
}

const COUNTRIES = loadCountries();
const AREA_ALIASES = loadAliases();

function loadProducerRouteAliases(): Map<string, number> {
  const root = path.resolve(process.cwd(), CSV_DATA_DIR);
  const aliases = new Map<string, number>();

  for (const countrySlug of fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)) {
    const manifestPath = path.join(root, countrySlug, COUNTRY_MANIFEST);
    if (!fs.existsSync(manifestPath)) continue;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as CountryManifest;
    const configuredAliases: unknown = manifest.producerRouteAliases;
    if (
      configuredAliases !== undefined &&
      (!configuredAliases || typeof configuredAliases !== "object" || Array.isArray(configuredAliases))
    ) {
      throw new Error(
        `Invalid producerRouteAliases in '${countrySlug}/country.json'. Run check:csv for details.`,
      );
    }

    for (const [formerRoute, producerId] of Object.entries(
      (configuredAliases ?? {}) as Record<string, number>,
    )) {
      const normalizedRoute = normalizeStoredProducerRouteAliasKey(formerRoute);
      if (
        !normalizedRoute ||
        normalizedRoute !== formerRoute ||
        !Number.isSafeInteger(producerId) ||
        producerId <= 0
      ) {
        throw new Error(
          `Invalid producer route alias '${countrySlug}/${formerRoute}'. Run check:csv for details.`,
        );
      }
      const routeKey = `${countrySlug}/${normalizedRoute}`;
      if (aliases.has(routeKey)) {
        throw new Error(
          `Duplicate producer route alias '${routeKey}'. Run check:csv for details.`,
        );
      }
      aliases.set(routeKey, producerId);
    }
  }

  return aliases;
}

const PRODUCER_ROUTE_ALIASES = loadProducerRouteAliases();

function areaRegistryKey(country: string, area: string): string {
  return `${country}/${area}`;
}

const AREA_REGISTRY: Map<string, AreaRegistryEntry> = new Map(
  COUNTRIES.flatMap((country) =>
    country.regions.flatMap((region) =>
      region.areas.map(
        (area) =>
          [
            areaRegistryKey(country.slug, area.slug),
            { ...area, countrySlug: country.slug, regionSlug: region.slug },
          ] as [string, AreaRegistryEntry],
      ),
    ),
  ),
);

export function normalizeAreaSlug(country: string, area: string): string {
  const countrySlug = cleanCell(country).toLowerCase();
  const slug = cleanCell(area)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  const normalizedSlug = AREA_ALIASES.get(countrySlug)?.get(slug) ?? slug;

  return AREA_REGISTRY.has(areaRegistryKey(countrySlug, normalizedSlug)) ? normalizedSlug : "";
}

export function findProducerRouteAlias(
  country: string,
  rawArea: string,
  rawSlug: string,
): number | null {
  const countrySlug = cleanCell(country).toLowerCase();
  const formerRoute = normalizeProducerRouteAliasKey(rawArea, rawSlug);
  if (!formerRoute) return null;
  return PRODUCER_ROUTE_ALIASES.get(`${countrySlug}/${formerRoute}`) ?? null;
}

export function findArea(country: string, area: string): AreaLocation | null {
  const countrySlug = cleanCell(country).toLowerCase();
  const normalizedArea = normalizeAreaSlug(countrySlug, area);
  return AREA_REGISTRY.get(areaRegistryKey(countrySlug, normalizedArea)) ?? null;
}

function resolveAreaCsvPath(country: string, area: string): string {
  const entry = findArea(country, area);

  if (!entry) {
    throw new Error(`Unknown area '${country}/${area}'.`);
  }

  return path.resolve(
    process.cwd(),
    CSV_DATA_DIR,
    entry.countrySlug,
    entry.regionSlug,
    `${entry.slug}.csv`,
  );
}

export function getAreaLabel(country: string, area: string): string {
  return findArea(country, area)?.label ?? "";
}

export function listAreas(): AreaOption[] {
  return COUNTRIES.flatMap(({ regions }) =>
    regions.flatMap(({ areas }) => areas.map((area) => ({ ...area }))),
  );
}

export function listCountryAreaParams(): { country: string; area: string }[] {
  return COUNTRIES.flatMap((country) =>
    country.regions.flatMap((region) =>
      region.areas.map((area) => ({ country: country.slug, area: area.slug })),
    ),
  );
}

export function listCountries(): Country[] {
  return COUNTRIES;
}

export function findCountry(country: string): Country | null {
  const normalized = cleanCell(country).toLowerCase();
  return COUNTRIES.find((entry) => entry.slug === normalized) ?? null;
}

export function listCountrySlugs(): string[] {
  return COUNTRIES.map(({ slug }) => slug);
}

const DEFAULT_PRODUCER_IMAGE_SRC = "/productores/generica.webp";
const ONLINE_SALES_COLUMN = "Venta online";
const DEFAULT_ONLINE_SALES_VALUE = "no comprobado";
const ADDITIONAL_CATEGORIES_COLUMN = "categorias adicionales";
const PRODUCER_ID_COLUMN = "producer_id";
const CATEGORY_SEPARATOR = "|";

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

function buildDefaultSlug(name: string, city: string, id: number): string {
  const baseSlug = slugifySegment([name, city].filter(Boolean).join(" "));
  return baseSlug || `productor-${id}`;
}

function readSlug(fields: Record<string, string>, name: string, city: string, id: number): string {
  return slugifySegment(fields.slug || "") || buildDefaultSlug(name, city, id);
}

function readProducerId(fields: Record<string, string>): number {
  const value = cleanCell(fields[PRODUCER_ID_COLUMN]);
  const parsed = Number.parseInt(value, 10);
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(parsed)) {
    const rowLabel = fields.slug || fields.nombre || "unknown row";
    throw new Error(`Invalid producer_id for '${rowLabel}'. Run check:csv for details.`);
  }
  return parsed;
}

function readFeaturedProducts(fields: Record<string, string>): string {
  return fields["productos estrella"] || fields.subcategoria || "";
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

  return imagePath.startsWith("/") ? imagePath : `/${imagePath.replace(/^\/+/, "")}`;
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
  const looksLikeGroupedCoordinate = /^-?\d{1,3}(?:[.,]\d{3})+(?:[.,]\d+)?$/.test(cleaned);

  if (!looksLikeGroupedCoordinate || !digits) {
    return Number.isFinite(parsed) ? parsed : null;
  }

  for (const wholeDigits of integerDigits) {
    if (digits.length <= wholeDigits) {
      continue;
    }

    const inferred = sign * Number.parseFloat(
      `${digits.slice(0, wholeDigits)}.${digits.slice(wholeDigits)}`,
    );

    if (Number.isFinite(inferred) && Math.abs(inferred) <= maxAbs) {
      return inferred;
    }
  }

  return Number.isFinite(parsed) ? parsed : null;
}

function readLatitude(fields: Record<string, string>): number | null {
  const value = parseCoordinate(findFieldValue(fields, ["lat", "latitude"]), 90, [2, 1, 3]);
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
const translationCache = new Map<string, Promise<DescriptionTranslation[]>>();
const explicitLocalePolicyCache = new Map<string, boolean>();
const countryProducerIndexCache = new Map<
  string,
  Promise<ReadonlyMap<number, LocatedProducerCsvRow>>
>();

async function loadCsvRows(country = "", area = ""): Promise<ProducerCsvRow[]> {
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

  const csvPath = resolveAreaCsvPath(countrySlug, normalizedArea);
  const csvRaw = await readFile(csvPath, "utf8");
  const parsedRows = parse(csvRaw, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
  }) as RawCsvRow[];

  const rows = parsedRows.map((row) => {
    const fields = Object.fromEntries(
      Object.entries(row).map(([key, value]) => {
        const field = cleanCell(key);
        // Translation hashes intentionally preserve source whitespace. Other
        // catalog fields retain the historical presentation cleanup.
        return [field, field === "descripcion" ? String(value ?? "") : cleanCell(value)];
      }),
    );
    if (!fields[ONLINE_SALES_COLUMN]) {
      fields[ONLINE_SALES_COLUMN] = DEFAULT_ONLINE_SALES_VALUE;
    }
    const producerId = readProducerId(fields);
    const name = fields.nombre || `Fila ${producerId}`;
    const city = fields.municipio || "Sin municipio";
    const category = fields.categoria || "Sin categoría";
    const additionalCategories = readAdditionalCategories(fields).filter(
      (additionalCategory) => additionalCategory !== category,
    );
    const categories = [category, ...additionalCategories];
    const featuredProducts = readFeaturedProducts(fields);
    const imageSrc = readImageSrc(fields);
    const slug = readSlug(fields, name, city, producerId);

    fields.slug = slug;

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

  csvCache.set(cacheKey, rows);
  return rows;
}

async function loadCountryTranslations(
  country: string,
  targetLocale: Locale,
): Promise<DescriptionTranslation[]> {
  const countrySlug = cleanCell(country).toLowerCase();
  const cacheKey = `${countrySlug}/${targetLocale}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  const pending = (async () => {
    const sidecarPath = path.resolve(
      process.cwd(),
      CSV_DATA_DIR,
      countrySlug,
      `translations.${targetLocale}.csv`,
    );
    let raw: string;
    try {
      raw = await readFile(sidecarPath, "utf8");
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        return [];
      }
      throw error;
    }
    if (raw.startsWith("\uFEFF")) throw new Error(`${sidecarPath}: UTF-8 BOM is not allowed`);
    if (raw.includes("\r")) throw new Error(`${sidecarPath}: only LF line endings are allowed`);
    const records = parse(raw, {
      bom: false,
      skip_empty_lines: true,
    }) as string[][];
    const header = records[0] ?? [];
    if (
      header.length !== TRANSLATION_SIDECAR_HEADER.length ||
      header.some((column, index) => column !== TRANSLATION_SIDECAR_HEADER[index])
    ) {
      throw new Error(
        `${sidecarPath}: expected exact translation header '${TRANSLATION_SIDECAR_HEADER.join(",")}'`,
      );
    }
    const rows = records.slice(1).map((record, index) => {
      if (record.length !== TRANSLATION_SIDECAR_HEADER.length) {
        throw new Error(
          `${sidecarPath}: record ${index + 2} has ${record.length} columns instead of ${TRANSLATION_SIDECAR_HEADER.length}`,
        );
      }
      return Object.fromEntries(
        TRANSLATION_SIDECAR_HEADER.map((column, columnIndex) => [
          column,
          record[columnIndex] ?? "",
        ]),
      ) as RawDescriptionTranslation;
    });
    return parseDescriptionTranslations(rows, targetLocale);
  })();
  translationCache.set(cacheKey, pending);
  void pending.catch(() => {
    if (translationCache.get(cacheKey) === pending) translationCache.delete(cacheKey);
  });
  return pending;
}

export function localizeProducerDescriptions(
  rows: readonly ProducerCsvRow[],
  requestedLocale: Locale,
  translations: readonly DescriptionTranslation[],
): ProducerCsvRow[] {
  return rows.map((row) => {
    const text = row.fields.descripcion ?? "";
    const sourceLocale = row.fields.descripcion_locale;
    if (!text) return row;
    if (!hasDescriptionSourceLocale(sourceLocale)) {
      return { ...row, fields: { ...row.fields, descripcion: "" } };
    }

    const resolved = resolveLocalizedDescription(
      { producerId: String(row.producerId), text, locale: sourceLocale },
      requestedLocale,
      translations,
    );
    const localizedText = resolved?.text ?? "";
    if (localizedText === text) return row;
    return { ...row, fields: { ...row.fields, descripcion: localizedText } };
  });
}

function hasExplicitCountryLocalePolicy(country: string): boolean {
  const countrySlug = cleanCell(country).toLowerCase();
  const cached = explicitLocalePolicyCache.get(countrySlug);
  if (cached !== undefined) return cached;
  const manifestPath = path.resolve(process.cwd(), CSV_DATA_DIR, countrySlug, COUNTRY_MANIFEST);
  let explicit = false;
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as CountryManifest;
    explicit = hasExplicitCatalogLocalePolicy(manifest);
  }
  explicitLocalePolicyCache.set(countrySlug, explicit);
  return explicit;
}

async function loadLocalizedCsvRows(
  country: string,
  area: string,
  locale: Locale,
): Promise<ProducerCsvRow[]> {
  if (!hasExplicitCountryLocalePolicy(country)) {
    return loadCsvRows(country, area);
  }
  const [rows, translations] = await Promise.all([
    loadCsvRows(country, area),
    loadCountryTranslations(country, locale),
  ]);
  return localizeProducerDescriptions(rows, locale, translations);
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
): Promise<(LocatedProducerCsvRow | null)[]> {
  const results: (LocatedProducerCsvRow | null)[] = Array.from(
    { length: identities.length },
    () => null,
  );
  const grouped = new Map<
    string,
    { position: number; producerId: number }[]
  >();

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

      const index = await loadCountryProducerIndex(country);
      for (const { position, producerId } of entries) {
        results[position] = index.get(producerId) ?? null;
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

export async function listProducerRouteParams(): Promise<
  { country: string; area: string; slug: string }[]
> {
  const routes: { country: string; area: string; slug: string }[] = [];

  for (const { country, area } of listCountryAreaParams()) {
    const rows = await loadCsvRows(country, area);
    routes.push(...rows.map((row) => ({ country, area, slug: row.slug })));
  }

  return routes;
}

export async function listCategories(country = "", area = ""): Promise<string[]> {
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

export function toProducerMapPoints(rows: ProducerCsvRow[]): ProducerMapPoint[] {
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
