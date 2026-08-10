# Kagawa — candidatos

- CSV: `data/csv/jp/shikoku/kagawa.csv` (15 filas: 6 bodegas + 9 casas de salsa de soja, altas del 2026-08-04).
- Fuentes: 香川県酒造組合, <https://sanuki-sake.com/> (6 miembros, censo completo, **con dominio**) y 小豆島醤油協同組合, <https://shima-shoyu.com/> (14 socios + 4 casas de la isla fuera del gremio). Ambas leídas 2026-08-04.
- Estado: **sake ✅ integrado** (las 6) y **醤油 ✅ 9 de 18** (2026-08-04). Quedan 9 sin dominio localizado.

Kagawa es la prefectura más pequeña de Japón y solo tiene **6 bodegas de sake**,
así que el grueso de candidatos viene del otro lado: **小豆島 (Shodoshima)**, la
isla del醤油, donde sobreviven ~18 casas en un radio de 5 km.

## Sake — ✅ INTEGRADO 2026-08-04

Las 6 del censo entraron en `data/csv/jp/shikoku/kagawa.csv`: cinco
`verificado` y una `parcial`. Evidencia en `data/evidence/jp/shikoku/kagawa.jsonl`.

| bodega | municipio | resultado |
|---|---|---|
| MORIKUNI | Shodoshima | verificado · venta online sí |
| Nishino Kinryo | Kotohira | verificado · venta online sí |
| Ayakiku Shuzo | Ayagawa | verificado · venta sin comprobar |
| Yushin Shuzo | Ayagawa | verificado · venta sin comprobar ⚠ |
| Kawatsuru Shuzo | Kanonji | verificado · venta sin comprobar |
| Maruo Honten | Kotohira | **parcial** · sin web propia |

Lo que salió al abrirlas:
- ⚠ **Yushin Shuzo es hoy sobre todo una cosmética.** Su negocio principal es el
  extracto Rice Power y su tienda (`ricepowershop.jp`) vende cremas, no bebida.
  Sigue declarando sake artesanal y es socia del gremio, así que entra como
  `Sake`, pero su venta online **no** sostiene la bebida.
- **La lectura automática de `ayakiku.com` devolvió otra razón social
  (「淡路菊水酒造」) y otro municipio (Takamatsu).** La ficha del gremio dice
  綾菊酒造, Ayagawa, 山田下 3393-1 — y coinciden código postal, número y teléfono,
  así que era ruido de lectura, no un cruce de empresas. Ante la duda, manda el
  gremio.
- **`kawatsuru.com/shop/` es un localizador de tiendas físicas**, no un carrito:
  no sostiene `Venta online=sí`.
- **Maruo Honten (悦凱陣) no tiene web propia** pese a ser conocida fuera de Japón:
  entra `parcial` y sin enlace, como las bodegas de Nara del gremio.

## 醤油 de Shodoshima — 9 integradas de 18 (2026-08-04)

Categoría `Condimentos`. Siete `verificado`, una `parcial` y una fuera.
Cinco con tienda propia.

| casa | municipio | resultado |
|---|---|---|
| Shokin Shoyu | Shodoshima | verificado · venta sí |
| Yamasan Shoyu | Shodoshima | verificado · venta sí |
| Kinryo Shoyu | Shodoshima | verificado · venta sí |
| Takahashi Shoten (Yamamo) | Shodoshima | verificado · venta sí |
| Takesan | Shodoshima | verificado · venta sí |
| Yamaroku Shoyu | Shodoshima | verificado · venta sin comprobar |
| Sakai Shoyu Kogyo | Shodoshima | verificado · venta sin comprobar |
| Yamahisa | Shodoshima | **parcial** · dominio con WAF |
| Yamahira Shoyuten | **Tonosho** | verificado · venta sí |

Lo que salió al abrirlas:
- **El dominio de 左海醤油工業 que publica la prensa está mudado.**
  `sakaishoyu.web.fc2.com` responde 200 pero es un aviso de renovación que salta
  a `sakai-syouyu.info`. Un 200 no basta: hay que leer el cuerpo. Su web propia
  además corrige el número de la calle (2125, no 2128).
- **ヤマヒサ devuelve 403 incluso con user-agent de navegador**, pero sirve cuerpo:
  es un WAF, no un sitio muerto (`AGENTS.md`). Sin poder leer su ficha se queda
  `parcial`, no se purga.
- **ヤマロク no publica carrito** pese a ser la casa más conocida de la isla fuera
  de Japón: se distribuye por terceros, así que su venta online no está
  comprobada. La fama no es evidencia de canal.
- **マルキン醤油 queda fuera**: es marca del grupo Morita (`moritakk.com`),
  descarte por masa. Su museo en la isla es visita, no obrador independiente.

**Sin dominio localizado, siguen en cola (9):** 丸島醤油, 小豆島醤油, 島醸,
元屋商店, 小豆島馬越醤油, 金大醤油 (socias del gremio) y 富士大醤油,
大森醤油醸造所 (Tonosho, fuera del gremio), más マルキン si se reconsidera.

## Trampas
- ⚠ **`Tonosho` en rōmaji resolvía al municipio equivocado.** 土庄町 (Kagawa) y
  東庄町 (Tōnoshō, Chiba) comparten clave normalizada y ganaba el de Chiba,
  a 480 km: eso es **error bloqueante**, no aviso. Resuelto el 2026-08-04 con una
  entrada `tonosho` en `data/reference/municipality-overrides.json` (kanto vs
  shikoku), así que las cuatro casas de Tonosho ya se pueden escribir.
- **La isla son dos municipios**: 小豆島町 (Shodoshima) y 土庄町 (Tonosho). Las
  cuatro de fuera del gremio están casi todas en Tonosho. No poner «Shodoshima»
  a todo por inercia — y `Shodoshima` es además el nombre de la isla entera.
- **ヤマロク醤油** es la casa de los barriles de madera (木桶) que reactivó el
  oficio y tiene proyección internacional: perfil de `verificado` con venta
  online, buen sitio por donde empezar el lote.
- **マルキン醤油** es de un grupo cotizado (Morita/盛田): candidata a descarte por
  masa, con la matización de que su museo y su marca de isla sí son propios.
- **小豆島酒造 y 森國酒造** son la misma casa con dos nombres: una fila.
- 香川県酒造組合 y el censo de SAKETIMES coinciden en 6: no falta ninguna.

## Qué falta
- **Aceite de oliva de Shodoshima**: la isla es donde se plantó el primer olivo
  de Japón (1908) y hoy hay decenas de almazaras y productores con tienda. Es el
  frente más obvio y no está abierto — y encaja con el catálogo mejor que nada.
- Sin abrir: **讃岐うどん** (el udon que define la prefectura, con obradores y
  harineras propias), 手延べそうめん de Shodoshima, 佃煮 de la isla,
  和三盆 de Higashikagawa (el mismo azúcar artesano que Tokushima),
  オリーブ牛 y オリーブハマチ.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| ＭＯＡ自然農法中讃研究会 | 出荷倉庫　他 | 香川県坂出市大屋富町1797-1　他 | 有機農産物 | SES-180720 |
| （株）ルイボス製茶 | （株）ルイボス製茶　本社工場 | 香川県三豊市仁尾町仁尾辛43-17 | 有機加工食品 | 第1197号 |
| 丸島醤油（株） | 丸島醤油（株） | 香川県小豆郡小豆島町神懸通甲881 | 有機加工食品 | JM80202PR-0253-0 |
| 株式会社島醸　本社工場 | （株）島醸　本社工場 | 香川県小豆郡小豆島町西村甲250-2 | 有機加工食品 | JM80202PR-0252-1 |
| サンミート（株） | サンミート（株） | 香川県三豊市詫間町松崎2619-1 | 有機加工食品 | 第1229号 |
| （株）ヤマヒサ | （株）ヤマヒサ　他 | 香川県小豆郡小豆島町安田甲243　他 | 有機加工食品 | JY981220PR-0072-0 |
| 進和珈琲株式会社 | 進和珈琲株式会社 | 香川県高松市下田井町437番地1 | 有機加工食品 | 382152002 |
| 株式会社　蠣三珈琲 | 蠣三珈琲焙煎工場　他 | 香川県高松市木太町４区2304　他 | 有機加工食品 | 37201200201、37201200202 |
| 矢野　耕平 | 1　他 | 香川県綾歌郡綾川町陶6370-4　他 | 有機農産物 | 114-003 |
| ダート物産株式会社 | ダート物産株式会社 | 香川県高松市国分寺町福家甲1268-17 | 有機加工食品 | 14-065B |
| 株式会社　せとうちビオファーム | T1　他 | 香川県小豆郡小豆島町西村甲2425-1　他 | 有機農産物 | 114-064 |
| ヤマサン醤油株式会社 | 製造所1 | 香川県小豆郡小豆島町馬木甲142番地 | 有機加工食品 | 215-002 316-001 |
| 山本　有太（blue farm） | 1-1　他 | 香川県丸亀市川西町北山ノ側1442-1（ハウス1）　他 | 有機農産物 | 116-007 |
| よしむら農園 | 1　他 | 香川県丸亀市飯山町東小川川原725の一部　他 | 有機農産物 | 114-040 |
| 株式会社　さぬき有機 | 1　他 | 香川県坂出市高屋町412-1、413-4　他 | 有機農産物 | 114-035 |
| 株式会社　木下 | 1　他 | 香川県坂出市高屋町下新開甲1684-1　他 | 有機農産物 | 114-036 |
| 株式会社フジサワ | 株式会社フジサワ | 香川県綾歌郡綾川町枌所東字西山50 | 有機加工食品 | 372012003 |
| サルボ両備株式会社 | A　他 | 香川県小豆郡土庄町字水ヶ浦3040-1　他 | 有機農産物 | 119-002 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/kagawa.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **OliveKagawa** — 香川県 — オリーブオイル認定製造事業者 (2025-03), <https://www.my-kagawa.jp/olive/feature/manufacturer/top>
  - **propia** — búsqueda dirigida por producto; ficha o web propia del productor
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 中田 (まめまめびーる) | ⚠ Shodoshima | Cerveza | JBA | — | la isla tiene dos municipios (小豆島町 y 土庄町); solo Facebook; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

**Ya integrado, no volver a proponer:** las 14 bodegas del 小豆島醤油協同組合 ya están en `kagawa.csv` como `Condimentos`, igual que Toyo Olive como `Aceite`. Cuatro de ellas —ヤマヒサ, タケサン, 金両, ヤマサン醤油— aparecen también en el padrón de aceite certificado de Kagawa: es **otro producto de un productor ya publicado**, no un alta.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/kagawa.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/kagawa.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **8 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 夢菓房たから | 高松市 | Dulces y repostería | 和菓子協会 | http://e-takara.jp/ | 高松市春日町 214 |
| ㈱藤井製麺 | 三木町 | Pan y cereal | 全乾麺 | http://www.fujimen.com/ | 機械製乾めん |
| 伊藤製麺所 | 土庄町 | Pan y cereal | 全乾麺 | https://shoudoshima-soumen.com/ | 手延べ干しめん |
| ㈲大喜多製粉所 | 宇多津町 | Pan y cereal | 全乾麺 | http://www.shokokai.or.jp/37/okita/index.htm | 機械製乾めん |
| 安田食品工業（瀬戸よ志） | 小豆島町 | Conservas | búsqueda dirigida + web propia | https://www.yasudanotukudani.co.jp/ | 佃煮 del 醤の郷; 小豆郡小豆島町安田 |
| 島乃香 | 小豆島町 | Conservas | búsqueda dirigida + web propia | https://www.simanoca.co.jp/ | 佃煮 de kombu; 小豆郡小豆島町馬木 |
| 島じまん | 小豆島町 | Conservas | búsqueda dirigida + web propia | https://www.shimajiman.co.jp/ | 佃煮; 小豆郡小豆島町苗羽, dos plantas en la misma calle |
| 小豆島食品 | ⚠ | Conservas | búsqueda dirigida + web propia | https://www.shodoshima-shokuhin.co.jp/ | ⚠ la portada no publica dirección; tienda propia 『島の味』 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/kagawa.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/kagawa> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 10, Setas 4, Pescado 3, Carne 1, Condimentos 1, Aceite 1, Frutos secos 1, ⚠ por decidir 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 阿讃きのこ屋 | まんのう町 | Setas | ficha | — | https://www.tabechoku.com/producers/27803 | 香川県仲多度郡まんのう町 |
| さぬきくらげの店 | 三木町 | Setas | ficha | — | https://www.tabechoku.com/producers/21285 | 香川県木田郡三木町 |
| さぬきのこ | 三豊市 | Setas | ficha | — | https://www.tabechoku.com/producers/27763 |  |
| あい・あーる椎茸店 | 丸亀市 | Setas | ficha | — | https://www.tabechoku.com/producers/27853 |  |
| 大塩水産 直売店 | さぬき市 | Pescado | ficha | — | https://www.tabechoku.com/producers/24332 |  |
| 葉っぱ舎（はっぱや） | 三木町 | Pescado | ficha | — | https://www.tabechoku.com/producers/21290 | 香川県木田郡三木町 |
| 伊吹島プロジェクト | 観音寺市 | Pescado | ficha | — | https://www.tabechoku.com/producers/20817 |  |
| オイノコ舎 | 三豊市 | Carne | ficha | — | https://www.tabechoku.com/producers/26647 |  |
| にじの百姓 | まんのう町 | Condimentos | ficha | — | https://www.tabechoku.com/producers/22989 | 香川県仲多度郡まんのう町 |
| 瀬戸内オリーブ園 | 坂出市 | Aceite | ficha | — | https://www.tabechoku.com/producers/24631 |  |
| 三豊の栗園　ゆたふぁむ | 三豊市 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/29016 |  |
| TAGATAME【タガタメ】 | さぬき市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077301 |  |
| 空海の郷 | まんのう町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24861 | 香川県仲多度郡まんのう町 |
| ハラシモベース | 三豊市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24543 |  |
| さぬき新居農園 | 丸亀市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077668 |  |
| 虹の邑農園 | 善通寺市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/26266 |  |
| 日本農産 | 坂出市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24947 |  |
| ADL | 小豆島町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24702 | 香川県小豆郡小豆島町 |
| もりやま農園 | 高松市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25832 |  |
| 川田明美 | 高松市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28332 |  |
| Fumico farm | 高松市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/27495 |  |
| めざめ | 丸亀市 | ⚠ por decidir | — | — | https://www.tabechoku.com/producers/24617 |  |
