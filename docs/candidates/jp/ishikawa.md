# Ishikawa — candidatos

- CSV: `data/csv/jp/chubu/ishikawa.csv` (6 filas, altas del 2026-08-05).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (2026-08-04). Fuente que cita: 石川県酒造組合連合会 <https://www.ishikawa-sake.jp/eng/index.html>.
- Estado: **6 integradas** el 2026-08-05 (5 `verificado`, 1 `parcial`), 4 con tienda propia. Evidencia en `data/evidence/jp/chubu/ishikawa.jsonl`.

Categoría para todas: `Sake`. Todas vienen marcadas `B` en el origen (solo
valen los productos con origen local acreditado).

| nombre | municipio (del xlsx, sin contrastar) |
|---|---|
| Nakamura Brewery | Kanazawa ✔ |
| Yachiya Brewing | Kanazawa |
| Kanaya Shuzouten | Hakusan |
| Manzairaku Sake Kura | Hakusan |
| Kaetsu Sake Brewery | Komatsu |
| Higashi Sake Brewing | Komatsu |
| Kano Sake Brewery | Kaga |
| Mioya Brewery | Hakui |
| Matsunami Shuzo | Noto |
| Sakurada Sake Brewery | Suzu |
| Hakuto Sake Brewery | Wajima |

## Integradas 2026-08-05 (6)

| bodega | municipio | resultado |
|---|---|---|
| Shata Shuzo (Tengumai) | Hakusan | verificado · venta sí |
| Fukumitsuya | Kanazawa | verificado · venta sí |
| Kazuma Shuzo (Chikuha) | **Noto** ⚠ | verificado · venta sí |
| Sogen Shuzo | **Suzu** ⚠ | verificado · venta sí |
| Yoshida Shuzoten (Tedorigawa) | Hakusan | verificado · sin carrito |
| Kikuhime | Hakusan | **parcial** · web con JS |

⚠ **Cierra en parte el aviso de Noto que abría este fichero.** Las dos bodegas
de la zona del terremoto de enero de 2024 que entran aquí **siguen elaborando**,
con evidencia:
- **数馬酒造 (Noto)** mantiene producción y tienda propia.
- **宗玄酒造 (Suzu)** perdió botellas y su túnel de guarda quedó sepultado por un
  corrimiento, pero **reanudó la elaboración el 15 de enero de 2024** y aguantó
  además las lluvias torrenciales de septiembre.

Sigue en pie el aviso para **las seis de Wajima**, que son las que perdieron el
kura y no se han comprobado.

- **宗玄 no tiene dominio propio**: su único sitio localizado es la tienda en
  Shopify, que sirve a la vez de identidad y de canal, como Yano en `saga.md`.
- **菊姫 sirve el cuerpo vacío** (se pinta con JavaScript), igual que Kotobuki
  Toraya en `yamagata.md`: `parcial`.
- **Kikuhime está en Tsurugi**, barrio de Hakusan tras la fusión de 2005.

## Contraste contra el gremio (hecho 2026-08-04)

Las **16 aparecen literalmente** en la web del gremio, con la misma grafía
inglesa. El bloque es fiable en identidad.

Lo que el gremio **no** da es la ciudad de casi ninguna: solo confirma Kanazawa
para Nakamura y Fukumitsuya (✔ arriba). Los otros catorce municipios del xlsx
salen de otra parte y **están sin contrastar** — hay que confirmarlos en la web
de cada bodega antes de fijar coordenadas.

## Trampas
- `Kaetsu Sake Brewery` (Komatsu, Ishikawa) no es 下越酒造 **Kaetsu Shuzo** (Aga,
  Niigata), que ya está en `niigata.md`. Rōmaji idéntico, dos empresas.
- `Hakuto Sake Brewery` (Wajima) tampoco es 宝山/白龍 ni ninguna de Niigata.
- El listado no trae web propia de ninguna: apunta al gremio para las dieciséis.
- **Noto**: el terremoto de enero de 2024 arrasó bodegas de Wajima, Suzu y Noto.
  Varias siguen sin reconstruir o producen en instalaciones cedidas. Aquí
  «actividad actual» no es un trámite: exige evidencia reciente, y una bodega
  parada no es una purga, es `parcial` con nota.

## Las que faltaban (11, pasada 2026-08-04)

Resuelta la duda del «Qué falta»: **la página en inglés era un extracto**. El
censo real son ~42 bodegas (日本酒造組合中央会,
<https://japansake.or.jp/sakagura/jp/ishikawa/>, 3 páginas; y
<https://jp.sake-times.com/sakagura/ishikawa>). Estas 11 no estaban arriba.
Ninguna trae dominio. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kikuhime | 菊姫 | Hakusan |
| Kuze Shuzoten | 久世酒造店 | Tsubata |
| Takeuchi Shuzoten | 武内酒造店 | Kanazawa |
| Tezuka Shuzojo | 手塚酒造場 | Komatsu |
| Tsuruno Shuzoten | 鶴野酒造店 | Noto |
| Hiyoshi Shuzoten | 日吉酒造店 | Wajima ⚠ |
| Shirafuji Shuzoten | 白藤酒造店 | Wajima ⚠ |
| Shimizu Shuzoten | 清水酒造店 | Wajima ⚠ |
| Chuno Shuzo | 中納酒造 | Wajima ⚠ |
| Nakano Shuzo | 中野酒造 | Wajima ⚠ |
| Nakashima Shuzoten | 中島酒造店 | Wajima ⚠ |

⚠ **Las seis de Wajima caen de lleno en la zona del terremoto de enero de 2024**,
el aviso que ya está más abajo en este fichero. Varias perdieron el 蔵 y elaboran
cedidas en otra prefectura. Aquí «sigue activa» exige evidencia de 2025-2026, y
una bodega parada **no es purga**: es `parcial` con nota.

## Qué falta
- ~15 bodegas más del censo (páginas 2-3 del listado del gremio nacional).
- Fuera del sake, sin abrir: 加賀野菜 (verdura tradicional de Kanazawa), 能登
  (sal marina de Suzu, ika/pescado, 中島菜), 金沢 (dulces wagashi, pan de oro),
  醤油/味噌 de Ono (Kanazawa), 治部煮 y conservas.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 株式会社ヤマト醤油味噌 | 株式会社ヤマト醤油味噌 | 石川県金沢市大野町4丁目イ-170 | 有機加工食品 | 01-020B |
| 護国寺生産グループ | 農事組合法人護国寺農場　9　他 | 石川県小松市五国寺町63　他 | 有機農産物 | 2000F-12 |
| （有）ジャパンファーム | 生水敏雄　ほ場1　他 | 石川県小松市金平町尾谷7　他 | 有機農産物 | 2001F-8 |
| 手取清流生産グループ | 川北 弘 1 他 | 石川県能美市下清水ヨ91番地 他 | 有機農産物 | 2000F-10 |
| 有限会社グリーンアース杉浦 代表取締役 杉浦 賢治 | 002810 他 | 石川県羽咋市円井町602 他 | 有機農産物 | 2 |
| 辻本 長衛 | 006470 他 | 石川県羽咋市垣内田町438 他 | 有機農産物 | 10 |
| ユウキファーム山岸 山岸 邦夫 | 000010 他 | 石川県七尾市中島町西谷内な57 他 | 有機農産物 | 12 |
| 加賀有機の会 代表 橋詰 善庸 | 000140 他 | 石川県加賀市西島町43 他 | 有機農産物 | 13 |
| 有限会社たけもと農場 代表取締役 竹本 彰吾 | 001100 他 | 石川県能美市佐野町西49 他 | 有機農産物 | 15 |
| 今井 清博 | 004430 他 | 石川県鹿島郡中能登町小田中井きし27 他 | 有機農産物 | 17 |
| 橋 祥一郎 | 000980 他 | 石川県小松市拓栄町277-1 他 | 有機農産物 | 21 |
| 高 利充 | 無関29 他 | 石川県七尾市能登島無関町29 他 | 有機農産物 | 45 |
| 木下 勝 | 10730 他 | 石川県金沢市粟崎町4-107 他 | 有機農産物 | 48 |
| 井村辰二郎 | S083 金沢 | 石川県金沢市湖南町83 | 有機農産物 | JI001010FA-0069-0 |
| ダートコーヒー（株） | ダートコーヒー株式会社　白山工場 | 石川県白山市水島町451 | 有機加工食品 | 07-050B |
| 加賀味噌食品工業協業組合 | 加賀味噌食品工業協業組合 | 石川県白山市倉部町1080 | 有機加工食品 | JK090323PR-1075-0 |
| 公益財団法人農業・環境・健康研究所 白山研究農場 代表 細川 洋幹 | 1 他 | 石川県白山市徳光町3840-1 他 | 有機農産物 | 56 |
| 東　浩一 | 湖東町331　他 | 石川県小松市湖東町331　他 | 有機農産物 | JH100511FA-1112-0 |
| 農家ふじた | 新2　他 | 石川県小松市木場町新43、44、45　 他 | 有機農産物 | 2010F-5 |
| 株式会社スギヨファーム 代表取締役 杉野 哲也 | 圃場1 | 石川県七尾市能登島町上野３３ | 有機農産物 | 58 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/ishikawa.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **OnoShoyu** — 大野醤油醸造協業組合 — 組合案内, <https://www.oonomurasaki.jp/pages/3/>
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 小山屋醤油店 | Nanao | Condimentos | OnoShoyu | — | 相生町; sin dominio en la fuente; revisado 2026-08-10: el padrón oficial publica dos números de calle incompatibles para la misma identidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/ishikawa.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/ishikawa.php> (nombre, dirección y web propia de cada socio)
- Estado: **7 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 山中石川屋 | 加賀市 | Dulces y repostería | 和菓子協会 | http://www.yamanakaishikawaya.com/ | 加賀市山中温泉本町 2-ナ-24 |
| 松葉屋 | 小松市 | Dulces y repostería | 和菓子協会 | http://www.matsubaya.jp/ | 小松市大文字町 69 |
| 彩霞堂 | 白山市 | Dulces y repostería | 和菓子協会 | http://www.saikadou.jp/ | 白山市石同町 22 |
| 中田屋 | 金沢市 | Dulces y repostería | 和菓子協会 | http://www.kintuba.co.jp/ | 金沢市東山 3-4-30 |
| あめの俵屋 | 金沢市 | Dulces y repostería | 和菓子協会 | http://www.ame-tawaraya.co.jp/ | 金沢市小橋町 2-4 |
| 浦田甘陽堂 | 金沢市 | Dulces y repostería | 和菓子協会 | http://www.urata-k.co.jp/ | 金沢市御影町 21-14 |
| 落雁　諸江屋 | 金沢市 | Dulces y repostería | 和菓子協会 | http://www.moroeya.co.jp/ | 金沢市野町 3-1-38 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/ishikawa.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/ishikawa> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 9, Pescado 4, Setas 3, Pan y cereal 2, Té e infusiones 1, Lácteos y quesos 1, Dulces y repostería 1, Frutos secos 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| ハーブ農園ペザン | 津幡町 | Té e infusiones | ficha | — | https://www.tabechoku.com/producers/21981 | 石川県河北郡津幡町 |
| 宮本自然農園 | 金沢市 | Lácteos y quesos | ficha | — | https://www.tabechoku.com/producers/23455 |  |
| ハイネファーム | かほく市 | Setas | ficha | — | https://www.tabechoku.com/producers/26680 |  |
| のとっこ | 能登町 | Setas | ficha | — | https://www.tabechoku.com/producers/29294 | 石川県鳳珠郡能登町 |
| 佐の川園 | 能美市 | Setas | ficha | — | https://www.tabechoku.com/producers/29617 |  |
| 第八豊丸 | 志賀町 | Pescado | ficha | — | https://www.tabechoku.com/producers/28327 | 石川県羽咋郡志賀町 |
| 淡水養魚場「白山堂」 | 白山市 | Pescado | ficha | — | https://www.tabechoku.com/producers/20771 |  |
| 義祥丸水産 | 穴水町 | Pescado | ficha | — | https://www.tabechoku.com/producers/22973 | 石川県鳳珠郡穴水町中居南 |
| ほんだ農場 | 能美市 | Pescado | ficha | — | https://www.tabechoku.com/producers/28949 |  |
| 金沢ちはらファーム | 金沢市 | Dulces y repostería | ficha | — | https://www.tabechoku.com/producers/27064 |  |
| んめえ米 | 加賀市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/26366 |  |
| 岡元農場 | 能美市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/3078773 |  |
| ハルサ | 能登町 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/23203 |  |
| 味きらら☆福田農園 | 志賀町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22405 | 石川県羽咋郡志賀町 |
| こすもす自然農園 | 河北郡河北潟干拓地区内 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28888 | 石川県河北郡河北潟干拓地区内 |
| ぶるベジ | 白山市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077842 |  |
| ほくベジ | 穴水町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/27450 | 石川県鳳珠郡穴水町 |
| アグリコ | 穴水町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077166 | 石川県鳳珠郡穴水町大郷 |
| 百姓ひろばオズランド | 羽咋市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20169 |  |
| ぶどうの森農園 | 金沢市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20935 |  |
| 加賀米野菜基地（かがこめやさいきち） | 金沢市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23048 |  |
| OTM オーティーエム | 金沢市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21225 |  |
