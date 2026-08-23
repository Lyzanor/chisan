import { desc, eq } from "drizzle-orm";
import Link from "next/link";

import { withdrawProducerChangeAction } from "@/app/cuenta/actions";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getProducerChangeStatusDefinition } from "@/lib/accounts/producer-change-workflow";
import { findProducersByIds } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { producerChangeRequests } from "@/lib/db/schema";

type ChangesPageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function ChangesPage({ searchParams }: ChangesPageProps) {
  const account = await requireCurrentAccount("/cuenta/cambios");
  const [changes, params] = await Promise.all([
    getDatabase()
      .select()
      .from(producerChangeRequests)
      .where(eq(producerChangeRequests.authorUserId, account.id))
      .orderBy(desc(producerChangeRequests.createdAt)),
    searchParams,
  ]);
  const producers = await findProducersByIds(
    changes.map(({ country, producerId }) => ({ country, producerId })),
  );

  return (
    <div className="account-content">
      <AccountMessage params={params} />
      <header className="account-section-heading">
        <div>
          <h2>Producer profile changes</h2>
          <p>Every proposal is reviewed and materialized into the canonical CSV through Git.</p>
        </div>
      </header>

      {changes.length === 0 ? (
        <p className="account-empty">No profile changes have been submitted.</p>
      ) : (
        <ul className="account-record-list">
          {changes.map((change, index) => {
            const producer = producers[index];
            return (
              <li key={change.id} className="account-record-list__stacked">
                <div className="account-record-heading">
                  <div>
                    <strong>{producer?.name ?? "Producer no longer published"}</strong>
                    <p>
                      {change.country.toUpperCase()} · #{change.producerId}
                    </p>
                  </div>
                  <span className={`account-status account-status--${change.status}`}>
                    {getProducerChangeStatusDefinition(change.status).label}
                  </span>
                </div>
                <dl className="account-diff-list">
                  {Object.entries(change.patch).map(([field, value]) => (
                    <div key={field}>
                      <dt>{field}</dt>
                      <dd>{value || "(remove current value)"}</dd>
                    </div>
                  ))}
                </dl>
                {change.decisionNote ? <p>{change.decisionNote}</p> : null}
                {change.failureReason ? (
                  <p className="account-message account-message--error">{change.failureReason}</p>
                ) : null}
                <div className="account-inline-actions">
                  {producer && ["conflict", "rejected", "withdrawn", "failed"].includes(change.status) ? (
                    <Link
                      href={`/cuenta/productores/${producer.country}/${producer.producerId}/editar`}
                      className="account-button account-button--secondary"
                    >
                      Start a new proposal
                    </Link>
                  ) : null}
                  {["draft", "submitted", "needs_changes"].includes(change.status) ? (
                    <form action={withdrawProducerChangeAction}>
                      <input type="hidden" name="changeId" value={change.id} />
                      <button type="submit" className="account-link-button">
                        Withdraw request
                      </button>
                    </form>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
