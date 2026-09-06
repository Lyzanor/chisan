# Public agent access

Chisan exposes one public catalog through HTML, conservative JSON-LD, a versioned
JSON API and browser WebMCP tools. `docs/CATALOG_WEB.md` owns publication and
visibility; this document owns the agent interface and its compatibility policy.

## One catalog, several interfaces

```text
country manifests -> publication, geography and available languages
area CSVs         -> identity and approved base facts
related JSON      -> reviewed products, gallery and links for that identity
                            |
                  public projection + visibility
                            |
           HTML / JSON-LD / JSON API / WebMCP tools
```

Identity remains `(country, producer_id)`. All results link to the existing
profile and its country-default URL. Slugs, areas and language are presentation
and routing context; the API's ID lookup survives a route move. No new registry,
database catalog copy, externally hosted widget or runtime catalog writer exists.

`lib/agents/catalog-schema.ts` owns version 1 inputs, outputs and operation
descriptions. OpenAPI and WebMCP input schemas are generated from these same Zod
schemas. `lib/agents/public-catalog.ts` projects an explicit public allowlist.
Adding a CSV column never automatically exposes it. Browser bundles receive
tool descriptions and schemas, not CSV rows, Zod or server/database modules.

## Read operations

| WebMCP tool / OpenAPI operation | HTTP GET |
| --- | --- |
| `chisan_catalog` | `/api/catalog/v1` |
| `chisan_search_producers` | `/api/catalog/v1/producers` |
| `chisan_get_producer` | `/api/catalog/v1/producers/{country}/{producer_id}` |

All are anonymous reads. Examples against a running local checkout:

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

Search accepts country, region, area, municipality, category, online-sales state,
query text and locale. Optional `lat`, `lon` and `radius_km` must be supplied
together. Latitude is −90 to 90, longitude −180 to 180 and radius is greater
than zero through 500 km. The inclusive great-circle radius excludes missing
coordinates and intersects every other filter, across published areas when no
area is specified. It is approximate straight-line distance, not travel distance.
Spatial results retain country/ID ordering and pagination; `next` preserves the
centre and radius. API callers explicitly provide the centre; unlike the browser
filter, these query coordinates are sent to the server. Region/area require country; category tokens and area
languages come from discovery. Categories include additional categories. Text
search matches every accent-insensitive term across the public name, municipality,
categories, featured-product summary and current localized base description.
It does not search hidden fields or expanded content. Municipality matching is
accent-insensitive exact matching. Search is lexical, not semantic or a quality
ranking. Results are ordered by country then numeric producer ID.

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

## Public facts and trust

- Only manifest-published countries are returned. A requested locale filters
  search to areas publishing that locale; detail rejects unavailable locales.
  With no locale, each country's default applies. Missing/stale base translations
  are omitted using the same resolver as the page. Current related translations
  use the existing explicit source-language fallback.
- Base results contain public contact channels, source-authored hours, online
  sales tokens, categories and mapped coordinates. Generic imagery is null.
  Coordinates describe the catalog map, not a new street-address assertion.
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

WebMCP is browser integration, not a remote MCP server. There is no `/mcp`
Streamable HTTP endpoint in this version. Do not advertise one or require the
old widget/token/localhost bridge. Recheck draft changes before adding APIs;
keep protocol-specific code in `lib/agents/webmcp.ts`.

## Operations and verification

Discovery/search use an immutable per-process public base index with bounded
locale keys, ETags and short public caching (browser 60s, shared 300s). Detail
reads use `no-store` and never cache account-derived visibility across requests.
Public GET/HEAD/OPTIONS support CORS without credentials; other methods have no
handler. The public namespace bypasses Clerk context, while other account APIs
retain their existing authentication and authorization boundaries.

`CHISAN_PUBLIC_DISCOVERY_ENABLED` keeps its existing Production-only indexing
meaning. Preview remains `noindex, nofollow`, with disallowed robots and an empty
sitemap. API reads, like known public profile URLs, remain accessible: discovery
is not access control. In public Production, robots permits the exact public
API namespace while retaining the general private API exclusion. API JSON is
`noindex, follow` to keep HTML profiles as search results. Review Vercel Firewall
rules against these routes during deployment. No firewall or environment setting
is changed by this implementation.

Run `pnpm test:agents` for schemas, visibility, filtering, identity, pagination,
invalid input, public scope, error handling and WebMCP lifecycle tests. These
checks are part of `pnpm verify:ai`. Browser QA must exercise the actual API from
registered callbacks, unsupported-browser behavior and navigation cleanup.
Record whether WebMCP was native or emulated; a mock is not browser conformance.
The deployment must include CSV and related JSON traces for the API functions.

The 2026-09-05 browser check used native Chrome 152 with
`--enable-features=WebMCP`, plus a normal browser without that flag. All three
tools executed against the local production build. This Chrome preview's
inspection API takes serialized JSON in `executeTool(tool, JSON.stringify(args))`;
the registered callback receives a parsed object. The inspector signature can
lag the draft and is not called by Chisan's adapter. Same-document navigation
to a non-catalog application page removed the tools. See the
[design QA record](../design/qa/design-qa.md) for the responsive check.

## Next increments

1. **Methodology and freshness:** keep the global source methodology current and
   make existing approved-change dates and ownership signals understandable. If
   a distinct full-profile review date becomes useful, define and record that
   real review event first; never derive it from payment, ownership or deployment.
   Public per-field source lists are not part of the current product direction.
2. **Product discovery:** index stable `(country, producer_id, product_id)` records
   with normalized product vocabulary and the same current visibility rules.
   Current search already indexes the base featured-product summary.
3. **Remote MCP:** expose these same services through an official MCP SDK and
   Streamable HTTP for clients without a browser, with transport conformance,
   request budgets, observability and explicit public-read semantics.
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
