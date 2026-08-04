# Chiba — candidatos

- CSV: `data/csv/jp/kanto/chiba.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/chiba> (40 bodegas, leído 2026-08-04). Gremio: 千葉県酒造組合, <http://www.chiba-sake.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Iinuma Honke | 飯沼本家 | Shisui |
| Asahitsuru | 旭鶴 | Sakura |
| Iida Honke | 飯田本家 | Katori |
| Iida Shuzojo | 飯田酒造場 | Choshi |
| Ishigami Shuzo | 石上酒造 | Choshi |
| Kubota Shuzo | 窪田酒造 | Noda |
| Aoyagi Shuzo | 青柳酒造 | Yokoshibahikari |
| Umeichirin Shuzo | 梅一輪酒造 | Sanmu |
| Kankiku Meijo | 寒菊銘醸 | Sanmu |
| Inaka Shuzo | 稲花酒造 | Ichinomiya |
| Kidoizumi Shuzo | 木戸泉酒造 | Isumi |
| Iwase Shuzo | 岩瀬酒造 | Onjuku |
| Azumanada Jozo | 東灘醸造 | Katsuura |
| Kameda Shuzo | 亀田酒造 | Kamogawa |

## Trampas
- **`chiba` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español: las filas de la capital pasan el gate sin tocar
  nada. No re-resolverlo.
- **合同酒精 東京工場 (Matsudo)** es planta de grupo y encima lleva «Tokio» en el
  nombre estando en Chiba: triar, y si entra, el municipio es Matsudo.
- **小泉酒造** aparece sin municipio en la fuente (es Fusa, 富津市): resolver antes
  de escribir.
- 山武郡, 長生郡, 夷隅郡, 印旛郡 no son municipio: la fila lleva el 町.

## Qué falta
- Las ~26 bodegas restantes del censo.
- **醤油**: Chiba es la capital mundial de la salsa de soja — Noda (Kikkoman) y
  Choshi (Yamasa, Higeta) — y no hay ni una fila. El frente más obvio de la
  prefectura, con la cautela de que los tres son grupos industriales y lo que
  interesa son las casas pequeñas de la misma cuenca.
- Sin abrir: cacahuete de Yachimata (casi todo el nacional), 落花生, marisco de
  Boso, 海苔 de Tokyo Bay, なめろう.
