# Huesca — candidate holds

- Target CSV: `data/csv/es/aragon/huesca.csv`

## Batch — DOP Somontano winery directory

- Discovery source: current DOP Somontano winery directory, reached through the MAPA and eAmbrosia geographical-indication registers.
- Search date: 2026-08-26.
- Scope: 8 unresolved holds after current-source admission review and reconciliation against the area CSV.
- Source ceiling: council listing supports current registration, wine activity, address and telephone, but does not by itself prove a current public own offer or resolve the municipality for every locality.

| nombre | municipality / geographic clue | probable category / output | discovery | remaining work |
|---|---|---|---|---|
| Leo&Niné Wines | Castillazuelo | `Vino` — DOP Somontano wines | [DOP Somontano wineries](https://dosomontano.com/listado-bodegas/) | Confirm the productive unit, current own wines, first-party website and public offer. |
| Chesa | Barbastro | `Vino` — DOP Somontano wines | [DOP Somontano wineries](https://dosomontano.com/listado-bodegas/) | Resolve the durable producer/legal identity and confirm current own wines and first-party offer. |
| Lasierra | Bespén; exact municipality to confirm | `Vino` — DOP Somontano wines | [DOP Somontano wineries](https://dosomontano.com/listado-bodegas/) | Confirm the municipality, productive unit, current own wines and first-party identity. |
| Mipanas | El Grado | `Vino` — DOP Somontano wines | [DOP Somontano wineries](https://dosomontano.com/listado-bodegas/) | Confirm current activity, own wines, first-party website and whether the listed address is productive. |
| Monte Odina | Ilche | `Vino` — DOP Somontano wines | [DOP Somontano wineries](https://dosomontano.com/listado-bodegas/) | Confirm current own offer and reconcile the estate, brand and legal operator identities. |
| Abinasa | Lascellas; exact municipality to confirm | `Vino` — DOP Somontano wines | [DOP Somontano wineries](https://dosomontano.com/listado-bodegas/) | Confirm the municipality, current own wines, first-party identity and whether this is distinct from other listed wineries. |
| Dalcamp | Enate; exact municipality to confirm | `Vino` — DOP Somontano wines | [DOP Somontano wineries](https://dosomontano.com/listado-bodegas/) | Confirm the municipality, producer identity and current own offer; distinguish it from other wineries at the same address. |
| Osca | Ponzano; exact municipality to confirm | `Vino` — DOP Somontano wines | [DOP Somontano wineries](https://dosomontano.com/listado-bodegas/) | Confirm the municipality, current own wines, first-party website and productive-unit identity. |

Verify current first-party activity and offers, canonical municipalities and legal/brand identities before admission. The other twenty wineries in the directory, including Bal d'Isábena, matched existing Huesca rows.

## Batch — Huesca Alimentaria member directory

- Discovery source: member directory of Huesca Alimentaria, the provincial agri-food producers' association based in Monzón.
- Search date: 2026-09-01.
- Scope: the full published member list (63 entries) reconciled against the area CSV, the Somontano holds above and the area evidence tombstones; 2 unresolved leads remain after Level 2 review.
- Source ceiling: association membership supports the public identity, product line and contact details the association publishes. It does not by itself prove a current own offer, the productive municipality, or that the member is a producer rather than a cooperative service, retailer or hospitality business.

| nombre | municipality / geographic clue | probable category / output | discovery | remaining work |
|---|---|---|---|---|
| Cooperativa del Campo San Lorenzo | Estadilla | `Aceite` — olive oil | [Huesca Alimentaria members](http://www.huescaalimentaria.com/asociados/); [cooperativaestadilla.es](https://www.cooperativaestadilla.es/) | Material doubt: the published activity is dominated by grain collection, drying and an agricultural store. Confirm whether it mills and sells oil under its own producer identity before treating it as a qualifying unit. |
| Pastelería Canela | Monzón | `Dulces y repostería` — pastry from its own obrador | [Huesca Alimentaria members](http://www.huescaalimentaria.com/asociados/); [cateringcanela.com](https://www.cateringcanela.com/) | Material doubt: the business presents itself as a restaurant and event caterer. Confirm a distinct, durable producer identity and a materially produced take-home offer before treating it as anything other than hospitality. |

The other 54 members reconciled: 51 matched published Huesca rows, "Miel del Pirineo" resolved to the published OZ Miel Artesanal del Pirineo row in Yéqueda, "Avi Selection" matched an existing `purge` tombstone, and "Montse Sáez Jiménez" was discarded as not locatable, with no municipality, website or product line published in this pass.

## Proveedores.com directory sweep — 2026-09-02

- Discovery source: <https://www.proveedores.com/alimentacion-y-bebidas/huesca>, a B2B supplier directory whose listings are written by the companies themselves.
- Search date: 2026-09-02.
- Scope: 33 open Level 1 leads, after de-duplication against the current area CSV by official domain, name and municipality.
- Cutoff: the directory listing as published on 2026-09-02. No first-party source, sanitary register or denomination council was consulted in this pass.
- Source ceiling: this directory supports identity, contact and a location clue only. It does not establish producer activity, a current own offer, online sales or the productive municipality.

| nombre | municipio / geographic clue | probable category / output | reason it may qualify | discovery | official | remaining work |
|---|---|---|---|---|---|---|
| Costean Microgreens | Hoz y Costean | `Fruta y verdura` | The directory states: “Cultivo propio de microbrotes frescos para restaurantes” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm an own offer that stays attributable to this producer through sale. |
| Ordesano | Broto | `Destilados y licores` | The directory states: “Fabricante de licores, infusiones y ginebra premium en el Pirineo” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm an own-brand offer rather than contract manufacturing for third parties. |
| Frutas Visa | Fraga | `Fruta y verdura` | The directory states: “Negocio familiar de producción y comercialización de fruta desde 1969” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Separate the own productive activity from the trading arm before placing the row. |
| Seelen Artesana | Vencillón | `Cerveza` | The directory states: “Fabricación de cerveza artesanal en Vencillón” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm the productive workshop and that it is currently active. |
| Panadería Menal | Fraga | `Pan y cereal` | The directory states: “Elaboración de pan, bollería y pastelería en Fraga” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm the productive workshop and that it is currently active. |
| Repostería Porta | Abiego | `Dulces y repostería` | The directory states: “Elabora bollería y pastelería típicas del Somontano” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm the productive workshop and that it is currently active. |
| Excelsiorfruit | Fraga | `Fruta y verdura` | The directory states: “Producción y manipulación de fruta dulce en el Bajo Cinca” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm own cultivation on an identifiable holding rather than buying to resell. |
| Jamones Alto Aragón | El Grado | `Carne` | The directory states: “Elaboración de jamones con varios centros productivos propios” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm the productive unit in the stated municipality and an own offer attributable through sale. |
| Harineras Villamayor | Plasencia del Monte | `Pan y cereal` | The directory states: “Fabricación y comercialización de harina” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Resolve the productive municipality; the address the directory gives does not settle it. |
| Finca La Noguera (ClaraNuts) | Belver de Cinca | `Frutos secos` | The directory states: “Cultiva nueces en finca propia y las comercializa” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Reconcile the identities the listing gives and choose the durable public name before creating a row. |
| Panadería Casado | Velilla de Cinca | `Pan y cereal` | The directory states: “Horno tradicional de pan artesanal de masa madre” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm current activity from a first-party source. |
| Conservas Pozán de Vero | Pozán de Vero | `Conservas` | The directory states: “Conservas vegetales elaboradas en Pozán de Vero” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm the cannery and that it is currently active. |
| Cervezas La Litera | Tamarite de Litera | `Cerveza` | The directory states: “Obrador de cerveza artesana de La Litera con origen en 2010” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) | <https://hugos.es> | Reconcile the identities the listing gives and choose the durable public name before creating a row. |
| Almendras Castillo de Loarre | Loarre | `Frutos secos` | The directory states: “Tostadero de almendra con marca propia” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Resolve the productive municipality; the address the directory gives does not settle it. |
| República Monegria | Tardienta | `Cerveza` | The directory states: “Fábrica familiar de cerveza artesana en los Monegros desde 2011” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm the productive workshop and that it is currently active. |
| Grupo Regany | Binéfar | `Pan y cereal` | The directory states: “Cincuenta años elaborando y comercializando harinas” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | The listing declares trade: confirm an own productive step before treating it as a producer. |
| Arvipirineos | Sabiñánigo | `Huevos` | The directory states: “Avicultura ecológica y venta de huevo ecológico” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm the farm behind the declared output. |
| Tomate Rosa Barbastro | Barbastro | `Fruta y verdura` | The directory states: “Productores de tomate rosa de Barbastro, producto muy ligado al lugar” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm own cultivation on an identifiable holding rather than buying to resell. |
| Fresmansa | Fraga | `Fruta y verdura` | The directory states: “Empresa familiar de producción y comercialización de fruta” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Separate the own productive activity from the trading arm before placing the row. |
| Ibereco | Monzón | `Fruta y verdura` | The directory states: “Produce y comercializa vegetales y frutas biológicos” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm own cultivation on an identifiable holding rather than buying to resell. |
| Pirenáica del Jamón | Barbastro | `Carne` | The directory states: “Elaboración y comercialización de jamón desde 1950” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm an own curing house and current activity. |
| Harinera de Tardienta | Tardienta | `Pan y cereal` | The directory states: “Elaboración de harinas y derivados desde 1954” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm an own mill. |
| Pastelería Ortiz | Huesca | `Dulces y repostería` | The directory states: “Obrador de pastelería que conjuga tradición y modernidad” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm the productive workshop and that it is currently active. |
| Oscapan | Huesca | `Pan y cereal` | The directory states: “Fabricación, venta y distribución de pan” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm the productive workshop and that it is currently active. |
| Acosga (Resalau) | Salas Altas | `Aceite` | The directory states: “Comercializa un AOVE de olivos centenarios de variedades locales” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) | <https://resalau.com> | Reconcile the identities the listing gives and choose the durable public name before creating a row. |
| Agropecuaria Santas Masas | Castigaleu | `Carne` | The directory states: “Importación y exportación de carne de vacuno” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm own cultivation on an identifiable holding rather than buying to resell. |
| Fribin | Binéfar | `Carne` | The directory states: “Comercialización mayorista de carne de cerdo y vacuno” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm the productive unit in the stated municipality and an own offer attributable through sale. |
| Semillas Monzón | Monzón | `Legumbres y cereales` | The directory states: “Productores de semillas en Monzón” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm own cultivation on an identifiable holding rather than buying to resell. |
| Fortea Ceras y Mieles | Barbastro | `Miel` | The directory states: “Distribución de miel y trabajo de ceras” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm an own apiary behind the honey sold. |
| Gradoli | Barbastro | `Otros` | The directory states: “Ficha genérica de "proveedores de alimentos" sin producto identificado” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Confirm the productive unit in the stated municipality and an own offer attributable through sale. |
| Aguas Vilas del Turbón | Huesca | `Bebidas sin alcohol` | The directory states: “Envasado y distribución de agua mineral natural del Turbón” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Resolve the productive municipality; the address the directory gives does not settle it. |
| Casas Royes | Fraga | `Fruta y verdura` | The directory states: “Sesenta años como proveedores de fruta y hortaliza” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | The listing declares trade: confirm an own productive step before treating it as a producer. |
| Barón de Villacampa | Huesca | `Vino` | The directory states: “Elabora y distribuye vinos con denominación de La Rioja” | [Directory](https://www.proveedores.com/alimentacion-y-bebidas/huesca) |  | Resolve the productive municipality; the address the directory gives does not settle it. |

## Concurso de Quesos de Otoño de Biescas — 2026-09-03

- Discovery source: Concurso de Quesos de Otoño de la Feria de Otoño de Biescas (<https://www.biescas.es>).
- Search date: 2026-09-03.
- Scope: 3 unresolved Level 1 leads in Huesca, after de-duplication against the current area CSV, candidate backlog and closed evidence.
- Cutoff: published agricultural fair records and first-party pages available on 2026-09-03.
- Source ceiling: fair records establish competition participation, category and holding origin; they do not by themselves prove full catalog admission or autonomous physical workshop.

| name | municipality / geographic clue | probable category / output | reason it may qualify | discovery | official | remaining work |
|---|---|---|---|---|---|---|
| Quesos de Guara | Bierge (Lasbellas) | `Lácteos y quesos` — Sierra de Guara artisan goat cheese | Traditional craft dairy in Lasbellas (Bierge, Parque Natural de la Sierra y Cañones de Guara) processing goat milk; finalist at Biescas Autumn Fair. | [Feria de Biescas](https://www.biescas.es) | <https://quesosdeguara.com/> | Confirm dedicated dairy workshop address in Bierge, milk source and commercial retail channels. |
| Quesería Benabarre | Benabarre | `Lácteos y quesos` — Ribagorza artisan goat cheese | Family goat holding and farmstead dairy in Benabarre (La Ribagorza) crafting raw and pasteurized goat milk cheeses; regular exhibitor at Biescas. | [Feria de Biescas](https://www.biescas.es) | <https://quesosbenabarre.es/> | Verify on-farm dairy holding in Benabarre, flock size and active commercial lineup. |
| Quesería Casa Mayor | Berdún | `Lácteos y quesos` — Jacetania artisan sheep cheese | Craft sheep cheese workshop located in Berdún (Canal de Berdún, Jacetania); regular participant in Pyrenean cheese fairs. | [Feria de Biescas](https://www.biescas.es) | — | Confirm dedicated dairy premises in Berdún, sanitary registration and current cheese range. |

