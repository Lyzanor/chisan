# Evidence Contract

## Purpose

The CSV publishes producer facts, evidence records the sources behind editorial
decisions, and Git records authorship and earlier states. Evidence never
overrides the CSV or repeats facts already represented there. Editorial meaning
lives in `docs/EDITORIAL.md`.

Evidence uniquely retains:

- **Tombstones.** `reject`, `purge` and `merge` records are the only durable
  trace that a candidate was already resolved. Candidate notes are scratch and
  get pruned; without a tombstone the next pass rediscovers and re-verifies the
  same name.
- **Decision sources.** Each source records what it supports and when it was
  checked; published producer links remain in the CSV.

Together with the open candidate workspace, this creates one continuous
decision trail: a plausible lead remains in `docs/candidates/**` while an
admission answer is unknown, then its relied-on sources move here when the
decision closes. Evidence is the compact conclusion of that work, not a copied
research dossier.

## Retention boundary

Keep enough public context for another editor to understand a decision and avoid
reopening a resolved candidate. Use the structured source fields for URLs, dates
and claims; use a short note for an identity distinction or a source conflict.
Judgement determines the useful amount of context.

| Information | Home |
|---|---|
| Published producer values and related content | CSV or producer content package |
| Public sources, supported claims and closed exclusions | Evidence |
| Open questions, search progress and retries | Candidate note or temporary work |
| Previous values and reviewer authorship | Git |
| Ownership proof, personal information and request audit | Private account workflow |
| Translation, image and geographic assets | Their dedicated contracts |

## Storage

Evidence mirrors the catalog path:

```text
data/csv/<country>/<region>/<area>.csv
data/evidence/<country>/<region>/<area>.jsonl
```

Each non-empty JSONL line is one object. A ledger has at most one current record
per `slug`; later review updates it in place. `keep` requires a current CSV row;
tombstones remain after removal. `producer_id` stays only in the CSV.

Historical coverage is advisory and absence alone is not backfill debt. New
closed decisions normally leave the record required by `docs/EDITORIAL.md`.
Structure is mandatory: malformed evidence fails `check:evidence`.

## Record

| Field | Rule |
|---|---|
| `slug` | Required lowercase ASCII kebab-case; unique within the ledger |
| `action` | `keep`, `reject`, `purge`, or `merge` |
| `reason` | Required for `reject` and `purge`; forbidden elsewhere |
| `targetSlug` | Required for `merge`; forbidden elsewhere |
| `sources` | Required non-empty array of source objects |
| `notes` | Optional factual context not represented elsewhere |

Each source:

| Field | Rule |
|---|---|
| `url` | Unique HTTP(S) URL within the record |
| `type` | One allowed source type below |
| `checkedAt` | `YYYY-MM-DD`; not in the future |
| `claims` | Non-empty, duplicate-free array of allowed claims |
| `note` | Optional fact about this source |

Unknown fields are errors. Do not copy CSV decisions or `producer_id`, Git
authorship, or a separate review timestamp into evidence; `checkedAt` records
when each source was seen.

## Actions

| Action | Required field | CSV relationship |
|---|---|---|
| `keep` | — | `slug` exists in the area CSV |
| `reject` | `reason` | `slug` is absent and the candidate was never published |
| `purge` | `reason` | `slug` no longer exists |
| `merge` | `targetSlug` | source is absent; target exists in the same CSV and differs from it |

Use `reject` for a definitively excluded candidate that never entered the CSV,
and `purge` for a previously published row. Insufficient evidence is neither:
the candidate stays open in its note. Editors own the historical distinction
because the validator can confirm only current CSV presence.

Use `merge` only when two records were determined to be the same productive
unit and one row was removed. A routing-only rename is not a merge; its identity
rules live in `docs/CSV_CONTRACT.md`.

If that surviving unit is later purged, update its incoming `merge` records to
the same supported `purge` decision, retaining a short note about the former
consolidation. Git preserves the earlier merge. Never redirect those records to
an unrelated replacement merely to retain a live target.

### Editorial handoff

Choose `accept`, `update`, `hold`, `reject`, `purge`, `merge`, routing or an
already-represented result only through `docs/EDITORIAL.md` § Editorial
decision matrix. This contract serializes an accepted or updated public row as
`keep`, a rejected never-published candidate as `reject`, a removed published
row as `purge`, and a consolidation of two published rows as `merge`.

`hold`, routing and an already-represented candidate create no evidence record.
Owner or community submissions remain private workflow state until review;
publication copies only accepted public facts into the CSV and, when needed,
the minimum suitable public decision sources here.

### Candidate decision handoff

For a newly accepted candidate, the `keep` sources should collectively make
the four decisive admission answers inspectable:

| Admission answer | Evidence claim |
|---|---|
| The public identity is resolved | `identity` |
| The unit performs qualifying material production or elaboration | `producer-activity` |
| A current resulting product reaches the market under that identity | `own-offer` |
| The productive unit belongs to the stated municipality | `municipality` |

One source may support several answers, or several sources may divide them.
Claims describe only what each source actually publishes; a weaker but
country-approved source ceiling still results in `pendiente` under
`docs/EDITORIAL.md`. `scope` records an explicit inclusion or exclusion finding
and is not a shortcut for the four admission claims.

This expectation applies to new admissions and to a row when its admission is
materially re-reviewed. Historical claim coverage remains advisory: do not
rewrite thousands of otherwise untouched records merely to add tokens. The
changed-evidence check warns about an incomplete claim map on a new row without
turning that warning into automatic editorial truth.

### Exclusion reasons

| `reason` | Meaning |
|---|---|
| `not-producer` | The entity does not produce or elaborate |
| `other-area` | The productive unit belongs in a different area CSV |
| `closed` | Permanently closed or ceased |
| `nonexistent` | The named entity does not resolve to a real unit |
| `out-of-scope` | Real producer whose output or public identity falls outside the catalog scope |

State the reason a reader could not infer from the sources in `notes`. For an
explicit product-scope exclusion, distinguish the output established by the
source from the editorial rule that excludes it; do not invent a missing origin
or lack of production to justify that rule. Clarifying that reasoning does not
refresh a source's `checkedAt` unless the source was opened again.

## Claims

| Claim | Meaning |
|---|---|
| `identity` | Identifies the entity |
| `producer-activity` | Shows qualifying production or elaboration, including its material outputs and that they are current |
| `own-offer` | Shows a current resulting food or drink offered under an identity attributable to this producer |
| `municipality` | Places the productive unit in the stated municipality |
| `location` | Supports address or coordinates |
| `contact` | Publishes a direct contact route or visiting details |
| `online-sales` | Supports the reviewed sales channels, store page and remote-order status |
| `link-ownership` | Connects a retained link to the entity |
| `duplicate` | Shows that two rows are the same productive unit |
| `closure` | Establishes permanent closure |
| `scope` | Establishes catalog inclusion or exclusion |
| `existence` | Resolves whether the named entity exists |

A source supports only its listed claims. The vocabulary is closed on purpose: a
finer distinction belongs in a source `note`, not in a new token. For
`categoria` and `categorias adicionales`, the sources carrying
`producer-activity` must support the material outputs behind the assignment.

## Source types

Allowed values are `official-site`, `official-store`, `official-social`,
`google-maps`, `public-registry`, `regulatory-council`,
`institutional-directory`, `marketplace`, `press`, and `other`.

A type does not make every claim reliable or determine `verificacion`. A
`google-maps` source is a specific opened and matched listing, never a generated
search or coordinate-only URL; upstream sources support `lat`/`lon`.

## Source context and notes

Record the public URL actually consulted, remove tracking or access tokens, and
choose the claims it supports. `checkedAt` is the date that source was opened;
an unrelated batch or commit does not refresh it. On a new review, update a
`keep` record to the sources now supporting it. Closed tombstones retain their
original decision sources; Git keeps previous versions.

A source note explains that source; record-level notes explain the decision.
Useful: "The registry identifies two plants; this row covers the dairy plant."
Unhelpful: a copy of the producer's address, a search transcript or a reminder to
run a validator. Evidence remains public: private documents and credentials
belong to the account workflow.

### Example

This fictional record illustrates the shape; it is not catalog evidence:

```json
{"slug":"example-farm","action":"keep","sources":[{"url":"https://example.org/farm","type":"official-site","checkedAt":"2026-01-10","claims":["identity","producer-activity","own-offer","municipality"],"note":"The producer describes its current cheese range and the dairy where it is made."}]}
```

Use a second source when it contributes another claim or resolves uncertainty.
There is no required number beyond the non-empty `sources` array.

## Validation

```bash
npx pnpm check:evidence
npx pnpm test:evidence-contract
```

The validator enforces the structure and CSV relationships above. Malformed
records fail; coverage is advisory. A green run proves consistency, not factual
truth or complete provenance.
