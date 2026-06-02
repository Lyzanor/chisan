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

## 2026-06-02 - OPEN: 119 name-reorder duplicate pairs (bad auto-fill)

The same automated pass that produced junk web/coords also created the SAME
producer twice per municipio under both name orders — `Surname, Name` and
`Name Surname` (e.g. `esteve-lloret-francesc-...` ↔ `francesc-esteve-lloret-...`,
`pont-bancell-monica-sagas` ↔ `monica-pont-bancell-sagas`). Detected 119 such
pairs across Barcelona by normalizing nombre tokens within municipio.

Not yet deduped (removing ~119 rows is high-stakes and needs a merge rule).
Proposed approach for a dedicated pass: for each pair, keep one slug, union the
non-empty fields (one twin often has the contact/desc the other lacks), prefer
the canonical `Surname, Name` nombre, and drop the redundant row. Re-run
`verify:ai` and confirm no slug churn breaks detail URLs.

To regenerate the list: normalize `nombre` (lowercase, strip punctuation/accents,
sort tokens) + `municipio`, group, and report groups with >1 slug.

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
