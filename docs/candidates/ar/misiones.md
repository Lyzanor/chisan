# Misiones — candidatos

- CSV destino: `data/csv/ar/nordeste/misiones.csv`
- Fuente: hallazgo incidental al abrir el país; sin barrido de fuente acotada
- Fecha de búsqueda: 2026-08-16
- Alcance: yerba mate y té. La provincia no tiene todavía ninguna fuente nominal
  acotada localizada.

## Cola sin resolver

- **Cooperativa Agrícola de la Colonia Liebig (Playadito)** — molino yerbatero
  cooperativo. `playadito.com.ar` devuelve cuerpo vacío y
  `www.playadito.com.ar` no resuelve en DNS; hay que encontrar el dominio vivo
  antes de nada. Ojo con la provincia: la colonia Liebig está en **Corrientes**,
  no en Misiones, aunque la marca se asocie a la yerba misionera. Si se
  confirma, la fila va en `corrientes.csv`.

## Trabajo pendiente

El padrón del INYM (Instituto Nacional de la Yerba Mate) sería la fuente
acotada natural — inscribe secaderos, molinos y productores — pero
`inym.org.ar/molinos-yerbateros/` devuelve 404 y no se ha localizado la ruta
buena. Buscarla antes de barrer por marcas: una marca no prueba quién elabora.

Sin barrer tampoco: el té de la zona de Campo Viera y Oberá, que comparte
elaboradores con la yerba, y la mandioca y el tabaco, que probablemente no
den productores vendibles.
