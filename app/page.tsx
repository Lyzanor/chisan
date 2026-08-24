import type { Metadata } from "next";
import Link from "next/link";

import { CATALOG_UNIT, listCountries } from "@/lib/csv-catalog";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} · ${SITE_TAGLINE}`,
  description: `${SITE_TAGLINE}. Discover place-based food and drink producers in one trusted catalog, organized by ${CATALOG_UNIT.one}.`,
  alternates: { canonical: "/" },
};

type Countries = ReturnType<typeof listCountries>;

// A country that starts with a single area would otherwise read "1 districts".
function count(n: number, unit: { one: string; many: string }): string {
  return `${n} ${n === 1 ? unit.one : unit.many}`;
}

function CountryStart({ countries }: { countries: Countries }) {
  return (
    <main className="catalog-start-page">
      <section className="catalog-start-shell" aria-labelledby="country-start-title">
        <div className="catalog-start-head">
          <div>
            <p className="catalog-kicker">{SITE_NAME}</p>
            <h1 id="country-start-title">Choose a country</h1>
          </div>
        </div>

        <div className="country-card-list">
          {countries.map((country) => {
            const places = country.regions.reduce(
              (total, region) => total + region.areas.length,
              0,
            );

            return (
              <Link key={country.slug} href={`/${country.slug}`} className="country-card">
                <strong>{country.label}</strong>
                <small>
                  {count(places, country.unit)} in {count(country.regions.length, country.regionUnit)}
                </small>
              </Link>
            );
          })}
        </div>

        <section id="about" className="home-about" aria-labelledby="home-about-title">
          <div>
            <p className="catalog-kicker">About Chisan</p>
            <h2 id="home-about-title">{SITE_TAGLINE}</h2>
          </div>
          <div className="home-about__copy">
            <p>
              Chisan is building a shared discovery layer for local food: one place
              to find, understand and connect with food and drink producers rooted
              in their communities.
            </p>
            <p>
              A transparent CSV catalog remains the source of truth. The web,
              accounts and reviewed contribution flows grow around it so that the
              catalog can stay useful, trustworthy and open as Chisan expands.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

export default function HomePage() {
  return <CountryStart countries={listCountries()} />;
}
