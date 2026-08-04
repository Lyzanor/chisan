# Mie — candidatos

- CSV: `data/csv/jp/kansai/mie.csv` (0 filas). Dedup: nada que cruzar en el CSV. En la bandeja del `README.md` está Maruhiko Sake Brewery (Yokkaichi), que no aparece en esta tabla.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/mie> (34 bodegas, leído 2026-08-04). Gremio: 三重県酒造組合, <http://www.mie-sake.or.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kiyasho Shuzo | 木屋正酒造 | Nabari |
| Ota Shuzo | 大田酒造 | Iga |
| Motosaka Shuzo | 元坂酒造 | Odai |
| Kawabu Jozo | 河武醸造 | Taki |
| Asahi Shuzo | 旭酒造 | Meiwa ⚠ |
| Ise Man | 伊勢萬 | Ise |
| Ito Shuzo | 伊藤酒造 | Yokkaichi |
| Kagura Shuzo | 神楽酒造 | Yokkaichi |
| Adachi Honke Shuzo | 安達本家酒造 | Asahi ⚠ |
| Inagaki Shuzojo | 稲垣酒造場 | Asahi ⚠ |
| Aburasho | 油正 | Tsu |
| Imamura Shuzo | 今村酒造 | Tsu |
| Ogawa Honke | 小川本家 | Tsu |
| Kankobai Shuzo | 寒紅梅酒造 | Tsu |

## Trampas
- ⚠ **Cuatro 旭酒造 distintos** en el catálogo: Meiwa (Mie), Echizen (Fukui, ya en
  `fukui.md`), Nagaoka (Niigata, la de 久保田, en `niigata.md`) y **Iwakuni
  (Yamaguchi), que es la de 獺祭 Dassai** y está en `yamaguchi.md`. Mismo 社名
  exacto, cuatro empresas. Casar siempre por municipio.
- ⚠ **三重郡朝日町 (Asahi, Mie)** se suma a los Asahi de Toyama, Yamagata, Nagano y
  Aichi. Dos bodegas de esta tabla están ahí.
- **木屋正酒造 (Nabari)** vende como **而今 (Jikon)**, una de las marcas más
  buscadas de Japón: el `nombre` público probablemente sea la marca
  (`docs/CSV_CONTRACT.md`).
- **伊勢萬** elabora en Okage-yokocho, la calle turística de Ise: confirmar que es
  bodega y no solo tienda-obrador de escaparate.

## Qué falta
- Las ~20 bodegas restantes del censo.
- Sin abrir, y con mucho recorrido: **松阪牛 (Matsusaka gyu)**, una de las tres
  grandes carnes de Japón, con ganaderías identificables y registro propio;
  **伊勢茶** (Mie es la tercera productora de té del país y no hay ninguna fila);
  あおさ y 海女 (marisco de Shima), 伊勢うどん, 赤福/餅 de la ruta de Ise,
  真珠 de Toba (no alimentario).
