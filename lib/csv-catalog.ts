import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { parse } from "csv-parse/sync";

type RawCsvRow = Record<string, string | undefined>;

export type ProducerCsvRow = {
  id: number;
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
  distanceKm?: number;
  fields: Record<string, string>;
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
export type AreaOption = {
  slug: string;
  label: string;
};

export type Region = {
  slug: string;
  label: string;
  areas: AreaOption[];
};

export type UnitName = {
  one: string;
  many: string;
};

export type Country = {
  slug: string;
  label: string;
  unit: UnitName;
  regionUnit: UnitName;
  regions: Region[];
};

// Neutral word for the unit, for copy written outside any country.
export const CATALOG_UNIT: UnitName = { one: "area", many: "areas" };

type CountryManifest = {
  label?: string;
  unit?: Partial<UnitName>;
  regionUnit?: Partial<UnitName>;
  aliases?: Record<string, string>;
  regions?: {
    slug: string;
    label?: string;
    areas?: { slug: string; label?: string }[];
  }[];
};

type AreaRegistryEntry = AreaOption & {
  countrySlug: string;
  regionSlug: string;
};

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// The tree is the source of truth for *what exists*: a country is a folder under
// data/csv, a region is a folder inside it and an area is a CSV inside that. The
// optional country.json only supplies what a folder name cannot carry — the
// display labels, what the country calls its two levels, and the order they are
// listed in. Dropping a new CSV in is therefore enough to publish it, and adding
// a country is a folder plus a manifest, never a code change.
function loadCountries(): Country[] {
  const root = path.resolve(process.cwd(), CSV_DATA_DIR);
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
        label: declared?.label ?? titleCase(regionSlug),
        areas: areaSlugs.map((areaSlug) => ({
          slug: areaSlug,
          label:
            declaredAreas.find((area) => area.slug === areaSlug)?.label ?? titleCase(areaSlug),
        })),
      };
    });

    return {
      slug: countrySlug,
      label: manifest.label ?? countrySlug.toUpperCase(),
      unit: {
        one: manifest.unit?.one ?? CATALOG_UNIT.one,
        many: manifest.unit?.many ?? CATALOG_UNIT.many,
      },
      regionUnit: {
        one: manifest.regionUnit?.one ?? "region",
        many: manifest.regionUnit?.many ?? "regions",
      },
      regions,
    };
  });
}

function loadAliases(): Map<string, string> {
  const root = path.resolve(process.cwd(), CSV_DATA_DIR);
  const aliases = new Map<string, string>();

  for (const countrySlug of fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)) {
    const manifestPath = path.join(root, countrySlug, COUNTRY_MANIFEST);
    if (!fs.existsSync(manifestPath)) continue;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as CountryManifest;
    for (const [alias, target] of Object.entries(manifest.aliases ?? {})) {
      aliases.set(alias, target);
    }
  }

  return aliases;
}

const COUNTRIES = loadCountries();
const AREA_ALIASES = loadAliases();

const AREA_REGISTRY: Map<string, AreaRegistryEntry> = new Map(
  COUNTRIES.flatMap((country) =>
    country.regions.flatMap((region) =>
      region.areas.map(
        (area) =>
          [
            area.slug,
            { ...area, countrySlug: country.slug, regionSlug: region.slug },
          ] as [string, AreaRegistryEntry],
      ),
    ),
  ),
);

export function normalizeAreaSlug(area: string): string {
  const slug = cleanCell(area)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  const normalizedSlug = AREA_ALIASES.get(slug) ?? slug;

  return AREA_REGISTRY.has(normalizedSlug) ? normalizedSlug : "";
}

function resolveAreaCsvPath(area: string): string {
  const normalizedArea = normalizeAreaSlug(area);
  const entry = AREA_REGISTRY.get(normalizedArea);

  if (!entry) {
    throw new Error(`Unknown area '${area}'.`);
  }

  return path.resolve(
    process.cwd(),
    CSV_DATA_DIR,
    entry.countrySlug,
    entry.regionSlug,
    `${normalizedArea}.csv`,
  );
}

export function getAreaLabel(area: string): string {
  return AREA_REGISTRY.get(normalizeAreaSlug(area))?.label ?? "";
}

export function getAreaCountrySlug(area: string): string {
  return AREA_REGISTRY.get(normalizeAreaSlug(area))?.countrySlug ?? "";
}

export function listAreas(): AreaOption[] {
  return COUNTRIES.flatMap(({ regions }) =>
    regions.flatMap(({ areas }) => areas.map(({ slug, label }) => ({ slug, label }))),
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
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
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
  lat?: number;
  lon?: number;
};

function hasValidCoordinates(
  lat: number | undefined,
  lon: number | undefined,
): boolean {
  return Number.isFinite(lat) && Number.isFinite(lon);
}

// Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const csvCache = new Map<string, ProducerCsvRow[]>();

async function loadCsvRows(area = ""): Promise<ProducerCsvRow[]> {
  const cacheKey = normalizeAreaSlug(area);
  if (!cacheKey) {
    return [];
  }

  const cached = csvCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const csvPath = resolveAreaCsvPath(cacheKey);
  const csvRaw = await readFile(csvPath, "utf8");
  const parsedRows = parse(csvRaw, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
  }) as RawCsvRow[];

  const rows = parsedRows.map((row, index) => {
    const fields = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [cleanCell(key), cleanCell(value)]),
    );
    if (!fields[ONLINE_SALES_COLUMN]) {
      fields[ONLINE_SALES_COLUMN] = DEFAULT_ONLINE_SALES_VALUE;
    }
    const id = index + 1;
    const name = fields.nombre || `Fila ${id}`;
    const city = fields.municipio || "Sin municipio";
    const category = fields.categoria || "Sin categoría";
    const additionalCategories = readAdditionalCategories(fields).filter(
      (additionalCategory) => additionalCategory !== category,
    );
    const categories = [category, ...additionalCategories];
    const featuredProducts = readFeaturedProducts(fields);
    const imageSrc = readImageSrc(fields);
    const slug = readSlug(fields, name, city, id);

    fields.slug = slug;

    return {
      id,
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

function parseLegacyProducerId(rawSegment: string): number | null {
  const candidate = rawSegment.trim();
  const id = Number.parseInt(candidate ?? "", 10);

  if (!/^\d+$/.test(candidate) || !Number.isInteger(id) || id < 1) {
    return null;
  }

  return id;
}

export async function findProducerBySlug(rawSegment: string, area = ""): Promise<ProducerCsvRow | null> {
  const segment = slugifySegment(rawSegment);
  if (!segment) {
    return null;
  }

  const rows = await loadCsvRows(area);
  const exactMatch = rows.find((row) => row.slug === segment);
  if (exactMatch) {
    return exactMatch;
  }

  const legacySlugMatch = segment.match(/^\d+-(.+)$/);
  if (legacySlugMatch?.[1]) {
    const producer = rows.find((row) => row.slug === legacySlugMatch[1]);
    if (producer) {
      return producer;
    }
  }

  const legacyId = parseLegacyProducerId(segment);
  return legacyId === null ? null : rows[legacyId - 1] ?? null;
}

export async function listCategories(area = ""): Promise<string[]> {
  const rows = await loadCsvRows(area);
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
  area = "",
): Promise<MunicipalitySummary[]> {
  const rows = await loadCsvRows(area);
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
  area = "",
): Promise<ProducerCsvRow[]> {
  const rows = await loadCsvRows(area);
  const normalizedMunicipality = normalizeSearch(filters.municipality);
  const normalizedCategory = normalizeSearch(filters.category);

  let results = rows.filter((row) => {
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

  if (hasValidCoordinates(filters.lat, filters.lon)) {
    const userLat = filters.lat as number;
    const userLon = filters.lon as number;

    results = results.map((row) => {
      if (hasProducerMapPoint(row)) {
        return {
          ...row,
          distanceKm: calculateDistance(
            userLat,
            userLon,
            row.latitude,
            row.longitude,
          ),
        };
      }
      return row;
    });

    results.sort((a, b) => {
      // Items without coordinates go to the bottom when sorting by distance
      if (a.distanceKm === undefined && b.distanceKm === undefined) return 0;
      if (a.distanceKm === undefined) return 1;
      if (b.distanceKm === undefined) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }

  return results;
}
