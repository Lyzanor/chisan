# CSV Contract

## Purpose

This is the normative contract for the producer data published by Chisan. An area
CSV is the current product state: every non-empty cell is a public claim, and an
empty optional cell is valid incomplete knowledge.

All descriptive fields may be researched and written by Chisan editors before
a producer claims or edits a profile, including history, people, production
methods and news. Use supported public facts and neutral editorial prose; never
impersonate the producer. Premium is a current presentation choice, not a data
class, source requirement or restriction on editorial authorship. Approved
expanded-profile facts may be populated for any producer, regardless of premium
entitlement. Storage does not itself make a field visible in the public
profile: rendering and account editing retain their existing permission rules.
Keep supported values when a producer has no entitlement or it expires.

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
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id,descripcion_locale,visitas guiadas,mensaje a la comunidad,mensaje_comunidad_locale,enlace destacado 1,enlace destacado 2,country,region,area,video,quien hay detras,quien_hay_detras_locale,historia,historia_locale,fecha ultimo cambio,como producimos,como_producimos_locale,fecha novedades,certificaciones,certificaciones_detalle,visita_cita_previa,venta_profesionales,pedido_minimo,condiciones_envio,url_tienda
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

| Field                      | Presence                 | What to store                                                                                                               | What not to store                                                                                                     |
| -------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `slug`                     | required                 | Stable public routing name in lowercase ASCII kebab-case, unique within the country                                         | Display capitalization, a generated row number or an area suffix added without a real disambiguation need             |
| `nombre`                   | required                 | The producer's public identity or brand, preserving its own spelling                                                        | An invented catalog label; use a legal name only when no distinct public identity exists                              |
| `municipio`                | required                 | Municipality of the qualifying productive unit in public or official local spelling                                         | Municipality of an unrelated shop, office, market or owner residence                                                  |
| `categoria`                | required                 | One exact registry token describing the unit's defining material output                                                     | Everything its shop sells, an ingredient, flavour, service or guessed category                                        |
| `productos estrella`       | optional                 | Short comma-separated list of confirmed products, brands or appellations made by this unit                                  | Generic examples, category labels, third-party assortment or prose                                                    |
| `direccion`                | optional                 | Published address of the productive unit or clearly producer-facing premises                                                | A private address, unrelated outlet or head office used merely to fill the cell                                       |
| `descripcion`              | optional                 | One or two complete producer-specific factual sentences, at most 400 Unicode characters                                     | Promotion, generic filler, unsupported inference, URLs, citations, source/review narration or copied page boilerplate |
| `horario`                  | optional                 | Current published visiting, collection or public-opening hours whose purpose is clear                                       | Production schedules, ambiguous hours or an old schedule whose currency is unsupported                                |
| `telefono`                 | optional                 | One public producer contact in strict E.164 form, for example `+34600112233`                                                | Spaces, punctuation, extensions, several numbers or a private contact                                                 |
| `correo`                   | optional                 | One valid public producer email address                                                                                     | Several addresses, a private address or a guessed pattern                                                             |
| `web`                      | optional                 | Official producer HTTP(S) URL                                                                                               | Directory, reseller, unrelated corporate group or merely similar domain                                               |
| `Facebook`                 | optional                 | Official Facebook page/profile HTTP(S) URL                                                                                  | Network home, feed, post permalink or ambiguously matched profile                                                     |
| `Instagram`                | optional                 | Official Instagram profile HTTP(S) URL                                                                                      | Network home, explore view, post permalink or ambiguously matched profile                                             |
| `Google Maps`              | optional                 | Reviewed canonical Google Maps listing for the producer or productive unit, anchored by Place ID                            | Generated text/coordinate search, shortened interface link or listing for a shop/office mistaken for production       |
| `lat`                      | paired                   | WGS84 decimal latitude (`-90..90`) for the same productive unit as `lon`                                                    | A standalone coordinate or a shop/office point substituted for production                                             |
| `lon`                      | paired                   | WGS84 decimal longitude (`-180..180`) for the same productive unit as `lat`                                                 | A standalone coordinate or a shop/office point substituted for production                                             |
| `imagen`                   | optional                 | Safe root-relative path to the reviewed local public asset                                                                  | Remote image URL, missing file, generic placeholder path or unlicensed/unreviewed asset                               |
| `verificacion`             | optional                 | Exact `pendiente` only when the admitted row retains material doubt; otherwise empty                                        | `verificado`, ownership status, reviewer status or a holding label for an unadmitted candidate                        |
| `Venta online`             | required                 | Exact `sí`, `no` or `no comprobado` according to the reviewed current order mechanism                                       | Guessing `no` from silence, confusing contact or third-party resale with an order mechanism                           |
| `Canal de venta`           | conditional              | Allowed mechanism tokens joined with `\|`, only when `Venta online=sí`                                                      | Physical outlets, generic contact routes, unknown tokens or any value when sales are `no`/`no comprobado`             |
| `categorias adicionales`   | optional                 | Other exact category tokens for distinct material outputs made by this same unit, joined with `\|`                          | Repeating the primary category, duplicates, resale, ingredients, flavours or occasional output                        |
| `producer_id`              | required                 | Immutable positive country-local safe integer allocated under the ID lock                                                   | Row position, reused/deleted ID, leading zeroes or an ID copied from another country as global identity               |
| `descripcion_locale`       | paired                   | Supported lowercase source-language code for a non-empty `descripcion`                                                      | Interface locale, inferred country language or a value when `descripcion` is empty                                    |
| `visitas guiadas`          | optional                 | Exact `sí` when explicitly offered, `no` when explicitly reviewed as not offered, otherwise empty                           | Inference from ordinary opening hours, a shop or general public access                                                |
| `mensaje a la comunidad`   | optional                 | Reviewed current editorial notice or producer-authored message, at most 1,000 Unicode characters                        | Invented producer speech, HTML, embedded URLs, source notes, boilerplate or private workflow data     |
| `mensaje_comunidad_locale` | paired                   | Supported lowercase source-language code for a non-empty community message                                                  | Interface locale or a value when the message is empty                                                                 |
| `enlace destacado 1`       | optional                 | Relevant public HTTP(S) article, interview or other page about this producer                                                | Replacement for official links, evidence-only source, irrelevant promotion or private page                            |
| `enlace destacado 2`       | conditional              | Second distinct relevant public HTTP(S) page, only after link 1                                                             | Duplicate/canonical equivalent of link 1 or a value while link 1 is empty                                             |
| `country`                  | required                 | Exact lowercase country path slug from `data/csv/<country>/`                                                                | Display name, ISO label with different case or inferred producer nationality                                          |
| `region`                   | required                 | Exact lowercase region directory slug containing the row                                                                    | Display label, municipality, sales territory or another region                                                        |
| `area`                     | required                 | Exact lowercase `<area>` filename slug containing the row                                                                   | Display label, municipality, nearest area or an area chosen independently of the tree                                 |
| `video`                    | optional                 | One complete official HTTPS YouTube video URL for this producer                                                             | A channel, playlist, shortener other than `youtu.be`, non-YouTube host, tracking embed or unrelated video             |
| `quien hay detras`         | optional                 | Reviewed editorial or producer-authored introduction to the people behind this unit, at most 2,000 Unicode characters  | Private personal data, HTML, URLs, boilerplate, unsupported third-party claims or fabricated biography           |
| `quien_hay_detras_locale`  | paired                   | Supported lowercase source-language code for non-empty `quien hay detras`                                                   | Interface locale, inferred country language or a value when the text is empty                                         |
| `historia`                 | optional                 | Reviewed editorial or producer-authored account of this unit's origins and development, at most 4,000 Unicode characters | Generic brand copy, HTML, URLs, unsupported claims, copied page boilerplate or private workflow narration             |
| `historia_locale`          | paired                   | Supported lowercase source-language code for non-empty `historia`                                                           | Interface locale, inferred country language or a value when the text is empty                                         |
| `fecha ultimo cambio`      | optional, system-managed | UTC calendar date (`YYYY-MM-DD`) of the most recent approved producer change materialized for this row                      | Producer input, ordinary editorial edit date, Git commit date, review timestamp with time or a manually inferred date |

| `como producimos` | optional | Reviewed production methods, at most 2,000 Unicode characters | Unsupported certification claims, HTML, URLs or private information |
| `como_producimos_locale` | paired | Source language for non-empty production methods | A language when the text is empty |
| `fecha novedades` | optional, system-managed | Exact non-future UTC approval day of the current notice | Producer input, a date without a notice or dates of unrelated edits |

| `certificaciones` | optional | Distinct reviewed certification tokens joined with `\|` | Inferred or expired certification, or proof of all products being certified |
| `certificaciones_detalle` | paired | Official names, issuer, certified scope and optional operator codes for all selected tokens, at most 1,000 characters | Missing scope, private data or a claim without selected tokens |
| `visita_cita_previa` | optional | `cita previa obligatoria`, `cita previa recomendada` or `acceso libre en horario`; requires guided visits yes | A live open status or inferred booking policy |
| `venta_profesionales` | optional | `sí`, `no` or `bajo consulta` | Inferred wholesale availability or guaranteed professional pricing |
| `pedido_minimo` | optional | Reviewed minimum order with units or currency, at most 120 characters | An inferred minimum or a zero standing for unknown |
| `condiciones_envio` | optional | Reviewed delivery scope or conditions, at most 120 characters | Live shipping estimates or unsupported delivery promises |
| `url_tienda` | conditional | HTTP(S) entry page of the store where the reviewed online order starts: the producer's own shop or its storefront in an official collective marketplace; only with `Venta online=sí` and a storefront channel | A general home page when the shop has a more specific entry, product, cart, checkout or account pages, independent resale, a social profile or any value when sales are `no`/`no comprobado` |

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

`mensaje a la comunidad`, `quien hay detras` and `historia` additionally allow
these narrow attribution exceptions: they may originate as new first-party speech submitted
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
- `mensaje a la comunidad` can be a neutral editorial notice supported by public
  sources or the producer's own reviewed message. Editorial authorship must not
  be presented as a direct quote or first-person producer speech. It concerns the same
  productive unit, and excludes HTML, source notes, page boilerplate,
  embedded URLs and claims about third parties. It must not begin with a
  spreadsheet formula marker (`=`, `+`, `-` or `@`). Internal spaces and LF line
  breaks are preserved in its declared `mensaje_comunidad_locale`; they are not
  collapsed during proposal review or public loading. This first version does
  not materialize the message through translation sidecars.
- `video` accepts a complete HTTPS YouTube URL for one concrete video. It is
  rendered in a click-to-load player on the producer profile. The initial state
  loads the video's official thumbnail from `i.ytimg.com`, includes the reviewed
  URL and an external-link fallback, but contains no YouTube iframe. An explicit
  play action loads only the normalized video ID through YouTube's
  privacy-enhanced `youtube-nocookie.com` player; source query parameters are
  never forwarded.
- `quien hay detras` and `historia` accept reviewed editorial prose or
  producer-authored text. They retain internal spaces and LF line breaks, use their paired source
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

## Editorial purpose of profile text

Each field answers a different visitor question. Length limits are ceilings,
not targets; a short supported answer is complete enough. Do not distribute one
generic paragraph across several fields or invent detail to fill them.

| Field | Visitor question | Include | Keep elsewhere or omit |
| --- | --- | --- | --- |
| `descripcion` | What makes this producer worth understanding at a glance? | One or two factual sentences identifying its activity and at least one supported distinguishing fact, such as its own raw material, a specific method or a relevant connection to its place | Full chronology, team biographies, temporary announcements, contact details and lists of seals |
| `quien hay detras` | Who runs and carries out the work today? | Public names when available, roles, family or cooperative organization, and the people's concrete relationship to the productive work | Private biographies, an inferred family relationship, generic praise or a retelling of the whole history |
| `historia` | How did this productive project begin and develop? | Supported origins, founders, dates or periods, succession and material changes to the productive unit | An invented foundation year, regional history presented as company history, current team listings or temporary news |
| `como producimos` | How is the food or drink actually produced? | Concrete cultivation, husbandry, sourcing, processing, maturation or preservation practices attributable to this unit | Unexplained claims such as traditional, sustainable or artisanal; practices inferred from a product category; certification inferred from a method |
| `mensaje a la comunidad` (News) | What does the producer want visitors to know now? | One current editorial or producer-authored notice about a concrete development, seasonal offer, activity or temporary change, with explicit event dates when supplied | Evergreen presentation, a second description, an accumulated news archive or an editor-written announcement presented as producer speech |
| `certificaciones` + `certificaciones_detalle` | Which recognized designations apply, and to what exactly? | Allowed tokens plus the exact designation, issuer and certified products or activities for each one; public operator codes when available | Awards, directory membership, marketing badges, self-declared practices or certification of the whole catalog inferred from one product |

The description is a selective editorial introduction, not a compressed copy of
every section. It may briefly mention a distinguishing historical, human or
production fact; the corresponding section supplies the detail. This useful
overlap does not justify repeating the same paragraph. For example, in a
fictional case with supporting evidence, “Elabora quesos con leche de su propio
rebaño y los madura en la finca” conveys more than “Productor local comprometido
con la calidad y la tradición”. Examples never supply facts for a real row.

Chisan editors may prepare all these fields from supported public sources,
including before a producer joins. Use neutral editorial voice for researched
summaries and preserve authentic producer speech only when attributable to its
source or reviewed submission. The submission exceptions above do not change
objective claims into verified facts. Research notes and source citations belong
in evidence, not in the public text. Empty optional fields remain valid when
support is unavailable. Neither account editing permissions nor current public
visibility limits restrict this local editorial work.

`quien hay detras` remains an optional collective introduction. Separate people
belong in the `people` collection in `docs/PRODUCER_CONTENT.md`: at most three
records, each with a name, actual role, optional short presentation and optional
portrait. Do not encode JSON or an invented delimiter in the CSV prose, add
numbered person columns, or automatically split existing text into identities.
The introduction and individual records complement each other without becoming
two independently edited copies of the same biographies.

News keeps the historical CSV key `mensaje a la comunidad`. Its optional
`fecha novedades` records approval of the current notice, not the date of the
announced event or an expiry date. State an event's supplied calendar dates in
the notice instead of relying only on words such as tomorrow or this weekend.
Do not refresh the approval date to make an old notice look current. The single
notice and its date do not implement automatic expiry or a public news archive.

Certification details must let a reader match every selected token to its own
designation, issuer and scope. A useful prose pattern is “Designation — issuer —
certified products or activities — operator code, if available”, repeated for
each designation. This is writing guidance, not a new delimiter or parser.
Use only the existing controlled tokens; a label that does not fit requires a
separate vocabulary decision, never the nearest plausible token. Source URLs,
review dates and certificate evidence remain in the evidence ledger.

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
- `url_tienda` is allowed only when `Venta online=sí` and `Canal de venta`
  contains at least one storefront token: `ecommerce`, `marketplace` or
  `suscripcion`. The shared list, in public link priority, is
  `STOREFRONT_SALES_CHANNEL_VALUES` in `lib/catalog/producer-schema.ts`.
  Contact-only channels have no store page. Empty means that the store page is
  not recorded, not that the storefront lacks one; it is not inferred from
  `web`.

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

`url_tienda` is one URL per producer row. When the producer runs its own shop and
also sells through a collective storefront, record its own shop. The column was
appended to every area CSV in one migration. A stored owner proposal whose base
snapshot predates it no longer matches the current row hash, so materialization
reports a conflict and the owner resubmits against the current row.

## Geography contract

Coordinate sourcing and review live in `docs/PRODUCER_GEOLOCATION.md`.

`lat` and `lon` are either both filled or both empty. A populated pair identifies
a checked point of the productive unit. When the point cannot be confirmed,
retain the supported municipality and address and leave both coordinates empty.
Do not fill them with the centre of a municipality, postcode, street or
industrial estate. This meaning belongs to the existing pair; no precision
column is needed.

The CSV audit reports points matching a municipality centroid as review signals.
A coincidence alone does not prove a fallback or justify deleting coordinates;
check the point's sources and history before changing it.

The audit compares coordinates with reference centroids scoped first by country
and, for in-country homonyms, by region through
`data/reference/municipality-overrides.json`:

- more than `15 km` and up to `100 km`: actionable warning;
- more than `100 km`: blocking error;
- municipality absent from the reference data: skipped, not passed or failed.

Always read the skipped and centroid-match counts. A green audit does not
mean every row received a geographic check or has an exact producer location.
When a correct row conflicts with a bad or ambiguous centroid, fix the reference
or override; never move correct producer coordinates to satisfy the validator.

## Link contract

`web`, `url_tienda`, `Facebook`, `Instagram`, `Google Maps`,
`enlace destacado 1` and `enlace destacado 2` may be empty. When filled they
must be valid HTTP(S) URLs, must not contain an embedded username or password,
and must refer to the row's producer:

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
- `url_tienda` opens the storefront where this producer's online order starts.
  Its host may differ from `web`: a new path, a subdomain, a hosted shop such as
  Shopify or an official collective marketplace. It may equal `web` only when
  the website itself is the shop. The store must be run by or explicitly on
  behalf of the producer. Record the store's entry page without tracking or
  session parameters; a product, cart, checkout, account or search URL is too
  narrow.

Prefer a link cross-published by the producer. Without a direct cross-link,
retain it only when enough distinctive identity details agree, such as domain,
address, phone, email or productive location. A matching name or a live
HTTP response alone is not ownership; when the match remains ambiguous, leave
the field empty.

`direccion`, `lat`/`lon` and any `Google Maps` listing must identify the same
unit and role. Leave `Google Maps` empty when that unit has no reviewed listing,
including when `lat`/`lon` are exact. Constructing a coordinate or textual Maps
search does not establish that its current result belongs to the producer.

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

A previously committed allocation collision requires a documented correction,
not a redirect between unrelated producers. The bounded historical correction
record in `data/reference/producer-id-corrections.json` identifies the introducing
and correcting commits. The route-history check verifies the exact original CSV
blobs, unchanged row facts, newly admitted identities and corrected row count
before interpreting those erroneous assignments. It does not authorize future
renumbering, alter current IDs or replace the canonical CSV registry.

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
never remove a demonstrated former route while its producer remains published.
A reviewed purge removes aliases for the retired ID because they have no live
destination; do not transfer them to a different unit. Historical segments are stored decoded
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
municipio-centroid matches and skipped lookups. A green result proves contract
consistency, not geographic coverage or exactness. Run the command with one CSV
or directory path for detailed warnings in that scope.

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

## Production methods and dated news

`como producimos` is optional reviewed editorial or producer-authored plain text (maximum
2,000 Unicode characters), with required `como_producimos_locale` when nonempty.
Both cells are empty when unpublished. It describes cultivation, husbandry,
processing or preservation methods; official certification claims require public
evidence. It is premium-editable and rendered only in the expanded profile,
in its explicitly marked original language, like the community message.

`mensaje a la comunidad` retains its stored key and 1,000-character limit; the
public and owner labels are now News. It holds one current reviewed editorial or producer-authored notice.
`fecha novedades` is an optional exact non-future UTC day, empty without a
message. Materialization stamps the approval day only when the message or its
source language changes, and clears it when the message is removed. Older
undated messages remain valid. Other profile changes never refresh this date.
The producer cannot submit this system-managed field. Git preserves history;
this release does not send notifications or implement subscriptions. Future
notifications must distinguish accepted message revisions, not use the general
profile change date as an event or treat favorites as notification consent.

The header migration adds these three columns atomically to every area CSV.
Stored proposals based on an earlier header require a refreshed snapshot before
publication. Existing producer identity, routes and content references persist.
Product seasonality remains identity-bound related content; favorite counts
remain database-derived account state, never CSV cells.

## Certifications, visits and commercial conditions

These fields follow the same reviewed premium owner editor and expanded-profile
visibility boundary. Empty means unpublished. `certificaciones` accepts only
`ecologico`, `biodinamico_demeter`, `dop`, `igp`, `artesania_alimentaria`.
The shared token definitions live in `lib/catalog/producer-schema.ts`.
Every selection requires `certificaciones_detalle`: name its exact designation,
issuer and certified activities/products, with operator/registration code when
available. For `dop` and `igp`, begin with the exact protected name as `DOP <name>`
or `IGP <name>` and separate designation, issuer and scope with semicolons, for
example `DOP Cava; Consejo Regulador del Cava; instalación elaboradora de cava
certificada: <operator> (<address>)`; denomination consumers select on that name.
Multiple labels must each have an identifiable scope. Neither a token
nor a validator establishes validity. Editorial review requires a current public
certificate or operator register in the evidence ledger. Payment proves nothing.

Use [REGOE](https://www.mapa.gob.es/es/alimentacion/temas/produccion-eco/regoe/)
for ecological operator leads, and the relevant competent authority or governing
body for the operator and scope of a DOP/IGP or regional food artisan register.
[Demeter](https://demeter.net/certification/) is explicitly a private certification,
not a government seal or a synonym for self-described biodynamic practice.
Do not infer whole-farm, whole-catalog or product certification from ingredients,
a regional label name or an uncertified practice description. Recheck changes,
expiry and scope before updating the published claim. The Chisan demonstration
row is visibly fictional and has no real certificate.

Booking policy requires `visitas guiadas: sí`; clearing guided visits requires
clearing booking policy in the same proposal. `venta_profesionales` yes or on
request exposes an email contact action with a professional enquiry subject,
falling back to an existing telephone. No contact is invented and Chisan sends
nothing. Minimum orders and delivery conditions remain short source text; no
currency, unit, geography or fee is inferred from an empty value.
