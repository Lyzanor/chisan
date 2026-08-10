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
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/akita> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| フジノ果 | 横手市 | Pescado | https://www.tabechoku.com/producers/28005 | 2022年4月より新規就農。先々代から80年続くりんごに加え、新規作物としてももとすいかを栽培予定。 |
| nohmask農園 | 横手市 | Pescado | https://www.tabechoku.com/producers/3078060 | 秋田県南部の「横手盆地」で育てた栄養価の高い安心安全な「お米と野菜」をお届けします。小規模ながら代々農業を営んでおり兼業稲作に努めてきました |
| オヤマダファーム | 男鹿市 | Pescado | https://www.tabechoku.com/producers/3078346 | 秋田県男鹿市にてあきたこまちをメインに生産しております。 |
| 農園晴晴（はればれ） | 能代市 | Pescado | https://www.tabechoku.com/producers/22867 | 秋田の北の方にあるちっちゃな農園です。自慢のニンニクは、農薬を使用せずに育てた滋味あふれる逸品です。ほかに自家栽培の野菜を使った漬物は、ぜひ |
| がっこ | 仙北市 | Carne | https://www.tabechoku.com/producers/21571 | 秋田県仙北市で夫婦2人で農業、畜産をやっております。 |
| 瀧田養鶏場　たまごの樹 | 秋田市 | Carne | https://www.tabechoku.com/producers/24424 | 昭和40年ごろに、酪農経営から養鶏業に転換し100羽から生産を開始しました。 |
| レンチナス奥羽伊勢 | 八峰町 | Setas | https://www.tabechoku.com/producers/27719 | 私たちは秋田県八峰町できのこ農家を経営しております |
| 間木しいたけハウス@東成瀬テックソリューションズ | 東成瀬村 | Setas | https://www.tabechoku.com/producers/3077504 | 私たちは、東成瀬村で地域おこし協力隊として村の方たちに広い分野でお手伝いさせていただいております。 |
| 秋田しいたけ農園 | 湯沢市 | Setas | https://www.tabechoku.com/producers/3078920 | 秋田県湯沢市で50年間しいたけの生産と販売をしています。 |
| 能延通商 | 能代市 | Setas | https://www.tabechoku.com/producers/29177 | 白神山地のふもと秋田県能代市で、椎茸や野菜等を栽培しています。丹精込めて育てた肉厚でぷりぷりな生椎茸をぜひ、 |
| ヒロファーム | 羽後町 | Legumbres | https://www.tabechoku.com/producers/3077240 | 枝豆農家になり１8年になりますが食味にこだわって食べて美味しいと思う枝豆を作っています。年々勉強する事ばかりですがこれからも誰が食べても美味 |
| 十和田アクアポニックス農場 | 小坂町 | Frutos secos | https://www.tabechoku.com/producers/3077874 | はじめまして。秋田県小坂町で「アクアポニックス」という農法で、おさかなと野菜を生産している十和田アクアポニックス農場の栗山哲です。 十和田湖 |
| ひない渡辺農園しどけ村 | 大館市 | Pan y cereal | https://www.tabechoku.com/producers/28868 | 「良い土、水、風　旬な野菜」をモットーに、健康を第一に考え、愛情をたっぷり注いで育てた四季折々の野菜、果物、米などの作物を提供します。 |
| 佐藤農園 | 大館市 | Pan y cereal | https://www.tabechoku.com/producers/26581 | 忠犬ハチ公の里で有名な秋田県大館市の山間でお米を生産しています。七代続く農家で、家族一緒に環境に配慮した減農薬栽培を行っています。地元特産の |
| 🌾こまちの田園 | 横手市 | Pan y cereal | https://www.tabechoku.com/producers/3077992 | 秋田の米所で明治時代から続く、老舗の米農家です。米農家の集大成として、"大切な人の身体をつくるお米"をコンセプトに安心・安全・美味しいお米を |
| 白神産物まなぶ | 能代市 | Pan y cereal | https://www.tabechoku.com/producers/26747 | 私は現在秋田県能代市に住んでおります。そばには世界遺産白神山地そして、秋田音頭の歌にある桧山がすぐそばにございます。日本海側で海山川に囲まれ |
| Snow Field Market | 湯沢市 | Fruta y verdura | https://www.tabechoku.com/producers/3078606 | 秋田県湯沢市で稲、トマト、セリ、アスパラを作付けしています。 |
| 吉村 | 湯沢市 | Fruta y verdura | https://www.tabechoku.com/producers/23071 | 秋田県湯沢市にて化学肥料を減らし乳酸菌を使用した野菜作りをしています。 |
| 果実庵とざわ | 鹿角市 | Fruta y verdura | https://www.tabechoku.com/producers/20062 | 「果実庵とざわ」は秋田県鹿角市で営まれているりんご農園です。 |
| OLAHO / おらほ | 大館市 | ⚠ por decidir | https://www.tabechoku.com/producers/3077761 | はじままして、OLAHO（おらほ）です。 |
| きずな | 横手市 | ⚠ por decidir | https://www.tabechoku.com/producers/23827 | 夏は高温多湿、冬は低温豪雪で豊饒な地「秋田県横手市」 |
| 鮎乃家 | 湯沢市 | ⚠ por decidir | https://www.tabechoku.com/producers/24716 | 鮎（あゆ）と共に歩んで創業60年。 |
