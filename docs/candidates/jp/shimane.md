# Shimane — candidatos

- CSV: `data/csv/jp/chugoku/shimane.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/shimane> (34 bodegas, leído 2026-08-04). Gremio: 島根県酒造組合, <http://www.shimane-sake.or.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Izumo es, según el 出雲国風土記, donde se documenta el sake más antiguo de Japón.
Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Oroku Shuzo | 王祿酒造 | Matsue |
| Kisuki Shuzo | 木次酒造 | Unnan ⚠ |
| Asahi Shuzo (Kyokujitsu) | 旭日酒造 | Izumo |
| Itakura Shuzo | 板倉酒造 | Izumo |
| Ichinomiya Shuzo | 一宮酒造 | Oda |
| Kimura Shuzo | 木村酒造 | Oda ⚠ |
| Aoto Shuzo | 青砥酒造 | Yasugi |
| Akana Shuzo | 赤名酒造 | Iinan |
| Ikezuki Shuzo | 池月酒造 | Ohnan |
| Kamofuku Shuzo | 加茂福酒造 | Ohnan |
| Okuizumo Shuzo | 奥出雲酒造 | Okuizumo |
| Kasen Shuzo | 華泉酒造 | Tsuwano |
| Okadaya Honten | 岡田屋本店 | Masuda |
| Oki Shuzo | 隠岐酒造 | Okinoshima |

## Trampas
- ⚠ **木次酒造 (sake) y 木次乳業 (Kisuki Nyugyo, lácteos) son dos empresas
  distintas del mismo municipio, Unnan, y se leen igual.** La segunda es una de
  las lecherías de pasto más conocidas de Japón y candidata evidente por su
  cuenta: no fusionarlas ni descartar una por la otra.
- ⚠ **木村酒造 (Oda, Shimane)** no es 木村酒造 (Yuzawa, Akita), ya en `akita.md`.
  Mismo 社名, dos empresas.
- ⚠ **旭日酒造 (Izumo) se lee Kyokujitsu**, no Asahi, y por tanto **no** es
  ninguno de los cuatro 旭酒造 listados en `mie.md`. Kanji parecido, lectura
  distinta: confirmar la lectura antes de fijar el `slug`.
- **隠岐酒造** está en las **islas Oki**, a 60 km de la costa: municipio
  隠岐の島町 (Okinoshima), y ojo con confundirlo con 沖縄 (Okinawa) al teclear.
- 邑智郡 y 鹿足郡 no son municipio: la fila lleva el 町 — Ohnan, Tsuwano.

## Qué falta
- Las ~20 bodegas restantes del censo.
- Sin abrir: **木次乳業** y los lácteos de pasto de Unnan (frente propio),
  **しじみ del lago Shinji** (casi todo el nacional, con cofradía),
  出雲そば, 石見和牛, 西条柿 y の干し柿, 板わかめ, y el 和菓子 de Matsue, que es
  una de las tres capitales del té y el dulce de Japón.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 平木正美 | 1　他 | 島根県浜田市三隅町東平原スナコダ398　他 | 有機農産物 | 05A-005 |
| 大畑　安夫 | 1　他 | 島根県江津市都野津町667（ハウス1～3）　他 | 有機農産物 | 01A-004 |
| 佐々原　洋道 | 圃場1 | 島根県浜田市金城町入野ロ-262 9号ハウス | 有機農産物 | 02A-008 |
| 有限会社桜江町桑茶生産組合 | （有）桜江町桑茶生産組合 | 島根県江津市桜江町市山507-1 | 有機加工食品 | 02B-011,06C-005 |
| （有）三和農産 | 3　他 | 島根県出雲市矢尾町342-4　他 | 有機農産物 | S-098 |
| （有）やさか共同農場 | 有限会社　やさか共同農場　味噌製造所　他 | 島根県浜田市弥栄町三里ハ268番地　他 | 有機加工食品 |  |
| 三浦　寿紀 | 圃場1 | 島根県浜田市弥栄町木都賀イ1162-2 | 有機農産物 | 03A-001 |
| 株式会社ひかわ | 株式会社ひかわ | 島根県出雲市斐川町直江2620-2 | 有機加工食品 | MPJP1057 |
| 石井　政信 | 圃場1 | 島根県鹿足郡吉賀町下須542-1 | 有機農産物 | 01A-035-4 |
| 田村　勝美 | 1　他 | 島根県鹿足郡吉賀町下須358（ハウス１）　他 | 有機農産物 | 04A-035-8 |
| (有)一畑園 | (有)一畑園　東部工業団地工場　他 | 島根県出雲市小境町1700-22　他 | 有機加工食品 |  |
| 有機の美郷有限会社 | M-2　他 | 島根県邑智郡美郷町小松地253-1　他 | 有機農産物 | 08A-0002 |
| 健幸ファーム（株）いづも農縁 | S-1　他 | 島根県出雲市里方455-1　他 | 有機農産物 | NA-09061602 |
| ヤマノ株式会社 | ヤマノ株式会社 | 島根県安来市西恵乃島町837-30 | 有機加工食品 | 10J-0001 |
| 安来オーガ有限会社 | A圃場75　他 | 島根県安来市穂日島町75　他 | 有機農産物 | 10A-0001 |
| 永安 恵治 | 圃場1 | 島根県鹿足郡吉賀町大野原中組185 | 有機農産物 | 10A-006 |
| 有限会社宝箱 | ②　他 | 島根県松江市大庭町1631-8,1631-9,1631-10,1631-11　他 | 有機農産物 | 10A-0003 |
| さんべ食品工業株式会社 | さんべ食品工業株式会社 | 島根県大田市大田町大田イ403－5 | 有機加工食品 | 10J-0002 |
| 株式会社　茶三代一 | 株式会社　茶三代一 | 島根県出雲市長浜町729-6 | 有機加工食品 | JC990827PR-1151-0 |
| 高畑環境ファーム清水農園　清水溥万 | 1　他 | 島根県邑智郡美郷町高畑17-1（イ）　他 | 有機農産物 | 17A-0001 |
