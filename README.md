# KM0 Producer Map

Minimal app for browsing local, zero-kilometre producers from per-area CSV files.

## For AI agents

Read `AGENTS.md`: it is the single guide (sources of truth, invariants, commands
and canonical docs). `CLAUDE.md` and `GEMINI.md` only point there.

## Core mechanism

1. `/` asks for a country.
2. `/[country]` (`/es`, `/jp`) asks for one of its areas.
3. `/?area=[area]` = producer map and browser.
4. The map plots producers from `lat/lon`.
5. The side panel selects producers and opens `/p/[slug]?area=[area]`.
6. `/p/[slug]?area=[area]` shows that whole row (field + value).

There is no API in between: CSV -> map/list -> profile. Components and runtime
design: `docs/ARCHITECTURE.md`.

## Vocabulary

Three levels, named in English so the framework does not carry any one country's
subdivisions: **country → region → area**. `area` is the catalog unit and the
only one that appears in URLs. What a country calls its own levels — province,
prefecture, autonomous community, 地方 — is display text declared in its
`country.json`. Producer data stays in the language of its country; only the
framework is English.

## Data

- `data/csv/[country]/[region]/[area].csv`: producer source of truth (contract: `docs/CSV_CONTRACT.md`).
- `data/csv/[country]/country.json`: labels, level names, ordering and aliases for that country.
- `data/evidence/[country]/[region]/[area].jsonl`: provenance of editorial decisions; the app does not read it.
- `public/productores/[country]/[region]/[area]/`: local producer images.

The tree is the registry. A new area is a CSV, a new country is a folder plus a
manifest — neither needs a code change.

## Usage

```bash
npx pnpm dev           # app at http://localhost:3000
npx pnpm verify:data   # gate for data/evidence/image changes
npx pnpm verify:ai     # gate for code/scripts/policy changes
```

The full command list lives in `AGENTS.md` § Commands and `package.json`.

## Publishing

Pushing to `main` deploys production automatically (GitHub→Vercel integration).
Full checklist: `docs/TASKS.md` § Release checklist.
