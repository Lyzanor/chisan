# CSV Contract

## Source of truth
- Province files: `data/csv/[comunidad]/[provincia].csv`
- Barcelona file: `data/csv/catalunya/barcelona.csv`
- Structured provenance: `data/evidence/[comunidad]/[provincia].jsonl` explains editorial decisions but is not read by the app and never overrides the CSV. See `docs/EVIDENCE_CONTRACT.md`.
- Encoding: UTF-8 (BOM tolerated)
- Line endings: **LF** in every CSV (unified 2026-06-10, enforced by `.gitattributes`). Do not reintroduce CRLF.
- Header row is required.

## Canonical header (physical structure)
Every province CSV shares the exact same 20-column header, in this order:

```text
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta
```

- All 50 files carry all 20 columns physically; "optional" below means the *value* may be empty, never that the column may be missing.
- Do not add, remove, or reorder columns in a single province. A structural change applies to every CSV at once, in a solo commit, with `verify:data` before and after.
- 0-based indices for column-aware scripts: 0 slug · 1 nombre · 2 municipio · 3 categoria · 4 productos estrella · 5 direccion · 6 descripcion · 7 horario · 8 telefono · 9 correo · 10 web · 11 Facebook · 12 Instagram · 13 Google Maps · 14 lat · 15 lon · 16 imagen · 17 verificacion · 18 Venta online · 19 Canal de venta.
- Validation entrypoints:
  - `pnpm check:csv`: blocking technical contract audit for every CSV
  - `node scripts/audit-csv.js --mode=contract data/csv/[comunidad]/[provincia].csv`: blocking audit for one CSV
  - `pnpm check:csv:data-quality`: weekly data-quality audit with warnings for every CSV
  - `node scripts/audit-csv.js --mode=quality data/csv/[comunidad]/[provincia].csv`: detailed warning audit for one CSV

## Reference data
- `data/reference/municipios.json` is a Wikidata-sourced lookup of Spanish municipality centroids (~8.300 entries with multilingual aliases). The geography warning rule uses it; nothing else in the app depends on it.
- Covered: every entity classified as a municipality of Spain in Wikidata. Adding a producer in any real municipio — even one not yet in any CSV — works out of the box.
- Not covered: pedanías, núcleos and other sub-municipal localities (e.g. Alpatró inside La Vall de Gallinera, El Alquián inside Almería). The audit silently skips rows whose `municipio` is not in the lookup; the row is still subject to every other warning.
- Compound names: if Wikidata uses the official compound form (e.g. `Aínsa-Sobrarbe`) and the CSV uses the short form (e.g. `Aínsa`), the lookup may miss. Prefer the official form in the `municipio` column when known.
- `data/reference/municipios-overrides.json` is a hand-curated disambiguation layer for homonyms: the same `municipio` name shared by towns in different communities collides on one normalized key in `municipios.json`, so the lookup can return the wrong town and raise a false geography warning. Each override key maps to an array of `{lat, lon, label, community}` candidates; the audit picks the one whose `community` matches the CSV path (`pickCandidate`). Add an entry when geo warnings show a whole municipio's producers landing hundreds of km from a same-named town in another province (e.g. `sallent` → Sallent in Catalunya, not Sellent in Valencia).
- Refresh: `node scripts/build-municipio-centroids.js`. Self-contained (native `fetch`, no extra deps), fetches Wikidata via SPARQL in ~30 seconds. Re-run when the lookup may be stale or you suspect a missing municipio. Commit the regenerated JSON if it differs.

## Required columns
- `slug`
- `nombre`
- `municipio`
- `categoria`
- `productos estrella`
- `direccion`
- `descripcion`
- `horario`
- `telefono`
- `correo`
- `web`
- `Venta online`
- `Facebook`
- `Instagram`
- `Google Maps`
- `lat`
- `lon`
- `verificacion`

## Optional columns
- `imagen`
- `Canal de venta`

Optional = the value may be empty. The column headers themselves are present in every CSV (see Canonical header).

## How the app uses columns
- Province catalog source: one CSV file per province in `data/csv/[comunidad]/`.
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

## Preferred category labels
- Keep category labels stable and prefer the Barcelona-style labels below when adding or correcting rows:
  - `Lácteos y quesos` instead of `Quesos y lácteos` or `Lácteos`
  - `Bodega` instead of `Vino`, `Vinos y bebidas`, or `Bodega y licores`
  - `Pan y pastelería` instead of `Panadería`, `Panadería y repostería`, `Pastelería y panadería`, `Dulces y panadería`, `Pan y repostería`, or `Pan y bollería`
- New category labels should be rare and should describe a materially different producer type.

## Verification levels
- The decision model — how to choose `pendiente`/`parcial`/`verificado`, online sales, and the edge cases — lives in `docs/EDITORIAL_POLICY.md`. This section owns only the structural contract: allowed values and blocking rules.
- `verificacion` is required for every row. It is the single reliability indicator for agents and editors.
- Allowed values:
  - `pendiente`: added for catalog coverage, but still needs review.
  - `parcial`: producer exists and is localized, but some fields are inferred or based on secondary sources.
  - `verificado`: name, municipio, location and contact/link data have been cross-checked against a primary or clearly reliable source.
- Legacy values such as `alta`, `media`, and `baja` are invalid. Use `verificado`, `parcial`, and `pendiente`.
- A row marked `verificado` must have coordinates and at least one external link (`web`, `Google Maps`, `Instagram`, or `Facebook`), so the level stays evidence-based. The blocking audit fails when this is not the case.
- For new and re-reviewed decisions, the matching evidence ledger records source URLs, inspection dates and supported claims. Provinces migrate progressively; strict coverage is controlled by `data/evidence/coverage.json`.

## Online sales
- `Venta online` is required for every row.
- Allowed values:
  - `sí`: the producer sells online through its own site or through a concrete, identified sales channel.
  - `no`: online sales have been checked and no online sales channel was found.
  - `no comprobado`: default value until the row is reviewed for online sales.
- Do not infer `sí` from having a `web` link. Use `sí` only when the site or channel clearly supports online purchase or order.

## Sales channel
- `Canal de venta` is optional and complements `Venta online`. `Venta online` answers *whether* there is online sale; `Canal de venta` answers *how* an order is placed, so an agent knows which mechanism to use.
- It only carries meaning when `Venta online = sí`. Leave it empty when `Venta online` is `no` or `no comprobado`.
- Allowed tokens:
  - `ecommerce`: own online shop with a checkout / payment gateway.
  - `whatsapp`: orders through WhatsApp chat or catalogue.
  - `email`: orders by sending a product list to the `correo` address.
  - `telefono`: orders by phone call to the `telefono` number.
  - `suscripcion`: recurring box / subscription model (e.g. weekly basket).
  - `marketplace`: sells through a third-party platform or aggregator.
- A producer may use several channels at once: join tokens with `|`, e.g. `ecommerce|whatsapp`. Order is not significant.
- An empty value means the channel has not been classified yet; it does **not** assert "no channel".
- Validation is a non-blocking warning today (`check:csv:data-quality`): if present, every token must be in the allowed set and `Venta online` should be `sí`. It is intentionally **not** part of the blocking `check:csv` contract yet, so the column can be backfilled incrementally without failing `verify:ai`. Promote it to a blocking rule once coverage is high enough.

## Missing values
- Missing cell values are represented as empty strings internally.
- Detail table renders empty values as `—`.

## Blocking rules (`check:csv`)
- The header must be exactly the canonical 20-column header, in canonical order (see Canonical header).
- No duplicated header columns.
- Line endings must be LF (no CR/CRLF anywhere in the file).
- Required header columns must exist exactly once.
- `slug` is required and must be lowercase ASCII words separated by `-`.
- `slug` must be unique within its province CSV.
- `lat` and `lon` must both be present or both be empty.
- `lat`, when present, must be numeric and between `-90` and `90`.
- `lon`, when present, must be numeric and between `-180` and `180`.
- `lat`/`lon` must not be more than `100 km` from the `municipio` centroid (looked up in `data/reference/municipios.json` + overrides). Beyond that the point belongs to a different town: almost always a swapped/wrong coordinate or a wrong `municipio`. The `15–100 km` band is a warning, not an error; rows whose `municipio` is not in the lookup are skipped.
- `web`, `Facebook`, `Instagram` and `Google Maps` may be empty, but if present must pass the link rules below.
- `imagen` may be empty, but if present must be a root-relative asset path inside `public/` such as `/productores/catalunya/barcelona/ejemplo.webp`.
- `verificacion` is required and must be one of `pendiente`, `parcial`, or `verificado`.
- `verificacion=verificado` requires coordinates and at least one external link (`web`, `Google Maps`, `Instagram`, or `Facebook`).
- `Venta online` is required and must be one of `sí`, `no`, or `no comprobado`.
- `categoria`, when present, must exactly match one of the registered/valid categories officially whitelisted in the audit tool.
- `telefono` may be empty, but if present must be in strict E.164 format (e.g. `+34600112233`).

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
  - `nombre`, `municipio` or `categoria` empty (a core field is missing)
  - `Canal de venta` present with a token outside the allowed set (`ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion`, `marketplace`)
  - `Canal de venta` set while `Venta online` is not `sí`
  - duplicated normalized `nombre + municipio`
  - near-duplicate `categoria` variants after normalization
  - category labels that should use one of the preferred category labels
  - `lat`/`lon` between `15 km` and `100 km` from the `municipio` centroid (looked up in `data/reference/municipios.json` + overrides). Beyond `100 km` it is a blocking error instead (see Blocking rules). The message names the closest centroid — `closest centroid is X (Y km)` — so you can tell whether the `municipio` or the `lat`/`lon` is the wrong field. Rows whose `municipio` is not in the lookup are skipped silently.

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

## Producer image guidelines
These are editorial conventions for the asset that the `imagen` column points to. They are not enforced by `check:csv` (which only validates path shape and extension), but new and modified producer images should follow them so the catalog stays visually consistent with the Barcelona baseline.

### Format and dimensions
- Final asset: **1600×1200 WebP** (4:3 landscape), quality `≥ 88`, saved at `/productores/<comunidad>/<provincia>/<slug>.webp`.
- The 1600×1200 dimensions match the existing `public/productores/catalunya/barcelona/*.webp` files. Treat Barcelona as the visual reference.
- Other supported extensions (`.png`, `.jpg`, `.avif`, …) remain valid per the blocking contract, but prefer `.webp` for new assets.

### Background and composition
- Background colour: **`#F3F0E8`** cream (sampled from Barcelona). Use it as a flat fill across the full 1600×1200 canvas.
- Logo centred with ~10% padding per side. The longest side of the logo should target ≤ 960 px (i.e. ~80% of the 1200 px short side).
- Leave the cream background visible around the logo. Avoid stretching the logo to fill the canvas.

### Subject preference
- Prefer **logo / imagotipo** ("avatar" style) over product photography. A recognisable brand mark distinguishes producers in the same category better than a generic product shot.
- Fall back to product or place photography only when no usable logo asset exists, or when the photo is itself the brand's iconic image (e.g. founder portrait used in the brand's own materials).
- Do not use stock imagery, AI-generated likenesses, or images from competing producers.

### Sourcing priority
When picking a source for a new image, check in this order and stop at the first usable asset:
1. Logo PNG/JPG on the producer's official site (header, footer, theme assets).
2. Open Graph image (`og:image` meta tag) of the official site, when it shows the brand mark.
3. Instagram or Facebook profile picture for the producer's official account.
4. High-resolution favicon variants (e.g. WordPress `cropped-*-270x270.png`).
5. Other reputable sources (DOP/IGP councils, regional tourism portals, press) only when the producer's own channels offer nothing usable.

### Rescaling and quality
- Cap upscaling at **3×** the source's longest side. Beyond that, blur becomes visible and no sharpening recovers it.
- After any upscale with scale `> 1.2×`, apply an unsharp mask (e.g. Pillow `ImageFilter.UnsharpMask(radius=1.2, percent=110, threshold=2)`) to recover perceived edge sharpness.
- For logos delivered as JPG without alpha, convert near-white pixels (`R, G, B ≥ 240`) to transparent before composing on the cream canvas. This prevents a white rectangle from appearing around the logo.
- Do **not** apply the white→transparent chromakey to photographic subjects: it eats skin tones, white garments, sky, and similar areas.

### Source resolution floor
- When the only available source is below ~200 px on the longest side, do not silently upscale to fill the canvas. Either:
  - Keep the logo small but sharp inside the cream canvas, or
  - Replace the subject with a representative brand-owned photograph (founder portrait, signature product) per the rules above.
- Flag this in the change description so editors can revisit when a better source appears.

### Naming
- File name must equal the producer `slug` (the same value used in the CSV's `slug` column) followed by the extension.
- Path: `/productores/<comunidad>/<provincia>/<slug>.webp`, mirroring both the `imagen` column value and the CSV layout `data/csv/<comunidad>/<provincia>.csv` (Madrid: `/productores/madrid/madrid/` because comunidad and provincia share the name).
- One image per producer. Do not store unused variants or originals in `public/`. Keep working originals outside the repo.

### Image enrichment tooling
- Use the shared dry-run script instead of province-specific scripts:
  ```bash
  npx pnpm enrich:images --provincia cuenca
  ```
- The script's default asset folder is the CSV stem at the top level (`/productores/<provincia>/`); pass `--asset-provincia <comunidad>/<provincia>` so new assets land on the canonical path.
- Install the optional Python image tooling before running it locally:
  ```bash
  python3 -m pip install -r scripts/requirements-image-tools.txt
  ```
- The script writes nothing by default. Review the candidate source, score, dimensions, and URL first; then rerun with `--apply` to save `/productores/<provincia>/<slug>.webp` and update the CSV.
- Non-logo Open Graph/Twitter photos are skipped unless `--allow-photos` is provided. Use this only when a brand-owned photo is the intended fallback.
- Social networks, link hubs, blog hosts, and known aggregator domains are skipped by default to avoid assigning a portal logo to a producer.
- Run the image audit before finishing image-related changes:
  ```bash
  npx pnpm check:images
  ```

## Producer identity
- `slug` is the primary identity for producer detail pages.
- Row order in each province CSV is editorial and may change without changing producer URLs.
- Canonical detail path format is `/p/[slug]`.
- Detail URLs must include `provincia=[provincia]`, including Barcelona, because slugs are unique within a province CSV rather than globally.
- Legacy `/p/[id]` and `/p/[id]-[slug]` URLs redirect to `/p/[slug]?provincia=[provincia]` when resolvable.
- `slug` should be lowercase ASCII with words separated by `-`, unique within the province CSV, and stable across row reordering.
