# Gifu — candidatos

- CSV: `data/csv/jp/chubu/gifu.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/gifu> (58 bodegas, leído 2026-08-04). Gremio: 岐阜県酒造組合, <http://www.gifu-sake.or.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Oita Shuzoten | 老田酒造店 | Takayama |
| Kawajiri Shuzojo | 川尻酒造場 | Takayama |
| Kaba Shuzojo | 蒲酒造場 | Hida |
| Otsubo Shuzoten | 大坪酒造店 | Hida |
| Okuhida Shuzo | 奥飛騨酒造 | Gero |
| Iwamura Jozo | 岩村醸造 | Ena |
| Ena Jozo (Sango) | 恵那醸造 三郷工場 | Ena |
| Ena Jozo | 恵那醸造 | Nakatsugawa |
| Ohashi Shuzo | 大橋酒造 | Nakatsugawa |
| Adachi Shuzo | 足立酒造 | Gifu |
| Ikedaya Shuzo | 池田屋酒造 | Ibigawa ⚠ |
| Otsuka Shuzo | 大塚酒造 | Ikeda ⚠ |
| Kikukawa | 菊川 | Kakamigahara |
| Gyokusendo Shuzo | 玉泉堂酒造 | Yoro |

## Trampas
- ⚠ **池田屋酒造 (Ibigawa, Gifu)** no es 池田屋酒造 (Itoigawa, Niigata), la de
  謙信, ya en `niigata.md`. Mismo 社名, dos empresas.
- ⚠ **大塚酒造 (Ikeda, Gifu)** no es 大塚酒造 (Komoro, Nagano), ya en `nagano.md`.
  Misma trampa. Y **池田町 (Ikeda)** existe además en Nagano y Fukui.
- **恵那醸造 son dos entradas y una empresa**: sede en Nakatsugawa y 三郷工場 en
  Ena. Una fila, en el municipio donde produce — no dos.
- **`mino` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español (`AGENTS.md` de Japón): las filas de 美濃市 pasan
  el gate sin tocar nada.
- 揖斐郡 y 養老郡 no son municipio: la fila lleva el 町.

## Qué falta
- Las ~44 bodegas restantes del censo, y **Hida/Takayama concentra las más
  visitables** (varias con tienda propia y venta online: pool de alto valor).
- Sin abrir: **飛騨牛** (una de las tres grandes carnes de Japón, con marca
  registrada y ganaderías identificables), 富有柿 de Motosu, 朴葉味噌, 鮎 del
  Nagara (pesca con cormorán, patrimonio), 和菓子 de Gifu, 岐阜提灯 (no alimentario).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 成瀬三郎 | 成瀬三郎1号　他 | 岐阜県瑞浪市日吉町5579　他 | 有機農産物 | JN060822FA-1297-0 |
| 株式会社真誠 | 株式会社真誠インダストリアル・パーク関ヶ原工場 他 | 岐阜県不破郡関ヶ原町玉1565-10　他 | 有機加工食品 | 23-05 |
| 岐阜県しょうゆ協業組合 | 岐阜県しょうゆ協業組合 | 岐阜県恵那市武並町竹折451 | 有機加工食品 | JI000612-PRO0169-1 |
| コスモスライクス（株） | コスモスライクス（株）他 | 岐阜県可児市西帷子字東野571他 | 有機加工食品 | 07-046B |
| 稲葉ピーナツ株式会社 | 稲葉ピーナッツ（株）第１、第３工場　他 | 岐阜県岐阜市六条大溝4-2-5　他 | 有機加工食品 | JI000925PR-0063-0 |
| 有限会社久世食品 | 本社工場 他 | 岐阜県岐阜市東島4丁目10番13号 他 | 有機加工食品 | 2003M-3 |
| 岐阜県立恵那農業高等学校 | 1 | 岐阜県恵那市大井町2625-17 | 有機農産物 | 21-02 |
| 株式会社センコー技研 | 大野工場　他 | 岐阜県揖斐郡大野町加納223-1 | 有機加工食品 | MPJP1617 |
| 株式会社お茶の玉露園 | （株）お茶の玉露園　第一工場　他 | 岐阜県羽島郡岐南町上印食3-67-1　他 | 有機加工食品 | 2013M-1 |
| ネオナチュラル母袋有機農場 | C1 他 | 岐阜県郡上市大和町栗巣1077　他 | 有機農産物 | JN130402FA-1268-4 |
| 株式会社谷田商店 | 株式会社谷田商店 工場 | 岐阜県揖斐郡池田町段貝籠232 | 有機加工食品 | 21-08 |
| 株式会社瑞草園 | 本社工場 他 | 岐阜県揖斐郡池田町六之井659 他 | 有機加工食品 | 21-09 |
| アイガモ稲作研究会 | 1 他 | 岐阜県羽島市桑原町大須4-45-1 | 有機農産物 | 21-10 |
| 兼松宣仁 | 1 他 | 岐阜県各務原市蘇原月丘町4-1-3 他 | 有機農産物 | 21-11 |
| 株式会社ポテンシャル農業研究所 | 1 他 | 岐阜県高山市一之宮町1776-2 | 有機農産物 | 21-12 |
| 有限会社山藏農園 | 有限会社山藏農園 | 岐阜県高山市江名子町７６７　他 | 有機農産物 | 15-003 |
| 株式会社中津川サラダ農園 | 株式会社中津川サラダ農園 | 岐阜県中津川市駒場1944 | 有機農産物 | 160831-001 |
| 小林生麺株式会社 | 製造所1　他 | 岐阜県岐阜市白山町1－22　他 | 有機加工食品 | 217－004 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/gifu.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
