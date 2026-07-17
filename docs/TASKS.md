# Common Tasks

## 1) Update data (manual CSV edit)
1. Edit the target province CSV under `data/csv/[comunidad]/[provincia].csv`.
2. Add new producers with a correct unique `slug`; keep existing correct slugs stable, but fix materially wrong ones with evidence.
3. Place rows according to the current editorial ordering, or append when no ordering pass is part of the task.
4. Set `verificacion` and `Venta online` following the decision model in `docs/EDITORIAL_POLICY.md` (allowed values and blocking rules in `docs/CSV_CONTRACT.md`); keep `no comprobado` until the sales channel is reviewed.
5. Add or update the matching record in `data/evidence/[comunidad]/[provincia].jsonl` for a new producer, re-verification, resolved online-sale decision, purge, or merge.
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
1. Read `AGENTS.md` before changing code or data; it owns sources of truth, invariants, and workflow.
2. Keep candidate notes in `docs/candidates/[provincia].md`; move legacy `docs/*_candidates.md` files there before editing unless another agent owns that province.
3. Do not restore deleted one-off scripts, generator scripts, database layers, or API search layers.
4. Run the matching gate:
```bash
npx pnpm verify:data   # data/reference/evidence/images
npx pnpm verify:ai     # code/scripts/policy
```
5. If shipping, commit and push to `main`; do not run a second deploy by default.

## 7) Backlog transversal compartido

Trabajo pendiente que cruza provincias o sesiones. Cualquier agente puede tomarlo; actualiza o borra
la entrada al avanzarla. No dupliques aquí el estado provincial (eso vive en `docs/verificacion/`).

- **Categorías (pases 2026-06-20/21 en main: `77f9f72`, `d157b1f`, `41233aa`, `183f4eb`):** taxonomía
  consolidada a categoría principal (matiz→descripción; minoritarias→`Otros` a la espera de
  subcategorías). Pendiente: revisar combos multi-producto y pescado/setas dudosos; repaso opcional de
  Navarra contra la taxonomía consolidada (se normalizó lote a lote en su pasada, no en bloque);
  futuro: subcategorías. ⚠ El diagnóstico original vive en un documento externo de otro asistente (no
  accesible desde el repo): rehacer con `npx pnpm list:categories` + `check:csv:data-quality` antes de
  continuar, o pedir el export al usuario.
- **Corrupción por plantilla (hallazgo 2026-06-21):** algunas filas heredaron `productos estrella` +
  `descripcion` de boilerplate de OTRA categoría (p. ej. texto de miel en una almazara). Reparadas 4
  (Huelva ×2, Sevilla ×1, Málaga ×1) detectadas por keyword del nombre; pueden quedar más en filas cuyo
  nombre de marca no delata la categoría. Barrido pendiente: cruzar `categoria` contra keywords de
  `descripcion`/`productos estrella`.
- **Imágenes basura restante (2026-07-17):** la purga por hash (`6d8c1fa`, 130 imágenes) dejó 5 basuras
  conocidas en provincias entonces activas — sevilla: `miel-deaz-aznalcollar`,
  `embutidos-reina-de-los-angeles-el-real-de-la-jara`, `chocolates-mama-goye-…-bollullos-de-la-mitacion`;
  lugo: `abella-meiga-outeiro-de-rei`, `toxal-riba-navia-de-suarna`. Vaciar celda + borrar asset cuando
  esas provincias queden libres. A más largo plazo: barrido visual por provincia para basura única
  (ver `docs/IMAGES.md`).
- **Trabajo en ramas `codex/*` sin integrar en `main`:** Ávila (1ª pasada completa) y Burgos (lotes 1-8)
  en `codex/verifica-avila-lote-1`; continuación de Burgos activa en `codex/verifica-burgos-cont`;
  Málaga lotes 1-2 + commit gemelo de lácteos (`77aefb6`) en `codex/verifica-malaga-lotes-1-2`. Los
  `docs/verificacion/avila.md` y `burgos.md` de esas ramas son la fuente para reanudar; integrar a
  `main` cuando sus agentes cierren.
- **Lácteos/Quesos 10 provincias (cerrada 2026-07-04, `cdaa141`):** residuales 22 `parcial` y 27 altas
  sin imagen.
- **Pasada "completar verificados + Venta online" por provincia:** Ourense y Lugo hechos; resto de
  provincias sin pasada profunda de VO siguen el criterio de `docs/VERIFICATION_TECHNIQUES.md` § Venta
  online.

## Guardrails
- Do not add DB/API/migrations unless explicitly requested.
- Prefer small, reversible edits.
- CSV row order is editorial: keep it easy to sort by the criterion that matters for the task.
- Keep correct `slug` values stable and unique; a materially wrong slug is an editorial defect to fix, not a URL to preserve mechanically.
- Keep `AGENTS.md` and this file aligned when changing workflow; `README.md` is a human quickstart and only points here.
- Keep docs in sync if behavior changes.
- Keep change proposals and task notes in Markdown.
