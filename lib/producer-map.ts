import type { ProducerCsvRow } from "@/lib/csv-catalog";

export type ProducerMapPoint = {
  id: number;
  name: string;
  city: string;
  category: string;
  latitude: number;
  longitude: number;
};

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
