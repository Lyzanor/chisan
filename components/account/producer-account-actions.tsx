import { and, desc, eq, inArray } from "drizzle-orm";
import Link from "next/link";

import { getCurrentAccount } from "@/lib/accounts/auth";
import {
  ACCOUNT_ROUTES,
  isAccountSystemConfigured,
} from "@/lib/accounts/config";
import { isProducerOwnershipVerified } from "@/lib/accounts/producer-ownership";
import { hasActiveProducerPremiumEntitlement } from "@/lib/accounts/producer-premium-entitlements";
import {
  OPEN_PRODUCER_SUGGESTION_STATUSES,
  newProducerSuggestionPath,
} from "@/lib/accounts/producer-suggestion-workflow";
import { getDatabase } from "@/lib/db";
import {
  producerClaims,
  producerMemberships,
  producerProfileUpgradeRequests,
  producerSuggestions,
} from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/locales";
import { getProducerStatsLabels } from "@/lib/i18n/producer-stats";
import type { Messages } from "@/lib/i18n/messages";
import { getStripeProfileUpgradeConfiguration } from "@/lib/payments/stripe-profile-upgrade-config";

type ProducerAccountActionsProps = {
  country: string;
  producerId: number;
  returnTo: string;
  messages: Messages["accountActions"];
  locale: Locale;
};

export async function ProducerAccountActions({
  country,
  producerId,
  returnTo,
  messages,
  locale,
}: ProducerAccountActionsProps) {
  if (!isAccountSystemConfigured()) return null;

  try {
    return await renderProducerAccountActions({ country, producerId, returnTo, messages, locale });
  } catch (error) {
    // Account storage is deliberately optional for the public CSV catalog.
    // A provider or database incident must not make a producer page unavailable.
    console.error("Producer account actions are temporarily unavailable.", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return null;
  }
}

async function renderProducerAccountActions({
  country,
  producerId,
  messages,
  locale,
}: ProducerAccountActionsProps) {
  const database = getDatabase();
  const [account, activeOwner] = await Promise.all([
    getCurrentAccount(),
    isProducerOwnershipVerified(country, producerId),
  ]);

  // Only an unclaimed producer accepts community corrections: once ownership is
  // verified, its holder maintains the profile through the producer editor.
  const suggestionPath = newProducerSuggestionPath(country, producerId);

  if (!account) {
    const claimPath = `/cuenta/reclamaciones/nueva?country=${encodeURIComponent(country)}&producerId=${producerId}`;
    return <div className="producer-account-actions">
      {activeOwner ? <span>{messages.ownershipVerifiedDescription}</span> : <>
        <Link href={`${ACCOUNT_ROUTES.signIn}?redirect_url=${encodeURIComponent(claimPath)}`}>{messages.claimProducer}</Link>
        <Link href={`${ACCOUNT_ROUTES.signIn}?redirect_url=${encodeURIComponent(suggestionPath)}`}>{messages.suggestChanges}</Link>
      </>}
    </div>;
  }

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
  const canOfferProfileUpgrade =
    membership?.role === "owner" &&
    getStripeProfileUpgradeConfiguration().checkoutReady
    ? await ownerCanStartProfileUpgrade(database, country, producerId)
    : false;

  return (
    <div className="producer-account-actions">
      {membership ? (
        <>
          <Link href={`/cuenta/productores/${country}/${producerId}/editar`}>
            {messages.editMyProfile}
          </Link>
          {membership.role === "owner" ? (
            <Link href={`/cuenta/productores/${country}/${producerId}/estadisticas`}>
              {getProducerStatsLabels(locale).link}
            </Link>
          ) : null}
          {canOfferProfileUpgrade ? (
            <Link href={`/cuenta/productores/${country}/${producerId}/ampliar`}>
              {messages.expandProfile}
            </Link>
          ) : null}
        </>
      ) : activeOwner ? (
        <span>{messages.ownershipVerified}</span>
      ) : claim ? (
        <Link href="/cuenta/reclamaciones">{messages.viewOwnershipClaim}</Link>
      ) : (
        <>
          <Link
            href={`/cuenta/reclamaciones/nueva?country=${encodeURIComponent(country)}&producerId=${producerId}`}
          >
            {messages.claimProducer}
          </Link>
          <Link href={openSuggestion ? "/cuenta/sugerencias" : suggestionPath}>
            {openSuggestion
              ? messages.viewMySuggestions
              : messages.suggestChanges}
          </Link>
        </>
      )}
    </div>
  );
}

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
