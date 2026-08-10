# Toyama — candidatos

- CSV: `data/csv/jp/chubu/toyama.csv` (5 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/toyama> (20 bodegas, leído 2026-08-04). Gremio: 富山県酒造組合, <http://www.toyama-sake.or.jp/>.
- Estado: **5 integradas** el 2026-08-05, todas `verificado`; quedan 9 de la tabla. Evidencia en `data/evidence/jp/chubu/toyama.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Tamaasahi Shuzo | 玉旭酒造 | Toyama |
| Fukutsuru Shuzo | 福鶴酒造 | Toyama |
| Kiyoto Shuzojo | 清都酒造場 | Takaoka |
| Ginban Shuzo | 銀盤酒造 | Kurobe |
| Kuroda Shuzo | 黒田酒造 | Oyabe |
| Narimasa Shuzo | 成政酒造 | Nanto |
| Chiyozuru Shuzo | 千代鶴酒造 | Namerikawa |
| Hongo Shuzo | 本江酒造 | Uozu |
| Hayashi Shuzojo | 林酒造場 | Asahi ⚠ |

## Integradas 2026-08-05 (5) — todas verificado

| bodega | municipio | resultado |
|---|---|---|
| Masuda Shuzoten (Masuizumi) | Toyama | verificado · sin carrito |
| Fumigiku Shuzo (Haneya) | Toyama | verificado · sin carrito |
| Tateyama Shuzo | Tonami | verificado · sin carrito |
| Sanshoraku Shuzo | Nanto | verificado · sin carrito |
| Takazawa Shuzojo | Himi ⚠ | verificado · sin carrito |

⚠ **高澤酒造場 perdió su kura en el terremoto de Noto de enero de 2024** y está
reconstruyendo con micromecenazgo. Sigue activa, así que no es purga, pero es el
mismo aviso que las bodegas de Wajima en `ishikawa.md`: aquí «sigue abierta»
exige evidencia reciente y hay que revisarla en la próxima pasada.

- **Ninguna de las cinco publica carrito.** Toyama es, de las prefecturas
  recorridas, la que menos venta directa tiene: cinco de cinco sin tienda.
- **El gremio de Toyama no publica dominios**, al contrario que el de Yamagata:
  sus páginas `/pages/NN/` dan el listado de socios y los datos de la propia
  asociación, no la ficha con web de cada bodega.
- **`tateyamabrewing.jp` no casa con el nombre de la empresa**; se confirmó que
  es suyo por el registro de empresas del ayuntamiento de Tonami.

## Trampas
- ⚠ **朝日町 (Asahi)**: hay municipios llamados Asahi en Toyama, Yamagata, Nagano,
  Mie y Aichi. El de esta fila es 下新川郡朝日町 (Toyama). Comprobar que el
  centroide que resuelve es el de esta prefectura antes de fiarse del gate.
- **三笑楽 y 成政 comparten municipio (Nanto)**, resultado de una fusión Heisei que
  se comió 城端町 y 福光町: la dirección histórica de sus webs puede llevar el
  nombre viejo, que ya no resuelve.

## Qué falta
- Las 6 bodegas restantes del censo.
- Sin abrir: **鱒寿司 (masuzushi) de Toyama**, que tiene decenas de obradores
  artesanos y hasta gremio propio — el frente más claro de la prefectura;
  白えび y ホタルイカ (marisco de la bahía), 昆布〆, 干し柿 de Nanto.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 長岡　功 | １　他 | 富山県富山市八尾町舘本郷600-1　他 | 有機農産物 | A－05－0060 |
| 前佛明夫 | 1他 | 富山県滑川市上梅沢136　他 | 有機農産物 | A－03－0041 |
| （株）ウメケン　富山工場 | （株）ウメケン　富山工場 | 富山県富山市婦中町板倉532-1 | 有機加工食品 | JU041207PR-0820-0 |
| Nビバレッジ株式会社 | Nビバレッジ株式会社 | 富山県下新川郡朝日町平柳500 | 有機加工食品 | O-3 |
| 有限会社　小原営農センター | コバ宮　他 | 富山県富山市小羽1412//6　他 | 有機農産物 | NA-07032902 |
| (株)ウメケン | (株)ウメケン　富山工場 | 富山県富山市婦中町板倉532-1　他 | 有機加工食品 | NB-09022616、NC-09022624 |
| ビー＆ベッチ | 西島　守　ほ場2　他 | 富山県富山市下大久保110　他 | 有機農産物 | 2010F-1 |
| 中田和浩 | １他 | 富山県滑川市上梅沢103，104　他 | 有機農産物 | A-03-0042 |
| 日本オリゴ株式会社 | 日本オリゴ株式会社 | 富山県南砺市泉沢588 | 有機加工食品 | JU041207PR-1289-1 |
| 株式会社ライスヒル | １他 | 富山県下新川郡入善町神林４４１－１　他 | 有機農産物 | A-05-0059 |
| 森沢　勇 | 1 他 | 富山県富山市善名62　他 | 有機農産物 | S-268 |
| 和田農産株式会社 | ハト麦若葉加工場 | 富山県小矢部市石坂337 | 有機加工食品 | 2018M-2 |
| 株式会社ＴＡＧＯＳＡＫＵ | 1 | 富山県下新川郡朝日町浜草野258 | 有機農産物 | A-18-104 |
| 合同会社　地創研 | 簔口　潔　ほ場１　他 | 富山県南砺市田尻263-1 | 有機農産物 | 2020Ｆ-4 |
| （有）Trinity 石田淳悦 | 1　他 | 富山県富山市月岡町6丁目1366　他 | 有機農産物 | S-039 |
| 株式会社匠美 | 株式会社 匠美 坂井沢豆乳工場 | 富山県中新川郡立山町坂井沢154-1 | 有機加工食品 | 21-077B |
| 株式会社食養の杜とやま | 株式会社食養の杜とやま　射水工場 | 富山県射水市今開発195番地 | 有機加工食品 | B-23-0009 |
| 株式会社森の環 | 株式会社森の環 | 富山県砺波市本小林6, 高岡市葦附1239-22, 射水市串田112-1 | 有機農産物 | 2223-801-00 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/toyama.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 宇奈月ビール | Kurobe | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/toyama.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/toyama.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: **6 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 山岸ちまき本舗 | 氷見市 | Dulces y repostería | 和菓子協会 | http://www.chimaki-hompo.jp/ | 氷見市十二町 3799-2 |
| 引網香月堂 | 高岡市 | Dulces y repostería | 和菓子協会 | http://www.hikiami.co.jp/ | 高岡市伏木湊町 1-1 |
| 日の出屋製菓産業株式会社 | 南砺市 | Aperitivos | 全国米菓工業組合 | https://www.hinodeya-seika.com/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）、その他（米菓を含むコメ加工品製造・販売等） |
| 株式会社丸米製菓 | 南砺市 | Aperitivos | 全国米菓工業組合 | https://maru-yonezo.com/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |
| 株式会社赤坂柿山 | 南砺市 | Aperitivos | 全国米菓工業組合 | https://www.kakiyama.com/ | 米菓製造・販売業（直売所有り） |
| 株式会社北越 | 砺波市 | Aperitivos | 全国米菓工業組合 | https://hokuetu.co.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り） |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/toyama.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/toyama> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| メカニックファーム | 南砺市 | Pescado | https://www.tabechoku.com/producers/3078430 | 弊社は富山県南砺市で主にさつまいもを栽培しております。 |
| 農家　信 | 南砺市 | Pescado | https://www.tabechoku.com/producers/27511 | はじめまして農家信代表の山腰です。私は干柿産地の有名な富山県南砺市で2021年に農家として独立し、あんぽ柿を生産、加工、販売をしております。 |
| ″旨いを届ける″　聖徳丸 | 朝日町 | Pescado | https://www.tabechoku.com/producers/21261 | 天然の生簀＊富山湾で漁師をしている |
| TOYAMA 8008 やおや | 富山市 | Té e infusiones | https://www.tabechoku.com/producers/21402 | 弊社は、造園屋さんや飲料メーカーなどから排出される枝草や茶カスなどの産業廃棄物を受け入れ、堆肥や培土を製造している会社です。 |
| 悠牧豚 | 富山市 | Carne | https://www.tabechoku.com/producers/20666 | 北陸初、放牧型の養豚事業を夫婦でしています。農福連携事業の一環で設立、生産から販売、プロデュースも行っています。全国植樹祭の出展やANA国際 |
| 富山福舞本舗 | 富山市 | Setas | https://www.tabechoku.com/producers/20415 | 私たちは富山県八尾町できくらげを菌床から国産にこだわり建屋内でハウス栽培を行い農薬薬品を使わず新鮮肉厚純国産きくらげを栽培しております。一つ |
| 松田 　貴志 | 砺波市 | Setas | https://www.tabechoku.com/producers/28785 | 東京から富山へUターンをし、家業でもある170年以上の歴史ある富山県特産の「大門素麺」を継ぐ事にしました。しかし、「大門素麺」は冬のみしか作 |
| 八百万屋（もりのわ） | 高岡市 | Setas | https://www.tabechoku.com/producers/22154 | きのこ栽培用の菌床製造から、きのこの栽培・販売を一貫体制で行っています。 |
| ハニーオアシス | 小矢部市 | Miel | https://www.tabechoku.com/producers/21794 | 元々、兵庫県芦屋市にて、蜂蜜専門店を夫婦で営んでいましたが、こだわり抜いた蜂蜜を自ら採蜜するため、主人が一人、15年ほど前に富山に単身移住し |
| 中山農産 | 高岡市 | Legumbres | https://www.tabechoku.com/producers/23183 | お米、ハトムギを中心に人参、里芋、枝豆、キャベツ、大根、エゴマなどの野菜を生産販売しています。 |
| 速川活性化協議会 | 氷見市 | Conservas | https://www.tabechoku.com/producers/25756 | 平成27年に速川地区の活性化を目的に設立されたNPO法人です。主な活動としては、耕作放棄地を利用して年間10トンにも及ぶさつまいもの栽培や、 |
| 富山のたまご屋　仁光園 (にこうえん) | 高岡市 | Huevos | https://www.tabechoku.com/producers/3077849 | はじめまして、富山のたまご屋 仁光園（にこうえん）です。 |
| やまふじぶどう園 | 富山市 | Vino | https://www.tabechoku.com/producers/3078801 | 100年続く富山の葡萄園&ワイナリー。 |
| FUNFARMのづみ野 | 富山市 | Pan y cereal | https://www.tabechoku.com/producers/20432 | わたしたちFUN FARM のづみ野は、富山市八尾町の自然豊かな山あいの中で、「おいしく、安心して食べられるということ」をテーマに米や野菜、 |
| KOWA CO., LTD. | 富山市 | Pan y cereal | https://www.tabechoku.com/producers/3078529 | 富山で七代続く家族が中心の米農家です。 |
| AGUMOGU | 富山市 | Pan y cereal | https://www.tabechoku.com/producers/3077292 | AGUMOGU(あぐもぐ)は、お客様が安心して食べられるお米を作り、健康と環境に優しい持続可能な農業に取り組んでおります。 |
| 太田果樹園 | 富山呉羽の梨 | 富山市 | Fruta y verdura | https://www.tabechoku.com/producers/3079200 | 1980年頃に先代が開園した農園で、有機質肥料にこだわり呉羽梨を大切に育てています。当園の自慢は、樹上でじっくり甘みを引き出した「樹上完熟」 |
| 氷見キウイランド | 高岡市 | Fruta y verdura | https://www.tabechoku.com/producers/3079140 | 2019年より富山県氷見市赤毛で土づくりから始め、10数種の特色のあるキウイフルーツの栽培をしております。自然への感謝と生産者の誇りを胸に、 |
| bossa farm | 黒部市 | Fruta y verdura | https://www.tabechoku.com/producers/26528 | ボッサファームは立山連峰のミネラル豊富な水が流れる扇状地黒部市で、ぶどうの生産・加工・販売を行っている直売農家です。草を刈って肥料とする草生 |
| 土遊野 | 富山市 | ⚠ por decidir | https://www.tabechoku.com/producers/20012 | 土遊野紹介動画 |
| 竹田牧場 | 富山市 | ⚠ por decidir | https://www.tabechoku.com/producers/26572 | こんにちは！竹田牧場長の竹田です。 |
| tateyama breeze | 立山町 | ⚠ por decidir | https://www.tabechoku.com/producers/28440 | 『毎日食べるものだからこそ安全・安心を』 |
