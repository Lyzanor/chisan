import { and, desc, eq, inArray } from "drizzle-orm";
import Link from "next/link";

import { toggleFavoriteAction } from "@/app/(application)/cuenta/actions";
import { getCurrentAccount } from "@/lib/accounts/auth";
import {
  ACCOUNT_ROUTES,
  isAccountSystemConfigured,
} from "@/lib/accounts/config";
import { safeReturnPath } from "@/lib/accounts/producer-fields";
import { isProducerOwnershipVerified } from "@/lib/accounts/producer-ownership";
import { hasActiveProducerPremiumEntitlement } from "@/lib/accounts/producer-premium-entitlements";
import { getDatabase } from "@/lib/db";
import {
  favorites,
  producerClaims,
  producerMemberships,
  producerProfileUpgradeRequests,
} from "@/lib/db/schema";
import type { Messages } from "@/lib/i18n/messages";
import { getStripeProfileUpgradeConfiguration } from "@/lib/payments/stripe-profile-upgrade-config";

type ProducerAccountActionsProps = {
  country: string;
  producerId: number;
  returnTo: string;
  messages: Messages["accountActions"];
};

export async function ProducerAccountActions({
  country,
  producerId,
  returnTo,
  messages,
}: ProducerAccountActionsProps) {
  if (!isAccountSystemConfigured()) return null;

  try {
    return await renderProducerAccountActions({ country, producerId, returnTo, messages });
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
  returnTo,
  messages,
}: ProducerAccountActionsProps) {
  const safeReturnTo = safeReturnPath(returnTo, "/");
  const database = getDatabase();
  const [account, activeOwner] = await Promise.all([
    getCurrentAccount(),
    isProducerOwnershipVerified(country, producerId),
  ]);

  if (!account) {
    const redirectQuery = encodeURIComponent(safeReturnTo);
    return (
      <div className="producer-account-actions">
        <span>
          {activeOwner
            ? messages.ownershipVerifiedDescription
            : messages.saveOrClaimPrompt}
        </span>
        <Link href={`${ACCOUNT_ROUTES.signIn}?redirect_url=${redirectQuery}`}>
          {messages.signIn}
        </Link>
        <Link href={`${ACCOUNT_ROUTES.signUp}?redirect_url=${redirectQuery}`}>
          {messages.createAccount}
        </Link>
      </div>
    );
  }

  const [[favorite], [membership], [claim]] = await Promise.all([
    database
      .select({ userId: favorites.userId })
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, account.id),
          eq(favorites.country, country),
          eq(favorites.producerId, producerId),
        ),
      )
      .limit(1),
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
  ]);
  const canOfferProfileUpgrade =
    membership?.role === "owner" &&
    getStripeProfileUpgradeConfiguration().checkoutReady
    ? await ownerCanStartProfileUpgrade(database, country, producerId)
    : false;

  return (
    <div className="producer-account-actions">
      <form action={toggleFavoriteAction}>
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="producerId" value={producerId} />
        <input type="hidden" name="returnTo" value={safeReturnTo} />
        <button type="submit">
          {favorite ? messages.removeFavorite : messages.saveFavorite}
        </button>
      </form>
      {membership ? (
        <>
          <Link href={`/cuenta/productores/${country}/${producerId}/editar`}>
            {messages.editMyProfile}
          </Link>
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
        <Link
          href={`/cuenta/reclamaciones/nueva?country=${encodeURIComponent(country)}&producerId=${producerId}`}
        >
          {messages.claimProducer}
        </Link>
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
