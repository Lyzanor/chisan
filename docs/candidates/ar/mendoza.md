# Mendoza — candidatos

- CSV destino: `data/csv/ar/cuyo/mendoza.csv`
- Fuente: directorio de socios de Bodegas de Argentina, https://bodegasdeargentina.org/socios-bodegas-de-argentina/ (una sola página con ~200 fichas: nombre, dirección, teléfono, web y correo)
- Fecha de búsqueda: 2026-08-16
- Alcance: solo vino, y solo lo que publica ese directorio. Los socios proveedores (bancos, corcho, vidrio, seguros, personal) ya están podados; lo que queda son bodegas sin verificar.

## Cola sin resolver

Quedan cuatro socios sin resolver; el resto está en el CSV o rechazado.

- **Bodega Aaron Tubert** — el directorio la ficha en Las Heras 340 con la web y el correo del
  hotel Balbi Star: no hay nada con lo que situar la unidad productiva.
- **Bodega Clément** — `clement.com.ar` es una comercializadora con oficinas en Mendoza, San Juan y
  Villa Mercedes; falta separar la distribución de la elaboración.
- **Bodega Jorge Giol** — Av. España 985, 3º piso, oficina G, sin web ni correo propios en el
  directorio.
- **Bodega Serrera Wines** — web viva con vinos y tienda, pero ninguna de sus páginas nombra dónde
  está la bodega; el directorio solo da la oficina de Godoy Cruz.

## Trabajo pendiente

La dirección del directorio es a menudo la oficina comercial: 39 entradas no nombran ninguna localidad y 13 dicen solo «Ciudad». Antes de escribir `municipio` hay que abrir la web del productor, y cuando esa web está tras pasarela de edad o renderizada en cliente, la fila se queda en `parcial` con el domicilio del directorio.

Sin barrer: el padrón del INV (que en datos.gob.ar solo sale agregado por departamento), las rutas del vino provinciales y todo lo que no sea vino — aceite de oliva de Maipú y Luján, conservas, frutos secos.

## Mapa de las Rutas Sanas del Alimento

- Fuente: `https://agroeco.red/mapa`, espejo del My Maps de las Rutas Sanas del Alimento;
  los datos salen de
  `https://www.google.com/maps/d/kml?mid=1e4CanhyiwCYZkQdPa9gAr77goJywFFxf&forcekml=1`.
- Fecha de la pasada: 2026-08-18.
- Alcance: la capa «Unidades productivas / Quintas /Huertas con venta directa», acotada a
  esta provincia punto a punto con el georreferenciador de datos.gob.ar, deduplicada contra
  el CSV y contra las repeticiones del propio mapa.

### Candidatos

Quedan sin resolver, con sus pistas:

- **Granja El Pulpo Rojo Ecológica** (Rivadavia) — la ficha mezcla dos productores: El Pulpo Rojo,
  del que solo dice «Granja Ecológica», y la bodega Lipari, que ya está en el CSV.
- **GRANJARDIN** (Las Heras) — «granja integral autogestiva» y un correo.
- **Agricultura ancestral Comunidad mapuche** (San Carlos, Paso de las Carretas) — ajo agroecológico,
  nueces y hierbas medicinales con teléfono, pero el título es una descripción y no una identidad
  pública; el correo que publica tiene el dominio mal escrito.
- **Granja Rocío** (Tunuyán) — huerta, apicultura y gallinas «en etapa inicial»: falta la oferta.

### Sin identidad suficiente todavía

El mapa los sitúa pero no publica nombre comercial ni oferta propia con la que formar una
fila, así que no pasan la puerta de candidatos tal como están. Se conservan con sus pistas
por si otra fuente los resuelve.

- **Junín** (Junín) — la ficha se titula con el departamento (Junín, Mendoza).
