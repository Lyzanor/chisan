# Kioto — candidatos

- CSV: `data/csv/jp/kansai/kyoto.csv`.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/kyoto> (51 bodegas, leído 2026-08-04). Gremio: 京都府酒造組合, <http://kyoto-sake.sakura.ne.jp>.
- Estado: **8 integradas** el 2026-08-05, todas `verificado`, 5 con tienda propia. Evidencia en `data/evidence/jp/kansai/kyoto.jsonl`.

Kioto es la segunda zona sakera de Japón por volumen (Fushimi), y el CSV solo
tiene tres bodegas. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Koyama Honke Shuzo | 小山本家酒造 | Kyoto ⚠ |

## Trampas
- ⚠ **小山本家酒造** tiene su sede en **さいたま市 (Saitama)** — está en
  `saitama.md` — y en Fushimi opera una planta. Si la unidad de Kioto no tiene
  marca e identidad propias, la fila correcta es la de Saitama, no ésta
  (`docs/EDITORIAL.md`, grupos). **Revisada 2026-08-09:** se retiene por
  esa duda de identidad de planta; no es un descarte definitivo.
- **伏見 (Fushimi) es un 区 de la ciudad de Kioto**, no un municipio: la fila lleva
  `Kyoto`. Lo mismo que ya se resolvió para Uji y las casas de té del CSV.
- **月桂冠 y 黄桜** son grupos grandes con distribución nacional: entran por
  terroir e identidad propia, no se descartan por tamaño, pero conviene decidirlo
  explícitamente y no por inercia.
- **木下酒造 (Kyotango, marca 玉川)** no es 木下醸造所 (Taragi, Kumamoto), que está
  en `kumamoto.md`.
- 京丹後市 y 宮津市 son el **norte marítimo** (Tango), a 100 km de Fushimi: no
  asumir que «Kioto» es la ciudad al geocodificar.

## Qué falta
- Las ~36 bodegas restantes del censo.
- El CSV de Kioto ya cubre bien té (Uji), condimentos y dulces. Sin abrir:
  **京野菜** (verdura tradicional con marca propia y productores identificables),
  湯葉/豆腐, 京漬物 más allá de las dos casas ya presentes, y **sake de Tango**,
  que es una zona distinta de Fushimi y no aparece en el CSV.

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 17 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| （有）　中井製茶場 | （有）　中井製茶場 | 京都府相楽郡和束町中市場14-1 | 有機加工食品 | JN70725PR-0101-0 |
| 京都飲料株式会社 | 京都飲料株式会社 | 京都府京都市南区久世東土川町265 | 有機加工食品 | 02-026B |
| （株）福寿園　山城工場 | （株）福寿園　山城工場 | 京都府木津川市山城町上狛東作り道11-1 | 有機加工食品 | JF001010PR-0173-0 |
| 大洋産業株式会社 | 大洋産業（株） | 京都府宇治市大久保町平盛71-1 | 有機加工食品 | 06B-008 |
| (株)播磨園製茶 | 大川碾茶工場 | 京都府綴喜郡宇治田原町南高座1 | 有機農産物 | JH010130FA-0241-0 |
| 株式会社玉屋珈琲店 | （株）玉屋珈琲店 | 京都府京都市中京区堺町通蛸薬師下ル菊屋町520 | 有機加工食品 | 02-024B 02-013C |
| 永谷茶業株式会社 | 永谷茶業（株） | 京都府綴喜郡宇治田原町湯屋谷東塩谷58 | 有機加工食品 | 01B-026 |
| 株式会社松北園茶店 | （株）松北園茶店　他 | 京都府宇治市木幡東中8　他 | 有機加工食品 | JS90401PR-0200-0 |
| 日本タブレット株式会社 | 日本タブレット株式会社　第１工場　他 | 京都府宇治市槇島町目川149-1　他 | 有機加工食品 | 第1269号 |
| 中西義明 | 株式会社中西豊文園 11 他 | 京都府京都市伏見区向島鷹場町140、141 他 | 有機農産物 | 2007F-5 |
| 株式会社マエダ・スーパー・テクノ | 株式会社マエダ・スーパー・テクノ本社工場　他 | 京都府久世郡久御山町森川端17-1　他 | 有機加工食品 | 05B-003 |
| 京都やましろ農業協同組合 | 京都やましろ農業協同組合茶直売所 | 京都府綴喜郡宇治田原町郷ノ口中林12 | 有機加工食品 | 04B-009 |
| 共栄製茶株式会社 | 共栄製茶株式会社　宇治東山工場　他 | 京都府宇治市小倉町東山34　他 | 有機加工食品 | JK970407PR-0229-0 |
| (有)永田茶園 | (有)永田茶園 第一工場 | 京都府綴喜郡宇治田原町湯屋谷上西谷42 | 有機加工食品 | JN951221PR-0243-0 |
| 株式会社宇治香園　本社工場 | 株式会社宇治香園　本社工場　他 | 京都府木津川市山城町上狛西下60　他 | 有機加工食品 | JU990319-0086-0 |
| （株）碧翆園 | （株）碧翆園本社工場 | 京都府城陽市中・中ノ郷51 | 有機加工食品 | JT020131PR-0484-0 |
| 株式会社ユーアンドミー | 株式会社ユーアンドミー製造工場 | 京都府亀岡市大井町並河2-6-1 | 有機加工食品 | 07B-005 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/kyoto.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
- Estado: revisión 2026-08-11; **3 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 一乗寺ブリュワリー | Kyoto | Cerveza | JBA | ichijoji-brewery.com | Tokio/Kioto: el barrio no es municipio; queda 'Kyoto'; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| グランドリミテ (KIXビール) | Kyoto | Cerveza | JBA | kixbeer.com | revisado 2026-08-10: el dominio redirige a Izumisano Brewing y la unidad productiva está en Osaka, no Kyoto |
| ラフインターナショナル (家守堂) | Kyoto | Cerveza | JBA | yamorido.jp | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

**Ya integrado, no volver a proponer:** 澤井醤油本店, 黄桜 y 金鵄正宗 (matriz de 京都町家ビール) ya están en `kyoto.csv`.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/kansai/kyoto.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/kyoto.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
- Estado: revisión 2026-08-11; **5 retenidos** en la segunda pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 尾張屋 | 京都市 | Dulces y repostería | 和菓子協会 | http://www.honke-owariya.co.jp/ | 京都市中京区車屋町通二条下ル; revisado 2026-08-11: retenido (403, falta confirmar actividad o unidad productiva) |
| 吉水園 | 京都市 | Dulces y repostería | 和菓子協会 | http://www.yoshimizuen.jp | 京都市東山区三条通白川橋東3丁目夷町 157; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |
| 大原女家 | 京都市 | Dulces y repostería | 和菓子協会 | http://www.oharameya.co.jp/ | 京都市東山区祇園町北側 248; revisado 2026-08-11: retenido (ERROR, falta confirmar actividad o unidad productiva) |
| 武中製菓株式会社 | 京都市 | Aperitivos | 全国米菓工業組合 | https://takenakaseika.shopinfo.jp/ | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）; revisado 2026-08-11: retenido (404, falta confirmar actividad o unidad productiva) |
| 有限会社藤澤永正堂 | 京都市 | Aperitivos | 全国米菓工業組合 | http://www.kuramaan.jp | 米菓製造業（菓子卸等へ販売）、米菓製造・販売業（直売所有り）; revisado 2026-08-11: retenido (403, falta confirmar actividad o unidad productiva) |

## Retenido del barrido de Kioto — 2026-08-14

| candidato | municipio propuesto | carencia actual |
|---|---|---|
| 京都丹波高原チーズ工房 | Nantan | `kyoto-cheese.com` no resuelve y no se encontró una fuente competente que confirme esa identidad, la quesería ni la unidad propuesta en 八木町日置西谷14. No confundir con 丹波チーズ工房 de Tanba, Hyogo. |

## Nuevos candidatos de pescado y marisco artesanal — barrido 2026-08-14

Barrido sistemático de productores, elaboradores y transformadores artesanos de pescado y marisco de Kioto con instalaciones productivas propias, marca activa y venta/presencia web directa. Categoría: `Pescado`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Descripción / Especialidad | Fuente |
|---|---|---|---|---|---|---|
| **丸久水産 (Marukyu Suisan)** | 株式会社丸久水産 | `宮津市` | Pescado | https://marukyusuisan.com/ |Elaborador pesquero del puerto de Miyazu en Tango; especialista en secado artesano (himono) de jurel, caballa y pescados de temporada del mar de Japón. ⚠ Reviewed 2026-08-14: hold; the proposed domain is invalid, mismatched or insufficient and no current source yet establishes every admission claim.| Web oficial / Asociación comercial de Miyazu |
