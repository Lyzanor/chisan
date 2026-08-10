# Hokkaido — candidatos

- CSV: `data/csv/jp/hokkaido/hokkaido.csv` (37 filas, todas altas de esta pasada).
- Fuentes: Hokkaido Wine Cluster, <https://winecluster.org/contents/winery/> (censo de bodegas de la isla, con municipio y dominio) y 日本ワイナリー協会, <https://www.winery.or.jp/winery-map/area/hokkaido/> (ficha por bodega, sin dominio propio).
- Estado: **37 integradas** en el CSV el 2026-08-04 como `parcial`. Quedan fuera 5 bodegas: Yoichi Winery, Otobe Winery y えべおつWein (las dos fuentes discrepan en municipio, ver aviso), Boss Agri y Domaine Towa (sin dominio en la fuente).

Hokkaido es una sola `area` con ~76 bodegas censadas en 2026; abajo van las 40
del núcleo asociado, que son las que traen dominio. Categoría: `Vino`.
El rōmaji de `nombre` y `municipio` es propuesta a confirmar.

| nombre (rōmaji propuesto) | 社名 | municipio | web |
|---|---|---|---|
| Tokachi Wine (Ikeda Winery) | 池田町ブドウ・ブドウ酒研究所 | Ikeda | tokachi-wine.com |
| Furano Wine | 富良野市ぶどう果樹研究所 | Furano | furanowine.jp |
| Hakodate Wine | はこだてわいん | Nanae | hakodatewine.co.jp |
| Hokkaido Wine | 北海道ワイン | Otaru | hokkaidowine.com |
| Yoichi Winery (Nippon Seishu) | 日本清酒 余市ワイナリー | Yoichi ⚠ | nipponseishu.co.jp/yoichiwine |
| Otobe Winery (Sapporo Shusei) | 札幌酒精 おとべワイナリー | Otobe ⚠ | sapporo-shusei.jp |
| Chitose Winery | 北海道中央葡萄酒 千歳ワイナリー | Chitose | chitose-winery.jp |
| Tsukiura Winery | 月浦ワイナリー | Toyako | tsukiurawine.jp |
| Yamazaki Winery | 山崎ワイナリー | Mikasa | yamazaki-winery.co.jp |
| Housui Winery | 宝水ワイナリー | Iwamizawa | housui-winery.co.jp |
| Maoi Distillery | MAOI 馬追蒸溜所 | Naganuma | maoidistillery.com |
| Okushiri Winery | 奥尻ワイナリー | Okushiri | okushiri-winery.com |
| Sapporo Fujino Winery | さっぽろ藤野ワイナリー | Sapporo | vm-net.ne.jp/elk/fujino |
| Berry Berry Farm & Winery / Domaine Ichi | ベリーベリーファーム＆ワイナリー | Niki | organicwine.jp |
| Hakkenzan Winery | 八剣山ワイナリー | Sapporo | hakkenzanwinery.com |
| 10R Winery | １０Rワイナリー | Iwamizawa | 10rwinery.jp |
| Nora Kura | 農楽蔵 | Hokuto | nora-kura.jp |
| Nobori Jozo | 登醸造 | Yoichi | noborijozo.com |
| Matsubara Nouen | 松原農園 | Rankoshi ⚠ | matsubarawine.com |
| OSA Winery | オサワイナリー | Otaru | osawinery.com |
| Niki Hills Winery | 仁木ヒルズワイナリー | Niki | nikihills.co.jp |
| Niseko Winery | ニセコワイナリー | Niseko | yoteigreenbusiness.com |
| Winery YUMENOMORI | ワイナリーYUMENOMORI | Yoichi | winery-yumenomori.com |
| TADA WINERY (Tada Nouen) | 多田農園 | Kamifurano | ninjin-koubou.com |
| Camel Farm Winery | キャメルファーム | Yoichi | camelfarm.co.jp |
| Vina de oro bodega | Vina de oro bodega | Niki | vina-de-oro-bodega.net |
| Domaine Raison | Domaine Raison | Nakafurano | domaine-raison.com |
| Aizawa Winery | 相澤ワイナリー | Obihiro | aizawanouen.com |
| Shinga Winery | 森臥ワイナリー | Nayoro | shinga-shinga.jimdofree.com |
| Sapporo Wine | さっぽろワイン | Sapporo | sapporo-wine.com |
| Memuro Winery | めむろワイナリー | Memuro | memurowinery.jp |
| Boss Agri Winery | ボスアグリワイナリー | Kitami | (sin dominio en la fuente) |
| Domaine Yui | ドメーヌユイ | Yoichi | facebook.com/domaineyui |
| Tokachi Makiba no Ie Winery | 十勝まきばの家ワイナリー | Ikeda | makibanoie.com/winery |
| Yukikawa Jozo | 雪川醸造 | Higashikawa | snowriverwines.com |
| Kaminokuni Winery | 上ノ国ワイナリー | Kaminokuni | kaminokuni-winery.jp |
| DUE PUNTI | DUE PUNTI | Hokuto | due-punti-vineyards.com |
| Ebeotsu Wein | えべおつWein | Takikawa ⚠ | facebook.com/ebeotsu.Wein |
| De Montille & Hokkaido | ド・モンティーユ＆北海道 | Hakodate | demontille-hokkaido.com |

⚠ **Las dos fuentes se contradicen en el municipio**, y siempre por lo mismo:
una da la **sede social** y la otra la **bodega**. Manda dónde se produce.
- 余市ワイナリー: Wine Cluster dice Sapporo (sede de 日本清酒), la asociación no
  la sitúa; la bodega está en Yoichi.
- おとべワイナリー: Sapporo (sede de 札幌酒精) vs Otobe (bodega) → Otobe.
- えべおつWein: Takikawa (barrio de Ebeotsu) vs Eniwa → resolver en la web propia.
- 松原農園: Rankoshi vs Niseko → resolver en la web propia.

**Revisión 2026-08-09:** Domaine Towa era una variante del ya publicado
`domaine-toi-takasu`; se retira de la cola, no es un descarte. **Yotsuba Milk
Products** queda retenida por ser una federación nacional con varias plantas y
sin una unidad local minorista inequívoca. **Yokoyama Flour Milling** queda
retenida por perfil B2B y falta de municipio productivo. **Godo Shusei
Asahikawa** queda retenida porque la fuente identifica una planta de grupo, no
una identidad productora local autónoma. Son decisiones revisables, no rechazos.

## Fuera del vino (4, del listado aportado 2026-08-04)

De `listado_125_productores_locales_japon.xlsx`. Ninguna solapa con la tabla de
arriba, que es solo de bodegas.

| nombre | municipio | categoría | A/B | web |
|---|---|---|---|---|
| Kyodogakusha Shintoku Farm | Shintoku | Lácteos y quesos | A | kyodogakusha.org — quesería de comunidad agrícola, el perfil más limpio de los cuatro |
| Tonden Farm | Ebetsu | Carne | A | tondenfarm.co.jp |
| Yotsuba Milk Products | ⚠ Sapporo o Tokachi | Lácteos y quesos | A | yotsuba.co.jp ⚠ federación láctea de escala nacional: sede en Sapporo, plantas en Tokachi. Candidata a descarte por masa |
| Yokoyama Flour Milling | ⚠ sin municipio | Pan y cereal | B | ficha en japanfoodhub.jp — el origen puso «Hokkaidō» de localidad, que es el área entera |

Estas cuatro abren por fin el frente lácteo/cárnico de la isla, que la tabla de
bodegas no tocaba. Kyodogakusha es además la punta del hilo de las queserías.

## Sake (13, pasada 2026-08-04)

Frente abierto por fin. Fuente: censo de 酒蔵 de SAKETIMES,
<https://jp.sake-times.com/sakagura/hokkaido> (13 bodegas, el censo completo de
la isla). Gremio: 北海道酒造組合, <http://www.hokkaido-sake.or.jp/>.
Ninguna trae dominio en la fuente. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Otokoyama | 男山 | Asahikawa |
| Takasago Shuzo | 高砂酒造 | Asahikawa |
| Kamikawa Taisetsu Shuzo | 上川大雪酒造 | Kamikawa |
| Kunimare Shuzo | 国稀酒造 | Mashike |
| Kinteki Shuzo | 金滴酒造 | Shintotsukawa |
| Kobayashi Shuzo | 小林酒造 | Kuriyama |
| Tanaka Shuzo | 田中酒造 | Otaru |
| Niseko Shuzo | 二世古酒造 | Kutchan |
| Fukutsukasa Shuzo | 福司酒造 | Kushiro |
| Usui Katsusaburo Shoten | 碓氷勝三郎商店 | Nemuro |
| Nippon Seishu | 日本清酒 | Sapporo ⚠ |
| Sapporo Shusei Kogyo | 札幌酒精工業 | Sapporo ⚠ |
| Godo Shusei Asahikawa | 合同酒精 旭川工場 | Asahikawa ⚠ planta, triar |

⚠ **日本清酒 y 札幌酒精 ya aparecen arriba** como matrices de 余市ワイナリー y
おとべワイナリー. Si entran también como bodega de sake es **otra fila** (otro
producto, otro municipio productivo), no un duplicado — pero decidirlo antes de
escribir, no después.

## Qué falta
- Las ~36 bodegas restantes del censo (no asociadas y altas 2025-2026), casi todas
  en Yoichi, Niki e Iwamizawa: mismo listado de Wine Cluster, sección inferior.
- **Queserías**: Hokkaido tiene más de 100 obradores y no hay ninguno aquí. Es el
  frente con más recorrido de la isla y sigue sin fuente institucional localizada.
- Sin abrir: sake (北海道酒造組合), lácteos, marisco, ramen/miso.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 麦わらファーム　梶沼啓 | A　他 | 北海道上川郡当麻町中央7区 | 有機農産物 | A06-062302 |
| 栗沢あおぞら農園　林宏 | 1　他 | 北海道岩見沢市栗沢町必成99 | 有機農産物 | A06-062301 |
| 森田 基 | 森田 基 10 他 | 北海道石狩郡新篠津村第36線10番地 他 | 有機農産物 | 2006F-5 |
| 岩田醸造（株） | 岩田醸造（株）　千歳工場 | 北海道千歳市上長都1130-13 | 有機加工食品 | 第1073号 |
| 佐藤京一 | 3　他 | 北海道岩見沢市栗沢町茂世丑768-1、768-2　他 | 有機農産物 | A06-080701 |
| 小路恵子 | 01　他 | 北海道勇払郡安平町追分旭821-2　他 | 有機農産物 | 18002-01 |
| 池田良英 | 池田良英 | 北海道上川郡新得町上佐幌西1線5-1 | 有機農産物 | 18003-01 |
| 近藤弘和 | 近藤弘和 | 北海道網走郡津別町活汲 | 有機農産物 | 18006-01 |
| 津別町有機酪農研究会 | 石川賢一　他 | 北海道網走郡津別町共和229-2　他 | 有機畜産物 | 第TS18016号-02　他 |
| 早坂農場 | 早坂清彦 H　他 | 北海道上川郡美瑛町ﾙﾍﾞｼﾍﾞ6959-1　他 | 有機農産物 | AFASSEQ-AA-010809 |
| 畑のがんこもの組合 | 柳澤　繁雄　他 | 北海道上川郡剣淵町西岡町1245番地　他 | 有機農産物 | 第13013号－01　他 |
| 木村　正幸 | 30　他 | 北海道上川郡剣淵町南桜町2025番地 | 有機農産物 | 第15010号-01 |
| 安田　盛 | 13　他 | 北海道上川郡剣淵町南桜町525番地 | 有機農産物 | 第15012号-01 |
| (有)サンユー農産 | A-1　他 | 北海道余市郡仁木町東町12丁目　他 | 有機農産物 | 14001-01 |
| 中本　正雄 | 中本　正雄 | 北海道岩内郡共和町学田 | 有機農産物 | 15007-01 |
| クローバーの会 | 浅野　晃彦　１　他 | 北海道旭川市神居町西丘 | 有機農産物 | 第13004号-01　他 |
| いずみ農園 | O-1　他 | 北海道帯広市西10条北3丁目3　他 | 有機農産物 | 第14006号-01 |
| 佐伯農園 | O-1　他 | 北海道虻田郡洞爺湖町洞爺町417 | 有機農産物 | 100092001 |
| オホーツク髙橋農場 | 01 他 | 北海道網走郡美幌町田中1236 | 有機農産物 | A06-110202 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/hokkaido/hokkaido.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JiCheese** — 北海道地チーズ博 — 工房・メーカー, <https://jicheese.com/producer/>
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 丸勝産業 (はこだてビール) | Hakodate | Cerveza | JBA | hakodate-factory.com | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/hokkaido/hokkaido.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/hokkaido.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **21 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| はこだて柳屋 | 函館市 | Dulces y repostería | 和菓子協会 | http://hakodate-yanagiya.com/ | 函館市万代町 3-13 |
| 新倉屋 | 小樽市 | Dulces y repostería | 和菓子協会 | http://www.hanazonodango.co.jp/ | 小樽市花園銀座街 |
| 北の自然菓　柳月 | 音更町 | Dulces y repostería | 和菓子協会 | http://www.ryugetsu.co.jp/ | 河東郡音更町下音更北 9西18-2 |
| 株式会社美好屋 | 札幌市 | Aperitivos | 全国米菓工業組合 | https://www.miyoshiya-mochi.com | 米菓製造・販売業（直売所有り） |
| サザエ食品株式会社 | 札幌市 | Aperitivos | 全国米菓工業組合 | https://www.sazae.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）、米菓販売業（その他菓子を含む卸・小売業）、その他（米菓を含むコメ加工品製造・販売等） |
| 吉川食品株式会社 | 砂川市 | Aperitivos | 全国米菓工業組合 | https://yoshikawafoods.co.jp/ | 米菓製造・販売業（直売所有り） |
| 下館工房 | ⚠ | Carne | búsqueda dirigida + web propia | https://www.shimodate-koubou.jp/ | ⚠ municipio sin confirmar |
| 薫製工房ハントヴェルク | ⚠ | Carne | búsqueda dirigida + web propia | https://handwerk-official.com/ | ⚠ municipio sin confirmar; cerdo whey de Tokachi |
| 北海道千歳ハム | 千歳市 | Carne | búsqueda dirigida + web propia | https://www.chitoseham.co.jp/ | tienda de fábrica |
| サルーミハヤシ | 札幌市 | Carne | búsqueda dirigida + web propia | https://www.salumihayashi.com/ | salami y embutido curado |
| 六花亭製菓 | 帯広市 | Dulces y repostería | búsqueda dirigida + web propia | https://www.rokkatei.co.jp/ | ⚠ escala grande, triar |
| 北菓楼 | 砂川市 | Dulces y repostería | búsqueda dirigida + web propia | https://www.kitakaro.com/ | ⚠ escala grande, triar |
| 柳月 | 音更町 | Dulces y repostería | búsqueda dirigida + web propia | https://www.ryugetsu.co.jp/ | ⚠ escala grande, triar; sede en 河東郡音更町 |
| 菅野養蜂場 | ⚠ | Miel | búsqueda dirigida + web propia | https://honeyfarm-kanno.com/ | ⚠ municipio sin confirmar |
| ナルセ養蜂場 | ⚠ | Miel | búsqueda dirigida + web propia | https://naruse-bee.jp/ | ⚠ municipio sin confirmar; Tokachi |
| 十勝養蜂園 | 上士幌町 | Miel | búsqueda dirigida + web propia | https://tokachiyohoen.com/ | ⚠ municipio tomado de la ficha, no de la web |
| 札幌山本養蜂園 | 札幌市 | Miel | búsqueda dirigida + web propia | https://www.koguma-honey.com/ | dirección en `/company-information/` |
| 藤井水産（鮭匠ふじい） | ⚠ | Pescado | búsqueda dirigida + web propia | https://fujiisuisan.co.jp/ | ⚠ municipio sin confirmar (Nemuro según la ficha, Betsukai en la web) |
| 圓子水産 | 斜里町 | Pescado | búsqueda dirigida + web propia | https://marukosuisan.com/ | pescador de Shiretoko (Utoro) con planta propia; municipio resuelto con la ficha de 食べチョク |
| 海産問屋カネニ | 広尾町 | Pescado | búsqueda dirigida + web propia | https://www.kaneni.com/ | ⚠ mayorista con marca propia, triar si elabora |
| 佐藤水産 | 札幌市 | Pescado | búsqueda dirigida + web propia | https://www.sato-suisan.co.jp/ | salmón, ikura, sujiko; ⚠ sede en Sapporo y planta en Ishikari, confirmar unidad productiva |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/hokkaido/hokkaido.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/hokkaido> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 床岡農園 | 三笠市 | Pescado | https://www.tabechoku.com/producers/24843 | 床岡農園は、北海道でも有名な豪雪地帯、三笠市にあります。自然の恵みを十分に受けた広大な農地約30haで、お米を中心に、メロン、かぼちゃ、スイ |
| 遠藤農園 | 千歳市 | Pescado | https://www.tabechoku.com/producers/22033 | 遠藤農園のお野菜いかがでしょうか？^o^ |
| 岩村　雅弘 | 森町 | Pescado | https://www.tabechoku.com/producers/21398 | 北海道噴火湾森町で牡蠣とホタテを養殖しています。 |
| 丸の野水産 | 羅臼町 | Pescado | https://www.tabechoku.com/producers/27483 | 北海道「知床」羅臼町の刺し網漁師を営んでる丸の野水産です。 |
| まむふぁむ | 増毛町 | Carne | https://www.tabechoku.com/producers/29667 | NEW　鹿肉ジビエ、はじまりました。 |
| えんどう畜産 | 士幌町 | Carne | https://www.tabechoku.com/producers/29478 | お客様の「心に残る」お肉をつくりたい。 |
| ハッピープレイス | 島牧村 | Carne | https://www.tabechoku.com/producers/27199 | 北海道でオーガニックトマトの生産と、放し飼いで鶏を育てています。 |
| 雪あかり | 鹿追町 | Carne | https://www.tabechoku.com/producers/26547 | 私たちは北海道十勝で家族で放牧養豚を営んでいます。 |
| 渋田きのこ園 | 厚沢部町 | Setas | https://www.tabechoku.com/producers/20798 | 北海道のきれいな水と空気、適した環境のもと |
| オフイビラ源吾農場 | 本別町 | Legumbres | https://www.tabechoku.com/producers/21479 | 北海道の十勝の本別町で、大豆、あずき、金時豆、小麦、じゃがいも などを育てています！ |
| 鈴木牧場 | 広尾町 | Lácteos y quesos | https://www.tabechoku.com/producers/20321 | 十勝オーガニック牛乳 （有機・グラスフェッド・放牧・ノンホモ・低温殺菌・A2ミルク） |
| 東山農場 | 栗山町 | Frutos secos | https://www.tabechoku.com/producers/21959 | 当農場は北海道夕張郡栗山町に位置する、夫婦二人で営む小さな農場です。北海道の雄大な自然の美しさに惚れ込み東京から移住後、栗山町でメロン栽培の |
| エゾの杜 | 池田町 | Vino | https://www.tabechoku.com/producers/26238 | 北海道十勝にあるワインで有名な街、池田町にある会社です。「エゾシカ等解体加工処理施設」に認定されています。 |
| うまいべ農園 | 中富良野町 | Pan y cereal | https://www.tabechoku.com/producers/22802 | 北海道中富良野町で小さい農家を営んでおります。栽培している作物はトウモロコシ、ミニトマト、米の３つです。 |
| アグ・デ・パンケ農園 | 蘭越町 | Pan y cereal | https://www.tabechoku.com/producers/21409 | 北海道ニセコエリア　蘭越町で25年間無農薬の野菜を栽培、直販している農家です。 |
| 原崎農園 | 鷹栖町 | Pan y cereal | https://www.tabechoku.com/producers/20244 | アスパラガスと色々な野菜と豆麦米・北海道鷹栖町の脱サラ農家（1代目） |
| 富良野　加納農園 | 富良野市 | Fruta y verdura | https://www.tabechoku.com/producers/21619 | 北海道富良野市の赤肉メロン・アスパラ・とうきび・かぼちゃを栽培する農家です。 |
| VEGGIEHILLS（ベジヒルズ） | 当別町 | Fruta y verdura | https://www.tabechoku.com/producers/21997 | 私たち夫婦は2019年に東京から北海道に移住し、2020年4月からここ当別町高岡の畑で野菜の栽培を始めました。この恵み豊かな自然に感謝しつつ |
| 瀬戸牛農園 | 西興部村 | Fruta y verdura | https://www.tabechoku.com/producers/24269 | 瀬戸牛農園は、北海道のオホーツク海側にある⻄興部（にしおこっぺ）村にあります。 |
| とくながファーム | 千歳市 | ⚠ por decidir | https://www.tabechoku.com/producers/23627 | 北海道の大自然の中で、両親と一つ一つ丁寧に育てています。 |
| 玉手農場 | 留寿都村 | ⚠ por decidir | https://www.tabechoku.com/producers/20109 | 『大地を耕し笑顔を生み出す』 |
| 野尻農場 | 音更町 | ⚠ por decidir | https://www.tabechoku.com/producers/3077638 |  |
