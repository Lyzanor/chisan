# Argentina — métodos de descubrimiento

Guía de métodos reutilizables. El estado de cada área vive en su fichero; las
reglas y los techos de fuente duraderos, en `data/csv/ar/AGENTS.md`.

## Qué funciona

- **Guía de expositores de Caminos y Sabores**, la feria nacional de productores
  (`caminosysabores.com.ar`, PDF anual bajo `wp-content/uploads/<año>/07/`): la
  fuente nominal más ancha del país. Cada ficha trae nombre, dirección, ciudad,
  provincia, teléfono, correo, web, Facebook, Instagram y rubros, así que sale
  una fila casi entera sin salir del PDF. Se parsea por bloques: el nombre es
  una tirada de líneas en mayúsculas terminada opcionalmente en `/ <stand>`, el
  resto es la ficha hasta `Rubros:`. Los pabellones provinciales listan
  **co-expositores** sin código de stand y con su ciudad real: son el grueso de
  las provincias chicas. Tres ediciones (2024, 2025, 2026) dan ~1.030 fichas
  únicas. Su techo está en las provincias que no van a la feria.
- **Directorio de socios de Bodegas de Argentina**
  (`https://bodegasdeargentina.org/socios-bodegas-de-argentina/`): ~200 fichas en
  una sola página HTML. Triar antes de nada: mezcla proveedores (bancos, corcho,
  vidrio, personal, seguros) con bodegas.
- **Padrones provinciales de vino**, cuando existen, son mejores que cualquier
  guía turística porque publican domicilio y contacto: el Museo de la Vid y el
  Vino de Salta (34 bodegas de la Ruta del Vino), el Ente Autárquico Tucumán
  Turismo (Ruta del Vino de Altura) y Turismo de La Rioja (`/verbodegas/`).
- **Georef, la API oficial de datos.gob.ar**
  (`https://apis.datos.gob.ar/georef/api/`): resuelve provincia, departamento,
  municipio y localidad con centroide, sin clave y sin coste. Sirve para
  comprobar que una localidad existe y a qué departamento pertenece antes de
  escribirla en `municipio`. `max` está limitado a 5.000 por petición.
- **Nominatim por dirección postal**: con `direccion, localidad, provincia,
  Argentina` acierta el punto exacto en ~1 de cada 3 fichas. Hay que leer el
  `display_name` y la distancia al centroide, no solo la distancia: hace *fuzzy
  match* silencioso.

## Qué no funciona

- **Overpass**: los dos mirrors grandes (`overpass-api.de`, `kumi.systems`)
  cortan la IP compartida de este entorno tras unas pocas consultas y el resto
  (`monicz.dev`, `private.coffee`, `openstreetmap.ru`) tarda más de 60 s en una
  provincia. No es una vía fiable para barrer el país.
- **Nominatim como descubridor por categoría**: `q=cerveceria` acotado a una
  provincia devuelve 0. Solo casa nombres, no tipos de negocio.
- El portal nacional de datos abiertos publica el registro del INV y el RENAPA
  agregados por departamento: cuentas, nunca nombres.
- `alimentosargentinos.magyp.gob.ar` responde 403 también a `curl` con
  cabeceras de navegador.
- Los **seleccionados del programa Alimentos con Valor** (`argentina.gob.ar`)
  son solicitudes a un programa de formación: varias entradas son «idea
  proyecto» y ninguna trae domicilio ni contacto. No pasan la puerta de
  candidatos.
- El listado de socios de Somos Cerveceros está tras un formulario de acceso.
- Las webs de bebidas suelen montar una pasarela de edad y renderizarse en
  cliente: una petición plana devuelve el intersticial y ni dirección ni
  contacto. No es un sitio muerto ni una tienda ausente.

## Sin explorar

Chaco, Formosa y Santa Cruz no van a Caminos y Sabores y no se les ha
encontrado padrón propio: son las tres áreas sin material. Los frentes abiertos
por categoría son la yerba mate y el té del Nordeste, el olivo de La Rioja y
Catamarca, los quesos y chacinados de la Pampeana, y la fruta fina y la cerveza
del Alto Valle y la comarca andina.
