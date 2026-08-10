# Okayama — candidatos

- CSV: `data/csv/jp/chugoku/okayama.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/okayama> (49 bodegas, leído 2026-08-04). Gremio: 岡山県酒造組合, <http://www.okasake.com/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Okayama es la prefectura del **雄町 (Omachi)**, la variedad de arroz de sake más
antigua en cultivo: casi todo el Omachi de Japón sale de aquí y es el argumento
de terroir de estas bodegas. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kikuchi Shuzo | 菊池酒造 | Kurashiki |
| Kumaya Shuzo | 熊屋酒造 | Kurashiki |
| Ono Shuzo | 大野酒造 | Kurashiki |
| Ozaki Shuzojo | 尾崎酒造場 | Kurashiki ⚠ |
| Itano Shuzojo | 板野酒造場 | Okayama ⚠ |
| Itano Shuzo Honten | 板野酒造本店 | Okayama ⚠ |
| Akaiwa Shuzo | 赤磐酒造 | Akaiwa |
| Kamikokoro Shuzo | 嘉美心酒造 | Asakuchi |
| Isochidori Shuzo | 磯千鳥酒造 | Satosho |
| Ochi Shuzojo | 落酒造場 | Maniwa |
| Ohmi Shuzo | 大美酒造 | Maniwa |
| Akagi Shuzo | 赤木酒造 | Takahashi |
| Ouchi Shuzojo | 大内酒造場 | Kasaoka |
| Karita Shuzo | 苅田酒造 | Tsuyama |

## Trampas
- ⚠ **板野酒造場 y 板野酒造本店 están las dos en la ciudad de Okayama** y son dos
  empresas. Casar por 社名 completo, no por apellido ni municipio.
- ⚠ **尾崎酒造場 (Kurashiki)** es el tercer 尾崎 del catálogo, tras Ajigasawa
  (`aomori.md`) y Shingu (`wakayama.md`). Tres empresas.
- **苅田酒造** aparece en la fuente como 「苅田酒造エネルギー」: el sufijo huele a
  cambio de objeto social o a fusión con una empresa energética. Confirmar que
  sigue elaborando antes de escribir la fila; puede ser una purga documentada.
- 倉敷市 concentra cuatro y es una ciudad enorme tras las fusiones: el barrio
  (児島, 玉島, 水島) no es el `municipio`.

## Qué falta
- Las ~35 bodegas restantes del censo.
- Sin abrir, y es mucho: **白桃 (melocotón blanco)** y **マスカット・オブ・
  アレキサンドリア** — Okayama es la fruta de regalo de Japón, con productores
  identificables y venta online real, probablemente el mejor pool de la
  prefectura; きびだんご (con casas históricas), 千屋牛 (una de las carnes wagyu
  más antiguas), ままかり y 瀬戸内 pescado, 手延べ麺 de Kamogata.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 株式会社丸菱　岡山工場 | 株式会社丸菱　岡山工場　他 | 岡山県新見市大佐小阪部1421　他 | 有機加工食品 | MPJP1027-01 |
| 庄地区無農薬研究会 | 生産025-002-12号　他 | 岡山県倉敷市下庄467-1 | 有機農産物 | 生産025号 |
| まびゆうき | 生産037-003-02号　他 | 岡山県倉敷市真備町服部813-1　他 | 有機農産物 | 生産037号 |
| エコファームMITANI | 生産049-001-01号　他 | 岡山県倉敷市玉島陶3753-1　他 | 有機農産物 | 生産049 |
| 岡山県立高松農業高等学校 | 生産066-001-01号　他 | 岡山県岡山市北区高松原古才400-1の一部 | 有機農産物 | 生産066号 |
| 中和元気米クラブ | 生産062-006-07号　他 | 岡山県真庭市蒜山下和2606　他 | 有機農産物 | 生産062号 |
| 丸本酒造（株） | 生産070-001-05号　他 | 岡山県浅口市鴨方地頭上1171 他 | 有機農産物 | 生産070号 |
| 倉敷弥高山高原有機野菜クラブ | 生産043-001-01号　他 | 岡山県倉敷市玉島陶5539-4　他 | 有機農産物 | 生産043 |
| タンチョウの里内山農園 | 生産072-001-01号 | 岡山県和気郡和気町田賀451-6他 | 有機農産物 | 生産072 |
| 上組営農実行組合 | 生産003-009-01号　他 | 岡山県高梁市川上町高山3280-1他 | 有機農産物 | 生産００３号 |
| 大興産業株式会社 | 大興産業㈱ | 岡山県井原市西江原町1858-3　他 | 有機加工食品 | 加工003 |
| 岡山市高松有機無農薬野菜生産組合みどり会 | 生産001-014-01号　他 | 岡山県岡山市北区平山548　他 | 有機農産物 | 生産001号 |
| 岡山市高松有機無農薬野菜生産組合ふるさと会 | 生産002-015-01号　他 | 岡山県岡山市北区新庄下185-1　他 | 有機農産物 | 生産002 |
| 和気健康農業研究会 | 生産036-001-01号　他 | 岡山県和気郡和気町吉田177-1　他 | 有機農産物 | 生産036号 |
| 株式会社　岡三食品 | ㈱岡三食品　他 | 岡山県岡山市東区西大寺新地360-8　他 | 有機加工食品 | JO080725PR-1050-0 |
| 日生町みかん生産組合 | 生産033-006-01号　他 | 岡山県備前市日生町日生3635-26　他 | 有機農産物 | 生産033-006-01号他 |
| 日本オリーブ(株) | 日本オリーブ（株）　他 | 岡山県瀬戸内市牛窓町牛窓3911-10 他 | 有機加工食品 |  |
| 名水美人ファクトリー株式会社　岡山工場 | 名水美人ファクトリー株式会社　岡山第2工場　他 | 岡山県小田郡矢掛町中６８６－１　他 | 有機農産物 | SES-05012501 |
| はやしま有機の郷 | 生産065-001-01号　他 | 岡山県都窪郡早島町早島3678-1　他 | 有機農産物 | 生産065号 |
| 有限会社想庵 | 有限会社想庵　万富工場 | 岡山県岡山市瀬戸町万富314-2 | 有機加工食品 | MPJP1615 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/okayama.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **4** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 倉敷チーズ工房ハルパル | Kurashiki | Lácteos y quesos | ChFun | kurashiki-cheese.shopinfo.jp | revisado 2026-08-10: la web oficial propuesta devuelve 404 |
| 多胡本家酒造場 (作州津山ビール) | Tsuyama | Cerveza | JBA | tsuyamabeer.co.jp | matriz de sake; comprobar duplicado; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 全工房 (吉備土手下麦酒) | Okayama | Cerveza | JBA | kibidote.jp | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| サッポロビール 岡山ワイナリー | Akaiwa | Vino | JWA | — | planta de grupo nacional; la ficha confirma la planta, pero no una identidad de producto local atribuible; revisado 2026-08-10: la ficha confirma una planta nacional, pero no una identidad de producto local atribuible |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/okayama.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/okayama.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **6 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 廣榮堂 | 岡山市 | Dulces y repostería | 和菓子協会 | http://www.koeido.co.jp/ | 岡山市中区藤原 60 |
| くらや | 津山市 | Dulces y repostería | 和菓子協会 | http://www.kuraya.jp/ | 津山市沼 77-7 |
| 三宅製菓本店 | 高梁市 | Dulces y repostería | 和菓子協会 | http://www.sweetsjapan.com/133okayama/10120286688.html | 高梁市成羽町下原 577 |
| ㈱スズキ麺工 | 浅口市 | Pan y cereal | 全乾麺 | http://turuturu.co.jp | 手延べ干しめん |
| 廣榮堂 | ⚠ | Dulces y repostería | búsqueda dirigida | https://www.koeido.co.jp/ | ⚠ el dominio no resolvió en la comprobación; kibi dango |
| 山方永寿堂 | ⚠ | Dulces y repostería | búsqueda dirigida + web propia | https://www.eijudo.co.jp/ | ⚠ municipio sin confirmar (Okayama u otro) |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/okayama.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/okayama> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 南條海苔 | 倉敷市 | Pescado | https://www.tabechoku.com/producers/25711 | 下津井漁港にて、三代続く海苔養殖 |
| 漁師からの直行便 七福丸 | 倉敷市 | Pescado | https://www.tabechoku.com/producers/20452 | 初めまして＾＾私は岡山県倉敷市「下津井」という漁師町で |
| 華丸 | 岡山市 | Pescado | https://www.tabechoku.com/producers/22078 | 今年、令和７年は、４月末頃～９月３０日まで、鮮魚販売させて頂く予定です。 |
| OEC KINGDOM | 総社市 | Pescado | https://www.tabechoku.com/producers/21292 | 岡山県中南部にある総社市で夫婦2人でぶどう栽培を始めました。 2017年、大好きなぶどうを作りたい！そう思い研修を経てぶどう農家になりました |
| キジトラ招福堂 | 井原市 | Carne | https://www.tabechoku.com/producers/22823 | 移住先の岡山でジビエと自家製どぶろくや糀をつかった里山料理を提供する農家民宿「ねこのひたいの宿 山王ちぐら」を営んでいます。 |
| 石毛おうち牧場 | 岡山市 | Carne | https://www.tabechoku.com/producers/3078152 | 2025年４月より岡山へ移住し小規模な畜産牧場を始めました。 |
| セリフ | 西粟倉村 | Carne | https://www.tabechoku.com/producers/3077787 | 人口約1,300人の西粟倉村で、私たちは地域資源を活かした循環型の平飼い養鶏に取り組んでいます。 |
| 倉敷きのこ園 | 倉敷市 | Setas | https://www.tabechoku.com/producers/26777 | 今年で創業17年目を迎える倉敷きのこ園は、倉敷の山間にあり、桃園に囲まれた自然豊かな場所にあります。 |
| 美甘養蜂園 | 津山市 | Miel | https://www.tabechoku.com/producers/26695 | 美甘養蜂園は昭和31年から半世紀余り、岡山県北東部地域の津山市で養蜂を営んでいます。このあたりは盆地で朝夕の寒暖差が大きいためレンゲの花をは |
| おくだただし | 倉敷市 | Condimentos | https://www.tabechoku.com/producers/25288 | 岡山県倉敷市で桃を中心に果物を栽培しています。 |
| グリーンバード葡萄園 | 岡山市 | Vino | https://www.tabechoku.com/producers/27462 | 倉敷市山地の圃場で葡萄を栽培しています。マスカットオブアレキサンドリア、シャインマスカット、雄宝、リザマート、紫苑などを栽培しています。他に |
| タンポポ農園食べチョク店 | 岡山市 | Pan y cereal | https://www.tabechoku.com/producers/28188 | 晴れの国岡山でシャインマスカットを中心にぶどう栽培とブルーベリーなどの果物や米の栽培を行なっています。 |
| 志産米倶楽部 | 岡山市 | Pan y cereal | https://www.tabechoku.com/producers/23645 | 温暖な気候の平場で高温に強い良食味の美味しいお米を |
| ふるいち農園 | 岡山市 | Pan y cereal | https://www.tabechoku.com/producers/24916 | ふるいち農園は、家族で営む小さな農園です。私で４代目となり、先祖代々米麦農家です。これまで守られてきた土地や文化をこれからも維持、発展させ、 |
| オノファクトリー. | 総社市 | Pan y cereal | https://www.tabechoku.com/producers/25184 | 米どころ🌾総社市新本の朝日米農家です。 |
| きびもも園 | 岡山市 | Fruta y verdura | https://www.tabechoku.com/producers/28750 | 当園は岡山白桃の有数産地として知られ、清水白桃発祥の地でもある岡山市一宮地区にあります。 |
| Nini farm | 岡山市 | Fruta y verdura | https://www.tabechoku.com/producers/24368 | 葡萄が大好物なNini farm園主の岡田です。 |
| 井上農園@Tamano | 玉野市 | Fruta y verdura | https://www.tabechoku.com/producers/21558 | 岡山県玉野市在住の井上英治と申します。 |
| まこもたけ直売所 | 里庄町 | Fruta y verdura | https://www.tabechoku.com/producers/24261 | 中華料理の高級食材である「マコモタケ」を１０年前から栽培し、関東地区、近畿地区を中心に、全国販売しています。生産量は年間１２㌧、周辺の耕作者 |
| 👨🏻‍🌾 medicuse 👩🏻‍🌾 | 岡山市 | ⚠ por decidir | https://www.tabechoku.com/producers/22098 | 🏅2020年 AWARD受賞 |
| あぐりビジネス | 玉野市 | ⚠ por decidir | https://www.tabechoku.com/producers/3077532 | 岡山県の南に位置する玉野市は、海も山も近く、瀬戸内の穏やかな気候に恵まれた地域です。 |
| Lino ＆ Kai Farm（リノ アンド カイファーム） | 真庭市 | ⚠ por decidir | https://www.tabechoku.com/producers/22043 | ◆お客さまへのごあいさつ◆ |
