# Kochi — candidatos

- CSV: `data/csv/jp/shikoku/kochi.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/kouchi> (20 bodegas, leído 2026-08-04 — ojo, la ruta es `kouchi`, no `kochi`). Gremio: 高知県酒造組合, <http://www.kbiz.or.jp/kumiai/sake/>.
- Estado: cola abierta, 13 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Suigei Shuzo | 酔鯨酒造 | Kochi ⚠ |
| Tsukasabotan Shuzo | 司牡丹酒造 | Sakawa |
| Tosatsuru Shuzo | 土佐鶴酒造 | Yasuda |
| Tosa Shuzo | 土佐酒造 | Tosa (町) ⚠ |
| Kameizumi Shuzo | 亀泉酒造 | Tosa (市) ⚠ |
| Kikusui Shuzo | 菊水酒造 | Aki ⚠ |
| Arimitsu Shuzojo | 有光酒造場 | Aki |
| Arisawa | アリサワ | Kami |
| Takagi Shuzo | 高木酒造 | Konan |
| Sendo Shuzojo | 仙頭酒造場 | Geisei |
| Nishioka Shuzoten | 西岡酒造店 | Nakatosa |
| Hamakawa Shoten | 濵川商店 | Tano |
| Kochi Shuzo | 高知酒造 | Ino |

## Trampas
- ⚠ **土佐市 (Tosa-shi) y 土佐町 (Tosa-cho, 土佐郡) son dos municipios distintos**
  de esta prefectura, y en esta tabla hay una bodega en cada uno: 亀泉酒造 en la
  ciudad y 土佐酒造 en el pueblo. `Tosa` a secas no basta.
- ⚠ **菊水酒造 (Aki, Kochi)** no es 菊水酒造 (Shibata, Niigata), la de ふなぐち, ya
  en `niigata.md`; ni 喜久水酒造 (Noshiro, Akita), en `akita.md`. Tres empresas.
- ⚠ **酔鯨酒造 aparece dos veces** (sede en Kochi y 土佐蔵 en Tosa-shi): es **una
  empresa**. Una fila, en el municipio donde elabora lo que se vende.
- **高木酒造 (Konan, Kochi)** no es 高木酒造 (Murayama, Yamagata), la de 十四代,
  en `yamagata.md`. Mismo 社名, dos de las bodegas más conocidas de Japón.
- **いの町 (Ino)** se escribe en hiragana y **芸西村 (Geisei)** es 村, no 町.

## Qué falta
- Las 7 bodegas restantes del censo.
- Kochi es la prefectura más rural de Japón y el pool no sakero es enorme, y
  ninguno abierto: **ゆず (yuzu)**, del que produce en torno a la mitad nacional
  — Umaji y Kitagawa tienen cooperativas con venta online consolidada;
  **生姜 (jengibre)**, también primera de Japón; **鰹のたたき** y el bonito de
  Kure/Nakatosa; 四万十 (nori de río, あおさ, 青のり), 文旦 y 小夏,
  碁石茶 (té fermentado de Otoyo, rarísimo y con muy pocos productores).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| （株）小谷穀粉 | （株）小谷穀粉 | 高知県高知市高須1-14-8 | 有機加工食品 | 01-005B |
| （有）　池田柚華園 | （有）　池田柚華園 | 高知県安芸郡北川村加茂314 | 有機加工食品 | JI010322PR-0391-0 |
| 国友商事株式会社　代表取締役　國友　昭香 | 国友商事株式会社 | 高知県吾川郡いの町小川小倉3097　他 | 有機農産物 | CF-A-001 |
| 国友商事株式会社　代表取締役　国友　昭香 | 国友商事（株） | 高知県吾川郡いの町小川柳野3216　他 | 有機加工食品 | B07-1001-001 |
| 馬路村農業協同組合 | 馬路村農業協同組合柚子部有機研究会 | 高知県安芸郡馬路村馬路3888番地1 | 有機加工食品 |  |
| 愛農高知有機生産組合 | 1 他 | 高知県南国市里改田長泉338　他 | 有機農産物 | 39-01 |
| アロインス製薬株式会社　四万十工場 | A25-1001-003 | 高知県四万十市間崎1017-1(2) | 有機農産物 | CF-A-009 |
| 一般財団法人夢産地とさやま開発公社 | A09-1003-002　他 | 高知県高知市土佐山弘瀬3234番地4イ | 有機農産物 | CF-A-010 |
| 森田真二 | 森田真二 | 高知県須崎市浦ノ内灰方1157-1-ｲ　他 | 有機農産物 | A10-1010-001 |
| 下村宏治 | A10-1009-001 | 高知県長岡郡大豊町怒田948-1、他3筆 | 有機農産物 | CF-A-016 |
| 碓井農園　碓井一四 | A12-1001-002 | 高知県高岡郡四万十町中神ノ川字柳の川558 | 有機農産物 | CF-A-046 |
| 高石　和典 | 15番ほ場 | 高知県長岡郡大豊町中村大王ヲクハゲ2552 | 有機農産物 | 39344100215 |
| 青山農園　青山　洌 | A14-1005-004　他 | 高知県香美市土佐山田町新改字林ノ谷308番2他3筆　他 | 有機農産物 | CF-A-027 |
| 刈谷農園　刈谷　真幸 | A12-1010-001　他 | 高知県吾川郡いの町字山神西2162他2筆　他 | 有機農産物 | CF-A-029 |
| YAOKI　代表　中越　貴彦 | A13-1011-001　他 | 高知県高岡郡中土佐町大野見萩中983　他 | 有機農産物 | A13-1011-001～003 |
| 株式会社高知前川種苗 | A13-1012-001　他 | 高知県香美市香北町白川760-1 | 有機農産物 | CF-A-038 |
| 宇藤　誠朗 | 高知県長岡郡大豊町佐賀山宮ノ鳴162番地1　他 | 高知県長岡郡大豊町佐賀山宮ノ鳴162番地1　他 | 有機農産物 | 39344100501～5 |
| 株式会社高知前川種苗　代表取締役前川卓也 | B14-1001-001 | 高知県高知市相生町6-3 | 有機加工食品 | B14-1001-001～002 |
| 株式会社はるひ畑 | A15-1001-002 | 高知県長岡郡大豊町津家桧生1547-37 | 有機農産物 | CF-A-046 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/kochi.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **propia** — búsqueda dirigida por producto; ficha o web propia del productor
- Estado: revisión cerrada el 2026-08-10; **2** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 吉永鰹節店 | Tosa | Conservas | propia | — | 鰹節; 宇佐町, sin dominio confirmado; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |
| 馬路村農協 | Umaji | Fruta y verdura | propia | yuzu.or.jp | yuzu transformado; cooperativa, triar; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/kochi.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **5 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 馬路村農協 | 馬路村 | Fruta y verdura | búsqueda dirigida + web propia | https://www.yuzu.or.jp/ | ⚠ cooperativa de yuzu, triar; 安芸郡馬路村 |
| たけまさ商店 | ⚠ | Pescado | búsqueda dirigida + web propia | https://takemasa-syouten.com/ | ⚠ municipio sin confirmar (Tosashimizu); 宗田節, centenaria |
| 土佐清水食品 | 土佐清水市 | Pescado | búsqueda dirigida + web propia | https://tosashimizu.co.jp/ | 宗田節 |
| 新谷商店 | 土佐清水市 | Pescado | búsqueda dirigida + web propia | https://soudabushi.com/ | 宗田節 y ahumados |
| ヤマア | 土佐清水市 | Pescado | búsqueda dirigida + web propia | https://yamaa-souda.com/ | 宗田節 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/kochi.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/kochi> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| YUZU LIFE | 三原村 | Pescado | https://www.tabechoku.com/producers/25351 | 高知県三原村でゆずを栽培しています。屋号のYUZU LIFEには”ゆずでお客様の暮らしを豊かに、私たちはゆずで生きていく”という気持ちを込め |
| いちえん農場 | 四万十市 | Pescado | https://www.tabechoku.com/producers/21110 | 20代で林業をかじり、30歳で農業を継ぎ、40代では漁業にも取り組んでみようかと思っているおっさんです。”生まれ育った環境を守り活かしたい“ |
| 土佐の漁師 | 室戸市 | Pescado | https://www.tabechoku.com/producers/26854 | 高知県の最南東、 室戸市を拠点に漁師を営んでおり、自社所有船で近海マグロ漁をしております。 |
| ヤドリギ製茶 | 本山町 | Té e infusiones | https://www.tabechoku.com/producers/24575 | 私たちは四国のど真ん中・高知県本山町という地域で、林業をナリワイとする夫婦です。木の伐採作業を行う上で、どうしても伐らざるをえないクロモジを |
| 岡﨑ファーム | いの町 | Carne | https://www.tabechoku.com/producers/24571 | 2020年末に地元高知県にUターンし、新規就農者として高知県いの町の山奥で、師匠の使わなくなった鶏舎を借りて土佐ジローの養鶏を始めました。 |
| 超たまご田所養鶏場 | 南国市 | Carne | https://www.tabechoku.com/producers/26736 | 南国土佐のいごっそう（頑固者）が、飼料はもちろん、水や鶏舎の土壌開発にまでこだわって育てたにわとり、そんなにわとりが生む卵だから、黄身は濃厚 |
| 四万十ポーク農場直営店　デュロックファーム | 四万十町 | Carne | https://www.tabechoku.com/producers/24626 | 全国的にも有名な高知県四万十川の上中流域に位置する自然豊かな地域、四万十町という場所で「四万十ポーク」というブランド豚を自社農場で育てており |
| 仁淀川きくらげ｜高知県仁淀川町産 | 仁淀川町 | Setas | https://www.tabechoku.com/producers/20739 | はじめまして。 |
| グレイスファーム | 南国市 | Setas | https://www.tabechoku.com/producers/28592 | 令和元年から生きくらげの生産に取り組んでいます。 |
| 宗安寺きのこセンター | 高知市 | Setas | https://www.tabechoku.com/producers/28921 | 高知市鏡川の畔で、鏡川のきれいな水を使用しプリプリの国産キクラゲを育てています。ビタミンD、鉄分、食物繊維、カルシウムが大変豊富に含まれてい |
| おおとよ塩かえる農園 | 大豊町 | Condimentos | https://www.tabechoku.com/producers/21075 | おおとよ塩かえる農園は、10年前に東京から高知の山奥に移住した、農業未経験だった夫婦二人が営む小さな農園です。 |
| 田野屋紫蘭 | 安田町 | Condimentos | https://www.tabechoku.com/producers/3077886 | 私たちは夫婦で完全天日塩職人をしています。元々は２人とも埼玉県春日部市役所の公務員でしたが塩職人になるべく田野屋塩二郎の下、３年間修業をして |
| やまみずき農園（マル・シェリア） | 四万十市 | Conservas | https://www.tabechoku.com/producers/22194 | -高知県の四万十川と太平洋が出会う岬にある農園で、農園女子が育てた農薬・化学肥料不使用の野菜や加工品を生産し、直販所や直営店舗（農園マルシェ |
| たまごのおくだ | 南国市 | Huevos | https://www.tabechoku.com/producers/20908 | 私は先祖代々の稲作農家育ちの８代目です。 |
| 坂本農園（高知県） | いの町 | Pan y cereal | https://www.tabechoku.com/producers/24959 | 高知県いの町の仁淀川のすぐそばで、ブドウや土佐文旦などの果樹をメインに栽培しております。 |
| 南国にしがわ農園 | 南国市 | Pan y cereal | https://www.tabechoku.com/producers/23790 | 完全無農薬はもちろん肥料や除草剤も使わない、究極のオーガニックと言われる徹底した自然農法を実践し、2013年9月に有機JAS認証を取得してい |
| 土佐水谷農園 | 土佐市 | Pan y cereal | https://www.tabechoku.com/producers/23287 | こんにちは。土佐文旦発祥の地、高知県土佐市の土佐水谷農園です。私たちの農園では、土佐文旦を約1ヘクタールの園地で栽培しています。その他季節の |
| マルシン生姜ファーム | 四万十市 | Fruta y verdura | https://www.tabechoku.com/producers/28545 | 私たちは、清流四万十川の下流域で生姜のハウス栽培をおこなっております。新規就農で農業の世界に入り9年目ですが、今までの生姜のイメージを変えて |
| 林田孝好 | 奈半利町 | Fruta y verdura | https://www.tabechoku.com/producers/26177 | 兼業農家からスタートして専業農家として農業歴60年。 |
| 篤農 | 香南市 | Fruta y verdura | https://www.tabechoku.com/producers/20869 | 私達は約40年になるメロン栽培技術の蓄積があります。 |
| やの一果彩 | 土佐市 | ⚠ por decidir | https://www.tabechoku.com/producers/28729 | 「やの一果彩」の土佐文旦は、土佐文旦発祥の地で70年以上にわたり受け継がれてきた伝統と誇りの結晶です。 |
| 坂本直幸 | 土佐清水市 | ⚠ por decidir | https://www.tabechoku.com/producers/25423 | 高知県の海と山に囲まれた自然いっぱいの山奥で農業を営んでおります。夏はハウス生姜を、秋は露地生姜を収穫しております。 |
