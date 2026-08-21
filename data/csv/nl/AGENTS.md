# Netherlands

## Operating state
- Priorities: review inherited rows and record decisions by province; there is
  no country-wide discovery roster.

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
