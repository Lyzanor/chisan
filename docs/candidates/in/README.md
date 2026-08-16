# Candidatos — India

Solo métodos reutilizables. El estado por área vive en `<area>.md`.

## Lo que funciona

- **Sitio propio + `/products.json`.** Muchos productores indios venden en
  Shopify. `GET <dominio>/products.json?limit=3` devuelve el catálogo con
  precios y zanja en una petición si la tienda está viva; un 404 o un HTML
  significa que no es Shopify, no que no venda.
- **Texto plano de la home.** La página de contacto suele publicar la oficina
  corporativa (Kolkata para el té, Delhi para el vino). La unidad productiva
  aparece antes en el relato de la home o del «about»: extrae el texto y busca
  el topónimo ahí.
- **OpenStreetMap para la ciudad, no para el campo.** El nodo propio del
  productor existe para cervecerías urbanas y poco más. Cuando existe, es la
  única coordenada exacta que vas a conseguir.

## Lo que no funciona

- **Nominatim con dirección india.** Ni una dirección con PIN ni un `Gat`
  resolvieron; solo dos nombres comerciales de todo un lote devolvieron el POI
  del productor. Cae al centroide municipal y dilo en la evidencia.
- **Overpass como padrón.** Un barrido de toda la India por `craft=*` y
  `shop=farm` sale dominado por dulcerías, molinos y tiendas de licor del
  monopolio estatal; menos del 5 % lleva web. Sirve para localizar, no para
  enumerar.
- **Portales oficiales renderizados en JS.** Los directorios de APEDA y las
  listas del Tea Board no están en el HTML servido. Techos en
  `data/csv/in/AGENTS.md`.

## Trampas de identidad

- Marca ≠ jardín. Una marca de té puede vender hoja de varios jardines; la fila
  es la unidad productiva, no la etiqueta.
- Un *taproom* no es la fábrica. Las cadenas cerveceras publican los locales y
  callan dónde elaboran: no conviertas una lista de locales en filas.
- El distrito repite el nombre de su capital. Comprueba cuál de los dos publica
  el productor antes de escribir `municipio`.
