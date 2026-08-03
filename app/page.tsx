import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ProducersMap } from "@/components/map/producers-map";
import { ProvinceSelector } from "@/components/province-selector";
import { buildCatalogHref, buildProducerHref, readQueryParam } from "@/lib/catalog-navigation";
import {
  CATALOG_UNIT,
  getProvinceCountrySlug,
  getProvinceLabel,
  listCategories,
  listProvinceCountries,
  normalizeProvinceSlug,
  searchProducers,
  toProducerMapPoints,
} from "@/lib/csv-catalog";
import { getCategoryIcon } from "@/lib/get-category-icon";

export const metadata: Metadata = {
  title: "Mapa de productores KM0",
  description: `Mapa y visualizador de productores locales por ${CATALOG_UNIT}.`,
};

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type ProvinceCountries = ReturnType<typeof listProvinceCountries>;

export const dynamic = "force-dynamic";

function getFieldValue(fields: Record<string, string>, key: string): string {
  const match = Object.entries(fields).find(
    ([field]) => field.toLocaleLowerCase() === key.toLocaleLowerCase(),
  );

  return (match?.[1] ?? "").trim();
}

function CountryStart({ countries }: { countries: ProvinceCountries }) {
  return (
    <main className="province-start-page">
      <section className="province-start-shell" aria-labelledby="country-start-title">
        <div className="province-start-head">
          <div>
            <p className="catalog-kicker">KM0</p>
            <h1 id="country-start-title">Elige país</h1>
          </div>
        </div>

        <div className="country-card-list">
          {countries.map((country) => {
            const places = country.groups.reduce(
              (total, group) => total + group.provinces.length,
              0,
            );

            return (
              <Link key={country.slug} href={`/${country.slug}`} className="country-card">
                <strong>{country.label}</strong>
                <small>
                  {places} {country.unitPlural} en {country.groups.length} {country.groupUnitPlural}
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
  const countries = listProvinceCountries();
  const province = normalizeProvinceSlug(readQueryParam(queryParams, "provincia"));
  const category = readQueryParam(queryParams, "categoria");
  const highlightedSlug = readQueryParam(queryParams, "destacar");

  if (!province) {
    return <CountryStart countries={countries} />;
  }

  const [items, categories, allRows] = await Promise.all([
    searchProducers({ municipality: "", category }, province),
    listCategories(province),
    searchProducers({ municipality: "", category: "" }, province),
  ]);

  const highlightedItem = highlightedSlug
    ? items.find((item) => item.slug === highlightedSlug) ??
      items.find((item) => String(item.id) === highlightedSlug)
    : undefined;
  const mapPoints = toProducerMapPoints(items);
  const visibleItems = items.slice(0, 500);
  const provinceLabel = getProvinceLabel(province);
  const countrySlug = getProvinceCountrySlug(province);
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
          <h1>Mapa de productores</h1>
          <p>
            {provinceLabel} · {items.length} productores encontrados · {mapPoints.length} en el mapa
          </p>
        </div>

        {country ? (
          <Suspense fallback={<div className="province-selector--loading">{country.label}…</div>}>
            <ProvinceSelector country={country} currentProvince={province} />
          </Suspense>
        ) : null}
      </header>

      <nav className="catalog-simple-categories" aria-label="Categorías">
        <Link
          href={buildCatalogHref({ province })}
          className={`catalog-chip ${!category ? "is-active" : ""}`}
        >
          Todas
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={buildCatalogHref({ province, category: cat })}
            className={`catalog-chip ${category === cat ? "is-active" : ""}`}
          >
            <span aria-hidden="true">{getCategoryIcon(cat)}</span>
            {cat}
          </Link>
        ))}
      </nav>

      <section className="catalog-simple-layout">
        <div className="catalog-simple-map" aria-label="Mapa de productores">
          <ProducersMap
            points={mapPoints}
            province={province}
            highlightedSlug={highlightedItem?.slug}
          />
        </div>

        <aside className="catalog-viewer" aria-label="Productores">
          {highlightedItem ? (
            <article className="catalog-featured-producer">
              <p className="catalog-kicker">Seleccionado</p>
              <h2>{highlightedItem.name}</h2>
              <p>{highlightedItem.city} · {highlightedItem.category}</p>
              <div className="catalog-featured-actions">
                <Link href={buildCatalogHref({ province, category })}>Ver todos</Link>
                <Link href={buildProducerHref(highlightedItem, { province })}>Abrir ficha</Link>
              </div>
            </article>
          ) : null}

          <div className="catalog-viewer-head">
            <h2>Productores</h2>
            <p>
              Mostrando {visibleItems.length} de {items.length}
              {allRows.length !== items.length ? ` · ${allRows.length} total en ${provinceLabel}` : ""}
            </p>
          </div>

          {visibleItems.length > 0 ? (
            <ul className="producer-compact-list">
              {visibleItems.map((item) => {
                const subcategory = getFieldValue(item.fields, "subcategoria");
                const address = getFieldValue(item.fields, "direccion");

                return (
                  <li key={item.slug} className={highlightedItem?.slug === item.slug ? "is-selected" : ""}>
                    <Link
                      href={buildCatalogHref({ province, category, highlight: item.slug })}
                      scroll={false}
                      className="producer-compact-link"
                    >
                      <span className="producer-compact-icon" aria-hidden="true">
                        {getCategoryIcon(item.category)}
                      </span>
                      <span>
                        <strong>{item.name}</strong>
                        <small>
                          {item.city} · {subcategory || item.category}
                          {address ? ` · ${address}` : ""}
                        </small>
                      </span>
                    </Link>
                    <Link
                      href={buildProducerHref(item, { province })}
                      className="producer-compact-detail"
                    >
                      Ficha
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="catalog-empty">No hay productores en esta categoría para {provinceLabel}.</p>
          )}
        </aside>
      </section>
    </main>
  );
}
