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
11. Señales baratas que **sí** salen limpias: **189 dominios, los 189 únicos**
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
| LE-05 | Bodega — DO Tierra de León, Valdevimbre y Villamañán | 10 | ⏳ | |
| LE-06 | Bodega — los Oteros, Valencia de Don Juan y sur | 10 | ⏳ | |
| LE-07 | Bodega — León capital y resto de la provincia | 9 | ⏳ | Armunia, Trobajo, Oteruelo, Villalmán |
| LE-08 | Charcutería — IGP Cecina de León y Astorga | 12 | ⏳ | Duplicado Geras; Pradorrey y San Román de la Vega |
| LE-09 | Charcutería — León capital | 11 | ⏳ | Tiendas gourmet del estrato Google Maps |
| LE-10 | Charcutería — resto de la provincia | 12 | ⏳ | Botillo del Bierzo; despachos sin obrador |
| LE-11 | Charcutería — filas sin web ni rastro | 8 | ⏳ | |
| LE-12 | Dulces y repostería — Mantecadas de Astorga IGP | 8 | ⏳ | Una fila es la propia IGP |
| LE-13 | Dulces y repostería y chocolate — León capital | 11 | ⏳ | Confiterías: obrador propio o despacho |
| LE-14 | Fruta y verdura | 21 | ⏳ | Mayoristas, centrales B2B y fruterías: purga alta |
| LE-15 | Miel — Montaña de León y Bierzo | 19 | ⏳ | |
| LE-16 | Legumbres y huevos | 15 | ⏳ | Alubia de La Bañeza IGP; huevos de escala |
| LE-17 | Pan y pastelería | 10 | ⏳ | |
| LE-18 | Cerveza, licores, sidra y despensa | 13 | ⏳ | Cajón heterogéneo, revisar categoría |
| LE-19 | Cierre: reauditoría, reconciliación y cobertura | — | ⏳ | Geo-check a cero y cobertura de evidencia |

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
