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

Las puertas de tooling que cerraban la reentrada de un defecto (taxonomía,
geografía, plantilla cruzada, dominios) están todas cerradas: qué detecta cada
una y cómo se re-escanea está en `docs/es/DEFECT_REMEDIATION_PLAN.md` § 4.

## Deuda editorial

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
  `docs/VERIFICATION_TECHNIQUES.md` § Venta online. Ourense y Lugo tienen pasada
  profunda; el resto no. Al resolver a `sí`, rellena `Canal de venta` en el mismo
  cambio (`--check canal-sin-clasificar` lista las que se quedaron a medias). Las
  dos filas que venden por DM de Instagram se quedan ahí: **decidido 2026-08-02
  que la mensajería social no lleva token propio**, porque de las 236 filas con
  `sí` y sin web, 152 tienen redes y ya están tipificadas con el enum actual; un
  token nuevo rescataría 2 y desclasificaría 152. Residual legítimo, no deuda.
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
  `docs/es/DEFECT_REMEDIATION_PLAN.md` § 4 (G-TPL-1).
- **Cobertura de evidencia** (`--check sin-evidencia`): la evidencia es
  advisory y falta-`keep` **no** es deuda (`docs/EVIDENCE_CONTRACT.md`). Úsalo
  solo para saber dónde no hay rastro de por qué se decidió algo, no para
  backfillear.
