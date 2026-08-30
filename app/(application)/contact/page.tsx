import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";

import { ACCOUNT_ROUTES } from "@/lib/accounts/config";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import { getContactCopy } from "@/lib/i18n/public-pages";
import {
  buildPublicPageStructuredData,
  serializeStructuredData,
} from "@/lib/site-structured-data";
import {
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_URL,
  SITE_INSTAGRAM_URL,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_X_URL,
} from "@/lib/site";

import styles from "../public-information.module.css";

const canonicalUrl = new URL("/contact", SITE_ORIGIN).toString();
const loadCopy = cache(async () => {
  const presentation = await loadApplicationPresentation();
  return getContactCopy(presentation.locale);
});

export async function generateMetadata(): Promise<Metadata> {
  const copy = await loadCopy();

  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${copy.title} | ${SITE_NAME}`,
      description: copy.description,
      url: canonicalUrl,
      type: "website",
      locale: copy.locale === "es" ? "es_ES" : "en_US",
    },
  };
}

export default async function ContactPage() {
  const copy = await loadCopy();
  const structuredData = buildPublicPageStructuredData({
    type: "ContactPage",
    url: canonicalUrl,
    name: copy.title,
    description: copy.description,
    locale: copy.locale,
  });

  return (
    <main className={styles.page} lang={copy.locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(structuredData),
        }}
      />
      <article aria-labelledby="contact-title">
        <header className={`${styles.hero} ${styles.contactHero}`}>
          <p className="catalog-kicker">{SITE_NAME}</p>
          <h1 id="contact-title">{copy.title}</h1>
          <p className={styles.contactIntro}>{copy.introduction}</p>
        </header>

        <section className={styles.section} aria-labelledby="contact-channels-title">
          <div className={styles.sectionHeader}>
            <p className="catalog-kicker">{SITE_NAME}</p>
            <h2 id="contact-channels-title">{copy.channelsTitle}</h2>
          </div>
          <div className={styles.sectionBody}>
            <ul className={styles.channels}>
              <li className={styles.channel}>
                <div>
                  <h3>{copy.emailTitle}</h3>
                  <p>{copy.emailDescription}</p>
                  <p>
                    <a href={SITE_CONTACT_URL}>{SITE_CONTACT_EMAIL}</a>
                  </p>
                </div>
              </li>
              <li className={styles.channel}>
                <div>
                  <h3>{copy.catalogTitle}</h3>
                  <p>{copy.catalogDescription}</p>
                </div>
              </li>
              <li className={styles.channel}>
                <div>
                  <h3>{copy.producerTitle}</h3>
                  <p>{copy.producerDescription}</p>
                  <p>
                    <Link href={ACCOUNT_ROUTES.dashboard}>{copy.accountLink}</Link>
                  </p>
                </div>
              </li>
              <li className={styles.channel}>
                <div>
                  <h3>{copy.socialTitle}</h3>
                  <p>{copy.socialDescription}</p>
                  <p>
                    <a href={SITE_INSTAGRAM_URL} rel="me">
                      Instagram
                    </a>
                    {" · "}
                    <a href={SITE_X_URL} rel="me">
                      X
                    </a>
                  </p>
                </div>
              </li>
              <li className={styles.channel}>
                <div>
                  <h3>{copy.privacyTitle}</h3>
                  <p>{copy.privacyDescription}</p>
                  <p>
                    <Link href="/privacy">{copy.privacyLink}</Link>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
}
