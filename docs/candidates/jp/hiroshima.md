# Hiroshima — candidatos

- CSV: `data/csv/jp/chugoku/hiroshima.csv` (9 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/hiroshima> (56 bodegas, leído 2026-08-04). Gremio: 広島県酒造組合, <http://www.hirosake.or.jp/>.
- Estado: **9 integradas** el 2026-08-05 (7 `verificado`, 2 `parcial`); quedan 7 de la tabla y ~40 del censo. Evidencia en `data/evidence/jp/chugoku/hiroshima.jsonl`.

**西条 (Saijo), en Higashihiroshima, es una de las tres capitales del sake de
Japón** junto a Nada (Hyogo) y Fushimi (Kioto), con las bodegas alineadas en una
sola calle. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Umeda Shuzojo | 梅田酒造場 | Hiroshima |
| Ikuma Shuzo | 生熊酒造 | Shobara |
| Kitamura Jozojo | 北村醸造場 | Shobara |
| Ono Shuzo | 小野酒造 | Kitahiroshima ⚠ |
| Aseed Brew | アシードブリュー | Fukuyama |
| Kawamoto Eisuke | 川本英介 | Akiota |

## Integradas 2026-08-05 (9) — salidas de la cola de arriba

| bodega | municipio | resultado |
|---|---|---|
| Kamotsuru Shuzo | Higashihiroshima | verificado · venta sí |
| Kamoizumi Shuzo | Higashihiroshima | verificado · venta sí |
| Imada Shuzo Honten | Higashihiroshima | verificado · venta sí |
| Enoki Shuzo | Kure | verificado · venta sí |
| Etajima Meijo | Etajima | verificado · venta sí |
| Nakao Jozo | **Takehara** | verificado · venta sí |
| Kanemitsu Shuzo | Higashihiroshima | verificado · sin carrito |
| Kyokuho Shuzo | Hiroshima | **parcial** · web bloqueada |
| Aihara Shuzo | Kure | **parcial** · sin web |

**El buscador del gremio no sirve**: `hirosake.org/app/service?brewery` se pinta
con JavaScript y en plano no devuelve nada. Hiroshima cuesta como Fukushima, una
búsqueda por bodega — no como Yamagata.

- **Imada Shuzo Honten sale de la bandeja del `README.md`** de esta carpeta: ya
  está en el CSV y no debe volver a proponerse. Su dominio público es el de la
  marca, `fukucho.jp`, no la razón social.
- **Nakao Jozo (Takehara) no estaba en la tabla**: salió del mismo censo al
  cazar dominios. Su web falla por HTTPS con **el certificado de `bizmw.com`, el
  mismo hosting que Morii Shokuhin en Nara**, y responde 200 por HTTP. Ese
  proveedor ya ha dado dos falsos muertos: probar HTTP antes de descartar.
- **旭鳳酒造 devuelve 403 con cuerpo mínimo**: bloqueo de bot, no sitio muerto
  (tercer caso tras Yamahisa). Sin poder leer la ficha se queda `parcial`.
- **相原酒造 (Ugo no Tsuki) no tiene web propia.** Tercer caso del patrón, tras
  Hiroki en Fukushima y Takagi en Yamagata: marcas muy valoradas y sin dónde
  enlazar, todas `parcial`.

## Trampas
- **今田酒造本店 (Imada Shuzo Honten, Higashihiroshima)** ya está en la bandeja
  del `README.md` de esta carpeta: no volver a proponerla como nueva.
- ⚠ **北広島町 (Kitahiroshima, Hiroshima) no es 北広島市 (Kitahiroshima,
  Hokkaido)**. Mismo nombre, 1.400 km. Si la fila se escribe con el municipio a
  secas, el gate geográfico la manda a Hokkaido y es error bloqueante —
  o peor, resuelve al centroide equivocado sin quejarse.
- ⚠ **金光酒造 (Higashihiroshima)** no es 金光酒造 (Yamaguchi-shi), en
  `yamaguchi.md`. Mismo 社名, prefecturas vecinas.
- **アシードブリュー (Fukuyama)** es filial de un grupo de bebidas (Aseed Holdings):
  candidata a descarte por masa, mirar si tiene marca de sake propia.
- **川本英介** es un nombre de persona como razón social: confirmar el nombre
  comercial de la bodega antes de escribir el `nombre` de la fila.
- 西条 es un barrio de 東広島市 (Higashihiroshima), no un municipio; y hay un
  **西条市 (Saijo)** que es una ciudad de Ehime, en `ehime.md`.

## Qué falta
- Las ~43 bodegas restantes del censo, empezando por el resto de la calle de
  Saijo, que son las que tienen tienda y venta online.
- Sin abrir: **牡蠣 (ostra)** — Hiroshima produce en torno al 60% del nacional y
  hay cofradías y criaderos con marca; **レモン de Setoda/Ikuchijima** (casi todo
  el limón japonés); もみじ饅頭 (decenas de obradores en Miyajima), 広島菜漬,
  お好み焼き のソース (Otafuku y las casas pequeñas), 比婆牛.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 株式会社セイコー珈琲 | 株式会社セイコー珈琲　安浦工場 他 | 広島県呉市安浦町大字中畑字堀田迫110-1　他 | 有機加工食品 | MPJP1210 |
| こだま食品株式会社 | こだま食品（株） | 広島県福山市駅家町法成寺1575-9 | 有機加工食品 | 04B-005（05C-007） |
| （株）ますやみそ　他 | （株）ますやみそ　他 | 広島県呉市焼山西2-2-8　他 | 有機加工食品 | 01-015B |
| （株）純正食品マルシマ | （株）純正食品マルシマ　新高山工場　他 | 広島県尾道市新高山3-1170-162　他 | 有機加工食品 | JM80202PR-0250-0 |
| 中国醤油醸造協同組合 | 中国醤油醸造協同組合 | 広島県東広島市河内町中河内190-1 | 有機加工食品 | JC010213PR-0298-0 |
| こだま試験農場株式会社 | 南山1　他 | 広島県世羅郡世羅町大字小国字南山1703-1　他 | 有機農産物 | 07A-030 |
| 株式会社出来商店 | 4号ハウス　他 | 広島県東広島市黒瀬町南方字水越1587　他 | 有機農産物 | SES-20070801 |
| 金光味噌（株） | 金光味噌株式会社出口工場　他 | 広島県府中市出口町1180　他 | 有機加工食品 | 01-006B |
| 株式会社やまみ | 株式会社やまみ　本社工場 | 広島県三原市沼田西町小原字袖掛73-5 | 有機加工食品 | 第1434号 |
| センナリ株式会社 | センナリ株式会社　他 | 広島県広島市安佐北区安佐町大字久地2683-25　他 | 有機加工食品 | 130902-001 |
| 有限会社ニシオカ | 製造所1 | 広島県広島市安佐南区東野3丁目5-3 | 有機加工食品 | 214-002 |
| 桑田　恒二 | 1　他 | 広島県福山市神辺町川北衆御領937-1、6（ハウス含む）　他 | 有機農産物 | 114-010 |
| 早志　健太郎 | 1　他 | 広島県東広島市福富町上竹仁段原山843-13　他 | 有機農産物 | 114-049 |
| 横山　豊富 | 1　他 | 広島県神石郡神石高原町油木乙670　他 | 有機農産物 | 114-072 |
| 寺岡有機農場有限会社 | 世羅A1　他 | 広島県世羅郡世羅町賀茂10144-151　他 | 有機農産物 | 114-078 |
| 豆の木 | 山本1　他 | 広島県安芸高田市吉田町下入江1485　他 | 有機農産物 | 115-010 |
| 引田　義道 | 1　他 | 広島県庄原市東城町竹森751番地　他 | 有機農産物 | 115-023 |
