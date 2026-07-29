# Madrid · verificación — snapshot de mantenimiento

Primera pasada profunda **cerrada el 2026-06-12** (50 lotes + retrospectiva +
auditorías completas de `Venta online`); mantenimiento de venta **V-01 el
2026-07-29**. El detalle por lote vive en
`git log --follow -p -- docs/verificacion/madrid.md`; la verdad es el CSV.
Cerrar la pasada no cierra el catálogo: los recuentos vivos salen de
`npx pnpm list:province madrid` y las afirmaciones dinámicas caducan.

## Estado final de la pasada (2026-06-12)

- Filas: **231** · verificado **227** · parcial **4** · pendiente **0**.
- `Venta online`: **182 `sí`**, **41 `no`** y **8 `no comprobado`** tras V-01.
- Evidencia y coverage: Madrid no está en `data/evidence/coverage.json` (pasada anterior al
  contrato de evidencia; 14 registros se han añadido al re-decidir filas).
- Imágenes: 148/231 con asset local en `/productores/madrid/madrid/`.

## Residuales justificados

- 4 `parcial` con techo real de evidencia — no promover sin fuente primaria propia nueva:
  **Lavandas del Alto Jarama** y **La Cabaña Blanca** (constan en mercados 2026, sin presencia
  primaria propia), **Té y Vida** (dominio en mantenimiento), **Melones Velasco** (actividad
  pública reciente sin canal propio verificable).
- `no comprobado` tras V-01: **Lavandas de Madrid** y **La Cabaña Blanca**
  (sin canal primario propio que permita revisar pedidos), **Té y Vida**
  (dominio en 503/mantenimiento), **Pedro García** (tienda nueva aún como
  catálogo, sin precios ni alta al carrito), **Mario Sampedro** (reparto por
  teléfono/correo documentado en 2020, pero sin confirmación dinámica actual),
  **Aceites Oro** (única referencia agotada), **Gigorro** (quesería real, sin
  fuente actual de pedido remoto) y **S.A.T. Santa Lucía** (blog propio detenido
  en 2011 y mención actual de venta online sin mecanismo utilizable).

## Mantenimiento V-01 · venta sin resolver

- Se resolvieron **10 de 18**: `sí` para **Fré Lebanese Ice Cream**
  (`marketplace`, tienda propia operativa en Uber Eats); `no` para **El Huerto
  de San Martín**, **Melones José Carlos Velasco**, **Frutos Secos Rincón**,
  **Bodega Vegaluna**, **Cooperativa Santo Cristo**, **Gelato Lab**, **Di Angelo
  Gelateria**, **Helados Calero** y **Dolce Palatino** tras revisar sus canales
  actuales.
- **Bodega Vegaluna** perdió la descripción genérica de importación y **Di
  Angelo** incorpora el correo publicado por su web oficial.
- No se convirtieron en negativas los fallos técnicos, catálogos sin compra,
  tiendas agotadas ni un mecanismo histórico no revalidado.

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

- Recomprobar los `Venta online=sí` (Fré revalidada en V-01; el resto con
  última comprobación general 2026-06-12) y los 8 `no comprobado`;
  actividad/cierre de filas antiguas ante cualquier señal.
- Imágenes pendientes: 83 filas sin asset.
- Pistas no integradas: `docs/candidates/madrid.md` (heladerías pendientes de filtro de obrador propio).
