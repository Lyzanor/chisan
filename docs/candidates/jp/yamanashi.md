# Yamanashi — candidatos

- CSV: `data/csv/jp/chubu/yamanashi.csv` (3 filas, todas altas de esta pasada).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (2026-08-04).
- Estado: **las 3 integradas** en el CSV el 2026-08-04 como `parcial`. Cola vacía; el valor de este fichero es ahora el «Qué falta».

| nombre | municipio | categoría | A/B | web |
|---|---|---|---|---|
| Chuo Budoshu / Grace Wine | Koshu (Katsunuma) | Vino | A | grace-wine.com |
| Marufuji Winery / Rubaiyat | Koshu (Katsunuma) | Vino | A | rubaiyat.jp |
| UCHU Brewing | Hokuto | Cerveza | B | uchubrewing.com |

Katsunuma es un barrio de **Koshu**: el `municipio` de la fila es Koshu.
Las dos bodegas llevan doble denominación (razón social / marca): el `nombre` es
la marca pública — Grace Wine, Rubaiyat — y la razón social va solo si no hay
marca distinta (`docs/CSV_CONTRACT.md`).

## Sake (12, pasada 2026-08-04)

Frente nuevo: este fichero solo tenía vino. Fuentes: 日本酒造組合中央会
<https://japansake.or.jp/sakagura/jp/yamanashi/> (12, censo completo) y
<https://jp.sake-times.com/sakagura/yamanashi>, que coinciden fila a fila.
Gremio: 山梨県酒造組合, <http://www.yamanashi-sake.jp/> («12 酒蔵» en portada).
Ninguna trae dominio. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Yamanashi Meijo | 山梨銘醸 | Hokuto |
| Takenoi Shuzo | 武の井酒造 | Hokuto |
| Yamaki Shuzoten | 八巻酒造店 | Hokuto |
| Tanizakura Shuzo | 谷櫻酒造 | Hokuto |
| Sasaichi Shuzo | 笹一酒造 | Otsuki |
| Ide Jozoten | 井出醸造店 | Fujikawaguchiko |
| Yorozuya Jozoten | 萬屋醸造店 | Fujikawa |
| Okubo Shuzoten | 大久保酒造店 | Fujikawa |
| Yoro Shuzo | 養老酒造 | Yamanashi |
| Taikan Shuzo | 太冠酒造 | Minami-Alps |
| Yokouchi Shuzoten | 横内酒造店 | Minami-Alps |
| Yokoyama Shuzoten | 横山酒造店 | Nanbu |
| Udezumo Shuzo | 腕相撲酒造 | Fuefuki ⚠ |
| Sun Foods | サン・フーズ | Koshu ⚠ |

⚠ **腕相撲酒造** parece errata («pulso, echar un pulso») pero **las dos fuentes
independientes lo escriben igual**, así que no se corrige de oficio: se confirma
contra la propia bodega antes de escribir la fila.
⚠ **サン・フーズ (Koshu)** y **福徳長酒類 韮崎工場 (Nirasaki)** son plantas de
grupo, no casas con marca propia: triar. Sun Foods embotella además vino, así
que puede colisionar con la tabla de arriba.
- 北杜市 concentra cuatro de las doce. **Ojo con 北杜 (Hokuto, Yamanashi) vs 北斗
  (Hokuto, Hokkaido)**, que ya aparece en `hokkaido.md`: mismo rōmaji, distinto
  kanji y distinta punta del país. Una fuente escribió 北斗市 por 北杜市.

## Qué falta
Yamanashi es **la** prefectura del vino japonés (Koshu es la uva y la DOP de
facto) y aquí hay dos bodegas. Frentes abiertos:
- 山梨県ワイン酒造組合 y el sello **GI Yamanashi**: ahí está el censo real, con
  ~80 bodegas concentradas en Koshu, Fuefuki y Yamanashi-shi.
- Fruta: melocotón y uva de mesa de Fuefuki/Yamanashi, ciruela.
- Sin abrir: hoto, abalorio de miso, agua mineral del Fuji, whisky de Hakushu.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 野菜の里 | 本村北 他 | 山梨県北杜市小淵沢町松向杉之木平818 他 | 有機農産物 | J40-06-02 |
| 伊藤省吾 | 斜面西 他 | 山梨県北杜市長坂町長坂上条527-1 他 | 有機農産物 | J40-06-04 |
| ロケット農場（岸根正明） | 重樹　他 | 山梨県北杜市箕輪3119　他 | 有機農産物 | J40-06-06 |
| 小林力 | 東 他 | 山梨県北杜市高根町清里3545-168 他 | 有機農産物 | J40-06-07 |
| 株式会社海老屋 | 株式会社海老屋　他 | 山梨県甲府市七沢町１３４－４　他 | 有機加工食品 | カ-06-06 |
| 長沢富士雄 | 源田窪　他 | 山梨県山梨市堀内2040 他 | 有機農産物 | J40-06-10 |
| メトロ（株）　山梨工場 | メトロ（株）　山梨工場　他 | 山梨県南アルプス市下今諏訪907-10　他 | 有機加工食品 | JM020611PR-0543-0 |
| 株式会社　春木屋 | 株式会社春木屋　管理センター　他 | 山梨県甲府市里吉4-15-18　他 | 有機加工食品 | 201111401 |
| 小原隆一 | ハウス 他 | 山梨県北杜市長坂町長坂上条26-1 他 | 有機農産物 | J40-08-01 |
| ふじやまファーム（株） | ふじやまファーム（株） 1 他 | 山梨県都留市夏狩字高子2858、2859、2883 他 | 有機農産物 | 2006F-1 |
| 堀勝 | しんた 他 | 山梨県北杜市高根町小池長崎507-1 他 | 有機農産物 | J40-09-01 |
| 公益財団法人 キープ協会 | 財団法人 キープ協会 農場 | 山梨県北杜市高根町清里３５４５ | 有機畜産物 | チ-09-01 |
| 自家焙煎珈琲豆の店「彩香房」 | 自家焙煎珈琲豆の店「彩香房」 | 山梨県北杜市小淵沢町上笹尾３２６１－１３４ | 有機加工食品 | カ-11-02 |
| 株式会社　サーフビバレッジ | 株式会社　サーフビバレッジ　大野工場 | 山梨県山梨市大野1356 | 有機加工食品 | O-23 |
| 熊木剛彦 | 段差上 他 | 山梨県北杜市長坂町長坂下条字清水頭596-1 他 | 有機農産物 | J40-13-01 |
| 富岡　丈明 | 富岡農園 | 山梨県北杜市小淵沢町松向時柳沢2571　他 | 有機農産物 | 14-003 |
| まるた農場 | 菊原さん 他 | 山梨県北杜市高根町村山北割2218-1 他 | 有機農産物 | J40-14-01 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/yamanashi.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/yamanashi.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/yamanashi.php> (nombre, dirección y web propia de cada socio)
- Estado: **2 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 桔梗屋 | 笛吹市 | Dulces y repostería | 和菓子協会 | http://www.kikyouya.co.jp/ | 笛吹市一宮町坪井 1928 |
| 御菓子司すがや | 都留市 | Dulces y repostería | 和菓子協会 | http://hattan.jp | 都留市中央 3-4-3 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/yamanashi.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/yamanashi> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| Fairy Valley（フェアリーバレー） | 北杜市 | Pescado | https://www.tabechoku.com/producers/28680 | 農業系の企業に勤めているのですが、農産物生産者の方々が楽しそうに働く姿に憧れて、兼業として農業に取り組み始めました。 |
| and farm | 南アルプス市 | Pescado | https://www.tabechoku.com/producers/28390 | 「デザートのある食卓を、もっと豊かに」 |
| 前田龍珠園 | 甲州市 | Pescado | https://www.tabechoku.com/producers/20719 | 自家農園は、山梨県勝沼町にある800㎡程度の小さな農園です。日本ワインの歴史は、土屋龍憲氏と高野正誠氏、二人の青年が明治10年にフランスに渡 |
| 山の幸ファーム | 笛吹市 | Pescado | https://www.tabechoku.com/producers/28620 | 日本一桃の里といわれる山梨県一宮町で桃と葡萄を栽培をしています。東京から移住後、農園で働いたことをきっかけに果樹栽培に魅せられました。農家で |
| HOPE園 | 笛吹市 | Pescado | https://www.tabechoku.com/producers/24250 | 東京・大阪出身の新婚夫婦の営む、桃とぶどう農場"HOPE園"（ほーぷえん）です。お客様の健康のため、自然のため、そして自分たちのために減農薬 |
| 大月のびのびファーム | 大月市 | Carne | https://www.tabechoku.com/producers/3078481 | 豚・羊・馬を森林の中で良質の餌と自由に運動できる環境で育ててます。 |
| 丹波山倶楽部 | 丹波山村 | Setas | https://www.tabechoku.com/producers/23601 | 多摩川源流に位置する、関東一小さな村で自然に寄り添った農業を行っております。耕作放棄地を利用して、地域に伝わる伝統野菜、原木栽培による舞茸を |
| 甲州きくらげ | 甲州市 | Setas | https://www.tabechoku.com/producers/25092 | 【この食材は凄い…】 |
| HARU FARM | 甲州市 | Condimentos | https://www.tabechoku.com/producers/3077591 | 家族３人小規模農家です。山梨県甲州市塩山地区の標高約650mの高台に位置する畑から朝収穫した桃をその日のうちに出荷いたします。お届けする桃は |
| 大和ファーム | 北杜市 | Conservas | https://www.tabechoku.com/producers/23678 | 水のきれいな八ヶ岳の麓で「医食農同源」「100年先の未来に種をまく暮らし方」「ココロとカラダを整える農家」をテーマにカラダに取り入れて健康に |
| まるいち農産加工所 | 市川三郷町 | Aceite | https://www.tabechoku.com/producers/23008 | 平成２９年に開設し、山梨県西八代郡市川三郷町で農産物や農産加工品の販売を行っています。自己所有の畑の他に耕作放棄地を借りて様々な作物を育てて |
| こぴっと | 北杜市 | Pan y cereal | https://www.tabechoku.com/producers/22275 | 私たちは自然豊かな八ヶ岳南麓山梨県北杜市標高700ｍで稲作を中心に行う農業法人です。減農薬・有機肥料の特別栽培にこだわり「自然と人に優しい米 |
| 自然農菜園　はたけや | 甲州市 | Pan y cereal | https://www.tabechoku.com/producers/3077465 | 2015年に山梨県甲州市に移住。以来、除草剤や農薬、持込み肥料を一切使わない自然農で野菜や穀類をつくっています。 |
| 百笑　有田農園 | 留市 | Pan y cereal | https://www.tabechoku.com/producers/3078147 | 富士の湧水流れる自然豊かな山梨県都留市にて、夫婦でお米と固定種・在来種の野菜を育てています。農薬も肥料も使わず、自然の力を信じる「自然栽培」 |
| もぐもぐ農園 | 南アルプス市 | Fruta y verdura | https://www.tabechoku.com/producers/22231 | 先祖から受け継いだ農地で農業を営んでおります。 |
| For Farm | 山梨市 | Fruta y verdura | https://www.tabechoku.com/producers/3077819 | For Farmは、山梨県の峡東地域でおいしいぶどうを栽培しています。また、巨峰を栽培している「山梨市牧丘町」は、日本一の『巨峰の丘』として |
| ぶどうの樹 | 甲州市 | Fruta y verdura | https://www.tabechoku.com/producers/22215 | ぶどうの町、山梨県の「かつぬま町」で代々ぶどう農家をしています。今年は天候にも恵まれ、とても美味しいぶどうが育っています。 |
| 赤白園 | 甲州市 | Fruta y verdura | https://www.tabechoku.com/producers/23585 | 果樹王国山梨県勝沼町で 5代続く葡萄栽培をしています。 |
| 星野果樹園 | 笛吹市 | Fruta y verdura | https://www.tabechoku.com/producers/24945 | はじめまして! |
| 結理苑 | 北杜市 | ⚠ por decidir | https://www.tabechoku.com/producers/28389 | 結理苑の諸橋正達(青年農業士)と由理子です |
| 【富士信玄とうもろこし】大澤園 | 富士河口湖町 | ⚠ por decidir | https://www.tabechoku.com/producers/26893 | #【TVで話題沸騰中】一流レストラン御用達とうもろこし『富士信玄ブランド』 |
| アーリーファーム | 笛吹市 | ⚠ por decidir | https://www.tabechoku.com/producers/29231 | アーリーファームです。 |
