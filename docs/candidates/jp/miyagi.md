# Miyagi — candidatos

- CSV: `data/csv/jp/tohoku/miyagi.csv` (9 filas, altas del 2026-08-05).
- Fuente: 宮城県酒造組合 (gremio, autoritativo), <https://miyagisake.jp/kuramoto/> — los 24 miembros con 社名 y municipio (leído 2026-08-04).
- Estado: **9 integradas** el 2026-08-05 (7 `verificado`, 2 `parcial`); quedan 15. Evidencia en `data/evidence/jp/tohoku/miyagi.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Abekan Shuzo | 阿部勘酒造 | Shiogama |
| Uchigasaki Shuzoten | 内ヶ崎酒造店 | Tomiya |
| Sasaki Shuzoten | 佐々木酒造店 | Natori |
| Moritami Shuzoten | 森民酒造店 | Osaki |
| Kanbai Shuzo | 寒梅酒造 | Osaki |
| Tanaka Shuzoten | 田中酒造店 | Kami |
| Yamawa Shuzoten | 山和酒造店 | Kami |
| Nakayu Shuzoten | 中勇酒造店 | Kami |
| Kawakei Shoten | 川敬商店 | Misato |
| Chida Shuzo | 千田酒造 | Kurihara |
| Kanenoi Shuzo | 金の井酒造 | Kurihara |
| Ishikoshi Jozo | 石越醸造 | Tome |
| Kakuboshi | 角星 | Kesennuma |
| Onuma Shuzoten | 大沼酒造店 | Murata |
| Zao Shuzo | 蔵王酒造 | Shiroishi |

## Integradas 2026-08-05 (9)

| bodega | municipio | resultado |
|---|---|---|
| Ichinokura | Osaki | verificado · venta sí |
| Otokoyama Honten | Kesennuma | verificado · venta sí |
| Katsuyama Shuzo | Sendai | verificado · venta sí |
| Saura (Urakasumi) | Shiogama | verificado · tienda física |
| Niizawa Jozoten | Osaki ⚠ | verificado · sin carrito |
| Hagino Shuzo | Kurihara | verificado · sin carrito |
| Taiwagura Shuzo | Taiwa | verificado · sin carrito |
| Suminoe Shuzo | Ishinomaki | **parcial** · sin web |
| Heiko Shuzo | Ishinomaki | **parcial** · sin web |

⚠ **Miyagi tiene tres municipios que resolvían al sitio equivocado**, y es la
prefectura con más homónimos vistos hasta ahora:
- `kami` → 香美町 (Hyogo) en vez de 加美町, donde están tres bodegas de la cola.
- `shiroishi` → 白石町 (Saga) en vez de 白石市, donde está 蔵王酒造.
- `misato` → 美郷町 (Shimane), y además hay 美里町 en Kumamoto y en Saitama.

Los dos primeros quedan resueltos en `municipality-overrides.json` el
2026-08-05, **antes** de escribir esas filas. `misato` sigue sin resolver
porque hace falta decidir entre cuatro candidatos: hacerlo al integrar 川敬商店.

- ⚠ **Niizawa es un caso de sede contra planta.** Tras 2011 trasladó la
  elaboración a **Kawasaki-machi** y reconstruyó la sede en Osaki en 2013. La
  fila toma Osaki, que es lo que dan el gremio y su domicilio social, pero si la
  unidad productiva sigue en Kawasaki hay que corregirla.
- **`urakasumi.com/shop/` son tiendas físicas**, no carrito. Tercer falso
  positivo de la palabra «shop» tras Sachihime y Nabeshima en `saga.md`.
- **Suminoe y Heiko no tienen web propia**: cuarto y quinto caso del patrón tras
  Hiroki, Takagi y Aihara. Las marcas cotizadas del segmento premium venden por
  distribuidor y no publican nada.

## Trampas
- El gremio da **barrio, no municipio** en varias (仙台市泉区, 大崎市松山,
  大崎市三本木, 大崎市古川, 栗原市栗駒/一迫/金成): el `municipio` del CSV es la
  ciudad — Sendai, Osaki, Kurihara.
- 塩竈 / 塩釜: el gremio escribe las dos grafías para la misma ciudad (Shiogama).
- **Kesennuma e Ishinomaki** fueron arrasadas por el tsunami de 2011 y varias de
  estas bodegas se reconstruyeron o se trasladaron: la dirección histórica puede
  no ser la actual. Confirmar sede productiva antes de fijar coordenadas.

## Qué falta
- Ningún dominio recogido: primer trabajo de cada lote.
- Sin abrir: 笹かまぼこ de Sendai, ostra y marisco de Matsushima/Kesennuma, ternera
  de Sendai, arroz Hitomebore, 味噌/醤油.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 井ヶ田製茶株式会社 | 井ヶ田製茶株式会社　お茶の里総合流通センター | 宮城県仙台市若林区卸町1丁目3番2号 | 有機加工食品 | MPJP1158 |
| 服部コーヒーフーズ（株） | 服部コーヒーフーズ（株）　製造部 | 宮城県仙台市若林区六丁の目元町2-5 | 有機加工食品 | 第1063号 |
| ライスネット仙台 | ライスネット仙台 | 宮城県登米市迫町新田字下十五丸45 | 有機農産物 | AFASSEQ-AA-040902 |
| 門傳　仁 | 門傳　仁 | 宮城県栗原市一迫萩生45-A　他 | 有機農産物 | 600606P101 |
| 松山環境保全米グループ | 小原　勉 | 宮城県大崎市松山金谷字中田308-1,308-2　他 | 有機農産物 | 600606P01A |
| 黒澤　重雄 | 黒澤重雄 | 宮城県遠田郡涌谷町吉住字新吉住119　他 | 有機農産物 | 600606P104 |
| 武田英一 | 1 他 | 宮城県大崎市田尻蕪栗新蕪栗沼30　他 | 有機農産物 | S-146 |
| 有限会社　蕪栗千葉農場 | 3　他 | 宮城県大崎市田尻蕪栗上谷地88～90　他 | 有機農産物 | AFASSEQ-AA-011102 |
| JA加美よつば　有機米生産部会 | 長沼太一　他 | 宮城県加美郡加美町字下野目清水田40-1,41-1,42　他 | 有機農産物 | 600606P08A |
| 南方町水稲部会「有機の会」Ｃブロック | 高橋清範　他 | 宮城県登米市南方町新高石浦120　他 | 有機農産物 | 600606P11A |
| 南方町水稲部会「有機の会」Ｄブロック | 佐々木徳久　他 | 宮城県登米市南方町新間内39,40　他 | 有機農産物 | 600606P12A |
| 南方町水稲部会「有機の会」Ａブロック | 鎌田善太郎　他 | 宮城県登米市南方町新原浦44　他 | 有機農産物 | 600606P18A |
| 無農薬生産組合 | 亀ヶ下　他 | 宮城県登米市登米町登米字寺池亀ヶ下234,235,236-1,236-2,237　他 | 有機農産物 | 600606P03A |
| （有）ヒーロー　黒川支部 | 八嶋　喬　他 | 宮城県黒川郡大和町鶴巣北目大崎字具足沢64-47Ｂ　他 | 有機農産物 | 600606P17A |
| （有）ヒーロー | （有）ヒーロー | 宮城県大崎市田尻大沢新南善光寺13 | 有機農産物 | 600606P20A |
| 安部陽一 | 安部陽一 ほ場1 他 | 宮城県遠田郡美里町二郷字慶半東59番地1～2 他 | 有機農産物 | 2002F-35 |
| 三本珈琲株式会社 | 三本珈琲株式会社　仙台総合工場 | 宮城県黒川郡大和町吉岡東3－2－26 | 有機加工食品 | GMJP1097-02 |
| 佐藤和也 | 佐藤和也K-1他 | 宮城県加美郡加美町字原町東154他 | 有機農産物 | JA70417FA-0768-7 |
| 鈴木　要 | 1　他 | 宮城県大崎市田尻小塩字蓬田北4　他 | 有機農産物 | S-163 |
| 自然農法登米普及会 | 伊藤克成 10 他 | 宮城県登米市南方町新原浦49 他 | 有機農産物 | 2007F-14 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/miyagi.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 鬼首 (鳴子の風) | Osaki | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/miyagi.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/miyagi.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **4 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 九重本舗　玉澤 | 仙台市 | Dulces y repostería | 和菓子協会 | http://tamazawa.jp/ | 仙台市太白区郡山 4-2-1 |
| みやぎのあられ | 亘理町 | Aperitivos | 全国米菓工業組合 | https://www.miyaginoarare.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）、米菓販売業（その他菓子を含む卸・小売業） 全国米菓工業組合秋田県支部 |
| 株式会社精華堂霰総本舗 宮城工場 | 大崎市 | Aperitivos | 全国米菓工業組合 | https://seikadoarare.co.jp | 米菓製造・販売業（直売所有り） |
| 機械製乾めん・ 手延べ干しめん製造 乾めんのお話 各地の代表的なめん 乾めんレシピ 製麺技士の居る 工場一覧 七夕・そうめんの日 リンク パンフレット・ ポスター 会員専用 PL保険 製麺技士の居る工場一覧 (株)きちみ製麺 | 白石市 | Pan y cereal | 全乾麺 | https://www.tsurigane.com/ | 機械製乾めん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/miyagi.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/miyagi> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Pan y cereal 5, Pescado 4, Fruta y verdura 4, Huevos 2, Setas 2, Carne 2, Cerveza 1, Vino 1, Frutos secos 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 丹庄ファーム | 仙台市 | Cerveza | ficha | — | https://www.tabechoku.com/producers/3078731 |  |
| 秋保ワイナリー | 仙台市 | Vino | ficha | — | https://www.tabechoku.com/producers/3078032 |  |
| 石巻Eggファーム | 石巻市 | Huevos | ficha | — | https://www.tabechoku.com/producers/26154 |  |
| おおえだファーム | 角田市 | Huevos | ficha | — | https://www.tabechoku.com/producers/22373 |  |
| 七つ森ふもと舞茸 | 大和町 | Setas | ficha | — | https://www.tabechoku.com/producers/24624 | 宮城県黒川郡大和町 |
| キタザワ花園 | 気仙沼市 | Setas | ficha | — | https://www.tabechoku.com/producers/28678 |  |
| たみこの海パック | 南三陸町 | Pescado | ficha | — | https://www.tabechoku.com/producers/21734 | 宮城県本吉郡南三陸町 |
| 松島牡蠣屋 | 松島町 | Pescado | ficha | — | https://www.tabechoku.com/producers/22251 | 宮城県宮城郡松島町 |
| ㊥マルナカ遠藤水産 | 石巻市 | Pescado | ficha | — | https://www.tabechoku.com/producers/22401 |  |
| 太良衛門 | 角田市 | Pescado | ficha | — | https://www.tabechoku.com/producers/27504 |  |
| Yatsu ファーム | 丸森町 | Carne | ficha | — | https://www.tabechoku.com/producers/3078415 | 宮城県伊具郡丸森町 |
| 蕪栗グリーンファーム | 大崎市 | Carne | ficha | — | https://www.tabechoku.com/producers/27920 |  |
| もりのした | 岩沼市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/26155 |  |
| 黒澤農産 | 栗原市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/3078127 |  |
| エコファーム高橋 | 栗原市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/23272 |  |
| エービーfam | 登米市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/21887 |  |
| Lifetime nature&farming | 石巻市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/24954 |  |
| あかま里山農園 | 石巻市 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/22020 |  |
| 美食農園 ラ・ファータ【La fata】 | 名取市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23338 |  |
| デリシャスファーム | 大崎市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078833 |  |
| 木漏れ日農園 | 登米市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21755 |  |
| いなほ | 登米市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21095 |  |
