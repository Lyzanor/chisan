# Italy

## Operating state
- Priorities: review OSM-seeded rows as intake rather than verified producers.
  Derive exact published-row queues with
  `npx pnpm check:defects --country it`.
- Record each keep, correction, merge or purge in `data/evidence/it/**`; open `docs/candidates/it/<area>.md` only for a concrete discovery pass.

## Country rules
- `municipio` is the current comune, never a frazione, località, quartiere or provincia; retain the smaller locality in `direccion`.
- Place the row in the province or metropolitan area of the productive unit, not the registered office, shop or appellation.
- Prefer the public producer or brand identity over a bare legal holder name, while retaining Italian spelling and diacritics.

## Source ceilings
- The opening batch and its current evidence were seeded from OpenStreetMap. A mapped bakery, winery, farm or shop supports only the mapped identity and location; it does not prove current activity, qualifying production, an own offer or online sales.
- OSM category and coordinates remain discovery assertions until matched to the producer or another clearly reliable current source.
