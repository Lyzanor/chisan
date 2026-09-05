# Chisan

> Connecting local food.

Chisan brings local food and drink producers into one trustworthy discovery
experience: maps, profiles, favorites and reviewed contributions. Producers keep
one durable identity; their places, languages and work keep their own context.

Production: <https://chisan.app>. The current public focus is Spain. Country
manifests control publication; other countries remain on standby internally.

## Run and work

```bash
npx pnpm install
npx pnpm dev
```

Open <http://localhost:3000>. Public discovery runs without account secrets.
Accounts and payment integrations are optional locally. See
[Operations](docs/OPERATIONS.md) before connecting a database or deploying.

Use `pnpm check:docs` for prose/link changes, `pnpm verify:data` for catalog
changes, and `pnpm verify:ai` for code or behavior changes. Run focused tests
while iterating. The full gate runs lint, build, domain tests and data validation.

## One product, explicit ownership

```text
research / contributions -> review -> Git catalog -> public discovery
                               |          |
                            evidence   related products, gallery, links

Clerk -> Chisan account -> permissions / proposals / favorites / entitlements
```

Area CSVs register producers and hold approved base facts. A related content
package extends an existing producer; it cannot create another producer record.
PostgreSQL owns participation and permissions. Copies used for review, search
or localization remain derived from their named source.

The stable producer key is `(country, producer_id)`. Its current public route is
`/<country>/<area>/<slug>`; alternate languages use `/<language>-<country>`.
Moving or translating a page does not change its account or content identity.

## Find the right place

| Work | Code/data | Explanation |
|---|---|---|
| Producer registry and base facts | `data/csv/`, `lib/catalog/producer-schema.ts`, `lib/catalog/producers.ts` | [CSV contract](docs/CSV_CONTRACT.md) |
| Countries, labels and publication | `country.json`, `lib/catalog/registry.ts` | [Catalog web](docs/CATALOG_WEB.md) |
| Localized producer prose | `lib/catalog/localization.ts`, `lib/i18n/` | [Catalog web](docs/CATALOG_WEB.md) |
| Public agent discovery | `lib/agents/`, `/api/catalog/v1`, `/llms.txt` | [Agent access and WebMCP](docs/AGENT_ACCESS.md) |
| Products, gallery and links | `data/content/`, `lib/catalog/content-schema.ts` | [Producer content](docs/PRODUCER_CONTENT.md) |
| Editorial decisions and sources | `docs/candidates/`, `data/evidence/`, `lib/editorial/` | [Editorial](docs/EDITORIAL.md), [evidence](docs/EVIDENCE_CONTRACT.md) |
| Accounts and contributions | `lib/accounts/`, `app/(application)/cuenta/actions/` | [Account system](docs/ACCOUNT_SYSTEM.md) |
| Maps and location | `components/map/`, `lib/location/` | [Producer coordinates](docs/PRODUCER_GEOLOCATION.md), [visitor location](docs/VISITOR_LOCATION_ROUTING.md) |
| Visual system | `design/`, component styles | [Design](design/README.md) |
| Runtime and release | `scripts/`, `.github/workflows/` | [Operations](docs/OPERATIONS.md) |
| Payment adapter | `lib/payments/` | [Stripe runbook](docs/STRIPE_RUNBOOK.md) |

[AGENTS.md](AGENTS.md) distinguishes core invariants from working defaults and
current product decisions. It is the short entry point for repository work.
`lib/csv-catalog.ts` and the account action entry point preserve existing imports
while their implementations live in focused modules.

## Related producer content

```bash
pnpm producer:content show es <producer_id>
pnpm producer:content init es <producer_id> .tmp/producer-content.json
pnpm producer:content check .tmp/producer-content.json
pnpm producer:content apply .tmp/producer-content.json --expect <revision-or-absent>
```

Review the draft's facts, images and public sources before applying it. Products,
gallery and links appear in the existing expanded profile while its entitlement
is active. The editorial tools prepare local files; they do not deploy or grant
permissions. [The content contract](docs/PRODUCER_CONTENT.md) includes an example.

## Release

Pushing `main` triggers Vercel production deployment. Keep unrelated work out of
a release and follow [preflight and smoke checks](docs/OPERATIONS.md).
Plans such as [QR selections](docs/QR_SELECTION_PLAN.md) describe future work;
they do not activate a feature or replace current contracts.
