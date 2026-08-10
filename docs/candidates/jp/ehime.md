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
