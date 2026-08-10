# Miyazaki — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/miyazaki.csv` (1 fila: Kyoya Shuzo, Nichinan, destilados). Dedup: ninguna de abajo solapa.
- Fuentes: 日本酒造組合中央会, <https://japansake.or.jp/sakagura/jp/miyazaki/> (pág. 1 de 4) y 宮崎県酒造組合, <https://www.miyazaki-sake.or.jp/> (reparte por 7 comarcas; la página del área de Miyazaki añade cuatro más). Leídas 2026-08-04.
- Estado: cola abierta, 16 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Miyazaki es **la primera prefectura de Japón en 焼酎** y prácticamente no hace
sake: el censo de SAKETIMES solo le encuentra 2 bodegas, mientras el gremio real
tiene decenas de destilerías. Categoría por defecto: `Destilados y licores`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kuroki Honten | 黒木本店 | Takanabe ⚠ |
| Osuzuyama Joryusho | 尾鈴山蒸留所 | Kijo ⚠ |
| Iwakura Shuzo | 岩倉酒造 | Saito |
| Yamaya Joryusho | やまや蒸留所 | Saito |
| Watanabe Shuzojo | 渡邊酒造場 | Miyazaki |
| Kawagoe Shuzojo | 川越酒造場 | Miyazaki |
| Ochiai Shuzojo | 落合酒造場 | Miyazaki |
| Unkai Shuzo (Aya) | 雲海酒造 綾蔵 | Aya ⚠ |
| Ikoma Kogen Shuzo | 生駒高原酒造 | Kobayashi |
| Sato Shochu Seizojo | 佐藤焼酎製造場 | Nobeoka |
| Akugare Joryusho | あくがれ蒸留所 | Hyuga |
| Kawasaki Jozojo | 川崎醸造場 | Morotsuka |
| Fujimoto Honten | 藤本本店 | Morotsuka |
| Takachiho Shuzo | 高千穂酒造 | Takachiho |
| Sentoku Shuzo | 千徳酒造 | Nobeoka — `Sake` |
| Hombo Shuzo (Kobayashi) | 本坊酒造 小林工場 | Kobayashi ⚠ |

## Trampas
- ⚠ **黒木本店 y 尾鈴山蒸留所 son la misma casa**: la segunda es la destilería de
  montaña de la primera. Pueden ser dos filas (dos municipios, dos marcas) o una;
  decidirlo explícitamente, no por descuido.
- ⚠ **本坊酒造 小林工場** es planta del **Hombo Shuzo que ya está en
  `data/csv/jp/kyushu-okinawa/kagoshima.csv`**. Si no tiene marca e identidad
  propias, no es fila nueva: es la de Kagoshima.
- ⚠ **`aya` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español (`AGENTS.md` de Japón): 綾町 pasa el gate sin
  tocar nada. Y 雲海酒造 綾蔵 es planta de un grupo grande: triar.
- **宝酒造 黒壁蔵 (Takanabe)** es planta de Takara (Kioto): mismo triaje.
- **千徳酒造 (Nobeoka)** es de las poquísimas bodegas de **sake** de la
  prefectura: la excepción que confirma el patrón.
- 東臼杵郡諸塚村 (Morotsuka) es 村, y 児湯郡 no es municipio.

## Qué falta
- Las 3 páginas restantes del listado del gremio nacional y las 6 comarcas del
  gremio prefectural sin recorrer (高千穂, 延岡・日向, 西都・高鍋, えびの・小林,
  都城, 日南・串間). **都城 es la mayor zona de shochu del país** y aquí no hay
  ninguna.
- Sin abrir: **完熟マンゴー (太陽のたまご)**, 日向夏, 宮崎牛 (campeón nacional
  tres veces), みやざき地頭鶏 (pollo con marca), 千切り大根, 釜揚げうどん.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 高木　靖寛 | 北園A | 宮崎県児湯郡川南町大字川南 26225 | 有機農産物 | JT040106FA-0695-0 |
| 甲斐鉄也 | 1他 | 宮崎県西臼杵郡高千穂町大字下野字折原2392-2　他 | 有機農産物 | 0607-A03 |
| 岩脇隆 | No.１他 | 宮崎県東諸県郡綾町大字南俣字萩の窪4810-1　他 | 有機農産物 | 農-1 |
| 山田強 | 1　他 | 宮崎県小林市大字南西方7767-2　他 | 有機農産物 | 37号 |
| 宮崎県農協果汁株式会社 | 宮崎県農協果汁株式会社　他 | 宮崎県児湯郡川南町大字川南20016-3　他 | 有機加工食品 | MPJP1034 |
| 有限会社松井農園 | 1　他 | 宮崎県東諸県郡綾町大字北俣大窪2095　他 | 有機農産物 | 農－第3号 |
| 株式会社宮崎経済連直販 | 株式会社宮崎経済連直販 茶工場 | 宮崎県宮崎市大字富吉1243番地 | 有機加工食品 | 0612-B04 |
| 前田清寿 | 前田清寿 | 宮崎県東諸県郡綾町大字南俣字草萩2382-1　他 | 有機農産物 |  |
| 都城葛生産組合 | 103 | 宮崎県串間市大谷2061た　小林班　外4 | 有機農産物 | 188号 |
| 園田雄一 | ２　他 | 宮崎県東諸県郡綾町大字南俣字遠目塚3540　他 | 有機農産物 | 農－第５号 |
| 株式会社　宮﨑茶房 | 製茶工場 | 宮崎県西臼杵郡五ヶ瀬町大字桑野内4972-1他 | 有機加工食品 | 0704-B03 |
| 株式会社農業生産法人健康家族 | 環野1 他 | 宮崎県小林市南西方 他 | 有機農産物 | 223号 |
| 健康農園萩原 | 1 他 | 宮崎県宮崎市高岡町高浜下原1112-1他 | 有機農産物 | 45-01 |
| やまぐち茶園 | やまぐち茶園 | 宮崎県日南市南郷町大字榎原乙543-1他 | 有機農産物 | 154号 |
| 野口オーガニックファーム | 29-C他 | 宮崎県えびの市大字東長江浦1652-205他 | 有機農産物 | FFJP1244 |
| 森本茂 | 森本茂（㈱太地園） | 宮崎県児湯郡川南町大宇川南13140-2 | 有機加工食品 | JD010314PR-0370-0 |
| (株)宮崎アグリアート　松本嗣夫 | FM1　他 | 宮崎県宮崎市跡江踏田前2016　他 | 有機農産物 | S-108 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/miyazaki.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

**Ya integrado, no volver a proponer:** 雲海酒造 ya está en `miyazaki.csv` como `Destilados y licores`.
