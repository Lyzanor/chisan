import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { onboardingStyles as styles } from "@/components/account/producer-onboarding";
import { completeOnboardingAction } from "@/app/(application)/cuenta/actions";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import {
  isProducerOnboardingPath,
  onboardingReturnPath,
} from "@/lib/accounts/producer-claim-policy";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Configura tu cuenta",
  robots: { index: false, follow: false },
};

type OnboardingPageProps = {
  searchParams: Promise<
    AccountMessageParams & {
      siguiente?: string | string[];
      perfil?: string | string[];
    }
  >;
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const [account, params] = await Promise.all([
    requireCurrentAccount("/cuenta/bienvenida"),
    searchParams,
  ]);
  const next = onboardingReturnPath(first(params.siguiente));
  if (account.termsAcceptedAt) redirect(next || "/cuenta");

  const producerIntent =
    first(params.perfil) === "productor" || isProducerOnboardingPath(next);

  return (
    <div className="account-content account-content--narrow">
      <AccountMessage params={params} />
      <form action={completeOnboardingAction} className={styles.flow}>
        <input type="hidden" name="siguiente" value={next} />
        <header className={styles.header}>
          <p className="catalog-kicker">Te damos la bienvenida</p>
          <h2 className={styles.title}>Configura tu cuenta de {SITE_NAME}</h2>
          <p className={styles.lead}>Solo dos preguntas.</p>
        </header>

        <label className={styles.field}>
          <span>¿Cómo quieres que te llamemos?</span>
          <input
            type="text"
            name="displayName"
            maxLength={160}
            defaultValue={account.displayName ?? ""}
            autoComplete="name"
            enterKeyHint="next"
          />
          <small>Es tu nombre visible: aparece cuando sigues a un productor.</small>
        </label>

        <fieldset className={styles.choices}>
          <legend className={styles.sectionTitle}>¿Qué te trae a {SITE_NAME}?</legend>
          <label className={styles.choice}>
            <input
              type="radio"
              name="intent"
              value="user"
              defaultChecked={!producerIntent}
              required
            />
            <span className={styles.choiceText}>
              <strong>Descubrir productores</strong>
              <span>Sigue a quien te interesa, lee sus novedades y crea tu selección.</span>
            </span>
          </label>
          <label className={styles.choice}>
            <input
              type="radio"
              name="intent"
              value="producer"
              defaultChecked={producerIntent}
            />
            <span className={styles.choiceText}>
              <strong>Tengo un negocio productor</strong>
              <span>Encuentra tu ficha y verifica que es tuya para mantenerla al día. Es gratis.</span>
            </span>
          </label>
        </fieldset>

        <label className={styles.check}>
          <input type="checkbox" name="acknowledgeReview" value="yes" required />
          <span>
            Entiendo que seguir a un productor es público y que las solicitudes y los cambios de fichas se revisan antes de publicarse.
          </span>
        </label>

        <div className={styles.actions}>
          <button type="submit" className="account-button">
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}
