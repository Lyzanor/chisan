import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProvinceSelector } from "@/components/province-selector";
import { buildCatalogHref } from "@/lib/catalog-navigation";
import { findProvinceCountry, listCountrySlugs } from "@/lib/csv-catalog";

type CountryPageProps = {
  params: Promise<{ country: string }>;
};

export function generateStaticParams() {
  return listCountrySlugs().map((country) => ({ country }));
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const country = findProvinceCountry(countrySlug);

  if (!country) {
    return { title: "Mapa de productores KM0" };
  }

  return {
    title: `${country.label} · Productores KM0`,
    description: `Elige ${country.unit} de ${country.label} para ver sus productores locales.`,
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country: countrySlug } = await params;
  const country = findProvinceCountry(countrySlug);

  if (!country) {
    notFound();
  }

  return (
    <main className="province-start-page">
      <section className="province-start-shell" aria-labelledby="province-start-title">
        <div className="province-start-head">
          <div>
            <p className="catalog-kicker">
              <Link href="/" className="country-back-link">
                KM0
              </Link>{" "}
              · {country.label}
            </p>
            <h1 id="province-start-title">Elige {country.unit}</h1>
          </div>
          <Suspense fallback={<div className="province-selector--loading">{country.label}…</div>}>
            <ProvinceSelector country={country} currentProvince="" />
          </Suspense>
        </div>

        <div className="province-group-list">
          {country.groups.map((group) => (
            <section
              key={group.slug}
              className="province-group-section"
              aria-labelledby={`province-group-${group.slug}`}
            >
              <h3 id={`province-group-${group.slug}`}>{group.label}</h3>
              <div className="province-link-list">
                {group.provinces.map((province) => (
                  <Link
                    key={province.slug}
                    href={buildCatalogHref({ province: province.slug })}
                    className="province-link"
                  >
                    {province.label}
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
