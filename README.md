# Chisan

Chisan is a map and browser for place-based food and drink producers. The application reads
area CSV files directly and publishes them as a map, list and producer profile.
PostgreSQL and Clerk power optional accounts, favorites, ownership claims and
reviewed producer-change requests; they never replace the CSV catalog.

Production: <https://chisan.app>

## Run locally

```bash
npx pnpm install
npx pnpm dev
```

Open <http://localhost:3000>.

The public catalog works without environment variables. To enable accounts,
copy `.env.example`, provision isolated Clerk/PostgreSQL environments, run
`npx pnpm db:migrate && npx pnpm db:assert-current`, and only then set
`CHISAN_ACCOUNTS_ENABLED=true`. The application accepts the legacy
`KM0_ACCOUNTS_ENABLED` name during the controlled rename. See
`docs/ACCOUNT_SYSTEM.md` for account boundaries and security, and
`docs/OPERATIONS.md` for deployment and recovery.

The onboarding choice distinguishes a simple user profile from a producer
profile, but it is never a permission. Every account may save favorites;
producer editing additionally requires an approved membership for that exact
producer.

Canonical public routes follow the data tree: `/<country>/<area>` opens an area
and `/<country>/<area>/<slug>` opens a producer.

## Data and contribution

- Producer data: `data/csv/<country>/<region>/<area>.csv`
- Agent and contribution guide: `AGENTS.md`
- Account, claim and producer-edit workflow: `docs/ACCOUNT_SYSTEM.md`
- Operations, deployment and recovery: `docs/OPERATIONS.md`
- Editorial workflow and handoffs: `docs/EDITORIAL_WORKFLOW.md`
- Published-row contract: `docs/CSV_CONTRACT.md`
- Editorial decisions: `docs/EDITORIAL_POLICY.md`
- Decision provenance: `docs/EVIDENCE_CONTRACT.md`

Run `npx pnpm verify:data` for data-only changes and `npx pnpm verify:ai` for
code, validation or policy changes.

## Publishing

Pushing `main` to GitHub triggers the production deployment on Vercel. Use the
preflight, smoke and rollback procedure in `docs/OPERATIONS.md`.
