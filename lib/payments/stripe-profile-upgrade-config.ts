import { getAccountAuthConfiguration } from "@/lib/accounts/config";

const STRIPE_PROFILE_UPGRADE_ENVIRONMENT_KEYS = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PROFILE_UPGRADE_PRICE_ID",
] as const;

type StripeProfileUpgradeEnvironmentKey =
  (typeof STRIPE_PROFILE_UPGRADE_ENVIRONMENT_KEYS)[number];

const PROFILE_UPGRADE_OFFER_ENVIRONMENT_KEYS = [
  "CHISAN_PROFILE_UPGRADE_TERMS_URL",
  "CHISAN_BILLING_SUPPORT_EMAIL",
] as const;

type ProfileUpgradeOfferEnvironmentKey =
  (typeof PROFILE_UPGRADE_OFFER_ENVIRONMENT_KEYS)[number];

type StripeProfileUpgradeEnvironment = Record<string, string | undefined>;

const STRIPE_PROFILE_UPGRADE_ENVIRONMENT_VALIDATORS: Record<
  StripeProfileUpgradeEnvironmentKey,
  (value: string) => boolean
> = {
  STRIPE_SECRET_KEY: (value) => /^sk_(test|live)_[A-Za-z0-9_]+$/.test(value),
  STRIPE_WEBHOOK_SECRET: (value) => /^whsec_[A-Za-z0-9_]+$/.test(value),
  STRIPE_PROFILE_UPGRADE_PRICE_ID: (value) => /^price_[A-Za-z0-9]+$/.test(value),
};

export function isStripeSecretCompatibleWithDeployment(
  secretKey: string,
  vercelEnvironment: string | undefined,
): boolean {
  const deployment = vercelEnvironment?.trim();
  if (deployment === "production") return secretKey.startsWith("sk_live_");
  return secretKey.startsWith("sk_test_");
}

export type StripeProfileUpgradeConfiguration = {
  checkoutEnabled: boolean;
  databaseConfigured: boolean;
  stripeConfigured: boolean;
  offerConfigured: boolean;
  missingKeys: StripeProfileUpgradeEnvironmentKey[];
  invalidKeys: StripeProfileUpgradeEnvironmentKey[];
  missingOfferKeys: ProfileUpgradeOfferEnvironmentKey[];
  invalidOfferKeys: ProfileUpgradeOfferEnvironmentKey[];
  supportEmail: string | null;
  termsUrl: string | null;
  checkoutReady: boolean;
  webhookReady: boolean;
};

function isStripeProfileUpgradeCheckoutEnabled(
  environment: StripeProfileUpgradeEnvironment,
): boolean {
  return environment.CHISAN_PROFILE_UPGRADE_CHECKOUT_ENABLED?.trim() === "true";
}

function validProfileUpgradeTermsUrl(value: string): boolean {
  if (value.length > 2_048) return false;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) {
    return true;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

function validSupportEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getStripeProfileUpgradeConfiguration(
  environment: StripeProfileUpgradeEnvironment = process.env,
): StripeProfileUpgradeConfiguration {
  const checkoutEnabled = isStripeProfileUpgradeCheckoutEnabled(environment);
  const databaseConfigured = Boolean(environment.DATABASE_URL?.trim());
  const missingKeys = STRIPE_PROFILE_UPGRADE_ENVIRONMENT_KEYS.filter(
    (key) => !environment[key]?.trim(),
  );
  const invalidKeys = STRIPE_PROFILE_UPGRADE_ENVIRONMENT_KEYS.filter((key) => {
    const value = environment[key]?.trim();
    return Boolean(
      value &&
        (!STRIPE_PROFILE_UPGRADE_ENVIRONMENT_VALIDATORS[key](value) ||
          (key === "STRIPE_SECRET_KEY" &&
            !isStripeSecretCompatibleWithDeployment(value, environment.VERCEL_ENV))),
    );
  });
  const stripeConfigured = missingKeys.length === 0 && invalidKeys.length === 0;
  const webhookKeys = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"] as const;
  const webhookConfigured = webhookKeys.every((key) => {
    const value = environment[key]?.trim();
    return Boolean(
      value &&
        STRIPE_PROFILE_UPGRADE_ENVIRONMENT_VALIDATORS[key](value) &&
        (key !== "STRIPE_SECRET_KEY" ||
          isStripeSecretCompatibleWithDeployment(value, environment.VERCEL_ENV)),
    );
  });
  const offerValues = {
    CHISAN_PROFILE_UPGRADE_TERMS_URL:
      environment.CHISAN_PROFILE_UPGRADE_TERMS_URL?.trim() ?? "",
    CHISAN_BILLING_SUPPORT_EMAIL:
      environment.CHISAN_BILLING_SUPPORT_EMAIL?.trim().toLowerCase() ?? "",
  };
  const missingOfferKeys = PROFILE_UPGRADE_OFFER_ENVIRONMENT_KEYS.filter(
    (key) => !offerValues[key],
  );
  const invalidOfferKeys = PROFILE_UPGRADE_OFFER_ENVIRONMENT_KEYS.filter((key) => {
    const value = offerValues[key];
    if (!value) return false;
    return key === "CHISAN_PROFILE_UPGRADE_TERMS_URL"
      ? !validProfileUpgradeTermsUrl(value)
      : !validSupportEmail(value);
  });
  const offerConfigured =
    missingOfferKeys.length === 0 && invalidOfferKeys.length === 0;

  return {
    checkoutEnabled,
    databaseConfigured,
    stripeConfigured,
    offerConfigured,
    missingKeys,
    invalidKeys,
    missingOfferKeys,
    invalidOfferKeys,
    supportEmail: validSupportEmail(offerValues.CHISAN_BILLING_SUPPORT_EMAIL)
      ? offerValues.CHISAN_BILLING_SUPPORT_EMAIL
      : null,
    termsUrl: validProfileUpgradeTermsUrl(
      offerValues.CHISAN_PROFILE_UPGRADE_TERMS_URL,
    )
      ? offerValues.CHISAN_PROFILE_UPGRADE_TERMS_URL
      : null,
    checkoutReady:
      checkoutEnabled &&
      databaseConfigured &&
      getAccountAuthConfiguration(environment).configured &&
      stripeConfigured &&
      offerConfigured,
    // Turning off new sales must never disable fulfillment or revocation.
    webhookReady: databaseConfigured && webhookConfigured,
  };
}
