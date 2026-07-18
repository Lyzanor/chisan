# Madrid · verificación — snapshot de mantenimiento

Primera pasada profunda **cerrada el 2026-06-12** (50 lotes + retrospectiva + auditorías completas
de `Venta online`). El detalle por lote vive en `git log --follow -p -- docs/verificacion/madrid.md`;
la verdad es el CSV. Cerrar la pasada no cierra el catálogo: los recuentos vivos salen de
`npx pnpm list:province madrid` y las afirmaciones dinámicas caducan.

## Estado final de la pasada (2026-06-12)

- Filas: **222** · verificado **218** · parcial **4** · pendiente **0**.
- `Venta online` auditada al 100% en ambas direcciones: todos los `sí` confirmados uno a uno
  (~177), todos los `no` re-auditados dos veces (32), resto `no comprobado` (~13).
- Evidencia y coverage: Madrid no está en `data/evidence/coverage.json` (pasada anterior al
  contrato de evidencia; los registros nuevos se añaden al re-decidir filas).
- Imágenes: 140/222 con asset local en `/productores/madrid/madrid/`.

## Residuales justificados

- 4 `parcial` con techo real de evidencia — no promover sin fuente primaria propia nueva:
  **Lavandas del Alto Jarama** y **La Cabaña Blanca** (constan en mercados 2026, sin presencia
  primaria propia), **Té y Vida** (dominio en mantenimiento), **Melones Velasco** (actividad
  pública reciente sin canal propio verificable).
- `no comprobado` con motivo conocido: **Gigorro** (quesería real, sin fuente actual de pedido
  remoto), **Aceites Oro** (catálogo íntegramente agotado y ficha averiada).

## Reglas locales (no revertir sin nueva evidencia)

- **GMaps de Madrid no cuenta como "el ≥1 enlace" de `verificado`**: 219/222 eran search-queries
  autogeneradas (`maps/search/?api=1&query=…`). El audit las acepta; este ledger no. Exige
  web/IG/FB reales o sustituye por la ficha real de Maps.
- Merges/purgas firmes: **MAD91** fusionada en **Amiga** (dos marcas de Cervecera Madrileña
  Independiente, misma fábrica); **Fábrica Maravillas** eliminada como duplicado; **Vino de
  ARRÉN** purgada (S.L. extinguida 2023); **CIDED** purgada (NIF revocado, canales desaparecidos).
- NO fusionar pese a coincidencias: **Recespaña/Bodega San Andrés** (secciones productivas
  distintas), **Ganados García del Valle/Ganademad** (explotación vs cooperativa),
  **Trilujo/Guinda Oliva** (contiguos, identidades y teléfonos distintos), **Siguín/Ca' di Mat**
  (dirección base compartida, unidades diferenciadas).
- Dominios vetados: la web antigua de **Mademi** es hoy ajena (no re-enlazar); **Semillando** sin
  web enlazada por inyección SEO ajena detectada.
- Coordenadas 100% validadas (geo-check ≤15 km); centroides de Bustarviejo sin resolver se
  aceptaron como fallback honesto.

## Fuentes locales y límites

No hay dataset descargable tipo DAR; cotejo por buscador (si aparece uno en datos.comunidad.madrid,
crear `scripts/match-madrid.mjs` análogo a `match-dar.mjs`):

- **M Producto Certificado** (~505 empresas, `comunidad.madrid/info/productores`): match → `parcial`.
- **CAEM** (eco, `caem.es/operadores/`): huertas/cestas de Rivas, Aranjuez, Sierra Norte.
- **D.O. Vinos de Madrid** (`vinosdemadrid.es`): subzonas Arganda ~28 · San Martín ~18 ·
  Navalcarnero ~5 · El Molar. Bodega que dice DO y no consta → sospecha.
- Menores: Aceitunas de Campo Real, AOVE de Madrid, IGP Carne Sierra de Guadarrama, Anís de Chinchón.
- Mercados de productores (Cámara Agraria, Planetario): confirman venta directa, **no** venta online.

## Mantenimiento (al retomar)

- Recomprobar los `Venta online=sí` (~177, comprobados por última vez 2026-06-12) y los
  `no comprobado`; actividad/cierre de filas antiguas ante cualquier señal.
- Imágenes pendientes: ~82 filas sin asset.
- Pistas no integradas: `docs/candidates/madrid.md` (heladerías pendientes de filtro de obrador propio).
