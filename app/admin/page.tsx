import { count, inArray } from "drizzle-orm";
import Link from "next/link";

import { ProducerChangeTable } from "@/components/admin/producer-change-table";
import { requireStaffAccount } from "@/lib/accounts/auth";
import {
  queryAdminProducerChanges,
  queryProducerChangeCounts,
} from "@/lib/admin/producer-change-requests";
import { getDatabase } from "@/lib/db";
import { producerClaims } from "@/lib/db/schema";

export default async function AdminPage() {
  await requireStaffAccount();
  const database = getDatabase();
  const [changeCounts, recentChanges, [claimCount]] = await Promise.all([
    queryProducerChangeCounts(database),
    queryAdminProducerChanges(database, { pageSize: 6 }),
    database
      .select({ value: count() })
      .from(producerClaims)
      .where(inArray(producerClaims.status, ["pending", "needs_info"])),
  ]);

  const reviewCount = changeCounts.submitted + changeCounts.needs_changes;
  const csvCount = changeCounts.approved + changeCounts.applying;
  const attentionCount = changeCounts.conflict + changeCounts.failed;
  const metrics = [
    {
      label: "Needs editorial review",
      value: reviewCount,
      copy: "Submitted producer changes awaiting a decision.",
      href: "/admin/cambios?status=review",
      tone: reviewCount ? "warning" : "neutral",
    },
    {
      label: "In the CSV workflow",
      value: csvCount,
      copy: `${changeCounts.approved} ready · ${changeCounts.applying} being applied`,
      href: "/admin/cambios?status=csv",
      tone: csvCount ? "positive" : "neutral",
    },
    {
      label: "Needs attention",
      value: attentionCount,
      copy: "Conflicts or failed materialization attempts.",
      href: "/admin/cambios?status=attention",
      tone: attentionCount ? "danger" : "neutral",
    },
    {
      label: "Ownership queue",
      value: Number(claimCount?.value ?? 0),
      copy: "Identity and productive-unit control checks.",
      href: "/admin/reclamaciones",
      tone: claimCount?.value ? "warning" : "neutral",
    },
  ];

  return (
    <div className="admin-content">
      <header className="admin-page-heading">
        <div>
          <p className="catalog-kicker">System of record</p>
          <h2>Operations overview</h2>
          <p>
            Review account requests here. Public producer data remains controlled by the
            canonical CSV and Git workflow.
          </p>
        </div>
        <Link href="/admin/cambios" className="account-button">
          Open change registry
        </Link>
      </header>

      <section aria-labelledby="admin-priority-title">
        <div className="admin-section-heading">
          <div>
            <h3 id="admin-priority-title">Priority work</h3>
            <p>Counts are derived from durable request state, not a temporary queue.</p>
          </div>
        </div>
        <div className="admin-metric-grid">
          {metrics.map((metric) => (
            <Link
              key={metric.label}
              href={metric.href}
              className={`admin-metric admin-metric--${metric.tone}`}
            >
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.copy}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="admin-panel" aria-labelledby="admin-workflow-title">
        <div className="admin-section-heading">
          <div>
            <h3 id="admin-workflow-title">Producer-change delivery</h3>
            <p>Approval and publication are intentionally separate checkpoints.</p>
          </div>
        </div>
        <ol className="admin-workflow" aria-label="Producer change workflow">
          <li>
            <span>1</span>
            <strong>Review</strong>
            <small>{reviewCount} waiting</small>
          </li>
          <li>
            <span>2</span>
            <strong>Approved</strong>
            <small>{changeCounts.approved} ready for CSV</small>
          </li>
          <li>
            <span>3</span>
            <strong>Materialize</strong>
            <small>{changeCounts.applying} awaiting commit</small>
          </li>
          <li>
            <span>4</span>
            <strong>Canonical commit</strong>
            <small>{changeCounts.applied} applied</small>
          </li>
        </ol>
      </section>

      <section aria-labelledby="admin-recent-title">
        <div className="admin-section-heading">
          <div>
            <h3 id="admin-recent-title">Recently updated requests</h3>
            <p>Every request keeps a permanent UUID and status history.</p>
          </div>
          <Link href="/admin/cambios">View all {recentChanges.total}</Link>
        </div>
        {recentChanges.items.length ? (
          <ProducerChangeTable items={recentChanges.items} />
        ) : (
          <p className="account-empty">No producer changes have been created yet.</p>
        )}
      </section>

      <section className="admin-agent-panel" aria-labelledby="admin-agent-title">
        <div>
          <p className="catalog-kicker">Agent-ready read model</p>
          <h3 id="admin-agent-title">Structured access without HTML scraping</h3>
          <p>
            The same status vocabulary powers this workspace and the read-only operational
            command. Future agents can discover approved work without querying tables directly.
          </p>
        </div>
        <code>pnpm producer:change list --status approved --json</code>
      </section>
    </div>
  );
}
