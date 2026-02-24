import { getMapExternalLinks } from "./map-provider";

// Backward-compatible wrappers. Prefer getMapExternalLinks from map-provider.
export function getOsmMapUrl(
  latitude: number | null,
  longitude: number | null,
  fallbackQuery: string | null,
): string {
  return getMapExternalLinks(latitude, longitude, fallbackQuery).mapUrl;
}

export function getOsmDirectionsUrl(
  latitude: number | null,
  longitude: number | null,
  fallbackQuery: string | null,
): string {
  return getMapExternalLinks(latitude, longitude, fallbackQuery).directionsUrl;
}
