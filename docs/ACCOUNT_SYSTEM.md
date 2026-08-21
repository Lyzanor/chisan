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

The deployed Vercel filesystem is immutable. A Server Action therefore cannot
edit a CSV durably. Producer edits are reviewed change requests that an
editorial operator materializes into Git.

## Current scope

The production release includes local profiles, favorites, manual ownership
claims, owner memberships, staff review and reviewed producer-change requests.
The onboarding profile choice remains presentation only. The schema also
reserves entitlements and editor memberships for future growth, but there
is no billing, custom-map purchase, self-service team invitation, private
document upload or self-service Chisan account-erasure flow yet. Do not describe
a reserved schema capability as a launched product feature.

## Profiles and authorization

`users.profile_kind` is the onboarding choice `user` or `producer`. It controls
copy and navigation only:

- Every active account may save favorites.
- Choosing `producer` does not grant access to any producer.
- Producer access comes only from an active `producer_membership` for the exact
  `(country, producer_id)`.
- Reviewer and admin access comes only from an active, unexpired `staff_grant`.
- Paid capabilities will come from `entitlements`, independently of profile,
  ownership and staff roles.

The user edits the Chisan-owned display name and profile choice at
`/cuenta/perfil`. Clerk's account UI remains limited to credentials, verified
sign-in identifiers, sessions and authentication factors.

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
3. The claim enters `pending`; matching a public producer email is only a
   signal, never sufficient proof.
4. A reviewer approves, rejects or marks the claim as needing more information.
   In the current UI, the claimant withdraws that claim and submits a new one
   with the missing proof; there is no private conversation thread.
5. Approval creates the producer's single active `owner` membership in the same
   database transaction. The schema supports explicit `editor` memberships for
   additional team accounts without weakening ownership verification, but the
   initial release has no self-service invitation flow.
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
non-allowlisted fields, invalid values and a dirty target CSV. It serializes
changes per producer and file, changes only the target record and publishes the
local write atomically. Finalization reads the CSV blob from the exact commit,
verifies its producer-row hash and requires that commit to be reachable from the
current `HEAD`; it never trusts an uncommitted working tree. The `applied` state
therefore means committed to the canonical CSV, not yet deployed.

## Catalog row lifecycle

Area and slug changes are resolved from the current CSV and do not change an
account reference. A `producer_id` retirement does. Before merging or purging a
published row, inspect its PostgreSQL references and resolve them explicitly:

- conflict or withdraw every unpublished change request for the retired key;
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

- Never authorize by email, profile kind, slug, area or client-supplied user ID.
- Re-resolve the producer from CSV and re-check the membership in each mutation.
- Re-check ownership at submission, approval and materialization. Membership
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
