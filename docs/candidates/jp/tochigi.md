# Tochigi — candidatos

- CSV: `data/csv/jp/kanto/tochigi.csv` (1 fila: Coco Farm & Winery, vino). Dedup: ninguna de abajo solapa.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/tochigi> (37 bodegas, leído 2026-08-04). Gremio: 栃木県酒造組合, <http://sasara.lib.net/>.
- Estado: cola abierta, 15 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Inoue Seikichi Shoten | 井上清吉商店 | Utsunomiya |
| Utsunomiya Shuzo | 宇都宮酒造 | Utsunomiya |
| Iinuma Meijo | 飯沼銘醸 | Tochigi |
| Ohira Shuzo | 大平酒造 | Tochigi |
| Sagara Shuzo | 相良酒造 | Tochigi ⚠ |
| Aizawa Shuzo | 相澤酒造 | Sano |
| Abe Shuzoten | 阿部酒造店 | Motegi |
| Ikejima Shuzo | 池島酒造 | Otawara |
| Kikunosato Shuzo | 菊の里酒造 | Otawara ⚠ |
| Katayama Shuzo | 片山酒造 | Nikko |
| Kumakubo Shoten | 熊久保商店 | Nasushiobara |
| Kojima Shuzoten | 小島酒造店 | Shioya |
| Kobayashi Shuzo | 小林酒造 | Oyama |
| Sanpuku Shuzo | 三福酒造 | Oyama |
| Shimazaki Shuzo | 島崎酒造 | Nasukarasuyama |
| Shiraai Shuzo | 白相酒造 | Nakagawa |

## Trampas
- ⚠ **La fuente usa municipios disueltos en las fusiones Heisei**: 湯津上村
  (菊の里酒造) es hoy 大田原市 y 岩舟町 (相良酒造) es hoy 栃木市. `data/reference/`
  excluye de Wikidata todo lo que tiene fecha de disolución, así que si se escribe
  el nombre viejo **la fila no tiene puerta geográfica**: el audit la salta y la
  cuenta como skipped, no como comprobada (`AGENTS.md`, invariantes). Escribir el
  municipio actual.
- 那須郡 y 塩谷郡 no son municipio: la fila lleva el 町 (Nakagawa, Shioya).

## Qué falta
- Las ~21 bodegas restantes del censo.
- Sin abrir: fresa Tochiotome (Tochigi es la primera de Japón desde hace 50 años),
  **yuba de Nikko**, 干瓢 (kanpyo, casi todo el nacional), ternera de Nasu, lácteos
  de Nasu, y las bodegas de vino más allá de Coco Farm.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 東京食品産業（株） | 東京食品産業（株） | 栃木県佐野市並木町358番地 | 有機加工食品 | 050713-001 |
| 伊藤　渡 | 1　他 | 栃木県大田原市大神601-66・67　他 | 有機農産物 | S-050 |
| 杉山真章 | 1　他 | 栃木県塩谷郡塩屋町肘内三斗蒔147　他 | 有機農産物 | S-020 |
| 有限会社　日本の稲作を守る会 | 有限会社　日本の稲作を守る会　8　他 | 栃木県河内郡上三川町下神主字下原234-1　他 | 有機農産物 | S-152 |
| 那須オーガニック会 | 高崎真一　ほ場1　他 | 栃木県大田原市中野内1782-52　他 | 有機農産物 | 2006F-16 |
| 隅内俊光 | 2他 | 栃木県河内郡上三川町上蒲生字三反田1494　他 | 有機農産物 | S-171 |
| 土の香グループ | 中丸北　他 | 栃木県下都賀郡壬生町助谷字中丸北706　他 | 有機農産物 | NA-09030401 |
| 株式会社シェフコ | 株式会社シェフコ　栃木工場　他 | 栃木県鹿沼市下永野９２６ | 有機加工食品 | 201070703 |
| 株式会社波里 | 株式会社波里　足利胡麻工場　他 | 栃木県足利市寺岡町680-1 他 | 有機加工食品 | MPJP1654 |
| 小野崎勇治 | 小野崎勇治 | 栃木県塩谷郡塩谷町原荻野目清水端352 | 有機農産物 | S-224 |
| (株)黎明農園 | 1　他 | 栃木県佐野市下彦間町笠松763-1、764-1、765-1　他 | 有機農産物 | S-216 |
| 株式会社ベジファーム | 1　他 | 栃木県下都賀郡壬生町上田1439　他 | 有機農産物 | 13A-005 |
| 戸崎農園(株) | ほ場1 | 栃木県下都賀郡壬生町壬生丁253-2 | 有機農産物 | S-231 |
| 阿部忠男 | １－１　他 | 栃木県日光市川室木落244 | 有機農産物 | S-122 |
| 五十畑　匠 | 1　他 | 栃木県栃木市岩舟町静和字宮ノ下1871-1,1872-1　他 | 有機農産物 | S-241 |
| 渡邉いづみ | 渡邉いづみ | 栃木県那須郡那須町大字高久甲字愛宕前5138-1　他 | 有機農産物 | S-243 |
| 星野恵美子 | 1　他 | 栃木県那須塩原市二区町500-10　他 | 有機農産物 |  |
| 株式会社東京フード | 株式会社東京フード | 栃木県佐野市赤坂町940-3 | 有機加工食品 | AFASSEQ-AP-160201 |
| 手塚英史 | 手塚英史 | 栃木県宇都宮市下小倉町上原1068　他 | 有機農産物 | S-207 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/tochigi.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| うしとらブルワリー | Shimotsuke | Cerveza | JBA | facebook.com/ushitorabrewery | sin dominio propio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/tochigi.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/tochigi.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **12 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| うさぎや | 宇都宮市 | Dulces y repostería | 和菓子協会 | http://www.usagimonaka.com | 宇都宮市伝馬町 4-5 |
| マスキン | 宇都宮市 | Dulces y repostería | 和菓子協会 | http://www.masukin-co.jp/ | 宇都宮市曲師町 3-9 曲師ビル |
| 乙女屋 | 小山市 | Dulces y repostería | 和菓子協会 | http://www.otomeya.co.jp/ | 小山市間々田 1150 |
| 山本總本店 | 栃木市 | Dulces y repostería | 和菓子協会 | http://www.yamamotokashi.jp | 栃木市倭町 7-13 |
| 紀州屋 | 鹿沼市 | Dulces y repostería | 和菓子協会 | http://www6.ocn.ne.jp/~kishuya/ | 鹿沼市今宮町 1619 |
| 黒子松屋 | 鹿沼市 | Dulces y repostería | 和菓子協会 | http://www.kappamanju.jp | 鹿沼市深程 1666 |
| 株式会社日新製菓 | 宇都宮市 | Aperitivos | 全国米菓工業組合 | https://www.nissin-seika.co.jp/ | 米菓製造・販売業（直売所有り） |
| 有限会社米菓工房 和 | 宇都宮市 | Aperitivos | 全国米菓工業組合 | https://www.beika-nagomi.co.jp | 米菓製造・販売業（直売所有り） |
| 丸彦製菓株式会社 | 日光市 | Aperitivos | 全国米菓工業組合 | https://www.maruhikoseika.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）、米菓販売業（その他菓子を含む卸・小売業）、その他（米菓を含むコメ加工品製造・販売等） |
| 株式会社石田屋 | 日光市 | Aperitivos | 全国米菓工業組合 | http://www.jingorou.com | 米菓製造・販売業（直売所有り） |
| ひざつき製菓株式会社 | 栃木市 | Aperitivos | 全国米菓工業組合 | https://hizatsuki.com/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 株式会社飯沼 | 栃木市 | Aperitivos | 全国米菓工業組合 | https://iinuma.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/tochigi.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/tochigi> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 喜連川水産 | さくら市 | Pescado | https://www.tabechoku.com/producers/21364 | 関東随一の清流・那珂川を有し、鮎の名所として名高い栃木県。那珂川の支流の荒川が流れる「喜連川」の地で昭和44年に鮎養殖に取り組みました。繊細 |
| 明星漁業 | さくら市 | Pescado | https://www.tabechoku.com/producers/24914 | 昭和４６年創業、那須水系の地下水のみを使用し、家族経営、少数生産、手間暇かけて鮎の養殖をしています。 |
| 内海ぶどう園 | 栃木市 | Pescado | https://www.tabechoku.com/producers/3079176 | 栃木市で小さなぶどう園を営んでおります。自然や季節に逆らう事なくのんびりぶどうを育てています。農薬や化成肥料は極力少なめに。あなたが笑顔にな |
| 薄羽養鶏場 | 益子町 | Carne | https://www.tabechoku.com/producers/20334 | ★栃木県・益子町で養鶏業を営んでいます薄羽養鶏場です。 |
| 自然養鶏こっこの輪 | 那須烏山市 | Carne | https://www.tabechoku.com/producers/3077950 | 私たちは20代の夫婦ふたりで小さな養鶏場を営んでいます。 |
| 那須高原今牧場 | 那須町 | Carne | https://www.tabechoku.com/producers/26338 | 栃木県の観光地として栄える那須高原で300頭の牛と山羊を育てています。 |
| 下野きのこファーム | 下野市 | Setas | https://www.tabechoku.com/producers/3078175 | ぷりっと肉厚、コリコリとした食感がたまらない── |
| 君嶋きのこ園 | 矢板市 | Setas | https://www.tabechoku.com/producers/21444 | おいしい、と家族がつぶやく。食卓に笑顔がうまれる。 |
| 那須バイオファーム | 高根沢町 | Setas | https://www.tabechoku.com/producers/24398 | 那須連山からの豊富な天然水と国産の良質なオガを使い、豊かな森の環境を復元し、ひとつひとつ丁寧にキノコを長年作り続けています。『栃の木まいたけ |
| 青苺農園 | 益子町 | Condimentos | https://www.tabechoku.com/producers/21492 | 自然栽培（農薬、肥料不使用）を続けて7年。購入していただいた商品が大変美味しかったというお褒めの言葉をたくさんいただきました。誠にありがとう |
| 遠藤農園 | 那須塩原市 | Condimentos | https://www.tabechoku.com/producers/3077358 | 那須塩原市で信念を持ってお米をつくっております。是非ご賞味いただき、感想などいただけたら嬉しくおもいます。皆様に寄り添った栽培を実践し、味わ |
| 稲田農園 | 那須塩原市 | Condimentos | https://www.tabechoku.com/producers/29385 | 那須塩原市で家庭菜園からはじめて、はや九年。 |
| 鈴木いちご農園 | 宇都宮市 | Dulces y repostería | https://www.tabechoku.com/producers/28929 | 鈴木家では代々農業を稼業としており、2005年、本格的にいちごの栽培を始めました。有機肥料をふんだんに使った、こだわった土づくりをしています |
| ピノキオホールディングス | 宇都宮市 | Huevos | https://www.tabechoku.com/producers/26253 | 飼育歴20年、どうしたら美味しい卵に出会えるかをテーマになし遂げました。 |
| 那須栗園 | 那須烏山市 | Frutos secos | https://www.tabechoku.com/producers/28836 | 栃木県北の栗農家です🌰 |
| 大田原　阿久津農園 | 大田原市 | Pan y cereal | https://www.tabechoku.com/producers/24921 | 那須山の麓、那須野が原扇状地の扇端に広がる栃木県大田原市。地中を流れる伏流河川・蛇尾川がミネラル豊富な水を田んぼに運びます。この豊かな土地で |
| ブルーベリー南園（みなみえん） | 小山市 | Pan y cereal | https://www.tabechoku.com/producers/27633 | 55歳で会社を早期退職して栃木の実家に帰りました。実家は農家で米や野菜を作っていましたが、本格的な農業は若い担い手にお任せした方がよいと考え |
| 稲作本店（FARM1739） | 那須町 | Pan y cereal | https://www.tabechoku.com/producers/20533 | 私たち、「稲作本店」は北関東の冷涼な高原地域、天皇陛下ご静養の地「那須」でお米作りを続けて150年の稲作ファームです。 |
| 大時果樹園 | 宇都宮市 | Fruta y verdura | https://www.tabechoku.com/producers/21828 | 幸水、豊水、長十郎の苗木を父親が植え、1971年から大時果樹園の梨づくりが始まりました。 |
| フジワラアグリコルトゥーラ | 宇都宮市 | Fruta y verdura | https://www.tabechoku.com/producers/21114 | 弊社はソーラーシェアリングによる持続可能な営農を行う農業法人として、栃木県宇都宮市の壮大な土地で化学肥料や農薬には頼らないBLOF理論による |
| NANTAIファーム | 日光市 | ⚠ por decidir | https://www.tabechoku.com/producers/25554 | 〜NANTAIファーム〜 |
| YB.DRAGON Farm                                                『🌽トウモロコシ王子👑』 | 真岡市 | ⚠ por decidir | https://www.tabechoku.com/producers/21883 | 栃木県に拠点を持ち |
