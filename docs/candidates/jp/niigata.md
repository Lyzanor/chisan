# Niigata — candidatos

- CSV: `data/csv/jp/chubu/niigata.csv` (129 filas tras la revisión integral de 2026-08-11).
- Fuente: 新潟県酒造組合 vía <https://howtoniigata.jp/spot/nihonshu/40210/> — las 89 bodegas del gremio con marca y municipio. Contraste institucional: el mapa de la Agencia Tributaria, <https://www.nta.go.jp/about/organization/kantoshinetsu/sake/sake_breweries_map/pdf/sake_jp/sake_niigata_jp.pdf>.
- Estado: **6 integradas** el 2026-08-05 (4 `verificado` con tienda, 2 `parcial`); quedan 85. Evidencia en `data/evidence/jp/chubu/niigata.jsonl`.

Niigata es la prefectura con más bodegas de Japón. El listado da marca y
municipio pero **no web**: cada alta necesita localizar el dominio propio y
confirmar identidad, actividad y municipio. Solo-gremio sostiene `parcial`.

Categoría para todas: `Sake`. El rōmaji de `nombre` es propuesta a confirmar.

**Municipio en el CSV:** el listado usa barrios (新潟市西蒲区, 上越市柿崎区,
南魚沼市塩沢). El `municipio` correcto es la ciudad — `Niigata`, `Joetsu`,
`Minamiuonuma` — porque es lo que resuelve contra los centroides.

## Fuera del sake (2, del listado aportado 2026-08-04)

De `listado_125_productores_locales_japon.xlsx`. Sus otras 12 filas de Niigata
(Taiyo, Hakuryu, Miyao, Omon, Echigozakura, Koshitsukano, Kikusui, Fujinoi,
Kanemasu, Kondo, Kinshihai, Kirinzan) **ya estaban en la tabla de arriba**:
misma fuente, el gremio.

## Trampas vistas
- **Dos 加藤 distintos**: 加藤酒造 (清正, Joetsu) y 加藤酒造店 (金鶴, Sado). Y dos
  中川/中谷-style homónimos más en la lista: casar por marca, no por apellido.
- Nagaoka concentra 16 bodegas y Joetsu 12; al geocodificar, varias caerán en la
  banda de aviso 15-100 km porque son municipios enormes tras las fusiones Heisei
  (ya avisado en `docs/CSV_CONTRACT.md`). Leer el aviso antes de tocar `municipio`.
- El listado turístico dice 89 y el gremio contaba 88 en 2022: la diferencia son
  altas recientes (LAGOON BREWERY es de 2021). No cuadrar cifras a ciegas.

## Qué falta
- Ningún dominio recogido: es el primer trabajo de cada lote.
- Fuera del sake, sin abrir: arroz Koshihikari, 笹団子, pescado de Sado.
- **味噌/醤油/麹 es el siguiente vertical y ya tiene gremio localizado** (2026-08-04):
  新潟県味噌醤油工業協同組合, <https://niigata-miso-shouyu.amebaownd.com/>. La
  portada no lista socios y `/pages/1/` da 404: hay que encontrar la ruta del
  listado. Dos casas ya identificadas por fuera, con dominio propio y por tanto
  mejores que cualquier fila del gremio de sake: **町田醤油味噌醸造** (Joetsu,
  `machida-shouyumiso.co.jp`) y **山田屋** (`e-misoya.com`).
- Esta prefectura **no necesita más candidatos de sake**: arrastra 91 sin
  integrar. Lo que le falta es dominio por fila, no nombres nuevos.

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 19 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 村山正明 | 1　他 | 新潟県中魚沼郡津南町大字下船渡乙4172　他 | 有機農産物 | S-038 |
| 長津安保 | 1　他 | 新潟県新潟市西蒲区下木島久保田175-1　他 | 有機農産物 | S-042 |
| 上野　晃 | 1　他 | 新潟県新潟市北区新井郷居裏1071-1073　他 | 有機農産物 | S-043 |
| 栄有機稲作研究会 | 栄有機稲作研究会　（株）ファームフレッシュヤマザキ　1　他 | 新潟県三条市渡前4352　他 | 有機農産物 | S-081 |
| 金谷武志 | 2　他 | 新潟県上越市三和区神田2360　他 | 有機農産物 | S-086 |
| 石橋直和 | 7　他 | 新潟県中魚沼郡津南町大字下船渡丁2620 他 | 有機農産物 | S-087 |
| エコファーム巻島 | 1　他 | 新潟県長岡市巻島町字ヨツワリ271-274　他 | 有機農産物 | S-097 |
| 山口　均 | 1　他 | 新潟県燕市松橋字南451～453, 455, 456　他 | 有機農産物 | S-124 |
| 宮尾浩史 | 1　他 | 新潟県新潟市北区内沼一本柳541～550, 515　他 | 有機農産物 | S-158 |
| Agri-S 清水耕司 | 11　他 | 新潟県見附市東今町510　他 | 有機農産物 | AFASSEQ-AA-020906 |
| 有限会社笠原農園 | 奥上40　他 | 新潟県南魚沼市奥字野中266、267、268、269-1　他 | 有機農産物 | AFASSEQ-AA-060901 |
| 株式会社フエキ農園 | 島の2反　他 | 新潟県南魚沼市島新田関端474-1.2　他 | 有機農産物 | AFASSEQ-AA-010904 |
| （有）加藤農場 | １他 | 新潟県新発田市向中条2992-2　他 | 有機農産物 | A－00－0006 |
| 伊藤　幸成 | 3 | 新潟県北蒲原郡聖籠町蓮潟龍門618　他 | 有機農産物 | A－05－0054 |
| 有限会社エーエフカガヤキ | １　他 | 新潟県新潟市江南区沢海1丁目624　他 | 有機農産物 | A－05－0055 |
| 農事組合法人　木津みずほ生産組合 | 1 | 新潟県新潟市新潟市江南区木津天王杉1688－1　他 | 有機農産物 | A－05－0056 |
| 斉藤　勇雄 | １他 | 新潟県阿賀野市駒林千刈8204　他 | 有機農産物 | A－05－0057 |
| 株式会社ごはん | A3-7　他 | 新潟県中魚沼郡津南町下船渡己6257　他 | 有機農産物 | A－00－0010 |
| 有限会社　ファーミング・スタッフ | １他 | 新潟県柏崎市西山町北野字仲田3604,3605　他 | 有機農産物 | A－00－0012 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/niigata.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
- Estado: revisión 2026-08-11; **3 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 天朝閣 (スワンレイクビール) | Agano | Cerveza | JBA | swanlake.co.jp | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 八海山 (泉ビール) | Minamiuonuma | Cerveza | JBA | izumivillage.jp | matriz de sake; comprobar si procede fila aparte; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 新保企画 (Strange Brewing) | Minamiuonuma | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

**Ya integrado, no volver a proponer:** エチゴビール ya está en `niigata.csv`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/niigata.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/niigata.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: revisión 2026-08-11; **2 retenidos** en la segunda pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 小冨士屋 | 新潟市 | Dulces y repostería | 和菓子協会 | http://www4.ocn.ne.jp/~kofujiya/index.htm | 新潟市岩室温泉 576; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |
| 米百表本舗 | 長岡市 | Dulces y repostería | 和菓子協会 | http://www7.ocn.ne.jp/~kome100 | 長岡市大手通 1-3-2; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |

## Nuevos candidatos de cerveza artesana — barrido 2026-08-13

Barrido sistemático de microcervecerías artesanales independientes con obrador propio, marca activa, presencia web y redes sociales. Categoría: `Cerveza`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Instagram | Notas de producción |
|---|---|---|---|---|---|---|