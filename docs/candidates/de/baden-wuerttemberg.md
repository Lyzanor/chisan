# Baden-Württemberg — cerveza

- **CSV destino** `data/csv/de/sueddeutschland/baden-wuerttemberg.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-BW`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 210 candidatos contra **190 Braustätten** que Destatis cuenta en Baden-Württemberg en 2025; el CSV tiene hoy 0 filas de cerveza aquí

Método, trampas y criterio de triaje: `docs/de/cerveza.md`. Columna **clase** = qué tag de OSM lo trajo, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 200 (A=106 · B=15 · C=79 · 27 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| A. Grüner | Endingen am Kaiserstuhl | `craft=brewery` | — | — | unverified |
| Adlerbräu | Wiernsheim | `craft=brewery` | [adlerbraeu.de](https://www.adlerbraeu.de) | +49 7044 920778 | unverified |
| Adlerbrauerei Moosbeuren | Oberstadion | `craft=brewery` | [adlerbrauerei-moosbeuren.de/brauerei](https://www.adlerbrauerei-moosbeuren.de/brauerei) | — | unverified |
| Adlerbrauerei Schmetzer | Wallhausen ⚠ | `craft=brewery` | — | — | unverified |
| Alte Werkstatt Bierspezialitäten | Weinstadt | `craft=brewery` | [alte-werkstatt-bier.de](http://www.alte-werkstatt-bier.de/) `muerto` | +49 7151 65559 | unverified |
| Alter Bahnhof Malsch | Malsch | `craft=brewery` | [alterbahnhofmalsch.de](https://alterbahnhofmalsch.de/) | +497246305944 | unverified |
| Badisch Brauhaus | Karlsruhe | `craft=brewery` | [badisch-brauhaus.de](https://www.badisch-brauhaus.de/) | +49 721 144-4400 | unverified |
| Balinger Adlerbräu | Balingen | `craft=brewery` | [balinger-adlerbraeu.de](https://balinger-adlerbraeu.de/) `muerto` | +49 7433 34061 | unverified |
| Beermanufaktur Heger | Hambrücken | `craft=brewery` | [beermanufakturheger.de](https://www.beermanufakturheger.de/) `muerto` | — | unverified |
| Berg Brauerei | Ehingen (Donau) | `craft=brewery` | [bergbier.de](https://www.bergbier.de/) | +49 7391 771744 | unverified |
| Birkenwäldle | Stuttgart | `craft=brewery` | [birkenwaeldle.de](https://www.birkenwaeldle.de) | — | unverified |
| Blank‘s Brauerei | Emeringen ⚠ | `craft=brewery` | [brauerei-blank.de](http://www.brauerei-blank.de) | — | unverified |
| Brauerei Dachsen-Franz | Zuzenhausen ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Franz | Rastatt | `craft=brewery` | [brauerei-franz.de](https://www.brauerei-franz.de/) | +49 7222 97370 | unverified |
| Brauerei Gold Ochsen | Ulm ⚠ | `craft=brewery` | [goldochsen.de](https://goldochsen.de) | — | unverified |
| Brauerei Häberlen | Gaildorf | `craft=brewery` | [brauerei-haeberlen.de](https://www.brauerei-haeberlen.de) | +49 7971 6250 | unverified |
| Brauerei Härle | Leutkirch im Allgäu | `craft=brewery` | [haerle.de](https://www.haerle.de) | — | unverified |
| Brauerei Hirtler | March | `craft=brewery` | [brauerei-hirtler.de](http://www.brauerei-hirtler.de/) | — | unverified |
| Brauerei Ketterer | Pforzheim | `craft=brewery` | [brauerei-ketterer.de](https://brauerei-ketterer.de/) | +49 7231 9211-0 | unverified |
| Brauerei Lasser | Lörrach ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Leibinger | Ravensburg | `craft=brewery` | [leibinger.de](https://www.leibinger.de) | +49 751 3699-0 | unverified |
| Brauerei Palmbräu | Eppingen | `craft=brewery` | [palmbraeu.de](https://www.palmbraeu.de/) | — | unverified |
| Brauerei Prestelbräu | Ubstadt-Weiher | `craft=brewery` | [prestelbräu.de](http://www.prestelbräu.de) `404` | +49 163 1302511 | unverified |
| Brauerei Rogg | Lenzkirch | `craft=brewery` | [brauerei-rogg.de](https://www.brauerei-rogg.de/) | +4976536623 | unverified |
| Brauerei Schimpf | Neustetten | `craft=brewery` | [brauerei-schimpf.de](https://brauerei-schimpf.de) | +49 7472 9894 55 | unverified |
| Brauerei Schlumberger | Nattheim | `craft=brewery` | — | — | unverified |
| Brauerei Schwert | Ehingen (Donau) | `craft=brewery` | — | +49 7391 1288 | unverified |
| Brauerei zum Klosterhof | Heidelberg | `craft=brewery` | [brauerei-zum-klosterhof.de](https://www.brauerei-zum-klosterhof.de/) `403` | +49 4962 216520365 | unverified |
| Brauhaus Rössle | Neubulach | `craft=brewery` | [brauhaus-roessle.de](https://www.brauhaus-roessle.de) `5xx` | +49 7053 7766 | unverified |
| Brauhaus Zollernalb GmbH | Albstadt ⚠ | `craft=brewery` | — | — | unverified |
| Braukollektiv | Freiburg im Breisgau | `craft=brewery` | [braukollektiv.com](https://www.braukollektiv.com/) | — | unverified |
| Braumanufaktur-Strohgäu | Korntal-Münchingen ⚠ | `craft=brewery` | — | — | unverified |
| Braurevolution | Kirchheim unter Teck | `craft=brewery` | [braurevolution.de](https://braurevolution.de) | +49 7021 956 516 3 | unverified |
| Brauwerk Baden | Offenburg | `craft=brewery` | [brauwerk-baden.de](https://www.brauwerk-baden.de/) | — | unverified |
| BROW. modern brewery | Leonberg | `craft=brewery` | [heybrow.de](https://heybrow.de/) | +49 7152 339515 | unverified |
| Buderhof Bräu | Oberreichenbach | `craft=brewery` | — | — | unverified |
| Bulzinger | Rietheim-Weilheim | `craft=brewery` | — | — | unverified |
| Burgpilz | Ulm | `craft=brewery` | [burgpilz.de](https://www.burgpilz.de/) | +49 171 8601866 | unverified |
| Constanzer Wirtshaus | Konstanz | `craft=brewery` | [constanzer-wirtshaus.de](https://www.constanzer-wirtshaus.de/) | +4975313630130 | unverified |
| CraftCell | Wiesenbach | `craft=brewery` | [craftcell.de](https://craftcell.de/) `muerto` | — | unverified |
| Crailsheimer Engel-Bräu | Crailsheim ⚠ | `craft=brewery` | [engelbier.de](https://www.engelbier.de) | — | unverified |
| Dachsenfranz Biermanufaktur | Zuzenhausen ⚠ | `craft=brewery` | [dachsenfranz.de/brauerei.html](https://www.dachsenfranz.de/brauerei.html) | — | unverified |
| Dammenmühle-Brauhaus | Lahr/Schwarzwald ⚠ | `craft=brewery` | [hotel-dammenmuehle.de](https://www.hotel-dammenmuehle.de/) | — | unverified |
| derr HOF | Igersheim | `craft=brewery` | [derrhof.de](https://derrhof.de/) | — | unverified |
| Die Bierhandwerker | Merzhausen | `craft=brewery` | [diebrauhandwerker.de](https://www.diebrauhandwerker.de) | +49 151 44626615 | unverified |
| Distelhäuser Brauerei | Tauberbischofsheim | `craft=brewery` | — | — | unverified |
| Edelweissbrauerei Farny | Wangen im Allgäu ⚠ | `craft=brewery` | [farny.de](https://www.farny.de/) | — | unverified |
| Engel | Rastatt | `craft=brewery` | [hotel-engel-rastatt.de](http://www.hotel-engel-rastatt.de/) `→ engel-rastatt.de` | +49 7222 77980 | unverified |
| Familienbrauerei Bauhöfer | Renchen ⚠ | `craft=brewery` | [bauhoefer.de](https://bauhoefer.de/) | +49 7843 94740 | unverified |
| Familienbrauerei Ketterer | Hornberg | `craft=brewery` | [kettererbier.de](https://www.kettererbier.de) | — | unverified |
| Farrenbräu Brauerei | Immendingen ⚠ | `craft=brewery` | [farrenbraeu.de](https://www.farrenbraeu.de/) | — | unverified |
| Feierling Biergarten | Freiburg im Breisgau ⚠ | `craft=brewery` | [feierling.de](https://www.feierling.de/) | — | unverified |
| Felsenbergbräu | Schwieberdingen ⚠ | `craft=brewery` | — | — | unverified |
| Fischer's Brauhaus | Mössingen | `craft=brewery` | — | — | unverified |
| Fürstenberg Brauerei Lager | Donaueschingen ⚠ | `craft=brewery` | — | — | unverified |
| Fürstlich Fürstenbergische Brauerei GmbH & Co. KG | Donaueschingen ⚠ | `craft=brewery` | [fuerstenberg.de](https://www.fuerstenberg.de/) | — | unverified |
| Gamerbräu | Stutensee | `craft=brewery` | [gamerbraeu.de](https://gamerbraeu.de/) | — | unverified |
| Gässle Bräu | Bad Rappenau | `craft=brewery` | — | — | unverified |
| Gasthof Brauerei Schwanen | Ehingen (Donau) | `craft=brewery` | [schwanen-ehingen.de](https://www.schwanen-ehingen.de/) | +49 7391 53 42 0 | unverified |
| Gruibinger | Gruibingen | `craft=brewery` | [gruibinger.de](http://www.gruibinger.de) | +49 7335 9644-0 | unverified |
| Häffner Bräu | Bad Rappenau | `craft=brewery` | [brauerei-haeffner.de](https://www.brauerei-haeffner.de/) | +49 7264 8050 | unverified |
| Haller Löwenbräu | Schwäbisch Hall | `craft=brewery` | [haller-loewenbraeu.de](https://www.haller-loewenbraeu.de/) | — | unverified |
| Hamberger Brauwerkstatt | Neuhausen | `craft=brewery` | [hamberger-brauwerkstatt.de](https://hamberger-brauwerkstatt.de/) | +49 7234 8069430 | unverified |
| Häselbräu | Straubenhardt | `craft=brewery` | [haeselbraeu.de](https://www.haeselbraeu.de/) | — | unverified |
| Hausbräu Mülhaupt | Lörrach ⚠ | `craft=brewery` | [hausbraeu-muelhaupt.de](http://www.hausbraeu-muelhaupt.de/) | +49 7621 51654 | unverified |
| Herbsthäuser Brauerei | Niederstetten ⚠ | `craft=brewery` | [herbsthaeuser.de](https://www.herbsthaeuser.de/) | — | unverified |
| Hey Joe Brewing | Murrhardt | `craft=brewery` | — | +49 170 4343704 | unverified |
| Hirsch Brauerei | Wurmlingen ⚠ | `craft=brewery` | [hirschbrauerei.de](https://hirschbrauerei.de) | +49 7461 9420 | unverified |
| Hirschbräu Hirschlanden | Osterburken ⚠ | `craft=brewery` | [hirschbraeu-hirschlanden.de](http://www.hirschbraeu-hirschlanden.de) | +49 6295 7159 | unverified |
| Hirschbrauerei | Niedereschach ⚠ | `craft=brewery` | — | — | unverified |
| Hirschbrauerei Schilling | Römerstein | `craft=brewery` | [boehringer-biere.de](https://www.boehringer-biere.de) | +49 7382 93880 | unverified |
| Hochdorfer Kronenbrauerei | Nagold | `craft=brewery` | [hochdorfer.de](https://hochdorfer.de/) | +49 7459 92920 | unverified |
| Hopfenschlingel | Rastatt | `craft=brewery` | [hopfenschlingel.com](https://www.hopfenschlingel.com/) | +49 7222 30099 | unverified |
| Königsbräu | Nattheim ⚠ | `craft=brewery` | — | — | unverified |
| Königsegger WalderBräu AG | Königseggwald | `craft=brewery` | [walderbraeu.de](https://www.walderbraeu.de/) | +49 7587 9504 0 | unverified |
| Kronenbrauerei Laupheim | Laupheim | `craft=brewery` | [kronenbrauerei-laupheim.de](https://kronenbrauerei-laupheim.de/) `403` | +49 7392 8345 | unverified |
| Kühler Krug | Karlsruhe | `craft=brewery` | [brauhaus-kuehler-krug.de](https://www.brauhaus-kuehler-krug.de/) `→ brauhaus-karlsruhe.com` | +49 721 8303104 | unverified |
| Lammbrauerei | Obergröningen ⚠ | `craft=brewery` | — | — | unverified |
| Lammbrauerei Untergröningen | Abtsgmünd | `craft=brewery` | [lammbrauerei.de](https://www.lammbrauerei.de/) | +49 7975 284 | unverified |
| Löwenbrauerei | Bräunlingen | `craft=brewery` | [www2.loewenbrauerei-braeunlingen.de](https://www2.loewenbrauerei-braeunlingen.de/) `muerto` | +49 771 61121 | unverified |
| Löwenbrauerei Wasseralfingen | Aalen | `craft=brewery` | [wasseralfinger.de](http://wasseralfinger.de) | — | unverified |
| Markgräfler Brauwerk | Kandern | `craft=brewery` | [markgraefler-brauwerk.de](https://www.markgraefler-brauwerk.de/) | +4917645968965 | unverified |
| Mönchwasen | Simmozheim | `craft=brewery` | [moenchwasen.com](https://www.moenchwasen.com) | — | unverified |
| Mosbacher Brauhaus | Mosbach | `craft=brewery` | [brauhaus-mosbach.de](http://www.brauhaus-mosbach.de/) `→ mosbacher-brauhaus.de` | — | unverified |
| Ostel Bräu | Endingen am Kaiserstuhl | `craft=brewery` | — | — | unverified |
| Parkhotel Stuttgart Airport-Messe | Leinfelden-Echterdingen | `craft=brewery` | [parkhotel-stuttgart.de](http://www.parkhotel-stuttgart.de) | +49 711 633440 | unverified |
| Pflugbrauerei Hörvelsingen | Langenau | `craft=brewery` | [pflugbrauerei.de](https://www.pflugbrauerei.de) | +49 7348 6237 | unverified |
| Reichenauer Inselbier | Reichenau | `craft=brewery` | — | — | unverified |
| Riedbacher FRANKEN BRÄU | Schrozberg ⚠ | `craft=brewery` | [riedbacher.de](https://riedbacher.de/) | — | unverified |
| Römerbräu Riegel | Riegel am Kaiserstuhl | `craft=brewery` | [roemerbraeu.de](http://www.roemerbraeu.de) | — | unverified |
| Rossknecht ziemlichBESTEbiere! | Stuttgart | `craft=brewery` | [ziemlichbestebiere.de](https://ziemlichbestebiere.de/) | — | unverified |
| Rössle Bräu | Ehingen (Donau) | `craft=brewery` | [roessle-bier-ehingen.de](https://www.roessle-bier-ehingen.de/) `403` | +49 7391 53465 | unverified |
| Ruppaner Brauerei | Konstanz | `craft=brewery` | [ruppaner-bodensee.de](https://www.ruppaner-bodensee.de) | +49 7531 93730 | unverified |
| Schimpf | Neustetten | `craft=brewery` | — | — | unverified |
| Schlachthof | Nürtingen | `craft=brewery` | [schlachthofbraeu.de](https://www.schlachthofbraeu.de/) | +49 7022 939571 | unverified |
| Schlossbrauerei Aulendorf | Aulendorf | `craft=brewery` | [schlossbrauerei-aulendorf.de](https://www.schlossbrauerei-aulendorf.de/) | +49 7525 921350 | unverified |
| Schlüsselbräu | Giengen an der Brenz | `craft=brewery` | [schluesselbraeu.de](https://www.schluesselbraeu.de/) | +49 7322 96570 | unverified |
| Schwedesbräu | Kraichtal | `craft=brewery` | [schwedesbraeu.de](http://schwedesbraeu.de) | +49 151 43819593 | unverified |
| Schwetzinger Brauhaus zum Ritter | Schwetzingen | `craft=brewery` | [brauhaus-zum-ritter.de](https://www.brauhaus-zum-ritter.de/) | +49 6202 924950 | unverified |
| Sonne | Bösingen | `craft=brewery` | — | — | unverified |
| Spall | Ravenstein | `craft=brewery` | — | — | unverified |
| Steinacher Hausbrauerei | Bad Waldsee | `craft=brewery` | — | — | unverified |
| SUEVIA | Ulm | `craft=brewery` | [suevia-brauerei.de](https://www.suevia-brauerei.de) | +49 731 30534 | unverified |
| Vater Strauss | Ittlingen ⚠ | `craft=brewery` | [vater-strauss.de](https://www.vater-strauss.de) | — | unverified |
| Weldebräu | Plankstadt ⚠ | `craft=brewery` | [welde.de](https://www.welde.de/) | — | unverified |
| Zwiefalter Klosterbräu | Zwiefalten | `craft=brewery` | [zwiefalter.de](https://www.zwiefalter.de/) | +49 7373 200 10 | unverified |
| Alpirsbacher Klosterbräu (Abfüllbetrieb) | Alpirsbach ⚠ | `industrial` | [alpirsbacher.de](https://www.alpirsbacher.de/) | — | unverified |
| Brauerei Ganter | Freiburg im Breisgau | `industrial` | [ganter.com](http://www.ganter.com) | +49 761 21850 | unverified |
| Brauerei Rothaus | Grafenhausen ⚠ | `industrial` | [rothaus.de](https://www.rothaus.de/) | — | unverified |
| Brauhaus Pforzheim | Pforzheim | `industrial` | — | — | unverified |
| Dinkelacker-Schwaben Bräu | Stuttgart | `industrial` | [privatbrauerei-stuttgart.de](http://privatbrauerei-stuttgart.de/) `→ dinkelacker.de` | +49 711 64 810 | unverified |
| Hatz-Moninger Brauhaus | Karlsruhe ⚠ | `industrial` | — | — | unverified |
| Hatz-Moninger Haustrunk Abholung | Karlsruhe ⚠ | `industrial` | — | — | unverified |
| Heidelberger Brauerei GmbH | Heidelberg | `industrial` | [heidelberger-brauerei.de](https://www.heidelberger-brauerei.de/) | +49 6221 90140 | unverified |
| Michelbräu | Stegen | `industrial` | — | — | unverified |
| Privatbrauerei Eichbaum | Mannheim | `industrial` | [eichbaum.de](https://www.eichbaum.de/) | — | unverified |
| Privatbrauerei Hoepfner | Karlsruhe ⚠ | `industrial` | [hoepfner.de](https://www.hoepfner.de/) | — | unverified |
| Privatbrauerei Waldhaus | Weilheim | `industrial` | [waldhaus-brauerei.de](http://www.waldhaus-brauerei.de/) `→ waldhaus-bier.de` | +49 7755 92220 | unverified |
| Schönbuch Braumanufaktur | Böblingen ⚠ | `industrial` | [braumanufaktur.com](https://www.braumanufaktur.com/) | — | unverified |
| SCHUSSENRIEDER Brauerei Ott GmbH & Co.KG | Bad Schussenried | `industrial` | — | — | unverified |
| Stuttgarter Hofbräu | Stuttgart ⚠ | `industrial` | — | — | unverified |
| `s Heinzel | Ditzingen ⚠ | `microbrewery` | [keltenfuerst.com](http://www.keltenfuerst.com) | +49 7156 1778177 | unverified |
| Albquell Bräuhaus | Trochtelfingen | `microbrewery` | [albquell-brauhaus.de](https://www.albquell-brauhaus.de/) | +49 7124 733 | unverified |
| Andreasbräu | Eggenstein-Leopoldshafen | `microbrewery` | [andreasbraeu.de](https://andreasbraeu.de/) | +49 7247 96 32 00 | unverified |
| Bahnhof 1911 - Steak & Grill | Wolpertswende | `microbrewery` | [bahnhof1911.de/restaurant.html](https://www.bahnhof1911.de/restaurant.html) | +49 7502 9437823 | unverified |
| Barfüßer | Reutlingen ⚠ | `microbrewery` | [barfuesser-brauhaus.de/reutlingen](http://www.barfuesser-brauhaus.de/reutlingen/) `404` | — | unverified |
| Barfüßer | Ulm | `microbrewery` | [barfuesser-brauhaus.de/standorte/standort-ulm-2](https://www.barfuesser-brauhaus.de/standorte/standort-ulm-2/) | +49 731 60265615 | unverified |
| Barfüßer die Hausbrauerei | Pfullendorf | `microbrewery` | [barfuesser-brauhaus.de/standorte/standort-pfullendorf-2](https://www.barfuesser-brauhaus.de/standorte/standort-pfullendorf-2/) | +49 7552 9280815 | unverified |
| Barfüßer Hausbrauerei Göppingen | Göppingen | `microbrewery` | [barfuesser-brauhaus.de/standorte/standort-goeppingen](https://www.barfuesser-brauhaus.de/standorte/standort-goeppingen/) | +49 7161 9886530 | unverified |
| Brauerei Gasthof zum Rössle | Ehingen (Donau) | `microbrewery` | [roessle-bier-ehingen.de](https://www.roessle-bier-ehingen.de/) `403` | +49 7391 53465 | unverified |
| Brauerei Gasthof zum Schwert | Ehingen (Donau) | `microbrewery` | — | +49 7391 1288 | unverified |
| Brauerei-Gasthof Adler | Erbach | `microbrewery` | [adler-dellmensingen.de](http://adler-dellmensingen.de) | +49 7305 931190 | unverified |
| Brauerei-Gasthof Löwen | Sasbach | `microbrewery` | [loewen-sasbach.de/restaurant.html](https://loewen-sasbach.de/restaurant.html) | +49 7841 20780 | unverified |
| Brauereigasthof Adler | Oberstadion | `microbrewery` | [brauereigasthof-moosbeuren.de/index.php?redirect=1](https://www.brauereigasthof-moosbeuren.de/index.php?redirect=1) `400` | +49 7357 921990 | unverified |
| Brauereigasthof Adler | Herbertingen | `microbrewery` | [adlerbrauerei.de](http://www.adlerbrauerei.de/) `→ adler-hundersingen.de` | +49 7586 378 | unverified |
| Brauereigasthof Engel | Isny im Allgäu | `microbrewery` | [engel-isny.de](http://www.engel-isny.de/) | — | unverified |
| Brauereigasthof Rössle | Riedlingen | `microbrewery` | [brauerei-blank.de](http://www.brauerei-blank.de) | +49 7373 643 | unverified |
| Brauereigasthof Schöre | Tettnang | `microbrewery` | [schoere.de](https://www.schoere.de/) | +49 7528 2317 | unverified |
| Brauereigaststätte Pflug | Langenau | `microbrewery` | [pflugbrauerei.de](https://www.pflugbrauerei.de/) | +49 7348 6237 | unverified |
| Brauhaus Joh. Albrecht | Konstanz | `microbrewery` | [brauhaus-joh-albrecht.de/konstanz](https://www.brauhaus-joh-albrecht.de/konstanz/) | +49 7531 25045 | unverified |
| Brauhaus Schwanen | Esslingen am Neckar | `microbrewery` | [schwanen-es.de](https://schwanen-es.de) | +49 711 35 32 53 | unverified |
| Bräuhaus Ummendorf | Ummendorf | `microbrewery` | [braeuhaus.de](https://braeuhaus.de/) | +49735144430 | unverified |
| Brauhaus Zollernalb | Albstadt | `microbrewery` | [brauhaus-zollernalb.de](https://www.brauhaus-zollernalb.de/) | +49 7431 9482941 | unverified |
| Bruder Jacob | Maulbronn ⚠ | `microbrewery` | — | — | unverified |
| Canucks Braukunst | Schemmerhofen | `microbrewery` | [canucksbraukunst.com](https://www.canucksbraukunst.com/) | +49 7356 6622432 | unverified |
| Christophbräu | Gaggenau | `microbrewery` | [christophbraeu.de](https://www.christophbraeu.de/) | +49 7225 70393 | unverified |
| Dorfkrug | Kenzingen | `microbrewery` | — | — | unverified |
| Ganter Brauereiausschank | Freiburg im Breisgau ⚠ | `microbrewery` | [ganter-brauereiausschank.de](https://www.ganter-brauereiausschank.de/) | +49 761 34367 | unverified |
| Gasthaus Löwen | Unterreichenbach | `microbrewery` | [loewengasthaus.de](https://www.loewengasthaus.de/) | +49 7235 231 | unverified |
| Gasthaus zum Ochsen | Ravenstein | `microbrewery` | — | +49 6297 219 | unverified |
| Gasthaus-Brauerei Max & Moritz | Kressbronn am Bodensee | `microbrewery` | [maxmoritz-bier.de](https://www.maxmoritz-bier.de/) | +49 7543 6508 | unverified |
| Gasthof Lamm | Abtsgmünd | `microbrewery` | [lammbrauerei.de](https://www.lammbrauerei.de/) | — | unverified |
| Gerber Bräu | Uhingen | `microbrewery` | [gerber-park.de/gastronomie/brauhaus](https://gerber-park.de/gastronomie/brauhaus/) | +49 7161 946970 | unverified |
| Glasmännlehütte | Baiersbronn ⚠ | `microbrewery` | [glasmaennlehuette.de](https://www.glasmaennlehuette.de/) | +49 7442 121433 | unverified |
| Hausbrauerei des Kulturvereins | Königsbronn | `microbrewery` | [kulturverein-koenigsbronn.de/hausbrauerei](https://www.kulturverein-koenigsbronn.de/hausbrauerei/) | — | unverified |
| Hausbrauerei Feierling | Freiburg im Breisgau | `microbrewery` | [feierling.de](http://www.feierling.de/) | +49 761 243480 | unverified |
| Hieronymus Brauereiausschank | Kippenheim | `microbrewery` | [hieronymusausschank.de](https://www.hieronymusausschank.de) | +49 7825 9669 | unverified |
| Hirsch Brauerei + Gasthof | Steinheim am Albuch | `microbrewery` | [hirschbrauerei-soehnstetten.de](https://www.hirschbrauerei-soehnstetten.de/) `→ ts.domainname.de` | +49 7323 6558 | unverified |
| Hopfengut No20 | Tettnang | `microbrewery` | [hopfengut.de/gaststaette](https://www.hopfengut.de/gaststaette) | +49 7542 952206 | unverified |
| Hotel Adler | Zuzenhausen | `microbrewery` | [brauereigasthof-adler.de](http://www.brauereigasthof-adler.de) | +49 6226 92070 | unverified |
| Kulturbrauerei Heidelberg | Heidelberg ⚠ | `microbrewery` | [heidelberger-kulturbrauerei.de](https://www.heidelberger-kulturbrauerei.de/) | +49 6221 502980 | unverified |
| LandBrauHaus \| Brauhaus 2.0 GmbH | Remchingen | `microbrewery` | [landbrauhaus.de](https://www.landbrauhaus.de/) | +49 7232 3149960 | unverified |
| Leutkircher Kulturbrauerei | Leutkirch im Allgäu | `microbrewery` | [leutkircher-kulturbrauerei.de](https://www.leutkircher-kulturbrauerei.de) `→ leutkircher-kulturbrauerei.de` | +49 7561 8489801 | unverified |
| Lindenbräu | Waldbronn | `microbrewery` | [lindenbraeu-waldbronn.de](https://lindenbraeu-waldbronn.de/) | +49 7243 652881 | unverified |
| Lobdengau-Brauerei | Schriesheim ⚠ | `microbrewery` | [lobdengau-brauerei.de](https://www.lobdengau-brauerei.de/) | +49 173 8623820 | unverified |
| Löffler | Hardheim ⚠ | `microbrewery` | — | — | unverified |
| Maiwald 12 | Oberkirch | `microbrewery` | [maiwald12.de](https://www.maiwald12.de/) | — | unverified |
| Martinsbräu Freiburg | Freiburg im Breisgau | `microbrewery` | [martinsbräu-freiburg.de](https://www.martinsbräu-freiburg.de) `muerto` | +49 761 3870018 | unverified |
| Mostbesen im Köpplegarten | Oberkochen ⚠ | `microbrewery` | [besen.koepplegarten.de](http://www.besen.koepplegarten.de) `→ koepplegarten.de` | — | unverified |
| Neckarmüller | Tübingen | `microbrewery` | [neckarmueller.de](https://www.neckarmueller.de/) | +49 7071 27848 | unverified |
| NeckarSulmer Brauhaus | Neckarsulm | `microbrewery` | [brauhaus-neckarsulm.de](https://www.brauhaus-neckarsulm.de/) `→ neckarsulmer-brauhaus.de` | +497132343511 | unverified |
| Paulas Alb | Ehingen (Donau) | `microbrewery` | [adlerehingen.de/wirtshaus](https://www.adlerehingen.de/wirtshaus/) | +49 7391 500460 | unverified |
| Platzhirsch | Pforzheim | `microbrewery` | [platzhirsch-pforzheim.de](https://www.platzhirsch-pforzheim.de) | +49 7231 7819300 | unverified |
| Pronto Pizza Presto | Stockach | `microbrewery` | [pronto-pizza-presto-stockach.de](https://www.pronto-pizza-presto-stockach.de/) | +49 7771 929500 | unverified |
| Rossknecht am Reithausplatz | Ludwigsburg | `microbrewery` | [rossknecht-lb.de](https://rossknecht-lb.de) | +49 7141 902 551 | unverified |
| Rossknecht im Schloss | Bietigheim-Bissingen ⚠ | `microbrewery` | [rossknecht-bibi.de](https://rossknecht-bibi.de/) | +49 7142 913791 | unverified |
| Roter Ochsen | Ellwangen (Jagst) | `microbrewery` | [roter-ochsen-ellwangen.de](https://www.roter-ochsen-ellwangen.de/) | — | unverified |
| Salzscheuer Bräu | Marbach am Neckar ⚠ | `microbrewery` | [salzscheuer.com](http://www.salzscheuer.com) `muerto` | +49 7144 889754 | unverified |
| Schmidener Eintracht | Fellbach ⚠ | `microbrewery` | [haemmerle-braeu.de](https://www.haemmerle-braeu.de/) | — | unverified |
| Schussenrieder Erlebnisbrauerei | Bad Schussenried | `microbrewery` | [schussenrieder.de](https://www.schussenrieder.de/) | +49 7583 40411 | unverified |
| Schwanen-Bräu | Filderstadt | `microbrewery` | [schwanen-braeu.de](https://www.schwanen-braeu.de/) | +49 711 706954 | unverified |
| Sophie´s Brauhaus | Stuttgart | `microbrewery` | [sophies-brauhaus.de](https://www.sophies-brauhaus.de/) | +49 711 610962 | unverified |
| Stiftsscheuer | Kirchheim unter Teck | `microbrewery` | [stiftsscheuer.de](http://www.stiftsscheuer.de) | +49 7021 736154 | unverified |
| Stoffel's Stadtbräu | Wangen im Allgäu | `microbrewery` | [stoffels-stadtbraeu.de](https://www.stoffels-stadtbraeu.de/) | +49 7522 707484 | unverified |
| Sudhaus | Schwäbisch Hall | `microbrewery` | [sudhaus-sha.de](http://www.sudhaus-sha.de/) | — | unverified |
| TOMO Bräu Biertutorium | Reutlingen | `microbrewery` | [tomo-braeu.de](http://www.tomo-braeu.de) `muerto` | +49 7121 580868 | unverified |
| Turmbräu | Freudenstadt | `microbrewery` | [turmbraeu.de](https://www.turmbraeu.de) `→ xn--turm-bru-6za.de` | +49 7441 905121 | unverified |
| Vetter Alt-Heidelberger Brauhaus | Heidelberg ⚠ | `microbrewery` | [brauhaus-vetter.de](https://www.brauhaus-vetter.de) | +49 6221 165850 | unverified |
| Vogel Hausbräu Durlach | Karlsruhe | `microbrewery` | [vogelbraeu.de](https://www.vogelbraeu.de/) | +49 721 81968-0 | unverified |
| Vogel Hausbräu Ettlingen | Ettlingen | `microbrewery` | [vogelbraeu.de](https://www.vogelbraeu.de) | +49 7243 561720 | unverified |
| Vogelbräu Karlsruhe | Karlsruhe | `microbrewery` | [vogelbraeu.de](https://www.vogelbraeu.de/) | +49 721 377571 | unverified |
| Wallhall | Bruchsal ⚠ | `microbrewery` | [brauhaus-wallhall-bruchsal.de](https://www.brauhaus-wallhall-bruchsal.de/) | — | unverified |
| Weißbier-Biergarten | Freiberg am Neckar ⚠ | `microbrewery` | — | — | unverified |
| Wichtel | Böblingen | `microbrewery` | [wichtel.de](https://www.wichtel.de/) | +49 7031 3069899 | unverified |
| Wichtel | Stuttgart | `microbrewery` | [wichtel.de](https://www.wichtel.de/) | +4971130556732 | unverified |
| Wirtshaus beim Hader-Karle | Villingen-Schwenningen | `microbrewery` | [hader-karle.de](https://www.hader-karle.de/) | — | unverified |
| Wirtshaus Klingenstein | Blaustein ⚠ | `microbrewery` | [klingenstein.online/de/wirtshaus.html](https://klingenstein.online/de/wirtshaus.html) | — | unverified |
| Wirtshaus Schalander | Aulendorf | `microbrewery` | [schlossbrauerei-aulendorf.de](https://www.schlossbrauerei-aulendorf.de/) | +49 7525 9213520 | unverified |
| Wirtshaus zum Farren | Tuttlingen ⚠ | `microbrewery` | — | — | unverified |
| Woinemer Hausbrauerei | Weinheim | `microbrewery` | [woinemer-brauerei.de](https://www.woinemer-brauerei.de) | +49 6201 12001 | unverified |

## Residual Wikidata que OSM no trae — 10

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Brauerei Egolf | Schefflenz | [brauerei-egolf.de](https://www.brauerei-egolf.de/) | unverified |
| Brauerei Letzguss | Schefflenz | — | unverified |
| Brauerei Zoller-Hof | Sigmaringen | [zoller-hof.de](https://www.zoller-hof.de) | unverified |
| Brauerei Zoller-Hof | Sigmaringen | [zoller-hof.de](https://www.zoller-hof.de/) | unverified |
| Ehem. Poststation und Brauerei Schönbuchstraße 48 | Tübingen | — | unverified |
| Ehemalige Brauerei Heinrich | Tübingen | — | unverified |
| Kronenbrauerei Söflingen | Ulm | [kronenbier.de](https://www.kronenbier.de/) | unverified |
| Lenzei | Tübingen | — | unverified |
| Schloss Schmiedelfeld | Sulzbach-Laufen | — | unverified |
| Schuchmann’sche Brauerei | Heilbronn | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
