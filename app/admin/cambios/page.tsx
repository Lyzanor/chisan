import Link from "next/link";

import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { ProducerChangeTable } from "@/components/admin/producer-change-table";
import { requireStaffAccount } from "@/lib/accounts/auth";
import {
  PRODUCER_CHANGE_VIEWS,
  type ProducerChangeView,
} from "@/lib/accounts/producer-change-workflow";
import {
  queryAdminProducerChanges,
  queryProducerChangeCounts,
} from "@/lib/admin/producer-change-requests";
import { getDatabase } from "@/lib/db";

type AdminChangesSearchParams = AccountMessageParams & {
  status?: string | string[];
  q?: string | string[];
  page?: string | string[];
};

type AdminChangesPageProps = {
  searchParams: Promise<AdminChangesSearchParams>;
};

const FILTER_ORDER: ProducerChangeView[] = [
  "all",
  "review",
  "csv",
  "attention",
  "applied",
  "closed",
  "drafts",
];

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function pageNumber(value: string): number {
  return /^\d+$/.test(value) ? Number(value) : 1;
}

function registryHref(status: string, query: string, page = 1): string {
  const parameters = new URLSearchParams();
  if (status && status !== "all") parameters.set("status", status);
  if (query) parameters.set("q", query);
  if (page > 1) parameters.set("page", String(page));
  const encoded = parameters.toString();
  return encoded ? `/admin/cambios?${encoded}` : "/admin/cambios";
}

export default async function AdminChangesPage({ searchParams }: AdminChangesPageProps) {
  const [, params] = await Promise.all([requireStaffAccount(), searchParams]);
  const requestedStatus = first(params.status);
  const requestedQuery = first(params.q);
  const database = getDatabase();
  const [registry, counts] = await Promise.all([
    queryAdminProducerChanges(database, {
      status: requestedStatus,
      query: requestedQuery,
      page: pageNumber(first(params.page)),
    }),
    queryProducerChangeCounts(database),
  ]);

  return (
    <div className="admin-content">
      <AccountMessage params={params} />
      <header className="admin-page-heading">
        <div>
          <p className="catalog-kicker">Durable request history</p>
          <h2>Producer change registry</h2>
          <p>
            Review every proposal from draft to canonical commit. Approval never publishes a
            database overlay over the CSV.
          </p>
        </div>
        <div className="admin-page-heading__meta">
          <strong>{registry.total}</strong>
          <span>{registry.options.selection.label.toLowerCase()}</span>
        </div>
      </header>

      <nav className="admin-filter-tabs" aria-label="Filter producer changes by workflow state">
        {FILTER_ORDER.map((view) => {
          const definition = PRODUCER_CHANGE_VIEWS[view];
          const value = definition.statuses.reduce((sum, status) => sum + counts[status], 0);
          const active = registry.options.selection.key === view;
          return (
            <Link
              key={view}
              href={registryHref(view, registry.options.query)}
              aria-current={active ? "page" : undefined}
            >
              <span>{definition.label}</span>
              <strong>{value}</strong>
            </Link>
          );
        })}
      </nav>

      <form action="/admin/cambios" method="get" className="admin-search-form" role="search">
        {registry.options.selection.key !== "all" ? (
          <input type="hidden" name="status" value={registry.options.selection.key} />
        ) : null}
        <label htmlFor="admin-change-search">Search requests</label>
        <div>
          <input
            id="admin-change-search"
            type="search"
            name="q"
            defaultValue={registry.options.query}
            maxLength={120}
            placeholder="Producer, request UUID, country or producer ID"
          />
          <button type="submit" className="account-button">
            Search
          </button>
          {registry.options.query ? (
            <Link href={registryHref(String(registry.options.selection.key), "")}>Clear</Link>
          ) : null}
        </div>
      </form>

      <section aria-labelledby="change-results-title">
        <div className="admin-section-heading">
          <div>
            <h3 id="change-results-title">{registry.options.selection.label}</h3>
            <p>
              Page {registry.options.page} of {registry.totalPages} · {registry.total} matching
              request{registry.total === 1 ? "" : "s"}
            </p>
          </div>
          <code className="admin-schema-label">change-request/v1</code>
        </div>

        {registry.items.length ? (
          <ProducerChangeTable items={registry.items} />
        ) : (
          <p className="account-empty">No producer changes match this view.</p>
        )}

        {registry.totalPages > 1 ? (
          <nav className="admin-pagination" aria-label="Producer change pages">
            {registry.options.page > 1 ? (
              <Link
                href={registryHref(
                  String(registry.options.selection.key),
                  registry.options.query,
                  registry.options.page - 1,
                )}
              >
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            <span>
              Page {registry.options.page} of {registry.totalPages}
            </span>
            {registry.options.page < registry.totalPages ? (
              <Link
                href={registryHref(
                  String(registry.options.selection.key),
                  registry.options.query,
                  registry.options.page + 1,
                )}
              >
                Next →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </section>

      <aside className="admin-agent-strip">
        <div>
          <strong>Read-only access for agents</strong>
          <span>Stable JSON, the same filters and full request UUIDs.</span>
        </div>
        <code>
          pnpm producer:change list --status {registry.options.selection.key} --json
        </code>
      </aside>
    </div>
  );
}
