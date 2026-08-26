import { and, desc, eq, inArray } from "drizzle-orm";
import Link from "next/link";

import { retryProducerProfileUpgradeAction } from "@/app/(application)/admin/actions";
import { formatAdminDate } from "@/components/admin/producer-change-table";
import { requireAdminAccount } from "@/lib/accounts/auth";
import { producerProfileUpgradeIncidentCondition } from "@/lib/admin/producer-profile-upgrade-incidents";
import { findProducersByIds } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { auditEvents, producerProfileUpgradeRequests } from "@/lib/db/schema";
import { formatMinorCurrencyAmount } from "@/lib/payments/currency";
import { STRIPE_PAYMENT_PROVIDER } from "@/lib/payments/payment-provider";
import {
  PRODUCER_PROFILE_UPGRADE_UNMATCHED_COMMERCIAL_ACTION,
  canRetryPaidUnfulfilledProfileUpgrade,
} from "@/lib/payments/stripe-profile-upgrade-domain";

type PaymentPageProps = {
  searchParams: Promise<{
    incidentPage?: string | string[];
    result?: string | string[];
    unmatchedPage?: string | string[];
  }>;
};

const INCIDENT_PAGE_SIZE = 50;
const UNMATCHED_PAGE_SIZE = 20;
const COMMERCIAL_SAFETY_ACTIONS = [
  "producer_profile_upgrade.unmatched_paid_checkout",
  PRODUCER_PROFILE_UPGRADE_UNMATCHED_COMMERCIAL_ACTION,
  "producer_profile_upgrade.checkout_expiration_failed",
] as const;

const RESULT_MESSAGES: Record<string, { error: boolean; text: string }> = {
  reconciled: {
    error: false,
    text: "Stripe was re-read and the producer entitlement is active.",
  },
  already_paid: {
    error: false,
    text: "This payment had already been reconciled.",
  },
  invalid_request: { error: true, text: "The payment request ID is invalid." },
  not_found: { error: true, text: "The payment request no longer exists." },
  manual_review_required: {
    error: true,
    text: "This incident cannot be retried safely. Compare the immutable request with Stripe and follow the refund or escalation runbook.",
  },
  retry_failed: {
    error: true,
    text: "Stripe reconciliation failed. The right remains hidden; inspect the request and retry later.",
  },
  still_unfulfilled: {
    error: true,
    text: "Stripe was re-read, but the payment still cannot grant the entitlement safely.",
  },
  state_changed: {
    error: true,
    text: "The payment changed state while it was being reviewed. Inspect its current state before acting.",
  },
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function positivePage(value: string | string[] | undefined): number {
  const page = Number(first(value));
  return Number.isSafeInteger(page) && page > 0 && page <= 10_000 ? page : 1;
}

function paymentPageHref(incidentPage: number, unmatchedPage: number): string {
  const parameters = new URLSearchParams();
  if (incidentPage > 1) parameters.set("incidentPage", String(incidentPage));
  if (unmatchedPage > 1) parameters.set("unmatchedPage", String(unmatchedPage));
  const query = parameters.toString();
  return query ? `/admin/pagos?${query}` : "/admin/pagos";
}

function stripePaymentsUrl(): string | null {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  if (secretKey.startsWith("sk_test_")) {
    return "https://dashboard.stripe.com/test/payments";
  }
  if (secretKey.startsWith("sk_live_")) {
    return "https://dashboard.stripe.com/payments";
  }
  return null;
}

function incidentCopy(status: string, failureCode: string | null): string {
  if (status === "disputed") return "Access is suspended until Stripe closes the dispute.";
  if (status === "refunded") {
    return "The payment was fully refunded, but a later Stripe dispute still needs commercial review.";
  }
  if (status === "partially_refunded") {
    return "Access is suspended. Confirm whether the remaining amount will also be refunded.";
  }
  if (canRetryPaidUnfulfilledProfileUpgrade(failureCode)) {
    return "Safe retry available: Stripe will be fetched again and every binding revalidated.";
  }
  return "Manual review only: never override a price, amount, mode or identity mismatch.";
}

function commercialReferences(metadata: Record<string, unknown>): string[] {
  return [
    ["Checkout", metadata.checkoutSessionId],
    ["Charge", metadata.chargeId],
    ["PaymentIntent", metadata.paymentIntentId],
    ["Request metadata", metadata.metadataRequestId],
  ].flatMap(([label, value]) =>
    value === null || value === undefined || value === ""
      ? []
      : [`${String(label)}: ${String(value)}`],
  );
}

export default async function AdminProfilePaymentsPage({ searchParams }: PaymentPageProps) {
  const [, parameters] = await Promise.all([
    requireAdminAccount("/admin/pagos"),
    searchParams,
  ]);
  const database = getDatabase();
  const incidentPage = positivePage(parameters.incidentPage);
  const unmatchedPage = positivePage(parameters.unmatchedPage);
  const [incidentRows, commercialSafetyHistoryPage] = await Promise.all([
    database
      .select()
      .from(producerProfileUpgradeRequests)
      .where(
        and(
          eq(
            producerProfileUpgradeRequests.paymentProvider,
            STRIPE_PAYMENT_PROVIDER,
          ),
          producerProfileUpgradeIncidentCondition(),
        ),
      )
      .orderBy(
        desc(producerProfileUpgradeRequests.updatedAt),
        desc(producerProfileUpgradeRequests.id),
      )
      .limit(INCIDENT_PAGE_SIZE + 1)
      .offset((incidentPage - 1) * INCIDENT_PAGE_SIZE),
    database
      .select({
        action: auditEvents.action,
        id: auditEvents.id,
        requestId: auditEvents.requestId,
        targetId: auditEvents.targetId,
        metadata: auditEvents.metadata,
        occurredAt: auditEvents.occurredAt,
      })
      .from(auditEvents)
      .where(inArray(auditEvents.action, [...COMMERCIAL_SAFETY_ACTIONS]))
      .orderBy(desc(auditEvents.occurredAt), desc(auditEvents.id))
      .limit(UNMATCHED_PAGE_SIZE + 1)
      .offset((unmatchedPage - 1) * UNMATCHED_PAGE_SIZE),
  ]);
  const incidentHasNext = incidentRows.length > INCIDENT_PAGE_SIZE;
  const incidents = incidentRows.slice(0, INCIDENT_PAGE_SIZE);
  const unmatchedHasNext = commercialSafetyHistoryPage.length > UNMATCHED_PAGE_SIZE;
  const commercialSafetyHistory = commercialSafetyHistoryPage.slice(
    0,
    UNMATCHED_PAGE_SIZE,
  );
  const producers = await findProducersByIds(
    incidents.map((request) => ({
      country: request.country,
      producerId: request.producerId,
    })),
  );
  const result = RESULT_MESSAGES[first(parameters.result)];
  const stripeUrl = stripePaymentsUrl();

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
          <p className="catalog-kicker">Commercial incident queue</p>
          <h2>Expanded-profile payments</h2>
          <p>
            Stripe owns the payment; PostgreSQL records the request and producer-scoped right.
            CSV values remain canonical and are never written by this screen.
          </p>
        </div>
        <div className="admin-page-heading__meta">
          <strong>{incidents.length}</strong>
          <span>open incidents on this page</span>
        </div>
      </header>

      <aside className="admin-state-callout">
        <h3>Fail-closed reconciliation</h3>
        <p>
          Retry only re-fetches the bound Checkout Session and validates payment status, Price,
          EUR 49 amount, line item, PaymentIntent and Charge. It cannot grant manually or bypass
          a mismatch. Refunds and disputes are handled in Stripe and arrive through signed
          webhooks.
        </p>
        {stripeUrl ? (
          <p>
            <a href={stripeUrl} target="_blank" rel="noreferrer">
              Open the matching Stripe payments environment
            </a>
          </p>
        ) : (
          <p>
            Stripe is deliberately not configured. Administrative gifts remain available in
            the <Link href="/admin/premium">expanded-profile registry</Link>.
          </p>
        )}
      </aside>

      <section aria-labelledby="payment-incidents-title">
        <div className="admin-section-heading">
          <div>
            <h3 id="payment-incidents-title">Requests needing attention</h3>
            <p>Up to 50 records, most recently updated first.</p>
          </div>
        </div>
        {incidents.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Producer and request</th>
                  <th scope="col">State</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Updated</th>
                  <th scope="col">Safe next step</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((request, index) => {
                  const producer = producers[index];
                  const canRetry =
                    request.paymentProvider === STRIPE_PAYMENT_PROVIDER &&
                    request.status === "paid_unfulfilled" &&
                    Boolean(request.providerCheckoutId) &&
                    canRetryPaidUnfulfilledProfileUpgrade(request.failureCode);
                  return (
                    <tr key={request.id}>
                      <td>
                        <strong>{producer?.name ?? "Producer missing from catalog"}</strong>
                        <span className="admin-table__secondary">
                          {request.country.toUpperCase()} · #{request.producerId}
                        </span>
                        <code className="admin-request-id">{request.id}</code>
                      </td>
                      <td>
                        <span className="account-status account-status--conflict">
                          {request.status.replaceAll("_", " ")}
                        </span>
                        {request.failureCode ? (
                          <code className="admin-request-id">{request.failureCode}</code>
                        ) : null}
                      </td>
                      <td>
                        <span>
                          Offer:{" "}
                          {formatMinorCurrencyAmount(request.amountMinor, request.currency)}
                        </span>
                        {request.amountCapturedMinor !== null && request.capturedCurrency ? (
                          <span className="admin-table__secondary">
                            Captured: {formatMinorCurrencyAmount(
                              request.amountCapturedMinor,
                              request.capturedCurrency,
                            )}
                          </span>
                        ) : null}
                        {request.amountRefundedMinor ? (
                          <span className="admin-table__secondary">
                            Refunded: {formatMinorCurrencyAmount(
                              request.amountRefundedMinor,
                              request.capturedCurrency ?? request.currency,
                            )}
                          </span>
                        ) : null}
                        <code className="admin-request-id">
                          {request.providerPaymentId ??
                            request.providerCheckoutId ??
                            "No Stripe payment reference"}
                        </code>
                      </td>
                      <td>
                        <time dateTime={request.updatedAt.toISOString()}>
                          {formatAdminDate(request.updatedAt)}
                        </time>
                      </td>
                      <td className="admin-table__next-action">
                        <p>{incidentCopy(request.status, request.failureCode)}</p>
                        {canRetry ? (
                          <form action={retryProducerProfileUpgradeAction}>
                            <input type="hidden" name="requestId" value={request.id} />
                            <button className="account-button account-button--secondary">
                              Re-read Stripe and retry
                            </button>
                          </form>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="account-empty">No expanded-profile payment needs attention.</p>
        )}
        {incidentPage > 1 || incidentHasNext ? (
          <nav className="account-inline-actions" aria-label="Payment incident pages">
            {incidentPage > 1 ? (
              <Link
                href={paymentPageHref(incidentPage - 1, unmatchedPage)}
                className="account-button account-button--secondary"
              >
                Newer incidents
              </Link>
            ) : null}
            {incidentHasNext ? (
              <Link
                href={paymentPageHref(incidentPage + 1, unmatchedPage)}
                className="account-button account-button--secondary"
              >
                Older incidents
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>

      <section aria-labelledby="commercial-safety-history-title">
        <div className="admin-section-heading">
          <div>
            <h3 id="commercial-safety-history-title">Commercial safety history</h3>
            <p>
              This paginated, append-only history records paid Sessions or later commercial
              events that did not bind safely, plus any Checkout that could not be expired after
              owner authorization changed. Investigate in Stripe; never treat absence from the
              first page as resolution.
            </p>
          </div>
        </div>
        {commercialSafetyHistory.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Incident</th>
                  <th scope="col">Stripe references</th>
                  <th scope="col">Recorded</th>
                </tr>
              </thead>
              <tbody>
                {commercialSafetyHistory.map((incident) => {
                  const references = commercialReferences(incident.metadata);
                  return (
                    <tr key={incident.id}>
                      <td>
                        <strong>
                          {incident.action
                            .replace("producer_profile_upgrade.", "")
                            .replaceAll("_", " ")}
                        </strong>
                        <code className="admin-request-id admin-request-id--full">
                          {incident.requestId ?? incident.targetId}
                        </code>
                      </td>
                      <td>
                        {references.length ? (
                          references.map((reference) => (
                            <code
                              key={reference}
                              className="admin-request-id admin-request-id--full"
                            >
                              {reference}
                            </code>
                          ))
                        ) : (
                          "Not recorded"
                        )}
                        {incident.metadata.reason ? (
                          <span className="admin-table__secondary">
                            {String(incident.metadata.reason).replaceAll("_", " ")}
                          </span>
                        ) : null}
                      </td>
                      <td>
                        <time dateTime={incident.occurredAt.toISOString()}>
                          {formatAdminDate(incident.occurredAt)}
                        </time>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="account-empty">No commercial safety incident has been recorded.</p>
        )}
        {unmatchedPage > 1 || unmatchedHasNext ? (
          <nav className="account-inline-actions" aria-label="Commercial safety history pages">
            {unmatchedPage > 1 ? (
              <Link
                href={paymentPageHref(incidentPage, unmatchedPage - 1)}
                className="account-button account-button--secondary"
              >
                Newer incidents
              </Link>
            ) : null}
            {unmatchedHasNext ? (
              <Link
                href={paymentPageHref(incidentPage, unmatchedPage + 1)}
                className="account-button account-button--secondary"
              >
                Older incidents
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </div>
  );
}
