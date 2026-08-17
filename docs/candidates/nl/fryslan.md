# Candidatos — Fryslân

Segunda revisión individual del 2026-08-09. Quedan 12 operadores certificados retenidos: se acredita actividad agraria, pero no una oferta alimentaria propia y públicamente atribuible suficiente. Se trasladaron al CSV Bakker Bio, BioSúd, Boer Brunia, De Gèskieker y Bruinsma Bio. Auke Kleefstra y Bijenbrood se descartaron por dedicarse respectivamente a vivero y flor cortada.

| Nombre declarado | Woonplaats declarada | Dirección certificada | Motivo de retención | Certificado |
|---|---|---|---|---|
| A.F. van Seijen | Grou | Hôflânswei 1 9001 | El certificado identifica ganadería y cultivos, pero no se localizó una oferta alimentaria pública propia. | [NL-BIO-01.528-0005639.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005639.2026.001.pdf) |
| A.J. Hofstee | Hoornsterzwaag | Bij de Leijwei 64 8412 | Los directorios confirman una explotación lechera y contacto, no producto u oferta propia actual. | [NL-BIO-01.528-0006108.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0006108.2026.001.pdf) |
| Aegema State CV | Peins | Riedsterweg 2 8812 | Solo se acredita identidad registral y actividad lechera; falta una oferta pública atribuible. | [NL-BIO-01.528-0007352.2026.002](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0007352.2026.002.pdf) |
| B. de Jong en J.H. de Jong | Langezwaag | Hegedyk 34 8404 | El registro confirma ganadería lechera, pero no una identidad comercial u oferta alimentaria propia. | [NL-BIO-01.528-0007772.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0007772.2026.001.pdf) |
| B.A. Veenstra | Jubbega | Schoterlandseweg 141 8411 | No se localizó evidencia pública suficiente más allá del certificado. | [NL-BIO-01.528-0002012.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002012.2026.001.pdf) |
| B.B. Voolstra | Nes | Soarremoarre 6 8494NA | No se localizó identidad pública ni oferta alimentaria propia verificable. | [NL-BIO-01.528-0005229.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005229.2025.001.pdf) |
| Benedictus F en Swart EA Mts. | Eastermar | Seadwei 17 9261 | El certificado prueba actividad agropecuaria, no una oferta alimentaria pública propia. | [NL-BIO-01.528-0000990.2026.002](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0000990.2026.002.pdf) |
| Biologisch akkerbouwbedrijf van Valkenhoef | Oosterstreek | Oosterseveldweg 45 8388 | El registro confirma explotación mixta, pero no productos concretos vendidos bajo identidad propia. | [NL-BIO-01.528-0005677.2026.003](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005677.2026.003.pdf) |
| Biologisch melkveebedrijf Kiestra | Wyns | Bartlehiem 8 9091BJ | Se confirma actividad lechera y ovina, pero no una oferta alimentaria pública propia. | [NL-BIO-01.528-0002779.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002779.2026.001.pdf) |
| Biologyske greidbuorkerij Henk en Agatha | Anjum | Sylsterwei 8 9133 | La prensa confirma la granja activa, pero no una oferta propia actual y verificable. | [NL-BIO-01.528-0002785.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002785.2025.001.pdf) |
| Boer Bartele | Rotstergaast | Schoterweg 26 8462TD | La explotación lechera sigue registrada, pero cerró en 2026 su concepto público de tienda/restauración y no hay oferta propia actual clara. | [NL-BIO-01.528-0005131.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005131.2026.001.pdf) |
| Buorkje mei de natuer | Aldeboarn | Fjurlanswei 2 8495 | La web anuncia melktap, kéfir y carne como próximos/futuros, no como oferta disponible ya. | [NL-BIO-01.528-0003828.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0003828.2026.001.pdf) |

## Cheese and farm-dairy sweep (2026-08-12)

Target: `data/csv/nl/noord-nederland/fryslan.csv`, category `Lácteos y quesos`.
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
| Schapenkaasboerderij Tusken Bosk en Mar | De Fryske Marren *(Oudega)* | Ige Galamawei 23, 8582 KR Oudega | [tuskenboskenmar.nl](http://www.tuskenboskenmar.nl)<br>`0514-605356`<br>`info@tuskenboskenmar.nl` | BvBZ | — |
| Bongastate Melkschapenbedrijf | Leeuwarden *(Hilaard)* | Hilaerdermieden 2, 9027 BB Hilaard | — | BvBZ | — |
| Doetie’s Geiten | Noardeast-Fryslân *(Aldwâld)* | Allemawei 8, Aldwâld | [doetiesgeiten.nl](https://doetiesgeiten.nl/) | BvBZ | — |
| Groot Kabel | Noardeast-Fryslân *(Kollumerpomp)* | Foijingaweg 57, 9293 LR Kollumerpomp | [grootkabel.nl](http://www.grootkabel.nl)<br>`06-27284612`<br>`info@grootkabel.nl` | BvBZ | — |
| Kaasboerderij de Marlannen | Noardeast-Fryslân *(Jouswier)* | Humaldawei 40, 9124 ER Jouswier | [marlannerkaashuis.nl](http://www.marlannerkaashuis.nl)<br>`06 27341838`<br>`marlannen@live.nl` | BvBZ | — |
| Zuivelboerderij Roordastate | Noardeast-Fryslân *(Ginnum)* | Roordastrjitte 7, 9174 GD Ginnum | `mtsvandervelde@gmail.com` | BvBZ | — |
| Kaasboerderij de Stelp | Ooststellingwerf *(Oldeberkoop)* | Wolvegasterweg 49, 8421 PS Oldeberkoop | [dekaasboerderij.nl](http://www.dekaasboerderij.nl)<br>`0516-451366`<br>`info@dekaasboerderij.nl` | BvBZ + OSM | — |
| Kaasmakerij Oosterwolde | Ooststellingwerf *(Oosterwolde)* | Ecomunitypark 2, 8431 SM Oosterwolde | — | BvBZ | — |
| Kobunder | Opsterland *(Lippenhuizen)* | de Buorren 101, 8408 HL Lippenhuizen | — | BvBZ | — |
| Westerleane Boer & Zuivel | Opsterland *(Terwispel)* | Alde Dyk 50, 8407 AG Terwispel | [westerleane.nl](http://www.westerleane.nl)<br>`06–3849 9103`<br>`info@westerleane.nl` | BvBZ | — |
| Mts. Hartmans/Brandsma/Stoffelsma | Smallingerland *(Drachtstercompagnie)* | De Feart 29, 9222 NS Drachtstercompagnie | `0512-342320`<br>`tt.stoffelsma@live.nl` | BvBZ | — |
| Oerboer | Súdwest-Fryslân *(Wons)* | Weersterweg 27, 8747 NR Wons | — | BvBZ | — |
| YpKo Suvel | Súdwest-Fryslân *(Ypecolsga)* | Nummer 8a, 8554 RD Ypecolsga | [ypko.nl](http://www.ypko.nl)<br>`06-511537439`<br>`info@ypko.nl` | BvBZ | street matched on postcode only |
| Kaas- en Zuivelboerderij De Pieter Peits Hoeve | Terschelling *(Lies)* | Buitenwalweg 6, 8895 KC Lies | [pieterpeitshoeve.nl](http://www.pieterpeitshoeve.nl)<br>`0562-448501`<br>`info@pieterpeitshoeve.nl` | BvBZ | — |
| DTC Praktijkschool Oenkerk | Tytsjerksteradiel *(Oentsjerk)* | Sanjesreed 4, 9062EK Oentsjerk | — | BvBZ | street matched on postcode only |
| Vlielander Kaasbunker | Vlieland | Vuurboetsduin 5, 8899 AT Vlieland | [zeewierkaas.nl](http://www.zeewierkaas.nl)<br>`06-21511618`<br>`info@zeewierkaas.nl` | BvBZ | — |
| De Molkerei – Geitenzuivel van ’t wad | Waadhoeke *(Oudebildtzijl)* | Nieuwebildtdijk 60, 9078 PR Oudebildtzijl | [demolkerei.nl](http://www.demolkerei.nl)<br>`0518-421306`<br>`els@demolkerei.nl` | BvBZ | — |
| Langeveld | Weststellingwerf *(Steggerda)* | Ericaweg 15, 8395TH Steggerda | — | BvBZ | — |
| Schelhaas & Van Valkenhoef | Weststellingwerf *(Oosterstreek)* | Oosterseveldweg 45, 8388 MB Oosterstreek | `Bio-intveld@outlook.com` | BvBZ | — |

## Barrido de productores de cerveza (2026-08-13)

Búsqueda de cervecerías artesanales e independientes con planta de elaboración propia en Fryslân. Las fuentes consultadas confirman la actividad productiva e instalaciones propias; quedan registradas como candidaturas en espera para la verificación completa de coordenadas, contacto y canales de venta directa antes de su publicación en el catálogo.

| Candidato | Señal / Actividad | Municipio | Contacto / Web / Instagram |
|---|---|---|---|

## Barrido de productores de pescado y acuicultura (2026-08-14)

Revisión individual del 2026-08-14. Los casos resueltos se trasladaron al CSV o a evidencia de exclusión; quedan abiertos únicamente los siguientes candidatos por falta de una prueba suficiente y actual.

| Candidato | Municipio propuesto | Motivo de retención | Fuente inicial |
|---|---|---|---|
| Fiskerijbedriuw De Jager (Iel en Mear) | Leeuwarden *(Grou)* | The proposed domain is unavailable and current listings conflict on the productive municipality; identity, current offer and location remain unresolved. | [web](https://iel-en-mear.frl/) |
| Forellenvijver W. Dekker | Weststellingwerf *(Oosterstreek)* | The proposed domain is unavailable and no current source was found that proves own trout production and a public food offer. | [web](https://forellenvijverdekker.nl/) |
| Forelvisvijvers de Hooidammen | De Fryske Marren *(Sint Nicolaasga)* | Only an older put-and-take registry entry was found; current activity and own food production remain unresolved. | [web](https://dehooidammen.nl/) |

