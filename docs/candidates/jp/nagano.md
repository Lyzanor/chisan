# Nagano — candidatos

- CSV: `data/csv/jp/chubu/nagano.csv` (77 filas).
- Fuente: 長野県酒造組合. **Lee las fichas japonesas, `/intro/<area>/`, no las inglesas
  `/breweries/<area>/`**: las inglesas pierden bodegas, romanizan mal y traducen
  razones sociales por marcas. Diez áreas: Kitaazumi, Matsumoto, Kiso, Iida,
  Nakano, Nagano, Ueda, Saku, Suwa, Ina.
- Estado: **⚑ CENSO DE SAKE CERRADO** el 2026-08-05. Las 76 bodegas del gremio
  están integradas (77 filas = 76 + Tamamura Honten, que entra como cervecera).

## Descartes

- **明科酒造 (Akashina Shuzo, Azumino)**: cerrada entre 2012 y 2014. Solo la
  listaba un directorio que no marca las bajas.
- **山清酒造 (Sansei Shuzo, Chikuhoku)**: aparece en la ficha inglesa del área de
  Matsumoto y **no** en la japonesa. Sin web y sin rastro reciente: no se da de
  alta hasta confirmar que sigue.
- **芙蓉酒造協同組合**: misma dirección, teléfono y web que 芙蓉酒造（株）. Dos
  figuras jurídicas sobre una unidad productiva, una sola fila.
- **Hokto Corporation**: cotizada de setas con plantas en varias prefecturas.

## Trampas resueltas

- **La marca 雲山 (Unzan) no identifica a un productor.** La crearon en 1960 seis
  bodegas con embotelladora común (雲山銘醸) y desde los noventa solo la elabora
  **西之門よしのや**. El gremio se la sigue atribuyendo además a **山形屋** y
  **坂井銘醸**, que quedan sin marca propia acreditada y son las dos candidatas a
  revisar en 2ª pasada.
- **Homónimos entre municipios de Nagano y de fuera**, todos en
  `municipality-overrides.json`: `nakano` (Nagano / barrio de Tokio, 130 km) e
  `ikeda` (Kitaazumi / Gifu, misma región `chubu`, por eso el `municipio` lleva el
  distrito: `Ikeda (Kitaazumi)`).
- **Homónimo de Nagano contra sí misma**: 木祖村 y 木曽町 romanizan los dos como
  «Kiso» y son municipios distintos a 20 km. Se escriben `Kisomura` y `Kisomachi`,
  con override cada uno.
- **Dominios del gremio caducados** (7 de 76): `miyamazakura.com` (Furuya, no
  resuelve → `furuya-shuzou.com`), `ueda.ne.jp/~okazaki` (Okazaki, certificado →
  `shinshu-kirei.com`), `fukumuryo.co.jp` (Kutsukake, no resuelve →
  `kutsukake-sake.com`), `shopdaiya.jp` (Toda, 404 → `todashuzo.jp`),
  `mcci.or.jp/www/yoikana/` (Yoikana, 404 → `yoikana.com`), `asamadake.co.jp`
  (redirige a `.com`) y la ficha de Tenpo Shuzo, que apunta a una licorería ajena.
- **`https://www.sakagura.co.jp/` sirve el sitio de reclutamiento de un grupo
  industrial ajeno**; el de Sakai Meijo es el `http://`. Comprobar los dos esquemas.
- **Un 403, una verificación de edad o un timeout no son un sitio muerto**:
  Higashiiida, Furuya, Totsuka, Yoshinoya, Fuyo, Nakazen y Kikusui sirven pero no
  se dejan leer, y por eso quedan en `parcial`.
- **Razón social ≠ marca**: 薄井商店 firma ya como 白馬錦酒造; 市野屋 vende bajo
  Ryusuisen y no bajo el Kinrankurobe del gremio; 高橋助作酒造店 se llama a sí
  misma Matsuwo; 戸田酒造 no es «Suwa Otsuya Honke Shuzo».
- **木内醸造 (Saku)** no tiene nada que ver con **木内酒造** (Naka, Ibaraki), el de
  Hitachino Nest.
- **`shoplist` / `shops` suele ser la lista de tiendas concertadas**, no tienda
  propia: Hokuan, Ono, Kasuga y Daishinshu se quedan en `no comprobado` por eso.

## Qué falta

- **2ª pasada**: 21 filas en `parcial` (las de arriba), Yoshinoya sin coordenadas
  (el geocodificador oficial no tiene Nishinomoncho) y las dos candidatas a purga.
- **Todo lo que no es sake**: soba, miso de Shinshu, manzana, uva y **vino** de
  Chikumagawa/Kikyogahara, wasabi de Azumino, oyaki. Ninguna fuente localizada aún
  — es el hueco grande de la prefectura.
- Imágenes: 77/77 filas sin `imagen`.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| マルマン株式会社 | マルマン株式会社 | 長野県飯田市大通2-217 | 有機加工食品 | MPJP1001 |
| ゴールドパック株式会社あずみ野工場 | ゴールドパック株式会社　あずみ野工場 | 長野県安曇野市掘金烏川1984ｰ1 | 有機加工食品 | MPJP1198 |
| 加藤浩一 | 1　他 | 長野県佐久市三分上の田39　他 | 有機農産物 | 06A-019 |
| 桝田屋食品（株） | 桝田屋食品（株） | 長野県飯山市大字瑞穂4196 | 有機加工食品 | JＮ60810PR-0913-0 |
| 細井正博 | 1　他 | 長野県安曇野市豊科南穂高3644　他 | 有機農産物 | S-002 |
| 宮田兼任 | 3　他 | 長野県北安曇郡松川村196-4　他 | 有機農産物 | S-028 |
| 村山大蔵 | 2　他 | 長野県大町市平85　　他 | 有機農産物 | S-033 |
| 飯沼博 | 6　他 | 長野県安曇野市豊科南穂高2380　他 | 有機農産物 | S-161 |
| 木島平有機米研究会 | 丸山勝敏　１　他 | 長野県下高井郡木島平村大字往郷大塚沖9260-1･2　他 | 有機農産物 | S-148 |
| 株式会社アルプス | 株式会社アルプス　本社工場 | 長野県塩尻市塩尻町260 | 有機加工食品(酒類を含む) | GMJP1129 |
| みたけ食品工業株式会社 | みたけ食品工業株式会社　駒ヶ根工場　他 | 長野県駒ヶ根市下平292-35　他 | 有機加工食品 | 第1018号 |
| 森原英之 | 1 | 長野県佐久市春日野宇樽3745 | 有機農産物 | 07A-004 |
| （株）水宗園本舗 | 水宗園本舗安曇野工場　他 | 長野県安曇野市豊科高家2287-30　他 | 有機加工食品 | 2007M-5 |
| 有限会社　八ヶ岳ナチュラファーム | 3-1（梓原）　他 | 長野県南佐久郡川上村梓山梓原300-1他 | 有機農産物 | 100052711 |
| 真木聡志 | 真木聡志 | 長野県佐久市下平尾下大久保597 他 | 有機農産物 | 07102 |
| 内堀醸造株式会社 アルプス工場 | （株）内掘醸造アルプス工場　他 | 長野県上伊那郡飯島町田切160-355　他 | 有機加工食品 | 07-047B |
| 田嶋克次（でんぷく農場） | 圃場1 | 長野県佐久市田口字東反田3953-1 | 有機農産物 | 08A-003 |
| 塩尻有機栽培研究会 | 保育園南　他 | 長野県塩尻市塩尻町233　他 | 有機農産物 | NA-08061201 |
| 農事組合法人野沢農産生産組合 | １他 | 長野県野沢温泉村豊郷字蟹明3177　他 | 有機農産物 | A-08-0070 |
| 株式会社タスク | 株式会社タスク有機食品工場 | 長野県長野市信州新町水内3381 | 有機加工食品 | MPJP1594 |
