import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";

import { ACCOUNT_ROUTES, isAccountAuthConfigured } from "@/lib/accounts/config";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: `Crea un perfil de usuario o productor en ${SITE_NAME}.`,
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  if (!isAccountAuthConfigured()) {
    return (
      <main className="auth-page">
        <section className="auth-shell" aria-labelledby="account-auth-unavailable-title">
          <div className="auth-copy">
          <h1 id="account-auth-unavailable-title">Acceso a cuentas</h1>
          <p>El acceso a cuentas estará habilitado a partir del 1 de octubre.</p>
          <Link href="/" className="chisan-button">Volver al catálogo</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-copy">
          <p className="chisan-eyebrow">Únete a {SITE_NAME}</p>
          <h1>Una cuenta, dos tipos de perfil</h1>
          <p>Elige cómo quieres utilizar {SITE_NAME} después de crear tu acceso seguro.</p>
          <div className="auth-profile-list">
            <article>
              <strong>Usuario</strong>
              <span>Sigue a los productores, lee sus novedades y crea tu propia selección.</span>
            </article>
            <article>
              <strong>Productor</strong>
              <span>Verifica tu unidad productiva y propón actualizaciones de su perfil para revisión.</span>
            </article>
          </div>
        </div>
        <div className="auth-widget">
          <SignUp
            appearance={{ options: { socialButtonsVariant: "blockButton", socialButtonsPlacement: "top" } }}
            routing="path"
            path={ACCOUNT_ROUTES.signUp}
            signInUrl={ACCOUNT_ROUTES.signIn}
            fallbackRedirectUrl={ACCOUNT_ROUTES.afterAuthentication}
          />
        </div>
      </section>
    </main>
  );
}
