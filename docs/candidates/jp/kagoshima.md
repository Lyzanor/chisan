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
  la Mars Whisky de Nagano: es un grupo repartido por medio Japón.
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
| 宇都口製茶 | 宇都口製茶 | 鹿児島県霧島市牧園町三体堂1761-1 | 有機加工食品 | 加工1号 |
| 有限会社小牧緑峰園 | １他 | 鹿児島県南さつま市金峰町大野原口3234他 | 有機農産物 | 168号 |
| 橋口農園（橋口典明） | １他 | 鹿児島県いちき串木野市湊町小字山口349-1他 | 有機農産物 | 40号 |
| 伊地知製茶 | 1　他 | 鹿児島県曽於市大隅町月野牛次郎9483-1他 | 有機農産物 | 176号 |
| 株式会社春日園川路製茶 | くわ１　他 | 鹿児島県日置市伊集院町中川597-1他 | 有機農産物 | 57号 |
| いぶすき農業協同組合茶業センター | いぶすき農業協同組合えい茶業センター | 鹿児島県南九州市頴娃町上別府1546 | 有機加工食品 | 加工9号 |
| 有限会社古市製茶 | 有限会社古市製茶 | 鹿児島県南九州市川辺町永田1296-1 | 有機加工食品 | 加工37号 |
| 鹿児島製茶株式会社 | 鹿児島製茶株式会社錦江流通センター他 | 鹿児島県鹿児島市錦江町6番26号他 | 有機加工食品 | 加工4号 |
| 坂元醸造株式会社 | 第3工場　他 | 鹿児島県霧島市福山町福山3066-4　他 | 有機加工食品 | 加工32号 |
| ＪA南さつま知覧茶業センター | ＪA南さつま知覧茶業センター | 鹿児島県南九州市知覧町郡17285 | 有機加工食品 | 加工21号 |
| お茶工房　田中園 | お茶工房　田中園 | 鹿児島県出水市上大川内2704-30 | 有機加工食品 | 0605-B02 |
| クリンティかごしま株式会社 | 23 他 | 鹿児島県南九州市頴娃町上別府3820-7　他 | 有機農産物 | 66号 |
| 株式会社福山こめ酢 | 株式会社　福山こめ酢 | 鹿児島県霧島市福山町福山4115-1 | 有機加工食品 | 加工15号 |
| 株式会社お茶の沢田園 | 株式会社お茶の沢田園 | 鹿児島県鹿児島市南栄3-11 | 有機加工食品 | 加工55号 |
| 山麓園 | 山麓園 | 鹿児島県熊毛郡屋久島町麦生335‐257　他 | 有機農産物 | 94号 |
| 有限会社おりた園 | 有限会社おりた園 | 鹿児島県南九州市知覧町塩屋15712番地 | 有機加工食品 | 加工36号 |
| 株式会社　堀口園 | 株式会社堀口園本社工場　他 | 鹿児島県志布志市有明町野神字大堀3451-8　他 | 有機加工食品 | 加工1003号 |
| 折田園 | 1 他 | 鹿児島県南九州市知覧町西元上塚13251 他 | 有機農産物 | 71 |
