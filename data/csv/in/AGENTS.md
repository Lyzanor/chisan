# India

## Operating state
- Priorities: re-verification, exact productive-unit geolocation and image
  enrichment for admitted rows. Derive exact published-row queues with
  `npx pnpm check:defects --country in`; open an area candidate note only for a
  concrete discovery batch.

## Country rules
- `region` is a zone and `area` a state or union territory. The zones follow the
  five statutory Zonal Councils plus the North Eastern Council, which is the
  only official grouping of Indian states.
- Four areas are placed geographically because no current statutory text names
  them: Telangana and Ladakh did not exist when the composition was written,
  and Lakshadweep and the Andaman & Nicobar Islands were never assigned to a
  zone at all. Nothing downstream depends on the zone, so do not re-litigate it
  per row.
- `municipio` is the city or town the producer publishes. India's layer below
  the district is the village, and a rural address does name it, but the village
  belongs in `direccion`: keep `municipio` at the town the address resolves to.
- Village names repeat across states on a scale nothing else in the catalog
  approaches, so `village in India` is deliberately absent from the centroid
  catalog. A `municipio` that is only a village therefore has no geographic
  gate; that is honest, not a defect to backfill.
- A district and its headquarters town share a name constantly (Nashik,
  Darjeeling, Jaipur). The district is not the `municipio`; write the town.
- Romanisation is not stable. Bengaluru/Bangalore, Kozhikode/Calicut,
  Thiruvananthapuram/Trivandrum and Puducherry/Pondicherry all resolve, because
  the centroid catalog carries English altLabels, but pick the spelling the
  producer itself publishes.

## Source ceilings
- Government hosts answer a plain fetch inconsistently: `mha.gov.in` returns 403
  to WebFetch and 200 to `curl` with a browser user-agent, while
  `indiacoffee.org`, `igpb.in` and `jaivikbharat.fssai.gov.in` did not resolve
  at all. Confirm by a second route before treating any of them as dead.
- The MHA zonal-council composition text is stale on its face: it still calls
  Odisha "Orissa", lists Jammu & Kashmir as a state, places Sikkim in the
  Eastern zone while noting its 2002 move to the North Eastern Council, and
  predates Telangana, Ladakh and the merged Dadra & Nagar Haveli and Daman & Diu.
  It establishes the zones, not the current membership.
- APEDA's exporter and organic directories are the widest official lists, but
  they render their results in JavaScript and they enumerate *exporters*:
  the exporter-type filter separates manufacturer from merchant precisely
  because most entries are traders. A listing there is not a producer.
- Tea Board pages are JavaScript shells. The navigation names the Darjeeling GI
  protection, small-grower and licensing lists, but none of that content is in
  the served HTML, so the garden rosters need another route.
- Nominatim barely covers India. Across a first batch, no postal address
  resolved at all — neither a PIN nor a `Gat` survey number — and only two trade
  names returned the producer's own POI. Assume the municipal centroid and say
  so in the evidence rather than forcing a point.
- OpenStreetMap is not a producer register here. A country-wide `craft=*` /
  `shop=farm` sweep returns mostly sweet shops, flour and oil mills and state
  liquor outlets, and under 5% carry a website. Use it to locate a producer you
  already have, not to enumerate.
- A producer's contact page publishes the corporate office, not the productive
  unit: Kolkata for tea brands, New Delhi for wine. The estate or winery is
  usually named in the homepage narrative instead.
- Wikidata types an Indian city as `big city`, `metropolis`, `megacity`,
  `largest city` or `state capital` and gives it none of the generic settlement
  classes. Anything reading Indian places out of Wikidata that asks only for
  city/town/village silently loses every large city.
