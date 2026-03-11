import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findProducerById } from "@/lib/csv-catalog";
import { getFieldLabel } from "@/lib/field-labels";
import { getCategoryIcon } from "@/lib/get-category-icon";
import { ExternalLink } from "@/components/external-link";
import { ViewTransitionLink } from "@/components/view-transition-link";
import { buildCatalogHref, readQueryParam } from "@/lib/catalog-navigation";

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
      <div className="detail-mobile-bar">
        <ViewTransitionLink href={backHref} className="detail-back-link">
          ← Volver al buscador
        </ViewTransitionLink>
      </div>
      <section className="detail-shell">
        <ViewTransitionLink href={backHref} className="detail-back-link detail-back-link--desktop">
          ← Volver al buscador
        </ViewTransitionLink>

        <header className="detail-hero">
          <div className="detail-hero-top">
            <div
              className="detail-hero-mark"
              aria-hidden="true"
              style={{ viewTransitionName: `producer-mark-${producer.id}` }}
            >
              {getCategoryIcon(producer.category)}
            </div>
            <p className="detail-eyebrow">Ficha de productor</p>
          </div>
          <h1 style={{ viewTransitionName: `producer-name-${producer.id}` }}>{producer.name}</h1>
          <div className="detail-meta" aria-label="Resumen del productor">
            <span className="detail-meta-pill">📍 {producer.city}</span>
            <span className="detail-meta-pill">{producer.category}</span>
            {producer.subcategory ? (
              <span className="detail-meta-pill is-subtle">{producer.subcategory}</span>
            ) : null}
          </div>
          <p className="detail-subtitle">
            Consulta la información completa del CSV y abre sus enlaces principales.
          </p>
          <div className="detail-links">
            {website ? (
              <ExternalLink href={website}>
                Web
              </ExternalLink>
            ) : null}
            {maps ? (
              <ExternalLink href={maps}>
                Google Maps
              </ExternalLink>
            ) : null}
            {email ? <a href={`mailto:${email}`}>Correo</a> : null}
            {instagram ? (
              <ExternalLink href={instagram}>
                Instagram
              </ExternalLink>
            ) : null}
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
