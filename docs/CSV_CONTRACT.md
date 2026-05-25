# CSV Contract

## Source of truth
- Province files: `data/csv/[comunidad]/[provincia].csv`
- Barcelona file: `data/csv/catalunya/barcelona.csv`
- Encoding: UTF-8 (BOM tolerated)
- Header row is required.
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

## How the app uses columns
- Province catalog source: one CSV file per province in `data/csv/[comunidad]/`.
- Filter by category: `categoria` (exact normalized match).
- Result title: `nombre`.
- Result metadata: `municipio`, `categoria`, `productos estrella`.
- Map point: `lat`, `lon`.
- Location cross-check: `direccion` should describe the same place as the coordinates.
- External links: `web`, `Facebook`, `Instagram`, `Google Maps`.
- Online sales status: `Venta online`, records whether the producer sells online through its own site or a concrete known channel.
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
- `verificacion` is required for every row. It is the single reliability indicator for agents and editors.
- Allowed values:
  - `pendiente`: added for catalog coverage, but still needs review.
  - `parcial`: producer exists and is localized, but some fields are inferred or based on secondary sources.
  - `verificado`: name, municipio, location and contact/link data have been cross-checked against a primary or clearly reliable source.
- Legacy values such as `alta`, `media`, and `baja` are invalid. Use `verificado`, `parcial`, and `pendiente`.
- A row marked `verificado` must have coordinates and at least one external link (`web`, `Google Maps`, `Instagram`, or `Facebook`), so the level stays evidence-based. The blocking audit fails when this is not the case.

## Online sales
- `Venta online` is required for every row.
- Allowed values:
  - `sí`: the producer sells online through its own site or through a concrete, identified sales channel.
  - `no`: online sales have been checked and no online sales channel was found.
  - `no comprobado`: default value until the row is reviewed for online sales.
- Do not infer `sí` from having a `web` link. Use `sí` only when the site or channel clearly supports online purchase or order.

## Missing values
- Missing cell values are represented as empty strings internally.
- Detail table renders empty values as `—`.

## Blocking rules (`check:csv`)
- Required header columns must exist exactly once.
- `slug` is required and must be lowercase ASCII words separated by `-`.
- `slug` must be unique within its province CSV.
- `lat` and `lon` must both be present or both be empty.
- `lat`, when present, must be numeric and between `-90` and `90`.
- `lon`, when present, must be numeric and between `-180` and `180`.
- `web`, `Facebook`, `Instagram` and `Google Maps` may be empty, but if present must pass the link rules below.
- `imagen` may be empty, but if present must be a root-relative asset path inside `public/` such as `/productores/barcelona/ejemplo.webp`.
- `verificacion` is required and must be one of `pendiente`, `parcial`, or `verificado`.
- `verificacion=verificado` requires coordinates and at least one external link (`web`, `Google Maps`, `Instagram`, or `Facebook`).
- `Venta online` is required and must be one of `sí`, `no`, or `no comprobado`.

## Warning rules (`check:csv:data-quality`)
- Empty or weak content:
  - `nombre`, `municipio`, `categoria`, `direccion`
  - `descripcion` empty or shorter than `30` characters
  - both `telefono` and `correo` empty
  - both `Facebook` and `Instagram` empty
  - `Google Maps` empty
- Consistency:
  - duplicated normalized `nombre + municipio`
  - near-duplicate `categoria` variants after normalization
  - category labels that should use one of the preferred category labels
  - coordinates present but `direccion` not useful for location review
- Geography:
  - `lat`/`lon` more than `15 km` from the `municipio` centroid (looked up in `data/reference/municipios.json`). Rows whose `municipio` is not in the lookup are skipped silently.

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

## Producer identity
- `slug` is the primary identity for producer detail pages.
- Row order in each province CSV is editorial and may change without changing producer URLs.
- Canonical detail path format is `/p/[slug]`.
- Detail URLs must include `provincia=[provincia]`, including Barcelona, because slugs are unique within a province CSV rather than globally.
- Legacy `/p/[id]` and `/p/[id]-[slug]` URLs redirect to `/p/[slug]?provincia=[provincia]` when resolvable.
- `slug` should be lowercase ASCII with words separated by `-`, unique within the province CSV, and stable across row reordering.
