# KM0 Producer Map

Aplicación mínima para visualizar productores KM0 desde CSV provinciales.

## Para agentes de IA

- Guía principal: `AGENTS.md`
- Arquitectura: `docs/ARCHITECTURE.md`
- Contrato de datos CSV: `docs/CSV_CONTRACT.md`
- Tareas comunes: `docs/TASKS.md`

## Comunicación y documentación

- Usar Markdown por defecto para notas de cambio, propuestas y documentación técnica.
- Escribir pasos en listas simples y comandos en bloques de código.
- Referenciar siempre archivos concretos cuando se propongan cambios.

## Mecanismo core

1. `/` = mapa y visualizador de productores.
2. La portada lee el CSV de la provincia seleccionada.
3. El mapa pinta productores con `lat/lon`.
4. El panel lateral permite seleccionar productores y abrir `/p/[id]-[slug]`.
5. `/p/[id]-[slug]` muestra esa fila completa (columna + valor).

No hay API intermedia en el flujo principal: CSV -> mapa/listado -> ficha.

## Estructura

- `app/page.tsx`: mapa y visualizador.
- `components/map/*`: mapa desacoplado (Leaflet + OSM).
- `app/p/[id]/page.tsx`: ficha de una fila del CSV, con URL canónica `/p/[id]-[slug]`.
- `lib/csv-catalog.ts`: lectura, normalización y búsqueda del CSV.
- `lib/producer-map.ts`: adaptación de filas a puntos del mapa.
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
- `npx pnpm check:csv` (valida contrato de columnas del CSV)
- `npx pnpm test:behavior` (test mínimo de `/` y `/p/[id]-[slug]`)
- `npx pnpm verify:ai` (verify + check:csv + test:behavior)

## Playwright automation

Workflow automatizado:
1. Abre `/`.
2. Hace click en la primera ficha.
3. Verifica navegación a `/p/[id]-[slug]`.
4. Captura artefactos en `output/playwright/`.

Run steps:

```bash
# Terminal 1: levantar la app
npx pnpm dev

# Terminal 2: ejecutar workflow (URL opcional)
./scripts/playwright-km0-workflow.sh http://localhost:3000
```

Si no pasas argumentos, usa `http://localhost:3000`.
