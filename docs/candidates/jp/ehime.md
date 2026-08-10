# Ehime — candidatos

- CSV: `data/csv/jp/shikoku/ehime.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/ehime> (43 bodegas, leído 2026-08-04). Gremio: 愛媛県酒造組合, <http://www.ehime-syuzou.com/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Ishizuchi Shuzo | 石鎚酒造 | Saijo ⚠ |
| Akikawa Shuzo | 秋川酒造 | Saijo ⚠ |
| Umenishiki Yamakawa | 梅錦山川 | Shikokuchuo |
| Imamura Shuzo | 今村酒造 | Shikokuchuo |
| Eiko Shuzo | 栄光酒造 | Matsuyama |
| Umebijin Shuzo | 梅美人酒造 | Yawatahama |
| Kawakame Shuzo | 川亀酒造 | Yawatahama |
| Utsunomiya Shuzo | 宇都宮酒造 | Seiyo ⚠ |
| Ogata Shuzo | 緒方酒造 | Seiyo |
| Ikedaya | 池田屋 | Seiyo ⚠ |
| Akamatsu Honke Shuzo | 赤松本家酒造 | Uwajima |
| Okushima Shuzo | 奥嶋酒造 | Iyo |
| Kachizuru Shuzo | かち鶴酒造 | Tobe |
| Kyowa Shuzo | 協和酒造 | Tobe |

## Trampas
- ⚠ **宇都宮酒造 (Seiyo, Ehime)** no es 宇都宮酒造 (Utsunomiya, Tochigi), en
  `tochigi.md`. Mismo 社名 exacto, y el de Tochigi además coincide con el nombre
  de su propia ciudad: casar por municipio, no por apellido.
- ⚠ **西条市 (Saijo, Ehime) no es 西条 (Saijo)**, el barrio de 東広島市 que es una
  de las tres capitales del sake, en `hiroshima.md`. Aquí es una ciudad entera y
  está en otra isla.
- ⚠ **池田屋 (Seiyo, Ehime)** es el cuarto `Ikedaya` del catálogo, tras 池田屋酒造
  de Ibigawa (Gifu) e Itoigawa (Niigata) y 池田屋 de Miyama (Fukuoka).
- **梅錦山川 y 梅美人酒造** comparten el 梅: dos empresas, dos municipios.
- **宇和町 (Uwa)** es un barrio de 西予市 (Seiyo) tras la fusión de 2004: el
  `municipio` es Seiyo.

## Qué falta
- Las ~29 bodegas restantes del censo.
- Sin abrir, y es el frente grande: **みかん y 柑橘** — Ehime disputa a Wakayama
  el primer puesto nacional y tiene decenas de variedades propias (伊予柑,
  紅まどんな, せとか) con productores y cooperativas que venden online.
  Además: 鯛 de Uwajima (acuicultura con marca), じゃこ天, 今治 y la ruta de
  Shimanami, 砥部焼 (no alimentario), 麦味噌 (el miso de cebada del que Ehime es
  la principal productora).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| フジワラ化学株式会社 | フジワラ化学（株）　他 | 愛媛県西条市大新田95-1　他 | 有機加工食品 | 38212200101 |
| 大三島果汁工業株式会社 | 大三島果汁工業（株） | 愛媛県今治市大三島町浦戸1104 | 有機加工食品 | 38354200101 |
| 阿部久敏 | 愛媛県今治市郷新屋敷町2丁目259番地1　他 | 愛媛県今治市郷新屋敷町2丁目259番地1　他 | 有機農産物 | 382021002 |
| 岡田　義之 | 愛媛県松山市中島大浦2204番地1　他 | 愛媛県松山市中島大浦2204番地1 | 有機農産物 | 38363101302 |
| ヤマキ株式会社 | ヤマキ（株）第二工場　他 | 愛媛県伊予市下三谷字明星田262-1他 | 有機加工食品 | JY070426PR-0983-0 |
| 田井　和美 | 07番ほ場 | 愛媛県東温市則之内乙1390番地1 | 有機農産物 | 38362100807 |
| 池川良嗣 | 愛媛県東温市則之内乙2004番地1　他 | 愛媛県東温市則之内乙2004番地1　他 | 有機農産物 | 38362100301～10 |
| 株式会社サンフーズ | （株）サンフーズ | 愛媛県大洲市菅田町菅田甲2522 | 有機加工食品 | 38207200101 |
| しまなみ有機栽培グループ | 末岡英治3 他 | 愛媛県今治市大三島町明日587 他 | 有機農産物 | 2004F-12 |
| 有限会社バイオ | 02番ほ場 | 愛媛県松山市鷹子町乙52番地 | 有機農産物 | 38201100102 |
| 遠赤青汁株式会社 | 遠赤青汁㈱　本社工場 | 愛媛県東温市河之内乙８２７－１ | 有機加工食品 | 383362200101-2 |
| 愛工房株式会社 | 愛工房㈱ | 愛媛県宇和島市吉田町立間2番耕地146番地 | 有機加工食品 | 38203200101 |
| 株式会社Revege | 株式会社Revege | 愛媛県大洲市成能甲1583番地 | 有機農産物 | 38201100803 |
| 株式会社山口園芸 | 02ほ場 | 愛媛県宇和島市津島町増穂乙４番地 | 有機農産物 | 38203100202 |
| 白石　善輝 | 01番ほ場 | 愛媛県八幡浜市保内町宮内6番耕地963-3 | 有機農産物 | 38204100201 |
| 山崎　学 | 愛媛県今治市上浦町井口4765番地 | 愛媛県今治市上浦町井口4765番地 | 有機農産物 | 382021027 |
| 株式会社　アール・シー・フードパック | （株）アール・シー・フードパック | 愛媛県西予市宇和町卯之町2丁目575番地 | 有機加工食品 | 38214200201 |
| 二宮　裕基茂 | 愛媛県八幡浜市日土町ツバキ谷5-280-1　他 | 愛媛県八幡浜市日土町ツバキ谷5-280-1　他 | 有機農産物 | 382041004 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/ehime.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **propia** — búsqueda dirigida por producto; ficha o web propia del productor
- Estado: revisión cerrada el 2026-08-10; **4** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 井上蒲鉾本舗 | ⚠ Uwajima | Pescado | propia | — | じゃこ天; confirmar municipio y web; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |
| 田中蒲鉾本店 | ⚠ Uwajima | Pescado | propia | — | じゃこ天; confirmar municipio y web; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |
| 河内屋 | ⚠ Uwajima | Pescado | propia | — | じゃこ天; confirmar municipio y web; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |
| 野中蒲鉾 | ⚠ Uwajima | Pescado | propia | — | じゃこ天 de prensado manual; confirmar identidad; revisado 2026-08-10: la fuente directa no permitió confirmar conjuntamente identidad, actividad actual y municipio productivo |

**Ya integrado, no volver a proponer:** 梅錦山川 ya está en `ehime.csv` como `Sake`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/ehime.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/ehime.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **7 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 一六本舗 | 松山市 | Dulces y repostería | 和菓子協会 | http://www.itm-gr.co.jp/ | 松山市東石井 1-2-20 |
| 中野本舗 | 松山市 | Dulces y repostería | 和菓子協会 | http://www.usuzumi.co.jp/ | 松山市井門町 1331-1 |
| 東陽製菓株式会社 | 西条市 | Aperitivos | 全国米菓工業組合 | http://www.touyouseika.jp/ | 米菓製造・販売業（直売所有り） |
| 野中かまぼこ店 | ⚠ | Pescado | búsqueda dirigida + web propia | https://www.jakoten.co.jp/ | ⚠ municipio sin confirmar (Uwajima); じゃこ天 |
| 井上蒲鉾本舗 | ⚠ | Pescado | búsqueda dirigida + web propia | https://www.e-jyakoten.co.jp/ | ⚠ la web devuelve 403 al bot (no es sitio muerto); municipio sin confirmar |
| 河内屋蒲鉾 | 宇和島市 | Pescado | búsqueda dirigida + web propia | https://www.kawachiya1848.co.jp/ | じゃこ天; casa de 1848 |
| おがた蒲鉾 | 西予市 | Pescado | búsqueda dirigida + web propia | https://www.ogata-kamaboko.co.jp/ | じゃこ天 |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/shikoku/ehime.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/ehime> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **21 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 9, Pescado 3, Té e infusiones 2, Huevos 2, Pan y cereal 2, Bebidas sin alcohol 2, Setas 1, Condimentos 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| にのらく茶園　有機国産べにふうき専門 | 内子町 | Té e infusiones | productos | オーガニックのべにふうき緑茶 煮出しがオススメ たっぷり25リットル分 · オーガニックの本格和紅茶 べにふうきのベーシックブレンド | https://www.tabechoku.com/producers/28007 | repr. 東　晃佑 |
| メニークエスト | 西予市 | Té e infusiones | productos | 栗産地のこだわり『ほとんど栗のテリーヌ』＆『城川オリジナルモンブラン3個入』 · 動物性原材料不使用【プラントベーススイーツ】ほとんど栗のテリーヌ · 栗産地こだわりの『城川オリジナルモンブラン』3個入 | https://www.tabechoku.com/producers/3077350 | repr. 菊地沙也加 |
| 四万十ミライ | 久万高原町 | Huevos | productos | 【樹上完熟】南国土佐 完熟生ブルーベリー１ｋｇ 農薬不使用 自然栽培 四万十 · 【天然記念物】原種比内鶏の有精卵６個 数量限定お試しセット · 【樹上完熟】四万十和栗１ｋｇ ２Ｌサイズ以上 農薬不使用 自然栽培 四万十産 | https://www.tabechoku.com/producers/27748 |  |
| ＴＯＹＯＫＥＮ | 今治市 | Huevos | productos | 栄養満点宝箱！！ 今治育ちの烏骨鶏 海賊卵（烏骨鶏卵） ６個入り×２パック  · 栄養満点宝箱！！ 今治育ちの烏骨鶏 海賊卵（烏骨鶏卵） ６個入り （熨斗可能 | https://www.tabechoku.com/producers/28144 | repr. 創業：2020年11月 |
| 森の風 | 鬼北町 | Setas | productos | 現役宮司が栽培 自然への感謝を込めた原木乾燥しいたけ （原形 60g x 4 · 現役宮司が栽培 自然への感謝を込めた原木乾燥しいたけセット（原形 60g、ス · 現役宮司が栽培 自然への感謝を込めた原木乾燥しいたけ （粉末 80g x 4 | https://www.tabechoku.com/producers/28654 | repr. 二宮美日; 愛媛県北宇和郡鬼北町 |
| 木嶋水産 | 伊方町 | Pescado | productos | 【まとめ発送】さだ岬の生わかめ5kg【新鮮冷凍】（200g×25袋） · 【冷凍のあわせ買いに】シャキッ！さだ岬の生わかめ（冷凍）200g×1袋 · シャキッ！さだ岬の生わかめ１kg（200g×5袋）【新鮮冷凍】 | https://www.tabechoku.com/producers/26700 | premio 食べチョクAWARD; 愛媛県西宇和郡伊方町 |
| 松本功次（由良のアワビ屋） | 宇和島市 | Pescado | productos | 養殖活ヒオウギ貝80（殻長75～84ミリ）20個入り 生きたままお届けします · 養殖活ヒオウギ貝80（殻長75～84ミリ）40個入り 生きたままお届けします · 養殖活アワビ500ｇ（約4～7個入り） 愛媛宇和島産 生きたままお届けします | https://www.tabechoku.com/producers/23638 | repr. 松本　功次 |
| 川原鮮魚 | 西予市 | Pescado | productos | 【夏ギフト】タイセット(魚 · 魚加工品詰め合わせセット(ノーマル)7袋 · 魚詰め合わせセット(味付け)7袋 | https://www.tabechoku.com/producers/26556 | premio 食べチョクAWARD |
| ethnic green farm廣川農園 | 東温市 | Condimentos | productos | 農薬、化学肥料不使用！香り豊かな赤紫蘇！1㎏ · ハラペーニョ 1kg · 農薬、化学肥料不使用！香り豊かな赤紫蘇！2㎏ | https://www.tabechoku.com/producers/20116 |  |
| 吉本農園 | 愛南町 | Pan y cereal | productos | 【2026年河内晩柑！今なら20％増量中】爽やかジューシー果実！家庭用3㎏→ · 【只今20%増量中！！】爽やかジューシー果実！河内晩柑！みかけごめん5㎏→6 · 【2026年河内晩柑!今なら20％増量中！！】爽やかジューシー果実！家庭用8 | https://www.tabechoku.com/producers/18 | repr. 吉本敏幸; premio 食べチョクAWARD; 愛媛県南宇和郡愛南町 |
| SUNNYSIDE FARM | 松山市 | Pan y cereal | productos | 【R７年度産】生活排水なしの一番水 自然栽培窪野米イセヒカリ10㎏【玄米】 · 【R8年産】予約販売 自然栽培米 イセヒカリ15㎏【玄米】※定期購入時はパス · 【R8年産】予約販売 生活排水なしの一番水 自然栽培窪野米イセヒカリ20㎏【 | https://www.tabechoku.com/producers/29052 | repr. 創業：2023年04月 |
| シトラスベースひめまる | 伊方町 | Bebidas sin alcohol | productos | 《果汁100％糖度：13.9》ひめまる・石地みかんジュース720ml×３本 · とにかく甘い！ひめまる石地みかん（ご家庭用・5Kg） · 濃厚果汁！南津海（なつみ）優品・５Kg | https://www.tabechoku.com/producers/3077649 | repr. 創業：1984年09月; 愛媛県西宇和郡伊方町 |
| 島馬ファーム瀬戸内 | 松山市 | Bebidas sin alcohol | productos | 【飲み比べセット】カラマンダリン&伊予柑 果汁100%ストレートジュース 7 · 【愛媛県中島産】味濃厚なカラマンダリン サイズ混合5kg · 【愛媛県中島産】味濃厚春みかん！カラマンダリン農薬不使用 サイズ混合5キロ | https://www.tabechoku.com/producers/3078566 | repr. 岡田海渡 |
| まるき農園 | 今治市 | Fruta y verdura | productos | 丸ごと生しぼり！〖農薬不使用〗3本入飲み比べ柑橘ジュース🍊温州みかん/八朔/ · トロッと玉ねぎ【農薬化学肥料不使用】とても甘い10キロ30個前後 · 【セットでお届け！】農薬化学肥料不使用キラピカ野菜BOX8品ぴゅあみかんジュ | https://www.tabechoku.com/producers/29523 | repr. 井原　大喜 |
| OrangeStoreニノミヤ | 八幡浜市 | Fruta y verdura | productos | 【これを選べば間違いなし】まるで天然ゼリー！まどんな（ご家庭用・2㎏）×２箱 · 【無添加】夕やけみかんジュース 720ml×６本 · 【超おすすめ！】まどんな（ご家庭用・２㎏）+夕やけみかん（ご家庭用・２㎏）※ | https://www.tabechoku.com/producers/21129 | repr. 二宮正道; premio 食べチョクAWARD |
| NOT FARM | 八幡浜市 | Fruta y verdura | productos | 【OUTTAKES】訳あり 青ゆず2kg 愛媛県産 青柚子 BLUE YUZ · 【OUTTAKES】訳あり グリーンレモン 5kg 愛媛県産【防腐剤・ワック · 【OUTTAKES】訳あり 青ゆず5kg 愛媛県産 青柚子 BLUE YUZ | https://www.tabechoku.com/producers/3079048 | repr. 創業：2018年11月 |
| えひめ　二宮果樹園 | 八幡浜市 | Fruta y verdura | productos | 種がないレモン箱込約3㌔ · 種がないジューシーレモン箱込約1㌔ · 箱込約1㌔ マイヤーレモン 皮までバリバリ食べれる美味しさ | https://www.tabechoku.com/producers/22586 |  |
| ニノミヤファーム | 八幡浜市 | Fruta y verdura | productos | 【贈答品】愛媛の段畑まどんな 9〜12玉×2箱 · 【予約でほぼ売り切れる】美味しいみかん！「段畑みかん」箱込み3キロ · 【予約でほぼ売り切れる】美味しいみかん！「段畑みかん」箱込み5キロ | https://www.tabechoku.com/producers/22932 | repr. 二宮充輝 |
| 新口農園【みかん・柑橘グランプリ2026最高金賞受賞】 | 八幡浜市 | Fruta y verdura | productos | 【ギフトGP2026ダブル受賞】PREMIUMみかんジュース（1000ml× · 【訳ありだけど美味しさそのまま】河内晩柑 7kg【ほのかな甘みに爽やかな酸味 · 【訳ありだけど美味しさそのまま】河内晩柑 5kg【ほのかな甘みに爽やかな酸味 | https://www.tabechoku.com/producers/25606 | repr. 新口太公 |
| 大友農園 | 松山市 | Fruta y verdura | productos | せとうちの島育ち！ えひめ中島レモン 5kg · せとうちの島育ち！ えひめ中島レモン 10kg · せとうちの島育ち！ えひめ中島いよかん 10kg | https://www.tabechoku.com/producers/3078159 | repr. 創業：2011年09月 |
| GUILD Farm | 松山市 | Fruta y verdura | productos | 【加工用】香り満点！瀬戸内カットレモン（冷凍・1kg） · 【ジャム用】香り満点！レモンの皮（冷凍・1kg） · 【ジャム用】香り満点！伊予柑の皮（冷凍・1kg） | https://www.tabechoku.com/producers/3077713 | repr. 創業：2021年02月 |
| 里居農園（さといのうえん） | 西予市 | Fruta y verdura | ficha | — | https://www.tabechoku.com/producers/20790 |  |
