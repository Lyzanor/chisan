# Candidates — Mexico

Reusable methods only. Per-area state lives in `<area>.md`.

## What works

- **The denominación de origen councils publish files, not pages.** The tequila
  council's rosters are XLSX links on
  <https://www.crt.org.mx/en/brands-and-associates/>, dated in the filename and
  refreshed monthly. Download and parse the file; the page around it says
  nothing. This is the widest current producer list Mexico publishes.
- **A JavaScript listing map is usually WordPress GeoDirectory.** When a
  directory renders "no records found" and an empty map, try
  `<domain>/wp-json/geodir/v2/places?per_page=100` before giving up. It returns
  the records with street, locality, coordinates, phone, site and social
  handles, paginated in `X-WP-TotalPages`. That is how the Baja California wine
  route was read.
- **Coordinates beat the locality field.** Mexican directories fill "city" with
  whatever the producer wrote — a valley, an ejido, a ranch. The listing's own
  latitude and longitude place it in a municipality reliably; the locality
  string does not.

## What does not work

- **The mezcal council as a roster.** COMERCAM certifies the mezcal appellation
  but publishes no padrón: the site offers per-bottle hologram verification and
  aggregate statistics, and its commercial-allies page is empty. Producers have
  to be enumerated another way.
- **Generic settlement classes on Wikidata.** Barely 120 Mexican places are
  typed as a city or a town. Ceilings in `data/csv/mx/AGENTS.md`.

## Identity traps

- **The registered address is the office.** A DO roster gives the fiscal
  address, so national brands appear in Guadalajara or Mexico City while the
  distillery is in Tequila or Pénjamo. Resolve the productive unit before
  writing `municipio`, and never open a row in the state the file happens to
  name.
- **A generated column looks like data.** In the tequila brand file the phone
  increments by one per brand row for the same company. Check a repeating field
  across a company's rows before trusting it.
- **Brand ≠ producer.** One certified company carries dozens of brands, and
  contract distilling means a brand may have no plant at all. The row is the
  productive unit.
- **The locality may outrank the municipality in fame.** Valle de Guadalupe and
  Tequila are what people say; only one of them is a municipality, and it is not
  where the wine is. Check the name against the municipality catalog before
  using it as `municipio`.
