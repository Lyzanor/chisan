# Hiroshima — candidatos

- CSV: `data/csv/jp/chugoku/hiroshima.csv` (9 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/hiroshima> (56 bodegas, leído 2026-08-04). Gremio: 広島県酒造組合, <http://www.hirosake.or.jp/>.
- Estado: **9 integradas** el 2026-08-05 (7 `verificado`, 2 `parcial`); quedan 7 de la tabla y ~40 del censo. Evidencia en `data/evidence/jp/chugoku/hiroshima.jsonl`.

**西条 (Saijo), en Higashihiroshima, es una de las tres capitales del sake de
Japón** junto a Nada (Hyogo) y Fushimi (Kioto), con las bodegas alineadas en una
sola calle. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Umeda Shuzojo | 梅田酒造場 | Hiroshima |
| Ikuma Shuzo | 生熊酒造 | Shobara |
| Kitamura Jozojo | 北村醸造場 | Shobara |
| Ono Shuzo | 小野酒造 | Kitahiroshima ⚠ |
| Aseed Brew | アシードブリュー | Fukuyama |
| Kawamoto Eisuke | 川本英介 | Akiota |

## Integradas 2026-08-05 (9) — salidas de la cola de arriba

| bodega | municipio | resultado |
|---|---|---|
| Kamotsuru Shuzo | Higashihiroshima | verificado · venta sí |
| Kamoizumi Shuzo | Higashihiroshima | verificado · venta sí |
| Imada Shuzo Honten | Higashihiroshima | verificado · venta sí |
| Enoki Shuzo | Kure | verificado · venta sí |
| Etajima Meijo | Etajima | verificado · venta sí |
| Nakao Jozo | **Takehara** | verificado · venta sí |
| Kanemitsu Shuzo | Higashihiroshima | verificado · sin carrito |
| Kyokuho Shuzo | Hiroshima | **parcial** · web bloqueada |
| Aihara Shuzo | Kure | **parcial** · sin web |

**El buscador del gremio no sirve**: `hirosake.org/app/service?brewery` se pinta
con JavaScript y en plano no devuelve nada. Hiroshima cuesta como Fukushima, una
búsqueda por bodega — no como Yamagata.

- **Imada Shuzo Honten sale de la bandeja del `README.md`** de esta carpeta: ya
  está en el CSV y no debe volver a proponerse. Su dominio público es el de la
  marca, `fukucho.jp`, no la razón social.
- **Nakao Jozo (Takehara) no estaba en la tabla**: salió del mismo censo al
  cazar dominios. Su web falla por HTTPS con **el certificado de `bizmw.com`, el
  mismo hosting que Morii Shokuhin en Nara**, y responde 200 por HTTP. Ese
  proveedor ya ha dado dos falsos muertos: probar HTTP antes de descartar.
- **旭鳳酒造 devuelve 403 con cuerpo mínimo**: bloqueo de bot, no sitio muerto
  (tercer caso tras Yamahisa). Sin poder leer la ficha se queda `parcial`.
- **相原酒造 (Ugo no Tsuki) no tiene web propia.** Tercer caso del patrón, tras
  Hiroki en Fukushima y Takagi en Yamagata: marcas muy valoradas y sin dónde
  enlazar, todas `parcial`.

## Trampas
- **今田酒造本店 (Imada Shuzo Honten, Higashihiroshima)** ya está en la bandeja
  del `README.md` de esta carpeta: no volver a proponerla como nueva.
- ⚠ **北広島町 (Kitahiroshima, Hiroshima) no es 北広島市 (Kitahiroshima,
  Hokkaido)**. Mismo nombre, 1.400 km. Si la fila se escribe con el municipio a
  secas, el gate geográfico la manda a Hokkaido y es error bloqueante —
  o peor, resuelve al centroide equivocado sin quejarse.
- ⚠ **金光酒造 (Higashihiroshima)** no es 金光酒造 (Yamaguchi-shi), en
  `yamaguchi.md`. Mismo 社名, prefecturas vecinas.
- **アシードブリュー (Fukuyama)** es filial de un grupo de bebidas (Aseed Holdings):
  candidata a descarte por masa, mirar si tiene marca de sake propia.
- **川本英介** es un nombre de persona como razón social: confirmar el nombre
  comercial de la bodega antes de escribir el `nombre` de la fila.
- 西条 es un barrio de 東広島市 (Higashihiroshima), no un municipio; y hay un
  **西条市 (Saijo)** que es una ciudad de Ehime, en `ehime.md`.

## Qué falta
- Las ~43 bodegas restantes del censo, empezando por el resto de la calle de
  Saijo, que son las que tienen tienda y venta online.
- Sin abrir: **牡蠣 (ostra)** — Hiroshima produce en torno al 60% del nacional y
  hay cofradías y criaderos con marca; **レモン de Setoda/Ikuchijima** (casi todo
  el limón japonés); もみじ饅頭 (decenas de obradores en Miyajima), 広島菜漬,
  お好み焼き のソース (Otafuku y las casas pequeñas), 比婆牛.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 株式会社セイコー珈琲 | 株式会社セイコー珈琲　安浦工場 他 | 広島県呉市安浦町大字中畑字堀田迫110-1　他 | 有機加工食品 | MPJP1210 |
| こだま食品株式会社 | こだま食品（株） | 広島県福山市駅家町法成寺1575-9 | 有機加工食品 | 04B-005（05C-007） |
| （株）ますやみそ　他 | （株）ますやみそ　他 | 広島県呉市焼山西2-2-8　他 | 有機加工食品 | 01-015B |
| （株）純正食品マルシマ | （株）純正食品マルシマ　新高山工場　他 | 広島県尾道市新高山3-1170-162　他 | 有機加工食品 | JM80202PR-0250-0 |
| 中国醤油醸造協同組合 | 中国醤油醸造協同組合 | 広島県東広島市河内町中河内190-1 | 有機加工食品 | JC010213PR-0298-0 |
| こだま試験農場株式会社 | 南山1　他 | 広島県世羅郡世羅町大字小国字南山1703-1　他 | 有機農産物 | 07A-030 |
| 株式会社出来商店 | 4号ハウス　他 | 広島県東広島市黒瀬町南方字水越1587　他 | 有機農産物 | SES-20070801 |
| 金光味噌（株） | 金光味噌株式会社出口工場　他 | 広島県府中市出口町1180　他 | 有機加工食品 | 01-006B |
| 株式会社やまみ | 株式会社やまみ　本社工場 | 広島県三原市沼田西町小原字袖掛73-5 | 有機加工食品 | 第1434号 |
| センナリ株式会社 | センナリ株式会社　他 | 広島県広島市安佐北区安佐町大字久地2683-25　他 | 有機加工食品 | 130902-001 |
| 有限会社ニシオカ | 製造所1 | 広島県広島市安佐南区東野3丁目5-3 | 有機加工食品 | 214-002 |
| 桑田　恒二 | 1　他 | 広島県福山市神辺町川北衆御領937-1、6（ハウス含む）　他 | 有機農産物 | 114-010 |
| 早志　健太郎 | 1　他 | 広島県東広島市福富町上竹仁段原山843-13　他 | 有機農産物 | 114-049 |
| 横山　豊富 | 1　他 | 広島県神石郡神石高原町油木乙670　他 | 有機農産物 | 114-072 |
| 寺岡有機農場有限会社 | 世羅A1　他 | 広島県世羅郡世羅町賀茂10144-151　他 | 有機農産物 | 114-078 |
| 豆の木 | 山本1　他 | 広島県安芸高田市吉田町下入江1485　他 | 有機農産物 | 115-010 |
| 引田　義道 | 1　他 | 広島県庄原市東城町竹森751番地　他 | 有機農産物 | 115-023 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/hiroshima.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
  - **propia** — búsqueda dirigida por producto; ficha o web propia del productor
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| マルヒロ水産 | ⚠ | Pescado | propia | namakaki.co.jp | ostra; falta municipio; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/hiroshima.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/hiroshima.php> (nombre, dirección y web propia de cada socio)
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **10 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 鶴屋安芸 | 仙呉市 | Dulces y repostería | 和菓子協会 | http://www.tsuruya-aki.co.jp/ | 仙呉市本通 4-7-8 |
| 銀月堂 | 広島市 | Dulces y repostería | 和菓子協会 | http://www.enjoy.ne.jp/~gingetsudo/ | 広島市中区大手町 5-9-16 |
| 浅野四十二万石本舗　天光堂 | 広島市 | Dulces y repostería | 和菓子協会 | http://www.tenkoudou42.com/ | 広島市中区千田町 2-11-8 |
| ツネモト | 広島市 | Dulces y repostería | 和菓子協会 | http://okabe-bld.co.jp/tunemoto/ | 広島市安佐南区川内 1-18-22 |
| にしき堂 | 広島市 | Dulces y repostería | 和菓子協会 | http://nisikido.lolipop.jp/ | 広島市東区光町 1-13-23 |
| 後藤製菓 | 廿日市市 | Dulces y repostería | 和菓子協会 | http://www.goto-miyajima.com/ | 廿日市市宮島町 1162-2 |
| 藤い屋 | 廿日市市 | Dulces y repostería | 和菓子協会 | http://www.fujiiya.co.jp/ | 廿日市市宮島町 1129 |
| 寺本水産 | ⚠ | Pescado | búsqueda dirigida + web propia | https://www.teramotosuisan.jp/ | ⚠ municipio sin confirmar; ostra de Hiroshima |
| 名原水産 | ⚠ | Pescado | búsqueda dirigida + web propia | https://nabarasuisan.com/ | ⚠ municipio sin confirmar |
| 長船養殖場（かきアイランド） | 坂町 | Pescado | búsqueda dirigida + web propia | https://osafune.com/ | ⚠ 安芸郡坂町; punto de venta propio |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/hiroshima.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/hiroshima> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 石野水産　瀬戸内ちりめん　ひじき | 呉市倉橋町 | Pescado | https://www.tabechoku.com/producers/20429 | 石野水産は広島県最南端のちりめんの網元 |
| 宮原水産 | 呉市倉橋町 | Pescado | https://www.tabechoku.com/producers/21672 | 私たちの会社は、広島県の呉市倉橋町のきらきら光る海でちりめん漁・かき養殖をしている宮原水産です。うちの主人で４代目になります。初代のご先祖様 |
| かなわ海産 | 江田島市 | Pescado | https://www.tabechoku.com/producers/20446 | 【広島かき老舗】かなわは慶応3年（1867年）創業以来、生食用かきのみを生産してまいりました。 |
| ふじい農園 | 神石高原町 | Pescado | https://www.tabechoku.com/producers/23033 | 広島県東部にある神石高原町で、アスパラガスとぶどうを中心に栽培しています。慣行栽培をもとに、なるべく農薬や化学肥料を使わないように栽培してい |
| せんチャンファーム | 三原市 | Té e infusiones | https://www.tabechoku.com/producers/21099 | せんチャンファームのある広島県三原市久井町は標高３７５mの爽やかな高原の地。高原特有の昼夜の寒暖差の中、土作りからこだわり、ミネラル豊富な天 |
| 鶏家すずたろう | 北広島町 | Carne | https://www.tabechoku.com/producers/3079036 | 「食べて笑顔になれる安心安全の卵を目指して」 |
| ながみねファーム | 福山市 | Carne | https://www.tabechoku.com/producers/29270 | ながみねファームは、自然養鶏をベースに循環型農業として自然卵（有精卵）を育む平飼い養鶏農家です。ヒヨコのうちから抗生物質等の薬剤は一切使わず |
| 平田農園 | 広島市 | Miel | https://www.tabechoku.com/producers/29200 | 定年退職後、農業の傍ら一群から養蜂を始める。その後ミツバチに魅せられ日本はちみつマイスターの資格を取得し本格的に養蜂業に参入。地の利を活かし |
| 広島かき愛好会 | 呉市 | Condimentos | https://www.tabechoku.com/producers/3077903 | 私は20代前半のころリクルートに努めておりましたが、広島かき業界・産業に出会い、心打たれました。 |
| あじば農園（食べチョク） | 尾道市 | Dulces y repostería | https://www.tabechoku.com/producers/23484 | 季節のみかん・レモン・レモンケーキ　あじば農園です。 |
| レモンの卵農園 | 大崎上島町 | Huevos | https://www.tabechoku.com/producers/3077862 | レモンの卵農園は、広島県の瀬戸内海にある離島、大崎上島町にあります。 |
| こめ奉行☆やよい | 世羅町 | Pan y cereal | https://www.tabechoku.com/producers/22767 | 広島県世羅町でお米を栽培する生産農家です♪ |
| 内藤精米所 | 呉市安浦町 | Pan y cereal | https://www.tabechoku.com/producers/25572 | 当店では広島県産のお米を専門で取り扱っています |
| あちゅらむ農園 | 安芸高田市 | Pan y cereal | https://www.tabechoku.com/producers/24779 | 実家は兼業農業でお米をつくっていましたが、それはあくまでも自給できる程度のものでした。 |
| 米ファーム　藤原 | 庄原市 | Pan y cereal | https://www.tabechoku.com/producers/3078581 | 広島県庄原市東城町で米農家をしています。 |
| 弘法菜園 | 北広島町 | Fruta y verdura | https://www.tabechoku.com/producers/3077934 | 広島県の寒冷地帯、北広島町大朝から鮮度抜群の新鮮野菜をお届けします。 |
| Remon.Lab | 尾道市 | Fruta y verdura | https://www.tabechoku.com/producers/23795 | 国産レモンの生産量日本一の瀬戸田で柑橘の総合商社として取り組んでいます。 |
| 西屋農園 | 尾道市 | Fruta y verdura | https://www.tabechoku.com/producers/3077314 | 農家一筋60年！ |
| 日本農園 | 廿日市市 | Fruta y verdura | https://www.tabechoku.com/producers/20811 | 皆さんこんにちは。 |
| なちゅbio | 三次市 | ⚠ por decidir | https://www.tabechoku.com/producers/20896 | ◆自己紹介 |
| 大世渡商会 | 呉市上蒲刈 | ⚠ por decidir | https://www.tabechoku.com/producers/20470 | 私達の故郷、広島県呉市蒲刈島！ |
| あおいくま | 福山市 | ⚠ por decidir | https://www.tabechoku.com/producers/27628 | ご覧いただきありがとうごさいます。 |
