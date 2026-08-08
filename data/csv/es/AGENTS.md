# Spain

## Operating state
- Phase: mature-catalog maintenance with targeted area discovery. Derive the live queues with `npx pnpm check:defects --country es` and review the dated link snapshot before opening domains.
- Active source passes live in `docs/candidates/es/**`; row decisions and re-verifications belong in `data/evidence/es/**`.

## Country rules
- `municipio` is the official municipality, not a barrio, distrito, pedanía, parroquia or comarca; retain the smaller locality in `direccion`.
- Place a row in the province of the productive unit, not the province of a head office, regulatory council, appellation or retail outlet.
- Preserve the producer's and authority's public Spanish, Catalan, Galician or Basque spelling; do not translate proper names to make rows look uniform.

## Source ceilings
- Denomination councils, certification registers and autonomous or provincial producer directories support only the membership, product, identity or location they actually publish. They do not by themselves prove current activity, a public own offer or online sales.
- Municipal markets, food routes and fair rosters are discovery sources and may list retailers, hospitality, associations or sales points rather than qualifying producers.
