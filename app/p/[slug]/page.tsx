import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DetailDesktopNav } from "@/components/detail-desktop-nav";
import {
  buildCatalogHref,
  buildProducerHref,
  buildProducerPathSegment,
  readQueryParam,
} from "@/lib/catalog-navigation";
import {
  CATALOG_UNIT,
  findProducerBySlug,
  listCategories,
  normalizeAreaSlug,
} from "@/lib/csv-catalog";
import { getFieldLabel } from "@/lib/field-labels";

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
  return phone ? `tel:${phone}` : "";
}

function formatFieldValue(key: string, value: string): string {
  if (!value) {
    return "—";
  }

  return key.toLocaleLowerCase() === "categorias adicionales"
    ? value.split("|").join(", ")
    : value;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const area = normalizeAreaSlug(readQueryParam(query, "area"));
  if (!area) {
    return {
      title: `Select an ${CATALOG_UNIT.one}`,
      description: `The profile needs an ${CATALOG_UNIT.one} to resolve the right CSV.`,
    };
  }

  const producer = await findProducerBySlug(slug, area);

  if (!producer) {
    return {
      title: "Producer not found",
      description: "That producer is not in the CSV.",
    };
  }

  return {
    title: producer.name,
    description: `${producer.city} · ${producer.categories.join(" · ")}`,
  };
}

export default async function ProducerPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const area = normalizeAreaSlug(readQueryParam(query, "area"));
  if (!area) {
    redirect("/");
  }

  const [producer, categories] = await Promise.all([
    findProducerBySlug(slug, area),
    listCategories(area),
  ]);

  if (!producer) {
    notFound();
  }

  const municipality = readQueryParam(query, "municipio");
  const category = readQueryParam(query, "category");
  const highlight = readQueryParam(query, "highlight");
  const lat = readQueryParam(query, "lat");
  const lon = readQueryParam(query, "lon");
  const canonicalSegment = buildProducerPathSegment(producer.slug);
  const backHref = buildCatalogHref({ area, category, highlight: producer.slug });

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
          area,
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
          ← Back to the map
        </Link>
      </div>
      <section className="detail-shell">
        <DetailDesktopNav categories={categories} area={area} />
        <Link href={backHref} className="detail-back-link detail-back-link--desktop">
          ← Back to the map
        </Link>

        <header id="detail-hero" className="detail-hero">
          <div className="detail-hero-copy">
            <p className="detail-eyebrow">Producer profile</p>
            <h1>{producer.name}</h1>
            <p className="detail-subtitle">
              {producer.city} · {producer.categories.join(" · ")}
              {subcategory ? ` · ${subcategory}` : ""}
            </p>
            <div className="detail-links">
              {website ? (
                <a href={website} target="_blank" rel="noreferrer">
                  Website
                </a>
              ) : null}
              {maps ? (
                <a href={maps} target="_blank" rel="noreferrer">
                  Google Maps
                </a>
              ) : null}
              {phone && phoneHref ? <a href={phoneHref}>Phone</a> : null}
              {email ? <a href={`mailto:${email}`}>Email</a> : null}
              {instagram ? (
                <a href={instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              ) : null}
              {facebook ? (
                <a href={facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              ) : null}
            </div>
          </div>
          <figure className="detail-hero-media">
            <Image
              src={producer.imageSrc}
              alt={`Image of ${producer.name}`}
              width={640}
              height={480}
              sizes="(max-width: 980px) calc(100vw - 2.75rem), 330px"
              priority
              className="detail-hero-image"
            />
          </figure>
        </header>

        <section id="detail-info" className="detail-table-card">
          <h2>Details</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(producer.fields).map(([key, value]) => (
                  <tr key={key}>
                    <td>{getFieldLabel(key)}</td>
                    <td>{formatFieldValue(key, value)}</td>
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
