# KM0 Agent Guide

Shared contract for Codex, Claude, Gemini, Antigravity, Copilot-style agents, and any other AI assistant working in this repository. Read this file first; open the linked docs only for the part of the project you are touching.

## Editorial Priority
- The CSV is the product: optimize for real producers, correct identity, location, category, contact, sales status, and usable public data.
- Decision order: factual correctness > traceability > URL stability > mechanical consistency.
- Validators enforce structure; they do not prove editorial truth.

## Project Shape
- This app is a map viewer for province CSV files: `/` asks for a province; `/?provincia=[provincia]` lists producers; `/p/[slug]?provincia=[provincia]` renders one producer row.
- Runtime flow stays simple: `data/csv/** -> map/list -> row detail`.
- Core runtime files: `app/page.tsx`, `app/p/[slug]/page.tsx`, `lib/csv-catalog.ts`, `lib/catalog-navigation.ts`, `components/map/`.
- Out of scope: database/ORM/migrations/seeds, producer-search API layers, complex service abstractions, hidden producer sources outside `data/csv/**`, and one-off province generators as source of truth.

## Sources Of Truth
- `data/csv/[comunidad]/[provincia].csv`: current producer state, read by the app at request time.
- `data/evidence/[comunidad]/[provincia].jsonl`: decision provenance only; never overrides the CSV and is not read by the app.
- `data/evals/**`: policy regression fixtures.
- Provincial ledgers, candidate notes, and Git history: narrative context and work planning, not producer truth.

## Canonical Docs
- `docs/CSV_CONTRACT.md`: CSV header, columns, allowed values, blocking/warning rules, image path contract, reference centroid data.
- `docs/EVIDENCE_CONTRACT.md`: JSONL evidence shape, claims, source types, purge/merge records.
- `docs/EDITORIAL_POLICY.md`: decision model for `verificado`/`parcial`/purge/online sales.
- `docs/VERIFICATION_TECHNIQUES.md`: efficient investigation workflow, sufficient evidence, deduplication, location, context discipline.
- `docs/IMAGES.md`: producer image workflow — format, sourcing, naming, enrichment tooling, junk signatures.
- `docs/TASKS.md`: task recipes, release checklist, handoff checklist.
- `docs/PROVINCE_COMPLETENESS.md`: planning targets; provinces are not benchmarks for one another.
- `docs/ARCHITECTURE.md`: app flow and runtime design rules.

## Hard Invariants
- Every province CSV has the canonical 20-column header and LF line endings. Never add, remove, or reorder columns in one province only; structural changes apply to all 50 CSVs in one dedicated commit.
- Keep URL params stable: `provincia`, `categoria`, `destacar`.
- Producer identity is `slug` within a province; row order must not affect detail URLs. Keep a correct slug stable; fix a materially wrong one following `docs/CSV_CONTRACT.md` § Producer identity (update CSV, images, docs/evidence, and leave a `merge` record when the old slug existed in Git).
- Detail URLs use `/p/[slug]` and must include `provincia`, including Barcelona.
- `verificacion` is required and must be `pendiente`, `parcial`, or `verificado`.
- `Venta online` is required and must be `sí`, `no`, or `no comprobado`; use `no comprobado` until reviewed.
- `Canal de venta` is optional, meaningful only when `Venta online=sí`, and follows `docs/CSV_CONTRACT.md`.
- `lat`/`lon` more than 100 km from the `municipio` centroid is blocking; 15-100 km is a warning. For territorial homonyms, fix `data/reference/municipios-overrides.json`, not correct producer coordinates.
- Evidence is optional and advisory, but preferred at decision time for adds, re-verifications, resolved online sales, purges, and merges.
- Producer images live under `public/productores/[comunidad]/[provincia]/`; follow `docs/IMAGES.md` — inspect candidates first and apply `enrich:images` per slug.

## Commands
- Data/reference/evidence/image-only change: `npx pnpm verify:data`.
- Code, scripts, validators, policy, or behavior change: `npx pnpm verify:ai`.
- While iterating on CSVs: `npx pnpm check:csv:changed`; add `npx pnpm check:evidence:changed` to catch missing provenance signals.
- Full CSV contract: `npx pnpm check:csv`; data-quality warnings: `npx pnpm check:csv:data-quality`; completeness planning: `npx pnpm check:csv:completeness`.
- Cross-province editorial defects (advisory worklist, never blocking): `npx pnpm check:defects`. Answers "what is left to fix and where" for the shared backlog in `docs/TASKS.md` § 7.
- Province roster/de-dup: `npx pnpm list:province [provincia]` with `--categoria "X"` or `--pendientes` when useful.
- Valid categories: `npx pnpm list:categories`.
- Images: `npx pnpm check:images`; evidence: `npx pnpm check:evidence`.
- Dead, parked or hijacked `web` domains: `npx pnpm check:links -- --offline` reads the dated snapshot in `data/reference/web-status.json` without touching the network — check it before opening domains by hand. Refresh with `--provincia <name>` or `--all`. It classifies (NXDOMAIN, no NS, refused, timeout, TLS, redirect, parking, provider placeholder, 403, 200) and never decides: a 403 is not a dead site and a 200 is not proof the site belongs to the producer.

## Data Workflow
1. Run `git status --short` before changing data and identify active province CSVs, evidence files, image folders, candidate notes, and ledgers.
2. Treat a dirty worktree as normal multi-agent context. Preserve unrelated work; do not overwrite another agent's active province unless the user explicitly asks for a merge.
3. Work by province when possible: CSV, matching evidence JSONL, candidate note, ledger, and image folder move together.
4. De-duplicate before adding with `list:province` and targeted `rg`; verify every accepted producer through reliable public sources.
5. Edit surgically: locate rows with `rg`, read small windows, use a CSV-aware approach for structured changes, and replace one JSONL line rather than reformatting ledgers.
6. Keep candidate research in `docs/candidates/[provincia].md`. Move legacy root candidate notes there before editing unless another agent owns that province.
7. When a candidate is accepted, rejected, or already present, update/prune the candidate note in the same change.
8. Validate touched files while iterating, then run the matching final gate before finishing.

## Discovery Rules
- Start from authoritative registries and official or clearly reliable sources; never from memory.
- Registries confirm what they publish, often existence or certification, but not necessarily current activity or online sales. A listing normally supports at most `parcial`.
- Some registries are not producer lists. Livestock-holding registries such as REGA list explotaciones, not sellable producers; triage and prune instead of keeping them by default.
- Never invent or guess producer names. A plausible category, dish, or place name is not a producer without a concrete business source.
- Dynamic claims need current evidence: especially activity, closure, and `Venta online=sí`.
- A failed fetch is not a dead site. Confirm HTTP-only, TLS, DNS, blocking, or timeout failures by another route before deleting or downgrading a URL.
- Do not trust speculative candidate lists; verify each item and prune resolved notes.

## Token And Context Discipline
- Simplification is the default: prefer deleting or tightening docs over adding. Before writing a doc note, check whether a better error message or tool fix makes it unnecessary; keep derived state (status tables, registries) out of docs.
- Start reviews with `git diff --name-status` and `git diff --stat`; open full diffs only for files you will judge or edit.
- Do not read whole large CSVs or JSONL ledgers for one row. Use `rg`, `list:province` filters, and small line windows.
- Do not dump full successful gate logs, rosters, or audit output into the conversation; summarize the command and result unless a failure needs details.
- Consult the canonical docs on demand instead of loading all of them for every task.
- Use temporary scripts for mechanical one-off transformations when needed, but do not add them as permanent tooling unless they are broadly reusable and documented.

## Multi-Agent And Git
- `AGENTS.md` is the shared contract. Agent-specific files may summarize it, but must not override it or create a separate workflow.
- Review another agent's changes as intentional work first. If a change appears to violate a rule but improves factual correctness, preserve it, validate it, and document the reason rather than reverting by default.
- Commit CSV/data-contract changes together when they depend on each other. Keep unrelated province work out of your stage.
- Keep `main` deployable. Before committing, run the matching gate above.
- Deploy to production by pushing to `main`; GitHub -> Vercel builds production automatically. Do not run an extra deploy or poll all deployments by default.
