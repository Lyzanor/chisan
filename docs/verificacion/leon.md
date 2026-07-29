# Verificación provincial de León

Ledger para planificar y reanudar la verificación profunda de
`data/csv/castilla-y-leon/leon.csv`. El CSV es la fuente de verdad y la
evidencia por decisión vive en `data/evidence/castilla-y-leon/leon.jsonl`.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento
fija el snapshot, los riesgos locales y el alcance de los lotes. Los contratos
aplicables son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Cómo reanudar

1. Leer `git status --short`, Estado, Reglas locales y solo el lote activo.
2. Confirmar que no hay cambios concurrentes en León.
3. Investigar primero identidad, exclusiones, duplicados y unidad productiva.
4. Resolver `Venta online` desde cero: aquí el valor heredado es honesto
   (`no comprobado`), así que no hay nada que deshacer pero tampoco nada hecho.
5. Corregir el `municipio` cuando el volcado trajo una pedanía (ver Reglas
   locales: es el defecto dominante de esta provincia).
6. Editar el CSV de forma estructurada, añadir una línea JSONL por decisión y
   actualizar aquí el resumen del lote.
7. Pasar `check:csv:changed`, `check:evidence:changed` y `git diff --check`.
   El cierre provincial pasa `verify:data`.

Los lotes agrupan de 7 a 15 filas por categoría, DO/IGP o zona. No se añaden
candidatos nuevos hasta terminar la primera pasada de las filas existentes.

## Definición de completado

- No queda ninguna fila sin decisión editorial revisada en esta pasada.
- `pendiente` solo sobrevive con bloqueo real documentado; `parcial` es un
  resultado final válido cuando la evidencia tiene techo registral o secundario.
- Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- Todos los `Venta online=sí|no` están demostrados y los `sí` tienen canal.
- Ninguna fila conserva una pedanía como `municipio`: cero filas fuera del
  geo-check.
- León se añade a `data/evidence/coverage.json` solo al cerrar la pasada.

## Estado

- **Lote LE-R1-a (2026-07-28, carril R1).** Alcance: las 2 `pendiente` que
  quedaban, ambas del volcado de Google Places. **1 purga**:
  `cereales-y-legumbres-el-canal-ponferrada` es «Almacenes El Canal», almacén
  de cereales, legumbres, piensos y paja —compraventa, no elaboración—, y su
  dirección real es avenida de Galicia 156, no la avenida del Canal que
  publicaba (`not-producer`). `la-huerta-san-martin-de-torres` **sigue
  `pendiente` como residual con techo conocido**: el pin de Maps no sostiene
  ni `identity` (nombre común, sin teléfono, web ni ficha), y tampoco hay
  prueba positiva de que sea un artefacto de dirección como en
  `huerta-vizconde-7`; se reabre solo con una fuente que le dé identidad. Su
  `descripcion` se retira porque narraba el volcado. 214→**213 filas**.
- Inicio: **2026-07-26**. Primera pasada profunda de las **240 filas**
  existentes; no añadir candidatos hasta el cierre.
- Snapshot inicial: **240 filas**; **236 `pendiente`, 4 `parcial`, 0
  `verificado`**. Venta online: **1 `sí` (sin canal), 239 `no comprobado`**.
- Evidencia inicial: **el fichero JSONL no existe**; 0 registros para 240 filas.
- Imágenes: 158 de 240 filas con imagen (82 sin); queda fuera de esta pasada
  salvo purga de basura detectada al paso.
- El árbol tenía trabajo concurrente en Badajoz al iniciar; queda expresamente
  fuera de este expediente.
- Tras LE-01 (2026-07-26): **238 filas** (−2 purgas); **218 `pendiente`, 4
  `parcial`, 16 `verificado`**. Venta online: **10 `sí` (9 con canal), 1 `no`,
  227 `no comprobado`**. Evidencia: **20 registros** (17 `keep`, 2 `purge`, 1
  `merge`); se estrena `data/evidence/castilla-y-leon/leon.jsonl`. Las filas
  fuera del geo-check bajan de **73 a 63** y los avisos de data-quality de 82 a
  80. Las filas con `correo` suben de 79 a 87. El único `sí` sin canal es Soto
  del Vicario, que es del bloque de bodegas.
- Tras LE-02 (2026-07-26): **238 filas**; **198 `pendiente`, 8 `parcial`, 32
  `verificado`**. Venta online: **19 `sí` (18 con canal), 1 `no`, 218 `no
  comprobado`**. Evidencia: **42 registros** (37 `keep`, 3 `merge`, 2 `purge`).
  Las filas fuera del geo-check bajan de **63 a 55** y los avisos de
  data-quality de 80 a 67. Filas con `correo`: 100.
- Tras LE-03 (2026-07-26): **238 filas**; **177 `pendiente`, 10 `parcial`, 51
  `verificado`**. Venta online: **28 `sí` (28/28 con canal), 1 `no`, 209 `no
  comprobado`**. Evidencia: **64 registros**. Las filas fuera del geo-check
  bajan de **55 a 47** y los avisos de data-quality de 67 a 54. Filas con
  `correo`: 110. **Ya no queda ningún `sí` sin canal.**
- Tras LE-04 (2026-07-26): **238 filas**; **167 `pendiente`, 11 `parcial`, 60
  `verificado`**. Venta online: **34 `sí` (34/34 con canal), 1 `no`, 203 `no
  comprobado`**. Evidencia: **74 registros**. Las filas fuera del geo-check
  bajan de **47 a 43** y los avisos de data-quality de 54 a 50. Filas con
  `correo`: 118. **Bloque del Bierzo cerrado: las 52 bodegas de la DO Bierzo
  están revisadas** y quedan 30 bodegas pendientes, todas de Tierra de León y
  el sur de la provincia.
- Tras LE-05 (2026-07-26): **236 filas** (−2 purgas); **154 `pendiente`, 14
  `parcial`, 68 `verificado`**. Venta online: **41 `sí` (41/41 con canal), 1
  `no`, 194 `no comprobado`**. Evidencia: **87 registros** (79 `keep`, 5
  `merge`, 3 `purge`). Las filas fuera del geo-check bajan de **43 a 38** y los
  avisos de data-quality de 50 a 44. Filas con `correo`: 120. Quedan 17 bodegas
  pendientes.
- Tras LE-06 (2026-07-26): **234 filas** (−2 purgas); **137 `pendiente`, 16
  `parcial`, 81 `verificado`**. Venta online: **52 `sí` (52/52 con canal), 1
  `no`, 181 `no comprobado`**. Evidencia: **106 registros** (94 `keep`, 7
  `merge`, 5 `purge`). Filas fuera del geo-check: **37**; avisos de
  data-quality: **39**, y **cero avisos de distancia**. **Bloque de bodega
  cerrado: 0 pendientes de las 74 filas** que quedan en la categoría. Lo que
  falta es charcutería (40), fruta y verdura (21), miel (19), dulces (15),
  legumbres (11), pan (10) y un resto de 21 filas menores.
- Tras LE-07 (2026-07-26): **231 filas** (−3); **128 `pendiente`, 17 `parcial`,
  86 `verificado`**. Venta online: **57 `sí` (57/57 con canal), 1 `no`, 173 `no
  comprobado`**. Evidencia: **118 registros** (101 `keep`, 10 `merge`, 7
  `purge`). Filas fuera del geo-check: **35**; avisos de data-quality: **32**.
  Quedan 31 filas de charcutería.
- Tras LE-08 y LE-09 (2026-07-26): **229 filas** (−2 purgas); **98
  `pendiente`, 18 `parcial`, 113 `verificado`**. Venta online: **77 `sí`
  (77/77 con canal), 1 `no`, 151 `no comprobado`**. Evidencia: **149
  registros** (129 `keep`, 11 `merge`, 9 `purge`). Filas fuera del geo-check:
  **26**; avisos de data-quality: **31**. **Bloque de charcutería cerrado:
  queda 1 pendiente documentada** de las 41 filas revisadas. Lo que falta es
  fruta y verdura (21), miel (19), dulces (15), legumbres (11), pan (10) y 21
  filas menores.
- Tras LE-10 (2026-07-26): **221 filas** (−8 purgas); **81 `pendiente`, 22
  `parcial`, 118 `verificado`**. Venta online: **82 `sí` (82/82 con canal), 1
  `no`, 138 `no comprobado`**. Evidencia: **170 registros** (142 `keep`, 11
  `merge`, 17 `purge`). Filas fuera del geo-check: **23**; avisos de
  data-quality: **25**. **Bloque de fruta y verdura cerrado**, con 4 pendientes
  documentadas. Quedan miel (19), dulces (15), legumbres (11), pan (10) y 21
  filas menores.
- Tras LE-11, LE-12 y LE-13 (2026-07-26): **216 filas** (−5 purgas); **35
  `pendiente`, 33 `parcial`, 148 `verificado`**. Venta online: **101 `sí`
  (101/101 con canal), 1 `no`, 114 `no comprobado`**. Evidencia: **225
  registros** (190 `keep`, 14 `merge`, 21 `purge`). Filas fuera del geo-check:
  **7**; avisos de data-quality: **14**. **Miel, dulces y chocolate, y legumbres
  y huevos cerrados.** Queda pan y pastelería (10), cerveza (6) y 15 filas
  menores, más los residuales documentados.
- **Cierre de la 1ª pasada (2026-07-26)**: **214 filas** (de 240; −23 purgas y
  −3 fusiones de filas duplicadas); **14 `pendiente`, 39 `parcial`, 161
  `verificado`**. Venta online: **108 `sí` (108/108 con canal), 1 `no`, 105 `no
  comprobado`**. Evidencia: **252 registros** — 214 `keep` (cobertura
  **214/214**), 23 `purge` y 15 `merge`.
  **Cero avisos de data-quality, cero filas fuera del geo-check, cero avisos de
  distancia, ningún dominio, teléfono ni descripción repetidos y ninguna
  descripción de plantilla.** `verify:data` verde sobre los 50 CSV.
  **León entra en `data/evidence/coverage.json`**: el criterio del contrato es
  que el ledger cubra todas las filas actuales (214/214 con `keep`), no que no
  queden `pendiente`. Las 14 pendientes tienen su propio `keep` documentando el
  bloqueo, igual que en Segovia y Zaragoza, que están en la lista con 7 y 27
  pendientes. Alicante y Burgos sí quedan fuera, pero porque sus pendientes no
  tienen registro de evidencia, no por ser pendientes.
- **Encaje de las envasadoras resuelto (2026-07-26)**: envasar cuenta como
  producir en León por excepción de provincia (Reglas locales, punto 11).
  Arconada pasa a `verificado` y las otras seis filas afectadas siguen en
  `parcial` por tener la web caída, no por encaje. Queda en **161 `verificado` y
  39 `parcial`**.

## Reglas y riesgos locales

1. **El volcado declara su propia procedencia y son dos fuentes distintas.** La
   descripción de plantilla acaba en «revisado con X»: **109 Google Maps**, 55
   Tierra de Sabor, 42 DO Bierzo, 17 DO León, 5 Productos de León, 4 IGP Cecina
   de León, 2 IGP Mantecadas de Astorga y 6 sin marca. Los dos estratos fallan
   de forma distinta: el de registro/DO acredita existencia pero no actividad ni
   canal (techo `parcial`), y el de Google Maps trae **sitios reales que no son
   productores** — fruterías, charcuterías de despacho, tiendas gourmet. La
   marca de la descripción es la primera pista de qué hay que probar.
2. **`municipio` es la localidad de la dirección de Google, no el término.**
   **73 filas (30 %) escapan al geo-check** con 57 nombres que son pedanías,
   barrios o entidades locales menores. Los bloques grandes: Valtuille de Abajo
   (6) y Pieros y Quilós de Villafranca del Bierzo; Parandones (4), Otero,
   Villadecanes y Toral de los Vados; San Andrés de Montejos, Fuentesnuevas y
   Dehesas de Ponferrada; Armunia, Oteruelo de la Valdoncina y Trobajo del
   Camino de León y San Andrés del Rabanedo; Geras (2) de La Pola de Gordón;
   Pradorrey y San Román de la Vega de Astorga; Ribaseca (2) de Santovenia.
   Se corrigen en el lote de cada fila poniendo el término real y dejando la
   localidad en `direccion`; se renombra el slug solo si es materialmente falso.
3. **Además hay ruido de formato en `municipio`**: `Toral De Los Vados
   (Capital)`, `Pajares De Los Oteros` junto a `Pajares de los Oteros`,
   `Villadangos del Paramo` sin tilde y `leon` en minúscula en Madre Esla, que
   es también la única fila **sin lat/lon**.
4. **`Venta online` está sin investigar, pero honestamente.** 239 filas dicen
   `no comprobado`, que es el valor por defecto del contrato, y la única `sí`
   (Soto del Vicario) no tiene canal. No hay interpolación que deshacer: hay
   240 filas que resolver desde cero.
5. **`descripcion` y `horario` son plantilla o scrape.** 234 de 240
   descripciones repiten «…incorporado al catálogo provincial de León»; el
   `horario` son 181 tablas copiadas de Google y 56 «Consultar web o venta
   directa». Ninguno aporta información verificada.
6. **Bodega es un tercio del CSV (81 filas)** y se parte en dos denominaciones
   con riesgo distinto: **DO Bierzo** (~55, Villafranca, Valtuille, Cacabelos,
   Carracedelo, Ponferrada, Parandones) y **DO Tierra de León** (~20,
   Valdevimbre, los Oteros, Villamañán). El riesgo aquí no es la existencia
   —los consejos reguladores publican registro— sino la pedanía y el techo
   `parcial` de quien no tiene web viva.
7. **Fruta y verdura (21 filas) es el bloque con más purga esperada.** Hay
   mayoristas que lo declaran en su propio nombre (Frutas Badal, «Mayorista de
   frutas y verduras»), centrales hortofrutícolas B2B (Cofrubi, Ibsa, Fruti
   Bierzo), un grupo nacional (Frutas El Bierzo → grupofruasa) y cinco
   fruterías de León capital sin web (Frutas Almi, Frutas Oliver, La Huerta de
   Juanín, La Huerta de la Abuela, La Huerta del Abuelo). Acopio o reventa sin
   producción propia es `purge`; conservas y castaña con marca propia se
   quedan.
8. **Una fila es la propia IGP, no un productor**: `IGP Mantecadas de Astorga`.
   Candidata a `purge:not-producer` salvo que sea el consejo con obrador.
9. **Duplicado declarado por teléfono**: `cecina-en-leon-geras` y
   `entrepenas-geras` comparten el 987597090 y el mismo pueblo (Geras). Hay que
   decidir si son dos unidades o una con dos marcas.
10. **Web cruzada a otra provincia**: Soto del Vicario (San Clemente, Bierzo)
    trae `tienda.pagodelvicario.com`, y Pago del Vicario es de Ciudad Real.
    Verificar si es matriz de grupo antes de dar el dominio por bueno.
11. **Envasar cuenta como producir en León, por excepción de provincia**
    (decisión editorial del 2026-07-26). La legumbre de La Bañeza y el Páramo y
    la fruta del Bierzo se comercializan a través de envasadoras y centrales que
    compran a los agricultores de la zona, seleccionan y envasan con marca
    propia; sin ellas la provincia perdería la identidad de mercado de sus dos
    productos con marca de calidad. **No es un cambio del criterio general de
    `docs/EDITORIAL_POLICY.md`**: es una excepción acotada a esta provincia y a
    estas dos cadenas. La línea sigue estando en el origen del producto y en la
    marca propia, así que se mantienen fuera el mayorista que compra a
    proveedores anónimos (Frutas Badal, Frutas El Bierzo, Frutas Los Brezos), el
    distribuidor de mil referencias (Legumbres El Leonés) y el embotellador de
    vino a granel que reparte licores y conservas a hostelería (Bodegas Vinor).
    Afecta a siete filas: Arconada, El Maragato, Luengo y El Peregrino en
    legumbre, y Cofrubi, Frutibierzo y Val de Ornedo en fruta.
12. Señales baratas que **sí** salen limpias: **189 dominios, los 189 únicos**
    (ningún dominio repetido, ninguna web de directorio), 240/240 con `direccion`
    y `productos estrella`, 235/240 con `place_id` de Google y 239/240 con
    lat/lon. El volcado partió de sitios reales: el trabajo es de encaje y
    canal, no de descartar nombres inventados.

## Worklist

| Lote | Alcance | Filas | Estado | Riesgo principal |
|---:|---|---:|---|---|
| LE-00 | Higiene, snapshot y partición | 240 | ✅ 2026-07-26 | 236 pendientes; 240 VO sin resolver; 73 filas fuera del geo-check |
| LE-01 | Lácteos y quesos | 19 | ✅ 2026-07-26 | 16 verif, 1 parcial, 2 purgas; 10 municipios corregidos |
| LE-02 | Bodega — Villafranca, Valtuille, Arganza, Corullón y Sancedo | 20 | ✅ 2026-07-26 | 16 verif, 4 parcial; 9 municipios corregidos, 2 slugs renombrados |
| LE-03 | Bodega — Cacabelos, Camponaraya, Carracedelo y Toral de los Vados | 21 | ✅ 2026-07-26 | 19 verif, 2 parcial; 8 municipios corregidos por el cambio de nombre de 2010 |
| LE-04 | Bodega — DO Bierzo, Ponferrada y alto Bierzo | 10 | ✅ 2026-07-26 | 9 verif, 1 parcial; cierra la DO Bierzo (52 bodegas) |
| LE-05 | Bodega — D.O. León: Valdevimbre, Villamañán y entorno de la capital | 13 | ✅ 2026-07-26 | 8 verif, 3 parcial, 1 purga, 1 fusión; 3 certificados caducados |
| LE-06 | Bodega — los Oteros, Valderas y sur; cierra el bloque | 17 | ✅ 2026-07-26 | 13 verif, 2 parcial, 2 purgas; un concesionario de coches y una tienda de marca |
| LE-07 | Charcutería — León capital y el duplicado de Geras | 10 | ✅ 2026-07-26 | 5 verif, 1 parcial, 1 pend, 2 purgas, 3 fusiones; 3 filas eran el despacho, no el obrador |
| LE-08 | Charcutería — Astorga, Maragatería y el Órbigo | 13 | ✅ 2026-07-26 | 13 verif; 5 municipios corregidos, Castanoble resuelto |
| LE-09 | Charcutería — resto de la provincia; cierra el bloque | 17 | ✅ 2026-07-26 | 14 verif, 1 parcial, 2 purgas (matadero y grupo avícola) |
| LE-12 | Dulces y repostería — Mantecadas de Astorga IGP | 8 | ⏳ | Una fila es la propia IGP |
| LE-13 | Dulces y repostería y chocolate — León capital | 11 | ⏳ | Confiterías: obrador propio o despacho |
| LE-10 | Fruta y verdura | 21 | ✅ 2026-07-26 | 5 verif, 4 parcial, 4 pend, 8 purgas; el bloque de purga que anunciaba LE-00 |
| LE-11 | Miel — Montaña de León y Bierzo | 19 | ✅ 2026-07-26 | 13 verif, 3 parcial, 2 pend, 1 purga; 9 municipios corregidos |
| LE-12 | Dulces, repostería y chocolate | 19 | ✅ 2026-07-26 | 11 verif, 4 parcial, 2 pend, 2 purgas; el consejo de la IGP era fila |
| LE-13 | Legumbres y huevos | 15 | ✅ 2026-07-26 | 6 verif, 4 parcial, 3 pend, 2 purgas; envasadora ≠ productor |
| LE-14 | Pan y pastelería | 10 | ✅ 2026-07-26 | 4 verif, 3 parcial, 2 pend, 1 purga (obrador en Zamora) |
| LE-15 | Cerveza, licores, sidra y despensa | 13 | ✅ 2026-07-26 | 6 verif, 6 parcial, 1 purga (cervecera gallega); 5 recategorizadas |
| LE-16 | Cierre: reauditoría y las 3 filas heredadas como parcial | 217 | ✅ 2026-07-26 | Geo-check y data-quality a cero; 214/214 con `keep` |

## LE-00 — Higiene, snapshot y partición

Cerrado el 2026-07-26. Sin cambios en datos: solo diagnóstico y partición.

Hallazgos que condicionan toda la pasada, en Reglas locales. En una línea: el
CSV de León **no es un volcado inventado sino una fusión de dos scrapes
buenos** —Google Places y los registros de DO/IGP/Tierra de Sabor— y por eso
sus defectos son sistemáticos y no aleatorios: la localidad puesta como
término municipal (73 filas), el encaje sin comprobar en el estrato de Google
Maps, y `Venta online` intacto en las 240 filas.

La provincia se concentra en **bodega (81)**, **charcutería (43)**, **fruta y
verdura (21)**, **miel (19)** y **lácteos y quesos (19)**, que definen la
partición de arriba.

## LE-01 — Lácteos y quesos

Decisiones cerradas el 2026-07-26 sobre las 19 filas del bloque: **16
verificadas, 1 parcial y 2 purgas**.

- `verificado` + ecommerce (9): Zarandiel, Praizal, Soterano, Gabino Pérez,
  Facendera, Abuelo Aitalas, Los Payuelos, La Moldera Real y Manzer.
- `verificado`, venta no comprobada (6): Coladilla, Quesos La Prada, Quesos La
  Presa, Industrias Lácteas San Vicente, Picos de Europa y Madre Esla.
- `verificado`, venta `no` (1): Vallelongo.
- `parcial` (1): Veigadarte.
- `purge:not-producer` (2): Don Queso Quesos Tori y La Quesería Quesísimo.
- `merge`: `madre-esla-cooperativa-vega-esla-leon` →
  `madre-esla-cooperativa-vega-esla-toral-de-los-guzmanes`.

Incidencias reutilizables:

- **Diez de las diecinueve filas tenían una localidad como `municipio`**, más de
  la mitad del bloque: Ambasmestas→Vega de Valcarce, Barrillos de
  Curueño→Santa Colomba de Curueño, Coladilla→Vegacervera, Jabares de los
  Oteros→Cabreros del Río, Los Espejos de la Reina→Boca de Huérgano, Matallana
  de Valmadrigal→Santa Cristina de Valmadrigal, Navatejera→Villaquilambre,
  Robles de la Valcueva→Matallana de Torío, Sahechores→Cubillas de Rueda y
  Saelices del Payuelo→Valdepolo. En los diez se conservó el slug y la localidad
  pasó a `direccion`: la web del ayuntamiento («Los pueblos del municipio») es
  la fuente más barata y directa para resolverlo.
- **La única purga de municipio materialmente falso fue Madre Esla**, que traía
  `leon` en minúscula, sin lat/lon y con una ficha del directorio británico
  `gff.co.uk` como `web`. La cooperativa Vega Esla está en Toral de los
  Guzmanes: se renombró el slug con `merge` y se rellenaron web, teléfono,
  correo y coordenadas.
- **Las dos purgas son el riesgo del estrato de Google Maps.** Don Queso Quesos
  Tori (tres tiendas en el centro de León desde 1950) y La Quesería Quesísimo
  son queserías en el sentido de *tienda*, no de obrador: la segunda lo dice en
  su propia web —«seleccionamos pieza a pieza quesos de queserías artesanas de
  toda España»— y la primera consta con CNAE de comercio al por menor. En
  castellano «quesería» tapa las dos cosas y el volcado no distinguió.
- **Un 403 con verificación anti-bot no se puede resolver leyendo el sitio.**
  `donquesotori.com` devuelve 403 a la herramienta y muro anti-bot en el
  navegador; la decisión se sostuvo en fuentes de apoyo (ficha sectorial,
  Páginas Amarillas, prensa local) que coinciden en la actividad minorista.
- **Un certificado caducado no mata al productor, solo a ese dominio.** Quesos
  Manzer traía `quesosmanzer.es` con certificado expirado; el sitio vivo es
  `quesosmanzer.com`, con carrito y precios. Mismo patrón por redirección en
  Zarandiel: `zarandiel.es` responde 301 a `zarandiel.com`.
- **Un 404 en la ruta esperada de la tienda no cierra la pregunta.** En Praizal
  fallaron `/tienda/` y `/tienda-online/`; la tienda real cuelga de
  `/es/tienda`, con envío de 6 € y gratis desde 50 €.
- **Que un producto se venda online no es que el productor venda online.**
  Veigadarte aparece en varias tiendas bercianas de terceros y en su día llegó a
  exportar 2.000 kg/mes a Nueva York, pero no tiene dominio propio: identidad y
  actividad quedan acreditadas por prensa y directorio (fuentes de apoyo), así
  que su techo es `parcial` y su venta `no comprobado`.
- **Una declaración expresa de que no se atienden pedidos sí es un `no`.**
  Vallelongo publica que «nuestra producción está comprometida y no podemos
  atender pedidos de clientes nuevos». Es ausencia declarada de canal, no un
  fallo técnico ni una tienda en mantenimiento.
- **Escala con identidad local se conserva.** Industrias Lácteas San Vicente
  tiene 50-200 empleados y más de 2,5 M€ de facturación, pero es empresa
  familiar fundada en 1957 en Garrafe de Torío, con fábrica en Navatejera, marca
  propia y CNAE de fabricación de quesos. Su web solo publica departamentos
  comercial y export: se queda, con venta `no comprobado`.
- **La columna `correo` estaba a medias y es barata de rellenar**: ocho de estas
  filas publicaban su correo en la propia página de contacto. Abuelo Aitalas
  publica además un teléfono distinto del que traía el volcado.

## LE-02 — Bodega: Villafranca, Valtuille, Arganza, Corullón y Sancedo

Decisiones cerradas el 2026-07-26 sobre las 20 filas de la zona: **16
verificadas y 4 parciales**, sin purgas.

- `verificado` + ecommerce (7): Godelia, Gancedo, Vinos Valtuille, Aníbal de
  Otero, Bodegas Adriá, Demencia de Autor, Olga Verde y Tenoira.
- `verificado` + marketplace propio (1): Pérez Caramés.
- `verificado`, venta no comprobada (7): Pittacum, Cobertizo, Bodegas Estefanía
  (Tilenus), Castroventosa, Estévez, Alberto Ledo y Cantariña.
- `parcial` (4): Descendientes de J. Palacios, Cepall, César Márquez y Mas
  Asturias.
- `merge`: `bodegas-estefania-tilenus-valtuille-de-abajo` →
  `…-ponferrada`, y `demencia-wine-villafranca-del-bierzo` →
  `demencia-de-autor-toral-de-los-vados`.

Incidencias reutilizables:

- **El registro del consejo regulador es la fuente barata del bloque, y en las
  cuatro parciales es la única.** `crdobierzo.es` publica dirección, teléfono,
  correo y web de cada bodega inscrita y resolvió Cepall, César Márquez y Mas
  Asturias, que no tienen sitio propio. Pero **va por detrás y publica dominios
  que ya no son de la bodega**: `bodegacepall.com` es NXDOMAIN y
  `masasturias.com` hoy aloja un blog ajeno sobre reformar una casa en
  Asturias. Un dominio caducado y reregistrado es peor que uno muerto, porque
  responde 200.
- **Registro contra web propia, gana la web propia — y aquí cambió de
  municipio.** El consejo sitúa Bodegas Estefanía en Valtuille de Abajo; el pie
  de `tilenus.com` (© 2025) da Calle la Lechería, 3, Ponferrada, coherente con
  su propia historia: recuperaron una antigua lechería de Dehesas en 1999. El
  viñedo sí está en Valtuille. La fila sigue a la bodega.
- **Tres direcciones para una sola bodega.** Demencia traía «Demencia Wine,
  24500 Villafranca del Bierzo» (sin calle) en el volcado, un piso de Ponferrada
  en su página de contacto y la nave 12B del Pol. Ind. del Bierzo, en Toral de
  los Vados, en el registro del consejo. La nave es la unidad productiva: se
  renombró el slug a su razón social (Demencia de Autor, S.L.) y se movió la
  imagen.
- **Ocho filas tenían localidad por municipio**: Pieros y Quilós son de
  Cacabelos y las cinco de Valtuille de Abajo que se quedan son de Villafranca
  del Bierzo. En este bloque el error del volcado es sistemático: **la DO Bierzo
  se organiza por aldeas de viñedo, y el scrape tomó la aldea**.
- **Dirección compartida no es duplicado.** Aníbal de Otero y Alberto Ledo
  comparten el portal C/ Estación, 6 de Villafranca, y Pérez Caramés está en la
  misma calle. Son tres entidades distintas e inscritas por separado: Bodega y
  Viñedos Hija de Aníbal, S.L. (Elva García Amigo, 2013) y Alberto Álvaro Ledo
  Linares-Rivas. El registro del consejo es lo que lo desambigua.
- **Dos sitios propios vivos solo por HTTP.** `bodegacobertizo.com` presenta en
  HTTPS el certificado comodín de su hosting (piensasolutions) y
  `albertoledo.com` falla el handshake TLS; los dos cargan y son suyos por HTTP.
  Sin abrirlos por otra vía, ambos parecerían dominios muertos. El de Alberto
  Ledo tiene el contenido congelado en 2013 pero sigue inscrito en el consejo:
  contenido viejo no es bodega cerrada.
- **Cuatro maneras distintas de que una tienda no cuente como canal.**
  Estefanía tiene «Añadir al carrito» en portada pero `/tienda/` y `/carrito/`
  dan error crítico de WordPress; Cantariña esconde el catálogo detrás de una
  puerta de edad; Pittacum enlaza a la tienda del grupo
  (`bodega.terrasgauda.com`) y esa URL devuelve un login de WordPress; y
  Estévez vende por Lavinia, que es un minorista independiente. Las cuatro son
  `no comprobado`, ninguna es `no`.
- **Pero un escaparate propio dentro de un mercado sí cuenta.** Pérez Caramés
  enlaza desde su web «Entrar Tienda Virtual» a `bodegas.bio`, donde tiene
  página de bodega con siete referencias de 7 a 18 € y pedido mínimo y envío
  calculados por bodega. Eso es `marketplace`, no reventa de terceros.
- **La tienda casi nunca está en `/tienda/`.** En este bloque falló esa ruta en
  Adriá (las fichas cuelgan de `/product/`), en Cantariña (`/index.php/tienda-2/`)
  y en Gancedo (`/tienda-2/`). Conviene leer el menú antes de dar por muerta una
  tienda.
- **Una bodega de grupo con instalación e identidad propias se conserva.**
  Pittacum es de Terras Gauda desde 2022 pero mantiene bodega en Arganza, marca
  y gama propias.

## LE-03 — Bodega: Cacabelos, Camponaraya, Carracedelo y Toral de los Vados

Decisiones cerradas el 2026-07-26 sobre las 21 filas de la zona: **19
verificadas y 2 parciales**, sin purgas.

- `verificado` + ecommerce (9): Cuatro Pasos, Luna Beberide, Losada Vinos de
  Finca, Ribas del Cúa, Vinos del Bierzo (Vinos Guerra), Bodega del Abad, Casar
  de Burbia, Arturo García, Soto del Vicario y La Serrana.
- `verificado`, venta no comprobada (8): Viñas del Bierzo (Gran Bierzo),
  Verónica Ortega, Mengoba, Luzdivina Amigo, Silva Broco, Vinos de Arganza,
  Álvarez de Toledo, Martínez Yebra y Bernardo Álvarez.
- `parcial` (2): Valle Blanco y Hijos de Lisardo García.
- `merge`: `vinos-de-arganza-toral-de-los-vados-capital` →
  `vinos-de-arganza-toral-de-los-vados`.

Incidencias reutilizables:

- **Ocho filas estaban en un municipio que cambió de nombre en 2010.** El
  municipio de **Villadecanes pasó a llamarse Toral de los Vados**, y el volcado
  usó indistintamente el nombre viejo (Villadecanes ×2), tres de sus localidades
  (Parandones ×4, Otero de Villadecanes) y una forma con basura del scrape
  (`Toral De Los Vados (Capital)`). Todas son la misma entidad. Cuando una fila
  no cuadra con `municipios.json`, merece comprobar si el municipio se
  renombró, no solo si es pedanía.
- **La web propia de una bodega puede seguir escribiendo el municipio viejo.**
  Álvarez de Toledo pone «C/ Río Selmo, 8 - Villadecanes» con © 2026. No es un
  error suyo: es que el nombre anterior sigue siendo el de la localidad.
- **El dominio cruzado a otra provincia era real y no un error.** Soto del
  Vicario traía `tienda.pagodelvicario.com` y un teléfono 926 de Ciudad Real:
  es la bodega del grupo manchego Pago del Vicario en el Bierzo, con finca de
  35 hectáreas, enóloga propia desde 2006 y hotel en San Clemente. Segundo caso
  de la provincia (tras Pittacum) en que un grupo de fuera mantiene una unidad
  con identidad propia. Y San Clemente es localidad de Cacabelos desde los
  años ochenta.
- **Un 500 puede ser del cliente, no del servidor.** `bodegasarturo.com`
  devuelve 500 a la herramienta de fetch y carga perfectamente en navegador,
  con tienda, carrito y precios. Antes de dar un dominio por roto conviene
  probarlo por otra vía.
- **Un dominio puede estar vivo y no contener nada.** `bodegasvalleblanco.com`
  sirve una página de 64 bytes cuyo cuerpo entero es «-», mientras los
  buscadores conservan indexado el sitio anterior con su título. Responde 200 y
  no acredita nada: se vació `web`.
- **La bodega no siempre está donde se cría el vino.** Luna Beberide elabora en
  Cacabelos, cría en un caserón del siglo XVI de Villafranca y almacena en
  Sorribas (Toral de los Vados); Bodegas Estefanía, en LE-02, era el caso
  inverso. La fila sigue a la elaboración.
- **Una «Tienda» sin precios no es un canal.** La de Martínez Yebra son fichas
  con «Ver Ficha Técnica», «Solicitar Más Información» y «Realizar Pedido», sin
  precio ni carrito: `no comprobado`. La de La Serrana, en cambio, sí lo es, y
  vive en `/comprar-vino-del-bierzo/` porque `/tienda/` da 404.
- **La cooperativa más grande de la DO traía el dominio muerto.** Vinos del
  Bierzo S. Coop. (850 viticultores, 40 % de la denominación) llegaba con
  `vinosdelbierzo.com`, que rechaza la conexión; su sitio vivo es
  `vinosguerra.com` y su tienda `tiendavinosdelbierzo.com`. Es cooperativa de
  primer grado que vende con marca propia (Guerra), así que entra. En cambio
  **Viñas del Bierzo ya no es cooperativa**: su aviso legal la identifica como
  S.L., aunque siga desde 1963 con la marca Gran Bierzo.

## LE-04 — Bodega: Ponferrada y alto Bierzo (cierre de la DO Bierzo)

Decisiones cerradas el 2026-07-26 sobre las 10 filas restantes de la
denominación: **9 verificadas y 1 parcial**. Con este lote **quedan revisadas
las 52 bodegas de la DO Bierzo** del CSV.

- `verificado` + ecommerce (6): Valdecontina, 13 Viñas, Encima Wines, Heredad
  Morán & López, Emilio Moro - Bierzo y Dominio de Tares.
- `verificado`, venta no comprobada (3): Akilia, Aurelio Feo y Merayo.
- `parcial` (1): Don Pedrones.

Incidencias reutilizables:

- **Cuando el volcado pone una pedanía, la web del propio productor suele
  escribir el municipio completo.** «Albares de la Ribera, Torre del Bierzo» en
  Valdecontina y «San Andrés de Montejos, Ponferrada» en Bodega Feo. Antes de
  irse al nomenclátor, conviene leer la página de contacto.
- **Un dominio con eñe hay que convertirlo a punycode.** El volcado traía
  `13viñas.com` tal cual, que no resuelve; la forma buena es
  `xn--13vias-zwa.com`. Es el mismo tropiezo que en Segovia con
  `embutidoscañas.es`.
- **Dos formas nuevas de que un dominio propio parezca muerto**: `bodegasmerayo.com`
  hace bucle de redirección entre HTTPS y HTTP para el fetcher (solo se lee en
  navegador) y `bodegafeo.es` presenta el certificado de dondominio. Con
  Cobertizo, Alberto Ledo y Álvarez de Toledo, van ya **cinco bodegas bercianas
  cuyo sitio propio solo es legible por HTTP o por navegador**. En esta DO es la
  norma, no la excepción.
- **Una bodega de grupo con inversión y viñedo propios no es una etiqueta.**
  Emilio Moro - Bierzo, S.L. es sociedad aparte, tiene bodega en la Ctra. de
  Molinaseca de Ponferrada, 8 M€ invertidos, más de 60 hectáreas propias y tres
  godellos con nombre (Polvorete, El Zarzal, La Revelía). Es el tercer caso de
  la provincia, con Pittacum y Soto del Vicario, y el criterio se repite:
  instalación y municipio propios deciden, no el dueño.
- **Una portada de una línea no acredita nada, ni siendo suya.** `donpedrones.es`
  solo dice «Vinos de autor con alma del Bierzo» y enlaza a redes: sin
  dirección, contacto ni tienda. La bodega existe y es de 2013, pero identidad y
  municipio salen del directorio sectorial y de la prensa local, así que el
  techo es `parcial`.
- **Una puerta de edad no siempre esconde el catálogo.** La de Valdecontina deja
  ver la tienda con precios; la de Cantariña (LE-02) no. Merece la pena
  comprobarlo antes de dar la venta por no comprobada.

## LE-05 — Bodega: D.O. León, Valdevimbre, Villamañán y entorno de la capital

Decisiones cerradas el 2026-07-26 sobre las 13 filas del bloque: **8
verificadas, 3 parciales, 1 purga y 1 fusión**.

- `verificado` + ecommerce (6): VILE, Palomares, El Sueño de las Alforjas,
  Tampesta, Cooperativa Vinícola Comarcal de Valdevimbre y Vitalis.
- `verificado` + pedido por correo (1): La Osa Vinos.
- `verificado`, venta no comprobada (1): Leyenda del Páramo.
- `parcial` (3): Señorío de los Arcos, Julio Crespo y Marcos Miñambres.
- `purge:not-producer` (1): Bodegas Vinor.
- `merge`: `francisco-javier-amigo-tejado-trobajo-del-camino` →
  `bodega-luzdivina-amigo-parandones`.

Incidencias reutilizables:

- **El volcado cruzó a un viticultor con un homónimo a 130 km.** «Francisco
  Javier Amigó Tejado» venía con la web de una empresa de instalaciones de
  Trobajo del Camino (`javieramigoinstalaciones.es`) y descripción «revisado con
  DO Bierzo». El registro del consejo lo inscribe en Ctra. Villafranca, 10,
  Parandones: **la dirección exacta de Bodega Luzdivina Amigo**, que fundaron
  los hermanos Miguel Ángel y Javier Amigo. Misma unidad productiva con dos
  inscripciones. Cuando una fila nombra a una persona y no a una marca, hay que
  buscar a qué bodega pertenece antes que fiarse del emparejamiento del scrape.
- **Tres certificados caducados en un solo bloque** (Señorío de los Arcos,
  Marcos Miñambres y, con error crítico de WordPress, Julio Crespo). Los tres
  son bodegas reales, activas e inscritas en la D.O. León, pero sin fuente
  verificante viva su techo es `parcial`. En la D.O. León el registro de
  `doleon.es` es la fuente barata equivalente a `crdobierzo.es` en el Bierzo, y
  además publica la dirección postal completa.
- **El registro corrigió dos municipios que el volcado tenía mal de raíz.**
  Señorío de los Arcos figuraba en Villabalter (San Andrés del Rabanedo) y está
  en Ardoncino, localidad de **Chozas de Abajo**; Julio Crespo figuraba en
  Villalmán y el registro da «24326 Joara, Sahagún» —**Joara se integró en
  Sahagún en 1977**, otro municipio extinto, como Villadecanes en LE-03—. En
  ambos casos la localidad del volcado no pertenecía siquiera al término que
  se le atribuía.
- **La purga de este lote la firmó el propio productor.** Bodegas Vinor se
  describe en su web como empresa que «recibe vinos a granel de alta calidad
  para ser elaborados y embotellados» y distribuye vino de Palacios Remondo y
  Muga, licores de Diageo y Bacardi, agua mineral, sidra asturiana y conservas
  de pescado, con reparto a hostelería. Embotellador de granel y distribuidor
  mayorista: `not-producer`. Era además uno de los cuatro dominios que en LE-00
  parecían de directorio (`vinorleon.es`) y el único que lo era de verdad.
- **«Estamos trabajando en nuestra tienda online, mientras tanto puedes hacer tu
  pedido por e-mail» sí es canal.** La Osa Vinos no tiene carrito, pero publica
  el mecanismo: `email`. Es lo contrario de Leyenda del Páramo, que anuncia
  tienda en un subdominio que devuelve 500 y una página vacía: eso es `no
  comprobado`.
- **Una cooperativa de primer grado con marca propia entra.** La Vinícola
  Comarcal de Valdevimbre canaliza 250 socios y 400 hectáreas y vende como
  Señorío de Valdés, San Tirso y Abadía de Balderedo. Llegaba sin web y su
  dominio no casa con el nombre (`vinicoval.com`), un patrón que en otros lotes
  hizo sospechar de cruce y aquí es simplemente la marca corta.
- **En Valdevimbre el nombre engaña en la otra dirección**: las cuevas del
  pueblo son restaurantes, así que «Bodega Palomares» parecía mesón. Es bodega
  con viñedo propio y tienda.

## LE-06 — Bodega: los Oteros, Valderas y sur (cierra el bloque)

Decisiones cerradas el 2026-07-26 sobre las 17 filas restantes: **13
verificadas, 2 parciales y 2 purgas**. **El bloque de bodega queda cerrado: 0
pendientes de 74 filas.**

- `verificado` + ecommerce (10): Vinícola Valmadrigal, 100 Cepas, Gordonzello,
  Pincerna, El Capricho, Finca Valdemora, Pardevalles, Margón, Cooperativa los
  Oteros y Jagatas.
- `verificado` + formulario de pedido (1): Vinos Ribera del Cea.
- `verificado`, venta no comprobada (2): Bodegas Peláez y Agua del Teleno.
- `parcial` (2): Solotero y Cascallana.
- `purge:not-producer` (2): M de Michaisa y Prada a Tope León.

Incidencias reutilizables:

- **Una fila del CSV era un concesionario de coches.** «M de Michaisa» no tenía
  web y el volcado la marcó «revisado con DO Bierzo» estando en la Avenida de
  Antibióticos de León. Su Instagram se presenta como «Vehículos de ocasión y
  **km 0**, venta de mobil-home, importación de vehículos» y publica el mismo
  teléfono que traía la fila. Michaisa es un cruce de la ciudad, no una marca de
  vino. Sin web, la única señal barata para desmentirla fue el teléfono.
- **La tienda de una marca famosa no es la marca.** Prada a Tope figuraba en la
  calle Alfonso IX de León capital, que es su restaurante-tienda; la bodega, el
  obrador de conservas y el viñedo están en el Palacio de Canedo (Arganza). Su
  «web» era además una página de Canva con una sola línea de texto, el mismo
  patrón que Huerta y Pico en Segovia. **La bodega de Canedo no está en el CSV**
  y queda como alta pendiente.
- **Dos dominios casi idénticos para dos negocios del mismo dueño.**
  `fincavaldemora.com` es una finca de eventos con restaurante y
  `bodegafincavaldemora.com` la bodega de 2017. El volcado se quedó con el
  primero, que no menciona vino.
- **El aviso de distancia del geo-check tenía razón.** Pardevalles era la única
  fila de la provincia a más de 15 km de su centroide (19,1 km de León, 2,0 km
  de Valdevimbre) y su propia dirección ya decía «Lugar Valdevimbre» con CP
  24230. Corregida, **la provincia se queda sin ningún aviso de distancia**.
- **Bodegas Peláez estaba en la ciudad y la bodega en la ribera.** El volcado la
  puso en C/ Rey Monje, León, y su web dice que elabora en **Grajal de la
  Ribera**, localidad de La Antigua, a 80 km. Tercer caso del bloque en que la
  fila apuntaba a un punto de venta urbano en vez de a la unidad productiva.
- **Dos filas no eran vino y ya tenían categoría propia en la taxonomía.**
  Agua del Teleno es un manantial y planta embotelladora de agua mineral
  (categoría `Agua mineral natural`) y Cascallana es sobre todo destilería de
  orujo (`Destilados y licores`). El Capricho, en cambio, se recategoriza a
  `Carnes`: es la casa de bueyes de José Gordón, que cría, sacrifica y madura
  con marca propia y vende en su tienda online. El restaurante no le da entrada
  al catálogo; la maduración con marca propia sí, por el mismo criterio que las
  cárnicas de Segovia.
- **Un formulario que detalla botellas y cajas es canal.** Vinos Ribera del Cea
  no tiene carrito pero publica pedido mínimo de 12 botellas y un formulario
  donde se especifica cuántas de cada vino: `email`, igual que La Osa en LE-05.
- **Dos correos del volcado eran de terceros o genéricos**: Pincerna traía el
  gmail personal de un distribuidor (`gabriel@dvino.com`) y 100 Cepas un
  `bodeluva@gmail.com` que su web no publica. Merece la pena contrastar también
  el correo, no solo la web.

## LE-07 — Charcutería: León capital y el duplicado de Geras

Decisiones cerradas el 2026-07-26 sobre las 10 filas del bloque: **5
verificadas, 1 parcial, 1 pendiente documentada, 2 purgas y 3 fusiones**.

- `verificado` + ecommerce (5): Bueyes de León, Panizo, La Artesa Selección,
  Embutidos Agustín y Entrepeñas.
- `parcial` (1): Embutidos El Montañés.
- `pendiente` documentada (1): Embutidos de León.
- `purge:not-producer` (2): La Casa del Embutido y La Cilla de Feito.
- `merge` (3): `cecina-en-leon-geras` → `entrepenas-geras`,
  `la-despensa-…-el-montanes-…-leon` → `embutidos-el-montanes-vegacervera` y
  `sorrento-embutidos-agustin-leon` → `embutidos-agustin-carrizo-de-la-ribera`.

Incidencias reutilizables:

- **Tres de las ocho filas de la capital eran el despacho, no el obrador.** El
  Montañés se elabora en Vegacervera y «La Despensa» es su tienda del Duque de
  Rivas; Embutidos Agustín fabrica en Villanueva de Carrizo y «Sorrento» es su
  despacho de la Avenida Lancia. Las dos filas se **trasladan a la unidad
  productiva**, con slug, municipio, coordenadas e imagen. Es el mismo patrón
  que Valdenebro en Segovia, y en León se agrava porque el Barrio Húmedo
  concentra despachos de marcas de toda la provincia.
- **En León «cecina» y «embutidos» en el rótulo no dicen nada sobre quién
  elabora.** La señal que separa tienda de obrador es el **surtido**: La Cilla
  de Feito vende once cecinas distintas —vaca, burro, ciervo, jabalí, toro de
  lidia, chivo, oveja, buey, búfalo, caballo y angus—, 35 chorizos y 10
  salchichones. Nadie cura eso; se selecciona. La Casa del Embutido lo dice sin
  rodeos en su web: «una selección de los mejores embutidos y quesos de León».
- **El único teléfono repetido de la provincia, que LE-00 marcó como duda, era
  real.** `cecinaenleon.es` lleva en el pie «ENTREPEÑAS SL» y publica la misma
  calle y el mismo número que Entrepeñas: es su **marca de distribución
  multimarca** a hostelería, que vende además bresaola y cecinas de terceros.
  Misma sociedad y misma dirección, así que fusión, no purga.
- **Una fila era charcutería solo en la categoría.** La Artesa Selección es la
  marca de Manga Martínez, S.L., que cocina al vacío cochinillo, lechazo,
  cabrito y bacalao: pasa a `Comida preparada`.
- **Un nombre genérico bloquea la verificación.** «Embutidos de León» llegó sin
  calle, sin web y sin redes, y su nombre es el del producto: no hay búsqueda
  que lo distinga, y el teléfono no devuelve empresa. Queda `pendiente`
  documentada, no purgada: la falta de rastro no prueba inexistencia.
- **Lo contrario también pasa: dos filas con pinta de tienda urbana sí
  elaboran.** Bueyes de León declara controlar «desde la cría hasta el
  envasado» en dehesas leonesas, y Panizo elabora y despacha en dos puntos de
  la capital, uno de ellos el mercado del Conde Luna.

## LE-08 y LE-09 — Charcutería: el resto de la provincia (cierra el bloque)

Decisiones cerradas el 2026-07-26 sobre las 30 filas restantes: **27
verificadas, 1 parcial y 2 purgas**. **El bloque de charcutería queda cerrado
con una sola pendiente documentada** de 41 filas revisadas.

- `purge:out-of-scope` (2): Grupo Oblanca y Embutidos Carracedo Llamas.
- `parcial` (1): Cecinas Leitariegos.
- `merge`: `embutidos-pajariel-ponferrada` → `embutidos-pajariel-bembibre`.
- Las otras 27 quedan `verificado`; **19 con canal demostrado**.

Incidencias reutilizables:

- **La categoría del volcado escondía dos exclusiones de manual.** Grupo
  Oblanca (110 M€, 500 empleados, 1.500 referencias) es un grupo avícola y
  distribuidor de congelado, marisco, verdura y bollería a hostelería, con la
  charcutería como una marca más; y Embutidos Carracedo Llamas, pese al nombre,
  tiene por actividad registrada el comercio mayorista de carne y el
  **sacrificio de vacuno y equino**: es el adjudicatario del matadero municipal
  de León. Ninguno de los dos se descubre por la web —Oblanca la tiene
  impecable—, sino por lo que declaran hacer.
- **Un dominio que apunta a otra provincia puede ser solo la sede social.**
  Castanoble publica un domicilio en el Passeig Torras i Bages de Barcelona,
  pero su página de contacto distingue administración (Barcelona) de **centro de
  producción (Avenida de Astorga, 13, Riego de la Vega)**, con 5.000 m² de
  saladero, secadero natural y bodega de afinado. Nació en 1973 como jamonería
  barcelonesa y se integró verticalmente con este secadero leonés. Tercer caso
  de la provincia —con Pittacum y Soto del Vicario— en que la matriz de fuera no
  descalifica la fila.
- **La escala vuelve a decidirse por identidad, no por tamaño.** Se conservan
  Embutidos Rodríguez (60.000 m², más de setenta países, pero familiar de La
  Bañeza desde 1910) y Pajariel (15.000 m², BRC e IFS, desde 1945), y se purga
  el grupo que ya no tiene producto propio identificable.
- **Nueve municipios más corregidos**, todos por el mismo mecanismo: Celada y
  San Román de la Vega son de San Justo de la Vega, Pradorrey de Brazuelo,
  Priaranza de la Valduerna de Luyego, Villoria de Órbigo de Villarejo, Azadinos
  de Sariegos, Ocero de Sancedo, San Román de Bembibre de Bembibre y Villaobispo
  de las Regueras de Villaquilambre. Más la tilde de Villadangos del Páramo.
- **Dos filas estaban en la fábrica equivocada de la misma empresa.** Pajariel
  tiene sede en el polígono del Bierzo Alto (Bembibre) y oficina en Ponferrada,
  y el volcado se quedó con la oficina; Cecinas Ezequiel tiene dos fábricas y su
  web publica la de Villamanín, no la del polígono de La Robla que traía la
  fila. En Pajariel se traslada y se renombra; en Ezequiel se corrige solo el
  municipio, porque las dos plantas son suyas.
- **Un claim dinámico que había que comprobar sí o sí.** La fábrica de Embutidos
  Santa Cruz de Montes ardió en julio de 2023. Su web —viva solo por HTTP—
  publica hoy la parcela Q11 del polígono del Bierzo Alto, y la prensa local
  documenta la reconstrucción: sigue activa, así que `verificado` y no purga por
  cierre.
- **Una tienda de demostración con precios a cero también es canal si dice cómo
  pedir.** Hijos de Francisco Miguel muestra todos los productos a «0,00 €» y
  avisa en el pie: «Esta es una tienda de demostración - Para realizar pedidos
  contacte con el Teléfono». Sin checkout, pero con canal publicado: `telefono`.
- **Y una carnicería que sí se hizo obrador.** Hompanera nació en 1974 como
  Carnicería Miguel y hoy es fábrica con tienda propia: el caso simétrico de los
  despachos de la capital de LE-07.

## LE-10 — Fruta y verdura

Decisiones cerradas el 2026-07-26 sobre las 21 filas del bloque: **5
verificadas, 4 parciales, 4 pendientes documentadas y 8 purgas**. Es la tasa de
purga más alta de la provincia (38 %) y confirma el diagnóstico de LE-00.

- `verificado` + ecommerce (5): Ibsa Bierzo, Conservas Vegaesla, La Huerta de
  Fresno, Patatas Hijolusa y Castañas Campelo.
- `parcial` (4): Cofrubi, Val de Ornedo, Frutibierzo y La Huerta de Ana Mary.
- `pendiente` documentada (4): La Huerta del Abuelo, La huerta, Huerta grande y
  Huertas El Caserío.
- `purge:not-producer` (7): Frutas Badal, Frutas Almi, Frutas El Bierzo, Frutas
  Los Brezos, Frutas Oliver, La Huerta de Juanín y La Huerta de la Abuela.
- `purge:nonexistent` (1): Huerta Vizconde 7.

Incidencias reutilizables:

- **Una fila no era un negocio sino una dirección.** «Huerta Vizconde 7» es la
  **Urbanización de Huerta la Vizconde** de Santovenia de la Valdoncina, y el 7
  es el portal. El scrape convirtió un nombre de calle en un productor, y por eso
  llegó sin nombre comercial, sin teléfono y sin web. Es el primer
  `purge:nonexistent` de la provincia.
- **La firma del artefacto es la ausencia total de contacto.** Cinco filas
  llegaron sin teléfono, sin web y sin imagen; cuatro de ellas con nombre
  genérico («La huerta», «Huerta grande», «Huertas El Caserío», «La huerta de la
  Abuela»). De esas cuatro solo se pudo resolver la de la capital, que es
  frutería. Las otras tres quedan `pendiente` documentadas y son las candidatas
  más claras a purga de la segunda pasada: **un nombre genérico no es un nombre
  comercial**.
- **En León capital, «huerta» en el rótulo significa frutería.** Las cinco filas
  de la ciudad con ese nombre o con «Frutas X» eran comercio minorista o
  mayorista de Mercaleón. Ninguna cultiva.
- **Tres mayoristas lo dicen en su propia web** y uno hasta en el nombre de la
  fila: Frutas Badal es «empresa mayorista de fruta en León», Frutas El Bierzo
  es la delegación del Grupo Fruasa en los puestos 12-15 de **Mercaleón** con
  «actividad basada en la distribución», y Frutas Los Brezos es «distribuidor
  mayorista… en Burgos». Cuando la web habla de proveedores y de reparto a
  hostelería y colectividades, no hay huerta detrás.
- **Pero tres centrales frutícolas sí entran, por ser la identidad de mercado de
  sus socios.** Cofrubi, Frutibierzo (Cefrubierzo, **S.A.T. 916**) y Val de
  Ornedo confeccionan y venden con marca propia la pera conferencia y la manzana
  reineta del Bierzo de sus socios. Se quedan en `parcial`: ninguna vende a
  consumidor y las tres tienen la web caída o congelada (certificado del hosting
  en Cofrubi, caducado en Frutibierzo, inexistente en Val de Ornedo). El encaje
  queda anotado como duda.
- **Cuatro filas eran conservera, no hortícola.** Ibsa (Industrias del Bierzo,
  salsas y conservas), Vegaesla y La Huerta de Fresno pasan a `Conservas
  vegetales`, y Castañas Campelo a `Frutos secos`. Las tres conserveras declaran
  cosecha propia; es lo que las separa de los mayoristas.
- **La escala se resuelve otra vez por lo que declaran hacer.** Patatas Hijolusa
  es envasadora de 23.500 m², pero su propia descripción empieza por el
  **cultivo** y mantiene contratos con sus agricultores y agrónomos que
  supervisan desde antes de la siembra: se conserva. Es el mismo razonamiento que
  dejó dentro a Embutidos Rodríguez y fuera a Grupo Oblanca.
- **Una duda de encaje que no se pudo cerrar:** La Huerta de Ana Mary vende
  hortaliza «de la vega de Fresno» con precios por kilo y opción de mayorista,
  pero en ninguna sección afirma cultivar. Identidad y municipio sí, actividad
  productiva no: `parcial`, y la venta `no comprobado` porque si es reventa no
  sería canal del productor.

## LE-11 — Miel

Decisiones cerradas el 2026-07-26 sobre las 19 filas: **13 verificadas, 3
parciales, 2 pendientes documentadas y 1 purga**.

- `verificado` con canal (9): Teleno Miel, La Cazurra, Cuna del Cea, El Ramayal,
  La Priorina, Los Zánganos, Miel Panera, Ribera del Torío y El Robledal (este
  con escaparate en un marketplace).
- `verificado`, venta no comprobada (4): Labejazul, Miel Milor, Miel de Mieles y
  Miel de Montes.
- `parcial` (3): De Miel Amores, Miel Montañas de León y Miel de León.
- `pendiente` documentada (2): El Faedo y Miel Traslapeña.
- `purge:not-producer` (1): Miel Nature.
- `merge`: `miel-ribera-del-torio-villaquilambre` → `…-matallana-de-torio`.

Incidencias reutilizables:

- **Es el bloque con más pedanías de toda la provincia: nueve de diecinueve.**
  Filiel (Lucillo), Llanos de Alba (La Robla), Morgovejo (Valderrueda), Naredo de
  Fenar (Matallana de Torío), Onamio (Molinaseca), Orzonaga (Matallana de Torío),
  Pobladura de Fontecha (Valdevimbre), Santa Cruz de Montes y Santa Marina de
  Torre (Torre del Bierzo). Lógico: los colmenares están en aldeas de montaña.
  **Naredo de Fenar añade un caso nuevo**: pasó de La Robla a Matallana de Torío
  en 1945, otro cambio de término que el volcado ignora.
- **Y la única fila de la capital era una tienda.** Miel Nature, en la Avenida
  Alcalde Miguel Castaño, tiene actividad registrada de comercio al por menor.
  Tercera vez que se repite el patrón (delicatessen en LE-07, fruterías en LE-10):
  **en León capital el rótulo del producto no acredita producción**.
- **Una fila estaba en el municipio equivocado según su propia web.** Miel
  Ribera del Torío figuraba en Villaquilambre y publica C/ El Sol, 31, Robles de
  la Valcueva, que es de Matallana de Torío.
- **Una contradicción de origen sin cerrar**: Miel de León está domiciliada en
  Pobladura de Fontecha (Valdevimbre, Tierra de León) y su web se titula «Miel
  ecológica del Bierzo» y firma «hecha a mano en El Bierzo», sin dirección
  postal. Queda `parcial` con la venta sí demostrada.
- **Tres apicultores sin web viven en el marketplace.** El Robledal, Montañas de
  León y De Miel Amores se venden a través de Productos Leoneses o de tiendas de
  producto típico. Solo el primero tiene escaparate propio identificable, que sí
  cuenta como canal; los otros dos son reventa de terceros.

## LE-12 — Dulces, repostería y chocolate

Decisiones cerradas el 2026-07-26 sobre las 19 filas: **11 verificadas, 4
parciales, 2 pendientes documentadas y 2 purgas**.

- `purge:not-producer` (1): IGP Mantecadas de Astorga.
- `merge` (2): la segunda fila «Alonso» y el slug sin municipio de Santocildes.
- `parcial` (4): Milagritos, Los Maragatos, Obrador San José y Santa Cecilia.
- `pendiente` documentada (2): Chocolates Ner y Obrador Confiterías León.

Incidencias reutilizables:

- **Una fila era el consejo regulador de la IGP.** «IGP Mantecadas de Astorga»
  es el propio consejo, en C/ Padres Redentoristas, 26, y su web lista a sus
  cinco empresas inscritas —Velasco, Dulma, Los Maragatos, El Arriero Maragato y
  Hojaldres y Mantecadas Alonso—: **las cinco ya eran filas del CSV**, así que la
  fila del consejo era además una duplicación conceptual del bloque. El registro
  sirvió a la vez de purga y de lista de comprobación.
- **El mismo registro delató un duplicado.** El volcado tenía dos filas
  «Alonso», una en el km 326 de Astorga sin teléfono ni web y otra en el km 331
  de Pradorrey con web. Es la misma carretera, la web declara una única
  instalación y el consejo inscribe una sola empresa: fusión.
- **Dos dominios que no casaban con el nombre y no eran cruces.** `merles.es` es
  la web de la Confitería La Flor y Nata porque el Merle es su producto estrella,
  y `chocodulcecabezas.com` es la casa que está detrás de Mantecadas Los
  Maragatos, con la misma dirección exacta. El segundo queda `parcial`: la marca
  está inscrita en la IGP, pero la unidad concreta no se pudo separar.
- **Un slug traía la palabra del rótulo en vez del municipio**:
  `chocolates-santocildes-fabrica`. La prensa documenta su traslado de
  Castrocontrigo al polígono de Onzonilla en 2018, que es donde la sitúa la fila.
- **Cuatro confiterías con obrador y sin web** quedan en `parcial`: en este
  sector los directorios sectoriales (Páginas Amarillas, guías de pastelerías)
  describen el obrador con precisión, pero son fuentes de apoyo.

## LE-13 — Legumbres y huevos

Decisiones cerradas el 2026-07-26 sobre las 15 filas: **6 verificadas, 4
parciales, 3 pendientes documentadas y 2 purgas**.

- `purge:out-of-scope` (1): Huevos Guillén – Cantos Blancos Norte.
- `purge:not-producer` (1): Legumbres El Leonés.
- `parcial` (4): El Maragato, Arconada, Luengo y El Peregrino.
- `pendiente` documentada (3): Granja Avícola Pascual, Matadeón de los Oteros
  Legumbre y Cereales y Legumbres El Canal.

Incidencias reutilizables:

- **La pregunta del bloque es si envasar es producir.** La legumbre de La Bañeza
  y el Páramo se vende a través de envasadoras que compran a los agricultores de
  la zona. El criterio aplicado: **cocer o cultivar sí, seleccionar y envasar no
  basta**. Se quedan `verificado` Polifer (controla «desde la siembra»), Legumbres
  Rosa (vende «directamente de nuestra finca»), La Asturiana y Penelas (cuecen
  además de envasar); quedan `parcial` con la duda anotada Arconada —que declara
  expresamente no cultivar—, El Maragato, Luengo y El Peregrino. **Es la decisión
  de encaje más discutible de la pasada y merece revisión.**
- **El Leonés no era ninguna de las dos cosas**: distribuidora del Grupo Codilex
  con más de mil referencias para el canal profesional y sede en Torrelavega. Y
  el correo que traía la fila era de otra empresa (`selectoscampomar.com`).
- **La portada puede desmentir a la empresa y la página de empresa rehabilitarla.**
  Huevos León solo dice en portada «selección, envasado, distribución y
  comercialización», que apuntaba a purga; su página de empresa aclara que tiene
  complejo integrado avícola propio y granjas de ponedoras en Malillos de los
  Oteros desde 2017. Merece la pena leer más de una página antes de purgar.
- **Una avícola nacional y una granja familiar en el mismo bloque.** Huevos
  Guillén se define como «la empresa líder del sector de la avicultura de puesta
  en España» y su teléfono es un 961 de Valencia: fuera. Granja Rualmar, de 1957
  y dedicada solo al huevo campero, se queda —y además estaba en el municipio
  equivocado: su web da Olleros de Alba (La Robla), no La Magdalena.
- **La firma de LE-10 reaparece intacta en dos filas**: «Matadeon De Los Oteros
  Legumbre» con dirección «LE-6602» y «Cereales y legumbres el canal» con
  «Avenida del Canal, s/n», ambas sin teléfono ni web. Nombre genérico más
  dirección de vía más cero contacto: es el artefacto del scrape.
- **Una `direccion` eran literalmente unas coordenadas.** Legumbres El Peregrino
  traía «42.180036, -5.817025» en el campo de dirección.

## LE-14 y LE-15 — Pan y pastelería, cerveza, licores, sidra y despensa

Decisiones cerradas el 2026-07-26 sobre las 23 filas restantes: **10
verificadas, 9 parciales, 4 pendientes documentadas y 2 purgas**.

- `purge:other-province` (2): Panadería Robles Manganeses y Cerveza AleAlé.
- `merge`: `cerveza-la-corrala` → `cerveza-la-corrala-ponferrada`.
- **Cinco filas cambian de categoría**: Destilería Baelo y Los Prietos a
  `Destilados y licores`, Bubo Babia a `Conservas`, San Agustín a `Café`.

Incidencias reutilizables:

- **Las dos purgas son la primera vez que el volcado se sale de la provincia.**
  El obrador de Panadería Robles está en **Manganeses de la Polvorosa (Zamora)**
  y la fila era uno de sus dos despachos en León; y Cerveza AleAlé publica «Uxes,
  A Coruña», escribe la marca en gallego y se presenta como cervecera gallega.
  Lo llamativo de AleAlé es que el volcado le dio **la misma dirección exacta que
  Belecker** —parcela 51 del polígono de Toral de los Vados—, que sí es de allí:
  probablemente elaboró en sus instalaciones. Cuando dos filas comparten parcela
  y una tiene web de otra provincia, la sospecha correcta es que una es huésped.
- **Tercer dominio con eñe de la provincia.** Confiterías Montañés tiene dos webs
  y las dos raras: `lazosdesanguillermo.es` —el dominio del producto, no de la
  casa, como `merles.es` en LE-12— y `confiteríasmontañés.com`, que solo resuelve
  en punycode. Van ya tres: 13viñas, embutidoscañas (Segovia) y esta.
- **Segundo dominio secuestrado por un casino.** `miguelcasado.es` fue
  reregistrado y hoy es un sitio de reseñas de casinos online; se vacían `web` y
  `correo`. Es el mismo patrón de `masasturias.com` en LE-02 y el que ya apareció
  en Burgos y Baleares: **si el contenido no tiene nada que ver con el productor,
  el dominio caducó**.
- **La tienda cerrada no es la tienda inexistente.** Unión Panadera avisa «esta
  tienda está actualmente cerrada»: indisponibilidad, `no comprobado`. Y su
  propio nombre resolvía el municipio, que el volcado había puesto en León
  capital: está en Trobajo del Camino (San Andrés del Rabanedo).
- **Cuatro filas de cerveza artesana no tienen web** y viven en la prensa local:
  Wolfram (2014, Camponaraya, 20-24.000 l/año) y Belecker (2016, Toral, 30-40.000
  l/año) quedan `parcial` con datos de producción y responsable documentados por
  el reportaje de referencia del sector en Diario de León.
- **Cinco filas estaban en la categoría cajón.** «Despensa artesanal» escondía
  una destilería de orujo de tercera generación, una conservera de mermeladas y
  un tostador de café de especialidad. Como en Segovia, el cajón «Otros» y
  equivalentes es donde se acumulan las categorías que faltan.

## LE-16 — Cierre provincial

Cerrado el 2026-07-26. Reauditoría sobre las 214 filas resultantes:

- **Las tres filas que llegaban ya como `parcial`** —Morcillas Morvega,
  Embutidos La Pradera de Fontún y Embutidos Natalio Fernández— habían quedado
  fuera de todos los lotes, porque la partición filtraba por `pendiente`. Se
  revisaron en el cierre: La Pradera y Natalio pasan a `verificado` (la primera
  con tienda propia) y Morvega se queda en `parcial` por certificado caducado.
  **Lección: partir por categoría es correcto, pero el filtro debe ser «sin
  `keep` en evidencia», no «`pendiente` en el CSV».**
- Evidencia **214/214** con `keep` vigente; 23 `purge` y 15 `merge` como
  tombstones. De los 15 `merge`, tres consolidan filas duplicadas de verdad
  (Cecina en León/Entrepeñas, las dos «Alonso» y Francisco Javier Amigo/Luzdivina)
  y doce son renombrados de slug por municipio equivocado o basura del scrape.
- `check:csv:data-quality` pasa con **cero avisos**: ninguna descripción de
  plantilla, ningún dominio, teléfono ni descripción repetidos, ninguna fila
  fuera del geo-check y ningún aviso de distancia. Se partió de 82 avisos y 73
  filas fuera del geo-check.
- Los 108 `Venta online=sí` tienen canal. Solo se usó `no` una vez, en
  Vallelongo, que declara expresamente no atender pedidos nuevos; en el resto,
  sin prueba de ausencia, el valor honesto es `no comprobado`.
- Ninguna fila conserva un directorio como `web`. De los cuatro dominios que
  LE-00 marcó como sospechosos de directorio, tres eran del productor y solo uno
  —`vinorleon.es`— era realmente un distribuidor, que se purgó.
- Tras la segunda pasada, filas con `correo`: **148 de 210** (se partió de
  79). Filas sin `web`: 39.

## Residuales para la segunda pasada

- **Segunda y tercera pasadas 2026-07-28: 14 → 2 `pendiente`**. Se purgaron seis falsos
  productores: Embutidos de León era La Despensa de Fer, una tienda; Huerta
  Grande es un recinto municipal; Huertas El Caserío es una hacienda de
  eventos; Matadeón de los Oteros Legumbre era el Almacén Campotero; La Huerta
  del Abuelo es una frutería minorista; y el punto de Chocolates Ner corresponde
  actualmente a una clínica sanitaria.
  Se rescataron Miel Traslapeña y Panadería El Manjar a `verificado`, y Obrador
  Confiterías León, Granja Avícola Pascual, El Faedo y Panadería Raquel a
  `parcial`. Quedan solo **La huerta de San Martín de Torres y Cereales y
  Legumbres El Canal**, sin base suficiente ni para verificar ni para purgar.
  Estado provincial: **208 filas; 163 `verificado`, 43 `parcial`, 2
  `pendiente`**.
- **Encaje de las envasadoras: resuelto** el 2026-07-26 a favor de conservarlas
  (ver Reglas locales, punto 11). Arconada pasa a `verificado`; El Maragato,
  Luengo, El Peregrino, Cofrubi, Frutibierzo y Val de Ornedo **siguen en
  `parcial` por la fuente, no por el encaje**: su web es un 500, un 403, un
  certificado caducado, un menú sin contenido o no existe. Son las seis filas
  que más ganarían con un reintento de dominio.
- **Dudas de encaje que siguen abiertas**: Mantecadas Los Maragatos (marca de la IGP
  cuya unidad productiva es Chocodulce Cabezas), La Huerta de Ana Mary (no
  afirma cultivar), Bubo Babia (obrador en Piedrafita de Babia según la prensa,
  Villablino según el registro) y Miel de León (domiciliada en el Páramo y
  autodescrita como del Bierzo).

## LE-17 — Ola 3 · venta sin resolver (2026-07-29)

Segunda pasada sobre las **98 filas con `Venta online=no comprobado`** del
snapshot actual. Se resuelven **12** canales vigentes y atribuibles al productor:

- **7 ecommerce propios:** Tilenus, Cantariña, Confiterías Montañés, Confitería
  Velasco, Legumbres Rosa, Miel Milor y Agua del Teleno.
- **5 pedidos asistidos:** Álvarez de Toledo, Martínez Yebra, Jamones y Cecinas
  Prieto y Embutidos Natalio mediante formulario; Cerveza La Corrala por
  teléfono o correo.

No se limita la pasada al enum. Se sustituyen ocho campos genéricos de producto
por referencias comprables, se añade el correo oficial de Montañés, se
normalizan a HTTPS Agua del Teleno y Martínez Yebra y se publican instrucciones
reales de pedido donde el flujo no es checkout.

Se mantienen sin resolver las tiendas vacías, cerradas o solo anunciadas:
Labejazul muestra productos de distribuidor a 0 €, la tienda de Unión Panadera
declara estar cerrada y Obrador Confitería Asturias no expone todavía un flujo
comprable. La fila `la-huerta-san-martin-de-torres` continúa `pendiente`: la
revisión no encontró una fuente nueva que permita identificarla ni una fuente
exhaustiva que sostenga su purga.

**Estado tras LE-17:** 207 filas; 163 `verificado`, 43 `parcial`, 1 `pendiente`;
venta online en **120 `sí`**, 1 `no` y **86 `no comprobado`**. Las 12 decisiones
positivas tienen canal y evidencia actualizados.
- **43 `parcial`**, la mayoría por no tener fuente primaria viva. Merecen
  reintento los dominios caídos o bloqueados: Señorío de los Arcos, Marcos
  Miñambres, Julio Crespo, Morvega y Sidra Carral (certificado caducado o error
  500), El Peregrino (403 sistemático), Bubo Babia y El Maragato.
- **Dominios a rescatar o vaciar**: Cepall, Mas Asturias, Valle Blanco, Solotero,
  Leitariegos y La Flor de Ribaseca se quedaron sin `web` porque su dominio es
  NXDOMAIN o sirve una página vacía; conviene reintentar por si han vuelto.
- **101 `no comprobado`**: varios son webs sin tienda que podrían tener canal no
  publicado, y unos pocos son tiendas caídas que conviene reintentar (Leyenda del
  Páramo, Bodegas Estefanía, Unión Panadera).
- **68 de 208 filas sin imagen** (33 %). Es el mayor hueco de calidad que deja la
  pasada y no se tocó, salvo el renombrado de las nueve imágenes cuyo slug cambió
  y el borrado de las once de filas purgadas.
- **Altas pendientes detectadas al paso**: la bodega y el obrador de conservas de
  **Prada a Tope en el Palacio de Canedo (Arganza)**, cuya fila purgada era su
  tienda de León capital, no están en el CSV.
