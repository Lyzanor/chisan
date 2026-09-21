# Chisan Agent Guide

**Connecting local food.** Chisan helps people discover place-based food and
drink producers, understand their work and contribute reliable improvements.
Discovery, participation and trust are equally part of the product. The phone
is the primary surface: the web is built mobile first and will be the base of a
future web-based app.

## Core philosophy

Publish what the evidence supports. Preserve the identity of producers and
places. Make participation useful and the public experience understandable.
Prefer a small working capability over speculative infrastructure. A validator
checks consistency; people remain responsible for editorial judgement.

Keep Chisan simple and extensible. Define clear domain contracts and observable
outcomes; leave methods and tools adaptable. Reuse owning definitions and isolate
external services in replaceable adapters. Add abstractions for concrete needs;
the catalog and ordinary editing must work without any AI provider or messaging
channel.

Consider the ongoing maintenance cost of every new field, feature, task and
process. Prefer existing data and workflows; add something only when a current
need and its practical use justify keeping it maintained. Keep occasional work
on demand and temporary artifacts disposable. Do not create standing machinery
for hypothetical future uses or routines likely to remain unattended.

Three kinds of guidance have different weight:

- **Invariants** protect identity, factual authority, privacy and authorization.
  A change to one needs an explicit design and migration of affected consumers.
- **Defaults** are the normal way to work. Use judgement when another approach
  better serves the task, and explain a material deviation in the change.
- **Current decisions** describe today's product. They may evolve when a concrete
  need warrants it; update their owner and verify affected behavior together.

## Invariants and authority

| Source | Owns |
|---|---|
| `data/csv/<country>/<region>/<area>.csv` | Producer registry, stable identity and approved base facts |
| `data/csv/<country>/country.json` | Labels, ordering, aliases, languages and public/standby state |
| `data/csv/<country>/translations.<locale>.csv` | Derived localized base prose tied to its source |
| `data/content/<country>/<producer_id>.json` | Approved products, gallery items, links and people belonging to an existing producer |
| `data/evidence/**` | Public sources behind editorial decisions and closed exclusions |
| `docs/candidates/**` | Unresolved research; removed after its handoff |
| PostgreSQL | Accounts, memberships, proposals, entitlements and audit |
| Clerk | Credentials and sessions; mapped to Chisan's internal account ID |
| `data/reference/**` | Shared vocabularies, reviewed geometry and source metadata |
| Git | Authorship, changes and recoverable earlier states |

One producer is one qualifying productive unit or governed collective. Its key
is `(country, producer_id)`; area and slug form its stable public route. Locale
is presentation, never identity or permission. Row location columns mirror the
CSV path. Related content cannot register a producer or override its base facts.

Reviewed publication enters Git; deployed requests do not modify catalog files.
Read models, APIs, indexes, translations and proposal snapshots are allowed when
their source is explicit and they cannot become independently editable catalog
authorities. A snapshot used for review is not a second published catalog.

Account actions recheck exact active permissions on the server. Payment and
ownership do not prove facts or bypass review. Private material stays private.
Device position remains transient browser input. Preserve routes, account
references and content references when renaming, merging or retiring a producer.

## Find the owner

Read the document for the actual task, not every contract. Producer research
also uses the country's `data/csv/<country>/AGENTS.md` and relevant area note.

| Task | Owner |
|---|---|
| Eligibility, research and editorial decisions | `docs/EDITORIAL.md` |
| Base field meanings and CSV representation | `docs/CSV_CONTRACT.md` |
| Products, gallery and links | `docs/PRODUCER_CONTENT.md` |
| Public routes, localization, HTML and metadata | `docs/CATALOG_WEB.md` |
| Editorial articles, guides and producer selections in articles | `docs/GUIDES.md` |
| Public JSON API, OpenAPI and browser WebMCP tools | `docs/AGENT_ACCESS.md` |
| Sources and exclusions | `docs/EVIDENCE_CONTRACT.md` |
| Producer coordinates or images | `docs/PRODUCER_GEOLOCATION.md`, `docs/IMAGES.md` |
| Visitor location | `docs/VISITOR_LOCATION_ROUTING.md` |
| Accounts, permissions and proposals | `docs/ACCOUNT_SYSTEM.md` |
| Contribution channels and deployed AI intake | `docs/EDITING_WORKFLOW.md` |
| Publication, recovery, environment and deployment | `docs/OPERATIONS.md` |
| Stripe activation and incidents | `docs/STRIPE_RUNBOOK.md` |
| Visual presentation | `design/README.md` |
| Android and iOS entry, native adapters and build | `docs/MOBILE_APPS.md` |

Load skills only for needed workflow or tool knowledge, with references read on
demand. A phase boundary does not finish a broader authorized task. Keep reusable
rules at their owner and one-off instructions in the task.

## Working defaults

Current operating mode is live on Vercel Pro with GitHub deployment integration.
"Push" means review, validate, commit and push the authorized work to GitHub;
deployable changes on `main` automatically publish to Production. Follow
`docs/OPERATIONS.md`, including database preflight, then verify the deployed
commit, `READY` state and public behavior. Use local checks while iterating and
batch coherent changes into one push; do not duplicate a Git deployment manually.

1. Inspect Git status and intended differences. Work directly on `main` unless
   the user requests a branch; isolate overlapping work when necessary to
   preserve unrelated changes and existing work.
2. Make a coherent change at its owning boundary. Prefer shared definitions
   over repeated constants, keep modules near their responsibility and preserve
   stable entry points during extraction.
3. Follow the requested outcome through review and matching checks, fixing
   regressions caused by the change. Resolve routine choices from context;
   respect analysis-only and stop-for-review requests.
4. Task instructions override workflow defaults. Reuse existing authorization;
   ask only for missing decisions affecting correctness, scope or permission.
   When blocked, cite the exact instruction or missing prerequisite and continue
   independent work.
5. Review the intended diff before committing. Stage and push only the
   authorized scope. CI does not replace local review.
6. Report the result, checks performed and blockers concisely in the user's
   language. Distinguish prepared, committed, pushed and deployed work using
   evidence for the stage claimed.

Maintained documentation is English. Preserve official names and source text.
Country guides hold operating scope, local rules and source limits. Keep live
queues and derived counts in tools and candidate notes; temporary experiments
need not become permanent infrastructure.

## Verification

- Prose, links or organization with no behavior change: `pnpm check:docs`.
- Data and reviewed related content: `pnpm verify:data`; use changed-data checks
  while iterating.
- Code, schema, permissions or policy affecting behavior: `pnpm verify:ai`.
- Visual changes also need a browser check at phone width (390px) first, then
  wide, and a concise record in `design/qa/design-qa.md` for material decisions.
- Deployment and account migrations follow the Operations preflight.

Use focused checks while iterating, then the applicable gate. Test observable
behavior; repeat or broaden checks only for new changes, failures or unresolved
risks. Report unrelated failures without expanding scope or claiming success.
Warnings need judgement, never invented facts. Release preflight and CI retain
their own gates.
