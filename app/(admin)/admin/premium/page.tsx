import Link from "next/link";

import {
  grantProducerPremiumGiftAction,
  revokeProducerPremiumGiftAction,
} from "@/app/(admin)/admin/actions";
import { formatAdminDate } from "@/components/admin/producer-change-table";
import { requireAdminAccount } from "@/lib/accounts/auth";
import {
  queryAdminProfileAccess,
  queryAdminProfileGiftCandidates,
  type AdminProfileActor,
} from "@/lib/admin/producer-profile-access";
import { getDatabase } from "@/lib/db";

type PremiumAdminPageProps = {
  searchParams: Promise<{
    accessPage?: string | string[];
    accessSource?: string | string[];
    accessState?: string | string[];
    candidatePage?: string | string[];
    q?: string | string[];
    result?: string | string[];
  }>;
};

type PremiumPageState = {
  accessPage: number;
  accessSource: string;
  accessState: string;
  candidatePage: number;
  query: string;
};

const RESULT_MESSAGES: Record<string, { error: boolean; text: string }> = {
  active_entitlement: {
    error: true,
    text: "This producer already has active expanded-profile access.",
  },
  active_owner_required: {
    error: true,
    text: "An active verified owner is required before Chisan can gift access.",
  },
  catalog_missing: {
    error: true,
    text: "The producer no longer exists in the canonical CSV catalog.",
  },
  commercial_request_open: {
    error: true,
    text: "A paid request or commercial incident is still open. Resolve it before gifting access.",
  },
  gift_failed: {
    error: true,
    text: "The gift could not be recorded safely. No access was granted.",
  },
  granted: {
    error: false,
    text: "Expanded-profile access was gifted and recorded in the audit trail.",
  },
  invalid_gift: {
    error: true,
    text: "Choose a valid claimed producer and add a substantive reason.",
  },
  invalid_revocation: {
    error: true,
    text: "Confirm the revocation and add a substantive reason.",
  },
  not_found: {
    error: true,
    text: "That premium entitlement no longer exists.",
  },
  not_admin: {
    error: true,
    text: "Administrator access changed before the operation completed. No access was changed.",
  },
  not_revocable: {
    error: true,
    text: "Only an active administrative gift can be revoked here. Paid access cannot be overridden.",
  },
  revocation_failed: {
    error: true,
    text: "The gift could not be revoked safely. Its current state was preserved.",
  },
  revoked: {
    error: false,
    text: "The administrative gift was revoked and pending premium proposals were closed safely.",
  },
  state_changed: {
    error: true,
    text: "The entitlement changed while the action was being submitted. Review its current state.",
  },
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function pageNumber(value: string | string[] | undefined): number {
  const parsed = Number(first(value));
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

function premiumAdminHref(
  current: PremiumPageState,
  changes: Partial<PremiumPageState>,
): string {
  const state = { ...current, ...changes };
  const parameters = new URLSearchParams();
  if (state.query) parameters.set("q", state.query);
  if (state.candidatePage > 1) {
    parameters.set("candidatePage", String(state.candidatePage));
  }
  if (state.accessPage > 1) parameters.set("accessPage", String(state.accessPage));
  if (state.accessState !== "active") {
    parameters.set("accessState", state.accessState);
  }
  if (state.accessSource !== "all") {
    parameters.set("accessSource", state.accessSource);
  }
  const query = parameters.toString();
  return query ? `/admin/premium?${query}` : "/admin/premium";
}

function actorLabel(actor: AdminProfileActor | null): string {
  if (!actor) return "No active owner";
  return actor.displayName || actor.id;
}

export default async function AdminPremiumProfilesPage({
  searchParams,
}: PremiumAdminPageProps) {
  const [, parameters] = await Promise.all([
    requireAdminAccount("/admin/premium"),
    searchParams,
  ]);
  const query = first(parameters.q).replace(/\s+/g, " ").trim().slice(0, 120);
  const accessState = first(parameters.accessState) || "active";
  const accessSource = first(parameters.accessSource) || "all";
  const current: PremiumPageState = {
    accessPage: pageNumber(parameters.accessPage),
    accessSource,
    accessState,
    candidatePage: pageNumber(parameters.candidatePage),
    query,
  };
  const database = getDatabase();
  const [candidates, access] = await Promise.all([
    queryAdminProfileGiftCandidates(database, {
      page: current.candidatePage,
      query,
    }),
    queryAdminProfileAccess(database, {
      page: current.accessPage,
      source: accessSource,
      state: accessState,
    }),
  ]);
  current.accessSource = access.source;
  current.accessState = access.state;
  const result = RESULT_MESSAGES[first(parameters.result)];

  return (
    <div className="admin-content">
      {result ? (
        <p
          className={`account-message ${result.error ? "account-message--error" : ""}`}
          role={result.error ? "alert" : "status"}
        >
          {result.text}
        </p>
      ) : null}

      <header className="admin-page-heading">
        <div>
          <p className="catalog-kicker">Producer-scoped entitlement registry</p>
          <h2>Expanded profiles</h2>
          <p>
            Inspect every premium right and grant selected claimed producers access without a
            payment. CSV remains the source of public facts.
          </p>
        </div>
        <div className="admin-page-heading__meta">
          <strong>{access.total}</strong>
          <span>access records matching this view</span>
        </div>
      </header>

      <aside className="admin-state-callout">
        <h3>Administrative gifts are independent of payments</h3>
        <p>
          A gift activates the same producer-level capability while paid Checkout stays
          disabled. Every grant and revocation requires an exact administrator, a reason and a
          durable audit event. Paid rights can never be revoked or manufactured here.
        </p>
        <p>
          <Link href="/admin/pagos">Open payment incidents and reconciliation</Link>
        </p>
      </aside>

      <section aria-labelledby="premium-gift-title">
        <div className="admin-section-heading">
          <div>
            <h3 id="premium-gift-title">Gift an expanded profile</h3>
            <p>
              Only published producers with an active verified owner are selectable. Search by
              producer, municipality, owner, country or producer ID.
            </p>
          </div>
        </div>
        <form className="admin-search-form" method="get">
          <label htmlFor="premium-candidate-search">Claimed producer</label>
          <div>
            <input
              id="premium-candidate-search"
              name="q"
              defaultValue={query}
              maxLength={120}
              placeholder="Producer, municipality, owner or es:123"
            />
            <button className="account-button">Search</button>
          </div>
        </form>

        {candidates.items.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Producer</th>
                  <th scope="col">Current owner</th>
                  <th scope="col">Eligibility</th>
                  <th scope="col">Administrative gift</th>
                </tr>
              </thead>
              <tbody>
                {candidates.items.map((candidate) => (
                  <tr key={`${candidate.country}:${candidate.producerId}`}>
                    <td>
                      <Link className="admin-table__primary-link" href={candidate.publicPath}>
                        {candidate.producer.name}
                      </Link>
                      <span className="admin-table__secondary">
                        {candidate.producer.city} · {candidate.country.toUpperCase()} · #
                        {candidate.producerId}
                      </span>
                    </td>
                    <td>
                      {actorLabel(candidate.owner)}
                      <code className="admin-request-id">{candidate.owner.id}</code>
                    </td>
                    <td>
                      <span
                        className={`account-status account-status--${candidate.eligibility === "eligible" ? "approved" : "pending"}`}
                      >
                        {candidate.eligibility === "eligible"
                          ? "Eligible"
                          : candidate.eligibility === "active_access"
                            ? "Already premium"
                            : "Commercial request open"}
                      </span>
                    </td>
                    <td className="admin-table__next-action">
                      {candidate.eligibility === "eligible" ? (
                        <form action={grantProducerPremiumGiftAction} className="account-form">
                          <input type="hidden" name="country" value={candidate.country} />
                          <input
                            type="hidden"
                            name="producerId"
                            value={candidate.producerId}
                          />
                          <label className="account-field">
                            <span>Reason</span>
                            <textarea
                              id={`gift-reason-${candidate.country}-${candidate.producerId}`}
                              name="reason"
                              minLength={10}
                              maxLength={1_000}
                              rows={2}
                              required
                            />
                          </label>
                          <button className="account-button">Grant premium gift</button>
                        </form>
                      ) : (
                        <p>No administrative grant is available in this state.</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="account-empty">No claimed producer matches this search.</p>
        )}
        {candidates.page > 1 || candidates.page < candidates.totalPages ? (
          <nav className="account-inline-actions" aria-label="Gift candidate pages">
            {candidates.page > 1 ? (
              <Link
                href={premiumAdminHref(current, {
                  candidatePage: candidates.page - 1,
                })}
                className="account-button account-button--secondary"
              >
                Newer candidates
              </Link>
            ) : null}
            {candidates.page < candidates.totalPages ? (
              <Link
                href={premiumAdminHref(current, {
                  candidatePage: candidates.page + 1,
                })}
                className="account-button account-button--secondary"
              >
                More candidates
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>

      <section aria-labelledby="premium-registry-title">
        <div className="admin-section-heading">
          <div>
            <h3 id="premium-registry-title">Premium access registry</h3>
            <p>
              The entitlement belongs to the producer. Purchaser and current owner may be
              different accounts.
            </p>
          </div>
        </div>
        <form className="admin-search-form" method="get">
          {query ? <input type="hidden" name="q" value={query} /> : null}
          <label htmlFor="premium-access-state">Registry filters</label>
          <div>
            <select
              id="premium-access-state"
              name="accessState"
              defaultValue={access.state}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="all">All states</option>
            </select>
            <select
              name="accessSource"
              aria-label="Premium access source"
              defaultValue={access.source}
            >
              <option value="all">All origins</option>
              <option value="gift">Admin gifts</option>
              <option value="payment">Paid purchases</option>
            </select>
            <button className="account-button account-button--secondary">Apply</button>
          </div>
        </form>

        {access.items.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Producer and entitlement</th>
                  <th scope="col">Current owner</th>
                  <th scope="col">Origin</th>
                  <th scope="col">State</th>
                  <th scope="col">Allowed control</th>
                </tr>
              </thead>
              <tbody>
                {access.items.map((item) => (
                  <tr key={item.entitlementId}>
                    <td>
                      {item.publicPath ? (
                        <Link className="admin-table__primary-link" href={item.publicPath}>
                          {item.producer?.name ?? "Producer missing from catalog"}
                        </Link>
                      ) : (
                        <strong>Producer missing from catalog</strong>
                      )}
                      <span className="admin-table__secondary">
                        {item.country.toUpperCase()} · #{item.producerId}
                      </span>
                      <code className="admin-request-id">{item.entitlementId}</code>
                    </td>
                    <td>
                      {actorLabel(item.owner)}
                      {item.owner ? (
                        <code className="admin-request-id">{item.owner.id}</code>
                      ) : null}
                    </td>
                    <td>
                      <strong>
                        {item.source === "gift"
                          ? "Admin gift"
                          : item.source === "payment"
                            ? `Paid purchase${item.paymentProvider ? ` · ${item.paymentProvider}` : ""}`
                            : "Unknown source"}
                      </strong>
                      {item.source === "gift" ? (
                        <>
                          <span className="admin-table__secondary">
                            Granted by {actorLabel(item.grantedBy)}
                          </span>
                          {item.grantReason ? (
                            <span className="admin-table__secondary">{item.grantReason}</span>
                          ) : null}
                        </>
                      ) : item.purchaser ? (
                        <span className="admin-table__secondary">
                          Purchased by {actorLabel(item.purchaser)}
                        </span>
                      ) : null}
                      {item.sourceReference ? (
                        <code className="admin-request-id">{item.sourceReference}</code>
                      ) : null}
                    </td>
                    <td>
                      <span
                        className={`account-status account-status--${item.state === "active" ? "approved" : "revoked"}`}
                      >
                        {item.state}
                      </span>
                      <time
                        className="admin-table__secondary"
                        dateTime={item.startsAt.toISOString()}
                      >
                        Since {formatAdminDate(item.startsAt)}
                      </time>
                      {item.revokedAt ? (
                        <time
                          className="admin-table__secondary"
                          dateTime={item.revokedAt.toISOString()}
                        >
                          Revoked {formatAdminDate(item.revokedAt)}
                        </time>
                      ) : null}
                      {item.revocationReason ? (
                        <span className="admin-table__secondary">
                          {item.revocationReason}
                        </span>
                      ) : null}
                      {item.revokedBy ? (
                        <span className="admin-table__secondary">
                          Revoked by {actorLabel(item.revokedBy)}
                        </span>
                      ) : null}
                    </td>
                    <td className="admin-table__next-action">
                      {item.canRevokeGift ? (
                        <form action={revokeProducerPremiumGiftAction} className="account-form">
                          <input
                            type="hidden"
                            name="entitlementId"
                            value={item.entitlementId}
                          />
                          <label className="account-field">
                            <span>Revocation reason</span>
                            <textarea
                              id={`revoke-reason-${item.entitlementId}`}
                              name="reason"
                              minLength={10}
                              maxLength={1_000}
                              rows={2}
                              required
                            />
                          </label>
                          <label className="account-check">
                            <input
                              type="checkbox"
                              name="confirmation"
                              value="revoke"
                              required
                            />{" "}
                            Revoke this gift and close unpublished premium proposals.
                          </label>
                          <button className="account-button account-button--danger">
                            Revoke administrative gift
                          </button>
                        </form>
                      ) : item.source === "payment" ? (
                        <p>
                          Manage money in {item.paymentProvider ?? "the payment provider"}; signed
                          reconciliation controls access.
                        </p>
                      ) : (
                        <p>No manual action is available.</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="account-empty">No premium access matches these filters.</p>
        )}
        {access.page > 1 || access.page < access.totalPages ? (
          <nav className="account-inline-actions" aria-label="Premium access pages">
            {access.page > 1 ? (
              <Link
                href={premiumAdminHref(current, { accessPage: access.page - 1 })}
                className="account-button account-button--secondary"
              >
                Newer access records
              </Link>
            ) : null}
            {access.page < access.totalPages ? (
              <Link
                href={premiumAdminHref(current, { accessPage: access.page + 1 })}
                className="account-button account-button--secondary"
              >
                Older access records
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </div>
  );
}
