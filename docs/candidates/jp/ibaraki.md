# Ibaraki — candidatos

- CSV: `data/csv/jp/kanto/ibaraki.csv` (13 filas, todas altas de esta pasada).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (consolidado 2026-08-04), bloque de Ibaraki. Fuentes que cita: el portal de exportación de la prefectura <https://exports.pref.ibaraki.jp/en/company/> (ficha por empresa), 日本酒造組合中央会 <https://japansake.or.jp/sakagura/en/ibaraki/> y web propia.
- Estado: **13 integradas** en el CSV el 2026-08-04 como `parcial` — las que traen dominio propio. Quedan 21: 8 con solo ficha del portal de exportación, 3 sin municipio usable, 2 órganos colectivos, 1 filial industrial (Calbee) y las 6 bodegas del gremio sin web localizada.

`A`/`B` es la clasificación del listado de origen: **A** = productor de origen
(explotación propia, cooperativa, transformación ligada a materia prima
regional); **B** = productor real y arraigado del que **solo valen los productos
concretos con origen local verificable**. Una `B` no es una fila peor, es una
fila que hay que acotar antes de escribirla.

| nombre | municipio | categoría | A/B | web / fuente |
|---|---|---|---|---|
| Isemata Beikoku Seifun | Hitachiota | Pan y cereal | A | soba-isemata.com |
| Iijima Chikusan | Hokota | Carne | A | iijima1129.co.jp |
| Iiyama Seicha | Yachiyo | Té e infusiones | A | ficha exports.pref.ibaraki.jp (id 715446) |
| Sashima Tea Producer Export Council | Yachiyo | Té e infusiones | A | sashimacha.jp ⚠ es un consejo exportador, no un productor |
| Hitachi Fugetsudo | Hitachi | Dulces y repostería | A | ficha exports.pref.ibaraki.jp (id 715380) |
| Fujita Apple Orchard | Daigo | Fruta y verdura | A | applefujita-llc.com |
| Fukasaku Farm | Hokota | Fruta y verdura | A | fukasaku.com |
| Terunuma | Tokai | Fruta y verdura | A | ficha exports.pref.ibaraki.jp (id 714729) |
| Nemoto Tsukemono | Mito | Conservas | A | nemotuke.com |
| Ibaraki Mogitate Factory | Ibaraki (町) | Comida preparada | A | ficha exports.pref.ibaraki.jp (id 715034) |
| Tsukuba Gingko Production Association | Ishioka | Frutos secos | A | tsukuba-gingko.com ⚠ asociación de productores |
| Aoki Brewing | Koga | Sake | B | japansake.or.jp (gremio) |
| Kiuchi Brewery 1823 | Naka | Sake | B | kiuchibrewery.co.jp ⚠ ver nota |
| Sudo Honke | Kasama | Sake | B | japansake.or.jp (gremio) |
| Yoshikubo Sake Brewery | Mito | Sake | B | japansake.or.jp (gremio) |
| Raifuku Sake Brewing | Chikusei | Sake | B | japansake.or.jp (gremio) |
| Nishioka-Honten | Sakuragawa | Sake | B | japansake.or.jp (gremio) |
| Tsukinoi Shuzouten | Oarai | Sake | B | japansake.or.jp (gremio) |
| Komatsu Suisan | Kitaibaraki | Pescado | B | shirasu.com |
| Nemotoen | Bando | Té e infusiones | B | nemotoen.com |
| Fujiya / Tsukuba Purin | Sakuragawa | Dulces y repostería | B | ficha exports.pref.ibaraki.jp (id 715108) |
| Hanamizuki | Tsukuba | Dulces y repostería | B | ficha exports.pref.ibaraki.jp (id 715270) |
| Kamejirushi Confectionery | Mito | Dulces y repostería | B | kamejirushi.co.jp |
| Kogetsuan | ⚠ sin municipio | Dulces y repostería | B | ficha exports.pref.ibaraki.jp (id 715050) |
| Kasyo Miyakawa | Daigo | Dulces y repostería | B | ficha exports.pref.ibaraki.jp (id 715184) |
| Calbee Kaitsuka Sweet Potato | Kasumigaura | Fruta y verdura | B | exports.pref.ibaraki.jp ⚠ filial de Calbee |
| Daruma Foods | ⚠ sin municipio | Legumbres | B | ficha exports.pref.ibaraki.jp (id 714641) |
| Higeta Shokuhin | ⚠ sin municipio | Legumbres | B | ficha exports.pref.ibaraki.jp (id 714756) |
| Kozawa Foods | Naka | Legumbres | B | kozawafoods.jp |
| Kurosawa Shoyuten | Hitachinaka | Condimentos | B | fujini-shouyu.co.jp |
| Shibanuma Soy Sauce | Tsuchiura | Condimentos | B | shibanuma.com |
| Anko no Machi | Kitaibaraki | Comida preparada | B | ficha exports.pref.ibaraki.jp (id 715220) |
| Meiri Shurui | Mito | Destilados y licores | B | meirishurui.com |
| Kiuchi Brewing and Distilling / Hitachino Nest | Naka | Cerveza | B | kiuchibrewery.co.jp ⚠ ver nota |

## Trampas de este bloque

- **Kiuchi son dos filas del listado y una sola empresa** (木内酒造, Naka): sake e
  Hitachino Nest. El propio xlsx lo admite («125 registros / 124 entidades»).
  La identidad del catálogo es `slug` dentro del área, así que **es una fila**,
  con `categoria` `Sake` o `Cerveza` según lo que pese, no dos.
- **Ojo con el otro Kiuchi**: 木内醸造 (Kiuchi Jyouzou, marca Hatsuuguisu) está en
  Saku, Nagano, y es una empresa distinta. Casar por municipio, no por apellido.
- **Tres filas traen «Ibaraki» como localidad**, que es la prefectura, no un
  municipio. Y hay dos «Ibaraki» reales en Japón: 茨城町 (esta prefectura) y
  茨木市 en Osaka. Resolver el municipio antes de escribir la fila, o el gate
  geográfico la manda al otro extremo del país.
- **Sashima Tea Producer Export Council** y **Tsukuba Gingko Production
  Association** son órganos colectivos: entran solo si comercializan marca propia
  (`docs/EDITORIAL_POLICY.md`), y si no, se sustituyen por sus socios.
- **Calbee Kaitsuka** es filial de un grupo industrial cotizado: candidata a
  descarte por masa, salvo que la línea de batata local se sostenga sola.
- Las fichas `exports.pref.ibaraki.jp` son de un portal de exportación: confirman
  identidad y localización, no actividad ni venta online. Solo sostienen `parcial`.

## Sake: el resto del gremio (13, pasada 2026-08-04)

Medido el hueco que avisaba el «Qué falta»: el censo son **45 bodegas** y arriba
había 7. Fuente: <https://jp.sake-times.com/sakagura/ibaraki>. Deduplicado
contra el CSV (木内酒造) y contra la tabla de arriba (青木酒造). Ninguna trae
dominio. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Aiyu Shuzo | 愛友酒造 | Itako |
| Asakawa Shuzo | 浅川酒造 | Hitachiomiya |
| Isaka Shuzoten | 井坂酒造店 | Hitachiota |
| Ota Meijo | 太田銘醸 | Hitachiota |
| Okabe | 岡部合名 | Hitachiota |
| Goretsu Tominaga Shuzoten | 剛烈富永酒造店 | Hitachiota |
| Ishioka Shuzo | 石岡酒造 | Ishioka |
| Isokura Shuzo | 磯蔵酒造 | Kasama |
| Inaba Shuzo | 稲葉酒造 | Tsukuba |
| Urazato Shuzoten | 浦里酒造店 | Tsukuba |
| Iekyucho Honten | 家久長本店 | Daigo |
| Kahoku Shuzo | 珂北酒造 | Daigo |
| Kinmon Shuzo | 金門酒造 | Toride |

**宏和商工 日立酒造工場 (Hitachi)** es una planta de un grupo: triar antes de
escribir fila.

## Qué falta
- El bloque de sake son 7 bodegas y el gremio de Ibaraki lista bastantes más.
  El listado de origen es una **selección**, no el censo: medir contra
  `japansake.or.jp/sakagura/en/ibaraki/`.
- Ningún dominio comprobado en vivo, y varias filas solo traen la ficha del
  portal: encontrar la web propia es el primer trabajo de cada lote.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 株式会社　オーピーシートレーディング | 株式会社　オーピーシートレーディング　水戸工場 | 茨城県水戸市成沢町457－3 | 有機加工食品 | カ-06-01 |
| 鯉淵学園農業栄養専門学校 | 鯉淵学園農業栄養専門学校 | 茨城県水戸市鯉淵町5965 | 有機農産物 | 02-003 |
| 茨城県有機稲作協議会 | 1（墓地裏）　他 | 茨城県筑西市桑山3560　他 | 有機農産物 | AFASSEQ-AA-010806 |
| (有)森ファームサービス | 1　他 | 茨城県古河市上片田原岸963-1　他 | 有機農産物 | S-033 |
| 永塚文男 | 1　他 | 茨城県古河市女沼宿下1202-2　他 | 有機農産物 | S-077 |
| つくばいしだファーム | １　他 | 茨城県つくば市上郷7923　他 | 有機農産物 | AFASSEQ-AA-010802 |
| 鴻巣　仁 | 鴻巣農園（鴻巣　仁） | 茨城県石岡市小野越亀尻106-2　他 | 有機農産物 | 05-001 |
| モアーク食品株式会社 | モアーク食品株式会社 モアーク食品 つくば有機農産物加工センター 他 | 茨城県つくば市上郷1068-7 他 | 有機加工食品 | 2006M-4 |
| 平田敬義 | １　他 | 茨城県稲敷市稲波1861-5・6　他 | 有機農産物 | S-063 |
| すがの農場有限会社 | 加幸沢田んぼ　他 | 茨城県日立市十王町伊師3746　他 | 有機農産物 | AFASSEQ－AA－010401 |
| 株式会社朝一番 | 株式会社朝一番　本社工場 | 茨城県土浦市小山田1-265 | 有機加工食品 | 第1026号 |
| 鈴木　英也 | 鈴木英也農園 | 茨城県石岡市下林字薊ヶ原2448-172　他 | 有機農産物 | 01-016 |
| (有)くらぶコア | 長久保1　他 | 茨城県行方市次木690-4、5　他 | 有機農産物 | NA-07032901 |
| 小田　貴史 | 小田農園 | 茨城県小美玉市下吉影2422-1他 | 有機農産物 | 04-020 |
| 山﨑正志 | 山崎正志5他 | 茨城県坂東市庄右衛門新田川西1060、1061他 | 有機農産物 | JY000828-FA0066-0 |
| 広瀬　平一郎 | 広瀬農場 | 茨城県石岡市石沢台780他 | 有機農産物 | 01-004 |
| 柳　志津雄 | 柳農園 | 茨城県小美玉市倉数原山601-69 | 有機農産物 | 04-022 |
| 鬼沢　寛 | 鬼沢農園 | 茨城県鉾田市烟田内野1851-8他 | 有機農産物 | 04-013 |
| 金沢　正一 | 金沢農園 | 茨城県鉾田市借宿野子堀2259-4　他 | 有機農産物 | 04-014 |
| 武藤　大悟 | むとう農園 | 茨城県石岡市栄松14174-3他 | 有機農産物 | 07-006 |
