# Saga — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/saga.csv` (9 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/saga> (30 bodegas, leído 2026-08-04). Gremio: 佐賀県酒造組合, <http://www.sagasake.or.jp/main/>.
- Estado: **9 integradas** el 2026-08-05, **todas `verificado`**, 6 con tienda propia. Evidencia en `data/evidence/jp/kyushu-okinawa/saga.jsonl`.

Saga es la prefectura con más bodegas por habitante de Japón, y **鹿島 (Kashima)**
concentra el barrio histórico de 肥前浜宿, con bodegas alineadas en una calle.
Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Sachihime Shuzo | 幸姫酒造 | Kashima |
| Koyanagi Shuzo | 小柳酒造 | Ogi |
| Higashitsuru Shuzo | 東鶴酒造 | Taku |
| Ide Shuzo | 井手酒造 | Ureshino |
| Segashira Shuzo | 瀬頭酒造 | Ureshino |
| Kawanami Shuzo | 川浪酒造 | Imari |
| Tanaka Shuzo | 田中酒造 | Imari |
| Kiyama Shoten | 基山商店 | Kiyama |
| Saka Shuzo | 佐嘉酒造 | Saga |
| Komatsu Shuzo | 小松酒造 | ⚠ 東松浦郡 |

## Integradas 2026-08-05 (9) — todas verificado

| bodega | municipio | resultado |
|---|---|---|
| Tenzan Shuzo | Ogi | verificado · venta sí |
| Mitsutake Shuzojo | Kashima | verificado · venta sí |
| Gochoda Shuzo (Azumaichi) | Ureshino | verificado · venta sí |
| Koimari Shuzo | Imari | verificado · venta sí |
| Yano Shuzo | Kashima | verificado · venta sí |
| Amabuki Shuzo | Miyaki | verificado · venta sí |
| Fukuchiyo Shuzo (Nabeshima) | Kashima | verificado · solo distribuidor |
| Sachihime Shuzo | Kashima | verificado · sin carrito |
| Baba Shuzojo (Nogomi) | Kashima | verificado · sin carrito |

⚠ **`Kashima` resolvía al municipio equivocado.** 鹿島市 (Saga) y 鹿嶋市
(Ibaraki) comparten clave normalizada y ganaba el de Ibaraki, a 800 km: error
bloqueante. Resuelto el 2026-08-05 con una entrada `kashima` en
`data/reference/municipality-overrides.json` (kanto vs kyushu-okinawa). Es el
segundo homónimo de este tipo tras `tonosho` en `kagawa.md`.

- **Cuatro de las nueve están en Kashima**, casi todas en la calle de kura de
  Hizen Hamashuku. Cinco de las que trae la tabla original no salieron en esta
  pasada y siguen en cola.
- **«shop» en la URL no es una tienda.** `sachihime.co.jp/shop-list/` y
  `nabeshima.biz/shop.html` son listados de distribuidor. En el caso de
  Nabeshima la fuente institucional lo dice expresamente: no vende ni en el kura.
- **Yano Shuzo no tiene web corporativa**: su único sitio propio es la tienda en
  BASE, que sirve a la vez de identidad y de canal.
- **`nogomi.co.jp` sin `www` no responde**; con `www` da 200. No es sitio muerto.

## Trampas
- ⚠ **小松酒造** aparece con 東松浦郡 y sin 町**: de ese 郡 solo queda 玄海町
  (Genkai) tras las fusiones, pero hay que confirmarlo — el resto se repartió
  entre 唐津市 (Karatsu) e 伊万里市. Resolver antes de escribir o la fila se queda
  sin gate geográfico.
- **瀬頭酒造 y 五町田酒造 (ambas en Ureshino)** son de la misma familia pero
  empresas distintas, con marcas distintas (東一 y 東長 / 東鶴 no, ojo). Y
  **東鶴酒造 está en Taku**, no en Ureshino: tres 東 que se confunden fácil.
- **田中酒造 (Imari, Saga)** no es 田中酒造 (Otaru, Hokkaido) ni 田中酒造店 (Kami,
  Miyagi), ambas ya en esta carpeta. Tres empresas.
- **佐嘉酒造** usa el kanji antiguo de Saga (佐嘉), no el moderno (佐賀): no
  «corregirlo» al escribir el `nombre`.

## Qué falta
- Las ~16 bodegas restantes del censo, empezando por el resto de 肥前浜宿, que es
  donde están las que tienen tienda y visita.
- Sin abrir: **嬉野茶 (Ureshino)**, uno de los tres grandes tés en sartén de Japón
  y en el mismo municipio que tres bodegas de arriba; **海苔 de Ariake** (Saga es
  la primera productora nacional, con cofradías); 佐賀牛; 呼子のイカ (calamar
  vivo, con lonja propia); 有田焼 y 伊万里焼 (cerámica, fuera de catálogo pero
  arrastran obradores de 器 y té).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| きたの茶園 | 1　他 | 佐賀県嬉野市嬉野町大字下宿丙2231、2333　他 | 有機農産物 | 0604-A01 |
| 福田農園 | 圃場１他 | 佐賀県佐賀市木原1丁目359-1　他 | 有機農産物 | SES-1708091 |
| 株式会社東洋新薬 | 株式会社東洋新薬　鳥栖工場　他 | 佐賀県鳥栖市弥生が丘7-28　他 | 有機加工食品 | SGS/JP/JASO-N002 |
| 有限会社原製茶園 | 有限会社原製茶園 | 佐賀県武雄市西川登町大字神六20420-1 | 有機加工食品 | 0612-B03 |
| 岡本正廣 | 1他 | 佐賀県唐津市北波多成渕竹木場2777-2他 | 有機農産物 | 0704-A02 |
| 有限会社アロマ珈琲 | 有限会社アロマ珈琲三瀬珈琲工房他 | 佐賀県佐賀市三瀬村三瀬92-1他 | 有機加工食品 | 加-0006 |
| 古賀正孝 | 1-1他 | 佐賀県鳥栖市下野町下畑田1379他 | 有機農産物 | 0705-A04 |
| 佐賀大学生物資源教育研究センター | 1他 | 佐賀県佐賀市久保泉町下和泉1841他 | 有機農産物 | 0709-A02 |
| （株）オニザキコーポレーション | （株）オニザキコーポレーション　多久美舎他 | 佐賀県多久市北多久町大字多久原306-23　他 | 有機加工食品 | 第1054号 |
| 佐藤農場株式会社 | 佐藤農場株式会社 | 佐賀県鹿島市大字飯田乙3574 | 有機加工食品 | 加-0088 |
| 中村（克）有機農園 | 圃場1 他 | 佐賀県佐賀市三瀬村三瀬土師2180-10他 | 有機農産物 | SES-24103001 |
| 佐々木励 | 1 | 佐賀県唐津市浜玉町横田上513‐1,514-3 | 有機農産物 | 0090 |
| 農事組合法人　武雄そだちレモングラスハッピーファーマーズ | 川内圃場団地　他 | 佐賀県武雄市若木大字本部14904－1　他 | 有機農産物 | SES-24122001 |
| 九州薬品工業株式会社 | 加工工場他 | 佐賀県鳥栖市永吉町580-4他 | 有機加工食品 | SEZ-25010701 |
| 嬉野オリーブ農園 | 1 他 | 佐賀県嬉野市塩田町大字馬場下畦川内2丙145 他 | 有機農産物 | 1306-A01 |
| 中島農園 | 中島農園　圃場4他 | 佐賀県杵島郡白石町大字八平新開1055,1056　他 | 有機農産物 | SES-24100101 |
| 自然社中 | 松尾清美　松尾圃場1他 | 佐賀県伊万里市大坪町乙753-1他 | 有機農産物 | SES-25061101 |
| 山田農園 | 椎の木　他 | 佐賀県唐津市巌木町天川1000　他 | 有機農産物 | SES-27051101 |
| 株式会社マルハ園芸 | れんこん洗浄・選別　他 | 佐賀県杵島郡白石町大字新拓46-4 | 有機加工食品 | 1508-B01 |
| 合同会社Ｒelation　Ｔea | 第一工場他 | 佐賀県武雄市山内町三間坂甲13350-1他 | 有機加工食品 | SEZ-28012001 |
