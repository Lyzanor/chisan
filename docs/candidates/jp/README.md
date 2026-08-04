# Japón — índice de candidatos y bandeja de entrada

Ficheros por prefectura en esta carpeta, más los sueltos que aún no dan para
abrir el suyo. Las reglas comunes están en `docs/candidates/README.md` y las
fuentes autorizadas del país en `data/csv/jp/AGENTS.md`.

> **Integración 2026-08-04:** 14 de las 18 de la bandeja entraron en su CSV como `parcial`. Siguen aquí las 4 que no: los tres molinos harineros (Fukuoka, Saga, Kumamoto), B2B de materia prima, y Minimal, que no trae el barrio de Tokio.

## Bandeja de entrada — sueltos por prefectura

Prefecturas con una o dos pistas, sin fichero propio todavía. Cuando una junte
material suficiente, se muda a `docs/candidates/jp/[prefectura].md` y sale de
aquí. Origen de todas: listado aportado por el usuario,
`listado_125_productores_locales_japon.xlsx` (2026-08-04). Ninguna abierta en
vivo; `A`/`B` es la clasificación del origen.

| prefectura | nombre | municipio | categoría | A/B | web |
|---|---|---|---|---|---|
| Aomori | Hachinohe Shuzo | Hachinohe | Sake | B | gremio japansake.or.jp |
| Fukuoka | Taiyo Flour Milling | Fukuoka | Pan y cereal | B | taiyomil.com |
| Fukushima | Daishichi Sake Brewery | Nihonmatsu | Sake | B | gremio japansake.or.jp |
| Gunma | Hoshino Bussan | Midori | Pan y cereal | B | hoshinet.co.jp |
| Hiroshima | Imada Shuzo Honten | Higashihiroshima | Sake | B | gremio japansake.or.jp |
| Kagoshima | Hombo Shuzo | ⚠ Kagoshima o Tsunuki | Destilados y licores | A | hombo.co.jp — grupo grande (Mars Whisky), triar |
| Kagoshima | Kanosuke Distillery | Hioki | Destilados y licores | B | kanosuke.com |
| Kumamoto | Sugi Bee Garden | Kumamoto | Miel | B | sugi-bee.com |
| Kumamoto | Kumamoto Flour Milling | ⚠ Kumamoto o Tamana | Pan y cereal | B | bears-k.co.jp |
| Mie | Maruhiko Sake Brewery | Yokkaichi | Sake | B | gremio japansake.or.jp |
| Miyazaki | Kyoya Shuzo | Nichinan | Destilados y licores | A | kyo-ya.com |
| Oita | Hita Tenryosui | Hita | Bebidas sin alcohol | A | hitatenryosui.co.jp |
| Osaka | Minoh Beer | Minoh | Cerveza | B | minoh-beer.jp |
| Osaka | Marca Brewing | Osaka | Cerveza | B | beermarca.com |
| Saga | Riken Nosan-Kako | Saga | Pan y cereal | B | riken-nosan.com |
| Tochigi | Coco Farm & Winery | Ashikaga | Sake | A | cocowine.com |
| Tokyo | Minimal Bean to Bar Chocolate | ⚠ falta el barrio | Chocolate | B | mini-mal.tokyo |
| Yamagata | Tsuruoka Beikoku Shogyo Cooperative | Tsuruoka | Pan y cereal | A | komenoshonai.or.jp — cooperativa, triar |

Notas:
- **Tokio no es un municipio**: la fila toma el barrio o la ciudad (`Shibuya`,
  `Hachioji`). Minimal no lo trae y hay que resolverlo antes de escribirla.
- **`hita` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español, así que Hita Tenryosui pasa el gate sin tocar nada.
- Los cuatro molinos harineros (Fukuoka, Saga, Kumamoto, y Yokoyama en Hokkaido)
  son B2B de materia prima: mirar si venden marca propia antes de darlos de alta.

## Ya integrado, no volver a proponer

- **Marukyu Koyamaen** (Uji, Kioto) del mismo listado ya es
  `marukyu-koyamaen-uji` en `data/csv/jp/kansai/kyoto.csv`.
