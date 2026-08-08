# Saarland — cerveza

- **CSV destino** `data/csv/de/westdeutschland/saarland.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-SL`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 12 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

La columna **clase** indica qué tag de OSM trajo el candidato, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 11 (A=7 · B=2 · C=2 · 4 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Brauerei Bruch | Saarbrücken | `craft=brewery` | [bruchbier.de](https://bruchbier.de/) `→ bruch-bier.de` | +49 681 936360 | unverified |
| IGBier Privatbrauerei | St. Ingbert ⚠ | `craft=brewery` | [igbier.de](https://igbier.de/) | +4915129018300 | unverified |
| Mettlacher Abtei-Bräu | Mettlach | `craft=brewery` | [abtei-brauerei.de](https://www.abtei-brauerei.de/) | +49 6864 93232 | unverified |
| Saarfürst Merziger Brauhaus | Merzig | `craft=brewery` | [saarfuerst.de](https://www.saarfuerst.de) `→ merzigerbrauhaus.de` | +49 6861 791635 | unverified |
| Stumm's Brauhaus | Neunkirchen | `craft=brewery` | [stumms-brauhaus.de](https://www.stumms-brauhaus.de/) | +496821 179145 | unverified |
| Tiny Brew | Kleinblittersdorf ⚠ | `craft=brewery` | [tiny-brew.com](https://www.tiny-brew.com) | — | unverified |
| Walsheimer Sudhaus | Walsheim | `craft=brewery` | [walsheimbier.de](https://walsheimbier.de/) | +49 6843 901744 | unverified |
| Brauerei Bruch | Neunkirchen | `industrial` | — | — | unverified |
| Karlsberg Brauerei | Homburg ⚠ | `industrial` | — | — | unverified |
| Brauhaus zum Stiefel | Saarbrücken | `microbrewery` | [brauhaus-zum-stiefel.de](https://brauhaus-zum-stiefel.de/) `403` | +49 681 30984650 | unverified |
| Herz & Heimat Braustüberl | St. Ingbert ⚠ | `microbrewery` | [herzundheimat.com/craft_bier_braustube_saarland.html](https://www.herzundheimat.com/craft_bier_braustube_saarland.html) `404` | — | unverified |

## Residual Wikidata que OSM no trae — 1

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Brauerei Paqué | St. Wendel | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
