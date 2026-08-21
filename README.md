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

The public catalog works without environment variables. Account setup is
optional; follow `docs/ACCOUNT_SYSTEM.md` for its domain and security rules and
`docs/OPERATIONS.md` for environment, migration, deployment, and recovery.

Canonical public routes follow the data tree: `/<country>/<area>` opens an area
and `/<country>/<area>/<slug>` opens a producer.

## Data and documentation

- Producer data: `data/csv/<country>/<region>/<area>.csv`
- Agent operating model and repository contract: `AGENTS.md`
- Account, claim and producer-edit workflow: `docs/ACCOUNT_SYSTEM.md`
- Operations, deployment and recovery: `docs/OPERATIONS.md`
- Editorial policy, workflow and handoffs: `docs/EDITORIAL.md`
- Candidate discovery workspace: `docs/candidates/README.md`
- Published-row contract: `docs/CSV_CONTRACT.md`
- Decision provenance: `docs/EVIDENCE_CONTRACT.md`
- Producer coordinates: `docs/GEOLOCATION.md`
- Producer images: `docs/IMAGES.md`

Run `npx pnpm verify:data` for data-only changes and `npx pnpm verify:ai` for
code, validation or policy changes.

## Publishing

Pushing `main` to GitHub triggers the production deployment on Vercel. Use the
preflight, smoke and rollback procedure in `docs/OPERATIONS.md`.
