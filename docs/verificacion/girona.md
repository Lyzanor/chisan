# Verificación provincial de Girona

Ledger de la revisión profunda de `data/csv/catalunya/girona.csv`. El CSV es la
fuente de verdad; la procedencia estructurada (fuente, fecha, claims y decisión
por fila) vive en `data/evidence/catalunya/girona.jsonl`. Aquí quedan solo el
resumen de cada lote y las excepciones, residuales y decisiones difíciles que el
JSONL no captura.

## Estado

- Inicio: 2026-06-14.
- Estado editorial: **pasada profunda cerrada el 2026-06-15**; el CSV pasa a
  mantenimiento continuo y no se da por «cerrado» (catálogo vivo).
- Snapshot inicial: 243 filas; 0 `verificado`, 139 `parcial`, 104 `pendiente`.
- Snapshot tras los lotes 17–27: 241 filas; 239
  `verificado`, 2 `parcial`, 0 `pendiente`.
- Los lotes 17–27 reexaminaron las 132 fichas parciales que quedaban tras el
  lote 16 y la nueva alta concurrente de `celler-mas-patiras-forallac`.
- Resultado de la pasada: 125 promociones a `verificado`, 2 residuales
  `parcial` y 6 purgas.
- Cambios estructurales acumulados desde el inicio: 8 purgas, 1 fusión y 7
  altas concurrentes procedentes del cruce de las Rutas del Vi.

## Lote 1: conservas de L'Escala y arroz de Pals

Revisado 2026-06-14: 8 verificado.

### Excepciones y residuales

- `anxoves-callol-serrats-l-escala`: las páginas oficiales de contacto y
  tienda publican horarios distintos. Se deja `horario` vacío hasta resolver
  cuál corresponde a la atención pública actual.
- `arros-moli-de-pals-pals`: la tienda existe, pero sus seis referencias
  figuraban como no disponibles. Se retira el `sí` heredado y se deja
  `no comprobado` hasta confirmar que vuelve a aceptar pedidos.
- `arros-avi-trias-pals`: la web oficial funciona por HTTP y presenta un
  certificado TLS incorrecto por HTTPS. No se fuerza HTTPS ni se elimina el
  enlace. La página acepta encargos de más de 25 kg por correo.
- `arros-mas-pla-pals`: el contacto comercial está en Torroella de Montgrí,
  pero las fuentes del grupo sitúan el centro de producción y los cultivos en
  Pals. Se mantiene `municipio=Pals` y una ubicación prudente de los campos.
- `anxoves-el-xillu-l-escala` y `anxoves-de-l-escala-sa-l-escala`: las webs
  oficiales muestran producto, contacto y venta física, pero no un mecanismo
  vigente de pedido remoto.

## Lote 2: productores consolidados con datos heredados

Revisado 2026-06-14: 8 verificado.

### Excepciones y residuales

- `aigua-de-sant-aniol-sant-aniol-de-finestres`: el formulario de reparto
  solo solicita datos para confirmar cobertura, tarifa y pedido mínimo. No se
  considera todavía un canal de compra operativo.
- `la-fageda-santa-pau`: La Fageda indica que no vende directamente online,
  pero remite a supermercados con venta en línea; se registra como
  `marketplace`.
- `mooma-palau-sator`: la página de contacto publica el código postal `17257`,
  mientras que las condiciones de compra y documentación oficial reciente
  usan `17256`. Se conserva `17256`.
- Se retiraron horarios heredados de fábrica, visitas o restauración que no
  describían de forma fiable la atención comercial del productor.

## Lote 3: bodegas del Alt Empordà

Revisado 2026-06-14: 7 verificado, 1 parcial.

### Excepciones y residuales

- `celler-espelt-vilajuiga`: el dominio oficial redirige correctamente de
  `www` al dominio raíz, pero el servidor no respondió en varios intentos. La
  identidad y ubicación quedan respaldadas por el Consejo Regulador de la DO
  Empordà y el directorio público de industria; se confirma venta actual en
  marketplace, pero la fila queda `parcial` hasta revisar de nuevo la web.
- `celler-mas-llunes-garriguella`: la web usa WooCommerce y muestra carrito,
  pero los vinos no tienen precio ni formulario de compra. El checkout está
  destinado a reservas y experiencias, por lo que se conserva `Venta
  online=no` para producto.
- `celler-d-en-guilla-rabos`: la web publica una tienda física y su horario,
  sin mecanismo vigente de pedido remoto. El `sí` heredado se corrige a `no`.

## Lote 4: bodegas pendientes con presencia propia

Revisado 2026-06-15: 8 verificado.

### Excepciones y residuales

- `celler-arche-pages-capmany`: el dominio raíz muestra una página genérica y
  el certificado HTTPS no corresponde al host. Se conserva el subdominio
  catalán por HTTP, que publica la bodega, sus vinos, dirección, teléfono y
  correo; no se fuerza HTTPS.
- `celler-can-sais-vall-llobrega`: la web oficial funciona por HTTP y presenta
  un certificado propio incorrecto por HTTPS. La dirección oficial es Raval
  de Dalt 10, no el número 1 heredado.
- `finca-bell-lloc-palamos`: el proyecto se presenta actualmente como Celler
  Brugarol dentro de Finca Bell-Lloc. Se mantiene el `slug` público y se
  actualizan nombre, contacto y web de la bodega.
- `martin-faixo-cadaques`: la tienda y el catálogo siguen activos, pero todas
  las referencias de vino revisadas figuraban como no disponibles. Se corrige
  el `sí` heredado a `no comprobado`.

## Lote 5: cierre de bodegas pendientes

Revisado 2026-06-15: 4 verificado.

### Excepciones y residuales

- `mas-molla-calonge-i-sant-antoni`: la web indica que el vino se compra
  acudiendo a la masía y publica horarios estacionales. No hay un mecanismo de
  pedido remoto, por lo que se mantiene `Venta online=no`.
- `mas-oller-torrent`: la tienda ofrece nueve vinos con precio, selección de
  formato, carrito y productos marcados como disponibles.
- `terra-remota-sant-climent-sescebes`: la tienda separada de la web
  corporativa mantiene 27 productos comprables y en stock. Se añade el correo
  oficial de atención y la dirección completa de la finca.
- `clos-de-basella-siurana`: la tienda publica vinos con precio, carrito,
  formulario de envío y disponibilidad vigente. La web oficial confirma el
  relevo de la familia Parés i Grau en 2024 y la certificación ecológica desde
  2007.

## Lote 6: cerveceras pendientes

Revisado 2026-06-15: 11 verificado.

### Excepciones y residuales

- `bdegust-cervesa-compromesa-caldes-de-malavella`: la web enlaza una tienda
  Ecwid y ofrece expresamente pedidos por WhatsApp. Se registran ambos canales.
- `gro-brewers-girona`: la web oficial confirma fábrica, dirección, teléfono
  y visitas mensuales; el WhatsApp publicado es para reservar las jornadas,
  no para comprar producto.
- `dual-lab-brewery-girona`: la web confirma elaboración, consumo de cerveza
  propia y alquiler de equipo para socios, pero no publica pedido remoto.
- `la-calavera-sant-joan-de-les-abadesses`: la API de la tienda mostraba
  producto publicado en junio de 2026, con precio y disponibilidad.

## Lote 7: lácteos con presencia propia

Revisado 2026-06-15: 10 verificado.

### Excepciones y residuales

- `japet-dels-bous-borrassa`: el catálogo muestra productos a cero euros y
  sin disponibilidad, pero la web ofrece expresamente encargos por WhatsApp
  para recoger en los mercados de Banyoles, Olot y Figueres.
- `la-xiquella-la-vall-d-en-bas`: varias referencias estaban agotadas, pero la
  tienda aún mantenía producto comprable y con precio.
- `mas-la-coromina-la-vall-d-en-bas`: el carrito sirve para reservar visitas y
  vales; los lácteos se anuncian para compra en la tienda del mas, por lo que
  se corrige la venta de producto a `no`.
- `recuits-nuri-ullastret`: “Botiga” describe el establecimiento físico de
  Ullastret y no un proceso de pedido remoto.
- `mas-casas-cruilles-cruilles`: la tienda limita el envío refrigerado a
  comarcas gerundenses y algunas ciudades del área de Barcelona, pero el
  checkout de producto es vigente.

## Lote 8: lácteos con evidencia limitada

Revisado 2026-06-15: 8 verificado, 2 parcial.

### Excepciones y residuales

- `recuits-de-fonteta-forallac`: la web oficial anuncia una “botiga en
  línia”, pero el enlace y el servidor no permitieron verificar catálogo,
  precio ni checkout. Se conserva `no comprobado`.
- `mas-eusebi-forallac`: la actividad y la leche A2A2 están respaldadas por
  publicaciones recientes, el Ayuntamiento de Forallac y el Institut Català
  de les Dones, pero no se localizó web propia operativa.
- `le-bolut-vilademuls`: ACREFA y Gastroteca confirman obrador, contacto y
  gama, y las redes muestran continuidad, pero carece de web propia.
- `mas-marce-siurana-d-emporda`: la web publica un número específico para
  pedidos de producto por WhatsApp.
- `granja-mas-bes-vilobi-d-onyar`: la web actual confirma venta en la
  agrobotiga todos los días; no muestra envío de producto.

## Lote 9: charcutería, dulces y pan

Revisado 2026-06-15: 9 verificado, 2 parcial.

### Excepciones y residuales

- `can-calet-sant-joan-les-fonts`: el dominio oficial redirige a HTTPS pero
  responde con una página vacía. Identidad, dirección y gama quedan
  respaldadas por documentación sectorial, por lo que pasa solo a `parcial`.
- `mus-pastisseria-besalu`: el dominio heredado no ofreció una presencia
  propia verificable. Directorios locales y publicaciones de mayo de 2026
  confirman la actividad, pero no justifican `verificado`.
- `carnisseria-planaguma-olot`: la web mantiene carrito, cuenta de cliente,
  página de tienda y llamada expresa a preparar el pedido.
- `gluki-olot`: la compra se completa en línea, aunque la modalidad publicada
  es recogida en tienda con 24 horas de antelación.
- `angust-mieres`: además del checkout refrigerado, la web ofrece piezas por
  encargo mediante WhatsApp.

## Lote 10: huerta, pesca, fruta, miel, aceite y otros

Revisado 2026-06-15: 9 verificado, 2 purga.

### Excepciones y residuales

- `trull-d-en-francesc-boadella-i-les-escaules`: la web oficial confirma que
  es un restaurante abierto en 1990 dentro de un antiguo molino del siglo
  XVII. No publica producción ni venta de aceite; se elimina la fila.
- `can-gombau-girona`: la actividad reciente confirma una vermutería. Las
  fuentes describen su vermut de la casa como producto de una cooperativa de
  Capmany, no como elaboración propia; se elimina la fila.
- `trull-ylla-cabanes`: la web anuncia expresamente entrega de aceite a
  domicilio y publica teléfono y correo, pero no ofrece checkout. Se registra
  el canal directo `telefono`.
- `abellaires-empordanesos-garriguella`: la tienda oficial mantenía 45
  referencias disponibles entre miel, polen, derivados y experiencias.
- `can-moragues-riudarenes`: la tienda y la cuenta de cliente están
  integradas en la web del proyecto; la producción propia son las mermeladas
  y salsas ecológicas del obrador social.

## Lote 11: Garrotxa, Cerdanya y Ripollès norte

Revisado 2026-06-15: 3 verificado, 1 parcial.

### Excepciones y residuales

- `formatges-del-pujol-orra-les-llosses`: la web ofrece un lote con envío a
  toda Cataluña y encargo expreso por WhatsApp. Se registra únicamente ese
  canal, no `ecommerce`.
- `formatgeria-roura-soler-sant-pau-de-seguries`: mantiene referencias en
  stock, carrito, pago con tarjeta o PayPal, gastos de envío y un enlace de
  WhatsApp operativo.
- `moli-de-ger-productes-lactics-ger`: la web oficial dirige la venta online
  a Mercat Arrels, pero no se pudo confirmar una ficha vigente y comprable
  del productor. Se conserva como `no comprobado`.
- `lactics-ecologics-raphel-llado-maia-de-montcal`: registros ecológicos,
  Girona Excel·lent y fuentes gastronómicas respaldan la explotación y sus
  productos, pero el dominio y el correo heredados carecen de DNS. Se
  eliminan ambos y la fila queda `parcial`.

## Lote 12: Ripollès sur y Vall de Llémena

Revisado 2026-06-15: 2 verificado, 1 parcial.

### Excepciones y residuales

- `formatgeria-palou-campdevanol`: la Fira de Sant Ermengol 2025 y las
  propuestas oficiales de turismo confirman actividad, rebaño propio,
  elaboración, contacto y municipio. Se elimina del campo `web` la ficha
  externa de Producte del Ripollès y se conservan sus redes.
- `l-arbreda-s-l-sant-marti-de-llemena`: se actualiza la marca editorial a
  `Mas L'Arbreda`, la dirección del obrador y la gama. ACREFA y Lactium 2026
  prueban actividad actual; se retira el directorio de World Cheese Awards
  como web del productor.
- `lactics-de-la-vall-de-ribes-ribes-de-freser`: Gastroteca mantiene la ficha
  de Mas Ca l'Esteve, pero el dominio y el correo heredados no resuelven y no
  se localizó una presencia propia reciente. Se cierra como `parcial`.

## Lote 13: cooperativas y granjas de leche

Revisado 2026-06-15: 4 verificado.

### Excepciones y residuales

- `lletera-campllong-campllong`: la web confirma que la cooperativa produce y
  comercializa leche procedente de granjas familiares asociadas. No dispone
  de venta directa en línea; remite a comercios físicos.
- `sat-sant-mer-vilademuls` y `can-costa-de-manol-llado`: ATO mantiene
  perfiles individualizados con historia, continuidad familiar, ubicación y
  producción lechera.
- `can-violant-cassa-de-la-selva`: la página de granjas de Lletera Campllong
  identifica la explotación como `Riera i Riera`, sitúa Can Violant en el
  Veïnat de Mont-roig y confirma quinta generación y producción de leche.

## Lote 14: Selva, Gironès y Alt Empordà

Revisado 2026-06-15: 3 verificado, 1 parcial.

### Excepciones y residuales

- `mas-borni-llagostera`: la tienda ofrece productos disponibles, cesta,
  finalización de compra, pago y envío a domicilio. Se incorpora
  `Canal de venta=ecommerce`.
- `circus-granja-familiar-sant-hilari-sacalm`: el Ayuntamiento de Sant Hilari
  publicó en mayo de 2026 una actividad gastronómica con producto de Granja
  Circus y sus redes tuvieron actividad a finales de 2025. El dominio
  heredado no tiene DNS y se elimina.
- `granja-el-trevol-vilobi-d-onyar`: ATO confirma continuidad de la segunda
  generación, dirección y producción lechera.
- `lactics-tramuntana-cabanelles`: una publicación territorial 2024–2025 y
  su perfil social respaldan producción y municipio, pero no se localizó web
  propia ni evidencia suficiente para validar todos los datos heredados. Se
  cierra como `parcial`.

## Lote 15: obradores y heladerías

Revisado 2026-06-15: 4 verificado.

### Excepciones y residuales

- `obrador-rocambolesc-girona`: la web actual confirma el obrador de Girona,
  elaboración artesanal, leche ecológica, helados, sorbetes y polos; la
  tienda mantiene carrito y productos propios comprables. La ficha queda
  vinculada al obrador de Riera Garrap, no a la gelatería de Santa Clara.
- `gelats-galiana-el-port-de-la-selva`: la campaña 2026 confirma actividad y
  elaboración diaria en el obrador. No se localizó un sistema de pedido
  remoto.
- `la-lletera-girona`: la web confirma elaboración in situ y un único local
  activo en el Barri Vell, sin venta remota demostrada.
- `gelats-enxaneta-palafrugell`: la web y la actividad 2025–2026 confirman
  obrador y gelaterías, pero la tienda online figura cerrada por
  mantenimiento. Se cambia de `no` a `no comprobado`.

## Pasada de consistencia tras el lote 15

Realizada el 2026-06-15 sobre identidad, contactos, ubicación y dependencias
entre campos.

- Se fusiona `vins-de-taller-siurana-d-emporda` en
  `clos-de-basella-siurana`: comparten sociedad, teléfono y proyecto
  vitivinícola. Se conserva el slug ya verificado de Clos de Basella, se
  incorpora la marca Vins de Taller a su descripción y se elimina la imagen
  duplicada.
- `obrador-rocambolesc-girona` pasa de la dirección comercial de Santa Clara
  a la dirección oficial del obrador en Riera Garrap, 38. También se
  actualizan teléfono, horario, mapa y coordenadas.
- La consulta de Google Maps de `l-arbreda-s-l-sant-marti-de-llemena` se
  alinea con el nombre y la dirección actuales.
- Las filas históricas con `Venta online=sí` pero sin `Canal de venta`
  permanecen como deuda editorial warning-only fuera de estos lotes. No se
  infieren canales sin evidencia.

## Lote 16: bodegas históricas del Alt Empordà

Revisado 2026-06-15: 10 verificado.

### Excepciones y residuales

- `masia-serra-cantallops`: la bodega comunicó su salida de la DO Empordà.
  Se retira la adscripción DO heredada, pero se mantiene la identidad,
  actividad y venta en la tienda propia.
- `celler-maria-pages-capmany`: la web publica vinos de la añada 2025,
  dirección y contacto actuales. El Consejo Regulador indica expresamente
  pedidos por correo o teléfono.
- `mas-estela-la-selva-de-mar`: la web oficial ofrece WhatsApp para pedir
  información, no para encargar producto. Se actualizan teléfono y horario,
  se retira el correo heredado no publicado y se mantiene `Venta online=no`.
- `celler-pujol-cargol-masarac`: la web propia confirma identidad y dirección;
  la actividad reciente queda respaldada por la DO y vinos de añada 2025
  comprables en un marketplace.
- `celler-cooperatiu-d-espolla-espolla`: la web oficial remite a
  Agrobotigues, donde hay vinos y aceite disponibles con carrito y checkout.
- `av-bodeguers-vilamaniscle`: se sustituyen el teléfono y la dirección
  heredados por los publicados actualmente en la web oficial.

## Lote 17: bodegas restantes

Revisado 2026-06-15: 7 verificado, 3 parcial. Incorpora la alta concurrente de
Mas Patiràs sin alterar la decisión ya documentada por el otro agente.

Los tres residuales (`llivins-llivia`, `pere-guardiola-capmany`,
`celler-mas-patiras-forallac`) carecen de una presencia propia actual
suficiente o mantienen una ficha demasiado indirecta. No se infiere actividad
ni venta a partir del registro sectorial.

## Lote 18: cervezas, licores y destilados

Revisado 2026-06-15: 13 verificado, 2 parcial.

Quevall queda correctamente ubicado en Llançà: el slug queda alineado con el
municipio del CSV. Popaire y La Brava permanecen parciales por falta de una presencia
propia actual que permita cerrar actividad y canal.

## Lote 19: pan, pastelería y dulces

Revisado 2026-06-15: 16 verificado, 3 parcial.

Cal Flequer se corrige desde Girona al obrador central publicado en Cornellà
del Terri, con dirección, mapa y coordenadas nuevas. La web de Padrés ya no
resuelve y se retira del CSV; la actividad no se da por cerrada sin otra
fuente concluyente.

## Lotes 20–21: charcutería, carne y pato

Revisado 2026-06-15: 18 verificado, 5 parcial.

Se retira la web inactiva de Embotits Eugeni. Jaume Abras confirma venta a
profesionales y recogida física para particulares, no venta online.

## Lote 22: lácteos y quesos

Revisado 2026-06-15: 10 verificado, 6 parcial, 2 purga.

Mar de Formatges figura como comercio, no como productor. La Formatgeria de
Llívia es actualmente un restaurante instalado en una antigua fábrica de
quesos; se elimina también su imagen huérfana.

## Lote 23: aceites, miel y frutos secos

Revisado 2026-06-15: 18 verificado, 2 parcial.

Can Solivera conserva señales públicas contradictorias sobre continuidad.
Gozos Mundanos no aporta evidencia actual suficiente de producción oleícola.
Las tiendas sin referencias comprables se dejan en `no comprobado`.

## Lote 24: fruta, huerta, mermeladas, conservas y salsas

Revisado 2026-06-15: 10 verificado, 1 parcial.

La tienda anunciada por Quim Matas aún no acepta pedidos. Red Passion Berries
mantiene actividad social reciente, pero su dominio no respondió y no se
pudo demostrar el canal de venta heredado; permanece parcial.

## Lote 25: elaborados, pescado, caracoles, bebidas y aromáticas

Revisado 2026-06-15: 15 verificado, 1 parcial, 1 purga.

La ficha Cargol Bover no tenía nombre empresarial, contacto, web, red social
ni fuente pública específica que acreditara la granja descrita. Se elimina
en lugar de conservar una entidad plausible pero no demostrada.

## Lote 26: cierre de residuales con actividad reciente

Revisado 2026-06-15: 14 verificado. Incluye la segunda revisión de la alta
concurrente de Mas Patiràs.

### Excepciones y residuales

- `red-passion-berries-viladrau`: mantiene actividad confirmada en 2026 y
  elaboración propia, pero el dominio no respondió y no se conserva el canal
  de tienda heredado sin poder probar el pedido.
- `celler-mas-patiras-forallac`: la DO Empordà, su perfil propio y actividades
  de 2025–2026 confirman bodega y vinos; no se ha demostrado venta remota.
- `gozos-mundanos-roses`: el negocio actual es también un bistró, pero su
  presencia propia se identifica como elaborador de vinos y AOVE y sigue
  mostrando su aceite Argudell. Se conserva únicamente por esa actividad
  productora.
- Permanecen `parcial` `cervesa-popaire-blanes`,
  `can-calet-sant-joan-les-fonts`,
  `lactics-ecologics-raphel-llado-maia-de-montcal`,
  `lactics-de-la-vall-de-ribes-ribes-de-freser`,
  `lactics-tramuntana-cabanelles`, `cervesa-la-brava-forallac`,
  `can-solivera-forallac`, `gelats-janeret-banyoles` y `llivins-llivia`.
  Sus límites son presencia propia ausente o antigua, dominios caídos,
  continuidad contradictoria o falta de evidencia directa de elaboración.

## Lote 27: resolución individual de los nueve residuales

Revisado 2026-06-15: 4 verificado, 2 parcial, 3 purga.

### Decisiones

- `cervesa-popaire-blanes`: se elimina. La sociedad figura en la resolución
  de revocación de NIF de 2023, el dominio está aparcado y no aparece una
  actividad productora actual que contradiga el cierre.
- `can-calet-sant-joan-les-fonts`: se elimina. En enero de 2026 Embotits Calet
  cambió su denominación a Establiments Calet, trasladó el domicilio y cambió
  el objeto social a alojamientos turísticos.
- `cervesa-la-brava-forallac`: se elimina. El BORME documenta concurso,
  conclusión por insuficiencia de masa activa y extinción de La Brava Beer
  SL; no se localiza una productora sucesora vigente.
- `lactics-ecologics-raphel-llado-maia-de-montcal`: pasa a `verificado`. La
  ficha pública vigente confirma explotación ecológica, transformación
  láctea y venta directa en Can Garriga.
- `lactics-de-la-vall-de-ribes-ribes-de-freser`: pasa a `verificado` y adopta
  el nombre actual `Ca l'Esteve`. Se corrige la descripción: desde 2023 el
  obrador continúa elaborando lácteos, pero ya compra la leche a otra granja
  del Ripollès.
- `gelats-janeret-banyoles`: pasa a `verificado` como `Golafreria Janeret`.
  Se actualizan dirección, teléfono y redes a la Plaça Major; el perfil propio
  mantiene actividad en junio de 2026.
- `llivins-llivia`: pasa a `verificado`. El perfil propio mantiene actividad
  en junio de 2026 y publica el teléfono de enoturismo; la venta remota sigue
  como `no comprobado`.
- `lactics-tramuntana-cabanelles`: permanece `parcial`. Gastroteca y una guía
  territorial de 2024 sostienen la existencia y la actividad láctea, pero la
  última actividad propia localizada es de 2020.
- `can-solivera-forallac`: permanece `parcial`. El portal turístico local aún
  publica visitas y catas, pero la web propia es una página de alojamiento,
  el perfil social ya no existe y las fuentes empresariales son
  contradictorias sobre la continuidad.

## Cierre de la pasada provincial

Cierra la pasada profunda, no el CSV: la provincia entra en mantenimiento
continuo y sigue siendo un catálogo vivo cuyas afirmaciones dinámicas y
evidencia se revisan en el futuro. Pasada final de consistencia realizada el
2026-06-15.

- Procedencia estructurada de estas decisiones en
  `data/evidence/catalunya/girona.jsonl` (241 `keep` + 6 tombstones de purga).
  El CSV sigue siendo la fuente de verdad; la provincia no está en cobertura
  estricta (`data/evidence/coverage.json`), así que la evidencia puede ampliarse
  sin bloquear.
- Catálogo final: 241 filas con la cabecera canónica de 20 columnas; 239
  `verificado`, 2 `parcial` y 0 `pendiente`.
- No hay duplicados de `slug`, nombre + municipio, dominio web, teléfono,
  correo, perfil social ni `place_id`.
- Se revisaron 16 grupos de coordenadas compartidas. Corresponden a centroides
  municipales o de núcleo usados de forma prudente por productores distintos;
  las identidades, contactos y direcciones no justifican ninguna fusión.
- Las 125 filas con `Venta online=sí` tienen un canal declarado y las
  dependencias necesarias: web para `ecommerce`, correo para `email` y teléfono
  para `telefono` o `whatsapp`.
- Se completó el correo y el horario de `formatges-mas-farro-la-vall-de-bianya`
  desde su web oficial, que indica expresamente cómo confirmar pedidos grandes.
- Las 17 filas con venta `no comprobado` tienen decisión documentada en este
  ledger o, para las altas de las Rutas del Vi, en
  `data/evidence/catalunya/girona.jsonl`.
- Los únicos residuales son `lactics-tramuntana-cabanelles` y
  `can-solivera-forallac`; ambos conservan `parcial` por límites de evidencia
  actuales ya descritos en el lote 27.
- La señal de completitud queda en 99,2 % únicamente porque el objetivo
  editorial penaliza `no comprobado`; no representa un incumplimiento del
  contrato ni una cola sin revisar.
- La nota temporal de candidates de Girona quedó cerrada; sus altas ya viven
  en evidence estructurada.
