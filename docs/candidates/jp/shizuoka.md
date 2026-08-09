# Shizuoka — candidatos

- CSV: `data/csv/jp/chubu/shizuoka.csv` (3 filas, todas altas de esta pasada).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (2026-08-04).
- Estado: **las 3 integradas** en el CSV el 2026-08-04 como `parcial`. Cola vacía; el valor de este fichero es ahora el «Qué falta».

| nombre | municipio | categoría | A/B | web |
|---|---|---|---|---|
| Suzuki Choju Shoten / Yamacho | Mori | Té e infusiones | B | 100nen-meicha.jp |
| Baird Brewing | Izu (Shuzenji) | Cerveza | B | bairdbeer.com |
| West Coast Brewing | Shizuoka (Mochimune) | Cerveza | B | westcoastbrewing.jp |

Mochimune es un barrio de la ciudad de **Shizuoka** y Shuzenji de **Izu**: el
`municipio` es la ciudad, no el barrio.

## Sake (14, pasada 2026-08-04)

Cola nueva: el fichero estaba vacío de candidatos. Fuente: censo de 酒蔵 de
SAKETIMES, <https://jp.sake-times.com/sakagura/shizuoka> (30 bodegas, leído
2026-08-04). Gremio: 静岡県酒造組合, <http://www.shizuoka-sake.jp/>.
Ninguna trae dominio. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Isojiman Shuzo | 磯自慢酒造 | Yaizu |
| Aoshima Shuzo | 青島酒造 | Fujieda |
| Shidaizumi Shuzo | 志太泉酒造 | Fujieda |
| Sugii Shuzo | 杉井酒造 | Fujieda |
| Eikun Shuzo | 英君酒造 | Shizuoka |
| Kanzawagawa Shuzojo | 神沢川酒造場 | Shizuoka |
| Kunpai Shuzo | 君盃酒造 | Shizuoka |
| Sanwa Shuzo | 三和酒造 | Shizuoka |
| Shizuoka Hiraki Shuzo | 静岡平喜酒造 | Shizuoka |
| Suruga Shuzojo | 駿河酒造場 | Shizuoka |
| Omuraya Shuzojo | 大村屋酒造場 | Shimada |
| Enshu Yamanaka Shuzo | 遠州山中酒造 | Kakegawa |
| Kokko Shuzo | 國香酒造 | Fukuroi |
| Senju Shuzo | 千寿酒造 | Iwata |

Seis están en 静岡市, que tras las fusiones es enorme y con tres 区: el
`municipio` es `Shizuoka`, como ya se decidió arriba para Mochimune.

## Qué falta
Shizuoka produce en torno al 40% del té de Japón y aquí hay **un** productor.
Lo que ya se descartó como fuente y por qué:
- 静岡茶商工業協同組合 (`ocha.or.jp/member/`) lista **茶商**, comerciantes y
  mayoristas de té concentrados en los distritos Aoi y Suruga de la capital. No
  son productores: no sirve como cantera, solo para cruzar nombres.

Frentes que sí quedan abiertos:
- Cooperativas y農園 de las zonas de té con denominación: **Kawane**, **Honyama**,
  **Kakegawa**, **Makinohara**, **Fujieda**, y el propio Mori.
- Wasabi de Izu y Utogi (cultivo en tatami-ishi, patrimonio agrícola mundial).
- Gremio de sake de Shizuoka, mikan de Mikkabi, pescado de Yaizu (katsuobushi) y
  Numazu (himono), fresa de Kunōzan.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 自然のわ研究会 | 自然のわ研究会　茶再製加工場 | 静岡県島田市金谷猪土居3769-3 | 有機加工食品 | MPJP1333 |
| 掛川市農業協同組合 | 掛川市農業協同組合緑茶加工施設 | 静岡県掛川市千羽1266 | 有機加工食品 | 203040401 |
| ミヤハラフーズ株式会社 | ミヤハラフーズ株式会社　原料第1倉庫 | 静岡県静岡市清水区中河内878-1、880-1 | 有機加工食品 | 第1293号 |
| （株）かつまた | （株）かつまた　他 | 静岡県富士市大渕3478-1　他 | 有機加工食品 | 第1139号 |
| 丸福製茶（株） | 丸福製茶（株）　本社工場　他 | 静岡県静岡市葵区若松町25　他 | 有機加工食品 | JM90501K-0234-0 |
| 茗広茶業（株） | 茗広茶業（株）　本社工場　他 | 静岡県静岡市葵区北番町117-4　他 | 有機加工食品 | JM030513PR-0613-0 |
| 中村製粉（株） | 中村製粉（株） | 静岡県浜松市中央区和合町1210 | 有機加工食品 | JＮ60810PR-0909-0 |
| 清茶会 | 清茶会 | 静岡県藤枝市助宗大谷184 | 有機農産物 | 01-036 |
| 住岡食品株式会社 | 住岡食品株式会社浜北工場　他 | 静岡県浜松市浜名区平口5201-1　他 | 有機加工食品 | カ-03-02 |
| 株式会社増田採種場 | 株式会社増田採種場 1 他 | 静岡県磐田市気子島983 他 | 有機農産物 | 2001F-38 |
| 株式会社八木音 | 株式会社八木音 工場 他 | 静岡県藤枝市茶町1丁目1-43 他 | 有機加工食品 | 2002M-4 |
| 株式会社小柳津清一商店 | 本社工場　他 | 静岡県静岡市駿河区向敷地1-5-38　他 | 有機加工食品 | カ-05-02 |
| 株式会社浜佐商店 | 株式会社浜佐商店　他 | 静岡県静岡市葵区安西3-11　他 | 有機加工食品 | 200111601 |
| 丸善製茶（株）　丸子工場 | 丸善製茶（株）　丸子工場　他 | 静岡県静岡市駿河区丸子新田314 | 有機加工食品 | JM80518K-0175-0 |
| 高砂珈琲（株）　磐田工場 | 高砂珈琲（株）　第一工場　他 | 静岡県磐田市下万能525-1　他 | 有機加工食品 | JT000122PR-0259-0 |
| 株式会社伊藤園 静岡相良工場 | 株式会社伊藤園 静岡相良工場 | 静岡県牧之原市女神21 | 有機加工食品 | 01-12B |
| （株）かねも | （株）かねも | 静岡県掛川市掛川70 | 有機加工食品 | JK050426PR-0817-0 |
| 永倉精麦株式会社 | 永倉精麦株式会社　他 | 静岡県駿東郡長泉町東野50-18　他 | 有機加工食品 | MPJP1081 |
