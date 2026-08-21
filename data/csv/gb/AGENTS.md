# United Kingdom

## Operating state
- Priorities: area-scoped producer discovery from the protected-name register
  and suitable trade or regulatory directories, followed by review of admitted
  rows. Derive exact published-row queues with
  `npx pnpm check:defects --country gb`.
- Active discovery and its cutoffs live in `docs/candidates/gb/<area>.md`; row
  decisions belong in `data/evidence/gb/**`.

## Country rules
- `region` is the ITL1 statistical level, so England's nine regions sit beside
  Scotland, Wales and Northern Ireland. `area` is the ceremonial county in
  England, the council area in Scotland, the principal area in Wales and the
  traditional county in Northern Ireland.
- The post town in a UK address is a Royal Mail sorting label, not a place: it
  routinely names a town in another county than the unit (Boncath in
  Pembrokeshire for a farm in Carmarthenshire). Take the area from the
  postcode, never from the address line.
- `municipio` is the settlement the producer publishes; when that hamlet has no
  centroid, use the civil parish the postcode resolves to. Neither is the post
  town.
- Coordinates come from the unit's postcode (`api.postcodes.io`), which also
  returns the council district, the parish and the ITL1 region. Northern
  Ireland has no parish layer there.
- Homonyms are the norm: 2.944 UK settlement names are ambiguous and have no
  centroid at all, so those rows skip the geographic gate. Fix the ones that
  matter in `municipality-overrides.json` — but a Scottish, Welsh or Northern
  Irish homonym cannot be resolved that way, because the override key is the
  region slug and each of those nations is a single region.
- The Isle of Man and the Channel Islands are not part of the United Kingdom
  and have no area here, even though the protected-name register carries their
  products.

## Source ceilings
- The Defra protected food and drink register
  (`gov.uk/api/search.json?filter_format=protected_food_drink_name`) is the
  authoritative list of protected names, not of producers: it proves a product
  name and its area, never who currently makes it.
- The Food Standards Agency establishment register
  (`api.ratings.food.gov.uk`) publishes the registered trading name, official
  address and business type of every food business, and its
  `Manufacturers/packers` and `Farmers/growers` types are a real production
  signal. It publishes no phone, email or website, its name search is fuzzy,
  and a retail registration at an address does not prove production there.
- A brand's own site can be a market site rather than the producer's: the
  Bushmills domain serves North America, so its shop proves nothing about
  remote ordering from the UK.
