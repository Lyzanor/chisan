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

## Retention boundary

Evidence is a minimal public decision index, not a research dossier, row
snapshot or audit log. Information belongs here only when all of these are true:

1. it is needed to understand a current `keep` decision or to avoid reopening a
   closed `reject`, `purge` or `merge` decision;
2. it is a public source pointer, a claim that pointer supports, or durable
   context that cannot be inferred from the structured record;
3. it is not already authoritative in the CSV, Git, PostgreSQL or a specialized
   contract; and
4. it fits the closed record shape below without inventing another field.

If any condition fails, do not retain the information in evidence.

| Information | Durable home | Evidence treatment |
|---|---|---|
| Current producer facts, links, location, category, verification, `country`, `region`, `area`, `slug` and `producer_id` | Area CSV | Do not copy them; use only the evidence `slug` reference |
| Public source URL, source type, date opened and claims relied on | Evidence `sources` | Retain the minimum sufficient set |
| Final exclusion, removal or duplicate resolution | Evidence tombstone | Retain the action, required reason or target, and its supporting sources |
| Non-obvious identity distinction, source conflict, move or multiple-facility interpretation | Evidence `notes` or source `note` | Retain only the fact needed to interpret the decision |
| Unresolved candidate, search query, discovery queue, batch cutoff, ranking, failed fetch or retry state | Candidate note or temporary work artifact | Do not retain |
| Earlier row values, diffs, reviewer identity and review/commit time | Git | Do not retain |
| Submission author, account, ownership proof, private document, membership, entitlement, payment or request audit | PostgreSQL or the private account workflow | Do not retain; a later public editorial source may be retained after review |
| Translation text, model, prompt, engine or glossary metadata | Translation sidecar and its registry | Do not retain |
| Image binary, screenshot, contact sheet, sweep bundle or image-review state | Public asset or temporary image workflow | Do not retain; a public URL belongs here only when it supports a catalog decision |
| Area-boundary geometry, licence and build metadata | Boundary source and generated geography contracts | Do not retain |

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

## Source minimization

- Store the exact public URL that an editor opened and only the claims actually
  relied on. A source included merely because it is related is not evidence.
- Store a pointer, not a copy: no quotations, page text, raw HTML, screenshots,
  cached responses, search results, queries, rankings, confidence scores, model
  output or tool transcripts.
- Remove tracking, session, authentication and signed-access parameters. Keep a
  stable query parameter only when it identifies the public source itself.
- `checkedAt` is the day that exact source was opened. Do not use a batch date,
  commit date or review date, and do not refresh it unless the source was opened
  again.
- Another editor must be able to understand what was used without credentials
  or private material. A publicly intended URL may be retained if access is
  intermittently gated; credentials, tokens and captured private content may
  not.
- A current `keep` record drops obsolete sources when the decision is reviewed;
  Git preserves the earlier record. A tombstone preserves the sources on which
  the closed decision rested and never receives a fabricated newer date.

## Notes

Use `notes` only for durable facts needed to interpret the record: identity
distinctions, source conflicts, unusual source behaviour, moves, or multiple
facilities. Do not restate the CSV, the policy, the workflow or routine source
checks. Do not place an additional source URL or copied source content in a
note; add a structured source instead. Use a source-level `note` when the fact
concerns only that source, and record-level `notes` only when it explains the
decision across sources or the entity as a whole.

## Validation

```bash
npx pnpm check:evidence
npx pnpm test:evidence-contract
```

The validator enforces the structure and CSV relationships above. Malformed
records fail; coverage is advisory. A green run proves consistency, not factual
truth or complete provenance.
