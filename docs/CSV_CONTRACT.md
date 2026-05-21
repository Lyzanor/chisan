# CSV Contract

## Source of truth
- Default file: `data/csv/catalunya/barcelona.csv`
- Additional province files: `data/csv/[comunidad]/[provincia].csv`
- Encoding: UTF-8 (BOM tolerated)
- Header row is required.
- Validation entrypoints:
  - `pnpm check:csv`: blocking technical contract audit for every CSV
  - `node scripts/audit-csv.js --mode=contract data/csv/[comunidad]/[provincia].csv`: blocking audit for one CSV
  - `pnpm check:csv:data-quality`: weekly data-quality audit with warnings

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
- `Facebook`
- `Instagram`
- `Google Maps`
- `lat`
- `lon`
- `fecha_revision`

## Optional columns
- `imagen`
- `verificacion`

## How the app uses columns
- Province catalog source: one CSV file per province in `data/csv/[comunidad]/`.
- Filter by category: `categoria` (exact normalized match).
- Result title: `nombre`.
- Result metadata: `municipio`, `categoria`, `productos estrella`.
- Map point: `lat`, `lon`.
- Location cross-check: `direccion` should describe the same place as the coordinates.
- External links: `web`, `Facebook`, `Instagram`, `Google Maps`.
- Detail page: shows all columns as table rows.
- Detail image: `imagen` when present, otherwise a generic local placeholder.
- Verification level: `verificacion`, when present, records how checked the row is.

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
- `verificacion` is optional during migration, but recommended for CSVs that are actively edited.
- Allowed values:
  - `alta`: core data has been checked against a primary or clearly reliable source, and name, location and contact/link data are consistent.
  - `media`: producer appears real and localized, but some fields are incomplete, inferred, or based mostly on secondary sources.
  - `baja`: plausible row with weak verification.
  - `pendiente`: added for catalog coverage, but still needs review.
- Do not mark `alta` without a real `fecha_revision`.
- `fecha_revision` should only change when the row was actually reviewed or corrected.

## Missing values
- Missing cell values are represented as empty strings internally.
- Detail table renders empty values as `—`.
- `fecha_revision` should use `YYYY-MM-DD` when present, or remain empty if unknown.

## Blocking rules (`check:csv`)
- Required header columns must exist exactly once.
- `slug` is required and must be lowercase ASCII words separated by `-`.
- `slug` must be unique within its province CSV.
- `fecha_revision`, when present, must be a real `YYYY-MM-DD` date.
- `lat` and `lon` must both be present or both be empty.
- `lat`, when present, must be numeric and between `-90` and `90`.
- `lon`, when present, must be numeric and between `-180` and `180`.
- `web`, `Facebook`, `Instagram` and `Google Maps` may be empty, but if present must pass the link rules below.
- `imagen` may be empty, but if present must be a root-relative asset path inside `public/` such as `/productores/barcelona/ejemplo.webp`.

## Warning rules (`check:csv:data-quality`)
- Empty or weak content:
  - `nombre`, `municipio`, `categoria`, `direccion`, `fecha_revision`
  - `descripcion` empty or shorter than `30` characters
  - both `telefono` and `correo` empty
  - both `Facebook` and `Instagram` empty
  - `Google Maps` empty
- Verification:
  - missing `verificacion` column in actively edited CSVs
  - empty `verificacion` when the column exists
  - unsupported `verificacion` values
  - `verificacion=alta` without `fecha_revision`
- Review freshness:
  - `fecha_revision` older than `60` days = attention
  - `fecha_revision` older than `90` days = expired
- Consistency:
  - duplicated normalized `nombre + municipio`
  - near-duplicate `categoria` variants after normalization
  - category labels that should use one of the preferred category labels
  - coordinates present but `direccion` not useful for location review

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
- Canonical detail URL format is `/p/[slug]`.
- Legacy `/p/[id]` and `/p/[id]-[slug]` URLs redirect to `/p/[slug]` when resolvable.
- `slug` should be lowercase ASCII with words separated by `-`, unique within the province CSV, and stable across row reordering.
