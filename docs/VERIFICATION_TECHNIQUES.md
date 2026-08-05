# Técnicas de verificación de catálogos de área

Manual operativo para revisar `data/csv/[country]/[region]/[area].csv`, en cualquier país. `AGENTS.md`,
`docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y `docs/EDITORIAL_POLICY.md`
contienen los contratos; aquí se define cómo investigar con eficiencia.

Lo que solo vale para un país —fuentes autorizadas, registros cruzables, trampas locales y qué
significa `area` allí— vive en su guía, `data/csv/[country]/AGENTS.md`. Léela antes de abrir un área
de un país que no conozcas.

La fuente de verdad del productor es el CSV. El JSONL de evidencia guarda procedencia estructurada;
un ledger de área, si existe, solo conserva fuentes locales, excepciones y progreso.

## Cómo usar este documento

Lee siempre **Reglas duras**, **Flujo mínimo** y **Decisión por fila**. Consulta las demás secciones
solo cuando el lote incluya venta online, duplicados, ubicación, imágenes o cierre de área.

El agente puede elegir herramientas, fuentes, orden y tamaño de lote. Debe emplear el método menos
costoso que produzca evidencia suficiente y detener la investigación cuando la decisión ya sea sólida.
Solo las reglas duras, los valores del contrato y la validación son obligatorios; prioridades y
técnicas son heurísticas que el agente puede adaptar al caso.

## Reglas duras

1. **No confíes en los datos heredados.** Web, redes, Maps y venta pueden estar autocompletados o mal.
2. **No inventes.** Vacío es mejor que falso.
3. **Elimina enlaces ajenos.** Un HTTP 200 de otra entidad es desinformación.
4. **Un fallo técnico no prueba una baja.** Contrasta timeout, TLS, DNS o bloqueo por otra vía.
5. **No purgues con evidencia débil.** Exige duplicidad, fuera de alcance/área, baja clara o
   ausencia suficientemente contrastada.
6. **Las afirmaciones dinámicas requieren evidencia actual.** Especialmente actividad y venta.
7. **No inventes precisión geográfica.** Un centroide honesto es preferible a un punto conjeturado.
8. **Mantén correcto el `slug`.** Conserva un slug correcto, pero cámbialo si codifica
   una identidad o municipio erróneo, un duplicado, una errata engañosa o una corrección
   explícita del usuario. Si el slug existía en Git, deja un registro `merge` del antiguo al nuevo.

## Flujo mínimo

1. **Protege el trabajo existente**

   ```bash
   git status --short
   npx pnpm list:area [area]   # acótalo en áreas grandes (ver Disciplina de contexto)
   ```

   Evita abrir en paralelo un área ya activa. Para una fila concreta, localízala con `rg` en el
   CSV y en su JSONL de evidencia; lee solo esas ventanas.

2. **Define un lote útil**

   Agrupa por municipio, zona, categoría, fuente o riesgo. No hay tamaño obligatorio: usa el menor lote
   que permita compartir contexto sin mezclar decisiones.

3. **Prioriza**

   - duplicados, enlaces ajenos, fuera del área y no productores;
   - pendientes con fuente propia fácil de comprobar;
   - `Venta online=sí` no demostrada;
   - filas de registro o sin presencia propia;
   - residuales `parcial` y `no comprobado`.

4. **Investiga hasta evidencia suficiente**

   Empieza por la fuente más directa disponible. La mayoría de filas se cierran con una sola fuente
   primaria que confirme identidad, actividad y municipio: ése es el coste esperado por fila. Amplía
   —más búsquedas, redes o registros— solo ante contradicción, riesgo de purga o una afirmación
   dinámica (actividad o venta) aún sin demostrar. No recopiles datos opcionales que no cambien la
   decisión ni el encargo.

5. **Edita quirúrgicamente**

   Usa un parser CSV, preserva LF y toca solo los `slug` del lote. Añade o sustituye una línea JSONL
   para cada alta, cambio de `verificacion`, decisión de venta, purga o fusión. Al purgar, elimina su
   imagen referenciada y actualiza la nota de candidatos afectada. Si reescribes el registro de una fila
   `verificado` (p. ej. para fijar solo `Venta online`), conserva en sus fuentes los claims
   `identity`/`producer-activity`/`municipality`: `check:evidence` rechaza un `verificado` cuya evidencia
   solo aporta `online-sales`. Tras un lote, reconcilia evidencia↔CSV (decisión = `verificacion`/`Venta
   online`/`Canal de venta`) antes de validar.

6. **Valida**

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence
   npx pnpm check:evidence:changed   # warning-only: ¿alguna decisión sin evidencia?
   git diff --check
   git diff -- data/csv/[country]/[region]/[area].csv
   git diff -- data/evidence/[country]/[region]/[area].jsonl
   ```

   Al cerrar trabajo de datos, ejecuta `npx pnpm verify:data`.

## Evidencia suficiente

La fuente adecuada depende de la afirmación:

| Afirmación | Evidencia preferida | No basta por sí solo |
|---|---|---|
| Identidad y actividad | Web/perfil oficial o ficha individual fiable | Snippet, búsqueda genérica o dominio plausible |
| Existencia registral | Registro oficial o consejo regulador con match de entidad | Coincidencia parcial de nombre |
| Ubicación | Dirección oficial o ficha individual coherente | Centroide o URL de búsqueda |
| Contacto | Canal publicado por la propia entidad | Directorio sin fecha |
| Venta online | Pedido remoto vigente y utilizable | Web, catálogo, precios o texto legal |

Los registros pueden estar desactualizados. Confirman como máximo lo que publican: no prueban actividad
actual, elaboración para consumidor ni venta remota. No aparecer en un registro voluntario tampoco
prueba inexistencia.

Para hacer match de entidad combina nombre o razón social con municipio y, cuando existan, marca,
teléfono, correo o dirección. No prolongues la búsqueda si una fuente primaria ya resuelve esos puntos
sin contradicciones.

Algunos países tienen un registro cruzable con tooling propio; si existe, está en su guía de país. Un
cruce de ese tipo confirma existencia y localidad —techo `parcial`— y nunca prueba venta online.

Registra la fuente con los claims concretos que demuestra. Una URL no hereda autoridad sobre todos los
campos: por ejemplo, un marketplace puede probar venta activa sin probar municipio.

## Decisión por fila

Revisa únicamente lo necesario para responder:

1. ¿Existe y está activa?
2. ¿Produce o elabora, en vez de limitarse a revender o servir?
3. ¿Corresponde a esta área y municipio?
4. ¿Los enlaces y datos que se conservan pertenecen a esa entidad?
5. ¿La venta remota está correctamente clasificada?

| Resultado | Acción |
|---|---|
| Identidad, actividad productora, municipio y datos principales contrastados | `verificado` |
| Existe, pero solo hay registro/fuente secundaria o queda una duda material | `parcial` |
| No se ha podido revisar suficientemente | `pendiente` |
| Duplicado, no productor, otra área, entidad inexistente o baja definitiva probada | Purgar |

`parcial` es un cierre válido cuando existe un techo real de evidencia. No promociones para vaciar
la cola. El contrato acepta enlaces externos válidos, pero una URL
`maps/search/?api=1&query=...` no demuestra editorialmente la identidad.

La matriz normativa y sus casos sintéticos viven en `docs/EDITORIAL_POLICY.md`; este manual no debe
crear criterios de área alternativos.

### Campos

- Corrige `nombre`, `municipio`, categoría, productos y descripción solo con evidencia.
- `direccion`, teléfono y correo deben estar publicados y pertenecer a la entidad.
- Usa categorías válidas y teléfono E.164.
- No mantengas horarios que remitan a una web, red o teléfono inexistente.
- Web y redes deben ser oficiales; un artículo, guía o ayuntamiento no es la web del productor.
- Una tienda, restaurante, distribuidor o explotación registrada no entra por defecto: debe producir
  o elaborar dentro del alcance del catálogo.

## Venta online

Los criterios de decisión — cuándo un canal cuenta para `sí`, la regla de reventa
por terceros y qué no basta — son el checklist de `docs/EDITORIAL_POLICY.md`
§ Online sales; los tokens de `Canal de venta` viven en `docs/CSV_CONTRACT.md`.
Audítala aparte de la identidad y combina canales con `|`.

Revisa todos los `sí`. En cierres profundos revisa también `no` y `no comprobado`, porque pueden ocultar
pedidos por contacto directo. Un fallo temporal justifica `no comprobado`, no necesariamente `no`.

**Confirmar venta en webs difíciles.** Muchas webs de productor —las de vino en especial— bloquean
WebFetch por age-gate, Cloudflare o TLS; un fetch fallido no prueba que no haya tienda. Antes de cerrar en
`no`/`no comprobado`, confirma con una búsqueda (`"<nombre>" tienda online comprar`) y busca la tienda en un
**dominio o subdominio de marca aparte** (`shop.<marca>`, `<marca>-shop`, o la palabra «tienda» del idioma
local). Distingue el canal propio del de terceros al rellenar `Canal de venta`.

**Y al revés: que parezca tienda no basta.** El error simétrico es más fácil de cometer porque nadie lo
revisa. Tres formas medidas de dar un `sí` falso:

- **La palabra «shop» en una ruta suele ser un listado de distribuidores o de tiendas físicas**, no un
  carrito: `/shop-list/`, `/shop.html`, `/shop/` con el mapa de puntos de venta. Ábrelo antes de creerlo.
- **Contar la palabra en el HTML da falsos positivos.** Las coincidencias pueden ser ficheros CSS de la
  plantilla o rutas de blog. Extrae el `href` y mira a dónde va.
- **Un `200` puede ser un aviso de mudanza.** Hay dominios que responden y cuyo cuerpo dice que el sitio se
  ha trasladado; el registro que los publica no se entera. Lee el cuerpo, no solo el código.

Lo que sí sostiene `sí` es una plataforma de pago identificable (Shopify, BASE, STORES, ColorMe, MakeShop,
`.official.ec`, `theshop.jp`) o un carrito en el propio dominio.

## Deduplicación

Normaliza acentos, mayúsculas y separadores. Compara nombre/marca, dominio, teléfono, correo, dirección,
coordenadas, `place_id` y razón social.

Coincidir en varios identificadores suele señalar una entidad o dos marcas del mismo operador. Conserva
el `slug` correcto más estable y fusiona solo si representan la misma unidad productiva.

No fusiones automáticamente cooperativa y socio, secciones productivas distintas, negocios contiguos
o productores que comparten finca, mercado o centroide. `grep -i` no pliega acentos y no sirve como
único control.

Un dominio que no casa con el nombre de la fila suele ser el **grupo matriz**, no una web cruzada: las
marcas de un grupo publican bajo el dominio o la marca de la matriz, así que cruzar dos
denominaciones por dominio da falsos positivos de duplicado. Señales de cruce real: razón social
distinta, el mismo Instagram compartido entre filas sin relación, o una web que resulta ser un
directorio. Ante grupo confirmado, cada marca con identidad y municipio propios sigue siendo una fila
válida.

## Ubicación

- Contrasta `municipio`, `direccion`, `lat` y `lon` conjuntamente.
- Si geocodificas, acota la consulta al país del área, respeta el servicio usado y valida contra el
  centroide municipal.
- Hasta 15 km es la banda esperada; 15–100 km requiere revisión; más de 100 km bloquea el contrato.
- Si el centroide corresponde a un homónimo territorial, corrige
  `data/reference/municipality-overrides.json`; no muevas productores correctos.
- Si una dirección no resuelve, conserva el centroide. Coordenadas iguales o próximas son una alerta,
  no una orden de fusionar.

## Imágenes

Revísalas después de estabilizar identidad y `slug`. Todo el flujo (formato,
fuentes, calidad, naming, `enrich:images`, basura conocida y auditoría por
hash) vive en `docs/IMAGES.md`; el contrato del campo `imagen` en
`docs/CSV_CONTRACT.md`.

## Disciplina de contexto

- No leas todo el CSV para editar unas filas.
- No leas ni reformatees todo el JSONL: busca el `slug` y sustituye una sola línea.
- El roster `list:area` de un área grande (Barcelona, Madrid) también llena el contexto:
  acótalo con `--categoria`/`--pendientes` o `rg`, no lo vuelques entero.
- No releas este documento completo en cada lote; conserva solo las secciones aplicables.
- Consulta `docs/CSV_CONTRACT.md` solo para dudas estructurales o valores permitidos.
- Busca una entidad por nombre + municipio; añade categoría, teléfono o dominio solo si hay homónimos.
- Reutiliza una fuente común para todo el lote sin repetir su explicación por fila.
- No abras todas las redes si una fuente primaria ya resuelve la identidad.
- No persigas campos opcionales vacíos salvo que el encargo sea enriquecimiento.
- Registra excepciones y decisiones difíciles; no narres comprobaciones rutinarias.
- Usa scripts efímeros en `/tmp` para tareas mecánicas; no los conviertas en una capa permanente.

Estas son pautas de eficiencia, no límites de investigación. Amplía el trabajo cuando haya
contradicciones, riesgo de purga, duplicidad o una afirmación dinámica dudosa.

## Trazabilidad

El JSONL registra de forma estructurada fuente, fecha, claims y decisión. El mensaje de commit o el
ledger de área deben limitarse a lo necesario para reanudar:

- lote y fecha;
- verificadas, parciales y purgas;
- fusiones o correcciones relevantes;
- residuales y motivo.

No dupliques en narrativa cada fuente rutinaria que ya está en el JSONL. Documenta explicación fina
solo para purgas, fusiones, dudas residuales y excepciones que otro agente podría interpretar de forma
distinta.

## Pasada de consistencia al cerrar una pasada de área

Esta pasada es de área, no necesaria tras cada lote:

1. Concilia filas, estados, venta, canales, imágenes y evidencia.
2. Comprueba dependencias: `sí`/canal; `ecommerce`/web; `email`/correo;
   `telefono|whatsapp`/teléfono; horarios/campo referido.
3. Repite deduplicación y revisa colisiones geográficas.
4. Audita identidad de enlaces y todos los `Venta online=sí`.
5. Revisa residuales `parcial` y `no comprobado`.
6. Revisa diff, LF, imágenes, evidencia y ejecuta `npx pnpm verify:data`.

Una **pasada** de revisión se cierra cuando no quedan `pendiente`, cada residual tiene una razón
conocida y las afirmaciones dinámicas se han comprobado; entonces el área entra en mantenimiento.
El CSV nunca se «cierra» ni se da por terminado: es un catálogo vivo. Las afirmaciones dinámicas
(actividad, cierre, venta online) y la frescura de la evidencia se vuelven a comprobar durante el
mantenimiento. Añadir el área a `data/evidence/coverage.json` la marca como cobertura completa
de evidencia (advisory: `check:evidence` no bloquea), pero no congela el catálogo ni cierra el CSV.

## Documento de área opcional

Crea `docs/verification/[country]/[area].md` solo si el CSV y este manual no bastan para reanudar. Durante
una pasada es un documento de trabajo: snapshot, worklist, plan de lotes, fuentes locales y
excepciones. No copies este manual ni conviertas el ledger en otra base de datos. Las pistas no
aceptadas siguen en `docs/candidates/[country]/[area].md`.

### Rotación al cerrar la pasada

Al cerrar una pasada, comprime el ledger a un snapshot de mantenimiento (~40-80 líneas); el detalle
por lote queda en el historial git del propio fichero. Cerrar la pasada no cierra el catálogo:
`verificado` registra el estado de la evidencia en una fecha, no una verdad definitiva, y las
afirmaciones dinámicas (actividad, cierre, venta online) caducan. El documento comprimido existe para
la siguiente sesión de mantenimiento, no como acta de la pasada.

Conserva exactamente:

- **Estado final**: fecha y commit de cierre, filas y recuento por `verificacion`, `Venta online`
  sí/no/nc con cobertura de canal, evidencia y si el área está en `coverage.json`.
- **Residuales justificados**: cada `pendiente`/`parcial` restante y cada duda de venta con su techo
  real de evidencia, para no reinvestigarlos desde cero.
- **Excepciones y reglas locales reutilizables**: homónimos y geografía, decisiones que otro agente
  podría revertir por error, purgas/merges que conviene no deshacer.
- **Fuentes locales** que funcionaron y sus límites.
- **Mantenimiento**: qué recomprobar al retomar (los `VO=sí`, actividad de filas antiguas, imágenes
  pendientes) y desde qué fecha.

Elimina la narrativa por lote, los volcados de comandos y todo lo que ya vive en CSV, JSONL o git.
