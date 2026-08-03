# Candidatos - heladerias artesanales de Madrid

Origen: hilo de Alfonso C. Suarez en X, revisado el 2026-07-03.

Alcance de esta nota: triage para incorporaciones al CSV de Madrid.

> **Estado 2026-07-03 (claude-agent):** las 9 aceptadas ya están **integradas** en
> `data/csv/madrid/madrid.csv` (categoría `Helados`, `verificado`) con datos completos verificados en
> web oficial/redes + coordenadas geocodificadas (Nominatim). Se creó el ledger de evidencia
> `data/evidence/madrid/madrid.jsonl` (9 registros `keep`). `verify:data` en verde.
> Ajustes sobre lo propuesto: Kalúa se dio de alta como `kalua-helados-madrid-chamberi` (Fuencarral 131
> está en Chamberí) y Dolce Palatino con municipio `Madrid - Fuencarral` (convención del CSV para el
> distrito Fuencarral-El Pardo). `Venta online=sí` (canal `marketplace`, Glovo/Uber Eats/Just Eat) en
> Brando, Kalúa, La Gelateria Italiana y Bibì e Bibò; el resto quedó `no comprobado`.
> Pendientes (10) y descartes siguen abajo para una futura pasada.
>
> **Imágenes (2026-07-03):** 8 de las 9 con logo oficial compuesto (WebP 1600x1200, fondo `#F3F0E8`)
> en `public/productores/madrid/madrid/`. Fuentes: logo de la web oficial (Gelato Lab, Di Angelo,
> La Gelateria, Bibì e Bibò), logo SVG (Kalúa), marca-scoop/favicon (Fré), icono de marca (Calero) y
> wordmark blanco recoloreado a carbón para que sea legible (Brando). Descartados por basura del scorer:
> iconos Instagram/Uber/Glovo (Brando), logos de prensa El País/El Español (Gelato Lab) y tira Kit
> Digital/UE (Calero). **Dolce Palatino queda sin imagen**: sólo tiene Instagram, sin logo web usable.

## Criterio usado

- `aceptar`: la fuente publica declara helado artesanal/casero y tambien produccion propia, obrador propio, elaboracion diaria o elaboracion en el establecimiento.
- `pendiente`: hay senal de artesanal, pero falta una prueba clara de obrador propio/elaboracion propia o la fuente es solo social/tercero.
- `ya presente`: ya existe en el CSV provincial.
- Categoria sugerida para las aceptadas: `Helados`.
- `Venta online`: dejar `no comprobado` salvo que se verifiquen enlaces oficiales vivos de tienda, delivery o marketplace en el pase de alta.

Duplicado rapido contra CSV: de la lista inicial solo aparece `sani-sapori-madrid-centro`.

## Aceptadas para pase de alta — ✅ INTEGRADAS 2026-07-03

| Estado | Nombre | Slug sugerido | Municipio sugerido | Datos basicos | Prueba de artesania y obrador/elaboracion | Venta online |
| --- | --- | --- | --- | --- | --- | --- |
| aceptar | Gelato Lab | `gelato-lab-madrid-centro` | Madrid - Centro | Mercado de la Cebada, puestos 173/174/175/176, planta alta, 28005 Madrid. Tel. 616 294 325. `info@gelatolab.es`. Producto: gelato artesanal, sorbetes y helados de temporada. | Web oficial: "100% artesanal" y "propio obrador"; tambien declara elaboracion diaria en obrador. Fuente: https://gelatolab.es/ | no comprobado |
| aceptar | Fre Lebanese Ice Cream | `fre-lebanese-ice-cream-madrid-moncloa` | Madrid - Moncloa-Aravaca | Calle Arcipreste de Hita 14, 28015 Madrid. Producto: helado libanes artesanal, ashta, pistacho y especialidades libanesas. | Web oficial: helados y productos artesanales libaneses elaborados en obrador propio en Madrid. Fuente: https://freicecream.com/ | no comprobado |
| aceptar | Brando Helado | `brando-helado-madrid-centro` | Madrid - Centro | Calle de Hortaleza 55, 28004 Madrid. Tambien Plaza Colon 8, Majadahonda. Producto: helados artesanales, polos, chocolates y granizados. | Web oficial: "En nuestro propio obrador se crea el 100% de los productos". Fuente: https://www.brandohelado.com/ | revisar; web oficial enlaza delivery |
| aceptar | Di Angelo Gelateria | `di-angelo-gelateria-madrid-arganzuela` | Madrid - Arganzuela | Paseo de Yeserias 41, 28005 Madrid. Tel. 918 709 903. Producto: helado italiano artesanal. | Web oficial: helado artesanal de produccion diaria y elaboracion en obrador de forma artesanal. Fuente: https://www.diangelogelateria.com/ | no comprobado |
| aceptar | Kalua Helados | `kalua-helados-madrid-fuencarral` | Madrid - Chamberi | Calle Fuencarral 131, 28010 Madrid; tambien zona Retiro/Ibiza. Tel. Fuencarral 910 188 257. Producto: helado artesanal, mousses y granizados. | Web oficial: helado artesanal Malaga & Madrid, "9 obradores artesanales"; pagina corporativa indica productos elaborados en sus establecimientos. Fuente: https://kaluahelados.com/ | revisar; web oficial muestra pedido/delivery |
| aceptar | La Gelateria Italiana | `la-gelateria-italiana-madrid-chamberi` | Madrid - Chamberi | Calle Rios Rosas 54, 28003 Madrid; tambien Plaza Republica Dominicana 6, 28016 Madrid. Tel. 680 511 561. Producto: gelato artesano italiano. | Web oficial publicada en Lovable: "producimos en pequenas tandas" y "hecho cada dia". Fuente: https://lagelateriaitaliana.lovable.app/ | revisar; aparece delivery en fuentes publicas |
| aceptar | Helados Artesanales Calero | `helados-artesanales-calero-madrid-ciudad-lineal` | Madrid - Ciudad Lineal | Calle Virgen de Nuria 19, Ciudad Lineal, Madrid. Tel. 671 215 237. Producto: helados artesanales y tarrinas. | Web oficial: proyecto local "hecho en nuestro propio obrador". Fuente: https://heladoscalero.es/ | no comprobado |
| aceptar | Dolce Palatino | `dolce-palatino-madrid-las-tablas` | Madrid - Fuencarral-El Pardo | Calle de Palas de Rey 22, 28050 Madrid. Tel. 917 556 104. `palatinodolce326@gmail.com`. Producto: helados artesanales, crepes, gofres y batidos. | Todo Esta En Madrid: "heladeria artesanal, de produccion propia". Fuente: https://todoestaenmadrid.com/es/shops/dolce-palatino | no comprobado |
| aceptar | Bibi e Bibo | `bibi-e-bibo-madrid-chamartin` | Madrid - Chamartin | Calle Joaquin Bau 1, 28036 Madrid; tambien Principe de Vergara 266, Lopez de Hoyos 152, Pio XII 4, Alcala 144 y Majadahonda. `gelato@bibiebibo.es`. Producto: helados italianos artesanales, paninos, tiramisu y panna cotta. | Web oficial: "Elaboramos diariamente nuestros productos, en nuestro obrador, de forma artesanal". Fuente: https://bibiebibo.es/ | revisar; web oficial ofrece compra online/delivery |

## Ya presente en el CSV

| Estado | Nombre | Slug actual | Nota |
| --- | --- | --- | --- |
| ya presente | Sani Sapori | `sani-sapori-madrid-centro` | Ya figura en `data/csv/madrid/madrid.csv`. Web oficial declara helados artesanos italianos y produccion en obrador. Fuente: https://www.sanisapori.es/ |

## Pendientes por falta de prueba suficiente

Estas pueden ser buenas candidatas, pero no conviene meterlas todavia si mantenemos el filtro estricto de obrador propio o elaboracion propia.

| Estado | Nombre | Datos localizados | Motivo de bloqueo |
| --- | --- | --- | --- |
| pendiente | La Dolce Fina | Calle Villanueva 31, 28001 Madrid; tambien Santa Engracia 101, San Andres 16, Plaza de Cascorro 20 y Alcobendas. Fuente: https://ladolcefina.es/ | La web declara heladeria artesanal y que sus helados se elaboran con ingredientes locales, pero no encontre declaracion literal de obrador propio. |
| pendiente | Maison Glacee | Calle Mayor 77, Calle Alcala 77 y Calle Ibiza 42. Fuente: https://www.maisonglacee.com/ | La web declara helados hechos desde cero y cucuruchos hechos cada manana, pero falta prueba explicita de obrador propio. |
| pendiente | Helados Patagonia Artesanal | Plaza Tirso de Molina 19, 28012 Madrid. Fuente: https://patagoniaartesanal.com/ | Web oficial declara helados artesanos y proceso de elaboracion artesanal, pero no aparece obrador propio de forma clara. |
| pendiente | Heladeria Tozzi | Calle General Ricardos 62. Fuente secundaria: https://www.esmadrid.com/compras/heladeria-tozzi | Hay senal de helados caseros/artesanales desde 1990, pero falta fuente oficial o prueba clara de obrador propio para el local de Madrid. |
| pendiente | Heladeria Cuore | Calle Ginzo de Limia 56. Fuente localizada: https://heladeriacuore.es/ | La web quedo bloqueada por Cloudflare en la comprobacion y solo se pudo ver senal de artesanal en snippets/Instagram; falta obrador propio. |
| pendiente | D'VIS Heladeria Artesana | Zona Madrid, fuente social localizada. | Solo hay senal social de heladeria artesanal; falta web/fuente estable y obrador propio. |
| pendiente | FANATICA Heladeria Artesanal | Zona centro de Madrid, fuentes sociales y delivery. | Hay senal de gelato artesanal, pero no fuente estable con produccion propia u obrador. |
| pendiente | Ragazzi Gelato | Calle Santa Isabel 7. Fuente secundaria: https://www.esmadrid.com/compras/ragazzi | Fuentes sociales/terceros apuntan a artesanal, pero no hay prueba clara de obrador propio. |
| pendiente | Porteno Heladeria | Plaza de la Remonta 2B segun fuentes de terceros; tambien aparece vinculada a Porteno Pizza Bar. | La identidad/localizacion queda algo ambigua y no hay prueba clara de obrador propio. |
| pendiente | Labonata Heladeria | Fuentes de terceros, sin web oficial clara localizada. | No hay fuente estable suficiente ni prueba de obrador propio. |

## Probablemente fuera de alcance salvo nueva evidencia

| Estado | Nombre | Datos localizados | Motivo |
| --- | --- | --- | --- |
| pendiente / posible descarte | Heladeria Moustache | Calle de Atocha 4. Fuente: https://www.glaces-moustache.fr/glaciers/moustache-madrid-artisan-glacier/ | La fuente confirma heladeria artesanal francesa, pero no obrador propio/local en Madrid; la matriz aparece en Saint-Malo. |
| pendiente / posible descarte | Gelateria La Romana dal 1947 | Varios locales en Madrid. Fuente: https://www.gelateriaromana.com/47-ice-cream-shop-madrid.php | Cadena internacional; falta prueba de produccion propia/local para Madrid. |
| pendiente / posible descarte | Ferruccio Gelato Montecarmelo | Calle Monasterio de Liebana 5-7, Montecarmelo, segun fuentes de terceros/sociales. | No hay prueba de obrador propio; las fuentes publicas sugieren posible venta de producto de otro obrador. |

## Siguiente pase antes de CSV

1. Verificar coordenadas y barrio/municipio exactos de cada aceptada.
2. Elegir una unica sede principal cuando haya varios locales y dejar otros locales en `notas` si procede.
3. Confirmar `Venta online` solo con enlaces oficiales vivos; si no, usar `no comprobado`.
4. Crear evidencia JSONL por cada alta con el reclamo de artesania/obrador y contacto/localizacion.
5. Rehacer deduplicacion por slug/nombre antes de editar el CSV.
