import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { findProducerById } from "@/lib/csv-catalog";

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
      <section className="detail-shell">
        <Link href="/" className="detail-back-link">
          ← Volver al buscador
        </Link>

        <header className="detail-hero">
          <p className="detail-eyebrow">Ficha de productor</p>
          <h1>{producer.name}</h1>
          <p className="detail-subtitle">
            {producer.city} · {producer.category}
            {producer.subcategory ? ` · ${producer.subcategory}` : ""}
          </p>
          <p className="detail-row">Fila {producer.id} del CSV</p>

          <div className="detail-links">
            {website ? (
              <a href={website} target="_blank" rel="noreferrer">
                Web
              </a>
            ) : null}
            {maps ? (
              <a href={maps} target="_blank" rel="noreferrer">
                Google Maps
              </a>
            ) : null}
            {email ? <a href={`mailto:${email}`}>Correo</a> : null}
            {instagram ? (
              <a href={instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            ) : null}
          </div>
        </header>

        <section className="detail-table-card">
          <h2>Campos del CSV</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Información</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(producer.fields).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
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
