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

### Exclusion reasons

| `reason` | Meaning |
|---|---|
| `not-producer` | The entity does not produce or elaborate |
| `other-area` | The productive unit belongs in a different area CSV |
| `closed` | Permanently closed or ceased |
| `nonexistent` | The named entity does not resolve to a real unit |
| `out-of-scope` | Real producer whose output or public identity falls outside the catalog scope |

State the reason a reader could not infer from the sources in `notes`.

## Claims

| Claim | Meaning |
|---|---|
| `identity` | Identifies the entity |
| `producer-activity` | Shows qualifying production or elaboration, including its material outputs and that they are current |
| `municipality` | Places the productive unit in the stated municipality |
| `location` | Supports address or coordinates |
| `contact` | Publishes a direct contact route or visiting details |
| `online-sales` | Supports the reviewed sales channels and remote-order status |
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

## Notes

Use `notes` only for durable facts needed to interpret the record: identity
distinctions, source conflicts, unusual source behaviour, moves, or multiple
facilities. Do not restate the CSV, the policy, the workflow or routine source
checks. Use a source-level `note` when the fact concerns only that source.

## Validation

```bash
npx pnpm check:evidence
npx pnpm test:evidence-contract
```

The validator enforces the structure and CSV relationships above. Malformed
records fail; coverage is advisory. A green run proves consistency, not factual
truth or complete provenance.
