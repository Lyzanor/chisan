import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { listPublishedCountries, listCountryProducers, findProducersByIds, findPublishedCountry } from "../csv-catalog";
import { loadProducerContent } from "../catalog/content";
import type { ShelfCatalog } from "./service";

/** A disposable projection of approved CSV/content, never a second registry. */
export const shelfCatalog: ShelfCatalog = async (identities) => {
  const countries = listPublishedCountries();
  const producers = identities ? await findProducersByIds(identities)
    : (await Promise.all(countries.map((country) => listCountryProducers(country.slug)))).flat();
  // Only the few producers with content files need product-file reads.
  const contentKeys = new Set<string>();
  if (!identities) for (const country of countries) {
    let files: string[];
    try { files = await readdir(path.join(process.cwd(), "data/content", country.slug)); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") continue; throw error; }
    for (const file of files) if (/^[1-9]\d*\.json$/.test(file)) contentKeys.add(`${country.slug}:${file.slice(0, -5)}`);
  }
  return (await Promise.all(producers.map(async (producer) => {
    if (!producer || !findPublishedCountry(producer.country)) return null;
    const key = `${producer.country}:${producer.producerId}`;
    const products = identities || contentKeys.has(key) ? (await loadProducerContent(producer.country, producer.producerId)).products : [];
    return { key, name: producer.name, city: producer.city, products: products.map(({ id, name }) => ({ id, name })) };
  }))).filter((item) => item !== null);
};
