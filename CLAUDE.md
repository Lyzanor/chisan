# Claude Instructions

Read and follow `AGENTS.md` first. It is the shared source of truth for this repository.

Key points:
- CSV files in `data/csv/**` are the data source.
- All 50 CSVs share the canonical 20-column header (ending `…,Venta online,Canal de venta`) and LF line endings (`.gitattributes`). Structural changes (add/remove/reorder columns) go to all CSVs at once, in a solo commit.
- `AGENTS.md` is the shared multi-agent contract; do not create Claude-only data workflows or private sources of truth.
- Check `git status --short` before editing and avoid overwriting another agent's active CSV, image, or candidate-note changes.
- Use shared candidate notes in `docs/candidates/`, not agent-private folders, and prune/update notes once resolved.
- Do not add a database, API search layer, seed process, or one-off data generator.
- Keep producer slugs stable and unique; row order is editorial.
- Keep `verificacion` present on every row with `pendiente`, `parcial`, or `verificado`.
- Keep `Venta online` present on every row with `sí`, `no`, or `no comprobado`; default to `no comprobado`.
- `Canal de venta`: column present in every CSV, value optional (complements `Venta online`): pipe-separated subset of `ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion`, `marketplace`, only when `Venta online = sí`; warning-only, not blocking.
- Before finishing, run the matching gate: `npx pnpm verify:data` for data/reference/image-only changes (fast, no build), or `npx pnpm verify:ai` when you touched code. Deploy = push to `main` (Vercel auto-deploys); don't poll deployments.
