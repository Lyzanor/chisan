# Toyama — candidatos

- CSV: `data/csv/jp/chubu/toyama.csv` (45 filas tras la revisión integral de 2026-08-11).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/toyama> (20 bodegas, leído 2026-08-04). Gremio: 富山県酒造組合, <http://www.toyama-sake.or.jp/>.
- Estado: **5 integradas** el 2026-08-05, todas `verificado`; quedan 9 de la tabla. Evidencia en `data/evidence/jp/chubu/toyama.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

## Trampas
- ⚠ **朝日町 (Asahi)**: hay municipios llamados Asahi en Toyama, Yamagata, Nagano,
  Mie y Aichi. El de esta fila es 下新川郡朝日町 (Toyama). Comprobar que el
  centroide que resuelve es el de esta prefectura antes de fiarse del gate.
- **三笑楽 y 成政 comparten municipio (Nanto)**, resultado de una fusión Heisei que
  se comió 城端町 y 福光町: la dirección histórica de sus webs puede llevar el
  nombre viejo, que ya no resuelve.

## Qué falta
- Las 6 bodegas restantes del censo.
- Sin abrir: **鱒寿司 (masuzushi) de Toyama**, que tiene decenas de obradores
  artesanos y hasta gremio propio — el frente más claro de la prefectura;
  白えび y ホタルイカ (marisco de la bahía), 昆布〆, 干し柿 de Nanto.

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 18 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 長岡　功 | １　他 | 富山県富山市八尾町舘本郷600-1　他 | 有機農産物 | A－05－0060 |
| 前佛明夫 | 1他 | 富山県滑川市上梅沢136　他 | 有機農産物 | A－03－0041 |
| （株）ウメケン　富山工場 | （株）ウメケン　富山工場 | 富山県富山市婦中町板倉532-1 | 有機加工食品 | JU041207PR-0820-0 |
| Nビバレッジ株式会社 | Nビバレッジ株式会社 | 富山県下新川郡朝日町平柳500 | 有機加工食品 | O-3 |
| 有限会社　小原営農センター | コバ宮　他 | 富山県富山市小羽1412//6　他 | 有機農産物 | NA-07032902 |
| (株)ウメケン | (株)ウメケン　富山工場 | 富山県富山市婦中町板倉532-1　他 | 有機加工食品 | NB-09022616、NC-09022624 |
| ビー＆ベッチ | 西島　守　ほ場2　他 | 富山県富山市下大久保110　他 | 有機農産物 | 2010F-1 |
| 中田和浩 | １他 | 富山県滑川市上梅沢103，104　他 | 有機農産物 | A-03-0042 |
| 日本オリゴ株式会社 | 日本オリゴ株式会社 | 富山県南砺市泉沢588 | 有機加工食品 | JU041207PR-1289-1 |
| 株式会社ライスヒル | １他 | 富山県下新川郡入善町神林４４１－１　他 | 有機農産物 | A-05-0059 |
| 森沢　勇 | 1 他 | 富山県富山市善名62　他 | 有機農産物 | S-268 |
| 和田農産株式会社 | ハト麦若葉加工場 | 富山県小矢部市石坂337 | 有機加工食品 | 2018M-2 |
| 株式会社ＴＡＧＯＳＡＫＵ | 1 | 富山県下新川郡朝日町浜草野258 | 有機農産物 | A-18-104 |
| 合同会社　地創研 | 簔口　潔　ほ場１　他 | 富山県南砺市田尻263-1 | 有機農産物 | 2020Ｆ-4 |
| （有）Trinity 石田淳悦 | 1　他 | 富山県富山市月岡町6丁目1366　他 | 有機農産物 | S-039 |
| 株式会社匠美 | 株式会社 匠美 坂井沢豆乳工場 | 富山県中新川郡立山町坂井沢154-1 | 有機加工食品 | 21-077B |
| 株式会社食養の杜とやま | 株式会社食養の杜とやま　射水工場 | 富山県射水市今開発195番地 | 有機加工食品 | B-23-0009 |
| 株式会社森の環 | 株式会社森の環 | 富山県砺波市本小林6, 高岡市葦附1239-22, 射水市串田112-1 | 有機農産物 | 2223-801-00 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/toyama.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión 2026-08-11; **1 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 宇奈月ビール | Kurobe | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/toyama.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/toyama.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: revisión 2026-08-11; **2 retenidos** en la segunda pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 日の出屋製菓産業株式会社 | 南砺市 | Aperitivos | 全国米菓工業組合 | https://www.hinodeya-seika.com/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）、その他（米菓を含むコメ加工品製造・販売等）; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |
| 株式会社丸米製菓 | 南砺市 | Aperitivos | 全国米菓工業組合 | https://maru-yonezo.com/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |

## Nuevos candidatos de cerveza artesana — barrido 2026-08-13

Barrido sistemático de microcervecerías artesanales independientes con obrador propio, marca activa, presencia web y redes sociales. Categoría: `Cerveza`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Instagram | Notas de producción |
|---|---|---|---|---|---|---|

## Nuevos candidatos de pescado y marisco artesanal — barrido 2026-08-14

Barrido sistemático de productores, elaboradores y transformadores artesanos de pescado y marisco de Toyama con instalaciones productivas propias, marca activa y venta/presencia web directa. Categoría: `Pescado`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Descripción / Especialidad | Fuente |
|---|---|---|---|---|---|---|
