# Gunma — candidatos

- CSV: `data/csv/jp/kanto/gunma.csv` (1 fila: Hoshino Bussan, cereal). Dedup: ninguna de abajo solapa.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/gunma> (27 bodegas, leído 2026-08-04). Gremio: 群馬県酒造組合, <http://www.gunma-sake.or.jp/>.
- Estado: cola abierta, 16 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Tsuchida Shuzo | 土田酒造 | Kawaba |
| Nagai Shuzo | 永井酒造 | Kawaba |
| Nagai Honke | 永井本家 | Numata |
| Otone Shuzo | 大利根酒造 | Numata |
| Asama Shuzo | 浅間酒造 | Naganohara |
| Kimusume Shuzo | 貴娘酒造 | Nakanojo |
| Shimaoka Shuzo | 島岡酒造 | Ota |
| Imai Shuzoten | 今井酒造店 | Ota |
| Kondo Shuzo | 近藤酒造 | Midori |
| Okamura | 岡村合名 | Takasaki |
| Takai | 高井 | Fujioka |
| Tajima Shuzoten | 田島酒造店 | Fujioka |
| Shibazaki Shuzo | 柴崎酒造 | Yoshioka |
| Shimizuya Shuzo | 清水屋酒造 | Tatebayashi |
| Shotoku Meijo | 聖徳銘醸 | Kanra |
| Ida Shuzo | 井田酒造 | Tamamura |

## Trampas
- **Dos 永井 en 10 km**: 永井酒造 (marca 水芭蕉, Kawaba) y 永井本家 (Numata). Son
  empresas distintas; casar por 社名 completo y municipio, no por apellido.
- 吾妻郡, 佐波郡, 北群馬郡, 甘楽郡, 利根郡 no son municipio: la fila lleva el
  町/村 — Naganohara, Tamamura, Yoshioka, Kanra, Kawaba.
- **玉村町 (Tamamura)** es un municipio de Gunma, y **玉村本店 (Tamamura Honten)**
  es la cervecera de Shiga Kogen que ya está en `data/csv/jp/chubu/nagano.csv`.
  Homónimo puro: nada que ver.

## Qué falta
- Las ~11 bodegas restantes del censo.
- Sin abrir: konjac (Gunma hace >90% del nacional y no hay ninguna fila), udon de
  Mizusawa, 下仁田ねぎ (puerro con GI), 嬬恋 col, cerdo de Joshu, 焼きまんじゅう.
