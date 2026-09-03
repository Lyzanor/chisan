---
name: chisan-area-discovery
description: Run a finite, area-scoped Level 1 pass that queues plausible Chisan producer leads for later editorial review. Use for manual or scheduled discovery, not admission or catalog publication.
---

# Chisan Area Discovery

Run one finite Level 1 pass for one catalog area and leave a reviewable handoff.
Every retained result is a **plausible lead; admission not assessed**.

## Canonical authority

Read and apply these files directly; this skill does not duplicate their rules:

- `docs/EDITORIAL.md` for eligibility, source interpretation and Levels 1–3;
- `docs/candidates/README.md` for note format and lifecycle;
- `data/csv/<country>/AGENTS.md` for country rules and source ceilings.

They override this skill. Level 2 resolution or materialization needs separate
authorization.

## Operational contract

1. Require `country` and the public `area` key. Resolve exactly one area CSV and
   run the helper from the repository root:

   ```bash
   node .agents/skills/chisan-area-discovery/scripts/inspect-area.mjs \
     --country <country> --area <area>
   ```

2. Use one source family or bounded query set and, unless configured otherwise,
   retain at most 10 new leads. This batch size makes a pass finite; the number
   of already-open candidates never blocks new discovery. Read
   [references/source-strategy.md](references/source-strategy.md) when selecting
   or querying the source.
3. Reconcile every examined entry against the target CSV and note, plausible
   country-wide aliases and relevant tombstones. Account for each entry once as
   retained, duplicate, tombstone match, routed or discarded.
4. `queue` mode may create or update only
   `docs/candidates/<country>/<area>.md`. `report` mode makes no repository
   changes. Preserve unrelated work and do not commit, push, deploy or schedule
   more work without separate authorization.
5. A scheduled single-area run reports cross-area leads without modifying the
   other note. An interactive user may authorize separate area passes.

## Validation and handoff

When a note changes, review its diff and run `npx pnpm verify:data`. Report the
source, cutoff, result-bucket accounting, retained leads and blockers, changed
file, validation outcome and current open-candidate count. Record any unexamined
remainder or resume cursor in the dated note section.

For unattended recurrence, read
[references/scheduled-task.md](references/scheduled-task.md).
