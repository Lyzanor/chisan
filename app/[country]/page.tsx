import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";

import { AreaSelector } from "@/components/area-selector";
import { buildCatalogHref } from "@/lib/catalog-navigation";
import { findCountry, listCountrySlugs } from "@/lib/csv-catalog";

type CountryPageProps = {
  params: Promise<{ country: string }>;
};

export function generateStaticParams() {
  return listCountrySlugs().map((country) => ({ country }));
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const country = findCountry(countrySlug);

  if (!country) {
    return { title: "KM0 Producer Map" };
  }

  return {
    title: `${country.label} · KM0 Producers`,
    description: `Pick a ${country.unit.one} of ${country.label} to browse its local producers.`,
    alternates: { canonical: `/${country.slug}` },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country: countrySlug } = await params;
  const country = findCountry(countrySlug);

  if (!country) {
    notFound();
  }

  if (countrySlug !== country.slug) {
    permanentRedirect(`/${country.slug}`);
  }

  return (
    <main className="catalog-start-page">
      <section className="catalog-start-shell" aria-labelledby="area-start-title">
        <div className="catalog-start-head">
          <div>
            <p className="catalog-kicker">
              <Link href="/" className="country-back-link">
                KM0
              </Link>{" "}
              · {country.label}
            </p>
            <h1 id="area-start-title">Choose a {country.unit.one}</h1>
          </div>
          <Suspense fallback={<div className="area-selector--loading">{country.label}…</div>}>
            <AreaSelector country={country} currentArea="" />
          </Suspense>
        </div>

        <div className="region-group-list">
          {country.regions.map((region) => (
            <section
              key={region.slug}
              className="region-group-section"
              aria-labelledby={`region-group-${region.slug}`}
            >
              <h3 id={`region-group-${region.slug}`}>{region.label}</h3>
              <div className="area-link-list">
                {region.areas.map((area) => (
                  <Link
                    key={area.slug}
                    href={buildCatalogHref({ country: country.slug, area: area.slug })}
                    className="area-link"
                  >
                    {area.label}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
