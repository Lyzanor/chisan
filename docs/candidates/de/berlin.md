# Berlin — cerveza

- **CSV destino** `data/csv/de/ostdeutschland/berlin.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-BE`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 45 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

Método, trampas y criterio de triaje: `docs/de/cerveza.md`. Columna **clase** = qué tag de OSM lo trajo, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 40 (A=16 · B=2 · C=22 · 10 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Brauerei Flessa | Berlin | `craft=brewery` | [brauerei-flessa.de](https://www.brauerei-flessa.de/) | +49 30 23409269 | unverified |
| Braufreunde Berlin | Berlin | `craft=brewery` | — | — | unverified |
| BrewDog | Berlin | `craft=brewery` | [brewdog.com](https://www.brewdog.com/) | +49 30 212343100 | unverified |
| Brewer’s Tribute Brauerei | Ahrensfelde ⚠ | `craft=brewery` | — | — | unverified |
| Craftzentrum Berlin | Berlin | `craft=brewery` | [craftzentrum.berlin](http://craftzentrum.berlin/) `muerto` | — | unverified |
| Einbar Brauerei | Berlin | `craft=brewery` | [einbarbrauerei.com](https://einbarbrauerei.com/) `muerto` | — | unverified |
| FUERST WIACEK | Berlin | `craft=brewery` | [fuerstwiacek.com](https://www.fuerstwiacek.com/) `403` | — | unverified |
| Heidenpeters | Berlin | `craft=brewery` | [heidenpeters.de](https://www.heidenpeters.de) | — | unverified |
| Heinecken | Berlin ⚠ | `craft=brewery` | [heinekendeutschland.de](https://www.heinekendeutschland.de/) | +49 30 3904150 | unverified |
| Holzmarkt Brauerei | Berlin | `craft=brewery` | [brauerei.holzmarkt.com](https://brauerei.holzmarkt.com/) `muerto` | — | unverified |
| Hops & Barley | Berlin | `craft=brewery` | [hopsandbarley-berlin.de](http://hopsandbarley-berlin.de/) `→ hops-and-barley-berlin.de` | +49 3029367534 | unverified |
| Hops & Barley Brauerei | Ahrensfelde ⚠ | `craft=brewery` | — | — | unverified |
| KulchaBox | Berlin | `craft=brewery` | [thekulchaboxstore.com](https://thekulchaboxstore.com/) `→ magucha.shop` | +49 176 78115332 | unverified |
| Leikheim | Berlin ⚠ | `craft=brewery` | — | — | unverified |
| Lichtenrader Brauhaus | Berlin | `craft=brewery` | [lichtenrader-revier.berlin/landhaus](https://lichtenrader-revier.berlin/landhaus/) | — | unverified |
| Rollberg | Berlin | `craft=brewery` | [rollberger.de](https://www.rollberger.de/) | — | unverified |
| Berliner-Kindl-Schultheiss-Brauerei | Berlin ⚠ | `industrial` | [schultheiss.de](https://www.schultheiss.de/) | +49 30 96090 | unverified |
| Brauerei Berliner Berg | Berlin | `industrial` | [berlinerberg.com](https://berlinerberg.com/) | +49 30 64435906 | unverified |
| Biermeisterei by Lemke Berlin | Berlin | `microbrewery` | [biermeisterei.lemke.berlin](https://biermeisterei.lemke.berlin/) | — | unverified |
| Brauhaus Georgbräu | Berlin | `microbrewery` | [georgbraeu.de](http://www.georgbraeu.de) | +49 30 2424244 | unverified |
| Brauhaus neulich | Berlin | `microbrewery` | [brauhaus-neulich.de](https://www.brauhaus-neulich.de) `403` | +49 30 47057790 | unverified |
| Brauhaus Spandau | Berlin | `microbrewery` | [brauhaus-spandau.de](https://www.brauhaus-spandau.de/) | +49 30 3539070 | unverified |
| BrewDog DogTap Berlin | Berlin | `microbrewery` | [brewdog.com/bars/global/dogtap-berlin](https://www.brewdog.com/bars/global/dogtap-berlin/) `404` | — | unverified |
| Brło Brwhouse | Berlin | `microbrewery` | [brlo.de](https://www.brlo.de/) | — | unverified |
| Brło-Biergarten | Berlin | `microbrewery` | [brlo.de/gastronomien/brlo-biergarten](https://www.brlo.de/gastronomien/brlo-biergarten) | — | unverified |
| Das Lemke | Berlin | `microbrewery` | [hm.lemke.berlin](https://hm.lemke.berlin/) | +49 30 24728727 | unverified |
| Eschenbräu | Berlin | `microbrewery` | [eschenbraeu.de](https://eschenbraeu.de/) | +49 162 4931915 | unverified |
| Gémeskút Csárda | Berlin | `microbrewery` | [zumziehbrunnen.de](https://www.zumziehbrunnen.de/) | +49 30 56547511 | unverified |
| India Haus | Berlin | `microbrewery` | [india-haus.de](https://www.india-haus.de/) | — | unverified |
| Landhaus Lichtenrade | Berlin | `microbrewery` | [landhaus-lichtenrade.de](https://landhaus-lichtenrade.de/) | — | unverified |
| Luisenbräu | Berlin | `microbrewery` | [schloss.lemke.berlin](https://schloss.lemke.berlin/) `muerto` | +49 30 30878979 | unverified |
| Privatbrauerei Schalander | Berlin | `microbrewery` | [schalander-berlin.de](http://www.schalander-berlin.de/) | +49 30 94512299 | unverified |
| Ratskeller | Berlin | `microbrewery` | [brauerei-friedrichshagen.de/locations/raatskeller-menue.php](https://www.brauerei-friedrichshagen.de/locations/raatskeller-menue.php) | +49 162 4533204 | unverified |
| Schankhalle Pfefferberg | Berlin | `microbrewery` | [schankhalle-pfefferberg.de/braugasthaus](https://schankhalle-pfefferberg.de/braugasthaus/) | — | unverified |
| Schlossplatzbrauerei Coepenick | Eichwalde ⚠ | `microbrewery` | [schlossplatzbrauerei-koepenick.com](https://www.schlossplatzbrauerei-koepenick.com/) `muerto` | — | unverified |
| Straßenbräu | Berlin | `microbrewery` | [strassenbraeu.de/pages/taproom](https://strassenbraeu.de/pages/taproom) | +49 30 55527550 | unverified |
| SUUUD Brauerei | Berlin | `microbrewery` | [suuud.berlin](https://suuud.berlin) | +49 30 69001624 | unverified |
| Two Fellas Brewery | Berlin | `microbrewery` | [twofellas.beer](http://twofellas.beer) | — | unverified |
| Vagabund Brauerei Kesselhaus | Berlin | `microbrewery` | — | +49 30 45977635 | unverified |
| Yorckschlösschen | Berlin | `microbrewery` | [yorckschloesschen.de](https://www.yorckschloesschen.de/) | +49 30 2158070 | unverified |

## Residual Wikidata que OSM no trae — 5

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Groterjan-Brauerei Prinzenallee | Berlin | — | unverified |
| Schloss Königs Wusterhausen | Königs Wusterhausen | — | unverified |
| Schultheiß-Patzenhofer-Brauerei | Falkensee | — | unverified |
| Viktoria-Quartier | Berlin | — | unverified |
| Weißbierbrauerei Willner | Berlin | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
