import { and, eq, inArray, isNotNull, notInArray, or } from "drizzle-orm";

import { producerProfileUpgradeRequests } from "@/lib/db/schema";

const RESOLVED_DISPUTE_STATUSES = [
  "won",
  "warning_closed",
  "prevented",
] as const;

export function producerProfileUpgradeIncidentCondition() {
  return or(
    inArray(producerProfileUpgradeRequests.status, [
      "paid_unfulfilled",
      "partially_refunded",
      "disputed",
    ]),
    and(
      eq(producerProfileUpgradeRequests.status, "refunded"),
      isNotNull(producerProfileUpgradeRequests.providerDisputeId),
      isNotNull(producerProfileUpgradeRequests.providerDisputeStatus),
      notInArray(producerProfileUpgradeRequests.providerDisputeStatus, [
        ...RESOLVED_DISPUTE_STATUSES,
      ]),
    ),
  );
}
