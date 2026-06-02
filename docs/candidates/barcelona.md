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

## 2026-06-02 - Contaminated cluster: junk web + wrong address/coords

A group of rows share a systemic pattern: `web` points to an unrelated business
(architect, painter, industrial supplier, street-art map), `direccion` is in a
different municipio than the row's `municipio` (often Barcelona city, Vilafranca,
Igualada, or Lleida), and coords match neither. Looks like a bad auto-fill import.
Do NOT geocode these to the municipio centroid blindly — the municipio itself may
be wrong. Verify each producer (or drop the junk `web`) before fixing coords:

- `marquez-cervera-josep-maria-sant-marti-de-centelles` — dir Cervera (Lleida 25200), web weare93.com
- `enric-font-font-lluca` — dir Barcelona 08028, web streetartcities.com
- `enric-campillo-robles-capolat` — dir Vilafranca 08720, web enricregull.com
- `explotaciones-agricola-ganaderas-nua-sant-celoni` — dir Vilafranca 08720, web tigsa.com
- `monica-pont-bancell-sagas` — dir Barcelona 08029, web lamodel.barcelona
- `emma-mirapeix-janita-saldes` — dir Castellar del Vallès 08211, web emmamirapeix.com (painter)
- `pere-quintana-puig-oris` — dir Igualada 08700, web perepuigarquitecte.com (architect)
- `masana-nadal-pere-pujalt` — dir Barcelona 08038
- `masana-canela-jaume-pujalt` / `jaume-masana-canela-pujalt` — dir Barcelona 08013 (same name, possible dup)
- `jaume-font-vinas-collsuspina` — dir Sant Pere de Ribes 08810, web jaumefont.com

Also `jaume-juscafresa-sant-boi-de-llobregat` (market stall: address says Sant Feliu
de Llobregat, municipio says Sant Boi) and `lhort-den-josep-barcelona` (Parc Agrari
del Baix Llobregat, broad area) need a location decision rather than a centroid.

## 2026-06-02 - Resolved (no action needed)
- `vinyes-dolivardots-sl-alella` and `vall-de-baldomar-sl-barcelona-horta-guinardo`
  were misfiled duplicates of out-of-province wineries already correct in
  `girona.csv` (`vinyes-d-olivardots-capmany`) and `lleida.csv`
  (`vall-de-baldomar-baldomar-artesa-de-segre`). Removed from `barcelona.csv`.
