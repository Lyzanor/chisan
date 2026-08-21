# Mexico discovery methods

Apply the [shared candidate workflow](../README.md) and the
[Mexico rules and source ceilings](../../../data/csv/mx/AGENTS.md). Keep each
state's query, review date, cutoff and unresolved candidates in its area note.

## DENUE bulk extracts

INEGI publishes one open CSV archive per state at
`https://www.inegi.org.mx/contenidos/masiva/denue/denue_<state_code>_csv.zip`;
`09` is Ciudad de México. Food manufacturing uses SCIAN `311*` and
beverages `312*`; narrower classes are useful for category-specific passes.

Triage before admission. Some classes are dominated by retail-like networks or
water-bottling outlets, and designation-of-origin classes may include offices
rather than plants. Validate submitted websites independently.

## Designation-of-origin and directory files

- The Consejo Regulador del Tequila publishes dated XLSX rosters from its
  [brands and associates page](https://www.crt.org.mx/en/brands-and-associates/).
  Download the linked file rather than scraping the surrounding page.
- A JavaScript directory may use WordPress GeoDirectory. Check
  `<domain>/wp-json/geodir/v2/places?per_page=100` and its
  `X-WP-TotalPages` header for paginated records.
- When a listing publishes both locality text and coordinates, use the point to
  investigate the municipality but still confirm the productive address before
  assigning the row.
