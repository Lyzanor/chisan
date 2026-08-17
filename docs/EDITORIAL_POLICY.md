# Editorial Policy

## Purpose

This document defines the stable decision model for catalog eligibility,
verification and online sales. `AGENTS.md` defines the investigation workflow;
`docs/CSV_CONTRACT.md` and `docs/EVIDENCE_CONTRACT.md` define how decisions are
stored.

## Catalog scope

The catalog represents **active, place-based producer identities for food or
drink intended for human consumption**. A producer is eligible only when all
of these are true:

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
sales, a particular legal form or a maximum size. Scale alone neither includes
nor excludes.

One row represents one qualifying productive unit through its public producer
identity, or one governed producer collective, in one area:

- Product lines or labels without a productive unit of their own are not
  separate producers. Their underlying unit is included only if it qualifies.
- Shared ownership or address does not merge genuinely distinct productive
  units.
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

### Candidate gate

A registry, directory, article, map result or product listing is a discovery
signal, not automatic admission. Before adding a new row, establish with
traceable public evidence its identity, qualifying activity, current own offer
and productive location. If one is unknown, keep investigating or retain it in
candidate notes; do not import a speculative row as `pendiente`. If one is
affirmatively false, reject it. Missing search results or a failed fetch prove
neither.

Candidate notes are active discovery workspaces, not decision ledgers. Keep
source sweeps, batch scope, unresolved leads and pending search work in
`docs/candidates/<country>/<area>.md`. When a candidate is accepted, rejected
or found already present, remove its resolved entry while preserving the
document's remaining discovery context. The lasting entity decision belongs in
`data/evidence/**`; a negative tombstone should retain enough sources and
factual notes to explain the exclusion without reopening the same research.

Finding a lead while working another area is not itself an `other-area`
rejection. Route it to the candidate note for its productive area when known;
use `other-area` when the proposed placement in the area under review is the
claim that was checked and disproved. If the productive area is still unknown,
hold the lead with its location clues rather than guessing a destination.

An authoritative institutional directory that explicitly identifies a
qualifying producer, its productive municipality and a public phone or email
can support a usable `parcial` row without an official website, provided the
admission claims are otherwise sufficient. Copy only the fields it publishes,
leave `web` empty when no official site is established, and keep
`Venta online=no comprobado` unless remote sales are separately proven.

## Category assignment

Categories describe material output made by the qualifying productive unit,
not every product associated with its brand, shop, restaurant or visitor
offer. Assign them only from evidence that supports the relevant production.

`categoria` is the required primary category: the best single description of
the unit's defining or most prominent producer activity. `categorias
adicionales` records other distinct, material product lines made by that same
unit. For example, a kura that makes both sake and beer may use `Sake` as its
primary category and `Cerveza` as an additional one; a mixed farm that produces
both dairy and eggs may use either as primary according to its public identity
and record the other as additional.

Apply these boundaries:

- Keep one row, slug, location and evidence identity for the productive unit;
  never duplicate it by category.
- A separately sold product line can support an additional category. A flavour,
  ingredient, raw input, by-product, tasting-menu item or occasional workshop
  output does not do so by itself.
- Products merely resold or stocked alongside the producer's own output do not
  qualify. A farm shop is not categorised by its third-party assortment.
- `productos estrella` and `descripcion` may corroborate the decision but are
  not parsed as taxonomy. Confirm each category from a suitable source rather
  than inferring it mechanically from free text.
- Use `Otros` only when no registered category fits a qualifying output, not as
  a substitute for recording several known categories.

The exact representation, separators and controlled values are defined in
`docs/CSV_CONTRACT.md`.

## Decision order

Resolve exclusions before assigning a verification level. `purge` applies to a
published row; the equivalent decision for a never-published candidate is
`reject`:

| Condition | Existing row | New candidate |
|---|---|---|
| Same productive unit as an existing row | `merge` | Already present; remove from candidates |
| Entity reliably proven not to exist | `purge:nonexistent` | `reject:nonexistent` |
| Entity exists but is not a producer | `purge:not-producer` | `reject:not-producer` |
| Entity is real but fails the catalog scope | `purge:out-of-scope` | `reject:out-of-scope` |
| Permanent closure reliably established | `purge:closed` | `reject:closed` |
| Qualifying productive unit belongs to another area | `purge:other-area` | `reject:other-area` |
| No exclusion applies | Keep and assign `verificacion` | Add only when admission claims are sufficient; otherwise hold |

Use `not-producer` when no material productive activity exists;
use `out-of-scope` when productive activity exists but another scope condition
fails.

Do not turn uncertainty into an exclusion. An unresolved existing row remains
`pendiente` or `parcial` according to the evidence available. An unresolved
candidate receives the workflow outcome `hold` and stays in candidates; `hold`
is not an evidence action and never creates a CSV row.

## Core verification claims

Verification depends on three independent claims:

1. **Identity:** the source identifies the row's entity.
2. **Producer activity:** the entity is active and performs the qualifying
   production or elaboration.
3. **Municipality:** the productive unit belongs to the stated municipality.

| Evidence state | `verificacion` |
|---|---|
| All three claims confirmed by current primary or clearly reliable evidence, including a current verifying source | `verificado` |
| All three claims have evidence, but at least one depends on a secondary source or retains material doubt | `parcial` |
| At least one claim lacks sufficient evidence | `pendiente` |

A verifying source is one capable of showing the producer as current, using the
source types defined in `docs/EVIDENCE_CONTRACT.md`. Registries and other
supporting sources prove only the claims they actually publish; without a
current verifying source they cap the row at `parcial`. `parcial` is a valid,
stable result and must not be promoted merely to clear a queue.

## Online sales

Online sales is independent of identity verification. It records whether a
customer can currently place a remote order through a mechanism explicitly
offered by or on behalf of the producer.

| Evidence | `Venta online` |
|---|---|
| A concrete remote-order channel was seen usable at review time | `sí` |
| The producer's current channels were reviewed and no remote-order mechanism is offered | `no` |
| Not reviewed, ambiguous, inaccessible or temporarily broken | `no comprobado` |

`no` does not require an exhaustive search of the internet. Review the
producer's reasonably identifiable first-party channels far enough to determine
that none offers remote ordering. If a material channel is inaccessible,
stale, contradictory or left unreviewed, prefer `no comprobado`; do not contact
the producer solely to prove a negative.

An own shop, explicit phone/message/email ordering, subscription or official
collective storefront may qualify. Independent third-party resale does not: it
shows product availability, not a sales channel operated for the producer. A
site, catalog, price list, generic contact route or physical point of sale also
does not establish remote ordering by itself.

`Canal de venta` records the demonstrated mechanism and is filled only when
`Venta online=sí`, using the values in `docs/CSV_CONTRACT.md`.

## Boundary cases

Use these outcomes when a superficially similar fact could lead to two different
decisions:

| Situation | Outcome | Boundary |
|---|---|---|
| Related businesses share an owner, address or centroid but operate distinct productive units | Keep separate rows | Shared context is a de-duplication signal, not proof of one unit |
| Several brands or product lines resolve to the same productive unit | Keep one row; merge an already published duplicate | Product branding does not create another producer |
| A large or group-owned unit retains an attributable place-based productive identity and own offer | Eligible if it passes the full scope test | Scale and ownership alone do not exclude |
| A plant only provides contract production, processing or logistics and has no own attributable offer | `out-of-scope` | Productive activity without a qualifying public producer identity is insufficient |
| A candidate is plausible but one admission claim remains unresolved | `hold` in candidates | Uncertainty creates neither a CSV row nor a rejection |
| Products are purchasable only from an independent reseller | `Venta online=no comprobado` | Availability is not a channel operated by or on behalf of the producer |
| A working shop of the producer's official group, designation or governed collective accepts the order | `Venta online=sí` | An official collective channel may operate on the producer's behalf |
| A shop is inaccessible, under maintenance or has no working checkout | `Venta online=no comprobado` | Technical failure proves neither `no` nor closure |
| Another category appears only as resale, ingredient, hospitality or incidental output | Do not assign it | Additional categories require a distinct material output made by the same unit |

## Evidence rules

- Evidence is claim-specific: a source does not inherit authority over facts it
  does not publish.
- Activity, closure and online sales are dynamic and require current evidence.
- Currentness is claim-specific rather than a universal maximum age. Prefer a
  source that makes the reviewed fact observable at review time; older dated
  material may support identity or history but cannot establish a dynamic claim
  by itself.
- Registry absence, search failure, timeout, blocking, TLS/DNS error or a
  broken checkout is uncertainty, not proof of nonexistence, closure or no sale.
- Empty or unresolved is preferable to a plausible invention.

## Policy maintenance

This document is the single source for editorial decisions. A material criteria
change belongs here; update `AGENTS.md` only when the workflow changes. Encode a
rule in `check:csv`, `check:evidence` or `check:defects` only when the stored data
can establish it mechanically, and test that real validator rather than a
parallel synthetic decision model. Run `npx pnpm verify:ai` for validator or
behavior changes.
