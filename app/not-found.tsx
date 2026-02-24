import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f0e8] p-6">
      <div className="max-w-md rounded-2xl border border-stone-200 bg-[#fffdf7] p-8 text-center shadow-sm">
        <h1 className="font-serif text-3xl font-semibold text-stone-900">No encontrado</h1>
        <p className="mt-3 text-sm text-stone-600">
          La página solicitada no existe o no está disponible.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Volver al mapa
        </Link>
      </div>
    </main>
  );
}
