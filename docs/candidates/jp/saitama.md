# Saitama — candidatos

- CSV: `data/csv/jp/kanto/saitama.csv` (56 filas tras la revisión integral de 2026-08-11).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (2026-08-04).
- Estado: **4 integradas** el 2026-08-04 como `parcial`. Queda Matsuoka Brewing, que el gremio lista sin dominio.

⚠ **Tokyo Cacao** está a caballo entre dos prefecturas: el cacao se cultiva en
**Hahajima (Ogasawara, Tokio)** y el obrador que lo transforma es Hiratsuka
Seika en **Soka (Saitama)**. El origen lo marcó «Tokio / Saitama» sin resolver.
Una fila, no dos: decidir si pesa el cultivo (→ `jp/kanto/tokyo.csv`, municipio
Ogasawara) o el obrador (→ aquí). El catálogo sitúa por dónde se produce y
vende, así que lo más probable es Soka, con el origen en `descripcion`.

## Sake: el gremio, por fin (14, pasada 2026-08-04)

Fuentes: 日本酒造組合中央会 <https://japansake.or.jp/sakagura/jp/saitama/> (pág. 1
de 3) y el gremio prefectural 埼玉県酒造組合 <https://www.saisake.com/kuramoto/>.
Ninguna trae dominio. Categoría: `Sake`. Excluida 松岡醸造, ya arriba.

**キング醸造 羽生工場 (Hanyu)** es planta de un grupo de Hyogo: triar.
**寒梅酒造 (Kuki, Saitama)** no es 寒梅酒造 (Osaki, Miyagi), en `miyagi.md`.

## Qué falta
- El gremio de sake de Saitama (`japansake.or.jp/sakagura/en/saitama/`) lista
  bastantes más bodegas que la única que trae el listado.
- Sin abrir: té de Sayama (de los tres grandes de Japón, y no aparece ninguno),
  fideos udon de Musashino, negi de Fukaya, batata de Kawagoe.

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 17 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 共立食品（株）　品質管理部 | 共立食品工業（株）　稲荷工場 | 埼玉県草加市稲荷5-13 | 有機加工食品 | 1012-A |
| 狭山茶　増岡園 | 狭山茶　増岡園 | 埼玉県入間市上谷ケ貫562　他 | 有機加工食品 | 202050701 |
| 自然農法上里生産組合 | 岩田弘一　他 | 埼玉県児玉郡上里町八町河原2341、2342　他 | 有機農産物 | 9706-201-00 |
| ヤマキ醸造株式会社 | ヤマキ醸造株式会社　他 | 埼玉県児玉郡神川町大字下阿久原955　他 | 有機加工食品 | 060821-001 |
| 高橋ソース株式会社 | 高橋ソース（株）本社工場 他 | 埼玉県本庄市下野堂604-7　他 | 有機加工食品 | 010618-001 |
| 有限会社　豆太郎 | 有限会社　豆太郎　他 | 埼玉県本庄市寿3-3-16　他 | 有機加工食品 | 061102-001 |
| UCC上島珈琲株式会社北関東工場 | UCC上島珈琲株式会社　北関東工場 | 埼玉県熊谷市万吉2643-17 | 有機加工食品 | MPJP1090-01 |
| 有限会社島田食品 | 有限会社島田食品 他 | 埼玉県富士見市大字東大久保163　他 | 有機加工食品 | AFASSEQ-AP-001203 |
| 美鈴コーヒー株式会社 | 美鈴コーヒー株式会社　川口工場 | 埼玉県川口市川口1－9－33 | 有機加工食品 | カ-06-03 |
| キャピタル株式会社 | キャピタル株式会社　川口工場 | 埼玉県川口市弥平3丁目6番17号 | 有機加工食品 |  |
| 江原　浩昭 | ガバレ農場 | 埼玉県鴻巣市前砂310　他 | 有機農産物 | 10-002 |
| ＴＳＵＲＵＯＫＡファーム | 鶴岡英俊 | 埼玉県三郷市高洲2-338　他 | 有機農産物 | 9910-203-00 |
| 大畑農場 | 1　他 | 埼玉県比企郡吉見町万光寺字前方81-1　他 | 有機農産物 | S-202 |
| オーガニックファーム　ふくだ | 福田伸一 | 埼玉県熊谷市板井1646-1 他 | 有機農産物 | 0815-207-00 |
| 日本のうえん | 日本のうえん（八須　理明） | 埼玉県児玉郡神川町大字新宿字大清水865-1　他 | 有機農産物 | 8215-208-00 |
| 株式会社　えもり農園 | 江守広章 | 埼玉県熊谷市大塚杉戸田204-1　他 | 有機農産物 |  |
| ヤマキ醸造株式会社（豆庵豆腐工房） | ヤマキ醸造株式会社（豆庵豆腐工房） | 埼玉県児玉郡神川町大字下阿久原955 | 有機加工食品 | 150903-001 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/saitama.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión 2026-08-11; **0 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

**Ya integrado, no volver a proponer:** 弓削多醤油 y Coedo Brewery ya están en `saitama.csv`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/saitama.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/saitama.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: revisión 2026-08-11; **1 retenidos** en la segunda pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 磯崎家本舗 | 越谷市 | Dulces y repostería | 和菓子協会 | http://www.okashiyasann.com/ | 越谷市蒲生茜町 8-16; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |

## Nuevos candidatos de cerveza artesana — barrido 2026-08-13

Barrido sistemático de microcervecerías artesanales independientes con obrador propio, marca activa, presencia web y redes sociales. Categoría: `Cerveza`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Instagram | Notas de producción |
|---|---|---|---|---|---|---|
