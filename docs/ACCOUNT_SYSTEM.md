# Chisan Account System

## Boundary and sources of truth

Chisan has two persistence domains with an explicit boundary:

- `data/csv/**` remains the canonical, public producer catalog. The app never
  publishes a database overlay over a CSV row.
- PostgreSQL is canonical for accounts, external identities, favorites,
  producer claims, producer memberships, change requests, audit events and
  future entitlements.
- Clerk owns credentials, verified sign-in identifiers and sessions. A Clerk
  subject is linked to an internal user through `auth_identities`; email is
  never an authorization key.

The internal `users.id` UUID is the durable account identity. Every profile,
preference, grant, claim, membership, change request, audit actor and
entitlement references that UUID, never a Clerk subject. Clerk metadata carries
no Chisan authorization or domain state. Provider profile data may seed a new
account once; afterwards the local profile is canonical and provider updates
only reconcile the external identity record.

Every database reference to a producer uses the durable pair
`(country, producer_id)`. Area and slug are resolved from the current CSV when
rendering a link, so favorites and permissions survive a routing change.

Catalog scope and locale are presentation only. A short default route such as
`/jp/tokyo/<slug>` and an alternate route such as
`/en-jp/tokyo/<slug>` resolve through the same canonical country and row and
must pass the same `(jp, producer_id)` to every account action. Locale, composite
catalog scope, area, slug and public path are never added to a favorite, claim,
membership, change-request or authorization key. Opening or acting on two
language variants therefore finds one existing account-domain record and cannot
create locale duplicates.

A localized path may be carried only as validated same-site `returnTo`
navigation state. It grants no authority and is not persisted as producer
identity. A language preference remains presentation state outside PostgreSQL;
changing it cannot change claim status, membership, staff grants or producer
edit access. No database migration is required merely to publish a locale.

The deployed Vercel filesystem is immutable. A Server Action therefore cannot
edit a CSV durably. Producer edits are reviewed change requests that an
editorial operator materializes into Git.

## Current scope

The production release includes local profiles, favorites, manual ownership
claims, owner memberships, staff review and reviewed producer-change requests.
Profile kind is assigned by the account workflow rather than chosen by the
user. The schema also reserves entitlements and editor memberships for future
growth, but there is no billing, custom-map purchase, self-service team
invitation, private document upload or self-service Chisan account-erasure flow
yet. Do not describe a reserved schema capability as a launched product feature.

## Profiles and authorization

`users.profile_kind` is automatic presentation state. Every account starts as
`user`; the first successfully submitted producer claim changes it to
`producer`. It is not a setting and never grants authorization:

- Every active account may save favorites.
- A `producer` profile does not grant access to any producer.
- Producer access comes only from an active `producer_membership` for the exact
  `(country, producer_id)`.
- Reviewer and admin access comes only from an active, unexpired `staff_grant`.
- Paid capabilities will come from `entitlements`, independently of profile,
  ownership and staff roles.

The user edits the Chisan-owned display name at `/cuenta/perfil`; profile kind
is shown there as read-only state. Clerk's account UI remains limited to
credentials, verified sign-in identifiers, sessions and authentication factors.

The onboarding checkbox acknowledges that claims and public profile changes are
reviewed. The legacy database field `terms_accepted_at` records that checkpoint;
it is not versioned legal consent. Privacy terms or other legal acceptance must
be published, versioned and stored separately before the product relies on it.

Authorization is repeated inside every server-side mutation. `proxy.ts` only
establishes Clerk's request context and is not an authorization boundary.

## Provider portability and exit

Changing identity provider must not require rewriting any domain foreign key.
The migration boundary is the small `auth_identities` mapping:

1. Stop account writes and disable the old provider webhook.
2. Export Clerk users, including password hashes when the destination supports
   their algorithm, and take an encrypted PostgreSQL backup. Clerk documents the
   supported export routes in its [migration guide](https://clerk.com/docs/guides/development/migrating/overview).
3. Import identities into the replacement provider and attach each new
   `(provider, subject)` to the existing `users.id`.
4. Replace the session adapter, login UI and signed webhook integration.
5. Validate account-to-resource counts before enabling writes, then retire the
   old identities only after rollback is no longer required.

The PostgreSQL backup is the complete export of Chisan-owned account and domain
state. Sessions are intentionally disposable; MFA, passkeys and some social
connections may require re-enrollment at the new provider. A Clerk
`user.deleted` event only tombstones and disables that external identity; it
never deletes the internal user or its resources. Account erasure is a separate,
explicit Chisan operation.

## Ownership claims

The initial flow is deliberately manual:

1. A signed-in account with a verified email opens a public producer profile.
2. The claimant chooses a verification method and explains the relationship.
3. The claim enters `pending` and the account profile becomes `producer`;
   matching a public producer email is only a signal, never sufficient proof.
4. A reviewer approves, rejects or marks the claim as needing more information.
   In the current UI, the claimant withdraws that claim and submits a new one
   with the missing proof; there is no private conversation thread.
5. Approval creates the producer's single active `owner` membership in the same
   database transaction and rejects any competing claims that were already
   awaiting review. While that membership is active, the producer cannot be
   claimed again; public UI and the server mutation both enforce this under the
   same per-producer transaction lock. The schema supports explicit `editor`
   memberships for additional team accounts without weakening ownership
   verification, but the initial release has no self-service invitation flow.
6. Revocation closes the membership without deleting claim or audit history.

The public evidence ledgers under `data/evidence/**` are not storage for private
ownership documents. If document upload is added, use private object storage,
short-lived read URLs, retention limits and a separate artifact table.

## Producer profile changes

An approved owner may propose only the fields in
`lib/accounts/producer-fields.ts`. The server ignores arbitrary form fields and
never accepts changes to `producer_id`, `slug`, `verificacion` or `imagen`.
Every proposal stores:

- the canonical row hash at edit time;
- the complete base-row snapshot;
- the allowlisted patch;
- the producer's explanation/public source;
- review and application state with an optimistic lock version.

All fields require editorial review in the first release. Approval does not
publish the change. Verified ownership proves authority to propose, not the
truth of any requested public field. Private claim material and author notes do
not become public evidence; the reviewer applies `docs/EDITORIAL.md`, and
records only suitable public sources under `data/evidence/**`.

An owner-submitted change is an input to editorial level 3 in
`docs/EDITORIAL.md`. Approval authorizes the following two-phase workflow. The
current admin UI approves or rejects a submitted change. If more
information or a corrected patch is required, the reviewer rejects it with a
clear note or the owner withdraws it, and the owner creates a new proposal; the
reserved `needs_changes` status is not a launched conversation loop.

```bash
# 1. Apply one approved request locally and validate its CSV.
npx pnpm producer:change materialize <change-request-uuid>

# 2. Inspect the diff, add public evidence when appropriate, and run the gate.
npx pnpm verify:data
git add <csv-and-evidence-files>
git commit -m "data: apply reviewed producer profile change"

# 3. Bind the request to the commit that contains its CSV.
npx pnpm producer:change finalize <change-request-uuid> <full-40-char-commit-sha>

# 4. Push main; GitHub/Vercel then make the committed CSV public.
git push origin main
```

Materialization refuses stale base hashes, missing producers, revoked ownership,
non-allowlisted fields, invalid values and a dirty target CSV. Before writing,
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

## Catalog row lifecycle

Area and slug changes are resolved from the current CSV and do not change an
account reference. A locale activation, withdrawal or catalog-scope routing
change likewise does not retire a row. A `producer_id` retirement does. Before
merging or purging a published row, inspect its PostgreSQL references and
resolve them explicitly:

- cancel every active materialization execution, then conflict or withdraw every
  unpublished change request for the retired key in the same transaction;
- review pending ownership claims and revoke memberships that can no longer
  target a published producer;
- for a true merge, migrate favorites to the surviving key; never transfer an
  owner membership automatically unless the same-unit ownership has been
  reviewed for the target;
- for a purge, keep the minimum historical claim, change and audit records
  required for integrity, while removing or making unavailable resources that
  require a live catalog row.

The data-only validator cannot query Production and does not prove this handoff.
Until a dedicated inspection command exists, it is an explicit operator check
and the merge/purge must not ship without it. Historic claims and audits are
never rewritten merely to make the retired producer appear current. Do not
repair references with ad hoc Production SQL; if an audited operation is not
available, defer the row retirement.

## Database lifecycle

The schema is in `lib/db/schema.ts`; generated SQL and snapshots live under
`drizzle/`. Database initialization is lazy so the public catalog and
`next build` do not require secrets.

```bash
npx pnpm db:generate  # after changing the Drizzle schema
npx pnpm db:check     # ensure migration snapshots match the schema
npx pnpm db:migrate   # apply committed migrations with the migration connection
npx pnpm db:assert-current  # read-only deployment compatibility gate
```

Use `DATABASE_MIGRATION_URL` for an unpooled/direct migration connection when
the provider offers one; runtime requests use `DATABASE_URL`. Migrations run in
one PostgreSQL transaction behind an advisory lock and must be expand-first and
backward compatible. They never run inside a Vercel build. The Vercel build only
runs the read-only assertion and refuses to enable accounts when a committed
migration is missing. Production uses its dedicated Clerk instance and database.
Preview may enable accounts only with non-Production Clerk credentials and an
isolated database; if its integration resolves to the Production database,
accounts remain disabled there. CI applies every migration twice to PostgreSQL
before the normal repository gate.

## Clerk setup

1. Create separate Clerk development and production instances.
2. Configure `/acceso` and `/registro` as the custom paths and
   `/cuenta/bienvenida` as the fallback destination.
3. Under **User & authentication → User model**, disable **First and last
   name** and **Allow users to delete their accounts**. Chisan owns profile and
   erasure; Clerk's account UI is only for sign-in identifiers and security.
4. Create a webhook endpoint at `/api/webhooks/clerk` for `user.created`,
   `user.updated` and `user.deleted`.
5. Set the variables documented in `.env.example` in each environment.
6. Set `CHISAN_ADMIN_EMAILS` to one or more verified bootstrap emails for the
   first admin. A historical revoked/expired grant is never recreated by this
   allowlist. After permanent grants exist, remove or tightly control it.
7. Set `CHISAN_ACCOUNTS_ENABLED=true` only after the database assertion, webhook
   and end-to-end Preview checks pass.

During the project rename, `KM0_ADMIN_EMAILS` and `KM0_ACCOUNTS_ENABLED` are
legacy fallbacks. The `CHISAN_*` value wins when both names are present. Migrate
each Vercel environment deliberately, verify it, and then remove the legacy
record; never leave conflicting values configured indefinitely.

Account creation is synchronous on first authenticated use; the webhook
reconciles identity changes and deletion. Webhook signatures are verified,
receipts are leased atomically, provider timestamps prevent stale updates, and
durable identity tombstones keep delayed events from recreating deleted PII.
Provider deletion disables only the external identity mapping. It does not
change the internal user's status, grants, resources or history.

Clerk production requires a custom application domain. Preview/development
keys can be used before that domain is ready, but production registration must
not launch on a temporary `*.vercel.app` identity configuration.

Operational deployment procedures, preflight and smoke checks live in
`docs/OPERATIONS.md`. Repository code never provisions billable resources, and
a build asserts migration compatibility but never applies DDL.

## Security invariants

- Never authorize by email, profile kind, locale, catalog scope, public path,
  slug, area or client-supplied user ID.
- Profile kind is automatic display state: account creation sets `user` and a
  submitted producer claim promotes it to `producer`; no user mutation may set
  or downgrade it directly.
- Re-resolve the producer from CSV and re-check the membership in each mutation.
- Re-check ownership at claim submission, approval and materialization. An
  active owner blocks every later claim submission for that producer. Membership
  revocation conflicts every unpublished request under the same producer lock.
  A future internal erasure flow must do the same; a Clerk `user.deleted` event
  alone intentionally does not alter domain resources.
- Treat claims and producer notes as private; do not write them to logs or
  public evidence files.
- Keep public pages usable when auth or database configuration is absent.
- Keep provider unlinking separate from internal account deletion. A future
  explicit Chisan erasure flow must remove favorites, revoke access and
  entitlements, redact synchronized identity/claim/note PII, and preserve the
  minimum claim/change/audit history required for integrity and compliance.
- Keep webhook verification public but signed; never protect it with a user
  session.
- Do not fetch submitted URLs synchronously during a request. Future link
  checks need SSRF defenses and an isolated worker.
- Transactional per-account quotas limit open and daily claims/profile changes.
  Infrastructure IP limits, MFA/step-up for sensitive changes and private claim
  artifacts are required before higher-risk evidence uploads or operation at an
  abuse level the current text-only, manually reviewed flow cannot safely absorb.
