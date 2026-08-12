# Candidatos — Noord-Holland

Revisión individual del 2026-08-09. La nota anunciaba 20 operadores, pero contenía 18 filas reales. Resultado: 3 productores confirmados y publicados, 8 descartados —principalmente viveros, semillas y flor— y 7 siguen abiertos. Las decisiones cerradas constan en `data/evidence/nl/west-nederland/noord-holland.jsonl`.

## Pendientes de evidencia suficiente

| Nombre declarado | Dirección certificada | Motivo para mantenerlo abierto | Certificado |
|---|---|---|---|
| A. de Haan | Rondehoep West 43, Ouderkerk aan de Amstel | Se confirma una lechería ecológica, pero no una oferta pública actual de leche u otro producto propio. | [NL-BIO-01.528-0002762.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002762.2025.001.pdf) |
| A. de Waart / ikwilversemelk.nl | Poppendammergouw 28, Amsterdam | El registro sigue activo y declara venta de lácteos locales, pero el dominio ya no resuelve y una comunicación reciente alude a la nave vacía; falta confirmar si la producción y venta continúan. | [NL-BIO-01.528-0003920.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0003920.2026.001.pdf) |
| A. en A. Hoeve | Zunderdorpergouw 29, Amsterdam | Consta como explotación lechera, sin una identidad comercial ni producto propio verificable en el mercado. | [NL-BIO-01.528-0003824.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0003824.2026.001.pdf) |
| Al Natuurlijk / Noordhollandshof | Oudelandsdijk 11a, Spijkerboor | El certificado confirma vegetales, pero no se localizó una marca pública, cultivos concretos ni canal comercial. | [NL-BIO-01.528-0005192.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005192.2026.001.pdf) |
| biologisch agrarisch natuurbeheer bedrijf e.t. klok | Oud-Raeffeldamweg 6, Hobrede | La identidad pública enfatiza gestión agraria de naturaleza; falta una oferta alimentaria propia concreta. | [NL-BIO-01.528-0002775.2026.005](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002775.2026.005.pdf) |
| boekhorstagri | Groetpolderweg 35, Winkel | Las fuentes empresariales describen cría avícola, mientras el certificado retenido declara vegetales; falta resolver el producto alimentario y su salida al mercado. | [NL-BIO-01.528-0000455.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0000455.2026.001.pdf) |
| Boerderij Amstelland | Binnenweg 5, Ouderkerk aan de Amstel | La dirección se vincula hoy con Boerderij Over-Amstel y actividades de restauración; no se pudo atribuir una oferta concreta a la explotación certificada. | [NL-BIO-01.528-0005438.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005438.2026.001.pdf) |

## Cheese and farm-dairy sweep (2026-08-12)

Target: `data/csv/nl/west-nederland/noord-holland.csv`, category `Lácteos y quesos`.
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
| Geitenboerderij Ridammerhoeve | Amstelveen | Nieuwe meerlaan 4, 1182 DB Amstelveen | [geitenboerderij.nl](http://www.geitenboerderij.nl)<br>`020-4532043`<br>`willem@geitenboerderij.nl` | BvBZ | — |
| Kaasboerderij en klompenmakerij Clara Maria | Amstelveen | Bovenkerkerweg 106, 1188XH Amstelveen | `+31297582279`<br>`info@claramaria.nl` | broodsmakelijk | Listed as kaasboerderij in the province overview; product icons: boerenkaas |
| Biologisch melkveebedrijf Disseldorp | Amsterdam | Broekergouw 5, 1027AH Amsterdam | [gouwzicht.nl/melktap](https://www.gouwzicht.nl/melktap)<br>`+31657335831` | broodsmakelijk | Biologisch melkveebedrijf van Disseldorp houdt koeien en verkoopt de melk onder andere via een melktapautomaat die iedere dag open is. De automaat bevindt zich rechts van het bijgebouw naast de boerderij. [icons: organic,… — street matched on postcode only |
| De Groene Griffioen | Amsterdam *(Weesp)* | Lange Muiderweg 18a, 1382 LA Weesp | [degroenegriffioen.nl](http://www.degroenegriffioen.nl)<br>`06-42164533`<br>`info@degroenegriffioen.nl` | BvBZ | — |
| Geitenhouderij Ons Verlangen | Amsterdam | Liergouw 68b, 1026BW Amsterdam | — | broodsmakelijk | Listed as zuivelboerderij in the province overview; product icons: vending, boerenkaas, milk, other dairy, eggs, jam |
| Zorgboerderij Ons Verlangen | Amsterdam | Broekergouw 8b, 1027AH Amsterdam | `winkel@zorgboerderijamsterdam.com` | broodsmakelijk | Listed as kaasboerderij in the province overview; product icons: organic, boerenkaas, milk, other dairy, eggs, jam, juice |
| De Bergense MelkSalon | Bergen (NH) | Baakmeerdijk 15, 1862 PZ Bergen (NH) | — | zoekdeboer | Vending point with self-made dairy; the cheese on sale is Beemster — confirm own cheese |
| De Noorderhoeve | Bergen (NH) *(Schoorl)* | Duinweg 125, 1871 AH Schoorl | [noorderhoeve.nl](http://www.noorderhoeve.nl)<br>`072-5091738`<br>`secretariaat@noorderhoeve.nl` | BvBZ | — |
| Heerlijkvandeboer | Drechterland *(Schellinkhout)* | Dorpsweg 52, 1697 KC Schellinkhout | — | zoekdeboer | Small dairy farm with shop selling cheese and farm ice cream; own production to confirm |
| Kaasboerderij Simonehoeve | Edam-Volendam *(Volendam)* | undefined, Volendam | [simonehoeve.com/nl/camperplaatsen](https://simonehoeve.com/nl/camperplaatsen/)<br>`+31 299365828`<br>`info@simonehoeve.com` | OSM | gemeente from nearest address, 87 m away |
| Biologische geitenboerderij Van Dorp | Haarlemmermeer *(Weteringbrug)* | Huigsloterdijk 65, 2156 LG Weteringbrug | [vandorpgeitenkaas.nl](http://www.vandorpgeitenkaas.nl)<br>`06-12792019`<br>`info@vandorpgeitenkaas.nl` | BvBZ + OSM | — |
| De Landyn | Haarlemmermeer *(Zwaanshoek)* | Spieringweg 1228, 2136LR Zwaanshoek | [delandyn.nl](https://www.delandyn.nl/)<br>`+31 252 522 142`<br>`info@delandyn.nl` | OSM | OSM tags `shop=farm`, produce: meat,cheese,dairy,vegetables,herbs,fruit,wine,bread,nuts,jam,honey |
| de Versboerderij de Volharding | Haarlemmermeer *(Hoofddorp)* | Hoofdweg 516, 2132MH Hoofddorp | [deversboerderij.nl](http://deversboerderij.nl)<br>`+31 23 561 6268`<br>`info@deversboerderij.nl` | OSM | OSM tags `shop=farm`, produce: cheese,potatoes,vegetables,legumes,mushrooms,fruit,juices,eggs,wine |
| Zuivelboerderij van Wees | Haarlemmermeer *(Nieuw-Vennep)* | Rijnlanderweg 1166, 2153 KC Nieuw-Vennep | [vanweeskaas.nl](http://www.vanweeskaas.nl)<br>`+31 252 673 924`<br>`info@vanweeskaas.nl` | BvBZ + OSM | — |
| Kaasboerderij Noordhoek | Hollands Kroon *(Middenmeer)* | Alkmaarseweg 13, 1775 PP Middenmeer | `0227-503388`<br>`jf.van.diemen@gmail.com` | BvBZ | — |
| J en R Verdegaal | Koggenland *(Oudendijk)* | Dorpsweg 68, 1631 DH Oudendijk | — | BvBZ | — |
| Zuivelinnen | Koggenland *(Zuidermeer)* | Baarsdorpermeer 32, 1652 CX Zuidermeer | [zuivelinnen.nl](http://www.zuivelinnen.nl)<br>`06-42198603`<br>`info@zuivelinnen.nl` | BvBZ | — |
| Novelle Kaas | Opmeer *(De Weere)* | Driestedenweg 50A, 1662 BG De Weere | [novellekaas.nl](https://novellekaas.nl/)<br>`06-12671092`<br>`info@novellekaas.nl` | BvBZ | — |
| VOF Uitentuis | Purmerend *(Middenbeemster)* | Middenweg 93, 1462 HE Middenbeemster | `029-9681584`<br>`juitentuis@hotmail.com` | BvBZ | — |
| Boerderij De Buitenplaats | Schagen *(Sint Maarten)* | Surmerhuizerweg 10, 1744JC Sint Maarten | [loeigoeiezuivel.nl](http://loeigoeiezuivel.nl)<br>`+31226395734`<br>`onzekoeiengeven@loeigoeiezuivel.nl` | broodsmakelijk | Boerderij de Buitenplaats is een biologisch-dynamisch veeteelt bedrijf. De zuivelproducten die men maakt worden in een winkeltje verkocht. Tevens heeft men een kleine camping. [icons: organic, milk, other dairy] |
| Kaasboerderij De Duinen | Texel *(De Cocksdorp)* | Vuurtorenweg 107, 1795 LL De Cocksdorp | [boerderijdeduinen.nl](http://boerderijdeduinen.nl)<br>`0222-316048`<br>`dboon01@hetnet.nl` | BvBZ | — |
| Novalishoeve | Texel *(Den Hoorn)* | Hoornderweg 46, 1797 RA Den Hoorn | [novalishoeve.nl](http://www.novalishoeve.nl)<br>`0222-319482`<br>`info@novalishoeve.nl` | BvBZ | — |
| Schapenbedrijf De Waddel | Texel *(Den Burg)* | Westergeest 4, 1791 LJ Den Burg | — | zoekdeboer | Milks part of a 400-ewe Texel flock and makes raw-milk sheep cheese |
| Zuivelboerderij Texel | Texel *(Oosterend)* | Schorrenweg 39, 1794 HE Oosterend | [zuivelboerderijtexel.nl](http://www.zuivelboerderijtexel.nl)<br>`06-11281227`<br>`corinerikkenberg@gmail.com` | BvBZ | — |
| Noord-Hollands Hof | Wormerland *(Spijkerboor)* | Oudelandsdijk 11, 1458PN Spijkerboor | — | zoekdeboer | Farm vending with kefir, raw milk and boerenkaas; own production to confirm |
