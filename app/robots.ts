import type { MetadataRoute } from "next";

import { absoluteSiteUrl } from "@/lib/catalog-metadata";
import { SITEMAP_INDEX_PATH } from "@/lib/sitemap-index";
import { isPublicDiscoveryEnabled, SITE_ORIGIN } from "@/lib/site";

const PRIVATE_PATHS = ["/acceso", "/registro", "/cuenta", "/admin", "/api/"];
// Crawlers that send no search or answer visitors; see Operations' consumption
// controls before re-admitting them.
const EXCLUDED_CRAWLERS = ["GoogleOther", "meta-externalagent"];

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!isPublicDiscoveryEnabled()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/catalog/v1/", "/api/catalog/v1$"],
        disallow: PRIVATE_PATHS,
      },
      { userAgent: EXCLUDED_CRAWLERS, disallow: "/" },
    ],
    sitemap: absoluteSiteUrl(SITEMAP_INDEX_PATH),
    host: SITE_ORIGIN,
  };
}
