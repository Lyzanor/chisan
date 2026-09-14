import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { listCountryProducers } from "./producers";
import { findCountry } from "./registry";

/** Public figures derived from a country's area CSVs and evidence ledgers. */
export type CatalogSourceFigures = {
  producers: number;
  municipalities: number;
  sourceReferences: number;
  websites: number;
};

async function listEvidenceLedgers(country: string): Promise<string[]> {
  const directory = path.join(process.cwd(), "data/evidence", country);
  try {
    const entries = await readdir(directory, { recursive: true });
    return entries
      .filter((entry) => entry.endsWith(".jsonl"))
      .sort()
      .map((entry) => path.join(directory, entry));
  } catch {
    return [];
  }
}

/**
 * Counts the published producers and their municipalities, every source cited
 * by an editorial decision, and the distinct websites behind those citations.
 * Only URLs are read from evidence; notes and claims never leave the ledger.
 */
export async function loadCatalogSourceFigures(
  country: string,
): Promise<CatalogSourceFigures> {
  const figures: CatalogSourceFigures = {
    producers: 0,
    municipalities: 0,
    sourceReferences: 0,
    websites: 0,
  };
  const catalogCountry = findCountry(country);
  if (!catalogCountry) {
    return figures;
  }

  const producers = await listCountryProducers(catalogCountry.slug);
  figures.producers = producers.length;
  figures.municipalities = new Set(
    producers.map((producer) => `${producer.area}/${producer.city}`),
  ).size;

  const websites = new Set<string>();
  for (const ledger of await listEvidenceLedgers(catalogCountry.slug)) {
    for (const line of (await readFile(ledger, "utf8")).split("\n")) {
      if (!line.trim()) continue;
      let record: { sources?: unknown };
      try {
        record = JSON.parse(line);
      } catch {
        continue;
      }
      if (!Array.isArray(record.sources)) continue;
      for (const source of record.sources as { url?: unknown }[]) {
        if (typeof source.url !== "string") continue;
        try {
          websites.add(new URL(source.url).hostname.replace(/^www\./, ""));
          figures.sourceReferences += 1;
        } catch {
          /* The evidence check reports malformed URLs; they are not counted. */
        }
      }
    }
  }
  figures.websites = websites.size;

  return figures;
}
