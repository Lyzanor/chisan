# Netherlands

## Operating state
- Public catalog status: standby. Keep catalog, evidence, account and
  repository-wide validation state maintained, but do not publish or index it.
- Pause routine discovery, enrichment, translation and geolocation updates.
  Resume them only through an explicit country-scoped instruction.

## Country rules
- `municipio` is the gemeente, never the woonplaats; retain the latter in
  `direccion`.
- A farm shop, vending point or pick-your-own site proves a sales location, not
  that the named entity produces the listed goods.
- PDOK fuzzy-matches. Accept a geocode only when street, number and any house
  letter agree; a regional portal is not the producer's `web`.

## Source ceilings
- The inherited catalog came from Boerenroute.nl. Its entries support the listed
  sales point, not qualifying production, current activity or online sales.
- Landwinkel membership can support identity and address, but its coordinates
  and submitted URLs require an independent destination and
  postcode-plus-house-number match.
