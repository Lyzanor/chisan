import "server-only";
import { getDatabase, type Database } from "../db";
import { shelfCatalog } from "./catalog";
export { shelfCatalog } from "./catalog";
import { resolvePublicProfileBaseLocation } from "../accounts/public-profile-location.server";
import { createSelectionShelfService } from "./service";
import { createShelfDetector, createShelfProcessor } from "./detector";
import { selectionShelfEnabled } from "./policy";
import { createAIProvider } from "../ai/runtime";
import { aiCallLimit, readAIAllowance } from "../ai/allowance";
import { isAccountSystemConfigured } from "../accounts/config";

export function selectionShelfAvailable() {
  return selectionShelfEnabled() && isAccountSystemConfigured();
}

export function selectionShelfService(database: Database = getDatabase()) {
  return createSelectionShelfService({ database, catalog: shelfCatalog, enabled: selectionShelfAvailable,
    allowance: (reader) => readAIAllowance(reader, aiCallLimit()), location: resolvePublicProfileBaseLocation });
}

export async function runSelectionShelfQueue(id?: string) {
  if (!selectionShelfAvailable()) return;
  const database = getDatabase();
  const processor = createShelfProcessor({ database, service: selectionShelfService(database),
    detector: (id) => createShelfDetector(createAIProvider(database, "shelf-identification", process.env, { type: "selection_shelf", id })) });
  // One photo per invocation; staff can process pending work on demand after a restart.
  await processor(id);
}
