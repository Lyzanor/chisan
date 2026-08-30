# Argentina

## Operating state
- Public catalog status: standby. Keep the catalog, evidence and editorial
  workflows maintained, but do not publish or index this country.
- Priorities: targeted area discovery, stronger producer-owned evidence for
  directory-seeded rows and resolution of online sales.

## Country rules
- Argentine addresses do not use one consistent administrative layer:
  producers may publish a localidad while registers publish a departamento or
  municipio. Use the place the productive address supports and keep any smaller
  locality in `direccion`.
- Valle de Uco is a wine region, not a jurisdiction. Use Tupungato, Tunuyán or
  San Carlos as `municipio`, as applicable, and keep the valley or paraje in
  `direccion`.

## Source ceilings
- Caminos y Sabores exhibitor guides normally live below
  `caminosysabores.com.ar/wp-content/uploads/<year>/07/`. Parse each exhibitor
  block from its uppercase name through `Rubros:`; provincial pavilions may
  list co-exhibitors without a stand code.
- Caminos y Sabores exhibitor guides support participation in the dated fair and
  the identity, address and contacts declared there. They do not prove current
  trading, and the declared address may be a commercial office.
- Mercados Bonaerenses supports registration in the provincial programme and
  its declared identity, location and contact. It does not prove current
  activity, and entries filed under personal names need a public-brand match.
- The Bodegas de Argentina directory mixes wineries with supplier and service
  members. Use it for listed identity and contact only; establish the productive
  municipality independently.
- Las Rutas Sanas del Alimento is an undated self-registration map. Its
  productive-unit layer supports declared identity, approximate location and
  activity, not current trading. Download its public My Maps KML and use the
  `Unidades productivas / Quintas / Huertas con venta directa` layer; mirrors
  may truncate contact text.
- Provincial wine rosters may expose named wineries with address and contact;
  preserve the exact dated roster in the area note. Use the public Georef API
  at `apis.datos.gob.ar/georef/api/` only to reconcile administrative names,
  never as producer evidence.
- The national INV and RENAPA open datasets publish aggregate departmental
  counts, not producer names, and cannot supply candidates.
