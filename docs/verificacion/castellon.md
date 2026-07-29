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

## Mantenimiento · ola 3 de venta online (2026-07-29)

- Revisadas las **76** filas que seguían en `Venta online=no comprobado`: el
  saldo queda en **73 `sí` · 7 `no` · 70 `no comprobado`**.
- Se confirmaron seis mecanismos actuales: ecommerce de **Licores Artesanos de
  Burriana**, **Mieles La Alquería**, **Cafés Balancilla**, **La Planeta** y
  **Patatas Geysel**, más pedidos por WhatsApp de **Panadería Mónica**.
- La pasada mejoró **50 fichas**, no solo su decisión de venta: 30 descripciones
  de plantilla se sustituyeron por texto específico, 26 horarios dejaron de
  remitir a una web ausente y se corrigieron ocho URLs. Entre estas últimas,
  **Cafés B+o** pasa a su tienda activa `cafesbo-online.com`, **Miel Sierra
  Espadán** a HTTPS y **Molí la Barona** al dominio `.com`; se retiraron tres
  dominios sin DNS.
- Se conservan como `no comprobado` los escaparates sin checkout, tiendas sin
  existencias, servicios temporalmente fuera de servicio, bloqueos técnicos y
  reventa exclusivamente de terceros. Un catálogo o un carrito residual no se
  interpretaron como pedido operativo.
