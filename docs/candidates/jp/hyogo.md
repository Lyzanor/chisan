# Hyogo — candidatos

- CSV: `data/csv/jp/kansai/hyogo.csv` (8 filas, altas del 2026-08-05).
- Fuente: 灘五郷酒造組合 (Nada Gogo Sake Brewers Association), <https://www.nadagogo.ne.jp/brewery/> — los 25 miembros (24 de sake, 1 de encurtidos), agrupados por los cinco 郷.
- Estado: **8 integradas** el 2026-08-05 (6 `verificado`, 2 `parcial`), 4 con tienda propia; quedan 17 de Nada y 11 del resto de la prefectura. Evidencia en `data/evidence/jp/kansai/hyogo.jsonl`.

Nada es la mayor zona sakera de Japón y toda ella cae en dos municipios:
神戸市 (Kobe) y 西宮市 (Nishinomiya). Los cinco 郷 son barrios, no municipios:
西郷/御影郷/魚崎郷 están en Kobe (灘区 y 東灘区), 西宮郷/今津郷 en Nishinomiya.
Para el CSV, `municipio` = `Kobe` o `Nishinomiya`.

Categoría: `Sake` salvo la última fila.

| nombre (rōmaji propuesto) | 社名 | marca | 郷 | municipio |
|---|---|---|---|---|
| Izumi Shuzo | 泉酒造 | 仙介・琥泉 | 御影郷 | Kobe |
| Yasufuku Matashiro Shoten | 安福又四郎商店 | 大黒正宗 | 御影郷 | Kobe |
| Ota Shuzo | 太田酒造 | 千代田蔵 | 魚崎郷 | Kobe ⚠ |
| Takara Shuzo | 宝酒造 | 松竹梅 | 魚崎郷 | Kobe ⚠ |
| Hamafukutsuru Meijo | 浜福鶴銘醸 | 浜福鶴 | 魚崎郷 | Kobe |
| Nihonsakari | 日本盛 | 日本盛 | 西宮郷 | Nishinomiya |
| Kokusan Shuzo | 國産酒造 | 灘自慢 Nadajiman | 西宮郷 | Nishinomiya |
| Kitani Shuzo | 木谷酒造 | 喜一 Kiichi | 西宮郷 | Nishinomiya |
| Motonoda Shuzo | 本野田酒造 | 金鷹 Kintaka | 西宮郷 | Nishinomiya |
| Shochikubai Shuzo | 松竹梅酒造 | 灘一 Nadaichi | 西宮郷 | Nishinomiya ⚠ |
| Osawa Honke Shuzo | 大澤本家酒造 | 寳娘 Takaramusume | 西宮郷 | Nishinomiya |
| Kitayama Shuzo | 北山酒造 | 島美人 Shimabijin | 西宮郷 | Nishinomiya |
| Mandai Osawa Jozo | 万代大澤醸造 | 德若 Tokuwaka | 西宮郷 | Nishinomiya |
| Ozeki | 大関 | 大関 | 今津郷 | Nishinomiya |
| Imazu Shuzo | 今津酒造 | 扇正宗 Ogimasamune | 今津郷 | Nishinomiya |
| Takashima Shurui Shokuhin | 髙嶋酒類食品 | 甲南漬 Konanzuke | 御影郷 | Kobe — categoría `Condimentos` (encurtidos en sake kasu, no bodega) |

## Integradas 2026-08-05 (8) — las ocho grandes de Nada

| bodega | municipio | resultado |
|---|---|---|
| Kenbishi Shuzo | Kobe | verificado · venta sí |
| Sawanotsuru | Kobe | verificado · venta sí |
| Kobe Shushinkan (Fukuju) | Kobe | verificado · venta sí |
| Tatsuuma-Honke Shuzo (Hakushika) | Nishinomiya | verificado · venta sí |
| Hakutsuru Shuzo | Kobe ⚠ | verificado · sin carrito |
| Hakutaka | Nishinomiya | verificado · sin carrito |
| Kikumasamune Shuzo | Kobe | **parcial** · web con 403 |
| Sakuramasamune | Kobe | **parcial** · web sin respuesta |

⚠ **Hakutsuru es el caso límite del criterio de masa** que dejó fuera a Gekkeikan
en `kyoto.md`: es la mayor productora de sake de Japón. Entra porque elabora
íntegramente en Nada, con kura-museo y marca propia — pero si ese criterio se
endurece hacia la deslocalización, **esta fila hay que revisarla**. Queda dicho
para que la próxima pasada no tenga que re-deducirlo.

- **菊正宗 devuelve 403** con user-agent de navegador: cuarto caso de bloqueo de
  bot tras Yamahisa, Kyokuho y Kitaya. No es sitio muerto, pero sin lectura
  propia se queda `parcial`.
- **櫻正宗 no respondió** ni por HTTP ni por HTTPS. De esta casa salieron la
  levadura kyokai nº 1 y el propio uso de «Masamune» como nombre de sake.
- **Kenbishi tiene web en `.co.jp` y tienda en `.com`**: dos dominios de la misma
  casa, no un cruce.

⚠ Antes de dar de alta:
- **太田酒造** tiene su sede en 草津市 (Shiga) y en Nada opera el 灘工場; **宝酒造**
  tiene sede en Kioto. Si la unidad de Nada no es una entidad con marca e
  identidad propias, la fila correcta puede ser la de su prefectura de origen, no
  Hyogo. Verificar antes de meterlas aquí (`docs/EDITORIAL_POLICY.md`, grupos).
- **松竹梅酒造** (marca 灘一, Nishinomiya) es empresa distinta de **宝酒造** (marca
  松竹梅). Nombres casi idénticos: no fusionar filas.

**Revisión 2026-08-09:** Takara Shuzo sigue retenida. La dirección de Kobe es
una planta del grupo de Kioto y no se localizó una identidad minorista autónoma
de esa unidad que justifique una fila propia. Revisar si aparece una marca de
planta; no tratarlo como descarte definitivo.

## Fuera de Nada (11, pasada 2026-08-04)

Primera mordida al resto de la prefectura, que es lo que pedía el «Qué falta».
El censo son **97 bodegas** — Hyogo es la primera de Japón en número — frente a
las 25 de Nada. Fuente: <https://jp.sake-times.com/sakagura/hyogo>, orden
alfabético. Deduplicado contra la tabla de Nada. Ninguna trae dominio.
Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Akashi Shurui Jozo | 明石酒類醸造 | Akashi |
| Ibaraki Shuzo | 茨木酒造 | Akashi |
| Eigashima Shuzo | 江井ヶ嶋酒造 | Akashi |
| Izawa Honke | 井澤本家 | Inami |
| Eisen Shuzo | 栄泉酒造 | Inami |
| Itami Oimatsu Shuzo | 伊丹老松酒造 | Itami |
| Oimatsu Shuzo | 老松酒造 | Shiso |
| Izushi Shuzo | 出石酒造 | Toyooka |
| Inami Shuzo | 稲見酒造 | Miki |
| Uchida Shuzo | 打田酒造 | Tanba |
| Okuma Shuzo | 大熊酒造 | Kato |

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
- Estado: revisión cerrada el 2026-08-10; **3** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| AI-N International (六甲ビール) | Kobe | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 小西酒造 | Itami | Cerveza | JBA | — | matriz de sake histórica; sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 明石ビール工房TOKI | Akashi | Cerveza | JBA | toki-akashi.com | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

**Ya integrado, no volver a proponer:** 白鶴酒造 ya está en `hyogo.csv`, así que 神戸ワイナリー sería otra fila del mismo grupo, no un alta nueva.
