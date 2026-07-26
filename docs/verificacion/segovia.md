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
| SG-02 | Bodegas DO Rueda — Nieva, Santiuste, Nava | 10 | ⏳ | `martue.com` cruzado; bodegas sin web |
| SG-03 | Bodegas Valtiendas, Ribera y resto | 10 | ⏳ | 7 filas sin web; viticultores sin unidad propia |
| SG-04 | Charcutería — Chorizo de Cantimpalos IGP | 10 | ⏳ | razón social vs marca; duplicados por dirección |
| SG-05 | Charcutería — cochinillo y salas de despiece | 10 | ⏳ | encaje de sala de despiece y matadero |
| SG-06 | Charcutería — resto de la provincia | 12 | ⏳ | carnicerías sin elaboración |
| SG-07 | Charcutería — Segovia capital | 12 | ⏳ | carnicerías de barrio: `purge:not-producer` |
| SG-08 | Pan y pastelería — Segovia capital | 13 | ⏳ | despachos y franquicias; Valdenebro duplicado |
| SG-09 | Pan y pastelería — provincia | 12 | ⏳ | obrador vs despacho; Valdenebro `merge` |
| SG-10 | Fruta y verdura — Cuéllar y Gomezserracín | 11 | ⏳ | centrales hortofrutícolas B2B |
| SG-11 | Fruta y verdura — resto, más viveros | 11 | ⏳ | viveros de planta: fuera de alcance alimentario |
| SG-12 | Huevos y legumbres | 14 | ⏳ | granjas de puesta industrial; garbanzo de Valseca |
| SG-13 | Miel | 9 | ⏳ | envasadores vs apicultores |
| SG-14 | Cerveza artesana y pescado ahumado | 10 | ⏳ | cerveceras gitanas sin planta propia |
| SG-15 | Otros, aperitivos, conservas y despensa | 12 | ⏳ | licores y vermú: elaboración vs marca |
| SG-16 | Cierre: reauditoría, reconciliación y cobertura | — | ⏳ | cobertura evidencia; `coverage.json` |

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
