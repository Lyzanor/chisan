# Catalog Web

This document owns public catalog routes, localized presentation, indexing and
structured data. `docs/CSV_CONTRACT.md` owns base storage; accounts own access
rights; `docs/PRODUCER_CONTENT.md` owns repeated content. All public views resolve
the same producer identity. The current public operating scope is Spain, as
selected by country manifests; other countries remain available internally.

[Editorial guides](GUIDES.md) owns `/es/guias`, its Spanish articles, reviewed
producer references and update workflow. The library is a named segment inside
its country's catalog scope rather than an area: the proxy leaves that segment to
its own route, which serves exactly the scope that publishes the library.
Published guides join the sitemap, homepage and footer; mentioned producers
expose reverse links by stable identity. Guide text does not replace canonical
producer facts or imply translated articles.

[Editorial events](EVENTS.md) use `/es/eventos` and `/es/eventos/<slug>` within
the same Spanish catalog scope. The route segment is reserved from area slugs.
Published events join the sitemap, while only current, explicitly featured events
appear in Descubrir. An event venue has its own coordinates; exhibitor origin
maps keep the canonical productive coordinates of each producer.

Public agent reads use the same identity, publication and localization policy.
[Agent access](AGENT_ACCESS.md) owns the versioned JSON API, generated OpenAPI,
browser WebMCP tools, Remote MCP, public projection and compatibility checks. Every producer
profile advertises its ID-based JSON representation. Expanded content visibility
is resolved by a shared loader for HTML and agent reads; new adapters cannot
publish a broader catalog or turn ownership into factual certification.

## Mobile web and future app

The public web serves phones first and will be the base of a future web-based
app. Public routes are that app's deep links: a shared URL opens the same page,
language and safe filter state, with no app-only route family. Presentation,
touch behaviour and safe areas belong to [design](../design/README.md). A web app
manifest, service worker, offline copy and push notifications wait for the app's
own contract, which decides standalone navigation, sign-in and freshness. Any
cached catalog remains a derived read of the published catalog.

## Current public language

The public website and account presentation use Spanish, including the home page,
public information, authentication, shared selections and producer profiles.
Spain publishes only `es` at country, region and area level. Other dictionaries,
translation sidecars and standby country data remain available internally for a
future publication decision. Documentation and administration remain English. Administration uses a separate
root layout so client navigation cannot retain the public language shell.
Old locale cookies and browser preferences cannot change the public interface;
the language selector is hidden when there is only one published option.
Unpublished locale routes return a Spanish 404 with a published parent link and
are excluded from navigation, sitemap and hreflang. Stable Spanish routes and
producer identities do not change. Proper names and reviewed source-language
fields retain the factual and translation rules below.

The following localization architecture remains available for future activation.

## Progressive localization

A canonical correction can be published before its translations are ready.
Missing or stale translations are reported as work, never rendered as current
prose. Their stored source hashes continue to make that distinction explicit.
Structural errors and unsupported generation contexts remain blocking errors.

A producer page whose non-empty base prose is not fully available in its URL
language remains accessible with the available fields and generic metadata, but
is `noindex` and omitted from sitemap and hreflang. Other current variants remain
indexable. The language menu may still offer the accessible route. Country and
area navigation remain usable while individual prose is being translated.
Do not replace a factual correction with stale text to keep an index entry.

## Public producer-profile rendering and structured data

### Shared profile cache

Producer HTML and RSC use on-demand ISR with a one-hour revalidation interval.
The first request generates the page; subsequent requests reuse it independently
of cookies or query filters. Public data still comes from Git. Deploying reviewed
CSV/content changes replaces the route cache. Ownership and Pro presentation
are refreshed on regeneration; claim review, administrative gifts and Stripe
reconciliation invalidate the affected producer's published locale routes after
their database transaction. Expiry and out-of-band account changes are observed
on the next hourly regeneration. ISR serves stale content while refreshing and
can retain it during regeneration failures; public presentation is not an
authorization check or a promise of immediate removal. Urgent withdrawals require
explicit cache invalidation or a deployment under Operations.

The shared response never reads a viewer session. Signed-in viewers obtain their
management links from `/api/account/producer` with `private, no-store`; anonymous
visitors need no account-state request. Every action and private destination
still checks exact current server permissions. Followers' names, avatars and
visibility are loaded only when opening the list and never enter cached HTML.
Unclaimed profiles show the producer verification invitation beside the early
gallery. When accounts are disabled, it opens a preaddressed email with the
canonical profile URL instead of linking to unavailable registration. Verified
profiles do not invite another ownership claim. The email starts a review; it
does not grant a membership or publish a change.
Safe filter context is applied to language navigation in the browser; canonical
metadata is independent of those filters. Compatibility URLs use bounded build
rewrites and a query-aware redirect handler, not a dynamic canonical profile.

`dynamic = "error"` prevents accidental session-dependent profile rendering.
The routing proxy still validates catalog URLs to retain complete server-rendered
404s with this Next.js version, but public GET/HEAD requests skip Clerk. This
proxy has a per-request cost even on a profile cache hit; in-process CSV and
translation caches deduplicate reads, including concurrent cold reads. Catalog
API reads and public follower-list reads skip the authentication proxy.

Validate caching with `next build` and `next start`, not the development server:
repeat a canonical profile with differing cookies/query strings, confirm identical
public HTML and `x-nextjs-cache: HIT`, check private APIs for `private, no-store`,
and exercise compatibility redirects and localized 404s. On Vercel, inspect
`x-vercel-cache` and Function versus Routing Middleware usage separately.

A producer has one public profile for one canonical CSV row and durable
`(<country>, producer_id)` identity. An expanded or paid profile extends that
same page; it never creates another producer record, URL family, canonical
entity or indexing tier. Premium status is an account-domain capability, not a
public producer fact.

The page renders semantic HTML and JSON-LD on the server from the same resolved
public fields. The profile's localized title combines producer identity with its
verified category and territorial context (`<producer> · <category> <in> <location>`),
ensuring search engine results and agents resolve clear geographic intent. Structured
data must follow Google's [general structured-data
policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies):
it describes only content that is visible on that response and must not expose
claim documents, payment state, entitlement history, review notes, audit data
or unpublished CSV values. A producer membership or payment may control which
reviewed block is visible, but never proves or upgrades a fact.

The profile presents the website as a direct URL in the hero, and directions
beside the address, map and transient distance tool, next to reviewed hours and
the contact widget. Sales channels are separate from featured products. When a
storefront is reviewed, a prominent purchase action opens `url_tienda` (online
shop, else marketplace, else subscription). Until a store page is recorded,
the online shop action opens the official `web`; the other channels remain
plain labels. The public API separately exposes the reviewed `store_url`.
A contact composer is available
only for an existing public `correo`. It prepares a `mailto:` message in the
visitor's email application, explicitly leaving review and sending to that
application. It neither stores messages nor adds a Chisan
inbox or delivery promise. The public email remains an ordinary accessible
contact link. At the end of the profile, nearby discovery may show up to three
other published producers within 100 km that share at least one canonical
category. It uses reviewed producer coordinates, orders by straight-line
distance and omits candidates without the required evidence rather than
inferring proximity. Layout and motion are owned by [design](../design/README.md).

### Public graph and factual mapping

Each localized response exposes one linked `@graph` containing `WebSite`,
`WebPage`, `BreadcrumbList` and the producer entity. Page-local identifiers are
derived from that response's canonical URL. The account and catalog domains
continue to use the locale-independent durable producer key.

- Use `LocalBusiness` only when the row has a non-empty reviewed `direccion`;
  otherwise use `Organization`. A missing street address is never inferred from
  coordinates, municipality, a map link or account data.
- Include only public values rendered by the page: producer name, canonical
  URL, resolved public description, reviewed contact and identity links,
  address when present and the producer's own image. The generic placeholder
  image is never an entity image.
- Include `GeoCoordinates` only when the same productive unit has a reviewed
  address, its canonical reviewed Google Maps link and valid paired `lat` and
  `lon`, following `docs/PRODUCER_GEOLOCATION.md`. Otherwise locality may be represented
  as `Place` without inventing a street address or exact location.
- Localized country, area, category and breadcrumb labels must match the visible
  HTML. Concrete `productos estrella` and category labels may be represented as
  `WebPage.about` and `LocalBusiness`/`Organization.knowsAbout`; this does not
  turn them into independent commercial entities.
- `WebPage` emits `dateModified` matching the most recent reviewed change,
  notice or source verification date when present; stale or guessed timestamps
  are never emitted.
- Reviewed typed products may emit `Product`; a real product with a recorded
  price, currency and purchase URL may emit `Offer` under
  `docs/PRODUCER_CONTENT.md`. Never infer availability or price validity.
  Demo products are explicitly fictional and have no `Offer`.
- Do not emit `AggregateRating`, reviews or testimonials without genuine
  first-party user input, visible supporting content and a dedicated moderation
  contract. Editorial selection, ownership approval and premium status are not
  ratings or endorsements.
- Do not derive `openingHoursSpecification` from free-text `horario`. It may be
  added only after opening periods, exceptions, time zone and freshness are
  normalized and visibly rendered from an owned contract.
- Do not use `ProfilePage` for Chisan's third-party producer record. The
  producer remains the subject of a Chisan-authored directory page.

The breadcrumb graph must mirror the visible breadcrumb trail. JSON is emitted
with safe serialization so producer-controlled text cannot close the script
element or inject markup. Structured-data eligibility is not a guarantee that a
search engine will display a rich result.

### Locale and translation behavior

The route resolves the presentation locale, canonical URL, `hreflang` set and
`inLanguage`. Shared interface copy, actions, country and area names, categories
and breadcrumbs use maintained locale resources. Proper names, addresses,
telephone numbers and external URLs remain canonical facts rather than being
silently translated. Direct contact actions expose phone calls (`tel:`) and,
when a public email is recorded, draft messages (`mailto:`). When an E.164
phone number is an identified mobile line or the producer has demonstrated
WhatsApp orders in `Canal de venta`, an official WhatsApp action
(`https://wa.me/...`) is exposed in hero quick actions and the contact section.

`descripcion`, `quien hay detras` and `historia` use the sidecar resolver in `docs/CSV_CONTRACT.md`. A missing, stale or invalid translation is omitted from visible
body copy and, where mapped, JSON-LD for that locale; localized generic metadata
may describe the page without pretending to be translated producer prose.
`productos estrella` currently stays as reviewed canonical source text in both
HTML and `WebPage.about`.
`mensaje a la comunidad` is likewise rendered literally with its declared
source `lang` and is not materialized through sidecars in this version.

When adding a translatable base field, update its consumers together:

1. the area CSV schema and source-locale pairing;
2. the shared translatable-field definition, source hash and validators;
3. the localized-route completeness and `hreflang` policy;
4. visible HTML and any structured-data mapping; and
5. behavior, sparse-data and serialization tests.

There is no runtime machine-translation fallback, database copy or implicit
inheritance from `descripcion`. Until a field has that complete contract, either
omit its locale-specific semantic claim or render the reviewed source text with
the correct `lang` only where the owning content contract permits it.

### Premium extension boundary

Products, gallery items and links follow `docs/PRODUCER_CONTENT.md`. Their
source-language fallback is explicit. The visible products have an ordered
`ItemList`/`Product` graph and conditional external `Offer` nodes. The exact
product update day maps to its describing `WebPageElement.dateModified`, not the
producer or whole page. This graph is rendered inside the same entitlement gate
as the HTML, with safely serialized text and locale-aware canonical anchors.
Other future premium content needs an equally clear localization and structured-
data contract. A new premium field may enter JSON-LD only when
it is public, visible on the same response, reviewed, normalized for its schema
type, localized under the preceding contract and covered by tests. Entitlement
activation alone never makes a field eligible.

`video` renders as a responsive click-to-load YouTube player with its official
thumbnail; invalid embed URLs keep a direct-link fallback. Opening the profile loads the thumbnail
from `i.ytimg.com`; the iframe uses the privacy-enhanced host and exists only
after an explicit play action. The reviewed URL remains the API value; the
client derives the thumbnail and embed from its video ID without retaining
query parameters. `video`, `quien hay detras`, `historia` and related CSV facts
render in the visible expanded-profile HTML for any producer with reviewed
data, without requiring a premium entitlement. They have no direct entity
JSON-LD mapping because the catalog does not own the title and publication
metadata needed for a complete video record or independent prose nodes.

If `producer.profile.premium` is inactive or account state fails closed,
gated typed products, catalog links and custom content collections disappear
from the same response. The base profile, canonical URL, reviewed CSV facts,
page-local graph structure and durable producer identity remain unchanged.
Reactivation reveals the already reviewed content files; it does not restore
an unreviewed database overlay.

The optional related `people` collection renders at most three individual names,
roles, brief presentations and optional portraits below the CSV team introduction.
People are separate from products and standalone gallery photos. Missing portraits
create no placeholder; portrait captions and alternative text retain their source
language. The shared expanded-content reader gates HTML and API consistently.
Current visibility does not restrict editorial preparation, and these records
have no Person or Product JSON-LD mapping.

Verification requires `npx pnpm verify:ai`, a complete-profile case, a sparse-
profile case and a malicious closing-script serialization case. Before enabling
new schema types or public indexing, inspect raw server HTML to confirm that the
JSON-LD is present before client JavaScript, matches visible content and passes
Google's Rich Results Test or Schema Markup Validator as applicable.

## Localized routes, metadata and indexing

The first public path segment is a catalog presentation scope:

```text
/<country>/...                    country default locale
/<language>-<country>/...         published alternate locale
```

The short form is the only canonical scope for `defaultLocale`. A redundant
default composite such as `/es-es`, `/de-de` or `/ja-jp` permanently redirects
to the corresponding short scope while preserving only safe public query
context. An alternate composite is valid at a page only when its locale appears
in that page's effective policy. Scope parsing may recognize a locale used by a
descendant while the country landing itself returns 404; publishing an area
does not implicitly publish the country landing in that locale.

Country, region, area and current producer slugs are routing identifiers and
are not translated. `category` and `highlight` names and values likewise remain
canonical tokens. A language switch preserves the resolved country, area and
producer plus those safe filters; it changes only the catalog scope. Every
short and composite variant still resolves to the same CSV row and durable
`(<country>, producer_id)`. Area and producer compatibility redirects retain
the resolved locale and preserve only `category` and `highlight` query state.

A selected public URL owns its requested language. It must return one stable
language in initial HTML, including `<html lang>`, navigation, visible
description, title and metadata. `Accept-Language`, a preference cookie, device
location and IP location may help choose a destination link only from a neutral
or private application page; none may vary or redirect an already valid public
locale URL. Destination selection uses this order:

1. an explicit supported preference published for the target area;
2. the effective territorial preference, only when it is published and appears
   among the visitor's accepted browser languages;
3. otherwise the first matching browser preference published for that area;
4. generic English when it is published and no visitor language matched;
5. the country default.

Country publication and language availability are separate decisions. A country
with `publicationStatus=standby` remains in the CSV registry and every
editorial, evidence and account workflow, but it is absent from public
selectors, route resolution, compatibility rewrites, language alternates and
sitemaps; direct catalog requests return 404. Restoring `published` reuses the
maintained catalog and locale policy without a data migration. Within a
published country, a locale is added to an effective `publishedLocales` list
only after its dictionaries, territorial and unit labels, controlled-value
labels and metadata templates are complete for that exact scope. Producer
prose may follow progressively; only current variants enter indexing. The manifest's country publication status and locale policy
drive routes, selectors, alternates and sitemap enumeration; do not maintain a
second release list in code. A standby country also pauses routine discovery,
enrichment, translation materialization and geolocation work through its
`Operating state`; repository-wide migrations, validators, integrity repairs
and account references still include it. Operational commands with no country
argument may derive their default only when the manifests expose exactly one
published country. An explicit country scope remains available for deliberate
standby maintenance and future publication work.

Each real published page has localized title, description, Open Graph and
Twitter metadata and a self-referential canonical URL without `category` or
`highlight`. Producer images and source-authored facts remain shared. Its
`hreflang` set is reciprocal among indexable variants and contains exactly the complete
published variants for the same country, area and optional producer. Current
locale-to-`hreflang` mappings are explicit rather than copied from URL tokens:

| Locale | `hreflang` |
| ------ | ---------- |
| `en`   | `en`       |
| `es`   | `es`       |
| `ca`   | `ca-ES`    |
| `de`   | `de`       |
| `ja`   | `ja-JP`    |
| `fr`   | `fr`       |
| `it`   | `it-IT`    |
| `nl`   | `nl`       |
| `pt`   | `pt-PT`    |
| `af`   | `af-ZA`    |
| `as`   | `as-IN`    |
| `bn`   | `bn-IN`    |
| `cy`   | `cy-GB`    |
| `ga`   | `ga`       |
| `gd`   | `gd-GB`    |
| `gu`   | `gu-IN`    |
| `haw`  | `haw-US`   |
| `hi`   | `hi-IN`    |
| `kn`   | `kn-IN`    |
| `kok`  | `kok-IN`   |
| `ml`   | `ml-IN`    |
| `mr`   | `mr-IN`    |
| `ne`   | `ne-IN`    |
| `nso`  | `nso-ZA`   |
| `or`   | `or-IN`    |
| `pa`   | `pa-IN`    |
| `ss`   | `ss-ZA`    |
| `st`   | `st-ZA`    |
| `ta`   | `ta-IN`    |
| `te`   | `te-IN`    |
| `tn`   | `tn-ZA`    |
| `xh`   | `xh-ZA`    |
| `zu`   | `zu-ZA`    |

Generic tags remain intentional for languages that span more than one catalog
territory. Other entries retain an explicit territory where that identifies the
maintained presentation variant. The global `/` country-and-area selector is
the only `x-default` URL. Area and producer pages do not invent an `x-default`;
English, when published, is an ordinary explicit alternate.

The sitemap uses the same canonical/alternate builder as HTML metadata and
includes `/`, public information, published editorial pages, canonical short
defaults and complete published composite variants. It excludes `standby`
countries, redundant default composites,
filtered/highlight URLs, unpublished or incomplete variants and application,
account and admin routes.

### Sitemap discovery and growth

`/sitemap.xml` is the single sitemap index advertised by `robots.txt` and
`llms.txt`. Submit this index in Search Console. Its root-level XML children
separate content into understandable, independently inspectable groups:

| File pattern | Contents |
| --- | --- |
| `/sitemap-pages-1.xml` | Home and public information pages (`/about`, `/how-we-work`, `/soy-productor`, `/contact`, `/privacy`) |
| `/sitemap-catalog-<country>-1.xml` | Published country and area landing pages |
| `/sitemap-guides-<scope>-1.xml` | Published guide library and articles |
| `/sitemap-events-<scope>-1.xml` | Published event library and events |
| `/sitemap-producers-<country>-<area>-1.xml` | Indexable producer profile variants in one area |

`lib/catalog-sitemap.ts` derives groups from country manifests, canonical route
builders, translation readiness and the guide/event publication owners. There
is no manually maintained list of provinces, producers or shard counts. New
published countries, areas, locales and editorial records join on the next build;
empty groups disappear. New public route families must explicitly join their
owning group and the coverage test, rather than admitting every filesystem route.
Profiles are ordered by stable producer ID within an area. Adding a producer in
one area never moves another area's URLs into a different file.

Each group splits automatically at 40,000 URLs or 40 MiB of serialized UTF-8 XML,
including escaped values and language alternates. Both ceilings leave a margin
below the protocol's 50,000 URLs and 50 MiB. The part suffix always starts at `1`
so adding a second part does not rename the first. The index is flat, contains
only nonempty child files, and has its own protocol-limit guard. Root-level
rewrites serve the statically generated `/sitemaps/<name>` handlers without
restricting sitemap scope to a subdirectory. Unknown public names return 404.

The previous `/sitemap/<number>.xml` files remain available for existing crawler
bookmarks and Search Console submissions, using the same catalog projection;
new discovery advertises only the index. Do not delete old submissions before
the new index is deployed and successfully processed.

`lastmod` uses the existing editorial dates for guides and events. Omit it for
profiles, undated information pages and the index until an authoritative date
covering their significant public changes exists. Build time, filesystem mtime,
payment state and source-check dates are not page modification dates. Do not
emit `priority` or `changefreq`, which Google ignores. Spanish information pages
declare Spanish alternates; producer alternates share HTML's readiness policy.

The public-discovery flag applies consistently to robots, indexing metadata and
all sitemap endpoints. Preview and closed Production return empty XML and do not
advertise the index. Generation reads reviewed files, never account state.
`scripts/test-sitemaps.ts` covers partitioning, XML escaping, byte limits and the
HTTP publication gate; catalog metadata tests cover complete, unique canonical
coverage and reciprocal alternates. Both run under `pnpm test:behavior`.

These rules follow Google's [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
and [sitemap index guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps).
Sitemaps aid discovery, not guaranteed indexing or ranking. Google's
[AI guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
uses the same SEO foundations; `llms.txt` is an agent orientation document, not
a Google ranking mechanism. Agents should use the bounded public API and OpenAPI
under [Agent access](AGENT_ACCESS.md) instead of repeatedly crawling every profile.

## Values that remain untranslated

Language variants preserve source-authored public facts rather than generating
localized replacements for them:

- `nombre`, `municipio` and `direccion`;
- official product, brand and appellation names in `productos estrella`;
- published `horario` text;
- URLs, email, phone, coordinates and image paths.

The interface localizes labels for those fields. Category, verification,
online-sales and sales-channel tokens also remain exact storage identifiers;
their visible labels are localized separately. A future source-backed official
name variant is an editorial identity feature, not an automatic translation.

## Profile gallery and trust presentation

The profile header links country, area, municipality and categories to catalog
filters on one context row, uses a full-width reviewed cover photograph and
exposes ownership separately from premium
presentation. `pendiente` is editorial uncertainty, never a pending private
claim. Its optional public-source disclosure includes only the current keep
record's URLs and consultation dates, without evidence notes or private data.
The producer route trace includes evidence ledgers for this read.

Standalone gallery visibility follows `PRODUCER_CONTENT.md`: every profile shows
its complete approved standalone gallery, whatever its ownership, premium or
account state. The five-image limit only bounds what a claimed free profile can
propose in the account editor. Neither ownership nor premium grants new factual
authority. Base JSON-LD remains unchanged; hidden premium products and images
never enter the public structured data.


## Catalog search scope

The province explorer offers country and current province scopes, integrated
with text search in the header. The filter icon and search focus open the same
animated scope panel; province remains the default on a province URL.
Country searches all areas published in the requested locale. The current province stays
available as a scope and the existing province selector changes that province.
Changing scope clears municipality and selected-producer restrictions, while
retaining text and category. `q` (up to 200 characters) and `search_scope`
(`country`; omitted for province) survive catalog navigation, Back/Forward and
shared URLs. Legacy `nearby` links open country discovery. The floating location
control centres the map using ephemeral device position; it does not silently
restrict the result set to a radius or persist coordinates.

Web and API use the same public base fields and literal relevance scorer; see
[Agent Access](AGENT_ACCESS.md). The full description and existing featured-product
summary are searchable, independently of the short list preview. Expanded
products are excluded. Text results retain relevance order when the map moves;
without text, the map can prioritize visible producers. The list includes
unmapped producers and offers additional
results beyond the initial 400. Map selection uses country-local producer IDs,
so equal slugs in separate provinces cannot collide. Profile links always use
the result's actual area and published locale.

National data loads lazily in bounded public pages, with loading, retry and
empty states. The UI never labels a partial download as national coverage.
The lossless compact transport and short browser-memory cache reuse the complete
country/locale projection between navigations. Optimizations preserve every
matching producer and map point; marker density is part of the discovery surface,
not a reason to cap or cluster away the results.
The mobile map fills the viewport below the header and categories. A horizontal
card carousel synchronizes explicit selection with `highlight` and map focus;
the compact bottom disclosure previews one photographed row and opens the same
roster. Each row has an independent follow action, also visible to guests and
linked to registration with a same-site return path. The carousel renders a bounded
neighbourhood while allowing navigation through all results. Each map adapts to
its own width and height, including embedded maps and intermediate/foldable
windows: roomy or short-wide layouts show a fluid-width roster beside the map;
short maps reduce the card and collapsed sheet. Producers without coordinates retain their profile
links without inventing a map point. Neither URLs nor catalog-search requests
receive visitor coordinates; map bounds use matching producers' public points.

Public selections and guide maps reuse the same carousel, photo roster and sheet
inside their page. Their membership and original ordering remain explicit; guide
selection state stays local while profile selections retain `highlight`. A single
producer location map keeps its static contextual marker.
