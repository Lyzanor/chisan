import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";

import { ACCOUNT_ROUTES, isAccountAuthConfigured } from "@/lib/accounts/config";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: `Inicia sesión en tu cuenta de ${SITE_NAME}.`,
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  if (!isAccountAuthConfigured()) {
    return (
      <main className="auth-page">
        <section className="auth-shell" aria-labelledby="account-auth-unavailable-title">
          <div className="auth-copy">
          <h1 id="account-auth-unavailable-title">El acceso no está disponible</h1>
          <p>
            El acceso a cuentas no está habilitado. Puedes consultar el catálogo de productores sin iniciar sesión.
          </p>
          <Link href="/" className="account-button account-button--secondary">Volver al catálogo</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-copy">
          <p className="catalog-kicker">Cuenta de {SITE_NAME}</p>
          <h1>Te damos la bienvenida</h1>
          <p>Inicia sesión para gestionar favoritos, solicitudes de propiedad y cambios en los perfiles de productores.</p>
        </div>
        <div className="auth-widget">
          <SignIn
            routing="path"
            path={ACCOUNT_ROUTES.signIn}
            signUpUrl={ACCOUNT_ROUTES.signUp}
            fallbackRedirectUrl={ACCOUNT_ROUTES.afterAuthentication}
          />
        </div>
      </section>
    </main>
  );
}
