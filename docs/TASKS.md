# Common Tasks

## 1) Update data (manual CSV edit)
1. Edit the target area CSV under `data/csv/[country]/[region]/[area].csv`.
2. Add new producers with a correct unique `slug`; keep existing correct slugs stable, but fix materially wrong ones with evidence.
3. Place rows according to the current editorial ordering, or append when no ordering pass is part of the task.
4. Set `verificacion` and `Venta online` following the decision model in `docs/EDITORIAL_POLICY.md` (allowed values and blocking rules in `docs/CSV_CONTRACT.md`); keep `no comprobado` until the sales channel is reviewed.
5. Add or update the matching record in `data/evidence/[country]/[region]/[area].jsonl` for a new producer, re-verification, resolved online-sale decision, purge, or merge.
6. Run:
```bash
npx pnpm verify:data
```
7. No build or manual route check is required for a data/evidence/image-only change.

## 1b) Weekly CSV review
1. Run the blocking contract audit:
```bash
npx pnpm check:csv
```
2. Run the data-quality audit across every CSV:
```bash
npx pnpm check:csv:data-quality
```
3. Fix `error` items first in the target area CSV.
4. Fix `warning` items next:
   - empty key fields
   - duplicates
   - inconsistent categories
   - category labels that should use preferred labels such as `Lácteos y quesos`, `Vino`, or `Pan y pastelería`
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
2. Keep URL params stable: `area`, `category`, `highlight` (`slug` del productor).
3. Run:
```bash
npx pnpm verify:ai
```
4. Validate:
- Area selector switches CSV.
- Category chips filter list and map.
- Detail links preserve the selected area.

## 3) Change UI only
1. Edit `app/page.tsx` and/or `app/globals.css`.
2. Do not move data logic out of `lib/csv-catalog.ts`.
3. Run:
```bash
npx pnpm verify:ai
```

## 4) Add a CSV column to detail view
1. Update the canonical header and contract in `docs/CSV_CONTRACT.md`.
2. Apply the structural change to every CSV under `data/csv/**` in one dedicated commit; never add a column to one area only.
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
1. Read `AGENTS.md` before changing code or data; it owns sources of truth, invariants, and workflow.
2. Keep candidate notes in `docs/candidates/[country]/[area].md`; move legacy `docs/*_candidates.md` files there before editing unless another agent owns that area.
3. Do not restore deleted one-off scripts, generator scripts, database layers, or API search layers.
4. Run the matching gate:
```bash
npx pnpm verify:data   # data/reference/evidence/images
npx pnpm verify:ai     # code/scripts/policy
```
5. If shipping, commit and push to `main`; do not run a second deploy by default.

## 7) Editorial backlog

The shared, cross-area worklist is measured, not read from a list:

```bash
npx pnpm check:defects
```

What is left to fix, in which order and under which exit criteria, is country
work: see the backlog and remediation plan linked from that country's guide in
`data/csv/[country]/AGENTS.md`. Per-area progress lives in `docs/verification/`,
never here.

## Guardrails
- Do not add DB/API/migrations unless explicitly requested.
- Prefer small, reversible edits.
- CSV row order is editorial: keep it easy to sort by the criterion that matters for the task.
- Keep correct `slug` values stable and unique; a materially wrong slug is an editorial defect to fix, not a URL to preserve mechanically.
- Keep `AGENTS.md` and this file aligned when changing workflow; `README.md` is a human quickstart and only points here.
- Keep docs in sync if behavior changes.
- Keep change proposals and task notes in Markdown.
