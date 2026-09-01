# Germany

## Operating state
- Public catalog status: standby. Keep catalog, evidence, account and
  repository-wide validation state maintained, but do not publish or index it.
- Pause routine discovery, enrichment, translation and geolocation updates.
  Resume them only through an explicit country-scoped instruction.

## Country rules
- `municipio` is the current Gemeinde, never the Ortsteil; retain the smaller
  locality in `direccion`.
- A `Hofladen`, vending hut or `Milchtankstelle` is a sales point, not proof
  of the productive unit behind the goods.
- Match public brand, legal entity and productive address before merging
  similarly named farms or breweries.

## Source ceilings
- The inherited catalog came from an OpenStreetMap farm-shop extract. Its
  category, contacts and `opening_hours` remain source assertions until a
  current producer source confirms them.
- OSM and Wikidata brewery tags are discovery only: `craft=brewery` still
  needs qualifying-activity review, `industrial` needs plant and identity
  review, and `microbrewery` may describe hospitality.
- The Verband für handwerkliche Milchverarbeitung member map supports listed
  membership, address and business type. It does not prove current activity,
  an own public offer or that the address is the productive unit.
