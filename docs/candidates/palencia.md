# Palencia Candidate Notes

Scratch space. Source of truth is `data/csv/castilla-y-leon/palencia.csv`.

## 2026-06-03 — Candidate pass resolved (verified + enriched in CSV)

Pasada previa: las 5 filas ya estaban integradas en el CSV (alta de otra pasada). Reverificadas
por web una a una, enriquecidas y corregidas:

### Integradas / enriquecidas (4)
- **Miel Valdesú** (`miel-valdesu-castrillo-de-onielo`) — Castrillo de Onielo. Añadido Instagram
  (`miel_valdesu`) y Facebook; lat/lon afinada; **`Venta online` sí → no comprobado** (la web solo
  tiene "preguntar disponibilidad", sin checkout real). Logo aplicado.
- **Embutidos Lidia Caminero** (`embutidos-lidia-caminero-carrion-de-los-condes`) — Carrión de los
  Condes. **`Venta online` no comprobado → sí** (la web SÍ tiene tienda con carrito/checkout y envío
  gratis, no estaba "en construcción"). lat/lon afinada. Logo aplicado.
- **Cervezas Bresañ** (`cervezas-bresan-becerril-de-campos`) — Becerril de Campos. Añadido Facebook;
  lat/lon afinada. Sin tienda propia (blog en bresan.es) → `Venta online` no. Sin logo localizable.
- **Oro del Cerrato** (`oro-del-cerrato-astudillo`) — Astudillo. lat/lon afinada; **`Venta online`
  sí → no comprobado** (orodelcerrato.es estaba suspendido al verificar; no se pudo confirmar checkout
  en vivo). Sin redes localizadas; sin logo.

### Fix de duplicado (ya aplicado y confirmado correcto)
- `miel-valdesu-...-santibanez-de-ecla` llevaba por error los datos de **Miel de la Ecla**. Ahora
  son dos filas correctas y distintas: `miel-valdesu-castrillo-de-onielo` (Castrillo de Onielo) y
  `miel-de-la-ecla-...-santibanez-de-ecla` (Santibáñez de Ecla).

### Eliminada — no encaja en Palencia
- **De Tilio Bodega Boutique** — su propia web da dirección en **Peñafiel (Valladolid)**, es vino
  **D.O. Ribera del Duero** y figura en **Alimentos de Valladolid**; la cita del doc a "D.O. Arlanza"
  era errónea (Arlanza es Burgos). No hay evidencia de sede en Santillana de Campos/Palencia, así que
  se retiró del CSV de Palencia (decisión del usuario, 2026-06-03).
