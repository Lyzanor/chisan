# Ishikawa — candidatos

- CSV: `data/csv/jp/chubu/ishikawa.csv` (0 filas). Dedup: nada que cruzar.
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (2026-08-04). Fuente que cita: 石川県酒造組合連合会 <https://www.ishikawa-sake.jp/eng/index.html>.
- Estado: cola abierta, 16 sin integrar (2026-08-04). **Ninguna entró en el CSV**: faltan dominio y confirmación de municipio (el gremio solo sitúa dos).

Categoría para todas: `Sake`. Todas vienen marcadas `B` en el origen (solo
valen los productos con origen local acreditado).

| nombre | municipio (del xlsx, sin contrastar) |
|---|---|
| Nakamura Brewery | Kanazawa ✔ |
| Fukumitsuya Sake Brewery | Kanazawa ✔ |
| Yachiya Brewing | Kanazawa |
| Kanaya Shuzouten | Hakusan |
| Manzairaku Sake Kura | Hakusan |
| Shata Shuzo | Hakusan |
| Yoshida Shuzoten | Hakusan |
| Kaetsu Sake Brewery | Komatsu |
| Higashi Sake Brewing | Komatsu |
| Kano Sake Brewery | Kaga |
| Mioya Brewery | Hakui |
| Kazuma Sake Brewery | Noto |
| Matsunami Shuzo | Noto |
| Sakurada Sake Brewery | Suzu |
| Sogen Sake Brewery | Suzu |
| Hakuto Sake Brewery | Wajima |

## Contraste contra el gremio (hecho 2026-08-04)

Las **16 aparecen literalmente** en la web del gremio, con la misma grafía
inglesa. El bloque es fiable en identidad.

Lo que el gremio **no** da es la ciudad de casi ninguna: solo confirma Kanazawa
para Nakamura y Fukumitsuya (✔ arriba). Los otros catorce municipios del xlsx
salen de otra parte y **están sin contrastar** — hay que confirmarlos en la web
de cada bodega antes de fijar coordenadas.

## Trampas
- `Kaetsu Sake Brewery` (Komatsu, Ishikawa) no es 下越酒造 **Kaetsu Shuzo** (Aga,
  Niigata), que ya está en `niigata.md`. Rōmaji idéntico, dos empresas.
- `Hakuto Sake Brewery` (Wajima) tampoco es 宝山/白龍 ni ninguna de Niigata.
- El listado no trae web propia de ninguna: apunta al gremio para las dieciséis.
- **Noto**: el terremoto de enero de 2024 arrasó bodegas de Wajima, Suzu y Noto.
  Varias siguen sin reconstruir o producen en instalaciones cedidas. Aquí
  «actividad actual» no es un trámite: exige evidencia reciente, y una bodega
  parada no es una purga, es `parcial` con nota.

## Qué falta
- Comprobar si el gremio son 16 o más: la página en inglés puede ser un extracto
  de la japonesa.
- Fuera del sake, sin abrir: 加賀野菜 (verdura tradicional de Kanazawa), 能登
  (sal marina de Suzu, ika/pescado, 中島菜), 金沢 (dulces wagashi, pan de oro),
  醤油/味噌 de Ono (Kanazawa), 治部煮 y conservas.
