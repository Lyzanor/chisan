import fs from "node:fs";
import path from "node:path";
import {
  APPLICATION_DEFAULT_LOCALE,
  hasLocale,
  type Locale,
} from "../i18n/locales";
import {
  normalizeProducerRouteAliasKey,
  normalizeStoredProducerRouteAliasKey,
} from "../producer-route-aliases";
const CSV_DATA_DIR = "data/csv";
const COUNTRY_MANIFEST = "country.json";
function cleanCell(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

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

export function resolveAreaCsvPath(country: string, area: string): string {
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
