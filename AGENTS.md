# KM0 Agent Guide

This is the shared operating contract for Codex, Claude, Gemini, Antigravity, Copilot-style agents, and any other AI assistant working in this repository.

## Project in 2 lines
- This app is a map viewer for province CSV files; `/` first asks the user to choose a province.
- Users browse producers on `/?provincia=[provincia]` and open one row in `/p/[slug]?provincia=[provincia]`.

## Scope (what this project does)
- Reads the CSV from disk at request time.
- Filters by province and category.
- Renders one producer row as a field/value table.

## Out of scope (do not reintroduce)
- No database, ORM, migrations, or seed process.
- No API layer for producer search.
- No complex service abstractions.
- No one-off province generators, restorers, or correction scripts as the source of truth.
- No hidden producer-data source outside `data/csv/**`. Structured evidence in
  `data/evidence/**` explains decisions but is never read by the app.
- No province-specific image enrichment scripts; use the shared `scripts/enrich-producer-images.py` workflow.

## Core files
- `app/page.tsx`: map and producer viewer.
- `app/p/[slug]/page.tsx`: producer detail page with canonical path `/p/[slug]` and province query.
- `lib/csv-catalog.ts`: CSV read, normalization, filters, map points.
- `lib/catalog-navigation.ts`: province/community catalog discovery.
- `components/map/`: Leaflet map (SSR-safe, dynamic import).
- `data/csv/catalunya/barcelona.csv`: Barcelona source of truth.
- `data/csv/[comunidad]/[provincia].csv`: source of truth for every province catalog.
- `data/reference/municipios.json` (+ `municipios-overrides.json`): Wikidata-sourced municipality centroids used by the geo-check. `lat`/`lon` >15 km from the `municipio` centroid is a warning; >100 km is a **blocking** error (`check:csv`). Reference data, not producer data. For cross-community homonyms (same `municipio` name in two provinces) add an override; see `docs/CSV_CONTRACT.md`.
- `data/evidence/[comunidad]/[provincia].jsonl`: structured source/date/claim provenance for editorial decisions. It mirrors CSV paths but does not replace CSV as source of truth; see `docs/EVIDENCE_CONTRACT.md`.
- `data/evals/editorial-policy-cases.json`: synthetic regression cases for stable editorial decisions; see `docs/EDITORIAL_POLICY.md`.
- `public/productores/[comunidad]/[provincia]/`: producer images, mirroring the CSV layout (Barcelona: `public/productores/catalunya/barcelona/`). Three legacy top-level folders (`caceres`, `las-palmas`, `valencia`) are pending migration.

## Active scripts
- **Which gate to run before finishing:** data/reference/evidence/image-only change → `npx pnpm verify:data` (fast: CSV + image + evidence contracts, no build); change that touches code (`app/`, `lib/`, `components/`, `scripts/`) → full `npx pnpm verify:ai`. CSVs are read at request time, so a data-only change cannot break the build — skip it.
- `npx pnpm verify:data`: cheap data gate = `check:csv` + `check:images` + `check:evidence`. No Next build. Use for province-data and provenance work.
- `npx pnpm verify:ai`: full gate (lint + build + CSV/image/evidence contracts + audit/intelligence tests + behavior). Required when you changed code, policy evaluators, or validators.
- `npx pnpm list:province [provincia]`: compact roster (slug, nombre, municipio, categoria, verificacion, Venta online) for one province; use it to de-duplicate before discovery and to browse a catalog without loading the whole CSV. Supports `--categoria "X"` and `--pendientes`.
- `npx pnpm check:csv:changed`: runs the blocking contract audit only on CSVs changed in the working tree (staged, unstaged, untracked). Use it while iterating; run `verify:data` (or `verify:ai` for code) before finishing.
- `npx pnpm check:csv`: validates the blocking CSV contract for every CSV file.
- `npx pnpm check:csv:data-quality`: warning audit for data-quality review across every CSV.
- `npx pnpm check:csv:completeness`: planning signal against fixed editorial targets; provinces are not benchmarks for one another.
- `npx pnpm check:evidence`: validates every existing evidence record against its province CSV and enforces full coverage for provinces listed in `data/evidence/coverage.json`.
- `npx pnpm check:evidence:changed`: warning-only companion that diffs changed CSVs against HEAD and flags new producers, changed `verificacion`/`Venta online`, or removed rows whose evidence ledger line was not also updated. Non-blocking; use it while iterating on a migrating (non-strict) province, where `check:evidence` cannot yet require a record to exist.
- `npx pnpm check:images`: validates that referenced producer image paths exist; reports editorial image warnings.
- `npx pnpm enrich:images --provincia [provincia]`: dry-run producer image enrichment from official websites; use `--apply` only after reviewing candidates. The scorer often ranks junk above the real brand logo (cookie-consent, accessibility, "Kit Digital" subsidy banners, Instagram-icon PNGs) and `--apply` saves the first acceptable candidate, so apply per producer (`--apply --slug <slug>`) only when its top candidate is the genuine logo; otherwise leave `imagen` blank.
- `npx pnpm test:csv-audit`: regression tests for the CSV audit rules.
- `npx pnpm test:intelligence`: validates the evidence contract fixtures and synthetic editorial policy cases.
- `npx pnpm test:behavior`: minimal route behavior test.
- `scripts/build-municipio-centroids.js`: regenerate `data/reference/municipios.json` from Wikidata (self-contained, ~30 s). Run when the lookup may be stale or a real municipio seems missing.

## Invariants
- Keep flow simple: `CSV -> map/list -> row detail`.
- Knowledge hierarchy is fixed: CSV = current producer state; evidence JSONL = decision provenance; eval cases = policy regression; provincial ledgers/Git = narrative context and history.
- Every province CSV shares the same physical structure: the canonical 20-column header (`slug,…,Venta online,Canal de venta`, see `docs/CSV_CONTRACT.md`) and **LF** line endings (enforced by `.gitattributes`). Never add, remove, or reorder columns in one province only; structural changes apply to all 50 CSVs in a solo commit.
- Keep URL filter params stable:
  - `provincia`
  - `categoria`
  - `destacar` (producer `slug`)
- Producer identity is `slug` within a province; row order must not affect detail URLs.
- Canonical producer path format: `/p/[slug]`; detail URLs must include `provincia`, including Barcelona.
- CSVs may be reordered by editorial criteria such as municipality, category, or data quality when useful.
- Keep `slug` stable and unique within its province; it is the public identity for each producer.
- Every row must include `verificacion` with one of `pendiente`, `parcial`, or `verificado`; old labels such as `alta`, `media`, and `baja` are invalid.
- Every row must include `Venta online` with one of `sí`, `no`, or `no comprobado`; use `no comprobado` by default until that producer has been reviewed.
- `Canal de venta`: the column exists in every CSV; its value is optional and complements `Venta online`. When present it lists one or more of `ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion`, `marketplace` (pipe-separated, e.g. `ecommerce|whatsapp`), and only when `Venta online` is `sí`. It is warning-only today (`check:csv:data-quality`), not blocking; backfill it incrementally. See `docs/CSV_CONTRACT.md`.
- Prefer the category labels documented in `docs/CSV_CONTRACT.md`: especially `Lácteos y quesos`, `Bodega`, and `Pan y pastelería`.
- `lat`/`lon` must be within `100 km` of the `municipio` centroid (blocking); the `15–100 km` band is a warning. If a whole municipio's producers land far from a same-named town in another province, it is a centroid homonym — add an override, do not move the producers. See `docs/CSV_CONTRACT.md`.
- For work performed after adoption of the evidence contract, add or update structured evidence when adding a producer, changing `verificacion`, resolving `Venta online`, or making a purge/merge decision. Existing provinces may migrate progressively; never remove a province from strict evidence coverage to bypass validation.

## Safe change policy
- Prefer editing existing files over adding new layers.
- Add dependencies only if strictly necessary.
- Keep functions small and explicit.
- Avoid adding generic frameworks for a single use case.
- Delete stale one-off tooling instead of preserving paths that can revive outdated data.
- If a script is not wired from `package.json`, documented here, or broadly reusable for CSV work, do not rely on it.

## Multi-agent coordination
- `AGENTS.md` is the shared contract for every agent. Agent-specific files such as `CLAUDE.md` may summarize it, but must not override it or create a separate workflow.
- Before changing data, run `git status --short` and identify which province CSVs, image folders, or candidate notes are already being edited. Do not overwrite or reformat another agent's active work.
- Treat a dirty worktree as normal multi-agent context, not as a blocker. Mention it only when it affects the current province, candidate note, image folder, shared reference file, or validation result.
- Work by province when possible. One agent owns the province CSV, matching evidence JSONL, candidate note, ledger and image folder for one expansion or cleanup pass at a time; avoid parallel edits to the same province unless the user explicitly asks for a merge.
- Keep scratch research in `docs/candidates/` using shared province files, not in agent-private folders or loose `docs/*_candidates.md` files. Candidate notes are temporary evidence, never a source of truth.
- If you find legacy candidate notes in the `docs/` root, move them to `docs/candidates/[provincia].md` before editing them, unless another agent is actively working that province; in that case leave the file untouched and mention it in the handoff.
- Before adding a candidate from notes, de-duplicate against the CSV with `npx pnpm list:province [provincia]` and verify the producer through reliable public sources.
- When a candidate is accepted, rejected, or already present, update or prune the shared note in the same change so other agents do not repeat the same research.
- When an accepted candidate is added, write its evidence record in the matching `data/evidence/[comunidad]/[provincia].jsonl`. Candidate notes remain temporary and never substitute for provenance.
- Validate only the files you touched while iterating with `npx pnpm check:csv:changed` (and `npx pnpm check:evidence:changed` to catch decisions missing provenance), then run `npx pnpm verify:data` (data-only) or `npx pnpm verify:ai` (code) before finishing.
- If you inherit a dirty worktree, preserve unrelated changes. Mention any relevant pre-existing changes in the handoff instead of silently folding them into your own work.

## Editing large CSVs (token discipline)
- Do not read a whole province CSV into context to change one row. Barcelona alone is ~3.000 rows.
- Surgical edit flow: `grep -n "<slug-or-name>" data/csv/<comunidad>/<provincia>.csv` to find the line, read only that window with an offset/limit, then edit that line.
- Evidence ledgers are also surgical: find the `slug` in the matching JSONL and replace one line. Do not pretty-print JSONL or rewrite unrelated records.
- To survey a province cheaply (de-dup, pick targets), use `npx pnpm list:province [provincia]` instead of opening the file.
- While iterating, validate with `npx pnpm check:csv:changed` (only your touched CSVs); run `verify:data` (data-only) or full `verify:ai` (code) once before finishing.
- For audit output, prefer `node scripts/audit-csv.js --mode=quality --summary-only <path>` when you only need counts. Do not loop the raw audit over every file and pipe it to `grep` — `check:csv` / `check:csv:data-quality` already aggregate all 50 files into one summary; reach for a per-file loop only when chasing one concrete row.
- All 50 CSVs share the canonical 20-column header in the same physical order (see `docs/CSV_CONTRACT.md` for the 0-based index map), so column-aware scripts can use fixed positions. If a header ever differs, treat it as a defect to fix repo-wide, not a local convention to adapt to.
- `categoria` must match the closed `VALID_CATEGORIES` set in `scripts/audit-csv.js`; do not invent new labels. If none fits, pick the closest valid one and flag it rather than failing the contract.

## Province expansion judgment
- Treat province expansion as editorial research, not a rote requirement for every task.
- When adding producers, use the provincial capital, comarca seats, and smaller food-tradition municipalities as discovery anchors; search by category, verify with web/Google Maps/social or reliable listings, and add only real producers with stable unique `slug`, normalized category, coordinates, Google Maps, `verificacion`, `Venta online`, and contact or web when available.
- Record accepted decisions using the claim/source vocabulary in `docs/EVIDENCE_CONTRACT.md`; do not leave the only evidence in chat history or a temporary candidate note.

## Discovery protocol (find producers that fit, never invent)
- **Start from authoritative registries, not from memory.** Good sources: DOP/IGP regulatory councils, regional "alimentos de calidad" / artisan-food registries, cooperative federations, Slow Food and farmers'-market directories, comarca and tourism food portals. These yield real businesses with verifiable names.
- **Registries confirm existence, not current status.** They can be stale (closed businesses, no longer selling online). Listing supports at most `verificacion=parcial`; for a dynamic claim like `Venta online=sí` confirm a live checkout on the producer's own site today, not just presence in a registry/marketplace.
- **Never invent or guess producer names.** A plausible-sounding name is not a producer. If a candidate appears only inside generic category listings ("quesos de la zona", a dish or product name like "Cocido Montañés") and you cannot find that specific business with its own web, social profile, or Google Maps entry, do not add it.
- **De-duplicate before researching.** Run `npx pnpm list:province [provincia]` (optionally `--categoria`) first and grep the candidate name; many real producers are already in the CSV under a slightly different name, so verifying them again is wasted effort.
- **Target the gaps.** Use `npx pnpm check:csv:completeness` to find weak field coverage, then inspect municipal and category coverage directly and aim discovery there instead of densifying already-covered areas.
- **A failing fetch is not a dead site.** WebFetch forces HTTPS, so http-only or bad-SSL producer sites fail there but work in a browser; confirm via web search before acting, and do not blank a `web` URL just because the fetch failed.
- **Do not trust speculative candidate lists.** Past candidate files mixed already-integrated real producers with hallucinated names (0% of one batch was integrable). Candidate notes belong in `docs/candidates/`; verify every entry by web before integrating and prune the doc once resolved.

## Markdown-first communication
- Write docs, change notes, and implementation plans in Markdown.
- Prefer short sections, flat bullet lists, and fenced code blocks for commands.
- When proposing changes, include file paths and concrete steps in Markdown.

## Git and release discipline
- Keep `main` deployable.
- Before committing, run the matching gate (not always the full one):
```bash
npx pnpm verify:data   # data/reference/evidence/image-only change (no build)
npx pnpm verify:ai     # code, scripts, validators, or policy changes
```
- Commit CSV/data-contract changes together when they depend on each other.
- Deploy to production = push the commit to `main`; the GitHub→Vercel integration builds and deploys prod automatically. No separate deploy command, no preview/staging target. (`vercel deploy . --prod -y` exists only as a manual fallback.)
- Don't poll the deploy: the `git push` output confirms it triggered. Avoid listing all deployments — it returns a large payload.

## Validation before finishing
```bash
npx pnpm verify:data   # data-only (default for province work)
npx pnpm verify:ai     # code changes
```

## Docs index
Each fact has one canonical owner; other docs link to it instead of restating it.
- `docs/ARCHITECTURE.md` — app flow and design rules (what the runtime reads and never reads).
- `docs/CSV_CONTRACT.md` — CSV structure: header, columns, allowed values, blocking rules.
- `docs/EVIDENCE_CONTRACT.md` — structured provenance: JSONL shape, claims, source types, coverage.
- `docs/EDITORIAL_POLICY.md` — the editorial decision model (verificado/parcial/purge/online sales) and its regression cases.
- `docs/VERIFICATION_TECHNIQUES.md` — how to investigate efficiently: process, per-row decision, context discipline, closing a pass.
- `docs/TASKS.md` — step-by-step recipes for common tasks.
- `docs/PROVINCE_COMPLETENESS.md` — completeness targets and what "good" looks like per province.
