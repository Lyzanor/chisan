# Yamagata — candidatos

- CSV: `data/csv/jp/tohoku/yamagata.csv` (22 filas: 21 bodegas más Tsuruoka Beikoku, cereal).
- Fuentes: 山形県酒造組合, <http://yamagata-sake.or.jp/pages/162/> — mapa de los 47 socios, **con ficha por bodega que sí publica el dominio** (`/pages/NN/`); y el censo de SAKETIMES, <https://jp.sake-times.com/sakagura/yamagata> (53).
- Estado: ⚑ **PASADA CERRADA** el 2026-08-05. Las 21 de la cola integradas (16 `verificado`, 5 `parcial`); queda **una**, 菊勇 (Sakata), sin ficha localizada en el gremio. Evidencia en `data/evidence/jp/tohoku/yamagata.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kikuisami | 菊勇 | Sakata ⚠ sin ficha en el mapa del gremio |

## Integradas 2026-08-05 (21) — cola vaciada

| bodega | municipio | resultado |
|---|---|---|
| Dewazakura Shuzo | Tendo | verificado · venta sí |
| Tatenokawa Shuzo | Sakata | verificado · venta sí |
| Kojima Sohonten | Yonezawa | verificado · venta sí |
| Yonetsuru Shuzo | Takahata | verificado · venta sí |
| Gassan Shuzo | Sagae | verificado · venta sí |
| Mitobe Shuzo | Tendo | verificado · venta sí |
| Sakata Shuzo | Sakata | verificado · sin carrito |
| Takagi Shuzo | Murayama | **parcial** · sin web |
| Kamenoi Shuzo | Tsuruoka | **parcial** · sin web |
| Rokkasen | Higashine | verificado · venta sí |
| Kosaka Shuzo | Yonezawa | verificado · venta sí |
| Chiyokotobuki Toraya | Sagae | verificado · venta sí |
| Watarai Honten | Tsuruoka | verificado · venta sí |
| Shindo Shuzoten | Yonezawa | verificado · sin tienda |
| Shuho Shuzojo | Yamagata | verificado · sin tienda |
| Otokoyama Shuzo | Yamagata | verificado · sin tienda |
| Takenotsuyu | Tsuruoka | verificado · sin tienda |
| Furusawa Shuzo | Sagae | verificado · sin tienda |
| Fumotoi Shuzo | Sakata | verificado · sin tienda |
| Kotobuki Toraya Shuzo | Yamagata | **parcial** · web con JS |
| Kato Kahachiro Shuzo | Tsuruoka | **parcial** · URL caduca |

**Aquí el gremio sí es la palanca, al revés que en Fukushima.** El mapa de socios
(`/pages/162/`) enlaza una ficha por bodega y esa ficha **publica el dominio
propio**, además de dirección y teléfono. Una llamada por bodega en vez de dos.
Ojo con las rutas: `/publics/index/NN/` redirige 301 a `/pages/NN/`.

- ⚠ **Que el campo web del registro esté vacío no significa que no haya web.**
  酒田酒造 aparece con «—» en el dominio, pero el gremio sí publicaba su correo:
  el dominio de ese correo (`jokigen.com`, que es su marca) resultó ser su web
  propia, con la misma dirección y el mismo teléfono. Tirar del correo antes de
  dar por perdida una bodega.
- ⚠ **La lectura de `yonetsuru.com` devolvió otro municipio** («Yamabe-machi»)
  conservando el número de calle. El gremio la sitúa en Takahata, que es lo que
  se escribió. Es el mismo ruido de lectura que en Ayakiku (`kagawa.md`): cuando
  la web y el registro chocan en municipio y coincide el número, manda el registro.
- **高木酒造, la casa de 十四代, no tiene web ni correo.** Igual que Hiroki en
  Fukushima: dos de las marcas más buscadas del país son `parcial` por no tener
  dónde enlazar.


## Cierre de la pasada (2026-08-05)

Las 12 fichas restantes salieron de una tacada porque **el gremio publica el
dominio de las doce**. Después bastó un barrido leyendo el cuerpo de cada web.

- ⚠ **Contar palabras de tienda en el HTML da falsos positivos.** Dos de seis
  candidatas a `Venta online=sí` se cayeron al mirar los enlaces reales:
  男山酒造 daba cuatro coincidencias que eran **ficheros CSS de Wix**, y 古澤酒造
  doce que eran **rutas de blog** (`/blog/category/foodshop/`). Hay que extraer
  el href, no contar la palabra.
- ⚠ **加藤嘉八郎酒造 se declara a sí misma sitio antiguo** en su portada
  (「当サイトは旧サイトとなります」) y el gremio sigue publicando esa URL. Es el
  segundo registro con dominio caduco tras Sakai en `kagawa.md`. Se queda
  `parcial` con el enlace viejo hasta localizar el vigente.
- **寿虎屋酒造 sirve el cuerpo vacío**: se pinta con JavaScript, como el buscador
  del gremio de Hiroshima. `parcial`.
- **千代寿虎屋 (Sagae) y 寿虎屋酒造 (Yamagata) son dos empresas**, como avisaba
  este fichero: direcciones, teléfonos y municipios distintos. Confirmado.

## Trampas
- **寿虎屋酒造 (Yamagata) y 千代寿虎屋 (Sagae) son dos empresas** con el mismo
  「虎屋」: casar por 社名 completo y municipio.
- **後藤酒造店 y 後藤康太郎酒造店**, ambas en 高畠町, misma trampa.
- Los 郡 del interior (東置賜郡, 西置賜郡, 東田川郡, 西村山郡, 飽海郡) no son
  municipio: la fila lleva el 町/村 — Takahata, Kawanishi, Shonai, Kahoku, Yuza.
- **オードヴィ庄内 (Sakata)** es la destilería de un grupo (Eau de Vie): mirar si
  tiene marca e identidad propias antes de darla de alta.

## Qué falta
- Las ~30 bodegas restantes del censo.
- Sin abrir: cereza sato-nishiki y pera La France (Yamagata es la primera de
  Japón en ambas), ternera de Yonezawa, 玉こんにゃく, soba de Murayama, y el
  **vino de Takahata/Nan'yo**, que tiene bodegas históricas y no hay ninguna.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 農事組合法人 庄内協同ファーム | 五十嵐英一　43　他 | 山形県東田川郡三川町大字押切新田字深田15-5　他 | 有機農産物 | AFASSEQ-AA-000902 |
| 渡部陽一 | 2　他 | 山形県新庄市昭和867-2-ロ　他 | 有機農産物 | S-040 |
| 石井昭一 | 1　他 | 山形県新庄市大字昭和199-1　他 | 有機農産物 | S-147 |
| 有限会社ファーマーズクラブ赤とんぼ | オオウナジタ1他 | 山形県東置賜郡高畠町大字高畠大畦下2-2990-1他 | 有機農産物 | AFASSEQ-AA-011101 |
| 株式会社おきたま興農舎 | 安部慎一郎 1　他 | 山形県米沢市窪田町西川崎2134-イ　他 | 有機農産物 | 13 |
| ネットワーク21　代表 菅原弘行 | 菅原弘行 ①　他 | 山形県東田川郡三川町大字押切新田字前興39　他 | 有機農産物 | 12 |
| 高畠ワイン有機ぶどう研究会 | （株）高畠ワイナリー８ | 山形県東置賜郡高畠町大字元和田2752 | 有機農産物 | JT040924FA-0755-0 |
| 井上克浩 | №1　他 | 山形県鶴岡市渡前字大坪80番地　他 | 有機農産物 |  |
| 株式会社丸十大屋 | （株）丸十大屋　他 | 山形県山形市十日町3-10-1　他 | 有機加工食品 | 01-018B |
| 農事組合法人　山形おきたま産直センター | 新関拓也　2　他 | 山形県南陽市金沢万平193-ニ・ホ、194-2　他 | 有機農産物 | S-101 |
| 工藤　賢悦 | 野草人　工藤農場 | 山形県東置賜郡高畠町大字亀岡字石転シ4593　他 | 有機農産物 | 01-053 |
| 川西自然農法グループ | 高橋健次 1 他 | 山形県東置賜郡川西町大字堀金字萩ノ目1173-2 他 | 有機農産物 | 2006F-13 |
| 庄内自然農法研究会 | 菅原賢信　他 | 山形県鶴岡市古郡字杉ノ崎139　 他 | 有機農産物 | 2000F-9 |
| 山形有機うまいもん研究会 | 伊藤藤夫 4 他 | 山形県東置賜郡川西町堀金438 他 | 有機農産物 | 2001F-39 |
| 佐久間優 | 1　他 | 山形県鶴岡市常磐木字臼井10-11-（1）他 | 有機農産物 | 18 |
| 農事組合法人太ももの会　代表 渋谷嘉明 | 1　他 | 山形県酒田市広野昭和91-1　他 | 有機農産物 | 17 |
| 石井　光司 | 石井光司　UF-1　他 | 山形県鶴岡市添川字洗田91－イ　他 | 有機農産物 | JA70417FA-1048-13 |
| 岡部農園　代表 岡部栄一 | ①　他 | 山形県鶴岡市羽黒町大字仙道一本松72-1-3-(1)　他 | 有機農産物 | 19 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/yamagata.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/yamagata.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/yamagata.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **9 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 杵屋 | 上山市 | Dulces y repostería | 和菓子協会 | http://www.kineya.co.jp/ | 上山市弁天 2-3-12 |
| 乃し梅本舗　佐藤屋 | 山形市 | Dulces y repostería | 和菓子協会 | http://satoya-matsubei.com/ | 山形市十日町 3-10-36 |
| 十一屋 | 山形市 | Dulces y repostería | 和菓子協会 | http://www.juichiya.co.jp/ | 山形市七日町 1-4-32 |
| 木村屋 | 鶴岡市 | Dulces y repostería | 和菓子協会 | http://www.kimuraya.co.jp/ | 鶴岡市山王町 9-25 |
| 株式会社モミの木 | 山形市 | Aperitivos | 全国米菓工業組合 | https://www.mominoki.gr.jp | 米菓製造業（菓子卸等へ販売） |
| 蔵王米菓株式会社 | 村山市 | Aperitivos | 全国米菓工業組合 | https://zaou.co.jp/ | 米菓製造・販売業（直売所有り） |
| 酒田米菓株式会社 | 酒田市 | Aperitivos | 全国米菓工業組合 | https://www.sakatabeika.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）、米菓生地製造業・販売業、米菓販売業（その他菓子を含む卸・小売業）、その他（米菓を含むコメ加工品製造・販売等） |
| ㈱卯月製麺 | 寒河江市 | Pan y cereal | 全乾麺 | https://ja-jp.facebook.com/uzukiseimen/ | 機械製乾めん |
| 城北麺工株式会社 | 山形市 | Pan y cereal | 全乾麺 | http://www.yamagata-johoku.co.jp/ | 機械製乾めん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/yamagata.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/yamagata> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| アンスリーファーム | 寒河江市 | Pescado | https://www.tabechoku.com/producers/20966 | 平成29年･令和2年･令和3年、山形県さくらんぼ品評会にて山形県1位の農林水産大臣賞 |
| いしまるファーム | 尾花沢市 | Pescado | https://www.tabechoku.com/producers/29290 | 私たちは夏すいか日本一の産地尾花沢ですいかを生産しています。 |
| たむちゃん農園 | 遊佐町 | Pescado | https://www.tabechoku.com/producers/26804 | 2022年4月に新規就農したばかりの、たむちゃん農園田村と申します。ミニトマト、メロン、すいかを中心に栽培しています。11年、大田市場の仲卸 |
| 上山観光フルーツ園 | 上山市 | Carne | https://www.tabechoku.com/producers/25212 | 山形県上山市の蔵王を見晴らす丘の上で、サクランボ、プラム、桃、ぶどう、りんご、梨を中心に多品目の果物を生産しています。 |
| 漆山果樹園 | 南陽市 | Carne | https://www.tabechoku.com/producers/20865 | 漆山果樹園の歴史は80年以上続くぶどう専門農家です。デラウェアと高級ぶどう３０種類を栽培しています。常温乾燥機でドライフルーツや野菜の製造販 |
| 平田牧場 | 酒田市 | Carne | https://www.tabechoku.com/producers/20661 | 私たち平田牧場は、品種開発や子豚生産、肥育から加工・流通・販売に至るまで、すべて自社で行っている会社です。 |
| 山形の森と田園 | 西川町 | Setas | https://www.tabechoku.com/producers/20428 | 「山形の森と田園」は、東北南部山形県で育まれた天然山菜・天然きのこやそれらの加工食品、山ぶどう原液ジュースや四季折々の野菜・果物・お米等を全 |
| すくすくやさい畑 | 鶴岡市 | Legumbres | https://www.tabechoku.com/producers/23991 | 山形県鶴岡市で米、だだちゃ豆（枝豆）、ねぎ、その他葉物野菜などを両親と作っています。 |
| 農園　阿部惣右衛門 | 鶴岡市 | Legumbres | https://www.tabechoku.com/producers/3078700 | 和多志は山形県鶴岡市の出羽三山の麓で農業をしております。霊峰月山からの雪解け水などの恵みを受けて、お米や大豆・柿を栽培しています。 |
| 苺屋佐藤 | 寒河江市 | Conservas | https://www.tabechoku.com/producers/27079 | 🍓夏いちご(夏秋いちご)の生産、いちごの加工品販売 |
| 栗原果樹園 | 東根市 | Frutos secos | https://www.tabechoku.com/producers/23721 | ▶ご挨拶◀ |
| 松栗 | 東根市 | Frutos secos | https://www.tabechoku.com/producers/20962 | 山形県東根市で”美味しい果物で笑顔を世界中に…”をスローガンに果樹栽培を行っております。 |
| oboco grapes | 高畠町 | Vino | https://www.tabechoku.com/producers/29426 | 「oboco grapes」は、デラウェア、シャインマスカット等の大粒ぶどう、ワイン用ぶどうを栽培するぶどう専業農園です。 |
| 山形ゆりあふぁーむ | 三川町 | Pan y cereal | https://www.tabechoku.com/producers/20670 | 山形県の米どころ庄内平野の三川町で、ゆかいな300匹の仲間（カモ）ともにつくる有機栽培のお米と、特別栽培米をつくる楽しい小さな農家です。規模 |
| 儀三郎の無洗米 | 最上町 | Pan y cereal | https://www.tabechoku.com/producers/28384 | 山形県最上町、分水嶺のほど近く。 |
| マルヘイ農園 | 米沢市 | Pan y cereal | https://www.tabechoku.com/producers/20000 | 私はこのお米を作っている専業農家の安部平左ェ門です。 |
| 天童市　東海林農園 | 天童市 | Fruta y verdura | https://www.tabechoku.com/producers/29085 | 山形県天童市で果樹農家をしております |
| 羽柴果樹園 | 東根市 | Fruta y verdura | https://www.tabechoku.com/producers/26048 | 山形県東根市で果樹園を経営しています。 |
| まるたか果樹園 | 東根市 | Fruta y verdura | https://www.tabechoku.com/producers/20877 | はじめまして！まるたか果樹園です。 |
| Farm おとらふ | 寒河江市 | ⚠ por decidir | https://www.tabechoku.com/producers/25319 | ----------------------------------------- |
| あなたの食の帰る場所361° | 山形市 | ⚠ por decidir | https://www.tabechoku.com/producers/23621 | はじめまして！たくさんのページの中から、私たちのページにお越しいただきありがとうございます。 |
| 渡部康貴（よそべい） | 鶴岡市 | ⚠ por decidir | https://www.tabechoku.com/producers/21139 | 與惣兵衛（よそべい）こと渡部康貴です。 |
