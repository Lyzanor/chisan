# Osaka — candidatos

- CSV: `data/csv/jp/kansai/osaka.csv` (2 filas: Minoh Beer y Marca Brewing, cerveza). Dedup: ninguna de abajo solapa.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/osaka> (17 bodegas, leído 2026-08-04). Gremio: 大阪府酒造組合, <http://osaka-sake.com/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Akishika Shuzo | 秋鹿酒造 | Nose |
| Goshun | 呉春 | Ikeda ⚠ |
| Kiyotsuru Shuzo | 清鶴酒造 | Takatsuki |
| Kotobuki Shuzo | 寿酒造 | Takatsuki |
| Daimon Shuzo | 大門酒造 | Katano |
| Takashima Shuzo | 高島酒造 | Ibaraki ⚠ |
| Nakao Shuzo | 中尾酒造 | Ibaraki ⚠ |
| Saijo | 西條合資 | Kawachinagano |
| Sakai Meijo | さかい銘醸 | Sakai |
| Kitashoji Shuzoten | 北庄司酒造店 | Izumisano |
| Isaka Shuzojo | 井坂酒造場 | Kishiwada |
| Gancho | 元朝 | Kishiwada |
| Naniwa Shuzo | 浪花酒造 | Hannan |
| Nagataki Shuzo (Yao) | 長瀧酒造 八尾蔵 | Yao |

## Trampas
- ⚠ **茨木市 (Ibaraki, Osaka) no es 茨城県 (Ibaraki, prefectura) ni 茨城町**. Es la
  trampa que ya avisa `ibaraki.md` desde el otro lado, y aquí muerde de verdad:
  dos bodegas de esta tabla están en la Ibaraki equivocada si nadie mira. El
  `area` es Osaka.
- ⚠ **池田市 (Ikeda, Osaka)** convive con 池田町 en Gifu, Nagano y Fukui.
  呉春 es de la de Osaka.
- **中尾酒造 (Ibaraki, Osaka)** no es 中尾酒造店 (Kimino, Wakayama), en
  `wakayama.md`. Y **高島酒造 (Ibaraki, Osaka)** no tiene que ver con 高島市
  (Takashima), que es un municipio de Shiga con tres bodegas en `shiga.md`.
- **秋鹿酒造 (Nose)** cultiva su propio arroz: perfil de terroir, de los que
  suelen salir `verificado` con tienda propia. Empezar el lote por ahí.

## Qué falta
- Las 3 bodegas restantes del censo.
- Osaka es urbana pero no está vacía: sin abrir están **泉州の水なす** (berenjena
  con GI, Kishiwada/Izumisano), 能勢 y 河内 (verdura de montaña), 河内ワイン y
  **柏原の葡萄・ワイン** (zona vitícola histórica, ninguna bodega en el CSV),
  昆布 y 佃煮 de Osaka, 醤油 de Sakai.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| UCC上島珈琲株式会社大阪工場 | UCC上島珈琲株式会社　大阪工場 | 大阪府高槻市辻子3-1-3 | 有機加工食品 | MPJP1461 |
| 有限会社 阪急泉南グリーンファーム | No.7-2ハウス　他 | 大阪府泉南市幡代2005　他 | 有機農産物 | 0411-01 |
| （株）ユニオンコーヒーロースターズ | （株）ユニオンコーヒーロースターズ　他 | 大阪府茨木市豊原町6-10　他 | 有機加工食品 | JU010228PR-0310-0 |
| リボン食品製造（株） | リボン食品製造（株）　第一工場 | 大阪府大阪市淀川区三津屋南3-14-4 | 有機加工食品 | JR020910PR-0559-0 |
| 小西製薬（株）　高井田工場 | 小西製薬（株）　高井田工場 | 大阪府大阪市高井田本通2-5-26 | 有機加工食品 | JU041207PR-0773-2 |
| 株式会社藤原商店 | 株式会社藤原商店 | 大阪府岸和田市田治米町110番地 | 有機加工食品 | 03B-003 |
| 中嶋泰人 | 1　他 | 大阪府交野市私市4丁目113番地　他 | 有機農産物 | 01A-039 |
| カタギ食品株式会社 | カタギ食品株式会社　寝屋川工場　他 | 大阪府寝屋川市石津元町12-8　他 | 有機加工食品 | 第1047号 |
| 日本粉末薬品（株）枚岡工場 | 日本粉末薬品（株）枚岡工場　他 | 大阪府東大阪市宝町13-36　他 | 有機加工食品 | JN040210PR-0756-0 |
| 中尾食品工業（株） | 中尾食品工業株式会社 第一工場 他 | 大阪府堺市西区草部715番地 他 | 有機加工食品 | 2002M-9 |
| 堀田直子 | １ | 大阪府岸和田市塔原町上平10-1 | 有機農産物 | 27-13 |
| ハマヤ株式会社　茨木工場 | ハマヤ株式会社　茨木工場他 | 大阪府茨木市横江2-2-4　他 | 有機加工食品 | JH10322PR-0307-0 |
| 株式会社やまつ辻田 | （株）やまつ辻田　他 | 大阪府堺市中区福田280　他 | 有機加工食品 | 07B-012、07C-012 |
| （株）久保養蜂園 | （株）久保養蜂園 | 大阪府和泉市九鬼町601 | 有機加工食品 | JK010213PR-1032-0 |
| （株）コムズライヴリ　高石工場 | （株）コムズライヴリ　高石工場　他 | 大阪府高石市高師浜丁4-15　他 | 有機加工食品 | JK011127PR-1058-0 |
| 上野農園 | カイト　他 | 大阪府堺市中区深井畑山町169-1　他 | 有機農産物 | 1110-01A |
| 株式会社フリゴ　北港物流センター | 株式会社フリゴ　北港物流センター | 大阪府大阪市此花区北港白津1丁目7番11号 | 有機加工食品 | MPJP1711 |
| 株式会社大和川食産 | 株式会社大和川食産 | 大阪府東大阪市水走4-8-4 | 有機加工食品 | 09B-004 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/osaka.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
- Estado: revisión cerrada el 2026-08-10; **2** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 寿酒造 (國乃長ビール) | Takatsuki | Cerveza | JBA | — | matriz de sake; comprobar duplicado; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| クラフトビアベース | Osaka | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

**Ya integrado, no volver a proponer:** 箕面ビール y Marca Brewing ya están en `osaka.csv`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/osaka.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/osaka.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **35 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 夢菓匠　冨久屋 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.wagashi.org/fukuya/ | 大阪市都島区高倉町 1-7-1 |
| 御菓子司　絹笠 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.honke-kinugasa.jp/ | 大阪市旭区大宮 2-16-9 |
| 鶴屋八幡 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.tsuruyahachiman.co.jp/ | 大阪市中央区今橋 4-4-9 |
| 菊屋 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.kikuya-osaka.jp/ | 大阪市中央区高麗橋 2-2-12 |
| 大阪の駿河屋 | 大阪市 | Dulces y repostería | 和菓子協会 | http://o-surugaya.com/ | 大阪市中央区平野町 1-8-13 |
| 三都屋 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.mitoya-kuromon.com/ | 大阪市中央区日本橋 1-22-21 |
| 浪芳庵 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.rakuten.co.jp/namiyoshi/ | 大阪市中央区難波 4-8-5 |
| 庵月 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.angetsu.co.jp/ | 大阪市中央区東心斎橋 2-8-29 |
| 松葉屋 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.hon-matsubaya.co.jp// | 大阪市天王寺区真法院町 1-14 |
| （株）天王寺源氏堂 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www1.enekoshop.jp/shop/genjidou// | 大阪市天王寺区夕陽丘 4-17 |
| 大阪府生菓子協同組合 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.wagashi-osaka.or.jp/ | 大阪市阿倍野区西田辺町 1-20-12 |
| （有）福田屋 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.noneman.net/ | 大阪市阿倍野区美章園 2-15-12 |
| 浪花餅 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.naniwamochi.com/ | 大阪市阿倍野区阿倍野元町 3-19 |
| 河内駿河屋 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.kawachisurugaya.co.jp/ | 大阪市東住吉区住道矢田 1-22-2 |
| （株）高砂堂 | 大阪市 | Dulces y repostería | 和菓子協会 | http://store.shopping.yahoo.co.jp/takasagodo/ | 大阪市西区本町 1-7-7 |
| 大六堂 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.dairokudo.com | 大阪市大正区三軒家西 3-6-10 |
| 平和堂 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www4.ocn.ne.jp/~heiwadou/ | 大阪市大正区鶴町 2-8-7 |
| 釣鐘屋本舗 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.tsuriganeyahonpo.co.jp/ | 大阪市浪速区恵美須東 1-7-11 |
| 甘泉堂 | 大阪市 | Dulces y repostería | 和菓子協会 | http://wagashi.shop8.makeshop.jp/ | 大阪市西成区花園南 1-4-22 |
| リクロー | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.rikuro.co.jp/ | 大阪市西成区千本北 2-28-10 |
| 千壽堂春蘭 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.geocities.jp/wjwwh948/newpage2.htm | 大阪市生野区舎利寺 2-3-13 |
| 平野郷菓　梅月堂 | 大阪市 | Dulces y repostería | 和菓子協会 | http://baigetudou.com/ | 大阪市平野区平野本町 4-13-4 |
| （株）幸成堂 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.wagashi-kouseido.com/ | 大阪市住之江区北島 3-1-35 |
| 御菓子司　梅屋 | 大阪市 | Dulces y repostería | 和菓子協会 | http://www.umeya-net.com/ | 大阪市城東区新喜多東 1-2-1 |
| （株）浪速育松月 | 大阪市 | Dulces y repostería | 和菓子協会 | http://shogetsu-sweets.jp | 大阪市北区中津 7-8-3 |
| あもや南春日 | 大阪市 | Dulces y repostería | 和菓子協会 | http://amoya.jp/ | 大阪市生野区生野東 4-1-43 |
| 高橋製菓株式会社 | 大阪市 | Aperitivos | 全国米菓工業組合 | http://www.takahashi-seika.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）、米菓生地製造業・販売業 |
| 株式会社法善寺あられ | 大阪市 | Aperitivos | 全国米菓工業組合 | http://www.houzenji-arare.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 株式会社いづみあられ本舗 | 岸和田市 | Aperitivos | 全国米菓工業組合 | http://www.izumiarare.com | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 株式会社山田製菓 | 東大阪市 | Aperitivos | 全国米菓工業組合 | http://www.yamadaseika.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 株式会社井崎商店 | 松原市 | Aperitivos | 全国米菓工業組合 | http://www.izakiarare.com/ | 米菓製造業（菓子卸等へ販売） |
| とよす株式会社 | 池田市 | Aperitivos | 全国米菓工業組合 | http://www.toyosu.co.jp | 米菓製造・販売業（直売所有り）、その他（米菓を含むコメ加工品製造・販売等） |
| 株式会社相生 | 羽曳野市 | Aperitivos | 全国米菓工業組合 | http://www.aioi-rgm.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓販売業（その他菓子を含む卸・小売業） |
| 新興製菓有限会社 | 阪南市 | Aperitivos | 全国米菓工業組合 | https://shinkouseika.square.site/ | 米菓製造・販売業（直売所有り） |
| 辻茂製菓有限会社 | 阪南市 | Aperitivos | 全国米菓工業組合 | http://www.tsujimoseika.com/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）、米菓販売業（その他菓子を含む卸・小売業） |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/osaka.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/osaka> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 大阪最南端漁師 | 岬町 | Pescado | https://www.tabechoku.com/producers/3077779 | 大阪最南端、岬町にて |
| 五十緑農園 | 岸和田市 | Pescado | https://www.tabechoku.com/producers/3078697 | 五十緑農園（いそろく のうえん）は、2024年に親子で農業を始めました。農園の名前は一緒に暮らすウロコインコ「五十緑（いそろく）」の緑鮮やか |
| カネサン | 泉佐野市 | Pescado | https://www.tabechoku.com/producers/3078722 | 大阪・泉州沖で漁を行う漁師です。 |
| みなみがわ農園 | 貝塚市 | Pescado | https://www.tabechoku.com/producers/22643 | はじめまして。みなみがわ農園の南川法子です。大阪府貝塚市在住、大阪市出身。 |
| 健康サポート農園 | 箕面市 | Té e infusiones | https://www.tabechoku.com/producers/24566 | オーガニックレストラン運営時、肥料の種類によってアレルギーがあるという事を知り、土づくりからスタート。健康に良い野菜作りには欠かせない微生物 |
| Hill House | 交野市 | Carne | https://www.tabechoku.com/producers/21277 | ☆生駒山系の麓で養鶏、農園を営んでおります☆ |
| 泉州きくらげ | 泉大津市 | Setas | https://www.tabechoku.com/producers/26684 | 大阪府泉大津市で純国産の農薬不使用のきくらげを栽培しております。 |
| アズマ養蜂場　みつばち農園 | 富田林市 | Miel | https://www.tabechoku.com/producers/22575 | アズマ養蜂場　みつばち農園は、大阪府の南部　金剛山の麓　みかん畑ひろがる里山にあります。創業５６年になる大阪の老舗養蜂場です。 |
| コンパニョーニファームズ | 吹田市 | Legumbres | https://www.tabechoku.com/producers/27355 | 小豆島の蒲生地区にあるオリーブ農園「コンパニョーニ・ファームズ」。荒れ果てていた耕作放棄地を開墾し、2015年に誕生しました。剪定作業をはじ |
| ファームぱんぷりん | 大阪市 | Conservas | https://www.tabechoku.com/producers/21236 | 2010年から和歌山県紀美野町で1.5㌶農園で、葉物、根菜野菜を減農薬,有機肥料栽培で育てる、多品目栽培農園を立ち上げました。現在は紫蘇梅干 |
| 能勢町栗農家　銀まろ | 能勢町 | Frutos secos | https://www.tabechoku.com/producers/25141 | わたしたちは大阪府能勢町に実家を持つ栗農家です。 |
| あやかるハウス | 羽曳野市 | Bebidas sin alcohol | https://www.tabechoku.com/producers/24919 | 袋（バッグ）栽培という方法で、天然由来のオリジナル培地、飲料用の水、こだわりの肥料を使用しフルーツミニトマトの生産をしております。 |
| ハッピーファーム | 羽曳野市 | Vino | https://www.tabechoku.com/producers/25715 | 脱サラして大阪羽曳野市でイチジクを中心に季節のお野菜をつくっています。化学農薬や化学肥料を使わず、微生物や生態系の多様性を利用した、環境に配 |
| 能勢 田口農園 | 能勢町 | Pan y cereal | https://www.tabechoku.com/producers/27772 | 当園は摂津と丹波の国境いに位置する能勢、その山奥の清らかな水、昼夜の寒暖差が大きい気候で、農薬をほとんど使わずに有機肥料で、“毎日口に入れて |
| リバーサイドガーデン | 阪南市 | Pan y cereal | https://www.tabechoku.com/producers/3077187 | 大阪府の南部の阪南市の山あい、6月には蛍の飛び交う川のほとりで、ニンニクと生姜を栽培をしています。医療関係の仕事の経験もあり、健康の基本はた |
| れんげの恵 | 高槻市 | Pan y cereal | https://www.tabechoku.com/producers/3078437 | 大阪・淀川の清らかな水と、れんげの咲く自然豊かな田んぼで３０年以上農薬を使わない有機農法でお米を育てています。 |
| 福田農園（大阪府） | 岸和田市 | Fruta y verdura | https://www.tabechoku.com/producers/23482 | 泉州の水なすの美味しさをより多くの方に知ってほしいと思っています。 |
| ことりはぶどう園 | 泉南市 | Fruta y verdura | https://www.tabechoku.com/producers/24957 | 大阪泉州の土地で |
| アガタ果樹園(ぶどう） | 貝塚市 | Fruta y verdura | https://www.tabechoku.com/producers/22049 | 現在、永年勤務させて頂いたJAを退職後、好きだった農業につける喜びに感謝しています。 |
| 野村ファーム | 交野市 | ⚠ por decidir | https://www.tabechoku.com/producers/21763 | こんにちは。野村ファームの谷本です。 |
| 河内鴨ツムラ本店 | 大阪松原産 | 最高級 国産合鴨肉 | 創業1870年 | 松原市 | ⚠ por decidir | https://www.tabechoku.com/producers/20801 | 創業1870年。大阪松原産、最高級『河内鴨』1日200羽限定で販売しております。 |
| HICOM Smart Farm 泉佐野ファクトリー | 泉佐野市 | ⚠ por decidir | https://www.tabechoku.com/producers/29659 | 私たちは、大阪府泉佐野市の「ハイコムスマートファーム 泉佐野ファクトリー」です。 |
