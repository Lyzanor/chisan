# Germany

## Operating state
- Priorities: inherited-row review plus targeted brewery and farm-dairy
  discovery. Derive the exact published-row queues with
  `npx pnpm check:defects --country de`.
- Area discovery is active in `docs/candidates/de/**`; closed row decisions belong in `data/evidence/de/**`.

## Country rules
- `municipio` is the current Gemeinde, never the Ortsteil; retain the smaller locality in `direccion`.
- A `Hofladen`, vending hut or `Milchtankstelle` is a sales point, not proof of the producer or productive unit behind the goods.
- Match public brand, legal entity and productive address before merging similarly named farms or breweries.

## Source ceilings
- The inherited catalog came from an OpenStreetMap farm-shop extract. Its category, contacts and `opening_hours` remain source assertions until a current producer source confirms them.
- OSM and Wikidata brewery tags are discovery only: `craft=brewery` still needs qualifying-activity review, `industrial` needs plant and identity review, and `microbrewery` may describe hospitality.
- The Verband für handwerkliche Milchverarbeitung member map proves membership, address and the business type the association assigns; it does not prove current activity, an own public offer, or that the address is the productive unit. Its `im Aufbau` members may not sell yet, and it also lists retailers and cheese schools.
