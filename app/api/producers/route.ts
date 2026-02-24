import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonWithCache, parseBboxParam, parsePageParam } from "@/lib/api-utils";
import { BARCELONA_PROVINCE } from "@/lib/barcelona";
import { prisma } from "@/lib/prisma";
import { normalizeText } from "@/lib/producer-utils";

const PAGE_SIZE = 40;

function clampToBarcelona(
  bbox: ReturnType<typeof parseBboxParam>,
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = normalizeText(searchParams.get("query"));
  const city = normalizeText(searchParams.get("city"));
  const category = normalizeText(searchParams.get("category"));
  const subcategory = normalizeText(searchParams.get("subcategory"));
  const bbox = clampToBarcelona(parseBboxParam(searchParams.get("bbox")));
  const page = parsePageParam(searchParams.get("page"), 1);

  const filters: Prisma.ProducerWhereInput[] = [];

  if (query) {
    const normalizedQuery = query.toLowerCase();

    filters.push({
      searchText: { contains: normalizedQuery },
    });
  }

  if (city) {
    filters.push({ city });
  }

  if (category) {
    filters.push({ category });
  }

  if (subcategory) {
    filters.push({ subcategory });
  }

  filters.push({
    AND: [
      { latitude: { gte: bbox.minLat, lte: bbox.maxLat } },
      { longitude: { gte: bbox.minLng, lte: bbox.maxLng } },
    ],
  });

  const where: Prisma.ProducerWhereInput = filters.length > 0 ? { AND: filters } : {};

  try {
    const [total, items] = await prisma.$transaction([
      prisma.producer.count({ where }),
      prisma.producer.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: [{ city: "asc" }, { category: "asc" }, { name: "asc" }],
        select: {
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
        },
      }),
    ]);

    return jsonWithCache(
      {
        items,
        total,
        page,
        pageSize: PAGE_SIZE,
      },
      "public, s-maxage=30, stale-while-revalidate=120",
    );
  } catch (error) {
    console.error("/api/producers failed", error);
    return jsonWithCache(
      { error: "No se pudo cargar productores." },
      "no-store",
      500,
    );
  }
}
