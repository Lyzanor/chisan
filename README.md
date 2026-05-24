# KM0 Producer Map

Aplicación mínima para visualizar productores KM0 desde CSV provinciales.

## Para agentes de IA

- Guía principal: `AGENTS.md`
- Claude/Gemini: `CLAUDE.md` y `GEMINI.md` solo redirigen a `AGENTS.md`.
- Arquitectura: `docs/ARCHITECTURE.md`
- Contrato de datos CSV: `docs/CSV_CONTRACT.md`
- Tareas comunes: `docs/TASKS.md`
- No recuperar scripts de generación/restauración antiguos: los CSV en `data/csv/**` son la base.

## Comunicación y documentación

- Usar Markdown por defecto para notas de cambio, propuestas y documentación técnica.
- Escribir pasos en listas simples y comandos en bloques de código.
- Referenciar siempre archivos concretos cuando se propongan cambios.

## Mecanismo core

1. `/` = mapa y visualizador de productores.
2. La portada lee el CSV de la provincia seleccionada.
3. El mapa pinta productores con `lat/lon`.
4. El panel lateral permite seleccionar productores y abrir `/p/[slug]`.
5. `/p/[slug]` muestra esa fila completa (columna + valor).

No hay API intermedia en el flujo principal: CSV -> mapa/listado -> ficha.

## Estructura

- `app/page.tsx`: mapa y visualizador.
- `components/map/*`: mapa desacoplado (Leaflet + OSM).
- `app/p/[slug]/page.tsx`: ficha de un productor del CSV, con URL canónica `/p/[slug]`.
- `lib/csv-catalog.ts`: lectura, normalización y búsqueda del CSV.
- `lib/catalog-navigation.ts`: catálogo de comunidades/provincias.
- `data/csv/catalunya/barcelona.csv`: CSV principal y fuente de Barcelona.
- `data/csv/[comunidad]/[provincia].csv`: CSV del resto de provincias, agrupados por comunidad autónoma.
- `public/productores/barcelona/`: imágenes específicas de Barcelona.

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
- `npx pnpm check:csv:completeness` (señal de planificación para ampliar provincias)
- `npx pnpm test:csv-audit` (regresión de reglas CSV)
- `npx pnpm test:behavior` (test mínimo de `/` y `/p/[slug]`)
- `npx pnpm verify:ai` (verify + contrato CSV + tests CSV + behavior)

## Publicar

Orden recomendado:

```bash
npx pnpm verify:ai
git status --short
git add .
git commit -m "..."
git push
vercel deploy . --prod -y
```
