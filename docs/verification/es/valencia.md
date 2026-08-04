# Verificación provincial de Valencia

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/comunitat-valenciana/valencia.csv`. El CSV es la fuente de verdad. La
evidencia estructurada por fila debe vivir en
`data/evidence/comunitat-valenciana/valencia.jsonl` a medida que se revise cada
lote (creado en el lote 1).

El procedimiento general es `docs/es/VERIFICATION_TECHNIQUES.md`; este documento no
lo duplica, solo fija el snapshot, las particularidades de Valencia y el plan de
lotes. Los contratos viven en `docs/CSV_CONTRACT.md`,
`docs/EVIDENCE_CONTRACT.md` y `docs/EDITORIAL_POLICY.md`.

## Estado

- Inicio: 2026-06-28.
- Snapshot inicial: **196 filas**; 0 `verificado`, 103 `parcial`, 93
  `pendiente`.
- Venta online inicial: **96 `sí`, 63 `no`, 37 `no comprobado`**.
- `Canal de venta`: **0/196 filas informado**. Los 96 `sí` deben reauditarse y
  quedar con canal (`ecommerce`, `whatsapp`, `email`, `telefono`,
  `suscripcion` o `marketplace`) o corregirse.
- **Anomalía de verificación.** Que no haya ninguna fila `verificado` indica
  que Valencia no ha tenido una pasada profunda completa. Los 103 `parcial`
  heredados no se asumen como cerrados: se reauditan en su lote igual que los
  `pendiente`.
- **Anomalía de venta online.** 96 `sí` sin canal sugieren relleno heredado o
  criterio antiguo. En esta provincia se reauditan `sí`, `no` y `no comprobado`;
  un `sí` sin canal queda en cuarentena editorial hasta confirmar un pedido
  remoto vigente y utilizable.
- Imágenes: 85/196 con `imagen`, 111 sin. Las 85 referencias existentes tienen
  archivo. Revisar imágenes **después** de estabilizar identidad, `slug`,
  fusiones y purgas.
- Enlaces iniciales: 169/196 con `web`, 116/196 con `Instagram`, 71/196 con
  `Facebook`, 196/196 con `Google Maps`, 148/196 con `telefono`, 112/196 con
  `correo`, 196/196 con `direccion`.
- Calidad inicial: `node scripts/audit-csv.js --mode=quality --summary-only
  data/csv/comunitat-valenciana/valencia.csv` devuelve 0 errores, 6 warnings y
  111 avisos suprimidos por opcionales ausentes. Los warnings orientan; no
  bloquean.
- Evidencia inicial: no existe `data/evidence/comunitat-valenciana/valencia.jsonl`
  y Valencia **no** está en cobertura estricta (`data/evidence/coverage.json`).
- Tras lote 1 (2026-06-29): 196 filas; 13 `verificado`, 99 `parcial`, 84
  `pendiente`. Venta online: 94 `sí`, 64 `no`, 38 `no comprobado`; 7/94 `sí`
  con `Canal de venta`. Evidencia: 16 registros en
  `data/evidence/comunitat-valenciana/valencia.jsonl` (todos `keep`).
- Tras lote 2 (2026-06-29): 196 filas; 41 `verificado`, 90 `parcial`, 65
  `pendiente`. Venta online: 93 `sí`, 63 `no`, 40 `no comprobado`; 26/93 `sí`
  con `Canal de venta`. Evidencia: 44 registros JSONL (todos `keep`).
- Tras lotes 3-5 (2026-06-29): 195 filas; 87 `verificado`, 57 `parcial`, 51
  `pendiente`. Venta online: 96 `sí`, 66 `no`, 33 `no comprobado`; 50/96 `sí`
  con `Canal de venta`. Evidencia: 91 registros JSONL (90 `keep`, 1 `purge`).
- Tras lotes 6-10 (2026-06-29): 195 filas; 139 `verificado`, 43 `parcial`, 13
  `pendiente`. Venta online: 100 `sí`, 60 `no`, 35 `no comprobado`; 92/100
  `sí` con `Canal de venta`. Evidencia: 171 registros JSONL (170 `keep`, 1
  `purge`).
- Tras lotes 11-12 (2026-06-29): 194 filas; 151 `verificado`, 43 `parcial`, 0
  `pendiente`. Venta online: 101 `sí`, 61 `no`, 32 `no comprobado`; 101/101
  `sí` con `Canal de venta`. Evidencia: 196 registros JSONL (194 `keep`, 2
  `purge`).
- Tras lote 13/cierre transversal (2026-06-29): 194 filas; 151 `verificado`,
  43 `parcial`, 0 `pendiente`. Venta online: 101 `sí`, 61 `no`, 32
  `no comprobado`; 101/101 `sí` con `Canal de venta`. Evidencia completa:
  196 registros JSONL (194 `keep`, 2 `purge`) y Valencia añadida a
  `data/evidence/coverage.json`.
- Modo: primera pasada profunda. Prioridad: cerrar la calidad de las 196 filas
  heredadas antes de añadir candidatos nuevos.

## Reglas duras para Valencia

1. No dar por buenos los 103 `parcial` heredados. En ausencia de evidencia
   JSONL, todos los `parcial` vuelven a pasar por identidad, actividad
   productora, municipio, enlaces y venta online.
2. **Venta online en cuarentena.** Ningún `sí` tiene canal. Hasta confirmar
   tienda propia, canal directo de pedido o tienda oficial colectiva, el `sí` no
   se da por bueno. La reventa independiente no basta.
3. **Bilingüismo valenciano/castellano.** Normaliza variantes y acentos al
   deduplicar: València/Valencia, Alboraia/Alboraya, Almàssera/Almácera,
   Xàtiva/Játiva, Moixent/Mogente, La Font de la Figuera/Fuente la Higuera,
   Llíria/Liria. No generes duplicados por grafía.
4. **Homónimos y frontera provincial.** `Villanueva de Castellón` pertenece a
   Valencia y no a la provincia de Castellón. Vigila también pedanías como San
   Antonio de Requena, Los Pedrones, Los Isidros o La Portera: si el municipio
   usado por el CSV no coincide con la fuente, decide explícitamente si se
   conserva la pedanía o se normaliza al municipio administrativo.
5. **Bodega.** Es el mayor bloque (46 filas) y concentra 30 `sí` sin canal.
   Revisa DO Utiel-Requena, DO Valencia y bodegas de Fontanars dels Alforins,
   Requena, Utiel, Sinarcas, Venta del Moro y Moixent. Las webs de vino pueden
   fallar por age-gate, Cloudflare o TLS: busca tiendas en dominio/subdominio
   de marca antes de cerrar en `no` o `no comprobado`.
6. **Arroz, xufa y horchata.** Separar productor/elaborador de restaurante,
   horchatería puramente hostelera o marca comercial sin unidad productiva
   demostrada. La DOP Arroz de Valencia y la DOP Chufa de Valencia apoyan
   pertenencia, pero no sustituyen una fuente propia para `verificado`.
7. **Cítricos, fruta y zumos.** Distinguir agricultor/cooperativa/productor con
   venta directa de comercializadora, almacén, exportador o ecommerce de reventa.
   IGP Cítricos Valencianos y Kaki Ribera del Xúquer ayudan como cotejo, no como
   prueba automática de venta o actividad actual.
8. **Aceite y cooperativas.** Confirmar si la cooperativa es almazara,
   elaborador o mera comercializadora. DOP Aceite de la Comunitat Valenciana
   apoya existencia, pero la actividad y el canal se confirman por fuente propia
   o ficha individual fuerte.
9. **Pan, pastelería, turrón y peladillas.** Entran obradores y elaboradores
   propios; no entran despachos, cafeterías, franquicias o tiendas sin obrador
   demostrable. Casinos y Xàtiva requieren especial atención por producto local
   tradicional y posibles tiendas familiares.
10. **Charcutería.** Requena, Bocairent, Ademuz y Ontinyent mezclan carnicería,
    obrador y marca. Una carnicería minorista solo entra si hay elaboración,
    curación o producción propia demostrada.
11. **Miel.** Ayora es núcleo apícola, pero ferias, cooperativas y directorios
    apoyan existencia; la venta online y la actividad actual requieren fuente
    vigente del productor o canal oficial.
12. **Lácteos y quesos.** Separar granja/quesería/obrador de distribución o
    retail. Si solo hay registro/directorio, el techo normal es `parcial`.
13. **Cerveza, licores, café y chocolate.** Confirmar que hay elaboración
    propia (microcervecera, destilería, tostador u obrador) y no solo bar,
    tienda, marca blanca o distribuidor.
14. Un sitio HTTP, certificado roto, timeout o bloqueo no prueba baja. Contrasta
    con búsqueda, perfil oficial, Maps, registro o fuente local antes de borrar
    web, venta o fila.
15. No añadir candidatos nuevos durante esta primera pasada salvo decisión
    explícita. Primero cerrar la calidad de las 196 filas heredadas.

## Fuentes de cotejo iniciales

Orientan la búsqueda; no sustituyen la comprobación de una fuente propia o ficha
real cuando la decisión sea `verificado`. Confirma el dominio oficial al citarlo.

- **Figura de Calidad Comunitat Valenciana / Agricultura GVA**: marcas de
  calidad, registros y contexto de productos amparados.
- **DO Utiel-Requena, DO Valencia y DO Cava**: bodegas, cellers y cooperativas.
- **DOP Arroz de Valencia**: arroceras, molinos y productores vinculados a la
  Albufera.
- **DOP Chufa de Valencia**: productores y elaboradores de xufa/horchata.
- **DOP Aceite de la Comunitat Valenciana**: almazaras y marcas amparadas.
- **IGP Cítricos Valencianos** y **Kaki Ribera del Xúquer**: cotejo para fruta,
  cooperativas y comercializadores.
- **CAECV** (Comité d'Agricultura Ecològica de la Comunitat Valenciana):
  operadores ecológicos; útil para existencia y municipio, no para venta.
- Contexto local secundario: ayuntamientos, comarcas, prensa local reciente,
  Google Maps y redes oficiales; nunca como sustituto único de actividad
  productora si queda duda material.

## Plan de ejecución

Lotes agrupados por sector y riesgo editorial para reutilizar fuentes y cerrar
decisiones comparables juntas. Los lotes 1-12 cubren el snapshot de 196 filas
sin solaparse; el 13 es cierre transversal.

1. Lotes 1-3: sectores regulados o con mayor concentración de `Venta online=sí`
   sin canal (aceite, aromáticas y bodega). Objetivo: crear el primer JSONL y
   fijar el criterio práctico de venta en Valencia.
2. Lote 4: arroz, xufa, horchata y Albufera. Objetivo: separar productor,
   obrador y hostelería.
3. Lotes 5-7: obradores, cervezas y licores. Objetivo: resolver productor vs
   tienda/bar/despacho y auditar canales directos.
4. Lotes 8-11: núcleo agroalimentario rural (miel, trufa, fruta, frutos secos,
   zumos, lácteos, huevos, charcutería y pescado).
5. Lote 12: café, chocolate y otros heterogéneos que no encajan en los bloques
   anteriores.
6. Lote 13: cierre transversal. Objetivo: 0 `pendiente`, canales en todos los
   `sí`, evidencia coherente para todas las filas activas y provincia lista para
   cobertura estricta si se decide activarla.

## Worklist inicial

Leyenda de estado: `pendiente`, `en curso`, `hecho`. Los lotes parten del CSV
actual; **congela los `slug` al iniciar cada lote**. Si un lote fusiona o purga
filas, recalcula los bloques siguientes antes de iniciarlos. El lote 13 es
auditoría transversal y puede revisar filas ya tocadas.

| # | Lote | Filas | Pend. | Parcial | Verif. | VO=sí | Estado | Notas iniciales |
|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | Aceite + aromáticas | 16 | 0 | 3 | 13 | 7 | hecho | Cerrado 2026-06-29. Detalle en «Lote 1 - Aceite + aromáticas». 0 purgas; 3 parcial; 7 `sí`, todos con canal `ecommerce`. |
| 2 | Bodega I - Utiel-Requena/Cabriel | 28 | 0 | 0 | 28 | 19 | hecho | Cerrado 2026-06-29. Detalle en «Lote 2 - Bodega I - Utiel-Requena/Cabriel». 0 purgas; 19 `sí`, todos con canal `ecommerce`; 7 `no`; 2 `no comprobado`. |
| 3 | Bodega II - Fontanars/Moixent/interior DO Valencia | 18 | 0 | 0 | 18 | 10 | hecho | Cerrado 2026-06-29. 0 purgas; 10 `sí`, 4 `no`, 4 `no comprobado`. Corregidos Corazón del Mediterráneo, Polo Monleón, 2L, Sivaris/Alforins-style canales. |
| 4 | Arroz + xufa/horchata/Albufera | 18 | 0 | 0 | 18 | 9 | hecho | Cerrado 2026-06-29. 0 purgas; 9 `sí`, 8 `no`, 1 `no comprobado`. Dominios corregidos para Tartana y Sivaris; Dacsa/Santo Tomás pasan a ecommerce. |
| 5 | Pan y pastelería I - Valencia/Horta/Casinos | 10 | 0 | 0 | 10 | 5 | hecho | Cerrado 2026-06-29. 1 purga (`turrones-ramos-valencia`), 5 `sí`, 3 `no`, 2 `no comprobado`. Webs aparcadas/404 eliminadas. |
| 6 | Pan y pastelería II - comarcas | 12 | 0 | 6 | 6 | 4 | hecho | Cerrado 2026-06-29. 0 purgas; 4 `sí` con canal; 7 `no`; 1 `no comprobado`. |
| 7 | Cerveza artesana + licores | 22 | 0 | 6 | 16 | 12 | hecho | Cerrado 2026-06-29. 0 purgas; 12 `sí` con canal; 3 `no`; 7 `no comprobado`. Fernández Pons pasa a `Bodega`. |
| 8 | Miel + trufa | 14 | 0 | 2 | 12 | 11 | hecho | Cerrado 2026-06-29. 0 purgas; Javalturia se conserva como marca comercializadora de trufa; 11 `sí` con canal. |
| 9 | Fruta, zumos y frutos secos | 21 | 0 | 8 | 13 | 12 | hecho | Cerrado 2026-06-29. 0 purgas; 12 `sí` con canal; La Imperfecta queda `parcial` por falta de coordenadas. |
| 10 | Lácteos y quesos + huevos | 11 | 0 | 6 | 5 | 3 | hecho | Cerrado 2026-06-29. 0 purgas; 3 `sí` con canal; 3 `no`; 5 `no comprobado`. |
| 11 | Charcutería + pescado | 16 | 0 | 11 | 5 | 2 | hecho | Cerrado 2026-06-29. 0 purgas; 2 `sí` con canal; 13 `no`; 1 `no comprobado`. |
| 12 | Café, chocolate + otros restantes | 8 | 0 | 1 | 7 | 7 | hecho | Cerrado 2026-06-29. 1 purga (`cafes-valiente-valencia`); 7 `sí` con canal; 1 `no comprobado`. |
| 13 | Cierre transversal provincial | 194 | 0 | 43 | 151 | 101 | hecho | Cerrado 2026-06-29. 0 pendientes; 101/101 `sí` con canal; evidencia completa; Valencia añadida a cobertura estricta. |

## Flujo por lote

Detalle completo en `docs/es/VERIFICATION_TECHNIQUES.md`. Por lote:

1. `git status --short` y `npx pnpm list:province valencia` (acota con
   `--categoria` cuando el lote sea de una categoría concreta).
2. Congelar los `slug` del lote en el orden actual del CSV.
3. Priorizar: duplicados/no productores/fuera de provincia -> `pendiente` con
   fuente propia fácil -> `Venta online=sí` sin canal -> `no` sospechosos ->
   enlaces/municipios dudosos.
4. Investigar hasta evidencia suficiente; no recolectar opcionales que no
   cambien la decisión.
5. Editar quirúrgicamente el CSV con parser, LF y solo los `slug` del lote.
6. Crear/actualizar una línea en
   `data/evidence/comunitat-valenciana/valencia.jsonl` por cada alta de
   evidencia, cambio de `verificacion`, cambio de `Venta online`/canal, purga o
   fusión.
7. Validar al iterar:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence:changed
   ```

8. Cerrar el lote con `npx pnpm verify:data`.
9. Actualizar este ledger: snapshot si cambia, estado del lote, fecha y nota
   corta (verificadas, parciales, purgas/fusiones, residuales).

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo razón explícita documentada para pausar.
- Cada residual `parcial` tiene motivo conocido y evidencia JSONL coherente.
- Cada fila activa revisada tiene evidencia `keep`; cada purga/fusión tiene
  registro `purge`/`merge`.
- Cada `Venta online=sí` tiene `Canal de venta` y evidencia de pedido remoto
  vigente; cada `no`/`no comprobado` revisado tiene razón clara.
- No quedan enlaces ajenos, dominios aparcados, fichas Maps genéricas como
  prueba fuerte ni horarios que remitan a canales inexistentes.
- No quedan duplicados aparentes (incluida variante valenciano/castellano) sin
  decisión explícita.
- Las pedanías y municipios quedan normalizados o documentados; si aparece un
  problema de centroide por homónimo, se corrige con override y no moviendo
  productores correctos.
- Las imágenes se revisan solo tras estabilizar identidad y `slug`; al purgar
  una fila con `imagen`, se elimina el archivo referenciado si no lo usa otra
  fila.
- `npx pnpm verify:data` pasa antes de cerrar cada lote y antes del cierre
  provincial.
- Cuando las 196 filas iniciales queden cerradas, decidir si añadir
  `comunitat-valenciana/valencia` a `data/evidence/coverage.json` en el mismo
  cambio que complete la evidencia provincial.

## Decisiones que deben quedar especialmente anotadas

- Promociones desde `parcial` a `verificado`: qué fuente propia, perfil oficial
  o ficha individual supera el techo de directorio/registro.
- Cualquier productor sin web propia que quede `verificado`: fuente concreta y
  claims cubiertos.
- Cambios de `Venta online` heredado (`sí` -> `no`/`no comprobado`, o `no` ->
  `sí`) y canal exacto cuando sea `sí`.
- Bodega: tiendas propias, tiendas colectivas oficiales, age-gates y casos de
  reventa independiente descartados.
- Arroz/xufa/horchata: productor/elaborador frente a hostelería o marca sin
  unidad productiva.
- Cooperativas, almazaras, citrícolas y comercializadoras: por qué entran como
  elaborador/productor dentro de alcance o por qué se purgan.
- Obradores vs despachos/cafeterías en pan, pastelería, turrón y peladillas.
- Purgas por no productor, cierre, duplicado, otra provincia o entidad sin rastro
  suficiente.
- Correcciones de municipio/pedanía o variantes valenciano/castellano.

## Lote 1 - Aceite + aromáticas

Revisión de las 16 fichas de `Aceite` y `Aromáticas y condimentos`
(2026-06-29). Resultado editorial: 16 filas activas (0 purgas), 13
`verificado`, 3 `parcial`; venta online 7 `sí` (todas `ecommerce`), 4 `no`, 5
`no comprobado`. Las URL y claims por fila están en
`data/evidence/comunitat-valenciana/valencia.jsonl`.

Decisiones relevantes:

- **Venta online confirmada (`ecommerce`):** `caroche-aceite-de-oliva-virgen-extra-ayora`,
  `oli-oli-requena`, `la-alcublana-alcublas`,
  `sant-pere-cooperativa-moixent-moixent`, `cooperativa-campoenguera-enguera`,
  `molino-del-motroton-turis` y `aceites-de-las-heras-utiel`.
- **`no` confirmado:** `coop-agricola-sta-barbara-de-casinos-coopv-casinos`,
  `la-cooperativa-de-chelva-chelva`, `cooperativa-vinicola-lliria-lliria` y
  `cooperativa-cristo-de-la-salud-millares` (fuentes propias con almazara o
  actividad, pero sin tienda ni pedido remoto).
- **`no comprobado`:** `flormed-by-lavandabio-venta-del-moro` y
  `cooperativa-san-isidro-cortes-de-pallas` tienen productos/contacto, pero no
  un pedido remoto explícito; `ecoaromuz-ademuz`, `valrural-cofrentes` y
  `cooperativa-de-bolbaite-bolbaite` quedan además en `parcial`.
- **`parcial` por techo de evidencia:** `ecoaromuz-ademuz` (web oficial con
  error crítico de WordPress durante la revisión; apoyo de red/directorio),
  `valrural-cofrentes` (web propia en mantenimiento, fuente fuerte solo en
  Saborigen) y `cooperativa-de-bolbaite-bolbaite` (web oficial mínima; actividad
  oleícola apoyada por directorio sectorial).
- **Contactos corregidos desde fuente oficial:** La Alcublana (`pedidos@` y
  teléfono de cabecera), Lavandabio (`ventas@` y WhatsApp oficial), Bolbaite,
  Cortes de Pallás y Millares (dirección más precisa). Chelva incorpora su
  Instagram oficial.

Snapshot tras lote 1:

- Filas CSV: 196
- Verificación: 13 `verificado`, 99 `parcial`, 84 `pendiente`
- Venta online: 94 `sí`, 64 `no`, 38 `no comprobado`
- Canal de venta informado: 7/94 productores con `Venta online=sí`
- Evidencia Valencia: 16 registros JSONL

## Lote 2 - Bodega I - Utiel-Requena/Cabriel

Revisión de 28 bodegas de Utiel-Requena, Sinarcas, Venta del Moro, Caudete de
las Fuentes, Fuenterrobles, Siete Aguas, Villargordo del Cabriel y pedanías
(2026-06-29). Resultado editorial: 28 filas activas (0 purgas), 28
`verificado`; venta online 19 `sí` (todas `ecommerce`), 7 `no`, 2
`no comprobado`. Las URL y claims por fila están en
`data/evidence/comunitat-valenciana/valencia.jsonl`.

Decisiones relevantes:

- **Venta online confirmada (`ecommerce`):** `la-picaraza-utiel`,
  `vinea-clausa-fuenterrobles`, `bodegas-nodus-caudete-de-las-fuentes`,
  `setvins-de-muntanya-siete-aguas`, `bodega-pago-de-tharsys-requena`,
  `bodegas-haya-requena`, `bodegas-utielanas-utiel`,
  `bodega-sinarcas-sinarcas`, `marsilea-vinos-sinarcas`,
  `bodegas-pasiego-sinarcas`,
  `bodega-las-mercedes-del-cabriel-villargordo-del-cabriel`,
  `bodegas-novos-la-portera`, `bodega-dussart-pedron-los-pedrones`,
  `bodegas-hispano-suizas-requena`, `bodega-mustiguillo-utiel`,
  `chozas-carrascal-requena`, `bodegas-vegalfaro-requena`,
  `dominio-de-la-vega-requena` y `bodega-sierra-norte-requena`.
- **`no` confirmado:** `bodegas-pigar-requena`,
  `bodega-sexto-elemento-venta-del-moro`,
  `vinos-y-sabores-ecologicos-la-portera`, `bodegas-vibe-requena`,
  `bodega-ferrer-gallego-venta-del-moro`,
  `bodegas-proexa-venta-del-moro` y `aranleon-venta-del-moro` tienen fuente propia
  suficiente, pero no tienda ni pedido remoto verificado.
- **`no comprobado`:** `finca-san-blas-requena` deriva la venta online a
  Voravins, distribuidor externo que no basta como canal propio/colectivo;
  `bodegas-murviedro-requena` conserva productos y contacto, pero la ruta de
  tienda falla y no se confirmó compra usable.
- **Correcciones de municipio/pedanía:** `aranleon-venta-del-moro` pasa de Requena a
  Venta del Moro por la ubicación oficial en Los Marcos, manteniendo slug
  estable; `vinos-y-sabores-ecologicos-la-portera` pasa de Los Isidros a La
  Portera por la dirección oficial.
- **Contactos y enlaces corregidos desde fuente oficial:** Haya, Sinarcas,
  Marsilea, Novos, Vinos y Sabores Ecológicos, Dussart Pedrón, Vibe,
  Endemic/Ferrer Gallego, Proexa, Dominio de la Vega y Murviedro.

Snapshot tras lote 2:

- Filas CSV: 196
- Verificación: 41 `verificado`, 90 `parcial`, 65 `pendiente`
- Venta online: 93 `sí`, 63 `no`, 40 `no comprobado`
- Canal de venta informado: 26/93 productores con `Venta online=sí`
- Evidencia Valencia: 44 registros JSONL

## Lote 3 - Bodega II - Fontanars/Moixent/interior DO Valencia

Revisión de 18 bodegas del interior DO Valencia y Alto Turia (2026-06-29).
Resultado editorial: 18 filas activas (0 purgas), 18 `verificado`; venta online
10 `sí` (9 `ecommerce`, 1 `marketplace`), 4 `no`, 4 `no comprobado`. Las URL y
claims por fila están en `data/evidence/comunitat-valenciana/valencia.jsonl`.

Decisiones relevantes:

- **Venta online confirmada:** `cooperativa-vinicola-san-pedro-apostol-godelleta`,
  `corazon-del-mediterraneo-chiva`, `celler-del-roure-moixent`,
  `bodegas-los-pinos-fontanars-dels-alforins`, `bodegas-enguera-enguera`,
  `baldovar-923-alpuente`, `bodegas-arraez-la-font-de-la-figuera`,
  `bodegas-vegamar-calles` y `bodegas-terra-d-art-chelva` por ecommerce propio;
  `fil-loxera-cia-fontanars-dels-alforins` por marketplace colectivo Alforins.
- **`no` confirmado:** `bodegas-polo-melon-titaguas`,
  `javi-revert-viticultor-fontanars-dels-alforins`,
  `casa-los-frailes-fontanars-dels-alforins` y
  `clos-de-lom-fontanars-dels-alforins`.
- **`no comprobado`:** `vino-2l-aras-de-los-olmos` (web convertida en página
  por defecto), `rafael-cambra-fontanars-dels-alforins` (web 500),
  `bodega-daniel-belda-fontanars-dels-alforins` (hosting 429/Site Unavailable)
  y `heretat-de-taverners-fontanars-dels-alforins` (web mínima antigua).
- **Correcciones de identidad/municipio:** `corazon-del-mediterraneo-chiva`
  pasa de Buñol a Chiva por la dirección oficial; `bodegas-polo-melon-titaguas`
  corrige nombre visible a Bodegas Polo Monleón manteniendo slug estable.
- **Webs/canales corregidos:** se elimina la web aparcada de 2L; se añaden
  canales de ecommerce o marketplace en todos los `sí`.

Snapshot tras lote 3:

- Filas CSV: 196
- Verificación: 59 `verificado`, 76 `parcial`, 61 `pendiente`
- Venta online: 93 `sí`, 64 `no`, 39 `no comprobado`
- Canal de venta informado: 36/93 productores con `Venta online=sí`
- Evidencia Valencia: 62 registros JSONL

## Lote 4 - Arroz + xufa/horchata/Albufera

Revisión de 8 arroceras/molinos y 10 productores u obradores de xufa/horchata
(2026-06-29). Resultado editorial: 18 filas activas (0 purgas), 18
`verificado`; venta online 9 `sí` (todas `ecommerce`), 8 `no`, 1
`no comprobado`.

Decisiones relevantes:

- **Venta online confirmada (`ecommerce`):** `arroz-dacsa-almassera`,
  `arroces-de-lucia-sueca`, `dehesa-de-la-albufera-alboraya`,
  `arroz-santo-tomas-sollana`, `mon-orxata-alboraya`,
  `horchateria-daniel-alboraya`, `terra-i-xufa-albuixech`,
  `l-obrador-de-bou-alboraya` y `sequer-lo-blanch-alboraya`.
- **`no` confirmado:** `arroz-tartana-valencia`, `sivaris-sollana`,
  `molino-roca-quart-de-poblet`, `albufera-foods-sollana`,
  `horchateria-vida-alboraya`, `horchateria-panach-alboraya`,
  `horchateria-els-sariers-valencia` y
  `horchateria-santa-catalina-valencia`.
- **`no comprobado`:** `horchateria-subies-almassera`; la web usa el lema
  "Horchatas en casa", pero no muestra producto comprable ni checkout.
- **Dominios corregidos:** `arroz-tartana-valencia` pasa de `arroztartana.com`
  a `ricetartana.com`; `sivaris-sollana` pasa de `sivaris.com` aparcado a
  `sivaris.eu`; `terra-i-xufa-albuixech` normaliza a `terraixufa.com`.
- **Criterio aplicado:** las horchaterías se conservan solo cuando la fuente
  propia sostiene elaboración/obrador o chufa propia; la hostelería sin canal
  remoto queda `no`, no `sí` heredado.

Snapshot tras lote 4:

- Filas CSV: 196
- Verificación: 77 `verificado`, 66 `parcial`, 53 `pendiente`
- Venta online: 96 `sí`, 66 `no`, 34 `no comprobado`
- Canal de venta informado: 45/96 productores con `Venta online=sí`
- Evidencia Valencia: 80 registros JSONL

## Lote 5 - Pan y pastelería I - Valencia/Horta/Casinos

Revisión de 11 fichas de horno, pastelería, turrón y peladillas de Valencia,
Horta y Casinos (2026-06-29). Resultado editorial: 10 filas activas, 1 purga,
10 `verificado`; venta online 5 `sí` (4 `ecommerce`, 1 `email`), 3 `no`, 2
`no comprobado`.

Decisiones relevantes:

- **Venta online confirmada:** `turrones-apolonia-casinos`,
  `peladillas-y-turrones-navarro-casinos`, `la-rosa-de-jerico-valencia` y
  `forn-baixauli-picanya` por ecommerce; `horno-san-bartolome-valencia` por
  correo oficial de pedidos.
- **`no` confirmado:** `horno-y-pasteleria-alfonso-martinez-valencia`,
  `horno-inma-moliner-mislata` y `forn-de-manuela-valencia`.
- **`no comprobado`:** `la-tahona-del-abuelo-valencia` (dominio heredado
  convertido en página por defecto) y `turrones-chimo-casinos` (sin web propia
  activa ni tienda remota verificable).
- **Purga:** `turrones-ramos-valencia` se elimina como `other-province`; la
  fuente oficial sitúa la elaboración en obrador de Jijona y la tienda de
  Valencia no basta para mantenerlo como productor provincial. Se elimina
  también su imagen referenciada.
- **Webs corregidas:** se eliminan del CSV las webs heredadas que ya no
  representan al productor (`latahonadelabuelo.com` y negocio.site de Alfonso
  Martínez). Se descarta `turronescasinos.com` para Chimo por corresponder a
  otro productor de Casinos.

Snapshot tras lote 5:

- Filas CSV: 195
- Verificación: 87 `verificado`, 57 `parcial`, 51 `pendiente`
- Venta online: 96 `sí`, 66 `no`, 33 `no comprobado`
- Canal de venta informado: 50/96 productores con `Venta online=sí`
- Evidencia Valencia: 91 registros JSONL

## Lote 6 - Pan y pastelería II - comarcas

Revisión de 12 hornos, panaderías y pastelerías de Requena, Los Pedrones,
Titaguas, Alberic, Alzira, Ademuz, Torrebaja, Xàtiva, Chelva y Gandía
(2026-06-29). Resultado editorial: 12 filas activas (0 purgas), 6
`verificado`, 6 `parcial`; venta online 4 `sí` (3 `ecommerce`, 1
`whatsapp`), 7 `no`, 1 `no comprobado`.

Decisiones relevantes:

- **Venta online confirmada:** `horno-de-lena-el-puente-chiva`,
  `panquemados-moscardo-alberic` y `dulces-campos-xativa` por ecommerce propio;
  `pastisseria-tano-gandia` por pedido oficial vía WhatsApp.
- **`no` confirmado o conservador:** `horno-iranzo-requena` tiene web propia
  informativa sin tienda; los hornos sin web propia (`horno-carmen-los-pedrones-requena`,
  `horno-artesano-a-lena-la-marieta-venta-del-moro`,
  `horno-la-marcona-titaguas`, `panaderia-elvira-ademuz`,
  `panaderia-canizares-torrebaja` y `horno-hermanos-sevilla-chelva`) quedan
  `parcial` y `no` por ausencia de canal remoto confirmado.
- **`no comprobado`:** `pasteleria-llopis-alzira` queda `verificado` por fuente
  propia, pero sin venta remota activa confirmada durante el traslado temporal
  de obrador.
- **Enlaces corregidos:** `horno-artesano-a-lena-la-marieta-venta-del-moro`
  elimina Facebook e Instagram heredados de Horno El Puente; la evidencia queda
  apoyada en su ficha Saborigen.

## Lote 7 - Cerveza artesana + licores

Revisión de 22 microcerveceras, destilerías y marcas de licores (2026-06-29).
Resultado editorial: 22 filas activas (0 purgas), 16 `verificado`, 6
`parcial`; venta online 12 `sí` (10 `ecommerce`, 2 `marketplace`), 3 `no`, 7
`no comprobado`.

Decisiones relevantes:

- **Venta online confirmada:** Tyris, Zeta, Antiga, Alegría, Bodegas
  Urbanas/Fernández Pons, EMI, Galana, Destilerías Cerveró, Baronía de Turís y
  Destilerías Plà por ecommerce; `castrum-brewery-meliana` por marketplace
  PROAVA; `53-covetes-bocairent` por marketplace Vinos Valencianos.
- **Correcciones de clasificación y enlaces:** `fernandez-pons-godella` pasa de
  `Cerveza artesana` a `Bodega` y actualiza web a `bodegasurbanas.es`;
  `destilerias-pla-pucol` normaliza el dominio HTTPS actual.
- **`no` confirmado:** `cerveza-la-socarrada-xativa`, `destilerias-ferri-bellreguard`
  y `destilerias-rios-silla`; en Rios la propia web declara que la tienda es de
  demostración y no completa pedidos.
- **`no comprobado`:** `birra-blues-alboraya`, `obsidiana-brewing-turis`,
  `tercer-tiempo-la-pobla-de-vallbona`, `valentivm-cerveza-artesana-llombai`,
  `artelicor-san-antonio-de-requena`, `bodegas-reymos-cheste` y
  `69brosses-villanueva-de-castellon` quedan con identidad localizada, pero sin
  canal remoto vigente confirmado.

## Lote 8 - Miel + trufa

Revisión de 13 apicultores/marcas de miel y la ficha de trufa de Javalturia
(2026-06-29). Resultado editorial: 14 filas activas (0 purgas), 12
`verificado`, 2 `parcial`; venta online 11 `sí` (10 `ecommerce`, 1
`telefono`), 1 `no`, 2 `no comprobado`.

Decisiones relevantes:

- **Javalturia se conserva:** la fuente propia de Truficultura Técnica identifica
  Javalturia como marca para comercializar trufa cultivada y silvestre de la
  Serranía/Alto Turia; queda `verificado`, con venta por teléfono.
- **Venta online confirmada (`ecommerce`):** ANAE, Campos de Ayora, Miel El
  Corta, Miel del Parpalló, Miel J. Regal, Miel la Calderona, Miel Flor de
  Flor, Muusat, Rosamiel y Mieles La Travina.
- **`no` confirmado:** `apicultura-cerda-ayora` tiene web propia informativa y
  contacto, pero no tienda ni pedido remoto.
- **`no comprobado`:** `miel-y-punto-ayora` y `mieles-bimiel-bicorp`; las webs
  heredadas fallaron o devolvieron 404, por lo que no se confirma canal remoto.
- **Dominio corregido:** ANAE actualiza de `anaemiel.com` a `anaemiel.net`.

## Lote 9 - Fruta, zumos y frutos secos

Revisión de 21 productores de fruta, cítricos, zumos, manzana esperiega y frutos
secos (2026-06-29). Resultado editorial: 21 filas activas (0 purgas), 13
`verificado`, 8 `parcial`; venta online 12 `sí` (11 `ecommerce`, 1
`whatsapp`), 8 `no`, 1 `no comprobado`.

Decisiones relevantes:

- **Venta online confirmada (`ecommerce`):** Frutos Secos Lozano, Pomme Brun,
  La Imperfecta, Naranjas del Carmen, Naranjas Ribera del Júcar, Naranja
  Tradicional de Gandia, Huerto Ribera, Naranjas Ché, Naranjas Lola, Naranjas
  de Cullera y Vircoop/manzana esperiega.
- **Pedido directo por WhatsApp:** `naranjas-y-pomelos-del-turia-alcublas`
  declara venta directa, envíos a domicilio y WhatsApp en su web propia.
- **`no` confirmado:** Fernando Belda, ARASCOOP, Frutas Las Niñas, Serviagro
  Rivera, The Green Experience, Lorenzo García, Dario Guillardini y Magropor no
  tienen canal remoto propio confirmado.
- **`no comprobado`:** `mericana-algimia-d-alfara`, por fallo TLS del dominio
  Jimdo heredado.
- **Dominio corregido:** `pomme-brun-ademuz` normaliza a `pommebrun.com` y
  `vircoop-ademuz` pasa a la tienda oficial `manzanasesperiegas.com`.
- **Límite de verificación:** `la-imperfecta-cullera` queda `parcial` pese a
  tener tienda oficial, porque el CSV aún no tiene coordenadas fiables para
  cumplir el contrato de `verificado`.

## Lote 10 - Lácteos y quesos + huevos

Revisión de 9 queserías/granjas lácteas y 2 productores de huevos
(2026-06-29). Resultado editorial: 11 filas activas (0 purgas), 5
`verificado`, 6 `parcial`; venta online 3 `sí` (todas `ecommerce`), 3 `no`, 5
`no comprobado`.

Decisiones relevantes:

- **Venta online confirmada (`ecommerce`):** `queseria-hoya-de-la-iglesia-requena`,
  `granja-el-parral-barxeta` y `quesos-jamesa-la-llosa-de-ranes`.
- **`no` confirmado:** `sinarcas-avicola-sinarcas` y `huevos-monterde-sinarcas`
  tienen webs propias de actividad/producto sin tienda; `queserias-romero-gozalbez-s-l-la-llosa-de-ranes`
  queda `parcial` con directorio y sin canal propio.
- **`no comprobado`:** `granja-rinya-albal`, `heretat-de-pere-quatretonda`,
  `queseria-artesana-la-vall-ontinyent`, `quesos-belda-l-alcudia-de-crespins`
  y `arte-lactico-caprino-chiva` por dominios caídos, errores o falta de canal
  remoto verificable.

Snapshot tras lote 10:

- Filas CSV: 195
- Verificación: 139 `verificado`, 43 `parcial`, 13 `pendiente`
- Venta online: 100 `sí`, 60 `no`, 35 `no comprobado`
- Canal de venta informado: 92/100 productores con `Venta online=sí`
- Evidencia Valencia: 171 registros JSONL

## Lote 11 - Charcutería + pescado

Revisión de 15 carnicerías, obradores y marcas de embutido, más Salazones CIGES
(2026-06-29). Resultado editorial: 16 filas activas (0 purgas), 5
`verificado`, 11 `parcial`; venta online 2 `sí` (1 `ecommerce`, 1
`ecommerce|whatsapp`), 13 `no`, 1 `no comprobado`.

Decisiones relevantes:

- **Venta online confirmada:** `embutidos-encarna-requena` por tienda propia
  WooCommerce y `casa-toribio-xirivella` por shop propio con carrito y WhatsApp
  del obrador.
- **`verificado` sin venta remota:** `jomar-productos-artesanos-gestalgar`,
  `embutidos-pimar-ontinyent` y `salazones-ciges-sollana` tienen fuente propia
  suficiente de actividad/producto y ubicación, pero no tienda ni pedido remoto
  confirmado.
- **`parcial` por fuente local o social:** `carnes-jose-y-maria-serra`,
  `embutidos-el-ponton-requena`, `carniceria-donat-ontinyent`,
  `embutidos-emilia-requena`, `embutidos-isabel-requena`,
  `carniceria-hermanos-lance-tuejar`, `carniceria-colau-bocairent`,
  `carniceria-paco-i-fills-bocairent`, `carnicas-silvestre-bocairent` y
  `carniceria-la-cerrada-ademuz` quedan localizados, pero sin fuente primaria
  fuerte suficiente para subirlos a `verificado`.
- **`no comprobado`:** `embutidos-el-serrano-requena`; el dominio heredado no
  respondió durante la revisión y no se confirma canal remoto vigente.

## Lote 12 - Café, chocolate + otros restantes

Revisión de cafés, chocolates y otros productores heterogéneos pendientes
(2026-06-29). Resultado editorial: 8 filas activas y 1 purga; 7 `verificado`,
1 `parcial`; venta online 7 `sí` (todas `ecommerce`) y 1 `no comprobado`.

Decisiones relevantes:

- **Venta online confirmada (`ecommerce`):** `jalancina-jalance`,
  `delicia-esperiega-casa-antiga-castielfabib`, `ecoespirulina-serra`,
  `bluebell-coffee-roasters-valencia`, `utopick-cacao-valencia`,
  `chocolates-comes-sueca` y `trufas-martinez-valencia`.
- **Dominio corregido:** `delicia-esperiega-casa-antiga-castielfabib` pasa de
  `deliciaesperiega.es` a `deliciaesperiega.com`, la web viva con tienda online.
- **Enlace erróneo retirado:** `chocolates-comes-sueca` elimina el Instagram
  heredado `instagram.com/wordpress/`, que no pertenecía al productor.
- **`no comprobado`:** `groguetes-olocau`; el dominio heredado no resuelve y se
  conserva por redes/ficha local, sin canal remoto actual confirmado.
- **Purga:** `cafes-valiente-valencia` se elimina como `out-of-scope`; la fuente
  viva lo presenta como marca de Cafento, no como productor valenciano actual.

Snapshot tras lote 12:

- Filas CSV: 194
- Verificación: 151 `verificado`, 43 `parcial`, 0 `pendiente`
- Venta online: 101 `sí`, 61 `no`, 32 `no comprobado`
- Canal de venta informado: 101/101 productores con `Venta online=sí`
- Evidencia Valencia: 196 registros JSONL

## Lote 13 - Cierre transversal provincial

Auditoría final de Valencia (2026-06-29). Resultado editorial: 194 filas
activas, 151 `verificado`, 43 `parcial`, 0 `pendiente`; venta online 101 `sí`
(todas con canal), 61 `no`, 32 `no comprobado`. La evidencia cubre todas las
filas activas y las dos purgas; Valencia queda añadida a
`data/evidence/coverage.json`.

Decisiones relevantes:

- **Cobertura cerrada:** 194 filas activas con registro `keep` en
  `data/evidence/comunitat-valenciana/valencia.jsonl`; 2 tombstones `purge`
  (`turrones-ramos-valencia` y `cafes-valiente-valencia`).
- **Canales cerrados:** no queda ningún `Venta online=sí` sin `Canal de venta`.
- **Corrección transversal:** `dehesa-de-la-albufera-alboraya` pasa de
  municipio `Silla` a `Alboraya` y deja el slug alineado; la fuente propia
  sostiene la sede en C/ Joan Lluís Vives 4, Alboraya, y no una ubicación
  productiva verificable en Silla.
- **Warnings de geografía aceptados:** quedan 5 avisos `15-100 km` en
  `check:csv:data-quality`, todos revisados y no bloqueantes:
  `horno-carmen-los-pedrones-requena`, `queseria-hoya-de-la-iglesia-requena`
  y `bodegas-haya-requena` están en pedanías o núcleos rurales de Requena;
  `horno-artesano-a-lena-la-marieta-venta-del-moro` está documentado por
  Saborigen como Venta del Moro; `arroz-tartana-valencia` mantiene municipio
  Valencia porque la fuente oficial sitúa la finca arrocera en El Palmar
  (Valencia), aunque el punto esté más cerca del centroide de Sollana.
- **Dudas residuales documentadas:** las 43 filas `parcial` y las 32
  `no comprobado` no bloquean el cierre; todas tienen evidencia actual que
  explica si dependen de ficha local, red social, dominio caído, directorio o
  tienda no verificable.

Snapshot final:

- Filas CSV: 194
- Verificación: 151 `verificado`, 43 `parcial`, 0 `pendiente`
- Venta online: 101 `sí`, 61 `no`, 32 `no comprobado`
- Canal de venta informado: 101/101 productores con `Venta online=sí`
- Evidencia Valencia: 196 registros JSONL
- Cobertura estricta/advisory: `comunitat-valenciana/valencia`

## Mantenimiento ola 3 - venta online

Revisión transversal de 53 filas con `Venta online=no comprobado`
(2026-07-29). Se resuelven 30 casos: 11 pasan a `sí` con canal, 18 a `no` y
se purga `quesos-belda-l-alcudia-de-crespins` porque el BORME inscribió la
extinción de Quesos Belda S.L. en 2019. Quedan 23 casos sin resolver porque el
canal propio falla técnicamente, la tienda está en mantenimiento o sin stock,
o no se pudo distinguir con seguridad una tienda actual de un tercero.

Mejoras materiales del CSV:

- Se recuperan tiendas activas que la pasada anterior no pudo leer:
  Artelicor, Lavandabio, Ecoaromuz, Obsidiana Brewing, 2L Vinos Alto Turia,
  Daniel Belda, Murviedro, Cárcel de Corpa y Bodegas Lupanda.
- `arroces-e-lozano-alginet` incorpora identidad web, dirección, teléfono,
  correo y tienda propia; pasa de ficha sectorial `parcial` a `verificado`.
- ARCESA incorpora marcas, dirección industrial, teléfono, correo y web
  oficiales; Granja Rinya corrige dirección y completa contacto; Groguetes
  sustituye el dominio muerto y el correo antiguo por el contacto publicado en
  la guía turística comarcal vigente.
- Se actualizan teléfonos o contactos de Bodegas Lupanda, Bodegas Carlos
  Cárcel y Bodegas Palmera, y se retira el dominio muerto de Embutidos El
  Serrano sin convertir el fallo técnico en un `no`.
- Las falsas tiendas de plantilla de Cooperativa de Bolbaite y Arrocerías
  Antonio Tomás no cuentan como venta online; las páginas exponen productos de
  demostración ajenos a la entidad.

Snapshot tras el mantenimiento:

- Filas CSV: 218
- Verificación: 167 `verificado`, 51 `parcial`, 0 `pendiente`
- Venta online: 116 `sí`, 79 `no`, 23 `no comprobado`
- Evidencia: 229 registros (218 `keep`, 3 `purge`, 8 `merge`)
