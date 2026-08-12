# Candidatos — Gelderland

Segunda revisión individual del 2026-08-09. Quedan 12 operadores certificados retenidos porque no muestran una oferta alimentaria propia, actual y públicamente atribuible suficiente. 't Aailand, 't Vreebroek, Haneman Biofruit, Binnenveldse Boeren Bio Kip y Landgoed Huis Sevenaer se trasladaron al CSV. A.Vogel, ADVIZON / De Zonnebloem Landgoedbeheer y A. Jochemsen Pluimvee se descartaron por quedar fuera del ámbito alimentario.

| Nombre declarado | Woonplaats declarada | Dirección certificada | Motivo de retención | Certificado |
|---|---|---|---|---|
| 't Kossegat agro B.V. | Barneveld | Kraaikamperweg 5 3772TP | El certificado acredita cultivos y ganadería, pero no se localizó una oferta alimentaria pública propia. | [NL-BIO-01.528-0005749.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005749.2025.001.pdf) |
| 't Lage Eind Pluimveebedrijf B.V. | Kootwijkerbroek | Laageinderweg 58 3774TD | Se confirma una explotación de gallinas ponedoras, no huevos comercializados bajo su propia identidad. | [NL-BIO-01.528-0000693.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0000693.2026.001.pdf) |
| A.C. Kruisselbrink | Westendorp | Perebolterweg 16 7054CM | Hay indicios históricos de venta directa de carne ecológica, pero falta una identidad pública oficial y una oferta actual inequívoca. | [NL-BIO-01.528-0004327.2026.002](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0004327.2026.002.pdf) |
| A.F. en C.W.G. Kok | De Glind | Schoonderbekerweg 13 3794 | El certificado acredita producción animal y vegetal, sin producto u oferta pública atribuible. | [NL-BIO-01.528-0000916.2025.002](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0000916.2025.002.pdf) |
| A.R. Bos | Ede | Maanderdijk 24B 6718NG | Los registros confirman ganadería, pero no una oferta alimentaria propia visible. | [NL-BIO-01.528-0002437.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002437.2026.001.pdf) |
| Afdeling Hoogstamfruit Rivierenland | Geldermalsen | Prins Bernhardlaan 5-12 4191AN | La asociación comercializa fruta de sus miembros, pero la dirección certificada no identifica una unidad productiva concreta. | [NL-BIO-01.528-0004129.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0004129.2026.001.pdf) |
| Agraservice Kootwijkerbroek / Varkenshouderij Top | Kootwijkerbroek | Drieenhuizerweg 17 3774RE | La identidad pública corresponde principalmente a servicios agrarios y transporte; no se verificó carne propia ofrecida al público. | [NL-BIO-01.528-0001948.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0001948.2025.001.pdf) |
| Agri Henricus Hoeve | Beneden Leeuwen | Mosterdwal 10 6658KT | Solo se confirma la explotación en registros y certificado, sin oferta alimentaria propia pública. | [NL-BIO-01.528-0005487.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005487.2026.001.pdf) |
| Ariese Agro | Barneveld | Bielderweg 1 3772VM | La presencia pública se limita a servicios y actividad porcina; falta una oferta de carne propia. | [NL-BIO-01.528-0005970.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005970.2025.001.pdf) |
| B. van Donselaar / van Donselaar | Stroe | Broekweg 16 3776MR | Los registros describen ganadería y comercio mayorista de huevos, pero no una oferta alimentaria propia para el público. | [NL-BIO-01.528-0004468.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0004468.2025.001.pdf) |
| B.A.H.M. Biologische Varkenshouderij | Wehl | Notenstraatje 5a 7031 | Se verifica la granja porcina ecológica, no una marca o canal público de carne propia. | [NL-BIO-01.528-0002052.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002052.2026.001.pdf) |
| B.J. Seinhorst | Aalten | Koopweg 3 7122LR | El registro acredita cría de ganado joven y cultivos, sin alimento concreto ofrecido bajo su identidad. | [NL-BIO-01.528-0005812.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005812.2026.001.pdf) |

## Cheese and farm-dairy sweep (2026-08-12)

Target: `data/csv/nl/oost-nederland/gelderland.csv`, category `Lácteos y quesos`.
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
| Rustpunt Zuivelboerderij Wikkerink | Aalten | undefined, Aalten | [echteboerderijzuivel.nl](https://www.echteboerderijzuivel.nl) | OSM | gemeente from nearest address, 105 m away |
| Melkveehouderij Gelkenhorst | Barneveld | Barneveld | — | zoekdeboer | Self-service point for own organic milk and cheese — no street address published |
| Ouwendorperhoeve | Barneveld *(Garderen)* | Ouwendorperweg 27, 3886 MR Garderen | [ouwendorperhoeve.nl](http://www.ouwendorperhoeve.nl)<br>`0577-407177`<br>`nelleke.meersma@ouwendorperhoeve.nl` | BvBZ | — |
| Topzuivel | Barneveld *(Kootwijkerbroek)* | Laageinderweg 18, 3774 TD Kootwijkerbroek | — | BvBZ | — |
| Boerenzuivel van Claudia | Berkelland *(Eibergen)* | Warfslatweg 5, 7152 CA Eibergen | [boerenzuivelvanclaudia.nl](http://boerenzuivelvanclaudia.nl)<br>`06-12443360`<br>`d.krooshof@tele2.nl` | BvBZ | — |
| De Melktap | Berkelland *(Geesteren)* | Nettelhorsterweg 21, 7274EA Geesteren | `+31545482241 of +31622240128`<br>`info@demelktap.nl` | broodsmakelijk | Listed as zuivelboerderij in the province overview; product icons: vending, milk, other dairy, eggs, juice |
| Boerderij en Kaasmakerij Köning | Bronckhorst *(Laag-Keppel)* | Eldrikseweg 7, 6998 CC Laag-Keppel | [boerderijkoning.nl](http://www.boerderijkoning.nl)<br>`06-20429052`<br>`kaas@boerderijkoning.nl` | BvBZ | — |
| Boerderij Ruimzicht | Bronckhorst *(Halle)* | Bielemansdijk 11A, 7025 CN Halle | — | zoekdeboer | Biodynamic farm with its own kaasmakerij for bergkaas and dairy |
| Ravenswaard VOF | Druten *(Afferden)* | Kooistraat 3, 6654 KH Afferden | [ravenswaard.nl](http://www.ravenswaard.nl)<br>`0487-512364`<br>`litjens199@hetnet.nl` | BvBZ | — |
| Melkveebedrijf Vuulink | Duiven | Kosterstraat 11, Duiven | — | BvBZ | — |
| Kaasboerderij Brandrood | Ede | Kernhemseweg 6, 6718ZB Ede | [brandroodkaas.nl](https://www.brandroodkaas.nl)<br>`+31624868846`<br>`info@brandroodkaas.nl` | broodsmakelijk | Listed as kaasboerderij in the province overview; product icons: boerenkaas, eggs, jam |
| Remeker De Groote Voort | Ede *(Lunteren)* | Postweg 110, 6741 ML Lunteren | `remeker@remeker.nl` | BvBZ + broodsmakelijk | BvBZ member. Deze kaasboerderij maakt kaas van ongepasteuriseerde melk met een natuurkorst, dus niet met de gebruikelijke kunststof coating. De kazen die men maakt worden verkocht onder de naam Remeker. Zo verkoopt men Remeker… — also listed as *Kaasboerderij De Groote Voort* |
| Boerderij Goudbeek | Epe | Weteringdijk 23, Epe | [boerderijgoudbeek.nl](https://www.boerderijgoudbeek.nl/) | BvBZ | — |
| Mts Kuyt Meihuizen | Ermelo | Jhr Dr. C.J. Sandbergweg 68, 3852 PV Ermelo | — | BvBZ | — |
| Farmshop Vrijhof Hierden | Harderwijk *(Hierden)* | Glindweg 6, 3849 MC Hierden | [farmshop-vrijhof-hierden.nl](http://www.farmshop-vrijhof-hierden.nl/)<br>`06-14457518`<br>`l.vrijhof@kpnplanet.nl` | BvBZ | — |
| Burgerboerderij De Patrijs | Lochem *(Laren)* | Dochterenseweg 13a, 7245 NN Laren | [depatrijs.eco](https://depatrijs.eco/)<br>`0575-743710`<br>`contact@depatrijs.eco` | BvBZ | — |
| Melkschapenbedrijf De Kooihoek | Lochem *(Laren)* | Verwoldseweg 31, 7245 VX Laren | [dekooihoek.nl](http://www.dekooihoek.nl)<br>`0573-421319`<br>`kooihoek@hetnet.nl` | BvBZ | — |
| Mijn Kaaskoe | Maasdriel *(Hedel)* | Achterdijk 57, 5321 JB Hedel | — | zoekdeboer | Name and location point to a cheese farm; the directory holds no detail yet |
| Zuivelboerderij Den Eelder | Maasdriel *(Well)* | Molenachterdijk 3, 5325 KL Well | [deneelder.nl](http://www.deneelder.nl)<br>`073-5991283`<br>`willem@deneelder.nl` | BvBZ | — |
| Bio Boerderij Keuper | Oude IJsselstreek *(Megchelen)* | Nieuweweg 14, 7078 AC Megchelen | — | zoekdeboer | Sells raw-milk cheese, farm ice cream and own juice; own production to confirm |
| Betuwse Boerderijkaas | Overbetuwe *(Elst)* | Grote Molenstraat 165, 6661 NG Elst | [betuwseboerderijkaas.nl](http://www.betuwseboerderijkaas.nl)<br>`info@betuwseboerderijkaas.nl` | BvBZ | — |
| Klein Olden Aller | Putten | Oldenaller allee 5, 3882 RW Putten | [kleinoldenaller.nl](http://www.kleinoldenaller.nl)<br>`06-12915134`<br>`info@kleinoldenaller.nl` | BvBZ | — |
| Boerderij Den Hoek | Voorst *(Wilp)* | Leemsteeg 23, 7384 SN Wilp | [denhoek.nl](http://www.denhoek.nl)<br>`0555-191955`<br>`info@denhoek.nl` | BvBZ | — |
| CV J van den Bergh | West Betuwe *(Vuren)* | Achterdijk 6, 4214 KR Vuren | [kaasvanjan.nl](http://www.kaasvanjan.nl)<br>`06-44067773`<br>`info@kaasvanjan.nl` | BvBZ | — |
| Zuivelboerderij Noordam | West Betuwe *(Hellouw)* | Meikampgraaf 10, 4174 LB Hellouw | [zuivelboerderijnoordam.nl](http://www.zuivelboerderijnoordam.nl)<br>`0418-594075`<br>`winkelnoordam@gmail.com` | BvBZ | — |
| Geitenkaasmakerij De Brömmels | Winterswijk *(Winterswijk Woold)* | Meerdinkweg 5, 7108 BJ Winterswijk Woold | [brommels.nl](http://www.brommels.nl)<br>`0543-564518`<br>`info@brommels.nl` | BvBZ + OSM | street matched on postcode only |
| Melkveebedrijf Reijmer | Zevenaar | Kleine Matenweg 6, 6903 PD Zevenaar | — | BvBZ | — |
