# Chiba — candidatos

- CSV: `data/csv/jp/kanto/chiba.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/chiba> (40 bodegas, leído 2026-08-04). Gremio: 千葉県酒造組合, <http://www.chiba-sake.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Iinuma Honke | 飯沼本家 | Shisui |
| Asahitsuru | 旭鶴 | Sakura |
| Iida Honke | 飯田本家 | Katori |
| Iida Shuzojo | 飯田酒造場 | Choshi |
| Ishigami Shuzo | 石上酒造 | Choshi |
| Kubota Shuzo | 窪田酒造 | Noda |
| Aoyagi Shuzo | 青柳酒造 | Yokoshibahikari |
| Umeichirin Shuzo | 梅一輪酒造 | Sanmu |
| Kankiku Meijo | 寒菊銘醸 | Sanmu |
| Inaka Shuzo | 稲花酒造 | Ichinomiya |
| Kidoizumi Shuzo | 木戸泉酒造 | Isumi |
| Iwase Shuzo | 岩瀬酒造 | Onjuku |
| Azumanada Jozo | 東灘醸造 | Katsuura |
| Kameda Shuzo | 亀田酒造 | Kamogawa |

## Trampas
- **`chiba` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español: las filas de la capital pasan el gate sin tocar
  nada. No re-resolverlo.
- **合同酒精 東京工場 (Matsudo)** es planta de grupo y encima lleva «Tokio» en el
  nombre estando en Chiba: triar, y si entra, el municipio es Matsudo.
- **小泉酒造** aparece sin municipio en la fuente (es Fusa, 富津市): resolver antes
  de escribir.
- 山武郡, 長生郡, 夷隅郡, 印旛郡 no son municipio: la fila lleva el 町.

## Qué falta
- Las ~26 bodegas restantes del censo.
- **醤油**: Chiba es la capital mundial de la salsa de soja — Noda (Kikkoman) y
  Choshi (Yamasa, Higeta) — y no hay ni una fila. El frente más obvio de la
  prefectura, con la cautela de que los tres son grupos industriales y lo que
  interesa son las casas pequeñas de la misma cuenca.
- Sin abrir: cacahuete de Yachimata (casi todo el nacional), 落花生, marisco de
  Boso, 海苔 de Tokyo Bay, なめろう.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| TOPPANパッケージングサービス株式会社 袖ケ浦ビバレッジ工場 | TOPPANパッケージングサービス株式会社　袖ケ浦ビバレッジ工場 | 千葉県袖ヶ浦市川原井480-1 | 有機加工食品 | MPJP1145 |
| （株）ドトールコーヒー　関東工場 | （株）ドトールコーヒー　関東工場 | 千葉県船橋市高瀬町21-6 | 有機加工食品 | 第1058号 |
| ちば醤油株式会社 | ちば醤油株式会社　本社工場 | 千葉県香取市木内1208 | 有機加工食品 | GMJP1231 |
| 株式会社万直商店 | 株式会社万直商店　他 | 千葉県流山市加4丁目3番地の3　他 | 有機加工食品 | 201051401 |
| 株式会社東京めいらく | 株式会社東京めいらく　千葉工場 | 千葉県佐倉市大作1-5-1 | 有機加工食品 | 第1235号 |
| 有限会社ワタミファーム　山武農場 | 113　他 | 千葉県山武市横田辻824-2、9　他 | 有機農産物 | A02-120401 |
| 有限会社ワタミファーム　佐原農場 | 607　他 | 千葉県香取市大根磯花1670-1、1670-2　他 | 有機農産物 | A06-080702 |
| 有限会社寺島農場 | 寺-若-1(秋田)　他 | 千葉県旭市秋田1353　他 | 有機農産物 | 101032001 |
| ヤマサ醤油株式会社 | ヤマサ醤油株式会社　他 | 千葉県銚子市新生町2-10-1　他 | 有機加工食品 | 010201-001 |
| 日東珈琲（株） | 日東珈琲（株） 千葉工場 他 | 千葉県山武市松尾町富士見台208-71 　他 | 有機加工食品 | 第1082号 |
| 日新化工（株）　船橋工場 | 日新化工（株）　船橋工場　他 | 千葉県船橋市高瀬町21-9　他 | 有機加工食品 | JN91018PR-0287-0 |
| （有）北総ベジタブル | 32　他 | 千葉県香取郡多古町一鍬田大ヨロ9-3　他 | 有機農産物 | JH061222FA-1311-0 |
| 農事組合法人　さんぶ野菜ネットワーク | 浅野誠士6　他 | 千葉県山武市実門横田入246-1　他 | 有機農産物 | JS061215FA-0941-0 |
| ニック食品株式会社 | ニック食品株式会社　本社工場 | 千葉県船橋市高瀬町23番地 | 有機加工食品 | 0043 |
| （株）川越屋　千葉工場 | （株）川越屋　千葉工場 | 千葉県山武郡横芝光町屋形3660 | 有機加工食品 | JK030227PR-0642-0 |
| 自然農法成田生産組合 | 高橋　博　６　他 | 千葉県富里市富山298-4　他 | 有機農産物 | JS000828FA-0128-0 |
| 柏原誠 | 圃場1-1 | 千葉県香取郡多古町林字金成台1527 | 有機農産物 | JS000828FA-0869-56 |
| 大谷晴美 | 大谷晴美1  他 | 千葉県香取郡多古町喜多井野750  他 | 有機農産物 | JK020910FA-0673-5 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/chiba.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

**Ya integrado, no volver a proponer:** 寒菊銘醸 ya está en `chiba.csv` como `Sake`; 九十九里オーシャンビール sería otra fila del mismo obrador.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/chiba.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/chiba.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
- Estado: **5 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| ささや | 千葉市 | Dulces y repostería | 和菓子協会 | http://www.k-sasaya.jp | 千葉市稲毛区緑町 1-24-2 |
| もりしん | 千葉市 | Dulces y repostería | 和菓子協会 | http://www.morishin-chiba.com | 千葉市若葉区みつわ台 2-10-16 |
| なごみの米屋 | 成田市 | Dulces y repostería | 和菓子協会 | http://www.nagomi-yoneya.co.jp/ | 成田市上町 500 |
| 房洋堂 | 館山市 | Dulces y repostería | 和菓子協会 | http://www.boyodo.co.jp | 館山市安布里 780 |
| 茂野製麺㈱ | 鎌ヶ谷市 | Pan y cereal | 全乾麺 | https://www.shigeno.co.jp/ | 機械製乾めん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/chiba.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/chiba> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 東京湾水産 | 富津市 | Pescado | https://www.tabechoku.com/producers/20925 | 漁師一筋38年！ |
| 不動丸 | 旭市 | Pescado | https://www.tabechoku.com/producers/20417 | 千葉県九十九里浜最東端の旭市で漁師をさせて頂いております、不動丸・遠藤です。 |
| 鈴常丸 | 船橋市 | Pescado | https://www.tabechoku.com/producers/22463 | 千葉県船橋市で貝捲き漁師をしてます鈴木と申します。 |
| ジェリービーンズ | 多古町 | Carne | https://www.tabechoku.com/producers/24550 | 消費者が安心して口にできる、おいしい豚肉を届けたい。 |
| 戸辺養鶏場 | 野田市 | Carne | https://www.tabechoku.com/producers/23733 | 戸辺養鶏場は昭和33年（1958年）より、千葉県野田市で運営しています。 |
| 豊受きのこ園 | 我孫子市 | Setas | https://www.tabechoku.com/producers/25605 | 千葉県我孫子市で千葉県産菌床しいたけ栽培をしています豊受きのこ園です。 |
| きのこ屋でんべえ | 旭市 | Setas | https://www.tabechoku.com/producers/20616 | 千葉県北東部の旭市でマッシュルームを栽培しています。 |
| ハチミツさん | いすみ市 | Miel | https://www.tabechoku.com/producers/21957 | 私たちは2015年にミツバチと出会い、ミツバチ自体の可愛さ、ミツバチ社会の不思議さ、飼育の面白さ、奥深さ、そして自然の蜂蜜の美味しさに魅了さ |
| ONE DROP FARM | 市原市 | Miel | https://www.tabechoku.com/producers/3077998 | 千葉県市原市の里山ではちみつと有機野菜を生産しています。 |
| 留守農場 | 八街市 | Legumbres | https://www.tabechoku.com/producers/22946 | 落花生の産地である、千葉県八街市にて親子3代にわたって年間60種類の野菜を生産しています。 |
| 大倉モーモー農園 | 千葉市 | Legumbres | https://www.tabechoku.com/producers/3078158 | 千葉市の自然豊かな地で、牛の堆肥を使った土作りにこだわり、生育には農薬を使わずに落花生を育てています。 |
| ヤマハン | 旭市 | Legumbres | https://www.tabechoku.com/producers/28505 | 千葉県旭市で落花生の卸問屋を営んでいます。 |
| 漬物工房彩 | 香取市 | Conservas | https://www.tabechoku.com/producers/24128 | (株)漬物工房彩は、10年前に設立した千葉県香取市の漬物加工を営む農場及び食品製造会社です。食を扱う企業として「安心、安全、高品質な商品をお |
| 輝農塾 | 千葉市 | Pan y cereal | https://www.tabechoku.com/producers/23284 | 千葉市緑区にて、お米の栽培をしております。 |
| ののま自然農園 | 君津市 | Pan y cereal | https://www.tabechoku.com/producers/20073 | 千葉県君津市にて、不自然でない暮らしを目指して農薬や肥料を使わずに野菜やお米を栽培しています。 |
| ラグエルジャパン | 市原市 | Pan y cereal | https://www.tabechoku.com/producers/29583 | 【高滝湖ブルーベリー】湖畔にすむ小さな妖精の物語（ラグエルジャパンブランド） |
| ベジLIFE!! | 我孫子市 | Fruta y verdura | https://www.tabechoku.com/producers/73 | 野菜を通じて“人生を素晴らしいモノにしませんか？”そんな意味を込めて『ベジLIFE!!』という農園を始めました。 |
| 和か葉農園 | 野田市 | Fruta y verdura | https://www.tabechoku.com/producers/29215 | オーガニック野菜を中心に栽培しています！ |
| こもれび果実 | 鎌ヶ谷市 | Fruta y verdura | https://www.tabechoku.com/producers/3079015 | 2025年から千葉県 鎌ケ谷市にて梨の生産・販売をスタートさせました。 |
| アグリヨシノ | 八街市 | ⚠ por decidir | https://www.tabechoku.com/producers/26865 | ◆お客さまへのごあいさつ◆ |
| おかざきファーム | 南房総市 | ⚠ por decidir | https://www.tabechoku.com/producers/25506 | 2020年より夫婦で農業を始めました。 |
| ksfarm | 白井市 | ⚠ por decidir | https://www.tabechoku.com/producers/22632 | 食べチョク3年目 |
