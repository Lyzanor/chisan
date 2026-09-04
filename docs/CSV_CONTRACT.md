# CSV Contract

## Purpose

This is the normative contract for the producer data published by Chisan. An area
CSV is the current product state: every non-empty cell is a public claim, and an
empty optional cell is valid incomplete knowledge.

`docs/CATALOG_WEB.md` owns public rendering, routes and indexing.
`docs/PRODUCER_CONTENT.md` owns related products, gallery items and links.
This document owns storage semantics: file shape, field meanings, missing
values, controlled values, cross-field invariants and validation. It does not
decide which entities qualify or how research is performed:

- `docs/EDITORIAL.md` owns eligibility, verification, online-sales decisions
  and the three operating levels with their handoffs.
- `docs/EVIDENCE_CONTRACT.md` owns decision provenance. Evidence explains a CSV
  decision but never overrides the CSV.
- `AGENTS.md` owns runtime boundaries, routing invariants, repository editing
  rules and validation gates.
- `docs/PRODUCER_GEOLOCATION.md` owns coordinate sourcing, geocoding and review.
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
- Every area row repeats those exact path slugs in required `country`, `region`
  and `area` cells. The values are portable location metadata, not a second
  registry: they must match the containing path byte-for-byte.
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
   route remains available. Indexing completeness is evaluated per producer.
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
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id,descripcion_locale,visitas guiadas,mensaje a la comunidad,mensaje_comunidad_locale,enlace destacado 1,enlace destacado 2,country,region,area,video,quien hay detras,quien_hay_detras_locale,historia,historia_locale,fecha ultimo cambio
```

The canonical header is defined in `lib/catalog/producer-schema.ts`. The form,
CSV audit and translation tools import shared definitions rather than keeping
independent length and locale lists. `data/reference/description-policy.json`
owns the description and preview limits.

All columns are physically present in every file. “Optional” below means that a
cell may be empty, never that its column may be omitted.

A schema widening is one atomic repository-wide change: update this header and
the row schema, its shared definition in `lib/catalog/producer-schema.ts`, and
every area CSV plus the contract fixtures. Update named
consumers when the new field affects their behavior, then run
`npx pnpm verify:ai`. The gate must reject a partial migration, but no
documentation, error message or test should treat the current column count as
permanent.

Files must be valid CSV, UTF-8 without BOM, with LF line endings. Quote commas,
quotes and line breaks using standard CSV escaping. Do not pad cells with
whitespace.

## Row schema

Do not confuse editorial admission with physical row requirements. A new
producer first passes `docs/EDITORIAL.md`: identity, qualifying activity and
current own offer, productive municipality, primary category, closure and
de-duplication must be resolved from public evidence. Only then is a row
created. The row must contain every `required` cell below; optional enrichment
may remain empty indefinitely.

Presence terms have exact meanings:

- **required:** every published row has a non-empty value;
- **optional:** the column is present but an unsupported or unpublished value
  stays empty;
- **paired:** both named cells are filled together or both are empty; and
- **conditional:** the value is allowed only when its stated dependency holds.

| Field | Presence | What to store | What not to store |
|---|---|---|---|
| `slug` | required | Stable public routing name in lowercase ASCII kebab-case, unique within the country | Display capitalization, a generated row number or an area suffix added without a real disambiguation need |
| `nombre` | required | The producer's public identity or brand, preserving its own spelling | An invented catalog label; use a legal name only when no distinct public identity exists |
| `municipio` | required | Municipality of the qualifying productive unit in public or official local spelling | Municipality of an unrelated shop, office, market or owner residence |
| `categoria` | required | One exact registry token describing the unit's defining material output | Everything its shop sells, an ingredient, flavour, service or guessed category |
| `productos estrella` | optional | Short comma-separated list of confirmed products, brands or appellations made by this unit | Generic examples, category labels, third-party assortment or prose |
| `direccion` | optional | Published address of the productive unit or clearly producer-facing premises | A private address, unrelated outlet or head office used merely to fill the cell |
| `descripcion` | optional | One or two complete producer-specific factual sentences, at most 400 Unicode characters | Promotion, generic filler, unsupported inference, URLs, citations, source/review narration or copied page boilerplate |
| `horario` | optional | Current published visiting, collection or public-opening hours whose purpose is clear | Production schedules, ambiguous hours or an old schedule whose currency is unsupported |
| `telefono` | optional | One public producer contact in strict E.164 form, for example `+34600112233` | Spaces, punctuation, extensions, several numbers or a private contact |
| `correo` | optional | One valid public producer email address | Several addresses, a private address or a guessed pattern |
| `web` | optional | Official producer HTTP(S) URL | Directory, reseller, unrelated corporate group or merely similar domain |
| `Facebook` | optional | Official Facebook page/profile HTTP(S) URL | Network home, feed, post permalink or ambiguously matched profile |
| `Instagram` | optional | Official Instagram profile HTTP(S) URL | Network home, explore view, post permalink or ambiguously matched profile |
| `Google Maps` | optional | Reviewed canonical Google Maps listing for the producer or productive unit, anchored by Place ID | Generated text/coordinate search, shortened interface link or listing for a shop/office mistaken for production |
| `lat` | paired | WGS84 decimal latitude (`-90..90`) for the same productive unit as `lon` | A standalone coordinate or a shop/office point substituted for production |
| `lon` | paired | WGS84 decimal longitude (`-180..180`) for the same productive unit as `lat` | A standalone coordinate or a shop/office point substituted for production |
| `imagen` | optional | Safe root-relative path to the reviewed local public asset | Remote image URL, missing file, generic placeholder path or unlicensed/unreviewed asset |
| `verificacion` | optional | Exact `pendiente` only when the admitted row retains material doubt; otherwise empty | `verificado`, ownership status, reviewer status or a holding label for an unadmitted candidate |
| `Venta online` | required | Exact `sí`, `no` or `no comprobado` according to the reviewed current order mechanism | Guessing `no` from silence, confusing contact or third-party resale with an order mechanism |
| `Canal de venta` | conditional | Allowed mechanism tokens joined with `\|`, only when `Venta online=sí` | Physical outlets, generic contact routes, unknown tokens or any value when sales are `no`/`no comprobado` |
| `categorias adicionales` | optional | Other exact category tokens for distinct material outputs made by this same unit, joined with `\|` | Repeating the primary category, duplicates, resale, ingredients, flavours or occasional output |
| `producer_id` | required | Immutable positive country-local safe integer allocated under the ID lock | Row position, reused/deleted ID, leading zeroes or an ID copied from another country as global identity |
| `descripcion_locale` | paired | Supported lowercase source-language code for a non-empty `descripcion` | Interface locale, inferred country language or a value when `descripcion` is empty |
| `visitas guiadas` | optional | Exact `sí` when explicitly offered, `no` when explicitly reviewed as not offered, otherwise empty | Inference from ordinary opening hours, a shop or general public access |
| `mensaje a la comunidad` | optional | Reviewed producer-authored public message in its original language, at most 1,000 Unicode characters | Editor-authored copy, HTML, embedded URLs, source notes, boilerplate, third-party claims or private workflow data |
| `mensaje_comunidad_locale` | paired | Supported lowercase source-language code for a non-empty community message | Interface locale or a value when the message is empty |
| `enlace destacado 1` | optional | Relevant public HTTP(S) article, interview or other page about this producer | Replacement for official links, evidence-only source, irrelevant promotion or private page |
| `enlace destacado 2` | conditional | Second distinct relevant public HTTP(S) page, only after link 1 | Duplicate/canonical equivalent of link 1 or a value while link 1 is empty |
| `country` | required | Exact lowercase country path slug from `data/csv/<country>/` | Display name, ISO label with different case or inferred producer nationality |
| `region` | required | Exact lowercase region directory slug containing the row | Display label, municipality, sales territory or another region |
| `area` | required | Exact lowercase `<area>` filename slug containing the row | Display label, municipality, nearest area or an area chosen independently of the tree |
| `video` | optional | One complete official HTTPS YouTube video URL for this producer | A channel, playlist, shortener other than `youtu.be`, non-YouTube host, tracking embed or unrelated video |
| `quien hay detras` | optional | Reviewed producer-authored description of the owners or team behind this productive unit, at most 2,000 Unicode characters | Private personal data, HTML, URLs, boilerplate, unsupported third-party claims or editor-invented biography |
| `quien_hay_detras_locale` | paired | Supported lowercase source-language code for non-empty `quien hay detras` | Interface locale, inferred country language or a value when the text is empty |
| `historia` | optional | Reviewed producer-authored account of the origins and development of this productive unit, at most 4,000 Unicode characters | Generic brand copy, HTML, URLs, unsupported claims, copied page boilerplate or private workflow narration |
| `historia_locale` | paired | Supported lowercase source-language code for non-empty `historia` | Interface locale, inferred country language or a value when the text is empty |
| `fecha ultimo cambio` | optional, system-managed | UTC calendar date (`YYYY-MM-DD`) of the most recent approved producer change materialized for this row | Producer input, ordinary editorial edit date, Git commit date, review timestamp with time or a manually inferred date |

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

`mensaje a la comunidad`, `quien hay detras` and `historia` are the narrow
attribution exceptions: they may originate as new first-party speech submitted
by an active producer member through the reviewed account workflow, so they
need not have been published at another public URL first. Their source is the
attributed submission, whose author, request and review trail remain in
PostgreSQL and Git rather than being copied into the CSV or public evidence
ledger. This exception does not turn objective claims inside the prose into
verified facts and does not relax public-source requirements for any other
field.

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
- `video` accepts a complete HTTPS YouTube URL for one concrete video. It is
  rendered as an external link, not a third-party iframe, so profile display
  does not introduce an automatic YouTube request or a second consent surface.
- `quien hay detras` and `historia` are producer-authored long-form profile
  prose. They retain internal spaces and LF line breaks, use their paired source
  locales and follow the same HTML, URL, formula-marker, boilerplate and
  third-party-claim exclusions as the community message. Their canonical limits
  are 2,000 and 4,000 Unicode characters; localized sidecar variants may use
  2,500 and 5,000 respectively so translation expansion does not force
  truncation.
- `fecha ultimo cambio` is never accepted in a proposal patch. Materialization
  derives it from the approved request's immutable `reviewed_at` timestamp in
  UTC and writes the calendar date together with the reviewed patch. It updates
  after any approved producer-submitted change, including a standard
  correction, but ordinary editorial CSV maintenance does not change it. It
  remains empty until a producer proposal is approved and materialized.
- Highlighted links are relevant third-party or producer pages such as press
  articles and interviews. They do not replace `web`, social links or evidence,
  are not necessarily official, and never count toward `verificacion`. The two
  links must remain distinct after standard URL canonicalization (for example,
  `https://example.com` and `https://example.com/` are the same URL), although
  the accepted CSV value keeps its original spelling.

## Expanded-profile fields

The current expanded content fields are `video`, `visitas guiadas`, `mensaje a
la comunidad`, `quien hay detras`, `historia`, `enlace destacado 1` and `enlace
destacado 2`, plus the three prose fields' paired locale metadata and the
system-managed `fecha ultimo cambio`. Their values are canonical CSV facts.
There is deliberately no `premium`, payment status, provider or external
payment ID column.

Repeated products, gallery items and named links live in the related package
defined by `docs/PRODUCER_CONTENT.md`, under the same presentation entitlement.
They do not add numbered columns to this schema.

PostgreSQL may retain proposals and audit snapshots, but it does not publish
these field values. The account domain owns the
producer-scoped `producer.profile.premium` entitlement and its commercial
workflows. CSV loading, review and public rendering are payment-provider
agnostic. The generic details table omits the premium field set; its dedicated
block renders non-empty CSV values only while the entitlement is active. If
account state is unavailable or the entitlement becomes inactive for any
reason, the base profile remains public and these values remain in CSV for
traceability but stay hidden and frozen. Payment never proves facts, changes
verification or bypasses review; standard corrections remain free.

## Translatable prose source locales

`descripcion_locale`, `quien_hay_detras_locale` and `historia_locale` are the
source-language identifiers for their paired canonical prose, not the locale of
the producer, country or current request:

- empty prose requires its paired locale cell to be empty;
- non-empty prose requires one lowercase code from the maintained
  description-source registry: every presentation locale plus the source-only
  `gl` and `eu` codes;
- the value is a base language from the locale registry, never a catalog scope
  such as `en-jp` or a language-region display tag;
- description-source support is not presentation support: source-only codes do
  not activate routes, cookies, manifests, dictionaries, sidecar targets or
  `hreflang` entries;
- the language is assessed from the actual row prose and may vary per row;
- editors set the paired locale when writing or materially replacing prose and never
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

Localized producer profile prose is stored by country and target locale:

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
- The allowed `field` values and paired source-locale columns are
  `descripcion`/`descripcion_locale`, `quien hay detras`/
  `quien_hay_detras_locale` and `historia`/`historia_locale`. A sidecar row's
  `source_locale` must equal the current paired locale, and a
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
- `text` is non-empty localized presentation. Its Unicode-character limit is
  500 for `descripcion`, 2,500 for `quien hay detras` and 5,000 for `historia`.
  It must preserve the source's
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
- A reviewed current variant may become canonical prose when an editor
  deliberately changes that field's canonical source language. Preserve the
  old canonical prose, when still useful, as a reviewed sidecar row for the
  same field tied to the new
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
  stale source hash or locale is retained for renewed review but is not rendered.
  Staleness is reported without blocking a canonical correction.
- Mechanical validation is necessary but never proves linguistic fidelity.
  The first published batch for a language requires semantic review by someone
  other than the row's generator, including every digit-bearing, quantitative
  or written-number row and a deterministic stratified sample of ordinary
  rows. A native-script coverage alarm is a contamination diagnostic, not a
  score to game: transliterate ordinary target-language words and place names
  naturally, preserve legitimate brands, and never add repetitive padding or
  new facts merely to raise the ratio.

For a requested locale, each translatable prose field resolves independently:

1. use the canonical field when its paired source locale equals the request;
2. otherwise use a current `reviewed` sidecar row for that exact field;
3. otherwise use a current `machine` sidecar row for that exact field;
4. otherwise expose no localized variant of that field.

A locale variant is not published in a sitemap or `hreflang` until every
non-empty translatable prose field it renders resolves currently. An indexed
localized page must not silently fall back to canonical prose in another
language.

The effective `i18n.publishedLocales` policy is the publication gate for
translatable prose. For each area and each published locale, every populated
allowed field whose paired source locale differs must have a current row for
that exact `(producer_id, field)` in the locale's country sidecar. Missing or
stale rows are actionable notices. They do not block canonical corrections;
`docs/CATALOG_WEB.md` defines which individual variants may be indexed. A valid preparatory sidecar for a
supported locale may remain partial while the locale is not published.

Sidecars are checked-in, regenerable presentation artifacts. They are not
editorial evidence, do not establish or correct producer facts, and must not
contain contact, address, coordinate, verification, sales, ownership,
authorization or account state. Validation treats them as a dedicated schema,
recomputes source hashes from area rows, reports stale entries, and rejects
orphaned, duplicate or structurally invalid entries.

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

Coordinate sourcing and review live in `docs/PRODUCER_GEOLOCATION.md`.

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

This section covers the base `imagen`; gallery records follow `docs/PRODUCER_CONTENT.md`.

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

The base schema grows for a durable producer-level need. Repeated products,
images and links belong in related content, so extending those collections does
not widen every area CSV. A base-header change still migrates all area files
together; optional columns are never silently omitted. Before adding a field, define
its meaning, empty semantics, format, source expectations and runtime consumer.

A header change is one atomic migration: update this contract, the validator,
tests, runtime types/consumers and every CSV under `data/csv/**` in one dedicated
commit. Never introduce a country-only column or partially migrate the tree.
Controlled-value changes likewise update their machine-readable registry,
consumers and regression tests together. Validation commands and release gates
live in `AGENTS.md`.
