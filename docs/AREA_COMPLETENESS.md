# Area Completeness

## Goal
Long-term: make every area catalog progressively more useful and reliable, while allowing each area to improve at its own pace.

This is not a required gate for every task. Use it when planning data-expansion work, auditing an area, or deciding which area to improve next.

No area CSV is the reference or target for another. Completeness is measured against shared, fixed editorial criteria, and progress should be evaluated against the previous state of the same area.

```bash
npx pnpm check:csv:completeness
```

The audit prints the fixed targets and one mechanical progress score per area. It lists areas by path rather than ranking them against each other. The score is a planning signal, not a release gate or a substitute for source verification.

## Fixed Planning Targets

| Metric | Target | Meaning |
| --- | ---: | --- |
| `verificacion` | 100% reviewed | Rows reviewed as `parcial` or `verificado`; `pendiente` remains work to do. |
| `Venta online` | 100% reviewed | Every row researched, not every row resolved: `no comprobado` is the honest answer when the channels were checked and nothing proved remote ordering. |
| `Google Maps` | 100% | A usable producer/location link is present. |
| `lat` + `lon` | 100% | Both coordinates are present and pass the geographic checks. |
| `telefono` or `correo` | 90% | At least one direct contact route is present. |
| `web` | 75% | An official or reliable producer page is present. |
| `Facebook` or `Instagram` | 60% | At least one relevant social profile is present. |
| `imagen` | 60% | A reviewed local image asset is present. |
| `horario` | 50% | Useful public hours are present where they exist. |

These percentages are stable editorial planning targets, not claims that every producer has a website, social profile, image, or public opening hours. Empty is preferable to invented or irrelevant data.

## What Good Looks Like
- Every row keeps the required CSV contract valid.
- Every row has an evidence-based `verificacion` value: `pendiente`, `parcial`, or `verificado`.
- New and re-reviewed decisions have structured source/date/claim provenance where it helps; evidence is an optional audit layer, not a maturity bar.
- `Google Maps`, `lat`, and `lon` are present and point to the same producer/location.
- `telefono` or `correo` exists when a reliable public contact route can be found.
- `web` exists only when the domain resolves and belongs to the producer or a reliable official listing.
- `Venta online` is reviewed as `sí` or `no` when the producer site or a concrete known sales channel makes the status clear; keep `no comprobado` otherwise.
- `Facebook`, `Instagram`, and `imagen` are added when reliable and useful, without filling cells for score alone.
- Coverage is fine-grained across municipalities, not just concentrated in provincial capitals or a few well-known towns.
- Row count should grow from verified producers, not filler entries.
- Product descriptions should be specific enough to distinguish producers.

## Planning Signal
Run the completeness audit when you need a planning signal. It highlights obvious gaps, but it does not replace editorial judgment about validity, municipal spread, row quality, and source reliability.

Choose the area from the current editorial plan, then inspect its `Gaps to target` columns to decide the actual work:

- `horario`: schedules are missing or sparse.
- `contacto`: `telefono` and `correo` coverage is weak.
- `web`: official or reliable web links are missing.
- `ventaOnline`: online-sale status still needs review.
- `social`: Facebook or Instagram coverage is weak.
- `maps`: Google Maps links are missing.
- `coords`: coordinates are missing or incomplete.
- `imagen`: local producer images are missing.
- `verificacion`: rows remain `pendiente`.

Compare an area with its own earlier state when assessing progress. Do not choose the next area from score alone: editorial ownership, active candidate research, municipal gaps, and data validity matter more than cross-area ordering.

## Area Improvement Loop
Use this loop for dedicated area work, not as a default requirement for unrelated tasks.

For each selected area:

1. Run:
```bash
npx pnpm check:csv:completeness
node scripts/audit-csv.js --mode=contract data/csv/[country]/[region]/[area].csv
node scripts/audit-csv.js --mode=quality data/csv/[country]/[region]/[area].csv
```

2. Fix blocking contract errors first.
3. For expansion passes, look for candidates from the provincial capital, comarca seats, and smaller municipalities with food tradition; search by category and keep only producers verified through web, Google Maps, social profiles, or reliable institutional listings.
4. Add new verified producers with stable unique `slug`, normalized `categoria`, `Google Maps`, `lat`, `lon`, `verificacion`, `Venta online`, and contact or `web` when available; place them according to the current ordering criterion.
5. Add or update matching structured evidence records for accepted decisions.
6. Fill or correct `Google Maps`, `lat`, and `lon`.
7. Verify `web`, `Facebook`, and `Instagram`; remove links that do not resolve or do not belong to the producer.
8. Fill missing contact fields from official producer pages, public registries, or reliable institutional listings.
9. Add images only as local assets under `public/productores/[country]/[region]/[area]/`.
10. Run:
```bash
npx pnpm verify:data
```

## Notes
- Do not add a database or API layer for this work.
- Row order is editorial; keep `slug` stable so sorting or duplicate cleanup does not change producer URLs.
- Prefer empty cells over invented data.
- If a source cannot be verified, leave the field empty and move on.
