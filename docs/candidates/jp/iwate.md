# Iwate — candidatos

- CSV: `data/csv/jp/tohoku/iwate.csv` (59 filas tras la revisión integral de 2026-08-11).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/iwate> (22 bodegas, leído 2026-08-04). Gremio: 岩手県酒造組合, <http://www.ginga.or.jp/~syuzou/>.
- Estado: **6 integradas** el 2026-08-05, todas `verificado`, 5 con tienda propia — el mejor ratio de venta directa de la pasada. Evidencia en `data/evidence/jp/tohoku/iwate.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

## Trampas
- **紫波町 (Shiwa) concentra cuatro bodegas** con apellidos frecuentes
  (高橋, 廣田): casar por 社名 completo, no por apellido.
- 世嬉の一 hace además cerveza (いわて蔵ビール) en la misma casa: es **una fila**,
  no dos, con la `categoria` que pese.

## Qué falta
- Las ~8 bodegas restantes del censo.
- Sin abrir: wanko-soba y fideos de Morioka, 南部鉄器 (no alimentario), lácteos de
  Kuzumaki, marisco de Sanriku, 醤油/味噌 de Hanamaki.

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 18 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 有限会社旭農園 | 1　他 | 岩手県北上市和賀町岩崎新田曙2-1　他 | 有機農産物 | AFASSEQ-AA-010821 |
| 株式会社丸越 | 本社保冷庫　他 | 岩手県一関市花泉町金沢字運南田171-1　他 | 有機加工食品 | JM021210PR-0810-0 |
| 有限会社阿部農産 | 1　他 | 岩手県胆沢郡金ヶ崎町永沢迎谷起30　他 | 有機農産物 | AFASSEQ-AA-050813 |
| 大東町有機農産物等生産組合 | 小島幸喜　1　他 | 岩手県一関市大東町沖田字大住110　他 | 有機農産物 | S-029 |
| 東日本産業（株） | 東日本産業（株）原料倉庫　他 | 岩手県紫波郡紫波町犬渕字谷地田116-7他 | 有機加工食品 | JH030212PR-0597-0 |
| 公益社団法人藤沢農業振興公社 | 手づくり（有）館ヶ森ハム工房　1他 | 岩手県一関市藤沢町黄海字衣井沢山44番地1 他 | 有機農産物 | 2003F-9 |
| 無天塾 | 家の前1 他 | 岩手県盛岡市下田字生出90-1-イ　他 | 有機農産物 | NA-09033001 |
| しずくいし環境にやさしい稲作の会　代表 滝沢藤七 | 志戸前-１、他 | 岩手県岩手郡雫石町御明神４-１０３-４０５、他 | 有機農産物 | OA-11-298-08 |
| マル庄　代表　庄司敬介 | 4-1 | 岩手県滝沢市鵜飼安達176番1 | 有機農産物 | OA-17-293-11 |
| 株式会社　いわき農園 | 荒川ハウス1号（荒川1号）　他 | 岩手県下閉伊郡山田町荒川3地割69番地　他 | 有機農産物 | 600606P125 |
| 農事組合法人　アグリ笹森 | 農事組合法人　アグリ笹森 | 岩手県奥州市水沢笹森谷地32-1,32-2 他 | 有機農産物 | 600606P133 |
| 有限会社　かさい農産 | 弥栄1-1 他 | 岩手県一関市弥栄字上谷起51-1 他 | 有機農産物 | 600606P142 |
| 一般社団法人　すばる | 前森山畑⑦ | 岩手県八幡平市田頭13-7 | 有機農産物 | OA-22-122-13 |
| 太子食品工業株式会社　雫石工場 | 太子食品工業株式会社　雫石工場 | 岩手県岩手郡雫石町長山林ノ沢111−1 | 有機農産物 | FFJP9277 |
| 株式会社太極舎 | 暁ブルワリー　八幡平ファクトリー | 岩手県八幡平市松尾寄木1-474-6 | 有機加工食品(酒類を含む) | J13B-2224 |
| 株式会社 岩泉きのこ産業 | 落合（1号棟～10号棟）他 | 岩手県下閉伊郡岩泉町浅内字下栗畑68-11 他 | 有機農産物 | A23-030901 |
| 株式会社一関山本農場 代表取締役　山本佳範 | 652 他 | 岩手県一関市中里字上大林520-1、2　他 | 有機農産物 | S-255 |
| 農事組合法人みずほ | 1 他 | 岩手県花巻市野田553番地 | 有機農産物 | S-332 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/iwate.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión 2026-08-11; **1 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| たまやま温泉Lab | Morioka | Lácteos y quesos | ChFun | — | sin dominio en la fuente; revisado 2026-08-10: la guía no pudo enlazarse con una fuente primaria actual y localización completa |

**Ya integrado, no volver a proponer:** 世嬉の一酒造 ya está en `iwate.csv`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/iwate.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/iwate.php> (nombre, dirección y web propia de cada socio)
- Estado: revisión 2026-08-11; **2 retenidos** en la segunda pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 菓子処おざわ | 一関市 | Dulces y repostería | 和菓子協会 | http://www.echna.ne.jp/~okashi | 一関市花泉町字地平 17-23; revisado 2026-08-11: retenido (404, falta confirmar actividad o unidad productiva) |
| 大丸屋 | 盛岡市 | Dulces y repostería | 和菓子協会 | http://www.e-daimaruya.com/ | 盛岡市本町通 1-9-42; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |
