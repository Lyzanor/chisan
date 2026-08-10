# Nagasaki — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/nagasaki.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/nagasaki> (16 bodegas, leído 2026-08-04). Gremio: 長崎県酒造組合, <http://nagasaki-sake.sakura.ne.jp/>.
- Estado: cola abierta, 13 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`, salvo lo que se indique. El rōmaji de `nombre` y
`municipio` es propuesta a confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Imazato Shuzo | 今里酒造 | Hasami |
| Umegae Shuzo | 梅ケ枝酒造 | Sasebo |
| Senryu Shuzo | 潜龍酒造 | Sasebo |
| Nishimuta Shuzo | 西牟田酒造 | Sasebo |
| Fukuda Shuzo | 福田酒造 | Hirado |
| Mori Shuzojo | 森酒造場 | Hirado |
| Omoya Shuzo | 重家酒造 | Iki ⚠ |
| Kawachi Shuzo | 河内酒造 | Tsushima |
| Kinokawa | 杵の川 | Isahaya |
| Urakawa Shuzo | 浦川酒造 | Minamishimabara |
| Aimusume Shuzo | あい娘酒造 | Unzen |
| Ito Shuzojo | 伊藤酒造場 | Unzen |
| Kato Shuzojo | 加藤酒造場 | Shimabara ⚠ |

## Trampas
- ⚠ **La fuente sitúa 加藤酒造場 en 南高来郡有明町, que ya no existe**: se fusionó
  en 2006 en 島原市 (Shimabara). Escribir el nombre viejo deja la fila sin puerta
  geográfica (`AGENTS.md`). Ya visto en `tochigi.md`, `tokushima.md` y
  `fukuoka.md`: en Kyushu esta trampa es sistemática.
- ⚠ **壱岐 (Iki) es la cuna del 麦焼酎** y tiene Indicación Geográfica propia
  (壱岐焼酎). 重家酒造 hace las dos cosas: si su producto identitario es el
  shochu, la `categoria` es `Destilados y licores`, no `Sake`.
- **太田酒造場** aparece en la fuente **sin municipio**: resolver antes de
  escribir. Y no es 太田酒造 (Kusatsu, Shiga) ni 太田酒造場 (Wakasa, Tottori),
  ambas ya en esta carpeta.
- **La prefectura son 971 islas**: Iki, Tsushima y Hirado son áreas insulares a
  50-130 km de Nagasaki. Al geocodificar caerán lejos del centroide de la capital
  — es correcto, no un error que «corregir» moviendo `municipio`.

## Qué falta
- Las 3 bodegas restantes del censo, y **el gremio de shochu de Iki**, que es un
  frente aparte y con GI.
- Sin abrir: **カステラ** — Nagasaki es donde entró y hay casas de tres siglos
  (Fukusaya, Bunmeido y decenas de obradores pequeños), el frente más obvio;
  びわ (níspero, primera de Japón), 五島うどん y 五島の椿油, 島原そうめん,
  長崎和牛, あごだし (caldo de pez volador), 波佐見焼 (cerámica).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 長工醤油味噌協同組合 | 長工醤油味噌協同組合 | 長崎県大村市溝陸町815 | 有機加工食品 | 010409-001 |
| （有）手のべ陣川 | （有）手のべ陣川 | 長崎県南島原市北有馬町己564-1 | 有機加工食品 | JJ010322PR-0741-0 |
| 長崎有機農業研究会 | 溝田督史　上大峰　他 | 長崎県南島原市南有馬町己780、781-1.2、782-1　他 | 有機農産物 | AFASSEQ-AA-010301 |
| 農業法人夢有民農場有限会社 | 圃場1他 | 長崎県南島原市布津町坂下名船石原4669-66他 | 有機農産物 | SES-180322 |
| アリアケファーム（株） | アリアケファーム㈱　11 | 長崎県諫早市中央干拓11、12番地 | 有機農産物 | 2009F-5 |
| ひらどオーガニック | 栽培場他 | 長崎県平戸市前津古町字ナゴサ592－1他 | 有機農産物 | SES-25070101 |
| 農業法人有限会社きのこ屋 | 農業法人有限会社きのこ屋加工場 | 長崎県平戸市前津吉町605他 | 有機加工食品 | SEZ-26102901 |
| 有限会社グリーンティ五島 | 製茶工場他 | 長崎県五島市岐宿町岐宿2905番地2他 | 有機加工食品 | SEZ-28041881 |
| （有）お茶の秋月園 | お茶の秋月園工場 | 長崎県長崎市富士見町16-9 | 有機加工食品 | 1703-B01 |
| 長崎ＥＣＯＦ | １　他 | 長崎県雲仙市吾妻町大字永中名1307-1　他 | 有機農産物 | 1038号 |
| 株式会社雲仙きのこ本舗　有機エノキグループ | 株式会社雲仙きのこ本舗　有機エノキグループ | 長崎県南島原市有家町尾上3147　　他 | 有機農産物 | 420GM-1701 |
| 株式会社雲仙きのこ本舗　有機マイタケグループ | 株式会社雲仙きのこ本舗　有機マイタケグループ | 長崎県南島原市有家町尾上3147　　他 | 有機農産物 | 420GM-1703 |
| 農事組合法人ごとう茶生産組合 | 圃場1（コンカナ王国2）他 | 長崎県五島市上大津町蟹丁水2479-イ他 | 有機農産物 | SES-28041801 |
| ナチュラルファーミング合同会社 | 1　他 | 長崎県雲仙市吾妻町阿母名字大熊44-2　他 | 有機農産物 | 1193号 |
| 株式会社アイル　田平工場 | 株式会社アイル　田平工場 他 | 長崎県平戸市田平町小手田免419-1 他 | 有機加工食品 | SEZ-03042701 |
| ごと株式会社 | ごと　E1:51001他 | 長崎県五島市高田町1399他 | 有機農産物 | SES-04021801 |
| 有限会社北村製茶 | 圃場番号１ | 長崎県北松浦郡佐々町迎木場免４２５番地１８ | 有機農産物 | SES-04101902 |
| 百笑会プラス | 1　他 | 長崎県東彼杵郡波佐見町村木郷1687,1689,1685　他 | 有機農産物 | 2305-A01 |
| 雲仙農園 | 2　他 | 長崎県雲仙市吾妻町永中名永中道256番　他 | 有機農産物 | 42-01 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/nagasaki.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/nagasaki.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
- Estado: **3 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| ㈱山一 | 南島原市 | Pan y cereal | 全乾麺 | http://www.mennoyamaichi.co.jp/ | 手延べ干しめん |
| ㈲手のべ陣川 | 南島原市 | Pan y cereal | 全乾麺 | http://www.jin-men.com/ | 手延べ干しめん |
| ㈱小林甚製麺 | 南島原市 | Pan y cereal | 全乾麺 | http://www.kobayashijin.com/ | 手延べ干しめん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/nagasaki.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/nagasaki> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 9, Pescado 5, Pan y cereal 5, Té e infusiones 1, Huevos 1, Frutos secos 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 藤田製茶 | 東彼杵町 | Té e infusiones | ficha | — | https://www.tabechoku.com/producers/24770 | 長崎県東彼杵郡東彼杵町 |
| NaturalEggLab | 平戸市 | Huevos | ficha | — | https://www.tabechoku.com/producers/22332 |  |
| 楓帆 | 佐々町 | Pescado | ficha | — | https://www.tabechoku.com/producers/28904 | 長崎県北松浦郡佐々町 |
| 中田水産 | 島原市 | Pescado | ficha | — | https://www.tabechoku.com/producers/24171 |  |
| 長崎のイケメン漁師 坂野水産 | 平戸市 | Pescado | ficha | — | https://www.tabechoku.com/producers/24202 |  |
| 百旬館 | 平戸市 | Pescado | ficha | — | https://www.tabechoku.com/producers/26553 |  |
| あごだしのはたした | 新上五島町 | Pescado | ficha | — | https://www.tabechoku.com/producers/24753 | 長崎県南松浦郡新上五島町 |
| アースカンパニー | 佐世保市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/27498 |  |
| 本村製麺工場 | 南島原市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/25458 |  |
| 花野果 | 新上五島町 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/20934 | 長崎県南松浦郡新上五島町 |
| 諫美豚 土井農場 | 諫早市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/24893 |  |
| ヨシダファーム | 諫早市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/26332 |  |
| やまびこ農苑えぼし | 佐世保市 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/3078259 |  |
| 彩海ファームＭＡＳＡＫＡＺＵ | 佐世保市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/27895 |  |
| 薄田自然農法ファーム | 佐世保市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/48 |  |
| うーぞの農園 | 南島原市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25699 |  |
| たぬき池自然農園 | 大村市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25128 |  |
| 薬味屋人作 | 島原市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29558 |  |
| 宮下農園 | 諫早市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25519 |  |
| ファーム中島 | 諫早市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25225 |  |
| のんびり山 | 諫早市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20243 |  |
| はまちゃんファーム | 雲仙市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20159 |  |
