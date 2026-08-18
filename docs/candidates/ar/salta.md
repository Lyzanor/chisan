# Salta — candidatos

- CSV destino: `data/csv/ar/noroeste/salta.csv`
- Fuente: directorio de socios de Bodegas de Argentina,
  https://bodegasdeargentina.org/socios-bodegas-de-argentina/
- Fecha de búsqueda: 2026-08-16
- Alcance: solo lo que publica ese directorio, que en Salta trae dos bodegas y
  las dos ya están en el CSV. La cola está vacía porque la fuente lo está, no
  porque la provincia lo esté.

## Trabajo pendiente

Resuelto el vino: el Museo de la Vid y el Vino de Salta
(`museodelavidyelvino.gov.ar/rutadelvino.php`) publica las bodegas de la Ruta
del Vino con localidad, domicilio, teléfono y web, y de ahí salieron 31 filas
en Cafayate, Animaná, Angastaco, Cachi, Molinos, Tolombón, Chicoana, La Viña y
Payogasta.

Fuera del vino, sin barrer: los pimentones y ajíes de la quebrada, las carnes
de llama de la puna y los quesos de cabra del valle.

## Mapa de las Rutas Sanas del Alimento

- Fuente: `https://agroeco.red/mapa`, espejo del My Maps de las Rutas Sanas del Alimento;
  los datos salen de
  `https://www.google.com/maps/d/kml?mid=1e4CanhyiwCYZkQdPa9gAr77goJywFFxf&forcekml=1`.
- Fecha de la pasada: 2026-08-18.
- Alcance: la capa «Unidades productivas / Quintas /Huertas con venta directa», acotada a
  esta provincia punto a punto con el georreferenciador de datos.gob.ar, deduplicada contra
  el CSV y contra las repeticiones del propio mapa.

### Candidatos

Sin cola: todas las fichas de esta pasada están resueltas.

