import "server-only";

import { and, eq, inArray, ne, sql } from "drizzle-orm";
import type Stripe from "stripe";

import { profileUpgradeOfferMatchesRequest } from "@/lib/accounts/producer-profile-upgrade-domain";
import {
  PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
  PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR,
  PRODUCER_PROFILE_UPGRADE_CURRENCY,
  PRODUCER_PROFILE_UPGRADE_OPEN_STATUSES,
  PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE,
  PRODUCER_PROFILE_UPGRADE_TERMS_VERSION,
} from "@/lib/accounts/producer-profile-upgrade-policy";
import {
  activeProducerPremiumEntitlementCondition,
  conflictUnpublishedPremiumChanges,
} from "@/lib/accounts/producer-premium-entitlements";
import { getDatabase, type Database } from "@/lib/db";
import {
  auditEvents,
  entitlements,
  producerMemberships,
  producerProfileUpgradeRequests,
  type ProducerProfileUpgradeRequest,
} from "@/lib/db/schema";
import {
  STRIPE_PAYMENT_PROVIDER,
  paymentRequestUsesProvider,
} from "@/lib/payments/payment-provider";
import { getStripeClient } from "@/lib/payments/stripe";
import { getStripeProfileUpgradeConfiguration } from "@/lib/payments/stripe-profile-upgrade-config";
import {
  PRODUCER_PROFILE_UPGRADE_UNMATCHED_COMMERCIAL_ACTION,
  canRetryPaidUnfulfilledProfileUpgrade,
  paymentObjectId,
  profileUpgradeDisputeState,
  requiresProfileUpgradeCommercialTransition,
  resolveProfileUpgradeCommercialBinding,
  resolveProfileUpgradeCommercialState,
  safeProfileUpgradeCommercialAuditIdentifier,
  summarizeProfileUpgradeRefunds,
  validatePaidProfileUpgradeCharge,
  validatePaidProfileUpgradeCheckout,
  type ProfileUpgradeChargeFacts,
  type ProfileUpgradeCheckoutFacts,
  type ProfileUpgradeCommercialBindingDecision,
} from "@/lib/payments/stripe-profile-upgrade-domain";
import { STRIPE_PROFILE_UPGRADE_METADATA_KIND } from "@/lib/payments/stripe-profile-upgrade-policy";

const STRIPE_WEBHOOK_ACTOR = "stripe-webhook";

export type ProfileUpgradeRequestPreparation =
  | { kind: "created" | "existing"; request: ProducerProfileUpgradeRequest }
  | { kind: "already_active" }
  | { kind: "not_owner" }
  | { kind: "provider_conflict" }
  | { kind: "owned_by_another_account"; request: ProducerProfileUpgradeRequest };

function isStripeProfileUpgradeRequest(
  request: Pick<ProducerProfileUpgradeRequest, "paymentProvider">,
): boolean {
  return paymentRequestUsesProvider(request, STRIPE_PAYMENT_PROVIDER);
}

function assertStripeProfileUpgradeRequest(
  request: Pick<ProducerProfileUpgradeRequest, "paymentProvider">,
): void {
  if (!isStripeProfileUpgradeRequest(request)) {
    throw new Error("The profile-upgrade request belongs to another payment provider.");
  }
}

export async function prepareProducerProfileUpgradeRequest(input: {
  country: string;
  producerId: number;
  requesterUserId: string;
  providerOfferId: string;
  termsAcceptedAt: Date;
}): Promise<ProfileUpgradeRequestPreparation> {
  const termsUrl = getStripeProfileUpgradeConfiguration().termsUrl;
  if (!termsUrl) {
    throw new Error("The expanded-profile terms URL is not configured.");
  }
  const database = getDatabase();
  return database.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`producer:${input.country}:${input.producerId}`}))`,
    );

    const [[owner], [activeEntitlement], [existing]] = await Promise.all([
      transaction
        .select({ id: producerMemberships.id })
        .from(producerMemberships)
        .where(
          and(
            eq(producerMemberships.userId, input.requesterUserId),
            eq(producerMemberships.country, input.country),
            eq(producerMemberships.producerId, input.producerId),
            eq(producerMemberships.role, "owner"),
            eq(producerMemberships.status, "active"),
          ),
        )
        .for("update")
        .limit(1),
      transaction
        .select({ id: entitlements.id })
        .from(entitlements)
        .where(
          activeProducerPremiumEntitlementCondition(
            input.country,
            input.producerId,
          ),
        )
        .for("update")
        .limit(1),
      transaction
        .select()
        .from(producerProfileUpgradeRequests)
        .where(
          and(
            eq(producerProfileUpgradeRequests.country, input.country),
            eq(producerProfileUpgradeRequests.producerId, input.producerId),
            inArray(producerProfileUpgradeRequests.status, [
              ...PRODUCER_PROFILE_UPGRADE_OPEN_STATUSES,
            ]),
          ),
        )
        .for("update")
        .limit(1),
    ]);

    if (!owner) return { kind: "not_owner" };
    if (activeEntitlement) return { kind: "already_active" };
    if (existing) {
      if (!isStripeProfileUpgradeRequest(existing)) {
        return { kind: "provider_conflict" };
      }
      const unattachedRequestFromFormerOwner =
        existing.status === "pending" &&
        existing.providerCheckoutId === null &&
        existing.requesterUserId !== input.requesterUserId;

      if (unattachedRequestFromFormerOwner) {
        await transaction
          .update(producerProfileUpgradeRequests)
          .set({ status: "expired", failureCode: null, updatedAt: new Date() })
          .where(eq(producerProfileUpgradeRequests.id, existing.id));
        await transaction.insert(auditEvents).values({
          actorKind: "user",
          actorUserId: input.requesterUserId,
          action: "producer_profile_upgrade.stale_request_expired",
          targetType: "producer_profile_upgrade_request",
          targetId: existing.id,
          metadata: {
            checkoutExpired: false,
            requesterChanged: existing.requesterUserId !== input.requesterUserId,
          },
        });
      } else if (existing.requesterUserId !== input.requesterUserId) {
        return { kind: "owned_by_another_account", request: existing };
      } else if (
        existing.status === "pending" &&
        existing.providerCheckoutId === null
      ) {
        if (
          profileUpgradeOfferMatchesRequest(existing, {
            providerOfferId: input.providerOfferId,
            termsVersion: PRODUCER_PROFILE_UPGRADE_TERMS_VERSION,
            termsUrl,
          })
        ) {
          return { kind: "existing", request: existing };
        }
        await transaction
          .update(producerProfileUpgradeRequests)
          .set({ status: "expired", failureCode: null, updatedAt: new Date() })
          .where(eq(producerProfileUpgradeRequests.id, existing.id));
        await transaction.insert(auditEvents).values({
          actorKind: "user",
          actorUserId: input.requesterUserId,
          action: "producer_profile_upgrade.offer_superseded",
          targetType: "producer_profile_upgrade_request",
          targetId: existing.id,
          metadata: {
            previousOfferId: existing.providerOfferId,
            previousTermsUrl: existing.termsUrl,
            previousTermsVersion: existing.termsVersion,
            replacementOfferId: input.providerOfferId,
            replacementTermsUrl: termsUrl,
            replacementTermsVersion: PRODUCER_PROFILE_UPGRADE_TERMS_VERSION,
          },
        });
      } else {
        return { kind: "existing", request: existing };
      }
    }

    const [created] = await transaction
      .insert(producerProfileUpgradeRequests)
      .values({
        requesterUserId: input.requesterUserId,
        country: input.country,
        producerId: input.producerId,
        status: "pending",
        amountMinor: PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR,
        currency: PRODUCER_PROFILE_UPGRADE_CURRENCY,
        termsVersion: PRODUCER_PROFILE_UPGRADE_TERMS_VERSION,
        termsUrl,
        termsAcceptedAt: input.termsAcceptedAt,
        paymentProvider: STRIPE_PAYMENT_PROVIDER,
        providerOfferId: input.providerOfferId,
      })
      .returning();
    if (!created) throw new Error("The profile-upgrade request could not be created.");

    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: input.requesterUserId,
      action: "producer_profile_upgrade.requested",
      targetType: "producer_profile_upgrade_request",
      targetId: created.id,
      metadata: {
        country: input.country,
        producerId: input.producerId,
        amountMinor: PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR,
        currency: PRODUCER_PROFILE_UPGRADE_CURRENCY,
        termsVersion: PRODUCER_PROFILE_UPGRADE_TERMS_VERSION,
        termsUrl,
      },
    });
    return { kind: "created", request: created };
  });
}

export async function attachProducerProfileUpgradeCheckout(
  requestId: string,
  session: Pick<Stripe.Checkout.Session, "customer" | "expires_at" | "id">,
): Promise<"attached" | "owner_changed"> {
  const database = getDatabase();
  const outcome = await database.transaction(async (transaction) => {
    const [candidate] = await transaction
      .select()
      .from(producerProfileUpgradeRequests)
      .where(eq(producerProfileUpgradeRequests.id, requestId))
      .limit(1);
    if (!candidate) throw new Error("The profile-upgrade request no longer exists.");
    assertStripeProfileUpgradeRequest(candidate);

    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`producer:${candidate.country}:${candidate.producerId}`}))`,
    );
    const [request] = await transaction
      .select()
      .from(producerProfileUpgradeRequests)
      .where(eq(producerProfileUpgradeRequests.id, requestId))
      .for("update")
      .limit(1);
    if (!request || request.status !== "pending") {
      throw new Error("The profile-upgrade request can no longer start Checkout.");
    }
    assertStripeProfileUpgradeRequest(request);
    if (
      request.providerCheckoutId &&
      request.providerCheckoutId !== session.id
    ) {
      throw new Error("The profile-upgrade request is bound to another Checkout Session.");
    }

    const [currentOwner] = await transaction
      .select({ id: producerMemberships.id })
      .from(producerMemberships)
      .where(
        and(
          eq(producerMemberships.userId, request.requesterUserId),
          eq(producerMemberships.country, request.country),
          eq(producerMemberships.producerId, request.producerId),
          eq(producerMemberships.role, "owner"),
          eq(producerMemberships.status, "active"),
        ),
      )
      .for("update")
      .limit(1);
    if (!currentOwner) {
      await transaction
        .update(producerProfileUpgradeRequests)
        .set({ status: "expired", failureCode: null, updatedAt: new Date() })
        .where(eq(producerProfileUpgradeRequests.id, request.id));
      await transaction.insert(auditEvents).values({
        actorKind: "service",
        actorKey: STRIPE_WEBHOOK_ACTOR,
        action: "producer_profile_upgrade.checkout_authorization_changed",
        targetType: "producer_profile_upgrade_request",
        targetId: request.id,
        metadata: { checkoutSessionId: session.id },
      });
      return "owner_changed" as const;
    }

    const firstAttachment = !request.providerCheckoutId;
    await transaction
      .update(producerProfileUpgradeRequests)
      .set({
        providerCheckoutId: session.id,
        providerCustomerId: paymentObjectId(session.customer),
        checkoutExpiresAt: new Date(session.expires_at * 1_000),
        updatedAt: new Date(),
      })
      .where(eq(producerProfileUpgradeRequests.id, request.id));

    if (firstAttachment) {
      await transaction.insert(auditEvents).values({
        actorKind: "user",
        actorUserId: request.requesterUserId,
        action: "producer_profile_upgrade.checkout_created",
        targetType: "producer_profile_upgrade_request",
        targetId: request.id,
        metadata: { checkoutSessionId: session.id },
      });
    }
    return "attached" as const;
  });
  if (outcome === "owner_changed") {
    try {
      await getStripeClient().checkout.sessions.expire(session.id);
    } catch (error) {
      await database.insert(auditEvents).values({
        actorKind: "service",
        actorKey: STRIPE_WEBHOOK_ACTOR,
        action: "producer_profile_upgrade.checkout_expiration_failed",
        targetType: "producer_profile_upgrade_request",
        targetId: requestId,
        metadata: {
          checkoutSessionId: session.id,
          error: error instanceof Error ? error.name : "Error",
        },
      });
      throw new Error("The unauthorized Checkout Session could not be expired.");
    }
  }
  return outcome;
}

function checkoutFacts(session: Stripe.Checkout.Session): ProfileUpgradeCheckoutFacts {
  const lineItems = session.line_items?.data ?? [];
  const lineItem = lineItems[0];
  return {
    id: session.id,
    mode: session.mode,
    paymentStatus: session.payment_status,
    currency: session.currency,
    amountTotal: session.amount_total,
    clientReferenceId: session.client_reference_id,
    metadataKind: session.metadata?.kind ?? null,
    metadataRequestId: session.metadata?.upgradeRequestId ?? null,
    paymentId: paymentObjectId(session.payment_intent),
    offerId: paymentObjectId(lineItem?.price),
    quantity: lineItem?.quantity ?? null,
    lineItemCount: lineItems.length,
  };
}

function expandedPaymentCharge(session: Stripe.Checkout.Session): Stripe.Charge | null {
  const paymentIntent = session.payment_intent;
  if (!paymentIntent || typeof paymentIntent === "string") return null;
  const charge = paymentIntent.latest_charge;
  return charge && typeof charge !== "string" ? charge : null;
}

function paymentChargeFacts(charge: Stripe.Charge | null): ProfileUpgradeChargeFacts | null {
  return charge
    ? {
        amount: charge.amount,
        amountCaptured: charge.amount_captured,
        currency: charge.currency,
        id: charge.id,
        paid: charge.paid,
        paymentId: paymentObjectId(charge.payment_intent),
        status: charge.status,
      }
    : null;
}

type StripeCommercialSnapshot = {
  charge: Stripe.Charge;
  disputeState: "clear" | "lost" | "open";
  disputes: Stripe.Dispute[];
  refundSummary: ReturnType<typeof summarizeProfileUpgradeRefunds>;
  refunds: Stripe.Refund[];
};

async function retrieveStripeCommercialSnapshot(
  chargeId: string,
): Promise<StripeCommercialSnapshot> {
  const stripe = getStripeClient();
  const listRefunds = async () => {
    const refunds: Stripe.Refund[] = [];
    for await (const refund of stripe.refunds.list({ charge: chargeId, limit: 100 })) {
      refunds.push(refund);
    }
    return refunds;
  };
  const listDisputes = async () => {
    const disputes: Stripe.Dispute[] = [];
    for await (const dispute of stripe.disputes.list({ charge: chargeId, limit: 100 })) {
      disputes.push(dispute);
    }
    return disputes;
  };
  const [charge, refunds, disputes] = await Promise.all([
    stripe.charges.retrieve(chargeId),
    listRefunds(),
    listDisputes(),
  ]);
  const refundSummary = summarizeProfileUpgradeRefunds(
    refunds.map((refund) => ({
      amount: refund.amount,
      id: refund.id,
      status: refund.status,
    })),
  );
  return {
    charge,
    disputes,
    disputeState: profileUpgradeDisputeState(
      disputes.map((dispute) => dispute.status),
    ),
    refundSummary,
    refunds,
  };
}

function representativeDispute(
  snapshot: StripeCommercialSnapshot,
): Stripe.Dispute | null {
  if (snapshot.disputeState === "lost") {
    return snapshot.disputes.find(({ status }) => status === "lost") ?? null;
  }
  if (snapshot.disputeState === "open") {
    return (
      snapshot.disputes.find(
        ({ status }) =>
          status !== "won" &&
          status !== "warning_closed" &&
          status !== "prevented",
      ) ?? null
    );
  }
  return snapshot.disputes[0] ?? null;
}

type UnmatchedCommercialBinding = Extract<
  ProfileUpgradeCommercialBindingDecision,
  { kind: "unmatched" }
>;

type ProfileUpgradeChargeBinding =
  | { kind: "foreign" }
  | {
      kind: "matched";
      paymentId: string;
      request: ProducerProfileUpgradeRequest;
    }
  | ({ kind: "unmatched"; paymentId: string } & Omit<
      UnmatchedCommercialBinding,
      "kind"
    >);

async function findUpgradeRequestForCharge(
  charge: Stripe.Charge,
): Promise<ProfileUpgradeChargeBinding> {
  const paymentId = paymentObjectId(charge.payment_intent);
  if (!paymentId) return { kind: "foreign" };

  const database = getDatabase();
  const [boundRequest] = await database
    .select()
    .from(producerProfileUpgradeRequests)
    .where(
      and(
        eq(producerProfileUpgradeRequests.paymentProvider, STRIPE_PAYMENT_PROVIDER),
        eq(producerProfileUpgradeRequests.providerPaymentId, paymentId),
      ),
    )
    .limit(1);
  if (boundRequest) {
    return { kind: "matched", paymentId, request: boundRequest };
  }

  const paymentIntent =
    typeof charge.payment_intent === "string"
      ? await getStripeClient().paymentIntents.retrieve(paymentId)
      : charge.payment_intent;
  const metadataKind = paymentIntent?.metadata?.kind ?? null;
  const metadataRequestId = paymentIntent?.metadata?.upgradeRequestId ?? null;
  const initialDecision = resolveProfileUpgradeCommercialBinding({
    paymentId,
    expectedMetadataKind: STRIPE_PROFILE_UPGRADE_METADATA_KIND,
    metadataKind,
    metadataRequestId,
    databaseBoundRequestId: null,
  });
  if (initialDecision.kind === "foreign") return initialDecision;
  if (initialDecision.kind === "unmatched") {
    return { ...initialDecision, paymentId };
  }
  if (initialDecision.kind !== "lookup_request") {
    throw new Error("Unexpected commercial binding state before request lookup.");
  }

  const [metadataRequest] = await database
    .select()
    .from(producerProfileUpgradeRequests)
    .where(
      and(
        eq(producerProfileUpgradeRequests.id, initialDecision.requestId),
        eq(producerProfileUpgradeRequests.paymentProvider, STRIPE_PAYMENT_PROVIDER),
      ),
    )
    .limit(1);
  const finalDecision = resolveProfileUpgradeCommercialBinding({
    paymentId,
    expectedMetadataKind: STRIPE_PROFILE_UPGRADE_METADATA_KIND,
    metadataKind,
    metadataRequestId,
    databaseBoundRequestId: null,
    metadataRequest: metadataRequest
      ? {
          id: metadataRequest.id,
          providerPaymentId: metadataRequest.providerPaymentId,
        }
      : null,
  });
  if (finalDecision.kind === "unmatched") {
    return { ...finalDecision, paymentId };
  }
  if (finalDecision.kind !== "matched" || !metadataRequest) {
    throw new Error("Unexpected commercial binding state after request lookup.");
  }
  return {
    kind: "matched",
    paymentId,
    request: metadataRequest,
  };
}

async function recordUnmatchedCommercialEvent(input: {
  binding: Extract<ProfileUpgradeChargeBinding, { kind: "unmatched" }>;
  chargeId: string;
  eventId: string;
  eventType: string;
}): Promise<void> {
  const eventId = safeProfileUpgradeCommercialAuditIdentifier(
    input.eventId,
    160,
  );
  const chargeId = safeProfileUpgradeCommercialAuditIdentifier(input.chargeId);
  const paymentId = safeProfileUpgradeCommercialAuditIdentifier(
    input.binding.paymentId,
  );
  const metadataRequestId = safeProfileUpgradeCommercialAuditIdentifier(
    input.binding.metadataRequestId,
  );
  const databasePaymentId = safeProfileUpgradeCommercialAuditIdentifier(
    input.binding.databasePaymentId,
  );
  await getDatabase().insert(auditEvents).values({
    actorKind: "service",
    actorKey: STRIPE_WEBHOOK_ACTOR,
    action: PRODUCER_PROFILE_UPGRADE_UNMATCHED_COMMERCIAL_ACTION,
    targetType: "stripe_event",
    targetId: eventId ?? chargeId ?? "redacted-stripe-event",
    requestId: eventId,
    metadata: {
      eventId,
      eventType: input.eventType,
      chargeId,
      paymentId,
      metadataRequestId,
      databasePaymentId,
      reason: input.binding.reason,
    },
  });
}

async function recordUnknownPaidCheckout(
  eventId: string,
  session: Stripe.Checkout.Session,
): Promise<void> {
  await getDatabase().insert(auditEvents).values({
    actorKind: "service",
    actorKey: STRIPE_WEBHOOK_ACTOR,
    action: "producer_profile_upgrade.unmatched_paid_checkout",
    targetType: "stripe_event",
    targetId: eventId,
    requestId: eventId,
    metadata: { checkoutSessionId: session.id },
  });
}

type ProfileUpgradeTransaction = Parameters<
  Parameters<Database["transaction"]>[0]
>[0];

type ProfileUpgradeCheckoutFields = {
  checkoutExpiresAt: Date;
  providerCheckoutId: string;
  providerCustomerId: string | null;
  updatedAt: Date;
};

async function applyAdverseCommercialState(input: {
  checkoutFields: ProfileUpgradeCheckoutFields;
  eventId: string;
  occurredAt: Date;
  paymentId: string;
  request: ProducerProfileUpgradeRequest;
  snapshot: StripeCommercialSnapshot;
  transaction: ProfileUpgradeTransaction;
  triggerEventType?: string;
}): Promise<"incident" | null> {
  const { request, snapshot, transaction } = input;
  const currentCharge = snapshot.charge;
  const { disputeState, refundSummary } = snapshot;
  const commercialState = resolveProfileUpgradeCommercialState({
    capturedAmountMinor: currentCharge.amount_captured,
    chargeAmountRefundedMinor: currentCharge.amount_refunded,
    disputeState,
    refundSummary,
  });
  const { amountRefundedMinor } = commercialState;
  const dispute = representativeDispute(snapshot);
  const commonFields = {
    ...input.checkoutFields,
    providerPaymentId: input.paymentId,
    providerChargeId: currentCharge.id,
    amountCapturedMinor: currentCharge.amount_captured,
    capturedCurrency: currentCharge.currency,
    paidAt: request.paidAt ?? input.occurredAt,
    providerDisputeId: dispute?.id ?? null,
    providerDisputeStatus: dispute?.status ?? null,
    disputedAt: dispute ? new Date(dispute.created * 1_000) : null,
  };

  if (refundSummary.hasFailed && input.triggerEventType?.startsWith("refund.")) {
    await transaction.insert(auditEvents).values({
      actorKind: "service",
      actorKey: STRIPE_WEBHOOK_ACTOR,
      action: "producer_profile_upgrade.refund_failed_observed",
      targetType: "producer_profile_upgrade_request",
      targetId: request.id,
      requestId: input.eventId,
      metadata: {
        failedRefundIds: snapshot.refunds
          .filter(({ status }) => status === "failed" || status === "canceled")
          .map(({ id }) => id),
      },
    });
  }
  if (commercialState.kind === "refunded") {
    await revokeUpgradeEntitlement(
      transaction,
      request,
      "The paid profile entitlement was revoked after a Stripe refund.",
      true,
    );
    await transaction
      .update(producerProfileUpgradeRequests)
      .set({
        ...commonFields,
        status: "refunded",
        amountRefundedMinor,
        refundedAt: request.refundedAt ?? input.occurredAt,
        failureCode: null,
      })
      .where(eq(producerProfileUpgradeRequests.id, request.id));
    await transaction.insert(auditEvents).values({
      actorKind: "service",
      actorKey: STRIPE_WEBHOOK_ACTOR,
      action: "producer_profile_upgrade.refunded",
      targetType: "producer_profile_upgrade_request",
      targetId: request.id,
      requestId: input.eventId,
      metadata: {
        amountCapturedMinor: currentCharge.amount_captured,
        amountRefundedMinor,
        disputeState,
      },
    });
    return "incident";
  }

  if (request.status === "refunded" || request.status === "dispute_lost") {
    const terminalCapturedAmount =
      request.amountCapturedMinor ?? currentCharge.amount_captured;
    await revokeUpgradeEntitlement(
      transaction,
      request,
      "The terminal payment state cannot retain the paid profile entitlement.",
      true,
    );
    await transaction
      .update(producerProfileUpgradeRequests)
      .set({
        ...commonFields,
        amountCapturedMinor: terminalCapturedAmount,
        amountRefundedMinor:
          request.status === "refunded"
            ? terminalCapturedAmount
            : amountRefundedMinor,
        refundedAt:
          request.status === "refunded" || amountRefundedMinor > 0
            ? request.refundedAt ?? input.occurredAt
            : null,
        failureCode: null,
      })
      .where(eq(producerProfileUpgradeRequests.id, request.id));
    await transaction.insert(auditEvents).values({
      actorKind: "service",
      actorKey: STRIPE_WEBHOOK_ACTOR,
      action: `producer_profile_upgrade.${request.status}_reconciled`,
      targetType: "producer_profile_upgrade_request",
      targetId: request.id,
      requestId: input.eventId,
      metadata: {
        commercialState: commercialState.kind,
        succeededAmountMinor: refundSummary.succeededAmountMinor,
      },
    });
    return "incident";
  }

  if (!requiresProfileUpgradeCommercialTransition(commercialState)) return null;

  if (commercialState.kind === "refund_aggregate_mismatch") {
    await revokeUpgradeEntitlement(
      transaction,
      request,
      "The paid profile entitlement was suspended while Stripe refund totals are reconciled.",
      false,
    );
    await transaction
      .update(producerProfileUpgradeRequests)
      .set({
        ...commonFields,
        status: "paid_unfulfilled",
        amountRefundedMinor,
        refundedAt:
          amountRefundedMinor > 0
            ? request.refundedAt ?? input.occurredAt
            : null,
        failureCode: "refund_aggregate_mismatch",
      })
      .where(eq(producerProfileUpgradeRequests.id, request.id));
    await transaction.insert(auditEvents).values({
      actorKind: "service",
      actorKey: STRIPE_WEBHOOK_ACTOR,
      action: "producer_profile_upgrade.paid_unfulfilled",
      targetType: "producer_profile_upgrade_request",
      targetId: request.id,
      requestId: input.eventId,
      metadata: {
        chargeAmountRefundedMinor: currentCharge.amount_refunded,
        code: "refund_aggregate_mismatch",
        succeededAmountMinor: refundSummary.succeededAmountMinor,
      },
    });
    return "incident";
  }

  if (
    commercialState.kind === "disputed" ||
    commercialState.kind === "dispute_lost"
  ) {
    await revokeUpgradeEntitlement(
      transaction,
      request,
      "The paid profile entitlement was revoked after a Stripe dispute.",
      true,
    );
    await transaction
      .update(producerProfileUpgradeRequests)
      .set({
        ...commonFields,
        status: commercialState.kind,
        amountRefundedMinor,
        refundedAt:
          amountRefundedMinor > 0
            ? request.refundedAt ?? input.occurredAt
            : null,
        failureCode: null,
      })
      .where(eq(producerProfileUpgradeRequests.id, request.id));
    await transaction.insert(auditEvents).values({
      actorKind: "service",
      actorKey: STRIPE_WEBHOOK_ACTOR,
      action: `producer_profile_upgrade.${commercialState.kind}`,
      targetType: "producer_profile_upgrade_request",
      targetId: request.id,
      requestId: input.eventId,
      metadata: {
        disputeCount: snapshot.disputes.length,
        disputeId: dispute?.id ?? null,
        disputeStatus: dispute?.status ?? null,
      },
    });
    return "incident";
  }

  if (commercialState.kind === "partially_refunded") {
    await revokeUpgradeEntitlement(
      transaction,
      request,
      "The paid profile entitlement was revoked after a Stripe refund.",
      true,
    );
    await transaction
      .update(producerProfileUpgradeRequests)
      .set({
        ...commonFields,
        status: "partially_refunded",
        amountRefundedMinor,
        refundedAt: request.refundedAt ?? input.occurredAt,
        failureCode: null,
      })
      .where(eq(producerProfileUpgradeRequests.id, request.id));
    await transaction.insert(auditEvents).values({
      actorKind: "service",
      actorKey: STRIPE_WEBHOOK_ACTOR,
      action: "producer_profile_upgrade.partially_refunded",
      targetType: "producer_profile_upgrade_request",
      targetId: request.id,
      requestId: input.eventId,
      metadata: { amountRefundedMinor },
    });
    return "incident";
  }

  await revokeUpgradeEntitlement(
    transaction,
    request,
    "The paid profile entitlement was suspended while a Stripe refund is pending.",
    false,
  );
  await transaction
    .update(producerProfileUpgradeRequests)
    .set({
      ...commonFields,
      status: "paid_unfulfilled",
      amountRefundedMinor: 0,
      refundedAt: null,
      failureCode: "refund_pending",
    })
    .where(eq(producerProfileUpgradeRequests.id, request.id));
  await transaction.insert(auditEvents).values({
    actorKind: "service",
    actorKey: STRIPE_WEBHOOK_ACTOR,
    action: "producer_profile_upgrade.refund_pending",
    targetType: "producer_profile_upgrade_request",
    targetId: request.id,
    requestId: input.eventId,
    metadata: { refundCount: snapshot.refunds.length },
  });
  return "incident";
}

export async function fulfillProducerProfileUpgradeCheckout(input: {
  eventId: string;
  occurredAt: Date;
  sessionId: string;
  triggerEventType?: string;
}): Promise<"fulfilled" | "ignored" | "incident" | "duplicate"> {
  const session = await getStripeClient().checkout.sessions.retrieve(input.sessionId, {
    expand: ["line_items", "payment_intent.latest_charge"],
  });
  const requestId = session.metadata?.upgradeRequestId?.trim();
  if (
    session.metadata?.kind !== STRIPE_PROFILE_UPGRADE_METADATA_KIND ||
    !requestId
  ) {
    if (session.payment_status === "paid") {
      await recordUnknownPaidCheckout(input.eventId, session);
      return "incident";
    }
    return "ignored";
  }

  const database = getDatabase();
  const [candidate] = await database
    .select()
    .from(producerProfileUpgradeRequests)
    .where(eq(producerProfileUpgradeRequests.id, requestId))
    .limit(1);
  if (!candidate) {
    if (session.payment_status === "paid") {
      await recordUnknownPaidCheckout(input.eventId, session);
      return "incident";
    }
    return "ignored";
  }
  if (!isStripeProfileUpgradeRequest(candidate)) {
    if (session.payment_status === "paid") {
      await recordUnknownPaidCheckout(input.eventId, session);
    }
    return "ignored";
  }

  const sessionCharge = expandedPaymentCharge(session);

  return database.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`producer:${candidate.country}:${candidate.producerId}`}))`,
    );
    const [request] = await transaction
      .select()
      .from(producerProfileUpgradeRequests)
      .where(eq(producerProfileUpgradeRequests.id, requestId))
      .for("update")
      .limit(1);
    if (!request) return "ignored";
    assertStripeProfileUpgradeRequest(request);
    if (
      request.providerCheckoutId &&
      request.providerCheckoutId !== session.id
    ) {
      await transaction.insert(auditEvents).values({
        actorKind: "service",
        actorKey: STRIPE_WEBHOOK_ACTOR,
        action: "producer_profile_upgrade.checkout_binding_mismatch",
        targetType: "producer_profile_upgrade_request",
        targetId: request.id,
        requestId: input.eventId,
        metadata: { checkoutSessionId: session.id },
      });
      return "incident";
    }
    // Fetch after the producer lock: an older webhook can never commit an older
    // commercial snapshot after a newer reconciliation for the same producer.
    const commercialSnapshot = sessionCharge
      ? await retrieveStripeCommercialSnapshot(sessionCharge.id)
      : null;

    const facts = checkoutFacts(session);
    const validation = validatePaidProfileUpgradeCheckout(
      facts,
      request,
      STRIPE_PROFILE_UPGRADE_METADATA_KIND,
    );
    const checkoutFields = {
      providerCheckoutId: session.id,
      providerCustomerId: paymentObjectId(session.customer),
      checkoutExpiresAt: new Date(session.expires_at * 1_000),
      updatedAt: new Date(),
    };
    if (!validation.ok && validation.code === "unpaid") {
      if (request.status === "pending") {
        await transaction
          .update(producerProfileUpgradeRequests)
          .set(checkoutFields)
          .where(eq(producerProfileUpgradeRequests.id, request.id));
      }
      return "ignored";
    }
    const currentCharge = commercialSnapshot?.charge ?? null;
    const currentChargePaymentIntentId = paymentObjectId(
      currentCharge?.payment_intent,
    );
    const commercialBindingIsSafe = Boolean(
      commercialSnapshot &&
        currentChargePaymentIntentId &&
        facts.paymentId === currentChargePaymentIntentId &&
        (!request.providerPaymentId ||
          request.providerPaymentId === currentChargePaymentIntentId),
    );
    if (
      commercialSnapshot &&
      currentChargePaymentIntentId &&
      commercialBindingIsSafe
    ) {
      const commercialResult = await applyAdverseCommercialState({
        checkoutFields,
        eventId: input.eventId,
        occurredAt: input.occurredAt,
        paymentId: currentChargePaymentIntentId,
        request,
        snapshot: commercialSnapshot,
        transaction,
        triggerEventType: input.triggerEventType,
      });
      if (commercialResult) return commercialResult;
    }
    if (!validation.ok) {
      const charge = commercialSnapshot?.charge ?? sessionCharge;
      if (request.status === "paid") {
        await revokeUpgradeEntitlement(
          transaction,
          request,
          "The paid profile entitlement was suspended after immutable Checkout validation failed.",
          false,
        );
      }
      if (
        [
          "pending",
          "payment_failed",
          "expired",
          "paid",
          "paid_unfulfilled",
          "disputed",
        ].includes(request.status)
      ) {
        await transaction
          .update(producerProfileUpgradeRequests)
          .set({
            ...checkoutFields,
            status: "paid_unfulfilled",
            providerPaymentId:
              facts.paymentId ?? request.providerPaymentId,
            providerChargeId: charge?.id ?? request.providerChargeId,
            amountCapturedMinor:
              charge?.amount_captured ?? request.amountCapturedMinor,
            capturedCurrency: charge?.currency ?? request.capturedCurrency,
            paidAt: request.paidAt ?? input.occurredAt,
            failureCode: validation.code,
          })
          .where(eq(producerProfileUpgradeRequests.id, request.id));
      }
      await transaction.insert(auditEvents).values({
        actorKind: "service",
        actorKey: STRIPE_WEBHOOK_ACTOR,
        action: "producer_profile_upgrade.paid_unfulfilled",
        targetType: "producer_profile_upgrade_request",
        targetId: request.id,
        requestId: input.eventId,
        metadata: { code: validation.code, checkoutSessionId: session.id },
      });
      return "incident";
    }

    if (
      request.providerPaymentId &&
      request.providerPaymentId !== validation.paymentId
    ) {
      if (request.status === "paid") {
        await revokeUpgradeEntitlement(
          transaction,
          request,
          "The paid profile entitlement was suspended after PaymentIntent binding validation failed.",
          false,
        );
      }
      await transaction
        .update(producerProfileUpgradeRequests)
        .set({
          ...checkoutFields,
          status: "paid_unfulfilled",
          paidAt: request.paidAt ?? input.occurredAt,
          failureCode: "payment_binding_mismatch",
        })
        .where(eq(producerProfileUpgradeRequests.id, request.id));
      return "incident";
    }

    if (
      request.status === "paid_unfulfilled" &&
      !canRetryPaidUnfulfilledProfileUpgrade(request.failureCode)
    ) {
      return "incident";
    }

    const charge = commercialSnapshot?.charge ?? sessionCharge;
    const chargeValidation = validatePaidProfileUpgradeCharge(
      paymentChargeFacts(charge),
      validation.paymentId,
    );
    if (!chargeValidation.ok) {
      if (
        request.status === "disputed" ||
        request.status === "dispute_lost" ||
        request.status === "refunded"
      ) {
        return "duplicate";
      }
      if (request.status === "paid") {
        await revokeUpgradeEntitlement(
          transaction,
          request,
          "The paid profile entitlement was suspended after Stripe payment reconciliation failed.",
          false,
        );
      }
      await transaction
        .update(producerProfileUpgradeRequests)
        .set({
          ...checkoutFields,
          status: "paid_unfulfilled",
          providerPaymentId: validation.paymentId,
          providerChargeId: charge?.id ?? request.providerChargeId,
          amountCapturedMinor:
            charge?.amount_captured ?? request.amountCapturedMinor,
          capturedCurrency: charge?.currency ?? request.capturedCurrency,
          paidAt: request.paidAt ?? input.occurredAt,
          failureCode: chargeValidation.code,
        })
        .where(eq(producerProfileUpgradeRequests.id, request.id));
      await transaction.insert(auditEvents).values({
        actorKind: "service",
        actorKey: STRIPE_WEBHOOK_ACTOR,
        action: "producer_profile_upgrade.paid_unfulfilled",
        targetType: "producer_profile_upgrade_request",
        targetId: request.id,
        requestId: input.eventId,
        metadata: { code: chargeValidation.code, checkoutSessionId: session.id },
      });
      return "incident";
    }

    if (!commercialSnapshot) {
      throw new Error("The current Stripe commercial state could not be loaded.");
    }
    const verifiedCurrentCharge = commercialSnapshot.charge;
    const resolvedDispute = representativeDispute(commercialSnapshot);
    const stripeStateFields = {
      providerDisputeId: resolvedDispute?.id ?? null,
      providerDisputeStatus: resolvedDispute?.status ?? null,
      disputedAt: resolvedDispute
        ? new Date(resolvedDispute.created * 1_000)
        : null,
    };

    const [conflictingOpenRequest] = await transaction
      .select({ id: producerProfileUpgradeRequests.id })
      .from(producerProfileUpgradeRequests)
      .where(
        and(
          eq(producerProfileUpgradeRequests.country, request.country),
          eq(producerProfileUpgradeRequests.producerId, request.producerId),
          ne(producerProfileUpgradeRequests.id, request.id),
          inArray(producerProfileUpgradeRequests.status, [
            ...PRODUCER_PROFILE_UPGRADE_OPEN_STATUSES,
          ]),
        ),
      )
      .for("update")
      .limit(1);
    if (conflictingOpenRequest) {
      await transaction.insert(auditEvents).values({
        actorKind: "service",
        actorKey: STRIPE_WEBHOOK_ACTOR,
        action: "producer_profile_upgrade.unmatched_paid_checkout",
        targetType: "producer_profile_upgrade_request",
        targetId: request.id,
        requestId: input.eventId,
        metadata: {
          checkoutSessionId: session.id,
          conflictingRequestId: conflictingOpenRequest.id,
          reason: "newer_open_request",
        },
      });
      return "incident";
    }

    const [activeEntitlement] = await transaction
      .select()
      .from(entitlements)
      .where(
        activeProducerPremiumEntitlementCondition(
          request.country,
          request.producerId,
        ),
      )
      .for("update")
      .limit(1);

    let entitlementId: string;
    if (activeEntitlement) {
      if (
        activeEntitlement.source !==
          PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE ||
        activeEntitlement.sourceReference !== request.id ||
        (request.entitlementId !== null &&
          activeEntitlement.id !== request.entitlementId)
      ) {
        if (
          activeEntitlement.source ===
            PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE &&
          activeEntitlement.sourceReference === request.id
        ) {
          await transaction
            .update(entitlements)
            .set({
              status: "revoked",
              revokedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(entitlements.id, activeEntitlement.id));
        }
        await transaction
          .update(producerProfileUpgradeRequests)
          .set({
            ...checkoutFields,
            status: "paid_unfulfilled",
            providerPaymentId: validation.paymentId,
            providerChargeId: chargeValidation.chargeId,
            amountCapturedMinor: verifiedCurrentCharge.amount_captured,
            capturedCurrency: verifiedCurrentCharge.currency,
            paidAt: request.paidAt ?? input.occurredAt,
            failureCode: "entitlement_conflict",
          })
          .where(eq(producerProfileUpgradeRequests.id, request.id));
        await transaction.insert(auditEvents).values({
          actorKind: "service",
          actorKey: STRIPE_WEBHOOK_ACTOR,
          action: "producer_profile_upgrade.paid_unfulfilled",
          targetType: "producer_profile_upgrade_request",
          targetId: request.id,
          requestId: input.eventId,
          metadata: { code: "entitlement_conflict" },
        });
        return "incident";
      }
      if (
        request.status === "paid" &&
        request.providerPaymentId === validation.paymentId &&
        request.entitlementId === activeEntitlement.id
      ) {
        return "duplicate";
      }
      entitlementId = activeEntitlement.id;
    } else if (request.entitlementId) {
      const [restoredEntitlement] = await transaction
        .update(entitlements)
        .set({
          status: "active",
          revokedAt: null,
          expiresAt: null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(entitlements.id, request.entitlementId),
            eq(entitlements.subjectKind, "producer"),
            eq(entitlements.producerCountry, request.country),
            eq(entitlements.producerId, request.producerId),
            eq(entitlements.key, PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY),
            eq(
              entitlements.source,
              PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE,
            ),
            eq(entitlements.sourceReference, request.id),
          ),
        )
        .returning({ id: entitlements.id });
      if (!restoredEntitlement) {
        await transaction
          .update(producerProfileUpgradeRequests)
          .set({
            ...checkoutFields,
            status: "paid_unfulfilled",
            providerPaymentId: validation.paymentId,
            providerChargeId: chargeValidation.chargeId,
            amountCapturedMinor: verifiedCurrentCharge.amount_captured,
            capturedCurrency: verifiedCurrentCharge.currency,
            paidAt: request.paidAt ?? input.occurredAt,
            failureCode: "entitlement_binding_mismatch",
          })
          .where(eq(producerProfileUpgradeRequests.id, request.id));
        return "incident";
      }
      entitlementId = restoredEntitlement.id;
    } else {
      const [createdEntitlement] = await transaction
        .insert(entitlements)
        .values({
          subjectKind: "producer",
          producerCountry: request.country,
          producerId: request.producerId,
          key: PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
          status: "active",
          source: PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE,
          sourceReference: request.id,
          metadata: {
            paymentProvider: STRIPE_PAYMENT_PROVIDER,
            providerCheckoutId: session.id,
            providerPaymentId: validation.paymentId,
            termsVersion: request.termsVersion,
            termsUrl: request.termsUrl,
          },
          startsAt: input.occurredAt,
          expiresAt: null,
        })
        .returning({ id: entitlements.id });
      if (!createdEntitlement) throw new Error("The premium entitlement was not created.");
      entitlementId = createdEntitlement.id;
    }

    await transaction
      .update(producerProfileUpgradeRequests)
      .set({
        ...checkoutFields,
        ...stripeStateFields,
        status: "paid",
        providerPaymentId: validation.paymentId,
        providerChargeId: chargeValidation.chargeId,
        amountCapturedMinor: verifiedCurrentCharge.amount_captured,
        capturedCurrency: verifiedCurrentCharge.currency,
        paidAt: request.paidAt ?? input.occurredAt,
        amountRefundedMinor: 0,
        refundedAt: null,
        entitlementId,
        failureCode: null,
      })
      .where(eq(producerProfileUpgradeRequests.id, request.id));
    await transaction.insert(auditEvents).values({
      actorKind: "service",
      actorKey: STRIPE_WEBHOOK_ACTOR,
      action: "producer_profile_upgrade.paid",
      targetType: "producer_profile_upgrade_request",
      targetId: request.id,
      requestId: input.eventId,
      metadata: {
        country: request.country,
        producerId: request.producerId,
        entitlementId,
      },
    });
    return "fulfilled";
  });
}

export async function closeProducerProfileUpgradeCheckout(input: {
  eventId: string;
  failure: "async_payment_failed" | null;
  session: Stripe.Checkout.Session;
  status: "expired" | "payment_failed";
}): Promise<void> {
  if (input.session.metadata?.kind !== STRIPE_PROFILE_UPGRADE_METADATA_KIND) return;
  const requestId = input.session.metadata.upgradeRequestId?.trim();
  if (!requestId) return;

  const database = getDatabase();
  const [candidate] = await database
    .select()
    .from(producerProfileUpgradeRequests)
    .where(eq(producerProfileUpgradeRequests.id, requestId))
    .limit(1);
  if (!candidate) return;
  if (!isStripeProfileUpgradeRequest(candidate)) return;

  await database.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`producer:${candidate.country}:${candidate.producerId}`}))`,
    );
    const [request] = await transaction
      .select()
      .from(producerProfileUpgradeRequests)
      .where(eq(producerProfileUpgradeRequests.id, requestId))
      .for("update")
      .limit(1);
    if (!request || request.status !== "pending") return;
    assertStripeProfileUpgradeRequest(request);
    if (
      request.providerCheckoutId &&
      request.providerCheckoutId !== input.session.id
    ) {
      return;
    }

    await transaction
      .update(producerProfileUpgradeRequests)
      .set({
        status: input.status,
        providerCheckoutId: input.session.id,
        providerCustomerId: paymentObjectId(input.session.customer),
        checkoutExpiresAt: new Date(input.session.expires_at * 1_000),
        failureCode: input.failure,
        updatedAt: new Date(),
      })
      .where(eq(producerProfileUpgradeRequests.id, request.id));
    await transaction.insert(auditEvents).values({
      actorKind: "service",
      actorKey: STRIPE_WEBHOOK_ACTOR,
      action: `producer_profile_upgrade.${input.status}`,
      targetType: "producer_profile_upgrade_request",
      targetId: request.id,
      requestId: input.eventId,
      metadata: {},
    });
  });
}

async function revokeUpgradeEntitlement(
  transaction: Parameters<Parameters<Database["transaction"]>[0]>[0],
  request: ProducerProfileUpgradeRequest,
  reason: string,
  cancelPendingChanges = true,
): Promise<void> {
  if (request.entitlementId) {
    await transaction
      .update(entitlements)
      .set({ status: "revoked", revokedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(entitlements.id, request.entitlementId),
          eq(entitlements.subjectKind, "producer"),
          eq(entitlements.producerCountry, request.country),
          eq(entitlements.producerId, request.producerId),
          eq(entitlements.key, PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY),
          eq(
            entitlements.source,
            PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE,
          ),
          eq(entitlements.sourceReference, request.id),
          eq(entitlements.status, "active"),
        ),
      );
  }

  const [otherActiveEntitlement] = await transaction
    .select({ id: entitlements.id })
    .from(entitlements)
    .where(
      activeProducerPremiumEntitlementCondition(
        request.country,
        request.producerId,
      ),
    )
    .for("update")
    .limit(1);
  if (!otherActiveEntitlement && cancelPendingChanges) {
    await conflictUnpublishedPremiumChanges(transaction, {
      actor: { kind: "service", key: STRIPE_WEBHOOK_ACTOR },
      country: request.country,
      producerId: request.producerId,
      reason,
    });
  }
}

async function checkoutSessionIdForBinding(input: {
  paymentId: string;
  request: ProducerProfileUpgradeRequest;
}): Promise<string | null> {
  if (input.request.providerCheckoutId) {
    return input.request.providerCheckoutId;
  }
  const sessions = await getStripeClient().checkout.sessions.list({
    payment_intent: input.paymentId,
    limit: 10,
  });
  return (
    sessions.data.find(
      (session) =>
        session.metadata?.kind === STRIPE_PROFILE_UPGRADE_METADATA_KIND &&
        session.metadata?.upgradeRequestId === input.request.id,
    )?.id ?? null
  );
}

/**
 * Reconciles every refund/dispute notification from current Stripe state.
 * Event timestamps are audit data only: they never decide commercial precedence.
 */
export async function reconcileProducerProfileUpgradeCharge(input: {
  chargeId: string;
  eventId: string;
  eventType: string;
  occurredAt: Date;
}): Promise<"fulfilled" | "ignored" | "incident" | "duplicate"> {
  const charge = await getStripeClient().charges.retrieve(input.chargeId);
  const binding = await findUpgradeRequestForCharge(charge);
  if (binding.kind === "foreign") return "ignored";
  if (binding.kind === "unmatched") {
    await recordUnmatchedCommercialEvent({
      binding,
      chargeId: charge.id,
      eventId: input.eventId,
      eventType: input.eventType,
    });
    return "incident";
  }

  const sessionId = await checkoutSessionIdForBinding(binding);
  if (!sessionId) {
    await getDatabase().insert(auditEvents).values({
      actorKind: "service",
      actorKey: STRIPE_WEBHOOK_ACTOR,
      action: "producer_profile_upgrade.unmatched_paid_checkout",
      targetType: "producer_profile_upgrade_request",
      targetId: binding.request.id,
      requestId: input.eventId,
      metadata: {
        chargeId: charge.id,
        paymentId: binding.paymentId,
        reason: "checkout_session_missing",
      },
    });
    throw new Error("The paid Checkout Session could not be reconciled.");
  }

  const result = await fulfillProducerProfileUpgradeCheckout({
    eventId: `${input.eventId}:commercial-reconcile`,
    occurredAt: input.occurredAt,
    sessionId,
    triggerEventType: input.eventType,
  });
  if (result === "incident") {
    const [current] = await getDatabase()
      .select({
        failureCode: producerProfileUpgradeRequests.failureCode,
        status: producerProfileUpgradeRequests.status,
      })
      .from(producerProfileUpgradeRequests)
      .where(eq(producerProfileUpgradeRequests.id, binding.request.id))
      .limit(1);
    const expectedCommercialIncident =
      current?.status === "partially_refunded" ||
      current?.status === "refunded" ||
      current?.status === "disputed" ||
      current?.status === "dispute_lost" ||
      (current?.status === "paid_unfulfilled" &&
        (current.failureCode === "refund_pending" ||
          current.failureCode === "refund_aggregate_mismatch" ||
          !canRetryPaidUnfulfilledProfileUpgrade(current.failureCode)));
    if (!expectedCommercialIncident) {
      throw new Error("The paid profile entitlement still requires reconciliation.");
    }
  }
  return result;
}

export type OwnerProfileUpgradeReconciliation =
  | { kind: "not_owner" }
  | { kind: "missing" }
  | { kind: "unsupported_provider" }
  | { kind: "unattached" }
  | { kind: "open"; expiresAt: Date }
  | { kind: "processing" }
  | { kind: "expired" }
  | { kind: "reconciled"; result: "fulfilled" | "ignored" | "incident" | "duplicate" };

export type OwnerProfileUpgradeReconciliationInput =
  | { ownerUserId: string; requestId: string }
  | { ownerUserId: string; country: string; producerId: number };

/**
 * Lets the current owner safely refresh a Session attached by a former owner.
 * It never changes requester ownership and never creates a second payment.
 */
export async function reconcileProducerProfileUpgradeCheckoutForOwner(
  input: OwnerProfileUpgradeReconciliationInput,
): Promise<OwnerProfileUpgradeReconciliation> {
  const database = getDatabase();
  const [request] = await database
    .select()
    .from(producerProfileUpgradeRequests)
    .where(
      "requestId" in input
        ? eq(producerProfileUpgradeRequests.id, input.requestId)
        : and(
            eq(producerProfileUpgradeRequests.country, input.country),
            eq(producerProfileUpgradeRequests.producerId, input.producerId),
            inArray(producerProfileUpgradeRequests.status, [
              ...PRODUCER_PROFILE_UPGRADE_OPEN_STATUSES,
            ]),
          ),
    )
    .orderBy(sql`${producerProfileUpgradeRequests.createdAt} DESC`)
    .limit(1);
  if (!request) return { kind: "missing" };
  if (!isStripeProfileUpgradeRequest(request)) {
    return { kind: "unsupported_provider" };
  }

  const [owner] = await database
    .select({ id: producerMemberships.id })
    .from(producerMemberships)
    .where(
      and(
        eq(producerMemberships.userId, input.ownerUserId),
        eq(producerMemberships.country, request.country),
        eq(producerMemberships.producerId, request.producerId),
        eq(producerMemberships.role, "owner"),
        eq(producerMemberships.status, "active"),
      ),
    )
    .limit(1);
  if (!owner) return { kind: "not_owner" };
  if (!request.providerCheckoutId) return { kind: "unattached" };

  const session = await getStripeClient().checkout.sessions.retrieve(
    request.providerCheckoutId,
  );
  const syntheticEventId = `owner-reconcile:${request.id}:${session.id}:${session.status}`;
  if (session.status === "expired") {
    await closeProducerProfileUpgradeCheckout({
      eventId: syntheticEventId,
      failure: null,
      session,
      status: "expired",
    });
    return { kind: "expired" };
  }
  if (session.status === "open") {
    return { kind: "open", expiresAt: new Date(session.expires_at * 1_000) };
  }
  if (session.payment_status !== "paid") return { kind: "processing" };

  return {
    kind: "reconciled",
    result: await fulfillProducerProfileUpgradeCheckout({
      eventId: syntheticEventId,
      occurredAt: new Date(),
      sessionId: session.id,
    }),
  };
}
