# Ishikawa — candidatos

- CSV: `data/csv/jp/chubu/ishikawa.csv` (66 filas tras la revisión integral de 2026-08-11).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (2026-08-04). Fuente que cita: 石川県酒造組合連合会 <https://www.ishikawa-sake.jp/eng/index.html>.
- Estado: **6 integradas** el 2026-08-05 (5 `verificado`, 1 `parcial`), 4 con tienda propia. Evidencia en `data/evidence/jp/chubu/ishikawa.jsonl`.

Categoría para todas: `Sake`. Todas vienen marcadas `B` en el origen (solo
valen los productos con origen local acreditado).

## Contraste contra el gremio (hecho 2026-08-04)

Las **16 aparecen literalmente** en la web del gremio, con la misma grafía
inglesa. El bloque es fiable en identidad.

Lo que el gremio **no** da es la ciudad de casi ninguna: solo confirma Kanazawa
para Nakamura y Fukumitsuya (✔ arriba). Los otros catorce municipios del xlsx
salen de otra parte y **están sin contrastar** — hay que confirmarlos en la web
de cada bodega antes de fijar coordenadas.

## Trampas
- `Kaetsu Sake Brewery` (Komatsu, Ishikawa) no es 下越酒造 **Kaetsu Shuzo** (Aga,
  Niigata), que ya está en `niigata.md`. Rōmaji idéntico, dos empresas.
- `Hakuto Sake Brewery` (Wajima) tampoco es 宝山/白龍 ni ninguna de Niigata.
- El listado no trae web propia de ninguna: apunta al gremio para las dieciséis.
- **Noto**: el terremoto de enero de 2024 arrasó bodegas de Wajima, Suzu y Noto.
  Varias siguen sin reconstruir o producen en instalaciones cedidas. Aquí
  «actividad actual» no es un trámite: exige evidencia reciente, y una bodega
  parada no es una purga, es `parcial` con nota.

## Las que faltaban (11, pasada 2026-08-04)

Resuelta la duda del «Qué falta»: **la página en inglés era un extracto**. El
censo real son ~42 bodegas (日本酒造組合中央会,
<https://japansake.or.jp/sakagura/jp/ishikawa/>, 3 páginas; y
<https://jp.sake-times.com/sakagura/ishikawa>). Estas 11 no estaban arriba.
Ninguna trae dominio. Categoría: `Sake`.

⚠ **Las seis de Wajima caen de lleno en la zona del terremoto de enero de 2024**,
el aviso que ya está más abajo en este fichero. Varias perdieron el 蔵 y elaboran
cedidas en otra prefectura. Aquí «sigue activa» exige evidencia de 2025-2026, y
una bodega parada **no es purga**: es `parcial` con nota.

## Qué falta
- ~15 bodegas más del censo (páginas 2-3 del listado del gremio nacional).
- Fuera del sake, sin abrir: 加賀野菜 (verdura tradicional de Kanazawa), 能登
  (sal marina de Suzu, ika/pescado, 中島菜), 金沢 (dulces wagashi, pan de oro),
  醤油/味噌 de Ono (Kanazawa), 治部煮 y conservas.

## Lote JAS ecológico nacional — 2026-08-08

> **Reauditoría 2026-08-11:** 19 candidatos siguen retenidos tras cruzarlos de nuevo contra el CSV actual. El registro JAS prueba la certificación y el centro, pero no basta por sí solo para acreditar identidad pública, oferta propia y actividad actual; no se publica ninguna fila sin resolver esas tres piezas.

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 護国寺生産グループ | 農事組合法人護国寺農場　9　他 | 石川県小松市五国寺町63　他 | 有機農産物 | 2000F-12 |
| （有）ジャパンファーム | 生水敏雄　ほ場1　他 | 石川県小松市金平町尾谷7　他 | 有機農産物 | 2001F-8 |
| 手取清流生産グループ | 川北 弘 1 他 | 石川県能美市下清水ヨ91番地 他 | 有機農産物 | 2000F-10 |
| 有限会社グリーンアース杉浦 代表取締役 杉浦 賢治 | 002810 他 | 石川県羽咋市円井町602 他 | 有機農産物 | 2 |
| 辻本 長衛 | 006470 他 | 石川県羽咋市垣内田町438 他 | 有機農産物 | 10 |
| ユウキファーム山岸 山岸 邦夫 | 000010 他 | 石川県七尾市中島町西谷内な57 他 | 有機農産物 | 12 |
| 加賀有機の会 代表 橋詰 善庸 | 000140 他 | 石川県加賀市西島町43 他 | 有機農産物 | 13 |
| 有限会社たけもと農場 代表取締役 竹本 彰吾 | 001100 他 | 石川県能美市佐野町西49 他 | 有機農産物 | 15 |
| 今井 清博 | 004430 他 | 石川県鹿島郡中能登町小田中井きし27 他 | 有機農産物 | 17 |
| 橋 祥一郎 | 000980 他 | 石川県小松市拓栄町277-1 他 | 有機農産物 | 21 |
| 高 利充 | 無関29 他 | 石川県七尾市能登島無関町29 他 | 有機農産物 | 45 |
| 木下 勝 | 10730 他 | 石川県金沢市粟崎町4-107 他 | 有機農産物 | 48 |
| 井村辰二郎 | S083 金沢 | 石川県金沢市湖南町83 | 有機農産物 | JI001010FA-0069-0 |
| ダートコーヒー（株） | ダートコーヒー株式会社　白山工場 | 石川県白山市水島町451 | 有機加工食品 | 07-050B |
| 加賀味噌食品工業協業組合 | 加賀味噌食品工業協業組合 | 石川県白山市倉部町1080 | 有機加工食品 | JK090323PR-1075-0 |
| 公益財団法人農業・環境・健康研究所 白山研究農場 代表 細川 洋幹 | 1 他 | 石川県白山市徳光町3840-1 他 | 有機農産物 | 56 |
| 東　浩一 | 湖東町331　他 | 石川県小松市湖東町331　他 | 有機農産物 | JH100511FA-1112-0 |
| 農家ふじた | 新2　他 | 石川県小松市木場町新43、44、45　 他 | 有機農産物 | 2010F-5 |
| 株式会社スギヨファーム 代表取締役 杉野 哲也 | 圃場1 | 石川県七尾市能登島町上野３３ | 有機農産物 | 58 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/ishikawa.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **OnoShoyu** — 大野醤油醸造協業組合 — 組合案内, <https://www.oonomurasaki.jp/pages/3/>
- Estado: revisión 2026-08-11; **1 retenidos** en la primera pasada, cada uno con su carencia sin resolver anotada en la fila.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 小山屋醤油店 | Nanao | Condimentos | OnoShoyu | — | 相生町; sin dominio en la fuente; revisado 2026-08-10: el padrón oficial publica dos números de calle incompatibles para la misma identidad |

## Venta directa — revisión 2026-08-11

- Fuente: **食べチョク**, ficha individual de venta directa.
- Estado: revisión cerrada para este lote; **1** caso retenido sin publicar por el motivo individual indicado.

| nombre | municipio de la ficha | categoría provisional | ficha | motivo de retención |
|---|---|---|---|---|
| こすもす自然農園 | 河北郡河北潟干拓地区内 | Fruta y verdura | https://www.tabechoku.com/producers/28888 | The note identifies a reclaimed district rather than a municipality and the profile text does not resolve the productive unit. |
