# Mexico

## Operating state
- Phase: opening. The tree covers the 32 federal entities and every area file is
  still empty. Derive live queues with `npx pnpm check:defects --country mx`.
- Active lane: first discovery per area in `docs/candidates/mx/<area>.md`,
  starting with the denominación de origen councils, which publish the only
  bounded, named and currently dated producer rosters in the country.

## Country rules
- `region` is a mesorregión and `area` a federal entity. The five mesorregiones
  are the ones the Plan Nacional de Desarrollo 2001-2006 defines, and they are
  the only official grouping of whole federal entities Mexico has.
- The PND lets one state belong to two mesorregiones — "un estado con intereses
  en dos regiones puede participar en ambas" — and four do: Chihuahua and
  Durango (Noreste and Noroeste), Puebla and Querétaro (with Centro). The tree
  has to be a partition, so each is placed once: Puebla and Querétaro outside
  Centro, which leaves Centro as the Valle de México core, and Chihuahua and
  Durango in Noreste alongside Coahuila, the third state of the sotol
  denominación de origen. Puebla's placement is the one with live corroboration:
  Fidesur, the federal trust for the Sur-Sureste, still lists it. Nothing
  downstream depends on the mesorregión, so do not re-litigate it per row.
- The PND text is stale on its face: it names the Distrito Federal, which became
  Ciudad de México in 2016. It establishes the grouping, not current names.
- `municipio` is the municipality. The layer below it is the *localidad*, and a
  rural address does name one, but the localidad belongs in `direccion`.
- Mexican municipalities honour the same national figures state after state, so
  the centroid catalog drops the repeated names instead of picking a winner:
  Guadalupe, Juárez, Hidalgo, Morelos, Benito Juárez and Cuauhtémoc have no key
  at all and their rows get no geographic gate. The region-keyed override
  resolves one only where the region makes it unique, which is why Cuauhtémoc is
  keyed for Chihuahua but Benito Juárez is keyed nowhere: Quintana Roo, Guerrero
  and Veracruz each have one and all three are Sur-Sureste.
- Valle de Guadalupe, the Baja California wine valley, is not a municipality but
  a locality inside Ensenada. The only municipality of that name is in Jalisco,
  1.700 km away, and a row writing it as `municipio` takes Jalisco's centroid.
  Write Ensenada and keep the valley in `direccion`.
- Ciudad de México is divided into 16 alcaldías, which are territorial
  demarcations rather than municipios. They are what the centroid catalog holds
  for the city, so write the alcaldía.

## Source ceilings
- The Consejo Regulador del Tequila publishes dated XLSX rosters of certified
  companies and of brands bottled inside the appellation — the widest current
  producer list for Jalisco. Two columns do not carry what they appear to: the
  address is the fiscal one, so Guadalajara and even entities outside the
  appellation show up where the distillery is elsewhere, and the phone appended
  to it is not a contact at all. Across companies with three or more brands the
  number increments by exactly one per brand row. Take identity, the appellation
  and the brand list from the file; never the phone.
- A denominación de origen council certifies a company and its brands. That
  supports identity and the appellation, not current activity and not online
  sales.
- Wikidata labels a Mexican municipality with its administrative form,
  "Municipio de Tequila", which no address ever writes. The bare name a row
  carries is in the altLabels, which nearly every item has.
- Wikidata types barely 120 Mexican places as a city or a town, so anything
  reading Mexican places out of the generic settlement classes returns almost
  nothing. The municipality class is the only layer with national coverage.
- Of the two regional-development bodies the mesorregiones left behind, only
  Fidesur (`sursureste.org.mx`) is live. FIDERCO's site (`centroccidente.org.mx`)
  is an abandoned 2005 frameset that still asks for Internet Explorer 5, so it
  settles nothing about current membership even though its PDFs still download.
