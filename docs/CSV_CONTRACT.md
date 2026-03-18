# CSV Contract

## Source of truth
- File: `Km0-productores.csv`
- Encoding: UTF-8 (BOM tolerated)
- Header row is required.

## Expected columns
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

## How the app uses columns
- Search by municipality: `municipio` (contains match, accent-insensitive).
- Filter by category: `categoria` (exact normalized match).
- Result title: `nombre`.
- Result metadata: `municipio`, `categoria`, `productos estrella`.
- Detail page: shows all columns as table rows.

## Normalization rules
- Collapse repeated spaces.
- Trim leading/trailing spaces.
- Search normalization:
  - lower case
  - remove diacritics
  - keep letters/numbers, collapse separators

## Missing values
- Missing cell values are represented as empty strings internally.
- Detail table renders empty values as `—`.
- `fecha_revision` should use `YYYY-MM-DD` when present, or remain empty if unknown.

## Link validation
- `web`, `Facebook`, `Instagram` and `Google Maps` may be empty, but if present must be valid `http://` or `https://` URLs.
- `Facebook` must point to `facebook.com`.
- `Instagram` must point to `instagram.com`.
- `Google Maps` must point to a Google Maps URL (`google.* /maps...` or `maps.app.goo.gl`).

## Row identity
- `id` in route `/p/[id]` is row index (1-based) after header.
- Row order in CSV is meaningful for IDs.
- Canonical detail URL format is `/p/[id]-[slug]`.
- `slug` should be lowercase ASCII with words separated by `-`.
