# Evidence Contract

## Purpose

`data/csv/**` remains the only producer-data source of truth used by the app.
Evidence ledgers record why an editorial decision was made: source, date,
claim and resulting state. They are an audit layer, not a second catalog.

The knowledge hierarchy is:

1. `data/csv/**`: current public producer state.
2. `data/evidence/**`: structured provenance for editorial decisions.
3. `data/evals/**`: stable policy examples that prevent criteria drift.
4. Area ledgers and Git history: local context, progress and narrative.

## Optional audit layer

Evidence is provenance, not a gate. The CSV is the source of truth; evidence
records explain decisions but never block an area from being considered
done.

- Every evidence record that exists is validated by `npx pnpm check:evidence`,
  but the validator is **non-blocking**: problems are reported as warnings, not
  errors, and never fail `verify:data` / `verify:ai`.
- Writing evidence is cheapest at decision time, when the sources are already
  open: prefer adding a record when you add a producer, re-verify one, resolve
  `Venta online`, or purge/merge — not as a retroactive backfill of an
  already-verified area.
- `data/evidence/coverage.json` is an **advisory** list of areas whose
  ledger already covers every current row. It records that fact for humans; it
  does not impose a requirement and is never enforced.
- An area is never required to have any evidence record. Missing records are
  not a defect or a debt.

## Layout

Evidence mirrors the CSV layout:

```text
data/csv/es/catalunya/barcelona.csv
data/evidence/es/catalunya/barcelona.jsonl
```

Each non-empty JSONL line is one decision. Use one latest `keep` record per
current producer. Git preserves earlier versions. `purge` and `merge` records
remain as tombstones so destructive decisions stay explainable.

JSONL is intentional: agents can locate one `slug` with `rg` and replace one
line without loading or rewriting a large area ledger.

## Keep record

```json
{"slug":"example-producer","reviewedAt":"2026-06-15","reviewedBy":"editor-id","action":"keep","decision":{"verification":"verificado","onlineSales":"sí","salesChannels":["ecommerce"]},"sources":[{"url":"https://example.com/shop","type":"official-store","checkedAt":"2026-06-15","claims":["identity","producer-activity","municipality","online-sales"]}],"notes":"Optional material exception only."}
```

The decision must exactly match the current CSV row:

- `verification` ↔ `verificacion`
- `onlineSales` ↔ `Venta online`
- `salesChannels` ↔ `Canal de venta`

Channel order is irrelevant.

## Purge and merge records

```json
{"slug":"old-row","reviewedAt":"2026-06-15","reviewedBy":"editor-id","action":"purge","reason":"not-producer","sources":[{"url":"https://example.com/about","type":"official-site","checkedAt":"2026-06-15","claims":["identity","scope"]}]}
{"slug":"duplicate-row","reviewedAt":"2026-06-15","reviewedBy":"editor-id","action":"merge","targetSlug":"surviving-row","sources":[{"url":"https://example.com/contact","type":"official-site","checkedAt":"2026-06-15","claims":["identity","duplicate"]}]}
```

Allowed purge reasons:

- `not-producer`
- `other-area`
- `closed`
- `nonexistent`
- `out-of-scope`

The deleted source `slug` must not remain in the CSV. A merge target must exist
in the same area.

## Claims

Sources state what they support rather than acting as an undifferentiated URL
list.

| Claim | Meaning |
|---|---|
| `identity` | The source belongs to or identifies the entity. |
| `producer-activity` | The entity produces or elaborates in catalog scope. |
| `municipality` | The productive unit belongs to the stated municipality. |
| `location` | Address or coordinates are supported. |
| `contact` | A direct contact route is published by or for the entity. |
| `online-sales` | Current remote ordering status was checked. |
| `link-ownership` | A preserved web/social/maps link belongs to the entity. |
| `duplicate` | Two rows represent the same productive unit. |
| `closure` | Permanent closure is reliably established. |
| `scope` | Evidence establishes inclusion or exclusion from producer scope. |
| `existence` | Evidence resolves whether the named entity exists. |

Minimum claim requirements:

- `verificado`: `identity`, `producer-activity`, `municipality`, plus at least
  one source of a *verifying* type (see Source types below).
- `parcial`: `identity` and `municipality`.
- `Venta online=sí|no`: `online-sales`.
- `merge`: `duplicate`.
- `purge`: the claim associated with its reason.

## Source types

Allowed values:

- `official-site`
- `official-store`
- `official-social`
- `google-maps`
- `public-registry`
- `regulatory-council`
- `institutional-directory`
- `marketplace`
- `press`
- `other`

Source type does not override editorial judgment. A registry may establish
existence but not current activity; a marketplace may establish a live sale
but not the producer's municipality.

For `verificado`, the *verifying* types are `official-site`, `official-store`,
`official-social`, `google-maps` and `marketplace`; `check:evidence` requires
at least one of them. The remaining types — `public-registry`,
`regulatory-council`, `institutional-directory` and `press` — are *supporting*:
they can establish existence, identity or localization, but on their own cap a
row at `parcial`, because a listing confirms that an entity existed, not that it
produces today. This mirrors the discovery protocol in `AGENTS.md`: listing
supports at most `parcial`.

## Dates and freshness

- `reviewedAt`: date of the editorial decision.
- `checkedAt`: date the specific source was inspected.
- Both use `YYYY-MM-DD`, cannot be in the future, and `checkedAt` cannot be
  later than the decision it supports.
- `reviewedBy`: stable editor or agent identifier, used for accountability
  without relying on chat history.
- There is no universal expiry period. Freshness depends on the claim.
- Dynamic claims such as activity, closure and online sales require current
  evidence at review time and should be rechecked during maintenance.

A source returning HTTP 200 is not proof that its claim remains true.

## Validation

```bash
npx pnpm check:evidence
npx pnpm test:evidence-contract
```

The validator checks JSONL shape, allowed values, dates, claims, source URLs,
slug existence, merge/purge consistency and exact CSV decision parity. It runs
**non-blocking**: any mismatch is a warning, not a build-breaking error, and
areas listed in `coverage.json` are no longer required to cover every row.

It checks that the required claims are present and that at least one verifying
source type exists, but it does not bind a claim to a source: confirming that a
verifying source actually carries `identity`, `producer-activity` and
`municipality` stays an editorial judgment. A green `check:evidence` means the
record is well-formed and consistent with the CSV, not that the strongest
source proves every core claim.

`npx pnpm verify:data` includes the evidence contract. Changes to the evidence
validator or policy code require `npx pnpm verify:ai`.
