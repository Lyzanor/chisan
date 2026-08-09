# Kioto — candidatos

- CSV: `data/csv/jp/kansai/kyoto.csv` (23 filas: 15 previas más 8 bodegas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/kyoto> (51 bodegas, leído 2026-08-04). Gremio: 京都府酒造組合, <http://kyoto-sake.sakura.ne.jp>.
- Estado: **8 integradas** el 2026-08-05, todas `verificado`, 5 con tienda propia. Evidencia en `data/evidence/jp/kansai/kyoto.jsonl`.

Kioto es la segunda zona sakera de Japón por volumen (Fushimi), y el CSV solo
tiene tres bodegas. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kyohime Shuzo | 京姫酒造 | Kyoto (伏見) |
| Kyodo Shuzo | 共同酒造 | Kyoto |
| Koyama Honke Shuzo | 小山本家酒造 | Kyoto ⚠ |
| Kumano Shuzo | 熊野酒造 | Kyotango |
| Ikeda Shuzo | 池田酒造 | Maizuru |
| Shiraito Shuzo | 白糸酒造 | Miyazu |

## Integradas 2026-08-05 (8) — todas verificado

| bodega | municipio | resultado |
|---|---|---|
| Kizakura | Kyoto (Fushimi) | verificado · venta sí |
| Kitagawa Honke | Kyoto (Fushimi) | verificado · venta sí |
| Saito Shuzo (Eikun) | Kyoto (Fushimi) | verificado · venta sí |
| Shotoku Shuzo | Kyoto (Fushimi) | verificado · venta sí |
| Kinshi Masamune | Kyoto (Fushimi) | verificado · venta sí |
| Kinoshita Shuzo (Tamagawa) | Kyotango | verificado · sin carrito |
| Joyo Shuzo | Joyo | verificado · sin carrito |
| Oishi Shuzo (Okinazuru) | Kameoka | verificado · sin carrito |

**El gremio de Fushimi (`fushimi.or.jp/brewery/`) lista sus 22 socios pero no
publica el dominio de ninguno**: sirve para censo y municipio, no para enlace.

- ⚠ **月桂冠 (Gekkeikan) queda fuera por masa.** Es de los mayores productores de
  sake del mundo, con planta en California; el «Qué falta» pedía decidirlo
  explícitamente y esta es la decisión (`docs/EDITORIAL_POLICY.md`, grupos).
  **黄桜 sí entra**: es grande pero de identidad local — un solo kura en Fushimi,
  cerveza artesana propia y planta visitable. La línea se traza en escala
  industrial y deslocalización, no en facturación.
  Su dominio, además, no respondió ni por HTTP ni por HTTPS desde aquí.
- **松竹梅 (Takara) sigue fuera** por lo ya anotado en `hyogo.md`: su sede es
  Kioto pero su unidad de Nada es planta de grupo.
- **Dos webs sirven en codificación antigua** — `eikun.com` en Shift_JIS y
  `okinazuru.co.jp` en EUC-JP — y el título llega ilegible al leerlas como UTF-8.
  El cuerpo sí se lee: no son sitios rotos.
- **La tienda de Kitagawa Honke no se enlaza desde su portada**, así que el
  barrido de hrefs no la vio; la confirmó abrir `shop-tomio.com` directamente.

## Trampas
- ⚠ **小山本家酒造** tiene su sede en **さいたま市 (Saitama)** — está en
  `saitama.md` — y en Fushimi opera una planta. Si la unidad de Kioto no tiene
  marca e identidad propias, la fila correcta es la de Saitama, no ésta
  (`docs/EDITORIAL_POLICY.md`, grupos).
- **伏見 (Fushimi) es un 区 de la ciudad de Kioto**, no un municipio: la fila lleva
  `Kyoto`. Lo mismo que ya se resolvió para Uji y las casas de té del CSV.
- **月桂冠 y 黄桜** son grupos grandes con distribución nacional: entran por
  terroir e identidad propia, no se descartan por tamaño, pero conviene decidirlo
  explícitamente y no por inercia.
- **木下酒造 (Kyotango, marca 玉川)** no es 木下醸造所 (Taragi, Kumamoto), que está
  en `kumamoto.md`.
- 京丹後市 y 宮津市 son el **norte marítimo** (Tango), a 100 km de Fushimi: no
  asumir que «Kioto» es la ciudad al geocodificar.

## Qué falta
- Las ~36 bodegas restantes del censo.
- El CSV de Kioto ya cubre bien té (Uji), condimentos y dulces. Sin abrir:
  **京野菜** (verdura tradicional con marca propia y productores identificables),
  湯葉/豆腐, 京漬物 más allá de las dos casas ya presentes, y **sake de Tango**,
  que es una zona distinta de Fushimi y no aparece en el CSV.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 株式会社カネ七畠山製茶 | 本社工場 | 京都府京都市伏見区向島橋詰町786 | 有機加工食品 | 01B-015 |
| （有）　中井製茶場 | （有）　中井製茶場 | 京都府相楽郡和束町中市場14-1 | 有機加工食品 | JN70725PR-0101-0 |
| 京都飲料株式会社 | 京都飲料株式会社 | 京都府京都市南区久世東土川町265 | 有機加工食品 | 02-026B |
| 高橋食品工業株式会社 | 高橋食品工業（株） | 京都府京都市伏見区向島善阿弥町62 | 有機加工食品 | 01B-002 |
| 童仙房茶舗 | 布施田雅浩茶園1 | 京都府相楽郡南山城村童仙房三郷田7番地 | 有機農産物 | JD001215FA-0284-0 |
| （株）福寿園　山城工場 | （株）福寿園　山城工場 | 京都府木津川市山城町上狛東作り道11-1 | 有機加工食品 | JF001010PR-0173-0 |
| 大洋産業株式会社 | 大洋産業（株） | 京都府宇治市大久保町平盛71-1 | 有機加工食品 | 06B-008 |
| (株)播磨園製茶 | 大川碾茶工場 | 京都府綴喜郡宇治田原町南高座1 | 有機農産物 | JH010130FA-0241-0 |
| 株式会社玉屋珈琲店 | （株）玉屋珈琲店 | 京都府京都市中京区堺町通蛸薬師下ル菊屋町520 | 有機加工食品 | 02-024B 02-013C |
| 永谷茶業株式会社 | 永谷茶業（株） | 京都府綴喜郡宇治田原町湯屋谷東塩谷58 | 有機加工食品 | 01B-026 |
| 株式会社松北園茶店 | （株）松北園茶店　他 | 京都府宇治市木幡東中8　他 | 有機加工食品 | JS90401PR-0200-0 |
| 日本タブレット株式会社 | 日本タブレット株式会社　第１工場　他 | 京都府宇治市槇島町目川149-1　他 | 有機加工食品 | 第1269号 |
| 中西義明 | 株式会社中西豊文園 11 他 | 京都府京都市伏見区向島鷹場町140、141 他 | 有機農産物 | 2007F-5 |
| 株式会社マエダ・スーパー・テクノ | 株式会社マエダ・スーパー・テクノ本社工場　他 | 京都府久世郡久御山町森川端17-1　他 | 有機加工食品 | 05B-003 |
| 京都やましろ農業協同組合 | 京都やましろ農業協同組合茶直売所 | 京都府綴喜郡宇治田原町郷ノ口中林12 | 有機加工食品 | 04B-009 |
| 共栄製茶株式会社 | 共栄製茶株式会社　宇治東山工場　他 | 京都府宇治市小倉町東山34　他 | 有機加工食品 | JK970407PR-0229-0 |
| (有)永田茶園 | (有)永田茶園 第一工場 | 京都府綴喜郡宇治田原町湯屋谷上西谷42 | 有機加工食品 | JN951221PR-0243-0 |
| 株式会社宇治香園　本社工場 | 株式会社宇治香園　本社工場　他 | 京都府木津川市山城町上狛西下60　他 | 有機加工食品 | JU990319-0086-0 |
| （株）碧翆園 | （株）碧翆園本社工場 | 京都府城陽市中・中ノ郷51 | 有機加工食品 | JT020131PR-0484-0 |
| 株式会社ユーアンドミー | 株式会社ユーアンドミー製造工場 | 京都府亀岡市大井町並河2-6-1 | 有機加工食品 | 07B-005 |
