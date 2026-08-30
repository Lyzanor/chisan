# Mexico

## Operating state
- Priorities: area-scoped discovery from designation-of-origin councils and
  DENUE extracts, followed by admission and review of published rows.

## Country rules
- `municipio` is the municipality. A rural localidad, ejido, ranch or valley
  belongs in `direccion`.
- Valle de Guadalupe in Baja California is a locality within Ensenada, not a
  municipality. Use Ensenada as `municipio`.
- Ciudad de México uses alcaldías as its territorial units; use the applicable
  alcaldía rather than the city name alone.
- Designation-of-origin rosters often publish a fiscal address rather than the
  distillery or winery. Resolve the productive unit before assigning an area.

## Source ceilings
- DENUE supports the dated establishment, SCIAN class, address and contact fields
  it publishes. It does not establish a public brand, own consumer offer or
  online sales; submitted website values require ownership checks. Bulk state
  archives live at
  `inegi.org.mx/contenidos/masiva/denue/denue_<state_code>_csv.zip`; food and
  beverage manufacturing begin at SCIAN `311*` and `312*`.
- Consejo Regulador del Tequila rosters support certified companies,
  appellation status and listed brands. Their fiscal address does not locate the
  productive unit, and repeating contact fields require validation. Use the
  dated XLSX linked from its brands-and-associates page.
- Other designation-of-origin councils support only the company, certification
  or brands they explicitly publish, not current activity or online sales.
- A JavaScript directory may expose paginated WordPress GeoDirectory records at
  `/wp-json/geodir/v2/places?per_page=100`; inspect `X-WP-TotalPages` and treat
  submitted points as location clues pending productive-address review.
