# Wakayama — candidatos

- CSV: `data/csv/jp/kansai/wakayama.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/wakayama> (19 bodegas, leído 2026-08-04). Gremio: 和歌山県酒造組合, <http://wa-syuzouren.sakura.ne.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Nate Shuzoten | 名手酒造店 | Kainan |
| Nakano BC | 中野BC | Kainan |
| Tsuho Shuzo | 通宝酒造 | Kainan |
| Shimamoto Shuzojo | 島本酒造場 | Kainan |
| Sekaiitto | 世界一統 | Wakayama |
| Tabata Shuzo | 田端酒造 | Wakayama |
| Tencho Shimamura Shuzo | 天長島村酒造 | Wakayama |
| Shuho Shuzo | 祝砲酒造 | Wakayama |
| Kokonoe Zakka | 九重雜賀 | Kinokawa |
| Takagaki Shuzo | 高垣酒造 | Aridagawa |
| Hatsuzakura Shuzo | 初桜酒造 | Katsuragi |
| Kishino Shuzo Honke | 岸野酒造本家 | Gobo |
| Nakao Shuzoten | 中尾酒造店 | Kimino |
| Ozaki Shuzo | 尾崎酒造 | Shingu ⚠ |

## Trampas
- ⚠ **尾崎酒造 (Shingu, Wakayama)** no es 尾崎酒造 (Ajigasawa, Aomori), ya listada
  en `aomori.md`. Mismo 社名, dos extremos del país.
- **中尾酒造店 (Kimino, Wakayama)** no es 中尾酒造 (Ibaraki, Osaka), en `osaka.md`.
- **九重雜賀 (Kinokawa)** es sobre todo **casa de vinagre** (雑賀の酢) que además
  hace sake: la `categoria` que pese puede ser `Condimentos`, no `Sake`. Mirarlo
  antes de escribir.
- **中野BC (Kainan)** es grande y hace licor de ume además de sake: entra por
  identidad propia, pero decidir la categoría dominante.
- 海草郡紀美野町 y 伊都郡かつらぎ町 no son municipio: la fila lleva el 町 —
  Kimino, Katsuragi.

## Qué falta
- Las 5 bodegas restantes del censo.
- **梅 (ciruela ume)**: Wakayama produce en torno al 60% del nacional y el
  南高梅 de **Minabe y Tanabe** es Patrimonio Agrícola Mundial, con decenas de
  elaboradores de umeboshi con marca y tienda propia. Es el frente más rico de
  la prefectura y no hay ni una fila.
- Sin abrir: **有田みかん** (mandarina con GI), 山椒 de Arida (casi todo el
  nacional), かつお/まぐろ de Katsuura, 湯浅の醤油 — **Yuasa es la cuna de la
  salsa de soja japonesa** y conserva obradores en madera.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| アンジー農園 | ハウス3号　他 | 和歌山県紀の川市下丹生谷182-1　他 | 有機農産物 | 0104-03 |
| かつらぎ町有機栽培実践グループ（柿生産グループ） | 女良畑　他 | 和歌山県伊都郡かつらぎ町西渋田女良畑704　他 | 有機農産物 | 0010-01 |
| 松本農園 | 垣内（かいと） | 和歌山県伊都郡かつらぎ町背ノ山字北脇261,269,277 | 有機農産物 | 0305-01 |
| 西井ファーム | 1 他 | 和歌山県有田郡有田川町彦ヶ瀬413　他 | 有機農産物 | 30-03 |
| プラム食品(株) | プラム食品(株) | 和歌山県西牟婁郡上富田町生馬1474－1 | 有機加工食品 | 0610－01 |
| 株式会社豆紀 | 株式会社豆紀 | 和歌山県和歌山市岩橋620 | 有機加工食品 | MPJP1444 |
| 丸長水産株式会社マルチョウフーズ | 丸長水産(株)マルチョウフーズ | 和歌山県田辺市文里2丁目34－1 | 有機加工食品 | 0303－02A |
| （株）丸惣 | 本社工場　他 | 和歌山県田辺市稲成町24-5　他 | 有機加工食品 | 0101－02 |
| 株式会社ジーエスフード和歌山工場 | （株）ジーエスフード和歌山工場 | 和歌山県紀ノ川市桃山町調月1758-11 | 有機加工食品 | JG010322PR-0271-1 |
| 和歌山有機の会 | １－３　馬瀬１　他 | 和歌山県海南市下津町馬瀬2076-1　他 | 有機農産物 | 0102-01 |
| サカイキャニング株式会社 | 高野山麓かつらぎ工場　他 | 和歌山県伊都郡かつらぎ町島358－1　他 | 有機加工食品 | 0306-01 |
| 紀州大地の会 | 宮田種千 ほ場1 他 | 和歌山県和歌山市田尻669 他 | 有機農産物 | 2001F-52 |
| 農業生産法人 株式会社 濱田農園 | 8反　他 | 和歌山県田辺市上芳養5531　他 | 有機農産物 | 0808-01 |
| 関本貴則 | 1 他 | 和歌山県紀の川市切畑1212-2　他 | 有機農産物 | 30-04 |
| 紀の川ファーマーズ | 寺の前　他 | 和歌山県岩出市鳥山648-1　他 | 有機農産物 | NA-08120904 |
| (株)ビオ・マーケット | (株)ビオ・マーケット　和歌山センター | 和歌山県紀の川市重行659-57 | 有機加工食品 |  |
| わかやまシトラス | かいね　他 | 和歌山県有田市宮原町東160　他 | 有機農産物 | NA-09033002 |
| 紀州食品(株) | 紀州食品(株)　他 | 和歌山県伊都郡かつらぎ町東渋田585　他 | 有機加工食品 | NB-09061608 |
| 田辺印の会 | 芝崎東　他 | 和歌山県田辺市長野谷尾495　他 | 有機農産物 | 0904-01 |
| NPO法人 南高梅の会 | 山下 | 和歌山県日高郡みなべ町植田馬尻601-34 | 有機農産物 | 1006-01 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/wakayama.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/wakayama.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/wakayama.php> (nombre, dirección y web propia de cada socio)
- Estado: **1 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 鈴屋 | 田辺市 | Dulces y repostería | 和菓子協会 | http://dxcake.jp/ | 田辺市湊 1022 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/wakayama.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/wakayama> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 12, Pescado 4, Miel 3, Conservas 2, Setas 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 梅田養蜂場 | 岩出市 | Miel | ficha | — | https://www.tabechoku.com/producers/22479 |  |
| ㊂西村養蜂場 | 海南市 | Miel | ficha | — | https://www.tabechoku.com/producers/27147 |  |
| 村上養蜂 | 紀の川市 | Miel | ficha | — | https://www.tabechoku.com/producers/21174 |  |
| 【冷水しいたけ農園】 | 橋本市 | Setas | ficha | — | https://www.tabechoku.com/producers/26988 |  |
| 潮岬製塩所 | 古座川町 | Pescado | ficha | — | https://www.tabechoku.com/producers/3078209 | 和歌山県東牟婁郡古座川町 |
| 上野山翔史(福扇水産) | 有田市 | Pescado | ficha | — | https://www.tabechoku.com/producers/24297 |  |
| 底物屋　浜田博光 | 由良町 | Pescado | ficha | — | https://www.tabechoku.com/producers/28796 | 和歌山県日高郡由良町 |
| 湯川水産 | 白浜町 | Pescado | ficha | — | https://www.tabechoku.com/producers/21070 | 和歌山県西牟婁郡白浜町 |
| 塩の梅 | みなべ町 | Conservas | ficha | — | https://www.tabechoku.com/producers/25849 | 和歌山県日高郡みなべ町谷口 |
| 梅ボーイズ 山本将志郎 | みなべ町 | Conservas | ficha | — | https://www.tabechoku.com/producers/26463 | 和歌山県日高郡みなべ町晩稲 |
| 感動果物農家山本農園 | 和歌山市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21800 |  |
| 井関農園 | 有田川町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28536 | 和歌山県有田郡有田川町奥 |
| 伊藤農園 | 有田市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24333 |  |
| 紀州伊藤園 | 有田市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22322 |  |
| 田中農園 | 橋本市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28130 |  |
| キタヤマ果樹園 | 橋本市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/27980 |  |
| 根っこ農園 | 橋本市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077163 |  |
| 藤田農園 | 橋本市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/26764 |  |
| ひとみず | 白浜町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23502 | 和歌山県西牟婁郡白浜町 |
| ロハス農園 | 紀の川市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/26795 |  |
| キタオ農園 | 紀の川市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22668 |  |
| 紀州からの贈り物（わんこ様） | 那智勝浦町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24272 |  |
