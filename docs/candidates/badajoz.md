# Badajoz Candidate Notes

Scratch research only. Source of truth is `data/csv/extremadura/badajoz.csv`.

## 2026-06-03 — Candidate pass resolved (integrated into CSV)

All 57 "accepted" candidates from the prior pass were re-verified by web and triaged.
**52 were integrated** into `data/csv/extremadura/badajoz.csv` with full data (dirección,
teléfono, web, redes cuando existen, lat/lon geocodificada, Google Maps, `verificacion=parcial`,
`Venta online`, y logo en `imagen` cuando se localizó el logotipo real de marca).

`Venta online=sí` solo cuando se confirmó tienda/checkout propio en vivo; el resto quedó en
`no comprobado`. Coordenadas vía OpenStreetMap/Nominatim (no había `GOOGLE_MAPS_API_KEY`), con
fallback al centroide del municipio; todas dentro del umbral de 15 km del geo-check.

### Dropped — already present in the CSV (the prior pass mislabeled these as "accepted")
Dedup por dominio web + teléfono (grep con acentos fallaba):
- **Quesería García Risco** (Cabeza del Buey) → ya existe como `queseria-garcia-risco`.
- **Viñaoliva Sociedad Cooperativa** (Almendralejo) → ya existe como `vina-oliva` (mismo dominio/teléfono).
- **Arteserena** (Campanario) → es la empresa que elabora `cremositos-del-zujar` (mismo domicilio,
  teléfono 924852201 y web naturser.com); ya representada.
- **Monasterio de Santa Ana / Clarisas de Badajoz** → ya existe como `clarisas`.
- **Convento de Santa Clara / Clarisas de Llerena** → ya existe como `santa-clara-dulces-artesanos`
  (mismo teléfono 924870167).

### Note
- **Viña Santa Marina** (Mérida, `vina-santa-marina`) comparte la finca de la N-630 PK 634 con la
  fila existente `bodega-valdealto`, pero es empresa/marca/web/teléfono distintos (924027670, no el
  824607001 que figuraba por error en las notas). Se integró como productor propio.

### Rejected (do not re-add)
- Almazara Hermanas Rueda — en Cáceres (Valdefuentes), no Badajoz.
- Cervezas Arcadia (Villafranca de los Barros) — cesó actividad.
- Cervezas Soto (Barcarrota) — cesó actividad.
- Queserías Juan de Dios Tena (Quintana de la Serena) — disuelta.
- Cerveza Belona (Trujillo) y Cerveza Dagala (Acebo) — en Cáceres, no Badajoz.
- Cerveza Marwan (Badajoz) — cesó actividad.
