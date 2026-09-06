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
The Vercel build runs the structural translation gate before the database
assertion and application build. This final fail-closed check does not replace
the local diff review, semantic review or repository gate.

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

Use `npx pnpm report:translation-readiness` to inspect the sole published
country without provider calls or catalog writes. Pass `--country <cc>` for a
deliberate override or `--all-countries` for a cross-catalog report; add
`--area <area>` or `--target-locale <locale>` for a bounded report. Its statuses distinguish
missing or stale machine rows from translations that require renewed human
review; they do not prove full publication readiness.

1. After adding or changing canonical translatable profile prose
   (`descripcion`, `quien hay detras` or `historia`), run
   `npx pnpm check:translations:changed`. Missing or stale machine rows produce
   the exact bounded country, target-locale and area generation command;
   stale reviewed rows instead require explicit renewed review. Generate only
   that scope, record the selected engine, engine version, prompt version and
   glossary version, and inspect the resulting sidecar diff without printing
   credentials.
2. Run the translation checks for the changed scope and then the repository
   gate. Every non-empty translatable profile field rendered by the locale must
   have either canonical prose in that locale or a current sidecar row for that
   exact field whose source locale and source hash match. Missing or stale rows are omitted from that language and exclude the
   incomplete producer variant from indexing; they do not block canonical
   corrections. Reviewed rows are never replaced automatically. The gate reapplies exact numeric-token, ordered
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
   changed-only translation checks while iterating. Commit any regenerated sidecars with their canonical source change.
   When translation work remains, inspect the notices and the affected
   indexing coverage before closing the change.

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
follow `docs/VISITOR_LOCATION_ROUTING.md`. Locale completeness never compensates for
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

The later portable-location migration widens the same canonical header with
required trailing `country`, `region` and `area` columns. Each row copies the
exact three path slugs from `data/csv/<country>/<region>/<area>.csv`; use the
same producer-change freeze, queue drain, atomic application deployment and
post-deployment smoke check before accepting new proposals against the widened
row hashes.

The premium-story migration appends `video`, `quien hay detras`,
`quien_hay_detras_locale`, `historia`, `historia_locale` and `fecha ultimo
cambio` after those portable-location columns. The two prose fields participate
in the country sidecars; the date is materialized automatically from an
approved request's `reviewed_at` in UTC and is never form input. Freeze and
drain row-hash-dependent requests before deployment, then re-enable producer
changes only after the widened catalog, validators, form and public premium
block pass the production smoke check together.

### Payment adapter operations

Stripe provisioning, launch decisions, offer configuration, isolated tests,
incidents and retirement are owned by `docs/STRIPE_RUNBOOK.md`. Follow that
runbook only for payment work. Ordinary catalog releases do not activate Stripe.

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

Every requested push still publishes the complete committed history to GitHub.
`scripts/vercel-ignore-build.mjs` only suppresses the Vercel build when every
changed file is deployment-neutral: repository documentation, country agent
guides, editorial evidence, Markdown design records, GitHub workflow files or
test-only scripts. Any public catalog row or sidecar, image, application source,
runtime configuration, dependency, build/check script, or mixed change builds
and deploys normally. If the previous successful deployment cannot be resolved
inside Vercel's shallow clone, the classifier fails open and the build runs.
GitHub CI remains authoritative and continues to validate every push, including
ones whose Production build is skipped.

The current account runtime and migration URLs may use different pooled/direct
endpoints, but they must authenticate as the same schema-owning PostgreSQL role.
`db:assert-current` now also proves that the runtime can select and update the
execution columns needed to cancel a fence atomically during membership
revocation. Do not switch `DATABASE_URL` to a distinct SQL identity until a
dedicated account-runtime role migration covers the full existing account DML;
the narrow agent roles below are never a runtime substitute.

## Producer statistics activation

Apply the additive `0011_producer_statistics` migration and run the normal
migration assertion before deploying the collector. It creates private daily
view totals and temporary random event receipts. It grants no access to the
producer-change SQL roles. Preserve the existing schema-owner runtime role.

`CHISAN_PRODUCER_STATS_ENABLED=true` enables collection and reporting, and requires
`DATABASE_URL`. It defaults off. Keep it off in Preview/Development unless the
database and account configuration are isolated from Production. Before enabling
Production, verify an anonymous profile opening, a second opening counted as a
second visit, transport deduplication, signed-in team exclusion, and the premium
owner's private totals. Confirm a non-owner and an expired premium owner cannot
read totals, and a database outage leaves public profiles usable.

Set the flag false to pause collection/reporting without altering retained data.
There is no historical backfill. Existing Vercel Analytics figures are separate
and are not imported. Random event receipts older than yesterday are pruned on
collection and authorized reads; idle receipts remain until the next operation.
Daily aggregate totals contain no visitor identities and are retained. See
[Producer statistics](PRODUCER_STATISTICS.md) for the measurement contract.

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

## Selection QR release

Apply the additive `0009_selection_context` migration before deploying code that
reads the optional `users.selection_title` and `users.selection_description`
columns. Follow the account migration preflight and confirm `db:assert-current`;
no handles, sharing flags, entitlements or producer facts are migrated.
Use an isolated account environment to verify favorite selection, private preview,
visibility, activation, download, producer navigation and sharing revocation.
Existing printed `/u/<public_handle>` and producer URLs keep their destinations.
Do not test these writes using Production credentials in Local or Preview.

## Production smoke check

Use a real authorized account only where authentication is required. Do not
submit a fictitious ownership claim or producer change merely to test a form.

- Open `/`, one area and one producer detail; confirm canonical links use
  `https://chisan.app`.
- Confirm the home page, catalog routes, normalization rewrites and sitemap
  expose only manifest-published countries. Direct requests to a representative
  standby country return 404 while its catalog remains valid under the full
  data and translation checks.
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

## Reviewed producer publication

Product proposals use the same commands and review boundary as base profile
changes. The v2 execution functions bind both the canonical CSV row hash and the
approved content-package hash. Run the current operator after migration `0010`;
v1 functions deliberately refuse requests with `content_change`. Include the
JSON package and any CSV change in the same reviewed Git commit. A product-only
change whose approval date is already in the CSV may commit only its JSON.
Finalization checks both approved states at that commit and at HEAD.

Materialization acquires a local content lock, validates references/assets and
writes both files before completing its database receipt. On a known failure it
restores only files still matching its own write; uncertain database completion
or concurrent file changes require inspection and preserve recoverable output.
An abandoned `.json.lock` needs the same process/worktree investigation as the
local content workflow. Recovery additionally checks that the clean package is
exactly the reviewed base or approved result. Never finalize only the CSV for a
proposal that also contains products.


```bash
# 1. Apply one approved request locally and validate its CSV.
npx pnpm producer:change materialize <change-request-uuid>

# 2. Inspect the diff, inspect translation notices, add public evidence, and run the gate.
npx pnpm check:translations:changed
npx pnpm verify:data
git add <csv-evidence-and-required-translation-sidecar-files>
git commit -m "data: apply reviewed producer profile change"

# 3. Bind the request to the commit that contains its CSV.
npx pnpm producer:change finalize <change-request-uuid> <full-40-char-commit-sha>

# 4. Push main; GitHub/Vercel then make the committed CSV public.
git push origin main
```

When the approved patch changes `descripcion`, `quien hay detras`, `historia`
or any of their paired source-locale columns, the changed translation check
prints bounded generation commands for missing or stale machine rows. A stale
`reviewed` row must be reviewed again and is never replaced automatically. The
request's CSV and any regenerated sidecars may be committed together. Missing or stale
translations are omitted from public prose and indexing until regenerated;
they do not block the canonical correction.

Materialization refuses stale base hashes, missing producers, revoked membership
or required entitlement, non-allowlisted fields, invalid values and a dirty
target CSV. Before writing,
it acquires a durable execution lease unique to the request, producer and CSV;
that lease fences separate agent worktrees, while advisory locks serialize its
acquisition. The request stays `approved` until the local atomic write and CSV
audit succeed, then the execution becomes `materialized` and the request becomes
`applying`. A clean CSV that already contains the exact patch is audited too;
only the same live execution may resume its own exact dirty post-write snapshot
after a crash. Finalization proves that the supplied commit shares history with
the execution's recorded source `HEAD`, that the commit itself introduced the
approved producer-row hash relative to its first parent, and that the current
`HEAD` still contains that exact row at the fenced CSV path. It never trusts an
uncommitted working tree. The `applied` state therefore means committed to the
canonical CSV and still present at finalization time, not yet deployed.

### Staff operations workspace and agent reads

`/admin` is the staff operations workspace. Its producer-change registry is a
durable view over every `producer_change_requests` state, not only the review
queue. `/admin/cambios/<change-request-uuid>` is the stable operational permalink
for one request and shows its actors, timestamps, requested diff, current CSV
comparison, notes, applied commit and targeted audit timeline. The request row is
the current state; `audit_events` explains recorded transitions and must not be
used as a reconstructed replacement for that row.

`/admin/premium` owns the entitlement registry and audited gift controls;
`/admin/pagos` owns the current payment-adapter incident queue and safety
history. Both require an exact active admin, neither writes CSV, and neither may
override the other domain. Their full semantics are defined above.

The workspace and local automation share the status vocabulary in
`lib/accounts/producer-change-workflow.ts` and the read model in
`lib/admin/producer-change-requests.ts`. Agents read requests through the
versioned, read-only JSON commands instead of scraping HTML or querying tables
directly:

```bash
npx pnpm producer:change list --status approved --json
npx pnpm producer:change show <change-request-uuid> --json
```

List output excludes private notes and full snapshots; `show` includes them for
an operator with database access. The versioned `show --json` schema currently
uses version `2` and includes the active execution (or latest attempt), its
durable IDs and timestamps, and the calculated recovery-eligibility time.
Neither command mutates request state or the catalog. Each capability uses a
separate Neon identity and never falls back to the application's `DATABASE_URL`
or the migration owner:

- `CHISAN_ADMIN_READ_DATABASE_URL`, loaded locally from
  `.env.admin-read.local`, is accepted only for `list`, `show` and read access
  diagnostics.
- `CHISAN_PRODUCER_CHANGE_OPERATOR_DATABASE_URL`, loaded locally from
  `.env.producer-change-operator.local`, is accepted only for `materialize`,
  `finalize` and operator diagnostics.
- `CHISAN_PRODUCER_CHANGE_RECOVERY_DATABASE_URL`, loaded locally from
  `.env.producer-change-recovery.local`, is accepted only for supervised
  recovery and recovery diagnostics.
- All three files are local secrets, ignored by Git and never configured in the
  deployed Vercel application.

The reader has explicit column-level `SELECT` grants and sees audit rows only
through the producer-change-targeted audit view. The operator inherits those
reads but cannot enumerate memberships or account status directly and has no
direct `UPDATE`, `INSERT`, `DELETE`, DDL or ownership. It may execute only the
versioned `SECURITY DEFINER` producer-change functions;
their `NOLOGIN` owner has the internal table permissions, a fixed safe
`search_path`, and records `session_user` as the actor. Check the boundary before
automation runs:

```bash
npx pnpm producer:change doctor --access read --json
npx pnpm producer:change doctor --access operator --json
npx pnpm producer:change doctor --access recovery --json
```

An agent may select only `approved` requests and invoke `materialize` and
`finalize`, but it must run in a controlled Git worktree outside the deployed
Vercel application. Every attempt records its execution UUID, SQL operator,
opaque worktree key, source `HEAD`, expected row hash, CSV and timestamps.
Unfinished pre-write leases expire after fifteen minutes and can be superseded;
a `materialized` execution remains fenced until exact finalization so another
worktree cannot duplicate a possibly committed change. Recovery of an abandoned
materialized execution is a separate staff capability, never an operator
capability or an automatic timeout. PostgreSQL rejects recovery during the first
24 hours after materialization. After that quarantine, staff must identify the
exact execution and record a substantive reason from a clean, audited Git state:

```bash
npx pnpm producer:change recover <change-request-uuid> <execution-uuid> \
  --reason "Original operator worktree was retired after incident review."
```

Recovery only cancels that fence and returns the request to `approved`. It never
adopts, edits or finalizes a CSV; a normal operator credential must run
`materialize` again, which either reapplies the reviewed patch or validates the
exact already-present state. The recovery login inherits read access but cannot
execute the five normal operator functions, and the operator cannot execute
recovery. Revoking producer access conflicts every unpublished request and
cancels each live execution in the same producer-locked transaction.

## Producer retirement inspection

Run `pnpm producer:inspect <country> <producer_id>` before a retirement or merge.
Supply `CHISAN_CATALOG_INSPECT_DATABASE_URL` explicitly in that process, using a
connection with SELECT access to favorites, claims, memberships, change requests,
executions, entitlements and commercial requests. This purpose-specific input
never falls back to `DATABASE_URL` or another local environment file. The command
uses a read-only transaction and reports counts without private row content.

`--catalog-only` is useful for local planning, but explicitly leaves account
references unchecked. Missing access or a query failure cannot establish that
there are no references. A completed inventory is not retirement approval:
resolve live resources through audited account operations, retain needed history,
and migrate/remove related content with the canonical row. No inspection command
changes a database or CSV.


## Premium image inbox release

Apply additive migration `0012_producer_media_uploads` after a recoverable backup
and an isolated rehearsal, then run `db:assert-current` before pushing the image
editor. Existing v1 product proposals remain valid. V2 content proposals add gallery
metadata and a manifest of immutable private uploads; the existing v2 operator
receipt still binds the resulting complete content hash.

The account runtime uses the existing schema-owner connection. The operator role
receives read access to prepared bytes, with no direct insert/update/delete grant.
There are no new object-storage credentials. Private bytes remain in the account
inbox until reviewed publication copies them into Git; see the bounds and
retention rules in `docs/PRODUCER_CONTENT.md`.

For image proposals, materialize, validate and commit all listed assets with the
JSON and any changed CSV row before finalization. The CLI verifies image digests
in both the materializing commit and current HEAD. Do not publish only the JSON,
edit prepared bytes or substitute a different image after approval. If an asset
changes during rollback, preserve it and investigate the exact execution.

## Google login and account-photo rollout

Before releasing account photos and producer favorite attribution:

1. Apply the normal database backup and migration preflight, then apply
   `0013_user_presentation` and run `pnpm db:assert-current` with the runtime role.
   This additive migration creates no public opt-ins and changes no favorites.
2. In the **Chisan production** Clerk instance, open Configure → SSO connections
   → Google. Configure a Google Cloud OAuth **Web application** client for
   `https://chisan.app` with the exact redirect URI shown by Clerk
   (`https://clerk.chisan.app/v1/oauth_callback` for the inspected instance).
3. The operator enters the Client ID and Client Secret directly in Clerk.
   Enable sign-up/sign-in, preserve the email flow, and request only the default
   OpenID, email and profile scopes. Keep email-subaddress protection enabled.
   Set the Google application's audience/publishing state appropriately for
   public production access; test users alone do not establish public readiness.
4. Verify `/registro` and `/acceso` both offer Google, complete a real Google
   login, and confirm the account retains its internal identity and favorites.
   Verify first-photo import, upload, replacement, removal and attribution opt-in.
   Confirm private/unlisted handles do not leak through producer rosters.

Clerk controls the provider's availability; deploying the frontend alone does
not activate Google. No Google secret belongs in a Next.js public environment
variable or this repository. Follow the official
[Google connection setup](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/google).

Use the **Chisan** Google Auth project owned by `chisanapp@gmail.com`, also its
support and developer contact. Its authorized domain is `chisan.app` and its
privacy link is `https://chisan.app/privacy`. Google OAuth does not require
activating Cloud billing. Keep the integration in the Chisan account rather
than a personal project.

On 2026-09-06 the Google audience was set to production and the operator saved
the client credentials directly in Clerk. The Google social connection is
enabled for sign-up/sign-in with email-subaddress protection and the three
default scopes. The public sign-in and sign-up pages offer Google, and the
authorization redirect reaches Google's account selector. This provider setup
is independent of the photo/attribution code and migration `0013`.
