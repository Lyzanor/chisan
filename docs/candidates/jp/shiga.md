# Shiga — candidatos

- CSV: `data/csv/jp/kansai/shiga.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/shiga> (50 bodegas, leído 2026-08-04). Gremio: 滋賀県酒造組合, <http://shiga-sake.net/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Emishiki Shuzo | 笑四季酒造 | Koka |
| Shiga Shuzo | 滋賀酒造 | Koka |
| Seko Shuzo | 瀬古酒造 | Koka |
| Uehara Shuzo | 上原酒造 | Takashima |
| Ikemoto Shuzo | 池本酒造 | Takashima |
| Kawashima Shuzo | 川島酒造 | Takashima |
| Kitajima Shuzo | 北島酒造 | Konan |
| Kita Shuzo | 喜多酒造 | Higashiomi ⚠ |
| Okamura Honke | 岡村本家 | Toyosato |
| Otose Shuzojo | 音瀬酒造場 | Hikone |
| Sato Shuzo | 佐藤酒造 | Nagahama |
| Akatsuki Shuzo | 暁酒造 | Yasu |
| Ota Shuzo | 太田酒造 | Kusatsu ⚠ |
| Aichi Shuzo | 愛知酒造 | Aisho ⚠ |

## Trampas
- ⚠ **愛知酒造 está en 愛知郡 (Echi-gun), Shiga — no en la prefectura de Aichi.**
  Los mismos dos kanji, 愛知, se leen *Echi* aquí y *Aichi* allí. El 郡 no es
  municipio: la fila lleva 愛荘町 (**Aisho**). Es la trampa de homónimos más fina
  de este país y no la resuelve ningún gate.
- ⚠ **太田酒造 (Kusatsu, Shiga) es la matriz** de la 灘工場 que aparece marcada en
  `hyogo.md`. Si solo va a haber una fila, **es ésta**: aquí está la sede y la
  identidad. Decidirlo antes de escribir cualquiera de las dos.
- **喜多酒造 (Higashiomi, Shiga)** no es 喜多の華酒造場 (Kitakata, Fukushima) ni
  北島酒造, que está en esta misma tabla. Y hay un 喜多酒造 más en Kashihara
  (Nara), ya en el CSV como `Kita Shuzo`. ⚠ **Mismo rōmaji propuesto que una fila
  existente**: al escribirla, el `slug` es único por área, así que no colisiona,
  pero la confusión humana sí.
- **草津市 (Kusatsu, Shiga)** no es 草津町 (Gunma, el balneario).

## Qué falta
- Las ~36 bodegas restantes del censo.
- Sin abrir: **鮒寿し (funazushi)**, el encurtido de pescado del Biwa, con
  obradores familiares y siglos de historia — el producto más singular de la
  prefectura; **近江牛 (Omi gyu)**, la carne más antigua de Japón; 赤こんにゃく de
  Omihachiman, 丁字麸, 政所茶 y el té de Asamiya (de los primeros de Japón).
