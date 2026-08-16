# City of Cape Town — candidates

- Target CSV: `data/csv/za/western-cape/cape-town.csv`
- Source: Stellenbosch Wine Routes member listings, https://wineroute.co.za/ (enumerated from `wp-sitemap-posts-wineries-1.xml`); OpenStreetMap sweep of `craft=brewery|distillery|cheesemaker|oil_mill`, `microbrewery=yes`, `shop=farm|dairy` over South Africa, via Overpass
- Searched: 16 August 2026
- Batch scope: leads only. Nothing here is verified: the district comes from the
  listing's own town or coordinates, the category from the source's own tag, and
  neither is a substitute for reading the producer's site. Resolve identity,
  qualifying activity and `municipio` before writing a row.

## Stellenbosch Wine Routes members

Route membership shows the producer trading in the sub-region at review time.
It does not prove the entity is the productive unit and it does not place it:
Each of these publishes an address, which is what placed it here.
The route's footprint crosses into the City of Cape Town, so read the producer's
own site before writing `municipio`. `categoria`: `Vino`.

- **Anwilka** — Somerset West · http://www.anwilka.com · info@kleinconstantia.com
  - listing: https://wineroute.co.za/wineries/anwilka/; address: Anwilka Vineyards, Raithby-Annandale Road, Somerset West, Raithby; placed by address
- **Aslina Wines** — Somerset West · https://www.aslinawines.com · +27730115529 · info@aslinawines.com
  - listing: https://wineroute.co.za/wineries/aslina-wines/; address: 19 Somerset Soreno, Derrick Drive, Somerset West; placed by address

## OpenStreetMap leads

Mapper-contributed, not a registry: the name may be a tasting room, a farm stall
or a defunct site, and the tag is only a hint at `categoria`.

- **Boston Breweries** — Brooklyn, Cape Town · `Cerveza` (osm `brewery`)
  - https://www.openstreetmap.org/node/11328894769
- **Dairy Exchange** — Brackenfell · `Lácteos y quesos` (osm `dairy`) · https://www.dairyexchange.co.za/ · +27 60 577 7515
  - https://www.openstreetmap.org/node/12723576752
- **Milky Lane** — Salt River · `Lácteos y quesos` (osm `dairy`)
  - https://www.openstreetmap.org/way/1006701255
- **Rasta Fruit's & Veg** — Blikkiesdorp · `Fruta y verdura` (osm `farm`)
  - https://www.openstreetmap.org/way/736618035
- **Red Sky Brewery** — Gordon's Bay · `Cerveza` (osm `microbrewery`)
  - https://www.openstreetmap.org/node/6205092494
- **Shackleton** — Brooklyn, Cape Town · `Cerveza` (osm `brewery`)
  - https://www.openstreetmap.org/node/11193999837
- **Sweet River Brewery** — Woodstock · `Cerveza` (osm `brewery`) · https://sweetriverbrewery.com/
  - https://www.openstreetmap.org/node/9356066209
- **Triggerfish Brewing** — Strand · `Cerveza` (osm `microbrewery`) · https://www.triggerfishbrewing.co.za/
  - https://www.openstreetmap.org/way/317570047
- **Urban Brewery Co.** — Hout Bay · `Cerveza` (osm `brewery`)
  - https://www.openstreetmap.org/node/4762643406
- **Vredenhof Organic Farm Shop** — Cape Town · `Fruta y verdura` (osm `farm`) · +27 21 855 0363
  - https://www.openstreetmap.org/node/3571952494
- **Woodstock Brewer** — Cape Town · `Cerveza` (osm `brewery`) · https://woodstockbrewery.co.za/
  - https://www.openstreetmap.org/way/477925452

## Pending

- The other routes covering this district are unread: Constantia and Durbanville.
- The WOSA member index names wine producers this note does not; it carries no
  address, so each one needs its own site to place it.
