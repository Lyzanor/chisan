# Plan transversal de remediación editorial

Roadmap de larga duración para reducir la deuda que muestran
`check:defects`, `check:csv:data-quality` y `check:csv:completeness` sin
degradar la verdad editorial de los CSV.

Los recuentos no viven aquí: cambian con cada lote. La línea base y la cola
actual se obtienen siempre con:

```bash
npx pnpm check:defects
npx pnpm check:csv:data-quality
npx pnpm check:csv:completeness
```

Si `npx` falla, el gate sigue siendo el comando, no el lanzador: ejecuta
`node scripts/audit-defects.mjs` o `bash scripts/check-csv-quality.sh` y sigue.

Este plan organiza el trabajo; no sustituye los contratos de
`docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md`,
`docs/EDITORIAL_POLICY.md`, `docs/VERIFICATION_TECHNIQUES.md` y
`docs/IMAGES.md`.

## 1) Resultado buscado

El objetivo no es poner todos los contadores a cero a cualquier precio. Es que
cada fila publicada sea una unidad productiva real, identificable, bien
localizada y descrita con datos públicos útiles, y que las dudas que sobrevivan
sean honestas y reanudables.

Una mejora cuenta cuando:

- corrige o retira información falsa, ajena, obsoleta o no demostrada;
- mejora identidad, municipio, categoría, contacto, venta o utilidad pública;
- conserva la estabilidad de un `slug` correcto y deja `merge` si debe
  corregirse uno que ya existía;
- registra evidencia en el momento de una nueva decisión;
- reduce una cola editorial sin introducir errores ni avisos nuevos;
- deja vacío o `no comprobado` cuando la evidencia no permite afirmar más.

No cuentan como progreso:

- promover `parcial` o `pendiente` solo para mejorar una métrica;
- convertir un fallo técnico o una búsqueda infructuosa en `no`, cierre o
  inexistencia;
- rellenar descripciones, contactos, categorías o imágenes por plausibilidad;
- añadir evidencia retroactiva solo para vaciar `sin-evidencia`;
- añadir productores nuevos mientras la pasada contratada es de saneamiento,
  salvo que una fusión o corrección de identidad lo exija.

### Colas y señales

`check:defects` marca cada check con un `kind` y solo las **colas** son carga de
trabajo:

- **cola**: cada fila se arregla o se justifica como residual.
- **señal**: hueco de cobertura que puede quedarse abierto para siempre porque
  vacío es un final válido. Hoy son `sin-imagen` (objetivo fijo del 60%) y
  `sin-evidencia` (advisory por contrato). No entran en la unión que ordena el
  trabajo.

La prioridad se mide en **productores únicos**, no sumando checks: una fila en
tres colas sigue siendo una investigación. La cifra la calcula la herramienta y
por eso no se copia aquí:

```bash
npx pnpm check:defects            # última sección: "carga real"
npx pnpm check:defects --json     # campo `workload`
```

Contar las señales como cola infla la unión unas seis veces y esconde el único
solape que importa de verdad: la mayoría de filas que están en dos colas son
`venta-sin-resolver` cruzada con `descripcion-generica`, `web-de-tercero` o
`evidencia-prestada`. En la práctica eso significa **una sola regla**: cuando
abras una fila para resolver venta, cierra en la misma visita su descripción, su
web y su evidencia.

## 2) Unidad de trabajo y regla de no solape

La unidad de propiedad es la **provincia**. La unidad de entrega es un **lote
cerrado de slugs** dentro de esa provincia.

- Solo puede haber un escritor activo por provincia. Dos agentes no editan a
  la vez el mismo CSV aunque sus slugs parezcan distintos: el CSV, el JSONL y
  el ledger provincial siguen siendo ficheros compartidos.
- Las provincias distintas sí son independientes, salvo durante un lote
  global de tooling o taxonomía.
- Un lote global que toque validadores, referencias o varios CSV declara
  **ventana global**: antes de empezar se comprueba que no haya ramas,
  worktrees ni cambios activos sobre los mismos ficheros.
- Cada lote congela su lista exacta de slugs antes de investigar. Un hallazgo
  fuera de alcance se anota para el siguiente lote; no se corrige “de paso”.
- Una purga o fusión puede tocar el slug objetivo, su imagen, evidencia y nota
  de candidatos aunque esos ficheros no aparecieran en la cola original. Esa
  dependencia forma parte del mismo lote.

Para una pasada que vaya a ocupar más de una sesión, la cabecera de
`docs/verification/[country]/[area].md` mantiene solo esta reserva:

```text
Estado de pasada: activa | pausada | mantenimiento
Base: <commit>
Método: <detectores vigentes al cerrar: G-CAT, G-GEO, G-TPL, G-WEB…>
Lote activo: <id y carril>
Alcance: <lista exacta de slugs o subsección que la contiene>
Última actualización: <YYYY-MM-DD>
```

`Método` existe porque una pasada cerrada no es una pasada buena: dice contra
qué detectores se validó la provincia, y por tanto cuáles no la han mirado
nunca. Sin esa línea, cada detector nuevo obliga a reabrir todo a ciegas.

No se crea una tabla central de estados. Antes de confiar en un ledger o una
rama antigua se contrasta su trabajo real:

```bash
git status --short
git worktree list
git diff main...<rama> -- data/csv data/evidence public/productores docs/candidates docs/verification
```

`git worktree list` no es opcional: un árbol principal limpio no dice nada sobre
worktrees con datos sin aterrizar, y el `git diff` de la tercera línea exige
saber ya el nombre de la rama.

Si la provincia ya tiene cambios activos, se reanuda o se entrega ese trabajo;
no se abre una segunda pasada.

## 3) Preparación común de cada lote

1. Confirmar árbol de trabajo y propiedad provincial.
2. Medir la provincia, sin volcar rosters grandes:

   ```bash
   npx pnpm check:defects --area <area>
   node scripts/audit-csv.js --mode=contract data/csv/<country>/<region>/<area>.csv
   node scripts/audit-csv.js --mode=quality data/csv/<country>/<region>/<area>.csv
   ```

3. Obtener slugs únicamente para el carril elegido:

   ```bash
   npx pnpm check:defects --area <area> --check <id> --list
   ```

4. Formar la unión de defectos por slug. Una fila que aparece en varios checks
   se investiga una sola vez y se resuelven juntos identidad, enlaces, venta,
   descripción y categoría que estén dentro del alcance.
5. Agrupar por una fuente reutilizable: dominio compartido, consejo regulador,
   categoría, municipio o comarca. El agrupamiento ahorra investigación, pero
   la decisión sigue siendo individual.
6. Localizar los slugs en CSV, evidencia, candidatos e imágenes con `rg`.
   Leer ventanas pequeñas; no reformatear CSV o JSONL completos.
7. Anotar la línea base del lote en el ledger provincial o en el mensaje de
   commit: slugs de entrada, señales activas y avisos de calidad relacionados.

## 4) Puertas de tooling (cerradas)

Las cinco puertas que impedían que el trabajo editorial reintrodujera un defecto
están cerradas: hoy son el re-escaneo barato de cualquier provincia, no trabajo
pendiente. La línea `Método` de un ledger dice contra cuáles se validó esa
provincia y, por tanto, cuáles no la han mirado nunca.

| Puerta | Qué detecta | Re-escaneo |
|---|---|---|
| G-CAT-1 | etiquetas retiradas y variantes de la taxonomía | `check:defects --check categoria-variante`, hoy a cero: escribir una retirada es error de contrato, con el reemplazo en el mensaje |
| G-CAT-2 | filas que aún usaban esas etiquetas | migradas; `retiredCategories` guarda a dónde fue cada una |
| G-GEO-1 | municipios bilingües y `Municipio (pedanía)` fuera del geo-check | el lookup prueba cada mitad; `geo-check skipped` bajó de 384 a 322 |
| G-TPL-1 | `productos estrella` que describe otra categoría | `check:defects --check plantilla-cruzada` |
| G-WEB-1 | dominios muertos, aparcados o secuestrados | `check:links -- --offline --area <area>`, sobre el snapshot fechado `data/reference/web-status.json` |

Cinco reglas que dejaron y que no conviene deshacer sin volver a medir:

- **Decidir por fila, no por etiqueta** (G-CAT-2). El mapa de migración es el
  valor por defecto y la evidencia de la fila lo gana, porque una etiqueta puede
  agrupar productores distintos: de las 27 filas de `Bebidas`, solo 7 eran bebida
  sin categoría propia; el resto ya tenían etiqueta viva.
- **Resolver varias mitades no es resolver la fila** (G-GEO-1). Un par bilingüe
  cae en las mismas coordenadas y un homónimo no —`La Floresta (Sant Cugat)`
  resuelve también a Lleida, a 96 km—, así que el lookup solo se fía cuando las
  mitades concuerdan. Las 322 que siguen saltándose son pedanías reales sin
  centroide: hueco aceptado, no cola.
- **`plantilla-cruzada` da candidatos, no veredictos** (G-TPL-1). Acierta ~2 de
  cada 3 y el falso positivo típico es el productor genuinamente mixto. Solo
  dispara sobre `productos estrella` —`descripcion` se midió como disparador y se
  descartó: es prosa y enterraba los hallazgos—; la marca comercial no cuenta como
  producto, un sustantivo tras `con`/`de` es ingrediente, y una etiqueta retirada
  se resuelve antes de comparar.
- **La clasificación de `web` no decide** (G-WEB-1). Un 403 no es un sitio muerto
  y un 200 no prueba que la web sea del productor. El snapshot caduca: marca los
  datos de más de 90 días porque `web` es tan dinámico como `Venta online`.
- **Automatización nueva solo si varias tandas repiten el mismo trabajo
  mecánico**, y ningún check de juicio editorial se endurece hasta que su regla
  sea estable, tenga pocos falsos positivos y venga con pruebas.

Si una puerta nueva se abre en el futuro, su salida obligatoria es pasar el
detector por las provincias ya cerradas y archivar los hits como cola de
mantenimiento en el ledger de cada una. Es un diff, no una repasada.

## 5) Carriles provinciales

El orden dentro de una provincia es R0 → R1 → V → T → E → I → C. No se
empieza una imagen antes de estabilizar identidad y slug.

### R0 — retirada de daño conocido

Tamaño orientativo: 1–10 filas.

- Imágenes basura ya confirmadas, enlaces que pertenecen a otra entidad,
  coordenadas bloqueantes y contradicciones inequívocas.
- Vaciar es una corrección válida. Si se retira una imagen, borrar también el
  activo cuando ninguna otra fila legítima lo referencia.
- Una sospecha de cierre o de identidad no entra en R0: pasa a R1 para
  investigación.

Salida: daño retirado, activos sin huérfanos, evidencia actualizada si cambió
una decisión y `check:images` verde cuando aplique.

### R1 — identidad, alcance y riesgo editorial

Tamaño orientativo: 5–12 filas; hasta 20 si comparten una fuente exhaustiva.

Incluye, por este orden:

1. `pendiente`;
2. `sinteticas`;
3. `evidencia-prestada`;
4. `web-de-tercero`;
5. duplicados, no productores, otra provincia y cierres detectados por los
   audits de calidad o durante la revisión.

Decisión por señal:

| Señal | Investigación | Cierre válido |
|---|---|---|
| `pendiente` | identidad, actividad, municipio, enlaces y venta | `verificado`, `parcial`, purga/merge demostrados o bloqueo real documentado |
| `sinteticas` | fuente exhaustiva que debería listar la entidad, contactos y correspondencia pública | conservar con fuente suficiente o purgar con evidencia positiva de la razón; “no encontré” no basta |
| `evidencia-prestada` | buscar presencia primaria viva y comprobar qué claims sostiene Maps | añadir fuente real y decidir nivel; si faltan claims, bajar honestamente a `parcial`/`pendiente` |
| `web-de-tercero` | clasificar sitio de productor, grupo legítimo, colectivo oficial, directorio, consejo o blog | conservar solo si representa realmente la unidad; si es apoyo, sacarlo de `web`, llevarlo a evidencia y aplicar el techo correcto |
| duplicado/scope/cierre | identificadores, unidad productiva, provincia y evidencia dinámica | `merge` o `purge` con tombstone y dependencias actualizadas |

En toda fila R1 se revisa también la propiedad de cada enlace que vaya a
conservarse. No se añade imagen en esta fase, pero se renombra o elimina si
cambia el slug o desaparece la fila.

Salida: cada slug tiene decisión trazable; no quedan enlaces ajenos; CSV,
evidencia, imágenes y candidatos están reconciliados.

### V — venta online y canal

Tamaño orientativo: 15–30 filas con canales accesibles; 8–15 para webs
difíciles, grupos o marketplaces.

Orden:

1. `Venta online=sí` sin `Canal de venta`;
2. cualquier `sí` heredado cuya prueba no se haya revisado en la pasada;
3. `no comprobado`;
4. revisión de los `no` al cierre provincial.

Para cada fila:

- inspeccionar primero canal oficial, tienda, social o canal colectivo;
- verificar el mecanismo en vivo, no solo texto comercial, catálogo o precios;
- buscar dominio o subdominio de tienda separado antes de concluir;
- distinguir tienda propia/colectiva de reventa independiente;
- fijar `Canal de venta` únicamente al mecanismo demostrado;
- usar `no` solo tras revisar los canales actuales y no encontrar pedido
  remoto; bloqueo, timeout o ambigüedad permanecen `no comprobado`;
- registrar `online-sales` en evidencia cuando se decide `sí` o `no`;
- cerrar en la misma visita descripción, web y evidencia de esa fila. Es el
  solape real del catálogo: reabrirla después cuesta el doble.

Salida: todo `sí` tiene canal y prueba vigente; los `no` del lote fueron
revisados; cada `no comprobado` residual tiene una razón material reanudable,
no una investigación olvidada.

### T — texto, productos y consistencia semántica

Incluye `descripcion-generica`, duplicados de descripción del audit de calidad
y candidatos de plantilla cruzada.

#### T0 — decidir por plantilla, no por fila

La mayor parte de `descripcion-generica` no son decisiones independientes: son
unas pocas plantillas de volcado repetidas. Agrúpalas antes de escribir nada.

```bash
npx pnpm check:defects --check descripcion-generica --plantillas
npx pnpm check:defects --area <area> --check descripcion-generica --plantillas --list
```

Para cada forma, una sola pregunta: **¿aporta algún hecho que no esté ya en
`categoria`, `municipio` o `verificacion`?**

- Si no —el caso típico, «[categoría] de la [DO] situada en [municipio],
  incorporada al catálogo provincial de [X] y revisada con Google Maps»—, vacía
  el grupo entero en un lote revisado. `descripcion` vacía tiene severidad
  `suppressed` en el auditor: es legal y ni siquiera emite aviso.
- Si sí, el grupo pasa a redacción individual con el tamaño normal del carril.

Vaciar en grupo no es una excepción a la política editorial, es su aplicación:
vacío es mejor que un texto que no distingue al productor. Y baja de golpe buena
parte de los avisos de `check:csv:data-quality`, que se concentran en los mismos
CSV.

#### T1 — redacción individual

Tamaño orientativo: 10–25 filas.

- Escribir solo hechos específicos y verificables del productor: qué produce,
  método, lugar o trayectoria cuando la fuente lo publica.
- No narrar el proceso de catalogación ni repetir la categoría.
- No copiar texto promocional ni crear sinónimos para esquivar el detector.
- Comprobar juntos `categoria`, `productos estrella` y `descripcion`.
- Si no hay un hecho específico fiable, dejar el campo vacío es mejor que
  conservar o fabricar una descripción genérica.
- Cuando la fila también esté en R1 o V, resolver el texto durante esa revisión
  y retirarla de este carril; no volver a abrirla.

Salida: el texto distingue a la entidad y concuerda con categoría y productos,
o queda honestamente vacío.

### E — enriquecimiento público útil

Tamaño orientativo: 10–25 filas, agrupadas por municipio, dominio o fuente.

Este carril usa `check:csv:completeness` después de cerrar identidad, venta y
texto. Los huecos opcionales no son defectos automáticos, pero sí oportunidades
de hacer la ficha más accionable.

Orden:

1. `Google Maps`, `lat`/`lon` y `direccion`, comprobados conjuntamente;
2. teléfono o correo;
3. web y perfiles sociales que pertenezcan a la entidad;
4. horario publicado y vigente.

- Corregir primero datos falsos; rellenar después campos vacíos.
- Usar una dirección o ubicación oficial. Si no existe precisión fiable,
  conservar el centroide honesto y su procedencia.
- Regenerar `geo-provenance.json` cuando se sustituyan centroides por
  coordenadas reales.
- No copiar contacto, horario o redes de un directorio sin comprobar que
  pertenecen al productor.
- No rellenar para alcanzar un porcentaje. Los objetivos de completitud son
  señales fijas de planificación; vacío sigue siendo preferible a falso.
- Si la fuente revela un problema de identidad, venta o alcance, devolver la
  fila al carril correspondiente y cerrar esa decisión antes de enriquecer.

Salida: mejora demostrable de localización o contacto, sin enlaces ajenos ni
precisión inventada y sin avisos geográficos nuevos.

### I — imágenes

Tamaño orientativo: una hoja de 15 candidatos; 5–15 activos aprobados por
commit.

Entrada obligatoria: identidad, municipio y slug estables; la fila no tiene
R1 abierto.

```bash
npx pnpm enrich:images --area <area> --contact-sheet informe/<area>
# inspección visual productor a productor
npx pnpm enrich:images --area <area> --apply --slug <slug>
```

- Priorizar provincias editorialmente cerradas y por debajo del objetivo fijo
  de imágenes.
- Aplicar solo por slug después de mirar la composición final.
- Rechazar marca matriz, ayudas, sellos, plugins, agencias, banners, stock e
  imágenes ajenas.
- Dejar vacío si no existe activo limpio; el objetivo de planificación no
  justifica una imagen dudosa.
- Revisar `git diff` para confirmar que el tooling solo cambió el activo y la
  celda `imagen`.
- Auditar hashes repetidos al cerrar una ola, con inspección visual antes de
  retirar nada.

Salida: activos canónicos y revisados, sin referencias rotas, huérfanos ni
basura conocida; `check:images` verde.

### C — cierre provincial

Tamaño: una provincia, después de terminar sus carriles contratados.

La pasada de consistencia —reconciliar, comprobar dependencias, repetir dedup y
geografía, auditar los `Venta online=sí`, revisar residuales, podar candidatos y
comprimir el ledger— es la de `docs/VERIFICATION_TECHNIQUES.md`, que no se copia
aquí. Este plan solo añade tres cosas:

1. Clasificar **todos** los avisos de calidad: corregirlos en R1/T/E o documentar
   la excepción geográfica o editorial que los justifica. Ninguno se queda sin
   clasificar.
2. Actualizar la cabecera de reserva: `Estado de pasada: mantenimiento` y la
   línea `Método` con los detectores vigentes al cerrar.
3. `data/evidence/coverage.json` se toca solo si la provincia cumple su criterio
   propio —toda fila con registro `keep`, según `docs/EVIDENCE_CONTRACT.md`—, que
   **no** es «cero pendientes». Cerrar una pasada no implica entrar en ese
   fichero, y no entrar no es deuda.

## 6) Orden de las olas

El orden se recalcula al inicio de cada ola con el inventario vivo. No se
mantienen rankings provinciales en documentos, y antes de abrir un lote se vuelve
a medir: si otro trabajo ya lo resolvió, se reajusta en vez de repetirlo.

Las olas describen prioridad, no una cola estrictamente serie. La Ola 0 —cerrar
las puertas de tooling del § 4— está terminada; las demás no se encolan entre sí
más de lo que exija el orden de carriles de cada provincia.

### Ola 1 — riesgo alto y colas pequeñas cerrables

1. R0: basura visual y enlaces ajenos ya confirmados.
2. R1 en provincias con `pendiente` o `sinteticas`, de cola menor a mayor.
   Filas inventadas y sin revisar están publicadas: es lo más caro para el
   usuario y lo más barato de arreglar.
3. `canal-sin-clasificar`.
4. Colas pequeñas de `evidencia-prestada` y `web-de-tercero`.

Dentro del mismo nivel, empezar por la provincia con menos slugs únicos permite
cerrar el protocolo con rapidez; después abordar los clusters grandes por
dominio compartido.

### Ola 2 — fuentes prestadas por clusters

Agrupar `web-de-tercero` por dominio y `evidencia-prestada` por categoría o
fuente local. Resolver primero clusters homogéneos; dejar Barcelona y cualquier
otra provincia extraordinariamente grande como campaña propia de lotes
secuenciales, no como un único cambio masivo.

### Ola 3 — venta online

Ordenar provincias por número vivo de `venta-sin-resolver`:

1. 1–40;
2. 41–100;
3. 101–200;
4. más de 200, divididas por categoría/dominio.

El objetivo es cerrar provincias pequeñas y aprender de sus fuentes antes de
entrar en las colas mayores. Dentro de cada fila se corrige también el canal, el
texto y el contacto inequívoco encontrado en la misma fuente.

### Ola 4 — texto y plantilla

Empezar siempre por T0: el paso de plantillas convierte la mayor parte de la
cola en unas decenas de decisiones. Reutilizar fuentes ya abiertas en R1/V y
hacer pasadas dedicadas solo sobre el residual que sobrevive al agrupamiento.

### Ola 5 — enriquecimiento útil

Usar los huecos contra los objetivos fijos para completar primero localización
y contacto, después canales públicos y horario. Solo se investiga lo que una
fuente fiable pueda aportar; no se fuerza el score.

### Ola 6 — imágenes

Empezar por provincias ya cerradas editorialmente, con identidad estable y por
debajo del objetivo fijo. No perseguir 100%: cada activo debe mejorar la ficha.

### Ola 7 — cierres y mantenimiento

Cerrar consistencia provincial, rotar ledgers, podar candidatos y pasar a
mantenimiento periódico de actividad, enlaces, `Venta online=sí` e imágenes.
Las provincias cuya línea `Método` no incluya un detector ya vigente entran aquí
por su re-escaneo, no por una pasada nueva.

## 7) Gates y criterio de aceptación

### Durante un lote de datos

Los gates de iteración son los del flujo mínimo de `docs/VERIFICATION_TECHNIQUES.md`
(`check:csv:changed`, `check:evidence`, `check:evidence:changed`, `git diff --check`).
Un lote de este plan añade:

- ejecutar el `check:defects --area ... --check ...` que originó el lote;
- ejecutar el audit de calidad del CSV provincial;
- ejecutar `check:images` si se tocaron imágenes;
- revisar el diff de CSV, JSONL, candidatos, ledger y activos;
- comprobar que ninguna fila fuera del manifiesto cambió, salvo dependencias de
  una purga/merge explícita.

### Cierre de lote

Un lote se puede entregar cuando:

- todos sus slugs tienen decisión, no solo búsqueda;
- los contadores objetivo bajan o cada residual está justificado;
- no aumentan defectos ajenos al alcance;
- no aparecen errores de contrato ni avisos nuevos de calidad;
- evidencia y CSV coinciden;
- las notas de candidatos relacionadas quedan podadas;
- el diff contiene una provincia y un propósito editorial coherente.

Los cambios de CSV, evidencia, imágenes, candidatos y ledger que dependen de la
misma decisión se commitean juntos. No se mezclan provincias ni limpieza de
ramas.

### Cierre provincial

```bash
npx pnpm verify:data
npx pnpm check:defects --area <area>
node scripts/audit-csv.js --mode=quality data/csv/<country>/<region>/<area>.csv
git diff --check
git diff --stat
```

### Tooling, referencias o política

```bash
npx pnpm verify:ai
```

Todo cambio de detector incluye pruebas. Si una mejora del detector hace subir
el inventario, se documenta como nueva visibilidad, no como regresión de datos.

## 8) Medición y cadencia

- Medir por slugs únicos revisados, no por suma bruta de checks solapados. La
  cifra viva es la línea `carga real` de `check:defects`.
- Registrar por lote: revisados, verificadas/parciales, ventas resueltas,
  purgas, merges, correcciones de identidad y residuales justificados.
- Comparar cada provincia contra su estado anterior, nunca contra otra.
- Ejecutar inventario global después de un lote de tooling, al cerrar una
  provincia y cada 5–10 lotes provinciales.
- Usar `check:csv:completeness` como señal, no como obligación de rellenar
  campos inexistentes.
- Las señales (`sin-evidencia`, `sin-imagen`) no son KPI ni cola de backfill.
  Pueden conservar residuales legítimos: el éxito es que estén revisados y que
  no se haya inventado una respuesta.
- Los commits y el ledger provincial son el handoff. No copiar listados de
  slugs o recuentos globales a este documento.
