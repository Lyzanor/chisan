# WhatsApp producer assistant

The cross-channel review and publication map is
[Editing intake and publication](EDITING_WORKFLOW.md).

## Model and reasoning configuration

`OPENAI_API_KEY` authenticates the project. It does not select intelligence.
`CHISAN_WHATSAPP_MODEL` selects the model for each Responses API request;
`CHISAN_WHATSAPP_REASONING_EFFORT` optionally selects its reasoning effort.
Supported values depend on the model. The adapter accepts `none`, `minimal`,
`low`, `medium`, `high`, `xhigh`, `max`; this does not mean every model supports
all of them. Empty omits the parameter and uses the model's default. An invalid
setting fails closed; an unsupported model/effort pair must be caught by the
real provider smoke test before activation.

`CHISAN_WHATSAPP_MAX_OUTPUT_TOKENS` defaults to 4096 and accepts 1024–16384.
The budget includes reasoning and visible output. The pilot retains its bounded
30-second request timeout: high reasoning settings may exhaust either budget
without returning usable data. Refused/incomplete output never becomes a
proposal, and earlier candidate data survives. Do not raise concurrency or
timeouts without revisiting the transactional worker budget.

Select a model supporting images and strict structured outputs. Evaluate it
with incomplete prices, ambiguous names, corrections, relative dates, photos
and hostile instructions before changing the live configuration. Record costs,
latency and factual errors during that isolated evaluation. Model upgrades are
configuration changes; new editing capabilities still need schemas, permission
checks, review diffs and tests. Successful extraction steps preserve the model,
provider, effort, output budget and versioned prompt in the submission audit trail.
OpenAI configuration and transport live in `lib/intake/openai.ts`; Meta
configuration is separate. The current environment variable names remain
compatible with the initial pilot setup. The runtime selects the adapter in
one place, while shared extraction validation stays in `lib/intake/extractor.ts`.

## Pilot scope

The assistant prepares **one new product at a time**, using text or a JPEG/PNG
photo received through Meta's WhatsApp Cloud API. It extracts a public name,
description, explicit format, EUR price and shop URL, asks for missing or
ambiguous facts, and automatically submits an existing Chisan producer-change
request when enough information is available. There are no confirmation codes,
yes/no approval prompts or next-step commands in the product conversation. Editorial review, entitlement checks and Git publication still apply.
Nothing writes to CSV, public content JSON or public images from a request.

This is an implementation awaiting provider configuration, not an active phone
number. It is off unless `CHISAN_WHATSAPP_ENABLED=true` and accounts are ready.

An explicit launch day is stored as `launchOn` in the private submission audit
and in the reviewer's author note. It is **not** `updated_on`, a stock claim, a
public availability field or scheduled publication. `hoy`, `mañana` and
`pasado mañana` resolve from the original WhatsApp message timestamp in the
linked producer's selected Madrid/Canary time zone; follow-ups preserve the
resolved day. Product edit dates retain their existing server-owned semantics.

Photos provide readable label facts for the proposal. The model does not infer
ingredients, certifications or provenance from appearance, and the binary is
not attached to the public product. Image publication, audio, multiple-product
batches, edits/deletions of existing products, base profile edits, reminders,
inventory, orders and automatic publication are outside this pilot.

## Producer flow

1. Open `/cuenta/whatsapp` with an active Chisan account. Choose an existing
   managed Spanish producer and the appropriate time zone. The producer must
   have the exact active `producer.profile.premium` entitlement, as in the
   existing product editor. The pilot does not create an entitlement.
2. Accept the explanation of Meta/OpenAI processing. Generate the single-use,
   ten-minute linking URL, open it in WhatsApp and send its prepared message.
   Only its hash is stored in the link table. Do not share this capability URL.
3. Describe a new product or send a legible photo (JPEG/PNG, up to 5 MiB).
   Answer a short question only if a necessary fact is missing. Complete text
   or photo input goes straight to editorial review with a brief receipt.
4. Continue naturally: “perdón, son 7 euros”, “¿cómo va?” or “mejor descártalo”.
   The AI returns a typed intent; Chisan validates and dispatches it. Corrections
   to a pending proposal withdraw the old version and submit a replacement in
   one transaction, preserving the history. An ambiguous correction withdraws
   the inaccurate pending version while asking for clarification. A failed
   replacement rolls back the withdrawal. An approved/applying/applied proposal
   cannot be overwritten or withdrawn through conversation.
5. `/cuenta/cambios` retains all versions. The account page disconnects the
   channel. Legacy command aliases remain accepted for compatibility but are
   never required or presented as the product interaction.

Example: “tenemos una cerveza nueva, 8 euros, sale mañana” asks for the public
name and price format. “Se llama Brisa, botella de 75 cl” submits automatically.
“Perdón, son 7 euros” replaces the pending proposal automatically. The model
never decides editorial approval or publication. Photo text cannot invoke
status/cancellation/help controls without an accompanying textual request.

One account binds one WhatsApp sender to one producer for 30 days. Generating a
new link replaces its previous binding and pending conversation. Each operation
rechecks the active account, exact producer membership and premium entitlement;
knowing a name, catalog telephone or producer ID does not confer authority.

## Runtime and recovery

`POST /api/webhooks/whatsapp` checks the HMAC of the original bounded request
body and the configured business phone ID. It stores only normalized messages,
deduplicated by Meta message ID, before acknowledging. Next.js `after` triggers
processing immediately. Status-only webhook events are acknowledged without
starting inference. The GET endpoint implements Meta's verification challenge.
Setting `WHATSAPP_VERIFY_TOKEN` allows this read-only handshake before activation,
even with accounts disabled. It does not receive messages, access the database,
run inference or prove that the processing pipeline is live. POST intake remains
unavailable until the assistant is enabled. Leave the Meta `messages` subscription
off until the receiving environment and recovery worker are ready.

The private PostgreSQL inbox is the durable recovery boundary. Processing is
serialized per sender and per linked account; a candidate, any withdrawn/replacement
producer-change request and inbox completion commit together. A bounded worker
handles four messages and eight replies per invocation. This finite pilot holds
database locks during a bounded model call (30 seconds plus bounded image
fetches). Before scaling, separate inference from transactional commits using
versioned job leases. Do not increase concurrency blindly.

The existing submission service supplies validation, publication hashes, active
permissions, submission limits, open-proposal uniqueness and review history.
An unrelated editor draft is never adopted or overwritten. A catalog change
after extraction requires starting again. A failed model/image read preserves
the previous candidate and asks the producer to retry.

Replies use a persistent outbox in the same inbox record. A failed send remains
pending. An uncertain network result after Meta accepts a reply can repeat that
reply on retry; it cannot repeat the proposal. Free-form replies stop 24 hours
after the original incoming message; this pilot never initiates template or
marketing conversations. The worker processes at most 50 incoming messages per
sender per rolling day for AI and 12 extraction turns per product. Commands do
not call the model. Database and provider spending limits remain necessary for
the live pilot.

`GET /api/whatsapp/process` requires an exact `Authorization: Bearer` match to a
nonempty `CRON_SECRET`. It recovers pending work and removes inbox records older
than seven days and expired bindings. **Configure a scheduler before activation**:
call this endpoint every five minutes. With a compatible Vercel plan, add a
`crons` entry for this path with schedule `*/5 * * * *` to `vercel.json` at
activation. It is intentionally not registered while this integration is
unprovisioned. Vercel Hobby permits only daily cron; use a suitable existing
scheduler or plan, rather than deploying an unsupported schedule.

Keep the recovery job monitored. A 503 means the durable work remains pending;
inspect database/provider availability without logging phone numbers, messages,
tokens, images or provider error bodies. Repeat the authorized worker call once
the failure is fixed. For a full shutdown, drain or erase private pending work,
remove bindings and stop the scheduler. Disable the feature flag to stop new
work; do not describe retention as operating while its worker is stopped.

## Data handling

PostgreSQL owns private sender bindings, conversation candidates and delivery
receipts. These tables are not public catalog or agent API sources. Raw message
text/image references are removed after processing; image bytes are fetched
only from the authenticated Meta media endpoint, verified, normalized without
metadata, passed to OpenAI as inline JPEG and discarded. Failed unprocessed
messages/receipts are deleted after seven days by the recovery worker. Responses
use `store: false`; no remote conversation, previous-response ID or model tools
are used. This does not promise zero retention by either provider.

Candidate context is usable for 24 hours and removed with binding expiration
or disconnection. Automatically submitted structured facts remain in the ordinary proposal
and audit lifecycle. They are producer statements requiring editorial review,
not a fabricated public source or inferred image license. Link/proposal audit
events contain identity references, extractor/provider metadata and structured launch dates, not chat text,
phone numbers or secrets. Account suspension/deletion or membership/entitlement
revocation immediately prevents further channel use when checked by the server.

## Activation checklist

1. Complete [Operations](OPERATIONS.md) preflight. Apply
   `0015_whatsapp_assistant.sql` in an isolated database first, then use the
   approved migration process for the target. Run `pnpm db:assert-current`.
2. Create a Meta business app with WhatsApp Cloud API and a test phone before
   enrolling the real Chisan number. Configure the phone-number ID, digits-only
   international business number, supported Graph API version, app secret,
   webhook verification token and access token with the required WhatsApp
   messaging access. Never paste secrets into Git or chat.
3. Set `OPENAI_API_KEY` and explicitly select `CHISAN_WHATSAPP_MODEL` supporting
   Responses API image inputs and strict JSON-schema outputs. There is no
   implicit model or live paid test during repository verification.
4. Set a random `CRON_SECRET`; register and verify the recovery scheduler above.
   Configure provider spending limits and operational log alerts. Preview/test
   must use isolated database, account and Meta resources.
5. Enable the flag in the isolated environment. Configure the HTTPS callback
   `/api/webhooks/whatsapp`, verify the challenge, subscribe to `messages` and
   subscribe the Meta app to its WhatsApp Business Account.
6. With a test producer membership and entitlement, verify account linking,
   real text extraction, real photo extraction, necessary clarification, automatic submission,
   natural corrections/cancellation/status, the admin review queue, duplicate delivery, revocation,
   retries and disconnection. No production rollout is proven by mocked tests.
7. Follow Operations for a reviewed production activation. No Meta number,
   provider resource, database migration, scheduler or deployment is created by
   merely merging this implementation.

## Verification and sources

`pnpm test:whatsapp` runs deterministic protocol, extraction-adapter and isolated
PostgreSQL workflow tests without provider calls. `pnpm verify:ai` includes this
suite. Before activation, the real provider smoke test above remains mandatory.

- [Meta Cloud API collection](https://www.postman.com/meta/whatsapp-business-platform/documentation/wlk6lh4/whatsapp-cloud-api)
- [Meta webhook signature and challenge reference](https://whatsapp.github.io/WhatsApp-Nodejs-SDK/api-reference/webhooks/start/)
- [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [OpenAI reasoning configuration and token budgets](https://developers.openai.com/api/docs/guides/reasoning)
- [OpenAI image inputs](https://developers.openai.com/api/docs/guides/images-vision)
- [Next.js after](https://nextjs.org/docs/app/api-reference/functions/after)
- [Vercel cron scheduling limits](https://vercel.com/docs/cron-jobs/usage-and-pricing)
