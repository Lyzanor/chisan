# Editorial Policy and Workflow

## Purpose and ownership

This document defines both the stable editorial decisions for catalog
eligibility, verification, categories and online sales, and the three operating
levels used to research and publish those decisions. `docs/CSV_CONTRACT.md`
defines how published values are represented, and `docs/EVIDENCE_CONTRACT.md`
defines how their sources and durable negative decisions are stored.

The CSV catalog is Chisan's canonical public producer record and trust core.
Validators can establish consistency, not editorial truth.

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
signal, not automatic admission. Add a row only after public evidence supports:

1. the producer identity;
2. qualifying productive activity and a current own offer;
3. the productive area and municipality;
4. a primary category; and
5. no proven permanent closure or duplicate of the same unit.

Unknown is not false. Hold an unresolved candidate in its area note with a
concrete blocker; never publish it speculatively as `pendiente`. Reject only an
affirmatively disproved candidate. A failed search or fetch proves neither
inclusion nor exclusion.

Admission and full enrichment are separate. An admitted row may lack optional
fields. It uses `pendiente` when a core claim still depends on secondary evidence
or retains material doubt; otherwise `verificacion` stays empty. A suitable
institutional directory can support a `pendiente` row without an official site,
but only for the claims it actually publishes.

Candidate notes are temporary discovery workspaces. Resolved decisions and
their sources belong in `data/evidence/**`; accepted facts belong in the CSV.
Route an incidental lead to its productive area when known. Use `other-area`
only when the proposed placement was checked and disproved, not merely because
the lead was found elsewhere.

## Category assignment

Categories describe material output made by the qualifying unit, not everything
sold by its brand, shop, restaurant or visitor offer. `categoria` is the best
single description of its defining activity; `categorias adicionales` records
other distinct, material product lines made by that same unit.

Keep one row and identity across categories. Do not promote flavours, inputs,
by-products, occasional outputs or third-party assortment into categories.
Free text may corroborate a category but never assigns one mechanically. Use
`Otros` only when no registered category fits. Exact tokens and representation
live in `docs/CSV_CONTRACT.md`.

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

Review the producer's reasonably identifiable first-party channels; an own shop,
explicit remote ordering, subscription or official collective storefront may
qualify. Third-party resale, a catalog, a generic contact route or a physical
point of sale does not. If a material channel is inaccessible, stale,
contradictory or unreviewed, prefer `no comprobado`; a broken checkout proves
neither `no` nor closure.

`Canal de venta` records the demonstrated mechanism and is filled only when
`Venta online=sí`, using the values in `docs/CSV_CONTRACT.md`.

## Canonical language and localized presentation

Canonical `descripcion` records its actual per-row source language. Prefer
precise, supportable prose over a weaker text written to satisfy a country-wide
language target.

The area row remains the factual decision: correct factual or source-locale
errors there, never only in a translation. Translation sidecars are versioned
presentation, not evidence, and must preserve every supported fact and proper
name without adding claims. Missing or stale variants remain unpublished rather
than falling back to prose in another language. The complete locale, sidecar and
generation contract lives in `docs/CSV_CONTRACT.md`.

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
country, area or catalog. Candidate notes, CSV rows and evidence records are the
handoff artifacts; do not add progress columns or status inventories that repeat
them.

Work in finite batches with an explicit scope and cutoff. Finish an open batch
before expanding the same search; when a published row's admission is doubtful,
confirm eligibility before enriching it. Capture explicit incidental facts from
an already-open source when the identity match is clear, but leave lateral
research for another batch. Country priorities and auditor filters select work;
they never classify a whole country or permanently complete a producer.

## Level 1 — Discovery

**Objective:** collect concrete, locatable signals of plausible producers, not
yet prove admission or complete a future profile.

Start from an explicit public source and bounded scope, then de-duplicate against
the CSV and area note. Record only the identity, location clue, likely category,
reason it may qualify, discovery URL, date and visible doubt required for another
editor to continue. Do not fill gaps or research the whole future profile.

Use only no-cost public sources and endpoints that cannot incur charges. The
handoff is a finite area-note batch under `docs/candidates/README.md`; Level 1
creates neither a CSV row nor evidence decision.

## Level 2 — Catalog admission

**Objective:** decide every candidate in the batch and publish only units that
already meet the editorial admission threshold.

Apply the candidate gate and decision order above. A new row is never a parked
candidate: accept it only when the admission claims are sufficient, reject it
only when an exclusion is proven, or retain one actionable blocker. Capture
confirmed incidental fields already exposed by the in-scope sources without
turning admission into full enrichment.

Accepted rows receive a `keep` and leave the note; rejected candidates receive a
tombstone and leave the note; unresolved candidates remain without a CSV or
evidence decision. Exact coordinates are optional, but the productive
municipality is not; follow `docs/GEOLOCATION.md` and leave an unsupported point
empty.

## Level 3 — Verification and enrichment

**Objective:** review and improve an admitted row so it is as useful, current and
complete as the sources permit in that pass.

Resolve falsehoods and contradictions first. Then handle signals requiring a
decision, then optional coverage. Review the three core claims and every in-scope
field against the contract that owns it: CSV representation, geolocation,
images, links, localization or accounts. Do not treat empty `verificacion` or an
auditor with no warning as proof.

A broad pass means **reviewed**, not **filled** or permanently complete. An empty
optional cell may be the correct result; `pendiente` may be the correct source
ceiling, and an inaccessible channel may require `no comprobado`. An empty
verification cell makes no certification claim.

The row remains reopenable when a better source, contradiction or elapsed time
warrants review. Do not turn a legitimate source ceiling into fiction merely to
empty an advisory queue.

## Batch closure

Close only the stated scope. Reconcile the CSV, evidence, candidate note and
image assets that the batch touched; update existing evidence records rather than
appending duplicates. Inspect the intended diff, use the changed-data checks in
`AGENTS.md` while iterating, and finish with `npx pnpm verify:data`. A green gate
proves consistency, not truth or permanent completeness.

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

Entitlements and expanded fields never change admission, ranking, source
authority or `verificacion`. Their representation lives in
`docs/CSV_CONTRACT.md`; authorization, suspension and proposal handling live in
`docs/ACCOUNT_SYSTEM.md`.

## Maintenance

Material editorial criteria and handoff changes belong in this document. Update
the storage contracts only when representation changes, and `AGENTS.md` only for
repository-wide invariants or gates. Encode a rule in `check:csv`,
`check:evidence` or `check:defects` only when stored data can establish it
mechanically. Validator or behavior changes require `npx pnpm verify:ai`.

Temporary queues, counts, tool output and rollout state do not belong in policy
or country guides. Link and defect checks classify work; they never make an
editorial decision.
