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

**Empieza por medir, no por leer esta lista:**

```bash
npx pnpm check:defects
```

Imprime, por provincia, cuántas filas tiene cada defecto de abajo. Añade
`--provincia <nombre>` para una sola, `--check <id> --list` para ver los slugs y
`--json` para tratarlo. No es bloqueante: es la worklist. Los recuentos viven
**solo** ahí; si los copias aquí caducan. Cubre lo que las otras puertas no
pueden ver porque necesitan contexto entre ficheros o un juicio que el contrato
no codifica.

### A) Arreglos de tooling que cierran la puerta (hazlos antes que el trabajo editorial)

Cada uno convierte una limpieza manual recurrente en algo que el validador
impide. Requieren `verify:ai`.

- **`categories.json` acepta 29 etiquetas que nadie usa** — son justo las que
  fusionó la consolidación de 2026-06-21 (`d157b1f`, `41233aa`, `183f4eb`).
  Siguen registradas, así que la puerta bloqueante las deja volver, y **27 ya
  han vuelto** (≈99 filas; `Carnes` 19, `Repostería artesana` 10, `Platos
  preparados` 8…). Bórralas del registro y la reintroducción pasa a ser un
  error, no una nota en un doc. Mide antes/después con `check:defects --check
  categoria-variante`.
- **El aviso de variantes de `audit-csv.js` no pliega plurales y corre por
  fichero.** Por eso `Carne`(mayoría)/`Carnes` no salta ni en Málaga, donde
  conviven en el mismo CSV. La app agrupa por string exacto
  (`lib/csv-catalog.ts`), así que quien filtra una etiqueta no ve la otra.
- **Municipios en forma bilingüe `A / B` se saltan el geo-check.** El
  normalizador de `audit-csv.js` ya recorta el sufijo `Ciudad - Distrito`; le
  falta probar cada mitad de `Puente la Reina / Gares`. Son 26 filas navarras,
  16 de las cuales resolverían solas. El recuento lo da `check:csv` en su línea
  `geo-check skipped` (esa métrica es suya, `check:defects` no la duplica). El
  resto sí son pedanías reales: hueco documentado y aceptado, no lo persigas.

### B) Deuda editorial

Ordenada por daño al usuario, no por tamaño.

- **Filas sintéticas** (`--check sinteticas`): sin web, teléfono, correo, redes
  ni Maps. Nombres construidos por plantilla `[categoría] + [topónimo]` con
  dominios que no resuelven. **Están publicadas.** El método que sí sostiene la
  purga está en `docs/EDITORIAL_POLICY.md` § Decision order y ya se aplicó 65
  veces: no basta «no encontré nada» — hace falta la ausencia en una **fuente
  exhaustiva que la listaría si existiera** (marca autonómica, registro de
  operadores de la DOP, RGSEAA) más contactos sin correspondencia pública. Si
  aparece en esa fuente, se queda como `parcial` con ella de fuente.
- **Evidencia prestada** (`--check evidencia-prestada` y `--check
  web-de-tercero`): un pin de Google Maps o la web del consejo regulador
  bastan para pasar el gate de `verificado`, que solo exige coordenadas + un
  enlace externo. Clusters típicos: `apoloybaco.com` (un blog) en Toledo,
  `faba-asturiana.org`, `parcagrari.cat`, `quesoidiazabal.eus`. Revisa la fila,
  no el dominio: alguna es un grupo real.
- **`Venta online` sin resolver** (`--check venta-sin-resolver`): el mayor hueco
  abierto del catálogo y el que más útil hace una ficha. Criterio en
  `docs/VERIFICATION_TECHNIQUES.md` § Venta online. Ourense y Lugo tienen pasada
  profunda; el resto no. Al resolver a `sí`, rellena `Canal de venta` en el mismo
  cambio (`--check canal-sin-clasificar` lista las que se quedaron a medias).
- **Descripciones genéricas** (`--check descripcion-generica`): texto que narra
  nuestro proceso («incorporado desde directorios de…», «revisado con Google
  Maps») o repite la categoría. Se publica tal cual en la ficha. Es cola de
  redacción, no de purga.
- **Imágenes** (`--check sin-imagen`): flujo en `docs/IMAGES.md`; `enrich:images`
  por slug con `--contact-sheet`, nunca `--apply` en bloque. Rinde más empezar
  por provincias pequeñas y ya cerradas editorialmente que por las grandes.
  Pendiente aparte: 5 basuras conocidas que sobrevivieron a la purga por hash
  (`6d8c1fa`) — sevilla `miel-deaz-aznalcollar`,
  `embutidos-reina-de-los-angeles-el-real-de-la-jara`,
  `chocolates-mama-goye-…-bollullos-de-la-mitacion`; lugo
  `abella-meiga-outeiro-de-rei`, `toxal-riba-navia-de-suarna`.
- **Corrupción por plantilla cruzada (2026-06-21):** filas que heredaron
  `productos estrella` + `descripcion` de otra categoría (texto de miel en una
  almazara). Reparadas 4 por keyword del nombre; quedan las de marca que no
  delata la categoría. Barrido pendiente: cruzar `categoria` contra keywords de
  esos dos campos.
- **Cobertura de evidencia** (`--check sin-evidencia`): la evidencia es
  advisory y falta-`keep` **no** es deuda (`docs/EVIDENCE_CONTRACT.md`). Úsalo
  solo para saber dónde no hay rastro de por qué se decidió algo, no para
  backfillear.

### C) Higiene de repo

- **Candidatos:** las casillas `- [ ]` de `docs/candidates/` **no son cola
  abierta** — la poda al integrar no se está cumpliendo y entre el 59% y el 73%
  de las casillas sin marcar ya están en el CSV. Cruza siempre contra el CSV por
  nombre normalizado + dominio antes de planificar sobre uno de esos ficheros, y
  poda al resolver como pide `docs/candidates/README.md`.
- **Ramas:** comprueba con `git diff main...<rama> -- data/csv` antes de creer
  que una rama tiene trabajo vivo; varias `codex/*` ya están en `main` y alguna
  está por detrás. Si la rama va por detrás, bórrala en vez de fusionarla.

## Guardrails
- Do not add DB/API/migrations unless explicitly requested.
- Prefer small, reversible edits.
- CSV row order is editorial: keep it easy to sort by the criterion that matters for the task.
- Keep correct `slug` values stable and unique; a materially wrong slug is an editorial defect to fix, not a URL to preserve mechanically.
- Keep `AGENTS.md` and this file aligned when changing workflow; `README.md` is a human quickstart and only points here.
- Keep docs in sync if behavior changes.
- Keep change proposals and task notes in Markdown.
