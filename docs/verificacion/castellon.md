# Verificación provincial de Castellón

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/comunitat-valenciana/castellon.csv`. El CSV es la fuente de verdad. La
evidencia estructurada por fila debe vivir en
`data/evidence/comunitat-valenciana/castellon.jsonl` a medida que se revise cada
lote (el fichero aún no existe; se crea en el lote 1).

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento no
lo duplica, solo fija el snapshot, las particularidades de Castellón y el plan de
lotes. Los contratos viven en `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md`
y `docs/EDITORIAL_POLICY.md`.

## Estado

- Inicio: 2026-06-28.
- Snapshot inicial: **161 filas**; 32 `verificado`, 3 `parcial`, 126 `pendiente`.
- Venta online inicial: **84 `sí`, 75 `no`, 2 `no comprobado`**.
- `Canal de venta`: **0/161 filas informado**. Los 84 `sí` deben reauditarse y
  quedar con canal (`ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion` o
  `marketplace`) o corregirse.
- **Anomalía de venta online (clave del plan).** Que solo haya 2 `no comprobado`
  frente a 84 `sí` y 75 `no` delata un relleno automático/heurístico, no una
  revisión real. En esta provincia **se reauditan los `sí` y también los `no`**:
  los `sí` quedan en cuarentena editorial hasta confirmar un pedido remoto
  vigente con canal; los `no` pueden ocultar pedido por contacto directo o estar
  mal puestos por defecto (el valor por defecto del contrato es `no comprobado`).
- Imágenes: 111/161 con `imagen`, 50 sin. Revisar imágenes **después** de
  estabilizar identidad, `slug`, fusiones y purgas.
- Enlaces iniciales: 115/161 con `web`, 79/161 con `Instagram`, 161/161 con
  `Google Maps`, 141/161 con `telefono`, 161/161 con `direccion`.
- Calidad inicial: `node scripts/audit-csv.js --mode=quality --summary-only
  data/csv/comunitat-valenciana/castellon.csv` devuelve 0 errores, 84 warnings y
  14 avisos suprimidos por opcionales ausentes en filas verificadas. Los warnings
  orientan (faltan redes, contacto o descripción), no bloquean.
- Evidencia inicial: no existe `data/evidence/comunitat-valenciana/castellon.jsonl`
  y Castellón **no** está en cobertura estricta (`data/evidence/coverage.json`:
  Álava, Vizcaya, Guipúzcoa, La Rioja, Navarra, Girona y Lleida).
- Tras lote 1 (2026-06-28): 161 filas; 44 `verificado`, 4 `parcial`, 113
  `pendiente`. Venta online: 81 `sí`, 70 `no`, 10 `no comprobado`; 12/81 `sí`
  con `Canal de venta`. Evidencia: 21 registros en
  `data/evidence/comunitat-valenciana/castellon.jsonl` (todos `keep`).
- Tras lote 2 (2026-06-28): 160 filas (1 merge); 55 `verificado`, 4 `parcial`,
  101 `pendiente`. Venta online: 79 `sí`, 61 `no`, 20 `no comprobado`; 20/79
  `sí` con `Canal de venta`. Evidencia: 40 registros (39 `keep`, 1 `merge`).
- Tras lotes 3-5 (2026-06-28): 160 filas; 97 `verificado`, 9 `parcial`, 54
  `pendiente`. Venta online: 76 `sí`, 37 `no`, 47 `no comprobado`; 39/76 `sí`
  con `Canal de venta`. Evidencia: 93 registros. Pendientes restantes:
  Charcutería 11, Fruta y verdura 13, Miel 7, Lácteos y quesos 7, Trufa y setas
  6, Pescado 6, Café 2, Huevos 2.
- Tras lote 6 (2026-06-28): 159 filas (1 purga); 105 `verificado`, 11 `parcial`,
  43 `pendiente`. Venta online: 75 `sí`, 31 `no`, 53 `no comprobado`; 45/75 `sí`
  con `Canal de venta`. Evidencia: 106 registros (104 `keep`, 1 `merge`, 1 `purge`).
  Pendientes restantes: Fruta y verdura 13, Miel 7, Lácteos y quesos 7, Trufa y
  setas 6, Pescado 6, Café 2, Huevos 2.
- Tras lote 7 (2026-06-29): 158 filas (1 purga); 116 `verificado`, 12 `parcial`,
  30 `pendiente`. Venta online: 72 `sí`, 26 `no`, 60 `no comprobado`; 50/72 `sí`
  con `Canal de venta`. Evidencia: 119 registros (116 `keep`, 1 `merge`, 2 `purge`).
  4 filas recategorizadas fuera de «Fruta y verdura» (ver «Lote 7»). Pendientes
  restantes: Miel 7, Lácteos y quesos 7, Trufa y setas 6, Pescado 6, Café 2,
  Huevos 2.
- Tras lote 8 (2026-06-29): 158 filas; 121 `verificado`, 14 `parcial`, 23
  `pendiente`. Venta online: 71 `sí`, 23 `no`, 64 `no comprobado`; 59/71 `sí` con
  canal. Evidencia: 132 registros. Hidromiel La Vikinga recategorizada a
  «Hidromiel»; Miel Las Dehesas: web caducada eliminada.
- Tras lote 9 (2026-06-29): 158 filas; 128 `verificado`, 14 `parcial`, 16
  `pendiente`. Venta online: 71 `sí`, 18 `no`, 69 `no comprobado`; 65/71 `sí` con
  canal. Evidencia: 144 registros.
- Tras lote 10 (2026-06-29): 152 filas (6 purgas); 137 `verificado`, 15 `parcial`,
  **0 `pendiente`**. Venta online: 68 `sí`, 7 `no`, 77 `no comprobado`; **68/68
  `sí` con canal**. Evidencia: 161 registros (152 `keep`, 1 `merge`, 8 `purge`).
  Cerrada la primera pasada profunda; solo resta el lote 11 (cierre transversal).
- Modo: primera pasada profunda en curso. Prioridad: cerrar la calidad de las
  filas heredadas antes de añadir candidatos nuevos.

## Reglas duras para Castellón

1. No dar por buenas las 32 filas `verificado` ni las 3 `parcial` heredadas: se
   reauditan cuando llegue su lote o en el cierre transversal.
2. **Venta online en cuarentena doble.** Ningún `sí` tiene canal: hasta confirmar
   un mecanismo de pedido remoto vigente y utilizable, el `sí` no se da por bueno.
   Los `no` también se comprueban porque la distribución sugiere relleno
   automático; un `no` sin revisar no es prueba de ausencia de venta.
3. **Bilingüismo valencià/castellano.** Nombres y municipios aparecen en ambas
   lenguas (Castelló de la Plana / Castellón, Vinaròs, Les Useres, Vall d'Alba,
   Atzeneta, frente a Villafranca del Cid, Segorbe, Bejís). Al deduplicar y al
   casar entidad, normaliza acentos **y** variante lingüística; no trates dos
   grafías del mismo municipio o marca como entidades distintas.
4. **Geo-homónimos.** `Cabanes` existe en Castellón y en Girona; vigila además
   municipios pequeños del interior. Si un bloque cae lejos de su centroide por
   homónimo, corrige `data/reference/municipios-overrides.json`; no muevas
   productores correctos. Ejecuta `check:csv` para detectar saltos >100 km.
5. **Aceite.** Distinguir almazara/elaborador de olivareros sueltos, cooperativas
   solo comercializadoras y marcas sin molino propio. DOP Aceite de la C.V. y el
   oli millenari del Sénia/Maestrat apoyan existencia, no actividad ni venta.
6. **Bodega y licores.** Confirmar elaborador real (DO Castelló u otra) y canal
   de pedido. Visita, cata, catálogo o tienda física no prueban venta online. Los
   cellers suelen bloquear WebFetch (age-gate, Cloudflare, TLS): antes de cerrar
   en `no`/`no comprobado`, busca tienda en dominio o subdominio de marca aparte.
7. **Fruta y verdura / cítricos.** La Plana es zona citrícola: separa el productor
   o cooperativa elaboradora de la mera comercializadora, exportadora o almacén.
   Para alcachofa, contrastar con la DOP Carxofa de Benicarló; para cítricos, la
   IGP Cítrics Valencians apoya pertenencia, no es la web del productor.
8. **Pan y pastelería.** Distinguir obrador/elaborador (pastissets, flaó,
   casquetes, coca) de despacho, cafetería, franquicia o tienda sin obrador
   propio demostrado.
9. **Charcutería.** Embotits de Morella, cecina y curados: una explotación,
   matadero u obrador entra; una carnicería minorista solo si hay elaboración o
   cría propia demostrada.
10. **Lácteos y quesos.** Quesos del Maestrat (Catí y comarca). Registros y ferias
    apoyan existencia o pertenencia, pero no sustituyen una fuente propia, ficha
    individual fuerte o perfil oficial para `verificado`.
11. **Trufa y setas / pescado.** En trufa, separar truficultor/elaborador de
    feria, restaurante o experiencia (Fira de la Trufa de Morella). En pescado
    (Vinaròs, Benicarló, Peñíscola), separar conservera/elaborador de lonja,
    cofradía, pescadería o distribuidor; `Langostino de Vinaròs` es marca
    colectiva, no un productor.
12. Un sitio HTTP, certificado roto, timeout o bloqueo no prueba baja. Contrastar
    con búsqueda, perfil oficial, Maps, registro o fuente local antes de borrar
    web, venta o fila.
13. No añadir candidatos nuevos durante esta primera pasada salvo decisión
    explícita. Primero cerrar la calidad de las 161 filas heredadas.

## Fuentes de cotejo iniciales

Orientan la búsqueda; no sustituyen la comprobación de una fuente propia o ficha
real cuando la decisión sea `verificado`. Confirma el dominio oficial al citarlo.

- **Castelló Ruta de Sabor** (marca gastronómica de la Diputació de Castelló):
  directorio de productores y elaboradores de la provincia; buen ancla de
  descubrimiento y cotejo.
- **DOP Aceite de la Comunitat Valenciana** (consell regulador): almazaras y
  marcas amparadas.
- **Territori Sénia / Taula del Sénia**: oli millenari del Maestrat i els Ports;
  olivos milenarios y almazaras adheridas.
- **DO Castelló** (vinos): bodegas/cellers inscritos.
- **DOP Carxofa de Benicarló** e **IGP Cítrics Valencians**: hortícolas y
  citrícolas amparados.
- **CAECV** (Comité d'Agricultura Ecològica de la Comunitat Valenciana): buscador
  de operadores ecológicos.
- Comarcas y turismo: Els Ports, Alt/Baix Maestrat, Alt Palància, La Plana, Alt
  Millars; portales gastronómicos y ferias (trufa de Morella, fira del Maestrat).
- Contexto local secundario: ayuntamientos, prensa local reciente, Google Maps y
  redes oficiales; nunca como sustituto único de actividad productora si queda
  duda material.

## Plan de ejecución

Lotes agrupados por sector para reutilizar fuentes (consells reguladors, marca
Ruta de Sabor) y aplicar la regla dura correspondiente. Tamaño 12–21 filas. Los
lotes 1–10 cubren el snapshot de 161 sin solaparse; el 11 es cierre transversal.

1. Lotes 1–2 (Aceite, Bodega): sectores con consell regulador y muchos
   `Venta online=sí` sin canal. Objetivo: crear el primer JSONL y limpiar ventas.
2. Lote 3 (Otros): triaje del cajón heterogéneo; separar productor de no productor.
3. Lotes 4–5 (Pan y pastelería; Cerveza + Licores): obrador vs despacho;
   elaborador vs marca; comprobar canal real.
4. Lotes 6–9 (Charcutería, Fruta y verdura, Miel, Lácteos y quesos): núcleo
   agroalimentario; cítricos/comercializadoras, embotits, quesos del Maestrat.
5. Lote 10 (Trufa y setas + Pescado + Café + Huevos): los sectores pequeños.
6. Lote 11: cierre transversal. Objetivo: 0 pendientes, `Canal de venta` en todos
   los `sí`, evidencia para todas las filas activas y provincia lista para
   cobertura estricta.

## Worklist inicial

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Los lotes parten por categoría
en el orden actual del CSV; **congela los `slug` al iniciar cada lote**. Si un
lote fusiona o purga filas, recalcula los bloques siguientes antes de iniciarlos.
El lote 11 es auditoría transversal y puede revisar filas ya tocadas.

| # | Lote | Filas | Pend. | Parcial | Verif. | VO=sí | Estado | Notas iniciales |
|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | Aceite | 21 | 0 | 2 | 19 | 12 | ✅ | Cerrado 2026-06-28. Detalle en «Lote 1 - Aceite». 0 purgas; 2 parcial (solo directorio). Flip `no`→`sí`: Organia Oleum. 4 demociones `sí`→`no comprobado`. |
| 2 | Bodega | 18 | 0 | 1 | 17 | 8 | ✅ | Cerrado 2026-06-28. Detalle en «Lote 2 - Bodega». 1 merge (Ildum→Bellmunt), 1 parcial (Castillo de la Duquesa), enlace ajeno `banus.eu` corregido. 8 sí (ecommerce); resto `no comprobado` (cellers con web caída/age-gate). |
| 3 | Otros | 19 | 0 | 2 | 17 | 7 | ✅ | Cerrado 2026-06-28. Detalle en «Lote 3 - Otros». 6 aguas (mayoría B2B `no`/`no comprobado`), turrones, mermeladas, snacks. 2 parcial (Cereza Simó, Turrones San Luis). Sin purgas. |
| 4 | Pan y pastelería | 18 | 0 | 0 | 18 | 5 | ✅ | Cerrado 2026-06-28. Detalle en «Lote 4 - Pan y pastelería». Todos obradores reales. Horno Estellés sube de parcial a verificado (venta vía Mercat Central). |
| 5 | Cerveza artesana + Licores | 16 | 0 | 4 | 12 | 7 | ✅ | Cerrado 2026-06-28. Detalle en «Lote 5». Castelló Beer Factory `no`→`sí`; Gin Zeit pedido por email. 4 parcial por duda de actividad. |
| 6 | Charcutería | 12 | 0 | 2 | 10 | 6 | ✅ | Cerrado 2026-06-28. Detalle en «Lote 6 - Charcutería». 1 purga (Carnes Frescas SA, mayorista B2B). 2 parcial (Carn Natural coop; Carnicería Català, sin web propia tras quitar enlaces ajenos de Aldaia). 6 `sí`, todos con canal. |
| 7 | Fruta y verdura | 12 | 0 | 1 | 11 | 5 | ✅ | Cerrado 2026-06-29. Detalle en «Lote 7 - Fruta y verdura». 1 purga (Alcachofa de Benicarló = Consejo Regulador DOP). 1 parcial (Cítricos Natanael Bort). 4 recategorizadas fuera (Papas Maribel→Snacks; Rafinade→Bebidas; Frusema y Coop Benasalense→Frutos secos). 5 `sí`, todas con canal. |
| 8 | Miel | 13 | 0 | 2 | 11 | 9 | ✅ | Cerrado 2026-06-29. Detalle en «Lote 8 - Miel». 2 parcial (Mel Mas de l'Argila; Miel Mayem, duda de provincia). Hidromiel La Vikinga → «Hidromiel». Miel Las Dehesas: web caducada eliminada. 9 `sí`, todos con canal. |
| 9 | Lácteos y quesos | 12 | 0 | 0 | 12 | 6 | ✅ | Cerrado 2026-06-29. Detalle en «Lote 9 - Lácteos y quesos». Todas queserías reales con leche propia. Flips no→sí: Pastor de Morella (tienda + Mercat dels Ports) y Quesería La Abuela. |
| 10 | Trufa y setas + Pescado + Café + Huevos | 11 | 0 | 1 | 10 | 3 | ✅ | Cerrado 2026-06-29. Detalle en «Lote 10». 6 purgas (5 cofradías de pescadores + Tòfona de Vistabella). 1 parcial (Farré Vidal, cultivo en Lleida). Conservas Coarvi = conservera real; Agrotrufa → Castelló; Cafés Balancilla (typo). |
| 11 | Cierre transversal provincial | 152 | 0 | 15 | 137 | 68 | ⬜ | Recalcular hecho tras lote 10. Pendiente: dudas de provincia (Miel Mayem, Farré Vidal), residuales `parcial`/`no comprobado`, duplicados bilingües, geo-homónimos, imágenes residuales y cobertura estricta. |

## Flujo por lote (resumen)

Detalle completo en `docs/VERIFICATION_TECHNIQUES.md`. Por lote:

1. `git status --short` y `npx pnpm list:province castellon` (acota con
   `--categoria` para el lote).
2. Congelar los `slug` del lote en el orden actual del CSV.
3. Priorizar: duplicados/no productores → `pendiente` con fuente propia fácil →
   `Venta online=sí` sin canal → `no` sospechosos → enlaces/municipios dudosos.
4. Investigar hasta evidencia suficiente; no recolectar opcionales que no cambien
   la decisión.
5. Editar quirúrgicamente el CSV (parser, LF, solo los `slug` del lote).
6. Crear/actualizar una línea en
   `data/evidence/comunitat-valenciana/castellon.jsonl` por cada alta de
   evidencia, cambio de `verificacion`, cambio de `Venta online`/canal, purga o
   fusión.
7. Validar al iterar: `npx pnpm check:csv:changed` y `npx pnpm check:evidence:changed`.
8. Cerrar el lote: `npx pnpm verify:data`.
9. Actualizar este ledger: snapshot si cambia, estado del lote, fecha y nota
   corta (verificadas, parciales, purgas/fusiones, residuales).

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo razón explícita documentada para pausar.
- Cada residual `parcial` tiene motivo conocido y evidencia JSONL coherente.
- Cada fila activa tiene evidencia `keep`; cada purga/fusión tiene registro
  `purge`/`merge`.
- Cada `Venta online=sí` tiene `Canal de venta` y evidencia de pedido remoto
  vigente; cada `no`/`no comprobado` revisado tiene razón clara.
- No quedan enlaces ajenos, dominios aparcados, fichas Maps genéricas como prueba
  fuerte ni horarios que remitan a canales inexistentes.
- No quedan duplicados aparentes (incluida variante valencià/castellano) sin
  decisión explícita; sin colisiones geográficas por homónimo sin override.
- Las imágenes se revisan solo tras estabilizar identidad y `slug`; al purgar una
  fila con `imagen`, se elimina el archivo referenciado si no lo usa otra fila.
- `npx pnpm verify:data` pasa antes de cerrar cada lote y antes del cierre
  provincial.
- Cuando las 161 filas iniciales queden cerradas, añadir
  `comunitat-valenciana/castellon` a `data/evidence/coverage.json` en el mismo
  cambio que complete la evidencia provincial.

## Decisiones que deben quedar especialmente anotadas

- Promociones desde registro/feria/DOP a `verificado`: qué fuente propia, perfil
  oficial o ficha individual supera el techo de `parcial`.
- Cualquier productor sin web propia que quede `verificado`: la fuente concreta.
- Almazaras, cooperativas citrícolas y comercializadoras: por qué entran como
  elaborador/productor dentro de alcance o por qué se purgan.
- Obradores vs despachos/cafeterías en pan y pastelería.
- Cambios de `Venta online` heredado (`sí`→`no`/`no comprobado`, o `no`→`sí`).
- Purgas por no productor, cierre, duplicado, otra provincia o entidad sin rastro
  suficiente.
- Overrides de centroide creados para homónimos (p. ej. Cabanes).

## Lote 1 - Aceite

Revisión de las 21 fichas de `Aceite` (2026-06-28). Resultado editorial: 21
filas activas (0 purgas), 19 `verificado`, 2 `parcial`; venta online 12 `sí`
(todas `ecommerce`), 1 `no`, 8 `no comprobado`. Las URL y claims por fila están
en `data/evidence/comunitat-valenciana/castellon.jsonl`.

Decisiones relevantes:

- **Flip `no`→`sí`** confirmado: `aceites-organia-oleum-sant-mateu` (marca Finca
  Varona la Vella, Organia Oleum SL) tiene tienda propia con checkout
  (`varonalavella.com/tienda`). Ejemplo claro del relleno automático erróneo.
- **Demociones `sí`→`no comprobado`** por canal propio no funcional: `oliquina-…`
  (solo formulario), `olis-cuquello-la-jana` (web plantilla; solo reventa de
  terceros), `almazara-sierra-espadan-artana` y `cooperativa-la-divina-pastora-jerica`
  (enlace de tienda sin checkout funcional confirmado).
- **`parcial`** (techo por solo directorio, sin fuente propia verificadora):
  `almazara-baix-maestrat-benicarlo` (baja de `verificado` heredado) y
  `cooperativa-de-vilafames` (posible vínculo con la Oleícola del Penyagolosa).
- **Webs añadidas** (marca oficial): `aceites-mas-del-senor-peniscola`
  (fincamasdelsenor.com), `almazara-vicente-della-traiguera` (olidelmas.com,
  marca Oli del Mas) y `aceites-organia-oleum-sant-mateu` (varonalavella.com).
  Sus sitios propios fallaron en la revisión (ECONNREFUSED / cert / 500), tratados
  como fallo técnico, no como baja.
- **Venta online confirmada (ecommerce propio)**: Bardomus, Segorbe Nostrum,
  Lo Canetà, Coop Viver, Cervol, Coop Sant Pau (Coop Nostra), DePenyagolosa,
  Coop Bejís, Molí la Barona, Oro de Altura, Aceites Peset y Varona la Vella.
- **`no` confirmado**: `cooperativa-de-vall-d-alba` (web catálogo sin carrito).
- Sin duplicados: los tres de Traiguera (Vicente Dellà/Oli del Mas, Cervol, Peset)
  y los dos de Vall d'Alba (Coop, Molí la Barona) son entidades distintas.

Snapshot tras lote 1:

- Filas CSV: 161
- Verificación: 44 verificado, 4 parcial, 113 pendiente
- Venta online: 81 sí, 70 no, 10 no comprobado
- Canal de venta informado: 12/81 productores con `Venta online=sí`
- Evidencia Castellón: 21 registros JSONL

## Lote 2 - Bodega

Revisión de las 19 fichas de `Bodega` (2026-06-28). Resultado editorial: 18
filas activas, 17 `verificado`, 1 `parcial`, 1 merge; venta online 8 `sí` (todas
`ecommerce`), 10 `no comprobado`, 0 `no`. URL y claims por fila en
`data/evidence/comunitat-valenciana/castellon.jsonl`.

Decisiones relevantes:

- **Merge** `ildum-vinarius-cabanes` → `bellmunt-oliver-viticultors-cabanes`:
  misma unidad productiva (titular Víctor Bellmunt, C/ Escultor Maurat 22,
  Cabanes, mismo teléfono). Ildum Vinarius es la marca/razón (Vitivinícola de
  Cabanes SLU). Se borró su imagen.
- **Enlace ajeno corregido**: `bodegas-castillo-de-la-duquesa-benlloch` tenía
  `web=banus.eu`, hoy un portal turístico de Mallorca (dominio reaprovechado).
  Sustituida por `bodegasvaldelomar.es` (dominio del propio correo, sin
  certificado verificable en la revisión). Baja a `parcial`: identidad/municipio
  solo por directorios sectoriales, sin fuente propia operativa.
- **Webs propias añadidas/corregidas**: `la-canetana-bodega-…` (lacanetana.es),
  `bodega-vilafames-…` (bodegavilafames.com) y `mayo-casanova-…-magnanimvs-…`
  (mayogarcia.com → magnanimvs.com, su tienda real).
- **Venta online confirmada (ecommerce propio)**: Alcovi, Bodega Flors (tienda
  en clotas.com), Barón d'Alba, Bellmunt i Oliver, Besalduch Valls & Bellmunt,
  Mas de Rander, Magnànimvs y Vinya Natura.
- **`no comprobado`** (productor real, canal propio no confirmado): cellers con
  web caída, age-gate o solo reventa de terceros (Les Useres, L'Estanquer,
  Barranc dels Cirers, La Canetana, Vizuecos, Castells i Montoliu, Vega Palancia,
  El Mollet, Bodega Vilafamés). Reauditar en el cierre transversal.
- Sin más duplicados: Besalduch Valls & **Bellmunt** (Sant Mateu, desde 1952) es
  distinta de Bellmunt i Oliver (Cabanes), pese al apellido común.

Snapshot tras lote 2:

- Filas CSV: 160
- Verificación: 55 verificado, 4 parcial, 101 pendiente
- Venta online: 79 sí, 61 no, 20 no comprobado
- Canal de venta informado: 20/79 productores con `Venta online=sí`
- Evidencia Castellón: 40 registros JSONL (39 keep, 1 merge)

## Lote 3 - Otros

Revisión de las 19 fichas de `Otros` (2026-06-28): 17 `verificado`, 2 `parcial`,
0 purgas; venta online 7 `sí`, 3 `no`, 9 `no comprobado`.

Decisiones relevantes:

- **Flip `no`→`sí`**: `blasco-de-cati-cati` (turronero artesano desde 1915;
  pedidos por WhatsApp/teléfono → `whatsapp|telefono`).
- **`parcial`**: `cereza-ecologica-enrique-simo-la-jana` (productor confirmado
  solo por prensa) y `turrones-san-luis-cabanes` (web caída + sociedad "en
  liquidación" en registro: duda de actividad).
- **Enlaces ajenos corregidos**: `turrones-barbera-…` tenía web/IG de
  DePenyagolosa (marketplace de la coop, no propios) → borrados. `agua-de-chovar`
  y aguas: web de marca conservada.
- **Webs/datos**: web propia a `la-posteta-figueroles`; municipio `Benlloc`→
  `Benlloch` en `agut-de-benlloch`.
- **Venta online confirmada (ecommerce)**: Agua de Benassal (`ecommerce|
  suscripcion`), Belluga Gourmet, Pobill Ecològics, Artesanos Gil, Croquellanas,
  Papas J. García.
- **Aguas minerales**: envasadoras reales; las grandes B2B (Cortes/Importaco,
  Orotana, Chóvar/Manantiales del Portell) quedan `no`; Bejís y L'Avellà
  `no comprobado`.

Snapshot tras lote 3: 161 filas; 61 verificado, 6 parcial, 94 pendiente; VO 86
sí, 64 no, 11 no comprobado; canal 27/86; evidencia 59.

## Lote 4 - Pan y pastelería

Revisión de las 18 fichas (2026-06-28): 18 `verificado`, 0 `parcial`, 0 purgas;
venta online 5 `sí`, 2 `no`, 11 `no comprobado`.

Decisiones relevantes:

- `horno-estelles` sube de `parcial` a `verificado` (venta + reparto vía la
  plataforma del Mercat Central de Castelló → `marketplace`).
- `forn-carrer-morella-morella`: confirmado obrador premiado en **Sant Mateu**
  (el slug heredado dice "morella"); se añade IG oficial.
- **Venta online (ecommerce)**: Forn Rosa Elvira, Dulces La Cartuja, Aima
  Rosquilletas, Morente Panaderos.
- `la-adelina-harinas-santamaria` (molino B2B) y `forn-garcia` quedan `no`; el
  resto de obradores locales sin e-commerce, `no comprobado`.

Snapshot tras lote 4: 160 filas; 79 verificado, 5 parcial, 76 pendiente; VO 81
sí, 39 no, 40 no comprobado; canal 32/81; evidencia 77.

## Lote 5 - Cerveza artesana + Licores

Revisión de las 16 fichas (2026-06-28): 12 `verificado`, 4 `parcial`, 0 purgas;
venta online 7 `sí`, 1 `no`, 8 `no comprobado`.

Decisiones relevantes:

- **Flip `no`→`sí`**: `castello-beer-factory-…` (tienda propia `/shop`; +web).
- **Canal email**: `gin-zeit-argelita` (botón "Realizar pedido" por correo).
- **Enlace de directorio corregido**: `serrabirra-la-serratella` tenía
  `web=birrapedia.com` (catálogo de cervezas) → borrado.
- **`parcial` por duda de actividad**: `cerveza-la-tipica-…` (¿cerveza de un
  bar?), `cervesa-montmira-…` (rastro de cierre + dominio reaprovechado),
  `cerveza-cullana-…` (en crowdfunding para relanzar), `cervezas-brancal-…`
  (presencia muy débil).
- **Venta online (ecommerce)**: Badúm, Licor Nelet, Carmelitano, Licora, La
  Somniada. Webs/IG añadidos a Isanbeer, Licores Artesanos de Burriana y
  Castelló Beer Factory.
- Coordenadas de `iepa-…` fijadas al centroide de La Mata de Morella (requisito
  de `verificado`).

Snapshot tras lote 5: 160 filas; 97 verificado, 9 parcial, 54 pendiente; VO 76
sí, 37 no, 47 no comprobado; canal 39/76; evidencia 93.

## Lote 6 - Charcutería

Revisión de las 13 fichas de `Charcutería` (2026-06-28): 10 `verificado`, 2
`parcial`, 1 purga; venta online 6 `sí` (todas con canal), 0 `no`, 6
`no comprobado`. URL y claims por fila en
`data/evidence/comunitat-valenciana/castellon.jsonl`.

Decisiones relevantes:

- **Purga (fuera de alcance)**: `carnes-frescas-sa-almassora`. Es un
  **mayorista/distribuidor B2B** de carne fresca de cordero y vacuno (suministro
  a empresas, logística de distribución), no un elaborador ni venta a consumidor
  final. Imagen eliminada.
- **Enlace ajeno corregido**: `carniceria-catala-morella` tenía `web`
  (`carniceriacatala.es`) y `Facebook` (`carniceria.catala`) de **otra Carnicería
  Català en Aldaia, Valencia** (homónimo: razón, teléfono 676838605 y dirección
  distintos). Ambos borrados. La de Morella (obrador propio de embutidos curados,
  cecina y cordero Km0; Marquesa de Fuente el Sol 7, tel 673464526) es real pero
  sin web/redes propias → `parcial`; sin canal remoto propio → `sí`→`no comprobado`.
- **`parcial`** (techo por falta de fuente propia verificadora):
  `carn-natural-morella` (cooperativa que gestiona el matadero de Morella y
  despieza/comercializa carne de Els Ports; sin web, FB oficial; su página en
  Mercat dels Ports da 404) y `carniceria-catala-morella`.
- **Democión `sí`→`no comprobado`**: `carniceria-catala-morella` (el único canal
  era la web ajena de Aldaia).
- **`no`→`no comprobado`** al reauditar: `carn-natural-morella`,
  `carnisseria-rosa-amelia-forcall`, `carns-noel-morella` (tienda online propia
  *fuera de servicio temporalmente*), `carniceria-r-gallego-jerica` (web con
  certificado caducado, catálogo sin checkout) y `carnes-alto-palancia-segorbe`
  (web sin tienda; posible tienda hermana Jamones del Alto Palancia). Ningún `no`
  superviviente en el lote.
- **Rescate de minorista con elaboración propia**: `carnisseria-rosa-amelia-forcall`
  (marca Rossamelia / Forcall Gourmet) no es carnicería pelada: elabora
  **sobrassada trufada** (~100 kg/mes), cecina y embutidos con trufa → entra como
  productor (`verificado`). Añadidos IG `@forcallgourmet` y Facebook; dirección a
  Plaza Mayor 1.
- **Venta online confirmada con canal**: Embutidos Ferreres (`whatsapp|email`),
  Porcellet (`whatsapp|email|telefono`, +correo), La Cabanenca (`whatsapp`;
  dirección corregida a Av. Corts Valencianes 36, +correo), Bolíssim
  (`marketplace` vía Mercat dels Ports, marketplace comprable del colectivo de Els
  Ports), Embutidos San Vicente (`ecommerce`) y Jamones Alfredo Monfort
  (`ecommerce|marketplace`; tienda propia jamonesalfredomonfort.es + Mercat dels
  Ports). San Vicente y Alfredo Monfort reauditados (heredados `verificado`).
- **Categoría**: `Bolíssim` se mantiene en `Charcutería` (elabora Bolo de
  Castelló, güeña y conservas de cerdo, junto a platos preparados).
- Sin duplicados pese a misma calle en Morella: `carns-noel-morella` (Marquesa de
  Fuente el Sol 12) y `carniceria-catala-morella` (nº 7) son entidades distintas
  (nombres, teléfonos y webs propios diferentes).

Snapshot tras lote 6: 159 filas; 105 verificado, 11 parcial, 43 pendiente; VO 75
sí, 31 no, 53 no comprobado; canal 45/75; evidencia 106.

## Lote 7 - Fruta y verdura

Revisión de las 13 fichas de `Fruta y verdura` (2026-06-29): 11 `verificado`, 1
`parcial`, 1 purga; venta online 5 `sí` (todas con canal), 0 `no`, 6
`no comprobado`. URL y claims por fila en
`data/evidence/comunitat-valenciana/castellon.jsonl`.

Decisiones relevantes:

- **Purga (no productor)**: `alcachofa-de-benicarlo-benicarlo`. No es un productor:
  es el **Consejo Regulador de la DOP Alcachofa de Benicarló** (C/ César Cataldo 2;
  el tel 964461674 de la ficha coincide con el del consell). Marca colectiva, fuera
  de alcance. Imagen eliminada.
- **Recategorizaciones** (categoría errónea heredada; fila correcta, recategorizada
  y verificada): `papas-maribel-altura` Fruta y verdura→**Snacks artesanos**
  (patatas fritas artesanas desde 1969); `rafinade-castello-de-la-plana` →
  **Bebidas** (soda gastronómica de fruta para hostelería, no "fruta
  deshidratada"; descripción corregida); `frutos-secos-del-maestrazgo-albocasser`
  y `cooperativa-agricola-benasalense-benassal` → **Frutos secos** (almendra /
  avellana Negreta de Benassal).
- **`parcial`** (solo directorio, sin web propia ni fuente verificadora):
  `citricos-natanael-bort-cabanes` (citricultor de Cabanes; contacto gmail).
- **Venta online confirmada con canal** (productores con cultivo/elaboración
  propia): Naranjas Marisa (`ecommerce`), Naranjas de Castellón / Cítricos Oroplana
  (`ecommerce|whatsapp`), Benihort (`ecommerce`, tienda.benihort.com), Frutos Secos
  del Maestrazgo / Frusema (`ecommerce` vía su marca B2C **ALSANE**) y Finca
  Fulletes (`ecommerce`).
- **`sí`→`no comprobado`** al reauditar: `aguacates-de-la-plana` (tienda sin
  checkout; pedido por contacto no confirmado), `roca-sola-cerezas-ecologicas`
  (envía cajas a casa pero web con TLS roto y cereza fuera de temporada) y
  `rafinade` (B2B hostelería; web 403). **`no`→`no comprobado`**: `papas-maribel`,
  `citricos-natanael-bort`, `nature-tasty` y `cooperativa-agricola-benasalense`
  (mayoristas/B2B sin tienda B2C confirmada). Ningún `no` superviviente.
- **Webs/teléfonos añadidos**: web propia a `nature-tasty` (naturetasty.com);
  teléfono a `aguacates-de-la-plana` y `cooperativa-agricola-benasalense`; correo a
  `papas-maribel`.
- **Nature Tasty** (Nature Tropical Fruits SLU): productor real de aguacate/mango
  con fincas propias + guacamole/aceite, pero perfil mayorista/export/horeca →
  `verificado` con `no comprobado`.

Snapshot tras lote 7: 158 filas; 116 verificado, 12 parcial, 30 pendiente; VO 72
sí, 26 no, 60 no comprobado; canal 50/72; evidencia 119.

## Lote 8 - Miel

Revisión de las 13 fichas de `Miel` (2026-06-29): 11 `verificado`, 2 `parcial`, 0
purgas; venta online 9 `sí` (todas con canal), 0 `no`, 4 `no comprobado`. Una
recategorización (Hidromiel La Vikinga → «Hidromiel»).

Decisiones relevantes:

- **Web caducada eliminada**: `miel-las-dehesas-peniscola` tenía
  `lasdehesasmiel.com`, hoy redirige a expireddomains.com (apex y www). Productor
  real (empresa social de inserción, taller en Peñíscola, IG activo) → `verificado`
  por Instagram; `sí`→`no comprobado` (venta en taller, sin canal remoto vigente).
- **Recategorización**: `hidromiel-la-vikinga` (bodega de hidromiel) Miel →
  **Hidromiel**; +Facebook; `verificado` por redes/directorios.
- **`parcial`**: `mel-mas-de-l-argila-benlloc` (4 generaciones, 600 colmenas, pero
  solo prensa/directorio, sin web/redes; +coordenadas de Benlloc) y
  `miel-mayem` (heredada): tienda online + WhatsApp reales (`sí`,
  `ecommerce|whatsapp`) pero **duda de provincia** (web sitúa instalaciones/envasado
  en L'Alcúdia, Valencia; base en Cabanes sin confirmar) → a resolver en lote 11.
- **Venta online confirmada con canal**: Mos de Bresca, Miel El Molinar, Pepe Miel
  (`ecommerce|whatsapp`), Mieles Amuza (web → mielamuza.com), Casa Miel Hassan,
  Casa Guimerà, Miel Sierra Espadán y Flor d'en Costa (`ecommerce`).
- **`no comprobado`** sin tienda (web catálogo/contacto): Mieles La Alquería
  (+web/IG). Casa Guimerà es productor híbrido (miel propia + quesos/embutidos).

Snapshot tras lote 8: 158 filas; 121 verificado, 14 parcial, 23 pendiente; VO 71
sí, 23 no, 64 no comprobado; canal 59/71; evidencia 132.

## Lote 9 - Lácteos y quesos

Revisión de las 12 fichas de `Lácteos y quesos` (2026-06-29): 12 `verificado`, 0
`parcial`, 0 purgas; venta online 6 `sí` (todas con canal), 0 `no`, 6
`no comprobado`. Todas son queserías reales con leche/ganadería propia.

Decisiones relevantes:

- **Flips `no`/`no comprobado`→`sí`**: `pastor-de-morella` (rescate de ficha
  fina sin web: quesería de Morella con rebaños propios, +web propia +Facebook,
  tienda online + Mercat dels Ports → `ecommerce|marketplace`) y
  `queseria-la-abuela-original` (+web, tienda online → `ecommerce`).
- **Venta online (ecommerce)**: Quesos de Benassal (1939), Quesos Vall de Catí
  (coop, leche propia), Quesería Los Corrales (`ecommerce|whatsapp`) y Lácteos
  Serbogar. Correos añadidos a varias.
- **`sí`/`no`→`no comprobado`** (sin tienda confirmada): Tot de Poble, Formatgeria
  La Planeta (botiga sin checkout), Masía Els Masets (HORECA/visitas), La Caseta
  d'Espadà (+FB) y Sabores del Llosar (+IG). Quesos Almassora (6 World Cheese
  Awards) sin checkout propio.

Snapshot tras lote 9: 158 filas; 128 verificado, 14 parcial, 16 pendiente; VO 71
sí, 18 no, 69 no comprobado; canal 65/71; evidencia 144.

## Lote 10 - Trufa y setas + Pescado + Café + Huevos

Revisión de las 17 fichas (2026-06-29): 10 `verificado`, 1 `parcial`, 6 purgas;
venta online 3 `sí` (todas con canal), 0 `no`, 8 `no comprobado`. Tras este lote la
provincia queda con **0 pendientes** y **todos los `sí` con canal (68/68)**.

Decisiones relevantes:

- **Purgas (no productor)**: las 5 cofradías de pescadores (San Telmo de Benicarló,
  Burriana, San Pedro de Peñíscola, San Pedro de Vinaròs, San Pedro del Grau de
  Castelló) son gremios/lonjas, no productores Km0 → fuera de alcance.
  `tofona-de-vistabella` se purga por no ser un negocio identificable (corresponde
  a las Jornades de la Tòfona/área; teléfono duplicado del de Demetrio Trufa). 2
  imágenes eliminadas (Burriana, Vinaròs).
- **Pescado real**: `conservas-coarvi-vinaros` (conservera artesana de anchoa y
  boquerón) → `verificado`, `no comprobado` (catálogo + contacto, sin carrito).
- **`parcial` por duda de provincia**: `farre-vidal-trufas` (heredada): dirección
  en Vilafranca del Cid pero **cultivo principal en Les Garrigues, Lleida** y web
  caída → `parcial`/`no comprobado`; resolver en lote 11.
- **Correcciones**: `agrotrufa` municipio Borriol → **Castelló de la Plana** (sede
  Av. de l'Alcora) + dirección; `cafes-barancilla` nombre **Cafés Balancilla**
  (typo) + web; +coordenadas (Demetrio Trufa) y web/redes (Granja Boverals,
  Demetrio Trufa, Huevos Sant Pau).
- **Venta online con canal**: Cafés B+o (`ecommerce`), Fruits de la Terra
  (`ecommerce|whatsapp`), Segortrufa (`whatsapp`). Resto de truficultores
  (Demetrio, Quercus) y granjas/tostadores sin tienda B2C → `no comprobado`.

Snapshot tras lote 10: 152 filas; 137 verificado, 15 parcial, 0 pendiente; VO 68
sí, 7 no, 77 no comprobado; canal 68/68; evidencia 161 (152 keep, 1 merge, 8
purge).
