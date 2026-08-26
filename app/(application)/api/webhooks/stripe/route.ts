import { createHash } from "node:crypto";

import type Stripe from "stripe";

import {
  closeProducerProfileUpgradeCheckout,
  fulfillProducerProfileUpgradeCheckout,
  reconcileProducerProfileUpgradeCharge,
} from "@/lib/payments/stripe-profile-upgrades";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/payments/stripe";
import { stripeObjectModeMatchesSecret } from "@/lib/payments/stripe-price-policy";
import { getStripeProfileUpgradeConfiguration } from "@/lib/payments/stripe-profile-upgrade-config";
import { paymentObjectId } from "@/lib/payments/stripe-profile-upgrade-domain";
import { isStripeProfileUpgradeWebhookEvent } from "@/lib/payments/stripe-profile-upgrade-policy";
import {
  claimWebhookReceipt,
  completeWebhookReceipt,
  failWebhookReceipt,
} from "@/lib/webhooks/receipt-workflow";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function safeErrorMessage(error: unknown): string {
  const errorName =
    error instanceof Error && /^[A-Za-z][A-Za-z0-9]*$/.test(error.name)
      ? error.name
      : "Error";
  return `Stripe webhook processing failed (${errorName}).`;
}

function eventSubject(event: Stripe.Event): string | null {
  const value = (event.data.object as { id?: unknown }).id;
  return typeof value === "string" && value.length <= 255 ? value : null;
}

async function chargeIdForRefund(refund: Stripe.Refund): Promise<string | null> {
  const directChargeId = paymentObjectId(refund.charge);
  if (directChargeId) return directChargeId;

  const paymentIntentId = paymentObjectId(refund.payment_intent);
  if (!paymentIntentId) return null;
  const paymentIntent = await getStripeClient().paymentIntents.retrieve(
    paymentIntentId,
    { expand: ["latest_charge"] },
  );
  return paymentObjectId(paymentIntent.latest_charge);
}

async function processStripeEvent(event: Stripe.Event): Promise<void> {
  if (!isStripeProfileUpgradeWebhookEvent(event.type)) return;
  const occurredAt = new Date(event.created * 1_000);

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillProducerProfileUpgradeCheckout({
        eventId: event.id,
        occurredAt,
        sessionId: session.id,
      });
      return;
    }
    case "checkout.session.async_payment_failed": {
      await closeProducerProfileUpgradeCheckout({
        eventId: event.id,
        failure: "async_payment_failed",
        session: event.data.object as Stripe.Checkout.Session,
        status: "payment_failed",
      });
      return;
    }
    case "checkout.session.expired": {
      await closeProducerProfileUpgradeCheckout({
        eventId: event.id,
        failure: null,
        session: event.data.object as Stripe.Checkout.Session,
        status: "expired",
      });
      return;
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      await reconcileProducerProfileUpgradeCharge({
        chargeId: charge.id,
        eventId: event.id,
        eventType: event.type,
        occurredAt,
      });
      return;
    }
    case "charge.dispute.created":
    case "charge.dispute.updated":
    case "charge.dispute.closed": {
      const dispute = event.data.object as Stripe.Dispute;
      const chargeId = paymentObjectId(dispute.charge);
      if (chargeId) {
        await reconcileProducerProfileUpgradeCharge({
          chargeId,
          eventId: event.id,
          eventType: event.type,
          occurredAt,
        });
      }
      return;
    }
    case "refund.created":
    case "refund.updated":
    case "refund.failed": {
      const refund = event.data.object as Stripe.Refund;
      const chargeId = await chargeIdForRefund(refund);
      if (chargeId) {
        await reconcileProducerProfileUpgradeCharge({
          chargeId,
          eventId: event.id,
          eventType: event.type,
          occurredAt,
        });
      }
      return;
    }
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!getStripeProfileUpgradeConfiguration().webhookReady) {
    return new Response("Stripe webhook integration is not configured.", { status: 503 });
  }
  const signature = request.headers.get("stripe-signature")?.trim();
  if (!signature) return new Response("Missing Stripe signature.", { status: 400 });

  const rawBody = await request.text();
  const payloadHash = createHash("sha256").update(rawBody).digest("hex");
  let event: Stripe.Event;
  try {
    event = getStripeClient().webhooks.constructEvent(
      rawBody,
      signature,
      getStripeWebhookSecret(),
    );
  } catch {
    return new Response("Stripe signature verification failed.", { status: 400 });
  }
  if (!event.id || event.id.length > 255) {
    return new Response("Invalid Stripe event ID.", { status: 400 });
  }
  if (
    !stripeObjectModeMatchesSecret(
      event.livemode,
      process.env.STRIPE_SECRET_KEY?.trim() ?? "",
    )
  ) {
    return new Response("Stripe event mode does not match the configured account.", {
      status: 400,
    });
  }

  const claim = await claimWebhookReceipt({
    provider: "stripe",
    eventId: event.id,
    eventType: event.type,
    subject: eventSubject(event),
    eventOccurredAt: new Date(event.created * 1_000),
    payloadHash,
  });
  if (claim.kind === "conflict") {
    return new Response("Stripe event ID does not match its original payload.", {
      status: 409,
    });
  }
  if (claim.kind === "processed") {
    return Response.json({ received: true, duplicate: true });
  }
  if (claim.kind === "processing") {
    return new Response("Stripe webhook processing is still in progress.", {
      status: 503,
    });
  }
  if (claim.kind === "retry") {
    return new Response("Stripe webhook receipt is available for retry.", { status: 503 });
  }

  try {
    await processStripeEvent(event);
    const completed = await completeWebhookReceipt(
      claim.receiptId,
      claim.processingToken,
    );
    return completed
      ? Response.json({ received: true })
      : new Response("Stripe webhook processing lease was superseded.", {
          status: 503,
        });
  } catch (error) {
    console.error("Stripe webhook processing failed.", {
      eventId: event.id,
      eventType: event.type,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    await failWebhookReceipt(
      claim.receiptId,
      claim.processingToken,
      safeErrorMessage(error),
    );
    return new Response("Stripe webhook processing failed and may be retried.", {
      status: 500,
    });
  }
}
