# Chisan Operations

## Purpose

This is the production runbook for <https://chisan.app>. It owns environment
configuration, preflight, deployment, smoke checks, rollback, backups and secret
handling. `docs/ACCOUNT_SYSTEM.md` owns account semantics and migrations;
`AGENTS.md` owns repository and Git rules. Never copy live deployment IDs,
resource identifiers or secret values into this file.

## Environment contract

Production uses its dedicated Clerk instance and PostgreSQL database. Local and
Preview must never write account data through Production credentials. Preview
may enable accounts only when both its Clerk credentials and database are
non-Production and its database is isolated. If Vercel exposes the Production
database integration to Preview, keep `CHISAN_ACCOUNTS_ENABLED=false` and
`KM0_ACCOUNTS_ENABLED=false` there: Preview may test the public catalog and the
disabled-account fallback, but not registration, favorites, claims, reviews or
producer changes.

When accounts are enabled, configure the variables in `.env.example`. Production
uses `NEXT_PUBLIC_APP_URL=https://chisan.app`. `CHISAN_ACCOUNTS_ENABLED` and
`CHISAN_ADMIN_EMAILS` are canonical; `KM0_ACCOUNTS_ENABLED` and
`KM0_ADMIN_EMAILS` are temporary legacy fallbacks during the rename. A canonical
value wins when both exist. Migrate one environment at a time, verify it, then
remove the legacy record.

Public discovery is an explicit Production capability. Unless
`CHISAN_PUBLIC_DISCOVERY_ENABLED=true` is set in Production, Chisan emits global
`noindex, nofollow` metadata, serves `robots.txt` with `Disallow: /` and no
sitemap announcement, and serves an empty sitemap. Preview remains closed even
if the flag is set. At public launch, enable the flag only in Production and
review the Vercel Firewall AI Bots policy in the same release so the crawler
policy and edge enforcement change together. This discovery policy is not
access control: anyone with a URL can still open the public catalog.

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
2. Run `npx pnpm verify:ai`. A data-only release may use
   `npx pnpm verify:data`, but any code, validator, policy, migration or account
   change requires the full gate.
3. Run `npx pnpm db:check`. When accounts are enabled in the target environment,
   run the read-only `npx pnpm db:assert-current` against that exact database.
4. Confirm Production has the Chisan domain, Production Clerk keys, signed
   webhook secret, Production database URLs and the canonical app origin. Check
   names and scopes without printing values.
5. For a schema change, take a recoverable database backup and prove the
   migration in an isolated database before touching Production. Migrations must
   be expand-first and backward compatible; a build never applies DDL.
6. Exercise the public change and disabled-account fallback in Preview. Exercise
   account writes there only after proving its resources are isolated from
   Production; otherwise use a purpose-built isolated test environment.

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
   Once translation checks are part of the data gate, a sidecar-only batch may
   close with `npx pnpm verify:data`; use changed-only translation checks while
   iterating.

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
requested language. Review all 50 or more stratified samples for each of
Catalan, German and Japanese, recording factual
additions/omissions, terminology, fluency and identity preservation. Automated
validation cannot select the engine. Only after the three language assessments
approve the same locked engine, prompt and glossary versions may those
identifiers be used to materialize sidecars.

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
- With staff access, open `/admin`, `/admin/reclamaciones` and `/admin/cambios`;
  inspect queues without changing real decisions.
- Send no hand-built signed webhook. An unsigned request may be used only to
  confirm rejection; use Clerk's test-event facility for an end-to-end signed
  event.
- Inspect runtime logs for new 5xx responses, authorization exceptions, database
  errors or repeated webhook failures.

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

For an application regression, promote the last known-good Vercel deployment or
revert the offending commit on `main`, then repeat the smoke check. Do not deploy
an unreviewed local build as a shortcut.

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

## Backup, restore and provider exit

Before a migration, identity-provider exit or high-risk account release:

1. stop account writes while leaving the public catalog available;
2. take an encrypted PostgreSQL backup and a Clerk user export, including
   password hashes where supported;
3. record non-PII row counts for users, identities, favorites, claims,
   memberships, changes, grants, audit events and entitlements, plus checksums of
   the encrypted artifacts;
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
