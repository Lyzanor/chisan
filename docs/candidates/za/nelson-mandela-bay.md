# Nelson Mandela Bay — candidates

- Target CSV: `data/csv/za/eastern-cape/nelson-mandela-bay.csv`
- Source: OpenStreetMap sweep of `craft=brewery|distillery|cheesemaker|oil_mill`, `microbrewery=yes`, `shop=farm|dairy` over South Africa, via Overpass
- Searched: 16 August 2026
- Batch scope: leads only. Nothing here is verified: the district comes from the
  listing's own town or coordinates, the category from the source's own tag, and
  neither is a substitute for reading the producer's site. Resolve identity,
  qualifying activity and `municipio` before writing a row.

## OpenStreetMap leads

Mapper-contributed, not a registry: the name may be a tasting room, a farm stall
or a defunct site, and the tag is only a hint at `categoria`.

- **Bridge Street Brewery** — Gqeberha · `Cerveza` (osm `brewery`)
  - https://www.openstreetmap.org/way/332257432
- **The Farmers Barn** — Gqeberha · `Fruta y verdura` (osm `farm`)
  - https://www.openstreetmap.org/node/11428521469
- **’78 Brewing Company** — Gqeberha · `Cerveza` (osm `microbrewery`)
  - https://www.openstreetmap.org/node/3887378304

## Pending

- The WOSA member index names wine producers this note does not; it carries no
  address, so each one needs its own site to place it.
