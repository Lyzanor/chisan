import { existsSync } from "node:fs";

import { defineConfig } from "drizzle-kit";

for (const environmentFile of [".env.local", ".env"]) {
  if (!process.env.DATABASE_URL && existsSync(environmentFile)) {
    process.loadEnvFile(environmentFile);
  }
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // drizzle-kit reports the missing/invalid URL when a DB command is run;
    // ordinary application builds do not need database credentials.
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
