import Link from "next/link";
import { NavigationLink } from "@/components/navigation-link";
import type { Metadata } from "next";

import { hasStaffAccess, requireCurrentAccount } from "@/lib/accounts/auth";
import { getAccountSystemConfiguration } from "@/lib/accounts/config";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const configuration = getAccountSystemConfiguration();
  if (!configuration.ready) {
    return (
      <main className="page-shell account-page">
        <section className="panel account-setup-panel">
          <p className="catalog-kicker">{SITE_NAME} accounts</p>
          <h1>Account system not configured</h1>
          <p>
            The public producer catalog remains available. This environment still needs Clerk
            credentials and a PostgreSQL connection before registration can be used.
          </p>
          <Link href="/" className="account-button account-button--secondary">
            Back to the catalog
          </Link>
        </section>
      </main>
    );
  }

  const account = await requireCurrentAccount("/cuenta");
  const staff = await hasStaffAccess(account.id);

  return (
    <main className="page-shell account-page">
      <section className="panel account-shell">
        <header className="account-header">
          <div>
            <p className="catalog-kicker">{SITE_NAME} account</p>
            <h1>{account.displayName || "Your account"}</h1>
            <p>{account.email || "Authenticated account"}</p>
          </div>
          <span className="account-profile-badge">
            {account.profileKind === "producer" ? "Producer profile" : "User profile"}
          </span>
        </header>
        <nav className="account-nav" aria-label="Account sections">
          <NavigationLink href="/cuenta" activePath="/cuenta">Overview</NavigationLink>
          <NavigationLink href="/cuenta/perfil" activePath="/cuenta/perfil">Profile</NavigationLink>
          <NavigationLink href="/cuenta/favoritos" activePath="/cuenta/favoritos">Favorites</NavigationLink>
          <NavigationLink href="/cuenta/seleccion" activePath="/cuenta/seleccion">Selection QR</NavigationLink>
          <NavigationLink href="/cuenta/reclamaciones" activePath="/cuenta/reclamaciones">Claims</NavigationLink>
          <NavigationLink href="/cuenta/cambios" activePath="/cuenta/cambios">Profile changes</NavigationLink>
          {staff ? <Link href="/admin">Review</Link> : null}
        </nav>
        {children}
      </section>
    </main>
  );
}
