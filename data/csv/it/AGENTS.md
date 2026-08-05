# Italy — country guide

What is true of `data/csv/it/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = province or metropolitan city (110 CSVs), `region` = region (20). `country.json` declares both names.
- Slugs are ASCII (`forli-cesena`, `l-aquila`, `valle-daosta`); labels keep the Italian spelling. `aliases` catches the Spanish exonyms (`turin`, `milan`, `florencia`, `venecia`, `napoles`, `padua`, `mantua`).
- Sardinia follows the reform in force since 2026-01-01: eight areas, Sassari now a metropolitan city alongside Cagliari, and Gallura Nord-Est Sardegna, Ogliastra, Sulcis Iglesiente and Medio Campidano new. Sud Sardegna no longer exists.

## State
- 442 rows across 25 provinces, all `pendiente`; the other 85 CSVs are published empty. Toscana carries 260 of them, then Marche 80, Umbria 52, Lazio 43, Liguria 4 and Emilia-Romagna 3; fourteen regions have no row at all.
- Everything is the 2026-08-05 opening from an OpenStreetMap POI extract: `nombre`, `municipio` and coordinates come off the map and no other column is filled. No producer's own source has been read, so producer activity is unestablished for every row — hence `pendiente` rather than `parcial`, and hence a first pass is still owed area by area.
- Left out of that extract: the retail shop classes (`shop=supermarket`, `convenience`, `marketplace`) and the nodes named only after a trade (`Panificio`, `Il Forno`), which identify nobody. 58 of the 500 nodes.

## Geography
- Centroids come from Wikidata's "comune of Italy" minus anything with a dissolution date — the 2010s fusioni left hundreds of suppressed comuni behind. Labels are loaded in it and de, so the bilingual South Tyrolean names (Bressanone / Brixen) both resolve. Every row resolves, so the geographic gate is on and a green run means checked.
- Four names collide across countries and are resolved by region in `data/reference/municipality-overrides.json`: `rio` and `cantagallo`, where the comune lost the key to a Spanish municipio, and `tollo` and `santa marina`, where the comune won it from a Spanish pedanía whose row had never been checked at all.

## Sources
- No authoritative roster established yet.
- What the opening did establish is what OSM is worth here: a shop class is not a producer class. `shop=beverages` tags a Montefalco winery and a wine bar alike, and `shop=bakery` covers both a forno that bakes and a counter that resells. Every current row carries that doubt, and resolving it is the first job of any pass.
- `masaf.gov.it` publishes the list of *consorzi di tutela* per DOP/IGP — foods, wines and spirits, updated 2026-04-01. Like Portugal's DGADR catalogue it names the body that holds the roster rather than the producers, so it is where to find the consorzio, not the census.

## Conventions
- `nombre`, `municipio` and `direccion` in Italian; `descripcion` in Spanish, like the rest of the catalog.
- Categories are the shared closed list: a cantina is `Vino`, a frantoio `Aceite`, a birrificio `Cerveza`, a panificio `Pan y cereal`.
