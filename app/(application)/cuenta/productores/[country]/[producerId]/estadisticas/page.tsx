import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProducerStatistics } from "@/components/account/producer-statistics";
import {
  hasProducerOwnerAccess,
  requireCurrentAccount,
} from "@/lib/accounts/auth";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import { hasActiveProducerPremiumEntitlement } from "@/lib/accounts/producer-premium-entitlements";
import { findProducerById, findPublishedCountry } from "@/lib/csv-catalog";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import { getProducerStatsLabels } from "@/lib/i18n/producer-stats";
import { isProducerStatsEnabled } from "@/lib/producer-stats/policy";
import { getProducerStatsService } from "@/lib/producer-stats/service";

export const metadata: Metadata = {
  title: "Estadísticas del perfil",
  robots: { index: false, follow: false },
};

export default async function ProducerStatisticsPage({
  params,
}: {
  params: Promise<{ country: string; producerId: string }>;
}) {
  const { country, producerId: rawId } = await params;
  const producerId = Number(rawId);
  if (
    !/^[a-z]{2}$/.test(country) ||
    !/^[1-9][0-9]*$/.test(rawId) ||
    !Number.isSafeInteger(producerId) ||
    !findPublishedCountry(country)
  )
    notFound();
  const path = `/cuenta/productores/${country}/${producerId}/estadisticas`;
  const [account, presentation] = await Promise.all([
    requireCurrentAccount(path),
    loadApplicationPresentation(),
  ]);
  if (!(await hasProducerOwnerAccess(account.id, country, producerId)))
    notFound();
  const producer = await findProducerById(country, producerId);
  if (!producer) notFound();
  const labels = getProducerStatsLabels(presentation.locale);
  const premium = await hasActiveProducerPremiumEntitlement(
    country,
    producerId,
  );
  let stats = null;
  let message = !premium
    ? labels.locked
    : !isProducerStatsEnabled()
      ? labels.disabled
      : null;
  if (!message) {
    try {
      stats = await getProducerStatsService().read({
        country,
        producerId,
        userId: account.id,
      });
    } catch {
      console.error("Las estadísticas del productor no están disponibles temporalmente.");
      message = labels.unavailable;
    }
    // The query rechecks owner, account and entitlement in the same statement.
    if (!stats && !message) notFound();
  }
  return (
    <div className="account-content">
      <header className="account-section-heading">
        <div>
          <p className="catalog-kicker">{labels.title}</p>
          <h2>{producer.name}</h2>
          <p>{labels.description}</p>
        </div>
        <div className="account-inline-actions">
          <Link
            href={`/cuenta/productores/${country}/${producerId}/editar`}
            className="account-button account-button--secondary"
          >
            {labels.back}
          </Link>
          <Link
            href={buildAccountProducerHref(
              producer,
              presentation.explicitLocale,
            )}
            className="account-button account-button--secondary"
          >
            {labels.publicProfile}
          </Link>
        </div>
      </header>
      {stats ? (
        <ProducerStatistics stats={stats} locale={presentation.locale} />
      ) : (
        <div className="account-callout">
          <p>{message}</p>
          {message === labels.unavailable ? (
            <Link
              href={path}
              className="account-button account-button--secondary"
            >
              {labels.retry}
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
