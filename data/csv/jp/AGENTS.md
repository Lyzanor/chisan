# Japan

## Operating state
- Phase: active expansion from initial verified batches and prefectural discovery. Derive the published-row queues with `npx pnpm check:defects --country jp`.
- Discovery is open across `docs/candidates/jp/**`; prune resolved candidates and store row decisions in `data/evidence/jp/**`.

## Country rules
- `municipio` is the current municipality (`shi`, `cho` or `son`); a Tokyo special ward may also be used. Ordinary city wards, `gun`, historical areas and dissolved municipalities are not municipalities.
- For Tokyo, use the special ward or Tama/island municipality, never `Tokyo` as a generic municipality. Retain former municipalities and smaller localities in `direccion`.
- Treat rōmaji as provisional until published by the producer or a competent source. Match homonymous companies by Japanese name plus municipality, not by romanized surname alone.
- Japanese address geocoders may stop at a block or drop a final lot/sub-lot component. Record the deepest matched component and accept the point only when the remaining address is independently tied to the productive unit; a locality-only result is not an exact address.

## Source ceilings
- Prefectural alcohol guilds and national guild indexes can support listed identity, product type and municipality, but usually not the producer's domain, current activity or online sales; without a current direct source they normally cap verification at `parcial`.
- SAKETIMES and user-supplied lists are discovery or supporting sources, not automatic admission.
