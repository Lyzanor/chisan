# CSV Contract

## Source of truth
- File: `Km0-productores.csv`
- Encoding: UTF-8 (BOM tolerated)
- Header row is required.
- Validation entrypoints:
  - `pnpm check:csv`: blocking technical contract audit
  - `pnpm check:csv:data-quality`: weekly data-quality audit with warnings

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

## Blocking rules (`check:csv`)
- Required header columns must exist exactly once.
- `slug` is required and must be lowercase ASCII words separated by `-`.
- `fecha_revision`, when present, must be a real `YYYY-MM-DD` date.
- `lat` and `lon` must both be present or both be empty.
- `lat`, when present, must be numeric and between `-90` and `90`.
- `lon`, when present, must be numeric and between `-180` and `180`.
- `web`, `Facebook`, `Instagram` and `Google Maps` may be empty, but if present must pass the link rules below.

## Warning rules (`check:csv:data-quality`)
- Empty or weak content:
  - `nombre`, `municipio`, `categoria`, `direccion`, `fecha_revision`
  - `descripcion` empty or shorter than `30` characters
  - both `telefono` and `correo` empty
  - both `Facebook` and `Instagram` empty
  - `Google Maps` empty
- Review freshness:
  - `fecha_revision` older than `60` days = attention
  - `fecha_revision` older than `90` days = expired
- Consistency:
  - duplicated `slug`
  - duplicated normalized `nombre + municipio`
  - near-duplicate `categoria` variants after normalization
  - coordinates present but `direccion` not useful for map display

## Link validation
- `web`, `Facebook`, `Instagram` and `Google Maps` may be empty, but if present must be valid `http://` or `https://` URLs.
- `Facebook` must point to `facebook.com`.
- `Instagram` must point to `instagram.com`.
- `Google Maps` must use the search URL format with `place_id`:

```text
https://www.google.com/maps/search/?api=1&query=<nombre_o_direccion>&query_place_id=<PLACE_ID>
```

- `Google Maps` must point to a Google Maps host and include:
  - `api=1`
  - a non-empty `query`
  - a non-empty `query_place_id`

## Row identity
- `id` in route `/p/[id]` is row index (1-based) after header.
- Row order in CSV is meaningful for IDs.
- Canonical detail URL format is `/p/[id]-[slug]`.
- `slug` should be lowercase ASCII with words separated by `-`.
