import { buildCatalogHref } from "../catalog-navigation";
import {
  buildCatalogScope,
  resolveDestinationLocale,
} from "../i18n/catalog-scope";
import type { Locale } from "../i18n/locales";
import {
  resolveCatalogArea,
  type CatalogAreaKey,
  type CatalogGeography,
  type CatalogPosition,
} from "./resolve-catalog-area";

export const CATALOG_GEOGRAPHY_INDEX_HREF =
  "/generated/catalog-geography/index.json";
export const LOCATION_ONBOARDING_STORAGE_KEY =
  "chisan:location-onboarding:v1";
export const LOCATION_REQUEST_OPTIONS = Object.freeze({
  enableHighAccuracy: false,
  timeout: 8_000,
  maximumAge: 5 * 60_000,
}) satisfies PositionOptions;

const COUNTRY_ASSET_HREF_PATTERN =
  /^\/generated\/catalog-geography\/[a-z0-9]+(?:-[a-z0-9]+)*\.json$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type CatalogGeographyIndexEntry = {
  country: string;
  bbox: [west: number, south: number, east: number, north: number];
  href: string;
  sha256: string;
};

export type CatalogGeographyIndex = {
  version: 1;
  countries: CatalogGeographyIndexEntry[];
};

export type LocationOnboardingArea = CatalogAreaKey & {
  label: string;
  defaultLocale: Locale;
  publishedLocales: readonly Locale[];
  preferredLocale: Locale;
};

export type CatalogLocationFailureReason =
  | "permission-denied"
  | "timeout"
  | "unavailable"
  | "outside"
  | "ambiguous"
  | "load-failed";

export type CatalogLocationLookupResult =
  | ({ status: "resolved" } & CatalogAreaKey)
  | { status: "failed"; reason: CatalogLocationFailureReason };

export type LocationOnboardingActivationResult =
  | {
      status: "navigated";
      area: CatalogAreaKey;
      href: string;
    }
  | { status: "failed"; reason: CatalogLocationFailureReason };

export type LocationOnboardingStorageV1 = {
  onboarding: "dismissed" | "resolved";
  area: CatalogAreaKey | null;
};

export type LocationStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

type FetchResponse = {
  ok: boolean;
  json(): Promise<unknown>;
};

export type LocationFetch = (
  input: string,
  init: Pick<RequestInit, "cache" | "credentials" | "method">,
) => Promise<FetchResponse>;

type LocationRequestDependencies = {
  geolocation: Pick<Geolocation, "getCurrentPosition"> | null;
  fetcher: LocationFetch;
};

type LocationActivationDependencies = {
  lookup: () => Promise<CatalogLocationLookupResult>;
  storage: LocationStorage | null;
  areas: readonly LocationOnboardingArea[];
  explicitLocale: Locale | null;
  browserLocales: readonly Locale[];
  navigate: (href: string) => void;
};

type PositionRequestResult =
  | { status: "available"; position: CatalogPosition }
  | {
      status: "failed";
      reason: "permission-denied" | "timeout" | "unavailable";
    };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return (
    actual.length === expected.length &&
    actual.every((key, index) => key === expected[index])
  );
}

function isCatalogAreaKey(value: unknown): value is CatalogAreaKey {
  return (
    isPlainObject(value) &&
    hasExactKeys(value, ["country", "area"]) &&
    typeof value.country === "string" &&
    SLUG_PATTERN.test(value.country) &&
    typeof value.area === "string" &&
    SLUG_PATTERN.test(value.area)
  );
}

function isBbox(value: unknown): value is CatalogGeographyIndexEntry["bbox"] {
  if (
    !Array.isArray(value) ||
    value.length !== 4 ||
    !value.every((coordinate) => Number.isFinite(coordinate))
  ) {
    return false;
  }
  const [west, south, east, north] = value;
  return (
    west >= -180 &&
    east <= 180 &&
    south >= -90 &&
    north <= 90 &&
    west < east &&
    south < north
  );
}

function isIndexEntry(value: unknown): value is CatalogGeographyIndexEntry {
  return (
    isPlainObject(value) &&
    typeof value.country === "string" &&
    SLUG_PATTERN.test(value.country) &&
    isBbox(value.bbox) &&
    typeof value.href === "string" &&
    COUNTRY_ASSET_HREF_PATTERN.test(value.href) &&
    value.href === `/generated/catalog-geography/${value.country}.json` &&
    typeof value.sha256 === "string" &&
    /^[a-f0-9]{64}$/.test(value.sha256)
  );
}

function parseGeographyIndex(value: unknown): CatalogGeographyIndex | null {
  if (
    !isPlainObject(value) ||
    value.version !== 1 ||
    !Array.isArray(value.countries) ||
    !value.countries.every(isIndexEntry)
  ) {
    return null;
  }
  const countries = value.countries;
  if (new Set(countries.map(({ country }) => country)).size !== countries.length) {
    return null;
  }
  return { version: 1, countries };
}

function parseCatalogGeography(value: unknown, country: string): CatalogGeography | null {
  if (
    !isPlainObject(value) ||
    value.version !== 1 ||
    value.country !== country ||
    value.type !== "FeatureCollection" ||
    !isPlainObject(value.source) ||
    !Number.isFinite(value.source.boundaryUncertaintyMeters) ||
    !Array.isArray(value.features)
  ) {
    return null;
  }
  return value as CatalogGeography;
}

function pointIsInBbox(
  position: CatalogPosition,
  [west, south, east, north]: CatalogGeographyIndexEntry["bbox"],
): boolean {
  return (
    position.longitude >= west &&
    position.longitude <= east &&
    position.latitude >= south &&
    position.latitude <= north
  );
}

export function countriesForPosition(
  position: CatalogPosition,
  index: CatalogGeographyIndex,
): CatalogGeographyIndexEntry[] {
  return index.countries.filter(({ bbox }) => pointIsInBbox(position, bbox));
}

function requestCurrentPosition(
  geolocation: Pick<Geolocation, "getCurrentPosition"> | null,
): Promise<PositionRequestResult> {
  if (!geolocation) {
    return Promise.resolve({ status: "failed", reason: "unavailable" });
  }

  return new Promise((resolve) => {
    try {
      geolocation.getCurrentPosition(
        ({ coords }) => {
          resolve({
            status: "available",
            position: {
              longitude: coords.longitude,
              latitude: coords.latitude,
              accuracyMeters: coords.accuracy,
            },
          });
        },
        ({ code }) => {
          const reason =
            code === 1
              ? "permission-denied"
              : code === 3
                ? "timeout"
                : "unavailable";
          resolve({ status: "failed", reason });
        },
        LOCATION_REQUEST_OPTIONS,
      );
    } catch {
      resolve({ status: "failed", reason: "unavailable" });
    }
  });
}

async function fetchJson(fetcher: LocationFetch, href: string): Promise<unknown> {
  const response = await fetcher(href, {
    method: "GET",
    cache: "force-cache",
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error("Catalog geography request failed");
  return response.json();
}

/**
 * Creates a one-shot action without invoking geolocation. The returned function
 * is intended to be called only from the explicit "Use my location" handler.
 */
export function createCatalogLocationRequest({
  geolocation,
  fetcher,
}: LocationRequestDependencies): () => Promise<CatalogLocationLookupResult> {
  return async () => {
    const requested = await requestCurrentPosition(geolocation);
    if (requested.status === "failed") return requested;

    try {
      const index = parseGeographyIndex(
        await fetchJson(fetcher, CATALOG_GEOGRAPHY_INDEX_HREF),
      );
      if (!index) return { status: "failed", reason: "load-failed" };

      const candidates = countriesForPosition(requested.position, index);
      if (candidates.length === 0) {
        return { status: "failed", reason: "outside" };
      }
      if (candidates.length !== 1) {
        return { status: "failed", reason: "ambiguous" };
      }

      const candidate = candidates[0];
      const geography = parseCatalogGeography(
        await fetchJson(fetcher, candidate.href),
        candidate.country,
      );
      if (!geography) return { status: "failed", reason: "load-failed" };

      const resolved = resolveCatalogArea(requested.position, geography);
      if (resolved.status === "resolved" && resolved.country === candidate.country) {
        return resolved;
      }
      return {
        status: "failed",
        reason: resolved.status === "outside" ? "outside" : "ambiguous",
      };
    } catch {
      return { status: "failed", reason: "load-failed" };
    }
  };
}

export function readLocationOnboardingStorage(
  storage: LocationStorage | null,
): LocationOnboardingStorageV1 | null {
  if (!storage) return null;
  try {
    return parseLocationOnboardingStorageValue(
      storage.getItem(LOCATION_ONBOARDING_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

export function parseLocationOnboardingStorageValue(
  raw: string | null,
): LocationOnboardingStorageV1 | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      !isPlainObject(value) ||
      !hasExactKeys(value, ["onboarding", "area"]) ||
      (value.onboarding !== "dismissed" && value.onboarding !== "resolved")
    ) {
      return null;
    }
    if (value.onboarding === "dismissed" && value.area === null) {
      return { onboarding: "dismissed", area: null };
    }
    if (value.onboarding === "resolved" && isCatalogAreaKey(value.area)) {
      return { onboarding: "resolved", area: value.area };
    }
  } catch {}
  return null;
}

function writeLocationOnboardingStorage(
  storage: LocationStorage | null,
  value: LocationOnboardingStorageV1,
): void {
  if (!storage) return;
  try {
    storage.setItem(LOCATION_ONBOARDING_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage may be unavailable or full; routing remains usable without it.
  }
}

export function rememberLocationOnboardingDismissal(
  storage: LocationStorage | null,
): LocationOnboardingStorageV1 {
  const value = { onboarding: "dismissed", area: null } as const;
  writeLocationOnboardingStorage(storage, value);
  return value;
}

export function forgetLocationOnboarding(storage: LocationStorage | null): void {
  if (!storage) return;
  try {
    storage.removeItem(LOCATION_ONBOARDING_STORAGE_KEY);
  } catch {
    // A failed removal cannot affect catalog navigation.
  }
}

function areaId(area: CatalogAreaKey): string {
  return `${area.country}/${area.area}`;
}

export function findEnabledLocationArea(
  area: CatalogAreaKey,
  areas: readonly LocationOnboardingArea[],
): LocationOnboardingArea | null {
  return areas.find((candidate) => areaId(candidate) === areaId(area)) ?? null;
}

export function buildLocationAreaHref(
  area: LocationOnboardingArea,
  explicitLocale: Locale | null,
  browserLocales: readonly Locale[],
): string {
  const locale = resolveDestinationLocale(area, {
    explicitLocale,
    browserLocales,
  });
  return buildCatalogHref({
    scope: buildCatalogScope(
      { slug: area.country, defaultLocale: area.defaultLocale },
      locale,
    ),
    area: area.area,
  });
}

export function resolveSavedLocationAreaHref({
  stored,
  areas,
  explicitLocale,
  browserLocales,
  manualSelectionRequested,
}: {
  stored: LocationOnboardingStorageV1 | null;
  areas: readonly LocationOnboardingArea[];
  explicitLocale: Locale | null;
  browserLocales: readonly Locale[];
  manualSelectionRequested: boolean;
}): string | null {
  if (
    manualSelectionRequested ||
    stored?.onboarding !== "resolved" ||
    !stored.area
  ) {
    return null;
  }

  const savedArea = findEnabledLocationArea(stored.area, areas);
  return savedArea
    ? buildLocationAreaHref(savedArea, explicitLocale, browserLocales)
    : null;
}

/**
 * Creates the user-activated workflow. Construction has no browser side
 * effects; lookup, storage and navigation occur only when the returned action
 * is invoked.
 */
export function createLocationOnboardingActivation({
  lookup,
  storage,
  areas,
  explicitLocale,
  browserLocales,
  navigate,
}: LocationActivationDependencies): () => Promise<LocationOnboardingActivationResult> {
  return async () => {
    const result = await lookup();
    if (result.status === "failed") return result;

    const area = findEnabledLocationArea(result, areas);
    if (!area) return { status: "failed", reason: "outside" };

    const href = buildLocationAreaHref(area, explicitLocale, browserLocales);
    writeLocationOnboardingStorage(storage, {
      onboarding: "resolved",
      area: { country: area.country, area: area.area },
    });
    navigate(href);
    return {
      status: "navigated",
      area: { country: area.country, area: area.area },
      href,
    };
  };
}
