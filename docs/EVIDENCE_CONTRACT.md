# Evidence Contract

## Purpose

`data/csv/**` is the only producer-data source of truth and the only layer read
by the app. `data/evidence/**` records what a decision rested on: which sources
were opened, what each one proves, and when it was seen. It never repeats what
the CSV already states, never records what Git already knows, and never
overrides either. Editorial meaning belongs in `docs/EDITORIAL_POLICY.md`.

Two things live here and nowhere else:

- **Tombstones.** `reject`, `purge` and `merge` records are the only durable
  trace that a candidate was already resolved. Candidate notes are scratch and
  get pruned; without a tombstone the next pass rediscovers and re-verifies the
  same name.
- **The source behind a row.** The CSV publishes the producer's own links; the
  registry, directory or padrón that actually acredited the row is only here,
  with the date it was checked.

## Storage

Evidence mirrors the catalog path:

```text
data/csv/<country>/<region>/<area>.csv
data/evidence/<country>/<region>/<area>.jsonl
```

Each non-empty JSONL line is one object. A ledger contains at most one current
record per `slug`; Git keeps earlier versions. Tombstones remain after the row
is gone, while `keep` records describe rows still present in the matching CSV.

A later review updates that record in place — refreshing `checkedAt` and the
sources that still apply — instead of appending a second record for the slug.

Evidence is advisory as coverage: an area or row may have no record, and that is
not debt to backfill. Structure is not advisory: a malformed record fails
`check:evidence`.

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

Unknown fields are errors. Three of them are deliberate exclusions:

| Not in the record | Because it already lives in |
|---|---|
| `decision` (`verificacion`, `Venta online`, `Canal de venta`) | the CSV row, which is the source of truth |
| `reviewedBy` | `git log` / `git blame` |
| `reviewedAt` | the sources' `checkedAt`, which is the fact — the date the proof was seen |

```json
{"slug":"example-producer","action":"keep","sources":[{"url":"https://example.com/shop","type":"official-store","checkedAt":"2026-06-15","claims":["identity","producer-activity","municipality","online-sales"]}]}
{"slug":"example-candidate","action":"reject","reason":"not-producer","sources":[{"url":"https://example.org/listing","type":"institutional-directory","checkedAt":"2026-06-15","claims":["identity","scope"]}]}
{"slug":"old-slug","action":"merge","targetSlug":"current-slug","sources":[{"url":"https://example.com/","type":"official-site","checkedAt":"2026-06-15","claims":["identity","duplicate"]}]}
```

## Actions

| Action | Required field | CSV relationship |
|---|---|---|
| `keep` | — | `slug` exists in the area CSV |
| `reject` | `reason` | `slug` is absent and the candidate was never published |
| `purge` | `reason` | `slug` no longer exists |
| `merge` | `targetSlug` | source is absent; target exists in the same CSV and differs from it |

Use `reject` for a definitively excluded candidate that never entered the CSV,
and `purge` for a previously published row. Insufficient evidence is neither:
the candidate stays open in the candidate note. The validator can confirm
current CSV absence, not historical publication, so editors own this
distinction.

### Exclusion reasons

| `reason` | Meaning |
|---|---|
| `not-producer` | The entity does not produce or elaborate |
| `other-area` | The productive unit belongs in a different area CSV |
| `closed` | Permanently closed or ceased |
| `nonexistent` | The named entity does not resolve to a real unit |
| `out-of-scope` | Real producer, outside the catalog (non-food output, already listed as another row) |

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

A type does not make every claim reliable: editors must still confirm what the
source actually demonstrates. `docs/EDITORIAL_POLICY.md` decides which types can
carry `verificado`.

A `google-maps` source is a specific listing that the editor opened and matched
to the row. A generated text-search URL is a query, not evidence of the result it
happens to return. A coordinate-only Maps URL is not a listing and is not
published in `Google Maps`; the upstream address or coordinate source, not
Google, carries the `location` claim for `lat`/`lon`.

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

The validator checks paths, JSONL shape, allowed fields and values, source URLs
and dates, claims, action invariants, slug uniqueness, CSV presence or absence
per action, and merge targets. **Malformed records fail the run**; coverage is
reported and never fails. A green run proves structural consistency, not factual
truth or complete provenance.

`npx pnpm check:defects --check venta-caducada` lists rows selling online whose
newest source was checked over a year ago — the one queue that only the evidence
dates can produce.
