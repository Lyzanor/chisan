# Verificación provincial de Burgos

Ledger para planificar y reanudar la revisión profunda de
`data/csv/castilla-y-leon/burgos.csv`. El CSV es la fuente de verdad. La
evidencia estructurada por fila debe vivir en
`data/evidence/castilla-y-leon/burgos.jsonl` a medida que se cierre cada lote
(la carpeta ya existe por Ávila; el fichero se crea al cerrar el lote 1).

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento
no lo duplica, solo fija el snapshot, las particularidades de Burgos y el plan
de lotes. Los contratos viven en `docs/CSV_CONTRACT.md`,
`docs/EVIDENCE_CONTRACT.md` y `docs/EDITORIAL_POLICY.md`.

## Cómo usar este documento (léelo primero)

Este ledger está pensado para que cualquier agente pueda ejecutarlo de forma
autónoma y por partes. Para trabajar un lote solo necesitas leer:

1. **Estado** (snapshot y anomalías conocidas).
2. **Reglas duras para Burgos** (criterios de decisión por sector).
3. La fila de tu lote en la **worklist** y su lista de slugs en **Alcance
   exacto de cada lote**.
4. **Flujo por lote** (pasos mecánicos y comandos).

No releas el manual entero por lote ni los contratos completos; consúltalos
solo ante una duda concreta. Los slugs listados en tu lote **son** el lote:
no toques ninguna fila fuera de esa lista (tampoco "de paso"). Si detectas un
problema en una fila de otro lote, anótalo en la sección Estado y sigue.

Cada slug de los lotes lleva ya **flags precalculados** (herencia, cuarentena
de venta online, `SIN WEB`, dominios/teléfonos compartidos, geo-warnings,
municipios sin centroide, purgas probables). Los flags te dicen qué resolver
en esa fila además de las preguntas básicas; no son la decisión, son la
tarea.

## Estado

- Inicio: 2026-07-06. Modo: **primera pasada profunda**. No añadir candidatos
  nuevos; primero cerrar identidad, alcance, municipio y venta online de las
  filas heredadas. No existe `docs/candidates/burgos.md`.
- Snapshot inicial: **342 filas**; **297 `pendiente`**, 20 `parcial`, 25
  `verificado`.
- Snapshot tras lote 1 (2026-07-06): **335 filas** (−7: 6 purgas + 1 fusión);
  **282 `pendiente`**, 22 `parcial`, 31 `verificado`. Venta online: **20 `sí`**
  (4 con canal: `marketplace`, 3×`ecommerce`), 24 `no`, 291 `no comprobado`.
  Charcutería baja de 58 a 51 filas (6 purgas + 1 fusión, todas del sector).
  Imágenes: 165/335 (se borraron 3 huérfanas de filas purgadas).
- Snapshot tras lote 2 (2026-07-06): **334 filas** (−1: 1 fusión, `morcillas-de-cardena-cardenadijo`
  → `embutidos-de-cardena-cardenadijo`); **273 `pendiente`**, 21 `parcial`,
  40 `verificado`. Venta online: **27 `sí`** (11 con canal: 4 previos +
  7 nuevos, todos `ecommerce` salvo Zael en `marketplace|whatsapp|email`),
  24 `no`, 283 `no comprobado`. Imágenes: 164/334 (renombradas 2 al normalizar
  slug, borrada 1 huérfana de la fusión). `granja-zael-zael` recategorizada de
  Charcutería a Carnes (venden cortes de vacuno, no elaboran embutidos).
  Sotopalacios (3 filas) renombrado a Merindad de Río Ubierna: nuevo
  geo-warning de ~20 km frente al centroide de esa merindad (agregación de
  muchos pueblos; el centroide más cercano real es Quintanaortuño a ~1 km) —
  no se fuerzan coordenadas, es un artefacto esperado de usar un único
  centroide para un municipio-merindad extenso, igual que otros casos ya
  documentados (Arlanza, Vizcarra...).
- Snapshot tras lote 3 (2026-07-06): **330 filas** (−4: 3 purgas + 1 fusión);
  **257 `pendiente`**, 22 `parcial`, 51 `verificado`. Venta online: **37 `sí`**
  (21 con canal: 11 previos + 10 nuevos: 7 `ecommerce`, 1 `marketplace`, 1
  `telefono|email`, 1 `telefono`), 24 `no`, 269 `no comprobado`. Imágenes:
  163/330 (borrada 1 huérfana de la purga del IGP Lechazo). Purgas: I.G.P.
  Lechazo de Castilla y León (`not-producer`), matadero de La Cueva de Roa
  (`out-of-scope`, criterio ICAV), Embutidos Duque de Lerma (`closed`,
  extinguida 08/11/2024). Fusión: Cárnicas Cuevas Aranda + Morcilla Cuevas
  Aranda (mismo tel/correo, misma empresa desde 1970; nombre unificado).
  Páramo del Cid: municipio corregido de Aranda de Duero (sede
  administrativa) a Caleruega (granja real, slug renombrado
  `paramo-del-cid-caleruega`), recategorizado a Carnes. La Fonda del Prado
  recategorizada a Conservas (granja + conservas de aves, no embutidos).
  Gumiel del Mercado normalizado a Gumiel de Mercado (grafía oficial + slug).
- Snapshot tras lote 4 (2026-07-07): **326 filas** (−4: 3 purgas + 1 fusión);
  **241 `pendiente`**, 23 `parcial`, 62 `verificado`. Venta online: **43
  `sí`** (28 con canal: 21 previos + 7 nuevos, todos `ecommerce` salvo Casalba
  en `ecommerce|marketplace`), 24 `no`, 259 `no comprobado`. Imágenes:
  163/326 (sin huérfanas: ninguna fila purgada/fusionada tenía `imagen`).
  Purgas: la asociación de criadores de potro hispano-bretón (`not-producer`,
  organiza la Feria de San Marcos, no vende) y su fila gemela "Grupo Amicar 8"
  / carnedepotrohispanobreton.com (`closed`, sociedad extinguida en el
  registro mercantil, los tres dominios del sector ya no resuelven); Embutidos
  La Castellana (`closed`, concurso de acreedores desde 2019, en liquidación).
  Fusión: Productos El Peñedo → Sabores de Quintanar (mismo tel/dirección,
  nombre anterior de la misma empresa, hoy premiada en el Mundial del
  Chorizo). Carne de la Buena: municipio corregido de "Santa Gadea de Alfoz"
  a "Alfoz de Santa Gadea" (oficial INE), slug renombrado
  `carne-de-la-buena-alfoz-de-santa-gadea`, se mantiene en `parcial` (sin
  rastro digital propio, pero sin evidencia para purgar). Jamones el Pelayo:
  grafía de municipio normalizada ("Salas de Los Infantes" →
  "Salas de los Infantes"). Cuarentena VO resuelta: La Villarcayesa (tienda
  online real en villarcayesa.com/tienda/, sede confirmada en Villarcayo vía
  registro mercantil pese a directorios desactualizados que la sitúan en
  Cantabria).
- Snapshot tras lote 5 (2026-07-07): **326 filas** (sin cambio de conteo: los 7
  renombres de slug son la misma entidad, no duplicados). **227 `pendiente`**,
  22 `parcial`, 77 `verificado`. Venta online: **53 `sí`** (40 con canal: 28
  previos + 12 nuevos, 11 `ecommerce` + 1 `ecommerce|whatsapp`: Dominio de
  Calogía), 23 `no`, 250 `no comprobado`. Imágenes: 163/326 (6 renombradas por
  los merges de slug, ninguna huérfana). Roa de Duero → Roa: 7 slugs
  renombrados con `merge` (nombre oficial INE confirmado en Wikipedia; el
  ayuntamiento conserva "Roa de Duero" solo como dominio web). Cuarentenas
  resueltas: Bodega Condado de Haza y Viñedos Alonso del Yerro (`sí` sin canal
  → `sí` ecommerce vía tienda propia). Bodegas Hercal reauditada: promovida de
  `HEREDADO parcial` a `verificado` y VO re-derivado de `no` a `sí` (ecommerce,
  fuente propia). Bodegas Raíz y Quesos Páramo de Guzmán: nombre mixto
  confirmado real (continuación del proyecto de quesos Páramo de Guzmán desde
  1985 más bodega propia desde 1998); se mantiene en categoría Bodega. San
  Martín de Rubiales: grafía normalizada (tilde), slug sin cambios. Sin
  purgas ni parciales residuales en este lote.
- Snapshot tras lote 6 (2026-07-08): **326 filas** (sin cambio de conteo: los 3
  renombres de slug son la misma entidad). **211 `pendiente`**, 22 `parcial`,
  93 `verificado`. Venta online: **60 `sí`** (47 con canal: 40 previos + 7
  nuevos, 6 `ecommerce` + 1 `ecommerce|suscripcion`: Abadía de Acón), 23 `no`,
  243 `no comprobado`. Imágenes: 163/326 (3 renombradas por los merges de
  slug, ninguna huérfana). Los tres valores raros de municipio del lote eran
  Pedrosa de Duero: Boada de Roa y Quintanamanvirgo son entidades locales
  menores de ese municipio y «Predrosa» era errata (la web de Traslascuestas
  sitúa la bodega en Valcavado de Roa, también E.L.M. de Pedrosa de Duero);
  3 slugs renombrados con `merge` (Viyuela, Rodero, Traslascuestas). Ortega
  Fournier renombrada a **Dominio Fournier**: González Byass compró la bodega
  de Finca El Pinar (Berlangas de Roa) en 2019 y ofournier.com redirige 301 a
  dominiofournier.com (nombre y web actualizados, email antiguo retirado; el
  slug no se toca por rebranding, regla 20). Linaje Garsea vende por la
  tienda del propio negocio familiar elventorro.com (tel compartido con la
  fila de lote 13, precedente Milénico). Sin purgas ni parciales en este
  lote.
- Snapshot tras lote 7 (2026-07-08): **326 filas** (sin cambio de conteo: el
  par Cillar de Silos/Dominio del Pidio son dos bodegas reales de la misma
  familia, no se fusionan). **195 `pendiente`**, 23 `parcial`, 108
  `verificado`. Venta online: **71 `sí`** (61 con canal: 47 previos + 14
  nuevos, 13 `ecommerce` + 1 `marketplace`: Bodegas S. Arroyo/Tinto Arroyo vía
  Catatú), 23 `no`, 232 `no comprobado`. Imágenes: 163/326 (sin cambios: no
  hubo purgas, fusiones ni renombres de slug en este lote). Las 3 cuarentenas
  de La Horra resueltas: Asenjo-Manso (marca Ceres) y Balbás confirmaron
  tienda propia con carrito → `sí` ecommerce; Fuentenarro no tiene carrito
  real (solo "consultar precios" por email/teléfono) → degradada a `no
  comprobado`. Cillar de Silos y Dominio del Pidio: confirmado por prensa
  (sobremesa.es, spanishwinelover.com) que son dos bodegas reales de la
  familia Aragón — Dominio del Pidio es el segundo proyecto, lanzado en 2014,
  con bodegas-cueva propias restauradas y vinos exclusivamente municipales;
  se mantienen ambas filas (comparten teléfono por ser el mismo grupo,
  precedente Flores y Jiménez en Ávila). Copaboca Ribera (Sotillo de la
  Ribera): instalación real y distinta de Villalmanzo confirmada por la
  propia web del grupo (noticia de placas solares nombra "Tordesillas,
  Sotillo de la Ribera y Torrecilla" como sus bodegas) — nota para el lote
  10: Villalmanzo también es instalación real ("nuestra última adquisición"),
  no purgar como duplicado. Dos correcciones de dominio por web rota/errónea:
  `bodega-los-olmos-quintana-del-pidio` (el CSV traía
  `bodegaslosolmos.com`, que no resuelve DNS; corregido a
  `bodegalosolmos.com`) y `bodegas-valle-de-monzon-quintana-del-pidio`
  (`vallemonzon.com` da error TLS persistente; corregido al espejo
  `valledemonzon.es`, mismo contenido/dirección/teléfono). `web` de
  `bodegas-garcia-figuero-la-horra` actualizada de tintofiguero.com (redirige
  301) a figuero.es (rebranding a Bodegas Figuero), y la de
  `copaboca-ribera-sotillo-de-la-ribera` de copaboca.es (redirige 301) a
  copaboca.com. `bodegas-valdaya-sotillo-de-la-ribera` se queda en `parcial`:
  su web propia da error de certificado TLS apuntando a un hosting ajeno
  (`*.srv.cat`) en todas las rutas probadas; identidad y municipio sostenidos
  solo por el registro oficial de la DO Ribera del Duero (techo `parcial`,
  regla 5), sin fuente propia operativa. Nombre limpiado de ruido de volcado:
  «DOMINIO DE MONTELAHORRA.» → «Dominio de Montelahorra». Municipio
  normalizado: `bodega-rubiejo-sotillo-de-la-ribera` de «SOTILLO DE LA
  RIBERA» a «Sotillo de la Ribera» (grafía, slug sin cambios). Sin purgas en
  este lote.
- **Herencia a reauditar** (diferencia clave con Ávila, que partía de cero):
  los 25 `verificado` y 20 `parcial` heredados NO se respetan por defecto; se
  reauditan dentro de su lote con el mismo estándar que una fila `pendiente`
  (suele ser rápido: casi todos tienen web propia). Vienen flageados como
  `HEREDADO verificado|parcial` en las listas.
- Venta online inicial: **16 `sí`, 23 `no`, 303 `no comprobado`**; `Canal de
  venta` **0/342**.
  - Los 16 `sí` sin canal son **cuarentena** (precedente Madrid): re-comprobar
    el mecanismo de pedido; si sigue vigente, `sí` + canal; si no,
    degradar.
  - Los 23 `no` heredados son dudosos: la mayoría son bodegas de Arlanza
    cargadas en bloque con la web del consejo regulador (ver Hallazgos).
    `no` solo sobrevive si se comprueba de verdad que no hay pedido remoto.
- Imágenes: **168/342** ya presentes (todas en la ruta canónica
  `/productores/castilla-y-leon/burgos/`). Las imágenes NO forman parte de
  esta pasada; no ejecutar `enrich:images --apply` en bloque. Única
  obligación: si purgas o fusionas una fila con `imagen`, borra el fichero
  huérfano de `public/productores/castilla-y-leon/burgos/` en el mismo
  cambio.
- Reparto por categoría (18, snapshot inicial): **Bodega 124**, **Charcutería
  58**, **Pan y pastelería 32**, **Lácteos y quesos 26**, **Despensa
  artesanal 24**, **Miel 22**, **Fruta y verdura 16**, **Cerveza artesana
  16**, **Licores 5**, **Dulces y repostería 5**, **Trufa y setas 4**,
  **Legumbres 3**, **Chocolate 2**, y con 1: Huevos, Sidra, Aromáticas y
  condimentos, Pescado, Helados.
- Territorio (snapshot inicial): 137 valores distintos de `municipio` (con
  erratas y variantes de grafía). Cabeceras: **Burgos 66**, **Aranda de Duero
  37** (una en MAYÚSCULAS), **Lerma 11**, **Espinosa de los Monteros 11**
  (una como «Las Machorras…»), **La Horra 9**, **Roa 13** (6 «Roa» + 7 «Roa
  de Duero»), **Quintana del Pidio 6**, **Sotillo de la Ribera 6** (una en
  MAYÚSCULAS), **Sotopalacios 5**, **Covarrubias 5** y cola larga de 1-4.
- Enlaces iniciales: web 282/342, Instagram 92/342, Facebook 97/342, Google
  Maps 322/342 (20 filas sin Maps, flageadas), teléfono 322/342, correo
  318/342, dirección/lat/lon/horario/descripción 342/342. Descripciones y
  horarios parecen volcado automático: revisarlos solo cuando contradigan la
  fuente.
- Calidad inicial:
  - `node scripts/audit-csv.js --mode=contract data/csv/castilla-y-leon/burgos.csv`
    → **0 errores, 0 warnings, OK**.
  - `node scripts/audit-csv.js --mode=quality data/csv/castilla-y-leon/burgos.csv`
    → **0 errores, 7 warnings** (todos geo) y 255 avisos suprimidos por
    opcionales ausentes.
- Warnings de geo-check iniciales (los 7, con su lote):
  - ~~`asociacion-de-fabricantes-de-morcilla-de-burgos-burgos` (lote 1): 65,6
    km~~ — **resuelto 2026-07-06**: purgada (`not-producer`, asociación
    sectorial), el warning desaparece con la fila.
  - `bodegas-arlanza-burgos` y `bodegas-sierra-burgos` (lote 11): 33,5 km;
    ambas junto al centroide de Villalmanzo. Patrón sede fiscal en capital vs
    bodega real: corregir municipio (y slug, con `merge`) hacia donde está la
    bodega.
  - `bodegas-vizcarra-burgos` (lote 11): 78,7 km; junto a Mambrilla de
    Castrejón (donde Vizcarra tiene la bodega). Mismo patrón.
  - `montegaredo-s-l-aranda-de-duero` (lote 8): 24,8 km; junto a Pedrosa de
    Duero (Boada de Roa/Guzmán es su finca). Resolver municipio real.
  - `apimara-arconada` (lote 19): 85,4 km del centroide de «Arconada».
    Sospecha de homónimo (Arconada es municipio de Palencia); resolver si el
    municipio burgalés real es otro (¿Arconada de Bureba?) o si la fila es de
    otra provincia.
  - `cerveza-gadea-santa-gadea-del-cid` (lote 21): 67,1 km; las coords caen
    en Burgos capital. Resolver dónde elabora de verdad.
- **Municipios que no están en `data/reference/municipios.json`** (39
  valores; el geo-check no protege esas filas). Cada fila afectada lleva el
  flag `municipio sin centroide`. Procedimiento: confirmar el municipio
  oficial INE; si el valor es una pedanía/localidad, corregir `municipio` al
  oficial (conservando la localidad en `direccion`) y renombrar el slug con
  registro `merge`; si es municipio real que falta en la referencia, NO
  forzar el dato: anotar el hueco aquí. Pistas iniciales (confirmar antes de
  aplicar, no son decisión):

  | Valor en CSV | Pista (confirmar INE) | Lote |
  |---|---|---|
  | Ahedo del Butrón | pedanía de Los Altos | 19 |
  | Barcina de los Montes | pedanía de Oña | 14 |
  | ~~Boada de Roa~~ | entidad local menor de Pedrosa de Duero (no era hueco) — **resuelto 2026-07-08 en lote 6**: `bodegas-viyuela` renombrada a `-pedrosa-de-duero` con merge, localidad conservada en la dirección | 6 |
  | ~~Cabanas de Virtus / Cabañas de Virtus~~ | pedanía de Valle de Valdebezana — **resuelto 2026-07-07**: las 2 filas con ese municipio se purgaron en el lote 4 (asociación de criadores + Grupo Amicar 8, ambas extintas/sin venta), no queda ninguna fila que lo use | 4 |
  | Castrillo Solarana | municipio real; probable hueco | 10 |
  | Cilleruelo de Bezana | pedanía de Valle de Valdebezana | 11 |
  | Cubillo del Butrón | pedanía de Los Altos | 17 |
  | Dobro | pedanía de Los Altos | 14 |
  | Hinestrosa | pedanía de Castrojeriz | 15 |
  | Hinojar del Rey | pedanía de Huerta de Rey | 9 |
  | La Aguilera | pedanía de Aranda de Duero | 8, 22 |
  | La Vid | municipio La Vid y Barrios | 9 |
  | Las Machorras, Espinosa de los Monteros 09566 | limpiar valor → Espinosa de los Monteros | 14 |
  | Lastras de Teza | pedanía de Valle de Losa | 20 |
  | Maltranilla | resolver (¿Valle de Mena?) | 12 |
  | Medianas de Mena | pedanía de Valle de Mena | 14 |
  | Nava Ordunte | pedanía de Valle de Mena | 22 |
  | Palacios de Benaver | resolver (¿municipio propio o pedanía?) | 15 |
  | ~~Predrosa~~ | errata de Pedrosa de Duero — **resuelto 2026-07-08 en lote 6**: la web de Traslascuestas sitúa la bodega en Valcavado de Roa (E.L.M. de Pedrosa de Duero); slug renombrado con merge, dirección y descripción corregidas | 6 |
  | Quincoces de Yuso | pedanía de Valle de Losa | 19 |
  | Quintana Martín Galíndez | pedanía de Valle de Tobalina | 17 |
  | Quintanalara | resolver (¿municipio propio?) | 23 |
  | ~~Quintanamanvirgo~~ | entidad local menor de Pedrosa de Duero — **resuelto 2026-07-08 en lote 6**: la web de Rodero da Ctra. Boada s/n, 09314 Pedrosa de Duero; slug renombrado con merge, localidad conservada en la dirección | 6 |
  | Quintanaseca | pedanía de Frías | 17 |
  | Quintanilla del Agua | municipio Quintanilla del Agua y Tordueles | 10 |
  | Rioseco (Valle de Manzanedo) | limpiar valor → Valle de Manzanedo | 14 |
  | ~~Roa de Duero~~ | municipio oficial «Roa» (confirmado en Wikipedia) — **resuelto 2026-07-07**: 7 slugs renombrados con merge en el lote 5 | 5 |
  | San Llorente de la Vega | pedanía de Melgar de Fernamental | 20 |
  | San Mamés de Abar, Basconcillos del Tozo, Burgos | limpiar valor → Basconcillos del Tozo | 19 |
  | ~~Santa Gadea de Alfoz~~ | municipio Alfoz de Santa Gadea — **resuelto 2026-07-07**: `carne-de-la-buena-santa-gadea-de-alfoz` renombrada a `carne-de-la-buena-alfoz-de-santa-gadea` (centroide confirmado en municipios.json, coords del CSV ya cuadraban) | 4 |
  | Sotopalacios | pedanía de Merindad de Río Ubierna — **resuelto 2026-07-06 en lote 2** (3 slugs renombrados); genera geo-warning ~20 km esperado, ver Estado | 12, 16 |
  | Valdenoceda | pedanía de Merindad de Valdivielso | 14 |
  | Villafuertes | municipio real; probable hueco | 2 |
  | Villamayor del Río | municipio real; hueco confirmado 2026-07-07 (no está en municipios.json), coords del CSV no se tocan | 4 |
  | Villasilos | pedanía de Castrojeriz | 15 |
  | Vivar del Cid | pedanía de Quintanilla Vivar | 22 |
  | Vizmalo | municipio real; probable hueco | 2 |
  | Zaballa | resolver (¿Valle de Losa? ¿Álava?) | 14 |

- Grafías a normalizar dentro de sus lotes (sin cambiar identidad):
  «ARANDA DE DUERO» (lote 8), ~~«SOTILLO DE LA RIBERA» (lote 7)~~ —
  **resuelto 2026-07-08**: `bodega-rubiejo-sotillo-de-la-ribera` normalizado a
  «Sotillo de la Ribera» (solo municipio, slug sin cambios), «GUMIEL DE
  IZÁN» (lote 9), «Salas de Los Infantes»→«Salas de los Infantes» (lote 4) y
  «Gumiel del Mercado»→confirmar oficial «Gumiel de Mercado» (lote 3).
- Filas que son **entidades de promoción/registro, no productores** (purga
  `not-producer` probable; sus webs pasan a ser FUENTES de cotejo):
  `asociacion-de-fabricantes-de-morcilla-de-burgos-burgos` e
  `igp-morcilla-de-burgos-burgos` (lote 1),
  `i-g-p-lechazo-de-castilla-y-leon-aranda-de-duero` (lote 3),
  `asociacion-de-carne-de-potro-hispano-breton-de-burgos-cabanas-de-virtus`
  (lote 4, con fila gemela no-asociación a resolver juntas),
  `consorcio-ruta-del-vino-ribera-del-duero-aranda-de-duero` (lote 8),
  `consejo-regulador-de-d-o-arlanza-lerma` (lote 10),
  `asociacion-slowfood-burgos-burgos` (lote 16),
  `m-g-manzana-reineta-y-cereza-de-caderechas-salas-de-bureba` y
  `m-g-lechuga-de-medina-medina-de-pomar` (lote 20),
  `m-g-alubia-roja-de-ibeas-ibeas-de-juarros` (lote 23). Dudosa:
  `trufa-de-burgos-burgos` (lote 23; su web es atrubur.com, la asociación de
  truficultores).
- Duplicados potenciales: 9 dominios y 20 teléfonos compartidos entre filas;
  cada par está flageado en su lote (`dominio/tel compartido con …`). Un
  enlace compartido NO es purga automática: puede ser mismo grupo con dos
  unidades reales (precedente Flores y Jiménez en Ávila), dos marcas del
  mismo obrador (fusión) o una fila satélite (asociación, tienda).
- Evidencia: Burgos NO está en `data/evidence/coverage.json`; decidir su alta
  al cierre de la pasada, en el mismo cambio que complete la evidencia
  provincial.

## Zonas de Burgos para lotear

- **Burgos capital y alfoz**: Burgos, Cardeñadijo, Villalbilla de Burgos,
  Quintanilla Vivar, Vivar del Cid, Castrillo del Val, Carcedo, Arlanzón,
  Ibeas de Juarros, Sotopalacios (Merindad de Río Ubierna), Tardajos.
  Morcilla de Burgos, queso fresco, obradores urbanos, cervezas artesanas,
  yemas/dulces, patatas.
- **Ribera del Duero burgalesa** (sur): Aranda de Duero, Roa, La Horra,
  Sotillo de la Ribera, Gumiel de Izán, Gumiel de Mercado, Quintana del
  Pidio, Pedrosa de Duero, Fuentecén, Fuentelcésped, Milagros, La Vid,
  Vadocondes, Castrillo de la Vega, La Aguilera. DO Ribera del Duero
  (bodegas a decenas), lechazo, morcilla arandina, torta de Aranda.
- **Arlanza** (centro-sur): Lerma, Covarrubias, Villalmanzo, Santo Domingo
  de Silos, Quintanilla del Agua y Tordueles, Cilleruelo de Abajo/Arriba,
  Villahoz, Mahamud, Zael, Fontioso, Hortigüela, Puentedura. DO Arlanza,
  morcilla de Lerma, miel de sabinares.
- **Las Merindades** (norte): Villarcayo, Espinosa de los Monteros, Medina de
  Pomar, Frías, Oña, Valle de Mena, Valle de Losa, Valle de Tobalina, Valle
  de Valdebezana, Merindad de Valdivielso, Los Altos, Alfoz de Santa Gadea.
  Quesos y mantequilla de Espinosa, morcilla de Villarcayo, miel de brezo,
  carne de potro hispano-bretón.
- **La Bureba y Ebro**: Briviesca, Poza de la Sal, Pancorbo, Miranda de Ebro,
  Grisaleña, Busto de Bureba, Prádanos de Bureba, Santa Gadea del Cid,
  Castildelgado, Belorado, Fresno de Río Tirón, Villamayor del Río y el
  valle de las Caderechas (Salas de Bureba, Rucandio). Cereal, sal de Poza,
  cereza y manzana de las Caderechas, quesos.
- **Sierra de la Demanda y Pinares** (sureste): Salas de los Infantes,
  Quintanar de la Sierra, Barbadillo del Mercado, Hontoria del Pinar, Huerta
  del Rey, Pradoluengo, Villamiel de la Sierra, Castrillo de la Reina,
  Villaespasa. Miel, setas y trufa, embutidos serranos, vacuno de la
  Demanda.
- **Odra-Pisuerga y páramos** (oeste): Melgar de Fernamental, Castrojeriz
  (Hinestrosa, Villasilos), Sasamón, Villadiego, Padilla de Arriba,
  Basconcillos del Tozo, Montorio, Tubilla del Agua, Sedano. Cereal,
  legumbre, huevos, quesos de oveja, miel de páramo.

## Hallazgos transversales de la carga inicial

Detectados al preparar el plan (2026-07-06); aplican a cualquier lote:

- **El volcado mezcló entidades sectoriales con productores**: consejos
  reguladores, IGP, marcas de garantía (M.G.), asociaciones y consorcios
  tienen fila propia (lista completa en Estado). Son purgas `not-producer`
  casi seguras, pero sus webs y listados de operadores son excelentes
  fuentes: antes de purgar, extrae de ahí el cotejo para las filas reales
  del lote.
- **Nueve bodegas de Arlanza llevan `web=arlanza.org`** (la web del consejo
  regulador) como si fuera propia, casi todas `parcial` + `Venta online=no`
  cargados en bloque. Esa web se retira de la fila (enlace ajeno), se busca
  fuente propia (web/redes/Maps) y el `no` heredado se re-deriva desde cero.
- **Sede fiscal vs bodega real**: varias filas «Burgos (capital)» tienen las
  coordenadas de la bodega física en otro municipio (Villalmanzo, Mambrilla
  de Castrejón…). La fila del CSV apunta al lugar de elaboración: corregir
  municipio+slug (con `merge`) hacia la bodega, no «arreglar» las
  coordenadas para que cuadren con la sede.
- **`Roa de Duero` no es el nombre oficial** (INE: «Roa»): 7 filas y sus
  slugs `-roa-de-duero` se normalizan en el lote 5 con `merge`.
- **Dominios caídos, aparcados o hackeados** (precedente Ávila: spam de
  casino en dominios caducados): antes de citar un enlace del CSV o de una
  búsqueda, comprobar que el contenido real corresponde al productor. Un
  dominio aparcado o ajeno se retira del CSV; la dificultad de acceso
  (HTTP/TLS/DNS/timeout) por sí sola no prueba nada negativo.
- **`Canal de venta` está vacío en toda la provincia** (0/342), también en
  los 16 `sí` heredados: ningún `sí` es válido al cierre sin canal.

## Reglas duras para Burgos

1. **El alcance del lote está congelado.** Trabaja solo los slugs listados en
   tu lote. Si un slug cambia (municipio erróneo) o desaparece
   (purga/fusión), actualiza la lista de tu lote y la worklist en el mismo
   cambio.
2. **Toda fila termina decidida.** Cada fila del lote acaba en `verificado`,
   `parcial`, `pendiente` (solo con motivo anotado), purga o fusión, con su
   línea de evidencia JSONL.
3. **La herencia se reaudita.** Un `HEREDADO verificado|parcial` se trata
   como `pendiente` con ventaja (suele tener web): la decisión final debe
   re-sostenerse con fuente verificadora vigente (identidad + actividad
   productora + municipio). No heredar el estado sin mirar.
4. **Venta online desde cero.** `sí` exige mecanismo de pedido remoto vigente
   y utilizable (tienda propia, WhatsApp/teléfono/email anunciado para
   pedidos, marketplace verificable) y siempre lleva `Canal de venta`
   (`ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion` o
   `marketplace`, múltiples con `|`). `no` solo tras comprobar que no hay
   pedido remoto. En duda: `no comprobado` (y canal vacío). Catálogo sin
   compra, reventa en terceros sin ficha verificable o formulario ambiguo no
   son `sí`. Los 16 `sí` y 23 `no` heredados están en cuarentena (regla 3).
5. **Directorios y sellos capan en `parcial`.** Burgos Alimenta, Tierra de
   Sabor, DO/IGP/M.G., RGSEAA, premios y prensa apoyan existencia e
   identidad, pero como fuente única no dan `verificado`: hace falta fuente
   propia (web, tienda, perfil oficial) o ficha real de Google Maps que
   sostenga identidad, actividad productora y municipio.
6. **Entidades sectoriales no son productores.** Consejo regulador, IGP,
   M.G., asociación, consorcio o fundación promocional = purga
   `not-producer`, salvo que la investigación demuestre que detrás hay un
   operador que elabora y vende con esa marca. Sus webs quedan como fuentes.
   No convertir la fila en otro productor «parecido»: si hay un productor
   real que merece alta, es tarea de otra pasada (regla 21).
7. **Bodega (124) = viticultor/elaborador con vino propio.** Anclas: DO
   Ribera del Duero (buscador oficial de bodegas del consejo) y DO Arlanza.
   El registro de la DO confirma identidad, municipio y pertenencia; para
   `verificado` añade fuente propia o ficha real. Separar bodega de
   vinoteca, distribuidor, bar (vermuterías del lote 11) o club de vino.
   Bodegas con dos inscripciones (Ribera + Arlanza, p. ej. Copaboca) pueden
   ser dos filas legítimas si hay dos instalaciones reales; si no, fusionar.
   `agua-de-corconte-cilleruelo-de-bezana` no es bodega: recategorizar
   (precedente Ursu en Ávila: «Agua mineral natural», confirmar con
   `npx pnpm list:categories`).
8. **Charcutería (58) = elaborador, no carnicería ni servicio.** Ancla: IGP
   Morcilla de Burgos (el listado de fabricantes de la asociación es la
   fuente reina para las morcillerías). Entra el obrador/fábrica con
   elaboración propia; carnicería solo si acredita obrador. «Cortadores de
   jamón» (2 filas) son servicio de corte: purga por alcance salvo elaboración
   real. Mataderos y comercializadoras de lechazo (Colear, Lecoa, matadero de
   La Cueva de Roa): decidir alcance con el criterio ICAV de Ávila
   (cooperativa/central con producto propio envasado y venta = entra;
   servicio B2B puro = fuera) y anotarlo.
9. **Lácteos y quesos (26) = quesería/mantequería real.** Queso fresco de
   Burgos y mantequilla de Espinosa como emblemas. Cuidado con pares
   marca/comercial (Vidal/Altoesgueva, Mostelares/Ilujor): resolver si son
   dos unidades reales o una empresa con dos filas.
10. **Pan, dulces y chocolate = obrador real.** Obradores conventuales entran
    (Clarisas de Vivar del Cid, Iesu Communio en La Aguilera, obrador del
    convento de Belorado; precedente Ávila). Panificadora vs obrador artesano:
    ambos pueden entrar si elaboran; anotar la diferencia.
11. **Cerveza artesana (16): fábrica o marca con elaboración verificable.**
    Burgos capital concentra 11: separar fábrica real, marca nómada
    (elabora en instalaciones de otro: entra con nota) y bar/tienda (Beer in
    Burgos vs Siesta Brewing; trío Victoria repartido entre lotes 11, 21 y
    22). Resolver los pares de teléfono compartido (Alis/La Vache Folle).
12. **Miel (22) = apicultor con colmenas propias.** Mucho slug sin web en la
    Demanda y Merindades: tirar de Maps, redes, ayuntamientos y prensa; la
    ausencia de web no justifica purga (regla 17).
13. **Fruta y verdura (16): Caderechas y huerta.** Cereza/manzana de las
    Caderechas (M.G. como fuente, no como fila), horticultura eco y patatas.
    Las 3-4 filas de «patatas» de la capital pueden ser almacenistas/
    envasadoras: si no hay cultivo propio, decidir alcance como envasador
    local o purgar por alcance, con nota. `almacenes-sualdea-…` huele a
    distribuidor.
14. **Despensa artesanal (24): revisar qué elaboran de verdad.** Es el cajón
    de sastre: caracoles (3 filas, helicicultura real entra), sal de Poza
    (salinas), bacalao/salazones, cafés (tostador local entra como
    elaborador), conservas, platos preparados
    (`olla-podrida-burgos-sotopalacios` tiene web propia: ¿elaborador real de
    conservas de olla podrida o proyecto gastronómico?). Recategorizar con
    fuente cuando la categoría no corresponda (mirar
    `npx pnpm list:categories`).
15. **Trufa y setas (4) + Legumbres (3) + resto pequeño.** Truficultura real
    de Burgos (Laratruf, Sustrufas, Trufbox) vs asociación ATRUBUR
    (`trufa-de-burgos-burgos`, probable purga). Alubia roja de Ibeas: la M.G.
    se purga; los productores reales, si aparecen, son de otra pasada.
    `cereales-y-servicios-agricolas-…` puede ser empresa de servicios agrarios:
    decidir alcance.
16. **No purgar con evidencia débil.** Muchas filas sin web son negocios
    rurales reales. Para purgar exige duplicado, no productor, otra
    provincia, cierre o inexistencia suficientemente contrastada; si no,
    `parcial` o `pendiente` con nota.
17. **URLs difíciles no prueban nada negativo.** Errores HTTP/TLS/DNS,
    bloqueos o timeouts solo crean incertidumbre: confirmar por búsqueda,
    perfil oficial, Maps o fuente local antes de borrar web, venta o fila.
    Un dominio aparcado, caducado o con contenido ajeno sí se retira.
18. **Municipios: pedanías al oficial INE y sin forzar coordenadas.** Aplica
    la tabla de Estado: pedanía → municipio oficial (localidad conservada en
    `direccion`) + slug renombrado con `merge`; municipio real sin centroide
    → anotar hueco, no tocar la fila por eso. MAYÚSCULAS y variantes de
    grafía se normalizan en su lote. Si corriges `municipio` y el slug lo
    codifica, corrige el slug en el mismo cambio.
19. **Fuera de provincia se resuelve, no se borra de oficio.**
    `hacienda-el-ternero-haro`: la finca El Ternero es un enclave burgalés
    (Miranda de Ebro) rodeado de La Rioja con dirección postal de Haro —
    resolver municipio con fuente antes de decidir purga `other-province`.
    `la-torta-de-aranda-valladolid` (¿obrador vallisoletano?) y
    `apimara-arconada` (¿Arconada de Palencia?) — misma disciplina.
20. **Nombres con ruido de volcado.** Limpiar `nombre` cuando arrastre
    coletillas de Maps o eslóganes kilométricos, conservando la identidad
    real. El `slug` NO se toca por limpiar el nombre.
21. **No añadir candidatos nuevos en esta pasada** salvo decisión explícita
    del usuario.
22. **Imágenes fuera de alcance**, salvo la limpieza de huérfanos al
    purgar/fusionar (ver Estado). No usar `enrich:images --apply` en bloque.

## Fuentes de cotejo iniciales

Orientan la búsqueda; no sustituyen la fuente propia o ficha real cuando la
decisión sea `verificado`. Confirma el dominio oficial al citarlo.

- **Burgos Alimenta** (Diputación de Burgos): marca y directorio
  agroalimentario provincial. Descubrimiento, identidad y contacto; como
  fuente única capa en `parcial`.
- **Tierra de Sabor** (Junta de Castilla y León): marca de garantía regional
  con directorio de adheridos. Mismo techo: `parcial` como fuente única.
- **DO Ribera del Duero** (consejo regulador, riberadelduero.es): buscador
  oficial de bodegas inscritas. Identidad, municipio y pertenencia para el
  grueso de las 124 bodegas del sur.
- **DO Arlanza** (arlanza.org): listado de bodegas del consejo. Ojo: esa web
  está incrustada como `web` en 9 filas y hay que retirarla de ellas.
- **IGP Morcilla de Burgos** (igpmorcilladeburgos.es): listado de fabricantes
  certificados; fuente reina para Charcutería.
- **IGP Lechazo de Castilla y León** y **Carne de Potro Hispano-Bretón**:
  contexto para cárnicas; no convierten comercializadoras en elaboradores.
- **Marcas de garantía** (fuentes, no filas): Cereza y Manzana Reineta de las
  Caderechas, Alubia Roja de Ibeas, Lechuga de Medina, Morcilla de Villarcayo.
- **Rutas del vino** Ribera del Duero y Arlanza (consorcios): directorios de
  bodegas visitables; techo `parcial`.
- **RGSEAA** (registro sanitario de AESAN): existencia y razón social de
  industrias alimentarias; techo `parcial`.
- Ayuntamientos, prensa local (Diario de Burgos, BurgosConecta, El Correo de
  Burgos) y turismo comarcal (Las Merindades, Ribera del Duero, Arlanza):
  fuentes secundarias para actividad o cierre.
- Webs, tiendas, perfiles y fichas de Maps ya presentes en el CSV: primera
  fuente si pertenecen claramente al productor (comprobar `link-ownership`).

## Plan de ejecución y worklist

Lotes por sector y zona para reutilizar fuentes. Tamaño 8-20 filas. Los lotes
1-23 cubren las 342 filas sin solaparse; el 24 es cierre transversal.

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Al cerrar un lote,
actualiza su fila (estado, fecha y nota corta con verificadas/parciales/
purgas/fusiones/VO resueltos) y la sección Estado si cambia el snapshot.

| # | Lote | Filas | Estado | Notas iniciales |
|---|---|---:|---|---|
| 1 | Charcutería · Burgos capital | 14 | ✅ 2026-07-06 | 7 verificadas, 2 parciales, 6 purgas (asociación morcilla, IGP morcilla, cortadores de jamón, COBUR cerrada/absorbida por Uvesa, Incarsa B2B), 1 fusión (Hnos. González → `embutidos-hermanos-gonzalez-merindad-de-rio-ubierna`, renombrado en lote 2). VO: 4 nuevos `sí` con canal (marketplace/ecommerce), 1 `no`. Geo-warning de la asociación resuelto. |
| 2 | Charcutería · alfoz y Arlanza norte | 11 | ✅ 2026-07-06 | 9 verificadas (2 ya lo estaban), 1 fusión (`morcillas-de-cardena` → `embutidos-de-cardena-cardenadijo`, mismo tel/dirección, la web vieja redirige 301 a la actual). Sotopalacios ×3 → `Merindad de Río Ubierna` (slugs renombrados); Villafuertes/Vizmalo confirman hueco de referencia (sin forzar coords). VO: 7 nuevos `sí` con canal (todo ecommerce salvo Zael: marketplace\|whatsapp\|email), 2 quedan `no comprobado` por prudencia (Águeda, Hermanos Masa). `granja-zael-zael` recategorizada Charcutería→Carnes. |
| 3 | Charcutería · Ribera del Duero y Lerma | 14 | ✅ 2026-07-06 | 11 verificadas, 1 parcial, 3 purgas (IGP Lechazo regional, matadero de La Cueva de Roa por alcance, Duque de Lerma extinguida 2024), 1 fusión (Cárnicas/Morcilla Cuevas Aranda). Recategorizadas: Páramo del Cid → Carnes (y municipio Aranda de Duero → Caleruega, sede vs granja real), La Fonda del Prado → Conservas. Gumiel del Mercado → Gumiel de Mercado (grafía + slug). VO: 10 nuevos `sí` con canal (7 ecommerce, 1 marketplace, 1 telefono\|email, 1 telefono), 2 quedan `no comprobado` por prudencia. |
| 4 | Charcutería · Merindades, Bureba y Demanda | 17→14 | ✅ 2026-07-07 | 11 verificadas (1 ya lo estaba), 1 parcial, 2 purgas (asociación de criadores de potro `not-producer` + su gemela "Grupo Amicar 8" `closed`, sociedad extinguida), 1 fusión (Productos El Peñedo → Sabores de Quintanar, mismo negocio renombrado), 1 purga más (Embutidos La Castellana `closed`, concurso de acreedores 2019). VO: 6 nuevos `sí` con canal (ecommerce salvo Casalba ecommerce\|marketplace) + cuarentena de La Villarcayesa resuelta (sí, ecommerce). Carne de la Buena: municipio/slug renombrado a Alfoz de Santa Gadea. Jamones el Pelayo: grafía de municipio normalizada. |
| 5 | Bodega · Roa y ribera del Riaza | 18 | ✅ 2026-07-07 | 18 verificadas (9 ya lo estaban: 4 HEREDADO + 5 nuevas), 0 parciales, 0 purgas. Roa de Duero→Roa: 7 slugs renombrados con merge (nombre oficial INE es «Roa», confirmado en Wikipedia; «Roa de Duero» solo pervive como dominio del ayuntamiento). San Martín de Rubiales: grafía normalizada (tilde), slug sin cambios. VO: 12 `sí` con canal (11 ecommerce + 1 ecommerce\|whatsapp: Dominio de Calogía), 6 `no comprobado` (Valreinas, Briones Abad/Cantamuda, Francisco Barona, Lambuena, Hornillos Ballesteros, SEI Solo: solo contacto directo, sin carrito ni pedido anunciado). Cuarentenas resueltas: Condado de Haza y Alonso del Yerro (sí sin canal → sí ecommerce), Hercal (HEREDADO parcial + VO=no → verificado + sí ecommerce, promovida con fuente propia). Bodegas Raíz y Quesos Páramo de Guzmán: nombre mixto confirmado real (continúa proyecto de quesos 1985 + bodega 1998), se mantiene en Bodega. Milénico vende por tienda propia de marca "Iberian Winds" (misma dirección/teléfono, no reventa ajena). 6 imágenes renombradas por los merges de slug. |
| 6 | Bodega · ribera oeste (Pedrosa–Fuentecén) | 16 | ✅ 2026-07-08 | 16 verificadas, 0 parciales, 0 purgas. 3 renombres con merge a Pedrosa de Duero (Viyuela desde Boada de Roa, Rodero desde Quintanamanvirgo, Traslascuestas desde la errata «Predrosa»: su web dice Valcavado de Roa). Ortega Fournier → Dominio Fournier (comprada por González Byass en 2019; web dominiofournier.com, email antiguo retirado). VO: 7 nuevos `sí` con canal (6 ecommerce + Abadía de Acón ecommerce\|suscripcion; Linaje Garsea vende vía elventorro.com y Traslascuestas vía tienda.pierola.com, tiendas del propio negocio/grupo), 9 `no comprobado` (solo catálogo/contacto). |
| 7 | Bodega · La Horra, Pidio y Sotillo | 20 | ✅ 2026-07-08 | 19 verificadas (4 ya lo estaban), 1 parcial (Valdaya, web propia caída), 0 purgas. 3 cuarentenas resueltas: Asenjo-Manso y Balbás → `sí` ecommerce, Fuentenarro → `no comprobado` (sin carrito real). Cillar de Silos/Dominio del Pidio: dos bodegas reales de la familia Aragón, se mantienen ambas. Copaboca Ribera confirmada como instalación real y distinta de Villalmanzo (nota para lote 10). Grafía SOTILLO normalizada. VO: 14 nuevos `sí` con canal (13 ecommerce + 1 marketplace: Tinto Arroyo/Catatú). 2 dominios corregidos por rotos (Los Olmos, Valle de Monzón) + 2 por redirect 301 (Figuero, Copaboca). |
| 8 | Bodega · Aranda de Duero | 18 | ⬜ | Consorcio Ruta del Vino (purga probable); Montegaredo geo-warning; La Aguilera→Aranda; Izquierdo comparte tel con apícola (lote 18); grafía ARANDA. |
| 9 | Bodega · Gumiel, Fuentelcésped y sureste | 18 | ⬜ | Díaz Bayo ×2 (¿fusión?); Milvus/San Andrés mismo tel (¿marca de la coop?); grafía GUMIEL; Hinojar del Rey y La Vid sin centroide. |
| 10 | Bodega · Arlanza, eje Lerma | 17 | ⬜ | Consejo DO Arlanza (purga probable) + 5 bodegas con web=arlanza.org y VO=no en bloque (re-derivar); Lerma/Nabal mismo tel. Hallazgo del lote 7: `copaboca-arlanza-villalmanzo` comparte dominio/tel con `copaboca-ribera-sotillo-de-la-ribera` (ya verificada); copaboca.com confirma Villalmanzo como instalación real y distinta ("nuestra última adquisición", D.O. Arlanza) — no purgar como duplicado, verificar con fuente propia igualmente. |
| 11 | Bodega · Arlanza este, capital y atípicas | 17 | ⬜ | 3 geo-warnings sede-vs-bodega (Arlanza, Sierra, Vizcarra); El Ternero (enclave, no purgar de oficio); Agua de Corconte recat; vermutería (trío Victoria); 3 web=arlanza.org. |
| 12 | Pan y pastelería · capital, Bureba y norte | 17 | ⬜ | Par Cámara/El Horno de Burgos (mismo grupo); Maltranilla a resolver; varios SIN WEB (Maps/redes). |
| 13 | Pan y pastelería · Ribera, Arlanza y oeste | 15 | ⬜ | La Torta de Aranda con municipio Valladolid (¿otra provincia?); Tudanca (grupo con bodega, lote 8); herencia Aranda con VO=no a re-derivar. |
| 14 | Lácteos y quesos · Merindades y Bureba | 12 | ⬜ | Municipios sucios (Las Machorras, Rioseco, Zaballa…); 2 cuarentenas VO (Ovejero, Las Nieves); mantequilla de Espinosa. |
| 15 | Lácteos y quesos · centro, Odra y sur | 14 | ⬜ | Pares Mostelares/Ilujor y Vidal/Altoesgueva (mismo tel/dominio); Vadorrey comparte dominio con matadero (lote 3). |
| 16 | Despensa artesanal · capital y sur | 13 | ⬜ | Slowfood (purga probable); olla podrida (identidad/alcance); caracoles ×2; bacalao Bilbasa sin web. |
| 17 | Despensa artesanal · norte y oeste | 11 | ⬜ | Sal de Poza; Tobalina/Quintanaseca sin centroide; conservas Espinosa; café Gometero (tostador). |
| 18 | Miel · capital, Demanda y Arlanza | 14 | ⬜ | Par Izquierdo (con lote 8); 2 cuarentenas VO (Lamemiel, Sabinares del Arlanza); apicultores sin web en la Demanda. |
| 19 | Miel · Merindades y páramos | 8 | ⬜ | Apimara/Arconada geo-warning 85 km (¿homónimo Palencia?); San Mamés de Abar valor sucio; cuarentena Las Loras de Brezo. |
| 20 | Fruta y verdura · provincial | 16 | ⬜ | 2 M.G. (purgas probables, mismo tel); Caderechas; patatas de capital (¿almacén?); Sualdea (¿distribuidor?); Cosidel VO=no re-derivar. |
| 21 | Cerveza artesana · provincial | 16 | ⬜ | Trío Victoria (con lotes 11/22); Alis/La Vache Folle mismo tel; Beer in Burgos vs Siesta (mismo dominio); Gadea geo-warning; Tesela cuarentena. |
| 22 | Licores, Sidra, Chocolate y Dulces | 13 | ⬜ | Conventos (Clarisas Vivar, Iesu Communio); vermut Victoria (trío); Xocolart cuarentena; sidra Brainapple en Miranda. |
| 23 | Trufa, Legumbres, Huevos y resto | 11 | ⬜ | M.G. Alubia (purga probable); Trufa de Burgos=ATRUBUR (¿asociación?); par con Laratruf; cereales-y-servicios (alcance); 2 cuarentenas. |
| 24 | Cierre transversal provincial | 342 | ⬜ | Dedup global, geo-warnings restantes, huecos de municipios.json, cuarentena VO a cero, coverage.json, verify:data. |

## Alcance exacto de cada lote (slugs congelados el 2026-07-06)

Formato: `slug · municipio — flags`. `SIN WEB` = sin dominio propio en el CSV
(empieza por Maps/redes/fuentes locales); `sin Maps` = sin ficha enlazada;
`HEREDADO x` = estado no-pendiente que hay que reauditar; `cuarentena` =
`Venta online=sí` sin canal. Si un flag dice `PURGA PROBABLE`, confírmalo
antes de ejecutar la purga (regla 6).

### Lote 1 · Charcutería — Burgos capital (14) — ✅ 2026-07-06

```text
asociacion-de-fabricantes-de-morcilla-de-burgos-burgos · Burgos — SIN WEB; GEO-WARNING 65,6 km (junto a Villarcayo); PURGA PROBABLE not-producer; tel compartido con `embutidos-rios-villarcayo` (lote 4)
coop-avicola-y-ganadera-de-burgos-burgos · Burgos — cooperativa: alcance según criterio ICAV (regla 8)
cortadores-de-jamon-los-finos-burgos · Burgos — servicio de corte, no elaborador: alcance (regla 8)
demanda-vacuno-burgos · Burgos
embumer-burgos · Burgos — SIN WEB
embutidos-ignacio-cuevas-burgos · Burgos
embutidos-rioseras-burgos · Burgos
embutidos-rojo-burgos · Burgos — SIN WEB
igp-morcilla-de-burgos-burgos · Burgos — PURGA PROBABLE not-producer (IGP como fila); su web es fuente para todo el sector
industrias-carnicas-castellanas-burgos · Burgos
la-antigua-de-gamonal-burgos · Burgos
morcillas-hermanos-gonzalez-burgos · Burgos — tel compartido con `embutidos-hermanos-gonzalez-sotopalacios` (lote 2): ¿dos sedes del mismo obrador?
morcillas-lesmes-burgos · Burgos
viandas-casa-felipe-burgos · Burgos — SIN WEB
```

### Lote 2 · Charcutería — alfoz y Arlanza norte (11→10) — ✅ 2026-07-06

```text
embutidos-de-cardena-cardenadijo · Cardeñadijo — verificado, VO sí (ecommerce). Fusión con `morcillas-de-cardena-cardenadijo` (misma tienda: morcilladeburgos.com redirige 301 a xn--cardeafood-x9a.es); se completan correo/Facebook heredados.
morcillas-tere-quintanilla-vivar · Quintanilla Vivar — verificado, VO sí (ecommerce)
embutidos-hermanos-gonzalez-merindad-de-rio-ubierna · Merindad de Río Ubierna (antes Sotopalacios; slug renombrado) — verificado (heredado de lote 1), VO no. Municipio normalizado: Sotopalacios es la cabecera/pedanía de Merindad de Río Ubierna
morcillas-agueda-merindad-de-rio-ubierna · Merindad de Río Ubierna (antes Sotopalacios; slug renombrado) — verificado, VO no comprobado (web con TLS caducado, sin confirmar mecanismo de pedido vigente)
morcillas-miguel-y-conchi-merindad-de-rio-ubierna · Merindad de Río Ubierna (antes Sotopalacios; slug renombrado) — verificado, VO sí (ecommerce)
embutidos-artesanos-de-villafuertes-villafuertes · Villafuertes — verificado, VO sí (ecommerce). Villafuertes confirmado municipio real sin centroide en la referencia (hueco, no se fuerza)
hermanos-masa-villalbilla-de-burgos · Villalbilla de Burgos — verificado, VO no comprobado (tienda con carrito pero sin pasarela de pago confirmada, uso mixto B2B)
morcillas-la-primi-villalbilla-de-burgos · Villalbilla de Burgos — verificado, VO sí (ecommerce). Web corregida: morcillaslaprimi.com (blog, TLS caducado) → morcillaslaprimi.es (tienda activa)
santa-rosalia-gourmet-vizmalo · Vizmalo — verificado, VO sí (ecommerce). Finca de wagyu/perdiz/vino con elaborados propios (morcilla de wagyu, patés); Vizmalo confirmado municipio real sin centroide (hueco, no se fuerza)
granja-zael-zael · Zael — verificado, VO sí (marketplace|whatsapp|email). Recategorizada Charcutería → Carnes (venden cortes de vacuno, no son elaboradores de embutidos)
```

### Lote 3 · Charcutería — Ribera del Duero y Lerma (16→14) — ✅ 2026-07-06

```text
carnicas-chico-aranda-de-duero · Aranda de Duero — verificado, VO sí (ecommerce, carnicaschico.com)
morcilla-cuevas-aranda-de-duero · Aranda de Duero — verificado, VO sí (ecommerce). Nombre corregido a "Cárnicas Cuevas Aranda"; fusión con carnicas-cuevas-aranda-aranda-de-duero (mismo tel/correo, "Morcilla de Aranda" es solo su línea de morcilla, no otra empresa); se retira el dominio .es (certificado de un sitio ajeno) y se conserva cuevasaranda.com
colear-aranda-de-duero · Aranda de Duero — verificado, VO sí (ecommerce). Cooperativa con tienda online propia de producto envasado: entra (criterio ICAV)
cortadores-de-jamon-delincex-aranda-de-duero · Aranda de Duero — verificado, VO sí (telefono|email). No es solo cortador: elaborador integral de jamón ibérico (Delincex); nombre corregido, FB roto retirado
lecoa-aranda-aranda-de-duero · Aranda de Duero — verificado, VO sí (marketplace, vinosribera.com). Sin web propia
morcillas-el-revillano-aranda-de-duero · Aranda de Duero — verificado, VO sí (ecommerce). Web propia añadida (elrevillano.com)
paramo-del-cid-caleruega · Caleruega (antes Aranda de Duero; slug renombrado) — verificado, VO sí (telefono). Sede administrativa vs granja real: municipio y coordenadas corregidos a Caleruega (centroide); recategorizado Charcutería → Carnes
embutidos-la-dehesilla-gumiel-de-mercado · Gumiel de Mercado (antes Gumiel del Mercado; slug renombrado) — parcial, VO no comprobado. Solo fuentes registrales (estado contradictorio activa/extinguida), sin web/redes propias
morcilla-artesana-de-lerma-lerma · Lerma — verificado, VO no comprobado. Web propia añadida (morcilladelerma.com), sin tienda activa confirmada
paradilla-143-pardilla · Pardilla — verificado, VO sí (ecommerce). Identidad resuelta: ganadería familiar Abad, juego de palabras con el km 143 de la N-I
morcillas-la-ribera-sotillo-de-la-ribera · Sotillo de la Ribera — verificado, VO sí (ecommerce, lariberagourmetonline.com)
la-fonda-del-prado-villalba-de-duero · Villalba de Duero — verificado, VO sí (ecommerce). No es restaurante puro: granja propia + conservas de aves; recategorizado Charcutería → Conservas
```

Purgas y fusiones del lote:
- `i-g-p-lechazo-de-castilla-y-leon-aranda-de-duero` — purga `not-producer` (IGP regional, no productor; imagen huérfana borrada).
- `matadero-frigorifico-ribera-del-duero-la-cueva-de-roa` — purga `out-of-scope` (matadero/comercializadora B2B, sin venta directa; criterio ICAV). Su dominio compartido con `quesos-la-cueva-de-vadorrey-la-cueva-de-roa` (lote 15) queda resuelto: la quesería sigue en solitario.
- `embutidos-duque-de-lerma-lerma` — purga `closed` (Registro Mercantil: extinguida 08/11/2024; dominio caído).
- `carnicas-cuevas-aranda-aranda-de-duero` — fusión en `morcilla-cuevas-aranda-de-duero` (mismo tel/correo, misma empresa).

### Lote 4 · Charcutería — Merindades, Bureba y Demanda (17→14) — ✅ 2026-07-07

```text
morcilla-ortega-briviesca · Briviesca — verificado, VO no comprobado (web propia, contacto sin carrito confirmado)
que-te-den-morcilla-espinosa-de-los-monteros · Espinosa de los Monteros — verificado, VO no comprobado
embutidos-mari-paz-ona · Oña — verificado, VO no comprobado (tienda.html sin catálogo funcional)
embutidos-de-poza-de-la-sal-poza-de-la-sal · Poza de la Sal — verificado, VO sí (ecommerce)
embutidos-contreras-pradanos-de-bureba · Prádanos de Bureba — verificado, VO no comprobado
jamones-el-gemelo-pradoluengo · Pradoluengo — verificado, VO sí (ecommerce)
sabores-de-quintanar-quintanar-de-la-sierra · Quintanar de la Sierra — verificado, VO sí (ecommerce). Fusión con `productos-el-penedo-quintanar-de-la-sierra` (mismo tel/dirección; "Productos El Peñedo" es el nombre anterior de la misma empresa, hoy Sabores de Quintanar)
adolfo-martinez-piernavieja-salas-de-los-infantes · Salas de los Infantes — verificado, VO no comprobado
jamones-el-pelayo-salas-de-los-infantes · Salas de los Infantes (grafía normalizada) — verificado, VO sí (ecommerce)
carne-de-la-buena-alfoz-de-santa-gadea · Alfoz de Santa Gadea (antes Santa Gadea de Alfoz; slug renombrado) — parcial, VO no comprobado. Sin web ni rastro digital independiente; se mantiene con nota (regla 16)
casalba-villamayor-del-rio · Villamayor del Río — verificado, VO sí (ecommerce|marketplace). Villamayor del Río confirmado municipio real sin centroide (hueco, no se fuerza)
embutidos-rios-villarcayo · Villarcayo — verificado, VO sí (ecommerce). Tel compartido con la asociación de fabricantes de morcilla (lote 1, ya purgada): sin conflicto
la-villarcayesa-villarcayo · Villarcayo — verificado (heredado), VO sí (ecommerce). Cuarentena resuelta: tienda online real confirmada
```

Purgas y fusiones del lote:
- `asociacion-de-carne-de-potro-hispano-breton-de-burgos-cabanas-de-virtus` — purga `not-producer` (asociación de criadores, organiza la Feria de San Marcos, no vende directamente).
- `carne-de-potro-hispano-breton-de-burgos-cabanas-de-virtus` — purga `closed` (fila comercial "Grupo Amicar 8"; sociedad extinguida en el registro mercantil, los tres dominios del sector ya no resuelven). Ambas filas gemelas resueltas juntas: ninguna sobrevive.
- `embutidos-la-castellana-villarcayo` — purga `closed` (concurso de acreedores desde 2019, en liquidación, sin cuentas depositadas desde 2017).
- `productos-el-penedo-quintanar-de-la-sierra` — fusión en `sabores-de-quintanar-quintanar-de-la-sierra` (mismo teléfono y dirección; nombre anterior de la misma empresa).

### Lote 5 · Bodega — Roa y ribera del Riaza (18) — ✅ 2026-07-07

```text
paramo-de-corcos-moradillo-de-roa · Moradillo de Roa — verificado, VO=sí (ecommerce)
bodegas-y-vinedos-monteabellon-nava-de-roa · Nava de Roa — verificado, VO=sí (ecommerce)
valreinas-vinedo-y-bodega-nava-de-roa · Nava de Roa — verificado, VO=no comprobado
bodega-briones-abad-roa · Roa — verificado, VO=no comprobado
bodega-condado-de-haza-roa · Roa — verificado, cuarentena resuelta: VO=sí (ecommerce)
bodegas-duron-roa · Roa — verificado, VO=sí (ecommerce)
bodegas-hercal-roa · Roa — promovida a verificado (era HEREDADO parcial), VO=sí re-derivado (ecommerce)
bodegas-raiz-y-quesos-paramo-de-guzman-roa · Roa — nombre mixto confirmado real, verificado, VO=sí (ecommerce)
vinedos-alonso-del-yerro-roa · Roa — verificado, cuarentena resuelta: VO=sí (ecommerce)
bodegas-francisco-barona-roa · Roa — renombrada desde `-roa-de-duero` (merge); verificado, VO=no comprobado
bodegas-lambuena-roa · Roa — renombrada desde `-roa-de-duero` (merge); verificado, VO=no comprobado
bodegas-lopez-cristobal-s-l-roa · Roa — renombrada desde `-roa-de-duero` (merge); verificado, VO=sí (ecommerce)
bodegas-rauda-roa · Roa — renombrada desde `-roa-de-duero` (merge); verificado, VO=sí (ecommerce)
dominio-de-calogia-roa · Roa — renombrada desde `-roa-de-duero` (merge); verificado, VO=sí (ecommerce|whatsapp)
hornillos-ballesteros-vinos-mibal-roa · Roa — renombrada desde `-roa-de-duero` (merge); verificado, VO=no comprobado
sei-solo-bodegas-y-vinedos-roa · Roa — renombrada desde `-roa-de-duero` (merge); verificado, VO=no comprobado
milenico-san-martin-de-rubiales · San Martín de Rubiales — grafía normalizada (tilde), verificado, VO=sí (ecommerce)
pomar-vinedos-valdezate · Valdezate — verificado, VO=sí (ecommerce)
```

### Lote 6 · Bodega — ribera oeste, Pedrosa–Fuentecén (16) — ✅ 2026-07-08

```text
bodegas-y-vinedos-gallego-zapatero-s-anguix · Anguix — verificado, VO=sí (ecommerce, tienda propia con carrito)
bodegas-y-vinedos-ortega-fournier-berlangas-de-roa · Berlangas de Roa — verificado, VO=no comprobado. Renombrada a "Dominio Fournier": González Byass compró la bodega de Finca El Pinar en 2019; ofournier.com redirige 301 a dominiofournier.com (web actualizada, email antiguo retirado; slug estable por regla 20)
bodegas-viyuela-pedrosa-de-duero · Pedrosa de Duero (antes Boada de Roa; slug renombrado con merge) — verificado, VO=no comprobado (tienda.html es plantilla sin precios ni carrito). Boada de Roa es E.L.M. de Pedrosa de Duero, no hueco de la referencia
abadia-de-acon-s-l-castrillo-de-la-vega · Castrillo de la Vega — verificado, VO=sí (ecommerce|suscripcion: tienda propia + Club Abadía)
bodega-san-roque-de-la-encina-castrillo-de-la-vega · Castrillo de la Vega — verificado, VO=sí (ecommerce, pinadillo.com/tienda/). Cooperativa elaboradora (1956), marca Monte Pinadillo: entra por regla 7
bodegas-y-vinedos-del-linaje-garsea-castrillo-de-la-vega · Castrillo de la Vega — verificado, VO=sí (ecommerce vía elventorro.com, tienda del propio negocio familiar; tel compartido con lote 13 resuelto: mismo grupo, dos unidades)
bodega-doble-r-fuentecen · Fuentecén — verificado, VO=no comprobado (solo catálogo y contacto)
bodegas-hemar-fuentecen · Fuentecén — verificado, VO=no comprobado (solo catálogo y contacto)
bodegas-torrederos-s-l-fuentelisendo · Fuentelisendo — verificado, VO=sí (ecommerce, torrederos.com/tienda/)
bodegas-vina-mambrilla-mambrilla-de-castrejon · Mambrilla de Castrejón — verificado, VO=no comprobado (vinos Alidis, sin tienda)
pagos-de-matanegra-olmedillo-de-roa · Olmedillo de Roa — verificado, VO=sí (ecommerce, pagosdematanegra.es/web/tienda/)
ramos-ducher-olmedillo-de-roa · Olmedillo de Roa — verificado, VO=no comprobado (solo catálogo)
bodegas-hnos-paramo-arroyo-pedrosa-de-duero · Pedrosa de Duero — verificado, VO=no comprobado (ecológicos, sin carrito)
bodegas-hnos-perez-pascuas-vina-pedrosa-pedrosa-de-duero · Pedrosa de Duero — verificado, VO=no comprobado (tienda.perezpascuas.com ya no resuelve)
bodegas-traslascuestas-pedrosa-de-duero · Pedrosa de Duero (antes errata «Predrosa»; slug renombrado con merge) — verificado, VO=sí (ecommerce vía tienda.pierola.com, tienda del propio grupo Fernández de Piérola con sección Bodega Traslascuestas). Su web sitúa la bodega en Valcavado de Roa (E.L.M. de Pedrosa de Duero); dirección y descripción corregidas
bodegas-rodero-pedrosa-de-duero · Pedrosa de Duero (antes Quintanamanvirgo; slug renombrado con merge) — verificado, VO=no comprobado (web informativa/enoturismo, sin tienda). Su web da Ctra. Boada s/n, 09314 Pedrosa de Duero
```

### Lote 7 · Bodega — La Horra, Quintana del Pidio y Sotillo (20) — ✅ 2026-07-08

```text
bodega-marques-de-velilla-la-horra · La Horra — verificado, VO=sí (ecommerce, tienda propia con carrito). Instalación única en Ctra. de Sotillo s/n, La Horra (oficinas de exportación en Madrid no son bodega)
bodegas-asenjo-manso-la-horra · La Horra — verificado, VO=sí (ecommerce, tienda.asenjo-manso.com con carrito y precios). Cuarentena resuelta: heredaba `sí` sin canal. Marca comercial Ceres Bodegas y Viñedos, La Horra desde 1908
bodegas-balbas-la-horra · La Horra — verificado, VO=sí (ecommerce, balbas.es/e-shop-balbas/ con carrito y precios). Cuarentena resuelta: heredaba `sí` sin canal. Bodega desde 1777
bodegas-fuentenarro-la-horra · La Horra — verificado, VO=no comprobado. Cuarentena degradada: heredaba `sí` sin canal, pero /tienda/ solo pide contactar por email/teléfono para "consultar precios y condiciones" (sin carrito ni pedido remoto anunciado)
bodegas-garcia-figuero-la-horra · La Horra — verificado, VO=sí (ecommerce, figuero.es/tienda/ con carrito). Web actualizada: tintofiguero.com redirigía 301 a figuero.es (rebranding a Bodegas Figuero)
bodegas-la-horra-la-horra · La Horra — verificado (reauditado), VO=no comprobado. Bodega del grupo Roda (marca Corimbo), fundada 2009; sin tienda online, solo visitas/catas y Club Roda
dominio-de-montelahorra-la-horra · La Horra — verificado, VO=sí (ecommerce, delariberavinos.com, tienda propia autodeclarada que vende en exclusiva sus líneas). Nombre limpiado de ruido de volcado: «DOMINIO DE MONTELAHORRA.» → «Dominio de Montelahorra»
vina-sastre-la-horra · La Horra — verificado, VO=no comprobado. Bodegas Hermanos Sastre (1992); su único botón de compra apunta a market.tierradesabor.es/products?search=sastre, que da 404 (plataforma caída) — no se degrada a `no`, se mantiene no comprobado
bodega-los-olmos-quintana-del-pidio · Quintana del Pidio — verificado, VO=sí (ecommerce, bodegalosolmos.com/tienda/ con carrito). Web corregida: el CSV traía `bodegaslosolmos.com` (no resuelve DNS); dominio real es `bodegalosolmos.com` (singular)
bodegas-casajus-quintana-del-pidio · Quintana del Pidio — verificado, VO=sí (ecommerce, tienda propia integrada). Familia Calvo Casajús desde 1993
bodegas-cillar-de-silos-quintana-del-pidio · Quintana del Pidio — verificado, VO=sí (ecommerce, cillardesilos.es/shop/ WooCommerce). Familia Aragón (fundada 1994). Comparte teléfono con `dominio-del-pidio-quintana-del-pidio`: confirmado por prensa que son dos bodegas reales de la misma familia (ver nota abajo), se mantienen ambas filas
bodegas-prado-de-olmedo-quintana-del-pidio · Quintana del Pidio — verificado, VO=sí (ecommerce, tienda.pradodeolmedo.com con carrito y precios). Familia Fernández Gil, 46 ha propias
bodegas-valle-de-monzon-quintana-del-pidio · Quintana del Pidio — verificado, VO=no comprobado (sitio informativo, solo contacto). Web corregida: vallemonzon.com da error TLS persistente en todos los protocolos; confirmado por el espejo valledemonzon.es (mismo contenido/dirección/teléfono) y por el registro oficial de la DO Ribera del Duero
dominio-del-pidio-quintana-del-pidio · Quintana del Pidio — verificado, VO=sí (ecommerce, tienda.dominiodelpidio.com con carrito). Segunda bodega real de la familia Aragón (lanzada 2014, bodegas-cueva propias restauradas, vinos exclusivamente municipales de Quintana del Pidio); comparte teléfono con Cillar de Silos por ser el mismo grupo, no se fusiona (precedente Flores y Jiménez, Ávila)
bodega-rubiejo-sotillo-de-la-ribera · Sotillo de la Ribera (municipio normalizado desde «SOTILLO DE LA RIBERA»; slug sin cambios) — verificado, VO=sí (ecommerce, rubiejo.com/tienda-online/ con carrito)
bodegas-ismael-arroyo-sotillo-de-la-ribera · Sotillo de la Ribera — verificado, VO=sí (ecommerce, valsotillo.com/tienda/ con carrito, precios 6,55-68,50€, envío gratis desde 60€). Familia Arroyo desde 1979
bodegas-s-arroyo-sotillo-de-la-ribera · Sotillo de la Ribera — verificado, VO=sí (marketplace, Catatú: tintoarroyo.com designa explícitamente ese marketplace como "Tienda online"/"Comprar Online" en cabecera y pie, sin carrito propio)
bodegas-valdaya-sotillo-de-la-ribera · Sotillo de la Ribera — **parcial** (no promovida a verificado), VO=no comprobado. valdaya.com da error de certificado TLS apuntando a un hosting ajeno (`*.srv.cat`) en todas las rutas probadas; identidad, dirección y teléfono confirmados solo por el registro oficial de la DO Ribera del Duero (techo `parcial`, regla 5); el enlace de venta online de ese registro (dehaanaltes.com) redirige a una bodega distinta de Terra Alta (herenciaaltes.com), enlace obsoleto
copaboca-ribera-sotillo-de-la-ribera · Sotillo de la Ribera — verificado, VO=sí (ecommerce, copaboca.com/tienda/ con carrito y precios). Web actualizada: copaboca.es redirigía 301 a copaboca.com. Instalación real y propia en Sotillo confirmada por la propia web del grupo (noticia de placas solares nombra "Tordesillas, Sotillo de la Ribera y Torrecilla") y por terranostrum.es (Antigua Fábrica de Quesos, Avda. Cid Campeador, coincide con el CSV); distinta de Villalmanzo (D.O. Arlanza, "nuestra última adquisición") — dos bodegas reales del mismo grupo, se mantienen ambas filas (ver nota lote 10)
bodegas-abadia-la-arroyada-terradillos-de-esgueva · Terradillos de Esgueva — verificado, VO=no comprobado. Identidad, dirección y teléfono confirmados por la web propia; sin tienda online
```

Notas del lote: **Cillar de Silos / Dominio del Pidio** — no es una fila
duplicada. La prensa especializada (sobremesa.es, spanishwinelover.com,
unvino.es) confirma que Dominio del Pidio es la segunda bodega que lanzó la
familia Aragón en 2014, con cinco lagares y siete bodegas-cueva restauradas
del barrio histórico de Quintana del Pidio, dedicada en exclusiva a vinos
municipales — un proyecto real y diferenciado de Cillar de Silos aunque
comparta teléfono y parte de la gestión (precedente Flores y Jiménez en
Ávila). **Copaboca** — la fila de Sotillo de la Ribera queda verificada con
instalación real propia; la de Villalmanzo (lote 10) comparte dominio/tel
pero corresponde a una adquisición posterior y distinta según la propia web
del grupo, así que tampoco debería fusionarse por defecto, aunque conviene
verificarla con fuente propia en su lote.

### Lote 8 · Bodega — Aranda de Duero (18) — ⬜

```text
altos-del-terral-aranda-de-duero · Aranda de Duero
bodega-finca-cantaburros-aranda-de-duero · Aranda de Duero
bodega-tierra-aranda-aranda-de-duero · Aranda de Duero
bodega-vina-buena-aranda-de-duero · Aranda de Duero
bodegas-el-lagar-de-isilla-aranda-de-duero · Aranda de Duero — relación con `lagar-de-isilla-la-vid` (lote 9): mismo grupo, resolver si son dos filas legítimas
bodegas-martin-berdugo-aranda-de-duero · Aranda de Duero
bodegas-nabal-aranda-de-duero · Aranda de Duero — tel compartido con `bodegas-lerma-lerma` (lote 10): ¿mismo grupo?
bodegas-vetusta-aranda-de-duero · Aranda de Duero
bodegas-y-vinedos-roberik-aranda-de-duero · Aranda de Duero
bodegas-zapata-aranda-de-duero · ARANDA DE DUERO — grafía → «Aranda de Duero»
consorcio-ruta-del-vino-ribera-del-duero-aranda-de-duero · Aranda de Duero — PURGA PROBABLE not-producer (consorcio); web como fuente
dani-mabe-wines-aranda-de-duero · Aranda de Duero
feliz-aranda-de-duero · Aranda de Duero — nombre corto/dudoso: resolver identidad
junciera-jine-aranda-de-duero · Aranda de Duero
montegaredo-s-l-aranda-de-duero · Aranda de Duero — GEO-WARNING 24,8 km (junto a Pedrosa de Duero): resolver municipio real
raimundo-izquierdo-garcia-aranda-de-duero · Aranda de Duero — tel compartido con `apicola-izquierdo-aranda-de-duero` (lote 18): ¿misma persona, viña+miel? resolver categorías
vinedos-la-nava-s-l-aranda-de-duero · Aranda de Duero — dominio compartido con `pasteleria-tudanca-aranda-de-duero` (lote 13): grupo Tudanca, ambas pueden ser reales
bodegas-dominio-de-cair-la-aguilera · La Aguilera — municipio sin centroide → Aranda de Duero (pedanía), slug con merge
```

### Lote 9 · Bodega — Gumiel, Fuentelcésped y sureste (18) — ⬜

```text
bodegas-coruna-del-conde-coruna-del-conde · Coruña del Conde
ermita-del-conde-coruna-del-conde · Coruña del Conde
bodegas-valdecamellas-fresnillo-de-las-duenas · Fresnillo de las Dueñas — SIN WEB
bodega-diaz-bayo-hermanos-s-l-fuentelcesped · Fuentelcésped — dominio y tel compartidos con `bodegas-nuestro-de-diaz-bayo-s-l-fuentelcesped`: ¿misma bodega con dos razones sociales? probable fusión
bodegas-de-blas-serrano-fuentelcesped · Fuentelcésped
bodegas-nuestro-de-diaz-bayo-s-l-fuentelcesped · Fuentelcésped — dominio y tel compartidos con `bodega-diaz-bayo-hermanos-s-l-fuentelcesped`
bodegas-pascual-fuentelcesped · Fuentelcésped
bodegas-abadia-san-quirce-gumiel-de-izan · GUMIEL DE IZÁN — grafía → «Gumiel de Izán»
bodegas-vinum-vitae-gumiel-de-izan · Gumiel de Izán
dominio-basconcillos-gumiel-de-izan · Gumiel de Izán
ferratus-gumiel-de-izan · Gumiel de Izán
hinojar-wines-hinojar-del-rey · Hinojar del Rey — municipio sin centroide → resolver INE (¿Huerta de Rey?)
lagar-de-isilla-la-vid · La Vid — municipio sin centroide → La Vid y Barrios; relación con `bodegas-el-lagar-de-isilla-aranda-de-duero` (lote 8)
bodega-la-milagrosa-milagros · Milagros
bodegas-altos-de-enebro-milagros · Milagros
bodegas-valdubon-milagros · Milagros — SIN WEB
bodegas-milvus-zazuar · Zazuar — tel compartido con `bodegas-san-andres-zazuar`: ¿marca de la cooperativa? probable fusión
bodegas-san-andres-zazuar · Zazuar — tel compartido con `bodegas-milvus-zazuar`
```

### Lote 10 · Bodega — Arlanza, eje Lerma (17) — ⬜

```text
bodegas-carrillo-de-albornoz-avellanosa-de-muno · Avellanosa de Muñó
bodegas-monte-aman-castrillo-solarana · Castrillo Solarana — municipio sin centroide → resolver INE (probable hueco)
vina-y-tia-cilleruelo-de-abajo · Cilleruelo de Abajo — HEREDADO parcial; VO=no heredado (re-derivar); web=arlanza.org AJENA (retirar y buscar propia); sin Maps
alonso-angulo-lerma · Lerma — HEREDADO parcial; VO=no heredado (re-derivar); web=arlanza.org AJENA; sin Maps
bodegas-lerma-lerma · Lerma — tel compartido con `bodegas-nabal-aranda-de-duero` (lote 8)
consejo-regulador-de-d-o-arlanza-lerma · Lerma — PURGA PROBABLE not-producer (consejo regulador como fila); su web arlanza.org es fuente del sector
decorus-lerma · Lerma
sabinares-y-vinas-lerma · Lerma — HEREDADO parcial; sin Maps
vinedos-de-altura-lerma · Lerma — HEREDADO parcial; VO=no heredado (re-derivar); web=arlanza.org AJENA; sin Maps
buezo-vendimias-seleccionadas-y-vinos-de-guarda-mahamud · Mahamud
enologica-wamba-pampliega · Pampliega
gotas-de-rocio-quintanilla-del-agua · Quintanilla del Agua — municipio sin centroide → Quintanilla del Agua y Tordueles
agrobauto-sdad-cooperativa-quintanilla-del-agua-y-tordueles · Quintanilla del Agua y Tordueles — HEREDADO parcial; VO=no heredado (re-derivar); web=arlanza.org AJENA; sin Maps
bodegas-araus-villahoz · Villahoz
bodegas-arlese-villalmanzo · Villalmanzo — HEREDADO parcial; VO=no heredado (re-derivar); web=arlanza.org AJENA; sin Maps
copaboca-arlanza-villalmanzo · Villalmanzo — dominio y tel compartidos con `copaboca-ribera-sotillo-de-la-ribera` (lote 7)
melequin-villalmanzo · Villalmanzo — HEREDADO parcial; VO=no heredado (re-derivar); web=arlanza.org AJENA; sin Maps
```

### Lote 11 · Bodega — Arlanza este, capital y atípicas (17) — ⬜

```text
barbastro-burgos · Burgos — SIN WEB
bodegas-arlanza-burgos · Burgos — GEO-WARNING 33,5 km (coords junto a Villalmanzo): sede vs bodega, corregir municipio+slug con merge
bodegas-palacio-de-lerma-s-l-burgos · Burgos — ¿sede en capital y bodega en Lerma? resolver como las anteriores
bodegas-sierra-burgos · Burgos — GEO-WARNING 33,5 km (junto a Villalmanzo): ídem
bodegas-vizcarra-burgos · Burgos — GEO-WARNING 78,7 km (junto a Mambrilla de Castrejón): ídem
la-rulo-burgos · Burgos
vermuteria-victoria-burgos · Burgos — tel compartido con `cerveza-victoria-burgos` (lote 21) y `vermut-victoria-burgos` (lote 22): trío Victoria, ¿bar + fábrica + marca? resolver los tres juntos y dejar solo elaboradores
cisterciense-cardena-castrillo-del-val · Castrillo del Val — monasterio de Cardeña: bodega/obrador monástico real
agua-de-corconte-cilleruelo-de-bezana · Cilleruelo de Bezana — RECAT: agua mineral, no bodega (precedente Ursu en Ávila); municipio sin centroide → Valle de Valdebezana
bodega-covarrubias-covarrubias · Covarrubias — HEREDADO parcial; VO=no heredado (re-derivar); web=arlanza.org AJENA; sin Maps
bodegas-valdable-covarrubias · Covarrubias
ortegaz-covarrubias · Covarrubias — HEREDADO parcial; VO=no heredado (re-derivar); web=arlanza.org AJENA; sin Maps
vinos-sinceros-covarrubias · Covarrubias — HEREDADO verificado; VO=sí SIN canal (cuarentena); sin Maps
hacienda-el-ternero-haro · Haro — enclave burgalés de Miranda de Ebro rodeado de La Rioja, con dirección postal de Haro: resolver municipio con fuente antes de decidir (regla 19)
termino-de-miranda-miranda-de-ebro · Miranda de Ebro
alma-silense-santo-domingo-de-silos · Santo Domingo de Silos — HEREDADO parcial; VO=no heredado (re-derivar); sin Maps
bodegas-septien-santo-domingo-de-silos · Santo Domingo de Silos — HEREDADO parcial; VO=no heredado (re-derivar); web=arlanza.org AJENA; sin Maps
```

### Lote 12 · Pan y pastelería — capital, Bureba y norte (17) — ⬜

```text
el-obrador-del-convento-belorado · Belorado — obrador conventual: entra si elabora (regla 10)
almendras-sarralde-briviesca · Briviesca — ¿pan o frutos secos/dulces? confirmar categoría
el-horno-de-burgos-burgos · Burgos — dominio y tel compartidos con `panaderias-camara-burgos`: mismo grupo, ¿dos filas legítimas?
florbu-burgos · Burgos
juarrenos-alta-pasteleria-burgos · Burgos
panaderias-camara-burgos · Burgos — dominio y tel compartidos con `el-horno-de-burgos-burgos`
pasteleria-merey-burgos · Burgos
jardin-de-la-abadesa-cardenadijo · Cardeñadijo — SIN WEB
el-horno-de-ceci-espinosa-de-los-monteros · Espinosa de los Monteros — SIN WEB
pastelerias-la-dolce-vita-espinosa-de-los-monteros · Espinosa de los Monteros
riarsi-confiteria-arroyo-espinosa-de-los-monteros · Espinosa de los Monteros
reposteria-artesana-divina-pastora-fresno-de-rio-tiron · Fresno de Río Tirón
horno-ortiz-maltranilla · Maltranilla — SIN WEB; municipio sin centroide → resolver INE (¿Valle de Mena?)
dulcipay-ona · Oña — SIN WEB
panaderia-pancorbopan-pancorbo · Pancorbo — SIN WEB
dulce-tentacion-sotopalacios · Sotopalacios — SIN WEB; municipio sin centroide → Merindad de Río Ubierna
panaderia-ordonez-tardajos · Tardajos
```

### Lote 13 · Pan y pastelería — Ribera, Arlanza y oeste (15) — ⬜

```text
magdalenas-de-las-heras-aranda-de-duero · Aranda de Duero
panaderia-panaranda-aranda-de-duero · Aranda de Duero — HEREDADO verificado; VO=no heredado (re-derivar)
panaderia-serendipia-aranda-de-duero · Aranda de Duero — HEREDADO parcial; VO=no heredado (re-derivar); SIN WEB
pasteleria-tudanca-aranda-de-duero · Aranda de Duero — HEREDADO verificado; VO=no heredado (re-derivar); dominio compartido con `vinedos-la-nava-s-l-aranda-de-duero` (lote 8, grupo Tudanca)
el-ventorro-castrillo-de-la-vega · Castrillo de la Vega — tel compartido con `bodegas-y-vinedos-del-linaje-garsea-castrillo-de-la-vega` (lote 6): resolver relación
panaderia-antonio-de-las-heras-la-horra · La Horra — SIN WEB
panaderia-artesana-labrador-lerma · Lerma
dulces-gloria-melgar-de-fernamental · Melgar de Fernamental — SIN WEB
productos-perines-milagros · Milagros
panaderia-eduardo-antolin-peral-de-arlanza · Peral de Arlanza — SIN WEB
panaderia-pasteleria-espiga-real-quintanar-de-la-sierra · Quintanar de la Sierra — SIN WEB
pasteleria-los-infantes-salas-de-los-infantes · Salas de los Infantes
mi-dulce-anjana-santa-maria-del-campo · Santa María del Campo — SIN WEB
obrador-del-esgueva-tortoles-de-esgueva · Tórtoles de Esgueva — SIN WEB
la-torta-de-aranda-valladolid · Valladolid — SIN WEB; ¿OTRA PROVINCIA? nombre de producto como fila: resolver si hay obrador burgalés real detrás o purga
```

### Lote 14 · Lácteos y quesos — Merindades y Bureba (12) — ⬜

```text
quesos-la-majada-de-barcina-barcina-de-los-montes · Barcina de los Montes — SIN WEB; municipio sin centroide → Oña
productos-lacteos-ovejero-briviesca · Briviesca — HEREDADO verificado; VO=sí SIN canal (cuarentena)
quesos-carreras-busto-de-bureba · Busto de Bureba — SIN WEB
quesos-los-altos-dobro · Dobro — SIN WEB; municipio sin centroide → Los Altos
delicatessen-castro-valnera-espinosa-de-los-monteros · Espinosa de los Monteros — SIN WEB
mantequeria-las-nieves-espinosa-de-los-monteros · Espinosa de los Monteros — HEREDADO verificado; VO=sí SIN canal (cuarentena)
la-granja-burebana-grisalena · Grisaleña — HEREDADO parcial; VO=no heredado (re-derivar)
ganaderia-ortiz-las-machorras-espinosa-de-los-monteros-09566 · Las Machorras, Espinosa de los Monteros 09566 — SIN WEB; limpiar municipio → Espinosa de los Monteros (slug con merge)
queseria-artesanal-maite-medianas-de-mena · Medianas de Mena — SIN WEB; municipio sin centroide → Valle de Mena
quesos-santa-gadea-rioseco-valle-de-manzanedo · Rioseco (Valle de Manzanedo) — limpiar municipio → Valle de Manzanedo (slug con merge)
el-carluque-valdenoceda · Valdenoceda — municipio sin centroide → Merindad de Valdivielso
quesos-ugala-zaballa-zaballa · Zaballa — municipio sin centroide: resolver (¿Valle de Losa? ¿Álava?)
```

### Lote 15 · Lácteos y quesos — centro, Odra y sur (14) — ⬜

```text
lacteos-arlanzon-arlanzon · Arlanzón
nieto-y-herrero-artesanos-queseros-arlanzon-e-a-r-arlanzon · Arlanzón
lacteas-flor-de-burgos-burgos · Burgos
lacteos-angulo-quesera-burgalesa-burgos · Burgos
quesos-la-casona-de-los-pisones-burgos · Burgos
quesos-mostelares-hinestrosa · Hinestrosa — municipio sin centroide → Castrojeriz; tel compartido con `quesos-ilujor-palacios-de-benaver`: ¿misma quesería, dos marcas?
quesos-la-cueva-de-vadorrey-la-cueva-de-roa · La Cueva de Roa — dominio compartido con `matadero-frigorifico-ribera-del-duero-la-cueva-de-roa` (lote 3, purgado 2026-07-06 por alcance: matadero B2B, no vende envasado a particulares); quesería resuelta en solitario en este lote
comercial-altoesgueva-oquillas · Oquillas — dominio compartido con `lechazo-y-quesos-del-vidal-oquillas`: «comercial» = ¿brazo comercializador? probable fusión
lechazo-y-quesos-del-vidal-oquillas · Oquillas — dominio compartido con `comercial-altoesgueva-oquillas`
quesos-ilujor-palacios-de-benaver · Palacios de Benaver — municipio sin centroide → resolver INE; tel compartido con `quesos-mostelares-hinestrosa`
quesos-sasamon-sasamon · Sasamón
quesos-sta-maria-la-real-tortoles-de-esgueva · Tórtoles de Esgueva — HEREDADO parcial; VO=no heredado (re-derivar)
lacteos-valparaiso-villaespasa · Villaespasa
quesos-rico-villasilos · Villasilos — municipio sin centroide → Castrojeriz
```

### Lote 16 · Despensa artesanal — capital y sur (13) — ⬜

```text
asohar-aranda-de-duero · Aranda de Duero
la-casa-de-la-aceituna-y-encurtidos-aranda-de-duero · Aranda de Duero — SIN WEB; ¿tienda o envasador? alcance; si envasa, valorar recat «Aceitunas y encurtidos»
zalau-aranda-de-duero · Aranda de Duero — SIN WEB
asociacion-slowfood-burgos-burgos · Burgos — PURGA PROBABLE not-producer (asociación)
calnort-burgos · Burgos
caracoles-arlanza-burgos · Burgos
caralmeat-burgos · Burgos
especias-y-herboristeria-campeador-burgos · Burgos — si es esencialmente especias, valorar recat «Aromáticas y condimentos»
fabrica-de-bacalao-y-salazones-bilbasa-burgos · Burgos — SIN WEB
granja-las-villanas-campillo-de-aranda · Campillo de Aranda
caracoles-burgaleses-castrillo-de-la-reina · Castrillo de la Reina — SIN WEB
caracoles-melma-ciadoncha · Ciadoncha — SIN WEB
olla-podrida-burgos-sotopalacios · Sotopalacios — municipio sin centroide → Merindad de Río Ubierna; nombre de plato: ¿elaborador real de conservas? si lo es, valorar recat «Platos preparados»
```

### Lote 17 · Despensa artesanal — norte y oeste (11) — ⬜

```text
karacoles-los-altos-cubillo-del-butron · Cubillo del Butrón — municipio sin centroide → Los Altos
conservas-espinosa-santa-olalla · Espinosa de los Monteros — SIN WEB
la-llueza-productos-artesanos-del-pato-espinosa-de-los-monteros · Espinosa de los Monteros
huevos-himma-melgar-de-fernamental · Melgar de Fernamental — si es granja avícola, valorar recat «Huevos»
cafes-gometero-miranda-de-ebro · Miranda de Ebro — tostador local: entra como elaborador si tuesta de verdad
ecopipa-y-bibesol-padilla-de-arriba · Padilla de Arriba
sal-de-poza-de-la-sal-poza-de-la-sal · Poza de la Sal — SIN WEB; ¿salinas activas con venta o proyecto patrimonial? resolver identidad
biofactoria-naturae-et-salus-pradoluengo · Pradoluengo
usanza-quinta-gama-quintana-martin-galindez · Quintana Martín Galíndez — municipio sin centroide → Valle de Tobalina; «quinta gama»: valorar recat «Platos preparados»
granja-ecologica-monterrebollo-quintanaseca · Quintanaseca — municipio sin centroide → Frías; web=facebook.com genérico: tratar como SIN WEB
avicola-alvarez-villadiego · Villadiego — si es granja avícola, valorar recat «Huevos»
```

### Lote 18 · Miel — capital, Demanda y Arlanza (14) — ⬜

```text
apicola-izquierdo-aranda-de-duero · Aranda de Duero — SIN WEB; tel compartido con `raimundo-izquierdo-garcia-aranda-de-duero` (lote 8): ¿misma persona viña+miel? resolver juntos
apicast-barbadillo-del-mercado · Barbadillo del Mercado — HEREDADO parcial; VO=no heredado (re-derivar)
hernando-hurtado-barbadillo-del-mercado · Barbadillo del Mercado
abeja-burgalesa-burgos · Burgos
ada-muller-honey-burgos · Burgos
lamemiel-burgos · Burgos — HEREDADO verificado; VO=sí SIN canal (cuarentena)
miel-apilife-burgos · Burgos — SIN WEB
opizama-mieles-burgos · Burgos
vamosaunando-burgos · Burgos
mielsubinas-covarrubias · Covarrubias — SIN WEB
10-miel-fontioso · Fontioso — HEREDADO verificado; VO=no heredado (re-derivar)
apicola-neri-hontoria-del-pinar · Hontoria del Pinar — SIN WEB
miel-sabinares-del-arlanza-hortiguela · Hortigüela — HEREDADO verificado; VO=sí SIN canal (cuarentena)
apicola-guerrero-huerta-del-rey · Huerta del Rey — SIN WEB
```

### Lote 19 · Miel — Merindades y páramos (8) — ⬜

```text
juan-sedano-perez-ahedo-del-butron · Ahedo del Butrón — SIN WEB; municipio sin centroide → Los Altos
apimara-arconada · Arconada — SIN WEB; GEO-WARNING 85,4 km: ¿homónimo de Palencia o municipio mal escrito? resolver antes de nada
api-espinosa-espinosa-de-los-monteros · Espinosa de los Monteros
miel-riuseco-espinosa-de-los-monteros · Espinosa de los Monteros — SIN WEB
miel-de-frias-frias · Frías — HEREDADO parcial; VO=no heredado (re-derivar)
hermanos-ramos-melgar-de-fernamental · Melgar de Fernamental
miel-lura-quincoces-de-yuso · Quincoces de Yuso — municipio sin centroide → Valle de Losa
miel-las-loras-de-brezo-san-mames-de-abar-basconcillos-del-tozo-burgos · San Mamés de Abar, Basconcillos del Tozo, Burgos — HEREDADO verificado; VO=sí SIN canal (cuarentena); limpiar municipio → Basconcillos del Tozo (slug con merge)
```

### Lote 20 · Fruta y verdura — provincial (16) — ⬜

```text
almacenes-sualdea-aranda-de-duero · Aranda de Duero — «almacenes»: ¿distribuidor? alcance (regla 13)
natura-suko-burgos · Burgos
patatas-arreba-burgos · Burgos — ¿cultivo propio o almacén/envasadora? (regla 13)
patatas-colina-burgos · Burgos — ídem
patatas-fernandez-miguelon-burgos · Burgos — ídem
salvana-carcedo-de-burgos · Carcedo de Burgos — SIN WEB
collalb-s-cilleruelo-de-abajo · Cilleruelo de Abajo — SIN WEB
alubia-losina-lastras-de-teza · Lastras de Teza — municipio sin centroide → Valle de Losa; si es legumbre, valorar recat «Legumbres»
m-g-lechuga-de-medina-medina-de-pomar · Medina de Pomar — PURGA PROBABLE not-producer (marca de garantía); tel compartido con la M.G. de Caderechas
fundacion-conde-fernan-armentalez-melgar-de-fernamental · Melgar de Fernamental — fundación: ¿proyecto agrícola real con venta? alcance (regla 6)
s-coop-carmen-de-montorio-montorio · Montorio
manuel-torre-vivanco-rucandio · Rucandio — SIN WEB
isabel-nunez-tudanca-rucandio-salas-de-bureba · Salas de Bureba — Caderechas
m-g-manzana-reineta-y-cereza-de-caderechas-salas-de-bureba · Salas de Bureba — PURGA PROBABLE not-producer (marca de garantía); tel compartido con la M.G. de Lechuga
soc-coop-canal-de-castilla-san-llorente-de-la-vega · San Llorente de la Vega — municipio sin centroide → Melgar de Fernamental
cosidel-valle-de-losa · Valle de Losa — HEREDADO verificado; VO=no heredado (re-derivar)
```

### Lote 21 · Cerveza artesana — provincial (16) — ⬜

```text
cerveza-mica-aranda-de-duero · Aranda de Duero
cerveza-tesela-aranda-de-duero · Aranda de Duero — HEREDADO verificado; VO=sí SIN canal (cuarentena)
ambrosia-bebidas-burgos · Burgos — SIN WEB; «bebidas»: ¿elaborador o distribuidor? alcance
beer-in-burgos-burgos · Burgos — dominio compartido con `siesta-brewing-co-burgos`: ¿tienda/marca de la misma fábrica? probable fusión
cerveceria-bajo-cero-burgos · Burgos — HEREDADO verificado; «cervecería»: ¿bar o fábrica? confirmar elaboración
cerveza-alis-burgos · Burgos — SIN WEB; tel compartido con `cerveza-la-vache-folle-burgos`: ¿rebranding? resolver juntas
cerveza-berzaga-burgos · Burgos — SIN WEB
cerveza-dolina-burgos · Burgos
cerveza-la-vache-folle-burgos · Burgos — SIN WEB; tel compartido con `cerveza-alis-burgos`
cerveza-una-rubia-burgos · Burgos — web=facebook.com genérico: tratar como SIN WEB
cerveza-victoria-burgos · Burgos — SIN WEB; trío Victoria (con lotes 11 y 22): resolver los tres juntos
cerveza-virtus-burgos · Burgos
siesta-brewing-co-burgos · Burgos — HEREDADO verificado; dominio compartido con `beer-in-burgos-burgos`
cerveza-marbi-medina-de-pomar · Medina de Pomar
cerveza-gadea-santa-gadea-del-cid · Santa Gadea del Cid — GEO-WARNING 67,1 km (coords en Burgos capital): ¿dónde elabora? resolver municipio o coords
cerveza-momelius-villamiel-de-la-sierra · Villamiel de la Sierra — SIN WEB
```

### Lote 22 · Licores, Sidra, Chocolate y Dulces (13) — ⬜

```text
licores-casajus-burgos · Burgos
pacharan-menesa-burgos · Burgos
pasteleria-silma-burgos · Burgos
r-m-teran-burgos · Burgos
vermut-victoria-burgos · Burgos — trío Victoria (con lotes 11 y 21): resolver los tres juntos, dejar solo elaboradores reales
xocolart-burgos · Burgos — HEREDADO verificado; VO=sí SIN canal (cuarentena)
el-chocolatero-castildelgado · Castildelgado — HEREDADO parcial; VO=no heredado (re-derivar)
instituto-iesu-communio-la-aguilera · La Aguilera — obrador conventual (entra si elabora); municipio sin centroide → Aranda de Duero (pedanía), slug con merge
bizcochos-noel-lerma · Lerma
brainapple-miranda-de-ebro · Miranda de Ebro — sidra/manzana: confirmar elaboración propia
licores-lujo-nava-ordunte · Nava Ordunte — municipio sin centroide → Valle de Mena
destileria-reino-de-castilla-poza-de-la-sal · Poza de la Sal
clarisas-convento-de-santa-clara-vivar-del-cid · Vivar del Cid — obrador conventual; municipio sin centroide → Quintanilla Vivar (pedanía), slug con merge
```

### Lote 23 · Trufa, Legumbres, Huevos y resto (11) — ⬜

```text
cereales-y-servicios-agricolas-de-burgos-s-l-burgos · Burgos — ¿empresa de servicios agrarios? alcance (regla 15)
helados-jesson-burgos · Burgos — HEREDADO verificado; VO=no heredado (re-derivar)
sustrufas-burgos · Burgos — HEREDADO verificado; VO=sí SIN canal (cuarentena)
trufa-de-burgos-burgos · Burgos — web=atrubur.com (asociación de truficultores): PURGA PROBABLE not-producer; tel compartido con `laratruf-quintanalara`
aire-de-arlanza-cilleruelo-de-arriba · Cilleruelo de Arriba — HEREDADO verificado; VO=sí SIN canal (cuarentena)
m-g-alubia-roja-de-ibeas-ibeas-de-juarros · Ibeas de Juarros — PURGA PROBABLE not-producer (marca de garantía)
legumbres-arlanza-lerma · Lerma
laratruf-quintanalara · Quintanalara — SIN WEB; municipio sin centroide → resolver INE; tel compartido con `trufa-de-burgos-burgos`: ¿el productor real detrás de la asociación?
huevos-camperos-santa-maria-del-campo · Santa María del Campo — SIN WEB; nombre genérico: resolver identidad real
trufbox-tortoles-de-esgueva · Tórtoles de Esgueva
ovapiscis-tubilla-del-agua · Tubilla del Agua — HEREDADO parcial; VO=no heredado (re-derivar); piscifactoría/huevas: confirmar categoría «Pescado»
```

### Lote 24 · Cierre transversal provincial — ⬜

Sin lista propia: repaso del CSV completo con los criterios de cierre. Qué
hay que hacer:

- **Dedup global**: cruce por teléfono, dominio y nombre normalizados sobre
  el CSV final; decidir los pares que sigan vivos (cada par de la carga
  inicial debe tener ya decisión en su lote).
- **Municipios/geo**: 0 warnings de geo-check o aceptados con nota; tabla de
  municipios sin centroide resuelta (pedanías corregidas, huecos reales
  anotados); grafías normalizadas.
- **Cuarentena VO a cero**: ningún `sí` sin canal; ningún `no` sin
  comprobación real anotada.
- **Evidencia**: cada fila activa con `keep`; purgas/fusiones con
  `purge`/`merge`; decidir alta de `castilla-y-leon/burgos` en
  `data/evidence/coverage.json` en el mismo cambio.
- **Imágenes**: 0 huérfanas de filas purgadas (`npx pnpm check:images`).
- **`npx pnpm verify:data` en verde** y actualización final de este ledger.

## Flujo por lote

1. Antes de empezar:

   ```bash
   git status --short
   ```

   El worktree es compartido con otros agentes. No toques ficheros de otras
   provincias; si ves cambios ajenos sin commitear, déjalos como están.

2. Marca el lote como `🟨` en la worklist. Vuelca el estado actual de sus
   filas (pega los slugs de tu lote en `SLUGS`):

   ```bash
   node --input-type=module - <<'JS'
   import fs from "node:fs";
   import { parse } from "csv-parse/sync";

   const SLUGS = new Set([
     "morcillas-lesmes-burgos",
     // ...resto de slugs del lote, copiados de este documento
   ]);

   const rows = parse(
     fs.readFileSync("data/csv/castilla-y-leon/burgos.csv", "utf8"),
     { columns: true, skip_empty_lines: true }
   );
   for (const r of rows.filter((r) => SLUGS.has(r.slug))) {
     console.log(
       r.slug, "|", r.nombre, "|", r.municipio, "|", r.categoria,
       "|", r.verificacion, "| VO=", r["Venta online"],
       "| web=", r.web || "-", "| maps=", r["Google Maps"] ? "sí" : "no"
     );
   }
   JS
   ```

3. Investiga fila a fila, en este orden de preguntas y parando en cuanto la
   decisión esté clara: (a) ¿existe y es quien dice ser? (b) ¿produce/elabora
   de verdad y en alcance km0? (c) ¿municipio y coordenadas correctos?
   (d) ¿venta online real hoy? (e) enlaces del CSV: ¿son suyos? Resuelve
   además los flags específicos de la fila. No recopiles opcionales que no
   cambien la decisión.
4. Edita el CSV quirúrgicamente: solo las filas de tu lote, preservando LF,
   comillas y las 20 columnas. Purga = eliminar la línea completa (y el
   fichero de imagen si la fila tenía `imagen`). Fusión = eliminar la
   duplicada y completar la superviviente.
5. Registra evidencia en `data/evidence/castilla-y-leon/burgos.jsonl`. Una
   línea JSON por fila decidida, acción `keep`, `purge` o `merge`. La
   sintaxis exacta y los claims mínimos están en `docs/EVIDENCE_CONTRACT.md`;
   ejemplo de `keep` real (una sola línea en el fichero):

   ```json
   {"slug":"ejemplo-slug-burgos","reviewedAt":"2026-07-06","reviewedBy":"tu-id-de-agente","action":"keep","decision":{"verification":"verificado","onlineSales":"sí","salesChannels":["ecommerce"]},"sources":[{"url":"https://ejemplo.com","type":"official-site","claims":["identity","producer-activity","municipality"],"checkedAt":"2026-07-06"},{"url":"https://ejemplo.com/tienda","type":"official-store","claims":["online-sales","link-ownership"],"checkedAt":"2026-07-06"}],"notes":"Nota corta solo si hay excepción material."}
   ```

   Recuerda: `decision` debe cuadrar EXACTAMENTE con la fila del CSV
   (`verification`↔`verificacion`, `onlineSales`↔`Venta online`,
   `salesChannels`↔`Canal de venta`). Para `verificado` hacen falta claims
   `identity` + `producer-activity` + `municipality` y al menos una fuente de
   tipo verificador (`official-site`, `official-store`, `official-social`,
   `google-maps`, `marketplace`). Usa un `reviewedBy` estable (p. ej.
   `codex-agent`, `claude-agent`).
6. Valida mientras iteras:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence:changed
   git diff --check
   ```

7. Al cerrar el lote:

   ```bash
   npx pnpm verify:data
   ```

8. Actualiza este ledger en el mismo cambio: fila de la worklist (`✅`, fecha,
   nota corta), sección Estado si cambió el snapshot (conteos, warnings
   resueltos, huecos de referencia detectados) y las listas de slugs de lotes
   posteriores si hubo fusiones o correcciones de slug.
9. Commit por lote (mensaje tipo `Burgos: verificación lote N — resumen
   corto`), en la rama que haya indicado el usuario. No hagas push a `main`
   sin instrucción explícita.

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo razón explícita documentada en la worklist.
- Cada `parcial` residual tiene motivo anotado y evidencia JSONL coherente.
- Cada fila activa tiene registro `keep`; cada purga/fusión tiene registro
  `purge`/`merge`.
- `Venta online` resuelto en las 342 originales: cada `sí` con `Canal de
  venta` y evidencia de pedido remoto vigente; cada `no` comprobado de
  verdad; `no comprobado` solo donde no se pudo cerrar. Cuarentena heredada
  (16 `sí`, 23 `no`) resuelta explícitamente.
- Las entidades sectoriales (asociaciones, consejos, IGP, M.G., consorcios)
  están purgadas o justificadas como productor real con fuente.
- La tabla de municipios sin centroide está resuelta: pedanías corregidas al
  municipio INE (con `merge` de slug), huecos reales anotados sin forzar el
  dato, valores sucios limpiados, grafías normalizadas.
- 0 warnings de geo-check, o aceptados con nota que explique por qué.
- Sin duplicados aparentes sin decisión (todos los pares de dominio/teléfono
  compartido de la carga inicial tienen resolución anotada); nombres sin
  ruido de volcado.
- No quedan enlaces ajenos (arlanza.org en filas de bodega, Facebook
  genérico como web), dominios aparcados ni fichas genéricas como prueba
  fuerte.
- 0 imágenes huérfanas de filas purgadas/fusionadas (`npx pnpm check:images`).
- `npx pnpm verify:data` en verde antes de cerrar cada lote y al cierre.
- Imágenes nuevas: fuera de alcance; quedan como residual explícito
  (168/342 iniciales) para una pasada posterior.
- Al cerrar las 342 filas, decidir si se añade `castilla-y-leon/burgos` a
  `data/evidence/coverage.json` (advisory) en el mismo cambio que complete
  la evidencia provincial.

## Decisiones que deben quedar especialmente anotadas

- Purgas y su motivo (`not-producer`, `closed`, `other-province`,
  `nonexistent`, `out-of-scope`): en especial las entidades sectoriales
  (consejo DO Arlanza, consorcio Ruta del Vino, IGP morcilla/lechazo,
  M.G., Slowfood, ATRUBUR) y los cortadores de jamón.
- Comercializadoras, cooperativas y mataderos (Colear, Lecoa, matadero de La
  Cueva de Roa, coop. avícola de Burgos, Copaboca): por qué entran como
  productor/elaborador o por qué no (criterio ICAV de Ávila).
- Resolución del trío Victoria (vermutería/cerveza/vermut) y de cada par de
  dominio/teléfono compartido: dos unidades reales, fusión o satélite.
- El enclave `hacienda-el-ternero-haro` y las filas con sospecha de otra
  provincia (Torta de Aranda/Valladolid, Apimara/Arconada).
- Cualquier `verificado` sin web propia: fuente concreta que lo sostiene.
- Ascensos por encima de `parcial` apoyados en directorios/DO/IGP: qué fuente
  propia lo justifica.
- Recategorizaciones (Agua de Corconte, aceitunas, huevos, platos
  preparados, especias…) y limpiezas de nombre.
- Correcciones de municipio/slug (con su `merge`), geo-warnings aceptados y
  huecos confirmados de `municipios.json`.
- Todo cambio de `Venta online` a `sí` o `no` (canal y fuente), en especial
  al resolver la cuarentena heredada.
