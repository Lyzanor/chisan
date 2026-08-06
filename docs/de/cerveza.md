# Alemania — cerveza: barrido de 2026-08-06

Cómo se armó el pool que hay en `docs/candidates/de/*.md`, y qué hay que saber antes de
convertirlo en filas. La cola por Land vive en esos ficheros; aquí solo va el método.

## Por qué no había cerveza

La apertura de Alemania salió entera de un extracto de OSM de **Hofläden** —tiendas de granja,
casetas de autoservicio y `Milchtankstellen`—. Ese extracto no busca cervecerías y no las trae: de
las 499 filas de la apertura, ninguna era una cervecería. Las dos que llevaban `categoria=Cerveza`
eran Hofläden que revenden cerveza entre otras veinte cosas, y la única cervecería real del CSV
—Niederrhein-Westfälische Braumanufaktur, en Hamminkeln— había caído en `Otros`.

El hueco no era alemán, era de la fuente. Destatis contó **1.415 Braustätten en 2025**, y **821 de
ellas producen ≤100.000 litros al año**: más de la mitad del censo cervecero alemán es exactamente
el perfil que busca este catálogo.

## Fuentes usadas

1. **OpenStreetMap vía Overpass**, una consulta por Land (`area["ISO3166-2"="DE-XX"][admin_level=4]`)
   sobre `craft=brewery`, `microbrewery=yes`, `industrial=brewery` y `product=beer`. Es la fuente
   principal y resultó casi exhaustiva: 1.538 candidatos contra 1.415 Braustätten oficiales, y en
   los tres Länder con cifra publicada el pool queda por encima del censo (Bayern 652/588,
   Baden-Württemberg 200/190, NRW 161/131). ODbL 1.0, requiere atribución.
2. **Wikidata** (`P31/P279* Q131734` + `P17 Q183`, descartando las que tienen `P576`) para el
   residual que OSM no tagea. Aporta 182 fichas repartidas por Land más 46 sin coordenadas: sobre
   todo Privatbrauereien regionales medianas cuyo nodo OSM existe pero no lleva `craft=brewery`.

Overpass corta la consulta de toda Alemania por timeout y responde 429 si las peticiones van
seguidas: una por Land y 30 s entre ellas.

## Las tres clases y lo que pesan

La columna **clase** de las tablas dice qué tag trajo la fila, no si entra en el catálogo:

- **`craft=brewery` (806)** — cervecería declarada. Es el pool bueno: se verifica de una pasada y
  suele traer web propia.
- **`industrial` / `product=beer` (112)** — planta industrial. Aquí están Beck's, Karlsberg y
  compañía; hay que triar tamaño y pertenencia a grupo antes de tocar nada.
- **`microbrewery=yes` (620)** — local que declara elaborar in situ, casi siempre sobre
  `amenity=restaurant` (439) o `pub` (106). Es una Gasthausbrauerei cuando de verdad cuece, y es el
  tier que más falsos positivos trae: el tag se usa también en bares que solo *sirven* microbrews.

## Lo que ya se descartó, para no repetirlo

- **229 locales que solo declaran qué marca sirven.** Consultar `brewery=*` a secas arrastra
  heladerías, cines, floristerías y hoteles que ponen en el tag la cerveza de la casa. Solo cuenta
  como productor `craft` / `microbrewery` / `industrial` / `product=beer`.
- **30 cerradas** por `disused:*`, `was:*` o `historic`.
- **En el lado de Wikidata**, del gap bruto de 494: 57 eran falsos huecos (la misma cervecería con
  otro nombre, `Brauerei S.Riegele` contra `Riegele`), 67 museos y edificios, 13 marcas de grupo sin
  fábrica propia (Berliner Kindl, Hacker-Pschorr, Franziskaner, Brinkhoff) y 129 sin web ni
  coordenadas, que es la firma de la cervecería decimonónica que nadie marcó como disuelta.
  **Wikidata mezcla activas, históricas y marcas sin distinguirlas**: comprobar actividad es el
  primer paso de cualquier ficha de esa sección, no el último.

## Estado de los datos del pool

- **Web**: 1.021 responden 2xx en su propio dominio, 100 redirigen a otro host (señal de absorción
  por grupo: mira a dónde va antes de aceptar la fila), 56 dan 4xx, 3 dan 5xx y 68 no resuelven. El
  código va escrito junto al enlace en las tablas cuando no fue 2xx propio. Snapshot del 2026-08-06;
  un 403 no es una web muerta.
- **Municipio**: 1.104 venían con `addr:city`. Los otros 434 llevan el municipio puesto por el
  centroide más cercano de `data/reference/municipalities.json` y van marcados **⚠** en las tablas:
  es una conjetura geométrica, no un dato de la fuente, y hay que confirmarla contra la dirección
  que publique el productor. En 879 casos el centroide más cercano coincidió con el `addr:city` de
  OSM; en 225 no, casi siempre porque OSM da el Ortsteil y el centroide da la Gemeinde.
- **Teléfono** en 872, **email** en 539.

## Al pasarlo al CSV

Vale todo lo de `docs/candidates/README.md`. Específico de aquí:

- Empieza por `craft=brewery` con web `ok` y municipio sin ⚠. De cuatro abiertas al azar en el
  barrido (Schloßbrauerei Stelzer, Plagwitzer, Heimathafen Erfurt, Häselbräu), las cuatro eran
  cervecerías reales en el municipio correcto y dos vendían online.
- **`municipio` es la Gemeinde**, no el Ortsteil; el Ortsteil va en `direccion`. Y Alemania es
  `dropAmbiguous`: si el nombre lo comparten dos Gemeinden, la fila no tiene puerta geográfica.
- Una Gasthausbrauerei que cuece y vende su cerveza es un productor. Un bar que sirve microbrews
  ajenas, no. La web del sitio lo resuelve en un vistazo casi siempre.
- `productos estrella` sale de la carta de cervezas del propio productor, no de la categoría.
