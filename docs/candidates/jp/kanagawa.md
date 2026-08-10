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
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/kanagawa> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| カメーダ農園 | 横浜市 | Pescado | https://www.tabechoku.com/producers/27186 | 慶長時代より続く農家の18代目で、就農して24年になります。消費者の方々に喜んで頂けるようにと日々野菜作りに精進しております。 |
| 勘網 | 横須賀市 | Pescado | https://www.tabechoku.com/producers/27630 | 神奈川県の相模湾で定置網漁業（小型）を行っています。 |
| 鉄釜ひじき　海藻の房丸 | 横須賀市 | Pescado | https://www.tabechoku.com/producers/27682 | 創業70年。鉄釜ひじき、わかめ、昆布の養殖販売。神奈川県横須賀市の浦賀で家族で釣り船を営み、同時に鉄釜ひじきわかめ昆布の養殖をしています。期 |
| 丸良水産 | 横須賀市 | Pescado | https://www.tabechoku.com/producers/20410 | 私は神奈川県横須賀市の走水という浜で海苔漁師をしています。 |
| 【ジビエ総本家】小田原貴族ブランド | 小田原市 | Carne | https://www.tabechoku.com/producers/3078438 | #🍖今までの肉では物足りない本物を知るあなたへ🍖 |
| くだかけ農園 | 山北町 | Carne | https://www.tabechoku.com/producers/3078860 | 神奈川県最後の秘境とも言われる西丹沢の山奥にある、一軒家の農家です。平飼い養鶏で卵を生産し、鶏糞を発酵させて野菜や米も生産しています。田畑は |
| 有機農園けのひ | 愛川町 | Carne | https://www.tabechoku.com/producers/23483 | 神奈川県愛川町で有機農業を営む小さな農園です。露地で年間80種類くらいの野菜を育てる他、ひまわりの油を絞ったり、農園で採れた野菜をたっぷり使 |
| みやじ豚 | 藤沢市 | Carne | https://www.tabechoku.com/producers/22147 | みやじ豚の宮治勇輔（みやじゆうすけ）です、こんにちは！ |
| 永島農園 | 横浜市 | Setas | https://www.tabechoku.com/producers/21387 | 横浜市の南端、金沢区で椎茸と木耳の生産をしている永島太一郎と申します。 |
| ぶるべの樹 | 相模原市 | Conservas | https://www.tabechoku.com/producers/21182 | 「ぶるべの樹」は、神奈川県でブルーベリーを生産、加工品製造・販売も行なう小さな農園です。６次産業化を主軸に、夏には期間限定でブルーベリー狩り |
| さとくら農園 | 相模原市 | Conservas | https://www.tabechoku.com/producers/3078762 | 神奈川丹沢山麗の集落から元オーナーシェフの園主による野菜セットと加工品(準備を進めております)をご用意致します。里山暮らしの食の豊かさと、四 |
| 佐野農園 | 伊勢原市 | Pan y cereal | https://www.tabechoku.com/producers/29222 | 神奈川県西部「大山(おおやま)」の麓で、安心安全を第一に米、果樹(梨，ブドウ)、野菜(筍)等を作っています。 小さな取組みが、少しずつでも、 |
| 霜島農園 | 厚木市 | Pan y cereal | https://www.tabechoku.com/producers/26962 | 霜島農園の霜島邦夫です。神奈川県厚木市に直売所を構え、主にブドウ、その他お米やもち麦を皆様に提供しています。地域の皆様やお客様に支えられ今年 |
| お米農家　曽我 | 小田原市 | Pan y cereal | https://www.tabechoku.com/producers/26947 | 酒匂川の流域で、先祖代々お米を栽培しています。 |
| 渋谷ファーム | 藤沢市 | Pan y cereal | https://www.tabechoku.com/producers/23858 | 神奈川県藤沢市でトマト、きゅうり、ブロッコリー、お米、時々レタス、ほうれん草、ミディトマト、ミニトマトなどなど |
| あすなろファーム | 小田原市 | Fruta y verdura | https://www.tabechoku.com/producers/21955 | 年退職後、素人から3000坪を有す敷地で梅の原種でクエン酸が豊富な杉田梅や野菜の栽培を20年近くやってきました。 |
| 鈴也ファーム | 横須賀市 | Fruta y verdura | https://www.tabechoku.com/producers/20806 | フォルクスワーゲン車のディーラーを経て2011年に家業の農家を継ぎました。 |
| 榎本農園 | 湯河原町 | Fruta y verdura | https://www.tabechoku.com/producers/23067 | 「違いの分かる、高品質なみかんを皆様の食卓に届けたい」 |
| 子どもの野菜湘南藤沢農場 | 藤沢市 | Fruta y verdura | https://www.tabechoku.com/producers/22165 | 2014年に多摩市役所を定年退職する最後の一年に、小学校の総合学習で野菜の有機栽培の授業と給食事務を担当。丁度その頃調布市で児童が給食を食べ |
| NO-RA ～農楽～ | 愛川町 | ⚠ por decidir | https://www.tabechoku.com/producers/21386 | 2009年に美しい河川と自然に囲まれた神奈川県愛川町で新規就農しました。 |
| Kururu farm | 横浜市 | ⚠ por decidir | https://www.tabechoku.com/producers/22819 | Kururu farm |
| ニッポンルーバス | 海老名市 | ⚠ por decidir | https://www.tabechoku.com/producers/28446 | 小さい頃から農業に関心をもって、大学では農学を学び、オランダやインドネシアへの農業留学を通じて、自らで農業をする決心をしました。小さい頃から |
