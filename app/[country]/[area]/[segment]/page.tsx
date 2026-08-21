import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { DetailDesktopNav } from "@/components/detail-desktop-nav";
import { ProducerAccountActions } from "@/components/account/producer-account-actions";
import {
  buildCatalogHref,
  buildProducerHref,
  buildProducerPathSegment,
  readQueryParam,
} from "@/lib/catalog-navigation";
import {
  findCountry,
  findProducerBySlug,
  listCategories,
  normalizeAreaSlug,
} from "@/lib/csv-catalog";
import { getFieldLabel } from "@/lib/field-labels";

type ProducerPageProps = {
  params: Promise<{ country: string; area: string; segment: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

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

export async function generateMetadata({ params }: ProducerPageProps): Promise<Metadata> {
  const { country: countrySlug, area: rawArea, segment } = await params;
  const country = findCountry(countrySlug);
  const area = country ? normalizeAreaSlug(country.slug, rawArea) : "";
  const producer = country && area
    ? await findProducerBySlug(segment, country.slug, area)
    : null;

  if (!producer || !country) {
    return {
      title: "Producer not found",
      description: "That producer is not in the CSV catalog.",
    };
  }

  return {
    title: producer.name,
    description: `${producer.city} · ${producer.categories.join(" · ")}`,
    alternates: {
      canonical: buildProducerHref(producer, { country: country.slug, area }),
    },
  };
}

export default async function ProducerPage({ params, searchParams }: ProducerPageProps) {
  const [{ country: rawCountry, area: rawArea, segment }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const country = findCountry(rawCountry);
  const area = country ? normalizeAreaSlug(country.slug, rawArea) : "";

  if (!country || !area) {
    notFound();
  }

  const [producer, categories] = await Promise.all([
    findProducerBySlug(segment, country.slug, area),
    listCategories(country.slug, area),
  ]);

  if (!producer) {
    notFound();
  }

  const municipality =
    readQueryParam(query, "municipality") || readQueryParam(query, "municipio");
  const category = readQueryParam(query, "category");
  const highlight = readQueryParam(query, "highlight");
  const lat = readQueryParam(query, "lat");
  const lon = readQueryParam(query, "lon");
  const canonicalSegment = buildProducerPathSegment(producer.slug);
  const backHref = buildCatalogHref({
    country: country.slug,
    area,
    category,
    highlight: producer.slug,
  });

  if (
    rawCountry !== country.slug ||
    rawArea !== area ||
    segment !== canonicalSegment
  ) {
    permanentRedirect(
      buildProducerHref(producer, {
        country: country.slug,
        area,
        municipality,
        category,
        highlight: highlight ? producer.slug : undefined,
        lat,
        lon,
      }),
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
  const publicFields = Object.entries(producer.fields);

  return (
    <main className="detail-page">
      <div className="detail-mobile-bar">
        <Link href={backHref} className="detail-back-link">
          ← Back to the map
        </Link>
      </div>
      <section className="detail-shell">
        <DetailDesktopNav categories={categories} country={country.slug} area={area} />
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
            <ProducerAccountActions
              country={country.slug}
              producerId={producer.producerId}
              returnTo={buildProducerHref(producer, { country: country.slug, area })}
            />
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
                {publicFields.map(([key, value]) => (
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
