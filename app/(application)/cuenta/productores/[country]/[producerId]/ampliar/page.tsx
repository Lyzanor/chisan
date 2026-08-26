import { and, desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  recheckProducerProfileUpgradeCheckout,
  startProducerProfileUpgradeCheckout,
} from "@/app/(application)/cuenta/profile-upgrade-actions";
import { ProfileUpgradeStatusRefresh } from "@/components/account/profile-upgrade-status-refresh";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import {
  hasProducerAccess,
  hasProducerOwnerAccess,
  requireCurrentAccount,
} from "@/lib/accounts/auth";
import { profileUpgradeRequestUsesStoredOffer } from "@/lib/accounts/producer-profile-upgrade-domain";
import { hasActiveProducerPremiumEntitlement } from "@/lib/accounts/producer-premium-entitlements";
import { PRODUCER_PROFILE_UPGRADE_TERMS_VERSION } from "@/lib/accounts/producer-profile-upgrade-policy";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { producerProfileUpgradeRequests } from "@/lib/db/schema";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import { formatMinorCurrencyAmount } from "@/lib/payments/currency";
import { STRIPE_PAYMENT_PROVIDER } from "@/lib/payments/payment-provider";
import { getStripeProfileUpgradeConfiguration } from "@/lib/payments/stripe-profile-upgrade-config";

export const metadata: Metadata = {
  title: "Expand producer profile",
  robots: { index: false, follow: false },
};

type UpgradePageProps = {
  params: Promise<{ country: string; producerId: string }>;
  searchParams: Promise<{ checkout?: string; upgrade?: string }>;
};

const UPGRADE_MESSAGE_COPY = {
  accept_terms: ["error", "Accept the versioned profile-upgrade offer before paying."],
  already_active: ["notice", "This producer already has an expanded profile."],
  another_owner_pending: [
    "error",
    "Another owner already started a payment request for this producer.",
  ],
  catalog_missing: ["error", "That producer is no longer in the catalog."],
  checkout_expired: ["notice", "The previous Checkout expired. Start a new one."],
  current_status: ["notice", "Review the current payment status below."],
  owner_changed: ["error", "Your owner access changed before Checkout started."],
  owner_required: ["error", "Only the verified owner can purchase this profile upgrade."],
  payment_confirming: ["notice", "The payment provider is confirming the payment."],
  recheck_failed: [
    "error",
    "The payment provider could not be checked safely. No new payment was started; try again later.",
  ],
  stripe_no_url: ["error", "Stripe did not return a Checkout URL."],
  unavailable: ["error", "Profile upgrades are not available right now."],
} as const;

const STATUS_COPY = {
  pending: "A Checkout request is open. Payment has not been confirmed yet.",
  paid: "The payment provider confirmed this purchase.",
  paid_unfulfilled:
    "The payment provider recorded a payment, but Chisan could not safely activate it. Support must reconcile or refund it.",
  payment_failed: "The asynchronous payment failed. You can start a new request.",
  expired: "The previous Checkout expired without a confirmed payment.",
  partially_refunded:
    "This payment was partially refunded. The expanded profile is suspended pending review.",
  refunded: "This payment was refunded and its expanded-profile right was revoked.",
  disputed: "This payment is disputed. The expanded profile is suspended.",
  dispute_lost:
    "The dispute was lost, the charge was reversed and the expanded-profile right was revoked. The producer is eligible for a new purchase.",
} as const;

export default async function UpgradeProducerProfilePage({
  params,
  searchParams,
}: UpgradePageProps) {
  const [{ country: rawCountry, producerId: rawProducerId }, query, account, presentation] =
    await Promise.all([
      params,
      searchParams,
      requireCurrentAccount(),
      loadApplicationPresentation(),
    ]);
  const country = rawCountry.trim().toLowerCase();
  const producerId = Number(rawProducerId);
  if (!/^[a-z]{2}$/.test(country) || !Number.isSafeInteger(producerId) || producerId <= 0) {
    notFound();
  }
  if (!(await hasProducerAccess(account.id, country, producerId))) {
    redirect(
      "/cuenta/reclamaciones?error=An%20approved%20producer%20membership%20is%20required%20for%20this%20profile.",
    );
  }
  const producer = await findProducerById(country, producerId);
  if (!producer) notFound();

  const [owner, premiumActive, [latestRequest]] = await Promise.all([
    hasProducerOwnerAccess(account.id, country, producerId),
    hasActiveProducerPremiumEntitlement(country, producerId),
    getDatabase()
      .select()
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
  const publicHref = buildAccountProducerHref(producer, presentation.explicitLocale);
  const paymentConfiguration = getStripeProfileUpgradeConfiguration();
  const checkoutReady = paymentConfiguration.checkoutReady;
  const latestUsesStripe =
    latestRequest?.paymentProvider === STRIPE_PAYMENT_PROVIDER;
  const requestUsesStoredOffer =
    latestUsesStripe && latestRequest && profileUpgradeRequestUsesStoredOffer(latestRequest);
  const displayedTermsUrl = requestUsesStoredOffer
    ? latestRequest.termsUrl
    : paymentConfiguration.termsUrl;
  const displayedTermsVersion = requestUsesStoredOffer
    ? latestRequest.termsVersion
    : PRODUCER_PROFILE_UPGRADE_TERMS_VERSION;
  const staleFormerOwnerRequest =
    latestUsesStripe &&
    latestRequest?.status === "pending" &&
    latestRequest.requesterUserId !== account.id &&
    latestRequest.providerCheckoutId === null;
  const unattachedCurrentOwnerRequest =
    latestUsesStripe &&
    latestRequest?.status === "pending" &&
    latestRequest.requesterUserId === account.id &&
    latestRequest.providerCheckoutId === null;
  const canStartCheckout =
    owner &&
    checkoutReady &&
    !premiumActive &&
    (!latestRequest ||
      ["expired", "payment_failed", "refunded", "dispute_lost"].includes(
        latestRequest.status,
      ) ||
      staleFormerOwnerRequest ||
      unattachedCurrentOwnerRequest);
  const canResumeCheckout =
    owner &&
    paymentConfiguration.webhookReady &&
    !premiumActive &&
    latestRequest?.status === "pending" &&
    latestRequest.requesterUserId === account.id &&
    latestUsesStripe &&
    latestRequest.providerCheckoutId !== null;
  const pendingFromAnotherOwner =
    owner &&
    !premiumActive &&
    latestRequest?.status === "pending" &&
    latestRequest.requesterUserId !== account.id &&
    !staleFormerOwnerRequest;
  const upgradeMessage =
    query.upgrade && query.upgrade in UPGRADE_MESSAGE_COPY
      ? UPGRADE_MESSAGE_COPY[query.upgrade as keyof typeof UPGRADE_MESSAGE_COPY]
      : null;

  return (
    <div className="account-content account-content--narrow">
      {upgradeMessage ? (
        <div
          className={`account-callout${upgradeMessage[0] === "error" ? " account-callout--error" : ""}`}
          role={upgradeMessage[0] === "error" ? "alert" : "status"}
        >
          <p>{upgradeMessage[1]}</p>
        </div>
      ) : null}
      <header className="account-section-heading">
        <div>
          <p className="catalog-kicker">Expanded producer profile</p>
          <h2>{producer.name}</h2>
          <p>
            {premiumActive
              ? "Expanded access active"
              : checkoutReady || latestUsesStripe
                ? "One-time payment · €49"
                : "Producer-scoped access"}
          </p>
        </div>
        <Link href={publicHref} className="account-button account-button--secondary">
          Public profile
        </Link>
      </header>

      {latestUsesStripe &&
      query.checkout === "cancelled" &&
      latestRequest?.status === "pending" ? (
        <div className="account-callout" role="status">
          <strong>Checkout was cancelled.</strong>
          <p>No profile right is granted until Stripe confirms a paid Checkout.</p>
        </div>
      ) : null}
      {latestUsesStripe &&
      query.checkout === "success" &&
      latestRequest?.status === "pending" ? (
        <div className="account-callout" role="status">
          <strong>Stripe is confirming the payment.</strong>
          <p>The return URL is not proof of payment. The signed webhook updates this page.</p>
          <ProfileUpgradeStatusRefresh enabled />
        </div>
      ) : null}

      {premiumActive ? (
        <div className="account-callout account-callout--success" role="status">
          <strong>Expanded profile active</strong>
          <p>
            Premium fields are now available in the normal reviewed CSV proposal form.
          </p>
          <Link
            href={`/cuenta/productores/${country}/${producerId}/editar`}
            className="account-button"
          >
            Edit expanded profile
          </Link>
        </div>
      ) : null}

      {latestRequest ? (
        <section
          className="account-card"
          aria-live={premiumActive ? undefined : "polite"}
          aria-atomic="true"
        >
          <p className="catalog-kicker">Latest request</p>
          <h3>{latestRequest.status.replaceAll("_", " ")}</h3>
          <p>{STATUS_COPY[latestRequest.status]}</p>
          <small>
            Request {latestRequest.id} · Offer{" "}
            {formatMinorCurrencyAmount(
              latestRequest.amountMinor,
              latestRequest.currency,
            )}
            {latestRequest.amountCapturedMinor !== null && latestRequest.capturedCurrency
              ? ` · Captured ${formatMinorCurrencyAmount(
                  latestRequest.amountCapturedMinor,
                  latestRequest.capturedCurrency,
                )}`
              : ""}
            {latestRequest.amountRefundedMinor > 0
              ? ` · Refunded ${formatMinorCurrencyAmount(
                  latestRequest.amountRefundedMinor,
                  latestRequest.capturedCurrency ?? latestRequest.currency,
                )}`
              : ""}
            {` · Provider ${latestRequest.paymentProvider}`}
          </small>
        </section>
      ) : null}

      {!premiumActive && (checkoutReady || latestUsesStripe) ? (
        <section className="account-card">
          <h3>What the €49 payment unlocks</h3>
          <ul>
            <li>Guided-visits availability.</li>
            <li>A producer-authored message to the community.</li>
            <li>Two highlighted external links.</li>
          </ul>
          <p>
            This is a one-time capability attached to this producer while its catalog row remains
            published, unless the payment is refunded or disputed. It does not guarantee a
            permanent listing and does not buy verification, ranking or automatic publication.
            Every factual change remains subject to editorial review, and ordinary corrections
            remain free.
          </p>
          {displayedTermsUrl ? (
            <p>
              Read the versioned{" "}
              <a href={displayedTermsUrl} target="_blank" rel="noreferrer">
                profile-upgrade offer and conditions
              </a>{" "}
              before paying. They define the fiscal treatment, support and refund process for
              this €49 purchase. <small>Offer {displayedTermsVersion}</small>
            </p>
          ) : null}

          {canStartCheckout || canResumeCheckout ? (
            <form action={startProducerProfileUpgradeCheckout} className="account-form">
              <input type="hidden" name="country" value={country} />
              <input type="hidden" name="producerId" value={producerId} />
              <input
                type="hidden"
                name="termsVersion"
                value={PRODUCER_PROFILE_UPGRADE_TERMS_VERSION}
              />
              {canStartCheckout && paymentConfiguration.termsUrl ? (
                <input
                  type="hidden"
                  name="termsUrl"
                  value={paymentConfiguration.termsUrl}
                />
              ) : null}
              {canStartCheckout && displayedTermsUrl ? (
                <label className="account-check">
                  <input type="checkbox" name="acceptUpgradeTerms" value="yes" required />
                  <span>
                    I have read and accept the{" "}
                    <a href={displayedTermsUrl} target="_blank" rel="noreferrer">
                      profile-upgrade offer and conditions (offer {displayedTermsVersion})
                    </a>
                    . I understand the editorial review requirement and that a refund or dispute
                    suspends the expanded profile.
                  </span>
                </label>
              ) : null}
              <button type="submit" className="account-button">
                {canResumeCheckout ? "Continue secure Checkout" : "Expand profile for €49"}
              </button>
              <small>Payment is completed securely on Stripe Checkout.</small>
            </form>
          ) : !owner ? (
            <div className="account-callout">
              <strong>Owner authorization required</strong>
              <p>Editors may maintain an active expanded profile, but only its verified owner can purchase it.</p>
            </div>
          ) : pendingFromAnotherOwner && latestUsesStripe ? (
            <div className="account-callout">
              <strong>An earlier owner&apos;s Checkout is still open.</strong>
              <p>
                Do not start another payment. This producer-bound request must be completed or
                expire before the current owner can begin a new Checkout.
              </p>
              {paymentConfiguration.webhookReady ? (
                <form action={recheckProducerProfileUpgradeCheckout} className="account-form">
                  <input type="hidden" name="country" value={country} />
                  <input type="hidden" name="producerId" value={producerId} />
                  <input type="hidden" name="requestId" value={latestRequest.id} />
                  <button type="submit" className="account-button account-button--secondary">
                    Recheck previous Checkout
                  </button>
                  <small>
                    This only asks Stripe for the existing Session status. It cannot transfer
                    or create a payment.
                  </small>
                </form>
              ) : null}
            </div>
          ) : !checkoutReady ? (
            <div className="account-callout">
              <strong>New purchases are temporarily unavailable.</strong>
              <p>Existing expanded profiles and payment webhooks remain active.</p>
            </div>
          ) : latestRequest?.status === "paid_unfulfilled" ||
            latestRequest?.status === "paid" ||
            latestRequest?.status === "partially_refunded" ||
            latestRequest?.status === "disputed" ? (
            <div className="account-callout">
              <strong>Manual reconciliation required</strong>
              <p>Do not start another payment. Contact Chisan support with the request ID above.</p>
              {paymentConfiguration.supportEmail ? (
                <a
                  href={`mailto:${paymentConfiguration.supportEmail}?subject=${encodeURIComponent(`Profile upgrade ${latestRequest.id}`)}`}
                  className="account-button account-button--secondary"
                >
                  Contact billing support
                </a>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : !premiumActive ? (
        <section className="account-card">
          <h3>Expanded-profile purchases are not open yet</h3>
          <p>
            Chisan keeps this capability separate from the public catalog and has not activated
            its payment adapter. Standard profile corrections remain available without payment.
          </p>
        </section>
      ) : null}
    </div>
  );
}
