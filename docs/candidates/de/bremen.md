# Bremen — cerveza

- **CSV destino** `data/csv/de/norddeutschland/bremen.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-HB`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 5 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

Método, trampas y criterio de triaje: `docs/de/cerveza.md`. Columna **clase** = qué tag de OSM lo trajo, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 5 (A=2 · B=1 · C=2)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Freie Brau Union Bremen | Bremen | `craft=brewery` | — | — | unverified |
| Porter & Stout | Bremen | `craft=brewery` | — | — | unverified |
| Brauerei Beck GmbH & Co. KG | Bremen ⚠ | `industrial` | [becks.de](https://becks.de/) | — | unverified |
| Schüttinger Gasthausbrauerei | Bremen | `microbrewery` | [schuettinger.de](https://www.schuettinger.de/) | +49 421 3376633 | unverified |
| Union-Braugasthaus | Bremen | `microbrewery` | [brauerei-bremen.de](https://brauerei-bremen.de/) | +49 421 8982160 | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
