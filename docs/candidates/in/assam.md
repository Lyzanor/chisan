# Assam — candidatos

- CSV destino: `data/csv/in/north-eastern/assam.csv`
- Fuente: sitio propio del productor, https://www.halmaritea.com/
- Fecha de búsqueda: 2026-08-16
- Alcance: solo un lead de té. Sin barrer: el resto de jardines de Assam,
  Dibrugarh, Jorhat y todo lo que no sea té.

## Sondeados, pendientes de resolver

- **Halmari Tea Estate** — el sitio responde 200 y vende té de Assam, pero el
  único contacto postal que publica es PIN 700026, que es Kolkata: la oficina,
  no el jardín. Falta situar la unidad productiva antes de publicar la fila.
  Su `products.json` no responde, así que la tienda tampoco está confirmada por
  esa vía; comprobar el mecanismo de pedido por otra ruta.

## Nota de método

El Tea Board nombra en su navegación las listas de jardines registrados y de
pequeños productores, pero no las sirve en HTML (techo recogido en
`data/csv/in/AGENTS.md`). Mientras no haya otra ruta a ese padrón, los jardines
de Assam hay que enumerarlos de uno en uno desde fuentes propias.
