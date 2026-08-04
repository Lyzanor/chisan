# Wakayama — candidatos

- CSV: `data/csv/jp/kansai/wakayama.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/wakayama> (19 bodegas, leído 2026-08-04). Gremio: 和歌山県酒造組合, <http://wa-syuzouren.sakura.ne.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Nate Shuzoten | 名手酒造店 | Kainan |
| Nakano BC | 中野BC | Kainan |
| Tsuho Shuzo | 通宝酒造 | Kainan |
| Shimamoto Shuzojo | 島本酒造場 | Kainan |
| Sekaiitto | 世界一統 | Wakayama |
| Tabata Shuzo | 田端酒造 | Wakayama |
| Tencho Shimamura Shuzo | 天長島村酒造 | Wakayama |
| Shuho Shuzo | 祝砲酒造 | Wakayama |
| Kokonoe Zakka | 九重雜賀 | Kinokawa |
| Takagaki Shuzo | 高垣酒造 | Aridagawa |
| Hatsuzakura Shuzo | 初桜酒造 | Katsuragi |
| Kishino Shuzo Honke | 岸野酒造本家 | Gobo |
| Nakao Shuzoten | 中尾酒造店 | Kimino |
| Ozaki Shuzo | 尾崎酒造 | Shingu ⚠ |

## Trampas
- ⚠ **尾崎酒造 (Shingu, Wakayama)** no es 尾崎酒造 (Ajigasawa, Aomori), ya listada
  en `aomori.md`. Mismo 社名, dos extremos del país.
- **中尾酒造店 (Kimino, Wakayama)** no es 中尾酒造 (Ibaraki, Osaka), en `osaka.md`.
- **九重雜賀 (Kinokawa)** es sobre todo **casa de vinagre** (雑賀の酢) que además
  hace sake: la `categoria` que pese puede ser `Condimentos`, no `Sake`. Mirarlo
  antes de escribir.
- **中野BC (Kainan)** es grande y hace licor de ume además de sake: entra por
  identidad propia, pero decidir la categoría dominante.
- 海草郡紀美野町 y 伊都郡かつらぎ町 no son municipio: la fila lleva el 町 —
  Kimino, Katsuragi.

## Qué falta
- Las 5 bodegas restantes del censo.
- **梅 (ciruela ume)**: Wakayama produce en torno al 60% del nacional y el
  南高梅 de **Minabe y Tanabe** es Patrimonio Agrícola Mundial, con decenas de
  elaboradores de umeboshi con marca y tienda propia. Es el frente más rico de
  la prefectura y no hay ni una fila.
- Sin abrir: **有田みかん** (mandarina con GI), 山椒 de Arida (casi todo el
  nacional), かつお/まぐろ de Katsuura, 湯浅の醤油 — **Yuasa es la cuna de la
  salsa de soja japonesa** y conserva obradores en madera.
