# Editing intake and publication

This is the operational map for changes arriving through different channels.
[Account System](ACCOUNT_SYSTEM.md) owns authorization and proposal contracts;
[Operations](OPERATIONS.md) owns publication and recovery. A deployed AI
extractor is an input adapter with no catalog-writing or editorial-approval
authority. Repository contributors doing editorial research follow
[Editorial](EDITORIAL.md).

## Where to adapt a change

| Change | Owner and affected adapter |
| --- | --- |
| Product field name, type or constraint | `lib/catalog/content-schema.ts` and `lib/catalog/product-commerce.ts`; intake reuses their schemas in `lib/intake/product.ts` |
| Product field becomes available to the agent | `PRODUCT_INTAKE_FIELD_POLICY` in `lib/intake/product.ts`, candidate schema/mapping, product editor and review diff; the exhaustive policy makes added/renamed canonical fields fail type checking until classified |
| CSV field or permission | `lib/accounts/producer-fields.ts`, shared submission/review and the CSV contract; WhatsApp news uses `lib/intake/news.ts` and the shared expanded-field definitions; other base fields are not exposed |
| Natural conversation or ambiguity handling | `lib/intake/extractor.ts` owns the provider-neutral interpretation schema, instructions and version; `lib/whatsapp/service.ts` owns conversation state and dispatch |
| AI provider | Implement `StructuredAIProvider` in `lib/ai`, select it in `lib/ai/runtime.ts`, and update processing consent and activation tests; product and shelf services retain their own validation |
| OpenAI API/model options | `lib/ai/openai.ts` (the old intake exports remain compatible); provider-specific options do not constrain other extractors or the audit vocabulary |
| Meta protocol, media or delivery | `lib/whatsapp/meta.ts`, webhook route and `lib/whatsapp/config.ts`; Meta configuration does not require OpenAI credentials |
| Channel provenance shown to reviewers | `lib/accounts/producer-change-intake.ts` and `components/admin/producer-change-intake.tsx`; retain older record versions |
| Catalog publication | Existing shared submission/review and `lib/editorial/**`; no provider-specific publication path |

A display-label or layout change does not change a field's identity. Change the
owning schema first when its meaning or key changes, then inspect its consumers
with `rg` and run the matching behavior checks. Reusing field constraints does
not automatically authorize a newly added field: the explicit intake policy
keeps that editorial decision visible.

Only the OpenAI adapter is implemented today. Replacing it requires a concrete
adapter and validation, not a rewrite of catalog authority or review. The web
editor, database proposals and Git publication remain independent of the AI
provider. The previous `lib/whatsapp/domain.ts` and `extract.ts` exports remain
compatibility entry points; new shared consumers import from `lib/intake`.
`lib/ai/structured.ts` defines bounded text/image requests and responses carrying
an unknown structured value, nullable numeric token usage and an optional request
identifier; providers have no database handle or tools. `lib/ai/allowance.ts`
owns the shared committed call ledger. Product extraction and shelf detection
build their own prompts/schemas around an injected provider. A channel only
authenticates and normalizes an input before submitting it to its domain service.
There is no provider registry, external queue service or generalized agent framework.

Shared `CHISAN_AI_PROVIDER` (currently only `openai`), `CHISAN_AI_MODEL`,
`CHISAN_AI_REASONING_EFFORT`, `CHISAN_AI_MAX_OUTPUT_TOKENS` and
`CHISAN_AI_MAX_TOTAL_CALLS` configure the composition boundary. Nonempty shared
settings override the corresponding legacy `CHISAN_WHATSAPP_*` settings; absent
settings preserve them. Credentials belong to each adapter (`OPENAI_API_KEY`
today). The historical ledger action/target/lock stay unchanged, so deployment,
channel changes or moving configuration cannot reset earlier spending. New
capabilities obtain a metered provider through `createAIProvider(database,
capability)`: the common wrapper reserves from this ledger before every
request. Low-level adapters are transport boundaries for that factory and tests.
The wrapper records `ai.request_completed` or `ai.request_failed` in private audit,
including capability, provider/model, duration, reported input/output/cache/reasoning
tokens and allowlisted failure diagnostics. Shelf attempts reference their photo;
other capabilities retain their capability target. No prompt, image, raw response
or provider error message enters these events. Missing usage remains unknown,
including network interruptions; incomplete output can still consume tokens.
The committed attempt limit counts failures and is not a token or currency budget.

Shelf processing claims and commits work before inference, then applies the
result only to that same pending version. New uploads enter `queued` and schedule
one bounded attempt within the shared allowance. WhatsApp can process one queued
shelf job after inbox handling. The model transcribes labels; catalog resolution
creates an owner proposal without adding favorites or publishing. The owner
chooses producers and publishes from `/cuenta/estanteria`. Staff can resolve
unclear/no-match results in `/admin/estanterias`, prepare a proposal or explicitly
retry. A processing attempt older than two minutes becomes manual review on the
next queue run. There are no automatic retries of paid failures or new recurring
workers. Accuracy needs representative real-photo evaluation before broad rollout.
For shelf localization, inference receives a temporary copy with a normalized
coordinate grid and the image dimensions. The grid is a visual aid only: it does
not place points or identify producers. Both axes keep the original pixel frame;
the stored and displayed owner photo stays unchanged. The model places hotspots
on printed product labels, excluding price cards and shop signs. This preprocessing
belongs to the shelf domain and does not couple another capability to a provider.
The review page refreshes queued/processing results automatically, shows the
remaining shared allowance and recent API attempts, and puts manual point editing
behind optional corrections. The server rejects exhausted-allowance retry requests
without replacing the saved failure or scheduling another attempt. The provider
reservation still enforces the limit atomically when concurrent work starts.

## Entry points

| Entry | Authority and stored record | Review | Canonical publication |
| --- | --- | --- | --- |
| Producer web editor | Active exact membership; premium entitlement for expanded fields/products; `producer_change_requests` | `/admin/cambios` | Existing controlled materializer |
| WhatsApp text or photo | Expiring account binding, same membership and entitlement checks; automatically extracted product or news candidate becomes `producer_change_requests` | Same `/admin/cambios`, including structured channel and extraction history | Same controlled materializer |
| Shelf, plan or programme image from web or messaging | Active shelf capability and explicit publication consent; `selection_shelves` | Owner correction and confirmation in `/cuenta/estanteria`; optional event request; staff fallback in `/admin/estanterias` | Account presentation in PostgreSQL, never catalog facts |
| Community suggestion | Verified active account, unclaimed producer, scoped standard fields; `producer_suggestions`; no ownership rights | `/admin/sugerencias` | Editorial file edit and release; reviewer records the result afterward |
| Editorial research | Evidence-backed editorial decision | [Editorial workflow](EDITORIAL.md) | Reviewed file edit, validation, Git and deployment |

The WhatsApp pilot creates **new products or news proposals**. News maps to
`mensaje a la comunidad` and its original-language field; the materializer owns
`fecha novedades`. It does not yet edit existing products or other base fields. A photo supplies legible facts for review;
publishing the photo itself requires the existing media/rights workflow.
Community suggestions retain a separate record and manual publication process
because they do not carry producer authorization.

## Producer proposal checkpoints

1. **Capture and clarify.** The adapter resolves known fields and asks for
   missing or ambiguous information. Conversation state is private and is not
   a submitted proposal. Web drafts are explicitly saved proposal drafts.
2. **Submit.** WhatsApp submits automatically when the necessary facts are
   available, without a confirmation prompt; the web editor retains its submit
   action. Both use
   `createProducerChangeSubmissionService`: allowlisted fields, schema checks,
   exact permissions, premium checks, base hashes, limits and one open proposal
   per author/producer. A web draft is not silently reused by WhatsApp.
3. **Review.** The administrator sees the author, source, requested changes,
   current catalog comparison and private context. Approve or reject with a
   reason. Rejection closes the request; correction currently means submitting
   a replacement. WhatsApp corrections automatically withdraw and replace a
   still-pending version in one transaction. An incomplete correction retracts
   the inaccurate pending version while asking for the missing fact. Approval
   closes this automatic correction window. `needs_changes` remains reserved.
4. **Prepare files.** Approval permits the operator to run
   `pnpm producer:change materialize <request-id>`. The materializer rechecks
   permissions and both hashes, obtains execution locks, and refuses conflicting
   file changes. CSV owns base fields; `data/content/<country>/<id>.json` owns
   products/gallery/links. Related changes are prepared together.
5. **Validate and commit.** Inspect the diff, evidence and affected translations;
   run the applicable gates. Commit the exact approved files and assets. Run
   `pnpm producer:change finalize <request-id> <full-commit-sha>`: finalization
   checks the approved CSV/content state in the commit and current HEAD.
6. **Release.** Push and verify deployment using Operations. For producer
   changes, `applied` means the canonical commit was recorded; it does **not**
   prove a production deployment. This pilot does not automatically push,
   deploy, or notify producers when a release finishes.

A stated launch date remains private review context. It does not schedule a
release or replace the server-owned date of the approved change.

## Provenance and failures

The submission audit event records a versioned `intake` object in the same
transaction as the proposal. The server selects `web` or `whatsapp`; form data
and AI output cannot select it. WhatsApp version 2 includes the incoming message reference, any replaced
request ID, candidate fingerprint, launch date and each successful extraction's model,
provider, reasoning setting, output budget and prompt version. No API keys, sender phone
numbers, raw conversation or image bytes enter this record. Earlier version 1 WhatsApp records retain their explicit confirmation metadata;
version 2 does not claim producer confirmation. Historical proposals without
this metadata remain explicitly unclassified. The private admin detail
and `producer:change show --json` expose the same validated provenance.

| Failure | Result and recovery |
| --- | --- |
| Repeated Meta event or unchanged candidate facts | Durable receipt and candidate fingerprint prevent a second proposal |
| Incomplete/refused AI output, invalid schema or unreadable photo | Previous candidate remains; safe diagnostic category enters audit/logs; no automatic retry or budget refund |
| Producer corrects a pending version | Withdraw the previous version and create a replacement atomically; retain both in audit |
| Concurrent web draft or open proposal | Submission is blocked; resolve it in the account first |
| Changed catalog/content or revoked permission | Stop submission/publication; inspect conflict and prepare a fresh proposal |
| Failed reply delivery | Persistent outbox retries within the response window; uncertain sends may duplicate a reply, never a proposal |
| Abandoned publication | Use the leased execution recovery commands in Operations |

More capable models cannot remove editorial responsibility or make every
extraction correct. Add future channels by mapping their input into these
contracts. Add new write capabilities with explicit schemas, permissions,
review diffs and behavior tests before exposing them to an agent.

## Verification before activation

`pnpm test:whatsapp` exercises natural text/photo intake through automatic
submission, news-only field mapping, correction, cancellation, admin review,
actual CSV/content preparation, a disposable Git commit and database
finalization. It checks stale/duplicate input and mismatched publication hashes.
The shared editor tests also verify that form data cannot spoof the channel.
The same workflow runs with a substitute extractor, including malformed-output
rejection. These tests run without real provider calls or changes to the working catalog.

Complete the real Meta/OpenAI and recovery smoke tests in
[WhatsApp Assistant](WHATSAPP_ASSISTANT.md) before enabling the pilot. Production
activation, database migration and deployment remain separate operational work.

Image intake can also prepare an account-owned event proposal. The owner request,
chosen roster and editorial export are defined in [Events](EVENTS.md#account-proposals-from-images).
The same private extraction and shared image/map presentation are reused; personal
follows remain unrelated to the selection roster.
