const ADSENSE_ACCOUNT_PATTERN = /^ca-pub-(\d{16})$/;
const ADSENSE_SLOT_PATTERN = /^\d{6,20}$/;

const GOOGLE_ADSENSE_SELLER_ID = "f08c47fec0942fa0";

export const PROGRAMMATIC_AREA_AD_MIN_PRODUCERS = 10;

type AdsEnvironment = Readonly<Record<string, string | undefined>>;

export type ProgrammaticAdsConfig = Readonly<{
  accountId: string;
  areaSlotId: string;
}>;

function environmentValue(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function getAdSenseAccountId(
  environment: AdsEnvironment = process.env,
): string | null {
  const accountId = environmentValue(environment.CHISAN_ADSENSE_ACCOUNT_ID);
  if (!accountId) return null;

  if (!ADSENSE_ACCOUNT_PATTERN.test(accountId)) {
    throw new Error(
      "CHISAN_ADSENSE_ACCOUNT_ID must use the public ca-pub- followed by 16 digits.",
    );
  }

  return accountId;
}

export function buildAdSenseAdsTxt(
  environment: AdsEnvironment = process.env,
): string | null {
  const accountId = getAdSenseAccountId(environment);
  if (!accountId) return null;

  const publisherId = accountId.replace(/^ca-/, "");
  return `google.com, ${publisherId}, DIRECT, ${GOOGLE_ADSENSE_SELLER_ID}\n`;
}

export function getProgrammaticAdsConfig(
  environment: AdsEnvironment = process.env,
): ProgrammaticAdsConfig | null {
  const enabled =
    environment.VERCEL_ENV === "production" &&
    environment.CHISAN_PUBLIC_DISCOVERY_ENABLED === "true" &&
    environment.CHISAN_ADSENSE_CMP_READY === "true" &&
    environment.CHISAN_PROGRAMMATIC_ADS_ENABLED === "true";
  if (!enabled) return null;

  const accountId = getAdSenseAccountId(environment);
  const areaSlotId = environmentValue(environment.CHISAN_ADSENSE_AREA_SLOT_ID);

  if (!accountId) {
    throw new Error(
      "CHISAN_ADSENSE_ACCOUNT_ID is required when programmatic ads are enabled.",
    );
  }
  if (!ADSENSE_SLOT_PATTERN.test(areaSlotId)) {
    throw new Error(
      "CHISAN_ADSENSE_AREA_SLOT_ID must be the numeric slot id supplied by AdSense.",
    );
  }

  return { accountId, areaSlotId };
}
