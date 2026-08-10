# Saga — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/saga.csv` (9 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/saga> (30 bodegas, leído 2026-08-04). Gremio: 佐賀県酒造組合, <http://www.sagasake.or.jp/main/>.
- Estado: **9 integradas** el 2026-08-05, **todas `verificado`**, 6 con tienda propia. Evidencia en `data/evidence/jp/kyushu-okinawa/saga.jsonl`.

Saga es la prefectura con más bodegas por habitante de Japón, y **鹿島 (Kashima)**
concentra el barrio histórico de 肥前浜宿, con bodegas alineadas en una calle.
Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Sachihime Shuzo | 幸姫酒造 | Kashima |
| Koyanagi Shuzo | 小柳酒造 | Ogi |
| Higashitsuru Shuzo | 東鶴酒造 | Taku |
| Ide Shuzo | 井手酒造 | Ureshino |
| Segashira Shuzo | 瀬頭酒造 | Ureshino |
| Kawanami Shuzo | 川浪酒造 | Imari |
| Tanaka Shuzo | 田中酒造 | Imari |
| Kiyama Shoten | 基山商店 | Kiyama |
| Saka Shuzo | 佐嘉酒造 | Saga |
| Komatsu Shuzo | 小松酒造 | ⚠ 東松浦郡 |

## Integradas 2026-08-05 (9) — todas verificado

| bodega | municipio | resultado |
|---|---|---|
| Tenzan Shuzo | Ogi | verificado · venta sí |
| Mitsutake Shuzojo | Kashima | verificado · venta sí |
| Gochoda Shuzo (Azumaichi) | Ureshino | verificado · venta sí |
| Koimari Shuzo | Imari | verificado · venta sí |
| Yano Shuzo | Kashima | verificado · venta sí |
| Amabuki Shuzo | Miyaki | verificado · venta sí |
| Fukuchiyo Shuzo (Nabeshima) | Kashima | verificado · solo distribuidor |
| Sachihime Shuzo | Kashima | verificado · sin carrito |
| Baba Shuzojo (Nogomi) | Kashima | verificado · sin carrito |

⚠ **`Kashima` resolvía al municipio equivocado.** 鹿島市 (Saga) y 鹿嶋市
(Ibaraki) comparten clave normalizada y ganaba el de Ibaraki, a 800 km: error
bloqueante. Resuelto el 2026-08-05 con una entrada `kashima` en
`data/reference/municipality-overrides.json` (kanto vs kyushu-okinawa). Es el
segundo homónimo de este tipo tras `tonosho` en `kagawa.md`.

- **Cuatro de las nueve están en Kashima**, casi todas en la calle de kura de
  Hizen Hamashuku. Cinco de las que trae la tabla original no salieron en esta
  pasada y siguen en cola.
- **«shop» en la URL no es una tienda.** `sachihime.co.jp/shop-list/` y
  `nabeshima.biz/shop.html` son listados de distribuidor. En el caso de
  Nabeshima la fuente institucional lo dice expresamente: no vende ni en el kura.
- **Yano Shuzo no tiene web corporativa**: su único sitio propio es la tienda en
  BASE, que sirve a la vez de identidad y de canal.
- **`nogomi.co.jp` sin `www` no responde**; con `www` da 200. No es sitio muerto.

## Trampas
- ⚠ **小松酒造** aparece con 東松浦郡 y sin 町**: de ese 郡 solo queda 玄海町
  (Genkai) tras las fusiones, pero hay que confirmarlo — el resto se repartió
  entre 唐津市 (Karatsu) e 伊万里市. Resolver antes de escribir o la fila se queda
  sin gate geográfico.
- **瀬頭酒造 y 五町田酒造 (ambas en Ureshino)** son de la misma familia pero
  empresas distintas, con marcas distintas (東一 y 東長 / 東鶴 no, ojo). Y
  **東鶴酒造 está en Taku**, no en Ureshino: tres 東 que se confunden fácil.
- **田中酒造 (Imari, Saga)** no es 田中酒造 (Otaru, Hokkaido) ni 田中酒造店 (Kami,
  Miyagi), ambas ya en esta carpeta. Tres empresas.
- **佐嘉酒造** usa el kanji antiguo de Saga (佐嘉), no el moderno (佐賀): no
  «corregirlo» al escribir el `nombre`.

## Qué falta
- Las ~16 bodegas restantes del censo, empezando por el resto de 肥前浜宿, que es
  donde están las que tienen tienda y visita.
- Sin abrir: **嬉野茶 (Ureshino)**, uno de los tres grandes tés en sartén de Japón
  y en el mismo municipio que tres bodegas de arriba; **海苔 de Ariake** (Saga es
  la primera productora nacional, con cofradías); 佐賀牛; 呼子のイカ (calamar
  vivo, con lonja propia); 有田焼 y 伊万里焼 (cerámica, fuera de catálogo pero
  arrastran obradores de 器 y té).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 福田農園 | 圃場１他 | 佐賀県佐賀市木原1丁目359-1　他 | 有機農産物 | SES-1708091 |
| 株式会社東洋新薬 | 株式会社東洋新薬　鳥栖工場　他 | 佐賀県鳥栖市弥生が丘7-28　他 | 有機加工食品 | SGS/JP/JASO-N002 |
| 有限会社原製茶園 | 有限会社原製茶園 | 佐賀県武雄市西川登町大字神六20420-1 | 有機加工食品 | 0612-B03 |
| 岡本正廣 | 1他 | 佐賀県唐津市北波多成渕竹木場2777-2他 | 有機農産物 | 0704-A02 |
| 有限会社アロマ珈琲 | 有限会社アロマ珈琲三瀬珈琲工房他 | 佐賀県佐賀市三瀬村三瀬92-1他 | 有機加工食品 | 加-0006 |
| 古賀正孝 | 1-1他 | 佐賀県鳥栖市下野町下畑田1379他 | 有機農産物 | 0705-A04 |
| 佐賀大学生物資源教育研究センター | 1他 | 佐賀県佐賀市久保泉町下和泉1841他 | 有機農産物 | 0709-A02 |
| （株）オニザキコーポレーション | （株）オニザキコーポレーション　多久美舎他 | 佐賀県多久市北多久町大字多久原306-23　他 | 有機加工食品 | 第1054号 |
| 佐藤農場株式会社 | 佐藤農場株式会社 | 佐賀県鹿島市大字飯田乙3574 | 有機加工食品 | 加-0088 |
| 中村（克）有機農園 | 圃場1 他 | 佐賀県佐賀市三瀬村三瀬土師2180-10他 | 有機農産物 | SES-24103001 |
| 佐々木励 | 1 | 佐賀県唐津市浜玉町横田上513‐1,514-3 | 有機農産物 | 0090 |
| 農事組合法人　武雄そだちレモングラスハッピーファーマーズ | 川内圃場団地　他 | 佐賀県武雄市若木大字本部14904－1　他 | 有機農産物 | SES-24122001 |
| 九州薬品工業株式会社 | 加工工場他 | 佐賀県鳥栖市永吉町580-4他 | 有機加工食品 | SEZ-25010701 |
| 嬉野オリーブ農園 | 1 他 | 佐賀県嬉野市塩田町大字馬場下畦川内2丙145 他 | 有機農産物 | 1306-A01 |
| 中島農園 | 中島農園　圃場4他 | 佐賀県杵島郡白石町大字八平新開1055,1056　他 | 有機農産物 | SES-24100101 |
| 自然社中 | 松尾清美　松尾圃場1他 | 佐賀県伊万里市大坪町乙753-1他 | 有機農産物 | SES-25061101 |
| 山田農園 | 椎の木　他 | 佐賀県唐津市巌木町天川1000　他 | 有機農産物 | SES-27051101 |
| 株式会社マルハ園芸 | れんこん洗浄・選別　他 | 佐賀県杵島郡白石町大字新拓46-4 | 有機加工食品 | 1508-B01 |
| 合同会社Ｒelation　Ｔea | 第一工場他 | 佐賀県武雄市山内町三間坂甲13350-1他 | 有機加工食品 | SEZ-28012001 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/saga.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
  - **propia** — búsqueda dirigida por producto; ficha o web propia del productor
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/saga.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **5 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| ㈲古賀製麺 | 神埼市 | Pan y cereal | 全乾麺 | https://kogaseimen.com/ | 機械製乾めん |
| 有限会社井上製麺 | 神埼市 | Pan y cereal | 全乾麺 | http://www.iimen.com/top/index.html | 機械製乾めん |
| 住吉海苔本舗 | ⚠ | Pescado | búsqueda dirigida + web propia | https://sumiyosinori.com/ | ⚠ la web devolvió 503 en la comprobación; nori de Ariake |
| 川原茶業 | 嬉野市 | Té e infusiones | búsqueda dirigida + web propia | https://nabeshimahan.com/ | うれしの茶 |
| 徳永製茶（茶荘徳永） | 嬉野市 | Té e infusiones | búsqueda dirigida + web propia | https://japaneseteashop.com/ | うれしの茶, 産地製茶問屋 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/saga.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/saga> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 8, Huevos 3, Setas 2, Pan y cereal 2, Miel 1, Lácteos y quesos 1, Pescado 1, Carne 1, Legumbres 1, Conservas 1, Dulces y repostería 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| はらまき養蜂場 | 神埼市 | Miel | ficha | — | https://www.tabechoku.com/producers/22806 |  |
| ミルン牧場 | 佐賀市 | Lácteos y quesos | ficha | — | https://www.tabechoku.com/producers/28847 |  |
| 素ヱコ農園 | 伊万里市 | Huevos | ficha | — | https://www.tabechoku.com/producers/23834 |  |
| 本間農園 | 神埼市 | Huevos | ficha | — | https://www.tabechoku.com/producers/20652 |  |
| 上田養鶏場 | 鹿島市 | Huevos | ficha | — | https://www.tabechoku.com/producers/23452 |  |
| 小室　光春 | 佐賀市 | Setas | ficha | — | https://www.tabechoku.com/producers/24350 |  |
| 満天きくらげ | 有田町 | Setas | ficha | — | https://www.tabechoku.com/producers/21655 | 佐賀県西松浦郡有田町 |
| はしま海苔 | 小城市 | Pescado | ficha | — | https://www.tabechoku.com/producers/3078216 |  |
| みつせ鶏本舗 | 吉野ヶ里町 | Carne | ficha | — | https://www.tabechoku.com/producers/3078630 | 佐賀県神埼郡吉野ヶ里町 |
| 光吉農産 | 佐賀市 | Legumbres | ficha | — | https://www.tabechoku.com/producers/3077373 |  |
| 小池農園漬物加工所 | 鹿島市 | Conservas | ficha | — | https://www.tabechoku.com/producers/23713 |  |
| ジョブクリエイト | 小城市 | Dulces y repostería | ficha | — | https://www.tabechoku.com/producers/27438 |  |
| 自然栽培専門店「自然栽培園北村」 | 佐賀市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/8 |  |
| 白浜農産 | 白石町 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/16 | 佐賀県杵島郡白石町 |
| 丸尾農園 | 伊万里市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22431 |  |
| 山和農園 | 伊万里市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20436 |  |
| えがちゃん農園 | 佐賀市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21650 |  |
| トゥルーバファーム佐賀 | 唐津市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077599 |  |
| 嬉野茶　池田農園 | 嬉野市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21819 |  |
| 松永緑茶園 | 嬉野市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23567 |  |
| れんこんの家 やました | 白石町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22132 | 佐賀県杵島郡白石町 |
| ベリーフォレスト | 鳥栖市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077495 |  |
