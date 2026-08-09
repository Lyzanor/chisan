# Oita — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/oita.csv` (1 fila: Hita Tenryosui, bebidas). Dedup: ninguna de abajo solapa.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/oita> (31 bodegas, leído 2026-08-04). Gremio: 大分県酒造組合, <http://www.oita-sake.or.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`, con la salvedad de abajo. El rōmaji de `nombre` y
`municipio` es propuesta a confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Inoue Shuzo | 井上酒造 | Hita |
| Oimatsu Shuzo | 老松酒造 | Hita ⚠ |
| Kuncho Shuzo | クンチョウ酒造 | Hita |
| Kuge Honten | 久家本店 | Usuki |
| Kotegawa Shuzo | 小手川酒造 | Usuki |
| Emoto Shoten | 江本商店 | Usa |
| Oita Meijo | 大分銘醸 | Usa |
| Kubo Shuzo | 久保酒造 | Usa |
| Aso Honten | 麻生本店 | Yufu |
| Daichi Shuzo | 大地酒造 | Saiki |
| Ono Shuzo | 小野酒造 | Kitsuki |
| Kamenoi Shuzo | 亀の井酒造 | Kusu |
| Kayashima Shuzo | 萱島酒造 | Kunisaki |
| Kira Shuzo | 吉良酒造 | Bungoono |

## Trampas
- **`hita` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español (`AGENTS.md` de Japón, y ya avisado en el
  `README.md` de esta carpeta por Hita Tenryosui). Las tres bodegas de Hita pasan
  el gate sin tocar nada.
- ⚠ **老松酒造 (Hita, Oita)** es el tercer 老松 del catálogo: los otros son
  伊丹老松酒造 (Itami) y 老松酒造 (Shiso), ambos en `hyogo.md`. Tres empresas.
- **亀の井酒造 (Kusu, Oita)** no es 亀の井酒造 (Tsuruoka, Yamagata), la de
  くどき上手, en `yamagata.md`. Mismo 社名 exacto.
- **小野酒造 (Kitsuki, Oita)** no es 小野酒造 (Kitahiroshima, Hiroshima), en
  `hiroshima.md`.
- ⚠ **Oita es la primera prefectura de Japón en 麦焼酎**, no en sake: varias de
  estas casas hacen las dos cosas y la `categoria` que pesa puede ser
  `Destilados y licores`. Decidir por fila, no por gremio.

## Qué falta
- Las ~17 bodegas restantes del censo, y **三和酒類 (Usa)**, la casa de いいちこ,
  que es el mayor productor de shochu de Japón y no aparece en el censo de sake:
  entra por vertical de destilado, con el triaje de grupo por delante.
- Sin abrir: **かぼす**, del que Oita produce en torno al 97% nacional;
  **乾し椎茸** (shiitake seco, también primera de Japón, con subasta propia);
  関あじ・関さば (pescado de marca con lonja en Saganoseki); 豊後牛; 柚子胡椒
  (nació en Kyushu y hay obradores pequeños); 日田の水と醤油.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 株式会社クローバー食品 | 株式会社クローバー食品　本社工場　他 | 大分県豊後高田市玉津1544-3　他 | 有機加工食品 | 第1196号 |
| 株式会社　高橋製茶 | 株式会社　高橋製茶 | 大分県臼杵市野津町八里合1407 | 有機加工食品 | JT050617FA-0829-0 |
| タルカリ農園 | 17 | 大分県豊後高田市西真玉字金屋野内899 | 有機農産物 | 0147 |
| 大分醤油協業組合 | 大分醤油協業組合　他 | 大分県臼杵市望月1500番地　他 | 有機加工食品 | 010423-001 |
| 株式会社ジェイエイフーズおおいた | 株式会社ジェイエイフーズおおいた | 大分県杵築市大字本庄1453番地の1 | 有機加工食品 | 加-0008 |
| （有）豊後大分有機茶生産組合 | 大麦3-17　他 | 大分県臼杵市野津町吉田1030－5、1030－6　他 | 有機農産物 | JB070619FA-1542-0 |
| ウジャマー農場 | 11 | 大分県豊後大野市緒方町天神朷迫158 | 有機農産物 | 0039 |
| 青井農園 | 5 | 大分県速見郡日出町川崎字内野5271-5272 | 有機農産物 | 0035 |
| 佐々木食品グループ | 安藤二六　ほ場2 他 | 大分県豊後高田市美和ミツケ507、508、古尾敷559、殿屋敷509、513、547 他 | 有機農産物 | 2004F-7 |
| （株）三洋産業 | （株）三洋産業 | 大分県別府市冨士見町7-2 | 有機加工食品 | JS010322PR-0327-0 |
| 農事組合法人JAPANクローバー | 大力基地、他 | 大分県豊後高田市大力、他 | 有機農産物 | 1373 |
| 農事組合法人下郷製茶組合 | 農事組合法人下郷製茶組合 | 大分県中津市耶馬溪町大字金吉1028番地4 | 有機加工食品 | 加-0025 |
| 株式会社河村農園 | 株式会社河村農園　本社/第一工場　他 | 大分県佐伯市直川大字下直見1548番地　他 | 有機加工食品 | 加-0051 |
| 北村俊造 | 4-1，4-2，4-3，4-4 | 大分県豊後高田市呉崎広瀬3632 | 有機農産物 | 0032 |
| 有限会社宇佐本百姓 | 326 | 大分県宇佐市木部字菅ノ木326 | 有機農産物 | 0057 |
| ケンプリア株式会社 | ケンプリア株式会社大分工場 | 大分県宇佐市四日市９１７－１ | 有機加工食品 | 加-0058 |
| 福祉農場　安心家族 | Y | 大分県宇佐市大字四日市4534-1 | 有機農産物 | 0067 |
| 農事組合法人ゆふいん蕎麦農場 | 農事組合法人ゆふいん蕎麦農場 | 大分県由布市湯布院町中川字城ヶ岳1968－1 | 有機農産物 | 0074 |
| 二宮茶園 | 2-A | 大分県国東市国東町小原5836-54 | 有機農産物 | 0075 |
| 大分有機かぼす農園株式会社 | 6 | 大分県臼杵市大字乙見字大平864，865，866 | 有機農産物 | 0085 |
