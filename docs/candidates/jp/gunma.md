# Gunma — candidatos

- CSV: `data/csv/jp/kanto/gunma.csv` (1 fila: Hoshino Bussan, cereal). Dedup: ninguna de abajo solapa.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/gunma> (27 bodegas, leído 2026-08-04). Gremio: 群馬県酒造組合, <http://www.gunma-sake.or.jp/>.
- Estado: cola abierta, 16 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Tsuchida Shuzo | 土田酒造 | Kawaba |
| Nagai Shuzo | 永井酒造 | Kawaba |
| Nagai Honke | 永井本家 | Numata |
| Otone Shuzo | 大利根酒造 | Numata |
| Asama Shuzo | 浅間酒造 | Naganohara |
| Kimusume Shuzo | 貴娘酒造 | Nakanojo |
| Shimaoka Shuzo | 島岡酒造 | Ota |
| Imai Shuzoten | 今井酒造店 | Ota |
| Kondo Shuzo | 近藤酒造 | Midori |
| Okamura | 岡村合名 | Takasaki |
| Takai | 高井 | Fujioka |
| Tajima Shuzoten | 田島酒造店 | Fujioka |
| Shibazaki Shuzo | 柴崎酒造 | Yoshioka |
| Shimizuya Shuzo | 清水屋酒造 | Tatebayashi |
| Shotoku Meijo | 聖徳銘醸 | Kanra |
| Ida Shuzo | 井田酒造 | Tamamura |

## Trampas
- **Dos 永井 en 10 km**: 永井酒造 (marca 水芭蕉, Kawaba) y 永井本家 (Numata). Son
  empresas distintas; casar por 社名 completo y municipio, no por apellido.
- 吾妻郡, 佐波郡, 北群馬郡, 甘楽郡, 利根郡 no son municipio: la fila lleva el
  町/村 — Naganohara, Tamamura, Yoshioka, Kanra, Kawaba.
- **玉村町 (Tamamura)** es un municipio de Gunma, y **玉村本店 (Tamamura Honten)**
  es la cervecera de Shiga Kogen que ya está en `data/csv/jp/chubu/nagano.csv`.
  Homónimo puro: nada que ver.

## Qué falta
- Las ~11 bodegas restantes del censo.
- Sin abrir: konjac (Gunma hace >90% del nacional y no hay ninguna fila), udon de
  Mizusawa, 下仁田ねぎ (puerro con GI), 嬬恋 col, cerdo de Joshu, 焼きまんじゅう.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| JAたのふじ有機農業研究会 | 御供秀夫　他 | 群馬県藤岡市浄法寺1216-3　他 | 有機農産物 | 9806-101-00 |
| （株）山和エンヂニアリング | （株）山和エンヂニアリング　粉体事業部 | 群馬県高崎市上豊岡町575-15 | 有機加工食品 | 第1202号 |
| 有限会社ワタミファーム倉渕農場 | 30　他 | 群馬県吾妻郡東吾妻町萩生字熊野原2952-34　他 | 有機農産物 | A03-071803 |
| 甘楽町有機農業研究会 | 黒澤繁雄　他 | 群馬県甘楽郡甘楽町大字白倉840　他 | 有機農産物 | 9906-107-00 |
| 相模屋食料株式会社 | 相模屋食料株式会社　第二工場　他 | 群馬県前橋市小神明神703　他 | 有機加工食品 | 第1311号 |
| TKオーガニック(株) | TKオーガニック(株)　他 | 群馬県高崎市棟高町787-23 他 | 有機加工食品 | JH010322PR-0357-0 |
| (有)古代米浦部農園 | 2　他 | 群馬県藤岡市鮎川字川後340-1　他 | 有機農産物 | S-044 |
| 日本デルモンテ（株） 群馬工場 | 日本デルモンテ（株） 群馬工場　他 | 群馬県沼田市清水町3748　他 | 有機加工食品 | 010219-002 |
| 銀河高原ファーム | 後藤明宏 | 群馬県吾妻郡高山村中山6756　他 | 有機農産物 |  |
| くらぶち草の会 | 内堀幸雄　14榛名道日なた畑　他 | 群馬県高崎市倉渕町三塚原5398　他 | 有機農産物 | JK050426FA-0824-0 |
| 正田醤油株式会社 | 正田醤油株式会社館林工場　他 | 群馬県館林市栄町14-1　他 | 有機加工食品 | GMJP1053 |
| グリンリーフ株式会社 | 蒟蒻工場 | 群馬県利根郡昭和村赤城原844-14 | 有機加工食品 | JG001027PR-0112-0 |
| 赤城自然栽培組合 | 新木篤志 開墾上 004-016 | 群馬県利根郡昭和村赤城原496-1,497-1 | 有機農産物 | JG001027FA-0114-2 |
| ㈱野菜くらぶ | グリンリーフ増反上 012-004 他 | 群馬県利根郡昭和村赤城原849 他 | 有機農産物 | JG001027FA-0112-0 |
| ㈱タカハシ乳業 | ㈱タカハシ乳業他 | 群馬県前橋市総社町高井49他 | 有機加工食品 | JT080115PR-1028-0 |
| マルサンアイ株式会社 関東工場 | マルサンアイ（株） 関東工場　他 | 群馬県利根郡みなかみ町政所1010　他 | 有機加工食品 | 08-051B |
| 株式会社セイワ食品 | 株式会社セイワ食品 | 群馬県高崎市高砂町304番地　他 | 有機加工食品 | カ-08-01 |
| 上州なっぱの会 | 加部精一　ほ場1　他 | 群馬県吾妻郡東吾妻町萩生3576　他 | 有機農産物 | 2008F-1 |
| 清水　健一 | 創葉舎（清水　健一、清水　英子） | 群馬県北群馬郡榛東村新井3725-2　他 | 有機農産物 | 08-007 |
| （株）岡直三郎商店 大間々工場 | （株）社岡直三郎商店 大間々工場 | 群馬県みどり市大間々町大間々1012 | 有機加工食品 | 08-054B |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/gunma.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/gunma.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/gunma.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **6 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 栄光堂 | 前橋市 | Dulces y repostería | 和菓子協会 | http://www.eikoudo.com/ | 前橋市昭和町 2-4-9 |
| 新妻屋 | 前橋市 | Dulces y repostería | 和菓子協会 | http://www.okashi-niitsumaya.com/ | 前橋市表町 2-19-9 |
| 鉢の木七冨久 | 高崎市 | Dulces y repostería | 和菓子協会 | http://www.hachinoki-s.com/ | 高崎市赤坂町 73 |
| 老舗三俣せんべい株式会社 | 前橋市 | Aperitivos | 全国米菓工業組合 | http://mitsumata-senbei.com/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 赤城食品㈱ | 太田市 | Pan y cereal | 全乾麺 | http://www.akagishokuhin.co.jp/ | 機械製乾めん |
| 株式会社館林うどん | 館林市 | Pan y cereal | 全乾麺 | http://www.the-udon.com/ | 機械製乾めん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/gunma.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/gunma> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 13, Setas 2, Carne 2, Miel 1, Té e infusiones 1, Pescado 1, Condimentos 1, Pan y cereal 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 百∞蜜 ももみつ | 長野原町 | Miel | ficha | — | https://www.tabechoku.com/producers/28735 | 群馬県吾妻郡長野原町 |
| ぐんま製茶 | 桐生市 | Té e infusiones | ficha | — | https://www.tabechoku.com/producers/21072 |  |
| 沼田きのこ園 | 沼田市 | Setas | ficha | — | https://www.tabechoku.com/producers/23646 |  |
| キノコ・輪大 | 高崎市 | Setas | ficha | — | https://www.tabechoku.com/producers/26818 |  |
| PureOrto(ピュアオルト) | 高崎市 | Pescado | ficha | — | https://www.tabechoku.com/producers/26181 |  |
| 近藤スワインポーク | 前橋市 | Carne | ficha | — | https://www.tabechoku.com/producers/25993 |  |
| 堀越ファーム | 藤岡市 | Carne | ficha | — | https://www.tabechoku.com/producers/25962 |  |
| ベリーこいど園 | 下仁田町 | Condimentos | ficha | — | https://www.tabechoku.com/producers/24204 | 群馬県甘楽郡下仁田町 |
| 金井農園 | 沼田市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/26157 |  |
| 松井ファーム | 前橋市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25729 |  |
| めぐみ農園 | 嬬恋村 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29473 | 群馬県吾妻郡嬬恋村 |
| 小川農園　Ogawa  Farmers | 富岡市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077361 |  |
| マルイ農園 | 富岡市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/27620 |  |
| 福ちゃん農園 | 沼田市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28560 |  |
| 菜の実工房 | 渋川市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077851 |  |
| Strawberry farm 木村農園 | 藤岡市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22260 |  |
| 木菜米ルファーム | 邑楽町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29620 |  |
| 佐藤悠治 | 長野原町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/26279 | 群馬県吾妻郡長野原町 |
| KimidoriFarm＆Kitchen | 高山村 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078535 | 群馬県吾妻郡高山村 |
| 十文字ヴィレッジ | 高崎市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20820 |  |
| いいじま農園 | 高崎市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/26107 |  |
| しおこぶファーム | 高崎市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077965 |  |
