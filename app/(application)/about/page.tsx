import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";

import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import { getAboutCopy } from "@/lib/i18n/public-pages";
import {
  buildPublicPageStructuredData,
  serializeStructuredData,
} from "@/lib/site-structured-data";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";

import styles from "../public-information.module.css";

const canonicalUrl = new URL("/about", SITE_ORIGIN).toString();
const loadCopy = cache(async () => {
  const presentation = await loadApplicationPresentation();
  return getAboutCopy(presentation.locale);
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

export default async function AboutPage() {
  const copy = await loadCopy();
  const structuredData = buildPublicPageStructuredData({
    type: "AboutPage",
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
      <article aria-labelledby="about-title">
        <header className={styles.hero}>
          <p className="catalog-kicker">{SITE_NAME}</p>
          <h1 id="about-title">{copy.title}</h1>
          <div className={styles.heroStatement}>
            <p>{copy.heroLead}</p>
            {copy.heroParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </header>

        <section className={styles.section} aria-labelledby="about-founder-title">
          <div className={styles.sectionHeader}>
            <p className="catalog-kicker">{copy.founderKicker}</p>
            <h2 id="about-founder-title">{copy.founderTitle}</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionLead}>{copy.founderLead}</p>
            <div className={styles.prose}>
              {copy.founderParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="about-travel-title">
          <div className={styles.sectionHeader}>
            <p className="catalog-kicker">{copy.travelKicker}</p>
            <h2 id="about-travel-title">{copy.travelTitle}</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionLead}>{copy.travelLead}</p>
            <div className={styles.prose}>
              {copy.travelParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="about-technology-title">
          <div className={styles.sectionHeader}>
            <p className="catalog-kicker">{copy.technologyKicker}</p>
            <h2 id="about-technology-title">{copy.technologyTitle}</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionLead}>{copy.technologyLead}</p>
            <div className={styles.prose}>
              {copy.technologyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="about-principles-title">
          <div className={styles.sectionHeader}>
            <p className="catalog-kicker">{copy.principlesKicker}</p>
            <h2 id="about-principles-title">{copy.principlesTitle}</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionLead}>{copy.principlesLead}</p>
            <ul className={styles.principles}>
              {copy.principles.map((principle) => (
                <li className={styles.principle} key={principle.title}>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="about-future-title">
          <div className={styles.sectionHeader}>
            <p className="catalog-kicker">{copy.futureKicker}</p>
            <h2 id="about-future-title">{copy.futureTitle}</h2>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.prose}>
              {copy.futureParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className={styles.actions}>
              <Link href="/" className={styles.primaryAction}>
                {copy.exploreCatalog}
              </Link>
              <Link href="/how-we-work" className={styles.secondaryAction}>
                {copy.howWeWorkLink}
              </Link>
              <Link href="/contact" className={styles.secondaryAction}>
                {copy.contactLink}
              </Link>
              <a
                href={copy.linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.secondaryAction}
              >
                {copy.linkedInLabel}
              </a>
            </div>
          </div>
        </section>

        <p className={styles.closing}>{copy.closing}</p>
      </article>
    </main>
  );
}
