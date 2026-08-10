# Fukuoka — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/fukuoka.csv` (6 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/fukuoka> (70 bodegas, leído 2026-08-04). Gremio: 福岡県酒造組合, <http://www.fukuoka-sake.org/>.
- Estado: **6 integradas** el 2026-08-05 (5 `verificado`, 1 `parcial`). Evidencia en `data/evidence/jp/kyushu-okinawa/fukuoka.jsonl`.

Fukuoka es la tercera prefectura de Japón en número de bodegas, detrás de Hyogo y
Niigata. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Asahigiku Shuzo | 旭菊酒造 | Kurume |
| Ikekame Shuzo | 池亀酒造 | Kurume |
| Asahimatsu Shuzo | 旭松酒造 | Yame |
| Ayasugi Shuzojo | 綾杉酒造場 | Fukuoka |
| Izu Honten | 伊豆本店 | Munakata |
| Isonosawa | いそのさわ | Ukiha |
| Umegatani Shuzo | 梅ヶ谷酒造 | Kama |
| Osato Shuzo | 大里酒造 | Kama ⚠ |
| Egashira Shuzo | 江頭酒造 | Omuta |
| Okina Shuzo | 翁酒造 | Koga ⚠ |
| Kataoka Shuzojo | 片岡酒造場 | Toho |
| Ikedaya | 池田屋 | Miyama ⚠ |

## Integradas 2026-08-05 (6)

| bodega | municipio | resultado |
|---|---|---|
| Morinokura | Kurume | verificado · venta sí |
| Wakatakeya Shuzojo | Kurume | verificado · venta sí |
| Yamaguchi Shuzojo (Niwa no Uguisu) | Kurume | verificado · sin carrito |
| Ishikura Shuzo (Hakata Hyakunengura) | Fukuoka | verificado · sin carrito |
| Oga Shuzo | Chikushino | verificado · sin carrito |
| Kitaya | Yame | **parcial** · web sin respuesta |

Cuatro de las seis no estaban en la tabla de arriba: salieron al cazar dominios,
igual que Nakao en `hiroshima.md`. **El censo de la tabla es una selección, no
el padrón** — Fukuoka tiene 70 bodegas.

⚠ **`Kurume` resolvía a Higashikurume, en Tokio**, a 950 km: error bloqueante.
Resuelto el 2026-08-05 con una entrada `kurume` en
`municipality-overrides.json` (kanto vs kyushu-okinawa). Tercer homónimo de la
sesión tras `tonosho` y `kashima`, y el más peligroso porque **Kurume
concentra tres de estas seis bodegas**.

- **大賀酒造 (1673) es la más antigua de la prefectura** y **石蔵酒造 la única que
  sigue elaborando dentro de Hakata**: las dos son perfiles de visita, no de
  venta online.
- **Kitaya no respondió** ni en su dominio principal ni en el de su tienda
  declarada. Se queda `parcial`; reintentar antes de dar el dominio por malo.

## Trampas
- ⚠ **La fuente sitúa 大里酒造 en 嘉穂郡嘉穂町, que ya no existe**: se fusionó en
  2006 en 嘉麻市 (Kama), donde ya está 梅ヶ谷酒造. Wikidata excluye los municipios
  disueltos, así que el nombre viejo deja la fila sin puerta geográfica
  (`AGENTS.md`). Misma trampa que en `tochigi.md` y `tokushima.md`.
- ⚠ **古賀市 (Koga, Fukuoka) no es 古河市 (Koga, Ibaraki)**, donde está 青木酒造
  (`ibaraki.md`). Mismo rōmaji, dos extremos de Honshu/Kyushu.
- ⚠ **池田屋 (Miyama)** es otro de los cuatro `Ikedaya` del catálogo: ver la lista
  en `ehime.md`.
- **旭菊 y 旭松** comparten el 旭 pero no son ninguno de los cuatro 旭酒造 de
  `mie.md`.
- 大賀酒造 (1673) es la bodega más antigua de Kyushu: perfil con historia y
  probable tienda propia, buen sitio por donde empezar el lote.

## Qué falta
- Las ~56 bodegas restantes del censo.
- Sin abrir, y con mucho: **八女茶 (Yame)** — el mejor gyokuro de Japón, con
  productores familiares que venden online; **明太子** (con decenas de casas en
  Hakata, no solo las industriales); あまおう (fresa con marca registrada);
  久留米/博多 ラーメン y sus caldos; 醤油 y 味噌 de Yanagawa; 柳川のうなぎ.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 有限会社有機コーヒー | 有限会社有機コーヒー　他 | 福岡県遠賀郡水巻町下二西3-7-16　他 | 有機加工食品 | GMJP1106 |
| 関門食品株式会社 | 曽根工場他 | 福岡県北九州市小倉南区中吉田1-1-1他 | 有機加工食品 | SEZ-170509 |
| 株式会社熊谷光玉園 | 川島工場　他 | 福岡県八女市大字納楚400　他 | 有機加工食品 | SEZ-1708043 |
| 友添信之 | １他 | 福岡県柳川市三橋町吉開水町589-1　他 | 有機農産物 | 0610-A13 |
| （株）吉田園 | （株）吉田園　他 | 福岡県八女市黒木町本分1159-5　他 | 有機加工食品 | JY81030K-0054-0 |
| オアシス珈琲有限会社 | オアシス珈琲有限会社 | 福岡県飯塚市堀池133-9 | 有機加工食品 | SEZ-18103001 |
| 樋口勇八郎 | 1　他 | 福岡県うきは市浮羽町新川字平利山508-13　他 | 有機農産物 | 0612-A10 |
| POP LIFE  CO. | Pop　Life　Co.他 | 福岡県福岡市東区美和台4-6-2他 | 有機加工食品 | 0701-B01 |
| 中川食品（株） | 中川食品（株） | 福岡県北九州市小倉南区長野本町4-11-1 | 有機加工食品 | JN010229PR-0325-0 |
| 合資会社 山科茶舗 | 合資会社 山科茶舗  製茶工場 | 福岡県朝倉市大字甘木1642-2 | 有機加工食品 | SEZ-31311 |
| 古賀　俊夫 | ほ場1他 | 福岡県八女郡広川町大字藤田高塚710-12　他 | 有機農産物 | SES-170314 |
| きさらぎ農園 | ムロゾノ①他 | 福岡県八女市上陽町北川内4704-１　他 | 有機農産物 | SES-1708092 |
| (株)庄分酢 | 本社工場　他 | 福岡県大川市榎津548　他 | 有機加工食品 |  |
| 株式会社　ベストアメニティファクトリー | 本社工場　他 | 福岡県久留米市三潴町高三潴７３８-４　他 | 有機加工食品 | 0906-B01 |
| 株式会社百年生物化学研究所 | 株式会社百年生物化学研究所九州第二工場　他 | 福岡県宮若市稲光２７１－２　他 | 有機加工食品 | SEZ-21090701 |
| 友和産業株式会社 | 第1工場　他 | 福岡県八女市蒲原1993-2 | 有機加工食品 | SEZ-22100441 |
| 株式会社ヒビキスパイス | 株式会社ヒビキスパイス　若松工場 | 福岡県北九州市若松区響町1丁目43番地 | 有機加工食品 | 加-0079 |
| 株式会社カトウ | 株式会社カトウ　他 | 福岡県八女市黒木町本分4513　他 | 有機加工食品 | 1009-B01 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/fukuoka.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 門司港レトロビール | Kitakyushu | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/fukuoka.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/fukuoka.php> (nombre, dirección y web propia de cada socio)
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **7 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 左衛門 | 古賀市 | Dulces y repostería | 和菓子協会 | http://www.saemon.jp/ | 古賀市鹿部 335-19 |
| つか菓子舗 | 福岡市 | Dulces y repostería | 和菓子協会 | http://www2.plala.or.jp/tukakasiho/ | 福岡市中尾 3-4-5 |
| 原口園（扶桑庵） | ⚠ | Té e infusiones | búsqueda dirigida + web propia | https://haraguchien.co.jp/ | ⚠ la web mezcla Fukuoka y Yame: resolver la unidad productiva |
| 山口製茶園（茶幸庵） | ⚠ | Té e infusiones | búsqueda dirigida + web propia | https://www.chakouan.com/ | ⚠ municipio sin confirmar |
| 牛島製茶 | 八女市 | Té e infusiones | búsqueda dirigida + web propia | https://www.yame.co.jp/ | 八女茶, 1921 |
| 古賀製茶本舗 | 八女市 | Té e infusiones | búsqueda dirigida + web propia | https://koganoyamecha.co.jp/ | 八女茶 |
| 浅野園 | 大牟田市 | Té e infusiones | búsqueda dirigida + web propia | https://www.asanoen.com/ | 製造直売 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/fukuoka.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/fukuoka> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 川﨑果樹園 | 北九州市 | Pescado | https://www.tabechoku.com/producers/26096 | 園芸農家に生まれ自然と、身近な植物に、関心を抱きながら生活して来ました。小学生の頃、温室の天窓の開け閉めの手伝いをしていたことで、植物にとっ |
| マサエイ水産加工 | 宗像市 | Pescado | https://www.tabechoku.com/producers/21079 | 食べチョクでアカモクを中心に出品しています！ |
| オーガニックハーブ農園　Pala’au | 筑紫野市 | Pescado | https://www.tabechoku.com/producers/28391 | ハーバリストとして活動するにあたり、無農薬・化学肥料不使用で安心・安全なオーガニックハーブを提供したいと考え夫婦でハーブ農園を始めました。そ |
| たつみ園 | 八女市 | Té e infusiones | https://www.tabechoku.com/producers/22353 | わたし達は福岡県南部に位置する自然が豊かな八女茶の本場上陽町で家族四人で営んでいる田舎のお茶屋です。清らかな水と豊かな自然に恵まれるこの地で |
| グリーンワールド八女 | 八女市 | Té e infusiones | https://www.tabechoku.com/producers/21484 | 八女市は、福岡県南部、熊本県と大分県の県境に位置し、高級茶の八女茶の産地です。八女茶の栽培・加工から始まり、緑茶の製造技術の活かした大麦若葉 |
| お茶の千代乃園 | 八女市 | Té e infusiones | https://www.tabechoku.com/producers/20127 | 福岡県八女市矢部村、標高600mの雪ふる山の中で有機栽培(オーガニック）でお茶作りを営む「千代乃園」です。農薬･化学肥料不使用で育てた八女茶 |
| やまもり養鶏場 | うきは市 | Carne | https://www.tabechoku.com/producers/22408 | 当農場では鶏の健康・餌・環境、全てに妥協しない卵づくりを日々続けています🥚 |
| 【博多黒毛和牛】あか村総本家 | 赤村 | Carne | https://www.tabechoku.com/producers/3077218 | 🍖市場になかなか出回らない🍖黒毛和牛専門『あか村総本家』 |
| 博多すぎたけ商店（ドリームマッシュ） | 大木町 | Setas | https://www.tabechoku.com/producers/22849 | 福岡県大木町を拠点とする当社では、長年にわたり多種多様のきのこ栽培を行っており、きのこのパイオニアとして活動しております。また、野生の品種か |
| K.ファーム | 糸島市 | Setas | https://www.tabechoku.com/producers/3078320 | 2024年10月に脱サラしてきくらげ栽培を始めました。 |
| 須田養蜂場 | 豊前市 | Miel | https://www.tabechoku.com/producers/23375 | 福岡県豊前市で夫婦2人でやっています小さなハチミツ屋です。 |
| よかもんいちご | うきは市 | Conservas | https://www.tabechoku.com/producers/23050 | 当園は、平成21年創業、福岡県南東部に位置するうきは市浮羽町でイチゴの生産、販売、観光農園（イチゴ狩り）、加工品の販売を営んでいます。 |
| 丘の上ファーム | 宗像市 | Conservas | https://www.tabechoku.com/producers/24276 | 丘の上ファームと申します。何らかのハンディのある人を含め20人足らずの従業員で毎日明るく楽しくまた、真剣に皆でスプラウトにんにくを栽培してい |
| 杏里ファーム | 柳川市 | Café | https://www.tabechoku.com/producers/23968 | 私たち杏里ファームは福岡県柳川市で魅力のある農業を目指し、マンゴーやパッションフルーツ、コーヒーなどの南国フルーツの栽培、それらのフルーツや |
| やまんた農園 | 広川町 | Frutos secos | https://www.tabechoku.com/producers/22939 | 無農薬の美味しいみかんや栗を |
| 能古島おがわ農園 | 福岡市 | Frutos secos | https://www.tabechoku.com/producers/21006 | 博多湾の能古島(のこのしま)という離島で、【ブルーベリー】と【ピーナッツもやし】を栽培しております。 |
| うるう農園~福岡のいちご~ | 久留米市 | Pan y cereal | https://www.tabechoku.com/producers/22204 | 福岡県久留米市のいちご農園【うるう農園】です |
| 白石アグリ | 遠賀町 | Pan y cereal | https://www.tabechoku.com/producers/29509 | はじめまして、私は福岡県遠賀町で50年以上米作りをおります。年齢は70歳を超えました。 |
| 農業福島園 | 宗像市 | Fruta y verdura | https://www.tabechoku.com/producers/29244 | 高校進学とともに祖父母の後継ぎとして農家になることを決意しました。理由は、夏休みに遊びにいくと2時間も昼寝をしている祖父を見て「百姓ってこれ |
| いりえさんちの野菜 | 那珂川市 | Fruta y verdura | https://www.tabechoku.com/producers/3077818 | 福岡市に隣接する水と緑の町、那珂川市で家内制手工業で農業を営んでおります。 |
| 肉のたかむく | 柳川市 | ⚠ por decidir | https://www.tabechoku.com/producers/21540 | 2013年11月1日に会社設立。 |
| オーガニックナガミツファーム | 糸島市 | ⚠ por decidir | https://www.tabechoku.com/producers/20007 | オーガニックナガミツファームは福岡県糸島市の認定農業者です。 |
