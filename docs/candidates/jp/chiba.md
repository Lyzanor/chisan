# Chiba — candidatos

- CSV: `data/csv/jp/kanto/chiba.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/chiba> (40 bodegas, leído 2026-08-04). Gremio: 千葉県酒造組合, <http://www.chiba-sake.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Iinuma Honke | 飯沼本家 | Shisui |
| Asahitsuru | 旭鶴 | Sakura |
| Iida Honke | 飯田本家 | Katori |
| Iida Shuzojo | 飯田酒造場 | Choshi |
| Ishigami Shuzo | 石上酒造 | Choshi |
| Kubota Shuzo | 窪田酒造 | Noda |
| Aoyagi Shuzo | 青柳酒造 | Yokoshibahikari |
| Umeichirin Shuzo | 梅一輪酒造 | Sanmu |
| Kankiku Meijo | 寒菊銘醸 | Sanmu |
| Inaka Shuzo | 稲花酒造 | Ichinomiya |
| Kidoizumi Shuzo | 木戸泉酒造 | Isumi |
| Iwase Shuzo | 岩瀬酒造 | Onjuku |
| Azumanada Jozo | 東灘醸造 | Katsuura |
| Kameda Shuzo | 亀田酒造 | Kamogawa |

## Trampas
- **`chiba` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español: las filas de la capital pasan el gate sin tocar
  nada. No re-resolverlo.
- **合同酒精 東京工場 (Matsudo)** es planta de grupo y encima lleva «Tokio» en el
  nombre estando en Chiba: triar, y si entra, el municipio es Matsudo.
- **小泉酒造** aparece sin municipio en la fuente (es Fusa, 富津市): resolver antes
  de escribir.
- 山武郡, 長生郡, 夷隅郡, 印旛郡 no son municipio: la fila lleva el 町.

## Qué falta
- Las ~26 bodegas restantes del censo.
- **醤油**: Chiba es la capital mundial de la salsa de soja — Noda (Kikkoman) y
  Choshi (Yamasa, Higeta) — y no hay ni una fila. El frente más obvio de la
  prefectura, con la cautela de que los tres son grupos industriales y lo que
  interesa son las casas pequeñas de la misma cuenca.
- Sin abrir: cacahuete de Yachimata (casi todo el nacional), 落花生, marisco de
  Boso, 海苔 de Tokyo Bay, なめろう.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| TOPPANパッケージングサービス株式会社 袖ケ浦ビバレッジ工場 | TOPPANパッケージングサービス株式会社　袖ケ浦ビバレッジ工場 | 千葉県袖ヶ浦市川原井480-1 | 有機加工食品 | MPJP1145 |
| （株）ドトールコーヒー　関東工場 | （株）ドトールコーヒー　関東工場 | 千葉県船橋市高瀬町21-6 | 有機加工食品 | 第1058号 |
| ちば醤油株式会社 | ちば醤油株式会社　本社工場 | 千葉県香取市木内1208 | 有機加工食品 | GMJP1231 |
| 株式会社万直商店 | 株式会社万直商店　他 | 千葉県流山市加4丁目3番地の3　他 | 有機加工食品 | 201051401 |
| 株式会社東京めいらく | 株式会社東京めいらく　千葉工場 | 千葉県佐倉市大作1-5-1 | 有機加工食品 | 第1235号 |
| 有限会社ワタミファーム　山武農場 | 113　他 | 千葉県山武市横田辻824-2、9　他 | 有機農産物 | A02-120401 |
| 有限会社ワタミファーム　佐原農場 | 607　他 | 千葉県香取市大根磯花1670-1、1670-2　他 | 有機農産物 | A06-080702 |
| 有限会社寺島農場 | 寺-若-1(秋田)　他 | 千葉県旭市秋田1353　他 | 有機農産物 | 101032001 |
| ヤマサ醤油株式会社 | ヤマサ醤油株式会社　他 | 千葉県銚子市新生町2-10-1　他 | 有機加工食品 | 010201-001 |
| 日東珈琲（株） | 日東珈琲（株） 千葉工場 他 | 千葉県山武市松尾町富士見台208-71 　他 | 有機加工食品 | 第1082号 |
| 日新化工（株）　船橋工場 | 日新化工（株）　船橋工場　他 | 千葉県船橋市高瀬町21-9　他 | 有機加工食品 | JN91018PR-0287-0 |
| （有）北総ベジタブル | 32　他 | 千葉県香取郡多古町一鍬田大ヨロ9-3　他 | 有機農産物 | JH061222FA-1311-0 |
| 農事組合法人　さんぶ野菜ネットワーク | 浅野誠士6　他 | 千葉県山武市実門横田入246-1　他 | 有機農産物 | JS061215FA-0941-0 |
| ニック食品株式会社 | ニック食品株式会社　本社工場 | 千葉県船橋市高瀬町23番地 | 有機加工食品 | 0043 |
| （株）川越屋　千葉工場 | （株）川越屋　千葉工場 | 千葉県山武郡横芝光町屋形3660 | 有機加工食品 | JK030227PR-0642-0 |
| 自然農法成田生産組合 | 高橋　博　６　他 | 千葉県富里市富山298-4　他 | 有機農産物 | JS000828FA-0128-0 |
| 柏原誠 | 圃場1-1 | 千葉県香取郡多古町林字金成台1527 | 有機農産物 | JS000828FA-0869-56 |
| 大谷晴美 | 大谷晴美1  他 | 千葉県香取郡多古町喜多井野750  他 | 有機農産物 | JK020910FA-0673-5 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/chiba.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

**Ya integrado, no volver a proponer:** 寒菊銘醸 ya está en `chiba.csv` como `Sake`; 九十九里オーシャンビール sería otra fila del mismo obrador.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/chiba.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/chiba.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
- Estado: **5 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| ささや | 千葉市 | Dulces y repostería | 和菓子協会 | http://www.k-sasaya.jp | 千葉市稲毛区緑町 1-24-2 |
| もりしん | 千葉市 | Dulces y repostería | 和菓子協会 | http://www.morishin-chiba.com | 千葉市若葉区みつわ台 2-10-16 |
| なごみの米屋 | 成田市 | Dulces y repostería | 和菓子協会 | http://www.nagomi-yoneya.co.jp/ | 成田市上町 500 |
| 房洋堂 | 館山市 | Dulces y repostería | 和菓子協会 | http://www.boyodo.co.jp | 館山市安布里 780 |
| 茂野製麺㈱ | 鎌ヶ谷市 | Pan y cereal | 全乾麺 | https://www.shigeno.co.jp/ | 機械製乾めん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kanto/chiba.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/chiba> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **20 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 6, Pescado 4, Miel 2, Setas 2, Legumbres 2, Pan y cereal 2, Huevos 1, Carne 1, Dulces y repostería 1, Bebidas sin alcohol 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| ハチミツさん | いすみ市 | Miel | productos | 夏のハチミツさん 160g · 初秋のハチミツさん 160g · 春のハチミツさん 450g | https://www.tabechoku.com/producers/21957 | repr. 西山　哲郎; premio 食べチョクAWARD |
| ONE DROP FARM | 市原市 | Miel | productos | ほろ苦い柑橘系蜂蜜！カラスザンショウ200g入り · 【お歳暮に！】ナッツの蜂蜜漬けと百花蜜のギフト3本入り · お花畑の香りそのまま！春の百花蜜170g入り | https://www.tabechoku.com/producers/3077998 | repr. 豊増　洋右 |
| 戸辺養鶏場 | 野田市 | Huevos | productos | 54個【鮮度抜群！！絶妙なコク＆うまさ！】 『体の内側からもっと美しく健康に · 27個【鮮度抜群！！絶妙なコク＆うまさ！】 『体の内側からもっと美しく健康に | https://www.tabechoku.com/producers/23733 | premio 食べチョクAWARD |
| 豊受きのこ園 | 我孫子市 | Setas | productos | ☆規格外品☆見た目を気にせずお得に美味しいしいたけを食べたい方必見！たっぷり | https://www.tabechoku.com/producers/25605 | repr. 創業：2015年06月 |
| きのこ屋でんべえ | 旭市 | Setas | ficha | 【要冷蔵】【バラ詰め2kg】生で食べられる新鮮マッシュルーム🍄 · 【要冷蔵】【バラ詰め1kg】生で食べられる！肉質にこだわった新鮮マッシュルー · マッシュルーム3kg【バラ詰め】 | https://www.tabechoku.com/producers/20616 | premio 食べチョクAWARD |
| 留守農場 | 八街市 | Pescado | productos | 【販売期間延長！】超大粒🥜八街名物留守農場の濃厚おおまさり 2kg · 超大粒🥜八街名物留守農場の濃厚おおまさり１kg · 風味はじける！朝穫れスーパースイートとうもろこし🌽バイカラー「ドルチェドリー | https://www.tabechoku.com/producers/22946 | repr. 留守剛 |
| 東京湾水産 | 富津市 | Pescado | productos | 漁師のおまかせ鮮魚セット【冷凍】２Kg · 3Lホンビノス貝 【250～350g／個】 ２kg入り · ホンビノス貝8kg 【 LLサイズ170g〜245g】 | https://www.tabechoku.com/producers/20925 |  |
| 不動丸 | 旭市 | Pescado | productos | 旨い‼️柔らかく、ふっくら パスタにどーぞ♪お味噌汁も美味しいですよ(^^) · 酒蒸し♪お鍋にどーぞ(^^) 《千葉ブランド水産物認定品》 九十九里産はまぐ · 【凍眠凍結】‼️いかがですか(^^) -30℃リキッド凍結蛤 《千葉ブランド | https://www.tabechoku.com/producers/20417 | repr. 遠藤 勝信; premio 食べチョクAWARD |
| 鈴常丸 | 船橋市 | Pescado | productos | ホンビノス貝5kg【LLサイズ 】（1個160ｇ~240ｇ位 5kg22~2 · 三番瀬ホンビノス貝2㎏【Mサイズ】【千葉ブランド水産物認定品】（1個50g～ · 三番瀬ホンビノス貝1㎏【Mサイズ】【千葉ブランド水産物認定品】（1個50g～ | https://www.tabechoku.com/producers/22463 | premio 食べチョクAWARD |
| ジェリービーンズ | 多古町 | Carne | productos | 通常より大きめ2.5kgの大ボリューム！お好みの厚さ・サイズにカットして料理 · とろりとやわらかい、2種の特製ダレ2段階仕込みのこだわりチャーシュー 元気豚 · 角煮、焼肉、ベーコンづくりなど、大活躍！元気豚 バラブロック 2kg（不定貫 | https://www.tabechoku.com/producers/24550 | repr. 創業：1992年05月; premio 食べチョクAWARD; 千葉県香取郡多古町 |
| 大倉モーモー農園 | 千葉市 | Legumbres | productos | 【おおまさりネオ】千葉県産 生落花生！極大粒で1Kg 新豆2026年収穫 · 【おおまさりネオ】千葉県産 生落花生！極大粒で４Kg 新豆2026年収穫 · 【おおまさりネオ】千葉県産 生落花生！極大粒で２Kg 新豆2026年収穫 | https://www.tabechoku.com/producers/3078158 |  |
| ヤマハン | 旭市 | Legumbres | productos | 【早割】【旬物】ぷりぷり大粒！千葉県産おおまさり2kg 食べ応えバツグンのジ · 【早割】【旬物】ぷりぷり大粒！千葉県産おおまさり3kg 食べ応えバツグンのジ · 【早割】【旬物】ぷりぷり大粒！千葉県産おおまさり1kg 食べ応えバツグンのジ | https://www.tabechoku.com/producers/28505 |  |
| ラグエルジャパン | 市原市 | Dulces y repostería | productos | 【冷蔵】高滝湖ブルーベリー（露地栽培）ジャム・スムージー向け１Kg（ラビット · 【冷蔵】濃厚で果実感あふれる「高滝湖ブルーベリー」（露地栽培）250g×2p | https://www.tabechoku.com/producers/29583 | repr. 三和正伸 |
| 輝農塾 | 千葉市 | Pan y cereal | productos | 新米 ふさおとめ 無洗米 5kg 令和8年産 · 新米 ふさおとめ 白米 10kg （5kg×2）令和8年産 · 新米 ふさおとめ 無洗米 10kg （5kg×2）令和8年産 | https://www.tabechoku.com/producers/23284 |  |
| ののま自然農園 | 君津市 | Pan y cereal | productos | 〈メール便〉古代米・雑穀よりどり4個【無肥料・栽培期間中農薬不使用 自然栽培 · 〈メール便〉黒大豆400gと黒米2袋 · 〈メール便〉古代米・雑穀よりどり6個【無肥料・栽培期間中農薬不使用 自然栽培 | https://www.tabechoku.com/producers/20073 |  |
| ksfarm | 白井市 | Bebidas sin alcohol | productos | 上品な甘さ♪果汁たっぷりのあきづき梨3kg【ﾁｮｯﾄ訳あり】 · 【PREMIUM】上品な甘さ♪果汁たっぷりのあきづき梨3kg · あま酸っぱーい梨♡豊水【規格外】2kg | https://www.tabechoku.com/producers/22632 |  |
| アグリヨシノ | 八街市 | Fruta y verdura | productos | 夏特売【アウトレット】春採れ"京くれない"サイズ色々☆4.5kg【リコピンに · 【クール便】葉しょうが、はじめました。（500g）【新鮮野菜】 · 夏特売【アウトレット】春採れ"京くれない"サイズ色々☆3.0kg【リコピンに | https://www.tabechoku.com/producers/26865 |  |
| おかざきファーム | 南房総市 | Fruta y verdura | productos | ツルッと😋【つるむらさき】１㎏ 🌱南房総から🌴🌱夏のスタミナ野菜✨緑茎🌿太い · !夏の香り🌻冷凍可！簡単料理のレシピたくさん！！お弁当やビールのおともに🍺  · 【まとめ買い】道の駅でも大人気❤️🌱生ビーツ5kg｜保存・加工に最適！大容量 | https://www.tabechoku.com/producers/25506 |  |
| ベジLIFE!! | 我孫子市 | Fruta y verdura | productos | Mサイズ ＊旬野菜セット(約8~9品)【農薬：栽培期間中不使用】 · Lサイズ ＊旬野菜セット(約10~11品)【農薬：栽培期間中不使用】 · Sサイズ ＊旬野菜セット(約6~7品)【農薬：栽培期間中不使用】 | https://www.tabechoku.com/producers/73 | premio 食べチョクAWARD |
| 和か葉農園 | 野田市 | Fruta y verdura | ficha | ルッコラ 有機 クール便 1.5kg〜 · ルッコラ 有機 クール便 500g〜 · ルッコラ 有機 クール便 1kg | https://www.tabechoku.com/producers/29215 | repr. 創業：2014年01月 |
| こもれび果実 | 鎌ヶ谷市 | Fruta y verdura | productos | 【梨：豊水】家庭用 5kg (14〜16玉)｜千葉の梨農家から朝採れ直送【予 · 【梨：かおり】家庭用 5kg 大玉(6〜12玉)｜千葉の梨農家から朝採れ直送 · 【梨：豊水】3kg (8〜9玉)｜千葉の梨農家から朝採れ直送【予約販売】 | https://www.tabechoku.com/producers/3079015 | repr. 創業：2025年04月 |
| 漬物工房彩 | 香取市 | Fruta y verdura | productos | 小ねぎが旨い！やみつきネギだれ140g×4個セット · 水耕栽培 小ねぎ 業務用 1㎏ クール便でお送りします。 · 小ねぎが旨い！やみつきネギだれ140g×8個セット | https://www.tabechoku.com/producers/24128 |  |
