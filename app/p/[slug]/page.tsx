import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DetailDesktopNav } from "@/components/detail-desktop-nav";
import {
  buildCatalogHref,
  buildProducerHref,
  buildProducerPathSegment,
  readQueryParam,
} from "@/lib/catalog-navigation";
import { findProducerBySlug, listCategories, normalizeProvinceSlug } from "@/lib/csv-catalog";
import { getFieldLabel } from "@/lib/field-labels";
import { ExternalLink } from "@/components/external-link";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFieldValue(fields: Record<string, string>, key: string): string {
  const match = Object.entries(fields).find(
    ([field]) => field.toLocaleLowerCase() === key.toLocaleLowerCase(),
  );

  return (match?.[1] ?? "").trim();
}

function buildPhoneHref(phone: string): string {
  const firstPhone = phone.split("/")[0] ?? phone;
  const normalizedPhone = firstPhone.replace(/[^\d+]/g, "");

  return normalizedPhone ? `tel:${normalizedPhone}` : "";
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const province = normalizeProvinceSlug(readQueryParam(query, "provincia"));
  const producer = await findProducerBySlug(slug, province);

  if (!producer) {
    return {
      title: "Productor no encontrado",
      description: "No existe ese productor en el CSV.",
    };
  }

  return {
    title: producer.name,
    description: `${producer.city} · ${producer.category}`,
  };
}

export default async function ProducerPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const province = normalizeProvinceSlug(readQueryParam(query, "provincia"));
  const [producer, categories] = await Promise.all([
    findProducerBySlug(slug, province),
    listCategories(province),
  ]);

  if (!producer) {
    notFound();
  }

  const municipality = readQueryParam(query, "municipio");
  const category = readQueryParam(query, "categoria");
  const highlight = readQueryParam(query, "destacar");
  const lat = readQueryParam(query, "lat");
  const lon = readQueryParam(query, "lon");
  const canonicalSegment = buildProducerPathSegment(producer.slug);
  const backHref = buildCatalogHref({ province, category, highlight: producer.slug });

  if (slug !== canonicalSegment) {
    redirect(
      buildProducerHref(
        producer,
        {
          municipality,
          category,
          highlight: highlight ? producer.slug : undefined,
          lat,
          lon,
          province,
        },
      ),
    );
  }

  const website = getFieldValue(producer.fields, "web");
  const maps = getFieldValue(producer.fields, "Google Maps");
  const email = getFieldValue(producer.fields, "correo");
  const phone = getFieldValue(producer.fields, "telefono");
  const instagram = getFieldValue(producer.fields, "Instagram");
  const facebook = getFieldValue(producer.fields, "Facebook");
  const subcategory = getFieldValue(producer.fields, "subcategoria");
  const phoneHref = buildPhoneHref(phone);

  return (
    <main className="detail-page">
      <div className="detail-mobile-bar">
        <Link href={backHref} className="detail-back-link">
          ← Volver al mapa
        </Link>
      </div>
      <section className="detail-shell">
        <DetailDesktopNav categories={categories} province={province} />
        <Link href={backHref} className="detail-back-link detail-back-link--desktop">
          ← Volver al mapa
        </Link>

        <header id="detail-hero" className="detail-hero">
          <p className="detail-eyebrow">Ficha de productor</p>
          <h1>{producer.name}</h1>
          <p className="detail-subtitle">
            {producer.city} · {producer.category}
            {subcategory ? ` · ${subcategory}` : ""}
          </p>
          <div className="detail-links">
            {website ? (
              <ExternalLink href={website}>
                Sitio web
              </ExternalLink>
            ) : null}
            {maps ? (
              <ExternalLink href={maps}>
                Cómo llegar
              </ExternalLink>
            ) : null}
            {phone && phoneHref ? <a href={phoneHref}>Teléfono</a> : null}
            {email ? <a href={`mailto:${email}`}>Correo</a> : null}
            {instagram ? (
              <ExternalLink href={instagram}>
                Instagram
              </ExternalLink>
            ) : null}
            {facebook ? (
              <ExternalLink href={facebook}>
                Facebook
              </ExternalLink>
            ) : null}
          </div>
        </header>

        <section id="detail-info" className="detail-table-card">
          <h2>Información</h2>
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
