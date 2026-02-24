const MULTI_SPACE_REGEX = /\s+/g;
const DIACRITIC_REGEX = /\p{Diacritic}/gu;
const KEY_SANITIZE_REGEX = /[^\p{L}\p{N}]+/gu;

export type Coordinates = {
  latitude: number | null;
  longitude: number | null;
};

function isValidCoordinates(latitude: number, longitude: number): boolean {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function normalizeText(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = value.replace(MULTI_SPACE_REGEX, " ").trim();
  return normalized.length > 0 ? normalized : null;
}

export function parseCoordinateValue(value: string | null | undefined): number | null {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseFloat(normalized.replace(",", "."));
  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

export function normalizeSearchQuery(value: string | null | undefined): string | null {
  const normalized = normalizeForKey(value);
  return normalized.length > 0 ? normalized : null;
}

function normalizeForKey(value: string | null | undefined): string {
  const normalized = normalizeText(value);
  if (!normalized) {
    return "";
  }

  return normalized
    .normalize("NFD")
    .replace(DIACRITIC_REGEX, "")
    .toLowerCase()
    .replace(KEY_SANITIZE_REGEX, " ")
    .replace(MULTI_SPACE_REGEX, " ")
    .trim();
}

export function makeDedupeKey(name: string, city: string | null, address: string | null): string {
  return [name, city, address].map((item) => normalizeForKey(item)).join("|");
}

export function slugify(value: string): string {
  const normalized = normalizeForKey(value)
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);

  return normalized.length > 0 ? normalized : "productor";
}

export function parseReviewed(value: string | null | undefined): boolean {
  const normalized = normalizeForKey(value);
  return ["si", "yes", "true", "1", "ok"].includes(normalized);
}

function parseCoordinatePair(candidate: string): Coordinates {
  const match = candidate.match(/(-?\d{1,2}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/);
  if (!match) {
    return { latitude: null, longitude: null };
  }

  const latitude = parseCoordinateValue(match[1]);
  const longitude = parseCoordinateValue(match[2]);

  if (latitude === null || longitude === null || !isValidCoordinates(latitude, longitude)) {
    return { latitude: null, longitude: null };
  }

  return { latitude, longitude };
}

export function extractCoordinatesFromGoogleMaps(url: string | null | undefined): Coordinates {
  const normalizedUrl = normalizeText(url);
  if (!normalizedUrl) {
    return { latitude: null, longitude: null };
  }

  const decoded = safeDecode(normalizedUrl).replace(/\+/g, " ");
  const patterns = [
    /@(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/,
    /!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/,
  ];

  for (const pattern of patterns) {
    const matched = decoded.match(pattern);
    if (matched) {
      return parseCoordinatePair(`${matched[1]},${matched[2]}`);
    }
  }

  try {
    const parsed = new URL(normalizedUrl);
    const q = parsed.searchParams.get("q") ?? parsed.searchParams.get("query");
    if (q) {
      const fromQuery = parseCoordinatePair(safeDecode(q));
      if (fromQuery.latitude !== null && fromQuery.longitude !== null) {
        return fromQuery;
      }
    }
  } catch {
    // Ignore invalid URLs and continue with generic extraction.
  }

  return parseCoordinatePair(decoded);
}

export function buildSearchText(fields: Array<string | null>): string {
  return fields
    .map((field) => normalizeForKey(field))
    .filter((field) => field.length > 0)
    .join(" ")
    .replace(MULTI_SPACE_REGEX, " ")
    .trim();
}

export function normalizeUrl(value: string | null | undefined): string | null {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return `https://${normalized}`;
}
