# Sachsen-Anhalt — cerveza

- **CSV destino** `data/csv/de/ostdeutschland/sachsen-anhalt.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-ST`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 31 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

La columna **clase** indica qué tag de OSM trajo el candidato, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 27 (A=16 · B=3 · C=8 · 4 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Asche Bräu | Aschersleben | `craft=brewery` | [asche-braeu.jimdofree.com](https://asche-braeu.jimdofree.com/) | — | unverified |
| Bierfreunde Craftbeer | Magdeburg | `craft=brewery` | [bierfreundecraftbeer.de](https://www.bierfreundecraftbeer.de) `muerto` | — | unverified |
| Bitterfelder Brauerei | Bitterfeld-Wolfen | `craft=brewery` | [bitterfelder-bier.de](https://www.bitterfelder-bier.de) `→ bitterfelder-bier.de` | — | unverified |
| Brauerei Zahna | Zahna-Elster | `craft=brewery` | [zahnaer-mineralbrunnen.de](http://www.zahnaer-mineralbrunnen.de/) | +49 34924 20247 | unverified |
| Brauhaus Lüdde | Quedlinburg | `craft=brewery` | [hotel-brauhaus-luedde.de](https://www.hotel-brauhaus-luedde.de) | +49 3946 705206 | unverified |
| BrauSerei | Gommern | `craft=brewery` | [brauserei-gommern.de](https://www.brauserei-gommern.de/) | — | unverified |
| BrauSerei Gommern | Gommern | `craft=brewery` | [brauserei-gommern.de](https://brauserei-gommern.de/) | +49 391 99032710 | unverified |
| ehem. Brauhaus zum Pelikan | Halle (Saale) | `craft=brewery` | [schwemme.org](https://schwemme.org/) | — | unverified |
| Garley | Gardelegen | `craft=brewery` | [gardelegener-bier.de](https://www.gardelegener-bier.de/) | +49 3907 7777344 | unverified |
| Handwerksbrauerei Schütte | Hohe Börde | `craft=brewery` | — | — | unverified |
| Magdeburger Getränkekombinat (Sudenburger Brauhaus) | Magdeburg | `craft=brewery` | [sudenburger-brauhaus.de](https://www.sudenburger-brauhaus.de/) | — | unverified |
| Microbrauerei Lindenberger Bahnhofsbräu | Harzgerode | `craft=brewery` | — | — | unverified |
| Museums- und Traditionsbrauerei Wippra | Sangerhausen | `craft=brewery` | [wippra-bier.de](https://www.wippra-bier.de/) `→ wippraer-bier.de` | +49 34775 20205 | unverified |
| Schlossbrauerei | Haldensleben | `craft=brewery` | [schlossbrauerei-hundisburg.de](https://www.schlossbrauerei-hundisburg.de) `muerto` | +49 3904 44265 | unverified |
| Schulzens Brauerei | Tangermünde | `craft=brewery` | [schulzens.info/brauerei](https://www.schulzens.info/brauerei/) | +49 39322 44145 | unverified |
| Spezialitäten Brau- & Brennerei Eckart | Colbitz | `craft=brewery` | [brauerei-eckart.de](https://www.brauerei-eckart.de/) | +49 39207 95420 | unverified |
| Brauerei Landsberg GmbH | Landsberg | `industrial` | — | — | unverified |
| Colbitzer Heidebrauerei | Colbitz | `industrial` | — | — | unverified |
| Hasseröder Brauerei | Wernigerode | `industrial` | [hasseroeder.de](https://www.hasseroeder.de/) | — | unverified |
| Brauhaus Brewckau | Magdeburg | `microbrewery` | [brewckau.de](https://www.brewckau.de) | +49 391 40821949 | unverified |
| Brauhaus Heine Bräu | Halberstadt | `microbrewery` | [hotel-heine.de/gastronomie/brauerei](https://www.hotel-heine.de/gastronomie/brauerei/) | — | unverified |
| Brauhaus Köthen | Köthen (Anhalt) | `microbrewery` | [brauhauskoethen.de](https://www.brauhauskoethen.de/) | +49 3496 3099490 | unverified |
| Gasthof Mühlenbergbrauerei | Schollene ⚠ | `microbrewery` | [elbe-havel-brauerei.de](https://www.elbe-havel-brauerei.de/) | +49 39389 969960 | unverified |
| Hallesches Brauhaus | Halle (Saale) | `microbrewery` | [halleschesbrauhaus.de](https://www.halleschesbrauhaus.de) | +49 345 212570 | unverified |
| Hotel Seeblick | Klietz | `microbrewery` | [seeblick-klietz.de](https://www.seeblick-klietz.de/) | +49 39327 93500 | unverified |
| Neindorfer Krug | Oschersleben | `microbrewery` | [neindorfer-krug.de](https://neindorfer-krug.de) | +49 3949 501535 | unverified |
| Schulzens Elbgarten | Tangermünde | `microbrewery` | [schulzens.info/elbgarten](https://www.schulzens.info/elbgarten/) | +49 39322 44145 | unverified |

## Residual Wikidata que OSM no trae — 4

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Bergschloß-Brauerei Haldensleben | Haldensleben | — | unverified |
| Brauerei Kelbra | Kelbra | — | unverified |
| Freyberg Brauerei | Halle (Saale) | — | unverified |
| Hansa-Brauerei | Wahrburg | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
