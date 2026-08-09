# Fukuoka — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/fukuoka.csv` (6 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/fukuoka> (70 bodegas, leído 2026-08-04). Gremio: 福岡県酒造組合, <http://www.fukuoka-sake.org/>.
- Estado: **6 integradas** el 2026-08-05 (5 `verificado`, 1 `parcial`). Evidencia en `data/evidence/jp/kyushu-okinawa/fukuoka.jsonl`.

Fukuoka es la tercera prefectura de Japón en número de bodegas, detrás de Hyogo y
Niigata. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Asahigiku Shuzo | 旭菊酒造 | Kurume |
| Ikekame Shuzo | 池亀酒造 | Kurume |
| Asahimatsu Shuzo | 旭松酒造 | Yame |
| Ayasugi Shuzojo | 綾杉酒造場 | Fukuoka |
| Izu Honten | 伊豆本店 | Munakata |
| Isonosawa | いそのさわ | Ukiha |
| Umegatani Shuzo | 梅ヶ谷酒造 | Kama |
| Osato Shuzo | 大里酒造 | Kama ⚠ |
| Egashira Shuzo | 江頭酒造 | Omuta |
| Okina Shuzo | 翁酒造 | Koga ⚠ |
| Kataoka Shuzojo | 片岡酒造場 | Toho |
| Ikedaya | 池田屋 | Miyama ⚠ |

## Integradas 2026-08-05 (6)

| bodega | municipio | resultado |
|---|---|---|
| Morinokura | Kurume | verificado · venta sí |
| Wakatakeya Shuzojo | Kurume | verificado · venta sí |
| Yamaguchi Shuzojo (Niwa no Uguisu) | Kurume | verificado · sin carrito |
| Ishikura Shuzo (Hakata Hyakunengura) | Fukuoka | verificado · sin carrito |
| Oga Shuzo | Chikushino | verificado · sin carrito |
| Kitaya | Yame | **parcial** · web sin respuesta |

Cuatro de las seis no estaban en la tabla de arriba: salieron al cazar dominios,
igual que Nakao en `hiroshima.md`. **El censo de la tabla es una selección, no
el padrón** — Fukuoka tiene 70 bodegas.

⚠ **`Kurume` resolvía a Higashikurume, en Tokio**, a 950 km: error bloqueante.
Resuelto el 2026-08-05 con una entrada `kurume` en
`municipality-overrides.json` (kanto vs kyushu-okinawa). Tercer homónimo de la
sesión tras `tonosho` y `kashima`, y el más peligroso porque **Kurume
concentra tres de estas seis bodegas**.

- **大賀酒造 (1673) es la más antigua de la prefectura** y **石蔵酒造 la única que
  sigue elaborando dentro de Hakata**: las dos son perfiles de visita, no de
  venta online.
- **Kitaya no respondió** ni en su dominio principal ni en el de su tienda
  declarada. Se queda `parcial`; reintentar antes de dar el dominio por malo.

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

## Lote JAS ecológico nacional — 2026-08-08

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
| 株式会社星野製茶園 | 株式会社星野製茶園 　本社工場　他 | 福岡県八女市星野村8136-1　他 | 有機加工食品 | SEZ-1704261 |
| 古賀　俊夫 | ほ場1他 | 福岡県八女郡広川町大字藤田高塚710-12　他 | 有機農産物 | SES-170314 |
| きさらぎ農園 | ムロゾノ①他 | 福岡県八女市上陽町北川内4704-１　他 | 有機農産物 | SES-1708092 |
| 古賀茶業株式会社 | 古賀茶業株式会社他 | 福岡県みやま市瀬高町下庄４９３－１　他 | 有機加工食品 | SEZ-20032701 |
| (株)庄分酢 | 本社工場　他 | 福岡県大川市榎津548　他 | 有機加工食品 |  |
| 株式会社　ベストアメニティファクトリー | 本社工場　他 | 福岡県久留米市三潴町高三潴７３８-４　他 | 有機加工食品 | 0906-B01 |
| 株式会社百年生物化学研究所 | 株式会社百年生物化学研究所九州第二工場　他 | 福岡県宮若市稲光２７１－２　他 | 有機加工食品 | SEZ-21090701 |
| 友和産業株式会社 | 第1工場　他 | 福岡県八女市蒲原1993-2 | 有機加工食品 | SEZ-22100441 |
| 株式会社ヒビキスパイス | 株式会社ヒビキスパイス　若松工場 | 福岡県北九州市若松区響町1丁目43番地 | 有機加工食品 | 加-0079 |
| 株式会社カトウ | 株式会社カトウ　他 | 福岡県八女市黒木町本分4513　他 | 有機加工食品 | 1009-B01 |
