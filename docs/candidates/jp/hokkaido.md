# Hokkaido — candidatos

- CSV: `data/csv/jp/hokkaido/hokkaido.csv` (145 filas tras la revisión integral de 2026-08-11).
- Fuentes: Hokkaido Wine Cluster, <https://winecluster.org/contents/winery/> (censo de bodegas de la isla, con municipio y dominio) y 日本ワイナリー協会, <https://www.winery.or.jp/winery-map/area/hokkaido/> (ficha por bodega, sin dominio propio).
- Estado: **37 integradas** en el CSV el 2026-08-04 como `parcial`. Quedan fuera 5 bodegas: Yoichi Winery, Otobe Winery y えべおつWein (las dos fuentes discrepan en municipio, ver aviso), Boss Agri y Domaine Towa (sin dominio en la fuente).

Hokkaido es una sola `area` con ~76 bodegas censadas en 2026; abajo van las 40
del núcleo asociado, que son las que traen dominio. Categoría: `Vino`.
El rōmaji de `nombre` y `municipio` es propuesta a confirmar.

| nombre (rōmaji propuesto) | 社名 | municipio | web |
|---|---|---|---|
| Vina de oro bodega | Vina de oro bodega | Niki | vina-de-oro-bodega.net |

⚠ **Las dos fuentes se contradicen en el municipio**, y siempre por lo mismo:
una da la **sede social** y la otra la **bodega**. Manda dónde se produce.
- 余市ワイナリー: Wine Cluster dice Sapporo (sede de 日本清酒), la asociación no
  la sitúa; la bodega está en Yoichi.
- おとべワイナリー: Sapporo (sede de 札幌酒精) vs Otobe (bodega) → Otobe.
- えべおつWein: Takikawa (barrio de Ebeotsu) vs Eniwa → resolver en la web propia.
- 松原農園: Rankoshi vs Niseko → resolver en la web propia.

**Revisión 2026-08-09:** Domaine Towa era una variante del ya publicado
`domaine-toi-takasu`; se retira de la cola, no es un descarte. **Yotsuba Milk
Products** queda retenida por ser una federación nacional con varias plantas y
sin una unidad local minorista inequívoca. **Yokoyama Flour Milling** queda
retenida por perfil B2B y falta de municipio productivo. **Godo Shusei
Asahikawa** queda retenida porque la fuente identifica una planta de grupo, no
una identidad productora local autónoma. Son decisiones revisables, no rechazos.

## Fuera del vino (4, del listado aportado 2026-08-04)

De `listado_125_productores_locales_japon.xlsx`. Ninguna solapa con la tabla de
arriba, que es solo de bodegas.

| nombre | municipio | categoría | A/B | web |
|---|---|---|---|---|
| Yotsuba Milk Products | ⚠ Sapporo o Tokachi | Lácteos y quesos | A | yotsuba.co.jp ⚠ revisada 2026-08-11: la escala no excluye, pero la sede y las plantas están en municipios distintos y falta fijar una unidad productiva atribuible |
| Yokoyama Flour Milling | ⚠ sin municipio | Pan y cereal | B | ficha en japanfoodhub.jp — el origen puso «Hokkaidō» de localidad, que es el área entera |

Estas cuatro abren por fin el frente lácteo/cárnico de la isla, que la tabla de
bodegas no tocaba. Kyodogakusha es además la punta del hilo de las queserías.

## Sake (13, pasada 2026-08-04)

Frente abierto por fin. Fuente: censo de 酒蔵 de SAKETIMES,
<https://jp.sake-times.com/sakagura/hokkaido> (13 bodegas, el censo completo de
la isla). Gremio: 北海道酒造組合, <http://www.hokkaido-sake.or.jp/>.
Ninguna trae dominio en la fuente. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Godo Shusei Asahikawa | 合同酒精 旭川工場 | Asahikawa ⚠ planta, triar |

⚠ **日本清酒 y 札幌酒精 ya aparecen arriba** como matrices de 余市ワイナリー y
おとべワイナリー. Si entran también como bodega de sake es **otra fila** (otro
producto, otro municipio productivo), no un duplicado — pero decidirlo antes de
escribir, no después.

## Qué falta
- Las ~36 bodegas restantes del censo (no asociadas y altas 2025-2026), casi todas
  en Yoichi, Niki e Iwamizawa: mismo listado de Wine Cluster, sección inferior.
- **Queserías**: Hokkaido tiene más de 100 obradores y no hay ninguno aquí. Es el
  frente con más recorrido de la isla y sigue sin fuente institucional localizada.
- Sin abrir: sake (北海道酒造組合), lácteos, marisco, ramen/miso.

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 19 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 麦わらファーム　梶沼啓 | A　他 | 北海道上川郡当麻町中央7区 | 有機農産物 | A06-062302 |
| 栗沢あおぞら農園　林宏 | 1　他 | 北海道岩見沢市栗沢町必成99 | 有機農産物 | A06-062301 |
| 森田 基 | 森田 基 10 他 | 北海道石狩郡新篠津村第36線10番地 他 | 有機農産物 | 2006F-5 |
| 岩田醸造（株） | 岩田醸造（株）　千歳工場 | 北海道千歳市上長都1130-13 | 有機加工食品 | 第1073号 |
| 佐藤京一 | 3　他 | 北海道岩見沢市栗沢町茂世丑768-1、768-2　他 | 有機農産物 | A06-080701 |
| 小路恵子 | 01　他 | 北海道勇払郡安平町追分旭821-2　他 | 有機農産物 | 18002-01 |
| 池田良英 | 池田良英 | 北海道上川郡新得町上佐幌西1線5-1 | 有機農産物 | 18003-01 |
| 近藤弘和 | 近藤弘和 | 北海道網走郡津別町活汲 | 有機農産物 | 18006-01 |
| 津別町有機酪農研究会 | 石川賢一　他 | 北海道網走郡津別町共和229-2　他 | 有機畜産物 | 第TS18016号-02　他 |
| 早坂農場 | 早坂清彦 H　他 | 北海道上川郡美瑛町ﾙﾍﾞｼﾍﾞ6959-1　他 | 有機農産物 | AFASSEQ-AA-010809 |
| 畑のがんこもの組合 | 柳澤　繁雄　他 | 北海道上川郡剣淵町西岡町1245番地　他 | 有機農産物 | 第13013号－01　他 |
| 木村　正幸 | 30　他 | 北海道上川郡剣淵町南桜町2025番地 | 有機農産物 | 第15010号-01 |
| 安田　盛 | 13　他 | 北海道上川郡剣淵町南桜町525番地 | 有機農産物 | 第15012号-01 |
| (有)サンユー農産 | A-1　他 | 北海道余市郡仁木町東町12丁目　他 | 有機農産物 | 14001-01 |
| 中本　正雄 | 中本　正雄 | 北海道岩内郡共和町学田 | 有機農産物 | 15007-01 |
| クローバーの会 | 浅野　晃彦　１　他 | 北海道旭川市神居町西丘 | 有機農産物 | 第13004号-01　他 |
| いずみ農園 | O-1　他 | 北海道帯広市西10条北3丁目3　他 | 有機農産物 | 第14006号-01 |
| 佐伯農園 | O-1　他 | 北海道虻田郡洞爺湖町洞爺町417 | 有機農産物 | 100092001 |
| オホーツク髙橋農場 | 01 他 | 北海道網走郡美幌町田中1236 | 有機農産物 | A06-110202 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/hokkaido/hokkaido.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JiCheese** — 北海道地チーズ博 — 工房・メーカー, <https://jicheese.com/producer/>
- Estado: revisión 2026-08-11; **1 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 丸勝産業 (はこだてビール) | Hakodate | Cerveza | JBA | hakodate-factory.com | revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/hokkaido/hokkaido.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/hokkaido.php> (nombre, dirección y web propia de cada socio)
  - **全国米菓工業組合** — 会員企業一覧, <https://www.arare-osenbei.jp/member/> (incluye 業種, que es lo que separa fabricante de mayorista)
  - búsqueda dirigida por vertical, con la dirección leída en la web del propio productor
- Estado: revisión 2026-08-11; **8 retenidos** en la segunda pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 下館工房 | ⚠ | Carne | búsqueda dirigida + web propia | https://www.shimodate-koubou.jp/ | ⚠ municipio sin confirmar; revisado 2026-08-11: retenido (200, falta confirmar actividad o unidad productiva) |
| 薫製工房ハントヴェルク | ⚠ | Carne | búsqueda dirigida + web propia | https://handwerk-official.com/ | ⚠ municipio sin confirmar; cerdo whey de Tokachi; revisado 2026-08-11: retenido (200, falta confirmar actividad o unidad productiva) |
| 菅野養蜂場 | ⚠ | Miel | búsqueda dirigida + web propia | https://honeyfarm-kanno.com/ | ⚠ municipio sin confirmar; revisado 2026-08-11: retenido (200, falta confirmar actividad o unidad productiva) |
| ナルセ養蜂場 | ⚠ | Miel | búsqueda dirigida + web propia | https://naruse-bee.jp/ | ⚠ municipio sin confirmar; Tokachi; revisado 2026-08-11: retenido (200, falta confirmar actividad o unidad productiva) |
| 藤井水産（鮭匠ふじい） | ⚠ | Pescado | búsqueda dirigida + web propia | https://fujiisuisan.co.jp/ | ⚠ municipio sin confirmar (Nemuro según la ficha, Betsukai en la web); revisado 2026-08-11: retenido (200, falta confirmar actividad o unidad productiva) |
| 圓子水産 | 斜里町 | Pescado | búsqueda dirigida + web propia | https://marukosuisan.com/ | pescador de Shiretoko (Utoro) con planta propia; municipio resuelto con la ficha de 食べチョク; revisado 2026-08-11: retenido (200, falta confirmar actividad o unidad productiva) |
| 海産問屋カネニ | 広尾町 | Pescado | búsqueda dirigida + web propia | https://www.kaneni.com/ | ⚠ mayorista con marca propia, triar si elabora; revisado 2026-08-11: retenido (200, falta confirmar actividad o unidad productiva) |
| 佐藤水産 | 札幌市 | Pescado | búsqueda dirigida + web propia | https://www.sato-suisan.co.jp/ | salmón, ikura, sujiko; ⚠ sede en Sapporo y planta en Ishikari, confirmar unidad productiva; revisado 2026-08-11: retenido (200, falta confirmar actividad o unidad productiva) |

## Nuevos candidatos de cerveza artesana — barrido 2026-08-13

Barrido sistemático de microcervecerías artesanales independientes con obrador propio, marca activa, presencia web y redes sociales. Categoría: `Cerveza`.

| Nombre / Marca | Razón social | Municipio | Categoría | Web | Instagram | Notas de producción |
|---|---|---|---|---|---|---|