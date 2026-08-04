# Saga — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/saga.csv` (0 filas). Dedup: nada que cruzar en el CSV. En la bandeja del `README.md` sigue Riken Nosan-Kako, que no está en esta tabla.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/saga> (30 bodegas, leído 2026-08-04). Gremio: 佐賀県酒造組合, <http://www.sagasake.or.jp/main/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Saga es la prefectura con más bodegas por habitante de Japón, y **鹿島 (Kashima)**
concentra el barrio histórico de 肥前浜宿, con bodegas alineadas en una calle.
Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Sachihime Shuzo | 幸姫酒造 | Kashima |
| Tenzan Shuzo | 天山酒造 | Ogi |
| Koyanagi Shuzo | 小柳酒造 | Ogi |
| Higashitsuru Shuzo | 東鶴酒造 | Taku |
| Amabuki Shuzo | 天吹酒造 | Miyaki |
| Ide Shuzo | 井手酒造 | Ureshino |
| Gochoda Shuzo | 五町田酒造 | Ureshino |
| Segashira Shuzo | 瀬頭酒造 | Ureshino |
| Kawanami Shuzo | 川浪酒造 | Imari |
| Ko-Imari Shuzo | 古伊万里酒造 | Imari |
| Tanaka Shuzo | 田中酒造 | Imari |
| Kiyama Shoten | 基山商店 | Kiyama |
| Saka Shuzo | 佐嘉酒造 | Saga |
| Komatsu Shuzo | 小松酒造 | ⚠ 東松浦郡 |

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
