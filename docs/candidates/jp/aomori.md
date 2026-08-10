# Aomori — candidatos

- CSV: `data/csv/jp/tohoku/aomori.csv` (0 filas). Dedup: nada que cruzar en el CSV.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/aomori> (20 bodegas, leído 2026-08-04), contrastado con 酒蔵プレス <https://www.sakagura-press.com/sakebrewery/aomori-sake_14th/>. Gremio: 青森県酒造組合, <http://www.aomori-sake.or.jp/> (no resolvía por HTTPS el 2026-08-04, ver README).
- Estado: cola abierta, 15 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Nishida Shuzoten | 西田酒造店 | Aomori |
| Miura Shuzo | 三浦酒造 | Hirosaki |
| Rikka Shuzo | 六花酒造 | Hirosaki |
| Matsumidori Shuzo | 松緑酒造 | Hirosaki |
| Kaneta Tamada Shuzoten | カネタ玉田酒造店 | Hirosaki |
| Shirakami Shuzo | 白神酒造 | Hirosaki |
| Marutake Shuzoten | 丸竹酒造店 | Hirosaki |
| Yoshii Shuzo | 吉井酒造 | Hirosaki |
| Narumi Jozoten | 鳴海醸造店 | Kuroishi |
| Nakamura Kamekichi | 中村亀吉 | Kuroishi |
| Hato Masamune | 鳩正宗 | Towada |
| Momokawa | 桃川 | Oirase |
| Morita Shobei | 盛田庄兵衛 | Shichinohe |
| Sekinoi Shuzo | 関乃井酒造 | Mutsu |
| Takenami Shuzoten | 竹浪酒造店 | Tsugaru |
| Ozaki Shuzo | 尾崎酒造 | Ajigasawa |
| Kikukoma Shuzo | 菊駒酒造 | Gonohe |

## Trampas
- **八戸酒造 (Hachinohe Shuzo, Hachinohe)** ya está en la bandeja del `README.md`
  de esta carpeta: no volver a proponerla como nueva.
- **合同酒精 八戸工場** y **八戸酒類 (五戸工場 / 八鶴工場)** son plantas de un
  grupo, no bodegas con identidad propia. Triar antes de escribir fila: la
  unidad correcta puede ser el grupo en otra prefectura.
- Las dos fuentes discrepan en municipio para varias: SAKETIMES da 尾崎酒造 en
  「青森市・鰺ヶ沢町」 y 酒蔵プレス no lo sitúa. Manda dónde produce.

## Qué falta
- Las 3-5 bodegas restantes del censo.
- Sin abrir: manzana de Hirosaki (la primera de Japón y no hay ninguna fila),
  sidra, ajo de Takko, vieira y atún de Ōma, 煎餅 de Nanbu.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 有限会社ナチュラルファーム | 松原2南 | 青森県三沢市松原2丁目31-1663 | 有機農産物 | 101051402 |
| 自然農法はまなす会 | 鈴木 譲 1 他 | 青森県上北郡横浜町三保野51、52-1 他 | 有機農産物 | 2006F-18 |
| 中里町自然農法研究会 | 横山慶吉 1 他 | 青森県北津軽郡中泊町大字宮川字種取823 他 | 有機農産物 | 2006F-10 |
| 津軽みらい農協ときわ有機農産物部会 | 古川徹500201　他 | 青森県南津軽郡藤崎町大字福島字萢頭99　他 | 有機農産物 | 101122802 |
| あおもり南部有機生産組合 | 1 | 青森県上北郡おいらせ町向山東1丁目3220-1 | 有機農産物 | JA001101FA-0146-0 |
| みちのく有機共同農場 | 目名①　他 | 青森県東通村大字目名新田73　他 | 有機農産物 | NA-07071801 |
| 有限会社瑞宝 | 加工所 | 青森県北津軽郡中泊町大字中里字宝森339-3 | 有機加工食品 | 2009M-6 |
| 福士明宏 | 福士明宏 1 他 | 青森県青森市浪岡郷山前字永井17-1～2 他 | 有機農産物 | 2001F-60 |
| 城田　安幸 | 医果同源アップルバレー | 青森県南津軽郡大鰐町大字長峰字前田ノ沢115-1 | 有機農産物 | JS141111FA-1313-0 |
| 三上年 | 1 | 青森県弘前市大字宮地字菖富沢73,84　他 | 有機農産物 | JS000828FA-1364-63 |
| 和楽堂養生農苑 | 留目　昌明 | 青森県三戸郡南部町大字大向字明土39,41,63-1,63-2,65-1（通称：林）　他 | 有機農産物 | 600606P124 |
| 株式会社ＣＲＴワールド農園ナチュローブ | №8　他 | 青森県十和田市大字大沢田字笹舘195　他 | 有機農産物 | A17-122501 |
| 北上農園 | 北上俊博　他 | 青森県三戸郡五戸町大字浅水字高森42-1　他 | 有機農産物 | 600606P136 |
| アピイ ファーム | アピイ ファーム | 青森県東津軽郡平内町大字小湊字前萢53番地365 | 有機農産物 | 600606P145 |
| 市崎貴之 | 梅田 | 青森県十和田市大字相坂字白上135-16 | 有機農産物 | JI220808FA-1834 |
| かねさ株式会社 | かねさ株式会社 梵珠工場 | 青森県青森市浪岡大字徳才子字山本44-5 | 有機加工食品 | J02B-2235 |
| 大石平 | 貝沢 | 青森県弘前市貝沢字沢294　および　307-853の一部 | 有機農産物 | NA-23101801 |
| ㈱あいない | 27/山際 | 青森県八戸市南郷大字市野沢字高森5 | 有機農産物 | JA231127FA-1954 |
| すこやか自然農園株式会社 | 東　他 | 青森県上北郡六戸町大字折茂字沖山106-14　他 | 有機農産物 | J02A-2324 |
| （一社）日本販売農業協同団体連合会 | あおぞら農園　ほ場1　他 | 青森県むつ市大畑町字本門字寺前8番地　他 | 有機農産物 | 2024F-9 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/aomori.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| カネク醸造 (八戸ビール) | Hachinohe | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/aomori.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/aomori> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **18 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 7, Carne 4, Pescado 3, Pan y cereal 3, Destilados y licores 1, Setas 1, Legumbres 1, Condimentos 1, Bebidas sin alcohol 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| しあわせj-Farm | 平川市 | Destilados y licores | productos | 【青森県産】いちご＆ミルクアイス 110g×6P · わのたれ（焼肉のたれ）170g×2p ガツンと青森にんにく約一玉分！ · 黒にんにく＆焼肉のたれセット（各2p）【青森県産にんにく使用】 | https://www.tabechoku.com/producers/26873 | repr. 木村 祝幸 |
| さくらの杜　（さくらのもり） | 弘前市 | Setas | productos | 極厚！食べ応えあり！肉厚しいたけ（菌床） 2ｋｇ · 極厚！食べ応えあり！肉厚しいたけ（菌床） 1.5ｋｇ · 極厚！食べ応えあり！肉厚しいたけ（菌床） 500ｇ | https://www.tabechoku.com/producers/24838 |  |
| 盛漁丸 | 中泊町 | Pescado | productos | 新鮮!!小泊産天然サザエ（2kg） · 活き活き!! 小泊産天然サザエ1kg · 小泊産！ボイルサザエ100g×3パック（冷凍） おまけ付き！ | https://www.tabechoku.com/producers/26686 | premio 食べチョクAWARD; 青森県北津軽郡中泊町小泊 |
| KANEHO | 大間町 | Pescado | productos | 青森県大間産 塩うに２本セット・切り落とし2Pセット · 大間マグロ 赤身 · 【訳あり】大間まぐろ中トロ200g前後 | https://www.tabechoku.com/producers/26918 | repr. 創業：2017年02月; premio 食べチョクAWARD; 青森県下北郡大間町 |
| 未来丸 | 深浦町 | Pescado | ficha | 【青森県産】天然サザエ 1kg（8～12個）砂抜き済み｜壺焼き・お刺身・BB · 【砂抜き済み 2kg】 『青森県産』天然サザエ 壺焼き・お刺身OK！ | https://www.tabechoku.com/producers/3078215 | repr. 創業：2022年06月; 青森県西津軽郡深浦町 |
| LOCO-SIKIミート | 七戸町 | Carne | productos | 【ギフト】【御中元】青森アップルポークのしゃぶしゃぶセット（3～4人前・豚肉 · 【ギフト】【御中元】青森アップルポークのごま味噌あったか鍋セット（3～4人前 · 【お得】【ご家庭用】青森アップルポーク ロースブロック １㎏ | https://www.tabechoku.com/producers/21044 | 青森県上北郡七戸町 |
| おおわにシャモロックファーム | 大鰐町 | Carne | productos | 希少部位！ 特産地鶏 青森シャモロック 手羽元 約500g（8～10個前後） · 【夏ギフト】 極上の出汁！ 青森シャモロック2種食べ比べセット しゃぶしゃぶ · 【夏ギフト】 希少な地鶏をお家で堪能 青森シャモロック 焼肉セット （400 | https://www.tabechoku.com/producers/3077535 |  |
| オーク牧場 | 田子町 | Carne | ficha | 田子町産にんにく１ｋｇ【バラ】 · 訳あり着色にんにく【ばら１ｋｇ】訳ありのため大特価・数量限定 · 田子町産にんにく500ｇ【バラ】 | https://www.tabechoku.com/producers/26473 | repr. 創業：2019年01月 |
| 鎌田林檎園 | 黒石市 | Carne | productos | 早生りんごの定番のりんご！つがる（9個から12個）収穫後すぐに発送！ · 今季第1弾！収穫後すぐに発送！夏りんご「シナノレッド」爽やかな味わい （9個 · 「ブラムリー」加工用 5キロ箱 約13個～20個 | https://www.tabechoku.com/producers/22386 | premio 食べチョクAWARD |
| メルふぁーむ | つがる市 | Legumbres | productos | 【農薬化学肥料不使用】やめられない止まらない！青森の『毛豆』300g×4p令 · 【農薬化学肥料不使用】やめられない止まらない！青森の『毛豆』300g×8p令 · 【農薬化学肥料不使用】小ぶりでトウモロコシのような甘み『つがるの茶豆３号』3 | https://www.tabechoku.com/producers/28589 |  |
| 十三湖からの贈り物 | 五所川原市 | Condimentos | productos | まずはお試し！十三湖産お得な小サイズ2kg · 【朝どれ】十三湖産「大和しじみ」中サイズ2kg · 大人気【夏ギフト】十三湖産「大和しじみ」中サイズ3kg | https://www.tabechoku.com/producers/3078329 |  |
| グルメ通り　SHOP | つがる市 | Pan y cereal | productos | ネバ玄粒 玄小麦 中力系 800g 青森県産単一品「ネバリゴシ」100％ 日 · 【栽培期間中農薬不散布】ネバ石全 全粒粉 石臼挽き 中力粉 400g 青森県 · 旨みを最大限に引き上げた「津軽黒にんにく」 訳あり 200g 100g×2  | https://www.tabechoku.com/producers/29622 | repr. 小田桐賢一 |
| みっきいファーム | 五所川原市 | Pan y cereal | productos | 【新米】令和7年産 青森県産はれわたり玄米10キロ 【お願い】※商品説明欄必 | https://www.tabechoku.com/producers/3078593 |  |
| 權之丞 | 弘前市 | Pan y cereal | productos | 青森県産米 【はれわたり】 10㎏（白米）2025年産 · 青森県産米 【はれわたり】 5㎏（白米）2025年産 · 青森県産米 【まっしぐら】 10㎏（白米）2025年産 | https://www.tabechoku.com/producers/27574 | repr. 中田憲吾 |
| もりやま園 | 弘前市 | Bebidas sin alcohol | productos | 農薬5割減・化学肥料不使用の特別栽培りんご🍎🍏おまかせりんご3種食べ比べ3k · 【9月発送】酸っぱいりんご好きさん必見！希少品種🍎彩香🍎3kg 特別栽培りん · 【12月発送】人気No.1🍎サンふじ＆王林食べ比べセット🍏3kg キズなし良 | https://www.tabechoku.com/producers/23770 | premio 食べチョクAWARD |
| ツガルユキドケファーム | つがる市 | Fruta y verdura | ficha | 一年分の雪が、この一瞬の甘さになりました。 ◆夏ギフト 食べチョク限定100 | https://www.tabechoku.com/producers/27264 | repr. 創業：2021年05月 |
| 新栄農場 | むつ市 | Fruta y verdura | productos | 2026｛予約｝ スイカ 大玉 6㌔-8㌔ 盆明け出荷 まさかりすいか · 【2026新物】青森にんにく 訳ありバラ500g お得 ホワイト六片 家庭用 · 訳アリ 黒にんにく 青森産 福地ホワイト六片 500ｇ | https://www.tabechoku.com/producers/20860 | premio 食べチョクAWARD |
| なんごうゆめファーム | 八戸市 | Fruta y verdura | productos | 【農薬・化学肥料不使用】MOA自然農法で育った夏にんじん 3kg · 【農薬・化学肥料不使用】MOA自然農法で育った訳あり夏にんじん 2kg · 訳あり品【農薬・化学肥料不使用】MOA自然農法で育った 長芋1キロ | https://www.tabechoku.com/producers/20165 | repr. 創業：2017年03月; premio 食べチョクAWARD |
| たっちゃんちの食材 | 十和田市 | Fruta y verdura | ficha | R8年 青森県産にんにく 福地ホワイト六片 家庭用2.7ｋｇ · 令和8年産 青森県産にんにく ホワイト六片 １キロ A品 Mサイズ 【夏ギフ · 令和7年産 青森県産にんにく バラ ５００g | https://www.tabechoku.com/producers/29095 |  |
| 釈迦のりんご園 | 平川市 | Fruta y verdura | productos | 只今期間限定１０００円割引中♪ 何回もメディアで紹介されている品種です！ 高 · ☆令和８年産予約開始☆ 贈り物に大人気✨【大玉贈答用】樹上完熟サンふじ 5k · 傷ありにつき 数量限定☆２０００割引です スタッフイチオシ品種「名月」 お徳 | https://www.tabechoku.com/producers/58 | repr. 工藤峰之; premio 食べチョクAWARD |
| 津軽農園 | 弘前市 | Fruta y verdura | productos | 🍑桃の王様 川中島白桃 1.5kg 5玉前後 8月下旬 採れたて農家直送【朝 · 🍑桃の王様 川中島白桃 約3kg 8～14玉 8月下旬 採れたて農家直送【朝 · 🍑さくら白桃 3kg 8～14玉 9月上旬発送 希少な桃 収穫した日に発送  | https://www.tabechoku.com/producers/23597 |  |
| ユウキファーム | 弘前市 | Fruta y verdura | productos | 青森県産りんご 蜜入り 旨いに自信アリ！！ 【メディアや新聞からお声が掛かり · 青森県産りんご 蜜入り これ以上の味は出せません。 ※メディアや新聞で注文殺 · 青森県産りんご 蜜入りりんご 選びに選び抜いたりんご！！【メディアからお声を | https://www.tabechoku.com/producers/25493 |  |
