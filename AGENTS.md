# Chisan Agent Guide

This is the shared operating map for every AI agent working in Chisan. The
`README.md` is the human landing page; this file explains how the system fits
together, which source owns each fact, and how to route work safely.

Read this first. For producer-data work, also read the target country's
`data/csv/<country>/AGENTS.md` and the canonical document that owns the task.
Scoped guides may narrow local interpretation but never override this file or a
canonical contract.

## How Chisan works

```text
candidate note ──> editorial review ──> area CSV ──> map / list / producer page
                              └───────> evidence ledger

Clerk session ──> PostgreSQL account workflow ──> approved change request
                                                   └─> local review ─> area CSV
```

- The public app reads `data/csv/**` directly. The folder tree defines its
  countries, regions, areas, and producer pages.
- Candidate notes are temporary research. Evidence records the sources behind
  closed decisions. Neither is a runtime producer overlay.
- Clerk owns credentials and sessions. PostgreSQL owns Chisan account state,
  claims, memberships, reviewed requests, and audit; it never owns producer
  catalog state.
- Local work changes the canonical CSV and passes the relevant gate; deployment
  procedure belongs to `docs/OPERATIONS.md`.

The CSV is the product. Editorial priority is factual correctness,
traceability, URL stability, then mechanical consistency. Validators prove
structure, not truth.

Out of scope are producer-catalog API layers, hidden runtime producer sources
outside `data/csv/**`, direct CSV writes from deployed requests, database
overlays, and one-off generators that become an alternative source of truth.

## Authority map

| Layer | Owns | Never owns |
|---|---|---|
| `data/csv/<country>/<region>/<area>.csv` | Published producer state and the catalog registry | Research provenance or account state |
| `data/csv/<country>/country.json` | Country labels, level names, ordering, and aliases | Producer or editorial decisions |
| `data/csv/<country>/AGENTS.md` | Local priorities, durable country rules, and source ceilings | General workflow or live area queues |
| `data/evidence/<country>/<region>/<area>.jsonl` | Decision sources and `reject`/`purge`/`merge` tombstones | Published field values or review authorship |
| `docs/candidates/<country>/<area>.md` | Temporary unresolved discovery work | Durable producer state or decisions |
| PostgreSQL | Accounts, favorites, claims, memberships, requests, and audit | Producer catalog state |
| Git | Authorship and previous states | Current producer state |

A country guide contains exactly `Operating state`, `Country rules`, and
`Source ceilings`. Live counts, area indexes, batch progress, and general
workflow do not belong there. Rules and source interpretations do not transfer
automatically between countries.

## Cross-project invariants

- The CSV tree is the registry: adding a country, region, or area is a data
  change, not a code registration task.
- One row represents one productive unit. Its durable key is
  `(<country>, producer_id)`; its public identity is the stable `slug` at
  `/<country>/<area>/<slug>`.
- The public area key is `(<country>, <area>)`. Folder names and public paths
  move together; stable query parameters are `category` and `highlight`.
- A deployed request never writes `data/csv/**`. Ownership authorizes a
  proposal, not its facts; only reviewed local materialization changes the CSV.
- The CSV stores public decisions, evidence stores sources, and Git stores who
  reviewed the change.
- A repository-wide CSV schema change is atomic. Public slug changes, merges,
  and purges follow the owning contracts and preserve routing and account
  integrity.
- Account profile type is presentation, never authorization. Producer actions
  require exact active membership; staff actions require an active grant.

## Route the task

| Work | Read | Final gate |
|---|---|---|
| Producer eligibility, verification, online sales, or candidates | Country guide, `docs/EDITORIAL.md`, CSV and evidence contracts | `npx pnpm verify:data` |
| CSV fields, categories, identity, routing, links, or validators | `docs/CSV_CONTRACT.md` and the affected policy | `npx pnpm verify:ai` for behavior/schema; otherwise `verify:data` |
| Evidence records or actions | `docs/EVIDENCE_CONTRACT.md` | `npx pnpm verify:data` |
| Coordinates or Google Maps | `docs/GEOLOCATION.md` | `npx pnpm verify:data` |
| Producer images | `docs/IMAGES.md` | `npx pnpm verify:data` |
| Accounts, ownership, memberships, or producer changes | `docs/ACCOUNT_SYSTEM.md` | `npx pnpm verify:ai` |
| Environment, secrets, deploy, rollback, or backups | `docs/OPERATIONS.md` | Follow its preflight and smoke checks |
| Code, scripts, documentation, policy, or behavior | Owning contract | `npx pnpm verify:ai` |

While iterating on data, use `npx pnpm check:csv:changed` and
`npx pnpm check:evidence:changed`. `check:defects` is an advisory worklist, not
stored state or a publication gate. Use `npx pnpm list:producers <area>` for an
area-scoped roster and de-duplication pass.

## Standard work loop

1. Inspect `git status --short`, `git diff --name-status`, and `git diff --stat`.
   Treat a dirty worktree as shared context and preserve unrelated work.
2. Classify the task and read only its owning document. For producer work, also
   read the country guide and current area note.
3. Inspect narrowly with `rg`, small line windows, and area-scoped commands;
   avoid loading whole CSVs or JSONL ledgers for one entity.
4. Make one coherent change. For area work, reconcile the CSV, evidence,
   candidate note, and image folder as applicable. Before merging or purging a
   row, follow `docs/ACCOUNT_SYSTEM.md` § Catalog row lifecycle.
5. Review only the intended diff and run the matching gate. Keep unrelated
   files unstaged and every authorized commit or push limited to the task.

## Repository rules

- Work directly on `main`; create or switch branches only when the user asks.
- Prefer deleting or tightening documentation over adding repeated policy,
  manual indexes, or derived status. Improve a validator or error message when
  that makes prose unnecessary.
- Write maintained documentation and reusable guides in English. Prefer English
  for new area notes, but do not translate temporary historical notes as a
  standalone task. Preserve official names, source text, URLs, and controlled
  tokens in their canonical form.
- Use temporary scripts for mechanical one-off work; retain them only when they
  become broadly reusable and documented.
- Keep `main` deployable and run the local gate before any commit. CI reports
  after a push; it does not replace local validation.
