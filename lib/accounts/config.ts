import { SITE_ORIGIN } from "@/lib/site";

export const ACCOUNT_ROUTES = {
  signIn: "/acceso",
  signUp: "/registro",
  dashboard: "/cuenta",
  onboarding: "/cuenta/bienvenida",
  afterAuthentication: "/cuenta/bienvenida",
} as const;

const ACCOUNT_AUTH_ENVIRONMENT_KEYS = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
] as const;

type AccountAuthEnvironmentKey = (typeof ACCOUNT_AUTH_ENVIRONMENT_KEYS)[number];
type AccountAuthEnvironment = Record<string, string | undefined>;

function preferredEnvironmentValue(
  environment: AccountAuthEnvironment,
  canonicalKey: string,
  legacyKey: string,
): string {
  const canonicalValue = environment[canonicalKey];
  if (canonicalValue !== undefined) return canonicalValue.trim();
  return environment[legacyKey]?.trim() ?? "";
}

const CLERK_SECRET_KEY_PATTERN = /^sk_(test|live)_[A-Za-z0-9_-]{20,}$/;
const CLERK_PUBLISHABLE_KEY_PATTERN = /^pk_(test|live)_([A-Za-z0-9+/]+={0,2})$/;

function isValidClerkPublishableKey(value: string): boolean {
  const match = CLERK_PUBLISHABLE_KEY_PATTERN.exec(value);
  if (!match) return false;

  try {
    const encoded = match[2];
    const decoded = atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, "="));
    const frontendApi = decoded.slice(0, -1);

    return (
      decoded.endsWith("$") &&
      frontendApi.includes(".") &&
      !frontendApi.includes("$") &&
      !/\s/.test(frontendApi)
    );
  } catch {
    return false;
  }
}

function isValidClerkSecretKey(value: string): boolean {
  return CLERK_SECRET_KEY_PATTERN.test(value);
}

const ACCOUNT_AUTH_ENVIRONMENT_VALIDATORS: Record<
  AccountAuthEnvironmentKey,
  (value: string) => boolean
> = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: isValidClerkPublishableKey,
  CLERK_SECRET_KEY: isValidClerkSecretKey,
};

export type AccountAuthConfiguration = {
  featureEnabled: boolean;
  configured: boolean;
  missingKeys: AccountAuthEnvironmentKey[];
  invalidKeys: AccountAuthEnvironmentKey[];
};

export function isAccountFeatureEnabled(
  environment: AccountAuthEnvironment = process.env,
): boolean {
  return (
    preferredEnvironmentValue(
      environment,
      "CHISAN_ACCOUNTS_ENABLED",
      "KM0_ACCOUNTS_ENABLED",
    ) === "true"
  );
}

// This operational switch freezes only new producer profile proposals while
// staff drain the existing queue for a catalog schema migration. Missing keeps
// the established behavior enabled; any configured value other than the exact
// string "true" fails closed.
export function isProducerChangeSubmissionEnabled(
  environment: AccountAuthEnvironment = process.env,
): boolean {
  const configured = environment.CHISAN_PRODUCER_CHANGES_ENABLED;
  return configured === undefined ? true : configured.trim() === "true";
}

export function getAccountAuthConfiguration(
  environment: AccountAuthEnvironment = process.env,
): AccountAuthConfiguration {
  const featureEnabled = isAccountFeatureEnabled(environment);
  const missingKeys = ACCOUNT_AUTH_ENVIRONMENT_KEYS.filter(
    (key) => !environment[key]?.trim(),
  );
  const invalidKeys = ACCOUNT_AUTH_ENVIRONMENT_KEYS.filter((key) => {
    const value = environment[key];
    if (!value?.trim()) return false;
    return !ACCOUNT_AUTH_ENVIRONMENT_VALIDATORS[key](value);
  });

  return {
    featureEnabled,
    configured: featureEnabled && missingKeys.length === 0 && invalidKeys.length === 0,
    missingKeys,
    invalidKeys,
  };
}

export function isAccountAuthConfigured(
  environment: AccountAuthEnvironment = process.env,
): boolean {
  return getAccountAuthConfiguration(environment).configured;
}

export type AccountSystemConfiguration = AccountAuthConfiguration & {
  databaseConfigured: boolean;
  ready: boolean;
};

export function getAccountSystemConfiguration(
  environment: AccountAuthEnvironment = process.env,
): AccountSystemConfiguration {
  const auth = getAccountAuthConfiguration(environment);
  const databaseConfigured = Boolean(environment.DATABASE_URL?.trim());

  return {
    ...auth,
    databaseConfigured,
    ready: auth.configured && databaseConfigured,
  };
}

export function isAccountSystemConfigured(
  environment: AccountAuthEnvironment = process.env,
): boolean {
  return getAccountSystemConfiguration(environment).ready;
}

export function getBootstrapAdminEmails(
  environment: AccountAuthEnvironment = process.env,
): ReadonlySet<string> {
  return new Set(
    preferredEnvironmentValue(environment, "CHISAN_ADMIN_EMAILS", "KM0_ADMIN_EMAILS")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function getAppUrl(
  environment: AccountAuthEnvironment = process.env,
): string {
  const configured = environment.NEXT_PUBLIC_APP_URL?.trim();
  if (!configured) return SITE_ORIGIN;

  try {
    const url = new URL(configured);
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : SITE_ORIGIN;
  } catch {
    return SITE_ORIGIN;
  }
}
