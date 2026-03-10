# CSV Contract

## Source of truth
- File: `Km0-productores.csv`
- Encoding: UTF-8 (BOM tolerated)
- Header row is required.

## Expected columns
- `nombre`
- `municipio`
- `categoria`
- `subcategoria`
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
- `Revisado`

## How the app uses columns
- Search by municipality: `municipio` (contains match, accent-insensitive).
- Filter by category: `categoria` (exact normalized match).
- Result title: `nombre`.
- Result metadata: `municipio`, `categoria`, `subcategoria`.
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

## Row identity
- `id` in route `/p/[id]` is row index (1-based) after header.
- Row order in CSV is meaningful for IDs.
