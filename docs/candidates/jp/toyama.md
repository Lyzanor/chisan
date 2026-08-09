# Toyama — candidatos

- CSV: `data/csv/jp/chubu/toyama.csv` (5 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/toyama> (20 bodegas, leído 2026-08-04). Gremio: 富山県酒造組合, <http://www.toyama-sake.or.jp/>.
- Estado: **5 integradas** el 2026-08-05, todas `verificado`; quedan 9 de la tabla. Evidencia en `data/evidence/jp/chubu/toyama.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Tamaasahi Shuzo | 玉旭酒造 | Toyama |
| Fukutsuru Shuzo | 福鶴酒造 | Toyama |
| Kiyoto Shuzojo | 清都酒造場 | Takaoka |
| Ginban Shuzo | 銀盤酒造 | Kurobe |
| Kuroda Shuzo | 黒田酒造 | Oyabe |
| Narimasa Shuzo | 成政酒造 | Nanto |
| Chiyozuru Shuzo | 千代鶴酒造 | Namerikawa |
| Hongo Shuzo | 本江酒造 | Uozu |
| Hayashi Shuzojo | 林酒造場 | Asahi ⚠ |

## Integradas 2026-08-05 (5) — todas verificado

| bodega | municipio | resultado |
|---|---|---|
| Masuda Shuzoten (Masuizumi) | Toyama | verificado · sin carrito |
| Fumigiku Shuzo (Haneya) | Toyama | verificado · sin carrito |
| Tateyama Shuzo | Tonami | verificado · sin carrito |
| Sanshoraku Shuzo | Nanto | verificado · sin carrito |
| Takazawa Shuzojo | Himi ⚠ | verificado · sin carrito |

⚠ **高澤酒造場 perdió su kura en el terremoto de Noto de enero de 2024** y está
reconstruyendo con micromecenazgo. Sigue activa, así que no es purga, pero es el
mismo aviso que las bodegas de Wajima en `ishikawa.md`: aquí «sigue abierta»
exige evidencia reciente y hay que revisarla en la próxima pasada.

- **Ninguna de las cinco publica carrito.** Toyama es, de las prefecturas
  recorridas, la que menos venta directa tiene: cinco de cinco sin tienda.
- **El gremio de Toyama no publica dominios**, al contrario que el de Yamagata:
  sus páginas `/pages/NN/` dan el listado de socios y los datos de la propia
  asociación, no la ficha con web de cada bodega.
- **`tateyamabrewing.jp` no casa con el nombre de la empresa**; se confirmó que
  es suyo por el registro de empresas del ayuntamiento de Tonami.

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

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 長岡　功 | １　他 | 富山県富山市八尾町舘本郷600-1　他 | 有機農産物 | A－05－0060 |
| 有限会社土遊野 | １他 | 富山県富山市小羽1,2,3,4　他 | 有機農産物 | A－06－0061 |
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
| どろんこ農園 | １他 | 富山県中新川郡船橋村竹鼻198､199､200､201　他 | 有機農産物 | A-20-0110 |
| （有）Trinity 石田淳悦 | 1　他 | 富山県富山市月岡町6丁目1366　他 | 有機農産物 | S-039 |
| 株式会社匠美 | 株式会社 匠美 坂井沢豆乳工場 | 富山県中新川郡立山町坂井沢154-1 | 有機加工食品 | 21-077B |
| 株式会社食養の杜とやま | 株式会社食養の杜とやま　射水工場 | 富山県射水市今開発195番地 | 有機加工食品 | B-23-0009 |
| 株式会社森の環 | 株式会社森の環 | 富山県砺波市本小林6, 高岡市葦附1239-22, 射水市串田112-1 | 有機農産物 | 2223-801-00 |
