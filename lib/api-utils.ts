import { NextResponse } from "next/server";

export type BoundingBox = {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
};

export function parsePageParam(value: string | null, fallback = 1): number {
  const page = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(page) || page < 1) {
    return fallback;
  }
  return page;
}

export function parseBboxParam(value: string | null): BoundingBox | null {
  if (!value) {
    return null;
  }

  const parts = value.split(",").map((part) => Number.parseFloat(part.trim()));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  const [minLng, minLat, maxLng, maxLat] = parts;

  if (
    minLng < -180 ||
    maxLng > 180 ||
    minLat < -90 ||
    maxLat > 90 ||
    minLng >= maxLng ||
    minLat >= maxLat
  ) {
    return null;
  }

  return { minLng, minLat, maxLng, maxLat };
}

export function jsonWithCache<T>(body: T, cacheControl: string, status = 200): NextResponse<T> {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": cacheControl,
    },
  });
}
