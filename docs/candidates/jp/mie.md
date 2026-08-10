# Mie — candidatos

- CSV: `data/csv/jp/kansai/mie.csv` (0 filas). Dedup: nada que cruzar en el CSV. En la bandeja del `README.md` está Maruhiko Sake Brewery (Yokkaichi), que no aparece en esta tabla.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/mie> (34 bodegas, leído 2026-08-04). Gremio: 三重県酒造組合, <http://www.mie-sake.or.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kiyasho Shuzo | 木屋正酒造 | Nabari |
| Ota Shuzo | 大田酒造 | Iga |
| Motosaka Shuzo | 元坂酒造 | Odai |
| Kawabu Jozo | 河武醸造 | Taki |
| Asahi Shuzo | 旭酒造 | Meiwa ⚠ |
| Ise Man | 伊勢萬 | Ise |
| Ito Shuzo | 伊藤酒造 | Yokkaichi |
| Kagura Shuzo | 神楽酒造 | Yokkaichi |
| Adachi Honke Shuzo | 安達本家酒造 | Asahi ⚠ |
| Inagaki Shuzojo | 稲垣酒造場 | Asahi ⚠ |
| Aburasho | 油正 | Tsu |
| Imamura Shuzo | 今村酒造 | Tsu |
| Ogawa Honke | 小川本家 | Tsu |
| Kankobai Shuzo | 寒紅梅酒造 | Tsu |

## Trampas
- ⚠ **Cuatro 旭酒造 distintos** en el catálogo: Meiwa (Mie), Echizen (Fukui, ya en
  `fukui.md`), Nagaoka (Niigata, la de 久保田, en `niigata.md`) y **Iwakuni
  (Yamaguchi), que es la de 獺祭 Dassai** y está en `yamaguchi.md`. Mismo 社名
  exacto, cuatro empresas. Casar siempre por municipio.
- ⚠ **三重郡朝日町 (Asahi, Mie)** se suma a los Asahi de Toyama, Yamagata, Nagano y
  Aichi. Dos bodegas de esta tabla están ahí.
- **木屋正酒造 (Nabari)** vende como **而今 (Jikon)**, una de las marcas más
  buscadas de Japón: el `nombre` público probablemente sea la marca
  (`docs/CSV_CONTRACT.md`).
- **伊勢萬** elabora en Okage-yokocho, la calle turística de Ise: confirmar que es
  bodega y no solo tienda-obrador de escaparate.

## Qué falta
- Las ~20 bodegas restantes del censo.
- Sin abrir, y con mucho recorrido: **松阪牛 (Matsusaka gyu)**, una de las tres
  grandes carnes de Japón, con ganaderías identificables y registro propio;
  **伊勢茶** (Mie es la tercera productora de té del país y no hay ninguna fila);
  あおさ y 海女 (marisco de Shima), 伊勢うどん, 赤福/餅 de la ruta de Ise,
  真珠 de Toba (no alimentario).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 平和製粉株式会社 | 平和製粉株式会社 | 三重県津市河芸町東千里495番地1 | 有機加工食品 | 02-023B |
| 株式会社ヤマリ | 株式会社ヤマリ　脱皮工場/焙割工場 | 三重県四日市市日永東3丁目14番地31号 | 有機加工食品 | MPJP1020 |
| 稲垣製茶（株） | 稲垣製茶（株） | 三重県四日市市日永5-2-21 | 有機加工食品 | JI001122PR-0576-0 |
| 無農薬米生産部会 青山有機栽培部 | 前川三郎  他 | 三重県伊賀市寺脇久保田1011 他 | 有機農産物 | 24-06 |
| サンジルシ醸造（株） | サンジルシ醸造（株） | 三重県桑名市明正通1-572-1 | 有機加工食品 | JS010130PR-0335-0 |
| ミエハク工業株式会社 | ミエハク工業株式会社　他 | 三重県津市一身田中野78番地の1　他 | 有機加工食品 | MPJP1330 |
| 株式会社　川原製茶 | （株）川原製茶　本社工場　他 | 三重県多気郡多気町丹生1786　他 | 有機加工食品 | JK041109PR-0767-0 |
| 福広農園 | 1 他 | 三重県名張市薦生庄田411　他 | 有機農産物 | 24-04 |
| 株式会社まるゑい | 品質管理第一工場 他 | 三重県四日市市水沢町北起1628-3他 | 有機加工食品 | 24-16 |
| 千代農園 | 1 他 | 三重県多気郡多気町笠木駒ノ口1871他 | 有機農産物 | 24-26 |
| 農業生産法人有限会社御浜天地 | 大平・北畑 | 三重県南牟婁郡御浜町上市木4020、4050、4052、4055　他 | 有機農産物 | 101042201 |
| 木村貢 | 1 他 | 三重県伊賀市菖蒲池婦帰3705、3708 他 | 有機農産物 | 25-08 |
| 横山農産 | 横浜重治 1 他 | 三重県津市安濃町中川子ギデン574-1 他 | 有機農産物 | 2002F-20 |
| わたらい茶生産グループ | 山口製茶 他 | 三重県度会郡度会町田口杣口232-1 他 | 有機農産物 | 24-05 |
| 株式会社小杉食品 | 株式会社小杉食品 | 三重県桑名市能部字花貝戸401 | 有機加工食品 |  |
| 九鬼産業株式会社本社工場 | 九鬼産業株式会社本社工場　他　及び外部委託施設 | 三重県四日市市尾上町11　他 | 有機加工食品 | 24-17 |
| 井村屋株式会社 | 井村屋株式会社　あのつFACTORY | 三重県津市あのつ台一丁目8番1中勢北部サイエンスシティ内 | 有機加工食品 | 第1322号 |
| 竹尾茶業株式会社 | 1 他 | 三重県津市芸濃町林百々2056　他 | 有機農産物 | 24-01 |
| うえやま農園 | 1 他 | 三重県名張市赤目町柏原1473 他 | 有機農産物 | 24-30 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/mie.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 伊勢ワイン | Ise | Vino | JWA | — | revisado 2026-08-10: la ficha institucional no aporta contacto o web primaria suficiente para verificar actividad actual |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/mie.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/mie.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
- Estado: **5 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 菓匠庵　平和堂 | 四日市市 | Dulces y repostería | 和菓子協会 | http://www.heiwado.info/ | 四日市市富田一色町 9-11 |
| 和菓子屋富貴堂 | 四日市市 | Dulces y repostería | 和菓子協会 | http://www.fu-kido.com/ | 四日市市富田 3-11-3 |
| 柳屋奉善 | 松阪市 | Dulces y repostería | 和菓子協会 | http://www15.plala.or.jp/yh99/ | 松阪市中町 1877 |
| 御菓子處　とらや勝月 | 鈴鹿市 | Dulces y repostería | 和菓子協会 | http://www.toraya-e.com/ | 鈴鹿市三日市町 1871-15 |
| ㈲カネスエ製麺所 | 四日市市 | Pan y cereal | 全乾麺 | https://www.e-men.jp/ | 機械製乾めん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/mie.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/mie> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| nanan farm | 伊勢市 | Pescado | https://www.tabechoku.com/producers/3077397 | “ドラゴンフルーツ本来の甘みを多くの方々に知ってもらえますように” |
| 三重県迫間浦「タイの里」で真鯛の養殖をしています。 | 南伊勢町 | Pescado | https://www.tabechoku.com/producers/24356 | 入り江の奥深くにあり、一年中穏やかな気候と安定した水質がつづくため、真鯛たちがのびのび健やかに育つのに適した環境がととのっており、肉厚で甘み |
| 浦村かき　浦村シーファーム | 鳥羽市 | Pescado | https://www.tabechoku.com/producers/29599 | 三重県鳥羽市浦村町にて「浦村かき」の養殖、販売をしています株式会社 浦村シーファームと申します。 |
| 伴農場 | 四日市市 | Té e infusiones | https://www.tabechoku.com/producers/26192 | 伴農場は三重県北部の比較的山よりのところで、茶、梅、花壇苗、野菜苗、野菜等の栽培と、茶、梅、漬物、みその加工も行っています。 |
| MINOgreentea | 度会町 | Té e infusiones | https://www.tabechoku.com/producers/28618 | 三重県度会町でお茶を作っています。 |
| やきやまふぁーむ | 尾鷲市 | Setas | https://www.tabechoku.com/producers/26550 | 世界遺産八鬼山の麓で菌床椎茸を栽培しております。 |
| 太郎生きくらげ農園 | 津市 | Setas | https://www.tabechoku.com/producers/3077272 | 私たちは、2017年にきくらげの栽培から始めました。 |
| 舘養蜂場本店 | 桑名市 | Miel | https://www.tabechoku.com/producers/20508 | 初代松次郎が大正元年に創業を始めてから100年余り。 |
| もやし・大豆もやし製造卸　小銭商店 | 津市 | Legumbres | https://www.tabechoku.com/producers/26211 | 私たち小銭商店は、「毎日新鮮シャキシャキもやし！」を合言葉に昭和29年から続く、もやし栽培店です。おもに緑豆もやしや大豆もやしを生産していま |
| kumanoはしもと屋 | 熊野市 | Legumbres | https://www.tabechoku.com/producers/20219 | 熊野は山間部の育生町で、米、大豆、小豆、大麦、小麦、落花生を農薬を使わず、無肥料で育て販売しています。できるだけ日々の営みの中でいつまでも変 |
| デアルケ | 紀北町 | Dulces y repostería | https://www.tabechoku.com/producers/23357 | 13年前に田舎に移住し、農業を開始。超高糖度トマトを中心に色々なトマトををこだわりを持って栽培しております。三重県の安心食材、三重県GAPを |
| よこやま | 志摩市 | Bebidas sin alcohol | https://www.tabechoku.com/producers/26708 | 伊勢志摩の豊かな自然の中、耕作放棄地や遊休農地を利用し本州では珍しい「さとうきび」を栽培しシロップに加工、販売をしています。農業経験の無い私 |
| 岡村農園 | 桑名市 | Bebidas sin alcohol | https://www.tabechoku.com/producers/21159 | 三重県桑名市長島町で、大玉トマト、ミニトマト、ミニトマトジュースを生産している岡村農園です。 |
| 八十八家 神米(かんべえ) | 亀山市 | Pan y cereal | https://www.tabechoku.com/producers/3077315 | (旧登録名 西川勝) |
| 樋廻　昌彦（ひばさみ　まさひこ） | 津市 | Pan y cereal | https://www.tabechoku.com/producers/25410 | 私のところは、先祖から100年以上続く米作り農家（兼業）で、家族で作っています。 |
| idano Kusumoto | 紀宝町 | Pan y cereal | https://www.tabechoku.com/producers/28048 | 三重県の南に位置する温暖な地域で米農家をしています。 |
| 奥西農園 | 伊賀市 | Fruta y verdura | https://www.tabechoku.com/producers/3078156 | 息子が就農するのをきっかけに家族で野菜つくりを始めました。 |
| THE SIMIZ | 木曽岬町 | Fruta y verdura | https://www.tabechoku.com/producers/27919 | トマトの特産地である三重県木曽岬町はトマトのハウス栽培が始まり30年余り。 |
| ファーム海女乃島 | 鳥羽市 | Fruta y verdura | https://www.tabechoku.com/producers/23346 | 独自の技術で生育促進・多収穫を実現した水耕栽培、葉もの野菜や藍・エディブルフラワーの水耕栽培、販売を行う会社として設立いたしました。 |
| 松阪まるよし | 松阪市 | ⚠ por decidir | https://www.tabechoku.com/producers/24819 | 当社は松阪牛を専門に取り扱う店舗として、1961年の創業以来、常に「お客様第一主義」を心掛けてまいりました。 |
| 「たっちゃん」 | 玉城町 | ⚠ por decidir | https://www.tabechoku.com/producers/22083 | 「森は海の恋人」をポリシーとし循環型農業を目指してます。 |
| MDK　海藻生活プラスワン | 鳥羽市 | ⚠ por decidir | https://www.tabechoku.com/producers/26678 | こんにちは　海藻生活　ＰＬＵＳ ＯＮＥです。 |
