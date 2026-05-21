# Claude Instructions

Read and follow `AGENTS.md` first. It is the shared source of truth for this repository.

Key points:
- CSV files in `data/csv/**` are the data source.
- Do not add a database, API search layer, seed process, or one-off data generator.
- Keep producer slugs stable and unique; row order is editorial.
- Run `npx pnpm verify:ai` before finishing.
