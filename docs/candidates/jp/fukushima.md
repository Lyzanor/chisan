# Fukushima — candidatos

- CSV: `data/csv/jp/tohoku/fukushima.csv` (9 filas, altas del 2026-08-04).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/fukushima> (63 bodegas, leído 2026-08-04). Gremio: 福島県酒造協同組合, <http://www.sake-fukushima.jp/>.
- Estado: **9 integradas** el 2026-08-04 (7 `verificado`, 2 `parcial`); quedan 8 de la tabla y ~46 del censo. Evidencia en `data/evidence/jp/tohoku/fukushima.jsonl`.

Fukushima es la prefectura con más oros del 全国新酒鑑評会 de la última década:
el pool de bodegas con marca y tienda propia es de los mejores del país.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Akebono Shuzo | 曙酒造 | Aizubange |
| Toyokuni Shuzo | 豊国酒造 | Aizubange |
| Takahashi Shosaku Shuzoten | 高橋庄作酒造店 | Aizuwakamatsu |
| Nagurayama Shuzo | 名倉山酒造 | Aizuwakamatsu |
| Yumegokoro Shuzo | 夢心酒造 | Kitakata |
| Ohara Shuzo | 小原酒造 | Kitakata |
| Sasanokawa Shuzo | 笹の川酒造 | Koriyama |
| Kokken Shuzo | 國権酒造 | Minamiaizu |
| Kaito Otokoyama Shuzo | 開当男山酒造 | Minamiaizu |
| Hanaizumi Shuzo | 花泉酒造 | Minamiaizu |
| Eisen Shuzo | 榮川酒造 | Bandai |
| Matsuzaki Shuzo | 松崎酒造 | Ten'ei |
| Ohki Daikichi Honten | 大木代吉本店 | Yabuki |

## Integradas 2026-08-04 (9) — salidas de la cola de arriba

| bodega | municipio | resultado |
|---|---|---|
| Suehiro Shuzo | Aizuwakamatsu | verificado · venta sí |
| Niida Honke | Koriyama | verificado · venta sí |
| Yamatogawa Shuzoten | Kitakata | verificado · venta sí |
| Homare Shuzo | Kitakata | verificado · venta sí |
| Ninki Shuzo | Nihonmatsu | verificado · venta sí |
| Miyaizumi Meijo | Aizuwakamatsu | verificado · sin venta directa |
| Tsurunoe Shuzo | Aizuwakamatsu | verificado · sin carrito |
| Okunomatsu Shuzo | Nihonmatsu | **parcial** · web ilegible |
| Hiroki Shuzo Honten | Aizubange | **parcial** · sin web |

**El portal de la prefectura no sirve para el dominio.** `fukunosake.com` tiene
ficha por bodega con dirección y teléfono de las 55, pero **no publica la web de
ninguna** — comprobado en el listado y en una ficha suelta. Sirve para dirección,
municipio y contacto; el dominio hay que buscarlo bodega a bodega.

- **廣木酒造本店 (Hiroki) no tiene web propia**, y eso que su marca es de las más
  buscadas de Japón. Vende solo por distribuidor autorizado. Sin enlace externo
  no puede pasar de `parcial`: la fama no sustituye a la fuente.
- **宮泉銘醸 declara en su propia web que las fechas de venta las fija cada tienda
  autorizada**, o sea que no vende directo. Eso es un `no comprobado` razonado,
  no una falta de datos.
- **奥の松酒造 sirve su web pero devolvió solo el título**, sin cuerpo legible:
  confirma dominio vivo y propiedad, no actividad. Dirección y contacto salen del
  directorio de empresas del ayuntamiento de Nihonmatsu. Se queda `parcial`.
- **末廣酒造 tiene dos kura** (Kaeigura en Aizuwakamatsu, Hakushigura en
  Aizumisato). La fila toma la sede.

## Trampas
- **大七酒造 (Daishichi, Nihonmatsu)** ya está en la bandeja del `README.md` de
  esta carpeta: no volver a proponerla como nueva.
- **豊國酒造 (Furudono, 石川郡) y 豊国酒造 (Aizubange, 河沼郡) son dos empresas
  distintas** que solo se diferencian en un kanji (國/国). No fusionar filas.
- **榮川酒造株式会社 (Bandai) y 榮川酒造合資会社 (Minamiaizu)**: misma trampa, la
  forma societaria es lo único que las separa en el listado.
- 会津 se reparte en muchos municipios de nombre parecido — 会津若松市,
  会津坂下町, 会津美里町, 南会津町 — y el `municipio` no es «Aizu».
- La franja costera (いわき, y los municipios evacuados tras 2011) exige evidencia
  reciente de actividad: aquí «sigue abierta» no es un trámite.

## Qué falta
- Las ~40 bodegas restantes del censo.
- Sin abrir: melocotón de Fukushima (segunda de Japón), 会津の味噌・醤油,
  きゅうり/アスパラ, 喜多方ラーメン, 会津本郷焼 (no alimentario).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| あいづ有機農法生産組合 | 横山歩 2 | 福島県会津若松市神指町榎木檀24 | 有機農産物 | JS000828FA-2041 |
| 渡部よしの | 1　他 | 福島県喜多方市山都町三津合字千咲原5846-65　他 | 有機農産物 | S-141 |
| やまろく米出荷協議会 | 安斎正代　１ 他 | 福島県二本松市渋川字神社前19　他 | 有機農産物 | AFASSEQ-AA-000903 |
| 日本果実加工株式会社　白河工場 | 日本果実加工株式会社　白河第2工場、第3工場　他 | 福島県白河市東深仁井田字道山2-4　他 | 有機加工食品 | MPJP1428-01 |
| 山吉青果食品株式会社　桑折工場 | 山吉青果食品株式会社　桑折工場 | 福島県伊達郡桑折町大字万正寺字宮ノ西1-1 | 有機加工食品 | 第1167号 |
| ＦＥＮネット | 五十嵐正康　ほ場1　他 | 福島県河沼郡会津坂下町大字坂本字大沢71-1、72　他 | 有機農産物 | 2001F-20 |
| ゆうきの会 | 大竹久雄 ほ場4 他 | 福島県喜多方市熱塩加納町米岡字上野前8 他 | 有機農産物 | 2005F-13 |
| 自然農法風の会 | 農業法人（有）自然農法無の会 ほ場103 他 | 福島県大沼郡会津美里町松沢字中原292 他 | 有機農産物 | 2001F-1 |
| 農園　やいこばあちゃん　大平周一 | 岡下　他 | 福島県石川郡石川町大字南山形字羽貫田387Ｋ　他 | 有機農産物 | 福島県認定第9号 |
| 会津自然塾　代表者 鹿野義治 | 鹿野敏子 自宅前畑①　他 | 福島県大沼郡会津美里町字高田前川原3478　他 | 有機農産物 | 福島県認証第6号 |
| 三坂　勲 | 10 菅田100　他 | 福島県相馬郡飯舘村臼石字菅田100　他 | 有機農産物 | 福島県認定第4号 |
| 菊地浩美 | 山田第一ほ場 | 福島県双葉郡双葉町山田字北田6 | 有機農産物 | 福島県認定第14号 |
| かぼちゃランド若月　若月芳則 | 酒田有機圃場 | 福島県双葉郡浪江町大字酒田字原131 | 有機農産物 | 福島県認定第13号 |
| 髙橋庄作酒造店　髙橋庄作 | 試験田　他 | 福島県会津若松市門田町大字一ノ堰字羽黒46 他 | 有機農産物 | 福島県認定第19号 |
| 相馬有機推進の会　若松清一 | 前の田上　他 | 福島県相馬市山上字堀坂73-2　他 | 有機農産物 | 福島県認定第24号 |
| 成田有機農園　成田 守 | 上の水田の西　他 | 福島県郡山市日和田町字鶴見坦128　他 | 有機農産物 | 福島県認定第27号 |
| ゆず太郎の郷　松本広行 | 柚子南　他 | 福島県双葉郡楢葉町大字井出字槻26　他 | 有機農産物 | 福島県認証第43号 |
| 猪苗代ブルーベリーれいちゃん農場　野矢 健正 | ブルーベリー園１ | 福島県耶麻郡猪苗代町大字川桁字林口2 | 有機農産物 | 福島県認定第47号 |
| アクツフーズ(株) | アクツフーズ（株）第一工場・倉庫　他 | 福島県石川郡古殿町竹貫字千足52・54・56　他 | 有機加工食品 | JA090915PR-1087-0 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/fukushima.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 清水産業 (猪苗代ビール) | Inawashiro | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/fukushima.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/fukushima.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
- Estado: **21 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 大正堂製菓 | いわき市 | Dulces y repostería | 和菓子協会 | https://www.instagram.com/taishodo1967/ | いわき市錦町江栗 2-31 |
| みよし | いわき市 | Dulces y repostería | 和菓子協会 | https://j-miyoshi.jp/index.html | いわき市平谷川瀬 1-11-3 |
| 玉家玉振堂 | 二本松市 | Dulces y repostería | 和菓子協会 | https://gtamaya.com/ | 二本松市竹田 1-77 |
| 玉嶋屋 | 二本松市 | Dulces y repostería | 和菓子協会 | https://tamasimaya.com/ | 二本松市本町 1-88 |
| 四季菓匠長岡家 | 会津坂下町 | Dulces y repostería | 和菓子協会 | https://www.wagashi-nagaokaya.jp/ | 河沼郡会津坂下町字逆水 23-2 |
| 太郎庵 | 会津坂下町 | Dulces y repostería | 和菓子協会 | https://www.taroan.co.jp/ | 河沼郡会津坂下町福原前 4108-1 |
| 熊野屋 | 会津若松市 | Dulces y repostería | 和菓子協会 | https://kumadango.net/ | 会津若松市日新町 12-23 |
| 手づくり菓子工房 大野屋 | 桑折町 | Dulces y repostería | 和菓子協会 | https://r.goope.jp/ohnoya/ | 伊達郡桑折町本町 3 |
| 日乃出屋物産店 | 猪苗代町 | Dulces y repostería | 和菓子協会 | http://www.oishisazukuri.com/ | 耶麻郡猪苗代町大字蚕養字沼尻山甲 2855-131 |
| 白河菓匠大黒屋 | 白河市 | Dulces y repostería | 和菓子協会 | http://www.s-daikokuya.jp/ | 白河市中町 44 |
| 船橋屋製菓 | 相馬市 | Dulces y repostería | 和菓子協会 | https://www.cestsibon.jp/funabashiya.html | 相馬市中村字大町 73 |
| 福々和本舗 | 福島市 | Dulces y repostería | 和菓子協会 | https://fuku29.co.jp/ | 福島市松浪町 4-18 |
| 松屋清風庵 | 福島市 | Dulces y repostería | 和菓子協会 | https://fukushima028.wixsite.com/matsuya-seihuan | 福島市北町 3-43 |
| 柏屋 | 郡山市 | Dulces y repostería | 和菓子協会 | https://www.usukawa.co.jp/ | 郡山市富久山町久保田字宮田 127-5 |
| 丹波家柿羊羹本舗 | 郡山市 | Dulces y repostería | 和菓子協会 | http://tadafuku.com/shop/tanbaya/ | 郡山市咲田 1-16-5 |
| 郡山銘菓庵大黒屋 | 郡山市 | Dulces y repostería | 和菓子協会 | https://www.koriyama-daikokuya.com/ | 郡山市中町 14-8 |
| お菓子処かど屋 | 郡山市 | Dulces y repostería | 和菓子協会 | https://r.goope.jp/kadoya-nakata/ | 郡山市中田町高倉字下ノ沢 84 |
| かんのや | 郡山市 | Dulces y repostería | 和菓子協会 | https://www.yubeshi.co.jp/ | 郡山市西田町大田字宮木田 3 |
| ㈱奈良屋 | 南会津町 | Pan y cereal | 全乾麺 | https://www.naraya-soba.com/ | 機械製乾めん |
| 池田食品工業㈱ | 福島市 | Pan y cereal | 全乾麺 | http://menno-ikeda.co.jp/ | 機械製乾めん |
| ㈱あらい屋製麺所 | 郡山市 | Pan y cereal | 全乾麺 | http://www.araiya.net/ | 機械製乾めん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/fukushima.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/fukushima> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| フェルムナチュレール・コクブン | 伊達市 | Pescado | https://www.tabechoku.com/producers/20430 | 私たちは福島県北地方の伊達市で自然型農業を営む農園です。「土と自然を豊かにすることが、人にも本当の豊かさと健康をもたらす。」を信条に、農薬や |
| Bellファーム | 会津若松市 | Pescado | https://www.tabechoku.com/producers/3078656 | 福島県会津若松市。四方を山々に囲まれたこの盆地は、古くから日本屈指の米どころとして知られています。私たちの米作りを支えるのは、磐梯山から流れ |
| おびすや | 相馬市 | Pescado | https://www.tabechoku.com/producers/3078559 | 福島県相馬市にある日本百景のひとつ「松川浦」から青のり佃煮をお届けします！ |
| 須藤農彩園 | 郡山市 | Pescado | https://www.tabechoku.com/producers/24205 | 食卓が彩り豊かになるように！ |
| HANA-MASA | 猪苗代町 | Carne | https://www.tabechoku.com/producers/28649 | 当社の位置する猪苗代町は福島県のほぼ中央、猪苗代湖の北岸に面し東西北の三方を会津磐梯山をはじめとする山々に囲まれた自然豊かな町です。当社は花 |
| 会津猪苗代カンダファーム | 猪苗代町 | Carne | https://www.tabechoku.com/producers/29277 | 会津磐梯山と猪苗代湖に抱かれた猪苗代町で、水稲栽培を中心に営む農家です。 |
| 肉の秋元本店 | 白河市 | Carne | https://www.tabechoku.com/producers/21221 | 「美味しいお肉で幸せをつくりたい」　福島県白河市の静かな里山で、豊かな大自然から湧き出た水を味わい、緑に抱かれた広々とした農場で豚たちはのん |
| 浜福青果 | 福島市 | Setas | https://www.tabechoku.com/producers/3077708 | 私たちは2021年5月に無農薬・無科学肥料のしいたけ農園を立ち上げました。しいたけの香りを引き出し肉厚なぷりぷり食感を実現するために栽培方法 |
| 滝桜湖養蜂 滝桜湖つみとりブルーベリー園 | 三春町 | Miel | https://www.tabechoku.com/producers/21208 | 元々はサラリーマンで休日に気分転換も兼ねて実家の養蜂業とブルーベリー園を手伝う程度の関わりでしたが、関わるほどにその奥深さと難しさお客様の感 |
| 郡山あさか野養蜂場 | 郡山市 | Miel | https://www.tabechoku.com/producers/3078130 | みつばちを通して美しい自然環境と健康を |
| おさんぽたまご | 伊達市 | Huevos | https://www.tabechoku.com/producers/29598 | ・『しあわせ山の おさんぽたまご』と申します。 |
| グルテンフリーお米のパン工房穂鹿 | 天栄村 | Huevos | https://www.tabechoku.com/producers/27044 | 周りに山しかないよう山奥地で、農薬・肥料不使用(自然栽培）・天日干しでお米を栽培し，そのお米を100%使ってパンとお菓子を作っています。小麦 |
| 三栗野むぎ農園 | 国見町 | Frutos secos | https://www.tabechoku.com/producers/28597 | 東京から福島県に移住し夫婦で農業を始めました。農場ネコ2匹をサブメンバーに野菜作りを楽しんでいます。 |
| まるとう果樹園 | 国見町 | Pan y cereal | https://www.tabechoku.com/producers/3079118 | 福島県と宮城県の県境である国見町で約16品種のモモをメインに、現在３年目のブドウ、お米(コシヒカリ)、あんぽ柿を生産しております。 |
| 西村農園 | 大玉村 | Pan y cereal | https://www.tabechoku.com/producers/23242 | 西村農園は安達太良山の麓に広がる肥沃な粘土質の土　澄んだ水自然豊かな農園です家族3人で減農薬減化学肥料で　コシヒカリ　こがねもち　福島県オリ |
| 母の味　阿部農縁 あべのうえん | 須賀川市 | Pan y cereal | https://www.tabechoku.com/producers/24408 | 福島県須賀川市にある大正時代から四代続く農家です。看護師寺山佐智子が17年前に就農しました。　東日本大震災をきっかけに、法人化　株式会社阿部 |
| 大野農園 | 石川町 | Fruta y verdura | https://www.tabechoku.com/producers/21306 | 1975年創業、「りんご・もも・なし・ぶどう」と果物専門に栽培する農園です。 |
| まるせい果樹園 | 福島市 | Fruta y verdura | https://www.tabechoku.com/producers/27869 | はじめまして！ |
| 菱沼農園 | 福島市 | Fruta y verdura | https://www.tabechoku.com/producers/20876 | 私たちは福島県福島市でさくらんぼ・桃・ぶどう・りんごの4品目の果物を栽培しております。 |
| 桐の里産業 | 三島町 | ⚠ por decidir | https://www.tabechoku.com/producers/22557 | 三島町は福島県の西部に位置し、尾瀬を源流とする只見川沿いにある山間の町です。三島町の雄大な自然の中でエゴマを育てています。この地方で昔から作 |
| 大和川ファーム | 喜多方市 | ⚠ por decidir | https://www.tabechoku.com/producers/26013 | 地域の景観を守り地域の自然と共存し地域の発展に寄与する。これが大和川グループの信念です。 |
| アグリパークとみおか | 富岡町 | ⚠ por decidir | https://www.tabechoku.com/producers/3078744 | ～手間を惜しまない。だから、この一粒が輝く～ |
