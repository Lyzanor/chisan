# Gifu — candidatos

- CSV: `data/csv/jp/chubu/gifu.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/gifu> (58 bodegas, leído 2026-08-04). Gremio: 岐阜県酒造組合, <http://www.gifu-sake.or.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Oita Shuzoten | 老田酒造店 | Takayama |
| Kawajiri Shuzojo | 川尻酒造場 | Takayama |
| Kaba Shuzojo | 蒲酒造場 | Hida |
| Otsubo Shuzoten | 大坪酒造店 | Hida |
| Okuhida Shuzo | 奥飛騨酒造 | Gero |
| Iwamura Jozo | 岩村醸造 | Ena |
| Ena Jozo (Sango) | 恵那醸造 三郷工場 | Ena |
| Ena Jozo | 恵那醸造 | Nakatsugawa |
| Ohashi Shuzo | 大橋酒造 | Nakatsugawa |
| Adachi Shuzo | 足立酒造 | Gifu |
| Ikedaya Shuzo | 池田屋酒造 | Ibigawa ⚠ |
| Otsuka Shuzo | 大塚酒造 | Ikeda ⚠ |
| Kikukawa | 菊川 | Kakamigahara |
| Gyokusendo Shuzo | 玉泉堂酒造 | Yoro |

## Trampas
- ⚠ **池田屋酒造 (Ibigawa, Gifu)** no es 池田屋酒造 (Itoigawa, Niigata), la de
  謙信, ya en `niigata.md`. Mismo 社名, dos empresas.
- ⚠ **大塚酒造 (Ikeda, Gifu)** no es 大塚酒造 (Komoro, Nagano), ya en `nagano.md`.
  Misma trampa. Y **池田町 (Ikeda)** existe además en Nagano y Fukui.
- **恵那醸造 son dos entradas y una empresa**: sede en Nakatsugawa y 三郷工場 en
  Ena. Una fila, en el municipio donde produce — no dos.
- **`mino` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español (`AGENTS.md` de Japón): las filas de 美濃市 pasan
  el gate sin tocar nada.
- 揖斐郡 y 養老郡 no son municipio: la fila lleva el 町.

## Qué falta
- Las ~44 bodegas restantes del censo, y **Hida/Takayama concentra las más
  visitables** (varias con tienda propia y venta online: pool de alto valor).
- Sin abrir: **飛騨牛** (una de las tres grandes carnes de Japón, con marca
  registrada y ganaderías identificables), 富有柿 de Motosu, 朴葉味噌, 鮎 del
  Nagara (pesca con cormorán, patrimonio), 和菓子 de Gifu, 岐阜提灯 (no alimentario).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 成瀬三郎 | 成瀬三郎1号　他 | 岐阜県瑞浪市日吉町5579　他 | 有機農産物 | JN060822FA-1297-0 |
| 株式会社真誠 | 株式会社真誠インダストリアル・パーク関ヶ原工場 他 | 岐阜県不破郡関ヶ原町玉1565-10　他 | 有機加工食品 | 23-05 |
| 岐阜県しょうゆ協業組合 | 岐阜県しょうゆ協業組合 | 岐阜県恵那市武並町竹折451 | 有機加工食品 | JI000612-PRO0169-1 |
| コスモスライクス（株） | コスモスライクス（株）他 | 岐阜県可児市西帷子字東野571他 | 有機加工食品 | 07-046B |
| 稲葉ピーナツ株式会社 | 稲葉ピーナッツ（株）第１、第３工場　他 | 岐阜県岐阜市六条大溝4-2-5　他 | 有機加工食品 | JI000925PR-0063-0 |
| 有限会社久世食品 | 本社工場 他 | 岐阜県岐阜市東島4丁目10番13号 他 | 有機加工食品 | 2003M-3 |
| 岐阜県立恵那農業高等学校 | 1 | 岐阜県恵那市大井町2625-17 | 有機農産物 | 21-02 |
| 株式会社センコー技研 | 大野工場　他 | 岐阜県揖斐郡大野町加納223-1 | 有機加工食品 | MPJP1617 |
| 株式会社お茶の玉露園 | （株）お茶の玉露園　第一工場　他 | 岐阜県羽島郡岐南町上印食3-67-1　他 | 有機加工食品 | 2013M-1 |
| ネオナチュラル母袋有機農場 | C1 他 | 岐阜県郡上市大和町栗巣1077　他 | 有機農産物 | JN130402FA-1268-4 |
| 株式会社谷田商店 | 株式会社谷田商店 工場 | 岐阜県揖斐郡池田町段貝籠232 | 有機加工食品 | 21-08 |
| 株式会社瑞草園 | 本社工場 他 | 岐阜県揖斐郡池田町六之井659 他 | 有機加工食品 | 21-09 |
| アイガモ稲作研究会 | 1 他 | 岐阜県羽島市桑原町大須4-45-1 | 有機農産物 | 21-10 |
| 兼松宣仁 | 1 他 | 岐阜県各務原市蘇原月丘町4-1-3 他 | 有機農産物 | 21-11 |
| 株式会社ポテンシャル農業研究所 | 1 他 | 岐阜県高山市一之宮町1776-2 | 有機農産物 | 21-12 |
| 有限会社山藏農園 | 有限会社山藏農園 | 岐阜県高山市江名子町７６７　他 | 有機農産物 | 15-003 |
| 株式会社中津川サラダ農園 | 株式会社中津川サラダ農園 | 岐阜県中津川市駒場1944 | 有機農産物 | 160831-001 |
| 小林生麺株式会社 | 製造所1　他 | 岐阜県岐阜市白山町1－22　他 | 有機加工食品 | 217－004 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/gifu.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/gifu.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/gifu.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **13 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 槌屋 | 大垣市 | Dulces y repostería | 和菓子協会 | http://www.kakiyokan.com/ | 大垣市俵町 39 |
| 金蝶園総本家 | 大垣市 | Dulces y repostería | 和菓子協会 | http://www.kinchouen.co.jp/ | 大垣市高屋町 1-17 |
| 銘豊製菓園 | 山県市 | Dulces y repostería | 和菓子協会 | http://www.ne.jp/asahi/wagashi/meihouen/ | 山県市高富 2106 |
| 肉桂餅本舗　いげたや | 池田町 | Dulces y repostería | 和菓子協会 | http://www.igetaya.jp/ | 揖斐郡池田町池野 496 |
| 御菓子処　梅乃井 | 笠松町 | Dulces y repostería | 和菓子協会 | http://www.kasamatsu.or.jp/shop/umenoi/index.html | 羽島郡笠松町西金池町 11 |
| パティスリー小菊　四ツ角屋 | 笠松町 | Dulces y repostería | 和菓子協会 | http://www.kasamatsu.or.jp/shop/kogiku/index.html | 羽島郡笠松町八幡町 64 |
| 御菓子司　小梅 | 笠松町 | Dulces y repostería | 和菓子協会 | http://wagashi-koume.jp/ | 羽島郡笠松町長池 287 |
| 松栄堂本舗 | 笠松町 | Dulces y repostería | 和菓子協会 | http://www.kasamatsu.or.jp/shop/syoeido/index.html | 羽島郡笠松町美笠通 3 |
| 兆司家 | 笠松町 | Dulces y repostería | 和菓子協会 | http://www.kasamatsu.or.jp/shop/chouziya/index.html | 羽島郡笠松町桜町 77-1 |
| 株式会社福あられ本舗 | 岐阜市 | Aperitivos | 全国米菓工業組合 | https://www.matsufuku.co.jp | 米菓製造業（菓子卸等へ販売） |
| だるま堂製菓株式会社 | 本巣市 | Aperitivos | 全国米菓工業組合 | http://www.tanigumi-arare.com | 米菓製造・販売業（直売所有り） |
| 塗壁製菓合名会社 | 羽島市 | Aperitivos | 全国米菓工業組合 | http://www.nurikabeseika.co.jp | 米菓製造業（菓子卸等へ販売） |
| 森白製菓株式会社 | 羽島市 | Aperitivos | 全国米菓工業組合 | https://morihaku.co.jp/ | 米菓製造・販売業（直売所有り） |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/gifu.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/gifu> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| マナの菜園 | 八百津町 | Pescado | https://www.tabechoku.com/producers/25690 | 私たちは、魚と野菜をいっしょに育てる「アクアポニックス」という農法で、栽培期間中は農薬や化学肥料を使わない安心して食べられる野菜を皆さまにお |
| 石井養殖 | 大垣市 | Pescado | https://www.tabechoku.com/producers/21973 | 初めまして、石井養殖🐟の石井優二です。 |
| 原田酒造場 | 高山市 | Pescado | https://www.tabechoku.com/producers/20929 | 飛騨高山の古い街並「上三之町」で「飛騨の酒 山車」という日本酒を醸造販売しております。江戸末期創業で現社長の私で10代目になります。「旨い酒 |
| 成瀬農場 | 瑞浪市 | Té e infusiones | https://www.tabechoku.com/producers/22310 | 岐阜県瑞浪市で茶園を経営しています。 |
| 恵那どり本舗 | 中津川市 | Carne | https://www.tabechoku.com/producers/3077894 | 「恵那どり」は、岐阜県中津川市に本社を構える地元企業トーノーデリカグループが開発した独自の銘柄鶏です。 |
| 菖蒲谷牧場 | 揖斐川町 | Carne | https://www.tabechoku.com/producers/24485 | 《岐阜の自然が育てた、お米育ち豚》 |
| プラムナチュール | 郡上市 | Carne | https://www.tabechoku.com/producers/26361 | プラムナチュールは昔ながらの自然製法にこだわり、ひとつひとつ手作業で |
| 東海アグリハウス | 安八町 | Setas | https://www.tabechoku.com/producers/3077786 | 資材販売に農業部門を新たに設置して椎茸栽培を始めました。肉厚なのはもちろん、ぎゅ！と詰まった椎茸を栽培しています。 |
| きらな農園 | 美濃加茂市 | Setas | https://www.tabechoku.com/producers/3077508 | 岐阜県美濃加茂市の自然豊かな環境のもと「しいたけ」「まいたけ」を限りなく天然に近い状態で育てております。「原木」で育て上げた木の子達は「旨味 |
| なめこファーム飛騨 | 高山市 | Setas | https://www.tabechoku.com/producers/23897 | 🍄 安心安全な原材料。飛騨地方産100％の原木から作られたおが粉と上質な飛騨高山の地下水を使用。 |
| 堀養蜂園 | 瑞浪市 | Miel | https://www.tabechoku.com/producers/20720 | 岐阜県東濃地域にて定置養蜂をおこなっております。山々に囲まれた自然豊かな地域で、みつばちと共に暮らし、はちみつの生産を行なっています。季節と |
| 大塚農園 | 岐阜市 | Legumbres | https://www.tabechoku.com/producers/21318 | 岐阜のブランド枝豆を夏に、秋蒔きほうれん草を冬に、代々に渡り生産しています。味にこだわり、安全安心にこだわり、伝統ある栽培方法をゼロベースか |
| Bブリッジ | 岐阜市 | Legumbres | https://www.tabechoku.com/producers/24257 | 私たちは外国人と日本人が知恵と情熱を降り注ぎ、土作りを大切に「ぎふ清流GAP認証」を取得し、栄養価が高く安全安心な野菜作りに日々邁進しており |
| 飛騨山椒 | 高山市 | Condimentos | https://www.tabechoku.com/producers/3077628 | 岐阜県奥飛騨温泉郷（旧上宝村）に代々伝わる山椒の生産から加工、販売までを一貫して行っています。 |
| 山猫園 | 恵那市 | Frutos secos | https://www.tabechoku.com/producers/22341 | 岐阜県の恵那市と中津川市で栗を栽培しています。 |
| ななしん米 | 揖斐川町 | Pan y cereal | https://www.tabechoku.com/producers/25909 | 岐阜県揖斐郡で農薬・肥料不使用のハツシモと緑米を自然栽培しています。私たちが育てるお米は一貫して自家生産にこだわり、種まきから収穫まですべて |
| すけろく自然農園 | 飛騨市 | Pan y cereal | https://www.tabechoku.com/producers/25828 | 飛騨の豊かな自然に負荷をかけないよう配慮し、様々な生き物や草と一緒に野菜を栽培しています。主に雑穀、豆類、食用ほおずきが中心です。愛知県江南 |
| 山田もち店 | 高山市 | Pan y cereal | https://www.tabechoku.com/producers/23313 | 岐阜県の飛騨高山でもち米メインの米農家をしています！ |
| ひこうきやさい | 各務原市 | Fruta y verdura | https://www.tabechoku.com/producers/21995 | 岐阜県各務原市にて、クリーンルーム水耕栽培による農薬不使用の安心して食べて頂ける作物づくりを目指しています。 |
| つむぎ果樹園 | 高山市 | Fruta y verdura | https://www.tabechoku.com/producers/3077268 | つむぎ果樹園では「飛騨のたからもも」という名で地域商社と共同でブランディングを行い桃を栽培、販売しています。 |
| 川瀬ファーム | 岐阜市 | ⚠ por decidir | https://www.tabechoku.com/producers/3078736 | こんにちは😊 |
| GLÜCK GARTEN | 高山市 | ⚠ por decidir | https://www.tabechoku.com/producers/29596 | こんにちは、GLÜCK GARTENです。 |
