# Japan — country guide

What is true of `data/csv/jp/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = prefecture (47 CSVs), `region` = region (8). `country.json` declares both names.
- Slugs and labels are romaji; `aliases` catches the Spanish spellings (`kioto`, `tokio`).

## State
- 113 rows across 17 prefectures. Kyoto is the only one reviewed row by row; the other 16 opened on 2026-08-04 from association rosters and are `parcial` across the board — identity and municipality hold, current activity and online sales do not. The remaining 30 prefectures are published empty files.
- Nara, Hokkaido and Ibaraki carry the bulk. Hyogo, Niigata, Ishikawa and most of Nagano are researched but still out of the CSV: their associations publish the membership without a domain, and a row with no link is not worth writing.

## Geography
- Centroids come from Wikidata's "municipality of Japan", excluding anything with a dissolution date — the Heisei mergers left thousands of dissolved municipalities in Wikidata. Labels are loaded in en and ja, so a romaji or a kanji `municipio` both resolve.
- Homonyms with Spanish municipios are already resolved in `data/reference/municipality-overrides.json`: `chiba`, `hita`, `aya`, `mino`, `oto`.

## Sources
- The prefectural **brewers' association** (酒造組合) is the authoritative roster for sake, and the one that generalizes: it publishes its full membership, and a brewery outside it is rare. Located so far: Nara (`yamato-umazake.com`), Nada in Hyogo (`nadagogo.ne.jp`, 25 members over Kobe and Nishinomiya only — the rest of Hyogo is a separate federation), Niigata (89 breweries). The National Tax Agency's per-prefecture brewery maps (`nta.go.jp`) cross-check them.
- Wine has its own pair: 日本ワイナリー協会 (`winery.or.jp`) nationally and regional clusters such as Hokkaido's (`winecluster.org`). Where both list a winery they often disagree on the municipality, because one gives the head office and the other the winery — prefer where it produces.
- Associations publish membership, not activity or online sales, so a listing supports at most `parcial`. They also rarely carry websites: expect to find the domain yourself for every row.
- Not yet established for anything outside sake and wine (tea, miso/shoyu, dairy, produce). Trade associations of merchants (茶商 and the like) list wholesalers and retailers, not producers — triage rather than import.

## Conventions
- `nombre`, `municipio` and `direccion` in romaji; `descripcion` in Spanish, like the rest of the catalog.
- Categories are the shared closed list: a sake brewery is `Sake`, a winery `Vino`.
