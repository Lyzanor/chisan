# Chisan Account System

## Boundary and sources of truth

The catalog, account workflows and authentication have distinct owners:

- `data/csv/**` owns the producer registry and base facts; `data/content/**`
  holds reviewed related content for those producers. The app never publishes
  a database overlay over either source.
- PostgreSQL is canonical for accounts, external identities, favorites,
  producer claims, producer memberships, change requests, audit events and
  entitlements, including the commercial request state for expanded producer
  profiles. It may store proposal snapshots for review and audit. Public producer facts
  are resolved from the approved catalog, never from those snapshots.
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

A public user profile may store one explicit base location as
`(country, area, municipality)` as profile context. This
voluntary profile setting is not device position and is never part of a
favorite, claim, membership, change request or authorization key. Changing it
does not add, group, order or frame the explicitly selected producers.

A localized path may be carried only as validated same-site `returnTo`
navigation state. It grants no authority and is not persisted as producer
identity. A language preference remains presentation state outside PostgreSQL;
changing it cannot change claim status, membership, staff grants or producer
edit access. No database migration is required merely to publish a locale.

The deployed Vercel filesystem is immutable. A Server Action therefore cannot
edit a CSV durably. Producer edits are reviewed change requests that an
editorial operator materializes into Git.

## Current scope

The production release includes local profiles, favorites, opt-in public user
profiles with explicitly shared favorites, manual ownership claims, owner
memberships, staff review, reviewed producer-change requests, producer-scoped
expanded-profile entitlements and an admin-only gift workflow.
The Stripe payment adapter is implemented but deliberately deferred and
unprovisioned. Do not launch or advertise paid upgrades until the activation
gate in `docs/OPERATIONS.md` is completed.
Profile kind is assigned by the account workflow rather than chosen by the user.
The schema also reserves editor memberships for future growth, but there is no
subscription, custom-map purchase, self-service team invitation, private
document upload or self-service Chisan account-erasure flow yet. Do not describe
a reserved schema capability as a launched product feature.

## Profiles and authorization

`users.profile_kind` is automatic presentation state. Every account starts as
`user`; the first successfully submitted producer claim changes it to
`producer`. It is not a setting and never grants authorization:

- Every active account may save favorites.
- A `producer` profile does not grant access to any producer.
- Producer access comes only from an active `producer_membership` for the exact
  `(country, producer_id)`.
- Reviewer and admin access comes only from an active, unexpired `staff_grant`.
- The expanded-profile capability comes from the exact active producer
  entitlement `producer.profile.premium`, independently of profile kind, its
  paid or administrative origin and the current account that owns the
  producer.

The user edits the Chisan-owned display name at `/cuenta/perfil`; profile kind
is shown there as read-only state. Clerk's account UI remains limited to
credentials, verified sign-in identifiers, sessions and authentication factors.

### Public user profiles

An active account may publish a producer selection at `/u/<public_handle>`.
This is account presentation, never authorization and never a second producer
catalog. `public_handle` is a stable lowercase route identity chosen once; it
does not replace the internal `users.id` UUID in any domain reference.

Creating a public handle requires a base catalog area and a municipality that
currently appears in that area's catalog. The canonical country, area slug and
municipality spelling are stored on the user profile. Existing handles created
before this requirement are assigned `es/barcelona/Barcelona` by the migration
and may replace it from the profile form.

Profile visibility is `private`, `unlisted` or `public` and defaults to
`private`. Private profiles return `404`; unlisted profiles are shareable but
emit `noindex`; public profiles are eligible for indexing. Changing profile
visibility never changes profile kind, claims, memberships, staff grants or
producer entitlements.

A non-private public profile may present and download a Chisan QR label for its
stable `/u/<public_handle>` URL only while the account has the exact active
user-scoped `user.profile.premium` entitlement and has explicitly enabled the
label from the authenticated preview at `/cuenta/seleccion`. The opt-in is `false` by default and is stored as
the presentation flag `profileQrEnabled` in that entitlement's metadata. An
inactive entitlement fails closed and hides the label; a later entitlement
starts disabled again. The QR and generated image are presentation of the
stable route only: they store no account or catalog identity and do not create a
second identifier. The label uses the neutral selection treatment, even when
the account belongs to a restaurant or shop, until an explicit reviewed public
business-type field exists. A private profile never exposes an active label
because its destination intentionally returns `404`. The producer-scoped
expanded-profile purchase does not grant this user entitlement, and there is no
self-service user-profile premium purchase flow in the current release.

Favorites remain private by default. A favorite appears on the public profile
only after the account explicitly enables `show_on_public_profile` for that
exact `(country, producer_id)`. Enabling a profile never bulk-publishes existing
or future favorites. Removing the favorite removes it from the public page.
Public rendering resolves every enabled key against the current CSV, omits
retired rows and derives the current area, slug, coordinates and localized URL
without persisting those values in PostgreSQL.

The public page is a read model over those keys, not a second persistence
model. The account domain owns visibility and which favorites are shared; the
shared renderer owns the list-and-map composition, current producer links,
empty state and accessible marker labels. The list follows the area-map content
pattern and includes the current catalog description. It preserves favorite
creation order, newest first, with durable country/producer keys as tie-breakers.
Neither profile location, visitor position, category nor map movement changes
membership or order. The map initially frames every selected producer with valid
coordinates, across all published areas; unmapped producers remain in the list.

The owner may provide a selection title (160 characters) and description (600
characters) in `/cuenta/perfil`. These optional plain-text fields belong to
PostgreSQL `users`, are not producer facts, and fall back to the account display
name/handle and neutral selection copy. They do not classify a business or
certify a supply relationship, stock, endorsement or verification.

`/cuenta/seleccion` requires the current active account and previews only that
account's explicit selection, even while its public visibility is private. It
uses the same catalog resolver and map/list renderer as `/u/<public_handle>`;
private preview links and highlight state stay on the authenticated route.
Activation requires a non-private handle, active account Premium, an explicit
preview acknowledgement and at least one selected producer still published in
the catalog. A server-generated revision covers the owner, handle, displayed
context and resolved producer keys; the mutation rechecks it against current
state, rejecting a stale preview. This revision grants no authority. Selection,
profile and QR preference writes share the account lock; the QR mutation also
locks the active account row and rechecks the entitlement inside the transaction.

Existing enabled labels retain their opt-in. If the selection is later emptied,
its printed URL remains valid and shows an honest empty state. Disabling the QR
hides the downloadable label; making the profile private makes the public URL
return 404. Neither action can erase an already printed label. A fresh activation
requires a nonempty preview again. Changing the selection never requires a new QR.

The Next.js page resolves account state and current CSV rows in a Server
Component. A narrow selection explorer crosses into a Client Component with
only plain serializable items, marker coordinates and resolved public
links. Its `highlight` query is transient presentation state keyed by the exact
`country:producer_id`; it is never written to PostgreSQL and an unknown key is
ignored. The client explorer never receives or exposes the profile owner's
device position. The visual and interaction contract for all producer maps is
owned by `design/README.md` rather than duplicated here.

A database or identity-provider incident must not make the CSV catalog
unavailable. Private, suspended, deleted, invalid and unknown public profiles
all return `404` without revealing which condition applied. Tests must preserve
handle normalization and reservation, private-by-default visibility,
per-favorite opt-in, durable producer identity and multi-area link construction.

The staff registry at `/admin/perfiles` reads this Chisan-owned account state
directly. It exposes visibility, account state and favorite/share counts without
depending on a hosting, identity or managed-database provider dashboard.
The administrator-only `/admin/sistema` runs the migration and runtime-permission
contract from the deployed application itself; it reports no connection string,
provider identifier or secret.

The onboarding checkbox acknowledges that claims and public producer-profile
changes are reviewed. The legacy database field `terms_accepted_at` records
that checkpoint;
it is not versioned legal consent. The expanded-profile purchase separately
records its offer version and acceptance timestamp on the commercial request.
Privacy terms or any broader legal acceptance must still be published, versioned
and stored separately before the product relies on it.

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

## Expanded-profile capability

The expanded profile is a producer-scoped capability, not a subscription or a
property of a user account. Its only authorization key is an active
`producer.profile.premium` entitlement for `(country, producer_id)`. It permits
proposal and presentation of the premium CSV field set and presentation of
reviewed related content; it never grants
ownership, verification, ranking or publication without review.

That editable set is `video`, `visitas guiadas`, `mensaje a la comunidad` plus
its locale, `quien hay detras` plus its locale, `historia` plus its locale and
the two highlighted links. `fecha ultimo cambio` is displayed with that block
but is not editable: the materializer derives its UTC `YYYY-MM-DD` value from
the request's `reviewed_at` timestamp after approval.

Products, gallery items and named links use `docs/PRODUCER_CONTENT.md` under the
same entitlement. They currently enter through its local editorial workflow;
the deployed base-field proposal form does not accept these collections.

The printable producer QR is an optional presentation feature within that same
capability. It is hidden by default and renders only while the entitlement is
active and its `profileQrEnabled` metadata flag is `true`. Only the exact active
owner may change that flag from the producer profile controls. The preference
does not enter the CSV, does not change the producer route or identity, and an
entitlement revocation hides the QR immediately without deleting catalog data.
Both producer and selection labels encode only the stable same-origin canonical
URL, without query parameters, tracking or a presentation locale. An already
printed producer QR still opens the base profile after premium access ends.

`docs/CATALOG_WEB.md` owns the public HTML, locale, canonical identity, indexing and
JSON-LD contract for both base and expanded profiles. The entitlement changes
only whether reviewed expanded content may render. It never creates a second
public entity, locale-dependent account key, database content overlay or
structured-data verification signal.

The capability is provider-neutral. CSV, catalog loaders, public routes,
editorial review and entitlement checks know neither Stripe nor any future
payment service. Entitlements currently have one of two immutable sources:

- `paid_profile_upgrade`, issued only after a payment adapter verifies and
  fulfils a commercial request;
- `admin_profile_upgrade_gift`, issued without payment by an exact active admin.

Both sources grant the same right to the producer key. `source_reference` links
a paid entitlement to its commercial request; provider IDs never become catalog
identity. An ownership change therefore changes who may act, not which producer
owns an already valid entitlement.

### Administrative gifts

`/admin/premium` is the admin-only entitlement registry and gift workspace. It
works without any payment adapter. A grant requires a published producer, an
active owner and account, an exact active admin, and a substantive reason. The
operation rechecks all of them under the producer transaction lock and refuses
an existing active entitlement or open commercial request.

Only an active `admin_profile_upgrade_gift` may be revoked there, with explicit
confirmation and a second reason. The administrative gift action can never
override a paid right. A revocation atomically conflicts unpublished premium
proposals and cancels their live executions, but retains their audit history and
all published CSV values; those values simply stop rendering until a new
entitlement exists.

### Paid requests and adapter boundary

`producer_profile_upgrade_requests` is private commercial account state. It
stores the offer, amount, currency, accepted terms, lifecycle, captured/refunded
amounts, `payment_provider`, and generic provider references for offer,
checkout, payment, charge, customer and dispute. It deliberately has no
provider-specific columns. Provider references are unique within their provider,
so a replacement adapter can coexist with historical Stripe rows.

The invariant shared by every adapter is:

1. Only the current active owner may begin a purchase for a published producer.
   The server selects the provider and immutable offer; the client cannot submit
   price, amount, currency, provider, entitlement key or producer identity.
2. One producer may have only one open commercial request across all providers.
   A request snapshots the exact terms version and URL before checkout.
3. A return URL is presentation only. A signed provider event or explicit
   server-side reconciliation must re-fetch current commercial state, validate
   the durable request binding and exact EUR 49 offer, then grant at most one
   `paid_profile_upgrade` entitlement under the producer lock.
4. Fulfilment is idempotent. Expiry, delayed payment, refunds and disputes update
   the same request. Pending adverse state suspends access; succeeded refunds or
   adverse disputes also conflict unpublished premium proposals. CSV cells are
   retained and hidden while the entitlement is inactive.
5. Ownership is required to start checkout, but a bound payment remains attached
   to the producer if ownership later changes. A current owner may reconcile it
   without taking over the purchase or creating a second payment.

The operational statuses are `pending`, `paid`, `paid_unfulfilled`,
`payment_failed`, `expired`, `partially_refunded`, `refunded`, `disputed` and
`dispute_lost`. `paid_unfulfilled` means money may have been captured but the
immutable safety checks refused activation; it is never a manual-grant signal.
Expected and captured amount/currency are stored separately so an anomalous
charge can be represented and refunded honestly without ever granting access.

Commercial rows and provider references are available only to the application
runtime and exact admins, never to producer-change agents or public read models.
`/admin/pagos` is the payment-adapter incident view; its retry can only re-fetch
the provider and repeat validation. It cannot force an entitlement or issue a
refund.

### Dormant Stripe adapter

Stripe is the first implemented adapter, but it is deliberately unprovisioned
and disabled. Its SDK, Checkout orchestration and signed webhook live under the
payment integration boundary; replacing it means adding another adapter and
dispatching by `payment_provider`, not changing CSV, routes, review or the
entitlement key. Stripe resources, events, activation and incident procedures
live in `docs/STRIPE_RUNBOOK.md`.

## Producer profile changes

An active producer member may propose only the fields in
`lib/accounts/producer-fields.ts`. The server ignores arbitrary form fields and
never accepts changes to `producer_id`, `slug`, `country`, `region`, `area`,
`verificacion` or `imagen`. The three location columns are immutable mirrors of
the canonical CSV path and change only through a reviewed routing migration.
Every proposal stores:

- the canonical row hash at edit time;
- the complete base-row snapshot;
- the allowlisted patch;
- the producer's explanation/public source;
- review and application state with an optimistic lock version.

The configured premium field set additionally requires an active
`producer.profile.premium` entitlement. The server reads them only when that
right exists, and the request records `required_entitlement_key`. Staff approval,
materialization and finalization re-check the right transactionally so a refund
or dispute cannot publish an already queued premium patch. Standard profile
corrections remain available without payment.

All fields require editorial review in the first release. Approval does not
publish the change. Verified ownership proves authority to propose, not the
truth of any requested public field. Private claim material and author notes do
not become public evidence; the reviewer applies `docs/EDITORIAL.md`, and
records only suitable public sources under `data/evidence/**`.

An exact active owner membership may be presented publicly as `Titularidad
verificada`. That label is derived from PostgreSQL at request time and means
only that the ownership claim was approved. It never writes the CSV
`verificacion` cell, upgrades editorial evidence or certifies producer facts.

An owner-submitted change is an input to editorial level 3 in
`docs/EDITORIAL.md`. Approval authorizes the following two-phase workflow. The
current admin UI approves or rejects a submitted change. If more
information or a corrected patch is required, the reviewer rejects it with a
clear note or the owner withdraws it, and the owner creates a new proposal; the
reserved `needs_changes` status is not a launched conversation loop.

The producer patch allowlist deliberately excludes `fecha ultimo cambio`.
During materialization, the operator combines the validated reviewed patch with
the UTC calendar date from the immutable approval `reviewed_at`, then hashes,
audits and commits that complete row. An approved request whose base snapshot
predates this column is a schema conflict and must be resubmitted; it is never
silently widened. Editorial work performed outside this owner-proposal workflow
does not alter the date.

The operator workflow, credentials, execution recovery and publication commands
are in `docs/OPERATIONS.md` under **Reviewed producer publication**. Approval,
commit and deployment are distinct states: `approved` authorizes local work,
`applying` has a prepared local result, and `applied` records the Git commit.
Deployment is checked separately.

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
- inspect every profile-upgrade request, attached provider checkout and active
  premium entitlement for the retiring key. An unattached, unpaid request may
  be expired through an audited operation. An attached checkout, captured
  payment, refund, dispute or active entitlement must be resolved through the
  supported commercial workflow before the row retires;
- for a true merge, migrate favorites to the surviving key; never transfer an
  owner membership automatically unless the same-unit ownership has been
  reviewed for the target;
- never transfer a payment, premium entitlement or premium CSV value to a
  surviving key automatically. The one-time capability applies only while its
  purchased producer row remains published; any same-unit commercial handoff
  requires an explicit reviewed and audited operation;
- for a purge, keep the minimum historical claim, change and audit records
  required for integrity, while removing or making unavailable resources that
  require a live catalog row.

The data-only validator cannot query Production and does not prove this handoff.
Run `pnpm producer:inspect <country> <producer_id>` for the current catalog,
related-content and account-reference inventory before planning retirement.
Resolve every reported reference through the audited domain operations. Historic claims and audits are
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

Only the canonical `CHISAN_*` account variable names are supported. Configure
each Vercel environment deliberately and never introduce aliases for retired
project names.

Account creation is synchronous on first authenticated use; the webhook
reconciles identity changes and deletion. Webhook signatures are verified,
receipts are leased atomically, provider timestamps prevent stale updates, and
durable identity tombstones keep delayed events from recreating deleted PII.
Provider deletion disables only the external identity mapping. It does not
change the internal user's status, grants, resources or history.

Clerk production requires a custom application domain. Preview/development
keys can be used before that domain is ready, but production registration must
not launch on a temporary `*.vercel.app` identity configuration.

## Payment adapter operations

This document owns neutral request and entitlement semantics. Adapter
activation, incidents, replacement and retirement are owned by
`docs/OPERATIONS.md`; repository builds assert migrations but never apply DDL.

## Security invariants

- Never authorize by email, profile kind, locale, catalog scope, public path,
  slug, area or client-supplied user ID.
- Profile kind is automatic display state: account creation sets `user` and a
  submitted producer claim promotes it to `producer`; no user mutation may set
  or downgrade it directly.
- Re-resolve the producer from CSV and re-check the membership in each mutation.
- Re-check the exact producer entitlement at premium proposal, approval,
  materialization and finalization. Payment authorizes a capability, never the
  truth or editorial acceptance of a field.
- Re-check the exact active user or producer premium entitlement and, for a
  producer, the exact owner membership in every QR preference mutation. A
  client checkbox, profile kind or public route never grants QR access.
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
- Keep payment webhooks public but signed; never protect them with a user
  session. Each adapter verifies the provider-required payload. Return URLs and
  query parameters never grant a right.
- Never accept a provider, offer, amount, currency or entitlement key from the
  browser. Provider credentials must match their deployment environment. Do not
  grant producer-change agents access to commercial rows or provider IDs.
- Do not fetch submitted URLs synchronously during a request. Future link
  checks need SSRF defenses and an isolated worker.
- Transactional per-account quotas limit open and daily claims/profile changes.
  Infrastructure IP limits, MFA/step-up for sensitive changes and private claim
  artifacts are required before higher-risk evidence uploads or operation at an
  abuse level the current text-only, manually reviewed flow cannot safely absorb.
