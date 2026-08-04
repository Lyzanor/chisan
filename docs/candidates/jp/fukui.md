# Fukui — candidatos

- CSV: `data/csv/jp/chubu/fukui.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/fukui> (40 bodegas, leído 2026-08-04). Gremio: 福井県酒造組合, <https://www.fukuisake.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kokuryu Shuzo | 黒龍酒造 | Eiheiji |
| Kato Kichibee Shoten | 加藤吉平商店 | Sabae |
| Inami Shuzo | 井波酒造 | Sabae |
| Ippongi Kubohonten | 一本義久保本店 | Katsuyama |
| Uno Shuzojo | 宇野酒造場 | Ono |
| Genpei Shuzo | 源平酒造 | Ono |
| Kubota Shuzo | 久保田酒造 | Sakai |
| Ikeda Shuzo | 池田酒造 | Fukui |
| Ito Shuzo | 伊藤酒造 | Fukui |
| Kikukatsura Shuzo | 菊桂酒造 | Fukui |
| Koshi no Iso | 越の磯 | Fukui |
| Asahi Shuzo | 朝日酒造 | Echizen (町) ⚠ |
| Katayama Shuzo | 片山酒造 | Echizen (市) ⚠ |
| Kitazen Shoten | 北善商店 | Minamiechizen ⚠ |

## Trampas
- ⚠ **Tres «Echizen» distintos y contiguos**: 越前町 (丹生郡, donde está 朝日酒造),
  越前市 (ciudad, 片山酒造) y 南越前町 (南条郡, 北善商店). Son tres municipios,
  no tres grafías de uno. Escribir el que toca o el gate geográfico no avisa,
  porque los tres existen y están a 20 km.
- ⚠ **朝日酒造 (Echizen-cho, Fukui)** no es 朝日酒造 (Nagaoka, Niigata), la de
  久保田, que ya está en `niigata.md`. Mismo 社名 exacto, dos empresas.
- ⚠ **久保田酒造 (Sakai, Fukui)** tampoco: hay otra en Sagamihara (`kanagawa.md`)
  y 久保田 es además la marca de la de Nagaoka. Tres cosas, un rōmaji.
- 加藤吉平商店 vende como **梵 (Born)**: `nombre` es la marca pública si es la que
  usa (`docs/CSV_CONTRACT.md`).

## Qué falta
- Las ~26 bodegas restantes del censo.
- Sin abrir: **越前がに** (cangrejo con marca y subasta propia), 若狭ぐじ y el
  pescado de Wakasa, 羽二重餅, 越前おろしそば, sal de Wakasa, 谷田部ねぎ.
