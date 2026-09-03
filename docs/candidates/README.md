# Candidate Workspace

`docs/candidates/**` is temporary discovery workspace. The app never reads it.
Published producers live in `data/csv/**`; closed decisions and tombstones live
in `data/evidence/**`.

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
