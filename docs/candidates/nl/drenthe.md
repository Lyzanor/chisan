# Candidatos — Drenthe

Segunda revisión individual cerrada el 2026-08-09 sobre los 18 operadores retenidos. Se confirmaron seis: cuatro se publicaron como nuevas filas y dos coincidían con filas existentes, que quedaron enriquecidas. Arnicakwekerij y Bloem en Oogst se descartaron por dedicarse a plantas medicinales, ornamentales o flores sin oferta alimentaria acreditada. Permanecen diez en espera.

| Candidato retenido | Estado | Motivo y fuente revisada |
|---|---|---|
| 't Makke Schaap | En espera | El certificado y una noticia sectorial confirman la cría ovina, pero no se encontró una oferta pública actual del productor. |
| A. Spijkerman | En espera | La explotación lechera sigue activa, pero las fuentes actuales apuntan a otra denominación o dirección y no a una oferta pública identificable en Oosterbutenweg 1. |
| A.T. Middelveld / ATM Dienstverlening | En espera | Solo se localizó el registro empresarial de una explotación lechera, sin marca ni canal público del productor. |
| Agrarisch loonbedrijf B. Korten | En espera | Figura como contratista agrario y explotación lechera, pero no se acreditó venta alimentaria propia al público. |
| Arend Otten Landbouw VOF | En espera | El certificado prueba cultivo ecológico, pero no apareció una identidad pública ni oferta actual verificable. |
| B.K. Kwekerijen B.V. | En espera | El certificado prueba producción vegetal, pero no permite identificar el alimento concreto ni una oferta pública actual. |
| Bala's Eco Tuin | En espera | No se encontró una presencia pública independiente que confirmara actividad, productos y venta actuales. |
| Beheerboerderijen Het Drentse Landschap B.V. | En espera | Las tres explotaciones ecológicas y su ganado están activos, pero no se localizó una oferta pública atribuible a la unidad de Rabbinge 7. |
| Bio Bijl | En espera | El certificado sigue vigente, pero el registro histórico consultado marca disuelta una entidad relacionada y no hay presencia pública que resuelva la identidad actual. |
| Biopoort B.V. | En espera | El certificado confirma producción vegetal, pero no se halló marca, producto concreto ni canal público actual. |

## Cheese and farm-dairy sweep (2026-08-12)

Target: `data/csv/nl/noord-nederland/drenthe.csv`, category `Lácteos y quesos`.
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
| Bed & Breakfast Kaasmakerij Karwij | Aa en Hunze *(Rolde)* | Hunebedweg 4, 9451AP Rolde | [benbkaasmakerijrolde.jouwweb.nl](https://benbkaasmakerijrolde.jouwweb.nl/) | OSM | — |
| Biologische geitenhouderij en kaasmakerij de Kruidenwei | Aa en Hunze *(Nooitgedacht)* | Veldweg 8, 9449PW Nooitgedacht | [dekruidenwei.nl](https://www.dekruidenwei.nl)<br>`+31592248387` | broodsmakelijk | De Kruidenwei is een biologische (EKO) geitenhouderij en kaasmakerij. Ze is vooral bekend van de blauwschimmelkaas Lady's Blue die vele prijzen won. [icons: organic, boerenkaas, other dairy, meat] |
| De Zuivelmand | Assen | Rondgang 107, 9408 MC Assen | [dezuivelmand.nl](http://www.dezuivelmand.nl/)<br>`06-41704260`<br>`info@dezuivelmand.nl` | BvBZ | street matched on postcode only |
| Mts. Eising Hilbrands | Coevorden *(Sleen)* | Schaapstreek 46, 7841 BS Sleen | — | BvBZ | — |
| De Wolle Sik | De Wolden *(Linde)* | Linderweg 38, 7925 PC Linde | — | zoekdeboer | Small goat and sheep holding making artisan cheese from own milk |
| Flinkert Boerenkaas | De Wolden *(Zuidwolde)* | Drogtzee 2, 7921 RD Zuidwolde | [flinkertboerenkaas.nl](https://flinkertboerenkaas.nl/)<br>`06-11413642`<br>`info@flinkertboerenkaas.nl` | BvBZ | — |
| Woldzuivel | De Wolden *(Ruinerwold)* | Dokter Larijweg 50, 7961 NM Ruinerwold | [woldzuivel.nl](https://woldzuivel.nl/)<br>`06-46663370`<br>`info@woldzuivel.nl` | BvBZ | — |
| Biologische geitenhouderij Broeklander | Meppel *(Broekhuizen)* | Broekhuizen 22, 7965AB Broekhuizen | [broeklander.nl](http://www.broeklander.nl)<br>`+31627495638 of +31522445142` | broodsmakelijk | Geitenhouderij Broeklander werkt geheel biologisch. Men verkoopt niet alleen de geitenmelk maar maakt ook zelf geitenkaas. Men verkoopt ook geitenlamsvlees van eigen geiten. Wil je geitenmelk kopen? Neem dan zelf een fles mee.… |
| Geitenboerderij Hansketien | Midden-Drenthe *(Mantinge)* | Steendervalsweg 37, 9436PL Mantinge | [hansketien.nl](http://www.hansketien.nl)<br>`+31645659216`<br>`info@hansketien.nl` | broodsmakelijk | Geitenboerderij Hansketien is een geitenboerderij op basis van de principes van biologisch-dynamische landbouw. Een uitgangspunt hierbij is het zoveel mogelijk rekening te houden met het diereigen gedrag. [icons: boerenkaas, meat] |
| Kaaslust | Noordenveld *(Veenhuizen)* | Hoofdweg 138, 9341 BL Veenhuizen | [kaaslust.nl](https://kaaslust.nl) | zoekdeboer | Artisan cheese dairy in the restored Veenhuizen creamery, local weidemelk |

## Barrido de productores de cerveza (2026-08-13)

Búsqueda de cervecerías artesanales e independientes con planta de elaboración propia en Drenthe. Las fuentes consultadas confirman la actividad productiva e instalaciones propias; quedan registradas como candidaturas en espera para la verificación completa de coordenadas, contacto y canales de venta directa antes de su publicación en el catálogo.

| Candidato | Señal / Actividad | Municipio | Contacto / Web / Instagram |
|---|---|---|---|

