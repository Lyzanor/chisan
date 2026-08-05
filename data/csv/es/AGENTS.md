# Spain — country guide

What is true of `data/csv/es/**` only. The shared contract is `AGENTS.md` at the repository root.

## Levels
- `area` = province (50 CSVs), `region` = autonomous community (17). `country.json` declares both names and is what the interface prints.
- Slugs are ASCII and unaccented (`avila`, `caceres`, `leon`); labels keep the accents. One alias in use: `logrono` -> `la-rioja`.

## Sources
- Consejos reguladores of each DO/DOP/IGP, regional artisan-food registries, and regional producer directories: Alimentos de Palencia, Pon Aragón en tu Mesa, Gastroteca and Xarxa Productes de la Terra in Catalonia, CCPAE for organic certification.
- Catalonia has a cross-check tool: `node scripts/match-dar.mjs "<municipio>" [--csv <path>] [--all]` matches a CSV against the DAR venda de proximitat registry by phone, email and surname. It confirms existence and locality, not activity.
- REGA and other livestock-holding registries list explotaciones, not sellable producers. Triage and prune; never import one wholesale.

## Known traps
- DO and certification registries list the legal name *and* the brand, so one producer arrives as two candidates. Deduplicate by address before adding.
- A domain that does not match the producer name is usually the parent group, not a cross-linked website. A real cross-link is a different company, a shared Instagram, or a directory posing as `web`.
- Several provinces were seeded from bulk imports and still carry interpolated rows: contact fields can look plausible and belong to nobody. `web` is the least reliable column, then `telefono`.
- Municipio homonyms between communities are frequent; the resolved ones are under `es` in
  `data/reference/municipality-overrides.json`. The same file is where a pedanía the Wikidata
  catalog does not carry gets a centroid — `pitres` (La Taha), `figarol` (Carcastillo), `asque`
  (Colungo) and `tollo` and `santa marina` are checked that way rather than skipped.

## Spain's own docs
The investigation workflow is shared: `docs/VERIFICATION_TECHNIQUES.md`. What is Spain's alone:
- `docs/es/BACKLOG.md`: the cross-province editorial worklist. Measure it with `check:defects` before reading it.
- `docs/es/DEFECT_REMEDIATION_PLAN.md`: how that backlog is worked down over many sessions — batch execution, province ownership, lane order, exit criteria.
- Per-province verification manuals: `docs/verification/es/[area].md`. Candidate research: `docs/candidates/es/[area].md`.
