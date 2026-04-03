import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ExternalLink } from "@/components/external-link";
import { ViewTransitionLink } from "@/components/view-transition-link";
import {
  buildCatalogHref,
  buildProducerHref,
  buildProducerPathSegment,
  readQueryParam,
} from "@/lib/catalog-navigation";
import { findProducerById } from "@/lib/csv-catalog";
import { getFieldLabel } from "@/lib/field-labels";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type HighlightLink = {
  href: string;
  label: string;
  kind: "external" | "email";
};

const HIDDEN_DETAIL_FIELDS = new Set(["slug", "lat", "lon"]);
const MAP_SECTION_ID = "mapa";

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
    alternates: {
      canonical: `/p/${buildProducerPathSegment(producer.id, producer.slug)}`,
    },
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
  const highlight = readQueryParam(queryParams, "destacar");
  const lat = readQueryParam(queryParams, "lat");
  const lon = readQueryParam(queryParams, "lon");
  const canonicalSegment = buildProducerPathSegment(producer.id, producer.slug);

  if (id !== canonicalSegment) {
    redirect(
      buildProducerHref(
        { id: producer.id, slug: producer.slug },
        { municipality, category, highlight, lat, lon },
      ),
    );
  }

  const backHref = `${buildCatalogHref({
    municipality,
    category,
    lat,
    lon,
    highlight: producer.id,
  })}#${MAP_SECTION_ID}`;

  const website = getFieldValue(producer.fields, "web");
  const maps = getFieldValue(producer.fields, "Google Maps");
  const email = getFieldValue(producer.fields, "correo");
  const instagram = getFieldValue(producer.fields, "Instagram");
  const facebook = getFieldValue(producer.fields, "Facebook");
  const highlightLinks: HighlightLink[] = [
    website ? { href: website, label: "Web", kind: "external" } : null,
    maps ? { href: maps, label: "Google Maps", kind: "external" } : null,
    email ? { href: `mailto:${email}`, label: "Correo", kind: "email" } : null,
    instagram ? { href: instagram, label: "Instagram", kind: "external" } : null,
    facebook ? { href: facebook, label: "Facebook", kind: "external" } : null,
  ].filter((link): link is HighlightLink => link !== null);
  const visibleFields = Object.entries(producer.fields).filter(
    ([key]) => !HIDDEN_DETAIL_FIELDS.has(key.trim().toLocaleLowerCase()),
  );

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
            {producer.featuredProducts ? ` · ${producer.featuredProducts}` : ""}
          </p>
          {highlightLinks.length > 0 ? (
            <div className="detail-links" aria-label="Enlaces del productor">
              {highlightLinks.map((link) =>
                link.kind === "external" ? (
                  <ExternalLink key={link.href} href={link.href}>
                    {link.label}
                  </ExternalLink>
                ) : (
                  <a key={link.href} href={link.href}>
                    {link.label}
                  </a>
                ),
              )}
            </div>
          ) : null}
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
                {visibleFields.map(([key, value]) => (
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
