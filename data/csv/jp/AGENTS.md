# Japan — country guide

What is true of `data/csv/jp/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = prefecture (47 CSVs), `region` = region (8). `country.json` declares both names.
- Slugs and labels are romaji; `aliases` catches the Spanish spellings (`kioto`, `tokio`).

## State
- 246 rows across 29 prefectures, 18 still empty files. 127 `verificado`, 119 `parcial`, no `pendiente`; 86 rows sell online.
- The `parcial` half is mostly the 2026-08-04 opening, written from association rosters: identity and municipality hold, current activity does not. The `verificado` half was read producer by producer from 2026-08-05 on.
- Every prefecture has a candidate file in `docs/candidates/jp/`, with its own queue and what its association turned out to be. Those files are scratch and get deleted when a pass closes: anything in them that should outlive the pass belongs here, in `docs/EDITORIAL_POLICY.md` or in the row's evidence.

## Geography
- Centroids come from Wikidata's "municipality of Japan", excluding anything with a dissolution date — the Heisei mergers left thousands of dissolved municipalities in Wikidata. Labels are loaded in en and ja, so a romaji or a kanji `municipio` both resolve.
- Homonyms are the main geographic risk here, and **most of them are Japan against Japan**, not against Spain: the same rōmaji names towns in two prefectures 300-950 km apart, which is a blocking error rather than a warning. Resolve the municipality against `data/reference/municipality-overrides.json` **before writing the row**, not after the gate fails; the file is the list, so it is not repeated here. When the key is missing, the kanji key (`大仙市`) usually carries the right centroid and tells you which side you are on.

## Sources
- The prefectural **brewers' association** (酒造組合) is the authoritative roster for sake, and the one that generalizes: it publishes its full membership, and a brewery outside it is rare. Located so far: Nara (`yamato-umazake.com`), Nada in Hyogo (`nadagogo.ne.jp`, 25 members over Kobe and Nishinomiya only — the rest of Hyogo is a separate federation), Niigata (89 breweries). The National Tax Agency's per-prefecture brewery maps (`nta.go.jp`) cross-check them.
- Wine has its own pair: 日本ワイナリー協会 (`winery.or.jp`) nationally and regional clusters such as Hokkaido's (`winecluster.org`). Where both list a winery they often disagree on the municipality, because one gives the head office and the other the winery — prefer where it produces.
- Associations publish membership, not activity or online sales, so a listing supports at most `parcial`.
- **Check the shape of the association before starting a prefecture: it decides the cost, not the size of the prefecture.** Three shapes met so far. Yamagata publishes each member's own domain on its profile page (`/pages/NN/`), which makes it one lookup per brewery. Fukushima's prefectural portal carries address and phone for all 55 and the domain of none, and Toyama the same, which makes it two. Hiroshima's directory renders with JavaScript and returns nothing in plain HTML, so it is no help at all. A brewery's e-mail domain is often its website even when the roster leaves the URL field empty.
- Not yet established for anything outside sake and wine (tea, miso/shoyu, dairy, produce). Trade associations of merchants (茶商 and the like) list wholesalers and retailers, not producers — triage rather than import.

## Conventions
- `nombre`, `municipio` and `direccion` in romaji; `descripcion` in Spanish, like the rest of the catalog.
- Categories are the shared closed list: a sake brewery is `Sake`, a winery `Vino`.
