# Saitama — candidatos

- CSV: `data/csv/jp/kanto/saitama.csv` (4 filas, todas altas de esta pasada).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (2026-08-04).
- Estado: **4 integradas** el 2026-08-04 como `parcial`. Queda Matsuoka Brewing, que el gremio lista sin dominio.

| nombre | municipio | categoría | A/B | web |
|---|---|---|---|---|
| Venture Whisky / Chichibu Distillery | Chichibu | Destilados y licores | B | ichirosmalt.com |
| COEDO Brewery | Kawagoe | Cerveza | B | coedobrewery.com |
| Maeda Foods | Satte | Pan y cereal | B | maedashokuhin.co.jp |
| Matsuoka Brewing | Ogawa | Sake | B | japansake.or.jp (gremio) |
| Hiratsuka Confectionery / Tokyo Cacao | Soka | Chocolate | A | hiratsuka-seika.co.jp ⚠ ver nota |

⚠ **Tokyo Cacao** está a caballo entre dos prefecturas: el cacao se cultiva en
**Hahajima (Ogasawara, Tokio)** y el obrador que lo transforma es Hiratsuka
Seika en **Soka (Saitama)**. El origen lo marcó «Tokio / Saitama» sin resolver.
Una fila, no dos: decidir si pesa el cultivo (→ `jp/kanto/tokyo.csv`, municipio
Ogasawara) o el obrador (→ aquí). El catálogo sitúa por dónde se produce y
vende, así que lo más probable es Soka, con el origen en `descripcion`.

## Sake: el gremio, por fin (14, pasada 2026-08-04)

Fuentes: 日本酒造組合中央会 <https://japansake.or.jp/sakagura/jp/saitama/> (pág. 1
de 3) y el gremio prefectural 埼玉県酒造組合 <https://www.saisake.com/kuramoto/>.
Ninguna trae dominio. Categoría: `Sake`. Excluida 松岡醸造, ya arriba.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Yao Honten | 矢尾本店 | Chichibu |
| Buko Shuzo | 武甲酒造 | Chichibu |
| Taisei Chichibu Kikusui | タイセー秩父菊水酒造所 | Chichibu |
| Takizawa Shuzo | 滝澤酒造 | Fukaya |
| Fujihashi Tozaburo Shoten | 藤橋藤三郎商店 | Fukaya |
| Maruyama Shuzo | 丸山酒造 | Fukaya |
| Seiun Shuzo | 晴雲酒造 | Ogawa |
| Gonda Shuzo | 権田酒造 | Kumagaya |
| Kanbai Shuzo | 寒梅酒造 | Kuki |
| Ishii Shuzo | 石井酒造 | Satte |
| Fujisaki Sohei Shoten | 藤﨑摠兵衛商店 | Nagatoro |
| Asahara Shuzo | 麻原酒造 | Moroyama |
| Koyama Honke Shuzo | 小山本家酒造 | Saitama |
| Yokozeki Shuzoten | 横関酒造店 | Misato |
| Seiryu Shuzo | 清龍酒造 | ⚠ sin municipio en la fuente |

**キング醸造 羽生工場 (Hanyu)** es planta de un grupo de Hyogo: triar.
**寒梅酒造 (Kuki, Saitama)** no es 寒梅酒造 (Osaki, Miyagi), en `miyagi.md`.

## Qué falta
- El gremio de sake de Saitama (`japansake.or.jp/sakagura/en/saitama/`) lista
  bastantes más bodegas que la única que trae el listado.
- Sin abrir: té de Sayama (de los tres grandes de Japón, y no aparece ninguno),
  fideos udon de Musashino, negi de Fukaya, batata de Kawagoe.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 共立食品（株）　品質管理部 | 共立食品工業（株）　稲荷工場 | 埼玉県草加市稲荷5-13 | 有機加工食品 | 1012-A |
| 狭山茶　増岡園 | 狭山茶　増岡園 | 埼玉県入間市上谷ケ貫562　他 | 有機加工食品 | 202050701 |
| 自然農法上里生産組合 | 岩田弘一　他 | 埼玉県児玉郡上里町八町河原2341、2342　他 | 有機農産物 | 9706-201-00 |
| ヤマキ醸造株式会社 | ヤマキ醸造株式会社　他 | 埼玉県児玉郡神川町大字下阿久原955　他 | 有機加工食品 | 060821-001 |
| 高橋ソース株式会社 | 高橋ソース（株）本社工場 他 | 埼玉県本庄市下野堂604-7　他 | 有機加工食品 | 010618-001 |
| 有限会社　豆太郎 | 有限会社　豆太郎　他 | 埼玉県本庄市寿3-3-16　他 | 有機加工食品 | 061102-001 |
| UCC上島珈琲株式会社北関東工場 | UCC上島珈琲株式会社　北関東工場 | 埼玉県熊谷市万吉2643-17 | 有機加工食品 | MPJP1090-01 |
| 有限会社島田食品 | 有限会社島田食品 他 | 埼玉県富士見市大字東大久保163　他 | 有機加工食品 | AFASSEQ-AP-001203 |
| 美鈴コーヒー株式会社 | 美鈴コーヒー株式会社　川口工場 | 埼玉県川口市川口1－9－33 | 有機加工食品 | カ-06-03 |
| キャピタル株式会社 | キャピタル株式会社　川口工場 | 埼玉県川口市弥平3丁目6番17号 | 有機加工食品 |  |
| 江原　浩昭 | ガバレ農場 | 埼玉県鴻巣市前砂310　他 | 有機農産物 | 10-002 |
| ＴＳＵＲＵＯＫＡファーム | 鶴岡英俊 | 埼玉県三郷市高洲2-338　他 | 有機農産物 | 9910-203-00 |
| 大畑農場 | 1　他 | 埼玉県比企郡吉見町万光寺字前方81-1　他 | 有機農産物 | S-202 |
| オーガニックファーム　ふくだ | 福田伸一 | 埼玉県熊谷市板井1646-1 他 | 有機農産物 | 0815-207-00 |
| 日本のうえん | 日本のうえん（八須　理明） | 埼玉県児玉郡神川町大字新宿字大清水865-1　他 | 有機農産物 | 8215-208-00 |
| 株式会社　えもり農園 | 江守広章 | 埼玉県熊谷市大塚杉戸田204-1　他 | 有機農産物 |  |
| ヤマキ醸造株式会社（豆庵豆腐工房） | ヤマキ醸造株式会社（豆庵豆腐工房） | 埼玉県児玉郡神川町大字下阿久原955 | 有機加工食品 | 150903-001 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/saitama.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

**Ya integrado, no volver a proponer:** 弓削多醤油 y Coedo Brewery ya están en `saitama.csv`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/saitama.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/saitama.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **5 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 磯崎家本舗 | 越谷市 | Dulces y repostería | 和菓子協会 | http://www.okashiyasann.com/ | 越谷市蒲生茜町 8-16 |
| 有限会社川野武次郎商店 | 宮代町 | Aperitivos | 全国米菓工業組合 | https://r.goope.jp/takejirou | 米菓製造・販売業（直売所有り）、米菓生地製造業・販売業 工場見学について 工場見学について 有限会社川野武次郎商店では、工場見学を開催しております。 詳細、お申込みは下記よりお問い合わせください。 工場名 本社工場 対象者 園児、小中学生等に限定 お問い合わせ・お申し込み先 本社 0480-35-1894 0480-35-1894 七福米菓製造所 |
| 宮坂米菓株式会社 | 川越市 | Aperitivos | 全国米菓工業組合 | http://miyasakabeika.co.jp | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 株式会社松崎米菓 | 深谷市 | Aperitivos | 全国米菓工業組合 | http://www.matsuzakibeika.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| ㈲三上製麺 | 所沢市 | Pan y cereal | 全乾麺 | https://www.mikami-s.co.jp/ | 機械製乾めん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/saitama.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/saitama> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 10, Miel 2, Té e infusiones 2, Setas 2, Carne 2, Pan y cereal 2, Frutos secos 2.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 彩Honey | さいたま市 | Miel | ficha | — | https://www.tabechoku.com/producers/22755 |  |
| 山﨑養蜂 | 川口市 | Miel | ficha | — | https://www.tabechoku.com/producers/3077743 |  |
| 元狭山　友野園 | 入間市 | Té e infusiones | ficha | — | https://www.tabechoku.com/producers/25604 |  |
| 池乃屋園 | 入間市 | Té e infusiones | ficha | — | https://www.tabechoku.com/producers/23808 |  |
| 村田農産 | 毛呂山町 | Setas | ficha | — | https://www.tabechoku.com/producers/21559 | 埼玉県入間郡毛呂山町 |
| 塩谷農園 | 秩父市 | Setas | ficha | — | https://www.tabechoku.com/producers/26842 |  |
| 大野農場 | 川越市 | Carne | ficha | — | https://www.tabechoku.com/producers/21275 |  |
| 国分牧場 | 東松山市 | Carne | ficha | — | https://www.tabechoku.com/producers/28092 |  |
| カントリーファーム | 深谷市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/24501 |  |
| 西田農園 | 熊谷市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/21058 |  |
| いちご家×栗原農園 | 吉見町 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/3078638 | 埼玉県比企郡吉見町 |
| 森屋農場 | 小川町 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/25607 | 埼玉県比企郡小川町腰越矢崎 |
| 有機農家ないとう農園 | 伊奈町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/26303 |  |
| いるま鬼丸 | 入間市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20279 |  |
| 鈴木農園 | 加須市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25321 |  |
| 米農家りんご堂 | 春日部市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078044 |  |
| 塩原農園 | 本庄市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077769 |  |
| 鏡農園 | 深谷市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/29561 |  |
| あかいし農園 | 熊谷市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20100 |  |
| ちちぶ丸山農園 | 秩父市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21022 |  |
| Pino farm | 羽生市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24902 |  |
| 管理栄養士が育てる固定種/在来種のお野菜・自然栽培ナチュベジ＊ウィル | 飯能市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/27227 |  |
