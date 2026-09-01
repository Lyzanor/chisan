# Portugal

## Operating state
- Public catalog status: standby. Keep catalog, evidence, account and
  repository-wide validation state maintained, but do not publish or index it.
- Pause routine discovery, enrichment, translation and geolocation updates.
  Resume them only through an explicit country-scoped instruction.

## Country rules
- `municipio` is the concelho, never the freguesia, localidade or district;
  retain the smaller locality in `direccion`.
- Place the row in the district of the productive unit. In Açores and Madeira,
  use the catalog's autonomous archipelago area.
- Preserve Portuguese public spelling and prefer the producer's public brand
  over the holder's personal or legal name when they differ.

## Source ceilings
- [Produtos Tradicionais Portugueses](https://www.ptpt.pt/produtores),
  [ANICP](https://anicp.pt/associados/),
  [Casa do Azeite](https://casadoazeite.pt/pt/associados) and
  [Marca Açores](https://www.marcaacores.pt/promotores) are reusable discovery
  directories for traditional products, preserves, olive oil and certified
  Azorean promoters respectively.
- Wine routes, confraternities and DGADR traditional-product pages support only
  the membership, product, identity or concelho they publish. They do not by
  themselves prove current activity, a producer-owned offer or online sales.
- A tourism route, fair or collective storefront is discovery or supporting
  evidence unless it identifies both the productive unit and the producer
  behind the offer.
