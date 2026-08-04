# Japan — country guide

What is true of `data/csv/jp/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = prefecture (47 CSVs), `region` = region (8). `country.json` declares both names.
- Slugs and labels are romaji; `aliases` catches the Spanish spellings (`kioto`, `tokio`).

## State
- Only `kansai/kyoto.csv` has rows. The other 46 prefectures are published empty files, ready to receive data.

## Geography
- Centroids come from Wikidata's "municipality of Japan", excluding anything with a dissolution date — the Heisei mergers left thousands of dissolved municipalities in Wikidata. Labels are loaded in en and ja, so a romaji or a kanji `municipio` both resolve.
- Homonyms with Spanish municipios are already resolved in `data/reference/municipality-overrides.json`: `chiba`, `hita`, `aya`, `mino`, `oto`.

## Sources
- Not established yet. Before opening a second prefecture, decide which registries are authoritative here (prefectural food associations, brewers' associations, JA / michi-no-eki directories) and record them in this file. Until then, every addition rests on the producer's own site and a listing normally supports at most `parcial`.

## Conventions
- `nombre`, `municipio` and `direccion` in romaji; `descripcion` in Spanish, like the rest of the catalog.
- Categories are the shared closed list: a sake brewery is `Bodega`.
