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
| 原口園（扶桑庵） | ⚠ | Té e infusiones | búsqueda dirigida + web propia | https://haraguchien.co.jp/ | ⚠ `/pages/company` da 福岡市博多区, que es la sede: el té es de Yame. Falta situar la unidad productiva antes de escribir la fila |
| 山口製茶園（茶幸庵） | ⚠ | Té e infusiones | búsqueda dirigida + web propia | https://www.chakouan.com/ | ⚠ municipio sin confirmar |
| 牛島製茶 | 八女市 | Té e infusiones | búsqueda dirigida + web propia | https://www.yame.co.jp/ | 八女茶, 1921 |
| 古賀製茶本舗 | 八女市 | Té e infusiones | búsqueda dirigida + web propia | https://koganoyamecha.co.jp/ | 八女茶 |
| 浅野園 | 大牟田市 | Té e infusiones | búsqueda dirigida + web propia | https://www.asanoen.com/ | 製造直売 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/fukuoka.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/fukuoka> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **20 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 7, Té e infusiones 3, Setas 2, Carne 2, Pan y cereal 2, Destilados y licores 1, Miel 1, Huevos 1, Pescado 1, Legumbres 1, Condimentos 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| いりえさんちの野菜 | 那珂川市 | Destilados y licores | productos | 博多の赤玉ねぎ 福岡産 1.9kg · 博多の赤玉ねぎ 福岡産 4.9kg · 博多の玉ねぎ2種類【玄海丸、レッドスター】4.9kg | https://www.tabechoku.com/producers/3077818 |  |
| 須田養蜂場 | 豊前市 | Miel | productos | 春の完熟はちみつ 里山 1kg【非加熱・国産はちみつ】福岡県豊前市産 · 春の完熟はちみつ 里山 1kg 2本セット【非加熱・国産はちみつ】福岡県豊前 · 春の完熟はちみつ 里山 450g【非加熱・国産はちみつ】福岡県豊前市産 | https://www.tabechoku.com/producers/23375 |  |
| たつみ園 | 八女市 | Té e infusiones | productos | 【新茶】八女茶｜玉露入り煎茶ティーバッグ30個入３袋セット｜毎日たっぷり楽し · 常連さん人気｜八女茶お得な5本セット · 【✨リピーター様率No1✨新茶】たつみ園の八女茶白折300ｇ３本セット！ | https://www.tabechoku.com/producers/22353 |  |
| グリーンワールド八女 | 八女市 | Té e infusiones | productos | 【ネコポス便】（国産）お茶 八女抹茶入水出し煎茶ティーバッグ75g（5g×1 · 【ネコポス便】無添加‼ 国産青汁緑茶！ スティックタイプ【1g×11包×4袋 · 【国産】お茶 八女抹茶入水出し煎茶ティーバッグ75g（5g×15P） | https://www.tabechoku.com/producers/21484 | premio 食べチョクAWARD |
| お茶の千代乃園 | 八女市 | Té e infusiones | productos | 春陽100ｇ×3+白折（月）100ｇ×3 · 茶の道40年の園主が育てた八女茶【上級煎茶：深雪】100ｇ×4袋 クリックポ · 八女茶を全国へ！煎茶春陽と深雪と白折(月)のセット | https://www.tabechoku.com/producers/20127 | repr. 創業：1981年01月; premio 食べチョクAWARD |
| やまもり養鶏場 | うきは市 | Huevos | productos | 【夏ギフト】塩で食べる卵かけご飯🍚やまもりたまご【20個入】白身の甘みを味わ · 【朝市限定】【お塩で食べられる🐣🍚卵かけご飯】やまもりたまご【30個入】白身 · 【朝市限定】【塩で食べる卵かけご飯🍚】やまもりたまご【20個入】白身の甘みを | https://www.tabechoku.com/producers/22408 | premio 食べチョクAWARD |
| 博多すぎたけ商店（ドリームマッシュ） | 大木町 | Setas | productos | 冷凍『しめじ』＆『えのき』セット各500g 独自冷凍技術で風味食感そのまま！ · お得な冷凍きのこ４種セット(各500g×4種) 独自冷凍技術で風味食感そのま · 冷凍『博多すぎたけ』＆『しめじ』セット各500g 独自冷凍技術で風味食感その | https://www.tabechoku.com/producers/22849 |  |
| K.ファーム | 糸島市 | Setas | ficha | — | https://www.tabechoku.com/producers/3078320 | repr. 河野将太 |
| マサエイ水産加工 | 宗像市 | Pescado | productos | 【お得な定期便限定】宗像のあかもく１０個＋２個 （増量） · 【おまけ付き】 宗像のあかもく☆１０個＋１個（増量） · 【春の海藻生活はじめよう。】宗像のあかもく１５個 ネバネバ海藻 | https://www.tabechoku.com/producers/21079 | repr. 代表取締役　正好　輝旭; premio 食べチョクAWARD |
| 肉のたかむく | 柳川市 | Carne | productos | 黒毛和牛 焼ハンバーグ 10個セット (150g×10個) 和風ソース (1 · 馬刺し！！熊本県自家牧場産！！特選霜降240g＋醤油48㎖ · 【数量限定】九州産 黒毛和牛 切り落とし 1.2kg (600g×2パック) | https://www.tabechoku.com/producers/21540 | premio 食べチョクAWARD |
| 【博多黒毛和牛】あか村総本家 | 赤村 | Carne | productos | 【中毒性ある憧れの塊肉】一度はやってみたかった贅沢の極み『極厚ポンドステーキ · 【一度で何度も美味しい絶大なる人気】数種類の部位が入った赤字覚悟のお得セット · 【みんなが喜ぶ揺るぎない王道ステーキ】根強い人気を誇る厚切りステーキあか村黒 | https://www.tabechoku.com/producers/3077218 | 福岡県田川郡赤村 |
| 能古島おがわ農園 | 福岡市 | Legumbres | productos | 落花生の風味がそのまま！ピーナッツもやし 800g · 落花生の風味がそのまま！ピーナッツもやし 300g · 落花生の風味がそのまま！ピーナッツもやし 500g | https://www.tabechoku.com/producers/21006 | repr. 創業：2016年11月 |
| 農業福島園 | 宗像市 | Condimentos | productos | 【自然栽培】農薬・肥料不使用の玄米粉 600g · 【自然栽培】農薬・肥料不使用の製菓用米粉 800g · 【自然栽培】農業福島園謹製 国産白玉粉 400g | https://www.tabechoku.com/producers/29244 | repr. 福島光志 |
| 杏里ファーム | 柳川市 | Pan y cereal | productos | 農家が作るつきたて極み餅！10個入(約500g)×5セット 合計50個 約2 · B品ちょっと小ぶりの【朝どれ】超高糖度！とうもろこし界の王様『ドルチェドリー · 【朝どれ】超高糖度！とうもろこし界の王様極甘『ドルチェドリーム』（約4.5k | https://www.tabechoku.com/producers/23968 |  |
| 白石アグリ | 遠賀町 | Pan y cereal | productos | 【新米予約】令和8年産 つきあかり 白米14Kg 【福岡県の農家直送】 · 【新米予約】令和8年産 元気つくし 白米4.5Kg 【福岡県の農家直送】 · 【新米予約】令和8年産 つきあかり 玄米4.5Kg 【福岡県の農家直送】 | https://www.tabechoku.com/producers/29509 | repr. 創業：2024年01月; 福岡県遠賀郡遠賀町 |
| よかもんいちご | うきは市 | Fruta y verdura | productos | 【いちご食べ比べ】完熟あまおう×〇〇苺（お任せ）【270ｇ】4パック · 【ギフト】あまおう苺【270ｇ】4パック 朝採り直送！ · 【ギフト】あまおう苺【270ｇ】6パック 朝採り直送！ | https://www.tabechoku.com/producers/23050 |  |
| うるう農園~福岡のいちご~ | 久留米市 | Fruta y verdura | productos | 【予約販売 2026年11月下旬～順次発送】あまおう苺 人気の定番サイズ 2 · 【予約販売 2026年11月下旬～順次発送】いちごの王様！あまおう苺 人気サ · 【予約販売 2027年1月中旬～順次発送】【冷凍いちご】あまおういちご たっ | https://www.tabechoku.com/producers/22204 | repr. 創業：2017年04月 |
| 川﨑果樹園 | 北九州市 | Fruta y verdura | productos | 💫《季節のギフトに最適》新鮮ぶどう·シャインマスカット2房【高級化粧箱入り· · 🍇《季節のギフトに最適》 彩り鮮やかぶどう2房《シャインマスカット&ナガノパ · 🌟 《季節のギフトに最適》彩り鮮やかぶどう2房《シャインマスカット&藤稔》【 | https://www.tabechoku.com/producers/26096 |  |
| 丘の上ファーム | 宗像市 | Fruta y verdura | ficha | 食欲をそそる香り！スライスドライにんにく（恵みの輝き）【5パックセット】 · 【熟成黒にんにく 恵みの黒】 一缶にポリフェノール760mg含有 毎日一粒  | https://www.tabechoku.com/producers/24276 |  |
| やまんた農園 | 広川町 | Fruta y verdura | productos | 【50箱限定予約販売】注文殺到！朝採りシャインマスカット！食べてビックリ糖度 · 【50箱限定予約販売】注文殺到！朝採りシャインマスカット！食べてビックリ糖度 | https://www.tabechoku.com/producers/22939 | repr. 創業：2020年11月; 福岡県八女郡広川町 |
| オーガニックハーブ農園　Pala’au | 筑紫野市 | Fruta y verdura | productos | 夏にピッタリのハーブ！鮮やかなレッドのハイビスカスローゼル 自然栽培で育てた · 自然栽培 フレッシュレモングラス ３００ｇ￥１,８００ 数量限定 30パック · 本年度収穫のハーブティーの販売開始します！！ 《希少》青りんごの香り！のリラ | https://www.tabechoku.com/producers/28391 | repr. 執行朋子 |
| オーガニックナガミツファーム | 糸島市 | Fruta y verdura | productos | 売上第２位❗️☆畑直送☆【福岡県糸島産】朝獲れ＊サラダ用野菜セット、7品目前 · ☆畑直送☆畑で採れた果物をプレゼント‼️こだわり有機栽培野菜10品前後セット · 売上第１位❗️☆畑直送☆【福岡県糸島産】朝獲れ＊無NO薬野菜セット(10品前 | https://www.tabechoku.com/producers/20007 |  |
