# KM0 Producer Map

Aplicación mínima para visualizar productores KM0 desde CSV provinciales.

## Para agentes de IA

- Guía principal: `AGENTS.md`
- Claude/Gemini: `CLAUDE.md` y `GEMINI.md` solo redirigen a `AGENTS.md`.
- Arquitectura: `docs/ARCHITECTURE.md`
- Contrato de datos CSV: `docs/CSV_CONTRACT.md`
- Contrato de evidencia: `docs/EVIDENCE_CONTRACT.md`
- Política editorial y evaluaciones: `docs/EDITORIAL_POLICY.md`
- Técnicas de verificación: `docs/VERIFICATION_TECHNIQUES.md`
- Tareas comunes: `docs/TASKS.md`
- Completitud provincial: `docs/PROVINCE_COMPLETENESS.md`
- Notas temporales de candidatos: `docs/candidates/README.md`
- No recuperar scripts de generación/restauración antiguos: los CSV en `data/csv/**` son la base.

## Comunicación y documentación

- Usar Markdown por defecto para notas de cambio, propuestas y documentación técnica.
- Escribir pasos en listas simples y comandos en bloques de código.
- Referenciar siempre archivos concretos cuando se propongan cambios.

## Mecanismo core

1. `/` solicita elegir provincia.
2. `/?provincia=[provincia]` = mapa y visualizador de productores.
3. El mapa pinta productores con `lat/lon`.
4. El panel lateral permite seleccionar productores y abrir `/p/[slug]?provincia=[provincia]`.
5. `/p/[slug]?provincia=[provincia]` muestra esa fila completa (columna + valor).

No hay API intermedia en el flujo principal: CSV -> mapa/listado -> ficha.

## Estructura

- `app/page.tsx`: mapa y visualizador.
- `components/map/*`: mapa desacoplado (Leaflet + OSM).
- `app/p/[slug]/page.tsx`: ficha de un productor del CSV, con path canónico `/p/[slug]` y `provincia` en query.
- `lib/csv-catalog.ts`: lectura, normalización y búsqueda del CSV.
- `lib/catalog-navigation.ts`: catálogo de comunidades/provincias.
- `data/csv/catalunya/barcelona.csv`: CSV de Barcelona.
- `data/csv/[comunidad]/[provincia].csv`: CSV de cada provincia, agrupados por comunidad autónoma.
- `data/evidence/[comunidad]/[provincia].jsonl`: procedencia estructurada de decisiones editoriales; la app no la lee.
- `data/evals/editorial-policy-cases.json`: casos sintéticos para evitar deriva de criterios.
- `public/productores/[comunidad]/[provincia]/`: imágenes locales de productores.

## Uso

```bash
npx pnpm dev
```

App en [http://localhost:3000](http://localhost:3000).

## Scripts

- `npx pnpm dev`
- `npx pnpm build`
- `npx pnpm start`
- `npx pnpm verify` (lint + build)
- `npx pnpm check:csv` (valida el contrato bloqueante de todos los CSV)
- `npx pnpm check:csv:data-quality` (auditoría editorial con warnings para todos los CSV)
- `npx pnpm check:csv:completeness` (avance provincial frente a objetivos editoriales fijos; no compara provincias entre sí)
- `npx pnpm check:evidence` (valida fuente, fecha, claims y paridad de decisiones con el CSV)
- `npx pnpm check:images` (valida rutas de imágenes referenciadas y avisa de desviaciones editoriales)
- `npx pnpm enrich:images --provincia cuenca` (dry-run para encontrar imágenes oficiales; añadir `--apply` solo tras revisar)
- `npx pnpm test:csv-audit` (regresión de reglas CSV)
- `npx pnpm test:intelligence` (contrato de evidencia + casos editoriales sintéticos)
- `npx pnpm test:behavior` (test mínimo de `/`, `/?provincia=...` y `/p/[slug]?provincia=...`)
- `npx pnpm verify:data` (CSV + imágenes + evidencia; sin build)
- `npx pnpm verify:ai` (lint/build + todos los contratos y tests)

## Publicar

Orden recomendado:

```bash
npx pnpm verify:data   # o verify:ai si cambió código/scripts
git status --short
git add [solo tus archivos]
git commit -m "..."
git push origin main
```

El árbol de trabajo es compartido entre agentes: no uses `git add .`, otro
agente puede tener trabajo en curso sin commitear.

El push a `main` activa el despliegue de producción mediante la integración
GitHub→Vercel. `vercel deploy . --prod -y` queda solo como fallback manual.
