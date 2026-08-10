# Akita — candidatos

- CSV: `data/csv/jp/tohoku/akita.csv` (6 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/akita> (42 bodegas, leído 2026-08-04). Gremio: 秋田県酒造組合, <http://www.osake.or.jp/>.
- Estado: **6 integradas** el 2026-08-05 (4 `verificado`, 2 `parcial`). Evidencia en `data/evidence/jp/tohoku/akita.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Akita Jozo | 秋田醸造 | Akita |
| Akita Shuzo | 秋田酒造 | Akita |
| Nawa Shoten | 那波商店 | Akita |
| Akita Seishu | 秋田清酒 | Daisen |
| Kariho Shuzo | 刈穂酒造 | Daisen |
| Dewatsuru Shuzo | 出羽鶴酒造 | Daisen |
| Fukunotomo Shuzo | 福乃友酒造 | Daisen |
| Suzuki Shuzoten | 鈴木酒造店 | Daisen |
| Azakura Shuzo | 阿櫻酒造 | Yokote |
| Asamai Shuzo | 浅舞酒造 | Yokote |
| Ryozeki Shuzo | 両関酒造 | Yuzawa |
| Akita Meijo | 秋田銘醸 | Yuzawa |
| Tenju Shuzo | 天寿酒造 | Yurihonjo |
| Fukurokuju Shuzo | 福禄寿酒造 | Gojome |
| Yamamoto Shuzoten | 山本酒造店 | Happo |
| Kodama Jozo | 小玉醸造 | Katagami |

## Integradas 2026-08-05 (6)

| bodega | municipio | resultado |
|---|---|---|
| Akita Shurui Seizo (Takashimizu) | Akita | verificado · venta sí |
| Kimura Shuzo (Fukukomachi) | Yuzawa | verificado · venta sí |
| Hiraizumi Honpo | Nikaho | verificado · sin carrito |
| Saiya Shuzoten (Yuki no Bosha) | Yurihonjo | verificado · **venta = no** |
| Aramasa Shuzo | Akita | **parcial** · sin web |
| Hinomaru Jozo | Yokote | **parcial** · solo Instagram |

⚠ **`Daisen` resolvía al Daisen de Tottori** (大山町) en vez de 大仙市, a 600 km:
error bloqueante, y **cinco bodegas de la cola de arriba están en Daisen**.
Resuelto el 2026-08-05 en `municipality-overrides.json` (chugoku vs tohoku),
antes de escribir esas filas.

- **齋彌酒造店 es el primer `Venta online = no` explícito del país**, no un «no
  comprobado»: su propia web declara que no hace envío minorista y remite a
  tienda especializada. Merece la pena distinguirlo — la mayoría de los «no
  comprobado» de esta pasada son falta de dato, éste es un hecho.
- **新政酒造 no tiene dominio propio activo** (`aramasa.jp` no responde) pese a
  ser de las marcas más buscadas del país y el origen de la levadura kyokai nº 6.
  Sexto caso del patrón tras Hiroki, Takagi, Aihara, Suminoe y Heiko.
- **日の丸醸造 solo tiene Instagram.** Sirve de enlace externo, pero no permite
  leer actividad, así que se queda `parcial`.

## Trampas
- **秋田県醗酵工業 (Yuzawa)** es industria de alcohol/destilado a granel, no una
  bodega de marca: triar antes de escribir fila.
- Seis 社名 empiezan por 秋田 y son empresas distintas (秋田酒造 ≠ 秋田酒類製造 ≠
  秋田醸造 ≠ 秋田清酒 ≠ 秋田銘醸 ≠ 秋田誉酒造). Casar por 社名 completo.
- **喜久水酒造 (Kikusui Shuzo, Noshiro)** no es 菊水酒造 (Kikusui, Shibata,
  Niigata), ya listada en `niigata.md`. Rōmaji casi idéntico, dos empresas.
- 仙北郡美郷町 y 南秋田郡五城目町 son 町 dentro de 郡: el `municipio` es Misato,
  Gojome — no el 郡.

## Qué falta
- Las ~20 bodegas restantes del censo.
- Sin abrir: きりたんぽ, いぶりがっこ (encurtido ahumado, con GI propia), arroz
  Akitakomachi, 稲庭うどん de Yuzawa (fideos con denominación y muchos obradores).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 有限会社　正八 | H-5,6　他 | 秋田県南秋田郡大潟村西野22-18　他 | 有機農産物 | AFASSEQ-AA-050701 |
| 安部ファーム | F-11-1　他 | 秋田県南秋田郡大潟村方上6-5　他 | 有機農産物 | AFASSEQ-AA-030904 |
| イー・ファーム 遠藤暁 | G17-2 他 | 秋田県南秋田郡大潟村方上34-3、34-49　他 | 有機農産物 | AFASSEQ-AA-040901 |
| 有限会社花咲農園 | F7-4　他 | 秋田県南秋田郡大潟村方上26-32　他 | 有機農産物 | AFASSEQ-AA-010702 |
| 秋田ふるさと農業協同組合　有機米生産グループ | 橋本暁 | 秋田県横手市平鹿町中吉田字田ノ植39(一時利用)　他 | 有機農産物 | 600606P02A |
| 内田　一 | 4　他 | 秋田県南秋田郡大潟村東4-13　他 | 有機農産物 | S-085 |
| 大潟村げんき有機部会 | 相馬時博　2　他 | 秋田県南秋田郡大潟村東野38-24　他 | 有機農産物 | S-093 |
| 大潟村自然農法研究会 | １　他 | 秋田県南秋田郡大潟村字東野3-8　他 | 有機農産物 | 有機農産物認証生産第4号 |
| サン・ライス『有機の会』 | T-1A　他 | 秋田県南秋田郡大潟村字方口54-1　他 | 有機農産物 | 有機農産物認証生産第5号 |
| 株式会社OGURA | 株式会社OGURA | 秋田県大館市比内町扇田字倉下5-1 | 有機加工食品 | 011114-001 |
| 有限会社　サンファーム | B-18-①　他 | 秋田県南秋田郡大潟村字方口33-7　他 | 有機農産物 | 100093002 |
| 有限会社ライス秋田 | 方上12-10 | 秋田県南秋田郡大潟村方上12-10 | 有機農産物 | 100093007 |
| 早津　一仁 | 早津農園 | 秋田県南秋田郡大潟村字東野4-15①　他 | 有機農産物 | 00-002 |
| 有限会社粋き活き農場 | F-15 A　他 | 秋田県南秋田郡大潟村方上23-3　他 | 有機農産物 | 100052701 |
| オーリア21有機農産物生産部会 | １　他 | 秋田県南秋田郡大潟村字方口19-14  他 | 有機農産物 | 有機農産物認証生産第11号 |
| 株式会社秋田ニューバイオファーム | 株式会社秋田ニューバイオファーム | 秋田県由利本荘市西目町沼田字新道下４９０－５ | 有機加工食品 | JIAFE-OP-0006 |
| 今野農園・今野克久 | 10(Ｄ-2)　他 | 秋田県南秋田郡大潟村東野44-14　他 | 有機農産物 | AFASSEQ-AA-090801 |
| 白神郷ふたつい有機クラブ | 1　他 | 秋田県能代市二ツ井町切石字新田240　他 | 有機農産物 | S-214 |
| かたっこ米 | １　他 | 秋田県南秋田郡大潟村西野16-31,32　他 | 有機農産物 | 有機農産物認証生産第23号 |
| 有限会社北浦郷 | １　他 | 秋田県仙北市角館町八割字内山383　他 | 有機農産物 | 有機農産物認証生産第24号 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/akita.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **2** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| わらび座 (田沢湖ビール) | ⚠ Semboku | Cerveza | JBA | warabi.co.jp | la fuente se leyó «Senbon»; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| あきた野ワイナリー (森吉山ファーム) | ⚠ | Vino | JWA | — | el índice no publica municipio; revisado 2026-08-10: la ficha institucional no aporta contacto o web primaria suficiente para verificar actividad actual |

**Ya integrado, no volver a proponer:** 浅舞酒造 ya está en `akita.csv` como `Sake`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/akita.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/akita.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **7 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 木村屋商店 | 横手市 | Dulces y repostería | 和菓子協会 | http://www.chuokai-akita.or.jp/okasi/kimuraya/ | 横手市大町 5-23 |
| 三松堂 | 秋田市 | Dulces y repostería | 和菓子協会 | http://www.chuokai-akita.or.jp/okasi/sansyoudo/ | 秋田市中通 5-7-8 |
| 勝月 | 秋田市 | Dulces y repostería | 和菓子協会 | http://www.chuokai-akita.or.jp/okasi/syougetu/ | 秋田市保戸野通町 2-1 |
| 旭南高砂堂 | 秋田市 | Dulces y repostería | 和菓子協会 | http://www.okashiyasan.co.jp | 秋田市旭南 1-18-25 |
| かおる堂 | 秋田市 | Dulces y repostería | 和菓子協会 | http://www.kaorudo.jp | 秋田市川尻町字大川反 170 |
| 菓子舗榮太楼 | 秋田市 | Dulces y repostería | 和菓子協会 | http://www.eitaro.net/ | 秋田市高陽幸町 9-11 |
| 秋田いなふく米菓株式会社 | 秋田市 | Aperitivos | 全国米菓工業組合 | https://www.akitainafuku.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/akita.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/akita> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **17 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Pan y cereal 5, Fruta y verdura 5, Setas 4, Pescado 2, Huevos 1, Legumbres 1, Condimentos 1, Conservas 1, Frutos secos 1, ⚠ por decidir 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 瀧田養鶏場　たまごの樹 | 秋田市 | Huevos | productos | １０個入れパック入り国産鶏種もみじの新鮮たまご36個(４０個入り４個割れ保障 · 純国産鶏種「さくら」３６個（10個入れ４パック入り４個割れ保障 · 新鮮たまごえをたっぷり使った！濃厚たまごプリン（６個） | https://www.tabechoku.com/producers/24424 | premio 食べチョクAWARD |
| レンチナス奥羽伊勢 | 八峰町 | Setas | productos | 溢れ出す旨み汁！秋田県八峰町産ブランド椎茸【黒椎茸】3玉入り · 白神山地の湧水で育った【お買い得】肉厚椎茸500g×2袋 · 白神山地の湧水で育った訳あり肉厚椎茸500g×2袋 | https://www.tabechoku.com/producers/27719 | repr. 伊勢隼人; 秋田県山本郡八峰町 |
| 間木しいたけハウス@東成瀬テックソリューションズ | 東成瀬村 | Setas | ficha | — | https://www.tabechoku.com/producers/3077504 | repr. 近藤純光; 秋田県雄勝郡東成瀬村 |
| 秋田しいたけ農園 | 湯沢市 | Setas | productos | 【2026年秋予約】肉厚ジュワっと系「秋田」初収穫！原木しいたけ（1kg） · 【2026年秋予約】お試しパック発売！肉厚ジュワっと系「秋田」初収穫！原木し · 【2026年秋予約】肉厚ジュワっと系「秋田」初収穫！原木しいたけ（2kg） | https://www.tabechoku.com/producers/3078920 |  |
| 能延通商 | 能代市 | Setas | productos | 旨みたっぷり！乾燥シイタケ（スライス50g×5p） · 旨味たっぷり！乾燥しいたけ(スライス 25g×5p) · シャキシャキとした食感、癖のない味わいな「空心菜」100ｇ | https://www.tabechoku.com/producers/29177 | repr. 工藤美恵 |
| フジノ果 | 横手市 | Pescado | productos | 【小玉スイカ】贈答あきた夏丸チッチェ3Lサイズ1玉入れ【準備出来次第発送】 · 【小玉スイカ】家庭用あきた夏丸チッチェ3Lサイズ1玉入れ【準備出来次第発送】 · 【小玉スイカ】贈答あきた夏丸チッチェLサイズ2玉入れ【準備出来次第発送】 | https://www.tabechoku.com/producers/28005 | repr. 藤原　正宏 |
| 果実庵とざわ | 鹿角市 | Pescado | productos | ※出荷調整中※【2箱セット】☆農薬不使用りんご☆と特別栽培りんご(品種おまか · ※出荷調整中※☆農薬不使用りんご☆と特別栽培りんご(品種おまかせ)詰め合わせ · 【ご家庭用】【2箱セット】🌸🎐春夏もりんごをかかせない方へ「りんごおまかせ便 | https://www.tabechoku.com/producers/20062 | repr. 創業：2001年06月; premio 食べチョクAWARD |
| ヒロファーム | 羽後町 | Legumbres | productos | 旨さ倍増！秋の枝豆！250g✕4 · 品種お任せ新鮮枝豆250g×8p · 品種お任せ新鮮枝豆250g×4 | https://www.tabechoku.com/producers/3077240 | repr. 佐藤浩之; 秋田県雄勝郡羽後町 |
| 農園晴晴（はればれ） | 能代市 | Condimentos | productos | クラフトコーラキット/くろもじと山椒 和洋スパイス/静かな森のスパイス · 山菜ミズ 皮むき済みすぐ調理OK シャキシャキネバネバ 白神山麓天然 ５００ · 山菜ミズ｜白神山麓の静かな恵み｜シャキシャキ＆とろり食感の天然もの 1kg | https://www.tabechoku.com/producers/22867 |  |
| がっこ | 仙北市 | Conservas | productos | 箸が止まらないお漬物「いぶりがっこ」ハーフサイズ2袋セット！200g×2 · パリッポリッ箸が止まらないお漬物『いぶりがっこ』スライス2袋セット！ · 【秋田の晩酌セット】〜燻しの深みを2通りで〜いぶりがっこ2点セット | https://www.tabechoku.com/producers/21571 |  |
| 佐藤農園 | 大館市 | Pan y cereal | ficha | — | https://www.tabechoku.com/producers/26581 |  |
| nohmask農園 | 横手市 | Pan y cereal | productos | 【令和８年新米】秋田県産あきたこまち１０月中旬以降発送【予約】１０ｋｇ · お米５kgとにんにく（白黒）＆季節野菜セット（極甘ミニトマト入） · お米３kgとにんにく(白黒)＆季節野菜セット(旬枝豆・極甘ミニトマト入） | https://www.tabechoku.com/producers/3078060 |  |
| 🌾こまちの田園 | 横手市 | Pan y cereal | productos | 農薬85%カット！幻のあきたこまち 10kg · 農薬85%カット！幻のあきたこまち 5kg · 【朝市限定】農薬85%カット！幻のあきたこまち 10kg | https://www.tabechoku.com/producers/3077992 | repr. 創業：1900年03月 |
| オヤマダファーム | 男鹿市 | Pan y cereal | productos | 【令和8年産新米予約・大特価】秋田県産あきたこまち 白米20kg · 【令和8年産新米予約・大特価】秋田県産あきたこまち 玄米30kg · 【令和8年産もち米新米・大特価】秋田県産きぬのはだ 精米10kg | https://www.tabechoku.com/producers/3078346 |  |
| 白神産物まなぶ | 能代市 | Pan y cereal | productos | 【秋田の名産】世界遺産白神山地近郊の大自然で育った天然で粘りがあるミズ 50 · 【秋田の名産】世界遺産白神山地近郊の大自然で育ったおいしいメロン二玉 完全予 · 大自然世界遺産白神山地付近で取れたおいしい天然フキ（1kg） | https://www.tabechoku.com/producers/26747 | repr. 白神産物まなぶ |
| 十和田アクアポニックス農場 | 小坂町 | Frutos secos | ficha | — | https://www.tabechoku.com/producers/3077874 | repr. 創業：2023年12月 |
| ひない渡辺農園しどけ村 | 大館市 | Fruta y verdura | productos | オクラとトマトのセット<オクラ40本/トマト1400g>【朝どれ】【夏ギフト · 小玉スイカ〈特大1玉〉 シャリっと甘い！あきた夏丸チッチェ【夏ギフト】 · キュウリ12本 【朝どれ】シャキッとパリッと生でガブッと丸かじり！キュウリ本 | https://www.tabechoku.com/producers/28868 | premio 食べチョクAWARD |
| OLAHO / おらほ | 大館市 | Fruta y verdura | ficha | 訳あり★送料一律★R8年産にんにくバラ【高級品種♪白玉王】 | https://www.tabechoku.com/producers/3077761 | repr. 創業：2016年04月 |
| きずな | 横手市 | Fruta y verdura | productos | 大玉スイカ 秋田アカオニ７㎏以上 · 8/11発送限定 あきた夏丸チッチェ1玉（2.7㎏前後） · 8/11発送限定 小玉すいか あきた夏丸チッチェ２玉（１玉 約３㎏～2.6k | https://www.tabechoku.com/producers/23827 |  |
| Snow Field Market | 湯沢市 | Fruta y verdura | productos | 幻エイト 完熟桃太郎エイト（2㎏規格）ゼリーたっぷり甘酸ジューシーな希少栽培 · 幻エイト 完熟桃太郎エイト(1㎏)ゼリーたっぷり甘酸ジューシーな希少栽培トマ · 幻エイト 完熟桃太郎エイト（大容量4㎏規格）ゼリーたっぷり甘酸ジューシーな希 | https://www.tabechoku.com/producers/3078606 |  |
| 吉村 | 湯沢市 | Fruta y verdura | productos | 【小サイズ３玉入り】【夏ギフト】訳あり 小玉スイカ 3玉 糖度上昇中 本当に · 【小サイズ6玉入り】【夏ギフト】訳あり 小玉スイカ 3玉 糖度上昇中 本当に · 「旬」すいか 秋田県産 大玉1玉入 フレッシュスイカ 夏の風物詩 ギフト お | https://www.tabechoku.com/producers/23071 |  |
| 鮎乃家 | 湯沢市 | ⚠ por decidir | — | 温めるだけで名店の味《こまち鮎》鮎の塩焼き こだわりの炭火焼３本 熨斗対応可 · 温めるだけで名店の味《こまち鮎》鮎の塩焼き こだわりの炭火焼５本 熨斗対応可 · 温めるだけで名店の味《こまち鮎》鮎の燻製 究極の酒のつまみ ５本 熨斗対応可 | https://www.tabechoku.com/producers/24716 |  |
