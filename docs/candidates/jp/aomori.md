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
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/aomori> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 新栄農場 | むつ市 | Pescado | https://www.tabechoku.com/producers/20860 | にんにくとすいかに本気！ |
| 盛漁丸 | 中泊町 | Pescado | https://www.tabechoku.com/producers/26686 | 地元にて飲食店、底建網漁、素潜り漁をしています。 |
| KANEHO | 大間町 | Pescado | https://www.tabechoku.com/producers/26918 | 本州最北端の大間で旬な魚介類、漁師直送の魚介類を加工、販売しています。 |
| 釈迦のりんご園 | 平川市 | Pescado | https://www.tabechoku.com/producers/58 | ★☆りんご王国青森県でも県内１の品質で認められる「広船産りんご」★☆ |
| ユウキファーム | 弘前市 | Pescado | https://www.tabechoku.com/producers/25493 | ユウキファームのりんご園地では「完熟」「美容」「感謝」と３つのこだわりをモットーとしており、ユウキファームオリジナルの収穫前日までりんごを実 |
| LOCO-SIKIミート | 七戸町 | Carne | https://www.tabechoku.com/producers/21044 | 子豚生産から肥育豚出荷までの一貫生産しています。誕生から出荷まで同一腹の豚を同一の豚房で肥育しているので、ストレスが少ない健康な豚を育ててい |
| おおわにシャモロックファーム | 大鰐町 | Carne | https://www.tabechoku.com/producers/3077535 | 私たちは、毎日食べるための鶏肉ではなく、「今日はちゃんとしたものを食べた」と記憶に残る一食を届けたいと考えています。 |
| オーク牧場 | 田子町 | Carne | https://www.tabechoku.com/producers/26473 | 2020年に就農し、青森県の田子町（たっこまち）でにんにくと和牛の生産をしています。100％オーク牧場産の堆肥をふんだんに使った畑でにんにく |
| さくらの杜　（さくらのもり） | 弘前市 | Setas | https://www.tabechoku.com/producers/24838 | 弊社はさくらの街で有名な青森県弘前市で、菌床栽培による生しいたけ、各種野菜、加工品の生産・販売をしております。自社ハウス内にて農薬不使用、適 |
| しあわせj-Farm | 平川市 | Conservas | https://www.tabechoku.com/producers/26873 | 青森県平川市「しあわせj-Farm」は、「株式会社ジョイ・ワールド・パシフィック」が運営する農業生産部門で、いちごの通年生産、にんにくの生産 |
| ツガルユキドケファーム | つがる市 | Pan y cereal | https://www.tabechoku.com/producers/27264 | 本州最北の平野、｢津軽平野」の土壌と気候を活かし、そして脈々と受け継がれてきた農業知識、その土台に新しい技術を融合させ、”青森はりんごだけじ |
| グルメ通り　SHOP | つがる市 | Pan y cereal | https://www.tabechoku.com/producers/29622 | 青森県の西北部、津軽平野の西側に位置しておりますつがる市にて「にんにく、米、小麦」の栽培・加工及び販売をしております。 |
| みっきいファーム | 五所川原市 | Pan y cereal | https://www.tabechoku.com/producers/3078593 | 就農して15年　妻と2人で美味しいお米を皆様にお届け出来るよう真心込めて日々農作業をしています |
| たっちゃんちの食材 | 十和田市 | Pan y cereal | https://www.tabechoku.com/producers/29095 | 私たちは、青森県十和田市で主に、「にんにく」「ごぼう」「お米」を生産している農家です。 |
| 權之丞 | 弘前市 | Pan y cereal | https://www.tabechoku.com/producers/27574 | 皆さんはじめまして！株式会社權之丞（ごんのじょう）と申します。私たちは、青森県弘前市でりんごとお米を栽培している農家です。私達は兄弟で父の跡 |
| なんごうゆめファーム | 八戸市 | Fruta y verdura | https://www.tabechoku.com/producers/20165 | 農薬、化学肥料を一切使用せず、MOA自然農法に学び、こだわった野菜を販売しています。 |
| 津軽農園 | 弘前市 | Fruta y verdura | https://www.tabechoku.com/producers/23597 | 当園はりんご生産量日本一を誇る青森県の、最もりんご栽培が盛んな津軽地方で親子三代80年近く続いている農園です。 |
| もりやま園 | 弘前市 | Fruta y verdura | https://www.tabechoku.com/producers/23770 | 青森県弘前市で100年以上、りんごづくりを続けている「もりやま園」です。 |
| 鎌田林檎園 | 黒石市 | Fruta y verdura | https://www.tabechoku.com/producers/22386 | 2020年9月よりこちらで販売スタートしまして、多くのお客様にご購入、リーピートしていただけて、心より感謝しております。 |
| メルふぁーむ | つがる市 | ⚠ por decidir | https://www.tabechoku.com/producers/28589 | メルふぁーむのメルと申します。 |
| 十三湖からの贈り物 | 五所川原市 | ⚠ por decidir | https://www.tabechoku.com/producers/3078329 | はじめまして！🚢 |
| 未来丸 | 深浦町 | ⚠ por decidir | https://www.tabechoku.com/producers/3078215 | 深浦の海が好きすぎて、この海のものを全国に届けています。 |
