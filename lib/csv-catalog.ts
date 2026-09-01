import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { parse } from "csv-parse/sync";

import categoriesRegistry from "@/data/reference/categories.json";

import {
  APPLICATION_DEFAULT_LOCALE,
  hasDescriptionSourceLocale,
  hasLocale,
  type Locale,
} from "./i18n/locales";
import {
  TRANSLATABLE_PRODUCER_FIELDS,
  TRANSLATABLE_PRODUCER_FIELD_LOCALES,
  TRANSLATION_SIDECAR_HEADER,
  parseProducerTranslations,
  resolveLocalizedProducerField,
  type ProducerTranslation,
  type RawProducerTranslation,
} from "./i18n/translations";
import {
  normalizeProducerRouteAliasKey,
  normalizeStoredProducerRouteAliasKey,
} from "./producer-route-aliases";

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
  publicationStatus: CountryPublicationStatus;
  label: string;
  labels: LocalizedLabels;
  unit: UnitName;
  unitLabels: Partial<Record<Locale, UnitName>>;
  regionUnit: UnitName;
  regionUnitLabels: Partial<Record<Locale, UnitName>>;
  regions: Region[];
};

export type CountryPublicationStatus = "published" | "standby";

type LocalizedCatalogItem = {
  slug: string;
  labels: LocalizedLabels;
};

export function getLocalizedCatalogLabel(
  item: LocalizedCatalogItem,
  locale: Locale,
): string {
  const label = item.labels[locale];
  if (!label) {
    throw new Error(
      `Catalog item '${item.slug}' has no label for locale '${locale}'`,
    );
  }
  return label;
}

export function getLocalizedCatalogUnit(
  country: Country,
  locale: Locale,
  level: "area" | "region" = "area",
): UnitName {
  const unit =
    level === "region"
      ? country.regionUnitLabels[locale]
      : country.unitLabels[locale];
  if (!unit) {
    throw new Error(
      `Country '${country.slug}' has no ${level} unit labels for locale '${locale}'`,
    );
  }
  return unit;
}

// Neutral word for the unit, for copy written outside any country.
export const CATALOG_UNIT: UnitName = { one: "area", many: "areas" };

type CountryManifest = {
  publicationStatus?: unknown;
  label: string;
  unit: UnitName;
  regionUnit: UnitName;
  aliases?: Record<string, string>;
  producerRouteAliases?: Record<string, number>;
  i18n: {
    defaultLocale: string;
    publishedLocales: string[];
    labels: Record<string, string>;
    unitLabels: Record<string, Partial<UnitName>>;
    regionUnitLabels: Record<string, Partial<UnitName>>;
  };
  regions?: {
    slug: string;
    label: string;
    labels?: Record<string, string>;
    i18n?: {
      preferredLocale?: string;
      publishedLocales?: string[];
    };
    areas?: {
      slug: string;
      label: string;
      labels?: Record<string, string>;
      i18n?: {
        preferredLocale?: string;
        publishedLocales?: string[];
      };
    }[];
  }[];
};

function countryPublicationStatus(
  value: unknown,
  owner: string,
): CountryPublicationStatus {
  if (value === undefined) return "published";
  if (value !== "published" && value !== "standby") {
    throw new Error(
      `${owner}: publicationStatus must be either 'published' or 'standby'`,
    );
  }
  return value;
}

type AreaRegistryEntry = AreaOption & {
  countrySlug: string;
  regionSlug: string;
};

export type AreaLocation = AreaRegistryEntry;

function configuredLocales(
  value: string[] | undefined,
  fallback: readonly Locale[],
  owner: string,
): Locale[] {
  if (value === undefined) return [...fallback];
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(
      `${owner}: i18n.publishedLocales must be a non-empty array`,
    );
  }
  const locales: Locale[] = [];
  for (const locale of value) {
    if (!hasLocale(locale))
      throw new Error(`${owner}: unsupported locale '${locale}'`);
    if (locales.includes(locale))
      throw new Error(`${owner}: duplicate locale '${locale}'`);
    locales.push(locale);
  }
  return locales;
}

function localizedLabels(
  value: Record<string, string>,
  requiredLocales: readonly Locale[],
  owner: string,
): LocalizedLabels {
  const labels: LocalizedLabels = {};

  for (const [locale, label] of Object.entries(value ?? {})) {
    if (!hasLocale(locale))
      throw new Error(`${owner}: unsupported label locale '${locale}'`);
    if (typeof label !== "string" || !label.trim()) {
      throw new Error(
        `${owner}: label for '${locale}' must be a non-empty string`,
      );
    }
    labels[locale] = label;
  }
  for (const locale of requiredLocales) {
    if (!labels[locale])
      throw new Error(`${owner}: label for '${locale}' is required`);
  }

  return labels;
}

function localizedUnitNames(
  value: Record<string, Partial<UnitName>>,
  requiredLocales: readonly Locale[],
  owner: string,
): Partial<Record<Locale, UnitName>> {
  const labels: Partial<Record<Locale, UnitName>> = {};

  for (const [locale, unit] of Object.entries(value ?? {})) {
    if (!hasLocale(locale))
      throw new Error(`${owner}: unsupported unit locale '${locale}'`);
    if (!unit || typeof unit !== "object") {
      throw new Error(
        `${owner}: unit labels for '${locale}' must be an object`,
      );
    }
    const one = typeof unit.one === "string" && unit.one.trim() ? unit.one : "";
    const many =
      typeof unit.many === "string" && unit.many.trim() ? unit.many : "";
    if (!one || !many) {
      throw new Error(
        `${owner}: unit labels for '${locale}' require non-empty one and many`,
      );
    }
    labels[locale] = { one, many };
  }
  for (const locale of requiredLocales) {
    if (!labels[locale])
      throw new Error(`${owner}: unit labels for '${locale}' are required`);
  }
  return labels;
}

function effectivePreferredLocale(
  value: string | undefined,
  inherited: Locale,
  defaultLocale: Locale,
  publishedLocales: readonly Locale[],
  owner: string,
): Locale {
  if (!publishedLocales.includes(defaultLocale)) {
    throw new Error(
      `${owner}: effective locales must retain default locale '${defaultLocale}'`,
    );
  }
  if (value !== undefined) {
    if (!hasLocale(value))
      throw new Error(`${owner}: unsupported preferred locale '${value}'`);
    if (!publishedLocales.includes(value)) {
      throw new Error(
        `${owner}: preferred locale '${value}' must be published`,
      );
    }
    return value;
  }
  return publishedLocales.includes(inherited) ? inherited : defaultLocale;
}

function validateOptionalLocalePolicy(value: unknown, owner: string): void {
  if (
    value !== undefined &&
    (!value || typeof value !== "object" || Array.isArray(value))
  ) {
    throw new Error(`${owner}: i18n must be an object`);
  }
}

function validateDeclaredCatalogNodes(
  entries: readonly { slug?: unknown }[],
  actualSlugs: readonly string[],
  nodeType: "region" | "area",
  owner: string,
): void {
  const actual = new Set(actualSlugs);
  const seen = new Set<string>();
  for (const entry of entries) {
    if (typeof entry.slug !== "string" || !entry.slug) {
      throw new Error(
        `${owner}: declared ${nodeType} slug must be a non-empty string`,
      );
    }
    if (seen.has(entry.slug)) {
      throw new Error(
        `${owner}: duplicate declared ${nodeType} '${entry.slug}'`,
      );
    }
    seen.add(entry.slug);
    if (!actual.has(entry.slug)) {
      throw new Error(
        `${owner}: declared ${nodeType} '${entry.slug}' does not exist in the CSV tree`,
      );
    }
  }
}

// The tree is the source of truth for *what exists*: a country is a folder under
// data/csv, a region is a folder inside it and an area is a CSV inside that. The
// country.json supplies the required locale policy, display labels, units and
// ordering for the catalog tree. Dropping a new CSV in is therefore enough to
// add data only after its country's manifest remains contract-complete.
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
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`${manifestPath}: country manifest is required`);
    }
    const manifest = JSON.parse(
      fs.readFileSync(manifestPath, "utf8"),
    ) as CountryManifest;
    const publicationStatus = countryPublicationStatus(
      manifest.publicationStatus,
      manifestPath,
    );
    if (
      !manifest.label ||
      !manifest.unit?.one ||
      !manifest.unit?.many ||
      !manifest.regionUnit?.one ||
      !manifest.regionUnit?.many
    ) {
      throw new Error(
        `${manifestPath}: label, unit and regionUnit are required`,
      );
    }
    if (!manifest.i18n || !hasLocale(manifest.i18n.defaultLocale)) {
      throw new Error(`${manifestPath}: i18n.defaultLocale is required`);
    }
    if (
      !Array.isArray(manifest.i18n.publishedLocales) ||
      manifest.i18n.publishedLocales.length === 0
    ) {
      throw new Error(`${manifestPath}: i18n.publishedLocales is required`);
    }
    for (const field of ["labels", "unitLabels", "regionUnitLabels"] as const) {
      if (!manifest.i18n[field] || typeof manifest.i18n[field] !== "object") {
        throw new Error(`${manifestPath}: i18n.${field} is required`);
      }
    }
    const defaultLocale = manifest.i18n.defaultLocale;
    const configuredCountryLocales = configuredLocales(
      manifest.i18n.publishedLocales,
      [defaultLocale],
      manifestPath,
    );
    if (!configuredCountryLocales.includes(defaultLocale)) {
      throw new Error(
        `${manifestPath}: i18n.publishedLocales must include defaultLocale '${defaultLocale}'`,
      );
    }
    const publishedLocales = configuredCountryLocales;
    const preferredLocale = defaultLocale;
    const countryLabel = manifest.label;
    const unit = manifest.unit;
    const regionUnit = manifest.regionUnit;
    const requiredCountryLocales = new Set<Locale>([
      ...publishedLocales,
      APPLICATION_DEFAULT_LOCALE,
    ]);

    const declaredRegions = manifest.regions ?? [];
    const actualRegionSlugs = directories(countryDir);
    validateDeclaredCatalogNodes(
      declaredRegions,
      actualRegionSlugs,
      "region",
      manifestPath,
    );
    const regionOrder = new Map(
      declaredRegions.map((region, index) => [region.slug, index]),
    );
    const regionSlugs = actualRegionSlugs.sort((a, b) => {
      const left = regionOrder.get(a) ?? Number.MAX_SAFE_INTEGER;
      const right = regionOrder.get(b) ?? Number.MAX_SAFE_INTEGER;
      return left - right || a.localeCompare(b);
    });

    const regions = regionSlugs.map((regionSlug) => {
      const declared = declaredRegions.find(
        (region) => region.slug === regionSlug,
      );
      const regionOwner = `${manifestPath}: region '${regionSlug}'`;
      validateOptionalLocalePolicy(declared?.i18n, regionOwner);
      const declaredAreas = declared?.areas ?? [];
      const regionPublishedLocales = configuredLocales(
        declared?.i18n?.publishedLocales,
        publishedLocales,
        regionOwner,
      );
      const regionPreferredLocale = effectivePreferredLocale(
        declared?.i18n?.preferredLocale,
        preferredLocale,
        defaultLocale,
        regionPublishedLocales,
        regionOwner,
      );
      if (!declared?.label)
        throw new Error(
          `${manifestPath}: region '${regionSlug}' label is required`,
        );
      const regionLabel = declared.label;
      const actualAreaSlugs = fs
        .readdirSync(path.join(countryDir, regionSlug))
        .filter((file) => file.endsWith(".csv"))
        .map((file) => file.slice(0, -".csv".length));
      validateDeclaredCatalogNodes(
        declaredAreas,
        actualAreaSlugs,
        "area",
        `${manifestPath}: region '${regionSlug}'`,
      );
      const areaOrder = new Map(
        declaredAreas.map((area, index) => [area.slug, index]),
      );
      const areaSlugs = actualAreaSlugs.sort((a, b) => {
        const left = areaOrder.get(a) ?? Number.MAX_SAFE_INTEGER;
        const right = areaOrder.get(b) ?? Number.MAX_SAFE_INTEGER;
        return left - right || a.localeCompare(b);
      });

      const areas = areaSlugs.map((areaSlug) => {
        const declaredArea = declaredAreas.find(
          (area) => area.slug === areaSlug,
        );
        const areaOwner = `${manifestPath}: area '${regionSlug}/${areaSlug}'`;
        validateOptionalLocalePolicy(declaredArea?.i18n, areaOwner);
        const areaPublishedLocales = configuredLocales(
          declaredArea?.i18n?.publishedLocales,
          regionPublishedLocales,
          areaOwner,
        );
        const areaPreferredLocale = effectivePreferredLocale(
          declaredArea?.i18n?.preferredLocale,
          regionPreferredLocale,
          defaultLocale,
          areaPublishedLocales,
          areaOwner,
        );
        if (!declaredArea?.label)
          throw new Error(`${areaOwner} label is required`);
        for (const locale of areaPublishedLocales)
          requiredCountryLocales.add(locale);

        return {
          slug: areaSlug,
          label: declaredArea.label,
          labels: localizedLabels(
            declaredArea.labels ?? {},
            [...new Set([...areaPublishedLocales, APPLICATION_DEFAULT_LOCALE])],
            areaOwner,
          ),
          defaultLocale,
          publishedLocales: areaPublishedLocales,
          preferredLocale: areaPreferredLocale,
        };
      });
      const requiredRegionLocales = new Set<Locale>([
        ...regionPublishedLocales,
        APPLICATION_DEFAULT_LOCALE,
      ]);
      for (const area of areas) {
        for (const locale of area.publishedLocales)
          requiredRegionLocales.add(locale);
      }
      for (const locale of requiredRegionLocales)
        requiredCountryLocales.add(locale);

      return {
        slug: regionSlug,
        label: regionLabel,
        labels: localizedLabels(
          declared.labels ?? {},
          [...requiredRegionLocales],
          `${manifestPath}: region '${regionSlug}'`,
        ),
        defaultLocale,
        publishedLocales: regionPublishedLocales,
        preferredLocale: regionPreferredLocale,
        areas,
      };
    });

    return {
      slug: countrySlug,
      publicationStatus,
      label: countryLabel,
      labels: localizedLabels(
        manifest.i18n.labels,
        [...requiredCountryLocales],
        manifestPath,
      ),
      unit,
      unitLabels: localizedUnitNames(
        manifest.i18n.unitLabels,
        [...requiredCountryLocales],
        `${manifestPath}: i18n.unitLabels`,
      ),
      regionUnit,
      regionUnitLabels: localizedUnitNames(
        manifest.i18n.regionUnitLabels,
        [...requiredCountryLocales],
        `${manifestPath}: i18n.regionUnitLabels`,
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
    const manifest = JSON.parse(
      fs.readFileSync(manifestPath, "utf8"),
    ) as CountryManifest;
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
    const manifest = JSON.parse(
      fs.readFileSync(manifestPath, "utf8"),
    ) as CountryManifest;
    const configuredAliases: unknown = manifest.producerRouteAliases;
    if (
      configuredAliases !== undefined &&
      (!configuredAliases ||
        typeof configuredAliases !== "object" ||
        Array.isArray(configuredAliases))
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

  return AREA_REGISTRY.has(areaRegistryKey(countrySlug, normalizedSlug))
    ? normalizedSlug
    : "";
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
  return (
    AREA_REGISTRY.get(areaRegistryKey(countrySlug, normalizedArea)) ?? null
  );
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

export function isCatalogCountryPublished(
  country: Pick<Country, "publicationStatus">,
): boolean {
  return country.publicationStatus === "published";
}

export function listPublishedCountries(): Country[] {
  return COUNTRIES.filter(isCatalogCountryPublished);
}

export function findCountry(country: string): Country | null {
  const normalized = cleanCell(country).toLowerCase();
  return COUNTRIES.find((entry) => entry.slug === normalized) ?? null;
}

export function findPublishedCountry(country: string): Country | null {
  const match = findCountry(country);
  return match && isCatalogCountryPublished(match) ? match : null;
}

export function listCountrySlugs(): string[] {
  return COUNTRIES.map(({ slug }) => slug);
}

const DEFAULT_PRODUCER_IMAGE_SRC = "/productores/generica.webp";
const ONLINE_SALES_COLUMN = "Venta online";
const ONLINE_SALES_VALUES = new Set(["sí", "no", "no comprobado"]);
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
const translationCache = new Map<string, Promise<ProducerTranslation[]>>();
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

async function loadCountryTranslations(
  country: string,
  targetLocale: Locale,
): Promise<ProducerTranslation[]> {
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
    if (raw.startsWith("\uFEFF"))
      throw new Error(`${sidecarPath}: UTF-8 BOM is not allowed`);
    if (raw.includes("\r"))
      throw new Error(`${sidecarPath}: only LF line endings are allowed`);
    const records = parse(raw, {
      bom: false,
      skip_empty_lines: true,
    }) as string[][];
    const header = records[0] ?? [];
    if (
      header.length !== TRANSLATION_SIDECAR_HEADER.length ||
      header.some(
        (column, index) => column !== TRANSLATION_SIDECAR_HEADER[index],
      )
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
      ) as RawProducerTranslation;
    });
    return parseProducerTranslations(rows, targetLocale);
  })();
  translationCache.set(cacheKey, pending);
  void pending.catch(() => {
    if (translationCache.get(cacheKey) === pending)
      translationCache.delete(cacheKey);
  });
  return pending;
}

export function localizeProducerFields(
  rows: readonly ProducerCsvRow[],
  requestedLocale: Locale,
  translations: readonly ProducerTranslation[],
): ProducerCsvRow[] {
  return rows.map((row) => {
    let localizedFields: Record<string, string> | null = null;
    for (const field of TRANSLATABLE_PRODUCER_FIELDS) {
      const localeField = TRANSLATABLE_PRODUCER_FIELD_LOCALES[field];
      const text = row.fields[field] ?? "";
      const sourceLocale = row.fields[localeField];
      if (!text) continue;
      if (!hasDescriptionSourceLocale(sourceLocale)) {
        localizedFields ??= { ...row.fields };
        localizedFields[field] = "";
        localizedFields[localeField] = "";
        continue;
      }

      const resolved = resolveLocalizedProducerField(
        {
          producerId: String(row.producerId),
          field,
          text,
          locale: sourceLocale,
        },
        requestedLocale,
        translations,
      );
      const localizedText = resolved?.text ?? "";
      if (localizedText === text && sourceLocale === requestedLocale) continue;
      localizedFields ??= { ...row.fields };
      localizedFields[field] = localizedText;
      localizedFields[localeField] = resolved?.locale ?? "";
    }
    return localizedFields ? { ...row, fields: localizedFields } : row;
  });
}

export const localizeProducerDescriptions = localizeProducerFields;

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
  countries: readonly Country[] = COUNTRIES,
): Promise<
  { country: string; area: string; slug: string }[]
> {
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
