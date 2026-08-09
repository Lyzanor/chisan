# Mie — candidatos

- CSV: `data/csv/jp/kansai/mie.csv` (0 filas). Dedup: nada que cruzar en el CSV. En la bandeja del `README.md` está Maruhiko Sake Brewery (Yokkaichi), que no aparece en esta tabla.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/mie> (34 bodegas, leído 2026-08-04). Gremio: 三重県酒造組合, <http://www.mie-sake.or.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kiyasho Shuzo | 木屋正酒造 | Nabari |
| Ota Shuzo | 大田酒造 | Iga |
| Motosaka Shuzo | 元坂酒造 | Odai |
| Kawabu Jozo | 河武醸造 | Taki |
| Asahi Shuzo | 旭酒造 | Meiwa ⚠ |
| Ise Man | 伊勢萬 | Ise |
| Ito Shuzo | 伊藤酒造 | Yokkaichi |
| Kagura Shuzo | 神楽酒造 | Yokkaichi |
| Adachi Honke Shuzo | 安達本家酒造 | Asahi ⚠ |
| Inagaki Shuzojo | 稲垣酒造場 | Asahi ⚠ |
| Aburasho | 油正 | Tsu |
| Imamura Shuzo | 今村酒造 | Tsu |
| Ogawa Honke | 小川本家 | Tsu |
| Kankobai Shuzo | 寒紅梅酒造 | Tsu |

## Trampas
- ⚠ **Cuatro 旭酒造 distintos** en el catálogo: Meiwa (Mie), Echizen (Fukui, ya en
  `fukui.md`), Nagaoka (Niigata, la de 久保田, en `niigata.md`) y **Iwakuni
  (Yamaguchi), que es la de 獺祭 Dassai** y está en `yamaguchi.md`. Mismo 社名
  exacto, cuatro empresas. Casar siempre por municipio.
- ⚠ **三重郡朝日町 (Asahi, Mie)** se suma a los Asahi de Toyama, Yamagata, Nagano y
  Aichi. Dos bodegas de esta tabla están ahí.
- **木屋正酒造 (Nabari)** vende como **而今 (Jikon)**, una de las marcas más
  buscadas de Japón: el `nombre` público probablemente sea la marca
  (`docs/CSV_CONTRACT.md`).
- **伊勢萬** elabora en Okage-yokocho, la calle turística de Ise: confirmar que es
  bodega y no solo tienda-obrador de escaparate.

## Qué falta
- Las ~20 bodegas restantes del censo.
- Sin abrir, y con mucho recorrido: **松阪牛 (Matsusaka gyu)**, una de las tres
  grandes carnes de Japón, con ganaderías identificables y registro propio;
  **伊勢茶** (Mie es la tercera productora de té del país y no hay ninguna fila);
  あおさ y 海女 (marisco de Shima), 伊勢うどん, 赤福/餅 de la ruta de Ise,
  真珠 de Toba (no alimentario).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 平和製粉株式会社 | 平和製粉株式会社 | 三重県津市河芸町東千里495番地1 | 有機加工食品 | 02-023B |
| 株式会社ヤマリ | 株式会社ヤマリ　脱皮工場/焙割工場 | 三重県四日市市日永東3丁目14番地31号 | 有機加工食品 | MPJP1020 |
| 稲垣製茶（株） | 稲垣製茶（株） | 三重県四日市市日永5-2-21 | 有機加工食品 | JI001122PR-0576-0 |
| 無農薬米生産部会 青山有機栽培部 | 前川三郎  他 | 三重県伊賀市寺脇久保田1011 他 | 有機農産物 | 24-06 |
| サンジルシ醸造（株） | サンジルシ醸造（株） | 三重県桑名市明正通1-572-1 | 有機加工食品 | JS010130PR-0335-0 |
| ミエハク工業株式会社 | ミエハク工業株式会社　他 | 三重県津市一身田中野78番地の1　他 | 有機加工食品 | MPJP1330 |
| 株式会社　川原製茶 | （株）川原製茶　本社工場　他 | 三重県多気郡多気町丹生1786　他 | 有機加工食品 | JK041109PR-0767-0 |
| 福広農園 | 1 他 | 三重県名張市薦生庄田411　他 | 有機農産物 | 24-04 |
| 株式会社新生わたらい茶 | 株式会社新生わたらい茶 | 三重県度会郡度会町田口153-4 | 有機加工食品 | 24-19 |
| 株式会社まるゑい | 品質管理第一工場 他 | 三重県四日市市水沢町北起1628-3他 | 有機加工食品 | 24-16 |
| 千代農園 | 1 他 | 三重県多気郡多気町笠木駒ノ口1871他 | 有機農産物 | 24-26 |
| 農業生産法人有限会社御浜天地 | 大平・北畑 | 三重県南牟婁郡御浜町上市木4020、4050、4052、4055　他 | 有機農産物 | 101042201 |
| 木村貢 | 1 他 | 三重県伊賀市菖蒲池婦帰3705、3708 他 | 有機農産物 | 25-08 |
| 横山農産 | 横浜重治 1 他 | 三重県津市安濃町中川子ギデン574-1 他 | 有機農産物 | 2002F-20 |
| わたらい茶生産グループ | 山口製茶 他 | 三重県度会郡度会町田口杣口232-1 他 | 有機農産物 | 24-05 |
| 株式会社小杉食品 | 株式会社小杉食品 | 三重県桑名市能部字花貝戸401 | 有機加工食品 |  |
| 九鬼産業株式会社本社工場 | 九鬼産業株式会社本社工場　他　及び外部委託施設 | 三重県四日市市尾上町11　他 | 有機加工食品 | 24-17 |
| 井村屋株式会社 | 井村屋株式会社　あのつFACTORY | 三重県津市あのつ台一丁目8番1中勢北部サイエンスシティ内 | 有機加工食品 | 第1322号 |
| 竹尾茶業株式会社 | 1 他 | 三重県津市芸濃町林百々2056　他 | 有機農産物 | 24-01 |
| うえやま農園 | 1 他 | 三重県名張市赤目町柏原1473 他 | 有機農産物 | 24-30 |
