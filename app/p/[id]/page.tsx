import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getMapExternalLinks } from "@/lib/map-provider";
import ProducerMiniMap from "@/components/producer-mini-map";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getProducer(id: number) {
  return prisma.producer.findUnique({ where: { id } });
}

type CsvField = {
  key: string;
  value: string | null;
};

function ContactLink({ label, href }: { label: string; href: string }) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-emerald-500 hover:text-emerald-700"
    >
      {label}
    </a>
  );
}

function FieldRow({ label, value }: { label: string; value: string | null }) {
  if (!value) {
    return (
      <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2" data-csv-field={label}>
        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{label}</p>
        <p className="mt-1 text-sm text-gray-500">Sin dato</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2" data-csv-field={label}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 text-sm text-gray-800">{value}</p>
    </div>
  );
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const producerId = Number.parseInt(id, 10);
  if (Number.isNaN(producerId)) {
    return { title: "Productor no encontrado", description: "La ficha solicitada no está disponible." };
  }
  const producer = await getProducer(producerId);
  if (!producer) {
    return { title: "Productor no encontrado", description: "La ficha solicitada no está disponible." };
  }
  const subtitle = [producer.city, producer.category, producer.subcategory].filter(Boolean).join(" · ");
  return {
    title: producer.name,
    description: subtitle || producer.description || "Ficha de productor Km0",
  };
}

export default async function ProducerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const producerId = Number.parseInt(id, 10);

  if (Number.isNaN(producerId) || producerId < 1) notFound();

  const producer = await getProducer(producerId);
  if (!producer) notFound();

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

  const csvFields: CsvField[] = [
    { key: "nombre", value: toTextOrNull(producer.name) },
    { key: "-- municipio", value: toTextOrNull(producer.city) },
    { key: "categoria", value: toTextOrNull(producer.category) },
    { key: "subcategoria", value: toTextOrNull(producer.subcategory) },
    { key: "direccion", value: toTextOrNull(producer.address) },
    { key: "descripcion", value: toTextOrNull(producer.description) },
    { key: "horario", value: toTextOrNull(producer.openingHours) },
    { key: "telefono", value: toTextOrNull(producer.phone) },
    { key: "correo", value: toTextOrNull(producer.email) },
    { key: "web", value: toTextOrNull(producer.website) },
    { key: "Facebook", value: toTextOrNull(producer.facebook) },
    { key: "Instagram", value: toTextOrNull(producer.instagram) },
    { key: "Google Maps", value: toTextOrNull(producer.googleMapsUrl) },
    { key: "lat", value: producer.latitude !== null ? producer.latitude.toString() : null },
    { key: "lon", value: producer.longitude !== null ? producer.longitude.toString() : null },
    { key: "Revisado", value: producer.reviewed ? "sí" : "no" },
  ];

  const csvSnapshot = Object.fromEntries(csvFields.map((field) => [field.key, field.value]));

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
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/json"
        id="producer-csv-snapshot"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(csvSnapshot) }}
      />
      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white px-4 py-3 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al mapa
          </Link>
          {breadcrumb && (
            <>
              <span className="text-gray-200">·</span>
              <p className="truncate text-xs text-gray-400">{breadcrumb}</p>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold leading-tight text-gray-900">{producer.name}</h1>
            {breadcrumb && <p className="mt-1 text-sm text-gray-500">{breadcrumb}</p>}
            <p className="mt-2 inline-flex rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-600">
              Revisado: {producer.reviewed ? "sí" : "no"}
            </p>
          </div>
        </div>

        {producer.description && (
          <p className="mt-5 text-sm leading-relaxed text-gray-600">{producer.description}</p>
        )}

        {/* Info + map grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">

            {/* Core data */}
            <section>
              <h2 className="mb-2 text-sm font-semibold text-gray-900">Información clave</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                <FieldRow label="Municipio" value={toTextOrNull(producer.city)} />
                <FieldRow label="Categoría" value={toTextOrNull(producer.category)} />
                <FieldRow label="Subcategoría" value={toTextOrNull(producer.subcategory)} />
                <FieldRow label="Horario" value={toTextOrNull(producer.openingHours)} />
                <FieldRow label="Dirección" value={toTextOrNull(producer.address)} />
                <FieldRow label="Coordenadas" value={coordinatesText} />
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Full CSV fields */}
            <section>
              <h2 className="mb-2 text-sm font-semibold text-gray-900">Campos CSV (completo)</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {csvFields.map((field) => (
                  <FieldRow key={field.key} label={field.key} value={field.value} />
                ))}
              </div>

              <details className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <summary className="cursor-pointer text-xs font-medium text-gray-700">
                  Ver JSON estructurado (útil para agentes IA)
                </summary>
                <pre className="mt-2 overflow-x-auto text-[11px] text-gray-700">
                  {JSON.stringify(csvSnapshot, null, 2)}
                </pre>
              </details>
            </section>

            <div className="border-t border-gray-100" />

            <section>
              <h2 className="mb-2 text-sm font-semibold text-gray-900">Ubicación en mapa</h2>
              <a
                href={mapLinks.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Abrir en {mapLinks.providerLabel}
              </a>
              {producer.googleMapsUrl && (
                <p className="mt-2 text-xs text-gray-500">
                  También disponible en:{" "}
                  <a
                    href={producer.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-700 underline underline-offset-2"
                  >
                    Google Maps
                  </a>
                </p>
              )}
            </section>

            <div className="border-t border-gray-100" />

            {/* Contact */}
            <section>
              <h2 className="mb-2 text-sm font-semibold text-gray-900">Contacto y canales</h2>
              {hasContact ? (
                <div className="flex flex-wrap gap-2">
                  {producer.phone && <ContactLink label={`Tel. ${producer.phone}`} href={`tel:${producer.phone}`} />}
                  {producer.email && <ContactLink label={producer.email} href={`mailto:${producer.email}`} />}
                  {producer.website && <ContactLink label="Web" href={producer.website} />}
                  {producer.facebook && <ContactLink label="Facebook" href={producer.facebook} />}
                  {producer.instagram && <ContactLink label="Instagram" href={producer.instagram} />}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Sin datos de contacto.</p>
              )}
            </section>

          </div>

          {/* Mini map */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Mapa</p>
            {hasCoordinates ? (
              <ProducerMiniMap
                latitude={producer.latitude as number}
                longitude={producer.longitude as number}
                label={producer.name}
              />
            ) : (
              <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-gray-200 px-4 text-center text-xs text-gray-400">
                Sin coordenadas disponibles
              </div>
            )}
            {!hasCoordinates && producer.address && (
              <a
                href={mapLinks.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-emerald-500 hover:text-emerald-700"
              >
                Buscar por dirección en {mapLinks.providerLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
