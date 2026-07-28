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

```text
Estado de pasada: mantenimiento
Base: b3bd902
Método: sinteticas, pendiente, evidencia-prestada, web-de-tercero,
  canal-sin-clasificar, descripcion-generica, categoria-variante (check:defects)
Lote activo: — (BU-R1-25 cerrado)
Alcance: —
Última actualización: 2026-07-28
```

- **Lote BU-R1-25 (2026-07-28, carril R1).** Alcance congelado: las 5
  `sinteticas` + la última `pendiente`. Las 5 bodegas del Arlanza **no eran
  sintéticas**: las 5 están en el registro del consejo de la D.O., que además
  publica el contacto que la 1ª pasada no recogió al retirar `arlanza.org` de
  `web` (correcto). Recuperados teléfono/correo de las 5, dirección real de
  Alonso Angulo y Agrobauto (la del volcado era inventada) y Facebook de Alonso
  Angulo. `alonsoangulo.com` **no resuelve (sin NS)** → no se restituye a `web`.
  Los `productos estrella` del volcado eran de plantilla: sustituidos por los
  vinos reales donde constan (Castrinto/Flor de Sanctus/Sanctus, Viña del
  Fraile, Las Mamblas de Valtravieso) y vaciados donde no. Las 5 siguen
  `parcial` (techo de registro). **1 purga**: `manuel-torre-vivanco-rucandio`,
  reason `nonexistent` — la ficha de Burgos Alimenta que la sostenía es la de
  otra entidad (M.G. Caderechas = Asociación de Productores, Salas de Bureba, ya
  purgada en el lote 20) y la fila arrastraba su CP 09593 y su teléfono. 303→302
  filas; `sinteticas` y `pendiente` a **0**.
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
- Snapshot tras lote 8 (2026-07-08): **325 filas** (−1: purga del Consorcio
  Ruta del Vino Ribera del Duero, `not-producer`). **177 `pendiente`**, 25
  `parcial`, 123 `verificado`. Venta online: **84 `sí`** (74 con canal: 61
  previos + 13 nuevos — 11 `ecommerce`, 1 `telefono` en Montegaredo y 1
  `email` en Viña Buena, tienda «Próximamente» con pedido explícito por
  correo), 23 `no`, 218 `no comprobado`. Imágenes: 163/325 (5 renombradas por
  merges de slug: Montegaredo, Dominio de Cair, Nabal, Roberik y Zapata; el
  consorcio purgado no tenía imagen). Cuatro filas resultaron ser el patrón
  «sede fiscal vs bodega real» (dirección/CIF en Aranda de Duero, bodega o
  finca real en otro municipio), tres de ellas sin flag previo del lote:
  Montegaredo → **Pedrosa de Duero** (Boada de Roa, E.L.M.; geo-warning de
  24,8 km resuelto), Bodegas Nabal → **Gumiel de Izán** (la propia web da A-1
  salida 168, Valle de Nabal), Bodegas y Viñedos Roberik → **Milagros**
  (registro oficial de la DO Ribera del Duero: C/Palencia 5, Polígono
  Industrial Alto Milagros, confirmado por prensa especializada) y Bodegas
  Zapata → **La Horra** (la propia descripción heredada del CSV y la web ya
  decían «bodega boutique ubicada en el municipio de La Horra, Triángulo de
  Oro»; nuevo geo-warning de 17,7 km aceptado, mismo patrón que
  Villalmanzo/Mambrilla del lote 11). Bodegas Dominio de Cair: La Aguilera
  (pedanía) → Aranda de Duero, resuelto solo para esta fila (la fila del lote
  22 en La Aguilera sigue pendiente). Raimundo Izquierdo García confirmado
  productor real (responsable de la bodega Solira 2002 S.L., marca Vega
  Privanza y otras) pero se queda en `parcial`: el dominio vegaprivanza.net
  no resuelve (tampoco .com), sin fuente verificadora propia, `web` retirada
  del CSV. Altos del Terral se queda en `parcial`: identidad muy bien
  documentada en el registro de la DO y en prensa especializada, pero
  altosdelterral.com devolvió error 500/404 en todas las rutas probadas en
  esta sesión. El resto del lote (Vino Feliz —antes «Feliz», nombre
  limpiado—, Junciera Jiné, Bodega Tierra Aranda, Bodega Finca Cantaburros,
  Bodegas Martín Berdugo, Bodegas Vetusta, Dani Mabe Wines, Viñedos la Nava y
  Bodegas el Lagar de Isilla de Aranda) verificado con tienda propia o
  pedido explícito. Notas cruzadas anotadas para los lotes 9 (Lagar de Isilla
  de La Vid, instalación distinta y real del mismo grupo), 10 (Bodegas
  Lerma/Nabal, misma familia con dos bodegas reales), 13 (Pastelería
  Tudanca/Viñedos la Nava, mismo Grupo Tudanca) y 18 (Apícola Izquierdo,
  misma persona con viña y miel).
- Snapshot tras lote 9 (2026-07-16): **323 filas** (−2: 2 fusiones —
  `bodegas-nuestro-de-diaz-bayo-s-l-fuentelcesped` → Díaz Bayo Hermanos y
  `bodegas-san-andres-zazuar` → Bodegas Milvus). **159 `pendiente`**, 27
  `parcial`, 137 `verificado`. Venta online: **94 `sí`** (84 con canal: 74
  previos + 10 nuevos, todos `ecommerce`), 23 `no`, 206 `no comprobado`.
  Imágenes: 163/323 (2 renombradas por merge de slug: Hinojar Wines → Huerta
  de Rey, Lagar de Isilla → La Vid y Barrios; las 2 víctimas de fusión no
  tenían imagen). **Ermita del Conde degradada a `parcial`**: su dominio
  ermitadelconde.com está secuestrado y sirve spam de casino (Pin Up), con
  `/en/` en 404; web retirada del CSV (regla 17), identidad sostenida por
  marketplace/prensa (mismo patrón que Destraperlo en Granada). Dos municipios
  sin centroide resueltos con merge: Hinojar del Rey → **Huerta de Rey**
  (pedanía INE 09174) y La Vid → **La Vid y Barrios** (nuevo geo-warning
  aceptado de 17,0 km, municipio-agregado extenso, coords reales sin tocar).
  Grafía «GUMIEL DE IZÁN» → «Gumiel de Izán» (Abadía San Quirce).
  `bodegas-valdecamellas` gana web oficial (valdecamellas.eu, antes SIN WEB).
- Snapshot tras lote 10 (2026-07-16): **322 filas** (−1: purga del Consejo
  Regulador D.O. Arlanza, not-producer). **149 pendiente**, 27 parcial, 146
  verificado. Venta online: **100 sí** (90 con canal: 84 previos + 6 nuevos,
  todos `ecommerce`), 17 no, 205 no comprobado. Imágenes: 162/322 (−1 huérfana
  del consejo; 2 renombradas por merge: Monte Amán → Lerma, Gotas de Rocío →
  …y Tordueles). **Retiradas 6 webs ajenas arlanza.org** (eran la ficha del
  consejo regulador, no del productor): Arlese recuperó su web propia
  (bodegasarlese.es) → verificada; las otras 5 (Viña y Tía, Alonso Angulo,
  Viñedos de Altura, Agrobauto, Melequín) quedan `parcial` con VO no→no
  comprobado. Enológica Wamba se mantiene `parcial` (web con error de
  certificado y tienda vinofrikishop.com caída esta sesión; candidata a
  promover). Dos municipios resueltos con merge: Castrillo Solarana (E.L.M.,
  antiguo municipio 09089) → **Lerma** y Quintanilla del Agua →
  **Quintanilla del Agua y Tordueles**. Confirmados sin fusión: Copaboca
  Villalmanzo (instalación real distinta de Sotillo, lote 7) y Bodegas Lerma
  (familia Navarro Balbás, distinta de Nabal).
- Snapshot tras lote 11 (2026-07-16): **319 filas** (−3: 2 purgas out-of-scope
  —Barbastro (grupo de hostelería Grupo Hirviendo) y Vermutería Victoria
  (bar)— y 1 fusión —Bodega Covarrubias → Valdable). **137 pendiente**, 29
  parcial, 153 verificado. Venta online: **101 sí** (92 con canal: 90 previos +
  2 nuevos `ecommerce`), 13 no, 205 no comprobado. Imágenes: 161/319 (−1
  huérfana de la vermutería; 3 renombradas por merge: Palacio de Lerma → Lerma,
  Vizcarra → Mambrilla de Castrejón, El Ternero → Miranda de Ebro). **3
  geo-warnings sede-vs-bodega resueltos** (Bodegas Arlanza y Sierra →
  Villalmanzo, Vizcarra → Mambrilla de Castrejón); quedan 7 geo-warnings.
  **Agua de Corconte recategorizada** de Bodega a «Agua mineral natural»
  (municipio Cilleruelo de Bezana → Valle de Valdebezana). Bodegas Septién
  trasladada a **Puentedura** (coords al centroide; verificada vía su Instagram
  oficial). El Ternero: enclave burgalés, municipio Haro → **Miranda de Ebro**
  (regla 19, dirección postal de Haro conservada). Monasterio de Cardeña
  confirmado productor real (vino Valdevegón, cerveza trapense, licor Tizona
  del Cid). Bodegas Arlanza, Sierra, Ortegaz y Alma Silense quedan `parcial`
  por webs propias caídas esta sesión (candidatas a promover).
- Snapshot tras lote 13 (2026-07-16): **317 filas** (−2: 2 purgas —La Torta de
  Aranda (M.G./producto, not-producer) y El Ventorro (hotel-restaurante/tienda,
  out-of-scope)). **108 pendiente**, 42 parcial, 167 verificado. Venta online:
  **105 sí** (96 con canal: 95 previos + 1 nuevo `ecommerce`, Tudanca), 10 no,
  202 no comprobado. Imágenes: 160/317 (−1 huérfana de El Ventorro). Varias
  panaderías rurales SIN WEB promovidas a verificado por ficha real de Google
  Maps o Tierra de Sabor + red social (Serendipia 4,6; Eduardo Antolín 4,9;
  Obrador del Esgueva 4,2; Antonio de las Heras; Labrador). Panaderia Panaranda
  = «Pan Aranda» de Panadería La Castellana, uno de los obradores certificados
  de la M.G. Torta de Aranda (junto a Tudanca). Productos Perines: web Google
  negocio.site (discontinuado, 404) retirada. Residual: Espiga Real (Quintanar)
  y Mi Dulce Anjana (Santa María del Campo) quedan `parcial` (identidad no
  confirmada / solo directorio municipal).
- Snapshot tras lote 14 (2026-07-16): **316 filas** (−1: purga de Quesería
  Artesanal Maite, S.L. extinguida el 2026-05-07). **99 pendiente**, 42 parcial,
  175 verificado. Venta online: **106 sí** (99 con canal: 96 previos + 3 nuevos
  `ecommerce` —Ovejero, Las Nieves, Santa Gadea), 9 no, 201 no comprobado.
  Imágenes: 160/316 (2 renombradas por merge: Santa Gadea → Valle de Manzanedo,
  El Carluque → Merindad de Valdivielso). **6 municipios corregidos con merge**
  (Barcina de los Montes → Oña, Dobro → Los Altos, Rioseco → Valle de
  Manzanedo, Valdenoceda → Merindad de Valdivielso, Zaballa → Valle de Losa;
  Las Machorras → Espinosa de los Monteros, limpieza), sin geo-warnings nuevos.
  **2 cuarentenas VO=sí sin canal resueltas** (Ovejero y Las Nieves → sí
  ecommerce). Webs corregidas/añadidas: Carreras (+quesoscarreras.com), Ovejero
  (quesosovejero.es → lacteosovejero.es), Ugala (tienda colectiva
  artesanosmerindades.com → su web propia quesosugala.wordpress.com). Ganadería
  Ortiz queda `parcial` (solo directorio institucional).
- Snapshot tras lote 15 (2026-07-16): **315 filas** (−1: fusión de Comercial
  Altoesgueva → Lechazo y Quesos del Vidal, su brazo comercial). **86
  pendiente**, 46 parcial, 183 verificado. Venta online: **110 sí** (103 con
  canal: 99 previos + 4 nuevos —3 `ecommerce` (Sasamón, Nieto y Herrero,
  Ilújor) + Rico `telefono`), 8 no, 197 no comprobado. Imágenes: 159/315 (−1
  huérfana de Altoesgueva; Rico renombrada por merge). El par Mostelares/Ilújor
  resultó **NO** ser la misma quesería (dos productores distintos de la Ruta del
  Queso). 3 municipios corregidos con merge: Palacios de Benaver → Isar
  (pedanía), Hinestrosa → Castrojeriz, Villasilos → Castrojeriz. Lácteos
  Valparaíso: web Google negocio.site (discontinuado, 404) retirada. Casona de
  los Pisones y La Cueva de Vadorrey quedan `parcial` (sitios propios caídos
  —DNS/404— y WebSearch agotado; a re-verificar).
- Snapshot tras lote 16 (2026-07-16): **313 filas** (−2: 2 purgas not-producer
  —ASOHAR (asociación de hosteleros de Aranda) y Slow Food Burgos (convivium)).
  **73 pendiente**, 52 parcial, 188 verificado. Venta online: **112 sí** (105
  con canal: 103 previos + 2 nuevos `ecommerce` —Granja Las Villanas, Olla
  Podrida), 8 no, 193 no comprobado. Imágenes: 158/313 (−1 huérfana de Slow
  Food; Olla Podrida renombrada por merge). **Recategorizaciones**: Caralmeat
  /Umoh (Despensa → «Platos preparados»), Granja Las Villanas (Despensa →
  «Huevos»). **Municipios con merge**: Olla Podrida (Sotopalacios → Merindad de
  Río Ubierna, geo-warning 20,5 km aceptado) y Bilbasa (Burgos, sede fiscal →
  Melgar de Fernamental, fábrica real; coords y dirección trasladadas). Varios
  quedan `parcial` por alcance sin resolver (La Casa de la Aceituna, Zalau
  =mayorista setas/trufas, Campeador=herbolario) o sin fuente primaria propia
  (Caracoles Burgaleses, Bilbasa, Caracoles Arlanza —web business.site muerta
  retirada).
- Snapshot tras lote 12 (2026-07-16): **319 filas** (sin cambio de conteo: 0
  purgas/fusiones). **120 pendiente**, 39 parcial, 160 verificado. Venta online:
  **104 sí** (95 con canal: 92 previos + 3 nuevos `ecommerce`), 13 no, 202 no
  comprobado. Imágenes: 161/319. Almendras Sarralde recategorizada de «Pan y
  pastelería» a «Frutos secos» (garrapiñadas/frutos secos). Dulce Tentación:
  municipio Sotopalacios → Merindad de Río Ubierna (merge slug; nuevo
  geo-warning aceptado de 20,7 km, artefacto de merindad extensa). Pastelería
  Merey: su web era un Google business.site (servicio discontinuado, 404) →
  retirada. **⚠ Pasada con tooling reducido** (cuota de WebSearch agotada): El
  Horno de Burgos y Panaderías Cámara (mismo dominio elhorno.net, posible
  fusión) y las 6 panaderías SIN WEB (Jardín de la Abadesa, El Horno de Ceci,
  Horno Ortiz, Dulcipay, Pancorbopan, Dulce Tentación) quedan `parcial`, a
  re-verificar/promover en 2ª pasada; el municipio «Maltranilla» sigue sin
  resolver INE.
- Snapshot tras lote 17 (2026-07-20): **313 filas** (sin cambio de conteo: 0
  purgas/fusiones; los 3 renombres de slug son la misma entidad). **62
  pendiente**, 56 parcial, 195 verificado. Venta online: **117 sí** (110 con
  canal: 105 previos + 5 nuevos — 2 `ecommerce` (Karacoles los Altos, Ecopipa),
  2 `marketplace` (La Llueza y Sal de Poza, vía Delicias de Burgos) y 1
  `ecommerce|marketplace` (Naturae)), 8 no, 188 no comprobado. Imágenes:
  158/313 (2 renombradas por merge de slug: Karacoles → Valle de Sedano, Usanza
  → Valle de Tobalina; ninguna huérfana). **8 recategorizaciones** desde
  «Despensa artesanal»: La Llueza → «Pato y derivados», Cafés Gometero →
  «Café», Sal de Poza → «Sal», Usanza → «Platos preparados», Conservas Espinosa
  → «Pescado y conservas», y Huevos Himma / Avícola Álvarez / Granja
  Monterrebollo → «Huevos». **3 municipios corregidos con merge**: Cubillo del
  Butrón → **Valle de Sedano** (la pista del ledger «Los Altos» era **errónea**:
  Cubillo del Butrón es localidad de Valle de Sedano, INE 09905, confirmado en
  Wikipedia; ~10 km al centroide, sin geo-warning), Quintana Martín Galíndez →
  **Valle de Tobalina** (localidad cabecera) y Quintanaseca → **Frías**
  (pedanía; la propia granja se declara «ubicada en Frías»). Biofactoría
  Naturae: confirmada la **planta real en Pradoluengo** (Pol. Ind. Los Llanos);
  la sede del spin-off de la UVa en Valladolid es comercial y el aloe se cultiva
  en Andalucía, pero la elaboración es burgalesa → se mantiene el municipio. Sal
  de Poza («Amigos de las Salinas de Poza») confirmada como operador real que
  elabora y vende (regla 6 exención). Granja Monterrebollo: su `web` era un
  enlace de Facebook, retirado (sigue en la columna Facebook). Avícola Álvarez:
  avicolaalvarez.com da certificado autofirmado, se conserva la URL (regla 17).
  Cafés Gometero: tienda online «en mantenimiento» esta sesión → VO no
  comprobado. 4 residuales `parcial` (Conservas Espinosa, Sal de Poza, Granja
  Monterrebollo, Avícola Álvarez), todas por falta de fuente propia legible.
- Snapshot tras lote 18 (2026-07-20): **313 filas** (sin cambio de conteo: 0
  purgas/fusiones; los 2 renombres de slug son la misma entidad). **53
  pendiente**, 61 parcial, 199 verificado. Venta online: **122 sí** (117 con
  canal: 110 previos + 7 nuevos — Abeja Burgalesa `ecommerce`; LAMEMIEL,
  VamosAunando y 10 Miel `telefono|email`; Opizama `telefono|whatsapp|email`;
  Miel Subiñas y Apícola Izquierdo `marketplace`), 6 no, 185 no comprobado.
  Imágenes: 158/313 (1 renombrada por merge de slug: VamosAunando → Briviesca;
  ninguna huérfana). **Cuarentenas VO=sí (heredadas) resueltas**: LAMEMIEL →
  sí `telefono|email` («Haz tu pedido» por formulario/teléfono) y Sabinares del
  Arlanza → no comprobado (web con «Dónde comprar»/contacto sin carrito). **2
  heredados VO=no re-derivados**: 10 Miel → sí `telefono|email` (página
  «Contacto y Pedidos») y Apicast → no comprobado (venta a granel B2B en
  envases de 300 kg). **2 municipios corregidos con merge**: VamosAunando de
  Burgos (domicilio de los fundadores en el CSV) → **Briviesca** (colmenares e
  identidad reales en La Bureba, patrón sede-vs-producción tipo Bilbasa; slug e
  imagen renombrados, coords al centroide de Briviesca, email corregido) y
  Apícola Guerrero «Huerta del Rey» → **Huerta de Rey** (grafía oficial INE,
  slug renombrado). **Alcance decidido**: Hernando Hurtado es envasadora y
  mayorista de miel (≈5000 t/año, maquila a terceros, sin colmenas propias,
  perfil B2B sin venta a consumidor) → parcial y **candidata a purga
  out-of-scope** en pasada posterior; Apicast es apicultor real (Apícola
  Castilla, 3 generaciones) pero vende a granel (300 kg, B2B) → parcial. **1
  fila queda pendiente**: Miel Apilife, sin rastro digital verificable (dominio
  apilife.es despublicado, sin resultados de búsqueda ni en ASAPIBUR/Burgos
  Alimenta); sin base para verificar ni para purgar (regla 16), a confirmar en
  campo o por registro sanitario. Ada Müller confirmada apicultora eco vía IG
  oficial + ASAPIBUR + Burgos Alimenta (su web no resuelve desde la sesión pero
  está viva, regla 17); nombre limpiado. Miel Subiñas y Apícola Izquierdo
  (SIN WEB) sostienen VO=sí por marketplaces que venden su miel
  (bakailuak.com, vinosribera.com). 6 residuales `parcial` nuevos por falta de
  fuente propia legible o alcance (Neri, Guerrero, Miel Subiñas, Izquierdo,
  Apicast, Hernando Hurtado).
- Snapshot tras lote 19 (2026-07-20): **313 filas** (sin cambio de conteo: 0
  purgas/fusiones; los 4 renombres de slug son la misma entidad). **48
  pendiente**, 62 parcial, 203 verificado. Venta online: **125 sí** (121 con
  canal: 117 previos + 4 nuevos `ecommerce` — Apimara, Api Espinosa, Miel Lura;
  Miel Las Loras gana canal al resolver su cuarentena), 5 no, 183 no comprobado.
  Imágenes: 158/313 (2 renombradas por merge de slug: Miel Lura → Valle de
  Losa, Miel Las Loras → Basconcillos del Tozo; ninguna huérfana).
  **Geo-warning de 85,4 km de `apimara-arconada` RESUELTO**: «Arconada» no era
  el homónimo de Palencia sino la pedanía burgalesa de Arconada (Bureba),
  localidad del municipio de **Carcedo de Bureba** (INE) → municipio corregido y
  slug renombrado con merge, 2,8 km al centroide (quedan 8 geo-warnings).
  **4 municipios corregidos con merge**: Ahedo del Butrón → Los Altos (E.L.M.),
  Quincoces de Yuso → Valle de Losa (cabecera), «San Mamés de Abar, Basconcillos
  del Tozo, Burgos» → Basconcillos del Tozo (valor sucio limpiado) y el de
  Apimara. **Cuarentena VO=sí resuelta**: Miel Las Loras de Brezo → sí
  `ecommerce` (tienda propia mieldelasloras.com, confirmada por Gourmets/Burgos
  Alimenta pese a que el servidor no respondió esta sesión). **Heredado VO=no
  re-derivado**: Miel de Frías → no comprobado (apiturismo con reserva, sin
  tienda) y promovido de parcial a verificado (apicultor registrado 134BU0017).
  Api Espinosa (Yolanda Martínez, VP de ASAPIBUR, 600-700 colmenas, tienda
  propia) → verificado sí ecommerce (web da 403 al fetcher pero viva, regla 17).
  **1 fila queda pendiente**: Miel Riuseco (Espinosa de los Monteros), SIN WEB y
  sin rastro digital verificable → sin base para verificar ni purgar (regla 16),
  a confirmar en campo/registro (2º caso del bloque miel junto a Apilife del
  lote 18). 2 residuales `parcial` nuevos por falta de fuente propia legible
  (Juan Sedano Pérez, Hermanos Ramos).
- Snapshot tras lote 20 (2026-07-20): **311 filas** (−2: 2 purgas
  `not-producer`; los 4 renombres de slug son la misma entidad). **34
  pendiente**, 70 parcial, 207 verificado. Venta online: **127 sí** (123 con
  canal: 121 previos + 2 nuevos `ecommerce` — Alubia Losina y Rucandio Frutas
  de Montaña), 10 no (5 previos + 5 nuevos mayoristas B2B: Sualdea, Arreba,
  Colina, Fernández Miguelón, SOCOCAR), 174 no comprobado. Imágenes: 157/311
  (2 renombradas por merge — Natura Suko → Saldaña de Burgos, Alubia Losina →
  Valle de Losa; 1 huérfana borrada de la purga M.G. Lechuga de Medina).
  **2 purgas not-producer**: las dos marcas de garantía (M.G. Lechuga de Medina
  = Asociación Hortícola de las Merindades, M.G. Manzana Reineta y Cereza de
  Caderechas = Asociación de Productores del valle) — colectivas promocionales,
  sin tienda ni producción propia; tel 947040266 compartido entre ambas y con la
  asociación Patata de Burgos. **2 webs ajenas retiradas** (patrón arlanza.org):
  patatadeburgos.es en Almacenes Sualdea (es la asociación Patata de Burgos) y
  coopcyl.es en Soc. Coop. Canal de Castilla (portal de URCACYL). **Alcance
  out-of-scope → parcial**: las 3 almacenistas de patata de la capital (Arreba,
  Colina, Fernández Miguelón) y Almacenes Sualdea (Aranda) son mayoristas sin
  cultivo propio; Cosidel reauditado de heredado verificado → parcial (patata de
  siembra, input B2B); Soc. Coop. Canal de Castilla (coop cerealista B2B);
  Fundación Conde Fernán Armentález (asistencial, huerta ecológica en CEE sin
  comercialización confirmada). **4 municipios corregidos con merge**: Natura
  Suko Burgos → Saldaña de Burgos (microvegetales; la web sitúa allí la
  actividad), Alubia Losina Lastras de Teza → Valle de Losa (localidad), Salvana
  Carcedo de Burgos → Castrillo del Val (dirección/reportaje), Soc. Coop. Canal
  de Castilla San Llorente de la Vega → Melgar de Fernamental (E.L.M., INE
  09211, RD 2508/1978). Recats: Alubia Losina → Legumbres, Salvana y Canal de
  Castilla → Legumbres y cereales, Rucandio e Isabel Núñez → Fruta. **Reales
  verificadas**: SOCOCAR (mayor productora de patata de siembra de España, +
  consumo/industrial, contrato Pepsico), Natura Suko (microvegetales), Alubia
  Losina (alubia eco) y Rucandio Frutas de Montaña (Caderechas). **2 pendientes**
  (regla 16): Collalb@s (Cilleruelo de Abajo) y Manuel Torre Vivanco (Rucandio,
  Caderechas) — SIN WEB y sin ficha real (los enlaces «Google Maps» del volcado
  son búsquedas por dirección, no fichas con reseñas) ni rastro verificable; en
  catálogo Burgos Alimenta según volcado pero sin ficha localizable → ni
  verificar ni purgar. Sin nuevos geo-warnings (siguen 8, todos previos).
- Snapshot tras lote 21 (2026-07-20): **308 filas** (−3: 2 purgas
  `out-of-scope` + 1 fusión). **21 pendiente**, 76 parcial, 211 verificado.
  Venta online: **133 sí** (130 con canal: 123 previos + 6 nuevos `ecommerce`
  —Mica, Dolina, Virtus, Gadea, Siesta— y Marbi `marketplace`; además Tesela
  gana canal `ecommerce` al resolver su cuarentena), 10 no, 165 no comprobado.
  Imágenes: 156/308 (1 huérfana borrada en la fusión de Beer in Burgos).
  **2 purgas out-of-scope**: La Vache Folle (bar/gastropub de cerveza y queso,
  sirve cervezas de terceros, no productor) y Cerveza Victoria (cerveza de marca
  propia del bar Vermutería Victoria —purgado en lote 11—, elaborada por encargo
  por Xabier Sevillano/Marbi; el elaborador real tiene fila). **1 fusión**: Beer
  in Burgos → Siesta Brewing (comparten el dominio oficial siestabrewing.es;
  «Beer in Burgos» es la venta/distribución de cerveza de Siesta, origen del
  proyecto en 2014). **Cuarentena VO=sí resuelta**: Cerveza Tesela → canal
  `ecommerce` (tienda propia confirmada por prensa; web con TLS transitorio).
  **GEO-WARNING de 67 km de `cerveza-gadea` resuelto**: las coordenadas estaban
  en Burgos capital → corregidas al centroide de Santa Gadea del Cid (quedan 7
  geo-warnings). **Fábricas reales con tienda propia** (VO sí ecommerce): Mica
  (primera cervecera española 100% sin alcohol, Mejor del Mundo 2017), Dolina,
  Virtus, Gadea, Siesta y Tesela; **Bajo Cero** verificada sin tienda (VO no
  comprobado). **Marbi** (Maiken Brewery, Medina de Pomar): web caducada
  retirada (DNS, regla 17), VO sí marketplace (tiendas de terceros) → parcial.
  **Parciales SIN WEB** (elaboradores reales, solo directorio/prensa): Ambrosía
  Bebidas (cerveza de quinua «Atenea» + hidromiel «Elixir»), Alis «Isabel de
  Castilla» (proyecto Levadura Social, mismo operador que el bar La Vache Folle),
  Berzaga (desde 2013), Una-Rubia (solo Facebook) y Momelius (web añadida, no
  legible esta sesión por TLS). Pares de tel/dominio resueltos: Alis↔La Vache
  Folle (marca vs bar), Beer in Burgos↔Siesta (fusión).
- Snapshot tras lote 22 (2026-07-20): **306 filas** (−2: 2 purgas
  `out-of-scope`; los 2 renombres de slug son la misma entidad). **10
  pendiente**, 76 parcial, 220 verificado. Venta online: **137 sí** (135 con
  canal: 130 previos + 5 nuevos —Casajús, Pacharán Menesa, Iesu Communio,
  Clarisas `ecommerce` y Brainapple `marketplace`; XocolART sale de `sí` al
  resolver su cuarentena), 9 no, 160 no comprobado. Imágenes: 155/306 (1
  huérfana borrada en la purga de Vermut Victoria). **2 purgas out-of-scope**:
  Vermut Victoria (el vermut de la casa de la Vermutería Victoria, bar purgado
  en el lote 11; sin marca embotellada de venta propia) — **cierra el trío
  Victoria** (bar l11, cerveza l21, vermut l22) — y Licores Lujo (comercializador
  de licores de lujo personalizados, no elaborador, con sede en Basauri/Vizcaya
  según su web). **2 municipios corregidos con merge**: La Aguilera → Aranda de
  Duero (localidad) e instituto Iesu Communio; Vivar del Cid → Quintanilla Vivar
  (E.L.M., INE 09301) y las Clarisas. **Cuarentena VO=sí resuelta**: XocolART →
  no comprobado (tienda palbin caída/404, web nueva xocolart.com sin carrito).
  **Elaboradores/destilerías reales con tienda propia** (VO sí ecommerce):
  Licores Casajús, Pacharán Menesa (Menesa), Iesu Communio (repostería conventual
  de La Aguilera) y las Clarisas de Vivar del Cid; **Brainapple** (Miranda de
  Ebro, sidra «Burkan» + bebidas de manzana) VO sí marketplace. **Verificadas sin
  tienda** (VO no comprobado): Destilería Reino de Castilla (única empresa
  autorizada de Burgos para fabricar alcohol, Poza de la Sal), Pastelería Silma
  (obrador desde 1956), R.M. Terán (rosquillas), Bizcochos Noel (Lerma) y
  XocolART. El Chocolatero (Castildelgado, familia Merino, +130 años, producción
  casi anecdótica) → parcial. **Webs saneadas**: silmaburgos.es→.com,
  palbin→xocolart.com, areposteria.es→pequenareposteria.es, blog de El
  Chocolatero (404) retirado; brainapple.es conservada pese al spam de casino en
  un fetch (regla 17, revisar). Sin nuevos geo-warnings (siguen 7).
- Snapshot tras lote 23 (2026-07-20): **304 filas** (−2: 2 purgas
  `not-producer`; el renombre de slug es la misma entidad). **5 pendiente**,
  77 parcial, 222 verificado. Venta online: **140 sí — todas con canal** (135
  previos + 3 nuevos `ecommerce`: Legumbres Arlanza, Trufbox y LARATRUF
  `telefono|email`; **más las 2 últimas cuarentenas resueltas** —Sustrufas y
  Aire de Arlanza ganan canal—, con lo que **desaparecen los `sí` sin canal**),
  9 no, 155 no comprobado. Imágenes: 154/304 (1 huérfana borrada en la purga de
  ATRUBUR). **2 purgas not-producer** (regla 6): `trufa-de-burgos-burgos` =
  ATRUBUR (Asociación de Truficultura de la Provincia de Burgos, ~86 socios/500+
  ha, no vende trufa propia; el truficultor real de Quintanalara es **LARATRUF**,
  con quien comparte el teléfono 677668610) y `m-g-alubia-roja-de-ibeas` (marca
  de garantía colectiva). **Truficultura real destapada**: Sustrufas (Burgos),
  Trufbox (Tórtoles de Esgueva/Caleruega, sede real en Burgos pese a la finca de
  Soria de su web) y LARATRUF (Quintanalara; **el CSV la traía SIN WEB y con el
  teléfono de ATRUBUR** → añadida su web laratruf.com y su teléfono propio
  645900030). **1 municipio corregido con merge**: Quintanalara → Revilla del
  Campo (E.L.M., INE, integrado en 1981; coords a 4,2 km del centroide, sin
  warning). **Alcance out-of-scope → parcial**: SERABUR (servicios agrarios y
  suministros + compraventa mayorista de cereal/legumbres) y Ovapiscis
  (acuicultura de huevos embrionados de trucha, B2B, sede en Lugo y planta en
  Covanera/Tubilla del Agua). **1 pendiente** (regla 16): Huevos Camperos (Santa
  María del Campo), nombre genérico SIN WEB sin identidad resoluble. Legumbres
  Arlanza (Lerma, cultiva/envasa legumbres) y Aire de Arlanza (lavanda y
  aromáticas + agroturismo, startup UBU) verificadas con tienda propia. Sin
  nuevos geo-warnings (siguen 7).
- **Snapshot final tras lote 24 — ⚑ 1ª PASADA CERRADA (2026-07-20)**: **303
  filas** (−1: fusión Panaderías Cámara → El Horno de Burgos). **5 pendiente**,
  76 parcial, 222 verificado. Venta online: **140 sí (todas con canal, 0 sin
  canal)**, 9 no, 154 no comprobado. Imágenes: 154/303. Evidencia: 374
  registros. Cierre transversal: resuelta la fusión aplazada del lote 12 (Cámara
  = El Horno de Burgos, misma empresa «El Horno de Burgos SL») y el último hueco
  de municipio (Maltranilla → Valle de Mena, E.L.M.). 7 geo-warnings, todos
  aceptados (artefacto centroide-merindad). **`coverage.json`: NO se añade
  burgos** por los 5 pendientes residuales sin rastro digital (regla 16; mismo
  criterio que Alicante). Balance de la pasada: de 342 filas iniciales a 303
  (−39: 25 purgas + 14 fusiones; los 30 registros `merge` incluyen además 16
  renombres de slug de la misma entidad), 297 pendientes → 5, VO 16 `sí`
  cuarentena → 140 `sí` todos con canal. `verify:data` en verde.
- **Segunda pasada residual (2026-07-28): 5 → 1 `pendiente`**. Miel Riuseco,
  Miel Apilife, Huevos Camperos y Collalb@s reaparecen en Burgos Alimenta u
  otras fuentes públicas y pasan a `parcial`; Collalb@s se recategoriza a
  `Legumbres y cereales`. Solo queda Manuel Torre Vivanco: su teléfono era el
  de la Asociación de Productores y Comerciantes Las Caderechas y se retira,
  pero no hay base para purgar la identidad. Estado: **303 filas; 222
  `verificado`, 80 `parcial`, 1 `pendiente`**.
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
  - ~~`bodegas-arlanza-burgos` y `bodegas-sierra-burgos` (lote 11): 33,5 km~~
    — **resueltos 2026-07-16**: municipio corregido de Burgos a Villalmanzo
    (sede fiscal vs bodega real) y slugs renombrados con merge; los warnings
    desaparecen (las coords ya estaban junto a Villalmanzo).
  - ~~`bodegas-vizcarra-burgos` (lote 11): 78,7 km~~ — **resuelto 2026-07-16**:
    municipio corregido de Burgos a Mambrilla de Castrejón (Finca Chirri), slug
    e imagen renombrados con merge; el warning desaparece.
  - ~~`montegaredo-s-l-aranda-de-duero` (lote 8): 24,8 km~~ — **resuelto
    2026-07-08**: municipio corregido a Pedrosa de Duero (Boada de Roa,
    E.L.M., confirmado por la propia web), slug renombrado con merge; el
    warning desaparece (nuevas coordenadas a 1,8 km del centroide). Nuevo
    warning aceptado en el mismo lote: `bodegas-zapata-la-horra` (antes
    `bodegas-zapata-aranda-de-duero`), 17,7 km junto a Aranda de Duero (su
    sede fiscal); mismo patrón sede-vs-bodega que Villalmanzo/Mambrilla
    (lote 11), municipio corregido a La Horra con fuente propia y la propia
    descripción heredada del CSV.
  - ~~`apimara-arconada` (lote 19): 85,4 km del centroide de «Arconada»~~ —
    **resuelto 2026-07-20**: no era el homónimo de Palencia sino la pedanía
    burgalesa de Arconada (Bureba), localidad del municipio de Carcedo de Bureba
    (INE, confirmado en Wikipedia); municipio corregido y slug renombrado con
    merge (`apimara-carcedo-de-bureba`), 2,8 km al centroide, el warning
    desaparece.
  - `cerveza-gadea-santa-gadea-del-cid` (lote 21): 67,1 km; las coords caen
    en Burgos capital. Resolver dónde elabora de verdad.
  - ~~`lagar-de-isilla-la-vid-y-barrios` (lote 9): 17,0 km~~ — **aceptado
    2026-07-16**: municipio corregido a «La Vid y Barrios» (municipio-agregado
    extenso cuyo centroide cae junto a Aranda de Duero); la bodega está en la
    localidad de La Vid, coordenadas reales sin tocar (regla 18), mismo patrón
    que Zapata/La Horra del lote 8.
  - ~~`dulce-tentacion-merindad-de-rio-ubierna` (lote 12): 20,7 km~~ —
    **aceptado 2026-07-16**: municipio corregido de Sotopalacios a Merindad de
    Río Ubierna (INE), coords reales sin tocar; mismo artefacto de merindad
    extensa que las morcillas del lote 2 (Quintanaortuño es el centroide real
    más cercano, ~2 km).
  - ~~`olla-podrida-burgos-merindad-de-rio-ubierna` (lote 16): 20,5 km~~ —
    **aceptado 2026-07-16**: mismo caso (Sotopalacios → Merindad de Río
    Ubierna), coords reales sin tocar.
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
  | ~~Ahedo del Butrón~~ | E.L.M. de Los Altos (INE, confirmado) — **resuelto 2026-07-20 en lote 19** (`juan-sedano-perez-ahedo-del-butron` → `-los-altos`, merge) | 19 |
  | ~~Barcina de los Montes~~ | pedanía de Oña — **resuelto 2026-07-16 en lote 14** (`quesos-la-majada-de-barcina-barcina-de-los-montes` → `-ona`, merge) | 14 |
  | ~~Boada de Roa~~ | entidad local menor de Pedrosa de Duero (no era hueco) — **resuelto 2026-07-08 en lote 6**: `bodegas-viyuela` renombrada a `-pedrosa-de-duero` con merge, localidad conservada en la dirección | 6 |
  | ~~Cabanas de Virtus / Cabañas de Virtus~~ | pedanía de Valle de Valdebezana — **resuelto 2026-07-07**: las 2 filas con ese municipio se purgaron en el lote 4 (asociación de criadores + Grupo Amicar 8, ambas extintas/sin venta), no queda ninguna fila que lo use | 4 |
  | ~~Castrillo Solarana~~ | NO era hueco: antiguo municipio (INE 09089) hoy E.L.M. integrada en **Lerma** — **resuelto 2026-07-16 en lote 10**: `bodegas-monte-aman-castrillo-solarana` → `bodegas-monte-aman-lerma` (merge slug+imagen), localidad conservada en la dirección | 10 |
  | ~~Cilleruelo de Bezana~~ | pedanía de Valle de Valdebezana — **resuelto 2026-07-16 en lote 11**: `agua-de-corconte-cilleruelo-de-bezana` → `agua-de-corconte-valle-de-valdebezana` (merge slug) y recategorizada a «Agua mineral natural» | 11 |
  | ~~Cubillo del Butrón~~ | localidad de **Valle de Sedano** (INE 09905), **no de Los Altos** (la pista era errónea) — **resuelto 2026-07-20 en lote 17** (`karacoles-los-altos-cubillo-del-butron` → `-valle-de-sedano`, merge slug+imagen); ~10 km al centroide, sin geo-warning | 17 |
  | ~~Dobro~~ | pedanía de Los Altos — **resuelto 2026-07-16 en lote 14** (`quesos-los-altos-dobro` → `-los-altos`, merge) | 14 |
  | ~~Hinestrosa~~ | pedanía de Castrojeriz — **resuelto 2026-07-16 en lote 15** (`quesos-mostelares-hinestrosa` → `-castrojeriz`, merge) | 15 |
  | ~~Hinojar del Rey~~ | pedanía de Huerta de Rey — **resuelto 2026-07-16 en lote 9**: `hinojar-wines-hinojar-del-rey` → `hinojar-wines-huerta-de-rey` (merge), localidad conservada en la dirección | 9 |
  | La Aguilera | pedanía de Aranda de Duero — **lote 8 resuelto 2026-07-08** (`bodegas-dominio-de-cair-la-aguilera` → `bodegas-dominio-de-cair-aranda-de-duero`, merge); la fila del lote 22 en La Aguilera sigue pendiente | 22 |
  | ~~La Vid~~ | municipio La Vid y Barrios — **resuelto 2026-07-16 en lote 9**: `lagar-de-isilla-la-vid` → `lagar-de-isilla-la-vid-y-barrios` (merge), localidad conservada en la dirección; geo-warning de 17,0 km aceptado (municipio-agregado extenso, la localidad La Vid está junto a Aranda) | 9 |
  | ~~Las Machorras, Espinosa de los Monteros 09566~~ | limpiar → Espinosa de los Monteros — **resuelto 2026-07-16 en lote 14** (`ganaderia-ortiz-…-09566` → sin sufijo, merge) | 14 |
  | Lastras de Teza | pedanía de Valle de Losa | 20 |
  | Maltranilla | resolver (¿Valle de Mena?) — **lote 12 (2026-07-16): sin resolver** (WebSearch agotado); `horno-ortiz-maltranilla` queda parcial con el municipio sin tocar (hueco pendiente de 2ª pasada) | 12 |
  | ~~Medianas de Mena~~ | pedanía de Valle de Mena — **resuelto 2026-07-16 en lote 14**: la única fila (`queseria-artesanal-maite`) se purgó (extinguida), no queda ninguna que lo use | 14 |
  | Nava Ordunte | pedanía de Valle de Mena | 22 |
  | ~~Palacios de Benaver~~ | pedanía del municipio de **Isar** (fue municipio propio hasta los años 70) — **resuelto 2026-07-16 en lote 15** (`quesos-ilujor-palacios-de-benaver` → `-isar`, merge) | 15 |
  | ~~Predrosa~~ | errata de Pedrosa de Duero — **resuelto 2026-07-08 en lote 6**: la web de Traslascuestas sitúa la bodega en Valcavado de Roa (E.L.M. de Pedrosa de Duero); slug renombrado con merge, dirección y descripción corregidas | 6 |
  | ~~Quincoces de Yuso~~ | localidad cabecera de Valle de Losa (INE) — **resuelto 2026-07-20 en lote 19** (`miel-lura-quincoces-de-yuso` → `-valle-de-losa`, merge slug+imagen) | 19 |
  | ~~Quintana Martín Galíndez~~ | localidad cabecera de Valle de Tobalina — **resuelto 2026-07-20 en lote 17** (`usanza-quinta-gama-quintana-martin-galindez` → `-valle-de-tobalina`, merge slug+imagen); localidad conservada en la dirección | 17 |
  | Quintanalara | resolver (¿municipio propio?) | 23 |
  | ~~Quintanamanvirgo~~ | entidad local menor de Pedrosa de Duero — **resuelto 2026-07-08 en lote 6**: la web de Rodero da Ctra. Boada s/n, 09314 Pedrosa de Duero; slug renombrado con merge, localidad conservada en la dirección | 6 |
  | ~~Quintanaseca~~ | pedanía de Frías (localidades: Frías, Quintanaseca, Tobera) — **resuelto 2026-07-20 en lote 17** (`granja-ecologica-monterrebollo-quintanaseca` → `-frias`, merge slug); localidad conservada en la dirección | 17 |
  | ~~Quintanilla del Agua~~ | municipio oficial «Quintanilla del Agua y Tordueles» — **resuelto 2026-07-16 en lote 10**: `gotas-de-rocio-quintanilla-del-agua` → `gotas-de-rocio-quintanilla-del-agua-y-tordueles` (merge slug+imagen), localidad conservada en la dirección | 10 |
  | ~~Rioseco (Valle de Manzanedo)~~ | limpiar → Valle de Manzanedo — **resuelto 2026-07-16 en lote 14** (`quesos-santa-gadea-rioseco-valle-de-manzanedo` → `-valle-de-manzanedo`, merge) | 14 |
  | ~~Roa de Duero~~ | municipio oficial «Roa» (confirmado en Wikipedia) — **resuelto 2026-07-07**: 7 slugs renombrados con merge en el lote 5 | 5 |
  | San Llorente de la Vega | pedanía de Melgar de Fernamental | 20 |
  | ~~San Mamés de Abar, Basconcillos del Tozo, Burgos~~ | localidad de Basconcillos del Tozo — **resuelto 2026-07-20 en lote 19**: valor sucio limpiado a «Basconcillos del Tozo» (`miel-las-loras-de-brezo-…-burgos` → `-basconcillos-del-tozo`, merge slug+imagen) | 19 |
  | ~~Santa Gadea de Alfoz~~ | municipio Alfoz de Santa Gadea — **resuelto 2026-07-07**: `carne-de-la-buena-santa-gadea-de-alfoz` renombrada a `carne-de-la-buena-alfoz-de-santa-gadea` (centroide confirmado en municipios.json, coords del CSV ya cuadraban) | 4 |
  | Sotopalacios | pedanía de Merindad de Río Ubierna — **resuelto 2026-07-06 en lote 2** (3 slugs) y **2026-07-16 en lote 12** (`dulce-tentacion-sotopalacios` → `-merindad-de-rio-ubierna`); genera geo-warning ~20 km esperado, ver Estado | 12, 16 |
  | ~~Valdenoceda~~ | pedanía de Merindad de Valdivielso — **resuelto 2026-07-16 en lote 14** (`el-carluque-valdenoceda` → `-merindad-de-valdivielso`, merge) | 14 |
  | Villafuertes | municipio real; probable hueco | 2 |
  | Villamayor del Río | municipio real; hueco confirmado 2026-07-07 (no está en municipios.json), coords del CSV no se tocan | 4 |
  | ~~Villasilos~~ | pedanía de Castrojeriz — **resuelto 2026-07-16 en lote 15** (`quesos-rico-villasilos` → `-castrojeriz`, merge) | 15 |
  | Vivar del Cid | pedanía de Quintanilla Vivar | 22 |
  | Vizmalo | municipio real; probable hueco | 2 |
  | ~~Zaballa~~ | Zaballa de Losa, en **Valle de Losa** (Burgos) — **resuelto 2026-07-16 en lote 14** (`quesos-ugala-zaballa-zaballa` → `-valle-de-losa`, merge) | 14 |

- Grafías a normalizar dentro de sus lotes (sin cambiar identidad):
  ~~«ARANDA DE DUERO» (lote 8)~~ — **resuelto 2026-07-08**: la fila
  (`bodegas-zapata-…`) terminó con municipio distinto, La Horra, por el
  hallazgo sede-fiscal-vs-bodega-real (ver Estado), no por una simple
  normalización de mayúsculas, ~~«SOTILLO DE LA RIBERA» (lote 7)~~ —
  **resuelto 2026-07-08**: `bodega-rubiejo-sotillo-de-la-ribera` normalizado a
  «Sotillo de la Ribera» (solo municipio, slug sin cambios), ~~«GUMIEL DE IZÁN» (lote 9)~~ — **resuelto 2026-07-16** (Abadía San Quirce), «Salas de Los Infantes»→«Salas de los Infantes» (lote 4) y
  «Gumiel del Mercado»→confirmar oficial «Gumiel de Mercado» (lote 3).
- Filas que son **entidades de promoción/registro, no productores** (purga
  `not-producer` probable; sus webs pasan a ser FUENTES de cotejo):
  `asociacion-de-fabricantes-de-morcilla-de-burgos-burgos` e
  `igp-morcilla-de-burgos-burgos` (lote 1),
  `i-g-p-lechazo-de-castilla-y-leon-aranda-de-duero` (lote 3),
  `asociacion-de-carne-de-potro-hispano-breton-de-burgos-cabanas-de-virtus`
  (lote 4, con fila gemela no-asociación a resolver juntas),
  `consorcio-ruta-del-vino-ribera-del-duero-aranda-de-duero` (lote 8),
  ~~`consejo-regulador-de-d-o-arlanza-lerma`~~ (lote 10, **purgada 2026-07-16** not-producer),
  ~~`asociacion-slowfood-burgos-burgos`~~ (lote 16, **purgada 2026-07-16** not-producer; ídem ASOHAR, asociación de hosteleros de Aranda),
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
| 8 | Bodega · Aranda de Duero | 18→17 | ✅ 2026-07-08 | 15 verificadas, 2 parciales (Raimundo Izquierdo García, Altos del Terral), 1 purga (Consorcio Ruta del Vino, `not-producer`). 5 renombres con merge por sede fiscal vs bodega real: Montegaredo→Pedrosa de Duero, Bodegas Nabal→Gumiel de Izán, Roberik→Milagros, Bodegas Zapata→La Horra (estos 3 últimos sin flag previo del lote) y Dominio de Cair (La Aguilera→Aranda de Duero, pedanía). «Feliz» renombrada a «Vino Feliz» (regla 20). VO: 13 nuevos `sí` con canal (11 ecommerce, 1 telefono, 1 email). |
| 9 | Bodega · Gumiel, Fuentelcésped y sureste | 18→16 | ✅ 2026-07-16 | 14 verificadas, 2 parciales (Ermita del Conde, Hinojar Wines), 2 fusiones. Díaz Bayo: fusión (mismo dominio/tel/dirección, grupo Premium Fincas). Milvus/San Andrés: fusión (Coop. San Andrés renombrada a Bodegas Milvus S. Coop.). Ermita del Conde → parcial: dominio secuestrado (spam casino), web retirada. Municipios corregidos con merge: Hinojar del Rey→Huerta de Rey, La Vid→La Vid y Barrios. Grafía GUMIEL DE IZÁN normalizada (Abadía San Quirce). Valdecamellas: web valdecamellas.eu añadida. VO: 10 nuevos `sí` con canal (todos ecommerce; Valdubón vía Club Cuvée del grupo Ferrer/Freixenet). |
| 10 | Bodega · Arlanza, eje Lerma | 17→16 | ✅ 2026-07-16 | 9 verificadas, 6 parciales, 1 purga (Consejo Regulador D.O. Arlanza, not-producer). Retiradas 6 webs ajenas arlanza.org: Arlese recuperó web propia (bodegasarlese.es) → verificada; las otras 5 (Viña y Tía, Alonso Angulo, Viñedos de Altura, Agrobauto, Melequín) sin web propia → parcial, VO no→no comprobado. Copaboca Villalmanzo confirmada instalación real distinta de Sotillo (lote 7). Bodegas Lerma/Nabal: misma familia Navarro Balbás, no fusionar. Municipios: Castrillo Solarana (E.L.M.)→Lerma y Quintanilla del Agua→…y Tordueles (merge slug+imagen). VO: 6 nuevos `sí` (ecommerce). |
| 11 | Bodega · Arlanza este, capital y atípicas | 17→14 | ✅ 2026-07-16 | 8 verificadas, 6 parciales, 2 purgas (Barbastro=grupo hostelería, Vermutería Victoria=bar), 1 fusión (Bodega Covarrubias→Valdable). 3 geo sede-vs-bodega resueltos: Arlanza+Sierra→Villalmanzo, Vizcarra→Mambrilla de Castrejón. Palacio de Lerma→Lerma (coords a la bodega). El Ternero (enclave): Haro→Miranda de Ebro. Agua de Corconte→cat «Agua mineral natural» + Valle de Valdebezana. Septién trasladada a Puentedura. Cardeña productor real (vino/cerveza/licor). 3 webs arlanza.org retiradas/corregidas. VO: 2 nuevos sí (ecommerce). |
| 12 | Pan y pastelería · capital, Bureba y norte | 17 | ✅ 2026-07-16 | 7 verificadas, 10 parciales, 0 purgas. Sarralde recategorizada a «Frutos secos». Dulce Tentación: Sotopalacios→Merindad de Río Ubierna (merge). Merey: web business.site muerta retirada. VO: 3 nuevos sí (ecommerce). ⚠ Pasada con tooling reducido (WebSearch agotado): El Horno/Cámara (posible fusión) y 6 SIN WEB quedan parcial a re-verificar; Maltranilla sin resolver INE. |
| 13 | Pan y pastelería · Ribera, Arlanza y oeste | 15→13 | ✅ 2026-07-16 | 9 verificadas, 4 parciales, 2 purgas. La Torta de Aranda = M.G. (producto) → purga not-producer; El Ventorro = hotel-restaurante/tienda (revende) → purga out-of-scope. Perines: web negocio.site muerta retirada. Panaranda=Pan Aranda (obrador M.G. Torta de Aranda). Tudanca no fusiona con Viñedos la Nava (lote 8). VO: 1 nuevo sí (Tudanca ecommerce). |
| 14 | Lácteos y quesos · Merindades y Bureba | 12→11 | ✅ 2026-07-16 | 10 verificadas, 1 parcial, 1 purga (Quesería Artesanal Maite, extinguida 2026-05-07). 6 municipios con merge: Barcina→Oña, Dobro→Los Altos, Rioseco→Valle de Manzanedo, Valdenoceda→Merindad de Valdivielso, Zaballa→Valle de Losa, Las Machorras→Espinosa (limpieza). 2 cuarentenas VO resueltas (Ovejero, Las Nieves→sí ecommerce). Webs: +quesoscarreras.com; Ovejero→lacteosovejero.es; Ugala→quesosugala.wordpress.com. VO: 3 sí (ecommerce). |
| 15 | Lácteos y quesos · centro, Odra y sur | 14→13 | ✅ 2026-07-16 | 8 verificadas, 5 parciales, 1 fusión (Comercial Altoesgueva→Quesos del Vidal, brazo comercial). Mostelares/Ilújor NO son la misma (2 queserías distintas). Municipios con merge: Palacios de Benaver→Isar, Hinestrosa→Castrojeriz, Villasilos→Castrojeriz. Valparaíso: web negocio.site muerta retirada. Casona/Vadorrey parcial (sitios caídos). VO: 4 sí (3 ecommerce + Rico telefono). |
| 16 | Despensa artesanal · capital y sur | 13→11 | ✅ 2026-07-16 | 5 verificadas, 6 parciales, 2 purgas (ASOHAR y Slow Food Burgos, asociaciones not-producer). Recats: Caralmeat/Umoh→Platos preparados, Granja Las Villanas→Huevos. Olla Podrida: Sotopalacios→Merindad de Río Ubierna. Bilbasa: Burgos (sede fiscal)→Melgar de Fernamental (fábrica). Parciales por alcance sin resolver (La Casa de la Aceituna, Zalau, Campeador) o sin fuente primaria (Caracoles Burgaleses, Bilbasa, Caracoles Arlanza). VO: 2 sí (ecommerce). |
| 17 | Despensa artesanal · norte y oeste | 11 | ✅ 2026-07-20 | 7 verificadas, 4 parciales, 0 purgas. Recats (8): La Llueza→Pato y derivados, Cafés Gometero→Café, Sal de Poza→Sal, Usanza→Platos preparados, Conservas Espinosa→Pescado y conservas, Huevos Himma/Avícola Álvarez/Monterrebollo→Huevos. 3 municipios con merge: **Cubillo del Butrón→Valle de Sedano** (la pista «Los Altos» del ledger era errónea; INE 09905, confirmado en Wikipedia), Quintana Martín Galíndez→Valle de Tobalina, Quintanaseca→Frías. Naturae: planta real en Pradoluengo confirmada (la sede del spin-off en Valladolid es comercial). Monterrebollo: web=Facebook retirada. Avícola Álvarez: web con cert autofirmado conservada (regla 17). VO: 5 nuevos sí (2 ecommerce, 2 marketplace, 1 ecommerce\|marketplace). |
| 18 | Miel · capital, Demanda y Arlanza | 14 | ✅ 2026-07-20 | 7 verificadas, 6 parciales, **1 pendiente** (Apilife, sin rastro digital), 0 purgas. 2 cuarentenas VO resueltas: LAMEMIEL→sí telefono\|email, Sabinares del Arlanza→no comprobado. 2 heredados VO=no re-derivados: 10 Miel→sí telefono\|email, Apicast→no comprobado. 2 municipios con merge: VamosAunando Burgos(domicilio)→**Briviesca** (colmenares, sede-vs-producción, coords al centroide) y Apícola Guerrero «Huerta del Rey»→«Huerta de Rey» (grafía INE). Alcance: Hernando Hurtado (envasadora/mayorista 5000 t, maquila, sin colmenas propias)→parcial candidata out-of-scope; Apicast (apicultor real pero B2B a granel 300 kg)→parcial. Marketplace como canal: Miel Subiñas (bakailuak.com), Apícola Izquierdo (vinosribera.com). Ada Müller verificada vía IG+ASAPIBUR (web no resuelve, regla 17). |
| 19 | Miel · Merindades y páramos | 8 | ✅ 2026-07-20 | 5 verificadas, 2 parciales, 1 pendiente (Miel Riuseco, sin rastro digital), 0 purgas. **Geo-warning de 85 km de Apimara resuelto**: «Arconada» era la pedanía burgalesa (Bureba), no el homónimo de Palencia → municipio Carcedo de Bureba (2,8 km). 3 municipios más con merge: Ahedo del Butrón→Los Altos, Quincoces de Yuso→Valle de Losa, «San Mamés de Abar, Basconcillos del Tozo, Burgos»→Basconcillos del Tozo. Cuarentena Las Loras de Brezo→sí ecommerce (tienda propia). Miel de Frías (apiturismo, apicultor 134BU0017) HEREDADO parcial→verificado. Api Espinosa (Yolanda Martínez, VP ASAPIBUR, tienda propia)→verificado sí ecommerce. VO: 4 nuevos sí (ecommerce). |
| 20 | Fruta y verdura · provincial | 16→14 | ✅ 2026-07-20 | 4 verificadas, 8 parciales, 2 pendientes (Collalb@s, Manuel Torre Vivanco — SIN WEB, sin ficha real ni rastro), **2 purgas** not-producer (las 2 M.G.: Lechuga de Medina = Asoc. Hortícola Merindades, Manzana/Cereza de Caderechas = Asoc. Productores; tel 947040266 compartido entre sí y con la asociación Patata de Burgos). **2 webs ajenas retiradas** (patrón arlanza.org): patatadeburgos.es en Almacenes Sualdea (= asoc. Patata de Burgos) y coopcyl.es en Canal de Castilla (= portal URCACYL). Alcance→parcial: 3 almacenistas de patata capital (Arreba/Colina/Fernández) + Sualdea (mayoristas sin cultivo), Cosidel (heredado verif→parcial: patata de siembra B2B), Canal de Castilla (coop cerealista B2B), Fundación Conde Fernán Armentález (huerta CEE sin venta confirmada). Reales verificadas: SOCOCAR (mayor productora de patata de siembra de España), Natura Suko (microvegetales), Alubia Losina (alubia eco, VO sí ecommerce), Rucandio Frutas de Montaña (Caderechas, VO sí ecommerce). **4 municipios con merge**: Natura Suko Burgos→Saldaña de Burgos, Alubia Losina Lastras de Teza→Valle de Losa, Salvana Carcedo→Castrillo del Val, Canal de Castilla San Llorente de la Vega→Melgar de Fernamental (ELM, INE 09211). Recats a Legumbres/Legumbres y cereales/Fruta. 0 geo-warnings nuevos. |
| 21 | Cerveza artesana · provincial | 16→13 | ✅ 2026-07-20 | 7 verificadas, 6 parciales, 0 pendientes, **2 purgas** out-of-scope (La Vache Folle = bar; Cerveza Victoria = marca propia del bar Vermutería Victoria elaborada por Marbi) + **1 fusión** (Beer in Burgos → Siesta Brewing, mismo dominio oficial). Fábricas reales con tienda propia → VO=sí ecommerce: Mica (100% sin alcohol, Mejor del Mundo 2017), Dolina, Virtus, Gadea, Siesta, Tesela (cuarentena resuelta). Marbi VO=sí marketplace (web caducada retirada). Bajo Cero verif sin tienda. Parciales SIN WEB (elaboradores reales, solo directorio/prensa): Ambrosía (cerveza de quinua + hidromiel), Alis, Berzaga, Una-Rubia, Momelius. **GEO-WARNING 67 km de Gadea resuelto**: coords en Burgos capital → centroide de Santa Gadea del Cid. Pares de tel/dominio resueltos: Alis↔La Vache Folle (marca vs bar), Beer in Burgos↔Siesta (fusión). |
| 22 | Licores, Sidra, Chocolate y Dulces | 13→11 | ✅ 2026-07-20 | 10 verificadas, 1 parcial (El Chocolatero, familia Merino), 0 pendientes, **2 purgas** out-of-scope: Vermut Victoria (vermut de la casa del bar Vermutería Victoria → **cierra el trío Victoria**: bar l11, cerveza l21, vermut l22) y Licores Lujo (comercializador de licores personalizados, sede Basauri/Vizcaya, no elaborador). Destilerías/elaboradores reales con tienda propia → VO=sí ecommerce: Casajús, Pacharán Menesa, Iesu Communio (repostería conventual), Clarisas (conventual). Brainapple VO=sí marketplace (⚠ web con spam de casino en un fetch, conservada regla 17). Destilería Reino de Castilla (única autorizada de Burgos para fabricar alcohol) y obradores (Silma 1956, R.M. Terán, Bizcochos Noel, XocolART) verif sin carrito. **Cuarentena XocolART resuelta** a no comprobado (tienda palbin caída). **2 municipios con merge**: La Aguilera→Aranda de Duero, Vivar del Cid→Quintanilla Vivar (INE 09301). Webs caídas/actualizadas: silmaburgos.es→.com, palbin→xocolart.com, areposteria.es→pequenareposteria.es, blog El Chocolatero retirado. | Conventos (Clarisas Vivar, Iesu Communio); vermut Victoria (trío); Xocolart cuarentena; sidra Brainapple en Miranda. |
| 23 | Trufa, Legumbres, Huevos y resto | 11→9 | ✅ 2026-07-20 | 6 verificadas, 2 parciales, 1 pendiente (Huevos Camperos, nombre genérico sin identidad resoluble), **2 purgas** not-producer: ATRUBUR (`trufa-de-burgos`, asociación de truficultores; el productor real de Quintanalara es LARATRUF, comparten tel) y M.G. Alubia Roja de Ibeas. Truficultores reales con venta propia: Sustrufas (ecommerce|whatsapp), LARATRUF (telefono|email; **descubierta su web laratruf.com**), Trufbox (ecommerce; sede real en Tórtoles de Esgueva/Caleremuga Burgos, no Soria). Legumbres Arlanza y Aire de Arlanza (lavanda/aromáticas) con tienda online. **2 cuarentenas VO=sí resueltas** (Sustrufas, Aire de Arlanza → ganan canal): **con esto 140/140 VO=sí llevan canal**. SERABUR (servicios agrarios) y Ovapiscis (huevos de trucha B2B, sede Lugo) → parcial por alcance. **1 municipio con merge**: Quintanalara → Revilla del Campo (E.L.M., INE, integrado 1981). | M.G. Alubia (purga probable); Trufa de Burgos=ATRUBUR (¿asociación?); par con Laratruf; cereales-y-servicios (alcance); 2 cuarentenas. |
| 24 | Cierre transversal provincial | 342 | ✅ 2026-07-20 | **⚑ 1ª PASADA CERRADA.** Dedup global (2 aplazados resueltos: Cámara=El Horno de Burgos → fusión), Maltranilla→Valle de Mena (último hueco de municipio), 7 geo-warnings aceptados (centroide-merindad), cuarentena VO a cero (140 `sí` todos con canal), `coverage.json` NO añade burgos (5 pendientes residuales, criterio Alicante), `verify:data` en verde. Estado final: 303 filas, 222 verif/76 parcial/5 pend. |

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

### Lote 8 · Bodega — Aranda de Duero (18→17) — ✅ 2026-07-08

```text
altos-del-terral-aranda-de-duero · Aranda de Duero — parcial (no promovida), VO=no comprobado. Bodega real (Paco Casas, enólogo desde 1996) muy documentada en el registro de la DO y en prensa/retailers especializados, pero altosdelterral.com dio error 500/404 en todas las rutas probadas; sin fuente propia operativa ni redes propias en el CSV, techo parcial (regla 5). Solo terceros revenden el vino, no es canal propio
bodega-finca-cantaburros-aranda-de-duero · Aranda de Duero — verificado, VO=sí (ecommerce, tienda.cantaburros.es con carrito y precios reales)
bodega-tierra-aranda-aranda-de-duero · Aranda de Duero — verificado, VO=sí (ecommerce, vinotierraranda.es con ficha de producto, precio y «Añadir al carrito» funcionales)
bodega-vina-buena-aranda-de-duero · Aranda de Duero — verificado, VO=sí (email). Tienda online «Próximamente» sin carrito, pero la propia página invita explícitamente a pedir por correo a marketing@vinabuena.com mientras se termina
bodegas-el-lagar-de-isilla-aranda-de-duero · Aranda de Duero — verificado, VO=sí (ecommerce, tiendaellagardeisilla.com). Es la bodega histórica del s. XV bajo el Restaurante El Lagar de Isilla (origen del grupo en 1995, familia Zapatero Pinto); instalación real y distinta de `lagar-de-isilla-la-vid` (lote 9, elaboración actual del grupo) — no duplicado, mismo criterio que Copaboca (lote 7); nota para el lote 9
bodegas-martin-berdugo-aranda-de-duero · Aranda de Duero — verificado, VO=sí (ecommerce, martinberdugo.com/shop-online/ con carrito, precios y envío gratis desde 50€)
bodegas-nabal-gumiel-de-izan · Gumiel de Izán (antes Aranda de Duero; slug renombrado con merge, sede fiscal vs bodega real, sin flag previo) — verificado, VO=no comprobado. La propia web da A-1 salida 168, Valle de Nabal, 09370 Gumiel de Izán (la dirección del CSV ya mencionaba «Gumiel de Izán» antes del sufijo erróneo). Tel compartido con `bodegas-lerma-lerma` (lote 10): misma familia Navarro Balbás, fundó Lerma en 1998 y Nabal en 2014 — dos bodegas reales, no fusionar; nota para el lote 10
bodegas-vetusta-aranda-de-duero · Aranda de Duero — verificado, VO=sí (ecommerce, tiendabodegasvetusta.com con carrito, precios y envío gratis desde 60€)
bodegas-y-vinedos-roberik-milagros · Milagros (antes Aranda de Duero; slug renombrado con merge, sede fiscal vs bodega real, sin flag previo) — verificado, VO=no comprobado. El registro oficial de la DO Ribera del Duero da C/Palencia 5, Nave 1, 09460 Milagros, y prensa especializada confirma que la bodega ocupa una nave del Polígono Industrial Alto Milagros desde 2015; la dirección del CSV (C/Ávila 3, Aranda de Duero) no se sostiene con fuente propia. Página de productos con un precio de promoción pero sin carrito/checkout confirmado
bodegas-zapata-la-horra · La Horra (antes Aranda de Duero «ARANDA DE DUERO»; slug renombrado con merge, sede fiscal vs bodega real, sin flag previo — solo se esperaba grafía) — verificado, VO=sí (ecommerce, bodegaszapata.com/vinos con botón «Comprar», precios reales y «Mi carrito»). La propia descripción heredada del CSV y la web ya decían «bodega boutique ubicada en el municipio de La Horra, Triángulo de Oro»; C/Bajada al Molino 15, Aranda de Duero, es domicilio social/fiscal (einforma.com, datoscif.es). Coordenadas sin tocar: nuevo geo-warning de 17,7 km aceptado (mismo patrón que Villalmanzo/Mambrilla, lote 11)
consorcio-ruta-del-vino-ribera-del-duero-aranda-de-duero · Aranda de Duero — PURGADA `not-producer`. Consorcio turístico-promocional (101 municipios adheridos, 242 servicios); su dirección (Pz. del Trigo 10-3ª) y dominio riberate.com coinciden con el CSV pero no es productor. riberate.com no respondió a la conexión directa; su naturaleza institucional está confirmada por fuentes independientes (regla 17)
dani-mabe-wines-aranda-de-duero · Aranda de Duero — verificado, VO=sí (ecommerce, danimabewines.com con carrito y precios 23,50-29€). Proyecto personal de Daniel Mabe (ex técnico de Dominio de Cair); viñedos ecológicos propios en Quemada, bodega/oficina en Aranda de Duero (coincide con el CSV, sin corrección de municipio)
feliz-aranda-de-duero · Aranda de Duero — verificado, VO=sí (ecommerce, «Comprar Feliz» con carrito y precios). Nombre limpiado de «Feliz» a «Vino Feliz» (regla 20, slug sin tocar): proyecto de Félix Marina, Plaza Santa María 2
junciera-jine-aranda-de-duero · Aranda de Duero — verificado, VO=sí (ecommerce, junciera-jine.es con carrito y precios 12-90€). Familia Cristóbal Miguel, viñedos propios de hasta 200 años, vinos sin sulfitos añadidos
montegaredo-s-l-pedrosa-de-duero · Pedrosa de Duero (antes Aranda de Duero; slug renombrado con merge, geo-warning de 24,8 km resuelto) — verificado, VO=sí (telefono: la web anuncia explícitamente «Teléfono Pedidos vino Ribera del Duero»). Bodega pirámide semienterrada en Boada de Roa (E.L.M. de Pedrosa de Duero)
raimundo-izquierdo-garcia-aranda-de-duero · Aranda de Duero — parcial (no promovida), VO=no comprobado. Identidad resuelta: es el responsable de la bodega Solira 2002 S.L. (marca Vega Privanza y otras: Dulzaina de Castilla, Vega Vieja, Urbión, El Brujo, Terroyales, Gran Mester), mismo teléfono que el CSV; elabora vino propio, se mantiene en categoría Bodega. Dominio vegaprivanza.net/.com no resuelve por DNS, `web` retirada del CSV; solo fuente de directorio (laesenciadelvino.com), techo parcial (regla 5). Tel compartido con `apicola-izquierdo-aranda-de-duero` (lote 18): misma persona/familia con viña y miel, no fusionar; nota para el lote 18
vinedos-la-nava-s-l-aranda-de-duero · Aranda de Duero — verificado, VO=sí (ecommerce, grupotudanca.com/tienda con carrito, cajas «Tudanca Tres Maris» 38,70-177€). Es la unidad vitivinícola de Grupo Tudanca (36 ha, marca «La Nava By Tudanca» confirmada en empresite.eleconomista.es); mismo dominio que `pasteleria-tudanca-aranda-de-duero` (lote 13) — dos unidades reales del mismo grupo, no fusionar; nota para el lote 13
bodegas-dominio-de-cair-aranda-de-duero · Aranda de Duero (antes La Aguilera; slug renombrado con merge, pedanía de Aranda de Duero) — verificado, VO=sí (ecommerce, familialuiscanas.com/web/cair con carrito, precios 13,50-1.497€ y pasarela de pago). Bodega del grupo Familia Luis Cañas en La Aguilera (Ctra. Aranda-La Aguilera km 9)
```

Notas del lote: **cuatro sede-fiscal-vs-bodega-real, tres sin flag previo**
— Montegaredo ya venía flageada con su geo-warning exacto (24,8 km), pero
Bodegas Nabal (→ Gumiel de Izán), Bodegas y Viñedos Roberik (→ Milagros) y
Bodegas Zapata (→ La Horra) no tenían ningún flag en este lote; se
detectaron leyendo la web propia y, en el caso de Zapata, la propia
descripción heredada del CSV, que ya decía «bodega boutique ubicada en el
municipio de La Horra». Zapata y Roberik/Nabal ilustran variantes del mismo
patrón: Montegaredo y Zapata dejan coordenadas sin tocar y aceptan un
geo-warning (regla 18); Nabal y Roberik quedan dentro del margen de 15 km
sin generar warning nuevo. **Grupos familiares con dos bodegas reales, sin
fusionar** (precedente Flores y Jiménez de Ávila y Cillar de
Silos/Dominio del Pidio del lote 7): Bodegas Nabal/Bodegas Lerma (lote 10,
familia Navarro Balbás), Lagar de Isilla Aranda/Lagar de Isilla La Vid (lote
9, mismo grupo con bodega histórica + elaboración actual), Viñedos la
Nava/Pastelería Tudanca (lote 13, Grupo Tudanca) y Raimundo Izquierdo
García/Apícola Izquierdo (lote 18, misma persona con viña y miel). Ninguno
de los cuatro pares se fusiona: son unidades de negocio reales y distintas
del mismo grupo o familia.

### Lote 9 · Bodega — Gumiel, Fuentelcésped y sureste (18→16) — ✅ 2026-07-16

```text
bodegas-coruna-del-conde-coruna-del-conde · Coruña del Conde — verificado, VO=no comprobado. Vinos vivos/naturales (Alberto López Calvo, BC/DC, «I'm Natural Don't Panic»); web propia sin carrito ni pedido remoto anunciado
ermita-del-conde-coruna-del-conde · Coruña del Conde — parcial (DEGRADADA), VO=no comprobado. Bodega real (2006; Albillo Centenario, Pago del Conde, ~20 ha), pero su dominio ermitadelconde.com está SECUESTRADO (sirve spam de casino Pin Up; `/en/` y `/en/winery/` dan 404) → web RETIRADA (regla 17). Identidad por marketplaces/prensa (Bodeboca, Vinissimus), sin fuente propia operativa ni ficha de Maps confirmada → techo parcial (regla 5)
bodegas-valdecamellas-fresnillo-de-las-duenas · Fresnillo de las Dueñas — verificado, VO=no comprobado. Marca de Fresvino S.L. (C/ Lavaderos 1); web oficial valdecamellas.eu AÑADIDA (antes SIN WEB); los enlaces de compra van a un placeholder de plantilla, sin carrito propio
bodega-diaz-bayo-hermanos-s-l-fuentelcesped · Fuentelcésped — verificado, VO=no comprobado. SUPERVIVIENTE de la fusión con `bodegas-nuestro-de-diaz-bayo-s-l-fuentelcesped` (mismo dominio bodegadiazbayo.com, tel +34947561020 y dirección Camino de los Anarinos s/n; grupo Premium Fincas, «Nuestro» es su vino insignia). Sin tienda propia. Nombre limpiado a «Bodega Díaz Bayo» (regla 20)
bodegas-de-blas-serrano-fuentelcesped · Fuentelcésped — verificado, VO=sí (ecommerce, /tienda con carrito; marcas de Blas Serrano, Mathis, Phylos)
bodegas-nuestro-de-diaz-bayo-s-l-fuentelcesped · FUSIONADA → `bodega-diaz-bayo-hermanos-s-l-fuentelcesped` (misma explotación, dos razones sociales del grupo Premium Fincas)
bodegas-pascual-fuentelcesped · Fuentelcésped — verificado, VO=sí (ecommerce, /tienda/ con carrito y formas de pago; bodega familiar desde 1986, marcas Peñalosa/Diodoro/Leira Reyero)
bodegas-abadia-san-quirce-gumiel-de-izan · Gumiel de Izán — verificado, VO=sí (ecommerce, /tienda/ con carrito). Grafía del municipio normalizada («GUMIEL DE IZÁN» → «Gumiel de Izán») en municipio y dirección
bodegas-vinum-vitae-gumiel-de-izan · Gumiel de Izán — verificado, VO=no comprobado. Razón social Vinum Vitae, marca Avañate (web avanate.es, correcta); ~3.500 bot./año de tempranillo propio, sin tienda
dominio-basconcillos-gumiel-de-izan · Gumiel de Izán — verificado, VO=sí (ecommerce, /shop WooCommerce con precios+IVA y estados de stock)
ferratus-gumiel-de-izan · Gumiel de Izán — verificado, VO=sí (ecommerce, tienda funcional confirmada: precios, «Añadir al carrito», envíos 72 h)
hinojar-wines-huerta-de-rey · Huerta de Rey (antes «Hinojar del Rey»; slug renombrado con merge, pedanía INE 09174) — parcial, VO=no comprobado. Localidad conservada en la dirección; su web hinojar.wine dio HTTP 521 (origen caído) todas las veces esta sesión → sin fuente propia operativa (regla 5/17), dominio NO retirado (caída transitoria)
lagar-de-isilla-la-vid-y-barrios · La Vid y Barrios (antes «La Vid»; slug renombrado con merge, INE) — verificado, VO=sí (ecommerce, tiendaellagardeisilla.com). Complejo enológico de La Vid del Grupo Lagar de Isilla, distinto de la bodega histórica de Aranda (lote 8) — mismo grupo, no duplicado. Geo-warning de 17,0 km aceptado (municipio-agregado extenso, localidad junto a Aranda, coords reales)
bodega-la-milagrosa-milagros · Milagros — verificado, VO=sí (ecommerce, /tienda/ + correo pedidos@; cooperativa desde 1962, marcas Milcampos/Escondido/Señorío del Tallar)
bodegas-altos-de-enebro-milagros · Milagros — verificado, VO=sí (ecommerce, /tienda/). Proyecto de Rodrigo González, Pol. Ind. Alto de Milagros (C/ Palencia 5, co-ubicado con Roberik del lote 8, no duplicado)
bodegas-valdubon-milagros · Milagros — verificado, VO=sí (ecommerce, Club Cuvée, tienda oficial del grupo). Bodega de Ferrer Miranda (grupo Ferrer/Freixenet) desde 2019; sin dominio propio activo (web vacía)
bodegas-milvus-zazuar · Zazuar — verificado, VO=sí (ecommerce, tienda.bodegasmilvus.es). SUPERVIVIENTE de la fusión con `bodegas-san-andres-zazuar`: la Coop. San Andrés de Zazuar (1967) se renombró a Bodegas Milvus S. Coop. (marcas Vegazar, Milvus, Señorío de Zazuar, Fuenconcejo, Viña Rodalo)
bodegas-san-andres-zazuar · FUSIONADA → `bodegas-milvus-zazuar` (nombre antiguo de la misma cooperativa)
```

Notas del lote: **dos fusiones** (Díaz Bayo Hermanos/Nuestro de Díaz Bayo; Coop. San Andrés/Bodegas Milvus), ambas por identidad única confirmada (mismo dominio/tel/dirección o renombre registral), no por enlace compartido a secas. **Ermita del Conde degradada a parcial**: caso nuevo de dominio secuestrado que sirve spam de casino (mismo patrón que Destraperlo en Granada) — web retirada, fila sostenida por marketplace/prensa; candidata a re-comprobar en 2ª pasada por si recupera su web o aparece ficha real de Maps. **Dos municipios sin centroide resueltos** (Hinojar del Rey → Huerta de Rey, La Vid → La Vid y Barrios), ambos con merge de slug y localidad conservada en la dirección; La Vid añade un geo-warning aceptado de 17,0 km. `bodegas-valdecamellas` gana web oficial (valdecamellas.eu). VO: 10 nuevos `sí`, todos ecommerce (incluido Valdubón vía Club Cuvée del grupo).

### Lote 10 · Bodega — Arlanza, eje Lerma (17→16) — ✅ 2026-07-16

```text
bodegas-carrillo-de-albornoz-avellanosa-de-muno · Avellanosa de Muñó — verificado, VO=no comprobado. Viñedos centenarios propios; ficha de Google Business (4,8/5, 15 reseñas). Web propia bodegascda.com dio error de certificado esta sesión (no retirada, regla 17). Sin tienda online confirmada
bodegas-monte-aman-lerma · Lerma (antes «Castrillo Solarana»; slug+imagen renombrados con merge) — verificado, VO=sí (ecommerce, monteaman.com/es con carrito y precios). Castrillo Solarana es E.L.M. integrada en Lerma (antiguo municipio INE 09089), localidad conservada en la dirección
vina-y-tia-cilleruelo-de-abajo · Cilleruelo de Abajo — parcial, VO=no comprobado. Inscrita en D.O. Arlanza; web arlanza.org (del consejo) AJENA retirada; sin web propia (techo parcial, regla 5)
alonso-angulo-lerma · Lerma — parcial, VO=no comprobado. Proyecto de Soraya Angulo (viñedos en Castrillo de Solarana y Revilla Cabriada); web arlanza.org AJENA retirada; sin web propia
bodegas-lerma-lerma · Lerma — verificado, VO=no comprobado. Familia Navarro Balbás desde 1998 (Óscar Navarro); tel/enoturismo compartidos con Bodegas Nabal (lote 8) — misma familia, NO fusionar. Solo tienda física/contacto, sin carrito online
consejo-regulador-de-d-o-arlanza-lerma · PURGADA not-producer. Consejo Regulador D.O. Arlanza (certificación/promoción), no productor; su web arlanza.org queda como fuente del sector
decorus-lerma · Lerma — verificado, VO=sí (ecommerce, tienda propia bodegasdecorus.com). Bodega joven D.O. Arlanza (microvinificaciones)
sabinares-y-vinas-lerma · Lerma — parcial, VO=no comprobado. Bodega Sabinares (2010, Luis Martín), viñedos viejos >1000 m; vino Colina Triste. Web propia colinatristewine.com no resolvió (DNS) esta sesión → parcial (no retirada, regla 17)
vinedos-de-altura-lerma · Lerma — parcial, VO=no comprobado. Viñedos de Altura S.L. (2020, satélite de Valtravieso —Valladolid—, «Viñedos Olvidados»), inscrita D.O. Arlanza; web arlanza.org AJENA retirada; sin web propia de la unidad de Arlanza
buezo-vendimias-seleccionadas-y-vinos-de-guarda-mahamud · Mahamud — verificado, VO=sí (ecommerce, buezo.com/tienda). ~30 ha propias, vinos de guarda
enologica-wamba-pampliega · Pampliega — parcial, VO=no comprobado. Alfonso Sicilia (2005), 5 ha propias, vinos «Friki» y vermut; web propia con error de certificado y tienda vinofrikishop.com caída (DNS) esta sesión → parcial (candidata a promover a verificado+sí)
gotas-de-rocio-quintanilla-del-agua-y-tordueles · Quintanilla del Agua y Tordueles (antes «Quintanilla del Agua»; slug+imagen renombrados con merge) — verificado, VO=no comprobado. Web propia sin carrito (pedidos por tel/email); localidad conservada en la dirección
agrobauto-sdad-cooperativa-quintanilla-del-agua-y-tordueles · Quintanilla del Agua y Tordueles — parcial, VO=no comprobado. Cooperativa, marca Viña del Fraile, elabora en Bodega Ladrero (Torquemada, Palencia); web arlanza.org AJENA retirada; sin web propia
bodegas-araus-villahoz · Villahoz — verificado, VO=sí (ecommerce, tienda propia arausballesteros.es con portes gratis >50€). Web del CSV arausballesteros.com (rechazó conexión) → actualizada a la tienda .es
bodegas-arlese-villalmanzo · Villalmanzo — verificado, VO=sí (ecommerce, tienda propia bodegasarlese.es). Web ajena arlanza.org sustituida por su web propia (bodegasarlese.com redirige 301 a .es); marca Almanaque
copaboca-arlanza-villalmanzo · Villalmanzo — verificado, VO=sí (ecommerce, copaboca.com/tienda). Instalación real y distinta de copaboca-ribera-sotillo-de-la-ribera (lote 7), mismo grupo/dominio, no duplicado; web copaboca.es → copaboca.com (301)
melequin-villalmanzo · Villalmanzo — parcial, VO=no comprobado. Pequeña bodega «de garaje» D.O. Arlanza; web arlanza.org AJENA retirada; sin web propia
```

Notas del lote: **6 webs ajenas de arlanza.org retiradas** (eran la ficha del consejo regulador, no del productor). Solo Arlese tenía además web propia recuperable (bodegasarlese.es) y sube a verificada; las otras 5 quedan `parcial` (D.O. + directorios como única fuente, regla 5). **1 purga**: el propio Consejo Regulador D.O. Arlanza (not-producer). **Dos municipios resueltos**: Castrillo Solarana resultó ser E.L.M. de Lerma (no el «hueco» que se sospechaba) y Quintanilla del Agua → Quintanilla del Agua y Tordueles; ambos con merge de slug+imagen y localidad en la dirección. Confirmados sin fusión los pares del lote: Copaboca Villalmanzo (instalación real distinta de Sotillo) y Bodegas Lerma (familia Navarro Balbás, distinta de Nabal). VO: 6 nuevos `sí` ecommerce; Enológica Wamba queda como candidata a promover cuando su web/tienda vuelvan a cargar.

### Lote 11 · Bodega — Arlanza este, capital y atípicas (17→14) — ✅ 2026-07-16

```text
barbastro-burgos · PURGADA out-of-scope. Su web (grupohirviendo.com) es un grupo de hostelería de Burgos (tabernas perretxiCo, La Escotilla, Jose Mari, obrador MarmitaCo), no una bodega; sin evidencia de elaboración de vino propio (Pol. Ind. Villalonquéjar)
bodegas-arlanza-villalmanzo · Villalmanzo (antes «Burgos»; slug renombrado con merge) — parcial, VO=no comprobado. Una de las 5 bodegas D.O. Arlanza de Villalmanzo (visitas guiadas); sede fiscal en capital corregida a Villalmanzo (geo-warning 33,5 km resuelto). Su web bodegasarlanza.com no respondió esta sesión → techo parcial
bodegas-palacio-de-lerma-s-l-lerma · Lerma (antes «Burgos»; slug+imagen renombrados con merge, coords a la bodega) — verificado, VO=sí (ecommerce, tienda con carrito y pago PayPal/tarjeta/Bizum). Bodega D.O. Arlanza en Lerma (km 203); Burgos era la sede fiscal (Pz. San Bruno)
bodegas-sierra-villalmanzo · Villalmanzo (antes «Burgos»; slug renombrado con merge) — parcial, VO=no comprobado. Familia bodeguera desde los 60, km 203,7 Villalmanzo; sede fiscal en capital corregida (geo-warning 33,5 km resuelto). Su web dio HTTP 503 esta sesión → techo parcial
bodegas-vizcarra-mambrilla-de-castrejon · Mambrilla de Castrejón (antes «Burgos»; slug+imagen renombrados con merge) — verificado, VO=no comprobado. D.O. Ribera del Duero, Finca Chirri; sede fiscal en capital corregida (geo-warning 78,7 km resuelto). Web propia sin tienda
la-rulo-burgos · Burgos — parcial, VO=no comprobado. Correo del grupo de restauración El Pez de San Lorenzo (C/ Sombrerería 23, casco histórico): parece vinoteca/bar, no productor; web larulo.com con certificado caducado → parcial, candidata a purga si se confirma bar
vermuteria-victoria-burgos · PURGADA out-of-scope. Vermutería/bar histórico (1931, Plaza Rey San Fernando): sirve vermut de grifo casero pero es hostelería, no productor envasado; el vermut de marca «Victoria» se trata con el trío Victoria en el lote 22. Imagen huérfana eliminada
cisterciense-cardena-castrillo-del-val · Castrillo del Val — verificado, VO=no comprobado. Monasterio de San Pedro de Cardeña: productor real (vino Valdevegón en bodega románica, cerveza trapense Cardeña, licor Tizona del Cid, miel/mermeladas). Venta en tienda física + declausura.com (tercero)
agua-de-corconte-valle-de-valdebezana · Valle de Valdebezana (antes «Cilleruelo de Bezana», pedanía; slug renombrado con merge) — verificado, VO=no comprobado. RECATEGORIZADA de Bodega a «Agua mineral natural» (precedente Ursu): agua embotellada por Agua y Balneario de Corconte S.L., en retail (El Corte Inglés, Hipercor)
bodega-covarrubias-covarrubias · FUSIONADA → `bodegas-valdable-covarrubias` (valdable.com se titula «Bodega Covarrubias», correo info@valdable.com; Viña Valdable es su marca)
bodegas-valdable-covarrubias · Covarrubias — verificado, VO=no comprobado. Viñedo propio de tempranillo, marca Viña Valdable/Viña Leticia/Abadía de Covarrubias. Superviviente de la fusión con Bodega Covarrubias. Web sin tienda
ortegaz-covarrubias · Covarrubias — parcial, VO=no comprobado. Vinos Ortegaz (C/ Dimas Camarero 6), elaboración/crianza/venta D.O. Arlanza; web ajena arlanza.org corregida a su propia vinosortegaz.es (no cargó esta sesión → techo parcial). VO no→no comprobado
vinos-sinceros-covarrubias · Covarrubias — parcial (DEGRADADA de verificado), VO=no comprobado (antes sí cuarentena). Se autodefine como «distribuidora de vinos» (tienda en vinoval.es, ajena), pero el CSV le atribuye vino propio «Sincero»: identidad productor/distribuidor sin resolver; candidata a purga por alcance
hacienda-el-ternero-miranda-de-ebro · Miranda de Ebro (antes «Haro»; slug+imagen renombrados con merge) — verificado, VO=no comprobado. «Única bodega de Castilla y León con D.O.Ca. Rioja», en el enclave burgalés de El Ternero (término de Miranda de Ebro) rodeado de La Rioja; dirección postal de Haro conservada (regla 19). Tienda propia con error esta sesión → VO no comprobado
termino-de-miranda-miranda-de-ebro · Miranda de Ebro — verificado, VO=sí (ecommerce, terminodemiranda.es/vinos con carrito y precios). Recupera el chacolí; también vermut, zurracapote y espumoso
alma-silense-santo-domingo-de-silos · Santo Domingo de Silos — parcial, VO=no comprobado. Microbodega familiar (C. San Pelayo 17), D.O. Arlanza + cerveza Sad Hill; su web propia no cargó esta sesión → techo parcial. VO no→no comprobado
bodegas-septien-puentedura · Puentedura (antes «Santo Domingo de Silos»; slug renombrado con merge, coords al centroide) — verificado, VO=no comprobado. Proyecto de Andrés Septién (vino Boticario de Silos); empezó en un garaje de Silos y hoy está en Puentedura. Web ajena arlanza.org retirada; verificado vía Instagram oficial. Venta por marketplaces de terceros
```

### Lote 12 · Pan y pastelería — capital, Bureba y norte (17) — ✅ 2026-07-16

⚠ Pasada con tooling reducido (cuota de WebSearch agotada); ver residuales al pie.

```text
el-obrador-del-convento-belorado · Belorado — parcial, VO=no comprobado. Obrador conventual; su web dio 403/certificado caducado esta sesión → techo parcial, candidata a promover
almendras-sarralde-briviesca · Briviesca — verificado, VO=sí (ecommerce, sarralde.com/tienda). RECATEGORIZADA de «Pan y pastelería» a «Frutos secos»: elaborador de garrapiñadas/frutos secos desde 1845
el-horno-de-burgos-burgos · Burgos — parcial, VO=no comprobado. Comparte dominio elhorno.net y tel con `panaderias-camara-burgos` (mismo grupo, posible fusión a resolver); web dio 403/cert esta sesión → parcial
florbu-burgos · Burgos — verificado, VO=no comprobado. La Flor Burgalesa, galletas (77 años); sin tienda propia (marketplace ajeno «Burgos en Casa»)
juarrenos-alta-pasteleria-burgos · Burgos — verificado, VO=sí (ecommerce, juarreno.com/tienda-online). Alta pastelería artesanal, Plaza Mayor 25
panaderias-camara-burgos · Burgos — parcial, VO=no comprobado. Comparte dominio elhorno.net y tel con `el-horno-de-burgos-burgos` (mismo grupo, posible fusión); web 403/cert → parcial
pasteleria-merey-burgos · Burgos — parcial, VO=no comprobado. Su web era un Google business.site (discontinuado, 404) → retirada; parcial
jardin-de-la-abadesa-cardenadijo · Cardeñadijo — parcial, VO=no comprobado. SIN WEB; ficha de Maps, sin verificación online esta sesión (regla 16, no purgar)
el-horno-de-ceci-espinosa-de-los-monteros · Espinosa de los Monteros — parcial, VO=no comprobado. SIN WEB; ficha de Maps (regla 16)
pastelerias-la-dolce-vita-espinosa-de-los-monteros · Espinosa de los Monteros — verificado, VO=sí (ecommerce, /tienda con carrito y precios). Repostería tradicional
riarsi-confiteria-arroyo-espinosa-de-los-monteros · Espinosa de los Monteros — verificado, VO=no comprobado. Confitería Arroyo, «Los Secretos de Espinosa» (1940); sin tienda online
reposteria-artesana-divina-pastora-fresno-de-rio-tiron · Fresno de Río Tirón — verificado, VO=no comprobado. Repostería artesanal desde 1995; web sin tienda
horno-ortiz-maltranilla · Maltranilla — parcial, VO=no comprobado. SIN WEB; municipio «Maltranilla» no está en municipios.json y no se pudo resolver INE esta sesión → hueco anotado, sin tocar; parcial
dulcipay-ona · Oña — parcial, VO=no comprobado. SIN WEB; ficha de Maps (regla 16)
panaderia-pancorbopan-pancorbo · Pancorbo — parcial, VO=no comprobado. SIN WEB; ficha de Maps (regla 16)
dulce-tentacion-merindad-de-rio-ubierna · Merindad de Río Ubierna (antes «Sotopalacios»; slug renombrado con merge) — parcial, VO=no comprobado. SIN WEB; localidad conservada en la dirección; geo-warning de 20,7 km aceptado (merindad extensa)
panaderia-ordonez-tardajos · Tardajos — verificado, VO=no comprobado. Panadería Ordóñez, 120 años; web sin tienda
```

### Lote 13 · Pan y pastelería — Ribera, Arlanza y oeste (15→13) — ✅ 2026-07-16

```text
magdalenas-de-las-heras-aranda-de-duero · Aranda de Duero — verificado, VO=no comprobado. Elaboran magdalenas con receta artesanal desde 1955; web sin tienda
panaderia-panaranda-aranda-de-duero · Aranda de Duero — verificado, VO=no comprobado. «Pan Aranda», marca de Panadería La Castellana; obrador certificado de la M.G. Torta de Aranda; sin tienda online (VO re-derivado)
panaderia-serendipia-aranda-de-duero · Aranda de Duero — verificado (PROMOVIDA de parcial vía ficha real de Maps 4,6), VO=no comprobado. Panadería artesana/eco (Merce y Adolfo), C. Hospicio 1; SIN WEB
pasteleria-tudanca-aranda-de-duero · Aranda de Duero — verificado, VO=sí (ecommerce, grupotudanca.com/tienda). Obrador del Grupo Tudanca; obrador certificado de la M.G. Torta de Aranda; NO fusiona con vinedos-la-nava (lote 8, mismo grupo, dos unidades reales)
el-ventorro-castrillo-de-la-vega · PURGADA out-of-scope. Hotel-Restaurante + tienda de «productos típicos» (Aranda de Duero, no Castrillo de la Vega); revende (incl. vino de Linaje Garsea, lote 6), no elabora producto propio. Imagen huérfana eliminada
panaderia-antonio-de-las-heras-la-horra · La Horra — verificado, VO=no comprobado. Panadería Antonio de las Heras S.L., C/ Santa Ana 15; 8 empleados, «pan de pueblo»; SIN WEB (registro mercantil + Maps)
panaderia-artesana-labrador-lerma · Lerma — verificado, VO=no comprobado. Obrador artesano, C/ Mayor 18; Tierra de Sabor + FB oficial. Su web propia no resolvió (DNS) esta sesión (no retirada)
dulces-gloria-melgar-de-fernamental · Melgar de Fernamental — parcial, VO=no comprobado. Obrador artesanal (S.L. desde 1998); SIN WEB; solo directorio (Tierra de Sabor/prensa) sin fuente primaria → techo parcial
productos-perines-milagros · Milagros — parcial, VO=no comprobado. Confitería desde 1902; su web era un Google negocio.site (discontinuado, 404) → retirada; solo directorio (Burgos Alimenta/municipal) → techo parcial
panaderia-eduardo-antolin-peral-de-arlanza · Peral de Arlanza — verificado, VO=no comprobado. Obrador con horno de leña, Torta de Cabello de Ángel; ficha de Maps 4,9; SIN WEB
panaderia-pasteleria-espiga-real-quintanar-de-la-sierra · Quintanar de la Sierra — parcial, VO=no comprobado. SIN WEB; identidad no confirmada con claridad esta sesión → parcial (regla 16)
pasteleria-los-infantes-salas-de-los-infantes · Salas de los Infantes — verificado, VO=no comprobado. Pastelería familiar 75+ años (3ª gen.); anuncia tienda online pero no se pudo confirmar el carrito (DNS puntual) → VO no comprobado
mi-dulce-anjana-santa-maria-del-campo · Santa María del Campo — parcial, VO=no comprobado. Pastelería con obrador y degustación (directorio municipal); SIN WEB ni ficha de Maps confirmada → techo parcial
obrador-del-esgueva-tortoles-de-esgueva · Tórtoles de Esgueva — verificado, VO=no comprobado. Obrador artesano de pan/pastelería; ficha de Maps 4,2 + FB; SIN WEB
la-torta-de-aranda-valladolid · PURGADA not-producer. «Torta de Aranda» es una Marca de Garantía (producto), no un productor; sus obradores certificados (Tudanca y La Castellana/Panaranda en Aranda, M. Sanz en Boceguillas) ya están en el CSV; la fila era el producto con municipio genérico «Valladolid»
```

### Lote 14 · Lácteos y quesos — Merindades y Bureba (12→11) — ✅ 2026-07-16

```text
quesos-la-majada-de-barcina-ona · Oña (antes «Barcina de los Montes», pedanía; slug renombrado con merge) — verificado, VO=no comprobado. Granja ecológica desde 1987, ~700 churras (Montes Obarenes), queso ecológico + lechazo, venta directa; verificado vía FB oficial + turismocyl; sin tienda online (dominio «en construcción»)
productos-lacteos-ovejero-briviesca · Briviesca — verificado, VO=sí (ecommerce, tienda propia). Lácteos Ovejero desde 1932; cuarentena resuelta; web quesosovejero.es → lacteosovejero.es (301)
quesos-carreras-busto-de-bureba · Busto de Bureba — verificado, VO=no comprobado. Quesos de oveja artesanos desde 1954, Maps 4,8/95; web propia quesoscarreras.com AÑADIDA (era SIN WEB); tienda no confirmada
quesos-los-altos-los-altos · Los Altos (antes «Dobro», pedanía; slug renombrado con merge) — verificado, VO=no comprobado. Queso de oveja ahumado; FB oficial + Ruta del Queso de Burgos; SIN WEB
delicatessen-castro-valnera-espinosa-de-los-monteros · Espinosa de los Monteros — verificado, VO=no comprobado. Juan Cobo (2017), yogures/quesos/mantequilla de vaca, Premio Joven Empresario 2023; FB + Tierra de Sabor. Fábrica en Villasante (Merindad de Montija) pero se mantiene el municipio del CSV (dir. en Espinosa) para no forzar coords
mantequeria-las-nieves-espinosa-de-los-monteros · Espinosa de los Monteros — verificado, VO=sí (ecommerce, tienda propia con carrito y precios). Desde 1948; cuarentena resuelta
la-granja-burebana-grisalena · Grisaleña — verificado (de parcial), VO=no comprobado. Lácteos Burebanos, quesos de oveja de ganadería propia; web propia (caída DNS puntual, no retirada); en gourmet; sin carrito confirmado
ganaderia-ortiz-las-machorras-espinosa-de-los-monteros · Espinosa de los Monteros (municipio limpiado, quitado el sufijo postal; slug renombrado con merge) — parcial, VO=no comprobado. Vacuno lechero con lácteos artesanos, Las Machorras; SIN WEB, solo directorio institucional → techo parcial
queseria-artesanal-maite-medianas-de-mena · PURGADA closed. Quesería Artesanal Maite S.L. disuelta y extinguida el 2026-05-07 (registro mercantil)
quesos-santa-gadea-valle-de-manzanedo · Valle de Manzanedo (antes «Rioseco (Valle de Manzanedo)»; slug+imagen renombrados con merge) — verificado, VO=sí (ecommerce, santa-gadea.com con carrito y precios). Quesería en Rioseco; localidad conservada en la dirección
el-carluque-merindad-de-valdivielso · Merindad de Valdivielso (antes «Valdenoceda», localidad; slug+imagen renombrados con merge) — verificado, VO=no comprobado. Quesos de cabra/oveja de ganadería extensiva; anuncia tienda online sin confirmar el carrito
quesos-ugala-zaballa-valle-de-losa · Valle de Losa (antes «Zaballa», localidad de Zaballa de Losa; slug renombrado con merge) — verificado, VO=no comprobado. Cooperativa de cabras ecológicas (Sierra Salvada, P.N. Monte Santiago); web ajena artesanosmerindades.com → su web propia quesosugala.wordpress.com; sin carrito propio
```

### Lote 15 · Lácteos y quesos — centro, Odra y sur (14→13) — ✅ 2026-07-16

```text
lacteos-arlanzon-arlanzon · Arlanzón — verificado, VO=no comprobado. Lácteos Arlanzón (Eliseo Nieto, 1979), 1.500 churras; FB oficial + turismo CyL. Web propia con caída DNS puntual (no retirada)
nieto-y-herrero-artesanos-queseros-arlanzon-e-a-r-arlanzon · Arlanzón — verificado, VO=sí (ecommerce, nietoyherrero.es/nuestra-tienda con carrito y precios). Queseros artesanos desde 1979
lacteas-flor-de-burgos-burgos · Burgos — verificado, VO=no comprobado. Quesos frescos y lácteos; web sin tienda
lacteos-angulo-quesera-burgalesa-burgos · Burgos — verificado, VO=no comprobado. Quesera Burgalesa (familia Ruiz Angulo); web sin tienda
quesos-la-casona-de-los-pisones-burgos · Burgos — parcial, VO=no comprobado. Su web propia no resolvió (DNS) y WebSearch agotado → sin verificación posible (regla 16), a re-verificar
quesos-mostelares-castrojeriz · Castrojeriz (antes «Hinestrosa», pedanía; slug renombrado con merge) — parcial, VO=no comprobado. Quesería de la Ruta del Queso; NO es la misma que Ilújor (2 productores distintos); web propia con certificado caducado → parcial
quesos-la-cueva-de-vadorrey-la-cueva-de-roa · La Cueva de Roa — parcial, VO=no comprobado. Su web devuelve 404 en todas las rutas (dominio antes compartido con el matadero purgado en lote 3) → sin verificación posible (regla 16), a re-verificar
lechazo-y-quesos-del-vidal-oquillas · Oquillas — verificado, VO=no comprobado. Quesos Artesanos del Vidal, rebaño churro propio. SUPERVIVIENTE de la fusión con `comercial-altoesgueva-oquillas` (mismo dominio/municipio; «Comercial Altoesgueva» = brazo comercial). Sin tienda online
comercial-altoesgueva-oquillas · FUSIONADA → `lechazo-y-quesos-del-vidal-oquillas` (brazo comercializador, mismo dominio quesosartesanosvidal.com). Imagen huérfana eliminada
quesos-ilujor-isar · Isar (antes «Palacios de Benaver», pedanía; slug renombrado con merge) — verificado, VO=sí (ecommerce, tienda online propia). Quesos Ilújor (Lucía Orcajo), curados de oveja, quesería visitable; NO es la misma que Mostelares
quesos-sasamon-sasamon · Sasamón — verificado, VO=sí (ecommerce, quesodesasamon.com con carrito y precios). Queso de Sasamón desde 1982
quesos-sta-maria-la-real-tortoles-de-esgueva · Tórtoles de Esgueva — parcial, VO=no comprobado. Cría de ganado propio + queso; sin web propia (solo perfil en artesanoscyl) ni tienda → parcial. VO re-derivado
lacteos-valparaiso-villaespasa · Villaespasa — parcial, VO=no comprobado. Nueva marca de lácteos de cabra (~100 quesos + 200 yogures/semana); su web Google negocio.site (discontinuado, 404) retirada; solo prensa/directorio → parcial
quesos-rico-castrojeriz · Castrojeriz (antes «Villasilos», pedanía; slug+imagen renombrados con merge) — verificado, VO=sí (telefono: carrito vacío pero pedido anunciado por teléfono). Queso artesano con ovejas propias
```

### Lote 16 · Despensa artesanal — capital y sur (13→11) — ✅ 2026-07-16

```text
asohar-aranda-de-duero · PURGADA not-producer. ASOHAR = Asociación de Hosteleros de Aranda y la Ribera (defensa del sector), no un productor
la-casa-de-la-aceituna-y-encurtidos-aranda-de-duero · Aranda de Duero — parcial, VO=no comprobado. El registro la describe como comercio al por menor / venta y distribución de aceitunas y encurtidos (mercadillos): tienda/distribuidor; alcance (¿aliña producto propio?) sin resolver → parcial, candidata a purga
zalau-aranda-de-duero · Aranda de Duero — parcial, VO=no comprobado. Comercio al por mayor de setas y trufas (mayorista/distribuidor); alcance sin resolver → parcial
asociacion-slowfood-burgos-burgos · PURGADA not-producer. Convivium del movimiento Slow Food (educación/promoción), no elabora ni comercializa. Imagen huérfana eliminada
calnort-burgos · Burgos — verificado, VO=no comprobado. Calnort/Caldos del Norte, fabricante de caldos, sopas y postres (Pol. Villalonquéjar); web sin tienda
caracoles-arlanza-burgos · Burgos — parcial, VO=no comprobado. Web Google business.site muerta (404) retirada; no figura entre las 4 granjas de caracoles censadas de Burgos → identidad sin confirmar, parcial (regla 16)
caralmeat-burgos · Burgos — verificado, VO=no comprobado. Caralmeat S.L. (Villayuda), platos cocinados marca Umoh. RECAT Despensa → «Platos preparados»; web umoh.es→umoh.net
especias-y-herboristeria-campeador-burgos · Burgos — parcial, VO=no comprobado. Herboristería Campeador S.A. (marca CAMPEADOR), descrita como tienda minorista; web campeador.net aparcada (Datacom) retirada; alcance (¿envasa marca propia?) sin resolver → parcial
fabrica-de-bacalao-y-salazones-bilbasa-melgar-de-fernamental · Melgar de Fernamental (antes «Burgos», sede fiscal; slug renombrado con merge, coords y dirección a la fábrica) — parcial, VO=no comprobado. Bacalaos y Salazones de Castilla S.L. (Centro Especial de Empleo, Camino San Roque 3); SIN WEB, solo registro/Gourmets → sin fuente primaria propia, techo parcial
granja-las-villanas-campillo-de-aranda · Campillo de Aranda — verificado, VO=sí (ecommerce, granjalasvillanas.com con carrito y precios). Huevos camperos (Elena González de Benito). RECAT Despensa → «Huevos»
caracoles-burgaleses-castrillo-de-la-reina · Castrillo de la Reina — parcial, VO=no comprobado. Helix Demandacol (Caracoles Burgaleses) S.L. (desde 2015), cría/transformación de caracoles (4.000 m²), Gourmets 2019; SIN WEB, solo registro/Gourmets → sin fuente primaria propia, techo parcial
caracoles-melma-ciadoncha · Ciadoncha — verificado, VO=no comprobado. Caracoles Melma (Ana María Melchor), granja de caracoles; web propia caracolesmelma.com AÑADIDA (era SIN WEB); sin tienda online
olla-podrida-burgos-merindad-de-rio-ubierna · Merindad de Río Ubierna (antes «Sotopalacios», localidad; slug+imagen renombrados con merge) — verificado, VO=sí (ecommerce, laollapodridadeburgos.com con carrito y precios). Charcutería familiar 2ª gen (dirección en Sotopalacios + puesto en Mercado Norte de Burgos); geo-warning 20,5 km aceptado
```

### Lote 17 · Despensa artesanal — norte y oeste (11) — ✅ 2026-07-20

```text
karacoles-los-altos-valle-de-sedano (antes -cubillo-del-butron) · Valle de Sedano — verificado, VO=sí (ecommerce). Helicicultura real (Helix aspersa/Bover desde 2021), tienda propia con carrito. Municipio Cubillo del Butrón → Valle de Sedano (INE 09905; la pista «Los Altos» era errónea), slug+imagen renombrados con merge
conservas-espinosa-santa-olalla · Espinosa de los Monteros — parcial, VO=no comprobado. Conservas de pescado (anchoas del Cantábrico en AOVE, bonito, boquerones) en Santa Olalla; SIN WEB, solo directorio municipal/turismo → techo parcial. RECAT Despensa → «Pescado y conservas»
la-llueza-productos-artesanos-del-pato-espinosa-de-los-monteros · Espinosa de los Monteros — verificado, VO=sí (marketplace). Elaborados de pato (foie, paté, magret, jamón, confit), Artesano Casero de CyL; web sin carrito, venta vía marketplace Delicias de Burgos. RECAT Despensa → «Pato y derivados»
huevos-himma-melgar-de-fernamental · Melgar de Fernamental — verificado, VO=no comprobado. Granja Hima, huevos de gallina, planta real en Melgar (+ Asturias/Vizcaya); web sin carrito, venta retail/WhatsApp B2B. RECAT Despensa → «Huevos»
cafes-gometero-miranda-de-ebro · Miranda de Ebro — verificado, VO=no comprobado. Tostador de café artesano desde 1950 (Pol. Bayas); tienda online «en mantenimiento» esta sesión. RECAT Despensa → «Café»
ecopipa-y-bibesol-padilla-de-arriba · Padilla de Arriba — verificado, VO=sí (ecommerce). Aceite de girasol ecológico 1ª prensión en frío + harinas integrales de molino de piedra, elaboración propia; tienda propia con carrito
sal-de-poza-de-la-sal-poza-de-la-sal · Poza de la Sal — parcial, VO=sí (marketplace). Sal artesana de «Amigos de las Salinas de Poza» (recuperan el diapiro; elaboran y venden, regla 6 exención); saldepoza.com no cargó (cert caducado), sustentada por marketplace/Diputación/prensa → techo parcial. RECAT Despensa → «Sal»
biofactoria-naturae-et-salus-pradoluengo · Pradoluengo — verificado, VO=sí (ecommerce|marketplace). Aloe vera para alimentación; planta real en Pradoluengo confirmada (la sede del spin-off UVa en Valladolid es comercial, el aloe se cultiva en Andalucía). Tienda propia + marca NATURAE en Amazon.es
usanza-quinta-gama-valle-de-tobalina (antes -quintana-martin-galindez) · Valle de Tobalina — verificado, VO=no comprobado. Quinta gama (platos preparados) y conservas para hostelería, +25 años; B2B sin carrito de consumidor. Municipio Quintana Martín Galíndez → Valle de Tobalina (localidad cabecera), slug+imagen renombrados con merge. RECAT Despensa → «Platos preparados»
granja-ecologica-monterrebollo-frias (antes -quintanaseca) · Frías — parcial, VO=no comprobado. Granja ecológica real (230 gallinas + huerta + frutales), documentada por Sodebur/Burgos Alimenta/Alimenta Merindades; web=Facebook retirada (sigue en columna Facebook), sin fuente propia legible → techo parcial. Municipio Quintanaseca → Frías (pedanía), slug renombrado con merge. RECAT Despensa → «Huevos»
avicola-alvarez-villadiego · Villadiego — parcial, VO=no comprobado. Huevos Álvarez (+40 años), confirmado por Ayuntamiento de Villadiego/Diputación/Burgos Alimenta; web avicolaalvarez.com con cert autofirmado (conservada, regla 17), sin fuente propia legible → techo parcial. RECAT Despensa → «Huevos»
```

### Lote 18 · Miel — capital, Demanda y Arlanza (14) — ✅ 2026-07-20

```text
apicola-izquierdo-aranda-de-duero · Aranda de Duero — parcial, VO=sí (marketplace). Raimundo Izquierdo García, apicultor profesional (miel de tomillo Ribera del Duero); misma persona que la bodega del lote 8 (tel compartido, NO fusionar). SIN WEB propia → parcial; miel en marketplace vinosribera.com
apicast-barbadillo-del-mercado · Barbadillo del Mercado — parcial (heredado re-sostenido), VO=no comprobado. Apícola Castilla S.L., apicultor real (3 gen., extracción propia) PERO venta a granel en envases de 300 kg (B2B), web apicast.com con error TLS (regla 17, conservada) → sin fuente propia legible, techo parcial
hernando-hurtado-barbadillo-del-mercado · Barbadillo del Mercado — parcial, VO=no comprobado. Envasadora/mayorista de miel (≈5000 t/año, maquila a terceros), sin colmenas propias, perfil B2B sin venta a consumidor → alcance km0 dudoso, candidata a purga out-of-scope en pasada posterior
abeja-burgalesa-burgos · Burgos — verificado, VO=sí (ecommerce). Miel de producción propia (Alimentos Artesanales CyL), tienda propia con carrito/cuenta/pago tarjeta
ada-muller-honey-burgos · Burgos — verificado, VO=no comprobado. Ada Müller Forest Honey, apicultora eco (Sierra de la Demanda); miembro ASAPIBUR + Burgos Alimenta + IG oficial activo; web adamullerhoney.com no resuelve desde la sesión pero viva (regla 17, conservada). Nombre limpiado («Honey.»→«Honey»). Municipio Burgos (domicilio; colmenas en la Sierra)
lamemiel-burgos · Burgos — verificado, VO=sí (telefono|email). Apicultor desde 2019 con colmenas propias; «Haz tu pedido» por formulario/teléfono → cuarentena resuelta. Añadidos tel/email del sitio
miel-apilife-burgos · Burgos — **pendiente**, VO=no comprobado. Sin rastro digital verificable (dominio apilife.es despublicado/404, sin resultados de búsqueda ni en ASAPIBUR/Burgos Alimenta); no hay base para verificar ni para purgar (regla 16) → pendiente, a confirmar en campo o por registro sanitario
opizama-mieles-burgos · Burgos — verificado, VO=sí (telefono|whatsapp|email). Empresa familiar apícola (brezo, mil flores, tomillo); pedido por teléfono/WhatsApp/email; IG/FB oficiales
vamosaunando-briviesca (antes -burgos) · Briviesca — verificado, VO=sí (telefono|email). Apicultor artesano (Bego y Javi), 30 colmenas propias en La Bureba; pedido por teléfono/email. Municipio Burgos (domicilio) → Briviesca (colmenares reales, sede-vs-producción), slug+imagen renombrados con merge, coords al centroide, email corregido (typo)
mielsubinas-covarrubias · Covarrubias — parcial, VO=sí (marketplace). Ángel Subiñas, apicultor en Covarrubias (miel de bosque desde 1980, Artesanía Alimentaria CyL); SIN WEB → parcial; miel en marketplace bakailuak.com
10-miel-fontioso · Fontioso — verificado, VO=sí (telefono|email). Apicultor con colmenas propias en Fontioso (Ribera del Arlanza/Sierra de la Demanda); página «Contacto y Pedidos» → VO=no heredado re-derivado a sí
apicola-neri-hontoria-del-pinar · Hontoria del Pinar — parcial, VO=no comprobado. Miel Neri (Felipe Neri), apicultor eco, Marca Natural CyL; SIN WEB, solo directorio ayuntamiento/Marca Natural/prensa → parcial
miel-sabinares-del-arlanza-hortiguela · Hortigüela — verificado, VO=no comprobado. Apicultor con colmenas propias, marca Sabinares del Arlanza; web con «Dónde comprar» (puntos de venta) + Contacto sin carrito → cuarentena VO=sí resuelta a no comprobado
apicola-guerrero-huerta-de-rey (antes -huerta-del-rey) · Huerta de Rey — parcial, VO=no comprobado. Apiario en Huerta de Rey (tel coincide con CSV); presencia digital mínima, SIN WEB → parcial. Grafía municipio «Huerta del Rey»→«Huerta de Rey» (INE), slug renombrado con merge
```

### Lote 19 · Miel — Merindades y páramos (8) — ✅ 2026-07-20

```text
juan-sedano-perez-los-altos (antes -ahedo-del-butron) · Los Altos — parcial, VO=no comprobado. Apicultor real en Ahedo del Butrón (Burgos Alimenta, apiturismo «Fin de semana de la miel»); SIN WEB → parcial. Ahedo del Butrón = E.L.M. de Los Altos (INE), slug renombrado con merge
apimara-carcedo-de-bureba (antes -arconada) · Carcedo de Bureba — verificado, VO=sí (ecommerce). Familia de apicultores, miel de Burgos propia, tienda con carrito. **GEO-WARNING 85 km RESUELTO**: «Arconada» era la pedanía burgalesa (Bureba), no el homónimo de Palencia → Arconada es localidad de Carcedo de Bureba (INE), slug renombrado con merge, 2,8 km al centroide
api-espinosa-espinosa-de-los-monteros · Espinosa de los Monteros — verificado, VO=sí (ecommerce). Yolanda Martínez (VP de ASAPIBUR), 600-700 colmenas propias, miel de brezo; tienda propia (web da 403 al fetcher pero viva, regla 17)
miel-riuseco-espinosa-de-los-monteros · Espinosa de los Monteros — **pendiente**, VO=no comprobado. SIN WEB, sin rastro digital verificable (no aparece en búsquedas ni ASAPIBUR); zona mielera pero sin corroboración → ni verificar ni purgar (regla 16), a confirmar en campo/registro
miel-de-frias-frias · Frías — verificado (heredado parcial promovido), VO=no comprobado. Apicultor registrado 134BU0017 en Frías, produce miel + apiturismo («apicultor por un día»); web propia sin tienda (modelo de reserva) → VO=no heredado re-derivado a no comprobado. Añadido tel del sitio
hermanos-ramos-melgar-de-fernamental · Melgar de Fernamental — parcial, VO=no comprobado. Apicultor en Melgar (confirmado como negocio local); web mielhermanosramos.com no resuelve (DNS, regla 17, conservada), sin fuente propia legible → parcial
miel-lura-valle-de-losa (antes -quincoces-de-yuso) · Valle de Losa — verificado, VO=sí (ecommerce). Colmenas propias (brezo, girasol), tienda con carrito, IG oficial. Quincoces de Yuso = cabecera de Valle de Losa (INE), slug+imagen renombrados con merge
miel-las-loras-de-brezo-basconcillos-del-tozo (antes -san-mames-de-abar-basconcillos-del-tozo-burgos) · Basconcillos del Tozo — verificado, VO=sí (ecommerce). Hermanos Rodríguez Manjón, miel de brezo del norte de Burgos, tienda online → cuarentena resuelta. Municipio sucio limpiado a Basconcillos del Tozo (San Mamés de Abar es su localidad), slug+imagen renombrados con merge
```

### Lote 20 · Fruta y verdura — provincial (16→14) — ✅ 2026-07-20

```text
almacenes-sualdea-aranda-de-duero · Aranda de Duero — parcial, VO=no. Mayorista de patata (compra, selección, envasado y distribución), sin cultivo propio → alcance (regla 13). Web patatadeburgos.es retirada: es la asociación Patata de Burgos (tel 947040266), no su web
natura-suko-saldana-de-burgos (antes -burgos) · Saldaña de Burgos — verificado, VO=no comprobado. Productor de microvegetales y germinados (≈30 var.) con cultivo propio; web propia sin carrito. Municipio Burgos→Saldaña de Burgos (la web sitúa allí la actividad), slug+imagen renombrados con merge. RECAT desc/productos
patatas-arreba-burgos · Burgos — parcial, VO=no. Almacenes de Patatas Arreba S.L., almacenista/envasador/distribuidor mayorista (+35 años), sin cultivo propio → alcance (regla 13)
patatas-colina-burgos · Burgos — parcial, VO=no. Mayorista de patata y cebolla (almacén, envasado, distribución), sin cultivo → alcance (regla 13)
patatas-fernandez-miguelon-burgos · Burgos — parcial, VO=no. Almacén mayorista de patatas, cebollas y legumbres (+40 años, Villalonquéjar), sin cultivo → alcance (regla 13)
salvana-castrillo-del-val (antes -carcedo-de-burgos) · Castrillo del Val — parcial, VO=no comprobado. Salva y Ana, agroecología/biodinámica (legumbres —alubia roja de Ibeas, verdina—, cereales, girasol); premio Huerta Molinillo 2019. Prensa/reportaje como fuente única → techo parcial (regla 5). Municipio Carcedo→Castrillo del Val (dirección/reportaje), slug renombrado con merge. RECAT → «Legumbres y cereales»
collalb-s-cilleruelo-de-abajo · Cilleruelo de Abajo — **pendiente**, VO=no comprobado. SIN WEB; sin rastro digital verificable (los «Google Maps» del volcado son búsquedas por dirección, no fichas reales); en catálogo Burgos Alimenta según volcado pero sin ficha localizable → ni verificar ni purgar (regla 16)
alubia-losina-valle-de-losa (antes -lastras-de-teza) · Valle de Losa — verificado, VO=sí (ecommerce). Productora de alubia ecológica (blanca y pintas), tienda propia con compra online + IG oficial. Lastras de Teza = localidad de Valle de Losa, slug+imagen renombrados con merge. RECAT → «Legumbres»
m-g-lechuga-de-medina-medina-de-pomar · PURGADA not-producer. Marca de garantía gestionada por la Asociación Hortícola de las Merindades (marca colectiva promocional de la Lechuga de Medina), sin tienda ni producción propia (regla 6). Web queda como fuente; imagen huérfana eliminada. Tel 947040266 compartido con la otra M.G. y con la asociación Patata de Burgos
fundacion-conde-fernan-armentalez-melgar-de-fernamental · Melgar de Fernamental — parcial, VO=no comprobado. Fundación asistencial (discapacidad) con huerta ecológica «El Vivero de Melgar» en centro especial de empleo (producción real), pero comercialización no confirmada → alcance (regla 6)
s-coop-carmen-de-montorio-montorio · Montorio — verificado, VO=no. SOCOCAR, mayor productora de patata de siembra de España y también de consumo/industrial (300+ ha, contrato Pepsico); venta mayorista B2B → VO=no
manuel-torre-vivanco-rucandio · Rucandio — **pendiente**, VO=no comprobado. Frutícola del Valle de las Caderechas (Rucandio) según volcado/Burgos Alimenta, SIN WEB y sin ficha ni rastro verificable → ni verificar ni purgar (regla 16)
isabel-nunez-tudanca-rucandio-salas-de-bureba · Salas de Bureba — verificado, VO=sí (ecommerce). Rucandio Frutas de Montaña, fruticultura del Valle de las Caderechas (manzana reineta y cereza), 4 gen.; tienda propia con carrito. RECAT → «Fruta»
m-g-manzana-reineta-y-cereza-de-caderechas-salas-de-bureba · PURGADA not-producer. Marca de garantía de la Asociación de Productores del Valle de las Caderechas (marca colectiva promocional), sin tienda ni producción propia (regla 6); los productores reales tienen fila propia (p. ej. Rucandio Frutas de Montaña). Tel 947040266 compartido
soc-coop-canal-de-castilla-melgar-de-fernamental (antes -san-llorente-de-la-vega) · Melgar de Fernamental — parcial, VO=no comprobado. Cooperativa agraria cerealista del Canal de Castilla (B2B), no productora de fruta/verdura de consumo → alcance. Web coopcyl.es retirada (portal de URCACYL). San Llorente de la Vega = E.L.M. de Melgar de Fernamental (INE 09211), slug renombrado con merge. RECAT → «Legumbres y cereales»
cosidel-valle-de-losa · Valle de Losa — parcial (heredado verificado reauditado, regla 3), VO=no. Cooperativa San Isidro de Losa, patata de siembra (input agrícola B2B, no consumo directo) → alcance; sin tienda, B2B → VO=no
```

### Lote 21 · Cerveza artesana — provincial (16→13) — ✅ 2026-07-20

```text
cerveza-mica-aranda-de-duero · Aranda de Duero — verificado, VO=sí (ecommerce). Micro cervecería (Juan Cereijo), primera cervecera española 100% sin alcohol (Mejor Cerveza del Mundo 2017, World Beer Awards); tienda propia con carrito
cerveza-tesela-aranda-de-duero · Aranda de Duero — verificado (heredado re-sostenido), VO=sí (ecommerce). Fábrica artesana (hermanos Esteban Osorio), Avda. de Portugal; tienda online propia (confirmada por prensa; web con error TLS transitorio, regla 17) → cuarentena VO=sí resuelta con canal
ambrosia-bebidas-burgos · Burgos — parcial, VO=no comprobado. Ambrosía Bebidas (Rodrigo Heras), elaborador de cerveza de quinua «Atenea» e hidromiel «Elixir» (Villalonquéjar); resuelve «¿elaborador o distribuidor?»=elaborador. SIN WEB, solo Burgos Alimenta + prensa → parcial
beer-in-burgos-burgos · FUSIONADA → siesta-brewing-co-burgos. Web=dominio oficial siestabrewing.es; corresponde a la venta/distribución de cerveza de Siesta (origen del proyecto en 2014, antes de fabricar). Imagen huérfana eliminada
cerveceria-bajo-cero-burgos · Burgos — verificado (heredado re-sostenido), VO=no comprobado. Fábrica de cerveza artesana propia (+ servicio de cervecería); web propia sin tienda
cerveza-alis-burgos · Burgos — parcial, VO=no comprobado. Marca «Alis Isabel de Castilla» (proyecto Levadura Social), SIN WEB; mismo operador/tel que el bar La Vache Folle (purgado). Solo guía turística municipal → parcial
cerveza-berzaga-burgos · Burgos — parcial, VO=no comprobado. Cervecería artesana de Burgos capital (desde 2013, producción propia); SIN WEB, solo directorios/prensa → parcial
cerveza-dolina-burgos · Burgos — verificado, VO=sí (ecommerce). Fábrica propia (marca inspirada en Atapuerca), visitas guiadas; tienda propia con carrito y suscripciones
cerveza-la-vache-folle-burgos · PURGADA out-of-scope. Bar/gastropub de cerveza artesana y queso (sirve cervezas de terceros), no productor. Mismo operador/tel que la marca Cerveza Alis, conservada como fila propia
cerveza-una-rubia-burgos · Burgos — parcial, VO=no comprobado. Marca de cerveza artesana de Burgos; solo perfil de Facebook (contenido mínimo), sin web propia → parcial. Campo web (Facebook genérico) retirado; perfil conservado en la columna Facebook
cerveza-victoria-burgos · PURGADA out-of-scope. Cerveza de marca propia (golden ale) de la Vermutería Victoria (bar, purgado en lote 11), elaborada por encargo por Xabier Sevillano/Marbi → no es productor independiente; el elaborador real (Marbi) tiene fila propia
cerveza-virtus-burgos · Burgos — verificado, VO=sí (ecommerce). Fábrica propia (sin filtrar ni pasteurizar), Villalonquéjar; Tienda Online propia. También en marketplace (vinosribera)
siesta-brewing-co-burgos · Burgos — verificado, VO=sí (ecommerce). Fábrica + taproom (C/ Alfoz de Bricia 24, Villalonquéjar); tienda propia siestabrewing.es/tienda → VO de no comprobado a sí. Superviviente de la fusión con beer-in-burgos
cerveza-marbi-medina-de-pomar · Medina de Pomar — parcial, VO=sí (marketplace). Maiken Brewery S.L. (Xabier Sevillano, desde 2013), también elabora para terceros; web marbicerveza.com caducada (DNS) retirada (regla 17); vendida en tiendas de terceros (mundovinum, tipicodeburgos) → VO sí marketplace; sin fuente propia legible → parcial
cerveza-gadea-santa-gadea-del-cid · Santa Gadea del Cid — verificado, VO=sí (ecommerce). Fábrica artesana (Javier Gómez Pérez, RGSEAA 30015226/BU); tienda propia con carrito. GEO-WARNING 67 km resuelto: coords estaban en Burgos capital → corregidas al centroide de Santa Gadea del Cid
cerveza-momelius-villamiel-de-la-sierra · Villamiel de la Sierra — parcial, VO=no comprobado. Fábrica artesana (Tierra de Lara, desde 2013); añadida web propia cervezamomelius.es (no legible esta sesión, TLS, regla 17); solo directorio/prensa legibles → parcial
```

### Lote 22 · Licores, Sidra, Chocolate y Dulces (13→11) — ✅ 2026-07-20

```text
licores-casajus-burgos · Burgos — verificado, VO=sí (ecommerce). Elaborador de licores (Pol. Villalonquéjar); tienda propia con carrito
pacharan-menesa-burgos · Burgos — verificado, VO=sí (ecommerce). Elaborador de pacharán/aguardiente Menesa (ligado a Bodegas Cámara Palacios); tienda propia con carrito
pasteleria-silma-burgos · Burgos — verificado, VO=no comprobado. Obrador propio desde 1956 (C/ San Pablo 7 + obrador en Santa Dorotea); web actualizada silmaburgos.es (caída, DNS)→silmaburgos.com; sin carrito
r-m-teran-burgos · Burgos — verificado, VO=no comprobado. Obrador de rosquillas artesanas (marca «Rosquillas Artesanas»); web propia sin carrito
vermut-victoria-burgos · PURGADA out-of-scope. Vermut de la casa de la Vermutería Victoria (bar, purgado en l11); sin marca embotellada propia (tienda «próximamente»). Cierra el trío Victoria (bar l11, cerveza l21, vermut l22). Imagen huérfana eliminada
xocolart-burgos · Burgos — verificado (heredado re-sostenido), VO=no comprobado. Obrador de chocolate/pastelería (4,5★, 548+ reseñas); web actualizada de la tienda palbin (caída, 404)→xocolart.com, sin carrito → cuarentena VO=sí resuelta a no comprobado
el-chocolatero-castildelgado · Castildelgado — parcial (heredado re-sostenido), VO=no comprobado. Chocolate artesano familia Merino (+130 años, producción casi anecdótica), vendido en el propio Hostal El Chocolatero; blog caído (404) retirado
instituto-iesu-communio-aranda-de-duero (antes -la-aguilera) · Aranda de Duero — verificado, VO=sí (ecommerce). Repostería conventual (religiosas de La Aguilera); tienda online pequenareposteria.es. Web actualizada de areposteria.es (caída). La Aguilera = localidad de Aranda de Duero (INE), slug renombrado con merge
bizcochos-noel-lerma · Lerma — verificado, VO=no comprobado. Obrador propio de bizcochos de Lerma (Galletas Jesús Angulo Ortega S.L.); web propia sin carrito
brainapple-miranda-de-ebro · Miranda de Ebro — verificado, VO=sí (marketplace). Industria agroalimentaria (sidra natural «Burkan» + bebidas de manzana), activa/en expansión (Gourmets 2024); vendida en tiendas de terceros. ⚠ web brainapple.es sirvió spam de casino en un fetch (posible hackeo de la home; conservada, regla 17)
licores-lujo-nava-ordunte · PURGADA out-of-scope. Comercializador de licores de lujo personalizados (no elaborador), sede en Basauri (Vizcaya) según su web → distribuidor y fuera de provincia
destileria-reino-de-castilla-poza-de-la-sal · Poza de la Sal — verificado, VO=no comprobado. Destilería real (única autorizada de Burgos para fabricar alcohol): licores, aguardientes y ginebra con alambiques de cobre; web propia sin tienda
clarisas-convento-de-santa-clara-quintanilla-vivar (antes -vivar-del-cid) · Quintanilla Vivar — verificado, VO=sí (ecommerce). Repostería conventual (Clarisas de Vivar del Cid); tienda online propia con carrito. Vivar del Cid = E.L.M. de Quintanilla Vivar (INE 09301), slug renombrado con merge
```

### Lote 23 · Trufa, Legumbres, Huevos y resto (11→9) — ✅ 2026-07-20

```text
cereales-y-servicios-agricolas-de-burgos-s-l-burgos · Burgos — parcial, VO=no. SERABUR: servicios agrarios y suministros (asesoramiento, semillas, fertilizantes, fitosanitarios) + compraventa mayorista de cereal/legumbres, no productora de consumo → alcance (regla 15)
helados-jesson-burgos · Burgos — verificado (heredado re-sostenido), VO=no. Helados Jes&Son: elaborador de helados artesanos (marca con franquicia); producto perecedero de tienda física, sin ecommerce
sustrufas-burgos · Burgos — verificado, VO=sí (ecommerce|whatsapp). Truficultor de trufa negra (plantaciones propias); tienda con carrito + reservas + WhatsApp → cuarentena resuelta. Añadido tel 633624902
trufa-de-burgos-burgos · PURGADA not-producer. ATRUBUR = Asociación de Truficultura de la Provincia de Burgos (~86 socios/500+ ha), no vende trufa propia (regla 6). El truficultor real de Quintanalara es LARATRUF (comparten tel 677668610). Imagen huérfana eliminada
aire-de-arlanza-cilleruelo-de-arriba · Cilleruelo de Arriba — verificado, VO=sí (ecommerce). Cultivo/destilación propia de lavanda y aromáticas (aceites, jabones, miel) + agroturismo; tienda con carrito → cuarentena resuelta. Startup UBU. Añadido tel 609923363
m-g-alubia-roja-de-ibeas-ibeas-de-juarros · PURGADA not-producer. Marca de garantía colectiva de la alubia roja de Ibeas (dominio alubiaibeas.es en construcción), no un productor (regla 6/15)
legumbres-arlanza-lerma · Lerma — verificado, VO=sí (ecommerce). Cultiva, envasa y distribuye legumbres (garbanzo pedrosillano, lenteja pardina, tito/almorta, alubia arrocina) «directo del agricultor»; tienda online. Mismo polígono (km 201) que Bizcochos Noel, marcas distintas (no fusión)
laratruf-revilla-del-campo (antes -quintanalara) · Revilla del Campo — verificado, VO=sí (telefono|email). Empresa familiar truficultora (trufa negra ecológica, plantación/cosecha propias) en Quintanalara; venta directa por teléfono/email. Añadidos web laratruf.com y tel propio 645900030 (el CSV traía el de ATRUBUR). Quintanalara = E.L.M. de Revilla del Campo (INE, integrado 1981), slug renombrado con merge
huevos-camperos-santa-maria-del-campo · Santa María del Campo — **pendiente**, VO=no comprobado. Nombre genérico, SIN WEB, sin rastro digital que resuelva la identidad real del productor → ni verificar ni purgar (regla 16)
trufbox-tortoles-de-esgueva · Tórtoles de Esgueva — verificado, VO=sí (ecommerce). Empresa trufera ecológica pionera en envío a domicilio; 50 ha de trufa negra entre Tórtoles de Esgueva y Caleruega (Burgos) + finca en Soria (secundaria); tienda con carrito. Municipio Burgos confirmado (la sede de Soria de la web es finca secundaria)
ovapiscis-tubilla-del-agua · Tubilla del Agua — parcial (heredado re-sostenido), VO=no comprobado. Acuicultura de huevos embrionados de trucha arcoíris (≈300 M/año) y huevas tipo caviar; sede en Fonteo (Lugo), planta en Pozo Azul, Covanera (Tubilla del Agua). Producción B2B, sin ecommerce → alcance
```

### Lote 24 · Cierre transversal provincial — ✅ 2026-07-20

**⚑ 1ª PASADA CERRADA (2026-07-20).** Repaso transversal del CSV completo con
los criterios de cierre; resultado por criterio más abajo. Estado final:
**303 filas** · 222 verificado / 76 parcial / **5 pendiente** (documentados,
regla 16) · VO **140 sí (140 con canal, 0 sin canal)** / 9 no / 154 no
comprobado · 154 imágenes · evidencia 374 registros · `verify:data` en verde.

Cierre transversal aplicado en este lote (2 dedup pendientes resueltos):
- **Fusión Panaderías Cámara → El Horno de Burgos**: son la misma empresa
  (razón social «El Horno de Burgos SL», fundada por Ricardo Cámara en 1929,
  trasladada a Burgos en 1976; dominio elhorno.net, teléfono y dirección
  compartidos). Resuelve la fusión que el lote 12 había aplazado.
- **`horno-ortiz-maltranilla` → `horno-ortiz-valle-de-mena`**: «Maltranilla»
  es E.L.M. del municipio de Valle de Mena (INE); resuelve el hueco de INE que
  el lote 12 dejó anotado. Slug renombrado con merge, coords a 3,2 km del
  centroide (sin warning).

Resultado por criterio de cierre:
- **Dedup global**: todos los pares de tel/dominio compartido tienen decisión.
  Resueltos en este lote los 2 aplazados (Cámara/El Horno = fusión). El resto
  ya decididos en su lote: Mostelares/Ilújor (queserías distintas, l15),
  Copaboca Ribera+Arlanza (dos instalaciones reales), Izquierdo bodega+apícola
  (misma persona, dos negocios, l8/l18), Grupo Tudanca (bodega+pastelería),
  Bodegas Lerma/Nabal y Cillar de Silos/Dominio del Pidio (mismo grupo, filas
  legítimas distintas).
- **Municipios/geo**: 7 geo-warnings, **todos aceptados** (artefacto de usar un
  único centroide para municipios-merindad extensos: Merindad de Río Ubierna
  ×4, La Vid y Barrios, La Horra, y el residual histórico de Santa Gadea del
  Cid) — se documentan, no se fuerzan coordenadas. Pedanías corregidas al INE a
  lo largo de la pasada; último hueco (Maltranilla) resuelto aquí.
- **Cuarentena VO a cero**: **0 `sí` sin canal**; los `no` (9) están
  comprobados; la cuarentena heredada (16 `sí` / 23 `no`) quedó resuelta.
- **Evidencia**: 298 filas activas con `keep` + las 5 `pendiente` sin keep por
  diseño (regla 16); purgas y fusiones con `purge`/`merge`. **`coverage.json`:
  NO se añade `castilla-y-leon/burgos`** por los 5 pendientes residuales sin
  rastro digital (mismo criterio que Alicante; el marcador es advisory).
- **Imágenes**: 0 huérfanas (`check:images` en verde).
- **Pendientes residuales (5, regla 16)**: Miel Apilife (l18), Miel Riuseco
  (l19), Collalb@s (l20), Manuel Torre Vivanco (l20) y Huevos Camperos (l23) —
  SIN WEB y sin rastro digital verificable; ni verificar ni purgar, a confirmar
  en campo/registro en una 2ª pasada.

Criterios originales (referencia):

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
