# Osaka — candidatos

- CSV: `data/csv/jp/kansai/osaka.csv` (2 filas: Minoh Beer y Marca Brewing, cerveza). Dedup: ninguna de abajo solapa.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/osaka> (17 bodegas, leído 2026-08-04). Gremio: 大阪府酒造組合, <http://osaka-sake.com/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Akishika Shuzo | 秋鹿酒造 | Nose |
| Goshun | 呉春 | Ikeda ⚠ |
| Kiyotsuru Shuzo | 清鶴酒造 | Takatsuki |
| Kotobuki Shuzo | 寿酒造 | Takatsuki |
| Daimon Shuzo | 大門酒造 | Katano |
| Takashima Shuzo | 高島酒造 | Ibaraki ⚠ |
| Nakao Shuzo | 中尾酒造 | Ibaraki ⚠ |
| Saijo | 西條合資 | Kawachinagano |
| Sakai Meijo | さかい銘醸 | Sakai |
| Kitashoji Shuzoten | 北庄司酒造店 | Izumisano |
| Isaka Shuzojo | 井坂酒造場 | Kishiwada |
| Gancho | 元朝 | Kishiwada |
| Naniwa Shuzo | 浪花酒造 | Hannan |
| Nagataki Shuzo (Yao) | 長瀧酒造 八尾蔵 | Yao |

## Trampas
- ⚠ **茨木市 (Ibaraki, Osaka) no es 茨城県 (Ibaraki, prefectura) ni 茨城町**. Es la
  trampa que ya avisa `ibaraki.md` desde el otro lado, y aquí muerde de verdad:
  dos bodegas de esta tabla están en la Ibaraki equivocada si nadie mira. El
  `area` es Osaka.
- ⚠ **池田市 (Ikeda, Osaka)** convive con 池田町 en Gifu, Nagano y Fukui.
  呉春 es de la de Osaka.
- **中尾酒造 (Ibaraki, Osaka)** no es 中尾酒造店 (Kimino, Wakayama), en
  `wakayama.md`. Y **高島酒造 (Ibaraki, Osaka)** no tiene que ver con 高島市
  (Takashima), que es un municipio de Shiga con tres bodegas en `shiga.md`.
- **秋鹿酒造 (Nose)** cultiva su propio arroz: perfil de terroir, de los que
  suelen salir `verificado` con tienda propia. Empezar el lote por ahí.

## Qué falta
- Las 3 bodegas restantes del censo.
- Osaka es urbana pero no está vacía: sin abrir están **泉州の水なす** (berenjena
  con GI, Kishiwada/Izumisano), 能勢 y 河内 (verdura de montaña), 河内ワイン y
  **柏原の葡萄・ワイン** (zona vitícola histórica, ninguna bodega en el CSV),
  昆布 y 佃煮 de Osaka, 醤油 de Sakai.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| UCC上島珈琲株式会社大阪工場 | UCC上島珈琲株式会社　大阪工場 | 大阪府高槻市辻子3-1-3 | 有機加工食品 | MPJP1461 |
| 有限会社 阪急泉南グリーンファーム | No.7-2ハウス　他 | 大阪府泉南市幡代2005　他 | 有機農産物 | 0411-01 |
| （株）ユニオンコーヒーロースターズ | （株）ユニオンコーヒーロースターズ　他 | 大阪府茨木市豊原町6-10　他 | 有機加工食品 | JU010228PR-0310-0 |
| リボン食品製造（株） | リボン食品製造（株）　第一工場 | 大阪府大阪市淀川区三津屋南3-14-4 | 有機加工食品 | JR020910PR-0559-0 |
| 小西製薬（株）　高井田工場 | 小西製薬（株）　高井田工場 | 大阪府大阪市高井田本通2-5-26 | 有機加工食品 | JU041207PR-0773-2 |
| 株式会社藤原商店 | 株式会社藤原商店 | 大阪府岸和田市田治米町110番地 | 有機加工食品 | 03B-003 |
| 中嶋泰人 | 1　他 | 大阪府交野市私市4丁目113番地　他 | 有機農産物 | 01A-039 |
| カタギ食品株式会社 | カタギ食品株式会社　寝屋川工場　他 | 大阪府寝屋川市石津元町12-8　他 | 有機加工食品 | 第1047号 |
| 日本粉末薬品（株）枚岡工場 | 日本粉末薬品（株）枚岡工場　他 | 大阪府東大阪市宝町13-36　他 | 有機加工食品 | JN040210PR-0756-0 |
| 中尾食品工業（株） | 中尾食品工業株式会社 第一工場 他 | 大阪府堺市西区草部715番地 他 | 有機加工食品 | 2002M-9 |
| 堀田直子 | １ | 大阪府岸和田市塔原町上平10-1 | 有機農産物 | 27-13 |
| ハマヤ株式会社　茨木工場 | ハマヤ株式会社　茨木工場他 | 大阪府茨木市横江2-2-4　他 | 有機加工食品 | JH10322PR-0307-0 |
| 株式会社やまつ辻田 | （株）やまつ辻田　他 | 大阪府堺市中区福田280　他 | 有機加工食品 | 07B-012、07C-012 |
| （株）久保養蜂園 | （株）久保養蜂園 | 大阪府和泉市九鬼町601 | 有機加工食品 | JK010213PR-1032-0 |
| （株）コムズライヴリ　高石工場 | （株）コムズライヴリ　高石工場　他 | 大阪府高石市高師浜丁4-15　他 | 有機加工食品 | JK011127PR-1058-0 |
| 上野農園 | カイト　他 | 大阪府堺市中区深井畑山町169-1　他 | 有機農産物 | 1110-01A |
| 株式会社フリゴ　北港物流センター | 株式会社フリゴ　北港物流センター | 大阪府大阪市此花区北港白津1丁目7番11号 | 有機加工食品 | MPJP1711 |
| 株式会社大和川食産 | 株式会社大和川食産 | 大阪府東大阪市水走4-8-4 | 有機加工食品 | 09B-004 |
