import { Prisma } from "@prisma/client";

import { isWithinBarcelonaProvince } from "./barcelona";
import { buildGeocodingQuery } from "./geocoding";
import {
  buildSearchText,
  extractCoordinatesFromGoogleMaps,
  makeDedupeKey,
  normalizeText,
  normalizeUrl,
  parseCoordinateValue,
  parseReviewed,
  slugify,
} from "./producer-utils";

export const CSV_PRODUCER_COLUMNS = {
  name: "nombre",
  city: "-- municipio",
  category: "categoria",
  subcategory: "subcategoria",
  address: "direccion",
  description: "descripcion",
  openingHours: "horario",
  phone: "telefono",
  email: "correo",
  website: "web",
  facebook: "Facebook",
  instagram: "Instagram",
  googleMaps: "Google Maps",
  latitude: "lat",
  longitude: "lon",
  reviewed: "Revisado",
} as const;

export const CSV_PRODUCER_COLUMN_LIST = Object.values(CSV_PRODUCER_COLUMNS);

export type CsvProducerRow = {
  nombre?: string;
  "-- municipio"?: string;
  categoria?: string;
  subcategoria?: string;
  direccion?: string;
  descripcion?: string;
  horario?: string;
  telefono?: string;
  correo?: string;
  web?: string;
  Facebook?: string;
  Instagram?: string;
  "Google Maps"?: string;
  lat?: string;
  lon?: string;
  Revisado?: string;
};

export type PreparedSeedProducer = {
  dedupeKey: string;
  baseSlug: string;
  geocodeQueryKey: string;
  geocodeQueryText: string | null;
  data: Prisma.ProducerCreateManyInput;
};

function toProvinceCoordinates(latitude: number | null, longitude: number | null) {
  if (latitude === null || longitude === null) {
    return { latitude: null, longitude: null };
  }

  if (!isWithinBarcelonaProvince(latitude, longitude)) {
    return { latitude: null, longitude: null };
  }

  return { latitude, longitude };
}

function readCsvCoordinates(row: CsvProducerRow) {
  return toProvinceCoordinates(
    parseCoordinateValue(row[CSV_PRODUCER_COLUMNS.latitude]),
    parseCoordinateValue(row[CSV_PRODUCER_COLUMNS.longitude]),
  );
}

function readGoogleMapsCoordinates(row: CsvProducerRow) {
  const extracted = extractCoordinatesFromGoogleMaps(row[CSV_PRODUCER_COLUMNS.googleMaps]);
  return toProvinceCoordinates(extracted.latitude, extracted.longitude);
}

function resolveRowCoordinates(row: CsvProducerRow) {
  const csvCoordinates = readCsvCoordinates(row);
  if (csvCoordinates.latitude !== null && csvCoordinates.longitude !== null) {
    return csvCoordinates;
  }

  return readGoogleMapsCoordinates(row);
}

export function parseCsvProducerRow(row: CsvProducerRow): PreparedSeedProducer | null {
  const name = normalizeText(row[CSV_PRODUCER_COLUMNS.name]);
  if (!name) {
    return null;
  }

  const city = normalizeText(row[CSV_PRODUCER_COLUMNS.city]);
  const category = normalizeText(row[CSV_PRODUCER_COLUMNS.category]);
  const subcategory = normalizeText(row[CSV_PRODUCER_COLUMNS.subcategory]);
  const address = normalizeText(row[CSV_PRODUCER_COLUMNS.address]);
  const description = normalizeText(row[CSV_PRODUCER_COLUMNS.description]);
  const openingHours = normalizeText(row[CSV_PRODUCER_COLUMNS.openingHours]);
  const phone = normalizeText(row[CSV_PRODUCER_COLUMNS.phone]);
  const email = normalizeText(row[CSV_PRODUCER_COLUMNS.email])?.toLowerCase() ?? null;
  const website = normalizeUrl(row[CSV_PRODUCER_COLUMNS.website]);
  const facebook = normalizeUrl(row[CSV_PRODUCER_COLUMNS.facebook]);
  const instagram = normalizeUrl(row[CSV_PRODUCER_COLUMNS.instagram]);
  const googleMapsUrl = normalizeUrl(row[CSV_PRODUCER_COLUMNS.googleMaps]);
  const reviewed = parseReviewed(row[CSV_PRODUCER_COLUMNS.reviewed]);

  const { latitude, longitude } = resolveRowCoordinates(row);
  const dedupeKey = makeDedupeKey(name, city, address);
  const baseSlug = slugify([name, city].filter(Boolean).join("-"));
  const geocodeQueryText = address || city ? buildGeocodingQuery({ name, address, city }) : null;

  return {
    dedupeKey,
    baseSlug,
    geocodeQueryKey: dedupeKey,
    geocodeQueryText,
    data: {
      slug: baseSlug,
      name,
      city,
      category,
      subcategory,
      address,
      description,
      openingHours,
      phone,
      email,
      website,
      facebook,
      instagram,
      googleMapsUrl,
      reviewed,
      latitude,
      longitude,
      dedupeKey,
      searchText: buildSearchText([
        name,
        city,
        category,
        subcategory,
        address,
        description,
        phone,
        email,
      ]),
    },
  };
}
