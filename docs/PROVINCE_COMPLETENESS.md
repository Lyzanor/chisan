# Province Completeness

## Goal
Make every province catalog progressively more useful and reliable, at its own pace. This is a
planning tool for data-expansion work, not a gate for every task: no province is the benchmark for
another, and progress is measured against the same province's earlier state.

```bash
npx pnpm check:csv:completeness
```

The audit prints the fixed targets and one mechanical progress score per province. The score is a
planning signal, not a release gate or a substitute for source verification.

## Fixed planning targets

| Metric | Target | Meaning |
| --- | ---: | --- |
| `verificacion` | 100% | Rows reviewed as `parcial` or `verificado`; `pendiente` remains work to do. |
| `Venta online` | 100% | Status reviewed as `sí` or `no`; keep `no comprobado` until researched. |
| `Google Maps` | 100% | A usable producer/location link is present. |
| `lat` + `lon` | 100% | Both coordinates are present and pass the geographic checks. |
| `telefono` or `correo` | 90% | At least one direct contact route is present. |
| `web` | 75% | An official or reliable producer page is present. |
| `Facebook` or `Instagram` | 60% | At least one relevant social profile is present. |
| `imagen` | 60% | A reviewed local image asset is present. |
| `horario` | 50% | Useful public hours are present where they exist. |

These percentages are stable planning targets, not claims that every producer has a website, social
profile, image, or public hours. Empty is preferable to invented or irrelevant data.

Beyond the percentages, quality means coverage spread across municipalities rather than concentrated
in capitals, row growth from verified producers rather than filler, and descriptions specific enough
to distinguish producers.

## Reading the audit

`Gaps to target` columns map to fields: `horario` (schedules), `contacto` (`telefono`/`correo`),
`web`, `ventaOnline` (status still `no comprobado`), `social` (`Facebook`/`Instagram`), `maps`
(`Google Maps`), `coords` (`lat`/`lon`), `imagen`, `verificacion` (rows still `pendiente`).

Do not choose the next province from score alone: editorial ownership, active candidate research,
municipal gaps, and data validity matter more than cross-province ordering.

## Improvement loop

1. Run the completeness audit plus the per-CSV audits
   (`node scripts/audit-csv.js --mode=contract|quality data/csv/[comunidad]/[provincia].csv`).
2. Fix blocking contract errors first; then work the gaps with the workflow in `AGENTS.md` and
   `docs/VERIFICATION_TECHNIQUES.md`.
3. For expansion, look beyond the provincial capital — comarca seats and smaller municipalities with
   food tradition — and verify every candidate through reliable public sources before adding.
4. Close with `npx pnpm verify:data`.
