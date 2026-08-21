# United Kingdom

## Operating state
- Priorities: area-scoped discovery from protected-name, trade and regulatory
  sources, followed by review of admitted rows.

## Country rules
- The post town in a UK address is a Royal Mail sorting label and may name a town
  in another county. Determine the area from the productive address and
  postcode, never from the post town alone.
- `municipio` is the settlement or civil parish containing the productive
  unit, not the post town. Preserve a smaller hamlet or locality in
  `direccion`.
- A tasting room, brand office or market-specific storefront does not establish
  where production occurs or where remote ordering is available.

## Source ceilings
- The Defra protected food and drink register is authoritative for protected
  product names and areas, not for the producers currently making them.
- The Food Standards Agency establishment register supports the registered
  trading name, address and business type it publishes. Its
  `Manufacturers/packers` and `Farmers/growers` types are production
  signals, but a retail registration does not prove production at that address.
