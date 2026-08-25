# Chisan Internationalization Migration Plan

## Status and purpose

This is the temporary execution and rollout plan for migrating Chisan from a
mixed-language catalog to explicit, crawlable localized variants without
changing producer or account identity. The framework migration and two
controlled rollout waves were completed on 2026-08-25. Keep this plan until the
remaining country activations and Phase 13 are complete; then move any residual
durable rules into the owning contracts and delete it.

The plan covers public and account-facing UI, country manifests, CSV prose,
generated translations, category presentation, public URLs, metadata,
`hreflang`, sitemaps, claims, favorites, producer-change requests, validators,
tests, rollout and rollback.

Repository state measured on 2026-08-24:

- 15 country catalogs;
- 695 area CSVs;
- 33,226 producer rows;
- 27,175 non-empty descriptions;
- 3,166,698 description characters, averaging 117 characters per description.

Implementation checkpoint on 2026-08-25:

- Phases 0–11 are complete, including explicit source locales on all 695 area
  CSVs, locale-aware routing and presentation, materialized translations,
  localized metadata and sitemaps, location onboarding, and account-identity
  invariants.
- Phase 12 is complete for Catalunya, Germany and Japan and for the second
  controlled activation: Argentina, Italy, Mexico, Netherlands and Portugal
  publish their local language plus English. Belgium defaults to French and
  English; Flanders publishes Dutch, French and English; Brussels publishes
  French, Dutch and English; and Liège publishes French, German and English.
- The catalog contains 17,969 materialized description translations across 20
  country-level sidecars. The second activation added 7,223 reviewed rows in 13
  sidecars to the first rollout's 10,746 machine rows in seven sidecars.
- Before translating the second activation, 80 weak canonical descriptions
  were improved and 1,932 description-source locales were corrected. Seventy-
  nine description edits preserve the exact quantitative fingerprint. The only
  new number is Mico's evidence-backed founding year, 1988.
- Every one of the 7,223 new rows received an initial Luna review. The
  publication review then covered 1,390 rows: all 735 high-risk rows, including
  all 730 digit-bearing or quantitative rows and all eight written-number or
  ordinal rows, plus a deterministic sample of 655 ordinary rows. It accepted
  1,303 rows as written and corrected 87. Large batches that showed language
  contamination were discarded and regenerated from the source in batches of
  at most 40 rows. The final gate revalidated all 7,223 rows against their
  current canonical sources.
- Luna remains ineligible for unattended `origin=machine` publication; these
  rows are materialized as `origin=reviewed`. A future model can replace or
  improve translations without changing producer identity or canonical facts.
- France, justified territorial variants for existing English defaults, and
  area-level policy review for Ireland, India and South Africa remain later
  Phase 12 work. Phase 13 is intentionally deferred until those targeted
  activations are complete.

The short factual descriptions make batch translation practical, but their
published output still needs stable materialization rather than a new model call
on every request.

## Outcomes

The completed system must provide all of the following:

1. Clean default routes such as `/es/barcelona`, `/de/berlin` and `/jp/tokyo`.
2. Alternate-language routes only when needed, such as
   `/ca-es/barcelona`, `/en-de/berlin` and `/en-jp/tokyo`.
3. Local-language priority for users whose explicit or browser language matches
   a published local variant.
4. English links for users browsing a catalog whose local languages they do not
   use.
5. A stable, single-language HTML response for every public locale URL.
6. One canonical producer row and one durable producer key, irrespective of the
   number of language variants.
7. Automatic description translation with a versioned, reviewable materialized
   cache; no runtime translation call in the page request.
8. Localized interface, metadata, territorial labels, categories and controlled
   value labels without translating technical CSV tokens.
9. No IP-based adaptation, no hidden cookie-dependent public-page variants and
   no duplicate claims, favorites, memberships or change requests by locale.
10. Optional first-visit location onboarding that resolves a covered catalog
    area without treating physical location as a language choice or retaining
    the user's raw coordinates.

## Locked product and architecture decisions

### URL convention

The first path segment is a **catalog scope**, not producer identity:

```text
/<country>/...                   country-default language
/<language>-<country>/...        alternate language
```

Examples:

| Content | URL | Resolved catalog key | Resolved language |
|---|---|---|---|
| Spain in Spanish | `/es/barcelona` | `es` | `es` |
| Spain in Catalan | `/ca-es/barcelona` | `es` | `ca` |
| Spain in English | `/en-es/barcelona` | `es` | `en` |
| Germany in German | `/de/berlin` | `de` | `de` |
| Germany in English | `/en-de/berlin` | `de` | `en` |
| Japan in Japanese | `/jp/tokyo` | `jp` | `ja` |
| Japan in English | `/en-jp/tokyo` | `jp` | `en` |

Rules:

- The existing `/<country>` route remains the only route for the country's
  configured default language.
- A redundant default composite such as `/es-es`, `/de-de` or `/ja-jp` returns
  a permanent redirect to `/es`, `/de` or `/jp` respectively.
- Country, area and producer slugs remain ASCII routing identifiers and are
  never translated.
- Existing `category` and `highlight` query parameter names and values remain
  compatible. Localizing category query values is deliberately outside this
  migration because it would add routing churn without improving the visible
  experience.
- A locale URL always returns the same language. Cookies and request headers may
  choose a link from a neutral page, but never change the content of an already
  selected public locale URL.
- Do not redirect based on IP. Do not redirect a valid locale URL based on
  `Accept-Language`.

This follows Google's guidance to use a different URL for each language, link
the variants explicitly, keep a page visibly in one language and avoid relying
on locale-adaptive crawling:

- <https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites>
- <https://developers.google.com/search/docs/specialty/international/localized-versions>

### Language choice

The system distinguishes three concepts:

- **country default locale**: the language served by `/<country>`;
- **territorial preferred locale**: an area or region language preferred when a
  user's explicit/browser language matches it;
- **requested locale**: the language encoded by the URL currently being
  rendered.

Internal link selection uses this order:

1. an explicitly selected language, if published for the target area;
2. a matching browser language, if published for the target area;
3. English, if the user language does not match a published local language and
   English is published;
4. the country default language.

This selection chooses the destination URL; it does not mutate the response of
the source or destination URL.

For the currently active rollout:

- Spain defaults to `es`;
- Catalunya publishes `ca`, `es` and `en`, with `ca` marked as its territorial
  preference;
- Germany defaults to `de` and publishes `de` and `en`;
- Japan defaults to `ja` and publishes `ja` and `en`;
- Argentina and Mexico default to `es` and publish `es` and `en`;
- Italy defaults to `it` and publishes `it` and `en`;
- Netherlands defaults to `nl` and publishes `nl` and `en`;
- Portugal defaults to `pt` and publishes `pt` and `en`;
- Belgium defaults to `fr` and publishes `fr` and `en`; Flanders prefers `nl`
  and also publishes `fr` and `en`; Brussels prefers `fr` and also publishes
  `nl` and `en`; Liège additionally publishes `de`;
- the global `/` selector remains an English `x-default` entry point.

The framework must support later country and area policies without code
registration. Belgium's policy is now explicit; India, Ireland and South Africa
still require area-level language review before activating new defaults. Do not
infer one national language from the ISO country code.

### User geolocation and area choice

Physical location and language are independent inputs:

```text
device position -> country + catalog area
explicit/browser language -> locale available for that area
both results -> destination URL
```

For example, a position resolved to Barcelona leads to `/ca-es/barcelona` for
a Catalan preference, `/es/barcelona` for Spanish and
`/en-es/barcelona` for English or an unsupported visitor language. Location
never implies Catalan, Spanish or English by itself.

First-visit behavior:

1. On the neutral `/` page, show a clear one-time onboarding panel offering
   **Use my location** and **Choose manually**.
2. Call `navigator.geolocation.getCurrentPosition()` only after the user presses
   the location button. Do not trigger the browser permission prompt merely on
   page load.
3. Resolve the coordinate to a covered Chisan country and area in the browser.
4. Apply the normal language-choice order to that area and navigate through the
   central catalog URL builder.
5. If the position is outside coverage, has poor accuracy, lies close to a
   boundary, times out or is denied, remain on `/` and show manual choices. A
   failed lookup must never guess the nearest area.
6. On later visits to `/`, offer **Continue in <area>** rather than silently
   redirecting. An explicit catalog URL always wins and is never replaced from
   stored location.

Use one-shot, normal-accuracy location with a finite timeout; do not use
`watchPosition`. The Geolocation API requires HTTPS and express browser
permission. Its result is sensitive and is used only for this immediate routing
decision:

- do not use IP geolocation;
- do not send coordinates to a reverse-geocoding provider;
- do not place `lat` or `lon` in a URL, cookie, analytics event or database;
- do not attach location to a Clerk/PostgreSQL account;
- discard the raw position after resolution;
- persist at most the derived `{ country, area }` preference and the onboarding
  dismissal state in versioned local storage;
- provide a visible way to choose a different area or forget the saved area.

Resolve areas with a reviewed, simplified, client-side boundary index under
`data/reference/catalog-area-boundaries/`. Each feature is keyed by the exact
catalog `(country, area)` and may be a multipolygon. Do not infer borders from
producer points or municipality centroids: those existing datasets describe
productive units and editorial checks, not territorial containment. Record the
boundary source, source date and redistribution licence, and activate location
routing only for areas with validated geometry.

This is separate from `docs/GEOLOCATION.md`, which owns producer-coordinate
editorial policy. Create a dedicated user-location contract during
implementation. The browser permission and data-minimization requirements are
grounded in the W3C Geolocation specification:

- <https://www.w3.org/TR/geolocation/>

### Producer and account identity

Locale is presentation only. Every account-domain reference remains:

```text
(country, producer_id)
```

Do not add locale, catalog scope, URL, slug or area to the durable key. In
particular:

- claims remain one claim per `(country, producer_id)`;
- memberships and authorization remain one membership per
  `(country, producer_id)`;
- favorites remain one record per user and `(country, producer_id)`;
- producer-change requests remain attached to `(country, producer_id)`;
- a localized URL passed as `returnTo` is navigation state only;
- admin links resolve a current path from the CSV and never persist that path as
  authorization state.

No database migration is required for locale routing. The existing account
contract already resolves area and slug from the CSV at render time. A language
preference is stored in a cookie, not added to producer identity or account
authorization.

### Canonical text and generated translations

The area CSV keeps the canonical editorial description and records its source
language. It does not grow one description column per locale.

Append one universal column to the canonical header:

```text
descripcion_locale
```

Rules:

- empty `descripcion` requires empty `descripcion_locale`;
- non-empty `descripcion` requires one code from the description-source
  registry (`en`, `es`, `ca`, `de`, `ja`, `fr`, `it`, `nl`, `pt`, `gl`, `eu`);
- presentation locales are `en`, `es`, `ca`, `de`, `ja`, `fr`, `it`, `nl` and
  `pt`; accepting source-only `gl` or `eu` prose never activates a route,
  cookie, dictionary, manifest locale, translation target or `hreflang`;
- the source language may vary per row;
- existing Spain descriptions backfill to `es`;
- existing non-Spain descriptions backfill to `en` unless a narrow audit proves
  that an individual row is authored in another language;
- new editorial work should normally be authored in a suitable local language,
  but evidentiary correctness takes priority over language completeness.

Automatic translations are materialized in a small number of country-level
sidecar files:

```text
data/csv/<country>/translations.<target-locale>.csv
```

One file can contain every translated producer field for that country because
`producer_id` is country-unique. Use the header:

```text
producer_id,field,source_locale,source_hash,text,origin,engine,engine_version,prompt_version,glossary_version
```

Initial `field` support is only `descripcion`. `origin` is `machine` or
`reviewed`. The generation tool may replace a current `machine` row but never a
`reviewed` row. A reviewed row is still tied to the current `source_hash` and
must be re-reviewed when the canonical source changes.

These sidecars are checked into Git as a stable, regenerable presentation cache.
They are not evidence, do not override producer facts and must never contain
contact, location, verification, ownership or authorization state.

The runtime resolution order for a description is:

1. canonical `descripcion` when its locale equals the requested locale;
2. current reviewed translation for the requested locale;
3. current machine translation for the requested locale;
4. no localized variant.

A localized route is not published in `hreflang` or the sitemap until every
non-empty description it renders has a current variant. Do not silently mix an
English description into a Catalan, German or Japanese indexed page.

### Fields that are not automatically translated

Preserve source-authored public facts on every language variant:

- `nombre`;
- `municipio`;
- `direccion`;
- official product, brand and appellation names;
- published `horario` text;
- URLs, email, phone and coordinates.

Translate their UI labels, not their values. A future source-backed official
name variant is an editorial identity feature and is outside the automatic
description pipeline.

### Taxonomy and controlled values

Keep the existing exact CSV category tokens and other controlled values. They
are storage identifiers, not display copy. This avoids a 33,226-row category
migration and preserves account patches, filters and evidence references.

Extend `data/reference/categories.json` without changing its current
`categories` string array:

```json
{
  "categories": ["Aceite"],
  "labels": {
    "Aceite": {
      "en": "Oil",
      "es": "Aceite",
      "ca": "Oli",
      "de": "Öl",
      "ja": "食用油"
    }
  },
  "icons": {
    "Aceite": "🫒"
  }
}
```

The URL filter may continue to carry the canonical token. The UI always calls
`getCategoryLabel(token, locale)`. Move icons out of language-dependent regular
expressions and into the registry. Translate display labels for verification,
online-sales and sales-channel tokens in the message dictionaries while keeping
the CSV values unchanged.

## Target repository shape

Use a dynamic public root layout so the initial HTML has the correct `lang`
attribute without reading request headers in every route. Next.js supports a
root layout under a dynamic segment for internationalization.

```text
app/
  (application)/
    layout.tsx                 # html/body for /, auth, account and admin
    page.tsx                   # x-default country selector
    acceso/**
    registro/**
    cuenta/**
    admin/**
    api/**
  (catalog)/
    [catalog]/
      layout.tsx               # resolves scope and emits html lang
      page.tsx                 # country landing
      [area]/
        page.tsx
        [segment]/page.tsx
  favicon.ico
  globals.css
  robots.ts
  sitemap.ts
```

There is no top-level `app/layout.tsx`; the two route groups provide root
layouts. Extract the shared font, Clerk and site-header shell so the two roots do
not duplicate behavior. A navigation between the application and catalog roots
may cause a full page load; that is acceptable at this boundary. Navigation
inside the catalog remains within the catalog root.

Add the following modules:

```text
lib/i18n/locales.ts                 locale types and validation
lib/i18n/catalog-scope.ts           parse/build short and composite scopes
lib/i18n/messages.ts                typed dictionary loader
lib/i18n/messages/{en,es,ca,de,ja,fr,it,nl,pt}.ts
lib/i18n/categories.ts              localized category labels/icons
lib/i18n/territories.ts             localized country/region/area labels
lib/i18n/translations.ts            source-hash and sidecar resolver
components/language-switcher.tsx
components/location-onboarding.tsx
lib/location/resolve-catalog-area.ts
scripts/generate-catalog-translations.mjs
scripts/check-catalog-translations.mjs
scripts/migrate-description-locales.mjs
scripts/build-catalog-area-boundaries.mjs
scripts/check-catalog-area-boundaries.mjs
data/reference/translation-glossary.json
data/reference/catalog-area-boundaries/<country>.geojson
data/reference/catalog-area-boundaries/sources.json
public/generated/catalog-geography/index.json
public/generated/catalog-geography/<country>.json
```

Keep reads in Server Components and pass only the required localized strings to
Client Components. Do not import every language dictionary into the map or area
selector client bundle. The `public/generated` geography files are deterministic
deployment assets built from `data/reference`; they are never edited directly.

## Country manifest contract

Extend `country.json` rather than registering locales in application code. The
target shape is:

```json
{
  "label": "Spain",
  "unit": { "one": "province", "many": "provinces" },
  "regionUnit": {
    "one": "autonomous community",
    "many": "autonomous communities"
  },
  "i18n": {
    "defaultLocale": "es",
    "publishedLocales": ["es", "en"],
    "labels": {
      "es": "España",
      "en": "Spain",
      "ca": "Espanya"
    },
    "unitLabels": {
      "es": { "one": "provincia", "many": "provincias" },
      "en": { "one": "province", "many": "provinces" },
      "ca": { "one": "província", "many": "províncies" }
    },
    "regionUnitLabels": {
      "es": {
        "one": "comunidad autónoma",
        "many": "comunidades autónomas"
      },
      "en": {
        "one": "autonomous community",
        "many": "autonomous communities"
      },
      "ca": {
        "one": "comunitat autònoma",
        "many": "comunitats autònomes"
      }
    }
  },
  "regions": [
    {
      "slug": "catalunya",
      "label": "Catalunya",
      "labels": {
        "ca": "Catalunya",
        "es": "Cataluña",
        "en": "Catalonia"
      },
      "i18n": {
        "preferredLocale": "ca",
        "publishedLocales": ["ca", "es", "en"]
      },
      "areas": [
        {
          "slug": "barcelona",
          "label": "Barcelona",
          "labels": {
            "ca": "Barcelona",
            "es": "Barcelona",
            "en": "Barcelona"
          }
        }
      ]
    }
  ]
}
```

Compatibility rules during migration:

- existing `label`, `unit` and `regionUnit` remain fallback values;
- `labels` are required for every published locale before activation;
- country `publishedLocales` controls the country landing and is the default for
  descendants; region/area `publishedLocales` overrides it only below that
  node;
- the catalog layout may recognize a composite scope used by any descendant,
  but each page validates its own effective locales. Therefore
  `/ca-es/barcelona` can be published while `/ca-es` still returns 404; publish
  the country landing only after its complete Catalan presentation is ready;
- `preferredLocale` affects link choice but never redirects a valid route;
- the validator rejects unsupported locale codes, missing default labels,
  duplicate locales and a preferred locale that is not published;
- live coverage counts and batch progress do not go into country `AGENTS.md`.

## Translation generator contract

The translation command is an editorial build tool, not a request-time service.
It must:

1. Accept explicit country, target locale and optional area/batch arguments.
2. Read canonical rows and their `descripcion_locale`.
3. Skip empty descriptions and source-equals-target rows.
4. Normalize the source and calculate a cryptographic `source_hash`.
5. Reuse a sidecar row only when source hash, engine version, prompt version and
   glossary version still match.
6. Submit bounded structured batches to a provider adapter.
7. Use a locked prompt that forbids additions, omissions, promotional rewriting
   and translation of protected proper nouns.
8. Validate response IDs, output count, empty text, URLs, exact numeric-token
   multisets, ordered quantitative facts, protected terms and suspicious length
   ratios before writing. A quantitative fact includes its sign, numeric
   literal, percentage or currency marker, and any registered adjacent unit.
9. Write rows sorted by `producer_id` then `field` with stable CSV formatting.
10. Never overwrite `origin=reviewed` automatically.
11. Prune obsolete machine rows and report stale reviewed rows without deleting
    them.
12. Print counts and estimated character volume without printing credentials.

Provider credentials are supplied only to the local/editorial generation
process. They are not public Next.js environment variables and are not required
by the deployed runtime.

Quantitative validation is fail-closed. Any numeric-token or ordered
quantitative-fact failure aborts immediately, is never submitted for automatic
repair and produces no sidecar write. The generator never edits, normalizes or
reinjects a rejected quantity itself. A provider may receive one isolated
repair request for a different mechanical defect, and that output must pass all
checks from scratch.

Each newly approved provider context must use a reviewed benchmark containing
at least 50 representative descriptions for each non-English presentation
target (`es`, `ca`, `de`, `ja`, `fr`, `it`, `nl` and `pt`), including:

- proper names and brands;
- DOP/IGP and other appellations;
- products with no clean translation;
- numbers, dates, ranges, signs, percentages, currencies and measurements;
- written numerals or ordinals in the source languages;
- accented Catalan and German text;
- Japanese script and romanized identities.

`data/reference/translation-benchmark.json` versions the explicit strata,
per-target minima and term lists used to select that sample. A benchmark plan
records the detected strata and coverage for every target, and run mode
recomputes them from source text before calling a provider. An approved
engine/model is then recorded in `data/reference/translation-engines.json`
together with its engine, model, prompt/glossary versions, benchmark version,
plan hash and approved target locales. Until that registry contains a matching
entry, neither the generator nor the checker accepts an `origin=machine` row.
An engine with any initial quantitative-integrity failure in the reviewed
benchmark is not eligible for that registry, regardless of whether a later
repair produced a structurally valid candidate.

Record the selected provider/model and prompt/glossary versions in generated
rows. Quality review may approve automatic publication for ordinary factual
descriptions while retaining human overrides for exceptions.

## Detailed implementation phases

### Phase 0 — Protect the shared worktree and account workflow

1. Read root `AGENTS.md`, this plan and every owning contract named below.
2. Run `git status --short`, `git diff --name-status` and `git diff --stat`.
3. Preserve all unrelated dirty files; work directly on `main` unless the user
   explicitly asks for a branch.
4. Inspect active producer-change requests before the CSV header migration.
   Adding `descripcion_locale` changes row hashes, so either drain all open
   requests or implement and test an explicit one-time snapshot rebase. Prefer a
   short submission freeze and drain because it adds no durable database logic.
5. Do not alter claims or memberships. Confirm with tests that the same producer
   opened through `/jp/...` and `/en-jp/...` resolves the same
   `(jp, producer_id)`.

Gate: the implementation session identifies unrelated edits and has an explicit
handling decision for every open producer-change request.

### Phase 1 — Update contracts before behavior

Update:

- `AGENTS.md`: add localized presentation sidecars and catalog-area boundaries
  to the authority map while keeping area CSV facts, transient device position
  and PostgreSQL account state separate;
- `docs/CSV_CONTRACT.md`: define `descripcion_locale`, sidecar schema, source
  hash behavior and untranslated fields;
- `docs/EDITORIAL.md`: replace one-language-per-country with per-row source
  locale plus reviewed automatic translations;
- new `docs/LOCATION_ROUTING.md`: define permission UX, boundary authority,
  privacy constraints, fallback behavior and the separation from producer
  geolocation;
- `docs/ACCOUNT_SYSTEM.md`: state that catalog scope and locale are presentation
  and that every localized link resolves the same durable key;
- `docs/OPERATIONS.md`: add translation-generation preflight, localized smoke
  checks and rollback;
- `README.md`: describe the short/default and composite/alternate URL forms.

Do not add translation progress tables to maintained contracts. This temporary
plan owns rollout order until completion.

Gate: documentation describes exactly one source of truth for facts, translation
materialization and account identity.

### Phase 2 — Add locale and manifest foundations with no URL change

1. Add locale types, `hasLocale`, BCP-47 display tags and dictionary loading.
2. Add `CatalogScope` with `country`, `locale`, `pathPrefix`, `isDefault` and
   `htmlLang`.
3. Extend the `Country`, `Region` and `AreaOption` runtime types with localized
   labels and effective locale policy.
4. Make the loader accept legacy manifest fields as fallbacks.
5. Extend `scripts/audit-csv.js` registry mode to validate the new manifest
   shape.
6. Add focused manifest fixtures for valid defaults, Catalunya overrides,
   missing labels, invalid locale pairs and inherited locales.
7. Initially configure current behavior only; do not publish a new locale until
   its UI and data are complete.

Gate: `verify:ai` passes and current URLs/rendered copy remain unchanged.

### Phase 3 — Localize UI primitives and categories

1. Define a typed message schema. The English dictionary is the key-complete
   reference; every published dictionary must satisfy the same type.
2. Move public catalog strings from pages and components into dictionaries:
   home, country selection, area selector, map, category chips, empty states,
   producer detail, field labels, links, image alt text and account actions.
3. Move category icons into `categories.json` and add localized labels.
4. Add localized display mappings for verification, online sales and sales
   channels. Keep raw CSV values unchanged.
5. Replace manual singular/plural concatenation with locale-aware message
   functions and `Intl.NumberFormat`.
6. Pass only the current dictionary subset to Client Components.
7. Add Japanese-capable font fallbacks and test line breaking, controls and map
   popups. Do not force Latin transliteration.
8. Keep staff-only admin workflow copy in English for this migration; localize
   shared producer/category/field presentation used by owners. A separate staff
   localization project can follow without affecting public URLs or data.

Gate: no public/account component renders a category token or controlled value
as display copy without a locale-aware formatter.

### Phase 4 — Perform the atomic CSV description-locale migration

1. Append `descripcion_locale` to the documented and executable canonical
   header.
2. Update the row loader, editable-field definitions, proposal validation,
   hashing, materialization and tests.
3. Mechanically append the column to all 695 area CSVs in one dedicated commit.
4. Fill `es` for non-empty Spanish catalog descriptions and `en` for the current
   remaining editorial descriptions. Leave the locale empty when description is
   empty.
5. Run targeted changed checks while iterating, inspect a country sample, then
   run the full gate.
6. Resume producer-change submissions only after new proposals capture a
   description language and old requests are resolved or explicitly rebased.

Gate: `check:csv` rejects every unpaired description/locale state; all 33,226
rows have the new physical header; account/materialization tests pass.

### Phase 5 — Add translation materialization

1. Add the glossary and provider-neutral generator.
2. Add sidecar parsing and resolution to `lib/csv-catalog.ts` through a small
   localization module; do not place translation logic in page components.
3. Teach `audit-csv.js` to classify `translations.<locale>.csv` separately from
   area CSVs and validate its dedicated header.
4. Add `check:translations` and `check:translations:changed` package commands.
5. Make `verify:data` include the translation check once sidecars are a
   published input.
6. Add tests for current, stale, missing, reviewed and obsolete translations.
7. Benchmark candidate providers against every required stratum, review the
   results, and lock the selected engine/model plus benchmark plan hash in the
   approved-engine registry before generating the first Catalan, German and
   Japanese batches.
8. Review samples before enabling any locale in a manifest.

Gate: the deployed app can render localized descriptions without network access
or runtime translation credentials, and a stale hash blocks locale publication.

### Phase 6 — Introduce catalog-scope routing centrally

1. Rename the route parameter concept from `country` to `catalog`; do not rename
   the CSV country key or database columns.
2. Implement one parser:
   - exact country code -> country default locale;
   - `<locale>-<country>` -> validated alternate locale;
   - redundant default composite -> permanent redirect to the short form;
   - unknown country/locale -> 404;
   - a recognized composite may continue to a descendant, but the country,
     region or area page returns 404 when that locale is not published for its
     own node.
3. Extend `CatalogNavigationContext` with locale/catalog scope and make
   `buildCatalogHref` and `buildProducerHref` the only public path constructors.
4. Remove direct public-path string interpolation, including admin
   `publicPath` construction.
5. Preserve query parameters across normalization redirects.
6. Add a language switcher that links to the same country/area/producer in each
   published locale and stores an explicit preference cookie after selection.
7. Make country/area selectors choose English for a destination whose published
   local languages do not match the user preference.
8. Keep claim/edit URLs under `/cuenta` unchanged.

Gate: a repository search finds no manually assembled public producer path
outside the navigation module and its tests.

### Phase 7 — Add optional location onboarding

1. Select reviewed administrative-boundary sources whose licences permit
   simplification, redistribution and deployment for the enabled countries.
2. Define a GeoJSON contract keyed by exact `country` and `area` slugs. Support
   multipolygons, islands and enclaves; never use a nearest-centroid fallback.
3. Add a validator that rejects invalid geometry, unknown catalog keys,
   duplicate ownership, missing source metadata and unintended gaps or overlaps
   in sampled fixtures.
4. Build a small global bounding-box index plus lazily loaded, simplified
   per-country polygon files. Test simplification against retained border and
   island fixtures before accepting the size reduction.
5. Implement client-only point-in-polygon resolution. Raw device coordinates
   must not cross a network boundary; fetching a country geometry file may
   reveal only the coarse country selected by the global index.
6. Add `LocationOnboarding` to `/` with the explanatory first-party UI before
   the native permission prompt. Keep manual country/area selection fully
   usable when JavaScript or geolocation is unavailable.
7. Request one position after user activation with `enableHighAccuracy: false`,
   a bounded timeout and a reasonable `maximumAge`. Use the reported accuracy
   radius to reject ambiguous border results.
8. Feed the derived country/area into the locale resolver, then navigate with
   `buildCatalogHref`. Never construct or redirect a localized path inside the
   geolocation component.
9. Store only the derived area and onboarding state in versioned local storage.
   Add controls to change or forget it; keep language preference separate.
10. Audit the dormant `lat`/`lon` public-query plumbing already present in the
    catalog. Remove it if no separately approved nearby-producer feature owns
    it; location onboarding must not reuse it.
11. Start with the Barcelona boundary as the pilot, then enable a country only
    when its intended catalog areas have reviewed geometry. Uncovered locations
    fall back to the selector without a guessed redirect.

Gate: a granted Barcelona fixture reaches the correct locale URL, denial and
ambiguity preserve the selector, and no raw coordinate appears in requests,
storage, URLs, analytics or account data.

### Phase 8 — Make the document shell locale-correct

1. Move the root layout to the two route groups shown in the target tree.
2. Resolve `[catalog]` in the catalog root layout and emit the correct
   `<html lang>` before rendering.
3. Extract shared fonts, Clerk provider and site header into reusable server
   components so behavior is not duplicated between root layouts.
4. Keep `params`, `searchParams`, `cookies()` and `headers()` asynchronous under
   Next.js 16 conventions.
5. Do not read `Accept-Language` inside a localized catalog layout. The URL owns
   the requested language.
6. Use the preference cookie only in the neutral application root and private
   account UI.

Gate: raw HTML for every sampled public route contains the correct `lang`, title,
navigation language and localized content before client JavaScript runs.

### Phase 9 — Add localized metadata, canonicals and `hreflang`

1. Generate localized title and description in each page's Server Component
   metadata function.
2. Make each real language variant self-canonical.
3. Add reciprocal `alternates.languages` entries for every published variant,
   including the current one.
4. Use explicit `hreflang`: generic `en`, `es`, `de`, `fr` and `nl` for
   languages spanning catalog territories; `ca-ES`, `ja-JP`, `it-IT` and
   `pt-PT` for the current territorial variants. Do not mechanically copy the
   URL token into `hreflang`.
5. Emit `x-default` only for the global `/` country selector. Do not invent an
   `x-default` producer or area URL; English remains an ordinary explicit
   alternate selected by navigation policy.
6. Keep filtered/highlight query pages canonical to their unfiltered localized
   area or producer URL.
7. Do not publish alternates whose UI or description coverage is incomplete.
8. Add localized Open Graph/Twitter metadata. Keep producer images shared.

Gate: an automated reciprocity test proves that each emitted alternate returns
the same complete alternate set and its own canonical.

### Phase 10 — Shard and localize the sitemap

The current catalog is below 50,000 pages in one language but exceeds Google's
per-sitemap URL limit once two producer variants are published. Replace the
single sitemap with `generateSitemaps` or an equivalent sitemap index.

1. Enumerate only canonical short defaults and published alternate variants.
2. Exclude redundant default composites, query filters, account/admin paths and
   incomplete locale pages.
3. Keep every shard below 50,000 URLs with margin for growth.
4. Emit the same `hreflang` alternate groups in sitemap entries or keep them in
   HTML, but do not maintain two independent implementations. Prefer one shared
   alternate builder regardless of output method.
5. Update behavior tests and the public-discovery feature-flag assertions.

Gate: sitemap count equals the locale registry's expected route count, every URL
is canonical, and no shard exceeds its configured ceiling.

### Phase 11 — Preserve account, claim and producer-change behavior

1. Pass `country` and `producerId` unchanged from every localized producer page
   into `ProducerAccountActions`.
2. Pass the localized current path only as validated `returnTo`.
3. Render favorites, claims and owner profile links with the user's explicit
   locale when published; otherwise use the country's short default route.
4. Keep claim-submission query parameters `country` and `producerId`; never pass
   the catalog-scope token as country.
5. Keep admin queues and database audit metadata country-based.
6. Replace admin `publicPath` string interpolation with the default path builder.
7. Test that favoriting or claiming through two language URLs finds the same
   existing record and cannot create a duplicate.
8. Test that changing language does not change edit authorization or the owner
   membership lookup.
9. Document that a slug or locale route change never retires a producer key.

Gate: no account table, unique index or authorization function contains locale;
all account-domain tests pass unchanged or with presentation-only assertions.

### Phase 12 — Activate locales in controlled batches

Activate a locale only after its dictionary, territory labels, category labels,
metadata templates and description sidecars pass the publication gate.
Locale activation and location-boundary activation remain independent: an area
may publish languages before location routing is ready, and a validated location
may resolve to the area's existing default language before alternates launch.
Never delay or guess one signal to manufacture the other.

Recommended batches:

1. **Barcelona pilot:** `/ca-es/barcelona`, `/es/barcelona`,
   `/en-es/barcelona`.
2. **Spain Catalunya:** Girona, Lleida and Tarragona, then the Catalunya region
   and Spanish country landing.
3. **Germany:** German short routes and English alternates.
4. **Japan:** Japanese short routes and English alternates.
5. **Straightforward local defaults:** Argentina, France, Italy, Mexico,
   Netherlands and Portugal.
6. **Existing English defaults:** United Kingdom and United States; add only
   justified territorial variants.
7. **Multilingual policy review:** Belgium, Ireland, India and South Africa,
   area by area.

For every batch:

1. generate/update sidecars;
2. review the intended diff and a stratified language sample;
3. enable the locale in `country.json`;
4. run `check:csv:changed`, `check:translations:changed` and `verify:ai`;
5. inspect metadata, selector links, claims and favorites in Preview;
6. deploy through the normal `main` workflow;
7. inspect Search Console after indexing is enabled.

### Phase 13 — Remove compatibility scaffolding

Only after all targeted countries are migrated:

1. make localized manifest fields mandatory where appropriate;
2. remove legacy single-label fallbacks from the loader;
3. delete unused hardcoded UI strings and category regexes;
4. delete temporary translation migration scripts that are not reusable;
5. move durable decisions from this plan into contracts;
6. delete this plan;
7. run the full gate and production smoke checklist.

## Required test matrix

### User location

- no native permission request occurs before the user selects **Use my
  location**;
- Barcelona plus Catalan preference resolves to `/ca-es/barcelona`;
- Barcelona plus Spanish preference resolves to `/es/barcelona`;
- Barcelona plus English or an unsupported visitor language resolves to
  `/en-es/barcelona`;
- denying, timing out, disabling JavaScript or lacking API support leaves the
  country/area selector usable;
- a low-accuracy or boundary-overlap result asks for a manual choice and never
  picks the nearest centroid;
- entering an explicit catalog URL never invokes or applies saved location;
- returning to `/` offers the saved area without an automatic redirect;
- changing or forgetting the saved area does not alter language preference,
  account data, claims or favorites;
- raw latitude/longitude never appears in a request, URL, referrer, cookie,
  local storage, analytics payload, server log or database record;
- boundary assets contain only declared catalog keys and retain their required
  island, enclave and border fixtures after simplification.

### Routing

- `/es/barcelona` resolves `country=es`, `locale=es`.
- `/ca-es/barcelona` resolves `country=es`, `locale=ca`.
- `/en-jp/tokyo` resolves `country=jp`, `locale=en`.
- `/es-es/barcelona` permanently redirects to `/es/barcelona`.
- invalid language/country combinations return 404.
- area aliases normalize while preserving locale and query parameters.
- producer slug compatibility redirects preserve locale.
- the language switcher preserves country, area, producer and safe filter state.

### Rendering

- HTML `lang`, title, navigation, metadata and visible description agree.
- Catalan/German/Japanese pages do not contain hardcoded English catalog chrome.
- categories and controlled values show localized labels but retain canonical
  tokens for filtering and forms.
- names, addresses, brands, URLs and contacts remain byte-for-byte source facts.
- a missing translation prevents publication rather than mixing languages.
- Japanese text renders with a viable font fallback and no hydration error.

### SEO

- canonical is self-referential for every locale variant.
- `hreflang` sets are reciprocal and include self.
- English uses the intended generic/territorial code consistently.
- `/` provides `x-default`.
- sitemap contains only canonical, published variants and remains sharded under
  the limit.
- locale routes respect the existing public-discovery noindex/robots flag.

### Data and translation

- description and locale are paired.
- sidecar producer IDs resolve in the same country.
- target locale matches the filename and is published/configured.
- hashes and generator versions are current.
- duplicate `(producer_id, field)` rows are rejected per target file.
- stale reviewed translations block publication and are never overwritten.
- translation generation preserves protected terms, URLs, exact numbers and
  the ordered sign/symbol/unit context of quantitative facts.
- a base description edit invalidates only its own generated variants.

### Accounts and claims

- two locale URLs expose the same favorite state.
- a claim submitted from either locale targets the same producer.
- an approved membership authorizes editing from every locale.
- `returnTo` returns to the originating localized path and rejects external
  paths.
- public admin/account links resolve a current default or preferred locale path.
- no locale appears in claim, favorite, membership or change-request keys.
- CSV header migration behavior for open producer-change requests is explicitly
  tested.

## Validation commands

During focused work:

```bash
npx pnpm check:csv:changed
npx pnpm check:translations:changed
npx pnpm check:catalog-geography
npx pnpm test:behavior
```

For data-only translation batches after the framework is complete:

```bash
npx pnpm verify:data
```

For every code, contract, validator, routing, account or schema change:

```bash
npx pnpm verify:ai
```

Do not treat a successful validator as proof that a translation is faithful.
The first batch for each language requires independent semantic sample review
by a reviewer that did not generate the assigned row; a human review may be
required by the editorial owner for a later rollout.

## Rollback

Locale rollout must be reversible without touching account data:

1. Remove the affected locale from the manifest's published locales.
2. Stop emitting it in selector links, `hreflang` and sitemaps.
3. Keep its translation sidecar for diagnosis; do not delete reviewed work during
   an incident.
4. Make the withdrawn composite route return a controlled redirect to the short
   default route or a temporary noindex response, according to whether its
   content was already indexed.
5. Redeploy the known-good application through the normal rollback procedure.
6. Do not migrate, delete or rewrite claims, memberships, favorites or producer
   changes; they remain valid throughout.

The short `/<country>` routes remain available through every rollout and
rollback, which keeps existing public links and producer claim entry points
stable.

## Remaining rollout checklist

For each later Phase 12 country activation:

1. Read root `AGENTS.md`, this plan and the target country's scoped guide.
2. Confirm default, territorial and alternate-language policy area by area;
   never infer it from the ISO country code.
3. Improve weak canonical descriptions before translation and record the exact
   source locale and source hash.
4. Generate materialized sidecars with an approved engine and run the complete
   quantitative, written-number and independent semantic publication review.
5. Activate only complete locales in `country.json`, then run the changed-data
   checks, `verify:ai` and localized Preview smoke checks.
6. Preserve the invariant that every locale URL resolves to the same
   `(country, producer_id)` and that rollback never touches account data.
7. Begin Phase 13 only after all targeted countries have completed this gate.
