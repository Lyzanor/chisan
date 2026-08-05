# Japan — country guide

What is true of `data/csv/jp/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = prefecture (47 CSVs), `region` = region (8). `country.json` declares both names.
- Slugs and labels are romaji; `aliases` catches the Spanish spellings (`kioto`, `tokio`).

## State
- 322 rows across 29 prefectures, 18 still empty files. 183 `verificado`, 139 `parcial`, no `pendiente`; 119 rows sell online. Nagano is the first prefecture whose association roster is covered end to end (76 breweries).
- The `parcial` half is mostly the 2026-08-04 opening, written from association rosters: identity and municipality hold, current activity does not. The `verificado` half was read producer by producer from 2026-08-05 on.
- Every prefecture has a candidate file in `docs/candidates/jp/`, with its own queue and what its association turned out to be. Those files are scratch and get deleted when a pass closes: anything in them that should outlive the pass belongs here, in `docs/EDITORIAL_POLICY.md` or in the row's evidence.

## Geography
- Centroids come from Wikidata's "municipality of Japan", excluding anything with a dissolution date — the Heisei mergers left thousands of dissolved municipalities in Wikidata. Labels are loaded in en and ja, so a romaji or a kanji `municipio` both resolve.
- Homonyms are the main geographic risk here, and **most of them are Japan against Japan**, not against Spain: the same rōmaji names towns in two prefectures 300-950 km apart, which is a blocking error rather than a warning. Resolve the municipality against `data/reference/municipality-overrides.json` **before writing the row**, not after the gate fails; the file is the list, so it is not repeated here. When the key is missing, the kanji key (`大仙市`) usually carries the right centroid and tells you which side you are on.

## Sources
- The prefectural **brewers' association** (酒造組合) is the authoritative roster for sake, and the one that generalizes: it publishes its full membership, and a brewery outside it is rare. Located so far: Nara (`yamato-umazake.com`), Nada in Hyogo (`nadagogo.ne.jp`, 25 members over Kobe and Nishinomiya only — the rest of Hyogo is a separate federation), Niigata (89 breweries). The National Tax Agency's per-prefecture brewery maps (`nta.go.jp`) cross-check them.
- Wine has its own pair: 日本ワイナリー協会 (`winery.or.jp`) nationally and regional clusters such as Hokkaido's (`winecluster.org`). Where both list a winery they often disagree on the municipality, because one gives the head office and the other the winery — prefer where it produces.
- Associations publish membership, not activity or online sales, so a listing supports at most `parcial`.
- **Check the shape of the association before starting a prefecture: it decides the cost, not the size of the prefecture.** Four shapes met so far. Nagano (`nagano-sake.or.jp/breweries/<area>/`) is the cheapest: one page per area listing every member with brand, address, phone **and its own domain**, so ten reads cover ~80 breweries. Yamagata publishes the domain too, but on each member's profile page (`/pages/NN/`), which makes it one lookup per brewery. Fukushima's prefectural portal carries address and phone for all 55 and the domain of none, and Toyama the same, which makes it two. Hiroshima's directory renders with JavaScript and returns nothing in plain HTML, so it is no help at all. A brewery's e-mail domain is often its website even when the roster leaves the URL field empty.
- **Read an association's Japanese pages, not its English ones.** Nagano's `/breweries/<area>/` drops members its `/intro/<area>/` lists, mangles the rōmaji, and prints brands where the Japanese prints the 社名. Two rows came out with the wrong identity before the Japanese roster was read.
- A roster that publishes domains is still a snapshot: in Nagano seven of seventy-six were stale (dead domains, an expired certificate, two 404s, a redirect), and one resolved to an unrelated company over `https` while serving the brewery over `http`. Resolve each domain, both schemes, before copying it into `web`.
- A brand is not always a producer. Nagano's 雲山 belongs to a 1960 co-bottling group of six breweries and only one of them still makes it, yet the roster lists it as the flagship of three. When one brand names several members, find out who brews it before writing `productos estrella`.
- The roster is also the cheapest closure check: a brewery a directory still lists and the association does not is worth a second look before adding it.
- Not yet established for anything outside sake and wine (tea, miso/shoyu, dairy, produce). Trade associations of merchants (茶商 and the like) list wholesalers and retailers, not producers — triage rather than import.

## Conventions
- `nombre`, `municipio` and `direccion` in romaji; `descripcion` in Spanish, like the rest of the catalog.
- Categories are the shared closed list: a sake brewery is `Sake`, a winery `Vino`.
