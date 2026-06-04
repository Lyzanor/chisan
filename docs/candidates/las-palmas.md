# Las Palmas Candidate Notes

Raw candidate notes from manual research. These entries are not source of truth
until each producer is checked again and promoted into `data/csv/canarias/las-palmas.csv`.

## 2026-06-04 - Integrated (web/social verified, rich data)

Promoted to `data/csv/canarias/las-palmas.csv` after web/social verification. All
backed by the AIDER / quesosdegrancanaria.com registry plus their own
website/Instagram/Facebook, so `verificacion=parcial`. Coordinates use the
municipio centroid (geo-check clean). Removed from the unverified table below.

| slug | nombre | municipio | venta online | evidence |
| --- | --- | --- | --- | --- |
| `queseria-arquegran-aguimes` | Quesería Arquegran | Agüimes | sí | SumUp store live (queseriaarquegran.sumupstore.com), IG @arquegran_aguimes, FB, TasteAtlas, Gran Canaria Marketplace → only one with real online checkout (ecommerce) |
| `queseria-artesanal-el-pagador-moya` | Quesería Artesanal El Pagador | Moya | no comprobado | IG @queseriaartesanalelpagador, FB; farm + reparto a domicilio + mercado de Arucas, no checkout |
| `queseria-el-manjar-de-tejeda` | Quesería El Manjar de Tejeda | Tejeda | no comprobado | IG @quesos.manjar.de.tejeda; farm + tiendas + ferias de Tejeda |
| `queseria-tasartesano-la-aldea-de-san-nicolas` | Quesería Tasartesano | La Aldea de San Nicolás | no comprobado | IG @tasartesano; en tiendas y en quesoproject.com, pero su ficha no tiene checkout (solo WhatsApp) |
| `queseria-cortijo-de-las-hoyas-moya` | Quesería Cortijo de Las Hoyas | Moya | no comprobado | IG @queseriacortijolashoyas; farm + comercios + supermercados de Moya |
| `queseria-el-roque-tejeda` | Quesería El Roque | Tejeda | no comprobado | IG @queseria_elroque, FB @QuesosElRoque, web wix, email queseriaelroque@gmail.com |
| `queseria-los-dragos-moya` | Quesería Los Dragos | Moya | no comprobado | web propia queserialosdragos.es, FB, finca ecológica, premio Agrocanarias 2014; sin tienda online |
| `quesos-el-parral-ingenio` | Quesos El Parral | Ingenio | no comprobado | web quesoselparral.es, IG @quesos_el_parral, email qelparral@quesoselparral.es; pedidos por teléfono + reparto, sin checkout automático confirmado |

Verified-but-not-integrated (thin data):
- **Quesos Pedrín** (Firgas, 626 955 594): exists in the registry; only a free-builder
  site (quesos-pedrin.amawebs.com), no Instagram, no online sales — reparto a domicilio
  + comercios + mercado de Arucas. Left below pending richer data.

## 2026-06-04 - Registry pass (rest of candidates reviewed)

Reviewed every remaining `unverified` entry by web. Integrated only those with their
own digital channel (Instagram/Facebook/web), per the "rich data" criterion. Added
with `verificacion=parcial` and `Venta online=no comprobado` (no live checkout found
on any). Coordinates use the municipio centroid. Removed from the table below.

| slug | nombre | municipio | evidence |
| --- | --- | --- | --- |
| `queseria-el-caidero-moya` | Quesería El Caidero | Moya | Facebook propio + Mención Mejor Queso Curado de Gran Canaria 2023 (Cabildo/prensa) + red Queso Project |
| `queseria-neroan-galdar` | Quesería Neroan | Gáldar | Facebook propio + email botijasardina@hotmail.es |
| `queseria-juan-grande-san-bartolome-de-tirajana` | Quesería Juan Grande | San Bartolomé de Tirajana | Instagram @quesosjuangrande + Facebook; quesos especiales (halloumi, feta) |
| `queseria-el-cortijo-el-montanon-galdar` | Quesería El Cortijo El Montañón | Gáldar | Facebook + bronce World Cheese Awards 2025 + reparto a domicilio |

Notable but NOT integrated (real + award/press, but no own web/IG/FB → wait for a channel):
- **Quesos Lomo El Chorrito** (Valleseco, Mario Quintana): Mejor Queso Curado de Gran Canaria; solo prensa, sin canal propio.
- **Queso Artesano Cueva Sosa** (Gáldar, Felipe Mendoza): Mejor Queso Curado 2024; se vende en quesobotello.com (tienda de terceros), sin canal propio.
- **Quesería Juan Suárez** / marca Finca Fuente Morales (Agüimes): 1.er premio semicurado pasteurizado 2024, ficha Google con horario y pagos, sin web/IG.
- **Quesos Las Mesas** (Gáldar, Josefa González): DOP Flor de Guía + World Cheese Awards; sin canal propio.
- **Queso Artesanal Las Lajitas** (Artenara): bar-tienda conocido en la GC-210, buzz en TikTok/IG de terceros, sin cuenta propia confirmada.

Enrichment opportunity (already in CSV, not an alta):
- `s-a-t-queso-flor-valsequillo-valsequillo` está sin redes; tiene IG @quesosflorvalsequillo, FB y web quesosflorvalsequillo.com → enriquecer en una pasada de datos.

Dato útil rescatado: **Queso Cuevas del Rey** (Tejeda) comparte dirección y teléfono
(El Roque, 3; 618 39 65 67) con la `queseria-el-roque-tejeda` ya integrada → tratar
como la misma quesería, no duplicar.

The remaining rows below are registry-only (farm-gate, just a phone, no own web/IG).

## 2026-06-02 - Gran Canaria artisan cheese pass

Sources:
- Quesos Artesanos de Gran Canaria: https://www.quesosdegrancanaria.com/queserias-por-municipio/
- Queseria Arquegran SumUp store: https://queseriaarquegran.sumupstore.com/

Duplicate check:
- `rg -n "Arquegran|arquegran|Quesería Arquegran|queseriaarquegran" data docs`
  returned no local matches.
- `npx pnpm list:province las-palmas` was used to compare the 65 source entries
  against current `Lácteos y quesos` rows.

Notes:
- `Queso Arquegran` is not currently in the CSV. The AIDER ficha lists Sergio
  Manuel Reyes Sánchez, Camino del Conde s/n, Montaña Los Vélez, Agüimes,
  phone `636 522 313`; the SumUp shop is live as `Quesería Arquegran Agüimes s.l`
  and shows cheese products with prices and checkout. If promoted, recheck maps,
  coordinates, and whether `Venta online=sí` with `Canal de venta=ecommerce`.
- AIDER confirms existence and useful contact/location data, but it is a 2021
  registry-style source. Re-verify current activity before adding any row.
- Some current CSV cheese rows appear duplicated by naming variants, especially
  Campo de Guía, Cortijo de Caideros, Altos de Moya, and La Caldera. Do not add
  new variants for those without resolving the existing duplication first.

### Unverified candidates

| status | name | municipio from source | phone from source | source | duplicate check | web | instagram |
| --- | --- | --- | --- | --- | --- | --- | --- |
| unverified | Quesería El Sequero | Ingenio | 678 848 472 | https://www.quesosdegrancanaria.com/queserias/queseria-el-sequero/ | no local match |  |  |
| unverified | Quesería Juan Suárez | Agüimes | 695 591 882 | https://www.quesosdegrancanaria.com/queserias/queseria-juan-suarez/ | no local match |  |  |
| unverified | Quesería Los Llanetes Hoya León | Valsequillo | 699 614 207 | https://www.quesosdegrancanaria.com/queserias/queseria-los-llanetes-hoya-leon/ | no local match |  |  |
| unverified | Quesería Zacarías | Valsequillo | 928 170 195 | https://www.quesosdegrancanaria.com/queserias/queseria-zacarias/ | no local match |  |  |
| unverified | Queso Aguas de Fontanales | Moya | 928 610 523 | https://www.quesosdegrancanaria.com/queserias/queso-aguas-fontanales/ | no local match |  |  |
| unverified | Queso Angelita | Valsequillo | 928 573 072 | https://www.quesosdegrancanaria.com/queserias/queso-angelita/ | no local match |  |  |
| unverified | Queso Artesanal Finca La Virgen | pending | pending | https://www.quesosdegrancanaria.com/queserias/queso-artesanal-finca-la-virgen/ | no local match |  |  |
| unverified | Queso Artesanal La Cueva del Paso | pending | pending | https://www.quesosdegrancanaria.com/queserias/queso-artesanal-la-cueva-del-paso/ | no local match |  |  |
| unverified | Queso Artesanal La Guancha | pending | pending | https://www.quesosdegrancanaria.com/queserias/queso-artesanal-la-guancha/ | no local match |  |  |
| unverified | Queso Artesanal Las Lajitas | Artenara | 928 170 052 | https://www.quesosdegrancanaria.com/queserias/queso-artesanal-las-lajitas/ | no local match |  |  |
| unverified | Queso Artesanal Los Almendros | Artenara | 671 213 946 | https://www.quesosdegrancanaria.com/queserias/queso-artesanal-los-almendros/ | no local match |  |  |
| unverified | Queso Artesano Cueva Sosa | Gáldar | 697 747 322 / 667 028 502 | https://www.quesosdegrancanaria.com/queserias/queso-artesano-cueva-sosa/ | no local match |  |  |
| unverified | Queso Artesano Los Risquetes | Valsequillo | 648 670 435 | https://www.quesosdegrancanaria.com/queserias/queso-artesano-los-risquetes/ | no local match |  |  |
| unverified | Queso Carmencita | pending | pending | https://www.quesosdegrancanaria.com/queserias/queso-carmencita/ | no local match |  |  |
| unverified | Queso Cuevas del Rey | pending | pending | https://www.quesosdegrancanaria.com/queserias/queso-cuevas-del-rey/ | no local match |  |  |
| unverified | Queso El Espigón | pending | pending | https://www.quesosdegrancanaria.com/queserias/queso-el-espigon/ | no local match |  |  |
| unverified | Queso Fresco Artesanal Rivero | Vega de San Mateo | 928 640 497 | https://www.quesosdegrancanaria.com/queserias/queso-fresco-artesanal-rivero/ | no local match |  |  |
| unverified | Queso Juncalillo del Sur | pending | pending | https://www.quesosdegrancanaria.com/queserias/queso-juncalillo-del-sur/ | no local match |  |  |
| unverified | Queso La Vega Vieja | Valsequillo | 928 570 330 | https://www.quesosdegrancanaria.com/queserias/queso-la-vega-vieja/ | no local match |  |  |
| unverified | Queso Las Cuevas | pending | pending | https://www.quesosdegrancanaria.com/queserias/queso-las-cuevas/ | no local match |  |  |
| unverified | Queso Las Lajas | pending | 699 637 309 | https://www.quesosdegrancanaria.com/queserias/queso-las-lajas/ | no local match |  |  |
| unverified | Queso Lomo El Chorrito | Valleseco | 679 276 071 | https://www.quesosdegrancanaria.com/queserias/queso-lomo-chorrito/ | no local match |  |  |
| unverified | Queso Saucillo | Gáldar | 928 555 286 | https://www.quesosdegrancanaria.com/queserias/queso-saucillo/ | no local match |  |  |
| unverified | Quesos Artesanales de La Cumbre El Toscón de Tejeda | pending | pending | https://www.quesosdegrancanaria.com/queserias/quesos-artesanales-la-cumbre-toscon-tejeda/ | no local match |  |  |
| unverified | Quesos Camino de Inciensos | pending | pending | https://www.quesosdegrancanaria.com/queserias/quesos-camino-de-inciensos/ | no local match |  |  |
| unverified | Quesos Don Paco | pending | pending | https://www.quesosdegrancanaria.com/queserias/quesos-don-paco/ | no local match |  |  |
| unverified | Quesos El Altazo | Gáldar | 928 552 624 | https://www.quesosdegrancanaria.com/queserias/quesos-el-altazo/ | no local match |  |  |
| unverified | Quesos El Montañón, Ayacata | pending | pending | https://www.quesosdegrancanaria.com/queserias/quesos-montanon-ayacata/ | no local match |  |  |
| unverified | Quesos La Colina | pending | pending | https://www.quesosdegrancanaria.com/queserias/quesos-la-colina/ | no local match |  |  |
| unverified | Quesos La Solana | pending | pending | https://www.quesosdegrancanaria.com/queserias/quesos-la-solana/ | no local match |  |  |
| unverified | Quesos Las Mesas | Gáldar | 928 555 152 | https://www.quesosdegrancanaria.com/queserias/quesos-las-mesas/ | no local match |  |  |
| unverified | Quesos Los Lomitos | Agüimes | 620 513 836 | https://www.quesosdegrancanaria.com/queserias/quesos-los-lomitos/ | no local match |  |  |
| unverified | Quesos Mercedita | pending | pending | https://www.quesosdegrancanaria.com/queserias/quesos-mercedita/ | no local match |  |  |
| unverified | Quesos Pedrín | Firgas | 626 955 594 | https://www.quesosdegrancanaria.com/queserias/quesos-pedrin/ | no local match | http://quesos-pedrin.amawebs.com/ |  |
| unverified | Quesos Quintana de San Lorenzo | pending | pending | https://www.quesosdegrancanaria.com/queserias/quesos-quintana-san-lorenzo/ | no local match |  |  |
| unverified | Quesos Roque Grande | Valsequillo | 928 570 188 / 659 304 088 | https://www.quesosdegrancanaria.com/queserias/quesos-roque-grande/ | no local match |  |  |

### Already present or likely present

| status | source name | source | local match |
| --- | --- | --- | --- |
| already-present | Quesería Artesanal Los Guedes | https://www.quesosdegrancanaria.com/queserias/queseria-artesanal-buen-pastor/ | `queseria-artesanal-guedes-santa-lucia` - Quesería Artesanal Guedes - Santa Lucía |
| already-present | Quesería Campo de Guía | https://www.quesosdegrancanaria.com/queserias/queseria-campo-guia/ | `queseria-campo-de-guia-santa-maria-de-guia`; `quesos-campo-de-guia-santa-maria-de-guia` |
| already-present | Quesería Era del Cardón | https://www.quesosdegrancanaria.com/queserias/queseria-del-cardon/ | `queseria-era-del-cardon-santa-lucia` - Quesería Era del Cardón - Agüimes |
| already-present | Queso Amurga | https://www.quesosdegrancanaria.com/queserias/queso-amurga/ | `quesos-amurga-san-bartolome-de-tirajana` - Quesos Amurga - San Bartolomé de Tirajana |
| already-present | Queso Artesanal Del Rosario | https://www.quesosdegrancanaria.com/queserias/queso-artesanal-del-rosario/ | `quesos-del-rosario-agaete` - Quesos Del Rosario - Agaete |
| already-present | Queso Artesano Draguillo | https://www.quesosdegrancanaria.com/queserias/queso-artesano-draguillo/ | `quesos-el-draguillo-san-bartolome-de-tirajana` - Quesos El Draguillo - San Bartolomé de Tirajana |
| already-present | Queso Cortijo de Pavón | https://www.quesosdegrancanaria.com/queserias/queso-cortijo-pavon/ | `queseria-el-cortijo-de-pavon-santa-maria-de-guia` - Quesería El Cortijo de Pavón - Santa María de Guía |
| already-present | Queso de Naranjo | https://www.quesosdegrancanaria.com/queserias/queso-de-naranjo/ | `quesos-de-naranjo-ganaranjo-slu-las-palmas-de-gran-canaria` - Quesos de Naranjo (Ganaranjo SLU) - Las Palmas de Gran Canaria |
| already-present | Queso El Cortijo de Caideros | https://www.quesosdegrancanaria.com/queserias/queso-cortijo-caideros/ | `queseria-cortijo-de-caideros-galdar`; `quesos-cortijo-de-caideros-galdar` |
| already-present | Queso La Pastora | https://www.quesosdegrancanaria.com/queserias/queso-la-pastora/ | `quesos-la-pastora-las-palmas-de-gran-canaria` - Quesos La Pastora - Las Palmas de Gran Canaria |
| already-present | Queso Naroy | https://www.quesosdegrancanaria.com/queserias/queso-naroy/ | `queseria-naroy-ingenio` - Quesería Naroy - Ingenio |
| already-present | Quesos Altos de Moya | https://www.quesosdegrancanaria.com/queserias/quesos-altos-moya/ | `queseria-altos-de-moya-moya`; `quesos-altos-de-moya-moya` |
| already-present | Quesos La Caldera | https://www.quesosdegrancanaria.com/queserias/quesos-la-caldera/ | `queseria-la-caldera-moya`; `quesos-la-caldera-galdar` |
| already-present | Quesos La Gloria | https://www.quesosdegrancanaria.com/queserias/quesos-la-gloria/ | `queseria-la-gloria-san-bartolome-de-tirajana` - Quesería La Gloria - San Bartolomé de Tirajana |
| already-present | Quesos Lomo del Palo | https://www.quesosdegrancanaria.com/queserias/quesos-lomo-del-palo/ | `queseria-lomo-el-palo-galdar` - Quesería Lomo El Palo - Gáldar |
| already-present | Quesos Los Castañeros | https://www.quesosdegrancanaria.com/queserias/quesos-los-castaneros/ | `quesos-los-castaneros-moya` - Quesos Los Castañeros - Moya |
| already-present | Quesos Madre Vieja | https://www.quesosdegrancanaria.com/queserias/quesos-madre-vieja/ | `queseria-madre-vieja-moya` - Quesería Madre Vieja - Moya |
