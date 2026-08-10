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
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/fukui> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 瀬越水産　新盛丸 | 坂井市 | Pescado | https://www.tabechoku.com/producers/27295 | 【小さい船だからこそ、出来る技がある】 |
| 魚屋の喰い処まつ田 | 福井市 | Pescado | https://www.tabechoku.com/producers/23694 | 福井県越前海岸で地魚と越前ガニを中心としたレストランと魚介類の販売をしています。身長189cm体重115キロの巨体を生かして自然の恵みを皆様 |
| あまちゃん | 福井市 | Pescado | https://www.tabechoku.com/producers/27409 | 田舎で、採れたての魚介類の販売をはじめました。産地からの直送でしか味わえない、鮮度抜群の魚介類は絶品です！もうスーパーでは買えないかも（笑） |
| 茂右衛門農場 | 鯖江市 | Pescado | https://www.tabechoku.com/producers/29269 | もうえもんでは環境をまもり身体にもやさしい特別栽培で、すべてのお米を子供を育てるように大切にそだてています。 |
| 鯖江スマイルファーム | 鯖江市 | Pescado | https://www.tabechoku.com/producers/22562 | こんにちは、鯖江スマイルファームの五十嵐理（おさむ）です。農園名は、すべての人を笑顔にしたいという思いから名付けました。できる限り農薬を使わ |
| サンビーフ齊藤牧場 | 坂井市 | Carne | https://www.tabechoku.com/producers/3078574 | 福井県越前三国の海岸からほど近い、のどかな農耕地区で和牛を肥育しています。 |
| テトテヲ | 坂井市 | Carne | https://www.tabechoku.com/producers/20837 | 坂井市三国町の海の近くで福井県初の福地鶏約900羽を飼っています。またその卵「ふくたまご」を使い、加工品の製造もしています。 |
| 昇竜 | 大野市 | Setas | https://www.tabechoku.com/producers/21269 | 私たちは、福井県大野市の和泉地区で特産の九頭竜まいたけを製造しております。皆様の豊かな食生活と食卓での笑顔のために、安心・安全で良品質な商品 |
| こころファーム | 福井市 | Setas | https://www.tabechoku.com/producers/23132 | 乾燥シイタケや粉しいたけは全て手作りです。 |
| 本多農園 | 勝山市 | Legumbres | https://www.tabechoku.com/producers/22998 | 福井県勝山市で稲作を中心に、蕎麦、大麦、大豆などを生産しています。 |
| 晴レハレ農園｜走るコケ子の健康卵 | 永平寺町 | Huevos | https://www.tabechoku.com/producers/29342 | 🐓メルカリ卵で今話題！【晴れのち、もっと晴れ】のレモンイエローな放し飼い健康卵。ホッカホカの発酵飼料(10種類配合)と天然緑餌と谷川天然水で |
| 滝本米　農園 | 勝山市 | Pan y cereal | https://www.tabechoku.com/producers/25557 | 滝本米 農園が大切にしていることは、 |
| シマダ農園 | 小浜市 | Pan y cereal | https://www.tabechoku.com/producers/23859 | 代々受け継いだ水田で、コシヒカリなどの水稲を栽培しています。自社で栽培から精米・加工・出荷まですべてを行います。無洗米や真空少量パック詰めの |
| ヤスノ農園 | 福井市 | Pan y cereal | https://www.tabechoku.com/producers/3078493 | 福井で30年、家族でお米を育てています。 |
| 米農房そまねこ | 若狭町 | Pan y cereal | https://www.tabechoku.com/producers/27469 | ２０１４年、福井県若狭町の山の麓の棚田でお米の栽培を始めました。 |
| 西農園 | 坂井市 | Fruta y verdura | https://www.tabechoku.com/producers/29409 | 私達は福井県坂井市に位置し、坂井北部丘陵地は県内最大の園芸産地です。とても良い土壌で栽培された梨園は樹齢50年以上。一年かけ慎重かつ大切に管 |
| ゆみたか農園 | 坂井市 | Fruta y verdura | https://www.tabechoku.com/producers/29572 | ＼忙しい毎日を頑張っているあなたへ／ |
| もんちゃん農園 | 福井市 | Fruta y verdura | https://www.tabechoku.com/producers/28017 | 子供がおいしい！って野菜を食べて育って欲しい、じゃあ夫婦で作ろうか。とはじめた農業。自然豊かな田舎、福井県で夫婦で農家してます。 |
| 農園たや | 福井市 | Fruta y verdura | https://www.tabechoku.com/producers/23979 | ▶ 農園紹介 |
| グリーンファームすみや | あわら市 | ⚠ por decidir | https://www.tabechoku.com/producers/26490 | 【福井県あわら市のグリーンファーム角屋、斎藤貴です。】 |
| ターナーズファーム | 福井市 | ⚠ por decidir | https://www.tabechoku.com/producers/29444 | 令和6年１月１日に新規就農致しました。 |
| 徳橋農場 | 鯖江市 | ⚠ por decidir | https://www.tabechoku.com/producers/23857 | こんにちは！徳橋農場です。 |
