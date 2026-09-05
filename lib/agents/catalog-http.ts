import "server-only";
import { createHash } from "node:crypto";
import { z } from "zod";
import { isPublicDiscoveryEnabled } from "../site";
import { CatalogRequestError } from "./public-catalog";

export function readCatalogQuery(
  request: Request,
  numericKeys: readonly string[] = [],
) {
  if (request.url.length > 4096)
    throw new CatalogRequestError(
      414,
      "query_too_long",
      "Request URL exceeds 4096 characters.",
    );
  const params = new URL(request.url).searchParams;
  const values: Record<string, unknown> = Object.create(null);
  for (const [key, value] of params) {
    if (["__proto__", "constructor", "prototype"].includes(key))
      throw new CatalogRequestError(
        400,
        "invalid_query",
        "Unknown query parameter.",
      );
    if (Object.hasOwn(values, key))
      throw new CatalogRequestError(
        400,
        "invalid_query",
        "Repeated query parameters are not supported.",
      );
    if (numericKeys.includes(key)) {
      if (!/^\d+$/.test(value))
        throw new CatalogRequestError(
          400,
          "invalid_query",
          `${key} must be an integer.`,
        );
      values[key] = Number(value);
    } else values[key] = value;
  }
  return values;
}

export function catalogHeaders(cacheable = false) {
  return new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": cacheable
      ? "public, max-age=60, s-maxage=300"
      : "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, If-None-Match",
    "Access-Control-Expose-Headers": "ETag, Link",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": isPublicDiscoveryEnabled()
      ? "noindex, follow"
      : "noindex, nofollow",
    Link: '</api/catalog/v1/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json", </llms.txt>; rel="describedby"; type="text/plain"',
  });
}

export async function catalogResponse(
  request: Request,
  read: () => unknown | Promise<unknown>,
  cacheable = false,
) {
  try {
    const body = JSON.stringify(await read());
    const headers = catalogHeaders(cacheable);
    if (cacheable) {
      const etag = `"${createHash("sha256").update(body).digest("hex")}"`;
      headers.set("ETag", etag);
      const matches = (request.headers.get("If-None-Match") ?? "")
        .split(",")
        .map((value) => value.trim().replace(/^W\//, ""));
      if (matches.includes(etag) || matches.includes("*"))
        return new Response(null, { status: 304, headers });
    }
    return new Response(body, { headers });
  } catch (error) {
    const known = error instanceof CatalogRequestError;
    const invalid = error instanceof z.ZodError;
    if (!known && !invalid)
      console.error("Public catalog read failed.", {
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
    return Response.json(
      {
        error: {
          code: known
            ? error.code
            : invalid
              ? "invalid_query"
              : "catalog_unavailable",
          message: known
            ? error.message
            : invalid
              ? "Invalid parameters. See the operation schema in /api/catalog/v1/openapi.json."
              : "Catalog temporarily unavailable. Retry later.",
        },
      },
      {
        status: known ? error.status : invalid ? 400 : 503,
        headers: catalogHeaders(),
      },
    );
  }
}

export function catalogOptions() {
  return new Response(null, { status: 204, headers: catalogHeaders() });
}
