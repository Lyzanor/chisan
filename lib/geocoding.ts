import { BARCELONA_PROVINCE, isWithinBarcelonaProvince } from "./barcelona";

const NOMINATIM_DEFAULT_BASE_URL = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_DEFAULT_TIMEOUT_MS = 15000;
const NOMINATIM_DEFAULT_DELAY_MS = 1100;
const NOMINATIM_DEFAULT_RETRIES = 3;
const DEFAULT_GEOCODING_PROVIDER = "nominatim";

export type GeocodingProvider = "nominatim";

export type GeocodingConfig = {
  provider: GeocodingProvider;
  enabled: boolean;
  baseUrl: string;
  userAgent: string;
  email: string | null;
  delayMs: number;
  retries: number;
  timeoutMs: number;
  maxRequests: number | null;
  strictBarcelonaBounds: boolean;
};

export type GeocodeLookupResult =
  | {
      status: "SUCCESS";
      source: GeocodingProvider;
      queryText: string;
      latitude: number;
      longitude: number;
    }
  | {
      status: "NOT_FOUND";
      source: GeocodingProvider;
      queryText: string;
    }
  | {
      status: "ERROR";
      source: GeocodingProvider;
      queryText: string;
      error: string;
    };

type NominatimSearchRow = {
  lat?: string;
  lon?: string;
};

type GeoPoint = {
  latitude: number;
  longitude: number;
};

class HttpStatusError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpStatusError";
    this.status = status;
  }
}

function parseNumber(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

function isValidCoordinates(latitude: number, longitude: number): boolean {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function parseOptionalLimit(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function shouldEnableGeocoding(value: string | undefined): boolean {
  if (!value) {
    return true;
  }

  const normalized = value.trim().toLowerCase();
  return !["0", "false", "no", "off"].includes(normalized);
}

function asErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "unknown geocoding error";
}

function parseGeocodingProvider(value: string | undefined): GeocodingProvider {
  const normalized = value?.trim().toLowerCase();
  if (!normalized || normalized === "nominatim") {
    return DEFAULT_GEOCODING_PROVIDER;
  }

  throw new Error(
    `Unsupported GEOCODING_PROVIDER="${value}". Supported providers: nominatim`,
  );
}

function getDefaultBaseUrl(provider: GeocodingProvider): string {
  if (provider === "nominatim") {
    return NOMINATIM_DEFAULT_BASE_URL;
  }

  return NOMINATIM_DEFAULT_BASE_URL;
}

function normalizeBaseUrl(value: string | undefined, provider: GeocodingProvider): string {
  if (!value) {
    return getDefaultBaseUrl(provider);
  }

  return value;
}

function shouldUseStrictBarcelonaBounds(value: string | undefined): boolean {
  if (!value) {
    return true;
  }

  const normalized = value.trim().toLowerCase();
  return !["0", "false", "no", "off"].includes(normalized);
}

async function geocodeWithNominatim(
  queryText: string,
  config: GeocodingConfig,
): Promise<GeoPoint | null> {
  const url = new URL(config.baseUrl);
  url.searchParams.set("q", queryText);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "0");
  url.searchParams.set("countrycodes", "es");

  if (config.strictBarcelonaBounds) {
    url.searchParams.set(
      "viewbox",
      `${BARCELONA_PROVINCE.minLng},${BARCELONA_PROVINCE.maxLat},${BARCELONA_PROVINCE.maxLng},${BARCELONA_PROVINCE.minLat}`,
    );
    url.searchParams.set("bounded", "1");
  }

  if (config.email) {
    url.searchParams.set("email", config.email);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": config.userAgent,
        Accept: "application/json",
        "Accept-Language": "es,en;q=0.8",
      },
    });

    if (!response.ok) {
      throw new HttpStatusError(response.status, `Nominatim responded ${response.status}`);
    }

    const payload = (await response.json()) as NominatimSearchRow[];
    if (!Array.isArray(payload) || payload.length === 0) {
      return null;
    }

    const first = payload[0];
    const latitude = parseNumber(first.lat);
    const longitude = parseNumber(first.lon);

    if (latitude === null || longitude === null || !isValidCoordinates(latitude, longitude)) {
      return null;
    }

    if (config.strictBarcelonaBounds && !isWithinBarcelonaProvince(latitude, longitude)) {
      return null;
    }

    return { latitude, longitude };
  } finally {
    clearTimeout(timeout);
  }
}

async function geocodeOnce(queryText: string, config: GeocodingConfig): Promise<GeoPoint | null> {
  if (config.provider === "nominatim") {
    return geocodeWithNominatim(queryText, config);
  }

  return null;
}

export function getGeocodingConfigFromEnv(env: NodeJS.ProcessEnv = process.env): GeocodingConfig {
  const provider = parseGeocodingProvider(env.GEOCODING_PROVIDER);
  const baseUrlOverride = env.GEOCODING_BASE_URL ?? env.NOMINATIM_BASE_URL;

  return {
    provider,
    enabled: shouldEnableGeocoding(env.GEOCODING_ENABLED),
    baseUrl: normalizeBaseUrl(baseUrlOverride, provider),
    userAgent:
      env.NOMINATIM_USER_AGENT?.trim() ||
      "km0-mapa-seed/1.0 (local import; contact: set NOMINATIM_EMAIL)",
    email: env.NOMINATIM_EMAIL?.trim() || null,
    delayMs: parsePositiveInteger(env.GEOCODING_DELAY_MS, NOMINATIM_DEFAULT_DELAY_MS),
    retries: parsePositiveInteger(env.GEOCODING_RETRIES, NOMINATIM_DEFAULT_RETRIES),
    timeoutMs: parsePositiveInteger(env.GEOCODING_TIMEOUT_MS, NOMINATIM_DEFAULT_TIMEOUT_MS),
    maxRequests: parseOptionalLimit(env.GEOCODING_MAX_REQUESTS),
    strictBarcelonaBounds: shouldUseStrictBarcelonaBounds(env.GEOCODING_STRICT_BARCELONA_BOUNDS),
  };
}

export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildGeocodingQuery(fields: {
  name: string;
  address: string | null;
  city: string | null;
}): string {
  if (fields.address) {
    return [fields.address, fields.city, "Barcelona", "Catalunya", "España"]
      .filter((value): value is string => Boolean(value))
      .join(", ");
  }

  return [fields.name, fields.city, "Barcelona", "Catalunya", "España"]
    .filter((value): value is string => Boolean(value))
    .join(", ");
}

export async function geocodeWithRetry(
  queryText: string,
  config: GeocodingConfig,
): Promise<GeocodeLookupResult> {
  let lastError: string | null = null;

  for (let attempt = 1; attempt <= config.retries; attempt += 1) {
    try {
      const coordinates = await geocodeOnce(queryText, config);
      if (!coordinates) {
        return {
          status: "NOT_FOUND",
          source: config.provider,
          queryText,
        };
      }

      return {
        status: "SUCCESS",
        source: config.provider,
        queryText,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };
    } catch (error) {
      lastError = asErrorMessage(error);

      if (attempt === config.retries) {
        break;
      }

      const waitMs =
        error instanceof HttpStatusError && error.status === 429
          ? config.delayMs * 2 * attempt
          : 450 * attempt;

      await sleep(waitMs);
    }
  }

  return {
    status: "ERROR",
    source: config.provider,
    queryText,
    error: lastError ?? "geocoding request failed",
  };
}
