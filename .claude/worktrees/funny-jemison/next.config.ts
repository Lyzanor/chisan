import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Ensure the CSV is always bundled: readFile uses a dynamic path so
  // Next.js static analysis cannot detect it automatically.
  outputFileTracingIncludes: {
    "/**": ["./Km0-productores.csv"],
  },
};

export default nextConfig;
