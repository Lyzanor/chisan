import type { Metadata } from "next";
import Link from "next/link";

import { searchProducers } from "@/lib/csv-catalog";

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
): string {
  const value = params.query;
  if (Array.isArray(value)) {
    return (value[0] ?? "").trim();
  }
  return (value ?? "").trim();
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const queryParams = await searchParams;
  const query = readQuery(queryParams);
  const items = await searchProducers(query);
  const visibleItems = items.slice(0, 500);
  const hasMore = items.length > visibleItems.length;

  return (
    <main className="page-shell">
      <section className="panel">
        <h1>KM0 CSV Viewer</h1>
        <p>Buscador simple: eliges una fila del CSV y abres su ficha.</p>

        <form method="get" className="search-form">
          <input
            type="search"
            name="query"
            defaultValue={query}
            placeholder="Buscar por nombre, municipio, categoría o cualquier campo"
            aria-label="Buscar en CSV"
          />
          <button type="submit">Buscar</button>
        </form>

        <p className="meta-line">
          {query ? `${items.length} resultados` : `${items.length} filas en CSV`}
        </p>

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
