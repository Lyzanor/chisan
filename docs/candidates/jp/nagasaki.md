# Nagasaki — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/nagasaki.csv` (41 filas tras la revisión integral de 2026-08-11).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/nagasaki> (16 bodegas, leído 2026-08-04). Gremio: 長崎県酒造組合, <http://nagasaki-sake.sakura.ne.jp/>.
- Estado: revisión integral cerrada el 2026-08-11; las entradas no publicadas se conservan abajo con la carencia concreta que impide incorporarlas.

Categoría para todas: `Sake`, salvo lo que se indique. El rōmaji de `nombre` y
`municipio` es propuesta a confirmar contra la web de cada bodega.

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

> **Reauditoría 2026-08-11:** 18 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 長工醤油味噌協同組合 | 長工醤油味噌協同組合 | 長崎県大村市溝陸町815 | 有機加工食品 | 010409-001 |
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
- Estado: revisión 2026-08-11; **0 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

## Nuevos candidatos de cerveza artesana — barrido 2026-08-13

Barrido sistemático de microcervecerías artesanales independientes con obrador propio, marca activa, presencia web y redes sociales. Categoría: `Cerveza`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Instagram | Notas de producción |
|---|---|---|---|---|---|---|

## Nuevos candidatos de pescado y marisco artesanal — barrido 2026-08-14

Barrido sistemático de productores, acuicultores y elaboradores artesanos de pescado y marisco de Nagasaki con instalaciones productivas propias, marca activa y venta/presencia web directa. Categoría: `Pescado`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Descripción / Especialidad | Fuente |
|---|---|---|---|---|---|---|
