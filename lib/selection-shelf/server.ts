import "server-only";
import { getDatabase, type Database } from "../db";
import { shelfCatalog } from "./catalog";
export { shelfCatalog } from "./catalog";
import { resolvePublicProfileBaseLocation } from "../accounts/public-profile-location.server";
import { createSelectionShelfService } from "./service";
import { createShelfDetector, createShelfProcessor } from "./detector";
import { selectionShelfEnabled } from "./policy";
import { createAIProvider } from "../ai/runtime";
import { isAccountSystemConfigured } from "../accounts/config";

export function selectionShelfAvailable() {
  return selectionShelfEnabled() && isAccountSystemConfigured();
}

export function selectionShelfService(database: Database = getDatabase()) {
  return createSelectionShelfService({ database, catalog: shelfCatalog, enabled: selectionShelfAvailable, location: resolvePublicProfileBaseLocation });
}

export async function runSelectionShelfQueue(id?: string) {
  if (!selectionShelfAvailable()) return;
  const database = getDatabase();
  const process = createShelfProcessor({ database, service: selectionShelfService(database),
    detector: () => createShelfDetector(createAIProvider(database, "shelf-identification")) });
  // One photo per invocation; staff can process pending work on demand after a restart.
  await process(id);
}
