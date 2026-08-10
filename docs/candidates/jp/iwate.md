# Iwate — candidatos

- CSV: `data/csv/jp/tohoku/iwate.csv` (6 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/iwate> (22 bodegas, leído 2026-08-04). Gremio: 岩手県酒造組合, <http://www.ginga.or.jp/~syuzou/>.
- Estado: **6 integradas** el 2026-08-05, todas `verificado`, 5 con tienda propia — el mejor ratio de venta directa de la pasada. Evidencia en `data/evidence/jp/tohoku/iwate.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kikunotsukasa Shuzo | 菊の司酒造 | Morioka |
| Sakuragao Shuzo | 桜顔酒造 | Morioka |
| Azumamine Shuzoten | 吾妻嶺酒造店 | Shiwa |
| Tsuki no Wa Shuzoten | 月の輪酒造店 | Shiwa |
| Hirota Shuzoten | 廣田酒造店 | Shiwa |
| Takahashi Shuzoten | 高橋酒造店 | Shiwa |
| Kawamura Shuzoten | 川村酒造店 | Hanamaki |
| Kikuzakari Shuzo | 喜久盛酒造 | Kitakami |
| Iwanoi Shuzo | 磐乃井酒造 | Ichinoseki |
| Ryoban Shuzo | 両磐酒造 | Ichinoseki |
| Iwate Meijo | 岩手銘醸 | Oshu |
| Kamihei Shuzo | 上閉伊酒造 | Tono |
| Senkin Shuzo | 泉金酒造 | Iwaizumi |
| Washinoo | わしの尾 | Hachimantai |

## Integradas 2026-08-05 (6) — todas verificado

| bodega | municipio | resultado |
|---|---|---|
| Nanbu Bijin | Ninohe | verificado · venta sí |
| Sekinoichi Shuzo | Ichinoseki | verificado · venta sí |
| Suisen Shuzo | **Ofunato** ⚠ | verificado · venta sí |
| Akabu Shuzo | **Morioka** ⚠ | verificado · venta sí |
| Hamachidori | Kamaishi | verificado · venta sí |
| Asabiraki | Morioka | verificado · sin carrito |

⚠ **Dos de las seis cambiaron de municipio por el tsunami de 2011**, y el
candidato las daba en el sitio antiguo:
- **酔仙酒造** era de Rikuzentakata; aquel kura fue destruido y hoy elabora en el
  Ofunato-gura. La fila toma **Ofunato**, porque el área es donde se produce.
- **赤武酒造** era de Otsuchi y se reconstruyó en **Morioka**.

Es el segundo caso de sede contra planta tras Niizawa en `miyagi.md`, y aquí
son dos de seis: **en la costa de Tohoku hay que confirmar el municipio actual
antes de escribir la fila**, no dar por buena la dirección histórica.

- **世嬉の一 elabora sake y la cerveza Iwate Kura en el mismo recinto**: una sola
  fila, con la categoría que pesa, como ya se decidió para Kiuchi en `ibaraki.md`.
- **Cinco de seis con tienda propia** es el mejor ratio de venta directa de toda
  la pasada. La costa de Iwate vende online porque su mercado local se hundió.

## Trampas
- **紫波町 (Shiwa) concentra cuatro bodegas** con apellidos frecuentes
  (高橋, 廣田): casar por 社名 completo, no por apellido.
- 世嬉の一 hace además cerveza (いわて蔵ビール) en la misma casa: es **una fila**,
  no dos, con la `categoria` que pese.

## Qué falta
- Las ~8 bodegas restantes del censo.
- Sin abrir: wanko-soba y fideos de Morioka, 南部鉄器 (no alimentario), lácteos de
  Kuzumaki, marisco de Sanriku, 醤油/味噌 de Hanamaki.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 有限会社旭農園 | 1　他 | 岩手県北上市和賀町岩崎新田曙2-1　他 | 有機農産物 | AFASSEQ-AA-010821 |
| 株式会社丸越 | 本社保冷庫　他 | 岩手県一関市花泉町金沢字運南田171-1　他 | 有機加工食品 | JM021210PR-0810-0 |
| 有限会社阿部農産 | 1　他 | 岩手県胆沢郡金ヶ崎町永沢迎谷起30　他 | 有機農産物 | AFASSEQ-AA-050813 |
| 大東町有機農産物等生産組合 | 小島幸喜　1　他 | 岩手県一関市大東町沖田字大住110　他 | 有機農産物 | S-029 |
| 東日本産業（株） | 東日本産業（株）原料倉庫　他 | 岩手県紫波郡紫波町犬渕字谷地田116-7他 | 有機加工食品 | JH030212PR-0597-0 |
| 公益社団法人藤沢農業振興公社 | 手づくり（有）館ヶ森ハム工房　1他 | 岩手県一関市藤沢町黄海字衣井沢山44番地1 他 | 有機農産物 | 2003F-9 |
| 無天塾 | 家の前1 他 | 岩手県盛岡市下田字生出90-1-イ　他 | 有機農産物 | NA-09033001 |
| しずくいし環境にやさしい稲作の会　代表 滝沢藤七 | 志戸前-１、他 | 岩手県岩手郡雫石町御明神４-１０３-４０５、他 | 有機農産物 | OA-11-298-08 |
| マル庄　代表　庄司敬介 | 4-1 | 岩手県滝沢市鵜飼安達176番1 | 有機農産物 | OA-17-293-11 |
| 株式会社　いわき農園 | 荒川ハウス1号（荒川1号）　他 | 岩手県下閉伊郡山田町荒川3地割69番地　他 | 有機農産物 | 600606P125 |
| 農事組合法人　アグリ笹森 | 農事組合法人　アグリ笹森 | 岩手県奥州市水沢笹森谷地32-1,32-2 他 | 有機農産物 | 600606P133 |
| 有限会社　かさい農産 | 弥栄1-1 他 | 岩手県一関市弥栄字上谷起51-1 他 | 有機農産物 | 600606P142 |
| 一般社団法人　すばる | 前森山畑⑦ | 岩手県八幡平市田頭13-7 | 有機農産物 | OA-22-122-13 |
| 太子食品工業株式会社　雫石工場 | 太子食品工業株式会社　雫石工場 | 岩手県岩手郡雫石町長山林ノ沢111−1 | 有機農産物 | FFJP9277 |
| 株式会社太極舎 | 暁ブルワリー　八幡平ファクトリー | 岩手県八幡平市松尾寄木1-474-6 | 有機加工食品(酒類を含む) | J13B-2224 |
| 株式会社 岩泉きのこ産業 | 落合（1号棟～10号棟）他 | 岩手県下閉伊郡岩泉町浅内字下栗畑68-11 他 | 有機農産物 | A23-030901 |
| 株式会社一関山本農場 代表取締役　山本佳範 | 652 他 | 岩手県一関市中里字上大林520-1、2　他 | 有機農産物 | S-255 |
| 農事組合法人みずほ | 1 他 | 岩手県花巻市野田553番地 | 有機農産物 | S-332 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/iwate.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **2** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 田野畑山地酪農牛乳 milk port NAO | Tanohata | Lácteos y quesos | ChFun | yamachi.jp | revisado 2026-08-10: la guía no pudo enlazarse con una fuente primaria actual y localización completa |
| たまやま温泉Lab | Morioka | Lácteos y quesos | ChFun | — | sin dominio en la fuente; revisado 2026-08-10: la guía no pudo enlazarse con una fuente primaria actual y localización completa |

**Ya integrado, no volver a proponer:** 世嬉の一酒造 ya está en `iwate.csv`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/iwate.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/iwate.php> (nombre, dirección y web propia de cada socio)
- Estado: **4 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 松栄堂 | 一関市 | Dulces y repostería | 和菓子協会 | http://www.shoeidoh.co.jp/ | 一関市地主町 3-36 |
| 菓子処おざわ | 一関市 | Dulces y repostería | 和菓子協会 | http://www.echna.ne.jp/~okashi | 一関市花泉町字地平 17-23 |
| 三陸菓匠さいとう | 大船渡市 | Dulces y repostería | 和菓子協会 | http://www.saitoseika.co.jp/ | 大船渡市大船渡町台 26-18 |
| 大丸屋 | 盛岡市 | Dulces y repostería | 和菓子協会 | http://www.e-daimaruya.com/ | 盛岡市本町通 1-9-42 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/iwate.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/iwate> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 中野圭 | 大船渡市 | Pescado | https://www.tabechoku.com/producers/26287 | 岩手県大船渡市は越喜来（おきらい）崎浜（さきはま）という小さな港町で漁業を営んでおります。 |
| 魚武 | 田野畑村 | Pescado | https://www.tabechoku.com/producers/27172 | 岩手県北三陸田野畑で先祖代々漁師の家系で育ち私も幼い頃から父親と漁に出ていました。 |
| サンファーム | 盛岡市 | Pescado | https://www.tabechoku.com/producers/22314 | 他の生産者が栽培していない様々な品種のりんご、スイートネクタリン、さくらんぼ、ベリーなどを栽培しています。「土作りから丸ごと岩手」をコンセプ |
| 柿木畜産 | 久慈市 | Carne | https://www.tabechoku.com/producers/22389 | 岩手県が発祥の「短角和牛」を育てています。この地が育んだ牛に、この地の食べものを与え、この地ならではの最高の短角和牛を目指し日々挑戦しており |
| うたがき優命園 | 奥州市 | Carne | https://www.tabechoku.com/producers/28385 | 20代で首都圏から岩手県の里山地域に移住して平飼い養鶏をはじめて、平飼い養鶏歴30年の夫婦です。現在は、20代の後継者や研修生と共に5人体制 |
| しあわせ牧場 | 宮古市 | Carne | https://www.tabechoku.com/producers/21360 | 365日ずーっと自然放牧で牛、ヤギ、羊を育てています。人間はできる限り自然のまま自由に生きる彼らを見守ります。 |
| 安比まいたけ | 八幡平市 | Setas | https://www.tabechoku.com/producers/28175 | 安比高原の麓にて、自然の雨風を受けながら自然の栽培環境にこだわった手作りのまいたけ栽培を始めて40年。小規模ながら何度も全国的なTV、新聞に |
| 安俱里まほら岩手 | 盛岡市 | Setas | https://www.tabechoku.com/producers/25815 | 私たちは、”本州一寒い”といわれる「薮川」という地域で、原木きのこを主体とし、農産物の生産を行っております。冬は氷点下20度になることもしば |
| 長瀬農園 | 軽米町 | Setas | https://www.tabechoku.com/producers/3077472 | 岩手県で、春は岩手県産の天然ふきのとう、天然の山ウド、こごみ、あいこ、の山菜、秋は松茸、香茸をネット販売しております。 |
| ハチミツ農家YoYo | 盛岡市 | Miel | https://www.tabechoku.com/producers/3078424 | 盛岡市の郊外、のどかな田園に囲まれた小さな農園で畑作と養蜂を営んでいます。 |
| 巣鴨養蜂園 | 西和賀町 | Miel | https://www.tabechoku.com/producers/20076 | 雑味のない天然のはちみつの良さを、できるだけ多くの皆様にお届けしたいという思いで、故郷の岩手県西和賀町で巣箱つくりから瓶詰めまで、すべて手作 |
| ほそかわ農園 | 矢巾町 | Legumbres | https://www.tabechoku.com/producers/24231 | 岩手県の矢巾町という小さな町で【ミニトマト】【落花生】を中心に農園を営んでいるほそかわ農園と申します。代々この地で農家を営んできて私は9代目 |
| 佐々研山葵農園 | 岩泉町 | Condimentos | https://www.tabechoku.com/producers/29417 | 誰も知らない、日本一の畑わさび産地。 |
| いわいずみ和做美 | 岩泉町 | Condimentos | https://www.tabechoku.com/producers/3077939 | 岩手県北東部に位置する岩泉町は、北上山地の豊かな自然に抱かれた、清流と緑あふれる町です。この恵まれた環境こそが、香り高く、上質な畑わさびを育 |
| 岩手　牧草の丘 | 金ケ崎町 | Lácteos y quesos | https://www.tabechoku.com/producers/26782 | 戦後　先祖が入植開墾開拓し、原生林だった大地を現在では、豊かな肥沃な広大な農地となり、酪農を中心に頑張っております。自治会活動も盛んで全国豊 |
| 米農家　仁左ェ門 | 滝沢市 | Pan y cereal | https://www.tabechoku.com/producers/20510 | 平成7年から現在まで、岩手県で「アイガモ農法」による農薬・化学肥料不使用のお米を作っています。 |
| タカハシ農園 | 花巻市 | Pan y cereal | https://www.tabechoku.com/producers/3077889 | 岩手花巻で１３代続く稲作農家です。こだわりをもって栽培したお米をみなさんに直接お届けしたいと思い、直販をスタートしました。 |
| 太陽商会 | 花巻市 | Pan y cereal | https://www.tabechoku.com/producers/21008 | 宮沢賢治の故郷イーハトーブ花巻で、有機肥料とEM（有用な微生物群）活用による米・小麦・野菜を中心とした農産物を生産している農業生産法人です。 |
| 上小田代 | 奥州市 | Fruta y verdura | https://www.tabechoku.com/producers/24141 | 岩手県奥州市の農業法人です。古く江戸時代、寛政の時代からつづく農家。 |
| 由井野菜園 | 滝沢市 | Fruta y verdura | https://www.tabechoku.com/producers/20631 | 生まれ育った町、岩手県滝沢市で２０１６年から農業を始めました。北に岩手山、東に姫神山が見える素敵な場所で夫婦２人で農薬・化学肥料を使わずに旬 |
| やんべファーム | 盛岡市 | ⚠ por decidir | https://www.tabechoku.com/producers/20883 | 昨年も、多くの方々にご注文頂きありがとうございましたm(_ _)m |
| またくるファーム | 盛岡市 | ⚠ por decidir | https://www.tabechoku.com/producers/24711 | いらっしゃいませ！ |
