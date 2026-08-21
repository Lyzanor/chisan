# Argentina

## Operating state
- Priorities: targeted area discovery, strengthening directory-seeded rows with
  producer-owned sources and resolving online sales. Derive the exact published
  row queues with `npx pnpm check:defects --country ar`.
- Active discovery and its cutoffs live in `docs/candidates/ar/<area>.md`; row
  decisions and re-verifications belong in `data/evidence/ar/**`.

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
- `cordoba-argentina` and `la-rioja-argentina` retain their existing suffixes.
  Areas and aliases are resolved by `(country, area)`, so Spain is no longer a
  technical collision; renaming either remains a separate data cleanup and is
  not incidental work.
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
- The province of Buenos Aires runs the only provincial producer register that
  publishes names: Mercados Bonaerenses, about 2,500 entries with trading name,
  partido, localidad, product lines and the contact route the producer declared.
  It is a programme roll, so it proves the producer registered to sell at the
  provincial markets, not that it still trades, and most entries are filed under
  a person's name rather than a brand. Its contact column ages badly: shops
  taken down, domains that no longer resolve, and at least one that is now an
  unrelated news portal. No other province publishes an equivalent.
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
  one publishes a domain the winery no longer holds and which now serves casino
  spam, and at least one email is misspelled at the domain.
- The My Maps of Las Rutas Sanas del Alimento (Red Interregional de Nodos
  Agroecológicos) is the widest agroecological roster in the country and the one
  source that reaches Chaco: 1.035 self-registered points, of which the
  "Unidades productivas" layer holds 307 producers with coordinates, declared
  activity and, four times out of five, a phone or an email. `agroeco.red/mapa`
  republishes it point for point but truncates the descriptions to 240
  characters, so take the data from the KML, not from the mirror. It is
  self-registration with no date and no review, so it supports identity,
  approximate location and declared activity, never current trading: a third of
  the Instagram handles it publishes no longer exist. Its point and its declared
  address disagree often enough that `municipio` must come from the text.
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
