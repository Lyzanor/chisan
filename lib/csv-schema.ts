export const CSV_PRODUCER_COLUMNS = {
  name: "nombre",
  city: "municipio",
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

// Backward compatibility for previous CSV header naming.
export const CSV_PRODUCER_LEGACY_COLUMNS = {
  city: "-- municipio",
} as const;

export const CSV_PRODUCER_COLUMN_LIST = Object.values(CSV_PRODUCER_COLUMNS);

export type CsvProducerColumn = (typeof CSV_PRODUCER_COLUMN_LIST)[number];

export type CsvSnapshotSource = {
  name: string;
  city: string | null;
  category: string | null;
  subcategory: string | null;
  address: string | null;
  description: string | null;
  openingHours: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  reviewed: boolean;
};

export type CsvFieldEntry = {
  key: CsvProducerColumn;
  value: string | null;
};

function toNullableCsvText(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function buildCsvFieldEntries(source: CsvSnapshotSource): CsvFieldEntry[] {
  return [
    { key: CSV_PRODUCER_COLUMNS.name, value: toNullableCsvText(source.name) },
    { key: CSV_PRODUCER_COLUMNS.city, value: toNullableCsvText(source.city) },
    { key: CSV_PRODUCER_COLUMNS.category, value: toNullableCsvText(source.category) },
    { key: CSV_PRODUCER_COLUMNS.subcategory, value: toNullableCsvText(source.subcategory) },
    { key: CSV_PRODUCER_COLUMNS.address, value: toNullableCsvText(source.address) },
    { key: CSV_PRODUCER_COLUMNS.description, value: toNullableCsvText(source.description) },
    { key: CSV_PRODUCER_COLUMNS.openingHours, value: toNullableCsvText(source.openingHours) },
    { key: CSV_PRODUCER_COLUMNS.phone, value: toNullableCsvText(source.phone) },
    { key: CSV_PRODUCER_COLUMNS.email, value: toNullableCsvText(source.email) },
    { key: CSV_PRODUCER_COLUMNS.website, value: toNullableCsvText(source.website) },
    { key: CSV_PRODUCER_COLUMNS.facebook, value: toNullableCsvText(source.facebook) },
    { key: CSV_PRODUCER_COLUMNS.instagram, value: toNullableCsvText(source.instagram) },
    { key: CSV_PRODUCER_COLUMNS.googleMaps, value: toNullableCsvText(source.googleMapsUrl) },
    {
      key: CSV_PRODUCER_COLUMNS.latitude,
      value: source.latitude !== null ? source.latitude.toString() : null,
    },
    {
      key: CSV_PRODUCER_COLUMNS.longitude,
      value: source.longitude !== null ? source.longitude.toString() : null,
    },
    { key: CSV_PRODUCER_COLUMNS.reviewed, value: source.reviewed ? "sí" : "no" },
  ];
}

export function buildCsvSnapshot(source: CsvSnapshotSource): Record<CsvProducerColumn, string | null> {
  return Object.fromEntries(
    buildCsvFieldEntries(source).map((field) => [field.key, field.value]),
  ) as Record<CsvProducerColumn, string | null>;
}
