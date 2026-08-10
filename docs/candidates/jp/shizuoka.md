# Shizuoka — candidatos

- CSV: `data/csv/jp/chubu/shizuoka.csv` (3 filas, todas altas de esta pasada).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (2026-08-04).
- Estado: **las 3 integradas** en el CSV el 2026-08-04 como `parcial`. Cola vacía; el valor de este fichero es ahora el «Qué falta».

| nombre | municipio | categoría | A/B | web |
|---|---|---|---|---|
| Suzuki Choju Shoten / Yamacho | Mori | Té e infusiones | B | 100nen-meicha.jp |
| Baird Brewing | Izu (Shuzenji) | Cerveza | B | bairdbeer.com |
| West Coast Brewing | Shizuoka (Mochimune) | Cerveza | B | westcoastbrewing.jp |

Mochimune es un barrio de la ciudad de **Shizuoka** y Shuzenji de **Izu**: el
`municipio` es la ciudad, no el barrio.

## Sake (14, pasada 2026-08-04)

Cola nueva: el fichero estaba vacío de candidatos. Fuente: censo de 酒蔵 de
SAKETIMES, <https://jp.sake-times.com/sakagura/shizuoka> (30 bodegas, leído
2026-08-04). Gremio: 静岡県酒造組合, <http://www.shizuoka-sake.jp/>.
Ninguna trae dominio. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Isojiman Shuzo | 磯自慢酒造 | Yaizu |
| Aoshima Shuzo | 青島酒造 | Fujieda |
| Shidaizumi Shuzo | 志太泉酒造 | Fujieda |
| Sugii Shuzo | 杉井酒造 | Fujieda |
| Eikun Shuzo | 英君酒造 | Shizuoka |
| Kanzawagawa Shuzojo | 神沢川酒造場 | Shizuoka |
| Kunpai Shuzo | 君盃酒造 | Shizuoka |
| Sanwa Shuzo | 三和酒造 | Shizuoka |
| Shizuoka Hiraki Shuzo | 静岡平喜酒造 | Shizuoka |
| Suruga Shuzojo | 駿河酒造場 | Shizuoka |
| Omuraya Shuzojo | 大村屋酒造場 | Shimada |
| Enshu Yamanaka Shuzo | 遠州山中酒造 | Kakegawa |
| Kokko Shuzo | 國香酒造 | Fukuroi |
| Senju Shuzo | 千寿酒造 | Iwata |

Seis están en 静岡市, que tras las fusiones es enorme y con tres 区: el
`municipio` es `Shizuoka`, como ya se decidió arriba para Mochimune.

## Qué falta
Shizuoka produce en torno al 40% del té de Japón y aquí hay **un** productor.
Lo que ya se descartó como fuente y por qué:
- 静岡茶商工業協同組合 (`ocha.or.jp/member/`) lista **茶商**, comerciantes y
  mayoristas de té concentrados en los distritos Aoi y Suruga de la capital. No
  son productores: no sirve como cantera, solo para cruzar nombres.

Frentes que sí quedan abiertos:
- Cooperativas y農園 de las zonas de té con denominación: **Kawane**, **Honyama**,
  **Kakegawa**, **Makinohara**, **Fujieda**, y el propio Mori.
- Wasabi de Izu y Utogi (cultivo en tatami-ishi, patrimonio agrícola mundial).
- Gremio de sake de Shizuoka, mikan de Mikkabi, pescado de Yaizu (katsuobushi) y
  Numazu (himono), fresa de Kunōzan.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 自然のわ研究会 | 自然のわ研究会　茶再製加工場 | 静岡県島田市金谷猪土居3769-3 | 有機加工食品 | MPJP1333 |
| 掛川市農業協同組合 | 掛川市農業協同組合緑茶加工施設 | 静岡県掛川市千羽1266 | 有機加工食品 | 203040401 |
| ミヤハラフーズ株式会社 | ミヤハラフーズ株式会社　原料第1倉庫 | 静岡県静岡市清水区中河内878-1、880-1 | 有機加工食品 | 第1293号 |
| （株）かつまた | （株）かつまた　他 | 静岡県富士市大渕3478-1　他 | 有機加工食品 | 第1139号 |
| 丸福製茶（株） | 丸福製茶（株）　本社工場　他 | 静岡県静岡市葵区若松町25　他 | 有機加工食品 | JM90501K-0234-0 |
| 茗広茶業（株） | 茗広茶業（株）　本社工場　他 | 静岡県静岡市葵区北番町117-4　他 | 有機加工食品 | JM030513PR-0613-0 |
| 中村製粉（株） | 中村製粉（株） | 静岡県浜松市中央区和合町1210 | 有機加工食品 | JＮ60810PR-0909-0 |
| 清茶会 | 清茶会 | 静岡県藤枝市助宗大谷184 | 有機農産物 | 01-036 |
| 住岡食品株式会社 | 住岡食品株式会社浜北工場　他 | 静岡県浜松市浜名区平口5201-1　他 | 有機加工食品 | カ-03-02 |
| 株式会社増田採種場 | 株式会社増田採種場 1 他 | 静岡県磐田市気子島983 他 | 有機農産物 | 2001F-38 |
| 株式会社八木音 | 株式会社八木音 工場 他 | 静岡県藤枝市茶町1丁目1-43 他 | 有機加工食品 | 2002M-4 |
| 株式会社小柳津清一商店 | 本社工場　他 | 静岡県静岡市駿河区向敷地1-5-38　他 | 有機加工食品 | カ-05-02 |
| 株式会社浜佐商店 | 株式会社浜佐商店　他 | 静岡県静岡市葵区安西3-11　他 | 有機加工食品 | 200111601 |
| 丸善製茶（株）　丸子工場 | 丸善製茶（株）　丸子工場　他 | 静岡県静岡市駿河区丸子新田314 | 有機加工食品 | JM80518K-0175-0 |
| 高砂珈琲（株）　磐田工場 | 高砂珈琲（株）　第一工場　他 | 静岡県磐田市下万能525-1　他 | 有機加工食品 | JT000122PR-0259-0 |
| 株式会社伊藤園 静岡相良工場 | 株式会社伊藤園 静岡相良工場 | 静岡県牧之原市女神21 | 有機加工食品 | 01-12B |
| （株）かねも | （株）かねも | 静岡県掛川市掛川70 | 有機加工食品 | JK050426PR-0817-0 |
| 永倉精麦株式会社 | 永倉精麦株式会社　他 | 静岡県駿東郡長泉町東野50-18　他 | 有機加工食品 | MPJP1081 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/shizuoka.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **4** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| チーズ工房HAKU | Hamamatsu | Lácteos y quesos | ChFun | cheesehaku.hamazo.tv | revisado 2026-08-10: la guía no pudo enlazarse con una fuente primaria actual y localización completa |
| 浜松アクトビール | Hamamatsu | Cerveza | JBA | 9199.jp | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 御殿場高原ビール | Gotemba | Cerveza | JBA | gkb.co.jp | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 酪農王国 (風の谷のビール) | Kannami | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/shizuoka.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/shizuoka.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **5 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| いせや本店 | 沼津市 | Dulces y repostería | 和菓子協会 | http://www.heisaku.com/ | 沼津市幸町 2 |
| 菓子舗　間瀬 | 熱海市 | Dulces y repostería | 和菓子協会 | http://www.mase-jp.com/ | 熱海市網代 400-1 |
| 平松商店 | 掛川市 | Aperitivos | 全国米菓工業組合 | 会社　http://hiramatsu-shoten.com | 米菓製造・販売業（直売所有り） |
| 有限会社花見煎餅 | 沼津市 | Aperitivos | 全国米菓工業組合 | https://www.numazu-hanami.com | 米菓製造・販売業（直売所有り）、米菓販売業（その他菓子を含む卸・小売業） |
| 株式会社伊奈製菓 | 静岡市 | Aperitivos | 全国米菓工業組合 | http://inasenbei.com | 米菓製造・販売業（直売所有り）、米菓販売業（その他菓子を含む卸・小売業） |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/shizuoka.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/shizuoka> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Pescado 5, Fruta y verdura 5, Té e infusiones 2, Huevos 2, Setas 2, Carne 2, Condimentos 2, Miel 1, Frutos secos 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| abeille | 函南町 | Miel | ficha | — | https://www.tabechoku.com/producers/21211 | 静岡県田方郡函南町 |
| 佐京園 | 島田市 | Té e infusiones | ficha | — | https://www.tabechoku.com/producers/21849 |  |
| むら茶園 | 島田市 | Té e infusiones | ficha | — | https://www.tabechoku.com/producers/21441 |  |
| farm1987 | 下田市 | Huevos | ficha | — | https://www.tabechoku.com/producers/26097 |  |
| 浜名湖ﾌｧｰﾑ | 湖西市 | Huevos | ficha | — | https://www.tabechoku.com/producers/22374 |  |
| 富士きのこセンター | 富士市 | Setas | ficha | — | https://www.tabechoku.com/producers/21189 |  |
| 大井川電機製作所キノコ部 | 島田市 | Setas | ficha | — | https://www.tabechoku.com/producers/23518 |  |
| 山竹商店 山田勝美 | 沼津市 | Pescado | ficha | — | https://www.tabechoku.com/producers/24652 |  |
| マルセイ水産 | 沼津市 | Pescado | ficha | — | https://www.tabechoku.com/producers/23447 |  |
| カネナカ淡水魚 | 浜松市 | Pescado | ficha | — | https://www.tabechoku.com/producers/21106 | 静岡県浜松市西区馬郡町 |
| edama | 牧之原市 | Pescado | ficha | — | https://www.tabechoku.com/producers/24491 |  |
| メークリヒカイト | 磐田市 | Pescado | ficha | — | https://www.tabechoku.com/producers/21913 |  |
| ふもとのジャージー牧場 | 富士宮市 | Carne | ficha | — | https://www.tabechoku.com/producers/29299 |  |
| もりしま黒豚 | 浜松市 | Carne | ficha | — | https://www.tabechoku.com/producers/23874 |  |
| 五代目わさび師『坂ぐち』浅田良一 | 伊豆市 | Condimentos | ficha | — | https://www.tabechoku.com/producers/21056 |  |
| 市川わさび園 | 静岡市 | Condimentos | ficha | — | https://www.tabechoku.com/producers/28338 |  |
| 里山栗田ファーム | 菊川市 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/26934 |  |
| なごみ農園 | 富士宮市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29 |  |
| ポットハウス | 東伊豆町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24087 | 静岡県賀茂郡東伊豆町 |
| とやま農園 | 浜松市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077174 |  |
| 森島農園 | 浜松市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21485 |  |
| シックスベリーファーマーズ 松田農園 | 焼津市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29230 |  |
