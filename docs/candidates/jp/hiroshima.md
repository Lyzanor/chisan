# Hiroshima — candidatos

- CSV: `data/csv/jp/chugoku/hiroshima.csv` (62 filas tras la revisión integral de 2026-08-11).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/hiroshima> (56 bodegas, leído 2026-08-04). Gremio: 広島県酒造組合, <http://www.hirosake.or.jp/>.
- Estado: **9 integradas** el 2026-08-05 (7 `verificado`, 2 `parcial`); quedan 7 de la tabla y ~40 del censo. Evidencia en `data/evidence/jp/chugoku/hiroshima.jsonl`.

**西条 (Saijo), en Higashihiroshima, es una de las tres capitales del sake de
Japón** junto a Nada (Hyogo) y Fushimi (Kioto), con las bodegas alineadas en una
sola calle. Categoría para todas: `Sake`.

## Trampas
- **今田酒造本店 (Imada Shuzo Honten, Higashihiroshima)** ya está publicado
  como `imada-shuzo-honten-higashihiroshima`: no volver a proponerlo como alta
  nueva.
- ⚠ **北広島町 (Kitahiroshima, Hiroshima) no es 北広島市 (Kitahiroshima,
  Hokkaido)**. Mismo nombre, 1.400 km. Si la fila se escribe con el municipio a
  secas, el gate geográfico la manda a Hokkaido y es error bloqueante —
  o peor, resuelve al centroide equivocado sin quejarse.
- ⚠ **金光酒造 (Higashihiroshima)** no es 金光酒造 (Yamaguchi-shi), en
  `yamaguchi.md`. Mismo 社名, prefecturas vecinas.
- **アシードブリュー (Fukuyama)** es filial de un grupo de bebidas (Aseed Holdings):
  candidata a descarte por masa, mirar si tiene marca de sake propia.
- **川本英介** es un nombre de persona como razón social: confirmar el nombre
  comercial de la bodega antes de escribir el `nombre` de la fila.
- 西条 es un barrio de 東広島市 (Higashihiroshima), no un municipio; y hay un
  **西条市 (Saijo)** que es una ciudad de Ehime, en `ehime.md`.

## Qué falta
- Las ~43 bodegas restantes del censo, empezando por el resto de la calle de
  Saijo, que son las que tienen tienda y venta online.
- Sin abrir: **牡蠣 (ostra)** — Hiroshima produce en torno al 60% del nacional y
  hay cofradías y criaderos con marca; **レモン de Setoda/Ikuchijima** (casi todo
  el limón japonés); もみじ饅頭 (decenas de obradores en Miyajima), 広島菜漬,
  お好み焼き のソース (Otafuku y las casas pequeñas), 比婆牛.

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 17 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 株式会社セイコー珈琲 | 株式会社セイコー珈琲　安浦工場 他 | 広島県呉市安浦町大字中畑字堀田迫110-1　他 | 有機加工食品 | MPJP1210 |
| こだま食品株式会社 | こだま食品（株） | 広島県福山市駅家町法成寺1575-9 | 有機加工食品 | 04B-005（05C-007） |
| （株）ますやみそ　他 | （株）ますやみそ　他 | 広島県呉市焼山西2-2-8　他 | 有機加工食品 | 01-015B |
| （株）純正食品マルシマ | （株）純正食品マルシマ　新高山工場　他 | 広島県尾道市新高山3-1170-162　他 | 有機加工食品 | JM80202PR-0250-0 |
| 中国醤油醸造協同組合 | 中国醤油醸造協同組合 | 広島県東広島市河内町中河内190-1 | 有機加工食品 | JC010213PR-0298-0 |
| こだま試験農場株式会社 | 南山1　他 | 広島県世羅郡世羅町大字小国字南山1703-1　他 | 有機農産物 | 07A-030 |
| 株式会社出来商店 | 4号ハウス　他 | 広島県東広島市黒瀬町南方字水越1587　他 | 有機農産物 | SES-20070801 |
| 金光味噌（株） | 金光味噌株式会社出口工場　他 | 広島県府中市出口町1180　他 | 有機加工食品 | 01-006B |
| 株式会社やまみ | 株式会社やまみ　本社工場 | 広島県三原市沼田西町小原字袖掛73-5 | 有機加工食品 | 第1434号 |
| センナリ株式会社 | センナリ株式会社　他 | 広島県広島市安佐北区安佐町大字久地2683-25　他 | 有機加工食品 | 130902-001 |
| 有限会社ニシオカ | 製造所1 | 広島県広島市安佐南区東野3丁目5-3 | 有機加工食品 | 214-002 |
| 桑田　恒二 | 1　他 | 広島県福山市神辺町川北衆御領937-1、6（ハウス含む）　他 | 有機農産物 | 114-010 |
| 早志　健太郎 | 1　他 | 広島県東広島市福富町上竹仁段原山843-13　他 | 有機農産物 | 114-049 |
| 横山　豊富 | 1　他 | 広島県神石郡神石高原町油木乙670　他 | 有機農産物 | 114-072 |
| 寺岡有機農場有限会社 | 世羅A1　他 | 広島県世羅郡世羅町賀茂10144-151　他 | 有機農産物 | 114-078 |
| 豆の木 | 山本1　他 | 広島県安芸高田市吉田町下入江1485　他 | 有機農産物 | 115-010 |
| 引田　義道 | 1　他 | 広島県庄原市東城町竹森751番地　他 | 有機農産物 | 115-023 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/hiroshima.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
  - **propia** — búsqueda dirigida por producto; ficha o web propia del productor
- Estado: revisión 2026-08-11; **0 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/hiroshima.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/hiroshima.php> (nombre, dirección y web propia de cada socio)
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: revisión 2026-08-11; **6 retenidos** en la segunda pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 鶴屋安芸 | 仙呉市 | Dulces y repostería | 和菓子協会 | http://www.tsuruya-aki.co.jp/ | 仙呉市本通 4-7-8; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |
| 銀月堂 | 広島市 | Dulces y repostería | 和菓子協会 | http://www.enjoy.ne.jp/~gingetsudo/ | 広島市中区大手町 5-9-16; revisado 2026-08-11: retenido (404, falta confirmar actividad o unidad productiva) |
| ツネモト | 広島市 | Dulces y repostería | 和菓子協会 | http://okabe-bld.co.jp/tunemoto/ | 広島市安佐南区川内 1-18-22; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |
| にしき堂 | 広島市 | Dulces y repostería | 和菓子協会 | http://nisikido.lolipop.jp/ | 広島市東区光町 1-13-23; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |
| 藤い屋 | 廿日市市 | Dulces y repostería | 和菓子協会 | http://www.fujiiya.co.jp/ | 廿日市市宮島町 1129; revisado 2026-08-11: retenido (403, falta confirmar actividad o unidad productiva) |
| 寺本水産 | ⚠ | Pescado | búsqueda dirigida + web propia | https://www.teramotosuisan.jp/ | ⚠ municipio sin confirmar; ostra de Hiroshima; revisado 2026-08-11: retenido (200, falta confirmar actividad o unidad productiva) |

## Nuevos candidatos de cerveza artesana — barrido 2026-08-13

Barrido sistemático de microcervecerías artesanales independientes con obrador propio, marca activa, presencia web y redes sociales. Categoría: `Cerveza`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Instagram | Notas de producción |
|---|---|---|---|---|---|---|