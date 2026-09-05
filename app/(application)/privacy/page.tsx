import type { Metadata } from "next";
import Link from "next/link";

import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";

import styles from "./privacy.module.css";

const title = "Privacy and advertising";
const description =
  "How Chisan handles privacy, cookies, account data and temporary programmatic advertising.";
const canonicalUrl = new URL("/privacy", SITE_ORIGIN).toString();

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: canonicalUrl,
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <article className={styles.article} aria-labelledby="privacy-title">
        <p className="catalog-kicker">{SITE_NAME}</p>
        <h1 id="privacy-title">Privacy and advertising</h1>
        <p className={styles.updated}>Last updated: 6 September 2026</p>

        <p>
          This notice explains the information Chisan and its service providers
          process when you browse the catalog, choose a language, use an account,
          or view a page that is eligible for advertising.
        </p>

        <h2>Catalog browsing</h2>
        <p>
          You can browse the public producer catalog without creating an account.
          Chisan does not send your device location to its servers. If you ask the
          browser to use your location, it is resolved on your device only to
          suggest a catalog area.
        </p>
        <p>
          The optional <code>chisan_locale</code> cookie stores an explicit
          language choice. Essential infrastructure may also process IP address,
          request, device and security information in ordinary server logs to
          deliver and protect the website.
        </p>

        <h2>Privacy-friendly site measurement</h2>
        <p>
          Chisan uses Vercel Web Analytics on public pages to understand aggregate
          visits and improve the catalog. This measurement does not use analytics
          cookies. Chisan removes query parameters before sending a page view and
          does not load Analytics on sign-in, registration, account,
          administration or API routes. Read more in Vercel&apos;s {" "}
          <a href="https://vercel.com/docs/analytics/privacy-policy">
            Web Analytics privacy documentation
          </a>
          .
        </p>

        <p>
          Chisan also records aggregate daily visits to public producer profiles
          in its own database. A repeat opening counts as another visit; this
          measurement does not identify unique people or store IP addresses,
          browser identifiers, referrers or account IDs. It adds no cookies or
          browser storage. A random identifier for each page opening prevents
          duplicate delivery; receipts older than yesterday are removed on the
          next collection or statistics read. Daily totals are retained for the
          producer’s history. Only the verified producer owner with active premium
          access can consult these figures. Signed-in producer team visits,
          recognized automated traffic and preloads are excluded. The collector
          honors Do Not Track and Global Privacy Control.
        </p>

        <h2>Accounts and contributions</h2>
        <p>
          When account features are enabled, Clerk handles authentication. Chisan
          stores the account profile, favorites, ownership workflows and submitted
          catalog proposals needed to provide those features and keep an audit
          trail. If you create a public producer map, the profile also stores the
          catalog area and municipality you choose and shows that location as the
          basis for grouping shared favorites. The public CSV catalog remains
          separate from account data.
        </p>

        <h2>Programmatic advertising</h2>
        <p>
          Chisan may temporarily use Google AdSense on selected public area pages.
          There are no programmatic ads on the home page, producer profiles,
          account or administration pages, error pages, or this notice. Advertising
          never determines whether a producer is included, verified, ranked or
          described in the catalog.
        </p>
        <p>
          If advertising is active, Google and its approved advertising partners
          may use cookies, IP address, device identifiers and similar technologies
          to deliver, measure and protect ads. Where required, Chisan asks for your
          choices through Google&apos;s certified consent platform before those uses.
          Without consent, Google may show only limited ads or no ad.
        </p>
        <ul>
          <li>
            Read how Google uses information from sites that use its services in
            Google&apos;s {" "}
            <a href="https://policies.google.com/technologies/partner-sites">
              partner-sites notice
            </a>
            .
          </li>
          <li>
            Review or change Google advertising personalization in {" "}
            <a href="https://adssettings.google.com/">Google Ad Settings</a>.
          </li>
          <li>
            Reopen the privacy choices supplied with Google&apos;s consent message on
            any Chisan page where advertising is enabled.
          </li>
        </ul>

        <h2>Your choices and requests</h2>
        <p>
          You can remove the language cookie in your browser, decline optional
          advertising purposes, or ask about access, correction or deletion of
          account information where applicable. Use the{" "}
          <Link href="/contact">Chisan contact page</Link> to choose the appropriate
          channel, and do not send sensitive personal information through social
          media.
        </p>

        <h2>Changes</h2>
        <p>
          Chisan will update this notice when its providers or data uses materially
          change. The date above identifies the published version.
        </p>
      </article>
    </main>
  );
}
