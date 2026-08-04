# Backlog editorial de España

Cola de trabajo transversal del catálogo español. La guía compartida es
`AGENTS.md` en la raíz; lo específico del país, `data/csv/es/AGENTS.md`.

Trabajo pendiente que cruza provincias o sesiones. Cualquier agente puede tomarlo; actualiza o borra
la entrada al avanzarla. No dupliques aquí el estado provincial (eso vive en `docs/verification/`).

**Empieza por medir, no por leer esta lista:**

```bash
npx pnpm check:defects
```

El plan de ejecución por lotes, propiedad provincial, orden de carriles,
criterios de salida y gates vive en
`docs/es/DEFECT_REMEDIATION_PLAN.md`. Esta sección describe la worklist; el plan
explica cómo reducirla durante muchas sesiones sin solapes ni regresiones.

Imprime, por provincia, cuántas filas tiene cada defecto de abajo. Añade
`--area <nombre>` para una sola, `--check <id> --list` para ver los slugs y
`--json` para tratarlo. No es bloqueante: es la worklist. Los recuentos viven
**solo** ahí; si los copias aquí caducan. Cubre lo que las otras puertas no
pueden ver porque necesitan contexto entre ficheros o un juicio que el contrato
no codifica.

Los checks marcados `señal, no cola` (`sin-imagen`, `sin-evidencia`) son huecos
de cobertura donde vacío es un final válido: no son carga de trabajo. La última
línea, `carga real`, ya descuenta esas señales y deduplica por fila, que es la
unidad de investigación real.

## A) Arreglos de tooling que cierran la puerta (hazlos antes que el trabajo editorial)

Cada uno convierte una limpieza manual recurrente en algo que el validador
impide. Requieren `verify:ai`.

- ~~**`categories.json` acepta 29 etiquetas que nadie usa.**~~ ~~**El aviso de
  variantes de `audit-csv.js` no pliega plurales.**~~ Hechos, y con ellos la
  migración entera (G-CAT-1 y G-CAT-2): `categories.json` lleva
  `retiredCategories`, las 64 etiquetas retiradas están a cero usos y fuera del
  registro, y volver a escribir cualquiera de ellas es error de contrato con el
  reemplazo en el mensaje. `categoria-variante` está a cero.
- ~~**Nada en el repo resuelve un dominio.**~~ Hecho: `check:links` clasifica
  cada `web` y guarda el resultado fechado en `data/reference/web-status.json`.
  **Léelo con `--offline` antes de abrir dominios a mano**; solo vuelve a la red
  con `--area` o `--all`. Clasifica sin decidir, y esa distinción es el
  punto: un 403 no es un sitio muerto y un 200 no prueba que la web sea del
  productor. Lo que queda es editorial, no de tooling — triar sus señales
  provincia a provincia.
- ~~**El enum de `Canal de venta` no tipifica la mensajería social.**~~
  **Decidido 2026-08-02: no se añade token; son residual legítimo.** La duda era
  si `quesos-argudo-campillos` y `miel-el-chozo-villanueva-del-trabuco` —`Venta
  online=sí` probado, pedido por DM— justificaban tocar el enum. Lo que lo
  zanja es medir la población: de 5.923 filas con `sí`, **236 no tienen web y
  152 de esas sí tienen Instagram o Facebook**, y todas ellas ya están
  clasificadas con los tokens existentes. Un token nuevo no rescataría 2 filas:
  dejaría 152 mal tipificadas. Así que `canal-sin-clasificar` conserva esas dos
  y eso es un final válido, no deuda.

- ~~**Municipios en forma bilingüe `A / B` se saltan el geo-check.**~~ Hecho: el
  lookup prueba cada mitad, tanto en `A / B` como en `Municipio (pedanía)`, y
  solo se fía cuando concuerdan —si no, un homónimo como `La Floresta (Sant
  Cugat)` inventaría un hueco de 96 km—. `geo-check skipped` bajó de 384 a 322.
  Las que quedan son pedanías reales sin centroide: hueco documentado y
  aceptado, no lo persigas.

## B) Deuda editorial

Ordenada por daño al usuario, no por tamaño.

- **Filas sintéticas** (`--check sinteticas`): sin web, teléfono, correo, redes
  ni Maps. Nombres construidos por plantilla `[categoría] + [topónimo]` con
  dominios que no resuelven. **Están publicadas.** El método que sí sostiene la
  purga está en `docs/EDITORIAL_POLICY.md` § Decision order y ya se aplicó 65
  veces: no basta «no encontré nada» — hace falta la ausencia en una **fuente
  exhaustiva que la listaría si existiera** (marca autonómica, registro de
  operadores de la DOP, RGSEAA) más contactos sin correspondencia pública. Si
  aparece en esa fuente, se queda como `parcial` con ella de fuente.
- **Evidencia prestada** (`--check evidencia-prestada` y `--check
  web-de-tercero`): un pin de Google Maps o la web del consejo regulador
  bastan para pasar el gate de `verificado`, que solo exige coordenadas + un
  enlace externo. Clusters típicos: `apoloybaco.com` (un blog) en Toledo,
  `faba-asturiana.org`, `parcagrari.cat`, `quesoidiazabal.eus`. Revisa la fila,
  no el dominio: alguna es un grupo real.
- **`Venta online` sin resolver** (`--check venta-sin-resolver`): el mayor hueco
  abierto del catálogo y el que más útil hace una ficha. Criterio en
  `docs/es/VERIFICATION_TECHNIQUES.md` § Venta online. Ourense y Lugo tienen pasada
  profunda; el resto no. Al resolver a `sí`, rellena `Canal de venta` en el mismo
  cambio (`--check canal-sin-clasificar` lista las que se quedaron a medias).
- **Descripciones genéricas** (`--check descripcion-generica`): texto que narra
  nuestro proceso («incorporado desde directorios de…», «revisado con Google
  Maps») o repite la categoría. Se publica tal cual en la ficha. **No son
  decisiones fila a fila:** añade `--plantillas` y salen agrupadas por forma de
  volcado —un puñado de plantillas cubre la mayoría—. Decide una vez por forma:
  si no aporta un hecho ausente de `categoria`/`municipio`, vacía el grupo
  entero (`descripcion` vacía es `suppressed`, ni siquiera avisa). Solo el
  residual es cola de redacción.
- **Imágenes** (`--check sin-imagen`): flujo en `docs/IMAGES.md`; `enrich:images`
  por slug con `--contact-sheet`, nunca `--apply` en bloque. Rinde más empezar
  por provincias pequeñas y ya cerradas editorialmente que por las grandes.
- **Corrupción por plantilla cruzada** (`--check plantilla-cruzada`): filas que
  heredaron `productos estrella` de otra categoría (texto de miel en una
  almazara). El barrido ya no hay que hacerlo a mano: el check las cruza. Es
  **lista de candidatos, no de veredictos** —acierta ~2 de cada 3—, así que se
  abre la ficha y se decide si sobra el producto o sobra la categoría; el falso
  positivo típico es el productor genuinamente mixto. Criterio en
  `docs/es/DEFECT_REMEDIATION_PLAN.md` § G-TPL-1.
- **Cobertura de evidencia** (`--check sin-evidencia`): la evidencia es
  advisory y falta-`keep` **no** es deuda (`docs/EVIDENCE_CONTRACT.md`). Úsalo
  solo para saber dónde no hay rastro de por qué se decidió algo, no para
  backfillear.

## C) Higiene de repo

- **Candidatos:** las casillas `- [ ]` de `docs/candidates/` **no son cola
  abierta** — la poda al integrar no se está cumpliendo y entre el 59% y el 73%
  de las casillas sin marcar ya están en el CSV. Cruza siempre contra el CSV por
  nombre normalizado + dominio antes de planificar sobre uno de esos ficheros, y
  poda al resolver como pide `docs/candidates/README.md`.
- **Ramas:** comprueba con `git diff main...<rama> -- data/csv` antes de creer
  que una rama tiene trabajo vivo; varias `codex/*` ya están en `main` y alguna
  está por detrás. Si la rama va por detrás, bórrala en vez de fusionarla.

