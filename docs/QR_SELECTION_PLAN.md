# QR Profiles and Producer Selections

Status: product plan; implementation deferred.

Decision date: 2026-09-03.

This document records the intended product model for Chisan QR labels and the
public producer selection owned by an account. It is a plan, not a statement
that every described field, screen or route already exists. Until a phase is
implemented, `docs/ACCOUNT_SYSTEM.md`, `docs/CSV_CONTRACT.md` and
`design/README.md` remain authoritative for current behavior.

## Decision

Chisan has exactly two QR product families:

| Product family | Durable subject                                                | Public destination                          | Public purpose                                                  |
| -------------- | -------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| Producer QR    | One canonical producer `(country, producer_id)`                | That producer's existing canonical profile  | Introduce and explain one producer                              |
| Selection QR   | One Chisan account, initially through its stable public handle | That account's published producer selection | Open a map of the producers explicitly selected by that account |

The second family may be called **user QR** internally because the account owns
it. Its public name is **selection QR**. The physical label and visitor-facing
page must not require or imply that the account is a restaurant, shop, wine
merchant, association or private individual.

There is no third QR type for each kind of venue. A restaurant menu, wine shop,
cheese counter or local-food shop uses the same selection primitive and gives
it context through its public name, title and description.

## Product promise

The producer QR answers:

> Who produces this?

The selection QR answers:

> Who are the producers in this selection, and where do they produce?

The map remains the primary surface of a selection. It communicates the
geographic origin and distribution of the selected producers. It is not a
generic nearby-producer search and does not add producers because they are
close to the account, the printed label or the visitor.

Chisan's broader discovery product continues to help people find producers by
place and proximity. A selection QR is a deliberately narrower entry point:
selection membership is explicit account state, while geography is the way
that selection is understood.

## Vocabulary

- **Producer:** one canonical catalog row identified by
  `(country, producer_id)` and rendered at its current stable public profile.
- **Selection owner:** the active Chisan account that controls a public
  selection. Public copy uses its display name, not the word `user`.
- **Favorite:** a producer privately saved by an account. Favorites form the
  private pool from which the owner can later make its final public selection;
  a favorite is never public merely because it was saved.
- **Selection:** the set of canonical producers the owner explicitly chooses
  to publish together from its private favorites.
- **Selection context:** optional owner-authored title and description that
  explain why the producers appear together.
- **Selection QR:** a printable Chisan label whose stable URL opens that
  published selection.
- **Producer QR:** a printable Chisan label whose stable URL opens one
  producer's canonical profile.

`profile_kind` remains presentation state and never determines selection
semantics, QR access or authorization. Chisan does not need a business-type
field to support the planned experience.

## Sources of truth

The QR experience must preserve the existing domain boundary:

| State                                                                                   | Owner                                                         |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Producer identity, name, description, categories, coordinates and public profile fields | Canonical area CSV and its reviewed sidecars                  |
| Account identity, public handle, profile visibility and QR preference                   | PostgreSQL account domain                                     |
| Private favorites and which of them an account publishes in its selection               | PostgreSQL account domain, always by `(country, producer_id)` |
| Optional selection title, description, order and future selection-specific notes        | PostgreSQL account domain                                     |
| Producer premium capability                                                             | Active producer-scoped `producer.profile.premium` entitlement |
| Selection-QR capability                                                                 | Active user-scoped `user.profile.premium` entitlement         |

PostgreSQL may own the relationship between an account and selected producer
keys. It must never copy or override the producer facts rendered from CSV.
Removing, moving or renaming a catalog row is resolved through its durable
producer key under the account-system lifecycle contract.

The QR image contains only a canonical Chisan URL. It never contains a raw
account UUID, producer ID, locale, business type, selection contents or
tracking query parameters.

## Producer QR contract

### Eligibility and control

- The destination is the producer's existing canonical profile, never a
  separate premium URL or QR-only page.
- The printable control is available only while the producer has the exact
  active `producer.profile.premium` entitlement.
- Only an active owner membership for that producer may change the QR opt-in.
- The QR is disabled by default and must be explicitly activated.
- Entitlement, ownership or QR activation does not imply editorial
  verification, ranking or endorsement.

### Visitor experience

- Scanning opens the canonical producer profile directly.
- When the producer entitlement is active, that same profile may render its
  reviewed premium content under the existing expanded-profile contract.
- The QR route remains the canonical base-profile route. If premium presentation
  later becomes inactive, a previously printed label still reaches the
  producer's base profile rather than a dead premium-only route.

### Physical label

- Public label: **Producer QR**.
- Suggested Spanish category line: `Productor local`.
- Suggested Spanish instruction: `Escanea para conocer este productor`.
- Visual treatment: Chisan `moss` outer rule, with the QR itself in `ink` on
  `surface` and the complete quiet zone.
- The label must not display a premium badge or turn payment into a trust mark.

## Selection QR contract

### Ownership and eligibility

- The durable owner is one active Chisan account.
- The initial destination remains the account's stable
  `/u/<public_handle>` route.
- The profile must be non-private for a printed QR to have a public
  destination.
- The printable control requires the exact active `user.profile.premium`
  entitlement and explicit opt-in.
- Producer-profile premium does not grant a selection QR, and user-profile
  premium does not grant producer controls.
- Any canonical producer may appear in a selection. A selected producer does
  not itself need a premium entitlement.

The entitlement gates the QR capability, not the public producer facts. A
previously printed QR keeps pointing to the stable public-handle route while
that profile remains visible. Making the profile private intentionally makes
the destination unavailable under the public-profile contract.

### Owner workflow

The initial single-selection workflow is:

1. The account saves producers as private favorites over time.
2. When preparing its public selection, the owner opens a dedicated selection
   step and sees those favorites as the available pool.
3. The owner makes the final, explicit per-producer choice of which favorites
   belong in the selection.
4. The owner previews the resulting map and attached list.
5. The owner publishes or updates the selection.
6. If the account has the required entitlement, it explicitly activates and
   downloads the Selection QR.

QR activation and selection publication are separate choices. The first QR
download should require at least one selected producer so that a newly printed
label has a meaningful destination. Later removal of every selected producer
keeps the stable route and renders an honest empty state rather than silently
adding recommendations.

### Selection membership

Favorites are the private working set from which the owner makes the final
choice. Saving a favorite does not add it to the public selection. During the
selection configuration or publication step, the owner explicitly chooses
which favorites will appear. The map and attached list then contain exactly
that published subset.

The relationship is therefore:

```text
catalog producer -> private favorite -> explicit final choice -> public selection
```

Adding, importing or enabling favorites in bulk must never publish them in
bulk. A newly saved favorite remains private until the owner makes that final
per-producer choice. Removing a favorite also removes it from the published
selection because a public selection item cannot outlive its private saved
producer relationship in the initial model.

Selection membership must never be expanded by:

- distance from the account's base municipality;
- distance from the visitor;
- device location;
- the physical place where a QR happens to be printed;
- map viewport;
- category similarity;
- a recommendation or nearby-producer algorithm.

In the first implementation, the existing per-favorite
`show_on_public_profile` choice can remain the single-selection membership
mechanism. The product should present that control as the final choice of which
favorites enter the selection, not as a second kind of favorite. Enabling a
public profile or QR must not bulk-publish favorites.
Future first-class selection records may replace this presentation model only
through an explicit migration that preserves producer keys and existing public
routes.

### Neutral context

Chisan does not need to determine whether the owner is a restaurant, shop,
wine merchant, association or individual. The default presentation is neutral:

- Default Spanish title: `Selección de <display name>`.
- Default Spanish description: `Productores seleccionados y compartidos por
<display name>.`.
- Physical label category: `Selección de productores`.
- Physical label instruction: `Escanea para descubrir esta selección`.

An optional owner-authored title and short description may supply the physical
context without changing account type or authorization. Examples include:

- `Los productores de nuestra carta`;
- `Bodegas que encontrarás en nuestra tienda`;
- `Quién elabora nuestros quesos`;
- `Nuestra selección de producto local`;
- `Mis productores favoritos`.

Owner-authored context is an account statement, not a catalog fact. The public
page must distinguish it from reviewed producer data. It must not claim that
Chisan verified stock, availability, a supply agreement or a venue
classification unless a future reviewed contract explicitly supports that
claim.

### Map-first destination

The selection destination is a map experience with an attached roster:

1. A compact header identifies the selection owner and optional context.
2. The map is the main visual and interaction surface.
3. The initial viewport frames every selected producer that has valid
   coordinates.
4. Every map marker represents one explicitly selected canonical producer.
5. Marker activation opens the shared producer card and a durable link to that
   producer's current profile.
6. The attached list contains the same selected set. A selected producer with
   no valid coordinates remains available in the list and is omitted only from
   the map.
7. Category filters may narrow the visible selection. They never import
   producers from the wider catalog.
8. The initial single-selection list uses a stable neutral ordering rather than
   owner, visitor or map-center proximity. Curator-controlled ordering is a
   later enhancement.
9. Map selection, keyboard behavior, mobile disclosure, marker styling and the
   `highlight` query continue to use the shared map component contract.

The selection page must not group or label its producers as `Near me`, `In my
area` or `Further away`. Their positions remain visible on the map, but
proximity neither defines nor ranks the selection.

Suggested visitor-facing disclosure:

> Selection published by `<display name>`. Producer information comes from the
> Chisan catalog.

When a reliable account-owned timestamp exists, the page may also show when
the selection was last updated. It must not derive catalog freshness from that
selection timestamp.

### Physical label

- Public label: **Selection QR**, never `User QR`.
- Visual treatment: neutral `ink` outer rule, with the QR itself in `ink` on
  `surface` and the complete quiet zone.
- It uses the Chisan wordmark and no restaurant, shop, menu or category icon.
- It does not imply that Chisan reviewed the account's business type or the
  relationship expressed by the selection.
- The existing high-resolution printable format remains the baseline; future
  shelf, menu or window formats are variants of the same selection QR, not new
  QR product families.

## Route and lifecycle invariants

```text
producer entitlement + exact owner + producer opt-in
    -> printable Producer QR
    -> canonical producer profile

user entitlement + visible public profile + user opt-in
    -> printable Selection QR
    -> stable account-owned selection route
    -> map and list of explicitly selected producer keys
```

- Producer QR URLs remain parameter-free canonical producer URLs.
- The first Selection QR URL remains the parameter-free stable public-handle
  URL.
- Locale and `highlight` are presentation state and never enter QR identity.
- A producer slug or area move preserves the producer QR through the catalog's
  canonical route and alias policy.
- A selection resolves every producer key against the current published
  catalog on each render and omits retired or unpublished rows.
- Changing selection contents updates the destination without requiring a new
  printed QR.
- Suspending the account or making its profile private follows the existing
  indistinguishable `404` policy.
- An empty published selection has an honest empty state and never fills itself
  with nearby recommendations.

## Planned delivery

### Phase 0: product definition

This document is the only deliverable in the current phase. There is no UI,
schema, migration, entitlement, route, copy or catalog change.

Before implementation begins, reconcile this plan into the current contracts
and verify the live database and deployment state. An implementation must not
treat this planning document as a database migration or launch instruction.

### Phase 1: align the existing single selection

Goal: make the existing user-owned public profile unambiguously behave as one
neutral producer selection.

- Preserve `/u/<public_handle>`, current visibility states, per-favorite opt-in
  and the current user QR entitlement boundary.
- Present favorites as a private shortlist and let the owner make a final,
  explicit per-producer choice when configuring the public selection.
- Provide a selection preview before first QR activation and require at least
  one chosen producer before the first download.
- Preserve the shared map component and make the map the primary destination
  surface.
- Frame all mapped producers in the explicitly published selection.
- Remove proximity-based headings, initial subsets and ranking from this page.
- Use one stable neutral roster and retain selected producers without
  coordinates in it.
- Introduce distinct visitor copy for producer and selection QR labels.
- Use `Selection QR` externally and keep `user` only as the ownership domain.
- Add optional selection title and description only as account-owned
  presentation, with neutral fallbacks.
- Keep all producer facts and profile links resolved from the canonical CSV.
- Localize the complete selection page and label contract before release.

Phase 1 does not add multiple selections, product-level associations, venue
classification, inventory, scan analytics or producer confirmation.

### Phase 2: enrich one selection

Goal: let an owner explain and maintain the selection without creating a
second producer registry.

Potential capabilities:

- explicit producer ordering;
- a short owner-authored note for each selected producer;
- category sections derived from canonical producer categories;
- an honest selection-updated timestamp;
- additional print layouts for menus, counters, shelves and windows;
- preview-before-download and print-safe accessibility checks.

Selection-specific notes remain clearly attributed to the owner. They never
replace a producer description, verification state, address, category or other
catalog field.

### Phase 3: multiple selections per account

Goal: allow one owner to maintain several contexts while retaining the same QR
family.

Examples include `Autumn menu`, `Wines by the glass`, `Cheese counter` and
`Permanent local selection`. Each selection would need its own stable public
route, visibility, title, contents, order, lifecycle and QR. The existing
`/u/<public_handle>` route should remain the account's default selection or
redirect compatibly; already printed QR labels must not break.

The exact future route shape is deliberately deferred until route, indexing,
archival and handle-collision behavior are designed together.

### Phase 4: product and dish relationships

Goal: connect a physical item or menu entry to a producer without turning the
selection into an unreviewed inventory system.

A future typed relationship could connect:

```text
selection -> menu entry or presented product -> canonical producer
```

Repeated products, media and translations require the separate canonical child
record contracts described by the premium-showcase architecture work. They
must not become numbered area-CSV columns, JSON embedded in a cell or a
database overlay of public producer facts.

Price, stock, availability and real-time menu claims remain out of scope until
Chisan defines ownership, freshness, expiry and correction contracts for them.
Privacy-safe scan analytics may also be evaluated in this phase, but tracking
parameters must not be added to printed canonical QR URLs.

## Trust and content rules

- A producer's presence in a selection means only that the owner chose to
  publish it there.
- The owner may explain the relationship in its own attributed context.
- Chisan may state that producer information comes from the reviewed catalog.
- Chisan must not state that the commercial relationship, current stock,
  current menu or account business type has been verified unless a future
  review workflow proves it.
- Premium and QR availability never buy catalog inclusion, verification or
  ranking.
- A selection may contain producers from any published area or country. The map
  shows that geography honestly without redefining `local` or hiding distance.
- Report and correction paths must make clear whether feedback concerns a
  canonical producer fact or an owner-authored selection statement.

## Accessibility, privacy and localization

- The printed QR retains error correction, sufficient physical contrast and
  the complete quiet zone; no logo is drawn over the code.
- The page offers an accessible list equivalent for every selected producer,
  including those without coordinates.
- Map and list activation remain keyboard-linked and screen-reader-labelled.
- The Selection QR flow does not request or expose the owner or visitor's device
  position.
- The public route keeps its current visibility and indexing rules.
- Owner-authored selection copy renders in its declared source language until
  an explicit translation contract exists; there is no silent machine-
  translation fallback.
- Any future scan measurement must be aggregated, privacy-safe and separated
  from producer identity and account authorization.

## Phase 1 acceptance criteria

The first implementation is complete only when all of the following are true:

1. Producer and Selection QR are the only public QR families.
2. Producer QR opens the exact canonical producer profile and retains the
   producer premium, owner and opt-in checks.
3. Selection QR is account-owned, publicly named as a selection and opens the
   stable public-handle route.
4. The selection map is the primary surface and contains no producer outside
   the owner's explicitly published selection.
5. Saving a favorite never publishes it; only the owner's final explicit
   choice adds that favorite to the selection.
6. The first Selection QR download requires a preview containing at least one
   explicitly selected producer.
7. Neither device location, base municipality, viewport nor proximity adds,
   groups or ranks selection members.
8. Every selected canonical producer remains represented in the attached list;
   missing coordinates affect only its map marker.
9. No user or business-type classification is required.
10. Optional title and description are clearly owner-authored presentation with
    neutral fallbacks.
11. Producer facts remain resolved from CSV by `(country, producer_id)` and are
    not copied into selection storage.
12. QR URLs are stable, same-origin and parameter-free.
13. Premium, QR activation and selection inclusion create no verification or
    ranking signal.
14. Account, locale, map, accessibility, QR-generation and canonical-routing
    tests pass through the repository's required `verify:ai` gate, with visual
    QA recorded under the design contract.

## Explicit non-goals

The first implementation will not:

- discover or recommend nearby producers inside a selection;
- expose every favorite or publish new favorites automatically;
- classify accounts as restaurants, shops or other business types;
- prove that a product is currently available at the QR's physical location;
- create a separate premium producer URL;
- require selected producers to be premium;
- support multiple selections per account;
- create product, dish, price, stock or offer records;
- add scan tracking to canonical URLs;
- copy producer facts into PostgreSQL;
- change the CSV catalog schema.
