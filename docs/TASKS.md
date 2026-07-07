# Common Tasks

Recipes only. The shared contract, invariants and multi-agent rules live in `AGENTS.md`; decision
criteria in `docs/EDITORIAL_POLICY.md`; allowed values in `docs/CSV_CONTRACT.md`. Nothing here
overrides them.

## 1) Update data (manual CSV edit)
1. Edit the target province CSV under `data/csv/[comunidad]/[provincia].csv`.
2. New producers get a correct unique `slug`; keep existing correct slugs stable and fix materially
   wrong ones with evidence. Place rows per the current editorial ordering, or append.
3. Set `verificacion` and `Venta online` per `docs/EDITORIAL_POLICY.md`.
4. Add or update the matching record in `data/evidence/[comunidad]/[provincia].jsonl` for adds,
   re-verifications, resolved online-sale decisions, purges, and merges.
5. Run `npx pnpm verify:data`. No build or route check is needed for a data/evidence/image-only
   change.

## 1b) Periodic CSV review
1. Run `npx pnpm check:csv` (blocking) and `npx pnpm check:csv:data-quality` (warnings).
2. Fix `error` items first, then actionable warnings: empty core fields, duplicates, category
   variants, invalid values, geography flags (the warning names the closest centroid, so you can
   tell whether `municipio` or `lat`/`lon` is the wrong field).
3. Re-run until contract errors are `0`, then `npx pnpm verify:data`.

## 2) Change catalog behavior
1. Edit catalog logic in `lib/csv-catalog.ts` or `app/page.tsx`; keep URL params stable
   (`provincia`, `categoria`, `destacar`).
2. Run `npx pnpm verify:ai`.
3. Validate: province selector switches CSV; category chips filter list and map; detail links
   preserve the selected province.

## 3) Change UI only
1. Edit `app/page.tsx` and/or `app/globals.css`; do not move data logic out of
   `lib/csv-catalog.ts`.
2. Run `npx pnpm verify:ai`.

## 4) Add a CSV column
1. Update the canonical header and contract in `docs/CSV_CONTRACT.md`.
2. Apply the structural change to all 50 CSVs in one dedicated commit; never one province only.
3. The detail table renders all fields with no extra code; update `app/page.tsx` only if the column
   should appear in the list summary.
4. Run `npx pnpm verify:ai` (structural changes normally touch validators or behavior).

## 5) Release checklist
1. Run the matching gate: `npx pnpm verify:data` (data/reference/evidence/images) or
   `npx pnpm verify:ai` (code/scripts/policy).
2. Review with `git status --short` and `git diff --stat`; stage only your own files — the worktree
   is shared and other agents may have work in flight.
3. Commit and push to `main`; GitHub→Vercel deploys production automatically.
   `vercel deploy . --prod -y` is a manual fallback only.

## 6) Agent handoff checklist
`AGENTS.md` is the handoff contract: read it before changing anything, run the matching gate before
finishing, and keep candidate research in `docs/candidates/[provincia].md`.

## Guardrails
- Prefer small, reversible edits; no DB/API/migrations unless explicitly requested.
- CSV row order is editorial: keep it easy to sort by the criterion that matters for the task.
- Keep `AGENTS.md`, `README.md`, and this file aligned when changing workflow, and docs in sync
  when behavior changes.
