# KM0 CSV Viewer

Aplicación mínima para visualizar `Km0-productores.csv`.

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
