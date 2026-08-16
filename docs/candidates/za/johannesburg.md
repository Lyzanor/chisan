# City of Johannesburg — candidates

- Target CSV: `data/csv/za/gauteng/johannesburg.csv`
- Source: OpenStreetMap sweep of `craft=brewery|distillery|cheesemaker|oil_mill`, `microbrewery=yes`, `shop=farm|dairy` over South Africa, via Overpass
- Searched: 16 August 2026
- Batch scope: leads only. Nothing here is verified: the district comes from the
  listing's own town or coordinates, the category from the source's own tag, and
  neither is a substitute for reading the producer's site. Resolve identity,
  qualifying activity and `municipio` before writing a row.

## OpenStreetMap leads

Mapper-contributed, not a registry: the name may be a tasting room, a farm stall
or a defunct site, and the tag is only a hint at `categoria`.

- **Copperlake Brewery** — Nietgedacht · `Cerveza` (osm `brewery`)
  - https://www.openstreetmap.org/node/12401761582
- **Kelokitso Community Farm** — Roodepoort · `Fruta y verdura` (osm `farm`) · +27 78 918 6105
  - https://www.openstreetmap.org/node/13384175298
- **Urban Padstal** — Hurl Park · `Fruta y verdura` (osm `farm`) · https://www.urbanpadstal.co.za/ · +27 73 787 5335
  - https://www.openstreetmap.org/node/1046184510

## Pending

- The WOSA member index names wine producers this note does not; it carries no
  address, so each one needs its own site to place it.
