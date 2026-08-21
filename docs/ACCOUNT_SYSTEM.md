# Account System

## Boundary and sources of truth

KM0 has two persistence domains with an explicit boundary:

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
no KM0 authorization or domain state. Provider profile data may seed a new
account once; afterwards the local profile is canonical and provider updates
only reconcile the external identity record.

Every database reference to a producer uses the durable pair
`(country, producer_id)`. Area and slug are resolved from the current CSV when
rendering a link, so favorites and permissions survive a routing change.

The deployed Vercel filesystem is immutable. A Server Action therefore cannot
edit a CSV durably. Producer edits are reviewed change requests that an
editorial operator materializes into Git.

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

The user edits the KM0-owned display name and profile choice at
`/cuenta/perfil`. Clerk's account UI remains limited to credentials, verified
sign-in identifiers, sessions and authentication factors.

Authorization is repeated inside every Server Action. `proxy.ts` only
establishes Clerk's request context and is not an authorization boundary.

## Provider portability and exit

Changing identity provider must not require rewriting any domain foreign key.
The migration boundary is the small `auth_identities` mapping:

1. Stop account writes and disable the old provider webhook.
2. Export Clerk users, including password hashes when the destination supports
   their algorithm, and take an encrypted PostgreSQL backup.
3. Import identities into the replacement provider and attach each new
   `(provider, subject)` to the existing `users.id`.
4. Replace the session adapter, login UI and signed webhook integration.
5. Validate account-to-resource counts before enabling writes, then retire the
   old identities only after rollback is no longer required.

The PostgreSQL backup is the complete export of KM0-owned account and domain
state. Sessions are intentionally disposable; MFA, passkeys and some social
connections may require re-enrollment at the new provider. A Clerk
`user.deleted` event only tombstones and disables that external identity; it
never deletes the internal user or its resources. Account erasure is a separate,
explicit KM0 operation.

## Ownership claims

The initial flow is deliberately manual:

1. A signed-in account with a verified email opens a public producer profile.
2. The claimant chooses a verification method and explains the relationship.
3. The claim enters `pending`; matching a public producer email is only a
   signal, never sufficient proof.
4. A reviewer approves, rejects or requests more information.
5. Approval creates the producer's single active `owner` membership in the same
   database transaction; additional team accounts can be explicit `editor`
   memberships without weakening ownership verification.
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
publish the change. It authorizes the following two-phase workflow:

```bash
# 1. Apply one approved request locally and validate its CSV.
pnpm producer:change materialize <change-request-uuid>

# 2. Inspect the diff, add public evidence when appropriate, and run the gate.
pnpm verify:data
git add <csv-and-evidence-files>
git commit -m "data: apply reviewed producer profile change"

# 3. Bind the request to the commit that contains its CSV.
pnpm producer:change finalize <change-request-uuid> <full-40-char-commit-sha>

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

## Database lifecycle

The schema is in `lib/db/schema.ts`; generated SQL and snapshots live under
`drizzle/`. Database initialization is lazy so the public catalog and
`next build` do not require secrets.

```bash
pnpm db:generate  # after changing the Drizzle schema
pnpm db:check     # ensure migration snapshots match the schema
pnpm db:migrate   # apply committed migrations with the migration connection
pnpm db:assert-current  # read-only deployment compatibility gate
```

Use `DATABASE_MIGRATION_URL` for an unpooled/direct migration connection when
the provider offers one; runtime requests use `DATABASE_URL`. Migrations run in
one PostgreSQL transaction behind an advisory lock and must be expand-first and
backward compatible. They never run inside a Vercel build. The Vercel build only
runs the read-only assertion and refuses to enable accounts when a committed
migration is missing. Preview and production use separate Clerk instances and
separate databases. CI applies every migration twice to PostgreSQL before the
normal repository gate.

## Clerk setup

1. Create separate Clerk development and production instances.
2. Configure `/acceso` and `/registro` as the custom paths and
   `/cuenta/bienvenida` as the fallback destination.
3. Under **User & authentication → User model**, disable **First and last
   name** and **Allow users to delete their accounts**. KM0 owns profile and
   erasure; Clerk's account UI is only for sign-in identifiers and security.
4. Create a webhook endpoint at `/api/webhooks/clerk` for `user.created`,
   `user.updated` and `user.deleted`.
5. Set the variables documented in `.env.example` in each environment.
6. Set `KM0_ADMIN_EMAILS` to one or more verified bootstrap emails for the
   first admin. A historical revoked/expired grant is never recreated by this
   allowlist. After permanent grants exist, remove or tightly control it.
7. Set `KM0_ACCOUNTS_ENABLED=true` only after the database assertion, webhook
   and end-to-end Preview checks pass.

Account creation is synchronous on first authenticated use; the webhook
reconciles identity changes and deletion. Webhook signatures are verified,
receipts are leased atomically, provider timestamps prevent stale updates, and
durable identity tombstones keep delayed events from recreating deleted PII.
Provider deletion disables only the external identity mapping. It does not
change the internal user's status, grants, resources or history.

Clerk production requires a custom application domain. Preview/development
keys can be used before that domain is ready, but production registration must
not launch on a temporary `*.vercel.app` identity configuration.

## Deployment sequence

1. Provision isolated PostgreSQL databases and Clerk instances. Provisioning
   is an operator action; repository code never creates billable resources.
2. Configure secrets with `KM0_ACCOUNTS_ENABLED=false` in local, Preview and
   Production environments.
3. Run `pnpm db:migrate` and `pnpm db:assert-current` against the target database.
4. Run `pnpm verify:ai` with accounts disabled to confirm the public fallback.
5. Enable accounts in Preview and exercise registration,
   favorite, claim, review and change-request flows.
6. Configure the signed Clerk webhook and verify a test event.
7. Enable Production and promote only after the custom domain and required CI
   checks are in place. The read-only build assertion blocks an outdated DB.

## Security invariants

- Never authorize by email, profile kind, slug, area or client-supplied user ID.
- Re-resolve the producer from CSV and re-check the membership in each mutation.
- Re-check ownership at submission, approval and materialization. Revocation or
  account deletion conflicts every unpublished request under the same producer lock.
- Treat claims and producer notes as private; do not write them to logs or
  public evidence files.
- Keep public pages usable when auth or database configuration is absent.
- Keep provider unlinking separate from internal account deletion. A future
  explicit KM0 erasure flow must remove favorites, revoke access and
  entitlements, redact synchronized identity/claim/note PII, and preserve the
  minimum claim/change/audit history required for integrity and compliance.
- Keep webhook verification public but signed; never protect it with a user
  session.
- Do not fetch submitted URLs synchronously during a request. Future link
  checks need SSRF defenses and an isolated worker.
- Transactional per-account quotas limit open and daily claims/profile changes.
  Infrastructure IP limits, MFA/step-up for sensitive changes and private claim
  artifacts are still required before opening claims at untrusted production scale.

## Future paid capabilities

Do not add `is_premium` or infer payment from producer ownership. Billing should
issue capability keys such as `producer_profile_extended` or `custom_maps` into
`entitlements`, with provider references and validity windows. A future billing
account may belong to a person or a producer and can have multiple members;
ownership, moderation and payment remain independent dimensions.
