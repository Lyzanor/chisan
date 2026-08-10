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
  (`docs/EDITORIAL_POLICY.md`, grupos). **Revisada 2026-08-09:** se retiene por
  esa duda de identidad de planta; no es un descarte definitivo.
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
| （有）　中井製茶場 | （有）　中井製茶場 | 京都府相楽郡和束町中市場14-1 | 有機加工食品 | JN70725PR-0101-0 |
| 京都飲料株式会社 | 京都飲料株式会社 | 京都府京都市南区久世東土川町265 | 有機加工食品 | 02-026B |
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

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/kyoto.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
- Estado: revisión cerrada el 2026-08-10; **3** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 一乗寺ブリュワリー | Kyoto | Cerveza | JBA | ichijoji-brewery.com | Tokio/Kioto: el barrio no es municipio; queda 'Kyoto'; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| グランドリミテ (KIXビール) | Kyoto | Cerveza | JBA | kixbeer.com | revisado 2026-08-10: el dominio redirige a Izumisano Brewing y la unidad productiva está en Osaka, no Kyoto |
| ラフインターナショナル (家守堂) | Kyoto | Cerveza | JBA | yamorido.jp | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

**Ya integrado, no volver a proponer:** 澤井醤油本店, 黄桜 y 金鵄正宗 (matriz de 京都町家ビール) ya están en `kyoto.csv`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/kyoto.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/kyoto.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **13 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 亀屋良長 | 京都市 | Dulces y repostería | 和菓子協会 | http://www.kameya-yoshinaga.com/ | 京都市下京区四条堀川町東入ル北側醒ヶ井角 |
| 俵屋吉富 | 京都市 | Dulces y repostería | 和菓子協会 | http://www.kyogashi.co.jp/ | 京都市上京区室町通上立売上ル |
| 塩芳軒 | 京都市 | Dulces y repostería | 和菓子協会 | http://www.kyogashi.com/ | 京都市上京区黒門通中立売上ル |
| 尾張屋 | 京都市 | Dulces y repostería | 和菓子協会 | http://www.honke-owariya.co.jp/ | 京都市中京区車屋町通二条下ル |
| 鼓月 | 京都市 | Dulces y repostería | 和菓子協会 | http://www.kogetsu.com/ | 京都市中京区旧二条通七本松西入ル |
| 吉水園 | 京都市 | Dulces y repostería | 和菓子協会 | http://www.yoshimizuen.jp | 京都市東山区三条通白川橋東3丁目夷町 157 |
| 大原女家 | 京都市 | Dulces y repostería | 和菓子協会 | http://www.oharameya.co.jp/ | 京都市東山区祇園町北側 248 |
| 京都和菓子協会※現在準備中 | 京都市 | Dulces y repostería | 和菓子協会 | — | 京都市左京区二条通川端東入ル吉永町 271-1美よし菓舗内 |
| 渡辺製菓株式会社 | 亀岡市 | Aperitivos | 全国米菓工業組合 | http://www.hozugawaarare.com | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 有限会社種茂商店 | 京都市 | Aperitivos | 全国米菓工業組合 | http://kyoto-tanemo.com | 米菓製造業（菓子卸等へ販売） |
| 武中製菓株式会社 | 京都市 | Aperitivos | 全国米菓工業組合 | https://takenakaseika.shopinfo.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 有限会社藤澤永正堂 | 京都市 | Aperitivos | 全国米菓工業組合 | http://www.kuramaan.jp | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 株式会社かなだや | 京都市 | Aperitivos | 全国米菓工業組合 | http://www.kanadaya.jp | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）、米菓販売業（その他菓子を含む卸・小売業） |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/kyoto.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/kyoto> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 6, Pan y cereal 4, Miel 2, Setas 2, Legumbres 2, Condimentos 2, Té e infusiones 1, Huevos 1, Carne 1, Frutos secos 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| ほたるの森 | 南丹市 | Miel | ficha | — | https://www.tabechoku.com/producers/3078403 |  |
| シュシュミエル | 宮津市 | Miel | ficha | — | https://www.tabechoku.com/producers/23285 |  |
| 森井ファームのお茶 | 木津川市 | Té e infusiones | ficha | — | https://www.tabechoku.com/producers/20684 |  |
| 戸川養鶏場 | 南丹市 | Huevos | ficha | — | https://www.tabechoku.com/producers/20945 |  |
| 京茸（きょうたけ） | 京都市 | Setas | ficha | — | https://www.tabechoku.com/producers/25355 |  |
| きのこLAB | 京都市 | Setas | ficha | — | https://www.tabechoku.com/producers/3077875 |  |
| 田歌舎 | 南丹市 | Carne | ficha | — | https://www.tabechoku.com/producers/26297 |  |
| 山国さきがけセンター | 京都市 | Legumbres | ficha | — | https://www.tabechoku.com/producers/21483 |  |
| 七人の侍 | 南丹市 | Legumbres | ficha | — | https://www.tabechoku.com/producers/24636 |  |
| 京美山・山椒農園  (内儀家) | 京都市 | Condimentos | ficha | — | https://www.tabechoku.com/producers/23693 |  |
| 祇園ちりめん山椒　ひさ伍 | 京都市 | Condimentos | ficha | — | https://www.tabechoku.com/producers/3077845 |  |
| nouji-oomoto | 亀岡市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/3078895 |  |
| カメダ | 京丹後市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/26372 |  |
| にちか | 綾部市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/3077669 |  |
| イツジ農園 | 長岡京市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/24611 |  |
| 栗園大栗峠 | 綾部市 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/28611 |  |
| にしまるふぁーむ | 京丹後市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25825 |  |
| 今川農園 | 京丹波町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078726 | 京都府船井郡京丹波町 |
| 京都大原　つくだ農園 | 京都市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25 |  |
| ひろ農林 | 京都市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/26282 |  |
| 青谷梅工房 | 城陽市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22226 |  |
| -京野菜とお茶-ARISA GARDEN 京都 | 舞鶴市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24886 |  |
