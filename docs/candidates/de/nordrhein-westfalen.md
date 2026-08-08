# Nordrhein-Westfalen — cerveza

- **CSV destino** `data/csv/de/westdeutschland/nordrhein-westfalen.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-NW`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 180 candidatos contra **131 Braustätten** que Destatis cuenta en Nordrhein-Westfalen en 2025; el CSV tiene hoy 0 filas de cerveza aquí

La columna **clase** indica qué tag de OSM trajo el candidato, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 161 (A=68 · B=21 · C=72 · 28 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| Ale-Mania | Bonn | `craft=brewery` | [fritz0830.wixsite.com/15168465](https://fritz0830.wixsite.com/15168465) `404` | — | unverified |
| Altenrüthener Landbierbrauerei | Rüthen | `craft=brewery` | — | — | unverified |
| Am Niederntor | Blomberg | `craft=brewery` | — | +49 5235 96000 | unverified |
| Aspera Brauerei Riese GmbH | Mülheim an der Ruhr | `craft=brewery` | [aspera-riese.de](http://www.aspera-riese.de/) | +49 208 588980 | unverified |
| Back- und Brauhaus | Hörstel | `craft=brewery` | — | — | unverified |
| Back- und Brauhaus Schwaney | Altenbeken ⚠ | `craft=brewery` | [backundbraufreunde.de](https://www.backundbraufreunde.de/) | +49 152 55917119 | unverified |
| Barmer Brauerei | Wuppertal | `craft=brewery` | [barmer-brauerei.de](https://www.barmer-brauerei.de/) | +49 202 253 60 617 | unverified |
| Benno’s Brauhaus | Witten ⚠ | `craft=brewery` | — | — | unverified |
| Bergmann Brauerei GmbH | Dortmund | `craft=brewery` | [harte-arbeit-ehrlicher-lohn.de](https://harte-arbeit-ehrlicher-lohn.de/) `→ die-bergmann-brauerei.de` | — | unverified |
| Bielefelder Braumanufaktur | Bielefeld | `craft=brewery` | [bielefelder.com](https://www.bielefelder.com) | +49 521 40086333 | unverified |
| Bier Bude | Duisburg | `craft=brewery` | [bierbude-duisburg.de](https://bierbude-duisburg.de/) | +49 1575 8344256 | unverified |
| Biermanufaktur-Langguth | Alsdorf | `craft=brewery` | [biermanufaktur-langguth.de](https://www.biermanufaktur-langguth.de/) | +49 2404 9598765 | unverified |
| Blackman's Craft | Bielefeld | `craft=brewery` | [blackmans-craft.de](https://blackmans-craft.de/) | +49 160 94975091 | unverified |
| Bottroper Bier | Bottrop | `craft=brewery` | [bottroper-bier.com](https://bottroper-bier.com/) | — | unverified |
| BrauArt LamaSan | Wendlinghausen | `craft=brewery` | — | +49 151 5058 2114 | unverified |
| Brauerei HELLER GmbH | Köln ⚠ | `craft=brewery` | [hellers.koeln](https://www.hellers.koeln/) | +49 221 242545 | unverified |
| Brauerei Joh. Cramer & Cie. KG | Nideggen | `craft=brewery` | — | — | unverified |
| Brauerei Kemker Kultuur | Everswinkel | `craft=brewery` | [brauerei-kemker.de](https://www.brauerei-kemker.de/) | +49 151 25267867 | unverified |
| Brauerei Kirchhellener Waldbräu | Bottrop | `craft=brewery` | — | — | unverified |
| Brauerei Rolinck | Steinfurt ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Schlüffken GmbH | Krefeld | `craft=brewery` | — | — | unverified |
| Brauerei Sünner | Köln ⚠ | `craft=brewery` | [suenner-brauerei.de](https://www.suenner-brauerei.de/) `muerto` | +49 221 987990 | unverified |
| Brauerei Viertelvorvier | Kreuzau ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Westheim | Marsberg ⚠ | `craft=brewery` | — | — | unverified |
| Brauhaus J. F. Irle | Siegen ⚠ | `craft=brewery` | — | — | unverified |
| Brauhof Hallenberg | Hallenberg | `craft=brewery` | [hallenberger-landbier.de](https://www.hallenberger-landbier.de/) | +49 171 2991801 | unverified |
| Bräukels | Lennestadt | `craft=brewery` | [braeukels.de](https://www.braeukels.de) `muerto` | — | unverified |
| Brauprojekt 777 | Voerde (Niederrhein) | `craft=brewery` | [brauprojekt.de](http://www.brauprojekt.de/) `403` | — | unverified |
| Brauwerk Schacht 8 | Haltern am See | `craft=brewery` | [brauwerk-schacht8.de](https://brauwerk-schacht8.de) | +49 176 78344275 | unverified |
| Brennerei Sonnenschein | Witten ⚠ | `craft=brewery` | — | — | unverified |
| Cölner Hofbräu P. Josef Früh KG | Köln | `craft=brewery` | — | — | unverified |
| Coltro | Hürth | `craft=brewery` | [coltro-brauerei.de](https://www.coltro-brauerei.de/) | +49 157 39261074; +49 172 1695349 | unverified |
| Das Dackel | Münster | `craft=brewery` | [dasdackel.de](http://www.dasdackel.de) | +49 251 37902300 | unverified |
| Dellmann’s | Wermelskirchen | `craft=brewery` | [dellmanns.de](https://dellmanns.de/) `404` | — | unverified |
| Die Mikrobrauerei | Pulheim ⚠ | `craft=brewery` | [heinenhof.de/mikrobrauerei](https://heinenhof.de/mikrobrauerei/) | — | unverified |
| Feldschlösschen Brauerei | Hamminkeln ⚠ | `craft=brewery` | — | — | **already-present** → `niederrhein-westfaelische-braumanufaktur-hamminkeln`. OSM lo nombra por la Feldschlösschen histórica que la Braumanufaktur ocupa desde 2016; su propia web la cita. Ni el nombre ni el dominio casaban, solo el punto: **el dedup por nombre no basta cuando OSM guarda el rótulo antiguo del edificio** |
| Finne Brauerei | Münster | `craft=brewery` | [finne-brauerei.de/pages/hafenbrauerei](https://finne-brauerei.de/pages/hafenbrauerei) | — | unverified |
| Geilings Bräu | Alpen ⚠ | `craft=brewery` | [geilings-braeu.de](https://geilings-braeu.de/) | +49 2842 404523 | unverified |
| Gemünder Brauerei | Schleiden | `craft=brewery` | — | — | unverified |
| Gilden Brauerei | Köln ⚠ | `craft=brewery` | [gilden.de](https://www.gilden.de/) | — | unverified |
| Hammona Braumanufaktur GbR | Hamm | `craft=brewery` | [hammona-braeu.de](https://www.hammona-braeu.de/) | +49 2385 7090618 | unverified |
| Havarie | Delbrück | `craft=brewery` | [havarie-braumanufaktur.de](https://www.havarie-braumanufaktur.de/) `404` | — | unverified |
| Hilfarther Brauhaus | Hückelhoven | `craft=brewery` | [hilfarther-brauhaus.de](https://hilfarther-brauhaus.de) | — | unverified |
| Hövels Hausbrauerei | Dortmund | `craft=brewery` | [hoevels-hausbrauerei.de](https://www.hoevels-hausbrauerei.de/) | — | unverified |
| Ilsen-Brauerei | Kreuztal | `craft=brewery` | [ilsen-brauerei.de](https://www.ilsen-brauerei.de/) | — | unverified |
| Josefs Bräu | Bad Lippspringe | `craft=brewery` | [josefsbraeu.de](https://www.josefsbraeu.de/) | +49 5252 9154270 | unverified |
| Laggenbecker Privatbrauerei | Ibbenbüren | `craft=brewery` | [laggenbecker.de](https://www.laggenbecker.de/) | +49 170 934 1920 | unverified |
| Läuterwerk | Münster | `craft=brewery` | [laeuterwerk.de](https://laeuterwerk.de) | +49 251 20817052 | unverified |
| Lippstädter Brauerei Thombansen | Lippstadt | `craft=brewery` | — | +49 2941 800 815 | unverified |
| Lüdinghauser Brauwerkstatt | Lüdinghausen ⚠ | `craft=brewery` | — | — | unverified |
| Münsteraner Finne GmbH | Telgte ⚠ | `craft=brewery` | [finne-brauerei.de](https://www.finne-brauerei.de/) | — | unverified |
| PiepNitz Craft-Bier Brauerei | Bochum | `craft=brewery` | [piepnitz.de](https://piepnitz.de) | +49 2327 3699840 | unverified |
| Privatbrauerei Heinrich | Fröndenberg/Ruhr | `craft=brewery` | [privatbrauerei-heinrich.de](https://www.privatbrauerei-heinrich.de/) | +49 2373 1728274 | unverified |
| Reissdorf | Rodenkirchen ⚠ | `craft=brewery` | — | — | unverified |
| Repetaler Heldenbräu | Attendorn | `craft=brewery` | — | — | unverified |
| Schaubrauerei "Emsbräustübchen" | Rietberg | `craft=brewery` | [gartenschaupark-rietberg.de/veranstaltungen/emsbraeustuebchen.html](https://www.gartenschaupark-rietberg.de/veranstaltungen/emsbraeustuebchen.html) | — | unverified |
| Schlüffken Brauerei | Krefeld ⚠ | `craft=brewery` | [schlueffken.de](https://www.schlueffken.de/) | — | unverified |
| Stiefel Jürgens | Beckum | `craft=brewery` | — | — | unverified |
| SuDWERK | Siegen ⚠ | `craft=brewery` | — | — | unverified |
| Third Sector Brewing | Tönisvorst ⚠ | `craft=brewery` | [thirdsectorbrewing.de](https://thirdsectorbrewing.de) `muerto` | — | unverified |
| Uerige Hausbrauerei | Düsseldorf | `craft=brewery` | [uerige.de](https://www.uerige.de/) | +49 211 866990 | unverified |
| Vormann Brauerei | Breckerfeld ⚠ | `craft=brewery` | — | — | unverified |
| Walberberger Hexenbräu | Bornheim | `craft=brewery` | [walberberger-hexenbraeu.de](https://walberberger-hexenbraeu.de) | — | unverified |
| Waldstadt-Braumanufaktur GmbH i.G. | Iserlohn ⚠ | `craft=brewery` | [waldstadtbrauerei-iserlohn.de](https://www.waldstadtbrauerei-iserlohn.de/) | +49 2371 7839280 | unverified |
| Walter Bräu Büderich | Wesel | `craft=brewery` | [walterbrau.de](https://www.walterbrau.de/) `403` | +49 2803 1597 | unverified |
| Warsteiner Brauerei Haus Cramer | Warstein | `craft=brewery` | — | — | unverified |
| Webster | Duisburg | `craft=brewery` | [webster-brauhaus.de](https://www.webster-brauhaus.de) | +49 203 23078 | unverified |
| Zunft Kölsch, Erzquell Brauerei | Wiehl ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Barre | Lübbecke | `industrial` | [barre.de](https://www.barre.de/) | +49 5741 2701-0 | unverified |
| Brauerei Bosch | Bad Laasphe ⚠ | `industrial` | — | — | unverified |
| Brauerei C.& A. Veltins GmbH & Co. KG | Eslohe (Sauerland) ⚠ | `industrial` | — | — | unverified |
| Brauerei Diebels GmbH & Co. KG | Issum ⚠ | `industrial` | [diebels.de](https://www.diebels.de/) | +49 2835 300 | unverified |
| Brauerei Hohenfelder | Langenberg | `industrial` | — | — | unverified |
| Brauerei Königshof | Krefeld | `industrial` | [brauereikoenigshof.de](https://brauereikoenigshof.de/) | — | unverified |
| Dortmunder Actien-Brauerei AG | Dortmund | `industrial` | [dab.de](https://www.dab.de) | — | unverified |
| ehem. Kronen-Brauerei | Dortmund | `industrial` | [de.wikipedia.org/wiki/Kronen_Privatbrauerei_Dortmund](https://de.wikipedia.org/wiki/Kronen_Privatbrauerei_Dortmund) | — | unverified |
| Herforder Brauerei | Herford ⚠ | `industrial` | [herforder.de](https://www.herforder.de/) | — | unverified |
| König-Brauerei | Duisburg ⚠ | `industrial` | — | — | unverified |
| Krombacher Brauerei | Kreuztal | `industrial` | — | — | unverified |
| Krombacher Brauerei Logistikzentrum | Kreuztal ⚠ | `industrial` | — | — | unverified |
| Oettinger Brauerei Mönchengladbach | Mönchengladbach ⚠ | `industrial` | [oettinger-bier.de](https://www.oettinger-bier.de/) `→ oettinger1731.de` | — | unverified |
| Paderborner Brauerei | Borchen ⚠ | `industrial` | — | — | unverified |
| Pott's Brauerei | Kirchspiel Oelde ⚠ | `industrial` | [potts.de](https://www.potts.de/) | +49 2522 9332-0 | unverified |
| Privatbrauerei Bolten | Korschenbroich | `industrial` | [bolten-brauerei.de](https://www.bolten-brauerei.de/) | +49 2161 617900 | unverified |
| Privatbrauerei Moritz Fiege | Bochum | `industrial` | [moritz-fiege.de](https://www.moritz-fiege.de) `→ moritzfiege.de` | +49 234 68980 | unverified |
| Privatbrauerei Strate Detmold | Detmold | `industrial` | [brauerei-strate.de](http://www.brauerei-strate.de) | +49 5231 944000 | unverified |
| Stauder Brauerei | Essen | `industrial` | [stauder.de](https://www.stauder.de) | +49 201 36160 | unverified |
| Warburger Brauerei Kohlschein | Warburg ⚠ | `industrial` | [warburger-brauerei.de](https://warburger-brauerei.de/) | — | unverified |
| Warsteiner Brauerei | Warstein ⚠ | `industrial` | [warsteiner.de](https://www.warsteiner.de/) | — | unverified |
| ACAT | Düren | `microbrewery` | [acab.bike](http://acab.bike) `muerto` | — | unverified |
| Aloisius | Soest | `microbrewery` | [brauhaus-zwiebel.de](http://brauhaus-zwiebel.de/) `→ zwiebel.com` | +49 29214424 | unverified |
| Alte Kaffeerösterei | Lünen ⚠ | `microbrewery` | — | +49 2306 9597865 | unverified |
| Alter Bahnhof Frechen | Frechen | `microbrewery` | [gleisbrauer.de](https://www.gleisbrauer.de/) | +49 2234 951718 | unverified |
| Alter Bahnhof Oberkassel | Düsseldorf | `microbrewery` | [brauhaus-alterbahnhof.de](http://www.brauhaus-alterbahnhof.de/) | +49 211 55789941 | unverified |
| Artemis | Dortmund ⚠ | `microbrewery` | [artemis-dortmund.de](https://www.artemis-dortmund.de/) | — | unverified |
| Bauernhof-Café Marienhof Marks | Delbrück | `microbrewery` | [marienhof-marks.de](http://www.marienhof-marks.de) `→ marienhof-marks.weebly.com` | +49 5250 930525 | unverified |
| Bergmann Kiosk | Dortmund | `microbrewery` | [harte-arbeit-ehrlicher-lohn.de/brauerei/kiosk](https://harte-arbeit-ehrlicher-lohn.de/brauerei/kiosk/) `→ die-bergmann-brauerei.de` | — | unverified |
| Bier- und Schnapsmuseum | Nieheim ⚠ | `microbrewery` | [nieheimer-bier.de](https://www.nieheimer-bier.de/) | — | unverified |
| Brauerei Kürzer | Düsseldorf | `microbrewery` | [brauerei-kuerzer.de](http://brauerei-kuerzer.de/) | +49 211 322696 | unverified |
| Brauerei Päffgen | Köln ⚠ | `microbrewery` | [paeffgen-koelsch.de](https://paeffgen-koelsch.de/) | +49 221 135461 | unverified |
| Brauerei und Brennerei Jakob Rainer & Sohn | Linnich | `microbrewery` | [brauerei-rainer.de](http://www.brauerei-rainer.de) | — | unverified |
| Brauhaus "Gleis Eins" | Engelskirchen | `microbrewery` | [gleis1engelskirchen.de](https://www.gleis1engelskirchen.de/) | +49 2263 9039730 | unverified |
| Brauhaus Bönnsch | Bonn | `microbrewery` | [boennsch.de](https://www.boennsch.de/) | +49 228 650610 | unverified |
| Brauhaus Espelkamp | Espelkamp | `microbrewery` | [brauhaus-espelkamp.de](https://www.brauhaus-espelkamp.de) | +49 5772 939393 | unverified |
| Brauhaus Gummersbach | Gummersbach | `microbrewery` | [brauhaus-gummersbach.de](https://www.brauhaus-gummersbach.de/) | — | unverified |
| Brauhaus Joh. Albrecht | Bielefeld | `microbrewery` | [brauhaus-joh-albrecht.de/bielefeld](https://www.brauhaus-joh-albrecht.de/bielefeld/) | +49 521 62351 | unverified |
| Brauhaus Johann Schäfer | Köln | `microbrewery` | [johann-schaefer.de](https://www.johann-schaefer.de) | +49 221 16860975 | unverified |
| Brauhaus Kalkarer Mühle | Kalkar | `microbrewery` | [kalkarermuehle.de](http://www.kalkarermuehle.de/) `404` | +49 2824 93230 | unverified |
| Brauhaus Klute | Havixbeck | `microbrewery` | [brauhaus-klute.de](http://www.brauhaus-klute.de) | — | unverified |
| Brauhaus Rheinbach | Rheinbach ⚠ | `microbrewery` | [brauhaus-rheinbach.de](https://www.brauhaus-rheinbach.de/) | +49 2226 913800 | unverified |
| Brauhaus Schillerbad | Lüdenscheid | `microbrewery` | [brauhaus-schillerbad.de](https://www.brauhaus-schillerbad.de/) `→ hotel-schillerbad.de` | — | unverified |
| Brauhaus Schumacher | Düsseldorf | `microbrewery` | [schumacher-alt.de](https://www.schumacher-alt.de/) | +49 211 8289020 | unverified |
| Brauhaus Stephanus | Coesfeld | `microbrewery` | [stephanus.eu](https://www.stephanus.eu/) | +49 2541 1000 | unverified |
| Brauhaus Thombansen | Lippstadt | `microbrewery` | [lippstaedter-brauerei.de](http://www.lippstaedter-brauerei.de/) `→ brauhaus-thombansen.de` | +49 2941 800815 | unverified |
| Brauhof Wilshaus | Hamm ⚠ | `microbrewery` | [brauhof-wilshaus.de](https://www.brauhof-wilshaus.de/) | +49 2385 8855 | unverified |
| Braustelle | Köln ⚠ | `microbrewery` | [braustelle.com](https://www.braustelle.com) `muerto` | +49 221 2856932 | unverified |
| Braustübe | Rüthen | `microbrewery` | — | — | unverified |
| DAMPFE Das Borbecker Brauhaus | Essen | `microbrewery` | [dampfe.de](http://www.dampfe.de/) | — | unverified |
| Domschänke - Essel Bräu | Eslohe (Sauerland) | `microbrewery` | [essel-braeu.de](https://www.essel-braeu.de/) | — | unverified |
| Ennert Bräu | Bonn | `microbrewery` | [wir-brauen-bier.de](https://www.wir-brauen-bier.de/) | — | unverified |
| Erlebnisbrauerei Lohmar | Lohmar | `microbrewery` | [erlebnisbrauerei-lohmar.com](https://www.erlebnisbrauerei-lohmar.com/) `→ erlebnisbrauerei-lohmar.de` | — | unverified |
| Felsenkeller Brauerei | Monschau | `microbrewery` | — | +49 2472 3018 | unverified |
| Frankenheim | Düsseldorf | `microbrewery` | — | +49 211 351447 | unverified |
| Frohnhauser Sudwerkstatt | Essen | `microbrewery` | — | — | unverified |
| Gasthaus Früh | Kleve | `microbrewery` | [frueh.de](https://www.frueh.de/) | +49 2821 22920 | unverified |
| Gasthaus Goeke im Grumbecktal | Bochum | `microbrewery` | [gasthausgoeke.de](https://www.gasthausgoeke.de/) | +49 234 591501 | unverified |
| Grüner Apfel | Winterberg ⚠ | `microbrewery` | [bistro-pizza.de](http://bistro-pizza.de/) | +49 2983 8535 | unverified |
| Gütersloher Brauhaus | Gütersloh | `microbrewery` | — | — | unverified |
| Haus Waldfrieden | Viersen ⚠ | `microbrewery` | [waldfrieden-viersen.de](https://www.waldfrieden-viersen.de/) | +49 2162 2689898 | unverified |
| Hausbrauerei Schmitz-Mönk | Tönisvorst ⚠ | `microbrewery` | [schmitzmoenk.de](https://www.schmitzmoenk.de/) | — | unverified |
| Hausbrauerei Zum Schlüssel | Düsseldorf | `microbrewery` | [zumschluessel.de](https://www.zumschluessel.de/) | +49 211 8289550 | unverified |
| Heerdter Gasthaus | Düsseldorf | `microbrewery` | — | — | unverified |
| Hellers Brauhaus | Köln | `microbrewery` | [hellers.koeln/brauhaus-hellers](https://www.hellers.koeln/brauhaus-hellers/) | +49 221 2401881 | unverified |
| Hensen-Brauerei | Mönchengladbach | `microbrewery` | — | — | unverified |
| Herforder Wirtschaft | Herford ⚠ | `microbrewery` | — | +49 5221 62224 | unverified |
| Hofbrauerei Philipsen | Bad Oeynhausen | `microbrewery` | [hofbrauerei-philipsen.com](https://www.hofbrauerei-philipsen.com/) | — | unverified |
| Im Dom | Neuss | `microbrewery` | [imdom.de](https://imdom.de/) `muerto` | +49 2131 275599 | unverified |
| Im Füchschen | Düsseldorf | `microbrewery` | [fuechschen.de](https://fuechschen.de/) | +49 211 137470 | unverified |
| Im Goldenen Kessel | Düsseldorf | `microbrewery` | [schumacher-alt.de](https://www.schumacher-alt.de/) | +49 211 326007 | unverified |
| Klosterhof Knechtsteden | Dormagen | `microbrewery` | [klosterhof-knechtsteden.de](https://www.klosterhof-knechtsteden.de/) | — | unverified |
| Klosterwirtshaus Dalheim | Lichtenau | `microbrewery` | [klosterwirtshaus-in-dalheim.de](https://www.klosterwirtshaus-in-dalheim.de/) | — | unverified |
| Kreiseleck | Holzwickede | `microbrewery` | [kreiseleck.de](https://www.kreiseleck.de) | +49 2301 9840432 | unverified |
| Lindenbrauerei | Unna ⚠ | `microbrewery` | [lindenbrauerei.de](https://www.lindenbrauerei.de/) | — | unverified |
| Louis Brauhaus | Kreuzau | `microbrewery` | [louisbrauhaus.de](https://louisbrauhaus.de/) | — | unverified |
| Manes am Bösch | Dormagen | `microbrewery` | [manes.de](http://www.manes.de/) | +49 2133 91630 | unverified |
| Mc Müllers Brauereigasthof | Linnich | `microbrewery` | [pub.mcmuellers.de](http://pub.mcmuellers.de/) | — | unverified |
| Meigermühle | Lohmar | `microbrewery` | [cafe-restaurant-meigermuehle.de](https://cafe-restaurant-meigermuehle.de/) | +49 2246 5000 | unverified |
| mk hotel remscheid | Remscheid ⚠ | `microbrewery` | [mkhotels.de/de_DE/hotels/remscheid.html](https://www.mkhotels.de/de_DE/hotels/remscheid.html) `404` | — | unverified |
| My Gemüse Döner | Düsseldorf | `microbrewery` | — | — | unverified |
| Oelder Brauhaus | Oelde | `microbrewery` | [oelder-brauhaus.de](https://www.oelder-brauhaus.de/) `muerto` | +49 2522 8329630 | unverified |
| Pfaffen Brauerei | Rösrath ⚠ | `microbrewery` | [max-paeffgen.de](http://www.max-paeffgen.de/) `→ pfaffen-bier.de` | — | unverified |
| Pinkus Müller | Münster | `microbrewery` | [pinkus-mueller.de](http://www.pinkus-mueller.de/) `→ pinkus.de` | +49 251 45151 | unverified |
| Pott's Brau & Backhaus | Kirchspiel Oelde ⚠ | `microbrewery` | [potts.de](https://www.potts.de/) | — | unverified |
| Ratinger Brauhaus | Ratingen | `microbrewery` | [poensgen-gastronomie-ratingen.de/ratinger-brauhaus](https://poensgen-gastronomie-ratingen.de/ratinger-brauhaus/) `→ alterheinfaehre.de` | — | unverified |
| Rotingdorfer | Werther (Westf.) ⚠ | `microbrewery` | — | — | unverified |
| Schlosskrug Heidelbeck | Kalletal ⚠ | `microbrewery` | [schlosskrug-heidelbeck.de](http://schlosskrug-heidelbeck.de/) `→ schlossheidelbeck.de` | +49 5264 9163 | unverified |
| Siegburger Brauhaus | Siegburg | `microbrewery` | [siegburger-brauhaus.de](https://www.siegburger-brauhaus.de/) | +49 2241 55999 | unverified |
| StadtBierhaus Troisdorf | Troisdorf | `microbrewery` | [stadtbierhaus.de](http://stadtbierhaus.de/) | +49 2241 800 555 | unverified |
| Sudhaus | Detmold | `microbrewery` | [sudhaus-detmold.com](https://www.sudhaus-detmold.com/) | +49 5231 306630 | unverified |
| Walsumer Brauhaus Urfels | Duisburg | `microbrewery` | [walsumer-brauhaus.de](http://www.walsumer-brauhaus.de) `→ brauhaus-urfels.de` | +49 203 9919450 | unverified |
| Wuppertaler Brauhaus | Wuppertal | `microbrewery` | [wuppertaler-brauhaus.de](https://wuppertaler-brauhaus.de/) | +49 202 255050 | unverified |

## Residual Wikidata que OSM no trae — 19

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Abtei (Marienfeld) | Harsewinkel | — | unverified |
| Brauerei Zassenhaus | Neviges | — | unverified |
| Brauerei zur Malzmühle | Köln | — | unverified |
| Dom-Brauerei | Rodenkirchen | [dom-brauerei.de](http://www.dom-brauerei.de/) `muerto` | unverified |
| Dortmunder Gildenbrauerei | Dortmund | — | unverified |
| Dortmunder Ritter-Brauerei | Castrop-Rauxel | — | unverified |
| Dortmunder Stifts-Brauerei | Dortmund | — | unverified |
| Em Kölsche Boor | Köln | — | unverified |
| Falkenkrug | Detmold | — | unverified |
| Historische Brennerei Rönsahl | Marienheide | — | unverified |
| Kronenbrauerei Hardering | Wesel | — | unverified |
| Küpper-Brauerei | Wuppertal | — | unverified |
| Lommerzheim | Köln | — | unverified |
| Neusser Straße 47 (Köln) | Köln | — | unverified |
| Quellen-Brauerei | Schwerte | — | unverified |
| Schloss Brake | Lemgo | — | unverified |
| Schlossbrauerei Hohenlimburg | Nachrodt-Wiblingwerde | — | unverified |
| Sturmbrauerei | Merzenich | — | unverified |
| Wicküler-Brauerei | Wuppertal | [wickueler.de](http://www.wickueler.de/) | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
