# Province Completeness

## Goal
Long-term: bring every province catalog toward the Barcelona level of usefulness, while improving factual validity, municipal coverage, producer detail, and row volume province by province.

This is not a required gate for every task. Use it when planning data-expansion work, auditing a province, or deciding which province to improve next.

Barcelona is the default catalog and current baseline:

```bash
npx pnpm check:csv:completeness
```

Baseline snapshot:
- Rows: `3051`
- Horario: `46.3%`
- Contacto: `86.2%`
- Web: `58.0%`
- Social: `52.8%`
- Google Maps: `100.0%`
- Coordinates: `100.0%`
- Fecha revision: `10.4%`
- Imagen: `14.1%`
- Completeness score: `58.5`

## What Good Looks Like
- Every row keeps the required CSV contract valid.
- `Google Maps`, `lat`, and `lon` are present and point to the same producer/location.
- `telefono` or `correo` exists for at least the Barcelona baseline share of rows.
- `web` exists for at least the Barcelona baseline share of rows, and only when the domain resolves and belongs to the producer or a reliable official listing.
- `Facebook` or `Instagram` exists for at least the Barcelona baseline share of rows.
- `imagen` reaches at least the Barcelona baseline share where local assets are available.
- `fecha_revision` is updated only for rows actually reviewed or corrected.
- Coverage is fine-grained across municipalities, not just concentrated in provincial capitals or a few well-known towns.
- Row count should grow from verified producers, not filler entries.
- Product descriptions should be specific enough to distinguish producers.

## Planning Signal
Run the completeness audit when you need a planning signal. It highlights obvious gaps, but it does not replace editorial judgment about validity, municipal spread, row quality, and source reliability.

The current bottom group by the mechanical score is:

1. `data/csv/cantabria/cantabria.csv`
2. `data/csv/catalunya/barcelona.csv`
3. `data/csv/pais-vasco/alava.csv`
4. `data/csv/comunitat-valenciana/alicante.csv`
5. `data/csv/murcia/murcia.csv`
6. `data/csv/castilla-y-leon/segovia.csv`
7. `data/csv/castilla-y-leon/salamanca.csv`
8. `data/csv/comunitat-valenciana/valencia.csv`
9. `data/csv/castilla-la-mancha/guadalajara.csv`
10. `data/csv/extremadura/badajoz.csv`

## Province Improvement Loop
Use this loop for dedicated province work, not as a default requirement for unrelated tasks.

For each selected province:

1. Run:
```bash
npx pnpm check:csv:completeness
node scripts/audit-csv.js --mode=contract data/csv/[comunidad]/[provincia].csv
node scripts/audit-csv.js --mode=quality data/csv/[comunidad]/[provincia].csv
```

2. Fix blocking contract errors first.
3. Fill or correct `Google Maps`, `lat`, and `lon`.
4. Verify `web`, `Facebook`, and `Instagram`; remove links that do not resolve or do not belong to the producer.
5. Fill missing contact fields from official producer pages, public registries, or reliable institutional listings.
6. Add images only as local assets under `public/productores/[provincia]/`.
7. Update `fecha_revision` for rows touched in that pass.
8. Run:
```bash
npx pnpm verify:ai
```

## Notes
- Do not add a database or API layer for this work.
- Keep row order stable unless deliberately removing or merging duplicate rows.
- Prefer empty cells over invented data.
- If a source cannot be verified, leave the field empty and move on.
