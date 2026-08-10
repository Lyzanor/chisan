# Tokushima — candidatos

- CSV: `data/csv/jp/shikoku/tokushima.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/tokushima> (21 bodegas, leído 2026-08-04). Gremio: 徳島県酒造組合, <https://tokushimasake.com/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Naruto Shuzo | 鳴門酒造 | Naruto |
| Tsukasagiku Shuzo | 司菊酒造 | Mima |
| Tsunomine Shuzo | 津乃峰酒造 | Anan |
| Chikakiyo Shuzo | 近清酒造 | Anan |
| Naka Shuzo | 那賀酒造 | Naka |
| Agawa Shuzo | 阿川酒造 | Tsurugi |
| Karakuchi Shuzo | 可楽智酒造 | Higashimiyoshi |
| Chuwa Shoten | 中和商店 | Miyoshi |
| Kondo Matsutaro Shoten | 近藤松太郎商店 | Tokushima |
| Saito Shuzojo | 斎藤酒造場 | Tokushima |
| Seitama | 勢玉 | Tokushima |
| Sadasaku Shurui Jozojo | 定作酒類醸造場 | Katsuura |
| Nisshin Shurui (Taiko) | 日新酒類 太閤酒造場 | Awa |
| Ise Shuzo | 伊勢酒造 | Yoshinogawa ⚠ |

## Trampas
- ⚠ **La fuente sitúa 伊勢酒造 en 麻植郡山川町, que ya no existe**: se fusionó en
  2004 en 吉野川市 (Yoshinogawa). Wikidata excluye los municipios disueltos, así
  que escribir el nombre viejo deja la fila **sin puerta geográfica** — el audit
  la salta y la cuenta como skipped, no como comprobada (`AGENTS.md`). Misma
  trampa que en `tochigi.md`.
- **三好市 (Miyoshi) y 東みよし町 (Higashimiyoshi)** son dos municipios vecinos, y
  el segundo se escribe en hiragana. No colapsarlos.
- **伊勢酒造 (Tokushima)** no tiene relación con 伊勢萬 (Ise, Mie), en `mie.md`.
- **日新酒類** es un grupo con varias plantas (太閤酒造場 es una de ellas): una
  fila, en el municipio donde produce lo que se vende, no en la sede.

## Qué falta
- Las 7 bodegas restantes del censo.
- Sin abrir, y hay dos frentes de primera: **すだち (sudachi)**, del que Tokushima
  produce en torno al 98% nacional, y **阿波和三盆糖**, el azúcar artesano de
  Awa — quedan poquísimos obradores, todos identificables y con venta directa.
  Además: 鳴門金時 (batata), 半田そうめん, 鳴門わかめ, 阿波尾鶏.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 近藤龍一 | 近藤龍一 | 徳島県美馬市木屋平字森遠552-1　他 | 有機農産物 | 05A-027 |
| 有限会社ハス商会 | （有）ハス商会 | 徳島県勝浦郡勝浦町三渓豊毛本19-1 | 有機加工食品 | 06B-038 |
| 松家安信 | 松家安信 | 徳島県美馬市木屋平字森遠691 | 有機農産物 | 05A-023 |
| 松家繁信 | 松家繁信 | 徳島県美馬市木屋平字森遠342　他 | 有機農産物 | 03A-006 |
| 西村利治 | 西村利治 | 徳島県美馬市木屋平字森遠406 | 有機農産物 | 03A-007 |
| 天田善信 | 天田善信 | 徳島県美馬市木屋平字森遠160　他 | 有機農産物 | 02A-001 |
| 野田ハニー食品工業株式会社 | 野田ハニー食品工業株式会社　本社工場 | 徳島県吉野川市鴨島町内原144番地　他 | 有機加工食品 | 03B-010 |
| 片岡蒟蒻　代表者　片岡　裕也 | 片岡蒟蒻　代表者　片岡　裕也 | 徳島県美馬郡つるぎ町半田字紙屋93番地 | 有機加工食品 | 07B-043 |
| 株式会社　谷食糧 | （株）　谷食糧 | 徳島県名西郡石井町藍畑字高畑1424－8 | 有機加工食品 | 06B-035 |
| 株式会社　ハマヤ四国工場 | 株式会社　ハマヤ四国工場 | 徳島県徳島市東沖州2-26-16 | 有機加工食品 | JH010322PR-0308-0 |
| 梶本　仁章 | 徳島県名西郡石井町高川原字市楽206番地1、206番地2　他 | 徳島県名西郡石井町高川原字市楽206番地1、206番地2　他 | 有機農産物 | 36341100103、6 |
| ＥＭ鳴門生産グループ | 遠藤多喜代 2 他 | 徳島県美馬市脇町拝原1989 他 | 有機農産物 | 2001F-7 |
| 美馬キウイ生産組合　代表者　北岡裕二 | 塩田　勇　他 | 徳島県美馬市つるぎ町半田字日開野30　他 | 有機農産物 | 03A-003 |
| 徳島製麹株式会社 | 徳島製麹株式会社　阿波工場　他 | 徳島県阿波市吉野町柿原字植松180-1　他 | 有機加工食品 | 08B-044 |
| 徳島県陸産缶詰工業(株) | 徳島県陸産缶詰工業(株) | 徳島県阿南市吉井町賀美8 | 有機加工食品 |  |
| 宮田新二 | 宮田新二 | 徳島県勝浦郡勝浦町大字坂本字鍬ノ先15　他 | 有機農産物 | 09A-047 |
| 光食品(株)上板工場 | 光食品(株)　上板工場　他 | 徳島県板野郡上板町高瀬127番3号 他 | 有機加工食品 |  |
| 株式会社　阿波酢造 | 株式会社　阿波酢造　他 | 徳島県勝浦郡勝浦町大字生名字神ノ木52番地1　他 | 有機加工食品 | 09B-048 |
| 株式会社　小川生薬 | 01番製造所 | 徳島県三好市三野町清水1399 | 有機加工食品 | 36489200101 |
| 特定非営利活動法人　里業ランド木頭 | ３番ほ場 | 徳島県那賀郡那賀町木頭西宇字東5 | 有機農産物 | 12A-049 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/tokushima.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
  - **propia** — búsqueda dirigida por producto; ficha o web propia del productor
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 阿波ナチュラルチーズ工房 チーズの灯 | Naruto | Lácteos y quesos | ChFun | — | sin dominio en la fuente; revisado 2026-08-10: la guía no pudo enlazarse con una fuente primaria actual y localización completa |
