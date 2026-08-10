# Ibaraki — candidatos

- CSV: `data/csv/jp/kanto/ibaraki.csv` (13 filas, todas altas de esta pasada).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (consolidado 2026-08-04), bloque de Ibaraki. Fuentes que cita: el portal de exportación de la prefectura <https://exports.pref.ibaraki.jp/en/company/> (ficha por empresa), 日本酒造組合中央会 <https://japansake.or.jp/sakagura/en/ibaraki/> y web propia.
- Estado: **13 integradas** en el CSV el 2026-08-04 como `parcial` — las que traen dominio propio. Quedan 21: 8 con solo ficha del portal de exportación, 3 sin municipio usable, 2 órganos colectivos, 1 filial industrial (Calbee) y las 6 bodegas del gremio sin web localizada.

`A`/`B` es la clasificación del listado de origen: **A** = productor de origen
(explotación propia, cooperativa, transformación ligada a materia prima
regional); **B** = productor real y arraigado del que **solo valen los productos
concretos con origen local verificable**. Una `B` no es una fila peor, es una
fila que hay que acotar antes de escribirla.

| nombre | municipio | categoría | A/B | web / fuente |
|---|---|---|---|---|
| Isemata Beikoku Seifun | Hitachiota | Pan y cereal | A | soba-isemata.com |
| Iijima Chikusan | Hokota | Carne | A | iijima1129.co.jp |
| Iiyama Seicha | Yachiyo | Té e infusiones | A | ficha exports.pref.ibaraki.jp (id 715446) |
| Hitachi Fugetsudo | Hitachi | Dulces y repostería | A | ficha exports.pref.ibaraki.jp (id 715380) |
| Fujita Apple Orchard | Daigo | Fruta y verdura | A | applefujita-llc.com |
| Fukasaku Farm | Hokota | Fruta y verdura | A | fukasaku.com |
| Terunuma | Tokai | Fruta y verdura | A | ficha exports.pref.ibaraki.jp (id 714729) |
| Nemoto Tsukemono | Mito | Conservas | A | nemotuke.com |
| Ibaraki Mogitate Factory | Ibaraki (町) | Comida preparada | A | ficha exports.pref.ibaraki.jp (id 715034) |
| Aoki Brewing | Koga | Sake | B | japansake.or.jp (gremio) |
| Kiuchi Brewery 1823 | Naka | Sake | B | kiuchibrewery.co.jp ⚠ ver nota |
| Sudo Honke | Kasama | Sake | B | japansake.or.jp (gremio) |
| Yoshikubo Sake Brewery | Mito | Sake | B | japansake.or.jp (gremio) |
| Raifuku Sake Brewing | Chikusei | Sake | B | japansake.or.jp (gremio) |
| Nishioka-Honten | Sakuragawa | Sake | B | japansake.or.jp (gremio) |
| Tsukinoi Shuzouten | Oarai | Sake | B | japansake.or.jp (gremio) |
| Komatsu Suisan | Kitaibaraki | Pescado | B | shirasu.com |
| Nemotoen | Bando | Té e infusiones | B | nemotoen.com |
| Fujiya / Tsukuba Purin | Sakuragawa | Dulces y repostería | B | ficha exports.pref.ibaraki.jp (id 715108) |
| Hanamizuki | Tsukuba | Dulces y repostería | B | ficha exports.pref.ibaraki.jp (id 715270) |
| Kamejirushi Confectionery | Mito | Dulces y repostería | B | kamejirushi.co.jp |
| Kogetsuan | ⚠ sin municipio | Dulces y repostería | B | ficha exports.pref.ibaraki.jp (id 715050) |
| Kasyo Miyakawa | Daigo | Dulces y repostería | B | ficha exports.pref.ibaraki.jp (id 715184) |
| Calbee Kaitsuka Sweet Potato | Kasumigaura | Fruta y verdura | B | exports.pref.ibaraki.jp ⚠ filial de Calbee |
| Daruma Foods | ⚠ sin municipio | Legumbres | B | ficha exports.pref.ibaraki.jp (id 714641) |
| Higeta Shokuhin | ⚠ sin municipio | Legumbres | B | ficha exports.pref.ibaraki.jp (id 714756) |
| Kozawa Foods | Naka | Legumbres | B | kozawafoods.jp |
| Kurosawa Shoyuten | Hitachinaka | Condimentos | B | fujini-shouyu.co.jp |
| Shibanuma Soy Sauce | Tsuchiura | Condimentos | B | shibanuma.com |
| Anko no Machi | Kitaibaraki | Comida preparada | B | ficha exports.pref.ibaraki.jp (id 715220) |
| Meiri Shurui | Mito | Destilados y licores | B | meirishurui.com |
| Kiuchi Brewing and Distilling / Hitachino Nest | Naka | Cerveza | B | kiuchibrewery.co.jp ⚠ ver nota |

## Trampas de este bloque

- **Kiuchi son dos filas del listado y una sola empresa** (木内酒造, Naka): sake e
  Hitachino Nest. El propio xlsx lo admite («125 registros / 124 entidades»).
  La identidad del catálogo es `slug` dentro del área, así que **es una fila**,
  con `categoria` `Sake` o `Cerveza` según lo que pese, no dos.
- **Ojo con el otro Kiuchi**: 木内醸造 (Kiuchi Jyouzou, marca Hatsuuguisu) está en
  Saku, Nagano, y es una empresa distinta. Casar por municipio, no por apellido.
- **Tres filas traen «Ibaraki» como localidad**, que es la prefectura, no un
  municipio. Y hay dos «Ibaraki» reales en Japón: 茨城町 (esta prefectura) y
  茨木市 en Osaka. Resolver el municipio antes de escribir la fila, o el gate
  geográfico la manda al otro extremo del país.
- **Sashima Tea Producer Export Council** y **Tsukuba Gingko Production
  Association** se cerraron el 2026-08-09: son órganos colectivos sin identidad
  productora propia; una futura revisión debe proponer sus socios, no reabrir
  estos dos nombres.
- **Calbee Kaitsuka** se revisó el 2026-08-09 y queda retenida, no descartada: es
  filial de un grupo industrial cotizado, pero puede volver a evaluarse si la
  línea de batata de Kasumigaura demuestra identidad y venta propias.
- Las fichas `exports.pref.ibaraki.jp` son de un portal de exportación: confirman
  identidad y localización, no actividad ni venta online. Solo sostienen `parcial`.

## Sake: el resto del gremio (13, pasada 2026-08-04)

Medido el hueco que avisaba el «Qué falta»: el censo son **45 bodegas** y arriba
había 7. Fuente: <https://jp.sake-times.com/sakagura/ibaraki>. Deduplicado
contra el CSV (木内酒造) y contra la tabla de arriba (青木酒造). Ninguna trae
dominio. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Aiyu Shuzo | 愛友酒造 | Itako |
| Asakawa Shuzo | 浅川酒造 | Hitachiomiya |
| Isaka Shuzoten | 井坂酒造店 | Hitachiota |
| Ota Meijo | 太田銘醸 | Hitachiota |
| Okabe | 岡部合名 | Hitachiota |
| Goretsu Tominaga Shuzoten | 剛烈富永酒造店 | Hitachiota |
| Ishioka Shuzo | 石岡酒造 | Ishioka |
| Isokura Shuzo | 磯蔵酒造 | Kasama |
| Inaba Shuzo | 稲葉酒造 | Tsukuba |
| Urazato Shuzoten | 浦里酒造店 | Tsukuba |
| Iekyucho Honten | 家久長本店 | Daigo |
| Kahoku Shuzo | 珂北酒造 | Daigo |
| Kinmon Shuzo | 金門酒造 | Toride |

**宏和商工 日立酒造工場 (Hitachi)** es una planta de un grupo: triar antes de
escribir fila.

## Qué falta
- El bloque de sake son 7 bodegas y el gremio de Ibaraki lista bastantes más.
  El listado de origen es una **selección**, no el censo: medir contra
  `japansake.or.jp/sakagura/en/ibaraki/`.
- Ningún dominio comprobado en vivo, y varias filas solo traen la ficha del
  portal: encontrar la web propia es el primer trabajo de cada lote.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 株式会社　オーピーシートレーディング | 株式会社　オーピーシートレーディング　水戸工場 | 茨城県水戸市成沢町457－3 | 有機加工食品 | カ-06-01 |
| 鯉淵学園農業栄養専門学校 | 鯉淵学園農業栄養専門学校 | 茨城県水戸市鯉淵町5965 | 有機農産物 | 02-003 |
| 茨城県有機稲作協議会 | 1（墓地裏）　他 | 茨城県筑西市桑山3560　他 | 有機農産物 | AFASSEQ-AA-010806 |
| (有)森ファームサービス | 1　他 | 茨城県古河市上片田原岸963-1　他 | 有機農産物 | S-033 |
| 永塚文男 | 1　他 | 茨城県古河市女沼宿下1202-2　他 | 有機農産物 | S-077 |
| 鴻巣　仁 | 鴻巣農園（鴻巣　仁） | 茨城県石岡市小野越亀尻106-2　他 | 有機農産物 | 05-001 |
| モアーク食品株式会社 | モアーク食品株式会社 モアーク食品 つくば有機農産物加工センター 他 | 茨城県つくば市上郷1068-7 他 | 有機加工食品 | 2006M-4 |
| 平田敬義 | １　他 | 茨城県稲敷市稲波1861-5・6　他 | 有機農産物 | S-063 |
| すがの農場有限会社 | 加幸沢田んぼ　他 | 茨城県日立市十王町伊師3746　他 | 有機農産物 | AFASSEQ－AA－010401 |
| 株式会社朝一番 | 株式会社朝一番　本社工場 | 茨城県土浦市小山田1-265 | 有機加工食品 | 第1026号 |
| 鈴木　英也 | 鈴木英也農園 | 茨城県石岡市下林字薊ヶ原2448-172　他 | 有機農産物 | 01-016 |
| (有)くらぶコア | 長久保1　他 | 茨城県行方市次木690-4、5　他 | 有機農産物 | NA-07032901 |
| 小田　貴史 | 小田農園 | 茨城県小美玉市下吉影2422-1他 | 有機農産物 | 04-020 |
| 山﨑正志 | 山崎正志5他 | 茨城県坂東市庄右衛門新田川西1060、1061他 | 有機農産物 | JY000828-FA0066-0 |
| 広瀬　平一郎 | 広瀬農場 | 茨城県石岡市石沢台780他 | 有機農産物 | 01-004 |
| 柳　志津雄 | 柳農園 | 茨城県小美玉市倉数原山601-69 | 有機農産物 | 04-022 |
| 鬼沢　寛 | 鬼沢農園 | 茨城県鉾田市烟田内野1851-8他 | 有機農産物 | 04-013 |
| 金沢　正一 | 金沢農園 | 茨城県鉾田市借宿野子堀2259-4　他 | 有機農産物 | 04-014 |
| 武藤　大悟 | むとう農園 | 茨城県石岡市栄松14174-3他 | 有機農産物 | 07-006 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/ibaraki.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

**Ya integrado, no volver a proponer:** 来福酒造 y 木内酒造 ya están en `ibaraki.csv`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/ibaraki.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **2 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| さ志まや製菓株式会社 | 境町 | Aperitivos | 全国米菓工業組合 | https://sashimayaseika.com/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| ㈲西村製麺所 | 結城市 | Pan y cereal | 全乾麺 | https://yuki-udon.com/ | 機械製乾めん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/ibaraki.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/ibaraki> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 大川水産 | 潮来市 | Pescado | https://www.tabechoku.com/producers/27423 | こんにちは。大川水産の大川です。 |
| 塙商店 | 笠間市 | Pescado | https://www.tabechoku.com/producers/29210 | 塙商店は、戦後の昭和２３年に米集荷業に参画したことから始まり、以後４代に渡って米流通業の老舗として従事してきました。 |
| 涸沼川水産 | 茨城町 | Pescado | https://www.tabechoku.com/producers/21081 | 『食べチョクアワード水産物部門』 |
| 松田製茶 | 八千代町 | Té e infusiones | https://www.tabechoku.com/producers/21731 | 松田製茶は茨城県の南西部に位置する八千代町で、特徴のあるおいしい猿島茶(さしま茶)を作るために、ブラックアーチ農法という独自の農法によりお茶 |
| 山西牧場 | 坂東市 | Carne | https://www.tabechoku.com/producers/20303 | 一口で価値観が変わる【飲める脂】の豚肉をお届けします。 |
| デーメテールの恵み｜烏骨鶏がいる農園 | 鉾田市 | Carne | https://www.tabechoku.com/producers/22053 | デーメテールの恵みは、茨城県鉾田市にある小さな実験農園です。 |
| ミートセンター菊地畜産 | 鉾田市 | Carne | https://www.tabechoku.com/producers/21426 | 茨城県鉾田市の自然に囲まれた「菊地豚牧場」では、豚にとって快適な環境づくりを第一に、毎日顔を見て触れ、声をかけながら愛情を込めて育てています |
| 七会きのこセンター | 城里町 | Setas | https://www.tabechoku.com/producers/23355 | 茨城県東茨城郡城里町（旧七会村地区）にて菌床きのこの生産及び販売をしております。 |
| ハラキン | 鹿嶋市 | Setas | https://www.tabechoku.com/producers/28633 | 1976年に茨城県鹿嶋市でキノコの栽培をスタートしました。現在はブナシメジと生きくらげをメインに栽培しているキノコ一筋の会社です。特に生きく |
| 野村商店 | つくばみらい市 | Legumbres | https://www.tabechoku.com/producers/24339 | "大豆もやし一筋"作り続けて５０年、三代に渡って変わらぬ味の襷を繋げ、創業以来初めてとなる一般販売を行います。 |
| 永井農業 加宝地ほしいも | ひたちなか市 | Conservas | https://www.tabechoku.com/producers/21710 | わたしたち永井農業は明治より約１００年の干し芋作りの歴史があり、 今日でもお客様のニーズに応えられるよう土作りから始め形状、 甘さを追求し、 |
| 常陸農園 | 常陸太田市 | Conservas | https://www.tabechoku.com/producers/24207 | 茨城県常陸太田市の自然豊かなで冷涼な気候の環境を利用して干し芋を作っています！ |
| 甘藷農園　燈屋 | 石岡市 | Conservas | https://www.tabechoku.com/producers/26541 | 【焼き芋・干し芋を作りたい！】という長年の夢を叶えるべく【まずはさつまいもを作ろう！】という事で昨年、一からさつまいも作りに奮闘！ |
| 岩田青果 | 八千代町 | Dulces y repostería | https://www.tabechoku.com/producers/24147 | 昔懐かし「プリンスメロン」と新鮮で甘味高い「とうもろこし」の生産、販売を行っております！ |
| 果じゅまる園 | 石岡市 | Frutos secos | https://www.tabechoku.com/producers/27488 | 茨城県石岡市の広域認定農業者として妻と数名の従業員で果樹園を営んでおります。主に栗とフィンガーライムを生産しています。39歳の若手農家として |
| ファームマロン | 笠間市 | Frutos secos | https://www.tabechoku.com/producers/23774 | 私たちは、６０歳代の熟年夫婦です。栗園では、栗栽培40年の経験を活かし、笠間ブランド栗生産者の一躍として、更に美味しい栗作りを目指しています |
| パチャママ農園 | 下妻市 | Pan y cereal | https://www.tabechoku.com/producers/20202 | 農園名の「パチャママ」は南米アンデスの現地語で「母なる大地」を意味する言葉で、現地の先住民たちが昔から信仰している豊穣を司る大地の神です。 |
| 酒詰農園 | 取手市 | Pan y cereal | https://www.tabechoku.com/producers/22170 | 我が家は元禄時代からの家系で先祖代々農業をしておりおよそ150年前から6世代にわたり米作りをしてきました。 |
| オラソル農園 Hola Sol Hacienda | 古河市 | Fruta y verdura | https://www.tabechoku.com/producers/21523 | Hola Sol Hacienda オラ ソル アシエンダはスペイン語で、Holaは「こんにちは」Solは「太陽」Haciendaは「大農園 |
| 茂賀屋 | 桜川市 | Fruta y verdura | https://www.tabechoku.com/producers/3077868 | 私たちは、茨城県桜川市で生産農家を営んでおります。 |
| 岡野ブルーベリーガーデン | つくば市 | ⚠ por decidir | https://www.tabechoku.com/producers/3077225 | 筑波山の麓に広がるつくば市で、約40年前から両親が育ててきたブルーベリーの苗木を引き継ぎ、定年退職後に夫婦で、安心安全で健康的なおいしいブル |
| コロタファーム | 那珂市 | ⚠ por decidir | https://www.tabechoku.com/producers/29422 | 都内の飲食店で働いておりましたが、結婚を機に帰省し就農しました🧑‍🌾 |
