import type { Metadata } from "next";
import Link from "next/link";

import { CATALOG_UNIT, listCountries } from "@/lib/csv-catalog";

export const metadata: Metadata = {
  title: "KM0 Producer Map",
  description: `Map and browser of local producers by ${CATALOG_UNIT.one}.`,
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
            <p className="catalog-kicker">KM0</p>
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
      </section>
    </main>
  );
}

export default function HomePage() {
  return <CountryStart countries={listCountries()} />;
}
