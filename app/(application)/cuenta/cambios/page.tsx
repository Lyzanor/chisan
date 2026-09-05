import { ProducerProductChanges } from "@/components/account/producer-product-changes";
import { getProducerEditorLabels, producerProposalStatusLabel, producerEditorMessage } from "@/lib/i18n/producer-editor";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";

import { withdrawProducerChangeAction } from "@/app/(application)/cuenta/actions";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getProducerChangeStatusDefinition } from "@/lib/accounts/producer-change-workflow";
import { findProducersByIds } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { producerChangeRequests } from "@/lib/db/schema";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import { presentProducerField } from "@/lib/i18n/producer-fields";

type ChangesPageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function ChangesPage({ searchParams }: ChangesPageProps) {
  const account = await requireCurrentAccount("/cuenta/cambios");
  const [changes, params, presentation] = await Promise.all([
    getDatabase()
      .select()
      .from(producerChangeRequests)
      .where(eq(producerChangeRequests.authorUserId, account.id))
      .orderBy(desc(producerChangeRequests.createdAt)),
    searchParams,
    loadApplicationPresentation(),
  ]);
  const producers = await findProducersByIds(
    changes.map(({ country, producerId }) => ({ country, producerId })),
  );

  const labels = getProducerEditorLabels(presentation.locale);
  return (
    <div className="account-content">
      <AccountMessage params={{ ...params, notice: typeof params.notice === "string" ? producerEditorMessage(presentation.locale, params.notice) : params.notice }} />
      <header className="account-section-heading">
        <div>
          <h2>{labels.changes}</h2>
          <p>{labels.changesHelp}</p>
        </div>
      </header>

      {changes.length === 0 ? (
        <p className="account-empty">{labels.noChanges}</p>
      ) : (
        <ul className="account-record-list">
          {changes.map((change, index) => {
            const producer = producers[index];
            return (
              <li key={change.id} className="account-record-list__stacked">
                <div className="account-record-heading">
                  <div>
                    <strong>{producer?.name ?? labels.unavailable}</strong>
                    <p>
                      {change.country.toUpperCase()} · #{change.producerId}
                    </p>
                  </div>
                  <span className={`account-status account-status--${change.status}`}>
                    {producerProposalStatusLabel(presentation.locale, change.status, getProducerChangeStatusDefinition(change.status).label)}
                  </span>
                </div>
                <dl className="account-diff-list">
                  {Object.entries(change.patch).map(([field, value]) => {
                    const presented = presentProducerField(
                      field,
                      value,
                      presentation.locale,
                      presentation.messages,
                    );
                    return (
                      <div key={presented.key}>
                        <dt>{presented.label}</dt>
                        <dd>{value ? presented.displayValue : labels.removeValue}</dd>
                      </div>
                    );
                  })}
                </dl>
                {change.contentChange ? <ProducerProductChanges change={change.contentChange} locale={presentation.locale} /> : null}
                {change.decisionNote ? <p>{change.decisionNote}</p> : null}
                {change.failureReason ? (
                  <p className="account-message account-message--error">{producerEditorMessage(presentation.locale, change.failureReason)}</p>
                ) : null}
                <div className="account-inline-actions">
                  {producer && change.status === "draft" ? <Link href={`/cuenta/productores/${producer.country}/${producer.producerId}/editar`} className="account-button">{labels.continue}</Link> : null}
                  {producer && ["conflict", "rejected", "withdrawn", "failed"].includes(change.status) ? (
                    <Link
                      href={`/cuenta/productores/${producer.country}/${producer.producerId}/editar`}
                      className="account-button account-button--secondary"
                    >
                      {labels.newProposal}
                    </Link>
                  ) : null}
                  {["draft", "submitted", "needs_changes"].includes(change.status) ? (
                    <form action={withdrawProducerChangeAction}>
                      <input type="hidden" name="changeId" value={change.id} />
                      <button type="submit" className="account-link-button">
                        {labels.withdraw}
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
