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
git diff main...<rama> -- data/csv data/evidence public/productores docs/candidates docs/verificacion
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

## 4) Fase G — cerrar primero las puertas de tooling

Estos lotes requieren `verify:ai` y declaran ventana global.

**Cada puerta bloquea solo el carril que puede reintroducir su defecto.** El
saneamiento de identidad no escribe categorías, municipios ni descripciones, así
que no espera a nadie:

| Lote | Bloquea | No bloquea |
|---|---|---|
| G-CAT-1 y G-CAT-2 ✅ | carril T y cualquier escritura de `categoria` | R0, R1, V, E, I |
| G-GEO-1 ✅ | carril E (localización) | R0, R1, V, T, I |
| G-TPL-1 ✅ | carril T | R0, R1, V, E, I |
| G-WEB-1 ✅ | nada: adelanta trabajo de R0 y R1 | — |

**Salida obligatoria de todo lote G:** pasar el detector nuevo por las
provincias que ya figuran como cerradas y archivar sus hits como cola de
mantenimiento en el ledger de cada una. Es un diff, no una repasada. Sin este
paso, cada detector nuevo deja una capa de provincias que nunca lo vieron y el
problema aparece entero en la Ola 7.

### G-CAT-1 — detector y mapa de taxonomía ✅

Hecho. `data/reference/categories.json` gana `retiredCategories`: las 64
etiquetas que retiraron `d157b1f`, `41233aa` y `183f4eb`, cada una apuntando a
la que la sustituyó. El registro deja de ser una lista de etiquetas permitidas y
pasa a llevar la cuenta de la migración, sin recuentos en ningún doc:

- retirada **y** válida → le quedan filas; `check:csv:data-quality` avisa en
  cada una y `check:defects --check categoria-variante` las lista;
- retirada **y no** válida → nadie la usa y volver a escribirla es error de
  contrato, con el reemplazo en el mensaje.

Las 29 que ya no usaba nadie salieron del registro en el mismo lote, así que esa
puerta está cerrada. El aviso por fichero de `audit-csv.js` además pliega el
plural (`Carne`/`Carnes` ya salta en Málaga); el cruce entre provincias sigue
siendo de `check:defects`, que es quien ve todos los CSV a la vez.

Queda editorial: migrar las filas de las 36 que siguen vivas, que es G-CAT-2 ✅.

### G-CAT-2 — migración por familias ✅

Hecho en 5 lotes (175 filas, 36 etiquetas). `retiredCategories` ya no corta con
`categories`, así que `categoria-variante` está a cero y toda etiqueta retirada
es error de contrato. Los avisos de calidad vuelven a su línea base previa a
G-CAT-1: los 175 avisos desaparecen porque los datos están migrados, no porque
se silenciara el detector.

El mapa registraba la decisión de 2026-06-21 pero no la obligaba, y en ~30 filas
no se siguió, siempre con la evidencia en la propia fila. Dos formas:

- **el cajón de sastre no era el mejor destino disponible**: `Mermeladas` fue a
  `Conservas` —que es donde el mapa ya mandaba `Conservas y mermeladas`—, y
  `Turrones` y `Churrería` a `Dulces y repostería`. El registro recoge el
  destino real, no el de 2026-06-21;
- **la etiqueta agrupaba productores distintos**: `Bebidas` es el caso claro.
  Solo 7 de sus 27 filas eran bebida sin categoría propia; el resto eran
  sidrerías, casas de pacharán y cerveceras que ya tenían etiqueta viva. Lo
  mismo, en pequeño, con dos salineras dentro de `Condimentos` y dos fábricas
  de chocolate y una heladería dentro de `Dulces`.

Quedan residuales honestos, no deuda: `Hidromiel` (3) y agua mineral (7) están
en `Otros` porque no hay etiqueta viva que les encaje, que es exactamente la
razón declarada de la consolidación —esperar a las subcategorías—.

Regla que deja el lote para quien migre después: **decidir por fila, no por
etiqueta**. El destino del mapa es el valor por defecto, y la evidencia de la
fila lo gana.

### G-GEO-1 — municipios bilingües ✅

Hecho. El lookup de centroides prueba cada mitad del `municipio`, no solo el
recorte de `Ciudad - Distrito`. Cubre las dos formas que había en los CSV, y en
la segunda el orden no es estable:

```text
Puente la Reina / Gares          bilingüe: las dos mitades son el mismo pueblo
Granollers (Palou)               municipi (llogaret)
Bruguera (Ribes de Freser)       llogaret (municipi)
```

**Resolver varias mitades no es resolver la fila.** Un par bilingüe cae en las
mismas coordenadas; un homónimo no. `La Floresta (Sant Cugat del Vallès)`
resuelve a la vez al municipio de Lleida y a Sant Cugat, a 96 km, y quedarse con
la primera inventaba ese hueco en una fila correcta. Así que el lookup solo se
fía mientras las mitades concuerdan dentro de la misma tolerancia que usa el
propio check de distancia; si no, no dice nada, que es lo que esas filas tenían
antes. Un `override` sigue mandando por encima de todo: existe justo para
desambiguar un nombre y una entrada suelta de `municipios.json` no lo vota.

Efecto: `geo-check skipped` **384 → 322 filas**, ningún aviso perdido, ningún
error bloqueante nuevo y **un aviso nuevo**, que es un hallazgo real
(`carpier-ahumados-palafolls-sant-genis`, a 52,7 km de Palafolls y a 2,3 de
Barberà). No hizo falta tocar `municipios-overrides.json`.

Las 322 que siguen saltándose son pedanías reales sin centroide: hueco
documentado y aceptado, cola provincial si acaso, no migración automática.

### G-TPL-1 — corrupción de plantilla cruzada ✅

Hecho. `check:defects --check plantilla-cruzada` marca las filas cuyo
`productos estrella` describe otra categoría. Dos reglas:

- **estructural**: el campo no lista productos, lista etiquetas de la taxonomía
  (`Quesos y lácteos` en una heladería). Sale del registro, así que no depende
  de vocabulario ni de que la categoría tenga marcadores;
- **léxica**: sustantivos de producto de otra categoría, y ninguno de la
  propia. Solo juzga a las categorías que tienen marcadores, porque en un
  cajón de sastre (`Otros`, `Despensa artesanal`) la ausencia no prueba nada.

Solo dispara `productos estrella`. `descripcion` se midió como disparador y se
descartó: es prosa, y marcaba menciones legítimas —una cervecera que madura en
botas de vino, un dulce hecho con aceite— a un ritmo que enterraba los
hallazgos. Léela como corroboración una vez marcada la fila: suele ser el campo
que dice cuál de los dos está contaminado.

Es una **lista de candidatos, no de veredictos**: en muestreo sistemático
acierta en torno a 2 de cada 3. Los falsos positivos tienen forma reconocible
—productor genuinamente mixto, y producto cuyo nombre pertenece a otra
categoría («tomate frito» en una conservera)—, así que se descartan de un
vistazo. Lo que queda es editorial y no es mecánico: la reparación exige fuente
del productor y puede tocar categoría, productos y descripción.

Tres decisiones que se midieron y que conviene no deshacer sin volver a medir:
la marca comercial no cuenta como producto (si no, toda almazara llamada
«Molino de…» era harinera), un sustantivo tras `con`/`de` es ingrediente y no
línea de producto, y una etiqueta retirada se resuelve antes de comparar (si no,
la deriva de taxonomía se lee como contaminación).

### G-WEB-1 — dominios muertos, aparcados y secuestrados ✅

Hecho. `pnpm check:links` resuelve cada `web` y la **clasifica sin decidir**:
NXDOMAIN · sin NS · sin registro A · conexión rechazada · timeout · TLS ·
redirección a otro dominio · parking · portada de proveedor · 403 vivo · 200
vivo. La clasificación alimenta R0 y R1, no los sustituye: un 403 no es un sitio
muerto y un 200 no prueba que la web sea del productor.

El producto es el snapshot fechado `data/reference/web-status.json`, que
convierte el paso más caro de una pasada —abrir dominios a mano— en lectura:

```bash
npx pnpm check:links -- --offline --area <area>   # sin red
npx pnpm check:links -- --area <area>             # refresca
```

Caduca, porque `web` es una afirmación dinámica igual que `Venta online`: el
informe da la edad de cada dato y marca los de más de 90 días. Sirve también
para triar `web-de-tercero`, porque lista los dominios compartidos por varias
filas.

Lo que queda de aquí en adelante es editorial: triar las señales por provincia.

### G-AUD-1 — utilidad del inventario

- Mantener `--json` como interfaz para formar uniones y medir antes/después.
- Añadir automatización nueva solo si varias tandas repiten el mismo trabajo
  mecánico. No convertir la planificación en otra base de datos.
- No endurecer checks de juicio editorial hasta que la regla sea estable, tenga
  pocos falsos positivos y cuente con pruebas.

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

1. Reconciliar filas, slugs, estados, venta, canales, enlaces, evidencia,
   candidatos e imágenes.
2. Comprobar dependencias:
   - `sí` ↔ canal;
   - `ecommerce` ↔ tienda demostrada;
   - `email` ↔ correo;
   - `telefono|whatsapp` ↔ teléfono;
   - horario ↔ canal público vigente.
3. Repetir deduplicación, propiedad de enlaces, geografía y revisión de todos
   los `Venta online=sí`.
4. Clasificar todos los avisos de calidad: corregirlos en R1/T/E o documentar
   las excepciones geográficas y editoriales legítimas; no dejar avisos
   olvidados.
5. Revisar `parcial`, `pendiente` y `no comprobado` residuales sin forzar una
   promoción.
6. Podar candidatos resueltos y comprimir el ledger provincial según
   `docs/VERIFICATION_TECHNIQUES.md`.
7. Actualizar la cabecera de reserva: `Estado de pasada: mantenimiento` y la
   línea `Método` con los detectores vigentes.
8. `data/evidence/coverage.json` se toca solo si la provincia cumple su
   criterio propio —toda fila con registro `keep`, según
   `docs/EVIDENCE_CONTRACT.md`—, que **no** es «cero pendientes». Cerrar una
   pasada no implica entrar en ese fichero, y no entrar no es deuda.
9. Ejecutar todos los gates de cierre.

Una provincia termina la pasada profunda cuando no quedan `pendiente`, los
residuales tienen un techo de evidencia conocido y las afirmaciones dinámicas
fueron revisadas. Después pasa a mantenimiento; el catálogo no queda
congelado.

## 6) Orden de las olas

El orden se recalcula al inicio de cada ola con el inventario vivo. No se
mantienen rankings provinciales en documentos.

Las olas describen prioridad, no una cola estrictamente serie. **La Ola 0 y la
Ola 1 corren en paralelo desde el primer día**: son ficheros disjuntos y la
tabla de bloqueo del § 4 dice exactamente qué carril espera a qué puerta.
Encolar el saneamiento de filas publicadas detrás de cuatro lotes de tooling
mantiene vivo el daño peor por el defecto más barato.

### Ola 0 — tooling

Completar G-CAT, G-GEO, G-TPL y G-WEB. Evita que el trabajo editorial pueda
reintroducir categorías retiradas o escapar de la geografía, y precalcula los
enlaces muertos para las olas siguientes.

### Ola 1 — riesgo alto y colas pequeñas cerrables

No espera a la Ola 0.

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

```bash
npx pnpm check:csv:changed
npx pnpm check:evidence:changed
npx pnpm check:evidence
git diff --check
```

Además:

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

## 9) Secuencia de arranque

Dos carriles en paralelo. El de datos no espera al de tooling salvo donde lo
diga la tabla de bloqueo del § 4.

**Tooling (ventana global, `verify:ai`)**

1. ~~G-WEB-1: clasificación de dominios.~~ ✅ Hecho: el snapshot ya está, y el
   re-escaneo de las cerradas es leerlo con `--offline`, no repasarlas.
2. ~~G-CAT-1: detector, mapa canónico y pruebas.~~ ✅ Hecho: el registro lleva
   la cuenta y `check:defects --check categoria-variante` es el re-escaneo.
3. ~~G-CAT-2: migración por familias y retirada efectiva de etiquetas.~~ ✅ Hecho:
   `retiredCategories` ya no corta con `categories`.
4. ~~G-GEO-1: municipios bilingües y casos de homónimos.~~ ✅ Hecho.
5. ~~G-TPL-1: detector advisory de plantilla cruzada.~~ ✅ Hecho.

Cada uno cierra con el re-escaneo de las provincias ya cerradas.

**Datos (una provincia por escritor, desde el día uno)**

1. R0: basura visual y enlaces ajenos ya confirmados.
2. R1: provincias con `pendiente`/`sinteticas`, de cola menor a mayor.
3. V: `canal-sin-clasificar`.
4. R1: clusters de fuentes prestadas, dejando campañas grandes para lotes
   secuenciales.
5. V: provincias con 1–40 ventas sin resolver; continuar por bandas.
6. T0 sobre las provincias con más plantilla. **Desbloqueado**: las tres
   puertas del carril T (G-CAT-1, G-CAT-2, G-TPL-1) están verdes.
7. T1, E, I y C según se estabilice cada provincia.

Antes de iniciar cualquiera de los dos puntos 1 se vuelve a medir: si otro
trabajo ya lo resolvió, se elimina o reajusta el lote en vez de repetirlo.
