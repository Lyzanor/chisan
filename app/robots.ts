import type { MetadataRoute } from "next";

import { absoluteSiteUrl } from "@/lib/catalog-metadata";
import {
  buildCatalogSitemapPath,
  listCatalogSitemapDescriptors,
} from "@/lib/catalog-sitemap";
import { isPublicDiscoveryEnabled, SITE_ORIGIN } from "@/lib/site";

const PRIVATE_PATHS = ["/acceso", "/registro", "/cuenta", "/admin", "/api/"];

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!isPublicDiscoveryEnabled()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  const sitemapUrls = (await listCatalogSitemapDescriptors()).map(({ id }) =>
    absoluteSiteUrl(buildCatalogSitemapPath(id)),
  );

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: PRIVATE_PATHS,
    },
    sitemap: sitemapUrls,
    host: SITE_ORIGIN,
  };
}
