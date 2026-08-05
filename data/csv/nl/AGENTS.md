# Netherlands — country guide

What is true of `data/csv/nl/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = province (12 CSVs), `region` = landsdeel (4). The Netherlands has no administrative
  tier between the state and the province, so the regions are the four NUTS-1 groupings the country
  uses for statistics — Noord, Oost, West and Zuid — which is what `country.json` declares.
- Provinces are labelled in their own official name: `Fryslân`, not Friesland. `aliases` catches the
  Dutch form and the Spanish exonyms (`frisia`, `gueldres`, `holanda-septentrional`, `zelanda`).
- The app indexes areas in one flat namespace across every country, so two provinces cannot share a
  slug. Limburg exists on both sides of the border, Belgium's took the slug first, and the Dutch one
  is therefore `nederlands-limburg` — a slug only: it is labelled `Limburg` and reached as
  `?area=nederlands-limburg`.

## State
- 496 rows across all 12 provinces, all `pendiente` and `Venta online = no comprobado`. Gelderland
  carries 67 and Noord-Brabant 59; Flevoland is the thinnest at 27. No province is empty.
- **237 of the 496 sit in `Otros`**, which is the largest editorial hole. Not because the producers
  are odd, but because the directory tags half its entries `streekproducten` and nothing else: for
  those rows there is no evidence of what the farm actually sells. The rest are 136
  `Lácteos y quesos`, 85 `Fruta y verdura`, 21 `Carne`, 9 `Huevos` and single figures elsewhere.
- **Only 2 rows carry a `web`, and none carries a phone, an email or a social profile.** Contact is
  the second hole and the more mechanical one to close.
- Everything is the 2026-08-05 opening from a single directory. Nothing has been confirmed against a
  producer's own source, so a first pass is owed province by province.

## Geography
- The register is PDOK's Locatieserver over the BAG, `api.pdok.nl/bzk/locatieserver/search/v3_1/free`.
  It decides which gemeente a row belongs to and gives its point. 470 of the 496 rows are geocoded to
  their door; the other 26 are the ones whose street and number the register would not confirm and
  carry the **woonplaats** centroid instead — the village, not the farm. Those 26 are invisible to
  `scripts/build-geo-provenance.mjs`, which only recognises a coordinate sitting on the *gemeente*
  centroid, so the Netherlands contributes no rows to `geo-provenance.json` and its absence there is
  not a claim that every Dutch coordinate is a real address.
- It fuzzy-matches and never says so, so only accept a candidate whose `straatnaam` and `huisnummer`
  are the ones you asked for. Two of its habits look like mismatches and are not: it disambiguates
  repeated locality names in the name itself (`Haren Gn`, `Hengelo (Gld)`, `Bergen (NH)`,
  `Rijswijk (NB)`, `Winterswijk Woold`), and a rural hamlet is often registered under the postal
  town instead (`Eerde` comes back as `Veghel`). It also indexes a house letter in `huisletter`, not
  in `huisnummer`, so `380` and `380B` both satisfy a query for number 380 — ask for the letter.
- Centroids are Wikidata's municipalities of the Netherlands (`Q2039348`), labelled in Dutch and
  Frisian so `Súdwest-Fryslân` and `Tietjerksteradeel` both resolve. Wikidata records no dissolution
  date for most abolished Dutch municipalities, so the catalog holds 1.224 entries where the country
  has some 340 gemeenten: the extras are old municipalities, harmless in themselves — each sits in
  the town it was named after — but they can win a key from a current one.
  `data/reference/municipality-overrides.json` fixes the two that matter: `altena` was won by a
  Frisian label 172 km from gemeente Altena, and `Bergen` names two current gemeenten 155 km apart,
  so `bergen nh` and `bergen l` are pinned by their register spelling.
- Four rows sit in the 15–100 km warning band and all four are correct: Westerveld, Súdwest-Fryslân,
  West Betuwe and Hardenberg are merged gemeenten large enough that a village at the edge is that
  far from the centroid. No row is skipped by the geographic gate.

## Sources
- Boerenroute.nl (496 rows): a directory of farm shops, `versautomaten` and pick-your-own gardens,
  region by region. It is not a producer registry — an entry proves a shop exists at that address,
  not that the farm makes what it sells, and a `boerderijwinkel` routinely resells other people's
  `streekproducten` alongside its own. Treat every row as a sales point until a producer's own source
  says what it produces.
- The extract read is a subset: the Drenthe page alone lists 70 entries against the 30 filed here, so
  the same directory is still the cheapest next pass.
- Two national sources are worth reading after it, and neither has been touched: `erkendstreekproduct.nl`,
  the certification mark run by Streekeigen Producten Nederland, which publishes a map of certified
  businesses, and `landwinkel.nl`, the farm-shop cooperative — around a hundred shops, most of them
  already in Boerenroute but with the producer's own site attached, which is exactly what is missing.
- Nothing has been read on cheese, beer, or anything the country is otherwise known for.

## Conventions
- `nombre` and `direccion` as the producer writes them, in Dutch; `descripcion` in Spanish, like the
  rest of the catalog. The directory's titles are listing headlines rather than brands — 42 of them
  carried a tail describing the business (`… - Kamperen bij de boer`, `… | Vergaderlocatie |
  Melkveebedrijf`) and were trimmed back to the name.
- `municipio` is the gemeente, never the woonplaats: 376 of the 500 rows arrived naming a village.
  Dalen is filed under `Coevorden`, Beilen under `Midden-Drenthe`, Klarenbeek under `Apeldoorn`. The
  village belongs in `direccion`, which is written `street number, 1234 AB Woonplaats`.
- Categories are the shared closed list, decided in this order: a Dutch shop name says its trade out
  loud and wins (`kaasboerderij`, `zuivelboerderij`, `melktap` → `Lácteos y quesos`; `eierautomaat` →
  `Huevos`; `pluktuin`, `aardappelhandel` → `Fruta y verdura`; `imkerij` → `Miel`). Failing that, the
  directory's product tags decide when one family holds most of them. A shop listing three or four
  families with no dominant one is `Otros` — the list has no label for a general farm shop, and
  picking one of its families would be a guess.
- The extract arrived with a Google search URL in `web` for 498 of its 500 rows. A search URL is not
  a producer site: the column was emptied, and the two real domains are the only ones kept.
- Pick-your-own flower gardens were left out — four rows, all real businesses, none of them selling
  food, and every category in the shared list is one.
