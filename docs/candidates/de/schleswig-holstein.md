# Schleswig-Holstein — cerveza

- **CSV destino** `data/csv/de/norddeutschland/schleswig-holstein.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-SH`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 34 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

La columna **clase** indica qué tag de OSM trajo el candidato, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 31 (A=17 · B=2 · C=12 · 1 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Baltic Brewery | Flensburg | `craft=brewery` | [balticbrewery.com](https://www.balticbrewery.com/) | — | unverified |
| Biar-Brauhüs | Borgsum | `craft=brewery` | [biar-brauhues.de](https://www.biar-brauhues.de/) | +49 4683 9890107 | unverified |
| Bräuhuus Grömitz | Grömitz | `craft=brewery` | [braeuhuus.de/groemitz](https://www.braeuhuus.de/groemitz/) | +49 4562 5676 | unverified |
| Czernys Küstenbrauerei | Heikendorf ⚠ | `craft=brewery` | [czernys-kuestenbrauerei.de](https://czernys-kuestenbrauerei.de/) | — | unverified |
| Dithmarscher Privatbrauerei Karl Hintz | Marne | `craft=brewery` | [dithmarscher.de](https://www.dithmarscher.de/) | +49 4851 9620 | unverified |
| Ebbüller Brauhaus | Emmelsbüll-Horsbüll | `craft=brewery` | [ebbueller.de](https://www.ebbueller.de/) | +49 4665 2323296 | unverified |
| Grönwohlder Hausbrauerei | Grönwohld | `craft=brewery` | [groenwohlder.de](https://www.groenwohlder.de) | — | unverified |
| Kleiner Kobel | Kiel | `craft=brewery` | [kleiner-kobel.de](https://kleiner-kobel.de/) | +49 431 12829349 | unverified |
| Klüvers Brauhaus | Neustadt in Holstein | `craft=brewery` | — | — | unverified |
| KNUST-Braumanufaktur | Fehmarn | `craft=brewery` | [knustbier.de](https://knustbier.de/) | +49 4371 864605 | unverified |
| Lillebräu | Kiel | `craft=brewery` | [lillebraeu.de](https://lillebraeu.de/) | +49 431 90889784 | unverified |
| Simian Ales | Elmshorn | `craft=brewery` | [simian-ales.com](https://simian-ales.com/) | — | unverified |
| Sudden Death Brewing Company | Lübeck ⚠ | `craft=brewery` | — | — | unverified |
| Südtondern Brauerei | Niebüll ⚠ | `craft=brewery` | — | — | unverified |
| Wacken Brauerei GmbH & Co KG | Wacken | `craft=brewery` | [wacken.beer](https://www.wacken.beer) | +49 4827 9969810 | unverified |
| Weltbrauerei Schörderup | Stoltebüll | `craft=brewery` | [weltbrauerei.de](https://www.weltbrauerei.de/) | +49 160 5458702 | unverified |
| Wittorfer Brauerei | Neumünster | `craft=brewery` | [wittorfer-Brauerei.de](http://www.wittorfer-Brauerei.de) | — | unverified |
| Flensburger Brauerei Emil Petersen GmbH und Co. KG | Flensburg ⚠ | `industrial` | — | — | unverified |
| House of Superfreunde | Norderstedt | `industrial` | [house-of-superfreunde.com](https://www.house-of-superfreunde.com) | +49 40 35731171 | unverified |
| Brauberger | Lübeck | `microbrewery` | [brauberger.de](https://www.brauberger.de) | +4945171444 | unverified |
| Brauhaus Eutin | Eutin | `microbrewery` | [brauhaus-eutin.de](https://www.brauhaus-eutin.de/) | +49 4521 766777 | unverified |
| Hansens Brauerei | Flensburg | `microbrewery` | [hansensbrauerei.de](https://hansensbrauerei.de) `muerto` | +49 461 22210 | unverified |
| Hopfenliebe Brauhaus | Norderstedt | `microbrewery` | — | — | unverified |
| Husums Brauhaus | Husum | `microbrewery` | [husums-brauhaus.de](https://www.husums-brauhaus.de/) | +49 4841 89660 | unverified |
| Kieler Brauerei | Kiel ⚠ | `microbrewery` | — | +49 431 906290 | unverified |
| Kirschenholz | Schillsdorf | `microbrewery` | — | — | unverified |
| Luzifer | Schleswig | `microbrewery` | [luzifer89.de/schleswig](https://www.luzifer89.de/schleswig/) | +49 4621 488213 | unverified |
| Marktwirtschaft | Glücksburg | `microbrewery` | [marktwirtschaft-lykke.de](https://www.marktwirtschaft-lykke.de/) | +49 4631 4443960 | unverified |
| Ricklinger Landbrauerei "Zur Alten Försterei" | Rickling ⚠ | `microbrewery` | [ricklinger-landbrauerei.de](https://www.ricklinger-landbrauerei.de/) | — | unverified |
| Saloniki | Büsum | `microbrewery` | [facebook.com/Saloniki.in.Busum/?locale=de_DE](https://www.facebook.com/Saloniki.in.Busum/?locale=de_DE) | +49 4834 964802 | unverified |
| Sudden Death Brewpub | Lübeck | `microbrewery` | [suddendeathbrewing.de](https://suddendeathbrewing.de/) | — | unverified |

## Residual Wikidata que OSM no trae — 3

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Brauerei Zur Eiche (Kiel) | Kiel | — | unverified |
| Hohle Gasse 14 | Bredstedt | — | unverified |
| Holsten-Brauerei Kiel | Kiel | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
