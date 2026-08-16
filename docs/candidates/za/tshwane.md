# City of Tshwane — candidates

- Target CSV: `data/csv/za/gauteng/tshwane.csv`
- Source: OpenStreetMap sweep of `craft=brewery|distillery|cheesemaker|oil_mill`, `microbrewery=yes`, `shop=farm|dairy` over South Africa, via Overpass
- Searched: 16 August 2026
- Batch scope: leads only. Nothing here is verified: the district comes from the
  listing's own town or coordinates, the category from the source's own tag, and
  neither is a substitute for reading the producer's site. Resolve identity,
  qualifying activity and `municipio` before writing a row.

## OpenStreetMap leads

Mapper-contributed, not a registry: the name may be a tasting room, a farm stall
or a defunct site, and the tag is only a hint at `categoria`.

- **Bernie's Brewery** — Cornwall Hill · `Cerveza` (osm `microbrewery`)
  - https://www.openstreetmap.org/node/12511942003
- **Drayman's Brewery** — Silverton, Pretoria · `Cerveza` (osm `microbrewery`) · https://draymans.com/
  - https://www.openstreetmap.org/node/3734041925
- **Jasmyn** — Gerhardsville · `Fruta y verdura` (osm `farm`)
  - https://www.openstreetmap.org/node/777395994
- **Kapstadt Brauhaus** — Menlo Park · `Cerveza` (osm `microbrewery`) · https://www.kapstadtbrauhaus.co.za/menlopark/
  - https://www.openstreetmap.org/way/1003010404
- **United National Breweries** — Pretoria · `Cerveza` (osm `brewery`) · https://www.breweries.co.za · +27 12 380 7300
  - https://www.openstreetmap.org/node/9046093645

## Pending

- The WOSA member index names wine producers this note does not; it carries no
  address, so each one needs its own site to place it.
