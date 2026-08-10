# Niigata — candidatos

- CSV: `data/csv/jp/chubu/niigata.csv` (6 filas, altas del 2026-08-05).
- Fuente: 新潟県酒造組合 vía <https://howtoniigata.jp/spot/nihonshu/40210/> — las 89 bodegas del gremio con marca y municipio. Contraste institucional: el mapa de la Agencia Tributaria, <https://www.nta.go.jp/about/organization/kantoshinetsu/sake/sake_breweries_map/pdf/sake_jp/sake_niigata_jp.pdf>.
- Estado: **6 integradas** el 2026-08-05 (4 `verificado` con tienda, 2 `parcial`); quedan 85. Evidencia en `data/evidence/jp/chubu/niigata.jsonl`.

Niigata es la prefectura con más bodegas de Japón. El listado da marca y
municipio pero **no web**: cada alta necesita localizar el dominio propio y
confirmar identidad, actividad y municipio. Solo-gremio sostiene `parcial`.

Categoría para todas: `Sake`. El rōmaji de `nombre` es propuesta a confirmar.

**Municipio en el CSV:** el listado usa barrios (新潟市西蒲区, 上越市柿崎区,
南魚沼市塩沢). El `municipio` correcto es la ciudad — `Niigata`, `Joetsu`,
`Minamiuonuma` — porque es lo que resuelve contra los centroides.

## 下越 Kaetsu (29)

| nombre (rōmaji propuesto) | 社名 | marca | municipio |
|---|---|---|---|
| Miyao Shuzo | 宮尾酒造 | 〆張鶴 Shimeharitsuru | Murakami |
| Taiyo Shuzo | 大洋酒造 | 大洋盛 Taiyozakari | Murakami |
| Omon Shuzo | 王紋酒造 | 王紋 Omon | Shibata |
| Kikusui Shuzo | 菊水酒造 | 菊水ふなぐち | Shibata |
| Fujinoi Shuzo | ふじの井酒造 | ふじの井 | Shibata |
| Kanemasu Shuzo | 金升酒造 | 金升 | Shibata |
| Echigozakura Shuzo | 越後桜酒造 | 越後桜 | Agano |
| Koshi Tsukano Shuzo | 越つかの酒造 | 越乃あじわい | Agano |
| Hakuryu Shuzo | 白龍酒造 | 白龍 | Agano |
| Kondo Shuzo | 近藤酒造 | 越乃鹿六 | Gosen |
| Kinshihai Shuzo | 金鵄盃酒造 | 越後杜氏 | Gosen |
| Kaetsu Shuzo | 下越酒造 | 蒲原 Kambara | Aga |
| Murayu Shuzo | 村祐酒造 | 花越路 | Niigata (秋葉区) |
| Shiokawa Shuzo | 塩川酒造 | 越の関 | Niigata (西区) |
| Higi Shuzo | 樋木酒造 | 鶴の友 | Niigata (西区) |
| Takano Shuzo | 高野酒造 | 越路吹雪 | Niigata (西区) |
| Echigo Denemon | 越後伝衛門 | 伝衛門 | Niigata (北区) |
| DHC Shuzo | DHC酒造 | 嘉山 | Niigata (北区) |
| Echigo Shuzojo | 越後酒造場 | 甘雨 | Niigata (北区) |
| LAGOON BREWERY | LAGOON BREWERY | 翔空 | Niigata (北区) |
| Takarayama Shuzo | 宝山酒造 | 宝山 | Niigata (西蒲区) |
| Mine no Hakubai Shuzo | 峰乃白梅酒造 | 峰乃白梅 | Niigata (西蒲区) |
| Echigo Tsurukame | 越後鶴亀 | 越後鶴亀 | Niigata (西蒲区) |
| Sasaiwai Shuzo | 笹祝酒造 | 笹祝 | Niigata (西蒲区) |
| Asazuma Shuzo | 朝妻酒造 | 雪乃幻 | Niigata (西蒲区) |
| Yahiko Shuzo | 弥彦酒造 | 彌彦 Yahiko | Yahiko |

## 中越 Chuetsu (35)

| nombre (rōmaji propuesto) | 社名 | marca | municipio |
|---|---|---|---|
| Hakuro Shuzo | 柏露酒造 | 越乃柏露 | Nagaoka |
| Takahashi Shuzo | 高橋酒造 | 長陵 | Nagaoka |
| Yoshinogawa | 吉乃川 | 極上吉乃川 | Nagaoka |
| Hasegawa Shuzo | 長谷川酒造 | 越後雪紅梅 | Nagaoka |
| Ofuku Shuzo | お福酒造 | お福正宗 | Nagaoka |
| Onda Shuzo | 恩田酒造 | 舞鶴 | Nagaoka |
| Koshi Meijo | 越銘醸 | 越の鶴 | Nagaoka |
| Morohashi Shuzo | 諸橋酒造 | 越乃景虎 | Nagaoka |
| Suminoi Shuzo | 住乃井酒造 | 住乃井 | Nagaoka |
| Nakagawa Shuzo | 中川酒造 | 越乃白雁 | Nagaoka |
| Kawachu Shuzo | 河忠酒造 | 想天坊 | Nagaoka |
| Sekihara Shuzo | 関原酒造 | 群亀 | Nagaoka |
| Tochikura Shuzo | 栃倉酒造 | 米百俵 | Nagaoka |
| Kusumi Shuzo | 久須美酒造 | 亀の翁 | Nagaoka |
| Ikeura Shuzo | 池浦酒造 | 和楽互尊 | Nagaoka |
| Masukagami | マスカガミ | 萬寿鏡 | Kamo |
| Kamonishiki Shuzo | 加茂錦酒造 | 加茂錦 | Kamo |
| Yukitsubaki Shuzo | 雪椿酒造 | 越乃雪椿 | Kamo |
| Fukugao Shuzo | 福顔酒造 | 福顔 | Sanjo |
| Niigata Meijo | 新潟銘醸 | 越の寒中梅 | Ojiya |
| Takanoi Shuzo | 高の井酒造 | 田友 | Ojiya |
| Midorikawa Shuzo | 緑川酒造 | 緑川 | Uonuma |
| Tamagawa Shuzo | 玉川酒造 | 魚沼玉風味 | Uonuma |
| Aoki Shuzo | 青木酒造 | 鶴齢 Kakurei | Minamiuonuma (塩沢) |
| Takachiyo Shuzo | 髙千代酒造 | 髙千代 | Minamiuonuma |
| Matsunoi Shuzojo | 松乃井酒造場 | 松乃井 | Tokamachi |
| Uonuma Shuzo | 魚沼酒造 | 天神囃子 | Tokamachi |
| Naeba Shuzo | 苗場酒造 | 苗場山 | Tsunan |
| Tsunan Jozo | 津南醸造 | 霧の塔 | Tsunan |
| Hara Shuzo | 原酒造 | 越の誉 | Kashiwazaki |
| Abe Shuzo | 阿部酒造 | 越乃男山 | Kashiwazaki |
| Ishizuka Shuzo | 石塚酒造 | 姫の井 | Kashiwazaki |

## 上越 Joetsu (20)

| nombre (rōmaji propuesto) | 社名 | marca | municipio |
|---|---|---|---|
| Takeda Shuzoten | 竹田酒造店 | かたふね Katafune | Joetsu (大潟区) |
| Koyama Shuzoten | 小山酒造店 | 越後自慢 | Joetsu (大潟区) |
| Musashino Shuzo | 武蔵野酒造 | スキー正宗 | Joetsu |
| Tanaka Shuzo | 田中酒造 | 能鷹 | Joetsu |
| Myoko Shuzo | 妙高酒造 | 妙高山 | Joetsu |
| Maruyama Shuzojo | 丸山酒造場 | 雪中梅 Setchubai | Joetsu (三和区) |
| Kubiki Shuzo | 頚城酒造 | 久比岐 | Joetsu (柿崎区) |
| Yoyogiku Jozo | 代々菊醸造 | 吟田川 Chidakara | Joetsu (柿崎区) |
| Kato Shuzo | 加藤酒造 | 清正 | Joetsu (吉川区) |
| Yoshikawa Toji no Sato | よしかわ杜氏の郷 | よしかわ杜氏 | Joetsu (吉川区) |
| Joetsu Shuzo | 上越酒造 | 越後美人 | Joetsu |
| Niigata Daiichi Shuzo | 新潟第一酒造 | 越の白鳥 | Joetsu (浦川原区) |
| Ayamasamune Shuzo | 鮎正宗酒造 | 鮎正宗 | Myoko |
| Kiminoi Shuzo | 君の井酒造 | 君の井 | Myoko |
| Chiyonohikari Shuzo | 千代の光酒造 | 千代の光 | Myoko |
| Kaganoi Shuzo | 加賀の井酒造 | 加賀の井 | Itoigawa |
| Ikedaya Shuzo | 池田屋酒造 | 謙信 Kenshin | Itoigawa |
| Tahara Shuzo | 田原酒造 | 雪鶴 | Itoigawa |
| Watanabe Shuzoten | 渡辺酒造店 | 根知男山 Nechi Otokoyama | Itoigawa |
| Inomata Shuzo | 猪又酒造 | 月不見の池 | Itoigawa |

## Integradas 2026-08-05 (6)

| bodega | municipio | resultado |
|---|---|---|
| Asahi Shuzo (Kubota) | Nagaoka | verificado · venta sí |
| Imayotsukasa Shuzo | Niigata | verificado · venta sí |
| Kirinzan Shuzo | Aga | verificado · venta sí |
| Shirataki Shuzo (Jozen) | **Yuzawa** ⚠ | verificado · venta sí |
| Hakkai Jozo (Hakkaisan) | Minamiuonuma | **parcial** · web sin respuesta |
| Ishimoto Shuzo (Koshi no Kanbai) | Niigata | **parcial** · sin web |

⚠ **`Yuzawa` resolvía al 湯沢市 de Akita** en vez del 湯沢町 de Niigata, a 280 km:
error bloqueante. Resuelto el 2026-08-05 en `municipality-overrides.json`
(tohoku vs chubu). Es el séptimo homónimo de este tipo abierto en la pasada.

Las cuatro con tienda son marcas de exportación; las dos `parcial` son, a la
inversa, dos de las más famosas del país — Hakkaisan y Koshi no Kanbai — y ni
una ni otra se dejó leer.

## 佐渡 Sado (5)

| nombre (rōmaji propuesto) | 社名 | marca | municipio |
|---|---|---|---|
| Obata Shuzo | 尾畑酒造 | 真野鶴 Manotsuru | Sado |
| Hokusetsu Shuzo | 北雪酒造 | 北雪 | Sado |
| Henmi Shuzo | 逸見酒造 | 真稜 | Sado |
| Tenryohai Shuzo | 天領盃酒造 | 天領盃 | Sado |
| Kato Shuzoten | 加藤酒造店 | 金鶴 Kintsuru | Sado |

## Fuera del sake (2, del listado aportado 2026-08-04)

De `listado_125_productores_locales_japon.xlsx`. Sus otras 12 filas de Niigata
(Taiyo, Hakuryu, Miyao, Omon, Echigozakura, Koshitsukano, Kikusui, Fujinoi,
Kanemasu, Kondo, Kinshihai, Kirinzan) **ya estaban en la tabla de arriba**:
misma fuente, el gremio.

| nombre | municipio | categoría | A/B | web |
|---|---|---|---|---|
| Yukiguni Maitake | Minamiuonuma | Setas | A | maitake.co.jp ⚠ revisada 2026-08-09: cotizada y de cultivo industrial; retenida por escala, no descartada definitivamente |
| Echigo Beer | Niigata | Cerveza | B | echigobeer.com |

## Trampas vistas
- **Dos 加藤 distintos**: 加藤酒造 (清正, Joetsu) y 加藤酒造店 (金鶴, Sado). Y dos
  中川/中谷-style homónimos más en la lista: casar por marca, no por apellido.
- Nagaoka concentra 16 bodegas y Joetsu 12; al geocodificar, varias caerán en la
  banda de aviso 15-100 km porque son municipios enormes tras las fusiones Heisei
  (ya avisado en `docs/CSV_CONTRACT.md`). Leer el aviso antes de tocar `municipio`.
- El listado turístico dice 89 y el gremio contaba 88 en 2022: la diferencia son
  altas recientes (LAGOON BREWERY es de 2021). No cuadrar cifras a ciegas.

## Qué falta
- Ningún dominio recogido: es el primer trabajo de cada lote.
- Fuera del sake, sin abrir: arroz Koshihikari, 笹団子, pescado de Sado.
- **味噌/醤油/麹 es el siguiente vertical y ya tiene gremio localizado** (2026-08-04):
  新潟県味噌醤油工業協同組合, <https://niigata-miso-shouyu.amebaownd.com/>. La
  portada no lista socios y `/pages/1/` da 404: hay que encontrar la ruta del
  listado. Dos casas ya identificadas por fuera, con dominio propio y por tanto
  mejores que cualquier fila del gremio de sake: **町田醤油味噌醸造** (Joetsu,
  `machida-shouyumiso.co.jp`) y **山田屋** (`e-misoya.com`).
- Esta prefectura **no necesita más candidatos de sake**: arrastra 91 sin
  integrar. Lo que le falta es dominio por fila, no nombres nuevos.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 村山正明 | 1　他 | 新潟県中魚沼郡津南町大字下船渡乙4172　他 | 有機農産物 | S-038 |
| 長津安保 | 1　他 | 新潟県新潟市西蒲区下木島久保田175-1　他 | 有機農産物 | S-042 |
| 上野　晃 | 1　他 | 新潟県新潟市北区新井郷居裏1071-1073　他 | 有機農産物 | S-043 |
| 栄有機稲作研究会 | 栄有機稲作研究会　（株）ファームフレッシュヤマザキ　1　他 | 新潟県三条市渡前4352　他 | 有機農産物 | S-081 |
| 金谷武志 | 2　他 | 新潟県上越市三和区神田2360　他 | 有機農産物 | S-086 |
| 石橋直和 | 7　他 | 新潟県中魚沼郡津南町大字下船渡丁2620 他 | 有機農産物 | S-087 |
| エコファーム巻島 | 1　他 | 新潟県長岡市巻島町字ヨツワリ271-274　他 | 有機農産物 | S-097 |
| 山口　均 | 1　他 | 新潟県燕市松橋字南451～453, 455, 456　他 | 有機農産物 | S-124 |
| 宮尾浩史 | 1　他 | 新潟県新潟市北区内沼一本柳541～550, 515　他 | 有機農産物 | S-158 |
| Agri-S 清水耕司 | 11　他 | 新潟県見附市東今町510　他 | 有機農産物 | AFASSEQ-AA-020906 |
| 有限会社笠原農園 | 奥上40　他 | 新潟県南魚沼市奥字野中266、267、268、269-1　他 | 有機農産物 | AFASSEQ-AA-060901 |
| 株式会社フエキ農園 | 島の2反　他 | 新潟県南魚沼市島新田関端474-1.2　他 | 有機農産物 | AFASSEQ-AA-010904 |
| （有）加藤農場 | １他 | 新潟県新発田市向中条2992-2　他 | 有機農産物 | A－00－0006 |
| 伊藤　幸成 | 3 | 新潟県北蒲原郡聖籠町蓮潟龍門618　他 | 有機農産物 | A－05－0054 |
| 有限会社エーエフカガヤキ | １　他 | 新潟県新潟市江南区沢海1丁目624　他 | 有機農産物 | A－05－0055 |
| 農事組合法人　木津みずほ生産組合 | 1 | 新潟県新潟市新潟市江南区木津天王杉1688－1　他 | 有機農産物 | A－05－0056 |
| 斉藤　勇雄 | １他 | 新潟県阿賀野市駒林千刈8204　他 | 有機農産物 | A－05－0057 |
| 株式会社ごはん | A3-7　他 | 新潟県中魚沼郡津南町下船渡己6257　他 | 有機農産物 | A－00－0010 |
| 有限会社　ファーミング・スタッフ | １他 | 新潟県柏崎市西山町北野字仲田3604,3605　他 | 有機農産物 | A－00－0012 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/niigata.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
- Estado: revisión cerrada el 2026-08-10; **3** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 天朝閣 (スワンレイクビール) | Agano | Cerveza | JBA | swanlake.co.jp | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 八海山 (泉ビール) | Minamiuonuma | Cerveza | JBA | izumivillage.jp | matriz de sake; comprobar si procede fila aparte; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 新保企画 (Strange Brewing) | Minamiuonuma | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

**Ya integrado, no volver a proponer:** エチゴビール ya está en `niigata.csv`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/niigata.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/niigata.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **15 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| かなざわ総本舗 | 上越市 | Dulces y repostería | 和菓子協会 | http://www.syutujin.com/ | 上越市稲田 4-11-5 |
| 大阪屋 | 新潟市 | Dulces y repostería | 和菓子協会 | http://www.niigata-osakaya.com/ | 新潟市江南区大渕 1631-8 |
| 小冨士屋 | 新潟市 | Dulces y repostería | 和菓子協会 | http://www4.ocn.ne.jp/~kofujiya/index.htm | 新潟市岩室温泉 576 |
| 米百表本舗 | 長岡市 | Dulces y repostería | 和菓子協会 | http://www7.ocn.ne.jp/~kome100 | 長岡市大手通 1-3-2 |
| 越乃雪本舗大和屋 | 長岡市 | Dulces y repostería | 和菓子協会 | http://www.koshinoyuki-yamatoya.co.jp/ | 長岡市柳原町 3-3 |
| 阿部幸製菓株式会社 | 小千谷市 | Aperitivos | 全国米菓工業組合 | https://www.abeko.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）、米菓生地製造業・販売業 |
| 竹内製菓株式会社 | 小千谷市 | Aperitivos | 全国米菓工業組合 | https://www.takeuchiseika.com/ | 米菓製造・販売業（直売所有り） |
| 株式会社末広製菓 | 新潟市 | Aperitivos | 全国米菓工業組合 | https://www.suehiroseika.co.jp/ | 米菓製造業（菓子卸等へ販売） |
| さくら製菓株式会社 | 新発田市 | Aperitivos | 全国米菓工業組合 | https://www.sakura-do.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 株式会社ブルボン | 柏崎市 | Aperitivos | 全国米菓工業組合 | https://www.bourbon.co.jp/ | 米菓製造業（菓子卸等へ販売） |
| 株式会社新野屋 | 柏崎市 | Aperitivos | 全国米菓工業組合 | https://www.aranoya.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）、米菓販売業（その他菓子を含む卸・小売業） |
| 浪花屋製菓株式会社 | 長岡市 | Aperitivos | 全国米菓工業組合 | https://www.naniwayaseika.co.jp/ | 米菓製造業（菓子卸等へ販売） |
| 有限会社山文 | 魚沼市 | Aperitivos | 全国米菓工業組合 | https://www.echigo-yamabun.com/ | 米菓製造業（菓子卸等へ販売）、その他（米菓を含むコメ加工品製造・販売等） |
| ㈱玉垣製麺所 | 十日町市 | Pan y cereal | 全乾麺 | https://www.tsumarisoba.co.jp/ | 機械製乾めん |
| ㈱松代そば善屋 | 十日町市 | Pan y cereal | 全乾麺 | http://www.matsudaisoba.co.jp/ | 機械製乾めん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/niigata.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/niigata> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 8, Pan y cereal 6, Pescado 3, Setas 2, Cerveza 1, Carne 1, Legumbres 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 農房　丸蔦食品　星義美 | 魚沼市 | Cerveza | ficha | — | https://www.tabechoku.com/producers/20600 |  |
| 大地創造職人　反町敏彦 | 長岡市 | Setas | ficha | — | https://www.tabechoku.com/producers/21777 |  |
| 斎藤農園 | 阿賀町 | Setas | ficha | — | https://www.tabechoku.com/producers/26044 | 新潟県東蒲原郡阿賀町 |
| カニ直売所　弥吉丸 | 佐渡市 | Pescado | ficha | — | https://www.tabechoku.com/producers/26670 |  |
| ひらくの里ファーム | 南魚沼市 | Pescado | ficha | — | https://www.tabechoku.com/producers/26274 |  |
| うおぬま小岩農園 | 魚沼市 | Pescado | ficha | — | https://www.tabechoku.com/producers/28230 |  |
| サンファーム泉 | 五泉市 | Carne | ficha | — | https://www.tabechoku.com/producers/24718 |  |
| ふくのまめ | 新潟市 | Legumbres | ficha | — | https://www.tabechoku.com/producers/29452 |  |
| こまがた農園 | 南魚沼市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/22769 |  |
| 山本農園 | 南魚沼市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/28133 |  |
| 松井ファーム | 南魚沼市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/3078422 |  |
| 小出農場 | 妙高市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/23403 |  |
| 三浦　麻鈴 | 小千谷市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/28919 |  |
| ライス | 長岡市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/3078091 |  |
| 佐藤大農園 | 三条市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23605 |  |
| 自然栽培米の米屋　六花 | 三条市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23580 |  |
| ふぁーむ 黒川 | 上越市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3079148 |  |
| たかはし果樹園 | 加茂市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/27639 |  |
| 桃川農園 | 村上市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23416 |  |
| しみず農園 | 長岡市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29297 |  |
| FISH VEGGIES - フィッシュベジ　食べチョク店 | 長岡市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25211 |  |
| マリーズファーム | 魚沼市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29641 |  |
