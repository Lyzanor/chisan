import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { findProducerById } from "@/lib/csv-catalog";
import { getFieldLabel } from "@/lib/field-labels";
import { ExternalLink } from "@/components/external-link";

type PageProps = {
  params: Promise<{ id: string }>;
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

export default async function ProducerPage({ params }: PageProps) {
  const { id } = await params;
  const producer = await findProducerById(id);

  if (!producer) {
    notFound();
  }

  const website = getFieldValue(producer.fields, "web");
  const maps = getFieldValue(producer.fields, "Google Maps");
  const email = getFieldValue(producer.fields, "correo");
  const instagram = getFieldValue(producer.fields, "Instagram");

  return (
    <main className="detail-page">
      <div className="detail-mobile-bar">
        <Link href="/" className="detail-back-link">
          ← Volver al buscador
        </Link>
      </div>
      <section className="detail-shell">
        <Link href="/" className="detail-back-link detail-back-link--desktop">
          ← Volver al buscador
        </Link>

        <header className="detail-hero">
          <p className="detail-eyebrow">Ficha de productor</p>
          <h1>{producer.name}</h1>
          <p className="detail-subtitle">
            {producer.city} · {producer.category}
            {producer.subcategory ? ` · ${producer.subcategory}` : ""}
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
