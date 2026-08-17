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
- **Bodega Yancanello** — 4ª Piso — sin web en el directorio de Bodegas de Argentina.
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
