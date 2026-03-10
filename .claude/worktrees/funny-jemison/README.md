# KM0 CSV Viewer

Aplicación mínima para visualizar `Km0-productores.csv`.

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

1. `/` = buscador.
2. El buscador filtra filas del CSV.
3. La portada pinta en mapa (Leaflet + OSM) los resultados con `lat/lon`.
4. Al hacer click en un resultado, abre `/p/[id]`.
5. `/p/[id]` muestra esa fila completa (columna + valor).

No hay API intermedia en el flujo principal: CSV -> filtros -> mapa/listado -> ficha.

## Estructura

- `app/page.tsx`: buscador y listado.
- `components/map/*`: mapa desacoplado (Leaflet + OSM).
- `app/p/[id]/page.tsx`: ficha de una fila del CSV.
- `lib/csv-catalog.ts`: lectura, normalización y búsqueda del CSV.
- `lib/producer-map.ts`: adaptación de filas a puntos del mapa.
- `Km0-productores.csv`: fuente única de datos.

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
- `npx pnpm sync:csv` (alias de `verify` para validar tras cambios manuales del CSV)
- `npx pnpm check:csv` (valida contrato de columnas del CSV)
- `npx pnpm test:behavior` (test mínimo de `/` y `/p/[id]`)
- `npx pnpm verify:ai` (verify + check:csv + test:behavior)

## Playwright automation

Workflow automatizado:
1. Abre `/`.
2. Busca por texto.
3. Hace click en el primer resultado.
4. Verifica navegación a `/p/[id]`.
5. Captura artefactos en `output/playwright/`.

Run steps:

```bash
# Terminal 1: levantar la app
npx pnpm dev

# Terminal 2: ejecutar workflow (URL opcional, query opcional)
./scripts/playwright-km0-workflow.sh http://localhost:3000 chocolate
```

Si no pasas argumentos, usa por defecto:
- URL: `http://localhost:3000`
- Query: `chocolate`
