import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  // Ensure the CSV is always bundled: readFile uses a dynamic path so
  // Next.js static analysis cannot detect it automatically.
  outputFileTracingIncludes: {
    "/**": ["./data/csv/**/*.csv"],
  },
};

export default nextConfig;
