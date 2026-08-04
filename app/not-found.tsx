import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="panel">
        <h1>Page not found</h1>
        <p>That producer or page does not exist.</p>
        <Link href="/" className="back-link">
          ← Back to the map
        </Link>
      </section>
    </main>
  );
}
