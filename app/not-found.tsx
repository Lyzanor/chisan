import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="panel">
        <h1>Página no encontrada</h1>
        <p>El productor o página que buscas no existe.</p>
        <Link href="/" className="back-link">
          ← Volver al buscador
        </Link>
      </section>
    </main>
  );
}
