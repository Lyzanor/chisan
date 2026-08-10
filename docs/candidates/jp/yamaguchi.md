# Yamaguchi — candidatos

- CSV: `data/csv/jp/chugoku/yamaguchi.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/yamaguchi> (40 bodegas, leído 2026-08-04). Gremio: 山口県酒造組合, <http://y-shuzo.com/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Asahi Shuzo | 旭酒造 | Iwakuni ⚠ |
| Sakai Shuzo | 酒井酒造 | Iwakuni |
| Ohmine Shuzo | 大嶺酒造 | Mine |
| Iwasaki Shuzo | 岩崎酒造 | Hagi |
| Ichimaru Shuzo | 一〇酒造 | Hagi |
| Okazaki Shuzojo | 岡崎酒造場 | Hagi |
| Abunotsuru Shuzo | 阿武の鶴酒造 | Abu |
| Kono Shuzo | 河野酒造 | Abu |
| Otsu Shurui Jozo | 大津酒類醸造 | Nagato |
| Kozaki Shuzo | 小崎酒造 | Nagato |
| Otokojiman Shuzo | 男自慢酒造 | Shunan |
| Kanemitsu Shuzo | 金光酒造 | Yamaguchi ⚠ |
| Kinbundo Shuzo | 金分銅酒造 | Kudamatsu |
| Kodama Shuzo | 児玉酒造 | Shimonoseki |

## Trampas
- ⚠ **旭酒造 (Iwakuni) es la del 獺祭 (Dassai)**, probablemente el sake japonés
  más exportado. Es el cuarto 旭酒造 del catálogo — con Meiwa (Mie), Echizen
  (Fukui) y Nagaoka (Niigata), la de 久保田. Mismo 社名 exacto, cuatro empresas:
  ver la lista completa en `mie.md`. El `nombre` público aquí es casi seguro
  **Dassai**, no la razón social.
- ⚠ **金光酒造 (Yamaguchi-shi)** no es 金光酒造 (Higashihiroshima), en
  `hiroshima.md`.
- **岡崎酒造場 (Hagi)** no es 岡崎酒造 (Ueda, Nagano), en `nagano.md`; y **岡崎市
  (Okazaki)** es además una ciudad de Aichi donde está el Hatcho miso del CSV.
  Rōmaji `Okazaki` = tres cosas distintas.
- 阿武郡阿武町 (Abu) no es municipio distinto de su 郡 homónimo: la fila lleva
  阿武町.

## Qué falta
- Las ~26 bodegas restantes del censo.
- Sin abrir: **ふぐ (fugu) de Shimonoseki** — el mercado de Haedomari es el único
  del mundo especializado y hay elaboradores con marca; **夏みかん de Hagi** (la
  naranja de verano nació ahí, con mermeladas y confitados artesanos);
  岩国れんこん, 長門ゆずきち, 見蘭牛 y 無角和種, わさび de Yamaguchi,
  外郎 (uiro) de Yamaguchi-shi.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 有限会社土井ヶ浜農園 | ４　他 | 山口県下関市豊北町神田上3099　他 | 有機農産物 | 0608-A06 |
| 株式会社原田食品 | 株式会社原田食品 周東工場　他 | 山口県岩国市周東町上久原1901-1　他 | 有機加工食品 | N9386J03 |
| 錦町農産加工グループ | 錦町農産加工株式会社　他 | 山口県岩国市錦町府谷131番地　他 | 有機加工食品 | MPJP1159 |
| 株式会社セイシン企業　山口宇部寿工場 | 株式会社セイシン企業　山口宇部寿工場 | 山口県宇部市山中甲石７００－３ | 有機加工食品 | SEZ-24011601 |
| 藤井健二 | 16　他 | 山口県防府市富海419-1　他 | 有機農産物 | 11A-0003 |
| 岩田珈琲店 | 岩田珈琲店 | 山口県熊毛郡上関町大字祝島3675 | 有機加工食品 | B08-111901 |
| 亀の甲農園（代表　三隅忠典） | 1　他 | 山口県山陽小野田市大字小野田笹原1745-1　他 | 有機農産物 | 114-041 |
| 藤井　秀一 | 3　他 | 山口県美弥市美東町大田字峠口359、360、361　他 | 有機農産物 | A14-102701 |
| 福本自然農園 | 8　他 | 山口県熊毛郡田布施町下田布施天瀬1920・1921-1　他 | 有機農産物 | A15-111901 |
| 株式会社MIHORI | MIHORIセントラルキッチン | 山口県山口市大内矢田南6丁目8-8 | 有機加工食品 | B16-042701 |
| 石田　俊文 | No.1　他 | 山口県大島郡周防大島町西安下庄尾崎2261-1　他 | 有機農産物 | A16-110401 |
| 株式会社みほりファーム | A2　他 | 山口県防府市大字上右田字西上河原2539-1　他 | 有機農産物 | A18-101801 |
| 株式会社エコファーム山口 | 1　他 | 山口県周南市大字金峰東兼田2502-2、2503-3、2504、2522-1、2522-2　他 | 有機農産物 | NA-18112902 |
| 株式会社ゆめファーム | 深野Ａ　他 | 山口県山口市仁保下郷森河 1428　他 | 有機農産物 | 19A-0001 |
| 株式会社サンピット | 4　他 | 山口県熊毛郡平生町大字平生町546－2、546－4、546－6、546－7、551－33　他 | 有機農産物 | 19A-0003 |
| 株式会社藤本コーポレーション | S1、S2（発生・収穫） | 山口県柳井市南浜３丁目１－１ | 有機農産物 | 農-0153 |
| 農業クエスト | 6　他 | 山口県岩国市周東町祖生547-1　他 | 有機農産物 | J35A-2010 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/yamaguchi.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/yamaguchi.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **3 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 宇部蒲鉾 | ⚠ | Pescado | búsqueda dirigida + web propia | https://www.ubekama.com/ | ⚠ desde 2024 opera como 北九州ニッスイ宇部工場: comprobar quién elabora hoy |
| 杉本利兵衛本店 | ⚠ | Pescado | búsqueda dirigida | — | ⚠ sin dominio recogido; 焼き抜き蒲鉾 en Hofu |
| 村田蒲鉾店 | ⚠ | Pescado | búsqueda dirigida | — | ⚠ sin dominio recogido; Hagi |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/yamaguchi.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/yamaguchi> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 7, Pescado 4, Setas 2, Pan y cereal 2, ⚠ por decidir 2, Miel 1, Huevos 1, Carne 1, Condimentos 1, Frutos secos 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 西岡養蜂場 | 下関市 | Miel | ficha | — | https://www.tabechoku.com/producers/3077346 |  |
| ルネサンスエコファーム | 防府市 | Huevos | ficha | — | https://www.tabechoku.com/producers/21739 |  |
| RYOMA KINOKO FARM | 下関市 | Setas | ficha | — | https://www.tabechoku.com/producers/3077426 |  |
| きくらげの里 | 柳井市 | Setas | ficha | — | https://www.tabechoku.com/producers/22735 |  |
| 嵩海丸 | 下関市 | Pescado | ficha | — | https://www.tabechoku.com/producers/28825 |  |
| 七福丸 | 宇部市 | Pescado | ficha | — | https://www.tabechoku.com/producers/25133 |  |
| 【長州床波の海人】瀬戸内ブランド | 宇部市 | Pescado | ficha | — | https://www.tabechoku.com/producers/3078611 |  |
| 竜王丸　中村竜司 | 萩市 | Pescado | ficha | — | https://www.tabechoku.com/producers/22411 |  |
| ホホヱミ農園 | 長門市 | Carne | ficha | — | https://www.tabechoku.com/producers/3077728 |  |
| 白上わさび | 岩国市 | Condimentos | ficha | — | https://www.tabechoku.com/producers/26683 |  |
| 小野養豚 | 萩市萩市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/28907 |  |
| 粟屋農場 | 防府市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/20059 |  |
| マロマロファーム | 田布施町 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/3078282 | 山口県熊毛郡田布施町 |
| ユーフォリア | 下関市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23194 |  |
| fu do ku kan Bamboo | 周南市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25434 |  |
| 土ノ音 | 周防大島町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28103 | 山口県大島郡周防大島町戸田 |
| 茶菜農園 | 大島群周防大島町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29164 |  |
| 西日本建設サービス | 宇部市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23488 |  |
| あわや自然農園 | 山口市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29168 |  |
| 長門アグリスト | 長門市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23229 |  |
| 畦花 azehana | 下関市 | ⚠ por decidir | — | — | https://www.tabechoku.com/producers/25784 |  |
| 【百万石ブランド】長州植村総本家 | 下関市 | ⚠ por decidir | — | — | https://www.tabechoku.com/producers/28827 |  |
