# Nagasaki — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/nagasaki.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/nagasaki> (16 bodegas, leído 2026-08-04). Gremio: 長崎県酒造組合, <http://nagasaki-sake.sakura.ne.jp/>.
- Estado: cola abierta, 13 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`, salvo lo que se indique. El rōmaji de `nombre` y
`municipio` es propuesta a confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Imazato Shuzo | 今里酒造 | Hasami |
| Umegae Shuzo | 梅ケ枝酒造 | Sasebo |
| Senryu Shuzo | 潜龍酒造 | Sasebo |
| Nishimuta Shuzo | 西牟田酒造 | Sasebo |
| Fukuda Shuzo | 福田酒造 | Hirado |
| Mori Shuzojo | 森酒造場 | Hirado |
| Omoya Shuzo | 重家酒造 | Iki ⚠ |
| Kawachi Shuzo | 河内酒造 | Tsushima |
| Kinokawa | 杵の川 | Isahaya |
| Urakawa Shuzo | 浦川酒造 | Minamishimabara |
| Aimusume Shuzo | あい娘酒造 | Unzen |
| Ito Shuzojo | 伊藤酒造場 | Unzen |
| Kato Shuzojo | 加藤酒造場 | Shimabara ⚠ |

## Trampas
- ⚠ **La fuente sitúa 加藤酒造場 en 南高来郡有明町, que ya no existe**: se fusionó
  en 2006 en 島原市 (Shimabara). Escribir el nombre viejo deja la fila sin puerta
  geográfica (`AGENTS.md`). Ya visto en `tochigi.md`, `tokushima.md` y
  `fukuoka.md`: en Kyushu esta trampa es sistemática.
- ⚠ **壱岐 (Iki) es la cuna del 麦焼酎** y tiene Indicación Geográfica propia
  (壱岐焼酎). 重家酒造 hace las dos cosas: si su producto identitario es el
  shochu, la `categoria` es `Destilados y licores`, no `Sake`.
- **太田酒造場** aparece en la fuente **sin municipio**: resolver antes de
  escribir. Y no es 太田酒造 (Kusatsu, Shiga) ni 太田酒造場 (Wakasa, Tottori),
  ambas ya en esta carpeta.
- **La prefectura son 971 islas**: Iki, Tsushima y Hirado son áreas insulares a
  50-130 km de Nagasaki. Al geocodificar caerán lejos del centroide de la capital
  — es correcto, no un error que «corregir» moviendo `municipio`.

## Qué falta
- Las 3 bodegas restantes del censo, y **el gremio de shochu de Iki**, que es un
  frente aparte y con GI.
- Sin abrir: **カステラ** — Nagasaki es donde entró y hay casas de tres siglos
  (Fukusaya, Bunmeido y decenas de obradores pequeños), el frente más obvio;
  びわ (níspero, primera de Japón), 五島うどん y 五島の椿油, 島原そうめん,
  長崎和牛, あごだし (caldo de pez volador), 波佐見焼 (cerámica).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 長工醤油味噌協同組合 | 長工醤油味噌協同組合 | 長崎県大村市溝陸町815 | 有機加工食品 | 010409-001 |
| （有）手のべ陣川 | （有）手のべ陣川 | 長崎県南島原市北有馬町己564-1 | 有機加工食品 | JJ010322PR-0741-0 |
| 長崎有機農業研究会 | 溝田督史　上大峰　他 | 長崎県南島原市南有馬町己780、781-1.2、782-1　他 | 有機農産物 | AFASSEQ-AA-010301 |
| 農業法人夢有民農場有限会社 | 圃場1他 | 長崎県南島原市布津町坂下名船石原4669-66他 | 有機農産物 | SES-180322 |
| アリアケファーム（株） | アリアケファーム㈱　11 | 長崎県諫早市中央干拓11、12番地 | 有機農産物 | 2009F-5 |
| ひらどオーガニック | 栽培場他 | 長崎県平戸市前津古町字ナゴサ592－1他 | 有機農産物 | SES-25070101 |
| 農業法人有限会社きのこ屋 | 農業法人有限会社きのこ屋加工場 | 長崎県平戸市前津吉町605他 | 有機加工食品 | SEZ-26102901 |
| 有限会社グリーンティ五島 | 製茶工場他 | 長崎県五島市岐宿町岐宿2905番地2他 | 有機加工食品 | SEZ-28041881 |
| （有）お茶の秋月園 | お茶の秋月園工場 | 長崎県長崎市富士見町16-9 | 有機加工食品 | 1703-B01 |
| 長崎ＥＣＯＦ | １　他 | 長崎県雲仙市吾妻町大字永中名1307-1　他 | 有機農産物 | 1038号 |
| 株式会社雲仙きのこ本舗　有機エノキグループ | 株式会社雲仙きのこ本舗　有機エノキグループ | 長崎県南島原市有家町尾上3147　　他 | 有機農産物 | 420GM-1701 |
| 株式会社雲仙きのこ本舗　有機マイタケグループ | 株式会社雲仙きのこ本舗　有機マイタケグループ | 長崎県南島原市有家町尾上3147　　他 | 有機農産物 | 420GM-1703 |
| 農事組合法人ごとう茶生産組合 | 圃場1（コンカナ王国2）他 | 長崎県五島市上大津町蟹丁水2479-イ他 | 有機農産物 | SES-28041801 |
| ナチュラルファーミング合同会社 | 1　他 | 長崎県雲仙市吾妻町阿母名字大熊44-2　他 | 有機農産物 | 1193号 |
| 株式会社アイル　田平工場 | 株式会社アイル　田平工場 他 | 長崎県平戸市田平町小手田免419-1 他 | 有機加工食品 | SEZ-03042701 |
| ごと株式会社 | ごと　E1:51001他 | 長崎県五島市高田町1399他 | 有機農産物 | SES-04021801 |
| 有限会社北村製茶 | 圃場番号１ | 長崎県北松浦郡佐々町迎木場免４２５番地１８ | 有機農産物 | SES-04101902 |
| 百笑会プラス | 1　他 | 長崎県東彼杵郡波佐見町村木郷1687,1689,1685　他 | 有機農産物 | 2305-A01 |
| 雲仙農園 | 2　他 | 長崎県雲仙市吾妻町永中名永中道256番　他 | 有機農産物 | 42-01 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/nagasaki.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/nagasaki.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
- Estado: **3 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| ㈱山一 | 南島原市 | Pan y cereal | 全乾麺 | http://www.mennoyamaichi.co.jp/ | 手延べ干しめん |
| ㈲手のべ陣川 | 南島原市 | Pan y cereal | 全乾麺 | http://www.jin-men.com/ | 手延べ干しめん |
| ㈱小林甚製麺 | 南島原市 | Pan y cereal | 全乾麺 | http://www.kobayashijin.com/ | 手延べ干しめん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kyushu-okinawa/nagasaki.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/nagasaki> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 楓帆 | 佐々町 | Pescado | https://www.tabechoku.com/producers/28904 | 私たちは、長崎県佐世保市で漁業を営む漁師です。 |
| 中田水産 | 島原市 | Pescado | https://www.tabechoku.com/producers/24171 | 物心ついたころには船に乗り「I LOVE 有明海！」な漁師一本・3代目わかめ漁師の父のもとに生まれ、こだわりの強いその父と、それを支える母と |
| 長崎のイケメン漁師 坂野水産 | 平戸市 | Pescado | https://www.tabechoku.com/producers/24202 | 長崎県平戸市の自然豊かな海で |
| 百旬館 | 平戸市 | Pescado | https://www.tabechoku.com/producers/26553 | 新鮮な平戸の魚を新鮮なまま調理し、加工・販売し、より多くの方々に天然の味をもっと美味しくご賞味いただければ幸いです。 |
| あごだしのはたした | 新上五島町 | Pescado | https://www.tabechoku.com/producers/24753 | 「あご」とは、九州北部や日本海側で呼ばれる飛魚の呼称です。その由来は、あごが落ちるほど美味しい魚であるから、飛魚を「あご」と呼ぶようになった |
| 藤田製茶 | 東彼杵町 | Té e infusiones | https://www.tabechoku.com/producers/24770 | 私たちは「そのぎ茶」を生産しています。 |
| やまびこ農苑えぼし | 佐世保市 | Carne | https://www.tabechoku.com/producers/3078259 | 私達やまびこ農苑えぼしは、烏帽子岳の大自然の中で、障がいのある方たちと一緒に、動物福祉で鶏を飼い、農業（無農薬・無化学肥料）で作物を育ててい |
| 諫美豚 土井農場 | 諫早市 | Carne | https://www.tabechoku.com/producers/24893 | 株式会社土井農場の代表をしております土井賢一郎と申します。 |
| 花野果 | 新上五島町 | Dulces y repostería | https://www.tabechoku.com/producers/20934 | 長崎県・五島列島の小さな菓子工房「花野果」です。 |
| NaturalEggLab | 平戸市 | Huevos | https://www.tabechoku.com/producers/22332 | 「笑顔が広がる、しあわせの卵」 |
| 彩海ファームＭＡＳＡＫＡＺＵ | 佐世保市 | Pan y cereal | https://www.tabechoku.com/producers/27895 | 私たちは、先祖代々農業を営んでおり、みかんを始めお米、アスパラガスなどを栽培しています。旬で新鮮なとれたて野菜を皆様に食べていただき、本当の |
| アースカンパニー | 佐世保市 | Pan y cereal | https://www.tabechoku.com/producers/27498 | 2021年春、地元金融関係を退職後、農法に賛同いただいた地元で50年以上農業をやられている農家の方と一緒に、地球の未来を守るために土から作る |
| うーぞの農園 | 南島原市 | Pan y cereal | https://www.tabechoku.com/producers/25699 | 南島原市有家町にて、夫婦２人で農業を営んでいます。小さな農家ですが、お米や、季節の野菜をじぃじとばぁばで丹精込めて作っています。 |
| 本村製麺工場 | 南島原市 | Pan y cereal | https://www.tabechoku.com/producers/25458 | 私は島原半島の小さな町、西有家町で手延べ素麺を作っています。2005年11月から小麦粉の栽培を始めました。農業に関しては、ド素人でしたが、い |
| たぬき池自然農園 | 大村市 | Fruta y verdura | https://www.tabechoku.com/producers/25128 | 豊かな味わいのある野菜作りに専念しています |
| 宮下農園 | 諫早市 | Fruta y verdura | https://www.tabechoku.com/producers/25519 | 農業一筋70余年!! 長崎県諫早市森山町の宮下農園3代目  宮下清次郎と申します。 |
| のんびり山 | 諫早市 | Fruta y verdura | https://www.tabechoku.com/producers/20243 | のんびり山は長崎県と佐賀県の県境に位置し、日本一干満の差が大きな有明海と天然林や水源豊かな多良岳の麓で栽培期間中農薬や肥料を使わずに生姜・レ |
| ヨシダファーム | 諫早市 | Fruta y verdura | https://www.tabechoku.com/producers/26332 | 長崎県諫早市高来町で水稲を栽培しています。 |
| はまちゃんファーム | 雲仙市 | Fruta y verdura | https://www.tabechoku.com/producers/20159 | 雲仙の麓、山の中にある小さな農園です。 |
| 薄田自然農法ファーム | 佐世保市 | ⚠ por decidir | https://www.tabechoku.com/producers/48 | 自然農法を実行する為に、広島から長崎県佐世保市に引っ越してきました。 |
| 薬味屋人作 | 島原市 | ⚠ por decidir | https://www.tabechoku.com/producers/29558 | 上を見渡せば「普賢岳」。眼下には「有明海」。ミッションは食卓の笑顔を増やすことです。 |
| ファーム中島 | 諫早市 | ⚠ por decidir | https://www.tabechoku.com/producers/25225 | ▼自己紹介 |
