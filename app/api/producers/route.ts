import { NextRequest } from "next/server";

import {
  jsonWithCache,
  parseBboxParam,
  parsePageParam,
  parsePageSizeParam,
} from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { buildProducerWhere, PRODUCER_LIST_SELECT } from "@/lib/producer-query";
import { normalizeSearchQuery, normalizeText } from "@/lib/producer-utils";

const DEFAULT_PAGE_SIZE = 40;
const MAX_PAGE_SIZE = 300;

function parseBoolean(value: string | null, defaultValue: boolean): boolean {
  if (value === null) {
    return defaultValue;
  }

  return !["0", "false", "no", "off"].includes(value.trim().toLowerCase());
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = normalizeSearchQuery(searchParams.get("query"));
  const city = normalizeText(searchParams.get("city"));
  const category = normalizeText(searchParams.get("category"));
  const subcategory = normalizeText(searchParams.get("subcategory"));
  const bbox = parseBboxParam(searchParams.get("bbox"));
  const page = parsePageParam(searchParams.get("page"), 1);
  const pageSize = parsePageSizeParam(
    searchParams.get("pageSize"),
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  );
  const includeWithoutCoordinates = parseBoolean(
    searchParams.get("includeNoCoordinates"),
    true,
  );

  const where = buildProducerWhere({
    query,
    city,
    category,
    subcategory,
    bbox,
    includeWithoutCoordinates,
  });

  try {
    const [total, items] = await prisma.$transaction([
      prisma.producer.count({ where }),
      prisma.producer.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ city: "asc" }, { category: "asc" }, { name: "asc" }],
        select: PRODUCER_LIST_SELECT,
      }),
    ]);

    return jsonWithCache(
      {
        items,
        total,
        page,
        pageSize,
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
