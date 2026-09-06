import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { completeOnboardingAction } from "@/app/(application)/cuenta/actions";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Configura tu cuenta",
  robots: { index: false, follow: false },
};

type OnboardingPageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const [account, params] = await Promise.all([
    requireCurrentAccount("/cuenta/bienvenida"),
    searchParams,
  ]);
  if (account.termsAcceptedAt) redirect("/cuenta");

  return (
    <div className="account-content account-content--narrow">
      <AccountMessage params={params} />
      <section>
        <h2>Configura tu cuenta de {SITE_NAME}</h2>
        <p>
          Cada cuenta comienza con un perfil de usuario. Si envías una solicitud de propiedad de un productor, tu perfil pasa automáticamente a ser de productor.
        </p>
        <form action={completeOnboardingAction} className="account-form">
          <label className="account-field">
            <span>Nombre visible</span>
            <input
              type="text"
              name="displayName"
              maxLength={160}
              defaultValue={account.displayName ?? ""}
              autoComplete="name"
            />
          </label>
          <div className="account-callout">
            <strong>Tipo de perfil: usuario</strong>
            <p>El tipo de perfil depende de tu actividad en la cuenta y no se elige manualmente.</p>
          </div>
          <label className="account-check">
            <input type="checkbox" name="acknowledgeReview" value="yes" required />
            <span>
              Entiendo que las solicitudes de propiedad y los cambios de perfil se revisan, y que la información enviada debe ser correcta y estar autorizada para su publicación.
            </span>
          </label>
          <button type="submit" className="account-button">
            Crear mi perfil
          </button>
        </form>
      </section>
    </div>
  );
}
