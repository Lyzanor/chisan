import type { Metadata } from "next";
import Link from "next/link";

import { ProducersMap } from "@/components/map/producers-map";
import { listCategories, searchProducers, toProducerMapPoints } from "@/lib/csv-catalog";

export const metadata: Metadata = {
  title: "Buscador de productores",
  description: "Encuentra productores locales por municipio y categoría.",
};

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

function readQuery(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const value = params[key];
  if (Array.isArray(value)) {
    return (value[0] ?? "").trim();
  }
  return (value ?? "").trim();
}

function getCategoryIcon(value: string): string {
  if (/vino|bodega/i.test(value)) return "🍷";
  if (/ques/i.test(value)) return "🧀";
  if (/pan|boll|horno|pastel/i.test(value)) return "🍞";
  if (/miel/i.test(value)) return "🍯";
  if (/cerve/i.test(value)) return "🍺";
  if (/fruta/i.test(value)) return "🍎";
  if (/verdura|hort|agric/i.test(value)) return "🥦";
  if (/aceite|oliva/i.test(value)) return "🫒";
  if (/charcut|carne|embut/i.test(value)) return "🥩";
  if (/pescado|marisc/i.test(value)) return "🐟";
  if (/cafe|té|te/i.test(value)) return "☕";
  if (/huevo|ave|granja/i.test(value)) return "🥚";
  if (/hierb/i.test(value)) return "🌿";
  return "🧺";
}

function buildSearchHref(municipality: string, category: string): string {
  const params = new URLSearchParams();
  if (municipality) {
    params.set("municipio", municipality);
  }
  if (category) {
    params.set("categoria", category);
  }

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : "/";
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const queryParams = await searchParams;
  const municipality = readQuery(queryParams, "municipio");
  const category = readQuery(queryParams, "categoria");
  const highlight = readQuery(queryParams, "destacar");

  const [items, categories, allRows] = await Promise.all([
    searchProducers({ municipality, category }),
    listCategories(),
    searchProducers({ municipality: "", category: "" }),
  ]);

  const visibleItems = items.slice(0, 500);
  const hasMore = items.length > visibleItems.length;
  const highlightedItem = highlight
    ? items.find((i) => String(i.id) === highlight)
    : undefined;
  const mapPoints = highlightedItem
    ? toProducerMapPoints([highlightedItem])
    : toProducerMapPoints(items);

  return (
    <main className="catalog-page">
      <section className="catalog-shell">
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

          <div className="catalog-stats" aria-label="Resumen de resultados">
            <p>{items.length} productors trobats</p>
            <p>{allRows.length} en total</p>
          </div>

          <form method="get" className="catalog-search" role="search">
            <input type="hidden" name="categoria" value={category} />
            <span aria-hidden="true">🔎</span>
            <input
              type="search"
              name="municipio"
              defaultValue={municipality}
              placeholder="Cerca per municipi"
              aria-label="Municipio"
            />
            <button type="submit">Buscar</button>
          </form>
        </header>

        <nav className="catalog-categories" aria-label="Categorías">
          <Link
            href={buildSearchHref(municipality, "")}
            className={`catalog-chip ${!category ? "is-active" : ""}`}
          >
            <span aria-hidden="true">🌍</span>
            Tots
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={buildSearchHref(municipality, cat)}
              className={`catalog-chip ${category === cat ? "is-active" : ""}`}
            >
              <span aria-hidden="true">{getCategoryIcon(cat)}</span>
              {cat}
            </Link>
          ))}
        </nav>

        <section className="catalog-map" aria-label="Mapa de productores">
          <div className="catalog-map-head">
            <h2>Mapa de productors</h2>
            {highlightedItem ? (
              <Link href={buildSearchHref(municipality, category)} className="catalog-chip is-active">
                ✕ {highlightedItem.name} — Ver todos
              </Link>
            ) : (
              <p>{mapPoints.length} amb coordenades</p>
            )}
          </div>
          <ProducersMap points={mapPoints} />
        </section>

        <p className="catalog-results-meta">
          {items.length} resultados
          {municipality ? ` · Municipio: ${municipality}` : ""}
          {category ? ` · Categoría: ${category}` : ""}
        </p>

        {visibleItems.length > 0 ? (
          <ul className="producer-list">
            {visibleItems.map((item) => (
              <li key={item.id}>
                <article className="producer-card">
                  <div className="producer-thumb" aria-hidden="true">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div className="producer-main">
                    <Link
                      href={`${buildSearchHref(municipality, category)}${buildSearchHref(municipality, category).includes("?") ? "&" : "?"}destacar=${item.id}`}
                      className="producer-name"
                      scroll={false}
                    >
                      {item.name}
                    </Link>
                    <div className="producer-badges">
                      <span className="producer-badge">{getCategoryIcon(item.category)} {item.category}</span>
                      {item.subcategory ? (
                        <span className="producer-badge is-sub">{item.subcategory}</span>
                      ) : null}
                    </div>
                    <p className="producer-location">{item.city}</p>
                  </div>

                  <Link href={`/p/${item.id}`} className="producer-cta">
                    Ver ficha completa
                  </Link>
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
      </section>
    </main>
  );
}
