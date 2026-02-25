# KM0 CSV Viewer

Aplicación mínima para visualizar `Km0-productores.csv`.

## Para agentes de IA

- Guía principal: `AGENTS.md`
- Arquitectura: `docs/ARCHITECTURE.md`
- Contrato de datos CSV: `docs/CSV_CONTRACT.md`
- Tareas comunes: `docs/TASKS.md`

## Mecanismo core

1. `/` = buscador.
2. El buscador filtra filas del CSV.
3. Al hacer click en un resultado, abre `/p/[id]`.
4. `/p/[id]` muestra esa fila completa (columna + valor).

No hay capa de mapa ni API intermedia en el flujo principal.

## Estructura

- `app/page.tsx`: buscador y listado.
- `app/p/[id]/page.tsx`: ficha de una fila del CSV.
- `lib/csv-catalog.ts`: lectura, normalización y búsqueda del CSV.
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
