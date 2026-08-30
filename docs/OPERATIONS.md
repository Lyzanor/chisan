# Chisan Operations

## Purpose

This is the production runbook for <https://chisan.app>. It owns environment
configuration, preflight, deployment, smoke checks, rollback, backups and secret
handling. `docs/ACCOUNT_SYSTEM.md` owns account semantics and migrations;
`AGENTS.md` owns repository and Git rules. Never copy live deployment IDs,
resource identifiers or secret values into this file.

## Environment contract

Production uses its dedicated Clerk instance and PostgreSQL database. The
expanded-profile capability and its CSV fields do not depend on a payment
provider. Stripe is the currently implemented payment adapter, its activation is
deliberately deferred, and no Stripe resource or secret is required for the
admin-only gift workflow. Local and Preview must never write account or payment
data through Production credentials. If Vercel exposes any Production
integration to Preview, keep both
`CHISAN_ACCOUNTS_ENABLED=false` and
`CHISAN_PROFILE_UPGRADE_CHECKOUT_ENABLED=false` there: Preview may test the
public catalog and disabled fallbacks, but not registration, account writes or
payments.

When accounts are enabled, configure the variables in `.env.example`. Production
uses `NEXT_PUBLIC_APP_URL=https://chisan.app`. Configure one environment at a
time and verify it before proceeding to the next. Stripe uses only a Test secret
outside Production and only a Live secret in Production; the runtime rejects a
mode mismatch and accepts a Live secret only when `VERCEL_ENV=production`.

Track these states independently for each deployment and Stripe mode; do not
conflate them:

- **Deferred and unprovisioned (currently every environment):** keep
  `CHISAN_PROFILE_UPGRADE_CHECKOUT_ENABLED=false`, leave every Stripe and offer
  variable unset, and provision no Chisan Stripe resource.
- **Activation staged:** approved resources and configuration may exist while
  the switch remains false. Enable it only in the isolated Test sequence or
  after the Production go/no-go gate; staging alone is not a launch.
- **Sales paused after activation:** at least one Session has existed in that
  environment and mode. Keep the switch false to stop new Sessions, but preserve
  the Stripe account, keys, webhook endpoint and secret, historical Prices and
  terms, durable provider references and reconciliation path. Captured payments,
  refunds, disputes and already-bound Sessions must still settle. Never turn
  this state into deferred/unprovisioned cleanup.

Future profile purchases require all of the following:

- `CHISAN_PROFILE_UPGRADE_CHECKOUT_ENABLED=true`;
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and
  `STRIPE_PROFILE_UPGRADE_PRICE_ID` from the same Stripe mode;
- `CHISAN_PROFILE_UPGRADE_TERMS_URL`, as a safe same-site path or HTTPS URL to
  the versioned offer/refund terms;
- `CHISAN_BILLING_SUPPORT_EMAIL`, as the monitored customer-support address;
- enabled accounts and the current account database schema.

The switch never controls administrative gifts and, after activation, controls
creation of new Checkout Sessions only. A current owner may re-fetch an
already-bound Session without changing its requester or creating a payment.

Public discovery is an explicit Production capability. Unless
`CHISAN_PUBLIC_DISCOVERY_ENABLED=true` is set in Production, Chisan emits global
`noindex, nofollow` metadata, serves `robots.txt` with `Disallow: /` and no
sitemap announcement, and serves an empty sitemap. Preview remains closed even
if the flag is set. At public launch, enable the flag only in Production and
review the Vercel Firewall AI Bots policy in the same release so the crawler
policy and edge enforcement change together. This discovery policy is not
access control: anyone with a URL can still open the public catalog.

Programmatic advertising is a separate, reversible Production capability.
`CHISAN_ADSENSE_ACCOUNT_ID` publishes only the ownership meta tag and
`/ads.txt`; it does not load Google code. Keep
`CHISAN_PROGRAMMATIC_ADS_ENABLED=false` until AdSense marks the site ready, the
Google-certified consent message is published and
`CHISAN_ADSENSE_CMP_READY=true` records that reviewed state, and
`CHISAN_ADSENSE_AREA_SLOT_ID` identifies the reviewed manual display unit. When
enabled, the runtime admits one lazy horizontal unit only on area pages with at
least ten producers. It never admits ads on the home page, producer profiles,
account or administration routes, policies, errors or empty/thin area pages.
Auto Ads and automatic optimization remain disabled in AdSense. Advertising
never changes catalog inclusion, ordering, verification or editorial copy.
Preview and Development stay ad-free even if their variables are copied.

There are two distinct off states. For a temporary pause, set
`CHISAN_PROGRAMMATIC_ADS_ENABLED=false` and redeploy; the loader and all slots
disappear while ownership and `ads.txt` remain. For complete removal, also
remove `CHISAN_ADSENSE_ACCOUNT_ID` and `CHISAN_ADSENSE_AREA_SLOT_ID`, redeploy,
and then remove or close the site in AdSense through an explicitly approved
account operation.

`CHISAN_ADMIN_EMAILS` is bootstrap provisioning, not request-time authorization.
Remove it after the permanent admin grant exists; a staff grant in PostgreSQL is
the durable authority.

Translation-provider credentials belong only to the local editorial generation
process. They are never `NEXT_PUBLIC_*` values, are not configured in the
deployed Next.js runtime and must not be required for a build or page request.
Production renders only checked-in, validated translation sidecars; it never
calls a translation provider at request time.

## Preflight

1. Run `git status --short`, `git diff --name-status` and `git diff --stat`.
   Preserve unrelated work and confirm the release contains only the intended
   scope.
2. Run `pnpm install --frozen-lockfile`. Every dependency change and its
   generated `pnpm-lock.yaml` update are one atomic release change; never relax
   frozen-lockfile to hide a mismatch.
3. Run `npx pnpm verify:ai`. A data-only release may use
   `npx pnpm verify:data`, but any code, validator, policy, migration or account
   change requires the full gate.
4. When accounts are enabled in the target environment, run the read-only
   `npx pnpm db:assert-current` with an explicit current direct `DATABASE_URL`,
   or open `/admin/sistema` to run the same contract through the deployed
   application role. Do not use `vercel env run` for this assertion: sensitive
   database-integration variables are intentionally not exported to local
   processes and a local `.env` value could otherwise be mistaken for the
   Production connection.
5. Confirm Production has the Chisan domain, Production Clerk keys, signed
   Clerk webhook secret, Production database URLs and the canonical app origin.
   For an ordinary release while Stripe remains deferred, confirm the
   unprovisioned state above. For an approved activation or reactivation release,
   confirm the signed Stripe webhook secret and Stripe Live Price. If sales are
   paused after activation, confirm the flag is false while the endpoint,
   secrets and reconciliation path remain operational. Check names, modes and
   scopes without printing values.
6. For a schema change, take a recoverable database backup and prove the
   migration in an isolated database before touching Production. Migrations must
   be expand-first and backward compatible; a build never applies DDL.
7. Exercise the public change and disabled-account fallback in Preview. Exercise
   account writes there only after proving its resources are isolated from
   Production; otherwise use a purpose-built isolated test environment.
8. For a Stripe activation or offer change, confirm with the business owner or
   adviser whether EUR 49 is the final customer price, how VAT/tax and receipts
   are handled, and that the versioned refund/support terms match the configured
   Checkout. Code must not guess a fiscal policy.

### Localized catalog release preflight

Before publishing or changing one locale:

1. Generate with an explicit country, target locale and bounded area or batch.
   Record the selected engine, engine version, prompt version and glossary
   version, and inspect the resulting sidecar diff without printing credentials.
2. Run the translation checks for the changed scope and then the repository
   gate. Every non-empty description rendered by the locale must have either
   canonical prose in that locale or a current sidecar row whose source locale
   and source hash match. Stale reviewed rows block release and are never
   replaced automatically. The gate reapplies exact numeric-token, ordered
   quantitative-fact, URL, protected-term, length and unchanged-source
   invariants to current machine and reviewed rows; a current machine row that
   fails them is never reused by the generator.
3. Review every changed row containing a quantitative fact, including its
   association with the surrounding translated claim. Review a stratified
   language sample of the remaining rows, including proper names,
   appellations, URLs and atypical length. A successful validator proves
   structure and freshness, not faithful translation.
4. Confirm the locale has complete dictionaries, territory labels, category and
   controlled-value labels, metadata templates and effective manifest labels
   for the exact country, region and areas being activated.
5. Enable the locale in `country.json` only after those inputs are complete.
   Confirm selector, `hreflang` and sitemap enumeration derive from that same
   effective manifest policy rather than a manual release list.
6. Run `npx pnpm verify:ai` for manifest, routing, contract or behavior changes.
   A sidecar-only data batch may close with `npx pnpm verify:data`; use
   changed-only translation checks while iterating.

Before selecting or changing the automatic translation engine, build a fresh
source-only benchmark plan and generate candidates into an ignored local path:

```bash
npx pnpm benchmark:translations --plan --output /tmp/chisan-translation-plan.json
CHISAN_TRANSLATION_MODEL=model-id \
CHISAN_TRANSLATION_ENGINE_VERSION=reproducible-version \
npx pnpm benchmark:translations --run /tmp/chisan-translation-plan.json \
  --output /tmp/chisan-translation-candidates.json
```

The candidate file stays `review_status=unreviewed` and every
`human_review=null` until a qualified reviewer compares it with the matching
plan. `repair_attempted=true` identifies an output that first failed a
mechanical invariant and passed one isolated singleton repair; a second failure
aborts without writing a sidecar. Numeric-token and ordered quantitative-fact
failures are stricter: they abort on the initial response without a repair
request, produce no sidecar and disqualify that engine from approval for the
target locale. Unchanged source text is rejected when source and target locales
differ. Neither rule proves that the result is actually fluent or in the
requested language. Review all 50 or more stratified samples for every target
in the benchmark, recording factual additions/omissions, terminology, fluency
and identity preservation. Automated validation cannot select the engine. Only
after every target-language assessment approves the same locked engine, prompt
and glossary versions may those identifiers be used to materialize sidecars.

Location-boundary activation is a separate release decision. When included,
confirm the source date and redistribution licence, validate the reference
geometry and deterministic browser assets, exercise ambiguity fixtures, and
follow `docs/LOCATION_ROUTING.md`. Locale completeness never compensates for
missing geometry, and geometry never authorizes a new locale.

### Producer-change freeze for an atomic CSV schema migration

Adding a universal CSV column changes every producer row hash. Before that
commit, set `CHISAN_PRODUCER_CHANGES_ENABLED=false` in the Production
configuration while leaving accounts enabled, then create and verify a new
Production deployment from the currently approved commit. Changing a Vercel
environment variable does not alter the deployment already serving traffic.
Confirm that new profile-change submissions are blocked before continuing;
existing requests and staff review remain available. Then use the dedicated
read-only command to inventory every page of `draft`, `submitted`,
`needs_changes`, `approved` and `applying` requests. Drain or explicitly resolve
each one, and do not widen the CSV while any `applying` execution remains.

Keep the switch false through the CSV migration, application deployment and
new-form smoke check. Re-enable it in the Production configuration only after
new requests capture and validate the widened row schema, then create and verify
a new Production deployment before accepting submissions again. The switch is
an operational barrier, not durable queue state, and never authorizes rewriting
claims, memberships or historical closed requests.

The initial expanded-profile release is exactly such a migration: all area CSVs
move together to the header ending in `visitas guiadas`, `mensaje a la
comunidad`, `mensaje_comunidad_locale`, `enlace destacado 1` and `enlace
destacado 2`. Apply the producer-change freeze before that commit, drain every
open row-hash-dependent request, and keep Checkout disabled until migration
`0006`, the widened catalog, application code and new-form smoke check are all
live together.

### Deferred Stripe adapter activation and future launch

**Current state: deliberately deferred, with no launch date.**

The application code, migration `0006`, widened CSV schema, entitlement model
and admin operations may be deployed while Stripe remains unprovisioned. Stripe
is a replaceable adapter for issuing and reconciling a producer-scoped
entitlement; it is not the authority for premium CSV fields, editorial review or
public presentation. Replacing it later must preserve entitlement provenance and
commercial history without changing the CSV contract or reinterpreting historic
Stripe references. A replacement receives its own configuration, provenance and
operational runbook. `docs/ACCOUNT_SYSTEM.md` owns the provider-neutral semantics;
this section owns only the dormant Stripe adapter's future provisioning,
activation and incident procedure.

Until the business owner explicitly schedules a payment launch:

- remain deferred and unprovisioned as defined above;
- do not advertise or promise paid profile upgrades;
- use only the separately audited `/admin/premium` gift workflow when Chisan
  deliberately grants an expanded profile without payment.

#### Decisions required before provisioning

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

#### Future resource inventory

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

#### Future activation sequence

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

#### Stripe resource and offer contract

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

#### Isolated activation test

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

#### Go/no-go gate

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

### Stripe adapter incident handling

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

### Payment-adapter replacement or retirement

Replacing the payment service never changes CSV fields, producer identity or
the `producer.profile.premium` capability. First stop new sessions for the
outgoing adapter. Keep its code path, credentials, signed webhook and
reconciliation available while any request, attached session, refund, dispute
or provider event remains open. Historical commercial rows and their
`payment_provider`-scoped references stay immutable. Activate the replacement
through its own reviewed adapter and provenance; retire old secrets only after
all settlement is reconciled and the approved retention window has elapsed.

## Database and deployment order

For a release with committed migrations:

1. keep the new capability disabled;
2. apply `npx pnpm db:migrate` explicitly with the target's direct migration
   connection;
3. run `npx pnpm db:assert-current` against the target runtime database;
4. deploy compatible application code to Preview and complete the public and
   disabled-account smoke checks;
5. enable and verify the capability in Preview only if its account resources are
   isolated; otherwise keep both account flags false and use an isolated test
   environment for account-write checks;
6. repeat the migration assertion for Production, then push the verified commit
   to `main` once.

That migration-first order remains canonical for additive, backward-compatible
changes. Migration `0005` is a deliberate contraction exception and requires a
disabled-account release window because the Vercel build asserts the exact
committed migration count. Set `CHISAN_ACCOUNTS_ENABLED=false` in the Production
configuration, create and verify a new Production deployment of the binary that
no longer selects `users.locale`, apply the `DROP COLUMN` with
`npx pnpm db:migrate`, and run `npx pnpm db:assert-current` from an explicitly
enabled operator environment. Then set `CHISAN_ACCOUNTS_ENABLED=true`, create a
second Production deployment of that same compatible commit and complete the
account smoke check. Accounts are not active again until that second deployment
is serving traffic. Do not attempt a binary-first deploy with accounts enabled:
its build must fail closed while `0005` is unapplied.

GitHub triggers the initial Vercel Production build from `main`; do not duplicate
that initial deployment manually. A verified configuration change is the
exception: Vercel environment changes apply only to new deployments, so each
freeze or reactivation above requires a subsequent deployment even when the
commit is unchanged. The build asserts migration compatibility and fails closed
when accounts are enabled against an outdated schema.

The current account runtime and migration URLs may use different pooled/direct
endpoints, but they must authenticate as the same schema-owning PostgreSQL role.
`db:assert-current` now also proves that the runtime can select and update the
execution columns needed to cancel a fence atomically during membership
revocation. Do not switch `DATABASE_URL` to a distinct SQL identity until a
dedicated account-runtime role migration covers the full existing account DML;
the narrow agent roles below are never a runtime substitute.

## Neon access for producer-change agents

Agent access is database authority, not an application environment variable.
Never add `CHISAN_ADMIN_READ_DATABASE_URL` or
`CHISAN_PRODUCER_CHANGE_OPERATOR_DATABASE_URL` or
`CHISAN_PRODUCER_CHANGE_RECOVERY_DATABASE_URL` to Vercel. Keep the application
runtime role and `DATABASE_MIGRATION_URL` separate from all agent identities.
The read, operator and recovery roles have no privileges on
`producer_profile_upgrade_requests`; provider-specific identifiers (currently
Stripe), commercial state and payment provenance are available only through the
application runtime and staff workspace.

The stable `NOLOGIN` roles, explicit grants, durable execution table and
versioned workflow functions are installed by the account migrations. Create
rotating `LOGIN` identities only through SQL: roles created through Neon Console,
CLI or API receive `neon_superuser` and are unsuitable for least-privilege
agents. Provision one principal per runner or person after the migration is
current:

```bash
# Supply the direct Neon owner URL only to this process or this ignored 0600 file.
# .env.migration.local
# DATABASE_MIGRATION_URL=postgresql://...

# Provision only the capability this runner needs.
npx pnpm producer:access provision read codex_reader_a
npx pnpm producer:access provision operator codex_operator_a
npx pnpm producer:change doctor --access read --json
npx pnpm producer:change doctor --access operator --json

# Recovery is an incident-only staff authority. Provision it to a separate
# principal and secret context, never to a normal operator runner.
npx pnpm producer:access provision recovery staff_recovery_a
npx pnpm producer:change doctor --access recovery --json
```

Each provisioning command creates or rotates only
`chisan_agent_<capability>_<principal>`, proves it has no administrative or
direct table-write privileges, and writes only that capability's ignored env
file with mode `0600`. The migration file must also be a regular, non-symlink
file owned by the current operating-system user with no group or world access.
Provisioning rejects a pre-existing role unless it is already the exact managed
login, and it never prints a connection string. Remove the migration credential
from the workstation after the operation unless an approved secret manager
injects it on demand.

Filesystem separation is part of the permission boundary. A workspace that
contains `.env.producer-change-operator.local` has operator authority even if an
agent normally runs only `list` or `show`. Reader-only agents must run in a
workspace or secret-injection context that does not contain the operator file.
The recovery file is stronger incident authority and belongs in a separate,
staff-supervised workspace or one-shot secret-injection context; never colocate
it with a routine operator agent.

Recovery is eligible only after PostgreSQL's 24-hour quarantine. Use `/admin` or
a reader context to confirm the exact request and execution, verify that the
original worktree is abandoned, then inject only the recovery credential into
the supervised staff workspace and run:

```bash
npx pnpm producer:change recover <change-request-uuid> <execution-uuid> \
  --reason "Original operator worktree was retired after incident review."
```

The command requires a clean, tracked and audited CSV at the current Git `HEAD`.
It accepts only the exact reviewed base or approved producer hash, cancels the
old fence and returns the request to `approved`. Remove the recovery secret,
switch to a normal operator context, and run `materialize` and `finalize`; the
recovery role cannot perform either operation.

For rotation without interrupting work, provision a new principal suffix for
one capability, verify its matching doctor, move that runner to the new injected
secret or env file, confirm no active `producer_change_executions` belongs to an
old operator login, then revoke and drop only the retired login through the
migration owner. Stable group roles and workflow functions do not rotate.
Protect the Neon Production branch before enabling Preview branching; otherwise
child branches may copy Production role passwords. Every Preview worker still
requires its own isolated branch and credentials.

## Production smoke check

Use a real authorized account only where authentication is required. Do not
submit a fictitious ownership claim or producer change merely to test a form.

- Open `/`, one area and one producer detail; confirm canonical links use
  `https://chisan.app`.
- Confirm `/privacy` is reachable from the footer. When AdSense ownership is
  staged, confirm the page source contains the expected
  `google-adsense-account` meta tag and `/ads.txt` returns the exact authorized
  seller line with `200 OK`.
- While public discovery is disabled, confirm pages emit `noindex, nofollow`,
  `robots.txt` contains only the catch-all `Disallow: /` rule and the sitemap is
  empty. When public discovery is enabled, confirm those directives are removed,
  the intended private paths remain disallowed and the sitemap contains only
  canonical `https://chisan.app` URLs.
- Signed out, confirm `/cuenta` and `/admin` follow the expected authentication
  or authorization path and public catalog pages remain usable.
- Signed in, confirm the internal profile loads, add and remove one favorite,
  and leave the account in its original state.
- Confirm an unauthorized producer edit redirects with a controlled message and
  does not produce a 5xx response.
- With staff access, open `/admin`, `/admin/reclamaciones`, `/admin/cambios`,
  `/admin/premium` and `/admin/pagos`; with exact administrator access also open
  `/admin/sistema` and confirm the database contract is healthy. Inspect every
  registry and queue without changing real decisions, gifts or payments.
- Send no hand-built signed webhook. An unsigned request may be used only to
  confirm rejection. Use Clerk's test-event facility for its isolated account
  environment. Exercise Stripe signed events only after its Test adapter is
  provisioned, through the isolated activation procedure above.
- Inspect runtime logs for new 5xx responses, authorization exceptions, database
  errors or repeated webhook failures.
- While programmatic ads are disabled, confirm there are no requests to
  `pagead2.googlesyndication.com` and no reserved ad block. After the reviewed
  activation, confirm exactly one labelled block appears between categories and
  map/list only on eligible area pages, the consent message can be reopened,
  and Core Web Vitals show no material regression.

### Localized catalog smoke check

For every locale activated by the release:

- Open a country-default short URL and an alternate composite URL at area and
  producer depth. Confirm a redundant default composite redirects permanently
  to the short form and preserves safe query parameters.
- Inspect raw HTML before client JavaScript: `lang`, visible navigation,
  description, title and metadata must agree. Each real variant is
  self-canonical and its reciprocal language alternates resolve to the same
  country, area and producer.
- Confirm no indexed variant falls back to a description in another language.
  Names, municipality, address, official products, published hours, contacts
  and URLs must remain the canonical source-authored values.
- Use the language switcher on the same producer and verify it preserves the
  producer and safe filter state. Signed in with a real account, confirm both
  variants expose the same favorite, claim and producer-edit authorization;
  do not create a fictitious claim to test this.
- Confirm the sitemap includes only complete, canonical published variants and
  the existing public-discovery flag still controls indexing, robots and
  sitemap exposure for every locale.
- On `/`, confirm the manual selector works without granting location. The
  native prompt must appear only after **Use my location**. Exercise success in
  a controlled Preview fixture and denial, timeout or ambiguous-border fallback;
  inspect requests, storage and telemetry to ensure no raw coordinate leaves
  ephemeral browser memory.

## Rollback and containment

If the account subsystem fails while the public catalog is healthy, set
`CHISAN_ACCOUNTS_ENABLED=false` and redeploy the same known code path. This is
the first containment action because it removes account writes without taking
the CSV catalog offline.

If only new expanded-profile sales fail, first set
`CHISAN_PROFILE_UPGRADE_CHECKOUT_ENABLED=false` and redeploy. Keep the Stripe
webhook, database and account system operational so already-captured payments,
refunds and disputes can settle. The base CSV profile remains public even when
the commercial database is unavailable; the expanded block fails closed. Do
not delete premium CSV cells or revoke entitlements as rollback cleanup.

For an application regression, promote only a compatible known-good Vercel
deployment or revert the offending commit on `main`, then repeat the smoke
check. The expanded-profile release establishes a rollback floor: a compatible
deployment must understand migration `0006`, the canonical expanded-profile CSV
schema and every payment-adapter settlement lifecycle that has accepted money.
Once the widened catalog is published, and especially once any provider session
can capture payment, never promote a pre-feature deployment below that floor.
Freeze producer changes and new payment sessions, keep provider event settlement
running, and repair forward or promote another deployment above the floor. Do
not deploy an unreviewed local build as a shortcut.

Do not run destructive down migrations. Expand-first migrations remain in place
while old compatible code runs; repair forward in a new migration. Restore a
database backup only for confirmed data loss or corruption, into an isolated
database first, with account writes stopped and an explicit reconciliation plan
for events received after the backup.

Rotate a Clerk, database or webhook secret immediately if it appears in a log,
screenshot, chat, shell history or repository. Update the affected environment,
redeploy, verify, and revoke the exposed value only after the replacement works.

To withdraw a localized catalog variant without touching producer or account
state:

1. Remove the affected locale from the effective `country.json` manifest
   policy so selectors, language alternates and sitemap generation stop
   publishing it from the same source.
2. Keep its checked-in translation sidecar for diagnosis and later recovery;
   do not delete reviewed text as incident cleanup.
3. If the composite route was not indexed, redirect it in a controlled way to
   the country's short default route. If it may already be indexed, use the
   incident's reviewed redirect or temporary `noindex` response rather than
   serving incomplete mixed-language content.
4. Redeploy the known-good application and repeat the default-route, indexing
   and account-identity smoke checks.
5. Do not migrate, delete or rewrite favorites, claims, memberships, change
   requests or producer keys. The short `/<country>` routes and their durable
   `(country, producer_id)` references remain valid throughout rollout and
   rollback.

Disable location onboarding or the affected boundary independently when its
geometry or privacy behavior fails. Keep manual selection available and do not
substitute IP geolocation, a nearest-area guess or producer coordinates.

## Backup, restore and identity-provider exit

Before a migration, identity-provider exit or high-risk account release:

1. stop account writes while leaving the public catalog available;
2. take an encrypted PostgreSQL backup and a Clerk user export, including
   password hashes where supported;
3. record non-PII row counts for users, identities, favorites, claims,
   memberships, changes, grants, audit events, webhook receipts, entitlements
   and profile-upgrade requests, plus checksums of the encrypted artifacts;
4. restore the database into an isolated environment, run
   `npx pnpm db:assert-current`, and reconcile the recorded counts;
5. retain artifacts only under the approved access and retention policy, then
   destroy the test restore when the drill is complete.

The PostgreSQL backup contains all Chisan-owned account and domain state. Clerk
sessions are disposable, and MFA, passkeys or social connections may require
re-enrollment after a provider migration. Follow the identity mapping procedure
in `docs/ACCOUNT_SYSTEM.md` rather than rewriting domain foreign keys.

There is no self-service Chisan erasure flow in the current release. Do not
simulate one with ad hoc SQL or by deleting only the Clerk user; preserve the
request and escalate it to an audited implementation that can redact PII,
revoke resources and retain only the minimum integrity history coherently.
