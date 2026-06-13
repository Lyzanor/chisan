# Técnicas de verificación de catálogos provinciales

Manual operativo para revisar `data/csv/[comunidad]/[provincia].csv`. `AGENTS.md` y
`docs/CSV_CONTRACT.md` contienen el contrato; aquí se define el criterio editorial.

La fuente de verdad es el CSV. Un ledger provincial, si existe, solo guarda fuentes locales,
excepciones y progreso.

## Cómo usar este documento

Lee siempre **Reglas duras**, **Flujo mínimo** y **Decisión por fila**. Consulta las demás secciones
solo cuando el lote incluya venta online, duplicados, ubicación, imágenes o cierre provincial.

El agente puede elegir herramientas, fuentes, orden y tamaño de lote. Debe emplear el método menos
costoso que produzca evidencia suficiente y detener la investigación cuando la decisión ya sea sólida.
Solo las reglas duras, los valores del contrato y la validación son obligatorios; prioridades y
técnicas son heurísticas que el agente puede adaptar al caso.

## Reglas duras

1. **No confíes en los datos heredados.** Web, redes, Maps y venta pueden estar autocompletados o mal.
2. **No inventes.** Vacío es mejor que falso.
3. **Elimina enlaces ajenos.** Un HTTP 200 de otra entidad es desinformación.
4. **Un fallo técnico no prueba una baja.** Contrasta timeout, TLS, DNS o bloqueo por otra vía.
5. **No purgues con evidencia débil.** Exige duplicidad, fuera de alcance/provincia, baja clara o
   ausencia suficientemente contrastada.
6. **Las afirmaciones dinámicas requieren evidencia actual.** Especialmente actividad y venta.
7. **No inventes precisión geográfica.** Un centroide honesto es preferible a un punto conjeturado.
8. **Mantén estable el `slug`.** Solo desaparece al purgar o fusionar justificadamente.

## Flujo mínimo

1. **Protege el trabajo existente**

   ```bash
   git status --short
   npx pnpm list:province [provincia]   # acótalo en provincias grandes (ver Disciplina de contexto)
   ```

   Evita abrir en paralelo una provincia ya activa. Para una fila concreta, localízala con `rg` y lee
   solo su ventana; no cargues el CSV completo.

2. **Define un lote útil**

   Agrupa por municipio, zona, categoría, fuente o riesgo. No hay tamaño obligatorio: usa el menor lote
   que permita compartir contexto sin mezclar decisiones.

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

   Usa un parser CSV, preserva LF y toca solo los `slug` del lote. Al purgar, elimina su imagen
   referenciada y actualiza la nota de candidatos afectada.

6. **Valida**

   ```bash
   npx pnpm check:csv:changed
   git diff --check
   git diff -- data/csv/[comunidad]/[provincia].csv
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
- `marketplace`: ficha vigente y comprable en un tercero.

Combina canales con `|`. No prueban venta remota una web, catálogo, precios, tienda vacía, texto legal,
publicación histórica, tienda física ni venta exclusiva de visitas o merchandising.

Revisa todos los `sí`. En cierres profundos revisa también `no` y `no comprobado`, porque pueden ocultar
pedidos por contacto directo. Un fallo temporal justifica `no comprobado`, no necesariamente `no`.

## Deduplicación

Normaliza acentos, mayúsculas y separadores. Compara nombre/marca, dominio, teléfono, correo, dirección,
coordenadas, `place_id` y razón social.

Coincidir en varios identificadores suele señalar una entidad o dos marcas del mismo operador. Conserva
el `slug` más estable y fusiona solo si representan la misma unidad productiva.

No fusiones automáticamente cooperativa y socio, secciones productivas distintas, negocios contiguos
o productores que comparten finca, mercado o centroide. `grep -i` no pliega acentos y no sirve como
único control.

## Ubicación

- Contrasta `municipio`, `direccion`, `lat` y `lon` conjuntamente.
- Si geocodificas, limita a España, respeta el servicio usado y valida contra el centroide municipal.
- Hasta 15 km es la banda esperada; 15–100 km requiere revisión; más de 100 km bloquea el contrato.
- Si el centroide corresponde a un homónimo territorial, corrige
  `data/reference/municipios-overrides.json`; no muevas productores correctos.
- Si una dirección no resuelve, conserva el centroide. Coordenadas iguales o próximas son una alerta,
  no una orden de fusionar.

## Imágenes

Revísalas después de estabilizar identidad y `slug`. Prefiere logo o imagotipo oficial.

`npx pnpm enrich:images --provincia [provincia]` sirve para explorar. Usa `--apply --slug [slug]` solo
tras inspeccionar el candidato. No aceptes banners, iconos, ayudas públicas, imágenes ajenas ni el
primer resultado por puntuación.

## Disciplina de contexto

- No leas todo el CSV para editar unas filas.
- El roster `list:province` de una provincia grande (Barcelona, Madrid) también llena el contexto:
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

El mensaje de commit o ledger, si existe, debe permitir reanudar sin copiar la investigación:

- lote y fecha;
- verificadas, parciales y purgas;
- fusiones o correcciones relevantes;
- residuales y motivo.

No enumeres cada fuente rutinaria. Documenta evidencia fina solo para purgas, fusiones, dudas
residuales y excepciones que otro agente podría interpretar de forma distinta.

## Pasada de consistencia antes de cerrar una provincia

Esta pasada es provincial, no necesaria tras cada lote:

1. Concilia filas, estados, venta, canales e imágenes.
2. Comprueba dependencias: `sí`/canal; `ecommerce`/web; `email`/correo;
   `telefono|whatsapp`/teléfono; horarios/campo referido.
3. Repite deduplicación y revisa colisiones geográficas.
4. Audita identidad de enlaces y todos los `Venta online=sí`.
5. Revisa residuales `parcial` y `no comprobado`.
6. Revisa diff, LF, imágenes y ejecuta `npx pnpm verify:data`.

Una provincia está cerrada cuando no quedan `pendiente`, cada residual tiene una razón conocida y las
afirmaciones dinámicas se han comprobado. Después entra en mantenimiento.

## Documento provincial opcional

Crea `docs/[provincia]-verificacion.md` solo si el CSV y este manual no bastan para reanudar. Incluye:

- snapshot y worklist;
- fuentes locales y sus límites;
- excepciones territoriales;
- residuales justificados;
- referencia al historial Git.

No copies este manual ni conviertas el ledger en otra base de datos. Las pistas no aceptadas siguen en
`docs/candidates/[provincia].md`.
