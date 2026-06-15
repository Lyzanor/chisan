# Verificación provincial de Girona

Ledger mínimo para reanudar la revisión profunda de
`data/csv/catalunya/girona.csv`. El CSV sigue siendo la fuente de verdad.

## Estado

- Inicio: 2026-06-14.
- Snapshot inicial: 243 filas; 0 `verificado`, 139 `parcial`, 104 `pendiente`.
- Snapshot tras el lote 10: 241 filas; 82 `verificado`, 140 `parcial`, 19
  `pendiente`.
- Revisadas: 89.
- Resultado acumulado: 82 `verificado`, 5 `parcial`, 2 purgas, 0 fusiones.

## Lote 1: conservas de L'Escala y arroz de Pals

Revisado el 2026-06-14 con las webs oficiales, sus páginas de contacto y sus
mecanismos de pedido.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `anxoves-callol-serrats-l-escala`, `anxoves-de-l-escala-soles-l-escala`, `arros-mas-pla-pals` |
| `verificado`, venta por `email` | `arros-estany-de-pals-pals`, `arros-avi-trias-pals` |
| `verificado`, sin venta online demostrada | `anxoves-el-xillu-l-escala`, `anxoves-de-l-escala-sa-l-escala` |
| `verificado`, venta `no comprobado` | `arros-moli-de-pals-pals` |

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

### Fuentes principales

- <https://www.callolserrats.com/>
- <https://www.anxoves-soles.com/>
- <https://www.anxoveselxillu.com/>
- <https://www.anxovesdelescala.es/>
- <https://www.arrosestanydepals.cat/>
- <https://www.arrosmolidepals.com/>
- <https://www.arrosmaspla.com/>
- <http://www.arrosdepals.com/>
- <https://disbesa.com/es/contacto/>

## Lote 2: productores consolidados con datos heredados

Revisado el 2026-06-14 con las webs oficiales, sus páginas de contacto,
condiciones de compra y mecanismos de pedido.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `galetes-trias-santa-coloma-de-farners`, `mooma-palau-sator`, `xocolates-torras-cornella-del-terri` |
| `verificado`, venta por `ecommerce` y `suscripcion` | `cafes-cornella-fornells-de-la-selva` |
| `verificado`, venta por `marketplace` | `la-fageda-santa-pau` |
| `verificado`, sin venta online demostrada | `confraria-de-pescadors-de-palamos-palamos`, `perelada-peralada` |
| `verificado`, venta `no comprobado` | `aigua-de-sant-aniol-sant-aniol-de-finestres` |

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

### Fuentes principales

- <https://www.santaniol.com/es/contacto-sant-aniol/>
- <https://www.santaniol.com/es/venta-de-agua-a-domicilio/>
- <https://www.cafescornella.coffee/>
- <https://shop.cafescornella.coffee/>
- <https://www.confraria.cat/>
- <https://www.triasbiscuits.com/>
- <https://www.fageda.com/es/preguntas-frecuentes/>
- <https://www.fageda.com/es/donde-comprar/>
- <https://mooma.cat/condicions-generals-de-compra/>
- <https://perelada.com/>
- <https://chocolatestorras.com/>

## Lote 3: bodegas del Alt Empordà

Revisado el 2026-06-14 con las webs oficiales, las tiendas de vino y, para
Espelt, el consejo regulador y un marketplace vigente.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `celler-la-vinyeta-mollet-de-peralada`, `celler-mas-vida-cistella`, `cooperativa-agricola-de-garriguella-garriguella`, `vinyes-d-olivardots-capmany`, `vinyes-dels-aspres-cantallops` |
| `verificado`, sin venta online de producto demostrada | `celler-d-en-guilla-rabos`, `celler-mas-llunes-garriguella` |
| `parcial`, venta por `marketplace` | `celler-espelt-vilajuiga` |

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

### Fuentes principales

- <https://www.cellersdenguilla.com/el-celler/>
- <https://www.cellersdenguilla.com/el-celler/la-botiga/>
- <https://www.doemporda.cat/es/las-bodegas/l/92-espelt-viticultors.html>
- <https://www.vinissimus.com/es/bodega/espelt-viticultors-de-l-emporda/>
- <https://www.lavinyeta.es/ca/els-productes>
- <https://masllunes.es/vins/>
- <https://www.bodegasmasvida.com/es/tienda/vida/>
- <https://www.cooperativagarriguella.com/ca/botiga-online/>
- <https://olivardots.com/botiga-online/>
- <https://botiga.vinyesdelsaspres.cat/es/tienda.html>

## Lote 4: bodegas pendientes con presencia propia

Revisado el 2026-06-15 con las webs oficiales, páginas de contacto y tiendas
de producto.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `clos-d-agon-calonge-i-sant-antoni`, `eccocivi-sant-marti-vell`, `empordalia-pau`, `finca-bell-lloc-palamos`, `hugas-de-batlle-colera` |
| `verificado`, sin venta online demostrada | `celler-arche-pages-capmany`, `celler-can-sais-vall-llobrega` |
| `verificado`, venta `no comprobado` | `martin-faixo-cadaques` |

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

### Fuentes principales

- <http://ca.cellerarchepages.com/>
- <http://cellercansais.com/>
- <https://closdagon.com/en/shop/>
- <https://eccocivi.com/en/producto/els-boscals-negre-2023/>
- <https://empordalia.com/>
- <https://botiga.empordalia.com/>
- <https://brugarol.com/winery/>
- <https://brugarol.com/product/mestis/>
- <https://cellerhugasdebatlle.cat/>
- <https://cellerhugasdebatlle.cat/vins/>
- <https://www.martinfaixo.com/es/bodega-mf/>
- <https://www.martinfaixo.com/es/tienda-online/vinos/>

## Lote 5: cierre de bodegas pendientes

Revisado el 2026-06-15 con las webs oficiales, sus páginas de contacto,
catálogos y disponibilidad de producto.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `mas-oller-torrent`, `terra-remota-sant-climent-sescebes`, `clos-de-basella-siurana` |
| `verificado`, venta física directa | `mas-molla-calonge-i-sant-antoni` |

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

### Fuentes principales

- <http://www.masmolla.com/ca/mas-molla-celler-calonge-costa-brava>
- <http://www.masmolla.com/ca/avis-legal>
- <https://www.masoller.cat/>
- <https://www.masoller.cat/category/all-products>
- <https://www.masoller.cat/blank-4>
- <https://www.terraremota.com/una-identidad/>
- <https://www.terraremota.com/contact/>
- <https://bodega.terraremota.com/tienda/>
- <https://closdebasella.com/ca/celler>
- <https://closdebasella.com/contact-ns>
- <https://closdebasella.com/vins-organics-biodinamics/selene>

## Lote 6: cerveceras pendientes

Revisado el 2026-06-15 con las webs oficiales, catálogos, carritos y
disponibilidad de producto.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `cervesa-marina-blanes`, `cerveses-moska-sarria-de-ter`, `doskiwis-brewing-rupia`, `la-calavera-sant-joan-de-les-abadesses`, `cervesa-lava-olot`, `pochs-cervesa-artesana-castellfollit-de-la-roca`, `cervesa-artesana-minera-sant-joan-de-les-abadesses`, `soma-beer-cornella-del-terri` |
| `verificado`, venta por `ecommerce` y `whatsapp` | `bdegust-cervesa-compromesa-caldes-de-malavella` |
| `verificado`, sin venta online de producto demostrada | `gro-brewers-girona`, `dual-lab-brewery-girona` |

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

### Fuentes principales

- <https://cervesamarina.com/tienda-online/>
- <https://www.moskabeer.com/>
- <https://moskabeer.com/botiga/es/>
- <https://doskiwisbrewing.com/collections/beer>
- <https://lacalavera.cat/es/>
- <https://lacalavera.cat/es/tienda/>
- <https://lavabeer.cat/tienda/>
- <https://www.cervesapochs.com/>
- <https://minera.cat/botiga/>
- <https://es.bdegust.beer/>
- <https://bdegustshop.ecwid.com/>
- <https://www.grobrewers.com/?lang=es>
- <https://soma-beer.com/collections/catalogo-cervezas>
- <https://dual-lab.club/>

## Lote 7: lácteos con presencia propia

Revisado el 2026-06-15 con páginas oficiales de producto, tiendas, condiciones
de envío y datos de contacto.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `la-xiquella-la-vall-d-en-bas`, `cal-vigata-la-vall-d-en-bas`, `mas-claperol-sant-feliu-de-pallerols`, `llet-nostra-monells`, `mas-el-lladre-les-llosses`, `formatgeria-muuu-beee-ripoll`, `mas-casas-cruilles-cruilles` |
| `verificado`, pedidos por `whatsapp` | `japet-dels-bous-borrassa` |
| `verificado`, venta física directa | `mas-la-coromina-la-vall-d-en-bas`, `recuits-nuri-ullastret` |

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

### Fuentes principales

- <https://japetdelsbous.com/>
- <https://www.laxiquella.com/es/>
- <https://www.maslacoromina.cat/visites-per-a-grups/>
- <https://www.recuitsnuri.com/botiga/>
- <https://calvigata.cat/botiga/>
- <https://www.masclaperol.com/els-nostres-productes.html>
- <https://botiga.lletnostra.cat/>
- <https://www.masellladre.cat/shop>
- <https://muuubeee.com/botiga-online/>
- <https://mascasascruilles.cat/es/producto/assortit-lactics-dovella/>

## Lote 8: lácteos con evidencia limitada

Revisado el 2026-06-15 contrastando webs propias, páginas de producto,
contactos, puntos de venta y actividad pública reciente.

| Resultado | Slugs |
|---|---|
| `verificado`, pedidos por `whatsapp` | `mas-marce-siurana-d-emporda` |
| `verificado`, venta `no comprobado` | `recuits-de-fonteta-forallac` |
| `verificado`, sin venta online de producto demostrada | `formatgeria-la-balda-sant-marti-de-llemena`, `formatgeria-mas-alba-terradelles`, `la-selvatana-campllong`, `lactics-el-mont-maia-de-montcal`, `formatgeria-xauxa-les-preses`, `granja-mas-bes-vilobi-d-onyar` |
| `parcial`, sin venta online demostrada | `mas-eusebi-forallac`, `le-bolut-vilademuls` |

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

### Fuentes principales

- <https://www.labalda.com/>
- <https://www.masalba.cat/ca/formatgeria/on-comprar-i-tastar/>
- <https://www.laselvatana.net/ca/productes/>
- <https://www.peraladamasmarce.com/ca/>
- <https://www.recuitsfonteta.com/ca/>
- <https://www.lacticselmont.cat/>
- <https://dones.gencat.cat/web/.content/03_ambits/mon-laboral/mon-rural/Dones-Rurals-de-Girona/DONESRURALS_accessible_web.pdf>
- <https://formatgeriaxauxa.cat/>
- <https://acrefa.cat/formatgers-artesans/le-bolut/>
- <https://www.masbes.com/agrobotiga/>

## Lote 9: charcutería, dulces y pan

Revisado el 2026-06-15 con webs oficiales, catálogos, carritos, condiciones
de entrega, páginas de contacto y actividad reciente.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `embotits-d-oix-montagut-i-oix`, `embotits-artesans-gori-la-vall-d-en-bas`, `carnisseria-planaguma-olot`, `porcs-casolans-corominas-olot`, `gluki-olot` |
| `verificado`, venta por `ecommerce` y `whatsapp` | `angust-mieres` |
| `verificado`, sin venta online de producto demostrada | `galetes-ca-l-enric-castellfollit-de-la-roca`, `pastisseria-ferrer-olot`, `fleca-la-fogaina-les-preses` |
| `parcial`, sin venta online demostrada | `can-calet-sant-joan-les-fonts`, `mus-pastisseria-besalu` |

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

### Fuentes principales

- <https://embotitsdoix.com/>
- <https://embotitsgori.com/productes/>
- <https://www.angust.cat/botiga-online/>
- <https://cancalet.com/>
- <https://carnisseriaplanaguma.com/botiga/>
- <https://www.calenric.com/es/>
- <https://gustdegarrotxa.com/botiga/>
- <https://delitgastronomic.cat/mus-pastisseria/>
- <https://gluki.cat/ca/>
- <https://www.pastisseriaferrer.cat/>
- <https://www.lafogaina.com/qui-som>

## Lote 10: huerta, pesca, fruta, miel, aceite y otros

Revisado el 2026-06-15 con webs oficiales, tiendas, catálogos, datos de
producción y contraste específico del encaje como productor.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `can-moragues-riudarenes`, `mas-entreserra-corca`, `abellaires-empordanesos-garriguella`, `oli-fontclara-fontclara` |
| `verificado`, pedidos por `telefono` | `trull-ylla-cabanes` |
| `verificado`, sin venta online de producto demostrada | `confraria-de-pescadors-de-roses-roses`, `fruticola-emporda-sant-pere-pescador`, `giropoma-costa-brava-ulla`, `ratafia-russet-olot` |
| Eliminados por no ser productores | `trull-d-en-francesc-boadella-i-les-escaules`, `can-gombau-girona` |

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

### Fuentes principales

- <https://www.canmoragues.org/ca/el-projecte/>
- <https://www.canmoragues.org/ca/botiga/melmelades-i-salses-can-moragues/>
- <https://confrariapescadorsroses.cat/>
- <https://www.fructicolaemporda.com/en/>
- <https://www.giropoma.com/products?lang=en>
- <https://masentreserra.com/>
- <https://www.russet.cat/>
- <https://www.trull-boadella.com/>
- <https://www.trull-ylla.cat/ca/inici/la-botiga/>
- <https://www.abellaires.com/>
- <https://www.fontclara.es/tienda/>
- <https://surtdecasa.cat/girona/menjar-i-beure/el-vermutet-de-can-gombau-el-vermut-ritme-de-rumba>
