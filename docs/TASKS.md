# Common Tasks

## 1) Update data (manual CSV edit)
1. Edit the target province CSV, usually `data/csv/catalunya/barcelona.csv`.
2. Add new producers at the end of the CSV.
3. Keep existing row order unless you are intentionally accepting URL/id changes.
4. Set `verificacion` when the column exists:
   - `alta`: checked against a primary or clearly reliable source.
   - `media`: real and localized, but not fully checked.
   - `baja`: plausible but weakly checked.
   - `pendiente`: added for coverage and still needs review.
5. Update `fecha_revision` only for rows actually reviewed or corrected.
6. Run:
```bash
npx pnpm verify:ai
```
7. Check `/` and `/p/[id]-[slug]` manually.

## 1b) Weekly CSV review
1. Run the blocking contract audit:
```bash
npx pnpm check:csv
```
2. Run the data-quality audit:
```bash
npx pnpm check:csv:data-quality
```
3. Fix `error` items first in the target province CSV.
4. Fix `warning` items next:
   - empty key fields
   - stale `fecha_revision`
   - missing, empty, or invalid `verificacion`
   - `verificacion=alta` without a real review date
   - duplicates
   - inconsistent categories
   - category labels that should use preferred labels such as `Lácteos y quesos`, `Bodega`, or `Pan y pastelería`
   - weak map/address data
5. Re-run the two CSV audits until contract errors are `0`.
6. Run:
```bash
npx pnpm verify:ai
```
7. Validate `/` and a sample of `/p/[id]-[slug]`.
8. Update `fecha_revision` only for rows actually reviewed or corrected.

## 2) Change catalog behavior
1. Edit catalog logic in `lib/csv-catalog.ts` or `app/page.tsx`.
2. Keep URL params stable: `provincia`, `categoria`, `destacar`.
3. Run:
```bash
npx pnpm verify:ai
```
4. Validate:
- Province selector switches CSV.
- Category chips filter list and map.
- Detail links preserve the selected province.

## 3) Change UI only
1. Edit `app/page.tsx` and/or `app/globals.css`.
2. Do not move data logic out of `lib/csv-catalog.ts`.
3. Run:
```bash
npx pnpm verify:ai
```

## 4) Add a CSV column to detail view
1. Ensure column exists in CSV header.
2. No extra code is needed for detail table: it renders all fields.
3. If the column should appear in list summary, update `app/page.tsx`.

## 5) Release checklist
1. `npx pnpm verify:ai`
2. Review changed files with `git status --short` and `git diff --stat`.
3. Commit with a clear message.
4. Push to GitHub before deploying.
5. Deploy to Vercel production:
```bash
vercel deploy . --prod -y
```

## 6) Agent handoff checklist
1. Read `AGENTS.md` before changing code or data.
2. Treat `data/csv/**` as the source of truth.
3. Do not restore deleted one-off scripts, generator scripts, database layers, or API search layers.
4. Keep new producer rows append-first.
5. Run:
```bash
npx pnpm verify:ai
```
6. If shipping, commit, push, then deploy.

## Guardrails
- Do not add DB/API/migrations unless explicitly requested.
- Prefer small, reversible edits.
- Treat published province CSVs as append-first files: add new rows at the end and avoid reordering.
- Keep `slug` stable; it is the safest future identity if row-based URLs ever need migration.
- Keep `AGENTS.md`, `README.md`, and this file aligned when changing workflow.
- Keep docs in sync if behavior changes.
- Keep change proposals and task notes in Markdown.
