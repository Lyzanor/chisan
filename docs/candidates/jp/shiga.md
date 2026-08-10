# Shiga — candidatos

- CSV: `data/csv/jp/kansai/shiga.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/shiga> (50 bodegas, leído 2026-08-04). Gremio: 滋賀県酒造組合, <http://shiga-sake.net/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Emishiki Shuzo | 笑四季酒造 | Koka |
| Shiga Shuzo | 滋賀酒造 | Koka |
| Seko Shuzo | 瀬古酒造 | Koka |
| Uehara Shuzo | 上原酒造 | Takashima |
| Ikemoto Shuzo | 池本酒造 | Takashima |
| Kawashima Shuzo | 川島酒造 | Takashima |
| Kitajima Shuzo | 北島酒造 | Konan |
| Kita Shuzo | 喜多酒造 | Higashiomi ⚠ |
| Okamura Honke | 岡村本家 | Toyosato |
| Otose Shuzojo | 音瀬酒造場 | Hikone |
| Sato Shuzo | 佐藤酒造 | Nagahama |
| Akatsuki Shuzo | 暁酒造 | Yasu |
| Ota Shuzo | 太田酒造 | Kusatsu ⚠ |
| Aichi Shuzo | 愛知酒造 | Aisho ⚠ |

## Trampas
- ⚠ **愛知酒造 está en 愛知郡 (Echi-gun), Shiga — no en la prefectura de Aichi.**
  Los mismos dos kanji, 愛知, se leen *Echi* aquí y *Aichi* allí. El 郡 no es
  municipio: la fila lleva 愛荘町 (**Aisho**). Es la trampa de homónimos más fina
  de este país y no la resuelve ningún gate.
- ⚠ **太田酒造 (Kusatsu, Shiga) es la matriz** de la 灘工場 que aparece marcada en
  `hyogo.md`. Si solo va a haber una fila, **es ésta**: aquí está la sede y la
  identidad. Decidirlo antes de escribir cualquiera de las dos.
- **喜多酒造 (Higashiomi, Shiga)** no es 喜多の華酒造場 (Kitakata, Fukushima) ni
  北島酒造, que está en esta misma tabla. Y hay un 喜多酒造 más en Kashihara
  (Nara), ya en el CSV como `Kita Shuzo`. ⚠ **Mismo rōmaji propuesto que una fila
  existente**: al escribirla, el `slug` es único por área, así que no colisiona,
  pero la confusión humana sí.
- **草津市 (Kusatsu, Shiga)** no es 草津町 (Gunma, el balneario).

## Qué falta
- Las ~36 bodegas restantes del censo.
- Sin abrir: **鮒寿し (funazushi)**, el encurtido de pescado del Biwa, con
  obradores familiares y siglos de historia — el producto más singular de la
  prefectura; **近江牛 (Omi gyu)**, la carne más antigua de Japón; 赤こんにゃく de
  Omihachiman, 丁字麸, 政所茶 y el té de Asamiya (de los primeros de Japón).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 雄山株式会社 | 雄山株式会社　彦根工場 | 滋賀県彦根市野瀬町128 | 有機加工食品 | MPJP1350-01 |
| 有限会社ブルーベリーフィールズ紀伊國屋 | 1 他 | 滋賀県大津市伊香立上龍華町673 | 有機農産物 | 25-05 |
| 有限会社中谷農場 | 1 他 | 滋賀県近江八幡市大中町471-1,2 他 | 有機農産物 | 25-03 |
| 中道唯幸 | 1　他 | 滋賀県野洲市比留田石の戸4004～4006　他 | 有機農産物 | S-122 |
| 細江　正道 | 10　他 | 滋賀県長浜市難波町小字ハザマ734　他 | 有機農産物 | 03A-043-5 |
| (有)クサツパイオニアファーム | 1　他 | 滋賀県草津市馬場町19、19-1　他 | 有機農産物 | S-080 |
| サクラ食品工業株式会社 | サクラ食品工業株式会社　湖南工場　他 | 滋賀県湖南市西峰町2番4号　他 | 有機加工食品 | MPJP1515 |
| 近江製茶株式会社 | 近江製茶（株） | 滋賀県甲賀市土山町前野504 | 有機加工食品 | JO010731PR-0408-0 |
| （有）もりかわ農場 | 1他 | 滋賀県長浜市高月町東柳野安田1611　他 | 有機農産物 | S-168 |
| 高尾俊壱 | 高尾俊壱 1 他 | 滋賀県近江八幡市安土町大中403 他 | 有機農産物 | 2000F-7 |
| （有）フクハラファーム | 20　他 | 滋賀県彦根市薩摩町津雲347　他 | 有機農産物 | S-183 |
| 藤村　明 | 3町口南　他 | 滋賀県東近江市大中町650　他 | 有機農産物 | NA-08120905 |
| 大中農友会 | 三町区北　他 | 滋賀県近江八幡市安土町大中439　他 | 有機農産物 | NA-09022607 |
| 有限会社ケーワイ | 有限会社ケーワイ | 滋賀県大津市和邇高城281-28 | 有機加工食品 | NB-09072401 |
| 針江のんきーふぁーむ　石津大輔 | １　他 | 滋賀県高島市新旭町針江川北1730～1734　他 | 有機農産物 | S-190 |
| 三星砿業株式会社 | 下③　他 | 滋賀県長浜市余呉町下丹生平篠186　他 | 有機農産物 | 21-05 |
| 清水　光男 | 12　他 | 滋賀県高島市安曇川町長尾北保地1441　他 | 有機農産物 | 114-053 |
| （株）チェリオコーポレーション | （株）チェリオコーポレーション　滋賀工場 | 滋賀県東近江市鯰江町200-1 | 有機加工食品 |  |
| (株）リスペクト | (株）リスペクト　他 | 滋賀県大津市仰木2-6-3　他 | 有機加工食品 | NB-16090502 |
| （株）マルヨシ近江茶 | （株）マルヨシ近江茶 | 滋賀県甲賀市土山町大野2723 | 有機加工食品 | JM151218PR-1363-0 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/shiga.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/shiga.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/shiga.php> (nombre, dirección y web propia de cada socio)
- Estado: **6 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 叶匠壽庵 | 大津市 | Dulces y repostería | 和菓子協会 | http://www.kanou.com/ | 大津市大石龍門 4-2-1 |
| 古川日登堂 | 彦根市 | Dulces y repostería | 和菓子協会 | http://www.hinobori.jp/ | 彦根市中央町 6-22 |
| お菓子司　しろ平老舗 | 愛荘町 | Dulces y repostería | 和菓子協会 | http://www.shirohei.com/ | 愛知郡愛荘町愛知川 1504 |
| （有）かぎや菓子舗 | 日野町 | Dulces y repostería | 和菓子協会 | http://kagiyakashiho.web.fc2.com/ | 蒲生郡日野町村井 1336 |
| 御菓子司（株）大彌 | 甲賀市 | Dulces y repostería | 和菓子協会 | http://www.daiya.info/ | 甲賀市水口町三大寺 34 |
| 梅元老舗 | 野洲市 | Dulces y repostería | 和菓子協会 | http://www.umemoto-wagashi.com/ | 野洲市野洲 267 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/shiga.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/shiga> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 9, Pescado 4, Pan y cereal 3, Carne 2, Lácteos y quesos 1, Huevos 1, Setas 1, ⚠ por decidir 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 滋賀農業公園ブルーメの丘 | 日野町 | Lácteos y quesos | ficha | — | https://www.tabechoku.com/producers/25359 | 滋賀県蒲生郡日野町 |
| 清葉庵 | 大津市 | Huevos | ficha | — | https://www.tabechoku.com/producers/20636 |  |
| TUNAGU | 長浜市 | Setas | ficha | — | https://www.tabechoku.com/producers/26475 |  |
| 木村水産 | 彦根市 | Pescado | ficha | — | https://www.tabechoku.com/producers/20960 |  |
| グリーン愛ランド清香園（セイカエン） | 東近江市 | Pescado | ficha | — | https://www.tabechoku.com/producers/26850 |  |
| すぐるや | 近江八幡市 | Pescado | ficha | — | https://www.tabechoku.com/producers/23111 |  |
| 湖魚処　ペスカ | 高島市 | Pescado | ficha | — | https://www.tabechoku.com/producers/28176 |  |
| ナチュラル　フォレスト | 長浜市 | Carne | ficha | — | https://www.tabechoku.com/producers/21096 |  |
| 大吉牧場 | 高島市 | Carne | ficha | — | https://www.tabechoku.com/producers/21427 |  |
| 近江園田ふぁーむ | 近江八幡市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/28794 |  |
| RICE IS COMEDY | 長浜市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/24585 |  |
| お米の家倉 | 長浜市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/22104 |  |
| 尾崎が育てた野菜。 | 大津市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21854 |  |
| ファームランドわかば | 東近江市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077413 |  |
| 山中農産 | 東近江市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078619 |  |
| ワダケン（リアルソイルハウス） | 栗東市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22247 |  |
| 香貴丸プロダクツ | 湖南市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25295 |  |
| こひろファーム | 湖南市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/27485 |  |
| 高野いちご園 | 竜王町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21544 | 滋賀県蒲生郡竜王町 |
| 草野農場 | 長浜市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/26673 |  |
| みなくちファーム | 高島市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21312 |  |
| 針江のんきぃふぁーむ | 高島市 | ⚠ por decidir | — | — | https://www.tabechoku.com/producers/21157 |  |
