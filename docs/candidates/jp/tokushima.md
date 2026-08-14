# Tokushima — candidatos

- CSV: `data/csv/jp/shikoku/tokushima.csv` (44 filas tras la revisión integral de 2026-08-11).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/tokushima> (21 bodegas, leído 2026-08-04). Gremio: 徳島県酒造組合, <https://tokushimasake.com/>.
- Estado: revisión integral cerrada el 2026-08-11; las entradas no publicadas se conservan abajo con la carencia concreta que impide incorporarlas.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

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

> **Reauditoría 2026-08-11:** 20 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

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
- Estado: revisión 2026-08-11; **1 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 阿波ナチュラルチーズ工房 チーズの灯 | Naruto | Lácteos y quesos | ChFun | — | sin dominio en la fuente; revisado 2026-08-10: la guía no pudo enlazarse con una fuente primaria actual y localización completa |

## Nuevos candidatos de pescado y marisco artesanal — barrido 2026-08-14

Barrido sistemático de productores, elaboradores y recolectores artesanos de pescado, marisco y algas de Tokushima con instalaciones productivas propias, marca activa y venta/presencia web directa. Categoría: `Pescado`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Descripción / Especialidad | Fuente |
|---|---|---|---|---|---|---|
| **福池水産 (Fukuike Suisan)** | 福池水産株式会社 | `鳴門市` | Pescado | https://fukuike.co.jp/ |Recolector y cultivador de algas wakame y besugo en el estrecho de Naruto; especialista en Naruto-wakame (alga wakame crujiente cultivada en los remolinos marinos de Naruto) con salazón tradicional. ⚠ Reviewed 2026-08-14: hold; the proposed domain is invalid, mismatched or insufficient and no current source yet establishes every admission claim.| Web oficial / Registro pesquero de Naruto |
| **谷ちくわ店 (Tani Chikuwa)** | 株式会社谷ちくわ店 | `小松島市` | Pescado | https://tani-chikuwa.co.jp/ |Obrador tradicional de Komatsushima fundado en 1955; célebre por su Takechikuwa (pastel de pescado asado directamente sobre cañas de bambú natural) y pasteles de pescado katsu. ⚠ Reviewed 2026-08-14: hold; the proposed domain is invalid, mismatched or insufficient and no current source yet establishes every admission claim.| Web oficial / Registro artesanal de Komatsushima |
