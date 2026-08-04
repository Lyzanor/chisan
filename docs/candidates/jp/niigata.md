# Niigata — candidatos

- CSV: `data/csv/jp/chubu/niigata.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: 新潟県酒造組合 vía <https://howtoniigata.jp/spot/nihonshu/40210/> — las 89 bodegas del gremio con marca y municipio. Contraste institucional: el mapa de la Agencia Tributaria, <https://www.nta.go.jp/about/organization/kantoshinetsu/sake/sake_breweries_map/pdf/sake_jp/sake_niigata_jp.pdf>.
- Estado: cola abierta, 91 sin integrar (2026-08-04). **Ninguna entró en el CSV**: cosechar el dominio de cada bodega es el trabajo previo.

Niigata es la prefectura con más bodegas de Japón. El listado da marca y
municipio pero **no web**: cada alta necesita localizar el dominio propio y
confirmar identidad, actividad y municipio. Solo-gremio sostiene `parcial`.

Categoría para todas: `Sake`. El rōmaji de `nombre` es propuesta a confirmar.

**Municipio en el CSV:** el listado usa barrios (新潟市西蒲区, 上越市柿崎区,
南魚沼市塩沢). El `municipio` correcto es la ciudad — `Niigata`, `Joetsu`,
`Minamiuonuma` — porque es lo que resuelve contra los centroides.

## 下越 Kaetsu (29)

| nombre (rōmaji propuesto) | 社名 | marca | municipio |
|---|---|---|---|
| Miyao Shuzo | 宮尾酒造 | 〆張鶴 Shimeharitsuru | Murakami |
| Taiyo Shuzo | 大洋酒造 | 大洋盛 Taiyozakari | Murakami |
| Omon Shuzo | 王紋酒造 | 王紋 Omon | Shibata |
| Kikusui Shuzo | 菊水酒造 | 菊水ふなぐち | Shibata |
| Fujinoi Shuzo | ふじの井酒造 | ふじの井 | Shibata |
| Kanemasu Shuzo | 金升酒造 | 金升 | Shibata |
| Echigozakura Shuzo | 越後桜酒造 | 越後桜 | Agano |
| Koshi Tsukano Shuzo | 越つかの酒造 | 越乃あじわい | Agano |
| Hakuryu Shuzo | 白龍酒造 | 白龍 | Agano |
| Kondo Shuzo | 近藤酒造 | 越乃鹿六 | Gosen |
| Kinshihai Shuzo | 金鵄盃酒造 | 越後杜氏 | Gosen |
| Kirinzan Shuzo | 麒麟山酒造 | 麒麟山 | Aga |
| Kaetsu Shuzo | 下越酒造 | 蒲原 Kambara | Aga |
| Murayu Shuzo | 村祐酒造 | 花越路 | Niigata (秋葉区) |
| Imayotsukasa Shuzo | 今代司酒造 | 今代司 | Niigata (中央区) |
| Ishimoto Shuzo | 石本酒造 | 越乃寒梅 Koshi no Kanbai | Niigata (江南区) |
| Shiokawa Shuzo | 塩川酒造 | 越の関 | Niigata (西区) |
| Higi Shuzo | 樋木酒造 | 鶴の友 | Niigata (西区) |
| Takano Shuzo | 高野酒造 | 越路吹雪 | Niigata (西区) |
| Echigo Denemon | 越後伝衛門 | 伝衛門 | Niigata (北区) |
| DHC Shuzo | DHC酒造 | 嘉山 | Niigata (北区) |
| Echigo Shuzojo | 越後酒造場 | 甘雨 | Niigata (北区) |
| LAGOON BREWERY | LAGOON BREWERY | 翔空 | Niigata (北区) |
| Takarayama Shuzo | 宝山酒造 | 宝山 | Niigata (西蒲区) |
| Mine no Hakubai Shuzo | 峰乃白梅酒造 | 峰乃白梅 | Niigata (西蒲区) |
| Echigo Tsurukame | 越後鶴亀 | 越後鶴亀 | Niigata (西蒲区) |
| Sasaiwai Shuzo | 笹祝酒造 | 笹祝 | Niigata (西蒲区) |
| Asazuma Shuzo | 朝妻酒造 | 雪乃幻 | Niigata (西蒲区) |
| Yahiko Shuzo | 弥彦酒造 | 彌彦 Yahiko | Yahiko |

## 中越 Chuetsu (35)

| nombre (rōmaji propuesto) | 社名 | marca | municipio |
|---|---|---|---|
| Asahi Shuzo | 朝日酒造 | 久保田 Kubota | Nagaoka |
| Hakuro Shuzo | 柏露酒造 | 越乃柏露 | Nagaoka |
| Takahashi Shuzo | 高橋酒造 | 長陵 | Nagaoka |
| Yoshinogawa | 吉乃川 | 極上吉乃川 | Nagaoka |
| Hasegawa Shuzo | 長谷川酒造 | 越後雪紅梅 | Nagaoka |
| Ofuku Shuzo | お福酒造 | お福正宗 | Nagaoka |
| Onda Shuzo | 恩田酒造 | 舞鶴 | Nagaoka |
| Koshi Meijo | 越銘醸 | 越の鶴 | Nagaoka |
| Morohashi Shuzo | 諸橋酒造 | 越乃景虎 | Nagaoka |
| Suminoi Shuzo | 住乃井酒造 | 住乃井 | Nagaoka |
| Nakagawa Shuzo | 中川酒造 | 越乃白雁 | Nagaoka |
| Kawachu Shuzo | 河忠酒造 | 想天坊 | Nagaoka |
| Sekihara Shuzo | 関原酒造 | 群亀 | Nagaoka |
| Tochikura Shuzo | 栃倉酒造 | 米百俵 | Nagaoka |
| Kusumi Shuzo | 久須美酒造 | 亀の翁 | Nagaoka |
| Ikeura Shuzo | 池浦酒造 | 和楽互尊 | Nagaoka |
| Masukagami | マスカガミ | 萬寿鏡 | Kamo |
| Kamonishiki Shuzo | 加茂錦酒造 | 加茂錦 | Kamo |
| Yukitsubaki Shuzo | 雪椿酒造 | 越乃雪椿 | Kamo |
| Fukugao Shuzo | 福顔酒造 | 福顔 | Sanjo |
| Niigata Meijo | 新潟銘醸 | 越の寒中梅 | Ojiya |
| Takanoi Shuzo | 高の井酒造 | 田友 | Ojiya |
| Midorikawa Shuzo | 緑川酒造 | 緑川 | Uonuma |
| Tamagawa Shuzo | 玉川酒造 | 魚沼玉風味 | Uonuma |
| Aoki Shuzo | 青木酒造 | 鶴齢 Kakurei | Minamiuonuma (塩沢) |
| Hakkai Jozo | 八海醸造 | 八海山 Hakkaisan | Minamiuonuma |
| Takachiyo Shuzo | 髙千代酒造 | 髙千代 | Minamiuonuma |
| Shirataki Shuzo | 白瀧酒造 | 上善如水 Jozen Mizu no Gotoshi | Yuzawa |
| Matsunoi Shuzojo | 松乃井酒造場 | 松乃井 | Tokamachi |
| Uonuma Shuzo | 魚沼酒造 | 天神囃子 | Tokamachi |
| Naeba Shuzo | 苗場酒造 | 苗場山 | Tsunan |
| Tsunan Jozo | 津南醸造 | 霧の塔 | Tsunan |
| Hara Shuzo | 原酒造 | 越の誉 | Kashiwazaki |
| Abe Shuzo | 阿部酒造 | 越乃男山 | Kashiwazaki |
| Ishizuka Shuzo | 石塚酒造 | 姫の井 | Kashiwazaki |

## 上越 Joetsu (20)

| nombre (rōmaji propuesto) | 社名 | marca | municipio |
|---|---|---|---|
| Takeda Shuzoten | 竹田酒造店 | かたふね Katafune | Joetsu (大潟区) |
| Koyama Shuzoten | 小山酒造店 | 越後自慢 | Joetsu (大潟区) |
| Musashino Shuzo | 武蔵野酒造 | スキー正宗 | Joetsu |
| Tanaka Shuzo | 田中酒造 | 能鷹 | Joetsu |
| Myoko Shuzo | 妙高酒造 | 妙高山 | Joetsu |
| Maruyama Shuzojo | 丸山酒造場 | 雪中梅 Setchubai | Joetsu (三和区) |
| Kubiki Shuzo | 頚城酒造 | 久比岐 | Joetsu (柿崎区) |
| Yoyogiku Jozo | 代々菊醸造 | 吟田川 Chidakara | Joetsu (柿崎区) |
| Kato Shuzo | 加藤酒造 | 清正 | Joetsu (吉川区) |
| Yoshikawa Toji no Sato | よしかわ杜氏の郷 | よしかわ杜氏 | Joetsu (吉川区) |
| Joetsu Shuzo | 上越酒造 | 越後美人 | Joetsu |
| Niigata Daiichi Shuzo | 新潟第一酒造 | 越の白鳥 | Joetsu (浦川原区) |
| Ayamasamune Shuzo | 鮎正宗酒造 | 鮎正宗 | Myoko |
| Kiminoi Shuzo | 君の井酒造 | 君の井 | Myoko |
| Chiyonohikari Shuzo | 千代の光酒造 | 千代の光 | Myoko |
| Kaganoi Shuzo | 加賀の井酒造 | 加賀の井 | Itoigawa |
| Ikedaya Shuzo | 池田屋酒造 | 謙信 Kenshin | Itoigawa |
| Tahara Shuzo | 田原酒造 | 雪鶴 | Itoigawa |
| Watanabe Shuzoten | 渡辺酒造店 | 根知男山 Nechi Otokoyama | Itoigawa |
| Inomata Shuzo | 猪又酒造 | 月不見の池 | Itoigawa |

## 佐渡 Sado (5)

| nombre (rōmaji propuesto) | 社名 | marca | municipio |
|---|---|---|---|
| Obata Shuzo | 尾畑酒造 | 真野鶴 Manotsuru | Sado |
| Hokusetsu Shuzo | 北雪酒造 | 北雪 | Sado |
| Henmi Shuzo | 逸見酒造 | 真稜 | Sado |
| Tenryohai Shuzo | 天領盃酒造 | 天領盃 | Sado |
| Kato Shuzoten | 加藤酒造店 | 金鶴 Kintsuru | Sado |

## Fuera del sake (2, del listado aportado 2026-08-04)

De `listado_125_productores_locales_japon.xlsx`. Sus otras 12 filas de Niigata
(Taiyo, Hakuryu, Miyao, Omon, Echigozakura, Koshitsukano, Kikusui, Fujinoi,
Kanemasu, Kondo, Kinshihai, Kirinzan) **ya estaban en la tabla de arriba**:
misma fuente, el gremio.

| nombre | municipio | categoría | A/B | web |
|---|---|---|---|---|
| Yukiguni Maitake | Minamiuonuma | Setas | A | maitake.co.jp ⚠ cotizada, cultivo industrial: candidata a descarte por masa |
| Echigo Beer | Niigata | Cerveza | B | echigobeer.com |

## Trampas vistas
- **Dos 加藤 distintos**: 加藤酒造 (清正, Joetsu) y 加藤酒造店 (金鶴, Sado). Y dos
  中川/中谷-style homónimos más en la lista: casar por marca, no por apellido.
- Nagaoka concentra 16 bodegas y Joetsu 12; al geocodificar, varias caerán en la
  banda de aviso 15-100 km porque son municipios enormes tras las fusiones Heisei
  (ya avisado en `docs/CSV_CONTRACT.md`). Leer el aviso antes de tocar `municipio`.
- El listado turístico dice 89 y el gremio contaba 88 en 2022: la diferencia son
  altas recientes (LAGOON BREWERY es de 2021). No cuadrar cifras a ciegas.

## Qué falta
- Ningún dominio recogido: es el primer trabajo de cada lote.
- Fuera del sake, sin abrir: arroz Koshihikari, 笹団子, 麹/miso, pescado de Sado.
