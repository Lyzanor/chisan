# Miyagi — candidatos

- CSV: `data/csv/jp/tohoku/miyagi.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: 宮城県酒造組合 (gremio, autoritativo), <https://miyagisake.jp/kuramoto/> — los 24 miembros con 社名 y municipio (leído 2026-08-04).
- Estado: cola abierta, 24 `unverified` (2026-08-04). **El gremio no publica el dominio de sus socios**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Saura | 佐浦 | Shiogama |
| Abekan Shuzo | 阿部勘酒造 | Shiogama |
| Katsuyama Shuzo | 仙台伊澤家 勝山酒造 | Sendai |
| Uchigasaki Shuzoten | 内ヶ崎酒造店 | Tomiya |
| Taiwagura Shuzo | 大和蔵酒造 | Taiwa |
| Sasaki Shuzoten | 佐々木酒造店 | Natori |
| Ichinokura | 一ノ蔵 | Osaki |
| Niizawa Jozoten | 新澤醸造店 | Osaki |
| Moritami Shuzoten | 森民酒造店 | Osaki |
| Kanbai Shuzo | 寒梅酒造 | Osaki |
| Tanaka Shuzoten | 田中酒造店 | Kami |
| Yamawa Shuzoten | 山和酒造店 | Kami |
| Nakayu Shuzoten | 中勇酒造店 | Kami |
| Kawakei Shoten | 川敬商店 | Misato |
| Chida Shuzo | 千田酒造 | Kurihara |
| Kanenoi Shuzo | 金の井酒造 | Kurihara |
| Hagino Shuzo | 萩野酒造 | Kurihara |
| Ishikoshi Jozo | 石越醸造 | Tome |
| Kakuboshi | 角星 | Kesennuma |
| Otokoyama Honten | 男山本店 | Kesennuma |
| Hirako Shuzo | 平孝酒造 | Ishinomaki |
| Suminoe Shuzo | 墨廼江酒造 | Ishinomaki |
| Onuma Shuzoten | 大沼酒造店 | Murata |
| Zao Shuzo | 蔵王酒造 | Shiroishi |

## Trampas
- El gremio da **barrio, no municipio** en varias (仙台市泉区, 大崎市松山,
  大崎市三本木, 大崎市古川, 栗原市栗駒/一迫/金成): el `municipio` del CSV es la
  ciudad — Sendai, Osaki, Kurihara.
- 塩竈 / 塩釜: el gremio escribe las dos grafías para la misma ciudad (Shiogama).
- **Kesennuma e Ishinomaki** fueron arrasadas por el tsunami de 2011 y varias de
  estas bodegas se reconstruyeron o se trasladaron: la dirección histórica puede
  no ser la actual. Confirmar sede productiva antes de fijar coordenadas.

## Qué falta
- Ningún dominio recogido: primer trabajo de cada lote.
- Sin abrir: 笹かまぼこ de Sendai, ostra y marisco de Matsushima/Kesennuma, ternera
  de Sendai, arroz Hitomebore, 味噌/醤油.
