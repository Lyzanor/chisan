import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/site";

const PRIVATE_PATHS = ["/acceso", "/registro", "/cuenta", "/admin", "/api/"];

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  return {
    rules: isProduction
      ? {
          userAgent: "*",
          allow: "/",
          disallow: PRIVATE_PATHS,
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
