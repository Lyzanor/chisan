# Thüringen — cerveza

- **CSV destino** `data/csv/de/ostdeutschland/thueringen.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-TH`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 50 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

La columna **clase** indica qué tag de OSM trajo el candidato, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 47 (A=30 · B=4 · C=13 · 7 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Anker-Bräu | Oberland am Rennsteig ⚠ | `craft=brewery` | [ankerla.de](https://www.ankerla.de/) | — | unverified |
| Brauerei Neunspringe | Leinefelde-Worbis | `craft=brewery` | [brauerei-neunspringe.de](https://brauerei-neunspringe.de/) | +49 36074 9790 | unverified |
| Brauerei Papiermühle | Jena | `craft=brewery` | [jenaer-bier.de/brauerei](https://www.jenaer-bier.de/brauerei/) | — | unverified |
| Brauerei Schmitt | Stadtilm | `craft=brewery` | [brauerei-schmitt.de](http://www.brauerei-schmitt.de) `5xx` | +49 3629 802556 | unverified |
| Brauerei Weimar-Ehringsdorf | Weimar | `craft=brewery` | [ehringsdorfer.de](https://ehringsdorfer.de/) | +49 3643 8760 | unverified |
| Brauereimuseum | Altenburg | `craft=brewery` | [brauerei-altenburg.de](https://www.brauerei-altenburg.de/) | — | unverified |
| Brauhaus Jenaprießnitz | Jena | `craft=brewery` | [jenapriessnitz-wogau.de/html/brauverein.html](https://www.jenapriessnitz-wogau.de/html/brauverein.html) `404` | — | unverified |
| Brauhaus Kommunalbräu Bad Colberg | Heldburg | `craft=brewery` | — | — | unverified |
| Brauhaus Lindenau | Heldburg | `craft=brewery` | — | — | unverified |
| Brauhaus Ummerstadt | Ummerstadt | `craft=brewery` | [ummerstadt.de/Geschichliches/Brauhaus/brauhaus.htm](http://www.ummerstadt.de/Geschichliches/Brauhaus/brauhaus.htm) | — | unverified |
| Braumanufaktur Schmalkalden | Schmalkalden | `craft=brewery` | [braumanufaktur-schmalkalden.de](https://braumanufaktur-schmalkalden.de/) | — | unverified |
| Dreitürme | Bad Langensalza | `craft=brewery` | [dreituermebrauerei.de](https://www.dreituermebrauerei.de) | — | unverified |
| Erste Oberländische Dampfbierbrauerei | Bad Lobenstein | `craft=brewery` | — | +49 36651 2141 | unverified |
| Familienbrauerei H. Schmiedeknecht | Großbreitenbach | `craft=brewery` | [brauerei-schmiedeknecht.de](http://www.brauerei-schmiedeknecht.de) | +49 3673 842357 | unverified |
| Heimathafen - Erfurter Braumanufaktur | Erfurt | `craft=brewery` | [heimathafen-bier.de](https://heimathafen-bier.de) | +49 361 74435041 | unverified |
| Holzländer Biere | Schleifreisen | `craft=brewery` | — | — | unverified |
| Kleinbrauerei Freitag | Erfurt | `craft=brewery` | [kleinbrauerei-freitag.de](http://www.kleinbrauerei-freitag.de) | — | unverified |
| Michels Eichsfelder Braumanufaktur e.K. | Dingelstädt | `craft=brewery` | [michels-bier.de](https://michels-bier.de/) | +49 36076 418042 | unverified |
| Privatbrauerei Gessner | Sonneberg | `craft=brewery` | [privatbrauerei-gessner.de](https://www.privatbrauerei-gessner.de) | +49 3675 40790 | unverified |
| Privatbrauerei Metzler | Dingsleben | `craft=brewery` | [dingslebener.de](https://www.dingslebener.de/) | +49 36873 2840 | unverified |
| Rhönbrauerei | Kaltensundheim ⚠ | `craft=brewery` | — | — | unverified |
| Rhönbrauerei Dittmar | Kaltennordheim | `craft=brewery` | — | — | unverified |
| Rolschter Brauhaus | Rudolstadt | `craft=brewery` | [rolschter.de](https://www.rolschter.de/) `403` | +49 3672 42660 | unverified |
| Scharch Braumanufaktur | Schleiz | `craft=brewery` | — | — | unverified |
| Schloßbrauerei Schwarzbach | Auengrund | `craft=brewery` | [schlossbrauerei-schwarzbach.de/de](https://www.schlossbrauerei-schwarzbach.de/de/) | +49 36878 2760 | unverified |
| Stupps | Bad Liebenstein | `craft=brewery` | [stupps-bier.de](http://www.stupps-bier.de/) | — | unverified |
| Vereinsbrauerei | Apolda ⚠ | `craft=brewery` | — | — | unverified |
| Vereinsbrauerei Greiz | Greiz | `craft=brewery` | [greizer.de](http://www.greizer.de) | +49 3661 6100 | unverified |
| Waldhaus-Bräu Erfurt | Erfurt | `craft=brewery` | — | — | unverified |
| Watzdorfer Traditions- und Spezialitätenbrauerei GmbH | Bad Blankenburg | `craft=brewery` | [watzdorfer.de](https://www.watzdorfer.de/) | +49 36741 616-0 | unverified |
| Altenburger Brauerei | Altenburg | `industrial` | [brauerei-altenburg.de](https://www.brauerei-altenburg.de/) | +49 3447 31290 | unverified |
| Bürgerliches Brauhaus Saalfeld | Saalfeld/Saale | `industrial` | [brauhaus-saalfeld.de](https://brauhaus-saalfeld.de/) | +49 3671 67360 | unverified |
| Köstritzer Schwarzbierbrauerei GmbH | Bad Köstritz | `industrial` | [koestritzer.de](https://www.koestritzer.de) | +49 36605 2000 | unverified |
| Paulaner Brauerei | Gotha ⚠ | `industrial` | — | — | unverified |
| Berggasthof Heuberghaus | Friedrichroda | `microbrewery` | [heuberghaus.de](https://www.heuberghaus.de/) | +49 3623 304492 | unverified |
| Brauereigasthof Marktmühle | Vogtei | `microbrewery` | [marktmühle-oberdorla.de](https://marktmühle-oberdorla.de) `muerto` | +49 3601 8882100 | unverified |
| Brauereigasthof und Pension Ankerbräu | Steinach | `microbrewery` | [ankerla.de](https://www.ankerla.de/) | +49 36762 31251 | unverified |
| Brauereigasthof Ziegenmühle | Schleifreisen | `microbrewery` | [ziegenmuehle.de](https://www.ziegenmuehle.de) | +49 36601 941 941 | unverified |
| Brauereigasthof Zum Löwen | Mühlhausen | `microbrewery` | — | — | unverified |
| Brauereigaststätte Schwarzbacher | Auengrund | `microbrewery` | [schlossbrauerei-schwarzbach.de/de](https://www.schlossbrauerei-schwarzbach.de/de/) | +49 36878 2760 | unverified |
| Brauhaus Friedrichroda | Friedrichroda | `microbrewery` | [brauhaus-friedrichroda.de](http://www.brauhaus-friedrichroda.de/) | +49 3623 304259 | unverified |
| Brauhaus zum Löwen | Mühlhausen | `microbrewery` | [brauhaus-zum-loewen.de](http://www.brauhaus-zum-loewen.de) `→ goebel-hotels.com` | +49 3601 4710 | unverified |
| Felsenkeller | Weimar | `microbrewery` | [felsenkeller-weimar.de](https://www.felsenkeller-weimar.de) `→ felsenkeller-weimar.de` | +493643414741 | unverified |
| Matador Steak- & Brauhaus | Arnstadt ⚠ | `microbrewery` | — | — | unverified |
| Ratsbrauerei | Weißensee ⚠ | `microbrewery` | [ratsbrauerei-weissensee.de](https://www.ratsbrauerei-weissensee.de/) `muerto` | +49 36374 18602 | unverified |
| Waldhaus | Erfurt | `microbrewery` | [waldhaus-erfurt.de](https://waldhaus-erfurt.de/) | +49 361 3459320 | unverified |
| Zum Goldenen Schwan | Erfurt | `microbrewery` | [zum-goldenen-schwan.de](https://www.zum-goldenen-schwan.de/) | +49 361 2623742 | unverified |

## Residual Wikidata que OSM no trae — 3

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Brauerei Gebrüder Jäcklein | Ilmenau | — | unverified |
| Gebrüder Treitschke | Erfurt | — | unverified |
| Stadtbrauerei Deinhardt | Weimar | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
