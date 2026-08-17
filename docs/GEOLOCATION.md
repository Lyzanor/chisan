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

### Estado de una pasada

No describas una geolocalización como `completa` sin precisar su alcance:

- `revisada`: cada fila terminó clasificada con una precisión de trabajo o como
  `sin-fuente`, aunque pueda seguir sin coordenadas;
- `cubierta`: todas las filas tienen `lat`/`lon`, incluidas las que conservan un
  punto aproximado `localidad` o `centroide`;
- `exacta`: todas las filas representan una unidad productiva aceptada con
  precisión `publicada`, `direccion` o `poi`; no quedan aproximaciones ni
  `sin-fuente`.

Una pasada puede estar revisada y cubierta sin ser exacta. Informa siempre del
estado junto con los recuentos de coordenadas vacías, fallbacks y revisiones
omitidas por falta de referencia municipal.

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

## Enlace público de Google Maps

El enlace público es una salida de la misma revisión geográfica, no un
enriquecimiento independiente. `direccion`, `lat`/`lon` y `Google Maps` deben
resolver la misma unidad y el mismo rol. No enlaces una tienda, oficina,
alojamiento o ficha homónima cuando la fila y sus coordenadas representan la
unidad productiva.

Publica el enlace según el resultado aceptado:

| Resultado de la revisión | Valor de `Google Maps` |
|---|---|
| Ficha de Google contrastada con la unidad | URL canónica con nombre/dirección y `query_place_id`. |
| Sin ficha propia de la unidad, aunque haya coordenadas exactas | Vacío; conserva `lat`/`lon` para el mapa de KM0. |
| Ficha de una tienda, oficina u otra unidad distinta; rol dudoso o identidad no resuelta | Vacío. |

Usa una [Maps URL](https://developers.google.com/maps/documentation/urls/get-started)
universal y codificada:

```text
https://www.google.com/maps/search/?api=1&query=<NOMBRE>%2C<DIRECCION>&query_place_id=<PLACE_ID>
```

`query_place_id` es el ancla que abre la ficha aceptada; `query` es obligatorio y
solo actúa como fallback si Google deja de resolver ese identificador. Incluye el
nombre público y, cuando ayude a desambiguar, la dirección o el municipio. Un
`query=lat,lon` sin Place ID abre únicamente un pin y no demuestra ni muestra la
ficha del productor: no lo publiques en `Google Maps`, aunque el punto sea
exacto. La posición sigue perteneciendo a `lat`/`lon` y el mapa interno la puede
usar sin convertirla en un enlace externo.

Una búsqueda textual construida con nombre o dirección es solo una consulta de
revisión: aunque hoy devuelva el candidato esperado, no fija un resultado y no
debe publicarse como ubicación resuelta. Tampoco uses como forma canónica enlaces
cortos `maps.app.goo.gl` ni URLs largas copiadas de la interfaz; conserva el
identificador de lugar explícito y auditable cuando exista.

Para un lote pequeño, localiza el identificador con el buscador manual enlazado
desde la documentación de Place IDs. Para un lote repetible, un adaptador puede
consultar Places Text Search solicitando solo `places.id` a partir del nombre,
dirección revisada y país. En ambos casos el ID sigue siendo un candidato:
construye la URL canónica, abre la ficha y contrasta identidad, dirección, rol y
otro dato independiente antes de aplicarlo. No reutilices automáticamente como
`lat`/`lon` otros campos devueltos por Google sin comprobar antes sus términos de
almacenamiento.

Los Place IDs pueden almacenarse y reutilizarse, pero Google recomienda
[refrescarlos cuando superan los doce meses](https://developers.google.com/maps/documentation/places/web-service/place-id).
La renovación vuelve a pasar por revisión editorial: un identificador obsoleto,
un traslado o una ficha fusionada no autorizan a aceptar automáticamente el
nuevo resultado.

Los enlaces heredados sin Place ID forman una cola de migración, no una fuente
de fichas. Localízalos por país o área con:

```bash
npx pnpm check:defects --check maps-sin-ficha --country <iso> --list
npx pnpm check:defects --check maps-sin-ficha --area <area> --list
```

Para cada fila, sustituye el enlace solo después de abrir y contrastar una ficha
de la misma unidad. Si no existe, vacía `Google Maps` y conserva las coordenadas
correctas; no enlaces una tienda para evitar dejar el campo vacío. Registra la
revisión en evidencia cuando resuelva o cambie una decisión publicada.

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
Una Maps URL solo es fuente `google-maps` cuando se abrió y revisó la ficha
concreta. Una búsqueda textual generada no demuestra su resultado; un enlace de
coordenadas generado a partir de otro proveedor tampoco convierte a Google en
fuente de `location`.
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
- **cambios quirúrgicos**: solo `lat`/`lon`, `Google Maps` y, cuando proceda,
  evidencia;
- **sin fuente oculta**: el CSV sigue siendo el estado publicado y la evidencia,
  la procedencia; cachés e informes son artefactos de trabajo;
- **benchmark**: ocultar coordenadas conocidas y medir por país acierto de
  municipio, dirección, distancia y falsos positivos antes de adoptar un motor.

Ese límite afecta a la aplicación automática. Durante la revisión humana se
puede incorporar un dato incidental que la fuente ya abierta confirme de forma
directa, siguiendo el flujo general de `AGENTS.md` y dejando la procedencia que
corresponda. El geocodificador no debe recolectar ni aplicar automáticamente
campos vecinos.

La cola debe distinguir `direccion`, `poi`, `localidad`, `centroide` y
`sin-fuente`. La ausencia de coordenadas es una señal de cobertura, no un defecto
automático: algunas filas terminarán correctamente vacías.

El informe por candidato debería incluir `slug`, consulta y variante, proveedor,
fecha, identificador, etiqueta devuelta, `lat`/`lon`, precisión, rol de la
instalación, componente más profundo confirmado, componentes no resueltos,
coincidencias de dirección, distancia al centroide, Place ID y Maps URL pública
propuesta cuando existan, y motivos de revisión. El cache debe permitir reanudar
una pasada sin consultar de nuevo y cambiar de proveedor sin cambiar el formato
del informe.

## Cierre de una pasada

1. Revisa la identidad y dirección productiva de cada `slug` aceptado.
2. Comprueba el diff: las coordenadas no deben arrastrar cambios de otros campos
   salvo una corrección editorial o un enriquecimiento incidental explícito y
   justificado.
3. Ejecuta `npx pnpm check:csv:changed` durante la iteración.
4. Si se añadió evidencia, ejecuta `npx pnpm check:evidence:changed`.
5. Cierra el lote con `npx pnpm verify:data`.

Lee siempre los recuentos de fallbacks y municipios omitidos. Un resultado verde
demuestra coherencia estructural, no cobertura completa ni posición exacta.
Declara el cierre como `revisada`, `cubierta` o `exacta` según las definiciones
anteriores.
