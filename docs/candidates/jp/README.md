# Japón — índice de candidatos y bandeja de entrada

Ficheros por prefectura en esta carpeta, más los sueltos que aún no dan para
abrir el suyo. Las reglas comunes están en `docs/candidates/README.md`; cada
fichero identifica la asociación o fuente concreta usada.

> **Integración 2026-08-04:** 14 de las 18 de la bandeja entraron en su CSV como `parcial`. Siguen aquí las 4 que no: los tres molinos harineros (Fukuoka, Saga, Kumamoto), B2B de materia prima, y Minimal, que no trae el barrio de Tokio.

> **Pasada de gremios 2026-08-04:** abiertas **las 47 prefecturas**, ~700
> candidatos nuevos, todos `unverified`. Ninguno abierto en vivo. Detalle y
> estado, en la cabecera de cada fichero.

> **Revisión integral 2026-08-09:** revisados los **940 candidatos del lote JAS**
> y los **12 casos heredados que no casaban literalmente con el CSV**. Se
> integraron 69 productores con fuente pública viva y unidad productiva
> localizada; Kakukyu Hatcho Miso y Sekinoichi Shuzo ya estaban publicados bajo
> su identidad comercial. Quedan 869 JAS en sus ficheros de prefectura porque la
> búsqueda no dio todavía una combinación suficiente de identidad pública,
> actividad productora y enlace fiable. Los ocho casos de grupo, planta o escala
> discutible se conservan fechados en la nota de su prefectura; no deben
> reinterpretarse como descartes definitivos en la siguiente pasada.

> **Categorías infrarrepresentadas 2026-08-10 — revisión cerrada:** revisados los **453
> candidatos** de las 47 prefecturas, con sake y shochu deliberadamente fuera. Se publicaron
> **390 productores** con unidad productiva localizada y evidencia vigente; el catálogo pasó
> de 1.118 a 1.508 filas. Los **63 casos retenidos** siguen en la nota de su prefectura con un
> motivo individual: falta de fuente primaria actual, localización o contacto insuficientes,
> datos contradictorios, unidad productiva en otra prefectura o dominio secuestrado. No son
> descartes automáticos y no deben incorporarse sin resolver primero el motivo anotado.

> **Categorías infrarrepresentadas — 2ª pasada 2026-08-10:** **362 candidatos nuevos**
> en **45 prefecturas**, todos `unverified` y todos fuera de sake y destilado. Las ocho
> regiones quedan por encima de 20: Kansai 88, Chubu 79, Kanto 53, Tohoku 45,
> Kyushu-Okinawa 28, Chugoku 25, Shikoku 23, Hokkaido 21. Tres directorios nacionales
> hacen el grueso porque publican **nombre, dirección y web propia en la misma fila**,
> que es lo que faltaba en la pasada de gremios: 全国和菓子協会 (dulce, 181),
> 全国米菓工業組合 (senbei/arare, 77 tras filtrar por 業種) y 全国乾麺協同組合連合会
> (fideo seco, 45). El resto son verticales buscados a mano donde no hay directorio:
> pescado elaborado (じゃこ天, 宗田節, 蒲鉾, 海苔), té de Yame/Ureshino/Chiran,
> 乾しいたけ de Oita, embutido y miel de Hokkaido. Detalle en la nota de cada prefectura.
>
> **Cruzar solo por dominio no basta.** El cruce por dominio cazó 12 ya publicados, pero
> otros cuatro (安岡蒲鉾, 無茶々園, 三谷製糖, まえばら農園) estaban en el CSV con **otro
> dominio de la misma casa** — `.co.jp` frente a `.com`, o `maebara-farm.jp` frente a
> `maebarafarm.jp` — y solo salieron al cruzar por 社名 normalizado. Hacer las dos pasadas.

> **Venta directa — 3ª pasada 2026-08-10:** **1.034 candidatos nuevos, 22 en cada una de
> las 47 áreas**, de <https://www.tabechoku.com/producers/[prefectura]>. Es la primera fuente
> japonesa encontrada que **generaliza por área sin ser un gremio de bebida**: cubre las 47
> prefecturas con 51-96 productores cada una tras deduplicar, y da municipio completo. Reparto
> por categoría tras el enriquecimiento: Fruta y verdura 431, Pescado 123, Pan y cereal 96,
> Setas 85, Carne 66, Miel 36, Huevos 34, Frutos secos 26, Té 22, Legumbres 21, Condimentos 19,
> y 18 sin clasificar.
>
> **Su techo es distinto al de un padrón, y por eso vale.** Es un mercado de venta directa:
> prueba que el productor **vende hoy y vende él mismo**, que es justo lo que un registro no
> prueba y lo que obliga a dejar filas en `parcial`. Lo que no da es el dominio propio —
> el enlace es la ficha del mercado — así que cosechar dominio sigue siendo el paso previo
> a cada alta.
>
> **Enriquecido el mismo día.** Cada fila lleva municipio (con el 郡 cuando lo hay, que es la
> trampa que avisa el `AGENTS.md` del país), categoría, **cómo se cerró esa categoría**,
> los productos que el productor tiene a la venta y el representante cuando la ficha lo da.
> La columna `cerrada por` es el semáforo: `productos` es categoría leída del catálogo real
> —**165 filas**, las que se alcanzaron antes del límite de peticiones— y `ficha` es inferida
> de su descripción, o sea provisional. Solo **18 de 1.034** quedan en `⚠ por decidir`.
>
> **El límite es de la fuente, no del método:** 食べチョク corta por 405 a partir de unas
> 180 fichas seguidas y luego bloquea el sitio entero durante un rato. Reanudar la cosecha
> de fichas —a un ritmo de una cada 2 s, o repartida en varios días— cierra la categoría por
> productos de las 869 restantes sin trabajo nuevo de investigación: el listado de ids ya está.
>
> **Fuentes descartadas en esta pasada, para no repetir el intento:** `miso.or.jp`
> (directorio de miso por prefectura, pero protegido con contraseña), `zenmi.jp` y
> `soysauce.or.jp` (padrón solo para socios), 全豆連 (roster de 412 tofuerías en PDF, pero
> sin municipio ni web y con cobertura muy desigual), ANKA (solo marcas nacionales),
> el PDF de 6次産業化 de MAFF (`nintei-70.pdf`, 403 a cualquier cliente que no sea navegador)
> y Wikidata por `P452` (menos de 70 empresas de alimentación con web en todo Japón).

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
