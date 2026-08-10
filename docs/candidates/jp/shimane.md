# Shimane — candidatos

- CSV: `data/csv/jp/chugoku/shimane.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/shimane> (34 bodegas, leído 2026-08-04). Gremio: 島根県酒造組合, <http://www.shimane-sake.or.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Izumo es, según el 出雲国風土記, donde se documenta el sake más antiguo de Japón.
Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Oroku Shuzo | 王祿酒造 | Matsue |
| Kisuki Shuzo | 木次酒造 | Unnan ⚠ |
| Asahi Shuzo (Kyokujitsu) | 旭日酒造 | Izumo |
| Itakura Shuzo | 板倉酒造 | Izumo |
| Ichinomiya Shuzo | 一宮酒造 | Oda |
| Kimura Shuzo | 木村酒造 | Oda ⚠ |
| Aoto Shuzo | 青砥酒造 | Yasugi |
| Akana Shuzo | 赤名酒造 | Iinan |
| Ikezuki Shuzo | 池月酒造 | Ohnan |
| Kamofuku Shuzo | 加茂福酒造 | Ohnan |
| Okuizumo Shuzo | 奥出雲酒造 | Okuizumo |
| Kasen Shuzo | 華泉酒造 | Tsuwano |
| Okadaya Honten | 岡田屋本店 | Masuda |
| Oki Shuzo | 隠岐酒造 | Okinoshima |

## Trampas
- ⚠ **木次酒造 (sake) y 木次乳業 (Kisuki Nyugyo, lácteos) son dos empresas
  distintas del mismo municipio, Unnan, y se leen igual.** La segunda es una de
  las lecherías de pasto más conocidas de Japón y candidata evidente por su
  cuenta: no fusionarlas ni descartar una por la otra.
- ⚠ **木村酒造 (Oda, Shimane)** no es 木村酒造 (Yuzawa, Akita), ya en `akita.md`.
  Mismo 社名, dos empresas.
- ⚠ **旭日酒造 (Izumo) se lee Kyokujitsu**, no Asahi, y por tanto **no** es
  ninguno de los cuatro 旭酒造 listados en `mie.md`. Kanji parecido, lectura
  distinta: confirmar la lectura antes de fijar el `slug`.
- **隠岐酒造** está en las **islas Oki**, a 60 km de la costa: municipio
  隠岐の島町 (Okinoshima), y ojo con confundirlo con 沖縄 (Okinawa) al teclear.
- 邑智郡 y 鹿足郡 no son municipio: la fila lleva el 町 — Ohnan, Tsuwano.

## Qué falta
- Las ~20 bodegas restantes del censo.
- Sin abrir: **木次乳業** y los lácteos de pasto de Unnan (frente propio),
  **しじみ del lago Shinji** (casi todo el nacional, con cofradía),
  出雲そば, 石見和牛, 西条柿 y の干し柿, 板わかめ, y el 和菓子 de Matsue, que es
  una de las tres capitales del té y el dulce de Japón.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 平木正美 | 1　他 | 島根県浜田市三隅町東平原スナコダ398　他 | 有機農産物 | 05A-005 |
| 大畑　安夫 | 1　他 | 島根県江津市都野津町667（ハウス1～3）　他 | 有機農産物 | 01A-004 |
| 佐々原　洋道 | 圃場1 | 島根県浜田市金城町入野ロ-262 9号ハウス | 有機農産物 | 02A-008 |
| 有限会社桜江町桑茶生産組合 | （有）桜江町桑茶生産組合 | 島根県江津市桜江町市山507-1 | 有機加工食品 | 02B-011,06C-005 |
| （有）三和農産 | 3　他 | 島根県出雲市矢尾町342-4　他 | 有機農産物 | S-098 |
| （有）やさか共同農場 | 有限会社　やさか共同農場　味噌製造所　他 | 島根県浜田市弥栄町三里ハ268番地　他 | 有機加工食品 |  |
| 三浦　寿紀 | 圃場1 | 島根県浜田市弥栄町木都賀イ1162-2 | 有機農産物 | 03A-001 |
| 石井　政信 | 圃場1 | 島根県鹿足郡吉賀町下須542-1 | 有機農産物 | 01A-035-4 |
| 田村　勝美 | 1　他 | 島根県鹿足郡吉賀町下須358（ハウス１）　他 | 有機農産物 | 04A-035-8 |
| (有)一畑園 | (有)一畑園　東部工業団地工場　他 | 島根県出雲市小境町1700-22　他 | 有機加工食品 |  |
| 有機の美郷有限会社 | M-2　他 | 島根県邑智郡美郷町小松地253-1　他 | 有機農産物 | 08A-0002 |
| 健幸ファーム（株）いづも農縁 | S-1　他 | 島根県出雲市里方455-1　他 | 有機農産物 | NA-09061602 |
| ヤマノ株式会社 | ヤマノ株式会社 | 島根県安来市西恵乃島町837-30 | 有機加工食品 | 10J-0001 |
| 安来オーガ有限会社 | A圃場75　他 | 島根県安来市穂日島町75　他 | 有機農産物 | 10A-0001 |
| 永安 恵治 | 圃場1 | 島根県鹿足郡吉賀町大野原中組185 | 有機農産物 | 10A-006 |
| 有限会社宝箱 | ②　他 | 島根県松江市大庭町1631-8,1631-9,1631-10,1631-11　他 | 有機農産物 | 10A-0003 |
| さんべ食品工業株式会社 | さんべ食品工業株式会社 | 島根県大田市大田町大田イ403－5 | 有機加工食品 | 10J-0002 |
| 高畑環境ファーム清水農園　清水溥万 | 1　他 | 島根県邑智郡美郷町高畑17-1（イ）　他 | 有機農産物 | 17A-0001 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/shimane.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **2** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 島根ビール | Matsue | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 石見麦酒 (石見酒造) | Gotsu | Cerveza | JBA | iwami-bakushu.com | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/shimane.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/shimane.php> (nombre, dirección y web propia de cada socio)
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **5 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 福泉堂 | 出雲市 | Dulces y repostería | 和菓子協会 | http://www.shishisu.com/ | 出雲市斐川町直江町 5158 |
| 風流堂 | 松江市 | Dulces y repostería | 和菓子協会 | http://www.furyudo.jp | 松江市白潟本町 15 |
| 彩雲堂 | 松江市 | Dulces y repostería | 和菓子協会 | http://www.saiundo.co.jp/ | 松江市天神町 124 |
| 福田屋 | 松江市 | Dulces y repostería | 和菓子協会 | http://www.matsue-fukudaya.com/ | 松江市中原町 159 |
| 中浦食品 | 松江市 | Conservas | búsqueda dirigida + web propia | https://www.nakaura-f.co.jp/ | 板わかめ, tsukudani; fundada 1686 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/shimane.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/shimane> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 8, Pescado 5, Setas 3, Carne 2, Pan y cereal 2, Miel 1, Frutos secos 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| りせらや養蜂園 | 江津市 | Miel | ficha | — | https://www.tabechoku.com/producers/3077853 |  |
| 出雲の小さなきくらげ屋さん | 出雲市 | Setas | ficha | — | https://www.tabechoku.com/producers/3077978 |  |
| 八谷原木きのこ | 浜田市 | Setas | ficha | — | https://www.tabechoku.com/producers/23351 |  |
| ますだ季の香 | 益田市 | Setas | ficha | — | https://www.tabechoku.com/producers/28217 |  |
| しじみ漁師の店 大竹屋 | 出雲市 | Pescado | ficha | — | https://www.tabechoku.com/producers/23831 |  |
| 奥宇賀屋｜三代目しじみ漁師 | 出雲市 | Pescado | ficha | — | https://www.tabechoku.com/producers/28561 |  |
| ヤシロファーム | 出雲市 | Pescado | ficha | — | https://www.tabechoku.com/producers/21921 |  |
| 永幸丸 【岩牡蠣養殖・素潜り】 | 松江市 | Pescado | ficha | — | https://www.tabechoku.com/producers/24173 |  |
| Mueller's Farm  ムラーズファーム | 海士町 | Pescado | ficha | — | https://www.tabechoku.com/producers/20680 | 島根県隠岐郡海士町 |
| エコファームささだ | 大田市 | Carne | ficha | — | https://www.tabechoku.com/producers/20791 |  |
| さとうのんびり農園 | 雲南市 | Carne | ficha | — | https://www.tabechoku.com/producers/26428 |  |
| 𠮷野屋 | 大田市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/27676 |  |
| HYAKUSYOU　岩本 | 隠岐の島町 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/3078497 | 島根県隠岐郡隠岐の島町 |
| SPIRA FARM | 出雲市 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/21532 |  |
| Fattoria Natura | 出雲市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22339 |  |
| ぴたごらファーム | 奥出雲町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/26025 | 島根県仁多郡奥出雲町 |
| 安藤農園 | 松江市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078087 |  |
| マルカミ農縁 | 松江市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078808 |  |
| アグリプラント甲斐の木 | 江津市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22391 |  |
| やまあいピクルス | 江津市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/27723 |  |
| ひだまりファーム | 津和野町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28404 | 島根県鹿足郡津和野町 |
| 森田園芸 | 益田市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/27321 |  |
