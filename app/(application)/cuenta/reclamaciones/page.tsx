import { and, desc, eq } from "drizzle-orm";
import Link from "next/link";

import { withdrawProducerClaimAction } from "@/app/(application)/cuenta/actions";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { findProducersByIds } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { producerClaims, producerMemberships } from "@/lib/db/schema";
import { getProducerStatsLabels } from "@/lib/i18n/producer-stats";
import { APPLICATION_DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { readApplicationLocalePreference } from "@/lib/i18n/application-presentation.server";

const CLAIM_LABELS: Record<string, string> = {
  draft: "Draft",
  pending: "Pending review",
  needs_info: "More information needed",
  approved: "Approved",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  revoked: "Revoked",
};

type ClaimsPageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function ClaimsPage({ searchParams }: ClaimsPageProps) {
  const account = await requireCurrentAccount("/cuenta/reclamaciones");
  const database = getDatabase();
  const [claims, memberships, params, explicitLocale] = await Promise.all([
    database
      .select()
      .from(producerClaims)
      .where(eq(producerClaims.claimantUserId, account.id))
      .orderBy(desc(producerClaims.createdAt)),
    database
      .select()
      .from(producerMemberships)
      .where(
        and(
          eq(producerMemberships.userId, account.id),
          eq(producerMemberships.status, "active"),
        ),
      )
      .orderBy(desc(producerMemberships.grantedAt)),
    searchParams,
    readApplicationLocalePreference(),
  ]);
  const [claimProducers, managedProducers] = await Promise.all([
    findProducersByIds(claims.map(({ country, producerId }) => ({ country, producerId }))),
    findProducersByIds(
      memberships.map(({ country, producerId }) => ({ country, producerId })),
    ),
  ]);

  return (
    <div className="account-content">
      <AccountMessage params={params} />
      <header className="account-section-heading">
        <div>
          <h2>Producer ownership</h2>
          <p>
            Claims are verified manually; each producer has one verified owner and may have
            additional authorized editors.
          </p>
        </div>
        <Link href="/" className="account-button account-button--secondary">
          Find a producer to claim
        </Link>
      </header>

      <section>
        <h3>Managed producers</h3>
        {memberships.length === 0 ? (
          <p className="account-empty">No producer access has been approved yet.</p>
        ) : (
          <ul className="account-record-list">
            {memberships.map((membership, index) => {
              const producer = managedProducers[index];
              return (
                <li key={membership.id}>
                  <div>
                    <strong>{producer?.name ?? "Producer no longer published"}</strong>
                    <p>{membership.role === "owner" ? "Owner" : "Editor"} access</p>
                  </div>
                  {producer ? (
                    <div className="account-inline-actions">
                      <Link
                        href={buildAccountProducerHref(producer, explicitLocale)}
                        className="account-button account-button--secondary"
                      >
                        Public profile
                      </Link>
                      {membership.role === "owner" ? (
                        <Link href={`/cuenta/productores/${producer.country}/${producer.producerId}/estadisticas`} className="account-button account-button--secondary">
                          {getProducerStatsLabels(explicitLocale ?? APPLICATION_DEFAULT_LOCALE).link}
                        </Link>
                      ) : null}
                      <Link
                        href={`/cuenta/productores/${producer.country}/${producer.producerId}/editar`}
                        className="account-button"
                      >
                        Propose changes
                      </Link>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h3>Claim history</h3>
        {claims.length === 0 ? (
          <p className="account-empty">You have not submitted a producer claim.</p>
        ) : (
          <ul className="account-record-list">
            {claims.map((claim, index) => {
              const producer = claimProducers[index];
              const canWithdraw = ["draft", "pending", "needs_info"].includes(
                claim.status,
              );
              return (
                <li key={claim.id} className="account-record-list__stacked">
                  <div className="account-record-heading">
                    <div>
                      <strong>{producer?.name ?? "Producer no longer published"}</strong>
                      <p>
                        {claim.country.toUpperCase()} · #{claim.producerId}
                      </p>
                    </div>
                    <span className={`account-status account-status--${claim.status}`}>
                      {CLAIM_LABELS[claim.status] ?? claim.status}
                    </span>
                  </div>
                  {claim.decisionReason ? <p>{claim.decisionReason}</p> : null}
                  {producer || canWithdraw ? (
                    <div className="account-inline-actions">
                      {producer ? (
                        <Link
                          href={buildAccountProducerHref(producer, explicitLocale)}
                          className="account-button account-button--secondary"
                        >
                          Public profile
                        </Link>
                      ) : null}
                      {canWithdraw ? (
                        <form action={withdrawProducerClaimAction}>
                          <input type="hidden" name="claimId" value={claim.id} />
                          <button type="submit" className="account-link-button">
                            Withdraw claim
                          </button>
                        </form>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
