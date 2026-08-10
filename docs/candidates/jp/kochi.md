# Kochi — candidatos

- CSV: `data/csv/jp/shikoku/kochi.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/kouchi> (20 bodegas, leído 2026-08-04 — ojo, la ruta es `kouchi`, no `kochi`). Gremio: 高知県酒造組合, <http://www.kbiz.or.jp/kumiai/sake/>.
- Estado: cola abierta, 13 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Suigei Shuzo | 酔鯨酒造 | Kochi ⚠ |
| Tsukasabotan Shuzo | 司牡丹酒造 | Sakawa |
| Tosatsuru Shuzo | 土佐鶴酒造 | Yasuda |
| Tosa Shuzo | 土佐酒造 | Tosa (町) ⚠ |
| Kameizumi Shuzo | 亀泉酒造 | Tosa (市) ⚠ |
| Kikusui Shuzo | 菊水酒造 | Aki ⚠ |
| Arimitsu Shuzojo | 有光酒造場 | Aki |
| Arisawa | アリサワ | Kami |
| Takagi Shuzo | 高木酒造 | Konan |
| Sendo Shuzojo | 仙頭酒造場 | Geisei |
| Nishioka Shuzoten | 西岡酒造店 | Nakatosa |
| Hamakawa Shoten | 濵川商店 | Tano |
| Kochi Shuzo | 高知酒造 | Ino |

## Trampas
- ⚠ **土佐市 (Tosa-shi) y 土佐町 (Tosa-cho, 土佐郡) son dos municipios distintos**
  de esta prefectura, y en esta tabla hay una bodega en cada uno: 亀泉酒造 en la
  ciudad y 土佐酒造 en el pueblo. `Tosa` a secas no basta.
- ⚠ **菊水酒造 (Aki, Kochi)** no es 菊水酒造 (Shibata, Niigata), la de ふなぐち, ya
  en `niigata.md`; ni 喜久水酒造 (Noshiro, Akita), en `akita.md`. Tres empresas.
- ⚠ **酔鯨酒造 aparece dos veces** (sede en Kochi y 土佐蔵 en Tosa-shi): es **una
  empresa**. Una fila, en el municipio donde elabora lo que se vende.
- **高木酒造 (Konan, Kochi)** no es 高木酒造 (Murayama, Yamagata), la de 十四代,
  en `yamagata.md`. Mismo 社名, dos de las bodegas más conocidas de Japón.
- **いの町 (Ino)** se escribe en hiragana y **芸西村 (Geisei)** es 村, no 町.

## Qué falta
- Las 7 bodegas restantes del censo.
- Kochi es la prefectura más rural de Japón y el pool no sakero es enorme, y
  ninguno abierto: **ゆず (yuzu)**, del que produce en torno a la mitad nacional
  — Umaji y Kitagawa tienen cooperativas con venta online consolidada;
  **生姜 (jengibre)**, también primera de Japón; **鰹のたたき** y el bonito de
  Kure/Nakatosa; 四万十 (nori de río, あおさ, 青のり), 文旦 y 小夏,
  碁石茶 (té fermentado de Otoyo, rarísimo y con muy pocos productores).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| （株）小谷穀粉 | （株）小谷穀粉 | 高知県高知市高須1-14-8 | 有機加工食品 | 01-005B |
| （有）　池田柚華園 | （有）　池田柚華園 | 高知県安芸郡北川村加茂314 | 有機加工食品 | JI010322PR-0391-0 |
| 国友商事株式会社　代表取締役　國友　昭香 | 国友商事株式会社 | 高知県吾川郡いの町小川小倉3097　他 | 有機農産物 | CF-A-001 |
| 国友商事株式会社　代表取締役　国友　昭香 | 国友商事（株） | 高知県吾川郡いの町小川柳野3216　他 | 有機加工食品 | B07-1001-001 |
| 馬路村農業協同組合 | 馬路村農業協同組合柚子部有機研究会 | 高知県安芸郡馬路村馬路3888番地1 | 有機加工食品 |  |
| 愛農高知有機生産組合 | 1 他 | 高知県南国市里改田長泉338　他 | 有機農産物 | 39-01 |
| アロインス製薬株式会社　四万十工場 | A25-1001-003 | 高知県四万十市間崎1017-1(2) | 有機農産物 | CF-A-009 |
| 一般財団法人夢産地とさやま開発公社 | A09-1003-002　他 | 高知県高知市土佐山弘瀬3234番地4イ | 有機農産物 | CF-A-010 |
| 森田真二 | 森田真二 | 高知県須崎市浦ノ内灰方1157-1-ｲ　他 | 有機農産物 | A10-1010-001 |
| 下村宏治 | A10-1009-001 | 高知県長岡郡大豊町怒田948-1、他3筆 | 有機農産物 | CF-A-016 |
| 碓井農園　碓井一四 | A12-1001-002 | 高知県高岡郡四万十町中神ノ川字柳の川558 | 有機農産物 | CF-A-046 |
| 高石　和典 | 15番ほ場 | 高知県長岡郡大豊町中村大王ヲクハゲ2552 | 有機農産物 | 39344100215 |
| 青山農園　青山　洌 | A14-1005-004　他 | 高知県香美市土佐山田町新改字林ノ谷308番2他3筆　他 | 有機農産物 | CF-A-027 |
| 刈谷農園　刈谷　真幸 | A12-1010-001　他 | 高知県吾川郡いの町字山神西2162他2筆　他 | 有機農産物 | CF-A-029 |
| YAOKI　代表　中越　貴彦 | A13-1011-001　他 | 高知県高岡郡中土佐町大野見萩中983　他 | 有機農産物 | A13-1011-001～003 |
| 株式会社高知前川種苗 | A13-1012-001　他 | 高知県香美市香北町白川760-1 | 有機農産物 | CF-A-038 |
| 宇藤　誠朗 | 高知県長岡郡大豊町佐賀山宮ノ鳴162番地1　他 | 高知県長岡郡大豊町佐賀山宮ノ鳴162番地1　他 | 有機農産物 | 39344100501～5 |
| 株式会社高知前川種苗　代表取締役前川卓也 | B14-1001-001 | 高知県高知市相生町6-3 | 有機加工食品 | B14-1001-001～002 |
| 株式会社はるひ畑 | A15-1001-002 | 高知県長岡郡大豊町津家桧生1547-37 | 有機農産物 | CF-A-046 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/kochi.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **propia** — búsqueda dirigida por producto; ficha o web propia del productor
- Estado: revisión cerrada el 2026-08-10; **2** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 吉永鰹節店 | Tosa | Conservas | propia | — | 鰹節; 宇佐町, sin dominio confirmado; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |
| 馬路村農協 | Umaji | Fruta y verdura | propia | yuzu.or.jp | yuzu transformado; cooperativa, triar; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/kochi.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **5 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 馬路村農協 | 馬路村 | Fruta y verdura | búsqueda dirigida + web propia | https://www.yuzu.or.jp/ | ⚠ cooperativa de yuzu, triar; 安芸郡馬路村 |
| たけまさ商店 | ⚠ | Pescado | búsqueda dirigida + web propia | https://takemasa-syouten.com/ | ⚠ municipio sin confirmar (Tosashimizu); 宗田節, centenaria |
| 土佐清水食品 | 土佐清水市 | Pescado | búsqueda dirigida + web propia | https://tosashimizu.co.jp/ | 宗田節 |
| 新谷商店 | 土佐清水市 | Pescado | búsqueda dirigida + web propia | https://soudabushi.com/ | 宗田節 y ahumados |
| ヤマア | 土佐清水市 | Pescado | búsqueda dirigida + web propia | https://yamaa-souda.com/ | 宗田節 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/kochi.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/kochi> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 10, Setas 3, Huevos 2, Frutos secos 2, ⚠ por decidir 2, Té e infusiones 1, Pescado 1, Carne 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| ヤドリギ製茶 | 本山町 | Té e infusiones | ficha | — | https://www.tabechoku.com/producers/24575 | 高知県長岡郡本山町 |
| たまごのおくだ | 南国市 | Huevos | ficha | — | https://www.tabechoku.com/producers/20908 |  |
| 超たまご田所養鶏場 | 南国市 | Huevos | ficha | — | https://www.tabechoku.com/producers/26736 |  |
| 仁淀川きくらげ｜高知県仁淀川町産 | 仁淀川町 | Setas | ficha | — | https://www.tabechoku.com/producers/20739 | 高知県吾川郡仁淀川町竹ノ谷 |
| グレイスファーム | 南国市 | Setas | ficha | — | https://www.tabechoku.com/producers/28592 |  |
| 宗安寺きのこセンター | 高知市 | Setas | ficha | — | https://www.tabechoku.com/producers/28921 |  |
| 土佐の漁師 | 室戸市 | Pescado | ficha | — | https://www.tabechoku.com/producers/26854 |  |
| 四万十ポーク農場直営店　デュロックファーム | 四万十町 | Carne | ficha | — | https://www.tabechoku.com/producers/24626 | 高知県高岡郡四万十町 |
| やの一果彩 | 土佐市 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/28729 |  |
| 田野屋紫蘭 | 安田町 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/3077886 | 高知県安芸郡安田町唐浜 |
| 岡﨑ファーム | いの町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24571 | 高知県吾川郡いの町 |
| 坂本農園（高知県） | いの町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/24959 | 高知県吾川郡いの町 |
| YUZU LIFE | 三原村 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25351 | 高知県幡多郡三原村 |
| 南国にしがわ農園 | 南国市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23790 |  |
| やまみずき農園（マル・シェリア） | 四万十市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22194 |  |
| マルシン生姜ファーム | 四万十市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28545 |  |
| 土佐水谷農園 | 土佐市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23287 |  |
| おおとよ塩かえる農園 | 大豊町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21075 |  |
| 林田孝好 | 奈半利町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/26177 | 高知県安芸郡奈半利町 |
| 篤農 | 香南市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20869 |  |
| いちえん農場 | 四万十市 | ⚠ por decidir | — | — | https://www.tabechoku.com/producers/21110 |  |
| 坂本直幸 | 土佐清水市 | ⚠ por decidir | — | — | https://www.tabechoku.com/producers/25423 |  |
