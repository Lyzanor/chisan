# KM0 Producer Map

Aplicación mínima para visualizar productores KM0 desde CSV provinciales.

## Para agentes de IA

Leer `AGENTS.md`: es la guía única (fuentes de verdad, invariantes, comandos y
docs canónicos). `CLAUDE.md` y `GEMINI.md` solo redirigen allí.

## Mecanismo core

1. `/` solicita elegir país.
2. `/[pais]` (`/es`, `/jp`) solicita elegir provincia o prefectura.
3. `/?provincia=[provincia]` = mapa y visualizador de productores.
4. El mapa pinta productores con `lat/lon`.
5. El panel lateral permite seleccionar productores y abrir `/p/[slug]?provincia=[provincia]`.
6. `/p/[slug]?provincia=[provincia]` muestra esa fila completa (columna + valor).

No hay API intermedia en el flujo principal: CSV -> mapa/listado -> ficha.
Componentes y diseño runtime: `docs/ARCHITECTURE.md`.

## Datos

- `data/csv/[pais]/[comunidad]/[provincia].csv`: fuente de verdad de productores (contrato: `docs/CSV_CONTRACT.md`).
- `data/evidence/[pais]/[comunidad]/[provincia].jsonl`: procedencia de decisiones editoriales; la app no la lee.
- `public/productores/[pais]/[comunidad]/[provincia]/`: imágenes locales de productores.

## Uso

```bash
npx pnpm dev           # app en http://localhost:3000
npx pnpm verify:data   # gate para cambios de datos/evidencia/imágenes
npx pnpm verify:ai     # gate para cambios de código/scripts/policy
```

La lista completa de comandos vive en `AGENTS.md` § Commands y `package.json`.

## Publicar

Push a `main` despliega producción automáticamente (integración GitHub→Vercel).
Checklist completo: `docs/TASKS.md` § Release checklist.
