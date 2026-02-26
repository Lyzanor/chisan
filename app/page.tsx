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
    listCategories(),
  ]);

  const visibleItems = items.slice(0, 500);
  const hasMore = items.length > visibleItems.length;
  const mapPoints = toProducerMapPoints(items);

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
          {categories.map((cat) => (
            <Link
              key={cat}
              href={buildSearchHref(municipality, cat)}
              className={`category-chip ${category === cat ? "is-active" : ""}`}
            >
              <span aria-hidden="true">{getCategoryIcon(cat)}</span>
              {cat}
            </Link>
          ))}
        </div>

        <p className="meta-line">
          {items.length} resultados
          {municipality ? ` · Municipio: ${municipality}` : ""}
          {category ? ` · Categoría: ${category}` : ""}
        </p>

        <section className="map-section" aria-label="Mapa de productores">
          <ProducersMap points={mapPoints} />
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
