# Chiba — candidatos

- CSV: `data/csv/jp/kanto/chiba.csv` (48 filas tras la revisión integral de 2026-08-11).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/chiba> (40 bodegas, leído 2026-08-04). Gremio: 千葉県酒造組合, <http://www.chiba-sake.jp/>.
- Estado: revisión integral cerrada el 2026-08-11; las entradas no publicadas se conservan abajo con la carencia concreta que impide incorporarlas.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

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

> **Reauditoría 2026-08-11:** 18 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| TOPPANパッケージングサービス株式会社 袖ケ浦ビバレッジ工場 | TOPPANパッケージングサービス株式会社　袖ケ浦ビバレッジ工場 | 千葉県袖ヶ浦市川原井480-1 | 有機加工食品 | MPJP1145 |
| （株）ドトールコーヒー　関東工場 | （株）ドトールコーヒー　関東工場 | 千葉県船橋市高瀬町21-6 | 有機加工食品 | 第1058号 |
| ちば醤油株式会社 | ちば醤油株式会社　本社工場 | 千葉県香取市木内1208 | 有機加工食品 | GMJP1231 |
| 株式会社万直商店 | 株式会社万直商店　他 | 千葉県流山市加4丁目3番地の3　他 | 有機加工食品 | 201051401 |
| 株式会社東京めいらく | 株式会社東京めいらく　千葉工場 | 千葉県佐倉市大作1-5-1 | 有機加工食品 | 第1235号 |
| 有限会社ワタミファーム　山武農場 | 113　他 | 千葉県山武市横田辻824-2、9　他 | 有機農産物 | A02-120401 |
| 有限会社ワタミファーム　佐原農場 | 607　他 | 千葉県香取市大根磯花1670-1、1670-2　他 | 有機農産物 | A06-080702 |
| 有限会社寺島農場 | 寺-若-1(秋田)　他 | 千葉県旭市秋田1353　他 | 有機農産物 | 101032001 |
| ヤマサ醤油株式会社 | ヤマサ醤油株式会社　他 | 千葉県銚子市新生町2-10-1　他 | 有機加工食品 | 010201-001 |
| 日東珈琲（株） | 日東珈琲（株） 千葉工場 他 | 千葉県山武市松尾町富士見台208-71 　他 | 有機加工食品 | 第1082号 |
| 日新化工（株）　船橋工場 | 日新化工（株）　船橋工場　他 | 千葉県船橋市高瀬町21-9　他 | 有機加工食品 | JN91018PR-0287-0 |
| （有）北総ベジタブル | 32　他 | 千葉県香取郡多古町一鍬田大ヨロ9-3　他 | 有機農産物 | JH061222FA-1311-0 |
| 農事組合法人　さんぶ野菜ネットワーク | 浅野誠士6　他 | 千葉県山武市実門横田入246-1　他 | 有機農産物 | JS061215FA-0941-0 |
| ニック食品株式会社 | ニック食品株式会社　本社工場 | 千葉県船橋市高瀬町23番地 | 有機加工食品 | 0043 |
| （株）川越屋　千葉工場 | （株）川越屋　千葉工場 | 千葉県山武郡横芝光町屋形3660 | 有機加工食品 | JK030227PR-0642-0 |
| 自然農法成田生産組合 | 高橋　博　６　他 | 千葉県富里市富山298-4　他 | 有機農産物 | JS000828FA-0128-0 |
| 柏原誠 | 圃場1-1 | 千葉県香取郡多古町林字金成台1527 | 有機農産物 | JS000828FA-0869-56 |
| 大谷晴美 | 大谷晴美1  他 | 千葉県香取郡多古町喜多井野750  他 | 有機農産物 | JK020910FA-0673-5 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/chiba.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión 2026-08-11; **0 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

**Ya integrado, no volver a proponer:** 寒菊銘醸 ya está en `chiba.csv` como `Sake`; 九十九里オーシャンビール sería otra fila del mismo obrador.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/chiba.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/chiba.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
- Estado: revisión 2026-08-11; **1 retenidos** en la segunda pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| もりしん | 千葉市 | Dulces y repostería | 和菓子協会 | http://www.morishin-chiba.com | 千葉市若葉区みつわ台 2-10-16; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |

## Nuevos candidatos de pescado y marisco artesanal — barrido 2026-08-14

Barrido sistemático de productores, elaboradores y transformadores artesanos de pescado, marisco y algas de Chiba con instalaciones productivas propias, marca activa y venta/presencia web directa. Categoría: `Pescado`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Descripción / Especialidad | Fuente |
|---|---|---|---|---|---|---|
| **飯田徳治商店 (Iida Tokuji Shoten)** | 有限会社飯田徳治商店 | `銚子市` | Pescado | https://www.iida-tokuji.com/ |Obrador conservero artesanal del puerto de Choshi fundado en 1954; conserva artesana y semiconserva de sardina (iwashi) y caballa (saba) pescadas en el caladero de Choshi. ⚠ Reviewed 2026-08-14: hold; the proposed domain is invalid, mismatched or insufficient and no current source yet establishes every admission claim.| Web oficial / Registro conservero de Chiba |
| **かね八 (Kanehachi)** | 株式会社かね八水産 | `勝浦市` | Pescado | https://kanehachi.co.jp/ |Procesador y distribuidor de pescado fresco en el puerto de Katsuura; especialista en bonito (katsuo de Katsuura) y virrey (kinmedai) con línea directa de subasta. ⚠ Reviewed 2026-08-14: hold; the proposed domain is invalid, mismatched or insufficient and no current source yet establishes every admission claim.| Web oficial / Asociación comercial de Katsuura |
| **鈴芳海苔 (Suzuyoshi Nori)** | 鈴芳海苔店 | `富津市` | Pescado | https://suzuyoshi-nori.com/ |Cultivo y tostado artesanal de alga nori tradicional de la bahía de Tokio (Edo-mae nori) en Futtsu, con procesamiento y secado en obrador propio. ⚠ Reviewed 2026-08-14: hold; the proposed domain is invalid, mismatched or insufficient and no current source yet establishes every admission claim.| Web oficial / Registro de productores de Futtsu |
