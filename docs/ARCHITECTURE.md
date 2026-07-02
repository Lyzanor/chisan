# Architecture

## Purpose
Serve province CSV files as a map-first producer catalog with a simple row detail page. The app has no implicit default province; `/` asks for a province before reading a CSV.

## Runtime flow
```mermaid
flowchart TD
  A["data/csv/[comunidad]/[provincia].csv"] --> B["lib/csv-catalog.ts"]
  B --> C["app/page.tsx (/): province/category selector"]
  C --> D["Producer viewer"]
  C --> E["Map points (toProducerMapPoints)"]
  E --> F["Leaflet + OSM map (components/map/*)"]
  D --> G["app/p/[slug]/page.tsx -> /p/[slug]?provincia=[provincia]"]
  G --> H["Row detail (field/value table)"]
```

`data/evidence/**` and `data/evals/**` are editorial control inputs only. The
runtime does not read them, so provenance and policy validation cannot become a
hidden application data source.

## Editorial control flow

```mermaid
flowchart TD
  A["Public sources and registries"] --> B["Editorial policy"]
  B --> C["data/csv/** current state"]
  B --> D["data/evidence/** provenance"]
  E["data/evals/** synthetic cases"] --> B
  C --> F["check:csv"]
  D --> G["check:evidence"]
  E --> H["test:editorial-policy"]
```

## Components
- `lib/csv-catalog.ts`
  - Reads CSV with `csv-parse/sync`.
  - Normalizes text for search.
  - Reads coordinates (`lat/lon`) when present and uses them for map points.
  - Keeps `direccion` as the human-readable location reference that should match those coordinates.
  - Exposes:
    - `searchProducers({ municipality, category, lat, lon })`
    - `listCategories()`
    - `listMunicipalitySummaries(category?)`
    - `findProducerBySlug(slug|legacy-id|legacy-id-slug)`
    - `toProducerMapPoints(rows)`
- `app/page.tsx`
  - Reads URL params `provincia`, `categoria`, and `destacar` (producer `slug`).
  - Renders the province chooser when `provincia` is missing or unknown.
  - Shows province selector and category chips.
  - Renders a Leaflet map with OSM tiles for producers with coordinates.
  - Renders a compact producer viewer next to the map.
- `app/p/[slug]/page.tsx`
  - Resolves one producer by current `slug` plus `provincia`.
  - Redirects legacy `/p/[id]` and `/p/[id]-[slug]` URLs to canonical `/p/[slug]?provincia=[provincia]`.
  - Redirects detail requests without `provincia` back to `/` because producer slugs are province-scoped.
  - Renders all CSV columns and values.

## Design rules
- Keep one data source per province: CSV file on disk, grouped by autonomous community.
- Keep decision provenance in matching JSONL evidence ledgers; never read them from application code.
- Keep stable editorial outcomes covered by synthetic evaluation cases.
- Keep CSV reading and normalization centralized in `lib/csv-catalog.ts`.
- Keep pages thin and explicit.
- Avoid hidden side effects or caching outside current module boundaries.
