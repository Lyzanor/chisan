import {
  PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR,
  PRODUCER_PROFILE_UPGRADE_CURRENCY,
} from "@/lib/accounts/producer-profile-upgrade-policy";

export type ProfileUpgradeStripePrice = {
  active: boolean;
  currency: string;
  id: string;
  livemode: boolean;
  recurring: unknown | null;
  type: string;
  unit_amount: number | null;
};

export function stripeObjectModeMatchesSecret(
  livemode: boolean,
  secretKey: string,
): boolean {
  return livemode === secretKey.startsWith("sk_live_");
}

export function profileUpgradeStripePriceProblem(
  price: ProfileUpgradeStripePrice,
  secretKey: string,
): string | null {
  const secretIsLive = secretKey.startsWith("sk_live_");
  const secretIsTest = secretKey.startsWith("sk_test_");
  if (!secretIsLive && !secretIsTest) return "secret_key";
  if (!price.active) return "inactive";
  if (price.type !== "one_time" || price.recurring !== null) return "recurring";
  if (price.currency !== PRODUCER_PROFILE_UPGRADE_CURRENCY) return "currency";
  if (price.unit_amount !== PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR) return "amount";
  if (!stripeObjectModeMatchesSecret(price.livemode, secretKey)) return "environment";
  return null;
}
