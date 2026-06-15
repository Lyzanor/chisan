# Verificación provincial de Lleida

Ledger mínimo para reanudar la revisión profunda de
`data/csv/catalunya/lleida.csv`. El CSV sigue siendo la fuente de verdad y la
evidencia por fila vive en `data/evidence/catalunya/lleida.jsonl`.

## Estado

- Inicio: 2026-06-15.
- Snapshot inicial: 206 filas; 8 `verificado`, 118 `parcial`, 80 `pendiente`.
- Tras el lote 10: 206 filas; 38 `verificado`, 118 `parcial`, 50 `pendiente`.
- Modo: verificación profunda activa por municipios o grupos de fuente común.
- Lotes 6–10 cerrados; siguiente lote por definir.

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
| `verificado`, venta `no` | `nufri-mollerussa`, `ruser-export-mollerussa`, `llet-el-castillo-mollerussa` |
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
