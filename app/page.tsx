import type { Metadata } from "next";
import Link from "next/link";

import { ProducersMap } from "@/components/map/producers-map";
import { ProvinceSelector } from "@/components/province-selector";
import { SearchForm } from "@/components/search-form";
import { ViewTransitionLink } from "@/components/view-transition-link";
import { buildCatalogHref, buildProducerHref, readQueryParam } from "@/lib/catalog-navigation";
import {
  getProvinceLabel,
  hasProducerMapPoint,
  listCategories,
  listMunicipalitySummaries,
  listProvinces,
  searchProducers,
  toProducerMapPoints,
} from "@/lib/csv-catalog";

export const metadata: Metadata = {
  title: "Buscador de productores",
  description: "Encuentra productores locales cercanos a tu ubicación o municipio.",
};

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";
const MAX_LOCAL_RESULTS = 150;
const MAX_NEARBY_RESULTS = 30;
const START_MUNICIPALITY_LIMIT = 10;
const MAP_SECTION_ID = "mapa";

function parseCoordinateParam(value: string, min: number, max: number): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return parsed >= min && parsed <= max ? parsed : undefined;
}

function formatResultCount(count: number): string {
  return count === 1 ? "1 resultado" : `${count} resultados`;
}

function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return "< 1 km";
  }

  return `${Math.round(distanceKm)} km`;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const queryParams = await searchParams;
  const province = readQueryParam(queryParams, "provincia");
  const municipality = readQueryParam(queryParams, "municipio");
  const category = readQueryParam(queryParams, "categoria");
  const highlight = readQueryParam(queryParams, "destacar");
  const latStr = readQueryParam(queryParams, "lat");
  const lonStr = readQueryParam(queryParams, "lon");

  const lat = parseCoordinateParam(latStr, -90, 90);
  const lon = parseCoordinateParam(lonStr, -180, 180);
  const hasLocation = lat !== undefined && lon !== undefined;
  const hasMunicipality = Boolean(municipality);
  const hasDiscoveryContext = hasLocation || hasMunicipality;

  const provinces = listProvinces();
  const provinceLabel = getProvinceLabel(province);

  const [items, categories, startMunicipalities] = await Promise.all([
    hasDiscoveryContext
      ? searchProducers({ municipality, category, lat, lon }, province)
      : Promise.resolve([]),
    listCategories(province),
    hasDiscoveryContext
      ? Promise.resolve([])
      : listMunicipalitySummaries(category, START_MUNICIPALITY_LIMIT, province),
  ]);

  const nearbyItems = hasLocation
    ? items.filter((item) => item.distanceKm !== undefined)
    : items;
  const visibleItems = hasLocation
    ? nearbyItems.slice(0, MAX_NEARBY_RESULTS)
    : items.slice(0, MAX_LOCAL_RESULTS);
  const hasMore = hasLocation
    ? nearbyItems.length > visibleItems.length
    : items.length > visibleItems.length;
  const highlightedItem = highlight
    ? items.find((i) => String(i.id) === highlight)
    : undefined;
  const highlightedMapItem =
    highlightedItem && hasProducerMapPoint(highlightedItem)
      ? highlightedItem
      : undefined;
  const mapPoints = highlightedMapItem
    ? toProducerMapPoints([highlightedMapItem])
    : toProducerMapPoints(visibleItems);
  const resetHref = buildCatalogHref({ municipality, category, lat: latStr, lon: lonStr, province });
  const resultCount = hasLocation ? nearbyItems.length : items.length;
  const resultCountLabel = formatResultCount(resultCount);
  const resultSummary = hasLocation
    ? `${resultCountLabel} con ubicación fiable, ordenados por cercanía${category ? ` · Categoría: ${category}` : ""}`
    : municipality
      ? `Municipio: ${municipality}${category ? ` · Categoría: ${category}` : " · Todas las categorías"}`
      : "Elige una ubicación o municipio para ver productores cercanos";

  return (
    <main className="catalog-page">
      <section className="catalog-shell">
        <header className="catalog-header">
          <p className="catalog-kicker">KM0 {provinceLabel}</p>
          <h1>Productores cerca de ti</h1>
          <ProvinceSelector provinces={provinces} currentProvince={province} />
          <p className="catalog-description">
            Descubre productores locales de tu municipio o los que quedan más cerca.
          </p>
          <SearchForm initialMunicipality={municipality} initialCategory={category} province={province} />
        </header>

        <nav className="catalog-categories" aria-label="Categorías">
          <Link
            href={buildCatalogHref({ municipality, category: "", lat: latStr, lon: lonStr, province })}
            className={`catalog-chip ${!category ? "is-active" : ""}`}
          >
            Tots
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={buildCatalogHref({ municipality, category: cat, lat: latStr, lon: lonStr, province })}
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

        {hasDiscoveryContext ? (
          <section
            id={MAP_SECTION_ID}
            className="catalog-map-stage"
            aria-label="Mapa de productores"
          >
            <div className="catalog-map-head">
              <h2>{hasLocation ? "Cerca de ti" : "Zona seleccionada"}</h2>
              <p>{resultCountLabel}</p>
            </div>
            <ProducersMap
              points={mapPoints}
              highlightedId={highlightedItem ? String(highlightedItem.id) : undefined}
              userLocation={hasLocation ? { lat, lon } : undefined}
              detailContext={{ municipality, category, lat: latStr, lon: lonStr, province }}
            />
          </section>
        ) : (
          <section className="catalog-start" aria-label="Inicio de descubrimiento">
            <div className="catalog-start-copy">
              <h2>Empieza por una zona concreta</h2>
              <p>
                Usa tu ubicación o entra por un municipio con productores disponibles.
              </p>
            </div>
            {startMunicipalities.length > 0 && (
              <div className="catalog-start-block">
                <h3>{category ? `Municipios con ${category}` : "Municipios con más productores"}</h3>
                <div className="catalog-start-grid">
                  {startMunicipalities.map((item) => (
                    <Link
                      key={item.name}
                      href={buildCatalogHref({ municipality: item.name, category, province })}
                      className="catalog-start-link"
                    >
                      <strong>{item.name}</strong>
                      <span>{formatResultCount(item.count)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {hasDiscoveryContext && (
          <section className="catalog-results" aria-label="Resultados de búsqueda">
            <p className="catalog-results-meta">{resultSummary}</p>

            {visibleItems.length > 0 ? (
              <ul className="producer-list">
                {visibleItems.map((item) => {
                  const producerNameHref = hasProducerMapPoint(item)
                    ? `${buildCatalogHref({
                        municipality,
                        category,
                        highlight: item.id,
                        lat: latStr,
                        lon: lonStr,
                        province,
                      })}#${MAP_SECTION_ID}`
                    : buildCatalogHref({
                        municipality,
                        category,
                        highlight: item.id,
                        lat: latStr,
                        lon: lonStr,
                        province,
                      });

                  return (
                    <li key={item.id}>
                      <article
                        className={`producer-card ${highlightedItem?.id === item.id ? "is-highlighted" : ""}`}
                      >
                        <div className="producer-main">
                          <Link
                            href={producerNameHref}
                            className="producer-name"
                            style={{ viewTransitionName: `producer-name-${item.id}` }}
                          >
                            {item.name}
                          </Link>
                          <p className="producer-meta">
                            {item.city} · {item.category}
                            {item.featuredProducts ? ` · ${item.featuredProducts}` : ""}
                            {item.distanceKm !== undefined
                              ? ` · ${formatDistance(item.distanceKm)}`
                              : ""}
                          </p>
                        </div>

                        <div className="producer-actions">
                          <ViewTransitionLink
                            href={buildProducerHref(
                              { id: item.id, slug: item.slug },
                              {
                                municipality,
                                category,
                                highlight: item.id,
                                lat: latStr,
                                lon: lonStr,
                                province,
                              },
                            )}
                            className="producer-inline-link is-primary"
                          >
                            Ficha
                          </ViewTransitionLink>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="catalog-empty">
                {hasLocation
                  ? "No hay productores cercanos para la combinación actual."
                  : "No hay productores para la combinación actual."}
              </p>
            )}

            {hasMore && (
              <p className="catalog-results-meta">
                Mostrando los primeros {visibleItems.length} resultados.
              </p>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

