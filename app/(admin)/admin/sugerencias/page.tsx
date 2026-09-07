import Link from "next/link";

import { reviewProducerSuggestionAction } from "@/app/(admin)/admin/actions";
import {
  AccountMessage,
  type AccountMessageParams,
} from "@/components/account/account-message";
import { requireStaffAccount } from "@/lib/accounts/auth";
import {
  PRODUCER_SUGGESTION_VIEWS,
  getProducerSuggestionStatusDefinition,
  type ProducerSuggestionView,
} from "@/lib/accounts/producer-suggestion-workflow";
import {
  queryAdminProducerSuggestions,
  queryProducerSuggestionCounts,
} from "@/lib/admin/producer-suggestions";
import { getDatabase } from "@/lib/db";

type AdminSuggestionsSearchParams = AccountMessageParams & {
  status?: string | string[];
  q?: string | string[];
  page?: string | string[];
};

type AdminSuggestionsPageProps = {
  searchParams: Promise<AdminSuggestionsSearchParams>;
};

const FILTER_ORDER: ProducerSuggestionView[] = [
  "all",
  "review",
  "publication",
  "applied",
  "closed",
];

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
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
  return encoded ? `/admin/sugerencias?${encoded}` : "/admin/sugerencias";
}

function emptyValue(value: string): string {
  return value.trim() ? value : "—";
}

export default async function AdminProducerSuggestionsPage({
  searchParams,
}: AdminSuggestionsPageProps) {
  const [, params] = await Promise.all([requireStaffAccount(), searchParams]);
  const database = getDatabase();
  const [registry, counts] = await Promise.all([
    queryAdminProducerSuggestions(database, {
      status: first(params.status),
      query: first(params.q),
      page: pageNumber(first(params.page)),
    }),
    queryProducerSuggestionCounts(database),
  ]);

  return (
    <div className="admin-content">
      <AccountMessage params={params} />
      <header className="admin-page-heading">
        <div>
          <p className="catalog-kicker">Community corrections</p>
          <h2>Producer suggestions</h2>
          <p>
            Readers may correct a producer nobody has claimed. A suggestion is
            editorial evidence to verify, never an authorization: accepting one
            publishes nothing and grants its author no producer access.
          </p>
        </div>
        <div className="admin-page-heading__meta">
          <strong>{registry.total}</strong>
          <span>{registry.options.selection.label.toLowerCase()}</span>
        </div>
      </header>

      <nav
        className="admin-filter-tabs"
        aria-label="Filter community suggestions by state"
      >
        {FILTER_ORDER.map((view) => {
          const definition = PRODUCER_SUGGESTION_VIEWS[view];
          const value = definition.statuses.reduce(
            (sum, status) => sum + counts[status],
            0,
          );
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

      <form
        action="/admin/sugerencias"
        method="get"
        className="admin-search-form"
        role="search"
      >
        {registry.options.selection.key !== "all" ? (
          <input
            type="hidden"
            name="status"
            value={registry.options.selection.key}
          />
        ) : null}
        <label htmlFor="admin-suggestion-search">Search suggestions</label>
        <div>
          <input
            id="admin-suggestion-search"
            type="search"
            name="q"
            defaultValue={registry.options.query}
            maxLength={120}
            placeholder="Producer, suggestion UUID, section, country or producer ID"
          />
          <button type="submit" className="account-button">
            Search
          </button>
          {registry.options.query ? (
            <Link
              href={registryHref(String(registry.options.selection.key), "")}
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      <section aria-labelledby="suggestion-results-title">
        <div className="admin-section-heading">
          <div>
            <h3 id="suggestion-results-title">
              {registry.options.selection.label}
            </h3>
            <p>
              Page {registry.options.page} of {registry.totalPages} ·{" "}
              {registry.total} matching suggestion
              {registry.total === 1 ? "" : "s"}
            </p>
          </div>
          <code className="admin-schema-label">producer-suggestion/v1</code>
        </div>

        {registry.items.length === 0 ? (
          <p className="account-empty">No suggestions match this view.</p>
        ) : (
          <ul className="account-review-list">
            {registry.items.map((item) => {
              const { suggestion } = item;
              const status = getProducerSuggestionStatusDefinition(
                suggestion.status,
              );
              const reviewable = suggestion.status === "pending";
              const publishable = suggestion.status === "approved";
              return (
                <li key={suggestion.id}>
                  <div className="account-record-heading">
                    <div>
                      <strong>{item.producerName}</strong>
                      <p>
                        {suggestion.country.toUpperCase()} · #
                        {suggestion.producerId} · {item.sectionLabel}
                      </p>
                    </div>
                    <span
                      className={`account-status account-status--${suggestion.status}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <dl className="account-review-meta">
                    <div>
                      <dt>Reader</dt>
                      <dd>{item.author.displayName || item.author.id}</dd>
                    </div>
                    <div>
                      <dt>Submitted</dt>
                      <dd>{suggestion.submittedAt.toISOString().slice(0, 10)}</dd>
                    </div>
                    <div>
                      <dt>Catalog row</dt>
                      <dd>
                        {item.producer
                          ? item.baseMatchesCatalog
                            ? "Unchanged since the suggestion was written"
                            : "Edited since the suggestion was written; compare the current values"
                          : "No longer published"}
                      </dd>
                    </div>
                    {item.publicPath ? (
                      <div>
                        <dt>Public profile</dt>
                        <dd>
                          <Link href={item.publicPath}>{item.publicPath}</Link>
                        </dd>
                      </div>
                    ) : null}
                    {item.reviewer ? (
                      <div>
                        <dt>Reviewer</dt>
                        <dd>{item.reviewer.displayName || item.reviewer.id}</dd>
                      </div>
                    ) : null}
                    {suggestion.appliedCommitSha ? (
                      <div>
                        <dt>Commit</dt>
                        <dd>
                          <code>{suggestion.appliedCommitSha}</code>
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Field</th>
                          <th>Published when suggested</th>
                          <th>Suggested</th>
                          <th>Published now</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.diff.map((field) => (
                          <tr key={field.key}>
                            <td>{field.label}</td>
                            <td>{emptyValue(field.before)}</td>
                            <td>{emptyValue(field.requested)}</td>
                            <td>
                              {field.current === null
                                ? "—"
                                : emptyValue(field.current)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="account-review-statement">
                    {suggestion.authorNote}
                  </p>
                  {suggestion.decisionNote ? (
                    <p className="account-review-statement">
                      <strong>Decision:</strong> {suggestion.decisionNote}
                    </p>
                  ) : null}

                  {reviewable || publishable ? (
                    <form
                      action={reviewProducerSuggestionAction}
                      className="account-form"
                    >
                      <input
                        type="hidden"
                        name="suggestionId"
                        value={suggestion.id}
                      />
                      <label className="account-field">
                        <span>Review note</span>
                        <textarea
                          name="note"
                          maxLength={4_000}
                          rows={3}
                          defaultValue={suggestion.decisionNote ?? ""}
                        />
                      </label>
                      {publishable ? (
                        <label className="account-field">
                          <span>Commit SHA (optional)</span>
                          <input
                            type="text"
                            name="commitSha"
                            maxLength={64}
                            placeholder="Git commit that published the correction"
                          />
                        </label>
                      ) : null}
                      <div className="account-inline-actions">
                        {reviewable ? (
                          <>
                            <button
                              className="account-button"
                              name="decision"
                              value="approved"
                            >
                              Accept
                            </button>
                            <button
                              className="account-button account-button--danger"
                              name="decision"
                              value="rejected"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            className="account-button"
                            name="decision"
                            value="applied"
                          >
                            Mark as published
                          </button>
                        )}
                      </div>
                    </form>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}

        {registry.totalPages > 1 ? (
          <nav className="admin-pagination" aria-label="Suggestion pages">
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
    </div>
  );
}
