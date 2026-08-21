import { asc, inArray } from "drizzle-orm";

import { reviewProducerChangeAction } from "@/app/admin/actions";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { requireStaffAccount } from "@/lib/accounts/auth";
import { findProducersByIds } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { producerChangeRequests } from "@/lib/db/schema";

type AdminChangesPageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function AdminChangesPage({ searchParams }: AdminChangesPageProps) {
  await requireStaffAccount();

  const [queue, params] = await Promise.all([
    getDatabase()
      .select()
      .from(producerChangeRequests)
      .where(inArray(producerChangeRequests.status, ["submitted", "needs_changes"]))
      .orderBy(asc(producerChangeRequests.submittedAt)),
    searchParams,
  ]);
  const producers = await findProducersByIds(
    queue.map(({ country, producerId }) => ({ country, producerId })),
  );

  return (
    <div className="account-content">
      <AccountMessage params={params} />
      <header className="account-section-heading">
        <div>
          <h2>Producer profile changes</h2>
          <p>Approval authorizes materialization; it does not publish a database overlay.</p>
        </div>
      </header>

      {queue.length === 0 ? (
        <p className="account-empty">The profile-change queue is empty.</p>
      ) : (
        <ul className="account-review-list">
          {queue.map((change, index) => {
            const producer = producers[index];
            return (
              <li key={change.id}>
                <div className="account-record-heading">
                  <div>
                    <strong>{producer?.name ?? "Producer no longer published"}</strong>
                    <p>
                      {change.country.toUpperCase()} · #{change.producerId}
                    </p>
                  </div>
                  <span className="account-status account-status--submitted">Pending</span>
                </div>
                <dl className="account-diff-list account-diff-list--review">
                  {Object.entries(change.patch).map(([field, nextValue]) => (
                    <div key={field}>
                      <dt>{field}</dt>
                      <dd>
                        <del>{change.baseSnapshot[field] || "(empty)"}</del>
                        <ins>{nextValue || "(empty)"}</ins>
                      </dd>
                    </div>
                  ))}
                </dl>
                {change.authorNote ? (
                  <div className="account-review-statement">
                    <strong>Producer context/source</strong>
                    <p>{change.authorNote}</p>
                  </div>
                ) : null}
                <form action={reviewProducerChangeAction} className="account-form">
                  <input type="hidden" name="changeId" value={change.id} />
                  <label className="account-field">
                    <span>Editorial review note</span>
                    <textarea name="note" maxLength={4_000} rows={4} />
                  </label>
                  <div className="account-inline-actions">
                    <button className="account-button" name="decision" value="approved">
                      Approve for CSV
                    </button>
                    <button
                      className="account-button account-button--danger"
                      name="decision"
                      value="rejected"
                    >
                      Reject
                    </button>
                  </div>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
