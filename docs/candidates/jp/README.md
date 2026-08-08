# Japón — índice de candidatos y bandeja de entrada

Ficheros por prefectura en esta carpeta, más los sueltos que aún no dan para
abrir el suyo. Las reglas comunes están en `docs/candidates/README.md`; cada
fichero identifica la asociación o fuente concreta usada.

> **Integración 2026-08-04:** 14 de las 18 de la bandeja entraron en su CSV como `parcial`. Siguen aquí las 4 que no: los tres molinos harineros (Fukuoka, Saga, Kumamoto), B2B de materia prima, y Minimal, que no trae el barrio de Tokio.

> **Pasada de gremios 2026-08-04:** abiertas **las 47 prefecturas**, ~700
> candidatos nuevos, todos `unverified`. Ninguno abierto en vivo. Detalle y
> estado, en la cabecera de cada fichero.

## El gremio de bebida es la fuente que generaliza

Para este barrido, **cada prefectura tiene un gremio de bebida alcohólica y
publica su padrón completo**.
No es el mismo producto en todas — sake en 44, **本格焼酎 en Kagoshima y
Miyazaki, 泡盛 en Okinawa, 球磨焼酎 como segundo gremio en Kumamoto** — pero la
estructura es idéntica y por sí sola pasa de diez candidatos en las 47.

- Índice de los 47 gremios: <https://www.japansake.or.jp/sake/link/index.html>.
- Buscador nacional por prefectura: `japansake.or.jp/sakagura/jp/<prefectura>/`
  (paginado, autoritativo).
- Censo por prefectura de SAKETIMES: `jp.sake-times.com/sakagura/<prefectura>`
  (una sola página, más cómodo de leer). **La ruta de Kochi es `kouchi`.**

**Lo que el gremio no da es el dominio.** Se comprobó en tres fuentes distintas
y en los padrones de Miyagi, Saitama y Aomori: nombre y municipio sí, web casi
nunca. Es el cuello de botella real de Japón — no faltan nombres, falta enlace
por fila — y por eso todo esto entra como `unverified` y como mucho sostendrá
`parcial`. Las excepciones medidas, y por eso valen oro: **Kagawa** (gremio de
sake con dominio) y **Nara** (三輪素麺, 9 fabricantes con web propia).

**Trampas de acceso**, para no repetir el trabajo: varios gremios siguen en HTTP
antiguo y no responden por HTTPS (Aomori), otros tienen el certificado roto
(Okinawa) y `iwate-sake.jp` no resuelve. Un fallo de fetch aquí **no es un sitio
muerto** (`AGENTS.md`): usar el buscador nacional como segunda vía.

**Trampas de datos**, las tres que salieron en casi todas las prefecturas:

1. **Homónimos de 社名.** Hay cuatro 旭酒造 (uno es Dassai), tres 尾崎酒造, tres
   青木酒造, tres 太田/大田酒造, dos 高木酒造 (una es 十四代). Casar por 社名
   **y** municipio, nunca por apellido.
2. **Municipios disueltos en las fusiones Heisei.** Las fuentes siguen citando
   湯津上村, 岩舟町, 山川町, 嘉穂町, 有明町… que ya no existen. Wikidata los
   excluye, así que la fila se queda **sin puerta geográfica**: el audit la salta
   y la cuenta como skipped, no como comprobada.
3. **郡 y エリア no son municipio.** El 郡 es una comarca; y el gremio de
   Kagoshima agrupa por zonas históricas (伊集院, 知覧) que hoy son barrios de
   otros municipios.

## Bandeja de entrada — sueltos por prefectura

Los 18 sueltos que abrieron el país, ya con fichero propio en su prefectura.
Se quedan aquí hasta resolver los cuatro que siguen fuera del CSV. Origen de
todas: listado aportado por el usuario,
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
