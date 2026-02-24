import { NextRequest, NextResponse } from "next/server";

import { jsonWithCache } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const producerId = Number.parseInt(id, 10);

  if (Number.isNaN(producerId) || producerId < 1) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const producer = await prisma.producer.findUnique({
    where: { id: producerId },
    select: {
      id: true,
      slug: true,
      name: true,
      city: true,
      category: true,
      subcategory: true,
      address: true,
      description: true,
      openingHours: true,
      phone: true,
      email: true,
      website: true,
      facebook: true,
      instagram: true,
      googleMapsUrl: true,
      reviewed: true,
      latitude: true,
      longitude: true,
    },
  });

  if (!producer) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return jsonWithCache(
    producer,
    "public, s-maxage=120, stale-while-revalidate=300",
  );
}
