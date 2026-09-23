import { CheckIcon } from "@phosphor-icons/react/ssr";
import { and, desc, eq, inArray } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { onboardingStyles as styles } from "@/components/account/producer-onboarding";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import {
  claimFollowUp,
  PRODUCER_CLAIM_CODE_PATTERN,
  type ProducerClaimChannels,
} from "@/lib/accounts/producer-claim-policy";
import { getDatabase } from "@/lib/db";
import { producerClaims } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Solicitud enviada",
  robots: { index: false, follow: false },
};

export default async function ClaimSubmittedPage() {
  const account = await requireCurrentAccount("/cuenta/reclamaciones");
  const [claim] = await getDatabase()
    .select()
    .from(producerClaims)
    .where(
      and(
        eq(producerClaims.claimantUserId, account.id),
        inArray(producerClaims.status, ["pending", "needs_info"]),
      ),
    )
    .orderBy(desc(producerClaims.submittedAt))
    .limit(1);
  if (!claim) redirect("/cuenta/reclamaciones");

  const proof = claim.proof;
  const code = typeof proof.verificationCode === "string" ? proof.verificationCode : "";
  const followUp = claimFollowUp(
    claim.proofMethod,
    (proof.catalogChannels ?? {}) as Partial<ProducerClaimChannels>,
    proof.signInEmailMatchesCatalog === true,
  );
  const producerName = typeof proof.producerName === "string" ? proof.producerName : "tu ficha";

  return (
    <div className="account-content account-content--narrow">
      <div className={styles.flow}>
        <header className={styles.header}>
          <span className={styles.done}>
            <CheckIcon size={28} aria-hidden="true" />
          </span>
          <h2 className={styles.title}>Solicitud enviada</h2>
          <p className={styles.lead}>
            Hemos recibido tu solicitud para gestionar {producerName}.
          </p>
        </header>

        {followUp.needsCode && PRODUCER_CLAIM_CODE_PATTERN.test(code) ? (
          <div className={styles.codeBox}>
            <span>Tu código de verificación</span>
            <p className={styles.code}>{code}</p>
            <p className={styles.hint}>
              También lo verás en tu cuenta, junto a tu solicitud.
            </p>
          </div>
        ) : null}

        <section className={styles.section} aria-labelledby="claim-next-title">
          <h3 id="claim-next-title" className={styles.sectionTitle}>
            Qué pasa ahora
          </h3>
          <ol className={styles.nextSteps}>
            {followUp.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <div className={styles.actions}>
          <Link href="/cuenta/reclamaciones" className="chisan-button chisan-button--primary">
            Ver mi solicitud
          </Link>
          <Link href="/" className="chisan-button">
            Seguir explorando
          </Link>
        </div>
      </div>
    </div>
  );
}
