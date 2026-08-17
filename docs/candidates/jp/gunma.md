# Gunma — candidatos

- CSV: `data/csv/jp/kanto/gunma.csv` (1 fila: Hoshino Bussan, cereal). Dedup: ninguna de abajo solapa.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/gunma> (27 bodegas, leído 2026-08-04). Gremio: 群馬県酒造組合, <http://www.gunma-sake.or.jp/>.
- Estado: revisión integral cerrada el 2026-08-11; las entradas no publicadas se conservan abajo con la carencia concreta que impide incorporarlas.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

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

> **Reauditoría 2026-08-11:** 20 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

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
- Estado: revisión 2026-08-11; **0 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

## Nuevos candidatos de cerveza artesana — barrido 2026-08-13

Barrido sistemático de microcervecerías artesanales independientes con obrador propio, marca activa, presencia web y redes sociales. Categoría: `Cerveza`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Instagram | Notas de producción |
|---|---|---|---|---|---|---|
