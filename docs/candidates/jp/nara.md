# Nara — candidatos

- CSV: `data/csv/jp/kansai/nara.csv` (73 filas tras la revisión integral de 2026-08-11).
- Fuente: 奈良県酒造組合 (Nara Sake Brewers Association), <https://yamato-umazake.com/brewery-introduction/> — los 26 miembros del gremio, con marca, municipio y dominio propio.
- Estado: **25 de 26 integradas** en el CSV el 2026-08-04 como `parcial`. Queda 1: Yoshimura Shuzo (Uda), dejada fuera porque su única URL es una ruta de hosting de proveedor (`begin.or.jp/~inadoya`) y hay que localizar dominio vivo.

La cola se revalidó por completo el 2026-08-11. Las entradas que siguen abajo no
se publican porque aún conservan la carencia indicada en su sección; una fuente
de gremio o registro, por sí sola, no acredita toda la identidad, actividad y
localización necesarias.

Categoría para todos: `Sake` (`Bodega` quedó retirada el 2026-08-04).

## Trampas vistas
- `Koryo` es 広陵町 dentro de 北葛城郡, y `Yoshino`/`Shimoichi` están dentro de
  吉野郡: el `municipio` del CSV es el町, no el郡.
- Dos dominios son frágiles: `begin.or.jp/~inadoya` (hosting de proveedor, no
  dominio propio) y la ficha de Facebook de Kawai Shuzo. Si no cargan, tope
  `parcial`, no purga.

## Lo que resolvió esta integración

- ⚠ **«三輪匠» no existe como empresa.** El listado del 振興会 le puso el dominio
  de 三輪そうめん小西, y resultó ser **有限会社小西食品** (marca 三輪麺匠 小西,
  Makinouchi 345, tel. 0744-43-1072), empresa distinta de 三輪そうめん小西
  (tel. 0744-43-3113). **Dos Konishi en el mismo municipio**: entraron las dos,
  como filas separadas.
- ⚠ **Kurokawa Honke no está en Yoshino, sino en Uda** (大宇陀). Y el dominio que
  los directorios le atribuyen, `yoshinokuzu.com`, **no resuelve** (SERVFAIL):
  no es un 404, es que el dominio no existe. Sin enlace verificable no se da de
  alta (`docs/candidates/README.md`, alta mínima) — queda anotada.
- **森井食品 fallaba por HTTPS** (certificado de `bizmw.com`) y responde 200 por
  HTTP: no era un sitio muerto. Coordenadas tomadas de su propio enlace de mapa.
  Sin tienda localizada, así que entró `verificado` con `Venta online=no comprobado`.
- **奈良県三輪素麺工業協同組合** se queda fuera: es la cooperativa (63 socios), no
  un productor. Su tienda `miwasoumen.stores.jp` vende marca colectiva.

## Qué falta
- Los ~50 fabricantes de somen que la cooperativa no destaca.
- Sin abrir: **té de Yamato** (大和茶, sin fuente institucional localizada aún),
  persimón de Gojo/Nishiyoshino (Nara es la segunda de Japón), 柿の葉寿司,
  奈良漬 (encurtido en sake kasu, ligado a las bodegas de arriba).

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 19 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 株式会社　松音商会 | （株）松音商会　他 | 奈良県大和郡山市北郡山町63-2　他 | 有機加工食品 | JM010831PR-0426-0 |
| 大和まごころ会 | 熊代敬三　1　他 | 奈良県五條市牧町2512　他 | 有機農産物 | JY110922FA-1163-0 |
| （有）山口農園 | ア他 | 奈良県宇陀市榛原大貝674　他 | 有機農産物 | ＪＹ001027FA-0062-0 |
| 白銀オーガニック | 白銀オーガニックA 他 | 奈良県五條市西吉野町奥谷1897　他 | 有機加工食品 | 0702-01 |
| 京都グレインシステム株式会社 | 京都グレインシステム（株）奈良工場 | 奈良県奈良市小倉町1224 | 有機加工食品 | 04B-001 |
| 吉野川（紀ノ川）エコネット1 | 新開き2　他 | 奈良県五條市西吉野町湯塩35　他 | 有機農産物 | NA-08120901 |
| 福光園 | 福井製茶工場 他 | 奈良県奈良市都祁白石町198　他 | 有機加工食品 | 29-04 |
| 吉野川（紀ノ川）エコネット3 | 家の下　他 | 奈良県五條市西吉野町平沼田1333　他 | 有機農産物 | NA-09022601 |
| 吉野川（紀ノ川）エコネット4 | 家の上 他 | 奈良県五條市大深町中畑垣内388-3、383　他 | 有機農産物 | NA-09022602 |
| 株式会社パンドラファームグループ | 株式会社パンドラファームグループ　第一センター　他 | 奈良県五條市霊安寺町良峯1554　他 | 有機加工食品 | 212022701 |
| 前川勝人 | 圃場番号1 他 | 奈良県宇陀市榛原上井足2530　他 | 有機農産物 | (JM120727FA-1197-0) |
| 長木　節次 | 圃場番号1 他 | 奈良県宇陀市榛原上井足2540　他 | 有機農産物 | JC120629FA-1195-0 |
| 滝グループ | 墓の下　他 | 奈良県御所市原谷1107　他 | 有機農産物 | NA-13071601 |
| 旭製粉株式会社 | 旭製粉株式会社 | 奈良県桜井市上之宮67-2 | 有機加工食品 |  |
| 有限会社上田玄米茶屋 | 有限会社上田玄米茶屋 | 奈良県橿原市小槻町346-1 | 有機加工食品 | MPJP1772 |
| 山村　栄次 | 圃場1　他 | 奈良県宇陀市榛原澤1559(ハウス1～5)　他 | 有機農産物 | 00A-006 |
| 腰岡　大聖 | 露地Ａ　他 | 奈良県宇陀市大字陀東平尾４７３ | 有機農産物 | JK150311FA-1328-0 |
| フジエダ珈琲株式会社 | フジエダ珈琲株式会社 | 奈良県大和郡山市大江町112－1 | 有機加工食品 | 16B-003、16C-002 |
| 上久保淳一 | ほ場1 | 奈良県奈良市月ヶ瀬桃香野4096-3 | 有機農産物 | 29-07 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/nara.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión 2026-08-11; **1 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| ラッテ・たかまつ | Katsuragi | Lácteos y quesos | ChFun | latte-takamatsu.com | revisado 2026-08-10: el dominio está secuestrado por contenido de juego y la guía no basta para verificar actividad actual |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/nara.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/nara.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
- Estado: revisión 2026-08-11; **2 retenidos** en la segunda pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 三輪そうめん丸久 | 葛城市 | Pan y cereal | 全乾麺 | http://www.soumen-maruhisa.com/ | 手延べ干しめん; revisado 2026-08-11: retenido (403, falta confirmar actividad o unidad productiva) |
| 尾上製麺所 | 黒滝村 | Pan y cereal | 全乾麺 | http://www.shokokai.or.jp/29/294441Sp566/index.htm | 手延べ干しめん; revisado 2026-08-11: retenido (404, falta confirmar actividad o unidad productiva) |
