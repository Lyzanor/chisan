# France — country guide

What is true of `data/csv/fr/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = department (101 CSVs), `region` = region (18: 13 metropolitan plus the five overseas
  ones, each a single department). `country.json` declares both names.
- Slugs are ASCII and drop the apostrophe rather than turning it into a separator (`cote-dor`,
  `cotes-darmor`, `val-doise`, `provence-alpes-cote-dazur`); labels keep the French spelling.
  `aliases` catches the Spanish exonyms (`saboya`, `alta-corcega`, `pirineos-atlanticos`) and the
  hyphenated apostrophe a reader is likely to type (`cote-d-or`).
- Corsica is `corse` with its two departments; the two Savoies, the two Rhins and the two Corses are
  distinct areas and not interchangeable.

## State
- 500 rows across 70 departments, all `pendiente`; the other 31 CSVs are published empty.
  Nouvelle-Aquitaine carries 100 of them, then Pays de la Loire 58, Centre-Val de Loire and
  Occitanie 56 each; Brittany and Normandy have a handful, the four overseas departments none.
- Everything is the 2026-08-05 opening from the HVE certified-holding register
  (`data.gouv.fr`, *annuaire des exploitations certifiées Haute Valeur Environnementale*), so the
  catalog leans heavily on wine: 338 of the 500 rows are `Vino`, and every `Legumbres y cereales`
  row is a *grandes cultures* holding that may not sell anything retail.
- The register certifies an environmental standard, not a shop: it says nothing about activity,
  brand or online sales. No producer's own source has been read, so every row is `pendiente` with
  `Venta online = no comprobado`, and a first pass is owed department by department.
- `web` does not come from the register — it was already in the extract, from an unstated source —
  so it is the one column to distrust first. The 2026-08-05 `check:links` snapshot supports it
  overall (361 of 485 URLs resolved, one NXDOMAIN and one parked domain, both cleared), but eleven
  domains are shared by two to four rows, and a shared domain means one of the rows is wrong. That
  list is the cheapest place for a pass to start: `check:links --offline --area <department>`.

## Geography
- Centroids are the 34.969 current communes from Etalab's `geo.api.gouv.fr`, not Wikidata: France
  does not fit in one SPARQL request. See `scripts/build-municipality-centroids.js`.
- A bare commune name is ambiguous in France far more often than elsewhere — 1.482 names are shared
  by two or more communes — so the French catalog **drops** an ambiguous name instead of letting an
  arbitrary commune win it. A row on one of those names is geo-skipped rather than failed, and the
  48 the current rows use are resolved by region under `fr` in
  `data/reference/municipality-overrides.json`. When a new row lands on an ambiguous name, add its
  department's commune there; do not move coordinates that are already right.
- Only France against France: the lookup is scoped per country, so a commune sharing its name with
  a Spanish or Italian town is not a problem to solve here.
- 379 of the 500 rows are geocoded to their street address through the Base Adresse Nationale
  (`api-adresse.data.gouv.fr`); the other 121 carry their commune centroid and are listed by
  `node scripts/build-geo-provenance.mjs`. Do not read those as farm locations.

## Sources
- `data.gouv.fr` — HVE register: existence and certification date, nothing more. A listing there
  supports `parcial` at best, never `verificado`.
- No retail-facing roster established yet. The obvious next ones to try are the *Bienvenue à la
  ferme* and *Marchés des producteurs de pays* networks (chambers of agriculture) and the INAO
  registers for AOC/IGP producers, none of which has been read.
- The extract's own `departamento` and `codigo_postal` are unreliable: 4 rows named a department
  that neither their commune nor their postcode supported, and a further 42 communes were spelled
  in a way no official list carries. Resolution went through commune name + postcode + department
  agreeing, so trust `municipio` over any address fragment in a legacy row.

## Conventions
- `nombre`, `municipio` and `direccion` in French.
- The register writes the raison sociale in capitals with the legal form attached. Rows carry the
  brand instead: the legal form is dropped (`EARL DOMAINE DE CASSAGNOLE` → `Domaine de Cassagnole`,
  `AUBRACS DES FLEURS (GAEC LES)` → `Aubracs des Fleurs`) unless nothing but a surname would be
  left, where it stays (`EARL Ray`). A row still reading as a surname or an acronym is a first-pass
  target, not a finished name.
- `municipio` is the official commune, so a *commune nouvelle* absorbs its old name: a producer at
  Vertus is filed under `Blancs-Coteaux`, one at Aiguebelle under `Val-d'Arc`. The old name belongs
  in `direccion`, never in `municipio`.
- Categories are the shared closed list: a domaine or château is `Vino`, a *fromagerie*
  `Lácteos y quesos`, a *miellerie* `Miel`. `Otros` currently holds the horticulture and equine
  holdings the register listed, which may not be food producers at all.
