# Argentina — métodos de descubrimiento

Guía de métodos reutilizables. El estado de cada área vive en su fichero; las
reglas y los techos de fuente duraderos, en `data/csv/ar/AGENTS.md`.

## Qué funciona

- **Directorio de socios de Bodegas de Argentina**
  (`https://bodegasdeargentina.org/socios-bodegas-de-argentina/`): la lista
  nominal de bodegas más amplia que publica el país, entera en una sola página
  HTML servida por el servidor. Cada ficha es un `div.row data-socio` con `h2`
  para el nombre y un `ul` con dirección, provincia, teléfono, web y correo, así
  que se parsea sin navegador. Triar antes de nada: mezcla proveedores
  (bancos, corcho, vidrio, personal, seguros) con bodegas.
- **Georef, la API oficial de datos.gob.ar**
  (`https://apis.datos.gob.ar/georef/api/`): resuelve provincia, departamento,
  municipio y localidad con centroide, sin clave y sin coste. Sirve para
  comprobar que una localidad existe y a qué departamento pertenece antes de
  escribirla en `municipio`. `max` está limitado a 5.000 por petición.
- **Nominatim por nombre comercial**: resuelve muchas bodegas argentinas
  directamente. Hay que leer el `display_name` que devuelve, no solo la
  distancia: hace *fuzzy match* silencioso.

## Qué no funciona

- El portal nacional de datos abiertos publica el registro del INV y el RENAPA
  agregados por departamento: cuentas, nunca nombres.
- `alimentosargentinos.magyp.gob.ar`, que resume las IG y DO argentinas,
  responde 403 a una petición con `curl` o `WebFetch`.
- El consejo de la DO Salame de Tandil (`salamedetandildo.org.ar`) es un
  folleto de tres páginas con el certificado caducado y no nombra a ningún
  productor.
- Las webs de bebidas suelen montar una pasarela de edad y renderizarse en
  cliente: una petición plana devuelve el intersticial y ni dirección ni
  contacto. No es un sitio muerto ni una tienda ausente.

## Sin explorar

Ninguna categoría que no sea vino tiene todavía una fuente acotada. Los frentes
abiertos son la yerba mate y el té del Nordeste, el olivo de Cuyo, La Rioja y
Catamarca, los quesos y chacinados de la Pampeana, y la fruta fina y la
cerveza del Alto Valle y la comarca andina.
