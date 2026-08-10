import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ProducersMap } from "@/components/map/producers-map";
import { AreaSelector } from "@/components/area-selector";
import { buildCatalogHref, buildProducerHref, readQueryParam } from "@/lib/catalog-navigation";
import {
  CATALOG_UNIT,
  getAreaCountrySlug,
  getAreaLabel,
  listCategories,
  listCountries,
  normalizeAreaSlug,
  searchProducers,
  toProducerMapPoints,
} from "@/lib/csv-catalog";
import { getCategoryIcon } from "@/lib/get-category-icon";

export const metadata: Metadata = {
  title: "KM0 Producer Map",
  description: `Map and browser of local producers by ${CATALOG_UNIT.one}.`,
};

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type Countries = ReturnType<typeof listCountries>;

export const dynamic = "force-dynamic";

function getFieldValue(fields: Record<string, string>, key: string): string {
  const match = Object.entries(fields).find(
    ([field]) => field.toLocaleLowerCase() === key.toLocaleLowerCase(),
  );

  return (match?.[1] ?? "").trim();
}

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

export default async function HomePage({ searchParams }: HomePageProps) {
  const queryParams = await searchParams;
  const countries = listCountries();
  const area = normalizeAreaSlug(readQueryParam(queryParams, "area"));
  const category = readQueryParam(queryParams, "category");
  const highlightedSlug = readQueryParam(queryParams, "highlight");

  if (!area) {
    return <CountryStart countries={countries} />;
  }

  const [items, categories, allRows] = await Promise.all([
    searchProducers({ municipality: "", category }, area),
    listCategories(area),
    searchProducers({ municipality: "", category: "" }, area),
  ]);

  const highlightedItem = highlightedSlug
    ? items.find((item) => item.slug === highlightedSlug) ??
      items.find((item) => String(item.id) === highlightedSlug)
    : undefined;
  const mapPoints = toProducerMapPoints(items);
  const visibleItems = items.slice(0, 500);
  const areaLabel = getAreaLabel(area);
  const countrySlug = getAreaCountrySlug(area);
  const country = countries.find((entry) => entry.slug === countrySlug);

  return (
    <main className="catalog-page catalog-page--simple">
      <header className="catalog-simple-header">
        <div>
          <p className="catalog-kicker">
            <Link href="/" className="country-back-link">
              KM0
            </Link>
            {country ? (
              <>
                {" · "}
                <Link href={`/${country.slug}`} className="country-back-link">
                  {country.label}
                </Link>
              </>
            ) : null}
          </p>
          <h1>Producer map</h1>
          <p>
            {areaLabel} · {items.length} producers found · {mapPoints.length} on the map
          </p>
        </div>

        {country ? (
          <Suspense fallback={<div className="area-selector--loading">{country.label}…</div>}>
            <AreaSelector country={country} currentArea={area} />
          </Suspense>
        ) : null}
      </header>

      <nav className="catalog-simple-categories" aria-label="Categories">
        <Link
          href={buildCatalogHref({ area })}
          className={`catalog-chip ${!category ? "is-active" : ""}`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={buildCatalogHref({ area, category: cat })}
            className={`catalog-chip ${category === cat ? "is-active" : ""}`}
          >
            <span aria-hidden="true">{getCategoryIcon(cat)}</span>
            {cat}
          </Link>
        ))}
      </nav>

      <section className="catalog-simple-layout">
        <div className="catalog-simple-map" aria-label="Producer map">
          <ProducersMap
            points={mapPoints}
            area={area}
            highlightedSlug={highlightedItem?.slug}
          />
        </div>

        <aside className="catalog-viewer" aria-label="Producers">
          {highlightedItem ? (
            <article className="catalog-featured-producer">
              <p className="catalog-kicker">Selected</p>
              <h2>{highlightedItem.name}</h2>
              <p>{highlightedItem.city} · {highlightedItem.categories.join(" · ")}</p>
              <div className="catalog-featured-actions">
                <Link href={buildCatalogHref({ area, category })}>See all</Link>
                <Link href={buildProducerHref(highlightedItem, { area })}>Open profile</Link>
              </div>
            </article>
          ) : null}

          <div className="catalog-viewer-head">
            <h2>Producers</h2>
            <p>
              Showing {visibleItems.length} of {items.length}
              {allRows.length !== items.length ? ` · ${allRows.length} total in ${areaLabel}` : ""}
            </p>
          </div>

          {visibleItems.length > 0 ? (
            <ul className="producer-compact-list">
              {visibleItems.map((item) => {
                const subcategory = getFieldValue(item.fields, "subcategoria");
                const address = getFieldValue(item.fields, "direccion");
                const categorySummary = item.categories.join(" · ");

                return (
                  <li key={item.slug} className={highlightedItem?.slug === item.slug ? "is-selected" : ""}>
                    <Link
                      href={buildCatalogHref({ area, category, highlight: item.slug })}
                      scroll={false}
                      className="producer-compact-link"
                    >
                      <span className="producer-compact-icon" aria-hidden="true">
                        {getCategoryIcon(item.category)}
                      </span>
                      <span>
                        <strong>{item.name}</strong>
                        <small>
                          {item.city} · {subcategory || categorySummary}
                          {address ? ` · ${address}` : ""}
                        </small>
                      </span>
                    </Link>
                    <Link
                      href={buildProducerHref(item, { area })}
                      className="producer-compact-detail"
                    >
                      Details
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="catalog-empty">No producers in this category for {areaLabel}.</p>
          )}
        </aside>
      </section>
    </main>
  );
}
