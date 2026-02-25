const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const OSM_HOME_URL = "https://www.openstreetmap.org";
const OSM_PROVIDER_LABEL = "OpenStreetMap";

export type MapTileLayerConfig = {
  tileUrl: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string[];
};

export type MapExternalLinks = {
  providerLabel: string;
  mapUrl: string;
};

function normalizeText(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  const normalized = normalizeText(value);
  if (!normalized) {
    return fallback;
  }

  const parsed = Number.parseInt(normalized, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function parseSubdomains(value: string | undefined): string[] | undefined {
  const normalized = normalizeText(value);
  if (!normalized) {
    return undefined;
  }

  const values = normalized
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return values.length > 0 ? values : undefined;
}

function applyTemplate(
  template: string,
  params: { latitude: number | null; longitude: number | null; query: string | null },
): string {
  const latitude = params.latitude !== null ? params.latitude.toFixed(6) : "";
  const longitude = params.longitude !== null ? params.longitude.toFixed(6) : "";
  const queryRaw = params.query ?? "";
  const query = encodeURIComponent(queryRaw);

  return template
    .replaceAll("{lat}", latitude)
    .replaceAll("{lon}", longitude)
    .replaceAll("{query}", query)
    .replaceAll("{query_raw}", queryRaw);
}

function getOsmFallbackMapUrl(
  latitude: number | null,
  longitude: number | null,
  fallbackQuery: string | null,
): string {
  if (latitude !== null && longitude !== null) {
    return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;
  }

  if (fallbackQuery) {
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(fallbackQuery)}`;
  }

  return OSM_HOME_URL;
}

export function getMapTileLayerConfig(env: NodeJS.ProcessEnv = process.env): MapTileLayerConfig {
  const explicitTileUrl = normalizeText(env.NEXT_PUBLIC_MAP_TILE_URL);
  const explicitAttribution = normalizeText(env.NEXT_PUBLIC_MAP_ATTRIBUTION);

  return {
    tileUrl: explicitTileUrl ?? OSM_TILE_URL,
    attribution: explicitAttribution ?? OSM_ATTRIBUTION,
    maxZoom: parsePositiveInteger(env.NEXT_PUBLIC_MAP_MAX_ZOOM, 19),
    subdomains: parseSubdomains(env.NEXT_PUBLIC_MAP_SUBDOMAINS),
  };
}

export function getMapExternalLinks(
  latitude: number | null,
  longitude: number | null,
  fallbackQuery: string | null,
  env: NodeJS.ProcessEnv = process.env,
): MapExternalLinks {
  const viewTemplate = normalizeText(env.NEXT_PUBLIC_MAP_VIEW_URL_TEMPLATE);
  if (viewTemplate) {
    return {
      providerLabel: OSM_PROVIDER_LABEL,
      mapUrl: applyTemplate(viewTemplate, {
        latitude,
        longitude,
        query: fallbackQuery,
      }),
    };
  }

  return {
    providerLabel: OSM_PROVIDER_LABEL,
    mapUrl: getOsmFallbackMapUrl(latitude, longitude, fallbackQuery),
  };
}
