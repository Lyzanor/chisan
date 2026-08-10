# Japan

## Operating state
- Phase: active expansion from initial verified batches and prefectural discovery. Derive the published-row queues with `npx pnpm check:defects --country jp`.
- Discovery is open across `docs/candidates/jp/**`; prune resolved candidates and store row decisions in `data/evidence/jp/**`.

## Country rules
- `municipio` is the current municipality (`shi`, `cho` or `son`); a Tokyo special ward may also be used. Ordinary city wards, `gun`, historical areas and dissolved municipalities are not municipalities.
- For Tokyo, use the special ward or Tama/island municipality, never `Tokyo` as a generic municipality. Retain former municipalities and smaller localities in `direccion`.
- Treat rōmaji as provisional until published by the producer or a competent source. Match homonymous companies by Japanese name plus municipality, not by romanized surname alone.
- Japanese address geocoders may stop at a block or drop a final lot/sub-lot component. Record the deepest matched component and accept the point only when the remaining address is independently tied to the productive unit; a locality-only result is not an exact address.
- The GSI address search (`msearch.gsi.go.jp/address-search/AddressSearch?q=`) resolves current municipalities only: it returns nothing for a leading `〒` postal code or a pre-merger town, and drops the `郡` level from its answer. Its title names the municipality it actually matched, so compare that name with `municipio` before accepting; a bare prefecture means it gave up.
- Romanized `municipio` collapses distinct municipalities (Ichinomiya, Sakai, Ōta, Misato…). Fix those in `data/reference/municipality-overrides.json` by region, and never when both homonyms sit in the same region — there the key cannot separate them.

## Source ceilings
- Prefectural alcohol guilds and national guild indexes can support listed identity, product type and municipality, but usually not the producer's domain, current activity or online sales; without a current direct source they normally cap verification at `parcial`.
- SAKETIMES and user-supplied lists are discovery or supporting sources, not automatic admission.
- National trade-guild member directories for non-alcoholic food (和菓子協会, 米菓工業組合, 乾麺協同組合連合会) publish name, street address and the member's own domain in one row, so they carry identity, municipality and product type further than the alcohol guilds. They still prove membership, not current activity or online sales.
- 本場の本物 (`honbamon.com`) certifies a regional product and names only the sponsoring cooperative, never the individual makers. Use it to locate a vertical, then go to that cooperative for the member list.
