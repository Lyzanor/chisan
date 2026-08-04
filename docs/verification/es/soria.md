# Verificación provincial de Soria

Ledger para planificar y reanudar la verificación profunda de
`data/csv/castilla-y-leon/soria.csv`. El CSV es la fuente de verdad y la
evidencia por decisión vive en `data/evidence/castilla-y-leon/soria.jsonl`.

El procedimiento general es `docs/es/VERIFICATION_TECHNIQUES.md`; este documento
fija el snapshot, los riesgos locales y el alcance de los lotes. Los contratos
aplicables son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

> **⚑ 1ª PASADA CERRADA el 2026-07-27; mantenimiento V-01 el 2026-07-29.**
> 80 filas, 69 `verificado`, 11 `parcial` y **0 `pendiente`**; Venta online:
> 36 `sí` —todas con canal—, 32 `no` y 12 `no comprobado`; 0 errores y 0
> avisos de data-quality; ninguna fila fuera del geo-check. Las 80 filas tienen
> `keep`, así que Soria **está** en `coverage.json`. No reabrir lotes cerrados
> sin motivo nuevo.

## Cómo reanudar

1. Leer `git status --short`, Estado, Reglas locales y solo el lote activo.
2. Confirmar que no hay cambios concurrentes en Soria.
3. Resolver `Venta online` desde cero: el valor heredado es honesto
   (`no comprobado` en 83 de 85), así que no hay nada que deshacer.
4. Rellenar `direccion` cuando el volcado dejó solo el municipio: son 22 filas
   y ninguna trae calle (Reglas locales 2).
5. Retirar el Instagram compartido de la marca de garantía en toda fila que se
   toque (Reglas locales 3).
6. Editar el CSV de forma estructurada, añadir una línea JSONL por decisión y
   actualizar aquí el resumen del lote.
7. Pasar `check:csv:changed`, `check:evidence:changed` y `git diff --check`.
   El cierre provincial pasa `verify:data`.

Los lotes agrupan de 7 a 12 filas por categoría o zona. No se añaden candidatos
nuevos hasta terminar la primera pasada de las filas existentes.

## Definición de completado

- No queda ninguna fila sin decisión editorial revisada en esta pasada.
- `pendiente` solo sobrevive con bloqueo real documentado; `parcial` es un
  resultado final válido cuando la evidencia tiene techo registral o secundario.
- Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- Todos los `Venta online=sí|no` están demostrados y los `sí` tienen canal.
- Cero filas fuera del geo-check y cero avisos de distancia.
- Soria se añade a `data/evidence/coverage.json` solo al cerrar la pasada.

## Estado

- Inicio: **2026-07-27**. Primera pasada profunda de las **85 filas**
  existentes; no añadir candidatos hasta el cierre.
- Snapshot inicial: **85 filas**; **81 `pendiente`**, 3 `verificado`, 1
  `parcial`. Venta online: **1 `sí` (con canal), 1 `no`, 83 `no comprobado`**.
- Evidencia inicial: **4 registros** para 85 filas, todos de la pasada
  DO-huecos de julio; **81 filas sin cubrir**.
- Imágenes: **0 de 85 filas con imagen**; queda fuera de esta pasada.
- Contacto: **41 filas sin `correo`**, 36 sin `telefono`, 24 sin `web`.
- Avisos de data-quality: **0**; errores: **0**. Filas fuera del geo-check: 11
  antes de SO-00, **0 después**.
- `descripcion` **no** es plantilla: 85 textos distintos. Es el campo sano del
  volcado, al revés que en Salamanca o Segovia.
- Las 61 filas con `web` dan **61 dominios distintos y ningún directorio**.
- El árbol tenía trabajo concurrente en Badajoz al iniciar; queda expresamente
  fuera de este expediente.

## Reglas y riesgos locales

1. **11 `municipio` eran localidades sin ayuntamiento propio**, no municipios.
   Resueltos en SO-00 y confirmados uno a uno; las coordenadas ya eran buenas
   (todas caen a 1,9-9,8 km del centroide del municipio correcto), así que el
   campo equivocado era `municipio`:

   | Localidad del volcado | Municipio real |
   | --- | --- |
   | Rejas de San Esteban, Atauta, Peñalba de San Esteban, Aldea de San Esteban, Inés, Villálvaro | San Esteban de Gormaz |
   | El Collado | Oncala |
   | Añavieja | Castilruiz |
   | Muro de Ágreda | Ólvega |
   | Ocenilla | Cidones |
   | Quintanilla de Nuño Pedro | Espeja de San Marcelino |

   El `slug` conserva el sufijo antiguo salvo que la fila cambie de identidad,
   porque el slug es la URL pública.

2. **`direccion` es el municipio repetido en 22 filas**, sin calle ni número:
   17 dicen literalmente «Soria, Soria» y otras cinco solo el pueblo. Son las
   mismas filas que llevan el centroide municipal por coordenadas (22 comparten
   `41.7633842,-2.4642041`, que es el centroide de Soria capital). Ni la
   dirección ni el punto del mapa son datos de la empresa: hay que buscarlos.

3. **Instagram compartido de la marca de garantía.** 11 filas apuntan al mismo
   `instagram.com/torreznodesoria/`, que es la cuenta institucional de la Marca
   de Garantía Torrezno de Soria, no la de ninguna de ellas. Retirar el enlace
   salvo que la fila tenga cuenta propia. Otras dos filas traen Instagram de
   terceros sin relación aparente (Galletas Tejedor → `artbees`, Cerveza
   Arévaka → `cerveceria_alquimia`): comprobar antes de darlos por buenos.

4. **El bloque «Torrezno de Soria» es un volcado de registro** (SO-04): nueve
   filas sin web, sin teléfono, sin dirección y con descripción de plantilla
   («X es una empresa soriana inscrita en la Marca de Garantía Torrezno de
   Soria»). Estar inscrito en la marca acredita existencia, no venta al público
   ni actividad actual: techo `parcial` salvo fuente propia. Además **«La
   Hoguera» (Soria) puede ser la misma casa que «Embutidos La Hoguera» (San
   Pedro Manrique)**, que sí tiene web y datos.

5. **`productos estrella` es la etiqueta de la categoría, no el producto**, en
   16 filas: 10 repiten «Torrezno de Soria, embutidos artesanos» y 6 «Vinos
   D.O. Ribera del Duero». Concretar al verificar.

6. **`horario` es el marcador estándar del repo** («Consultar web o contacto
   directo» en 81 filas; 4 vacías). No es un defecto y no se toca sin horario
   real.

7. **Categorías que el volcado colocó mal**, detectadas de entrada y a resolver
   en el lote correspondiente: Monte Pinos (agua mineral) y Pressumia (zumos)
   están en `Bodega`; Gepisa (vacuno) en `Charcutería`; Arotz Foods (trufa y
   conserva), Aperitivos de Añavieja (patatas fritas), Tortillas a Tu Gusto
   (platos preparados) y el Monasterio de Santa María de Huerta (mermeladas)
   en `Fruta y verdura`; y cuatro obradores de repostería con Mantequilla de
   Soria DOP en `Lácteos y quesos`.

8. **Dominios que no casan con el nombre de la fila.** Viñedos y Bodegas Gormaz
   apunta a `hispanobodegas.com`, Bodegas y Viñedos Aceña a `terraesteban.com`,
   Nufresco a `frutasurgell.com` (con teléfono 973, de Lleida) y Cañada Real de
   Soria a `coleso.com`. Suele ser la matriz o la marca comercial, no un cruce;
   hay que comprobarlo antes de retirarlo o de darlo por bueno.

9. **Soria capital concentra 29 de las 85 filas**, y 22 de ellas son las del
   punto 2. Es donde vive casi todo el trabajo de campo de esta pasada.

## Worklist

| Lote | Alcance | Filas | Estado |
| --- | --- | --- | --- |
| SO-00 | Higiene, snapshot y partición | — | ✅ |
| SO-01 | Bodegas de San Esteban de Gormaz: pedanías y viñas viejas | 9 | ✅ |
| SO-02 | Bodegas del casco de San Esteban y resto de la Ribera soriana | 10 | ✅ |
| SO-03 | Charcutería con datos propios | 7 | ✅ |
| SO-04 | Bloque Marca de Garantía Torrezno de Soria | 9 | ✅ |
| SO-05 | Lácteos y quesos | 10 | ✅ |
| SO-06 | Trufa y setas | 10 | ✅ |
| SO-07 | Pan y pastelería y dulces | 10 | ✅ |
| SO-08 | Miel y cerveza artesana | 8 | ✅ |
| SO-09 | Fruta y verdura, despensa y categorías sueltas (cierra la pasada) | 12 | ✅ |

## SO-00 — Higiene, snapshot y partición ✅

Alcance: crear el expediente, medir el volcado y dejar el CSV en condiciones de
verificarse por lotes. No emite decisiones editoriales de fila.

Hecho:

- Corregidos los **11 `municipio`** que eran localidades sin ayuntamiento
  propio (Reglas locales 1), comprobados uno a uno. Solo se tocó esa columna.
  **Ninguna fila queda ya fuera del geo-check** y no aparece ningún aviso de
  distancia.
- Auditoría tras el arreglo: **0 errores y 0 avisos** de data-quality. Soria
  llega al expediente pasando todas las puertas, así que los defectos reales
  —dirección sin calle, coordenadas de centroide, Instagram compartido— no los
  ve ningún validador y hay que buscarlos a mano.
- La posible fusión La Hoguera / Embutidos La Hoguera no se decide aquí: se
  resuelve en SO-04, cuando estén verificadas las dos filas.

## SO-01 — Bodegas de San Esteban de Gormaz: pedanías y viñas viejas ✅

9 filas, **9 conservadas**, 0 purgas. Resultado: 7 `verificado`, 2 `parcial`, 0
`pendiente`; Venta online 4 `sí` (3 `ecommerce`, 1 `marketplace`), 1 `no`
demostrado y 4 `no comprobado`.

- **La asociación Viñas Viejas de Soria resuelve medio lote de golpe.** Sus 14
  socios incluyen 11 de las 21 bodegas del CSV, con el nombre comercial y la
  razón social enfrentados: Rudeles es **Tierras El Guijarral**, Bodegas Gormaz
  es **DO5 Hispanobodegas** y Bodegas y Viñedos Aceña es **Terra Esteban**. Eso
  explica de una vez los tres dominios que no casaban con el nombre (Regla
  local 8) sin que ninguno sea un cruce.
- **Señorío de Aldea ya no existe con ese nombre: ahora es Bodegas Agoris.** Su
  dominio, `bodegasenoriodealdea.com`, está **dado de baja** —el whois responde
  «No match for domain», aunque Google lo siga indexando— y el sitio vivo es
  `bodegasagoris.com`, con tienda Shopify propia. Se conserva el slug: la razón
  social sigue siendo Bodegas y Viñedos Señorío de Aldea S.L. y las redes
  mantienen el handle `@senoriodealdea`.
- **Aranda-De Vries es el caso contrario y hay que saber distinguirlo.** Su
  dominio sí está registrado, pero sin servidores de nombres: no resuelve en
  8.8.8.8, 1.1.1.1 ni 9.9.9.9. La bodega está viva —Ellen de Vries elabora unas
  2.000 botellas al año de la marca Dualidad, sin sulfitos añadidos, y vende por
  club de socios— así que la fila se queda en `parcial`, se le rescata el
  teléfono y se le vacía la web. **Web muerta no es empresa muerta.**
- **La dirección del volcado de Rudeles era falsa.** Decía Calle Trasterrera 10;
  la bodega publica **Calle San Roque 78** y sus propias coordenadas
  (41,53351 / -3,25968), que se adoptan. También estaba mal el teléfono.
- **Dominio de Atauta se verifica sin poder leer su web.** `dominiodeatauta.com`
  devuelve 403 a toda petición nuestra —dominio vivo, MX de Google y citado por
  el consejo regulador—, así que se conserva la URL pero no cuenta como fuente.
  La actividad actual la demuestra Vinissimus, con cinco añadas a la venta con
  precio. Su tienda declarada, `terraselecta.com`, también bloquea: venta online
  sin comprobar.
- **La Quinta Vendimia no tiene bodega.** Es un proyecto nómada de 2016 del
  enólogo Chicho Ossa y 18 socios que elabora con viñas de Alcubilla del Marqués
  y Pedraja de San Esteban. Por eso su fila se queda **sin dirección de calle a
  propósito**: el registro de la D.O. da un domicilio social en la capital y las
  guías, una nave del P.I. La Tapiada; no hay unidad productiva que direccionar.
  Su web sí tiene tienda WooCommerce con precios y carrito.
- **Otro «venta online» de registro que no era tal**: la D.O. declara que
  Señorío de Villálvaro vende en línea y enlaza a su propia web, donde los
  cuatro vinos aparecen **sin precio y sin carrito**. `Venta online=no`, igual
  que en La Bodega de La Loba.
- **Taruguín vende, pero en tienda ajena**: sus botones de compra llevan a
  `demenciawine.com`, la tienda de la bodega berciana Demencia, socia del
  proyecto. Canal `marketplace`, no `ecommerce`.
- **Anotado para SO-02**: el teléfono que Dominio de Es publica (975 350 493)
  es el mismo que el volcado da a Bodegas Antídoto. Sourdais cofundó Antídoto,
  así que puede ser real, pero hay que comprobarlo.
- Recuperados 4 webs, 5 teléfonos y 5 correos que las filas no traían, y 7
  direcciones de calle donde había solo el pueblo o un dato equivocado.

## SO-02 — Bodegas del casco de San Esteban y resto de la Ribera soriana ✅

10 filas, **10 conservadas**, 0 purgas. Resultado: 9 `verificado`, 1 `parcial`,
0 `pendiente`; Venta online 2 `sí` (ambas `ecommerce`), 4 `no` demostrado y 4
`no comprobado`.

- **Resuelto el teléfono repetido que dejó SO-01, y no era contaminación.** El
  975 350 493 es de Bodegas Antídoto y también el que publica Dominio de Es
  porque el registro de Antídoto en la D.O. ampara la marca «Dominio de Es Viñas
  Viejas de Soria», y Bertrand Sourdais cofundó las dos casas. Son dos marcas
  con dirección y web propias: ni se fusionan ni se corrige nada.
- **Los tres dominios sospechosos de la Regla local 8 eran todos legítimos.**
  `terraesteban.com` es la marca de Bodegas y Viñedos Aceña, no una web ajena;
  `hispanobodegas.com` es el grupo que gestiona Viñedos y Bodegas Gormaz desde
  2004 y su única web. La lección de Salamanca —dominio que no casa con el
  nombre suele ser la matriz— se cumple entera en Soria.
- **Lunas de Castromoro es el tercer dominio muerto del CSV, y de un tipo
  nuevo**: `lunasdecastromoro.com` responde por http con la **página por defecto
  de Nginx Proxy Manager** («You've successfully started the Nginx Proxy
  Manager») y por https falla el SNI. Es un host levantado y sin configurar, no
  un dominio caducado ni un parking. Campo `web` vaciado; la fila se queda en
  `parcial` porque la bodega es socia fundadora de Viñas Viejas de Soria y su
  gerente es el secretario de la asociación.
- **Cuarto Lagar sube de `parcial` a `verificado` sin que cambiara nada nuestro:
  cambió su web.** El 10 de julio `cuartolagar.es` solo servía el `<title>`; hoy
  entrega contenido real con dirección, teléfono y correo, y monta un motor de
  tienda (API de carrito, estados de *checkout*, condiciones de compra). Ninguna
  ruta de producto responde, así que la venta sigue sin comprobar.
- **Dominio d'Echauz sí vendía, y en julio se dio por no comprobado**: tiene
  tienda WooCommerce propia con precio (39,76 € el Dominio d'Echauz 2023) y
  botón de carrito. Corregido a `sí`.
- **Dos códigos postales del volcado eran falsos** y en los dos casos el error
  saltaba a la vista: Valdeviñas figuraba en 42302 cuando su web publica 42320
  Langa de Duero, y Lunas de Castromoro llevaba **42001, que es Soria capital**,
  en una nave del P.I. La Tapiada de San Esteban de Gormaz (42330).
- **El correo de Bodegas Castillejo venía partido con un `span` oculto**
  anti-spam (`info@<span>nopubli</span>bodegascastillejo.com`). Rescatado junto
  al teléfono, que la fila tampoco traía.
- **Cuatro `Venta online=no` demostrados**, no lagunas: Antídoto, Castillejo,
  Valdeviñas y La Loba tienen web viva con catálogo y ninguna tiene carrito ni
  mecanismo de pedido.
- Recuperados 3 teléfonos y 2 correos; añadido el Facebook propio de La Loba.

## SO-03 — Charcutería con datos propios ✅

7 filas → **6**. Resultado: 6 `verificado`, 0 `parcial`, 0 `pendiente`; Venta
online 3 `sí` (todas `ecommerce`) y 3 `no` demostrado.

- **Purga: «Gepisa» es una fábrica de piensos.** General de Piensos de Soria
  S.A.U. vende piensos compuestos, mezclas, minerales y pienso para caballos y
  mascotas; su Facebook es `/generalpiensos`. Estaba en el CSV como
  `Charcutería` con «Carne de Vacuno» porque Tierra de Sabor la asocia a la
  marca de vacuno **Tercampo**, pero su papel ahí es el de **proveedor único del
  pienso**, no el de ganadero, matadero ni elaborador. `out-of-scope`.
- **Aparece la fuente que ordena media provincia**: el listado oficial de
  `torreznodesoria.com/empresas_asociadas` tiene **exactamente 11 empresas** y
  las 11 están en el CSV. Eso convierte SO-04 de un bloque opaco en una lista
  cerrada y **confirma que «La Hoguera» es una sola empresa, no dos**: la del
  listado es Embutidos La Hoguera de San Pedro Manrique, que sí tiene web.
- **El Instagram compartido retirado por primera vez.** Industrias Cárnicas
  Villar tiene cuenta propia (`@jamonesyembutidosvillar`), así que se sustituye;
  Giaquinta no la tiene y se queda sin Instagram. Quedan 9 filas con el enlace
  de la marca, todas en SO-04.
- **Tres tiendas propias y tres catálogos**, y la diferencia está en el precio:
  Malvasia vende en un dominio aparte (`comprarfoiedepato.com`, 11,25-15,40 €),
  Tradición Tierra de Ágreda y Embutidos de Pablo tienen WooCommerce propio; en
  cambio Villar, La Hoguera y Giaquinta publican fichas de producto **sin precio
  ni botón de compra** —Villar remata con un PDF descargable—, así que sus tres
  `Venta online=no` están demostrados.
- **Confirmado desde la empresa el arreglo de SO-00**: Embutidos de Pablo se
  presenta en El Collado, que es una de las cuatro localidades del municipio de
  Oncala.
- **Giaquinta se conserva por marca propia, no por ser carnicería**: tiene sala
  de despiece en el polígono Las Casas, dos carnicerías en la capital y elabora
  producto propio desde 2013.
- Corregidos dos correos que el volcado tenía mal (Tradición Tierra de Ágreda
  publica `clientes@`, Giaquinta `hnosgiaquinta@hotmail.com`) y reescritas las
  descripciones de plantilla de Tierra de Sabor.

## SO-04 — Bloque Marca de Garantía Torrezno de Soria ✅

9 filas → **8**. Resultado: 7 `verificado`, 1 `parcial`, 0 `pendiente`; Venta
online 5 `sí` (todas `ecommerce`) y 3 `no` demostrado.

Este lote era la parte más opaca del CSV —nueve filas sin dirección, sin
teléfono, sin correo, sin web y con el Instagram institucional de la marca— y se
resolvió entero con **una sola fuente**: el listado oficial de empresas
asociadas de `torreznodesoria.com`, que publica ficha con dirección, teléfono,
correo, web y redes de cada una.

- **Seis de las ocho filas no estaban en Soria capital.** El volcado había puesto
  «Soria» a todas porque la marca se llama Torrezno **de Soria**. En realidad:

  | Fila | Municipio real |
  | --- | --- |
  | Cárnicas Llorente | Almazán |
  | Cárnicas Sierra de Toranzo | Ólvega |
  | Embutidos Caba | Garray (Tardesillas) |
  | Embutidos Moreno-Sáez | Garray |
  | Tierras del Burgo | El Burgo de Osma |
  | Embutidos Almenar | Almenar de Soria |

  Las seis se renombran con `merge` desde el slug antiguo. Solo La Despensa y
  D'María están de verdad en la capital, las dos en el polígono Las Casas.

- **«La Hoguera» era una fila fantasma.** El listado de la marca tiene
  **exactamente once empresas** y La Hoguera aparece **una sola vez**, con la
  dirección de San Pedro Manrique. La fila `la-hoguera-soria` era el nombre corto
  sin ningún dato propio: `merge` en `embutidos-la-hoguera-san-pedro-manrique`.
- **Lo que sí son dos empresas distintas: Cárnicas Llorente y La Despensa.** La
  Despensa es la marca de *Productos* Cárnicos Llorente, en el polígono Las
  Casas, y Cárnicas Llorente está en Almazán; la marca de garantía las inscribe
  por separado y cada una tiene dirección, teléfono, correo y dominio propios.
  El apellido compartido invita a fusionarlas y no procede.
- **Ocho filas sin web pasan a siete con web y cinco con tienda propia.** El
  volcado no capturó nada: las ocho tienen sitio y cinco venden con precio y
  carrito (Llorente en el subdominio `tienda.carnicasllorente.es`, Sierra de
  Toranzo, Moreno-Sáez, La Despensa y —ya en SO-03— las de charcutería). Almenar
  y D'María tienen catálogo sin precios, y Tierras del Burgo tampoco vende.
- **Embutidos Caba es la excepción y la única `parcial`**: `embutidoscaba.com`
  responde 200 pero solo sirve un cartel de «en construcción» de 2,5 KB. No se
  publica la URL; del registro se rescatan dirección, teléfono y correo.
- **Un teléfono con prefijo de otra provincia que es correcto**: Sierra de
  Toranzo usa un 976 (Zaragoza) porque Ólvega está pegada a la raya aragonesa.
  No es un dato cruzado.
- **Coordenadas rehechas**: las ocho llevaban el centroide de Soria capital.
  Cinco se geocodificaron por Nominatim y validaron a 0,2-1,9 km del centroide
  del municipio correcto; Ólvega y la Avenida de la Rosa de Garray no resuelven y
  se quedan en el centroide de su municipio.
- **El Instagram institucional queda retirado de todas**: solo Sierra de Toranzo
  y Moreno-Sáez tienen cuenta propia, y son las que se conservan.

## SO-05 — Lácteos y quesos ✅

10 filas → **9**. Resultado: 6 `verificado`, 3 `parcial`, 0 `pendiente`; Venta
online 2 `sí` (1 `ecommerce`, 1 `marketplace`), 4 `no` demostrado y 3 `no
comprobado`.

- **Purga: «Saiona» describe una situación que terminó en 2018.** La cooperativa
  navarra **vendió su planta de Ólvega al Grupo TGT** tres años después de
  abrirla. Y la planta nunca fue un productor con marca al consumidor: 25.000
  t/año de queso en barra, lonchas y rallado, con la distribución en manos del
  Grupo Aldanondo. Ni la identidad ni el alcance se sostienen. `out-of-scope`.
- **Dos dominios más caídos, y los dos siguen indexados en Google con tienda y
  fichas de producto**: `queseriarocioalayeto.es` y
  `quesoszayasdequintanilla.com` no resuelven en 8.8.8.8, 1.1.1.1 ni 9.9.9.9.
  Con este lote van **cinco dominios muertos** en la provincia. La regla que sale
  de aquí es que **el índice del buscador no prueba que un sitio esté vivo**: hay
  que resolver el dominio.
- **La fila más fácil de la provincia estaba entre las peores**: Mantequerías
  York llegaba con «Soria, Soria» por dirección y sin teléfono, correo, web ni
  redes, y tiene sitio propio con tienda, precios y carrito en la plaza Mariano
  Granados.
- **Falsa alarma de tienda en Cañada Real de Soria**: los precios que aparecen en
  sus fichas de producto son los de **las bases legales de un sorteo**
  (camisetas, gorras, balones de la selección), no los de sus lácteos.
- **Quesoncala vende en Hermeneus, no en su web**: sus botones «COMPRAR» son
  anclas que llevan a su tienda en ese marketplace, donde sus quesos tienen ficha
  con precio y carrito. Canal `marketplace`.
- **Resuelta la categoría de los obradores de Mantequilla de Soria DOP** (Regla
  local 7). Se van a `Dulces y repostería` **Yemas Gil, Dulces Duero y Venus
  Selección**, que son obradores de repostería; se queda en `Lácteos y quesos`
  **Mantequerías York**, que elabora la mantequilla DOP en obrador propio y en
  tres formatos.
- **Venus Selección se queda en `parcial` por no tener web**, pero la prensa
  local la documenta bien: obrador y punto de venta en la parcela 11 de la calle
  D del polígono Las Casas, tienda en Sigüenza, y la Mantequilla de Soria DOP con
  trufa, frambuesa, tomillo o lavanda además del turrón de torrezno.
- **Un horario real por fin**: Rocío Alayeto publica el suyo y sustituye al
  marcador estándar del repo. Es la única fila de la provincia que lo tiene.
- Coordenadas rehechas por Nominatim en tres filas (plaza Mariano Granados,
  polígono Valdemiés y polígono Las Casas), todas a menos de 2 km del centroide.

## SO-06 — Trufa y setas ✅

10 filas → **9**. Resultado: 9 `verificado`, 0 `parcial`, 0 `pendiente`; Venta
online 8 `sí` (7 `ecommerce`, 1 `telefono|whatsapp|email`) y 1 `no` demostrado.

Es el lote más sano de la provincia: las diez filas tenían web propia y viva, y
ocho de ellas venden en línea. La trufa soriana es un sector joven y nativo
digital, y se nota.

- **Purga: «Descubre Pinares» no es un productor.** Es una empresa de turismo
  activo **de San Leonardo de Yagüe** —no de Cabrejas del Pinar, como decía la
  fila— que vende una experiencia de tres horas con charla, caza de trufa con
  perros y comida. La plantación de Cabrejas es del truficultor José María Calvo,
  que colabora con ellos. Ni cultiva ni vende trufa. `out-of-scope`.
- **Tres filas más que no estaban en Soria capital**, y las tres lo dicen en su
  propia web: Oro Negro de Soria está en **Golmayo** (urbanización Las
  Camaretas, según su aviso legal), Trufa Directa en **Serón de Nágima** y Truf
  Gourmet en **Barca** (Trufgourmet SLU, La Iglesia 7). Renombradas con `merge`.
  Con SO-04 van **nueve filas** rescatadas del falso «Soria».
- **Trufbox llevaba la dirección de otra fila.** El volcado le daba la nave del
  polígono Las Casas que también atribuye a Caelia Cerveza Artesana; Trufbox
  Innovation S.L. publica calle Venerable Carabantes 1, planta 1, 42003. Queda
  pendiente comprobar en SO-08 cuál de las dos era la buena para Caelia.
- **Un canal de venta que no es tienda**: Oro Negro de Soria no tiene carrito;
  su sección «Comprar trufa negra» pide peso o presupuesto y prepara el pedido
  por correo, WhatsApp o teléfono. Canal `telefono|whatsapp|email`.
- **Dos tiendas en subdominio propio**: Encitruf vende en `shop.encitruf.es` y
  —fuera de este lote— Cárnicas Llorente en `tienda.carnicasllorente.es`. Buscar
  el carrito solo en el dominio principal habría dado dos falsos `no`.
- **Sabor de Fronteras es el único `no` del lote**, y demostrado: fichas de
  producto sin precio ni carrito. Su web tampoco publica dirección; la agencia
  de promoción provincial la sitúa en el polígono de La Dehesa de Ágreda.
- Recuperadas 5 direcciones de calle donde había solo el municipio, y añadidos 4
  Facebook y 3 Instagram propios.

## SO-07 — Pan y pastelería y dulces ✅

10 filas, **10 conservadas**, 0 purgas. Resultado: 8 `verificado`, 2 `parcial`,
0 `pendiente`; Venta online 2 `sí` (ambas `ecommerce`) y 8 `no` demostrado.

- **La contaminación más tonta de la provincia**: el Instagram de Galletas
  Tejedor era **`@artbees`, la empresa que vende la plantilla de WordPress** con
  la que está hecha su web. El mismo enlace aparecía en el campo Facebook. La
  galletera no tiene redes propias. Es el segundo tipo de enlace ajeno del CSV,
  después del Instagram institucional de la marca de garantía.
- **Un cambio de dominio y un cambio de nombre.** Dulces Típicos El Beato ha
  pasado a `elbeato.com` —`dulcestipicos.es` redirige 301— y «Pastel Soria» se
  llama en realidad **Pastisoria**, con tienda Shopify en un tercer dominio,
  `lazospastisoria.com`.
- **Pastelería Mogui no estaba en Soria capital**: está en **Vinuesa**, calle de
  la Reina Sofía 32, y se llama Pastelería Mantequería Mogui. La fila llegaba con
  «Soria, Soria» por dirección y sin teléfono ni web, y tenía las tres cosas mal.
  Renombrada con `merge`.
- **«Aguilar Sampedrano, María Pilar» no es un negocio, es una persona**: es la
  titular en el registro de Tierra de Sabor del obrador que se llama **Pastelería
  Ramiro**, de 1930. Renombrada con `merge`. Es el mismo defecto que las filas
  del volcado de la marca de garantía: nombre de registro en lugar de rótulo.
- **Sexto dominio caído**: `confiteriagonzalez.com` no resuelve. Con él van
  Aranda-De Vries, Lunas de Castromoro, Señorío de Aldea, Rocío Alayeto y Quesos
  Zayas. **Seis de 81 filas**, todas indexadas todavía por Google.
- **`Venta online=no` es aquí la norma y está demostrado ocho veces**: la
  repostería soriana vende en mostrador. El caso más claro es Repostería de
  Pinares, cuyo enlace «nuestra tienda online» lleva a una tienda Mabisy dada de
  baja y cuya ficha en mercadosoriaonline dice literalmente «(Sin venta
  online)».
- **Una web solo por http**: `pastelsoria.com` sirve por http y su certificado de
  `www` falla. Se conserva la URL http, que es la que funciona.
- Direcciones corregidas contra fuente propia en El Abuelo José Luis (Calle
  Mayor 5, no 7). Recuperados 3 teléfonos, 2 correos y 3 webs.

## SO-08 — Miel y cerveza artesana ✅

8 filas → **7**. Resultado: 4 `verificado`, 3 `parcial`, 0 `pendiente`; Venta
online 2 `sí` (ambas `ecommerce`), 3 `no` demostrado y 2 `no comprobado`.

- **Purga: «La Mielería» no es soriana, es de Cocentaina (Alicante).** La lleva
  Nacho Company Agulló, cuarta generación desde 1926, y su domicilio y su tienda
  están en la avinguda de Xàtiva 76. Sus colmenas **sí trashuman** a Sierra
  Cebollera, Urbión y Cabrejas —de ahí salió la descripción del volcado—, pero
  la unidad productiva no está en la provincia. `other-province`, y traspasada a
  `docs/candidates/es/alicante.md`, donde no figuraba.
- **Falsa alarma de Instagram ajeno**: `@cerveceria_alquimia` sí es de Cerveza
  Arévaka. Su propio sitio rotula el bloque de redes como «Alquimia de Arévaka»
  y enlaza esa cuenta. De las dos sospechas de la Regla local 3, una era cierta
  (Galletas Tejedor) y esta no.
- **Séptimo dominio caído, y de un tipo nuevo**: `cervezacaelia.es` **resuelve**
  (195.201.69.223) pero el servidor **rechaza la conexión** en los puertos 80 y
  443. No es NXDOMAIN como los cinco primeros ni una portada por defecto como
  Lunas de Castromoro. Campo `web` vaciado.
- **Resuelto el cruce de direcciones de SO-06 en el sentido contrario al
  esperado**: la nave del polígono Las Casas, calle J nave 3, sí es de Caelia
  —lo confirma el registro cervecero—, y la fila equivocada era Trufbox.
- **El Reino de las Abejas publica otra dirección que la del volcado**: Bee-Aser
  S.L. da la calle San Benito 7, no la nave del polígono Valcorba. Se adopta la
  que publica la empresa.
- **Dos filas se quedan en `parcial` por no tener rastro propio**, no por duda:
  Miel El Camino del Cid, cuyo registro en Tierra de Sabor confirma todos sus
  datos y su distintivo de Artesanía Alimentaria, y Apipinares, documentado por
  la prensa local con nave en el polígono de Valdeavellano de Tera.
- Coordenadas rehechas por Nominatim en tres filas de la capital.

## SO-09 — Fruta y verdura, despensa y categorías sueltas ✅

12 filas, **12 conservadas**, 0 purgas. Resultado: 11 `verificado`, 1 `parcial`,
0 `pendiente`; Venta online 5 `sí` (todas `ecommerce`), 6 `no` demostrado y 1
`no comprobado`.

Este lote era el cajón de sastre del volcado y se dedica sobre todo a
**deshacer la categoría `Fruta y verdura`**, que el volcado usaba para todo lo
que no supo clasificar. De sus cinco filas no queda ninguna: Aperitivos de
Añavieja pasa a `Aperitivos`, Arotz Foods a `Trufa y setas`, Tortillas a Tu
Gusto a `Comida preparada` y el Monasterio de Santa María de Huerta a
`Conservas y mermeladas`; solo Nufresco sigue siendo fruta. Se resuelven además
las dos de `Bodega`: Monte Pinos a `Agua mineral natural` y Pressumia a
`Bebidas`. Con esto queda cerrada entera la Regla local 7.

- **Resuelto el último dominio sospechoso de la Regla local 8, y tampoco era un
  cruce**: Nufresco es la S.A.T. nº 1.596 **Nufri**, grupo del Pla d'Urgell, de
  ahí el correo de `frutasurgell.com` y el teléfono 973. La unidad productiva sí
  es soriana: la finca **La Rasa**, en El Burgo de Osma, es **la mayor plantación
  de manzanos de Europa**, con un techo de 40 millones de kilos. Los cuatro
  dominios que no casaban con el nombre eran los cuatro legítimos.
- **Otra fila que no estaba en Soria capital: Almendras del Moncayo**, que está
  en Ágreda (calle 7 de Junio 17) con el almendral de Belona en Valverde de
  Ágreda. Y su Instagram, `@almendrasdelmoncayo.lr`, sí era suyo: el sufijo son
  las iniciales de López Ruiz, la razón social. Renombrada con `merge`.
- **Falsa alarma de tienda en Martirelo**: su portada carga el widget de precios
  de WooCommerce, pero la página de productos no lleva precio ni carrito y
  `/tienda` y `/carrito` responden 404. Es el mismo tipo de falso positivo que
  el sorteo de Cañada Real: **el marcador de tienda no es la tienda**.
- **Dos vecinos que no son la misma empresa**: Aperitivos de Añavieja y
  Martirelo están a un kilómetro por la misma carretera de Añavieja, pero son
  empresas distintas y hasta de municipios distintos (Ólvega y Castilruiz).
- **El monasterio se conserva por elaboración propia**: los monjes hacen
  mermeladas de más de cuarenta sabores y dulce de membrillo; que su tienda
  venda además producto de otros monasterios cistercienses no cuenta como
  elaboración suya, pero no lo descalifica.
- **Monte Pinos ya no tiene web propia**: `montepinos.com` redirige a la ficha
  de marca de Vichy Catalan Corporation, su propietaria, y se adopta esa URL. La
  tienda del grupo devuelve 403, así que la venta queda sin comprobar. Es la
  única fila de la provincia que cierra en `no comprobado` por bloqueo.
- Direcciones corregidas contra fuente propia en Tortillas a Tu Gusto (calle
  Segovia 6, no avenida) y Pressumia (calle Alemania 2, no avenida de Ágreda
  17). Recuperados 5 teléfonos, 2 correos y 3 webs.

### Cierre (2026-07-27)

- **85 → 80 filas**: 4 purgas (Gepisa, Saiona, Descubre Pinares y La Mielería) y
  1 fusión de duplicado (La Hoguera). Otras 12 filas cambiaron de identidad o de
  municipio con `merge`, sin cambiar el recuento.
- **67 `verificado`, 13 `parcial`, 0 `pendiente`.**
- Venta online: **32 `sí` (32/32 con canal)**, 29 `no` demostrado, 19 `no
  comprobado`. Canales: 29 `ecommerce`, 2 `marketplace`, 1
  `telefono|whatsapp|email`.
- Evidencia: **97 registros** (80 `keep`, 4 `purge`, 13 `merge`) para 80 filas;
  **80 de 80 cubiertas**. Soria entra en `coverage.json`.
- Contrato: 0 errores. Data-quality: 0 avisos. Geo-check: 0 filas fuera y 0
  avisos de distancia. `check:evidence`: 0 avisos. `check:images`: 0/0.
- Contacto recuperado: **31 teléfonos** donde no había ninguno, 23 correos y 12
  webs; retiradas 7 webs de dominios caídos y 12 enlaces de redes ajenas.
- **Trece filas rescatadas del falso «Soria»**: el volcado ponía la capital por
  defecto. Ocho eran de la Marca de Garantía y cinco de otros lotes.
- Coordenadas: de las 22 filas que compartían el centroide de Soria capital no
  queda ninguna. **10 de 80** siguen en el centroide de su municipio, todas
  registradas en `data/reference/geo-provenance.json`, regenerado al cerrar.

### Mantenimiento V-01 · venta sin resolver

- Se resolvieron **7 de 19**: `sí` para **Dominio de Atauta**, **Lunas de
  Castromoro**, **Viñedos y Bodegas Gormaz** y **Monte Pinos**; `no` para
  **Bodega Los Imposibles**, **Bodegas y Viñedos Aceña** y **Nufresco** tras
  revisar sus canales actuales.
- **Lunas de Castromoro** recuperó su dominio, sube a `verificado` y actualiza
  dirección, coordenadas, teléfono, web y gama a sus instalaciones abiertas en
  Pedraja de San Esteban en 2024. Su selección remota admite solicitudes desde
  seis botellas (`email`). **Nufresco** también sube a `verificado`: las nuevas
  webs propias de Nufri/Nufresco acreditan la finca y el teléfono local de La
  Rasa; se corrigen web, dirección y contacto.
- Se desbloquearon tres tiendas: la de **Terra Selecta** para Dominio de Atauta,
  **Tu Vinoteca** para Gormaz y **La Tienda Vichy** para Monte Pinos, todas con
  producto disponible y compra operativa. No se forzaron como negativas los
  dominios caídos, los motores de tienda sin producto ni las fichas solo
  institucionales.

### Residuales para la 2ª pasada

- **Imágenes: 0 de 80 filas.** Es el hueco entero de la provincia.
- **Las 11 `parcial`**, casi todas por dominio caído o por no tener web:
  Aranda-De Vries, Los Imposibles, Embutidos Caba, Rocío Alayeto, Quesos Zayas,
  Venus Selección, Confitería González, Pastelería Ramiro, Caelia, Miel El
  Camino del Cid y Apipinares.
- **Seis dominios caídos a reintentar**: `bodegasenoriodealdea.com` (dado de
  baja, sustituido por bodegasagoris.com), `arandadevries.com` (registrado sin
  NS),
  `queseriarocioalayeto.es`, `quesoszayasdequintanilla.com`,
  `confiteriagonzalez.com` (NXDOMAIN) y `cervezacaelia.es` (resuelve, servidor
  rechaza conexión). Y `embutidoscaba.com`, en construcción.
- **Motores de tienda no operativos**: Dominio de Es carga WooCommerce sin
  productos comprables; Cuarto Lagar publica condiciones de compra y carrito,
  pero ninguna ruta de producto responde. Ambos siguen `no comprobado`.
- **Cuatro filas sin dirección de calle**, tres de ellas con motivo: La Quinta
  Vendimia y Vino Taruguín son proyectos sin bodega propia direccionable y Trufa
  Directa no la publica. La cuarta, Huevos Camperos de Soria, sí debería tener
  una.
- Los otros diez `no comprobado` carecen de canal primario vivo o arrastran
  dominio caído: Embutidos Caba, Pastelería Ramiro, Miel El Camino del Cid,
  Quesos Zayas, Rocío Alayeto, Confitería González, Venus Selección,
  Aranda-De Vries, Caelia y Apipinares.
