import "server-only";
import { findPublishedCountry, listMunicipalitySummaries } from "../csv-catalog";
import { normalizeMunicipalityName, parsePublicProfileBaseLocationKey, type PublicProfileBaseLocation } from "./public-profile-location";

export async function resolvePublicProfileBaseLocation(key: string, municipality: string): Promise<PublicProfileBaseLocation | null> {
  const location = parsePublicProfileBaseLocationKey(key);
  const country = location && findPublishedCountry(location.country);
  const area = country?.regions.flatMap((region) => region.areas).find((item) => item.slug === location?.area);
  if (!location || !country || !area) return null;
  const matches = (await listMunicipalitySummaries("", Number.MAX_SAFE_INTEGER, country.slug, area.slug))
    .filter((item) => normalizeMunicipalityName(item.name) === normalizeMunicipalityName(municipality));
  return matches.length === 1 ? { ...location, municipality: matches[0].name } : null;
}
