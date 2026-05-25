# Province Completeness

## Goal
Long-term: bring every province catalog toward the Barcelona level of usefulness, while improving factual validity, municipal coverage, producer detail, and row volume province by province.

This is not a required gate for every task. Use it when planning data-expansion work, auditing a province, or deciding which province to improve next.

Barcelona is not an implicit app default, but it remains the current completeness baseline:

```bash
npx pnpm check:csv:completeness
```

Baseline snapshot:
- Rows: `3051`
- Horario: `46.4%`
- Contacto: `86.3%`
- Web: `58.0%`
- Venta online: `0.0%`
- Social: `52.8%`
- Google Maps: `100.0%`
- Coordinates: `100.0%`
- Imagen: `14.1%`
- Completeness score: `57.2`

## What Good Looks Like
- Every row keeps the required CSV contract valid.
- Every row has an evidence-based `verificacion` value: `pendiente`, `parcial`, or `verificado`.
- `Google Maps`, `lat`, and `lon` are present and point to the same producer/location.
- `telefono` or `correo` exists for at least the Barcelona baseline share of rows.
- `web` exists for at least the Barcelona baseline share of rows, and only when the domain resolves and belongs to the producer or a reliable official listing.
- `Venta online` is reviewed as `sí` or `no` when the producer site or a concrete known sales channel makes the status clear; keep `no comprobado` otherwise.
- `Facebook` or `Instagram` exists for at least the Barcelona baseline share of rows.
- `imagen` reaches at least the Barcelona baseline share where local assets are available.
- Coverage is fine-grained across municipalities, not just concentrated in provincial capitals or a few well-known towns.
- Row count should grow from verified producers, not filler entries.
- Product descriptions should be specific enough to distinguish producers.

## Planning Signal
Run the completeness audit when you need a planning signal. It highlights obvious gaps, but it does not replace editorial judgment about validity, municipal spread, row quality, and source reliability.

The current bottom group by the mechanical score is:

1. `data/csv/cantabria/cantabria.csv`
2. `data/csv/comunitat-valenciana/alicante.csv`
3. `data/csv/pais-vasco/alava.csv`
4. `data/csv/murcia/murcia.csv`
5. `data/csv/castilla-y-leon/salamanca.csv`
6. `data/csv/castilla-y-leon/segovia.csv`
7. `data/csv/castilla-la-mancha/guadalajara.csv`
8. `data/csv/comunitat-valenciana/valencia.csv`
9. `data/csv/extremadura/badajoz.csv`
10. `data/csv/catalunya/barcelona.csv`

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
3. For expansion passes, look for candidates from the provincial capital, comarca seats, and smaller municipalities with food tradition; search by category and keep only producers verified through web, Google Maps, social profiles, or reliable institutional listings.
4. Add new verified producers with stable unique `slug`, normalized `categoria`, `Google Maps`, `lat`, `lon`, `verificacion`, `Venta online`, and contact or `web` when available; place them according to the current ordering criterion.
5. Fill or correct `Google Maps`, `lat`, and `lon`.
6. Verify `web`, `Facebook`, and `Instagram`; remove links that do not resolve or do not belong to the producer.
7. Fill missing contact fields from official producer pages, public registries, or reliable institutional listings.
8. Add images only as local assets under `public/productores/[provincia]/`.
9. Run:
```bash
npx pnpm verify:ai
```

## Notes
- Do not add a database or API layer for this work.
- Row order is editorial; keep `slug` stable so sorting or duplicate cleanup does not change producer URLs.
- Prefer empty cells over invented data.
- If a source cannot be verified, leave the field empty and move on.
