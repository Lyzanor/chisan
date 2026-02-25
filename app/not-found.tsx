import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="panel">
        <h1>No encontrado</h1>
        <p>La fila o página que buscas no existe.</p>
        <Link href="/" className="back-link">
          ← Volver al buscador
        </Link>
      </section>
    </main>
  );
}
