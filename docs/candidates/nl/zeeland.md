# Candidatos — Zeeland

Revisión individual del 2026-08-09. La nota anunciaba 20 operadores, pero contenía 19 filas reales. Resultado: 10 productores confirmados y publicados y 9 siguen abiertos; no hubo exclusiones definitivas en este lote. Las decisiones cerradas constan en `data/evidence/nl/west-nederland/zeeland.jsonl`.

## Pendientes de evidencia suficiente

| Nombre declarado | Dirección certificada | Motivo para mantenerlo abierto | Certificado |
|---|---|---|---|
| 't Haverhof | 't Molentje 1, IJzendijke | Se confirma una explotación ecológica, pero no una identidad pública con cultivo alimentario concreto y oferta vigente. | [NL-BIO-01.528-0002761.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002761.2026.001.pdf) |
| Agribert | Jokweg 2A, Aardenburg | La empresa está activa y cultiva patata, raíces, cereal y legumbres, sin marca alimentaria ni salida al mercado pública concreta. | [NL-BIO-01.528-0000043.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0000043.2026.001.pdf) |
| Agro V&P VOF | Hondegatweg 1, Biervliet | El certificado prueba producción vegetal y ganadera, pero no se localizó identidad comercial, alimento concreto ni canal de mercado. | [NL-BIO-01.528-0003394.2026.002](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0003394.2026.002.pdf) |
| ANROM B.V. | Terlucht 11, 's-Heer Arendskerke | Se confirma el cultivo activo de manzanas, peras y fruta de hueso, pero no una marca u oferta pública actual. | [NL-BIO-01.528-0001147.2026.002](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0001147.2026.002.pdf) |
| B. en A. van den Bulck v.o.f. | Plevierstraat 5A, Hengstdijk | Los registros prueban cultivos de cereal, legumbres, oleaginosas y tubérculos, sin producto comercial concreto atribuible a la explotación. | [NL-BIO-01.528-0001574.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0001574.2026.001.pdf) |
| BioSmidt | Vierhonderdpolderdijk 8, Cadzand | Solo se pudo sostener la producción vegetal ecológica del certificado; falta identidad pública, cultivo concreto y oferta. | [NL-BIO-01.528-0005930.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005930.2025.001.pdf) |
| Boonman V.O.F. | Van der Maelstedeweg 104, Hulst | Un registro actual muestra cultivos y detalle alimentario, pero los perfiles públicos del establecimiento anterior figuran cerrados; falta confirmar la identidad comercial vigente. | [NL-BIO-01.528-0006173.2025.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0006173.2025.001.pdf) |
| Buitengewoon Kip en Ei B.V. | Terneuzensestraat 71, Zaamslag | La sociedad avícola está activa, pero no aparece una marca de huevos ni un canal de mercado público atribuible a ella. | [NL-BIO-01.528-0006301.2025.002](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0006301.2025.002.pdf) |
| C.M. de Koster-van den Bosch B.V. | Pieter de Hoochlaan 12, Yerseke | Consta como titular del buque mejillonero YE 069, pero la dirección certificada es residencial y no se localizó una identidad de producto o venta pública propia. | [NL-BIO-01.528-0005828.2026.002](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0005828.2026.002.pdf) |

## Cheese and farm-dairy sweep (2026-08-12)

Target: `data/csv/nl/west-nederland/zeeland.csv`, category `Lácteos y quesos`.
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
| Arne’s kaasboerderij | Middelburg *(Arnemuiden)* | Derringmoerweg 4, 4341 PP Arnemuiden | `06-30926779`<br>`Walhout16@gmail.com` | BvBZ | — |
| Melkveebedrijf van den Hout | Sluis *(Nieuwvliet)* | Sint Bavodijk 53, 4504AB Nieuwvliet | `+31117371490` | broodsmakelijk | De familie van den Hout heeft een veeteeltbedrijf met circa tweehonderd koeien. Van de melk maakt men diverse zuivelproducten die men in het winkeltje verkoopt. [icons: vending, milk, other dairy] |
| Zuivelboerderij Hoogelande | Veere *(Grijpskerke)* | Hogelandseweg 4, 4364 SB Grijpskerke | [hogelandseboerenzuivel.nl](http://www.hogelandseboerenzuivel.nl)<br>`06-10572293`<br>`lejo.vanee@kpnplanet.nl` | BvBZ | — |
