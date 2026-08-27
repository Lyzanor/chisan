# Producer Selection Pages

## Purpose

A producer selection page presents a deliberate set of catalog producers as
one public list and map. User profiles are the first owner of this primitive;
future owners may include events, editorial features, restaurants or other
product domains.

This is a shared read and presentation contract, not a universal persistence
table. Each owning domain keeps its own lifecycle, authorization and evidence,
then supplies an ordered list of durable producer keys to the shared renderer.
Do not force events, editorial selections and user choices into one database
model merely because their public pages look alike.

## Source boundary

Every selection item is exactly:

```text
(country, producer_id)
```

The owning domain may store that pair, its order and owner-specific state such
as visibility. It never stores a copy of producer name, slug, area, categories,
coordinates, image or descriptive fields. At render time, Chisan resolves each
key against the current row under `data/csv/**` and derives the current public
URL from that row.

Consequently:

- a producer route or area move does not invalidate a selection;
- locale is presentation state and is never part of an item key;
- a missing or retired row is omitted from a public selection, while its owner
  may receive a private warning;
- producers without valid coordinates remain in the list but not on the map;
- selection order never changes catalog identity; and
- a selection cannot override, annotate or republish producer facts.

## Shared page model

Every rendered page supplies:

- a stable page kind and canonical path;
- a public title and optional introduction owned by its source domain;
- an ordered, duplicate-free list of producer keys;
- resolved producer presentation items; and
- page visibility and indexing policy owned by its source domain.

The shared renderer owns the map/list composition, current producer links,
coordinate omission, multi-country and multi-area marker identity, empty state
and accessible map labels. It must accept selections spanning any number of
catalog areas or countries.

The source domain owns who may create or change the page, how items enter it,
whether prose needs moderation or evidence, expiry and archival rules, and
whether the page belongs in discovery or a sitemap.

## Public user profiles

The first public route is:

```text
/u/<public_handle>
```

`public_handle` is a stable, lowercase ASCII route identity chosen once by the
account. Display name remains editable presentation. A profile has one of three
visibility states:

- `private`: unavailable publicly;
- `unlisted`: available to anyone with the URL and emitted with `noindex`; or
- `public`: available publicly and eligible for indexing.

All accounts start private. Existing and future favorites also start hidden
from the profile. Publishing a profile never publishes every favorite
implicitly: the account must opt each favorite into the public selection.
Removing a favorite also removes it from the public selection.

PostgreSQL owns profile visibility, the handle and the per-favorite publication
choice. The CSV catalog continues to own every producer fact.

## Location privacy

A public selection never exposes the profile owner's device position. Do not
derive or persist an account location for this feature.

A future **Near me** control may use the visitor's device position only in the
browser to filter or order already-public producer points. The raw position is
discarded after the immediate interaction and follows
`docs/LOCATION_ROUTING.md`; it is never added to the selection, URL, account or
analytics payload.

An owner-authored area label may be introduced later only as an explicit public
profile choice, not as persisted output from device geolocation.

## Rendering and failure behavior

The Next.js page reads its owning domain and the CSV catalog directly in a
Server Component. Only the interactive Leaflet map crosses into a Client
Component, receiving plain serializable marker data and already-resolved public
links.

User-profile pages depend on account storage, but a database, Clerk or public
profile incident must not make the CSV catalog unavailable. A private,
suspended, deleted, invalid or unknown public profile returns `404` without
revealing which condition applied.

## Validation

Changes to this primitive or one of its owners run `npx pnpm verify:ai`.
Database changes additionally require a checked-in Drizzle migration and
`npx pnpm db:check`. Focused tests must prove handle normalization and
reservation, private-by-default visibility, per-item opt-in, durable producer
identity and multi-area link construction.
