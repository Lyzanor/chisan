export type PublicProfileBaseLocation = Readonly<{
  country: string;
  area: string;
  municipality: string;
}>;

const BASE_LOCATION_KEY = /^([a-z]{2})\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export function publicProfileBaseLocationKey(
  location: Pick<PublicProfileBaseLocation, "country" | "area">,
): string {
  return `${location.country}/${location.area}`;
}

export function parsePublicProfileBaseLocationKey(
  value: string,
): Pick<PublicProfileBaseLocation, "country" | "area"> | null {
  const match = BASE_LOCATION_KEY.exec(value.trim().toLowerCase());
  if (!match) return null;

  return { country: match[1], area: match[2] };
}

export function normalizeMunicipalityName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
