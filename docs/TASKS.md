# Common Tasks

## 1) Update data (manual CSV edit)
1. Edit `Km0-productores.csv`.
2. Run:
```bash
npx pnpm verify:ai
```
3. Check `/` and `/p/[id]` manually.

## 2) Change search behavior
1. Edit filter logic in `lib/csv-catalog.ts`.
2. Keep URL params stable: `municipio`, `categoria`.
3. Run:
```bash
npx pnpm verify:ai
```
4. Validate:
- Municipality input filters list.
- Category chips filter list.
- Both filters together work.

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
