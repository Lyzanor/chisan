# Brandenburg — cerveza

- **CSV destino** `data/csv/de/ostdeutschland/brandenburg.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-BB`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 39 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

La columna **clase** indica qué tag de OSM trajo el candidato, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 37 (A=25 · B=1 · C=11 · 6 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Alte Ölmühle | Wittenberge ⚠ | `craft=brewery` | [oelmuehle-wittenberge.de/brauhaus](https://oelmuehle-wittenberge.de/brauhaus/) `→ elbe-resort.debrauhaus` | +49 3877 567994600 | unverified |
| Barnimer Brauhaus | Hohenfinow | `craft=brewery` | [barnimer-brauhaus.de](https://www.barnimer-brauhaus.de/) | — | unverified |
| Biergarten Forsthaus Templin | Schwielowsee ⚠ | `craft=brewery` | — | — | unverified |
| Brandenburger Beetzsee Brauerei | Brandenburg an der Havel | `craft=brewery` | [brandenburger.beer](http://brandenburger.beer/) `muerto` | — | unverified |
| Brau- Brennhaus zu Altlandsberg | Altlandsberg | `craft=brewery` | — | — | unverified |
| Brauerei der EBBG | Bernau bei Berlin | `craft=brewery` | [braugenosse.de](https://www.braugenosse.de) | — | unverified |
| Brauerei Inhaber Dan Asse | Kümmernitztal ⚠ | `craft=brewery` | [prignitzer-hausmosterei.de](https://www.prignitzer-hausmosterei.de/) | — | unverified |
| Braumanufaktur | Boitzenburger Land | `craft=brewery` | [boitzenburger-bier.de](http://www.boitzenburger-bier.de) | +49 39889 509 68 1 | unverified |
| Braumanufaktur GmbH | Werder (Havel) | `craft=brewery` | [braumanufaktur.de](http://braumanufaktur.de/) | — | unverified |
| Deutsche Eiche | Oberuckersee | `craft=brewery` | — | +49 39863 7149 | unverified |
| Die braut – Dorfbrauerei Stegelitz | Flieth-Stegelitz | `craft=brewery` | [dorfbrauerei-stegelitz.de](http://www.dorfbrauerei-stegelitz.de) | +49 39887 693 282 | unverified |
| Dr. Schulz DESTILLERIE | Altlandsberg ⚠ | `craft=brewery` | [pilzhof.de/index.php5](https://pilzhof.de/index.php5) `404` | — | unverified |
| Frankfurter Brauhaus GmbH | Frankfurt (Oder) | `craft=brewery` | [frankfurter-brauhaus.de](https://www.frankfurter-brauhaus.de/) | +49 335 661300 | unverified |
| Hebenbräu Brauerei | Brandenburg an der Havel | `craft=brewery` | [hebenbräu.de](https://www.hebenbräu.de/) `muerto` | +49 3381 3150333 | unverified |
| KATI Hausbrauerei | Eberswalde ⚠ | `craft=brewery` | [kati-eberswalde.de](https://kati-eberswalde.de/) | — | unverified |
| Kessel und Kelle | Potsdam | `craft=brewery` | [kesselundkelle.de](https://www.kesselundkelle.de/) | — | unverified |
| Kirchers Brauhaus GmbH | Drebkau | `craft=brewery` | [kircher-brauhaus.de](https://kircher-brauhaus.de/) | +49 35602 701 | unverified |
| Klosterbrauerei Neuzelle GmbH | Neuzelle | `craft=brewery` | [klosterbrauerei.com/shop](https://www.klosterbrauerei.com/shop/) `→ shop.klosterbrauerei.com` | — | unverified |
| Meierei - Brauerei Potsdam | Potsdam | `craft=brewery` | [meierei-potsdam.de](https://www.meierei-potsdam.de/) | +49 331 7043211 | unverified |
| Rathausbräu | Fürstenwalde/Spree | `craft=brewery` | [rathausbraeu-fuerstenwalde.de](http://www.rathausbraeu-fuerstenwalde.de) | — | unverified |
| Spreewälder Privatbrauerei 1788 | Schlepzig ⚠ | `craft=brewery` | [seinerzeit.de/brauerei](https://www.seinerzeit.de/brauerei) | — | unverified |
| Strausberger Brauerei | Strausberg | `craft=brewery` | — | — | unverified |
| Uckermärker Brauerei | Golzow | `craft=brewery` | [choriner.de](https://www.choriner.de) | — | unverified |
| Ziegel-Braumanufaktur | Zehdenick | `craft=brewery` | [ziegelbier.de](https://www.ziegelbier.de) `muerto` | +49 3307 4203127 | unverified |
| Zum Rittmeister | Werder (Havel) ⚠ | `craft=brewery` | — | — | unverified |
| Zum Braugenossen | Bernau bei Berlin | `industrial` | [braugenosse.de](https://braugenosse.de) | — | unverified |
| Alte Backstube | Mühlberg/Elbe ⚠ | `microbrewery` | [alte-backstube-muehlberg.de](https://www.alte-backstube-muehlberg.de/) | — | unverified |
| Brauhaus & Pension Babben | Lübbenau/Spreewald | `microbrewery` | [babben-bier.de](https://www.babben-bier.de/) | +49 3542 2126 | unverified |
| Braumanufaktur Forsthaus Templin | Schwielowsee ⚠ | `microbrewery` | [braumanufaktur.de](https://www.braumanufaktur.de/) | +49 33209 217 979 | unverified |
| BrauWerk | Schwedt/Oder | `microbrewery` | [brauwerk-Schwedt.de](https://www.brauwerk-Schwedt.de) | +49 3332 835790 | unverified |
| Finsterwalder Brauhaus | Finsterwalde | `microbrewery` | [finsterwalder-brauhaus.de](https://www.finsterwalder-brauhaus.de/) | +49 3531 2286 | unverified |
| Gasthausbrauerei Zum Alten Brauhaus | Rheinsberg | `microbrewery` | — | — | unverified |
| Kneipe Pur | Wusterwitz ⚠ | `microbrewery` | [kneipepur.de/braeuhaus_kneipepur.htm](http://www.kneipepur.de/braeuhaus_kneipepur.htm) | — | unverified |
| Kochkommode | Eberswalde | `microbrewery` | [kochkommode.de/restaurant-eberswalde](https://kochkommode.de/restaurant-eberswalde/) | +491523 5799288 | unverified |
| Reuners Hofgarten | Schlepzig ⚠ | `microbrewery` | [reuners-hofgarten.de](https://www.reuners-hofgarten.de/) | +49 173 6554019 | unverified |
| Spree-Pizza | Lübben (Spreewald) ⚠ | `microbrewery` | [spree-pizza.de](https://spree-pizza.de) | +49 3546 8940 | unverified |
| Turmklause | Luckenwalde | `microbrewery` | [turmklause.de](https://www.turmklause.de/) | +49 3371 5939791 | unverified |

## Residual Wikidata que OSM no trae — 2

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Krongut Bornstedt | Potsdam | — | unverified |
| Löwenbrauerei Dahlen | Wermsdorf | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
