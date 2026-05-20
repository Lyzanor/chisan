# KM0 Agent Guide

## Project in 2 lines
- This app is a map viewer for province CSV files, with `data/csv/catalunya/barcelona.csv` as the default catalog.
- Users browse producers on `/` and open one row in `/p/[id]-[slug]`.

## Scope (what this project does)
- Reads the CSV from disk at request time.
- Filters by province and category.
- Renders one producer row as a field/value table.

## Out of scope (do not reintroduce)
- No database, ORM, migrations, or seed process.
- No API layer for producer search.
- No complex service abstractions.

## Core files
- `app/page.tsx`: map and producer viewer.
- `app/p/[id]/page.tsx`: producer detail page with canonical URL `/p/[id]-[slug]`.
- `lib/csv-catalog.ts`: CSV read, normalization, filters, map points.
- `components/map/`: Leaflet map (SSR-safe, dynamic import).
- `data/csv/catalunya/barcelona.csv`: default and most complete source of truth.
- `data/csv/[comunidad]/[provincia].csv`: source of truth for the rest of the catalogs.
- `public/productores/barcelona/`: Barcelona producer images.

## Invariants
- Keep flow simple: `CSV -> map/list -> row detail`.
- Keep URL filter params stable:
  - `provincia`
  - `categoria`
  - `destacar`
- Keep the route `id` 1-based (id `1` = first CSV row after header).
- Canonical producer URL format: `/p/[id]-[slug]`.

## Safe change policy
- Prefer editing existing files over adding new layers.
- Add dependencies only if strictly necessary.
- Keep functions small and explicit.
- Avoid adding generic frameworks for a single use case.

## Markdown-first communication
- Write docs, change notes, and implementation plans in Markdown.
- Prefer short sections, flat bullet lists, and fenced code blocks for commands.
- When proposing changes, include file paths and concrete steps in Markdown.

## Validation before finishing
```bash
npx pnpm verify:ai
```

## Docs index
- `docs/ARCHITECTURE.md`
- `docs/CSV_CONTRACT.md`
- `docs/TASKS.md`
