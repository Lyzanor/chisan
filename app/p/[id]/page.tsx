import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProducerMiniMap from "@/components/producer-mini-map";
import { buildCsvFieldEntries, buildCsvSnapshot } from "@/lib/csv-schema";
import { getMapExternalLinks } from "@/lib/map-provider";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

type ProducerRouteKey = { id: number } | { slug: string };

function parseProducerRouteKey(rawValue: string): ProducerRouteKey | null {
  const normalized = rawValue.trim();
  if (!normalized) {
    return null;
  }

  if (/^\d+$/.test(normalized)) {
    const parsedId = Number.parseInt(normalized, 10);
    if (parsedId > 0) {
      return { id: parsedId };
    }
    return null;
  }

  return { slug: normalized.toLowerCase() };
}

async function getProducer(routeKey: ProducerRouteKey) {
  if ("id" in routeKey) {
    return prisma.producer.findUnique({ where: { id: routeKey.id } });
  }

  return prisma.producer.findUnique({ where: { slug: routeKey.slug } });
}

function toTextOrNull(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function formatCoordinates(latitude: number | null, longitude: number | null): string | null {
  if (latitude === null || longitude === null) {
    return null;
  }

  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

function ContactLink({ label, href }: { label: string; href: string }) {
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="km0-contact-chip"
    >
      {label}
    </a>
  );
}

function FieldRow({ label, value }: { label: string; value: string | null }) {
  const isEmpty = !value;

  return (
    <article className={`km0-info-card ${isEmpty ? "is-empty" : ""}`} data-csv-field={label}>
      <p className="km0-info-label">{label}</p>
      <p className={`km0-info-value ${isEmpty ? "is-empty" : ""}`}>{value ?? "Sin dato"}</p>
    </article>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const routeKey = parseProducerRouteKey(id);

  if (!routeKey) {
    return {
      title: "Productor no encontrado",
      description: "La ficha solicitada no está disponible.",
    };
  }

  const producer = await getProducer(routeKey);
  if (!producer) {
    return {
      title: "Productor no encontrado",
      description: "La ficha solicitada no está disponible.",
    };
  }

  const subtitle = [producer.city, producer.category, producer.subcategory].filter(Boolean).join(" · ");

  return {
    title: producer.name,
    description: subtitle || producer.description || "Ficha de productor Km0",
  };
}

export default async function ProducerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const routeKey = parseProducerRouteKey(id);

  if (!routeKey) {
    notFound();
  }

  const producer = await getProducer(routeKey);
  if (!producer) {
    notFound();
  }

  const hasCoordinates = producer.latitude !== null && producer.longitude !== null;
  const fallbackQuery = [producer.name, producer.address, producer.city].filter(Boolean).join(", ");
  const mapLinks = getMapExternalLinks(
    producer.latitude,
    producer.longitude,
    fallbackQuery || null,
  );

  const hasContact =
    producer.phone || producer.email || producer.website || producer.facebook || producer.instagram;

  const breadcrumb = [producer.city, producer.category, producer.subcategory].filter(Boolean).join(" · ");
  const coordinatesText = formatCoordinates(producer.latitude, producer.longitude);

  const csvFields = buildCsvFieldEntries(producer);
  const csvSnapshot = buildCsvSnapshot(producer);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: producer.name,
    address: producer.address ?? undefined,
    description: producer.description ?? undefined,
    telephone: producer.phone ?? undefined,
    email: producer.email ?? undefined,
    url: producer.website ?? undefined,
    sameAs: [producer.facebook, producer.instagram].filter(Boolean),
    geo:
      producer.latitude !== null && producer.longitude !== null
        ? {
            "@type": "GeoCoordinates",
            latitude: producer.latitude,
            longitude: producer.longitude,
          }
        : undefined,
    areaServed: producer.city ?? "Barcelona",
    category: [producer.category, producer.subcategory].filter(Boolean).join(" / ") || undefined,
  };

  return (
    <main className="km0-detail-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/json"
        id="producer-csv-snapshot"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(csvSnapshot) }}
      />

      <header className="km0-detail-topbar">
        <div className="km0-detail-container km0-detail-topbar-inner">
          <Link href="/" className="km0-detail-back">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al mapa
          </Link>

          <p className="km0-detail-breadcrumb" title={breadcrumb || undefined}>
            {breadcrumb || "Productores Km0 · Barcelona"}
          </p>
        </div>
      </header>

      <div className="km0-detail-container">
        <section className="km0-detail-hero">
          <div className="km0-detail-title-wrap">
            <p className="km0-detail-eyebrow">Ficha de productor</p>
            <h1 className="km0-detail-title">{producer.name}</h1>
            {breadcrumb && <p className="km0-detail-subtitle">{breadcrumb}</p>}

            <div className="km0-detail-pill-row">
              {producer.category && <span className="km0-detail-pill">{producer.category}</span>}
              {producer.subcategory && <span className="km0-detail-pill">{producer.subcategory}</span>}
              <span className="km0-detail-pill is-reviewed">Revisado: {producer.reviewed ? "sí" : "no"}</span>
            </div>

            {producer.description && <p className="km0-detail-description">{producer.description}</p>}
          </div>

          <div className="km0-detail-hero-icon" aria-hidden="true">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.6}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
              />
            </svg>
          </div>
        </section>

        <section className="km0-detail-grid">
          <article className="km0-detail-main">
            <section className="km0-detail-section">
              <h2>Información clave</h2>
              <div className="km0-kpi-grid">
                <FieldRow label="Municipio" value={toTextOrNull(producer.city)} />
                <FieldRow label="Categoría" value={toTextOrNull(producer.category)} />
                <FieldRow label="Subcategoría" value={toTextOrNull(producer.subcategory)} />
                <FieldRow label="Horario" value={toTextOrNull(producer.openingHours)} />
                <FieldRow label="Dirección" value={toTextOrNull(producer.address)} />
                <FieldRow label="Coordenadas" value={coordinatesText} />
              </div>
            </section>

            <section className="km0-detail-section">
              <h2>Contacto y canales</h2>
              {hasContact ? (
                <div className="km0-contact-row">
                  {producer.phone && <ContactLink label={`Tel. ${producer.phone}`} href={`tel:${producer.phone}`} />}
                  {producer.email && <ContactLink label={producer.email} href={`mailto:${producer.email}`} />}
                  {producer.website && <ContactLink label="Web" href={producer.website} />}
                  {producer.facebook && <ContactLink label="Facebook" href={producer.facebook} />}
                  {producer.instagram && <ContactLink label="Instagram" href={producer.instagram} />}
                </div>
              ) : (
                <p>Sin datos de contacto.</p>
              )}
            </section>

            <section className="km0-detail-section">
              <h2>Campos CSV completos</h2>
              <div className="km0-kpi-grid">
                {csvFields.map((field) => (
                  <FieldRow key={field.key} label={field.key} value={field.value} />
                ))}
              </div>

              <details className="km0-detail-json">
                <summary>Ver JSON estructurado (útil para agentes IA)</summary>
                <pre>{JSON.stringify(csvSnapshot, null, 2)}</pre>
              </details>
            </section>
          </article>

          <aside className="km0-detail-aside">
            <div className="km0-detail-sticky">
              <p className="km0-detail-map-head">Ubicación</p>

              {hasCoordinates ? (
                <ProducerMiniMap
                  latitude={producer.latitude as number}
                  longitude={producer.longitude as number}
                  label={producer.name}
                  className="h-56 w-full rounded-[16px] border border-[var(--line-soft)]"
                />
              ) : (
                <div className="km0-detail-map-empty">Sin coordenadas disponibles para mostrar en el mapa.</div>
              )}

              <a href={mapLinks.mapUrl} target="_blank" rel="noopener noreferrer" className="km0-detail-map-btn">
                Abrir en {mapLinks.providerLabel}
              </a>

              {producer.googleMapsUrl && (
                <p className="km0-detail-map-note">
                  Referencia original en{" "}
                  <a href={producer.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    Google Maps
                  </a>
                  .
                </p>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
