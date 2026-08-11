# Ireland

## Operating state
- Phase: opening. The tree covers the 26 counties; a first sourced batch is
  published in 12 of them and the rest are empty. Derive live queues with
  `npx pnpm check:defects --country ie`.
- Active lane: producer discovery per county in `docs/candidates/ie/<area>.md`,
  starting from sector associations and working towards the official
  establishment registers, which are not yet scoped.

## Country rules
- `region` is the traditional province and `area` the traditional county. The
  Ulster region holds only Cavan, Donegal and Monaghan; the province's other six
  counties are areas under `gb/northern-ireland`.
- `municipio` is the town or village the producer publishes. Ireland has no
  municipality layer that an address names: below the county sit 31 local
  authorities no producer writes, and the layer a rural address does carry is
  the townland.
- A townland therefore has no centroid — Wikidata holds ~60.000 of them and they
  are left out of the catalog on purpose. Keep the townland in `direccion` and
  take `municipio` from the town the address resolves to (Curranstown → Arklow).
- With only four regions, the region-keyed override in
  `municipality-overrides.json` disambiguates less here than elsewhere.
  Stradbally resolves for Laois because the other four are outside Leinster,
  while Little Island in Cork and Little Island in Waterford are both in Munster
  and neither can be keyed; those rows keep honest coordinates and no gate.
- The Eircode identifies one address, not an area. Its routing key does not name
  the county and there is no free lookup, so it supports the address and nothing
  else.

## Source ceilings
- `irishcraftbeer.ie` lists breweries with a county, a URL and a closed marker,
  but it is a third-party directory: it mis-attributes (Big Hand Brewery appears
  under Dublin behind a Welsh domain) and proves neither current activity nor
  that a listed domain belongs to the producer.
- The EU protected-name register names Irish PDO and PGI products and their
  area, never who currently makes them, and the producer's own site may not
  mention the designation at all (Oriel Sea Salt).
- Nominatim resolves an Irish trade name to a producer POI more often than it
  resolves a rural address; an address in a townland routinely returns nothing.
- Sector directories die with their domains. `cais.ie` (the farmhouse
  cheesemakers' association), `corleggy.com` and `connemarasmokehouse.ie` are
  NXDOMAIN, confirmed by a second route, so the real producers behind them need
  another current source rather than a resurrected URL.
