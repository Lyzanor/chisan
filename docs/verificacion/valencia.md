# Verificación provincial de Valencia

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/comunitat-valenciana/valencia.csv`. El CSV es la fuente de verdad. La
evidencia estructurada por fila debe vivir en
`data/evidence/comunitat-valenciana/valencia.jsonl` a medida que se revise cada
lote (creado en el lote 1).

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento no
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
| 6 | Pan y pastelería II - comarcas | 12 | 5 | 7 | 0 | 3 | pendiente | Requena, Venta del Moro, Titaguas, Alberic, Alzira, Ademuz, Torrebaja, Xàtiva, Chelva, Gandía. |
| 7 | Cerveza artesana + licores | 22 | 11 | 11 | 0 | 13 | pendiente | Microcervecera/destilería vs bar, marca o distribuidor. Revisar tiendas y pedidos por contacto. |
| 8 | Miel + trufa | 14 | 4 | 10 | 0 | 9 | pendiente | Ayora y apicultores; Javalturia como único `Trufa y setas`. |
| 9 | Fruta, zumos y frutos secos | 21 | 13 | 8 | 0 | 11 | pendiente | Cítricos, kaki, manzana esperiega, cooperativas y ecommerce agrícola. |
| 10 | Lácteos y quesos + huevos | 11 | 5 | 6 | 0 | 2 | pendiente | Queserías/granjas frente a distribución; huevos de Sinarcas. |
| 11 | Charcutería + pescado | 16 | 5 | 11 | 0 | 1 | pendiente | Embutidos de Requena/Bocairent/Ademuz/Ontinyent; Salazones CIGES. |
| 12 | Café, chocolate + otros restantes | 9 | 8 | 1 | 0 | 7 | pendiente | Tostadores, obradores de chocolate, espirulina, Jalancina, Groguetes y Esperiega Casa Antiga. |
| 13 | Cierre transversal provincial | 196 | 93 | 103 | 0 | 96 | pendiente | Recalcular tras lotes 1-12. Duplicados, bilingüismo, pedanías, canales, evidencia, imágenes y cobertura. |

## Flujo por lote

Detalle completo en `docs/VERIFICATION_TECHNIQUES.md`. Por lote:

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
  `vinos-y-sabores-ecologicos-los-isidros`, `bodegas-vibe-requena`,
  `bodega-ferrer-gallego-venta-del-moro`,
  `bodegas-proexa-venta-del-moro` y `aranleon-requena` tienen fuente propia
  suficiente, pero no tienda ni pedido remoto verificado.
- **`no comprobado`:** `finca-san-blas-requena` deriva la venta online a
  Voravins, distribuidor externo que no basta como canal propio/colectivo;
  `bodegas-murviedro-requena` conserva productos y contacto, pero la ruta de
  tienda falla y no se confirmó compra usable.
- **Correcciones de municipio/pedanía:** `aranleon-requena` pasa de Requena a
  Venta del Moro por la ubicación oficial en Los Marcos, manteniendo slug
  estable; `vinos-y-sabores-ecologicos-los-isidros` pasa de Los Isidros a La
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
  `arroces-de-lucia-sueca`, `dehesa-de-la-albufera-silla`,
  `arroz-santo-tomas-sollana`, `mon-orxata-alboraya`,
  `horchateria-daniel-alboraya`, `terra-i-xufa-albuixech`,
  `l-obrador-de-bou-alboraya` y `sequer-lo-blanch-alboraya`.
- **`no` confirmado:** `arroz-tartana-sollana`, `sivaris-algemesi`,
  `molino-roca-meliana`, `albufera-foods-sollana`,
  `horchateria-vida-alboraya`, `horchateria-panach-alboraya`,
  `horchateria-els-sariers-valencia` y
  `horchateria-santa-catalina-valencia`.
- **`no comprobado`:** `horchateria-subies-almassera`; la web usa el lema
  "Horchatas en casa", pero no muestra producto comprable ni checkout.
- **Dominios corregidos:** `arroz-tartana-sollana` pasa de `arroztartana.com`
  a `ricetartana.com`; `sivaris-algemesi` pasa de `sivaris.com` aparcado a
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
