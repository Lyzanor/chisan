# Mecklenburg-Vorpommern — cerveza

- **CSV destino** `data/csv/de/norddeutschland/mecklenburg-vorpommern.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-MV`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 31 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

La columna **clase** indica qué tag de OSM trajo el candidato, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 27 (A=14 · B=2 · C=11 · 3 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Albers Brauerei | Crivitz | `craft=brewery` | [albers-brauerei.de](https://www.albers-brauerei.de/) | +49 176 42731779 | unverified |
| Altstadtbrauhaus Zum Stadtkrug | Schwerin | `craft=brewery` | [altstadtbrauhaus.de](https://www.altstadtbrauhaus.de) | — | unverified |
| Brauerei Hennings | Leezen | `craft=brewery` | [brauerei-hennings.de](https://www.brauerei-hennings.de/) | — | unverified |
| Brauerei Wasserschloss Mellenthin | Mellenthin ⚠ | `craft=brewery` | [wasserschloss-mellenthin.de](https://www.wasserschloss-mellenthin.de/) | +49 38379 2878 0 | unverified |
| Braumanufaktur Ludwigslust | Ludwigslust | `craft=brewery` | [lusthopfen.de](https://lusthopfen.de/) | — | unverified |
| Hoppen un Molt | Rostock | `craft=brewery` | — | — | unverified |
| Insel-Brauerei | Rambin | `craft=brewery` | [insel-brauerei.de](https://insel-brauerei.de) | +49 38306 238700 | unverified |
| Marlower Brauerei | Marlow | `craft=brewery` | [marlower-brauerei.de/start.html](https://www.marlower-brauerei.de/start.html) `→ recknitztal-hotel.de` | — | unverified |
| Mecklenburgische Brauerei Lübz GmbH | Lübz ⚠ | `craft=brewery` | [luebzer.de](https://www.luebzer.de/) | — | unverified |
| Original Güstrower Kniesenack e.V. | Güstrow ⚠ | `craft=brewery` | [original-guestrower-kniesenack.de](https://original-guestrower-kniesenack.de/) | +49 1525 6140914 | unverified |
| Stralsunder Brauerei | Stralsund | `craft=brewery` | [stoertebeker-brauquartier.com/brauereifuehrung](https://www.stoertebeker-brauquartier.com/brauereifuehrung) | — | unverified |
| STUUV | Wismar ⚠ | `craft=brewery` | [stuuv-brauerei.de](https://www.stuuv-brauerei.de) | +49 3841 6199085 | unverified |
| Torfkopp | Loitz | `craft=brewery` | [hafendestillerie.de](https://www.hafendestillerie.de) | +49 30 5300 2100 | unverified |
| Trotzenburg | Rostock | `craft=brewery` | [brauerei-trotzenburg.de](https://brauerei-trotzenburg.de/) | +49 381 203600 | unverified |
| Darguner Brauerei GmbH | Dargun ⚠ | `industrial` | [brauerei-dargun.de](https://www.brauerei-dargun.de/) `muerto` | +4939959 301 0 | unverified |
| Hanseatische Brauerei Rostock | Rostock | `industrial` | [rostocker.de](https://rostocker.de/) | +49 381 456450 | unverified |
| Brauhaus | Waren (Müritz) | `microbrewery` | [am-brauhaus.de](https://www.am-brauhaus.de) | — | unverified |
| Brauhaus am Lohberg | Wismar ⚠ | `microbrewery` | [brauhaus-wismar.de](https://www.brauhaus-wismar.de/) | +49 3841 250238 | unverified |
| Brauhaus Stadtkrug | Ueckermünde | `microbrewery` | [hotel-ueckermuende.de/de/brauhaus/brauhaus-stadtkrug](https://www.hotel-ueckermuende.de/de/brauhaus/brauhaus-stadtkrug) | +49 39771 800 | unverified |
| Darßer Brauhaus | Prerow | `microbrewery` | [darsser-brauhaus.de](https://www.darsser-brauhaus.de/) | +49 38233 717757 | unverified |
| Kühlungsborner Braumanufaktur | Kühlungsborn ⚠ | `microbrewery` | — | — | unverified |
| Männerhobby | Mönchhagen | `microbrewery` | [maennerhobby.eu](https://www.maennerhobby.eu/) | — | unverified |
| Räucherhaus | Ahrenshoop | `microbrewery` | [raeucherhaus-ahrenshoop.de](http://www.raeucherhaus-ahrenshoop.de) | +49 38220 6946 | unverified |
| Rumpelstilz Back- und Brauscheune | Steinhagen | `microbrewery` | [rumpelstilz-brauscheune.de](http://www.rumpelstilz-brauscheune.de) `→ rumpelstilze.de` | +49 38327 61334 | unverified |
| Störtebeker Braugasthaus | Stralsund | `microbrewery` | [stoertebeker-brauquartier.com/braugasthaus](https://www.stoertebeker-brauquartier.com/braugasthaus) | +49 3831 25 55 00 | unverified |
| Usedomer Brauhaus | Heringsdorf | `microbrewery` | [seetel.de/hotels-residenzen/residenzen-auf-usedom/ostseeresidenz-heringsdorf/usedomer-brauhaus](https://www.seetel.de/hotels-residenzen/residenzen-auf-usedom/ostseeresidenz-heringsdorf/usedomer-brauhaus/) | +49 38378 61420 | unverified |
| Vielanker Brauhaus | Vielank ⚠ | `microbrewery` | [vielanker.de](https://www.vielanker.de/) | +49 38759 339180 | unverified |

## Residual Wikidata que OSM no trae — 4

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Alte Brauerei Schwerin | Raben Steinfeld | — | unverified |
| Janssen and Bechly Brewery | Neubrandenburg | [Neubrandenburg.de](http://www.Neubrandenburg.de) | unverified |
| Prohner Straße 13 | Kramerhof | — | unverified |
| Wismaria Wismar | Wismar | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
