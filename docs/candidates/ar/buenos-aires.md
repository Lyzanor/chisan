# Buenos Aires — candidatos

- CSV destino: `data/csv/ar/pampeana/buenos-aires.csv`
- Fuentes barridas: registro provincial de Mercados Bonaerenses (`https://mi.mda.gba.gob.ar/api/productores`, 2.528 fichas, paginado a 10 por página pese al `limit`; la ficha de detalle vive en `/mercados/bonaerenses/v2/productor/<codigoDeVerificacionQR>` y es la que trae los contactos), directorio de socios de Bodegas de Argentina, `hechoporargentinos.com` (etiquetas `bodegas-en-<partido>`), ruta del queso de Suipacha, guías locales de Tandil y el mapa de productores agroecológicos de INTA/UNMdP-CONICET (ver abajo).
- Fecha de la última pasada: 2026-08-17.

## Mapa agroecológico de INTA/UNMdP (sudeste bonaerense)

`https://www.google.com/maps/d/kml?mid=1pdxz0cXqsj5ozBaZlhJYcI50L4rxAstd&forcekml=1` devuelve el
My Maps entero en un GET, sin navegador: 48 fichas de productor con coordenadas de la unidad
productiva, domicilio, actividad, superficie, año de inicio, canales de venta y contacto declarado,
más una capa de **límites de los cinco partidos** que cubre (General Pueyrredón, Mar Chiquita,
Balcarce, General Alvarado y Necochea). Esa capa es lo que zanja el partido de cada ficha por
point-in-polygon: el domicilio suele decir solo «Mar del Plata» o «Ruta 88». Lo levantan INTA
(Agencia Mar del Plata y EEA Balcarce) con la FAUD por convenio, así que acredita identidad,
ubicación y actividad, pero es un relevamiento: no prueba que el productor siga vendiendo hoy ni
cómo se le pide. Techo real: `parcial`.

Dos trampas propias. Casi todos los handles de redes que publica están mal o ya no existen —de
once comprobados, seis dan 404— así que ninguno se copia sin resolverlo. Y **repite unidades entre
capas**: «Producciones extensivas» vuelve a listar como lote lo que «Producciones frutihortícolas»
ya listaba como huerta (La Coloradita = Tarpuy, Los Serenos ×2), y una misma productora aparece con
tres nombres (Huerta de Sole, Agri.Cultoras y la cocina del restaurante al que provee).

## Cola sin resolver

- **Huertas del Quequén** (Ruta 86 km 7, Necochea) — el mapa no publica nombre de productor ni
  canal de venta y el teléfono declarado tiene un dígito de más. Sin oferta propia acreditada.
- **La Periferia** (Barrio Alfar, Mar del Plata) — el mapa la da de alta como huerta, pero
  `@laperiferia.mdp` es un bar cultural cooperativo con programación de shows. Falta separar la
  producción hortícola de la hostelería antes de decidir.
- **Cultivos Lawen** (Necochea) y **La Reina del Saba** (San Agustín, Balcarce) — su identidad
  pública es vivero de plantines; el desecado y fraccionado de aromáticas que el mapa les atribuye
  es la única línea comestible y no está acreditada por fuente propia.
- **El Plantinero** (Mar Chiquita) — igual: plantines como agregado de valor, y la miel sale de una
  apicultura declarada como complementaria y sin acreditar.
- **Malen Ruca**, **Huerta Agroecológica Jiddu** y la ficha **S/N** de Carlos Suárez — el mapa las
  sitúa pero no publica teléfono, correo ni canal; la tercera no tiene nombre comercial con el que
  formar identidad.
- **La Pori**, **La Trinidad**, **Paititi**, **La Serrana** y **Pampa de Luz / Las tierritas** — de
  la capa extensiva: hectáreas y coordenadas de un lote, sin nombre de productor, sin producto y sin
  canal. Son explotaciones, no productores vendibles; entran solo si se les acredita oferta propia.
- **Bodega Yancanello** — el directorio de Bodegas de Argentina la ficha en Piedras 77, 4º piso,
  Capital Federal, sin teléfono, web ni correo propios: no hay con qué situar la unidad productiva.
- **La Catalina** (Coronel Pringles) y **Finca Las Antípodas** (Junín) — la nota de prensa de la ruta del vino las nombra pero no publica contacto ni domicilio; ninguna resuelve dominio propio.
- **Bodega Don Atilio** (Uribelarrea, Cañuelas) — mismo caso; ojo, no es la quesería «Don Atilio» de Tandil, que ya está en el CSV.
- **Charcutería Tandilera** — el resumen de la DO nombra «La Charcutería» entre los elaboradores certificados y lo único que aparece con ese nombre en Tandil es una carnicería/fiambrería. Falta acreditar que elabora antes de darla de alta.
- **Época de Quesos / Tradición Inza** (Tandil) — local de venta en 14 de Julio y San Martín; falta separar la tienda de la unidad elaboradora.
- **Cabañas Las Dinas** (Tandil) — elaborador del salame DO, pero `lasdinas.com.ar` es el alojamiento rural homónimo (o de la misma familia) y no acredita la fábrica.
- **Quesos de Suipacha** — la ruta del queso solo publica su Instagram; falta domicilio.

## Trabajo pendiente

- La horticultura del cinturón platense sigue sin barrer por fuera del registro provincial. El mapa
  agroecológico resuelve el cinturón de Mar del Plata, pero se corta en sus cinco partidos: no hay
  equivalente para Tandil, Azul, Olavarría ni el resto del sudeste.
- El registro provincial deja ~440 fichas con Instagram y nombre de marca todavía sin triar, y unas 2.000 más a nombre de una persona física, que solo entran si se les acredita marca y actividad.
- Ojo con dos trampas ya vistas: casi toda entrada «Buenos Aires» del directorio de Bodegas de Argentina es la oficina porteña de una bodega que elabora en otra provincia; y la columna de web del registro provincial está muy caducada (tiendas dadas de baja, dominios que ya no resuelven y algún dominio que hoy es un portal de noticias).

## Mapa de las Rutas Sanas del Alimento

- Fuente: `https://agroeco.red/mapa`, espejo del My Maps de las Rutas Sanas del Alimento;
  los datos salen de
  `https://www.google.com/maps/d/kml?mid=1e4CanhyiwCYZkQdPa9gAr77goJywFFxf&forcekml=1`.
- Fecha de la pasada: 2026-08-18.
- Alcance: la capa «Unidades productivas / Quintas /Huertas con venta directa», acotada a
  esta provincia punto a punto con el georreferenciador de datos.gob.ar, deduplicada contra
  el CSV y contra las repeticiones del propio mapa.

`https://agroeco.red/mapa` republica entero, punto por punto, el My Maps de las Rutas Sanas
del Alimento (Red Interregional de Nodos Agroecológicos): las 1.035 fichas son las mismas en
los dos. La primaria es el My Maps y se baja completa de un GET a
`https://www.google.com/maps/d/kml?mid=1e4CanhyiwCYZkQdPa9gAr77goJywFFxf&forcekml=1`, sin
navegador; el espejo trunca las descripciones a 240 caracteres y con ellas pierde la mitad
de los contactos. De sus siete capas solo «Unidades productivas / Quintas /Huertas con venta
directa» (307 fichas) contiene productores: las demás son nodos de consumo, ferias, huertas
comunitarias, compostaje y adhesiones municipales a la RENAMA.

Techo real: `parcial`. Es un mapa de autoalta, sin fecha por ficha ni revisión —cada punto
declara lo que quiso—, así que acredita identidad, ubicación aproximada y actividad
declarada, nunca que el productor siga vendiendo hoy. Dos medidas lo acotan: de los 29
handles de Instagram que publica, 10 ya no existen, y de los dominios propios responden
ocho. Cuatro de cada cinco fichas traen teléfono o correo y menos de una de cada diez, web
propia, así que la vía normal de cierre es la red social o el teléfono, no el dominio.
Facebook, que es el enlace más frecuente, bloquea la IP de este entorno y ninguno de sus 81
enlaces está comprobado.

Una trampa propia: el municipio de estas notas sale del punto del mapa, no de la ficha, y en
varias el punto y la dirección declarada no coinciden. Antes de escribir `municipio` hay que
leer la dirección que trae la descripción.

### Candidatos

Quedan sin resolver, con sus pistas:

- **Agroecología Blaherve** (Adolfo Gonzales Chaves) — solo un correo, el mismo que Dos Hermanas.
- **Chacra La Adelina Agroecología** (Bolívar), **Pachakramama** (Cañuelas), **Tierra de Amigos**
  (Exaltación de la Cruz), **TODO MANSO** (General Las Heras), **La Estrella** (General Pueyrredón),
  **Chacra Agroecológica El Retorno** y **Siembra Colectiva** (Marcos Paz), **COPA Agroecología**
  (Presidente Perón), **Calma Tierra** (Tandil) y **Agromate** (Tres Arroyos) — proyectos reales con
  contacto, pero ninguno nombra un producto con el que asignar categoría.
- **Coliqueo** (Chacabuco) y **Amaranto Coop. de trabajo** (Exaltación de la Cruz) — «producción
  agroecológica extensiva» y «comercialización, producción y promoción»: falta el qué.
- **La Encimera** (La Plata) y **Granja Le Petit** (Marcos Paz) — granja y almacén con contacto
  completo, sin línea de producto declarada.
- **Campo Agroeco** (Pila) — la ficha dice «próximamente en Pila»: la unidad todavía no está allí.
- **La Bonita** (Saladillo) — tambo agroecológico y huerta; el único enlace es el perfil personal de
  su titular.
- **Granja Cara Negra** (San Andrés de Giles) — agricultura natural, lana y ovinos: lo único
  acreditado es la lana, que no es alimento.

### Sin identidad suficiente todavía

El mapa los sitúa pero no publica nombre comercial ni oferta propia con la que formar una
fila, así que no pasan la puerta de candidatos tal como están. Se conservan con sus pistas
por si otra fuente los resuelve.

- **Agricultor orgánico** (9 de Julio) — ficha titulada «Agricultor orgánico»; sin identidad
  pública.
- **Hnos. Krayeski. Quinta agroecológica** (Berazategui) — identidad = apellido de los
  hermanos; la fuente es una nota del INTA.
- **Brandsentierramagica** (Brandsen) — proyecto comunitario de autosuficiencia; sin oferta
  propia acreditada.
- **La Reserva, Espacio Agroecológico** (Cañuelas) — espacio agroecológico; sin oferta
  propia acreditada.
- **Punto 242** (Cañuelas) — ficha sin nombre ni descripción.
- **Chacra Eduardo** (General Pueyrredón) — solo nombre de pila del productor.
- **Granjita Urbana Ngen-Mawida** (General Pueyrredón) — reserva ecológica familiar; falta
  acreditar oferta propia.
- **La Huerta de Sole** (General Pueyrredón) — ya estaba en la cola de buenos-aires sin
  resolver.
- **Malen Rucå** (General Pueyrredón) — ya estaba en la cola de buenos-aires sin resolver.
- **Paititi** (General Pueyrredón) — ya estaba en la cola de buenos-aires sin resolver.
- **Guaminí** (Guaminí) — ficha sin nombre ni descripción.
- **Huerta biodinamica familiar** (Mar Chiquita) — ficha sin nombre comercial (huerta
  biodinámica familiar).
- **Granja Agroecologica** (San Vicente) — ficha titulada «Granja Agroecologica»; sin
  identidad pública pese al reconocimiento del MDA.
- **La Herencia - Familia Demarchi** (Villarino) — la fuente es un PDF de un programa de
  conservación; sin oferta propia acreditada.
