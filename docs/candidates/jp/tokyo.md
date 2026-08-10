# Tokyo — candidatos

- CSV: `data/csv/jp/kanto/tokyo.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/tokyo> (11 bodegas, censo completo). Gremio: 東京都酒造組合, <http://www.tokyosake.or.jp/>.
- Estado: cola abierta, 11 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Tokio tiene 11 bodegas y diez de ellas están en el **Tama occidental**, no en la
ciudad: es agricultura de montaña a una hora de Shinjuku. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Ishikawa Shuzo | 石川酒造 | Fussa |
| Tamura Shuzojo | 田村酒造場 | Fussa |
| Ozawa Shuzo | 小澤酒造 | Ome |
| Ozawa Shuzojo | 小澤酒造場 | Hachioji |
| Maihime / Tokyo Hachioji Shuzo | 舞姫（東京八王子酒造） | Hachioji |
| Toshimaya Shuzo | 豊島屋酒造 | Higashimurayama |
| Nakamura Shuzo | 中村酒造 | Akiruno |
| Nozaki Shuzo | 野﨑酒造 | Akiruno |
| Noguchi Shuzoten | 野口酒造店 | Fuchu |
| Wakamatsu / Tokyo Port Brewery | 若松（東京港醸造） | Minato |
| Koyama Shuzo | 小山酒造 | Kita ⚠ |

## Trampas
- **Tokio no es un municipio.** Ya avisado en el `README.md` de esta carpeta: el
  `municipio` es el barrio especial (`Kita`, `Minato`) o la ciudad del Tama
  (`Fussa`, `Ome`, `Hachioji`, `Akiruno`, `Fuchu`, `Higashimurayama`). Nunca
  «Tokyo» a secas.
- ⚠ **小山酒造 (Kita, marca 丸真正宗)** dejó de elaborar. Un listado la sigue
  arrastrando; **exige evidencia reciente** antes de escribir la fila — y si
  confirmadamente cesó, es purga documentada, no `parcial`.
- **小澤酒造 (Ome, marca 澤乃井) y 小澤酒造場 (Hachioji, marca 桑の都)** son dos
  empresas distintas del mismo apellido. No fusionar.
- **東京港醸造 (Minato)** elabora en un edificio de cuatro plantas en Shibadaimon:
  es real y es la única bodega del centro. No descartarla por «no puede haber una
  bodega ahí».
- **Minimal Bean to Bar Chocolate** sigue en la bandeja del `README.md` sin barrio
  resuelto: es candidata de Tokio y se cierra resolviendo eso.

## Qué falta
- Nada de fuera del sake: falta **té de Tama**, wasabi de Okutama, 小松菜 (que
  toma el nombre de Komatsugawa, Edogawa), 江戸前 海苔 y pescado, y **las islas**
  — Ogasawara (café y el cacao de Hahajima, ver `saitama.md`), Hachijojima,
  Izu-Oshima (sal, ashitaba) — que son Tokio y no aparecen por ningún lado.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 横井醸造工業（株）　他 | 横井醸造工業（株）　他 | 東京都江東区新木場4-2-17　他 | 有機加工食品 | 第1053号 |
| 恵泉女学園大学 | 恵泉女学園大学　教育農場 | 東京都町田市小野路字笠松4007、4004-1、4004-2 | 有機農産物 | 01-043 |
| 丸成商事株式会社 | 丸成商事株式会社　本社工場　他 | 東京都練馬区豊玉北1-5-3　他 | 有機加工食品 | 第1169号 |
| 株式会社　遠藤製餡　東村山工場 | （株）遠藤製餡　東村山工場　他 | 東京都東村山市久米川町5-36-5　他 | 有機加工食品 | JE000912-PR0024-0 |
| （株）保谷納豆 | （株）保谷納豆　東村山工場 | 東京都東村山市青葉町2-39-9 | 有機加工食品 | 第1013号 |
| （有）菅谷食品　青梅工場 | （有）菅谷食品　青梅工場 | 東京都青梅市友田町1-1010-1 | 有機加工食品 | JS010228PR-0305-0 |
| 第一コーヒー株式会社 | 第一コーヒー株式会社 他 | 東京都港区東麻布3-10-1 | 有機加工食品 | 第1046号 |
| （株）珈琲実験室 | （株）珈琲実験室他 | 東京都八王子市大和田町2-19-11他 | 有機加工食品 | JK010228PR-0326-0 |
| ロストロジャパン | ロストロジャパン | 東京都渋谷区富ヶ谷１－１４－２０　サウスピア１０Ｂ | 有機加工食品 | カ-07-08 |
| 海の精株式会社 | 海の精株式会社元町工場 | 東京都大島町元町５７５ | 有機加工食品 | カ-08-09 |
| 株式会社　リアルフーズ | 株式会社　リアルフーズ | 東京都大田区大森東２－２６－２８ | 有機加工食品 | カ-09-01 |
| 丸和食品株式会社 | 丸和食品株式会社 | 東京都練馬区富士見台4 ‐1 2 ‐1 1 | 有機加工食品 | AFASSEQ-AP-090801 |
| 株式会社ピーエスアイ | 株式会社ピーエスアイ | 東京都大田区東糀谷4-3-16 | 有機加工食品 | 10-059B |
| 株式会社リーフル | 株式会社リーフル | 東京都杉並区阿佐ヶ谷南1丁目8番5号　OSAWAビル | 有機加工食品 | MPJP1681 |
| 株式会社マゴメ | 株式会社マゴメ　本社工場　他 | 東京都八王子市千人町4-9-22 | 有機加工食品 | AFASSEQ-AP-120401 |
| 薬糧開発株式会社　セントラルキッチン | 薬糧開発株式会社　他 | 東京都大田区東糀谷1丁目5番地13号　他 | 有機加工食品 | MPJP1721 |
| ヤナガワファーム | 河村松本　他 | 東京都青梅市今井5-2440-30　他 | 有機農産物 | A13-062801 |
| 株式会社生活の木 | 株式会社生活の木　他 | 東京都渋谷区神宮前6-3-8他 | 有機加工食品 | AFASSEQ-AP-140601 |
| 株式会社大和 | 株式会社大和　商品室 | 東京都中央区日本橋堀留町1-10-19第一川端ビル6階 | 有機加工食品 | B14-072501 |
| 世田谷畑人 | B　他 | 東京都世田谷区大蔵1-256-1　他 | 有機農産物 | A16-042801 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/tokyo.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **4** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| TYハーバーブルワリー (タイソンズアンドカンパニー) | Shinagawa | Cerveza | JBA | tyharborbrewing.co.jp | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 大黒社 (暁ブルワリー) | Shibuya | Cerveza | JBA | barbar.jp | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| Izumi Brewery | Komae | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| Far Yeast Brewing | Shibuya | Cerveza | JBA | faryeast.com | sede en Shibuya, planta en Kosuge (Yamanashi); resolver unidad productiva; revisado 2026-08-10: la web confirma la planta en Kosuge (Yamanashi), no una unidad productiva en Shibuya |

**Ya integrado, no volver a proponer:** 石川酒造 (Fussa) ya está en `tokyo.csv` como `Sake`; 多満自慢ビール sería otra fila del mismo obrador.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/tokyo.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/tokyo.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **13 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 亀澤堂 | 千代田区 | Dulces y repostería | 和菓子協会 | http://www.kamezawado.co.jp/ | 千代田区神田神保町 1-12-1 |
| さゝま | 千代田区 | Dulces y repostería | 和菓子協会 | http://www.sasama.co.jp/ | 千代田区神田神保町 1-23 |
| 庄之助 | 千代田区 | Dulces y repostería | 和菓子協会 | http://www.syounosuke.net/ | 千代田区神田須田町 1-8-5 |
| 鶴屋八幡 | 千代田区 | Dulces y repostería | 和菓子協会 | http://www.turuyahatiman.co.jp/ | 千代田区麹町 2-4 |
| 宝来屋本店 | 千代田区 | Dulces y repostería | 和菓子協会 | http://wagashi.houraiya.co.jp/ | 千代田区九段南 2-4-15 |
| 神田橘昌文錢堂 | 千代田区 | Dulces y repostería | 和菓子協会 | http://www.kanda-bunsendo.com/ | 千代田区神田神保町 1-13-2 |
| 株式会社金吾堂製菓 | 中野区 | Aperitivos | 全国米菓工業組合 | https://www.kingodo.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 王様製菓株式会社 | 台東区 | Aperitivos | 全国米菓工業組合 | https://www.osama-do.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 株式会社東あられ本鋪 | 墨田区 | Aperitivos | 全国米菓工業組合 | https://www.azuma-arare.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 株式会社中央軒煎餅 | 板橋区 | Aperitivos | 全国米菓工業組合 | https://www.chuoken.co.jp/ | 米菓製造・販売業（直売所有り） |
| 有限会社其角 (きかく) | 江東区 | Aperitivos | 全国米菓工業組合 | https://www.kikaku-sembei.co.jp/ | 米菓製造・販売業（直売所有り） |
| 株式会社赤坂柿山 | 港区 | Aperitivos | 全国米菓工業組合 | https://www.kakiyama.com | 米菓製造・販売業（直売所有り） |
| 株式会社たぬき煎餅 | 港区 | Aperitivos | 全国米菓工業組合 | https://www.tanuki10.com/ | 米菓製造・販売業（直売所有り） |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/tokyo.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/tokyo> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **0 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 12, Pescado 3, Setas 2, Miel 1, Carne 1, Dulces y repostería 1, Pan y cereal 1, ⚠ por decidir 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| Number8 | 豊島区 | Miel | ficha | — | https://www.tabechoku.com/producers/22895 |  |
| きのこたろう | 八王子市 | Setas | ficha | — | https://www.tabechoku.com/producers/20841 |  |
| KINOKO TOKYO | 大田区 | Setas | ficha | — | https://www.tabechoku.com/producers/3077918 |  |
| 西野農園 | 三宅島三宅村 | Pescado | ficha | — | https://www.tabechoku.com/producers/21057 |  |
| KOUYA MITA | 国立市 | Pescado | ficha | — | https://www.tabechoku.com/producers/24696 |  |
| Ks'フラワー | 大島町 | Pescado | ficha | — | https://www.tabechoku.com/producers/23343 |  |
| エシカルベジタブルス | 八王子市 | Carne | ficha | — | https://www.tabechoku.com/producers/28466 |  |
| 食べチョク公式 | 港区 | Dulces y repostería | ficha | — | https://www.tabechoku.com/producers/27604 |  |
| Base Side Farm | 瑞穂町 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/20438 | 東京都西多摩郡瑞穂町 |
| farm watanabe | 三鷹市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28554 |  |
| 鴨志田農園 | 三鷹市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20240 |  |
| 八丈島ばたけ | 八丈島八丈町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/22922 |  |
| みろくふぁーむ | 八丈町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3078204 |  |
| The Fruits Company™ | 文京区 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/23177 |  |
| 大沼農園 | 新島村 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21215 |  |
| 狭山茶 森藤園 | 瑞穂町 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/26446 | 東京都西多摩郡瑞穂町 |
| モリンガ＆モリンガ | 目黒区 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/25797 |  |
| 高橋果樹園 | 立川市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/28145 |  |
| 小さな畑の贈り物（ちいはた） | 足立区 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/3077553 |  |
| 青梅 清水農園 | 青梅市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/21565 |  |
| 繁昌農園Tokyo | 青梅市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/57 |  |
| 食べチョク公式 【Vivid TABLE】 | 港区 | ⚠ por decidir | — | — | https://www.tabechoku.com/producers/3078367 |  |
