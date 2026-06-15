# Common Tasks

## 1) Update data (manual CSV edit)
1. Edit the target province CSV under `data/csv/[comunidad]/[provincia].csv`.
2. Add new producers with a stable unique `slug`.
3. Place rows according to the current editorial ordering, or append when no ordering pass is part of the task.
4. Set `verificacion`:
   - `pendiente`: added for coverage and still needs review.
   - `parcial`: real and localized, but some data is inferred or not fully checked.
   - `verificado`: cross-checked against a primary or clearly reliable source; requires coordinates and at least one external link.
5. Set `Venta online`:
   - `sí`: confirmed online sales through the producer site or a concrete known channel.
   - `no`: checked and no online sales channel found.
   - `no comprobado`: default until reviewed.
6. Add or update the matching record in `data/evidence/[comunidad]/[provincia].jsonl` for a new producer, re-verification, resolved online-sale decision, purge, or merge.
7. Run:
```bash
npx pnpm verify:data
```
8. No build or manual route check is required for a data/evidence/image-only change.

## 1b) Weekly CSV review
1. Run the blocking contract audit:
```bash
npx pnpm check:csv
```
2. Run the data-quality audit across every CSV:
```bash
npx pnpm check:csv:data-quality
```
3. Fix `error` items first in the target province CSV.
4. Fix `warning` items next:
   - empty key fields
   - duplicates
   - inconsistent categories
   - category labels that should use preferred labels such as `Lácteos y quesos`, `Bodega`, or `Pan y pastelería`
   - invalid `Venta online` values; use `no comprobado` until the online sales channel is checked
   - weak map/address data
   - geography: `lat`/`lon` flagged as far from the `municipio` centroid — cross-check with Google Maps and either correct the coordinates or update `municipio` if the producer is actually in a neighbouring town. Distance and centroid label are printed in the warning.
5. Re-run the two CSV audits until contract errors are `0`.
6. Run:
```bash
npx pnpm verify:data
```

## 2) Change catalog behavior
1. Edit catalog logic in `lib/csv-catalog.ts` or `app/page.tsx`.
2. Keep URL params stable: `provincia`, `categoria`, `destacar` (`slug` del productor).
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
1. Update the canonical header and contract in `docs/CSV_CONTRACT.md`.
2. Apply the structural change to all 50 province CSVs in one dedicated commit; never add a column to one province only.
3. No extra code is needed for the detail table: it renders all fields.
4. If the column should appear in list summary, update `app/page.tsx`.
5. Run `npx pnpm verify:ai` because a structural change normally affects validators or application behavior.

## 5) Release checklist
1. Run `npx pnpm verify:data` for data/reference/evidence/image-only changes, or `npx pnpm verify:ai` when code or scripts changed.
2. Review changed files with `git status --short` and `git diff --stat`.
3. Commit with a clear message.
4. Push the commit to `main`; GitHub→Vercel deploys production automatically.
5. Use `vercel deploy . --prod -y` only as a manual fallback.

## 6) Agent handoff checklist
1. Read `AGENTS.md` before changing code or data.
2. Treat `data/csv/**` as the source of truth.
3. Treat `data/evidence/**` as decision provenance, not a second producer catalog.
4. Keep candidate notes in `docs/candidates/[provincia].md`; move legacy `docs/*_candidates.md` files there before editing unless another agent owns that province.
5. Do not restore deleted one-off scripts, generator scripts, database layers, or API search layers.
6. Keep producer `slug` values stable and unique.
7. Run the matching gate:
```bash
npx pnpm verify:data   # data/reference/evidence/images
npx pnpm verify:ai     # code/scripts/policy
```
8. If shipping, commit and push to `main`; do not run a second deploy by default.

## Guardrails
- Do not add DB/API/migrations unless explicitly requested.
- Prefer small, reversible edits.
- CSV row order is editorial: keep it easy to sort by the criterion that matters for the task.
- Keep `slug` stable and unique; it is the public producer identity.
- Keep `AGENTS.md`, `README.md`, and this file aligned when changing workflow.
- Keep docs in sync if behavior changes.
- Keep change proposals and task notes in Markdown.
