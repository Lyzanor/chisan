# Portugal — country guide

What is true of `data/csv/pt/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = district (20 CSVs), `region` = region (7, Açores and Madeira among them). `country.json` declares both names.
- Slugs are ASCII (`braganca`, `evora`, `setubal`); labels keep the Portuguese accents. No aliases in use yet.

## State
- 38 rows across 7 districts (Aveiro, Évora, Faro, Porto, Setúbal, Açores, Madeira). The other 13 district CSVs are published empty.

## Geography — open gap
- `data/reference/municipalities.json` has no Portuguese catalog, so **35 of the 38 rows are geo-skipped**: the audit reports them as skipped and passes. A green run here does not mean the coordinates were checked.
- The 3 rows that do resolve only do so because their names collide with Spanish municipios (`porto`, `penafiel`) and were disambiguated by hand in `data/reference/municipality-overrides.json`.
- Fix: add a "municipality of Portugal" catalog to `scripts/build-municipality-centroids.js` alongside Spain and Japan, regenerate, and re-run the audit over `data/csv/pt`.

## Sources
- Not established yet. Candidates to evaluate and then record here: DOP/IGP registries, regional producer directories, and the certifying bodies of the wine regions. Until they are, additions rest on the producer's own site and a listing normally supports at most `parcial`.

## Conventions
- `nombre`, `municipio` and `direccion` in Portuguese; `descripcion` in Spanish, like the rest of the catalog.
- Categories are the shared closed list; do not add Portuguese-specific labels.
