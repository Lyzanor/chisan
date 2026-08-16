# Candidatos — New York

- CSV destino: `data/csv/us/middle-atlantic/new-york.csv`

## Fuentes estructuradas que funcionan

- **Licencias activas de la State Liquor Authority** — `https://data.ny.gov/resource/9s3h-dpkz.json` (Socrata, sin clave). Filtrar por `description` (`Farm winery`, `Farm Brewer`, `Micro-Brewer`, `Distiller Class D (Farm Distiller)`, `Farm Cidery`, `Farm Meadery`…): ~1.700 licencias de producción con nombre legal, dirección del local, condado, vigencia y `georeference`. Techo: acredita al titular y el local, no la producción actual ni la marca pública; `legalname` es la razón social y hay que resolver la identidad pública aparte.
- **Padrón de socios de la NYS Maple Producers Association** — `https://nysmaple.com/wp-json/wp/v2/maple-producers?per_page=100` (WP REST abierto). 417 fichas con dirección, lat/lon, teléfono, web, redes, líneas de producto y `member_expiration` (señal de vigencia). La fuente más rica del estado.
- **Mapa de socios de la Empire State Honey Producers Association** — el iframe de `https://eshpa.org/buy-local` es un Google My Maps; el KML sale con `https://www.google.com/maps/d/kml?mid=14nSzjiLZDBUdK9tvvtoaoStEvIPZ74E&forcekml=1`. 27 fichas con dirección de recogida, teléfono, email y qué venden. Sin coordenadas útiles en el KML: geocodificar aparte.
- **Geocodificador del US Census Bureau** — `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?benchmark=Public_AR_Current&format=json`. Gratuito y sin clave, resuelve direcciones postales de EE. UU. a nivel de portal. Con `geographies/...&vintage=Current_Current` devuelve además el centroide de la *county subdivision*, que es lo que hace falta para los homónimos de `municipality-overrides.json`.

Fuentes que no sirvieron: `nycheese.org` (NXDOMAIN), el mapa del NYS Cheese Council en `thecheeseclub.com/wp-json/wpgmza/v1/markers` (67 marcadores, casi todos de prueba), `newyorkwines.org/wp-json/wp/v2/winery` (vacío), y el directorio de la NY Cider Association (no publica socios).

## Método de resolución de identidad

El registro de la SLA da razón social, no marca. Para cerrar la identidad: derivar dominios candidatos del nombre, abrirlos, y aceptar solo si el `<title>` lleva una palabra de oficio (*brewing*, *cidery*, *distilling*, *winery*, *vineyard*, *cellars*, *spirits*) **y** comparte un token distintivo con el nombre. Sin la primera condición, `Lake George Distilling` cae en `lakegeorge.com` (guía turística) y `Long Island Spirits` en `longisland.com` (portal). Tasa de acierto ~34% sobre 781 nombres.

Los teléfonos y correos hay que sacarlos de `href="tel:"` y `href="mailto:"`, nunca de un regex sobre el cuerpo: el texto plano devuelve números de plantilla (`+1 333 333 3333`, `2147483647`) y correos de andamiaje (`filler@godaddy.com`, `user@domain.com`, `contact@sansoxygen.com`, `info@ndiscovered.com`, `team@latofonts.com`, `impallari@gmail.com`).

## Trabajo pendiente

- **~120 licencias SLA con web propia confirmada sin integrar** (sobre todo `Cerveza` y `Vino`): quedan fuera del lote de 2026-08-16 por cupo y reparto por condado, no por dudas. Rehacer el barrido con el mismo filtro para recuperarlas.
- **~100 socios de maple con web viva sin integrar**: mismo motivo.
- **Lácteos y quesos**: sigue sin fuente estructurada. `catapanodairyfarm.com` y `remembrancefarm.com` son leads reales pero están tras un muro anti-bot / render JS y no se pudieron leer.
- **Categorías todavía a cero en el estado**: `Carne`, `Setas`, `Té e infusiones`, `Dulces y repostería`, `Frutos secos`, `Legumbres`, `Aperitivos`, `Aceite`.
