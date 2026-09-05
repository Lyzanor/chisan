import { createHash } from "node:crypto";

import type { ProducerIdentity } from "@/lib/csv-catalog";
import { producerSelectionItemKey } from "@/lib/producer-selections";

// A stale preview cannot activate a different selection. This is a revision,
// never authorization: every mutation separately rechecks the active account.
export function selectionPreviewRevision(
  profile: {
    id: string;
    publicHandle: string | null;
    selectionTitle: string | null;
    selectionDescription: string | null;
    displayName: string | null;
  },
  identities: readonly ProducerIdentity[],
): string {
  return createHash("sha256")
    .update(
      JSON.stringify([
        profile.id,
        profile.publicHandle,
        profile.selectionTitle,
        profile.selectionDescription,
        profile.displayName,
        identities.map(producerSelectionItemKey).sort(),
      ]),
    )
    .digest("hex");
}
