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
