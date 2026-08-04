# Portugal — country guide

What is true of `data/csv/pt/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = district (20 CSVs), `region` = region (7, Açores and Madeira among them). `country.json` declares both names.
- Slugs are ASCII (`braganca`, `evora`, `setubal`); labels keep the Portuguese accents. No aliases in use yet.

## State
- 38 rows across 7 districts (Aveiro, Évora, Faro, Porto, Setúbal, Açores, Madeira). The other 13 district CSVs are published empty.

## Geography
- Centroids come from Wikidata's "municipality of Portugal": the 308 concelhos, islands included, labelled in pt. Every row resolves, so the geographic gate is on and a green run means checked.
- Two concelho names repeat inside Portugal and are resolved by region in `data/reference/municipality-overrides.json`: `lagoa` (Algarve / Açores, 1.500 km apart) and `calheta` (Açores / Madeira).
- Fifteen more collide with a Spanish municipio, and Spain keeps the shared key. `porto` and `penafiel` are disambiguated; `gondomar`, `maia`, `paredes`, `benavente`, `montijo`, `mira`, `vila real`, `santa cruz`, `belmonte`, `monforte`, `oleiros`, `mora` and `almodôvar` are not, because no row uses them yet. The first producer in one of those concelhos will fail the 100 km rule loudly rather than pass wrong; add the override then, listing both countries' candidates so neither side loses its lookup.

## Sources
- Not established yet. Candidates to evaluate and then record here: DOP/IGP registries, regional producer directories, and the certifying bodies of the wine regions. Until they are, additions rest on the producer's own site and a listing normally supports at most `parcial`.

## Conventions
- `nombre`, `municipio` and `direccion` in Portuguese; `descripcion` in Spanish, like the rest of the catalog.
- Categories are the shared closed list; do not add Portuguese-specific labels.
