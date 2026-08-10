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
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/shizuoka> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 山竹商店 山田勝美 | 沼津市 | Pescado | https://www.tabechoku.com/producers/24652 | 日本屈指の駿河湾で底曳網漁を営む山竹商店・山田勝美です。年間を通して旅館・食堂へ卸販売、直販をしております。 |
| マルセイ水産 | 沼津市 | Pescado | https://www.tabechoku.com/producers/23447 | 静岡県東部、国内有数の水質を誇る【駿河湾】に面する沼津市西浦。 |
| カネナカ淡水魚 | 浜松市 | Pescado | https://www.tabechoku.com/producers/21106 | 静岡県浜松市で『浜名湖産うなぎ』の養殖と加工をしております。 |
| 佐京園 | 島田市 | Té e infusiones | https://www.tabechoku.com/producers/21849 | 静岡県金谷地区で江戸時代より300年続くお茶農家。現在13代目。 |
| むら茶園 | 島田市 | Té e infusiones | https://www.tabechoku.com/producers/21441 | 静岡県島田市で昔ながらの芯までしっかり蒸した本物の深蒸し茶を始めとした抹茶、ほうじ茶などを栽培～販売まで行っているお茶農家です。世界農業遺産 |
| farm1987 | 下田市 | Carne | https://www.tabechoku.com/producers/26097 | はじめまして。静岡県下田市にて、夫婦で自然養鶏(24時間放牧)を行なっています、稲田と申します。2021年12月より、南米チリ原産アローカナ |
| もりしま黒豚 | 浜松市 | Carne | https://www.tabechoku.com/producers/23874 | 初めまして。静岡県浜松市浜北区で黒豚を育てています森島宏昌です。 |
| 富士きのこセンター | 富士市 | Setas | https://www.tabechoku.com/producers/21189 | 富士きのこセンターは、富士山の麓の静岡県富士市で40年ほど前に父が始めて私は2代目になります。 |
| 大井川電機製作所キノコ部 | 島田市 | Setas | https://www.tabechoku.com/producers/23518 | 私たちは静岡県の山間地で自動車用の電球を製造している会社ですが、地域の雇用を守るため、その技術を活かしてホホホタケの栽培をはじめました。 |
| abeille | 函南町 | Miel | https://www.tabechoku.com/producers/21211 | 「南箱根の生はちみつ」は自家採取です。南箱根は伊豆高原の玄関口で標高３００～６００メートルの広い場所に数多くの花、樹木花が生い茂る素晴らしい |
| edama | 牧之原市 | Legumbres | https://www.tabechoku.com/producers/24491 | 10年前から枝豆を中心とした農業をはじめました。毎年勉強ばかりですが、毎年少しですが成長も感じています。今年が一番美味しい！と毎年思える枝豆 |
| 五代目わさび師『坂ぐち』浅田良一 | 伊豆市 | Condimentos | https://www.tabechoku.com/producers/21056 | はじめまして、創業100年超えの五代目わさび師、浅田良一です🍀。ここ静岡県伊豆市は、わさび(根茎)の生産量＆産出額ともに日本一🍀。携帯電話も |
| 市川わさび園 | 静岡市 | Condimentos | https://www.tabechoku.com/producers/28338 | こんにちは！市川わさび園の市川しょうごです😊 |
| とやま農園 | 浜松市 | Conservas | https://www.tabechoku.com/producers/3077174 | 静岡県のみかんの産地三ケ日町で、みかんの生産と加工品を生産販売をしています。 |
| ふもとのジャージー牧場 | 富士宮市 | Lácteos y quesos | https://www.tabechoku.com/producers/29299 | 朝霧高原の耕作放棄地と森を利用して、ジャージー牛を放牧しています。 |
| 里山栗田ファーム | 菊川市 | Frutos secos | https://www.tabechoku.com/producers/26934 | ご覧頂き誠にありがとうございます😊 |
| なごみ農園 | 富士宮市 | Pan y cereal | https://www.tabechoku.com/producers/29 | 富士山麓の自然豊かな環境で、年間200品種ほどの米、野菜、穀物、くだものを栽培しています。 |
| 森島農園 | 浜松市 | Pan y cereal | https://www.tabechoku.com/producers/21485 | 静岡県浜松市で、米・小松菜・季節の露地野菜・サラダ野菜などの栽培をしている農業法人です。 |
| シックスベリーファーマーズ 松田農園 | 焼津市 | Fruta y verdura | https://www.tabechoku.com/producers/29230 | 江戸時代から続く農家で、いちご生産歴は50年以上です。 |
| メークリヒカイト | 磐田市 | Fruta y verdura | https://www.tabechoku.com/producers/21913 | 静岡県磐田市で果物の栽培をしている鈴木です。 |
| ポットハウス | 東伊豆町 | ⚠ por decidir | https://www.tabechoku.com/producers/24087 | 当ポットハウスは実就園の直売店です。 |
| 浜名湖ﾌｧｰﾑ | 湖西市 | ⚠ por decidir | https://www.tabechoku.com/producers/22374 | 静岡県湖西市でうずらを飼育しています。 |
