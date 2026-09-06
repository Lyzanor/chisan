export const SITE_NAME = "Chisan";
export const SITE_ORIGIN = "https://chisan.app";
export const SITE_TAGLINE = "Conectando la alimentación local.";
export const SITE_DESCRIPTION =
  `${SITE_TAGLINE} Chisan conecta a las personas con productores de alimentos y bebidas de España a través de un catálogo abierto y de confianza.`;
export const SITE_CONTACT_EMAIL = "chisanapp@gmail.com";
export const SITE_CONTACT_URL = `mailto:${SITE_CONTACT_EMAIL}`;
export const SITE_INSTAGRAM_URL = "https://www.instagram.com/chisanapp/";
export const SITE_X_URL = "https://x.com/chisanapp";

export function isPublicDiscoveryEnabled(): boolean {
  return (
    process.env.VERCEL_ENV === "production" &&
    process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED === "true"
  );
}
