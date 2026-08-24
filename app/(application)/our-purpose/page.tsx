import type { Metadata } from "next";

import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";

const title = "Our purpose";
const description =
  "Chisan brings producers, products, availability and local demand into one connected local food network.";
const canonicalUrl = new URL("/our-purpose", SITE_ORIGIN).toString();

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

export default function OurPurposePage() {
  return (
    <main className="purpose-page">
      <article className="purpose-page__content" aria-labelledby="purpose-title">
        <p className="catalog-kicker">{SITE_NAME}</p>
        <h1 id="purpose-title">Our purpose</h1>

        <div className="purpose-page__statement">
          <p>Local food systems are full of value, but too often fragmented.</p>

          <p>
            Inspired by <em>chisan-chisho</em> — local production for local
            consumption — Chisan exists to bring producers, products,
            availability and local demand into one connected network.
          </p>

          <p>
            We believe better information creates stronger relationships:
            helping producers reach the right buyers, making local food easier
            to discover, and enabling communities to build more resilient food
            economies.
          </p>
        </div>

        <strong className="purpose-page__closing">Local food, unified.</strong>
      </article>
    </main>
  );
}
