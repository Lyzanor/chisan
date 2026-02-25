import type { Metadata } from "next";
import Link from "next/link";

import { ProducersMap } from "@/components/map/producers-map";
import { listCategoryBuckets, searchProducers } from "@/lib/csv-catalog";
import { toProducerMapPoints } from "@/lib/producer-map";

export const metadata: Metadata = {
  title: "Buscador",
  description: "Busca una fila del CSV y abre la ficha del productor.",
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
  if (/pan|boll|horno|pastel/i.test(value)) return "🥖";
  if (/miel/i.test(value)) return "🍯";
  if (/cerve/i.test(value)) return "🍺";
  if (/fruta|verdura|hort|agric/i.test(value)) return "🥕";
  if (/aceite|oliva/i.test(value)) return "🫒";
  if (/charcut|carne|embut/i.test(value)) return "🥩";
  if (/pescado|marisc/i.test(value)) return "🐟";
  if (/cafe|té|te/i.test(value)) return "☕";
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

  const [items, categories] = await Promise.all([
    searchProducers({ municipality, category }),
    listCategoryBuckets(),
  ]);

  const visibleItems = items.slice(0, 500);
  const hasMore = items.length > visibleItems.length;
  const mapPoints = toProducerMapPoints(visibleItems);
  const visibleMapPoints = mapPoints.slice(0, 300);
  const hiddenMapPoints = mapPoints.length - visibleMapPoints.length;
  const rowsWithoutCoordinates = visibleItems.length - mapPoints.length;

  return (
    <main className="page-shell">
      <section className="panel">
        <h1>KM0 CSV Viewer</h1>
        <p>Busca por municipio y luego filtra por categoría.</p>

        <form method="get" className="search-form">
          <input type="hidden" name="categoria" value={category} />
          <input
            type="search"
            name="municipio"
            defaultValue={municipality}
            placeholder="Escribe un municipio"
            aria-label="Municipio"
          />
          <button type="submit">Buscar</button>
        </form>

        <div className="category-row" aria-label="Categorías">
          <Link
            href={buildSearchHref(municipality, "")}
            className={`category-chip ${!category ? "is-active" : ""}`}
          >
            <span aria-hidden="true">📍</span>
            Todas
          </Link>
          {categories.map((bucket) => (
            <Link
              key={bucket.value}
              href={buildSearchHref(municipality, bucket.value)}
              className={`category-chip ${category === bucket.value ? "is-active" : ""}`}
            >
              <span aria-hidden="true">{getCategoryIcon(bucket.value)}</span>
              {bucket.value}
            </Link>
          ))}
        </div>

        <p className="meta-line">
          {items.length} resultados
          {municipality ? ` · Municipio: ${municipality}` : ""}
          {category ? ` · Categoría: ${category}` : ""}
        </p>

        <section className="map-section" aria-label="Mapa de productores">
          <h2>Mapa</h2>
          <p className="meta-line">
            {visibleMapPoints.length} ubicaciones visibles
            {rowsWithoutCoordinates > 0
              ? ` · ${rowsWithoutCoordinates} resultados sin coordenadas`
              : ""}
            {hiddenMapPoints > 0
              ? ` · ${hiddenMapPoints} ubicaciones ocultas para mantener rendimiento`
              : ""}
          </p>
          <ProducersMap points={visibleMapPoints} />
        </section>

        <ul className="result-list">
          {visibleItems.map((item) => (
            <li key={item.id} className="result-item">
              <Link href={`/p/${item.id}`} className="result-link">
                {item.name}
              </Link>
              <p>
                {item.city} · {item.category}
                {item.subcategory ? ` · ${item.subcategory}` : ""}
              </p>
            </li>
          ))}
        </ul>

        {hasMore && (
          <p className="meta-line">
            Mostrando primeros {visibleItems.length} resultados. Refina la búsqueda para ver menos.
          </p>
        )}
      </section>
    </main>
  );
}
