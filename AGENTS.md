# Chisan Agent Guide

**Connecting local food.** Chisan helps people discover place-based food and
drink producers, understand their work and contribute reliable improvements.
Discovery, participation and trust are equally part of the product.

## Core philosophy

Publish what the evidence supports. Preserve the identity of producers and
places. Make participation useful and the public experience understandable.
Prefer a small working capability over speculative infrastructure. A validator
checks consistency; people remain responsible for editorial judgement.

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
| `data/content/<country>/<producer_id>.json` | Approved products, gallery items and links belonging to an existing producer |
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
| Sources and exclusions | `docs/EVIDENCE_CONTRACT.md` |
| Producer coordinates or images | `docs/PRODUCER_GEOLOCATION.md`, `docs/IMAGES.md` |
| Visitor location | `docs/VISITOR_LOCATION_ROUTING.md` |
| Accounts, permissions and proposals | `docs/ACCOUNT_SYSTEM.md` |
| Publication, recovery, environment and deployment | `docs/OPERATIONS.md` |
| Stripe activation and incidents | `docs/STRIPE_RUNBOOK.md` |
| Visual presentation | `design/README.md` |

## Working defaults

1. Inspect Git status and intended differences. Work directly on `main` unless
   the user requests a branch; preserve unrelated changes and existing work.
2. Make a coherent change at its owning boundary. Prefer shared definitions
   over repeated constants, and behavior tests over exact source-code spelling.
3. Keep modules near their responsibility. Preserve stable entry points during
   extraction; avoid a repository-wide rename merely for visual uniformity.
4. Review the intended diff and run the matching checks before committing.
   Stage and push only the authorized scope. CI does not replace local review.

Maintained documentation is English. Preserve official names and source text.
Country guides normally describe operating scope, local rules and source limits;
use additional explanatory structure when useful. Keep derived counts and live
queues in tools and candidate notes rather than policy. Temporary experiments
and scripts need not become permanent infrastructure.

## Verification

- Prose, links or organization with no behavior change: `pnpm check:docs`.
- Data and reviewed related content: `pnpm verify:data`; use changed-data checks
  while iterating.
- Code, schema, permissions or policy affecting behavior: `pnpm verify:ai`.
- Visual changes also need a browser check at narrow and wide widths and a
  concise record in `design/qa/design-qa.md` for material decisions.
- Deployment and account migrations follow the Operations preflight.

The full gate remains the release and CI safety net. During iteration, run the
smallest meaningful test that exercises the changed behavior, then the final
gate. A warning is work to assess, not a demand to invent missing facts.
