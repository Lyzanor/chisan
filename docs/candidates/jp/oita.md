# Oita — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/oita.csv` (1 fila: Hita Tenryosui, bebidas). Dedup: ninguna de abajo solapa.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/oita> (31 bodegas, leído 2026-08-04). Gremio: 大分県酒造組合, <http://www.oita-sake.or.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`, con la salvedad de abajo. El rōmaji de `nombre` y
`municipio` es propuesta a confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Inoue Shuzo | 井上酒造 | Hita |
| Oimatsu Shuzo | 老松酒造 | Hita ⚠ |
| Kuncho Shuzo | クンチョウ酒造 | Hita |
| Kuge Honten | 久家本店 | Usuki |
| Kotegawa Shuzo | 小手川酒造 | Usuki |
| Emoto Shoten | 江本商店 | Usa |
| Oita Meijo | 大分銘醸 | Usa |
| Kubo Shuzo | 久保酒造 | Usa |
| Aso Honten | 麻生本店 | Yufu |
| Daichi Shuzo | 大地酒造 | Saiki |
| Ono Shuzo | 小野酒造 | Kitsuki |
| Kamenoi Shuzo | 亀の井酒造 | Kusu |
| Kayashima Shuzo | 萱島酒造 | Kunisaki |
| Kira Shuzo | 吉良酒造 | Bungoono |

## Trampas
- **`hita` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español (`AGENTS.md` de Japón, y ya avisado en el
  `README.md` de esta carpeta por Hita Tenryosui). Las tres bodegas de Hita pasan
  el gate sin tocar nada.
- ⚠ **老松酒造 (Hita, Oita)** es el tercer 老松 del catálogo: los otros son
  伊丹老松酒造 (Itami) y 老松酒造 (Shiso), ambos en `hyogo.md`. Tres empresas.
- **亀の井酒造 (Kusu, Oita)** no es 亀の井酒造 (Tsuruoka, Yamagata), la de
  くどき上手, en `yamagata.md`. Mismo 社名 exacto.
- **小野酒造 (Kitsuki, Oita)** no es 小野酒造 (Kitahiroshima, Hiroshima), en
  `hiroshima.md`.
- ⚠ **Oita es la primera prefectura de Japón en 麦焼酎**, no en sake: varias de
  estas casas hacen las dos cosas y la `categoria` que pesa puede ser
  `Destilados y licores`. Decidir por fila, no por gremio.

## Qué falta
- Las ~17 bodegas restantes del censo, y **三和酒類 (Usa)**, la casa de いいちこ,
  que es el mayor productor de shochu de Japón y no aparece en el censo de sake:
  entra por vertical de destilado, con el triaje de grupo por delante.
- Sin abrir: **かぼす**, del que Oita produce en torno al 97% nacional;
  **乾し椎茸** (shiitake seco, también primera de Japón, con subasta propia);
  関あじ・関さば (pescado de marca con lonja en Saganoseki); 豊後牛; 柚子胡椒
  (nació en Kyushu y hay obradores pequeños); 日田の水と醤油.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 株式会社クローバー食品 | 株式会社クローバー食品　本社工場　他 | 大分県豊後高田市玉津1544-3　他 | 有機加工食品 | 第1196号 |
| タルカリ農園 | 17 | 大分県豊後高田市西真玉字金屋野内899 | 有機農産物 | 0147 |
| 大分醤油協業組合 | 大分醤油協業組合　他 | 大分県臼杵市望月1500番地　他 | 有機加工食品 | 010423-001 |
| 株式会社ジェイエイフーズおおいた | 株式会社ジェイエイフーズおおいた | 大分県杵築市大字本庄1453番地の1 | 有機加工食品 | 加-0008 |
| （有）豊後大分有機茶生産組合 | 大麦3-17　他 | 大分県臼杵市野津町吉田1030－5、1030－6　他 | 有機農産物 | JB070619FA-1542-0 |
| 青井農園 | 5 | 大分県速見郡日出町川崎字内野5271-5272 | 有機農産物 | 0035 |
| 佐々木食品グループ | 安藤二六　ほ場2 他 | 大分県豊後高田市美和ミツケ507、508、古尾敷559、殿屋敷509、513、547 他 | 有機農産物 | 2004F-7 |
| （株）三洋産業 | （株）三洋産業 | 大分県別府市冨士見町7-2 | 有機加工食品 | JS010322PR-0327-0 |
| 農事組合法人JAPANクローバー | 大力基地、他 | 大分県豊後高田市大力、他 | 有機農産物 | 1373 |
| 農事組合法人下郷製茶組合 | 農事組合法人下郷製茶組合 | 大分県中津市耶馬溪町大字金吉1028番地4 | 有機加工食品 | 加-0025 |
| 株式会社河村農園 | 株式会社河村農園　本社/第一工場　他 | 大分県佐伯市直川大字下直見1548番地　他 | 有機加工食品 | 加-0051 |
| 北村俊造 | 4-1，4-2，4-3，4-4 | 大分県豊後高田市呉崎広瀬3632 | 有機農産物 | 0032 |
| ケンプリア株式会社 | ケンプリア株式会社大分工場 | 大分県宇佐市四日市９１７－１ | 有機加工食品 | 加-0058 |
| 福祉農場　安心家族 | Y | 大分県宇佐市大字四日市4534-1 | 有機農産物 | 0067 |
| 農事組合法人ゆふいん蕎麦農場 | 農事組合法人ゆふいん蕎麦農場 | 大分県由布市湯布院町中川字城ヶ岳1968－1 | 有機農産物 | 0074 |
| 二宮茶園 | 2-A | 大分県国東市国東町小原5836-54 | 有機農産物 | 0075 |
| 大分有機かぼす農園株式会社 | 6 | 大分県臼杵市大字乙見字大平864，865，866 | 有機農産物 | 0085 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/oita.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
- Estado: revisión cerrada el 2026-08-10; **2** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| ゆふいんビール | Yufu | Cerveza | JBA | yufuinbeer.co.jp | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 久住高原開発公社 | Taketa | Cerveza | JBA | — | sociedad de desarrollo, triar; sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/oita.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/oita.php> (nombre, dirección y web propia de cada socio)
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **5 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 但馬屋老舗 | 竹田市 | Dulces y repostería | 和菓子協会 | http://www.tajimaya-roho.co.jp/ | 竹田市竹田町 40 |
| マルトモ物産 | 中津市 | Setas | búsqueda dirigida + web propia | https://www.marutomo-kanbutsu.co.jp/ | ⚠ mayorista de secos, triar antes de dar de alta |
| やまよし | 別府市 | Setas | búsqueda dirigida + web propia | https://www.shiitake-ya.co.jp/ | 乾しいたけ; ⚠ comprobar si elabora o distribuye |
| 大分乾物 | 国東市 | Setas | búsqueda dirigida + web propia | https://www.oitakanbutu.com/ | 原木乾しいたけ del Kunisaki |
| オーエスケー | 杵築市 | Setas | búsqueda dirigida + web propia | http://osk-shiitake.com/ | 乾しいたけ; ⚠ proveedor del gremio, triar |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/oita.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/oita> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| KASORE NATURAL 九重農場（旧：Y・Yふぁ～む） | 九重町 | Pescado | https://www.tabechoku.com/producers/3077151 | 身体も心も、健やかに巡る。 |
| 豊後マダコ | 佐伯市 | Pescado | https://www.tabechoku.com/producers/3078831 | 豊後水道に面した大分県佐伯市の護江（もりえ）漁港を拠点にし、 |
| 新栄丸 | 佐伯市 | Pescado | https://www.tabechoku.com/producers/21210 | 大分県佐伯市は大入島で“日本初”となる牡蠣養殖（NZ発フリップファーム方式）をしています。循環を意識したゴミの出ない養殖方式です。牡蠣殻も有 |
| Baji西洋野菜研究所 | 大分市 | Té e infusiones | https://www.tabechoku.com/producers/22120 | 大分県大分市松岡にて、パパイヤと西洋野菜を露地栽培販売しています。パパイヤは数種類栽培しており、葉をブレンドしてお茶にして販売しています。農 |
| 元さん農園 | 佐伯市 | Carne | https://www.tabechoku.com/producers/26898 | 大分県佐伯市の自然に囲まれた直川で、平飼い・放し飼い養鶏法で烏骨鶏・赤鶏を育てている、たまご農家です。 |
| 安心院ソーセージ　宇佐ジビエファクトリー | 宇佐市 | Carne | https://www.tabechoku.com/producers/20918 | 私たちはジビエの事を少しでも知って頂きたく思っています。 |
| 一粒万倍 | 竹田市 | Carne | https://www.tabechoku.com/producers/27597 | 猪野 精一郎（59歳）いのちゃん |
| かやの椎茸屋 | 佐伯市 | Setas | https://www.tabechoku.com/producers/20340 | 我家は九州の中山間地にあり、代々、クヌギの木を使用した椎茸の原木栽培を生業としています。 |
| 産地直送　菜葉屋 | 大分市 | Setas | https://www.tabechoku.com/producers/23656 | 私たちは大分県の大分市内にて原木椎茸を栽培しております |
| 日本ミツバチ専門　吉田養蜂所 | 宇佐市 | Miel | https://www.tabechoku.com/producers/21695 | 安心して食べられる蜂蜜を探して日本ミツバチにたどり着きました！ |
| さとやま農園 | 大分市 | Legumbres | https://www.tabechoku.com/producers/26949 | 里山の耕作放棄地を開墾し栗・甘藷・落花生等を栽培しています。 |
| 雪乃屋 | 宇佐市 | Legumbres | https://www.tabechoku.com/producers/23066 | 大分県宇佐市で、米・麦・大豆を3世代で栽培しています。 |
| まくファーム | 別府市 | Condimentos | https://www.tabechoku.com/producers/3077214 | 体に良いとされるホーリーバジルティーやにんにく（黒にんにく）を生産するにあたり、体に良いとされる作物が、生産方法に疑念を持たれる様な栽培は絶 |
| やーやまや | 杵築市 | Conservas | https://www.tabechoku.com/producers/23949 | やーやまやは大分県、国東半島にあります。農薬や肥料に頼らない自然栽培で野菜を育て、その野菜を使った加工品作りをしています。こだわり野菜として |
| 油花 | 豊後高田市 | Aceite | https://www.tabechoku.com/producers/21039 | 大分県豊後高田市で耕作放棄地を開拓し、ひまわり油と菜の花油を主軸とした6次産業化に取り組んでいます。潮風の香る花の岬・香々地（カカヂ）にて環 |
| 栗秋農園 | 日田市 | Frutos secos | https://www.tabechoku.com/producers/3079039 | 農業系の大学を卒業して直ぐに就農して今年で29年になります。美味しいが栽培が難しいとされる共台西瓜を作り始めて25年、少しづつ品種を変えなが |
| 平和農園 | 由布市 | Pan y cereal | https://www.tabechoku.com/producers/27467 | 自然豊かな大分県由布市にて農薬や肥料などを一切使用しない自然栽培でお米やお芋類などを栽培しています。 |
| 自然栽培米　月日(つきひ) | 豊後高田市 | Pan y cereal | https://www.tabechoku.com/producers/23192 | 2020年より、農薬、除草剤、肥料を使わない自然栽培のお米農家に新規就農しました。 |
| アトリエ天使のバラ | 杵築市 | Fruta y verdura | https://www.tabechoku.com/producers/25034 | 大分県で、国際基準MPS(花き産業総合認証)を取得して、農水省で定められた農薬のみを使い、人にも環境にも優しいバラ作りで食べられるバラを栽培 |
| オノ農場 | 臼杵市 | Fruta y verdura | https://www.tabechoku.com/producers/28400 | オノ農場では、無農薬無化学肥料で作物を栽培し、皆様の食による健康づくりをお手伝いできればと思い、日々活動しています。 |
| カズフジ | 佐伯市 | ⚠ por decidir | https://www.tabechoku.com/producers/28273 | はじめまして、株式会社カズフジ代表の伊東と申します。 |
| おもとの丘ファーム | 宇佐市 | ⚠ por decidir | https://www.tabechoku.com/producers/24965 | 平成２９年６月に大分県宇佐市に小さな会社が発足しました。 |
