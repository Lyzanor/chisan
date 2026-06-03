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
- No hidden data source outside `data/csv/**`.
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
- `public/productores/barcelona/`: Barcelona producer images.

## Active scripts
- `npx pnpm verify:ai`: required before finishing changes.
- `npx pnpm list:province [provincia]`: compact roster (slug, nombre, municipio, categoria, verificacion, Venta online) for one province; use it to de-duplicate before discovery and to browse a catalog without loading the whole CSV. Supports `--categoria "X"` and `--pendientes`.
- `npx pnpm check:csv:changed`: runs the blocking contract audit only on CSVs changed in the working tree (staged, unstaged, untracked). Use it while working; run full `verify:ai` before finishing.
- `npx pnpm check:csv`: validates the blocking CSV contract for every CSV file.
- `npx pnpm check:csv:data-quality`: warning audit for data-quality review across every CSV.
- `npx pnpm check:csv:completeness`: planning signal for province expansion.
- `npx pnpm check:images`: validates that referenced producer image paths exist; reports editorial image warnings.
- `npx pnpm enrich:images --provincia [provincia]`: dry-run producer image enrichment from official websites; use `--apply` only after reviewing candidates. The scorer often ranks junk above the real brand logo (cookie-consent, accessibility, "Kit Digital" subsidy banners, Instagram-icon PNGs) and `--apply` saves the first acceptable candidate, so apply per producer (`--apply --slug <slug>`) only when its top candidate is the genuine logo; otherwise leave `imagen` blank.
- `npx pnpm test:csv-audit`: regression tests for the CSV audit rules.
- `npx pnpm test:behavior`: minimal route behavior test.
- `scripts/fill-google-maps-place-ids.py`: optional helper only when `GOOGLE_MAPS_API_KEY` is available; it must not invent producers.
- `scripts/build-municipio-centroids.js`: regenerate `data/reference/municipios.json` from Wikidata (self-contained, ~30 s). Run when the lookup may be stale or a real municipio seems missing.

## Invariants
- Keep flow simple: `CSV -> map/list -> row detail`.
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
- `Canal de venta` is optional and complements `Venta online`: when present it lists one or more of `ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion`, `marketplace` (pipe-separated, e.g. `ecommerce|whatsapp`), and only when `Venta online` is `sí`. It is warning-only today (`check:csv:data-quality`), not blocking; backfill it incrementally. See `docs/CSV_CONTRACT.md`.
- Prefer the category labels documented in `docs/CSV_CONTRACT.md`: especially `Lácteos y quesos`, `Bodega`, and `Pan y pastelería`.
- `lat`/`lon` must be within `100 km` of the `municipio` centroid (blocking); the `15–100 km` band is a warning. If a whole municipio's producers land far from a same-named town in another province, it is a centroid homonym — add an override, do not move the producers. See `docs/CSV_CONTRACT.md`.

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
- Work by province when possible. One agent owns one province expansion or cleanup pass at a time; avoid parallel edits to the same `data/csv/[comunidad]/[provincia].csv` unless the user explicitly asks for a merge.
- Keep scratch research in `docs/candidates/` using shared province files, not in agent-private folders or loose `docs/*_candidates.md` files. Candidate notes are temporary evidence, never a source of truth.
- If you find legacy candidate notes in the `docs/` root, move them to `docs/candidates/[provincia].md` before editing them, unless another agent is actively working that province; in that case leave the file untouched and mention it in the handoff.
- Before adding a candidate from notes, de-duplicate against the CSV with `npx pnpm list:province [provincia]` and verify the producer through reliable public sources.
- When a candidate is accepted, rejected, or already present, update or prune the shared note in the same change so other agents do not repeat the same research.
- Validate only the files you touched while iterating with `npx pnpm check:csv:changed`, then run `npx pnpm verify:ai` before finishing.
- If you inherit a dirty worktree, preserve unrelated changes. Mention any relevant pre-existing changes in the handoff instead of silently folding them into your own work.

## Editing large CSVs (token discipline)
- Do not read a whole province CSV into context to change one row. Barcelona alone is ~3.000 rows.
- Surgical edit flow: `grep -n "<slug-or-name>" data/csv/<comunidad>/<provincia>.csv` to find the line, read only that window with an offset/limit, then edit that line.
- To survey a province cheaply (de-dup, pick targets), use `npx pnpm list:province [provincia]` instead of opening the file.
- While iterating, validate with `npx pnpm check:csv:changed` (only your touched CSVs); run full `verify:ai` once before finishing.
- For audit output, prefer `node scripts/audit-csv.js --mode=quality --summary-only <path>` when you only need counts.
- The physical column order in a CSV may differ from the logical order in `docs/CSV_CONTRACT.md` (e.g. `imagen`/`Venta online`/`Canal de venta` placement varies). Read the actual header before adding or moving columns; never assume positions.
- `categoria` must match the closed `VALID_CATEGORIES` set in `scripts/audit-csv.js`; do not invent new labels. If none fits, pick the closest valid one and flag it rather than failing the contract.

## Province expansion judgment
- Treat province expansion as editorial research, not a rote requirement for every task.
- When adding producers, use the provincial capital, comarca seats, and smaller food-tradition municipalities as discovery anchors; search by category, verify with web/Google Maps/social or reliable listings, and add only real producers with stable unique `slug`, normalized category, coordinates, Google Maps, `verificacion`, `Venta online`, and contact or web when available.

## Discovery protocol (find producers that fit, never invent)
- **Start from authoritative registries, not from memory.** Good sources: DOP/IGP regulatory councils, regional "alimentos de calidad" / artisan-food registries, cooperative federations, Slow Food and farmers'-market directories, comarca and tourism food portals. These yield real businesses with verifiable names.
- **Registries confirm existence, not current status.** They can be stale (closed businesses, no longer selling online). Listing supports at most `verificacion=parcial`; for a dynamic claim like `Venta online=sí` confirm a live checkout on the producer's own site today, not just presence in a registry/marketplace.
- **Never invent or guess producer names.** A plausible-sounding name is not a producer. If a candidate appears only inside generic category listings ("quesos de la zona", a dish or product name like "Cocido Montañés") and you cannot find that specific business with its own web, social profile, or Google Maps entry, do not add it.
- **De-duplicate before researching.** Run `npx pnpm list:province [provincia]` (optionally `--categoria`) first and grep the candidate name; many real producers are already in the CSV under a slightly different name, so verifying them again is wasted effort.
- **Target the gaps.** Use `npx pnpm check:csv:completeness` to find under-covered municipios and categories, and aim discovery there instead of densifying already-covered areas.
- **A failing fetch is not a dead site.** WebFetch forces HTTPS, so http-only or bad-SSL producer sites fail there but work in a browser; confirm via web search before acting, and do not blank a `web` URL just because the fetch failed.
- **Do not trust speculative candidate lists.** Past candidate files mixed already-integrated real producers with hallucinated names (0% of one batch was integrable). Candidate notes belong in `docs/candidates/`; verify every entry by web before integrating and prune the doc once resolved.

## Markdown-first communication
- Write docs, change notes, and implementation plans in Markdown.
- Prefer short sections, flat bullet lists, and fenced code blocks for commands.
- When proposing changes, include file paths and concrete steps in Markdown.

## Git and release discipline
- Keep `main` deployable.
- Before committing, run:
```bash
npx pnpm verify:ai
```
- Commit CSV/data-contract changes together when they depend on each other.
- Push committed changes before production deploys, so Git and Vercel stay aligned.
- Any deploy to Vercel is a production deploy: "Vercel" / "deploy" means production, there is no separate preview/staging target in this workflow.
- Production deploy command:
```bash
vercel deploy . --prod -y
```

## Validation before finishing
```bash
npx pnpm verify:ai
```

## Docs index
- `docs/ARCHITECTURE.md`
- `docs/CSV_CONTRACT.md`
- `docs/TASKS.md`
- `docs/PROVINCE_COMPLETENESS.md`
