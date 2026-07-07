# Técnicas de verificación de catálogos provinciales

Manual operativo para revisar `data/csv/[comunidad]/[provincia].csv`. `AGENTS.md`,
`docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y `docs/EDITORIAL_POLICY.md`
contienen los contratos; aquí se define cómo investigar con eficiencia.

La fuente de verdad del productor es el CSV. El JSONL de evidencia guarda procedencia estructurada;
un ledger provincial, si existe, solo conserva fuentes locales, excepciones y progreso.

## Cómo usar este documento

Lee siempre **Reglas duras**, **Flujo mínimo** y **Decisión por fila**. Al abrir una provincia añade
**Arranque de provincia**; al volver sobre una ya pasada, **Mantenimiento y pasadas sucesivas**.
Consulta las demás secciones solo cuando el lote incluya venta online, duplicados, ubicación, imágenes
o cierre provincial.

Lo único obligatorio son las reglas duras, los valores del contrato y la validación. Todo lo demás
—prioridades, orden, tamaño de lote, técnicas— describe el camino barato ya probado, no el único
válido: usa el método menos costoso que produzca evidencia suficiente, detente cuando la decisión sea
sólida y desvíate del manual cuando tu criterio lo mejore, dejando constancia si la desviación afecta
a cómo otro agente reanudaría el trabajo.

## Reglas duras

1. **No confíes en los datos heredados.** Web, redes, Maps y venta pueden estar autocompletados o mal.
2. **No inventes.** Vacío es mejor que falso.
3. **Elimina enlaces ajenos.** Un HTTP 200 de otra entidad es desinformación.
4. **Un fallo técnico no prueba una baja.** Contrasta timeout, TLS, DNS o bloqueo por otra vía.
5. **No purgues con evidencia débil.** Exige duplicidad, fuera de alcance/provincia, baja clara o
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
   npx pnpm list:province [provincia]   # acótalo en provincias grandes (ver Disciplina de contexto)
   ```

   Evita abrir en paralelo una provincia ya activa. Para una fila concreta, localízala con `rg` en el
   CSV y en su JSONL de evidencia; lee solo esas ventanas.

2. **Define un lote útil**

   Agrupa por municipio, zona, categoría, fuente o riesgo. No hay tamaño obligatorio: usa el menor lote
   que permita compartir contexto sin mezclar decisiones. Si el doc provincial define lotes con slugs
   congelados, tu lote es esa lista: no edites filas ajenas ni «de paso»; anota el hallazgo y sigue.

3. **Prioriza**

   - duplicados, enlaces ajenos, fuera de provincia y no productores;
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
   git diff -- data/csv/[comunidad]/[provincia].csv
   git diff -- data/evidence/[comunidad]/[provincia].jsonl
   ```

   Al cerrar trabajo de datos, ejecuta `npx pnpm verify:data`.

## Arranque de provincia (primera pasada)

Léelo al abrir una provincia, no en cada lote. Una pasada profunda rinde más si empieza con un plan,
dimensionado con criterio: en un catálogo pequeño bastan el snapshot y un par de lotes. Los
invariantes son cubrir todas las filas, decidir cada una con evidencia y poder reanudar en cualquier
punto; el resto es adaptable.

- **Snapshot y flags.** Cuenta filas, estados, venta/canales e imágenes, y detecta de una vez las
  anomalías mecánicas (grafías de municipio, geo-warnings, dominios o teléfonos compartidos entre
  filas, `sí` sin canal, purgas probables) como flags por fila: el flag es tarea, no decisión.
- **Lotes con slugs congelados.** Agrupa por sector y zona para reutilizar fuentes (8-20 filas suele
  funcionar), sin solapes y con un cierre transversal al final. Publica slugs y flags por lote en el
  doc provincial: cualquier agente ejecuta su lote leyendo solo eso, y toda fila acaba decidida.
- **La herencia se reaudita.** Estados y venta previos a la pasada son datos heredados: un
  `verificado`/`parcial` antiguo es un `pendiente` con ventaja (suele tener web), y los `sí` —sobre
  todo sin canal— entran en cuarentena hasta re-derivar el mecanismo de pedido.
- **Mapa de fuentes provinciales.** Localiza antes de empezar directorios institucionales, DO/IGP,
  marcas de garantía y prensa local, y anota su techo: como fuente única suelen capar en `parcial`.
- **Sin altas nuevas.** La pasada decide lo que ya hay; los descubrimientos van a
  `docs/candidates/[provincia].md`, no al CSV, salvo encargo explícito.

### Señales de triaje

Trampas recurrentes de los volcados; valen también al reauditar:

| Señal | Acción probable |
|---|---|
| Dominio caducado, aparcado o con contenido ajeno | Retirar la web; por sí solo no prueba baja |
| Mismo dominio sectorial (DO, asociación) en varias filas | Retirarlo de todas: es fuente de cotejo, no web propia |
| Consejo regulador, IGP/M.G., asociación, feria, gran grupo | Purga (`not-producer` u `out-of-scope`) salvo operador real que elabore con esa marca; no convertir la fila en otro productor «parecido» |
| `Venta online=sí` en bloque y sin canal (volcado de Maps) | Cuarentena: re-derivar el mecanismo antes de conservar |
| Ruido de volcado en `nombre` o en la categoría | Corregir con evidencia; el `slug` no se toca por limpiar el nombre |
| `municipio` = sede administrativa o dirección postal | Corregir al municipio de la unidad productiva |

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

Para Cataluña, `node scripts/match-dar.mjs "<municipio>" [--csv <path>] [--all]` cruza un CSV con el
registro DAR de venda de proximitat por teléfono, correo y apellidos. Confirma existencia/localidad
(`parcial`), sugiere duplicados o candidatos y nunca prueba venta online ni sustituye al CSV.

Registra la fuente con los claims concretos que demuestra. Una URL no hereda autoridad sobre todos los
campos: por ejemplo, un marketplace puede probar venta activa sin probar municipio.

## Decisión por fila

Revisa únicamente lo necesario para responder:

1. ¿Existe y está activa?
2. ¿Produce o elabora, en vez de limitarse a revender o servir?
3. ¿Corresponde a esta provincia y municipio?
4. ¿Los enlaces y datos que se conservan pertenecen a esa entidad?
5. ¿La venta remota está correctamente clasificada?

| Resultado | Acción |
|---|---|
| Identidad, actividad productora, municipio y datos principales contrastados | `verificado` |
| Existe, pero solo hay registro/fuente secundaria o queda una duda material | `parcial` |
| No se ha podido revisar suficientemente | `pendiente` |
| Duplicado, no productor, otra provincia, entidad inexistente o baja definitiva probada | Purgar |

`parcial` es un cierre válido cuando existe un techo real de evidencia. No promociones para vaciar
la cola. El contrato acepta enlaces externos válidos, pero una URL
`maps/search/?api=1&query=...` no demuestra editorialmente la identidad.

La matriz normativa y sus casos sintéticos viven en `docs/EDITORIAL_POLICY.md`; este manual no debe
crear criterios provinciales alternativos.

### Campos

- Corrige `nombre`, `municipio`, categoría, productos y descripción solo con evidencia.
- `direccion`, teléfono y correo deben estar publicados y pertenecer a la entidad.
- Usa categorías válidas y teléfono E.164.
- No mantengas horarios que remitan a una web, red o teléfono inexistente.
- Web y redes deben ser oficiales; un artículo, guía o ayuntamiento no es la web del productor.
- Una tienda, restaurante, distribuidor o explotación registrada no entra por defecto: debe producir
  o elaborar dentro del alcance del catálogo.

## Venta online

Audítala aparte de la identidad:

- `sí`: existe hoy un pedido remoto concreto y utilizable.
- `no`: se ha revisado y solo hay venta física o información sin aceptación de pedidos.
- `no comprobado`: la evidencia es insuficiente o el canal puede estar fallando temporalmente.

`Canal de venta` solo se rellena con `sí`:

- `ecommerce`: carrito y checkout funcional;
- `whatsapp`, `email` o `telefono`: la entidad acepta pedidos explícitamente por ese medio;
- `suscripcion`: cesta o entrega recurrente activa;
- `marketplace`: ficha vigente y comprable en la tienda **propia del productor o
  en la oficial de su DO/colectivo**. La reventa por tiendas de terceros
  independientes (vinotecas, marketplaces genéricos como Vinissimus/Bodeboca) **no**
  basta para `sí` → `no comprobado` salvo que se confirme canal propio o colectivo.

Combina canales con `|`. No prueban venta remota una web, catálogo, precios, tienda vacía, texto legal,
publicación histórica, tienda física ni venta exclusiva de visitas o merchandising.

Revisa todos los `sí`; los heredados sin canal están en cuarentena (ver Arranque de provincia). En
cierres profundos revisa también `no` y `no comprobado`, porque pueden ocultar pedidos por contacto
directo. Un fallo temporal justifica `no comprobado`, no necesariamente `no`.

**Webs difíciles.** Muchas webs de productor —cellers en especial— bloquean el fetch por age-gate,
Cloudflare o TLS; un fetch fallido no prueba que no haya tienda. Antes de cerrar en `no`/`no
comprobado`, busca `"<nombre>" tienda online comprar` y prueba dominios de marca aparte
(`botiga.<marca>.com`, `<marca>-shop.com`). Distingue canal propio de terceros al rellenar el canal.

## Deduplicación

Normaliza acentos, mayúsculas y separadores. Compara nombre/marca, dominio, teléfono, correo, dirección,
coordenadas, `place_id` y razón social.

Coincidir en varios identificadores suele señalar una entidad o dos marcas del mismo operador. Conserva
el `slug` correcto más estable y fusiona solo si representan la misma unidad productiva.

No fusiones automáticamente cooperativa y socio, secciones productivas distintas, negocios contiguos
o productores que comparten finca, mercado o centroide. `grep -i` no pliega acentos y no sirve como
único control.

## Ubicación

- Contrasta `municipio`, `direccion`, `lat` y `lon` conjuntamente.
- `municipio` es el de la unidad productiva —no la sede administrativa o postal— y usa el nombre
  oficial INE; pedanías y localidades van a su municipio (la localidad cabe en `direccion`). Si el
  slug codifica la grafía corregida, renómbralo con registro `merge`.
- Si geocodificas, limita a España, respeta el servicio usado y valida contra el centroide municipal.
- Hasta 15 km es la banda esperada; 15–100 km requiere revisión —en municipios extensos puede ser
  artefacto del centroide único: anótalo, no fuerces coordenadas—; más de 100 km bloquea el contrato.
- Si el centroide corresponde a un homónimo territorial, corrige
  `data/reference/municipios-overrides.json`; no muevas productores correctos.
- Si una dirección no resuelve, conserva el centroide. Coordenadas iguales o próximas son una alerta,
  no una orden de fusionar.

## Imágenes

Revísalas después de estabilizar identidad y `slug`. Prefiere logo o imagotipo oficial.

`npx pnpm enrich:images --provincia [provincia]` sirve para explorar. Usa `--apply --slug [slug]` solo
tras inspeccionar el candidato. No aceptes banners, iconos, ayudas públicas, imágenes ajenas ni el
primer resultado por puntuación.

### Formato y composición

- Activo preferido: **1600x1200 WebP** (4:3 horizontal), calidad `>= 88`, en
  `/productores/<comunidad>/<provincia>/<slug>.webp`. Otros formatos del contrato valen, pero usa
  `.webp` en activos nuevos.
- Fondo plano `#F3F0E8`; logo centrado con ~10% de margen por lado y lado largo en torno a 960 px o
  menos. No estires el logo para rellenar el lienzo.

### Fuente visual

Prioridad de búsqueda, deteniéndote en el primer activo usable:

1. Logo PNG/JPG en la web oficial.
2. `og:image` de la web oficial si muestra marca.
3. Foto de perfil de Instagram/Facebook oficial.
4. Favicon de alta resolución.
5. Fuentes reputadas (DOP/IGP, turismo, prensa) solo si los canales propios no ofrecen nada usable.

Prefiere marca sobre foto de producto; foto propia solo si no hay logo usable o si es parte
reconocible de la identidad. Nada de stock, IA, competidores ni portales genéricos.

### Calidad y tratamiento

- No escales más de **3x** el lado largo (se ve borroso); tras superar `1.2x`, aplica enfoque suave.
- En logos JPG sin alfa puedes volver transparente el blanco casi puro (`R,G,B >= 240`) antes de
  componer; nunca en fotografías.
- Fuente menor de ~200 px de lado largo: deja el logo pequeño pero nítido o usa foto propia
  representativa; anótalo en el cambio.

### Naming y tooling

- Archivo = `slug` del CSV y path por provincia (ver Formato). Un activo por productor; sin variantes
  ni originales de trabajo en `public/`. Si el destino canónico no coincide con el CSV stem, pasa
  `--asset-provincia <comunidad>/<provincia>`.
- El script no escribe nada por defecto: revisa candidato, score, dimensiones y URL; aplica solo por
  `--slug`, y `--allow-photos` únicamente cuando una foto propia sea el fallback buscado.
- Herramientas opcionales, solo al enriquecer: `python3 -m pip install -r scripts/requirements-image-tools.txt`.
- Cierra cambios de imagen con `npx pnpm check:images`.

## Disciplina de contexto

- No leas todo el CSV para editar unas filas.
- No leas ni reformatees todo el JSONL: busca el `slug` y sustituye una sola línea.
- El roster `list:province` de una provincia grande (Barcelona, Madrid) también llena el contexto:
  acótalo con `--categoria`/`--pendientes` o `rg`, no lo vuelques entero.
- No releas este documento completo en cada lote; conserva solo las secciones aplicables.
- De un doc provincial con plan de lotes, lee estado, reglas provinciales y tu lote; no el ledger entero.
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

El JSONL registra de forma estructurada fuente, fecha, claims y decisión. El mensaje de commit o ledger
provincial debe limitarse a lo necesario para reanudar:

- lote y fecha;
- verificadas, parciales y purgas;
- fusiones o correcciones relevantes;
- residuales y motivo.

No dupliques en narrativa cada fuente rutinaria que ya está en el JSONL. Documenta explicación fina
solo para purgas, fusiones, dudas residuales y excepciones que otro agente podría interpretar de forma
distinta.

## Pasada de consistencia al cerrar una pasada provincial

Esta pasada es provincial, no necesaria tras cada lote:

1. Concilia filas, estados, venta, canales, imágenes y evidencia.
2. Comprueba dependencias: `sí`/canal; `ecommerce`/web; `email`/correo;
   `telefono|whatsapp`/teléfono; horarios/campo referido.
3. Repite deduplicación y revisa colisiones geográficas.
4. Audita identidad de enlaces y todos los `Venta online=sí`.
5. Revisa residuales `parcial` y `no comprobado`.
6. Revisa diff, LF, imágenes, evidencia y ejecuta `npx pnpm verify:data`.

Una **pasada** de revisión se cierra cuando no quedan `pendiente`, cada residual tiene una razón
conocida y las afirmaciones dinámicas se han comprobado; entonces la provincia entra en mantenimiento.
Añadir la provincia a `data/evidence/coverage.json` la marca como cobertura completa de evidencia
(advisory: `check:evidence` no bloquea), pero no congela el catálogo ni cierra el CSV.

## Mantenimiento y pasadas sucesivas

El CSV nunca se «cierra»: es un catálogo vivo. Una pasada sobre provincia ya revisada refresca lo que
caduca sin re-derivar lo estable, con la misma mecánica de lotes, flags y validación. La worklist se
imprime: `npx pnpm check:evidence:freshness` ordena las filas por riesgo y antigüedad de evidencia, y
`npx pnpm check:links --provincia [provincia]` hace el triaje de enlaces (ambos solo informan):

- **Lee la evidencia antes de re-investigar.** La línea JSONL dice qué se comprobó, con qué fuente y
  cuándo. Identidad y municipio se reutilizan salvo señal de cambio; lo que envejece es actividad,
  venta, enlaces e imágenes.
- **Orden por defecto**, por riesgo y antigüedad de la evidencia: residuales `parcial` (primero con
  candidato de purga anotado); `sí` con evidencia más vieja y `sí` sin canal; `no comprobado` con web
  o contacto propio; enlaces que ya no pertenezcan a la entidad; backlog de imágenes.
- **Re-auditoría completa solo con disparador:** contradicción con la evidencia previa, cambio de
  dominio o titularidad, señal de cierre. Un refresco de venta no re-prueba identidad: conserva los
  claims previos al reescribir el registro (Flujo mínimo, paso 5).

## Documento provincial opcional

Para una pasada provincial completa, crea `docs/verificacion/[provincia].md` con el plan de lotes;
para trabajos menores, solo si el CSV y este manual no bastan para reanudar. Incluye:

- snapshot y plan de lotes (slugs congelados y flags por fila);
- fuentes locales y sus límites;
- excepciones territoriales;
- residuales justificados;
- referencia al historial Git.

No copies este manual ni conviertas el ledger en otra base de datos. Las pistas no aceptadas siguen en
`docs/candidates/[provincia].md`.
