# Fukui — candidatos

- CSV: `data/csv/jp/chubu/fukui.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/fukui> (40 bodegas, leído 2026-08-04). Gremio: 福井県酒造組合, <https://www.fukuisake.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kokuryu Shuzo | 黒龍酒造 | Eiheiji |
| Kato Kichibee Shoten | 加藤吉平商店 | Sabae |
| Inami Shuzo | 井波酒造 | Sabae |
| Ippongi Kubohonten | 一本義久保本店 | Katsuyama |
| Uno Shuzojo | 宇野酒造場 | Ono |
| Genpei Shuzo | 源平酒造 | Ono |
| Kubota Shuzo | 久保田酒造 | Sakai |
| Ikeda Shuzo | 池田酒造 | Fukui |
| Ito Shuzo | 伊藤酒造 | Fukui |
| Kikukatsura Shuzo | 菊桂酒造 | Fukui |
| Koshi no Iso | 越の磯 | Fukui |
| Asahi Shuzo | 朝日酒造 | Echizen (町) ⚠ |
| Katayama Shuzo | 片山酒造 | Echizen (市) ⚠ |
| Kitazen Shoten | 北善商店 | Minamiechizen ⚠ |

## Trampas
- ⚠ **Tres «Echizen» distintos y contiguos**: 越前町 (丹生郡, donde está 朝日酒造),
  越前市 (ciudad, 片山酒造) y 南越前町 (南条郡, 北善商店). Son tres municipios,
  no tres grafías de uno. Escribir el que toca o el gate geográfico no avisa,
  porque los tres existen y están a 20 km.
- ⚠ **朝日酒造 (Echizen-cho, Fukui)** no es 朝日酒造 (Nagaoka, Niigata), la de
  久保田, que ya está en `niigata.md`. Mismo 社名 exacto, dos empresas.
- ⚠ **久保田酒造 (Sakai, Fukui)** tampoco: hay otra en Sagamihara (`kanagawa.md`)
  y 久保田 es además la marca de la de Nagaoka. Tres cosas, un rōmaji.
- 加藤吉平商店 vende como **梵 (Born)**: `nombre` es la marca pública si es la que
  usa (`docs/CSV_CONTRACT.md`).

## Qué falta
- Las ~26 bodegas restantes del censo.
- Sin abrir: **越前がに** (cangrejo con marca y subasta propia), 若狭ぐじ y el
  pescado de Wakasa, 羽二重餅, 越前おろしそば, sal de Wakasa, 谷田部ねぎ.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| （合）　河原酢造 | 合名会社　河原酢造 | 福井県大野市吉8-25 | 有機加工食品 | JK011113PR-0452-0 |
| 五湖ゆうきの会 | 杉田寿男 1 他 | 福井県三方上中郡若狭町山内35-53 他 | 有機農産物 | 2000F-5 |
| マルカワみそ株式会社 | マルカワみそ（株）旧工場　他 | 福井県越前市杉崎町11-44　他 | 有機加工食品 | 01-016B |
| かっちゃまゆうきの会 | 南 都志男 1 他 | 福井県勝山市平泉寺町岩ヶ野17-44-1、17-44-2 他 | 有機農産物 | 2000F-15 |
| 若狭有機の会 | 高鳥佐太一　1　他 | 福井県小浜市太良庄21-15　他 | 有機農産物 | 2000F-13 |
| 越前「田んぼの天使」有機の会 | 井上高宏 1 他 | 福井県丹生郡越前町八田28-1-1～9、28-2 他 | 有機農産物 | 2001F-43 |
| （名）　河原酢造 | ２　他 | 福井県大野市牛ヶ原106字33,34他 | 有機農産物 | JK130726FA-1257-0 |
| 丹南有機の会 | 株式会社うすい農園　ほ場6　他 | 福井県南条郡南越前町鯖波12-39　他 | 有機農産物 | 2000F-17 |
| 佐野義雄 | 佐野義雄 2 他 | 福井県福井市徳光町2-19-1 他 | 有機農産物 | 2010F-11 |
| かみなか有機の会 | 下嶋三晴　1　他 | 福井県三方上中郡若狭町末野8-2　他 | 有機農産物 | 2019F-5 |
| 株式会社ハイピース | 株式会社ハイピース | 福井県丹生郡越前町佐々生32-4 | 有機加工食品 | MPJP9233 |
| 一般社団法人北陸EM普及協会 | 北　定　ほ場１　他 | 福井県福井市御所垣内町5字37　他 | 有機農産物 | 2020F-6 |
| ピュールヴェルジェワカサ | 伊藤園　他 | 福井県三方上中郡若狭町麻生野29-11-1、29-13-1　他 | 有機農産物 | NA-24012501 |
| イオンアグリ創造株式会社 　福井あわら農場 | 201　他 | 福井県あわら市山十楽1-6　他 | 有機農産物 | 123-015 |
| 農字組合法人 弘法大師ファームみつまた | （農）弘法大師ファームみつまた　ほ場1　他 | 福井県越前市北山27字3-1、3-2、7-2　他 | 有機農産物 | 2024F-6 |
| 農事組合法人上味見みらいファーム | 10字9　他 | 福井県福井市神当部町10-18　他 | 有機農産物 | J18A-2421 |
| 株式会社ファーム広瀬 | ほ場1　他 | 福井県越前市岡本町9字西川原19番1    他 | 有機農産物 | 2025F-4 |

Los dos complementos de Fukui proceden de la lista oficial municipal «ふくいの恵み» (productos y operadores certificados, ejercicio R6), porque el registro JAS solo dejó 18 operadores nuevos tras la deduplicación: <https://www.city.fukui.lg.jp/sigoto/syoukou/renkei/kakouhinninteijigyou_d/fil/R6ichiran.pdf>.

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/fukui.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/fukui.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **3 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 有限会社杉本清味堂 | 大野市 | Aperitivos | 全国米菓工業組合 | https://www.seimido.com | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）、米菓販売業（その他菓子を含む卸・小売業） |
| 株式会社吉村甘露堂 | 大野市 | Aperitivos | 全国米菓工業組合 | https://yoshimuraokaki.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 亀屋製菓株式会社 | 福井市 | Aperitivos | 全国米菓工業組合 | https://kameya-s.com | 米菓製造業（菓子卸等へ販売） |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/fukui.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/fukui> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **14 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 7, Pan y cereal 6, Pescado 4, Setas 2, Huevos 1, Carne 1, Legumbres 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| テトテヲ | 坂井市 | Huevos | ficha | — | https://www.tabechoku.com/producers/20837 | premio 食べチョクAWARD |
| 昇竜 | 大野市 | Setas | productos | 採りたて！九頭竜まいたけ（１株）【福井県産舞茸】 · 採りたて！九頭竜まいたけ（２株）【福井県産舞茸】 · 採りたて！九頭竜まいたけ（３株）【福井県産舞茸】 | https://www.tabechoku.com/producers/21269 | repr. 創業：1998年06月 |
| こころファーム | 福井市 | Setas | productos | 乾燥粉シイタケ 8個入り | https://www.tabechoku.com/producers/23132 |  |
| 瀬越水産　新盛丸 | 坂井市 | Pescado | productos | 【夏ギフト】🏆食べチョク2026年クラフトグランプリ入賞🏆 忙しい毎日の食卓 · ⭐️ 売り切れ対策で増産！ぷりっと甘い“むき身甘えび” 時短ですぐ食卓へ最新 · 【贈答用】🦐海老の食べ比べセット🦐 ブランド認定ふくい甘えび+幻のガサ海老  | https://www.tabechoku.com/producers/27295 |  |
| 魚屋の喰い処まつ田 | 福井市 | Pescado | productos | 【父の日ギフト】ネバネバシャキシャキ食感が病みつき！無添加！天然！越前産のあ · 【父の日ギフト】ネバネバシャキシャキ食感が病みつき！無添加！天然！越前産のあ · 【父の日ギフト】日本海産 無添加 干し甘えび 30g 2パック | https://www.tabechoku.com/producers/23694 |  |
| あまちゃん | 福井市 | Pescado | ficha | — | https://www.tabechoku.com/producers/27409 |  |
| 鯖江スマイルファーム | 鯖江市 | Pescado | ficha | — | https://www.tabechoku.com/producers/22562 |  |
| サンビーフ齊藤牧場 | 坂井市 | Carne | productos | BBQ 焼肉セット 若狭牛 赤身・霜降 食べ比べ 希少部位入り 1kg （4 · 焼肉食べ比べセット 若狭牛 お試し極撰5部位 350g(70g×5) 特製焼 · 【期間限定100g増量中！】 若狭牛 コク旨赤身肉 500g（250g×2パ | https://www.tabechoku.com/producers/3078574 | repr. 齊藤力 |
| グリーンファームすみや | あわら市 | Legumbres | productos | 無添加 自家製青大豆味噌で美味しく腸活はいかがですか！！ | https://www.tabechoku.com/producers/26490 |  |
| 滝本米　農園 | 勝山市 | Pan y cereal | productos | 新米予約 令和8年 コシヒカリ 滝本米 オリジナル 玄米 5kg×2袋 農薬 · 新米予約 令和8年 コシヒカリ 滝本米 プレミアム 玄米 30kg 農薬不使 · 新米予約 令和8年 コシヒカリ 滝本米 プレミアム 玄米 10kg 農薬不使 | https://www.tabechoku.com/producers/25557 |  |
| シマダ農園 | 小浜市 | Pan y cereal | productos | 【令和7年産】 福井県産こしひかり3ｋｇ · 【令和7年産】 福井県産こしひかり２ｋｇ · 新米【令和８年産】 福井県産こしひかり２ｋｇ | https://www.tabechoku.com/producers/23859 |  |
| ヤスノ農園 | 福井市 | Pan y cereal | productos | 贈り物に！ギフト用！容器付き！食味92点! 令和7年福井産コシヒカリ3㎏（精 · 食味92点! 最高クラス！令和7年福井産コシヒカリ3㎏（精米） · 食味92点! 最高クラス！令和7年福井産コシヒカリ5㎏（精米） | https://www.tabechoku.com/producers/3078493 |  |
| 米農房そまねこ | 若狭町 | Pan y cereal | ficha | ２００ｇ×４ 古代米ミックス黒赤緑 農薬不使用 有機肥料使用 有機ＪＡＳ · ２００ｇ×２ 古代米ミックス黒赤緑 農薬不使用 有機肥料使用 有機ＪＡＳ · ８００ｇ 古代米ミックス黒赤緑 農薬不使用 有機肥料使用 有機ＪＡＳ | https://www.tabechoku.com/producers/27469 | 福井県三方上中郡若狭町 |
| 茂右衛門農場 | 鯖江市 | Pan y cereal | productos | 令和7年度ふっくら！炊きたての甘い香り文殊山菜花米コシヒカリ５kg 玄米 · 令和7年度ふっくら！炊きたての甘い香り文殊山菜花米コシヒカリ５kg 白米 | https://www.tabechoku.com/producers/29269 | repr. 上坂季美好 |
| 徳橋農場 | 鯖江市 | Pan y cereal | productos | おろしそばに最適! 福井県産 辛味大根(品種名:からいね) 400~600g · おろしそばに最適! 福井県産 辛味大根(品種名:からいね) 2kg · おろしそばに最適! 福井県産 辛味大根B品(品種名:旭山) 4kg | https://www.tabechoku.com/producers/23857 |  |
| 本多農園 | 勝山市 | Fruta y verdura | productos | ★再販★Lサイズ多め【汁物・芋煮など】煮ても揚げても絶品里芋（3㎏）！ホクホ · ★再販★Lサイズ多め【汁物・芋煮など】煮ても揚げても美味しい里芋（5㎏）！『 · 【超便利！すぐ調理できる里芋付き】煮ても揚げても絶品里芋（3㎏）ホクホク「勝 | https://www.tabechoku.com/producers/22998 |  |
| 西農園 | 坂井市 | Fruta y verdura | ficha | 【数量限定 ご家庭用※訳あり※】甘くてまあるい瑞々しさをお届け！！たっぷり豊 · 【数量限定！！予約受付中】甘くてまあるい瑞々しさをお届け！！たっぷり豊水⒉5 · 【数量限定！！予約受付中】甘くてまあるい瑞々しさをお届け！！たっぷり豊水５k | https://www.tabechoku.com/producers/29409 | repr. 西  善昭 |
| ゆみたか農園 | 坂井市 | Fruta y verdura | productos | 【8月発送】最高の甘さになる極限まで樹上完熟‼︎一玉ぺろっ！と食べれちゃうあ · 【9月発送】のどごし！感じるジューシーさと甘みの中に絶妙な酸味！魅力たっぷり | https://www.tabechoku.com/producers/29572 | repr. 齊藤　かおり |
| 晴レハレ農園｜走るコケ子の健康卵 | 永平寺町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29342 | repr. 芳沢郁哉 |
| もんちゃん農園 | 福井市 | Fruta y verdura | ficha | 【夏ギフト】今朝どれ発送します！福井特産越のルビー！（2キロ） | https://www.tabechoku.com/producers/28017 | repr. 平林　隆豊 |
| ターナーズファーム | 福井市 | Fruta y verdura | productos | 令和9年6月中旬〜 高糖度でシャリっと美味しい。金色に輝く福井市特産金福すい · [7/8頃〜発送開始]砂丘地区で栽培された甘くてジューシーなアンデスメロン · [7/1頃〜発送開始]砂丘地区で栽培された甘くてジューシーなアンデスメロン | https://www.tabechoku.com/producers/29444 | repr. 田中明将 |
| 農園たや | 福井市 | Fruta y verdura | ficha | 【小分け】第55回日本農業賞大賞受賞！ベビーリーフ【100g×３袋】 · 【小分け】第55回日本農業賞大賞受賞！ベビーリーフ【100g×10袋】 · 【小分け】第55回日本農業賞大賞受賞！ベビーリーフ【100g×5袋】 | https://www.tabechoku.com/producers/23979 | repr. 田谷　徹 |
