# Tokushima — candidatos

- CSV: `data/csv/jp/shikoku/tokushima.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/tokushima> (21 bodegas, leído 2026-08-04). Gremio: 徳島県酒造組合, <https://tokushimasake.com/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Naruto Shuzo | 鳴門酒造 | Naruto |
| Tsukasagiku Shuzo | 司菊酒造 | Mima |
| Tsunomine Shuzo | 津乃峰酒造 | Anan |
| Chikakiyo Shuzo | 近清酒造 | Anan |
| Naka Shuzo | 那賀酒造 | Naka |
| Agawa Shuzo | 阿川酒造 | Tsurugi |
| Karakuchi Shuzo | 可楽智酒造 | Higashimiyoshi |
| Chuwa Shoten | 中和商店 | Miyoshi |
| Kondo Matsutaro Shoten | 近藤松太郎商店 | Tokushima |
| Saito Shuzojo | 斎藤酒造場 | Tokushima |
| Seitama | 勢玉 | Tokushima |
| Sadasaku Shurui Jozojo | 定作酒類醸造場 | Katsuura |
| Nisshin Shurui (Taiko) | 日新酒類 太閤酒造場 | Awa |
| Ise Shuzo | 伊勢酒造 | Yoshinogawa ⚠ |

## Trampas
- ⚠ **La fuente sitúa 伊勢酒造 en 麻植郡山川町, que ya no existe**: se fusionó en
  2004 en 吉野川市 (Yoshinogawa). Wikidata excluye los municipios disueltos, así
  que escribir el nombre viejo deja la fila **sin puerta geográfica** — el audit
  la salta y la cuenta como skipped, no como comprobada (`AGENTS.md`). Misma
  trampa que en `tochigi.md`.
- **三好市 (Miyoshi) y 東みよし町 (Higashimiyoshi)** son dos municipios vecinos, y
  el segundo se escribe en hiragana. No colapsarlos.
- **伊勢酒造 (Tokushima)** no tiene relación con 伊勢萬 (Ise, Mie), en `mie.md`.
- **日新酒類** es un grupo con varias plantas (太閤酒造場 es una de ellas): una
  fila, en el municipio donde produce lo que se vende, no en la sede.

## Qué falta
- Las 7 bodegas restantes del censo.
- Sin abrir, y hay dos frentes de primera: **すだち (sudachi)**, del que Tokushima
  produce en torno al 98% nacional, y **阿波和三盆糖**, el azúcar artesano de
  Awa — quedan poquísimos obradores, todos identificables y con venta directa.
  Además: 鳴門金時 (batata), 半田そうめん, 鳴門わかめ, 阿波尾鶏.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 近藤龍一 | 近藤龍一 | 徳島県美馬市木屋平字森遠552-1　他 | 有機農産物 | 05A-027 |
| 有限会社ハス商会 | （有）ハス商会 | 徳島県勝浦郡勝浦町三渓豊毛本19-1 | 有機加工食品 | 06B-038 |
| 松家安信 | 松家安信 | 徳島県美馬市木屋平字森遠691 | 有機農産物 | 05A-023 |
| 松家繁信 | 松家繁信 | 徳島県美馬市木屋平字森遠342　他 | 有機農産物 | 03A-006 |
| 西村利治 | 西村利治 | 徳島県美馬市木屋平字森遠406 | 有機農産物 | 03A-007 |
| 天田善信 | 天田善信 | 徳島県美馬市木屋平字森遠160　他 | 有機農産物 | 02A-001 |
| 野田ハニー食品工業株式会社 | 野田ハニー食品工業株式会社　本社工場 | 徳島県吉野川市鴨島町内原144番地　他 | 有機加工食品 | 03B-010 |
| 片岡蒟蒻　代表者　片岡　裕也 | 片岡蒟蒻　代表者　片岡　裕也 | 徳島県美馬郡つるぎ町半田字紙屋93番地 | 有機加工食品 | 07B-043 |
| 株式会社　谷食糧 | （株）　谷食糧 | 徳島県名西郡石井町藍畑字高畑1424－8 | 有機加工食品 | 06B-035 |
| 株式会社　ハマヤ四国工場 | 株式会社　ハマヤ四国工場 | 徳島県徳島市東沖州2-26-16 | 有機加工食品 | JH010322PR-0308-0 |
| 梶本　仁章 | 徳島県名西郡石井町高川原字市楽206番地1、206番地2　他 | 徳島県名西郡石井町高川原字市楽206番地1、206番地2　他 | 有機農産物 | 36341100103、6 |
| ＥＭ鳴門生産グループ | 遠藤多喜代 2 他 | 徳島県美馬市脇町拝原1989 他 | 有機農産物 | 2001F-7 |
| 美馬キウイ生産組合　代表者　北岡裕二 | 塩田　勇　他 | 徳島県美馬市つるぎ町半田字日開野30　他 | 有機農産物 | 03A-003 |
| 徳島製麹株式会社 | 徳島製麹株式会社　阿波工場　他 | 徳島県阿波市吉野町柿原字植松180-1　他 | 有機加工食品 | 08B-044 |
| 徳島県陸産缶詰工業(株) | 徳島県陸産缶詰工業(株) | 徳島県阿南市吉井町賀美8 | 有機加工食品 |  |
| 宮田新二 | 宮田新二 | 徳島県勝浦郡勝浦町大字坂本字鍬ノ先15　他 | 有機農産物 | 09A-047 |
| 光食品(株)上板工場 | 光食品(株)　上板工場　他 | 徳島県板野郡上板町高瀬127番3号 他 | 有機加工食品 |  |
| 株式会社　阿波酢造 | 株式会社　阿波酢造　他 | 徳島県勝浦郡勝浦町大字生名字神ノ木52番地1　他 | 有機加工食品 | 09B-048 |
| 株式会社　小川生薬 | 01番製造所 | 徳島県三好市三野町清水1399 | 有機加工食品 | 36489200101 |
| 特定非営利活動法人　里業ランド木頭 | ３番ほ場 | 徳島県那賀郡那賀町木頭西宇字東5 | 有機農産物 | 12A-049 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/tokushima.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
  - **propia** — búsqueda dirigida por producto; ficha o web propia del productor
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 阿波ナチュラルチーズ工房 チーズの灯 | Naruto | Lácteos y quesos | ChFun | — | sin dominio en la fuente; revisado 2026-08-10: la guía no pudo enlazarse con una fuente primaria actual y localización completa |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/tokushima.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/tokushima.php> (nombre, dirección y web propia de cada socio)
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **3 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 和菓子処山陽堂 | 小松島市 | Dulces y repostería | 和菓子協会 | http://komatsushima.ne.jp/sanyodo/ | 小松島市南小松島町 13-27 |
| 日の出楼 | 徳島市 | Dulces y repostería | 和菓子協会 | http://www.hinodero.com/ | 徳島市二軒屋町 1-8 |
| はなぜん | 阿南市 | Té e infusiones | búsqueda dirigida + web propia | https://awabancha-hanazen.co.jp/ | 阿波晩茶 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/tokushima.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/tokushima> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 殖彩 | 小松島市 | Pescado | https://www.tabechoku.com/producers/22762 | 小松島市は生物多様性農業を推進しており、その活動のなかで高品質な有機野菜やネオニコチノイド系農薬の危険性にふれたことを機に専業の有機農家とな |
| 旭物産 | 徳島市 | Pescado | https://www.tabechoku.com/producers/22921 | 徳島の鳴門の水流の速い広い生簀で育てたブランド「すだちぶり」をぜひご堪能ください。私共旭物産は「美味しく、より安全・安心なお魚を皆様に提供し |
| 谷藤農園 | 東みよし町 | Pescado | https://www.tabechoku.com/producers/3078244 | 徳島西部阿波池田近くで農園しています。安心安全をもっとうに生産しています。農業して40年位になります。よろしくお願いします。 |
| 芝原水産 | 鳴門市 | Pescado | https://www.tabechoku.com/producers/22680 | 私は芝原一弘と言います。鳴門の海でわかめ養殖を父の代から初めて50年近くなります。わかめの種苗生産から養殖、収穫、加工,、販売をしていまして |
| 茶園 北地の丘 | 三好市 | Té e infusiones | https://www.tabechoku.com/producers/22999 | 私たち、茶園北地の丘は家族5人で始めた小さな農家です。 |
| 山河農場 | 美波町 | Carne | https://www.tabechoku.com/producers/22774 | 四国は徳島県の南の方、海辺の町の山の中、きれいな川のほとりにて、猪鹿猿と戦いながら、小さな畑でコツコツと、野菜作りをしています |
| 森のきのこ屋 | 徳島市 | Setas | https://www.tabechoku.com/producers/3078097 | きのこを作って40年！原材料から全て国産のきのこを自信を持ってお届けします。ぜひ一度食べてみてください。 |
| 徳島椎茸ファーム | 松茂町 | Setas | https://www.tabechoku.com/producers/29247 | 椎茸嫌いの子供たちにも美味しく楽しく椎茸を食べてもらいたい。 |
| やまのこ農園 | 石井町 | Setas | https://www.tabechoku.com/producers/24238 | 椎茸生産量日本一の徳島県で切磋琢磨しながらより良い椎茸生産を目指しております。 |
| 神山社中 | 神山町 | Setas | https://www.tabechoku.com/producers/23879 | 徳島県神山町でお米と椎茸を中心に、時々野菜も育てています。 |
| NARUMI FARM | 上勝町 | Conservas | https://www.tabechoku.com/producers/23701 | 上勝町の山の上で有機農業をやっています。夏場のミニトマトを中心に有機野菜、トマトピューレ、ハーブティーなどの加工品も作っています。 |
| 三木農園 | つるぎ町 | Pan y cereal | https://www.tabechoku.com/producers/22169 | 私達は標高400ｍの山で昔ながらの農業をしています。急傾斜地の農法が世界農業遺産に認定され私達も雑穀や野菜を作っています。 |
| 田村　周平 | 吉野川市 | Pan y cereal | https://www.tabechoku.com/producers/25284 | 私たちは、兼業農家の若手夫婦で、毎年家族でお米作りに取り組んでいます。 |
| 自然農園マユコベ | 徳島市 | Pan y cereal | https://www.tabechoku.com/producers/24976 | 透きとおる清流、吉野川の恵みをいただきながら活動をしている自然農園マユコベです。化学肥料・農薬・動物性堆肥を使用しないいわゆる「自然栽培」を |
| ますだファーム | 徳島市 | Pan y cereal | https://www.tabechoku.com/producers/3078280 | 徳島県で豊かな自然の中、子どもと共にお米作りを営んでいます。 農家直送でコシヒカリと徳島県奨励米のあきさかりを栽培中です。 美味しいお水と澄 |
| シシトトラ(浅野農園) | 上勝町 | Fruta y verdura | https://www.tabechoku.com/producers/25736 | 「シシトトラ」 |
| 田口農園　徳島 | 東みよし町 | Fruta y verdura | https://www.tabechoku.com/producers/22594 | にし阿波世界農業遺産の紹介 |
| 西村農園（徳島県） | 美馬市 | Fruta y verdura | https://www.tabechoku.com/producers/23934 | 【販売時期のお知らせ】 |
| 吉成農場 | 鳴門市 | Fruta y verdura | https://www.tabechoku.com/producers/29258 | 私たちは江戸時代（1768年）から続く農家です。温暖な気候に恵まれた徳島県鳴門市でさつまいも（なると金時・紅はるか）を生産しています。「安全 |
| 嵯峨峡ファーム | 佐那河内村 | ⚠ por decidir | https://www.tabechoku.com/producers/28788 | 【記憶に残る食材】 |
| 阿波ツクヨミファーム | 阿波市 | ⚠ por decidir | https://www.tabechoku.com/producers/10 | 徳島県北央部にある阿波市。 |
| ニワトリノニワ | 阿波市 | ⚠ por decidir | https://www.tabechoku.com/producers/20978 | 日本の食糧自給率低迷を解決したいとバイオテクノロジー産業から脱サラし農業を始めました。 |
