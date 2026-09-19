import "server-only";
import { after } from "next/server";
import { getCurrentAccount } from "../accounts/auth";
import { runSelectionShelfQueue, selectionShelfService, selectionShelfAvailable } from "./server";

export const shelfHttpDependencies = {
  enabled: selectionShelfAvailable,
  account: getCurrentAccount,
  service: selectionShelfService,
  schedule: (id: string) => after(async () => {
    try { await runSelectionShelfQueue(id); }
    catch { console.error("Selection shelf processing remains pending; use the review queue to recover."); }
  }),
};
