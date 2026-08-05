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
- **45 rows are `parcial`, the other 451 `pendiente`.** The 45 are the Landwinkel co-op members: each
  one's own site was resolved live and carries its name, which settles identity and, with the address
  the co-op publishes, the municipality. `verificado` needs the page read for what the farm actually
  produces, which none of them has had.
- Contact reaches 47 `web` (9,5%), 43 `correo`, 22 `telefono`, 17 Facebook and 10 Instagram — all but
  two of them from that one pass. **449 rows still have no contact of any kind**, and that is the
  second hole after the categories.
- Everything else is the 2026-08-05 opening from a single directory, unconfirmed against any
  producer's own source, so a first pass is still owed province by province.

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
- **Landwinkel**, the farm-shop co-op, publishes its whole membership at `landwinkel.nl/api/stores`:
  105 shops with website, phone, email, socials, street, postcode and a point. That is where the 45
  matched rows come from. Two cautions. Its `geolocation` is not reliable — Arkelandshoeve's is 4,7 km
  from the address it publishes in the same record, and the address is the right one — so match on
  postcode plus house number, never on distance alone. And its `url` is whatever the member gave it:
  one is a page on a regional portal rather than the shop's own site, one is a domain parked for sale,
  one answers only a placeholder, and one has live mail but no web server. Read the page before
  writing the column.
- `www.landwinkel.nl` serves a certificate for another host and every client refuses it; the site is
  perfectly alive at `landwinkel.nl`. A failed fetch is not a dead site.
- **`erkendstreekproduct.nl`** is the other national source and is still owed: the certification mark
  of Streekeigen Producten Nederland, whose map lists 270 businesses and whose `/bedrijf/<slug>/` pages
  carry address, postcode, website, email and phone in a table — the same shape as the co-op's API and
  matchable the same way. It rate-limits hard: six workers were enough to make the whole host stop
  answering. Fetch it slowly and serially.
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
  a producer site: the column was emptied, and the two real domains are the only ones kept. What goes
  in `web` is the producer's own site, resolved to its final URL and read: not a search, not a page
  about it on somebody else's portal, and not a domain that merely answers.
- `Google Maps` is empty here, as it is in every country but Spain. Spain's ~10.900 entries are
  `maps/search/?api=1&query=…` built from the address rather than resolved place links, so filling the
  column for the Netherlands is not a Dutch decision — it is whether that practice should spread.
- Pick-your-own flower gardens were left out — four rows, all real businesses, none of them selling
  food, and every category in the shared list is one.
