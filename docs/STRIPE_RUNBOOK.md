# Chisan Stripe Runbook

## Purpose and boundary

This is the provider-specific operational runbook for Chisan's currently
implemented Stripe adapter. It owns the business decisions, provisioning,
activation, resource and offer configuration, isolated test, go/no-go gate,
incident response, replacement and retirement procedure for that adapter.

`docs/ACCOUNT_SYSTEM.md` owns provider-neutral commercial-request and entitlement
semantics. `docs/OPERATIONS.md` owns the environment contract, general preflight,
deployment order, Production smoke checks, rollback, backups and secret
handling. Complete the Operations preflight before following this runbook and
return there for deployment and recovery.

Never copy live Stripe resource identifiers, account details or secret values
into this file.

## Deferred Stripe adapter activation and future launch

**Current state: deliberately deferred, with no launch date.**

The application code, migration `0006`, widened CSV schema, entitlement model
and admin operations may be deployed while Stripe remains unprovisioned. Stripe
is a replaceable adapter for issuing and reconciling a producer-scoped
entitlement; it is not the authority for premium CSV fields, editorial review or
public presentation. Replacing it later must preserve entitlement provenance and
commercial history without changing the CSV contract or reinterpreting historic
Stripe references. A replacement receives its own configuration, provenance and
operational runbook. `docs/ACCOUNT_SYSTEM.md` owns the provider-neutral semantics;
this runbook owns only the dormant Stripe adapter's future provisioning,
activation and incident procedure.

Until the business owner explicitly schedules a payment launch:

- remain in the deferred and unprovisioned state defined by
  `docs/OPERATIONS.md`;
- do not advertise or promise paid profile upgrades;
- use only the separately audited `/admin/premium` gift workflow when Chisan
  deliberately grants an expanded profile without payment.

### Decisions required before provisioning

Before creating any Stripe resource, record and approve:

- the legal entity and country that will contract with Stripe and receive funds;
- whether EUR 49 is the final customer price including VAT or a pre-tax price;
- whether Stripe Tax is used and how the customer location is determined;
- receipt versus invoice handling, numbering and accounting handoff;
- refund, withdrawal, exception and support policy;
- the immutable terms URL and its corresponding code version;
- the monitored billing support address;
- accepted payment methods;
- whether a Live purchase/refund rehearsal is necessary and its approved plan.

Code and Checkout copy must not guess these business, fiscal or legal choices.

### Future resource inventory

Activation requires all of the following, created only after those decisions:

- a verified Stripe business account and settlement bank account;
- separate Test and Live one-time Products/Prices for exactly `4900 eur`, never
  recurring;
- separate Test and Live secret keys;
- separate Test and Live `/api/webhooks/stripe` endpoints and signing secrets;
- an isolated test environment using Clerk Test, an isolated PostgreSQL
  database and Stripe Test;
- published versioned terms, a monitored support email and the approved
  tax/invoicing configuration;
- environment variables stored only in the deployment secret manager, with no
  value copied into Git, documentation, logs or chat.

### Future activation sequence

1. Approve the commercial, fiscal, legal, refund and support decisions above.
2. Verify migration `0006`, the canonical widened CSV schema and compatible
   application code are deployed while Checkout remains false.
3. Create only the Stripe Test resources.
4. Configure an isolated Preview or test deployment; leave Production
   untouched.
5. Enable Checkout only there and complete the isolated Test sequence below.
6. Test `/admin/premium` inventory, gift, gift revocation and safe coexistence
   with payment-adapter entitlements issued through Stripe and open commercial
   requests.
7. Create and inspect Live resources while the Production flag remains false.
8. Take a recoverable backup, then complete the preflight and smoke checks for
   the intended release.
9. Record an explicit go/no-go decision with named operational owners.
10. Only after go, set the Production flag to `true` and create a new Production
    deployment. A configuration change does not alter an existing deployment.

### Stripe resource and offer contract

Create one active, one-time Stripe Price with unit amount `4900` and currency
`eur` in Test, then a separate equivalent Price in Live. The application
retrieves and rejects a Price that is inactive, recurring, has another amount or
currency, or belongs to the wrong Stripe mode. Archive a retired Price only
after the environment points to its replacement; an already-created request
retains the Price to which its Checkout was bound.

Treat `CHISAN_PROFILE_UPGRADE_TERMS_URL` as an immutable legal artifact for its
corresponding code `PRODUCER_PROFILE_UPGRADE_TERMS_VERSION`. Every request stores
both values as accepted. Any material text change requires a new version and a
new durable URL; keep earlier URLs available for support and audit. Never point
an existing version at replacement content. Rotate the code version and URL
together, and include any Price change in the same reviewed release. An
unattached request whose stored offer no longer matches is auditably expired and
replaced with a new request UUID, so Stripe idempotency cannot return a Session
for an earlier offer. An attached Session keeps its original Price and accepted
terms and may be resumed while new sales are paused; never rewrite it or demand
acceptance of a different version.

Register the environment's endpoint at `/api/webhooks/stripe` for exactly:

- `checkout.session.completed`;
- `checkout.session.async_payment_succeeded`;
- `checkout.session.async_payment_failed`;
- `checkout.session.expired`;
- `charge.refunded`;
- `charge.dispute.created`;
- `charge.dispute.updated`;
- `charge.dispute.closed`;
- `refund.created`;
- `refund.updated`;
- `refund.failed`.

The handler verifies Stripe's signature against the unmodified raw body and
rejects Test/Live event mismatches. It durably leases each event ID and returns a
success response only after processing is recorded; a failure or superseded
lease returns a retryable non-2xx response. Stripe may deliver duplicate or
out-of-order events, so never replace this with redirect-based fulfilment or an
in-memory deduplication flag. The handler does not compare event timestamps to
choose a winner: under the producer lock it retrieves the current Charge and
aggregates all of that Charge's Refunds and Disputes before every decision.
Stripe documents both
[webhook-backed Checkout fulfilment](https://docs.stripe.com/checkout/fulfillment)
and the [raw-body signature requirement](https://docs.stripe.com/webhooks/signature?lang=node).

### Isolated activation test

Before enabling Preview Checkout, complete this isolated Test sequence:

1. apply migration `0006`, run `npx pnpm db:assert-current`, configure the Test
   Price and endpoint, and leave Production untouched;
2. claim a fixture producer with an authorized test account and accept the
   displayed versioned offer;
3. complete hosted Test Checkout and verify that a signed event moves one
   request from `pending` to `paid`, creates exactly one producer entitlement,
   and enables all currently configured premium edit controls;
4. resend the same event and revisit the success page; verify no second request
   or entitlement appears and the return query alone cannot grant access. Pause
   new sales and confirm a bound open Session can resume only while the signed
   webhook configuration remains ready;
5. submit expanded fields, review them, materialize them into the CSV and verify
   the public expanded block renders only while the entitlement is active;
6. exercise an expired/failed Checkout, pending/failed/partial/full refunds,
   multiple disputes on one Charge, an update and won/lost closure with Stripe
   Test tooling. Confirm a pending refund suspends display without conflicting
   the proposal, a failed refund restores only after full reconciliation, and a
   succeeded refund or adverse dispute suspends display without deleting CSV
   cells. Deliver events again out of order and confirm the current Stripe
   aggregate still wins;
7. with an exact active admin grant, open `/admin/premium` and `/admin/pagos`;
   verify the paginated entitlement inventory, gift provenance, current owner,
   paid buyer and commercial-safety history. Prove gift/revoke cannot mutate a
   paid entitlement issued through Stripe or bypass an open request, and prove a
   safe payment retry re-fetches Stripe while an amount, Price, mode or binding
   mismatch offers no override;
8. inspect webhook receipts and runtime logs for retries, conflicts, 5xx errors
   and any unmatched paid Checkout or commercial event.

### Go/no-go gate

Go only when all commercial, fiscal, invoice, refund and terms decisions are
approved; the isolated test covers payment, duplicate and out-of-order events,
expiry, refund and dispute; webhook reconciliation leaves no unexplained
incident; both admin workspaces show the expected access and provenance; support
and incident owners are named; Preview shares no credential with Production;
every Price and secret belongs to the expected mode; and the Checkout kill
switch has been rehearsed without breaking settlement. Any missing condition is
no-go and the flag stays false.

Repeat the resource checks with the Live Price and Live endpoint before an
approved launch, but do not create a real charge merely as a smoke test without
an approved test purchase and refund plan. Deploy and verify with Checkout still
false, then follow step 10 above.

## Stripe adapter incident handling

Use the admin-only `/admin/pagos` as the first read-only view. `paid_unfulfilled`
means Chisan has evidence of captured money but refused to grant or keep the
right. Retry only when the page offers the server-side reconciliation action;
it fetches the bound Checkout and Charge again and repeats every immutable
check. Price, requested amount, captured amount, currency, mode, line-item or
identity mismatches are never overridden. The incident row preserves both the
expected EUR 49 offer and Stripe's actual `Charge.amount_captured`/currency. A
deliberate full refund is terminal when succeeded refunds equal that captured
amount, including for an anomalous amount or currency; this closes the incident
without ever granting the premium right. Both the current queue and commercial
safety history are paginated. The latter is append-only audit, not a local
resolution ledger: it records unmatched paid Checkouts, failed Session
expiration and signed commercial events whose PaymentIntent declares the Chisan
metadata kind but whose request is missing or already bound to another
PaymentIntent. Genuinely unrelated Stripe objects remain ignored. Resolve money
in Stripe and retain Chisan's audit row.

For a non-retryable mismatch or unmatched paid Checkout:

1. compare the Chisan request UUID and displayed Stripe IDs with the matching
   object in the correct Test/Live Dashboard;
2. do not edit the commercial row or entitlement with ad hoc SQL;
3. if the purchase cannot safely be reconciled, issue the deliberate refund in
   Stripe under the approved policy and wait for the signed refund webhook;
4. confirm `/admin/pagos` and the producer page reflect the resulting state, and
   preserve the audit trail for support and accounting.

For a dispute, manage evidence and the financial case in Stripe. Chisan suspends
the expanded block while any current dispute is adverse. A lost dispute becomes
terminal `dispute_lost` so a new owner purchase is possible; a fully refunded
request stays terminal `refunded` even if a later dispute notification arrives.
Only when every current dispute is won, prevented or warning-closed does the
same Stripe reconciliation path consider restoration. It uses the fresh Charge,
not the Charge embedded in an earlier webhook; staff must not reactivate the
entitlement directly.

Refund lifecycle is also Stripe-authoritative. `pending` and `requires_action`
suspend the entitlement but preserve unpublished proposals. Only `succeeded`
amounts count toward partial/full refund state and conflict those proposals.
`failed` or `canceled` never cause permanent revocation; the corresponding
update triggers a complete Charge/refund/dispute reconciliation before any
restoration.

## Payment-adapter replacement or retirement

Replacing the payment service never changes CSV fields, producer identity or
the `producer.profile.premium` capability. First stop new sessions for the
outgoing adapter. Keep its code path, credentials, signed webhook and
reconciliation available while any request, attached session, refund, dispute
or provider event remains open. Historical commercial rows and their
`payment_provider`-scoped references stay immutable. Activate the replacement
through its own reviewed adapter and provenance; retire old secrets only after
all settlement is reconciled and the approved retention window has elapsed.

