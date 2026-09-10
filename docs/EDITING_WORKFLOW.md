# Editing intake and publication

This is the operational map for changes arriving through different channels.
[Account System](ACCOUNT_SYSTEM.md) owns authorization and proposal contracts;
[Operations](OPERATIONS.md) owns publication and recovery. An external agent is
an input adapter, not a catalog writer or editorial approver.

## Where to adapt a change

| Change | Owner and affected adapter |
| --- | --- |
| Product field name, type or constraint | `lib/catalog/content-schema.ts` and `lib/catalog/product-commerce.ts`; intake reuses their schemas in `lib/intake/product.ts` |
| Product field becomes available to the agent | `PRODUCT_INTAKE_FIELD_POLICY` in `lib/intake/product.ts`, candidate schema/mapping, product editor and review diff; the exhaustive policy makes added/renamed canonical fields fail type checking until classified |
| CSV field or permission | `lib/accounts/producer-fields.ts`, shared submission/review and the CSV contract; WhatsApp does not currently edit base fields |
| Natural conversation or ambiguity handling | `lib/intake/extractor.ts` owns the provider-neutral interpretation schema, instructions and version; `lib/whatsapp/service.ts` owns conversation state and dispatch |
| AI provider | Implement `ProductExtractor`; select it in `lib/whatsapp/runtime.ts`, configure its credentials and update the named processing consent and activation tests |
| OpenAI API/model options | `lib/intake/openai.ts`; provider-specific options do not constrain other extractors or the audit vocabulary |
| Meta protocol, media or delivery | `lib/whatsapp/meta.ts`, webhook route and `lib/whatsapp/config.ts`; Meta configuration does not require OpenAI credentials |
| Channel provenance shown to reviewers | `lib/accounts/producer-change-intake.ts` and `components/admin/producer-change-intake.tsx`; retain older record versions |
| Publication | Existing shared submission/review and `lib/editorial/**`; no provider-specific publication path |

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
There is no provider registry, new queue service or generalized agent framework.

## Entry points

| Entry | Authority and stored record | Review | Canonical publication |
| --- | --- | --- | --- |
| Producer web editor | Active exact membership; premium entitlement for expanded fields/products; `producer_change_requests` | `/admin/cambios` | Existing controlled materializer |
| WhatsApp text or photo | Expiring account binding, same membership and entitlement checks; automatically extracted new-product candidate becomes `producer_change_requests` | Same `/admin/cambios`, including structured channel and extraction history | Same controlled materializer |
| Community suggestion | Verified active account, unclaimed producer, scoped standard fields; `producer_suggestions`; no ownership rights | `/admin/sugerencias` | Editorial file edit and release; reviewer records the result afterward |
| Editorial research | Evidence-backed editorial decision | [Editorial workflow](EDITORIAL.md) | Reviewed file edit, validation, Git and deployment |

The WhatsApp pilot creates **new products only**. It does not yet edit existing
products or base profile fields. A photo supplies legible facts for review;
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
| Repeated Meta event or unchanged product facts | Durable receipt and candidate fingerprint prevent a second proposal |
| Incomplete/refused AI output, invalid schema or unreadable photo | Previous candidate remains; producer can retry |
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
submission, correction, cancellation, admin review,
actual CSV/content preparation, a disposable Git commit and database
finalization. It checks stale/duplicate input and mismatched publication hashes.
The shared editor tests also verify that form data cannot spoof the channel.
The same workflow runs with a substitute extractor, including malformed-output
rejection. These tests run without real provider calls or changes to the working catalog.

Complete the real Meta/OpenAI and recovery smoke tests in
[WhatsApp Assistant](WHATSAPP_ASSISTANT.md) before enabling the pilot. Production
activation, database migration and deployment remain separate operational work.
