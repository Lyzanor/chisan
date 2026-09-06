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
          <p className="catalog-kicker">Cuentas de {SITE_NAME}</p>
          <h1>Las cuentas no están disponibles</h1>
          <p>
            Puedes seguir consultando el catálogo público de productores. El registro de cuentas todavía no está habilitado.
          </p>
          <Link href="/" className="account-button account-button--secondary">
            Volver al catálogo
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
            <p className="catalog-kicker">Cuenta de {SITE_NAME}</p>
            <h1>{account.displayName || "Tu cuenta"}</h1>
            <p>{account.email || "Cuenta autenticada"}</p>
          </div>
          <span className="account-profile-badge">
            {account.profileKind === "producer" ? "Perfil de productor" : "Perfil de usuario"}
          </span>
        </header>
        <nav className="account-nav" aria-label="Secciones de la cuenta">
          <NavigationLink href="/cuenta" activePath="/cuenta">Resumen</NavigationLink>
          <NavigationLink href="/cuenta/perfil" activePath="/cuenta/perfil">Perfil</NavigationLink>
          <NavigationLink href="/cuenta/favoritos" activePath="/cuenta/favoritos">Favoritos</NavigationLink>
          <NavigationLink href="/cuenta/seleccion" activePath="/cuenta/seleccion">QR de selección</NavigationLink>
          <NavigationLink href="/cuenta/reclamaciones" activePath="/cuenta/reclamaciones">Solicitudes de propiedad</NavigationLink>
          <NavigationLink href="/cuenta/cambios" activePath="/cuenta/cambios">Cambios de perfil</NavigationLink>
          {staff ? <Link href="/admin">Revisión</Link> : null}
        </nav>
        {children}
      </section>
    </main>
  );
}
