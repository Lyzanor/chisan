# KM0 Producer Map

Aplicación mínima para visualizar productores KM0 desde CSV provinciales.

## Para agentes de IA

Leer `AGENTS.md`: es la guía única (fuentes de verdad, invariantes, comandos y
docs canónicos). `CLAUDE.md` y `GEMINI.md` solo redirigen allí.

## Mecanismo core

1. `/` solicita elegir provincia.
2. `/?provincia=[provincia]` = mapa y visualizador de productores.
3. El mapa pinta productores con `lat/lon`.
4. El panel lateral permite seleccionar productores y abrir `/p/[slug]?provincia=[provincia]`.
5. `/p/[slug]?provincia=[provincia]` muestra esa fila completa (columna + valor).

No hay API intermedia en el flujo principal: CSV -> mapa/listado -> ficha.
Componentes y diseño runtime: `docs/ARCHITECTURE.md`.

## Datos

- `data/csv/[comunidad]/[provincia].csv`: fuente de verdad de productores (contrato: `docs/CSV_CONTRACT.md`).
- `data/evidence/[comunidad]/[provincia].jsonl`: procedencia de decisiones editoriales; la app no la lee.
- `public/productores/[comunidad]/[provincia]/`: imágenes locales de productores.

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
