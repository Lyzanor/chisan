# CSV Contract

## Source of truth
- Area files: `data/csv/[country]/[region]/[area].csv`
- Example: `data/csv/es/catalunya/barcelona.csv`
- `[country]` is the ISO 3166-1 alpha-2 code, and the same token names the route:
  `data/csv/es/**` is browsed at `/es`. There is no
  URL-to-disk mapping to keep in sync.
- Each country fills the two lower levels with its own subdivisions: a Spanish
  region is an autonomous community holding provinces, a Japanese one is a 地方
  holding prefectures. The contract does not change per country — the file is
  always an area and `?area=` is always how it is reached, so
  `data/csv/jp/kansai/kyoto.csv` is browsed at `/?area=kyoto`. What a country
  calls its levels is display text and lives in its `country.json`. Japanese
  prefecture and municipio names are rōmaji without macrons.
- Structured provenance: `data/evidence/[country]/[region]/[area].jsonl` explains editorial decisions but is not read by the app and never overrides the CSV. See `docs/EVIDENCE_CONTRACT.md`.
- Encoding: UTF-8 **without BOM** (a leading BOM is blocking; it usually means the file went through a spreadsheet export)
- Line endings: **LF** in every CSV (unified 2026-06-10, enforced by `.gitattributes`). Do not reintroduce CRLF.
- Header row is required.

## Canonical header (physical structure)
Every area CSV shares the exact same 20-column header, in this order:

```text
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta
```

- Every file carries all 20 columns physically; "optional" means the *value* may be empty, never that the column may be missing.
- Do not add, remove, or reorder columns in a single area. A structural change applies to every CSV at once, in a solo commit, with `verify:data` before and after.
- 0-based indices for column-aware scripts: 0 slug · 1 nombre · 2 municipio · 3 categoria · 4 productos estrella · 5 direccion · 6 descripcion · 7 horario · 8 telefono · 9 correo · 10 web · 11 Facebook · 12 Instagram · 13 Google Maps · 14 lat · 15 lon · 16 imagen · 17 verificacion · 18 Venta online · 19 Canal de venta.
- Validation and inspection entrypoints:
  - `pnpm check:csv`: blocking technical contract audit for every CSV
  - `node scripts/audit-csv.js --mode=contract data/csv/[country]/[region]/[area].csv`: blocking audit for one CSV
  - `pnpm check:csv:data-quality`: weekly data-quality audit with warnings for every CSV
  - `node scripts/audit-csv.js --mode=quality data/csv/[country]/[region]/[area].csv`: detailed warning audit for one CSV
  - `pnpm list:categories`: print the current valid `categoria` set

## Reference data
- `data/reference/municipalities.json` is a Wikidata-sourced lookup of municipality centroids (~8.300 Spanish entries with multilingual aliases, ~1.780 current Japanese municipalities keyed by their rōmaji and kanji names, and the 308 Portuguese concelhos). The geography warning rule uses it; nothing else in the app depends on it.
- Covered: every entity classified as a municipality of Spain, every municipality of Japan without a dissolution date, and every municipality of Portugal, in Wikidata. Adding a producer in any real municipio — even one not yet in any CSV — works out of the box.
- One catalog per country, added in `scripts/build-municipality-centroids.js`. A country absent from it is not half-checked, it is unchecked: every one of its rows lands in `geo-check skipped` and the audit still reports OK.
- Not covered on the Japanese side: Tokyo itself, which is a prefecture rather than a municipality. Rows there take the ward or city as `municipio` (`Setagaya`, `Hachioji`), which is also the right granularity.
- Japanese municipalities are frequently the product of 2000s mergers and can span tens of kilometres, so a correct row may still land in the 15–100 km warning band — Miyama in Nantan is 21,6 km from its own city centroid. Read the warning before assuming the `municipio` is wrong.
- Not covered: pedanías, núcleos and other sub-municipal localities (e.g. Alpatró inside La Vall de Gallinera, El Alquián inside Almería). Rows whose `municipio` is not in the lookup escape every geography check; the row is still subject to every other rule. The audit summary reports the count (`geo-check skipped: N rows`) so the gap stays visible — a rising number usually means a spelling the lookup does not carry (`Roa de Duero` for `Roa`, `Pamplona / Iruña` for `Pamplona`), which is worth fixing in the `municipio` column, not a genuine pedanía.
- Compound names: if Wikidata uses the official compound form (e.g. `Aínsa-Sobrarbe`) and the CSV uses the short form (e.g. `Aínsa`), the lookup may miss. Prefer the official form in the `municipio` column when known.
- `data/reference/municipality-overrides.json` is a hand-curated disambiguation layer for homonyms: the same `municipio` name shared by towns in different communities collides on one normalized key in `municipalities.json`, so the lookup can return the wrong town and raise a false geography warning. Each override key maps to an array of `{lat, lon, label, region}` candidates; the audit picks the one whose `region` matches the CSV path (`pickCandidate`). Add an entry when geo warnings show a whole municipio's producers landing hundreds of km from a same-named town in another area (e.g. `sallent` → Sallent in Catalunya, not Sellent in Valencia). Homonyms across countries live in the same layer and matter more, because the losing side measures its distance against another continent and fails the blocking rule rather than warning: `chiba` (Chiba in Kanto vs Chiva in Valencia), `hita`, `aya`, `mino`, `oto`, `porto` and `penafiel` are already resolved there. A country can also collide with itself — `lagoa` is both Algarve and Açores, 1.500 km apart — and that reads exactly the same way.
- Refresh: `node scripts/build-municipality-centroids.js`. Self-contained (native `fetch`, no extra deps), fetches Wikidata via SPARQL in ~1 minute. Re-run when the lookup may be stale or you suspect a missing municipio. Commit the regenerated JSON if it differs. It **merges by default**: keys already committed keep their centroid and only new ones are added, because which of two homonyms wins a shared key is arbitrary and a plain rebuild silently moves municipios that existing rows are checked against (measured once: 149 keys moved, 17 dropped). `--refresh` takes the rebuild verbatim; review that diff municipio by municipio.

## Column value requirements

All 20 canonical columns are physically present in every CSV. A column being present does not mean every row must have a non-empty value.

- Blocking non-empty values: `slug`, `nombre`, `municipio`, `categoria`, `verificacion`, `Venta online`.
- Blocking controlled values: `slug` format, `verificacion`, `Venta online`, `categoria`, `telefono` when present, `correo` when present, `Canal de venta` when present.
- Controlled values are matched **exactly**, not case- or accent-folded: `sí` and `verificado` pass, `Si` and `Verificado` are blocking drift.
- Paired values: `lat` and `lon` must both be present or both be empty.
- Coordinate precision: `lat`/`lon` may be an exact geocoded address or a municipal-centroid
  fallback from the geocoding gap-fill. `data/reference/geo-provenance.json` (regenerate with
  `node scripts/build-geo-provenance.mjs`) lists the rows whose coordinates match their
  municipality centroid; do not treat those as farm/workshop locations, and remove a row's entry
  by re-running the generator after replacing its coordinates with a real geocoded address.
- Optional-value fields: `imagen` and `Canal de venta`.
- Other empty values are allowed by the contract but may appear in `check:csv:data-quality` or `check:csv:completeness`.

## How the app uses columns
- Area catalog source: one CSV file per area in `data/csv/[country]/[region]/`.
- Filter by category: `categoria` (exact normalized match).
- Result title: `nombre`.
- Result metadata: `municipio`, `categoria`, `productos estrella`.
- Map point: `lat`, `lon`.
- Location cross-check: `direccion` should describe the same place as the coordinates.
- External links: `web`, `Facebook`, `Instagram`, `Google Maps`.
- Online sales status: `Venta online`, records whether the producer sells online through its own site or a concrete known channel.
- Order channel: `Canal de venta`, optional typology of how to place an order (`ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion`, `marketplace`), pipe-separated when several apply; meaningful only when `Venta online = sí`.
- Detail page: shows all columns as table rows.
- Detail image: `imagen` when present, otherwise a generic local placeholder.
- Verification level: `verificacion`, records how checked the row is.

## Normalization rules
- Collapse repeated spaces.
- Trim leading/trailing spaces.
- Search normalization:
  - lower case
  - remove diacritics
  - keep letters/numbers, collapse separators

## Editorial field conventions

Style rules for the free-text identity fields. Empty is always preferable to
invented or copied content (`docs/EDITORIAL_POLICY.md`, empty vs. false).

- `nombre`: the public brand as the producer writes it. Use the razón social
  only when no distinct brand exists; do not append the municipality or legal
  suffixes (S.L., S.C.) unless they are part of the public brand.
- `productos estrella`: a few real, confirmed products of this producer,
  comma-separated. No generic category fillers.
- `descripcion`: specific, verifiable facts about this producer (what it
  makes, how, since when, where). No promotional adjectives and no template
  text shared across rows — duplicated descriptions are flagged by
  `check:csv:data-quality` as probable import boilerplate.
- `horario`: only hours published by the producer; do not keep hours that
  reference a dead web, social profile or phone.

## Categories
- The valid `categoria` set lives in `data/reference/categories.json` (`categories`) and is enforced by `check:csv`.
- Inspect the current set with:
  ```bash
  npx pnpm list:categories
  ```
- `categoria`, when present, must exactly match one value from that set.
- Preferred aliases live in the same file (`preferredAliases`) and are reported by `check:csv:data-quality`; examples include `Lácteos y quesos`, `Bodega`, and `Pan y cereal`.
- Add a category only when no existing label fits a materially different producer type. Update `data/reference/categories.json`, docs, validator tests and `getCategoryIcon` together — a label with no branch in the icon cascade publishes as the generic basket.
- `retiredCategories` maps every label a consolidation folded away (2026-06-21,
  commits `d157b1f`, `41233aa`, `183f4eb`; 2026-08-03, the 38 → 24 pass) to the
  one that replaced it. Its intersection with `categories` is the state of the
  migration, and reading it beats any count in a doc:
  - **in both** — rows are still using the label, so it stays valid and
    `check:csv:data-quality` warns on each row. It is the `categoria-variante`
    queue of `check:defects`.
  - **retired only** — nothing uses it, and typing it again is a blocking
    error that names the replacement.
  A retired label leaves `categories` in the same lot that empties it. Bringing
  one back means arguing it into `categories` on purpose, not typing it.

## Verification levels
- The decision model — how to choose `pendiente`/`parcial`/`verificado`, online sales, and edge cases — lives in `docs/EDITORIAL_POLICY.md`. This section owns only allowed values and blocking rules.
- `verificacion` is required for every row. It is the single reliability indicator for agents and editors.
- Allowed values:
  - `pendiente`
  - `parcial`
  - `verificado`
- Legacy values such as `alta`, `media`, and `baja` are invalid. Use `verificado`, `parcial`, and `pendiente`.
- A row marked `verificado` must have coordinates and at least one external link (`web`, `Google Maps`, `Instagram`, or `Facebook`), so the level stays evidence-based. The blocking audit fails when this is not the case.
- For new and re-reviewed decisions, the matching evidence ledger records source URLs, inspection dates and supported claims. Areas migrate progressively; strict coverage is controlled by `data/evidence/coverage.json`.

## Online sales
- The decision model — when a channel qualifies as `sí`, the third-party resale rule — lives in `docs/EDITORIAL_POLICY.md`. This section owns only allowed values and blocking rules.
- `Venta online` is required for every row.
- Allowed values:
  - `sí`
  - `no`
  - `no comprobado`

## Sales channel
- `Canal de venta` is optional and complements `Venta online`. `Venta online` answers *whether* there is online sale; `Canal de venta` answers *how* an order is placed, so an agent knows which mechanism to use.
- It only carries meaning when `Venta online = sí`. Leave it empty when `Venta online` is `no` or `no comprobado`.
- Allowed tokens:
  - `ecommerce`: own online shop with a checkout / payment gateway.
  - `whatsapp`: orders through WhatsApp chat or catalogue.
  - `email`: orders by sending a product list to the `correo` address.
  - `telefono`: orders by phone call to the `telefono` number.
  - `suscripcion`: recurring box / subscription model (e.g. weekly basket).
  - `marketplace`: sells through a third-party platform acting for the producer — its own or official-collective storefront, not independent resale (see `docs/EDITORIAL_POLICY.md`).
- A producer may use several channels at once: join tokens with `|`, e.g. `ecommerce|whatsapp`. Order is not significant.
- An empty value means the channel has not been classified yet; it does **not** assert "no channel".
- Validation is blocking (`check:csv`): if present, every token must be in the allowed set and `Venta online` must be `sí`. Leaving the column empty stays valid everywhere, so incremental backfill is unaffected — only a *filled* value has to be coherent.

## Missing values
- Missing cell values are represented as empty strings internally.
- Detail table renders empty values as `—`.

## Blocking rules (`check:csv`)
- The header must be exactly the canonical 20-column header, in canonical order (see Canonical header). The comparison is positional, so a missing, duplicated, extra or reordered column all fail here, with a message naming the position.
- Line endings must be LF (no CR/CRLF anywhere in the file), and the file must not start with a UTF-8 BOM.
- `slug` is required and must be lowercase ASCII words separated by `-`.
- `nombre`, `municipio` and `categoria` are required: they are the row's title, its location and the facet it is filtered by.
- `slug` must be unique within its area CSV.
- `lat` and `lon` must both be present or both be empty.
- `lat`, when present, must be numeric and between `-90` and `90`.
- `lon`, when present, must be numeric and between `-180` and `180`.
- `lat`/`lon` must not be more than `100 km` from the `municipio` centroid (looked up in `data/reference/municipalities.json` + overrides). Beyond that the point belongs to a different town: almost always a swapped/wrong coordinate or a wrong `municipio`. The `15–100 km` band is a warning, not an error; rows whose `municipio` is not in the lookup are skipped.
- `web`, `Facebook`, `Instagram` and `Google Maps` may be empty, but if present must pass the link rules below.
- `imagen` may be empty, but if present must be a root-relative asset path inside `public/` such as `/productores/es/catalunya/barcelona/ejemplo.webp`.
- `verificacion` is required and must be one of `pendiente`, `parcial`, or `verificado`.
- `verificacion=verificado` requires coordinates and at least one external link (`web`, `Google Maps`, `Instagram`, or `Facebook`).
- `Venta online` is required and must be one of `sí`, `no`, or `no comprobado`.
- `categoria` must exactly match one of the registered/valid categories officially whitelisted in the audit tool.
- `telefono` may be empty, but if present must be in strict E.164 format (e.g. `+34600112233`).
- `correo` may be empty, but if present must be a single valid email address. A cell holding several addresses separated by `;`, `/` or `,` has no usable contact: pick the public one (prefer a role mailbox such as `info@` on the producer's own domain).
- `Canal de venta` may be empty, but if present every `|`-separated token must be in the allowed set and `Venta online` must be `sí`.

## Warning rules (`check:csv:data-quality`)

Warnings come in two tiers:

- **Optional-field gaps** flag an empty *optional* field. They are **always suppressed**: editorial policy treats empty as valid, and `check:csv:completeness` already tracks their coverage as a percentage. The summary reports the count as `suppressed (absent optional fields; tracked by check:csv:completeness)` instead of listing them, so the warning list stays a real worklist of actionable issues. Use `check:csv:completeness` to plan filling these gaps.
- **Actionable warnings** flag a probable defect (missing core field, bad coordinates, duplicate, invalid value). They always fire, because they need a fix regardless of `verificacion`.

Optional-field gaps (always suppressed → see `check:csv:completeness`):
  - `direccion` empty
  - `descripcion` empty or shorter than `30` characters
  - both `telefono` and `correo` empty
  - both `Facebook` and `Instagram` empty
  - `Google Maps` empty
  - coordinates present but `direccion` not useful for location review

Actionable warnings (always fire):
  - `Facebook` or `Instagram` pointing at the network itself rather than a producer profile: the bare domain, an `/explore` or logged-in feed URL, or an Instagram post permalink (`/p/<code>`). Facebook's `/p/<name>-<id>`, `/pages/<name>` and `/profile.php?id=` forms are real pages and do not warn.
  - duplicated normalized `nombre + municipio`
  - `descripcion` duplicated across different rows (shared template boilerplate; see Editorial field conventions)
  - near-duplicate `categoria` variants after normalization, folding a trailing
    `s` per word so `Carne` and `Carnes` in the same file are one group
  - category labels that should use one of the preferred category labels
  - a `categoria` listed in `retiredCategories` but still valid (see Categories)
  - `lat`/`lon` between `15 km` and `100 km` from the `municipio` centroid (looked up in `data/reference/municipalities.json` + overrides). Beyond `100 km` it is a blocking error instead (see Blocking rules). The message names the closest centroid — `closest centroid is X (Y km)` — so you can tell whether the `municipio` or the `lat`/`lon` is the wrong field. Rows whose `municipio` is not in the lookup are skipped silently.

## Link validation
- `web`, `Facebook`, `Instagram` and `Google Maps` may be empty, but if present must be valid `http://` or `https://` URLs.
- `imagen` may be empty, but if present must be a root-relative path to an image under `public/` and use a supported extension (`.avif`, `.gif`, `.jpg`, `.jpeg`, `.png`, `.svg`, `.webp`).
- `Facebook` must point to `facebook.com`.
- `Instagram` must point to `instagram.com`.
- `Google Maps` is an optional external profile/location link, not a map dependency.
- `Google Maps` must point to a Google Maps URL, for example:

```text
https://www.google.com/maps/place/...
https://www.google.com/maps/search/?api=1&query=...
https://maps.app.goo.gl/...
```

## Producer image contract
- `imagen` may be empty.
- When present, it must be a root-relative path to an asset under `public/`, for example `/productores/es/catalunya/barcelona/ejemplo.webp`.
- Canonical path: `/productores/<country>/<region>/<area>/<slug>.webp`, mirroring both the CSV layout and the producer `slug` (Madrid: `/productores/es/madrid/madrid/`). `check:images` warns when a row's asset lives outside its area folder, so a legacy top-level path does not go unnoticed.
- The file must exist and pass `npx pnpm check:images`.
- Visual composition, sourcing, naming conventions, and enrichment workflow live in `docs/IMAGES.md`.

## Producer identity
- `slug` is the primary identity for producer detail pages.
- Row order in each area CSV is editorial and may change without changing producer URLs.
- Canonical detail path format is `/p/[slug]`.
- Detail URLs must include `area=[area]` because slugs are unique within an area CSV rather than globally.
- Legacy `/p/[id]` and `/p/[id]-[slug]` URLs redirect to `/p/[slug]?area=[area]` when resolvable.
- `slug` should be lowercase ASCII with words separated by `-`, unique within the area CSV, and stable across row reordering. Keep a correct slug stable, but correct one that materially encodes the wrong identity, municipality, duplicate or misleading typo; preserve the history with evidence/docs updates.
