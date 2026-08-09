# Fukui — candidatos

- CSV: `data/csv/jp/chubu/fukui.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/fukui> (40 bodegas, leído 2026-08-04). Gremio: 福井県酒造組合, <https://www.fukuisake.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kokuryu Shuzo | 黒龍酒造 | Eiheiji |
| Kato Kichibee Shoten | 加藤吉平商店 | Sabae |
| Inami Shuzo | 井波酒造 | Sabae |
| Ippongi Kubohonten | 一本義久保本店 | Katsuyama |
| Uno Shuzojo | 宇野酒造場 | Ono |
| Genpei Shuzo | 源平酒造 | Ono |
| Kubota Shuzo | 久保田酒造 | Sakai |
| Ikeda Shuzo | 池田酒造 | Fukui |
| Ito Shuzo | 伊藤酒造 | Fukui |
| Kikukatsura Shuzo | 菊桂酒造 | Fukui |
| Koshi no Iso | 越の磯 | Fukui |
| Asahi Shuzo | 朝日酒造 | Echizen (町) ⚠ |
| Katayama Shuzo | 片山酒造 | Echizen (市) ⚠ |
| Kitazen Shoten | 北善商店 | Minamiechizen ⚠ |

## Trampas
- ⚠ **Tres «Echizen» distintos y contiguos**: 越前町 (丹生郡, donde está 朝日酒造),
  越前市 (ciudad, 片山酒造) y 南越前町 (南条郡, 北善商店). Son tres municipios,
  no tres grafías de uno. Escribir el que toca o el gate geográfico no avisa,
  porque los tres existen y están a 20 km.
- ⚠ **朝日酒造 (Echizen-cho, Fukui)** no es 朝日酒造 (Nagaoka, Niigata), la de
  久保田, que ya está en `niigata.md`. Mismo 社名 exacto, dos empresas.
- ⚠ **久保田酒造 (Sakai, Fukui)** tampoco: hay otra en Sagamihara (`kanagawa.md`)
  y 久保田 es además la marca de la de Nagaoka. Tres cosas, un rōmaji.
- 加藤吉平商店 vende como **梵 (Born)**: `nombre` es la marca pública si es la que
  usa (`docs/CSV_CONTRACT.md`).

## Qué falta
- Las ~26 bodegas restantes del censo.
- Sin abrir: **越前がに** (cangrejo con marca y subasta propia), 若狭ぐじ y el
  pescado de Wakasa, 羽二重餅, 越前おろしそば, sal de Wakasa, 谷田部ねぎ.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| （合）　河原酢造 | 合名会社　河原酢造 | 福井県大野市吉8-25 | 有機加工食品 | JK011113PR-0452-0 |
| 五湖ゆうきの会 | 杉田寿男 1 他 | 福井県三方上中郡若狭町山内35-53 他 | 有機農産物 | 2000F-5 |
| マルカワみそ株式会社 | マルカワみそ（株）旧工場　他 | 福井県越前市杉崎町11-44　他 | 有機加工食品 | 01-016B |
| かっちゃまゆうきの会 | 南 都志男 1 他 | 福井県勝山市平泉寺町岩ヶ野17-44-1、17-44-2 他 | 有機農産物 | 2000F-15 |
| 若狭有機の会 | 高鳥佐太一　1　他 | 福井県小浜市太良庄21-15　他 | 有機農産物 | 2000F-13 |
| 越前「田んぼの天使」有機の会 | 井上高宏 1 他 | 福井県丹生郡越前町八田28-1-1～9、28-2 他 | 有機農産物 | 2001F-43 |
| （名）　河原酢造 | ２　他 | 福井県大野市牛ヶ原106字33,34他 | 有機農産物 | JK130726FA-1257-0 |
| 丹南有機の会 | 株式会社うすい農園　ほ場6　他 | 福井県南条郡南越前町鯖波12-39　他 | 有機農産物 | 2000F-17 |
| 佐野義雄 | 佐野義雄 2 他 | 福井県福井市徳光町2-19-1 他 | 有機農産物 | 2010F-11 |
| かみなか有機の会 | 下嶋三晴　1　他 | 福井県三方上中郡若狭町末野8-2　他 | 有機農産物 | 2019F-5 |
| 株式会社ハイピース | 株式会社ハイピース | 福井県丹生郡越前町佐々生32-4 | 有機加工食品 | MPJP9233 |
| 一般社団法人北陸EM普及協会 | 北　定　ほ場１　他 | 福井県福井市御所垣内町5字37　他 | 有機農産物 | 2020F-6 |
| ピュールヴェルジェワカサ | 伊藤園　他 | 福井県三方上中郡若狭町麻生野29-11-1、29-13-1　他 | 有機農産物 | NA-24012501 |
| イオンアグリ創造株式会社 　福井あわら農場 | 201　他 | 福井県あわら市山十楽1-6　他 | 有機農産物 | 123-015 |
| 農字組合法人 弘法大師ファームみつまた | （農）弘法大師ファームみつまた　ほ場1　他 | 福井県越前市北山27字3-1、3-2、7-2　他 | 有機農産物 | 2024F-6 |
| 農事組合法人上味見みらいファーム | 10字9　他 | 福井県福井市神当部町10-18　他 | 有機農産物 | J18A-2421 |
| 株式会社ファーム広瀬 | ほ場1　他 | 福井県越前市岡本町9字西川原19番1    他 | 有機農産物 | 2025F-4 |

Los dos complementos de Fukui proceden de la lista oficial municipal «ふくいの恵み» (productos y operadores certificados, ejercicio R6), porque el registro JAS solo dejó 18 operadores nuevos tras la deduplicación: <https://www.city.fukui.lg.jp/sigoto/syoukou/renkei/kakouhinninteijigyou_d/fil/R6ichiran.pdf>.
