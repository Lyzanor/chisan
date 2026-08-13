# Fukuoka — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/fukuoka.csv` (53 filas tras la revisión integral de 2026-08-11).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/fukuoka> (70 bodegas, leído 2026-08-04). Gremio: 福岡県酒造組合, <http://www.fukuoka-sake.org/>.
- Estado: **6 integradas** el 2026-08-05 (5 `verificado`, 1 `parcial`). Evidencia en `data/evidence/jp/kyushu-okinawa/fukuoka.jsonl`.

Fukuoka es la tercera prefectura de Japón en número de bodegas, detrás de Hyogo y
Niigata. Categoría para todas: `Sake`.

## Trampas
- ⚠ **La fuente sitúa 大里酒造 en 嘉穂郡嘉穂町, que ya no existe**: se fusionó en
  2006 en 嘉麻市 (Kama), donde ya está 梅ヶ谷酒造. Wikidata excluye los municipios
  disueltos, así que el nombre viejo deja la fila sin puerta geográfica
  (`AGENTS.md`). Misma trampa que en `tochigi.md` y `tokushima.md`.
- ⚠ **古賀市 (Koga, Fukuoka) no es 古河市 (Koga, Ibaraki)**, donde está 青木酒造
  (`ibaraki.md`). Mismo rōmaji, dos extremos de Honshu/Kyushu.
- ⚠ **池田屋 (Miyama)** es otro de los cuatro `Ikedaya` del catálogo: ver la lista
  en `ehime.md`.
- **旭菊 y 旭松** comparten el 旭 pero no son ninguno de los cuatro 旭酒造 de
  `mie.md`.
- 大賀酒造 (1673) es la bodega más antigua de Kyushu: perfil con historia y
  probable tienda propia, buen sitio por donde empezar el lote.

## Qué falta
- Las ~56 bodegas restantes del censo.
- Sin abrir, y con mucho: **八女茶 (Yame)** — el mejor gyokuro de Japón, con
  productores familiares que venden online; **明太子** (con decenas de casas en
  Hakata, no solo las industriales); あまおう (fresa con marca registrada);
  久留米/博多 ラーメン y sus caldos; 醤油 y 味噌 de Yanagawa; 柳川のうなぎ.

## Hallazgo heredado pendiente

- **Taiyo Flour Milling** — `Pan y cereal`, Fukuoka; el listado aportado por el
  usuario propone `taiyomil.com`. Confirmar que existe una oferta alimentaria
  propia accesible al público y localizar la unidad productiva antes de publicar.

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 18 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 有限会社有機コーヒー | 有限会社有機コーヒー　他 | 福岡県遠賀郡水巻町下二西3-7-16　他 | 有機加工食品 | GMJP1106 |
| 関門食品株式会社 | 曽根工場他 | 福岡県北九州市小倉南区中吉田1-1-1他 | 有機加工食品 | SEZ-170509 |
| 株式会社熊谷光玉園 | 川島工場　他 | 福岡県八女市大字納楚400　他 | 有機加工食品 | SEZ-1708043 |
| 友添信之 | １他 | 福岡県柳川市三橋町吉開水町589-1　他 | 有機農産物 | 0610-A13 |
| （株）吉田園 | （株）吉田園　他 | 福岡県八女市黒木町本分1159-5　他 | 有機加工食品 | JY81030K-0054-0 |
| オアシス珈琲有限会社 | オアシス珈琲有限会社 | 福岡県飯塚市堀池133-9 | 有機加工食品 | SEZ-18103001 |
| 樋口勇八郎 | 1　他 | 福岡県うきは市浮羽町新川字平利山508-13　他 | 有機農産物 | 0612-A10 |
| POP LIFE  CO. | Pop　Life　Co.他 | 福岡県福岡市東区美和台4-6-2他 | 有機加工食品 | 0701-B01 |
| 中川食品（株） | 中川食品（株） | 福岡県北九州市小倉南区長野本町4-11-1 | 有機加工食品 | JN010229PR-0325-0 |
| 合資会社 山科茶舗 | 合資会社 山科茶舗  製茶工場 | 福岡県朝倉市大字甘木1642-2 | 有機加工食品 | SEZ-31311 |
| 古賀　俊夫 | ほ場1他 | 福岡県八女郡広川町大字藤田高塚710-12　他 | 有機農産物 | SES-170314 |
| きさらぎ農園 | ムロゾノ①他 | 福岡県八女市上陽町北川内4704-１　他 | 有機農産物 | SES-1708092 |
| (株)庄分酢 | 本社工場　他 | 福岡県大川市榎津548　他 | 有機加工食品 |  |
| 株式会社　ベストアメニティファクトリー | 本社工場　他 | 福岡県久留米市三潴町高三潴７３８-４　他 | 有機加工食品 | 0906-B01 |
| 株式会社百年生物化学研究所 | 株式会社百年生物化学研究所九州第二工場　他 | 福岡県宮若市稲光２７１－２　他 | 有機加工食品 | SEZ-21090701 |
| 友和産業株式会社 | 第1工場　他 | 福岡県八女市蒲原1993-2 | 有機加工食品 | SEZ-22100441 |
| 株式会社ヒビキスパイス | 株式会社ヒビキスパイス　若松工場 | 福岡県北九州市若松区響町1丁目43番地 | 有機加工食品 | 加-0079 |
| 株式会社カトウ | 株式会社カトウ　他 | 福岡県八女市黒木町本分4513　他 | 有機加工食品 | 1009-B01 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/fukuoka.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión 2026-08-11; **1 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 門司港レトロビール | Kitakyushu | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/fukuoka.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/fukuoka.php> (nombre, dirección y web propia de cada socio)
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: revisión 2026-08-11; **3 retenidos** en la segunda pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| つか菓子舗 | 福岡市 | Dulces y repostería | 和菓子協会 | http://www2.plala.or.jp/tukakasiho/ | 福岡市中尾 3-4-5; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |
| 原口園（扶桑庵） | ⚠ | Té e infusiones | búsqueda dirigida + web propia | https://haraguchien.co.jp/ | ⚠ `/pages/company` da 福岡市博多区, que es la sede: el té es de Yame. Falta situar la unidad productiva antes de escribir la fila; revisado 2026-08-11: retenido (200, falta confirmar actividad o unidad productiva) |
| 山口製茶園（茶幸庵） | ⚠ | Té e infusiones | búsqueda dirigida + web propia | https://www.chakouan.com/ | ⚠ municipio sin confirmar; revisado 2026-08-11: retenido (200, falta confirmar actividad o unidad productiva) |
