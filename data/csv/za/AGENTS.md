# South Africa

## Operating state
- Phase: opening. The tree covers the 52 districts and metros and every area file
  is still empty. Derive live queues with `npx pnpm check:defects --country za`.
- Active lane: first discovery per area in `docs/candidates/za/<area>.md`,
  starting with the wine sub-route associations, which are the only South
  African producer lists that publish an address per member.

## Country rules
- `region` is a province and `area` a district or metropolitan municipality.
  Both tiers are statutory: the Municipal Structures Act splits the country into
  category A metros and category C districts, and the National Treasury
  municipal registry publishes them as 8 metros and 44 districts. There is no
  official grouping above the province, which is why the province is the region.
- `municipio` is the town. The local municipality is a fourth layer that no
  address writes, and the district is already the area.
- A metro is named after its council, not its city. Write Cape Town,
  Johannesburg, Pretoria, Durban, Gqeberha, East London or Bloemfontein as
  `municipio`; the area they file under is the metro that contains them.
- The Cape Town boundary cuts through the winelands. Farms at Faure, Somerset
  West and Philadelphia are in the metro while their association is the
  Stellenbosch one, so resolve the district from the town and never from the
  route that lists the producer.
- Port Elizabeth was renamed Gqeberha in 2021 and both names are still in use;
  they are one place in Nelson Mandela Bay.
- The centroid catalog is settlements only. The local-municipality classes were
  tried and removed because a council carries its main town's name at a seat
  tens of kilometres away, which took George, Prince Albert and Oudtshoorn out
  as homonyms. Cape Town and Pretoria are in it only because `big city` was
  added: neither carries a settlement class on Wikidata. Durbanville,
  Constantia and Somerset West are typed suburb or neighbourhood.
- Names repeat across provinces — Worcester, Heidelberg, Middelburg, Richmond,
  Elim, Jamestown, Blackheath, Chatsworth — and are resolved by province in
  `data/reference/municipality-overrides.json`. Metro suburb names repeat too
  (Newlands, Kenilworth, Observatory, Rosebank, Wynberg) and are keyed nowhere;
  a row writing one gets no geographic gate, so write the city instead.
- Durbanville is in the same override file for a different reason: its only
  Wikidata item sits at 18.85, which is Klapmuts, about 18 km east of the town
  and on the wrong side of Kraaifontein and Brackenfell. The override carries the
  real position, so do not "fix" a correctly geocoded Durbanville row against
  the rebuilt catalog.

## Source ceilings
- The WOSA member index (`wosa.co.za/About-Us/WOSA-Members/`) is the widest wine
  roster in the country, but it publishes a name and a website and nothing else:
  no address, no municipality, no phone. It cannot open a row on its own. Its
  URL column is also corrupted in about 25 entries, which arrive as
  `http://www.https://...` or `http://www.www/...`; repair the URL before
  treating a member as unreachable.
- WOSA membership is export marketing, so the list mixes farms with négociants,
  brand owners and groups that own no cellar. The row is the productive unit.
- A regional wine route is the opposite trade-off, and a partial one. The
  Stellenbosch route publishes an email, a phone and a site for every member,
  which is what WOSA lacks, but a street address and a point for only about one
  member in nine: the rest render no map at all. It confirms a producer is
  trading in the sub-region now; it does not place it, and it does not claim to
  be complete.
- The National Treasury municipal registry
  (`municipaldata.treasury.gov.za/api/cubes/municipalities/facts`) is
  authoritative for the municipal tree and says nothing about producers.
- OpenStreetMap is thin here: a national sweep of the producer crafts and farm
  shops returns about 130 named objects for the whole country, so it seeds
  provinces that have no association rather than covering any of them.
