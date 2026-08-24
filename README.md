# Chisan

> Local food, unified.

Chisan is an early-stage startup building the shared discovery layer for local
food. It brings place-based food and drink producers into one trustworthy,
globally browsable catalog while preserving the identity and context of every
place.

The ambition is larger than a directory: Chisan connects discovery, producer
profiles, community contributions and reviewed data stewardship in one product.
People get a clear way to find and understand nearby producers; producers get a
durable place in the catalog and a path to keep their information current.

Production: <https://chisan.app>

## Product direction

Chisan is growing as a platform around three connected capabilities:

- **Discover:** browse local producers by place and category through the web,
  maps and individual profiles.
- **Participate:** save producers, claim a profile and propose improvements
  through account-based flows.
- **Trust:** publish reviewed producer information with transparent provenance
  and stable public identities.

The goal is to make local food easier to discover and support across borders
without flattening what makes each local ecosystem distinct.

## CSV at the core

Area CSV files remain the canonical catalog and the portable foundation of the
product. The website reads them directly; editorial evidence, translations,
accounts and reviewed contribution workflows surround them without becoming a
second source of producer truth.

This keeps the core inspectable and independent while allowing the product
experience and operating workflows to evolve around it.

## Run locally

```bash
npx pnpm install
npx pnpm dev
```

Open <http://localhost:3000>.

The public discovery experience works without environment variables. Accounts
and contribution flows are optional in local development; see
`docs/ACCOUNT_SYSTEM.md` and `docs/OPERATIONS.md` when working on them.

Canonical public routes follow the data tree. The short country scope serves
that country's configured default language:

```text
/<country>/<area>
/<country>/<area>/<slug>
```

An alternate published language uses the composite scope
`/<language>-<country>`, for example `/ca-es/barcelona`, `/en-de/berlin` or
`/en-jp/tokyo`. Country, area and producer slugs remain stable routing
identifiers; every language variant resolves to the same canonical producer row
and `(country, producer_id)`. The global `/` remains the neutral country and
area selector.

## Project map

- Producer data: `data/csv/<country>/<region>/<area>.csv`
- Materialized localized descriptions:
  `data/csv/<country>/translations.<locale>.csv`
- Product and engineering context for agents: `AGENTS.md`
- Account, claim and producer-edit workflow: `docs/ACCOUNT_SYSTEM.md`
- Operations, deployment and recovery: `docs/OPERATIONS.md`
- Editorial policy, workflow and handoffs: `docs/EDITORIAL.md`
- Candidate discovery workspace: `docs/candidates/README.md`
- Published-row contract: `docs/CSV_CONTRACT.md`
- Decision provenance: `docs/EVIDENCE_CONTRACT.md`
- Producer coordinates: `docs/GEOLOCATION.md`
- Optional device-location area routing: `docs/LOCATION_ROUTING.md`
- Producer images: `docs/IMAGES.md`

Run `npx pnpm verify:data` for data-only changes and `npx pnpm verify:ai` for
code, validation or policy changes.

## Deployment

Pushing `main` to GitHub triggers the production deployment on Vercel. Use the
preflight, smoke and rollback procedure in `docs/OPERATIONS.md`.
