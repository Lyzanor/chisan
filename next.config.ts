import type { NextConfig } from "next";

import { buildCatalogNormalizationRewritesFromManifests } from "./lib/catalog-build-rewrites";
import { GUIDES_PATH, LEGACY_GUIDES_PATH } from "./lib/guides/routes";

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    // Producer assets are already checked and stored in deployable formats.
    // Serving them directly avoids spending Vercel image transformations.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  rewrites: () => ({
    beforeFiles: buildCatalogNormalizationRewritesFromManifests(),
    afterFiles: [],
    fallback: [],
  }),
  // The library moved into the catalog scope of the country it describes.
  // Its first published URLs keep resolving to the same articles.
  redirects: async () => [
    {
      source: LEGACY_GUIDES_PATH,
      destination: GUIDES_PATH,
      permanent: true,
    },
    {
      source: `${LEGACY_GUIDES_PATH}/:slug`,
      destination: `${GUIDES_PATH}/:slug`,
      permanent: true,
    },
  ],
  turbopack: {
    root: process.cwd(),
  },
  // Producer reads use dynamic filesystem paths. Keep the fallback trace on
  // routes that resolve producer rows instead of attaching every CSV to every
  // function; automatic tracing still handles their ordinary dependencies.
  outputFileTracingIncludes: {
    // The shared navigation and profile backlinks read the small guide library.
    "/*": ["./data/guides/es/*.md"],
    "/\\[catalog\\]/guias": ["./data/csv/es/**/*.csv"],
    "/\\[catalog\\]/guias/\\[slug\\]": ["./data/csv/es/**/*.csv"],
    "/api/producer-media": ["./data/csv/**/*.csv"],
    "/api/producer-stats/**": ["./data/csv/**/*.csv"],
    "/api/producer-favorites": ["./data/csv/**/*.csv"],
    "/api/catalog/v1/**": ["./data/csv/**/*.csv", "./data/content/**/*.json"],
    middleware: ["./data/csv/**/*.csv"],
    "/\\[catalog\\]/\\[area\\]": ["./data/csv/**/*.csv"],
    "/\\[catalog\\]/\\[area\\]/\\[segment\\]": ["./data/csv/**/*.csv", "./data/content/**/*.json", "./data/evidence/**/*.jsonl"],
    "/robots.txt": ["./data/csv/**/*.csv"],
    "/sitemap/**": ["./data/csv/**/*.csv"],
    "/cuenta": ["./data/csv/**/*.csv"],
    "/cuenta/**": ["./data/csv/**/*.csv", "./data/content/**/*.json"],
    "/admin": ["./data/csv/**/*.csv"],
    "/admin/**": ["./data/csv/**/*.csv", "./data/content/**/*.json"],
    "/u/**": ["./data/csv/**/*.csv"],
  },
};

export default nextConfig;
