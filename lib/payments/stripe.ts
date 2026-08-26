import "server-only";

import Stripe from "stripe";

import {
  getStripeProfileUpgradeConfiguration,
  isStripeSecretCompatibleWithDeployment,
} from "@/lib/payments/stripe-profile-upgrade-config";
import {
  profileUpgradeStripePriceProblem,
  type ProfileUpgradeStripePrice,
} from "@/lib/payments/stripe-price-policy";

type StripeState = {
  secretKey: string;
  client: Stripe;
};

const globalForStripe = globalThis as typeof globalThis & {
  __chisanStripeState?: StripeState;
};

export class StripePaymentConfigurationError extends Error {
  constructor(message = "Stripe payments are not configured.") {
    super(message);
    this.name = "StripePaymentConfigurationError";
  }
}

export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey || !/^sk_(test|live)_[A-Za-z0-9_]+$/.test(secretKey)) {
    throw new StripePaymentConfigurationError();
  }
  if (!isStripeSecretCompatibleWithDeployment(secretKey, process.env.VERCEL_ENV)) {
    throw new StripePaymentConfigurationError(
      "The Stripe key mode does not match this deployment environment.",
    );
  }

  const current = globalForStripe.__chisanStripeState;
  if (current?.secretKey === secretKey) return current.client;

  const state = {
    secretKey,
    client: new Stripe(secretKey, {
      maxNetworkRetries: 2,
      timeout: 10_000,
    }),
  };
  globalForStripe.__chisanStripeState = state;
  return state.client;
}

export function validateProfileUpgradeStripePrice(
  price: ProfileUpgradeStripePrice,
  secretKey = process.env.STRIPE_SECRET_KEY?.trim() ?? "",
): void {
  const problem = profileUpgradeStripePriceProblem(price, secretKey);
  if (problem === "secret_key") {
    throw new StripePaymentConfigurationError("The Stripe secret key is invalid.");
  }
  if (problem) {
    throw new StripePaymentConfigurationError(
      "The configured Stripe Price does not match the profile-upgrade offer.",
    );
  }
}

export async function getValidatedProfileUpgradeStripePrice(): Promise<Stripe.Price> {
  const priceId = process.env.STRIPE_PROFILE_UPGRADE_PRICE_ID?.trim();
  if (!priceId) throw new StripePaymentConfigurationError();

  const price = await getStripeClient().prices.retrieve(priceId);
  validateProfileUpgradeStripePrice(price);
  return price;
}

export function getStripeWebhookSecret(): string {
  const configuration = getStripeProfileUpgradeConfiguration();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!configuration.webhookReady || !webhookSecret) {
    throw new StripePaymentConfigurationError();
  }
  return webhookSecret;
}

/** Intended for isolated tests, not ordinary request handling. */
export function resetStripeClientForTests(): void {
  globalForStripe.__chisanStripeState = undefined;
}
