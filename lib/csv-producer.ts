import { Prisma } from "@prisma/client";

import { isWithinBarcelonaProvince } from "./barcelona";
import { CSV_PRODUCER_COLUMNS, CSV_PRODUCER_LEGACY_COLUMNS } from "./csv-schema";
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

type CsvProducerColumn =
  | (typeof CSV_PRODUCER_COLUMNS)[keyof typeof CSV_PRODUCER_COLUMNS]
  | (typeof CSV_PRODUCER_LEGACY_COLUMNS)[keyof typeof CSV_PRODUCER_LEGACY_COLUMNS];

export type CsvProducerRow = Partial<Record<CsvProducerColumn, string>>;

export type PreparedSeedProducer = {
  dedupeKey: string;
  baseSlug: string;
  geocodeQueryKey: string;
  geocodeQueryText: string | null;
  data: Prisma.ProducerCreateManyInput;
};

function readColumnValue(
  row: CsvProducerRow,
  column: (typeof CSV_PRODUCER_COLUMNS)[keyof typeof CSV_PRODUCER_COLUMNS],
  legacyColumn?: (typeof CSV_PRODUCER_LEGACY_COLUMNS)[keyof typeof CSV_PRODUCER_LEGACY_COLUMNS],
): string | undefined {
  if (row[column] !== undefined) {
    return row[column];
  }

  if (legacyColumn && row[legacyColumn] !== undefined) {
    return row[legacyColumn];
  }

  return undefined;
}

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

  const city = normalizeText(
    readColumnValue(row, CSV_PRODUCER_COLUMNS.city, CSV_PRODUCER_LEGACY_COLUMNS.city),
  );
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
