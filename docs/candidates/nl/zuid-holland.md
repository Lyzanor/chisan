# Candidatos — Zuid-Holland

Revisión individual del 2026-08-09. Resultado: 11 candidatos confirmados, publicados como 10 unidades porque AgriVita y AHSC Goedegebuur comparten la explotación y la identidad pública de Vleesveehouderij Fam. Goedegebuur; 3 operadores se descartaron por dedicarse a flores o material vegetal y 6 siguen abiertos. Las decisiones cerradas constan en `data/evidence/nl/west-nederland/zuid-holland.jsonl`.

## Pendientes de evidencia suficiente

| Nombre declarado | Dirección certificada | Motivo para mantenerlo abierto | Certificado |
|---|---|---|---|
| A. de Koning | Varkensdijk 12, Strijen | El registro actual confirma cultivos anuales, pero no una identidad alimentaria pública, un producto propio concreto ni un canal de mercado. | [NL-BIO-01.528-0005291.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005291.2026.001.pdf) |
| A.B. Noordermeer | Kloosterweg 16, Brielle | La empresa de hortalizas de invernadero está activa, pero no publica marca, productos concretos ni oferta comercial atribuible a la unidad. | [NL-BIO-01.528-0001528.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0001528.2025.001.pdf) |
| A.B.M. de Winter | Duinen 1, Oostvoorne | Se localizó una explotación biodinámica con tienda en esta dirección en 2002, pero no una fuente pública actual que confirme que esa oferta sigue vigente. | [NL-BIO-01.528-0002763.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002763.2025.001.pdf) |
| Akkerbouwbedrijf Leune | Zevenhovenseweg 15, Ter Aar | La explotación ecológica está activa y proyecta abastecer a compradores regionales, pero no se encontró todavía una oferta alimentaria pública y vigente. | [NL-BIO-01.528-0007267.2026.002](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0007267.2026.002.pdf) |
| B. Piek | Ringdijk 10A, Geervliet | El registro actual confirma cereales y hortalizas de campo, sin marca, producto comercial concreto ni salida pública al mercado. | [NL-BIO-01.528-0006011.2026.003](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0006011.2026.003.pdf) |
| Biemond Flakkee B.V. | Plaatweg 3, Stellendam | Se confirma una explotación activa con rama de agricultura ecológica, pero no una oferta pública concreta de alimentos propios. | [NL-BIO-01.528-0004655.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0004655.2026.001.pdf) |

## Cheese and farm-dairy sweep (2026-08-12)

Target: `data/csv/nl/west-nederland/zuid-holland.csv`, category `Lácteos y quesos`.
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
| Biokaas Kinderdijk | Alblasserdam | Molenkade 11, 2954 LB Alblasserdam | [biokaaskinderdijk.nl](http://www.biokaaskinderdijk.nl)<br>`06-51640918`<br>`Biokaas.kinderdijk@gmail.com` | BvBZ | — |
| 't Piepertje | Alphen aan den Rijn *(Hazerswoude-Dorp)* | Hoogeveenseweg 16, 2391NR Hazerswoude-Dorp | [streekshoppen.nl/streekshops/bekijk/boerderijwinkel-t-piepertje](http://streekshoppen.nl/streekshops/bekijk/boerderijwinkel-t-piepertje)<br>`+31 172 589 121`<br>`arnoka@solcon.nl` | OSM | OSM tags `shop=farm`, produce: potatoes, appels, pears, eggs, cheese, brussels sprouts |
| Bloeiend Landlust | Alphen aan den Rijn | Gnephoek 44, 2401LP Alphen aan den Rijn | [bloeiendlandlust.nl](https://bloeiendlandlust.nl)<br>`+31 6 85191951`<br>`winkel@bloeiendlandlust.nl` | OSM | OSM tags `shop=farm`, produce: cheese, butter, other dairy, eggs, vegetables (also prepackaged, bio), fruit (sa |
| Firma van der Burg Zegenvrucht | Alphen aan den Rijn *(Hazerswoude-Dorp)* | Westeinde 1A, 2391 JA Hazerswoude-Dorp | [zuivelvanzus.nl](http://www.zuivelvanzus.nl)<br>`06-36144934`<br>`post@hoeve-zegenvrucht.nl` | BvBZ + broodsmakelijk | BvBZ member. Hoeve Nieuw Bethlehem heeft een relatie met Hoeve Zegenvrucht. Het is allemaal begonnen in Hoeve Zegenvrucht maar door plaatsgebrek heeft men de koeien, de kaas- en zuivelbereiding overgebracht naar Hoeve Nieuw… — also listed as *Hoeve Nieuw Bethlehem* |
| Kaasboerderij Luyben | Alphen aan den Rijn *(Aarlanderveen)* | Nieuwkoopseweg 9, 2445 NB Aarlanderveen | [kaasboerderijluyben.nl](http://kaasboerderijluyben.nl)<br>`06-47143338`<br>`luijben@hetnet.nl` | BvBZ + OSM | — |
| Melkveebedrijf de Rijk zuivel | Alphen aan den Rijn | Heijmansbuurt 5, 2401LV Alphen aan den Rijn | `+31642349130` | broodsmakelijk | Listed as zuivelboerderij in the province overview; product icons: boerenkaas, milk, other dairy, eggs — street matched on postcode only |
| Melkveebedrijf De Witte Gravin | Alphen aan den Rijn | Kortsteekterweg 12, 2407AG Alphen aan den Rijn | `+31641767585` | broodsmakelijk + zoekdeboer | Listed as kaasboerderij in the province overview; product icons: vending, boerenkaas, milk, other dairy, jam — also listed as *De Witte Gravin* |
| Polderzuivel | Alphen aan den Rijn *(Benthuizen)* | Noordpolder 2, Benthuizen | [polderzuivel.nl](https://polderzuivel.nl/)<br>`06-45571178`<br>`polderzuivel2@hotmail.com` | BvBZ | — |
| Zuivelboerderij fam. Steenwijk | Alphen aan den Rijn | Woubrugseweg 80, 2401 LV Alphen aan den Rijn | [zuivelboerderij.info](http://www.zuivelboerderij.info)<br>`+31 172 518 316`<br>`steenwijk@zuivelboerderij.info` | BvBZ + OSM | — |
| Boerderij de Pater VOF | Bodegraven-Reeuwijk *(Waarder)* | Oosteinde 44, 3466 LB Waarder | `0348-501948`<br>`famdepater@live.nl` | BvBZ | — |
| Broerenhoeve Reeuwijk | Bodegraven-Reeuwijk *(Reeuwijk)* | Reewal 43, 2811 PV Reeuwijk | — | zoekdeboer | Farm vending with boerenkaas and own milk tap; own production to confirm |
| De Dieijen VOF | Bodegraven-Reeuwijk *(Bodegraven)* | Burgemeester Kremerweg 10, 2411 RM Bodegraven | [arcadiaboerderij.nl](https://www.arcadiaboerderij.nl/)<br>`0172-615325` | BvBZ | — |
| Fam Onderwater | Bodegraven-Reeuwijk *(Bodegraven)* | J.C.Hoogendoornlaan 10, 2381 EA Bodegraven | [kaasboerderijonderwater.nl](http://www.kaasboerderijonderwater.nl)<br>`06-54298316`<br>`quno@hetnet.nl` | BvBZ + OSM | — |
| Firma W. Olieman | Bodegraven-Reeuwijk *(Reeuwijk)* | Oud Reeuwijkseweg 26, Reeuwijk | — | BvBZ | — |
| Melkveehouderij de Wit | Bodegraven-Reeuwijk *(Reeuwijk)* | Oud-Reeuwijkseweg 11, 2811KB Reeuwijk | [melkveehouderijdewit.nl](https://melkveehouderijdewit.nl)<br>`+31629343406`<br>`anton@melkveehouderijdewit.nl` | broodsmakelijk | In het boerderijwinkeltje van melkveehouderij de Wit staat niet alleen een melktap maar ook automaten waar je eieren van eigen kippen en streekproducten zoals yoghurt en kaas kan kopen. [icons: vending, boerenkaas, milk, other… |
| Mts. Hogendoorn & Zn. | Bodegraven-Reeuwijk *(Waarder)* | De Groendijck 59a, 3466 NJ Waarder | [babyboerenkaas.nl](http://www.babyboerenkaas.nl)<br>`0348-342113` | BvBZ | — |
| Van der Bas | Bodegraven-Reeuwijk *(Nieuwerbrug aan den Rijn)* | Molendijk 2, 2415 NA Nieuwerbrug aan den Rijn | — | BvBZ | — |
| Verhoef Dairy Farm | Bodegraven-Reeuwijk *(Nieuwerbrug aan den Rijn)* | Weiland 16, Nieuwerbrug aan den Rijn | [verhoefdairyfarm.nl](https://verhoefdairyfarm.nl/) | BvBZ | gemeente from nearest address, 15 m away |
| Kaasboerderij van Schaik | Goeree-Overflakkee *(Stellendam)* | Langeweg 1, 3521LH Stellendam | `+31187491777` | broodsmakelijk | Listed as kaasboerderij in the province overview; product icons: boerenkaas, milk, other dairy, eggs |
| Saurenhof | Goeree-Overflakkee *(Den Bommel)* | Lageweg 1, 3258LK Den Bommel | — | broodsmakelijk | Listed as kaasboerderij in the province overview; product icons: boerenkaas |
| Scheiwijkzuivel | Gorinchem | Nieuweweg 20, 4205 NJ Gorinchem | [scheiwijkzuivel.nl](http://www.scheiwijkzuivel.nl)<br>`06-36183909`<br>`info@scheiwijkzuivel.nl` | BvBZ | — |
| De Goudsche Waag | Gouda | Markt 35, 2801 JK Gouda | [martskaasie.nl/Home](https://martskaasie.nl/Home/)<br>`06-29856707`<br>`info@martskaasie.nl` | BvBZ | — |
| Buitenverwachting | Kaag en Braassem *(Hoogmade)* | Vlietkade 2, 2355 CR Hoogmade | [boerderijbuitenverwachting.nl](http://www.boerderijbuitenverwachting.nl)<br>`06-42679681`<br>`Buitenverwachting@hotmail.com` | BvBZ + OSM | — |
| De Kaagse Boer | Kaag en Braassem *(Kaag)* | Julianalaan 29, Kaag | [kaagseboer.nl](https://www.kaagseboer.nl/)<br>`06-26714210`<br>`info@kaagseboer.nl` | BvBZ | — |
| Hoeve Waterrijk | Kaag en Braassem *(Rijpwetering)* | Buurterpolder 2, 2375 NJ Rijpwetering | [hoevewaterrijk.nl](http://www.hoevewaterrijk.nl)<br>`06-14044545`<br>`info@hoevewaterrijk.nl` | BvBZ | — |
| Kaasboerderij Schrama | Kaag en Braassem *(Rijpwetering)* | Poeldijk 5a, 2375 NE Rijpwetering | [kaasboerderijschrama.nl](http://www.kaasboerderijschrama.nl)<br>`071-5013208`<br>`Pe.schrama@planet.nl` | BvBZ + OSM | — |
| L.Q. van der Geest v.o.f. | Kaag en Braassem *(Oud Ade)* | Blauwe polder 1A, 2374 BR Oud Ade | — | BvBZ | — |
| Rotteveel Boerenkaas VOF | Kaag en Braassem *(Rijpwetering)* | Zuidweg 1A, 2375 AP Rijpwetering | [rotteveelboerenkaas.nl](http://www.rotteveelboerenkaas.nl)<br>`071-5018604`<br>`erik@rotteveelboerenkaas.nl` | BvBZ + OSM | — |
| Weidegeluk | Kaag en Braassem *(Oud Ade)* | Boekhorsterweg 19, 2374 BN Oud Ade | [weidegeluk.nl](http://www.weidegeluk.nl)<br>`071-5018071`<br>`info@weidegeluk.nl` | BvBZ + OSM | — |
| Zuivelboerderij Kwakernaak | Kaag en Braassem *(Oud Ade)* | Hofdijlaan 23, 2374 BS Oud Ade | [boerenleidsekaas.nl](https://www.boerenleidsekaas.nl/)<br>`06-46258422`<br>`dkwakernaak@kpnmail.nl` | BvBZ + OSM | street matched on postcode only |
| Zuivelboerderij Mooren | Kaag en Braassem *(Hoogmade)* | Groenwegh 3, Hoogmade | [moorenzuivelboerderij.nl](http://moorenzuivelboerderij.nl/)<br>`info@moorenzuivelboerderij.nl` | BvBZ | — |
| De Bonte Weide | Krimpenerwaard *(Stolwijk)* | Benedenkerkseweg 106b, 2821 LE Stolwijk | [debonteweide.nl](http://www.debonteweide.nl)<br>`06-29100116`<br>`info@debonteweide.nl` | BvBZ | — |
| De Veerstalhoeve | Krimpenerwaard *(Gouderak)* | Gouderakse Tiendweg 97, 2831 KA Gouderak | — | zoekdeboer | Farm shop with own meat and boerenkaas; own production to confirm |
| Eigense Kaas | Krimpenerwaard *(Bergambacht)* | Bovenberg 61, 2861 BA Bergambacht | — | BvBZ | — |
| Kaasboerderij Boer Bas | Krimpenerwaard *(Ouderkerk aan den IJssel)* | Tiendweg West 1, 2935LG Ouderkerk aan den IJssel | `+31180521875`<br>`kaasboerderijboerbas@outlook.com` | broodsmakelijk | Listed as kaasboerderij in the province overview; product icons: boerenkaas, other dairy, eggs, juice |
| Kaasboerderij Hoogerwaard | Krimpenerwaard *(Ouderkerk aan den IJssel)* | Lageweg 45, 2935CD Ouderkerk aan den IJssel | `+31180681530`<br>`info@hoogerwaard.info` | broodsmakelijk | Kaasboerderij Hoogerweg houdt men koeien en van de melk maakt men zelf kaas. Naast de kaasmakerij organiseert men vele activiteiten zoals een rondleiding op de boerderij en kaasmakerij, workshop kaasmaken en kinderfeestjes.… |
| Kaasboerderij Kool | Krimpenerwaard *(Stolwijk)* | Koolwijkseweg 39, 2821 NT Stolwijk | `06-10801266`<br>`lenjkool@hotmail.com` | BvBZ | — |
| Kaasboerderij Schep | Krimpenerwaard *(Bergambacht)* | Zuidbroek 153, 2861 LL Bergambacht | [kaasboerderijschep.nl](http://www.kaasboerderijschep.nl)<br>`0182–367880`<br>`info@kaasboerderijschep.nl` | BvBZ | — |
| Maatschap Snoekvliet | Krimpenerwaard *(Stolwijk)* | Schoonouwenseweg 46A, 2821 NZ Stolwijk | `0182 342 794` | BvBZ | — |
| MTS Boer Brouwer de Koning | Krimpenerwaard *(Stolwijk)* | Beijerscheweg 12, 2821 NG Stolwijk | [Beijerscheschuur.nl](http://www.Beijerscheschuur.nl)<br>`0182-518504`<br>`beijerscheschuur@outlook.com` | BvBZ + broodsmakelijk | BvBZ member. Listed as kaasboerderij in the province overview; product icons: boerenkaas, eggs, jam — also listed as *Boerderijwinkel De Beijersche schuur* |
| Rustpunt Kaasboerderij Boer Bas | Krimpenerwaard *(Ouderkerk aan den IJssel)* | undefined, Ouderkerk aan den IJssel | — | OSM | gemeente from nearest address, 30 m away |
| t Klooster | Krimpenerwaard *(Haastrecht)* | Steinsedijk 5, 2851 LA Haastrecht | [kaasboerderijklooster.nl](http://www.kaasboerderijklooster.nl)<br>`06-10212135`<br>`an.bouman@planet.nl` | BvBZ | — |
| Veehouderij en zuivelbedrijf Van Erk | Krimpenerwaard *(Berkenwoude)* | Westeinde 56, Berkenwoude | — | BvBZ | — |
| Hoeve Zegenvrucht | Lansingerland *(Berkel en Rodenrijs)* | Noordeindseweg 244, 2651LK Berkel en Rodenrijs | [hoeve-zegenvrucht.nl](https://www.hoeve-zegenvrucht.nl)<br>`+31620959979`<br>`bestelling@hoeve-zegenvrucht.nl` | broodsmakelijk | In Hoeve Zegenvrucht verkoopt men echte boerenkaas en zuivelproducten van eigen makelij. Veel van de producten zijn ook verkrijgbaar in de automaat. [icons: vending, boerenkaas, other dairy, eggs, meat, honey, jam, juice] |
| Melktap Maria's hoeve | Leidschendam-Voorburg *(Leidschendam)* | Bovenmeerseweg 11, 2266HX Leidschendam | `+31610693335` | broodsmakelijk | Bij Maria's hoeve in Stompwijk tref je een melktap aan waar je ook met pin kan betalen. [icons: vending, milk, other dairy] — street matched on postcode only |
| Boerderij Landlust | Midden-Delfland *(Maasland)* | Oostaag 25a, 3155CE Maasland | [boerderij-landlust.nl](https://www.boerderij-landlust.nl)<br>`+31615828626`<br>`roel@boerderij-landlust.nl` | broodsmakelijk | Op boerderij Landlust houdt men koeien op een zo natuurlijk mogelijke manier houdt. Geen ingekuild gras maar hooi, worden de koeien niet onthoornd en is het voedsel niet genetisch gemanipuleerd. Daarnaast gebruikt men geen… — street matched on postcode only |
| Cooperatie de Kaasmeesters U.A | Midden-Delfland *(Schipluiden)* | Woudseweg 178, 2636 AW Schipluiden | — | BvBZ | — |
| Hoeve Bouwlust | Midden-Delfland *(Maasland)* | Oostgaag 31, Maasland | `peter@hoevebouwlust.nl` | BvBZ | — |
| Hoeve Rust-hoff | Midden-Delfland *(Maasland)* | Broekpolderweg 3, 3155EP Maasland | `+31648804279`<br>`info@hoeverusthoff.nl` | broodsmakelijk | Listed as zuivelboerderij in the province overview; product icons: organic, other dairy |
| ’t Zuivelstalletje | Molenlanden *(Oud-Alblas)* | Oosteinde 53B, 2969 AV Oud-Alblas | — | BvBZ + zoekdeboer | Small farm dairy outlet with cheese and zuivel; own production to confirm — also listed as *’t Zuivelstalletje* |
| Booij Kaasmakers | Molenlanden *(Streefkerk)* | Middenpolderweg 63, 2959 LB Streefkerk | [booijkaasmakers.nl/webshop/?fbclid=IwAR2r7ULLiZi0W2vdMz4oaKrYH3LVfLZm72xsx0Wa_V0GpbAiqIEwNwWUnU8](https://booijkaasmakers.nl/webshop/?fbclid=IwAR2r7ULLiZi0W2vdMz4oaKrYH3LVfLZm72xsx0Wa_V0GpbAiqIEwNwWUnU8)<br>`06-16383839`<br>`info@booijkaasmakers.nl` | BvBZ + OSM | — |
| Doolgelukkig | Molenlanden *(Langerak)* | Lekdijk 66, Langerak | [doolgelukkig.nl](https://doolgelukkig.nl/)<br>`06-49497032`<br>`info@doolgelukkig.nl` | BvBZ | — |
| Fa. Gebr. Korevaar | Molenlanden *(Brandwijk)* | Brandwijksedijk 10a, 2974 LB Brandwijk | `0184-641226`<br>`gkorevaar@hetnet.nl` | BvBZ | — |
| Gebr. van den Heuvel | Molenlanden *(Molenaarsgraaf)* | Graafdijk Oost 23, 2973 XB Molenaarsgraaf | `06-51221639`<br>`vandenheuvel-kaas@outlook.com` | BvBZ | — |
| Kaasboerderij De Vlag | Molenlanden *(Giessenburg)* | Hoefweg West 3, 3381 MA Giessenburg | [kaasvanboerslob.nl](https://www.kaasvanboerslob.nl/)<br>`0184-651268`<br>`info@kaasboerderijdevlag.nl` | BvBZ | — |
| Kaasboerderij Looijen | Molenlanden *(Hoornaar)* | Lage Giessen 18, 4223 SG Hoornaar | `06-55990528`<br>`willem.astrid.looijen@gmail.com` | BvBZ | — |
| Melkveebedrijf De Heihoeve | Molenlanden *(Giessenburg)* | Heideweg 17, 3381KH Giessenburg | `+31184653144`<br>`heihoevebv@gmail.com` | broodsmakelijk | Listed as zuivelboerderij in the province overview; product icons: other dairy |
| Melkveehouderij De Alblashoeve | Molenlanden *(Oud-Alblas)* | Oosteinde 21a, 2969AS Oud-Alblas | `+31622505825` | broodsmakelijk | De Alblashoeve is een melkveebedrijf en verkoopt de melk ook via een melktap die iedere dag open is behalve op zondag. [icons: organic, vending, milk] |
| Mts. C. van Gaalen en M.A.K. Inckmann van Gaalen | Molenlanden *(Noordeloos)* | Gorissenweg 1, 4225 ST Noordeloos | [kaasboerderij-noorderlicht.nl](http://www.kaasboerderij-noorderlicht.nl)<br>`0183-511379`<br>`info@kaasboerderij-noorderlicht.nl` | BvBZ + OSM | — |
| Mts. De Jong | Molenlanden *(Streefkerk)* | Middenpolderweg 19, Streefkerk | [maatschap-dejong.nl](https://www.maatschap-dejong.nl/)<br>`0187-683097`<br>`mts.dejong@outlook.com` | BvBZ | — |
| Rustpunt Kaasboerderij de Graafstroom | Molenlanden *(Bleskensgraaf ca)* | undefined, Bleskensgraaf ca | [kaasboerderijdegraafstroom.com](https://www.kaasboerderijdegraafstroom.com) | OSM | gemeente from nearest address, 11 m away |
| Van Kesteren | Molenlanden *(Molenaarsgraaf)* | Kweldamweg 8, 2973 LA Molenaarsgraaf | `06-49498040`<br>`kweldamhoeve@hotmail.com` | BvBZ | — |
| De Landkruidenier | Nieuwkoop *(Zevenhoven)* | Nieuwveenseweg 102A, 2435NW Zevenhoven | [delandkruidenier.nl](https://delandkruidenier.nl/)<br>`+31 172 255 557`<br>`info@jannieuwenhuizen.com` | OSM | OSM tags `shop=farm`, produce: cheese, dairy, meat, vegetables, fruit, juices, bread, delicacies |
| Kaasboerderij De Vosseburch | Nieuwkoop *(Ter Aar)* | Langeraarseweg 160, 2461 CN Ter Aar | [vosseburch.com](http://www.vosseburch.com)<br>`06-40365533`<br>`kaasboerderij@vosseburch.com` | BvBZ + OSM | — |
| Zuivelboerderij Kelder | Nieuwkoop *(Ter Aar)* | Ringdijk 14A, 2461BZ Ter Aar | `maud_van_velzen@hotmail.com` | OSM | — |
| Het Zuivelmeisje | Nissewaard *(Hekelingen)* | Riethilseweg 1, Hekelingen | [hetzuivelmeisje.nl](https://www.hetzuivelmeisje.nl/)<br>`hetzuivelmeisje@hotmail.com` | BvBZ | — |
| Melkveebedrijf van Leeuwen | Nissewaard *(Heenvliet)* | Drieendijk 15, 3218 LB Heenvliet | — | zoekdeboer | Dairy farm with milk tap and cheese vending in Voorne-Putten; own production to confirm — street matched on postcode only |
| Melkveehouderij Eikelenboom | Nissewaard *(Abbenbroek)* | Katerwaalsedijk 13, 3216 LE Abbenbroek | [melkveehouderijeikelenboom.com](http://www.melkveehouderijeikelenboom.com)<br>`melkveehouderijeikelenboom@gmail.com` | BvBZ | — |
| Floating Farm | Rotterdam | Gustoweg 2, 3029 AS Rotterdam | — | BvBZ | — |
| Boerderij Boterhuys | Teylingen *(Warmond)* | Zijldijk 7, 2362 AE Warmond | [boerderijboterhuys.nl](http://www.boerderijboterhuys.nl)<br>`06-38385894`<br>`info@boerderijboterhuys.nl` | BvBZ | — |
| Sophiahoeve | Teylingen *(Warmond)* | Wasbeeklaan 7, 2361 HG Warmond | [desophiahoeve.nl](http://www.desophiahoeve.nl)<br>`06-16583336`<br>`sophiahoeve@hetnet.nl` | BvBZ | — |
| Sweylanthoeve | Teylingen *(Warmond)* | Sweilandpolder 9, 2362 AG Warmond | [boerderijdeeenzaamheid.nl](http://www.boerderijdeeenzaamheid.nl)<br>`06-13386755`<br>`jvseenzaamheid@hotmail.com` | BvBZ + OSM | — |
| Boer en Goed | Zoeterwoude | Groene Hartplein 4, 2381 GS Zoeterwoude | [boerengoed.com](http://www.boerengoed.com)<br>`071-3016253`<br>`info@boerengoed.com` | BvBZ | — |
| Boerderij ’t Geertje | Zoeterwoude | Geerweg 7, 2381 LT Zoeterwoude | [hetgeertje.nl](https://hetgeertje.nl/)<br>`071-5802642`<br>`boerderij@hetgeertje.nl` | BvBZ + OSM + broodsmakelijk | BvBZ member. Hoewel 't Geertje formeel in Zoeterwoude ligt, zullen de inwoners van Zoetermeer dit zo niet ervaren. Aan de rand van "hun Noord Aa", een groot waterrecreatiegebied inclusief strand, ligt "hun Geertje". Het… — also listed as *Boerderij 't Geertje* |
| Kaasboerderij de Jong | Zoeterwoude | Westeindseweg 20, 2381 EC Zoeterwoude | [kaasboerderijdejong.nl/home](https://kaasboerderijdejong.nl/home)<br>`06-14323421`<br>`info@kaasboerderijdejong.nl` | BvBZ + OSM | — |
| Zuivelboerderij Leidse Kaas Koe | Zoeterwoude | Weipoortseweg 73, 2381NG Zoeterwoude | `+31715802771`<br>`info@deleidsekaaskoe.nl` | broodsmakelijk | Zuivelboerderij De Leidse Kaas Koe heeft ongeveer 100 koeien en maakt daar, in eigen kaasmakerij, zelf onder andere Leidse kaas maar ook 30+ kazen van. [icons: boerenkaas, other dairy, eggs, jam, juice] |
| Kaasbest Zwijndrecht BV | Zwijndrecht | Hof van Holland 5, 3332 EH Zwijndrecht | — | BvBZ | — |

## Barrido de productores de pescado y acuicultura (2026-08-14)

Revisión individual del 2026-08-14. Los casos resueltos se trasladaron al CSV o a evidencia de exclusión; quedan abiertos únicamente los siguientes candidatos por falta de una prueba suficiente y actual.

| Candidato | Municipio propuesto | Motivo de retención | Fuente inicial |
|---|---|---|---|
| Palingrokerij Van Veen | Kaag en Braassem *(Roelofarendsveen)* | The proposed domain does not resolve and no sufficiently current source established an active own smokehouse offer. | [web](https://palingrokerijvanveen.nl/) |
| Boschypaling | Katwijk | No current first-party or authoritative source was found that establishes an active own smokehouse offer. | — |
