"use server";

import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";

import { requireCurrentAccount, hasProducerOwnerAccess } from "@/lib/accounts/auth";
import { getAppUrl } from "@/lib/accounts/config";
import {
  formString,
  producerKeySchema,
  profileUpgradeRetrySchema,
} from "@/lib/accounts/input";
import { safeReturnPath } from "@/lib/accounts/producer-fields";
import {
  attachProducerProfileUpgradeCheckout,
  closeProducerProfileUpgradeCheckout,
  fulfillProducerProfileUpgradeCheckout,
  prepareProducerProfileUpgradeRequest,
  reconcileProducerProfileUpgradeCheckoutForOwner,
} from "@/lib/payments/stripe-profile-upgrades";
import {
  PRODUCER_PROFILE_UPGRADE_TERMS_VERSION,
} from "@/lib/accounts/producer-profile-upgrade-policy";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { producerProfileUpgradeRequests } from "@/lib/db/schema";
import {
  getStripeClient,
  getValidatedProfileUpgradeStripePrice,
} from "@/lib/payments/stripe";
import { STRIPE_PAYMENT_PROVIDER } from "@/lib/payments/payment-provider";
import { getStripeProfileUpgradeConfiguration } from "@/lib/payments/stripe-profile-upgrade-config";
import { STRIPE_PROFILE_UPGRADE_METADATA_KIND } from "@/lib/payments/stripe-profile-upgrade-policy";

function upgradePath(country: string, producerId: number): string {
  return `/cuenta/productores/${encodeURIComponent(country)}/${producerId}/ampliar`;
}

type ProfileUpgradeMessageCode =
  | "accept_terms"
  | "already_active"
  | "another_owner_pending"
  | "catalog_missing"
  | "checkout_expired"
  | "current_status"
  | "invalid_producer"
  | "owner_changed"
  | "owner_required"
  | "payment_confirming"
  | "recheck_failed"
  | "stripe_no_url"
  | "unavailable";

function redirectWithCode(path: string, code: ProfileUpgradeMessageCode): never {
  const url = new URL(safeReturnPath(path), "https://chisan.invalid");
  url.searchParams.set("upgrade", code);
  redirect(`${url.pathname}${url.search}`);
}

async function resumeAttachedProfileUpgradeCheckout(
  path: string,
  sessionId: string,
): Promise<never> {
  const existing = await getStripeClient()
    .checkout.sessions.retrieve(sessionId)
    .catch(() => redirectWithCode(path, "unavailable"));
  if (existing.status === "open") {
    if (!getStripeProfileUpgradeConfiguration().webhookReady) {
      redirectWithCode(path, "unavailable");
    }
    if (existing.url) redirect(existing.url);
    redirectWithCode(path, "stripe_no_url");
  }
  if (existing.status === "complete") {
    const fulfillment = await fulfillProducerProfileUpgradeCheckout({
      eventId: `checkout-return:${existing.id}`,
      occurredAt: new Date(),
      sessionId: existing.id,
    });
    if (fulfillment === "ignored") {
      redirect(`${path}?checkout=success`);
    }
    if (fulfillment === "incident") {
      redirectWithCode(path, "current_status");
    }
    redirect(path);
  }
  await closeProducerProfileUpgradeCheckout({
    eventId: `checkout-resume:${existing.id}`,
    failure: null,
    session: existing,
    status: "expired",
  });
  redirectWithCode(path, "checkout_expired");
}

export async function startProducerProfileUpgradeCheckout(
  formData: FormData,
): Promise<void> {
  const parsed = producerKeySchema.safeParse({
    country: formString(formData, "country"),
    producerId: formString(formData, "producerId"),
  });
  if (!parsed.success) {
    redirectWithCode("/cuenta", "invalid_producer");
  }
  const path = upgradePath(parsed.data.country, parsed.data.producerId);
  const account = await requireCurrentAccount(path);
  if (
    !(await hasProducerOwnerAccess(
      account.id,
      parsed.data.country,
      parsed.data.producerId,
    ))
  ) {
    redirectWithCode(path, "owner_required");
  }
  if (!(await findProducerById(parsed.data.country, parsed.data.producerId))) {
    redirectWithCode(path, "catalog_missing");
  }

  // Pausing new sales must not strand a Checkout that is already bound to this
  // requester. Resumption creates no new Session and does not accept new terms.
  const [attachedRequest] = await getDatabase()
    .select({
      requesterUserId: producerProfileUpgradeRequests.requesterUserId,
      paymentProvider: producerProfileUpgradeRequests.paymentProvider,
      providerCheckoutId:
        producerProfileUpgradeRequests.providerCheckoutId,
    })
    .from(producerProfileUpgradeRequests)
    .where(
      and(
        eq(producerProfileUpgradeRequests.country, parsed.data.country),
        eq(producerProfileUpgradeRequests.producerId, parsed.data.producerId),
        eq(producerProfileUpgradeRequests.status, "pending"),
      ),
    )
    .limit(1);
  if (
    attachedRequest?.requesterUserId === account.id &&
    attachedRequest.paymentProvider === STRIPE_PAYMENT_PROVIDER &&
    attachedRequest.providerCheckoutId
  ) {
    return resumeAttachedProfileUpgradeCheckout(
      path,
      attachedRequest.providerCheckoutId,
    );
  }

  const accepted = formString(formData, "acceptUpgradeTerms") === "yes";
  const termsVersion = formString(formData, "termsVersion");
  const acceptedTermsUrl = formString(formData, "termsUrl");
  const paymentConfiguration = getStripeProfileUpgradeConfiguration();
  if (
    !accepted ||
    termsVersion !== PRODUCER_PROFILE_UPGRADE_TERMS_VERSION ||
    !paymentConfiguration.termsUrl ||
    acceptedTermsUrl !== paymentConfiguration.termsUrl
  ) {
    redirectWithCode(path, "accept_terms");
  }
  if (!paymentConfiguration.checkoutReady) {
    redirectWithCode(path, "unavailable");
  }

  let price;
  try {
    price = await getValidatedProfileUpgradeStripePrice();
  } catch {
    redirectWithCode(path, "unavailable");
  }
  const preparation = await prepareProducerProfileUpgradeRequest({
    country: parsed.data.country,
    producerId: parsed.data.producerId,
    requesterUserId: account.id,
    providerOfferId: price.id,
    termsAcceptedAt: new Date(),
  });
  if (preparation.kind === "already_active") {
    redirectWithCode(path, "already_active");
  }
  if (preparation.kind === "not_owner") {
    redirectWithCode(path, "owner_changed");
  }
  if (preparation.kind === "owned_by_another_account") {
    redirectWithCode(path, "another_owner_pending");
  }
  if (preparation.kind === "provider_conflict") {
    redirectWithCode(path, "current_status");
  }
  const request = preparation.request;
  if (request.status !== "pending") {
    redirectWithCode(path, "current_status");
  }

  if (request.providerCheckoutId) {
    return resumeAttachedProfileUpgradeCheckout(
      path,
      request.providerCheckoutId,
    );
  }

  const metadata = {
    kind: STRIPE_PROFILE_UPGRADE_METADATA_KIND,
    upgradeRequestId: request.id,
  };
  const appUrl = getAppUrl();
  const session = await getStripeClient().checkout.sessions.create(
    {
      mode: "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      client_reference_id: request.id,
      metadata,
      payment_intent_data: { metadata },
      customer_creation: "always",
      customer_email: account.emailVerified ? account.email ?? undefined : undefined,
      success_url: `${appUrl}${path}?checkout=success`,
      cancel_url: `${appUrl}${path}?checkout=cancelled`,
    },
    { idempotencyKey: `profile-upgrade:${request.id}:v1` },
  );
  const attachment = await attachProducerProfileUpgradeCheckout(request.id, session);
  if (attachment === "owner_changed") {
    redirectWithCode(path, "owner_changed");
  }
  if (!session.url) {
    redirectWithCode(path, "stripe_no_url");
  }
  redirect(session.url);
}

export async function recheckProducerProfileUpgradeCheckout(
  formData: FormData,
): Promise<void> {
  const producer = producerKeySchema.safeParse({
    country: formString(formData, "country"),
    producerId: formString(formData, "producerId"),
  });
  const request = profileUpgradeRetrySchema.safeParse({
    requestId: formString(formData, "requestId"),
  });
  if (!producer.success || !request.success) {
    redirectWithCode("/cuenta", "invalid_producer");
  }
  const path = upgradePath(producer.data.country, producer.data.producerId);
  const account = await requireCurrentAccount(path);
  if (
    !(await hasProducerOwnerAccess(
      account.id,
      producer.data.country,
      producer.data.producerId,
    ))
  ) {
    redirectWithCode(path, "owner_required");
  }

  const [boundRequest] = await getDatabase()
    .select({
      country: producerProfileUpgradeRequests.country,
      producerId: producerProfileUpgradeRequests.producerId,
    })
    .from(producerProfileUpgradeRequests)
    .where(eq(producerProfileUpgradeRequests.id, request.data.requestId))
    .limit(1);
  if (
    !boundRequest ||
    boundRequest.country !== producer.data.country ||
    boundRequest.producerId !== producer.data.producerId
  ) {
    redirectWithCode(path, "current_status");
  }

  let reconciliation;
  try {
    reconciliation = await reconcileProducerProfileUpgradeCheckoutForOwner({
      ownerUserId: account.id,
      requestId: request.data.requestId,
    });
  } catch {
    redirectWithCode(path, "recheck_failed");
  }

  if (reconciliation.kind === "expired") {
    redirectWithCode(path, "checkout_expired");
  }
  if (reconciliation.kind === "open") {
    redirectWithCode(path, "another_owner_pending");
  }
  if (reconciliation.kind === "processing") {
    redirectWithCode(path, "payment_confirming");
  }
  if (reconciliation.kind === "reconciled") {
    if (
      reconciliation.result === "fulfilled" ||
      reconciliation.result === "duplicate"
    ) {
      redirect(path);
    }
    if (reconciliation.result === "ignored") {
      redirectWithCode(path, "payment_confirming");
    }
    redirectWithCode(path, "current_status");
  }
  redirectWithCode(path, "current_status");
}
