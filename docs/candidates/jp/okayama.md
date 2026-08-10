# Okayama — candidatos

- CSV: `data/csv/jp/chugoku/okayama.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/okayama> (49 bodegas, leído 2026-08-04). Gremio: 岡山県酒造組合, <http://www.okasake.com/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Okayama es la prefectura del **雄町 (Omachi)**, la variedad de arroz de sake más
antigua en cultivo: casi todo el Omachi de Japón sale de aquí y es el argumento
de terroir de estas bodegas. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kikuchi Shuzo | 菊池酒造 | Kurashiki |
| Kumaya Shuzo | 熊屋酒造 | Kurashiki |
| Ono Shuzo | 大野酒造 | Kurashiki |
| Ozaki Shuzojo | 尾崎酒造場 | Kurashiki ⚠ |
| Itano Shuzojo | 板野酒造場 | Okayama ⚠ |
| Itano Shuzo Honten | 板野酒造本店 | Okayama ⚠ |
| Akaiwa Shuzo | 赤磐酒造 | Akaiwa |
| Kamikokoro Shuzo | 嘉美心酒造 | Asakuchi |
| Isochidori Shuzo | 磯千鳥酒造 | Satosho |
| Ochi Shuzojo | 落酒造場 | Maniwa |
| Ohmi Shuzo | 大美酒造 | Maniwa |
| Akagi Shuzo | 赤木酒造 | Takahashi |
| Ouchi Shuzojo | 大内酒造場 | Kasaoka |
| Karita Shuzo | 苅田酒造 | Tsuyama |

## Trampas
- ⚠ **板野酒造場 y 板野酒造本店 están las dos en la ciudad de Okayama** y son dos
  empresas. Casar por 社名 completo, no por apellido ni municipio.
- ⚠ **尾崎酒造場 (Kurashiki)** es el tercer 尾崎 del catálogo, tras Ajigasawa
  (`aomori.md`) y Shingu (`wakayama.md`). Tres empresas.
- **苅田酒造** aparece en la fuente como 「苅田酒造エネルギー」: el sufijo huele a
  cambio de objeto social o a fusión con una empresa energética. Confirmar que
  sigue elaborando antes de escribir la fila; puede ser una purga documentada.
- 倉敷市 concentra cuatro y es una ciudad enorme tras las fusiones: el barrio
  (児島, 玉島, 水島) no es el `municipio`.

## Qué falta
- Las ~35 bodegas restantes del censo.
- Sin abrir, y es mucho: **白桃 (melocotón blanco)** y **マスカット・オブ・
  アレキサンドリア** — Okayama es la fruta de regalo de Japón, con productores
  identificables y venta online real, probablemente el mejor pool de la
  prefectura; きびだんご (con casas históricas), 千屋牛 (una de las carnes wagyu
  más antiguas), ままかり y 瀬戸内 pescado, 手延べ麺 de Kamogata.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 株式会社丸菱　岡山工場 | 株式会社丸菱　岡山工場　他 | 岡山県新見市大佐小阪部1421　他 | 有機加工食品 | MPJP1027-01 |
| 庄地区無農薬研究会 | 生産025-002-12号　他 | 岡山県倉敷市下庄467-1 | 有機農産物 | 生産025号 |
| まびゆうき | 生産037-003-02号　他 | 岡山県倉敷市真備町服部813-1　他 | 有機農産物 | 生産037号 |
| エコファームMITANI | 生産049-001-01号　他 | 岡山県倉敷市玉島陶3753-1　他 | 有機農産物 | 生産049 |
| 岡山県立高松農業高等学校 | 生産066-001-01号　他 | 岡山県岡山市北区高松原古才400-1の一部 | 有機農産物 | 生産066号 |
| 中和元気米クラブ | 生産062-006-07号　他 | 岡山県真庭市蒜山下和2606　他 | 有機農産物 | 生産062号 |
| 丸本酒造（株） | 生産070-001-05号　他 | 岡山県浅口市鴨方地頭上1171 他 | 有機農産物 | 生産070号 |
| 倉敷弥高山高原有機野菜クラブ | 生産043-001-01号　他 | 岡山県倉敷市玉島陶5539-4　他 | 有機農産物 | 生産043 |
| タンチョウの里内山農園 | 生産072-001-01号 | 岡山県和気郡和気町田賀451-6他 | 有機農産物 | 生産072 |
| 上組営農実行組合 | 生産003-009-01号　他 | 岡山県高梁市川上町高山3280-1他 | 有機農産物 | 生産００３号 |
| 大興産業株式会社 | 大興産業㈱ | 岡山県井原市西江原町1858-3　他 | 有機加工食品 | 加工003 |
| 岡山市高松有機無農薬野菜生産組合みどり会 | 生産001-014-01号　他 | 岡山県岡山市北区平山548　他 | 有機農産物 | 生産001号 |
| 岡山市高松有機無農薬野菜生産組合ふるさと会 | 生産002-015-01号　他 | 岡山県岡山市北区新庄下185-1　他 | 有機農産物 | 生産002 |
| 和気健康農業研究会 | 生産036-001-01号　他 | 岡山県和気郡和気町吉田177-1　他 | 有機農産物 | 生産036号 |
| 株式会社　岡三食品 | ㈱岡三食品　他 | 岡山県岡山市東区西大寺新地360-8　他 | 有機加工食品 | JO080725PR-1050-0 |
| 日生町みかん生産組合 | 生産033-006-01号　他 | 岡山県備前市日生町日生3635-26　他 | 有機農産物 | 生産033-006-01号他 |
| 日本オリーブ(株) | 日本オリーブ（株）　他 | 岡山県瀬戸内市牛窓町牛窓3911-10 他 | 有機加工食品 |  |
| 名水美人ファクトリー株式会社　岡山工場 | 名水美人ファクトリー株式会社　岡山第2工場　他 | 岡山県小田郡矢掛町中６８６－１　他 | 有機農産物 | SES-05012501 |
| はやしま有機の郷 | 生産065-001-01号　他 | 岡山県都窪郡早島町早島3678-1　他 | 有機農産物 | 生産065号 |
| 有限会社想庵 | 有限会社想庵　万富工場 | 岡山県岡山市瀬戸町万富314-2 | 有機加工食品 | MPJP1615 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chugoku/okayama.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **4** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 倉敷チーズ工房ハルパル | Kurashiki | Lácteos y quesos | ChFun | kurashiki-cheese.shopinfo.jp | revisado 2026-08-10: la web oficial propuesta devuelve 404 |
| 多胡本家酒造場 (作州津山ビール) | Tsuyama | Cerveza | JBA | tsuyamabeer.co.jp | matriz de sake; comprobar duplicado; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| 全工房 (吉備土手下麦酒) | Okayama | Cerveza | JBA | kibidote.jp | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| サッポロビール 岡山ワイナリー | Akaiwa | Vino | JWA | — | planta de grupo nacional; la ficha confirma la planta, pero no una identidad de producto local atribuible; revisado 2026-08-10: la ficha confirma una planta nacional, pero no una identidad de producto local atribuible |
