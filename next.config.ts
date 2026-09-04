import type { NextConfig } from "next";

import { buildCatalogNormalizationRewritesFromManifests } from "./lib/catalog-build-rewrites";

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    // Producer assets are already checked and stored in deployable formats.
    // Serving them directly avoids spending Vercel image transformations.
    unoptimized: true,
  },
  rewrites: () => ({
    beforeFiles: buildCatalogNormalizationRewritesFromManifests(),
    afterFiles: [],
    fallback: [],
  }),
  turbopack: {
    root: process.cwd(),
  },
  // Producer reads use dynamic filesystem paths. Keep the fallback trace on
  // routes that resolve producer rows instead of attaching every CSV to every
  // function; automatic tracing still handles their ordinary dependencies.
  outputFileTracingIncludes: {
    middleware: ["./data/csv/**/*.csv"],
    "/\\[catalog\\]/\\[area\\]": ["./data/csv/**/*.csv"],
    "/\\[catalog\\]/\\[area\\]/\\[segment\\]": ["./data/csv/**/*.csv", "./data/content/**/*.json"],
    "/robots.txt": ["./data/csv/**/*.csv"],
    "/sitemap/**": ["./data/csv/**/*.csv"],
    "/cuenta": ["./data/csv/**/*.csv"],
    "/cuenta/**": ["./data/csv/**/*.csv"],
    "/admin": ["./data/csv/**/*.csv"],
    "/admin/**": ["./data/csv/**/*.csv"],
    "/u/**": ["./data/csv/**/*.csv"],
  },
};

export default nextConfig;
