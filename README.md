# KM0 Producer Map

Map and browser for place-based food and drink producers. The application reads
area CSV files directly and publishes them as a map, list and producer profile;
there is no database or producer API between the files and the interface.

## Run locally

```bash
npx pnpm install
npx pnpm dev
```

Open <http://localhost:3000>.

## Data and contribution

- Producer data: `data/csv/<country>/<region>/<area>.csv`
- Agent and contribution guide: `AGENTS.md`
- Published-row contract: `docs/CSV_CONTRACT.md`
- Editorial decisions: `docs/EDITORIAL_POLICY.md`
- Decision provenance: `docs/EVIDENCE_CONTRACT.md`

Run `npx pnpm verify:data` for data-only changes and `npx pnpm verify:ai` for
code, validation or policy changes.

## Publishing

Pushing `main` to GitHub triggers the production deployment on Vercel.
