# Misiones — candidatos

- CSV destino: `data/csv/ar/nordeste/misiones.csv`
- Fuente: hallazgo incidental al abrir el país; sin barrido de fuente acotada
- Fecha de búsqueda: 2026-08-16
- Alcance: yerba mate y té. La provincia no tiene todavía ninguna fuente nominal
  acotada localizada.

## Cola sin resolver

Vacía: Playadito resultó ser de Corrientes y su fila está en `corrientes.csv`.

## Trabajo pendiente

El padrón del INYM (Instituto Nacional de la Yerba Mate) sería la fuente
acotada natural — inscribe secaderos, molinos y productores — pero
`inym.org.ar/molinos-yerbateros/` devuelve 404 y no se ha localizado la ruta
buena. Buscarla antes de barrer por marcas: una marca no prueba quién elabora.

Sin barrer tampoco: el té de la zona de Campo Viera y Oberá, que comparte
elaboradores con la yerba, y la mandioca y el tabaco, que probablemente no
den productores vendibles.

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

- **La Lechuza Producción Agroecológica** (Oberá) — lote, teléfono y Facebook, pero ningún producto.
- **Chacra Acauaphy** (Libertad, Iguazú) — un teléfono y un Instagram que ya no existe.

### Sin identidad suficiente todavía

El mapa los sitúa pero no publica nombre comercial ni oferta propia con la que formar una
fila, así que no pasan la puerta de candidatos tal como están. Se conservan con sus pistas
por si otra fuente los resuelve.

- **Yerba Mate Vezná** (Apóstoles) — solo «Establecimiento San Nicolas»; falta acreditar la
  yerbatera.
