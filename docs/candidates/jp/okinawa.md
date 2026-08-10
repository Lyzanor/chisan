# Okinawa — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/okinawa.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: listado de 酒造所 de おきなわ物語 (portal oficial de turismo de la prefectura), <https://www.okinawastory.jp/feature/awamori/list> (leído 2026-08-04). Gremio: 沖縄県酒造組合, <https://www.okinawa-awamori.or.jp/> — **47 酒造所 y 1 cooperativa**; su certificado TLS fallaba el 2026-08-04, ver README.
- Estado: cola abierta, 20 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Aquí el gremio no es de sake ni de shochu: es de **泡盛 (awamori)**, destilado de
arroz índico con koji negro, con Indicación Geográfica (琉球泡盛) y unos 500 años
de historia. Categoría para todas: `Destilados y licores`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Zuisen Shuzo | 瑞穂酒造 | Naha |
| Shikina Shuzo | 識名酒造 | Naha |
| Ishikawa Shuzojo | 石川酒造場 | Nishihara ⚠ |
| Chatan Choro Shuzo | 北谷長老酒造 | Chatan |
| Shinzato Shuzo | 新里酒造 | Okinawa |
| Higa Shuzo | 比嘉酒造 | Yomitan |
| Kamimura Shuzo | 神村酒造 | Uruma |
| Taikoku Shuzo | 泰石酒造 | Uruma |
| Sakiyama Shuzosho | 崎山酒造廠 | Kin |
| Kin Shuzo | 金武酒造 | Kin |
| Onna Shuzosho | 恩納酒造所 | Onna |
| Sakimoto Shuzo | 咲元酒造 | Onna ⚠ |
| Ryusen Shuzo | 龍泉酒造 | Nago |
| Tsukayama Shuzosho | 津嘉山酒造所 | Nago |
| Helios Shuzo | ヘリオス酒造 | Nago |
| Yamakawa Shuzo | 山川酒造 | Motobu |
| Nakijin Shuzo | 今帰仁酒造 | Nakijin |
| Izena Shuzosho | 伊是名酒造所 | Izena |
| Iheya Shuzo | 伊平屋酒造所 | Iheya |

## Trampas

- **Revisión 2026-08-09:** Takazato Shuzosho era la identidad histórica del ya
  publicado `yanbaru-shuzo-ogimi`; se retira de la cola como resuelto, no como
  descarte.
- ⚠ **石川酒造場 (Nishihara, Okinawa)** no es 石川酒造 (Fussa, Tokio), en
  `tokyo.md`. Y ojo: **石川** es además un barrio de うるま市 y el nombre de una
  prefectura entera (`ishikawa.md`). Tres cosas, un rōmaji.
- ⚠ **咲元酒造 era de Shuri (Naha) y se trasladó a Onna**: según qué listado se
  lea sale en un municipio o en otro. Confirmar el actual antes de fijar
  coordenadas — es el patrón «sede vs. planta» que ya avisa `hokkaido.md`.
- **Okinawa no es una isla**: Izena, Iheya y las que faltan (Miyako, Ishigaki,
  Yonaguni, Kume) están a 100-500 km de Naha. El gate geográfico las marcará
  lejos del centroide de la capital y **es correcto**.
- **与那国島** tiene el 花酒, el único destilado de 60° legal en Japón, y las tres
  destilerías de la isla no están en esta tabla.
- Los municipios de Okinawa llevan mucho 村 (Ogimi, Izena, Iheya, Onna,
  Yomitan): no convertirlos en 町 al escribir.

## Qué falta
- **~27 酒造所 del gremio sin listar**: esta tabla son 20 de 47. Faltan enteras
  las islas Miyako, Yaeyama (Ishigaki, Yonaguni, Taketomi) y Kumejima, además
  del sur de la isla principal (Itoman, Tomigusuku, Nanjo).
- Sin abrir, y Okinawa es la prefectura con la despensa más distinta del país:
  **黒糖 (azúcar moreno)**, que solo pueden hacer ocho islas y tiene productores
  identificables; **シークヮーサー de Ogimi**; 海ぶどう; 島とうがらし y コーレー
  グース; 紅芋 de Yomitan; ゴーヤー; 沖縄そば (con gremio propio); 石垣牛 y
  あぐー豚; 塩 de Miyako e Ishigaki.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 宮古島亜熱帯有機農業生産組合 | 砂川重信①　他 | 沖縄県宮古島市下地字来間443-1、443-2、444　他 | 有機農産物 | JS000828FA-0145-26 |
| 株式会社丸海あきら | MM-01 | 沖縄県浦添市伊祖3-43-8 | 有機農産物 | IOTA-SS-01 |
| 松八 | NT-01(b) 他 | 沖縄県中頭郡中城村字伊舎堂209　他 | 有機農産物 | IOTA-SS-03 |
| 農業生産法人（株）熱帯資源植物研究所 | 農業生産法人（株）熱帯資源植物研究所 | 沖縄県糸満市真栄平1158-1 | 有機農産物 | 2009F-15 |
| 伊佐　真幸 | ISA01 | 沖縄県那覇市首里石嶺町4-40 | 有機農産物 | IOTA-SS-37 |
| 仲村　直子 | NN01,03 | 沖縄県中頭郡北中城村字荻道底田原595, 596-1　他 | 有機農産物 | IOTA-SS-36 |
| 有限会社月桃農園 | GN01 | 沖縄県うるま市勝連浜宜野湾201　他 | 有機農産物 | IOTA-SS-34 |
| 外間　修 | HO-02　他 | 沖縄県中頭郡西原町幸地谷那堂1065,1065　他 | 有機農産物 | IOTA-SS-44 |
| 伊芸農園 | 伊芸農園－１～６ | 沖縄県国頭郡大宜味村字津波1971-50　他 | 有機農産物 | IOTA-SS-43 |
| 城間　清栄 | 松真農園－01他 | 沖縄県南城市佐敷字冨祖崎兼久原264-1　他 | 有機農産物 | IOTA-SS-38 |
| 農業生産法人　㈲琉球アロエ | 琉球アロエオーガニック農場 | 沖縄県国頭郡今帰仁村字渡喜仁２６９番地 　他 | 有機農産物 | IOTA-SS-48 |
| ゆんなみファーム | 後原畑№1、№2 | 沖縄県中頭郡西原町字安室213-5，213-2 | 有機農産物 | IOTA-SS-57 |
| 農業生産法人　株式会社石垣島胡椒園 | 有機ほ場①他 | 沖縄県石垣市字平得1021番地 | 有機農産物 | IOTA-SS-59 |
| 小橋川ファーム沖縄 | 小橋川ファーム沖縄No.1他 | 沖縄県中頭郡西原町兼久371-1他 | 有機農産物 | IOTA-SS-60 |
| 有限会社沖縄長生薬草本社 | CHOUSEI有機ほ場No１他 | 沖縄県南城市佐敷字仲伊保原99-1,103,111 | 有機農産物 | IOTA-SS-61 |
| おきなわオーガニック産地育成協議会 | 泉川農園①　他 | 沖縄県中頭郡北中城村渡口410　他 | 有機農産物 | IOTA-SS-62 |
| 農業生産法人(株)シーフォーグループ | 有機ほ場①他 | 沖縄県宮古島市下地字上地1016-1他 | 有機農産物 | IOTA-SS-63 |
| ソフィエル・ペアー（株） | 幸地①ほ他 | 沖縄県中頭郡西原町幸地下安次座906番地1他 | 有機農産物 | IOTA-SS-65 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/okinawa.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
- Estado: revisión cerrada el 2026-08-10; **2** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 宮古島チーズ工房 | Miyakojima | Lácteos y quesos | ChFun | miyakojima-cheese.com | revisado 2026-08-10: la guía no pudo enlazarse con una fuente primaria actual y localización completa |
| 石垣島ビール | Ishigaki | Cerveza | JBA | ishigaki-beer.com | revisado 2026-08-10: el dominio está secuestrado por contenido de casino y no hay fuente primaria actual utilizable |

**Ya integrado, no volver a proponer:** ヘリオス酒造 ya está en `okinawa.csv` como `Destilados y licores`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/okinawa.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **3 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 与那覇食品 | ⚠ | Pan y cereal | búsqueda dirigida + web propia | https://yonaha.co.jp/ | ⚠ 中頭郡: falta el municipio concreto; 沖縄そば |
| セイワ食品 | 浦添市 | Pan y cereal | búsqueda dirigida + web propia | https://mozukuudon.com/ | もずくうどん con mozuku de Iheya |
| 西崎製麺所 | 糸満市 | Pan y cereal | búsqueda dirigida + web propia | https://www.nishizakimen.com/ | 沖縄そば y fideos de mozuku/yomogi |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/okinawa.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/okinawa> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| グインのアーサ | 伊是名村 | Pescado | https://www.tabechoku.com/producers/29559 | 沖縄本島北部の離島、伊是名島(いぜなじま)。夫婦ふたりでアーサの養殖をしています。アーサは和名を“ヒトエグサ”といい、薄くて柔らかく手のひら |
| INOCCHIのもずく屋本舗 | 宮古島市 | Pescado | https://www.tabechoku.com/producers/22732 | 沖縄県宮古島でもずく養殖漁業を始めて、20年目の漁師です。皆さんに美味しいもずくをお届け致します。 |
| 新鮮組 | 宮古島市 | Pescado | https://www.tabechoku.com/producers/26548 | 沖縄県宮古島でモズク養殖をメインに漁業を営んでいる新鮮組と申します！ |
| 海ぶどう屋さん　富永養殖 | 糸満市 | Pescado | https://www.tabechoku.com/producers/21135 | 2014年から糸満市にある養殖場にて海ぶどうの養殖業を営んでおります。 |
| 久米島赤鶏牧場 | 久米島町 | Carne | https://www.tabechoku.com/producers/22949 | 私たちの牧場は、自然豊かな沖縄県久米島の、海に臨むなだらかな山の麓に位置しています。 |
| 伊集農園 | 八重瀬町 | Carne | https://www.tabechoku.com/producers/21170 | 伊集農園は初代が戦後、養豚、野菜、さとうきび栽培を中心に農業を始めました。現在マンゴー栽培を中心に、二代目と三代目のワンチームで質の高いマン |
| 我那覇畜産 | 名護市 | Carne | https://www.tabechoku.com/producers/22102 | 私たちは、やんばる（沖縄北部）の恵まれた大自然の中で、やんばるのおいしい水と高品質な飼料、出荷するまでの間は健康で、幸せに愛情を掛けて育てた |
| 命豚ふぁーむ | 沖縄市 | Carne | https://www.tabechoku.com/producers/21722 | 沖縄の大自然の中で丁寧に時間をかけて育てた「命豚」"ヌチブタ" |
| みーぐる工房 | 伊江村 | Condimentos | https://www.tabechoku.com/producers/27313 | みーぐる工房は、沖縄県西部北部の本部港よりフェリーに乗船30分間の船旅青く美しい海に囲まれた自然豊かな一等一村の島伊江島で、海の恵みである「 |
| シークヮーサーショップ | 大宜味村 | Condimentos | https://www.tabechoku.com/producers/22681 | 沖縄県の北部に位置する「シークヮーサーの里」大宜味村（おおぎみそん）のシークヮーサーを100%使った製品をお届けします。 |
| みやぎ農園青果物出荷組合 | 南城市 | Huevos | https://www.tabechoku.com/producers/24047 | 沖縄の旬な野菜・果物、たまご、加工品をまとめて出荷している組合です。 |
| INAHO FARM | 名護市 | Lácteos y quesos | https://www.tabechoku.com/producers/22246 | 沖縄のヤンバルにあるINAHO FARMです。我々は、東京ドーム35個分50万坪の広大な大自然の中で、全て無農薬で、養蜂、山地酪農、稲作、果 |
| 久米総合開発 | 久米島町 | Pan y cereal | https://www.tabechoku.com/producers/20922 | 車海老の生産量日本一の産地、 |
| 自然農園 MONSOON FARM & MUSIC | 南城市 | Pan y cereal | https://www.tabechoku.com/producers/28883 | わたしたち MONSOON FARM & MUSICは 沖縄県南城市にある家族経営の小さな自然農園です。 草も虫も敵とせず 米、バナナ、ハー |
| 南の島の恵み農園 | 恩納村 | Pan y cereal | https://www.tabechoku.com/producers/22647 | 私達は沖縄県恩納村の真栄田岬で沖縄そば屋を経営しております。真栄田岬は神秘的に青く光り輝く青の洞窟がある事で有名な観光地です。青の洞窟ご当地 |
| てぃーだふぁーむ | 今帰仁村 | Fruta y verdura | https://www.tabechoku.com/producers/24535 | 脱OLさんが、沖縄県で無農薬栽培に奮闘中。 |
| ふるさとマンゴー農園 | 名護市 | Fruta y verdura | https://www.tabechoku.com/producers/28574 | 女性マンゴー農家。 |
| 石垣島新鮮野菜きまぐれ〜kimagure〜 | 石垣市 | Fruta y verdura | https://www.tabechoku.com/producers/26913 | 石垣島にてパイナップルやマンゴー |
| 畑人 | 糸満市 | Fruta y verdura | https://www.tabechoku.com/producers/3078505 | 沖縄県糸満市で農産物直売所を営みながら、野菜や果物を生産しております。 |
| 志慶真ファーム | 今帰仁村 | ⚠ por decidir | https://www.tabechoku.com/producers/28702 | 沖縄本島北部。「やんばる」と呼ばれる未だ手付かずの自然が残る豊かな地域の一角にある村、今帰仁村。 |
| イナミファーム | 名護市 | ⚠ por decidir | https://www.tabechoku.com/producers/26275 | 東京で35年間会社勤務をしておりました。 |
| 西表ジャングルファーム | 竹富町 | ⚠ por decidir | https://www.tabechoku.com/producers/25055 | 世界自然遺産登録の西表島で、花卉園芸を中心に |
