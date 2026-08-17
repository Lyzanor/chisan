# Candidatos — Limburg

Revisión individual del 2026-08-09 sobre los 20 operadores retenidos del directorio público TRACES NT. Resultado: 12 candidatos confirmados, materializados en 9 fichas nuevas porque las cuatro sociedades Biohof se consolidan bajo su marca y operación pública BioVerbeek; 3 descartados por corresponder a material de propagación, y 5 siguen abiertos. Las decisiones cerradas constan en `data/evidence/nl/zuid-nederland/nederlands-limburg.jsonl`.

## Pendientes de evidencia suficiente

| Nombre declarado | Woonplaats declarada | Dirección certificada | Motivo para mantenerlo abierto | Certificado |
|---|---|---|---|---|
| A.P.M. Linssen | Beegden | Eerdweg 4 6099 | El certificado respalda actividad ganadera, agrícola y de transformación, pero no se encontró una identidad comercial pública actual que atribuya alimentos concretos de esta explotación al mercado. | [NL-BIO-01.528-0002104.2026.002](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0002104.2026.002.pdf) |
| Bewust Biologisch Begrazen Zuid B.V. | Schimmert | De Kling 51 6333 | La presencia pública acredita ganado para pastoreo y gestión del paisaje, pero no una oferta vigente de carne u otro alimento propio. | [NL-BIO-01.528-0003956.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0003956.2026.001.pdf) |
| Biologisch Melkveebedrijf Ebbers | Ottersum | Aaldonksestraat 14 6595 | Consta como explotación ecológica de leche y vacuno, pero falta una fuente pública actual que identifique su producto concreto en el mercado. | [NL-BIO-01.528-0004098.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0004098.2026.001.pdf) |
| Biologische tuinderij Baeten | Sevenum | Steeghoek 12 5975 | El certificado confirma cultivo ecológico, pero no se localizó una marca, una gama concreta ni una vía pública de comercialización atribuible al productor. | [NL-BIO-01.528-0001390.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0001390.2026.001.pdf) |
| C.A.M.F. Mousset | Klimmen | Dolberg 12 6343 | Solo se ha confirmado el certificado de vegetales sin transformar; falta identidad pública, producto concreto y evidencia de salida al mercado. | [NL-BIO-01.528-0001245.2026.001](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/NL-BIO-01.528-0001245.2026.001.pdf) |

## Cheese and farm-dairy sweep (2026-08-12)

Target: `data/csv/nl/zuid-nederland/nederlands-limburg.csv`, category `Lácteos y quesos`.
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
| Mildershoof | Nederweert *(Nederweert-Eind)* | Banendijk 4, 6034 SV Nederweert-Eind | [mildershoof.nl](https://mildershoof.nl/)<br>`06-83248389`<br>`antonwijen@mildershoof.nl` | BvBZ | — |
| Zuivelboerderij Avezaat | Nederweert *(Leveroy)* | Houtsberg 23, 6091 NA Leveroy | [lokaalbezorgen.nl/nederweert-avezaat](https://lokaalbezorgen.nl/nederweert-avezaat)<br>`06-23302350`<br>`zuivelboerderijavezaat@hotmail.com` | BvBZ | — |
| Zorgboerderij Koe | Peel en Maas *(Meijel)* | Berg 6, 5768 PE Meijel | — | zoekdeboer | Care farm with milk tap and cheese; own production to confirm |
| Bergerhof Melkvee | Venlo *(Velden)* | Rijksweg 1, 5941 AA Velden | [bergerhofvelden.nl](http://www.bergerhofvelden.nl)<br>`06-25060711`<br>`info@bergerhofvelden.nl` | BvBZ | — |
| Zuivel van Nu | Venlo *(Velden)* | Schandelo 110, 5941 NH Velden | [zuivelvannu.nl](http://www.zuivelvannu.nl)<br>`06-48915994`<br>`Info@zuivelvannu.nl` | BvBZ | — |
| De Bokkesprong | Venray *(Veulen)* | Veulensewg 61, 5814 AB Veulen | [bokkesprong.com](http://www.bokkesprong.com)<br>`0478-583713`<br>`info@bokkesprong.com` | BvBZ | street matched on postcode only |

## Barrido de productores de cerveza (2026-08-13)

Búsqueda de cervecerías artesanales e independientes con planta de elaboración propia en Limburg. Las fuentes consultadas confirman la actividad productiva e instalaciones propias; quedan registradas como candidaturas en espera para la verificación completa de coordenadas, contacto y canales de venta directa antes de su publicación en el catálogo.

| Candidato | Señal / Actividad | Municipio | Contacto / Web / Instagram |
|---|---|---|---|

