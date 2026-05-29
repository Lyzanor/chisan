# Claude Instructions

Read and follow `AGENTS.md` first. It is the shared source of truth for this repository.

Key points:
- CSV files in `data/csv/**` are the data source.
- Do not add a database, API search layer, seed process, or one-off data generator.
- Keep producer slugs stable and unique; row order is editorial.
- Keep `verificacion` present on every row with `pendiente`, `parcial`, or `verificado`.
- Keep `Venta online` present on every row with `sí`, `no`, or `no comprobado`; default to `no comprobado`.
- `Canal de venta` is optional (complements `Venta online`): pipe-separated subset of `ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion`, `marketplace`, only when `Venta online = sí`; warning-only, not blocking.
- Run `npx pnpm verify:ai` before finishing.
