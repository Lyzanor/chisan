# Rheinland-Pfalz — cerveza

- **CSV destino** `data/csv/de/westdeutschland/rheinland-pfalz.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-RP`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 56 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

Método, trampas y criterio de triaje: `docs/de/cerveza.md`. Columna **clase** = qué tag de OSM lo trajo, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 53 (A=27 · B=2 · C=24 · 5 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Bellheimer Lord Brauerei | Bellheim | `craft=brewery` | [bellheimer.de/?id=2](https://www.bellheimer.de/?id=2) | +49 7272 7010 | unverified |
| Bertricum | Bad Bertrich ⚠ | `craft=brewery` | — | — | unverified |
| Bitburger Brauerei | Bitburg | `craft=brewery` | — | — | unverified |
| Brauhaus am Markt | Kaiserslautern | `craft=brewery` | [brauhausammarkt-kl.de](https://www.brauhausammarkt-kl.de/) | — | unverified |
| Brauhaus Goldener Engel | Ingelheim am Rhein | `craft=brewery` | [brauhausgoldenerengel.de](https://www.brauhausgoldenerengel.de/) | +49 6132 89948 | unverified |
| Brauhaus Zwölf Apostel | Worms ⚠ | `craft=brewery` | [brauhaus-zwoelf-apostel.de](http://www.brauhaus-zwoelf-apostel.de/) | +49 6241 2027853 | unverified |
| Brauwerk | Bad Kreuznach | `craft=brewery` | [braunundroethgastronomie.com/braun-roeth/brauwerk/news](https://www.braunundroethgastronomie.com/braun-roeth/brauwerk/news/) | +49 671 29843330 | unverified |
| Dattenberger Brauerei | Dattenberg | `craft=brewery` | [dattenberger-brauerei.de/Startseite](https://dattenberger-brauerei.de/Startseite/) | — | unverified |
| Domhof Hausbrauerei | Speyer | `craft=brewery` | [domhof.de](https://www.domhof.de/) | +49 6232 67440 | unverified |
| Eulchen Brauerei | Mainz | `craft=brewery` | [eulchen-bier.de](https://www.eulchen-bier.de/) | — | unverified |
| Hagenbräu | Worms | `craft=brewery` | [hagenbraeu.de](https://www.hagenbraeu.de/) | +49 6241 921100 | unverified |
| Hof Schauferts Brauerei | Ebertshausen ⚠ | `craft=brewery` | [schauferts.de](https://www.schauferts.de/) | +4964869038728 | unverified |
| Holystoner Brauwerkstatt | Römerberg | `craft=brewery` | [holystoner.de](https://www.holystoner.de/) | — | unverified |
| Kirner Privatbrauerei | Kirn | `craft=brewery` | [kirner-bier.de](https://www.kirner-bier.de/) | +49 6752 1340 | unverified |
| Kleines Brauhaus | Bacharach ⚠ | `craft=brewery` | [rheintheater.de](http://www.rheintheater.de) | +49 6743 919179 | unverified |
| Lahnsteiner Brauerei | Lahnstein | `craft=brewery` | [lahnsteiner-brauerei.de/index.htm](https://www.lahnsteiner-brauerei.de/index.htm) | +49 2621 9174-0 | unverified |
| Mannebacher Brauhaus | Mannebach | `craft=brewery` | [mannebacher.de](http://www.mannebacher.de) | +49 6581 99277 | unverified |
| Nassauische Privatbrauerei Hahnstätten | Hahnstätten | `craft=brewery` | — | — | unverified |
| Ottersheimer Bärenbräu | Ottersheim bei Landau | `craft=brewery` | [ottersheimer-baerenbraeu.de](https://www.ottersheimer-baerenbraeu.de/) | — | unverified |
| Park Brauerei | Pirmasens | `craft=brewery` | [parkbrauerei.de](https://www.parkbrauerei.de/) | — | unverified |
| Privatbrauerei Gebr. Mayer | Ludwigshafen am Rhein ⚠ | `craft=brewery` | [mayerbraeu.de](http://www.mayerbraeu.de/) `→ mayers-brauwerk.de` | +49 621 675077 | unverified |
| Rheinhessen-Bräu | Mainz | `craft=brewery` | [rheinhessen-braeu.de](https://www.rheinhessen-braeu.de/) | +49 6136 763642 | unverified |
| Stadtbrauhaus Herrmannsbräu | Hagenbach ⚠ | `craft=brewery` | [stadtbrauhaus.de](http://www.stadtbrauhaus.de/) `→ stadtbrauhaus-hagenbach.de` | +49 7273 800765 | unverified |
| Stromberger Urbräu | Schweppenhausen ⚠ | `craft=brewery` | [stromberger-urbraeu.de](http://www.stromberger-urbraeu.de/) | +49 1575 5315725 | unverified |
| Temmelser Braukeller | Temmels ⚠ | `craft=brewery` | — | — | unverified |
| Trierer Petrusbräu | Trier | `craft=brewery` | [triererpetrusbraeu.de](https://www.triererpetrusbraeu.de/) | — | unverified |
| Westerwald-Brauerei | Hachenburg | `craft=brewery` | — | — | unverified |
| Bellheimer Brauerei | Bellheim ⚠ | `industrial` | — | — | unverified |
| Bitburger Brauerei | Bitburg ⚠ | `industrial` | [bitburger.de](https://www.bitburger.de/) | — | unverified |
| Blesius Garten | Trier | `microbrewery` | [blesius-garten.de](http://www.blesius-garten.de/) | +49 651 36060 | unverified |
| BrauArt | Grünstadt | `microbrewery` | [brau-art.com](http://www.brau-art.com) | +49 6359 9298222 | unverified |
| Brauhaus Bernkastel-Kues | Bernkastel-Kues | `microbrewery` | — | — | unverified |
| Brauhaus Marienstatt | Marienstatt | `microbrewery` | [abtei-marienstatt.de/brauhaus](https://www.abtei-marienstatt.de/brauhaus/) | +49 2662 9535-300 | unverified |
| Brauhaus Zils | Naurath (Eifel) | `microbrewery` | — | — | unverified |
| Denkmalz Kapellenbrauerei | Bad Sobernheim | `microbrewery` | [denkmalz.de](https://denkmalz.de/) | +49 1514 2536059 | unverified |
| Domhof Biergarten | Speyer ⚠ | `microbrewery` | [domhof.de](https://www.domhof.de/) | — | unverified |
| Eisgrub-Bräu | Mainz ⚠ | `microbrewery` | [eisgrub.de](https://www.eisgrub.de/) | +49 6131 221104 | unverified |
| Eulchen Brauereiausschank | Mainz | `microbrewery` | [eulchen-bier.de](https://www.eulchen-bier.de/) | — | unverified |
| Eulchen Schlossbiergarten | Mainz | `microbrewery` | [eulchen-bier.de](https://www.eulchen-bier.de/) | +49 6131 4987097 | unverified |
| Gasthaus zum Anker | Speyer | `microbrewery` | — | +49 6232 77403 | unverified |
| Göcklinger Hausbräu | Göcklingen ⚠ | `microbrewery` | [goecklingerhausbraeu.de](https://www.goecklingerhausbraeu.de/) | — | unverified |
| Historische Wassermühle Birgel | Birgel | `microbrewery` | [moulin.de](https://www.moulin.de) `→ muehlebirgel.de` | +49 6597 92820 | unverified |
| Jäger-Bräu | Edenkoben | `microbrewery` | — | +49 6323 937641 | unverified |
| Kuchems Brauhaus | Pirmasens | `microbrewery` | [kuchems-brauhaus.de](https://www.kuchems-brauhaus.de/) | +49 6331 213894 | unverified |
| Kuehn Kunz Rosen | Mainz | `microbrewery` | [kuehnkunzrosen.de](https://kuehnkunzrosen.de/) | +49 6131 2116101 | unverified |
| Maximilians Brauwiesen | Lahnstein | `microbrewery` | [maximilians-brauwiesen.de](https://www.maximilians-brauwiesen.de/) | +49 2621 926060 | unverified |
| Neuenahrer Brauhaus | Bad Neuenahr-Ahrweiler | `microbrewery` | [neuenahrer-brauhaus.de](https://www.neuenahrer-brauhaus.de/) | +49 2641 950660 | unverified |
| s'Fröschl | Jockgrim | `microbrewery` | [froschl.de](https://www.froschl.de/) | — | unverified |
| Steffens Brauereischänke | Kasbach-Ohlenberg | `microbrewery` | [alte-brauerei-kasbachtal.de](https://alte-brauerei-kasbachtal.de/) | +49 2644 980780 | unverified |
| Vulkan Brauhaus | Mendig | `microbrewery` | [vulkan-brauerei.de](https://vulkan-brauerei.de/) | +49 2652 520330 | unverified |
| Weingut-Brennerei Gutshof Zenz | Ediger-Eller | `microbrewery` | [gutshof-zenz.de](http://www.gutshof-zenz.de/) | +49 2675 384 | unverified |
| Zur alten Brennerei | Pünderich | `microbrewery` | [zur-alten-brennerei.eu](http://www.zur-alten-brennerei.eu/) `muerto` | +49 172 4288111 | unverified |
| Zur Klosterschenke | Kestert ⚠ | `microbrewery` | [klosterschenke-ehrenthal.de](http://www.klosterschenke-ehrenthal.de/) `muerto` | +49 6771 12529 | unverified |

## Residual Wikidata que OSM no trae — 3

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Caspary-Brauerei | Trier | — | unverified |
| Löwenbrauerei (Trier) | Trier | — | unverified |
| Unterhammer (Trippstadt) | Stelzenberg | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
