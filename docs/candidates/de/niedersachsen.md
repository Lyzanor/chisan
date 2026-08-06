# Niedersachsen — cerveza

- **CSV destino** `data/csv/de/norddeutschland/niedersachsen.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-NI`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 87 candidatos contra las **1.415 Braustätten** que Destatis cuenta en toda Alemania en 2025 (el desglose por Land solo se publica para Bayern, Baden-Württemberg y Nordrhein-Westfalen; el resto vive en GENESIS 73411-0002, que pide registro); el CSV tiene hoy 0 filas de cerveza aquí

Método, trampas y criterio de triaje: `docs/de/cerveza.md`. Columna **clase** = qué tag de OSM lo trajo, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 83 (A=36 · B=6 · C=41 · 18 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Alte Liebe Cuxhaven | Cuxhaven | `craft=brewery` | [alte-liebe-cuxhaven.com](https://www.alte-liebe-cuxhaven.com/) | — | unverified |
| Altenauer Brauerei | Clausthal-Zellerfeld | `craft=brewery` | — | — | unverified |
| Aper Brauhaus S.B. GmbH | Apen | `craft=brewery` | [aper-brauhaus.de](https://aper-brauhaus.de/) `muerto` | +49 160 5519 795 | unverified |
| BOGLERS Braustube | Uetze | `craft=brewery` | [boglers.com](https://www.boglers.com/) | +49 5147 978919 | unverified |
| Brauakademie Zellerfeld | Clausthal-Zellerfeld ⚠ | `craft=brewery` | [brauakademie-zellerfeld.com](https://www.brauakademie-zellerfeld.com/) `→ brauakademie-zellerfeld.de` | +49 5323 81024 | unverified |
| Brauerei BEURA GmbH & Co. KG | Osnabrück | `craft=brewery` | [beura.de](https://www.beura.de/) `muerto` | — | unverified |
| Brauerei Carl Betz GmbH | Celle | `craft=brewery` | [celler-bier.de](https://celler-bier.de/) | +49 5141 85025 | unverified |
| Brauerei De Lütte - A7 Evendorf | Egestorf | `craft=brewery` | — | — | unverified |
| Brauhaus Felsenkeller | Lauenau | `craft=brewery` | [ruppbraeu.de](https://www.ruppbraeu.de/) | +49 5043 2275 | unverified |
| Braumanufaktur | Wennigsen (Deister) | `craft=brewery` | — | — | unverified |
| Das Freie | Sehnde | `craft=brewery` | [das-freie.de](https://www.das-freie.de) | — | unverified |
| De Lütte | Salzhausen | `craft=brewery` | [de-luette.de](https://de-luette.de/) | +49 4172 978 50 81 | unverified |
| Egestorfer Fuhrenbräu | Egestorf | `craft=brewery` | [egestorfer-fuhrenbraeu.de](http://egestorfer-fuhrenbraeu.de) | +49 171 62 77 686 | unverified |
| Gemeinschaftsbrauhaus in der Alte Feuerwehr | Eicklingen ⚠ | `craft=brewery` | [hobbybrauer-flotwedel.de](https://hobbybrauer-flotwedel.de) | — | unverified |
| Hellmer's Mikrobrauerei | Rastede ⚠ | `craft=brewery` | [brauerei-hellmer.de](https://www.brauerei-hellmer.de) `403` | +49 152 22442039 | unverified |
| Hildesheimer Braumanufaktur | Hildesheim | `craft=brewery` | [hildesheimer-braumanufaktur.de](https://www.hildesheimer-braumanufaktur.de/) | +49 1577 1276675;+49 163 9633516 | unverified |
| Hofbrauhaus Wolters | Braunschweig | `craft=brewery` | [hofbrauhaus-wolters.de](https://hofbrauhaus-wolters.de/) | +49 531 27 18-0 | unverified |
| Hofbruhuus Heidhoff | Engeln ⚠ | `craft=brewery` | [hoffbruhuus.de](https://www.hoffbruhuus.de/) | — | unverified |
| Hüpscher Werkstatt Bräu | Pattensen | `craft=brewery` | [huepschershop.jimdo.com](https://huepschershop.jimdo.com/) `muerto` | — | unverified |
| Lonesome Oak | Braunschweig | `craft=brewery` | [lonesomeoakbrewing.de](https://lonesomeoakbrewing.de/) | — | unverified |
| Mashsee Brauerei GmbH & Co. KG | Hannover | `craft=brewery` | [mashsee.de](https://www.mashsee.de/) `→ shop.mashsee.de` | +49 511 37022974 | unverified |
| Meierhöfer | Obernkirchen | `craft=brewery` | — | — | unverified |
| National Jürgens Brauerei | Braunschweig | `craft=brewery` | [njb-brauerei.de](https://www.njb-brauerei.de) | +49 531 28856907 | unverified |
| OLDENBräu | Oldenburg ⚠ | `craft=brewery` | [oldenbrew.de](https://www.oldenbrew.de/) `403` | +49 441 3618050 | unverified |
| OLs Brauhaus | Oldenburg ⚠ | `craft=brewery` | [ols-brauhaus.de](http://www.ols-brauhaus.de) `→ ols-brauerei.de` | +49 441 35018204 | unverified |
| Ratskeller | Buxtehude ⚠ | `craft=brewery` | [ratskeller-buxtehude.de](https://www.ratskeller-buxtehude.de/) | — | unverified |
| Robens Craft Beer | Springe | `craft=brewery` | [german-craft-beer-factory.de](http://german-craft-beer-factory.de) | — | unverified |
| Scholar Brauerei | Göttingen | `craft=brewery` | [scholarbeer.com](http://www.scholarbeer.com) `muerto` | +49 551 41616 | unverified |
| Sommerbecker Brauerei | Thomasburg ⚠ | `craft=brewery` | [sommerbecker-dachs.de](https://www.sommerbecker-dachs.de/) `→ dachs-brauhandwerk.de` | — | unverified |
| TH Brewing | Cloppenburg ⚠ | `craft=brewery` | [th-brewing.beer](https://th-brewing.beer) | +49 15566 639569 | unverified |
| Tungelner Brauerei | Wardenburg | `craft=brewery` | [my-bier.de](https://my-bier.de/) | +49 152 52843718 | unverified |
| Vareler Brauhaus und Brennerei | Varel | `craft=brewery` | [vareler-brauhaus.de/vareler_brauhausundbrennerei](https://vareler-brauhaus.de/vareler_brauhausundbrennerei/) | — | unverified |
| Verdener Brau Manufaktur GmbH | Verden (Aller) | `craft=brewery` | [bier-verden.de](http://bier-verden.de) | +49 152 215 233 63 | unverified |
| Wapeldörper Schoolbeer | Wiefelstede ⚠ | `craft=brewery` | [schoolbeer.de](https://www.schoolbeer.de) `404` | +49 170 2322259 | unverified |
| WendlandBräu | Clenze | `craft=brewery` | [storchenbier.de](https://www.storchenbier.de/) | +49 5844 9711111 | unverified |
| Wilhelms Hopven | Wilhelmshaven | `craft=brewery` | [wilhelmshaven-brauerei.de](https://wilhelmshaven-brauerei.de) | — | unverified |
| Bergbräu GmbH & Co. | Uslar ⚠ | `industrial` | — | — | unverified |
| Einbecker Brauhaus AG | Einbeck ⚠ | `industrial` | [einbecker.de](https://www.einbecker.de/) | — | unverified |
| Friesisches Brauhaus zu Jever GmbH & Co. KG | Jever ⚠ | `industrial` | [jever.de](https://www.jever.de/) | +49 4461 130 | unverified |
| Gilde Brauerei GmbH | Hannover | `industrial` | [gilde-brauerei.com](https://www.gilde-brauerei.com) | — | unverified |
| Privatbrauerei Herrenhausen | Hannover | `industrial` | [herrenhaeuser.de](https://www.herrenhaeuser.de) | +49 511 7907-0 | unverified |
| Privatbrauerei Wittingen | Wittingen | `industrial` | — | — | unverified |
| Altes Brauhaus | Steinfeld | `microbrewery` | — | +49 5492 2244 | unverified |
| Altes Brauhaus zu Fallersleben | Wolfsburg | `microbrewery` | [brauhaus-fallersleben.de](https://www.brauhaus-fallersleben.de/) `403` | +49 5362 3140 | unverified |
| Altstadt Treff | Braunschweig ⚠ | `microbrewery` | — | — | unverified |
| Biergarten Mühlengrund | Wienhausen ⚠ | `microbrewery` | — | — | unverified |
| Bleckeder Brauhaus | Bleckede | `microbrewery` | [bleckeder-brauhaus.de](http://www.bleckeder-brauhaus.de/) `→ denic.de` | +49 5852 500 | unverified |
| Braugasthaus Mühlengrund | Wienhausen ⚠ | `microbrewery` | [braugasthausmuehlengrund.de](https://www.braugasthausmuehlengrund.de/) | +49 5149 331 | unverified |
| Brauhaus | Soltau ⚠ | `microbrewery` | — | — | unverified |
| Brauhaus Alt Neuhaus | Neuhaus | `microbrewery` | [ulex.de/brauhaus](https://ulex.de/brauhaus/) | +49 4752 841033 | unverified |
| Brauhaus Ernst-August | Hannover | `microbrewery` | [brauhaus.net](https://www.brauhaus.net/) | +49 511 365950 | unverified |
| Brauhaus Goslar | Goslar | `microbrewery` | [brauhaus-goslar.de](https://www.brauhaus-goslar.de) | +49 5321 685804 | unverified |
| Die Biermünze | Clausthal-Zellerfeld ⚠ | `microbrewery` | [brauakademie-zellerfeld.com/gastronomie](https://www.brauakademie-zellerfeld.com/gastronomie/) | +49 5323 9539464 | unverified |
| Forellenhof | Walsrode | `microbrewery` | [forellenhof.de](https://forellenhof.de/) | +49 5161 9700 | unverified |
| Gasthausbrauerei & Brennerei Nolte | Lüneburg | `microbrewery` | [brauhausnolte.de](https://www.brauhausnolte.de) | +49 4131 52232 | unverified |
| Goldene Ananas | Horneburg | `microbrewery` | — | +49 4163 8619862 | unverified |
| Grafschafter Brauhaus | Nordhorn ⚠ | `microbrewery` | — | — | unverified |
| Gutshof Rethmar | Sehnde | `microbrewery` | — | — | unverified |
| Hausbrauerei Rampendahl | Osnabrück | `microbrewery` | [rampendahl.de](https://www.rampendahl.de/) | +49 541 24535 | unverified |
| Heinder Naturtrüb | Bad Salzdetfurth | `microbrewery` | [heinder-naturtrueb.de](http://www.heinder-naturtrueb.de) | — | unverified |
| Hofbräu Wirtshaus Bispingen | Bispingen | `microbrewery` | [snow-dome.de](http://www.snow-dome.de) `403` | +49 5194 43110 | unverified |
| Hopfen Gärtchen | Braunschweig ⚠ | `microbrewery` | — | — | unverified |
| Hotel Frommann | Buchholz in der Nordheide | `microbrewery` | [hotelfrommann.de](https://hotelfrommann.de/) | +49 4181 2870 | unverified |
| Jo's Food & Craft | Hannover | `microbrewery` | [jos-food-craft.de](https://www.jos-food-craft.de/) | +49 511 45790885 | unverified |
| Klindworths Gasthaus mit Brauerei | Sauensiek | `microbrewery` | — | — | unverified |
| La Grotta Cavallo | Salzhausen ⚠ | `microbrewery` | [lagrotta-delcavallo.de](https://www.lagrotta-delcavallo.de) `muerto` | +49 4172 8211 | unverified |
| Liquid Story beer & more | Braunschweig | `microbrewery` | [liquid-story.com](https://liquid-story.com) | — | unverified |
| Longh Linh China-Thai Bistro | Holzminden | `microbrewery` | — | +49 5531 1277864 | unverified |
| Löwen-Garten | Braunschweig | `microbrewery` | [loewengarten.com](https://loewengarten.com/) | — | unverified |
| Mälzer Brau- & Tafelhaus | Lüneburg | `microbrewery` | [maelzerbrauhaus.de](https://www.maelzerbrauhaus.de/) | +49 4131 47777 | unverified |
| Marienbräu | Jever ⚠ | `microbrewery` | [marienbraeu.com](https://www.marienbraeu.com) `muerto` | — | unverified |
| Meiers Lebenslust | Hannover ⚠ | `microbrewery` | [meiers-lebenslust.de](https://www.meiers-lebenslust.de/) | +49 511 8982250 | unverified |
| Norderneyer Brauhalle | Norderney ⚠ | `microbrewery` | [norderneyer-brauhaus.de/unsere-standorte/die-brauhalle](https://www.norderneyer-brauhaus.de/unsere-standorte/die-brauhalle/) | — | unverified |
| OLs Brauhaus am Hafen | Oldenburg | `microbrewery` | [ols-brauhaus.de](https://ols-brauhaus.de/) `→ ols-brauerei.de` | +49 441 26189 | unverified |
| Ostfriesen Bräu | Großefehn | `microbrewery` | [ostfriesenbraeu.de](https://www.ostfriesenbraeu.de/) | +49 4946 203 | unverified |
| Ostfriesische Küstenbrauerei zu Werdum | Werdum | `microbrewery` | [werdumer-hof.de](https://werdumer-hof.de/) | — | unverified |
| Ratsbrauhaus | Hann. Münden | `microbrewery` | [ratsbrauhaus.de](https://www.ratsbrauhaus.de/) | +49 5541 957107 | unverified |
| Restaurant Frommann | Buchholz in der Nordheide | `microbrewery` | [hotelfrommann.de](https://hotelfrommann.de/) | +49 4181 2870 | unverified |
| Restaurant im Hotel zum Löwen | Duderstadt | `microbrewery` | [hotelzumloewen.de](https://www.hotelzumloewen.de/) `→ loewenmomente.de` | +49 5527 849000 | unverified |
| Schadt's Brauerei Gasthaus | Braunschweig | `microbrewery` | [schadts-brauerei-gasthaus.de](https://schadts-brauerei-gasthaus.de/) | — | unverified |
| Vareler Brauhaus | Varel ⚠ | `microbrewery` | [vareler-brauhaus.de](https://www.vareler-brauhaus.de/) | +49 4451 3091 | unverified |
| Vosse-Schepers | Rhede (Ems) | `microbrewery` | [vosse-schepers.de/landhotel](https://vosse-schepers.de/landhotel/) | +49 4964 275 | unverified |
| Waldkater | Rinteln | `microbrewery` | [waldkater-rinteln.de](https://www.waldkater-rinteln.de/) | +49 5751 17980 | unverified |

## Residual Wikidata que OSM no trae — 4

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Anderter Brauerei | Laatzen | — | unverified |
| Braumanufaktur Härke | Peine | [braumanufaktur-haerke.de](http://www.braumanufaktur-haerke.de) | unverified |
| Nordstadt braut | Hannover | [nordstadt-braut.de](https://www.nordstadt-braut.de/) | unverified |
| Osteroder Lichtspielhaus | Osterode am Harz | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
