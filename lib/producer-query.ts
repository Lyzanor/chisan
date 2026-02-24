import { Prisma } from "@prisma/client";

import type { BoundingBox } from "@/lib/api-utils";
import { BARCELONA_PROVINCE } from "@/lib/barcelona";

type ProducerQueryFilters = {
  query: string | null;
  city: string | null;
  category: string | null;
  subcategory: string | null;
  bbox: BoundingBox | null;
  includeWithoutCoordinates?: boolean;
};

export const PRODUCER_LIST_SELECT = {
  id: true,
  slug: true,
  name: true,
  city: true,
  category: true,
  subcategory: true,
  address: true,
  description: true,
  latitude: true,
  longitude: true,
} satisfies Prisma.ProducerSelect;

export function clampToBarcelona(
  bbox: BoundingBox | null,
): { minLng: number; minLat: number; maxLng: number; maxLat: number } {
  const source = bbox ?? BARCELONA_PROVINCE;

  const minLng = Math.max(source.minLng, BARCELONA_PROVINCE.minLng);
  const minLat = Math.max(source.minLat, BARCELONA_PROVINCE.minLat);
  const maxLng = Math.min(source.maxLng, BARCELONA_PROVINCE.maxLng);
  const maxLat = Math.min(source.maxLat, BARCELONA_PROVINCE.maxLat);

  if (minLng >= maxLng || minLat >= maxLat) {
    return {
      minLng: BARCELONA_PROVINCE.minLng,
      minLat: BARCELONA_PROVINCE.minLat,
      maxLng: BARCELONA_PROVINCE.maxLng,
      maxLat: BARCELONA_PROVINCE.maxLat,
    };
  }

  return { minLng, minLat, maxLng, maxLat };
}

function buildSpatialFilter(
  bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number },
  includeWithoutCoordinates: boolean,
): Prisma.ProducerWhereInput {
  const inBbox: Prisma.ProducerWhereInput = {
    AND: [
      { latitude: { gte: bbox.minLat, lte: bbox.maxLat } },
      { longitude: { gte: bbox.minLng, lte: bbox.maxLng } },
    ],
  };

  if (!includeWithoutCoordinates) {
    return inBbox;
  }

  return {
    OR: [inBbox, { latitude: null }, { longitude: null }],
  };
}

export function buildProducerWhere(filters: ProducerQueryFilters): Prisma.ProducerWhereInput {
  const whereFilters: Prisma.ProducerWhereInput[] = [];

  if (filters.query) {
    whereFilters.push({
      searchText: { contains: filters.query },
    });
  }

  if (filters.city) {
    whereFilters.push({ city: filters.city });
  }

  if (filters.category) {
    whereFilters.push({ category: filters.category });
  }

  if (filters.subcategory) {
    whereFilters.push({ subcategory: filters.subcategory });
  }

  const bbox = clampToBarcelona(filters.bbox);
  whereFilters.push(buildSpatialFilter(bbox, filters.includeWithoutCoordinates ?? true));

  return whereFilters.length > 0 ? { AND: whereFilters } : {};
}
