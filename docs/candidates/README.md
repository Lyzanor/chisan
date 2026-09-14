# Candidate Workspace

`docs/candidates/**` is temporary discovery workspace. The app never reads it.
Published producers live in `data/csv/**`; closed decisions and tombstones live
in `data/evidence/**`.

The candidate corpus is nevertheless part of Chisan's editorial strength. It
shows what has been found, what remains unknown and which concrete question
would change the next decision. Keep that value as a small handoff, not as a
second catalog or a collection of search transcripts.

This tree hands work from discovery to admission under `docs/EDITORIAL.md`. It
is not a queue for enriching published rows and does not store ownership claims
or producer profile requests.

## Document ownership

This file defines the common note format and lifecycle. Area files contain the
active queue, sources, cutoff and unresolved work. Country `AGENTS.md` files own
durable local methods and source ceilings; CSV and evidence own published facts
and closed decisions. The file tree is the index: do not copy live counts,
completed areas or batch status into a README.

## Area notes

Use one file per area and do not copy published CSV data. New editor-authored
notes use English while preserving official names, source text, URLs and
controlled tokens; temporary historical notes do not need standalone
translation.

The note header records the target CSV, discovery source or query, search date,
scope, cutoff, and remaining work. For each open candidate retain only what the
next reviewer needs:

- published name;
- municipality or geographic clue;
- probable category and concrete reason it may qualify;
- discovery URL, plus an official site or profile when found in the same pass;
- visible material doubts.

Do not fill gaps or start full verification during discovery. An entry is open
by definition and needs no status field.

Use this table for new batches unless the source genuinely needs a smaller
shape:

```markdown
| name | municipality / geographic clue | probable category / output | reason it may qualify | discovery | official | remaining work |
|---|---|---|---|---|---|---|
| Example producer | Place clue | `Category` — output | Concrete productive signal | <https://example.com/source> | <https://example.com/> | One question whose answer would decide admission. |
```

`remaining work` is one actionable admission blocker, not a general request to
complete the profile. When an already-open source resolves one question but
reveals another, replace the blocker and retain only the useful source context.
Do not add status, confidence, assignee or progress columns.

### Finite batch footprint

A finite source pass should state its source or query, date and cutoff so
another editor can distinguish **not reviewed** from **reviewed and unresolved**.
When counts fall naturally out of the pass, its introduction may record how
many listings were read, already represented, queued, routed, closed or
explicitly deferred. Do not hand-maintain file-wide totals: derive the current
open inventory with `pnpm report:editorial-work`.

### Incidental findings

After de-duplication, route an incidental producer to its actual area without
expanding the current cutoff. If location is unresolved, retain the available
clues where it was found. `reject:other-area` applies only when a proposed area
was investigated and disproved. Explicit incidental facts from an already-open
source may be materialized, but do not branch into adjacent searches.

## Resolution and deletion

Choose the outcome through `docs/EDITORIAL.md` § Editorial decision matrix,
then serialize any durable record under `docs/EVIDENCE_CONTRACT.md` § Actions.
This file owns neither decision meanings nor evidence representation.

Retain only candidates whose canonical outcome is `hold`, with one actionable
blocker. Remove every resolved candidate after its required CSV/evidence handoff,
and delete the area note when none remain; Git preserves earlier working state.

The smallest complete handoff is:

| Outcome | What remains |
|---|---|
| `accept` | CSV row plus a `keep` whose sources collectively cover `identity`, `producer-activity`, `own-offer` and `municipality` |
| `hold` | Candidate row with the best sources already found and one actionable blocker |
| `reject` | `reject` tombstone with the sources that establish the failed criterion |
| already represented | Existing CSV row; update its `keep` only when the candidate supplied materially useful decision evidence |
| route | The same candidate handoff moved to the productive area; no tombstone unless the proposed placement was affirmatively disproved |
| `purge` or `merge` | Follow the published-row lifecycle before removing the row, then retain the required tombstone |

This table describes the handoff only. Outcome meanings remain owned by
`docs/EDITORIAL.md`, and evidence fields remain owned by
`docs/EVIDENCE_CONTRACT.md`.
