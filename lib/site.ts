export const SITE_NAME = "Chisan";
export const SITE_ORIGIN = "https://chisan.app";
export const SITE_TAGLINE = "Connecting local food.";
export const SITE_DESCRIPTION =
  `${SITE_TAGLINE} Chisan connects people with place-based food and drink producers through one trusted, open catalog.`;
export const SITE_REPOSITORY_URL = "https://github.com/Lyzanor/chisan";
export const SITE_CONTACT_URL = `${SITE_REPOSITORY_URL}/issues`;

export function isPublicDiscoveryEnabled(): boolean {
  return (
    process.env.VERCEL_ENV === "production" &&
    process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED === "true"
  );
}
