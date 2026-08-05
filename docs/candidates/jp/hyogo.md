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
