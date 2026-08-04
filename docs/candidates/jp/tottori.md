# Tottori — candidatos

- CSV: `data/csv/jp/chugoku/tottori.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/tottori> (20 bodegas, leído 2026-08-04). Gremio: el de Tottori lo aloja la propia prefectura, <https://www.pref.tottori.lg.jp/jizake/> — es el único caso de los 47 en que el gremio no tiene dominio propio.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Chiyomusubi Shuzo | 千代むすび酒造 | Sakaiminato |
| Inata Honten | 稲田本店 | Yonago |
| Kumezakura Shuzo | 久米桜酒造 | Hoki |
| Suwa Shuzo | 諏訪酒造 | Chizu |
| Gensui Shuzo | 元帥酒造 | Kurayoshi |
| Takada Shuzo | 高田酒造 | Kurayoshi ⚠ |
| Nakai Shuzo | 中井酒造 | Kurayoshi |
| Otani Shuzo | 大谷酒造 | Kotoura |
| Ehara Shuzo Honten | 江原酒造本店 | Kotoura |
| Umetsu Shuzo | 梅津酒造 | Hokuei |
| Kunshi Shuzo | 君司酒造 | Tottori |
| Ota Shuzojo | 太田酒造場 | Wakasa ⚠ |
| Takada Shuzojo | 高田酒造場 | Iwami ⚠ |
| Oiwa Shuzo Honten | 大岩酒造本店 | Kofu |

## Trampas
- ⚠ **高田酒造 (Kurayoshi) y 高田酒造場 (Iwami) son dos empresas de esta misma
  prefectura**, separadas por un kanji. No fusionar filas.
- ⚠ **岩美町 (Iwami, Tottori) no es 石見 (Iwami)**, la comarca occidental de
  Shimane que da nombre a 石見銀山 y al 石見和牛. Mismo rōmaji, prefecturas
  vecinas: comprobar contra qué centroide resuelve.
- ⚠ **太田酒造場 (Wakasa, Tottori)** no es 太田酒造 (Kusatsu, Shiga, en `shiga.md`)
  ni 大田酒造 (Iga, Mie, en `mie.md`). Tres empresas, un rōmaji `Ota`.
  Y **若桜町 (Wakasa, Tottori)** convive con 若狭 (Wakasa), la comarca de Fukui.
- **久米桜酒造 (Hoki)** hace además la cerveza 大山Gビール: una fila, con la
  `categoria` que pese.

## Qué falta
- Las 6 bodegas restantes del censo.
- Tottori es la prefectura menos poblada de Japón pero no la menos productiva.
  Sin abrir: **二十世紀梨** (la pera nashi que lleva su nombre, con museo propio),
  **松葉がに** (cangrejo de las nieves, con subasta y marca por puerto),
  らっきょう de las dunas, lácteos y helado de Daisen, 鳥取和牛.
