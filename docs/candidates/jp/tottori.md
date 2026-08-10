# Tottori — candidatos

- CSV: `data/csv/jp/chugoku/tottori.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/tottori> (20 bodegas, leído 2026-08-04). Gremio: el de Tottori lo aloja la propia prefectura, <https://www.pref.tottori.lg.jp/jizake/> — es el único caso de los 47 en que el gremio no tiene dominio propio.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Chiyomusubi Shuzo | 千代むすび酒造 | Sakaiminato |
| Inata Honten | 稲田本店 | Yonago |
| Kumezakura Shuzo | 久米桜酒造 | Hoki |
| Suwa Shuzo | 諏訪酒造 | Chizu |
| Gensui Shuzo | 元帥酒造 | Kurayoshi |
| Takada Shuzo | 高田酒造 | Kurayoshi ⚠ |
| Nakai Shuzo | 中井酒造 | Kurayoshi |
| Otani Shuzo | 大谷酒造 | Kotoura |
| Ehara Shuzo Honten | 江原酒造本店 | Kotoura |
| Umetsu Shuzo | 梅津酒造 | Hokuei |
| Kunshi Shuzo | 君司酒造 | Tottori |
| Ota Shuzojo | 太田酒造場 | Wakasa ⚠ |
| Takada Shuzojo | 高田酒造場 | Iwami ⚠ |
| Oiwa Shuzo Honten | 大岩酒造本店 | Kofu |

## Trampas
- ⚠ **高田酒造 (Kurayoshi) y 高田酒造場 (Iwami) son dos empresas de esta misma
  prefectura**, separadas por un kanji. No fusionar filas.
- ⚠ **岩美町 (Iwami, Tottori) no es 石見 (Iwami)**, la comarca occidental de
  Shimane que da nombre a 石見銀山 y al 石見和牛. Mismo rōmaji, prefecturas
  vecinas: comprobar contra qué centroide resuelve.
- ⚠ **太田酒造場 (Wakasa, Tottori)** no es 太田酒造 (Kusatsu, Shiga, en `shiga.md`)
  ni 大田酒造 (Iga, Mie, en `mie.md`). Tres empresas, un rōmaji `Ota`.
  Y **若桜町 (Wakasa, Tottori)** convive con 若狭 (Wakasa), la comarca de Fukui.
- **久米桜酒造 (Hoki)** hace además la cerveza 大山Gビール: una fila, con la
  `categoria` que pese.

## Qué falta
- Las 6 bodegas restantes del censo.
- Tottori es la prefectura menos poblada de Japón pero no la menos productiva.
  Sin abrir: **二十世紀梨** (la pera nashi que lleva su nombre, con museo propio),
  **松葉がに** (cangrejo de las nieves, con subasta y marca por puerto),
  らっきょう de las dunas, lácteos y helado de Daisen, 鳥取和牛.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 気高オーガニック倶楽部 | 梅実一夫 3 他 | 鳥取県鳥取市気高町飯里字道の上344 他 | 有機農産物 | 2001F-33 |
| 鳥取ずいせん生産組合　平木ひとみ | 1　他 | 鳥取県鳥取市西品治163　他 | 有機農産物 | A04-0002 |
| 門永光 | ほ場番号1　他 | 鳥取県西伯郡南部町鶴田887　他 | 有機農産物 | A06-0007 |
| 有限会社長田茶店　長田吉太郎 | 有限会社長田茶店本社工場 | 鳥取県米子市岩倉町30 | 有機加工食品 | B04-0002 |
| 株式会社ファイナール　代表取締役　門脇　康弘 | （株）ファイナール　本社工場 | 鳥取県鳥取市上味野15 | 有機加工食品 | B07-0003 |
| 倉吉オーガニック倶楽部　代表　数馬　豊 | 11　他 | 鳥取県倉吉市富海日暁田63　他 | 有機農産物 | A07-0009 |
| 森藤　力 | 1　他 | 鳥取県西伯郡伯耆町番原小才1008　他 | 有機農産物 | A10-0020 |
| ハッピーファーム藤井農園　藤井　宏康 | 1　他 | 鳥取県東伯郡琴浦町別所本谷頭709　他 | 有機農産物 | A11-0023 |
| THA　斎藤茂雄 | 1　他 | 鳥取県日野郡日野町野田118　他 | 有機農産物 | A11-0024 |
| れんぶつオーガニック　代表　蓮佛　廣文 | 1　他 | 鳥取県八頭郡八頭町米岡字大新田上分1064　他 | 有機農産物 | A11-0027 |
| 有限会社鳥取珈琲館　代表取締役　田中　治 | （有）鳥取珈琲館焙煎所 | 鳥取県鳥取市商栄町２５１番地４ | 有機加工食品 | B13-0010 |
| 農事組合法人陣構茶生産組合代表理事　橋井　恭一 | ほ場番号1　他 | 鳥取県西伯郡大山町東坪2477-3　他 | 有機農産物 | A13-0029 |
| 株式会社コミュニティファーム　代表取締役　長谷川　正 | 1　他 | 鳥取県西伯郡伯耆町上野761番地8　他 | 有機農産物 | A15-0033 |
| 株式会社カンダ技工 | 株式会社カンダ技工境港工場他 | 鳥取県境港市竹内団地269番地他 | 有機加工食品 | SEZ-29041901 |
| 合同会社大山スマイルファーム　代表社員　小林 直哉 | 施設番号1　他 | 鳥取県西泊郡大山町岡559番地　他 | 有機加工食品 | 第B17-0014号 |
| マルサンアイ鳥取株式会社 | マルサンアイ鳥取株式会社 | 鳥取県鳥取市河原町西円通寺字畑ケ中81-1 | 有機加工食品 | 18-073B |
| Sand place株式会社　代表取締役　砂場　由哲 | 1　他 | 鳥取県鳥取市用瀬町別府325-2　他 | 有機農産物 | 第A18-0036号 |
| (株)ゼンヤクノ－ | ㈱ゼンヤクノー本社　他 | 鳥取県鳥取市賀露町4001　他 | 有機加工食品 | JZ190514PR-1649 |
| 株式会社伯耆のきのこ　代表取締役　三鴨真樹 | ほ場番号1　他 | 鳥取県日吉津村富吉656　他 | 有機農産物 | A19-0037 |
| 鳥取きくらげ生産グループ　緑工房　代表　河村雄太 | ほ場番号1　他 | 鳥取県鳥取市服部483-1 | 有機農産物 | A19-0039 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/tottori.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
- Estado: revisión cerrada el 2026-08-10; **3** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| AKARI Brewing | Tottori | Cerveza | JBA | akaribrewing.com | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| Think & (JAP Brewery) | Yonago | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 倉吉ビール (Brew Lab Kurayoshi) | Kurayoshi | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

**Ya integrado, no volver a proponer:** 久米桜酒造 (matriz de 大山Gビール) ya está en `tottori.csv`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/tottori.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **1 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 大山ハム | 米子市 | Carne | búsqueda dirigida + web propia | https://daisenham.sanin.jp/ | jamón y embutido |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/tottori.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/tottori> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 12, Setas 3, Pan y cereal 3, Pescado 2, Miel 1, Carne 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| あんどう青果 | 倉吉市 | Miel | ficha | — | https://www.tabechoku.com/producers/29352 |  |
| アイディケきのこ事業部 | 八頭町 | Setas | ficha | — | https://www.tabechoku.com/producers/29414 |  |
| ISN | 岩美町 | Setas | ficha | — | https://www.tabechoku.com/producers/22807 | 鳥取県岩美郡岩美町浦富 |
| 木子ぽっぽ | 鳥取市 | Setas | ficha | — | https://www.tabechoku.com/producers/23345 |  |
| らっきょう市場 | 鳥取市 | Pescado | ficha | — | https://www.tabechoku.com/producers/26882 |  |
| 鳥取の清流 御子垣農園 | 鳥取市 | Pescado | ficha | — | https://www.tabechoku.com/producers/3078423 |  |
| 鹿野地鶏 | 鳥取市 | Carne | ficha | — | https://www.tabechoku.com/producers/20892 |  |
| Mファーム | 伯耆町 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/3078222 | 鳥取県西伯郡伯耆町 |
| 大山農園 | 大山町 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/3078132 |  |
| 米蔵砂川屋 | 鳥取市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/21719 |  |
| のぎ屋 | 倉吉市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21659 |  |
| 岸田秀果園 | 倉吉市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21478 |  |
| 西谷農園 | 倉吉市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077223 |  |
| 丸山農園 | 八頭町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22066 | 鳥取県八頭郡八頭町 |
| 竹信農園 | 北栄町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28459 | 鳥取県東伯郡北栄町下種 |
| Farm Nakahara | 北栄町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077700 | 鳥取県東伯郡北栄町 |
| 梨屋 こうさてん十 | 大山町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078098 | 鳥取県西伯郡大山町 |
| LUCK HILL（ラックヒル） | 大山町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22280 | 鳥取県西伯郡大山町 |
| ふくの喜 | 琴浦町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29594 | 鳥取県東伯郡琴浦町 |
| つむぎfarm | 鳥取市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078364 |  |
| 西田園芸 | 鳥取市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25191 |  |
| たにがみ農園 | 鳥取市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/27820 |  |
