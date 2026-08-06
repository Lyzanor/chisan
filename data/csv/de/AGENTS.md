# Germany — country guide

What is true of `data/csv/de/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = Bundesland (16 CSVs), `region` = one of the four cardinal groupings the country uses
  colloquially — Nord, Ost, West and Süd. Germany has no administrative tier above the Land: its
  NUTS-1 units *are* the Länder, so unlike Belgium's regions or the Dutch landsdelen the region level
  here carries no official meaning at all. It exists because the tree has three levels and sixteen
  areas need grouping; `country.json` declares it and nothing depends on it. Mecklenburg-Vorpommern
  is filed under Nord and not Ost, which is the usual reading of a Baltic coast state and not a
  statement about 1990.
- Slugs are ASCII with the umlaut written out (`baden-wuerttemberg`, `thueringen`,
  `sueddeutschland`); labels keep the German spelling. `aliases` catches the unwritten-umlaut forms
  and the English and Spanish exonyms (`bavaria`, `baviera`, `saxony`, `sajonia`, `hesse`,
  `north-rhine-westphalia`, `renania-del-norte-westfalia`).
- No German area slug collides with another country's, so none needed renaming.

## State
- 499 rows across all 16 Länder, every one `pendiente` and `Venta online = no comprobado`. Bayern
  carries 70 and Nordrhein-Westfalen 65; the city states are the thin end — Bremen 5, Hamburg 6,
  Berlin 8 — and no Land is empty.
- **240 of the 499 sit in `Otros`**, the largest editorial hole and the direct consequence of the
  source: a `Hofladen` with no product tag says it sells farm produce and nothing more. The rest are
  94 `Miel`, 42 `Huevos`, 38 `Fruta y verdura`, 30 `Lácteos y quesos`, 18 `Pan y cereal`, 12 `Carne`
  and single figures elsewhere.
- Exactly **one row is a brewery** — `niederrhein-westfaelische-braumanufaktur-hamminkeln`, which
  was sitting in `Otros`. The two rows that carried `categoria=Cerveza` were Hofläden reselling beer
  among twenty other things and are now `Otros`. Read a `categoria` on this catalog as what the shop
  *stocks* until someone checks; the extract could not tell stocking from making.
- Contact is unusually good for an opening: 494 rows carry a `web`, 494 a `telefono`, 469 a `correo`
  and 427 an `horario`; exactly one row has no contact of any kind. Socials are the gap — 39
  Facebook, 12 Instagram. **No image and no evidence file exists yet**; the only candidate notes are
  the beer sweep below.
- Everything is the 2026-08-06 opening from one OpenStreetMap extract, unconfirmed against any
  producer's own source, so a first pass is owed Land by Land. What that pass owes most is the
  producer/reseller question below, then the 239 `Otros`.

## Geography
- Centroids are Wikidata's "municipality of Germany" (Q262166) minus anything with a dissolution
  date — the Gebietsreformen and the post-1990 mergers left thousands of abolished Gemeinden behind.
  11.687 municipalities, 16.802 keys, labels in German only: a German municipality has one official
  name, and the Sorbian, Danish and Frisian exceptions publish the German form too.
- Germany is `dropAmbiguous`, like France and unlike everyone else. It repeats municipality names on
  an industrial scale — 782 names are shared by two or more Gemeinden — and the homonyms are not
  obscure villages: Essen, Hamm, Kleve, Bornheim, Neunkirchen, Naumburg and Schwerin all name two
  places. An arbitrary winner would fail correct rows with a blocking geo error, so those names have
  no entry at all and the rows carrying them skip the check instead.
- **64 of the 499 rows are therefore ungated**, and a green audit run does not mean they were
  checked. Almost all are that ambiguity; a handful are names the catalog spells differently
  (`Hennef (Sieg)` against Wikidata's `Hennef`, `Nienburg/Saale`, `Hassel (Weser)`). The remaining
  435 rows all sit within 15 km of their Gemeinde centroid — not one lands in the warning band.
- Restoring the gate for an ambiguous name means an entry in `data/reference/municipality-overrides.json`
  under `de`. Its second level is the region slug, which here is a cardinal grouping rather than a
  Land, so it separates Essen (NRW, West) from Essen (Oldenburg, Nord) but cannot separate two
  homonyms inside Süddeutschland. Germany has no override yet.
- Three rows were corrected at import rather than skipped: `Berlin-Wartenberg` is an Ortsteil of
  Berlin-Lichtenberg and two `Rapperszell` rows belong to the Gemeinde Walting, Landkreis Eichstätt.
  `municipio` is always the Gemeinde; the Ortsteil belongs in `direccion`.

## Sources
- **farmshops.eu's OpenStreetMap direct-marketer extract** (499 rows): farm shops, `Hofläden`,
  vending huts and `Milchtankstellen` mapped by OSM contributors. It is not a producer registry and
  its shop tags are not producer classes — a `Hofladen` routinely sells its neighbours' produce
  alongside its own, and the tag cannot tell the two apart. That is why every row is `pendiente`
  rather than `parcial`: identity and municipality have evidence, producer activity has none.
  Establishing it, row by row, is the first job of any pass.
- OpenStreetMap data is ODbL 1.0 and requires attribution.
- One row arrived that was not in Germany at all — a shop in 4125 Riehen, Basel-Stadt — and was
  dropped as out of scope. Read the postcode before trusting the Land the extract filed a row under.
- **Beer has its own sweep**: `docs/de/cerveza.md`, with the per-Land queue in
  `docs/candidates/de/*.md`. 1.720 unverified candidates from OpenStreetMap and Wikidata against the
  1.415 Braustätten Destatis counted in 2025 — the farm-shop extract contained no brewery at all, so
  the whole category was missing rather than thin. Any other product family is likely to be missing
  the same way; measure it against an outside census before concluding Germany is short of it.
- No general authoritative German roster is established yet. Two families are
  worth trying first: the organic associations — Bioland, Demeter, Naturland — whose member lists are
  the closest thing here to a certification registry and which dozens of rows already name in their
  own text, and the per-Land direct-marketing directories the chambers of agriculture publish. Verify
  what either actually lists before importing from it; neither has been opened.

## Conventions
- `nombre`, `municipio` and `direccion` in German, as the producer writes them; `direccion` is
  `Straße Nummer, PLZ Ort`. `descripcion` in Spanish, like the rest of the catalog.
- 105 rows carry a `descripcion` translated from the extract's own `description` tag — almost always
  an assortment list. It records what the shop *offers*, which is not yet a claim about what the farm
  *makes*; the ones that were pure marketing copy or repeated verbatim across two rows were dropped
  instead of translated.
- `productos estrella` is empty in all 499. The extract filled it with a German translation of the
  category label — `Honig` for `Miel`, `Obst und Gemüse` for `Fruta y verdura` — which is a category
  echo, not a product, and the contract forbids it. Fill it from a producer's own source, not from
  the row's own `categoria`.
- `horario` keeps the OSM `opening_hours` syntax it arrived in (`Mo-Fr 08:00-18:00; Sa 08:00-13:00`,
  `24/7`, `Mo,Su,Ph off`). It is machine notation rendered as display text; rewriting it is safe
  editorial work, but only against hours the producer still publishes.
- `Google Maps` is empty, as it is in every country but Spain. The extract built the column from each
  row's own `lat`/`lon`, which is a link back to a coordinate the row already carries rather than a
  resolved place profile, so it was cleared.
- `web` is the producer's own site, resolved and read — not a page about it on somebody else's
  portal. One row arrived pointing at a `foodahoo.com` listing and was emptied.
