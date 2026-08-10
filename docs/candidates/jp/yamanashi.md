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
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/yamanashi> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 18, Setas 2, Pescado 1, Carne 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 丹波山倶楽部 | 丹波山村 | Setas | ficha | — | https://www.tabechoku.com/producers/23601 | 山梨県北都留郡丹波山村 |
| 甲州きくらげ | 甲州市 | Setas | ficha | — | https://www.tabechoku.com/producers/25092 |  |
| 結理苑 | 北杜市 | Pescado | ficha | — | https://www.tabechoku.com/producers/28389 |  |
| 大月のびのびファーム | 大月市 | Carne | ficha | — | https://www.tabechoku.com/producers/3078481 |  |
| 大和ファーム | 北杜市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23678 |  |
| こぴっと | 北杜市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22275 |  |
| Fairy Valley（フェアリーバレー） | 北杜市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28680 |  |
| and farm | 南アルプス市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28390 |  |
| もぐもぐ農園 | 南アルプス市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22231 |  |
| 【富士信玄とうもろこし】大澤園 | 富士河口湖町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/26893 | 山梨県南都留郡富士河口湖町 |
| For Farm | 山梨市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077819 |  |
| まるいち農産加工所 | 市川三郷町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23008 | 山梨県西八代郡市川三郷町 |
| HARU FARM | 甲州市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077591 |  |
| ぶどうの樹 | 甲州市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22215 |  |
| 自然農菜園　はたけや | 甲州市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077465 |  |
| 前田龍珠園 | 甲州市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20719 |  |
| 赤白園 | 甲州市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23585 |  |
| 百笑　有田農園 | 留市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078147 |  |
| 山の幸ファーム | 笛吹市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28620 |  |
| アーリーファーム | 笛吹市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29231 |  |
| HOPE園 | 笛吹市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24250 |  |
| 星野果樹園 | 笛吹市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24945 |  |
