# Tochigi — candidatos

- CSV: `data/csv/jp/kanto/tochigi.csv` (1 fila: Coco Farm & Winery, vino). Dedup: ninguna de abajo solapa.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/tochigi> (37 bodegas, leído 2026-08-04). Gremio: 栃木県酒造組合, <http://sasara.lib.net/>.
- Estado: cola abierta, 15 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Inoue Seikichi Shoten | 井上清吉商店 | Utsunomiya |
| Utsunomiya Shuzo | 宇都宮酒造 | Utsunomiya |
| Iinuma Meijo | 飯沼銘醸 | Tochigi |
| Ohira Shuzo | 大平酒造 | Tochigi |
| Sagara Shuzo | 相良酒造 | Tochigi ⚠ |
| Aizawa Shuzo | 相澤酒造 | Sano |
| Abe Shuzoten | 阿部酒造店 | Motegi |
| Ikejima Shuzo | 池島酒造 | Otawara |
| Kikunosato Shuzo | 菊の里酒造 | Otawara ⚠ |
| Katayama Shuzo | 片山酒造 | Nikko |
| Kumakubo Shoten | 熊久保商店 | Nasushiobara |
| Kojima Shuzoten | 小島酒造店 | Shioya |
| Kobayashi Shuzo | 小林酒造 | Oyama |
| Sanpuku Shuzo | 三福酒造 | Oyama |
| Shimazaki Shuzo | 島崎酒造 | Nasukarasuyama |
| Shiraai Shuzo | 白相酒造 | Nakagawa |

## Trampas
- ⚠ **La fuente usa municipios disueltos en las fusiones Heisei**: 湯津上村
  (菊の里酒造) es hoy 大田原市 y 岩舟町 (相良酒造) es hoy 栃木市. `data/reference/`
  excluye de Wikidata todo lo que tiene fecha de disolución, así que si se escribe
  el nombre viejo **la fila no tiene puerta geográfica**: el audit la salta y la
  cuenta como skipped, no como comprobada (`AGENTS.md`, invariantes). Escribir el
  municipio actual.
- 那須郡 y 塩谷郡 no son municipio: la fila lleva el 町 (Nakagawa, Shioya).

## Qué falta
- Las ~21 bodegas restantes del censo.
- Sin abrir: fresa Tochiotome (Tochigi es la primera de Japón desde hace 50 años),
  **yuba de Nikko**, 干瓢 (kanpyo, casi todo el nacional), ternera de Nasu, lácteos
  de Nasu, y las bodegas de vino más allá de Coco Farm.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 東京食品産業（株） | 東京食品産業（株） | 栃木県佐野市並木町358番地 | 有機加工食品 | 050713-001 |
| 伊藤　渡 | 1　他 | 栃木県大田原市大神601-66・67　他 | 有機農産物 | S-050 |
| 杉山真章 | 1　他 | 栃木県塩谷郡塩屋町肘内三斗蒔147　他 | 有機農産物 | S-020 |
| 有限会社　日本の稲作を守る会 | 有限会社　日本の稲作を守る会　8　他 | 栃木県河内郡上三川町下神主字下原234-1　他 | 有機農産物 | S-152 |
| 那須オーガニック会 | 高崎真一　ほ場1　他 | 栃木県大田原市中野内1782-52　他 | 有機農産物 | 2006F-16 |
| 隅内俊光 | 2他 | 栃木県河内郡上三川町上蒲生字三反田1494　他 | 有機農産物 | S-171 |
| 土の香グループ | 中丸北　他 | 栃木県下都賀郡壬生町助谷字中丸北706　他 | 有機農産物 | NA-09030401 |
| 株式会社シェフコ | 株式会社シェフコ　栃木工場　他 | 栃木県鹿沼市下永野９２６ | 有機加工食品 | 201070703 |
| 株式会社波里 | 株式会社波里　足利胡麻工場　他 | 栃木県足利市寺岡町680-1 他 | 有機加工食品 | MPJP1654 |
| 小野崎勇治 | 小野崎勇治 | 栃木県塩谷郡塩谷町原荻野目清水端352 | 有機農産物 | S-224 |
| (株)黎明農園 | 1　他 | 栃木県佐野市下彦間町笠松763-1、764-1、765-1　他 | 有機農産物 | S-216 |
| 株式会社ベジファーム | 1　他 | 栃木県下都賀郡壬生町上田1439　他 | 有機農産物 | 13A-005 |
| 戸崎農園(株) | ほ場1 | 栃木県下都賀郡壬生町壬生丁253-2 | 有機農産物 | S-231 |
| 阿部忠男 | １－１　他 | 栃木県日光市川室木落244 | 有機農産物 | S-122 |
| 五十畑　匠 | 1　他 | 栃木県栃木市岩舟町静和字宮ノ下1871-1,1872-1　他 | 有機農産物 | S-241 |
| 渡邉いづみ | 渡邉いづみ | 栃木県那須郡那須町大字高久甲字愛宕前5138-1　他 | 有機農産物 | S-243 |
| 星野恵美子 | 1　他 | 栃木県那須塩原市二区町500-10　他 | 有機農産物 |  |
| 株式会社東京フード | 株式会社東京フード | 栃木県佐野市赤坂町940-3 | 有機加工食品 | AFASSEQ-AP-160201 |
| 手塚英史 | 手塚英史 | 栃木県宇都宮市下小倉町上原1068　他 | 有機農産物 | S-207 |
