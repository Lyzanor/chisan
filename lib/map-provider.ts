const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const OSM_HOME_URL = "https://www.openstreetmap.org";

export type MapProviderId = "osm" | "custom";

export type MapTileLayerConfig = {
  provider: MapProviderId;
  providerLabel: string;
  tileUrl: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string[];
};

export type MapExternalLinks = {
  provider: MapProviderId;
  providerLabel: string;
  mapUrl: string;
  directionsUrl: string;
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

function parseProvider(value: string | undefined): MapProviderId {
  const normalized = normalizeText(value)?.toLowerCase();

  if (!normalized || normalized === "osm" || normalized === "openstreetmap") {
    return "osm";
  }

  if (normalized === "custom") {
    return "custom";
  }

  return "osm";
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

function getProviderLabel(provider: MapProviderId, env: NodeJS.ProcessEnv): string {
  const override = normalizeText(env.NEXT_PUBLIC_MAP_PROVIDER_LABEL);
  if (override) {
    return override;
  }

  if (provider === "custom") {
    return "Mapa externo";
  }

  return "OpenStreetMap";
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

function getOsmFallbackDirectionsUrl(
  latitude: number | null,
  longitude: number | null,
  fallbackQuery: string | null,
): string {
  if (latitude !== null && longitude !== null) {
    return `https://www.openstreetmap.org/directions?to=${latitude}%2C${longitude}`;
  }

  if (fallbackQuery) {
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(fallbackQuery)}`;
  }

  return OSM_HOME_URL;
}

export function getMapTileLayerConfig(env: NodeJS.ProcessEnv = process.env): MapTileLayerConfig {
  const provider = parseProvider(env.NEXT_PUBLIC_MAP_PROVIDER);
  const providerLabel = getProviderLabel(provider, env);

  return {
    provider,
    providerLabel,
    tileUrl: normalizeText(env.NEXT_PUBLIC_MAP_TILE_URL) ?? OSM_TILE_URL,
    attribution: normalizeText(env.NEXT_PUBLIC_MAP_ATTRIBUTION) ?? OSM_ATTRIBUTION,
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
  const provider = parseProvider(env.NEXT_PUBLIC_MAP_PROVIDER);
  const providerLabel = getProviderLabel(provider, env);

  const viewTemplate = normalizeText(env.NEXT_PUBLIC_MAP_VIEW_URL_TEMPLATE);
  const directionsTemplate = normalizeText(env.NEXT_PUBLIC_MAP_DIRECTIONS_URL_TEMPLATE);
  const homeUrl = normalizeText(env.NEXT_PUBLIC_MAP_HOME_URL) ?? OSM_HOME_URL;

  if (provider === "custom") {
    const mapUrl = viewTemplate
      ? applyTemplate(viewTemplate, {
          latitude,
          longitude,
          query: fallbackQuery,
        })
      : homeUrl;

    const directionsUrl = directionsTemplate
      ? applyTemplate(directionsTemplate, {
          latitude,
          longitude,
          query: fallbackQuery,
        })
      : mapUrl;

    return {
      provider,
      providerLabel,
      mapUrl,
      directionsUrl,
    };
  }

  return {
    provider,
    providerLabel,
    mapUrl: getOsmFallbackMapUrl(latitude, longitude, fallbackQuery),
    directionsUrl: getOsmFallbackDirectionsUrl(latitude, longitude, fallbackQuery),
  };
}
