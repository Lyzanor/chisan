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
| LE-02 | Bodega — DO Bierzo, Villafranca y Valtuille | 17 | ⏳ | 6 filas en Valtuille de Abajo, pedanía |
| LE-03 | Bodega — DO Bierzo, Cacabelos, Carracedelo y Parandones | 20 | ⏳ | Parandones y Pieros son pedanías |
| LE-04 | Bodega — DO Bierzo, Ponferrada y bajo Bierzo | 15 | ⏳ | San Andrés de Montejos, Fuentesnuevas, Dehesas |
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
