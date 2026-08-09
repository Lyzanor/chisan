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
