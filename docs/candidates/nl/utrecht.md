# Candidatos — Utrecht

Revisión individual del 2026-08-09. La nota anunciaba 20 operadores, pero contenía 19 filas reales. Resultado: 5 productores confirmados y publicados, 2 descartados por vender semillas o material vegetal en vez de alimentos y 12 siguen abiertos. Las decisiones cerradas constan en `data/evidence/nl/west-nederland/utrecht.jsonl`.

## Pendientes de evidencia suficiente

| Nombre declarado | Dirección certificada | Motivo para mantenerlo abierto | Certificado |
|---|---|---|---|
| A.C. van der Velden | Rumelaarseweg 31, Woudenberg | El único perfil empresarial localizado figura cerrado y no se pudo confirmar una identidad alimentaria ni una oferta propia vigente. | [NL-BIO-01.528-0003803.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0003803.2026.001.pdf) |
| A.H. de Wit / De Wit | Achterdijk 29, Bunnik | El certificado prueba producción ganadera, pero no aparece una identidad pública con alimento concreto y canal de mercado. | [NL-BIO-01.528-0007534.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0007534.2026.001.pdf) |
| Baron van Nagelhoeve VOF | Laag-Nieuwkoop 30, Kockengen | Se confirma una explotación lechera ecológica activa, pero no una oferta alimentaria propia y pública actual. | [NL-BIO-01.528-0004258.2026.011](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0004258.2026.011.pdf) |
| Belle Boomgaard / Fruitbedrijf Van Dijk | Broekweg 6, Wijk bij Duurstede | La fruticultura ecológica está activa, pero la última venta de productos propios localizada es de 2020; falta un canal público vigente. | [NL-BIO-01.528-0007425.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0007425.2026.001.pdf) |
| BijenAkker | Rijnseweg 5A, Odijk | La oferta pública actual se concentra en flores; existen referencias alimentarias a la cebolla de San Juan, pero no una venta vigente inequívoca atribuible al operador certificado. | [NL-BIO-01.528-0002771.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002771.2026.001.pdf) |
| Biologische fruitteelt Merkens-Williams v.o.f. | Molenspoor 3A, Werkhoven | Se confirma la producción ecológica de manzana y pera, sin marca pública ni oferta directa o comercial concreta verificable. | [NL-BIO-01.528-0004435.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0004435.2026.001.pdf) |
| Biologische Melkveehouderij Boele | Rijksstraatweg 205, Loenersloot | La empresa lechera está inscrita y activa, pero no se encontró leche, carne o derivados propios ofrecidos públicamente. | [NL-BIO-01.528-0002783.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002783.2025.001.pdf) |
| Biovarkens de Bruin | Achtersloot 142, IJsselstein | La entidad es muy reciente y consta como explotación porcina ecológica, sin producto final ni canal de mercado público todavía. | [NL-BIO-01.528-0001435.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0001435.2026.001.pdf) |
| Boerderij blikopdepolder | Van Teylingenweg 132, Kamerik | La web confirma una granja caprina ecológica, pero solo publicita alojamiento y no una venta propia de leche, queso o carne. | [NL-BIO-01.528-0003560.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0003560.2026.001.pdf) |
| Boerderij de Bossewaard | Ossenwaard 9, Cothen | La identidad pública vigente corresponde a granja asistencial y camping; no se localizó una oferta alimentaria propia atribuible al certificado. | [NL-BIO-01.528-0005124.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005124.2026.001.pdf) |
| C.J. Nell | Langbroekerdijk B 14, Langbroek | Los registros actuales confirman vacuno lechero y gallinas, pero no una marca, alimento propio concreto ni canal de venta. | [NL-BIO-01.528-0002792.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002792.2025.001.pdf) |
| D.J. de Bie | Langbroekerdijk A 133A, Langbroek | Solo se pudo sostener la explotación ganadera del certificado; falta identidad pública, producto y salida al mercado. | [NL-BIO-01.528-0006124.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0006124.2025.001.pdf) |

## Cheese and farm-dairy sweep (2026-08-12)

Target: `data/csv/nl/west-nederland/utrecht.csv`, category `Lácteos y quesos`.
Country-wide pass over four sources, read 2026-08-12, deduplicated against the
published NL catalog by name, domain and street number. Nothing here is
verified: each row still needs identity, own production, the productive
gemeente, current activity and a public own offer.

- [Bond van Boerderij-Zuivelbereiders](https://boerderijzuivel.nl/verkooppunten/) —
  318 sales points of the farm-dairy makers' association. Supports membership,
  address and contact; it does not say which dairy products the member makes,
  that the point is the productive unit, or that it is currently active.
- OpenStreetMap via Overpass — `craft`, `shop=cheese|farm|dairy`, cheese
  `produce`/`product` or a cheese-maker name. Supports a POI, nothing about the
  business. Streets matching on name and plain urban cheese shops were dropped.
- [broodsmakelijk.nl](https://broodsmakelijk.nl/adres/kopenbijdeboer/kaasboerderij/nl) —
  `kaasboerderij` and `zuivelboerderij` overviews per province plus detail pages.
  A hobby directory: its status and product icons are claims, not proof.
- [zoekdeboer.nl](https://zoekdeboer.nl/kaas/) — the `kaas` category, 125 entries.
  It mixes makers with shops that resell cheese, so each entry was triaged
  against its own prose; resellers were dropped rather than carried here.

Gemeente comes from the PDOK locatieserver, woonplaats in italics when it
differs. Where a row says the match was fuzzy, confirm street, number and any
house letter before trusting it.

| Candidate | Gemeente | Address | Contact | Source | Signal and open questions |
|---|---|---|---|---|---|
| Landwinkel & Schenkerij De Kastanjeboom | Bunschoten *(Bunschoten-Spakenburg)* | Zevenhuizerstraat 281, 3751 LC Bunschoten-Spakenburg | [dekastanjeboom.nl](http://www.dekastanjeboom.nl)<br>`033-4564457`<br>`Info@dekastanjeboom.nl` | BvBZ | — |
| Biltseboer | De Bilt | Utrechtseweg 91, De Bilt | [biltseboer.nl](https://www.biltseboer.nl/)<br>`info@biltseboer.nl` | BvBZ | — |
| Boerderij ‘De Bonte Parels’ | De Bilt *(Westbroek)* | Korssesteeg 3, 3615 AS Westbroek | `+316 25192899`<br>`debonteparels@hotmail.com` | zoekdeboer | Organic dairy farm with own kwark and farm shop; cheese range to confirm |
| Biologische melkveehouderij hartstocht | De Ronde Venen *(Abcoude)* | Gein Zuid 26, 1391JE Abcoude | `+31294281366` | broodsmakelijk | De melktap is 24/7 open; biologische ongepasteuriseerde melk. [icons: boerenkaas, milk, meat] |
| Melktap De Hoef | De Ronde Venen *(de Hoef)* | Oostzijde 115, 1426 AJ de Hoef | [melktapdehoef.nl](http://www.melktapdehoef.nl)<br>`06-20573537`<br>`info@melktapdehoef.nl` | BvBZ | street matched on postcode only |
| Landwinkel de Noordzijde | Lopik *(Polsbroek)* | Noordzijdseweg 189, 3415 RC Polsbroek | [landwinkeldenoordzijde.nl](https://landwinkeldenoordzijde.nl/)<br>`0182-309302`<br>`hm@landwinkeldenoordzijde.nl` | BvBZ | — |
| Kaasboerderij de Vendrigjes | Montfoort | Achthoven west 41, 3417 BW Montfoort | `0348-471867`<br>`kaasboerderijdevendrigjes@outlook.com` | BvBZ | — |
| Kaasboerderij van Eck | Montfoort | Willeskop 39, 3417 MB Montfoort | [kaasboerderijvaneijk.nl](https://www.kaasboerderijvaneijk.nl/)<br>`06-51681245`<br>`info@kaasboerderijvaneijk.nl` | BvBZ | — |
| Maatschap H.D. & G. Lekkerkerker | Montfoort | Willeskop 77a, Montfoort | — | BvBZ | — |
| Biologische kaasboerderij Ruyge Weyde | Oudewater | Ruige Weide 43, 3421TH Oudewater | [ruygeweydekaas.nl](https://www.ruygeweydekaas.nl)<br>`+31648184872` | broodsmakelijk + zoekdeboer | Biologische kaasboerderij de Ruyge Weyde is een familiebedrijf in Oudewater, waar sinds 1847 echte Goudse boerenkaas wordt gemaakt. Het betreft een biologische kaasboerderij waar rauwmelkse boerenkaas, gecombineerd word met… — also listed as *Kaasboerderij de Ruyge Weyde* |
| Kaasboerderij Spruithoeve | Oudewater | Willeskop 123, 3421 GV Oudewater | [kaasvanspruithoeve.nl](http://www.kaasvanspruithoeve.nl)<br>`06-28825766`<br>`Spruithoeve@live.nl` | BvBZ | — |
| Maatschap Cromwijk Kuik | Oudewater *(Papekop)* | Papekopperdijk 17, 3464 HT Papekop | `0348-563460`<br>`c.j.cromwijk@hetnet.nl` | BvBZ + OSM | — |
| Sik en Blaar | Oudewater *(Papekop)* | Diemerbroek 44a, Papekop | [sikenblaar.nl](https://www.sikenblaar.nl/)<br>`0348-560001`<br>`goat.farm@12move.nl` | BvBZ | — |
| Zuivelboerderij Rofmeddow | Oudewater | Ruige Weide 37, 3421 TH Oudewater | [rofmeddow.nl](https://www.rofmeddow.nl/)<br>`06-14668275`<br>`rofmeddow@hotmail.com` | BvBZ + OSM | — |
| Aerderoort boerenzuivel | Renswoude | Barneveldsestraat 37, 3927 CB Renswoude | [aerderoort-boerenzuivel.nl](http://www.aerderoort-boerenzuivel.nl)<br>`06-13205365`<br>`artwolleswinkel@hotmail.com` | BvBZ | — |
| Boerderij Welgelegen / Hollandsche Meesters | Rhenen | Cuneraweg 38, 3911 RN Rhenen | [hollandsche-meesters.eu](http://www.hollandsche-meesters.eu)<br>`06-20179292`<br>`b.vanlaar@live.nl` | BvBZ | — |
| De Willigen VOF | Stichtse Vecht *(Vreeland)* | Nigtevechtseweg 186-188, 3633 XX Vreeland | [dewilligenlogies.nl](http://www.dewilligenlogies.nl)<br>`06-51798045`<br>`info@dewilligenlogies.nl` | BvBZ + zoekdeboer | street matched on postcode only; also listed as *De Willigen: Kaas-, ijs, en logiesboerderij* |
| Kaasboerderij Sterreschans | Stichtse Vecht *(Nieuwer Ter Aa)* | Oukoop 32, 3626AX Nieuwer Ter Aa | [kaasboerderijsterreschans.nl](https://www.kaasboerderijsterreschans.nl/) | OSM | OSM tags `shop=cheese` |
| Mathilde’s Kaas | Stichtse Vecht *(Kockengen)* | Laag-nieuwkoop 30, Kockengen | [mathildeskaas.nl](https://mathildeskaas.nl/)<br>`06–25386421`<br>`info@mathildeskaas.nl` | BvBZ | — |
| Boer Peter | Utrecht *(Haarzuilens)* | Thematerweg 6, 3455SN Haarzuilens | [boerpeter.com](https://www.boerpeter.com/)<br>`+31 6 41539804`<br>`info@boerpeter.com` | OSM | OSM tags `shop=farm`, produce: cheese, eggs, meat |
| Boerderij Waaiseweelde | Utrecht *(De Meern)* | Meerndijk 61, 3454HP De Meern | [waaiseweelde.nl](https://waaiseweelde.nl)<br>`+31618452929`<br>`marijeklever@hotmail.com` | broodsmakelijk | Tegenover de boerderij, aan de andere kant van de weg, staat een een melktapautomaat en een eierenautomaat. [icons: organic, vending, milk, eggs] |
| Boerderijwinkel Geertje’s Hoeve | Utrecht *(Haarzuilens)* | Thematerweg 5, 3455SM Haarzuilens | [geertjeshoeve.nl](https://geertjeshoeve.nl)<br>`+31306775053`<br>`anne@geertjeshoeve.nl` | broodsmakelijk | Listed as kaasboerderij in the province overview; product icons: organic, boerenkaas, potatoes, eggs, meat |
| Biodynamische zorgboerderij De Hondspol | Utrechtse Heuvelrug *(Driebergen-Rijsenburg)* | Gooyer Wetering 22-24, 3972MB Driebergen-Rijsenburg | `+31618683716`<br>`info@dehondspol.nl` | broodsmakelijk | De Hondspol is een biodynamische zorgboerderij aan de rand van Driebergen-Rijsenburg. De boeren, tuinder en cliënten (die meewerkers worden genoemd) vormen een hecht team. Met elkaar verzorgen we de bodem, gewassen, dieren en… — street matched on postcode only |
| Kaasboerderij De Grote Katwinkel | Utrechtse Heuvelrug *(Leersum)* | Buurtweg 38, 3956ND Leersum | `+31343416272`<br>`e_hog51@zonnet.nl` | broodsmakelijk | Listed as kaasboerderij in the province overview; product icons: boerenkaas |
| Biologische boerderij De Groene Geer | Vijfheerenlanden *(Nieuwland)* | Geer 30, 4243JS Nieuwland | `+31183353276`<br>`boerderij@degroenegeer.nl` | broodsmakelijk | Listed as zuivelboerderij in the province overview; product icons: organic, boerenkaas, other dairy, vegetables, orchard fruit, eggs, meat, honey, juice |
| Boer Bert | Woerden *(Kamerik)* | Gravensloot 14, 3471 BM Kamerik | `info@zoekdeboer.nl` | zoekdeboer | Organic dairy farm making its own boerenkaas near Woerden — street matched on postcode only |
| De Beekhoeve | Woerden *(Kamerik)* | van Teylingenweg 172, 3471GK Kamerik | [beekhoeve.nl](http://beekhoeve.nl)<br>`+31348401254 of +31626510369`<br>`info@beekhoeve.eu` | broodsmakelijk | De Beekhoeven is een biologisch melkveebedrijf. Men maakt van eigen rauwe melk boerenkaas en vele andere zuivelproducten. Naast de koeien houdt men ook op kleine schaal kippen en kan je in het boerderijwinkeltje, naast de… |
| Kaasboerderij de Houdycker | Woerden *(Kamerik)* | Houtdijk 3, 3471 BS Kamerik | [blauwklaver.nl](http://www.blauwklaver.nl)<br>`06-14040820`<br>`info@blauwklaver.nl` | BvBZ | street matched on postcode only |
| Kaasboerderij de Koepel | Woerden *(Harmelen)* | Harmelerwaard 3, 3481 LB Harmelen | — | BvBZ | — |
| Kaasboerderij Janmaat | Woerden | Barwoutswaarder 57, 3449 HJ Woerden | [kaasboerderij-janmaat.nl](http://www.kaasboerderij-janmaat.nl)<br>`06-13235125`<br>`cjanmaat@telfort.nl` | BvBZ | — |
| Kaasboerderij Van de Weerd | Woerden | Veldwijk 10, 3446 HB Woerden | `0348-430787`<br>`fam_vdweerd@hetnet.nl` | BvBZ | — |

## Barrido de productores de cerveza (2026-08-13)

Búsqueda de cervecerías artesanales e independientes con planta de elaboración propia en Utrecht. Las fuentes consultadas confirman la actividad productiva e instalaciones propias; quedan registradas como candidaturas en espera para la verificación completa de coordenadas, contacto y canales de venta directa antes de su publicación en el catálogo.

| Candidato | Señal / Actividad | Municipio | Contacto / Web / Instagram |
|---|---|---|---|

