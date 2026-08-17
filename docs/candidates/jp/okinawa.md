# Okinawa — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/okinawa.csv` (50 filas tras la revisión integral de 2026-08-11).
- Fuente: listado de 酒造所 de おきなわ物語 (portal oficial de turismo de la prefectura), <https://www.okinawastory.jp/feature/awamori/list> (leído 2026-08-04). Gremio: 沖縄県酒造組合, <https://www.okinawa-awamori.or.jp/> — **47 酒造所 y 1 cooperativa**; su certificado TLS fallaba el 2026-08-04, ver README.
- Estado: revisión integral cerrada el 2026-08-11; las entradas no publicadas se conservan abajo con la carencia concreta que impide incorporarlas.

Aquí el gremio no es de sake ni de shochu: es de **泡盛 (awamori)**, destilado de
arroz índico con koji negro, con Indicación Geográfica (琉球泡盛) y unos 500 años
de historia. Categoría para todas: `Destilados y licores`.

## Trampas

- **Revisión 2026-08-09:** Takazato Shuzosho era la identidad histórica del ya
  publicado `yanbaru-shuzo-ogimi`; se retira de la cola como resuelto, no como
  descarte.
- ⚠ **石川酒造場 (Nishihara, Okinawa)** no es 石川酒造 (Fussa, Tokio), en
  `tokyo.md`. Y ojo: **石川** es además un barrio de うるま市 y el nombre de una
  prefectura entera (`ishikawa.md`). Tres cosas, un rōmaji.
- ⚠ **咲元酒造 era de Shuri (Naha) y se trasladó a Onna**: según qué listado se
  lea sale en un municipio o en otro. Confirmar el actual antes de fijar
  coordenadas — es el patrón «sede vs. planta» que ya avisa `hokkaido.md`.
- **Okinawa no es una isla**: Izena, Iheya y las que faltan (Miyako, Ishigaki,
  Yonaguni, Kume) están a 100-500 km de Naha. El gate geográfico las marcará
  lejos del centroide de la capital y **es correcto**.
- **与那国島** tiene el 花酒, el único destilado de 60° legal en Japón, y las tres
  destilerías de la isla no están en esta tabla.
- Los municipios de Okinawa llevan mucho 村 (Ogimi, Izena, Iheya, Onna,
  Yomitan): no convertirlos en 町 al escribir.

## Qué falta
- **~27 酒造所 del gremio sin listar**: esta tabla son 20 de 47. Faltan enteras
  las islas Miyako, Yaeyama (Ishigaki, Yonaguni, Taketomi) y Kumejima, además
  del sur de la isla principal (Itoman, Tomigusuku, Nanjo).
- Sin abrir, y Okinawa es la prefectura con la despensa más distinta del país:
  **黒糖 (azúcar moreno)**, que solo pueden hacer ocho islas y tiene productores
  identificables; **シークヮーサー de Ogimi**; 海ぶどう; 島とうがらし y コーレー
  グース; 紅芋 de Yomitan; ゴーヤー; 沖縄そば (con gremio propio); 石垣牛 y
  あぐー豚; 塩 de Miyako e Ishigaki.

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 18 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 宮古島亜熱帯有機農業生産組合 | 砂川重信①　他 | 沖縄県宮古島市下地字来間443-1、443-2、444　他 | 有機農産物 | JS000828FA-0145-26 |
| 株式会社丸海あきら | MM-01 | 沖縄県浦添市伊祖3-43-8 | 有機農産物 | IOTA-SS-01 |
| 松八 | NT-01(b) 他 | 沖縄県中頭郡中城村字伊舎堂209　他 | 有機農産物 | IOTA-SS-03 |
| 農業生産法人（株）熱帯資源植物研究所 | 農業生産法人（株）熱帯資源植物研究所 | 沖縄県糸満市真栄平1158-1 | 有機農産物 | 2009F-15 |
| 伊佐　真幸 | ISA01 | 沖縄県那覇市首里石嶺町4-40 | 有機農産物 | IOTA-SS-37 |
| 仲村　直子 | NN01,03 | 沖縄県中頭郡北中城村字荻道底田原595, 596-1　他 | 有機農産物 | IOTA-SS-36 |
| 有限会社月桃農園 | GN01 | 沖縄県うるま市勝連浜宜野湾201　他 | 有機農産物 | IOTA-SS-34 |
| 外間　修 | HO-02　他 | 沖縄県中頭郡西原町幸地谷那堂1065,1065　他 | 有機農産物 | IOTA-SS-44 |
| 伊芸農園 | 伊芸農園－１～６ | 沖縄県国頭郡大宜味村字津波1971-50　他 | 有機農産物 | IOTA-SS-43 |
| 城間　清栄 | 松真農園－01他 | 沖縄県南城市佐敷字冨祖崎兼久原264-1　他 | 有機農産物 | IOTA-SS-38 |
| 農業生産法人　㈲琉球アロエ | 琉球アロエオーガニック農場 | 沖縄県国頭郡今帰仁村字渡喜仁２６９番地 　他 | 有機農産物 | IOTA-SS-48 |
| ゆんなみファーム | 後原畑№1、№2 | 沖縄県中頭郡西原町字安室213-5，213-2 | 有機農産物 | IOTA-SS-57 |
| 農業生産法人　株式会社石垣島胡椒園 | 有機ほ場①他 | 沖縄県石垣市字平得1021番地 | 有機農産物 | IOTA-SS-59 |
| 小橋川ファーム沖縄 | 小橋川ファーム沖縄No.1他 | 沖縄県中頭郡西原町兼久371-1他 | 有機農産物 | IOTA-SS-60 |
| 有限会社沖縄長生薬草本社 | CHOUSEI有機ほ場No１他 | 沖縄県南城市佐敷字仲伊保原99-1,103,111 | 有機農産物 | IOTA-SS-61 |
| おきなわオーガニック産地育成協議会 | 泉川農園①　他 | 沖縄県中頭郡北中城村渡口410　他 | 有機農産物 | IOTA-SS-62 |
| 農業生産法人(株)シーフォーグループ | 有機ほ場①他 | 沖縄県宮古島市下地字上地1016-1他 | 有機農産物 | IOTA-SS-63 |
| ソフィエル・ペアー（株） | 幸地①ほ他 | 沖縄県中頭郡西原町幸地下安次座906番地1他 | 有機農産物 | IOTA-SS-65 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/okinawa.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
- Estado: revisión 2026-08-11; **0 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

**Ya integrado, no volver a proponer:** ヘリオス酒造 ya está en `okinawa.csv` como `Destilados y licores`.

## Nuevos candidatos de cerveza artesana — barrido 2026-08-13

Barrido sistemático de microcervecerías artesanales independientes con obrador propio, marca activa, presencia web y redes sociales. Categoría: `Cerveza`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Instagram | Notas de producción |
|---|---|---|---|---|---|---|

## Nuevos candidatos de pescado y marisco artesanal — barrido 2026-08-14

Barrido sistemático de productores, acuicultores y elaboradores artesanos de pescado, marisco y algas de Okinawa con instalaciones productivas propias, marca activa y venta/presencia web directa. Categoría: `Pescado`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Descripción / Especialidad | Fuente |
|---|---|---|---|---|---|---|
| **大嶺水産 (Omine Suisan)** | 有限会社大嶺水産 | `糸満市` | Pescado | https://ominesuisan.com/ |Obrador tradicional de pasta de pescado (Okinawa kamaboko y chiki-agi) fundado en 1955 en el puerto de Itoman; elaboración diaria con pescado fresco y sal marina de Okinawa. ⚠ Reviewed 2026-08-14: hold; the proposed domain is invalid, mismatched or insufficient and no current source yet establishes every admission claim.| Web oficial / Registro artesanal de Itoman |
| **八重山養殖 (Yaeyama Kuruma Ebi)** | 有限会社八重山養殖 | `石垣市` | Pescado | https://yaeyama-kurumaebi.com/ |Granja acuícola marina en la isla de Ishigaki; cría en aguas cristalinas de arrecife coralino de langostino tigre japonés (Kuruma-ebi de Yaeyama) con envío en vivo y congelado en origen. ⚠ Reviewed 2026-08-14: hold; the proposed domain is invalid, mismatched or insufficient and no current source yet establishes every admission claim.| Web oficial / Asociación comercial de Ishigaki |
