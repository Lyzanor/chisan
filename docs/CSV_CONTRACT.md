# CSV Contract

## Purpose

This is the normative contract for the producer data published by KM0. An area
CSV is the current product state: every non-empty cell is a public claim, and an
empty optional cell is valid incomplete knowledge.

This document owns storage semantics: file shape, field meanings, missing
values, controlled values, cross-field invariants and validation. It does not
decide which entities qualify or how research is performed:

- `docs/EDITORIAL_POLICY.md` owns eligibility, verification and online-sales
  decisions.
- `docs/EVIDENCE_CONTRACT.md` owns decision provenance. Evidence explains a CSV
  decision but never overrides the CSV.
- `AGENTS.md` owns runtime boundaries, routing invariants, the editing workflow
  and validation gates.
- `docs/GEOLOCATION.md` owns coordinate sourcing, geocoding and review.
- `docs/IMAGES.md` owns image sourcing and preparation.

Validators prove conformance, not truth. Editorial correctness remains the
first requirement.

## Dataset registry

The only runtime producer source is:

```text
data/csv/<country>/<region>/<area>.csv
```

- `<country>` is a lowercase ISO 3166-1 alpha-2 code.
- `<region>` and `<area>` are stable lowercase ASCII kebab-case slugs. Their
  country-specific labels and ordering belong in `country.json`.
- The folder tree is the registry; adding a country, region or area is a data
  change, not a code change.
- `<area>` must be globally unique. It is the sole area key in public URLs, so
  the same slug in two countries would make one CSV unreachable.
- Every producer row belongs to the area containing its productive unit. A
  sales outlet, head office or brand origin does not determine placement.

## Canonical header

Every area CSV has exactly these 21 columns in this order. New columns are
appended so existing field positions remain stable:

```text
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
```

All columns are physically present in every file. “Optional” below means that a
cell may be empty, never that its column may be omitted.

Files must be valid CSV, UTF-8 without BOM, with LF line endings. Quote commas,
quotes and line breaks using standard CSV escaping. Do not pad cells with
whitespace.

## Row schema

| Field | Presence | Meaning and representation |
|---|---|---|
| `slug` | required | Stable producer identifier within the area; lowercase ASCII kebab-case. |
| `nombre` | required | Public producer identity or brand, not an invented label. |
| `municipio` | required | Municipality of the qualifying productive unit, using its public or official local spelling. |
| `categoria` | required | One exact token from the shared category registry. |
| `productos estrella` | optional | Short comma-separated list of confirmed producer products, brands or appellations. |
| `direccion` | optional | Published address of the productive unit or its producer-facing premises; never substitute an unrelated shop or head office. |
| `descripcion` | optional | Concise synthesis of producer-specific, verifiable facts. |
| `horario` | optional | Current published visiting, collection or public-opening hours whose purpose is clear. |
| `telefono` | optional | One public producer contact in strict E.164 form, for example `+34600112233`. |
| `correo` | optional | One valid public producer email address. |
| `web` | optional | Official producer HTTP(S) URL. |
| `Facebook` | optional | Official producer Facebook profile/page HTTP(S) URL. |
| `Instagram` | optional | Official producer Instagram profile HTTP(S) URL. |
| `Google Maps` | optional | HTTP(S) Google Maps listing for the producer or productive unit. |
| `lat` | paired | WGS84 latitude in decimal degrees, between `-90` and `90`. |
| `lon` | paired | WGS84 longitude in decimal degrees, between `-180` and `180`. |
| `imagen` | optional | Root-relative path to a local public image asset. |
| `verificacion` | required | Exact token: `pendiente`, `parcial` or `verificado`. |
| `Venta online` | required | Exact token: `sí`, `no` or `no comprobado`. |
| `Canal de venta` | conditional | Zero or more allowed channel tokens joined with `|`; only when `Venta online=sí`. |
| `categorias adicionales` | optional | Zero or more exact category tokens joined with `|`; each represents another material product line of the same productive unit. |

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

New candidates must pass the candidate gate in `docs/EDITORIAL_POLICY.md` before
they enter a CSV. `pendiente` supports progressive review of real producers; it
is not a holding state for speculative candidates. Legacy unresolved rows may
remain while they are investigated or purged.

## Editorial field conventions

- Source-authored identity and location data retain the producer's or competent
  authority's spelling: `nombre`, `municipio`, `direccion`, published hours,
  product names, brands and appellations. Do not translate proper names.
- Editor-authored prose uses one editorial language consistently per country.
  It is Spanish for `es` and English for the current remaining catalogs; a new
  country defaults to English. Language choice never changes field meaning or
  evidentiary standards.
- `nombre` is the identity under which the producer is publicly presented. Use
  a legal name only when no distinct public identity exists; omit legal suffixes
  unless they are part of the public name.
- `productos estrella` contains only concrete confirmed outputs. Do not repeat
  `categoria` or `categorias adicionales`, invent representative products or
  turn it into prose.
- `descripcion` states what this producer makes or does and may add supported
  place, method or history. Exclude promotional claims, search text, citations,
  source commentary and shared templates.
- `horario` is copied only when the source makes its meaning and currency clear.
  Empty is preferable to an old or ambiguous schedule.

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
farm shop do not qualify. `docs/EDITORIAL_POLICY.md` owns the decision rule.

CSV column names are stable schema identifiers and are not translated per
country. Their historical language is independent of the language used for
editor-authored prose.

## Verification and sales states

`docs/EDITORIAL_POLICY.md` defines how to choose these states. This contract
only defines their representation and structural floor.

- `verificacion` is required. `verificado` additionally requires both
  coordinates and at least one external identity/location link among `web`,
  `Facebook`, `Instagram` and `Google Maps`.
- That structural floor is not proof of verification, and `verificado` does not
  certify that every optional cell is current. Each filled cell remains its own
  claim.
- `Venta online` is required and independent of `verificacion`.
- `Canal de venta` must be empty when sales are `no` or `no comprobado`. When
  sales are `sí`, it may remain empty while the demonstrated mechanism is still
  unclassified.

Allowed channel tokens:

| Token | Demonstrated order mechanism |
|---|---|
| `ecommerce` | Online checkout or payment flow. |
| `whatsapp` | Orders explicitly accepted through WhatsApp. |
| `email` | Orders explicitly accepted by email. |
| `telefono` | Orders explicitly accepted by phone. |
| `suscripcion` | Recurring subscription or box. |
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

`web`, `Facebook`, `Instagram` and `Google Maps` may be empty. When filled they
must be valid HTTP(S) URLs and refer to the row's producer:

- `Facebook` must use a `facebook.com` host and identify a page/profile, not the
  network home, feed or unrelated post.
- `Instagram` must use an `instagram.com` host and identify a profile, not the
  network home, explore view or post permalink.
- `Google Maps` must use a recognized Google Maps host and resolve to the
  producer or productive unit.

Syntax, an HTTP response or a directory listing does not establish ownership,
activity or online sales.

## Producer image contract

`imagen` may be empty. When filled it must:

- be a safe root-relative path to a supported image under `public/`;
- point to an existing asset;
- preferably use the canonical path
  `/productores/<country>/<region>/<area>/<slug>.webp`.

`npx pnpm check:images` blocks unsafe, unsupported or missing assets and warns
on non-canonical paths, stems or dimensions. Visual sourcing and preparation
live in `docs/IMAGES.md`.

## Producer identity

`slug` is unique within its area and, together with `area`, identifies the
published row. Row order is never identity and may change freely.

Keep a correct slug stable. Change it only when it materially encodes the wrong
producer, duplicate, municipality or misleading typo. In the same change,
update the CSV, image path, evidence and affected docs; when the old slug existed
in Git, preserve continuity with the appropriate `merge` evidence record.
Routing behavior remains an application concern; its stable identity invariants
live in `AGENTS.md`.

## Validation model

`npx pnpm check:csv` blocks publication for physical-schema errors, missing core
values, invalid controlled values or formats, duplicate area-local slugs,
invalid primary or additional categories, incoherent field combinations and
geographic mismatches above `100 km`.

`npx pnpm check:csv:data-quality` is an advisory defect worklist. It reports
probable social-link errors, duplicate `nombre + municipio`, duplicated long
descriptions, category drift and coordinates in the `15–100 km` band. Empty
optional fields and short descriptions are counted as suppressed gaps, not
warnings: incompleteness is valid and must not be “fixed” with weak data.

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
consumers and regression tests together.

Use:

```bash
npx pnpm check:csv                 # blocking contract, all CSVs
npx pnpm check:csv:data-quality    # advisory data defects
npx pnpm check:images              # image field and assets
npx pnpm verify:data               # data/reference/evidence/image change
npx pnpm verify:ai                 # contract, validator or behavior change
```
