import { and, desc, eq, inArray } from "drizzle-orm";
import { PencilSimpleIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { cache, type ReactNode } from "react";

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
import { producerProfileLabels } from "@/lib/i18n/producer-profile";
import { getProducerStatsLabels } from "@/lib/i18n/producer-stats";
import type { Messages } from "@/lib/i18n/messages";
import { getStripeProfileUpgradeConfiguration } from "@/lib/payments/stripe-profile-upgrade-config";

type ProducerSuggestionActionProps = {
  country: string;
  producerId: number;
  messages: Messages["accountActions"];
};

type ProducerAccountActionsProps = ProducerSuggestionActionProps & {
  locale: Locale;
};

// The suggestion action and the closing section read the same viewer state in
// one request; the cache keeps that to a single set of account queries.
const loadProducerAccountState = cache(
  async (country: string, producerId: number) => {
    const [account, activeOwner] = await Promise.all([
      getCurrentAccount(),
      isProducerOwnershipVerified(country, producerId),
    ]);
    if (!account) {
      return { account, activeOwner, membership: undefined, claim: undefined, openSuggestion: undefined };
    }

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
    return { account, activeOwner, membership, claim, openSuggestion };
  },
);

async function renderWithAccountFallback(
  render: () => Promise<ReactNode>,
): Promise<ReactNode> {
  if (!isAccountSystemConfigured()) return null;

  try {
    return await render();
  } catch (error) {
    // Account storage is deliberately optional for the public CSV catalog.
    // A provider or database incident must not make a producer page unavailable.
    console.error("Producer account actions are temporarily unavailable.", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return null;
  }
}

/** Community corrections, shown beside the profile details and their notice. */
export async function ProducerSuggestionAction({
  country,
  producerId,
  messages,
}: ProducerSuggestionActionProps) {
  return renderWithAccountFallback(async () => {
    const { account, activeOwner, membership, claim, openSuggestion } =
      await loadProducerAccountState(country, producerId);

    // Only an unclaimed producer accepts community corrections: once ownership is
    // verified, its holder maintains the profile through the producer editor.
    if (activeOwner || membership || claim) return null;

    const suggestionPath = newProducerSuggestionPath(country, producerId);
    const href = !account
      ? `${ACCOUNT_ROUTES.signIn}?redirect_url=${encodeURIComponent(suggestionPath)}`
      : openSuggestion
        ? "/cuenta/sugerencias"
        : suggestionPath;

    return (
      <Link className="detail-suggest" href={href}>
        <PencilSimpleIcon size={18} aria-hidden="true" />
        {openSuggestion ? messages.viewMySuggestions : messages.suggestChanges}
      </Link>
    );
  });
}

/**
 * The closing section only addresses the producer: an invitation to claim an
 * unverified profile, or the management links of its active members.
 */
export async function ProducerAccountActions({
  country,
  producerId,
  messages,
  locale,
}: ProducerAccountActionsProps) {
  return renderWithAccountFallback(async () => {
    const { account, activeOwner, membership, claim } =
      await loadProducerAccountState(country, producerId);
    const words = producerProfileLabels(locale);

    if (membership) {
      const canOfferProfileUpgrade =
        membership.role === "owner" &&
        getStripeProfileUpgradeConfiguration().checkoutReady
          ? await ownerCanStartProfileUpgrade(getDatabase(), country, producerId)
          : false;

      return (
        <ProducerClosingSection title={words.contribute} help={words.contributeHelp}>
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
        </ProducerClosingSection>
      );
    }

    if (activeOwner) return null;

    const claimPath = `/cuenta/reclamaciones/nueva?country=${encodeURIComponent(country)}&producerId=${producerId}`;
    return (
      <ProducerClosingSection title={words.participate} help={words.participateHelp}>
        {!account ? (
          <Link href={`${ACCOUNT_ROUTES.signIn}?redirect_url=${encodeURIComponent(claimPath)}`}>
            {messages.claimProducer}
          </Link>
        ) : claim ? (
          <Link href="/cuenta/reclamaciones">{messages.viewOwnershipClaim}</Link>
        ) : (
          <Link href={claimPath}>{messages.claimProducer}</Link>
        )}
      </ProducerClosingSection>
    );
  });
}

function ProducerClosingSection({
  title,
  help,
  children,
}: {
  title: string;
  help: string;
  children: ReactNode;
}) {
  return (
    <section
      className="detail-participate"
      aria-labelledby="detail-participate-title"
    >
      <div>
        <h2 id="detail-participate-title">{title}</h2>
        <p>{help}</p>
      </div>
      <div className="producer-account-actions">{children}</div>
    </section>
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
