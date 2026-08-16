# Baja California — candidates

- Target CSV: `data/csv/mx/noroeste/baja-california.csv`
- Source: Rutas del Vino de Baja California, listing directory, read through its
  open GeoDirectory endpoint
  `https://rutasdelvinobc.com/wp-json/geodir/v2/places?per_page=100`
  (the map at https://rutasdelvinobc.com/index.php/mapa-general/ renders the
  same records in JavaScript and shows nothing without it)
- Searched: 16 August 2026
- Batch scope: every winery the directory holds, grouped by the municipality its
  coordinates fall in. `categoria` for all of them is `Vino`.

This is a third-party route directory, not a register. It lists a winery, a
locality, coordinates and often a site; it does not prove the business is
trading now, and a listed domain still has to be shown to be the producer's own
before it goes in `web`. Its own locality field is loose — three listings are
filed under Uruapan and one of them sits 40 km south at San Vicente — so treat
the locality as a lead, not as the address.

The municipality below comes from each listing's coordinates, because the
directory never states one and its localities are not municipalities. Ensenada
municipality is very large and holds the whole wine country: Valle de Guadalupe,
Francisco Zarco, San Antonio de Las Minas, El Porvenir, El Sauzal, Villa de
Juárez, Ojos Negros, Real del Castillo, San Vicente and the Baja California
Uruapan are all localities inside it, and they belong in `direccion`.

Two of those names are traps the centroid catalog will not catch for you.
`Valle de Guadalupe` resolves to the Jalisco municipality of that name, 1.700 km
away, and `Uruapan` to the Michoacán one, 1.400 km away. Neither the valley nor
the Baja Uruapan is a municipality. Write Ensenada.


## Ensenada

- **Adobe Guadalupe** — locality as published: El Porvenir; https://www.adobeguadalupe.com/.
- **Amor Bonito Viní­cola** — locality as published: Villa de Juárez; no site in the directory.
- **Baron Balche** — http://www.baronbalche.com.
- **Bibayoff Vinícola** — https://bibayoff.com.mx/.
- **Bodegas Entrevez** — locality as published: Valle de Guadalupe; http://bodegasentrevez.com/.
- **Bodegas F. Rubio** — locality as published: El Porvenir; https://bodegasfrubio.com/.
- **Bodegas Henri Lurton** — locality as published: Francisco Zarco; https://www.bodegashenrilurton.com/.
- **Bodegas de Santo Tomas @Bodegas Miramar Ensenada** — http://santo-tomas.com/.
- **Bodegas de Santo Tomas @Valle de Santo Tomas** — locality as published: Valle de Santo Tomas; http://santo-tomas.com/.
- **Bodegas de Santo Tomás @San Antonio de las Minas** — locality as published: San Antonio de Las Minas; http://santo-tomas.com/.
- **Casa Emiliana** — locality as published: Ensenada - El Porvenir; https://www.casaemiliana.com.mx/.
- **Casa Magoni Vinícola** — locality as published: Francisco Zarco; https://casamagoni.com/.
- **Casa Zamora Bodega de Vino** — locality as published: Ejido el Ajusco; https://www.casazamora.com.mx/.
- **Casta de Vinos** — locality as published: El Porvenir; https://www.castadevinos.mx/.
- **Cava El Laurel** — locality as published: San Antonio de Las Minas; no site in the directory.
- **Cava Maciel** — locality as published: San Antonio de Las Minas; https://www.cavamaciel.com.mx/.
- **Cava Mazuelo** — no site in the directory.
- **Cava Zaragoza** — locality as published: Colonia Artículo 115; http://www.cavazaragoza.com.mx/.
- **Cavas Valmar** — no site in the directory.
- **Cavas del Mogor Badan** — locality as published: Francisco Zarco; https://ferrer.com.mx/mogor.html.
- **Chateau Camou** — no site in the directory.
- **Cieli Winery** — no site in the directory.
- **Clos de Tres Cantos** — http://closdetrescantos.com/.
- **Concierto Enológico** — https://www.conciertoenologico.com/.
- **Cuatro Cuartos** — https://www.cuatrocuatrosreservas.com/vinicola-2/.
- **Decantos Vinicola** — no site in the directory.
- **Don Tomas Viñedo** — locality as published: El Porvenir; http://www.dontomasvinedo.com/.
- **DuoMa Vinos Mexicanos** — https://duomavinos.com/.
- **Encuentro Guadalupe** — no site in the directory.
- **Epicentro Vitivinícola** — locality as published: El Porvenir; http://epicentrovv.com/.
- **Espiritus Enológicos** — locality as published: El Sauzal; https://espiritusenologicos.com.mx/.
- **Estación de Oficios El Porvenir** — no site in the directory.
- **Finca La Carrodilla** — no site in the directory.
- **Fratelli Pasini** — no site in the directory.
- **Hacienda La Lomita** — no site in the directory.
- **Hacienda Las Animas** — no site in the directory.
- **Hilo Negro Vinícola** — http://vinohilonegro.com/.
- **La CAVA** — no site in the directory.
- **La Casa de Doña Lupe** — no site in the directory.
- **La Cetto** — no site in the directory.
- **La Toscana Viñedos** — no site in the directory.
- **MD Vinos** — locality as published: Uruapan; no site in the directory.
- **Madera 5 Cava Aragon 126** — locality as published: El Sauzal; https://cavaaragon126.com.mx/.
- **Mag-Bel Vinos** — no site in the directory.
- **Monte Xanic** — no site in the directory.
- **Museo Histórico Comunitario del Valle de Guadalupe** — no site in the directory.
- **Museo del Vino de BC** — no site in the directory.
- **Nativo Vinicola** — no site in the directory.
- **OJO AZUL & ALMATIERRA WINERY** — no site in the directory.
- **Ojos Negros Vinícola** — locality as published: Ojos Negros; https://www.ojosnegrosvinicola.mx/.
- **Ovianas vinicola** — no site in the directory.
- **Pasión de Luna** — locality as published: Villa de Juárez; https://pasiondeluna20.wixsite.com/website.
- **Quinta Monasterio** — https://www.quintamonasterio.com.mx/.
- **Rancho Velasco** — no site in the directory.
- **Rey de 3** — no site in the directory.
- **Roganto** — https://www.roganto.com/.
- **Rondo del Valle** — locality as published: Viñas del Sol; https://rondodelvalle.com.
- **San Cosme Viñedo** — locality as published: Cañon Buenavista; no site in the directory.
- **Shedeh Vinícola** — locality as published: Valle de Guadalupe; https://www.shedeh.mx.
- **Sol de Media Noche Vinícola** — locality as published: Valle de Guadalupe; http://www.soldemedianoche.com.mx/.
- **Sol y Barro** — locality as published: San Antonio de Las Minas; http://www.solybarro.com.mx/.
- **TREVISTA Vineyards** — no site in the directory.
- **Tintos del Norte 32** — no site in the directory.
- **VINOS KRUGER** — locality as published: San Antonio de Las Minas; https://vinoskruger.com/.
- **Valle de Tintos** — locality as published: El Sauzal; https://www.valledetintos.com/.
- **Vena Cava Vinícola** — no site in the directory.
- **Villa Montefiori** — no site in the directory.
- **Vinedos Mina Penelope** — no site in the directory.
- **Vinedos de Rincon de Guadalupe** — no site in the directory.
- **Vinicola Alximia** — locality as published: San Antonio de Las Minas; http://www.alximia.com/.
- **Vinicola Castillo Ferrer** — no site in the directory.
- **Vinicola Fraternidad** — no site in the directory.
- **Vinicola Paralelo** — no site in the directory.
- **Vinicola Retorno** — locality as published: San Antonio de Las Minas; https://www.vinicolaretorno.com/.
- **Vinicola Sierravita** — no site in the directory.
- **Vinicola Tres Valles** — locality as published: San Antonio de Las Minas; https://www.vinostresvalles.com/.
- **Vinisterra** — locality as published: San Antonio de Las Minas; https://vinisterra.com/.
- **Vinos Artesanales Baruch** — no site in the directory.
- **Vinos Cruz** — locality as published: San Antonio de Las Minas; https://vinoscruz.com.
- **Vinos Don Juan** — no site in the directory.
- **Vinos Dubacano** — locality as published: San Vicente; https://vinosdubacano.com/.
- **Vinos Fuentes** — locality as published: Valle de Guadalupe; http://vinosfuentes.com/.
- **Vinos LT** — locality as published: San Antonio de Las Minas; http://www.vinoslt.com/.
- **Vinos Lechuza** — http://vinoslechuza.com/.
- **Vinos Magbel** — no site in the directory.
- **Vinos Martlot** — no site in the directory.
- **Vinos Niebla** — no site in the directory.
- **Vinos PasionBiba** — no site in the directory.
- **Vinos Pavia** — locality as published: Rancho de la Garza; https://vinospavia.com/.
- **Vinos Pijoan** — locality as published: El Porvenir; https://vinospijoan.com/.
- **Vinos Plata** — locality as published: Villa de Juárez; https://www.vinosplata.mx/.
- **Vinos Rolu** — https://www.rolu.mx/.
- **Vinos Shimul** — no site in the directory.
- **Vinos Shimul** — no site in the directory.
- **Vinos Trasiego** — locality as published: Ejido El Porvenir; https://copatinta.com/.
- **Vinos Xecue** — locality as published: San Antonio de Las Minas; http://www.xecue.com/.
- **Vinos de Autor ALTOTINTO** — locality as published: Uruapan; http://www.altotinto.com.mx/.
- **Vinos de Meza** — no site in the directory.
- **Vinos el Cielo** — no site in the directory.
- **Vinos y Quesos Artesanales** — no site in the directory.
- **Vinos y Villas Maglen** — no site in the directory.
- **Vinsur Vinícola** — locality as published: El Sauzal; no site in the directory.
- **Vinícola 3 Mujeres** — no site in the directory.
- **Vinícola Bruma** — locality as published: Valle de Guadalupe; http://bruma.mx/vinicola.html.
- **Vinícola Casa de Piedra** — locality as published: San Antonio de Las Minas; http://vinoscasadepiedra.com.
- **Vinícola Cava Cordova** — locality as published: El Sauzal; http://www.cavacordova.com/.
- **Vinícola EMEVE** — locality as published: El Porvenir; https://vinicolaemeve.com/es/.
- **Vinícola Infinito** — locality as published: Real del Castillo Nuevo; http://vinicolainfinito.com.
- **Vinícola JC Bravo** — locality as published: Ejido El Porvenir; no site in the directory.
- **Vinícola La Trinidad** — locality as published: El Sauzal; http://www.latrinidadvinos.com/.
- **Vinícola Maglén** — locality as published: San Antonio de Las Minas; https://www.maglenresort.com/maglen-vinicola.
- **Vinícola Pedraza** — no site in the directory.
- **Vinícola Punto y Aparte** — locality as published: El Sauzal; https://www.sommelierponcelis.com/vinicola-punto-y-aparte.
- **Vinícola Regional de Ensenada** — locality as published: Uruapan; http://www.viresa.mx/.
- **Vinícola Roa** — no site in the directory.
- **Vinícola Torres Alegre y Familia** — no site in the directory.
- **Vivasol** — no site in the directory.
- **Viña Saiz** — no site in the directory.
- **Viña de Frannes** — no site in the directory.
- **Viña de Liceaga** — http://www.vinosliceaga.com/inicio.php.
- **Viñas Del Sol** — no site in the directory.
- **Viñas de Garza** — no site in the directory.
- **Viñas de la Erre** — no site in the directory.
- **Viñas del Tigre** — no site in the directory.
- **Viñedo Las Nubes** — no site in the directory.
- **Viñedo Solar Fortún** — locality as published: Valle de Guadalupe; https://solarfortun.com/.
- **Viñedos Aldo Cesar Palafox** — no site in the directory.
- **Viñedos Casa Baloyán** — no site in the directory.
- **Viñedos En'kanto** — https://www.enkanto.mx/.
- **Viñedos LAFARGA** — no site in the directory.
- **Viñedos Santa Ursula** — no site in the directory.
- **Viñedos Vinícola Relieve** — locality as published: San Antonio de Las Minas; https://www.relievevinicola.com/.
- **Viñedos de la Milagrosa** — no site in the directory.
- **Viñedos de la Reina** — https://viñedosdelareina.com/.
- **Wine Factory** — locality as published: El Porvenir; https://winefactory.com.mx/.
- **Xolo Vinos** — locality as published: Ejido El Porvenir; http://xolovino.com.

## Tecate

- **Bichi Wines** — locality as published: Ensenada; http://www.josepastorselections.com/bichi.html.
- **Casa Veramendi** — http://casaveramendi.com/.
- **Cava y Productos Mediterráneos García** — locality as published: Ensenada; no site in the directory.
- **Encino de Piedra Vinícola** — no site in the directory.
- **Vinicola San Lorenzo** — locality as published: Ensenada; no site in the directory.
- **Vinos Tanama** — locality as published: Ensenada; no site in the directory.
- **Vinícola Rosa de Castilla** — locality as published: Ensenada; https://vinicolarosadecastilla.negocio.site/.
- **Viñedos Don Juan** — locality as published: Valle de Las Palmas; no site in the directory.

## Tijuana

- **Totol Vinícola** — https://www.totol.mx/.

## San Quintín

- **Vinícola de Becerra** — locality as published: Vicente Guerrero; https://www.vinicoladebecerra.mx/.

## Still to do

- The directory covers the northern valleys. Nothing here reaches Mexicali,
  Playas de Rosarito or San Felipe, and no source has been tried for them yet.
- Wine is the only family this pass touched. Baja California also has olive oil
  in the same valleys and a craft-beer scene in Tijuana and Ensenada; both need
  their own source.

