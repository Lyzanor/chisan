import type { NextRequest } from "next/server";

import { buildCatalogRedirectHref } from "@/lib/catalog-redirect-handler";
import { hasLocale } from "@/lib/i18n/locales";

type CatalogRedirectContext = {
  params: Promise<{
    country: string;
    defaultLocale: string;
    catalog: string;
    path?: string[];
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: CatalogRedirectContext,
): Promise<Response> {
  const { country, defaultLocale, catalog, path } = await params;
  if (!hasLocale(defaultLocale)) {
    return new Response(null, { status: 404 });
  }
  const href = buildCatalogRedirectHref({
    country,
    defaultLocale,
    catalog,
    path,
    searchParams: request.nextUrl.searchParams,
  });

  if (!href) {
    return new Response(null, { status: 404 });
  }

  return new Response(null, {
    status: 308,
    headers: { location: href },
  });
}
