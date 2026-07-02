# Verificación provincial de Lleida

Ledger mínimo para reanudar la revisión profunda de
`data/csv/catalunya/lleida.csv`. El CSV sigue siendo la fuente de verdad y la
evidencia por fila vive en `data/evidence/catalunya/lleida.jsonl`.

## Estado

- Inicio: 2026-06-15.
- Snapshot inicial: 206 filas; 8 `verificado`, 118 `parcial`, 80 `pendiente`.
- Tras el lote 50: 204 filas; 163 `verificado`, 41 `parcial`, 0 `pendiente`.
- Modo: verificación profunda provincial cerrada; quedan revisiones editoriales
  puntuales si aparecen fuentes nuevas.
- Lotes 1–50 cerrados; Lleida completa.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`. Cada lote debe
revisar identidad, actividad productora, municipio, enlaces y venta online;
editar solo sus filas; añadir evidencia JSONL y cerrar con `verify:data`.

## Lote 1: dulces y chocolate de Agramunt

Revisado el 2026-06-15 mediante las webs oficiales, páginas de contacto,
tiendas y carritos activos.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `torrons-vicens-agramunt`, `torrons-roig-agramunt`, `xocolata-jolonch-agramunt` |

### Excepciones

- Xocolata Jolonch comparte grupo y tienda online con Torrons Vicens, pero
  mantiene identidad, obrador y presencia pública propios. Se conservan ambas
  filas.
- En Jolonch se mantiene la dirección pública de la chocolatería de Plaça del
  Pou; la web también publica un obrador en Av. Marià Jolonch, 5.
- Se retiró el horario heredado de Torrons Vicens al no encontrar un horario
  oficial actual para la sede de Agramunt.
- El horario de Torrons Roig se actualizó con su calendario estacional.
- Las tres imágenes existentes son logotipos coherentes con las marcas.

### Fuentes principales

- <https://www.vicens.com/en>
- <https://www.vicens.com/en/nocilla-nougat-150g-in-a-case>
- <https://torronsroig.com/ca/inici/>
- <https://torronsroig.com/ca/producto/xocolata-a-la-pedra-pes-net-350g/>
- <https://www.xocolatajolonch.com/ca/comestibles/xocolatajolonch/obrador/t-3450>
- <https://www.xocolatajolonch.com/ca/comestibles/xocolatajolonch/xocolateria/t-6735>
- <https://www.vicens.com/en/white-chocolate-jolonch-100g>

## Lote 2: productores de Almacelles

Revisado el 2026-06-15 mediante webs oficiales, páginas de contacto, tiendas
y estado efectivo de los carritos.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `lo-vilot-farm-brewery-almacelles`, `cal-quiteria-almacelles` |
| `verificado`, venta `no comprobado` | `cal-sargaire-almacelles` |

### Excepciones

- Cal Sargaire mantiene productos y botones de compra, pero la propia web
  anuncia que la venta está temporalmente desactivada. No se fuerza `no`.
- Cal Sargaire se recategoriza de `Charcutería` a `Carne` y se corrige la
  dirección con la publicada por la entidad.
- En Lo Vilot se retira el horario heredado: las visitas se conciertan o se
  publican en calendario y no equivalen a apertura semanal.

### Fuentes principales

- <https://www.lovilotfarmbrewery.com/en/>
- <https://www.lovilotfarmbrewery.com/en/visit-us/>
- <https://calsargaire.com/>
- <https://calsargaire.com/producte/lot-carn-sargaire-5-kg/>
- <https://calquiteria.com/>
- <https://calquiteria.com/producto/lot-detallista/>

## Lote 3: productores de Rialp

Revisado el 2026-06-15 mediante webs oficiales, directorios institucionales
y comprobación de mecanismos de pedido remoto.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `email` | `formatgeria-casa-mateu-rialp` |
| `verificado`, venta por `marketplace` | `formatgeria-montsent-de-pallars-rialp` |
| `verificado`, venta `no comprobado` | `casa-macia-rialp` |

### Excepciones

- Casa Mateu publica pedidos personalizados por correo y un horario actual de
  tienda de martes a viernes por la mañana.
- Montsent mantiene visitas con reserva previa; la venta remota comprobada se
  realiza mediante un marketplace con carrito activo.
- Casa Macià es una explotación ganadera real además de alojamiento rural. Se
  recategoriza de `Charcutería` a `Carne`, se eliminan las notas de revisión y
  se incorporan contacto y red social. Sus fuentes solo demuestran puntos de
  venta directa, no un pedido remoto inequívoco.

### Fuentes principales

- <https://www.formatgeriacasamateu.com/>
- <https://formatgeriamontsent.cat/>
- <https://formatgeriamontsent.cat/contacte/>
- <https://trosdesort.cat/montsent-semi.html>
- <https://irtapirineu.cat/explora/casa-macia/>
- <https://productes.sobiradinamic.cat/casa-macia/>

## Lote 4: productores de Tàrrega

Revisado el 2026-06-15 mediante webs oficiales, tiendas, condiciones de envío
y páginas corporativas de actividad.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `galetes-el-rosal-tarrega`, `olis-franquesa-tarrega` |
| `verificado`, venta `no comprobado` | `pere-gasso-tarrega` |

### Excepciones

- Galetes El Rosal mantiene productos con carrito y envíos peninsulares. Se
  sustituye la descripción genérica y se retira el horario no publicado.
- Olis Franquesa mantiene tienda, pago y envío activos. El horario se limita
  al publicado para la tienda física del molino, sin apertura el sábado.
- Pere Gassó se mantiene como elaborador cárnico de Tàrrega orientado a
  profesionales, colectividades y comercios. Se recategoriza a `Carne`; el
  enlace de WhatsApp es de contacto y no basta para afirmar venta remota.

### Fuentes principales

- <https://elrosal.cat/ca/>
- <https://elrosal.cat/ca/ct/galetes-el-rosal-17>
- <https://olisfranquesa.com/>
- <https://es.olisfranquesa.com/faqs/>
- <https://www.peregasso.com/>
- <https://www.peregasso.com/nosaltres/>
- <https://www.peregasso.com/productes/>
- <https://www.peregasso.com/distribucio/>

## Lote 5: productores de La Pobla de Segur

Revisado el 2026-06-15 mediante webs oficiales, formularios de pedido, tiendas
y páginas de visita a fábrica.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `email` | `licors-portet-la-pobla-de-segur` |
| `verificado`, venta por `ecommerce` | `ctretze-pirineus-la-pobla-de-segur` |

### Excepciones

- Licors Portet permite solicitar productos mediante formulario y recibirlos
  directamente en casa. Se corrige el teléfono, se migra la web a HTTPS y se
  sustituyen los horarios por los calendarios estacionales oficiales.
- CTretze mantiene tienda con referencias disponibles, carrito y plazo de
  envío. Su horario de restaurante continúa publicado; la web indica que
  actualmente no realiza visitas guiadas.

### Fuentes principales

- <https://licorsportet.cat/>
- <https://licorsportet.cat/la-botiga/>
- <https://licorsportet.cat/on-comprar/>
- <https://ctretze.cat/es>
- <https://ctretze.cat/es/shop>
- <https://ctretze.cat/es/shop/cerveza-fura-33cl-pack-16-u-149>
- <https://ctretze.cat/visita-la-fabrica>

## Lote 6: bodegas consolidadas

Revisado el 2026-06-15 mediante webs corporativas y tiendas oficiales con
productos y mecanismos de compra activos.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `l-olivera-cooperativa-vallbona-de-les-monges`, `castell-del-remei-penelles`, `raimat-lleida` |

### Excepciones

- L'Olivera incorpora teléfono y correo del aviso legal y pierde un horario
  heredado incoherente.
- Castell del Remei migra a HTTPS y conserva venta directa en su propia tienda.
- Raimat vende en la tienda oficial de su grupo. Se retiran las redes
  genéricas de 15 Bodegas y un horario de visita no suficientemente actual.

### Fuentes principales

- <https://olivera.org/es/>
- <https://olivera.org/es/aviso-legal/>
- <https://olivera.org/es/tienda/>
- <https://castelldelremei.com/es/>
- <https://castelldelremei.com/es/tienda/>
- <https://www.15bodegas.com/raimat>
- <https://www.15bodegas.com/vinos/marca/raimat>

## Lote 7: bodegas de La Pobla de Cérvoles

Revisado el 2026-06-15 mediante webs, contactos y tiendas oficiales.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `cervoles-celler-la-pobla-de-cervoles`, `mas-blanch-i-jove-la-pobla-de-cervoles` |

### Excepciones

- Cérvoles incorpora el teléfono y correo oficiales, migra a HTTPS y elimina
  el horario indeterminado.
- Mas Blanch i Jové normaliza la dirección y adopta el horario de visitas
  publicado en 2026, más reciente que su página de contacto antigua.

### Fuentes principales

- <https://cervoles.com/en/essence/>
- <https://cervoles.com/en/contact/>
- <https://cervoles.com/es/tienda/>
- <https://www.masblanchijove.com/es/>
- <https://www.masblanchijove.com/es/bodegas-vino-lleida-2/>
- <https://www.masblanchijove.com/es/tienda/>

## Lote 8: aceites de Els Torms

Revisado el 2026-06-15 mediante webs corporativas, contactos y tiendas
oficiales.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `cooperativa-del-camp-de-els-torms-els-torms`, `olicatessen-els-torms` |

### Excepciones

- La Cooperativa dels Torms produce L'Olier y publica un horario ampliado
  durante la campaña de noviembre a enero.
- Olicatessen pertenece a Molí dels Torms, una entidad diferente con su propio
  molino, dirección y catálogo. Se corrigen contacto y HTTPS y se retira el
  horario heredado no publicado.

### Fuentes principales

- <https://www.loliercoop.com/en/the-cooperative/>
- <https://www.loliercoop.com/es/contacto/>
- <https://www.loliercoop.com/es/tienda/>
- <https://olicatessen.com/en/>
- <https://olicatessen.com/en/purchase-conditions/>
- <https://olicatessen.com/es/politica-de-privacidad/>

## Lote 9: productores y elaboradores de Mollerussa

Revisado el 2026-06-15 mediante webs oficiales, páginas de actividad,
contactos y un marketplace minorista.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `marketplace` | `pastisseria-patet-mollerussa` |
| `verificado`, venta `no` | `nufri-mollerussa`, `ruser-export-albatarrec`, `llet-el-castillo-mollerussa` |
| `verificado`, venta `no comprobado` | `carniques-del-pla-mollerussa` |

### Excepciones

- Patet se referencia por su obrador de Sant Isidori y no por la cafetería. Su
  pizza mantiene venta en un supermercado online.
- Càrniques del Pla se conserva como empresa artesana elaboradora y se
  recategoriza a `Carne`, aunque su actividad sea principalmente B2B.
- Ruser Export no es un mero intermediario, pero la unidad productiva está en
  Albatàrrec. Se corrigen municipio, dirección, teléfono y coordenadas sin
  cambiar el `slug`.
- Nufri y El Castillo mantienen producción industrial activa en Mollerussa,
  sin un canal minorista remoto en sus webs.

### Fuentes principales

- <https://www.nufri.com/es/fruta-fresca>
- <https://patet.cat/es/contacto/>
- <https://www.compraonline.bonpreuesclat.cat/products/patet-pizza-4-formatges/51267>
- <https://www.carniquesdelpla.com/>
- <https://www.ruserexport.com/>
- <https://www.lletelcastillo.cat/>
- <https://www.lactalis.es/sala-de-prensa/corporativo/lactalis-invierte-mas-de-52-millones-en-cataluna-genera-cerca-de-300-empleos-y-celebra-el-centenario-de-el-castillo-reafirmando-su-compromiso-con-el-territorio-catalan/>

## Lote 10: productores de Balaguer

Revisado el 2026-06-15 mediante webs oficiales, páginas de pedido, servicios
de distribución y tiendas con carrito.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `costers-del-sio-balaguer`, `xarcuteria-paris-balaguer` |
| `verificado`, venta por `telefono` | `el-nostre-corder-balaguer` |
| `verificado`, venta por `whatsapp` | `comelles-fruits-balaguer` |

### Excepciones

- Costers del Sió incorpora su horario estacional oficial y mantiene tienda
  propia.
- El Nostre Corder se recategoriza de `Charcutería` a `Carne`; acepta pedidos
  de medios corderos o corderos enteros con reparto a domicilio.
- Comelles distribuye a particulares y personaliza pedidos; se limita el
  catálogo descrito a manzanas y peras comprobadas.
- Xarcuteria París mantiene productos de elaboración propia con carrito. Se
  retira un horario heredado que la web actual no publica.

### Fuentes principales

- <https://www.costersio.com/en>
- <https://costersio.com/shop/en/>
- <https://www.elnostrecorder.com/es/>
- <https://www.elnostrecorder.com/es/comprar/>
- <https://www.perecomelles.com/serveis/>
- <https://www.perecomelles.com/contacte/>
- <https://xarcuteriaparis.com/esp/>
- <https://xarcuteriaparis.com/esp/shop/>

## Lote 11: queserías y Granja Godall

Revisado el 2026-06-15 mediante webs oficiales, páginas de contacto, formularios
de pedido y tiendas con carrito o instrucciones de envío.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `tros-de-sort-sort`, `granja-godall-olius` |
| `verificado`, venta por `email` | `formatges-camps-el-palau-d-anglesola` |
| `verificado`, venta por `email` y `whatsapp` | `mas-d-eroles-ribera-d-urgellet` |
| `verificado`, venta `no comprobado` | `aubagueta-biosca` |

### Excepciones

- Aubagueta confirma explotación, rebaño y elaboración ecológica en Biosca,
  pero el contacto por WhatsApp no demuestra por sí solo un pedido remoto. Se
  retira además el horario diario heredado, distinto del régimen de visitas.
- Tros de Sort corrige la dirección a Camí de les Vernedes y conserva la venta
  directa mediante su tienda con carrito y transporte refrigerado.
- Formatges Camps acepta comandas mediante formulario y las confirma a
  distancia; amplía la descripción de producto a quesos de cabra, oveja y vaca.
- Granja Godall estaba mal clasificada como láctea. Es una explotación porcina
  de ciclo cerrado con granjas y fábrica de pienso en Olius y obrador en
  Llobera; se recategoriza a `Charcutería` y se retira de la ficha de Olius el
  horario comercial de Llobera.
- Mas d'Eroles publica pedidos por correo o WhatsApp, pago por transferencia y
  envío a domicilio; se actualiza también el horario de la quesería.

### Fuentes principales

- <https://aubagueta.com/>
- <https://aubagueta.com/?page_id=2>
- <https://trosdesort.cat/>
- <https://trosdesort.cat/contacte-tros-de-sort.html>
- <https://trosdesort.cat/formatges-tros-de-sort/>
- <https://www.formatgescamps.com/>
- <https://www.formatgescamps.com/contacte/>
- <https://www.granjagodall.cat/>
- <https://www.granjagodall.cat/contacte>
- <https://www.granjagodall.cat/e-shop>
- <https://www.masderoles.com/la-formatgeria>
- <https://www.masderoles.com/formatges-antics>

## Lote 12: turrones y bodegas consolidadas

Revisado el 2026-06-15 mediante webs oficiales, contactos y tiendas con
productos disponibles.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `torrons-i-mel-alemany-os-de-balaguer`, `tomas-cusine-el-vilosell`, `castell-d-encus-talarn`, `celler-batlliu-de-sort-sort`, `lagravera-alfarras` |

Se actualizaron descripciones, HTTPS, contactos y horarios. En Tomàs Cusiné se
conserva únicamente el horario oficial de visitas; en Lagravera se corrige la
dirección a la carretera de Tamarite.

Fuentes principales: <https://alemany.com/>,
<https://www.tomascusine.com/en/contacta/>, <https://castelldencus.com/>,
<https://www.batlliudesort.cat/> y <https://lagravera.com/contacto/>.

## Lote 13: bodegas y aceites de Les Garrigues y Urgell

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `celler-matallonga-fulleda`, `celler-analec-nalec`, `albium-oleum-flumen-l-albi`, `baro-de-maials-maials` |
| `verificado`, venta `no comprobado` | `vinya-els-vilars-arbeca` |

Matallonga y Analec mantienen productos con precio y carrito. Vinya els Vilars
confirma actividad y municipio, pero su carrito vacío no demuestra un canal de
venta operativo. Baró de Maials incorpora la sede y los horarios estacionales
publicados por la cooperativa.

Fuentes principales: <https://www.cellermatallonga.cat/category/all-products>,
<https://analec.net/es/categoria-producte/vinos-tintos/>,
<https://vinyaelsvilars.cat/>, <https://albium.cat/botiga/> y
<https://barodemaials.cat/contacta/>.

## Lote 14: fruta y huerta

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `veritfruit-bellcaire-d-urgell`, `fruita-blanch-lleida`, `hort-calvis-golmes` |
| `verificado`, venta por `whatsapp` | `cireres-de-corbins-corbins` |
| `verificado`, venta `no` | `fruits-de-ponent-alcarras` |

Fruits de Ponent confirma producción y comercialización cooperativa, pero no
un canal minorista remoto. Cireres de Corbins acepta pedidos por WhatsApp y
reparte en Catalunya.

Fuentes principales: <https://www.fruitsponent.com/>,
<https://veritfruit.com/>, <https://www.cireresdecorbinscamatscarpi.com/>,
<https://fruitablanch.com/en/shop/> y
<https://www.hortcalvis.com/agrobotiga/>.

## Lote 15: explotaciones familiares, carne y miel

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `plaovi-algerri`, `cal-bosch-belianes` |
| `verificado`, venta por `whatsapp` | `cal-petit-del-nen-ivars-de-noguera` |
| `verificado`, venta por `marketplace` | `mel-cal-toni-seros` |
| `verificado`, venta `no comprobado` | `granja-pifarre-lleida` |

PlaOví se recategoriza de `Charcutería` a `Carne`. La agrobotiga de Granja
Pifarré combina productos propios y de terceros, por lo que no se atribuye una
venta remota propia sin una prueba específica.

Fuentes principales: <https://www.calpetitdelnen.es/es/>,
<https://www.granjapifarre.com/agrobotiga/>, <https://www.plaovi.cat/es/>,
<https://calbosch.cat/> y <https://melcantoni.com/>.

## Lote 16: productores de l'Horta y especialidades

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `safra-del-montsec-sant-esteve-de-la-sarga`, `fruites-i-calcots-andreu-lleida` |
| `verificado`, venta por `ecommerce` y `whatsapp` | `grup-aragones-lleida` |
| `verificado`, venta `no` | `celler-de-sanui-lleida` |
| `verificado`, venta `no comprobado` | `l-oliverar-de-sanui-lleida` |

Grup Aragonés y Fruites Andreu son explotaciones distintas. Celler de Sanui
mantiene web y actividad, pero sólo ofrece información y reservas de
actividades. L'Oliverar se confirma mediante el registro municipal y actividad
oficial reciente; se retira la ficha turística que figuraba como web propia.

Fuentes principales: <https://www.safradelmontsec.com/cat/>,
<https://fruitesandreu.cat/>, <https://gruparagones.com/contacts/>,
<https://cellerdesanui.com/> y
<https://marcahorta.paeria.cat/elaboradors/>.

## Lote 17: huevos y queserías

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `formatgeria-del-miracle-riner` |
| `verificado`, venta por `email` | `formatgeria-serrat-gros-josa-i-tuixent` |
| `verificado`, venta `no comprobado` | `ous-codi-0-lleida`, `formatges-vilavella-isona-i-conca-della`, `formatges-l-oliva-oliana` |

La tienda de Codi 0 existe, pero todos los productos revisados estaban
agotados. Vilavella y L'Oliva mantienen actividad oficial en 2025-2026, aunque
sin un mecanismo remoto comprobado.

Fuentes principales: <https://codi0.cat/product/ous/>,
<https://www.formatgeriaserratgros.com/contactar.html>,
<https://www.instagram.com/formatgesvilavella/>,
<https://www.instagram.com/formatgesloliva/> y
<https://www.formatgeriaelmiracle.com/>.

## Lote 18: queserías del Pirineo

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `formatges-de-l-abadessa-la-seu-d-urgell` |
| `verificado`, venta `no` | `cooperativa-cadi-la-seu-d-urgell` |
| `verificado`, venta `no comprobado` | `formatgeria-de-gavas-la-guingueta-d-aneu` |
| `parcial`, venta `no comprobado` | `formatge-barida-el-pont-de-bar`, `formatges-castell-llebre-peramola` |

Baridà y Castell-Llebre conservan identidad y municipio, pero no presentan una
señal propia suficientemente reciente para `verificado`. Gavàs sí mantiene web
y actividad oficial reciente.

Fuentes principales: <https://formatgeriabarida.food.blog/>,
<https://cadi.es/>, <https://abadessa.cat/> y
<https://formatgeriadegavas.cat/>.

## Lote 19: cerveceras artesanas

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `casa-dalmases-cervera`, `la-vella-caravana-menarguens` |
| `verificado`, venta por `email` | `cerveses-ponent-sero` |
| `parcial`, venta `no comprobado` | `cerveseria-matoll-belianes`, `lo-perot-penelles` |

Casa Dalmases y La Vella Caravana mantienen productos y tienda actualizados en
2026. Cerveses Ponent tramita cajas mediante formulario, confirmación y
transferencia. Matoll sólo muestra actividad propia hasta 2023 y la web de Lo
Perot ya no responde.

Fuentes principales: <https://www.casadalmases.org/>,
<https://www.cervesesponent.com/comprar-online/>,
<https://lavellacaravana.cat/botiga/> y
<https://www.instagram.com/matollcervesaartesana/>.

## Lote 20: cerveceras, cierre y recuperación de Salí de Cambrils

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `refu-fabrica-alternativa-bossost`, `brebel-torrefarrera` |
| `verificado`, venta por `marketplace` | `sal-de-cambrils-oden` |
| `verificado`, venta `no` | `cervesa-bcd-vallfogona-de-balaguer` |
| eliminado por cierre | `formatges-de-clua-la-clua-artesa-de-segre` |

Formatges de Clua se elimina por cierre permanente tras la venta forzosa del
rebaño y la pérdida de la granja. Salí de Cambrils se conserva: se localizó su
web vigente, que confirma elaboración artesanal activa, certificación
ecológica desde 2024 y puntos de venta online. Se corrigen categoría, contacto,
web y coordenadas.

Fuentes principales: <https://cervesabcd.com/>,
<https://refubirreria.com/>, <https://www.brebel.beer/es/>,
<https://salidecambrils.cat/productes/> y
<https://www.segre.com/es/comarcas/251004/clua-dice-adios-a-su-queso-artesanal-tras-nueve-anos_974092.html>.

## Lote 21: queserías de Aitona, Alt Urgell y Solsonès

| Resultado | Slugs |
|---|---|
| `verificado`, venta `no` | `formatges-montllobe-aitona`, `la-reula-figols-i-alinya` |
| `parcial`, venta `no comprobado` | `casa-sibillo-gimenells-i-el-pla-de-la-font`, `hormatges-tarrau-bagergue-naut-aran`, `formatgeria-les-roques-sant-llorenc-de-morunys` |

Montllobé y La Reula tienen web oficial activa que confirma obrador,
municipio y producto, pero sin carrito ni pedido remoto vigente. Casa Sibilló,
Tarrau y Les Roques quedan parciales: las fuentes propias o institucionales
fallan, devuelven 404 o no resuelven.

Fuentes principales: <https://formatgesmontllobe.com/>,
<http://lareula.cat/> y Google Maps.

## Lote 22: quesería Valette y panaderías de Lleida

| Resultado | Slugs |
|---|---|
| `verificado`, venta `no comprobado` | `forn-papanbread-lleida` |
| `parcial`, venta `no comprobado` | `formatgeria-valette-sant-llorenc-de-morunys`, `forn-la-fleca-lleida`, `m-serra-forn-i-pastisseria-lleida`, `casa-pons-forners-lleida` |

Papanbread se valida por canal oficial activo en Lleida, pero su web no
resolvió y no hay compra remota comprobada. Valette conserva identidad social,
pero el dominio propio aparece como página de hosting, por lo que se retira la
venta online heredada.

Fuentes principales: <https://www.instagram.com/papanbread/>,
<https://www.instagram.com/formatgeriavalette/> y Google Maps.

## Lote 23: panaderías de Tremp y La Seu d'Urgell

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `la-original-forn-del-serafi-la-seu-durgell` |
| `parcial`, venta `no comprobado` | `antic-forn-de-pa-j-marti-llaras-lleida`, `forn-de-pa-farre-tremp`, `forn-de-pa-ribera-tremp`, `forn-de-pa-montsec-tremp` |

La Original mantiene web oficial, actividad reciente en 2026 y enlace de
reservas/comandes. El resto queda como panaderías localizadas sin señal propia
actual suficiente.

Fuentes principales: <https://laoriginal.cat/>,
<https://www.portalrest.com/> y Google Maps.

## Lote 24: panaderías de La Seu, Coll de Nargó, Solsona y Cervera

| Resultado | Slugs |
|---|---|
| `verificado`, venta `no comprobado` | `crosta-i-molla-la-seu-durgell` |
| `parcial`, venta `no comprobado` | `forn-tahussa-coll-de-nargo`, `cal-jaumet-del-forn-solsona`, `forn-pastisseria-camps-solsona`, `pa-dabans-cervera` |

Crosta i Molla se confirma por canal oficial activo en La Seu d'Urgell, pero
su web no resolvió. Camps y Pa d'abans pierden el `no` heredado: sin web
resuelta no se puede afirmar ausencia de venta remota, sólo dejarla sin
comprobar.

Fuentes principales: <https://www.instagram.com/crostaimolla/> y Google Maps.

## Lote 25: panaderías locales sin fuente propia suficiente

| Resultado | Slugs |
|---|---|
| `parcial`, venta `no comprobado` | `forn-cal-benet-ponts`, `forn-de-pa-solans-ponts`, `forn-mir-lleida`, `cal-figuerosa-barbens`, `forn-sant-antoni-lleida` |

No se localizó web, tienda ni canal oficial suficientemente actual para elevar
estas panaderías. Se conservan como parciales por identidad y municipio.

Fuente principal: Google Maps.

## Lote 26: cooperativas de aceite de Les Garrigues

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `cooperativa-sant-isidre-les-borges-blanques`, `cooperativa-del-camp-de-bovera-bovera`, `cooperativa-de-juncosa-juncosa`, `cooperativa-del-soleras-el-soleras` |
| `verificado`, venta por `marketplace` | `cooperativa-de-la-granadella-la-granadella` |
| `parcial`, venta `no comprobado` | `cooperativa-darbeca-arbeca` |

Se sustituyen dominios heredados por fuentes activas: Terrall, Or del Terme,
Les Cabanes y Cooperativa del Soleràs tienen tienda propia. La Granadella se
valida en Agrobotigues, con productos Degustus, precio y carrito. Arbeca queda
parcial porque no se comprobó tienda vigente.

Fuentes principales: <https://terrall.es/botiga/>,
<https://www.agrobotigues.coop/agrobotigues/lagranadella>,
<https://www.ordelterme.com/botiga/>,
<https://olilescabanes.com/comprar-aceite-de-oliva-virgen-extra/> y
<https://www.coopelsoleras.es/productes>.

## Lote 27: aceite y bodegas verificadas

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `oli-migjorn-naves`, `clos-pons-lalbages`, `celler-vila-corona-tremp`, `celler-comalats-montoliu-de-segarra` |

Los cuatro mantienen fuente propia activa y tienda. Clos Pons se actualiza al
sitio Pons 1945 y Comalats al sitio catalán vigente.

Fuentes principales: <https://olimigjorn.com/tienda-online-aceite-oliva-virgen-extra/>,
<https://pons1945.com/>, <https://vilacorona.cat/botiga/> y
<https://www.comalats.cat/ca/>.

## Lote 28: bodegas de Verdú, Pallars y Baldomar

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `celler-cercavins-verdu`, `boldu-viticultors-verdu` |
| `verificado`, venta `no` | `celler-terrer-de-pallars-figuerola-dorcau`, `celler-el-vinyer-figols-de-tremp`, `vall-de-baldomar-baldomar-artesa-de-segre` |

Cercavins se corrige al dominio activo `cellercercavins.com`, con precios y
cesta. El Vinyer también se corrige a `elvinyer.cat`. Terrer de Pallars, El
Vinyer y Vall de Baldomar tienen web oficial, pero no mecanismo de compra
remota revisado.

Fuentes principales: <https://cellercercavins.com/en/>,
<http://terrerdepallars.com/>, <https://www.elvinyer.cat/es/>,
<https://www.valldebaldomar.com/> y <https://bolduviticultors.com/>.

## Lote 29: bodega, licores y baja de Quevall

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `ramonetto-licors-bellaguarda`, `tres-cadires-arbeca` |
| `parcial`, venta `no comprobado` | `celler-mas-garcia-muret-llimiana`, `destil-leria-gabarro-feixa-fulleda` |
| eliminado por otra provincia | `quevall-bellpuig` |

Quevall se elimina de Lleida: la entidad actual y su tienda se sitúan en
Llançà (Girona), mientras Bellpuig queda como domicilio histórico. Ramonetto y
Tres Cadires mantienen tiendas propias. Mas Garcia Muret y Gabarró & Feixa se
conservan sólo como parciales.

Fuentes principales: <https://quevall.cat/>,
<https://www.datoscif.es/empresa/quevall-licors-artesans-2018-sl>,
<https://ramonetto.cat/botiga/>, <https://trescadires.cat/botiga/> y
<https://www.fulleda.cat/el-municipi/turisme/gastroturisme/destil-leria-gabarro-feixa>.

## Lote 30: mieles y ubicación pendiente de ApiFerro

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `la-nostra-mel-talavera`, `masia-rosines-ribera-dondara` |
| `parcial`, venta por `ecommerce` | `apiferro-mel-crua-del-montsec-castissent-tremp` |
| `parcial`, venta `no comprobado` | `mel-salagut-masia-tonicoll-pinell-de-solsones`, `mel-de-loest-aitona` |

La Nostra Mel se actualiza a `lanostramel.com` y Masia Rosinés mantiene tienda
propia. ApiFerro conserva venta online, pero no sube a verificado porque su
web oficial sitúa el contacto en Pont de Montanyana y la fila mantiene
Castissent/Tremp pendiente de resolución. Mel de l'Oest se confirma por Gust
de Lleida, pero sin venta remota comprobada.

Fuentes principales: <https://lanostramel.com/productes/>,
<https://www.masiarosines.com/tienda>,
<https://www.apiferro.com/botiga-productes/>,
<https://www.apiferro.com/on-trobar-nos/> y
<https://www.gustdelleida.cat/productor/mel-de-loest/>.

## Lote 31: mieles de Camarasa/Pallars y Torrons Fèlix

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `mel-del-pallars-rialp`, `torrons-felix-agramunt` |
| `verificado`, venta `no comprobado` | `dolca-de-pallars-isona-i-conca-della` |
| `parcial`, venta `no comprobado` | `apicola-bonet-camarasa`, `casa-mestre-tremp` |

Apícola Bonet queda parcial y sin venta online: el dominio heredado
`melbonet.com` correspondía a Mel Bonet de Riba-roja d'Ebre, no al productor
de Camarasa. Casa Mestre también queda parcial al no resolver la web heredada.

Fuentes principales: <https://www.gastroteca.cat/es/on-comprar/apicola-bonet/>,
<https://www.instagram.com/dolcadepallars/>,
<https://meldelpallars.com/botiga/>,
<https://www.pallarsjussa.net/es/gastronomia/miel-de-la-terreta-casa-mestre> y
<https://torronsfelix.com/es/tienda/>.

## Lote 32: charcuterías del Pirineo

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `carnisseria-cal-tomas-sort`, `casa-bernadi-noves-de-segre-les-valls-daguilar`, `xolis-dadons-adons-el-pont-de-suert` |
| `verificado`, venta `no comprobado` | `embotits-esterri-carns-teixido-esterri-daneu`, `embotits-espunes-organya` |

Se corrige Cal Tomàs desde el dominio erróneo `caltomas.ae` a `caltomas.cat`.
Embotits Esterri queda verificado por Carns Teixidó, pero sin compra remota
comprobada.

Fuentes principales: <https://caltomas.cat/es/tienda/>,
<https://productes.sobiradinamic.cat/embotits-esterri-i-carns-teixido/>,
<https://casabernadi.com/contactenos>,
<https://www.espunyes.cat/embotits-artesans-de-qualitat-a-organya.aspx> y
<https://www.xolisdadons.net/>.

## Lote 33: Solsonès, Cerdanya y correcciones geográficas

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `cal-monegal-olius`, `biolord-sant-llorenc-de-morunys`, `bec-dor-oden-masia-guerres` |
| `verificado`, venta `no comprobado` | `antiga-casa-jaume-bellver-de-la-cerdanya` |

Antiga Casa Jaume tenía coordenadas heredadas de Valencia; se corrige a
Bellver de Cerdanya. Bec d'Or se recategoriza como `Carne` por su actividad
avícola.

Fuentes principales: <https://www.instagram.com/antigacasajaume/>,
<https://www.calmonegal.com/>, <https://biolord.cat/botiga/> y
<https://www.becdor.cat/comanda/>.

## Lote 34: queserías de montaña

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `formatgeria-cal-majuba-alas-i-cerc` |
| `parcial`, venta por `marketplace` | `hormatgeria-dera-irissa-vielha-e-mijaran` |
| `verificado`, venta `no` | `formatgeria-taull-la-vall-de-boi` |
| `verificado`, venta `no comprobado` | `lo-nicolau-artesa-lladorre`, `formatgeria-rotxes-lladurs` |

Dera Irissa se mantiene parcial: hay directorio aranés y producto en
marketplace, pero no una fuente propia actual suficiente para subirla.

Fuentes principales: <https://formatgeriacalmajuba.com/>,
<https://www.visitvaldaran.com/item/hormatgeria-dera-irissa-co-de-gaion/>,
<https://www.pirineugourmet.com/producto/yogurt-natural-irissa/>,
<https://formatgeriataull.com/> y <https://www.instagram.com/nicolauartesa/>.

## Lote 35: bodegas de Pallars, Artesa, Verdú y Juneda

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `celler-miquel-roca-gavet-de-la-conca`, `celler-mas-ramoneda-artesa-de-segre` |
| `verificado`, venta por `marketplace` | `celler-purgatori-juneda` |
| `verificado`, venta `no comprobado` | `celler-sauvella-isona-i-conca-della` |
| `parcial`, venta por `marketplace` | `celler-casa-pardet-verdu` |

Casa Pardet no resolvió en la web propia durante la revisión; se conserva
parcial con venta localizada en Vinaralia. Purgatori se verifica por Familia
Torres y queda como venta por canal externo.

Fuentes principales: <https://www.sauvella.com/>,
<https://cellermiquelroca.com/botiga/>,
<https://masramoneda.com/botiga/>,
<https://vinaralia.com/llistat.php?casa_pardet=&idb=382> y
<https://www.torres.es/en/wines/familia-torres/purgatori>.

## Lote 36: aceites y cervezas

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `cooperativa-de-vinaixa-vinaixa`, `agricola-de-l-albi-l-albi`, `la-fraternal-de-l-albages-l-albages`, `la-masovera-tremp` |
| `verificado`, venta `no comprobado` | `click-brew-torrefarrera` |

Click & Brew se verifica como fábrica colaborativa y co-packing en
Torrefarrera, pero no como tienda retail activa.

Fuentes principales: <https://www.cooperativadevinaixa.cat/es/>,
<https://www.cooperativalbi.com/es/comprar-aceite-de-oliva-virgen-extra-arbequina/>,
<https://alba1919.com/en/>, <https://www.clickandbrew.com/> y
<https://lamasovera.cat/botiga/ca/>.

## Lote 37: cervezas y productores de Sant Guim

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `el-pastoret-de-la-segarra-sant-guim-de-freixenet` |
| `verificado`, venta por `email` | `mel-sant-guim-sant-guim-de-freixenet` |
| `verificado`, venta por `whatsapp|telefono` | `casa-melio-sant-guim-de-freixenet` |
| `verificado`, venta `no` | `ous-de-sant-guim-pinsos-yak` |
| `verificado`, venta `no comprobado` | `killbeers-sort`, `cervesa-vip-montferrer-i-castellbo`, `forn-cal-goma-sant-guim-de-freixenet` |

KillBeers sube a verificado por web propia y localización, pero sin tienda.
Mel Sant Guim vende por formulario de comanda, por eso queda en canal `email`.

Fuentes principales: <https://killbeers.com/>,
<https://www.instagram.com/cervesa_vip/>,
<https://www.melsantguim.com/productes/>,
<https://pastoret.com/donde-comprar/>,
<https://www.instagram.com/casamelio/> y <https://yak.cat/es/>.

## Lote 38: Ossera, Agramunt y Vilaller

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `torrons-virginias-agramunt` |
| `parcial`, venta por `ecommerce` | `torrons-angel-lluch-agramunt`, `torrons-l-agramuntina-agramunt` |
| `verificado`, venta `no` | `forn-codina-vilaller` |
| `verificado`, venta `no comprobado` | `mel-d-ossera-la-vansa-i-fornols` |

Torrons Àngel & Lluch y L'Agramuntina quedan parciales: hay fuente
regulatoria o institucional y canal del grupo Vicens, pero no fuente propia
diferenciada vigente.

Fuentes principales: <https://parcsnaturals.gencat.cat/es/detalls/Article/MelOssera>,
<http://www.torronslluch.com/>, <https://www.vicens.com/ca>,
<https://virginias.es/tienda/> y <https://www.forncodina.com/ca/>.

## Lote 39: huerta, fruta y nueces

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `cal-valls-vilanova-de-bellpuig`, `la-cistella-de-montgai-montgai`, `hort-de-ca-la-cistellera-juneda`, `nous-de-palau-el-palau-d-anglesola` |
| `verificado`, venta `no comprobado` | `sanui-fruits-lleida` |

Nous de Palau se corrige de Lleida a `El Palau d'Anglesola`, con dirección y
coordenadas actualizadas. Cal Valls y Hort de Ca la Cistellera mantienen flujo
real de tienda/carrito.

Fuentes principales: <https://www.calvalls.com/web/en/order>,
<https://lacistellademontgai.cat/es>,
<http://hortdecalacistellera.cat/>,
<https://www.sanuifruits.com/> y <https://nousdepalau.com/tienda/?lang=es>.

## Lote 40: frutos secos y caracoles

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `foment-agricola-de-les-garrigues-maials`, `caragols-almacelles-almacelles` |
| `verificado`, venta por `telefono` | `said-cargols-vius-torrefarrera` |
| `verificado`, venta `no comprobado` | `nous-montsec-os-de-balaguer`, `fruita-seca-teixido-seros` |
| `parcial`, venta `no comprobado` | `lo-caragol-de-la-serra-juncosa` |

Foment Agrícola se documenta con su web corporativa Les Garrigues y tienda
`comerfrutossecos.com`. Nous Montsec tiene web actual, pero las rutas
tienda/shop revisadas devuelven 404.

Fuentes principales: <https://www.nousmontsec.cat/es/>,
<https://les-garrigues.com/contacto/>,
<https://comerfrutossecos.com/tienda/>,
<https://frutossecosteixido.com/?lang=es>,
<https://www.gastroteca.cat/es/on-comprar/lo-caragol-de-la-serra/>,
<https://www.caragols.com/shop/> y
<https://comproatorrefarrera.cat/entitats/said-cargols-vius/>.

## Lote 41: trufas de Bovera y Tàrrega

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `laumont-tarrega` |
| `verificado`, venta `no comprobado` | `farre-vidal-tofones-bovera` |

Farré Vidal se verifica por web propia, pero su tienda revisada está vacía y
se baja de `sí` a `no comprobado`. Laumont queda como operador local de
selección, transformación y comercialización especializada con sede en Tàrrega,
sin la marca editorial `REVISAR`.

Fuentes principales: <https://www.farrevidal.com/>,
<https://www.farrevidal.com/shop/>,
<https://www.laumont.es/pages/contacto> y <https://laumontshop.com/>.

## Lote 42: conservas e infusiones

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `cal-senzill-bellpuig`, `herbes-de-l-alt-urgell-la-vansa-i-fornols`, `herbes-de-l-alt-pirineu-alins` |

Cal Senzill, Herbes de l'Alt Urgell / Herboristeria Nogué y Herbes de l'Alt
Pirineu suben a verificado por web propia y tienda activa.

Fuentes principales: <https://www.calsenzill.com/>,
<https://www.calsenzill.com/cast/la-tienda-1/>,
<https://www.herbesossera.com/> y
<https://www.herbesdelaltpirineu.com/>.

## Lote 43: aguas y licores

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `email` | `debresca-baix-pallars` |
| `verificado`, venta `no comprobado` | `aigua-pineo-estamariu`, `aigua-de-caldes-de-boi-la-vall-de-boi` |

Pineo y Aigua de Caldes de Boí quedan verificadas por fuente propia, sin
compra remota clara. DeBresca se representa con canal `email` porque la comanda
se gestiona por formulario/contacto.

Fuentes principales: <https://pineo.cat/>,
<https://aguadecaldesdeboi.com/>, <https://www.debresca.cat/> y
<https://www.debresca.cat/fer-comanda/>.

## Lote 44: embutidos y huevos de granja

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `embotits-obach-organya` |
| `verificado`, venta `no comprobado` | `masia-perdigues-la-baronia-de-rialb`, `quicou-s-la-pobla-de-cervoles` |

Obach mantiene tienda oficial con carrito. Masia Perdigués / Forat de Buli y
Quicou's se verifican por web propia y contacto, pero sin venta remota
comprobada.

Fuentes principales: <https://embotitsobach.com/>,
<https://foratdebuli.com/> y <https://www.quicous.cat/>.

## Lote 45: azafrán, pan y miel con fuente limitada

| Resultado | Slugs |
|---|---|
| `parcial`, venta `no comprobado` | `safra-de-les-garrigues-cervia-de-les-garrigues`, `forn-frias-lleida`, `mel-mino-tarrega` |

Safrà de les Garrigues mantiene web propia pero antigua; Forn Frias no resolvió
una fuente propia actual suficiente. Mel Minó se corrige de Vilanova de Meià a
Tàrrega por la ficha de Gastroteca, con el slug alineado.

Fuentes principales: <https://safracat.cat/>,
<https://www.gastroteca.cat/es/on-comprar/mel-mino/> y
<https://www.google.com/maps/search/?api=1&query=Forn%20Frias%20Lleida%20Lleida>.

## Lote 46: conejo, caprino y miel aranesa

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `telefono` | `conill-de-les-serretes-preixens` |
| `verificado`, venta por `marketplace` | `eth-brinhon-naut-aran` |
| `verificado`, venta `no comprobado` | `agro-caprina-morell-montgai` |

Conill de les Serretes pasa de venta `no` a `sí` por pedido telefónico. Eth
Brinhon también pasa de `no` a `sí` por producto vigente en marketplace.
Agro-Caprina Morell se verifica por canal social oficial y Maps.

Fuentes principales: <https://conilldelesserretes.cat/>,
<https://conilldelesserretes.cat/botiga/>,
<https://www.instagram.com/acm_montgai/>,
<https://brinhon.com/> y
<https://www.pirineugourmet.com/producto/miel-artesanal-eth-brinhon/>.

## Lote 47: pasta, frutos secos y ESMET

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `pastas-la-cosa-nostra-cervera` |
| `verificado`, venta `no comprobado` | `fruits-secs-puigdellivol-torrebesses` |
| `parcial`, venta `no comprobado` | `esmet-bongus-2023-balaguer` |

Pastas La Cosa Nostra se verifica por tienda propia. Fruits Secs Puigdellívol
se verifica por web oficial, sin compra clara. ESMET / Bongus 2023 queda
parcial porque la evidencia procede de ficha pública de producto, no de fuente
propia actual.

Fuentes principales: <https://es.pastaslacosanostra.com/>,
<https://www.frutossecospuigdellivol.com/> y
<https://www.aecoctrade.es/es/producto/X9dj1oKpEymzuAxrgHpvLi>.

## Lote 48: Mas d'en Roy

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `celler-mas-den-roy-artesa-de-segre` |

Mas d'en Roy pasa de `no comprobado` a `sí`; la web muestra vinos propios y
enlaces de compra. La evidencia previa de alta desde candidatos se conserva
como registro canónico.

Fuentes principales: <https://www.masdenroyceller.com/index.php/ca> y
<https://www.masdenroyceller.com/index.php/ca/nostres-vins>.

## Lote 49: Petit Duran y Solana Roivert

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `celler-petit-duran-sant-marti-de-riucorb`, `solana-roivert-salas-de-pallars` |

Ambas bodegas ya figuraban verificadas con ecommerce; se revisan de nuevo y se
normaliza la web a HTTPS en el CSV. La evidencia previa de candidatos se
mantiene.

Fuentes principales: <https://petitduran.com/>, <https://petitduran.com/botiga/>,
<https://sroivert.com/> y <https://sroivert.com/tienda-vinos/>.

## Lote 50: Cara Nord y cierre provincial

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `cara-nord-celler-el-vilosell` |

Cara Nord se revisa por web y tienda propias, se normaliza a HTTPS y queda
cerrado el bloque 1-50. El snapshot final de Lleida queda en 204 filas: 163
`verificado`, 41 `parcial` y 0 `pendiente`.

Fuentes principales: <https://caranordceller.com/> y
<https://caranordceller.com/tienda/>.

## Imágenes / logos (P3) — 2026-06-24

Tanda de imágenes con `scripts/enrich-producer-images.py` (dry-run `--report` →
triaje por slug con contact sheets → `--apply` solo de logos verificados a ojo,
`--asset-provincia "catalunya/lleida"`). Tras `--apply` hay que reconvertir CRLF→LF
(`perl -i -pe 's/\r\n/\n/g'`) y comprobar que el diff solo toca `imagen`.

- **Cobertura: 93 → 134 / 204 (46 % → 66 %).** +41 logos netos, todos revisados en
  su canvas final.
- **16 candidatos rechazados** (dejados en blanco): Kit Digital/red.es ×2
  (`formatgeria-taull`, `sanui-fruits`), logo de plataforma agrobotigues
  (`cooperativa-de-la-granadella`), badge DOP (`cooperativa-del-soleras`), CCPAE/eco
  (`cooperativa-de-vinaixa`), tira de certificados (`herbes-de-l-alt-pirineu`), tira
  de patrocinadores Vicens/RAC1/SJD (`torrons-l-agramuntina`, `torrons-angel-lluch`),
  logo de Google (`celler-petit-duran`), WordPress (`formatge-barida`,
  `la-fraternal-de-l-albages`), icono genérico (`vall-de-baldomar`), foto de masía
  (`masia-perdigues`), favicons 16-42 px (`ruser-export`, `granja-godall`,
  `cal-senzill`), logo ilegible 78×13 px (`farre-vidal-tofones`).
- **Nota de método:** el QA final renderizando los `.webp` **guardados** (no las URL)
  fue clave: el `--apply` reintenta candidatos y, si el #1 falla, guarda el #2 sin
  avisar — así colaron WordPress (`la-fraternal`) y la tira de patrocinadores
  (`torrons-l-agramuntina`), que se detectaron y purgaron tras el apply.
- Gate `verify:data` OK. Quedan ~70 sin imagen (sin web o sin candidato aceptable).
  Pendiente en P3: Barcelona (39 %).
