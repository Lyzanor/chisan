# Fukushima — candidatos

- CSV: `data/csv/jp/tohoku/fukushima.csv` (74 filas tras la revisión integral de 2026-08-11).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/fukushima> (63 bodegas, leído 2026-08-04). Gremio: 福島県酒造協同組合, <http://www.sake-fukushima.jp/>.
- Estado: **9 integradas** el 2026-08-04 (7 `verificado`, 2 `parcial`); quedan 8 de la tabla y ~46 del censo. Evidencia en `data/evidence/jp/tohoku/fukushima.jsonl`.

Fukushima es la prefectura con más oros del 全国新酒鑑評会 de la última década:
el pool de bodegas con marca y tienda propia es de los mejores del país.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

## Trampas
- **大七酒造 (Daishichi, Nihonmatsu)** ya está publicado como
  `daishichi-sake-brewery-nihonmatsu`: no volver a proponerlo como alta nueva.
- **豊國酒造 (Furudono, 石川郡) y 豊国酒造 (Aizubange, 河沼郡) son dos empresas
  distintas** que solo se diferencian en un kanji (國/国). No fusionar filas.
- **榮川酒造株式会社 (Bandai) y 榮川酒造合資会社 (Minamiaizu)**: misma trampa, la
  forma societaria es lo único que las separa en el listado.
- 会津 se reparte en muchos municipios de nombre parecido — 会津若松市,
  会津坂下町, 会津美里町, 南会津町 — y el `municipio` no es «Aizu».
- La franja costera (いわき, y los municipios evacuados tras 2011) exige evidencia
  reciente de actividad: aquí «sigue abierta» no es un trámite.

## Qué falta
- Las ~40 bodegas restantes del censo.
- Sin abrir: melocotón de Fukushima (segunda de Japón), 会津の味噌・醤油,
  きゅうり/アスパラ, 喜多方ラーメン, 会津本郷焼 (no alimentario).

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 19 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| あいづ有機農法生産組合 | 横山歩 2 | 福島県会津若松市神指町榎木檀24 | 有機農産物 | JS000828FA-2041 |
| 渡部よしの | 1　他 | 福島県喜多方市山都町三津合字千咲原5846-65　他 | 有機農産物 | S-141 |
| やまろく米出荷協議会 | 安斎正代　１ 他 | 福島県二本松市渋川字神社前19　他 | 有機農産物 | AFASSEQ-AA-000903 |
| 日本果実加工株式会社　白河工場 | 日本果実加工株式会社　白河第2工場、第3工場　他 | 福島県白河市東深仁井田字道山2-4　他 | 有機加工食品 | MPJP1428-01 |
| 山吉青果食品株式会社　桑折工場 | 山吉青果食品株式会社　桑折工場 | 福島県伊達郡桑折町大字万正寺字宮ノ西1-1 | 有機加工食品 | 第1167号 |
| ＦＥＮネット | 五十嵐正康　ほ場1　他 | 福島県河沼郡会津坂下町大字坂本字大沢71-1、72　他 | 有機農産物 | 2001F-20 |
| ゆうきの会 | 大竹久雄 ほ場4 他 | 福島県喜多方市熱塩加納町米岡字上野前8 他 | 有機農産物 | 2005F-13 |
| 自然農法風の会 | 農業法人（有）自然農法無の会 ほ場103 他 | 福島県大沼郡会津美里町松沢字中原292 他 | 有機農産物 | 2001F-1 |
| 農園　やいこばあちゃん　大平周一 | 岡下　他 | 福島県石川郡石川町大字南山形字羽貫田387Ｋ　他 | 有機農産物 | 福島県認定第9号 |
| 会津自然塾　代表者 鹿野義治 | 鹿野敏子 自宅前畑①　他 | 福島県大沼郡会津美里町字高田前川原3478　他 | 有機農産物 | 福島県認証第6号 |
| 三坂　勲 | 10 菅田100　他 | 福島県相馬郡飯舘村臼石字菅田100　他 | 有機農産物 | 福島県認定第4号 |
| 菊地浩美 | 山田第一ほ場 | 福島県双葉郡双葉町山田字北田6 | 有機農産物 | 福島県認定第14号 |
| かぼちゃランド若月　若月芳則 | 酒田有機圃場 | 福島県双葉郡浪江町大字酒田字原131 | 有機農産物 | 福島県認定第13号 |
| 髙橋庄作酒造店　髙橋庄作 | 試験田　他 | 福島県会津若松市門田町大字一ノ堰字羽黒46 他 | 有機農産物 | 福島県認定第19号 |
| 相馬有機推進の会　若松清一 | 前の田上　他 | 福島県相馬市山上字堀坂73-2　他 | 有機農産物 | 福島県認定第24号 |
| 成田有機農園　成田 守 | 上の水田の西　他 | 福島県郡山市日和田町字鶴見坦128　他 | 有機農産物 | 福島県認定第27号 |
| ゆず太郎の郷　松本広行 | 柚子南　他 | 福島県双葉郡楢葉町大字井出字槻26　他 | 有機農産物 | 福島県認証第43号 |
| 猪苗代ブルーベリーれいちゃん農場　野矢 健正 | ブルーベリー園１ | 福島県耶麻郡猪苗代町大字川桁字林口2 | 有機農産物 | 福島県認定第47号 |
| アクツフーズ(株) | アクツフーズ（株）第一工場・倉庫　他 | 福島県石川郡古殿町竹貫字千足52・54・56　他 | 有機加工食品 | JA090915PR-1087-0 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/fukushima.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión 2026-08-11; **1 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 清水産業 (猪苗代ビール) | Inawashiro | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/fukushima.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/fukushima.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
- Estado: revisión 2026-08-11; **1 retenidos** en la segunda pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| ㈱あらい屋製麺所 | 郡山市 | Pan y cereal | 全乾麺 | http://www.araiya.net/ | 機械製乾めん; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |

## Nuevos candidatos de cerveza artesana — barrido 2026-08-13

Barrido sistemático de microcervecerías artesanales independientes con obrador propio, marca activa, presencia web y redes sociales. Categoría: `Cerveza`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Instagram | Notas de producción |
|---|---|---|---|---|---|---|

## Nuevos candidatos de pescado y marisco artesanal — barrido 2026-08-14

Barrido sistemático de productores, elaboradores y transformadores artesanos de pescado y marisco de Fukushima con instalaciones productivas propias, marca activa y venta/presencia web directa. Categoría: `Pescado`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Descripción / Especialidad | Fuente |
|---|---|---|---|---|---|---|
| **飯塚水産 (Iizuka Suisan)** | 株式会社飯塚水産 | `相馬市` | Pescado | https://iizukasuisan.com/ |Elaborador pesquero del puerto de Haragama en Soma; procesado artesanal de chanquetes hervidos al punto de sal (kamaage shirasu) y pescados planos de Joban-mono. ⚠ Reviewed 2026-08-14: hold; the proposed domain is invalid, mismatched or insufficient and no current source yet establishes every admission claim.| Web oficial / Asociación pesquera de Soma Haragama |
