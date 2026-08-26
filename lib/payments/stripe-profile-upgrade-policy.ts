export const STRIPE_PROFILE_UPGRADE_METADATA_KIND =
  "chisan_producer_profile_upgrade";

export const STRIPE_PROFILE_UPGRADE_WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
  "charge.refunded",
  "charge.dispute.created",
  "charge.dispute.updated",
  "charge.dispute.closed",
  "refund.created",
  "refund.updated",
  "refund.failed",
] as const;

export type StripeProfileUpgradeWebhookEvent =
  (typeof STRIPE_PROFILE_UPGRADE_WEBHOOK_EVENTS)[number];

export function isStripeProfileUpgradeWebhookEvent(
  value: string,
): value is StripeProfileUpgradeWebhookEvent {
  return STRIPE_PROFILE_UPGRADE_WEBHOOK_EVENTS.includes(
    value as StripeProfileUpgradeWebhookEvent,
  );
}
