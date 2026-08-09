# Iwate — candidatos

- CSV: `data/csv/jp/tohoku/iwate.csv` (6 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/iwate> (22 bodegas, leído 2026-08-04). Gremio: 岩手県酒造組合, <http://www.ginga.or.jp/~syuzou/>.
- Estado: **6 integradas** el 2026-08-05, todas `verificado`, 5 con tienda propia — el mejor ratio de venta directa de la pasada. Evidencia en `data/evidence/jp/tohoku/iwate.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kikunotsukasa Shuzo | 菊の司酒造 | Morioka |
| Sakuragao Shuzo | 桜顔酒造 | Morioka |
| Azumamine Shuzoten | 吾妻嶺酒造店 | Shiwa |
| Tsuki no Wa Shuzoten | 月の輪酒造店 | Shiwa |
| Hirota Shuzoten | 廣田酒造店 | Shiwa |
| Takahashi Shuzoten | 高橋酒造店 | Shiwa |
| Kawamura Shuzoten | 川村酒造店 | Hanamaki |
| Kikuzakari Shuzo | 喜久盛酒造 | Kitakami |
| Iwanoi Shuzo | 磐乃井酒造 | Ichinoseki |
| Ryoban Shuzo | 両磐酒造 | Ichinoseki |
| Iwate Meijo | 岩手銘醸 | Oshu |
| Kamihei Shuzo | 上閉伊酒造 | Tono |
| Senkin Shuzo | 泉金酒造 | Iwaizumi |
| Washinoo | わしの尾 | Hachimantai |

## Integradas 2026-08-05 (6) — todas verificado

| bodega | municipio | resultado |
|---|---|---|
| Nanbu Bijin | Ninohe | verificado · venta sí |
| Sekinoichi Shuzo | Ichinoseki | verificado · venta sí |
| Suisen Shuzo | **Ofunato** ⚠ | verificado · venta sí |
| Akabu Shuzo | **Morioka** ⚠ | verificado · venta sí |
| Hamachidori | Kamaishi | verificado · venta sí |
| Asabiraki | Morioka | verificado · sin carrito |

⚠ **Dos de las seis cambiaron de municipio por el tsunami de 2011**, y el
candidato las daba en el sitio antiguo:
- **酔仙酒造** era de Rikuzentakata; aquel kura fue destruido y hoy elabora en el
  Ofunato-gura. La fila toma **Ofunato**, porque el área es donde se produce.
- **赤武酒造** era de Otsuchi y se reconstruyó en **Morioka**.

Es el segundo caso de sede contra planta tras Niizawa en `miyagi.md`, y aquí
son dos de seis: **en la costa de Tohoku hay que confirmar el municipio actual
antes de escribir la fila**, no dar por buena la dirección histórica.

- **世嬉の一 elabora sake y la cerveza Iwate Kura en el mismo recinto**: una sola
  fila, con la categoría que pesa, como ya se decidió para Kiuchi en `ibaraki.md`.
- **Cinco de seis con tienda propia** es el mejor ratio de venta directa de toda
  la pasada. La costa de Iwate vende online porque su mercado local se hundió.

## Trampas
- **紫波町 (Shiwa) concentra cuatro bodegas** con apellidos frecuentes
  (高橋, 廣田): casar por 社名 completo, no por apellido.
- 世嬉の一 hace además cerveza (いわて蔵ビール) en la misma casa: es **una fila**,
  no dos, con la `categoria` que pese.

## Qué falta
- Las ~8 bodegas restantes del censo.
- Sin abrir: wanko-soba y fideos de Morioka, 南部鉄器 (no alimentario), lácteos de
  Kuzumaki, marisco de Sanriku, 醤油/味噌 de Hanamaki.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 有限会社旭農園 | 1　他 | 岩手県北上市和賀町岩崎新田曙2-1　他 | 有機農産物 | AFASSEQ-AA-010821 |
| 株式会社丸越 | 本社保冷庫　他 | 岩手県一関市花泉町金沢字運南田171-1　他 | 有機加工食品 | JM021210PR-0810-0 |
| 有限会社阿部農産 | 1　他 | 岩手県胆沢郡金ヶ崎町永沢迎谷起30　他 | 有機農産物 | AFASSEQ-AA-050813 |
| 大東町有機農産物等生産組合 | 小島幸喜　1　他 | 岩手県一関市大東町沖田字大住110　他 | 有機農産物 | S-029 |
| 東日本産業（株） | 東日本産業（株）原料倉庫　他 | 岩手県紫波郡紫波町犬渕字谷地田116-7他 | 有機加工食品 | JH030212PR-0597-0 |
| 公益社団法人藤沢農業振興公社 | 手づくり（有）館ヶ森ハム工房　1他 | 岩手県一関市藤沢町黄海字衣井沢山44番地1 他 | 有機農産物 | 2003F-9 |
| 無天塾 | 家の前1 他 | 岩手県盛岡市下田字生出90-1-イ　他 | 有機農産物 | NA-09033001 |
| しずくいし環境にやさしい稲作の会　代表 滝沢藤七 | 志戸前-１、他 | 岩手県岩手郡雫石町御明神４-１０３-４０５、他 | 有機農産物 | OA-11-298-08 |
| マル庄　代表　庄司敬介 | 4-1 | 岩手県滝沢市鵜飼安達176番1 | 有機農産物 | OA-17-293-11 |
| 株式会社　いわき農園 | 荒川ハウス1号（荒川1号）　他 | 岩手県下閉伊郡山田町荒川3地割69番地　他 | 有機農産物 | 600606P125 |
| 農事組合法人　アグリ笹森 | 農事組合法人　アグリ笹森 | 岩手県奥州市水沢笹森谷地32-1,32-2 他 | 有機農産物 | 600606P133 |
| 有限会社　かさい農産 | 弥栄1-1 他 | 岩手県一関市弥栄字上谷起51-1 他 | 有機農産物 | 600606P142 |
| 一般社団法人　すばる | 前森山畑⑦ | 岩手県八幡平市田頭13-7 | 有機農産物 | OA-22-122-13 |
| 太子食品工業株式会社　雫石工場 | 太子食品工業株式会社　雫石工場 | 岩手県岩手郡雫石町長山林ノ沢111−1 | 有機農産物 | FFJP9277 |
| 株式会社太極舎 | 暁ブルワリー　八幡平ファクトリー | 岩手県八幡平市松尾寄木1-474-6 | 有機加工食品(酒類を含む) | J13B-2224 |
| 株式会社 岩泉きのこ産業 | 落合（1号棟～10号棟）他 | 岩手県下閉伊郡岩泉町浅内字下栗畑68-11 他 | 有機農産物 | A23-030901 |
| 株式会社一関山本農場 代表取締役　山本佳範 | 652 他 | 岩手県一関市中里字上大林520-1、2　他 | 有機農産物 | S-255 |
| 農事組合法人みずほ | 1 他 | 岩手県花巻市野田553番地 | 有機農産物 | S-332 |
