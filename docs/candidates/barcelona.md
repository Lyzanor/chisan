# Barcelona Candidate / Data-Quality Notes

Raw notes from manual review of `data/csv/catalunya/barcelona.csv`. Not source of
truth until each item is checked again and resolved in the CSV.

## 2026-06-02 - Geo mismatches: municipio vs. address/coords to verify

Two existing rows have a `municipio` that contradicts every other location signal
(address, postal code, phone, coordinates). Left untouched pending human
verification because the producer is an unverifiable personal name and the two
interpretations conflict (sede social/home vs. actual production site).

### `francisco-aguilar-sanchez-saldes`
- `municipio=Saldes` (Berguedà, rural) but `direccion=Carrer de Calàbria, 16,
  08015 Barcelona`, `telefono=+34933251115` (Barcelona 93 landline), coords point
  to Barcelona city (Eixample).
- Open question: is Saldes the real farm (Barcelona address = home/sede social),
  or is this a Barcelona-city vendor mis-tagged as Saldes?
- To resolve: confirm whether there is a real Fruta y verdura producer at this
  address/name; if Saldes is the farm, set coords to the Saldes location; if it
  is a Barcelona vendor, set `municipio=Barcelona`. Geo-check warns ~101 km.

### `claramunt-estruch-javier-sant-esteve-sesrovires`
- `municipio=Sant Esteve Sesrovires` (Barcelona) but `direccion=Urbanització
  Salats, 5, 25123 Torrefarrera` (Lleida), mobile + gmail, coords in Torrefarrera.
- The only Barcelona signal is the `municipio` field; everything else points to
  Torrefarrera (Lleida). Not duplicated in `lleida.csv`.
- To resolve: if it is a Lleida producer, remove from `barcelona.csv` (and add to
  `lleida.csv` if real); if genuinely in Sant Esteve Sesrovires, set coords there.
  Geo-check warns ~110 km.

## 2026-06-02 - RESOLVED: 119 name-reorder duplicate pairs deduped

The bad auto-fill pass created the SAME producer twice per municipio under both
name orders — `Surname, Name` and `Name Surname`. Found 119 such pairs (all
exactly 2 rows) by normalizing nombre tokens within municipio.

Deduped with user authorization: for each pair kept the more complete row
(tie-break: canonical `Surname, Name`), unioned the twin's non-empty fields into
it, dropped the redundant row. 119 rows removed (CSV 3084 -> 2965). verify:ai OK.

Follow-up (image hygiene, warning-only): 2 orphan assets to delete
(`albert-presas-escobet-castellbisbal.webp`, `enric-campillo-robles-capolat.webp`)
and 2 kept rows whose `imagen` points to the dropped twin's filename
(`castan-escolano-juan` -> `juan-castan-escolano-*.webp`,
`cordomi-duatis-berta` -> `berta-cordomi-duatis-*.webp`): rename the files to the
kept slug or repoint `imagen`.

## 2026-06-02 - RESOLVED: more contaminated rows

More geo-flagged rows with the same fingerprint (rural municipio, address in
Barcelona city or a neighbouring town = scraped/home address, not the farm).
Cleaned: coords→municipio centroid + cleared the junk the bad pass inserted,
confirmed by webs pointing to unrelated businesses (a car mechanic for
`germans-freixa-sl-orista`, a podiatrist for `josep-i-ricard-scp-tavernoles`,
a doctor/`montseferrermasague.com` for `monferrer-claramonte-monica-remei-pujalt`,
the town site for `cordomi-duatis-berta-fogars-de-montclus`) and
`Nota de ubicación: Eixample` artifacts:
`monferrer-claramonte-monica-remei-pujalt`, `jordi-fort-perez-calonge-de-segarra`,
`josep-i-ricard-scp-tavernoles`, `germans-freixa-sl-orista`,
`cordomi-duatis-berta-fogars-de-montclus` (cleared dir/desc/web/gmaps);
`masana-nadal-francesc-pujalt`, `explotacions-agricoles-ramaderes-picas-scp-lluca`
(cleared junk gmaps, kept real desc/dir).

The two Sant Boi rows had REAL data (parcagrari.cat directory + genuine
descriptions) — only coordinates were wrong, so coords→Sant Boi and everything
else kept: `cal-marcal-codina-carol-sant-boi-de-llobregat`,
`cal-senyoret-joan-domenech-sant-boi-de-llobregat`.

Still open ("leave & mark"): `francisco-aguilar-sanchez-saldes`,
`claramunt-estruch-javier-sant-esteve-sesrovires` (top of file).

Social-columns junk: RESOLVED — cleared 31 Facebook + 11 Instagram links that
pointed to non-pages (search/top, photo.php, plugins/page.php, share.php, sharer,
WordPresscom) or to the wrong entity (ajuntament*, Turisme*, bisbat de Terrassa,
xarxa de parcs, Westfield La Maquinista mall, the shared Mercat de la Independència
page reassigned to 6 stalls). Kept real multi-branch brand handles (Baluard, Chok,
Serra Xarcuters, Can Rosell) and valid facebook profile.php links.

Still pending: the per-row `web`/gmaps junk on the 8 contaminated rows listed above
(e.g. `cordomi-duatis-berta-fogars-de-montclus` web `fogarsdemontclus.cat`, gmaps
query "Croda") — fix together with their location decision.

## 2026-06-02 - Resolved

### Contaminated location cluster (rural producer geocoded to Barcelona city)
Rows had `web` = name-coincidence/institutional page, `direccion` in a different
municipio, and coords to match (often a Barcelona neighborhood, per a
`Nota de ubicación: Eixample/Les Corts/...` artifact). Cleaned: cleared junk web
+ garbage address + artifact location-notes, set coords to the municipio centroid:
`enric-font-font-lluca`, `pere-quintana-puig-oris`, `masana-nadal-pere-pujalt`,
`masana-canela-jaume-pujalt`, `monica-pont-bancell-sagas`, `emma-mirapeix-janita-saldes`,
`explotaciones-agricola-ganaderas-nua-sant-celoni`,
`marquez-cervera-josep-maria-sant-marti-de-centelles`, `jaume-font-vinas-collsuspina`,
`jaume-juscafresa-sant-boi-de-llobregat`, `lhort-den-josep-barcelona`.
Removed 2 exact contaminated duplicates: `enric-campillo-robles-capolat` (clean twin
`campillo-robles-enric-capolat` kept) and empty `jaume-masana-canela-pujalt`
(twin `masana-canela-jaume-pujalt` kept).

### Junk web (45 rows)
Cleared institutional/portal/name-coincidence web URLs. Left
`calfargasturismerural.cat` (`costa-garet-josep-santa-maria-de-merles`) for manual
review — could be a genuine rural-tourism producer site.

### Out-of-province winery duplicates
- `vinyes-dolivardots-sl-alella` and `vall-de-baldomar-sl-barcelona-horta-guinardo`
  were misfiled duplicates of out-of-province wineries already correct in
  `girona.csv` (`vinyes-d-olivardots-capmany`) and `lleida.csv`
  (`vall-de-baldomar-baldomar-artesa-de-segre`). Removed from `barcelona.csv`.
