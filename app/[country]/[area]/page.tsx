import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { AreaCatalog } from "@/components/area-catalog";
import { buildCatalogHref, readQueryParam } from "@/lib/catalog-navigation";
import { findCountry, getAreaLabel, normalizeAreaSlug } from "@/lib/csv-catalog";

type AreaPageProps = {
  params: Promise<{ country: string; area: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { country: countrySlug, area: rawArea } = await params;
  const country = findCountry(countrySlug);
  const area = country ? normalizeAreaSlug(country.slug, rawArea) : "";

  if (!country || !area) {
    return { title: "Area not found" };
  }

  const areaLabel = getAreaLabel(country.slug, area);
  return {
    title: `${areaLabel} producers`,
    description: `Browse local producers in ${areaLabel}, ${country.label}.`,
    alternates: { canonical: buildCatalogHref({ country: country.slug, area }) },
  };
}

export default async function AreaPage({ params, searchParams }: AreaPageProps) {
  const [{ country: countrySlug, area: rawArea }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const country = findCountry(countrySlug);
  const area = country ? normalizeAreaSlug(country.slug, rawArea) : "";

  if (!country || !area) {
    notFound();
  }

  if (countrySlug !== country.slug || rawArea !== area) {
    permanentRedirect(
      buildCatalogHref({
        country: country.slug,
        area,
        municipality:
          readQueryParam(query, "municipality") || readQueryParam(query, "municipio"),
        category: readQueryParam(query, "category"),
        highlight: readQueryParam(query, "highlight"),
        lat: readQueryParam(query, "lat"),
        lon: readQueryParam(query, "lon"),
      }),
    );
  }

  return <AreaCatalog country={country} area={area} searchParams={query} />;
}
