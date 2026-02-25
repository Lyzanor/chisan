import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { findProducerById } from "@/lib/csv-catalog";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

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

  return (
    <main className="page-shell">
      <section className="panel">
        <Link href="/" className="back-link">
          ← Volver al buscador
        </Link>

        <h1>{producer.name}</h1>
        <p>
          Fila {producer.id} del CSV · {producer.city}
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Columna CSV</th>
                <th>Valor</th>
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
    </main>
  );
}
