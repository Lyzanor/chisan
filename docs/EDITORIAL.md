# Editorial Policy and Workflow

## Purpose and ownership

This document defines both the stable editorial decisions for catalog
eligibility, verification, categories and online sales, and the three operating
levels used to research and publish those decisions. `docs/CSV_CONTRACT.md`
defines how published values are represented, and `docs/EVIDENCE_CONTRACT.md`
defines how their sources and durable negative decisions are stored.

The CSV is the product. Validators can establish structural consistency, not
editorial truth.

## Catalog scope

The catalog represents **active, place-based producer identities for food or
drink intended for human consumption**. A producer is eligible only when all of
these are true:

1. **Productive responsibility:** the entity performs a material production or
   elaboration step, directly or, for a producer collective, through members
   whose output it governs.
2. **Place:** that activity belongs to an identifiable productive unit in the
   stated area and municipality.
3. **Own offer:** at least one resulting food or drink reaches the market under
   a public producer identity that remains attributable through sale.
4. **Place-based identity:** public evidence connects that identity and product
   to the unit as their origin or maker, not merely to an interchangeable plant.

“Own” describes responsibility for both production and product identity. It
does not require ownership of the premises or raw materials, direct-to-consumer
sales, a particular legal form or a maximum size. Scale and group ownership
alone neither include nor exclude a producer.

One row represents one qualifying productive unit through its public producer
identity, or one governed producer collective, in one area:

- Product lines or labels without a productive unit of their own are not
  separate producers. Their underlying unit is included only if it qualifies.
- Shared ownership, address or a nearby centroid is a de-duplication signal,
  not proof that genuinely distinct productive units are one producer.
- A collective qualifies when it is the actual productive or market identity
  of its members' output. A member qualifies separately only if it also meets
  the full test.
- A unit that produces for third parties still qualifies when it also has an
  own offer; a service-only or contract-only unit does not.

Typical exclusions are pure retailers, hospitality businesses, distributors,
directories, service providers, product labels without their own unit,
anonymous group plants and registry entries that identify only a holding,
facility or certification. The reason is the failed criterion, not the sector
or business form.

## Candidate gate and lifecycle

A registry, directory, article, map result or product listing is a discovery
signal, not automatic admission. Before adding a row, establish with traceable
public evidence its identity, qualifying activity, current own offer and
productive location. If one claim is unknown, keep investigating or hold the
candidate in its area note; never import a speculative row as `pendiente`. If a
claim is affirmatively false, reject the candidate. Missing search results or a
failed fetch prove neither inclusion nor exclusion.

Admission and full enrichment are separate. The gate also requires a supported
primary category, a check for permanent closure and a de-duplication decision
for the productive unit. It does not require every optional CSV field. Because
an admitted candidate has evidence for all three core verification claims, it
may enter as `pendiente` when a secondary source or material doubt remains;
otherwise `verificacion` stays empty.

An authoritative institutional directory that explicitly identifies a
qualifying producer, its productive municipality and a public phone or email
can support a usable `pendiente` row without an official website when the other
admission claims are sufficient. Copy only the fields it publishes, leave `web`
empty unless an official site is established, and retain `Venta online=no
comprobado` unless remote sales are separately proven.

Candidate notes are active discovery workspaces, not decision ledgers. Keep
source sweeps, batch scope, unresolved leads and pending searches in
`docs/candidates/<country>/<area>.md`. Remove a resolved entry when it is
accepted, rejected or found already present, while preserving the remaining
discovery context. Durable entity decisions belong in `data/evidence/**`;
negative tombstones retain enough sources and facts to avoid reopening the same
research.

An incidental lead for another area is not itself an `other-area` rejection.
Route it to the productive area's candidate note when known. Use `other-area`
only when the proposed placement under review was checked and disproved. If the
productive area is unknown, hold the lead with its location clues rather than
guessing a destination.

## Category assignment

Categories describe material output made by the qualifying productive unit,
not every product associated with its brand, shop, restaurant or visitor offer.
Assign them only from evidence that supports the relevant production.

`categoria` is the required primary category: the best single description of
the unit's defining or most prominent producer activity. `categorias
adicionales` records other distinct, material product lines made by that same
unit. For example, a kura that makes both sake and beer may use `Sake` as its
primary category and `Cerveza` as an additional one; a mixed farm that produces
both dairy and eggs may use either as primary according to its public identity
and record the other as additional.

Apply these boundaries:

- Keep one row, `producer_id`, slug, location and evidence identity for the
  productive unit; never duplicate it by category.
- A separately sold product line can support an additional category. A flavour,
  ingredient, raw input, by-product, tasting-menu item or occasional workshop
  output does not do so by itself.
- Products merely resold or stocked alongside the producer's own output do not
  qualify. A farm shop is not categorised by its third-party assortment.
- `productos estrella` and `descripcion` may corroborate a category but are not
  parsed as taxonomy. Confirm each category from a suitable source rather than
  inferring it mechanically from free text.
- Use `Otros` only when no registered category fits a qualifying output, not as
  a substitute for recording several known categories.

Exact values, separators and representation live in `docs/CSV_CONTRACT.md`.

## Decision order

Resolve exclusions before assigning a verification label. `purge` applies to a
published row; `reject` is the equivalent for a never-published candidate:

| Condition | Existing row | New candidate |
|---|---|---|
| Same productive unit as an existing row | `merge` | Already present; remove from candidates |
| Entity reliably proven not to exist | `purge:nonexistent` | `reject:nonexistent` |
| Entity exists but is not a producer | `purge:not-producer` | `reject:not-producer` |
| Entity is real but fails the catalog scope | `purge:out-of-scope` | `reject:out-of-scope` |
| Permanent closure reliably established | `purge:closed` | `reject:closed` |
| Qualifying productive unit belongs to another area | `purge:other-area` | `reject:other-area` |
| No exclusion applies | Keep and assign `verificacion` | Add only when admission claims are sufficient; otherwise hold |

Use `not-producer` when no material productive activity exists. Use
`out-of-scope` when productive activity exists but another scope criterion
fails.

Do not turn uncertainty into an exclusion. An unresolved existing row remains
`pendiente` according to the available evidence. An unresolved
candidate receives the workflow outcome `hold` and remains in candidate notes;
`hold` is not an evidence action and never creates a CSV row.

## Core verification claims

Verification depends on three independent claims:

1. **Identity:** the source identifies the row's entity.
2. **Producer activity:** the entity is active and performs the qualifying
   production or elaboration.
3. **Municipality:** the productive unit belongs to the stated municipality.

| Evidence state | `verificacion` |
|---|---|
| All three claims are confirmed by current primary or clearly reliable evidence, including a current verifying source | empty |
| All three claims have evidence, but at least one depends on a secondary source or retains material doubt | `pendiente` |
| An existing row lacks sufficient evidence for at least one claim | `pendiente` |

A verifying source is capable of showing the producer as current. Source types
are represented in `docs/EVIDENCE_CONTRACT.md`, but a type does not make every
claim reliable. Registries and other supporting sources prove only what they
publish; without a current verifying source the row remains `pendiente`.
`pendiente` can be a valid, stable source ceiling and must not be cleared merely
to reduce a queue.

`verificacion` is a public editorial caveat, not proof that a review was
performed correctly and not a terminal workflow state. Empty means that Chisan
shows no editorial verification label; it does not certify the row or any
optional field. A later pass can add or clear `pendiente` as the sources change,
and each filled value remains a separate public claim.

## Online sales

Online sales is independent of identity verification. It records whether a
customer can currently place a remote order through a mechanism explicitly
offered by or on behalf of the producer.

| Evidence | `Venta online` |
|---|---|
| A concrete remote-order channel was seen usable at review time | `sí` |
| The producer's current channels were reviewed and no remote-order mechanism is offered | `no` |
| Not reviewed, ambiguous, inaccessible or temporarily broken | `no comprobado` |

`no` does not require an exhaustive internet search. Review the producer's
reasonably identifiable first-party channels far enough to determine that none
offers remote ordering. If a material channel is inaccessible, stale,
contradictory or unreviewed, prefer `no comprobado`; do not contact the producer
solely to prove a negative.

An own shop, explicit phone/message/email ordering, subscription or official
collective storefront may qualify. Independent third-party resale does not: it
shows availability, not a sales channel operated by or for the producer. A
catalog, price list, generic contact route or physical point of sale also does
not establish remote ordering by itself. An inaccessible or broken checkout
proves neither `no` nor closure.

`Canal de venta` records the demonstrated mechanism and is filled only when
`Venta online=sí`, using the values in `docs/CSV_CONTRACT.md`.

## Canonical language and localized presentation

The canonical `descripcion` is editor-authored producer prose and has an
explicit per-row source language in `descripcion_locale`. There is no
one-language-per-country editorial rule: neighboring rows may legitimately
have different source locales. Choose a suitable local language when authoring
new prose, but prefer a precise, supportable description over a weaker text
written merely to satisfy a language target.

The description-source registry is deliberately broader than Chisan's public
presentation locales. `gl` and `eu` may identify canonical prose without
creating a route, cookie, dictionary, manifest locale, sidecar target or
`hreflang`. Public activation remains a separate reviewed decision.

The canonical area row remains the factual decision. When a description is
wrong, incomplete or misleading, correct it there and record its actual source
locale. Do not repair a factual problem only in a translation. A source edit or
source-locale correction invalidates its generated variants until they are
regenerated or reviewed against the new source.

Use the advisory source-locale audit to plan a narrow review when a mechanical
backfill, import or mixed-language area may have recorded the wrong locale:

```bash
npx pnpm audit:description-locales --country es --declared-locale es \
  --candidate-locale ca --output /tmp/chisan-es-ca-locale-review.json
```

The report is deterministic, includes the canonical source hash and can be
limited by area. It is deliberately kept outside `data/csv/**` and has no apply
mode. Detection is always unrestricted before any `--candidate-locale` filter,
so French prose cannot be forced into a Catalan candidate merely because the
review asks for Catalan. An unregistered detected language is still only a
review lead, and a registered source-only language still cannot authorize a
public locale. Scores are relative rankings rather than confidence, and
low-margin results remain in the report as `ambiguous`.

For exhaustive review, emit a separate roster instead of treating classifier
agreement or absence from the candidate report as confirmation:

```bash
npx pnpm audit:description-locales --country es --area barcelona \
  --full-review-roster --output /tmp/chisan-barcelona-locale-roster.json
```

The classifier is unreliable on some short or mixed catalog prose, so every
result is only a candidate for an editor to read. Record any reviewed correction
in the canonical row and refresh or re-review affected sidecars normally.

Automatic translation is allowed only as versioned, materialized presentation
under the sidecar contract in `docs/CSV_CONTRACT.md`. It is not evidence and
does not independently establish producer identity, activity, location,
products, verification or sales. Generation and review must preserve every
supported fact, number, URL, proper name, brand and appellation; they must not
add claims, omit qualifications or turn factual prose into promotion.

The initial automatically translatable field is only `descripcion`.
Source-authored names, municipality, address, official product names, published
hours, contacts and links remain unchanged on every language variant; localize
their interface labels rather than their values. Category and controlled-value
tokens likewise remain stable storage identifiers with separate display
labels.

An ordinary generated translation may remain `origin=machine` after the
language's benchmark and publication sample have been approved. An editor may
replace exceptional wording and mark that sidecar row `origin=reviewed`.
Automatic generation never overwrites reviewed text, but reviewed text is still
tied to the current canonical source and requires renewed review when stale.
Missing or stale translations are honest incomplete presentation: hold that
locale variant from indexed publication instead of mixing in prose from a
different language.

## Evidence principles

- Evidence is claim-specific: a source does not inherit authority over facts it
  does not publish.
- Activity, closure and online sales are dynamic and require current evidence.
- Currentness is claim-specific rather than a universal maximum age. Prefer a
  source that makes the reviewed fact observable at review time; older dated
  material may support identity or history but cannot establish a dynamic claim
  by itself.
- Registry absence, search failure, timeout, blocking, TLS/DNS error or a broken
  checkout is uncertainty, not proof of nonexistence, closure or no sale.
- Verified ownership authorizes a proposal; it does not prove the proposed
  public fact. Apply the same source, currentness and scope tests, and never copy
  private claim material into public evidence.
- Empty or unresolved is preferable to a plausible invention.

## Operating model

The three levels below are kinds of work on an entity, not states assigned to a
country, area or catalog. One CSV may simultaneously contain discovery leads,
admission decisions and published rows at different stages of review. Candidate
notes, CSV rows and evidence records are the handoff artifacts; do not add
progress columns, status tables or manual inventories that repeat them.

### Choosing the focus

A country's `AGENTS.md` `Operating state` supplies shared priorities, source
ceilings and risks; it never assigns one workflow level to the whole country.
Choose the next work for a specific candidate or producer:

1. finish the already-open batch and its candidate cutoff;
2. resolve discovered candidates before expanding the same search;
3. when a published row's admission is doubtful, confirm that it should exist
   before enriching it;
4. open new discovery only with a concrete area, source, category or
   municipality scope.

This order applies within work that shares context; it does not require emptying
a national queue before touching another one. Auditor filters select tasks but
do not permanently classify a producer.

A batch belongs to one level even when an open source exposes useful data for
the next. Capture explicit incidental facts when the entity match is clear, but
do not turn the batch into an unlimited search. Findings after the cutoff belong
to the next batch.

Live queues come from the artifacts, never from a written status summary:

- level 1 and new level-2 admissions:
  `docs/candidates/<country>/<area>.md`;
- published level-2 debt:
  `npx pnpm check:defects --stage admission --country <iso>`;
- level 3:
  `npx pnpm check:defects --stage verification --country <iso>` and the area
  roster from `npx pnpm list:producers <area>`;
- verified-owner change proposals: the PostgreSQL queue at `/admin/cambios`,
  which enters level 3 when reviewed.

The auditor prioritizes only signals derivable from stored data. A row with no
warning is not thereby verified or permanently complete; any roster row may be
reopened at level 3.

## Level 1 — Discovery

**Objective:** collect concrete, locatable signals of plausible producers, not
yet prove admission or complete a future profile.

Start from an explicit source and scope. De-duplicate minimally against the CSV
and area note. An uncertain match remains a level-2 lead rather than triggering
a second full investigation during discovery.

Use only no-cost public sources and endpoints. Do not add or call an API that
requires billing or a payment method, including a free tier that can incur
charges after its quota.

Each candidate records only what another editor needs to continue:

- public name;
- area and municipality, or the known geographic clue;
- probable category and the concrete reason it may qualify;
- at least one public locator: an official site or profile when available and,
  in every case, the URL that produced the signal;
- search date and scope;
- any already-visible material doubt.

Do not fill gaps by intuition, collect every CSV field or open lateral searches
only to improve the candidate. `docs/candidates/README.md` defines the workspace
format and treatment of incidental findings.

**Handoff:** a finite batch in the area note with a recorded cutoff. Level 1
creates neither a CSV row nor a `keep` record, and the candidate does not yet
assert that the unit is eligible or active.

## Level 2 — Catalog admission

**Objective:** decide every candidate in the batch and publish only units that
already meet the editorial admission threshold.

Investigate the admission claims first:

1. public identity and source match;
2. qualifying productive activity and current own offer;
3. productive unit in the published area and municipality;
4. category supported by that activity;
5. no proven permanent closure or duplicate of the same unit.

A new row is not a parked candidate. If those claims do not reach the threshold,
retain the candidate with a concrete blocker or reject it when exclusion is
proven. If they do, also retain explicit contacts, links, address or products
already exposed by the in-scope sources; admission does not require researching
every field.

Location must be useful and honest. The productive municipality is part of the
threshold. Add exact coordinates or a municipality fallback only when supported
under `docs/GEOLOCATION.md`. If no defensible point exists, empty `lat`/`lon` is
visible level-3 coverage work, not permission to invent a location.

| Outcome | CSV | Evidence | Candidate note |
|---|---|---|---|
| Accepted | Add as `pendiente` when material doubt remains; otherwise leave `verificacion` empty | Create a `keep` with the decision sources | Remove the entry |
| Already present | Update only confirmed incidental data | Update the existing `keep` when appropriate | Remove the entry |
| Rejected | Do not add | Create a `reject` with affirmative proof | Remove the entry |
| Unresolved | Do not add | Create no decision | Retain the blocker and latest attempt |

An admitted `pendiente` row remains published while its evidence has a material
source ceiling. A speculative candidate that has not met the gate remains in
the candidate note instead of entering the CSV.

**Handoff:** every candidate before the cutoff is accepted, already present,
rejected or retained with an actionable blocker; CSV, evidence and candidate
note agree. Use changed-only checks while iterating and close with
`npx pnpm verify:data`.

## Level 3 — Verification and enrichment

**Objective:** review and improve an admitted row so it is as useful, current and
complete as the sources permit in that pass.

Resolve falsehoods and contradictions first. Then handle signals requiring a
decision, such as `Venta online=no comprobado`, borrowed links, non-canonical
Maps URLs, or doubtful categories and prose. Finally address coverage such as
exact coordinates, an image or evidence. When applicable and publicly
supportable, review:

- the three core claims and `verificacion`;
- address, coordinates and the exact Google Maps listing for the same unit;
- contacts and links with a sufficiently matched owner identity;
- current products, categories, description and hours;
- the description's actual source locale when a description is present;
- online sales and their mechanism;
- a current explicit guided-visit offer or explicit absence when that field is
  in scope;
- a producer-authored community message and its actual source locale;
- highlighted links whose subject is the same producer and whose context is
  useful to readers;
- an admissible image.

Do not treat empty `verificacion` as proof. Review the underlying sources; add
or retain `pendiente` when material doubt remains.

A broad pass means **reviewed**, not **filled** or permanently complete. An empty
optional cell may be the correct result; `pendiente` may be the correct source
ceiling, and an inaccessible channel may require `no comprobado`. An empty
verification cell makes no certification claim.

Update an existing `keep` line rather than appending another. A pass closes only
its stated scope, and the row remains reopenable when a better source, new fact,
contradiction or elapsed time warrants review. Do not leave an unjustified defect
inside the batch scope, but do not turn legitimate unresolved signals into
fiction merely to make an advisory queue empty.

## Verified-owner changes

Ownership claims are part of the account system, not a fourth editorial level.
An active producer member's proposal for a published row enters level 3, but
membership authorizes only the proposal and private owner material is not public
evidence. Follow the review, materialization, commit and finalization workflow
in `docs/ACCOUNT_SYSTEM.md`; PostgreSQL never becomes a catalog overlay.

The public label `Verificado por el productor` is derived only from an exact
active owner membership created by an approved claim. It verifies who controls
the producer profile, not the truth of the CSV facts, and never writes or clears
`verificacion`.

The expanded-profile payment is also not a fourth editorial level. It permits
the producer to propose and display the five expanded CSV fields while the
producer entitlement is active; it never changes `verificacion`, ranking,
admission or source authority and does not guarantee publication.

For expanded fields, apply these additional review rules:

- `visitas guiadas` is a current operational claim. Publish `sí` only from an
  explicit current offer and `no` only from explicit, sufficiently current
  support; do not infer either value from ordinary opening hours or silence.
- `mensaje a la comunidad` is producer-authored public speech, not Chisan's
  editorial description. Preserve its meaning and original language, record
  `mensaje_comunidad_locale`, and reject promotion presented as fact, embedded
  URLs, HTML, spreadsheet payloads, private data, harassment, unlawful material
  or unsupported claims about third parties. Review does not turn the message
  into Chisan-authored evidence. Unlike an objective catalog fact, the message
  may be newly submitted first-party speech without a pre-existing public URL;
  record that attribution in the change request and keep account authorship and
  review as its provenance. Every objective claim in other fields still needs
  suitable public support.
- `enlace destacado 1` and `enlace destacado 2` may point to a relevant press
  article, interview or producer page, but must concern the exact producer and
  add reader value. They do not replace the official website, social links or
  evidence, and a highlighted link alone never changes verification.

If an entitlement is suspended after a refund or dispute, do not delete the
reviewed CSV cells as commercial cleanup. The runtime hides them and the account
workflow freezes new premium proposals; editorial removal or correction remains
a separate reviewed catalog decision.

## Maintenance

Material editorial criteria and handoff changes belong in this document. Update
the storage contracts only when representation changes, and `AGENTS.md` only for
repository-wide invariants or gates. Encode a rule in `check:csv`,
`check:evidence` or `check:defects` only when stored data can establish it
mechanically. Validator or behavior changes require `npx pnpm verify:ai`.

Translation rollout order and completion counts are temporary execution state;
do not copy them into this policy, country guides or evidence. Durable sidecar
representation and freshness rules belong in `docs/CSV_CONTRACT.md`.

For dead, parked, or hijacked producer domains, inspect the dated offline
snapshot before browsing:

```bash
npx pnpm check:links --offline
```

Refresh one area with `npx pnpm check:links --area <area>` or the full catalog
with `npx pnpm check:links --all`. Refreshes remove URLs no longer present in
the catalog. The command classifies; it never decides. A `403` is not a dead
site, a `200` is not proof of ownership, and a failed fetch is not proof of
closure.
