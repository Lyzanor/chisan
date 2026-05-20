# Common Tasks

## 1) Update data (manual CSV edit)
1. Edit the target province CSV, usually `data/csv/catalunya/barcelona.csv`.
2. Run:
```bash
npx pnpm verify:ai
```
3. Check `/` and `/p/[id]-[slug]` manually.

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
- duplicates
- inconsistent categories
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
2. Review changed files.
3. Commit with clear message.
4. Push to GitHub.
5. Deploy to Vercel.

## Guardrails
- Do not add DB/API/migrations unless explicitly requested.
- Prefer small, reversible edits.
- Keep docs in sync if behavior changes.
- Keep change proposals and task notes in Markdown.
