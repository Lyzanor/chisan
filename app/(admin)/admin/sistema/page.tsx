import { formatAdminDate } from "@/components/admin/producer-change-table";
import { requireAdminAccount } from "@/lib/accounts/auth";
import { getDatabase } from "@/lib/db";
import {
  accountDatabaseStatusProblem,
  queryAccountDatabaseStatus,
  unavailableAccountDatabaseStatus,
  type AccountDatabaseHealth,
} from "@/lib/db/account-database-status";

type StatusCard = {
  label: string;
  value: string;
  copy: string;
  tone: "neutral" | "positive" | "warning" | "danger";
};

function statusCards(status: AccountDatabaseHealth): StatusCard[] {
  if (!status.available) {
    return [
      {
        label: "Database connection",
        value: "—",
        copy: "The runtime could not complete the read-only status check.",
        tone: "danger",
      },
      {
        label: "Migration contract",
        value: "—",
        copy: "Not checked because the database was unavailable.",
        tone: "neutral",
      },
      {
        label: "Runtime permissions",
        value: "—",
        copy: "Not checked because the database was unavailable.",
        tone: "neutral",
      },
    ];
  }

  return [
    {
      label: "Database connection",
      value: "OK",
      copy: "The deployed application reached its configured PostgreSQL database.",
      tone: "positive",
    },
    {
      label: "Migration contract",
      value: `${status.appliedMigrationCount}/${status.expectedMigrationCount}`,
      copy: status.migrationsMatch
        ? "Every applied migration matches the repository fingerprint."
        : "The database and deployed migration contract differ.",
      tone: status.migrationsMatch ? "positive" : "danger",
    },
    {
      label: "Runtime permissions",
      value: status.runtimeAccess === null ? "—" : status.runtimeAccess ? "OK" : "Blocked",
      copy:
        status.runtimeAccess === null
          ? "Not checked until the migration contract is current."
          : status.runtimeAccess
            ? "The application role has the required account-workflow access."
            : "The application role is missing required account-workflow access.",
      tone:
        status.runtimeAccess === null
          ? "warning"
          : status.runtimeAccess
            ? "positive"
            : "danger",
    },
  ];
}

export default async function AdminSystemStatusPage() {
  await requireAdminAccount("/admin/sistema");
  let status: AccountDatabaseHealth;
  try {
    status = await queryAccountDatabaseStatus(getDatabase());
  } catch {
    status = unavailableAccountDatabaseStatus();
  }
  const cards = statusCards(status);
  const problem = status.available ? accountDatabaseStatusProblem(status) : "Database unavailable.";

  return (
    <div className="admin-content">
      <header className="admin-page-heading">
        <div>
          <p className="catalog-kicker">Runtime-owned diagnostics</p>
          <h2>System status</h2>
          <p>
            Verify the account database contract from the application that actually uses it,
            without exposing credentials or depending on a provider dashboard.
          </p>
        </div>
        <div className="admin-page-heading__meta">
          <strong>{problem ? "Check" : "Healthy"}</strong>
          <span>account subsystem</span>
        </div>
      </header>

      <section aria-labelledby="account-database-status-title">
        <div className="admin-section-heading">
          <div>
            <h3 id="account-database-status-title">Account database</h3>
            <p>Read-only check completed {formatAdminDate(status.checkedAt)}.</p>
          </div>
          <code className="admin-schema-label">account-database/v1</code>
        </div>
        <div className="admin-metric-grid">
          {cards.map((card) => (
            <div key={card.label} className={`admin-metric admin-metric--${card.tone}`}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.copy}</small>
            </div>
          ))}
        </div>
      </section>

      {problem ? (
        <aside className="admin-state-callout">
          <h3>Action required</h3>
          <p>{problem}</p>
        </aside>
      ) : (
        <aside className="admin-state-callout">
          <h3>Provider-neutral contract</h3>
          <p>
            The check uses Chisan&apos;s migration fingerprints and the active PostgreSQL runtime
            role. Database hosting and identity providers are outside the account-domain keys.
          </p>
        </aside>
      )}
    </div>
  );
}
