# Castellón · verificación — snapshot de mantenimiento

Primera pasada profunda **cerrada el 2026-06-29** (lotes 1-11; commit de cierre `81c7495`). Detalle
por lote en `git log --follow -p -- docs/verificacion/castellon.md`; procedencia por fila en
`data/evidence/comunitat-valenciana/castellon.jsonl`. La verdad es el CSV; cerrar la pasada no
cierra el catálogo y las afirmaciones dinámicas caducan.

## Estado final de la pasada (2026-06-29)

- Filas: **150** (161 iniciales; 1 fusión + 10 purgas) · verificado **137** · parcial **13** ·
  pendiente **0**.
- `Venta online`: **67 `sí` (67/67 con canal) · 7 `no` · 76 `no comprobado`**. El punto de partida
  (84 `sí`/75 `no`/2 nc, 0 canales) delataba relleno heurístico y se reauditó en ambas direcciones.
- Evidencia: 161 registros (150 `keep` + 1 `merge` + 10 `purge`); **en `coverage.json`**.

## Residuales justificados (13 `parcial`)

Techo por solo directorio/registro o duda material: **Almazara Baix Maestrat**, **Coop de
Vilafamés**, **Castillo de la Duquesa**, **Cereza Simó**, **Turrones San Luis**, 4 cerveceras con
duda de actividad, **Carn Natural** (coop), **Carnicería Català** (sin web propia tras limpiar
enlaces ajenos), **Cítricos Natanael Bort**, **Mel Mas de l'Argila**.

## Reglas locales (no revertir sin nueva evidencia)

- Fusión firme: **Ildum Vinarius** → `bellmunt-oliver-viticultors-cabanes`.
- Purgas firmes: **Carnes Frescas SA** (mayorista B2B), **Alcachofa de Benicarló** (era el Consejo
  Regulador de la DOP, no un productor), **5 cofradías de pescadores** (San Telmo de Benicarló…),
  **Tòfona de Vistabella** (negocio no identificable), y por provincia **Miel Mayem** (envasado en
  L'Alcúdia → Valencia) y **Farré Vidal** (trufa de Lleida).
- NO fusionar: **Lo Canetà / Roca Sola** comparten teléfono porque son dos marcas de la misma
  familia (aceite vs cerezas, Canet lo Roig). Coordenadas repetidas (Morella, Albocàsser, Artana,
  Canet lo Roig) son centroides compartidos, no duplicados.
- Recategorizaciones hechas: Papas Maribel→Snacks · Rafinade→Bebidas · Frusema y Coop
  Benasalense→Frutos secos · Hidromiel La Vikinga→Hidromiel.
- **Bilingüismo valencià/castellano**: al deduplicar y casar entidad, normalizar acentos **y**
  variante lingüística (Castelló/Castellón, Vinaròs…); dos grafías ≠ dos entidades.
- Homónimos: `Cabanes` existe en Castellón y Girona (override por comunidad si hace falta).
- «Langostino de Vinaròs» = marca colectiva, no productor. Cofradía/lonja/pescadería ≠ conservera.
- Webs de celler bloquean WebFetch (age-gate/Cloudflare/TLS): buscar tienda en dominio/subdominio
  de marca aparte antes de cerrar venta.

## Fuentes locales y límites

- **Castelló Ruta de Sabor** (Diputació): directorio de descubrimiento y cotejo.
- Consells: DOP Aceite de la C.V., **Territori Sénia** (oli millenari), DO Castelló, DOP Carxofa de
  Benicarló, IGP Cítrics Valencians. Apoyan pertenencia/existencia, no actividad ni venta.
- **CAECV** (operadores ecológicos valencianos).

## Para otros agentes (cross-provincia)

- Valencia: **Miel Mayem** (L'Alcúdia) purgada de aquí; candidata real para `valencia.csv`.
- Lleida: **Farré Vidal / comprartrufa.shop** (Les Garrigues) purgada de aquí; candidata para
  `lleida.csv`.

## Mantenimiento (al retomar)

- Recomprobar los 67 `Venta online=sí` (última comprobación 2026-06-29) y los 76 `no comprobado`
  (los `no` de aguas B2B del lote 3 son estables).
- Vigilar las 4 cerveceras `parcial` por señales de cierre.
- La pasada no añadió candidatos; expansión → `docs/candidates/`.
