export function getOsmMapUrl(
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

  return "https://www.openstreetmap.org";
}

export function getOsmDirectionsUrl(
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

  return "https://www.openstreetmap.org";
}
