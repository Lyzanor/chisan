# Saga — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/saga.csv` (9 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/saga> (30 bodegas, leído 2026-08-04). Gremio: 佐賀県酒造組合, <http://www.sagasake.or.jp/main/>.
- Estado: **9 integradas** el 2026-08-05, **todas `verificado`**, 6 con tienda propia. Evidencia en `data/evidence/jp/kyushu-okinawa/saga.jsonl`.

Saga es la prefectura con más bodegas por habitante de Japón, y **鹿島 (Kashima)**
concentra el barrio histórico de 肥前浜宿, con bodegas alineadas en una calle.
Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Sachihime Shuzo | 幸姫酒造 | Kashima |
| Koyanagi Shuzo | 小柳酒造 | Ogi |
| Higashitsuru Shuzo | 東鶴酒造 | Taku |
| Ide Shuzo | 井手酒造 | Ureshino |
| Segashira Shuzo | 瀬頭酒造 | Ureshino |
| Kawanami Shuzo | 川浪酒造 | Imari |
| Tanaka Shuzo | 田中酒造 | Imari |
| Kiyama Shoten | 基山商店 | Kiyama |
| Saka Shuzo | 佐嘉酒造 | Saga |
| Komatsu Shuzo | 小松酒造 | ⚠ 東松浦郡 |

## Integradas 2026-08-05 (9) — todas verificado

| bodega | municipio | resultado |
|---|---|---|
| Tenzan Shuzo | Ogi | verificado · venta sí |
| Mitsutake Shuzojo | Kashima | verificado · venta sí |
| Gochoda Shuzo (Azumaichi) | Ureshino | verificado · venta sí |
| Koimari Shuzo | Imari | verificado · venta sí |
| Yano Shuzo | Kashima | verificado · venta sí |
| Amabuki Shuzo | Miyaki | verificado · venta sí |
| Fukuchiyo Shuzo (Nabeshima) | Kashima | verificado · solo distribuidor |
| Sachihime Shuzo | Kashima | verificado · sin carrito |
| Baba Shuzojo (Nogomi) | Kashima | verificado · sin carrito |

⚠ **`Kashima` resolvía al municipio equivocado.** 鹿島市 (Saga) y 鹿嶋市
(Ibaraki) comparten clave normalizada y ganaba el de Ibaraki, a 800 km: error
bloqueante. Resuelto el 2026-08-05 con una entrada `kashima` en
`data/reference/municipality-overrides.json` (kanto vs kyushu-okinawa). Es el
segundo homónimo de este tipo tras `tonosho` en `kagawa.md`.

- **Cuatro de las nueve están en Kashima**, casi todas en la calle de kura de
  Hizen Hamashuku. Cinco de las que trae la tabla original no salieron en esta
  pasada y siguen en cola.
- **«shop» en la URL no es una tienda.** `sachihime.co.jp/shop-list/` y
  `nabeshima.biz/shop.html` son listados de distribuidor. En el caso de
  Nabeshima la fuente institucional lo dice expresamente: no vende ni en el kura.
- **Yano Shuzo no tiene web corporativa**: su único sitio propio es la tienda en
  BASE, que sirve a la vez de identidad y de canal.
- **`nogomi.co.jp` sin `www` no responde**; con `www` da 200. No es sitio muerto.

## Trampas
- ⚠ **小松酒造** aparece con 東松浦郡 y sin 町**: de ese 郡 solo queda 玄海町
  (Genkai) tras las fusiones, pero hay que confirmarlo — el resto se repartió
  entre 唐津市 (Karatsu) e 伊万里市. Resolver antes de escribir o la fila se queda
  sin gate geográfico.
- **瀬頭酒造 y 五町田酒造 (ambas en Ureshino)** son de la misma familia pero
  empresas distintas, con marcas distintas (東一 y 東長 / 東鶴 no, ojo). Y
  **東鶴酒造 está en Taku**, no en Ureshino: tres 東 que se confunden fácil.
- **田中酒造 (Imari, Saga)** no es 田中酒造 (Otaru, Hokkaido) ni 田中酒造店 (Kami,
  Miyagi), ambas ya en esta carpeta. Tres empresas.
- **佐嘉酒造** usa el kanji antiguo de Saga (佐嘉), no el moderno (佐賀): no
  «corregirlo» al escribir el `nombre`.

## Qué falta
- Las ~16 bodegas restantes del censo, empezando por el resto de 肥前浜宿, que es
  donde están las que tienen tienda y visita.
- Sin abrir: **嬉野茶 (Ureshino)**, uno de los tres grandes tés en sartén de Japón
  y en el mismo municipio que tres bodegas de arriba; **海苔 de Ariake** (Saga es
  la primera productora nacional, con cofradías); 佐賀牛; 呼子のイカ (calamar
  vivo, con lonja propia); 有田焼 y 伊万里焼 (cerámica, fuera de catálogo pero
  arrastran obradores de 器 y té).
