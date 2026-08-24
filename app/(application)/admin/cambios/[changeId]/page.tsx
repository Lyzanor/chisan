import Link from "next/link";
import { notFound } from "next/navigation";

import { reviewProducerChangeAction } from "@/app/(application)/admin/actions";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { formatAdminDate } from "@/components/admin/producer-change-table";
import { ProducerChangeStatusBadge } from "@/components/admin/producer-change-status";
import { requireStaffAccount } from "@/lib/accounts/auth";
import {
  canMaterializeProducerChange,
  getProducerChangeStatusDefinition,
  isReviewableProducerChange,
} from "@/lib/accounts/producer-change-workflow";
import {
  producerChangeRecoveryEligibleAt,
  queryAdminProducerChangeById,
  type AdminProducerChangeAuditItem,
  type ProducerChangeCatalogState,
} from "@/lib/admin/producer-change-requests";
import { getDatabase } from "@/lib/db";

type AdminChangeDetailPageProps = {
  params: Promise<{ changeId: string }>;
  searchParams: Promise<AccountMessageParams>;
};

const CATALOG_STATE_COPY: Record<
  ProducerChangeCatalogState,
  { label: string; copy: string; tone: string }
> = {
  missing: {
    label: "Producer missing from catalog",
    copy: "The durable producer key no longer resolves to a canonical CSV row.",
    tone: "danger",
  },
  matches_base: {
    label: "This build still matches the proposal base",
    copy: "The CSV row available to this application build has not changed since submission.",
    tone: "positive",
  },
  matches_requested: {
    label: "This build matches the requested values",
    copy: "The CSV row available to this application build contains the stored patch.",
    tone: "positive",
  },
  diverged: {
    label: "This build has diverged",
    copy: "Its CSV row matches neither the stored base nor the requested result.",
    tone: "danger",
  },
};

const AUDIT_ACTION_LABELS: Record<string, string> = {
  "producer_change.submitted": "Proposal submitted",
  "producer_change.withdrawn": "Proposal withdrawn",
  "producer_change.approved": "Editorial approval recorded",
  "producer_change.rejected": "Editorial rejection recorded",
  "producer_change.conflict": "Catalog conflict recorded",
  "producer_change.membership_conflict": "Producer access conflict recorded",
  "producer_change.materialized": "CSV patch materialized",
  "producer_change.applied": "Canonical commit finalized",
  "producer_change.failed": "Materialization failure recorded",
  "producer_change.execution_recovered": "Abandoned execution released",
  "producer_change.execution_cancelled": "Execution cancelled",
};

function actorLabel(actor: { id: string; displayName: string | null } | null): string {
  if (!actor) return "Not assigned";
  return actor.displayName || actor.id;
}

function auditActorLabel(event: AdminProducerChangeAuditItem): string {
  if (event.actorKind === "user") {
    return event.actorDisplayName || event.actorUserId || "Staff user";
  }
  return event.actorKey || event.actorKind;
}

function auditMetadataSummary(metadata: Record<string, unknown>): string | null {
  if (Array.isArray(metadata.fields) && metadata.fields.length) {
    return `Fields: ${metadata.fields.map(String).join(", ")}`;
  }
  if (typeof metadata.commitSha === "string") return `Commit: ${metadata.commitSha}`;
  if (typeof metadata.csvPath === "string") return `CSV: ${metadata.csvPath}`;
  if (typeof metadata.reason === "string") return metadata.reason;
  return null;
}

export default async function AdminChangeDetailPage({
  params,
  searchParams,
}: AdminChangeDetailPageProps) {
  const [, route, messageParams] = await Promise.all([
    requireStaffAccount(),
    params,
    searchParams,
  ]);
  const detail = await queryAdminProducerChangeById(getDatabase(), route.changeId);
  if (!detail) notFound();

  const status = getProducerChangeStatusDefinition(detail.change.status);
  const catalogState = CATALOG_STATE_COPY[detail.catalog.state];
  const reviewable = isReviewableProducerChange(detail.change.status);

  return (
    <div className="admin-content" data-change-request-id={detail.change.id}>
      <AccountMessage params={messageParams} />
      <nav className="admin-breadcrumb" aria-label="Breadcrumb">
        <Link href="/admin/cambios">Producer changes</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{detail.producerName}</span>
      </nav>

      <header className="admin-detail-heading">
        <div>
          <p className="catalog-kicker">
            {detail.change.country.toUpperCase()} · Producer #{detail.change.producerId}
          </p>
          <h2>{detail.producerName}</h2>
          <code className="admin-request-id admin-request-id--full">{detail.change.id}</code>
        </div>
        <ProducerChangeStatusBadge status={detail.change.status} verbose />
      </header>

      <section className={`admin-state-callout admin-state-callout--${status.tone}`}>
        <div>
          <strong>{status.description}</strong>
          <p>{status.nextAction}</p>
        </div>
        {detail.publicPath ? (
          <Link href={detail.publicPath} target="_blank">
            Open public profile ↗
          </Link>
        ) : null}
      </section>

      <div className="admin-detail-grid">
        <section className="admin-panel" aria-labelledby="request-overview-title">
          <div className="admin-section-heading">
            <div>
              <h3 id="request-overview-title">Request record</h3>
              <p>Durable identities and workflow checkpoints.</p>
            </div>
          </div>
          <dl className="admin-definition-list">
            <div>
              <dt>Requested by</dt>
              <dd>{actorLabel(detail.author)}</dd>
            </div>
            <div>
              <dt>Reviewed by</dt>
              <dd>{actorLabel(detail.reviewer)}</dd>
            </div>
            <div>
              <dt>Submitted</dt>
              <dd>{formatAdminDate(detail.change.submittedAt)}</dd>
            </div>
            <div>
              <dt>Reviewed</dt>
              <dd>{formatAdminDate(detail.change.reviewedAt)}</dd>
            </div>
            <div>
              <dt>Applied</dt>
              <dd>{formatAdminDate(detail.change.appliedAt)}</dd>
            </div>
            <div>
              <dt>Lock version</dt>
              <dd>{detail.change.lockVersion}</dd>
            </div>
            <div className="admin-definition-list__wide">
              <dt>Canonical commit</dt>
              <dd>
                {detail.change.appliedCommitSha ? (
                  <code>{detail.change.appliedCommitSha}</code>
                ) : (
                  "Not recorded"
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className="admin-panel" aria-labelledby="catalog-state-title">
          <div className="admin-section-heading">
            <div>
              <h3 id="catalog-state-title">CSV state in this build</h3>
              <p>Compared with the immutable base snapshot and requested result.</p>
            </div>
          </div>
          <div className={`admin-catalog-state admin-catalog-state--${catalogState.tone}`}>
            <strong>{catalogState.label}</strong>
            <p>{catalogState.copy}</p>
          </div>
          <dl className="admin-hash-list">
            <div>
              <dt>Base row hash</dt>
              <dd><code>{detail.change.baseRowHash}</code></dd>
            </div>
            <div>
              <dt>Requested row hash</dt>
              <dd><code>{detail.catalog.requestedHash}</code></dd>
            </div>
            <div>
              <dt>Current row hash</dt>
              <dd><code>{detail.catalog.currentHash || "Producer missing"}</code></dd>
            </div>
          </dl>
        </section>
      </div>

      {detail.execution ? (
        <section className="admin-panel" aria-labelledby="execution-record-title">
          <div className="admin-section-heading">
            <div>
              <h3 id="execution-record-title">Durable CSV execution</h3>
              <p>
                The active execution is shown first; otherwise this is the latest recorded attempt.
              </p>
            </div>
          </div>
          <dl className="admin-definition-list">
            <div className="admin-definition-list__wide">
              <dt>Execution ID</dt>
              <dd><code>{detail.execution.id}</code></dd>
            </div>
            <div>
              <dt>Execution state</dt>
              <dd>{detail.execution.status}</dd>
            </div>
            <div>
              <dt>Operator</dt>
              <dd><code>{detail.execution.operatorKey}</code></dd>
            </div>
            <div className="admin-definition-list__wide">
              <dt>CSV</dt>
              <dd><code>{detail.execution.csvPath}</code></dd>
            </div>
            <div className="admin-definition-list__wide">
              <dt>Source HEAD</dt>
              <dd><code>{detail.execution.sourceHeadSha}</code></dd>
            </div>
            <div className="admin-definition-list__wide">
              <dt>Expected row hash</dt>
              <dd><code>{detail.execution.expectedRowHash}</code></dd>
            </div>
            <div>
              <dt>Lease expires</dt>
              <dd>{formatAdminDate(detail.execution.leaseExpiresAt)}</dd>
            </div>
            <div>
              <dt>Materialized</dt>
              <dd>{formatAdminDate(detail.execution.materializedAt)}</dd>
            </div>
            <div>
              <dt>Recovery eligible</dt>
              <dd>
                {formatAdminDate(
                  producerChangeRecoveryEligibleAt(detail.execution.materializedAt),
                )}
              </dd>
            </div>
            <div>
              <dt>Finished</dt>
              <dd>{formatAdminDate(detail.execution.finishedAt)}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatAdminDate(detail.execution.createdAt)}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{formatAdminDate(detail.execution.updatedAt)}</dd>
            </div>
            <div className="admin-definition-list__wide">
              <dt>Execution commit</dt>
              <dd>
                {detail.execution.appliedCommitSha ? (
                  <code>{detail.execution.appliedCommitSha}</code>
                ) : (
                  "Not recorded"
                )}
              </dd>
            </div>
            {detail.execution.errorMessage ? (
              <div className="admin-definition-list__wide">
                <dt>Execution error</dt>
                <dd>{detail.execution.errorMessage}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      <section className="admin-panel" aria-labelledby="requested-diff-title">
        <div className="admin-section-heading">
          <div>
            <h3 id="requested-diff-title">Requested field changes</h3>
            <p>The current CSV column makes stale or already-applied values visible.</p>
          </div>
          <span>{detail.diff.length} field{detail.diff.length === 1 ? "" : "s"}</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table admin-diff-table">
            <thead>
              <tr>
                <th scope="col">Field</th>
                <th scope="col">Before submission</th>
                <th scope="col">Requested value</th>
                <th scope="col">CSV in this build</th>
              </tr>
            </thead>
            <tbody>
              {detail.diff.map((field) => (
                <tr key={field.key} data-field={field.key}>
                  <th scope="row">
                    {field.label}
                    <code>{field.key}</code>
                  </th>
                  <td><del>{field.before || "(empty)"}</del></td>
                  <td><ins>{field.requested || "(remove value)"}</ins></td>
                  <td>{field.current === null ? "Producer missing" : field.current || "(empty)"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {detail.change.authorNote || detail.change.decisionNote || detail.change.failureReason ? (
        <section className="admin-panel" aria-labelledby="request-notes-title">
          <div className="admin-section-heading">
            <div>
              <h3 id="request-notes-title">Context and decisions</h3>
              <p>Private operational notes; these are not public evidence records.</p>
            </div>
          </div>
          <div className="admin-note-grid">
            {detail.change.authorNote ? (
              <article>
                <span>Producer context or source</span>
                <p>{detail.change.authorNote}</p>
              </article>
            ) : null}
            {detail.change.decisionNote ? (
              <article>
                <span>Editorial decision note</span>
                <p>{detail.change.decisionNote}</p>
              </article>
            ) : null}
            {detail.change.failureReason ? (
              <article className="admin-note--danger">
                <span>Failure reason</span>
                <p>{detail.change.failureReason}</p>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      {reviewable ? (
        <section className="admin-review-panel" aria-labelledby="editorial-decision-title">
          <div>
            <p className="catalog-kicker">Editorial checkpoint</p>
            <h3 id="editorial-decision-title">Record a decision</h3>
            <p>
              Approval confirms editorial review and makes the request eligible for local CSV
              materialization. It does not publish the patch.
            </p>
          </div>
          <form action={reviewProducerChangeAction} className="account-form">
            <input type="hidden" name="changeId" value={detail.change.id} />
            <label className="account-field">
              <span>Editorial review note</span>
              <textarea
                name="note"
                maxLength={4_000}
                rows={5}
                defaultValue={detail.change.decisionNote ?? ""}
                required
              />
              <small>Record the public evidence checked and the reasoning behind the decision.</small>
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
                Reject request
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <div className="admin-detail-grid">
        <section className="admin-panel" aria-labelledby="audit-timeline-title">
          <div className="admin-section-heading">
            <div>
              <h3 id="audit-timeline-title">Audit timeline</h3>
              <p>The request row is current truth; events explain recorded transitions.</p>
            </div>
          </div>
          {detail.audit.length ? (
            <ol className="admin-timeline">
              {detail.audit.map((event) => {
                const metadata = auditMetadataSummary(event.metadata);
                return (
                  <li key={event.id}>
                    <span className="admin-timeline__marker" aria-hidden="true" />
                    <div>
                      <strong>{AUDIT_ACTION_LABELS[event.action] ?? event.action}</strong>
                      <p>{auditActorLabel(event)}</p>
                      {metadata ? <small>{metadata}</small> : null}
                    </div>
                    <time dateTime={event.occurredAt.toISOString()}>
                      {formatAdminDate(event.occurredAt)}
                    </time>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="account-empty">No audit event is recorded for this request.</p>
          )}
        </section>

        <section className="admin-agent-panel admin-agent-panel--stacked" aria-labelledby="agent-record-title">
          <div>
            <p className="catalog-kicker">Machine-readable record</p>
            <h3 id="agent-record-title">Agent access</h3>
            <p>
              Read the full request, normalized workflow state, safe audit metadata and operator
              commands as versioned JSON.
            </p>
          </div>
          <code>pnpm producer:change show {detail.change.id} --json</code>
          {canMaterializeProducerChange(detail.change.status) ? (
            <>
              <strong>Current operator command</strong>
              <code>npx pnpm producer:change materialize {detail.change.id}</code>
              {detail.change.status === "applying" ? (
                <>
                  <code>
                    npx pnpm producer:change finalize {detail.change.id} &lt;full-commit-sha&gt;
                  </code>
                  {detail.execution?.status === "materialized" ? (
                    <code>
                      npx pnpm producer:change recover {detail.change.id} {detail.execution.id}{" "}
                      --reason &quot;&lt;documented reason&gt;&quot;
                    </code>
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
