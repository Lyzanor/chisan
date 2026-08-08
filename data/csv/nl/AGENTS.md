# Netherlands — temporary source note

Keep this note only while `data/csv/nl/**` lacks per-row evidence.

- The inherited catalog came from Boerenroute.nl. Its entries are farm shops,
  vending points and pick-your-own sites: they prove a sales point, not that the
  entity produces the listed goods.
- Landwinkel membership can support identity and address, but its coordinates
  and submitted URLs are not authoritative. Read the destination and match on
  postcode plus house number.
- `municipio` is the gemeente, never the woonplaats. PDOK fuzzy-matches, so
  accept a geocode only when street, number and any house letter agree.
- A search result or regional portal is not the producer's `web`; store only an
  attributable producer site.
