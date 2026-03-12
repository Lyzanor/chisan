import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExternalLink } from "@/components/external-link";
import { ViewTransitionLink } from "@/components/view-transition-link";
import { buildCatalogHref, readQueryParam } from "@/lib/catalog-navigation";
import { findProducerById } from "@/lib/csv-catalog";
import { getFieldLabel } from "@/lib/field-labels";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFieldValue(fields: Record<string, string>, key: string): string {
  const match = Object.entries(fields).find(
    ([field]) => field.toLocaleLowerCase() === key.toLocaleLowerCase(),
  );

  return (match?.[1] ?? "").trim();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const producer = await findProducerById(id);

  if (!producer) {
    return {
      title: "Productor no encontrado",
      description: "No existe esa fila en el CSV.",
    };
  }

  return {
    title: producer.name,
    description: `${producer.city} · ${producer.category}`,
  };
}

export default async function ProducerPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const queryParams = await searchParams;
  const producer = await findProducerById(id);

  if (!producer) {
    notFound();
  }

  const municipality = readQueryParam(queryParams, "municipio");
  const category = readQueryParam(queryParams, "categoria");
  const lat = readQueryParam(queryParams, "lat");
  const lon = readQueryParam(queryParams, "lon");
  const backHref = buildCatalogHref({
    municipality,
    category,
    lat,
    lon,
    highlight: producer.id,
  });

  const website = getFieldValue(producer.fields, "web");
  const maps = getFieldValue(producer.fields, "Google Maps");
  const email = getFieldValue(producer.fields, "correo");
  const instagram = getFieldValue(producer.fields, "Instagram");

  return (
    <main className="detail-page">
      <section className="detail-shell">
        <ViewTransitionLink href={backHref} className="detail-back-link">
          ← Volver al buscador
        </ViewTransitionLink>

        <header className="detail-header">
          <p className="detail-kicker">Ficha de productor</p>
          <h1 style={{ viewTransitionName: `producer-name-${producer.id}` }}>{producer.name}</h1>
          <p className="detail-meta" aria-label="Resumen del productor">
            {producer.city} · {producer.category}
            {producer.subcategory ? ` · ${producer.subcategory}` : ""}
          </p>
          <div className="detail-links" aria-label="Enlaces del productor">
            {website ? <ExternalLink href={website}>Web</ExternalLink> : null}
            {maps ? <ExternalLink href={maps}>Google Maps</ExternalLink> : null}
            {email ? <a href={`mailto:${email}`}>Correo</a> : null}
            {instagram ? <ExternalLink href={instagram}>Instagram</ExternalLink> : null}
          </div>
        </header>

        <section className="detail-table-card">
          <h2>Datos del productor</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Dato</th>
                  <th>Información</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(producer.fields).map(([key, value]) => (
                  <tr key={key}>
                    <td>{getFieldLabel(key)}</td>
                    <td>{value || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
