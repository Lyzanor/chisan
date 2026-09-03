# Scheduled Task Contract

Use this reference for unattended recurring discovery. Canonical repository
documents own editorial policy; the skill owns the execution loop; the
scheduler owns cadence, model, project and environment.

## Operating requirements

- Run against the canonical Chisan project and one area per task.
- Prefer an isolated worktree and a committed baseline containing current CSV,
  note and tombstones.
- Stop when the target CSV or evidence ledger has uncommitted changes.
- Stop on an uncommitted candidate-note change unless the task explicitly
  permits continuation and the diff is demonstrably append-only, well-formed
  output from earlier runs of the same automation. Preserve all such content.
- Use only the public source access needed for the declared pass.
- Default to one weekly run and at most 10 retained leads. Change the batch size
  only by explicit configuration and review the first four runs.
- Never commit, push, deploy, open a pull request or publish catalog changes
  without separate authorization.

Each run derives its source history and open queue from repository state, not
chat memory. Retained leads remain **plausible leads; admission not assessed**.

## Prompt template

Replace bracketed values before scheduling:

```text
Use $chisan-area-discovery for one bounded Level 1 pass in country [COUNTRY]
and area [AREA]. Operate in queue mode with one current no-cost public source
family not already covered by the area note. Retain at most [MAX_CANDIDATES]
new leads.

Apply the repository's canonical editorial and candidate-note documents
directly. This task discovers plausible leads and does not assess admission.

Modify only docs/candidates/[COUNTRY]/[AREA].md and run npx pnpm verify:data
when it changes. Do not commit, push, deploy or open a pull request.

Report the source, cutoff, leads examined and retained, duplicate and tombstone
counts, routed and discarded leads, limitations, changed file, validation and
current open-candidate count. Label retained results "plausible lead; admission
not assessed".
```

Add the exact baseline-continuation rule to the task prompt when repeated runs
share one working directory. A fixed source gives reproducible coverage; an
agent-selected source gives breadth but needs closer early review.

## Run outcomes

Treat these as normal outcomes:

- **Leads retained:** one append-only dated pass is added to the note.
- **Zero yield:** the bounded source was inspected and no lead was retained.
- **Baseline conflict:** the target state is unsafe to modify.
- **Source unavailable:** the source and one reasonable alternative could not
  be inspected.

A malformed target, unauthorized write, validation failure or scope expansion
is a failed run.

## Early review

Review the first four runs before increasing limits or concurrency. Compare:

- leads retained per source;
- published and open-note duplicate rates;
- routed and tombstone-match rates;
- later Level 2 acceptance rate, when available;
- repeated source-interpretation errors;
- tool failures, latency and usage when exposed by the runtime.

These are operational signals, not area maturity levels or producer-density
targets. Change the skill only when repeated evidence reveals a stable
execution problem.
