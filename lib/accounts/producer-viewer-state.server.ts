import "server-only";
import { and, desc, eq, inArray } from "drizzle-orm";
import { cache } from "react";
import { getCurrentAccount } from "./auth";
import { isProducerOwnershipVerified } from "./producer-ownership";
import { hasActiveProducerPremiumEntitlement } from "./producer-premium-entitlements";
import { OPEN_PRODUCER_SUGGESTION_STATUSES } from "./producer-suggestion-workflow";
import { guestProducerViewerState, type ProducerViewerState } from "./producer-viewer-state";
import { getDatabase } from "@/lib/db";
import { producerClaims, producerMemberships, producerProfileUpgradeRequests, producerSuggestions } from "@/lib/db/schema";
import { getStripeProfileUpgradeConfiguration } from "@/lib/payments/stripe-profile-upgrade-config";

export const loadProducerViewerState = cache(
  async (country: string, producerId: number) => {
    const account = await getCurrentAccount();
    if (!account) return guestProducerViewerState(false);
    const activeOwner = await isProducerOwnershipVerified(country, producerId);

    const database = getDatabase();
    const [[membership], [claim], [openSuggestion]] = await Promise.all([
      database
        .select({ id: producerMemberships.id, role: producerMemberships.role })
        .from(producerMemberships)
        .where(
          and(
            eq(producerMemberships.userId, account.id),
            eq(producerMemberships.country, country),
            eq(producerMemberships.producerId, producerId),
            eq(producerMemberships.status, "active"),
          ),
        )
        .limit(1),
      database
        .select({ id: producerClaims.id })
        .from(producerClaims)
        .where(
          and(
            eq(producerClaims.claimantUserId, account.id),
            eq(producerClaims.country, country),
            eq(producerClaims.producerId, producerId),
            inArray(producerClaims.status, ["draft", "pending", "needs_info", "approved"]),
          ),
        )
        .limit(1),
      database
        .select({ id: producerSuggestions.id })
        .from(producerSuggestions)
        .where(
          and(
            eq(producerSuggestions.authorUserId, account.id),
            eq(producerSuggestions.country, country),
            eq(producerSuggestions.producerId, producerId),
            inArray(producerSuggestions.status, [
              ...OPEN_PRODUCER_SUGGESTION_STATUSES,
            ]),
          ),
        )
        .limit(1),
    ]);
    const canOfferProfileUpgrade = membership?.role === "owner" &&
      getStripeProfileUpgradeConfiguration().checkoutReady
        ? await ownerCanStartProfileUpgrade(database, country, producerId) : false;
    return {
      signedIn: true, activeOwner,
      membership: membership ? { role: membership.role } : null,
      claim: Boolean(claim), openSuggestion: Boolean(openSuggestion),
      canOfferProfileUpgrade,
    } satisfies ProducerViewerState;
  },
);

async function ownerCanStartProfileUpgrade(
  database: ReturnType<typeof getDatabase>,
  country: string,
  producerId: number,
): Promise<boolean> {
  const [premiumActive, [latestRequest]] = await Promise.all([
    hasActiveProducerPremiumEntitlement(country, producerId),
    database
      .select({ status: producerProfileUpgradeRequests.status })
      .from(producerProfileUpgradeRequests)
      .where(
        and(
          eq(producerProfileUpgradeRequests.country, country),
          eq(producerProfileUpgradeRequests.producerId, producerId),
        ),
      )
      .orderBy(desc(producerProfileUpgradeRequests.createdAt))
      .limit(1),
  ]);
  return (
    !premiumActive &&
    (!latestRequest ||
      ["expired", "payment_failed", "refunded", "dispute_lost"].includes(
        latestRequest.status,
      ))
  );
}
