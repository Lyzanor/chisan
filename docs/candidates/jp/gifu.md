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
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/gifu> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **11 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 4, Carne 3, Pan y cereal 3, Frutos secos 3, Setas 2, Condimentos 2, Sake 1, Miel 1, Té e infusiones 1, Pescado 1, Legumbres 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 原田酒造場 | 高山市 | Sake | productos | 【モンドセレクション16年連続金賞】飛騨高山の最強辛口酒「山車 金印 辛くち · 【ご贈答に！】お祝い事にはこのお酒！「山車 慶祝めでた酒セット」1800ml · 【ご贈答に！】米の旨味がふんわり充実！「山車 特別純米セット」720ml×2 | https://www.tabechoku.com/producers/20929 |  |
| 堀養蜂園 | 瑞浪市 | Miel | ficha | — | https://www.tabechoku.com/producers/20720 |  |
| 成瀬農場 | 瑞浪市 | Té e infusiones | ficha | — | https://www.tabechoku.com/producers/22310 |  |
| きらな農園 | 美濃加茂市 | Setas | ficha | — | https://www.tabechoku.com/producers/3077508 |  |
| なめこファーム飛騨 | 高山市 | Setas | productos | 【朝どれ】【20パック入】『飛騨高山』飛騨ジャンボなめこ約180g×20パッ · 【朝どれ】【4パック入】『飛騨高山』飛騨ジャンボなめこ約180g×4パック入 · 【朝どれ】【10パック入】『飛騨高山』飛騨ジャンボなめこ約180g×10パッ | https://www.tabechoku.com/producers/23897 | repr. 中村朋博 |
| マナの菜園 | 八百津町 | Pescado | ficha | — | https://www.tabechoku.com/producers/25690 |  |
| 東海アグリハウス | 安八町 | Carne | ficha | — | https://www.tabechoku.com/producers/3077786 | 岐阜県安八郡安八町 |
| 菖蒲谷牧場 | 揖斐川町 | Carne | productos | 【１袋１００ｇ入り】脂が甘くてさっぱり★薄切り豚肉１.６kg詰め合わせ。４部 · 脂が甘くてさっぱり！薄切り豚肉１.６kg詰合せ（４部位食べ比べセット） · 豚肩ロース肉 カツ・ステーキ用 ２枚（１００ｇ×２枚） | https://www.tabechoku.com/producers/24485 | premio 食べチョクAWARD; 岐阜県揖斐郡揖斐川町 |
| プラムナチュール | 郡上市 | Carne | ficha | — | https://www.tabechoku.com/producers/26361 | 岐阜県郡上市 |
| 大塚農園 | 岐阜市 | Legumbres | productos | ＜うまっ！＞やみつき必須！うんめえ枝豆！ 1800ｇ · ＜うまっ！＞やみつき必須！うんめえ枝豆！ 900g 【朝どれ】 · ＜うまっ！＞やみつき必須！うんめえ枝豆！ 2700g | https://www.tabechoku.com/producers/21318 |  |
| 恵那どり本舗 | 中津川市 | Condimentos | productos | 【お一人様1回お試しSET】肉質の違いを楽しむ満足セット『恵那どり』もも・む · ＼ジューシーで旨みたっぷり！／岐阜県産 【恵那どり】 もも肉 4kg （冷蔵 · 恵那どりのカット済もも肉 1Kg×3袋（バラ冷凍） | https://www.tabechoku.com/producers/3077894 | repr. 創業：1991年04月 |
| 飛騨山椒 | 高山市 | Condimentos | productos | 【ほどよい辛さと爽やかな香り】山椒屋が作った山椒七味 · 【食のプロが愛する逸品】絶品の山椒・山椒七味 ギフト箱セット · 【ミシュラン店でも販売！】ピリリと痺れる山椒茶漬け（7個入り） | https://www.tabechoku.com/producers/3077628 | repr. 内藤一彦 |
| 川瀬ファーム | 岐阜市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/3078736 |  |
| ななしん米 | 揖斐川町 | Pan y cereal | productos | 【農薬・肥料不使用】優秀金賞受賞！自然栽培米ハツシモ【5kg】【玄米】【令和 · 【農薬・肥料不使用】金賞受賞！自然栽培米ハツシモ【10kg】【玄米】【令和7 · 【農薬・肥料不使用】優秀金賞受賞！自然栽培米ハツシモ【10kg】【玄米】【令 | https://www.tabechoku.com/producers/25909 | 岐阜県揖斐郡揖斐川町 |
| 山田もち店 | 高山市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/23313 |  |
| ひこうきやさい | 各務原市 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/21995 |  |
| 石井養殖 | 大垣市 | Frutos secos | productos | 「骨までやわらか手作り甘露煮」 骨までやわらか。ご飯がすすむ一尾。養殖場の手 · [訳アリ] 骨まで柔らか！ ニジマス甘露煮フレークタイプ 250g x2p · にじます唐揚げ カットタイプ 【お腹も満足 たっぷり500ｇ】 唐揚げ粉付き | https://www.tabechoku.com/producers/21973 | premio 食べチョクAWARD |
| 山猫園 | 恵那市 | Frutos secos | productos | 旨味ぎっしり！完熟大粒生栗1kg · お買い得！訳あり栗1kg · お買い得！訳あり栗2kg | https://www.tabechoku.com/producers/22341 |  |
| Bブリッジ | 岐阜市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24257 |  |
| すけろく自然農園 | 飛騨市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25828 |  |
| つむぎ果樹園 | 高山市 | Fruta y verdura | productos | 【朝どれ】（家庭用） 糖度11度以上 1.5～2.0kg（4-8玉） · 【夏ギフト】👑食べチョクギフトグランプリ2026銅賞👑桃ジェラート（桃６品種 · 【夏ギフト】飛騨の新品種！『つむぎ』 糖度13度以上 1.5kg（4-6玉） | https://www.tabechoku.com/producers/3077268 | repr. 創業：2021年05月 |
| GLÜCK GARTEN | 高山市 | Fruta y verdura | productos | ひとくちで広がるジューシーな甘さ。ニューメロン 2kg · ひとくちで広がるジューシーな甘さ。ニューメロン 800g · 【規格外品】自然栽培の花ズッキーニ 12本 | https://www.tabechoku.com/producers/29596 | repr. 津川　暢彰 |
