# eThekwini — candidates

- Target CSV: `data/csv/za/kwazulu-natal/ethekwini.csv`
- Source: OpenStreetMap sweep of `craft=brewery|distillery|cheesemaker|oil_mill`, `microbrewery=yes`, `shop=farm|dairy` over South Africa, via Overpass
- Searched: 16 August 2026
- Batch scope: leads only. Nothing here is verified: the district comes from the
  listing's own town or coordinates, the category from the source's own tag, and
  neither is a substitute for reading the producer's site. Resolve identity,
  qualifying activity and `municipio` before writing a row.

## OpenStreetMap leads

Mapper-contributed, not a registry: the name may be a tasting room, a farm stall
or a defunct site, and the tag is only a hint at `categoria`.

- **1000 Hills Brewery** — Botha's Hill · `Cerveza` (osm `microbrewery`)
  - https://www.openstreetmap.org/way/1315787967
- **Robsons Brewery** — Point Waterfront · `Cerveza` (osm `brewery`) · http://www.robsonsrealbeer.com
  - https://www.openstreetmap.org/node/11357384572
- **Stumpnose Brewery** — Kloof · `Cerveza` (osm `microbrewery`)
  - https://www.openstreetmap.org/way/625262768

## Pending

- The WOSA member index names wine producers this note does not; it carries no
  address, so each one needs its own site to place it.
