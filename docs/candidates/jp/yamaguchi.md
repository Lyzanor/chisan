# Yamaguchi — candidatos

- CSV: `data/csv/jp/chugoku/yamaguchi.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/yamaguchi> (40 bodegas, leído 2026-08-04). Gremio: 山口県酒造組合, <http://y-shuzo.com/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Asahi Shuzo | 旭酒造 | Iwakuni ⚠ |
| Sakai Shuzo | 酒井酒造 | Iwakuni |
| Ohmine Shuzo | 大嶺酒造 | Mine |
| Iwasaki Shuzo | 岩崎酒造 | Hagi |
| Ichimaru Shuzo | 一〇酒造 | Hagi |
| Okazaki Shuzojo | 岡崎酒造場 | Hagi |
| Abunotsuru Shuzo | 阿武の鶴酒造 | Abu |
| Kono Shuzo | 河野酒造 | Abu |
| Otsu Shurui Jozo | 大津酒類醸造 | Nagato |
| Kozaki Shuzo | 小崎酒造 | Nagato |
| Otokojiman Shuzo | 男自慢酒造 | Shunan |
| Kanemitsu Shuzo | 金光酒造 | Yamaguchi ⚠ |
| Kinbundo Shuzo | 金分銅酒造 | Kudamatsu |
| Kodama Shuzo | 児玉酒造 | Shimonoseki |

## Trampas
- ⚠ **旭酒造 (Iwakuni) es la del 獺祭 (Dassai)**, probablemente el sake japonés
  más exportado. Es el cuarto 旭酒造 del catálogo — con Meiwa (Mie), Echizen
  (Fukui) y Nagaoka (Niigata), la de 久保田. Mismo 社名 exacto, cuatro empresas:
  ver la lista completa en `mie.md`. El `nombre` público aquí es casi seguro
  **Dassai**, no la razón social.
- ⚠ **金光酒造 (Yamaguchi-shi)** no es 金光酒造 (Higashihiroshima), en
  `hiroshima.md`.
- **岡崎酒造場 (Hagi)** no es 岡崎酒造 (Ueda, Nagano), en `nagano.md`; y **岡崎市
  (Okazaki)** es además una ciudad de Aichi donde está el Hatcho miso del CSV.
  Rōmaji `Okazaki` = tres cosas distintas.
- 阿武郡阿武町 (Abu) no es municipio distinto de su 郡 homónimo: la fila lleva
  阿武町.

## Qué falta
- Las ~26 bodegas restantes del censo.
- Sin abrir: **ふぐ (fugu) de Shimonoseki** — el mercado de Haedomari es el único
  del mundo especializado y hay elaboradores con marca; **夏みかん de Hagi** (la
  naranja de verano nació ahí, con mermeladas y confitados artesanos);
  岩国れんこん, 長門ゆずきち, 見蘭牛 y 無角和種, わさび de Yamaguchi,
  外郎 (uiro) de Yamaguchi-shi.
