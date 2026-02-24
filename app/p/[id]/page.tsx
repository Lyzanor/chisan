import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProducerMiniMap from "@/components/producer-mini-map";
import { getOsmDirectionsUrl, getOsmMapUrl } from "@/lib/osm";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getProducer(id: number) {
  return prisma.producer.findUnique({ where: { id } });
}

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

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm text-gray-700">{value}</p>
    </div>
  );
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
  const osmMapUrl = getOsmMapUrl(producer.latitude, producer.longitude, fallbackQuery || null);
  const osmDirectionsUrl = getOsmDirectionsUrl(producer.latitude, producer.longitude, fallbackQuery || null);

  const hasContact =
    producer.phone || producer.email || producer.website || producer.facebook || producer.instagram || producer.googleMapsUrl;

  const breadcrumb = [producer.city, producer.category, producer.subcategory].filter(Boolean).join(" · ");

  return (
    <main className="min-h-screen bg-white">
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
          </div>
        </div>

        {producer.description && (
          <p className="mt-5 text-sm leading-relaxed text-gray-600">{producer.description}</p>
        )}

        {/* Info + map grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">

            {/* Address + hours */}
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Dirección" value={producer.address} />
              <InfoRow label="Horario" value={producer.openingHours} />
              {!producer.address && !producer.openingHours && (
                <p className="text-sm text-gray-400">Sin información de ubicación.</p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Contact */}
            <div>
              <p className="mb-2.5 text-[11px] font-medium uppercase tracking-wider text-gray-400">Contacto</p>
              {hasContact ? (
                <div className="flex flex-wrap gap-2">
                  {producer.phone && <ContactLink label={`Tel. ${producer.phone}`} href={`tel:${producer.phone}`} />}
                  {producer.email && <ContactLink label={producer.email} href={`mailto:${producer.email}`} />}
                  {producer.website && <ContactLink label="Web" href={producer.website} />}
                  {producer.facebook && <ContactLink label="Facebook" href={producer.facebook} />}
                  {producer.instagram && <ContactLink label="Instagram" href={producer.instagram} />}
                  {producer.googleMapsUrl && <ContactLink label="Google Maps" href={producer.googleMapsUrl} />}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Sin datos de contacto.</p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Map actions */}
            <div className="flex flex-wrap gap-2">
              <a
                href={osmMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Ver en OpenStreetMap
              </a>
              <a
                href={osmDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-emerald-500 hover:text-emerald-700"
              >
                Cómo llegar
              </a>
            </div>
          </div>

          {/* Mini map */}
          <div>
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
          </div>
        </div>
      </div>
    </main>
  );
}
