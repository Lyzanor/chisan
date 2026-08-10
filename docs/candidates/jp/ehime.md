# Ehime — candidatos

- CSV: `data/csv/jp/shikoku/ehime.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/ehime> (43 bodegas, leído 2026-08-04). Gremio: 愛媛県酒造組合, <http://www.ehime-syuzou.com/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Ishizuchi Shuzo | 石鎚酒造 | Saijo ⚠ |
| Akikawa Shuzo | 秋川酒造 | Saijo ⚠ |
| Umenishiki Yamakawa | 梅錦山川 | Shikokuchuo |
| Imamura Shuzo | 今村酒造 | Shikokuchuo |
| Eiko Shuzo | 栄光酒造 | Matsuyama |
| Umebijin Shuzo | 梅美人酒造 | Yawatahama |
| Kawakame Shuzo | 川亀酒造 | Yawatahama |
| Utsunomiya Shuzo | 宇都宮酒造 | Seiyo ⚠ |
| Ogata Shuzo | 緒方酒造 | Seiyo |
| Ikedaya | 池田屋 | Seiyo ⚠ |
| Akamatsu Honke Shuzo | 赤松本家酒造 | Uwajima |
| Okushima Shuzo | 奥嶋酒造 | Iyo |
| Kachizuru Shuzo | かち鶴酒造 | Tobe |
| Kyowa Shuzo | 協和酒造 | Tobe |

## Trampas
- ⚠ **宇都宮酒造 (Seiyo, Ehime)** no es 宇都宮酒造 (Utsunomiya, Tochigi), en
  `tochigi.md`. Mismo 社名 exacto, y el de Tochigi además coincide con el nombre
  de su propia ciudad: casar por municipio, no por apellido.
- ⚠ **西条市 (Saijo, Ehime) no es 西条 (Saijo)**, el barrio de 東広島市 que es una
  de las tres capitales del sake, en `hiroshima.md`. Aquí es una ciudad entera y
  está en otra isla.
- ⚠ **池田屋 (Seiyo, Ehime)** es el cuarto `Ikedaya` del catálogo, tras 池田屋酒造
  de Ibigawa (Gifu) e Itoigawa (Niigata) y 池田屋 de Miyama (Fukuoka).
- **梅錦山川 y 梅美人酒造** comparten el 梅: dos empresas, dos municipios.
- **宇和町 (Uwa)** es un barrio de 西予市 (Seiyo) tras la fusión de 2004: el
  `municipio` es Seiyo.

## Qué falta
- Las ~29 bodegas restantes del censo.
- Sin abrir, y es el frente grande: **みかん y 柑橘** — Ehime disputa a Wakayama
  el primer puesto nacional y tiene decenas de variedades propias (伊予柑,
  紅まどんな, せとか) con productores y cooperativas que venden online.
  Además: 鯛 de Uwajima (acuicultura con marca), じゃこ天, 今治 y la ruta de
  Shimanami, 砥部焼 (no alimentario), 麦味噌 (el miso de cebada del que Ehime es
  la principal productora).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| フジワラ化学株式会社 | フジワラ化学（株）　他 | 愛媛県西条市大新田95-1　他 | 有機加工食品 | 38212200101 |
| 大三島果汁工業株式会社 | 大三島果汁工業（株） | 愛媛県今治市大三島町浦戸1104 | 有機加工食品 | 38354200101 |
| 阿部久敏 | 愛媛県今治市郷新屋敷町2丁目259番地1　他 | 愛媛県今治市郷新屋敷町2丁目259番地1　他 | 有機農産物 | 382021002 |
| 岡田　義之 | 愛媛県松山市中島大浦2204番地1　他 | 愛媛県松山市中島大浦2204番地1 | 有機農産物 | 38363101302 |
| ヤマキ株式会社 | ヤマキ（株）第二工場　他 | 愛媛県伊予市下三谷字明星田262-1他 | 有機加工食品 | JY070426PR-0983-0 |
| 田井　和美 | 07番ほ場 | 愛媛県東温市則之内乙1390番地1 | 有機農産物 | 38362100807 |
| 池川良嗣 | 愛媛県東温市則之内乙2004番地1　他 | 愛媛県東温市則之内乙2004番地1　他 | 有機農産物 | 38362100301～10 |
| 株式会社サンフーズ | （株）サンフーズ | 愛媛県大洲市菅田町菅田甲2522 | 有機加工食品 | 38207200101 |
| しまなみ有機栽培グループ | 末岡英治3 他 | 愛媛県今治市大三島町明日587 他 | 有機農産物 | 2004F-12 |
| 有限会社バイオ | 02番ほ場 | 愛媛県松山市鷹子町乙52番地 | 有機農産物 | 38201100102 |
| 遠赤青汁株式会社 | 遠赤青汁㈱　本社工場 | 愛媛県東温市河之内乙８２７－１ | 有機加工食品 | 383362200101-2 |
| 愛工房株式会社 | 愛工房㈱ | 愛媛県宇和島市吉田町立間2番耕地146番地 | 有機加工食品 | 38203200101 |
| 株式会社Revege | 株式会社Revege | 愛媛県大洲市成能甲1583番地 | 有機農産物 | 38201100803 |
| 株式会社山口園芸 | 02ほ場 | 愛媛県宇和島市津島町増穂乙４番地 | 有機農産物 | 38203100202 |
| 白石　善輝 | 01番ほ場 | 愛媛県八幡浜市保内町宮内6番耕地963-3 | 有機農産物 | 38204100201 |
| 山崎　学 | 愛媛県今治市上浦町井口4765番地 | 愛媛県今治市上浦町井口4765番地 | 有機農産物 | 382021027 |
| 株式会社　アール・シー・フードパック | （株）アール・シー・フードパック | 愛媛県西予市宇和町卯之町2丁目575番地 | 有機加工食品 | 38214200201 |
| 二宮　裕基茂 | 愛媛県八幡浜市日土町ツバキ谷5-280-1　他 | 愛媛県八幡浜市日土町ツバキ谷5-280-1　他 | 有機農産物 | 382041004 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/ehime.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **propia** — búsqueda dirigida por producto; ficha o web propia del productor
- Estado: revisión cerrada el 2026-08-10; **4** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 井上蒲鉾本舗 | ⚠ Uwajima | Pescado | propia | — | じゃこ天; confirmar municipio y web; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |
| 田中蒲鉾本店 | ⚠ Uwajima | Pescado | propia | — | じゃこ天; confirmar municipio y web; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |
| 河内屋 | ⚠ Uwajima | Pescado | propia | — | じゃこ天; confirmar municipio y web; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |
| 野中蒲鉾 | ⚠ Uwajima | Pescado | propia | — | じゃこ天 de prensado manual; confirmar identidad; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |

**Ya integrado, no volver a proponer:** 梅錦山川 ya está en `ehime.csv` como `Sake`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/ehime.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/ehime.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **7 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 一六本舗 | 松山市 | Dulces y repostería | 和菓子協会 | http://www.itm-gr.co.jp/ | 松山市東石井 1-2-20 |
| 中野本舗 | 松山市 | Dulces y repostería | 和菓子協会 | http://www.usuzumi.co.jp/ | 松山市井門町 1331-1 |
| 東陽製菓株式会社 | 西条市 | Aperitivos | 全国米菓工業組合 | http://www.touyouseika.jp/ | 米菓製造・販売業（直売所有り） |
| 野中かまぼこ店 | ⚠ | Pescado | búsqueda dirigida + web propia | https://www.jakoten.co.jp/ | ⚠ municipio sin confirmar (Uwajima); じゃこ天 |
| 井上蒲鉾本舗 | ⚠ | Pescado | búsqueda dirigida + web propia | https://www.e-jyakoten.co.jp/ | ⚠ la web devuelve 403 al bot (no es sitio muerto); municipio sin confirmar |
| 河内屋蒲鉾 | 宇和島市 | Pescado | búsqueda dirigida + web propia | https://www.kawachiya1848.co.jp/ | じゃこ天; casa de 1848 |
| おがた蒲鉾 | 西予市 | Pescado | búsqueda dirigida + web propia | https://www.ogata-kamaboko.co.jp/ | じゃこ天 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/ehime.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/ehime> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 木嶋水産 | 伊方町 | Pescado | https://www.tabechoku.com/producers/26700 | 日本一細長い半島「佐田岬半島」で漁業を営んでいます。釜揚げしらす、ちりめんじゃこ、わかめ、その他魚介類の製造販売をしています。佐田岬のリアス |
| NOT FARM | 八幡浜市 | Pescado | https://www.tabechoku.com/producers/3079048 | 愛媛県八幡浜市。100年以上の歴史を刻む老舗みかん農園から、NOTFARMは生まれました。確かな技術と伝統があるからこそ、私たちは「農家らし |
| 松本功次（由良のアワビ屋） | 宇和島市 | Pescado | https://www.tabechoku.com/producers/23638 | 愛媛の宇和島市にある由良半島で主にアワビとヒオウギ貝の養殖を行っております【由良のアワビ屋】です。 |
| 川原鮮魚 | 西予市 | Pescado | https://www.tabechoku.com/producers/26556 | 2021年、８月に、加工場を、立ち上げました。今までは、漁師だけをしていましたが、沢山の人に、 |
| にのらく茶園　有機国産べにふうき専門 | 内子町 | Té e infusiones | https://www.tabechoku.com/producers/28007 | 日本生まれの美味しい紅茶品種「べにふうき」だけにこだわり、栽培から製茶まで自分たちで行う小さな農園です。20年前に畑を開いた時からオーガニッ |
| ＴＯＹＯＫＥＮ | 今治市 | Carne | https://www.tabechoku.com/producers/28144 | 美味しい海賊卵（烏骨鶏卵）を召し上がっていただくため、鶏たちがストレスなく、より自然に近い環境で育つために放し飼い飼育を選択しました。 |
| 大友農園 | 松山市 | Carne | https://www.tabechoku.com/producers/3078159 | 自己紹介させていただきます/えっと/大友農園の大友良介です/1976年生まれ兵庫県出身/水瓶座のO型です/高校卒業後上京して音楽ばかりやって |
| 島馬ファーム瀬戸内 | 松山市 | Carne | https://www.tabechoku.com/producers/3078566 | 瀬戸内海の離島・中島で、動物（ポニー・山羊）とともに循環型農業を実践中です。 自家製馬糞堆肥で柑橘を大切に育てています。 かつて耕作放棄地だ |
| 森の風 | 鬼北町 | Setas | https://www.tabechoku.com/producers/28654 | 豊かな自然が残る清流四万十川の愛媛県側の源流地域、鬼北町で育まれたえごま油と原木乾燥しいたけをご賞味ください |
| シトラスベースひめまる | 伊方町 | Dulces y repostería | https://www.tabechoku.com/producers/3077649 | 私たちは、夫婦2人で日本一のミカン産地といわれる西宇和のなかでも最高の立地条件（全ての園地が南西向きで海抜150メートル以下）に恵まれた段々 |
| メニークエスト | 西予市 | Dulces y repostería | https://www.tabechoku.com/producers/3077350 | 愛媛県は日本有数の和栗の産地。全国の老舗和洋菓子メーカーから絶大な評価を得ています。 |
| GUILD Farm | 松山市 | Cerveza | https://www.tabechoku.com/producers/3077713 | 柑橘王国愛媛で、柑橘とお米を育てています。自然栽培で生産し、パックごはんや愛媛県産原料100%オーガニックビールなど、6次加工にも力を入れて |
| まるき農園 | 今治市 | Pan y cereal | https://www.tabechoku.com/producers/29523 | 私たちは夫婦二人、愛媛県の大三島で農薬化学肥料不使用で旬のお野菜や柑橘、お米を栽培している農家です。ここ大三島の有機栽培野菜の美味しさに魅了 |
| ethnic green farm廣川農園 | 東温市 | Pan y cereal | https://www.tabechoku.com/producers/20116 | 愛媛県でエスニック料理に使う野菜を中心にこだわりの有機肥料と菌を使い、露地栽培で年間1ヘクタールの畑で約40品目の野菜、米を栽培し全国の飲食 |
| SUNNYSIDE FARM | 松山市 | Pan y cereal | https://www.tabechoku.com/producers/29052 | 愛媛県松山市窪野町・久谷町を中心に農薬・肥料・除草剤に頼らずお米やお野菜を栽培しています。農家の高齢化、担い手不足が問題となっている日本の現 |
| 里居農園（さといのうえん） | 西予市 | Pan y cereal | https://www.tabechoku.com/producers/20790 | 地元、愛媛県で合計8ヘクタールほどの土地でお米とお野菜を年間40品目程度栽培しています。 |
| えひめ　二宮果樹園 | 八幡浜市 | Fruta y verdura | https://www.tabechoku.com/producers/22586 | 愛媛県八幡浜市でかんきつを栽培している農家です |
| 新口農園【みかん・柑橘グランプリ2026最高金賞受賞】 | 八幡浜市 | Fruta y verdura | https://www.tabechoku.com/producers/25606 | 愛媛県八幡浜市川上町。ここは、空・海・石垣からの「三つの太陽」が降り注ぐ、日本でも指折りの柑橘の聖地です。100年の歴史の中で磨き上げた新口 |
| 吉本農園 | 愛南町 | Fruta y verdura | https://www.tabechoku.com/producers/18 | 小高い駄馬にある当園地では、たくさんの種類のみかんを栽培しています。 また、農林大臣賞という素晴らしい賞を頂くことが出来ました。 |
| 四万十ミライ | 久万高原町 | ⚠ por decidir | https://www.tabechoku.com/producers/27748 | 食べチョクご利用の皆さまはじめまして |
| OrangeStoreニノミヤ | 八幡浜市 | ⚠ por decidir | https://www.tabechoku.com/producers/21129 | ５年間で【９万８千件】を超えるご注文をいただいています。 |
| ニノミヤファーム | 八幡浜市 | ⚠ por decidir | https://www.tabechoku.com/producers/22932 | 愛媛県八幡浜市から愛をこめて |
