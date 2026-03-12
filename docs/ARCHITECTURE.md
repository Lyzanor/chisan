# Architecture

## Purpose
Serve `Km0-productores.csv` as a searchable catalog with map + simple detail page.

## Runtime flow
```mermaid
flowchart TD
  A["Km0-productores.csv"] --> B["lib/csv-catalog.ts"]
  B --> C["app/page.tsx (/): filters by municipio + categoria"]
  C --> D["Result list"]
  C --> E["Map points (toProducerMapPoints)"]
  E --> F["Leaflet + OSM map (components/map/*)"]
  D --> G["app/p/[id]/page.tsx -> /p/[id]-[slug]"]
  G --> H["Row detail (field/value table)"]
```

## Components
- `lib/csv-catalog.ts`
  - Reads CSV with `csv-parse/sync`.
  - Normalizes text for search.
  - Reads coordinates (`lat/lon`) when present.
  - Exposes:
    - `searchProducers({ municipality, category })`
    - `listCategories()`
    - `findProducerById(id|id-slug)`
    - `toProducerMapPoints(rows)`
- `app/page.tsx`
  - Reads URL params `municipio` and `categoria`.
  - Shows municipality input + category icon chips.
  - Renders a Leaflet map with OSM tiles for visible filtered producers.
  - Lists matching producers.
- `app/p/[id]/page.tsx`
  - Resolves one row by index.
  - Redirects legacy `/p/[id]` URLs to canonical `/p/[id]-[slug]`.
  - Renders all CSV columns and values.

## Design rules
- Keep one data source: CSV file on disk.
- Keep search logic centralized in `lib/csv-catalog.ts`.
- Keep pages thin and explicit.
- Avoid hidden side effects or caching outside current module boundaries.
