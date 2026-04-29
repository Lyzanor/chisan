import type { Metadata } from "next";
import Image from "next/image";
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

type ActionLink = {
  href: string;
  label: string;
  kind: "external" | "email";
};

type DetailItem = {
  label: string;
  value: string;
};

const MAP_SECTION_ID = "mapa";
const SURFACED_DETAIL_FIELDS = new Set([
  "slug",
  "nombre",
  "municipio",
  "categoria",
  "productos estrella",
  "direccion",
  "descripcion",
  "horario",
  "telefono",
  "correo",
  "web",
  "facebook",
  "instagram",
  "google maps",
  "imagen",
  "lat",
  "lon",
]);

function getFieldValue(fields: Record<string, string>, key: string): string {
  const match = Object.entries(fields).find(
    ([field]) => field.toLocaleLowerCase() === key.toLocaleLowerCase(),
  );

  return (match?.[1] ?? "").trim();
}

function normalizeFieldName(field: string): string {
  return field.trim().toLocaleLowerCase();
}

function buildDetailItems(items: Array<[string, string]>): DetailItem[] {
  return items
    .filter(([, value]) => value.trim())
    .map(([label, value]) => ({ label, value: value.trim() }));
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

  const description = getFieldValue(producer.fields, "descripcion");
  const address = getFieldValue(producer.fields, "direccion");
  const schedule = getFieldValue(producer.fields, "horario");
  const phone = getFieldValue(producer.fields, "telefono");
  const email = getFieldValue(producer.fields, "correo");
  const website = getFieldValue(producer.fields, "web");
  const maps = getFieldValue(producer.fields, "Google Maps");
  const instagram = getFieldValue(producer.fields, "Instagram");
  const facebook = getFieldValue(producer.fields, "Facebook");
  const reviewDate = getFieldValue(producer.fields, "fecha_revision");

  const actionLinks: ActionLink[] = [
    website ? { href: website, label: "Web", kind: "external" } : null,
    maps ? { href: maps, label: "Google Maps", kind: "external" } : null,
    email ? { href: `mailto:${email}`, label: "Correo", kind: "email" } : null,
    instagram ? { href: instagram, label: "Instagram", kind: "external" } : null,
    facebook ? { href: facebook, label: "Facebook", kind: "external" } : null,
  ].filter((link): link is ActionLink => link !== null);

  const quickFacts = buildDetailItems([
    ["Municipio", producer.city],
    ["Categoría", producer.category],
    ["Dirección", address],
  ]);

  const visitItems = buildDetailItems([
    ["Dirección", address],
    ["Horario", schedule],
    ["Teléfono", phone],
    ["Correo", email],
  ]);

  const extraItems = Object.entries(producer.fields)
    .filter(
      ([field, value]) =>
        value.trim() && !SURFACED_DETAIL_FIELDS.has(normalizeFieldName(field)),
    )
    .map(([field, value]) => ({
      label: getFieldLabel(field),
      value: value.trim(),
    }));

  const introText =
    description ||
    `${producer.name} forma parte de la red KM0 en ${producer.city}, dentro de la categoría ${producer.category}.`;

  return (
    <main className="detail-page">
      <section className="detail-shell">
        <ViewTransitionLink href={backHref} className="detail-back-link">
          ← Volver al buscador
        </ViewTransitionLink>

        <header className="detail-hero">
          <div className="detail-hero-top">
            <div className="detail-image-panel">
              <Image
                src={producer.imageSrc}
                alt={`Imagen de ${producer.name}`}
                width={1600}
                height={1200}
                className="detail-producer-image"
                priority
                sizes="(max-width: 720px) calc(100vw - 3rem), 420px"
              />
            </div>

            <div className="detail-hero-copy">
              <p className="detail-kicker">Ficha de productor</p>
              <h1 style={{ viewTransitionName: `producer-name-${producer.id}` }}>{producer.name}</h1>
              <p className="detail-meta" aria-label="Resumen del productor">
                {producer.city} · {producer.category}
              </p>
              {actionLinks.length > 0 ? (
                <div className="detail-links" aria-label="Enlaces del productor">
                  {actionLinks.map((link) =>
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
            </div>
          </div>

          {quickFacts.length > 0 ? (
            <dl className="detail-fact-grid">
              {quickFacts.map((item) => (
                <div key={item.label} className="detail-fact-card">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </header>

        <div className="detail-layout">
          <div className="detail-main">
            <section className="detail-card">
              <h2>Información del productor</h2>
              <p className="detail-body">{introText}</p>
            </section>

            {producer.featuredProducts ? (
              <section className="detail-card">
                <h2>Qué ofrece</h2>
                <p className="detail-body">{producer.featuredProducts}</p>
              </section>
            ) : null}

            {extraItems.length > 0 ? (
              <section className="detail-card">
                <h2>Más información</h2>
                <dl className="detail-list">
                  {extraItems.map((item) => (
                    <div key={item.label} className="detail-list-row">
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>

          <aside className="detail-sidebar">
            {visitItems.length > 0 ? (
              <section className="detail-card">
                <h2>Visita y contacto</h2>
                <dl className="detail-list">
                  {visitItems.map((item) => (
                    <div key={item.label} className="detail-list-row">
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {reviewDate ? (
              <section className="detail-card detail-card-muted">
                <h2>Revisión</h2>
                <p className="detail-body">{reviewDate}</p>
              </section>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}
