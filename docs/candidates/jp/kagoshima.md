# Kagoshima — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/kagoshima.csv` (2 filas: Hombo Shuzo y Kanosuke Distillery, destilados). Dedup: ver la nota sobre 本坊酒造.
- Fuente: 鹿児島県酒造組合, <https://www.honkakushochu.or.jp/kuramoto/> — **122 蔵元**, el gremio más grande de esta pasada (leído 2026-08-04).
- Estado: cola abierta, 17 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Aquí el gremio no es de sake: es de **本格焼酎** de batata, con Indicación
Geográfica (薩摩焼酎). Categoría para todas: `Destilados y licores`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Nishi Shuzo | 西酒造 | Hioki ⚠ |
| Komasa Jozo | 小正醸造 | Hioki ⚠ |
| Hamada Shuzo (Denzoin) | 濵田酒造 傳藏院蔵 | Ichikikushikino ⚠ |
| Satsuma Kinzangura | 薩摩金山蔵 | Ichikikushikino ⚠ |
| Shirakawa Shuzo | 白石酒造 | Hioki ⚠ |
| Wakamatsu Shuzo | 若松酒造 | Hioki ⚠ |
| Yamatozakura Shuzo | 大和桜酒造 | Hioki ⚠ |
| Tasaki Shuzo | 田崎酒造 | Ichikikushikino ⚠ |
| Matsuzaki Shuzo | 松﨑酒造 | Hioki ⚠ |
| Nangoku Shuzo | 南国酒造 | Hioki ⚠ |
| Satsuma Hamadaya Denbee | 薩州濵田屋伝兵衛 | Ichikikushikino ⚠ |
| Sata Souji Shoten | 佐多宗二商店 | Minamikyushu ⚠ |
| Sakurai Shuzo | 櫻井酒造 | Minamikyushu ⚠ |
| Satsuma Shuzo (Ei) | 薩摩酒造 頴娃蒸溜所 | Minamikyushu ⚠ |
| Satsuma Muso | さつま無双 | Kagoshima |
| Azuma Shuzo | 東酒造 | Kagoshima |
| Sanwa Shuzo | 三和酒造 | Kagoshima ⚠ |
| Sagara Shuzo | 相良酒造 | Kagoshima |

## Trampas
- ⚠ **El gremio agrupa por「エリア」, y sus áreas NO son municipios.**「伊集院」es
  un barrio de 日置市 (**Hioki**) pero la zona abarca también 市来 e 串木野, hoy
  **いちき串木野市 (Ichikikushikino)**;「知覧」es parte de 南九州市
  (**Minamikyushu**) desde 2007;「頴娃」también. **Cada municipio de esta tabla
  hay que confirmarlo uno a uno contra la web de la destilería** — el reparto de
  arriba es una propuesta, no la fuente.
- ⚠ **本坊酒造 鹿児島工場 ya está en el CSV** como Hombo Shuzo: no volver a
  proponerlo. Y ojo, tiene además 本坊酒造 小林工場 en Miyazaki (`miyazaki.md`) y
  la Mars Whisky de Nagano: es un grupo repartido por medio Japón. **Revisión
  2026-08-09:** la planta de Kobayashi queda retenida sin fila separada mientras
  no demuestre una identidad productora local autónoma; no es un cierre definitivo.
- ⚠ **三和酒造 (Kagoshima)** no es 三和酒造 (Shizuoka), en `shizuoka.md`. Mismo
  社名, una hace shochu y la otra sake.
- **Kanosuke Distillery (Hioki), ya en el CSV, es de 小正醸造**, que está en esta
  tabla: decidir si son una fila o dos (whisky y shochu, mismo grupo, mismo
  municipio).
- **相良酒造 (Kagoshima)** no es 相良酒造 (Tochigi), en `tochigi.md`.

## Qué falta
- **~104 destilerías del gremio sin listar**: esta tabla es la primera pantalla
  de 122. Las áreas de 出水, 加治木, 大隅, 鹿屋, 種子島 y **奄美** están sin tocar,
  y Amami es especial: es la única zona de Japón autorizada a hacer
  **黒糖焼酎** (shochu de azúcar moreno), con GI propia.
- Sin abrir: **かつお節 de Makurazaki** (la primera del país, con obradores
  familiares); 鹿児島黒豚 y 黒牛; **té de Kagoshima** (segunda de Japón tras
  Shizuoka y creciendo); さつまいも; 桜島小みかん y 桜島大根; あくまき.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 有限会社塗木製茶工場 | 有限会社塗木製茶工場 | 鹿児島県南九州市知覧町西元11713 | 有機加工食品 | 加工23号 |
| 宇都口農園 | １他 | 鹿児島県霧島市牧園町三体堂持山1998-1、1998-8、1998-26他 | 有機農産物 | 12号 |
| 有限会社小牧緑峰園 | １他 | 鹿児島県南さつま市金峰町大野原口3234他 | 有機農産物 | 168号 |
| 橋口農園（橋口典明） | １他 | 鹿児島県いちき串木野市湊町小字山口349-1他 | 有機農産物 | 40号 |
| 伊地知製茶 | 1　他 | 鹿児島県曽於市大隅町月野牛次郎9483-1他 | 有機農産物 | 176号 |
| 株式会社春日園川路製茶 | くわ１　他 | 鹿児島県日置市伊集院町中川597-1他 | 有機農産物 | 57号 |
| いぶすき農業協同組合茶業センター | いぶすき農業協同組合えい茶業センター | 鹿児島県南九州市頴娃町上別府1546 | 有機加工食品 | 加工9号 |
| 鹿児島製茶株式会社 | 鹿児島製茶株式会社錦江流通センター他 | 鹿児島県鹿児島市錦江町6番26号他 | 有機加工食品 | 加工4号 |
| 坂元醸造株式会社 | 第3工場　他 | 鹿児島県霧島市福山町福山3066-4　他 | 有機加工食品 | 加工32号 |
| ＪA南さつま知覧茶業センター | ＪA南さつま知覧茶業センター | 鹿児島県南九州市知覧町郡17285 | 有機加工食品 | 加工21号 |
| お茶工房　田中園 | お茶工房　田中園 | 鹿児島県出水市上大川内2704-30 | 有機加工食品 | 0605-B02 |
| クリンティかごしま株式会社 | 23 他 | 鹿児島県南九州市頴娃町上別府3820-7　他 | 有機農産物 | 66号 |
| 株式会社お茶の沢田園 | 株式会社お茶の沢田園 | 鹿児島県鹿児島市南栄3-11 | 有機加工食品 | 加工55号 |
| 山麓園 | 山麓園 | 鹿児島県熊毛郡屋久島町麦生335‐257　他 | 有機農産物 | 94号 |
| 株式会社　堀口園 | 株式会社堀口園本社工場　他 | 鹿児島県志布志市有明町野神字大堀3451-8　他 | 有機加工食品 | 加工1003号 |
| 折田園 | 1 他 | 鹿児島県南九州市知覧町西元上塚13251 他 | 有機農産物 | 71 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/kagoshima.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

**Ya integrado, no volver a proponer:** 薩摩酒造 ya está en `kagoshima.csv`; su cervecería de Makurazaki sería otra planta del mismo grupo.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/kagoshima.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: **3 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 枦川製茶 | 南九州市 | Té e infusiones | búsqueda dirigida + web propia | https://chiran-cha.jp/ | 知覧茶, 自園自製 |
| 仁田尾の知覧茶園 | 南九州市 | Té e infusiones | búsqueda dirigida + web propia | https://chirancha.jp/ | 知覧茶 |
| 美老園 | 鹿児島市 | Té e infusiones | búsqueda dirigida + web propia | https://birouen.com/ | ⚠ casa de té con 140 años; comprobar que elabora y no solo vende |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/kagoshima.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/kagoshima> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 昌徳丸 | 肝付町 | Pescado | https://www.tabechoku.com/producers/29410 | ニーズの高い大衆魚とは裏腹に、廃棄されることもある「未利用魚・低利用魚」がいることをご存じでしょうか？ |
| 【8000万年の叡智】幻の甑島鮮魚 | 薩摩川内市 | Pescado | https://www.tabechoku.com/producers/3077554 | 【8000万年の叡智】天下の一流寿司チェーン『スシロー』が惚れ込む幻の甑島ブランド鮮魚 |
| 【 村岡製茶 】知覧後岳銘茶 | 南九州市 | Té e infusiones | https://www.tabechoku.com/producers/23780 | ●知覧茶の中でも上級茶の産地とされる「後岳」 |
| 知覧心茶堂 | 南九州市 | Té e infusiones | https://www.tabechoku.com/producers/20087 | 良品質である事。良心である事。 |
| きくなが養鶏場 | 南九州市 | Carne | https://www.tabechoku.com/producers/22470 | 鳥刺し屋として創業40年・きくなが養鶏場では処理工程での安全と品質向上を図り独自の処理方法を確立してきました（吊り下げ式外剥ぎ）菊永方式。 |
| 種子島夢まるGaRDeN | 西之表市 | Carne | https://www.tabechoku.com/producers/25842 | 2023年　〜食べチョクアワード畜産部門　✨第4位✨入賞〜 |
| 鶴田養蜂場  (鶴田農園) | 指宿市 | Miel | https://www.tabechoku.com/producers/20842 | 鹿児島県指宿市で養蜂業を営む傍ら、フィンガーライムの栽培もしています。 |
| 高野養蜂場 | 鹿児島市 | Miel | https://www.tabechoku.com/producers/20327 | こんにちは。温暖な鹿児島の地で養蜂を営んでます。4月〜5月初旬までレンゲ蜜を5月中旬〜6月中旬まで百花蜜を採取してます。 |
| マルマメン工房 | 霧島市 | Legumbres | https://www.tabechoku.com/producers/62 | 私たちマルマメン工房は、鹿児島県霧島市霧島永水で農薬、化学肥料を使わず数種類の大豆や麦を栽培しています。 |
| 上場高原ビーフ | 出水市 | Condimentos | https://www.tabechoku.com/producers/29105 | コスモスがきれいに咲き誇る里で黒毛和種の雌牛を550頭飼育しています。徹底した牛への健康管理を心掛け、15年かけて完成したオリジナル飼料の配 |
| 三輪ファーム | 霧島市 | Conservas | https://www.tabechoku.com/producers/3078799 | 鹿児島県霧島市にて、バジルやその他の軟弱野菜を中心に農業を行っています。また、中山間地域の川原という地区で、自社で生産された作物をたっぷり使 |
| トカラnanairo | 十島村 | Dulces y repostería | https://www.tabechoku.com/producers/23732 | 日本最後の秘境と言われ、無垢の自然が色濃く残るトカラ列島（鹿児島県鹿児島郡十島村）で栽培した農産物（国産バナナ、島らっきょう、パッションフル |
| 自然放牧場　お多福たまご | 霧島市 | Huevos | https://www.tabechoku.com/producers/20160 | 餌・水・環境にとことんこだわり抜いた |
| 田口　純弘 | 南九州市 | Café | https://www.tabechoku.com/producers/26038 | 鹿児島県南九州市の開聞岳の見える大自然の中で、ブルーベリーとフィンガーライム、コーヒーの栽培をしています。 |
| さつまゆうすい農場　そのやま農園 | 湧水町 | Frutos secos | https://www.tabechoku.com/producers/29333 | 霧島連山の端っこ『栗野岳』を望む人口8,500人の小さな町ゆうすい町。 |
| みしま焼酎　無垢の蔵 | 三島村 | Destilados y licores | https://www.tabechoku.com/producers/23582 | こんにちは、みしま焼酎 無垢の蔵 杜氏の坂元です。 |
| 南九州ルバーブ農園 Red Sticks | 姶良市 | Pan y cereal | https://www.tabechoku.com/producers/26087 | 温暖な鹿児島で冷涼な気候を好むルバーブの栽培、特に国内では希少な赤いルバーブの栽培に力を入れております。青果だけでなく加工品の製造・販売も手 |
| 久米村農園 | 霧島市 | Pan y cereal | https://www.tabechoku.com/producers/3078723 | 錦江湾の奥の日当たりの良い温暖な気候の福山町は昔から美味しいミカンの産地です。70年以上前から両親は素晴らしいみかんを育てており、幼い頃から |
| うとさんち | 阿久根市 | Fruta y verdura | https://www.tabechoku.com/producers/23676 | 鹿児島県にて白いとうもろこし「雪やこんコーン」と、さつまいも「南国蜜芋」を栽培しています。 |
| 中尾農園 | 鹿児島市 | Fruta y verdura | https://www.tabechoku.com/producers/21342 | 2013年から温室ハウス内でのシャインマスカットの栽培を始め、2020年の夏から食べチョク様で販売させていただいています、お客様の声を直にい |
| さかうえ | 志布志市 | ⚠ por decidir | https://www.tabechoku.com/producers/22642 | さかうえは全スタッフの約半数が30代以下という第一次産業では珍しい企業体です。 |
| 中園ファーム | 西之表市 | ⚠ por decidir | https://www.tabechoku.com/producers/3078353 | 先祖代々受け継いだ土地で農業に励んでいます。 |
