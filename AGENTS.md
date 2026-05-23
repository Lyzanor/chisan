# KM0 Agent Guide

This is the shared operating contract for Codex, Claude, Gemini, Antigravity, Copilot-style agents, and any other AI assistant working in this repository.

## Project in 2 lines
- This app is a map viewer for province CSV files, with `data/csv/catalunya/barcelona.csv` as the default catalog.
- Users browse producers on `/` and open one row in `/p/[slug]`.

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

## Core files
- `app/page.tsx`: map and producer viewer.
- `app/p/[slug]/page.tsx`: producer detail page with canonical URL `/p/[slug]`.
- `lib/csv-catalog.ts`: CSV read, normalization, filters, map points.
- `lib/catalog-navigation.ts`: province/community catalog discovery.
- `components/map/`: Leaflet map (SSR-safe, dynamic import).
- `data/csv/catalunya/barcelona.csv`: default and most complete source of truth.
- `data/csv/[comunidad]/[provincia].csv`: source of truth for the rest of the catalogs.
- `data/reference/municipios.json`: Wikidata-sourced municipality centroids used by the geo-check warning. Reference data, not producer data.
- `public/productores/barcelona/`: Barcelona producer images.

## Active scripts
- `npx pnpm verify:ai`: required before finishing changes.
- `npx pnpm check:csv`: validates the blocking CSV contract for every CSV file.
- `npx pnpm check:csv:data-quality`: warning audit for data-quality review.
- `npx pnpm check:csv:completeness`: planning signal for province expansion.
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
- Producer identity is `slug`; row order must not affect detail URLs.
- Canonical producer URL format: `/p/[slug]`.
- CSVs may be reordered by editorial criteria such as municipality, category, or data quality when useful.
- Keep `slug` stable and unique; it is the public identity for each producer.
- Prefer the category labels documented in `docs/CSV_CONTRACT.md`: especially `Lácteos y quesos`, `Bodega`, and `Pan y pastelería`.

## Safe change policy
- Prefer editing existing files over adding new layers.
- Add dependencies only if strictly necessary.
- Keep functions small and explicit.
- Avoid adding generic frameworks for a single use case.
- Delete stale one-off tooling instead of preserving paths that can revive outdated data.
- If a script is not wired from `package.json`, documented here, or broadly reusable for CSV work, do not rely on it.

## Province expansion judgment
- Treat province expansion as editorial research, not a rote requirement for every task.
- When adding producers, use the provincial capital, comarca seats, and smaller food-tradition municipalities as discovery anchors; search by category, verify with web/Google Maps/social or reliable listings, and add only real producers with stable unique `slug`, normalized category, coordinates, Google Maps, and contact or web when available.

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
