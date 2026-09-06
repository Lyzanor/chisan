import {
  SITE_CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_INSTAGRAM_URL,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_X_URL,
} from "./site";

export const SITE_ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
export const SITE_WEBSITE_ID = `${SITE_ORIGIN}/#website`;

export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

export function buildHomeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": SITE_ORGANIZATION_ID,
        name: SITE_NAME,
        url: SITE_ORIGIN,
        description: SITE_DESCRIPTION,
        email: SITE_CONTACT_EMAIL,
        sameAs: [SITE_INSTAGRAM_URL, SITE_X_URL],
      },
      {
        "@type": "WebSite",
        "@id": SITE_WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_ORIGIN,
        description: SITE_DESCRIPTION,
        publisher: { "@id": SITE_ORGANIZATION_ID },
        inLanguage: "es",
      },
    ],
  };
}

export function buildPublicPageStructuredData({
  description,
  locale,
  name,
  type,
  url,
}: {
  description: string;
  locale: string;
  name: string;
  type: "AboutPage" | "ContactPage";
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#page`,
    url,
    name,
    description,
    inLanguage: locale,
    isPartOf: { "@id": SITE_WEBSITE_ID },
    about: { "@id": SITE_ORGANIZATION_ID },
  };
}
