import Link from "next/link";
import type { Metadata } from "next";

import { requireStaffAccount } from "@/lib/accounts/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const reviewer = await requireStaffAccount();

  return (
    <main className="page-shell account-page">
      <section className="panel account-shell">
        <header className="account-header">
          <div>
            <p className="catalog-kicker">KM0 review</p>
            <h1>Editorial access</h1>
            <p>{reviewer.displayName || reviewer.email || "Authorized reviewer"}</p>
          </div>
        </header>
        <nav className="account-nav" aria-label="Review sections">
          <Link href="/admin">Queue</Link>
          <Link href="/admin/reclamaciones">Ownership claims</Link>
          <Link href="/admin/cambios">Profile changes</Link>
          <Link href="/cuenta">My account</Link>
        </nav>
        {children}
      </section>
    </main>
  );
}
