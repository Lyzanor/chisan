# Hessen — cerveza

- **CSV destino** `data/csv/de/westdeutschland/hessen.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-HE`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 67 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

Método, trampas y criterio de triaje: `docs/de/cerveza.md`. Columna **clase** = qué tag de OSM lo trajo, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 62 (A=26 · B=5 · C=31 · 9 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Alt-Oberurseler Brauhaus | Oberursel (Taunus) | `craft=brewery` | [meinbier.de](https://www.meinbier.de/) | +49 6171 54370 | unverified |
| BannenBerger Brauerei | Bad König | `craft=brewery` | [bannenberger.de](https://www.bannenberger.de/) | — | unverified |
| BrauDich | Pfungstadt ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Bier-Hannes | Offenbach am Main ⚠ | `craft=brewery` | [bier-hannes.de/brauerei](http://bier-hannes.de/brauerei/) | +49 69 412970 | unverified |
| Brauerei Friedrich Haaß KG | Schwalmstadt | `craft=brewery` | [schwalmbraeu.de](https://www.schwalmbraeu.de/) | — | unverified |
| Brauerei Schmucker | Mossautal ⚠ | `craft=brewery` | [schmucker-bier.de](https://www.schmucker-bier.de) | — | unverified |
| Brauhaus 18*80 | Fritzlar | `craft=brewery` | [fritzlarerdombraeu.de/](https://www.fritzlarerdombraeu.de//) | +49 5622 918809 | unverified |
| BRAUmit e.V. | Schotten | `craft=brewery` | [braumit.de](https://braumit.de/) | +49 6044 989000-3 | unverified |
| Brauschlumber | Seligenstadt ⚠ | `craft=brewery` | [brauschlumber.de](https://brauschlumber.de/) | +49 6182 7749420 | unverified |
| Eschweger Klosterbrauerei | Eschwege | `craft=brewery` | [eschweger-klosterbrauerei.de](https://www.eschweger-klosterbrauerei.de/) | +49 5651 3073-0 | unverified |
| Faselbräu - Zum Wohl Brauerei | Mörfelden-Walldorf | `craft=brewery` | [faselbraeu.de](https://www.faselbraeu.de/) | +49 6105 405 1721 | unverified |
| Freyenmühle | Reichelsheim (Odenwald) | `craft=brewery` | — | — | unverified |
| Fuldabrücker Landbrauerei | Fuldabrück | `craft=brewery` | [fuldabruecker-landbrauerei.de](http://www.fuldabruecker-landbrauerei.de/) | +49 5665 30088 | unverified |
| Hochstift Brauerei | Fulda | `craft=brewery` | [hochstift.de](https://www.hochstift.de/) | — | unverified |
| Hopfünf | Maintal | `craft=brewery` | [hopfuenf.de](https://hopfuenf.de/) | — | unverified |
| Hotel zur Traube | Nidda | `craft=brewery` | [hotel-zur-traube.de](https://hotel-zur-traube.de/) | +49 6043 40470 | unverified |
| HUNFELT BRAEU | Burghaun | `craft=brewery` | — | +49 6652 9939410 | unverified |
| Hütt-Brauerei | Baunatal | `craft=brewery` | [huett.de](https://www.huett.de) | — | unverified |
| Löwenbrauerei | Dieburg | `craft=brewery` | — | — | unverified |
| Maibacher Brauerei KG | Butzbach | `craft=brewery` | [maibacher.de](https://maibacher.de/) | +49 6081 9128922 | unverified |
| Rheingauer Gutsbräu | Sauerthal ⚠ | `craft=brewery` | [rheingauer-gutsbräu.de](https://www.rheingauer-gutsbräu.de/) `muerto` | +49 6726 839359 | unverified |
| Schinkels Back- & Brauhaus | Witzenhausen | `craft=brewery` | [schinkels-brauhaus.de](https://www.schinkels-brauhaus.de/) | +49 5542 911210 | unverified |
| Schinkels Brauerei | Witzenhausen | `craft=brewery` | — | +49 5542 5059293 | unverified |
| Staanemer Braukunst | Hanau ⚠ | `craft=brewery` | [staanemerbraukunst.de/startseite.html](https://www.staanemerbraukunst.de/startseite.html) `404` | — | unverified |
| Sudhaus | Seligenstadt | `craft=brewery` | — | — | unverified |
| Zur Brücke | Otzberg | `craft=brewery` | — | — | unverified |
| Brauerei Dörr | Michelstadt ⚠ | `industrial` | — | — | unverified |
| Darmstädter Privatbrauerei | Darmstadt | `industrial` | [unser-braustuebl.de](https://unser-braustuebl.de/) | +49 6151 9288-0 | unverified |
| Glaabsbräu Seligenstadt | Seligenstadt ⚠ | `industrial` | [glaabsbraeu.de](https://www.glaabsbraeu.de/) | — | unverified |
| Hahn Getränke-Union GmbH & Co. KG | Frielendorf | `industrial` | [hahn-getraenke.de](http://hahn-getraenke.de) `→ getraenkequelle-hahn.de` | +49 5684 80933 | unverified |
| Licher Privatbrauerei Jhring-Melchior GmbH | Lich ⚠ | `industrial` | [licher.de](https://www.licher.de/) | — | unverified |
| 12 Apostel | Frankfurt am Main ⚠ | `microbrewery` | [12aposteln-frankfurt.de](https://12aposteln-frankfurt.de/) | +49 69 288668 | unverified |
| Biergarten Wiesenmühle | Fulda ⚠ | `microbrewery` | [wiesenmuehle.de](http://www.wiesenmuehle.de/) | +49 661 928680 | unverified |
| Brauhaus Bad Wildungen | Bad Wildungen | `microbrewery` | [brauhaus-bad-wildungen.de](https://www.brauhaus-bad-wildungen.de/) | +49 5621 74150 | unverified |
| Brauhaus Castel | Mainz ⚠ | `microbrewery` | [brauhaus-castel.de](https://www.brauhaus-castel.de/) | +49 6134 24999 | unverified |
| Braumanufaktur Laubach | Laubach | `microbrewery` | [braumanufaktur-laubach.de](https://www.braumanufaktur-laubach.de/) `404` | — | unverified |
| Braumanufaktur Steckenpferd | Kassel ⚠ | `microbrewery` | [braumanufaktur-steckenpferd.de](http://www.braumanufaktur-steckenpferd.de) | +49 561 920 114 70 | unverified |
| Cheers | Wetzlar | `microbrewery` | — | — | unverified |
| Gasthof Hainmühle | Homberg (Ohm) | `microbrewery` | [Hainmuehle.de](http://www.Hainmuehle.de) | +49 6633 315 | unverified |
| Grohe Brauereiausschank | Darmstadt | `microbrewery` | [grohe-brauhaus.de](https://grohe-brauhaus.de/) | +49 6151 4291111 | unverified |
| Halber Mond | Heppenheim | `microbrewery` | [halber-mond.com](https://halber-mond.com) | +49 6252 126848 | unverified |
| Hausbrauerei Bauernstube | Wölfersheim | `microbrewery` | [bauernstube-online.de](https://www.bauernstube-online.de/) | +49 6036 5167 | unverified |
| HBH Hohmanns Brauhaus | Fulda | `microbrewery` | [hohmanns-brauhaus.de](https://www.hohmanns-brauhaus.de/) `→ hohmanns-brauhaus-fulda.de` | +49 661 2502988600 | unverified |
| Kärrners Hausbrauerei | Bad Orb | `microbrewery` | [kaerrners.de](https://www.kaerrners.de/) | +49 6052 2515 | unverified |
| Kleines Rüsselsheimer Brauhaus | Rüsselsheim am Main | `microbrewery` | [ruesselsheimerbrauhaus.de](http://www.ruesselsheimerbrauhaus.de/) | — | unverified |
| Kronenhof | Bad Homburg v. d. Höhe | `microbrewery` | [hofgut-kronenhof.de](http://www.hofgut-kronenhof.de/) | +49 6172 288662 | unverified |
| Privatbrauerei Löwenherz | Wehrheim | `microbrewery` | [brauhausloewenherz.de](https://www.brauhausloewenherz.de/) | +49 6081 4653-700 | unverified |
| Rathausbräu | Michelstadt | `microbrewery` | [rathausbraeu.de](https://www.rathausbraeu.de/) | +49 6061 5666 | unverified |
| Restaurant Wiesenmühle | Fulda | `microbrewery` | [wiesenmuehle.de](http://www.wiesenmuehle.de/) | +49 661 928680 | unverified |
| Rüsselsheimer Bräu | Rüsselsheim am Main | `microbrewery` | [ruesselsheimer-braeu.de](https://www.ruesselsheimer-braeu.de/) `muerto` | +49 6142 961240 | unverified |
| Schalander | Maintal | `microbrewery` | — | +49 177 6659008 | unverified |
| Schinkels Brauhaus | Witzenhausen | `microbrewery` | [schinkels-brauhaus.de/brauhaus](https://www.schinkels-brauhaus.de/brauhaus/) | +49 5542 911210 | unverified |
| Stella Fulda | Fulda | `microbrewery` | [stella-fulda.de](https://stella-fulda.de) | +49 176 28 26 27 58 | unverified |
| the station | Frankfurt am Main | `microbrewery` | [the-station.de](https://www.the-station.de/) | +49 155 61739865 | unverified |
| Umstädter Brauhaus | Groß-Umstadt ⚠ | `microbrewery` | [umstaedter-brauhaus.de](https://www.umstaedter-brauhaus.de/) | +49 6078 3345 | unverified |
| Wartenberger Brauhaus | Wartenberg | `microbrewery` | [dorfbraeuhaus.de](http://www.dorfbraeuhaus.de/) `404` | +49 6648 9110073 | unverified |
| WasserCraftWerk - Die Hausbrauerei | Raunheim ⚠ | `microbrewery` | [wassercraftwerk.de](https://www.wassercraftwerk.de/) `→ fra.heylouhotels.com` | +49 6142 5909590 | unverified |
| Weinhaus Eintracht | Mainz-Kostheim | `microbrewery` | — | — | unverified |
| Willingen Brauhaus | Willingen (Upland) ⚠ | `microbrewery` | — | — | unverified |
| Willinger Brauhaus | Willingen (Upland) | `microbrewery` | [willinger-brauhaus.de](http://www.willinger-brauhaus.de/) | +49 5632 9690500 | unverified |
| Wirtshaus Michelsrombacher Wald | Fulda | `microbrewery` | — | — | unverified |
| Zum Chattenturm | Wolfhagen ⚠ | `microbrewery` | [zum-chattenturm.de/restaurant](http://zum-chattenturm.de/restaurant) `404` | +49 5692 2387 | unverified |

## Residual Wikidata que OSM no trae — 5

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Actien-Brauerei Homburg v. d. Höhe | Bad Homburg vor der Höhe | — | unverified |
| Binding-Brauerei | Frankfurt am Main | — | unverified |
| Brauerei Alsfeld | Alsfeld | — | unverified |
| Schloss Bruchhausen | Olsberg | — | unverified |
| Wuth’sche Brauerei | Wiesbaden | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
