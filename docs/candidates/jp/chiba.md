# Chiba — candidatos

- CSV: `data/csv/jp/kanto/chiba.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/chiba> (40 bodegas, leído 2026-08-04). Gremio: 千葉県酒造組合, <http://www.chiba-sake.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Iinuma Honke | 飯沼本家 | Shisui |
| Asahitsuru | 旭鶴 | Sakura |
| Iida Honke | 飯田本家 | Katori |
| Iida Shuzojo | 飯田酒造場 | Choshi |
| Ishigami Shuzo | 石上酒造 | Choshi |
| Kubota Shuzo | 窪田酒造 | Noda |
| Aoyagi Shuzo | 青柳酒造 | Yokoshibahikari |
| Umeichirin Shuzo | 梅一輪酒造 | Sanmu |
| Kankiku Meijo | 寒菊銘醸 | Sanmu |
| Inaka Shuzo | 稲花酒造 | Ichinomiya |
| Kidoizumi Shuzo | 木戸泉酒造 | Isumi |
| Iwase Shuzo | 岩瀬酒造 | Onjuku |
| Azumanada Jozo | 東灘醸造 | Katsuura |
| Kameda Shuzo | 亀田酒造 | Kamogawa |

## Trampas
- **`chiba` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español: las filas de la capital pasan el gate sin tocar
  nada. No re-resolverlo.
- **合同酒精 東京工場 (Matsudo)** es planta de grupo y encima lleva «Tokio» en el
  nombre estando en Chiba: triar, y si entra, el municipio es Matsudo.
- **小泉酒造** aparece sin municipio en la fuente (es Fusa, 富津市): resolver antes
  de escribir.
- 山武郡, 長生郡, 夷隅郡, 印旛郡 no son municipio: la fila lleva el 町.

## Qué falta
- Las ~26 bodegas restantes del censo.
- **醤油**: Chiba es la capital mundial de la salsa de soja — Noda (Kikkoman) y
  Choshi (Yamasa, Higeta) — y no hay ni una fila. El frente más obvio de la
  prefectura, con la cautela de que los tres son grupos industriales y lo que
  interesa son las casas pequeñas de la misma cuenca.
- Sin abrir: cacahuete de Yachimata (casi todo el nacional), 落花生, marisco de
  Boso, 海苔 de Tokyo Bay, なめろう.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| TOPPANパッケージングサービス株式会社 袖ケ浦ビバレッジ工場 | TOPPANパッケージングサービス株式会社　袖ケ浦ビバレッジ工場 | 千葉県袖ヶ浦市川原井480-1 | 有機加工食品 | MPJP1145 |
| （株）ドトールコーヒー　関東工場 | （株）ドトールコーヒー　関東工場 | 千葉県船橋市高瀬町21-6 | 有機加工食品 | 第1058号 |
| ちば醤油株式会社 | ちば醤油株式会社　本社工場 | 千葉県香取市木内1208 | 有機加工食品 | GMJP1231 |
| 株式会社万直商店 | 株式会社万直商店　他 | 千葉県流山市加4丁目3番地の3　他 | 有機加工食品 | 201051401 |
| 株式会社東京めいらく | 株式会社東京めいらく　千葉工場 | 千葉県佐倉市大作1-5-1 | 有機加工食品 | 第1235号 |
| 加瀬農園 | 1　他 | 千葉県香取市沢2602　他 | 有機農産物 | A01-042408 |
| 有限会社ワタミファーム　山武農場 | 113　他 | 千葉県山武市横田辻824-2、9　他 | 有機農産物 | A02-120401 |
| 有限会社ワタミファーム　佐原農場 | 607　他 | 千葉県香取市大根磯花1670-1、1670-2　他 | 有機農産物 | A06-080702 |
| 有限会社寺島農場 | 寺-若-1(秋田)　他 | 千葉県旭市秋田1353　他 | 有機農産物 | 101032001 |
| ヤマサ醤油株式会社 | ヤマサ醤油株式会社　他 | 千葉県銚子市新生町2-10-1　他 | 有機加工食品 | 010201-001 |
| 大高醤油株式会社 | 大高醤油株式会社　しょうゆ工場 | 千葉県山武市富田540 | 有機加工食品 | MPJP1103-01 |
| 日東珈琲（株） | 日東珈琲（株） 千葉工場 他 | 千葉県山武市松尾町富士見台208-71 　他 | 有機加工食品 | 第1082号 |
| 日新化工（株）　船橋工場 | 日新化工（株）　船橋工場　他 | 千葉県船橋市高瀬町21-9　他 | 有機加工食品 | JN91018PR-0287-0 |
| （有）北総ベジタブル | 32　他 | 千葉県香取郡多古町一鍬田大ヨロ9-3　他 | 有機農産物 | JH061222FA-1311-0 |
| 農事組合法人　さんぶ野菜ネットワーク | 浅野誠士6　他 | 千葉県山武市実門横田入246-1　他 | 有機農産物 | JS061215FA-0941-0 |
| ニック食品株式会社 | ニック食品株式会社　本社工場 | 千葉県船橋市高瀬町23番地 | 有機加工食品 | 0043 |
| （株）川越屋　千葉工場 | （株）川越屋　千葉工場 | 千葉県山武郡横芝光町屋形3660 | 有機加工食品 | JK030227PR-0642-0 |
| 自然農法成田生産組合 | 高橋　博　６　他 | 千葉県富里市富山298-4　他 | 有機農産物 | JS000828FA-0128-0 |
| 柏原誠 | 圃場1-1 | 千葉県香取郡多古町林字金成台1527 | 有機農産物 | JS000828FA-0869-56 |
| 大谷晴美 | 大谷晴美1  他 | 千葉県香取郡多古町喜多井野750  他 | 有機農産物 | JK020910FA-0673-5 |
