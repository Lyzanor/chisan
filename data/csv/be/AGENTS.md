# Belgium — country guide

What is true of `data/csv/be/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = province (11 CSVs), `region` = region (3). Brussels-Capital is a region, not a province,
  so it is the one region holding a single area of the same name — the shape France uses for its
  overseas departments. `country.json` declares both names.
- Each level is labelled in its own official language: Flemish provinces in Dutch
  (`Oost-Vlaanderen`), Walloon ones in French (`Hainaut`, `Liège`), Brussels in French. `aliases`
  catches the Spanish exonyms (`amberes`, `henao`, `lieja`, `valonia`) and the other official
  language (`henegouwen`, `luik`, `namen`, `waals-brabant`), because either is a reasonable guess.
- Slugs are ASCII: `liege`, not `liège`.

## State
- 152 rows across 8 provinces, all `pendiente` and `Venta online = no comprobado`. Hainaut carries
  54 and Antwerpen 41; **Oost-Vlaanderen, Vlaams-Brabant and West-Vlaanderen are published empty**,
  which is the largest hole in the catalog — West-Vlaanderen alone is one of the densest food
  regions in the country.
- The mix is 120 `Cerveza`, 16 `Lácteos y quesos`, 16 `Fruta y verdura`. Nothing else exists yet:
  no chocolate, no bakery, no beef, none of what Belgium is otherwise known for.
- Everything is the 2026-08-05 opening from three registers. None of them is a producer's own
  source, so no row has been confirmed live and a first pass is owed province by province.
- 116 of the 152 rows carry a `web` that came with the extract rather than from the registers, so it
  is the first column to distrust. It has not been resolved even once: run
  `check:links --offline --area <province>` before opening any of them by hand.

## Geography
- Centroids are the 565 current municipalities from Wikidata (`Q493522`, dissolution date filtered
  out), keyed in Dutch, French and German so either official spelling of a bilingual municipality
  resolves. The 2019 and 2025 mergers are already folded in: a producer at Kortessem is filed under
  `Hasselt` and one at Hoeselt under `Bilzen-Hoeselt`, because those municipalities no longer exist.
- Two homonym pairs sit on opposite sides of the language border and are resolved by region in
  `data/reference/municipality-overrides.json`: `Sint-Niklaas` (Oost-Vlaanderen) against
  `Saint-Nicolas` (Liège), 108 km apart and therefore a blocking error if it picks wrong, and
  `Balen` (Antwerpen) against `Baelen` (Liège). Each name is a label of *both* municipalities, so
  the spelling does not disambiguate — only the region does.
- 119 of the 152 rows are geocoded to their door, none of them more than 14 km from its municipal
  centroid; the other 33 carry the centroid itself and are listed by
  `node scripts/build-geo-provenance.mjs`. Do not read those as brewery or farm locations.

## Sources
- Zythos, *Lijst van brouwerijen* (120 rows): the brewers' association roster. Its address is the
  **registered office**, and in Belgium that is routinely not where the beer is made — contract
  brewing is normal, so a listing proves neither a brewhouse at that address nor that the company
  brews at all. Treat the address as a company address until a producer's own source says otherwise.
- Apaq-W: the 2025 *Concours des meilleurs Fromages de chez nous* (12) and `#jecuisinelocal` (4).
  A competition entry proves the producer existed in 2025, nothing about today.
- Wallonie, *Asperges de Wallonie* label (16): publishes locality and postcode but no street, which
  is why every one of those rows sits on a centroid.
- Nothing Flemish beyond the brewery list has been read. The obvious next ones are `Rechtstreeks van
  de Boer` and the `Streekproduct.be` / `Vlaams Centrum voor Agro- en Visserijmarketing` rosters for
  Flanders, and `Made in BW` / the *Accueil Champêtre en Wallonie* network for Wallonia.

## Conventions
- `nombre` and `direccion` as the producer writes them, in Dutch or French depending on where it is.
- `municipio` is the official municipality, never the deelgemeente or the postal locality — 77 of
  the 152 rows arrived naming one of those. Westmalle is filed under `Malle`, Tourpes under
  `Leuze-en-Hainaut`, Marchienne-au-Pont under `Charleroi`. The old name belongs in `direccion`.
- A municipality is written in its own official language, and Brussels in French: the 19 communes
  are `Bruxelles`, `Ixelles`, `Forest`, not `Brussel`, `Elsene`, `Vorst`. It keeps its accents and
  ligatures (`Éghezée`, `Belœil`, `Le Rœulx`) even though the Walloon register strips them; both
  spellings resolve, because `œ` is folded to `oe` before the centroid lookup.
- The three regional address registers decide *which* municipality a row belongs to, and its point:
  `geo.api.vlaanderen.be` for Flanders, `geoservices.wallonie.be/geocodeWS` (ICAR) for Wallonia,
  `geoservices.irisnet.be` (UrbIS) for Brussels. All three fuzzy-match and none of them says so:
  asked for `Rue Albert Dubois 2`, Wallonia answers `Rue du Bois 4` with a confident score, and a
  bare locality is worse — `Thorembais` comes back as Leuze-en-Hainaut, a different province. Check
  that the street and postcode you get back are the ones you asked for.
- Categories are the shared closed list: a `brouwerij` / `brasserie` is `Cerveza`, a `kaasmakerij` /
  `fromagerie` is `Lácteos y quesos`.
