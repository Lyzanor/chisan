import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";

import { ACCOUNT_ROUTES } from "@/lib/accounts/config";
import {
  loadCatalogSourceFigures,
  type CatalogSourceFigures,
} from "@/lib/catalog/source-figures";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import {
  getHowChisanWorksCopy,
  HOW_CHISAN_WORKS_SOURCES,
} from "@/lib/i18n/public-pages";
import {
  buildPublicPageStructuredData,
  serializeStructuredData,
} from "@/lib/site-structured-data";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";

import styles from "../public-information.module.css";

const canonicalUrl = new URL("/how-we-work", SITE_ORIGIN).toString();
const loadCopy = cache(async () => {
  const presentation = await loadApplicationPresentation();
  return getHowChisanWorksCopy(presentation.locale);
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

export default async function HowChisanWorksPage() {
  const copy = await loadCopy();
  const figures = await loadCatalogSourceFigures(
    HOW_CHISAN_WORKS_SOURCES.country,
  );
  const figureEntries = Object.entries(figures) as [
    keyof CatalogSourceFigures,
    number,
  ][];
  const numberFormat = new Intl.NumberFormat(
    copy.locale === "es" ? "es-ES" : "en-US",
  );
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
      <article aria-labelledby="how-chisan-works-title">
        <header className={styles.hero}>
          <p className="chisan-eyebrow">{SITE_NAME}</p>
          <h1 className="chisan-enter" id="how-chisan-works-title">{copy.title}</h1>
          <div className={`chisan-enter chisan-enter--2 ${styles.heroStatement}`}>
            <p>{copy.purposeLead}</p>
            <p>
              {copy.purposeOriginBefore}
              <em>chisan-chisho</em>
              {copy.purposeOriginAfter}
            </p>
            <p>{copy.purposeBelief}</p>
          </div>
        </header>

        <section className={styles.section} data-reveal aria-labelledby="catalog-process-title">
          <div className={styles.sectionHeader}>
            <p className="chisan-eyebrow">{copy.processKicker}</p>
            <h2 id="catalog-process-title">{copy.processTitle}</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionLead}>{copy.processIntroduction}</p>
            <ol className={styles.steps}>
              {copy.steps.map((step, index) => (
                <li className={styles.step} key={step.title}>
                  <span className={styles.stepNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.section} data-reveal aria-labelledby="catalog-sources-title">
          <div className={styles.sectionHeader}>
            <p className="chisan-eyebrow">{copy.sourcesKicker}</p>
            <h2 id="catalog-sources-title">{copy.sourcesTitle}</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionLead}>{copy.sourcesIntroduction}</p>
            <ul className={styles.figures} aria-describedby="catalog-figures-note">
              {figureEntries.map(([figure, value]) => (
                <li className={styles.figure} key={figure}>
                  <strong>{numberFormat.format(value)}</strong>
                  <span>{copy.sourceFigures[figure]}</span>
                </li>
              ))}
            </ul>
            <p className={styles.figuresNote} id="catalog-figures-note">
              {copy.sourceFiguresNote}
            </p>
            <ul className={styles.principles}>
              {copy.sourceGroups.map((group) => (
                <li className={styles.principle} key={group.title}>
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.description}</p>
                    {group.sources ? (
                      <ul className={styles.sourceLinks}>
                        {HOW_CHISAN_WORKS_SOURCES.groups[group.sources].map(
                          (source) => (
                            <li key={source.url}>
                              <a href={source.url} target="_blank" rel="noreferrer">
                                {source.name}
                                <span className="visually-hidden">
                                  {" "}
                                  {copy.opensInNewTab}
                                </span>
                              </a>
                            </li>
                          ),
                        )}
                      </ul>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section} data-reveal aria-labelledby="catalog-eligibility-title">
          <div className={styles.sectionHeader}>
            <p className="chisan-eyebrow">{copy.eligibilityKicker}</p>
            <h2 id="catalog-eligibility-title">{copy.eligibilityTitle}</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionLead}>{copy.eligibilityIntroduction}</p>
            <ul className={styles.principles}>
              {copy.eligibilityCriteria.map((criterion) => (
                <li className={styles.principle} key={criterion.title}>
                  <div>
                    <h3>{criterion.title}</h3>
                    <p>{criterion.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section} data-reveal aria-labelledby="catalog-boundaries-title">
          <div className={styles.sectionHeader}>
            <p className="chisan-eyebrow">{copy.boundariesKicker}</p>
            <h2 id="catalog-boundaries-title">{copy.boundariesTitle}</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionLead}>{copy.boundariesIntroduction}</p>
            <ul className={styles.principles}>
              {copy.boundaries.map((boundary) => (
                <li className={styles.principle} key={boundary.title}>
                  <div>
                    <h3>{boundary.title}</h3>
                    <p>{boundary.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section} data-reveal aria-labelledby="catalog-lifecycle-title">
          <div className={styles.sectionHeader}>
            <p className="chisan-eyebrow">{copy.lifecycleKicker}</p>
            <h2 id="catalog-lifecycle-title">{copy.lifecycleTitle}</h2>
          </div>
          <div className={`${styles.sectionBody} ${styles.prose}`}>
            {copy.lifecycleParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className={styles.section} data-reveal aria-labelledby="catalog-trust-title">
          <div className={styles.sectionHeader}>
            <p className="chisan-eyebrow">{copy.trustKicker}</p>
            <h2 id="catalog-trust-title">{copy.trustTitle}</h2>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.sectionLead}>{copy.trustIntroduction}</p>
            <ul className={styles.principles}>
              {copy.trustPoints.map((point) => (
                <li className={styles.principle} key={point.title}>
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section} data-reveal aria-labelledby="participation-title">
          <div className={styles.sectionHeader}>
            <p className="chisan-eyebrow">{copy.participationKicker}</p>
            <h2 id="participation-title">{copy.participationTitle}</h2>
          </div>
          <div className={`${styles.sectionBody} ${styles.prose}`}>
            {copy.participationParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className={styles.actions}>
              <Link className="chisan-button" href={ACCOUNT_ROUTES.dashboard}>
                {copy.account}
              </Link>
              <Link className="chisan-button" href="/contact">
                {copy.contact}
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section} data-reveal aria-labelledby="public-access-title">
          <div className={styles.sectionHeader}>
            <p className="chisan-eyebrow">{copy.accessKicker}</p>
            <h2 id="public-access-title">{copy.accessTitle}</h2>
          </div>
          <div className={`${styles.sectionBody} ${styles.prose}`}>
            {copy.accessParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className={styles.actions}>
              <Link className="chisan-button chisan-button--primary" href="/">
                {copy.exploreCatalog}
              </Link>
            </div>
          </div>
        </section>

        <p className={styles.closing}>{copy.closing}</p>
      </article>
    </main>
  );
}
