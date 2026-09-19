import "server-only";
import { getDatabase, type Database } from "../db";
import { findProducersByIds, findPublishedCountry } from "../csv-catalog";
import { loadProducerContent } from "../catalog/content";
import { createSelectionShelfService, type ShelfCatalog } from "./service";
import { createShelfDetector, createShelfProcessor } from "./detector";
import { selectionShelfEnabled } from "./policy";
import { createAIProvider } from "../ai/runtime";
import { isAccountSystemConfigured } from "../accounts/config";

export function selectionShelfAvailable() {
  return selectionShelfEnabled() && isAccountSystemConfigured();
}

export const shelfCatalog: ShelfCatalog = async (identities) => {
  const producers = await findProducersByIds(identities);
  return (await Promise.all(producers.map(async (producer) => {
    if (!producer || !findPublishedCountry(producer.country)) return null;
    const content = await loadProducerContent(producer.country, producer.producerId);
    return { key: `${producer.country}:${producer.producerId}`, name: producer.name, city: producer.city,
      products: content.products.slice(0, 30).map((product) => product.name) };
  }))).filter((item) => item !== null);
};

export function selectionShelfService(database: Database = getDatabase()) {
  return createSelectionShelfService({ database, catalog: shelfCatalog, enabled: selectionShelfAvailable });
}

export async function runSelectionShelfQueue(id?: string) {
  if (!selectionShelfAvailable()) return;
  const database = getDatabase();
  const process = createShelfProcessor({ database, service: selectionShelfService(database),
    detector: () => createShelfDetector(createAIProvider(database, "shelf-identification")) });
  // One photo per invocation; staff can process pending work on demand after a restart.
  await process(id);
}
