# Tokushima — candidatos

- CSV: `data/csv/jp/shikoku/tokushima.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/tokushima> (21 bodegas, leído 2026-08-04). Gremio: 徳島県酒造組合, <https://tokushimasake.com/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Naruto Shuzo | 鳴門酒造 | Naruto |
| Tsukasagiku Shuzo | 司菊酒造 | Mima |
| Tsunomine Shuzo | 津乃峰酒造 | Anan |
| Chikakiyo Shuzo | 近清酒造 | Anan |
| Naka Shuzo | 那賀酒造 | Naka |
| Agawa Shuzo | 阿川酒造 | Tsurugi |
| Karakuchi Shuzo | 可楽智酒造 | Higashimiyoshi |
| Chuwa Shoten | 中和商店 | Miyoshi |
| Kondo Matsutaro Shoten | 近藤松太郎商店 | Tokushima |
| Saito Shuzojo | 斎藤酒造場 | Tokushima |
| Seitama | 勢玉 | Tokushima |
| Sadasaku Shurui Jozojo | 定作酒類醸造場 | Katsuura |
| Nisshin Shurui (Taiko) | 日新酒類 太閤酒造場 | Awa |
| Ise Shuzo | 伊勢酒造 | Yoshinogawa ⚠ |

## Trampas
- ⚠ **La fuente sitúa 伊勢酒造 en 麻植郡山川町, que ya no existe**: se fusionó en
  2004 en 吉野川市 (Yoshinogawa). Wikidata excluye los municipios disueltos, así
  que escribir el nombre viejo deja la fila **sin puerta geográfica** — el audit
  la salta y la cuenta como skipped, no como comprobada (`AGENTS.md`). Misma
  trampa que en `tochigi.md`.
- **三好市 (Miyoshi) y 東みよし町 (Higashimiyoshi)** son dos municipios vecinos, y
  el segundo se escribe en hiragana. No colapsarlos.
- **伊勢酒造 (Tokushima)** no tiene relación con 伊勢萬 (Ise, Mie), en `mie.md`.
- **日新酒類** es un grupo con varias plantas (太閤酒造場 es una de ellas): una
  fila, en el municipio donde produce lo que se vende, no en la sede.

## Qué falta
- Las 7 bodegas restantes del censo.
- Sin abrir, y hay dos frentes de primera: **すだち (sudachi)**, del que Tokushima
  produce en torno al 98% nacional, y **阿波和三盆糖**, el azúcar artesano de
  Awa — quedan poquísimos obradores, todos identificables y con venta directa.
  Además: 鳴門金時 (batata), 半田そうめん, 鳴門わかめ, 阿波尾鶏.
