# Sachsen — cerveza

- **CSV destino** `data/csv/de/ostdeutschland/sachsen.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-SN`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 101 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

La columna **clase** indica qué tag de OSM trajo el candidato, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 89 (A=52 · B=11 · C=26 · 15 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| "Braukeller" Schützenhaus Pulsnitz | Pulsnitz ⚠ | `craft=brewery` | [schuetzenhaus-pulsnitz.com/Braukeller](https://www.schuetzenhaus-pulsnitz.com/Braukeller/) `→ schuetzenhaus-pulsnitz.de` | — | unverified |
| Adler Brauerei Coswig Schröter & Krutz GbR | Coswig | `craft=brewery` | [loessnitzpils.de](https://www.loessnitzpils.de/) | +49 3523 75519 | unverified |
| Bautzener Brauhaus | Bautzen | `craft=brewery` | [bautzener.de](https://www.bautzener.de/) | +49 3591 491456 | unverified |
| Bayerischer Bahnhof | Leipzig | `craft=brewery` | [bayerischer-bahnhof.de](https://www.bayerischer-bahnhof.de/) | +49 341 1245760 | unverified |
| Bergquell-Brauerei | Löbau | `craft=brewery` | [bergquell-loebau.de](https://www.bergquell-loebau.de/) `→ bergquell-porter.de` | +49 3585 47470 | unverified |
| Bierfabrik Erzgebirge | Pockau-Lengefeld ⚠ | `craft=brewery` | [bierfabrik-erzgebirge.de](https://bierfabrik-erzgebirge.de/) | +49 172 9598266 | unverified |
| Bierseitenhof | Rosenbach/Vogtl. ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Einsiedel | Amtsberg ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Richzenhain | Waldheim ⚠ | `craft=brewery` | [brauerei-richzenhain.de](http://www.brauerei-richzenhain.de/) | — | unverified |
| Brauerei Vielau | Reinsdorf | `craft=brewery` | [brauerei-vielau.com](http://www.brauerei-vielau.com) | +49 375 671012 | unverified |
| Brauhaus am Bahnhof | Halsbrücke | `craft=brewery` | [brauhaus-am-bahnhof.de](https://www.brauhaus-am-bahnhof.de/) | +49 3731 2031266 | unverified |
| Brauhaus an der Thomaskirche | Leipzig | `craft=brewery` | [brauhaus-thomaskirche.de](https://www.brauhaus-thomaskirche.de/) | +49 341 2126110 | unverified |
| Brauhaus Hartmannsdorf | Hartmannsdorf | `craft=brewery` | [braha.de](http://www.braha.de/) | +49 3722 71910 | unverified |
| Brauhaus Napoleon | Leipzig | `craft=brewery` | [brauhaus-leipzig.com](https://www.brauhaus-leipzig.com/) | +493412467676 | unverified |
| Brauhaus Nieder Seifersdorf | Prachenau ⚠ | `craft=brewery` | — | — | unverified |
| Brauhaus Radebeul | Radebeul | `craft=brewery` | [brauhaus-radebeul.de](https://www.brauhaus-radebeul.de/) | — | unverified |
| Braumanufaktur Radebeul | Radebeul ⚠ | `craft=brewery` | [braumanufaktur-radebeul.de](https://www.braumanufaktur-radebeul.de/) `muerto` | — | unverified |
| Braumanufaktur Schmilka | Bad Schandau | `craft=brewery` | — | — | unverified |
| Braumanufaktur sudfrei | Freital | `craft=brewery` | [sudfrei.de](https://sudfrei.de) | — | unverified |
| Cliff's Brauwerk | Leipzig | `craft=brewery` | [cliffs-brauwerk-leipzig.de](https://www.cliffs-brauwerk-leipzig.de/) `→ cliffs-brauwerk.com` | +49 341 97441002 | unverified |
| Cunewalder ProBier-Werkstatt | Cunewalde | `craft=brewery` | [probier-werkstatt.de](https://www.probier-werkstatt.de) | +49 35877 886400 | unverified |
| Eastsidebrew | Mittelherwigsdorf | `craft=brewery` | [eastsidebrew.de](https://www.eastsidebrew.de) `muerto` | — | unverified |
| Frenzel-Bräu | Bautzen | `craft=brewery` | [frenzel-braeu.de](https://www.frenzel-braeu.de) | +49 3591 5984 401 | unverified |
| Glückauf-Brauerei GmbH Gersdorf | Gersdorf | `craft=brewery` | [glueckaufbiere.de](https://www.glueckaufbiere.de/) | +49 37203 9100 | unverified |
| Hausbrauerei Schiller | Coswig | `craft=brewery` | [bierscheune.com](https://www.bierscheune.com) `muerto` | — | unverified |
| Hofbrauerei Lohmen | Lohmen | `craft=brewery` | [hofbrauerei-lohmen.de](https://www.hofbrauerei-lohmen.de/) | — | unverified |
| Kevin Brewery | Zwickau | `craft=brewery` | [kevin-brewery.de](https://kevin-brewery.de) | +49 176 60902538 | unverified |
| KHW Kleine Heile Welt Bräu | Marienberg | `craft=brewery` | [khwb.net](https://www.khwb.net) `muerto` | — | unverified |
| Kjell.beer | Glauchau | `craft=brewery` | [kjell.beer](https://www.kjell.beer/) | — | unverified |
| Kohrener Land Bräu | Frohburg | `craft=brewery` | [kohrenerlandbräu.de](https://kohrenerlandbräu.de) `muerto` | — | unverified |
| Kokille | Leipzig | `craft=brewery` | [kokille-braukombinat.de](https://kokille-braukombinat.de/) | — | unverified |
| Kräcker-Bräu GbR | Frohburg | `craft=brewery` | [kraeckerbier.de](https://www.kraeckerbier.de) | +49 34345 522727 | unverified |
| Lohrmanns | Dresden | `craft=brewery` | [lohrmannsbrew.de](https://lohrmannsbrew.de/) | — | unverified |
| Marx Chemnitzer Bier | Chemnitz | `craft=brewery` | [marx-bier.de](https://marx-bier.de/) | +49 371 65137770 | unverified |
| Mauritius Brauerei GmbH | Zwickau | `craft=brewery` | [mauritius-brauerei.de](https://www.mauritius-brauerei.de) `→ mauritius-brauerei.de` | +49 375 49490 | unverified |
| Munzer Braumanufaktur | Chemnitz | `craft=brewery` | [braumanufaktur-munzer.de](https://braumanufaktur-munzer.de) | +49 371 66647993 | unverified |
| Nerchauer Brauhaus | Grimma | `craft=brewery` | [nerchauer-brauhaus.de](https://nerchauer-brauhaus.de/) | +49 34382 40574 | unverified |
| Neustädter Hausbrauerei Christian Schwingenheuer | Dresden | `craft=brewery` | [obergaerig.de](http://www.obergaerig.de) | +49 351 7993774 | unverified |
| Plagwitzer Brauerei | Leipzig | `craft=brewery` | [plagwitzer-brauerei.de](https://www.plagwitzer-brauerei.de/) | — | unverified |
| Privatbrauerei Eibau | Kottmar | `craft=brewery` | [eibauer.de](https://www.eibauer.de) | +49 3586 78140 | unverified |
| Privatbrauerei Fiedler | Scheibenberg | `craft=brewery` | [brauerei-fiedler.de](https://www.brauerei-fiedler.de/) | +49 37349 8249 | unverified |
| Privatbrauerei Rechenberg GmbH & Co. KG | Rechenberg-Bienenmühle | `craft=brewery` | [rechenberger.com](https://www.rechenberger.com/) | — | unverified |
| Privatbrauerei Specht | Ehrenfriedersdorf | `craft=brewery` | [privatbrauerei-specht.de](https://www.privatbrauerei-specht.de/) | — | unverified |
| Radeberger Exportbierbrauerei | Radeberg | `craft=brewery` | [radeberger.de](https://www.radeberger.de/) | — | unverified |
| Rumpelbräu | Rechenberg-Bienenmühle | `craft=brewery` | [rumpelbraeu.de](https://www.rumpelbraeu.de/) | +49 35057 50001 | unverified |
| Stonewood Braumanufaktur | Chemnitz ⚠ | `craft=brewery` | [brau-art.de](https://brau-art.de/) | — | unverified |
| Sud Ost | Görlitz ⚠ | `craft=brewery` | [sudost.de](https://www.sudost.de) | +49 3581 7648666 | unverified |
| Synde Bräu | Leipzig | `craft=brewery` | [syndebraeu.de](https://www.syndebraeu.de/) | — | unverified |
| Urbanowicz Braukollektiv | Dresden | `craft=brewery` | — | — | unverified |
| Wittichenauer Stadtbrauerei | Wittichenau ⚠ | `craft=brewery` | [wittichenauer.de](https://www.wittichenauer.de/) | +49 35725 7510 | unverified |
| Ybnstoker | Eibenstock | `craft=brewery` | [ybnstoker.de](http://www.ybnstoker.de) | +49 37752 879850 | unverified |
| Ybnstoker Brauerei GbR | Eibenstock ⚠ | `craft=brewery` | [ybnstoker.de](https://www.ybnstoker.de) | +49 37752879850 | unverified |
| Brauerei Reichenbrand | Neukirchen/Erzgeb. ⚠ | `industrial` | [reichenbrander.de](https://reichenbrander.de) | +49 371 850214 | unverified |
| Feldschlößchen Brauerei | Bannewitz ⚠ | `industrial` | [feldschloesschen.de](https://www.feldschloesschen.de/) | — | unverified |
| Freiberger Brauhaus GmbH | Freiberg | `industrial` | — | — | unverified |
| Kasten Brauerei | Leipzig ⚠ | `industrial` | [kastenbrauerei.de](https://kastenbrauerei.de/) | +4917643334277 | unverified |
| Krostitzer Brauerei GmbH | Krostitz | `industrial` | [ur-krostitzer.de](https://www.ur-krostitzer.de/) | — | unverified |
| Landskron Brau-Manufaktur | Görlitz | `industrial` | [landskron.de](https://www.landskron.de/) `403` | — | unverified |
| Privatbrauerei Karl Blechschmidt | Treuen ⚠ | `industrial` | — | +49374682867 | unverified |
| Sternburg Brauerei GmbH | Leipzig | `industrial` | [sternburg-bier.de](https://www.sternburg-bier.de/) | — | unverified |
| Sternquell-Brauerei GmbH | Plauen | `industrial` | — | +49 371 36680 | unverified |
| Wernersgrüner Brauerei | Stützengrün ⚠ | `industrial` | [wernesgruener.de/index.html](https://www.wernesgruener.de/index.html) | — | unverified |
| Wernesgrüner Brauerei | Stützengrün ⚠ | `industrial` | [wernesgruener.de/index.html](https://www.wernesgruener.de/index.html) | — | unverified |
| Ball- und Brauhaus Watzke | Dresden | `microbrewery` | [watzke.de](https://www.watzke.de) | +49 351 852920 | unverified |
| Bautzner Tor | Dresden | `microbrewery` | [bautznertor.de](https://www.bautznertor.de/) | — | unverified |
| Bernhard Lippmann | Treuen | `microbrewery` | — | +49 37468 2508 | unverified |
| Bräu-Stübl Reichenbrand | Chemnitz | `microbrewery` | [braeu-stuebl.de](https://www.braeu-stuebl.de/) | +49 371 808541 | unverified |
| Brauerei Gasthof | Zwönitz | `microbrewery` | [brauerei-zwoenitz.de/gaststaette.php](https://www.brauerei-zwoenitz.de/gaststaette.php) `404` | +49 37754 59905 | unverified |
| Brauereimuseum Zur Brauschänke | Schöneck/Vogtl. | `microbrewery` | [schoeneck-pension.de/gaststaette.html](http://www.schoeneck-pension.de/gaststaette.html) `muerto` | +49 37464 88232 | unverified |
| Brauhaus Alter Elbehof | Torgau | `microbrewery` | [elbehof.eu/de/restaurant-biergarten.html](https://www.elbehof.eu/de/restaurant-biergarten.html) | +49 3421 904525 | unverified |
| Brauhaus Lieske | Oßling | `microbrewery` | [brauhaus-lieske.de](http://www.brauhaus-lieske.de) `muerto` | +49 35792 59387 | unverified |
| Brauhaus Obermühle | Görlitz | `microbrewery` | [obermuehle-goerlitz.de/restaurant](https://www.obermuehle-goerlitz.de/restaurant) | +49 3581 879832 | unverified |
| Brauhaus Pirna „Zum Giesser“ | Pirna | `microbrewery` | [brauhaus-pirna.de](https://www.brauhaus-pirna.de/) `→ brauhauspirna.de` | +49 3501 464646 | unverified |
| Burgkeller | Tharandt ⚠ | `microbrewery` | [burgkellertharandt.eatbu.com](https://burgkellertharandt.eatbu.com) | +49 35203 175398 | unverified |
| Burgkeller Tharandt | Tharandt | `microbrewery` | [burgkellertharandt.eatbu.com](https://burgkellertharandt.eatbu.com) | +49 178 5748034 | unverified |
| Gerüchteküche | Freital | `microbrewery` | — | +49 174 8447591 | unverified |
| Hammerbräu | Riesa | `microbrewery` | [hammerbraeu.de](http://www.hammerbraeu.de) `→ xn--hammerbru-22a.de` | +49 3525 530930 | unverified |
| Hausbrauerei Ronald Rosner | Sohland an der Spree | `microbrewery` | [brauereisohland.de](http://www.brauereisohland.de) | +49 35936 41685 | unverified |
| HopfenMichel | Leipzig | `microbrewery` | [hopfenmichel.de](https://hopfenmichel.de/) | — | unverified |
| Kasten | Leipzig | `microbrewery` | [kasten-leipzig.de](https://kasten-leipzig.de) | — | unverified |
| Lotters | Aue ⚠ | `microbrewery` | [hotel-blauerengel.de](https://hotel-blauerengel.de/) | — | unverified |
| Ranunkelhof | Pirna | `microbrewery` | [ranunkelhof.de](https://ranunkelhof.de) | +49 3501 7709777 | unverified |
| Schalterhalle Bayrischer Bahnhof | Leipzig ⚠ | `microbrewery` | — | — | unverified |
| Schwerter Schankhaus | Meißen | `microbrewery` | [schwerter-schankhaus.de](https://www.schwerter-schankhaus.de/) | +49 3521 409280 | unverified |
| Trollschänke | Rodewisch ⚠ | `microbrewery` | [troll-schaenke.de](https://www.troll-schaenke.de/) | +49 3744 365588 | unverified |
| Turm-Brauhaus | Chemnitz | `microbrewery` | [turmbrauhaus.de](http://www.turmbrauhaus.de) | +49 371 9095095 | unverified |
| Watzke am Goldenen Reiter | Dresden | `microbrewery` | [watzke.de/watzke-am-goldenen-reiter](https://watzke.de/watzke-am-goldenen-reiter/) | +49 351 8106820 | unverified |
| Zum Gerücht | Dresden | `microbrewery` | [zum-geruecht.de](https://www.zum-geruecht.de) | +49 351 2513425 | unverified |
| Zum Schlossturm | Auerbach/Vogtland | `microbrewery` | [zumschlossturm.de](https://zumschlossturm.de/) | +49 3744 3098000 | unverified |

## Residual Wikidata que OSM no trae — 12

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Actien-Bierbrauerei zu Reisewitz | Pesterwitz | — | unverified |
| Altes Schloss Hainewalde | Hainewalde | — | unverified |
| Am Helfenberger Park 6-7 | Dresden | — | unverified |
| Ballsaal Lindengarten | Dresden | — | unverified |
| Brauerei Kesselsdorf | Pesterwitz | — | unverified |
| Brauerei Paul Lohse | Geising | — | unverified |
| Gasthof Naundorf | Radebeul | — | unverified |
| Klosterbrauerei St. Marienstern | Panschwitz-Kuckau | — | unverified |
| Müglitztalbrauerei Glashütte | Glashütte | — | unverified |
| Städtische Bierbrauerei Pirna | Pirna | — | unverified |
| Untere Dorfstraße 34 | Oderwitz | — | unverified |
| Waldschlößchen-Brauerei | Dresden | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
