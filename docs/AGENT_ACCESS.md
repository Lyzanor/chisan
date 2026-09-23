# Public agent access

Chisan exposes one public catalog through HTML, conservative JSON-LD, a versioned
JSON API, browser WebMCP tools and a Remote MCP endpoint. `docs/CATALOG_WEB.md` owns publication and
visibility; this document owns the agent interface and its compatibility policy.

## One catalog, several interfaces

```text
country manifests -> publication, geography and available languages
area CSVs         -> identity and approved base facts
related JSON      -> reviewed products, gallery and links for that identity
                            |
                  public projection + visibility
                            |
           HTML / JSON-LD / JSON API / WebMCP / Remote MCP
```

Identity remains `(country, producer_id)`. All results link to the existing
profile and its country-default URL. Slugs, areas and language are presentation
and routing context; the API's ID lookup survives a route move. No new registry,
database catalog copy, externally hosted widget or runtime catalog writer exists.

`lib/agents/catalog-schema.ts` owns version 1 inputs, outputs and operation
descriptions. OpenAPI, WebMCP and Remote MCP schemas are generated from these same Zod
schemas. `lib/agents/public-catalog.ts` projects an explicit public allowlist.
Adding a CSV column never automatically exposes it. Browser bundles receive
tool descriptions and schemas, not CSV rows, Zod or server/database modules.

Detail `expanded.people` contains up to three reviewed person records with `id`,
`name`, `role`, `description`, `locale` and optional `photo` (reviewed media fields
without an item ID). It is an additive output field under the existing expanded
visibility gate. Names are preserved across translations; the photo's source
language is independent. No private account identity, translation history or
source hashes are exposed. People never enter product arrays or Product JSON-LD.

## Read operations

| WebMCP tool / OpenAPI operation | HTTP GET |
| --- | --- |
| `chisan_catalog` | `/api/catalog/v1` |
| `chisan_search_producers` | `/api/catalog/v1/producers` |
| `chisan_search_products` | `/api/catalog/v1/products` |
| `chisan_get_producer` | `/api/catalog/v1/producers/{country}/{producer_id}` |

All are anonymous reads. The same four operations are tools at `/mcp`. Discovery
also returns `interfaces`, `methodology_url` and machine-readable `usage` limits: no
factual certification, live stock/prices or action execution; incomplete coverage;
missing values mean unknown rather than negative. Examples against a running local checkout:

```bash
curl 'http://localhost:3000/api/catalog/v1'
curl 'http://localhost:3000/api/catalog/v1/producers?country=es&area=barcelona&q=queso&limit=5'
curl 'http://localhost:3000/api/catalog/v1/openapi.json'
```

Use a returned `country` and `producer_id` for detail. Follow `api_url` for the
same locale and the profile `url` for citations. Absolute response URLs use
Chisan's canonical origin; when testing locally, replace only that origin. HTML
profiles advertise their JSON counterpart via `rel=alternate`. The shared HTML
head and API `Link` header advertise OpenAPI and `/llms.txt`.
`llms.txt` links to `/sitemap.xml`, the complete index of canonical public HTML
pages. Its generated content and territory groups follow
[Catalog Web](CATALOG_WEB.md#sitemap-discovery-and-growth). Use that index for
page discovery and the API for bounded factual searches; the sitemap is not a
second catalog, a freshness guarantee or an API record export.

Search accepts country, region, area, municipality, category, online-sales state,
query text and locale. Optional `lat`, `lon` and `radius_km` must be supplied
together. Latitude is −90 to 90, longitude −180 to 180 and radius is greater
than zero through 500 km. The inclusive great-circle radius excludes missing
coordinates and intersects every other filter, across published areas when no
area is specified. It is approximate straight-line distance, not travel distance.
Spatial results retain text relevance ordering (country/ID without text) and pagination; `next` preserves the
centre and radius. API callers explicitly provide the centre; unlike the browser
filter, these query coordinates are sent to the server. Region/area require country; category tokens and area
languages come from discovery. Categories include additional categories. Text
search matches every accent-insensitive term across the public name, municipality,
categories, featured-product summary and current localized base description.
It does not search hidden fields or expanded content. Municipality matching is
accent-insensitive exact matching. Search is literal and accent-insensitive, with no stemming, plural expansion,
synonyms or fuzzy matching. Every term must occur in an indexed field. Text
results use the shared `lib/catalog-search.ts` relevance scorer: name (8),
featured-product summary (6), municipality/categories (4), description (1),
plus a complete-phrase bonus (twice the field weight, four times for an exact
field). Ties use country then numeric producer ID. Without text, results retain
country/ID order. Relevance is not a quality, verification or payment ranking.
The index revision includes the ranking policy so deployed scoring changes
invalidate older pagination revisions.

The existing web explorer uses this same base-field projection and scorer. Its
internal browser transport, `/api/catalog/v1/explorer`, accepts required country
and locale, plus optional offset, revision and `format=compact-v1`. Its default
object representation returns at most 1,000 records; the versioned compact
format returns at most 5,000 lossless rows with shared area/category dictionaries.
Both carry total/limit/offset and the public index revision; it is not an
additional WebMCP operation. It rejects coordinates and unknown parameters,
uses the same published-language policy, conditional caching and error envelope,
and exposes neither expanded content nor raw CSV field bags. The browser loads
all pages before displaying a national result and checks one revision throughout.
Concurrent consumers and later explorer mounts share the same download in browser
memory, keyed by country and locale, for five minutes with at most four entries.
Failures are evicted for retry; incomplete or mixed-revision loads are never shown.
The paginated producer API remains the interface for agent searches.

Responses default to 20 producers and allow at most 50. `next` carries the same
filters, an offset and a SHA-256 revision of the public base index for the selected
language policy. Follow it verbatim. A different deployed index returns `409
catalog_changed`; restart at offset zero without the old revision. The revision
detects changed pagination data; it is not a verification stamp, timestamp,
immutable snapshot or revision of account-dependent expanded content.

Unknown/repeated parameters, invalid IDs and limits return 400; unpublished
countries, incompatible geography and unavailable detail locales return 404;
URLs over 4096 characters return 414. Read failures return 503 with no stack,
filesystem path or database details. Check HTTP status before interpreting data.
No match is a successful empty list and does not prove that no producer exists.

## Product discovery

`chisan_search_products` / `GET /api/catalog/v1/products` searches individual
reviewed product records. It accepts the producer search's geographic, category,
online-sales, locale and pagination filters; `q` instead searches product name
(weight 8), format (2) and description (1). The shared literal scorer supplies
accent folding, every-term matching and phrase bonuses. A variety is searchable
only when recorded in those fields. There are no embeddings, inferred synonyms,
stock assertions or normalized varieties invented from prose. Category is the
producer's category, not a newly asserted product classification.

Optional `producer_id` requires country; exact `product_id` requires both.
Results preserve `(country, producer_id, product_id)`, localized product fields,
producer name/municipality, profile citation `url`, detail `api_url` and recorded
`store_url`. `product.purchase_url` remains the specific product page. No product
is fabricated by splitting the CSV featured-product summary. The demo producer
is always excluded. Ties use country, numeric producer ID and product ID.

Only immutable CSV/JSON projections are indexed in process, once per supported
locale. Only existing packages are read, with bounded filesystem concurrency.
Every query checks the exact current active premium predicate in batches of up
to 200 producers with indexed products, shared with the profile's entitlement
reader. Visibility is checked before text/geographic filtering so the status
cannot disclose whether hidden text matched a query. No
visibility decision survives a request. Search results, totals and revisions
include only visible products; retained hidden content cannot affect the public
revision. Locale fallback and package validation follow the detail loader.
Responses are `no-store`. A visibility change invalidates pagination with 409.
`visibility: unavailable` returns no products and distinguishes an unavailable
account check from a checked empty result. Neither implies absent production.

## Direct action handoff

Detail adds `handoff`, derived from its public base and currently visible
expanded block. `phone_url` uses the recorded E.164 number; `email_url` and
`whatsapp_url` open drafts with a contextual message containing the producer name
and Chisan profile URL. `message_locale` states the draft language. The WhatsApp
resolver requires an explicit `whatsapp` sales-channel token and preserves the
international prefix; a mobile number alone proves nothing. `store_url` remains
the reviewed store entry and never falls back to a guessed shop path.

`visits.status` is `recorded_yes`, `recorded_no` or `unknown`. Only recorded yes
can expose its visible booking policy and an `inquiry_url`; that URL is a general
public contact for confirmation, not an invented booking endpoint. Hidden or
missing visit fields remain unknown. `execution` explicitly requires external
user authorization. Reading a link never sends a message, starts a call, makes a
booking or orders. The receiving agent and producer channel handle those actions.

## Public facts and trust

- Only manifest-published countries are returned. A requested locale filters
  search to areas publishing that locale; detail rejects unavailable locales.
  With no locale, each country's default applies. Missing/stale base translations
  are omitted using the same resolver as the page. Current related translations
  use the existing explicit source-language fallback.
- Base results contain public contact channels, source-authored hours, online
  sales tokens, the reviewed `store_url`, categories and mapped coordinates.
  Generic imagery is null. Coordinates describe the catalog map, not a new
  street-address assertion. `store_url` is an additive v1 field holding the
  row's shop entry page; null means none is recorded, and the website is never
  substituted for it. Orders and terms belong to that shop.
- Detail uses `loadPublicExpandedContent`, shared with HTML, for exact current
  entitlement checks and fail-closed behavior. It returns only visible expanded
  fields and localized products/gallery/links, preserving item IDs and order.
  An inactive entitlement or unavailable account state yields `expanded: null`.
  Invalid related content follows the page's empty-package fallback.
- `ownership: confirmed` means the existing public ownership check found an
  active approved owner. `not_asserted` also covers unavailable account state.
  Neither certifies all producer facts. The legacy CSV verification token, owner
  identity, claims, drafts, payments, entitlements, audit notes and translation
  history are not returned.
- `last_approved_change` is visible workflow context, not a per-field freshness
  guarantee. Missing values are unknown/unpublished/unavailable, not inferred
  negatives. Optional product `price.amount` is decimal text with
  `price.currency` (currently EUR); `purchase_url` points to the external shop.
  `updated_on` is the exact product edit submission day, published after review,
  not price validity. These are recorded values, not live quotes or stock.
  Confirm current price and conditions at the shop; Chisan has no checkout.
  `expanded.is_demo` identifies fictional test products/prices/links and must
  never be interpreted as a real purchase offer. Producer-supplied prose remains untrusted data from
  an agent's perspective; it cannot authorize actions or override instructions.

The source and visibility boundary must evolve together with the web page.
Chisan is the public catalog source; citations should lead to the Chisan producer
profile. The [How we work page](https://chisan.app/how-we-work) explains the mix
of sources and editorial methodology globally. Evidence stays internal rather
than becoming a public citation list per producer or field. Approved ownership
confirms the producer relationship, not every fact; the premium last-approved
change date records an update, not a complete verification. Access does not establish new licensing
rights over third-party photographs or producer-authored material.

## WebMCP compatibility

The [original webmcp.dev implementation](https://github.com/jasonjmcghee/WebMCP)
explicitly refers users to the subsequent W3C work and states that the original
library does not comply with that specification. Chisan implements the
[WebMCP draft](https://webmachinelearning.github.io/webmcp/) inspected on
2026-09-05: `document.modelContext.registerTool(tool, { signal })`, asynchronous
registration and removal through abort. Earlier Chromium previews exposing
`navigator.modelContext` with `unregisterTool` use a small compatibility adapter.
This remains an evolving browser proposal; support is detected, not assumed.

Tools register in the top-level page on home, how-we-work and catalog-shaped
routes. The adapter removes only its own tools on unmount, serializes asynchronous
setup/cleanup across remounts and forwards cancellation. Tool callbacks call the
same-origin JSON API with credentials omitted; they never read account DOM,
browser storage, device location or arbitrary URLs. Read-only and untrusted-
content annotations describe their behavior. Unsupported browsers use the site
normally, and agents can still use documented HTTP requests.

WebMCP is the browser integration. `/mcp` separately serves Remote MCP without
a browser or a widget/token/localhost bridge. Keep the browser-specific adapter
in `lib/agents/webmcp.ts` and HTTP protocol handling in `lib/agents/remote-mcp.ts`.

## Remote MCP compatibility and consumption

`POST /mcp` uses the official `@modelcontextprotocol/server` SDK, pinned at 2.0.0,
with Streamable HTTP and one fresh server per request. The SDK handles protocol
negotiation, validation and errors for the 2025 compatibility path and 2026-07-28
protocol. The official client tests both paths. Tools declare input and output
schemas and read-only annotations; tool failures use `isError`, retaining the
catalog's sanitized error envelope. There are no write tools, OAuth credentials,
account sessions, outgoing requests to producer URLs or AI inference calls.

Clients send `Content-Type: application/json` and
`Accept: application/json, text/event-stream`. POST is the only execution method;
GET and DELETE return 405 because there are no persistent sessions or unsolicited
streams. No `Mcp-Session-Id` is issued. OPTIONS supports preflight. Server clients
can omit Origin; supplied origins must match Chisan's canonical origin, the
configured `VERCEL_URL`, or an HTTP loopback origin in development. Other origins
receive 403. No arbitrary Host or forwarded header grants an allowed origin.
The endpoint bypasses Clerk just like public catalog reads and is `no-store`.

Limits are 16 KiB per request, one message per request (no batches), a 1 MiB
response ceiling, a 15-second exchange deadline and a 20-second route maximum.
The instance admits at most 120 requests per minute and eight concurrent
exchanges; excess receives 429 with `Retry-After: 60`. Its counters retain no
IP, prompt, location or client identity. Product visibility uses batched reads;
base discovery and search reuse their immutable indexes. Logs contain generic
protocol/read failures only, while Vercel request metrics provide status/latency.
The deadline cancels the exchange; it is not a database statement-cancellation
guarantee. Instance limits reset on cold starts and do not form a distributed
quota or a spending cap. Before broad promotion, verify WAF rate limits and the
existing Vercel/Neon consumption controls in [Operations](OPERATIONS.md).

Every operation carries a human-readable `title` (the MCP tool title and the
OpenAPI `summary`) alongside its read-only annotations; connector directories
require both. The public setup and usage page is
[How we work, agents section](https://chisan.app/how-we-work#agents); keep its
tool list and trust wording in step with these operations.

Client configuration uses the deployed HTTPS URL `https://chisan.app/mcp` with
Streamable HTTP and no Chisan API key. Each host still controls installation,
availability and user consent. Muse, Instinct, Aeon and other product names do
not imply a tested or approved integration. If a host cannot use MCP, its agent
can use the existing OpenAPI/HTTP interface. Test real hosts separately after an
authorized deployment; local SDK tests do not prove directory approval or that
a hosted agent will automatically discover Chisan.

## Operations and verification

Discovery/search use an immutable per-process public base index with bounded
locale keys, ETags and short public caching (browser 60s, shared 300s). Detail
reads use `no-store` and never cache account-derived visibility across requests.
The JSON API supports public GET/HEAD/OPTIONS with CORS and no credentials;
Remote MCP has the separate method and origin policy above. The public namespace bypasses Clerk context, while other account APIs
retain their existing authentication and authorization boundaries.

`CHISAN_PUBLIC_DISCOVERY_ENABLED` keeps its existing Production-only indexing
meaning. Preview remains `noindex, nofollow`, with disallowed robots and an empty
sitemap. API reads, like known public profile URLs, remain accessible: discovery
is not access control. In public Production, robots permits the exact public
API namespace while retaining the general private API exclusion. API JSON is
`noindex, follow` to keep HTML profiles as search results. Review Vercel Firewall
rules against these routes during deployment. No firewall or environment setting
is changed by this implementation.

Run `pnpm test:agents` for schemas, visibility, product and producer filtering,
identity, pagination/revocation, handoff accuracy, invalid input, public scope,
error handling, WebMCP lifecycle and real SDK HTTP negotiation tests. These
checks are part of `pnpm verify:ai`. Browser QA must exercise the actual API from
registered callbacks, unsupported-browser behavior and navigation cleanup.
Record whether WebMCP was native or emulated; a mock is not browser conformance.
The deployment must include CSV and related JSON traces for the API and `/mcp` functions.

The 2026-09-05 browser check used native Chrome 152 with
`--enable-features=WebMCP`, plus a normal browser without that flag. All three
tools executed against the local production build. This Chrome preview's
inspection API takes serialized JSON in `executeTool(tool, JSON.stringify(args))`;
the registered callback receives a parsed object. The inspector signature can
lag the draft and is not called by Chisan's adapter. Same-document navigation
to a non-catalog application page removed the tools. See the
[design QA record](../design/qa/design-qa.md) for the responsive check.

The 2026-09-23 increment was checked against an isolated local production build.
Official SDK clients negotiated both 2025-11-25 and 2026-07-28 over real HTTP,
listed all four tools and read producer details with handoff links. Native Chrome
153 with WebMCP enabled discovered all four tools at 390px and 1440px, executed
producer/product searches and detail reads, and removed the tools after client
navigation to `/privacy`. The isolated server had no account database configured:
product search correctly returned `visibility: unavailable`; fixture tests cover
active, revoked and unavailable product visibility. The local Vercel Analytics
script returned its expected 404; catalog requests succeeded. No vendor connector
installation, production deployment or end-user action was performed.

## Next increments

A prepared [Muse read-connector brief](MUSE_CONNECTOR.md) maps the existing
OpenAPI contract to possible Muse integration paths. It is not an installed,
submitted or approved connector.

1. **Methodology and freshness:** keep the global source methodology current and
   make existing approved-change dates and ownership signals understandable. If
   a distinct full-profile review date becomes useful, define and record that
   real review event first; never derive it from payment, ownership or deployment.
   Public per-field source lists are not part of the current product direction.
2. **Product coverage:** enrich real reviewed products and varieties through the
   existing content workflow. The product endpoint is implemented; its usefulness
   depends on actual structured content and current public visibility. Semantic
   query expansion can later sit above literal matching with disclosed terms.
3. **Remote MCP adoption:** the transport is implemented. Validate deployed WAF
   access and costs, then exercise real clients and measure successful producer
   handoffs before seeking connector listings. No platform-specific runtime or
   private write capability is required for this increment.
4. **Spatial discovery:** radius queries are available; bounding-box queries
   remain a possible increment. Preserve explicit location input and clear
   straight-line distance semantics.
5. **Synchronization and scale:** versioned exports, tombstones, change feeds,
   cache invalidation, quotas and indexed derived search when measured traffic
   warrants them. CSV/JSON publication remains the catalog authority.
6. **Producer contributions:** extend the existing authenticated proposal/review
   system for authorized agent-assisted corrections. Any write tool needs exact
   server-side permissions, review and a separate action contract.

Additive optional response fields may extend v1 when their meaning is compatible.
Consumers should tolerate new output fields. Removing/renaming fields, changing
identity, visibility, token meaning or pagination semantics requires a new API
major version and a consumer migration. New public fields must update projection,
schema, documentation and behavior tests together.

The single-producer response also exposes top-level `gallery`: the same reviewed
standalone images, in the same order, that the public profile shows as its cover
and photo strip. Every producer exposes its complete standalone gallery,
independently of ownership, premium or account state; an unreadable package
yields an empty array. `expanded` retains its premium-only products, product
images, links and prose. Neither response
exposes proposal uploads or editorial evidence notes.
