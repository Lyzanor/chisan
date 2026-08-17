# KM0 Agent Guide

Shared contract for Codex, Claude, Gemini, Antigravity, Copilot-style agents, and any other AI assistant working in this repository. Read this file first, then the target country's scoped `AGENTS.md` for its operating phase, source ceilings and local interpretation rules.

## Editorial Priority
- The CSV is the product: optimize for real producers, correct identity, location, category, contact, sales status, and usable public data.
- Decision order: factual correctness > traceability > URL stability > mechanical consistency.
- Validators enforce structure; they do not prove editorial truth.

## Project Shape
- This app is a map viewer for area CSV files: `/` asks for a country; `/[country]` asks for one of its areas; `/?area=[area]` lists producers; `/p/[slug]?area=[area]` renders one producer row.
- Runtime flow stays simple: `data/csv/** -> map/list -> row detail`.
- Core runtime files: `app/page.tsx`, `app/[country]/page.tsx`, `app/p/[slug]/page.tsx`, `lib/csv-catalog.ts`, `lib/catalog-navigation.ts`, `components/map/`.
- Out of scope: database/ORM/migrations/seeds, producer-search API layers, complex service abstractions, hidden producer sources outside `data/csv/**`, and one-off area generators as source of truth.

## Sources Of Truth
- `data/csv/[country]/[region]/[area].csv`: current producer state, read by the app at request time. The tree is the registry: a folder is a country, a folder inside it a region, a CSV an area. Adding any of them is a data change, never a code change.
- `data/csv/[country]/country.json`: display labels, level names, ordering and slug aliases for that country. Optional — without it, folder names are title-cased and the order is alphabetical.
- `data/csv/[country]/AGENTS.md`: minimal country guide for operating phase, country-wide source ceilings and local interpretation rules. It guides work but never overrides the CSV or the global contracts.
- `data/evidence/[country]/[region]/[area].jsonl`: decision provenance only; never overrides the CSV and is not read by the app.
- Candidate notes and Git history: narrative context and work planning, not producer truth.

## Country-specific material
- `country.json` owns level names, display labels, ordering and aliases. Reference files own centroid coverage and geographic disambiguation. Do not duplicate either in prose.
- Every country folder has a short `AGENTS.md` with exactly three concerns: `Operating state`, `Country rules` and `Source ceilings`. `Operating state` records a coarse phase and active work lanes; exact current queues come from `npx pnpm check:defects --country <iso>`, the CSV, evidence and candidate notes. `Country rules` records only durable local geography, identity or naming traps. `Source ceilings` records what material country-wide sources can and cannot prove.
- Keep the guide small. Never copy counts, area lists, aliases, category lists, per-area progress or general workflow into it. Update the phase or active lane when the country's work changes; remove a source note once it no longer affects current decisions.
- Active discovery and per-area progress belong in `docs/candidates/[country]/[area].md`; decisions belong in `data/evidence/**`. A `docs/candidates/[country]/README.md`, when useful, is a stable guide to reusable discovery methods only: it never indexes areas or summarizes batches, counts, cutoffs or current queues. The country guide may point to those lanes but does not reproduce them.
- Never carry a source or interpretation rule across countries merely because it worked in one. Opening a country requires its folder, `country.json`, `AGENTS.md` and centroid support, not a code change.

## Canonical Docs
- `docs/CSV_CONTRACT.md`: published-row schema, field and empty-value semantics, controlled values, cross-field invariants and validation model.
- `docs/EVIDENCE_CONTRACT.md`: JSONL evidence shape, claims, source types and decision records.
- `docs/EDITORIAL_POLICY.md`: decision model for eligibility, verification, exclusions and online sales.
- `docs/candidates/README.md`: stable guide to the temporary discovery workspace, candidate minimums, incidental findings, document responsibilities and resolution lifecycle.
- `docs/GEOLOCATION.md`: producer coordinate workflow — productive-unit sourcing, geocoding, precision, review and future tooling.
- `docs/IMAGES.md`: producer image workflow — format, sourcing, naming, enrichment tooling, junk signatures.

## Hard Invariants
- Every area CSV in every country shares one header — the canonical one in `docs/CSV_CONTRACT.md` — with LF line endings. The header may grow when the catalog needs it; what is forbidden is growing it partially. Widening it means updating the contract, the validator and every CSV under `data/csv/**` in one dedicated commit.
- Every area CSV basename is globally unique: `area` is the only area key in public URLs, and `check:csv` rejects collisions across countries or regions.
- Keep URL params stable: `area`, `category`, `highlight`. A country route is the first folder under `data/csv`, so the folder name and the public URL move together.
- Producer identity is `slug` within an area; row order must not affect detail URLs. Keep a correct slug stable; fix a materially wrong one following `docs/CSV_CONTRACT.md` § Producer identity (update CSV, images, docs/evidence, and leave a `merge` record when the old slug existed in Git).
- Detail URLs use `/p/[slug]` and always carry `area`, because slugs are unique within an area and not globally.
- `categoria` is the required primary category. `categorias adicionales` is optional, uses exact registry tokens joined with `|`, and only records other material outputs made by the same productive unit. Filters match both fields; never duplicate a producer row by category or infer categories mechanically from `productos estrella`.
- `verificacion` is required and must be `pendiente`, `parcial`, or `verificado`.
- `Venta online` is required and must be `sí`, `no`, or `no comprobado`; use `no comprobado` until reviewed. `Canal de venta` is optional, meaningful only when `Venta online=sí`, and follows `docs/CSV_CONTRACT.md`.
- `lat`/`lon` more than 100 km from the `municipio` centroid is blocking; 15-100 km is a warning. Both centroid files are keyed by country first, so a `municipio` is only ever matched inside its own country and a name shared with another one cannot collide. For homonyms inside a country, fix `data/reference/municipality-overrides.json`, not correct producer coordinates — its second level is region slugs, which are unique inside a country.
- A `municipio` with no centroid has no geographic gate at all: the audit skips the row and counts it instead of failing. It also counts coordinates copied from municipality centroids as coarse fallbacks. Read both counts before treating a green run as geographically checked or precisely located.
- Follow `docs/GEOLOCATION.md` when finding coordinates: identify the productive unit before geocoding, inspect candidates, and keep an honest empty or centroid fallback when no exact point is supportable.
- Evidence is optional to the runtime and non-blocking as catalog coverage, but it is the normal closure artifact for reviewed adds, re-verifications, resolved online sales, rejections, purges, and merges. Do not prune the only source trail for one of those decisions without leaving durable provenance.
- Producer images live under `public/productores/[country]/[region]/[area]/`; follow `docs/IMAGES.md` — inspect candidates first and apply `enrich:images` to one slug with the approved candidate digest.

## Commands
- Data/reference/evidence/image-only change: `npx pnpm verify:data`.
- Code, scripts, validators, policy, or behavior change: `npx pnpm verify:ai`.
- While iterating on CSVs: `npx pnpm check:csv:changed`; add `npx pnpm check:evidence:changed` to catch missing provenance signals.
- Full CSV contract and integrity warnings: `npx pnpm check:csv`. Its summary always reports rows without coordinates, centroid coverage, skipped municipality lookups and centroid fallbacks.
- Editorial defects (advisory worklist, never blocking): `npx pnpm check:defects`, scoped with `--country <iso>` or `--area <name>`. Its output is the current worklist; resolve it under the shared workflow instead of copying it into a plan.
- Producer roster/de-dup for one area: `npx pnpm list:producers [area]` with `--categoria "X"` or `--pendientes` when useful.
- Valid categories live in `data/reference/categories.json`. The registry is shared by every country; a new country maps its products onto it instead of extending it.
- Images: `npx pnpm check:images`; evidence: `npx pnpm check:evidence`.
- Dead, parked or hijacked `web` domains: `npx pnpm check:links --offline` reads the dated snapshot in `data/reference/web-status.json` without touching the network — check it before opening domains by hand. Refresh with `npx pnpm check:links --area <name>` or `npx pnpm check:links --all`. Refreshes prune URLs no longer present in the catalog. The command classifies and never decides: a 403 is not a dead site and a 200 is not proof the site belongs to the producer.
- Municipality centroids: `node scripts/build-municipality-centroids.js` regenerates `data/reference/municipalities.json` from Wikidata. It carries one catalog per country; a country missing from it has no geographic gate.

## Data Workflow
1. Run `git status --short` before changing data and identify active area CSVs, evidence files, image folders and candidate notes.
2. Treat a dirty worktree as normal multi-agent context. Preserve unrelated work; do not overwrite another agent's active area unless the user explicitly asks for a merge.
3. Work by area when possible: CSV, matching evidence JSONL, candidate note and image folder move together.
4. Define a coherent batch by municipality, category, source, or risk, and note its candidate cutoff in the working context. Candidates appended after that cutoff belong to the next batch and do not block closing or pushing the current one. Preserve a strong incidental lead found outside the current category or area: after a minimal de-duplication check, add it to the candidate note for its actual area as an incidental find for a later batch; do not expand the active batch to resolve it. Start with the most direct source and resolve only identity, qualifying activity, municipality, and any dynamic claim in scope; expand research for contradictions or destructive decisions, and stop when the evidence is sufficient.
5. Match entities with name plus municipality and, when available, brand, address, domain, phone, or email. De-duplicate before adding with `list:producers` and targeted `rg`; merge only the same productive unit, never merely shared ownership or address.
6. Capture incidental validated data exposed by an already-opened in-scope source when the entity match is clear and the fact is explicit. Update the relevant CSV fields and evidence in the same change, following each field's contract. Do not branch into unrelated searches merely to fill adjacent blanks; investigate a contradiction when it affects correctness.
7. Edit surgically: locate rows with `rg`, read small windows, use a CSV-aware approach for structured changes, and replace one JSONL line rather than reformatting ledgers.
8. Keep active candidate discovery in `docs/candidates/[country]/[area].md`: source sweeps, batch scope, unresolved leads and remaining search work belong there.
9. When a candidate is accepted, rejected, or already present, prune its resolved entry in the same change without deleting the document's remaining discovery context. Record the durable decision in `data/evidence/**`; a definitive never-published exclusion is `reject`, while uncertainty stays in candidates.
10. At area close, reconcile CSV, evidence, images, links, online-sale channels, residual `pendiente`/`parcial` rows, duplicates, and geography; prune resolved candidates and run the matching final gate. The catalog remains open to later maintenance.

## Discovery Rules
- Do not add or call an API that can incur charges or requires billing or a payment method, including free-tier services that can bill after quota. Use only no-cost public endpoints, static/open datasets, or manual browser research.
- Start from authoritative registries and official or clearly reliable sources; never from memory. Use the country guide and active candidate note, then establish any new source's scope before importing.
- Registries confirm what they publish, often existence or certification, but not necessarily current activity or online sales. A listing normally supports at most `parcial`.
- Not every registry is a producer list. Some catalog holdings, facilities or certifications rather than sellable producers; triage and prune instead of importing by default.
- Never invent or guess producer names. A plausible category, dish, or place name is not a producer without a concrete business source.
- Dynamic claims need current evidence: especially activity, closure, and `Venta online=sí`.
- Treat currentness as claim-specific, not as a fixed age cutoff: prefer a source that shows the relevant fact still operating at review time; older material may support identity or history but not a dynamic claim on its own.
- A source supports only the claims it actually publishes. A registry can establish identity or location without proving current activity or sales.
- Retain an official web or social link when the producer cross-links it or when sufficiently distinctive identity details agree, such as domain, address, phone, email or productive location. A shared name alone is not enough, especially for homonyms.
- A failed fetch is not a dead site. Confirm HTTP-only, TLS, DNS, blocking, or timeout failures by another route before deleting or downgrading a URL.
- Do not trust speculative candidate lists; verify each item and prune resolved notes.

## Token And Context Discipline
- Simplification is the default: prefer deleting or tightening docs over adding. Before writing a doc note, check whether a better error message or tool fix makes it unnecessary; keep derived state (status tables, registries) out of docs.
- Start reviews with `git diff --name-status` and `git diff --stat`; open full diffs only for files you will judge or edit.
- Do not read whole large CSVs or JSONL ledgers for one row. Use `rg`, `list:producers` filters, and small line windows.
- Do not dump full successful gate logs, rosters, or audit output into the conversation; summarize the command and result unless a failure needs details.
- Consult the canonical docs on demand instead of loading all of them for every task.
- Use temporary scripts for mechanical one-off transformations when needed, but do not add them as permanent tooling unless they are broadly reusable and documented.

## Multi-Agent And Git
- `AGENTS.md` is the shared contract. A country guide narrows operating context, source ceilings and local interpretation; it may not override this contract or create a separate workflow.
- Work directly on `main`. Agents must not create, switch to or push agent-owned branches unless the user explicitly requests a branch or pull request. In a dirty multi-agent worktree, keep unrelated work unstaged and commit and push only the current task's scope to `main`.
- Review another agent's changes as intentional work first. If a change appears to violate a rule but improves factual correctness, preserve it, validate it, and document the reason rather than reverting by default.
- Commit CSV/data-contract changes together when they depend on each other. Keep unrelated area work out of your stage.
- A branch is not live work until you check `git diff main...<branch> -- data/csv`: several are already merged or behind. Delete a branch that is behind instead of merging it.
- Keep `main` deployable. Before committing, run the matching gate above.
- `.github/workflows/verify.yml` runs `verify:ai` on every push to `main` and every pull request. It reports after the fact and does not hold back the Vercel deploy, so the local gate before committing is still the real one.
- Deploy to production by pushing to `main`; GitHub -> Vercel builds production automatically. Do not run an extra deploy or poll all deployments by default.
