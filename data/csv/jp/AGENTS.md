# Japan

## Operating state
- Public catalog status: standby. Keep catalog, evidence, account and
  repository-wide validation state maintained, but do not publish or index it.
- Pause routine discovery, enrichment, translation and geolocation updates.
  Resume them only through an explicit country-scoped instruction.

## Country rules
- `municipio` is the current municipality (`shi`, `cho` or `son`); a
  Tokyo special ward may also be used. Ordinary city wards, `gun`, historical
  areas and dissolved municipalities are not municipalities.
- In Tokyo, use the special ward or Tama/island municipality, never `Tokyo` as
  a generic municipality.
- Treat rōmaji as provisional until published by the producer or a competent
  source. Match homonymous companies by Japanese name plus municipality.
- Japanese address geocoders may stop at a block or omit the final lot. Accept a
  point only when the unmatched address is independently tied to the productive
  unit.

## Source ceilings
- Prefectural alcohol guilds and national guild indexes support listed identity,
  product type and municipality, but usually not current activity, the
  producer's domain or online sales. The national index is at
  `japansake.or.jp/sake/link/index.html`; brewery paths commonly use
  `japansake.or.jp/sakagura/jp/<prefecture>/`, with `kouchi` for Kochi.
- National trade-guild member directories for 和菓子, 米菓 and 乾麺 support the
  listed member, address and product type. Membership still does not prove
  current activity or online sales.
- SAKETIMES is a discovery or supporting source, not automatic admission.
- 本場の本物 certifies regional products and commonly names the sponsoring
  cooperative rather than individual makers.
- Sake is not the only relevant prefectural beverage: include shochu sources
  for Kagoshima and Miyazaki, awamori for Okinawa and the Kuma shochu guild for
  Kumamoto. Keep source request-limit resumption points in the area note.
