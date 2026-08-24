#!/usr/bin/env node

import { checkCatalogAreaBoundaries } from "./build-catalog-area-boundaries.mjs";

try {
  const summaries = checkCatalogAreaBoundaries();
  for (const summary of summaries) {
    console.log(
      `catalog geography ${summary.country} OK: ${summary.features} feature(s), ` +
        `${summary.generatedPositions} generated positions`,
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
