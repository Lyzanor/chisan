# Geolocalización de productores

Manual para buscar, revisar y mantener coordenadas de productores. El contrato
de `lat`/`lon`, sus rangos y la validación por distancia viven en
`docs/CSV_CONTRACT.md` § Geography contract; la procedencia de una decisión se
registra según `docs/EVIDENCE_CONTRACT.md`.

La coordenada representa la unidad productiva publicada por la fila: granja,
bodega, obrador, fábrica, almazara o instalación equivalente. No representa por
defecto la sede social, una tienda, un distribuidor, una oficina ni el centro
del municipio. Una celda vacía es conocimiento incompleto y recuperable; un
punto convincente pero equivocado se publica como si fuera verdad.

Actualmente no hay un geocodificador de productores en el repositorio.
`scripts/build-municipality-centroids.js` mantiene la referencia municipal y
`scripts/audit-csv.js` valida puntos ya elegidos, pero ninguno encuentra la
unidad productiva. La sección de tooling de este documento define el mecanismo
que debe implementar una futura herramienta sin convertir sus candidatos en
fuente de verdad.

## Qué demuestra cada pieza

Separa siempre tres afirmaciones:

1. **La fuente de ubicación** vincula al productor con una dirección, finca,
   paraje o punto publicado.
2. **El geocodificador** traduce esa descripción a uno o varios candidatos. No
   demuestra que la dirección sea correcta ni que allí se produzca.
3. **La revisión editorial** identifica cuál de esos candidatos, si alguno,
   corresponde a la unidad productiva de la fila.

El rol del lugar es parte de esa decisión. Clasifícalo como `productiva`,
`oficina`, `venta`, `hosteleria` o `desconocida`; no deduzcas `productiva` por
tener una dirección exacta o el nombre correcto. Si una fuente separa oficina,
finca, bodega, fábrica o alojamiento, conserva esa distinción durante toda la
revisión.

Una ficha de Maps puede apoyar `location`, pero no prueba por sí sola actividad
actual. Un registro puede probar municipio o dirección sin ofrecer coordenadas
precisas. La proximidad al centro municipal descarta errores gruesos; tampoco
demuestra identidad.

## Fuente y punto buscado

Estabiliza primero `nombre`, `slug`, `municipio` y la identidad de la unidad.
Busca después, por orden, deteniéndote cuando la precisión sea suficiente:

1. Coordenadas o pin publicados por el productor para la unidad productiva.
2. Dirección productiva publicada por el productor, geocodificada con un
   servicio oficial o claramente fiable.
3. Dirección productiva de un registro, consejo o directorio institucional,
   contrastada con la identidad pública del productor.
4. POI específico del productor cuya dirección, teléfono, dominio u otro dato
   independiente permita resolver la identidad.
5. Centroide municipal como fallback explícitamente aproximado.

No sustituyas la dirección fuente por la versión normalizada de un geocodificador
sin comprobarla: el motor puede omitir un número, cambiar una localidad menor o
devolver una calle homónima. Si una marca tiene varias plantas, localiza la que
justifica la fila y su área. Si la fila agrega varias unidades y no existe un
punto representativo honesto, resuelve antes la identidad o deja las coordenadas
vacías.

Una explotación dispersa o móvil —colmenares, flota pesquera, pastoreo— puede no
tener un único punto productivo público. Usa sus instalaciones o domicilio
público solo cuando la fuente los vincule con la actividad; en otro caso,
conserva el municipio y usa un fallback aproximado o deja el punto vacío.

## Consulta y candidatos

- Usa WGS84 en grados decimales y limita la consulta por el código de país.
- Incluye calle, número, código postal, localidad, municipio y país cuando la
  fuente los publique. No inventes los componentes ausentes.
- Consulta dirección y nombre comercial por separado cuando mezclarlos empeore
  el resultado; después cruza ambos candidatos por identidad.
- Prueba variantes normalizadas de la dirección solo cuando sean explicables:
  tipo de vía, formato del número, alfabeto o jerarquía postal. Conserva qué
  variante produjo el candidato y no conviertas la normalización en una
  corrección automática del CSV.
- Usa región, área o centroide municipal para acotar o priorizar, nunca para
  convertir el resultado más cercano en correcto.
- Conserva la consulta exacta, el proveedor, la fecha, el identificador estable
  del candidato cuando exista, la dirección devuelta y la precisión declarada.
- Compara la jerarquía que usa el país, no una plantilla universal de
  calle/número: registra el componente más profundo confirmado y cuáles quedaron
  sin resolver. Un bloque, parcela o `banchi` truncado no equivale a un portal
  exacto.
- Cachea respuestas por proveedor y consulta normalizada. Repetir la misma
  petición desperdicia cuota y hace que una revisión deje de ser reproducible.

La salida de un proveedor debe clasificarse, como mínimo, en una de estas
precisiones de trabajo. No son nuevos valores del CSV:

| Precisión | Significado editorial |
|---|---|
| `publicada` | La fuente de la unidad publica el punto o un pin inequívoco. |
| `direccion` | Calle y número coinciden con una dirección productiva confirmada. |
| `poi` | El POI coincide por identidad y por otro dato independiente. |
| `interpolada` | El número se estima sobre una vía; requiere revisión explícita. |
| `localidad` | Solo resuelve paraje, código postal o núcleo; es aproximada. |
| `centroide` | Copia el centroide del municipio; nunca es una posición exacta. |

La puntuación ordena candidatos; no los aprueba. Un `poi` con el nombre correcto
puede ser una tienda, y una coincidencia perfecta de calle y número puede ser la
sede de una sociedad que produce en otro lugar.

## Decisión de aceptación

Acepta un candidato exacto solo cuando coincidan el país y el área, el
`municipio` sea compatible con las reglas del país y se cumpla al menos uno de
estos criterios:

- la fuente publica directamente el punto de la unidad productiva;
- calle y número coinciden con una dirección productiva confirmada;
- el POI se enlaza con el productor por dirección más teléfono, dominio, marca
  u otro identificador suficientemente distintivo.

Revisa manualmente resultados interpolados, direcciones sin número, carreteras,
polígonos, fincas, parajes, homónimos y municipios extensos. Rechaza el candidato
si resuelve una sede, tienda, alojamiento o unidad diferente, aunque quede dentro
del mismo municipio. Un portal corporativo exacto con rol productivo no probado
es un rechazo, no un candidato de alta confianza. No compenses una duda moviendo
el punto hacia el centroide.

La auditoría aplica una segunda defensa:

- más de `15 km` y hasta `100 km` desde el centroide: advertencia accionable;
- más de `100 km`: error bloqueante;
- municipio ausente de la referencia: revisión omitida, no superada;
- coincidencia con el centroide: fallback contabilizado como aproximado.

Una distancia válida no convierte un candidato en correcto. Cuando unas
coordenadas exactas choquen con un centroide incorrecto o ambiguo, corrige
`data/reference/municipality-overrides.json` o la referencia; nunca las
coordenadas correctas.

## Fallback municipal

El centroide es adecuado cuando la fuente solo permite afirmar municipio y un
punto aproximado sigue siendo útil para el mapa. Cópialo desde
`data/reference/municipalities.json`; no lo reconstruyas con otra fuente ni con
una búsqueda textual. Para homónimos dentro de un país usa el override regional.

No existe fallback si el municipio no está en la referencia o si el nombre es
ambiguo sin override. Corrige la referencia solo cuando puedas identificar el
municipio actual de forma inequívoca. El centroide apoya el encuadre municipal,
no una dirección, una finca ni un acceso físico.

## Proveedores, almacenamiento y atribución

Elige proveedor y orden de consulta por país y por tipo de dirección. Un servicio
nacional puede preceder al fallback global cuando el benchmark demuestre mejor
cobertura para la jerarquía local. El `AGENTS.md` del país puede fijar ese
servicio, sus campos decisivos y sus falsos positivos; esa regla no se hereda
automáticamente a otros países.

Antes de automatizar un proveedor confirma:

- que permite geocodificación por lotes o el volumen previsto;
- que permite almacenar y publicar permanentemente las coordenadas;
- sus límites, identificación de cliente, caché y atribución;
- el sistema de referencia y la precisión que declara;
- que puede sustituirse sin cambiar el flujo editorial.

La API pública de Nominatim es apta solo para uso deliberado y pequeño bajo su
[política de uso](https://operations.osmfoundation.org/policies/nominatim/):
identificación válida, caché, una única máquina e hilo y como máximo una petición
por segundo; el trabajo masivo o periódico debe usar un proveedor adecuado o
una instancia propia. Las APIs de Google restringen en general el almacenamiento
de resultados; un pin público puede servir para revisión, pero no conviertas su
respuesta en la base persistente del CSV sin comprobar los
[términos de Geocoding](https://developers.google.com/maps/documentation/geocoding/policies).

## Evidencia

Cuando unas coordenadas se decidan durante un alta, re-verificación o corrección
material, prefiere un registro `keep` cuya fuente lleve el claim `location`.
La fuente que publica la dirección y la consulta del geocodificador pueden ser
dos entradas distintas: ninguna debe recibir claims que no demuestra.

Usa `type: "google-maps"` para una ficha de Maps y `type: "other"` para un
geocodificador que no tenga tipo propio. Una nota de fuente puede registrar una
excepción relevante —número interpolado, POI contrastado, carretera o paraje—.
Anota a nivel de decisión únicamente conflictos duraderos, instalaciones
múltiples o el motivo de una distancia geográfica inusual. No dupliques en el
ledger la consulta y precisión si una futura herramienta ya las conserva en su
artefacto de revisión.

## Contrato para el tooling

Una herramienta de geocodificación de productores debe seguir el mismo patrón
seguro que `enrich:images`:

- **lectura por defecto**: inventaría filas sin coordenadas y genera candidatos;
- **alcance explícito**: país, área o `slug`, sin aplicar todo el catálogo;
- **adaptadores sustituibles**: proveedor oficial por país y fallback global;
- **caché local**: respuestas crudas y consultas normalizadas fuera del producto;
- **ranking explicable**: coincidencias y conflictos por componente, precisión
  declarada, rol de la instalación y distancia municipal;
- **revisión visible**: dirección fuente y candidatos sobre mapa antes de elegir;
- **aplicación explícita**: un `slug` y un candidato aceptado cada vez;
- **cambios quirúrgicos**: solo `lat`/`lon` y, cuando proceda, evidencia;
- **sin fuente oculta**: el CSV sigue siendo el estado publicado y la evidencia,
  la procedencia; cachés e informes son artefactos de trabajo;
- **benchmark**: ocultar coordenadas conocidas y medir por país acierto de
  municipio, dirección, distancia y falsos positivos antes de adoptar un motor.

La cola debe distinguir `direccion`, `poi`, `localidad`, `centroide` y
`sin-fuente`. La ausencia de coordenadas es una señal de cobertura, no un defecto
automático: algunas filas terminarán correctamente vacías.

El informe por candidato debería incluir `slug`, consulta y variante, proveedor,
fecha, identificador, etiqueta devuelta, `lat`/`lon`, precisión, rol de la
instalación, componente más profundo confirmado, componentes no resueltos,
coincidencias de dirección, distancia al centroide y motivos de revisión. El
cache debe permitir reanudar una pasada sin consultar de nuevo y cambiar de
proveedor sin cambiar el formato del informe.

## Cierre de una pasada

1. Revisa la identidad y dirección productiva de cada `slug` aceptado.
2. Comprueba el diff: las coordenadas no deben arrastrar cambios de otros campos
   salvo una corrección editorial justificada.
3. Ejecuta `npx pnpm check:csv:changed` durante la iteración.
4. Si se añadió evidencia, ejecuta `npx pnpm check:evidence:changed`.
5. Cierra el lote con `npx pnpm verify:data`.

Lee siempre los recuentos de fallbacks y municipios omitidos. Un resultado verde
demuestra coherencia estructural, no cobertura completa ni posición exacta.
