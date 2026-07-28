# Verificación provincial de Zaragoza

Ledger para planificar y reanudar la primera pasada profunda de
`data/csv/aragon/zaragoza.csv`. El CSV es la fuente de verdad y la evidencia
por decisión vive en `data/evidence/aragon/zaragoza.jsonl`.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento
solo conserva el snapshot, los riesgos locales, el alcance exacto y el avance.
Los contratos son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Cómo reanudar

1. Leer `git status --short`, Estado, Reglas locales y solo el lote pendiente
   de menor número. No releer el CSV, el JSONL o este documento completos.
2. Confirmar que Zaragoza no tiene cambios concurrentes y localizar únicamente
   los slugs del lote en CSV, evidencia, candidatos e imágenes.
3. Resolver primero exclusiones, duplicados y enlaces ajenos. Después comprobar
   identidad, actividad productora y municipio; auditar venta online aparte.
4. Detener la investigación cuando la decisión sea sólida. No completar campos
   opcionales ni imágenes salvo que cambien la decisión o queden huérfanos.
5. Editar quirúrgicamente con un parser CSV, mantener LF y añadir o sustituir
   una línea JSONL por decisión con `reviewedBy: "gpt-5.6-sol"`.
6. Actualizar solo el snapshot, la fila del lote y las excepciones reutilizables.
   Validar el lote antes de pasar al siguiente.

No se tocan filas de otro lote «de paso». Un hallazgo cruzado se anota aquí y
se resuelve en su lote. Los lotes solo se recalculan tras purgas o merges.

## Definición de completado

- No queda ninguna fila sin decisión editorial revisada en esta pasada.
- `pendiente` solo sobrevive con un bloqueo real documentado; `parcial` es un
  cierre válido cuando existe un techo registral, secundario o técnico real.
- Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- Todos los `Venta online=sí|no` están demostrados y cada `sí` tiene un canal
  válido; la reventa independiente no cuenta como venta del productor.
- No quedan duplicados editoriales, enlaces ajenos ni imágenes huérfanas. CSV y
  evidencia están reconciliados y `npx pnpm verify:data` termina sin incidencias
  atribuibles a Zaragoza.
- `data/evidence/coverage.json` solo se actualiza al cerrar la pasada completa.

## Estado

```text
Estado de pasada: mantenimiento
Base: 7f56485
Método: sinteticas, pendiente, evidencia-prestada, web-de-tercero,
  canal-sin-clasificar, descripcion-generica, categoria-variante (check:defects)
Lote activo: — (ZA-R1-1 y ZA-R1-2 cerrados)
Alcance: —
Última actualización: 2026-07-28
```

- **Lotes ZA-R1-1 y ZA-R1-2 (2026-07-28, carril R1).** Alcance: las 27
  `pendiente`, que incluían las 23 `sinteticas`. Ambas colas a **0**;
  246→223 filas. La pasada anterior ya había buscado las 23 sin hallar rastro
  y había verificado que sus dominios no resuelven; se paró con la razón
  correcta escrita («ausencia y fallo técnico no prueban inexistencia»). Lo
  que faltaba era la fuente que zanja, y ahora hay dos: **ninguna de las 23
  está en «Pon Aragón en tu Mesa»** (3.154 fichas, 1.337 productores, 20
  grupos LEADER) **ni en el Registro de la Artesanía Alimentaria de Aragón**
  (30/06/2026). Purgadas con `nonexistent` y la nota redactada como defecto
  del registro propio, no como inexistencia del negocio.
  - Método reutilizable: el buscador del directorio se replica por URL con
    `?w2dc_action=search&controller=directory_controller&what_search=…`; los
    resultados vienen en el HTML aunque el contador se pinte por JS.
  - Matiz que queda escrito en 7 evidencias: Zaragoza capital y Utebo no los
    cubre bien ese directorio, que es de ámbito rural (Utebo devuelve 0
    fichas). Ahí el peso lo llevan los directorios generalistas, el dominio
    inventado y la ausencia total de datos.
  - De las 4 filas que venían del registro mercantil, 3 purgadas como
    `not-producer` —Epulae Monegros (además en concurso voluntario desde
    2019), Inversiones Michelac y Aragonesa de Productos Lácteos: su único
    rastro es un CNAE de fabricación de queso y un domicilio, en un caso un
    piso—. **Agerca S. Coop. (Tauste) sí es real** y sube a `parcial`
    (quesos de cabra Quesicos y Quitapenas, tel. 976 854 267); queda sin
    dirimir si su dirección es Juan de Austria s/n o Ronda Val de Volvi 5.
- Inicio: **2026-07-14**. Modo: primera pasada profunda de las 254 filas
  heredadas; no se añaden candidatos nuevos antes del cierre transversal.
- Snapshot inicial: **254 filas**; **183 `pendiente`, 61 `parcial`, 10
  `verificado`**. Las 71 filas no pendientes se reauditan con el mismo estándar.
- Venta online inicial: **35 `sí`, 22 `no`, 197 `no comprobado`**. Hay **33
  `sí` sin `Canal de venta`**; todas las decisiones positivas y negativas se
  consideran en cuarentena hasta revalidar el mecanismo actual.
- Categorías principales: Bodega 53; Aceite 40; Miel 22; Pan y pastelería 20;
  Lácteos y quesos y Charcutería 19 cada una; Fruta y verdura 18; Harinas y
  cereales 9; Cerveza artesana 8; Frutos secos y Trufa y setas 6 cada una; y 34
  filas repartidas entre categorías menores.
- Cobertura inicial: web 200/254, Instagram 86/254, Facebook 62/254, Google Maps
  252/254, teléfono 247/254, correo 193/254, coordenadas 184/254 e imagen
  121/254. No se enriquecen imágenes en esta pasada; solo se retiran o renombran
  al purgar, fusionar o corregir un slug.
- Evidencia inicial: **18 `keep`**, sin `merge` ni `purge`; corresponde a altas
  de julio de 2026. Zaragoza no figura en `data/evidence/coverage.json`.
- Candidatos: `docs/candidates/zaragoza.md` contiene dos lotes DO ya resueltos y
  varios diferidos B2B/sin marca. No se reabre como fuente de altas hasta ZG-22.
- Calidad inicial: contrato y auditoría de calidad de Zaragoza con **0 errores y
  0 avisos**. Faltan Maps en `nueces-ramon-puyod-ejea-de-los-caballeros` y
  `pam-coffee-roasters-zaragoza`; 70 filas carecen de coordenadas y por ello no
  pueden quedar `verificado` sin una ubicación honesta.
- Tras ZG-01 (2026-07-14): **253 filas**; **171 `pendiente`, 61 `parcial`, 21
  `verificado`**. El lote resolvió 15 fichas iniciales como 11 verificadas, 2
  parciales, 1 pendiente con bloqueo real y 4 merges, uno de ellos duplicativo.
  Venta online: **40 `sí`, 22 `no`, 191 `no comprobado`**; los siete `sí` del
  lote tienen canal ecommerce. Evidencia acumulada: 32 `keep` y 4 `merge`.
  Ajo y cerezas se integró en Ajo de Arándiga; Delifactory se corrigió de la
  sede fiscal de Zaragoza a su planta de Utebo; Cortes Lácteo pasó a su marca
  Helados LIC y Tereos perdió la identidad falsa «Harinas». Se renombraron las
  tres imágenes afectadas. Aragonesa de Productos Lácteos conserva `pendiente`
  documentado por no publicar planta, marca ni producto efectivo.
- Tras ZG-02 (2026-07-14): **253 filas**; **164 `pendiente`, 57 `parcial`, 32
  `verificado`**. Las 12 bodegas del lote quedan verificadas: 8 con venta
  ecommerce vigente y 4 con venta online `no` tras revisar sus canales
  oficiales. Venta provincial: **46 `sí`, 25 `no`, 182 `no comprobado`**.
  Evidencia acumulada: 42 `keep` y 6 `merge`. Alto Moncayo se corrigió de
  Pozuelo de Aragón a su bodega de Borja y Bodega Santo Cristo se normalizó a
  la identidad pública Bodegas Ainzón; se renombraron ambas imágenes. Los 227
  slugs planificados para ZG-03–ZG-21 siguen presentes una sola vez.
- Tras ZG-03 (2026-07-14): **253 filas**; **157 `pendiente`, 54 `parcial`, 42
  `verificado`**. Las 10 bodegas del lote quedan verificadas: 7 con ecommerce,
  Pago Aylés con pedido por email, Covinca con venta online `no` y Solar de
  Urbezo en `no comprobado` por no poder confirmar un mecanismo operativo.
  Venta provincial: **51 `sí`, 26 `no`, 176 `no comprobado`**. Evidencia
  acumulada: 52 `keep` y 8 `merge`. Frontonio se corrigió de Almonacid de la
  Sierra a Alpartir y Covinca a Longares; la imagen de Covinca quedó renombrada.
  Se añadió el override territorial de Longares, que el índice base confundía
  con Longás. Los 217 slugs planificados para ZG-04–ZG-21 siguen presentes una
  sola vez.
- Tras ZG-04 (2026-07-14): **253 filas**; **155 `pendiente`, 47 `parcial`, 51
  `verificado`**. El lote cierra 13 bodegas verificadas y 2 parciales con techo
  institucional. Venta provincial: **53 `sí`, 31 `no`, 169 `no comprobado`**;
  en el lote quedan 3 ecommerce, 2 pedidos remotos por contacto, 6 sin venta y
  4 no comprobadas. Evidencia acumulada: 59 `keep` y 9 `merge`. El slug
  redundante de Vignius/IGnius se normalizó a
  `vinos-ignius-almonacid-de-la-sierra`; los sitios de IGnius y Heredad Ansón
  funcionan por HTTP aunque falle su HTTPS. Los 202 slugs planificados para
  ZG-05–ZG-21 siguen presentes una sola vez.
- Tras ZG-05 (2026-07-14): **252 filas**; **150 `pendiente`, 43 `parcial`, 59
  `verificado`**. Las 12 fichas iniciales quedan en 11 bodegas verificadas tras
  fusionar Vinae Mureri en la identidad vigente Bodega SOMMOS Garnacha. Venta
  provincial: **55 `sí`, 33 `no`, 164 `no comprobado`**; en el lote hay 7
  ecommerce, 3 sin venta remota y San Gregorio no comprobada por mantenimiento
  temporal. Evidencia acumulada: 67 `keep` y 10 `merge`. Los 190 slugs
  planificados para ZG-06–ZG-21 siguen presentes una sola vez.
- Tras ZG-06 (2026-07-14): **249 filas**; **141 `pendiente`, 40 `parcial`, 68
  `verificado`**. Las 15 fichas iniciales quedan en 12 productores: 10
  verificados, 2 parciales y 3 purgas. Venta provincial: **58 `sí`, 35 `no`,
  156 `no comprobado`**; el lote cierra 4 ecommerce, 4 sin venta remota y 4 no
  comprobadas. Evidencia acumulada: 76 `keep`, 11 `merge` y 3 `purge`.
  Almazara de Jaime se normalizó a su operador vigente Aceites de Belchite;
  Aceites Marco consta extinguida y las identidades genéricas Almazara de
  Sástago y Almazara La Olivera no superaron la comprobación editorial. Los 175
  slugs planificados para ZG-07–ZG-21 siguen presentes una sola vez.
- Tras ZG-07 (2026-07-14): **247 filas**; **129 `pendiente`, 42 `parcial`, 76
  `verificado`**. Las 15 fichas iniciales quedan en 13 productores: 8
  verificados, 5 parciales y 2 purgas. Venta provincial: **63 `sí`, 38 `no`,
  146 `no comprobado`**; el lote cierra 6 ecommerce, 2 pedidos por contacto, 3
  sin venta remota y 2 no comprobadas. Evidencia acumulada: 89 `keep`, 12
  `merge` y 5 `purge`. La cooperativa de Borja se normalizó a su identidad
  pública; «Aceites Sierra del Moncayo» confundía la DOP con una empresa y la
  supuesta cooperativa San Pedro Apóstol de Tabuenca no resultó trazable. Los
  160 slugs planificados para ZG-08–ZG-21 siguen presentes una sola vez.
- Tras ZG-08 (2026-07-14): **247 filas**; **123 `pendiente`, 45 `parcial`, 79
  `verificado`**. Las 8 fichas quedan en 3 verificadas, 3 parciales y 2
  pendientes honestas, sin purgas; hubo 2 normalizaciones de identidad. Venta
  provincial: **66 `sí`, 38 `no`, 143 `no comprobado`**; Lis, Arbara y La
  Redonda mantienen ecommerce y los otros cinco casos no permiten afirmar un
  pedido remoto actual. Evidencia acumulada: 97 `keep`, 14 `merge` y 5
  `purge`. La Redonda se corrigió de S.A. a S.L. y la antigua Almazara Aniñón
  pasó a su identidad 2026, Virgen del Castillo. Botorrita y Cariñena se
  depuraron sin purga porque el fallo DNS y la falta de rastro no demuestran
  inexistencia. Los 152 slugs planificados para ZG-09–ZG-21 siguen presentes
  una sola vez.
- Tras ZG-09 (2026-07-14): las **11 fichas** del lote quedan en **5
  verificadas, 3 parciales y 3 pendientes honestas**, con una normalización de
  identidad. En paralelo aparecieron **8 altas concurrentes de bodega** fuera
  de la worklist y todavía sin evidencia; se preservan sin intervenir y pasan a
  la cola explícita de ZG-22. El snapshot actual, incluyéndolas, es de **255
  filas**: **115 `pendiente`, 53 `parcial`, 87 `verificado`**. Venta provincial:
  **72 `sí`, 39 `no`, 144 `no comprobado`**. Evidencia acumulada: **108 `keep`,
  15 `merge` y 5 `purge`**. Dentro del lote hay 5 ventas remotas, Mieles del
  Cierzo sin venta porque su tienda sigue cerrada y 5 casos no comprobados. Los
  141 slugs planificados para ZG-10–ZG-21 siguen presentes una sola vez.
- Tras ZG-10 (2026-07-14): las **11 fichas** quedan en **4 verificadas y 7
  parciales**, sin pendientes, purgas ni cambios de slug. El snapshot actual es
  de **255 filas**: **108 `pendiente`, 56 `parcial`, 91 `verificado`**. Venta
  provincial: **74 `sí`, 41 `no`, 140 `no comprobado`**; el lote confirma 3
  ecommerce, 5 casos sin pedido remoto y 3 no comprobados. Evidencia acumulada:
  **127 `keep`, 15 `merge` y 5 `purge`**, incluidos los 8 `keep` externos que
  llegaron para las altas concurrentes durante el cierre del lote y siguen
  reservados para reauditoría en ZG-22. Miel Monte Real recuperó el nombre
  público correcto; Abejas de Cándido y Miel del Tío Juan Cruz corrigieron sus
  teléfonos actuales. Los 130 slugs planificados para ZG-11–ZG-21 siguen
  presentes una sola vez.
- Tras ZG-11 (2026-07-14): las **16 fichas** iniciales quedan en **15 filas**:
  **7 verificadas, 2 parciales, 6 pendientes honestas y 1 purga por cierre**.
  El snapshot actual es de **254 filas**: **98 `pendiente`, 58 `parcial`, 98
  `verificado`**. Venta provincial: **76 `sí`, 46 `no`, 132 `no comprobado`**;
  Biota y Letux confirman ecommerce, cinco fichas carecen de pedido remoto y
  ocho siguen sin resolución de venta. Evidencia acumulada: **142 `keep`, 15
  `merge` y 6 `purge`**. La Pardina, El Acebo y Quesos El Burgo corrigieron
  contactos e identidades heredadas; tres fichas sin rastro quedaron desnudas
  de datos especulativos y Lácteos Torreconde se eliminó por extinción oficial.
  Los 114 slugs planificados para ZG-12–ZG-21 siguen presentes una sola vez.
- Tras ZG-12 (2026-07-14): las **9 fichas** iniciales quedan en **8 filas**: **4
  verificadas, 2 parciales, 2 pendientes depuradas y 1 purga territorial**. El
  snapshot actual es de **253 filas**: **91 `pendiente`, 60 `parcial`, 102
  `verificado`**. Venta provincial: **79 `sí`, 48 `no`, 126 `no comprobado`**;
  González Romero y La Tellana tienen ecommerce y Hermanos Casabona acepta
  pedidos telefónicos con envío. Evidencia acumulada: **150 `keep`, 15 `merge`
  y 7 `purge`**. Melsa salió porque Zaragoza era solo una tienda de la fábrica
  oscense de Graus. Los 105 slugs de ZG-13–ZG-21 siguen presentes una vez.
- Tras ZG-13 (2026-07-14): las **9 fichas** iniciales quedan en **8 filas**: **2
  parciales, 6 pendientes depuradas y 1 purga territorial**, sin nuevas
  verificadas. El snapshot actual es de **252 filas**: **89 `pendiente`, 61
  `parcial`, 102 `verificado`**. Venta provincial: **79 `sí`, 48 `no`, 125 `no
  comprobado`**; Carnes García mantiene pedido por teléfono con canal explícito
  y + Q Carne queda sin resolver por dominio caído. Evidencia acumulada: **158
  `keep`, 15 `merge` y 8 `purge`**. Jamones Alto Aragón salió hacia Huesca y se
  retiró su imagen falsa de Zaragoza. Los 96 slugs de ZG-14–ZG-21 permanecen.
- Tras ZG-14 (2026-07-14): las **10 fichas** iniciales quedan en **9 filas**:
  **6 verificadas, 1 parcial, 2 pendientes depuradas y 1 purga territorial**. El
  snapshot actual es de **251 filas**: **81 `pendiente`, 62 `parcial`, 108
  `verificado`**. Venta provincial: **85 `sí`, 48 `no`, 118 `no comprobado`**;
  el lote confirma 4 ecommerce, 3 pedidos por contacto y 3 casos no resueltos.
  Evidencia acumulada: **167 `keep`, 15 `merge` y 9 `purge`**. Pan Sayón salió
  hacia Jaca (Huesca); L'Artisana y Las Almas perdieron todos los datos sin
  trazabilidad. Los 86 slugs planificados para ZG-15–ZG-21 permanecen una vez.
- Tras ZG-15 (2026-07-14): las **10 fichas** quedan en **2 verificadas, 5
  parciales y 3 pendientes depuradas**, sin purgas ni cambios de slug. El
  snapshot actual es de **251 filas**: **77 `pendiente`, 64 `parcial`, 110
  `verificado`**. Venta provincial: **85 `sí`, 47 `no`, 119 `no comprobado`**;
  Panaderías Agrupadas confirma ecommerce e Ismael pedidos por WhatsApp, mientras
  La Casa de la Abuela pierde el `no` que no estaba probado. Evidencia acumulada:
  **177 `keep`, 15 `merge` y 9 `purge`**. Los 76 slugs planificados para
  ZG-16–ZG-21 permanecen una sola vez.
- Tras ZG-16 (2026-07-14): las **9 fichas** iniciales quedan en **7 filas**:
  **1 verificada, 6 parciales y 2 purgas por cierre**, con 2 normalizaciones de
  identidad. El snapshot actual es de **249 filas**: **68 `pendiente`, 70
  `parcial`, 111 `verificado`**. Venta provincial: **86 `sí`, 47 `no`, 116 `no
  comprobado`**; ¡Y un rábano! confirma pedido por WhatsApp y los otros seis
  productores conservados no permiten resolver la venta remota. Evidencia
  acumulada: **184 `keep`, 17 `merge` y 11 `purge`**. Agrícola Montejalón se
  trasladó de la identidad ajena de La Almunia a Ricla y Agro-Train CB se
  normalizó a Frutas Agrotrain SL; se renombraron ambas imágenes. La Cooperativa
  del Niño Jesús y Agrolatas salieron por liquidación y extinción oficiales. Los
  67 slugs planificados para ZG-17–ZG-21 permanecen una sola vez.
- Tras ZG-17 (2026-07-14): las **9 fichas** quedan en **3 verificadas y 6
  parciales**, sin bajas y con 3 normalizaciones de identidad o municipio. El
  snapshot actual sigue en **249 filas**: **63 `pendiente`, 73 `parcial`, 113
  `verificado`**. Venta provincial: **86 `sí`, 46 `no`, 117 `no comprobado`**.
  Jumosol acredita ecommerce y Biohuerta pedidos por email y teléfono; esta
  última se corrige de Zaragoza a su huerta de Botorrita con coordenada
  catastral. Alejandro y Miguel se actualiza a la sociedad ZGV y Frutaria deja
  de usar la identidad personal de Ángel Luengo; la imagen de Frutaria se
  renombra. Los dominios inservibles de Ajos del Moncayo, Alium y Fruma se
  retiran sin convertir el fallo técnico en prueba de cierre. Evidencia
  acumulada: **191 `keep`, 20 `merge` y 11 `purge`**. Los 58 slugs planificados
  para ZG-18–ZG-21 permanecen una sola vez.
- Tras ZG-18 (2026-07-14): las **15 fichas** quedan en **11 verificadas y 4
  parciales**, sin bajas y con 3 normalizaciones de identidad o municipio. El
  snapshot actual sigue en **249 filas**: **51 `pendiente`, 74 `parcial`, 124
  `verificado`**. Venta provincial: **91 `sí`, 50 `no`, 108 `no comprobado`**;
  el lote confirma 3 ecommerce, Almendras de Las Pedrosas además por WhatsApp y
  Harinas Polo por email y teléfono. Sémolas Cinco Villas se normaliza a Ebro
  Trigo, Beiker a Dr. Schär y la oficina zaragozana de Brazal a sus arrozales de
  Ejea; se renombra la imagen de Brazal. Evidencia acumulada: **206 `keep`, 23
  `merge` y 11 `purge`**. Los 43 slugs planificados para ZG-19–ZG-21 permanecen
  una sola vez.
- Tras ZG-19 (2026-07-14): las **15 fichas** quedan en **10 verificadas, 3
  parciales y 2 pendientes depuradas**, sin bajas y con una corrección de
  municipio. El snapshot actual sigue en **249 filas**: **41 `pendiente`, 74
  `parcial`, 134 `verificado`**. Venta provincial: **97 `sí`, 50 `no`, 102 `no
  comprobado`**; el lote cierra 8 ecommerce, pedidos por WhatsApp y teléfono en
  Monteciello, Acemar sin venta remota y 5 canales no comprobados. Gardeniers se
  traslada de la antigua dirección del aeropuerto a su obrador de Mercazaragoza
  y Monteciello de la dirección de contacto en Ejea a su finca de Los Pintanos.
  Conservas Jalón y Trufa del Moncayo permanecen pendientes tras retirar datos
  no trazables, sin convertir DNS o ausencia de resultados en inexistencia.
  Evidencia acumulada: **221 `keep`, 24 `merge` y 11 `purge`**. Los 28 slugs
  planificados para ZG-20–ZG-21 permanecen una sola vez.
- Tras ZG-20 (2026-07-14): las **13 fichas** se consolidan en **7 verificadas y
  4 parciales**, con 2 bajas de alcance. El snapshot actual queda en **247
  filas**: **32 `pendiente`, 74 `parcial`, 141 `verificado`**. Venta provincial:
  **101 `sí`, 51 `no`, 95 `no comprobado`**; el lote confirma 4 ecommerce y un
  pedido telefónico, 5 productores sin venta remota y Picarda no comprobada.
  Golden Promise se purga porque fue una marca nómada sin planta zaragozana y
  Hoppy porque es un bar que sirve cerveza de terceros, no un productor.
  Artillera se traslada de la dirección falsa de San Valero a Calle Salvia 1 en
  Empresarium. Evidencia acumulada: **232 `keep`, 24 `merge` y 13 `purge`**.
  Los 15 slugs planificados para ZG-21 permanecen una sola vez.
- Tras ZG-21 (2026-07-14): las **15 fichas** quedan en **14 verificadas y 1
  parcial**, sin bajas ni cambios de slug. El snapshot ordinario cierra en **247
  filas**: **27 `pendiente`, 65 `parcial`, 155 `verificado`**. Venta
  provincial: **104 `sí`, 52 `no`, 91 `no comprobado`**; el lote confirma
  8 ecommerce y el marketplace oficial de Helados Tortosa, 5 productores sin
  pedido remoto y PAM no comprobada por cierre vacacional del checkout hasta el
  27 de julio. Evidencia acumulada: **247 `keep`, 24 `merge` y 13
  `purge`**, exactamente un `keep` por cada fila actual antes de la
  reconciliación transversal.
- Tras ZG-22 (2026-07-14): la reconciliación final reaudita las ocho altas
  concurrentes, conserva siete y retira el almacén de Encinacorba como
  `out-of-scope`. El snapshot definitivo queda en **246 filas**: **27
  `pendiente`, 65 `parcial`, 154 `verificado`**; cada pendiente tiene un
  bloqueo explícito y cada parcial un techo de fuente documentado. Venta
  provincial: **104 `sí`, 52 `no`, 90 `no comprobado`**. Evidencia final:
  **246 `keep`, 24 `merge` y 14 `purge`**, sin decisiones huérfanas ni
  discrepancias con el CSV. Zaragoza se incorpora a
  `data/evidence/coverage.json`.

## Reglas y riesgos locales

1. Consejos de Campo de Borja, Cariñena, Calatayud y figuras agroalimentarias
   confirman solo lo que publican. Un listado sostiene como máximo `parcial` si
   no acredita actividad actual con una fuente verificadora.
2. Separar marca, razón social, sede, tienda y unidad productiva. Las bodegas de
   un mismo grupo pueden ser instalaciones distintas; compartir dominio no es
   un merge automático.
3. Las cooperativas, grandes grupos y fabricantes B2B no se excluyen por tamaño.
   Debe acreditarse elaboración provincial dentro del alcance; distribuidor,
   central comercial o ingrediente industrial sin producto público exige una
   decisión de alcance documentada.
4. En carnicería, charcutería, panadería, café, helados y comercio urbano, una
   tienda no basta: debe constar elaboración propia en la provincia.
5. En huerta, miel, huevos y aceite, un registro de explotación no prueba venta
   pública, actividad actual ni venta remota.
6. Municipio significa unidad productiva, no domicilio social o punto de venta.
   Un cambio material exige corregir slug, imagen y dejar `merge` histórico.
7. Un fallo HTTP, TLS, DNS, bloqueo o timeout no prueba cierre. Purgas y merges
   exigen evidencia suficiente y tombstone en el JSONL.
8. Las coordenadas repetidas parecen en gran parte centroides. Se contrastan,
   pero nunca se usan por sí solas para fusionar entidades.

### Colisiones y alcance prioritarios

- `ajos-de-arandiga-arandiga` y `ajo-y-cerezas-de-arandiga-arandiga` comparten
  teléfono y municipio; resolver si son la misma unidad/marca.
- `bodegas-san-valero-carinena` y `bodegas-gran-ducay-carinena` comparten
  teléfono; aclarar cooperativa, grupo y marca Gran Ducay.
- `aceites-del-isuela-s-c-mesones-de-isuela` y
  `aceites-victoria-ibaceite-brea-de-aragon` comparten teléfono pese a municipios
  distintos; comprobar si el contacto está heredado o si existe relación real.
- `bodegas-ateca-ateca` y `bodegas-morca-borja` comparten dominio y correo de
  Gil Family Estates. Solo se fusionan si no son unidades productivas distintas.
- Revisar expresamente el alcance de Lacasa, Pastas Romero, Pastores, Aragonesa
  de Productos Lácteos, Grupo Delifactory, Cortes Lácteo Industrial y Tereos.

## Fuentes de cotejo

- Web, tienda, red social o ficha Maps gestionada por el productor.
- Consejos reguladores de Campo de Borja, Cariñena, Calatayud, Aceite del Bajo
  Aragón y Melocotón de Calanda, limitando los claims a lo publicado.
- `Pon Aragón en tu mesa`, Gobierno de Aragón, diputación y ayuntamientos como
  apoyo institucional, no como prueba automática de actividad o venta actual.
- Registros sanitarios/ecológicos, fuentes mercantiles y prensa fiable solo para
  contradicciones, cierres, sucesiones, grupos o decisiones de alcance.

## Worklist

Tamaño objetivo: 8–16 filas. ZG-01 resuelve colisiones y alcance antes de que
contaminen los bloques por categoría; ZG-22 es la reconciliación provincial.

| Lote | Alcance | Filas iniciales | Estado | Riesgo principal |
|---:|---|---:|---|---|
| ZG-00 | Higiene, snapshot y partición | 254 | ✅ 2026-07-14 | Contrato/calidad limpios; 254/254 slugs asignados una vez |
| ZG-01 | Colisiones, grupos y alcance industrial | 15→14 | ✅ 2026-07-14 | 11 verificadas, 2 parciales, 1 pendiente y 4 merges |
| ZG-02 | Bodega · Campo de Borja y Moncayo | 12→12 | ✅ 2026-07-14 | 12 verificadas, 8 ecommerce, 4 sin venta online y 2 merges de identidad |
| ZG-03 | Bodega · Cariñena A | 10→10 | ✅ 2026-07-14 | 10 verificadas, 7 ecommerce, 1 pedido por email, 1 sin venta y 1 no comprobada |
| ZG-04 | Bodega · Cariñena B + bodegas fuera de las tres DO | 15→15 | ✅ 2026-07-14 | 13 verificadas, 2 parciales, 5 ventas remotas, 6 sin venta y 1 merge |
| ZG-05 | Bodega · Calatayud | 12→11 | ✅ 2026-07-14 | 11 verificadas, 7 ecommerce, 3 sin venta, 1 no comprobada y 1 merge duplicativo |
| ZG-06 | Aceite · Bajo Aragón y este | 15→12 | ✅ 2026-07-14 | 10 verificadas, 2 parciales, 3 purgas, 4 ecommerce y 1 merge de identidad |
| ZG-07 | Aceite · Cinco Villas y Moncayo | 15→13 | ✅ 2026-07-14 | 8 verificadas, 5 parciales, 2 purgas, 8 ventas remotas y 1 merge de identidad |
| ZG-08 | Aceite · Zaragoza, Cariñena y Jalón | 8→8 | ✅ 2026-07-14 | 3 verificadas, 3 parciales, 2 pendientes, 3 ecommerce y 2 merges de identidad |
| ZG-09 | Miel A | 11→11 | ✅ 2026-07-14 | 5 verificadas, 3 parciales, 3 pendientes, 5 ventas remotas y 1 merge de identidad |
| ZG-10 | Miel B | 11→11 | ✅ 2026-07-14 | 4 verificadas, 7 parciales, 3 ecommerce, 5 sin venta y 3 no comprobadas |
| ZG-11 | Lácteos y quesos | 16→15 | ✅ 2026-07-14 | 7 verificadas, 2 parciales, 6 pendientes depuradas, 1 cierre y 2 ecommerce |
| ZG-12 | Charcutería A | 9→8 | ✅ 2026-07-14 | 4 verificadas, 2 parciales, 2 pendientes depuradas, 1 comercio de otra provincia y 3 ventas remotas |
| ZG-13 | Charcutería B | 9→8 | ✅ 2026-07-14 | 2 parciales, 6 pendientes depuradas, 1 secadero de otra provincia y 1 pedido telefónico |
| ZG-14 | Pan y pastelería A | 10→9 | ✅ 2026-07-14 | 6 verificadas, 1 parcial, 2 pendientes depuradas, 1 productor de otra provincia y 7 ventas remotas |
| ZG-15 | Pan y pastelería B | 10→10 | ✅ 2026-07-14 | 2 verificadas, 5 parciales, 3 pendientes depuradas y 2 ventas remotas con canal |
| ZG-16 | Fruta y verdura A | 9→7 | ✅ 2026-07-14 | 1 verificada, 6 parciales, 2 cierres, 1 pedido por WhatsApp y 2 merges de identidad |
| ZG-17 | Fruta y verdura B | 9→9 | ✅ 2026-07-14 | 3 verificadas, 6 parciales, 2 ventas remotas con canal y 3 merges de identidad o municipio |
| ZG-18 | Frutos secos, cereales y arroz | 15→15 | ✅ 2026-07-14 | 11 verificadas, 4 parciales, 5 ventas remotas y 3 merges |
| ZG-19 | Conservas, encurtidos y trufa | 15→15 | ✅ 2026-07-14 | 10 verificadas, 3 parciales, 2 pendientes depuradas, 9 ventas remotas y 1 merge territorial |
| ZG-20 | Huevos y cerveza | 13→11 | ✅ 2026-07-14 | 7 verificadas, 4 parciales, 2 purgas de alcance y 5 ventas remotas |
| ZG-21 | Café, chocolate, vermut, despensa, helados y licores | 15→15 | ✅ 2026-07-14 | 14 verificadas, 1 parcial, 8 ecommerce y 1 marketplace |
| ZG-22 | Reconciliación y puerta final | residual | ✅ 2026-07-14 | Pendientes justificados; dedup, geo, enlaces, ventas, candidatos, imágenes y puerta final |

## Alcance exacto

### ZG-01 · Colisiones, grupos y alcance industrial (15)

- `ajos-de-arandiga-arandiga`
- `ajo-y-cerezas-de-arandiga-arandiga`
- `bodegas-san-valero-carinena`
- `bodegas-gran-ducay-carinena`
- `aceites-del-isuela-s-c-mesones-de-isuela`
- `aceites-victoria-ibaceite-brea-de-aragon`
- `bodegas-ateca-ateca`
- `bodegas-morca-borja`
- `chocolates-lacasa-utebo`
- `pastas-romero-daroca`
- `pastores-grupo-cooperativo-zaragoza`
- `aragonesa-productos-lacteos-zaragoza`
- `grupo-delifactory-zaragoza`
- `cortes-lacteo-industrial-utebo`
- `harinas-tereos-zaragoza`

### ZG-02 · Bodega · Campo de Borja y Moncayo (12)

- `bodegas-ruberte-magallon`
- `bodegas-aragonesas-fuendejalon`
- `bodegas-borsao-borja`
- `bodegas-palmeri-sicilia-tabuenca`
- `bodegas-alto-moncayo-pozuelo-de-aragon`
- `bodega-santo-cristo-ainzon`
- `cooperativa-san-juan-bautista-fuendejalon`
- `bodegas-roman-bulbuente`
- `pagos-del-moncayo-vera-de-moncayo`
- `bodegas-cabal-ainzon`
- `bodega-vinos-del-viento-pozuelo-de-aragon`
- `bodega-picos-magallon`

### ZG-03 · Bodega · Cariñena A (10)

- `bodega-pago-ayles-mezalocha`
- `bodega-frontonio-almonacid-de-la-sierra`
- `bodegas-paniza-paniza`
- `bodegas-solar-de-urbezo-carinena`
- `bodegas-ignacio-marin-carinena`
- `bodegas-covinca-almonacid-de-la-sierra`
- `bodega-esteban-martin-alfamen`
- `bodegas-care-carinena`
- `bodem-bodegas-almonacid-de-la-sierra`
- `hacienda-molleda-tosos`

### ZG-04 · Bodega · Cariñena B y otras zonas (15)

- `libre-y-salvaje-almonacid-de-la-sierra`
- `dominio-de-longaz-carinena`
- `bodega-familia-navascues-almonacid`
- `bodegas-manuel-moneva-almonacid`
- `vinedos-y-bodegas-pablo-gran-viu-almonacid`
- `bodegas-luis-marin-carinena`
- `bodega-vignius-ignius-almonacid`
- `bodega-heredad-anson-muel`
- `bodega-romeo-yrisarri-carinena`
- `bodega-roberto-zazurca-almonacid`
- `el-corral-del-tio-nicasio-castejon-de-valdejasa`
- `bodegas-tempore-lecera`
- `bodega-senorio-de-cinco-villas-biota`
- `bodegas-ejeanas-ejea-de-los-caballeros`
- `bodegas-pegalaz-santa-eulalia-de-gallego`

### ZG-05 · Bodega · Calatayud (12)

- `bodegas-langa-calatayud`
- `bodegas-san-alejandro-miedes-de-aragon`
- `bodega-vinae-mureri-murero`
- `bodegas-sommos-garnacha-murero`
- `bodega-virgen-de-la-sierra-villarroya-de-la-sierra`
- `bodegas-augusta-bilbilis-mara`
- `raices-ibericas-maluenda`
- `bodegas-san-gregorio-cervera-de-la-canada`
- `colas-viticultores-alhama-de-aragon`
- `bodegas-agustin-cubero-calatayud`
- `bodega-la-cerrada-vinos-atrevidos-calatayud`
- `bodegas-esteban-castejon-ibdes`

### ZG-06 · Aceite · Bajo Aragón y este (15)

- `almazara-molino-alfonso-belchite`
- `almazara-de-sastago-sastago`
- `almazara-la-olivera-maella`
- `aceite-oribel-cooperativa-san-martin-belchite`
- `aceites-alcaniz-millan-moli-de-casto-maella`
- `aceites-marco-sl-caspe`
- `aceites-sanz-caspe`
- `aceites-y-almendras-delpont-maella`
- `almazara-de-jaime-sl-aceites-ajd-belchite`
- `cooperativa-agricola-san-lorenzo-maella`
- `almazara-gil-egerique-maella`
- `cooperativa-del-campo-san-isidro-fabara`
- `granja-brunet-fabara`
- `cooperativa-fruticola-compromiso-de-caspe`
- `cooperativa-agraria-san-sebastian-fayon`

### ZG-07 · Aceite · Cinco Villas y Moncayo (15)

- `oliambel-bulbuente`
- `aceite-agustin-fornos-trasmoz`
- `almazara-de-la-cooperativa-de-borja-borja`
- `aceites-sierra-del-moncayo-tarazona`
- `almazara-cooperativa-san-pedro-apostol-tabuenca`
- `aceite-as-de-segia-ejea-de-los-caballeros`
- `aceite-de-oliva-virgen-extra-anso-tauste`
- `aceite-monteolivet-bardenas`
- `aceite-olitaus-tauste`
- `aceite-olivalia-bardenas-solar-ejea-de-los-caballeros`
- `aceites-alia-ejea-de-los-caballeros`
- `aceites-tezar-borja`
- `cooperativa-agraria-nuestra-senora-del-pilar-novallas`
- `lafi-biolivos-ejea-de-los-caballeros`
- `trujal-la-veronica-tarazona`

### ZG-08 · Aceite · Zaragoza, Cariñena y Jalón (8)

- `olivaria-zaragoza`
- `almazara-san-pedro-botorrita`
- `almazara-de-carinena-carinena`
- `aceites-lis-la-almunia-de-dona-godina`
- `aceite-arbara-luceni`
- `aceites-josa-s-c-la-almunia-de-dona-godina`
- `agroalimentos-la-redonda-s-a-la-almunia-de-dona-godina`
- `almazara-aninon-aninon`

### ZG-09 · Miel A (11)

- `apicola-cinco-villas-ejea-de-los-caballeros`
- `jalea-de-luz-monegrillo`
- `miel-de-zuera-zuera`
- `miel-la-mieleria-almonacid-de-la-sierra`
- `miel-del-moncayo-vera-de-moncayo`
- `mieles-del-cierzo-ambel`
- `casa-alberdi-monterde`
- `miel-lares-ariza`
- `mayestra-miel-ainzon`
- `apihuecha-borja`
- `miel-el-albar-lechon`

### ZG-10 · Miel B (11)

- `miel-la-galinda-mequinenza`
- `miel-montereal-la-muela`
- `miel-mil-gotas-el-frago`
- `apicola-cortes-ores`
- `abejas-de-candido-ejea-de-los-caballeros`
- `agustin-pellicer-ambel`
- `angel-sancho-lumbreras-tabuenca`
- `colmenar-el-romeral-tauste`
- `miel-sierra-de-luna-sierra-de-luna`
- `miel-de-los-banales-layana`
- `miel-del-tio-juan-cruz-fuendejalon`

### ZG-11 · Lácteos y quesos (16)

- `queseria-de-biota-biota`
- `quesos-artesanos-de-letux-letux`
- `quesos-galindo-andres-arandiga`
- `quesos-la-pardina-zaragoza`
- `queseria-el-acebo-trasmoz`
- `quesos-de-el-burgo-el-burgo-de-ebro`
- `quesos-villa-de-sastago-sastago`
- `lacteos-de-chiapa-daroca`
- `quesos-omelette-de-cabra-zaragoza`
- `quesos-los-arcos-caspe`
- `lacteos-torreconde-zaragoza`
- `quesos-artesanos-villamayor-villamayor-de-gallego`
- `quesos-diarte-langa-del-castillo`
- `epulae-monegros-monegrillo`
- `agerca-tauste`
- `inversiones-michelac-el-burgo-de-ebro`

### ZG-12 · Charcutería A (9)

- `carnicas-gonzalez-romero-ariza`
- `carniceria-lapena-fuentes-de-ebro`
- `casa-de-ganaderos-zaragoza`
- `embutidos-la-tellana-borja`
- `hermanos-casabona-fuentes-de-ebro`
- `carniceria-melsa-zaragoza-zaragoza`
- `carniceria-jesus-ignacio-mainar-carinena`
- `embutidos-muro-el-buste`
- `carnes-y-embutidos-ibanez-ejea-de-los-caballeros`

### ZG-13 · Charcutería B (9)

- `embutidos-de-la-ribera-alagon`
- `carniceria-salillas-zaragoza`
- `charcuteria-el-tubo-zaragoza`
- `secadero-de-jamones-alto-aragon-zaragoza`
- `carnes-selectas-el-moncayo-tarazona`
- `embutidos-el-cortijo-calatayud`
- `carniceria-hermanos-royo-daroca`
- `q-carne-lecera`
- `carnes-garcia-ejea-de-los-caballeros`

### ZG-14 · Pan y pastelería A (10)

- `panaderia-julio-y-yolanda-sadaba`
- `panaderia-sin-gluten-el-trasmozero-trasmoz`
- `ecomonegros-lecinena`
- `pastelerias-manuel-segura-daroca`
- `pasteleria-fantoba-zaragoza`
- `pasteleria-micheto-calatayud`
- `pasteleria-lalmolda-zaragoza`
- `panaderia-sayon-zaragoza`
- `panaderia-lartisana-zaragoza`
- `confiteria-las-almas-zaragoza`

### ZG-15 · Pan y pastelería B (10)

- `dulces-la-pasion-utebo`
- `panaderia-reposteria-sanz-ateca`
- `pasteleria-los-mallos-zaragoza`
- `horno-de-sos-del-rey-catolico-sos-del-rey-catolico`
- `angel-bravo-gelsa`
- `antigua-casa-cortes-monegrillo`
- `antonio-isasa-e-hijos-panaderia-reposteria-tauste-tauste`
- `la-casa-de-la-abuela-pina-de-ebro`
- `panaderias-agrupadas-de-caspe-caspe`
- `horno-de-reposteria-ismael-zaragoza`

### ZG-16 · Fruta y verdura A (9)

- `las-cardelinas-pinsoro`
- `melada-huerta-saludable-movera`
- `jalon-nature-lumpiaque`
- `cooperativa-del-nino-jesus-aninon`
- `finca-la-corona-fuentes-de-ebro`
- `y-un-rabano-tarazona`
- `agricola-montejalon-la-almunia-de-dona-godina`
- `agro-train-cb-ricla`
- `agrolatas-s-l-figueruelas`

### ZG-17 · Fruta y verdura B (9)

- `ajos-del-moncayo-s-c-la-almunia-de-dona-godina`
- `ajos-verdes-el-sixto-s-c-ricla`
- `alejandro-y-miguel-s-c-nonaspe`
- `alium-aragon-s-l-bardallur`
- `angel-luengo-martinez-frutaria-frutas-el-cachirulo-alagon`
- `jumosol-fuentes-de-ebro`
- `biohuerta-zaragoza-zaragoza`
- `fruticola-maellana-fruma-maella`
- `la-chipranesca-chiprana`

### ZG-18 · Frutos secos, cereales y arroz (15)

- `nueces-ramon-puyod-ejea-de-los-caballeros`
- `almendras-de-las-pedrosas-las-pedrosas`
- `amandolas-almendras-belchitanas-belchite`
- `naturapistacho-quinto`
- `frutos-secos-del-jalon-cosuenda`
- `tostadero-la-baturrica-fuentes-de-ebro`
- `molino-ecotambo-sadaba`
- `semolas-cinco-villas-tauste`
- `harinas-azagra-mallen`
- `beiker-alagon`
- `aragon-sin-gluten-santa-engracia`
- `harinas-polo-villanueva-de-gallego`
- `harinas-de-la-parra-epila`
- `arroz-brazal-zaragoza`
- `arroz-de-valarena-ejea-de-los-caballeros`

### ZG-19 · Conservas, encurtidos y trufa (15)

- `conservas-lores-bureta`
- `la-mar-de-sabor-caspe`
- `conservas-jalon-la-almunia-de-dona-godina`
- `conservas-gardeniers-zaragoza`
- `la-conservera-del-prepirineo-uncastillo`
- `de-molina-artesania-alimentaria-caspe`
- `aceitunas-muniente-caspe`
- `aceitunas-y-encurtidos-sarinena-s-c-chiprana`
- `acemar-caspe`
- `diamante-negro-del-moncayo-vera-del-moncayo`
- `foresta-algairen-calatorao`
- `trufa-del-moncayo-tarazona`
- `a-trufa-fresca-tabuenca`
- `trufafusion-aragon-lechon`
- `trufa-negra-monteciello-ejea-de-los-caballeros` → `trufa-negra-monteciello-los-pintanos`

### ZG-20 · Huevos y cerveza (13)

- `avicola-torre-jirauta-penaflor-de-gallego`
- `camperos-los-corrales-epila`
- `huevos-camperos-valdelobos-biota`
- `granja-virgen-del-olivar-lecera`
- `venta-las-canadas-villarreal-de-huerva`
- `cierzo-brewing-caspe`
- `la-zaragozana-ambar-zaragoza`
- `cervezas-artillera-zaragoza`
- `cerveza-golden-promise-zaragoza`
- `cerveza-hoppy-zaragoza`
- `bieras-ordio-la-puebla-de-alfinden`
- `picarda-cerveza-artesana-mequinenza`
- `cervezas-garba-lumpiaque`

### ZG-21 · Café, chocolate, vermut, despensa, helados y licores (15)

- `cafes-el-criollo-zaragoza`
- `pam-coffee-roasters-zaragoza`
- `onawa-coffee-zaragoza`
- `cafes-el-tostadero-cuarte-de-huerva`
- `chocolates-atienza-ateca`
- `chocolates-caro-terrer`
- `chocolates-nakoa-utebo`
- `turmeon-vermut-de-bodegas-jaime-morata-de-jalon`
- `bodegas-valdepablo-terrer`
- `ecolecera-lecera`
- `mermeladas-la-vicora-sediles`
- `pasta-libertina-zaragoza`
- `helados-tortosa-zaragoza`
- `heladeria-artecass-ejea-de-los-caballeros`
- `destilerias-san-valero-carinena`

## Flujo por lote

1. Confirmar que el worktree no contiene cambios ajenos sobre Zaragoza.
2. Leer solo las filas y evidencia del lote; comparar nombre, dominio, teléfono,
   correo, dirección, coordenadas, razón social y grupo para duplicados.
3. Investigar exclusiones, identidad, actividad, municipio y propiedad de los
   enlaces. Auditar venta online de forma independiente y detenerse al alcanzar
   evidencia suficiente.
4. Editar CSV y JSONL solo para los slugs del lote. Eliminar o renombrar activos
   únicamente al purgar, fusionar o corregir un slug.
5. Reconciliar `verificacion`, `Venta online` y `Canal de venta` entre CSV y
   evidencia. Actualizar Estado, Worklist y el registro de avance.
6. Ejecutar `npx pnpm check:csv:changed`, `npx pnpm check:evidence`,
   `npx pnpm check:evidence:changed` y `git diff --check`; revisar el diff
   acotado a Zaragoza antes de continuar.

## Registro de avance

| Lote | Fecha | Resultado | Validación |
|---|---|---|---|
| ZG-00 | 2026-07-14 | Snapshot inicial, riesgos y partición exacta de 254 filas en 21 lotes | CSV sin cambios; contrato/calidad de Zaragoza OK |
| ZG-01 | 2026-07-14 | 11 verificadas, 2 parciales, 1 pendiente documentada y 4 merges | CSV + evidence + images + data quality OK |
| ZG-02 | 2026-07-14 | 12 verificadas, 8 ecommerce, 4 sin venta online y 2 merges de identidad | CSV + evidence + images + data quality OK |
| ZG-03 | 2026-07-14 | 10 verificadas, 8 ventas remotas, 1 sin venta, 1 no comprobada y 2 merges | CSV + evidence + images + geo override + data quality OK |
| ZG-04 | 2026-07-14 | 13 verificadas, 2 parciales, 5 ventas remotas, 6 sin venta y 1 merge | CSV + evidence + images + data quality OK |
| ZG-05 | 2026-07-14 | 12 fichas consolidadas en 11 verificadas; 7 ecommerce, 3 sin venta y 1 no comprobada | CSV + evidence + images + data quality OK |
| ZG-06 | 2026-07-14 | 10 verificadas, 2 parciales, 3 purgas, 4 ecommerce, 4 sin venta y 1 merge | CSV + evidence + images + data quality OK |
| ZG-07 | 2026-07-14 | 8 verificadas, 5 parciales, 2 purgas, 6 ecommerce, 2 pedidos por contacto y 1 merge | CSV + evidence + images + data quality OK |
| ZG-08 | 2026-07-14 | 3 verificadas, 3 parciales, 2 pendientes, 3 ecommerce y 2 normalizaciones de identidad | CSV + evidence + images + data quality OK |
| ZG-09 | 2026-07-14 | 5 verificadas, 3 parciales, 3 pendientes, 5 ventas remotas y 1 merge | CSV + evidence + images + data quality OK |
| ZG-10 | 2026-07-14 | 4 verificadas, 7 parciales, 3 ecommerce, 5 sin venta y 3 no comprobadas | CSV + evidence + images + data quality OK |
| ZG-11 | 2026-07-14 | 7 verificadas, 2 parciales, 6 pendientes depuradas, 1 cierre y 2 ecommerce | CSV + evidence + images + data quality OK |
| ZG-12 | 2026-07-14 | 4 verificadas, 2 parciales, 2 pendientes depuradas, 1 purga territorial y 3 ventas remotas | CSV + evidence + images + data quality OK |
| ZG-13 | 2026-07-14 | 2 parciales, 6 pendientes depuradas, 1 purga territorial y 1 pedido telefónico | CSV + evidence + images + data quality OK |
| ZG-14 | 2026-07-14 | 6 verificadas, 1 parcial, 2 pendientes depuradas, 1 purga territorial y 7 ventas remotas | CSV + evidence + images + data quality OK |
| ZG-15 | 2026-07-14 | 2 verificadas, 5 parciales, 3 pendientes depuradas y 2 ventas remotas con canal | CSV + evidence + images + data quality OK |
| ZG-16 | 2026-07-14 | 1 verificada, 6 parciales, 2 cierres, 1 pedido por WhatsApp y 2 normalizaciones de identidad | CSV + evidence + images + data quality OK |
| ZG-17 | 2026-07-14 | 3 verificadas, 6 parciales, 2 ventas remotas con canal y 3 merges de identidad o municipio | CSV + evidence + images + data quality OK |
| ZG-18 | 2026-07-14 | 11 verificadas, 4 parciales, 5 ventas remotas con canal y 3 merges de identidad o municipio | CSV + evidence + images + data quality OK |
| ZG-19 | 2026-07-14 | 10 verificadas, 3 parciales, 2 pendientes depuradas, 9 ventas remotas con canal y 1 merge territorial | CSV + evidence + images + data quality OK |
| ZG-20 | 2026-07-14 | 7 verificadas, 4 parciales, 2 purgas de alcance, 4 ecommerce y 1 pedido telefónico | CSV + evidence + images + data quality OK |
| ZG-21 | 2026-07-14 | 14 verificadas, 1 parcial, 8 ecommerce, 1 marketplace, 5 sin venta y 1 no comprobada | CSV + evidence + images + data quality OK |
| ZG-22 | 2026-07-14 | 246 filas reconciliadas; 246 keep, 24 merge, 14 purge; 1 almacén concurrente retirado | Cobertura estricta + verify:data + diff final OK |

### Hallazgos ZG-01

- `ajo-y-cerezas-de-arandiga-arandiga` era una segunda redacción de Ajo de
  Arándiga con el mismo teléfono, dirección, productores y productos; se fusionó
  en `ajos-de-arandiga-arandiga` y la ficha queda parcial por techo institucional.
- Bodega San Valero y Bodega Gran Ducay comparten cooperativa y ecommerce, pero
  la segunda es una instalación específica para cava creada en 1984; se mantienen
  ambas con identidad diferenciada.
- El teléfono heredado de Aceites del Isuela pertenece inequívocamente a
  Aceites Victoria en Brea de Aragón. Se retiró de la primera, que queda parcial,
  y se verificó la segunda con su tienda oficial.
- Bodegas Ateca y Bodegas Morca son instalaciones productivas distintas de Gil
  Family en Ateca y Borja; comparten tienda oficial, no identidad productiva.
- Las correcciones `grupo-delifactory-zaragoza` → `grupo-delifactory-utebo`,
  `cortes-lacteo-industrial-utebo` → `helados-lic-utebo` y
  `harinas-tereos-zaragoza` → `tereos-zaragoza` incluyen merge e imagen.
- `aragonesa-productos-lacteos-zaragoza` tiene existencia y objeto social
  registrados, pero no evidencia pública de actividad productora efectiva ni
  municipio productivo; su `pendiente` es un residual deliberado a reauditar en
  ZG-22, no una promoción artificial a `parcial`.

### Hallazgos ZG-02

- Bodegas Ruberte, Aragonesas, Borsao, Palmeri Sicilia, Alto Moncayo, Bodegas
  Ainzón, Pagos del Moncayo y Cabal mantienen tiendas propias con producto,
  precio y carrito; las ocho ventas positivas quedan clasificadas como
  `ecommerce`.
- La web oficial sitúa inequívocamente Bodegas Alto Moncayo en la CV-606
  Borja-El Buste, término de Borja. Se aplicó
  `bodegas-alto-moncayo-pozuelo-de-aragon` → `bodegas-alto-moncayo-borja` con
  contacto, coordenadas, imagen y tombstone actualizados.
- Crianzas y Viñedos Santo Cristo conserva esa razón social, pero se presenta
  y vende públicamente como Bodegas Ainzón. Se normalizó
  `bodega-santo-cristo-ainzon` → `bodegas-ainzon-ainzon` sin duplicar la unidad.
- San Juan Bautista elabora en Fuendejalón y Bodegas Aragonesas, de la que es
  accionista mayoritaria, embotella sus vinos; su canal colectivo marca
  expresamente Don Ramón como no disponible online. Bodegas Román, Vinos del
  Viento y Picos tampoco ofrecen mecanismo de pedido remoto tras revisar sus
  canales oficiales, por lo que las cuatro quedan con `Venta online=no`.
- El dominio `.es` heredado de Bodegas Cabal está aparcado; la web oficial
  vigente es `bodegascabalarcega.com`, con elaboración en Ainzón y ecommerce.
  Bodega Picos sí publica una web oficial actual por HTTP con pie 2026; el fallo
  de HTTPS es técnico y ya no limita su verificación.

### Hallazgos ZG-03

- Pago Aylés admite pedidos mediante el email publicado en su contacto oficial;
  las tiendas de Frontonio, Paniza, Ignacio Marín, Esteban Martín, Care, Bodem y
  Hacienda Molleda tienen producto y mecanismo de compra actuales. Los ocho
  positivos quedan con canal explícito.
- La identidad y ubicación oficiales obligaron a corregir
  `bodega-frontonio-almonacid-de-la-sierra` → `bodegas-frontonio-alpartir` y
  `bodegas-covinca-almonacid-de-la-sierra` → `bodegas-covinca-longares`. Ambos
  cambios conservan tombstone; la imagen de Covinca se renombró.
- La tienda oficial de Covinca declara expresamente que actualmente no dispone
  de venta al público. Los enlaces comerciales antiguos no se usaron para
  sostener ecommerce y la ficha queda con `Venta online=no`.
- Solar de Urbezo publica actividad, catálogo y contacto actuales. Una página
  indexada menciona tienda 24 horas, pero el canal no respondió y el subdominio
  de tienda no resolvió; se mantuvo `no comprobado` conforme a la regla de que
  un fallo técnico no demuestra ni venta vigente ni cierre.
- La normalización de municipios hacía colisionar Longares con Longás. El
  override de Aragón usa el centro correcto de Longares y elimina el falso
  bloqueo de 121 km sin falsear las coordenadas del productor.

### Hallazgos ZG-04

- El Corral del Tío Nicasio, Tempore y Bodegas Ejeanas mantienen ecommerce
  operativo. Heredad Ansón admite pedidos por email y teléfono, y Pegalaz envía
  previo pago mediante pedidos por WhatsApp, email o teléfono aunque su tienda
  web siga en construcción.
- Señorío de Cinco Villas publica elaboración y embotellado propios en Biota,
  pero «La Botillería» es una tienda física de Ejea y el sitio no ofrece pedido
  remoto; se corrigió el `sí` heredado a `no`. Dominio de Longaz, Manuel Moneva,
  Gran Viu, Luis Marín e IGnius tampoco ofrecen mecanismo remoto tras revisar
  sus navegaciones oficiales.
- Los fallos HTTPS de IGnius y Heredad Ansón no eran cierres: ambos sitios
  oficiales responden por HTTP. Esto permitió verificar las dos bodegas y
  descubrir el pedido remoto de Heredad Ansón. Libre y Salvaje queda verificada
  por identidad y actividad, pero su venta permanece `no comprobado` porque el
  certificado impidió auditar el canal completo.
- Se normalizó `bodega-vignius-ignius-almonacid` →
  `vinos-ignius-almonacid-de-la-sierra`, eliminando la identidad redundante y el
  municipio abreviado; conserva tombstone y no tenía imagen que renombrar.
- Romeo Yrisarri y Roberto Zazurca conservan `parcial`: el consejo regulador los
  mantiene, pero no publican fuente propia actual. Familia Navascués sí mantiene
  `verificado` con bodega propia desde 2025, aunque su web actual solo expone el
  correo y no permite resolver la venta remota.

### Hallazgos ZG-05

- Vinae Mureri no era una segunda bodega vigente: Grupo Costa adquirió esa
  instalación de Murero y la identidad actual es Bodega SOMMOS Garnacha. Se
  fusionó `bodega-vinae-mureri-murero` en
  `bodegas-sommos-garnacha-murero`, actualizando dirección, contacto, vinos y
  web; no había imagen que renombrar.
- San Alejandro, SOMMOS Garnacha, Virgen de la Sierra, Augusta Bílbilis, Raíces
  Ibéricas, La Cerrada y Esteban Castejón mantienen tiendas propias con producto,
  precio y carrito; las siete ventas quedan como ecommerce.
- La tienda de San Gregorio está expresamente en mantenimiento y todos los vinos
  figuran sin stock. El `sí` heredado pasó a `no comprobado`, sin interpretar una
  interrupción temporal como cierre del canal.
- Langa, Agustín Cubero y Colás Viticultores publican actividad, catálogo y
  contacto actuales, pero no pedido directo. Colás enlaza vinotecas
  independientes, que no cuentan como venta del productor; las tres quedan en
  `no`.
- Se corrigieron dirección y contacto de San Alejandro, SOMMOS Garnacha, Langa,
  Raíces Ibéricas y Esteban Castejón. En esta última, el código postal heredado
  50269 era incorrecto: sus condiciones de venta sitúan el almacén en calle
  Portada 13, 50236 Ibdes.

### Hallazgos ZG-06

- `almazara-de-sastago-sastago` y `almazara-la-olivera-maella` eran identidades
  genéricas sin rastro empresarial fiable, con dominios inexistentes y ausentes
  del censo vigente y exhaustivo de la DOP Aceite del Bajo Aragón. Se purgaron
  como fichas no demostradas, no por el simple fallo de sus webs.
- Aceites Marco SL consta disuelta y extinguida por acuerdo voluntario publicado
  en el BORME de 14 de enero de 2026. La ficha se purgó con tombstone específico
  de cierre.
- Almazara de Jaime mantiene instalación y marca en Belchite, pero el operador
  actual es Aceites de Belchite SL, constituido en octubre de 2025. Se corrigió
  `almazara-de-jaime-sl-aceites-ajd-belchite` →
  `almazara-de-jaime-aceites-de-belchite-belchite`, con merge, imagen y tienda.
- Molino Alfonso, Oribel, Aceites de Belchite y Magalia mantienen ecommerce con
  producto, precio y mecanismo de compra. Olivest/Delpont afirma «comprar
  online», pero su web funciona como catálogo sin pedido utilizable; se conserva
  `no comprobado` en vez de convertir una frase promocional en venta positiva.
- Olivest 1976 conserva la ficha de Maella: su unidad productiva figura allí en
  fuentes mercantiles e institucionales actuales, mientras Torre del Compte es
  el contacto comercial publicado. Alcañiz Millán/Molí de Casto y Aceites Sanz
  también quedan sin decisión de venta remota por falta de mecanismo concluyente.
- Gil Egerique, la Cooperativa San Isidro de Fabara, Granja Brunet y FRUCAS
  publican actividad y contacto actuales, pero sus canales oficiales no ofrecen
  pedido remoto; quedan con `Venta online=no`. San Sebastián de Fayón conserva
  `parcial` por techo del listado DOP actual, sin fuente propia verificadora.

### Hallazgos ZG-07

- Oliambel, Agustín Fornós, Monteolivet, San Marcial de Novallas, Lafi Biolivos
  y Trujal La Verónica mantienen tiendas propias con producto, precio y carrito.
  As de Segia admite pedido telefónico y Aceites Alía venta directa por teléfono
  o email según el directorio territorial; no se conservó la antigua mención a
  una tienda online de Alía porque su web 2026 ya no tiene ecommerce.
- `almazara-de-la-cooperativa-de-borja-borja` se normalizó a
  `sociedad-cooperativa-agricola-de-borja-borja`, la identidad pública actual.
  Su web oficial y la DOP confirman aceite y almazara, pero solo ofrecen contacto,
  no pedido remoto; el cambio conserva tombstone y no había imagen asociada.
- `aceites-sierra-del-moncayo-tarazona` atribuía a una empresa inexistente el
  nombre de la DOP. El roster vigente identifica los cinco promotores reales y
  no esa entidad; dominio, correo, teléfono y dirección tampoco son trazables.
  La supuesta Cooperativa San Pedro Apóstol de Tabuenca presenta el mismo patrón
  de identidad genérica, dominio inexistente y cero rastro empresarial. Ambas se
  purgaron por inexistencia demostrada en conjunto, no por un fallo web aislado.
- Olitaus sigue activo: una actividad institucional de abril de 2025 lo vincula
  a la Cooperativa San Simón y San Judas de Tauste. Olivalia conserva producto y
  explotación de Ejea, pero su fuente propia no actualiza contenido desde 2013.
  Ambos quedan `parcial` y sin venta remota tras revisar web y puntos físicos.
- Aceite Ansó queda `parcial` y `no comprobado`: el directorio comarcal mantiene
  el producto y SAT Ansó confirma operador y planta en Tauste, pero su web actual
  solo desarrolla el negocio de alfalfa. Aceites Tezar también queda parcial por
  techo empresarial/sectorial, sin canal propio que resuelva la venta remota.
- Las coordenadas de Monteolivet proceden del mapa embebido en su web oficial.
  Para Aceites Alía se usó una ubicación honesta dentro del polígono Valdeferrín,
  respaldado además por la autorización pública de su planta de aceite.

### Hallazgos ZG-08

- Aceites Lis, Arbara y Agroalimentos La Redonda confirman en sus webs actuales
  elaboración propia y tiendas operativas. En Lis se corrigieron dirección,
  teléfono y coordenadas con su página de contacto; Arbara y La Redonda usan el
  centroide municipal honesto porque sus fuentes publican la finca rural pero no
  coordenadas exactas.
- `agroalimentos-la-redonda-s-a-la-almunia-de-dona-godina` codificaba una forma
  jurídica incorrecta. Se normalizó a
  `agroalimentos-la-redonda-s-l-la-almunia-de-dona-godina`, con tombstone e
  imagen renombrada. La web propia confirma almazara en la finca de La Almunia y
  ecommerce con productos disponibles.
- La almazara local de Aniñón fue reactivada por José Manuel Sebastián en la
  campaña 2025/2026 y adopta el nombre Virgen del Castillo. Se fusionó la
  identidad genérica anterior en `almazara-virgen-del-castillo-aninon`, situada
  en el antiguo molino de la cooperativa Niño Jesús; queda `parcial` por techo
  de prensa/directorio y con venta remota no comprobada.
- Finca Olivaria sigue constando en el RSA 2026 como Agroindustrial Ayerbe,
  explotación agrícola y oleoturística de La Cartuja Baja. La producción de
  aceite depende de fuentes anteriores y su dominio está aparcado, por lo que
  queda parcial y sin decisión positiva de venta.
- Aceites Josa/SAT Valle del Jalón conserva rastro actual como almazara de La
  Almunia, pero su dominio responde con error 500 y las menciones secundarias de
  reparto no bastan para acreditar un pedido vigente. Queda parcial y `no
  comprobado`.
- Almazara San Pedro de Botorrita y Almazara de Cariñena no tienen identidad,
  contacto ni ubicación corroborables; ambos dominios atribuidos carecen de DNS.
  Se retiraron del CSV los detalles no trazables y permanecen pendientes: la
  ausencia de resultados no basta para purgar. En Cariñena también se eliminó la
  falsa atribución de una DOP de aceite; el registro oficial de Cariñena ampara
  vino.

### Hallazgos ZG-09

- Apícola Cinco Villas, Jalea de Luz, Lares Miel y Mayestra Miel confirman en
  sus webs propias actividad productora, municipio y ecommerce operativo.
  Jalea actualizó dirección y teléfono; Mayestra se normalizó desde el nombre
  heredado «Miel de Mayestra» al nombre público `mayestra-miel-ainzon`, con
  tombstone y sin imagen asociada.
- Mieles del Cierzo queda `verificado` por su web propia de 2026 y su dirección
  de Ambel. La portada conserva precios y mensajes de envío, pero la tienda y
  las fichas de producto declaran que aún está en obras y no permiten un pedido
  utilizable; prevalece `Venta online=no`. Sus coordenadas son el centroide
  municipal honesto.
- Casa Alberdi queda `parcial` por techo institucional, pero el directorio
  vigente especifica pedidos por correo o móvil, por lo que mantiene venta
  remota por `email|telefono`. Apihuecha y Miel El Albar también quedan
  parciales: la primera por dos directorios coincidentes y la segunda por el
  registro aragonés de artesanía alimentaria y Pon Aragón en tu mesa; ninguna
  demuestra hoy un canal remoto propio.
- Miel de Zuera, Miel La Mielería y Miel del Moncayo no tienen identidad,
  contacto, dirección o dominio corroborables. Se retiraron todos los detalles
  especulativos —incluidos un teléfono de prueba y un CP incorrecto—, pero
  sobreviven como `pendiente` porque DNS fallido, homónimos y ausencia de rastro
  no prueban inexistencia.
- Durante el lote aparecieron ocho filas concurrentes al final del CSV, sin
  evidencia: `santa-ana-crianzas-y-vinedos-pozuelo-de-aragon`,
  `bodegas-y-vinedos-monfil-carinena`, `bodegas-hermanos-torcal-carinena`,
  `bodegas-valdegarzon-almonacid-de-la-sierra`,
  `bodegas-del-senorio-almonacid-de-la-sierra`, `quinta-mazuela-carinena`,
  `bodegas-vinos-y-vinedos-marin-rios-encinacorba` y
  `bodega-san-bernabe-de-cosuenda-cosuenda`. No se alteran mientras exista
  trabajo concurrente; ZG-22 deberá exigir keep/evidencia y reauditar sus
  decisiones antes de declarar cobertura completa.

### Hallazgos ZG-10

- Miel Monte Real, Apícola Cortés y Abejas de Cándido quedan verificadas con
  ecommerce propio operativo. En Monte Real la referencia de romero revisada
  estaba agotada, pero la tienda mantenía miel de flores y bosque con carrito;
  en Abejas de Cándido se corrigió el teléfono heredado al móvil actual. Las
  tres coordenadas nuevas son centroides municipales transparentes.
- Miel del Tío Juan Cruz queda verificada por su web propia y corrige el
  teléfono principal al 690 692 465: el 976 heredado figura expresamente como
  fax. Su web actual es un catálogo sin precio, carrito ni aceptación de
  pedidos, por lo que la venta se corrige de `sí` sin canal a `no`.
- Miel La Galinda y Miel Mil Gotas tienen actividad reciente acreditada por
  prensa, ayuntamiento, directorios y mercados institucionales, pero sin una
  fuente propia accesible quedan parciales y con venta no comprobada. En Mil
  Gotas se retiró la dirección heredada al existir una contradicción con la
  ficha turística; se conserva solo el municipio El Frago y el contacto
  publicado.
- Agustín Pellicer queda parcial por techo de una única ficha institucional y
  venta no comprobada. Ángel Sancho Lumbreras, Colmenar El Romeral, Miel Sierra
  de Luna y Miel de Los Bañales también quedan parciales, pero sus fuentes
  vigentes delimitan venta en explotación, directa o en puntos físicos; tras
  revisar los canales no consta un pedido remoto propio y se conserva `no`.

### Hallazgos ZG-11

- Quesería de Biota y Quesos Artesanos de Letux quedan verificadas con
  ecommerce propio operativo, producto, precio y carrito. Quesos Galindo Andrés
  también queda verificada, pero conserva venta no comprobada porque la
  navegación de tienda existe y el catálogo no respondió de forma concluyente.
- Quesos La Pardina corrige la ubicación falsa de Garrapinillos a su obrador de
  la carretera N-II en Zaragoza, además del teléfono y correo actuales. El
  Acebo adopta su identidad pública El Acebo de Moncayo y sustituye dirección,
  contacto y dominio inventados. Quesos El Burgo se vincula a su fabricante
  Villa Corona y a la fábrica real del polígono La Noria. Los tres quedan
  verificados y sin venta remota tras revisar sus catálogos o puntos físicos.
- Quesos Los Arcos queda verificada por su web propia y el directorio de Caspe;
  se incorpora el centroide municipal y se resuelve venta online `no`. Quesos
  Artesanos Villamayor y Quesos Diarte quedan parciales: el primero solo cuenta
  con rastro mercantil actual, mientras que Diarte tiene respaldo turístico
  provincial y comarcal pero no una fuente propia.
- Quesos Villa de Sástago, Lácteos de Chiapa y Quesos Omelette de Cabra no
  presentan rastro verificable y sus dominios no resuelven DNS. Se retiran
  dirección, teléfono, correo, enlaces, coordenadas y afirmaciones productivas,
  pero permanecen pendientes: ausencia y fallo técnico no demuestran por sí
  solos que las identidades no existan.
- Epulae Monegros queda pendiente porque el directorio mercantil la marca
  inactiva sin una extinción oficial inequívoca. Agerca también queda pendiente:
  su actividad pública actual es hortofrutícola y no debe confundirse con Val
  de Taus, entidad con NIF distinto. Inversiones Michelac solo acredita en BORME
  un objeto social amplio, no elaboración efectiva, marca ni producto.
- Lácteos Torreconde se purga por cierre: el BORME registra su liquidación final
  y extinción el 2 de diciembre de 2022. Un alta residual en repertorios
  artesanos no prevalece sobre el asiento societario oficial.

### Hallazgos ZG-12

- González y Romero Agrocarne queda verificada como fábrica cárnica de Ariza y
  corrige su identidad, correo y dominio a la tienda propia con precios y
  carrito. La Tellana también queda verificada con ecommerce y actualiza la
  tienda de Borja a plaza del Mercado, teléfono y correo vigentes.
- Casa de Ganaderos acredita producción de sus socios y sala de despiece y
  envasado en Mercazaragoza; corrige teléfono y correo y queda sin venta remota,
  pues su web solo publica puntos físicos. Hermanos Casabona confirma
  elaboración en Fuentes de Ebro y pedidos telefónicos con envío en 72 horas;
  se corrigen la dirección y el número heredados.
- Carnicería Lapeña queda parcial: la guía comercial local y su ficha
  cartográfica sostienen identidad, ubicación y elaborados frescos, pero no hay
  fuente propia del obrador. Jesús Ignacio Mainar también queda parcial por una
  guía territorial vigente, tras retirar dirección, productos, teléfono, correo
  y dominio no corroborados; su condición de elaborador sigue sin resolverse.
- Embutidos Muro y Carnes y Embutidos Ibáñez pierden todos los detalles
  especulativos: no existe rastro verificable y los dominios no resuelven DNS,
  pero esas señales no prueban inexistencia. La Carnicería Ibáñez real de Utebo
  es otra identidad y no se usa para rescatar la ficha de Ejea.
- Carnicería Melsa Zaragoza se purga como `other-province`: la dirección urbana
  era un comercio y las fuentes propia y registral sitúan la sede y elaboración
  de Embutidos Artesanos Melsa en Graus, Huesca.

### Hallazgos ZG-13

- + Q Carne queda parcial por dos directorios institucionales que acreditan
  ganadería, elaboración y tienda en Lécera. Su dominio no resuelve y no se pudo
  comprobar la venta remota que aún anuncia el directorio; se retira la web
  rota y se conserva `no comprobado`.
- Carnes García mantiene `parcial`: dos fuentes comarcales respaldan ganadería,
  obrador diario y puntos de venta en Ejea, pero no existe fuente propia. La
  venta heredada se corrige con canal `telefono`, ya que se publican tres
  números para pedidos.
- Embutidos de la Ribera, Carnicería Salillas, Charcutería El Tubo, Carnes
  Selectas El Moncayo, Embutidos El Cortijo y Hermanos Royo pierden productos,
  direcciones, contactos, enlaces y coordenadas: no hay rastro verificable y sus
  dominios no resuelven DNS. Permanecen pendientes porque ausencia y fallo
  técnico no demuestran inexistencia; el homónimo El Cortijo de Badajoz no se
  traslada a Calatayud.
- Secadero de Jamones Alto Aragón se purga como `other-province`. La empresa es
  real, pero el secadero está en El Grado, Huesca; la supuesta tienda-secadero de
  Alfonso I en Zaragoza y sus contactos eran falsos. También se elimina la
  imagen provincial asociada.

### Hallazgos ZG-14

- El Trasmozero, Ecomonegros, Manuel Segura y Lalmolda quedan verificados con
  ecommerce operativo; El Trasmozero y Ecomonegros también publican pedidos por
  WhatsApp. Se corrigen contactos y ubicaciones productivas cuando la ficha
  heredada apuntaba a datos obsoletos o a la tienda en vez del obrador.
- Fantoba queda verificada con venta por teléfono: su ecommerce está cerrado de
  forma estacional por calor, pero la web oficial mantiene pedidos y envíos por
  contacto. Micheto queda verificada por la ficha municipal y Maps, con el
  obrador actualizado a Paseo Cortes de Aragón 12; el dominio devuelve 403 y la
  venta remota permanece `no comprobado`.
- Julio y Yolanda queda `parcial` porque solo existe respaldo institucional. El
  directorio comarcal acredita elaboración y envío de pedidos a domicilio, por
  lo que la venta se resuelve `sí` con canal `telefono`.
- Pan Sayón se purga como `other-province`: el registro autonómico atribuye Pan
  Sayón a Panadería Jaquesa y sitúa su obrador en Jaca, Huesca; la supuesta ficha
  de Zaragoza no correspondía a una unidad productiva provincial.
- L'Artisana y Confitería Las Almas pierden productos, dirección, contactos,
  enlaces y coordenadas. No existe rastro verificable, sus dominios no resuelven
  y la dirección de L'Artisana corresponde actualmente a un restaurante, pero
  estos indicios no demuestran inexistencia y ambas quedan pendientes.

### Hallazgos ZG-15

- Panaderías Agrupadas de Caspe queda verificada: su web documenta el obrador,
  la producción artesanal y una tienda con carrito, precios y envíos
  peninsulares. Horno Ismael también queda verificado y la venta heredada se
  completa con el canal `whatsapp` que publica su web oficial.
- Horno de Sos, Ángel Bravo, Antigua Casa Cortés, Panadería Isasa y La Casa de
  la Abuela cierran como `parcial`: las fuentes institucionales sostienen
  identidad, municipio y actividad, pero no existe una fuente propia accesible
  que supere ese techo. En Horno de Sos e Isasa se corrigen los datos actuales.
- La Casa de la Abuela pasa de `no` a `no comprobado`: el directorio acredita
  puntos de venta físicos, pero no demuestra que no acepte pedidos remotos.
  Antigua Casa Cortés distribuye regionalmente, aunque tampoco publica un
  mecanismo de pedido que permita resolver la venta.
- Dulces La Pasión, Repostería Sanz de Ateca y Pastelería Los Mallos pierden
  productos, direcciones, contactos, enlaces y coordenadas. Los tres dominios
  carecen de DNS; el homónimo Sanz real está en Huesca y Don Jaime I 38 se
  atribuye a otros comercios. Ningún indicio basta para purgarlos y permanecen
  pendientes.

### Hallazgos ZG-16

- ¡Y un rábano! queda verificado con cestas, precios, reparto y confirmación
  semanal por WhatsApp en su página propia. Catastro permite situar con
  precisión la parcela 257 declarada y completar las coordenadas sin estimarlas.
- Las Cardelinas, Melada Huerta Saludable, Jalón Nature y Finca La Corona
  cierran como `parcial`: existen apoyos institucionales o recientes de su
  actividad, pero no una fuente propia operativa suficiente para superar ese
  techo. La tienda de Jalón Nature se menciona en 2025, aunque el dominio
  devuelve 502 al revisar y la venta actual queda `no comprobado`.
- Agrícola Montejalón estaba mezclada con Agrícola Gil en La Almunia; el registro
  mercantil ubica la sociedad en Ricla. Se corrigen municipio, slug e imagen y
  se retiran correo, web y Facebook ajenos. La ficha histórica Agro-Train CB se
  normaliza a la sociedad activa Frutas Agrotrain SL con el mismo teléfono,
  marca y municipio; ambas unidades quedan parciales por techo registral o
  institucional y sin pedido remoto demostrado.
- La Cooperativa del Niño Jesús se purga por disolución, concurso y liquidación
  documentados desde 2023/2024. Agrolatas se purga porque el BORME publica la
  conclusión de su concurso y la extinción firme en noviembre de 2025; sus
  apariciones posteriores en directorios son residuales.

### Hallazgos ZG-17

- Jumosol queda verificado como marca familiar de agricultores: la tienda
  oficial de 2026 ofrece productos, precios y carrito, y el consejo regulador
  confirma la comercializadora DOP en Fuentes de Ebro. Se completa el canal
  `ecommerce` y se actualiza el correo comercial.
- Biohuerta no produce en Mercazaragoza: su web sitúa la huerta y explotación
  ecológica en Botorrita y el directorio de Mercazaragoza publica Calle Hiedra
  2-4 en ese municipio. Se corrigen municipio, slug, dirección y coordenadas
  con Catastro; las cestas tienen precio, reparto y pedido por email o teléfono.
- El BORME documenta la transformación de Alejandro y Miguel S.C. en Alejandro
  y Miguel ZGV S.L.; la unidad de Nonaspe conserva actividad y contacto, pero
  queda parcial por depender de fuentes registrales e institucionales. La fila
  personal de Ángel Luengo se normaliza a Frutaria / Frutas El Cachirulo:
  Frutaria mantiene cultivo propio y el centro de Alagón, aunque sin venta
  remota demostrada ni una localización primaria suficiente para verificar.
- Ajos del Moncayo, Ajos Verdes El Sixto y Alium Aragón cierran como parciales.
  En Alium, el BOA acredita la central hortofrutícola de Bardallur; los otros
  dos dependen de directorios alimentarios y empresariales. Los dominios de
  Ajos del Moncayo y Alium no tienen DNS y se retiran, sin inferir cierre.
- Frutícola Maellana conserva parcial por los registros vigentes de las DOP de
  melocotón y aceite; `fruma.es` falla por TLS y por HTTP muestra una página de
  dominio genérica, por lo que se retira. La Chipranesca sigue verificada con
  web activa y registro DOP, pero pasa de `no` a `no comprobado`: no disponer
  de tienda visible no demuestra por sí solo ausencia de pedidos remotos.

### Hallazgos ZG-18

- Molino Ecotambo, Almendras de Las Pedrosas y Arroz de Valareña quedan
  verificados con ecommerce; Las Pedrosas también publica WhatsApp. Harinas
  Polo explica expresamente pedidos profesionales por email o teléfono, y
  Arroz Brazal mantiene tienda aunque su unidad de Ejea queda parcial por no
  publicar una parcela concreta.
- Nueces Ramón Puyod queda verificado como productor de Ejea, pero su venta
  sigue `no comprobado`: conserva productos, precios y textos de envío y pago,
  aunque Prestashop está hoy en modo catálogo y no muestra botón de compra.
  Amandolas presenta la misma ambigüedad porque sus botones Comprar remiten al
  contacto sin precio, carrito ni instrucciones.
- Naturapistacho, Frutos Secos del Jalón, La Baturrica, Harinas Azagra, Aragón
  Sin Gluten y Harinas de la Parra quedan verificados y sin pedido remoto en
  sus canales actuales. Catastro permite situar Las Pedrosas y Aragón Sin
  Gluten; las webs propias aportan las coordenadas de Azagra y Polo y el
  directorio municipal de Épila localiza Harinas de la Parra.
- El mapa incrustado de La Baturrica apunta erróneamente a Zaragoza capital y
  se descarta. La ruta asociada a las parcelas 8-9 del polígono La Corona sitúa
  la planta en `41.507634,-0.602578`, coherente con Fuentes de Ebro.
- Sémolas Cinco Villas se normaliza a Ebro Trigo, sociedad activa en 2026 que
  opera la misma fábrica de Tauste. Beiker se normaliza a Dr. Schär, cuya web
  documenta la adquisición de Natural Aliment Factory y la planta de Alagón.
  Arroz Brazal deja la oficina de Zaragoza por la unidad productiva de Ejea y
  se renombran slug e imagen.

### Hallazgos ZG-19

- Diamante Negro del Moncayo, La Mar de Sabor, M de Molina, Gardeniers, A Trufa
  Fresca, Aceitunas y Encurtidos Sariñena, Trufafusión Aragón y La Conservera
  del Prepirineo quedan verificados con ecommerce operativo. Conservas Lores
  también queda verificado, pero su tienda devolvió 503 durante la revisión y
  la venta se mantiene `no comprobado` sin confundir la interrupción con cierre.
- Gardeniers no produce en la antigua dirección del aeropuerto: la web propia
  y ATADES sitúan el obrador en Mercazaragoza, Carretera Cogullada 65, calle K,
  nave 4. Acemar confirma su planta de Camino del Batán 29 en Caspe; su web solo
  ofrece catálogo y contacto comercial, por lo que queda con venta online `no`.
- Foresta Algairén queda parcial: el directorio aragonés y una actividad de 2025
  confirman el proyecto, pero la localización productiva depende de fuentes
  secundarias y el dominio está aparcado. Aceitunas Muniente también queda
  parcial y corrige la descripción falsa de AOVE a aderezo de aceitunas; su
  dominio no resuelve y la venta sigue no comprobada.
- `trufa-negra-monteciello-ejea-de-los-caballeros` pasa a
  `trufa-negra-monteciello-los-pintanos`: Ejea era el domicilio de contacto,
  mientras ADEFO sitúa las seis hectáreas productivas en Los Pintanos. La ficha
  conserva techo institucional y confirma pedidos por WhatsApp y teléfono.
- Conservas Jalón y Trufa del Moncayo no reúnen evidencia suficiente para salir
  de `pendiente`. Se retiraron sus domicilios, teléfonos, correos, descripciones
  y coordenadas no demostrados; el correo de la segunda pertenece a la Cofradía
  de la Trufa del Moncayo. Ninguna se purga porque el fallo DNS y la falta de
  rastro no prueban inexistencia.

### Hallazgos ZG-20

- Avícola Torre Jirauta y Venta Las Cañadas quedan verificadas con sus fuentes
  propias y registros o directorios públicos actuales; ambas venden por canales
  físicos y quedan con venta online `no`. Camperos Los Corrales, Valdelobos y
  Virgen del Olivar permanecen parciales: la actividad está vigente, pero la
  evidencia pública es institucional y no permite elevar la unidad productiva.
- Cierzo, Ambar, Artillera y Ordio quedan verificadas con ecommerce operativo.
  Garba confirma en su web 2026 que envía cerveza y atiende por teléfono, además
  de participar en Mercados en Ruta; queda verificada con canal `telefono`.
- Artillera no estaba en Calle San Valero 4. Su ficha agroalimentaria vigente y
  GourmetZGZ sitúan la marca en Calle Salvia 1 del polígono Empresarium; se
  corrigen dirección, coordenadas, teléfono y referencias de producto.
- Golden Promise se elimina como `out-of-scope`: era una marca de cerveceros
  nómadas sin fábrica propia provincial y comunicó el cese en 2022. Hoppy se
  elimina como `not-producer`: su web actual describe un bar-restaurante con
  cervezas rotatorias de otras fábricas, no el micro-obrador heredado; se retira
  también su imagen.
- Picarda queda parcial y con venta `no comprobado`. Los portales institucional
  y municipal aún sostienen la identidad y ubicación de Mequinenza, pero la
  ficha contiene enlaces antiguos y el dominio ya no resuelve; se retiran web y
  correo sin convertir esa incertidumbre en cierre.

### Hallazgos ZG-21

- Cafés El Criollo, Onawa, El Tostadero, Chocolates Caro, Nakoa, Turmeon,
  Valdepablo y Pasta Libertina quedan verificados con ecommerce operativo. El
  Tostadero documenta además suscripción. Helados Tortosa promociona desde su
  propia web el pedido en Glovo y queda verificado con canal `marketplace`.
- PAM Coffee queda verificado por identidad, obrador y domicilio, pero su tienda
  anuncia cierre del 8 al 27 de julio de 2026; la venta se conserva `no
  comprobado` mientras no existe checkout utilizable. No se interpreta una
  pausa vacacional como cierre del productor.
- Chocolates Atienza, Ecolécera, Mermeladas La Vicora y Destilerías San Valero
  quedan verificadas sin venta online. Artecass permanece parcial: fuentes
  territoriales y mercantiles sostienen obrador y actividad en 2026, pero no se
  localizó una fuente propia vigente que permita superar ese techo.
- Ecolécera conserva su unidad productiva de Calle Alta 44 en Lécera: la sociedad
  figura activa allí en junio de 2026 y una visita sectorial documenta selección
  y envasado, aunque la web use una dirección de Fabara como contacto general.
- Se sustituyen centroides o ubicaciones genéricas por direcciones públicas en
  PAM, Onawa, El Tostadero, Caro, Valdepablo, La Vicora, Pasta Libertina,
  Tortosa, Artecass y Destilerías San Valero; también se corrigen teléfonos,
  correos y perfiles sociales cuando la fuente vigente los publica.

## ZG-22 · Reconciliación y puerta final

- Reauditar cualquier `pendiente`, todos los `parcial`, `sí` y `no` residuales.
- Confirmar que cada fila actual tiene un `keep` vigente y que cada baja o cambio
  de slug conserva su tombstone; reconciliar ventas y canales con el CSV.
- Repetir deduplicación normalizada, contactos compartidos y colisiones de grupo.
- Revisar municipio/coordenadas, los dos Maps inicialmente ausentes, identidad de
  enlaces y dependencias entre canal de venta y contacto.
- Comprobar imágenes referenciadas, huérfanas y renombradas tras purgas/merges.
- Resolver los diferidos de candidatos sin añadirlos por inercia; solo integrar
  un productor con evidencia suficiente y deduplicación previa.
- Reconciliar las ocho altas concurrentes detectadas durante ZG-09: sus `keep`
  externos ya llegaron, pero hay que confirmar que el trabajo terminó,
  reauditar sus decisiones y corregirlas sin sobrescribir cambios activos.
- Añadir Zaragoza a `data/evidence/coverage.json` solo con cobertura completa.
- Ejecutar `npx pnpm verify:data`, `git diff --check`, revisar `git diff --stat`
  y los diffs finales de CSV, JSONL, candidatos, cobertura, imágenes y ledger.

### Resultado ZG-22

- Las **246 filas actuales** tienen exactamente un `keep` vigente y decisión
  idéntica al CSV. Las 38 identidades retiradas o corregidas desde `HEAD`
  conservan `purge` o `merge`; no quedan `keep` vigentes fuera del catálogo.
- Los 27 `pendiente` fueron rechecados contra sus notas del mismo día: todos
  explican un bloqueo real y datos especulativos retirados. Las 65 fichas
  `parcial` conservan fuente y techo explícitos. Los 104 `sí` tienen canal y
  todos los 156 `sí|no` incluyen una fuente con claim de venta online.
- La deduplicación normalizada no encuentra nombres repetidos. Los únicos
  teléfonos, correos o dominios compartidos son San Valero/Gran Ducay y
  Ateca/Morca, relaciones de grupo ya resueltas en ZG-01 como unidades distintas.
- Las ocho altas concurrentes se sustituyen por decisiones de
  `gpt-5.6-sol`. Monfil corrige dirección y contacto; Torcal completa tienda y
  ubicación; Valdegarzón pierde la venta por WhatsApp no demostrada; Señorío
  baja a parcial porque el dominio está aparcado; Santa Ana, Quinta Mazuela y
  San Bernabé conservan parcial con mejor geografía y contacto.
- `bodegas-vinos-y-vinedos-marin-rios-encinacorba` se retira como
  `out-of-scope`: el censo DOP 2026 atribuye a esa instalación únicamente
  almacenamiento y sus contactos pertenecen a otros Marín ya representados.
- `docs/candidates/zaragoza.md` queda sin diferidos: las cooperativas de grupo
  ya representadas, la central de segundo grado, Frumaspi, Cariñena Vitivinícola
  y Luipau se cierran como no altas con su motivo; no se añade ninguna ficha por
  inercia durante la reconciliación.
- Zaragoza conserva **119 imágenes referenciadas y 119 archivos**, sin faltantes
  ni huérfanos. No hay verificadas sin coordenadas, ventas positivas sin canal,
  discrepancias de evidencia ni bajas sin tombstone.
