# Portugal — country guide

What is true of `data/csv/pt/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = district (20 CSVs), `region` = region (7, Açores and Madeira among them). `country.json` declares both names.
- Slugs are ASCII (`braganca`, `evora`, `setubal`); labels keep the Portuguese accents. No aliases in use yet.

## State
- 78 rows across 14 districts. The first seven (Aveiro, Évora, Faro, Porto, Setúbal, Açores, Madeira) were reviewed row by row; Braga, Bragança, Guarda, Lisboa, Viana do Castelo, Vila Real and Viseu opened on 2026-08-04 from institutional rosters and are `parcial` throughout. Six district CSVs are still published empty.
- The open queues are in `docs/candidates/pt/**`. The recurring blocker is the concelho: a wine region roster crosses districts and rarely states it, so a producer stays out until its own site places it.

## Geography
- Centroids come from Wikidata's "municipality of Portugal": the 308 concelhos, islands included, labelled in pt. Every row resolves, so the geographic gate is on and a green run means checked.
- Two concelho names repeat inside Portugal and are resolved by region in `data/reference/municipality-overrides.json`: `lagoa` (Algarve / Açores, 1.500 km apart) and `calheta` (Açores / Madeira).
- Fifteen more collide with a Spanish municipio, and Spain keeps the shared key. `porto` and `penafiel` are disambiguated; `gondomar`, `maia`, `paredes`, `benavente`, `montijo`, `mira`, `vila real`, `santa cruz`, `belmonte`, `monforte`, `oleiros`, `mora` and `almodôvar` are not, because no row uses them yet. The first producer in one of those concelhos will fail the 100 km rule loudly rather than pass wrong; add the override then, listing both countries' candidates so neither side loses its lookup.

## Sources
- `tradicional.dgadr.gov.pt` is the national DOP/IGP catalogue: it names the managing group and the certifying body per product, not the producers. Use it to find who holds the real roster, then go there.
- The **CVR** of each wine region is the census (CVR Dão lists 117 bottlers); its **rota dos vinhos** is the tourist roster and is much smaller (42 for the same region). Measure a gap against the CVR, never against the rota. Several rota sites render the listing in JavaScript and return nothing in flat HTML — the Vinhos Verdes adherent search is one; go for the endpoint behind it.
- **Municipal sites and confrarias** are the practical roster for non-wine DOPs: Câmara de Mirandela publishes the Alheira IGP producers, the Confraria do Queijo Serra da Estrela publishes the certified dairies with contact. They carry phone and address but rarely a website, and their listings truncate — page to the end before calling a front closed.
- A wine region crosses districts (Dão spans Viseu, Guarda and Coimbra; the Douro covers seven concelhos of Vila Real): a region roster is never a district roster. Confirm the concelho on the producer's own site.
- All of these confirm existence, not activity or online sales, so a listing supports at most `parcial`.

## Conventions
- `nombre`, `municipio` and `direccion` in Portuguese; `descripcion` in Spanish, like the rest of the catalog.
- Categories are the shared closed list; do not add Portuguese-specific labels.
