import { and, eq, inArray } from "drizzle-orm";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { ProducerClaimWizard } from "@/components/account/producer-claim-wizard";
import { ProducerSearchStep } from "@/components/account/producer-claim-search-step";
import { onboardingStyles as styles } from "@/components/account/producer-onboarding";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import {
  currentVerifiedEmailAddresses,
  requireCurrentAccount,
} from "@/lib/accounts/auth";
import {
  methodChannelAvailable,
  OPEN_PRODUCER_CLAIM_STATUSES,
  parseClaimWizardStep,
  PRODUCER_CLAIM_METHODS,
  PRODUCER_ONBOARDING_PATH,
  producerClaimChannels,
  verifiedEmailMatchesCatalog,
} from "@/lib/accounts/producer-claim-policy";
import { findArea, findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { producerClaims, producerMemberships } from "@/lib/db/schema";
import { readApplicationLocalePreference } from "@/lib/i18n/application-presentation.server";
import { instagramConfiguration } from "@/lib/instagram/verification";
import { currentInstagramProof } from "@/lib/instagram/verification.server";

export const metadata: Metadata = {
  title: "Verificar productor",
  robots: { index: false, follow: false },
};

type NewClaimPageProps = {
  searchParams: Promise<
    AccountMessageParams & {
      country?: string | string[];
      producerId?: string | string[];
      q?: string | string[];
      paso?: string | string[];
    }
  >;
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function StatusScreen({
  params,
  kicker,
  title,
  copy,
  actions,
}: {
  params: AccountMessageParams;
  kicker: string;
  title: string;
  copy: string;
  actions: ReactNode;
}) {
  return (
    <div className="account-content account-content--narrow">
      <div className={styles.flow}>
        <AccountMessage params={params} />
        <header className={styles.header}>
          <p className="chisan-eyebrow">{kicker}</p>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.lead}>{copy}</p>
        </header>
        <div className={styles.actions}>{actions}</div>
      </div>
    </div>
  );
}

export default async function NewClaimPage({ searchParams }: NewClaimPageProps) {
  const params = await searchParams;
  const country = first(params.country).trim().toLowerCase();
  const producerId = Number(first(params.producerId));
  const validProducerKey =
    /^[a-z]{2}$/.test(country) && Number.isSafeInteger(producerId) && producerId > 0;
  const resume = validProducerKey
    ? `${PRODUCER_ONBOARDING_PATH}?country=${country}&producerId=${producerId}`
    : PRODUCER_ONBOARDING_PATH;
  const [account, explicitLocale] = await Promise.all([
    requireCurrentAccount(resume),
    readApplicationLocalePreference(),
  ]);
  if (!account.termsAcceptedAt) {
    redirect(`/cuenta/bienvenida?siguiente=${encodeURIComponent(resume)}`);
  }

  const database = getDatabase();
  const [producer, ownerRows, accountOwnerRows, accountClaimRows] = await Promise.all([
    validProducerKey ? findProducerById(country, producerId) : Promise.resolve(null),
    validProducerKey
      ? database
          .select({ userId: producerMemberships.userId })
          .from(producerMemberships)
          .where(
            and(
              eq(producerMemberships.country, country),
              eq(producerMemberships.producerId, producerId),
              eq(producerMemberships.role, "owner"),
              eq(producerMemberships.status, "active"),
            ),
          )
          .limit(1)
      : Promise.resolve([]),
    database
      .select({
        country: producerMemberships.country,
        producerId: producerMemberships.producerId,
      })
      .from(producerMemberships)
      .where(
        and(
          eq(producerMemberships.userId, account.id),
          eq(producerMemberships.role, "owner"),
          eq(producerMemberships.status, "active"),
        ),
      )
      .limit(1),
    database
      .select({
        country: producerClaims.country,
        producerId: producerClaims.producerId,
      })
      .from(producerClaims)
      .where(
        and(
          eq(producerClaims.claimantUserId, account.id),
          inArray(producerClaims.status, [...OPEN_PRODUCER_CLAIM_STATUSES]),
        ),
      )
      .limit(1),
  ]);
  const activeOwner = ownerRows[0];
  const accountOwner = accountOwnerRows[0];
  const accountClaim = accountClaimRows[0];

  if (producer && activeOwner) {
    const currentAccountOwnsProducer = activeOwner.userId === account.id;
    return (
      <StatusScreen
        params={params}
        kicker="Titularidad verificada"
        title={
          currentAccountOwnsProducer
            ? `Ya gestionas ${producer.name}`
            : `${producer.name} ya tiene un titular verificado`
        }
        copy={
          currentAccountOwnsProducer
            ? "Utiliza tu área de productor para gestionar esta ficha."
            : "Una ficha con un titular confirmado no se puede volver a verificar. Si crees que es un error, escríbenos."
        }
        actions={
          <>
            {currentAccountOwnsProducer ? (
              <Link href="/cuenta/reclamaciones" className="chisan-button chisan-button--primary">
                Ir a mi área de productor
              </Link>
            ) : (
              <Link href={PRODUCER_ONBOARDING_PATH} className="chisan-button chisan-button--primary">
                Buscar otra ficha
              </Link>
            )}
            <Link
              href={buildAccountProducerHref(producer, explicitLocale)}
              className="chisan-button"
            >
              Ver la ficha
            </Link>
          </>
        }
      />
    );
  }

  if (accountOwner || accountClaim) {
    const claimIsForThisProducer =
      accountClaim?.country === country && accountClaim.producerId === producerId;
    return (
      <StatusScreen
        params={params}
        kicker="Solicitud de propiedad"
        title={
          accountOwner
            ? "Ya tienes una ficha verificada"
            : claimIsForThisProducer && producer
              ? `Ya has solicitado verificar ${producer.name}`
              : "Ya tienes una solicitud en revisión"
        }
        copy={
          accountOwner
            ? "Cada cuenta puede ser titular de una sola ficha. Puedes seguir y recomendar a otros productores."
            : "Espera a que se resuelva o retírala antes de verificar otra ficha."
        }
        actions={
          <Link href="/cuenta/reclamaciones" className="chisan-button chisan-button--primary">
            Ver mi solicitud
          </Link>
        }
      />
    );
  }

  const verifiedEmails = await currentVerifiedEmailAddresses();

  if (!producer) {
    return (
      <div className="account-content account-content--narrow">
        <ProducerSearchStep
          query={first(params.q).trim().slice(0, 160)}
          verifiedEmails={verifiedEmails}
          params={
            validProducerKey
              ? { error: "Esa ficha ya no está en el catálogo. Búscala de nuevo." }
              : params
          }
        />
      </div>
    );
  }

  const instagramProof = await currentInstagramProof(account.id, country, producerId);
  const channels = producerClaimChannels(producer.fields);
  const instagramMatches = Boolean(
    instagramProof && channels.instagram === instagramProof.username.toLowerCase(),
  );
  const emailMatches = verifiedEmailMatchesCatalog(channels.email, verifiedEmails);
  const instagramAvailable = instagramMatches || Boolean(instagramConfiguration());
  const methods = PRODUCER_CLAIM_METHODS.filter(
    (method) =>
      methodChannelAvailable(method, channels) &&
      (method !== "instagram" || instagramAvailable),
  );
  const defaultMethod = instagramMatches
    ? "instagram"
    : emailMatches
      ? "catalog_email"
      : methods[0];
  const initialStep =
    parseClaimWizardStep(first(params.paso)) ?? (instagramProof ? "verificacion" : "ficha");

  return (
    <div className="account-content account-content--narrow">
      <ProducerClaimWizard
        producer={{
          country: producer.country,
          producerId: producer.producerId,
          name: producer.name,
          municipality: producer.city,
          area: findArea(producer.country, producer.area)?.label ?? producer.area,
          imageSrc: producer.imageSrc === "/productores/generica.webp" ? null : producer.imageSrc,
          publicHref: buildAccountProducerHref(producer, explicitLocale),
        }}
        channels={channels}
        methods={methods}
        defaultMethod={defaultMethod}
        emailMatches={emailMatches}
        instagramMatches={instagramMatches}
        searchHref={PRODUCER_ONBOARDING_PATH}
        initialStep={initialStep}
        message={{ error: params.error, notice: params.notice }}
      />
    </div>
  );
}
