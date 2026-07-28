# Verificación provincial de Segovia

Ledger para planificar y reanudar la verificación profunda de
`data/csv/castilla-y-leon/segovia.csv`. El CSV es la fuente de verdad y la
evidencia por decisión vive en `data/evidence/castilla-y-leon/segovia.jsonl`.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento
fija el snapshot, los riesgos locales y el alcance de los lotes. Los contratos
aplicables son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Cómo reanudar

1. Leer `git status --short`, Estado, Reglas locales y solo el lote activo.
2. Confirmar que no hay cambios concurrentes en Segovia.
3. Investigar primero identidad, exclusiones, duplicados y unidad productiva.
4. Resolver `Venta online` desde cero: en esta provincia el valor heredado es
   una interpolación de «¿tiene web?» y no prueba nada (ver Reglas locales).
5. Editar el CSV de forma estructurada, añadir una línea JSONL por decisión y
   actualizar aquí el resumen del lote.
6. Pasar `check:csv:changed`, `check:evidence:changed` y `git diff --check`.
   El cierre provincial pasa `verify:data`.

Los lotes agrupan de 7 a 12 filas por categoría, IGP/DO o fuente común. No se
añaden candidatos nuevos hasta terminar la primera pasada de las filas
existentes.

## Definición de completado

- No queda ninguna fila sin decisión editorial revisada en esta pasada.
- `pendiente` solo sobrevive con bloqueo real documentado; `parcial` es un
  resultado final válido cuando la evidencia tiene techo registral o secundario.
- Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- Todos los `Venta online=sí|no` están demostrados y los `sí` tienen canal.
- Ninguna fila conserva un directorio (`alimentosdesegovia.es`) como `web`.
- Segovia se añade a `data/evidence/coverage.json` solo al cerrar la pasada.

## Estado

- **Lote SG-R1-a (2026-07-28, carril R1).** Alcance: la única `pendiente`,
  `origen-pasteleria-artesana-segovia` → `parcial`. El pin de Maps con
  place_id, la dirección y el móvil sostienen que el establecimiento existe y
  dónde está; sin web, redes ni ficha sectorial no da para más, y su ausencia
  en Alimentos de Segovia (marca de adhesión voluntaria) no prueba
  inexistencia, así que no se purga. `descripcion` retirada: narraba nuestra
  búsqueda, no al productor. `pendiente` a **0**.
- Inicio: **2026-07-26**. Primera pasada profunda de las **165 filas**
  existentes; no añadir candidatos hasta el cierre.
- Snapshot inicial: **165 filas**; **134 `pendiente`, 31 `parcial`, 0
  `verificado`**. Venta online: **61 `sí`, 104 `no`, 0 `no comprobado`**, y
  **0 de esos 61 `sí` tienen canal**.
- Evidencia inicial: **el fichero JSONL no existe**; 0 registros para 165 filas.
- Imágenes: 71 de 165 filas con imagen; queda fuera de esta pasada salvo
  purga de basura detectada al paso.
- El árbol tenía trabajo concurrente en Badajoz al iniciar; queda expresamente
  fuera de este expediente.
- Tras SG-01 (2026-07-26): **165 filas**; **129 `pendiente`, 28 `parcial`, 8
  `verificado`**. Venta online: **60 `sí`, 101 `no`, 4 `no comprobado`**; los
  `sí` sin canal bajan de 61 a 53. Evidencia: **12 registros** (11 `keep`, 1
  `merge`); se estrena `data/evidence/castilla-y-leon/segovia.jsonl`.
- Tras SG-02 y SG-03 (2026-07-26): **165 filas**; **111 `pendiente`, 33
  `parcial`, 21 `verificado`**. Venta online: **63 `sí`, 89 `no`, 13 `no
  comprobado`**; los `sí` sin canal bajan a 45. Evidencia: **32 registros**.
  **Bloque de bodegas cerrado: las 20 filas revisadas** (13 verificadas, 6
  parciales, 1 pendiente). Las filas fuera del geo-check bajan de 16 a 15.
- Tras SG-04 a SG-07 (2026-07-26): **155 filas** (−10 purgas); **69
  `pendiente`, 40 `parcial`, 46 `verificado`**. Venta online: **66 `sí`, 58
  `no`, 31 `no comprobado`**; los `sí` sin canal bajan a 32. Evidencia: **79
  registros**. **Bloque de charcutería cerrado: las 44 filas revisadas** (25
  verificadas, 9 parciales, 10 purgas). Las filas fuera del geo-check bajan de
  15 a 8 y solo queda un aviso de distancia.
- Tras SG-08 y SG-09 (2026-07-26): **152 filas**; **47 `pendiente`, 48
  `parcial`, 57 `verificado`**. Venta online: **65 `sí`, 40 `no`, 47 `no
  comprobado`**; los `sí` sin canal bajan a 25. Evidencia: **105 registros**.
  **Bloque de pan y pastelería cerrado: las 25 filas revisadas**. Los avisos de
  data-quality caen de 43 a 5 y las filas fuera del geo-check a 7.
- **Cierre de la 1ª pasada (2026-07-26)**: **144 filas** (de 165; −18 purgas y
  −3 fusiones de filas duplicadas); **7 `pendiente`, 43 `parcial`, 94
  `verificado`**. Venta online: **62 `sí` (62/62 con canal), 0 `no`, 82 `no
  comprobado`**. Evidencia: **176 registros** — 144 `keep` (cobertura
  **144/144**), 18 `purge` y 14 `merge`.
  **Cero avisos de data-quality, cero filas fuera del geo-check, cero avisos de
  distancia, ninguna web de directorio, ningún teléfono ni descripción
  repetidos.** `verify:data` verde sobre los 50 CSV. Segovia entra en
  `data/evidence/coverage.json`.

## Reglas y riesgos locales

1. **`Venta online` es una interpolación, no un dato.** El reparto es exacto:
   las 61 filas con `sí` son todas filas con `web`, ninguna fila sin `web` dice
   `sí`, y **ninguna fila usa `no comprobado`**, que es el valor por defecto del
   contrato. El `no` heredado tampoco prueba ausencia de venta: 68 de esos 104
   simplemente no tenían web en el volcado. Se reevalúa cada valor contra la
   fuente; sin canal demostrado en vivo el resultado es `no comprobado`.
2. **`horario` y `descripcion` son plantilla.** Las 165 filas repiten
   «Consultar web o venta directa» y 134 repiten «…incorporado al catálogo
   provincial de Segovia tras revisión inicial». Ninguno de los dos campos
   aporta información verificada; se reescriben con datos reales al revisar.
3. **`alimentosdesegovia.es` es el directorio de la Diputación**, no la web del
   productor. Ocho filas lo traen como `web` propia (Cáñamo Canniebas, Patatas
   Dunof, La Flor de Valseca, El Celemín de Labajos, Bendito Nanno, Quesos
   Bartolomé, La Cueva de la Quesera, Entrehoces). Es fuente de apoyo con techo
   `parcial`: hay que buscar el dominio real y, si no existe, vaciar `web`.
4. **Duplicado declarado: Obrador de Pan Valdenebro figura 3 veces** (San
   Ildefonso «parcelshop», San Ildefonso «by Adris», Segovia «mercado
   Albuera»). Son puntos de venta de un obrador, no tres productores; hay que
   consolidar en una fila y dejar `merge`.
5. **Web cruzada sospechosa: Bodegas Blanco Nieva trae `martue.com`**, que es
   Martúe (La Guardia, Toledo). Puede ser matriz de grupo o error de volcado;
   verificar antes de dar el dominio por bueno. Mismo patrón a revisar en
   Montejuelo (`gonzalezygonzalez.com`).
6. **Charcutería es el bloque dominante (44 filas)** y mezcla tres cosas
   distintas: industria del Chorizo de Cantimpalos IGP, salas de despiece y
   cochinillo, y **carnicerías de barrio sin elaboración propia**, que son
   `purge:not-producer`. La IGP y el registro de la marca de garantía deciden
   el encaje, no el nombre.
7. **Pan y pastelería (25 filas) tiene el mismo riesgo**: obrador propio entra,
   despacho o franquicia no. Trece filas están en Segovia capital.
8. Las hortícolas de la zona de Cuéllar y Gomezserracín (achicoria, patata,
   zanahoria, puerro) suelen ser centrales hortofrutícolas B2B. Acopio y
   confección sin marca propia al consumidor es `purge:out-of-scope`;
   con marca propia se conserva.

## Worklist

| Lote | Alcance | Filas | Estado | Riesgo principal |
|---:|---|---:|---|---|
| SG-00 | Higiene, snapshot y partición | 165 | ✅ 2026-07-26 | 134 pendientes; 61 `sí` sin canal; VO interpolada; 8 webs de directorio |
| SG-01 | Lácteos y quesos | 11 | ✅ 2026-07-26 | 8 verificadas, 3 parciales; Delicias Cuéllar trasladada a Vallelado |
| SG-02 | Bodegas D.O. Rueda — Nieva, Santiuste, Nava | 10 | ✅ 2026-07-26 | 6 verificadas, 4 parciales; `martue.com` era matriz real, no cruce |
| SG-03 | Bodegas D.O.P. Valtiendas, Ribera y resto | 10 | ✅ 2026-07-26 | 7 verificadas, 2 parciales, 1 pendiente; 6 dominios rescatados |
| SG-04 | Charcutería — IGP Chorizo de Cantimpalos | 11 | ✅ 2026-07-26 | 9 verificadas, 2 parciales; 3 municipios corregidos |
| SG-05 | Charcutería — filas con dominio propio | 13 | ✅ 2026-07-26 | 8 verificadas, 1 parcial, 4 purgas |
| SG-06 | Charcutería — resto de la provincia | 15 | ✅ 2026-07-26 | 7 verificadas, 6 parciales, 2 purgas |
| SG-07 | Charcutería — carnicerías de despacho | 5 | ✅ 2026-07-26 | 1 verificada y trasladada, 4 purgas |
| SG-08/09 | Pan y pastelería — capital y provincia | 25 | ✅ 2026-07-26 | 11 verif, 10 parcial, 1 pend; 4 despachos fusionados |
| SG-10 | Cerveza, ahumados y bebidas | 14 | ✅ 2026-07-26 | 11 verif, 3 parcial; 4 categorías corregidas |
| SG-11 | Miel | 9 | ✅ 2026-07-26 | 5 verif, 2 parcial, 2 purgas |
| SG-12 | Legumbres y huevos | 14 | ✅ 2026-07-26 | 8 verif, 4 parcial, 1 pend, 1 purga |
| SG-13 | Fruta y verdura, aperitivos, conservas y despensa | 28 | ✅ 2026-07-26 | 14 verif, 5 parcial, 4 pend, 5 purgas |
| SG-16 | Cierre: reauditoría, reconciliación y cobertura | 144 | ✅ 2026-07-26 | 144/144 con `keep`; Segovia en `coverage.json` |

## SG-00 — Higiene, snapshot y partición

Cerrado el 2026-07-26. Sin cambios en datos: solo diagnóstico y partición.

Hallazgos que condicionan toda la pasada:

- El CSV es un volcado en dos estratos. Las 134 filas `pendiente` (líneas 2-136)
  traen descripción de plantilla y ninguna evidencia; las 31 `parcial` (líneas
  137-166) son una tanda posterior, todas con web y correo, y cuatro de ellas
  con el directorio provincial como web.
- **`Venta online` no se investigó nunca**: correlaciona 1:1 con la presencia de
  `web` y el valor por defecto del contrato (`no comprobado`) no aparece ni una
  vez. Es el campo que hay que rehacer entero.
- No hay evidencia: `data/evidence/castilla-y-leon/segovia.jsonl` no existe.
- Señales baratas que **sí** salen limpias: ningún teléfono repetido, 165/165
  con lat/lon, y solo dos dominios repetidos (el directorio provincial y el
  obrador Valdenebro triplicado). La geografía está bien repartida por la
  provincia, así que el volcado partió de una fuente real y no de nombres
  inventados.
- **16 filas escapan al geo-check** porque su `municipio` es en realidad una
  pedanía o EATIM: Hontoria (3), Pinillos de Polendos (3), Pecharromán, Cobos
  de Segovia, Madrona, Moraleja de Coca, La Pradera de Navalhorno, Campo de
  Cuéllar, Chatún, Narros de Cuéllar, Aragoneses y San Rafael. Se corrigen en
  el lote de cada fila, poniendo el municipio real y dejando la localidad en
  `direccion`. Además hay dos avisos de distancia (Llorente Mañas 17,9 km y
  Producciones Avícolas El Granjero 57,9 km del centroide de Segovia).
- La provincia se concentra en **charcutería (44)**, **pan y pastelería (25)**,
  **fruta y verdura (22)** y **bodega (20)**, que definen la partición.

## SG-01 — Lácteos y quesos

Decisiones cerradas el 2026-07-26 sobre las 11 filas del bloque.

- `verificado` + ecommerce: Lácteos Armuña, Moncedillo, Celestino Arribas,
  Quesería Artesanal de Sacramenia, Quevana y Delicias Cuéllar.
- `verificado` + pedido por teléfono, WhatsApp y correo: La Dula de las Mesetas.
- `verificado`, venta no comprobada: Quesos El Molinero.
- `parcial`, venta no comprobada: Bendito Nanno, Quesos Bartolomé y La Cueva de
  la Quesera.
- `merge`: `delicias-cuellar-cuellar` → `delicias-cuellar-vallelado`.

Incidencias reutilizables:

- **La página de contacto es la que decide el municipio.** Delicias Cuéllar
  separa despacho (C/ Concepción, 42, Cuéllar) de fábrica (P. I. Los Arenales,
  Vallelado). La fila sigue a la unidad productiva: cambia municipio, slug,
  coordenadas e imagen, y deja `merge`. De paso salió que su vecino de polígono
  es Quevana, así que el volcado tenía dos filas del mismo polígono con
  municipios distintos.
- **`business.site` está muerto por definición.** Google cerró el servicio, así
  que cualquier `web` que apunte allí devuelve 404 y no es un sitio caído del
  productor. La Cueva de la Quesera se resuelve por Facebook e Instagram.
- **Las tres filas sin dominio propio son las tres que traían el directorio**
  provincial como `web`. Bendito Nanno, Quesos Bartolomé y La Cueva de la
  Quesera existen y producen, pero sin fuente primaria viva legible su techo es
  `parcial`; se vació `web` y se recuperaron redes y correo reales de la ficha.
- **Todos los packs agotados es indisponibilidad, no ausencia de canal.**
  Quesos El Molinero publica cuatro packs con precio y envío incluido, los
  cuatro sin stock: `no comprobado`, no `no`.
- **Un carrito con un solo producto en preventa sí acredita venta.** Lácteos
  Armuña tiene WooCommerce vivo con precio y botón de compra, aunque el
  catálogo sea de una referencia.
- WebFetch devolvió 404 en `lacteosarmuna.es/tienda/`, que es la URL que el
  propio menú anuncia; la tienda real cuelga de `/shop/`. Un 404 en la ruta
  esperada no cierra la pregunta: el HTML de portada delataba WooCommerce.
- Dos filas estaban mal categorizadas: Bendito Nanno (obrador de helados) pasa a
  `Helados` y Delicias Cuéllar a `Pan y pastelería`.

## SG-02 y SG-03 — Bloque de bodegas completo

Decisiones cerradas el 2026-07-26 sobre las 20 filas de la categoría.

- `verificado` + ecommerce (11): Microbio Wines, Blanco Nieva, Herrero Bodega,
  Ossian Vides y Vinos, García Serrano, Severino Sanz, Navaltallar, Las Dos
  Antiguas, Finca Cárdaba y —con pedido por correo en vez de carrito— Tinto
  Redreja y José Galindo Winegrower.
- `verificado`, venta no comprobada (2): Avelino Vegas y Bodegas Carlos PJ.
- `parcial` (6): Esmeralda García, Montejuelo, Alanterra-Viñedos de Agejas,
  Camiruaga, Valdrinal y Ribera del Duratón.
- `pendiente` documentado (1): Malacepa.

Incidencias reutilizables:

- **Seis filas llegaban sin `web` teniendo dominio propio vivo**: Herrero
  Bodega, García Serrano, Finca Cárdaba, Carlos PJ, Tinto Redreja y José
  Galindo. Cuatro llegaban además sin teléfono ni correo. El volcado no buscó
  el dominio, no es que no exista: **«sin web» en el volcado no es un dato**.
- **Un dominio que no casa con el nombre suele ser la matriz, no un cruce.**
  `martue.com` en Bodegas Blanco Nieva parecía error: Martúe entró en la bodega
  en 2009, la web del grupo tiene sección propia de Nieva y su tienda vende
  Blanco Nieva Verdejo y Sauvignon Blanc. Se conserva, apuntando a
  `martue.com/nieva/` en vez de a la portada.
- **Pero el mismo patrón puede fallar por contenido.** Montejuelo trae
  `gonzalezygonzalez.com`, que Tierra de Sabor publica como su web y de donde
  sale su correo de contacto: es la matriz real, sí, pero el sitio es una
  distribuidora madrileña de materias primas de panadería que **no menciona la
  bodega**. Dominio correcto y web inservible a la vez: se vacía.
- **Cuatro dominios muertos y dos en mantenimiento en un solo bloque.**
  NXDOMAIN real (`bodegasduraton.com`, que el consejo regulador sigue
  publicando; `bodegascamiruaga.com`), conexión rechazada (`bodegasalanterra.es`
  y `agejasbodega.com`) y mantenimiento total (`valdrinal.com` en /es y /en,
  `esmeraldagarcia.es`). Los muertos se vacían; los de mantenimiento se
  conservan y dejan la fila en `parcial`.
- **Un carrito puede no ser de producto.** Avelino Vegas tiene `/carrito/` y
  `/tienda/`, pero el carrito es de reservas de enoturismo («Sin reservas
  seleccionadas») y la tienda no lista vino: `no comprobado`.
- **Un formulario de pedido sí es canal.** Tinto Redreja publica packs con
  precio y pide el encargo por correo; José Galindo tiene formulario que
  recoge el pedido y luego cierra envío y pago. Ambos son `email`, no `no`.
- **Pecharromán es anejo de Valtiendas**, no municipio: corregirlo devolvió
  Finca Cárdaba al geo-check. Su viñedo y el de Carlos PJ están en Valtiendas
  aunque las bodegas estén en otro término; la fila sigue a la bodega.
- El registro de la D.O.P. Valtiendas (`dopvaltiendas.com`) es la fuente barata
  del bloque: fija municipio y web de nueve bodegas y sirvió para descartar
  Malacepa, que no está inscrita, no tiene rastro digital y consta en el
  registro mercantil con CNAE de cerveza.

## SG-04 a SG-07 — Bloque de charcutería completo

Decisiones cerradas el 2026-07-26 sobre las 44 filas de la categoría: **25
verificadas, 9 parciales y 10 purgas**.

- `purge:not-producer` (6): Omnívoro, Cárnicas Mallorcar, Carnicería Maribel,
  Carnicería Mercedes Martín, Carnicería J. Encinas y Carnicería Álvaro.
- `purge:out-of-scope` (4): Carnes de Riaza, Cárnicas Ceferino, Llorente Mañas
  e Innoporc.
- `merge` (3): Jambur, Hnos. María Moreno y Alimentación Sanz Vegas, los tres
  por slug con municipio o texto equivocado.

Incidencias reutilizables:

- **«Sin web» en este volcado no es un dato.** Diecinueve filas de charcutería
  llegaron con `web` vacía teniendo dominio propio vivo, y once de ellas
  además sin teléfono. Trece de esos dominios tienen tienda con precios. El
  volcado no buscó: buscar es el trabajo.
- **Los registros son la fuente barata, pero van por detrás.** El registro de
  operadores de la IGP Chorizo de Cantimpalos fijó municipio, teléfono y
  encaje de media docena de filas y delató que Zamarras es la marca de Mariano
  López e Hijos; pero sitúa aún a Mariano Pascual en Carbonero el Mayor cuando
  su planta está en Tabanera la Luenga desde 1992. Registro contra web propia,
  gana la web propia.
- **Cuatro «municipios» del volcado eran pedanías o entidades locales
  menores**: Pinillos de Polendos (de Escobar de Polendos), Hontoria (barrio
  de Segovia), Cobos de Segovia (ELM de Sangarcía) y, en sentido contrario,
  Jambur estaba en Cantimpalos y no en Escobar. Corregirlas devolvió siete
  filas al geo-check.
- **La línea de la purga está en quién transforma.** Se van los mataderos y
  distribuidores que su propia web dirige a mayoristas y restaurantes (Carnes
  de Riaza, 360.000 canales/año; Cárnicas Ceferino), el cebadero que vende al
  mayorista (Llorente Mañas), la empresa de cría porcina que abastece a otras
  empresas (Innoporc), las tiendas online que compran a terceros (Omnívoro,
  Cárnicas Mallorcar, Maribel) y los despachos de carnicería. Se quedan los
  que sacrifican **y** curan con marca propia, aunque críen fuera: La Prudencia
  cría en Zafra pero mata y cura en Villacastín.
- **Un despacho con obrador sí es fila.** Alimentación Sanz Vegas parecía una
  tienda de alimentación de Segovia capital; es de Prádena, a cuarenta
  kilómetros, y su propia web titula la sección «Tienda y Obrador».
- **El slug puede arrastrar basura del scrape.** «Cochinillo de Segovia,
  Hermanos María Moreno, visita tienda online» llevaba el reclamo comercial
  incrustado en el nombre y en el slug.
- **Comprobar un dominio con eñe requiere dejar que lo convierta el cliente.**
  `embutidoscañas.es` es `xn--embutidoscaas-skb.es`; la codificación que
  parecía correcta a ojo no existía y el dominio parecía muerto.
- **Un 403 sistemático es bloqueo, no cierre** (Jesús Palomo, Eresma), igual
  que un certificado caducado (Cárnicas Pedro Gómez) o un `altname` del
  hosting. **NXDOMAIN sí es muerte**, aunque el buscador siga indexando la
  tienda (Domingo de Pedro) o el consejo regulador siga publicando el dominio.

## SG-08 y SG-09 — Pan y pastelería

Decisiones cerradas el 2026-07-26 sobre las 25 filas del bloque: **11
verificadas, 10 parciales, 1 pendiente y 4 fusiones**.

- `verificado` + ecommerce: Valdenebro, Juan Sanz, Pastelería Acueducto y Los
  Mellizos; con pedido por teléfono o correo, El Horno de Chema y Dulces
  Vuelos.
- `verificado`, venta no comprobada: Obrador del Pan Concepción Moreno, El
  Obrador de Palazuelos, Ipanema, Masa con Alma y Ángel Maroto.
- `merge`: los tres despachos de Valdenebro en una fila y Obrador del Pan de
  Segovia en su obrador de Garcillán.
- `pendiente` documentado: Origen Pastelería Artesana.

Incidencias reutilizables:

- **El volcado confundió despacho con obrador cuatro veces.** Las tres filas de
  Valdenebro eran su obrador y dos puntos de venta, y «Obrador del Pan» de la
  calle José Zorrilla es el despacho segoviano del obrador de Garcillán: misma
  dirección y mismo teléfono que publica su web. La señal barata vuelve a ser
  la coincidencia de teléfono o dirección con la página de puntos de venta.
- **Un dominio que no casa con el nombre puede ser la razón social.**
  `panaderosderevenga.com` en Panadería Ipanema no era un cruce: es Cesáreo
  Nevado e Hijos, panaderos en Revenga desde 1900, que explota tres despachos
  con la marca Ipanema.
- **Dos dominios muertos que el buscador sigue indexando**: `panaderiavacmar.es`
  y `turegalomisgalletas.es`, esta última con fichas de producto y opción de
  recogida en obrador todavía cacheadas. Ninguno resuelve.
- **San Rafael es pedanía de El Espinar**, la última entidad menor del CSV que
  quedaba mal puesta como municipio.
- Un obrador de barrio sin web ni redes se queda en `parcial`: los listados
  sectoriales (tartapan, panaderiasartesanas, observatorio económico municipal)
  acreditan identidad y municipio, pero no son fuente primaria.

## SG-10 a SG-13 — Resto de categorías

Decisiones cerradas el 2026-07-26 sobre las 65 filas restantes: **38
verificadas, 14 parciales, 5 pendientes documentadas y 8 purgas**.

- `purge:out-of-scope` (5): Cooperativa Glus (suministro agrario: gasóleo,
  fitosanitarios, semillas y pienso), los viveros Campiñas, Secueductos y El
  Pinar (planta para agricultores, no alimento) y Producciones Avícolas El
  Granjero (26 millones de docenas al año, absorbida por Hevo Group).
- `purge:not-producer` (3): El Hada Leanan (artesanía en cuero), Apirase
  (tienda que vende miel de Cantabria) y Onzas de Sabor (granel de terceros).
- `merge` (4): Néctara, Campesana, Ecoeduco, Ideal Fruits y Espirulina
  Valsaín, todos por municipio o etiqueta equivocada en el slug.

Incidencias reutilizables:

- **La categoría del volcado miente tanto como el municipio.** Dos de las tres
  filas de «Pescado» ahumaban carne (HUMA y Ahuma d'Or), El Hada Leanan estaba
  en «Miel» siendo un taller de cuero, Ecosancho y dos cochinilleras estaban en
  «Charcutería», y el cajón «Otros» escondía una gaseosera, un vermú y un
  tostadero de café. Trece filas cambiaron de categoría.
- **Las purgas de este bloque tienen todas la misma forma**: la fila existe y
  es real, pero lo que produce no es alimento (viveros), no es suyo (tiendas
  que revenden) o no llega al consumidor con identidad propia (suministro
  agrario, avícola industrial).
- **Cuando el municipio del volcado es una pedanía, el slug suele arrastrarla.**
  Se corrigieron once municipios en toda la pasada; en cinco casos el slug era
  además materialmente falso y se renombró con `merge`. En los seis restantes
  se conservó el slug con la localidad y se corrigió solo la columna
  `municipio`, dejando la localidad en `direccion`: menos churn y la misma
  verdad. Con la última tanda **ninguna fila queda fuera del geo-check**.
- **Una web viva puede no servir de nada.** Herfruit responde con una portada
  de 2004 que solo contiene una línea de copyright, y Huerta y Pico publica una
  plantilla de Canva con el título y nada más. Existen, son suyas y no
  acreditan nada: techo `parcial`.
- Escala: se conservan Huercasa (70 M€, pero fundada y con fábrica en
  Sanchonuño) y las hortícolas certificadas del Carracillo, y se purga la
  avícola de marca nacional. El criterio no es el tamaño sino si queda
  identidad local y producto propio.

## SG-16 — Cierre provincial

Cerrado el 2026-07-26. Reauditoría sobre las 144 filas resultantes:

- Evidencia **144/144** con `keep` vigente; 18 `purge` y 14 `merge` como
  tombstones. De los 14 `merge`, tres consolidan filas duplicadas y once son
  renombrados de slug por municipio o etiqueta equivocada. Segovia entra en `data/evidence/coverage.json`.
- `check:csv:data-quality` pasa con **cero avisos**: ninguna descripción ni
  horario de plantilla, ningún teléfono repetido, ninguna coordenada fuera de
  rango y ninguna fila fuera del geo-check.
- Ninguna fila conserva un directorio como `web`. Las dos únicas webs que no
  son dominio propio (una ficha de constructor genérico y una plantilla de
  Canva) pertenecen al productor y sostienen `parcial`, no `verificado`.
- Los 62 `Venta online=sí` tienen canal. No se usó `no` en ninguna fila: sin
  prueba de ausencia de canal, el valor honesto es `no comprobado`.

## Residuales para la segunda pasada

- **Segunda y tercera pasadas 2026-07-28: 7 → 1 `pendiente`**. Las Damas se purgó porque
  es una tienda de golosinas y aperitivos, no un productor. Hortafercar y
  Hortalizas Gourmet pasan a `verificado`; Hortalizas El Rubio y Huevos Riofrío
  pasan a `parcial`. Malacepa también pasa a `parcial`: el registro acredita
  identidad, traslado reciente y objeto de fabricación de bebidas, pero aún no
  producto o actividad pública. Queda solo **Origen Pastelería Artesana**, sin
  rastro fuera de la ficha cartográfica. Estado provincial: **143 filas; 96
  `verificado`, 46 `parcial`, 1 `pendiente`**.
- **46 `parcial`**, la mayoría por no tener fuente primaria viva. Merecen
  reintento: Jesús Palomo (403 sistemático), Eresma (403), Valdrinal y
  Esmeralda García (dominios en mantenimiento) y Marijave, cuya S.L. figura de
  baja en el registro mercantil.
- **Dudas de encaje anotadas**: Cárnicas N. Abad (matadero-distribuidor),
  Segoviana de Patatas (almacén con marca propia), Huercasa (escala), Rodríguez
  Sacristán (no declara dónde cura) y Mesenor (cooperativa de pienso con tienda
  gourmet).
- **Posible duplicado**: Entrehoces y Mieles de la Hoz comparten apellido y
  pueblo (Maderuelo); confirmar que son dos explotaciones distintas.
- **82 `no comprobado`**: varios son webs sin tienda que podrían tener canal no
  publicado, y unos pocos dominios caídos que conviene reintentar.
- **81 de 143 filas sin imagen** (57 %). Es el mayor hueco de calidad que deja
  la pasada y no se tocó, salvo el renombrado de las cinco imágenes cuyo slug
  cambió y el borrado de las ocho de filas purgadas.
- **Altas pendientes**: `docs/candidates/segovia.md` guarda cinco bodegas de la
  D.O.P. Valtiendas ausentes del CSV, sin contrastar.
