# KM0 Producer Map

Map and browser for place-based food and drink producers. The application reads
area CSV files directly and publishes them as a map, list and producer profile.
PostgreSQL and Clerk power optional accounts, favorites, ownership claims and
reviewed producer-change requests; they never replace the CSV catalog.

## Run locally

```bash
npx pnpm install
npx pnpm dev
```

Open <http://localhost:3000>.

The public catalog works without environment variables. To enable accounts,
copy `.env.example`, provision isolated Clerk/PostgreSQL environments, run
`pnpm db:migrate && pnpm db:assert-current`, and only then set
`KM0_ACCOUNTS_ENABLED=true`. See `docs/ACCOUNT_SYSTEM.md` for the security and
deployment workflow.

Canonical public routes follow the data tree: `/<country>/<area>` opens an area
and `/<country>/<area>/<slug>` opens a producer.

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
