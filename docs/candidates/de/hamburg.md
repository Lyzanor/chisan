# Hamburg — cerveza

- **CSV destino** `data/csv/de/norddeutschland/hamburg.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-HH`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 13 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

La columna **clase** indica qué tag de OSM trajo el candidato, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 13 (A=6 · B=1 · C=6 · 2 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Bill Brew | Oststeinbek ⚠ | `craft=brewery` | — | — | unverified |
| Buddelship Brauerei | Hamburg | `craft=brewery` | [buddelship.de](https://www.buddelship.de/) | +49 40 54809800 | unverified |
| Kehrwieder Kreativbrauerei | Eddelsen ⚠ | `craft=brewery` | [kehrwieder.beer](https://www.kehrwieder.beer/) | +49 40 47190747 | unverified |
| Landgang Brauerei | Hamburg | `craft=brewery` | [landgang-brauerei.de](https://www.landgang-brauerei.de) | — | unverified |
| Ratsherrn Brauerei | Hamburg | `craft=brewery` | [ratsherrn.de](https://www.ratsherrn.de/) | +49 40 38072892-0 | unverified |
| Wildwuchs Brauwerk | Hamburg | `craft=brewery` | [wildwuchs-brauwerk.de](https://www.wildwuchs-brauwerk.de/) | +49 40 33492366 | unverified |
| Holsten-Brauerei | Neugraben ⚠ | `industrial` | — | — | unverified |
| Altes Mädchen | Hamburg | `microbrewery` | [altes-maedchen.com/de](https://altes-maedchen.com/de/) | +49 40 800077750 | unverified |
| Blockbräu | Hamburg | `microbrewery` | [block-braeu.de](https://www.block-braeu.de/) | +49 40 44405000 | unverified |
| Der Stackmeister | Karoxbostel ⚠ | `microbrewery` | [elbepark-bunthaus.de/restaurant-der-stackmeister.html](https://www.elbepark-bunthaus.de/restaurant-der-stackmeister.html) `404` | — | unverified |
| Gröninger Braukeller | Hamburg | `microbrewery` | [groeninger-hamburg.de](https://www.groeninger-hamburg.de) | +49 40 570105100 | unverified |
| Ratsherrn Store Schanze | Hamburg | `microbrewery` | [shop.ratsherrn.de](https://shop.ratsherrn.de/) `→ ratsherrn.shop` | +49 40 38072892-0 | unverified |
| ÜberQuell | Hamburg ⚠ | `microbrewery` | — | +49 40 334421260 | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
