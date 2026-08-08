# Bayern — cerveza

- **CSV destino** `data/csv/de/sueddeutschland/bayern.csv`
- **Fuentes** OpenStreetMap vía Overpass (`craft=brewery`, `microbrewery=yes`, `industrial=brewery`, `product=beer`, área `ISO3166-2=DE-BY`), 2026-08-06, ODbL 1.0 · Wikidata (`P31/P279* Q131734` + `P17 Q183`, sin `P576`) para el residual que OSM no tagea
- **Fecha** 2026-08-06
- **Estado** `unverified` en bloque: barrido exhaustivo hecho, ninguna ficha abierta
- **Tamaño del hueco** 759 candidatos contra **588 Braustätten** que Destatis cuenta en Bayern en 2025; el CSV tiene hoy 0 filas de cerveza aquí

La columna **clase** indica qué tag de OSM trajo el candidato, no una decisión editorial:
`craft=brewery` cervecería declarada · `industrial` planta industrial, triar tamaño y grupo · `microbrewery` local que declara elaborar in situ (Gasthausbrauerei), es el tier que más falsos positivos trae.
El sufijo tras la web es el código HTTP del barrido del 2026-08-06 cuando no fue 2xx propio.

## Pool OSM — 652 (A=358 · B=34 · C=260 · 71 con web no-ok)

| nombre | municipio | clase | web | teléfono | estado |
|---|---|---|---|---|---|
| 1. Zwieseler Dampfbierbrauerei | Zwiesel | `craft=brewery` | [dampfbier.de](https://www.dampfbier.de) | +49 9922 84660 | unverified |
| Abfüllanlage | Gmund | `craft=brewery` | — | — | unverified |
| Adam Bräu | Bodenmais ⚠ | `craft=brewery` | [adam-braeu.de](https://www.adam-braeu.de) | +49 9924 94000 | unverified |
| Aktienbrauerei Kaufbeuren | Kaufbeuren ⚠ | `craft=brewery` | [aktien-brauerei.de](http://www.aktien-brauerei.de) `→ aktienbrauerei.de` | — | unverified |
| Allgäuer Brauhaus | Marktoberdorf | `craft=brewery` | [allgaeuer-brauhaus.de](https://www.allgaeuer-brauhaus.de/) | — | unverified |
| Altdorfer Brauverein | Altdorf bei Nürnberg ⚠ | `craft=brewery` | [altdorfer-brauverein.de](https://altdorfer-brauverein.de/) | — | unverified |
| Altes Sudhaus | Nürnberg | `craft=brewery` | [tucher.de/unsere-werte](https://www.tucher.de/unsere-werte/) | +49 911 37677893 | unverified |
| Altöttinger Hell-Bräu Familienbrauerei | Altötting ⚠ | `craft=brewery` | — | — | unverified |
| Ambräusianum | Bamberg ⚠ | `craft=brewery` | [ambraeusianum.de](http://www.ambraeusianum.de/) | +49 951 5090262 | unverified |
| Apostelbräu | Hauzenberg | `craft=brewery` | [apostelbraeu.de](https://www.apostelbraeu.de/) `→ brauliebe.de` | — | unverified |
| Arcobräu Gräfliches Brauhaus GmbH & Co. KG | Moos | `craft=brewery` | [arcobraeu.de](https://www.arcobraeu.de/) | +49 9938 918180 | unverified |
| Arnsteiner Brauerei Max Bender GmbH & Co. KG | Arnstein | `craft=brewery` | [herzog-von-franken.de](https://herzog-von-franken.de/) | +49 9363 90910 | unverified |
| Aubinger Bräu | München | `craft=brewery` | — | — | unverified |
| Auerbräu | Rosenheim | `craft=brewery` | [auerbraeu.de](http://www.auerbraeu.de) | +49 8031 1805-0 | unverified |
| Aufsesser Brauerei | Aufseß | `craft=brewery` | [brauereigasthof-rothenbach.de](https://www.brauereigasthof-rothenbach.de/) | +49 9198 8282 | unverified |
| Augsburger Brauhaus zum Hasen | Augsburg ⚠ | `craft=brewery` | — | — | unverified |
| Baptist Bräutigam | Eltmann ⚠ | `craft=brewery` | — | — | unverified |
| Bären Bier | Nesselwang ⚠ | `craft=brewery` | [baerenbier-nesselwang.de](https://www.baerenbier-nesselwang.de/) `muerto` | — | unverified |
| Bärenbräu | Berching ⚠ | `craft=brewery` | — | — | unverified |
| Bärenbräu | Pfaffenhofen an der Roth ⚠ | `craft=brewery` | — | — | unverified |
| Bavarian Festbeer Brewery | Ebermannstadt | `craft=brewery` | [bavarian-festbeer-brewery.de](http://www.bavarian-festbeer-brewery.de/) | — | unverified |
| Bavarian Gator | Marktredwitz | `craft=brewery` | [bavariangator.de](https://www.bavariangator.de/) | +49 9231 7960704 | unverified |
| Bayerische Staatsbrauerei Weihenstephan | Freising ⚠ | `craft=brewery` | [weihenstephaner.de/unsere-brauerei](https://www.weihenstephaner.de/unsere-brauerei) | — | unverified |
| Bayreuther Bierbrauerei AG (Aktien) | Bayreuth | `craft=brewery` | — | — | unverified |
| Beim Strehern | Eslarn ⚠ | `craft=brewery` | [zoiglstum.de](http://zoiglstum.de) | +49 9653 1355 | unverified |
| BELE BIERWERKSTATT | Mainleus ⚠ | `craft=brewery` | [bele-bierwerkstatt.de](https://www.bele-bierwerkstatt.de/) | — | unverified |
| Berabecka Boandl-Bräu | Aichach | `craft=brewery` | [boandlbraeu.de](https://www.boandlbraeu.de/) | — | unverified |
| Bernardibräu | Rettenberg | `craft=brewery` | [bernardibraeu.de](https://www.bernardibraeu.de/) | +49 8327 93 261 80 | unverified |
| bierfabrik hoehn | Herzogenaurach | `craft=brewery` | [bierfabrikhoehn.de](https://bierfabrikhoehn.de/) | — | unverified |
| Brandholz Brauerei | Litzendorf | `craft=brewery` | [brandholz-brauerei.de](https://www.brandholz-brauerei.de) | — | unverified |
| Brandy's Braugarage | Wallersdorf | `craft=brewery` | [brandys-braugarage.de](http://www.brandys-braugarage.de) `→ p2-1.afp24.net` | +49 9933 9527745 | unverified |
| Bräu im Moos | Tüßling | `craft=brewery` | — | — | unverified |
| Bräu z'Loh | Dorfen | `craft=brewery` | [braeuzloh.de](https://www.braeuzloh.de/) `muerto` | +49 8082 442 | unverified |
| Brauerei Angermann Rothwind | Mainleus | `craft=brewery` | — | — | unverified |
| Brauerei Berghammer | Oberndorf | `craft=brewery` | [brauerei-berghammer.de](https://brauerei-berghammer.de/) | +49 9405 962176 | unverified |
| Brauerei Bergmann | Glattbach | `craft=brewery` | [biobraumeister.de](https://www.biobraumeister.de/) | — | unverified |
| Brauerei Bischofshof e.K. | Regensburg ⚠ | `craft=brewery` | [bischofshof.de](https://www.bischofshof.de/) | +49 941 2001 0 | unverified |
| Brauerei Bruckmüller | Kümmersbruck ⚠ | `craft=brewery` | [bruckmueller.de/home](https://www.bruckmueller.de/home/) | +49 96 21 48 80-0 | unverified |
| Brauerei Dinkel | Bad Staffelstein ⚠ | `craft=brewery` | [brauerei-dinkel.de/brauerei-bad-staffelstein-lichtenfels.html](https://www.brauerei-dinkel.de/brauerei-bad-staffelstein-lichtenfels.html) `404` | +49 170 3073281 | unverified |
| Brauerei Düll | Volkach | `craft=brewery` | [krautheimer.com](https://krautheimer.com) `muerto` | — | unverified |
| Brauerei Falkenstein | Pfronten ⚠ | `craft=brewery` | [brauerei-falkenstein.de](https://brauerei-falkenstein.de/) | — | unverified |
| Brauerei Fässla | Bamberg ⚠ | `craft=brewery` | [faessla.de/faessla-bamberg-gaststaette](https://www.faessla.de/faessla-bamberg-gaststaette/) | +49 951 22998 | unverified |
| Brauerei Faust | Miltenberg | `craft=brewery` | [brauerei-faust.de](http://www.brauerei-faust.de) `→ faust.de` | +49 9371 9713-48 | unverified |
| Brauerei Friedel | Adelsdorf ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Friedmann | Gräfenberg | `craft=brewery` | [brauerei-friedmann.de](https://brauerei-friedmann.de/) | +49 9192 318 | unverified |
| Brauerei Friedrich Riemhofer & Ko. KG | Riedenburg | `craft=brewery` | [brauerei-riemhofer.de](https://www.brauerei-riemhofer.de/) | +49 9442 91980 | unverified |
| Brauerei Gasthaus Friedel | Höchstadt an der Aisch | `craft=brewery` | — | +49 9502 209 | unverified |
| Brauerei Gebr. Maisel | Bayreuth | `craft=brewery` | [maisel.com](https://www.maisel.com/) | +49 921 401-0 | unverified |
| Brauerei Glenk | Bayreuth | `craft=brewery` | [glenk-braeu.de](http://www.glenk-braeu.de) `→ ts.domainname.de` | +49 921 757190 | unverified |
| Brauerei Göller | Zeil am Main ⚠ | `craft=brewery` | [brauerei-goeller.de](https://www.brauerei-goeller.de/) | — | unverified |
| Brauerei Goss | Deuerling | `craft=brewery` | — | — | unverified |
| Brauerei Gradl | Schnabelwaid ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Grasser | Königsfeld | `craft=brewery` | [huppendorfer-bier.de](https://www.huppendorfer-bier.de/) | +49 9207 270 | unverified |
| Brauerei Greif | Forchheim | `craft=brewery` | [brauerei-greif.de](https://www.brauerei-greif.de) | — | unverified |
| Brauerei Gundel | Kammerstein | `craft=brewery` | [brauerei-gundel.de](https://www.brauerei-gundel.de/) | +49 9178 1504 | unverified |
| Brauerei Gutmann | Titting | `craft=brewery` | [brauerei-gutmann.de](https://www.brauerei-gutmann.de/) | +49 8423 99660 | unverified |
| Brauerei Hauf KG | Dinkelsbühl | `craft=brewery` | [hauf-bier.de](https://www.hauf-bier.de/) | +49 9851 57520 | unverified |
| Brauerei Hebendanz | Forchheim | `craft=brewery` | [brauerei-hebendanz.de](https://www.brauerei-hebendanz.de) | — | unverified |
| Brauerei Hetzel | Bad Staffelstein | `craft=brewery` | — | +49 9573 6435 | unverified |
| Brauerei Hofmann | Gutenstetten | `craft=brewery` | [hofmannbier.de](https://hofmannbier.de) | +49 9163 99870 | unverified |
| Brauerei Hopfenhäcker | Unterhaching ⚠ | `craft=brewery` | [hopfenhaecker.de](https://hopfenhaecker.de/) | — | unverified |
| Brauerei Hopfenhäusla | Münchberg | `craft=brewery` | [hopfenhaeusla.de](https://hopfenhaeusla.de/) | +49 9251 4371347 | unverified |
| Brauerei Horneck | Horneck | `craft=brewery` | [brauerei-horneck.de](https://brauerei-horneck.de/) | +49 8753 503 | unverified |
| Brauerei Hösl | Mitterteich | `craft=brewery` | [hoeslbraeu.de](https://www.hoeslbraeu.de/) | +49 96 33 92 22-0 | unverified |
| Brauerei Hummel | Memmelsdorf | `craft=brewery` | [brauerei-hummel.de](http://www.brauerei-hummel.de) | +49 9542 1247 | unverified |
| Brauerei Hütten | Warmensteinach | `craft=brewery` | [brauerei-huetten.de](https://www.brauerei-huetten.de/) | +49 9277 312 | unverified |
| Brauerei Junkersdorf | Königsberg in Bayern ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Karl Düll | Martinsheim ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Klett Otto Kienberger | Konzell | `craft=brewery` | — | — | unverified |
| Brauerei Knoblach | Litzendorf | `craft=brewery` | — | +49 9505 267 | unverified |
| Brauerei Kronburg | Kronburg ⚠ | `craft=brewery` | [brauerei-kronburg.de/brauerei](https://www.brauerei-kronburg.de/brauerei/) | — | unverified |
| Brauerei Kühbach | Kühbach | `craft=brewery` | [brauereikuehbach.de](https://www.brauereikuehbach.de/) | +49 8251 8966 0 | unverified |
| Brauerei Kundmüller | Viereth-Trunstadt ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Kürzdörfer | Schnabelwaid ⚠ | `craft=brewery` | [brauerei-kuerzdoerfer.de](https://www.brauerei-kuerzdoerfer.de) `→ landgasthof-kuerzdoerfer.de` | +49 160 91978835; +49 9246 9887946 | unverified |
| Brauerei Landwehr-Bräu | Steinsfeld ⚠ | `craft=brewery` | [landwehr-braeu.de](https://www.landwehr-braeu.de/) | — | unverified |
| Brauerei Lang | Wülfershausen an der Saale ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Lang-Bräu | Wunsiedel | `craft=brewery` | [lang-braeu.de](https://www.lang-braeu.de/) | +49 9232 2197 | unverified |
| Brauerei Lieberth | Hallerndorf | `craft=brewery` | — | +49 9545 8558 | unverified |
| Brauerei Loscher GmbH & Co. KG | Münchsteinach ⚠ | `craft=brewery` | [brauerei-loscher.de](https://www.brauerei-loscher.de/) `403` | +49 9166 607 | unverified |
| Brauerei Maisach | Maisach | `craft=brewery` | [brauerei-maisach.de](https://www.brauerei-maisach.de/) | +49 8141 39557 0 | unverified |
| Brauerei Mauerbrecher | Lonnerstadt | `craft=brewery` | [brauerei-mauerbrecher.de](https://www.brauerei-mauerbrecher.de) `404` | +49 176 41661726 | unverified |
| Brauerei Meyringer Moosham | Mintraching | `craft=brewery` | [brauerei-meyringer.de](http://www.brauerei-meyringer.de/) `→ die-alte-brauerei.de` | +49 9406 1047 | unverified |
| Brauerei Mittenwald | Mittenwald ⚠ | `craft=brewery` | [brauerei-mittenwald.de](https://www.brauerei-mittenwald.de/) | +49 8823 1007;+49 8823 1008 | unverified |
| Brauerei Molter | Irchenrieth ⚠ | `craft=brewery` | [brauereimolter.de](https://brauereimolter.de) | +49 9659 666 | unverified |
| Brauerei Murmann | Untersiemau | `craft=brewery` | [brauerei-murmann.de](http://www.brauerei-murmann.de/) | +49 9565 811 | unverified |
| Brauerei Neder | Forchheim | `craft=brewery` | [neder-brauerei.de](https://neder-brauerei.de/) | — | unverified |
| Brauerei Nothaft | Marktredwitz ⚠ | `craft=brewery` | [brauerei-nothhaft.de](https://www.brauerei-nothhaft.de/) | +49 9231 64520 | unverified |
| Brauerei Ott | Heiligenstadt in Oberfranken ⚠ | `craft=brewery` | [brauerei-ott.de](https://www.brauerei-ott.de/) | +49 9198 997649 | unverified |
| Brauerei Penning-Zeißler | Pretzfeld | `craft=brewery` | — | +49 9194 252 | unverified |
| Brauerei Plank | Laaber ⚠ | `craft=brewery` | [brauerei-plank.de](https://www.brauerei-plank.de) | +49 9498 8707 | unverified |
| Brauerei Püls-Bräu OHG | Weismain ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Rapp | Kutzenhausen | `craft=brewery` | [brauerei-rapp.de](https://brauerei-rapp.de) | +49 8238 309 0 | unverified |
| Brauerei Reh | Litzendorf | `craft=brewery` | [reh-bier.de](https://reh-bier.de/) | +49 9505 210 | unverified |
| Brauerei Reitinger | Oberroth ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Reuter | Rügland | `craft=brewery` | [bibert.de/gewerbe/brauerei/index.html](http://www.bibert.de/gewerbe/brauerei/index.html) `404` | — | unverified |
| Brauerei Riegele | Augsburg | `craft=brewery` | — | — | unverified |
| Brauerei Rittmayer | Hallerndorf | `craft=brewery` | [rittmayer.de](https://www.rittmayer.de/) `muerto` | +49 9545 50292 | unverified |
| Brauerei Röhrl GmbH | Straubing | `craft=brewery` | [labertaler.de/unternehmen/brauerei-roehrl](https://www.labertaler.de/unternehmen/brauerei-roehrl/) | +49 9421 9937 0 | unverified |
| Brauerei Roppelt | Oberaurach | `craft=brewery` | [brauereiroppelt.de/brauerei.html](http://www.brauereiroppelt.de/brauerei.html) | — | unverified |
| Brauerei Rothmoos | Halfing | `craft=brewery` | [rothmooser.de](http://www.rothmooser.de/) `→ rothmooser.com` | — | unverified |
| Brauerei Schimpfle | Gessertshausen | `craft=brewery` | [brauerei-schimpfle.de](https://www.brauerei-schimpfle.de/) | — | unverified |
| Brauerei Schleicher | Itzgrund | `craft=brewery` | [brauerei-schleicher.de](https://brauerei-schleicher.de/) | +49 9533 229 | unverified |
| Brauerei Schmidmayer | Siegenburg | `craft=brewery` | [schmidmayer.de](https://www.schmidmayer.de/) | — | unverified |
| Brauerei Schroll | Waischenfeld ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Schübel | Stadtsteinach | `craft=brewery` | [schuebel-braeu.de](https://www.schuebel-braeu.de/) | — | unverified |
| Brauerei Simon | Lauf an der Pegnitz ⚠ | `craft=brewery` | [brauerei-simon.de](https://www.brauerei-simon.de/) | +49 9123 2323 | unverified |
| Brauerei Spezial | Bamberg ⚠ | `craft=brewery` | [brauerei-spezial.de](http://www.brauerei-spezial.de) | — | unverified |
| Brauerei Stadter (Brauhaus) | Aufseß ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Stallbauer | Engelsberg | `craft=brewery` | [brauerei-stallbauer.de](https://www.brauerei-stallbauer.de/) | — | unverified |
| Brauerei Stierberg | Obertaufkirchen | `craft=brewery` | [brauerei-stierberg.de](http://www.brauerei-stierberg.de/) | +49 8082 1851 | unverified |
| Brauerei Stöckel | Ahorntal ⚠ | `craft=brewery` | [stoeckel-braeu.de](https://stoeckel-braeu.de/) | — | unverified |
| Brauerei Streck | Ostheim vor der Rhön | `craft=brewery` | — | — | unverified |
| Brauerei Thein | Priesendorf ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Thorbräu Augsburg | Augsburg ⚠ | `craft=brewery` | [thorbraeu.de](https://thorbraeu.de/) | +49 821 3 65 61 | unverified |
| Brauerei Trunk | Bad Staffelstein | `craft=brewery` | [brauerei-trunk.de](https://brauerei-trunk.de) | +49 9571 3488 | unverified |
| Brauerei Übelhack | Haag ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Ustersbach | Ustersbach | `craft=brewery` | — | — | unverified |
| Brauerei Wimmer | Bruckberg | `craft=brewery` | — | — | unverified |
| Brauerei Windsheimer | Gutenstetten | `craft=brewery` | [brauerei-windsheimer.de](http://brauerei-windsheimer.de) `muerto` | +49 9161 2293 | unverified |
| Brauerei Wingershof | Amberg | `craft=brewery` | — | — | unverified |
| Brauerei Witzgall | Hallerndorf | `craft=brewery` | — | +49 9545 7452 | unverified |
| Brauerei Wolfshöhe | Schnaittach ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei Wurm | Pappenheim | `craft=brewery` | — | — | unverified |
| Brauerei Würth | Windischeschenbach | `craft=brewery` | [brauerei-wuerth.de](http://www.brauerei-wuerth.de/) | — | unverified |
| Brauerei Zirndorf | Zirndorf ⚠ | `craft=brewery` | [zirndorfer.de](https://zirndorfer.de) | — | unverified |
| Brauerei zum Kuchlbauer | Abensberg | `craft=brewery` | [kuchlbauer.de](https://kuchlbauer.de/) | +49 9443 9101 0 | unverified |
| Brauerei zum Schiff | Schwabach ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei zum Silbersteg | Fürstenfeldbruck | `craft=brewery` | [schmidtke-design.wixsite.com/zum-silbersteg](https://schmidtke-design.wixsite.com/zum-silbersteg) | +49 8141 21821 | unverified |
| Brauerei Zum Wohlherrn | Pfaffenhofen an der Ilm ⚠ | `craft=brewery` | — | — | unverified |
| Brauerei-Gasthaus Gradl | Schnabelwaid ⚠ | `craft=brewery` | — | +49 9246 247 | unverified |
| Brauerei-Gasthof Griess | Strullendorf | `craft=brewery` | [brauerei-griess.de](https://www.brauerei-griess.de/) | +49 9505 1624 | unverified |
| Brauereigasthof Herrmann | Burgebrach | `craft=brewery` | — | +49 9546 372 | unverified |
| Brauereigasthof Sperber-Bräu | Sulzbach-Rosenberg | `craft=brewery` | [sperber-braeu.de](https://www.sperber-braeu.de/) | +49 9661 87090 | unverified |
| Brauereigasthof Wiethaler | Lauf an der Pegnitz | `craft=brewery` | [brauerei-wiethaler.de](http://brauerei-wiethaler.de/) | +49 9126 5460 | unverified |
| Brauereigaststätte Berghammer | Bad Abbach | `craft=brewery` | [brauerei-berghammer.de](http://www.brauerei-berghammer.de/) | +49 9405 962179 | unverified |
| Brauhaus Altenkunstadt Leikeim | Altenkunstadt | `craft=brewery` | — | +49 9572 75050 | unverified |
| Brauhaus Döbler | Bad Windsheim ⚠ | `craft=brewery` | [brauhaus-doebler.de](https://www.brauhaus-doebler.de) | — | unverified |
| Brauhaus Germering | Germering | `craft=brewery` | [brauhaus-germering.eu](https://brauhaus-germering.eu/) | +49 89 20921348 | unverified |
| Brauhaus Heckel Bräu | Waischenfeld | `craft=brewery` | — | — | unverified |
| Brauhaus Roth | Schweinfurt ⚠ | `craft=brewery` | — | — | unverified |
| Brauhaus Wiesen | Wiesen ⚠ | `craft=brewery` | [brauhaus-wiesen.de](https://www.brauhaus-wiesen.de/) | +49 6096 373 | unverified |
| Brauhof Rattelsdorf | Rattelsdorf | `craft=brewery` | — | — | unverified |
| Braumadl | Lauingen (Donau) | `craft=brewery` | [braumadl.com/oeffnungzeiten](https://braumadl.com/oeffnungzeiten/) `→ braumadl.de` | — | unverified |
| Braumanufaktur Hertl | Schlüsselfeld | `craft=brewery` | [braumanufaktur-hertl.de](https://www.braumanufaktur-hertl.de/) | — | unverified |
| Braumanufaktur Lindner | Affing ⚠ | `craft=brewery` | [braumanufaktur-lindner.de](https://braumanufaktur-lindner.de/) | — | unverified |
| Braumanufaktur Lippert | Lichtenfels | `craft=brewery` | [braumanufaktur-lippert.de](https://braumanufaktur-lippert.de) | — | unverified |
| Braustall | Deuerling | `craft=brewery` | [braustall.de](http://www.braustall.de/) | — | unverified |
| Bräustüberl zur Kanone | Schnaittach | `craft=brewery` | — | — | unverified |
| Brauverein Hofheimer Land | Hofheim in Unterfranken | `craft=brewery` | [brauverein-hofheimer-land.de](http://www.brauverein-hofheimer-land.de) | +49 9523 502265 | unverified |
| Brauverein Schwabach e.V. | Schwabach | `craft=brewery` | [brauverein-schwabach.de](https://www.brauverein-schwabach.de) | — | unverified |
| BroBier | Reckendorf | `craft=brewery` | [brobier-brewing.com](https://brobier-brewing.com/) | — | unverified |
| Bürgerbräu Hersbruck | Hersbruck | `craft=brewery` | [buergerbraeu-hersbruck.de](https://www.buergerbraeu-hersbruck.de/) | — | unverified |
| Bürgersolarbrauhaus Unterelldorf | Seßlach | `craft=brewery` | — | — | unverified |
| C. Wittmann | Landshut | `craft=brewery` | — | — | unverified |
| Camba Bavaria | Seeon | `craft=brewery` | [camba-bavaria.de](https://camba-bavaria.de) | +49 8624 4073300 | unverified |
| de Bassus Schlossbrauerei zu Sandersdorf | Altmannstein | `craft=brewery` | [schlossbrauereisandersdorf.de](https://schlossbrauereisandersdorf.de/) | +49 9446 902930 | unverified |
| Deggendorfer Brauhaus | Deggendorf | `craft=brewery` | [deggendorferbrauhaus.de](https://deggendorferbrauhaus.de/) | +4999134472728 | unverified |
| Dietl-Bräu | Weyarn ⚠ | `craft=brewery` | — | +498020282 | unverified |
| Dietz | Dietenhofen ⚠ | `craft=brewery` | — | — | unverified |
| Dobmann | Kirchenthumbach ⚠ | `craft=brewery` | — | — | unverified |
| Dorfbrauhaus Schönau a. d. Brend | Schönau an der Brend | `craft=brewery` | — | — | unverified |
| Dorn Bräu | Ammerndorf | `craft=brewery` | [ammerndorfer-bier.de](https://ammerndorfer-bier.de/) | — | unverified |
| Dorn-Bräu Inh. Karl Dorn e.K. | Bruckberg | `craft=brewery` | [dorn-braeu.de](https://www.dorn-braeu.de) `404` | +499824326 | unverified |
| Drachselsrieder Schlossbräu | Drachselsried | `craft=brewery` | [schlossbraeu.de](https://www.schlossbraeu.de/) | +49 9945 94070 | unverified |
| Dreykorn | Lauf an der Pegnitz ⚠ | `craft=brewery` | — | +49 9123 2424 | unverified |
| Ebensfelder Brauhaus | Ebensfeld | `craft=brewery` | [ebensfelder-brauhaus.de](http://www.ebensfelder-brauhaus.de/) | +49 9573 885 | unverified |
| Eder & Heylands Brauerei | Großostheim ⚠ | `craft=brewery` | [eders.de/start](https://www.eders.de/start/) | — | unverified |
| Ehemalige Brauerei (Brandner Urstoff) | Arzberg ⚠ | `craft=brewery` | — | — | unverified |
| Engelbräu | Rettenberg ⚠ | `craft=brewery` | [engelbraeu.de](https://www.engelbraeu.de) | +49 8377 9 30 00 | unverified |
| Enzensteiner | Schnaittach ⚠ | `craft=brewery` | [enzensteiner.de](http://www.enzensteiner.de) | +49 9153 4637 | unverified |
| Erl | Geiselhöring ⚠ | `craft=brewery` | — | — | unverified |
| Familienbrauerei Jacob oHG | Bodenwöhr ⚠ | `craft=brewery` | — | — | unverified |
| Felsen Bräu | Nennslingen ⚠ | `craft=brewery` | [solarbier-felsenbraeu.de/startseite](https://solarbier-felsenbraeu.de/startseite) `404` | — | unverified |
| Flötzinger Bräu Rosenheim | Rosenheim | `craft=brewery` | [floetzinger.de](http://www.floetzinger.de/) | +49 8031 36630 | unverified |
| Franken Bräu | Mitwitz ⚠ | `craft=brewery` | [frankenbraeu.de](https://www.frankenbraeu.de/) | — | unverified |
| Freibier.cc | Regensburg | `craft=brewery` | [freibier.cc](https://www.freibier.cc) | — | unverified |
| Frischeisen | Kelheim | `craft=brewery` | [brauerei-frischeisen.de](https://brauerei-frischeisen.de/) | +49 9441 50490 | unverified |
| Fürst Wallerstein Brauhaus | Wallerstein ⚠ | `craft=brewery` | [fuerstwallerstein-brauhaus.de](https://fuerstwallerstein-brauhaus.de/) | — | unverified |
| Gampertbräu | Weißenbrunn | `craft=brewery` | [gampertbraeu.de](https://www.gampertbraeu.de/) | +49926160330 | unverified |
| GANS Brauerei | Neumarkt in der Oberpfalz | `craft=brewery` | [gansbrauerei.de](https://gansbrauerei.de/) | +49 9181 905885 | unverified |
| Gänstaller Bräu | Hallerndorf | `craft=brewery` | — | — | unverified |
| Gasthaus Roppelt | Hallerndorf | `craft=brewery` | [brauerei-roppelt.de/gastwirtschaft](http://brauerei-roppelt.de/gastwirtschaft) | +49 9195 7263 | unverified |
| Gemeinschaftsbrauerei Roßfeld e.V. | Bad Rodach | `craft=brewery` | — | +49 9564 4625 | unverified |
| Gesellschaftsbrauerei Viechtach | Kollnburg ⚠ | `craft=brewery` | — | — | unverified |
| Giesinger Biermanufaktur und Spezialitätenbraugesellschaft mbH | München ⚠ | `craft=brewery` | [giesinger-braeu.de](https://www.giesinger-braeu.de) | — | unverified |
| Giesinger Bräu Bräustüberl | München | `craft=brewery` | [giesinger-braeu.de](https://www.giesinger-braeu.de/) | +49 89 55062184 | unverified |
| Glenk | Bayreuth ⚠ | `craft=brewery` | [glenk-garten.de](http://www.glenk-garten.de/) `404` | +4992115137316 | unverified |
| Glentleitner Brauerei | Schlehdorf | `craft=brewery` | — | — | unverified |
| Glossnerbräu | Neumarkt in der Oberpfalz | `craft=brewery` | [glossner.de](https://glossner.de/) | +49 9181 234-40 | unverified |
| Goikelbräu | Lohr am Main | `craft=brewery` | [goikelbraeu.de](https://www.goikelbraeu.de/) | +49 9359 9097840 | unverified |
| Gottsmannsgrüner Brauerei | Berg | `craft=brewery` | [gottsmannsgruener.de](https://www.gottsmannsgruener.de) | +49 9293 9330112 | unverified |
| Gräfliche Brauerei Arco | Valley ⚠ | `craft=brewery` | — | — | unverified |
| Gräfliches Hofbrauhaus Freising | Freising ⚠ | `craft=brewery` | [hofbrauhaus-freising.de](https://hofbrauhaus-freising.de/) | — | unverified |
| Haderner Bräu | München | `craft=brewery` | [haderner.de](https://www.haderner.de) | — | unverified |
| Haderner Bräu - Münchens erste Bio-Brauerei | München | `craft=brewery` | [haderner.de](https://www.haderner.de) | — | unverified |
| Hausbrauerei Schober | Zirndorf | `craft=brewery` | — | — | unverified |
| Heberbräu | Kirchenthumbach ⚠ | `craft=brewery` | [heberbraeu.de](http://www.heberbraeu.de/) | — | unverified |
| Held Bräu | Waischenfeld ⚠ | `craft=brewery` | [held-braeu.de](http://www.held-braeu.de/) | +49 9242 295 | unverified |
| Herzoglich Bayerisches Brauhaus Tegernsee | Tegernsee | `craft=brewery` | — | — | unverified |
| Hinterhofbräu | Aichach | `craft=brewery` | — | +49 8251 8876585 | unverified |
| Hofbräu | Abensberg | `craft=brewery` | — | +49 9443 905666 | unverified |
| Hofbrauhaus Berchtesgaden | Berchtesgaden ⚠ | `craft=brewery` | — | — | unverified |
| Hofbräuhaus Traunstein | Traunstein | `craft=brewery` | [hb-ts.de](https://www.hb-ts.de/) | +49 861 988660 | unverified |
| Hofmark Brauerei | Traitsching ⚠ | `craft=brewery` | [hofmark.com](https://hofmark.com/) `→ hofmark.de` | — | unverified |
| Hohe-Wart-Bräu | Mespelbrunn ⚠ | `craft=brewery` | [hohewart-haus.de/kaffee-brauerei](https://www.hohewart-haus.de/kaffee-brauerei/) | — | unverified |
| Hohenthanner Schloßbrauerei | Hohenthann ⚠ | `craft=brewery` | [hohenthanner.de](https://www.hohenthanner.de/) | +49 8784 96020 | unverified |
| Hönicka-Bräu | Wunsiedel ⚠ | `craft=brewery` | [hoenicka.de](https://www.hoenicka.de/) | +49 9232 2044 | unverified |
| Hopfengarten Bamberg | Bamberg ⚠ | `craft=brewery` | [hopfengarten-bamberg.de](https://hopfengarten-bamberg.de) | +49 951 1503 1940 | unverified |
| Hopfenkopf | Garching an der Alz ⚠ | `craft=brewery` | — | — | unverified |
| hopfenrebell | Bad Staffelstein | `craft=brewery` | [hopfenrebell.de](https://www.hopfenrebell.de/) | +49 9573 3108675 | unverified |
| Hoppebräu | Waakirchen | `craft=brewery` | [hoppebraeu.de](https://www.hoppebraeu.de) | +49 8021 5077143 | unverified |
| Hotel Gasthof Weißbräu | Freilassing | `craft=brewery` | [weissbraeu-freilassing.de](http://weissbraeu-freilassing.de/) | +49 8654 9725 | unverified |
| Inselbräu | Chiemsee | `craft=brewery` | [inselbraeu-frauenchiemsee.de](https://www.inselbraeu-frauenchiemsee.de) | +49 8054 902088 | unverified |
| Inselbrauerei | Weißensberg ⚠ | `craft=brewery` | [inselbrauerei.com](http://www.inselbrauerei.com) | — | unverified |
| Joferbräu Hofbräustub´n | Aiglsbach | `craft=brewery` | [joferbraeu-hofbraeustueberl.de](https://www.joferbraeu-hofbraeustueberl.de) `→ xn--joferbru-6za.de` | +498753 8126 | unverified |
| Juliusbräu | Neuburg an der Donau | `craft=brewery` | [juliusbraeu.com](https://juliusbraeu.com) | +49 8431 2069 | unverified |
| Kaiserdom Specialitäten Brauerei | Bamberg | `craft=brewery` | — | +49 951 60450 | unverified |
| Kämper Bräu | Wang | `craft=brewery` | [kaemper-braeu.de](http://kaemper-braeu.de/) `403` | — | unverified |
| Karmeliten Brauerei Karl Sturm GmbH & Co. KG | Straubing | `craft=brewery` | [karmeliten-brauerei.de](https://www.karmeliten-brauerei.de/) | +49 9421 7819 0 | unverified |
| Karwendelbräu | Mittenwald ⚠ | `craft=brewery` | — | — | unverified |
| Keesmann Bräu | Bamberg ⚠ | `craft=brewery` | — | +49 951 981980 | unverified |
| Kellerbräu Dorfen | Dorfen | `craft=brewery` | [kellerbraeu-bier.de/die-brauerei](https://www.kellerbraeu-bier.de/die-brauerei/) | — | unverified |
| Kini Brauerei | Gersthofen | `craft=brewery` | — | — | unverified |
| Kleines Brauhaus am Hotel und Landgasthof Sonnenhof | Pleinfeld ⚠ | `craft=brewery` | — | — | unverified |
| Kloster Brauerei Scheyern | Scheyern ⚠ | `craft=brewery` | — | — | unverified |
| Klosterbrauerei | Gemünden am Main ⚠ | `craft=brewery` | — | — | unverified |
| Klosterbrauerei Andechs | Andechs ⚠ | `craft=brewery` | — | — | unverified |
| Klosterbrauerei Baumburg | Altenmarkt an der Alz | `craft=brewery` | [baumburger.de](https://www.baumburger.de/) | +49 8621 9826-0 | unverified |
| Klosterbrauerei Furth | Furth ⚠ | `craft=brewery` | [klosterbrauerei-furth.de](https://www.klosterbrauerei-furth.de) | — | unverified |
| Klosterbrauerei Weißenohe | Weißenohe ⚠ | `craft=brewery` | [klosterbrauerei-weissenohe.de](https://klosterbrauerei-weissenohe.de) | +49 9192 591 | unverified |
| Klosterbrauerei Weltenburg | Kelheim | `craft=brewery` | [weltenburger.de](https://www.weltenburger.de/) | +49 9441 2040 | unverified |
| Knöchelsmühle | Schaafheim ⚠ | `craft=brewery` | — | — | unverified |
| köbi – Königsbrunner Biermanufaktur | Königsbrunn | `craft=brewery` | [koebi.bayern](https://koebi.bayern/) | — | unverified |
| Kohlmann | Unterleinleiter ⚠ | `craft=brewery` | — | — | unverified |
| Kommunbräu | Kulmbach | `craft=brewery` | — | — | unverified |
| Kommunbräu Seßlach | Seßlach | `craft=brewery` | [sesslach.de/index.php/sehenswertes-besonderes/kommunbrauhaus-sesslach](https://www.sesslach.de/index.php/sehenswertes-besonderes/kommunbrauhaus-sesslach) | +49 9569 452 | unverified |
| Kommunbrauhaus | Mitterteich | `craft=brewery` | — | — | unverified |
| Kommunbrauhaus Rossach | Großheirath | `craft=brewery` | — | +49 9565 1689 | unverified |
| König Ludwig Schlossbrauerei Kaltenberg | Geltendorf ⚠ | `craft=brewery` | — | — | unverified |
| Kössel Bräu | Eisenberg | `craft=brewery` | [koessel-braeu.de/brauerei.htm](https://www.koessel-braeu.de/brauerei.htm) | — | unverified |
| Kreuzberger Klosterbrauerei | Sandberg ⚠ | `craft=brewery` | — | — | unverified |
| Krug-Bräu | Plankenfels ⚠ | `craft=brewery` | [krug-braeu.de](https://krug-braeu.de/) | — | unverified |
| Lahma Bräu | Langenzenn | `craft=brewery` | [xn--lahmabru-6za.de](https://www.xn--lahmabru-6za.de/) | — | unverified |
| Lammsbräu | Neumarkt in der Oberpfalz | `craft=brewery` | [lammsbraeu.de](https://www.lammsbraeu.de/) | +49 9181 404-0 | unverified |
| Lampl-Bräu | Wolnzach ⚠ | `craft=brewery` | — | — | unverified |
| Landgasthof Rockermeier | Geisenfeld | `craft=brewery` | [landgasthof-rockermeier.de](https://www.landgasthof-rockermeier.de/) | +49 8452 608 | unverified |
| Landshuter Brauhaus | Landshut | `craft=brewery` | [landshuter-brauhaus.de](https://www.landshuter-brauhaus.de/) | — | unverified |
| Lang Bräu | Freyung | `craft=brewery` | [lang-braeu-freyung.de](http://www.lang-braeu-freyung.de/) | — | unverified |
| Leikeim | Altenkunstadt ⚠ | `craft=brewery` | [leikeim.de](https://www.leikeim.de/) | — | unverified |
| Leinburger Bier | Leinburg ⚠ | `craft=brewery` | [leinburger-bier.de](https://www.leinburger-bier.de/) | — | unverified |
| Lindenbräu | Weißenohe ⚠ | `craft=brewery` | [lindenbraeu.de](https://lindenbraeu.de/) | — | unverified |
| Löwen Bräu Buttenheim | Buttenheim | `craft=brewery` | — | — | unverified |
| Löwenbrauerei | Passau ⚠ | `craft=brewery` | — | — | unverified |
| Maierbier | Nördlingen ⚠ | `craft=brewery` | [maierbier.com](http://www.maierbier.com/) `→ maierbier-noerdlingen.de` | +49 9081 6041246 | unverified |
| Maierbräu | Altomünster ⚠ | `craft=brewery` | [maierbraeu.de](https://maierbraeu.de/) | — | unverified |
| Maischerei Mayr & Müller | Würzburg | `craft=brewery` | [maischerei-mayr-mueller.de](https://www.maischerei-mayr-mueller.de/) | — | unverified |
| Malzschmied | Wallenfels ⚠ | `craft=brewery` | [frankenwald-tourismus.de/detail/remoteid=5f69fbd1d964743691c9925b](https://www.frankenwald-tourismus.de/detail/remoteid=5f69fbd1d964743691c9925b) | +49 160 6454632 | unverified |
| Meckatzer Löwenbräu | Heimenkirch | `craft=brewery` | [meckatzer.de](https://www.meckatzer.de/) | — | unverified |
| Meinel Bräu | Hof ⚠ | `craft=brewery` | — | — | unverified |
| Meister | Pretzfeld ⚠ | `craft=brewery` | [xn--meisterbru-y5a.de/mod/Oeffnungszeiten.php](https://www.xn--meisterbru-y5a.de/mod/Oeffnungszeiten.php) | — | unverified |
| MetaBrewSociety | Naila | `craft=brewery` | [metabrewsociety.com](https://www.metabrewsociety.com/) | — | unverified |
| Metzgerbräu | Bad Staffelstein | `craft=brewery` | [metzgerbraeu.com](https://www.metzgerbraeu.com/) `→ uetzinger-metzgerbraeu.de` | +49 9573 6304 | unverified |
| Meusel Bräu | Buttenheim | `craft=brewery` | — | +49 9545 7424 | unverified |
| Müllerbräu | Pfaffenhofen an der Ilm ⚠ | `craft=brewery` | — | — | unverified |
| Müllerbräu | Neuötting | `craft=brewery` | — | — | unverified |
| Museen im Kulmbacher Mönchshof | Kulmbach ⚠ | `craft=brewery` | — | — | unverified |
| Museumsbrauerei | Goldkronach ⚠ | `craft=brewery` | — | — | unverified |
| Neuschter Bräu - AltNeuscht | Bad Neustadt an der Saale | `craft=brewery` | [altneuscht.de](https://www.altneuscht.de/) `404` | +49 176 57896407 | unverified |
| Nirschl Braeu | Isen | `craft=brewery` | [nirschlbraeu.wordpress.com](https://nirschlbraeu.wordpress.com/) | — | unverified |
| NOAM Brauerei GmbH | Unterschleißheim | `craft=brewery` | [noam.beer](https://noam.beer) | +49 89 411471290 | unverified |
| Oberaudorfer Privatbrauerei | Oberaudorf ⚠ | `craft=brewery` | — | — | unverified |
| Orca Brau | Nürnberg | `craft=brewery` | [orcabrau.de](https://www.orcabrau.de/) | — | unverified |
| Ottenbräu Abensberg | Abensberg | `craft=brewery` | — | +49 9443 1348 | unverified |
| Pax Bräu | Oberelsbach | `craft=brewery` | — | — | unverified |
| Pflüglerbräu | Neufahrn b. Freising | `craft=brewery` | — | — | unverified |
| Pillmeier Brauerei | Langquaid | `craft=brewery` | [pillmeier-braeu.de](https://www.pillmeier-braeu.de/) | +49 9452 3216620 | unverified |
| Pöllinger | Pfeffenhausen | `craft=brewery` | [brauerei-poellinger.de](https://www.brauerei-poellinger.de) | — | unverified |
| Privatbrauerei Hofmühl GmbH | Eichstätt ⚠ | `craft=brewery` | [hofmuehl.de](https://www.hofmuehl.de/) | — | unverified |
| Privatbrauerei Höss GmbH & Co KG | Sonthofen | `craft=brewery` | [hirschbraeu.de](https://www.hirschbraeu.de/) | +49 8321 6633-0 | unverified |
| Privatbrauerei J.B. Falter | Regen | `craft=brewery` | [jb-falter.de](https://www.jb-falter.de/) | +49992188230 | unverified |
| Privatbrauerei M.C. Wieninger | Teisendorf | `craft=brewery` | — | +49 8666 80293 | unverified |
| Privatbrauerei Raab | Hofheim in Unterfranken | `craft=brewery` | [brauerei-raab.de](https://www.brauerei-raab.de/) | +49 9523 9527-0 | unverified |
| Privatbrauerei Schnitzlbaumer | Traunstein | `craft=brewery` | [schnitzlbaumer.de](https://www.schnitzlbaumer.de/) | +49 861 708670 | unverified |
| Privatbrauerei Schweiger | Markt Schwaben ⚠ | `craft=brewery` | [schweiger-bier.de](https://schweiger-bier.de/) | +49 8121 9290 | unverified |
| Privatbrauerei Vasold & Schmidt | Neunkirchen am Brand | `craft=brewery` | — | +49 9134 99410 | unverified |
| Privatbrauerei Zötler GmbH | Rettenberg ⚠ | `craft=brewery` | [zoetler.de](https://www.zoetler.de/) | — | unverified |
| Private Landbrauerei Scheuerer | Moosbach ⚠ | `craft=brewery` | [moosbacher.com/de](https://www.moosbacher.com/de) | +49 9656 209 | unverified |
| Private Landbrauerei Schönram | Petting ⚠ | `craft=brewery` | [schoenramer.de](https://www.schoenramer.de/) | — | unverified |
| Radbrauerei Gebr. Bucher GmbH & Co. KG | Günzburg | `craft=brewery` | [guenzburger-weizen.de](https://www.guenzburger-weizen.de/) | — | unverified |
| Reichelbräu | Kulmbach | `craft=brewery` | — | — | unverified |
| Resi's Biermanufaktur | Obernburg am Main ⚠ | `craft=brewery` | [bierland-franken.de/brauereien/resis-biermanufaktur-teresa-bisani](https://www.bierland-franken.de/brauereien/resis-biermanufaktur-teresa-bisani/) | — | unverified |
| Richelbräu | München | `craft=brewery` | [richelbraeu.de](https://www.richelbraeu.de/) | — | unverified |
| Riedenburger Brauhaus | Riedenburg | `craft=brewery` | [riedenburger.de](https://www.riedenburger.de) | +49 9442 99160 | unverified |
| Ritter St.Georgen-Brauerei | Nennslingen | `craft=brewery` | [ritter-bier.de](https://ritter-bier.de) | — | unverified |
| Rook-Bräu | Schnelldorf | `craft=brewery` | — | — | unverified |
| Rotes Pony | Augsburg | `craft=brewery` | [rotespony.de](https://www.rotespony.de/) | +49 159 0 675 23 21 | unverified |
| Säger Bräu | Pottenstein ⚠ | `craft=brewery` | [saeger-golf.de/neue-seite](https://www.saeger-golf.de/neue-seite) | — | unverified |
| Saliter Bräu | Oberpframmern | `craft=brewery` | — | — | unverified |
| sandberg bräu GbR | Bubenreuth | `craft=brewery` | [sandberg-braeu.de](https://www.sandberg-braeu.de/) | — | unverified |
| Schäffler Bräu | Missen-Wilhams | `craft=brewery` | [schaeffler-braeu.de](https://schaeffler-braeu.de/) | — | unverified |
| Schanzenbräu | Nürnberg | `craft=brewery` | [schanzenbraeu.de](https://www.schanzenbraeu.de/) | +49 911 81006910 | unverified |
| Schinner | Bayreuth | `craft=brewery` | [schinnerbraustuben.de](https://schinnerbraustuben.de) | +49 921 7978 0 | unverified |
| Schlenkerla | Bamberg ⚠ | `craft=brewery` | [schlenkerla.de](https://www.schlenkerla.de/) | +49 951 560500 | unverified |
| Schlossbrauerei Autenried | Ichenhausen | `craft=brewery` | [autenrieder.de](https://autenrieder.de) | +49 8223 96840 | unverified |
| Schlossbrauerei Ebersberg | Ebersberg ⚠ | `craft=brewery` | [schlossbrauerei-ebersberg.de](https://schlossbrauerei-ebersberg.de/) | +49 8092 2470 2430 | unverified |
| Schlossbrauerei Ellingen | Höttingen ⚠ | `craft=brewery` | — | — | unverified |
| Schlossbrauerei Friedenfels | Friedenfels | `craft=brewery` | — | — | unverified |
| Schloßbrauerei Grünbach | Bockhorn | `craft=brewery` | [gruenbacher-weissbiere.de](https://www.gruenbacher-weissbiere.de/) | +49 8122 55 360 70 | unverified |
| Schloßbrauerei Hirschau | Hirschau | `craft=brewery` | — | +49 9622 2212 | unverified |
| Schlossbrauerei Maxlrain | Tuntenhausen | `craft=brewery` | [maxlrain.de/de](https://www.maxlrain.de/de/) | +49 8061 9079-0 | unverified |
| Schloßbrauerei Naabeck | Schwandorf ⚠ | `craft=brewery` | — | — | unverified |
| Schlossbrauerei Odelzhausen | Odelzhausen ⚠ | `craft=brewery` | — | — | unverified |
| Schlossbrauerei Reckendorf | Reckendorf | `craft=brewery` | [recken.de](https://recken.de) | +49 9544 94210 | unverified |
| Schloßbrauerei Stelzer | Oberkotzau ⚠ | `craft=brewery` | [schlossbrauerei-stelzer.de](https://www.schlossbrauerei-stelzer.de/) | — | unverified |
| Schlossbrauerei Unterbaar | Baar | `craft=brewery` | [schlossbrauerei-unterbaar.de](https://www.schlossbrauerei-unterbaar.de) | +49 8276 58980 | unverified |
| Schneider | Essing | `craft=brewery` | [brauereigasthof-schneider.de](https://www.brauereigasthof-schneider.de/) | +49 9447 9180 0 | unverified |
| Schneider Weisse | Kelheim ⚠ | `craft=brewery` | [schneider-weisse.de](https://www.schneider-weisse.de) | — | unverified |
| Schneider-Bräu Rohrenfels | Rohrenfels | `craft=brewery` | — | — | unverified |
| Schwannen Bräu | Unterschwaningen ⚠ | `craft=brewery` | [zurgoldenenschwanne@gmx.net](https://zurgoldenenschwanne@gmx.net) `→ gmx.net` | +49 9836 337 | unverified |
| Schwarzbräu | Zusmarshausen | `craft=brewery` | [schwarzbraeu.de](https://www.schwarzbraeu.de/) | — | unverified |
| Schweizerhof | Kulmbach | `craft=brewery` | — | — | unverified |
| Silbernagel | Hausham ⚠ | `craft=brewery` | — | — | unverified |
| Simsseer Braumanufaktur | Stephanskirchen | `craft=brewery` | [simsseer.de](https://www.simsseer.de/) | +49 175 6696890 | unverified |
| Spessart-Brauerei GmbH | Kreuzwertheim ⚠ | `craft=brewery` | [spessart-brauerei.de](https://spessart-brauerei.de/) | +49 9342 85700 | unverified |
| St. Georgenbräu | Buttenheim | `craft=brewery` | [georgenbraeu.de](http://www.georgenbraeu.de/) | +49 9545 446-0 | unverified |
| Stadtbrauerei Spalt | Spalt ⚠ | `craft=brewery` | [spalter-bier.de](https://spalter-bier.de) | — | unverified |
| Staffelberg-Bräu | Bad Staffelstein | `craft=brewery` | [staffelberg-braeu.de](https://www.staffelberg-braeu.de) | +49 9573 5925 | unverified |
| Stangl | Spiegelau | `craft=brewery` | — | — | unverified |
| Stanglbräu | Herrnwahlthann | `craft=brewery` | [stanglbraeu.de](https://www.stanglbraeu.de/) | +49 9448 91830 | unverified |
| Starnberger Brauhaus | Feldafing | `craft=brewery` | [starnberger-brauhaus.de](https://starnberger-brauhaus.de/) | — | unverified |
| Staudenbräu Schorer | Walkertshofen | `craft=brewery` | [staudenbraeu.de](https://staudenbraeu.de/) | +49 8239 507 | unverified |
| Stefansbräu | Dinkelsbühl | `craft=brewery` | [dinkelbrauer.de](http://www.dinkelbrauer.de) | +499851582393 | unverified |
| Steinbauer | Neuendettelsau | `craft=brewery` | — | — | unverified |
| Stiangbräu | Rohrbach ⚠ | `craft=brewery` | — | — | unverified |
| Storchenbräu | Pfaffenhausen | `craft=brewery` | [storchenbraeu.de](https://www.storchenbraeu.de/) | +49 8265 7022 | unverified |
| Taufkirchner Brauerei | Taufkirchen (Vils) | `craft=brewery` | [taufkirchner-brauerei.de](http://www.taufkirchner-brauerei.de/) `→ taufkirchner.de` | +49 8084 2377 | unverified |
| Technisches Büro Weihenstephan | Freising ⚠ | `craft=brewery` | [tbw-freising.de](https://tbw-freising.de/) | — | unverified |
| ThomasBräu | Ruderting ⚠ | `craft=brewery` | — | +49 176 55598690 | unverified |
| Unertl Weißbier GmbH | Haag in Oberbayern | `craft=brewery` | [unertl.de](https://www.unertl.de/) | +49 8072 8297 | unverified |
| Unserdorfbräu | Seeshaupt | `craft=brewery` | [xn--unserdorfbru-qcb.de](https://www.xn--unserdorfbru-qcb.de/) `muerto` | — | unverified |
| Urban Chestnut - Hallertauer Brauerei | Wolnzach | `craft=brewery` | [urbanchestnut.de](https://www.urbanchestnut.de/) | — | unverified |
| Urbanus Brauerei | Pfaffenhofen a.d. Ilm | `craft=brewery` | — | — | unverified |
| Wachtelbräu Gossenberg | Großheirath ⚠ | `craft=brewery` | [wachtelbraeu.de](https://wachtelbraeu.de) | — | unverified |
| Waldschloss-Brauerei Frammersbach | Frammersbach ⚠ | `craft=brewery` | [waldschloss-brauerei.de](https://www.waldschloss-brauerei.de/) | +49 9355 97340 | unverified |
| Weißbierbrauerei Hopf | Miesbach | `craft=brewery` | [hopfweisse.de](https://www.hopfweisse.de/) | — | unverified |
| Weißbräu Andorfer | Passau | `craft=brewery` | [andorfer-weissbraeu.de](https://andorfer-weissbraeu.de/) | +49851754444 | unverified |
| Weißbräu Kößlarn | Kößlarn ⚠ | `craft=brewery` | [weissbraeu-koesslarn.de](https://weissbraeu-koesslarn.de/) | — | unverified |
| Weissbräu Schwendl | Tacherting ⚠ | `craft=brewery` | — | — | unverified |
| Werksviertel Bräu | München ⚠ | `craft=brewery` | [werksviertelbräu.de](https://werksviertelbräu.de/) `muerto` | +49 89 628344300 | unverified |
| Wildbräu Grafing | Grafing bei München | `craft=brewery` | [wildbraeu.de](https://www.wildbraeu.de/) | +49 8092 700912 | unverified |
| Will Bräu Brauerei | Motten | `craft=brewery` | — | — | unverified |
| Wochinger-Bräu | Traunstein | `craft=brewery` | [wochingerbraeu.de](http://www.wochingerbraeu.de/) | +49 861 986060 | unverified |
| Würzburger Hofbräu | Würzburg ⚠ | `craft=brewery` | — | — | unverified |
| Zehendner | Schönbrunn im Steigerwald ⚠ | `craft=brewery` | [moenchsambacher.de](https://moenchsambacher.de/) | +49 9546 380 | unverified |
| Zehmerbräu | Kirchheim bei München ⚠ | `craft=brewery` | [zehmerbraeu.de](https://www.zehmerbraeu.de) `muerto` | +49 89 3746 7596 | unverified |
| Ziegler Bräu | Mainburg | `craft=brewery` | [ziegler-braeu-mainburg.de](http://www.ziegler-braeu-mainburg.de/) `→ ziegler-braeu-mainburg.com` | +49 8751 1470 | unverified |
| Zombräu | Essenbach | `craft=brewery` | [zombraeu.com](https://www.zombraeu.com/) | — | unverified |
| Zum Neuen Brauhaus 1816 | Marktheidenfeld | `craft=brewery` | — | — | unverified |
| Altes Müllerbräu-Sudhaus | Pfaffenhofen an der Ilm ⚠ | `industrial` | — | — | unverified |
| Augustiner Bräu München | München | `industrial` | [augustiner-braeu.de](https://www.augustiner-braeu.de/) | — | unverified |
| Ayinger Privatbrauerei | Aying ⚠ | `industrial` | [ayinger.de](https://www.ayinger.de/) | — | unverified |
| Brauerei "Zum Fuchsbeck" | Sulzbach-Rosenberg | `industrial` | [fuchsbeck.de](https://www.fuchsbeck.de/) | +49 9661 4518 | unverified |
| Brauerei C. Wittmann | Landshut ⚠ | `industrial` | — | — | unverified |
| Brauerei Egerer | Pilsting ⚠ | `industrial` | [egerer.de](https://www.egerer.de/) | — | unverified |
| Brauerei Erding | Erding ⚠ | `industrial` | — | — | unverified |
| Brauerei Gut Forsting | Albaching ⚠ | `industrial` | [brauerei-forsting.de](https://www.brauerei-forsting.de) | — | unverified |
| Brauerei Kesselring | Marktsteft | `industrial` | [kesselring-bier.de](https://www.kesselring-bier.de/) | — | unverified |
| Brauerei Stöttner | Mallersdorf-Pfaffenberg | `industrial` | [stoettner.de](https://www.stoettner.de/) | — | unverified |
| Brauerei Wolferstetter | Vilshofen an der Donau | `industrial` | — | — | unverified |
| Brauerrei Hösl | Mitterteich ⚠ | `industrial` | — | — | unverified |
| Brauhaus Leikeim | Altenkunstadt ⚠ | `industrial` | [leikeim.de](https://www.leikeim.de/) | +49 9572 75050 | unverified |
| Eder & Heylands | Schaafheim ⚠ | `industrial` | — | — | unverified |
| Eittinger Fischerbräu | Eitting | `industrial` | [eittinger-fischerbräu.de](http://www.eittinger-fischerbräu.de) `400` | +49 8122 9598960 | unverified |
| Entlas Bräu | Erlangen ⚠ | `industrial` | — | — | unverified |
| Gräfliche Brauerei Arco-Valley | Eichendorf ⚠ | `industrial` | [graf-arco.de](https://graf-arco.de/) | — | unverified |
| Herrnbräu | Ingolstadt | `industrial` | [herrnbraeu.de](http://www.herrnbraeu.de) | +49 841 6310 | unverified |
| Kaiser Bräu | Neuhaus a.d.Pegnitz | `industrial` | [kaiser-braeu.de](https://www.kaiser-braeu.de) | +499156880 | unverified |
| Kauzen-Bräu | Ochsenfurt | `industrial` | [kauzen.de](http://kauzen.de) | +49 9331 87250 | unverified |
| Kulmbacher Brauerei AG | Kulmbach ⚠ | `industrial` | [kulmbacher.de](https://www.kulmbacher.de/) | — | unverified |
| Löwenbräu AG | München | `industrial` | [loewenbraeu.de](https://loewenbraeu.de/) | — | unverified |
| Marthabräu | Fürstenfeldbruck ⚠ | `industrial` | — | — | unverified |
| Oettinger Brauerei | Oettingen i.Bay. | `industrial` | [oettinger-bier.de](https://www.oettinger-bier.de/) `→ oettinger1731.de` | — | unverified |
| Oettinger Brauerei | Oettingen in Bayern ⚠ | `industrial` | [oettinger-bier.de](https://www.oettinger-bier.de/) `→ oettinger1731.de` | — | unverified |
| Paulaner Brauerei | München | `industrial` | [paulaner.de](https://www.paulaner.de) | — | unverified |
| Privatbrauerei Erdinger Weißbräu | Erding | `industrial` | [de.erdinger.de](https://de.erdinger.de/) `→ erdinger.de` | — | unverified |
| Pyraser Landbrauerei GmbH | Thalmässing | `industrial` | [pyraser.de](https://pyraser.de/) | — | unverified |
| Scherdel Brauerei | Hof | `industrial` | [scherdelbier.de](https://www.scherdelbier.de/) | — | unverified |
| Schlossbrauerei Au/Hallertau | Au i.d. Hallertau | `industrial` | [auer-bier.de/rundgang.htm](http://auer-bier.de/rundgang.htm) `muerto` | — | unverified |
| Spaten-Franziskaner Bräu GmbH | München | `industrial` | [spatenbraeu.de](https://spatenbraeu.de/) | — | unverified |
| Spessart-Brauerei | Kreuzwertheim ⚠ | `industrial` | — | — | unverified |
| Staatliches Hofbräuhaus in München | Feldkirchen ⚠ | `industrial` | [hofbraeu-muenchen.de](https://www.hofbraeu-muenchen.de/) `403` | — | unverified |
| Tucher Bräu AG Abfüllanlage | Nürnberg | `industrial` | [tucher.de](https://tucher.de/) | — | unverified |
| 's Antla | Kronach | `microbrewery` | [antla.de](https://www.antla.de/) | +49 9261 5045950 | unverified |
| 1. Bier- & Wohlfühlhotel Gut Riedelsbach | Neureichenau | `microbrewery` | [gut-riedelsbach.de](https://www.gut-riedelsbach.de/) | +49 8583 96040 | unverified |
| Adler Bräu | Stettfeld | `microbrewery` | [adlerbraeu-stettfeld.de/gaststaette](https://www.adlerbraeu-stettfeld.de/gaststaette/) `404` | +49 9522 369 | unverified |
| Airbräu | Hallbergmoos ⚠ | `microbrewery` | [munich-airport.de/de/micro/airbraeu/index.jsp](https://www.munich-airport.de/de/micro/airbraeu/index.jsp) `5xx` | — | unverified |
| Altstadthotel Winkler | Berching ⚠ | `microbrewery` | [brauereigasthof-winkler.de](http://www.brauereigasthof-winkler.de/) `→ winkler-berching.de` | — | unverified |
| Auf der Theta | Heinersreuth ⚠ | `microbrewery` | [auf-der-theta.de](https://www.auf-der-theta.de/) | +49 9208 65361 | unverified |
| Augustiner Bräustuben | München | `microbrewery` | [braeustuben.de](https://www.braeustuben.de/) | +49 89 507047 | unverified |
| Augustiner Bräustüberl | München ⚠ | `microbrewery` | — | — | unverified |
| Autenrieder Brauereigasthof | Ichenhausen | `microbrewery` | [brauereigasthof-autenried.de](https://brauereigasthof-autenried.de/) | +49 8223 9684 40 | unverified |
| Ban Bräu | Bad Staffelstein | `microbrewery` | — | — | unverified |
| Bärenwirt Neuhausen | Holzheim | `microbrewery` | [baerig-gut.de](http://www.baerig-gut.de/) | +49 7302 3113 | unverified |
| Barfüßer-Biergarten im Glacis | Neu-Ulm | `microbrewery` | [biergarten-glacis.de](https://www.biergarten-glacis.de/) `muerto` | +49 731 4006630 | unverified |
| Bayerisches Brauereimuseum | Kulmbach | `microbrewery` | [kulmbacher-moenchshof.de](http://www.kulmbacher-moenchshof.de/) | +49 9221 805 14 | unverified |
| Bayrisch Brau Pub | Augsburg ⚠ | `microbrewery` | [bayrisch-brau-pub.de](https://www.bayrisch-brau-pub.de/) | — | unverified |
| Beck-Bräu | Lisberg | `microbrewery` | [beck-braeu.de](https://www.beck-braeu.de/) | +49 9549 988999 | unverified |
| Beim Binner | Windischeschenbach | `microbrewery` | [zoiglbier.de/die-brauer/windischeschenbach/binner](https://zoiglbier.de/die-brauer/windischeschenbach/binner/) | +49 9681 1498 | unverified |
| Beim Gloser | Windischeschenbach | `microbrewery` | [beimgloser.de](https://www.beimgloser.de/) | +49 9681 3170 | unverified |
| Beim Olivenbauer | Füssen | `microbrewery` | [beim-olivenbauer.de](https://beim-olivenbauer.de/) | +49 8362 6250 | unverified |
| Bichlbräu Braukunst | Teisendorf | `microbrewery` | — | — | unverified |
| Bier Alp | Rettenberg | `microbrewery` | [bernardibraeu.de](https://www.bernardibraeu.de/) | +49 8327 9326180 | unverified |
| Biergarten Brauereigasthof Schneider | Essing | `microbrewery` | [brauereigasthof-schneider.de](https://www.brauereigasthof-schneider.de) | +49 9447 91800 | unverified |
| Biergarten Wirtshaus zum Schweinsbräu | Glonn ⚠ | `microbrewery` | — | — | unverified |
| Bob's 7. geilste Bar der Welt | Augsburg | `microbrewery` | [bobs.de/standorte/bobs-oberhausen](https://bobs.de/standorte/bobs-oberhausen/) | +49 821 4508484 | unverified |
| Bob's Haunstetten | Augsburg | `microbrewery` | — | — | unverified |
| Brauda Büchl | Ering | `microbrewery` | [braudabuechl.de/wirtshaus](https://braudabuechl.de/wirtshaus/) `muerto` | — | unverified |
| Brauerei & Gasthof Rittmayer | Adelsdorf | `microbrewery` | [rittmayer-aisch.de](http://www.rittmayer-aisch.de/) | +49 9195 7222 | unverified |
| Brauerei Aschach | Bad Bocklet | `microbrewery` | — | — | unverified |
| Brauerei Baptist Günther | Burgkunstadt | `microbrewery` | [guenther-braeu.de](https://www.guenther-braeu.de/) | +49 9572 9261 | unverified |
| Brauerei Büttner | Frensdorf | `microbrewery` | [brauerei-buettner.de](https://www.brauerei-buettner.de) | +49 9502 342 | unverified |
| Brauerei Dantscher | Teugn | `microbrewery` | — | +49 9405 962 110 | unverified |
| Brauerei Drei Kronen | Scheßlitz | `microbrewery` | [kronabier.de](http://www.kronabier.de/) | +49 9542 1564 | unverified |
| Brauerei Dremel | Wattendorf | `microbrewery` | [brauerei-dremel.de](https://www.brauerei-dremel.de/) | +49 9504 271 | unverified |
| Brauerei Düll | Martinsheim ⚠ | `microbrewery` | [duell-gnodstadt.de](https://www.duell-gnodstadt.de/) | — | unverified |
| Brauerei Eller | Untersiemau | `microbrewery` | — | +49 9565 1033 | unverified |
| Brauerei Gasthaus Schrüfer | Priesendorf ⚠ | `microbrewery` | — | +499549317 | unverified |
| Brauerei Gasthaus Seitz (Elch-Bräu) | Egloffstein ⚠ | `microbrewery` | [elchbraeu.de](https://www.elchbraeu.de/) | +49 9197 221 | unverified |
| Brauerei Gasthof Bayer | Rauhenebrach | `microbrewery` | [bayer-theinheim.de](https://www.bayer-theinheim.de/) | +49 9554 293 | unverified |
| Brauerei Gasthof Greifenklau | Bamberg | `microbrewery` | [greifenklau.de](http://www.greifenklau.de) | +49 951 53219 | unverified |
| Brauerei Gasthof Hirsch | Leipheim ⚠ | `microbrewery` | — | — | unverified |
| Brauerei Gasthof Hotel Eck | Böbrach | `microbrewery` | [brauerei-eck.de](https://www.brauerei-eck.de/) | — | unverified |
| Brauerei Gasthof Rötter | Gerolfingen | `microbrewery` | [roetter-gerolfingen.de](https://www.roetter-gerolfingen.de) | +49 9854 380 | unverified |
| Brauerei Gasthof Winkler | Velburg | `microbrewery` | [winkler-braeu.de](https://www.winkler-braeu.de/) | +49 9182 170 | unverified |
| Brauerei Gaststätte Schroll | Reckendorf | `microbrewery` | — | +49 9544 20338 | unverified |
| Brauerei Haberstumpf | Trebgast | `microbrewery` | [brauerei-haberstumpf.de](https://brauerei-haberstumpf.de/) `→ brauereihaberstumpf.de` | +49 9227 351 | unverified |
| Brauerei Hartleb | Maroldsweisach | `microbrewery` | — | +49 9532 240 | unverified |
| Brauerei Hartmann | Scheßlitz | `microbrewery` | [brauerei-hartmann.de](https://www.brauerei-hartmann.de/) | +49 9542 920300 | unverified |
| Brauerei Hennemann | Pommersfelden | `microbrewery` | [brauerei-hennemann.com](http://www.brauerei-hennemann.com/) | +49 9502 4307 | unverified |
| Brauerei Hölzlein | Litzendorf | `microbrewery` | [fraenkische-schweiz.com/de/detail/id=5f200f0f35d51e7066533a3e](https://www.fraenkische-schweiz.com/de/detail/id=5f200f0f35d51e7066533a3e) | +49 9505 357 | unverified |
| Brauerei Hönig Gasthof zur Post | Litzendorf | `microbrewery` | [brauerei-hoenig.de](https://brauerei-hoenig.de/) | — | unverified |
| Brauerei Hübner | Wattendorf | `microbrewery` | [brauerei-huebner.de](http://www.brauerei-huebner.de) | +49 9504 207 | unverified |
| Brauerei Hübner | Stadelhofen | `microbrewery` | [huebner-braeu.de](https://huebner-braeu.de/) | +49 9207 259 | unverified |
| Brauerei Ibel | Burgwindheim | `microbrewery` | — | +49 9551 295 | unverified |
| Brauerei Kraus | Hirschaid | `microbrewery` | [brauerei-kraus.de](https://www.brauerei-kraus.de/) | +49 9543 84440 | unverified |
| Brauerei Mager | Pottenstein | `microbrewery` | [brauerei-mager.de](https://www.brauerei-mager.de/) | +49 9243 333 | unverified |
| Brauerei Martin | Schonungen | `microbrewery` | [brauerei-martin.de](http://www.brauerei-martin.de) | +49 9727 403011 | unverified |
| Brauerei Messhofen | Roggenburg | `microbrewery` | [brauerei-messhofen.de](https://www.brauerei-messhofen.de) | +49 7300 301 | unverified |
| Brauerei Nikl | Pretzfeld | `microbrewery` | [brauerei-nikl.de](https://www.brauerei-nikl.de/) | +49 9194 725025 | unverified |
| Brauerei Püttner | Schlammersdorf ⚠ | `microbrewery` | [brauerei-puettner.de](https://brauerei-puettner.de/) | +49 9205 292 | unverified |
| Brauerei Rudolf Fischer | Rattelsdorf | `microbrewery` | [hahnerla.de](https://www.hahnerla.de/) `muerto` | +49 9547 488 | unverified |
| Brauerei Sauer | Strullendorf | `microbrewery` | [brauerei-sauer.de](https://www.brauerei-sauer.de/) | +49 9543 1578 | unverified |
| Brauerei Scharpf | Seßlach | `microbrewery` | [scharpf-heilgersdorf.de](https://www.scharpf-heilgersdorf.de/) | +49 9569 1232 | unverified |
| Brauerei Schwan | Burgebrach | `microbrewery` | [schwanawirt.de](https://www.schwanawirt.de/) | +49 9546 306 | unverified |
| Brauerei Simmerberg | Weiler-Simmerberg ⚠ | `microbrewery` | — | — | unverified |
| Brauerei Sippel | Baunach | `microbrewery` | — | — | unverified |
| Brauerei Stirnweiß | Itzgrund | `microbrewery` | [brauerei-stirnweiss.de](http://www.brauerei-stirnweiss.de/) | +499573 7919 | unverified |
| Brauerei und Gasthof Drummer | Leutenbach | `microbrewery` | [brauerei-gasthof-drummer.de](https://www.brauerei-gasthof-drummer.de/) | +49 9199 403 | unverified |
| Brauerei Wagner | Memmelsdorf | `microbrewery` | [wagner-merkendorf.de](http://www.wagner-merkendorf.de/) | +49 9542 620 | unverified |
| Brauerei Wagner | Oberhaid | `microbrewery` | [brauerei-wagner-oberhaid.de](https://www.brauerei-wagner-oberhaid.de/) | +49 9503 229 | unverified |
| Brauerei Weber | Pettstadt ⚠ | `microbrewery` | — | +49 9543 7882 | unverified |
| Brauerei-Ausschank Schnitzlbaumer | Traunstein | `microbrewery` | [schnitzlbaumer.de](http://www.schnitzlbaumer.de/) | +49 861 986650 | unverified |
| Brauerei-Gasthaus Hofmann | Gräfenberg | `microbrewery` | — | +49 9192 251 | unverified |
| Brauerei-Gasthaus Thomann | Bad Staffelstein | `microbrewery` | [brauerei-thomann.de](https://www.brauerei-thomann.de) | +49 9573 5296 | unverified |
| Brauerei-Gasthaus Will | Stadelhofen | `microbrewery` | [schederndorf.de](https://www.schederndorf.de/) | +49 9504 262 | unverified |
| Brauerei-Gasthof Hellmuth | Bad Staffelstein | `microbrewery` | [gasthaus-hellmuth.de](https://www.gasthaus-hellmuth.de/) | +49 9573 4395 | unverified |
| Brauerei-Gasthof Hennemann | Bad Staffelstein | `microbrewery` | [gasthof-hennemann.de](http://www.gasthof-hennemann.de/) | +49 9573 96100 | unverified |
| Brauerei-Gasthof Höhn | Memmelsdorf | `microbrewery` | [gasthof-hoehn.de](http://www.gasthof-hoehn.de) `→ hotel-gasthof-hoehn.de` | +49 951 401640 | unverified |
| Brauerei-Gasthof Hotel Post | Nesselwang ⚠ | `microbrewery` | [hotel-post-nesselwang.de](https://www.hotel-post-nesselwang.de/) | — | unverified |
| Brauerei-Gasthof Müller | Stegaurach ⚠ | `microbrewery` | [debringer-bier.de](http://www.debringer-bier.de/) | +49 951 29191 | unverified |
| Brauerei-Gasthof Reblitz | Bad Staffelstein | `microbrewery` | [brauerei-gasthof-reblitz.de](http://www.brauerei-gasthof-reblitz.de) `→ brauerei-reblitz.de` | +49 9573 96500 | unverified |
| Brauerei-Gasthof Zur alten Mühle | Walsdorf ⚠ | `microbrewery` | [stegaurach.de/brauerei-gasthof-zur-alten-muehle](http://www.stegaurach.de/brauerei-gasthof-zur-alten-muehle) `404` | +49 951 29119 | unverified |
| Brauerei-Gaststätte Endres | Rattelsdorf | `microbrewery` | — | +49 9547 264 | unverified |
| Brauerei-Gaststätte Stöckel | Ahorntal ⚠ | `microbrewery` | [stoeckel-braeu.de](https://www.stoeckel-braeu.de/) | +49 9246 275 | unverified |
| Brauereigasthaus Weller | Erlangen | `microbrewery` | [brauerei-weller.de](https://www.brauerei-weller.de/) | — | unverified |
| Brauereigasthof Geyer | Oberreichenbach | `microbrewery` | [brauereigasthof-geyer.de](https://brauereigasthof-geyer.de/) | +49 9104 2802 | unverified |
| Brauereigasthof Göller | Memmelsdorf | `microbrewery` | [goeller-brauerei.de](http://www.goeller-brauerei.de/) | +49 9505 1745 | unverified |
| Brauereigasthof Goss | Deuerling | `microbrewery` | [brauerei-goss.de](https://www.brauerei-goss.de/) | +49 9498 1512 | unverified |
| Brauereigasthof Kaiser | Burgebrach | `microbrewery` | [brauerei-kaiser.de](https://brauerei-kaiser.de/) | +49 9546 390 | unverified |
| Brauereigasthof Krone | Kronburg | `microbrewery` | [brauerei-kronburg.de/gasthof/gasthof.htm](https://www.brauerei-kronburg.de/gasthof/gasthof.htm) | +49 8394 237 | unverified |
| Brauereigasthof Landwehr-Bräu | Steinsfeld | `microbrewery` | [landwehr-braeu.de](https://www.landwehr-braeu.de/) | — | unverified |
| Brauereigasthof Pfister | Eggolsheim | `microbrewery` | [pfister-weigelshofen.de](https://www.pfister-weigelshofen.de/) | +49 9545 9426-0 | unverified |
| Brauereigasthof Plank | Schwandorf | `microbrewery` | [brauereigasthof-plank.de](https://www.brauereigasthof-plank.de/) | +49 9431 608 89 | unverified |
| Brauereigasthof Prechtel | Uehlfeld | `microbrewery` | [brauerei-prechtel.de](https://www.brauerei-prechtel.de/) | +49 9163 228 | unverified |
| Brauereigasthof Reichold | Aufseß | `microbrewery` | [reichold.de](http://www.reichold.de/) `→ brauerei-reichold.de` | +49 9204 271 | unverified |
| Brauereigasthof Rothenbach | Aufseß | `microbrewery` | [brauereigasthof-rothenbach.de](http://www.brauereigasthof-rothenbach.de/) | +49 9198 9292-0 | unverified |
| Brauereigasthof Schäffler | Missen-Wilhams | `microbrewery` | [schaeffler-braeu.de](https://www.schaeffler-braeu.de) | +49 8320 9200 | unverified |
| Brauereigasthof Schneider | Essing | `microbrewery` | [brauereigasthof-schneider.de/index.php/de/brauereigasthof](https://www.brauereigasthof-schneider.de/index.php/de/brauereigasthof) | +49 9447 91800 | unverified |
| Brauereigasthof St. Afra im Felde | Friedberg | `microbrewery` | [sankt-afra.eu](https://www.sankt-afra.eu/) | +49 821 6089150 | unverified |
| Brauereigasthof Stadter | Aufseß | `microbrewery` | [braulehrer.de](http://www.braulehrer.de/) | +49 9274 8193 | unverified |
| Brauereigasthof und Pension Zur Sonne | Bischberg | `microbrewery` | [sonnenbier.de](https://www.sonnenbier.de) | +4995162571 | unverified |
| Brauereigasthof Zwanzger | Uehlfeld ⚠ | `microbrewery` | [brauerei-gasthof-zwanzger.de](https://www.brauerei-gasthof-zwanzger.de/) | +49 9163 959756 | unverified |
| Brauereigaststätte Hoh | Scheßlitz | `microbrewery` | — | +49 9542 627 | unverified |
| Brauereigaststätte Leidmann | Unterneukirchen | `microbrewery` | [brauerei-leidmann.de](https://www.brauerei-leidmann.de/) | +49 8634 984150 | unverified |
| Brauereigaststätte Stierberg | Obertaufkirchen | `microbrewery` | [brauereigaststaette-stierberg.de](https://brauereigaststaette-stierberg.de/) | +49 8082 1851 | unverified |
| Brauereigastwirtschaft Först | Eggolsheim | `microbrewery` | [brauerei-foerst.de](https://brauerei-foerst.de/) | +49 9545 8583 | unverified |
| Brauervereinigung Pegnitz | Pegnitz | `microbrewery` | — | +49 9241 4839937 | unverified |
| Braugasthof Falkenstein | Pfronten | `microbrewery` | [braugasthof-falkenstein.de](https://www.braugasthof-falkenstein.de/) | +49 8363 960658 | unverified |
| Braugasthof Grosch | Rödental | `microbrewery` | [der-grosch.de](https://der-grosch.de/) `403` | +49 9563 7500 | unverified |
| Brauhaus 1516 | Ingolstadt | `microbrewery` | [brauhaus1516-ingolstadt.de](https://brauhaus1516-ingolstadt.de) | +49 841 9568 777 | unverified |
| Brauhaus am Kreuzberg | Hallerndorf ⚠ | `microbrewery` | [brauhaus-am-kreuzberg.de](https://www.brauhaus-am-kreuzberg.de/) | +49 9545 4736 | unverified |
| Brauhaus Barbarossa | Schöllkrippen | `microbrewery` | [brauhaus-barbarossa.de](https://brauhaus-barbarossa.de/) | +49 6024 5454 | unverified |
| Brauhaus Budenschuster | Bad Steben | `microbrewery` | [brauhaus-budenschuster.de](https://www.brauhaus-budenschuster.de/) | — | unverified |
| Brauhaus Murnau | Murnau am Staffelsee | `microbrewery` | [griesbraeu.de/de/restaurant-braugasthof-murnau](https://griesbraeu.de/de/restaurant-braugasthof-murnau/) | +49 8841 3920 | unverified |
| Brauhaus zu Coburg | Coburg ⚠ | `microbrewery` | [brauhaus-coburg.de](http://www.brauhaus-coburg.de) | +49 9561 7059192 | unverified |
| Bräustüberl | Baar ⚠ | `microbrewery` | — | — | unverified |
| Bräustüberl | Odelzhausen | `microbrewery` | [schlossgut-odelzhausen.de/de](https://www.schlossgut-odelzhausen.de/de/) | +49 8134 99870 | unverified |
| Bräustüberl Grünbach | Bockhorn | `microbrewery` | [gruenbacher-weissbiere.de/br%C3%A4ust%C3%BCberl](https://www.gruenbacher-weissbiere.de/br%C3%A4ust%C3%BCberl/) | +49 8122 9418072 | unverified |
| Brauwerk.dohi | Mitterteich | `microbrewery` | — | — | unverified |
| Bräuwirt | Weiden i.d.OPf. | `microbrewery` | [braeuwirt.de](https://www.braeuwirt.de/) `→ genussmomente-weiden.de` | — | unverified |
| Brewsli | München ⚠ | `microbrewery` | [brewsli.de](https://brewsli.de/) | — | unverified |
| Café & Kater | Traunstein | `microbrewery` | — | — | unverified |
| Canada | Aichach | `microbrewery` | [canada-mauerbach.de](https://www.canada-mauerbach.de/) | — | unverified |
| CraftBräu | Dießen am Ammersee | `microbrewery` | [craft-braeu.com](http://craft-braeu.com) `→ craft-braeu.de` | — | unverified |
| Dachsbräu | Weilheim in Oberbayern | `microbrewery` | [dachsbier.de/braeustueberl](https://www.dachsbier.de/braeustueberl/) `404` | +49 881 2693 | unverified |
| Der Bergbauernwirt | Bolsterlang | `microbrewery` | [derbergbauernwirt.com](https://www.derbergbauernwirt.com) `→ derbergbauernwirt.de` | +4983267444 | unverified |
| Die Fischerei Oberle | Erlangen | `microbrewery` | [fischerei-oberle.de](https://www.fischerei-oberle.de/) | +49 9131 45556 | unverified |
| Die Hecke | Bad Füssing | `microbrewery` | [die-hecke.de](https://www.die-hecke.de/) | — | unverified |
| Dorfbiergarten Stark | Ringelai | `microbrewery` | — | — | unverified |
| Drei Kronen | Memmelsdorf | `microbrewery` | [drei-kronen.de](http://www.drei-kronen.de) | +49 951 944330 | unverified |
| Eschenbacher Privatbrauerei | Stettfeld ⚠ | `microbrewery` | — | — | unverified |
| Faust Bräustüble | Miltenberg | `microbrewery` | [faust-braustuben.de](https://faust-braustuben.de/) | +49 9371 2709 | unverified |
| Ferdls Bräustüble | Sonthofen | `microbrewery` | [zumgoldenenhirsch.com](https://zumgoldenenhirsch.com/) | +49 8321 67280 | unverified |
| Flugwerk | Feldkirchen | `microbrewery` | [flugwerk-feldkirchen.de](https://flugwerk-feldkirchen.de/) | +49 89 94417718 | unverified |
| Forschungsbrauerei | München | `microbrewery` | — | — | unverified |
| Friedmanns Bräustübl | Gräfenberg | `microbrewery` | [friedmanns-braeustuebl.de](https://www.friedmanns-braeustuebl.de/) | +49 9192 992318 | unverified |
| Gambertbräu | Weißenbrunn | `microbrewery` | [gampertbraeu.de](https://www.gampertbraeu.de/) | +49 9261 60330 | unverified |
| Gasthaus Blumenthal | Aichach | `microbrewery` | [schloss-blumenthal.de/gasthaus/#oeffnungszeiten](https://www.schloss-blumenthal.de/gasthaus/#oeffnungszeiten) | +49 8251 889 442 | unverified |
| Gasthaus der Biermann | München | `microbrewery` | [gasthausbiermann.de](https://www.gasthausbiermann.de/) | +49 89 94539-515 | unverified |
| Gasthaus Dickas | Bischofsheim i.d.Rhön | `microbrewery` | [rhoener-schaubrennerei.de](https://www.rhoener-schaubrennerei.de/) | +49 9772 456 | unverified |
| Gasthaus Drei Kronen Brauerei Aichinger | Heiligenstadt i. OFr. | `microbrewery` | [bierland-franken.de/gasthoefe/gasthof-drei-kronen-aichinger](https://www.bierland-franken.de/gasthoefe/gasthof-drei-kronen-aichinger/) | +49 9198 522 | unverified |
| Gasthaus Held-Bräu | Ahorntal | `microbrewery` | [held-braeu.de](http://www.held-braeu.de/) | +49 9242 295 | unverified |
| Gasthaus Kraus | Dieterskirchen ⚠ | `microbrewery` | — | — | unverified |
| Gasthaus Lindenbräu | Gräfenberg | `microbrewery` | [lindenbraeu.de](https://lindenbraeu.de/) | +49 9192 348 | unverified |
| Gasthaus Reinwand | Seßlach | `microbrewery` | [gasthof-reinwand.de](https://www.gasthof-reinwand.de/) | — | unverified |
| Gasthaus Sterk | Amberg | `microbrewery` | — | — | unverified |
| Gasthaus Stöttner "Zum gemütlichern Treff! | Mallersdorf-Pfaffenberg | `microbrewery` | [stoettner-treff.de](https://www.stoettner-treff.de/) | +49 8772 5102 | unverified |
| Gasthaus Zur alten Brauerei "Zapf" | Uettingen | `microbrewery` | [alte-brauerei.de](https://www.alte-brauerei.de/) | +49 9369 8221 | unverified |
| Gasthaus zur Sonne | Denklingen | `microbrewery` | [zur-sonne-epfach.de](https://zur-sonne-epfach.de/) | +49 8869 911666 | unverified |
| Gasthof "Zum Löwenbräu" | Adelsdorf ⚠ | `microbrewery` | — | — | unverified |
| Gasthof Adam Bräu | Bodenmais ⚠ | `microbrewery` | [adam-braeu.de](https://www.adam-braeu.de/) | +49 9924 94000 | unverified |
| Gasthof Kohlenmühle | Neustadt an der Aisch ⚠ | `microbrewery` | [kohlenmuehle.de](https://www.kohlenmuehle.de/) | +49 9161 662270 | unverified |
| Gasthof Martin | Ebensfeld | `microbrewery` | [gasthof-martin-unterneuses.de](https://www.gasthof-martin-unterneuses.de) | +49 9573 4382 | unverified |
| Gasthof Seelmann | Schönbrunn i.Steigerwald | `microbrewery` | [brauerei-seelmann.de](https://www.brauerei-seelmann.de) `→ brauereiseelmann.wordpress.com` | — | unverified |
| Gasthof zum Fichta | Hummeltal | `microbrewery` | [weiglathal.de](https://www.weiglathal.de/) `muerto` | +49 9246 491 | unverified |
| Gaststätte Griesbräu | Murnau am Staffelsee ⚠ | `microbrewery` | [griesbraeu.de](https://griesbraeu.de/) | +49 8841 1422 | unverified |
| Gemeinschaftsbrauerei Roßfeld | Bad Rodach | `microbrewery` | — | +49 9564 809130 | unverified |
| Gick Bräu | Burgkunstadt | `microbrewery` | — | +49 9572 2004 | unverified |
| Glockenstüberl | Ohlstadt ⚠ | `microbrewery` | — | — | unverified |
| Graminger Weissbräu | Altötting | `microbrewery` | [graminger-weissbraeu.de](https://www.graminger-weissbraeu.de/) | +49 8671 96140 | unverified |
| Grüner Baum | Cadolzburg | `microbrewery` | [gruenerbaum-cadolzburg.de](https://www.gruenerbaum-cadolzburg.de/) | +49 9103 7121842 | unverified |
| Haderner Kleines Brauhaus - Bio-Restaurant und Biergarten | München | `microbrewery` | [haderner.de](https://www.haderner.de/) | — | unverified |
| Hasenbräuhaus Kälberhalle | Augsburg | `microbrewery` | [kaelberhalle.de](https://www.kaelberhalle.de) | +49 821 65070770 | unverified |
| Hausbräu Stegaurach | Stegaurach | `microbrewery` | [hausbraeu-stegaurach.de](http://www.hausbraeu-stegaurach.de) `403` | — | unverified |
| Hausbrauerei Altstadthof | Nürnberg | `microbrewery` | [hausbrauerei-altstadthof.de](https://www.hausbrauerei-altstadthof.de/) | +49 911 2449859 | unverified |
| Heckel Bräu | Waischenfeld | `microbrewery` | — | +49 9202 493 | unverified |
| Hexenhäusle | Michelau i.Steigerwald | `microbrewery` | — | — | unverified |
| Higgins Tap Room | München | `microbrewery` | [higginsaleworks.com](https://higginsaleworks.com) | — | unverified |
| Hofbräuhaus Traunstein - Bräustüberl | Traunstein | `microbrewery` | [braeustueberl-traunstein.de](https://www.braeustueberl-traunstein.de/) | +49 861 4379 | unverified |
| Hohe-Wart-Haus | Mespelbrunn ⚠ | `microbrewery` | [hohewart-haus.de](https://www.hohewart-haus.de/) | +49 6021 33980 | unverified |
| HOLZHAUSER Brauereigasthaus | Igling | `microbrewery` | [brauereigasthaus-holzhausen.de](http://brauereigasthaus-holzhausen.de) `→ holzhauser-brauerei-gasthaus.de` | +49 8241 4758 | unverified |
| Homburger Bräuscheuere | Triefenstein | `microbrewery` | [braeuscheuere.de](http://www.braeuscheuere.de) | +49 9395 876882 | unverified |
| Hotel und Brauereigasthof Jakob | Nittenau | `microbrewery` | [brauereigasthof-jakob.de](http://www.brauereigasthof-jakob.de) | +49 9436 8224 | unverified |
| Hotel und Bräustüble zur Post | Weiler-Simmerberg | `microbrewery` | [postinweiler.de](https://www.postinweiler.de/) | +49 8387 1070 | unverified |
| Hotel zur Post | Bad Kötzting | `microbrewery` | [posthotel-bad-koetzting.de](https://www.posthotel-bad-koetzting.de) | +49 9941 6628 | unverified |
| Isartaler Brauhaus | Pullach im Isartal | `microbrewery` | [isartaler-brauhaus.de](https://www.isartaler-brauhaus.de/) | +49 89 798961 | unverified |
| Joesepp's Brauhaus | Memmingen | `microbrewery` | [joesepps-brauhaus.de](https://www.joesepps-brauhaus.de/) | +49 8331 9278103 | unverified |
| Jura-Bräu | Pegnitz | `microbrewery` | [jura-braeu.de](http://www.jura-braeu.de) | +49 9241 2019 | unverified |
| Kaiserhof-Brauerei | Kronach | `microbrewery` | [kaiserhofbraeu.de](http://www.kaiserhofbraeu.de/) | +49 9261 628000 | unverified |
| Kannerschreither Brauhaisla | Konradsreuth | `microbrewery` | — | +49 9292 6602 | unverified |
| Kapplerbräu | Altomünster | `microbrewery` | [kapplerbraeu.de/gasthof](https://kapplerbraeu.de/gasthof/) | +49 8254 777 | unverified |
| Karg Bräustüberl | Murnau am Staffelsee ⚠ | `microbrewery` | [karg-murnau.de](https://karg-murnau.de/) `muerto` | +49 8841 8272 | unverified |
| Kathi-Bräu | Aufseß | `microbrewery` | — | +49 9198 277 | unverified |
| Kellerberg Voggendorf | Voggendorf | `microbrewery` | [brauerei-prechtel.de/biergarten](https://www.brauerei-prechtel.de/biergarten/) | — | unverified |
| Kloster Kreuzberg | Bischofsheim i.d.Rhön | `microbrewery` | [kloster-kreuzberg.de](https://kloster-kreuzberg.de) | +49 9772 91240; +49 9772 912443 | unverified |
| Klosterbräu | Bamberg | `microbrewery` | [klosterbraeu.de](http://www.klosterbraeu.de) | +49 951 52265 | unverified |
| Klosterbräuhaus Ursberg | Ursberg | `microbrewery` | [klosterbraeuhaus.de](https://klosterbraeuhaus.de/) | — | unverified |
| Klosterschänke | Großheubach | `microbrewery` | [kloster-engelberg.com](https://kloster-engelberg.com) | +49 9371 9143914 | unverified |
| Klosterschenke Weltenburg | Kelheim | `microbrewery` | [klosterschenke-weltenburg.de](https://www.klosterschenke-weltenburg.de/) | +49 9441 6757 0 | unverified |
| Kneitinger | Regensburg | `microbrewery` | [knei.de](https://www.knei.de/) `→ reichinger.info` | +49 941 52455 | unverified |
| Kramer Wolf Zoigl | Falkenberg | `microbrewery` | [zoigl-kramer-wolf.de](https://www.zoigl-kramer-wolf.de/) | — | unverified |
| Krapp Drei Linden | Erlangen | `microbrewery` | [schnitzelkrapp.de](https://www.schnitzelkrapp.de) `muerto` | +49 9131 43885 | unverified |
| Krautheimer Biergarten | Frankenwinheim ⚠ | `microbrewery` | — | — | unverified |
| Kronprinz | Bamberg ⚠ | `microbrewery` | [kronprinz.beer](http://www.kronprinz.beer) | +49 951 96430514 | unverified |
| Landgasthof Fiedler | Dietersheim ⚠ | `microbrewery` | [landgasthof-fiedler.de](https://landgasthof-fiedler.de/) | +49 9161 2425 | unverified |
| Landgasthof Hirsch | Neu-Ulm | `microbrewery` | [hirsch-nu.de](https://www.hirsch-nu.de/) | +49 731 970744 | unverified |
| Landgasthof Hubertus | Ruderatshofen ⚠ | `microbrewery` | [hubertus-apfeltrang.de](https://www.hubertus-apfeltrang.de/) | +49 8341 81976 | unverified |
| Landgasthof Roter Ochse | Seßlach ⚠ | `microbrewery` | [roter-ochse-sesslach.de](https://www.roter-ochse-sesslach.de/) | +49 9569 1220 | unverified |
| Landhausbräu Koller | Adelzhausen ⚠ | `microbrewery` | [landhausbraeu-koller.de](https://landhausbraeu-koller.de/) | +49 8208 225 | unverified |
| Laufener Braukuchl | Laufen | `microbrewery` | [braukuchl.de](http://www.braukuchl.de) | +49 1788 198232 | unverified |
| Lindner-Bräu Brauereigaststätte | Bad Kötzting | `microbrewery` | [lindner-braeu.de](https://lindner-braeu.de/) | +49 9941 1429 | unverified |
| Lingl Zoigl | Windischeschenbach ⚠ | `microbrewery` | [lingl-zoigl.de](https://lingl-zoigl.de/) | — | unverified |
| Mahrs Bräu | Bamberg | `microbrewery` | [mahrs.de](https://www.mahrs.de/) | +49 951 915170 | unverified |
| Maria Hilfer Sudhaus | Eisenberg | `microbrewery` | [koessel-braeu.de](https://www.koessel-braeu.de) | +4983648556 | unverified |
| Marshels Landgasthof | Creußen | `microbrewery` | [marshelslandgasthof.de](https://www.marshelslandgasthof.de/) | +49 9246 9888373 | unverified |
| Maxbrauerei | Schongau ⚠ | `microbrewery` | — | — | unverified |
| Maximilian | Oberammergau ⚠ | `microbrewery` | [maximilian-oberammergau.de](https://www.maximilian-oberammergau.de/) | +49 8822 94874 0 | unverified |
| Mönchshof Bräuhaus | Kulmbach ⚠ | `microbrewery` | — | — | unverified |
| orca.bar | Nürnberg | `microbrewery` | [orcabrau.de/orcabar](https://orcabrau.de/orcabar) | +49 176 6287 3625 | unverified |
| Paulaner Bräuhaus | München | `microbrewery` | [paulaner-brauhaus.de](https://www.paulaner-brauhaus.de/) | +49 89 544611-0 | unverified |
| Paulaner Garten | München ⚠ | `microbrewery` | [paulaner-nockherberg.com](https://paulaner-nockherberg.com/) | +49 89 4599130 | unverified |
| Privatbrauerei Barnikel | Frensdorf | `microbrewery` | [brauerei-barnikel.de](http://www.brauerei-barnikel.de/) | +49 9502 293 | unverified |
| Prössl-Bräu Adlersberg | Pettendorf | `microbrewery` | [proesslbraeu.de](https://www.proesslbraeu.de/) | +49 9404 1822 | unverified |
| Regensburger Weissbräuhaus | Regensburg | `microbrewery` | [regensburger-weissbrauhaus.de/index.php/de](https://www.regensburger-weissbrauhaus.de/index.php/de/) `muerto` | +49 941 5997703 | unverified |
| Reichert | Bad Staffelstein | `microbrewery` | — | +49 9573 6304 | unverified |
| Reimanns | Ingolstadt | `microbrewery` | [reimanns.in](http://reimanns.in/) | — | unverified |
| Reiter Bräu | Wartenberg | `microbrewery` | [hotel-reiter-braeu.de](https://www.hotel-reiter-braeu.de/) | +49 8762 73580 | unverified |
| Rhön-Piraten Biergarten | Ostheim vor der Rhön | `microbrewery` | [rhoenpiraten.de/bier/der-biergarten](https://www.rhoenpiraten.de/bier/der-biergarten/) | +49 9777 358 2344 | unverified |
| Riegele Biergarten | Augsburg ⚠ | `microbrewery` | [riegele-wirtshaus.de/biergarten](https://riegele-wirtshaus.de/biergarten) | +49 821 4552550 | unverified |
| Rosenauer Hofbräu Brauerei | Marktgraitz ⚠ | `microbrewery` | [xn--rosenauer-hofbru-9nb.de](https://xn--rosenauer-hofbru-9nb.de/) | +49 9574 5083222 | unverified |
| Rother Bräu | Fladungen ⚠ | `microbrewery` | [rotherbraeu.de](http://www.rotherbraeu.de) | +49 9779 8101-0 | unverified |
| Sappl Bräu Almwiesen | Holzkirchen | `microbrewery` | [sapplbraeu.de](https://sapplbraeu.de/) | — | unverified |
| Schafferhof | Windischeschenbach | `microbrewery` | [schafferhof-zoigl.de](https://www.schafferhof-zoigl.de/) | +49 9681 917160 | unverified |
| Scheubel-Keller | Schlüsselfeld ⚠ | `microbrewery` | [brauerei-scheubel.de](https://www.brauerei-scheubel.de/) | — | unverified |
| Scheuerer Alm | Aschau am Inn | `microbrewery` | [scheuern-aschau.de](http://www.scheuern-aschau.de) `→ expireddomains.com` | — | unverified |
| Schiller Bräu | München ⚠ | `microbrewery` | [schiller-braeu.de](https://www.schiller-braeu.de/) | +49 89 890584822 | unverified |
| Schloderer Bräu | Amberg | `microbrewery` | [schlodererbraeu.de](https://schlodererbraeu.de/) | +49 9621 420707 | unverified |
| Schlossbräu Mariakirchen | Arnstorf | `microbrewery` | [schlossbraeu-mariakirchen.de](https://www.schlossbraeu-mariakirchen.de/) | — | unverified |
| Schlossbrauhaus Schwangau | Schwangau | `microbrewery` | [schlossbrauhaus.de](https://schlossbrauhaus.de) | +49 8362 9264680 | unverified |
| Schlossbräukeller | Au i.d. Hallertau | `microbrewery` | [schlossbraeukeller.de](https://www.schlossbraeukeller.de/) | +49 8752 9822 | unverified |
| Schmausenkeller | Frensdorf | `microbrewery` | [schmausenkeller.de](https://www.schmausenkeller.de) | +49 9502 608 | unverified |
| Schmittbräu | Scheßlitz | `microbrewery` | [schmitt-braeu.de](https://schmitt-braeu.de/) | +49 9542 563 | unverified |
| Schmölzer Dorfbrauerei | Küps ⚠ | `microbrewery` | [schmoelzer-dorfbrauerei.jimdofree.com](https://schmoelzer-dorfbrauerei.jimdofree.com/) | — | unverified |
| Schnupp | Neudrossenfeld | `microbrewery` | [gasthof-bayreuth-kulmbach.de](http://gasthof-bayreuth-kulmbach.de/) | — | unverified |
| Schwanen-Bräu | Rattelsdorf | `microbrewery` | [schwanen-braeu-ebing.de](http://www.schwanen-braeu-ebing.de/) `→ p2-1.afp24.net` | +49 9547 481 | unverified |
| Schwanenbräu | Ebermannstadt ⚠ | `microbrewery` | [schwanenbraeu.de](https://www.schwanenbraeu.de) `403` | +49 9194 209 | unverified |
| Schwarzer Adler | Hallstadt | `microbrewery` | [brauerei-eichhorn.de](https://www.brauerei-eichhorn.de/) | +49 951 75660 | unverified |
| Servus Wally | Neuötting | `microbrewery` | [muellerbraeu-braugasthof.de](https://www.muellerbraeu-braugasthof.de/) | +49 86719076060 | unverified |
| Sonnen-Bräu Mürsbach | Rattelsdorf | `microbrewery` | [sonnen-braeu.de](https://sonnen-braeu.de/) | +49 9533 981017 | unverified |
| Sonnenbräu Lichtenberg | Lichtenberg | `microbrewery` | — | +49 9288 304 | unverified |
| Stadlbräu | Oberhaching ⚠ | `microbrewery` | [biervonmir.com](https://biervonmir.com/) | — | unverified |
| Stadthotel Pfarrhof | Kronach | `microbrewery` | [stadthotel-pfarrhof.de](https://www.stadthotel-pfarrhof.de/) | +49 9261 504590 | unverified |
| Steinbach-Bräu | Erlangen | `microbrewery` | [steinbach-braeu.de](https://steinbach-braeu.de/) | +49 9131 895912 | unverified |
| Stern-Bräu | Schlüsselfeld | `microbrewery` | — | — | unverified |
| Sternbräu | Schlüsselfeld | `microbrewery` | — | — | unverified |
| Tasos Taverne | Schweinfurt | `microbrewery` | — | — | unverified |
| Täubla | Naila | `microbrewery` | — | — | unverified |
| Teicher-Zoigl | Windischeschenbach ⚠ | `microbrewery` | [bahler-zoigl.de](https://bahler-zoigl.de/) | — | unverified |
| Vogel's Mühle | Scheßlitz | `microbrewery` | — | +49 9542 1003 | unverified |
| Volksheim-Gaststätte | Straubing | `microbrewery` | — | +49 9421 520930 | unverified |
| Wagner-Bräu Kemmern | Kemmern | `microbrewery` | [brauerei-wagner.de](https://www.brauerei-wagner.de) | +49 9544 6746 | unverified |
| Waldschloss Bräustübl | Frammersbach | `microbrewery` | [waldschloss-braeu.de](http://www.waldschloss-braeu.de/) `muerto` | +49 9355 9734 0 | unverified |
| Wamperling | Neustadt bei Coburg | `microbrewery` | [wamperling.de](http://www.wamperling.de) | — | unverified |
| Weißbierbrauerei Behringer | Vohenstrauß | `microbrewery` | [brauerei-behringer.de](https://www.brauerei-behringer.de/) `→ expireddomains.com` | +49 9651 9244604 | unverified |
| Wilde Rose | Bamberg | `microbrewery` | [hotel-wilde-rose.de](http://www.hotel-wilde-rose.de) | +49 951 981820 | unverified |
| Wirtshaus Klosterbrauerei Weißenohe | Weißenohe | `microbrewery` | — | +49 176 10301489 | unverified |
| Wirtshaus zum Schweinsbräu | Glonn | `microbrewery` | [herrmannsdorfer.de/das-wirtshaus](https://www.herrmannsdorfer.de/das-wirtshaus/) `404` | +49 8093 909445 | unverified |
| Wochinger Brauhaus | Traunstein | `microbrewery` | — | +49 861 3045 | unverified |
| Wolframstubn | Windischeschenbach ⚠ | `microbrewery` | [wolframstubn.de](http://www.wolframstubn.de/) `→ zoiglbrauerei.de` | — | unverified |
| Zoigl-Voit | Pleystein | `microbrewery` | [zoigl-voit.de](http://www.zoigl-voit.de/) `muerto` | +49 9654 1255 | unverified |
| Zum Gründla | Kulmbach ⚠ | `microbrewery` | [zum-gruendla.de](https://www.zum-gruendla.de/) | +49 9221 823884 | unverified |
| Zum Roud’n | Windischeschenbach | `microbrewery` | [zoiglbier.de/die-brauer/windischeschenbach/zum-roudn](https://zoiglbier.de/die-brauer/windischeschenbach/zum-roudn/) | +49 9681 2185 | unverified |

## Residual Wikidata que OSM no trae — 107

Cervecerías con ítem propio en Wikidata y sin fecha de disolución que el barrido OSM no tocó. Aquí se concentran las Privatbrauereien regionales grandes y también las cerradas que Wikidata no marcó: **comprueba actividad antes que nada**.

| nombre | municipio | web | estado |
|---|---|---|---|
| Alte Brauerei Stegen | Inning am Ammersee | — | unverified |
| Bierbrauerei Adolf-Kolping-Straße 3 in Ingolstadt (D-1-61-000-616#1) | Ingolstadt | — | unverified |
| Bierbrauerei Adolf-Kolping-Straße 5 in Ingolstadt (D-5-6626-0058#2) | Ingolstadt | — | unverified |
| Brauerei | Heilsbronn | — | unverified |
| Brauerei | Oberdachstetten | — | unverified |
| Brauerei | Würzburg | — | unverified |
| Brauerei | Würzburg | — | unverified |
| Brauerei Alte Bergstraße 488 in Landsberg am Lech (D-1-81-130-47#1) | Landsberg am Lech | — | unverified |
| Brauerei Am Hofbräuhaus 1 in Coburg (D-4-63-000-371#1) | Coburg | — | unverified |
| Brauerei Am Marktplatz 7 in Schwanstetten (D-5-76-132-27#1) | Schwanstetten | — | unverified |
| Brauerei An der Ebrach 6 in Hirschaid (D-4-71-145-19#5) | Strullendorf | — | unverified |
| Brauerei Bachgasse 15 in Weißenburg in Bayern (D-5-77-177-100#1) | Weißenburg in Bayern | — | unverified |
| Brauerei Bahnhofstraße 11 in Pfeffenhausen (D-2-74-172-4#1) | Pfeffenhausen | — | unverified |
| Brauerei Bahnhofstraße 11 in Pfeffenhausen (D-2-74-172-4#2) | Pfeffenhausen | — | unverified |
| Brauerei Bundesstraße 13 in Parsberg (D-3-73-151-48#1) | Lupburg | — | unverified |
| Brauerei Dorfplatz 2 in Ebern (D-6-74-130-152#1) | Kirchlauter | — | unverified |
| Brauerei Fischerstraße 19 in Kempten (Allgäu) (D-7-63-000-52#1) | Kempten | — | unverified |
| Brauerei Geslauer Straße 3 in Windelsbach (D-5-71-225-1#2) | Windelsbach | — | unverified |
| Brauerei Hauptstraße 2 in Polsingen (D-5-77-162-14#1) | Wolferstadt | — | unverified |
| Brauerei Hauptstraße 27 in Markt Erlbach (D-5-75-145-11#1) | Markt Erlbach | — | unverified |
| Brauerei Hauptstraße 34 in Niederviehbach (D-2-79-130-56#1) | Niederviehbach | — | unverified |
| Brauerei Herzog-Wilhelm-Straße 28 in Steindorf (Schwaben) (D-7-71-168-10#2) | Steindorf | — | unverified |
| Brauerei Herzogenauracher Straße 3 in Fürth (D-5-63-000-1653#2) | Obermichelbach | — | unverified |
| Brauerei Heubsch 43; Papiermühle in Kasendorf (D-4-77-124-39#1) | Kasendorf | — | unverified |
| Brauerei Hof a.Regen 56 in Nittenau (D-3-76-149-67#10) | Nittenau | — | unverified |
| Brauerei Kartäuserstraße 14 a in Ochsenfurt (D-6-79-170-370#1) | Ochsenfurt | — | unverified |
| Brauerei Kartäuserstraße 14 b in Ochsenfurt (D-6-79-170-370#2) | Ochsenfurt | — | unverified |
| Brauerei Kelsstraße 38 in Neustadt an der Donau (D-2-73-152-44#1) | Neustadt an der Donau | — | unverified |
| Brauerei Kirchplatz 3 in Schmiechen (D-7-71-163-3#1) | Schmiechen | — | unverified |
| Brauerei Klosterstraße 8 in Forchheim (D-4-74-126-167#1) | Forchheim | — | unverified |
| Brauerei Lamer Straße 8 in Hohenwarth (Landkreis Cham) (D-3-72-135-12#1) | Hohenwarth | — | unverified |
| Brauerei Marienweiher 30 in Marktleugast (D-4-77-138-29#1) | Marktleugast | — | unverified |
| Brauerei Marktplatz 10 in Georgensgmünd (D-5-76-121-18#1) | Georgensgmünd | — | unverified |
| Brauerei Marktplatz 4 in Pfeffenhausen (D-2-74-172-20#1) | Pfeffenhausen | — | unverified |
| Brauerei Marktplatz 5 in Ortenburg (D-2-75-138-24#1) | Ortenburg | — | unverified |
| Brauerei Marktplatz 5; Nähe Am Hofgarten in Winklarn (Oberpfalz) (D-3-76-178-11#1) | Winklarn | — | unverified |
| Brauerei Marktplatz 7 in Eckental (D-5-72-121-16#1) | Eckental | — | unverified |
| Brauerei Münchener Straße 1; Münchener Straße 3 in Moosburg an der Isar (D-1-78-143-65#1) | Moosburg an der Isar | — | unverified |
| Brauerei Nähe Herzogenauracher Straße in Fürth (D-5-63-000-1653#4) | Obermichelbach | — | unverified |
| Brauerei Nähe Obere Dorfstraße in Guttenberg (Oberfranken) (D-4-77-118-11#1) | Guttenberg | — | unverified |
| Brauerei Oberkonnersreuther Straße 6 a; Oberkonnersreuther Straße 6 b; Oberkonnersreuther Straße 6 c; Oberkonnersreuther Straße 6 d; Oberkonnersreuther Straße 6 e in Bayreuth (D-4-62-000-430#2) | Bayreuth | — | unverified |
| Brauerei Regensburger Straße 26 in Straubing (D-2-63-000-161#3) | Straubing | — | unverified |
| Brauerei Römerstraße 2 in Weihmichl (D-2-74-187-13#1) | Furth | — | unverified |
| Brauerei Rottenburger Straße 27 in Wildenberg (D-2-73-181-4#1) | Wildenberg | — | unverified |
| Brauerei Scheidmantel | Dörfles-Esbach | — | unverified |
| Brauerei Schlappeseppel | Aschaffenburg | — | unverified |
| Brauerei Schloß 1 in Pommersfelden (D-4-71-172-31#7) | Pommersfelden | — | unverified |
| Brauerei Schloßberg 3 in Guteneck (D-3-76-133-1#2) | Guteneck | — | unverified |
| Brauerei Schloßplatz 3 in Maxhütte-Haidhof (D-3-76-141-17#4) | Maxhütte-Haidhof | — | unverified |
| Brauerei Schulstraße 2 in Gotteszell (D-2-76-123-7#2) | Gotteszell | — | unverified |
| Brauerei Spitalgasse 2 in Regensburg (D-3-62-000-1025#2) | Regensburg | — | unverified |
| Brauerei Stadtplatz 8a in Neumarkt-Sankt Veit (D-1-83-129-67#1) | Neumarkt-Sankt Veit | — | unverified |
| Brauerei Vogteiplatz 8 in Herrieden (D-5-71-166-57#4) | Herrieden | — | unverified |
| Brauerei zur Stadt Hamburg | Kempten | — | unverified |
| Brauereigasthof | Betzenstein | — | unverified |
| Brauereigasthof Eschenfelden | Königstein | — | unverified |
| Brauereikeller Albrechtsgasse 34 in Straubing (D-2-63-000-10#1) | Straubing | — | unverified |
| Brauereikeller Brand in Markt Berolzheim (D-5-77-149-30#1) | Markt Berolzheim | — | unverified |
| Brauereikeller Buchleite in Markt Berolzheim (D-5-77-149-30#2) | Markt Berolzheim | — | unverified |
| Brauereikeller In Katzenrohrbach in Walderbach (D-3-72-170-23#1) | Walderbach | — | unverified |
| Brauereikeller In Nemmersdorf in Goldkronach (D-4-72-143-45#3) | Goldkronach | — | unverified |
| Brauereikeller Lichtenfelser Weg 26 in Lichtenfels (Oberfranken) (D-4-78-139-333#1) | Lichtenfels | — | unverified |
| Brauereikeller Nähe Rittersbacher Straße in Georgensgmünd (D-5-76-121-18#2) | Georgensgmünd | — | unverified |
| Brauereikeller Seiding 56 in Weyarn (D-1-82-137-115#1) | Weyarn | — | unverified |
| Ehem. Brauereigebäude in Ottensoos | Ottensoos | — | unverified |
| Ehemalige Brauerei Bullheller | Aidhausen | — | unverified |
| Ehemalige Brauerei Gassner | Kitzingen | — | unverified |
| Ehemaliger Brauereigasthof | Untermerzbach | — | unverified |
| Ehemaliger Brauereigasthof | Oberdachstetten | — | unverified |
| Ehemaliger Brauereihof | Kitzingen | — | unverified |
| Ehemaliges Bräu- und Gasthaus | Pappenheim | — | unverified |
| Ehemaliges Brauereinebengebäude | Pullach im Isartal | — | unverified |
| Kitzmann-Bräu | Erlangen | [kitzmann.de](http://www.kitzmann.de/) | unverified |
| Klosterbrauerei Freiherr-von-Aretin-Platz 1 in Aldersbach (D-2-75-114-1#4) | Aldersbach | — | unverified |
| Klosterbrauerei Fürstenfeld 6; Fürstenfeld 6 a; Fürstenfeld 6 b in Fürstenfeldbruck (D-1-79-121-46#2) | Fürstenfeldbruck | — | unverified |
| Klosterbrauerei Hauptstraße 46; Hauptstraße 48 in Rotthalmünster (D-2-75-143-54#7) | Bayerbach | — | unverified |
| Klosterbrauerei Klosterhof 9 in Speinshart (D-3-74-157-6#1) | Speinshart | — | unverified |
| Klosterbrauerei Klosterplatz 1 in Berching (D-3-73-112-152#5) | Beilngries | — | unverified |
| Klosterbrauerei Klosterplatz 1 in Berching (D-3-73-112-152#6) | Beilngries | — | unverified |
| Klosterbrauerei Landshuter Straße 31 in Freising (D-1-78-124-117#4) | Freising | — | unverified |
| Klosterbrauerei Nähe Hauptstraße in Medlingen (D-7-73-153-2#4) | Medlingen | — | unverified |
| Klosterbrauerei Oberschönenfeld 1 in Gessertshausen (D-7-72-148-13#2) | Gessertshausen | — | unverified |
| Klosterbrauerei Reutberg | Sachsenkam | [klosterbrauerei-reutberg.de](http://www.klosterbrauerei-reutberg.de) | unverified |
| Klosterbrauerei Weilheimer Straße 1 in Polling (bei Weilheim) (D-1-90-142-11#16) | Polling | — | unverified |
| Kommunbrauhaus (Unfinden) | Königsberg in Bayern | — | unverified |
| Kunsthandwerkerhof, ehemalige Brauerei, dreiteiliger Bau | Königsberg in Bayern | — | unverified |
| Lammbrauerei (Burgau) | Haldenwang | — | unverified |
| Peschl Brauerei | Passau | — | unverified |
| Schloss Haus (Neueglofsheim) | Thalmassing | — | unverified |
| Schloss Sattelpeilnstein | Traitsching | — | unverified |
| Schloss Söldenau | Ortenburg | — | unverified |
| Schloss Stein an der Traun | Altenmarkt an der Alz | — | unverified |
| Schloss Wörth an der Isar | Wörth an der Isar | — | unverified |
| Schlossbrauerei Am Schloß 3 in Sünching (D-3-75-201-4#5) | Sünching | — | unverified |
| Schlossbrauerei Am Stadtberg 21; Am Stadtberg 21b in Dillingen an der Donau (D-7-73-125-236#3) | Dillingen an der Donau | — | unverified |
| Schlossbrauerei Arcostraße 2 in Postau (D-2-74-174-7#4) | Postau | — | unverified |
| Schlossbrauerei Hofmark 6; Landshuter Straße 9 in Neufraunhofen (D-2-74-154-2#13) | Neufraunhofen | — | unverified |
| Schlossbrauerei Kirchberg 1 in Jetzendorf (D-1-86-132-4#2) | Jetzendorf | — | unverified |
| Schlossbrauerei Nürnberger Straße 13 in Nittendorf (D-3-75-175-8#1) | Nittendorf | — | unverified |
| Schlossbrauerei Schloßhof 2 in Traunreut (D-1-89-154-82#1) | Altenmarkt an der Alz | — | unverified |
| Schlossbrauerei Schloßhof 7 in Traunreut (D-1-89-154-82#2) | Altenmarkt an der Alz | — | unverified |
| Schlossbrauerei Weyhern 7; Weyhern 8 in Egenhofen (D-1-79-117-16#3) | Pfaffenhofen an der Glonn | — | unverified |
| St. Erhard | Bamberg | [st-erhard.com](http://www.st-erhard.com/) `410` | unverified |
| Waldwirtschaft Großhesselohe | Pullach im Isartal | [waldwirtschaft.de](http://www.waldwirtschaft.de/) | unverified |
| Zum Goldenen Adler | Weißenburg in Bayern | — | unverified |
| Zum Grünen Baum | Kempten | — | unverified |
| Zum Schwarzen Adler | Kempten | — | unverified |

## Qué queda

Todo. Empieza por `craft=brewery` con web `ok` y municipio sin ⚠, que se verifican de una pasada; deja para el final el tier `microbrewery` y los ⚠, que son municipio puesto por centroide y no por la fuente.
