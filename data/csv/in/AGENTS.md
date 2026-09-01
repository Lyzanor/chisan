# India

## Operating state
- Public catalog status: standby. Keep catalog, evidence, account and
  repository-wide validation state maintained, but do not publish or index it.
- Pause routine discovery, enrichment, translation and geolocation updates.
  Resume them only through an explicit country-scoped instruction.

## Country rules
- `municipio` is the city or town supported by the productive address, never
  the district. Keep a village or survey locality in `direccion`.
- A district and its headquarters town often share a name. Confirm that the
  producer means the town before using it as `municipio`.
- Romanisation is not stable. Prefer the spelling published by the producer and
  match identities with the native name, address and product where possible.
- A tea brand may aggregate several gardens, and a brewery taproom may be
  separate from the plant. The row represents the productive unit.
- English is the country default. Area variants follow the reviewed state or
  union-territory policy: Hindi for Chandigarh, Delhi, Haryana, Himachal
  Pradesh, Rajasthan, Chhattisgarh, Madhya Pradesh, Uttar Pradesh, Uttarakhand,
  Andaman and Nicobar Islands, Bihar and Jharkhand; Punjabi for Punjab; Odia for
  Odisha; Bengali for West Bengal and Tripura; Assamese for Assam; Nepali for
  Sikkim; Telugu for Andhra Pradesh and Telangana; Kannada for Karnataka;
  Malayalam for Kerala and Lakshadweep; Tamil for Tamil Nadu; Konkani for Goa;
  Gujarati for Gujarat and Dadra and Nagar Haveli and Daman and Diu; and Marathi
  for Maharashtra. Keep multilingual or territorially divided areas, including
  Puducherry, Jammu and Kashmir and the north-eastern states not listed above,
  English-only until a non-misleading catalog-area policy is reviewed.

## Source ceilings
- A producer store's `/products.json?limit=3` may confirm an exposed Shopify
  catalog; a `404` or HTML response proves only that the route is unavailable.
  Establish the estate, garden, winery or plant from producer narrative before
  using a contact-page address, which may be a corporate office.
- APEDA exporter and organic directories enumerate registered exporters and
  certified operators. Even a manufacturer classification does not by itself
  prove a current public producer identity or consumer offer.
- Tea Board grower, licensing and geographical-indication material supports only
  the registration or status it publishes; it does not establish current
  trading or online sales.
- OpenStreetMap can help locate an already identified urban brewery, shop or
  productive unit but is not a reliable national producer roster.
- The Constitution's Eighth Schedule and the applicable state or union-
  territory official-language rules support language-route policy only. They
  do not prove that an individual producer uses that language or that a
  multilingual territory has one uniform preferred language.
