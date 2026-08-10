# Kanagawa — candidatos

- CSV: `data/csv/jp/kanto/kanagawa.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/kanagawa> (13 bodegas, censo completo). Gremio: 神奈川県酒造組合, <http://www.kanagawa-jizake.or.jp/>.
- Estado: cola abierta, 13 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Las 13 bodegas de Kanagawa están en el **oeste rural** (Ashigara, Hadano, Atsugi)
y ninguna en Yokohama ni Kawasaki. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Izumibashi Shuzo | 泉橋酒造 | Ebina |
| Kumazawa Shuzo | 熊澤酒造 | Chigasaki |
| Kikkawa Jozo | 吉川醸造 | Isehara |
| Kanai Shuzoten | 金井酒造店 | Hadano |
| Koganei Shuzo | 黄金井酒造 | Atsugi |
| Oyataka Shuzo | 大矢孝酒造 | Aikawa |
| Kubota Shuzo | 久保田酒造 | Sagamihara |
| Shimizu Shuzo | 清水酒造 | Sagamihara |
| Ishii Jozo | 石井醸造 | Oi |
| Inoue Shuzo | 井上酒造 | Oi |
| Kawanishiya Shuzoten | 川西屋酒造店 | Yamakita |
| Seto Shuzoten | 瀬戸酒造店 | Kaisei |
| Nakazawa Shuzo | 中澤酒造 | Matsuda |

## Trampas
- **熊澤酒造 (Chigasaki)** hace sake *y* 湘南ビール: es **una fila**, con la
  `categoria` que pese, no dos (misma regla que Kiuchi en `ibaraki.md`).
- 足柄上郡 y 愛甲郡 no son municipio: la fila lleva el 町 — Oi, Yamakita, Kaisei,
  Matsuda, Aikawa. **石井醸造 e 井上酒造 comparten municipio (Oi)** y apellido
  parecido: casar por 社名.
- **久保田酒造 (Sagamihara)** no es 久保田 (marca de 朝日酒造, Nagaoka, Niigata) ni
  窪田酒造 (Noda, Chiba). Tres cosas distintas con el mismo rōmaji.

## Qué falta
- Ninguna: el censo de sake está completo aquí. Lo que falta es todo lo demás.
- Sin abrir: 湘南 pescado (shirasu de Enoshima), 三浦 verdura (daikon, col),
  **ternera de Yokohama**, 崎陽軒/中華街 (comida preparada), 小田原 kamaboko y
  himono (un gremio propio y bien documentado), té de Ashigara, 足柄 wasabi.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| アライドコーヒーロースターズ株式会社 | アライドコーヒーロースターズ株式会社　横浜第3工場　他 | 神奈川県横浜市都筑区佐江戸町157号　他 | 有機加工食品 | HWJP1484 |
| 三本珈琲株式会社 | 三本珈琲株式会社　鎌倉総合工場 | 神奈川県鎌倉市岩瀬1137-1 | 有機加工食品 | GMJP1097-01 |
| クラウンフーヅ株式会社 | クラウンフーヅ株式会社　横浜工場 | 神奈川県横浜市金沢区福浦2-1-4 | 有機加工食品 | MPJP1046-01 |
| 有限会社生豆屋 | 有限会社 生豆屋 | 神奈川県相模原市南区相南2－24－14 | 有機加工食品 | カ-01-01 |
| ジョイファーム小田原 | 関山　他 | 神奈川県足柄上郡中井町比奈窪字関山652　他 | 有機農産物 | 101121401 |
| 高梨乳業株式会社グループ | 足柄乳業株式会社 | 神奈川県足柄上郡中井町字岩倉上の原270ー1 | 有機加工食品 | MPJP1496 |
| 早藤果樹園芸 | 城堀山他 | 神奈川県足柄下郡湯河原町城堀浜道上下３９２他 | 有機農産物 | 104042101 |
| 小田原有機農法研究会 | 石綿敏久 ほ場1 他 | 神奈川県小田原市久野亀甲石4282-1 他 | 有機農産物 | 2008F-5 |
| 株式会社ウエシマコーヒー | 株式会社ウエシマコーヒー　横浜工場 | 神奈川県横浜市港北区新吉田東2-7-8 | 有機加工食品 | MPJP1605 |
| 亜東商事株式会社 | 新風食品株式会社　田名工場 | 神奈川県相模原市中央区田名塩田1-14-6 | 有機加工食品 | O-18 |
| 株式会社キャメル珈琲 | 株式会社キャメル珈琲　コーヒー事業部 | 神奈川県川崎市川崎区東扇島6-10かわさきファズ４Ｆ | 有機加工食品 | MPJP1702 |
| 株式会社アサヒコ | 株式会社アサヒコ　神奈川工場　第二 | 神奈川県綾瀬市小園1090 | 有機加工食品 | 第1002号 |
| 株式会社カリス成城 | 株式会社カリス成城　相模原事務所 | 神奈川県相模原市緑区下九沢1730-1 | 有機加工食品 | MPJP1767 |
| 株式会社ブルックス・ファーム・コーヒー | 株式会社ブルックス・ファーム・コーヒー　中井A工場　他 | 神奈川県足柄上郡中井町井ノ口2752-1　他 | 有機加工食品 | 第1506号 |
| 日清オイリオグループ株式会社　横浜磯子事業場 | 日清オイリオグループ株式会社　横浜磯子事業場 | 神奈川県横浜市磯子区新森町1番地 | 有機加工食品 | 2017S02 |
| 横浜自然農法会 | 栗原 明 1 他 | 神奈川県横浜市都筑区池辺町1563-1、1563-2、1568-1 他 | 有機農産物 | 2007F-1 |
| 株式会社ユニカフェ | 株式会社ユニカフェ　神奈川総合工場　他 | 神奈川県愛甲郡愛川町中津字桜台4026-9　他 | 有機加工食品 | O-5 |
| 有限会社　碧山園 | H　他 | 神奈川県愛甲郡愛川町角田1521-1　他 | 有機農産物 | A18-042006 |
| ハマヤ（株）湘南工場 | ハマヤ（株）湘南工場 | 神奈川県平塚市堤町3-10 | 有機加工食品 | HJ010322PR-1581-0 |
| 長島　和裕 | アイヅチ農園 | 神奈川県愛甲郡愛川町三増道城原1419-1、1420-1、1417　他 | 有機農産物 | 19-001 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/kanagawa.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
- Estado: revisión cerrada el 2026-08-10; **4** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 牧歌 | Atsugi | Lácteos y quesos | ChFun | — | solo Facebook en la fuente; revisado 2026-08-10: la guía no pudo enlazarse con una fuente primaria actual y localización completa |
| 鈴廣かまぼこ (箱根ビール) | Odawara | Cerveza | JBA | hakone-beer.com | kamaboko + cerveza; decidir categoría dominante; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 横浜ベイブルーイング | Yokohama | Cerveza | JBA | baybrewing.jp | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| N-1 (254BeeeR) | Yokohama | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

**Ya integrado, no volver a proponer:** 熊澤酒造 (湘南ビール) y 黄金井酒造 (さがみビール) ya están en `kanagawa.csv` como `Sake`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/kanagawa.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/kanagawa.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **10 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 右京 | 小田原市 | Dulces y repostería | 和菓子協会 | http://www.ukyou.jp/ | 小田原市本町 4-3-29 |
| 菓子匠　末広庵 | 川崎市 | Dulces y repostería | 和菓子協会 | http://www.suehiroan.co.jp/ | 川崎市川崎区東田町 3-16 |
| 文明堂 | 横浜市 | Dulces y repostería | 和菓子協会 | http://www.yokohama-bunmeido.co.jp/ | 横浜市中区伊勢佐木町 4-114
ライオンズプラザ伊勢佐木町通り 1F |
| 磯子風月堂 | 横浜市 | Dulces y repostería | 和菓子協会 | http://www.h5.dion.ne.jp/~isofuu | 横浜市磯子区磯子 2-21-7 |
| 御菓子司　名月 | 横浜市 | Dulces y repostería | 和菓子協会 | http://www.meigetsu.org/ | 横浜市金沢区六浦町 5-23-29 |
| 銚子屋 | 横浜市 | Dulces y repostería | 和菓子協会 | http://www.choshiya.co.jp/ | 横浜市中区伊勢佐木町 7-150 |
| ちもと | 箱根町 | Dulces y repostería | 和菓子協会 | http://yumochi.com/ | 足柄下郡箱根町湯本 509 |
| 合資会社三河屋 | 厚木市 | Aperitivos | 全国米菓工業組合 | http://atsugimikawaya.com/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 株式会社美濃屋あられ | 横浜市 | Aperitivos | 全国米菓工業組合 | https://www.minoya-arare.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 有限会社三河屋 | 茅ヶ崎市 | Aperitivos | 全国米菓工業組合 | https://www.mikawaya.co.jp/ | 米菓製造・販売業（直売所有り） |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/kanagawa.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/kanagawa> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 14, Pescado 3, Carne 2, Pan y cereal 2, Setas 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 永島農園 | 横浜市 | Setas | ficha | — | https://www.tabechoku.com/producers/21387 |  |
| 勘網 | 横須賀市 | Pescado | ficha | — | https://www.tabechoku.com/producers/27630 |  |
| 鉄釜ひじき　海藻の房丸 | 横須賀市 | Pescado | ficha | — | https://www.tabechoku.com/producers/27682 |  |
| 丸良水産 | 横須賀市 | Pescado | ficha | — | https://www.tabechoku.com/producers/20410 |  |
| 【ジビエ総本家】小田原貴族ブランド | 小田原市 | Carne | ficha | — | https://www.tabechoku.com/producers/3078438 |  |
| みやじ豚 | 藤沢市 | Carne | ficha | — | https://www.tabechoku.com/producers/22147 |  |
| 霜島農園 | 厚木市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/26962 |  |
| お米農家　曽我 | 小田原市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/26947 |  |
| 佐野農園 | 伊勢原市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29222 |  |
| あすなろファーム | 小田原市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21955 |  |
| くだかけ農園 | 山北町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078860 | 神奈川県足柄上郡山北町 |
| NO-RA ～農楽～ | 愛川町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21386 | 神奈川県愛甲郡愛川町 |
| 有機農園けのひ | 愛川町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23483 |  |
| Kururu farm | 横浜市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22819 |  |
| カメーダ農園 | 横浜市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/27186 |  |
| 鈴也ファーム | 横須賀市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20806 |  |
| ニッポンルーバス | 海老名市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28446 |  |
| 榎本農園 | 湯河原町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23067 | 神奈川県足柄下郡湯河原町 |
| ぶるべの樹 | 相模原市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21182 |  |
| さとくら農園 | 相模原市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078762 |  |
| 渋谷ファーム | 藤沢市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23858 |  |
| 子どもの野菜湘南藤沢農場 | 藤沢市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22165 |  |
