# Evidence Contract

## Purpose

`data/csv/**` is the only producer-data source of truth and the only layer read
by the app. `data/evidence/**` is optional structured provenance: it records
who reviewed a decision, when, and which source supports each claim. It never
overrides the CSV. Editorial meaning belongs in `docs/EDITORIAL_POLICY.md`.

## Storage

Evidence mirrors the catalog path:

```text
data/csv/<country>/<region>/<area>.csv
data/evidence/<country>/<region>/<area>.jsonl
```

Each non-empty JSONL line is one object. A ledger contains at most one current
record per `slug`; Git keeps earlier versions. `reject`, `purge`, and `merge`
records remain as tombstones, while `keep` records describe rows still present
in the matching CSV.

Evidence is advisory: an area or row may have no record. Coverage is derived at
audit time from current CSV rows with matching `keep` records; there is no
manual coverage manifest and incompleteness is not an error.

## Common record

Every action uses these fields:

| Field | Rule |
|---|---|
| `slug` | Required lowercase ASCII kebab-case; unique within the ledger |
| `reviewedAt` | Required `YYYY-MM-DD`; not in the future |
| `reviewedBy` | Required non-empty editor or agent identifier |
| `action` | `keep`, `reject`, `purge`, or `merge` |
| `sources` | Required non-empty array of source objects |
| `notes` | Optional factual context not represented elsewhere |

Each source has:

| Field | Rule |
|---|---|
| `url` | Unique HTTP(S) URL within the record |
| `type` | One allowed source type below |
| `checkedAt` | `YYYY-MM-DD`; not later than `reviewedAt` or today |
| `claims` | Non-empty, duplicate-free array of allowed claims |
| `note` | Optional fact about this source |

Unknown fields are reported by the validator.

## Actions

| Action | Required fields | CSV relationship | Required claim |
|---|---|---|---|
| `keep` | `decision` | `slug` exists; decision matches its row | Depends on decision |
| `reject` | `reason` | `slug` is absent and the candidate was never published | Depends on reason |
| `purge` | `reason` | `slug` no longer exists | Depends on reason |
| `merge` | `targetSlug` | source is absent; target exists in the same CSV and differs from source | `duplicate` |

`keep` cannot carry `reason` or `targetSlug`; `reject` and `purge` cannot carry
`decision` or `targetSlug`; `merge` cannot carry `decision` or `reason`.

Use `reject` for a definitively excluded candidate that never entered the CSV,
and `purge` for a previously published row. Insufficient evidence is neither:
the candidate remains open. The validator can confirm current CSV absence, not
historical publication, so editors own this distinction.

### Keep decision

```json
{"slug":"example-producer","reviewedAt":"2026-06-15","reviewedBy":"editor-id","action":"keep","decision":{"verification":"verificado","onlineSales":"sí","salesChannels":["ecommerce"]},"sources":[{"url":"https://example.com/shop","type":"official-store","checkedAt":"2026-06-15","claims":["identity","producer-activity","municipality","online-sales"]}]}
```

The decision must match the CSV exactly:

| Evidence | CSV | Allowed values |
|---|---|---|
| `verification` | `verificacion` | `pendiente`, `parcial`, `verificado` |
| `onlineSales` | `Venta online` | `sí`, `no`, `no comprobado` |
| `salesChannels` | `Canal de venta` | `ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion`, `marketplace` |

Channel order is irrelevant; duplicates are invalid. Channels must be empty
unless `onlineSales=sí`.

Validator minimums:

| Decision | Required claims or source |
|---|---|
| `verificado` | `identity`, `producer-activity`, `municipality`, plus one verifying source type |
| `parcial` | `identity`, `municipality` |
| `pendiente` | No minimum claim set |
| `onlineSales=sí` or `no` | `online-sales` |
| `onlineSales=no comprobado` | No `online-sales` requirement |

These are structural minimums, not proof of editorial sufficiency; the policy
remains authoritative.

### Exclusion reasons

The same reasons and claim minimums apply to `reject` and `purge`:

| `reason` | Required claim |
|---|---|
| `not-producer` | `scope` |
| `other-area` | `municipality` |
| `closed` | `closure` |
| `nonexistent` | `existence` |
| `out-of-scope` | `scope` |

`other-area` means that the productive unit belongs in a different area CSV.

## Claims

| Claim | Meaning |
|---|---|
| `identity` | Identifies the entity |
| `producer-activity` | Shows qualifying production or elaboration |
| `municipality` | Places the productive unit in the stated municipality |
| `location` | Supports address or coordinates |
| `contact` | Publishes a direct contact route |
| `online-sales` | Supports the reviewed remote-order status |
| `link-ownership` | Connects a retained link to the entity |
| `duplicate` | Shows that two rows are the same productive unit |
| `closure` | Establishes permanent closure |
| `scope` | Establishes catalog inclusion or exclusion |
| `existence` | Resolves whether the named entity exists |

A source supports only its listed claims.

## Source types

Allowed values are `official-site`, `official-store`, `official-social`,
`google-maps`, `public-registry`, `regulatory-council`,
`institutional-directory`, `marketplace`, `press`, and `other`.

For the structural `verificado` check, verifying types are `official-site`,
`official-store`, `official-social`, `google-maps`, and `marketplace`. A type
does not make every claim reliable: editors must still confirm what the source
actually demonstrates.

## Notes

Use `notes` only for durable facts needed to interpret the record: identity
distinctions, source conflicts, unusual source behaviour, moves, or multiple
facilities. Do not restate the decision, policy, workflow, or routine source
checks. Use a source-level `note` when the fact concerns only that source.

## Validation

```bash
npx pnpm check:evidence
npx pnpm test:evidence-contract
```

The validator checks paths, JSONL shape, allowed fields and values, dates,
source URLs, claims, action invariants, slug existence, merge targets, and exact
CSV parity. It also reports ledger and row coverage derived from the current
catalog. Issues are warnings and never block `verify:data` or `verify:ai`. A
green run proves structural consistency, not factual truth or complete
provenance.
