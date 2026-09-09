# Professional enquiries

## Scope and authority

The professional channel at `/cuenta/profesional` is private and separate from
ordinary consumer contact on producer profiles. `CHISAN_B2B_ENABLED=true` enables
its account navigation and public professional enquiry link after migration
`0016_professional_enquiries` has been applied. The default is disabled.

The CSV `venta_profesionales` field remains the reviewed public availability
indicator. Consumer `pedido_minimo` and `condiciones_envio` remain public base
facts. They do not populate private trade conditions. Approved content JSON owns
product identity, names and public formats. PostgreSQL owns professional account
context, private per-product terms, enquiries and messages. No private terms are
added to CSV, content JSON, public HTML, structured data or catalog APIs.

## Working flow

1. An active account enables its private business context (name and activity).
   This is self-declared information, not a verified status or permission role.
2. From an eligible producer's professional link, the business selects up to ten
   reviewed products and supplies quantities, units, frequency, delivery location
   and a message. The producer needs an active premium entitlement and must accept
   professional enquiries in its published CSV facts.
3. The requesting account and the exact producer's active membership holders can
   read the enquiry in the private inbox. Staff status alone does not grant access.
4. The supplier may reply with a message, or explicitly attach edited conditions
   for one of the requested products. Stored private defaults are loaded only for
   the supplier; they are never automatically sent to the buyer.
5. Either participant may close the enquiry. Closed enquiries remain readable but
   cannot receive more messages. The inbox is the delivery channel: there are no
   automatic email, WhatsApp or push notifications in this version.

The app does not confirm orders, take payment, reserve stock or decrement weekly
capacity. Parties agree their commercial relationship separately.

## Data model

- `business_profiles`: private business name, activity and enabled state per
  internal account ID. This does not change the public account profile kind.
- `business_product_terms`: a versioned private template keyed by
  `(country, producer_id, product_id)`. It contains optional indicative weekly
  capacity with unit, MOQ with order unit/format, delivery weekdays, radius in km
  with an explicit origin, textual delivery area, lead time in hours and notes.
  Empty values mean unspecified, never zero availability. Notes can state validity.
- `business_enquiries`: requester, supplier identity, dated snapshots of business
  context and requested canonical products, quantities, frequency, location,
  opening message and open/closed state.
- `business_messages`: immutable dated messages and optional supplier-shared terms.
  Later template/product/business changes do not rewrite conversation snapshots.

Product retirement blocks new enquiries and new shared terms for that product;
existing conversation history remains readable and ordinary explanation messages
remain possible. Revoked memberships lose access immediately. Expired premium
prevents new supplier terms/messages and incoming enquiries, while authorized
historical access remains available. Disabling business context prevents buyer
messages and new enquiries, while preserving access to previous conversations.

## Controls and verification

Server actions derive the actor from the current account and call the common
service, which rechecks active accounts, memberships, feature enablement and exact
producer entitlements inside transactions. Public database privileges are revoked
on all four tables. The migration runner/runtime role provisioning follows
[Operations](OPERATIONS.md); do not expose these tables through an anonymous API.

Submission UUIDs prevent duplicate requests/messages on retries. Version checks
prevent stale template edits. Per-account daily limits are ten new enquiries and
100 messages; each conversation is limited to 200 messages. User-row locks
serialize rate checks, and per-product advisory locks serialize template updates.
Bodies are bounded plain text. Audit entries contain action and target identifiers,
not message contents or private terms. This initial version retains conversation
history; account lifecycle and erasure remain governed by the account system.

Run `node --conditions=react-server --import tsx --test scripts/test-b2b.ts` for
schema and PostgreSQL-backed service checks. `pnpm test:accounts` includes them.
Release requires `pnpm verify:ai`, narrow/wide browser QA, database preflight and
migration-before-deploy. Do not enable the feature before migration validation.
