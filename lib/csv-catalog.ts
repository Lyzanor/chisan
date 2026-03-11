import { readFile } from "node:fs/promises";
import path from "node:path";

import { parse } from "csv-parse/sync";

type RawCsvRow = Record<string, string | undefined>;

export type ProducerCsvRow = {
  id: number;
  name: string;
  city: string;
  category: string;
  subcategory: string;
  latitude: number | null;
  longitude: number | null;
  distanceKm?: number;
  fields: Record<string, string>;
};

export type ProducerMapPoint = {
  id: number;
  name: string;
  city: string;
  category: string;
  latitude: number;
  longitude: number;
};

const CSV_PATH = path.resolve(process.cwd(), "Km0-productores.csv");

function cleanCell(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeFieldKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function findFieldValue(
  fields: Record<string, string>,
  candidateKeys: readonly string[],
): string {
  const normalizedCandidates = new Set(candidateKeys.map(normalizeFieldKey));

  for (const [field, value] of Object.entries(fields)) {
    if (normalizedCandidates.has(normalizeFieldKey(field))) {
      return value;
    }
  }

  return "";
}

function parseCoordinate(rawValue: string): number | null {
  if (!rawValue.trim()) {
    return null;
  }

  const normalized = rawValue.trim().replace(",", ".");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : null;
}

function readLatitude(fields: Record<string, string>): number | null {
  const value = parseCoordinate(findFieldValue(fields, ["lat", "latitude"]));
  if (value === null) {
    return null;
  }
  return value >= -90 && value <= 90 ? value : null;
}

function readLongitude(fields: Record<string, string>): number | null {
  const value = parseCoordinate(
    findFieldValue(fields, ["lon", "lng", "long", "longitude"]),
  );
  if (value === null) {
    return null;
  }
  return value >= -180 && value <= 180 ? value : null;
}

export type ProducerSearchFilters = {
  municipality: string;
  category: string;
  lat?: number;
  lon?: number;
};

function hasValidCoordinates(
  lat: number | undefined,
  lon: number | undefined,
): boolean {
  return Number.isFinite(lat) && Number.isFinite(lon);
}

// Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function loadCsvRows(): Promise<ProducerCsvRow[]> {
  const csvRaw = await readFile(CSV_PATH, "utf8");
  const parsedRows = parse(csvRaw, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
  }) as RawCsvRow[];

  return parsedRows.map((row, index) => {
    const fields = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [cleanCell(key), cleanCell(value)]),
    );

    return {
      id: index + 1,
      name: fields.nombre || `Fila ${index + 1}`,
      city: fields.municipio || "Sin municipio",
      category: fields.categoria || "Sin categoría",
      subcategory: fields.subcategoria || "",
      latitude: readLatitude(fields),
      longitude: readLongitude(fields),
      fields,
    };
  });
}

export async function findProducerById(rawId: string): Promise<ProducerCsvRow | null> {
  const id = Number.parseInt(rawId, 10);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  const rows = await loadCsvRows();
  return rows[id - 1] ?? null;
}

export async function listCategories(): Promise<string[]> {
  const rows = await loadCsvRows();
  const counts = new Map<string, number>();

  for (const row of rows) {
    const key = row.category.trim();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
    .map(([value]) => value);
}

export function toProducerMapPoints(rows: ProducerCsvRow[]): ProducerMapPoint[] {
  return rows.flatMap((row) => {
    if (row.latitude === null || row.longitude === null) {
      return [];
    }

    return [
      {
        id: row.id,
        name: row.name,
        city: row.city,
        category: row.category,
        latitude: row.latitude,
        longitude: row.longitude,
      },
    ];
  });
}

export async function searchProducers(
  filters: ProducerSearchFilters,
): Promise<ProducerCsvRow[]> {
  const rows = await loadCsvRows();
  const normalizedMunicipality = normalizeSearch(filters.municipality);
  const normalizedCategory = normalizeSearch(filters.category);

  let results = rows.filter((row) => {
    const byMunicipality =
      !normalizedMunicipality ||
      normalizeSearch(row.city).includes(normalizedMunicipality);
    const byCategory =
      !normalizedCategory ||
      normalizeSearch(row.category) === normalizedCategory;

    return byMunicipality && byCategory;
  });

  if (hasValidCoordinates(filters.lat, filters.lon)) {
    const userLat = filters.lat as number;
    const userLon = filters.lon as number;

    results = results.map((row) => {
      if (row.latitude !== null && row.longitude !== null) {
        return {
          ...row,
          distanceKm: calculateDistance(
            userLat,
            userLon,
            row.latitude,
            row.longitude
          ),
        };
      }
      return row;
    });

    results.sort((a, b) => {
      // Items without coordinates go to the bottom when sorting by distance
      if (a.distanceKm === undefined && b.distanceKm === undefined) return 0;
      if (a.distanceKm === undefined) return 1;
      if (b.distanceKm === undefined) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }

  return results;
}
