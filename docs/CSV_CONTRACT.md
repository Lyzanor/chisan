# CSV Contract

## Purpose

This is the normative contract for the producer data published by Chisan. An area
CSV is the current product state: every non-empty cell is a public claim, and an
empty optional cell is valid incomplete knowledge.

This document owns storage semantics: file shape, field meanings, missing
values, controlled values, cross-field invariants and validation. It does not
decide which entities qualify or how research is performed:

- `docs/EDITORIAL.md` owns eligibility, verification, online-sales decisions
  and the three operating levels with their handoffs.
- `docs/EVIDENCE_CONTRACT.md` owns decision provenance. Evidence explains a CSV
  decision but never overrides the CSV.
- `AGENTS.md` owns runtime boundaries, routing invariants, repository editing
  rules and validation gates.
- `docs/GEOLOCATION.md` owns coordinate sourcing, geocoding and review.
- `docs/IMAGES.md` owns image sourcing and preparation.
- `docs/ACCOUNT_SYSTEM.md` owns how an authorized producer proposal reaches the
  editorial workflow; a database request never overrides a row.
- Country-level `translations.<locale>.csv` files are materialized presentation
  caches for explicitly translatable canonical prose. They are governed here,
  but are not producer-data overlays and never override an area row.

Validators prove conformance, not truth. Editorial correctness remains the
first requirement.

## Dataset registry

The only runtime producer source is:

```text
data/csv/<country>/<region>/<area>.csv
```

Files named `data/csv/<country>/translations.<target-locale>.csv` are a
separate file class. They may localize canonical prose for rendering, but they
do not register countries, regions, areas or producers and are never read as
area CSVs.

- `<country>` is a lowercase ISO 3166-1 alpha-2 code.
- `<region>` and `<area>` are stable lowercase ASCII kebab-case slugs. Their
  country-specific labels and ordering belong in `country.json`.
- The folder tree is the registry; adding a country, region or area is a data
  change, not a code change.
- `<area>` must be unique inside its country. The public area key is
  `(<country>, <area>)`, so different countries may use the same area slug but
  two regions of one country may not.
- Every effective region and area locale policy must retain the country's
  default locale. This guarantees that the stable short `/<country>/<area>`
  route remains publishable and gives private account links a valid fallback.
- `events` and `retail` are reserved country-level namespaces and cannot be
  area slugs or aliases.
- Every producer row belongs to the area containing its productive unit. A
  sales outlet, head office or brand origin does not determine placement.

## Country manifest and locale policy

`data/csv/<country>/country.json` supplies presentation, ordering and routing
policy for the catalog tree. It does not register data: country and region
directories and area CSV filenames remain authoritative for what exists. A
manifest entry may label or order a real node, but cannot create a country,
region, area or producer.

The localized manifest schema is:

| Path                                      | Type and meaning                                                                                                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`                                   | Required non-empty canonical country label.                                                                                                                      |
| `publicationStatus`                       | Optional exact `published` or `standby`; omission means `published`. `standby` pauses every public country route without removing catalog or workflow state.     |
| `unit`                                    | Required `{ "one": string, "many": string }` base names for the area level.                                                                                      |
| `regionUnit`                              | Required `{ "one": string, "many": string }` base names for the region level.                                                                                    |
| `i18n.defaultLocale`                      | Required supported presentation locale; it owns the short `/<country>` scope.                                                                                    |
| `i18n.publishedLocales`                   | Required non-empty, duplicate-free list of locales published at country depth and inherited by descendants without an override. It must include `defaultLocale`. |
| `i18n.labels`                             | Country display label by supported presentation locale.                                                                                                          |
| `i18n.unitLabels`                         | Area-level `{ one, many }` display names by supported presentation locale.                                                                                       |
| `i18n.regionUnitLabels`                   | Region-level `{ one, many }` display names by supported presentation locale.                                                                                     |
| `regions[].slug`                          | Exact region directory slug; the array also controls display order.                                                                                              |
| `regions[].label`                         | Required non-empty canonical region label.                                                                                                                       |
| `regions[].labels`                        | Region display label by supported presentation locale.                                                                                                           |
| `regions[].i18n.publishedLocales`         | Optional replacement for the inherited country list below this region.                                                                                           |
| `regions[].i18n.preferredLocale`          | Optional territorial preference; it must be in the region's effective published list.                                                                            |
| `regions[].areas[].slug`                  | Exact area CSV stem; the array also controls display order.                                                                                                      |
| `regions[].areas[].label`                 | Required non-empty canonical area label.                                                                                                                         |
| `regions[].areas[].labels`                | Area display label by supported presentation locale.                                                                                                             |
| `regions[].areas[].i18n.publishedLocales` | Optional replacement for the inherited region list for this area.                                                                                                |
| `regions[].areas[].i18n.preferredLocale`  | Optional territorial preference; it must be in the area's effective published list.                                                                              |

`aliases` and `producerRouteAliases` are compatibility registries, not locale
policy. Their routing rules are defined under **Producer identity** below.

Presentation locales are the exact codes in the maintained presentation
registry in `lib/i18n/locales.ts`; two- and three-letter locale tokens are both
supported. A code accepted only by the description-source registry is not valid
in manifest locale policy. Country codes, browser language, source prose or
territorial geometry never infer a default or publish a locale.

Locale policy resolves from country to region to area:

1. The country declares one `defaultLocale`; descendants cannot replace it.
2. Country `publishedLocales` applies to the country landing and is inherited
   by every region without an explicit list.
3. A region list replaces, rather than extends, its inherited list and is
   inherited by its areas.
4. An area list replaces its inherited region list for that area and its
   producer pages.
5. Every effective list must retain the country default so the stable short
   route remains complete.
6. The effective preferred locale starts as the country default, may be
   replaced at region depth and then at area depth, and must always be
   published at that depth. It may prioritize that locale only when the browser
   actually accepts it among the published matches; it never overrides an
   explicit choice, becomes a fallback without a visitor-language signal, or
   changes or redirects a valid locale URL.

Labels do not publish a route by themselves and may be prepared for a supported
locale before activation. Before a locale is published at an area, that area
must have its own non-empty label for the locale. Its ancestors must also have
the country label, region label and both unit-name pairs required to render the
descendant. This is why country and region label maps cover the union of locales
published below them, even when the country landing does not publish every one
of those locales.

The neutral application shell uses `APPLICATION_DEFAULT_LOCALE` while it lists
every publicly `published` country, region and area. The same locale's country,
region and area labels and both country unit-name pairs remain mandatory
throughout the full tree, including `standby` countries, because editorial and
account workflows continue to load them. This is an explicit consumer
requirement, not a fallback to the legacy single `label` fields.

When a selector lists sibling regions or areas that do not publish the current
page locale, each destination is labelled in the locale that its link will
open. The renderer never invents a missing sibling translation from the legacy
single `label` field.

Every country manifest must declare `i18n.defaultLocale`,
`i18n.publishedLocales`, all effective country/region/area labels and both unit
label maps. The loader does not infer locale policy, labels or units from legacy
fields. A missing manifest or incomplete locale policy is a direct catalog
contract error. Live rollout counts and batch progress never belong in this
manifest or a country `AGENTS.md`.

## Canonical header

Every area CSV has every column in the canonical header below, in this order.
The column count is not a stable part of the contract: new columns may be
appended so existing field positions remain stable.

```text
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id,descripcion_locale,visitas guiadas,mensaje a la comunidad,mensaje_comunidad_locale,enlace destacado 1,enlace destacado 2
```

All columns are physically present in every file. “Optional” below means that a
cell may be empty, never that its column may be omitted.

A schema widening is one atomic repository-wide change: update this header and
the row schema, its machine-readable mirror in `scripts/audit-csv.js`, and
every file under `data/csv/**` plus the contract fixtures. Update named
consumers when the new field affects their behavior, then run
`npx pnpm verify:ai`. The gate must reject a partial migration, but no
documentation, error message or test should treat the current column count as
permanent.

Files must be valid CSV, UTF-8 without BOM, with LF line endings. Quote commas,
quotes and line breaks using standard CSV escaping. Do not pad cells with
whitespace.

## Row schema

| Field                    | Presence    | Meaning and representation                                                                                                      |
| ------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `slug`                   | required    | Current public producer slug; lowercase ASCII kebab-case and unique within the country.                                         |
| `nombre`                 | required    | Public producer identity or brand, not an invented label.                                                                       |
| `municipio`              | required    | Municipality of the qualifying productive unit, using its public or official local spelling.                                    |
| `categoria`              | required    | One exact token from the shared category registry.                                                                              |
| `productos estrella`     | optional    | Short comma-separated list of confirmed producer products, brands or appellations.                                              |
| `direccion`              | optional    | Published address of the productive unit or its producer-facing premises; never substitute an unrelated shop or head office.    |
| `descripcion`            | optional    | Concise synthesis of producer-specific, verifiable facts.                                                                       |
| `horario`                | optional    | Current published visiting, collection or public-opening hours whose purpose is clear.                                          |
| `telefono`               | optional    | One public producer contact in strict E.164 form, for example `+34600112233`.                                                   |
| `correo`                 | optional    | One valid public producer email address.                                                                                        |
| `web`                    | optional    | Official producer HTTP(S) URL.                                                                                                  |
| `Facebook`               | optional    | Official producer Facebook profile/page HTTP(S) URL.                                                                            |
| `Instagram`              | optional    | Official producer Instagram profile HTTP(S) URL.                                                                                |
| `Google Maps`            | optional    | Canonical HTTP(S) Google Maps listing, anchored by a reviewed Place ID, for the producer or productive unit.                    |
| `lat`                    | paired      | WGS84 latitude in decimal degrees, between `-90` and `90`.                                                                      |
| `lon`                    | paired      | WGS84 longitude in decimal degrees, between `-180` and `180`.                                                                   |
| `imagen`                 | optional    | Root-relative path to a local public image asset.                                                                               |
| `verificacion`           | optional    | Empty for no public editorial label; otherwise the exact token `pendiente`.                                                      |
| `Venta online`           | required    | Exact token: `sí`, `no` or `no comprobado`.                                                                                     |
| `Canal de venta`         | conditional | Zero or more allowed channel tokens joined with `\|`; only when `Venta online=sí`.                                              |
| `categorias adicionales` | optional    | Zero or more exact category tokens joined with `\|`; each represents another material product line of the same productive unit. |
| `producer_id`            | required    | Immutable positive decimal safe integer (`1..9007199254740991`) without leading zeroes; unique within the country.              |
| `descripcion_locale`     | paired      | Supported lowercase source-language code for a non-empty `descripcion`; empty exactly when `descripcion` is empty.              |
| `visitas guiadas`        | optional    | Empty when unpublished, otherwise exact token `sí` or `no`; never inferred from ordinary opening hours.                         |
| `mensaje a la comunidad` | optional    | Producer-authored public message in its original language, with at most 1,000 Unicode characters.                               |
| `mensaje_comunidad_locale` | paired    | Supported lowercase source-language code for a non-empty community message; empty exactly when that message is empty.           |
| `enlace destacado 1`     | optional    | Relevant public HTTP(S) article, interview or other external page about this producer.                                          |
| `enlace destacado 2`     | conditional | A second distinct public HTTP(S) page; allowed only when `enlace destacado 1` is filled.                                        |

Controlled values are exact and case-sensitive. Accents are significant.

## Missing values and progressive completion

The canonical missing value is an empty cell. Do not write placeholders such
as `N/A`, `desconocido`, `-`, a repeated municipality or a guessed value.

An empty optional cell means only “not currently published in the catalog”. It
does not assert that the fact or channel does not exist. Explicit negative and
unknown states exist only where the schema provides them: `Venta online=no`
means reviewed and absent; `no comprobado` means unresolved.

Every filled cell must be attributable to a suitable public source and must
describe the same producer identity as the row. Dynamic facts such as activity,
hours, contacts and online sales require current support. When a value cannot be
supported, leave it empty or use the defined unknown state; never complete a row
by inference.

`mensaje a la comunidad` is the narrow attribution exception: it may originate
as new first-party speech submitted by an active producer member through the
reviewed account workflow, so it need not have been published at another public
URL first. Its source is the attributed submission, whose author, request and
review trail remain in PostgreSQL and Git rather than being copied into the CSV
or public evidence ledger. This exception does not turn objective claims inside
the message into verified facts and does not relax public-source requirements
for any other field.

New candidates must pass the candidate gate in `docs/EDITORIAL.md` before
they enter a CSV. An admitted row uses `pendiente` while material doubt remains
and otherwise leaves `verificacion` empty. `pendiente` is never a holding state
for a speculative candidate that has not passed admission.

## Editorial field conventions

- Source-authored identity and location data retain the producer's or competent
  authority's spelling: `nombre`, `municipio`, `direccion`, published hours,
  product names, brands and appellations. Do not translate proper names.
- The source language of editor-authored `descripcion` is recorded per row in
  `descripcion_locale`; it may differ between rows in one country. Editorial
  language should suit the local catalog and available evidence, but language
  choice never changes field meaning or evidentiary standards.
- `nombre` is the identity under which the producer is publicly presented. Use
  a legal name only when no distinct public identity exists; omit legal suffixes
  unless they are part of the public name.
- `productos estrella` contains only concrete confirmed outputs. Do not repeat
  `categoria` or `categorias adicionales`, invent representative products or
  turn it into prose.
- `descripcion` is one or two complete, natural factual sentences, with at most
  400 Unicode characters. It may add supported products, place, method, people
  or history, but it must say something producer-specific beyond merely
  restating `nombre`, `municipio`, categories and `productos estrella`. Exclude
  promotional claims, search text, URLs, citations, source commentary,
  cataloguing or review narration, page boilerplate and shared templates. Never
  publish a mechanically truncated sentence. When the evidence supports no
  distinctive prose beyond the structured fields, leave `descripcion` empty;
  generic filler is not completeness.
- A localized `descripcion` may use up to 500 Unicode characters so languages
  that expand relative to the canonical prose can preserve every fact without
  becoming promotional or mechanically truncated. Area cards still apply the
  shared 120-character word-boundary preview in every locale.
- `horario` is copied only when the source makes its meaning and currency clear.
  Empty is preferable to an old or ambiguous schedule.
- `visitas guiadas` records a reviewed explicit offer. Empty means unpublished,
  `sí` means currently offered and `no` means explicitly reviewed as not offered.
  It is not derived from `horario`, a shop opening time or general public access.
- `mensaje a la comunidad` is attributed to the producer rather than written in
  Chisan's editorial voice. It remains subject to review, must concern the same
  productive unit, and excludes HTML, source notes, page boilerplate,
  embedded URLs and claims about third parties. It must not begin with a
  spreadsheet formula marker (`=`, `+`, `-` or `@`). Internal spaces and LF line
  breaks are preserved in its declared `mensaje_comunidad_locale`; they are not
  collapsed during proposal review or public loading. This first version does
  not materialize the message through translation sidecars.
- Highlighted links are relevant third-party or producer pages such as press
  articles and interviews. They do not replace `web`, social links or evidence,
  are not necessarily official, and never count toward `verificacion`. The two
  links must remain distinct after standard URL canonicalization (for example,
  `https://example.com` and `https://example.com/` are the same URL), although
  the accepted CSV value keeps its original spelling.

## Expanded-profile fields

The current expanded content fields are `visitas guiadas`, `mensaje a la
comunidad`, `enlace destacado 1` and `enlace destacado 2`, plus the message's
paired locale metadata. Their values are canonical CSV facts.
There is deliberately no `premium`, payment status, provider or external
payment ID column.

PostgreSQL never owns copies of these field values. The account domain owns the
producer-scoped `producer.profile.premium` entitlement and its commercial
workflows. CSV loading, review and public rendering are payment-provider
agnostic. The generic details table omits the premium field set; its dedicated
block renders non-empty CSV values only while the entitlement is active. If
account state is unavailable or the entitlement becomes inactive for any
reason, the base profile remains public and these values remain in CSV for
traceability but stay hidden and frozen. Payment never proves facts, changes
verification or bypasses review; standard corrections remain free.

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
  `lon`, following `docs/GEOLOCATION.md`. Otherwise locality may be represented
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

`descripcion` uses the deterministic sidecar resolver below. A missing, stale
or invalid translation is omitted from visible body copy and JSON-LD for that
locale; localized generic metadata may describe the page without pretending to
be the producer's translated description. `productos estrella` currently stays
as reviewed canonical source text in both HTML and `WebPage.about`.
`mensaje a la comunidad` is likewise rendered literally with its declared
source `lang` and is not materialized through sidecars in this version.

Any future translatable base or premium field must be introduced atomically
across:

1. the area CSV schema and source-locale pairing;
2. the sidecar field allowlist, source hash and validators;
3. the localized-route completeness and `hreflang` policy;
4. visible HTML and any structured-data mapping; and
5. behavior, sparse-data and serialization tests.

There is no runtime machine-translation fallback, database copy or implicit
inheritance from `descripcion`. Until a field has that complete contract, either
omit its locale-specific semantic claim or render the reviewed source text with
the correct `lang` only where this document explicitly permits it.

### Premium extension boundary

Future premium content follows the same editorial, localization and structured-
data rules as the base profile. A new premium field may enter JSON-LD only when
it is public, visible on the same response, reviewed, normalized for its schema
type, localized under the preceding contract and covered by tests. Entitlement
activation alone never makes a field eligible.

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

## Description source locale

`descripcion_locale` is the source-language identifier for the canonical
`descripcion`, not the locale of the producer, country or current request:

- empty `descripcion` requires empty `descripcion_locale`;
- non-empty `descripcion` requires one lowercase code from the maintained
  description-source registry: every presentation locale plus the source-only
  `gl` and `eu` codes;
- the value is a base language from the locale registry, never a catalog scope
  such as `en-jp` or a language-region display tag;
- description-source support is not presentation support: source-only codes do
  not activate routes, cookies, manifests, dictionaries, sidecar targets or
  `hreflang` entries;
- the language is assessed from the actual row prose and may vary per row;
- editors set it when writing or materially replacing a description and never
  infer it from the country code.

`mensaje_comunidad_locale` follows the same source-language registry and pairing
rules for `mensaje a la comunidad`, but is not a translation-sidecar source in
this version. The public block marks the literal message with its source
language so alternate catalog routes do not misrepresent it as translated.

A language correction that leaves the prose unchanged still invalidates any
translation whose recorded `source_locale` no longer matches. A factual or
editorial correction belongs in the canonical area row; it is not made only in
a generated translation.

## Materialized translation sidecars

Localized descriptions are stored by country and target locale:

```text
data/csv/<country>/translations.<target-locale>.csv
```

Every sidecar uses this exact header:

```text
producer_id,field,source_locale,source_hash,text,origin,engine,engine_version,prompt_version,glossary_version
```

The sidecar rules are:

- `<target-locale>` is a supported presentation-locale code from the maintained
  registry and is the target language of every `text` in that file.
  It is not stored as a duplicate column. A supported sidecar may be prepared
  before its target locale is published in a manifest. A source-only locale is
  not a valid sidecar filename until it separately enters the presentation
  registry.
- `producer_id` must resolve to one current area row in the same country.
  `(producer_id, field)` is unique within a target file; row order is canonical
  by numeric `producer_id` and then `field`.
- Initially, the only allowed `field` is `descripcion`. Its `source_locale`
  must equal that row's current non-empty `descripcion_locale`, and a
  source-equals-target row is not stored because the canonical prose already
  supplies that variant.
- `source_hash` is the lowercase hexadecimal SHA-256 digest of the parsed
  canonical source text after Unicode NFC normalization and conversion of CRLF
  or CR line endings to LF. No trimming, case folding or whitespace collapsing
  is performed. A source text or source-locale change makes the translation
  stale.
- A literal spreadsheet carriage-return escape (`_x000d_`) may be converted to
  an LF only in the provider prompt. It remains part of the canonical source
  hash, is not a number or protected term, and must not leak into localized
  presentation.
- `text` is non-empty localized presentation. It must preserve the source's
  facts, numbers, URLs and protected terms and must not add claims or
  promotional language. Numeric literals are compared exactly. The ordered
  quantitative-fact fingerprint also covers an adjacent sign, percentage or
  currency marker, and registered abbreviated unit, so changes such as
  `100%` to `100`, `€12` to `$12`, or `4.000 kg` to `4.000 g` are invalid
  even when the digits remain present. An adjacent English decade suffix such
  as `80s` or `1990s` is not classified as the seconds unit; `s` is treated as
  seconds only when separated from the number. The exact numeric token remains
  mandatory while the decade marker may be rendered in the target language.
  Generated output is never repaired by silently reinserting a source quantity.
- `origin` is exactly `machine` or `reviewed`. `engine`, `engine_version`,
  `prompt_version` and `glossary_version` record the reproducible generation
  context; review changes only the origin and reviewed text, not the source to
  which the row is tied.
- A reviewed current variant may become the canonical description when an
  editor deliberately changes the canonical source language. Preserve the old
  canonical prose, when still useful, as a reviewed sidecar row tied to the new
  source and record `engine=canonical-source-pivot`; this declares a reviewed
  editorial move, not machine generation. Never rehash other variants as if
  they had been generated from the new source: review them against it or remove
  them until they are regenerated.
- A `machine` row is valid only when that exact engine/version, prompt,
  glossary and target locale resolve to one approved model in
  `data/reference/translation-engines.json`. Each approval cites the reviewed
  benchmark version and plan hash. An empty registry blocks every machine row;
  adding or changing an approval is the explicit provider-selection step. An
  approval may also retain the supplemental benchmark hash, reviewed counts,
  semantic-exception count and initial quantitative-integrity result so the
  publication decision is auditable without claiming that mechanical checks
  prove linguistic quality. A `reviewed` row keeps its historical generation
  metadata but does not depend on a current machine approval.
- A generator may replace or prune an obsolete `machine` row. It never
  overwrites or automatically deletes a `reviewed` row. A reviewed row with a
  stale source hash or locale is reported for renewed review and blocks
  publication just as a stale machine row does.
- Mechanical validation is necessary but never proves linguistic fidelity.
  The first published batch for a language requires semantic review by someone
  other than the row's generator, including every digit-bearing, quantitative
  or written-number row and a deterministic stratified sample of ordinary
  rows. A native-script coverage alarm is a contamination diagnostic, not a
  score to game: transliterate ordinary target-language words and place names
  naturally, preserve legitimate brands, and never add repetitive padding or
  new facts merely to raise the ratio.

For a requested locale, description resolution is deterministic:

1. use canonical `descripcion` when `descripcion_locale` equals the request;
2. otherwise use a current `reviewed` sidecar row;
3. otherwise use a current `machine` sidecar row;
4. otherwise expose no localized description variant.

A locale variant is not published in a sitemap or `hreflang` until every
non-empty description it renders resolves currently. An indexed localized page
must not silently fall back to canonical prose in another language.

The effective `i18n.publishedLocales` policy is the publication gate for
description data. For each area and each published locale, every row
whose `descripcion_locale` differs must have a current row in that locale's
country sidecar. Missing or stale rows block that area/locale scope. A valid
preparatory sidecar for a supported locale may remain partial while the locale
is not published.

Sidecars are checked-in, regenerable presentation artifacts. They are not
editorial evidence, do not establish or correct producer facts, and must not
contain contact, address, coordinate, verification, sales, ownership,
authorization or account state. Validation treats them as a dedicated schema,
recomputes source hashes from area rows and rejects stale, orphaned, duplicate
or cross-language entries before locale publication.

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

Publication is one completeness decision, not a routing-only switch. A country
with `publicationStatus=standby` remains in the CSV registry and every
editorial, evidence and account workflow, but it is absent from public
selectors, route resolution, compatibility rewrites, language alternates and
sitemaps; direct catalog requests return 404. Restoring `published` reuses the
maintained catalog and locale policy without a data migration. Within a
published country, a locale is added to an effective `publishedLocales` list
only after its dictionaries, territorial and unit labels, controlled-value
labels, metadata templates and current description variants are complete for
that exact scope. The manifest's country publication status and locale policy
drive routes, selectors, alternates and sitemap enumeration; do not maintain a
second release list in code.

Each real published page has localized title, description, Open Graph and
Twitter metadata and a self-referential canonical URL without `category` or
`highlight`. Producer images and source-authored facts remain shared. Its
`hreflang` set is reciprocal, contains itself and contains exactly the complete
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

## Categories

`data/reference/categories.json` is the machine-readable authority:

- `categories` is the exact allowed set. `categoria` contains one value, not a
  list, and identifies the producer's primary fit.
- `categorias adicionales` is optional. It contains exact values from the same
  registry joined with `|`, for example `Cerveza|Destilados y licores`. Empty
  tokens, duplicates, and repetition of the primary `categoria` are blocking.
  The order carries no ranking or evidentiary meaning.
- `preferredAliases` identifies non-canonical wording and produces a quality
  warning.
- `retiredCategories` records replacements. A retired value no longer present
  in `categories` is blocking; one temporarily present in both remains valid
  only during migration and warns.

Categories are shared catalog identifiers and are not translated per country.
Add one only for a durable producer type that cannot be represented by the
existing taxonomy; update the registry, UI mapping and tests together.

One producer remains one row even when it has several categories. Category
filters match the union of `categoria` and `categorias adicionales`, while
`categoria` remains the default category for compact presentation. The public
`category` URL parameter stays singular because each filter selects one facet.
Never duplicate a row to make it appear in another category, and never derive
additional categories automatically from free text in `productos estrella` or
`descripcion`.

Assign an additional category only when suitable public evidence establishes a
material product line made by the same qualifying productive unit. Resale,
ingredients, occasional hospitality output, and a product merely stocked in a
farm shop do not qualify. `docs/EDITORIAL.md` owns the decision rule.

CSV column names are stable schema identifiers and are not translated per
country. Their historical language is independent of the language used for
editor-authored prose.

## Verification and sales states

`docs/EDITORIAL.md` defines how to choose these states. This contract only
defines their representation.

- `verificacion` is optional. Its only stored token is `pendiente`, meaning the
  admitted row retains material doubt or needs further editorial review.
- Empty `verificacion` means that Chisan publishes no editorial verification
  label. It is not a certification and does not assert that every optional cell
  is current; each filled cell remains its own claim.
- `Verificado por el productor` is derived at request time from an exact active
  owner membership in PostgreSQL. It is presentation of an approved ownership
  claim, never a CSV token or an editorial assessment of the row's facts.
- `Venta online` is required and independent of `verificacion`.
- `Canal de venta` must be empty when sales are `no` or `no comprobado`. When
  sales are `sí`, it may remain empty while the demonstrated mechanism is still
  unclassified.

Allowed channel tokens:

| Token         | Demonstrated order mechanism                                        |
| ------------- | ------------------------------------------------------------------- |
| `ecommerce`   | Online checkout or payment flow.                                    |
| `whatsapp`    | Orders explicitly accepted through WhatsApp.                        |
| `email`       | Orders explicitly accepted by email.                                |
| `telefono`    | Orders explicitly accepted by phone.                                |
| `suscripcion` | Recurring subscription or box.                                      |
| `marketplace` | Producer or official collective storefront; not independent resale. |

Multiple tokens use `|`, for example `ecommerce|whatsapp`; order has no meaning.

## Geography contract

Coordinate sourcing and review live in `docs/GEOLOCATION.md`.

`lat` and `lon` are either both filled or both empty. They locate the productive
unit when known. A municipality centroid may be used as an explicit coarse
fallback, but it must not be represented as an exact farm or workshop location.
The CSV audit derives and reports the number of rows whose coordinates match
that fallback; no separate inventory is maintained.

The audit compares coordinates with reference centroids scoped first by country
and, for in-country homonyms, by region through
`data/reference/municipality-overrides.json`:

- more than `15 km` and up to `100 km`: actionable warning;
- more than `100 km`: blocking error;
- municipality absent from the reference data: skipped, not passed or failed.

Always read the skipped and centroid-fallback counts. A green audit does not
mean every row received a geographic check or has an exact producer location.
When a correct row conflicts with a bad or ambiguous centroid, fix the reference
or override; never move correct producer coordinates to satisfy the validator.

## Link contract

`web`, `Facebook`, `Instagram`, `Google Maps`, `enlace destacado 1` and
`enlace destacado 2` may be empty. When filled they must be valid HTTP(S) URLs,
must not contain an embedded username or password, and must refer to the row's
producer:

- `Facebook` must use a `facebook.com` host and identify a page/profile, not the
  network home, feed or unrelated post.
- `Instagram` must use an `instagram.com` host and identify a profile, not the
  network home, explore view or post permalink.
- `Google Maps` must use a recognized Google Maps host and resolve to the
  producer or productive unit. The canonical form is
  `https://www.google.com/maps/search/?api=1&query=<NAME>%2C<ADDRESS>&query_place_id=<PLACE_ID>`
  for a reviewed listing. The query is the required fallback; the Place ID is
  what anchors the URL to the accepted listing. Coordinate-only or text-only
  searches, shortened `maps.app.goo.gl` links and copied interface URLs are
  advisory migration warnings rather than blocking errors; do not add them to
  new or reviewed rows. When the represented unit has no matching listing,
  leave `Google Maps` empty and retain its reviewed position only in `lat`/`lon`.

Prefer a link cross-published by the producer. Without a direct cross-link,
retain it only when enough distinctive identity details agree, such as domain,
address, phone, email or productive location. A matching name or a live
HTTP response alone is not ownership; when the match remains ambiguous, leave
the field empty.

`direccion`, `lat`/`lon` and any `Google Maps` listing must identify the same
unit and role. Leave `Google Maps` empty when that unit has no reviewed listing,
including when `lat`/`lon` are exact, and for a centroid, locality-only or
otherwise approximate point. Constructing a coordinate or textual Maps search
does not establish that its current result belongs to the producer.

Syntax, an HTTP response or a directory listing does not establish ownership,
activity or online sales.

## Producer image contract

`imagen` may be empty. When filled it must:

- be a safe root-relative path to a supported image under `public/`;
- point to an existing asset;
- preferably use the canonical path
  `/productores/<country>/<region>/<area>/<slug>.webp`.

`npx pnpm check:images` blocks unsafe, unsupported, missing or unrecognizable
assets and warns on non-canonical paths, stems, dimensions, content/extension
mismatches and excessive file size. It also reports legacy coverage and
duplicate hashes for visual review. Visual sourcing and preparation live in
`docs/IMAGES.md`.

## Producer identity

The durable key is `(<country>, producer_id)`. It identifies one published row
and productive unit, not necessarily the parent company or organisation that
owns several units. Row order is never identity and may change freely.

A new row receives the country's next monotonically increasing number; never
renumber existing rows, fill a deleted gap or reuse an allocated ID. A merge
keeps the target row's ID. Corporate grouping, if needed later, is a separate
many-to-one identifier.

Multi-agent materialization must serialize the complete read-allocate-write
operation per country. Run the materializer through
`pnpm producer:ids:locked --countries es,it -- <command>` and calculate the next
ID inside that command, after the lock is acquired. The lock lives in Git's
shared common directory, so sibling worktrees coordinate without creating a
second catalog registry. A command that only reserves or prints IDs is unsafe:
the lock must remain held until every affected CSV write is complete.

`slug` is the readable routing identity and is unique within the country. Its
canonical URL is `/<country>/<area>/<slug>`. A slug should describe the producer
without mechanically repeating an area that is already present in the path,
but a municipality or area qualifier stays when it distinguishes homonyms.
Shared category slugs are reserved so a future `/<country>/<area>/<category>`
resolver cannot collide with a producer.

Keep a correct slug stable. Chisan is public, so a change is allowed only when it
materially encodes the wrong producer, duplicate, municipality, misleading typo
or a redundant geographic suffix covered by the canonical path, and only as a
dedicated routing migration that preserves the former URL with a compatibility
redirect. If redirect support is absent, defer the rename. In the same change,
update the image path, the current `keep` evidence slug, existing
`merge.targetSlug` references and affected docs. A pure routing rename does not
invent a `merge` evidence record; `merge` remains an entity de-duplication tombstone.
When two producer rows are actually merged, preserve that tombstone as required
by `docs/EVIDENCE_CONTRACT.md`.

Compatibility routes live in the country's `country.json` under
`producerRouteAliases`. Each key is the exact former `<area>/<slug>` path and its
numeric value is the row's durable `producer_id`; the redirect destination is
always derived from that producer's current area and slug in the CSV. Never store
a destination path or an alias chain, never shadow a current canonical route, and
never remove a demonstrated former route. Historical segments are stored decoded
and NFC-normalized; unlike current slugs, they may retain demonstrated Unicode,
but never `/`, `?`, `#`, an empty segment, or a control character. Redirects retain
the resolved catalog locale and only the public `category` and `highlight` query
context.

## Validation model

`npx pnpm check:csv` blocks publication for physical-schema errors, missing core
values, invalid controlled values or formats, duplicate country-local
`producer_id` or current `slug` values, invalid area aliases, invalid primary or
additional categories, malformed producer-route aliases, aliases without a
current country-local `producer_id` destination, canonical-route collisions,
incoherent field combinations and
geographic mismatches above `100 km`. The same pass emits non-blocking integrity
warnings for unusable social-profile links, non-canonical Google Maps links and
coordinates in the `15–100 km` review band.

The full and changed-only runs load shared references once and report the scope
that was actually checked: total rows, rows with and without coordinates,
municipio-centroid matches, skipped lookups and coordinates copied from a
centroid. A green result proves contract consistency, not geographic coverage
or exactness. Run the command with one CSV or directory path for detailed
warnings in that scope.

`npx pnpm check:defects` owns the advisory editorial worklist: probable duplicate
identities and descriptions, category drift, unresolved sales and other defects
that require cross-row context or judgement. Empty optional fields and short
descriptions are valid and are not reported as gaps.

Neither audit verifies source quality, producer eligibility, current activity,
link ownership or the truth of a value.

## Contract evolution

The schema grows only for a universal, durable product need that cannot be
represented by an existing field or by evidence. Before adding a field, define
its meaning, empty semantics, format, source expectations and runtime consumer.

A header change is one atomic migration: update this contract, the validator,
tests, runtime types/consumers and every CSV under `data/csv/**` in one dedicated
commit. Never introduce a country-only column or partially migrate the tree.
Controlled-value changes likewise update their machine-readable registry,
consumers and regression tests together. Validation commands and release gates
live in `AGENTS.md`.
