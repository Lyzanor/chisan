# Argentina

## Operating state
- Phase: opening. The tree covers the 23 provinces and the Ciudad Autónoma de
  Buenos Aires. Twelve areas now hold twenty or more rows; Chaco, Formosa and
  Santa Cruz are still empty or near it. Derive live queues with
  `npx pnpm check:defects --country ar`.
- Active lane: the three areas with no material and the nine still under twenty
  rows, tracked in `docs/candidates/ar/<area>.md`. Every current row rests on a
  directory plus, where it answers, the producer's own site, so the other
  standing lane is raising them from `parcial` and resolving `Venta online`.

## Country rules
- `region` is one of the six statistical regions INDEC defined in 1980 and
  `area` a province. Five of them group whole provinces; the sixth,
  Metropolitana, is CABA plus the municipalities around it, which would split
  the province of Buenos Aires. The tree groups whole jurisdictions, so Buenos
  Aires stays whole in Pampeana and Metropolitana holds CABA alone. The
  interprovincial treaty regions were not usable for this: they leave Buenos
  Aires in no region at all.
- La Rioja is in the Noroeste, where INDEC puts it. It signed the Nuevo Cuyo
  treaty and wine writing still files it under Cuyo, so the disagreement is
  expected. Nothing downstream depends on the region; do not re-litigate it.
- `municipio` is what the address names, and Argentina has no single layer that
  always is: a producer writes the localidad (Chacras de Coria, Perdriel), a
  registry writes the departamento (Luján de Cuyo, San Rafael), and municipios
  exist in some provinces and not others. The centroid catalog holds all four
  layers, settlement first, so any of them resolves.
- Valle de Uco is a wine region, not a jurisdiction, and has no centroid. Write
  the departamento it belongs to — Tupungato, Tunuyán or San Carlos — and keep
  the valley in `direccion`. Gualtallary and the other parajes inside those
  departamentos work the same way.
- `cordoba-argentina` and `la-rioja-argentina` carry the suffix because Spain
  already owns `cordoba` and `la-rioja` and the area slug is a global URL key.
  Do not "fix" this with an alias: `loadAliases` in `lib/csv-catalog.ts` merges
  every country's aliases into one map and applies it *before* the area
  registry, so an `ar` alias named `cordoba` would take Spain's area down.
- Six regions of four to six provinces each resolve fewer homonyms than a
  country with many regions would. `municipality-overrides.json` is keyed by
  region, so it can separate Maipú in Mendoza from Maipú in Buenos Aires, but
  not 25 de Mayo, Rivadavia, San Martín, Santa Rosa or San José, which repeat
  inside a single region. Those names have no key and their rows get no
  geographic gate at all.

## Source ceilings
- The exhibitor guide of Caminos y Sabores, the national producers fair, is the
  widest named roster the country publishes: about a thousand unique entries
  across the 2024, 2025 and 2026 editions, each with the producer's address,
  city, phone, email, site, socials and product lines. Two limits shape it. It
  is a fair, so it proves the producer exhibited that July, not that it still
  trades; and three provinces do not attend at all, so Chaco, Formosa and Santa
  Cruz get nothing from it. The address is the one the exhibitor declares and is
  sometimes a Buenos Aires office for production elsewhere, the same trap as the
  winery directory below.
- The Bodegas de Argentina member directory is the widest current named winery
  list the country publishes: about 200 entries with address, phone, website
  and email on one page. Two things in it will corrupt rows. It mixes wineries
  with the association's supplier and service members — banks, cork, glass,
  staffing, insurance — so it must be triaged, not imported. And the address is
  often the commercial office: Humberto Canale files under CABA with its winery
  in General Roca, San Huberto under CABA with its winery in La Rioja, Sophenia
  under CABA with its estate at Gualtallary. Take identity and contact from the
  directory; take the municipality from the producer's own site. Its contact
  columns are not clean either: about 13% of the URLs do not resolve, one entry
  carries a bare `-` as its website, one points at an unrelated hotel domain,
  and at least one email is misspelled at the domain.
- The national open-data portal publishes the INV vitiviniculture and RENAPA
  apiculture registers aggregated to departamento: counts of bodegas, viñedos,
  apiarios and colmenas, never names. Neither can supply a producer.
- Argentine drinks sites commonly sit behind an age gate and render client
  side, so a plain fetch returns an interstitial with no contact data at all.
  That is not a dead site and not an absent shop; confirm by another route or
  leave the row at `parcial`.
- Nominatim resolves an Argentine winery by trade name more often than expected
  but fuzzy-matches silently: "Bodega Gamboa, Campana" returns Casa Camboa,
  11 km away and a different business. Read the display name it returns, not
  only the distance to the centroid.
