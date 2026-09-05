# Catalog Web

This document owns public catalog routes, localized presentation, indexing and
structured data. `docs/CSV_CONTRACT.md` owns base storage; accounts own access
rights; `docs/PRODUCER_CONTENT.md` owns repeated content. All public views resolve
the same producer identity. The current public operating scope is Spain, as
selected by country manifests; other countries remain available internally.

Public agent reads use the same identity, publication and localization policy.
[Agent access](AGENT_ACCESS.md) owns the versioned JSON API, generated OpenAPI,
browser WebMCP tools, public projection and compatibility checks. Every producer
profile advertises its ID-based JSON representation. Expanded content visibility
is resolved by a shared loader for HTML and agent reads; new adapters cannot
publish a broader catalog or turn ownership into factual certification.

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

A producer has one public profile for one canonical CSV row and durable
`(<country>, producer_id)` identity. An expanded or paid profile extends that
same page; it never creates another producer record, URL family, canonical
entity or indexing tier. Premium status is an account-domain capability, not a
public producer fact.

The page renders semantic HTML and JSON-LD on the server from the same resolved
public fields. Structured data must follow Google's [general structured-data
policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies):
it describes only content that is visible on that response and must not expose
claim documents, payment state, entitlement history, review notes, audit data
or unpublished CSV values. A producer membership or payment may control which
reviewed block is visible, but never proves or upgrades a fact.

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
  `WebPage.about`; this does not turn them into independent commercial entities.
- Do not emit `Product` or `Offer` until a public item has a normalized product
  identity and visible, current price, currency, availability and purchase
  semantics owned by an explicit schema and UI contract.
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
silently translated.

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
source-language fallback is explicit and they currently have no JSON-LD mapping.
Other future premium content needs an equally clear localization and structured-
data contract. A new premium field may enter JSON-LD only when
it is public, visible on the same response, reviewed, normalized for its schema
type, localized under the preceding contract and covered by tests. Entitlement
activation alone never makes a field eligible.

`video`, `quien hay detras`, `historia` and `fecha ultimo cambio` currently
render only in the visible expanded-profile HTML. They have no JSON-LD mapping;
the approval date is workflow context, not `dateModified` for the whole page or
an ownership/verification signal.

If `producer.profile.premium` is inactive or account state fails closed, the
premium block and any structured facts derived exclusively from it disappear
from the same response. The base profile, canonical URL, page-local graph
structure and durable producer identity remain unchanged. Reactivation reveals
the already reviewed CSV values; it does not restore an unreviewed database
overlay.

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
contains only `/`, canonical short defaults and complete published composite
variants. It excludes `standby` countries, redundant default composites,
filtered/highlight URLs, unpublished or incomplete variants and application,
account and admin routes.
Shards keep a safety margin below the 50,000-URL protocol limit; the maintained
ceiling is currently 40,000 entries. The public-discovery flag applies
consistently to every locale's robots, indexing metadata and sitemap exposure.

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
