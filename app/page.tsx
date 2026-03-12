import type { Metadata } from "next";
import Link from "next/link";

import { ProducersMap } from "@/components/map/producers-map";
import { SearchForm } from "@/components/search-form";
import { ViewTransitionLink } from "@/components/view-transition-link";
import { buildCatalogHref, buildProducerHref, readQueryParam } from "@/lib/catalog-navigation";
import { listCategories, searchProducers, toProducerMapPoints } from "@/lib/csv-catalog";

export const metadata: Metadata = {
  title: "Buscador de productores",
  description: "Encuentra productores locales por municipio y categoría.",
};

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";
const MAX_VISIBLE_RESULTS = 150;

function parseCoordinateParam(value: string): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const queryParams = await searchParams;
  const municipality = readQueryParam(queryParams, "municipio");
  const category = readQueryParam(queryParams, "categoria");
  const highlight = readQueryParam(queryParams, "destacar");
  const latStr = readQueryParam(queryParams, "lat");
  const lonStr = readQueryParam(queryParams, "lon");

  const lat = parseCoordinateParam(latStr);
  const lon = parseCoordinateParam(lonStr);

  const [items, categories] = await Promise.all([
    searchProducers({ municipality, category, lat, lon }),
    listCategories(),
  ]);

  const visibleItems = items.slice(0, MAX_VISIBLE_RESULTS);
  const hasMore = items.length > visibleItems.length;
  const highlightedItem = highlight
    ? items.find((i) => String(i.id) === highlight)
    : undefined;
  const mapPoints = highlightedItem
    ? toProducerMapPoints([highlightedItem])
    : toProducerMapPoints(items);
  const resetHref = buildCatalogHref({ municipality, category, lat: latStr, lon: lonStr });

  return (
    <main className="catalog-page">
      <section className="catalog-shell">
        <header className="catalog-header">
          <p className="catalog-kicker">KM0 Barcelona</p>
          <h1>Productors locals</h1>
          <p className="catalog-description">
            Busca por municipio o categoría y abre la ficha completa de cada productor.
          </p>
          <SearchForm initialMunicipality={municipality} initialCategory={category} />
        </header>

        <nav className="catalog-categories" aria-label="Categorías">
          <Link
            href={buildCatalogHref({ municipality, category: "", lat: latStr, lon: lonStr })}
            className={`catalog-chip ${!category ? "is-active" : ""}`}
          >
            Tots
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={buildCatalogHref({ municipality, category: cat, lat: latStr, lon: lonStr })}
              className={`catalog-chip ${category === cat ? "is-active" : ""}`}
            >
              {cat}
            </Link>
          ))}
        </nav>

        {highlightedItem && (
          <p className="catalog-results-meta">
            Viendo <strong>{highlightedItem.name}</strong>.{" "}
            <Link href={resetHref} className="producer-inline-link">
              Ver todos
            </Link>
          </p>
        )}

        <section className="catalog-map-stage" aria-label="Mapa de productores">
          <div className="catalog-map-head">
            <h2>Mapa</h2>
            <p>{items.length} resultados</p>
          </div>
          <ProducersMap
            points={mapPoints}
            highlightedId={highlightedItem ? String(highlightedItem.id) : undefined}
            userLocation={lat !== undefined && lon !== undefined ? { lat, lon } : undefined}
            detailContext={{ municipality, category, lat: latStr, lon: lonStr }}
          />
        </section>

        <section className="catalog-results" aria-label="Resultados de búsqueda">
          <p className="catalog-results-meta">
            {municipality ? `Municipio: ${municipality}` : "Todos los municipios"}
            {category ? ` · Categoría: ${category}` : " · Todas las categorías"}
          </p>

          {visibleItems.length > 0 ? (
            <ul className="producer-list">
              {visibleItems.map((item) => (
                <li key={item.id}>
                  <article className="producer-card">
                    <div className="producer-main">
                      <Link
                        href={buildCatalogHref({
                          municipality,
                          category,
                          highlight: item.id,
                          lat: latStr,
                          lon: lonStr,
                        })}
                        className="producer-name"
                        scroll={false}
                        style={{ viewTransitionName: `producer-name-${item.id}` }}
                      >
                        {item.name}
                      </Link>
                      <p className="producer-meta">
                        {item.city} · {item.category}
                        {item.subcategory ? ` · ${item.subcategory}` : ""}
                        {item.distanceKm !== undefined
                          ? ` · ${item.distanceKm < 1 ? "< 1 km" : `${Math.round(item.distanceKm)} km`}`
                          : ""}
                      </p>
                    </div>

                    <div className="producer-actions">
                      <Link
                        href={buildCatalogHref({
                          municipality,
                          category,
                          highlight: item.id,
                          lat: latStr,
                          lon: lonStr,
                        })}
                        className="producer-inline-link"
                        scroll={false}
                      >
                        Mapa
                      </Link>
                      <ViewTransitionLink
                        href={buildProducerHref(item.id, {
                          municipality,
                          category,
                          highlight: item.id,
                          lat: latStr,
                          lon: lonStr,
                        })}
                        className="producer-inline-link is-primary"
                      >
                        Ficha
                      </ViewTransitionLink>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p className="catalog-empty">
              No hay resultados para la combinación actual. Prueba con otra categoría o municipio.
            </p>
          )}

          {hasMore && (
            <p className="catalog-results-meta">
              Mostrando los primeros {visibleItems.length} resultados.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
