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
  latitude: number;
  longitude: number;
};

export type MunicipalitySummary = {
  name: string;
  count: number;
};

const CSV_DATA_DIR = "data/csv";

export type ProvinceOption = {
  slug: string;
  label: string;
};

export type ProvinceGroup = {
  slug: string;
  label: string;
  provinces: ProvinceOption[];
};

// Neutral name for the catalog unit, for copy that is not inside a country yet.
// Each country overrides it with its own word (`unit`): provincia in Spain,
// prefectura in Japan. It is deliberately not "región": that is already the level
// *above* in Japan — eight regions holding forty-seven prefectures — so reusing it
// here would be wrong exactly where the Spain-centric wording was.
// The `provincia` URL param keeps its name regardless; it is a pinned interface.
export const CATALOG_UNIT = "zona";
export const CATALOG_UNIT_PLURAL = "zonas";

export type ProvinceCountry = {
  slug: string;
  label: string;
  // What the two levels are called locally. A prefecture is not a province and a
  // region is not a comunidad, so the wording travels with the country instead of
  // being hardcoded in the pages. Both numbers are stored because every caller
  // needs one or the other, and deriving them by trimming an `s` reads worse than
  // writing the two words down.
  unit: string;
  unitPlural: string;
  groupUnitPlural: string;
  groups: ProvinceGroup[];
};

type ProvinceRegistryEntry = ProvinceOption & {
  countrySlug: string;
  communitySlug: string;
};

const SPAIN_GROUPS = [
  {
    slug: "andalucia",
    label: "Andalucía",
    provinces: [
      { slug: "almeria", label: "Almería" },
      { slug: "cadiz", label: "Cádiz" },
      { slug: "cordoba", label: "Córdoba" },
      { slug: "granada", label: "Granada" },
      { slug: "huelva", label: "Huelva" },
      { slug: "jaen", label: "Jaén" },
      { slug: "malaga", label: "Málaga" },
      { slug: "sevilla", label: "Sevilla" },
    ],
  },
  {
    slug: "asturias",
    label: "Principado de Asturias",
    provinces: [{ slug: "asturias", label: "Asturias" }],
  },
  {
    slug: "cantabria",
    label: "Cantabria",
    provinces: [{ slug: "cantabria", label: "Cantabria" }],
  },
  {
    slug: "castilla-y-leon",
    label: "Castilla y León",
    provinces: [
      { slug: "avila", label: "Ávila" },
      { slug: "burgos", label: "Burgos" },
      { slug: "leon", label: "León" },
      { slug: "palencia", label: "Palencia" },
      { slug: "salamanca", label: "Salamanca" },
      { slug: "segovia", label: "Segovia" },
      { slug: "soria", label: "Soria" },
      { slug: "valladolid", label: "Valladolid" },
      { slug: "zamora", label: "Zamora" },
    ],
  },
  {
    slug: "castilla-la-mancha",
    label: "Castilla-La Mancha",
    provinces: [
      { slug: "albacete", label: "Albacete" },
      { slug: "ciudad-real", label: "Ciudad Real" },
      { slug: "cuenca", label: "Cuenca" },
      { slug: "guadalajara", label: "Guadalajara" },
      { slug: "toledo", label: "Toledo" },
    ],
  },
  {
    slug: "aragon",
    label: "Aragón",
    provinces: [
      { slug: "huesca", label: "Huesca" },
      { slug: "teruel", label: "Teruel" },
      { slug: "zaragoza", label: "Zaragoza" },
    ],
  },
  {
    slug: "catalunya",
    label: "Catalunya",
    provinces: [
      { slug: "barcelona", label: "Barcelona" },
      { slug: "girona", label: "Girona" },
      { slug: "lleida", label: "Lleida" },
      { slug: "tarragona", label: "Tarragona" },
    ],
  },
  {
    slug: "illes-balears",
    label: "Illes Balears",
    provinces: [{ slug: "baleares", label: "Baleares" }],
  },
  {
    slug: "canarias",
    label: "Canarias",
    provinces: [
      { slug: "las-palmas", label: "Las Palmas" },
      { slug: "santa-cruz-de-tenerife", label: "Santa Cruz de Tenerife" },
    ],
  },
  {
    slug: "comunitat-valenciana",
    label: "Comunitat Valenciana",
    provinces: [
      { slug: "alicante", label: "Alicante" },
      { slug: "castellon", label: "Castellón" },
      { slug: "valencia", label: "Valencia" },
    ],
  },
  {
    slug: "galicia",
    label: "Galicia",
    provinces: [
      { slug: "a-coruna", label: "A Coruña" },
      { slug: "lugo", label: "Lugo" },
      { slug: "ourense", label: "Ourense" },
      { slug: "pontevedra", label: "Pontevedra" },
    ],
  },
  {
    slug: "extremadura",
    label: "Extremadura",
    provinces: [
      { slug: "badajoz", label: "Badajoz" },
      { slug: "caceres", label: "Cáceres" },
    ],
  },
  {
    slug: "madrid",
    label: "Comunidad de Madrid",
    provinces: [{ slug: "madrid", label: "Madrid" }],
  },
  {
    slug: "la-rioja",
    label: "La Rioja",
    provinces: [{ slug: "la-rioja", label: "La Rioja" }],
  },
  {
    slug: "murcia",
    label: "Región de Murcia",
    provinces: [{ slug: "murcia", label: "Murcia" }],
  },
  {
    slug: "navarra",
    label: "Navarra",
    provinces: [{ slug: "navarra", label: "Navarra" }],
  },
  {
    slug: "pais-vasco",
    label: "País Vasco",
    provinces: [
      { slug: "alava", label: "Álava" },
      { slug: "guipuzcoa", label: "Guipúzcoa" },
      { slug: "vizcaya", label: "Vizcaya" },
    ],
  },
] as const satisfies readonly ProvinceGroup[];

// Japan under the standard eight-region division (八地方区分). The catalog unit
// stays `provincia`: a prefecture is the province, and a region is the CSV
// folder, the same role a comunidad plays in Spain. Labels are rōmaji without
// macrons so slug and label agree.
const JAPAN_GROUPS = [
  {
    slug: "hokkaido",
    label: "Hokkaido",
    provinces: [{ slug: "hokkaido", label: "Hokkaido" }],
  },
  {
    slug: "tohoku",
    label: "Tohoku",
    provinces: [
      { slug: "aomori", label: "Aomori" },
      { slug: "iwate", label: "Iwate" },
      { slug: "miyagi", label: "Miyagi" },
      { slug: "akita", label: "Akita" },
      { slug: "yamagata", label: "Yamagata" },
      { slug: "fukushima", label: "Fukushima" },
    ],
  },
  {
    slug: "kanto",
    label: "Kanto",
    provinces: [
      { slug: "ibaraki", label: "Ibaraki" },
      { slug: "tochigi", label: "Tochigi" },
      { slug: "gunma", label: "Gunma" },
      { slug: "saitama", label: "Saitama" },
      { slug: "chiba", label: "Chiba" },
      { slug: "tokyo", label: "Tokyo" },
      { slug: "kanagawa", label: "Kanagawa" },
    ],
  },
  {
    slug: "chubu",
    label: "Chubu",
    provinces: [
      { slug: "niigata", label: "Niigata" },
      { slug: "toyama", label: "Toyama" },
      { slug: "ishikawa", label: "Ishikawa" },
      { slug: "fukui", label: "Fukui" },
      { slug: "yamanashi", label: "Yamanashi" },
      { slug: "nagano", label: "Nagano" },
      { slug: "gifu", label: "Gifu" },
      { slug: "shizuoka", label: "Shizuoka" },
      { slug: "aichi", label: "Aichi" },
    ],
  },
  {
    slug: "kansai",
    label: "Kansai",
    provinces: [
      { slug: "mie", label: "Mie" },
      { slug: "shiga", label: "Shiga" },
      { slug: "kyoto", label: "Kyoto" },
      { slug: "osaka", label: "Osaka" },
      { slug: "hyogo", label: "Hyogo" },
      { slug: "nara", label: "Nara" },
      { slug: "wakayama", label: "Wakayama" },
    ],
  },
  {
    slug: "chugoku",
    label: "Chugoku",
    provinces: [
      { slug: "tottori", label: "Tottori" },
      { slug: "shimane", label: "Shimane" },
      { slug: "okayama", label: "Okayama" },
      { slug: "hiroshima", label: "Hiroshima" },
      { slug: "yamaguchi", label: "Yamaguchi" },
    ],
  },
  {
    slug: "shikoku",
    label: "Shikoku",
    provinces: [
      { slug: "tokushima", label: "Tokushima" },
      { slug: "kagawa", label: "Kagawa" },
      { slug: "ehime", label: "Ehime" },
      { slug: "kochi", label: "Kochi" },
    ],
  },
  {
    slug: "kyushu-okinawa",
    label: "Kyushu y Okinawa",
    provinces: [
      { slug: "fukuoka", label: "Fukuoka" },
      { slug: "saga", label: "Saga" },
      { slug: "nagasaki", label: "Nagasaki" },
      { slug: "kumamoto", label: "Kumamoto" },
      { slug: "oita", label: "Oita" },
      { slug: "miyazaki", label: "Miyazaki" },
      { slug: "kagoshima", label: "Kagoshima" },
      { slug: "okinawa", label: "Okinawa" },
    ],
  },
] as const satisfies readonly ProvinceGroup[];

// The country slug is the ISO 3166-1 alpha-2 code and is used verbatim in both
// places it appears: the `/es` and `/jp` routes and the first folder of every
// data path (`data/csv/es/catalunya/barcelona.csv`), so there is no URL-to-disk
// mapping to keep in sync.
const PROVINCE_COUNTRIES = [
  {
    slug: "es",
    label: "España",
    unit: "provincia",
    unitPlural: "provincias",
    groupUnitPlural: "comunidades",
    groups: SPAIN_GROUPS,
  },
  {
    slug: "jp",
    label: "Japón",
    unit: "prefectura",
    unitPlural: "prefecturas",
    groupUnitPlural: "regiones",
    groups: JAPAN_GROUPS,
  },
] as const;

const PROVINCE_REGISTRY: Map<string, ProvinceRegistryEntry> = new Map(
  PROVINCE_COUNTRIES.flatMap((country) =>
    country.groups.flatMap((group) =>
      group.provinces.map((province) => [
        province.slug,
        { ...province, countrySlug: country.slug, communitySlug: group.slug },
      ]),
    ),
  ),
);

export function normalizeProvinceSlug(province: string): string {
  const slug = cleanCell(province)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  const provinceAliases: Record<string, string> = {
    logrono: "la-rioja",
    kioto: "kyoto",
    tokio: "tokyo",
  };
  const normalizedSlug = provinceAliases[slug] ?? slug;

  return PROVINCE_REGISTRY.has(normalizedSlug) ? normalizedSlug : "";
}

function resolveProvinceCsvPath(province: string): string {
  const normalizedProvince = normalizeProvinceSlug(province);
  const registryEntry = PROVINCE_REGISTRY.get(normalizedProvince);

  if (!registryEntry) {
    throw new Error(`Unknown province '${province}'.`);
  }

  return path.resolve(
    process.cwd(),
    CSV_DATA_DIR,
    registryEntry.countrySlug,
    registryEntry.communitySlug,
    `${normalizedProvince}.csv`,
  );
}

export function getProvinceLabel(province: string): string {
  return PROVINCE_REGISTRY.get(normalizeProvinceSlug(province))?.label ?? "";
}

export function getProvinceCountrySlug(province: string): string {
  return PROVINCE_REGISTRY.get(normalizeProvinceSlug(province))?.countrySlug ?? "";
}

export function findProvinceCountry(country: string): ProvinceCountry | null {
  const normalized = cleanCell(country).toLowerCase();
  return listProvinceCountries().find((entry) => entry.slug === normalized) ?? null;
}

export function listCountrySlugs(): string[] {
  return PROVINCE_COUNTRIES.map(({ slug }) => slug);
}

export function listProvinces(): ProvinceOption[] {
  return PROVINCE_COUNTRIES.flatMap(({ groups }) =>
    groups.flatMap(({ provinces }) => provinces.map(({ slug, label }) => ({ slug, label }))),
  );
}

export function listProvinceCountries(): ProvinceCountry[] {
  return PROVINCE_COUNTRIES.map(({ slug, label, unit, unitPlural, groupUnitPlural, groups }) => ({
    slug,
    label,
    unit,
    unitPlural,
    groupUnitPlural,
    groups: groups.map(({ slug: groupSlug, label: groupLabel, provinces }) => ({
      slug: groupSlug,
      label: groupLabel,
      provinces: provinces.map(({ slug: provinceSlug, label: provinceLabel }) => ({
        slug: provinceSlug,
        label: provinceLabel,
      })),
    })),
  }));
}
const DEFAULT_PRODUCER_IMAGE_SRC = "/productores/generica.webp";
const ONLINE_SALES_COLUMN = "Venta online";
const DEFAULT_ONLINE_SALES_VALUE = "no comprobado";

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

async function loadCsvRows(province = ""): Promise<ProducerCsvRow[]> {
  const cacheKey = normalizeProvinceSlug(province);
  if (!cacheKey) {
    return [];
  }

  const cached = csvCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const csvPath = resolveProvinceCsvPath(cacheKey);
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

export async function findProducerBySlug(rawSegment: string, province = ""): Promise<ProducerCsvRow | null> {
  const segment = slugifySegment(rawSegment);
  if (!segment) {
    return null;
  }

  const rows = await loadCsvRows(province);
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

export async function listCategories(province = ""): Promise<string[]> {
  const rows = await loadCsvRows(province);
  const counts = new Map<string, number>();

  for (const row of rows) {
    const key = row.category.trim();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
    .map(([value]) => value);
}

export async function listMunicipalitySummaries(
  category = "",
  limit = 12,
  province = "",
): Promise<MunicipalitySummary[]> {
  const rows = await loadCsvRows(province);
  const normalizedCategory = normalizeSearch(category);
  const counts = new Map<string, number>();

  for (const row of rows) {
    if (normalizedCategory && normalizeSearch(row.category) !== normalizedCategory) {
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
        latitude: row.latitude,
        longitude: row.longitude,
      },
    ];
  });
}

export async function searchProducers(
  filters: ProducerSearchFilters,
  province = "",
): Promise<ProducerCsvRow[]> {
  const rows = await loadCsvRows(province);
  const normalizedMunicipality = normalizeSearch(filters.municipality);
  const normalizedCategory = normalizeSearch(filters.category);

  let results = rows.filter((row) => {
    const byMunicipality =
      !normalizedMunicipality ||
      normalizeSearch(row.city).includes(normalizedMunicipality);
    const byCategory =
      !normalizedCategory ||
      normalizeSearch(row.category) === normalizedCategory;

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
