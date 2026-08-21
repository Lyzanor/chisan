# Argentina discovery methods

Apply the [shared candidate workflow](../README.md) and the
[Argentina rules and source ceilings](../../../data/csv/ar/AGENTS.md). Keep
source-specific dates, cutoffs and unresolved candidates in the area note.

## Reusable sources

- **Caminos y Sabores exhibitor guides.** Annual PDFs normally live below
  `caminosysabores.com.ar/wp-content/uploads/<year>/07/`. Parse each exhibitor
  block from its uppercase name through `Rubros:`; provincial pavilions may list
  co-exhibitors without a stand code.
- **Bodegas de Argentina.** Its member directory is a single HTML roster. Triage
  it before use because winery entries appear beside banks, packaging,
  recruitment and other service members.
- **Provincial wine rosters.** Wine museums, tourism bodies and provincial routes
  may expose named wineries with address and contact. Record the exact roster
  and review date in the relevant area note.
- **Las Rutas Sanas del Alimento.** Download the public My Maps KML directly; the
  useful layer is `Unidades productivas / Quintas / Huertas con venta directa`.
  Prefer the full KML description to mirrors that truncate contact text.
- **Georef.** The public `apis.datos.gob.ar/georef/api/` endpoint can confirm
  the province, departamento, municipio and localidad named by an address before
  the candidate is assigned to an area.
