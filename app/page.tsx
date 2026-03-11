import type { Metadata } from "next";
import Link from "next/link";

import { CatalogBottomSheet } from "@/components/catalog-bottom-sheet";
import { MobileAppBar } from "@/components/mobile-app-bar";
import { ProducersMap } from "@/components/map/producers-map";
import { SearchForm } from "@/components/search-form";
import { ViewTransitionLink } from "@/components/view-transition-link";
import { buildCatalogHref, buildProducerHref, readQueryParam } from "@/lib/catalog-navigation";
import { listCategories, searchProducers, toProducerMapPoints } from "@/lib/csv-catalog";
import { getCategoryIcon } from "@/lib/get-category-icon";

export const metadata: Metadata = {
  title: "Buscador de productores",
  description: "Encuentra productores locales por municipio y categoría.",
};

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: HomePageProps) {
  const queryParams = await searchParams;
  const municipality = readQueryParam(queryParams, "municipio");
  const category = readQueryParam(queryParams, "categoria");
  const highlight = readQueryParam(queryParams, "destacar");
  const latStr = readQueryParam(queryParams, "lat");
  const lonStr = readQueryParam(queryParams, "lon");

  const lat = latStr ? Number.parseFloat(latStr) : undefined;
  const lon = lonStr ? Number.parseFloat(lonStr) : undefined;

  const [items, categories] = await Promise.all([
    searchProducers({ municipality, category, lat, lon }),
    listCategories(),
  ]);

  const visibleItems = items.slice(0, 500);
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
      <MobileAppBar
        categories={categories}
        currentCategory={category}
        municipality={municipality}
        lat={latStr}
        lon={lonStr}
      />
      <section className="catalog-shell">
        <section className="catalog-controls">
          <header className="catalog-hero">
            <div className="catalog-title-row">
              <span className="catalog-title-icon" aria-hidden="true">
                🌱
              </span>
              <div>
                <h1>Productors Locals</h1>
                <p>Àrea Metropolitana de Barcelona</p>
              </div>
            </div>

            <SearchForm
              initialMunicipality={municipality}
              initialCategory={category}
            />
          </header>

          <nav className="catalog-categories" aria-label="Categorías">
            <Link
              href={buildCatalogHref({ municipality, category: "", lat: latStr, lon: lonStr })}
              className={`catalog-chip ${!category ? "is-active" : ""}`}
            >
              <span aria-hidden="true">🌍</span>
              Tots
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={buildCatalogHref({ municipality, category: cat, lat: latStr, lon: lonStr })}
                className={`catalog-chip ${category === cat ? "is-active" : ""}`}
              >
                <span aria-hidden="true">{getCategoryIcon(cat)}</span>
                {cat}
              </Link>
            ))}
          </nav>

          {highlightedItem && (
            <div className="catalog-highlight-banner">
              <Link href={resetHref} className="catalog-chip is-active">
                ✕ {highlightedItem.name} - Ver todos
              </Link>
            </div>
          )}
        </section>

        <section className="catalog-map-stage">
          <section className="catalog-map" aria-label="Mapa de productores">
            <ProducersMap
              points={mapPoints}
              highlightedId={highlightedItem ? String(highlightedItem.id) : undefined}
              userLocation={lat !== undefined && lon !== undefined ? { lat, lon } : undefined}
              detailContext={{ municipality, category, lat: latStr, lon: lonStr }}
            />
          </section>

          <CatalogBottomSheet summary={`${items.length} resultados`}>
            <p className="catalog-results-meta">
              {items.length} resultados
              {municipality ? ` · Municipio: ${municipality}` : " · Todos los municipios"}
              {category ? ` · Categoría: ${category}` : " · Todas las categorías"}
            </p>

            {visibleItems.length > 0 ? (
              <ul className="producer-list">
                {visibleItems.map((item) => (
                  <li key={item.id}>
                    <article className="producer-card">
                      <div
                        className="producer-thumb"
                        aria-hidden="true"
                        style={{ viewTransitionName: `producer-mark-${item.id}` }}
                      >
                        {getCategoryIcon(item.category)}
                      </div>

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
                        <div className="producer-badges">
                          <span className="producer-badge">
                            {getCategoryIcon(item.category)} {item.category}
                          </span>
                          {item.subcategory ? (
                            <span className="producer-badge is-sub">{item.subcategory}</span>
                          ) : null}
                          {item.distanceKm !== undefined ? (
                            <span className="producer-badge is-distance" aria-label="Distancia">
                              📍 {item.distanceKm < 1 ? "< 1 km" : `${Math.round(item.distanceKm)} km`}
                            </span>
                          ) : null}
                        </div>
                        <p className="producer-location">{item.city}</p>
                      </div>

                      <ViewTransitionLink
                        href={buildProducerHref(item.id, {
                          municipality,
                          category,
                          highlight: item.id,
                          lat: latStr,
                          lon: lonStr,
                        })}
                        className="producer-cta"
                      >
                        Ver ficha completa
                      </ViewTransitionLink>
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
                Mostrando primeros {visibleItems.length} resultados. Refina la búsqueda para ver menos.
              </p>
            )}
          </CatalogBottomSheet>
        </section>
      </section>
    </main>
  );
}
