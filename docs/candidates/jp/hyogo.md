# Hyogo — candidatos

- CSV: `data/csv/jp/kansai/hyogo.csv`.
- Fuente: 灘五郷酒造組合 (Nada Gogo Sake Brewers Association), <https://www.nadagogo.ne.jp/brewery/> — los 25 miembros (24 de sake, 1 de encurtidos), agrupados por los cinco 郷.
- Estado: **8 integradas** el 2026-08-05 (6 `verificado`, 2 `parcial`), 4 con tienda propia; quedan 17 de Nada y 11 del resto de la prefectura. Evidencia en `data/evidence/jp/kansai/hyogo.jsonl`.

Nada es la mayor zona sakera de Japón y toda ella cae en dos municipios:
神戸市 (Kobe) y 西宮市 (Nishinomiya). Los cinco 郷 son barrios, no municipios:
西郷/御影郷/魚崎郷 están en Kobe (灘区 y 東灘区), 西宮郷/今津郷 en Nishinomiya.
Para el CSV, `municipio` = `Kobe` o `Nishinomiya`.

Categoría: `Sake` salvo la última fila.

| nombre (rōmaji propuesto) | 社名 | marca | 郷 | municipio |
|---|---|---|---|---|
| Takara Shuzo | 宝酒造 | 松竹梅 | 魚崎郷 | Kobe ⚠ |

## Fuera de Nada (11, pasada 2026-08-04)

Primera mordida al resto de la prefectura, que es lo que pedía el «Qué falta».
El censo son **97 bodegas** — Hyogo es la primera de Japón en número — frente a
las 25 de Nada. Fuente: <https://jp.sake-times.com/sakagura/hyogo>, orden
alfabético. Deduplicado contra la tabla de Nada. Ninguna trae dominio.
Categoría: `Sake`.

## Trampas de este bloque
- **伊丹老松酒造 (Itami) y 老松酒造 (Shiso) son dos empresas**, y hay una tercera
  老松酒造 en Hita (Oita). Casar por 社名 completo y municipio.
- **茨木酒造 está en Akashi (Hyogo)**, no en 茨木市 (Osaka) ni en 茨城県. El
  apellido no es la localización — la trampa contraria a la que ya avisa
  `ibaraki.md`.
- **稲見酒造 (Miki, Hyogo)** no es 井波酒造 (Sabae, Fukui) pese al rōmaji Inami, y
  encima **稲美町 (Inami)** es un municipio distinto de esta misma prefectura donde
  están 井澤本家 y 栄泉酒造. Rōmaji `Inami` = tres cosas.
- **江井ヶ嶋酒造 (Akashi)** hace además whisky (ホワイトオーク) y vino: una fila,
  con la `categoria` que pese.

## Qué falta
- Hyogo es mucho más que Nada: falta el resto del gremio prefectural
  (兵庫県酒造組合連合会, <https://hyogo-sake.or.jp/>), que agrupa las otras zonas
  (播州, 但馬, 丹波…). Ese listado es el siguiente lote natural.
- Sin abrir: carne de Tajima/Kobe, 明石 pescado, 淡路 cebolla, soja/miso.

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 20 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| （株）藤田食品 | （株）藤田食品　本社工場 | 兵庫県川西市東久代2‐6‐5 | 有機加工食品 | 第1056-B号 |
| 株式会社ファイン | 株式会社ファイン上郡工場　他 | 兵庫県赤穂郡上郡町奥甲931 他 | 有機加工食品 | 05B-002、14C-001、17C-002 |
| マルカン酢（株） | マルカン酢（株）本社工場 | 兵庫県神戸市東灘区向洋町西5-6 | 有機加工食品 | 第1061号 |
| 澁谷嘉一 | 1　他 | 兵庫県神戸市西区伊川谷町花折1167他 | 有機農産物 | 01A-008-2 |
| UCC上島珈琲株式会社六甲アイランド工場 | UCC上島珈琲株式会社　六甲アイランド工場 | 兵庫県神戸市東灘区向洋町西2丁目4番 | 有機加工食品 | MPJP1338 |
| 中務　喜紹 | 1　他 | 兵庫県豊岡市出石町口小野スクモヅカ2022　他 | 有機農産物 | 06A-010 |
| 三栄薬品貿易株式会社 | 三栄薬品貿易株式会社　西神研究所 | 兵庫県神戸市西区室谷2-2-5 | 有機加工食品 | 05B-007 |
| 吉田ピーナツ食品株式会社 | 吉田ピーナツ食品株式会社　本社工場　他 | 兵庫県神戸市長田区神楽町2-3-22　他 | 有機加工食品 | 第1241号 |
| キングフーズ株式会社 | キングフーズ株式会社本社工場 | 兵庫県高砂市荒井町新浜2丁目12番1号 | 有機加工食品 | 02B-009 |
| 神戸紅茶(株) | 神戸紅茶(株)　他 | 兵庫県神戸市東灘区住吉浜町16-2　他 | 有機加工食品 | JS010214PR-0607-0 |
| 井関義次 | 1　他 | 兵庫県丹波篠山市西吹中ノ瀬坪515ｰ1　他 | 有機農産物 | 02A-018 |
| 後藤透 | 1　他 | 兵庫県丹波篠山市八上上中溝480　他 | 有機農産物 | 02A-021 |
| （株）ヒヨバク | （株）ヒヨバク　本社工場 | 兵庫県神戸市西区伊川谷町潤和字京田951-1 | 有機加工食品 | 第1133号 |
| マエカワテイスト（株）　加西工場 | マエカワテイスト（株）　加西工場 | 兵庫県加西市繁昌町字森ガハナ甲903-29 | 有機加工食品 | JM00628PR-0838-0 |
| 髙木　力 | 圃場1 | 兵庫県丹波市市島町与戸2392 | 有機農産物 | 00A-011 |
| 有限会社相沢食産 | 相沢食産香寺工場 | 兵庫県姫路市香寺町岩部336-7 | 有機加工食品 | 01B-016 |
| ハマヤ株式会社　関西工場 | ハマヤ株式会社　関西工場 | 兵庫県伊丹市東有岡3-323 | 有機加工食品 | JH10322PR-0811-0 |
| 株式会社　山本貢資商店 | （株）山本貢資商店 | 兵庫県西宮市山口町阪神流通センター1-107-1 | 有機加工食品 | JY991005PR-0717-0 |
| 植垣米菓（株） | 植垣米菓（株） | 兵庫県加古川市平岡町高畑520-10 | 有機加工食品 | JU010202PR-0269-0 |
| 古跡真一 | 1　他 | 兵庫県加東市山国東野2013-29　他 | 有機農産物 | 05A-003 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/hyogo.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión 2026-08-11; **3 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| AI-N International (六甲ビール) | Kobe | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 小西酒造 | Itami | Cerveza | JBA | — | matriz de sake histórica; sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 明石ビール工房TOKI | Akashi | Cerveza | JBA | toki-akashi.com | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

**Ya integrado, no volver a proponer:** 白鶴酒造 ya está en `hyogo.csv`, así que 神戸ワイナリー sería otra fila del mismo grupo, no un alta nueva.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/hyogo.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/hyogo.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: revisión 2026-08-11; **4 retenidos** en la segunda pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 春光堂 | 加古川市 | Dulces y repostería | 和菓子協会 | http://shunkodo.com/ | 加古川市加古川町寺家町 11-2; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |
| 藤江屋分大 | 明石市 | Dulces y repostería | 和菓子協会 | http://www.f-bundai.co.jp/ | 明石市本町 1-12-17; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |
| 植垣米菓株式会社 | 加古川市 | Aperitivos | 全国米菓工業組合 | http://www.uegaki-beika.co.jp | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |
| 高尾製粉製麺㈱ | 姫路市 | Pan y cereal | 全乾麺 | http://takaoseimen.co.jp/ | 機械製乾めん; revisado 2026-08-11: retenido (403, falta confirmar actividad o unidad productiva) |

## Retenidos del barrido de Kobe — 2026-08-14

| candidato | municipio | carencia actual |
|---|---|---|
| 神戸ワイナリー (Kobe Winery / 神戸ワイン) | Kobe | La asociación cedió la fabricación y venta a 白鶴酒造 el 2024-12-01 y cerró tienda, visitas y café. Falta una fuente directa posterior al traspaso que demuestre una unidad productiva pública separada de la fila ya publicada de Hakutsuru. |
| Nick (ニック) | Kobe | La web correcta es <https://nick.co.jp/> y la operadora de la tienda es 株式会社ブロケード; `nick.style` pertenece a una persona ajena. La oferta propia está clara, pero no la unidad donde se elaboran los productos cárnicos. |
| 大井肉店 (Oi Nikuten) | Kobe | La dirección vigente es 元町通7-2-5, no 元町通5-6-4. La tienda y sus preparados están activos, pero la fuente propia revisada no atribuye su elaboración a esa unidad. |

## Nuevos candidatos de pescado y marisco artesanal — barrido 2026-08-14

Barrido sistemático de productores, elaboradores y acuicultores artesanos de pescado y marisco de Hyogo con instalaciones productivas propias, marca activa y venta/presencia web directa. Categoría: `Pescado`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Descripción / Especialidad | Fuente |
|---|---|---|---|---|---|---|
| **嶋本水産 (Shimamoto Suisan)** | 株式会社嶋本水産 | `淡路市` | Pescado | https://shimamoto-suisan.com/ |Elaborador artesano en la isla de Awaji; secado y ahumado con carbón vegetal tradicional de pescados frescos de la bahía de Osaka y el mar interior de Seto (himono). ⚠ Reviewed 2026-08-14: hold; the proposed domain is invalid, mismatched or insufficient and no current source yet establishes every admission claim.| Web oficial / Registro de productores de Awaji |
