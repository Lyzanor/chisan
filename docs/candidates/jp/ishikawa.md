# Ishikawa — candidatos

- CSV: `data/csv/jp/chubu/ishikawa.csv` (6 filas, altas del 2026-08-05).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (2026-08-04). Fuente que cita: 石川県酒造組合連合会 <https://www.ishikawa-sake.jp/eng/index.html>.
- Estado: **6 integradas** el 2026-08-05 (5 `verificado`, 1 `parcial`), 4 con tienda propia. Evidencia en `data/evidence/jp/chubu/ishikawa.jsonl`.

Categoría para todas: `Sake`. Todas vienen marcadas `B` en el origen (solo
valen los productos con origen local acreditado).

| nombre | municipio (del xlsx, sin contrastar) |
|---|---|
| Nakamura Brewery | Kanazawa ✔ |
| Yachiya Brewing | Kanazawa |
| Kanaya Shuzouten | Hakusan |
| Manzairaku Sake Kura | Hakusan |
| Kaetsu Sake Brewery | Komatsu |
| Higashi Sake Brewing | Komatsu |
| Kano Sake Brewery | Kaga |
| Mioya Brewery | Hakui |
| Matsunami Shuzo | Noto |
| Sakurada Sake Brewery | Suzu |
| Hakuto Sake Brewery | Wajima |

## Integradas 2026-08-05 (6)

| bodega | municipio | resultado |
|---|---|---|
| Shata Shuzo (Tengumai) | Hakusan | verificado · venta sí |
| Fukumitsuya | Kanazawa | verificado · venta sí |
| Kazuma Shuzo (Chikuha) | **Noto** ⚠ | verificado · venta sí |
| Sogen Shuzo | **Suzu** ⚠ | verificado · venta sí |
| Yoshida Shuzoten (Tedorigawa) | Hakusan | verificado · sin carrito |
| Kikuhime | Hakusan | **parcial** · web con JS |

⚠ **Cierra en parte el aviso de Noto que abría este fichero.** Las dos bodegas
de la zona del terremoto de enero de 2024 que entran aquí **siguen elaborando**,
con evidencia:
- **数馬酒造 (Noto)** mantiene producción y tienda propia.
- **宗玄酒造 (Suzu)** perdió botellas y su túnel de guarda quedó sepultado por un
  corrimiento, pero **reanudó la elaboración el 15 de enero de 2024** y aguantó
  además las lluvias torrenciales de septiembre.

Sigue en pie el aviso para **las seis de Wajima**, que son las que perdieron el
kura y no se han comprobado.

- **宗玄 no tiene dominio propio**: su único sitio localizado es la tienda en
  Shopify, que sirve a la vez de identidad y de canal, como Yano en `saga.md`.
- **菊姫 sirve el cuerpo vacío** (se pinta con JavaScript), igual que Kotobuki
  Toraya en `yamagata.md`: `parcial`.
- **Kikuhime está en Tsurugi**, barrio de Hakusan tras la fusión de 2005.

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

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kikuhime | 菊姫 | Hakusan |
| Kuze Shuzoten | 久世酒造店 | Tsubata |
| Takeuchi Shuzoten | 武内酒造店 | Kanazawa |
| Tezuka Shuzojo | 手塚酒造場 | Komatsu |
| Tsuruno Shuzoten | 鶴野酒造店 | Noto |
| Hiyoshi Shuzoten | 日吉酒造店 | Wajima ⚠ |
| Shirafuji Shuzoten | 白藤酒造店 | Wajima ⚠ |
| Shimizu Shuzoten | 清水酒造店 | Wajima ⚠ |
| Chuno Shuzo | 中納酒造 | Wajima ⚠ |
| Nakano Shuzo | 中野酒造 | Wajima ⚠ |
| Nakashima Shuzoten | 中島酒造店 | Wajima ⚠ |

⚠ **Las seis de Wajima caen de lleno en la zona del terremoto de enero de 2024**,
el aviso que ya está más abajo en este fichero. Varias perdieron el 蔵 y elaboran
cedidas en otra prefectura. Aquí «sigue activa» exige evidencia de 2025-2026, y
una bodega parada **no es purga**: es `parcial` con nota.

## Qué falta
- ~15 bodegas más del censo (páginas 2-3 del listado del gremio nacional).
- Fuera del sake, sin abrir: 加賀野菜 (verdura tradicional de Kanazawa), 能登
  (sal marina de Suzu, ika/pescado, 中島菜), 金沢 (dulces wagashi, pan de oro),
  醤油/味噌 de Ono (Kanazawa), 治部煮 y conservas.
